/**
 * Central de WhatsApp do site Fôlha & Sousa.
 *
 * Hoje o site usa links `wa.me` (click-to-chat) sem backend.
 * Este módulo centraliza o número oficial e prepara o vocabulário
 * e os contratos para um futuro chatbot via WhatsApp Business Cloud API,
 * sem guardar segredos no repositório.
 *
 * Segredos (token, phone number id, verify token) vivem apenas em
 * variáveis de ambiente no servidor — ver `.env.example` e
 * `docs/WHATSAPP-CHATBOT.md`.
 */

export const WHATSAPP_DISPLAY_NUMBER = '(82) 99410-4373';
export const WHATSAPP_INTERNATIONAL_NUMBER = '5582994104373';
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_INTERNATIONAL_NUMBER}`;

export const WHATSAPP_GENERIC_MESSAGE =
  'Olá, gostaria de atendimento jurídico com o Fôlha & Sousa Advogados.';

export function buildWhatsAppLink(message: string): string {
  const text = message.trim() || WHATSAPP_GENERIC_MESSAGE;
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(text)}`;
}

export function getDefaultWhatsAppLink(): string {
  return buildWhatsAppLink(WHATSAPP_GENERIC_MESSAGE);
}

/**
 * Vocabulário oficial do futuro chatbot.
 * Deve espelhar `app/agendar/booking.ts` (áreas, consultas, formatos,
 * períodos e profissionais) para que site e bot falem a mesma língua.
 * Sem import direto entre os módulos (o runner de testes do Node exige
 * extensão explícita); a paridade é verificada por `tests/whatsapp.test.mjs`.
 */
export const CHATBOT_MENU = {
  greeting:
    'Olá! Sou o assistente virtual do Fôlha & Sousa Advogados. Escolha uma opção:',
  options: [
    'Agendar consulta',
    'Falar com a equipe',
    'Ver áreas de atuação',
    'Ver valores de consulta',
  ],
  disclaimer:
    'Este atendimento é informativo. Não envie documentos ou detalhes sensíveis até ser orientado pela equipe em canal oficial.',
  businessHours: 'Segunda a sexta, das 9h às 18h (horário de Maceió).',
} as const;

export type ChatbotMenuOption = (typeof CHATBOT_MENU.options)[number];

export type WebhookVerificationParams = {
  mode: string | null;
  verifyToken: string | null;
  challenge: string | null;
};

export function verifyWebhookChallenge(
  params: WebhookVerificationParams,
  expectedVerifyToken: string | undefined,
): { ok: boolean; challenge?: string; reason?: string } {
  if (!expectedVerifyToken) return { ok: false, reason: 'verify token não configurado no servidor' };
  if (params.mode !== 'subscribe' || !params.challenge) {
    return { ok: false, reason: 'parâmetros de verificação ausentes' };
  }
  if (params.verifyToken !== expectedVerifyToken) {
    return { ok: false, reason: 'verify token inválido' };
  }
  return { ok: true, challenge: params.challenge };
}

export type IncomingWhatsAppMessage = {
  from: string;
  text: string;
  messageId?: string;
};

export function parseIncomingText(body: unknown): IncomingWhatsAppMessage | null {
  if (typeof body !== 'object' || body === null) return null;
  const record = body as Record<string, unknown>;
  const from = typeof record.from === 'string' ? record.from.trim() : '';
  const text = typeof record.text === 'string' ? record.text.trim() : '';
  if (!from || !text) return null;
  const messageId = typeof record.messageId === 'string' ? record.messageId : undefined;
  return { from, text, messageId };
}
