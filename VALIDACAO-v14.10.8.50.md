# Validação — v14.10.8.50 HOTFIX

## Regressão alvo
- `presentation` declarado no escopo de `createLobby3D` antes do primeiro `requestAnimationFrame`.
- `activeStation` declarado no mesmo escopo.
- o frame continua podendo consultar `if (seated || presentation)` sem `ReferenceError`.

## Cache
- `LOBBY_VERSION`: 14.10.8.50.
- Service Worker: cache `agv-lobby-runtime-14.10.8.50`.
- imports e scripts do Lobby usam `?v=14.10.8.50`.

## Escopo
Hotfix somente de runtime/cache. Sem alteração de backend, schema, rotas ou autenticação.

## Resultado executado
- JavaScript verificado com `node --check`: 21/21 PASS.
- Regressão textual: `presentation=null,activeStation=null` presente antes do frame: PASS.
- `if(seated||presentation)` preservado: PASS.
- `lobby3d.js` sem referência a `v=14.10.8.49`: PASS.
- Service Worker aponta para `14.10.8.50` e `lobby3d.js?v=14.10.8.50`: PASS.
