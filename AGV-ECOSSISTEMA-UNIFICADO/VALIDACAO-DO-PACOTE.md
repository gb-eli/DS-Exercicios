# Validação do pacote — v11.2 / P4.2

Data: 14/08/2026.

## Escopo validado

Esta entrega amplia o P4 para presença de professor/admin no Lobby, interações controladas e moderação server-side, além de corrigir os achados de segurança levantados na auditoria do v11.

## Implementado

- professor, admin e super_admin entram no Lobby como participantes identificados;
- circulação pelas quatro áreas;
- interações alvo limitadas a `wave`, `like` e `spark`;
- expulsão temporária do Lobby via Edge Function `lobby-moderation`;
- professor modera somente alunos das turmas atribuídas; admin/super_admin têm escopo global;
- expulsão não desativa conta, matrícula ou progresso;
- `lobby_blocks` + RLS impedem reentrada automática durante o bloqueio;
- heartbeat reduzido para 5 s e polling para 4 s;
- senha compartilhada de equipe removida do runtime;
- conta nova de equipe é provisionada server-side com senha temporária individual exibida uma única vez;
- autocadastro de staff da allowlist é rejeitado sem `app_metadata.provisioned_by_admin`;
- `activity-progress`, `student-files` e `supervision` corrigem escopo de `exercise.class_id`;
- `supervision.start_session` revalida release;
- `legacy_submit` exige atividade liberada e não libera a próxima imediatamente;
- aprovação do professor libera o próximo exercício individual;
- RPC legado `claim_core_reward(...)` revogado para `public`, `anon` e `authenticated`;
- orientação do workspace não interpola texto do banco em `innerHTML`;
- CSP adicionada ao portal de atividades com origens necessárias pinadas;
- snapshot do pacote agora inclui as Edge Functions ativas antes ausentes (`staff-dashboard`, `admin-roster`, `bootstrap-admins`) e as novas funções P4.1.

## Verificação no Supabase de produção

Projeto: `iresvqwyaqotghjssncg`.

- `participant_role`: presente;
- `interaction_target_id`: presente;
- `lobby_blocks`: presente;
- `authenticated` pode executar `claim_core_reward(...)` legado: **não**;
- `service_role` mantém execução do RPC legado: **sim**;
- exercícios ativos: **88**;
- exercícios ativos `default_locked=false`: **0**;
- Edge Functions atualizadas: `activity-progress` v2, `student-files` v3, `supervision` v2, `staff-directory` v4 e `lobby-moderation` v2;
- `handle_auth_user_created` contém `STAFF_SELF_SIGNUP_DISABLED`;
- único staff já ativado no momento da validação não está pendente de troca de senha.

## Testes automatizados

Foram executadas 7 suítes Node e todas passaram, inclusive a suíte de equipe/moderação P4.2 (`p4-lobby-staff-v11.1.test.mjs`, mantida com esse nome por compatibilidade).

A suíte P4.2 cobre: remoção da senha compartilhada, entrada da equipe no Lobby, interação alvo, expulsão server-side, escopo de professor, preservação da conta do aluno, frequência de presença, revalidação de release, fluxo legado, revogação do RPC econômico e mitigação do sink de XSS.

## Advisor

O alerta anterior `authenticated_security_definer_function_executable` para `claim_core_reward(...)` não aparece mais. Permanece a advertência do Auth de **Leaked Password Protection desativada**, que deve ser habilitada nas configurações de autenticação do projeto. Há também avisos informativos de tabelas server-side com RLS e sem policy pública, já existentes no baseline.

## Limite da moderação

“Expulsar do Lobby” é propositalmente uma sanção de presença social temporária, não uma suspensão da conta escolar. O bloqueio padrão da interface é configurável entre 5 e 120 minutos e o backend limita de 1 a 120 minutos.


## P4.2 — Moderação completa
- confirmação antes de expulsar aluno;
- lista server-side de expulsões ativas por escopo;
- readmissão antecipada registrada em auditoria;
- Lobby v0.2.1.
