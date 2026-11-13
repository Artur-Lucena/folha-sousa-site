/** Public institutional information verified against folhaesousa.adv.br. */
export const offices = [
  {
    id: 'maceio',
    city: 'Maceió',
    state: 'AL',
    street: 'Av. Menino Marcelo, 9350',
    building: 'Empresarial Humberto Lobo',
    room: 'sala 104',
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
    building: 'Empresarial Cliomel',
    room: 'sala 301',
    neighborhood: 'Centro',
    postalCode: '48601-210',
    image: '/assets/fachada-paulo-afonso.webp',
    imageAlt: 'Fachada do Empresarial Cliomel, em Paulo Afonso',
    mapUrl: 'https://share.google/FfHzEWqiCcEHMclkE',
  },
] as const;

export type Office = (typeof offices)[number];

/** Sede (endereço usado no CNPJ e nos textos legais). */
export const headOffice: Office = offices[0];

/** Endereço completo em uma linha: rua, prédio, sala, bairro, cidade/UF e CEP. */
export function formatOfficeAddress(office: Office): string {
  return `${office.street}, ${office.building}, ${office.room}, ${office.neighborhood}, ${office.city}/${office.state}, CEP ${office.postalCode}`;
}
