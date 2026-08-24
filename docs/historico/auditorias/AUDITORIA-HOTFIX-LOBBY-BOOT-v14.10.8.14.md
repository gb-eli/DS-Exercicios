# Auditoria e Hotfix do Lobby — v14.10.8.14

## Diagnóstico

### CRÍTICO — boot com versão antiga

Na v14.10.8.13, `lobby/index.html` carregava o loader com `?v=14.10.8.13`, mas `vendor-loader.js` ainda declarava `VERSION='14.10.0'`. O resultado era uma cadeia inconsistente:

`index .13 → vendor-loader interno .0 → boot .0 → lobby .13`

Isso podia fazer navegador/CDN reutilizar `boot.js` antigo mesmo após a publicação de correções recentes.

### ALTO — grafo ESM parcialmente sem cache-bust

`lobby.js` versionava apenas `supabase.js`, enquanto `config.js`, `lobby3d.js`, `lobby-lite.js` e `rigged-avatar.js` eram carregados sem query de versão. Uma atualização parcial podia combinar módulos de releases diferentes.

### ALTO — dependência do SDK Supabase em CDN

O loader dependia de jsDelivr/unpkg. Em rede escolar, DNS instável ou filtragem, a entrada poderia demorar ou falhar antes de chegar ao runtime do Lobby.

A v14.10.8.14 cria uma preferência por caminho local e conserva os dois CDNs como contingência. O slot local incluído no pacote é deliberadamente apenas um marcador; o bundle UMD oficial ainda precisa ser incorporado numa etapa específica para operação offline real.

### ALTO — autenticação sem timeout

`getSession()`, `getUser()` e `signInWithPassword()` podiam aguardar indefinidamente se o SDK/browser entrasse em estado travado. Agora sessão e autenticação têm limites explícitos, com mensagem de conectividade em vez de classificar todo travamento como senha incorreta.

## Implementação

- `lobby/assets/vendor-loader.js`
  - `VERSION='14.10.8.14'`;
  - ordem local → jsDelivr → unpkg;
  - timeout por fonte;
  - timeout de carregamento do módulo de boot;
  - erro recuperável.
- `lobby/assets/boot.js`
  - importa `lobby.js?v=14.10.8.14`.
- `lobby/assets/lobby.js`
  - cache-bust em Supabase/config/3D/lite;
  - timeout de login, signup, getUser e restauração de sessão;
  - mensagem específica para timeout.
- `lobby/assets/supabase.js`
  - config versionado.
- `lobby/assets/lobby3d.js`
  - rig e Three.js local versionados.
- `lobby/index.html`
  - CSS, portal e loader em `.14`.
- `index.html`
  - links do Hub para `lobby/?v=14.10.8.14`.

## Itens investigados e não alterados

`class_memberships.is_primary` aparece nas migrations e em várias superfícies do sistema, portanto não foi removido do Lobby. Não há evidência no pacote de que essa coluna seja a causa do defeito.

## Validação

- 275/275 testes cumulativos;
- 6/6 testes específicos do hotfix;
- teste executável do loader prova fallback controlado quando todas as fontes falham;
- teste executável do loader prova que SDK local válido inicia `boot.js?v=14.10.8.14` sem consultar CDN;
- arquivos JS críticos do Lobby passam em `node --check`;
- nenhum executável do Lobby ainda contém cache `14.10.8.13` ou `VERSION='14.10.0'`.

## Limitação de verificação

O Chromium deste ambiente bloqueou navegação para o servidor local com `ERR_BLOCKED_BY_ADMINISTRATOR`. Portanto não foi registrado um E2E visual autenticado real nesta execução. A publicação candidata deve ser seguida por smoke test físico em Android/Chrome e iOS/Safari.

## Segurança e dados

Nenhuma migration, Edge Function, nota, claim, progresso, `student_files` ou histórico foi alterado.
