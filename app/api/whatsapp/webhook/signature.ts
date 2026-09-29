import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Valida a assinatura `X-Hub-Signature-256` da Meta sobre o corpo bruto.
 * Sem segredo configurado ou sem cabeçalho, recusa (o chamador decide
 * se a verificação é obrigatória — ver `route.ts`).
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
