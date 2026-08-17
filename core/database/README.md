# SQL de referência

Estes arquivos são um **baseline técnico**, não substituem uma migration gerada/validada contra o projeto Supabase real. No chat de implementação: conferir changelog/docs atuais, adaptar ao schema existente, aplicar em ambiente de teste, rodar advisors e testes de concorrência antes de produção.

Ordem lógica: `001_core_schema.sql` → `002_rls.sql` → `003_transfer_rpc.sql` → `004_seed_platforms.sql` → `005_store_marketplace_rpc.sql`.

## Adaptações live 13/08/2026
- `010_existing_project_compat.sql`: adaptação ao projeto central existente.
- `011_seed_ctf_ds_3_2_0.sql`: catálogo CTF completo (86 atividades).
- `012_ctf_atomic_xp_store_services.sql`: débito de XP de hints e compra CTF atômica/service-only.
- `013_ctf_daily_timezone.sql`: protocolo diário por America/Sao_Paulo.

O inventário canônico final não foi implantado nesta rodada; propriedade CTF paga é derivada do `wallet_ledger` até a migration de instâncias ser permitida.

## LAB Virtual — P1 piloto v6
- `016_lab_virtual_tools_50_applied.sql`: representação idempotente das 50 ferramentas live, sem recompensa econômica por abertura.
- `017_lab_virtual_pilot_reward_rules_applied.sql`: 10 regras de conclusão do piloto, `rule_validated` e `client_claimable=false`.
- `pending-lab-virtual/`: drafts bloqueados/experimentais; **não aplicar automaticamente**.

O endpoint live `lab-virtual-core` conhece 50 ferramentas e 88 conclusões. Nesta etapa apenas 10 conclusões possuem recompensa oficial; as demais registram progresso sem fallback local.

## LAB Virtual — economia de atividades v7
- `018_lab_virtual_full_economy_deployment.sql`: estado desejado/reproduzível para as 88 conclusões, 3 regras de bônus de primeira ferramenta e 6 marcos de exploração.
- Fonte numérica: `core/catalog/lab-virtual-4.28.0.json`; nenhum XP/crédito foi inventado na integração.
- Live verificado em 13/08/2026: 50 ferramentas catalogadas, 88 conclusões catalogadas e 88 `reward_rules` de conclusão.
- Totais das 88 conclusões: 5.195 XP e 1.979 Créditos Tech.
- Bônus de primeira ferramenta usam 3 eventos por nível (`15/30/50`) com idempotência gerada pelo endpoint por `user + tool`.
- Marcos de exploração usam 6 eventos não repetíveis (`100/150/250/300/400/750`).

`018` é um **deployment script idempotente consolidado**, gerado depois da iteração live via MCP. Ele não pretende falsificar uma entrada de migration history que não foi criada pelo CLI. Os drafts em `pending-lab-virtual/` permanecem apenas como histórico e não devem ser aplicados automaticamente.


## Modo Professor — v7
- `019_activity_teacher_content.sql`: tabela privada de resposta/gabarito explicado. RLS ativo; `anon`/`authenticated` sem grants diretos.
- `020_lab_virtual_teacher_reference.sql`: gera 88 referências docentes do LAB Virtual a partir do catálogo central.
- Gabaritos DS1/DS2/DS3/Sub são preparados por `core/tools/build-teacher-content.py` a partir de pacotes Professor privados e **não devem ser versionados no deploy público**.

## LABs DS1/DS2/DS3/Sub — v8
- `021_lab_exercises_catalog_01.sql` ... `06.sql`: catálogo canônico das 88 atividades dos quatro portais, sem recompensa econômica inventada.
- `022_lab_exercises_review_and_analysis_guard.sql`: índice de revisão docente + trigger que exige validação server-side antes de concluir Análise e Método.
- `activity_progress.metadata.review_status`: `not_submitted`, `pending`, `approved` ou `changes_requested` conforme o fluxo.


## P7.6 — revogação Auth preparada (v14.5)
- `030_p76_auth_session_revocation.sql`: RPCs service-only para contagem/revogação de `auth.sessions`.
- **Não aplicado live nesta rodada**: exige inspeção do schema, advisors e teste com usuário de teste antes de produção.

- `031_p77_live_session_guard.sql` — P7.7: valida `session_id` do JWT contra `auth.sessions` em endpoints críticos. Service-role only.
