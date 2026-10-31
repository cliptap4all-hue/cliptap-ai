import confetti from 'canvas-confetti';

export function triggerSuccessConfetti() {
  try {
    // Left burst
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.7 },
      colors: ['#f59e0b', '#10b981', '#8b5cf6', '#ec4899'],
    });
    // Right burst
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.7 },
      colors: ['#f59e0b', '#10b981', '#8b5cf6', '#3b82f6'],
    });
  } catch (e) {
    console.debug('Confetti animation suppressed', e);
  }
}
