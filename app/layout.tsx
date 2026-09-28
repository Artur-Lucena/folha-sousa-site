import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://folhaesousa.adv.br'),
  title: 'Fôlha & Sousa Advogados | Advocacia Estratégica',
  description: 'Soluções jurídicas estratégicas para pessoas e empresas, com atuação nacional e internacional.',
  authors: [{ name: 'Fôlha & Sousa Advogados' }],
  robots: { index: true, follow: true },
  icons: { icon: '/assets/favicon.jpg' },
  openGraph: {
    title: 'Fôlha & Sousa Advogados',
    description: 'Clareza jurídica para decisões que importam.',
    type: 'website',
    locale: 'pt_BR',
    url: 'https://folhaesousa.adv.br/',
    images: [{ url: 'https://folhaesousa.adv.br/og.jpg', width: 1200, height: 630, alt: 'Fôlha & Sousa Advogados' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fôlha & Sousa Advogados',
    description: 'Clareza jurídica para decisões que importam.',
    images: ['https://folhaesousa.adv.br/og.jpg'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
