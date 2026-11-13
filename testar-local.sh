#!/usr/bin/env bash
# testar-local.sh — Equivalente Linux/macOS do testar-local.ps1.
#
# O que faz, nesta ordem:
#   1. confere Node.js 22+ e pnpm (via corepack);
#   2. instala dependências (só se node_modules não existir);
#   3. roda lint, typecheck, testes e build (para no primeiro erro);
#   4. sobe o servidor de produção em 127.0.0.1 e confere as rotas;
#   5. deixa o servidor no ar (ou encerra com --parar-ao-final).
#
# Uso (na raiz do projeto):
#   ./testar-local.sh                 # porta 3000
#   ./testar-local.sh --porta 3001
#   ./testar-local.sh --parar-ao-final
set -euo pipefail

PORTA=3000
PARAR_AO_FINAL=0
while [ $# -gt 0 ]; do
  case "$1" in
    --porta) PORTA="$2"; shift 2 ;;
    --parar-ao-final) PARAR_AO_FINAL=1; shift ;;
    *) echo "Opção desconhecida: $1" >&2; exit 2 ;;
  esac
done

passo() { printf '\n\033[36m=== %s ===\033[0m\n' "$1"; }
falhar() { printf '\033[31mFALHA: %s\033[0m\n' "$1" >&2; exit 1; }

[ -f package.json ] || falhar 'Execute este script na raiz do projeto (onde está o package.json).'

passo 'Ferramentas'
command -v node >/dev/null || falhar 'Node.js 22+ não encontrado.'
command -v curl >/dev/null || falhar 'curl não encontrado.'
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
[ "$NODE_MAJOR" -ge 22 ] || falhar "Node.js 22+ necessário (encontrado $(node --version))."
export CI=true
node --version
corepack pnpm --version || falhar 'pnpm indisponível via corepack.'
PNPM=(corepack pnpm)

passo 'Dependências'
if [ ! -d node_modules ]; then "${PNPM[@]}" install --frozen-lockfile; else echo 'node_modules já existe; instalação pulada.'; fi

passo 'Lint';  "${PNPM[@]}" lint
passo 'Tipos'; "${PNPM[@]}" typecheck
passo 'Testes'; "${PNPM[@]}" test
passo 'Build'; "${PNPM[@]}" build

passo "Servidor local (porta $PORTA)"
# Só para o teste local: aceita POST sem assinatura (o servidor não tem WHATSAPP_APP_SECRET aqui).
WHATSAPP_ALLOW_UNSIGNED=true node_modules/.bin/vinext start -p "$PORTA" -H 127.0.0.1 >/tmp/folha-sousa-servidor.log 2>&1 &
SERVIDOR=$!
encerrar() { kill "$SERVIDOR" 2>/dev/null || true; }
trap 'encerrar' INT TERM

BASE="http://127.0.0.1:$PORTA"
codigo='000'
for _ in $(seq 1 45); do
  codigo="$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "$BASE/pagina-sonda-teste" || true)"
  [ "$codigo" != '000' ] && break
  sleep 2
done
[ "$codigo" != '000' ] || { encerrar; falhar "O servidor não respondeu na porta $PORTA."; }

FALHAS=0
verificar() { # descrição, obtido, esperado
  if [ "$2" = "$3" ]; then echo "$1 -> $2 OK"; else echo "$1 -> $2 ERRO (esperado $3)"; FALHAS=$((FALHAS + 1)); fi
}
status() { curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$@"; }
contem() { if grep -qF -- "$2" <<<"$1"; then echo sim; else echo nao; fi; }

passo 'Rotas'
for rota in / /agendar /perguntas-frequentes /politicas-de-privacidade /termo-de-consulta-juridica /termos-de-uso /sitemap.xml /robots.txt /og.jpg /assets/hero-office.webp; do
  verificar "$rota" "$(status "$BASE$rota")" 200
done
verificar /pagina-inexistente-xyz "$(status "$BASE/pagina-inexistente-xyz")" 404

passo 'Agendamento por área e unidade'
HOME_HTML="$(curl -s --max-time 10 "$BASE/")"
# O HTML repete os links no payload do React; basta haver ao menos 6.
AREAS="$(grep -o 'agendar?area=' <<<"$HOME_HTML" | wc -l | tr -d ' ')"
verificar 'home: ao menos 6 links de área' "$([ "$AREAS" -ge 6 ] && echo sim || echo nao)" sim
verificar 'home: department das unidades' "$(contem "$HOME_HTML" 'unidade-paulo-afonso')" sim
AG_HTML="$(curl -s --max-time 10 "$BASE/agendar?area=tributario&unidade=paulo-afonso&profissional=savio")"
verificar 'agendar: unidade preservada' "$(contem "$AG_HTML" '<option selected="">Presencial em Paulo Afonso</option>')" sim
BAD_HTML="$(curl -s --max-time 10 "$BASE/agendar?area=__proto__&unidade=outra&profissional=outro")"
verificar 'agendar: parâmetros inválidos voltam ao padrão' "$(contem "$BAD_HTML" '<option value="" disabled="" selected="">Selecione uma')" sim

passo 'Webhook do WhatsApp'
WH="$BASE/api/whatsapp/webhook"
verificar 'POST simplificado' "$(curl -s --max-time 10 -X POST -H 'content-type: application/json' -d '{"from":"5582999990000","text":"Agendar consulta"}' "$WH")" '{"received":true,"messages":1,"statuses":0}'
verificar 'POST inválido' "$(status -X POST -H 'content-type: application/json' -d '{"foo":1}' "$WH")" 422
verificar 'POST só status da Meta' "$(curl -s --max-time 10 -X POST -H 'content-type: application/json' -d '{"object":"whatsapp_business_account","entry":[{"changes":[{"value":{"statuses":[{"status":"delivered"}]}}]}]}' "$WH")" '{"received":true,"messages":0,"statuses":1}'
verificar 'GET sem segredo' "$(status "$WH?hub.mode=subscribe&hub.verify_token=x&hub.challenge=1234")" 503

if [ "$FALHAS" -gt 0 ]; then encerrar; falhar "$FALHAS verificação(ões) de rota falharam."; fi

printf '\n\033[32mTudo certo: lint, tipos, testes, build e rotas aprovados.\033[0m\n'
if [ "$PARAR_AO_FINAL" -eq 1 ]; then
  encerrar; echo 'Servidor encerrado (--parar-ao-final).'
else
  echo "Servidor no ar em $BASE (Ctrl+C para encerrar)."
  wait "$SERVIDOR"
fi
