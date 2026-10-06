'use client';

import { motion } from 'motion/react';

/**
 * Link editorial com seta viva: desliza para a direita no hover,
 * com física de mola e recuo ao toque.
 */
export function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      whileHover={{ x: 6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
    >
      {children}
    </motion.a>
  );
}
