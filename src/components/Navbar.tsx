import React from 'react';
import { Flame, History, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenHistory: () => void;
  onOpenTips: () => void;
  onScrollToUpload: () => void;
  hasResults: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenHistory,
  onOpenTips,
  onScrollToUpload,
  hasResults,
}) => {
  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-white/10 shadow-lg shadow-orange-500/5">
      {/* Brand */}
      <div 
        onClick={onScrollToUpload}
        className="flex items-center gap-2 cursor-pointer group select-none"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-red-600 flex items-center justify-center shadow-md shadow-orange-500/30 group-hover:scale-105 transition-transform duration-200">
          <Flame className="w-6 h-6 text-white animate-flame" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-extrabold tracking-tight text-white uppercase font-display leading-none flex items-center gap-1">
            RESUME <span className="fire-gradient-text">ROASTER</span>
          </span>
          <span className="text-[10px] text-orange-400 font-medium tracking-widest uppercase">
            AI-POWERED BURN UNIT
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-6">
        <button
          onClick={onScrollToUpload}
          className="text-slate-300 font-semibold hover:text-orange-400 transition-colors text-sm flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4 text-orange-400" />
          Roast Generator
        </button>
        {hasResults && (
          <button
            onClick={onOpenTips}
            className="text-slate-300 font-semibold hover:text-emerald-400 transition-colors text-sm flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Un-Roast Checklist
          </button>
        )}
        <button
          onClick={onOpenHistory}
          className="text-slate-300 font-semibold hover:text-amber-400 transition-colors text-sm flex items-center gap-1.5"
        >
          <History className="w-4 h-4 text-amber-400" />
          Past Roasts
        </button>
      </div>

      {/* Action Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenHistory}
          className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800/60 border border-white/10"
          title="Past Roasts"
        >
          <History className="w-5 h-5" />
        </button>
        <button
          onClick={onScrollToUpload}
          className="glow-button-flame text-white font-bold px-5 py-2.5 rounded-full text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
        >
          <Flame className="w-4 h-4" />
          Get Roasted
        </button>
      </div>
    </nav>
  );
};
