import type { MetadataRoute } from 'next';
import { SITE_DESCRIPTION, SITE_NAME } from './lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: 'Fôlha & Sousa',
    description: SITE_DESCRIPTION,
    lang: 'pt-BR',
    start_url: '/',
    display: 'browser',
    background_color: '#f8f4ec',
    theme_color: '#3d2719',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
