'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedPageWrapperProps {
  children: ReactNode;
}

const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
  },
  exit: { opacity: 0, y: -20, scale: 0.98 },
};

const pageTransition = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
  mass: 0.5,
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
