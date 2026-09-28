'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { FocusEvent, MouseEvent } from 'react';
import { useEffect, useRef } from 'react';

const links = [
  ['Atuação', '/#atuacao'],
  ['O escritório', '/#escritorio'],
  ['Equipe', '/#equipe'],
  ['Contato', '/#contato'],
];

export function Header() {
  const mobileMenu = useRef<HTMLDetailsElement>(null);

  function syncMobileMenuState() {
    const menu = mobileMenu.current;
    const summary = menu?.querySelector('summary');
    if (summary) summary.setAttribute('aria-expanded', menu?.open ? 'true' : 'false');
  }

  useEffect(() => {
    function closeOnOutsideInteraction(event: PointerEvent) {
      const menu = mobileMenu.current;
      if (menu?.open && event.target instanceof Node && !menu.contains(event.target)) {
        menu.removeAttribute('open');
        menu.querySelector('summary')?.setAttribute('aria-expanded', 'false');
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      const menu = mobileMenu.current;
      if (event.key === 'Escape' && menu?.open) {
        menu.removeAttribute('open');
        const summary = menu.querySelector('summary') as HTMLElement | null;
        summary?.setAttribute('aria-expanded', 'false');
        summary?.focus();
      }
    }

    document.addEventListener('pointerdown', closeOnOutsideInteraction);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideInteraction);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  function closeMobileMenu() {
    mobileMenu.current?.removeAttribute('open');
    syncMobileMenuState();
  }

  function closeAfterFocusLeaves(event: FocusEvent<HTMLDetailsElement>) {
    if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) {
      closeMobileMenu();
    }
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
        <details className="mobile-menu" ref={mobileMenu} onBlur={closeAfterFocusLeaves} onToggle={syncMobileMenuState}>
          <summary aria-expanded="false" aria-controls="mobile-nav">
            <span>Menu</span>
            <span className="mobile-menu-icon" aria-hidden="true">+</span>
          </summary>
          <nav id="mobile-nav" aria-label="Navegação para dispositivos móveis">
            {links.map(([label, href]) => <Link href={href} key={href} onClick={closeMobileMenu}>{label}</Link>)}
            <Link href="/agendar" onClick={closeMobileMenu}>Agendar consulta</Link>
          </nav>
        </details>
      </header>
    </>
  );
}
