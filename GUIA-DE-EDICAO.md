# Guia de edição — Fôlha & Sousa Advogados

Esta pasta contém a cópia editável completa do site. Ela pode ser aberta diretamente no Visual Studio Code por **Arquivo → Abrir Pasta**.

## Pasta compartilhada

- Windows: `D:\Tuco-Compartilhado\Workplaces\Escritorio Sousa e Folha`
- Linux: `/run/media/tuco/Games/Tuco-Compartilhado/Workplaces/Escritorio Sousa e Folha`

Use a pasta compartilhada como projeto principal. O caminho do Linux estará disponível quando a partição `Games` estiver montada.

## Onde alterar cada parte

**Dados de contato e institucionais têm uma fonte só — altere ali e o site inteiro acompanha** (páginas, rodapé, textos legais, FAQ, dados estruturados, metadados, sitemap):

- `app/lib/site.ts`: domínio, nome, e-mail, CNPJ, redes sociais, horário, imagem de compartilhamento e o helper `pageMetadata` (título, descrição e canonical de cada página).
- `app/lib/whatsapp.ts`: telefone/WhatsApp.
- `app/lib/offices.ts`: endereços, salas, fotos e mapas das unidades (a primeira é a sede).
- `app/agendar/booking.ts`: valores das consultas (usados também na FAQ e no Termo de Consulta).

- `app/page.tsx`: conteúdo e estrutura da página inicial.
- `app/globals.css`: cores, tipografia, tamanhos, espaçamentos, animações e responsividade.
- `app/components/Header.tsx`: cabeçalho e menus.
- `app/components/MotionProvider.tsx`: política global de movimento (reduced-motion + transição editorial).
- `app/components/Reveal.tsx`: revelação sob scroll (`Reveal`, `Stagger`, `StaggerItem`).
- `app/components/HeroTitle.tsx`: título do hero com revelação palavra por palavra.
- `app/components/HeroVisual.tsx`: bloco visual do hero com parallax (desligado em reduced-motion).
- `app/components/ClipReveal.tsx`: revelação de fotos por recorte.
- `app/components/ArrowLink.tsx`: link editorial com seta viva.
- `app/components/Pressable.tsx`: micro-interação de pressão para CTAs.
- `app/components/FaqAccordion.tsx`: sanfona animada das perguntas frequentes.
- `app/components/Footer.tsx`: rodapé, redes sociais e botão do WhatsApp.
- `app/agendar/`: página e formulário de agendamento.
- `app/agendar/booking.ts`: opções, preços, validação e preparação da mensagem de agendamento.
- `app/lib/whatsapp.ts`: número oficial, links `wa.me` e vocabulário do futuro chatbot.
- `app/api/whatsapp/webhook/route.ts`: verificação e recepção do webhook (sem persistência).
- `docs/WHATSAPP-CHATBOT.md`: guia de integração com a Cloud API.
- `.env.example`: variáveis necessárias no servidor (nunca commitar valores reais).
- `tests/booking.test.mjs`: testes das regras de agendamento, sem enviar mensagens.
- `tests/whatsapp.test.mjs`: testes dos links e da verificação do webhook, sem segredos.
- `tests/site.test.mjs`: testes dos dados institucionais e dos metadados.
- `tests/webhook-route.test.mjs`: testes das respostas reais do webhook (GET e POST).
- `e2e/site.spec.ts`: testes de ponta a ponta e acessibilidade (Playwright + axe).
- `lighthouserc.json`: metas do Lighthouse no CI.
- `app/lib/security-headers.ts` e `next.config.ts`: cabeçalhos de segurança (CSP, HSTS, anti-iframe). Ao incluir qualquer serviço externo (mapa embutido, analytics, fonte remota), libere a origem na CSP.
- `app/icon.svg`, `app/apple-icon.png`, `app/manifest.ts` e `public/icons/`: ícones do site. Os PNG são gerados a partir do `icon.svg`.
- `testar-local.ps1` / `testar-local.sh`: validação local completa no Windows / Linux.
- `app/politicas-de-privacidade/`: política de privacidade.
- `app/perguntas-frequentes/`: perguntas frequentes com dados estruturados FAQ.
- `app/termo-de-consulta-juridica/`: termo da consulta.
- `app/termos-de-uso/`: termos de uso.
- `app/layout.tsx`: título, descrição e metadados gerais.
- `public/assets/`: logos, fotos e imagens usadas no site.
- `public/fonts/`: arquivos da fonte Source Serif 4.
- `public/og.jpg`: imagem 1200x630 exibida ao compartilhar o site.
- `docs/`: relatório de testes e documentação de apoio.

## Executar localmente

O caminho mais rápido é o script da raiz (valida tudo e abre o navegador):

```powershell
powershell -ExecutionPolicy Bypass -File .\testar-local.ps1
```

É necessário ter Node.js 22 ou superior e o pnpm instalados.

No terminal integrado do VS Code, dentro desta pasta:

```powershell
corepack enable
pnpm install
pnpm dev
```

Depois, acesse `http://localhost:3000/`.

## Verificações antes de salvar uma versão

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Arquivos que não precisam ser guardados

As pastas `node_modules`, `dist`, `.next`, `.vinext` e `.wrangler`, além do arquivo `tsconfig.tsbuildinfo`, são geradas automaticamente. Elas não foram copiadas porque ocupam centenas de megabytes e podem ser recriadas pelos comandos acima.

Ao alternar entre Windows e Linux, reinstale as dependências no sistema em uso. Não reutilize uma pasta `node_modules` criada pelo outro sistema operacional.

## Agendamento e validação

O formulário valida os dados no próprio dispositivo e prepara uma mensagem para o WhatsApp. Nome, telefone, e-mail, opções e aceite são verificados novamente antes de abrir o link; a data usa o dia corrente em Maceió, inclusive se a página atravessar a meia-noite. A disponibilidade e os feriados continuam sujeitos à confirmação da equipe.

Os controles permanecem desabilitados até o JavaScript estar pronto. Sem JavaScript, há um contato direto alternativo; os dados não são enviados por GET à página. Ao alterar as regras de atendimento, atualize os testes e confira também os textos legais, que dependem de aprovação do escritório.

## Importante

O projeto permanece em testes. Não publicar, substituir o domínio atual ou alterar DNS sem aprovação expressa.
