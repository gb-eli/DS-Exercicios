# Auditoria — Painel Professor/Admin — v14.10.5

Data: 19/08/2026
Fase: P10.5 — consistência do acompanhamento professor/admin
Base: v14.10.4

## Escopo

Auditoria do contrato entre `staff-dashboard`, Console Professor, Admin Central e painel administrativo integrado às Atividades. Foram verificados: atividade recente, entregas parciais, melhor nota, tentativas, bloqueios de segurança, fila de acompanhamento e revisão manual.

## Problemas encontrados

### 1. Atividade recente podia ser escolhida incorretamente
O Console Professor ordenava os registros de `student_exercises` por `updated_at`. Essa coluna não existe nessa tabela. Em produção havia 50 estudantes com mais de um registro de progresso, portanto a seleção podia apontar um exercício antigo como atividade atual.

**Correção:** a ordenação agora usa timestamps reais, nesta prioridade: `last_activity_at`, `submitted_at`, `auto_score_at`, `completed_at`, `started_at`, `last_seen_at`, `heartbeat_at`, `created_at`.

### 2. Contrato do staff-dashboard incompleto
As interfaces administrativas já esperavam informações de tentativas e bloqueio, mas o endpoint de overview não retornava todos esses campos.

**Correção:** `staff-dashboard v11` inclui `attempts`, `started_at`, `security_locked`, `security_lock_reason` e `security_locked_at`, preservando os campos de nota e progresso.

### 3. Solicitar ajustes não reabria corretamente a atividade
Uma revisão manual com `changes_requested` podia deixar um exercício ainda com estado de conclusão antigo.

**Correção:** solicitar ajustes passa a definir `status=in_progress`, limita o progresso a no máximo 99%, remove `completed_at` e registra `completion_source=manual_review_changes_requested`. Aprovação manual passa a concluir explicitamente com `progress_percent=100`, `completed_at` e origem auditável `manual_review_approved`.

### 4. Entregas parciais pouco visíveis
Entregas com `submitted_score` e atividade ainda não concluída não apareciam de modo consistente nas filas e resumos administrativos.

**Correção:** Console Professor, Admin Central e painel integrado agora identificam explicitamente `Entrega parcial`, mostram melhor nota e tentativas e não contam esse estado como conclusão.

### 5. Contagem de pendências incorreta
O Admin verificava `status === changes_requested`, mas `changes_requested` pertence a `approval_status`.

**Correção:** a fila de acompanhamento usa `approval_status`, inclui revisão pendente, ajustes solicitados, entregas parciais e bloqueios reais.

## Snapshot de produção durante a auditoria

- 250 registros de progresso em `student_exercises` no momento da verificação.
- 50 estudantes possuíam mais de um registro de progresso na primeira medição da fase.
- 3 entregas parciais na verificação final.
- 0 alunos bloqueados na verificação final.
- 103 registros com revisão pendente no snapshot final.
- maior número de tentativas observado durante a fase: 2.

Esses números são um retrato do momento da auditoria e podem mudar com o uso do sistema.

## Backend de produção

`staff-dashboard v11` publicado e ACTIVE com `verify_jwt=true`.
SHA da função publicada: `56f19b67989098f42d41f04cc2ff267f6aefbfc29ca5e4d69ae898d29b16a3b4`.

Outros componentes preservados:
- `exercise-autograde v4 ACTIVE`;
- `student-files v7 ACTIVE`;
- `supervision v3 ACTIVE`, com política de saídas não bloqueante.

Nenhum arquivo de aluno foi alterado nesta fase.

## Validação

- Testes do projeto: **188/188 aprovados**.
- JavaScript: **712 arquivos verificados, 0 erros de sintaxe**.
- JSON: **440 arquivos válidos, 0 erros**.
- TypeScript do `staff-dashboard`: **0 diagnósticos de erro**.

## Estado de publicação

Backend desta fase: **publicado em produção**.

Frontend v14.10.5: **RELEASE_CANDIDATE**. Ainda precisa substituir os arquivos no host atual e receber smoke test autenticado do Console Professor/Admin.
