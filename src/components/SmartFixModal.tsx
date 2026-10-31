import React from 'react';
import {
  X,
  Lock,
  Wrench,
  Sparkles,
  Check,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Video,
  Image as ImageIcon,
  Music,
} from 'lucide-react';
import { GenerationResult } from '../types';

interface SmartFixModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: GenerationResult;
  referenceImage: string | null;
  onApplyFix: (fixRequest: string) => Promise<void>;
  isFixing: boolean;
}

const DEFAULT_FIX_CHIPS = [
  '🎭 שמור על תווי הפנים',
  '🐢 תנועה איטית וטבעית יותר',
  '✨ שפר איכות ותאורה',
  '🎸 הדגש כלי נגינה',
  '⚡ תנועה חלקה וללא קפיצות',
  '🔍 עומק שדה וחדות מקסימלית',
];

export const SmartFixModal: React.FC<SmartFixModalProps> = ({
  isOpen,
  onClose,
  result,
  referenceImage,
  onApplyFix,
  isFixing,
}) => {
  const [selectedChips, setSelectedChips] = React.useState<string[]>([]);
  const [customText, setCustomText] = React.useState('');

  if (!isOpen) return null;

  const toggleChip = (chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parts = [...selectedChips];
    if (customText.trim()) {
      parts.push(customText.trim());
    }
    const fullFixRequest = parts.join(', ');
    if (!fullFixRequest) return;

    await onApplyFix(fullFixRequest);
  };

  const isSubmitDisabled = isFixing || (selectedChips.length === 0 && !customText.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-zinc-900 border-t sm:border border-zinc-800 rounded-t-3xl sm:rounded-3xl p-5 pb-7 sm:pb-6 text-white shadow-2xl relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {!isFixing && (
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="סגור"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Mobile handle indicator */}
        <div className="w-12 h-1.5 rounded-full bg-zinc-700 mx-auto mb-4 sm:hidden" />

        {/* Modal Header */}
        <div className="text-right pt-1 pb-3 border-b border-zinc-800/80">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span>Locked Concept Retake • תיקון חינמי (1/1)</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">
            תיקון ודיוק ממוקד בחינם 🛠️
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            לא מרוצה ב-100% מהתוצאה? הגדר מה לתקן, והמערכת תרנדר גרסה מדויקת ומשופרת ללא עלות נוספת.
          </p>
        </div>

        {/* LOCKED CONCEPT BANNER (Strictly Read-Only) */}
        <div className="my-3.5 p-3 rounded-2xl bg-zinc-950/90 border border-amber-500/40 relative text-right">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>קונספט מקורי נעול (Locked Concept)</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
              {result.resolution || 'HD'}
            </span>
          </div>

          <p className="text-xs font-semibold text-zinc-200 line-clamp-2">
            "{result.originalIdea}"
          </p>

          {/* Reference thumbnail if exists */}
          {referenceImage && (
            <div className="mt-2 flex items-center gap-2 p-1.5 rounded-xl bg-zinc-900 border border-zinc-800">
              <img
                src={referenceImage}
                alt="Locked Reference"
                className="w-10 h-10 rounded-lg object-cover border border-amber-500/40"
              />
              <div className="text-[11px] text-zinc-300 text-right">
                <span className="font-bold text-white block">תמונת ייחוס נעולה 🔒</span>
                <span className="text-zinc-400 text-[10px]">תווי הפנים והקומפוזיציה יישמרו</span>
              </div>
            </div>
          )}

          <div className="mt-2 text-[10px] text-zinc-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>הנושא המרכזי נעול לשמירה על יציבות המודל. ניתן לדייק פרמטרים טכניים בלבד.</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Quick Fix Chips */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
              <span>בחר מה דורש תיקון (ניתן לבחור יותר מאחד):</span>
              <span className="text-[10px] text-amber-400 font-normal">לחיצה להפעלה</span>
            </label>

            <div className="flex flex-wrap gap-1.5">
              {DEFAULT_FIX_CHIPS.map((chip) => {
                const isSelected = selectedChips.includes(chip);
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => toggleChip(chip)}
                    disabled={isFixing}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300 shadow-sm'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    <span>{chip}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Textarea for Specific Feedback */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300">
              הסבר בקצרה מה לתקן ביצירה זו (אופציונלי):
            </label>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              disabled={isFixing}
              placeholder="לדוגמה: התנועה הייתה מהירה מדי, לרכך את האור על הפנים, ולהוסיף קצת עומק שדה..."
              rows={2}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-2xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors shadow-inner resize-none"
            />
          </div>

          {/* Action Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-zinc-950 font-black text-sm shadow-xl shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFixing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                  <span>Gemini מדייק ומנוע ה-AI מרנדר תיקון...</span>
                </>
              ) : (
                <>
                  <Wrench className="w-4 h-4 text-zinc-950 fill-zinc-950" />
                  <span>בצע תיקון ממוקד בחינם 🚀 (תיקון 1/1)</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-zinc-400 text-center mt-2">
              * תיקון זה מחליף את התוצאה הנוכחית ללא הורדת קרדיט נוסף (זמין פעם אחת בלבד).
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
