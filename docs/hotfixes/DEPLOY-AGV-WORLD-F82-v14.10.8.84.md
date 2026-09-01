# Deploy — AGV World F82 v14.10.8.84

## Ordem recomendada

```bash
# no repositório/projeto Supabase correto
supabase db push
supabase functions deploy lobby-presence
```

A migration nova deste hotfix é:

`core/database/074_lobby_presence_worlds_hotfix.sql`

Não dependa de "reaplicar" a migration 073: instalações onde ela já consta no histórico precisam da 074.

Depois publique o front/site v14.10.8.84 e faça um reload completo para ativar o novo Service Worker/cache.

## Checklist pós-deploy
- Rural: Lite → 3D e retorno.
- Base de Operações: Lite → 3D e retorno.
- Estação Orbital: Lite → 3D e retorno.
- Lua: Lite → 3D e retorno.
- Marte: Lite → 3D e retorno.
- Teletransporte: abrir janela, filtrar destinos, viajar.
- Staff: Trazer um aluno e Trazer todos.
- Campus: observar carros nas vias e pedestres nos corredores.
- Trem: confirmar espera de ~5 s na estação antes de partir.

## Atenção
O pacote não contém credenciais/secrets adicionais. A função deve ser publicada no mesmo projeto Supabase utilizado pelo AGV World.
