import React from 'react';
import { Difficulty } from '../types';
import { Timer, AlertCircle, Settings as SettingsIcon, LogOut } from 'lucide-react';

interface HeaderProps {
  difficulty: Difficulty;
  mistakes: number;
  time: number;
  onExit: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ difficulty, mistakes, time, onExit, onOpenSettings }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyLabel = (d: Difficulty) => {
      switch(d) {
          case 'Easy': return 'KOLAY';
          case 'Medium': return 'ORTA';
          case 'Hard': return 'ZOR';
          default: return d;
      }
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto pt-6 px-4 pb-2">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md">
          Zen<span className="text-teal-200">Sudoku</span>
        </h1>
        
        <div className="flex gap-2">
            <button 
              onClick={onOpenSettings}
              className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full hover:bg-white/30 active:scale-95 transition-all shadow-sm"
              aria-label="Ayarlar"
            >
              <SettingsIcon size={20} />
            </button>
            <button 
              onClick={onExit}
              className="flex items-center justify-center gap-2 px-4 h-10 bg-rose-500/80 backdrop-blur-md text-white border border-white/30 rounded-full hover:bg-rose-600 active:scale-95 transition-all shadow-sm"
              aria-label="Çıkış"
            >
              <span className="text-xs font-bold hidden sm:inline">ÇIKIŞ</span>
              <LogOut size={18} />
            </button>
        </div>
      </div>

      <div className="flex justify-between text-white/90 text-sm font-bold bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
           <span className="px-2 py-0.5 bg-white/20 rounded text-[10px] font-black uppercase tracking-wider text-teal-50 shadow-sm border border-white/10">
             {getDifficultyLabel(difficulty)}
           </span>
           <div className="w-px h-4 bg-white/20"></div>
           <div className="flex items-center gap-1.5">
              <AlertCircle size={18} className={mistakes >= 3 ? "text-red-300" : "text-teal-200"} />
              <span className={mistakes >= 3 ? "text-red-200" : ""}>{mistakes}/3</span>
           </div>
        </div>
        <div className="flex items-center gap-2">
          <Timer size={18} className="text-teal-200" />
          <span className="tabular-nums font-mono text-base">{formatTime(time)}</span>
        </div>
      </div>
    </div>
  );
};