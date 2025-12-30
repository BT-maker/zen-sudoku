export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface CellData {
  row: number;
  col: number;
  value: number | null;
  isInitial: boolean; // True if part of the puzzle start
  notes: Set<number>;
  isError: boolean;
}

export type Grid = CellData[][];

export interface AppSettings {
  music: boolean;
  sound: boolean;
}

export interface GameState {
  grid: Grid;
  status: 'playing' | 'won' | 'lost';
  difficulty: Difficulty;
  mistakes: number;
  timer: number;
  selectedCell: [number, number] | null; // [row, col]
  isNoteMode: boolean;
  history: Grid[]; // For undo functionality
}

// Interface for JSON serialization (Sets become Arrays)
export interface SavedGameState {
  grid: {
    row: number;
    col: number;
    value: number | null;
    isInitial: boolean;
    notes: number[]; 
    isError: boolean;
  }[][];
  solution: number[][];
  difficulty: Difficulty;
  mistakes: number;
  hints: number;
  timer: number;
  timestamp: number;
}

export interface GameStatistics {
  gamesStarted: number;
  gamesWon: number;
  gamesLost: number;
  currentStreak: number;
  maxStreak: number;
  bestTimes: {
    Easy: number | null;
    Medium: number | null;
    Hard: number | null;
  };
}