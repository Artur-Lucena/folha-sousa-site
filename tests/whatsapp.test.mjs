import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildWhatsAppLink,
  getDefaultWhatsAppLink,
  verifyWebhookChallenge,
  parseIncomingText,
  WHATSAPP_BASE_URL,
  WHATSAPP_INTERNATIONAL_NUMBER,
  CHATBOT_MENU,
} from '../app/lib/whatsapp.ts';
import { whatsappUrl } from '../app/agendar/booking.ts';

test('booking.ts usa o mesmo número oficial da central WhatsApp', () => {
  assert.equal(whatsappUrl, WHATSAPP_BASE_URL);
});

test('link do WhatsApp usa o número oficial e codifica a mensagem', () => {
  const url = new URL(buildWhatsAppLink('Olá, gostaria de agendar.'));
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, `/${WHATSAPP_INTERNATIONAL_NUMBER}`);
  assert.equal(url.searchParams.get('text'), 'Olá, gostaria de agendar.');
});

test('mensagem vazia usa a mensagem padrão sem criar parâmetros extras', () => {
  const url = new URL(buildWhatsAppLink('   '));
  assert.deepEqual([...url.searchParams.keys()], ['text']);
  assert.match(url.searchParams.get('text'), /Fôlha & Sousa/);
  assert.equal(getDefaultWhatsAppLink(), buildWhatsAppLink('   '));
  assert.ok(WHATSAPP_BASE_URL.endsWith(WHATSAPP_INTERNATIONAL_NUMBER));
});

test('verificação do webhook aceita apenas o token esperado', () => {
  assert.equal(
    verifyWebhookChallenge({ mode: 'subscribe', verifyToken: 'abc', challenge: '123' }, undefined).ok,
    false,
  );
  assert.equal(
    verifyWebhookChallenge({ mode: 'subscribe', verifyToken: 'errado', challenge: '123' }, 'certo').ok,
    false,
  );
  const ok = verifyWebhookChallenge(
    { mode: 'subscribe', verifyToken: 'certo', challenge: '123' },
    'certo',
  );
  assert.equal(ok.ok, true);
  assert.equal(ok.challenge, '123');
});

test('parser simplificado rejeita corpos sem remetente ou texto', () => {
  assert.equal(parseIncomingText(null), null);
  assert.equal(parseIncomingText({}), null);
  assert.equal(parseIncomingText({ from: '5582999990000' }), null);
  assert.deepEqual(parseIncomingText({ from: ' 5582999990000 ', text: ' Agendar ' }), {
    from: '5582999990000',
    text: 'Agendar',
    messageId: undefined,
  });
});

test('menu do chatbot preserva regras do escritório', () => {
  assert.ok(CHATBOT_MENU.options.includes('Agendar consulta'));
  assert.match(CHATBOT_MENU.disclaimer, /sensíveis/);
  assert.match(CHATBOT_MENU.businessHours, /Maceió/);
});
