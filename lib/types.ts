export interface Question {
  Question_Number: string;
  Part: string;
  Subject: string;
  Context_Passage?: string;
  Question_English?: string;
  Question_Hindi?: string;
  Option_A_English?: string;
  Option_A_Hindi?: string;
  Option_B_English?: string;
  Option_B_Hindi?: string;
  Option_C_English?: string;
  Option_C_Hindi?: string;
  Option_D_English?: string;
  Option_D_Hindi?: string;
  Correct_Option_Key: 'A' | 'B' | 'C' | 'D';
  Explanation_Hindi?: string;
}

export interface QuizData {
  questions: Question[];
  paperName: string;
  year?: string;
  paperNumber?: string;
}

export interface QuizAnswer {
  questionNumber: string;
  selectedOption: 'A' | 'B' | 'C' | 'D';
  correctOption: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  explanation?: string;
  questionText?: string;
}

export interface QuizSession {
  id: string;
  timestamp: number;
  paperName: string;
  mode: QuizMode;
  examLanguage: 'english' | 'hindi' | 'auto';
  part?: string;
  answers: QuizAnswer[];
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  accuracy: number;
}

export type QuizMode = 
  | 'standard' 
  | 'time-attack' 
  | 'random' 
  | 'define-count' 
  | 'review';

export interface Settings {
  appLanguage: 'english' | 'hindi';
  theme: string;
  soundEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

export interface ThemePalette {
  id: string;
  name: string;
  nameHindi: string;
  bg: string;
  surface: string;
  surfaceHover: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  success: string;
  error: string;
}
