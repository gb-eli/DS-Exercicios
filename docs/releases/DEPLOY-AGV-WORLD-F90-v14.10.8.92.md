# Deploy — AGV World F90 v14.10.8.92

## Escopo

A F90 é uma atualização de **frontend/renderização/cache**. Não existe migration nova nesta fase.

## Pré-requisito de backend

Se o ambiente já está corretamente em F88/F89, mantenha:

- migrations anteriores aplicadas até `079`;
- Edge Function `lobby-presence` consolidada das fases anteriores.

Se o ambiente é anterior, aplique antes as migrations/Edge Functions requeridas pelas releases intermediárias. Não reaplique migrations antigas já registradas pelo Supabase.

## Sequência recomendada

1. Fazer backup/registro da release atualmente publicada.
2. Publicar os arquivos públicos da F90 respeitando `PUBLIC-DEPLOY.json`.
3. Não expor como conteúdo estático navegável `core/database/`, `core/functions/`, `core/tests/`, `core/tools/`, `deploy/` ou `docs/`.
4. Confirmar que `lobby/sw.js` publicado é o build `14.10.8.92-stage61-f90-graphics`.
5. Confirmar que `lobby/assets/config.js` informa `14.10.8.92`.
6. Recarregar o Lobby e permitir a troca do Service Worker antigo pelo F90.
7. Em celulares, testar a janela **⚙ Qualidade** nos perfis Automático/Econômico/Médio/Alto/Ultra.
8. No Campus 3D, alternar Médio → Alto → Ultra e confirmar mudança de DPR/detalhes sem sair do mapa.
9. Testar uma Vila DS e um módulo do Campus para confirmar troca visual ao vivo.
10. Testar multiplayer Realtime, airdrop e retorno entre mundos para garantir preservação da fundação F85–F89.

## Verificações de cache

A release F90 deve apresentar:

- versão: `14.10.8.92`;
- build/cache: `14.10.8.92-stage61-f90-graphics`;
- nenhum runtime `*3d.js` no shell crítico;
- `visual-quality-profile.js` no shell opcional;
- cache-bust F90 nos runtimes/hosts que utilizam Avatar V2/performance.

## Rollback

Se for necessário voltar:

1. republicar o frontend completo da F89;
2. restaurar o Service Worker F89;
3. não fazer rollback de banco apenas por causa da F90, pois esta release não altera schema/backend.

## Observação sobre qualidade manual

O modo Automático continua hardware-aware. Quando o usuário seleciona manualmente Alto/Ultra, a escolha inicial passa a ser respeitada; o controlador adaptativo ainda pode reduzir qualidade posteriormente se detectar queda real de performance.
