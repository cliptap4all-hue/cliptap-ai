import React from 'react';
import { Sparkles, Coins, Plus, Smartphone } from 'lucide-react';

interface HeaderProps {
  credits: number;
  onOpenPaywall: () => void;
  onGoHome: () => void;
  currentPage: number;
  isInstalled: boolean;
  onOpenInstallModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  credits,
  onOpenPaywall,
  onGoHome,
  currentPage,
  isInstalled,
  onOpenInstallModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3 flex items-center justify-between">
      {/* App Logo */}
      <button
        onClick={onGoHome}
        className="flex items-center gap-2 group text-right focus:outline-none cursor-pointer"
        title="חזרה לדף הבית"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-purple-600 p-[1.5px] shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
          <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
        </div>
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base tracking-tight text-white group-hover:text-amber-400 transition-colors">
              ClipTap
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              AI
            </span>
          </div>
          <div className="text-[10px] text-zinc-400 font-medium tracking-tight" dir="ltr">
            1-Tap AI Studio - No Login
          </div>
        </div>
      </button>

      {/* Right side: Credits Badge + Install App */}
      <div className="flex items-center gap-2">
        {/* Credits Badge */}
        <button
          onClick={onOpenPaywall}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 to-yellow-500/15 border border-amber-500/30 hover:border-amber-400/60 hover:bg-amber-500/25 transition-all text-amber-300 text-xs font-bold shadow-sm cursor-pointer group"
          title="לחץ לרכישת קרדיטים"
        >
          <Coins className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span>{credits}</span>
          <span className="text-[11px] font-medium text-amber-200/80">קרדיטים</span>
          <div className="w-4 h-4 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center mr-0.5 group-hover:scale-110 transition-transform">
            <Plus className="w-3 h-3 stroke-[3]" />
          </div>
        </button>

        {/* Install App on iPhone / Mobile Button */}
        {!isInstalled && (
          <button
            onClick={onOpenInstallModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
            title="התקן את האפליקציה באייפון"
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>התקן</span>
          </button>
        )}
      </div>
    </header>
  );
};
