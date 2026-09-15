'use client';

import React from 'react';
import { motion } from 'motion/react';

interface VintageBadgeProps {
  text: string;
  className?: string;
  initialRotate?: number;
}

export function VintageBadge({ text, className = '', initialRotate = -3 }: VintageBadgeProps) {
  return (
    <motion.div
      initial={{ rotate: initialRotate }}
      animate={{
        rotate: [initialRotate, initialRotate + 6, initialRotate - 4, initialRotate + 3, initialRotate, initialRotate, initialRotate],
        scale: [1, 1.04, 0.98, 1.02, 1, 1, 1],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatDelay: 1.8,
        ease: 'easeInOut',
      }}
      className={`inline-block bg-vintage-red border-2 border-[#2c0b04] shadow-[3px_3px_0px_#000000] px-2.5 py-1 text-[9px] sm:text-[10px] font-bold tracking-widest text-white uppercase select-none transition-shadow ${className}`}
    >
      {text}
    </motion.div>
  );
}
