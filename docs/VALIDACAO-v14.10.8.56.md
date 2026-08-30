# Validação — v14.10.8.56

## Resultado do release gate

- Base comparada: `v14.10.8.55`.
- Delta final: **24 arquivos modificados + 7 novos = 31 arquivos**, **0 removidos**.
- Simulação do PATCH sobre uma cópia limpa da `.55`: **árvore final idêntica byte a byte** à `.56`.
- Exclusões detectadas: **0**.
- JavaScript do Lobby: **27/27** arquivos aprovados em `node --check`.
- Imports relativos do Lobby: **42**, com **0 ausentes**.
- Service Worker: **32/32 recursos críticos HTTP 200** e **6/6 opcionais HTTP 200** no servidor local.
- Edge Function `lobby-presence`: TypeScript parse sem erro; imports locais `session-guard.ts` e `security.ts` presentes.
- Segredos privilegiados no frontend do Lobby: **0** (`service_role`, `SUPABASE_SERVICE_ROLE_KEY`, `sb_secret_`).
- Migration/SQL alterado pela release: **0**.

## Smoke de módulos

- Monotrilho: **8 estações**.
- Destino Vale presente: **PASS**.
- Viagem simulada Praça/Campus → Vale: **PASS**, evento de chegada emitido.
- Rota do monotrilho: 16 pontos.
- Superfícies verticais navegáveis: **92**.
- Altura de telhado: **11 m**.
- Escorregador: percurso guiado concluído e altura máxima ~**3,95 m**.
- Dia/noite: modos `day` e `night` resolvidos corretamente.
- Avatar V2: 4 presets (`casual`, `sport`, `institutional`, `tech`) presentes.
- Teletransporte: botão, modal e binding do evento presentes; prioridade responsiva aplicada para evitar desaparecer do HUD.
- `Trazer todos até mim`: ações `issue_gather`/`verify_gather` preservadas.
- Chat por proximidade: `issue_chat`/`verify_chat` presentes, HMAC temporário, limite de 180 caracteres e validação de distância no servidor.
- Balões de chat: Campus 2D, Campus 3D, Vale 2D e Vale 3D presentes.

## Correções encontradas durante o gate

- Corrigida leitura inicial do modo dia/noite: `state.graphics.worldTimeMode` agora é usada no runtime 2D e 3D.
- Corrigido efeito de travessia do portal para usar `.game-stage` real em vez de um ID inexistente.
- Smoke pages atualizadas para importar `v14.10.8.56`.
- HUD recebeu regra responsiva para manter `⚡ Teletransporte` visível e priorizado.

## Smoke visual

O Chromium headless disponível neste ambiente não concluiu captura confiável do canvas/WebGL (limitação do ambiente gráfico/EGL). Por isso, **não é registrado falso PASS visual**.

Smoke pós-publicação obrigatório em navegador real:
1. Campus 2D desktop e celular.
2. Campus 3D desktop.
3. Primeira pessoa / terceira pessoa / ampla / Campus.
4. Telhados, escadas, rampa e Torre de Controle.
5. Monotrilho nas 8 estações, incluindo desembarque no Vale.
6. Escorregador completo.
7. Dia, noite e automático.
8. FOV 45–95 e cap 30/45/60 FPS.
9. Teletransporte e `Trazer todos até mim`.
10. Chat por proximidade com dois usuários reais.
11. Avatar e acessórios.
12. Vale 2D e 3D.
13. Service Worker após atualização forçada.

## Backend

Não há migration. Para habilitar o chat por proximidade e manter a reunião coletiva autenticada, publicar a Edge Function `lobby-presence` conforme `DEPLOY-BACKEND-v14.10.8.56.md`.
