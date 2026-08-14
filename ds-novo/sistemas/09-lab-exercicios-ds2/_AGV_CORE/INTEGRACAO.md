# Integração AGV Core — Plataforma 2DS — Duas Disciplinas

- **Platform ID:** `lab-ds2`
- **Versão canônica detectada:** `0.7.1`
- **Raiz canônica:** `modo-aluno`
- **Onda:** `P3`
- **Auth legado:** local auth
- **Economia legado:** none
- **Progresso legado:** local per discipline

## Arquivos candidatos a hook

- `assets/js/auth.js`
- `assets/js/aluno.js`
- `frontend/assets/js/auth.js`
- `frontend/assets/js/aluno.js`
- `inovacao/assets/js/auth-shared.js`
- `inovacao/assets/js/inovacao.js`

## Instrução

Não substitua esses arquivos cegamente. Primeiro confirme onde o estado é criado, persistido e consumido. Insira um adaptador único para o Core no ponto mais central possível e mantenha compatibilidade temporária com a API antiga da plataforma.
