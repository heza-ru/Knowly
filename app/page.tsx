'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Settings, Info, ArrowRight, Heart } from 'lucide-react';
import { useSound } from '@/hooks/useSound';
import { AnimatedPageWrapper } from '@/components/AnimatedPageWrapper';
import { useSettings } from '@/hooks/useSettings';
import { storage } from '@/lib/storage';
import { QuizSession } from '@/lib/types';

const translations = {
  english: {
    appName: 'KNOWLY',
    subtitle: 'Practice Test Papers',
    selectPaper: 'Select Paper Year',
    settings: 'Settings',
    about: 'About / Help',
    history: 'Recent History',
    noHistory: 'No attempts yet',
  },
  hindi: {
    appName: 'सीखली',
    subtitle: 'टेस्ट पेपर अभ्यास',
    selectPaper: 'पेपर वर्ष चुनें',
    settings: 'सेटिंग्स',
    about: 'अबाउट / सहायता',
    history: 'हाल की हिस्ट्री',
    noHistory: 'अभी कोई प्रयास नहीं',
  },
};

export default function LandingPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const { playSound } = useSound();
  const [appLanguage, setAppLanguage] = useState<'english' | 'hindi'>('english');
  const [sessions, setSessions] = useState<QuizSession[]>([]);

  useEffect(() => {
    // Check if language is set, if not redirect to language selection
    const storedLanguage = storage.getAppLanguage();
    if (!storedLanguage) {
      router.push('/language');
      return;
    }
    // Use stored language or settings language
    const lang = storedLanguage || settings.appLanguage || 'english';
    setAppLanguage(lang as 'english' | 'hindi');
  }, [router, settings.appLanguage]);

  const t = translations[appLanguage];
  
  useEffect(() => {
    try {
      const all = storage.getQuizSessions();
      setSessions(all.slice(0, 5));
    } catch {}
  }, []);

  const navItems = [
    {
      icon: BookOpen,
      label: t.selectPaper,
      href: '/select-paper',
    },
    {
      icon: Settings,
      label: t.settings,
      href: '/settings',
    },
    {
      icon: Info,
      label: t.about,
      href: '/about',
    },
  ];

  return (
    <AnimatedPageWrapper>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--theme-bg)]">
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
            className="text-center mb-12"
          >
            <motion.h1
              className="title-3d text-7xl sm:text-8xl mb-6 text-[var(--theme-text)]"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {t.appName}
            </motion.h1>
            <motion.p
              className="text-2xl text-[var(--theme-text-muted)] font-hindi"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4,
              delay: 0.25,
              type: "spring",
              stiffness: 220,
              damping: 22
            }}
            >
              {t.subtitle}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.35 }}
            className="w-full max-w-md space-y-4 mb-12"
          >
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.href}
                onClick={() => { playSound('navigation'); router.push(item.href); }}
                  className="w-full p-6 rounded-2xl border-2 border-[var(--theme-border)] bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)] text-[var(--theme-text)] flex items-center justify-between group transition-all"
                  initial={{ opacity: 0, x: -50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ 
                  delay: 0.45 + index * 0.08,
                  type: "spring",
                  stiffness: 260,
                  damping: 22
                }}
                whileHover={{ 
                  scale: 1.05,
                  x: 4,
                  transition: { 
                    type: "spring",
                    stiffness: 700,
                    damping: 24
                  }
                }}
                whileTap={{ 
                  scale: 0.96,
                  transition: { 
                    type: "spring",
                    stiffness: 800,
                    damping: 26
                  }
                }}
                >
                  <motion.div 
                    className="flex items-center gap-4"
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.45, type: "spring" }}
                    >
                      <Icon className="w-6 h-6 text-[var(--theme-primary)]" />
                    </motion.div>
                    <span className="font-semibold text-lg font-hindi">{item.label}</span>
                  </motion.div>
                  <motion.div
                    animate={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <ArrowRight className="w-5 h-5 text-[var(--theme-text-muted)] group-hover:text-[var(--theme-primary)] transition-colors" />
                  </motion.div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Recent History */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="w-full max-w-md"
          >
            <h3 className="text-sm uppercase tracking-wide text-[var(--theme-text-muted)] mb-2 font-hindi">{t.history}</h3>
            <div className="space-y-2">
              {sessions.length === 0 ? (
                <div className="text-[var(--theme-text-muted)] text-sm font-hindi">{t.noHistory}</div>
              ) : (
                sessions.map((s) => (
                  <motion.button
                    key={s.id}
                    onClick={() => { playSound('navigation'); router.push(`/review?id=${s.id}`); }}
                    className="w-full p-3 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)] text-left"
                    whileHover={{ scale: 1.01, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="text-[var(--theme-text)] truncate font-medium font-hindi">{s.paperName || 'Paper'}</div>
                        <div className="text-[var(--theme-text-muted)] text-xs font-hindi truncate">{new Date(s.timestamp).toLocaleString()}</div>
                      </div>
                      <div className="ml-3 shrink-0 text-right">
                        <div className="text-sm font-semibold text-[var(--theme-primary)]">{s.accuracy}%</div>
                        <div className="text-[var(--theme-text-muted)] text-xs">{s.correct}/{s.totalQuestions}</div>
                      </div>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5,
            delay: 1,
            type: "spring",
            stiffness: 100
          }}
          className="mt-auto pb-6 text-center"
        >
          <p className="text-sm text-[var(--theme-text-muted)] font-hindi flex items-center justify-center gap-2">
            <span>Made with</span>
            <motion.span
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            </motion.span>
            <span>by Haider</span>
          </p>
        </motion.footer>
      </div>
    </AnimatedPageWrapper>
  );
}
