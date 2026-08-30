# Site Fôlha & Sousa — instruções para agentes

## Contexto obrigatório

Antes de trabalhar neste projeto:

1. Leia `../../IA/tuco-ai-memory/AGENTS.md`.
2. Leia `../../IA/tuco-ai-memory/MEMORY.md`.
3. Leia `../../IA/tuco-ai-memory/projects/folha-sousa/CONTEXT.md`.
4. Trate esses documentos como a fonte persistente de contexto e registre ali somente resultados sanitizados e duráveis.

Os caminhos relativos acima funcionam no Windows e no Linux porque o site e a memória central ficam na mesma árvore `Tuco-Compartilhado`.

## Regras do projeto

- Preserve o gerenciador de pacotes, o lockfile, a arquitetura existente e `.openai/hosting.json`.
- Não publique o site, não altere DNS e não substitua `folhaesousa.adv.br` sem aprovação expressa do usuário.
- Antes de concluir mudanças de código, execute lint e build.
- Faça um commit descritivo de toda alteração relevante e envie a branch principal somente ao repositório privado autorizado deste site.
- Não salve senhas, tokens, cookies, chaves, documentos jurídicos internos ou dados pessoais recebidos de clientes.
- Mantenha o código do site neste repositório; na memória central, registre apenas contexto, decisões, resultados de validação e próximos passos.
