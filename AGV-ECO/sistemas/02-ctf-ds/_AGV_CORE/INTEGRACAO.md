# Integração AGV Core — CTF DS

- **Platform ID:** `ctf-ds`
- **Versão canônica detectada:** `3.2.0`
- **Raiz canônica:** `ctf`
- **Onda:** `P1`
- **Auth legado:** EduAuth
- **Economia legado:** local wallet/ledger
- **Progresso legado:** local mission progress + XP

## Arquivos candidatos a hook

- `js/core/wallet.js`
- `js/core/mission-progress.js`
- `js/core/storage.js`
- `js/core/state.js`
- `js/eduauth/index.js`
- `js/app.js`

## Instrução

Não substitua esses arquivos cegamente. Primeiro confirme onde o estado é criado, persistido e consumido. Insira um adaptador único para o Core no ponto mais central possível e mantenha compatibilidade temporária com a API antiga da plataforma.
