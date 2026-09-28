import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import test from 'node:test';
import {
  buildInteractiveButtons,
  buildWhatsAppLink,
  getDefaultWhatsAppLink,
  isBusinessHours,
  verifyMetaSignature,
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

test('assinatura Meta exige segredo, cabeçalho e HMAC correto', () => {
  const secret = 'segredo-de-teste';
  const raw = '{"from":"5582999990000","text":"oi"}';
  const valid = `sha256=${createHmac('sha256', secret).update(raw, 'utf8').digest('hex')}`;
  assert.equal(verifyMetaSignature(raw, valid, secret), true);
  assert.equal(verifyMetaSignature(raw + ' ', valid, secret), false);
  assert.equal(verifyMetaSignature(raw, valid, 'outro-segredo'), false);
  assert.equal(verifyMetaSignature(raw, null, secret), false);
  assert.equal(verifyMetaSignature(raw, valid, undefined), false);
});

test('horário comercial segue segunda a sexta, 9h às 18h em Maceió', () => {
  assert.equal(isBusinessHours(new Date('2026-09-28T12:00:00-03:00')), true); // segunda
  assert.equal(isBusinessHours(new Date('2026-09-25T09:00:00-03:00')), true); // sexta, abertura
  assert.equal(isBusinessHours(new Date('2026-09-25T17:59:00-03:00')), true);
  assert.equal(isBusinessHours(new Date('2026-09-28T08:59:00-03:00')), false);
  assert.equal(isBusinessHours(new Date('2026-09-25T18:00:00-03:00')), false);
  assert.equal(isBusinessHours(new Date('2026-09-26T12:00:00-03:00')), false); // sábado
  assert.equal(isBusinessHours(new Date('2026-09-27T12:00:00-03:00')), false); // domingo
});

test('botões interativos respeitam o contrato da Cloud API', () => {
  const payload = buildInteractiveButtons('Escolha:', [
    { id: 'agendar', title: 'Agendar consulta' },
    { id: 'equipe', title: 'Falar com a equipe (assunto muito longo para botão)' },
    { id: 'areas', title: 'Ver áreas' },
    { id: 'extra', title: 'Quarta opção excedente' },
  ]);
  assert.equal(payload.interactive.action.buttons.length, 3);
  assert.ok(payload.interactive.action.buttons.every((b) => b.reply.title.length <= 20));
  assert.equal(payload.interactive.action.buttons[1].reply.title, 'Falar com a equipe (');
});
