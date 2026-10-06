'use client';

import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

/**
 * Bloco visual do hero com parallax sutil: o recorte dos sócios deriva
 * para baixo conforme a página rola (desligado em reduced-motion).
 */
export function HeroVisual() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const yPeople = useTransform(scrollY, [0, 800], [0, 70]);

  return (
    <motion.div
      className="hero-visual"
      aria-label="Sócios do escritório Fôlha & Sousa"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.12 }}
    >
      <Image className="hero-office" src="/assets/hero-office.webp" alt="Escritório Fôlha & Sousa" fill priority sizes="(max-width: 1050px) 100vw, 55vw" />
      <div className="hero-shade" />
      <motion.div className="hero-people" style={{ y: reduceMotion ? 0 : yPeople }}>
        <Image
          src="/assets/hero-people.webp"
          alt="Cosmélia Fôlha e Domingos Sávio de Sousa"
          width={615}
          height={659}
          sizes="(max-width: 720px) 90vw, (max-width: 1050px) 72vw, 40vw"
          priority
          quality={90}
          style={{ width: '100%', height: 'auto' }}
        />
      </motion.div>
      <div className="hero-caption">
        <span>Fôlha & Sousa</span>
        <small>Advogados</small>
      </div>
    </motion.div>
  );
}
