'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Info, HelpCircle } from 'lucide-react';
import { AnimatedPageWrapper } from '@/components/AnimatedPageWrapper';
import { useSettings } from '@/hooks/useSettings';

const translations = {
  english: {
    title: 'About / Help',
    appName: 'Knowly',
    subtitle: 'Bilingual Quiz App',
    description: 'Offline-first bilingual quiz app for practicing test papers from CSV files.',
    features: 'Features',
    feature1: 'Bilingual support (English & Hindi)',
    feature2: 'Multiple quiz modes',
    feature3: 'Offline-first functionality',
    feature4: 'Customizable themes and settings',
    feature5: 'PWA support for mobile devices',
    help: 'How to Use',
    help1: 'Select a paper from the available CSV files',
    help2: 'Choose your preferred quiz mode',
    help3: 'Answer questions and review explanations',
    help4: 'Track your progress and accuracy',
    back: 'Back',
    version: 'Version 1.0.0',
  },
  hindi: {
    title: 'अबाउट / सहायता',
    appName: 'सीखली',
    subtitle: 'द्विभाषी क्विज ऐप',
    description: 'CSV फ़ाइलों से टेस्ट पेपर अभ्यास के लिए ऑफ़लाइन-प्रथम द्विभाषी क्विज ऐप।',
    features: 'विशेषताएं',
    feature1: 'द्विभाषी समर्थन (अंग्रेजी और हिंदी)',
    feature2: 'कई क्विज मोड',
    feature3: 'ऑफ़लाइन-प्रथम कार्यक्षमता',
    feature4: 'अनुकूलन योग्य थीम और सेटिंग्स',
    feature5: 'मोबाइल उपकरणों के लिए PWA समर्थन',
    help: 'कैसे उपयोग करें',
    help1: 'उपलब्ध CSV फ़ाइलों से एक पेपर चुनें',
    help2: 'अपनी पसंदीदा क्विज मोड चुनें',
    help3: 'प्रश्नों का उत्तर दें और स्पष्टीकरण देखें',
    help4: 'अपनी प्रगति और सटीकता ट्रैक करें',
    back: 'वापस',
    version: 'संस्करण 1.0.0',
  },
};

export default function AboutPage() {
  const router = useRouter();
  const { settings } = useSettings();

  const t = translations[settings.appLanguage];

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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="mb-6 flex justify-center">
              <div className="p-4 rounded-full bg-[var(--theme-primary)]/20">
                <BookOpen className="w-12 h-12 text-[var(--theme-primary)]" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2 text-[var(--theme-text)] font-hindi">
              {t.appName}
            </h1>
            <p className="text-lg text-[var(--theme-text-muted)] font-hindi">
              {t.subtitle}
            </p>
            <p className="mt-4 text-sm text-[var(--theme-text-muted)] font-hindi">
              {t.version}
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* Description */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-2xl p-6"
            >
              <p className="text-[var(--theme-text)] leading-relaxed font-hindi">
                {t.description}
              </p>
            </motion.section>

            {/* Features */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold mb-4 text-[var(--theme-text)] flex items-center gap-2 font-hindi">
                <Info className="w-6 h-6 text-[var(--theme-primary)]" />
                {t.features}
              </h2>
              <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-2xl p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[var(--theme-primary)] mt-2 flex-shrink-0" />
                  <p className="text-[var(--theme-text)] font-hindi">{t.feature1}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[var(--theme-primary)] mt-2 flex-shrink-0" />
                  <p className="text-[var(--theme-text)] font-hindi">{t.feature2}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[var(--theme-primary)] mt-2 flex-shrink-0" />
                  <p className="text-[var(--theme-text)] font-hindi">{t.feature3}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[var(--theme-primary)] mt-2 flex-shrink-0" />
                  <p className="text-[var(--theme-text)] font-hindi">{t.feature4}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[var(--theme-primary)] mt-2 flex-shrink-0" />
                  <p className="text-[var(--theme-text)] font-hindi">{t.feature5}</p>
                </div>
              </div>
            </motion.section>

            {/* How to Use */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-semibold mb-4 text-[var(--theme-text)] flex items-center gap-2 font-hindi">
                <HelpCircle className="w-6 h-6 text-[var(--theme-primary)]" />
                {t.help}
              </h2>
              <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-2xl p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] flex items-center justify-center font-semibold">
                    1
                  </div>
                  <p className="text-[var(--theme-text)] flex-1 font-hindi">{t.help1}</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] flex items-center justify-center font-semibold">
                    2
                  </div>
                  <p className="text-[var(--theme-text)] flex-1 font-hindi">{t.help2}</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] flex items-center justify-center font-semibold">
                    3
                  </div>
                  <p className="text-[var(--theme-text)] flex-1 font-hindi">{t.help3}</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] flex items-center justify-center font-semibold">
                    4
                  </div>
                  <p className="text-[var(--theme-text)] flex-1 font-hindi">{t.help4}</p>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </AnimatedPageWrapper>
  );
}
