import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { afterEach, test } from 'node:test';
import { GET, POST } from '../app/api/whatsapp/webhook/route.ts';

const URL_BASE = 'http://127.0.0.1/api/whatsapp/webhook';
const ENV_KEYS = ['WHATSAPP_VERIFY_TOKEN', 'WHATSAPP_APP_SECRET', 'WHATSAPP_ALLOW_UNSIGNED'];
const original = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));

function setEnv(values) {
  for (const key of ENV_KEYS) delete process.env[key];
  Object.assign(process.env, values);
}

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (original[key] === undefined) delete process.env[key];
    else process.env[key] = original[key];
  }
});

function post(body, headers = {}) {
  return POST(new Request(URL_BASE, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body,
  }));
}

function sign(body, secret) {
  return `sha256=${createHmac('sha256', secret).update(body, 'utf8').digest('hex')}`;
}

const statusOnly = JSON.stringify({
  object: 'whatsapp_business_account',
  entry: [{ changes: [{ value: { statuses: [{ status: 'delivered' }] } }] }],
});

test('GET: sem verify token no servidor responde 503', async () => {
  setEnv({});
  const response = await GET(new Request(`${URL_BASE}?hub.mode=subscribe&hub.verify_token=x&hub.challenge=1`));
  assert.equal(response.status, 503);
});

test('GET: token correto devolve o challenge em texto; errado devolve 403', async () => {
  setEnv({ WHATSAPP_VERIFY_TOKEN: 'certo' });
  const ok = await GET(new Request(`${URL_BASE}?hub.mode=subscribe&hub.verify_token=certo&hub.challenge=987`));
  assert.equal(ok.status, 200);
  assert.equal(await ok.text(), '987');
  assert.match(ok.headers.get('content-type'), /text\/plain/);
  const bad = await GET(new Request(`${URL_BASE}?hub.mode=subscribe&hub.verify_token=errado&hub.challenge=987`));
  assert.equal(bad.status, 403);
});

test('POST: sem segredo e sem liberação de teste falha fechado (503)', async () => {
  setEnv({});
  const response = await post(statusOnly);
  assert.equal(response.status, 503);
});

test('POST: com segredo, exige assinatura válida', async () => {
  setEnv({ WHATSAPP_APP_SECRET: 's3gredo', WHATSAPP_ALLOW_UNSIGNED: 'true' });
  assert.equal((await post(statusOnly)).status, 403);
  assert.equal((await post(statusOnly, { 'x-hub-signature-256': sign(statusOnly, 'outro') })).status, 403);
  const ok = await post(statusOnly, { 'x-hub-signature-256': sign(statusOnly, 's3gredo') });
  assert.equal(ok.status, 200);
  assert.deepEqual(await ok.json(), { received: true, messages: 0, statuses: 1 });
});

test('POST: assinatura é verificada antes do JSON (corpo inválido sem assinatura → 403)', async () => {
  setEnv({ WHATSAPP_APP_SECRET: 's3gredo' });
  assert.equal((await post('{não é json')).status, 403);
  const signed = '{não é json';
  assert.equal((await post(signed, { 'x-hub-signature-256': sign(signed, 's3gredo') })).status, 400);
});

test('POST: modo de teste local aceita envelope simplificado e recusa formato desconhecido', async () => {
  setEnv({ WHATSAPP_ALLOW_UNSIGNED: 'true' });
  const simple = await post(JSON.stringify({ from: '5582999990000', text: 'Agendar' }));
  assert.equal(simple.status, 200);
  assert.deepEqual(await simple.json(), { received: true, messages: 1, statuses: 0 });
  assert.equal((await post('{"foo":1}')).status, 422);
  assert.equal((await post('')).status, 400);
});
