# Chatbot de WhatsApp — guia de integração

O site hoje usa links `wa.me` (click-to-chat). O formulário de agendamento
valida tudo no navegador e abre o WhatsApp com a mensagem pronta. Nenhum
dado é armazenado pelo site.

Este documento prepara a evolução para um chatbot automático via
**WhatsApp Business Cloud API (Meta)**, sem expor segredos no repositório.

## Arquitetura atual → futura

| Etapa | Atual | Com chatbot |
|---|---|---|
| Origem | `app/agendar/booking.ts` + `app/lib/whatsapp.ts` | mesmas listas como fonte de verdade |
| Transporte | `https://wa.me/5582994104373?text=...` | Cloud API (`POST /v22.0/{PHONE_NUMBER_ID}/messages`) |
| Webhook | `GET/POST /api/whatsapp/webhook` (validação + confirmação, sem persistência) | mesmo endpoint, acrescido de envio de respostas e handoff humano |
| Segredos | nenhum no repo | só em variáveis de ambiente no servidor |

## Variáveis de ambiente (servidor, nunca no Git)

Ver `.env.example`:

- `WHATSAPP_VERIFY_TOKEN` — string aleatória criada pelo escritório, usada na verificação do webhook.
- `WHATSAPP_ACCESS_TOKEN` — token do app Meta (curta/longa duração ou token de sistema).
- `WHATSAPP_PHONE_NUMBER_ID` — ID do número na Cloud API.
- `WHATSAPP_APP_SECRET` — (opcional nesta fase) para validar assinatura `X-Hub-Signature-256`.

## Passo a passo (Meta)

1. Criar um app em `developers.facebook.com` e adicionar o produto **WhatsApp**.
2. Registrar o número comercial e anotar o **Phone Number ID**.
3. Gerar o **Access Token** (em produção, usuário de sistema, nunca token pessoal).
4. Configurar o webhook no painel Meta:
   - URL: `https://SEU-DOMINIO/api/whatsapp/webhook`
   - Verify Token: o mesmo valor de `WHATSAPP_VERIFY_TOKEN` no servidor.
   - Assinar o campo `messages`.
5. Testar a verificação (exemplo sem segredos reais):

```bash
curl -i "http://localhost:3000/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=SEU_TOKEN&hub.challenge=1234"
```

6. Testar a recepção simplificada:

```bash
curl -i -X POST http://localhost:3000/api/whatsapp/webhook \
  -H 'content-type: application/json' \
  -d '{"from":"5582999990000","text":"Agendar consulta"}'
```

Resposta esperada nesta fase: `{"received":true}`.

## Regras do escritório (LGPD e sigilo)

- Não persistir mensagens, documentos ou dados pessoais no webhook.
- Manter o aviso: não pedir documentos ou detalhes sensíveis antes da orientação humana.
- Exigir aceite do Termo de Consulta e da Política de Privacidade antes de confirmar qualquer agendamento.
- Todo handoff para humano deve preservar contexto mínimo (área, formato, data preferida) e apagar o restante.
- Registrar qualquer decisão de retenção em `tuco-ai-memory/decisions/`, nunca neste repo.

## Pronto nesta fase (2026-09-28)

- Validação de `X-Hub-Signature-256` com `WHATSAPP_APP_SECRET` (obrigatória quando o segredo está configurado; `verifyMetaSignature` em `app/lib/whatsapp.ts`).
- Horário comercial em `isBusinessHours` (seg–sex, 9h–18h, Maceió) e mensagem fora de horário a partir de `CHATBOT_MENU.businessHours`.
- Montador de botões interativos `buildInteractiveButtons` no contrato da Cloud API (máx. 3, títulos de 20 caracteres).
- Testes de contrato em `tests/whatsapp.test.mjs` (assinatura, horário, botões).

## Próximo incremento (quando o escritório aprovar)

- Implementar envio via Cloud API com fila e idempotência (`messageId`).
- Reutilizar `areas`, `consultationPrices`, `formats`, `periods` e `professionals` de `booking.ts` como botões interativos do bot.
- Adicionar testes de contrato do payload Meta completo.
- Definir mensagem de feriados e handoff humano com contexto mínimo.
