'use client';

import { MotionConfig } from 'motion/react';
import { LUX_EASE, REVEAL_DURATION } from './motion-shared';

/**
 * Política global de movimento: respeita o `prefers-reduced-motion` do
 * visitante (desliga transforms/layout, mantém opacity) e define a
 * transição editorial padrão do site.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: REVEAL_DURATION, ease: LUX_EASE }}>
      {children}
    </MotionConfig>
  );
}
