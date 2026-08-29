# Validação v14.10.8.39

- 48/48 testes relevantes aprovados.
- `node --check` aprovado nos módulos críticos de Lobby, Modo Prova, Admin e Atividades.
- Sem `core/core`, `core/lobby`, `core/prova`, `core/atividades`, `core/admin`, `core/professor` ou `core/sistemas`.
- Sem marcadores de conflito Git nos diretórios ativos auditados.
- Sem marcas fictícias do simulador (NEON WOLVES, BYTEFORGE, CODE TITANS, NULL RAIDERS, PIXEL PHANTOMS, STACK GUARD).
- Sem linguagem de infraestrutura fictícia visível (SA-EAST, ping acadêmico, MATCH FOUND, RECONNECTING SQUAD, GLOBAL COMMS, PLAYER EXPERIENCE LAB).
- Sem seed nominal privado no pacote público auditado.

## Lobby 3D
`rigged-avatar.js` é opcional. Uma falha de parse/import do avatar não impede o carregamento do Lobby: o runtime registra o erro e utiliza avatar procedural.

## Modo Prova
A prévia docente usa dados da sessão real quando disponíveis. Sem sessão real, não fabrica estudantes, empresas, votos ou classificação. Ranking só aparece após progresso/pontuação real.

Nenhuma migration, reset de senha ou alteração de equipe é executada por esta release.
