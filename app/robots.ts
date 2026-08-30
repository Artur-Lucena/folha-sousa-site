import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://folhaesousa.adv.br/sitemap.xml',
    host: 'https://folhaesousa.adv.br',
  };
}
