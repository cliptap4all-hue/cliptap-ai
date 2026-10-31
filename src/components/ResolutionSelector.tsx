import React from 'react';
import { Monitor, Sparkles, Zap, Film } from 'lucide-react';
import { MediaType, Resolution } from '../types';

interface ResolutionSelectorProps {
  mediaType: MediaType;
  selectedResolution: Resolution;
  onSelectResolution: (res: Resolution) => void;
}

interface ResolutionOption {
  id: Resolution;
  label: string;
  badge: string;
  badgeColor: string;
  videoDesc: string;
  imageDesc: string;
  musicDesc: string;
  isPopular?: boolean;
}

const RESOLUTION_OPTIONS: ResolutionOption[] = [
  {
    id: '480p',
    label: '480p (SD)',
    badge: 'הכי חסכוני ⚡',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    videoDesc: 'רינדור מהיר ביותר • עלות מינימלית',
    imageDesc: 'טיוטה מהירה 768px • אפס שיהוי',
    musicDesc: '128kbps • סטרימינג קל',
  },
  {
    id: '720p',
    label: '720p (HD)',
    badge: 'מאוזן מומלץ ✨',
    badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    videoDesc: 'חדות מעולה • מותאם לסמארטפונים ורשתות',
    imageDesc: '1024x1024 ריאליסטי • Flux HD',
    musicDesc: '256kbps • איכות סאונד גבוהה',
    isPopular: true,
  },
  {
    id: '1080p',
    label: '1080p (Full HD)',
    badge: 'איכות שיא 💎',
    badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    videoDesc: 'רזולוציה קולנועית מקסימלית 1080p',
    imageDesc: '1920x1080 / Full HD • פיקסל פרפקט',
    musicDesc: '320kbps • אולפן מאסטר High-Fidelity',
  },
];

export const ResolutionSelector: React.FC<ResolutionSelectorProps> = ({
  mediaType,
  selectedResolution,
  onSelectResolution,
}) => {
  const accentTheme = {
    video: {
      activeBorder: 'border-amber-500',
      activeBg: 'bg-amber-500/15',
      activeText: 'text-amber-400',
      ring: 'ring-amber-500/30',
    },
    image: {
      activeBorder: 'border-emerald-500',
      activeBg: 'bg-emerald-500/15',
      activeText: 'text-emerald-400',
      ring: 'ring-emerald-500/30',
    },
    music: {
      activeBorder: 'border-purple-500',
      activeBg: 'bg-purple-500/15',
      activeText: 'text-purple-400',
      ring: 'ring-purple-500/30',
    },
  }[mediaType];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs px-1">
        <label className="font-bold text-zinc-300 flex items-center gap-1.5">
          <Monitor className="w-3.5 h-3.5 text-amber-400" />
          <span>בחירת רזולוציה ואיכות:</span>
        </label>
        <span className="text-[10px] text-zinc-400 font-mono">
          נבחר: <strong className={accentTheme.activeText}>{selectedResolution}</strong>
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {RESOLUTION_OPTIONS.map((opt) => {
          const isSelected = selectedResolution === opt.id;
          const desc =
            mediaType === 'video'
              ? opt.videoDesc
              : mediaType === 'image'
              ? opt.imageDesc
              : opt.musicDesc;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectResolution(opt.id)}
              className={`p-2.5 rounded-2xl border text-right transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? `${accentTheme.activeBorder} ${accentTheme.activeBg} ${accentTheme.activeText} shadow-md ring-1 ${accentTheme.ring}`
                  : 'border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-black text-xs font-mono tracking-tight text-white">
                  {opt.id}
                </span>
                <span className={`text-[8.5px] font-bold px-1 py-0.5 rounded border ${opt.badgeColor}`}>
                  {opt.id === '480p' ? 'חסכוני' : opt.id === '720p' ? 'מומלץ' : 'שיא'}
                </span>
              </div>

              {/* Subtext description */}
              <div className="text-[9.5px] leading-tight text-zinc-400 line-clamp-2 mt-1">
                {desc}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
