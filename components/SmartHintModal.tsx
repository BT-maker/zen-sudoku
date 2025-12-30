import React from 'react';
import { SmartHint } from '../utils/sudoku';
import { X, Check, Lightbulb } from 'lucide-react';

interface SmartHintModalProps {
  hint: SmartHint | null;
  onClose: () => void;
  onApply: () => void;
}

export const SmartHintModal: React.FC<SmartHintModalProps> = ({ hint, onClose, onApply }) => {
  if (!hint) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/40 animate-in slide-in-from-bottom-10 fade-in duration-300">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-teal-100 rounded-full text-teal-600">
                <Lightbulb size={24} fill="currentColor" className="opacity-80"/>
            </div>
            <div>
                <h3 className="text-xl font-black text-slate-800">
                  {hint.technique || "Akıllı Yardım"}
                </h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">
                    Satır {hint.row + 1}, Sütun {hint.col + 1}
                </p>
            </div>
            <button 
                onClick={onClose}
                className="ml-auto p-2 hover:bg-black/5 rounded-full text-slate-400 transition-colors"
            >
                <X size={20} />
            </button>
        </div>

        {/* Explanation Body */}
        <div className="bg-white/50 rounded-2xl p-4 mb-6 border border-white/50 shadow-inner">
            <p className="text-slate-700 font-medium leading-relaxed">
                {hint.explanation}
            </p>
            <div className="mt-3 flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Önerilen Hamle:</span>
                <span className="px-3 py-1 bg-teal-500 text-white font-bold rounded-lg shadow-sm">
                    {hint.value}
                </span>
            </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
            <button 
                onClick={onClose}
                className="flex-1 py-3.5 bg-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-300 active:scale-95 transition-all"
            >
                Anladım
            </button>
            <button 
                onClick={onApply}
                className="flex-1 py-3.5 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
            >
                <Check size={18} strokeWidth={3} />
                Uygula
            </button>
        </div>
      </div>
    </div>
  );
};