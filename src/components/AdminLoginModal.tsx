import React, { useState } from 'react';
import { Lock, ShieldAlert, KeyRound, X, Check, Eye, EyeOff } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const MASTER_PIN = '7788';

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [showPin, setShowPin] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === MASTER_PIN) {
      setError(false);
      setPin('');
      onSuccess();
    } else {
      setError(true);
      setPin('');
    }
  };

  const handleQuickDigit = (digit: string) => {
    if (pin.length < 4) {
      const next = pin + digit;
      setPin(next);
      if (next.length === 4) {
        if (next === MASTER_PIN) {
          setError(false);
          setPin('');
          onSuccess();
        } else {
          setError(true);
          setTimeout(() => setPin(''), 500);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-xs bg-zinc-900 border border-amber-500/40 rounded-3xl p-6 text-white shadow-2xl relative text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Lock Icon */}
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto mb-3 text-amber-400 shadow-lg shadow-amber-500/20">
          <Lock className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-black text-white">כניסת מנהל מאובטחת</h3>
        <p className="text-xs text-zinc-400 mt-1">
          גישה מוגבלת לבעל האפליקציה בלבד.
        </p>

        {/* PIN Dots */}
        <div className="my-5 flex items-center justify-center gap-3">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  isFilled
                    ? 'bg-amber-400 border-amber-400 scale-110 shadow-md shadow-amber-400/50'
                    : error
                    ? 'border-rose-500 bg-rose-500/20'
                    : 'border-zinc-700 bg-zinc-800'
                }`}
              />
            );
          })}
        </div>

        {error && (
          <div className="text-xs text-rose-400 font-bold mb-3 animate-bounce flex items-center justify-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>קוד PIN שגוי. נסה שוב.</span>
          </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto mb-3" dir="ltr">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '✓'].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                if (key === 'C') setPin('');
                else if (key === '✓') {
                  if (pin === MASTER_PIN) onSuccess();
                  else setError(true);
                } else handleQuickDigit(key);
              }}
              className="h-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-sm font-black transition-all flex items-center justify-center cursor-pointer border border-zinc-700 text-zinc-100"
            >
              {key}
            </button>
          ))}
        </div>

        <div className="text-[10px] text-zinc-400 font-mono">
          קוד ברירת מחדל לבעלים: 7788
        </div>
      </div>
    </div>
  );
};
