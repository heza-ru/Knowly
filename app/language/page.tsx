'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';
import { AnimatedPageWrapper } from '@/components/AnimatedPageWrapper';
import { storage } from '@/lib/storage';
import { useSettings } from '@/hooks/useSettings';

export default function LanguagePage() {
  const router = useRouter();
  const { updateSettings } = useSettings();
  const [selected, setSelected] = useState<'english' | 'hindi' | null>(null);

  const languages = [
    {
      id: 'english' as const,
      name: 'English',
      nativeName: 'English',
    },
    {
      id: 'hindi' as const,
      name: 'Hindi',
      nativeName: 'हिंदी',
    },
  ];

  const handleSelect = (lang: 'english' | 'hindi') => {
    setSelected(lang);
    storage.setAppLanguage(lang);
    updateSettings({ appLanguage: lang }); // Also update settings
    // Redirect to landing after a short delay
    setTimeout(() => {
      router.push('/');
      router.refresh(); // Force refresh to update language
    }, 300);
  };

  return (
    <AnimatedPageWrapper>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--theme-bg)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-12"
        >
          <div className="mb-6 flex justify-center">
            <div className="p-4 rounded-full bg-[var(--theme-primary)]/20">
              <Languages className="w-12 h-12 text-[var(--theme-primary)]" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-[var(--theme-text)]">
            Choose Your Language
          </h1>
          <p className="text-lg text-[var(--theme-text-muted)]">
            अपनी भाषा चुनें
          </p>
        </motion.div>

        <div className="w-full max-w-md space-y-4">
          {languages.map((lang, index) => (
            <motion.button
              key={lang.id}
              onClick={() => handleSelect(lang.id)}
              className={`w-full p-6 rounded-2xl border-2 transition-all ${
                selected === lang.id
                  ? 'border-[var(--theme-primary)] bg-[var(--theme-primary)]/10'
                  : 'border-[var(--theme-border)] bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)]'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold mb-2 text-[var(--theme-text)] font-hindi">
                  {lang.nativeName}
                </div>
                <div className="text-sm text-[var(--theme-text-muted)]">
                  {lang.name}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </AnimatedPageWrapper>
  );
}
