import React from 'react';
import { Flame } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 px-6 bg-slate-950/90 border-t border-white/10 mt-auto relative z-10 text-xs text-slate-400">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Brand/Powered info */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 border border-orange-500/30">
            <Flame className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold tracking-wider uppercase text-slate-300">
            POWERED BY GOOGLE AI STUDIO
          </span>
        </div>

        {/* Copyright */}
        <p className="text-center md:text-left text-slate-400">
          © {new Date().getFullYear()} RESUME ROASTER. ALL RIGHTS RESERVED. POWERED BY FIRE.
        </p>

        {/* Links */}
        <div className="flex gap-4">
          <a href="#upload-section" className="hover:text-orange-400 transition-colors">
            Terms of Service
          </a>
          <a href="#upload-section" className="hover:text-orange-400 transition-colors">
            Privacy Policy
          </a>
          <a href="#upload-section" className="hover:text-orange-400 transition-colors">
            Contact Support
          </a>
        </div>
      </div>
    </footer>
  );
};
