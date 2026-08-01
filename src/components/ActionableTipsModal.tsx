import React from 'react';
import { ShieldCheck, X, CheckCircle, ArrowRight, Sparkles, FileCheck } from 'lucide-react';
import { RoastResult } from '../types';

interface ActionableTipsModalProps {
  result: RoastResult;
  isOpen: boolean;
  onClose: () => void;
}

export const ActionableTipsModal: React.FC<ActionableTipsModalProps> = ({
  result,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl glass-panel rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white uppercase font-display">
              UN-ROAST CHECKLIST
            </h2>
            <p className="text-xs text-slate-300">Actionable steps to transform your resume into a hiring manager magnet</p>
          </div>
        </div>

        {/* Fix Items */}
        <div className="space-y-4 mb-8">
          {result.actionableTips.map((tip, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/20 flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  Action Item #{idx + 1}
                </span>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">{tip}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pro Tips Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-950/40 via-amber-950/30 to-orange-950/40 border border-orange-500/30 mb-6">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase mb-2">
            <Sparkles className="w-4 h-4" /> Golden Rule for Resume Success
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Always structure bullet points with the formula: <strong className="text-white">Action Verb + Context/Tool + Measurable Result</strong> (e.g., "Architected automated CI/CD pipeline using GitHub Actions, reducing deployment time by 45%").
          </p>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="glow-button-flame text-white font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider"
          >
            Got It, Let's Fix It!
          </button>
        </div>
      </div>
    </div>
  );
};
