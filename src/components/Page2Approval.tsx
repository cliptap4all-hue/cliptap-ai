import React from 'react';
import {
  ArrowRight,
  Check,
  Sparkles,
  Edit3,
  ShieldAlert,
  Coins,
  Film,
  Camera,
  Radio,
  Sliders,
  Copy,
} from 'lucide-react';
import { MediaType, PromptSuggestion, Resolution } from '../types';

interface Page2ApprovalProps {
  originalIdea: string;
  mediaType: MediaType;
  resolution: Resolution;
  prompts: PromptSuggestion[];
  selectedPromptIndex: number;
  onSelectPromptIndex: (index: number) => void;
  editedPromptText: string;
  onChangeEditedPrompt: (text: string) => void;
  onBackToPage1: () => void;
  onApproveAndGenerate: () => void;
  credits: number;
  onOpenPaywall: () => void;
  isGeneratingMedia: boolean;
}

export const Page2Approval: React.FC<Page2ApprovalProps> = ({
  originalIdea,
  mediaType,
  resolution,
  prompts,
  selectedPromptIndex,
  onSelectPromptIndex,
  editedPromptText,
  onChangeEditedPrompt,
  onBackToPage1,
  onApproveAndGenerate,
  credits,
  onOpenPaywall,
  isGeneratingMedia,
}) => {
  const [copied, setCopied] = React.useState(false);

  const selectedPrompt = prompts[selectedPromptIndex] || prompts[0];

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(editedPromptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAppendKeyword = (keyword: string) => {
    onChangeEditedPrompt(`${editedPromptText.trim()}, ${keyword}`);
  };

  const themeColors = {
    video: {
      accent: 'amber-400',
      borderActive: 'border-amber-500',
      bgActive: 'bg-amber-500/10',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      buttonGrad: 'from-amber-500 via-orange-500 to-amber-500',
      icon: Film,
    },
    image: {
      accent: 'emerald-400',
      borderActive: 'border-emerald-500',
      bgActive: 'bg-emerald-500/10',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      buttonGrad: 'from-emerald-500 via-teal-500 to-emerald-500',
      icon: Camera,
    },
    music: {
      accent: 'purple-400',
      borderActive: 'border-purple-500',
      bgActive: 'bg-purple-500/10',
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      buttonGrad: 'from-purple-500 via-indigo-500 to-purple-500',
      icon: Radio,
    },
  }[mediaType];

  const boosterKeywords = {
    video: ['4K resolution', 'cinematic lighting', 'slow motion 60fps', 'shallow depth of field'],
    image: ['8K ultra HD', 'photorealistic textures', 'volumetric fog', 'studio strobe lighting'],
    music: ['deep analog bass', 'lush spatial reverb', 'dynamic groove', 'crisp studio mastering'],
  }[mediaType];

  return (
    <div className="space-y-4 pb-8 animate-in fade-in duration-200">
      {/* Top Navigation & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToPage1}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 transition-colors cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>חזרה לעריכת הרעיון</span>
        </button>

        <div className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 flex items-center gap-1">
          <Coins className="w-3 h-3 text-amber-400" />
          <span>יתרה נוכחית: {credits} קרדיטים</span>
        </div>
      </div>

      {/* Original Idea Banner */}
      <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 text-right">
        <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>הרעיון המקורי שלך:</span>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700">
            איכות נבחרת: <strong className="text-amber-400">{resolution}</strong>
          </span>
        </div>
        <p className="text-sm font-semibold text-white leading-relaxed">
          "{originalIdea}"
        </p>
      </div>

      {/* 3 AI Style Prompt Cards */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bold text-zinc-300">בחירת הסגנון המוביל מתוך 3 הצעות:</span>
          <span className="text-[10px] text-zinc-400">לחיצה לבחירה ועריכה</span>
        </div>

        <div className="space-y-2.5">
          {prompts.map((p, idx) => {
            const isSelected = selectedPromptIndex === idx;
            return (
              <div
                key={p.id || idx}
                onClick={() => {
                  onSelectPromptIndex(idx);
                  onChangeEditedPrompt(p.prompt);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? `${themeColors.borderActive} ${themeColors.bgActive} shadow-lg shadow-${themeColors.accent}/10 ring-1 ring-${themeColors.accent}/30`
                    : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-850'
                }`}
              >
                {/* Header with Style badge & Select check */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-black px-2 py-0.5 rounded-lg border ${themeColors.badge}`}>
                      {p.titleHe}
                    </span>
                    <span className="text-[11px] font-semibold text-zinc-400">
                      {p.styleName}
                    </span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500 text-zinc-950 font-bold'
                        : 'border-zinc-700 bg-zinc-800'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                {/* Reasoning in Hebrew */}
                <p className="text-xs text-zinc-300 mb-2 leading-snug font-medium">
                  {p.reasoningHe}
                </p>

                {/* English Prompt Preview */}
                <div className="p-2 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-[11px] font-mono text-zinc-400 line-clamp-2 text-left" dir="ltr">
                  {p.prompt}
                </div>

                {/* Tags */}
                {p.tags && p.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/40"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Editable Prompt Box for Chosen Card */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span>פרומפט סופי להפקה (באנגלית - ניתן לעריכה):</span>
          </label>
          <button
            onClick={handleCopyPrompt}
            className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
            title="העתק פרומפט"
          >
            <Copy className="w-3 h-3" />
            <span>{copied ? 'הועתק!' : 'העתק'}</span>
          </button>
        </div>

        <textarea
          value={editedPromptText}
          onChange={(e) => onChangeEditedPrompt(e.target.value)}
          rows={3}
          dir="ltr"
          className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-xs font-mono text-zinc-200 focus:outline-none transition-colors shadow-inner resize-none leading-relaxed"
        />

        {/* Quick booster keywords */}
        <div className="pt-1">
          <div className="text-[10px] text-zinc-400 mb-1 flex items-center gap-1">
            <Sliders className="w-3 h-3 text-amber-400" />
            <span>תוספות מהירות לפרומפט:</span>
          </div>
          <div className="flex flex-wrap gap-1.5" dir="ltr">
            {boosterKeywords.map((kw) => (
              <button
                key={kw}
                onClick={() => handleAppendKeyword(kw)}
                className="px-2 py-0.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800 text-[10px] font-mono text-zinc-300 transition-colors cursor-pointer"
              >
                + {kw}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cost Guardrail & Approval Button */}
      <div className="pt-2 space-y-2.5">
        <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center text-xs space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-zinc-200 font-bold">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>שלב 2: אישור סופי וחיוב קרדיט</span>
          </div>
          <div className="text-[11px] text-zinc-400">
            עלות ההפקה: <strong className="text-amber-400">1 קרדיט</strong> מתוך יתרתך ({credits} קרדיטים זמינים).
          </div>
        </div>

        {/* Hard Paywall Gate: If credits < 1, triggers PaywallModal directly */}
        <button
          onClick={() => {
            if (credits < 1) {
              onOpenPaywall();
            } else {
              onApproveAndGenerate();
            }
          }}
          disabled={isGeneratingMedia || !editedPromptText.trim()}
          className={`w-full py-4 rounded-2xl bg-gradient-to-r ${themeColors.buttonGrad} text-zinc-950 font-black text-base shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {credits < 1 ? (
            <>
              <Coins className="w-5 h-5 text-zinc-950 fill-zinc-950" />
              <span>אזלו הקרדיטים - הוסף עכשיו להמשך ($0.99)</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-zinc-950 fill-zinc-950" />
              <span>אשר וייצר עכשיו 🚀 (1 קרדיט)</span>
            </>
          )}
        </button>

        {credits < 1 && (
          <p className="text-center text-[11px] text-amber-400/90 font-medium">
            * נדרש לפחות קרדיט 1 כדי לרנדר את המדיה. לחץ על הכפתור כדי להוסיף קרדיט מיידי.
          </p>
        )}
      </div>
    </div>
  );
};
