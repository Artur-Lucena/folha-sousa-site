import { verifyWebhookChallenge, parseIncomingText } from '../../../lib/whatsapp.ts';
import { readMetaNotification } from './payload.ts';
import { authorizeWebhookPost } from './signature.ts';

export const dynamic = 'force-dynamic';

/**
 * Webhook do futuro chatbot de WhatsApp (Meta Cloud API).
 *
 * - GET: verificação do webhook (`hub.mode`, `hub.verify_token`, `hub.challenge`).
 * - POST: recepção de notificações. Exige a assinatura da Meta
 *   (`WHATSAPP_APP_SECRET`); só aceita POST sem assinatura com
 *   `WHATSAPP_ALLOW_UNSIGNED=true` (testes locais). Nesta fase apenas valida
 *   o formato e confirma o recebimento, sem armazenar dados nem chamar a Cloud API.
 *
 * Nenhum segredo é lido do código: tudo vem de variáveis de ambiente.
 * Ver `docs/WHATSAPP-CHATBOT.md` e `.env.example`.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const result = verifyWebhookChallenge(
    {
      mode: url.searchParams.get('hub.mode'),
      verifyToken: url.searchParams.get('hub.verify_token'),
      challenge: url.searchParams.get('hub.challenge'),
    },
    process.env.WHATSAPP_VERIFY_TOKEN,
  );

  if (!result.ok || !result.challenge) {
    const status = result.reason === 'verify token não configurado no servidor' ? 503 : 403;
    return Response.json({ ok: false, reason: result.reason ?? 'verificação recusada' }, { status });
  }

  return new Response(result.challenge, {
    status: 200,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}

export async function POST(request: Request) {
  const raw = await request.text();

  // Assinatura antes de qualquer interpretação do corpo (falha fechada).
  const authorization = authorizeWebhookPost(raw, request.headers.get('x-hub-signature-256'), {
    appSecret: process.env.WHATSAPP_APP_SECRET,
    allowUnsigned: process.env.WHATSAPP_ALLOW_UNSIGNED,
  });
  if (!authorization.ok) {
    return Response.json({ ok: false, reason: authorization.reason }, { status: authorization.status });
  }

  let body: unknown = null;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false, reason: 'corpo JSON inválido' }, { status: 400 });
  }

  // Envelope Meta: confirma toda notificação (mensagens e status) com 200.
  // Nenhum dado é persistido nesta fase.
  const notification = readMetaNotification(body);
  if (notification) {
    return Response.json({ received: true, messages: notification.messages.length, statuses: notification.statuses });
  }

  // Envelope simplificado { from, text }, para testes locais com `curl`.
  if (parseIncomingText(body)) {
    return Response.json({ received: true, messages: 1, statuses: 0 });
  }

  return Response.json({ ok: false, reason: 'mensagem não reconhecida' }, { status: 422 });
}
