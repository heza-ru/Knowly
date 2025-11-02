'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressBar({ current, total, className = '' }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <motion.div 
      className={`w-full ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <div className="flex items-center justify-between mb-2">
        <motion.span 
          className="text-sm text-[var(--theme-text-muted)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Progress: {current} / {total}
        </motion.span>
        <motion.span 
          className="text-sm font-medium text-[var(--theme-text)]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          {percentage}%
        </motion.span>
      </div>
      <div className="w-full h-3 bg-[var(--theme-surface)] rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="h-full bg-gradient-to-r from-[var(--theme-primary)] via-[#60a5fa] to-[var(--theme-primary)] rounded-full shadow-lg"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: 0.8,
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
        />
      </div>
    </motion.div>
  );
}
