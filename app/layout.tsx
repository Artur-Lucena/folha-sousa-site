import type { Metadata } from 'next';
import { MotionProvider } from './components/MotionProvider';
import { OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL, absoluteUrl } from './lib/site';
import './globals.css';

const NO_JS_REVEAL_STYLE =
  '<style>[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}</style>';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} | Advocacia Estratégica`,
  description: SITE_DESCRIPTION,
  authors: [{ name: SITE_NAME }],
  robots: { index: true, follow: true },
  openGraph: {
    title: SITE_NAME,
    description: SITE_TAGLINE,
    type: 'website',
    locale: 'pt_BR',
    siteName: SITE_NAME,
    url: absoluteUrl('/'),
    images: [{ ...OG_IMAGE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_TAGLINE,
    images: [OG_IMAGE.url],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Sem JavaScript, os reveals do Motion ficariam presos no estado inicial (invisível). */}
        <noscript dangerouslySetInnerHTML={{ __html: NO_JS_REVEAL_STYLE }} />
      </head>
      <body><MotionProvider>{children}</MotionProvider></body>
    </html>
  );
}
