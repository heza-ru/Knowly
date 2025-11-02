'use client';

import { Languages } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className = '' }: LanguageToggleProps) {
  const { settings, updateSettings } = useSettings();

  const toggleLanguage = () => {
    updateSettings({
      appLanguage: settings.appLanguage === 'english' ? 'hindi' : 'english',
    });
  };

  const translations = {
    english: {
      label: 'English',
      labelHindi: 'अंग्रेज़ी',
    },
    hindi: {
      label: 'हिंदी',
      labelHindi: 'Hindi',
    },
  };

  const t = translations[settings.appLanguage];

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)] border border-[var(--theme-border)] text-[var(--theme-text)] transition-colors ${className}`}
      aria-label="Toggle language"
    >
      <Languages className="w-5 h-5" />
      <span className="font-medium">{t.label}</span>
    </button>
  );
}
