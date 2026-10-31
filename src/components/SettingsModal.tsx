import React from 'react';
import {
  X,
  Key,
  TrendingUp,
  DollarSign,
  Percent,
  Trash2,
  Shield,
  HelpCircle,
  CheckCircle2,
  Sparkles,
  Server,
  Calculator,
} from 'lucide-react';
import { DeveloperProfitStats } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  falApiKey: string;
  onSaveFalApiKey: (key: string) => void;
  profitStats: DeveloperProfitStats;
  onSimulatePurchase: (amountUsd: number, creditsCount: number) => void;
  onResetData: () => void;
  onResetProfitStats: () => void;
  credits: number;
  onSetCredits: (val: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  falApiKey,
  onSaveFalApiKey,
  profitStats,
  onSimulatePurchase,
  onResetData,
  onResetProfitStats,
  credits,
  onSetCredits,
}) => {
  const [inputKey, setInputKey] = React.useState(falApiKey);
  const [activeTab, setActiveTab] = React.useState<'profit' | 'keys' | 'compliance'>('profit');
  const [scaleUsers, setScaleUsers] = React.useState<number>(100);
  const [keySavedToast, setKeySavedToast] = React.useState(false);

  React.useEffect(() => {
    setInputKey(falApiKey);
  }, [falApiKey]);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    onSaveFalApiKey(inputKey.trim());
    setKeySavedToast(true);
    setTimeout(() => setKeySavedToast(false), 2500);
  };

  // Unit Economics calculations
  const grossRev = profitStats.totalRevenueUsd;
  const storeCut = profitStats.appStoreFeesUsd;
  const aiCost = profitStats.aiGenerationCostsUsd;
  const netProf = profitStats.netProfitUsd;
  const marginPct = grossRev > 0 ? Math.round((netProf / grossRev) * 100) : 83; // Baseline ~83% margin

  // Scaled projection: average user buys $2.99 pack (5 credits), makes 4 creations (mix of video/image/audio, avg $0.009 AI cost)
  const projectedGross = scaleUsers * 2.99;
  const projectedAppleFee = projectedGross * 0.15;
  const projectedAiCost = scaleUsers * (4 * 0.009); // avg mix
  const projectedNet = projectedGross - projectedAppleFee - projectedAiCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-5 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">לוח בקרה & מחשבון מפתח</h3>
              <p className="text-[11px] text-zinc-400">ניהול מנועים, רווחיות נטו ותאימות חנות</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl my-3 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profit')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'profit'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>מחשבון רווח</span>
          </button>
          <button
            onClick={() => setActiveTab('keys')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'keys'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>מפתחות Fal.ai</span>
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'compliance'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>תאימות ונתונים</span>
          </button>
        </div>

        {/* TAB 1: PROFIT CALCULATOR & TRACKER */}
        {activeTab === 'profit' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            {/* Live Session Tracker */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-300">מעקב רווחים ישיר (סימולציית רכישות)</span>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {marginPct}% מרווח נטו!
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-right">
                <div className="bg-zinc-900/90 p-2.5 rounded-xl border border-zinc-800">
                  <div className="text-[10px] text-zinc-400">הכנסות ברוטו (Gross)</div>
                  <div className="text-lg font-black text-white font-mono mt-0.5">
                    ${grossRev.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">
                    {profitStats.purchasesCount} רכישות בוצעו
                  </div>
                </div>

                <div className="bg-zinc-900/90 p-2.5 rounded-xl border border-emerald-500/30">
                  <div className="text-[10px] text-emerald-400">רווח נקי לכיס (Net Profit)</div>
                  <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
                    ${netProf.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-emerald-300/80 mt-0.5">לאחר עמלות ועלויות AI</div>
                </div>
              </div>

              {/* Deductions Breakdown */}
              <div className="bg-zinc-900/50 p-2.5 rounded-xl border border-zinc-800/80 text-[11px] space-y-1.5">
                <div className="flex justify-between text-zinc-300">
                  <span>עמלת חנות (Apple/Google 15%):</span>
                  <span className="text-rose-400 font-mono">-${storeCut.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>עלות רינדור מנועי AI (~$0.015 לוידאו):</span>
                  <span className="text-amber-400 font-mono">-${aiCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-400 text-[10px] pt-1 border-t border-zinc-800">
                  <span>סה"כ יצירות שנוצרו:</span>
                  <span className="text-zinc-200">{profitStats.totalCreationsGenerated} יצירות</span>
                </div>
              </div>

              {/* Quick test buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onSimulatePurchase(2.99, 5)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-amber-300 border border-zinc-700 cursor-pointer text-center"
                >
                  + בדיקת רכישת $2.99
                </button>
                <button
                  onClick={onResetProfitStats}
                  className="py-1.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-[11px] text-zinc-400 hover:text-zinc-200 border border-zinc-800 cursor-pointer"
                >
                  איפוס
                </button>
              </div>
            </div>

            {/* Scale Simulator */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-zinc-950 to-zinc-950 border border-amber-500/20 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>סימולטור צמיחה בסקייל</span>
                </span>
                <span className="text-[10px] text-zinc-400">חבילת $2.99</span>
              </div>

              <div className="flex items-center gap-1.5">
                {[100, 500, 1000, 5000].map((num) => (
                  <button
                    key={num}
                    onClick={() => setScaleUsers(num)}
                    className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      scaleUsers === num
                        ? 'bg-amber-500 text-zinc-950'
                        : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {num.toLocaleString()} משתמשים
                  </button>
                ))}
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">הכנסה חודשית:</span>
                  <span className="font-bold text-white font-mono">${projectedGross.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">עמלת אפל (15%):</span>
                  <span className="text-rose-400 font-mono">-${projectedAppleFee.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">עלות שרתי AI (~$0.015 ליחידה):</span>
                  <span className="text-amber-400 font-mono">-${projectedAiCost.toFixed(0)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-zinc-800 font-bold">
                  <span className="text-emerald-400">רווח נקי משוער לחודש:</span>
                  <span className="text-emerald-400 font-mono text-sm">
                    ${projectedNet.toFixed(0)} (~₪{(projectedNet * 3.7).toFixed(0)})
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FAL.AI KEYS & ENGINES */}
        {activeTab === 'keys' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white">
                <Server className="w-4 h-4 text-amber-400" />
                <span>ארכיטקטורת מנועי AI (Zero & Low Cost)</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-zinc-400 pr-1">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-zinc-200">פרומפטים (שלב 1):</strong> חינם 100% באמצעות
                    Gemini 2.5 Flash / Pollinations Text
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-zinc-200">תמונות (שלב 2):</strong> חינם 100% באמצעות
                    Pollinations Flux ללא צורך במפתח!
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-zinc-200">וידאו ומוזיקה:</strong> מופעלים בעלות מינימלית
                    (~0.015$) דרך Fal.ai Wan/LTX/Audio. בהיעדר מפתח, האפליקציה מפעילה אוטומטית{' '}
                    <strong className="text-amber-300">סימולציה מלאה ואיכותית ל-0$ עלות</strong>!
                  </span>
                </li>
              </ul>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                <span>מפתח Fal.ai (אופציונלי להפקות חיות):</span>
                {falApiKey && (
                  <span className="text-[10px] text-emerald-400 font-semibold">מחובר ✓</span>
                )}
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="הזן מפתח בפורמט: fal_key_..."
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-mono"
                  dir="ltr"
                />
              </div>
              <p className="text-[10px] text-zinc-500">
                ניתן להשאיר ריק. המערכת תפעל בצורה מושלמת במצב סימולציה מלא.
              </p>
            </div>

            <button
              onClick={handleSaveKey}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>שמור הגדרות מנוע</span>
              {keySavedToast && <CheckCircle2 className="w-4 h-4" />}
            </button>
            {keySavedToast && (
              <p className="text-center text-xs text-emerald-400 font-medium">המפתח נשמר בהצלחה!</p>
            )}
          </div>
        )}

        {/* TAB 3: APP STORE COMPLIANCE & DATA RESET */}
        {activeTab === 'compliance' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>תאימות הנחיות Apple App Store & Google Play</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                ClipTap AI כוללת מנגנוני בטיחות תוכן מחמירים:
              </p>
              <ul className="text-[11px] text-zinc-400 space-y-1 pr-1">
                <li>• לחצן דיווח מיידי על תוכן פוגעני בכל יצירה</li>
                <li>• סינון פרומפטים מובנה מפני תוכן אלים או בלתי חוקי</li>
                <li>• כפתור מחיקת היסטוריה ונתונים אישיים בלחיצה אחת</li>
                <li>• תמיכה בשחזור רכישות ומנגנון תשלום בטוח</li>
              </ul>
            </div>

            {/* Quick Credit Adjuster for testing */}
            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">יתרת קרדיטים לבדיקה</div>
                <div className="text-[11px] text-zinc-400">יתרה נוכחית: {credits} קרדיטים</div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onSetCredits(0)}
                  className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold text-rose-300 cursor-pointer"
                  title="בדיקת מצב ללא קרדיטים (Paywall Hard Gate)"
                >
                  אפס ל-0
                </button>
                <button
                  onClick={() => onSetCredits(credits + 5)}
                  className="px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-[10px] font-bold text-amber-300 cursor-pointer"
                >
                  +5 קרדיטים
                </button>
              </div>
            </div>

            {/* Clear All History */}
            <div className="pt-1">
              <button
                onClick={() => {
                  if (confirm('האם אתה בטוח שברצונך למחוק את כל היסטוריית היצירות והנתונים המקומיים?')) {
                    onResetData();
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>מחק היסטוריה ונתונים מקומיים</span>
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-zinc-800/80 text-center text-[10px] text-zinc-400">
          ClipTap AI v1.0 • נבנה עבור ביצועים מקסימליים ועלויות אפסיות
        </div>
      </div>
    </div>
  );
};
