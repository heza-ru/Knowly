'use client';

import { useSettings } from './useSettings';

const sounds = {
  correct: '/sounds/correct.mp3',
  incorrect: '/sounds/incorrect.mp3',
  navigation: '/sounds/navigation.mp3',
};

let audioCache: { [key: string]: HTMLAudioElement } = {};

function getAudio(src: string): HTMLAudioElement {
  if (!audioCache[src]) {
    audioCache[src] = new Audio(src);
    audioCache[src].volume = 0.5;
  }
  return audioCache[src];
}

export function useSound() {
  const { settings } = useSettings();

  const playSound = (sound: 'correct' | 'incorrect' | 'navigation') => {
    if (!settings.soundEnabled) return;

    try {
      const audio = getAudio(sounds[sound]);
      audio.currentTime = 0;
      audio.play().catch((error) => {
        // Silently fail if audio can't play (e.g., user hasn't interacted with page)
        console.debug('Sound playback failed:', error);
      });
    } catch (error) {
      // Silently fail
      console.debug('Sound error:', error);
    }
  };

  return { playSound };
}
