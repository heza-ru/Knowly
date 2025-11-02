import { Settings, QuizSession } from './types';

const STORAGE_KEYS = {
  APP_LANGUAGE: 'knowly_app_language',
  SETTINGS: 'knowly_settings',
  QUIZ_SESSIONS: 'knowly_quiz_sessions',
  CURRENT_QUIZ: 'knowly_current_quiz',
} as const;

export const storage = {
  // App Language
  getAppLanguage(): 'english' | 'hindi' | null {
    if (typeof window === 'undefined') return null;
    const lang = localStorage.getItem(STORAGE_KEYS.APP_LANGUAGE);
    return lang === 'english' || lang === 'hindi' ? lang : null;
  },

  setAppLanguage(language: 'english' | 'hindi'): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.APP_LANGUAGE, language);
  },

  // Settings
  getSettings(): Settings | null {
    if (typeof window === 'undefined') return null;
    const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!settings) return null;
    try {
      return JSON.parse(settings) as Settings;
    } catch {
      return null;
    }
  },

  setSettings(settings: Settings): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Quiz Sessions
  getQuizSessions(): QuizSession[] {
    if (typeof window === 'undefined') return [];
    const sessions = localStorage.getItem(STORAGE_KEYS.QUIZ_SESSIONS);
    if (!sessions) return [];
    try {
      return JSON.parse(sessions) as QuizSession[];
    } catch {
      return [];
    }
  },

  saveQuizSession(session: QuizSession): void {
    if (typeof window === 'undefined') return;
    const sessions = this.getQuizSessions();
    sessions.unshift(session); // Add to beginning
    // Keep only last 50 sessions
    const limitedSessions = sessions.slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.QUIZ_SESSIONS, JSON.stringify(limitedSessions));
  },

  // Current Quiz (in-progress)
  getCurrentQuiz(): Partial<QuizSession> | null {
    if (typeof window === 'undefined') return null;
    const quiz = localStorage.getItem(STORAGE_KEYS.CURRENT_QUIZ);
    if (!quiz) return null;
    try {
      return JSON.parse(quiz) as Partial<QuizSession>;
    } catch {
      return null;
    }
  },

  setCurrentQuiz(quiz: Partial<QuizSession> | null): void {
    if (typeof window === 'undefined') return;
    if (quiz === null) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_QUIZ);
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_QUIZ, JSON.stringify(quiz));
    }
  },

  clearCurrentQuiz(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_QUIZ);
  },

  // Reset all progress
  resetProgress(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.QUIZ_SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_QUIZ);
  },
};
