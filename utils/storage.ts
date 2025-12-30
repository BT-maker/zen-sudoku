import { Grid, SavedGameState, Difficulty, GameStatistics, AppSettings } from '../types';

const STORAGE_KEY = 'zen-sudoku-save';
const STATS_KEY = 'zen-sudoku-stats';
const SETTINGS_KEY = 'zen-sudoku-settings';

// Helper: Convert Grid (with Sets) to Serializable Grid (with Arrays)
const serializeGrid = (grid: Grid) => {
  return grid.map(row => 
    row.map(cell => ({
      ...cell,
      notes: Array.from(cell.notes)
    }))
  );
};

// Helper: Convert Serializable Grid (with Arrays) back to Grid (with Sets)
const deserializeGrid = (grid: any): Grid => {
  return grid.map((row: any) => 
    row.map((cell: any) => ({
      ...cell,
      notes: new Set(cell.notes)
    }))
  );
};

export const saveGame = (
  grid: Grid,
  solution: number[][],
  difficulty: Difficulty,
  mistakes: number,
  hints: number,
  timer: number
) => {
  try {
    const state: SavedGameState = {
      grid: serializeGrid(grid),
      solution,
      difficulty,
      mistakes,
      hints,
      timer,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save game', e);
  }
};

export const loadGame = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const state = JSON.parse(raw) as SavedGameState;
    
    return {
      ...state,
      grid: deserializeGrid(state.grid)
    };
  } catch (e) {
    console.error('Failed to load game', e);
    return null;
  }
};

export const hasSavedGame = (): boolean => {
  return !!localStorage.getItem(STORAGE_KEY);
};

export const clearSavedGame = () => {
  localStorage.removeItem(STORAGE_KEY);
};

// --- Statistics Logic ---

const defaultStats: GameStatistics = {
  gamesStarted: 0,
  gamesWon: 0,
  gamesLost: 0,
  currentStreak: 0,
  maxStreak: 0,
  bestTimes: {
    Easy: null,
    Medium: null,
    Hard: null
  }
};

export const getStats = (): GameStatistics => {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return defaultStats;
    return { ...defaultStats, ...JSON.parse(raw) };
  } catch (e) {
    return defaultStats;
  }
};

export const updateStats = (result: 'won' | 'lost', difficulty: Difficulty, time: number) => {
  const stats = getStats();
  
  if (result === 'won') {
    stats.gamesWon += 1;
    stats.currentStreak += 1;
    if (stats.currentStreak > stats.maxStreak) {
      stats.maxStreak = stats.currentStreak;
    }

    // Update best time if it's the first win or better than previous
    const currentBest = stats.bestTimes[difficulty];
    if (currentBest === null || time < currentBest) {
      stats.bestTimes[difficulty] = time;
    }
  } else {
    stats.gamesLost += 1;
    stats.currentStreak = 0; // Reset streak on loss
  }
  
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

export const incrementGamesStarted = () => {
    const stats = getStats();
    stats.gamesStarted += 1;
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

// --- Settings Logic ---

const defaultSettings: AppSettings = {
  music: false, // Default off for mobile web friendliness
  sound: true
};

export const getSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch (e) {
    return defaultSettings;
  }
};

export const saveSettings = (settings: AppSettings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
};