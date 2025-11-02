'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AnimatedPageWrapper } from '@/components/AnimatedPageWrapper';
import { ModeSelector } from '@/components/ModeSelector';
import { useSettings } from '@/hooks/useSettings';
import { QuizMode } from '@/lib/types';

const translations = {
  english: {
    title: 'Select Quiz Mode',
    examLanguage: 'Exam Language',
    examLanguageDesc: 'Choose the language for questions',
    auto: 'Auto',
    continue: 'Continue',
    back: 'Back',
    enterCount: 'Enter number of questions',
    countPlaceholder: 'Number of questions',
  },
  hindi: {
    title: 'क्विज मोड चुनें',
    examLanguage: 'परीक्षा भाषा',
    examLanguageDesc: 'प्रश्नों की भाषा चुनें',
    auto: 'ऑटो',
    continue: 'जारी रखें',
    back: 'वापस',
    enterCount: 'प्रश्नों की संख्या दर्ज करें',
    countPlaceholder: 'प्रश्नों की संख्या',
  },
};

export default function SelectModePage() {
  const router = useRouter();
  const { settings } = useSettings();
  const [selectedMode, setSelectedMode] = useState<QuizMode | null>(null);
  const [examLanguage, setExamLanguage] = useState<'english' | 'hindi' | 'auto'>('auto');
  const [questionCount, setQuestionCount] = useState<string>('10');
  const [paperData, setPaperData] = useState<any>(null);

  const t = translations[settings.appLanguage];

  useEffect(() => {
    // Load selected paper from sessionStorage
    const paperStr = sessionStorage.getItem('selectedPaper');
    if (paperStr) {
      try {
        setPaperData(JSON.parse(paperStr));
      } catch (error) {
        console.error('Failed to parse paper data:', error);
      }
    } else {
      // No paper selected, redirect back
      router.push('/select-paper');
    }
  }, [router]);

  const handleContinue = () => {
    if (!selectedMode) return;

    // Store mode selection
    const modeData = {
      mode: selectedMode,
      examLanguage,
      questionCount: selectedMode === 'define-count' ? parseInt(questionCount) || 10 : undefined,
    };

    sessionStorage.setItem('quizMode', JSON.stringify(modeData));
    router.push('/quiz');
  };

  if (!paperData) {
    return null;
  }

  return (
    <AnimatedPageWrapper>
      <div className="min-h-screen p-6 bg-[var(--theme-bg)]">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/select-paper')}
            className="mb-6 flex items-center gap-2 text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-hindi">{t.back}</span>
          </button>

          <h1 className="text-3xl font-bold mb-8 text-[var(--theme-text)] font-hindi">
            {t.title}
          </h1>

          <div className="mb-8">
            <ModeSelector selectedMode={selectedMode} onSelect={setSelectedMode} />
          </div>

          {selectedMode === 'define-count' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <label className="block mb-2 text-[var(--theme-text)] font-hindi">
                {t.enterCount}
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
                placeholder={t.countPlaceholder}
                className="w-full p-4 rounded-lg border-2 border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-text)] focus:border-[var(--theme-primary)] focus:outline-none font-hindi"
              />
            </motion.div>
          )}

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-[var(--theme-text)] font-hindi">
              {t.examLanguage}
            </h3>
            <p className="text-sm text-[var(--theme-text-muted)] mb-4 font-hindi">
              {t.examLanguageDesc}
            </p>
            <div className="flex flex-wrap gap-3">
              {(['english', 'hindi', 'auto'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setExamLanguage(lang)}
                  className={`px-6 py-3 rounded-lg border-2 transition-all font-hindi ${
                    examLanguage === lang
                      ? 'border-[var(--theme-primary)] bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]'
                      : 'border-[var(--theme-border)] bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)] text-[var(--theme-text)]'
                  }`}
                >
                  {lang === 'auto' ? t.auto : settings.appLanguage === 'hindi' 
                    ? (lang === 'english' ? 'अंग्रेज़ी' : 'हिंदी')
                    : (lang === 'english' ? 'English' : 'हिंदी')}
                </button>
              ))}
            </div>
          </div>

          <motion.button
            onClick={handleContinue}
            disabled={!selectedMode}
            className="w-full sm:w-auto px-8 py-4 rounded-lg bg-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/90 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-hindi"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span>{t.continue}</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </AnimatedPageWrapper>
  );
}
