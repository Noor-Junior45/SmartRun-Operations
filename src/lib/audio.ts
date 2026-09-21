/**
 * Loud Order Alarm Sound Generator
 * Uses Web Audio API for zero-latency, cross-platform audio without external file requirements
 */

let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export type AlarmTone = 'siren' | 'two-tone' | 'chime' | 'pulse';

export const playOrderAlarmSound = (volume = 0.5, tone: AlarmTone = 'two-tone'): void => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const masterVol = Math.max(0.05, Math.min(1, volume));

    if (tone === 'siren') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.linearRampToValueAtTime(1200, now + 0.3);
      osc.frequency.linearRampToValueAtTime(600, now + 0.6);
      osc.frequency.linearRampToValueAtTime(1200, now + 0.9);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(masterVol * 0.25, now + 0.05);
      gain.gain.setValueAtTime(masterVol * 0.25, now + 0.85);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.05);
    } else if (tone === 'chime') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.15); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.30); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.45); // C6

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(masterVol * 0.4, now + 0.05);
      gain.gain.setValueAtTime(masterVol * 0.3, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.95);
    } else if (tone === 'pulse') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(980, now);
      gain.gain.setValueAtTime(masterVol * 0.4, now);
      gain.gain.setValueAtTime(0, now + 0.1);
      gain.gain.setValueAtTime(masterVol * 0.4, now + 0.2);
      gain.gain.setValueAtTime(0, now + 0.3);
      gain.gain.setValueAtTime(masterVol * 0.4, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.65);
    } else {
      // Default two-tone alert
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(587.33, now + 0.15);
      osc.frequency.setValueAtTime(880, now + 0.30);
      osc.frequency.setValueAtTime(1174.66, now + 0.45);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(masterVol * 0.35, now + 0.05);
      gain.gain.setValueAtTime(masterVol * 0.35, now + 0.55);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.75);
    }
  } catch (err) {
    console.warn('Audio alert could not play:', err);
  }
};
