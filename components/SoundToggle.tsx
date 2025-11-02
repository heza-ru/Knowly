'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

interface SoundToggleProps {
  className?: string;
}

export function SoundToggle({ className = '' }: SoundToggleProps) {
  const { settings, updateSettings } = useSettings();

  const toggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  return (
    <button
      onClick={toggleSound}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)] border border-[var(--theme-border)] text-[var(--theme-text)] transition-colors ${className}`}
      aria-label={settings.soundEnabled ? 'Disable sound' : 'Enable sound'}
    >
      {settings.soundEnabled ? (
        <Volume2 className="w-5 h-5" />
      ) : (
        <VolumeX className="w-5 h-5" />
      )}
    </button>
  );
}
