import React from 'react';
import {
  X,
  Share,
  PlusSquare,
  Smartphone,
  Sparkles,
  CheckCircle2,
  Zap,
  ArrowDown,
} from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  onInstallNative: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  onInstallNative,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-zinc-900 border-t sm:border border-zinc-800 rounded-t-3xl sm:rounded-3xl p-5 pb-8 sm:pb-6 text-white shadow-2xl relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          aria-label="סגור"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Mobile drag handle */}
        <div className="w-12 h-1.5 rounded-full bg-zinc-700 mx-auto mb-4 sm:hidden" />

        {/* Header Hero */}
        <div className="text-center pt-1 pb-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-purple-600 p-[2px] mx-auto mb-3 shadow-xl shadow-amber-500/20">
            <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-amber-400" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-1">
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>התקנה באייפון (iOS App)</span>
          </div>

          <h3 className="text-xl font-black text-white mt-1">
            הוסף את ClipTap AI למסך הבית
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
            האפליקציה תופיע עם אייקון אמיתי במסך הבית של האייפון ותפעל במסך מלא כמו כל אפליקציה מחנות App Store!
          </p>
        </div>

        {/* Value Perks */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-zinc-800/80 my-3 text-center text-[11px] text-zinc-300">
          <div className="flex flex-col items-center gap-1">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-white">מסך מלא</span>
            <span className="text-[10px] text-zinc-400">ללא שורת כתובת</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x border-zinc-800">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">אייקון ייעודי</span>
            <span className="text-[10px] text-zinc-400">במסך הבית שלך</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-white">גישה מיידית</span>
            <span className="text-[10px] text-zinc-400">בלחיצה אחת</span>
          </div>
        </div>

        {/* Android / Chromium 1-Click Install Button if supported */}
        {isInstallable && (
          <div className="my-3">
            <button
              onClick={() => {
                onInstallNative();
                onClose();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-zinc-950 font-black text-sm shadow-xl shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-zinc-950 stroke-[2.5]" />
              <span>התקן עכשיו בלחיצה אחת 🚀</span>
            </button>
          </div>
        )}

        {/* Step-by-Step Guide for iPhone / iPad (Safari) */}
        <div className="space-y-3 mt-4 text-right">
          <div className="text-xs font-bold text-amber-300 px-1">
            מדריך התקנה פשוט באייפון (2 שניות):
          </div>

          {/* Step 1 */}
          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Share className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <div className="font-extrabold text-white">שלב 1: לחץ על כפתור השיתוף</div>
              <div className="text-zinc-400 text-[11px] mt-0.5">
                לחץ על אייקון השיתוף המרובע עם החץ למעלה (בתחתית המסך בספארי).
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <PlusSquare className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <div className="font-extrabold text-white">שלב 2: בחר "הוסף למסך הבית"</div>
              <div className="text-zinc-400 text-[11px] mt-0.5">
                גלול מעט למטה בתפריט ולחץ על <strong>"הוסף למסך הבית" (Add to Home Screen)</strong>.
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <div className="font-extrabold text-white">שלב 3: לחץ על "הוסף" (Add)</div>
              <div className="text-zinc-400 text-[11px] mt-0.5">
                בפינה הימנית העליונה לחץ על "הוסף". זהו! האפליקציה במסך הבית שלך.
              </div>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-4">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            הבנתי, סגור חלון
          </button>
        </div>
      </div>
    </div>
  );
};
