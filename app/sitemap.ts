import type { MetadataRoute } from 'next';
import { absoluteUrl } from './lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const institutionalLastModified = new Date('2026-10-14T00:00:00-03:00');
  const bookingLastModified = new Date('2026-10-14T00:00:00-03:00');
  const faqLastModified = new Date('2026-10-14T00:00:00-03:00');

  return [
    { url: absoluteUrl('/'), lastModified: institutionalLastModified, changeFrequency: 'monthly', priority: 1 },
    { url: absoluteUrl('/agendar'), lastModified: bookingLastModified, changeFrequency: 'weekly', priority: .9 },
    { url: absoluteUrl('/perguntas-frequentes'), lastModified: faqLastModified, changeFrequency: 'monthly', priority: .7 },
    { url: absoluteUrl('/politicas-de-privacidade'), lastModified: institutionalLastModified, changeFrequency: 'yearly', priority: .3 },
    { url: absoluteUrl('/termo-de-consulta-juridica'), lastModified: institutionalLastModified, changeFrequency: 'yearly', priority: .3 },
    { url: absoluteUrl('/termos-de-uso'), lastModified: institutionalLastModified, changeFrequency: 'yearly', priority: .3 },
  ];
}
