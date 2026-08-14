# Integração AGV Core — Fliperama DS

- **Platform ID:** `fliperama-ds`
- **Versão canônica detectada:** `0.39.0-hotfix1`
- **Raiz canônica:** `flipds`
- **Onda:** `P2`
- **Auth legado:** local profile/no central auth
- **Economia legado:** no central wallet
- **Progresso legado:** local XP/progress per game

## Arquivos candidatos a hook

- `app.js`
- `index.html`
- `games/voxelcraft-ds/js/storage.js`

## Instrução

Não substitua esses arquivos cegamente. Primeiro confirme onde o estado é criado, persistido e consumido. Insira um adaptador único para o Core no ponto mais central possível e mantenha compatibilidade temporária com a API antiga da plataforma.
