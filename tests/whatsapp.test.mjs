import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import test from 'node:test';
import {
  buildInteractiveButtons,
  buildWhatsAppLink,
  getDefaultWhatsAppLink,
  isBusinessHours,
  verifyWebhookChallenge,
  parseIncomingText,
  WHATSAPP_BASE_URL,
  WHATSAPP_INTERNATIONAL_NUMBER,
  CHATBOT_MENU,
  constantTimeEqual,
} from '../app/lib/whatsapp.ts';
import { authorizeWebhookPost, verifyMetaSignature } from '../app/api/whatsapp/webhook/signature.ts';
import { readMetaNotification } from '../app/api/whatsapp/webhook/payload.ts';
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

test('comparação do verify token não depende de prefixo nem de tamanho', () => {
  assert.equal(constantTimeEqual('certo', 'certo'), true);
  assert.equal(constantTimeEqual('cert', 'certo'), false);
  assert.equal(constantTimeEqual('certo!', 'certo'), false);
  assert.equal(constantTimeEqual('', 'certo'), false);
  assert.equal(verifyWebhookChallenge({ mode: 'subscribe', verifyToken: null, challenge: '1' }, 'certo').ok, false);
});

test('POST do webhook falha fechado sem segredo e exige assinatura com segredo', () => {
  const secret = 'segredo-de-teste';
  const raw = '{"entry":[]}';
  const valid = `sha256=${createHmac('sha256', secret).update(raw, 'utf8').digest('hex')}`;
  assert.deepEqual(authorizeWebhookPost(raw, null, {}), { ok: false, status: 503, reason: 'segredo do app não configurado no servidor' });
  assert.equal(authorizeWebhookPost(raw, null, { allowUnsigned: '1' }).ok, false);
  assert.equal(authorizeWebhookPost(raw, null, { allowUnsigned: 'true' }).ok, true);
  assert.equal(authorizeWebhookPost(raw, valid, { appSecret: secret }).ok, true);
  // Com segredo configurado, a liberação de teste não dispensa a assinatura.
  assert.deepEqual(authorizeWebhookPost(raw, null, { appSecret: secret, allowUnsigned: 'true' }), { ok: false, status: 403, reason: 'assinatura inválida' });
  assert.equal(authorizeWebhookPost(raw, 'sha256=00', { appSecret: secret }).ok, false);
});

test('envelope Meta só com status é reconhecido (a Meta exige 200)', () => {
  const notification = readMetaNotification({
    object: 'whatsapp_business_account',
    entry: [{ changes: [{ value: { statuses: [{ status: 'delivered' }, { status: 'read' }] } }] }],
  });
  assert.deepEqual(notification, { messages: [], statuses: 2 });
});

test('envelope Meta lê todas as mensagens de texto e ignora as demais', () => {
  const notification = readMetaNotification({
    entry: [
      { changes: [{ value: { messages: [
        { from: '5582999990000', id: 'wamid.1', text: { body: ' Agendar ' } },
        { from: '5582999990001', type: 'image', image: {} },
      ] } }] },
      { changes: [{ value: { messages: [{ from: '5582999990002', text: { body: 'Valores' } }] } }] },
    ],
  });
  assert.deepEqual(notification, {
    messages: [
      { from: '5582999990000', text: 'Agendar', messageId: 'wamid.1' },
      { from: '5582999990002', text: 'Valores', messageId: undefined },
    ],
    statuses: 0,
  });
});

test('corpos que não são envelope Meta retornam null', () => {
  assert.equal(readMetaNotification(null), null);
  assert.equal(readMetaNotification({ foo: 1 }), null);
  assert.equal(readMetaNotification({ entry: 'x' }), null);
  assert.deepEqual(readMetaNotification({ entry: [null, { changes: [1] }] }), { messages: [], statuses: 0 });
});
