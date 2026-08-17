# Integração AGV Core — Laboratório Virtual DS

- **Platform ID:** `lab-virtual`
- **Versão canônica detectada:** `4.28.0`
- **Raiz canônica:** `LABDS`
- **Onda:** `P1`
- **Auth legado:** EduAuth/local storage
- **Economia legado:** local/partial wallet references
- **Progresso legado:** rich local progress + XP

## Arquivos candidatos a hook

- `lab/js/eduauth/eduauth.js`
- `lab/js/storage.js`
- `lab/js/session.js`
- `lab/js/learning-mode.js`
- `lab/js/app.js`

## Instrução

Não substitua esses arquivos cegamente. Primeiro confirme onde o estado é criado, persistido e consumido. Insira um adaptador único para o Core no ponto mais central possível e mantenha compatibilidade temporária com a API antiga da plataforma.
