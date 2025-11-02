'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

interface ExplanationCardProps {
  explanation: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ExplanationCard({ explanation, isOpen, onClose }: ExplanationCardProps) {
  const { settings } = useSettings();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-2xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[var(--theme-surface-hover)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors"
              aria-label="Close explanation"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="pr-8">
              <h3 className="text-xl font-semibold mb-4 text-[var(--theme-text)]">
                {settings.appLanguage === 'hindi' ? 'व्याख्या' : 'Explanation'}
              </h3>
              <p
                className="text-[var(--theme-text)] leading-relaxed font-hindi"
                style={{ fontSize: settings.fontSize === 'large' ? '1.125rem' : settings.fontSize === 'small' ? '0.875rem' : '1rem' }}
              >
                {explanation}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
