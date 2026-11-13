# Fôlha & Sousa Advogados — novo site

Versão local em desenvolvimento. Não publicar nem apontar o domínio sem aprovação expressa.

## Teste local rápido

```powershell
powershell -ExecutionPolicy Bypass -File .\testar-local.ps1
```

O script confere ferramentas, roda lint, tipos, testes e build, sobe o servidor em `http://127.0.0.1:3000`, verifica as rotas e abre o navegador. Detalhes de edição em `GUIA-DE-EDICAO.md`.

No Linux ou macOS, o equivalente é:

```bash
./testar-local.sh
```

## Testes de ponta a ponta e acessibilidade

```bash
corepack pnpm build
corepack pnpm e2e
```

Os testes (Playwright + axe) rodam no build de produção em desktop e celular: acessibilidade WCAG 2.1 AA em todas as páginas, metadados, conteúdo visível sem JavaScript, menu móvel, FAQ e o agendamento até a mensagem do WhatsApp (o `wa.me` é simulado). Na primeira vez, instale o navegador com `corepack pnpm exec playwright install chromium`.

O CI do GitHub roda lint, build, tipos, testes unitários, E2E e Lighthouse (`lighthouserc.json`: acessibilidade ≥ 95 e SEO ≥ 90 bloqueiam; desempenho e boas práticas apenas avisam). Os relatórios ficam como artefato da execução, sem upload público.

## Conteúdo implementado

- página institucional completa;
- seis áreas de atuação;
- apresentação do escritório e dos sócios;
- atendimento nacional e internacional;
- contato e solicitação de consulta pelo WhatsApp;
- política de privacidade, termo de consulta e termos de uso;
- metadados sociais, dados estruturados, sitemap, robots e página 404.

## Fluxo de agendamento

O formulário não armazena dados, não recebe documentos e não realiza cobrança. Após o aceite dos termos, ele prepara uma mensagem e direciona o visitante ao WhatsApp oficial do escritório.

## Validação antes do lançamento

- confirmar endereço, telefone e e-mail;
- revisar valores e regras da consulta;
- obter aprovação jurídica dos textos legais;
- revisar títulos, formação e descrição profissional dos sócios;
- testar todos os links em computador e celular;
- somente então definir a estratégia de publicação e migração do domínio.
