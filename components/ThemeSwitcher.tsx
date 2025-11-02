'use client';

import { Check } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useSettings } from '@/hooks/useSettings';

interface ThemeSwitcherProps {
  className?: string;
}

export function ThemeSwitcher({ className = '' }: ThemeSwitcherProps) {
  const { themes, currentTheme, setTheme, themeId } = useTheme();
  const { settings } = useSettings();

  const getThemeLabel = (themeName: string, themeNameHindi: string) => {
    return settings.appLanguage === 'hindi' ? themeNameHindi : themeName;
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {themes.map(theme => (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className="relative p-4 rounded-lg border-2 transition-all hover:scale-105"
            style={{
              backgroundColor: theme.surface,
              borderColor: themeId === theme.id ? theme.primary : theme.border,
            }}
            aria-label={`Switch to ${getThemeLabel(theme.name, theme.nameHindi)} theme`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-left" style={{ color: theme.text }}>
                  {getThemeLabel(theme.name, theme.nameHindi)}
                </div>
                <div className="flex gap-1 mt-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: theme.bg }}
                  />
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: theme.surface }}
                  />
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: theme.primary }}
                  />
                </div>
              </div>
              {themeId === theme.id && (
                <Check
                  className="w-6 h-6 flex-shrink-0"
                  style={{ color: theme.primary }}
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
