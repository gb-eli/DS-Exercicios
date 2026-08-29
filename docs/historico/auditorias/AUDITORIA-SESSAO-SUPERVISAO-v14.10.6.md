# Auditoria P10.6 — Sessão, supervisão, fullscreen e presença ao vivo

**Release:** v14.10.7  
**UI Atividades:** 0.22.7  
**Data:** 2026-08-19  
**Base:** v14.10.5

## Escopo

Auditoria do ciclo de sessão do aluno e do professor: autenticação, revogação de sessão, logout em outra aba, heartbeat, abertura/encerramento do workspace, fullscreen, troca de aba, sessões duplicadas, reconexão e acompanhamento ao vivo.

## Problemas confirmados antes da correção

1. A função `supervision` ativa em produção ainda era a **v3**, anterior ao guard de `session_id` revogada e anterior ao comportamento definitivamente não bloqueante.
2. O bloqueio por saídas só estava neutralizado por um workaround de banco que forçava `max_focus_violations = 1000000`.
3. Existiam **370 sessões de atividade abertas**, das quais **369 estavam sem heartbeat havia mais de 10 minutos** no primeiro snapshot desta fase.
4. Existiam **75 grupos aluno/exercício com mais de uma sessão aberta simultaneamente**.
5. Uma sessão revogada podia continuar com o workspace visualmente aberto até outra parte da aplicação perceber o logout.

## Correções implementadas

### Backend `supervision v4`

- `requireLiveAuthSession` valida o `session_id` antes de sessão, heartbeat, evento e operações de supervisão.
- `session_revoked` e `session_claim_missing` são rejeitados imediatamente.
- Nova sessão encerra as sessões abertas anteriores do mesmo aluno antes de criar a atual.
- Sessão encerrada não aceita novos heartbeats/eventos (`sessionOwned` exige `ended_at is null`).
- `live_overview` encerra e remove da presença sessões sem heartbeat por mais de 2 minutos.
- `max_focus_violations = 3` é apenas **limiar de alerta** (`focus_alert`); não existe alteração automática para `blocked`/`security_locked` por contagem de saídas.

### Frontend

- Erros `session_revoked` e `session_claim_missing` disparam `agv:session-invalid`.
- Atividades desmonta o workspace, encerra heartbeat, remove exigência de fullscreen e retorna ao login.
- `SIGNED_OUT`, inclusive propagado entre abas, usa a mesma rotina de desmontagem.
- Rascunho local continua preservado pelo mecanismo de persistência antes de o workspace ser descartado.
- Limite visual/pedagógico volta a mostrar **“Alerta após 3 saídas • não bloqueia”**.

### Banco de dados

Migrações desta fase:

- `041_p106_session_resilience.sql`: encerra sessões abandonadas e prepara limiar de alerta.
- `042_p106_retire_focus_limit_workaround.sql`: aposenta o trigger temporário da v14.10.1 que forçava 1.000.000, restaura default 3 e restrição normal `1..20`.

## Resultado em produção

- `supervision v4` — **ACTIVE**, `verify_jwt=true`.
- SHA ativo: `052499557c4005d977fb98473dd9021b634c78d15c4d506aa72b871bdcc3b516`.
- 92/92 políticas de foco com valor **3**; default **3**.
- Trigger temporário `trg_enforce_nonblocking_focus_policy`: **0** em produção.
- Sessões abertas no snapshot pós-correção: **1 realmente ativa**.
- Sessões abertas stale >2 min: **0**.
- Grupos duplicados aluno/exercício: **0**.
- Bloqueios ainda ativos cujo motivo é limite de saídas: **0**.

## Fullscreen

O portal continua com bridge de fullscreen e overlay de retorno. A API do navegador pode sair do fullscreen em navegação/reload entre documentos e exige gesto do usuário para reentrar; o sistema não tenta contornar essa limitação do navegador silenciosamente.

## Regressão

- Node tests: **194/194 aprovados**.
- JavaScript `node --check`: **712 arquivos / 0 erros**.
- JSON parse: **440 arquivos / 0 erros**.
- `supervision/index.ts`: TypeScript parse/noCheck **status 0**.
- Deno não está instalado no ambiente local; portanto não foi alegado typecheck completo do runtime Deno.

## Publicação

Backend da fase já está aplicado e verificado em produção. O frontend **v14.10.7 ainda precisa ser publicado no host estático** e depois receber smoke autenticado de logout/revogação, troca de aba, reconexão e retorno ao fullscreen.
