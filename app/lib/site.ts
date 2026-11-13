import type { Metadata } from 'next';

/**
 * Dados institucionais do site em um só lugar.
 *
 * Telefone e WhatsApp ficam em `app/lib/whatsapp.ts`, unidades em
 * `app/lib/offices.ts` e valores de consulta em `app/agendar/booking.ts`.
 * Módulo sem imports de valor, para ser carregado pelo runner de testes do Node.
 */

export const SITE_URL = 'https://folhaesousa.adv.br';
export const SITE_NAME = 'Fôlha & Sousa Advogados';
export const SITE_TAGLINE = 'Clareza jurídica para decisões que importam.';
export const SITE_DESCRIPTION =
  'Soluções jurídicas estratégicas para pessoas e empresas, com atuação nacional e internacional.';

export const CONTACT_EMAIL = 'contato@folhaesousa.adv.br';
export const CNPJ = '28.306.731/0001-89';

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/folhaesousa.adv/',
  facebook: 'https://www.facebook.com/share/1AfALzayzH/?mibextid=wwXIfr',
} as const;

/** Horário de atendimento (Maceió). `label` é o trecho usado nos textos. */
export const BUSINESS_HOURS = {
  opens: '09:00',
  closes: '18:00',
  label: '9h às 18h',
  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
} as const;

export const OG_IMAGE = {
  url: `${SITE_URL}/og.jpg`,
  width: 1200,
  height: 630,
  alt: SITE_NAME,
} as const;

/** URL absoluta a partir de um caminho do site (`/agendar` → `https://…/agendar`). */
export function absoluteUrl(path = '/'): string {
  return new URL(path, `${SITE_URL}/`).toString();
}

/**
 * Metadados completos de uma página. O Next substitui (não mescla) os
 * objetos `openGraph` e `twitter` do layout quando a página os define,
 * por isso o helper sempre devolve os dois inteiros, com imagem e URL.
 */
export function pageMetadata({ title, description, path, socialDescription }: {
  /** Título curto da página; `null` usa o título institucional (página inicial). */
  title: string | null;
  description: string;
  path: string;
  /** Descrição para redes sociais, quando diferente da descrição de busca. */
  socialDescription?: string;
}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Advocacia Estratégica`;
  const socialTitle = title ? fullTitle : SITE_NAME;
  const social = socialDescription ?? description;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: socialTitle,
      description: social,
      type: 'website',
      locale: 'pt_BR',
      siteName: SITE_NAME,
      url: absoluteUrl(path),
      images: [{ ...OG_IMAGE }],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description: social,
      images: [OG_IMAGE.url],
    },
  };
}
