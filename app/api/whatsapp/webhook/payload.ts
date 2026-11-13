/**
 * Leitura do envelope de notificações da WhatsApp Cloud API
 * (`entry[].changes[].value.messages[] | statuses[]`).
 *
 * Módulo puro (sem imports relativos) para ser testado pelo runner do Node.
 */

export type MetaTextMessage = { from: string; text: string; messageId?: string };

export type MetaNotification = {
  /** Mensagens de texto recebidas (outros tipos são ignorados nesta fase). */
  messages: MetaTextMessage[];
  /** Quantidade de atualizações de status (enviada, entregue, lida, falha). */
  statuses: number;
};

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

/**
 * Retorna `null` quando o corpo não é um envelope da Meta. Um envelope
 * válido sem mensagens (ex.: só `statuses`) não é erro: a Meta espera
 * `200` para toda notificação recebida, senão reenvia e pode desativar
 * o webhook.
 */
export function readMetaNotification(body: unknown): MetaNotification | null {
  const root = asRecord(body);
  if (!root || !Array.isArray(root.entry)) return null;

  const notification: MetaNotification = { messages: [], statuses: 0 };
  for (const entry of root.entry) {
    for (const change of asArray(asRecord(entry)?.changes)) {
      const value = asRecord(asRecord(change)?.value);
      if (!value) continue;
      notification.statuses += asArray(value.statuses).length;
      for (const raw of asArray(value.messages)) {
        const message = asRecord(raw);
        const text = asRecord(message?.text)?.body;
        if (!message || typeof message.from !== 'string' || typeof text !== 'string' || !text.trim()) continue;
        notification.messages.push({
          from: message.from,
          text: text.trim(),
          messageId: typeof message.id === 'string' ? message.id : undefined,
        });
      }
    }
  }
  return notification;
}
