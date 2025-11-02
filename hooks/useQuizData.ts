'use client';

import { useState, useCallback } from 'react';
import { Question, QuizData, QuizMode, QuizAnswer, QuizSession } from '@/lib/types';
import { loadQuizData, filterQuestionsByPart } from '@/lib/csvParser';
import { storage } from '@/lib/storage';

interface UseQuizDataOptions {
  paperPath: string;
  part: string | 'all';
  mode: QuizMode;
  examLanguage: 'english' | 'hindi' | 'auto';
  questionCount?: number; // For define-count mode
}

export function useQuizData(options: UseQuizDataOptions) {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load quiz data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await loadQuizData(options.paperPath);
      setQuizData(data);

      let filtered = filterQuestionsByPart(data.questions, options.part);
      
      // Don't filter by exam language - show all questions regardless
      // The QuestionCard component will handle displaying what's available
      // This ensures language-specific questions (like language-based questions) are always shown

      // Limit for define-count mode
      if (options.mode === 'define-count' && options.questionCount) {
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        filtered = shuffled.slice(0, Math.min(options.questionCount, filtered.length));
      }

      setQuestions(filtered);
      setCurrentIndex(0);
      setAnswers([]);
      setUsedIndices(new Set());

      if (filtered.length === 0) {
        setError('No questions found for the selected criteria.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quiz data');
    } finally {
      setIsLoading(false);
    }
  }, [options.paperPath, options.part, options.examLanguage, options.mode, options.questionCount]);

  const getCurrentQuestion = (): Question | null => {
    if (questions.length === 0) return null;
    
    if (options.mode === 'random') {
      // Random mode: pick any question that hasn't been used recently
      const availableIndices = questions
        .map((_, idx) => idx)
        .filter(idx => !usedIndices.has(idx));
      
      if (availableIndices.length === 0) {
        // All questions used, reset
        setUsedIndices(new Set());
        const randomIdx = Math.floor(Math.random() * questions.length);
        return questions[randomIdx];
      }
      
      const randomIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      return questions[randomIdx];
    }
    
    return questions[currentIndex];
  };

  const submitAnswer = (selectedOption: 'A' | 'B' | 'C' | 'D'): { isCorrect: boolean; explanation?: string } => {
    const question = getCurrentQuestion();
    if (!question) return { isCorrect: false };

    const isCorrect = selectedOption === question.Correct_Option_Key;
    const explanation = question.Explanation_Hindi;

    const answer: QuizAnswer = {
      questionNumber: question.Question_Number,
      selectedOption,
      correctOption: question.Correct_Option_Key,
      isCorrect,
      explanation,
      questionText: options.examLanguage === 'hindi' 
        ? question.Question_Hindi 
        : question.Question_English || question.Question_Hindi,
    };

    setAnswers(prev => [...prev, answer]);

    // Mark current index as used for random mode
    if (options.mode === 'random') {
      const qIdx = questions.indexOf(question);
      setUsedIndices(prev => new Set([...prev, qIdx]));
    }

    return { isCorrect, explanation };
  };

  const goToNext = () => {
    if (options.mode === 'random') {
      // Random mode doesn't have sequential navigation
      return;
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (options.mode === 'random') {
      return;
    }
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const canGoNext = () => {
    if (options.mode === 'random') return true;
    return currentIndex < questions.length - 1;
  };

  const canGoPrevious = () => {
    if (options.mode === 'random') return false;
    return currentIndex > 0;
  };

  const getProgress = () => {
    if (questions.length === 0) return { current: 0, total: 0, percentage: 0 };
    const answered = answers.length;
    const total = questions.length;
    return {
      current: answered,
      total,
      percentage: total > 0 ? Math.round((answered / total) * 100) : 0,
    };
  };

  const finishQuiz = (): QuizSession => {
    const correct = answers.filter(a => a.isCorrect).length;
    const incorrect = answers.filter(a => !a.isCorrect).length;
    const attempted = answers.length;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

    const session: QuizSession = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      paperName: quizData?.paperName || 'Unknown',
      mode: options.mode,
      examLanguage: options.examLanguage,
      part: options.part !== 'all' ? options.part : undefined,
      answers: [...answers],
      totalQuestions: questions.length,
      attempted,
      correct,
      incorrect,
      accuracy,
    };

    storage.saveQuizSession(session);
    storage.clearCurrentQuiz();

    return session;
  };

  return {
    quizData,
    questions,
    currentQuestion: getCurrentQuestion(),
    answers,
    currentIndex,
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
  };
}
