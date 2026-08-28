# Validação — P5.0 Lobby 3D/360 — v11.4

Data: 14/08/2026.

## Resultado automatizado

Suítes executadas no pacote final:

1. `admin-p0-p1-p2-v9.test.mjs` — PASS
2. `admin-p3-activity-center-v10.test.mjs` — PASS
3. `agv-core-sdk.test.mjs` — PASS
4. `lab-exercises-v8.test.mjs` — PASS
5. `p4-lobby-staff-v11.1.test.mjs` — PASS
6. `p4-lobby-v11.test.mjs` — PASS
7. `p5-lobby-3d-v11.4.test.mjs` — PASS
8. `security-hardening-p43.test.mjs` — PASS
9. `teacher-mode.test.mjs` — PASS

Resultado: **9/9 suítes aprovadas**.

## Runtime 3D

- Three.js local importado com sucesso como revision **180**.
- `WebGLRenderer`, `Scene` e `PerspectiveCamera` disponíveis no módulo distribuído.
- `lobby.js` e `lobby3d.js` passaram na verificação sintática Node.
- não há chave `service_role` no Lobby;
- não há `upsert/insert/update/delete` direto de `lobby_presence` no frontend;
- o renderer 3D não consulta tabelas de release/progresso.

## Segurança live preservada

No Supabase de produção, `authenticated` permanece com **SELECT apenas** em `public.lobby_presence`: INSERT/UPDATE/DELETE/TRUNCATE diretos estão negados. Escritas de presença permanecem na Edge Function `lobby-presence`.

A camada P4.3 continua responsável por:

- coleta de IP server-side;
- rate limiting por usuário + IP;
- telemetria de ações suspeitas;
- localização conhecida fora do Paraná classificada como **CRÍTICA**;
- localização inconclusiva registrada sem bloqueio automático;
- proteção de economia/recompensas e escopo de turma.

## Observação de QA visual

A validação automatizada cobre arquitetura, controles, contratos e segurança. O render WebGL final deve receber um smoke test no URL publicado do GitHub Pages em desktop e celular, pois o ambiente de automação usado para o pacote não fornece uma sessão WebGL de navegador equivalente ao dispositivo final.
