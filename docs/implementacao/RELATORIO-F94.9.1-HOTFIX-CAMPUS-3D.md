# F94.9.1 — Hotfix Campus 3D

## Problema observado
O Campus DS em modo 3D não concluía a criação do runtime e nunca chegava ao primeiro frame.

## Causa raiz
`lobby/assets/lobby3d.js` expunha no objeto de runtime cinco identificadores que não estavam declarados no módulo:

- `startAirdropSession`
- `jumpFromAirdrop`
- `deployAirdropParachute`
- `cancelAirdropSession`
- `getAirdropState`

Como propriedades abreviadas de um objeto JavaScript precisam resolver o identificador no momento em que o objeto é criado, a função `createLobby3D()` terminava com `ReferenceError` antes de devolver o runtime ao `WorldManager`.

A falha existia desde a base F94 e não foi criada pela Camera V2 ou pela Interaction V2.

## Correção
Foi restaurada a camada de compatibilidade do Airdrop dentro do runtime do Campus, incluindo estado `ground / plane / freefall / parachute`, snapshot, início, salto, abertura do paraquedas, cancelamento e restauração da câmera.

A operação aérea moderna continua preferindo o `AIRDROP_TRANSIT_ADAPTER`; as funções restauradas impedem que a API legada/compatível do Campus derrube o runtime e permitem restauração segura de uma sessão aérea já existente.

## Cache
O Campus 3D passa a ser importado como:

`lobby3d.js?v=14.10.8.96-f9491-campus3d-hotfix`

O shell passa para:

`stage72-f9491-campus3d-hotfix`

## Validação
- F94.9 + F94.9.1: 14/14 testes PASS.
- Campus runtime construction smoke com Three real + WebGLRenderer simulado: PASS.
- API de Airdrop: `ground → plane → freefall → parachute → ground`: PASS.
- Loop sintético de primeiro frame do Campus: PASS.
- 155 JavaScripts do Lobby: 0 erros de sintaxe.
- 424 imports locais: 0 ausentes.
- 79 referências locais do Service Worker: 0 ausentes.

### Limitação
O ambiente de execução desta auditoria não oferece um contexto WebGL real confiável para Chromium headless. Portanto o teste de construção usa as classes reais do Three.js e um renderer simulado. A validação final ainda deve ser feita no navegador/dispositivo real.

## Backend
Nenhuma alteração em Supabase, migrations ou Edge Functions.
