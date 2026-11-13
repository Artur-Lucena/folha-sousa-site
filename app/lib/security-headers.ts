/**
 * Cabeçalhos de segurança aplicados a todas as respostas (via `next.config.ts`).
 *
 * A CSP permite `'unsafe-inline'` em scripts e estilos porque o React/Next
 * injeta scripts inline de hidratação e dados estruturados (JSON-LD), e o
 * Motion usa estilos inline. Mesmo assim ela bloqueia scripts, estilos,
 * fontes e conexões de terceiros, plugins, `<base>` alterado e o site
 * dentro de iframes. Endurecer com nonces exige middleware e fica para depois.
 *
 * Módulo puro, para ser testado pelo runner de testes do Node.
 */

export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "manifest-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

export type SecurityHeader = { key: string; value: string };

/**
 * @param production em desenvolvimento a CSP fica de fora (o servidor do
 *   Vite usa WebSocket e módulos dinâmicos para recarregar a página).
 */
export function securityHeaders(production: boolean): SecurityHeader[] {
  const headers: SecurityHeader[] = [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  ];
  if (production) {
    headers.push(
      { key: 'Content-Security-Policy', value: CONTENT_SECURITY_POLICY },
      // Só tem efeito sob HTTPS. Sem `includeSubDomains`/`preload` até
      // confirmar que todos os subdomínios do escritório usam HTTPS.
      { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
    );
  }
  return headers;
}
