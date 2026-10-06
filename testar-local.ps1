# testar-local.ps1 — Valida e serve o site Fôlha & Sousa localmente.
#
# O que faz, nesta ordem:
#   1. confere Node.js 22+ e pnpm;
#   2. instala dependências (só se node_modules não existir);
#   3. roda lint, typecheck, testes e build (para no primeiro erro);
#   4. sobe o servidor de produção em 127.0.0.1 e confere as rotas;
#   5. abre o navegador e deixa o servidor no ar para navegação.
#
# Uso (na raiz do projeto):
#   powershell -ExecutionPolicy Bypass -File .\testar-local.ps1
#   powershell -ExecutionPolicy Bypass -File .\testar-local.ps1 -Porta 3001
#
# Opções:
#   -NaoAbrirNavegador  não abre o navegador ao final.
#   -PararAoFinal       encerra o servidor após as verificações (uso automatizado).

param(
  [int]$Porta = 3000,
  [switch]$NaoAbrirNavegador,
  [switch]$PararAoFinal
)

$ErrorActionPreference = 'Stop'

function Passo([string]$nome) {
  Write-Host ''
  Write-Host "=== $nome ===" -ForegroundColor Cyan
}

function Falhar([string]$mensagem) {
  Write-Host "FALHA: $mensagem" -ForegroundColor Red
  exit 1
}

function Executar([string]$titulo, [string]$comando, [string[]]$argumentos) {
  Write-Host "> $titulo" -ForegroundColor Gray
  & $comando @argumentos
  if (-not $?) { Falhar $titulo }
}

if (-not (Test-Path -LiteralPath 'package.json')) {
  Falhar 'Execute este script na raiz do projeto (onde está o package.json).'
}

Passo 'Ferramentas'
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  if (Test-Path -LiteralPath 'C:\Program Files\nodejs\node.exe') {
    $env:PATH = 'C:\Program Files\nodejs;' + $env:PATH
  } else {
    Falhar 'Node.js 22+ não encontrado. Instale com: winget install --id OpenJS.NodeJS.LTS --silent'
  }
}
$env:CI = 'true'
node --version
if (-not $?) { Falhar 'Node.js não responde.' }
corepack pnpm --version
if (-not $?) { Falhar 'pnpm indisponível via corepack.' }

Passo 'Dependências'
if (-not (Test-Path -LiteralPath 'node_modules')) {
  Executar 'pnpm install' 'corepack' @('pnpm', 'install', '--frozen-lockfile')
} else {
  Write-Host 'node_modules já existe; instalação pulada.'
}

Passo 'Lint'
Executar 'pnpm lint' 'corepack' @('pnpm', 'lint')

Passo 'Tipos'
Executar 'pnpm typecheck' 'corepack' @('pnpm', 'typecheck')

Passo 'Testes'
Executar 'pnpm test' 'corepack' @('pnpm', 'test')

Passo 'Build'
Executar 'pnpm build' 'corepack' @('pnpm', 'build')

Passo "Servidor local (porta $Porta)"
$estiloJanela = 'Minimized'
if ($PararAoFinal) { $estiloJanela = 'Hidden' }
$servidor = Start-Process -FilePath 'node_modules\.bin\vinext.cmd' -ArgumentList 'start', '-p', "$Porta", '-H', '127.0.0.1' -PassThru -WindowStyle $estiloJanela
if (-not $?) { Falhar 'Não foi possível iniciar o servidor.' }

$codigo = '000'
for ($i = 0; $i -lt 45; $i++) {
  Start-Sleep -Seconds 4
  $codigo = curl.exe -s -o NUL -w '%{http_code}' --max-time 5 "http://127.0.0.1:$Porta/pagina-sonda-teste"
  if ($codigo -ne '000') { break }
}
if ($codigo -eq '000') {
  taskkill /PID $servidor.Id /T /F | Out-Null
  Falhar "O servidor não respondeu na porta $Porta."
}

Passo 'Rotas'
$falhas = 0
$rotas200 = @('/', '/agendar', '/perguntas-frequentes', '/politicas-de-privacidade', '/termo-de-consulta-juridica', '/termos-de-uso', '/sitemap.xml', '/robots.txt', '/og.jpg', '/assets/hero-office.webp')
foreach ($rota in $rotas200) {
  $c = curl.exe -s -o NUL -w '%{http_code}' --max-time 10 "http://127.0.0.1:$Porta$rota"
  $ok = $c -eq '200'
  if (-not $ok) { $falhas++ }
  Write-Host ("{0} -> {1} {2}" -f $rota, $c, $(if ($ok) { 'OK' } else { 'ERRO' }))
}
$c404 = curl.exe -s -o NUL -w '%{http_code}' --max-time 10 "http://127.0.0.1:$Porta/pagina-inexistente-xyz"
Write-Host ('/pagina-inexistente-xyz -> {0} {1}' -f $c404, $(if ($c404 -eq '404') { 'OK' } else { 'ERRO' }))
if ($c404 -ne '404') { $falhas++ }

$whOk = Join-Path $env:TEMP 'wh-ok.json'
$whRuim = Join-Path $env:TEMP 'wh-ruim.json'
[System.IO.File]::WriteAllText($whOk, '{"from":"5582999990000","text":"Agendar consulta"}')
[System.IO.File]::WriteAllText($whRuim, '{"foo":1}')
$respOk = curl.exe -s --max-time 10 -X POST -H 'content-type: application/json' --data-binary "@$whOk" "http://127.0.0.1:$Porta/api/whatsapp/webhook"
$okWebhook = $respOk -eq '{"received":true}'
Write-Host ("POST /api/whatsapp/webhook (válido) -> {0} {1}" -f $respOk, $(if ($okWebhook) { 'OK' } else { 'ERRO' }))
if (-not $okWebhook) { $falhas++ }
$c422 = curl.exe -s -o NUL -w '%{http_code}' --max-time 10 -X POST -H 'content-type: application/json' --data-binary "@$whRuim" "http://127.0.0.1:$Porta/api/whatsapp/webhook"
Write-Host ("POST /api/whatsapp/webhook (inválido) -> {0} {1}" -f $c422, $(if ($c422 -eq '422') { 'OK' } else { 'ERRO' }))
if ($c422 -ne '422') { $falhas++ }
$c503 = curl.exe -s -o NUL -w '%{http_code}' --max-time 10 "http://127.0.0.1:$Porta/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=x&hub.challenge=1234"
Write-Host ("GET /api/whatsapp/webhook (sem segredo -> 503) -> {0} {1}" -f $c503, $(if ($c503 -eq '503') { 'OK' } else { 'ERRO' }))
if ($c503 -ne '503') { $falhas++ }
Remove-Item -LiteralPath $whOk, $whRuim -ErrorAction SilentlyContinue

if ($falhas -gt 0) {
  taskkill /PID $servidor.Id /T /F | Out-Null
  Falhar "$falhas verificação(ões) de rota falharam."
}

Write-Host ''
Write-Host 'Tudo certo: lint, tipos, testes, build e rotas aprovados.' -ForegroundColor Green

if ($PararAoFinal) {
  taskkill /PID $servidor.Id /T /F | Out-Null
  Write-Host 'Servidor encerrado (-PararAoFinal).'
} else {
  Write-Host "Site no ar em: http://127.0.0.1:$Porta" -ForegroundColor Green
  Write-Host 'O servidor está na janela minimizada “vinext”; feche-a para parar.'
  if (-not $NaoAbrirNavegador) { Start-Process "http://127.0.0.1:$Porta" }
}
