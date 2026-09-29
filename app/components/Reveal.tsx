'use client';

import { motion, type Variants } from 'motion/react';
import { LUX_EASE, REVEAL_DURATION } from './motion-shared';

type RevealTag = 'div' | 'p' | 'h1' | 'h2' | 'article' | 'section' | 'li' | 'ol' | 'span';

const revealTags = {
  div: motion.div,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  article: motion.article,
  section: motion.section,
  li: motion.li,
  ol: motion.ol,
  span: motion.span,
} as const;

type RevealProps = {
  children: React.ReactNode;
  as?: RevealTag;
  id?: string;
  className?: string;
  label?: string;
  /** Atraso em segundos, para compor o ritmo de entrada. */
  delay?: number;
  /** Deslocamento vertical inicial em px (0 = só fade). */
  y?: number;
  /** Uma vez (`true`) ou toda vez que entrar/sair da viewport. */
  once?: boolean;
};

/**
 * Revelação sob scroll (substitui o `animation-timeline` do CSS, com
 * suporte universal via IntersectionObserver e `once` por padrão).
 */
export function Reveal({ children, as = 'div', id, className, label, delay = 0, y = 28, once = true }: RevealProps) {
  const Tag = revealTags[as] as typeof motion.div;
  return (
    <Tag
      id={id}
      className={className}
      aria-label={label}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-64px' }}
      transition={{ duration: REVEAL_DURATION, ease: LUX_EASE, delay }}
    >
      {children}
    </Tag>
  );
}

const groupVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: REVEAL_DURATION, ease: LUX_EASE } },
};

/** Contêiner que escalona a entrada dos `StaggerItem` filhos. */
export function Stagger({ children, as = 'div', className, label }: { children: React.ReactNode; as?: RevealTag; className?: string; label?: string }) {
  const Tag = revealTags[as] as typeof motion.div;
  return (
    <Tag
      className={className}
      aria-label={label}
      variants={groupVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-64px' }}
    >
      {children}
    </Tag>
  );
}

/**
 * Item do `Stagger` com micro-interação de elevação no hover.
 * O `whileHover` convive com o reveal: o gesto prevalece e o
 * repouso retorna ao fim do gesto.
 */
export function StaggerItem({ children, as = 'div', className, hoverLift = true }: { children: React.ReactNode; as?: RevealTag; className?: string; hoverLift?: boolean }) {
  const Tag = revealTags[as] as typeof motion.div;
  return (
    <Tag className={className} variants={itemVariants} whileHover={hoverLift ? { y: -5 } : undefined}>
      {children}
    </Tag>
  );
}
