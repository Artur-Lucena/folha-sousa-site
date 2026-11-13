'use client';

import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

/**
 * Bloco visual do hero com parallax sutil: o recorte dos sócios deriva
 * para baixo conforme a página rola (desligado em reduced-motion).
 * As imagens têm `alt` próprio; o contêiner não precisa de nome.
 */
export function HeroVisual() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const yPeople = useTransform(scrollY, [0, 800], [0, 70]);

  return (
    // O fade de entrada é CSS (`.hero-visual`), para não depender da hidratação.
    <div className="hero-visual">
      <Image className="hero-office" src="/assets/hero-office.webp" alt="Escritório Fôlha & Sousa" fill priority sizes="(max-width: 1050px) 100vw, 55vw" />
      <div className="hero-shade" aria-hidden="true" />
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
    </div>
  );
}
