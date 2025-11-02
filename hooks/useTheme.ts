'use client';

import { useEffect } from 'react';
import { useSettings } from './useSettings';
import { ThemePalette } from '@/lib/types';

export const themes: ThemePalette[] = [
  {
    id: 'default',
    name: 'Default Dark',
    nameHindi: 'डिफ़ॉल्ट डार्क',
    bg: '#0f0f0f',
    surface: '#1a1a1a',
    surfaceHover: '#252525',
    border: '#2a2a2a',
    text: '#f5f5f5',
    textMuted: '#a0a0a0',
    primary: '#3b82f6',
    success: '#10b981',
    error: '#ef4444',
  },
  {
    id: 'blue',
    name: 'Blue Dark',
    nameHindi: 'ब्लू डार्क',
    bg: '#0a1629',
    surface: '#132042',
    surfaceHover: '#1a2d54',
    border: '#243865',
    text: '#e8f0ff',
    textMuted: '#9fb8e8',
    primary: '#3b82f6',
    success: '#10b981',
    error: '#ef4444',
  },
  {
    id: 'green',
    name: 'Green Dark',
    nameHindi: 'ग्रीन डार्क',
    bg: '#0d1f0d',
    surface: '#1a3d1a',
    surfaceHover: '#275427',
    border: '#356b35',
    text: '#e8ffe8',
    textMuted: '#9fd99f',
    primary: '#10b981',
    success: '#22c55e',
    error: '#ef4444',
  },
  {
    id: 'purple',
    name: 'Purple Dark',
    nameHindi: 'पर्पल डार्क',
    bg: '#1a0d1f',
    surface: '#3d1a42',
    surfaceHover: '#542757',
    border: '#6b356b',
    text: '#ffe8ff',
    textMuted: '#d99fd9',
    primary: '#a855f7',
    success: '#10b981',
    error: '#ef4444',
  },
  {
    id: 'amber',
    name: 'Amber Dark',
    nameHindi: 'एम्बर डार्क',
    bg: '#1f150d',
    surface: '#3d281a',
    surfaceHover: '#543b27',
    border: '#6b4e35',
    text: '#fff8e8',
    textMuted: '#d9c99f',
    primary: '#f59e0b',
    success: '#10b981',
    error: '#ef4444',
  },
];

export function useTheme() {
  const { settings, updateSettings } = useSettings();

  useEffect(() => {
    // Apply theme to document
    const theme = themes.find(t => t.id === settings.theme) || themes[0];
    
    const root = document.documentElement;
    root.style.setProperty('--theme-bg', theme.bg);
    root.style.setProperty('--theme-surface', theme.surface);
    root.style.setProperty('--theme-surface-hover', theme.surfaceHover);
    root.style.setProperty('--theme-border', theme.border);
    root.style.setProperty('--theme-text', theme.text);
    root.style.setProperty('--theme-text-muted', theme.textMuted);
    root.style.setProperty('--theme-primary', theme.primary);
    root.style.setProperty('--theme-success', theme.success);
    root.style.setProperty('--theme-error', theme.error);

    // Ensure dark mode class is applied
    root.classList.add('dark');
  }, [settings.theme]);

  const setTheme = (themeId: string) => {
    updateSettings({ theme: themeId });
  };

  const currentTheme = themes.find(t => t.id === settings.theme) || themes[0];

  return {
    currentTheme,
    themes,
    setTheme,
    themeId: settings.theme,
  };
}
