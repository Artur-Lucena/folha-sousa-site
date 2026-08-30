# Validação funcional do site Fôlha & Sousa

Data: 2026-08-29

Ambiente: desenvolvimento local no Windows, sem publicação.

## Resultado geral

A versão local está funcional nos fluxos principais. A compilação, a checagem de tipos e o lint foram aprovados, todas as rotas e ativos esperados responderam corretamente e não houve erro no console do navegador.

As quatro pendências técnicas encontradas na primeira rodada foram corrigidas e revalidadas em 2026-08-30.

## Testes aprovados

- compilação de produção;
- checagem de tipos TypeScript;
- Home, agendamento, três páginas legais, sitemap e robots com resposta HTTP 200;
- página inexistente com resposta HTTP 404 e atalhos de retorno;
- logo, imagens, cartão social e fontes locais disponíveis;
- navegação principal e âncoras das seções;
- menu móvel abre e exibe todos os atalhos;
- formulário bloqueia campos obrigatórios, e-mail inválido e datas passadas;
- alteração do tipo de consulta atualiza o valor de R$ 350,00 para R$ 500,00;
- links dos perfis selecionam Cosmélia Fôlha ou Domingos Sávio de Sousa;
- envio válido gera a URL do WhatsApp com área, consulta, valor, profissional, formato, data, período e dados de contato corretamente codificados;
- nenhum envio de mensagem foi concluído durante o teste;
- páginas legais apresentam títulos e navegação lateral, sem erro de console;
- títulos, uma única H1 por página, URLs canônicas, Open Graph, sitemap, robots e JSON-LD `LegalService` válidos;
- 15 imagens carregadas após a rolagem, sem arquivo quebrado;
- fonte Source Serif 4 carregada localmente;
- links de Maps, WhatsApp, Instagram e Facebook alcançáveis;
- contraste principal entre 4,77:1 e 16,92:1;
- layouts de 340 a 1440 px sem excesso horizontal e com troca correta entre menu móvel e navegação de computador;
- formulário em 390 px usa uma coluna e botão com largura integral.

## Correções concluídas em 2026-08-30

- o atalho “Ir para o conteúdo” agora desloca a página e move o foco para o conteúdo principal;
- o menu móvel fecha ao selecionar uma seção ou abrir o agendamento;
- a grade do rodapé não produz excesso horizontal em 320 px;
- os links do termo de consulta e da política de privacidade que abrem nova aba usam `rel="noreferrer"`;
- a data mínima do formulário e a seleção do profissional por URL passaram a ser resolvidas sem atualização síncrona em `useEffect`;
- os links internos apontados pelo lint usam o componente de navegação do framework.

## Qualidade de código

Lint, TypeScript e compilação de produção concluíram sem erros em 2026-08-30. A revalidação também confirmou as rotas HTTP, a data mínima de 2026-08-30, a seleção de Cosmélia Fôlha por URL e os atributos de proteção dos links legais.

## Limites desta validação

Dados institucionais, biografias, valores das consultas e redação jurídica das páginas legais ainda dependem de confirmação do escritório.
