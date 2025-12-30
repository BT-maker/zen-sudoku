import React from 'react';
import { CellData } from '../types';

interface SudokuCellProps {
  cell: CellData;
  isSelected: boolean;
  isRelated: boolean; // Same row/col/box as selected
  isSameValue: boolean; // Has same value as selected
  isHintTarget?: boolean; // Highlighted by smart help
  onClick: () => void;
}

const SudokuCell: React.FC<SudokuCellProps> = ({
  cell,
  isSelected,
  isRelated,
  isSameValue,
  isHintTarget,
  onClick,
}) => {
  const { value, isInitial, notes, isError, row, col } = cell;

  // Use borders to define 3x3 boxes visually
  const isRightBorder = (col + 1) % 3 === 0 && col !== 8;
  const isBottomBorder = (row + 1) % 3 === 0 && row !== 8;

  const borderClass = `
    ${isRightBorder ? 'border-r-2 border-r-teal-300/50' : 'border-r border-r-teal-100/30'} 
    ${isBottomBorder ? 'border-b-2 border-b-teal-300/50' : 'border-b border-b-teal-100/30'}
  `;
  
  // Dynamic background classes
  let bgClass = 'bg-white/40'; // Default semi-transparent white
  
  if (isError) bgClass = 'bg-red-500/90 text-white animate-pulse';
  else if (isHintTarget) bgClass = 'bg-yellow-400/80 animate-pulse shadow-[inset_0_0_20px_rgba(255,255,0,0.5)] z-20 scale-105'; // Hint Highlight
  else if (isSelected) bgClass = 'bg-teal-500 shadow-inner shadow-black/10';
  else if (isSameValue && value !== null) bgClass = 'bg-teal-200/80';
  else if (isRelated) bgClass = 'bg-teal-100/40';

  // Text color
  let textClass = 'text-slate-800';
  let animateClass = '';

  if (isHintTarget) {
     textClass = 'text-white font-black';
  } else if (isSelected) {
     textClass = 'text-white scale-110';
  } else if (isError) {
     textClass = 'text-white';
  } else if (isInitial) {
     textClass = 'text-slate-900 font-black';
  } else {
     textClass = 'text-teal-700 font-bold'; // User entered numbers
     if (value !== null) {
       animateClass = 'animate-pop';
     }
  }

  return (
    <div
      onClick={onClick}
      className={`
        relative flex items-center justify-center cursor-pointer select-none transition-all duration-200 ease-out
        h-full w-full text-lg sm:text-2xl
        ${borderClass}
        ${bgClass}
        hover:bg-teal-100/50
        ${isSelected && !isHintTarget ? 'z-10 rounded-lg scale-105 shadow-xl' : ''}
        ${isHintTarget ? 'rounded-lg ring-4 ring-yellow-300 ring-offset-2 ring-offset-transparent' : ''}
      `}
      role="button"
      aria-label={`Row ${row + 1}, Column ${col + 1}, Value ${value || 'Empty'}`}
    >
      {value !== null ? (
        <span key={value} className={`${textClass} ${animateClass} transition-transform duration-200`}>{value}</span>
      ) : (
        // Notes Grid
        <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-0.5 pointer-events-none opacity-80">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <div key={num} className="flex items-center justify-center text-[7px] sm:text-[9px] leading-none text-teal-900/70 font-bold">
              {notes.has(num) ? num : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(SudokuCell);