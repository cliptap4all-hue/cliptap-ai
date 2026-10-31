import React from 'react';
import { X, AlertTriangle, ShieldCheck, Check } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaId: string;
}

const REPORT_REASONS = [
  'תוכן בלתי הולם או מיני',
  'אלימות, איומים או הסתה',
  'הפרת זכויות יוצרים או קניין רוחני',
  'מידע כוזב או מטעה',
  'תוכן מזיק או פוגעני אחר',
];

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, mediaId }) => {
  const [selectedReason, setSelectedReason] = React.useState(REPORT_REASONS[0]);
  const [details, setDetails] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-5 text-white shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-lg font-bold text-white">הדיווח התקבל בהצלחה</h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              תודה שאתה שומר על קהילת ClipTap בטוחה. המדיה נבדקת ע"י צוות הניטור.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">דיווח על תוכן פוגעני</h3>
                <p className="text-[11px] text-zinc-400">תאימות הנחיות הבטיחות של Apple & Google</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300">סיבת הדיווח:</label>
              <div className="space-y-1.5">
                {REPORT_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                      selectedReason === reason
                        ? 'border-rose-500/50 bg-rose-500/10 text-white'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                      className="accent-rose-500"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">פרטים נוספים (אופציונלי):</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="תאר בקצרה מה בעייתי בתוכן זה..."
                rows={2}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>שלח דיווח לצוות הסינון</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
