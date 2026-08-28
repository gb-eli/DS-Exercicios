# P3 — Central de Atividades — v10

## Objetivo

Transformar a área **Atividades** do ADM em um controle operacional de liberação, com o professor também podendo controlar as próprias turmas.

## Implementado no ADM

- filtro por turma;
- lista apenas das atividades vinculadas à turma via `class_subjects`;
- status: padrão aberto, bloqueada por padrão, liberada, bloqueada, programada ou encerrada;
- abertura e encerramento programados;
- liberação/bloqueio em massa por turma;
- configuração por turma;
- exceção por aluno com conta ativada;
- configuração para grupo de alunos com conta ativada;
- remoção da exceção individual para voltar a herdar da turma;
- HTML base, CSS base, JavaScript base, dicas extras e ajuda guiada;
- visualização do número de exceções individuais.

## Console Professor

O Console Professor ganhou o painel **Liberações**. Professores comuns só recebem suas turmas via `staff-dashboard`/`teacher_classes`; admin e super_admin têm escopo global.

O professor pode, para a turma autorizada:

- liberar ou bloquear;
- programar abertura;
- programar encerramento;
- liberar os cinco recursos de apoio.

## Segurança

Não foi aberta uma API administrativa sem escopo.

A gravação usa o JWT real do professor/admin e as policies RLS já existentes em `exercise_releases`.

Foram adicionados:

- unicidade turma+atividade;
- unicidade aluno+atividade;
- CHECK garantindo exatamente um alvo (turma **ou** aluno);
- CHECK garantindo encerramento posterior à abertura;
- policy DELETE para staff escopado;
- policy SELECT de `class_subjects` para staff escopado;
- policy SELECT de `exercises` para staff escopado;
- trigger privado `private.audit_exercise_release_change()`.

Toda criação, alteração ou exclusão de liberação gera registro em `admin_audit_log`.

## Edge Function dedicada

Uma função `activity-control` foi preparada, mas o conector bloqueou o deploy por não conseguir determinar a segurança da combinação de operações. Ela permanece somente como `.draft` em `core/edge-functions/pending-activity-control/` e **não é parte do backend ativo**.

## Situação atual do roster

No momento desta implementação há 133 pré-cadastros, 125 ativos e nenhuma conta de aluno ativada. Por isso:

- liberação por turma funciona imediatamente;
- programação por turma funciona imediatamente;
- exceção por aluno/grupo fica disponível à medida que as contas são ativadas.

## Portal do aluno

Foi gerado `Exercícios Práticos DS v0.14.1 — P3` para corrigir a herança turma→aluno dos recursos de apoio.

O starter HTML/CSS/JS é genérico e seguro e só entra na **primeira criação** do arquivo. Arquivo já existente nunca é sobrescrito.

## Precedência

1. bloqueio de segurança;
2. override individual do aluno;
3. configuração da turma;
4. `default_locked` do exercício.

Essa ordem é a mesma já usada por `activity-progress v1` para a disponibilidade da atividade.
