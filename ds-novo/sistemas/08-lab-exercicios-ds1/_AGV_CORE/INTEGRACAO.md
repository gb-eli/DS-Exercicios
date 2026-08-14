# Integração AGV Core — Plataforma 1DS — Central de Disciplinas

- **Platform ID:** `lab-ds1`
- **Versão canônica detectada:** `1.12.0`
- **Raiz canônica:** `modo-aluno`
- **Onda:** `P3`
- **Auth legado:** local auth contract
- **Economia legado:** none
- **Progresso legado:** local per discipline

## Arquivos candidatos a hook

- `core/auth-contract.js`
- `core/storage.js`
- `core/central.js`
- `assets/js/auth.js`
- `assets/js/app.js`

## Instrução

Não substitua esses arquivos cegamente. Primeiro confirme onde o estado é criado, persistido e consumido. Insira um adaptador único para o Core no ponto mais central possível e mantenha compatibilidade temporária com a API antiga da plataforma.
