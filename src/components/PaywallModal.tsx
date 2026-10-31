import React from 'react';
import { X, Check, Sparkles, Zap, ShieldCheck, Flame } from 'lucide-react';
import { CreditPackage } from '../types';
import { triggerSuccessConfetti } from '../utils/confetti';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPackage: (pkg: CreditPackage) => void;
  currentCredits: number;
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'single_1',
    titleHe: 'סרט או שיר מלא (יצירה 1)',
    subtitleHe: 'סרטון וידאו ב-HD או רצועת מוזיקה מלאה',
    credits: 1,
    priceUsd: 1.00,
    priceDisplay: '$1.00',
    unitPriceDisplay: '$1.00 לסרט או שיר',
  },
  {
    id: 'pack_5',
    titleHe: 'חבילת 5 סרטים או 5 שירים',
    subtitleHe: '5 קרדיטים מלאים ליצירת סרטוני וידאו ומוזיקה',
    credits: 5,
    priceUsd: 3.00,
    priceDisplay: '$3.00',
    popular: true,
    badge: 'הכי משתלם 🔥 (חיסכון של 40%)',
    unitPriceDisplay: '$0.60 בלבד לסרט/שיר',
  },
  {
    id: 'pack_15',
    titleHe: 'חבילת אולפן מקצועית (15 יצירות)',
    subtitleHe: '15 סרטים ושירים באיכות מקסימלית + עדיפות בתור',
    credits: 15,
    priceUsd: 7.99,
    priceDisplay: '$7.99',
    badge: 'אולפן Pro 💎',
    unitPriceDisplay: '$0.53 לסרט/שיר',
  },
];

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  onSelectPackage,
  currentCredits,
}) => {
  const [selectedId, setSelectedId] = React.useState<string>('pack_5');

  if (!isOpen) return null;

  const handlePurchase = (pkg: CreditPackage) => {
    triggerSuccessConfetti();
    onSelectPackage(pkg);
    onClose();
  };

  const selectedPkg = CREDIT_PACKAGES.find((p) => p.id === selectedId) || CREDIT_PACKAGES[1];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
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

        {/* Drag handle indicator on mobile */}
        <div className="w-12 h-1.5 rounded-full bg-zinc-700 mx-auto mb-4 sm:hidden" />

        {/* Header Hero */}
        <div className="text-center pt-1 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>שחרר את מלוא העוצמה של ClipTap AI</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white mt-1">
            הוסף קרדיטים ליצירה
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
            יוצרים וידאו ב-480p, תמונות Flux ברזולוציית 8K ורצועות מוזיקה מקוריות בשניות
          </p>

          <div className="mt-2 text-xs font-medium text-zinc-300 bg-zinc-800/60 inline-block px-3 py-1 rounded-full border border-zinc-700/50">
            יתרה נוכחית: <strong className="text-amber-400 font-bold">{currentCredits}</strong> קרדיטים
          </div>
        </div>

        {/* Value Proposition Pills */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-zinc-800/80 my-2 text-center text-[11px] text-zinc-300">
          <div className="flex flex-col items-center gap-1">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-white">רינדור מהיר</span>
            <span className="text-[10px] text-zinc-400">תור פרימיום</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x border-zinc-800">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">ללא סימן מים</span>
            <span className="text-[10px] text-zinc-400">הורדה נקייה</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-white">אישור 2 שלבים</span>
            <span className="text-[10px] text-zinc-400">אפס בזבוז</span>
          </div>
        </div>

        {/* Highlighted Gold Trust Booster Badge */}
        <div className="my-3 p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 border border-amber-400/60 text-amber-200 shadow-md shadow-amber-500/10 flex items-center gap-2.5">
          <span className="text-xl shrink-0">🛡️</span>
          <div className="text-right leading-tight">
            <div className="text-xs font-black text-amber-300">
              אחריות תוצאה מלאה
            </div>
            <div className="text-[11px] text-amber-100/90 font-medium mt-0.5">
              כולל אפשרות לתיקון ודיוק חינם אם לא אהבת!
            </div>
          </div>
        </div>

        {/* Package Cards */}
        <div className="space-y-2.5 my-3">
          {CREDIT_PACKAGES.map((pkg) => {
            const isSelected = selectedId === pkg.id;
            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedId(pkg.id)}
                className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-amber-500 bg-gradient-to-r from-amber-500/15 via-zinc-800/60 to-zinc-800 shadow-md shadow-amber-500/10'
                    : 'border-zinc-800 bg-zinc-900/90 hover:border-zinc-700 hover:bg-zinc-850'
                }`}
              >
                {/* Badge if present */}
                {pkg.badge && (
                  <div
                    className={`absolute -top-2.5 right-4 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950'
                        : 'bg-purple-600 text-white'
                    }`}
                  >
                    {pkg.popular && <Flame className="w-3 h-3 fill-zinc-950" />}
                    <span>{pkg.badge}</span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500 text-zinc-950'
                        : 'border-zinc-600 bg-zinc-800'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-sm text-white">{pkg.titleHe}</span>
                      <span className="text-[11px] font-bold px-1.5 py-0.2 rounded bg-zinc-800 text-amber-300">
                        {pkg.credits} קרדיטים
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">{pkg.subtitleHe}</div>
                  </div>
                </div>

                <div className="text-left pl-1">
                  <div className="text-base font-black text-amber-400">{pkg.priceDisplay}</div>
                  <div className="text-[10px] text-zinc-400">{pkg.unitPriceDisplay}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Primary CTA */}
        <button
          onClick={() => handlePurchase(selectedPkg)}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-black text-base shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
        >
          <Zap className="w-5 h-5 fill-zinc-950" />
          <span>המשך עם {selectedPkg.titleHe} ({selectedPkg.priceDisplay})</span>
        </button>

        {/* Guarantee and Compliance Note */}
        <div className="mt-3 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>רכישה מאובטחת • ביטול בכל עת • אפס התחייבות</span>
          </div>
          <div className="text-[10px] text-zinc-400 flex items-center justify-center gap-3 pt-1">
            <button
              onClick={() => {
                alert('שחזור רכישות סונכרן מול חשבון ה-Apple ID / Google Play.');
              }}
              className="hover:text-zinc-300 underline cursor-pointer"
            >
              שחזר רכישות
            </button>
            <span>•</span>
            <span className="text-zinc-400">תואם תקנון חנות האפליקציות</span>
          </div>
        </div>
      </div>
    </div>
  );
};
