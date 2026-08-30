import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://folhaesousa.adv.br';
  const lastModified = new Date('2026-08-26T00:00:00-03:00');

  return [
    { url: `${baseUrl}/`, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/agendar`, lastModified, changeFrequency: 'weekly', priority: .9 },
    { url: `${baseUrl}/politicas-de-privacidade`, lastModified, changeFrequency: 'yearly', priority: .3 },
    { url: `${baseUrl}/termo-de-consulta-juridica`, lastModified, changeFrequency: 'yearly', priority: .3 },
    { url: `${baseUrl}/termos-de-uso`, lastModified, changeFrequency: 'yearly', priority: .3 },
  ];
}
