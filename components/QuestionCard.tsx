'use client';

import { motion } from 'framer-motion';
import { Question } from '@/lib/types';
import { useSettings } from '@/hooks/useSettings';
import { useState } from 'react';
import { useSound } from '@/hooks/useSound';

interface QuestionCardProps {
  question: Question;
  examLanguage: 'english' | 'hindi' | 'auto';
  selectedOption?: 'A' | 'B' | 'C' | 'D' | null;
  onSelect: (option: 'A' | 'B' | 'C' | 'D') => void;
  showResult?: boolean;
  correctOption?: 'A' | 'B' | 'C' | 'D';
  userAnswer?: 'A' | 'B' | 'C' | 'D';
}

export function QuestionCard({
  question,
  examLanguage,
  selectedOption,
  onSelect,
  showResult = false,
  correctOption,
  userAnswer,
}: QuestionCardProps) {
  const { settings } = useSettings();
  const [hoveredOption, setHoveredOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const { playSound } = useSound();

  // Determine which language to use - map to app language in auto mode
  const getQuestionText = () => {
    // If specific language is selected, try that first, then fallback
    if (examLanguage === 'english') {
      return question.Question_English || question.Question_Hindi || '';
    }
    if (examLanguage === 'hindi') {
      return question.Question_Hindi || question.Question_English || '';
    }
    // Auto mode: use app language if available, otherwise fallback
    if (settings.appLanguage === 'hindi') {
      return question.Question_Hindi || question.Question_English || '';
    } else {
      return question.Question_English || question.Question_Hindi || '';
    }
  };

  const getOptionText = (option: 'A' | 'B' | 'C' | 'D') => {
    // Always try to get the option - prefer selected language, but show what's available
    let text: string | undefined;
    
    if (examLanguage === 'english') {
      // Try English first
      const englishKey = `Option_${option}_English` as keyof Question;
      text = question[englishKey] as string | undefined;
      // Fallback to Hindi if English not available
      if (!text || text.trim() === '') {
        const hindiKey = `Option_${option}_Hindi` as keyof Question;
        text = question[hindiKey] as string | undefined;
      }
    } else if (examLanguage === 'hindi') {
      // Try Hindi first
      const hindiKey = `Option_${option}_Hindi` as keyof Question;
      text = question[hindiKey] as string | undefined;
      // Fallback to English if Hindi not available
      if (!text || text.trim() === '') {
        const englishKey = `Option_${option}_English` as keyof Question;
        text = question[englishKey] as string | undefined;
      }
    } else {
      // Auto mode: use app language if available, then fallback
      if (settings.appLanguage === 'hindi') {
        const hindiKey = `Option_${option}_Hindi` as keyof Question;
        text = question[hindiKey] as string | undefined;
        // Fallback to English if Hindi not available
        if (!text || text.trim() === '') {
          const englishKey = `Option_${option}_English` as keyof Question;
          text = question[englishKey] as string | undefined;
        }
      } else {
        const englishKey = `Option_${option}_English` as keyof Question;
        text = question[englishKey] as string | undefined;
        // Fallback to Hindi if English not available
        if (!text || text.trim() === '') {
          const hindiKey = `Option_${option}_Hindi` as keyof Question;
          text = question[hindiKey] as string | undefined;
        }
      }
    }
    
    // Return what's available, even if empty (will be handled in rendering)
    return text ? text.trim() : '';
  };

  const getOptionKey = (option: 'A' | 'B' | 'C' | 'D') => {
    return option;
  };

  const options: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

  const getOptionStyle = (option: 'A' | 'B' | 'C' | 'D') => {
    const isSelected = selectedOption === option;
    const isHovered = hoveredOption === option;
    
    if (showResult) {
      const isCorrect = option === correctOption;
      const isUserAnswer = option === userAnswer;
      
      if (isCorrect) {
        return 'bg-[var(--theme-success)]/20 border-[var(--theme-success)] text-[var(--theme-success)]';
      }
      if (isUserAnswer && !isCorrect) {
        return 'bg-[var(--theme-error)]/20 border-[var(--theme-error)] text-[var(--theme-error)]';
      }
    }
    
    if (isSelected) {
      return 'bg-[var(--theme-primary)]/20 border-[var(--theme-primary)] text-[var(--theme-primary)]';
    }
    
    if (isHovered) {
      return 'bg-[var(--theme-surface-hover)] border-[var(--theme-border)]';
    }
    
    return 'bg-[var(--theme-surface)] border-[var(--theme-border)] hover:bg-[var(--theme-surface-hover)]';
  };

  const fontSizeClass = 
    settings.fontSize === 'large' ? 'text-lg' :
    settings.fontSize === 'small' ? 'text-sm' : 'text-base';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        scale: 1.01,
        transition: { 
          type: "spring",
          stiffness: 300,
          damping: 20
        }
      }}
      className="question-card bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-2xl p-4 sm:p-6 shadow-lg"
    >
      {question.Context_Passage && (
        <div className={`mb-4 p-4 rounded-lg bg-[var(--theme-surface-hover)] border border-[var(--theme-border)] ${fontSizeClass} text-[var(--theme-text-muted)] leading-relaxed`}>
          {question.Context_Passage}
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-2">
          <span className="flex-shrink-0 px-3 py-1 rounded-lg bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] font-semibold text-sm">
            Q{question.Question_Number}
          </span>
          <span className="px-3 py-1 rounded-lg bg-[var(--theme-surface-hover)] text-[var(--theme-text-muted)] text-xs">
            {question.Part} • {question.Subject}
          </span>
        </div>
        <h2 className={`mt-4 font-semibold text-[var(--theme-text)] leading-relaxed font-hindi ${fontSizeClass}`}>
          {getQuestionText()}
        </h2>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {options.map((option) => {
          const optionText = getOptionText(option);
          // Show option even if text is empty (might be language-specific question)
          // Check if at least one language version exists
          const englishKey = `Option_${option}_English` as keyof Question;
          const hindiKey = `Option_${option}_Hindi` as keyof Question;
          const hasEnglish = question[englishKey] && String(question[englishKey]).trim() !== '';
          const hasHindi = question[hindiKey] && String(question[hindiKey]).trim() !== '';
          
          // Only hide if absolutely no text exists in any language
          if (!hasEnglish && !hasHindi) return null;
          
          return (
            <motion.button
              key={option}
              onClick={() => {
                playSound('select');
                onSelect(option);
              }}
              onMouseEnter={() => setHoveredOption(option)}
              onMouseLeave={() => setHoveredOption(null)}
              disabled={showResult}
              className={`option-btn w-full p-3 sm:p-4 rounded-lg border-2 text-left transition-all ${getOptionStyle(option)} ${fontSizeClass} font-hindi disabled:cursor-not-allowed`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: options.indexOf(option) * 0.05,
                type: "spring",
                stiffness: 500,
                damping: 24
              }}
              whileHover={!showResult ? { 
                scale: 1.04,
                x: 4,
                transition: { 
                  type: "spring",
                  stiffness: 700,
                  damping: 22
                }
              } : {}}
              whileTap={!showResult ? { 
                scale: 0.96,
                transition: { 
                  type: "spring",
                  stiffness: 800,
                  damping: 26
                }
              } : {}}
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-semibold text-sm">
                  {option}
                </span>
                <span className="flex-1">{optionText}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
