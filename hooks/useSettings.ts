'use client';

import { useState, useEffect } from 'react';
import { Settings } from '@/lib/types';
import { storage } from '@/lib/storage';

const defaultSettings: Settings = {
  appLanguage: 'english',
  theme: 'default',
  soundEnabled: true,
  fontSize: 'medium',
};

export function useSettings() {
  const [settings, setSettingsState] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = storage.getSettings();
    const appLanguage = storage.getAppLanguage(); // Check for separately stored language
    
    let settingsToUse = defaultSettings;
    
    if (savedSettings) {
      settingsToUse = savedSettings;
    }
    
    // Override appLanguage if it's stored separately (for first-time language selection)
    if (appLanguage) {
      settingsToUse = { ...settingsToUse, appLanguage };
    }
    
    setSettingsState(settingsToUse);
    if (!savedSettings) {
      // Initialize with defaults (include language if set)
      storage.setSettings(settingsToUse);
    } else if (appLanguage && savedSettings.appLanguage !== appLanguage) {
      // Update settings if language changed
      storage.setSettings(settingsToUse);
    }
    
    setIsLoading(false);
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettingsState(updated);
    storage.setSettings(updated);
  };

  const resetSettings = () => {
    storage.setSettings(defaultSettings);
    setSettingsState(defaultSettings);
  };

  return {
    settings,
    updateSettings,
    resetSettings,
    isLoading,
  };
}
