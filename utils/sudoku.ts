import { Grid, Difficulty } from '../types';

// Helper to check if a number placement is valid
export const isValidMove = (grid: number[][], row: number, col: number, num: number): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }

  // Check 3x3 box
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
};

// Calculate all valid candidates for a specific cell based on current grid state
export const getValidCandidates = (grid: Grid, row: number, col: number): number[] => {
  const candidates: number[] = [];
  
  for (let n = 1; n <= 9; n++) {
    let valid = true;
    
    // Check Row
    for (let c = 0; c < 9; c++) {
      if (c !== col && grid[row][c].value === n) {
        valid = false;
        break;
      }
    }
    if (!valid) continue;

    // Check Col
    for (let r = 0; r < 9; r++) {
      if (r !== row && grid[r][col].value === n) {
        valid = false;
        break;
      }
    }
    if (!valid) continue;

    // Check Box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if ((r !== row || c !== col) && grid[r][c].value === n) {
          valid = false;
          break;
        }
      }
    }

    if (valid) candidates.push(n);
  }
  
  return candidates;
};

// Remove a specific note from related row, col, and box
export const clearNotesAround = (g: Grid, r: number, c: number, val: number) => {
    // Clear from row
    for(let i=0; i<9; i++) g[r][i].notes.delete(val);
    
    // Clear from col
    for(let i=0; i<9; i++) g[i][c].notes.delete(val);
    
    // Clear from box
    const boxStartR = r - (r%3);
    const boxStartC = c - (c%3);
    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            g[boxStartR + i][boxStartC + j].notes.delete(val);
        }
    }
};

// Smart Hint Logic
export interface SmartHint {
  row: number;
  col: number;
  value: number;
  explanation: string;
  technique?: string;
}

export const getSmartHint = (grid: Grid): SmartHint | null => {
  // 1. Naked Singles: Cells that have only ONE valid candidate
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c].value !== null) continue;
      
      const candidates = getValidCandidates(grid, r, c);
      if (candidates.length === 1) {
        return {
          row: r,
          col: c,
          value: candidates[0],
          technique: "Tek Aday (Naked Single)",
          explanation: `Bu hücreye ${candidates[0]} dışında hiçbir sayı gelemez. Satır, sütun ve kutudaki diğer sayılar tüm diğer olasılıkları eliyor.`
        };
      }
    }
  }

  // 2. Hidden Singles (Row)
  for (let r = 0; r < 9; r++) {
    const counts: Record<number, number[]> = {};
    for(let c=0; c<9; c++){
       if(grid[r][c].value) continue;
       const opts = getValidCandidates(grid, r, c);
       opts.forEach(o => {
         if(!counts[o]) counts[o] = [];
         counts[o].push(c);
       });
    }
    for(const numStr in counts){
        const num = parseInt(numStr);
        if(counts[num].length === 1){
            return {
                row: r,
                col: counts[num][0],
                value: num,
                technique: "Gizli Tekli - Satır",
                explanation: `${r+1}. satırda ${num} rakamını koyabileceğimiz tek güvenli yer burası. Satırdaki diğer boşluklar bu sayıyı kabul etmiyor.`
            };
        }
    }
  }

  // 3. Hidden Singles (Col)
  for (let c = 0; c < 9; c++) {
    const counts: Record<number, number[]> = {};
    for(let r=0; r<9; r++){
       if(grid[r][c].value) continue;
       const opts = getValidCandidates(grid, r, c);
       opts.forEach(o => {
         if(!counts[o]) counts[o] = [];
         counts[o].push(r);
       });
    }
    for(const numStr in counts){
        const num = parseInt(numStr);
        if(counts[num].length === 1){
            return {
                row: counts[num][0],
                col: c,
                value: num,
                technique: "Gizli Tekli - Sütun",
                explanation: `${c+1}. sütunda ${num} rakamını koyabileceğimiz tek güvenli yer burası. Sütundaki diğer boşluklar bu sayıyı kabul etmiyor.`
            };
        }
    }
  }

  // 4. Hidden Singles (Box)
  for (let br = 0; br < 3; br++) {
      for (let bc = 0; bc < 3; bc++) {
          const startR = br * 3;
          const startC = bc * 3;
          const counts: Record<number, {r: number, c: number}[]> = {};
          
          for(let r=startR; r<startR+3; r++){
              for(let c=startC; c<startC+3; c++){
                  if(grid[r][c].value) continue;
                  const opts = getValidCandidates(grid, r, c);
                  opts.forEach(o => {
                      if(!counts[o]) counts[o] = [];
                      counts[o].push({r, c});
                  });
              }
          }
          
          for(const numStr in counts){
            const num = parseInt(numStr);
            if(counts[num].length === 1){
                const cell = counts[num][0];
                return {
                    row: cell.r,
                    col: cell.c,
                    value: num,
                    technique: "Gizli Tekli - Kutu",
                    explanation: `İşaretli 3x3 kutu içinde ${num} rakamının sığabileceği tek kare burasıdır. Kutudaki diğer kareler bu sayıyı alamıyor.`
                };
            }
          }
      }
  }

  // Fallback: Just pick a random empty cell
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (!grid[r][c].value) {
         const candidates = getValidCandidates(grid, r, c);
         if (candidates.length > 0) {
             return {
                 row: r, 
                 col: c, 
                 value: candidates[0], 
                 technique: "Stratejik Tahmin",
                 explanation: "Bu karmaşık bir durum, ancak olasılıklar hesaplandığında bu sayı burası için geçerli bir aday."
             };
         }
      }
    }
  }

  return null;
}

// Backtracking algorithm to solve/generate Sudoku
const solveSudoku = (grid: number[][]): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5); // Randomize for variety
        for (const num of nums) {
          if (isValidMove(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) return true;
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

// Generate a new game
export const generateSudoku = (difficulty: Difficulty): { initialGrid: Grid; solvedGrid: number[][] } => {
  // 1. Create a full valid 9x9 grid
  const rawGrid: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
  solveSudoku(rawGrid);

  // Clone for solution reference
  const solvedGrid = rawGrid.map(row => [...row]);

  // 2. Remove numbers based on difficulty
  const attempts = difficulty === 'Easy' ? 30 : difficulty === 'Medium' ? 45 : 58; 
  // Note: Standard removal counts -> Easy: remove ~30-40, Medium: ~40-50, Hard: ~50-60
  // Let's invert logic: How many to KEEP?
  // Easy: Keep 40-50. Hard: Keep ~25.
  
  // Let's use a simpler "holes" approach
  let holes = 0;
  if (difficulty === 'Easy') holes = 30;
  else if (difficulty === 'Medium') holes = 45;
  else holes = 55;

  while (holes > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (rawGrid[row][col] !== 0) {
      rawGrid[row][col] = 0;
      holes--;
    }
  }

  // 3. Convert to rich Grid object
  const grid: Grid = rawGrid.map((row, rIndex) =>
    row.map((val, cIndex) => ({
      row: rIndex,
      col: cIndex,
      value: val === 0 ? null : val,
      isInitial: val !== 0,
      notes: new Set(),
      isError: false,
    }))
  );

  return { initialGrid: grid, solvedGrid };
};

// Check if board is full and correct
export const checkWin = (grid: Grid): boolean => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = grid[r][c];
      if (cell.value === null || cell.isError) return false;
    }
  }
  return true;
};