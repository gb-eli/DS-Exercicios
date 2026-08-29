# v14.10.8.60 — Lobby Boot Asset Fix

Base cumulativa: v14.10.8.59

## Correção crítica
- garante `lobby/assets/world/dynamic-world.js` no pacote completo;
- boot do Lobby passa a identificar release `14.10.8.60`;
- Service Worker/cache do Lobby passam para `14.10.8.60`;
- `repair-lobby.html` limpa caches antigos e testa diretamente `dynamic-world.js`;
- nenhuma alteração de schema/Supabase;
- nenhuma remoção de arquivo;
- autenticação única da v14.10.8.59 preservada.

## Validação obrigatória pós-publicação
Abra:
`https://gb-eli.github.io/DS-Exercicios/lobby/assets/world/dynamic-world.js`

Deve retornar JavaScript, nunca 404.

Depois:
`https://gb-eli.github.io/DS-Exercicios/repair-lobby.html`
