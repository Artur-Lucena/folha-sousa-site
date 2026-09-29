import { Footer } from './Footer';
import { Header } from './Header';
import { Reveal } from './Reveal';

export type LegalSection = { title: string; paragraphs: string[]; items?: string[] };

export function LegalPage({ title, updated, intro, sections }: { title: string; updated: string; intro?: string; sections: LegalSection[] }) {
  return (
    <>
      <Header />
      <main className="legal-page" id="main-content" tabIndex={-1}>
        <div className="legal-hero">
          <p className="eyebrow">Transparência e segurança</p>
          <h1>{title}</h1>
          <p>Última atualização: {updated}</p>
        </div>
        <div className="legal-layout">
          <aside aria-label="Nesta página">
            <p className="footer-label">Nesta página</p>
            {sections.map((section, index) => <a key={section.title} href={`#legal-${index}`}>{section.title}</a>)}
          </aside>
          <article>
            {intro && <p className="legal-intro">{intro}</p>}
            {sections.map((section, index) => (
              <Reveal as="section" id={`legal-${index}`} key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.items && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}
              </Reveal>
            ))}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
