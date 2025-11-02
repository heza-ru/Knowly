'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { AnimatedPageWrapper } from '@/components/AnimatedPageWrapper';
import { useSettings } from '@/hooks/useSettings';
import { storage } from '@/lib/storage';
import { QuizSession } from '@/lib/types';

const translations = {
  english: {
    title: 'Quiz Results',
    accuracy: 'Accuracy',
    attempted: 'Attempted',
    correct: 'Correct',
    incorrect: 'Incorrect',
    total: 'Total Questions',
    back: 'Back',
    next: 'Next',
    home: 'Home',
    retake: 'Retake Quiz',
    reviewAnswers: 'Review Answers',
    question: 'Question',
    yourAnswer: 'Your Answer',
    correctAnswer: 'Correct Answer',
  },
  hindi: {
    title: 'क्विज परिणाम',
    accuracy: 'सटीकता',
    attempted: 'प्रयास किए गए',
    correct: 'सही',
    incorrect: 'गलत',
    total: 'कुल प्रश्न',
    back: 'वापस',
    next: 'अगला',
    home: 'होम',
    retake: 'क्विज दोबारा करें',
    reviewAnswers: 'उत्तरों की समीक्षा करें',
    question: 'प्रश्न',
    yourAnswer: 'आपका उत्तर',
    correctAnswer: 'सही उत्तर',
  },
};

function ReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { settings } = useSettings();
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const t = translations[settings.appLanguage];

  useEffect(() => {
    const sessionId = searchParams.get('id');
    if (!sessionId) {
      // Try to get latest session
      const sessions = storage.getQuizSessions();
      if (sessions.length > 0) {
        setSession(sessions[0]);
      } else {
        router.push('/');
      }
      return;
    }

    const sessions = storage.getQuizSessions();
    const foundSession = sessions.find(s => s.id === sessionId);
    if (foundSession) {
      setSession(foundSession);
    } else {
      router.push('/');
    }
  }, [searchParams, router]);

  if (!session) {
    return (
      <AnimatedPageWrapper>
        <div className="min-h-screen flex items-center justify-center bg-[var(--theme-bg)]">
          <p className="text-[var(--theme-text-muted)] font-hindi">Loading...</p>
        </div>
      </AnimatedPageWrapper>
    );
  }

  const currentAnswer = session.answers[currentQuestionIndex];

  return (
    <AnimatedPageWrapper>
      <div className="min-h-screen p-4 sm:p-6 bg-[var(--theme-bg)]">
        <div className="max-w-4xl mx-auto">
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
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-6 text-[var(--theme-text)] font-hindi">
              {t.title}
            </h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[var(--theme-text)]">{session.attempted}</div>
                <div className="text-sm text-[var(--theme-text-muted)] font-hindi">{t.attempted}</div>
              </div>
              <div className="bg-[var(--theme-success)]/20 border border-[var(--theme-success)] rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[var(--theme-success)]">{session.correct}</div>
                <div className="text-sm text-[var(--theme-text-muted)] font-hindi">{t.correct}</div>
              </div>
              <div className="bg-[var(--theme-error)]/20 border border-[var(--theme-error)] rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[var(--theme-error)]">{session.incorrect}</div>
                <div className="text-sm text-[var(--theme-text-muted)] font-hindi">{t.incorrect}</div>
              </div>
              <div className="bg-[var(--theme-primary)]/20 border border-[var(--theme-primary)] rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[var(--theme-primary)]">{session.accuracy}%</div>
                <div className="text-sm text-[var(--theme-text-muted)] font-hindi">{t.accuracy}</div>
              </div>
            </div>

            <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-lg p-4 mb-6">
              <div className="text-sm text-[var(--theme-text-muted)] mb-1 font-hindi">{t.total}</div>
              <div className="text-lg font-semibold text-[var(--theme-text)]">{session.totalQuestions}</div>
            </div>
          </motion.div>

          {/* Question Review */}
          {session.answers.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <h2 className="text-xl font-semibold mb-4 text-[var(--theme-text)] font-hindi">
                {t.reviewAnswers}
              </h2>

              {/* Navigation */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[var(--theme-text-muted)] font-hindi">
                  {t.question} {currentQuestionIndex + 1} / {session.answers.length}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)] text-[var(--theme-text)] disabled:opacity-50 disabled:cursor-not-allowed font-hindi"
                  >
                    {t.back}
                  </button>
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(session.answers.length - 1, prev + 1))}
                    disabled={currentQuestionIndex === session.answers.length - 1}
                    className="px-4 py-2 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)] text-[var(--theme-text)] disabled:opacity-50 disabled:cursor-not-allowed font-hindi"
                  >
                    {t.next}
                  </button>
                </div>
              </div>

              {/* Answer Display */}
              <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  {currentAnswer.isCorrect ? (
                    <CheckCircle2 className="w-8 h-8 text-[var(--theme-success)]" />
                  ) : (
                    <XCircle className="w-8 h-8 text-[var(--theme-error)]" />
                  )}
                  <div>
                    <div className="text-sm text-[var(--theme-text-muted)] font-hindi">{t.yourAnswer}</div>
                    <div className="text-lg font-semibold text-[var(--theme-text)]">
                      {currentAnswer.isCorrect ? (
                        <span className="text-[var(--theme-success)]">{currentAnswer.selectedOption}</span>
                      ) : (
                        <span className="text-[var(--theme-error)]">{currentAnswer.selectedOption}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-[var(--theme-text-muted)] mb-1 font-hindi">{t.correctAnswer}</div>
                  <div className="text-lg font-semibold text-[var(--theme-success)]">
                    {currentAnswer.correctOption}
                  </div>
                </div>
                {currentAnswer.explanation && !currentAnswer.isCorrect && (
                  <div className="mt-4 p-4 bg-[var(--theme-surface-hover)] rounded-lg">
                    <div className="text-sm text-[var(--theme-text-muted)] mb-2 font-hindi">व्याख्या</div>
                    <p className="text-[var(--theme-text)] font-hindi">{currentAnswer.explanation}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push('/select-paper')}
              className="flex-1 px-6 py-3 rounded-lg bg-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/90 text-white font-semibold flex items-center justify-center gap-2 font-hindi"
            >
              <RotateCcw className="w-5 h-5" />
              {t.retake}
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex-1 px-6 py-3 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)] text-[var(--theme-text)] font-semibold flex items-center justify-center gap-2 font-hindi"
            >
              <Home className="w-5 h-5" />
              {t.home}
            </button>
          </div>
        </div>
      </div>
    </AnimatedPageWrapper>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={
      <AnimatedPageWrapper>
        <div className="min-h-screen flex items-center justify-center bg-[var(--theme-bg)]">
          <p className="text-[var(--theme-text-muted)] font-hindi">Loading...</p>
        </div>
      </AnimatedPageWrapper>
    }>
      <ReviewContent />
    </Suspense>
  );
}
