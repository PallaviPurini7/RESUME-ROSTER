import React from 'react';
import { History, X, Flame, Trash2, ChevronRight, Award } from 'lucide-react';
import { RoastResult } from '../types';

interface RoastHistoryModalProps {
  history: RoastResult[];
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (result: RoastResult) => void;
  onClearHistory: () => void;
}

export const RoastHistoryModal: React.FC<RoastHistoryModalProps> = ({
  history,
  isOpen,
  onClose,
  onSelectResult,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl glass-panel rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6 pr-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white uppercase font-display">
                ROAST HISTORY LOG
              </h2>
              <p className="text-xs text-slate-300">Your past resume roasts saved in browser memory</p>
            </div>
          </div>

          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-xl border border-red-500/20 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Flame className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-slate-400 text-sm font-medium">No past roasts logged yet!</p>
            <p className="text-xs text-slate-500">Upload a resume to unleash your first roast.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item, index) => (
              <div
                key={item.id || index}
                onClick={() => {
                  onSelectResult(item);
                  onClose();
                }}
                className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-orange-500/50 hover:bg-slate-800/80 transition-all cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 font-extrabold text-sm flex flex-col items-center justify-center">
                    <span>{item.score}</span>
                    <span className="text-[9px] text-slate-400">/ 100</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                        "{item.verdict}"
                      </h4>
                      {item.filename && (
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-white/5">
                          {item.filename}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-1 italic">"{item.roast.slice(0, 80)}..."</p>
                    <span className="text-[10px] text-slate-500 block mt-1">
                      {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Recent'}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
