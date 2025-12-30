import React from 'react';
import { AppSettings } from '../types';
import { X, Music, Volume2, Settings } from 'lucide-react';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onUpdateSettings, onClose }) => {
  
  const toggleMusic = () => {
    onUpdateSettings({ ...settings, music: !settings.music });
  };

  const toggleSound = () => {
    onUpdateSettings({ ...settings, sound: !settings.sound });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/40 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 border-b border-black/5 pb-4">
            <div className="p-3 bg-teal-100 rounded-full text-teal-600">
                <Settings size={24} className="animate-spin-slow" />
            </div>
            <div>
                <h3 className="text-xl font-black text-slate-800">Ayarlar</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">
                    Oyun Seçenekleri
                </p>
            </div>
            <button 
                onClick={onClose}
                className="ml-auto p-2 hover:bg-black/5 rounded-full text-slate-400 transition-colors"
            >
                <X size={20} />
            </button>
        </div>

        {/* Settings Options */}
        <div className="space-y-4 mb-6">
            {/* Music Toggle */}
            <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white/50 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${settings.music ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                        <Music size={20} />
                    </div>
                    <div>
                        <div className="font-bold text-slate-700">Müzik</div>
                        <div className="text-xs text-slate-500 font-medium">Arka plan müziği</div>
                    </div>
                </div>
                <button 
                    onClick={toggleMusic}
                    className={`w-12 h-7 rounded-full transition-colors relative ${settings.music ? 'bg-teal-500' : 'bg-slate-300'}`}
                >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${settings.music ? 'left-6' : 'left-1'}`} />
                </button>
            </div>

            {/* Sound Toggle */}
            <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white/50 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${settings.sound ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                        <Volume2 size={20} />
                    </div>
                    <div>
                        <div className="font-bold text-slate-700">Ses Efektleri</div>
                        <div className="text-xs text-slate-500 font-medium">Tıklama ve uyarı sesleri</div>
                    </div>
                </div>
                <button 
                    onClick={toggleSound}
                    className={`w-12 h-7 rounded-full transition-colors relative ${settings.sound ? 'bg-teal-500' : 'bg-slate-300'}`}
                >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${settings.sound ? 'left-6' : 'left-1'}`} />
                </button>
            </div>
        </div>

        <button 
            onClick={onClose}
            className="w-full py-3.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 active:scale-95 transition-all shadow-lg shadow-slate-900/20"
        >
            Tamam
        </button>
      </div>
    </div>
  );
};