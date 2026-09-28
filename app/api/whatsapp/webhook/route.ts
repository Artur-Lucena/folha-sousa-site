import { verifyMetaSignature, verifyWebhookChallenge, parseIncomingText } from '../../../lib/whatsapp';

export const dynamic = 'force-dynamic';

/**
 * Webhook do futuro chatbot de WhatsApp (Meta Cloud API).
 *
 * - GET: verificação do webhook (`hub.mode`, `hub.verify_token`, `hub.challenge`).
 * - POST: recepção de mensagens. Nesta fase apenas valida o formato e
 *   confirma o recebimento, sem armazenar dados nem chamar a Cloud API.
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
  if (!raw) {
    return Response.json({ ok: false, reason: 'corpo JSON inválido' }, { status: 400 });
  }

  // Quando o segredo do app está configurado, a assinatura da Meta passa
  // a ser obrigatória. Sem segredo, mantém o comportamento de teste inicial.
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (appSecret && !verifyMetaSignature(raw, request.headers.get('x-hub-signature-256'), appSecret)) {
    return Response.json({ ok: false, reason: 'assinatura inválida' }, { status: 403 });
  }

  let body: unknown = null;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false, reason: 'corpo JSON inválido' }, { status: 400 });
  }

  // Aceita tanto o envelope simplificado { from, text } quanto o
  // envelope Meta (entry[].changes[].value.messages[]) para facilitar
  // o teste inicial. Nenhum dado é persistido nesta fase.
  if (!parseIncomingText(body) && !extractMetaText(body)) {
    return Response.json({ ok: false, reason: 'mensagem não reconhecida' }, { status: 422 });
  }

  return Response.json({ received: true }, { status: 200 });
}

function extractMetaText(body: unknown): { from: string; text: string } | null {
  if (typeof body !== 'object' || body === null) return null;
  const entry = (body as { entry?: unknown }).entry;
  if (!Array.isArray(entry) || entry.length === 0) return null;
  const changes = (entry[0] as { changes?: unknown }).changes;
  if (!Array.isArray(changes) || changes.length === 0) return null;
  const messages = (changes[0] as { value?: { messages?: unknown } }).value?.messages;
  if (!Array.isArray(messages) || messages.length === 0) return null;
  const first = messages[0] as { from?: unknown; text?: { body?: unknown } };
  if (typeof first.from !== 'string') return null;
  const text = first.text?.body;
  if (typeof text !== 'string' || !text.trim()) return null;
  return { from: first.from, text: text.trim() };
}
