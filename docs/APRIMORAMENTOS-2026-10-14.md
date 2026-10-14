# Aprimoramentos com base no site institucional

Referência consultada: https://folhaesousa.adv.br/ em 14/10/2026.
Base do repositório: `8c396fceb33cd1c5801246d6ad40ee4247f315a3`.

## Alterações

- As seis áreas de atuação têm um resumo para leitura rápida, detalhes expansíveis e um link de consulta que preenche a área no agendamento.
- As unidades de Maceió/AL e Paulo Afonso/BA usam uma fonte de dados compartilhada, endereços semânticos, acesso ao mapa e agendamento com a unidade preenchida.
- O agendamento aceita parâmetros de área, profissional e unidade, validando-os contra as opções existentes. Valores desconhecidos retornam às escolhas padrão e o visitante pode alterar qualquer opção antes de enviar.
- A FAQ e os metadados de agendamento incluem o atendimento presencial em Paulo Afonso.
- Os dados estruturados institucionais descrevem as duas unidades e as áreas de atuação.
- Links e detalhes dos cards têm identificação contextual para leitores de tela e áreas de interação apropriadas para toque.

## Validação

- `pnpm install --frozen-lockfile`: concluído sem alterar dependências ou lockfile.
- `pnpm lint`: passou.
- `pnpm typecheck`: passou.
- `pnpm test`: 22 testes passaram, incluindo parâmetros inválidos e a preservação de preferências na mensagem do WhatsApp.
- `pnpm build`: passou.
- Verificação HTTP da versão de produção: página inicial, agendamento e páginas institucionais responderam corretamente. Confirmados os seis links de área, dois links de unidade, dados estruturados e seleções iniciais de área, profissional e formato.
- `git diff --check`: passou.

Não houve publicação, mudança de DNS ou substituição do domínio. As fotos, a identidade visual, a arquitetura e a configuração de hospedagem foram preservadas.

## Limites e próximo passo

A memória central referenciada por `AGENTS.md` não estava disponível neste ambiente. Não foi criada ou alterada uma memória substituta. Este relatório registra somente alterações e resultados sanitizados no próprio repositório.

A verificação visual em navegador não estava disponível; revisar computador e celular antes de aprovar uma publicação.
