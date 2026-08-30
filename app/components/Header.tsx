'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { MouseEvent } from 'react';
import { useRef } from 'react';

const links = [
  ['Atuação', '/#atuacao'],
  ['O escritório', '/#escritorio'],
  ['Equipe', '/#equipe'],
  ['Contato', '/#contato'],
];

export function Header() {
  const mobileMenu = useRef<HTMLDetailsElement>(null);

  function closeMobileMenu() {
    mobileMenu.current?.removeAttribute('open');
  }

  function skipToContent(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#main-content`);
    mainContent.focus({ preventScroll: true });
    mainContent.scrollIntoView();
  }

  return (
    <>
      <Link className="skip-link" href="#main-content" onClick={skipToContent}>Ir para o conteúdo</Link>
      <header className="site-header">
        <Link className="brand" href="/#inicio" aria-label="Fôlha & Sousa — início">
          <Image src="/assets/logo.webp" alt="Fôlha & Sousa Advogados" width={270} height={80} priority />
        </Link>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        </nav>
        <Link className="header-cta" href="/agendar">Agendar consulta</Link>
        <details className="mobile-menu" ref={mobileMenu}>
          <summary aria-label="Abrir menu de navegação">Menu</summary>
          <nav aria-label="Navegação para dispositivos móveis">
            {links.map(([label, href]) => <Link href={href} key={href} onClick={closeMobileMenu}>{label}</Link>)}
            <Link href="/agendar" onClick={closeMobileMenu}>Agendar consulta</Link>
          </nav>
        </details>
      </header>
    </>
  );
}
