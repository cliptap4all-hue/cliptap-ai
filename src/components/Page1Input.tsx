import React from 'react';
import {
  Video,
  Image as ImageIcon,
  Music,
  Sparkles,
  Upload,
  X,
  Layers,
  Check,
  Loader2,
  Wand2,
} from 'lucide-react';
import { MediaType, Resolution } from '../types';
import { stitchTwoImages } from '../utils/stitchImages';
import { ResolutionSelector } from './ResolutionSelector';

interface Page1InputProps {
  mediaType: MediaType;
  onSelectMediaType: (type: MediaType) => void;
  resolution: Resolution;
  onSelectResolution: (res: Resolution) => void;
  idea: string;
  onChangeIdea: (val: string) => void;
  referenceImage: string | null;
  onSetReferenceImage: (img: string | null) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const INSPIRATION_CHIPS: Record<MediaType, string[]> = {
  video: [
    'חיבוק מרגש מתמונה',
    'גלישת גלים בקולנועיות בשקיעה',
    'הנפשת תמונה ישנה של המשפחה',
    'אקשן בהילוך איטי 60fps',
    'טיסת רחפן מעל עיר עתידנית',
    'חתלתול משחק בשלג ברכות',
  ],
  image: [
    'צילום ריאליסטי 8K עם עדשת 85mm',
    'סגנון אנימה יפני מרהיב',
    'פורטרט קולנועי עם תאורת ניאון',
    'אמנות דיגיטלית סוריאליסטית',
    'ציור שמן אימפרסיוניסטי',
    'עיצוב מוצר עתידני מינימליסטי',
  ],
  music: [
    'רוק וגראנג שנות ה-90 עם דיסטורשן',
    'סולו גיטרה חשמלית מחשמל',
    'מוזיקת רקע מרגשת לפסנתר ומיתרים',
    'ביט אלקטרוני קצבי לריצה',
    'ציל-הופ רגוע ללימודים ועבודה',
    'פסקול סרטים אפי ומסתורי',
  ],
};

export const Page1Input: React.FC<Page1InputProps> = ({
  mediaType,
  onSelectMediaType,
  resolution,
  onSelectResolution,
  idea,
  onChangeIdea,
  referenceImage,
  onSetReferenceImage,
  onSubmit,
  isLoading,
}) => {
  const [stitchMode, setStitchMode] = React.useState(false);
  const [photo1, setPhoto1] = React.useState<string | null>(null);
  const [photo2, setPhoto2] = React.useState<string | null>(null);
  const [isStitching, setIsStitching] = React.useState(false);

  const fileInputRef1 = React.useRef<HTMLInputElement | null>(null);
  const fileInputRef2 = React.useRef<HTMLInputElement | null>(null);
  const singleFileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Handle single photo upload
  const handleSingleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onSetReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle 2-photo stitch
  const handlePhoto1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const res = reader.result as string;
        setPhoto1(res);
        if (photo2) {
          stitch(res, photo2);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhoto2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const res = reader.result as string;
        setPhoto2(res);
        if (photo1) {
          stitch(photo1, res);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const stitch = async (p1: string, p2: string) => {
    try {
      setIsStitching(true);
      const stitched = await stitchTwoImages(p1, p2);
      onSetReferenceImage(stitched);
    } catch (err) {
      console.error('Error stitching photos:', err);
    } finally {
      setIsStitching(false);
    }
  };

  const clearPhotos = () => {
    setPhoto1(null);
    setPhoto2(null);
    onSetReferenceImage(null);
  };

  const currentTheme = {
    video: {
      border: 'border-amber-500',
      bg: 'bg-amber-500/15',
      text: 'text-amber-400',
      badge: 'וידאו 480p • Fal.ai Wan',
      glow: 'shadow-amber-500/20',
      btnGrad: 'from-amber-500 via-orange-500 to-amber-500',
    },
    image: {
      border: 'border-emerald-500',
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      badge: 'תמונות 8K • Pollinations Flux (חינם)',
      glow: 'shadow-emerald-500/20',
      btnGrad: 'from-emerald-500 via-teal-500 to-emerald-500',
    },
    music: {
      border: 'border-purple-500',
      bg: 'bg-purple-500/15',
      text: 'text-purple-400',
      badge: 'מוזיקה וסאונד • Stable Audio',
      glow: 'shadow-purple-500/20',
      btnGrad: 'from-purple-500 via-indigo-500 to-purple-500',
    },
  }[mediaType];

  return (
    <div className="space-y-4 pb-6">
      {/* 3 Big Mode Tabs */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
          <span className="font-bold text-zinc-300">בחר סוג מדיה ליצירה:</span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${currentTheme.bg} ${currentTheme.text} border ${currentTheme.border}/40`}>
            {currentTheme.badge}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* VIDEO TAB */}
          <button
            onClick={() => onSelectMediaType('video')}
            className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mediaType === 'video'
                ? 'border-amber-500 bg-amber-500/15 text-amber-400 shadow-lg shadow-amber-500/15 scale-[1.02]'
                : 'border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
            }`}
          >
            <div className={`p-2 rounded-xl ${mediaType === 'video' ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'}`}>
              <Video className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xs">וידאו (Video)</span>
            <span className="text-[10px] opacity-75">~0.015$ או סימולציה</span>
          </button>

          {/* IMAGE TAB */}
          <button
            onClick={() => onSelectMediaType('image')}
            className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mediaType === 'image'
                ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400 shadow-lg shadow-emerald-500/15 scale-[1.02]'
                : 'border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
            }`}
          >
            <div className={`p-2 rounded-xl ${mediaType === 'image' ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'}`}>
              <ImageIcon className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xs">תמונה (Image)</span>
            <span className="text-[10px] text-emerald-400 font-bold">100% חינם</span>
          </button>

          {/* MUSIC TAB */}
          <button
            onClick={() => onSelectMediaType('music')}
            className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mediaType === 'music'
                ? 'border-purple-500 bg-purple-500/15 text-purple-400 shadow-lg shadow-purple-500/15 scale-[1.02]'
                : 'border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
            }`}
          >
            <div className={`p-2 rounded-xl ${mediaType === 'music' ? 'bg-purple-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'}`}>
              <Music className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xs">מוזיקה (Music)</span>
            <span className="text-[10px] opacity-75">~0.01$ או סימולציה</span>
          </button>
        </div>
      </div>

      {/* Resolution Selector Component */}
      <ResolutionSelector
        mediaType={mediaType}
        selectedResolution={resolution}
        onSelectResolution={onSelectResolution}
      />

      {/* Idea Textarea Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs px-1">
          <label className="font-bold text-zinc-200 flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
            <span>תאר את הרעיון שלך בכמה מילים:</span>
          </label>
          <span className="text-[11px] text-zinc-400">{idea.length} תווים</span>
        </div>

        <div className="relative">
          <textarea
            value={idea}
            onChange={(e) => onChangeIdea(e.target.value)}
            placeholder={
              mediaType === 'video'
                ? 'לדוגמה: גולש על גל ענק בשקיעה עוצרת נשימה...'
                : mediaType === 'music'
                ? 'לדוגמה: סולו גיטרה בסגנון רוק שנות ה-90 עם תופים חיים...'
                : 'לדוגמה: חתול אסטרונאוט מרחף בחלל ליד כדור הארץ...'
            }
            rows={3}
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-2xl p-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors shadow-inner resize-none"
          />

          {idea && (
            <button
              onClick={() => onChangeIdea('')}
              className="absolute left-3 bottom-3 p-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="נקה טקסט"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Primary Submit Button (Right below text input) */}
      <div className="pt-0.5 space-y-1.5">
        <button
          onClick={onSubmit}
          disabled={isLoading || !idea.trim()}
          className={`w-full py-4 rounded-2xl bg-gradient-to-r ${currentTheme.btnGrad} text-zinc-950 font-black text-base shadow-xl ${currentTheme.glow} active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-zinc-950" />
              <span>Gemini מנסח 3 פרומפטים מקצועיים...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-zinc-950 fill-zinc-950" />
              <span>שדרג לי לפרומפט מקצועי ✨ (חינם)</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 text-center">
          <span>שלב 1: כתיבת פרומפט ב-0$</span>
          <span>•</span>
          <span>חיוב קרדיט יתבצע רק לאחר אישורך בשלב 2</span>
        </div>
      </div>

      {/* Quick Inspiration Chips */}
      <div className="space-y-1.5 pt-1">
        <div className="text-[11px] font-semibold text-zinc-400 px-1">
          רעיונות מהירים בלחיצה אחת:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {INSPIRATION_CHIPS[mediaType].map((chip) => (
            <button
              key={chip}
              onClick={() => onChangeIdea(chip)}
              className="px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-850 text-xs text-zinc-300 hover:text-white transition-all cursor-pointer active:scale-95 text-right"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Optional Photo Reference for Video Mode */}
      {mediaType === 'video' && (
        <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-200">
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>הנפשת תמונה קיימת (Image-to-Video)</span>
            </div>
            <button
              onClick={() => {
                setStitchMode(!stitchMode);
                clearPhotos();
              }}
              className="text-[10px] text-amber-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <Layers className="w-3 h-3" />
              <span>{stitchMode ? 'חזור לתמונה בודדת' : 'חיבור 2 תמונות לסרטון אחד'}</span>
            </button>
          </div>

          <p className="text-[11px] text-zinc-400">
            {stitchMode
              ? 'העלה 2 תמונות שונות (למשל שני אנשים) והמערכת תתפור אותן לסרטון מפגש/חיבוק מרגש.'
              : 'העלה תמונה שברצונך להפיח בה חיים ולהנפיש אותה לוידאו בתנועה חלקה.'}
          </p>

          {/* Reference Image Preview or Upload Triggers */}
          {referenceImage ? (
            <div className="relative rounded-xl overflow-hidden border border-amber-500/50 bg-black max-h-48 flex items-center justify-center group">
              <img
                src={referenceImage}
                alt="Reference"
                className="max-h-48 w-full object-cover rounded-xl"
              />
              <button
                onClick={clearPhotos}
                className="absolute top-2 left-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white cursor-pointer"
                title="הסר תמונה"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-bold">
                תמונת ייחוס מוכנה לוידאו ✓
              </div>
            </div>
          ) : stitchMode ? (
            <div className="grid grid-cols-2 gap-2">
              {/* Photo 1 */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef1}
                  onChange={handlePhoto1Change}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef1.current?.click()}
                  className="w-full h-24 rounded-xl border border-dashed border-zinc-700 hover:border-amber-500/70 bg-zinc-950 flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-colors"
                >
                  {photo1 ? (
                    <img src={photo1} className="w-full h-full object-cover rounded-lg" alt="1" />
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-zinc-500 mb-1" />
                      <span className="text-[11px] font-bold text-zinc-300">תמונה 1</span>
                      <span className="text-[9px] text-zinc-400">לחץ להעלאה</span>
                    </>
                  )}
                </button>
              </div>

              {/* Photo 2 */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef2}
                  onChange={handlePhoto2Change}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef2.current?.click()}
                  className="w-full h-24 rounded-xl border border-dashed border-zinc-700 hover:border-amber-500/70 bg-zinc-950 flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-colors"
                >
                  {photo2 ? (
                    <img src={photo2} className="w-full h-full object-cover rounded-lg" alt="2" />
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-zinc-500 mb-1" />
                      <span className="text-[11px] font-bold text-zinc-300">תמונה 2</span>
                      <span className="text-[9px] text-zinc-400">לחץ להעלאה</span>
                    </>
                  )}
                </button>
              </div>

              {isStitching && (
                <div className="col-span-2 text-center text-xs text-amber-400 font-semibold flex items-center justify-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>מעבד ומחבר תמונות על גבי קנבס...</span>
                </div>
              )}
            </div>
          ) : (
            <div>
              <input
                type="file"
                accept="image/*"
                ref={singleFileInputRef}
                onChange={handleSingleUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => singleFileInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-xl border border-dashed border-zinc-700 hover:border-amber-500/70 bg-zinc-950/60 flex items-center justify-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 text-amber-400" />
                <span>העלה תמונה להנפשה (אופציונלי)</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
