import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Grid, Difficulty, CellData, AppSettings } from './types';
import { generateSudoku, checkWin, getValidCandidates, clearNotesAround, getSmartHint, SmartHint } from './utils/sudoku';
import { 
    saveGame, loadGame, hasSavedGame, clearSavedGame, 
    updateStats, getStats, incrementGamesStarted,
    getSettings, saveSettings 
} from './utils/storage';
import { audioManager } from './utils/audio';
import SudokuCell from './components/SudokuCell';
import { Controls } from './components/Controls';
import { Header } from './components/Header';
import { Statistics } from './components/Statistics';
import { SmartHintModal } from './components/SmartHintModal';
import { SettingsModal } from './components/SettingsModal';
import { Trophy, Play, Star, Sparkles, Ban, BarChart3, Settings } from 'lucide-react';

// Max mistakes before loss
const MAX_MISTAKES = 3;

const App: React.FC = () => {
  // State
  const [grid, setGrid] = useState<Grid>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [hints, setHints] = useState(3);
  const [timer, setTimer] = useState(0);
  const [settings, setAppSettings] = useState<AppSettings>(getSettings());
  
  // Added 'stats' to status union type
  const [status, setStatus] = useState<'menu' | 'playing' | 'won' | 'lost' | 'stats'>('menu');
  const [showSettings, setShowSettings] = useState(false);
  
  const [isNoteMode, setIsNoteMode] = useState(false);
  const [history, setHistory] = useState<Grid[]>([]);
  const [canContinue, setCanContinue] = useState(false);
  
  // New state for Smart Help
  const [activeHint, setActiveHint] = useState<SmartHint | null>(null);

  // Refs for timer
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize Audio Settings on mount
  useEffect(() => {
    audioManager.updateSettings(settings);
  }, [settings]);

  // Check for saved game on mount
  useEffect(() => {
    setCanContinue(hasSavedGame());
  }, []);

  // Update settings handler
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setAppSettings(newSettings);
    saveSettings(newSettings);
  };

  // Initialize Game
  const startNewGame = useCallback((diff: Difficulty) => {
    incrementGamesStarted(); // Track new game start
    const { initialGrid, solvedGrid } = generateSudoku(diff);
    setGrid(initialGrid);
    setSolution(solvedGrid);
    setDifficulty(diff);
    setMistakes(0);
    setHints(3);
    setTimer(0);
    setStatus('playing');
    setHistory([]);
    setSelectedCell(null);
    setIsNoteMode(false);
    setActiveHint(null);
    clearSavedGame(); // Clear old save when starting new
    setCanContinue(false);
    
    // Ensure audio context starts if music is on
    audioManager.initAudioContext();
  }, []);

  // Continue Game
  const handleContinueGame = useCallback(() => {
    const saved = loadGame();
    if (saved) {
      setGrid(saved.grid);
      setSolution(saved.solution);
      setDifficulty(saved.difficulty);
      setMistakes(saved.mistakes);
      setHints(saved.hints);
      setTimer(saved.timer);
      setStatus('playing');
      setHistory([]); // History is not persisted to keep storage small
      setSelectedCell(null);
      setIsNoteMode(false);
      setActiveHint(null);
      
      audioManager.initAudioContext();
    }
  }, []);

  // Timer Logic
  useEffect(() => {
    if (status === 'playing') {
      timerRef.current = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    } else {
      stopTimer();
    }
    return () => stopTimer();
  }, [status]);

  // Auto-Save Logic
  useEffect(() => {
    if (status === 'playing') {
      // Debounce saving
      const timeoutId = setTimeout(() => {
        saveGame(grid, solution, difficulty, mistakes, hints, timer);
        setCanContinue(true);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else if (status === 'won' || status === 'lost') {
      clearSavedGame();
      setCanContinue(false);
    }
  }, [grid, mistakes, hints, timer, status, solution, difficulty]);

  // Game Over Logic (Loss)
  useEffect(() => {
    if (mistakes >= MAX_MISTAKES && status === 'playing') {
      updateStats('lost', difficulty, timer);
      setStatus('lost');
      audioManager.playSound('loss');
    }
  }, [mistakes, status, difficulty, timer]);

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Helper to deep clone grid for history/immutability
  const cloneGrid = (g: Grid): Grid => {
    return g.map(row => row.map(cell => ({
      ...cell,
      notes: new Set(cell.notes)
    })));
  };

  const saveToHistory = () => {
    setHistory(prev => {
        const newHistory = [...prev, cloneGrid(grid)];
        if (newHistory.length > 20) return newHistory.slice(newHistory.length - 20);
        return newHistory;
    });
  };

  const handleUndo = () => {
    if (history.length === 0 || status !== 'playing') return;
    const previousGrid = history[history.length - 1];
    setGrid(previousGrid);
    setHistory(prev => prev.slice(0, prev.length - 1));
    setActiveHint(null); // Clear hint on undo
    audioManager.playSound('click');
  };

  // Cell Interaction
  const handleCellClick = useCallback((row: number, col: number) => {
    if (status !== 'playing') return;
    setSelectedCell([row, col]);
    // Soft click sound on selection
    audioManager.playSound('click');
  }, [status]);

  // Input Logic
  const handleNumberInput = useCallback((num: number) => {
    if (status !== 'playing' || !selectedCell) return;
    const [r, c] = selectedCell;
    const cell = grid[r][c];

    if (cell.isInitial) return;

    saveToHistory();

    const newGrid = cloneGrid(grid);
    const currentCell = newGrid[r][c];

    if (isNoteMode) {
      if (currentCell.notes.has(num)) {
        currentCell.notes.delete(num);
      } else {
        currentCell.notes.add(num);
      }
      setGrid(newGrid);
      audioManager.playSound('pencil');
    } else {
      if (currentCell.value === num) return;

      const isCorrect = solution[r][c] === num;
      
      currentCell.value = num;
      currentCell.isError = !isCorrect;

      // Only clear notes if the move is correct.
      // If incorrect, we keep notes so they reappear if user deletes the wrong number.
      if (!isCorrect) {
        setMistakes(m => m + 1);
        setGrid(newGrid);
        audioManager.playSound('error');
      } else {
        // Correct move:
        // 1. Clear notes in the cell itself
        currentCell.notes.clear();
        
        // 2. Clear this number from notes in row, col, and box peers
        clearNotesAround(newGrid, r, c, num);
        
        // Check if we just filled the hint target
        if (activeHint && activeHint.row === r && activeHint.col === c && activeHint.value === num) {
            setActiveHint(null);
        }

        setGrid(newGrid);
        
        // DISTINCT CORRECT SOUND
        audioManager.playSound('correct');

        if (checkWin(newGrid)) {
          updateStats('won', difficulty, timer);
          setStatus('won');
          audioManager.playSound('win');
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#14b8a6', '#22c55e', '#facc15']
          });
        }
      }
    }
  }, [status, selectedCell, grid, isNoteMode, solution, difficulty, timer, activeHint]);

  const handleAutoNote = useCallback(() => {
    if (status !== 'playing') return;
    audioManager.playSound('pencil');
    saveToHistory();
    const newGrid = cloneGrid(grid);

    // Fill candidates for all empty cells
    for(let r=0; r<9; r++) {
        for(let c=0; c<9; c++) {
            if (!newGrid[r][c].value && !newGrid[r][c].isInitial) {
                const candidates = getValidCandidates(newGrid, r, c);
                newGrid[r][c].notes = new Set(candidates);
            }
        }
    }
    
    setGrid(newGrid);
  }, [status, grid]);

  const handleHint = useCallback(() => {
    if (status !== 'playing' || !selectedCell || hints <= 0) return;
    const [r, c] = selectedCell;

    if (grid[r][c].isInitial || grid[r][c].value === solution[r][c]) return;

    saveToHistory();
    const newGrid = cloneGrid(grid);
    const correctVal = solution[r][c];

    newGrid[r][c].value = correctVal;
    newGrid[r][c].isError = false;
    newGrid[r][c].notes.clear();

    clearNotesAround(newGrid, r, c, correctVal);
    
    setGrid(newGrid);
    setHints(h => h - 1);
    setActiveHint(null); // Clear active smart hint if user forces a regular hint
    
    audioManager.playSound('correct'); // Hint is also a correct move essentially

    if (checkWin(newGrid)) {
        updateStats('won', difficulty, timer);
        setStatus('won');
        audioManager.playSound('win');
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#14b8a6', '#22c55e', '#facc15']
        });
    }
  }, [status, selectedCell, hints, grid, solution, difficulty, timer]);

  const handleSmartHelp = useCallback(() => {
    if (status !== 'playing') return;
    audioManager.playSound('click');
    // Find a logical next move
    const hint = getSmartHint(grid);
    
    if (hint) {
        setActiveHint(hint);
        // Also select the cell to make it easier for user
        setSelectedCell([hint.row, hint.col]);
    } else {
        // Fallback for completely solved or error states (should not happen often)
        console.log("No hint found");
    }
  }, [status, grid]);

  const applySmartHint = useCallback(() => {
    if (!activeHint) return;
    const { row, col, value } = activeHint;
    
    // Use existing number input logic to ensure consistent behavior (checking validity, etc.)
    // We simulate selecting the cell and pressing the number
    setSelectedCell([row, col]);
    // Note: We can't directly call handleNumberInput because it depends on updated state if we just set selectedCell
    // So we manually do the grid update here similar to handleNumberInput or handleHint
    
    saveToHistory();
    const newGrid = cloneGrid(grid);
    const cell = newGrid[row][col];
    
    // Applying the smart hint is effectively a correct move (algorithm ensures validity)
    // But to be safe vs solution:
    if (solution[row][col] === value) {
        cell.value = value;
        cell.notes.clear();
        cell.isError = false;
        clearNotesAround(newGrid, row, col, value);
        
        setGrid(newGrid);
        setActiveHint(null);
        audioManager.playSound('correct');
        
        if (checkWin(newGrid)) {
            updateStats('won', difficulty, timer);
            setStatus('won');
            audioManager.playSound('win');
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#14b8a6', '#22c55e', '#facc15']
            });
        }
    } else {
        // Fallback if algorithm drifts from pre-generated solution (rare in valid sudokus)
        // Just treat as standard hint
        handleHint(); 
    }

  }, [activeHint, grid, solution, difficulty, timer, handleHint]);

  const handleDelete = () => {
    if (status !== 'playing' || !selectedCell) return;
    const [r, c] = selectedCell;
    if (grid[r][c].isInitial) return;

    audioManager.playSound('click');
    saveToHistory();
    const newGrid = cloneGrid(grid);
    newGrid[r][c].value = null;
    newGrid[r][c].isError = false;
    setGrid(newGrid);
  };

  const getCellProps = (r: number, c: number) => {
    const cell = grid[r][c];
    const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
    const isHintTarget = activeHint?.row === r && activeHint?.col === c;
    
    let isRelated = false;
    let isSameValue = false;

    if (selectedCell) {
      const [sr, sc] = selectedCell;
      const selectedValue = grid[sr][sc].value;
      
      if (r === sr || c === sc) isRelated = true;
      else {
        const startR = sr - (sr % 3);
        const startC = sc - (sc % 3);
        if (r >= startR && r < startR + 3 && c >= startC && c < startC + 3) isRelated = true;
      }

      if (cell.value !== null && selectedValue !== null && cell.value === selectedValue) {
        isSameValue = true;
      }
    }

    return { isSelected, isRelated, isSameValue, isHintTarget };
  };

  // View: Statistics
  if (status === 'stats') {
      return <Statistics stats={getStats()} onBack={() => {
          setStatus('menu');
          audioManager.playSound('click');
      }} />;
  }

  // View: Menu
  if (status === 'menu') {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center font-sans p-4 relative">
        {/* Settings Modal (available in menu) */}
        {showSettings && (
            <SettingsModal 
                settings={settings} 
                onUpdateSettings={handleUpdateSettings} 
                onClose={() => setShowSettings(false)} 
            />
        )}

        <div className="w-full max-w-md bg-white/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30 text-center animate-in fade-in zoom-in duration-500 relative">
           
           {/* Top Buttons Container */}
           <div className="absolute top-4 right-4 flex gap-2">
                <button 
                    onClick={() => {
                        setShowSettings(true);
                        audioManager.playSound('click');
                    }}
                    className="p-2 bg-white/10 hover:bg-white/30 rounded-full text-white transition-all hover:scale-110 active:scale-95"
                    aria-label="Ayarlar"
                >
                    <Settings size={24} />
                </button>
                <button 
                    onClick={() => {
                        setStatus('stats');
                        audioManager.playSound('click');
                    }}
                    className="p-2 bg-white/10 hover:bg-white/30 rounded-full text-white transition-all hover:scale-110 active:scale-95"
                    aria-label="İstatistikler"
                >
                    <BarChart3 size={24} />
                </button>
           </div>

           <div className="mb-8 mt-4">
              <h1 className="text-5xl font-black text-white tracking-tight drop-shadow-md mb-2">
                Zen<span className="text-teal-100">Sudoku</span>
              </h1>
              <p className="text-white/80 font-medium">Zorluk Seviyesi Seçin</p>
           </div>
           
           <div className="space-y-4">
             {canContinue && (
               <button 
                  onClick={() => {
                      handleContinueGame();
                      audioManager.playSound('click');
                  }}
                  className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-white font-bold text-xl rounded-2xl shadow-lg shadow-teal-500/30 hover:scale-105 transition-all flex items-center justify-center gap-3 border-2 border-teal-300/50"
               >
                  <Play size={24} fill="currentColor" /> DEVAM ET
               </button>
             )}

             <button 
                onClick={() => {
                    startNewGame('Easy');
                    audioManager.playSound('click');
                }}
                className="w-full py-4 bg-white/90 hover:bg-white text-emerald-600 font-bold text-xl rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-3"
             >
                <Sparkles size={24} /> KOLAY
             </button>
             <button 
                onClick={() => {
                    startNewGame('Medium');
                    audioManager.playSound('click');
                }}
                className="w-full py-4 bg-white/90 hover:bg-white text-amber-500 font-bold text-xl rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-3"
             >
                <Star size={24} /> ORTA
             </button>
             <button 
                onClick={() => {
                    startNewGame('Hard');
                    audioManager.playSound('click');
                }}
                className="w-full py-4 bg-white/90 hover:bg-white text-rose-600 font-bold text-xl rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-3"
             >
                <Trophy size={24} /> ZOR
             </button>
           </div>
        </div>
      </div>
    );
  }

  // View: Game / Won / Lost
  return (
    <div className="min-h-dvh flex flex-col items-center select-none font-sans">
      <Header 
        difficulty={difficulty} 
        mistakes={mistakes} 
        time={timer} 
        onExit={() => {
           // Save before quitting to menu manually
           if (status === 'playing') {
             saveGame(grid, solution, difficulty, mistakes, hints, timer);
             setCanContinue(true);
           }
           setStatus('menu');
           audioManager.playSound('click');
        }}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Game Board Container */}
      <div className="flex-grow flex items-center justify-center w-full px-4 py-2">
        <div className="relative w-full max-w-md aspect-square bg-white/30 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden p-2 border border-white/40">
          {/* Status Overlay */}
          {(status === 'won' || status === 'lost') && (
            <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300 rounded-3xl">
              <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-[80%]">
                {status === 'won' ? (
                  <>
                      <Trophy className="text-yellow-400 w-20 h-20 mb-4 drop-shadow-md animate-bounce" />
                      <h2 className="text-4xl font-black text-slate-800 mb-2">Harika!</h2>
                      <p className="text-slate-500 mb-6 font-medium">Bulmacayı başarıyla tamamladın.</p>
                  </>
                ) : (
                  <>
                      <Ban className="text-red-500 w-20 h-20 mb-4 drop-shadow-md animate-pulse" />
                      <h2 className="text-3xl font-black text-slate-800 mb-2">Oyun Bitti</h2>
                      <p className="text-slate-500 mb-6 font-medium">Hata limiti doldu.</p>
                  </>
                )}
                <div className="flex flex-col gap-3 w-full">
                    <button 
                    onClick={() => {
                        startNewGame(difficulty);
                        audioManager.playSound('click');
                    }}
                    className="w-full px-8 py-3 bg-teal-600 text-white font-bold rounded-full shadow-lg hover:bg-teal-700 active:scale-95 transition-all"
                    >
                    Tekrar Oyna
                    </button>
                    <button 
                    onClick={() => {
                        setStatus('menu');
                        audioManager.playSound('click');
                    }}
                    className="w-full px-8 py-3 bg-slate-200 text-slate-600 font-bold rounded-full shadow-md hover:bg-slate-300 active:scale-95 transition-all"
                    >
                    Menüye Dön
                    </button>
                </div>
              </div>
            </div>
          )}

          {/* Grid Render */}
          <div className="grid grid-cols-9 grid-rows-9 h-full w-full bg-teal-50/20 rounded-xl overflow-hidden shadow-inner">
            {grid.map((row, rIndex) => (
              row.map((cell, cIndex) => (
                <SudokuCell
                  key={`${rIndex}-${cIndex}`}
                  cell={cell}
                  {...getCellProps(rIndex, cIndex)}
                  onClick={() => handleCellClick(rIndex, cIndex)}
                />
              ))
            ))}
          </div>
        </div>
      </div>
      
      {/* Smart Help Modal */}
      <SmartHintModal 
         hint={activeHint} 
         onClose={() => setActiveHint(null)} 
         onApply={applySmartHint} 
      />
      
      {/* Settings Modal (available in game) */}
      {showSettings && (
        <SettingsModal 
            settings={settings} 
            onUpdateSettings={handleUpdateSettings} 
            onClose={() => setShowSettings(false)} 
        />
      )}

      <Controls 
        onNumberClick={handleNumberInput}
        onDelete={handleDelete}
        onUndo={handleUndo}
        onNoteToggle={() => {
            setIsNoteMode(!isNoteMode);
            audioManager.playSound('click');
        }}
        onHint={handleHint}
        onAutoNote={handleAutoNote}
        onHelp={handleSmartHelp}
        isNoteMode={isNoteMode}
        canUndo={history.length > 0}
        hintsRemaining={hints}
      />
    </div>
  );
};

export default App;