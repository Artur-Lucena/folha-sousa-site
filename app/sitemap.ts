import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://folhaesousa.adv.br';
  const institutionalLastModified = new Date('2026-08-26T00:00:00-03:00');
  const bookingLastModified = new Date('2026-09-10T00:00:00-03:00');

  return [
    { url: `${baseUrl}/`, lastModified: institutionalLastModified, changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/agendar`, lastModified: bookingLastModified, changeFrequency: 'weekly', priority: .9 },
    { url: `${baseUrl}/politicas-de-privacidade`, lastModified: institutionalLastModified, changeFrequency: 'yearly', priority: .3 },
    { url: `${baseUrl}/termo-de-consulta-juridica`, lastModified: institutionalLastModified, changeFrequency: 'yearly', priority: .3 },
    { url: `${baseUrl}/termos-de-uso`, lastModified: institutionalLastModified, changeFrequency: 'yearly', priority: .3 },
  ];
}
