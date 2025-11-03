'use client';

import { useMemo } from 'react';
import { Howl } from 'howler';
import { useSettings } from './useSettings';

type SoundKey = 'correct' | 'incorrect' | 'navigation' | 'click' | 'select';

const soundSources: Record<SoundKey, string> = {
  correct: '/sounds/correct.mp3',
  incorrect: '/sounds/incorrect.mp3',
  navigation: '/sounds/navigation.mp3',
  click: '/sounds/navigation.mp3',
  select: '/sounds/navigation.mp3',
};

export function useSound() {
  const { settings } = useSettings();

  // Memoize Howl instances so they are created once per mount
  const howls = useMemo(() => {
    const entries = (Object.entries(soundSources) as Array<[SoundKey, string]>)
      .map(([key, src]) => {
        return [key, new Howl({ src: [src], volume: 0.5, preload: true })] as const;
      });
    return Object.fromEntries(entries) as Record<SoundKey, Howl>;
  }, []);

  // Simple WebAudio fallback beep if files are missing/unavailable
  const playFallbackBeep = (type: SoundKey) => {
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      // Set frequency based on type
      const freq = type === 'correct' ? 880 : type === 'incorrect' ? 220 : type === 'select' ? 660 : 440;
      osc.frequency.value = freq;
      // Envelope
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // no-op
    }
  };

  const playSound = (sound: SoundKey) => {
    if (!settings.soundEnabled) return;
    // Best-effort haptics on supported devices
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        const pattern = sound === 'correct' ? [10, 30, 10] : sound === 'incorrect' ? [30, 40, 30] : [12];
        // @ts-ignore
        navigator.vibrate(pattern);
      }
    } catch {}
    const howl = howls[sound];
    if (!howl) return;
    try {
      // Play concurrently and from start
      howl.stop();
      const id = howl.play();
      if (typeof id !== 'number') {
        playFallbackBeep(sound);
      }
    } catch {
      playFallbackBeep(sound);
    }
  };

  return { playSound };
}
