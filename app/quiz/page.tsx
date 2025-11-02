'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, X, CheckCircle2, XCircle } from 'lucide-react';
import { AnimatedPageWrapper } from '@/components/AnimatedPageWrapper';
import { QuestionCard } from '@/components/QuestionCard';
import { ProgressBar } from '@/components/ProgressBar';
import { Timer } from '@/components/Timer';
import { ExplanationCard } from '@/components/ExplanationCard';
import { useQuizData } from '@/hooks/useQuizData';
import { useSound } from '@/hooks/useSound';
import { useSettings } from '@/hooks/useSettings';
import { QuizMode } from '@/lib/types';

const translations = {
  english: {
    modeStandard: 'Standard Mode',
    modeTimeAttack: 'Time Attack',
    modeRandom: 'Random Mode',
    modeDefineCount: 'Define Count',
    submit: 'Submit',
    next: 'Next',
    previous: 'Previous',
    finish: 'Finish Quiz',
    exitConfirm: 'Are you sure you want to exit? Your progress will be saved.',
    exit: 'Exit',
    cancel: 'Cancel',
    back: 'Back',
  },
  hindi: {
    modeStandard: 'स्टैंडर्ड मोड',
    modeTimeAttack: 'टाइम अटैक',
    modeRandom: 'रैंडम मोड',
    modeDefineCount: 'गिनती निर्धारित',
    submit: 'सबमिट करें',
    next: 'अगला',
    previous: 'पिछला',
    finish: 'क्विज समाप्त करें',
    exitConfirm: 'क्या आप निश्चित रूप से बाहर निकलना चाहते हैं? आपकी प्रगति सहेजी जाएगी।',
    exit: 'बाहर निकलें',
    cancel: 'रद्द करें',
    back: 'वापस',
  },
};

export default function QuizPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const { playSound } = useSound();
  const [paperData, setPaperData] = useState<any>(null);
  const [modeData, setModeData] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanationText, setExplanationText] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const t = translations[settings.appLanguage];

  useEffect(() => {
    const paperStr = sessionStorage.getItem('selectedPaper');
    const modeStr = sessionStorage.getItem('quizMode');
    
    if (!paperStr || !modeStr) {
      router.push('/select-paper');
      return;
    }

    try {
      setPaperData(JSON.parse(paperStr));
      setModeData(JSON.parse(modeStr));
    } catch (error) {
      console.error('Failed to parse data:', error);
      router.push('/select-paper');
    }
  }, [router]);

  const {
    currentQuestion,
    answers,
    isLoading,
    error,
    loadData,
    submitAnswer,
    goToNext,
    goToPrevious,
    canGoNext,
    canGoPrevious,
    getProgress,
    finishQuiz,
  } = useQuizData({
    paperPath: paperData?.path || '',
    part: paperData?.part || 'all',
    mode: modeData?.mode || 'standard',
    examLanguage: modeData?.examLanguage || 'auto',
    questionCount: modeData?.questionCount,
  });

  useEffect(() => {
    if (paperData && modeData) {
      loadData();
    }
  }, [paperData, modeData, loadData]);

  // Reset submission state when question changes
  useEffect(() => {
    if (currentQuestion) {
      setHasSubmitted(false);
      setIsCorrect(false);
      setSelectedOption(null);
      setShowFeedback(false);
      setShowExplanation(false);
      setTimeExpired(false);
    }
  }, [currentQuestion?.Question_Number]);

  const handleSubmit = () => {
    if (!selectedOption || !currentQuestion) return;

    setHasSubmitted(true);
    const result = submitAnswer(selectedOption);
    setIsCorrect(result.isCorrect);
    setExplanationText(result.explanation || '');

    if (result.isCorrect) {
      playSound('correct');
      setFeedbackMessage(settings.appLanguage === 'hindi' ? 'सही उत्तर! ✓' : 'Correct Answer! ✓');
      setShowFeedback(true);
      // Auto-advance after delay
      setTimeout(() => {
        setShowFeedback(false);
        setHasSubmitted(false);
        setIsCorrect(false);
        setSelectedOption(null);
        if (canGoNext()) {
          goToNext();
        } else {
          // Quiz finished
          handleFinish();
        }
      }, 2000);
    } else {
      playSound('incorrect');
      setFeedbackMessage(settings.appLanguage === 'hindi' ? 'गलत उत्तर ✗' : 'Incorrect Answer ✗');
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
        setShowExplanation(true);
      }, 1500);
    }
  };

  const handleFinish = () => {
    const session = finishQuiz();
    router.push(`/review?id=${session.id}`);
  };

  const handleTimerExpire = () => {
    if (selectedOption && currentQuestion) {
      handleSubmit();
    } else {
      // Auto-select and submit random option or mark as incorrect
      setTimeExpired(true);
    }
  };

  const handleExit = () => {
    // Save current progress
    const session = {
      id: `in-progress-${Date.now()}`,
      timestamp: Date.now(),
      paperName: paperData?.name || 'Unknown',
      mode: modeData?.mode || 'standard',
      examLanguage: modeData?.examLanguage || 'auto',
      answers: answers,
    };
    // Could save to localStorage if needed
    router.push('/');
  };

  const modeLabels: Record<QuizMode, string> = {
    'standard': t.modeStandard,
    'time-attack': t.modeTimeAttack,
    'random': t.modeRandom,
    'define-count': t.modeDefineCount,
    'review': '',
  };

  const getModeLabel = (mode: any): string => {
    const quizMode = mode as QuizMode;
    return modeLabels[quizMode] || t.modeStandard;
  };

  if (isLoading) {
    return (
      <AnimatedPageWrapper>
        <div className="min-h-screen flex items-center justify-center bg-[var(--theme-bg)]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[var(--theme-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[var(--theme-text-muted)] font-hindi">Loading quiz...</p>
          </div>
        </div>
      </AnimatedPageWrapper>
    );
  }

  if (error || !currentQuestion) {
    return (
      <AnimatedPageWrapper>
        <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--theme-bg)]">
          <div className="text-center max-w-md">
            <X className="w-16 h-16 text-[var(--theme-error)] mx-auto mb-4" />
            <p className="text-[var(--theme-text)] font-hindi">{error || 'No questions available'}</p>
            <button
              onClick={() => router.push('/select-paper')}
              className="mt-6 px-6 py-3 rounded-lg bg-[var(--theme-primary)] text-white font-hindi"
            >
              {t.back}
            </button>
          </div>
        </div>
      </AnimatedPageWrapper>
    );
  }

  const progress = getProgress();
  const isTimeAttack = modeData?.mode === 'time-attack';

  return (
    <AnimatedPageWrapper>
      <div className="min-h-screen p-4 sm:p-6 bg-[var(--theme-bg)]">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowExitConfirm(true)}
                className="p-2 rounded-lg hover:bg-[var(--theme-surface-hover)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors"
                aria-label="Exit quiz"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <div className="text-sm text-[var(--theme-text-muted)] font-hindi">
                  {getModeLabel(modeData?.mode || 'standard')}
                </div>
                <div className="font-semibold text-[var(--theme-text)] font-hindi">
                  {paperData?.name || ''}
                </div>
              </div>
            </div>
            {isTimeAttack && !timeExpired && (
              <Timer seconds={30} onExpire={handleTimerExpire} />
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <ProgressBar current={progress.current} total={progress.total} />
          </div>

          {/* Feedback Message */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: -30, scale: 0.8, rotateX: -90 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  rotateX: 0
                }}
                exit={{ 
                  opacity: 0, 
                  y: -20, 
                  scale: 0.9,
                  rotateX: 90
                }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  mass: 0.5
                }}
                className={`mb-6 p-4 rounded-lg border-2 flex items-center justify-center gap-3 font-semibold text-lg font-hindi shadow-lg ${
                  isCorrect
                    ? 'bg-[var(--theme-success)]/20 border-[var(--theme-success)] text-[var(--theme-success)]'
                    : 'bg-[var(--theme-error)]/20 border-[var(--theme-error)] text-[var(--theme-error)]'
                }`}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                    delay: 0.2
                  }}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <XCircle className="w-6 h-6" />
                  )}
                </motion.div>
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {feedbackMessage}
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.Question_Number}
              initial={{ opacity: 0, x: 50, scale: 0.95, rotateY: -10 }}
              animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, x: -50, scale: 0.95, rotateY: 10 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 20,
                mass: 0.8
              }}
            >
              <QuestionCard
                question={currentQuestion}
                examLanguage={modeData?.examLanguage || 'auto'}
                selectedOption={selectedOption}
                onSelect={setSelectedOption}
                showResult={hasSubmitted}
                correctOption={hasSubmitted ? currentQuestion.Correct_Option_Key : undefined}
                userAnswer={hasSubmitted ? selectedOption || undefined : undefined}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <motion.div 
            className="mt-6 flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          >
            <motion.button
              onClick={goToPrevious}
              disabled={!canGoPrevious()}
              className="flex-1 px-6 py-3 rounded-lg border-2 border-[var(--theme-border)] bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)] text-[var(--theme-text)] disabled:opacity-50 disabled:cursor-not-allowed font-hindi flex items-center justify-center gap-2"
              whileHover={!canGoPrevious() ? {} : {
                scale: 1.05,
                x: -3,
                transition: { type: "spring", stiffness: 400, damping: 25 }
              }}
              whileTap={!canGoPrevious() ? {} : {
                scale: 0.95,
                transition: { type: "spring", stiffness: 400, damping: 25 }
              }}
            >
              <motion.div
                animate={{ x: 0 }}
                whileHover={!canGoPrevious() ? {} : { x: -3 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.div>
              {t.previous}
            </motion.button>
            <motion.button
              onClick={handleSubmit}
              disabled={!selectedOption || timeExpired || hasSubmitted}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed font-hindi flex items-center justify-center gap-2 transition-all ${
                hasSubmitted
                  ? isCorrect
                    ? 'bg-[var(--theme-success)] hover:bg-[var(--theme-success)]/90 text-white'
                    : 'bg-[var(--theme-error)] hover:bg-[var(--theme-error)]/90 text-white'
                  : 'bg-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/90 text-white'
              }`}
              whileHover={(!selectedOption || timeExpired || hasSubmitted) ? {} : {
                scale: 1.05,
                y: -2,
                transition: { type: "spring", stiffness: 400, damping: 25 }
              }}
              whileTap={(!selectedOption || timeExpired || hasSubmitted) ? {} : {
                scale: 0.95,
                transition: { type: "spring", stiffness: 400, damping: 25 }
              }}
            >
              {hasSubmitted && isCorrect ? (
                <>
                  <motion.div
                    animate={{ rotate: 360, scale: 1.2 }}
                    transition={{ 
                      rotate: { duration: 0.5, type: "spring" },
                      scale: { duration: 0.3, delay: 0.2 }
                    }}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </motion.div>
                  {t.next}
                </>
              ) : hasSubmitted && !isCorrect ? (
                <>
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                    transition={{ 
                      rotate: { duration: 0.5 },
                      scale: { duration: 0.3, delay: 0.2 }
                    }}
                  >
                    <XCircle className="w-5 h-5" />
                  </motion.div>
                  {settings.appLanguage === 'hindi' ? 'अगला प्रश्न देखें' : 'View Explanation'}
                </>
              ) : (
                t.submit
              )}
            </motion.button>
            {!canGoNext() && answers.length > 0 && (
              <motion.button
                onClick={handleFinish}
                className="px-6 py-3 rounded-lg bg-[var(--theme-success)] hover:bg-[var(--theme-success)]/90 text-white font-semibold font-hindi"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
                whileTap={{ 
                  scale: 0.95,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
              >
                {t.finish}
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Explanation Modal */}
        <ExplanationCard
          explanation={explanationText}
          isOpen={showExplanation}
          onClose={() => {
            setShowExplanation(false);
            // Reset all submission states
            setHasSubmitted(false);
            setIsCorrect(false);
            setSelectedOption(null);
            if (canGoNext()) {
              goToNext();
            } else {
              handleFinish();
            }
          }}
        />

        {/* Exit Confirmation */}
        <AnimatePresence>
          {showExitConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowExitConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-2xl p-6 max-w-md w-full"
              >
                <h3 className="text-lg font-semibold mb-4 text-[var(--theme-text)] font-hindi">
                  {t.exitConfirm}
                </h3>
                <div className="flex gap-4">
                  <button
                    onClick={handleExit}
                    className="flex-1 px-4 py-2 rounded-lg bg-[var(--theme-error)] hover:bg-[var(--theme-error)]/90 text-white font-hindi"
                  >
                    {t.exit}
                  </button>
                  <button
                    onClick={() => setShowExitConfirm(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)] text-[var(--theme-text)] font-hindi"
                  >
                    {t.cancel}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedPageWrapper>
  );
}
