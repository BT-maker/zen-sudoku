import React from 'react';
import { GameStatistics } from '../types';
import { Trophy, Clock, Target, Flame, ChevronLeft } from 'lucide-react';

interface StatisticsProps {
  stats: GameStatistics;
  onBack: () => void;
}

export const Statistics: React.FC<StatisticsProps> = ({ stats, onBack }) => {
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const winRate = stats.gamesStarted > 0 
    ? Math.round((stats.gamesWon / stats.gamesStarted) * 100) 
    : 0;

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center font-sans p-4 w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      <div className="w-full bg-white/20 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/30 flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/20">
            <button 
                onClick={onBack}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
                <ChevronLeft size={24} />
            </button>
            <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-md">İstatistikler</h2>
            <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-2 gap-4">
            <StatCard 
                icon={<Target className="text-teal-200" />} 
                label="Oynanan" 
                value={stats.gamesStarted} 
            />
            <StatCard 
                icon={<Trophy className="text-yellow-300" />} 
                label="Kazanılan" 
                value={stats.gamesWon} 
            />
            <StatCard 
                icon={<Target className="text-blue-200" />} 
                label="Kazanma Oranı" 
                value={`%${winRate}`} 
            />
            <StatCard 
                icon={<Flame className="text-orange-400" />} 
                label="Seri (Maks)" 
                value={`${stats.currentStreak} (${stats.maxStreak})`} 
            />
        </div>

        {/* Best Times Section */}
        <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-3 text-white/90">
                <Clock size={18} />
                <span className="font-bold text-sm uppercase tracking-wider">En İyi Süreler</span>
            </div>
            
            <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-emerald-100 font-medium">Kolay</span>
                    <span className="text-white font-mono font-bold text-lg">{formatTime(stats.bestTimes.Easy)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-amber-100 font-medium">Orta</span>
                    <span className="text-white font-mono font-bold text-lg">{formatTime(stats.bestTimes.Medium)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-rose-100 font-medium">Zor</span>
                    <span className="text-white font-mono font-bold text-lg">{formatTime(stats.bestTimes.Hard)}</span>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <div className="bg-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 border border-white/10">
        <div className="p-2 bg-white/10 rounded-full mb-1 shadow-sm">
            {React.cloneElement(icon as React.ReactElement, { size: 20 })}
        </div>
        <span className="text-white/70 text-xs font-bold uppercase tracking-wider">{label}</span>
        <span className="text-white text-2xl font-black drop-shadow-sm">{value}</span>
    </div>
);