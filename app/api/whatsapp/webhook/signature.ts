import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Valida a assinatura `X-Hub-Signature-256` da Meta sobre o corpo bruto.
 * Sem segredo configurado ou sem cabeçalho, recusa.
 *
 * Servidor apenas: nunca importar este módulo em componentes cliente.
 */
export function verifyMetaSignature(
  rawBody: string,
  signatureHeader: string | null,
  appSecret: string | undefined,
): boolean {
  if (!appSecret || !signatureHeader) return false;
  const expected = `sha256=${createHmac('sha256', appSecret).update(rawBody, 'utf8').digest('hex')}`;
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(signatureHeader, 'utf8');
  return a.length === b.length && timingSafeEqual(a, b);
}

export type WebhookPostAuthorization =
  | { ok: true }
  | { ok: false; status: 403 | 503; reason: string };

/**
 * Decide se um POST do webhook pode ser processado. Falha fechada:
 *
 * - com `WHATSAPP_APP_SECRET`, a assinatura da Meta é obrigatória;
 * - sem segredo, recusa com 503, exceto quando `WHATSAPP_ALLOW_UNSIGNED=true`
 *   é definido explicitamente (apenas para testes locais com `curl`).
 */
export function authorizeWebhookPost(
  rawBody: string,
  signatureHeader: string | null,
  env: { appSecret?: string; allowUnsigned?: string },
): WebhookPostAuthorization {
  if (env.appSecret) {
    return verifyMetaSignature(rawBody, signatureHeader, env.appSecret)
      ? { ok: true }
      : { ok: false, status: 403, reason: 'assinatura inválida' };
  }
  if (env.allowUnsigned === 'true') return { ok: true };
  return { ok: false, status: 503, reason: 'segredo do app não configurado no servidor' };
}
