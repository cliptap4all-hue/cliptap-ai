import React from 'react';
import {
  Download,
  Share2,
  RotateCcw,
  Flag,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Loader2,
  ExternalLink,
  ZoomIn,
  Clock,
  Film,
  Camera,
  Music,
  Trash2,
  Wrench,
} from 'lucide-react';
import { GenerationResult, MediaType } from '../types';

interface Page3ResultProps {
  isGenerating: boolean;
  result: GenerationResult | null;
  history: GenerationResult[];
  onSelectFromHistory: (item: GenerationResult) => void;
  onDeleteFromHistory: (id: string) => void;
  onNewCreation: () => void;
  onOpenReportModal: (mediaId: string) => void;
  hasUsedRetake: boolean;
  hasDownloaded: boolean;
  onOpenSmartFix: () => void;
  onDownloadClicked: () => void;
}

export const Page3Result: React.FC<Page3ResultProps> = ({
  isGenerating,
  result,
  history,
  onSelectFromHistory,
  onDeleteFromHistory,
  onNewCreation,
  onOpenReportModal,
  hasUsedRetake,
  hasDownloaded,
  onOpenSmartFix,
  onDownloadClicked,
}) => {
  // Audio player state
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);
  const [audioProgress, setAudioProgress] = React.useState(0);
  const [audioDuration, setAudioDuration] = React.useState(30);
  const [isMuted, setIsMuted] = React.useState(false);

  // Video player state
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  // Image zoom state
  const [isZoomed, setIsZoomed] = React.useState(false);

  // Generation step animation
  const [activeStep, setActiveStep] = React.useState(0);
  const [progressPercent, setProgressPercent] = React.useState(15);

  React.useEffect(() => {
    if (isGenerating) {
      setActiveStep(0);
      setProgressPercent(20);
      const t1 = setTimeout(() => {
        setActiveStep(1);
        setProgressPercent(45);
      }, 1200);
      const t2 = setTimeout(() => {
        setActiveStep(2);
        setProgressPercent(75);
      }, 2600);
      const t3 = setTimeout(() => {
        setActiveStep(3);
        setProgressPercent(95);
      }, 4200);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else {
      setProgressPercent(100);
      setActiveStep(3);
    }
  }, [isGenerating]);

  // Audio time updates
  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      const cur = audioRef.current.currentTime;
      const dur = audioRef.current.duration || 30;
      setAudioProgress((cur / dur) * 100);
      setAudioDuration(dur);
    }
  };

  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().catch(console.error);
      setIsPlayingAudio(true);
    }
  };

  const handleAudioSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setAudioProgress(val);
    if (audioRef.current) {
      audioRef.current.currentTime = (val / 100) * audioDuration;
    }
  };

  // WhatsApp Share handler
  const handleShareWhatsApp = () => {
    if (!result) return;
    const text = `יצרתי זה עתה מדיה מדהימה ב-ClipTap AI! 🚀\nרעיון: ${result.originalIdea}\nסגנון: ${result.styleTitleHe}\nמנוע: ${result.engine}\nתראה כאן: ${result.mediaUrl}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Real download handler
  const handleDownload = async () => {
    if (!result) return;
    onDownloadClicked();
    try {
      const res = await fetch(result.mediaUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      const ext = result.mediaType === 'video' ? 'mp4' : result.mediaType === 'music' ? 'mp3' : 'jpg';
      a.download = `ClipTap_${result.mediaType}_${Date.now()}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      // Fallback
      window.open(result.mediaUrl, '_blank');
    }
  };

  const steps = [
    'מנתח פרומפט ובודק מודל אופטימלי...',
    'מפעיל מנוע AI חסכוני (Zero/Low Cost)...',
    'מרנדר מדיה ומסנכרן פריימים...',
    'מבצע אופטימיזציה סופית לאיכות שיא...',
  ];

  // While generating
  if (isGenerating) {
    return (
      <div className="py-12 px-2 text-center space-y-6 animate-in fade-in duration-300">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-zinc-800" />
          <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-extrabold text-white">היצירה שלך בהפקה!</h3>
          <p className="text-xs text-zinc-400">
            אנחנו מפיקים את המדיה בדיוק לפי הפרומפט המאושר
          </p>
        </div>

        {/* Progress bar */}
        <div className="max-w-xs mx-auto space-y-1.5">
          <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-purple-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
            <span>מעבד פריימים</span>
            <span>{progressPercent}%</span>
          </div>
        </div>

        {/* Step list */}
        <div className="max-w-xs mx-auto text-right space-y-2.5 pt-2">
          {steps.map((step, idx) => {
            const isDone = activeStep > idx;
            const isCurrent = activeStep === idx;
            return (
              <div
                key={step}
                className={`flex items-center gap-2.5 text-xs transition-colors ${
                  isDone
                    ? 'text-emerald-400 font-medium'
                    : isCurrent
                    ? 'text-white font-bold'
                    : 'text-zinc-600'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-zinc-700 shrink-0" />
                )}
                <span>{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // If no result yet
  if (!result) {
    return (
      <div className="py-16 text-center space-y-4">
        <Sparkles className="w-10 h-10 text-zinc-700 mx-auto" />
        <p className="text-sm text-zinc-400">טרם נוצרה מדיה בסשן זה</p>
        <button
          onClick={onNewCreation}
          className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs"
        >
          התחל יצירה חדשה
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-8 animate-in fade-in duration-300">
      {/* Top Media Info Bar */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center gap-1.5 font-bold text-zinc-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>הפקה הושלמה בהצלחה!</span>
        </div>

        <div className="flex items-center gap-1.5">
          {result.resolution && (
            <span className="text-[10px] text-amber-300 font-mono font-bold bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
              {result.resolution}
            </span>
          )}
          <span className="text-[10px] text-zinc-400 font-mono bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
            {result.engine}
          </span>
        </div>
      </div>

      {/* DEDICATED MEDIA PLAYER */}
      <div className="rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl relative">
        {/* VIDEO PLAYER */}
        {result.mediaType === 'video' && (
          <div className="relative bg-black aspect-video flex items-center justify-center group">
            <video
              ref={videoRef}
              src={result.mediaUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              controls
              className="w-full h-full object-contain"
            />

            {/* ClipTap Watermark Badge */}
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold flex items-center gap-1 pointer-events-none shadow-md">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Created with ClipTap AI</span>
            </div>
          </div>
        )}

        {/* IMAGE VIEWER */}
        {result.mediaType === 'image' && (
          <div className="relative bg-black aspect-square flex items-center justify-center group overflow-hidden">
            <img
              src={result.mediaUrl}
              alt={result.prompt}
              className={`w-full h-full object-cover transition-transform duration-300 ${
                isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            />

            {/* ClipTap Watermark Badge */}
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold flex items-center gap-1 pointer-events-none shadow-md">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Created with ClipTap AI</span>
            </div>

            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="absolute bottom-3 left-3 p-1.5 rounded-full bg-black/70 hover:bg-black text-white text-xs backdrop-blur-sm cursor-pointer"
              title="זום"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* MUSIC CUSTOM AUDIO PLAYER */}
        {result.mediaType === 'music' && (
          <div className="p-6 bg-gradient-to-br from-purple-950/40 via-zinc-900 to-zinc-950 space-y-4">
            <audio
              ref={audioRef}
              src={result.mediaUrl}
              onTimeUpdate={handleAudioTimeUpdate}
              onEnded={() => setIsPlayingAudio(false)}
            />

            {/* Vinyl Graphic with animated equalizer */}
            <div className="flex items-center gap-4">
              <div
                className={`w-18 h-18 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-indigo-600 p-[2px] shadow-lg shadow-purple-500/20 ${
                  isPlayingAudio ? 'animate-spin-slow' : ''
                }`}
              >
                <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                  <Music className="w-8 h-8 text-purple-400" />
                </div>
              </div>

              <div className="flex-1 space-y-1">
                <div className="text-xs font-black text-purple-300 uppercase tracking-wider">
                  רצועת סאונד מקורית
                </div>
                <h4 className="text-sm font-bold text-white line-clamp-1">
                  {result.sampleTitle || result.styleTitleHe}
                </h4>
                <div className="text-[11px] text-zinc-400">
                  משך: ~30 שניות • סאונד סטריאו 320kbps
                </div>
              </div>
            </div>

            {/* Animated Equalizer Visualizer Bars */}
            <div className="h-10 bg-zinc-950/80 rounded-2xl border border-zinc-800 flex items-center justify-center gap-1.5 px-4 py-2">
              <div className={`w-1.5 rounded-full bg-purple-500 ${isPlayingAudio ? 'animate-eq-1' : 'h-2'}`} />
              <div className={`w-1.5 rounded-full bg-pink-500 ${isPlayingAudio ? 'animate-eq-2' : 'h-3'}`} />
              <div className={`w-1.5 rounded-full bg-amber-400 ${isPlayingAudio ? 'animate-eq-3' : 'h-1.5'}`} />
              <div className={`w-1.5 rounded-full bg-emerald-400 ${isPlayingAudio ? 'animate-eq-4' : 'h-4'}`} />
              <div className={`w-1.5 rounded-full bg-indigo-500 ${isPlayingAudio ? 'animate-eq-5' : 'h-2.5'}`} />
              <div className={`w-1.5 rounded-full bg-purple-400 ${isPlayingAudio ? 'animate-eq-6' : 'h-3.5'}`} />
              <div className={`w-1.5 rounded-full bg-pink-400 ${isPlayingAudio ? 'animate-eq-2' : 'h-2'}`} />
              <div className={`w-1.5 rounded-full bg-amber-500 ${isPlayingAudio ? 'animate-eq-4' : 'h-3'}`} />
            </div>

            {/* Progress Bar & Timing */}
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max="100"
                value={audioProgress}
                onChange={handleAudioSeek}
                className="w-full accent-purple-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                <span>
                  {Math.floor(((audioProgress / 100) * audioDuration) / 60)}:
                  {String(Math.floor(((audioProgress / 100) * audioDuration) % 60)).padStart(2, '0')}
                </span>
                <span>
                  {Math.floor(audioDuration / 60)}:{String(Math.floor(audioDuration % 60)).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Audio Controls */}
            <div className="flex items-center justify-center gap-4 pt-1">
              <button
                onClick={togglePlayAudio}
                className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 transition-all active:scale-95 cursor-pointer"
              >
                {isPlayingAudio ? (
                  <Pause className="w-5 h-5 fill-white" />
                ) : (
                  <Play className="w-5 h-5 fill-white mr-0.5" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Prompt summary in card */}
        <div className="p-3.5 bg-zinc-950/80 border-t border-zinc-800/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span className="font-bold text-zinc-300">פרומפט מאושר:</span>
            <span className="text-amber-400 font-semibold">{result.styleTitleHe}</span>
          </div>
          <p className="text-xs text-zinc-300 line-clamp-2 font-mono text-left" dir="ltr">
            {result.prompt}
          </p>
        </div>
      </div>

      {/* Locked Concept Retake (תיקון ממוקד חינם - 1/1) */}
      {!hasUsedRetake ? (
        <button
          onClick={onOpenSmartFix}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 hover:from-amber-500/30 hover:to-yellow-500/25 border border-amber-400/60 text-amber-300 text-xs font-black shadow-lg shadow-amber-500/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Wrench className="w-4 h-4 text-amber-400" />
          <span>🛠️ לא מרוצה? דייק תוצאה זו בחינם (תיקון 1/1)</span>
        </button>
      ) : (
        <div className="py-2.5 px-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center text-xs text-zinc-400 flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>התיקון החינמי נוצל בהצלחה עבור יצירה זו (1/1) ✓</span>
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={handleDownload}
          className="py-3 px-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>שמור למכשיר (HD)</span>
        </button>

        <button
          onClick={handleShareWhatsApp}
          className="py-3 px-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
        >
          <Share2 className="w-4 h-4 text-emerald-400" />
          <span>שתף בוואטסאפ</span>
        </button>
      </div>

      {/* Create New Media Button */}
      <button
        onClick={onNewCreation}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-zinc-950 font-black text-sm shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <RotateCcw className="w-4 h-4 text-zinc-950 stroke-[2.5]" />
        <span>צור יצירה חדשה (חזרה לדף 1)</span>
      </button>

      {/* Apple / Google Store Compliance: Report Button */}
      <div className="pt-1 text-center">
        <button
          onClick={() => onOpenReportModal(result.id)}
          className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
        >
          <Flag className="w-3.5 h-3.5" />
          <span>🚩 דווח על תוכן פוגעני (Report Content)</span>
        </button>
      </div>

      {/* MY CREATIONS HISTORY */}
      {history.length > 0 && (
        <div className="pt-4 border-t border-zinc-800/80 space-y-2.5">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-extrabold text-zinc-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>היסטוריית היצירות שלי ({history.length}):</span>
            </span>
            <span className="text-[10px] text-zinc-400">נשמר אוטומטית במכשיר</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {history.slice(0, 6).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectFromHistory(item)}
                className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/80 hover:border-amber-500/50 p-2 transition-all cursor-pointer overflow-hidden text-right"
              >
                {/* Media icon badge */}
                <div className="h-24 rounded-xl overflow-hidden bg-black relative flex items-center justify-center mb-1.5">
                  {item.mediaType === 'image' && (
                    <img src={item.mediaUrl} className="w-full h-full object-cover" alt="item" />
                  )}
                  {item.mediaType === 'video' && (
                    <div className="relative w-full h-full flex items-center justify-center bg-zinc-950">
                      <Film className="w-8 h-8 text-amber-400" />
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] text-amber-300 font-bold">
                        וידאו
                      </div>
                    </div>
                  )}
                  {item.mediaType === 'music' && (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-950">
                      <Music className="w-8 h-8 text-purple-400" />
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] text-purple-300 font-bold">
                        מוזיקה
                      </div>
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFromHistory(item.id);
                    }}
                    className="absolute top-1 left-1 p-1 rounded-full bg-black/70 hover:bg-rose-600 text-zinc-400 hover:text-white transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                    title="מחק מההיסטוריה"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-[11px] font-bold text-white line-clamp-1">
                  {item.originalIdea}
                </div>
                <div className="text-[10px] text-zinc-400 flex items-center justify-between mt-0.5">
                  <span>{item.styleTitleHe}</span>
                  <span className="font-mono text-[9px]">
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
