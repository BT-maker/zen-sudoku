import React from 'react';
import { Undo2, Eraser, Pencil, Lightbulb, Wand2, LifeBuoy } from 'lucide-react';

interface ControlsProps {
  onNumberClick: (num: number) => void;
  onDelete: () => void;
  onUndo: () => void;
  onNoteToggle: () => void;
  onHint: () => void;
  onAutoNote: () => void;
  onHelp: () => void;
  isNoteMode: boolean;
  canUndo: boolean;
  hintsRemaining: number;
}

export const Controls: React.FC<ControlsProps> = ({
  onNumberClick,
  onDelete,
  onUndo,
  onNoteToggle,
  onHint,
  onAutoNote,
  onHelp,
  isNoteMode,
  canUndo,
  hintsRemaining
}) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto px-4 pb-8">
      
      {/* Primary Actions: Numbers */}
      <div className="grid grid-cols-9 gap-1.5 sm:gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => onNumberClick(num)}
            className="aspect-square flex items-center justify-center text-xl sm:text-2xl font-bold text-teal-700 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg shadow-teal-900/10 border-b-4 border-teal-100 active:border-b-0 active:translate-y-1 active:bg-white transition-all hover:bg-white hover:-translate-y-0.5"
          >
            {num}
          </button>
        ))}
      </div>

      {/* Tools */}
      <div className="grid grid-cols-6 gap-2 mt-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-xl">
        <ToolButton 
            icon={<Undo2 size={20} />} 
            label="Geri" 
            onClick={onUndo} 
            disabled={!canUndo} 
        />
        <ToolButton 
            icon={<Pencil size={20} />} 
            label={isNoteMode ? "Açık" : "Not"} 
            onClick={onNoteToggle} 
            isActive={isNoteMode} 
        />
        <ToolButton 
            icon={<Wand2 size={20} />} 
            label="Oto Not"
            onClick={onAutoNote} 
        />
        <ToolButton 
            icon={<LifeBuoy size={20} />} 
            label="Yardım"
            onClick={onHelp} 
        />
        <ToolButton 
            icon={<Lightbulb size={20} />} 
            label={`İpucu ${hintsRemaining}`}
            onClick={onHint} 
            disabled={hintsRemaining === 0}
        />
        <ToolButton 
            icon={<Eraser size={20} />} 
            label="Sil" 
            onClick={onDelete} 
        />
      </div>
    </div>
  );
};

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
}

const ToolButton: React.FC<ToolButtonProps> = ({ icon, label, onClick, isActive, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex flex-col items-center justify-center gap-1 py-3 rounded-xl transition-all duration-200 min-w-0
        ${disabled ? 'opacity-40 cursor-not-allowed text-white' : 'active:scale-95 text-white hover:bg-white/10'}
        ${isActive ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/40 ring-2 ring-teal-300 ring-offset-2 ring-offset-transparent' : ''}
      `}
    >
      <div className={isActive ? "text-white scale-110 transition-transform" : "text-white"}>
        {icon}
      </div>
      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider opacity-90 truncate w-full text-center">{label}</span>
    </button>
  );
};