'use client';

import { motion } from 'motion/react';

/**
 * Micro-interação de pressão para CTAs e botões (hover com física de
 * mola, toque com recuo). Envolve o elemento sem alterar sua semântica.
 */
export function Pressable({ children, className, disabled = false }: { children: React.ReactNode; className?: string; disabled?: boolean }) {
  return (
    <motion.span
      className={className}
      style={{ display: 'inline-flex' }}
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
    >
      {children}
    </motion.span>
  );
}
