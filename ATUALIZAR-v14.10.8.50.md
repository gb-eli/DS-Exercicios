# DS-Exercicios — Lobby 3D v14.10.8.50 HOTFIX

Base: v14.10.8.49.

## Causa confirmada
O diagnóstico de produção registrou `ReferenceError: presentation is not defined` dentro de `frame()` em `lobby/assets/lobby3d.js`. O erro ocorria a cada `requestAnimationFrame`, impedia a confirmação do primeiro frame e acionava `lobby_3d_first_frame_timeout`, levando o usuário ao Lobby Lite.

O mesmo bloco de estado também utilizava `activeStation` sem declaração explícita, o que poderia falhar posteriormente ao interagir com terminais internos.

## Correção
- declara `presentation=null` no estado do runtime 3D;
- declara `activeStation=null` no mesmo escopo;
- atualiza a release para `14.10.8.50` em entrypoints, imports e Service Worker para invalidar o JS defeituoso armazenado em cache;
- mantém a lógica do Portal V2, Avatar V2, Camera V2, performance adaptativa, presença e fallback 2D.

## Banco / Pages
Nenhuma alteração em Supabase, schema, domínio, repositório ou rotas do GitHub Pages.
