# Integração AGV Core — COSMOS / Planetário DS

- **Platform ID:** `planetario-ds`
- **Versão canônica detectada:** `34.0.0`
- **Raiz canônica:** `universods`
- **Onda:** `P2`
- **Auth legado:** local profile
- **Economia legado:** none central
- **Progresso legado:** rich local XP/progress/evidence

## Arquivos candidatos a hook

- `src/core/persistence/JsonStorage.js`
- `src/core/knowledge/KnowledgeProfileStore.js`
- `src/core/evidence/EvidenceBuilder.js`
- `src/main.js`

## Instrução

Não substitua esses arquivos cegamente. Primeiro confirme onde o estado é criado, persistido e consumido. Insira um adaptador único para o Core no ponto mais central possível e mantenha compatibilidade temporária com a API antiga da plataforma.
