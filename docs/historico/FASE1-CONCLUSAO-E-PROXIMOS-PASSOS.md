# Fase 1 concluída — próximos passos

A Fase 1 foi executada sem escrita no Supabase.

## Confirmado

- há alunos que atravessaram mudanças de referência durante a atividade;
- o banco atual guarda somente a referência vigente;
- o histórico de código dos alunos está preservado;
- o ZIP já contém múltiplas variantes oficiais;
- produção usa `exercise-autograde v7` e deve ser preservada;
- candidato local v8-history passou na regressão completa.

## Próxima etapa segura

A primeira ação que pode alterar o banco é a criação do histórico de referências. Ela permanece bloqueada até existir backup restaurável confirmado.

Depois do backup:

1. repetir fingerprints;
2. aplicar migration 044;
3. validar RLS e advisors;
4. consultar quantidade de variantes importadas sem alterar aluno;
5. só então implantar autograder v8-history;
6. executar auditoria histórica read-only dos alunos.

## Fase 1B — GitHub legado read-only

Concluída a descoberta da origem real dos links históricos:

- 136 reivindicações em `legacy_exercise_claims`;
- 18 alunos;
- 26 URLs brutas;
- 22 repositórios normalizados;
- todos os claims continuam pendentes;
- nenhum claim foi aprovado/rejeitado nesta execução.

A próxima passagem deve congelar o commit SHA de cada repositório e produzir o relatório completo por exercício, ainda sem baixa automática.
