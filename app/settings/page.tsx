'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Check } from 'lucide-react';
import { AnimatedPageWrapper } from '@/components/AnimatedPageWrapper';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { SoundToggle } from '@/components/SoundToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useSettings } from '@/hooks/useSettings';
import { storage } from '@/lib/storage';

const translations = {
  english: {
    title: 'Settings',
    theme: 'Theme',
    sound: 'Sound',
    fontSize: 'Font Size',
    fontSizeSmall: 'Small',
    fontSizeMedium: 'Medium',
    fontSizeLarge: 'Large',
    resetProgress: 'Reset Progress',
    resetConfirm: 'Are you sure you want to reset all progress? This action cannot be undone.',
    reset: 'Reset',
    cancel: 'Cancel',
    back: 'Back',
    appLanguage: 'App Language',
  },
  hindi: {
    title: 'सेटिंग्स',
    theme: 'थीम',
    sound: 'ध्वनि',
    fontSize: 'फॉन्ट आकार',
    fontSizeSmall: 'छोटा',
    fontSizeMedium: 'मध्यम',
    fontSizeLarge: 'बड़ा',
    resetProgress: 'प्रगति रीसेट करें',
    resetConfirm: 'क्या आप निश्चित रूप से सभी प्रगति रीसेट करना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।',
    reset: 'रीसेट',
    cancel: 'रद्द करें',
    back: 'वापस',
    appLanguage: 'एप भाषा',
  },
};

export default function SettingsPage() {
  const router = useRouter();
  const { settings, updateSettings, resetSettings } = useSettings();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const t = translations[settings.appLanguage];

  const handleResetProgress = () => {
    storage.resetProgress();
    setShowResetConfirm(false);
    // Show success message (could add toast notification)
  };

  const fontSizeOptions: Array<{ value: 'small' | 'medium' | 'large'; label: string; labelHindi: string }> = [
    { value: 'small', label: t.fontSizeSmall, labelHindi: t.fontSizeSmall },
    { value: 'medium', label: t.fontSizeMedium, labelHindi: t.fontSizeMedium },
    { value: 'large', label: t.fontSizeLarge, labelHindi: t.fontSizeLarge },
  ];

  return (
    <AnimatedPageWrapper>
      <div className="min-h-screen p-4 sm:p-6 bg-[var(--theme-bg)]">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.push('/')}
            className="mb-6 flex items-center gap-2 text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-hindi">{t.back}</span>
          </button>

          <h1 className="text-3xl font-bold mb-8 text-[var(--theme-text)] font-hindi">
            {t.title}
          </h1>

          <div className="space-y-8">
            {/* App Language */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-[var(--theme-text)] font-hindi">
                {t.appLanguage}
              </h2>
              <LanguageToggle />
            </section>

            {/* Theme */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-[var(--theme-text)] font-hindi">
                {t.theme}
              </h2>
              <ThemeSwitcher />
            </section>

            {/* Sound */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-[var(--theme-text)] font-hindi">
                {t.sound}
              </h2>
              <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-lg p-4">
                <SoundToggle />
              </div>
            </section>

            {/* Font Size */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-[var(--theme-text)] font-hindi">
                {t.fontSize}
              </h2>
              <div className="flex gap-3">
                {fontSizeOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => updateSettings({ fontSize: option.value })}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all font-hindi ${
                      settings.fontSize === option.value
                        ? 'border-[var(--theme-primary)] bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]'
                        : 'border-[var(--theme-border)] bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)] text-[var(--theme-text)]'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {settings.fontSize === option.value && (
                        <Check className="w-5 h-5" />
                      )}
                      <span>
                        {settings.appLanguage === 'hindi' ? option.labelHindi : option.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Reset Progress */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-[var(--theme-text)] font-hindi">
                {t.resetProgress}
              </h2>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-6 py-3 rounded-lg border-2 border-[var(--theme-error)] bg-[var(--theme-surface)] hover:bg-[var(--theme-error)]/10 text-[var(--theme-error)] font-semibold flex items-center gap-2 font-hindi"
              >
                <RotateCcw className="w-5 h-5" />
                {t.resetProgress}
              </button>
            </section>
          </div>
        </div>

        {/* Reset Confirmation */}
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold mb-4 text-[var(--theme-text)] font-hindi">
                {t.resetConfirm}
              </h3>
              <div className="flex gap-4">
                <button
                  onClick={handleResetProgress}
                  className="flex-1 px-4 py-2 rounded-lg bg-[var(--theme-error)] hover:bg-[var(--theme-error)]/90 text-white font-hindi"
                >
                  {t.reset}
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)] text-[var(--theme-text)] font-hindi"
                >
                  {t.cancel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </AnimatedPageWrapper>
  );
}
