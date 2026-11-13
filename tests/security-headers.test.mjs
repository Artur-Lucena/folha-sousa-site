import assert from 'node:assert/strict';
import test from 'node:test';
import { CONTENT_SECURITY_POLICY, securityHeaders } from '../app/lib/security-headers.ts';

const byKey = (headers) => Object.fromEntries(headers.map(({ key, value }) => [key, value]));

test('produção inclui CSP e HSTS, sem chaves repetidas', () => {
  const headers = securityHeaders(true);
  const map = byKey(headers);
  assert.equal(Object.keys(map).length, headers.length);
  assert.equal(map['Content-Security-Policy'], CONTENT_SECURITY_POLICY);
  assert.equal(map['Strict-Transport-Security'], 'max-age=31536000');
  assert.equal(map['X-Frame-Options'], 'DENY');
});

test('desenvolvimento omite CSP e HSTS para não quebrar o recarregamento do Vite', () => {
  const map = byKey(securityHeaders(false));
  assert.equal(map['Content-Security-Policy'], undefined);
  assert.equal(map['Strict-Transport-Security'], undefined);
  assert.equal(map['X-Content-Type-Options'], 'nosniff');
});

test('CSP bloqueia origens de terceiros e iframes', () => {
  for (const directive of ["default-src 'self'", "object-src 'none'", "frame-ancestors 'none'", "base-uri 'self'", "connect-src 'self'"]) {
    assert.ok(CONTENT_SECURITY_POLICY.includes(directive), directive);
  }
  assert.ok(!/https?:\/\//.test(CONTENT_SECURITY_POLICY), 'nenhuma origem externa liberada');
});
