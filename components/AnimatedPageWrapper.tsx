'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedPageWrapperProps {
  children: ReactNode;
}

const pageVariants = {
  initial: { opacity: 0, y: 18, scale: 0.985 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
  },
  exit: { opacity: 0, y: -16, scale: 0.985 },
};

const pageTransition = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 24,
  mass: 0.45,
};

export function AnimatedPageWrapper({ children }: AnimatedPageWrapperProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}
