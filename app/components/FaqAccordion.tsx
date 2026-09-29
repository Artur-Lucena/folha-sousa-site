'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Footer } from './Footer';
import { Header } from './Header';
import { LUX_EASE } from './motion-shared';
import { Reveal } from './Reveal';

export type FaqEntry = { title: string; paragraphs: string[] };

/**
 * Perguntas frequentes em sanfona animada: altura e opacidade com o
 * easing editorial; apenas um item aberto por vez; `aria-expanded`
 * e região nomeada para leitores de tela.
 */
export function FaqAccordion({ intro, sections }: { intro: string; sections: FaqEntry[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <Header />
      <main className="legal-page" id="main-content" tabIndex={-1}>
        <div className="legal-hero">
          <p className="eyebrow">Dúvidas frequentes</p>
          <h1>Perguntas Frequentes</h1>
          <p>{intro}</p>
        </div>
        <div className="faq-list">
          {sections.map((section, index) => {
            const isOpen = open === index;
            return (
              <Reveal key={section.title} delay={Math.min(index * 0.05, 0.3)}>
                <div className="faq-item">
                  <button
                    className="faq-question"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-button-${index}`}
                    onClick={() => setOpen(isOpen ? null : index)}
                  >
                    <span>{section.title}</span>
                    <motion.span
                      className="faq-icon"
                      aria-hidden="true"
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.4, ease: LUX_EASE }}
                    >+</motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${index}`}
                        role="region"
                        aria-labelledby={`faq-button-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: LUX_EASE }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="faq-answer">
                          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
