import { Fragment, type CSSProperties } from 'react';

/**
 * Título do hero com revelação palavra por palavra (máscara editorial).
 *
 * A animação é feita só em CSS (`.hero-word`, em `globals.css`): o título
 * já vem no HTML do servidor e anima no primeiro paint, sem esperar a
 * hidratação nem depender de JavaScript. O texto integral vai ao
 * `aria-label`; as máscaras são decorativas.
 */
export function HeroTitle({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <h1 aria-label={text}>
      {words.map((w, i) => (
        // O espaço fica fora da máscara `inline-block`; dentro dela ele é
        // descartado no fim da caixa e as palavras aparecem coladas.
        <Fragment key={`${w}-${i}`}>
          <span className="hero-word" aria-hidden="true" style={{ '--i': i } as CSSProperties}>
            <span>{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </h1>
  );
}
