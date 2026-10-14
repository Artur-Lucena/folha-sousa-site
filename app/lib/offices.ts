/** Public institutional information verified against folhaesousa.adv.br. */
export const offices = [
  {
    id: 'maceio',
    city: 'Maceió',
    state: 'AL',
    street: 'Av. Menino Marcelo, 9350',
    building: 'Empresarial Humberto Lobo, sala 104',
    neighborhood: 'Serraria',
    postalCode: '57046-000',
    image: '/assets/fachada-maceio.webp',
    imageAlt: 'Fachada do Empresarial Humberto Lobo, em Maceió',
    mapUrl: 'https://maps.app.goo.gl/4PRsv8cXWust6KXk6',
  },
  {
    id: 'paulo-afonso',
    city: 'Paulo Afonso',
    state: 'BA',
    street: 'Rua Marechal Floriano Peixoto, 549',
    building: 'Empresarial Cliomel, sala 301',
    neighborhood: 'Centro',
    postalCode: '48601-210',
    image: '/assets/fachada-paulo-afonso.webp',
    imageAlt: 'Fachada do Empresarial Cliomel, em Paulo Afonso',
    mapUrl: 'https://share.google/FfHzEWqiCcEHMclkE',
  },
] as const;
