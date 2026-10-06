'use client';

import { motion, type Variants } from 'motion/react';
import { LUX_EASE } from './motion-shared';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const word: Variants = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 1, ease: LUX_EASE } },
};

/**
 * Título do hero com revelação palavra por palavra (máscara editorial).
 * O texto integral vai ao `aria-label`; as máscaras são decorativas.
 */
export function HeroTitle({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <motion.h1 initial="hidden" animate="show" variants={container} aria-label={text}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} aria-hidden="true" style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
          <motion.span style={{ display: 'inline-block' }} variants={word}>
            {w}
          </motion.span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </motion.h1>
  );
}
