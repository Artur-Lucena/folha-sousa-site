'use client';

import { motion } from 'motion/react';
import { LUX_EASE } from './motion-shared';

/**
 * Revelação de imagem por recorte (wipe): a foto se abre por trás de
 * uma máscara ao entrar na viewport. Para fotos de presença
 * (escritório, contato), complementando o fade dos blocos de texto.
 */
export function ClipReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ clipPath: 'inset(8% 6% 8% 6%)', opacity: 0.4 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
      viewport={{ once: true, margin: '-64px' }}
      transition={{ duration: 1.2, ease: LUX_EASE }}
    >
      {children}
    </motion.div>
  );
}
