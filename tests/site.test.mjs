import assert from 'node:assert/strict';
import test from 'node:test';
import {
  BUSINESS_HOURS, CONTACT_EMAIL, OG_IMAGE, SITE_NAME, SITE_URL, absoluteUrl, pageMetadata,
} from '../app/lib/site.ts';
import { formatOfficeAddress, headOffice, offices } from '../app/lib/offices.ts';
import { CHATBOT_MENU, WHATSAPP_BASE_URL } from '../app/lib/whatsapp.ts';

test('URLs absolutas partem do domínio oficial', () => {
  assert.equal(absoluteUrl('/'), `${SITE_URL}/`);
  assert.equal(absoluteUrl('/agendar'), `${SITE_URL}/agendar`);
  assert.equal(absoluteUrl('/#unidade-maceio'), `${SITE_URL}/#unidade-maceio`);
  assert.equal(OG_IMAGE.url, `${SITE_URL}/og.jpg`);
  assert.match(CONTACT_EMAIL, /@folhaesousa\.adv\.br$/);
});

test('metadados de página trazem canonical, Open Graph e Twitter completos', () => {
  const meta = pageMetadata({ title: 'Agendar Consulta', description: 'Descrição longa.', path: '/agendar', socialDescription: 'Curta.' });
  assert.equal(meta.title, `Agendar Consulta | ${SITE_NAME}`);
  assert.equal(meta.description, 'Descrição longa.');
  assert.deepEqual(meta.alternates, { canonical: '/agendar' });
  assert.equal(meta.openGraph.url, `${SITE_URL}/agendar`);
  assert.equal(meta.openGraph.description, 'Curta.');
  assert.equal(meta.openGraph.locale, 'pt_BR');
  assert.deepEqual(meta.openGraph.images, [{ ...OG_IMAGE }]);
  assert.deepEqual(meta.twitter.images, [OG_IMAGE.url]);
  assert.equal(meta.twitter.title, meta.title);
});

test('metadados da página inicial usam o título institucional', () => {
  const meta = pageMetadata({ title: null, description: 'D', path: '/' });
  assert.equal(meta.title, `${SITE_NAME} | Advocacia Estratégica`);
  assert.equal(meta.openGraph.title, SITE_NAME);
  assert.equal(meta.openGraph.description, 'D');
});

test('endereço da sede é montado a partir das unidades', () => {
  assert.equal(headOffice, offices[0]);
  assert.equal(
    formatOfficeAddress(headOffice),
    'Av. Menino Marcelo, 9350, Empresarial Humberto Lobo, sala 104, Serraria, Maceió/AL, CEP 57046-000',
  );
  for (const office of offices) assert.match(office.room, /^sala \d+$/);
});

test('horário do site e do chatbot coincidem', () => {
  assert.equal(BUSINESS_HOURS.label, '9h às 18h');
  assert.ok(CHATBOT_MENU.businessHours.includes(BUSINESS_HOURS.label));
  assert.equal(BUSINESS_HOURS.opens, '09:00');
  assert.equal(BUSINESS_HOURS.closes, '18:00');
  assert.ok(WHATSAPP_BASE_URL.startsWith('https://wa.me/'));
});
