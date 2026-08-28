# Auditoria P10.4 — Autocorreção, entrega, reentrega e tentativas

Data: 2026-08-19  
Release: **v14.10.4**  
UI Atividades: **0.22.4**

## Escopo

Fase dedicada ao fluxo entre edição, autocorreção automática, entrega oficial, nota parcial, conclusão 100%, tentativas, reentrega e exibição no painel do aluno/professor.

## Problemas encontrados

1. O `exercise-autograde v3` marcava qualquer submit como `completed`, inclusive notas parciais.
2. A mesma entrega parcial recebia `progress_percent=100`, contrariando a mensagem da interface de que o aluno poderia continuar corrigindo.
3. Uma reentrega com nota menor podia substituir `submitted_score` por uma nota pior.
4. O dashboard do aluno não distinguia de forma consistente autocorreção, entrega parcial e conclusão.
5. O painel do professor podia interpretar estados históricos inconsistentes como concluídos.
6. O contador de tentativas só aparecia atualizado após recarregar/reabrir a atividade.

## Correções

- `exercise-autograde` atualizado para **v4**.
- Entrega parcial normal passa a permanecer com `status=in_progress`.
- Somente melhor nota oficial de **100%** conclui o fluxo normal.
- Casos legados já aceitos continuam respeitados.
- `submitted_score` passa a representar a **melhor nota oficial entregue** e não diminui em reentrega pior.
- A tentativa atual fica registrada em `metadata.last_autograde_submission`.
- A melhor tentativa fica em `metadata.best_autograde_submission`.
- `attempts` incrementa somente em `submit`; autocorreção durante a digitação não consome tentativa.
- Resposta do servidor passa a informar `score`, `official_score`, `attempts`, `completed` e `submitted_at`.
- Aluno passa a ver claramente `Entrega parcial`, `Concluído`, `Melhor nota entregue` e tentativas.
- Professor recebe indicação `Entrega parcial` sem contabilizar como conclusão.

## Reparo histórico

Migração aplicada: `core/database/040_p104_normalize_autograde_submission_state.sql`.

A migração:

- converte entregas parciais não legadas do formato antigo para `autograde_submission_partial` + `in_progress`;
- corrige entregas oficiais de 100% que ainda estivessem fora de `completed`;
- preserva `legacy_version_accepted=true`.

Auditoria pós-produção:

- estados parciais não legados incorretos: **0**;
- estados 100% incorretos: **0**.

## Backend de produção

- `exercise-autograde`: **v4 ACTIVE**, JWT obrigatório.
- `student-files`: v7 ACTIVE.
- `staff-dashboard`: v10 ACTIVE.
- `supervision`: v3 ACTIVE com política de saída não bloqueante.

## Regressão

- testes Node: **183/183 aprovados**;
- JavaScript: **712 arquivos, 0 erros de sintaxe**;
- JSON: **440 arquivos, 0 inválidos**;
- TypeScript do autograde: **0 diagnósticos de transpilação**.

## Publicação

Backend desta fase já está aplicado em produção. O frontend v14.10.4 continua como `RELEASE_CANDIDATE` até o ZIP público ser colocado no host e passar por smoke autenticado.
