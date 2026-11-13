# Decisões pendentes do escritório (bloco 5)

Levantamento de 13/11/2026. A versão completa, para o escritório preencher, está no documento compartilhado "Novo site Fôlha & Sousa — decisões pendentes do escritório". Este arquivo guarda o que o código vai precisar quando as respostas chegarem.

Bloqueiam a publicação: itens 2, 3 e 5.

| # | Decisão | Recomendação técnica | Impacto no código |
| --- | --- | --- | --- |
| 1 | Direito Previdenciário | Incluir como 7ª área | Card em `app/page.tsx`, FAQ; ou remover de `booking.ts` |
| 2 | Migração do domínio | Aprovar o mapa abaixo e a data | `redirects()` em `next.config.ts` + teste E2E por rota |
| 3 | Loja/cobrança do site atual | Cobrança fora do site; desativar a loja | Só redirecionamento |
| 4 | Feriados e recessos | Bloquear no formulário com aviso | Lista de datas em `booking.ts` + `getDateError` |
| 5 | Publicidade (OAB) e textos legais | Revisão jurídica | Textos em `app/page.tsx` e páginas legais |
| 6 | Dados institucionais | Conferência pela equipe | `app/lib/site.ts`, `offices.ts`, `whatsapp.ts`, `booking.ts` |
| 7 | Perfil no Google | Um por unidade, dados idênticos | Nenhum |
| 8 | Chatbot do WhatsApp | Adiar | `docs/WHATSAPP-CHATBOT.md` |

## Mapa de redirecionamentos proposto (item 2)

Fonte: `https://folhaesousa.adv.br/sitemap.xml` (Yoast/WordPress), 19 URLs, consultado em 13/11/2026.

| Origem (site atual) | Destino | Código |
| --- | --- | --- |
| `/agendar-consulta/` | `/agendar` | 301 |
| `/local-de-atendimento/` | `/#contato` | 301 |
| `/local-de-atendimento/maceio/` | `/#unidade-maceio` | 301 |
| `/local-de-atendimento/paulo-afonso/` | `/#unidade-paulo-afonso` | 301 |
| `/local-de-atendimento/online/` | `/agendar?unidade=online` | 301 |
| `/profissionais/`, `/profissionais/cosmelia-folha/`, `/profissionais/savio/`, `/profissionais/rubenicio-izidro/` | `/#equipe` | 301 |
| `/servicos/`, `/servicos/atendimento/`, `/servicos/atendimento-2/` | `/#atuacao` | 301 |
| `/servicos/atendimento-trabalhista/` | `/agendar?area=trabalhista` | 301 |
| `/servicos/atendimento-previdenciario/` | `/agendar?area=previdenciario` | 301 |
| `/loja/`, `/produto/atendimento/`, `/categoria-produto/sem-categoria/` | `/agendar` | 301 |
| `/teste/` | — | 410 |
| `/politicas-de-privacidade/`, `/termo-de-consulta-juridica/`, `/termos-de-uso/` | mesmo caminho sem barra | 308 automático (já funciona) |

Observações do site atual: a página `/teste/` está pública e indexada, e os títulos usam a grafia "Folhâ". Na troca de DNS, preservar os registros MX do e-mail `contato@folhaesousa.adv.br`.
