# Validação — v14.10.8.65

## Resultado

**PASS** nas validações estáticas, estruturais e de regressão automatizadas disponíveis offline.

### Validadores

- `validate-campus-city-v62.mjs`: PASS
- `validate-campus-interiors-v63.mjs`: PASS
- `validate-campus-live-v64.mjs`: PASS
- `validate-campus-mobility-v65.mjs`: PASS
- `validate-unified-auth-v59.mjs`: PASS

### Integridade técnica

- 34 arquivos JS/MJS do Lobby verificados por `node --check`;
- 65 imports ESM locais verificados;
- 0 imports locais ausentes;
- release ativa do Lobby: `14.10.8.65`;
- `campus-mobility-systems.js` incluído no boot, Service Worker e página de reparo;
- sem segredo Supabase no frontend alterado;
- release base da Cidade Viva não alterava schema; a Etapa 2 de manutenção adiciona somente `063_p10920_password_change_finalize.sql`, fora do frontend.

### Escopo funcional validado estaticamente

- 5 rotas de tráfego;
- 6 veículos de tráfego;
- 4 veículos utilizáveis;
- 5 NPCs urbanos;
- 5 painéis dinâmicos;
- 5 eventos urbanos;
- 10 assinaturas de interiores;
- cabine e sequência do elevador 3D;
- estado de veículo no HUD;
- interações urbanas integradas ao controlador central.

## Limitação

Não foi executado smoke visual real em Chrome/WebGL ou Android durante este empacotamento.


## Manutenção Etapa 2 — recuperação por CGM

- testes dedicados de recuperação e troca obrigatória: PASS (7/7);
- recuperação pública centralizada em `/auth/`;
- fluxo por e-mail/Resend permanece dormente para reativação futura;
- migration 063 deve ser aplicada no Supabase antes do aceite em produção.

## Etapa 3 — Login Único / retorno de sessão

- Testes focados de autenticação, Hub, sessão e retorno: 13/13 PASS.
- Regressão da recuperação temporária por CGM: 5/5 PASS.
- `validate-campus-city-v62.mjs`: PASS
- `validate-campus-interiors-v63.mjs`: PASS
- `validate-campus-live-v64.mjs`: PASS
- `validate-campus-mobility-v65.mjs`: PASS
- `validate-unified-auth-v59.mjs`: PASS
- Suíte geral após Etapa 3: 307/368 PASS; 61 falhas remanescentes.

## Etapa 4 — Admin

- contrato Admin P0/P1/P2: PASS;
- Admin P3: PASS;
- Admin Central P6.1: PASS;
- sessão/Auth P7.4, P7.5, P7.6, P7.7 e P7.8: PASS;
- supervisão/auditoria P8.10: PASS;
- resiliência de sessão P10.6: PASS;
- cinco validadores oficiais: PASS;
- suíte geral após Etapa 4: 308/368 PASS; 60 falhas remanescentes.


## Etapa 5 — CTF DS / bridge Core

- `p67-platform-integration-wave2.test.mjs`: PASS (3/3);
- `sistemas/02-ctf-ds/ctf/tests/core-pilot.mjs`: PASS;
- `sistemas/02-ctf-ds/ctf/tests/validate.mjs`: PASS;
- `sistemas/02-ctf-ds/ctf/tests/runtime-stability.mjs`: PASS;
- `sistemas/02-ctf-ds/ctf/tests/security-wallet.mjs`: PASS;
- `validate-unified-auth-v59.mjs`: PASS, sem login por senha paralelo no CTF;
- sintaxe de `app.js`, `profile.js` e `agv-core-bridge.js`: PASS;
- cinco validadores oficiais da release: PASS;
- suíte geral após Etapa 5: 309/368 PASS; 59 falhas remanescentes.

Correção funcional relevante: os controles de troca de conta e saída do Perfil do CTF deixaram de chamar funções inexistentes e agora encerram corretamente a sessão central antes do redirecionamento para o Login Único.

## Etapa 6 — Release metadata / cache / publicação

- metadados canônicos: `release-current.json` = `14.10.8.65`;
- UI canônica de Atividades: `0.22.8.19`;
- `version.json` e `atividades/version.json` sincronizados com `v14.10.8.65`;
- `PUBLIC-DEPLOY.json` sincronizado com `v14.10.8.65` e com `core/session/` explicitamente público;
- superfícies públicas executáveis sem cache-bust antigo detectado na varredura da Etapa 6;
- contratos focados de versão/cache: 94/94 PASS;
- reparo de publicação do Lobby: 5/5 PASS;
- `validate-campus-city-v62.mjs`: PASS;
- `validate-campus-interiors-v63.mjs`: PASS;
- `validate-campus-live-v64.mjs`: PASS;
- `validate-campus-mobility-v65.mjs`: PASS;
- `validate-unified-auth-v59.mjs`: PASS;
- suíte geral após Etapa 6: 342/368 PASS; 26 falhas remanescentes.

Observação: `validate-lobby-v61.mjs` é um validador histórico fixado na release 14.10.8.61 e, por definição, não deve ser usado como gate da release 14.10.8.65. O gate atual do Lobby é coberto pelos validadores v62-v65, testes de publicação/reparo e autenticação unificada.

## Etapa 7 — Lobby/Campus P5

- contratos P5 históricos reconciliados com a arquitetura modular da v14.10.8.65;
- versão do Lobby validada contra `release-current.json`, sem aceitar uma versão histórica fixa como release ativa;
- câmera 360/cinematográfica validada em `render/camera-controller.js`;
- qualidade adaptativa e perfil Eco/mobile validados em `render/performance-manager.js`;
- avatar procedural + GLB e emotes validados em `characters/avatar-system.js` e `rigged-avatar.js`;
- portais energizados validados em `game/portal-manager.js`;
- ambiente/praça central validados em `world/campus-environment.js`;
- interiores continuam ocultando coordenadas internas na presença pública;
- fallback 2D e recuperação de boot mobile preservados;
- presença e moderação continuam server-side;
- P5 focado: 11/11 PASS;
- validadores oficiais v62, v63, v64, v65 e autenticação unificada: 150 checks PASS / 0 FAIL;
- suíte geral após Etapa 7: 353/368 PASS; 15 falhas remanescentes fora deste escopo.

## Etapa 8 — Fullscreen Global do aluno

- `p92-autograde-fullscreen-symbols-v14.9.0.test.mjs` + `p93-fullscreen-integrated-platforms-v14.9.1.test.mjs`: 14/14 PASS;
- tentativa silenciosa best-effort restaurada sem remover a exigência de gesto imposta pela API Fullscreen;
- overlay/trava permanece como fallback quando a navegação entre documentos perde fullscreen;
- rotas legadas que apenas redirecionam para `atividades/` não carregam runtime de fullscreen desnecessariamente;
- `validate-campus-city-v62.mjs`: PASS;
- `validate-campus-interiors-v63.mjs`: PASS;
- `validate-campus-live-v64.mjs`: PASS;
- `validate-campus-mobility-v65.mjs`: PASS;
- `validate-unified-auth-v59.mjs`: PASS;
- suíte geral após Etapa 8: 355/368 PASS; 13 falhas remanescentes.

## Etapa 9 — UX anti-AI-slop

- `p10912-anti-ai-slop-ux-v14.10.8.13.test.mjs`: 6/6 PASS;
- `p10939-lobby-anti-ai-prova-v14.10.8.39.test.mjs`: 6/6 PASS;
- Atividades mantém somente os 2 `linear-gradient` do grid sutil de fundo; sem `radial-gradient` na superfície principal;
- Professor sem `radial-gradient` no command center;
- Admin standalone sem `radial-gradient` e atalhos sem movimento ornamental no hover;
- `validate-campus-city-v62.mjs`: PASS;
- `validate-campus-interiors-v63.mjs`: PASS;
- `validate-campus-live-v64.mjs`: PASS;
- `validate-campus-mobility-v65.mjs`: PASS;
- `validate-unified-auth-v59.mjs`: PASS;
- suíte geral após Etapa 9: 359/368 PASS; 9 falhas remanescentes.

## Etapa 10 — Vale do Silício: entrada 3D / câmera

- sintaxe `lobby/assets/vale3d.js`: PASS;
- sintaxe `lobby/assets/lobby.js`: PASS;
- `validate-vale-entry-v65.mjs`: 9/9 PASS;
- spawn principal sincronizado entre runtime e módulo compartilhado: PASS;
- área livre mínima até prédio no spawn: 20,0 m;
- entrada/teleporte usam `VALE_SPAWN`: PASS;
- câmera inicial posicionada no lado aberto da praça: PASS;
- raycast de câmera restrito a estruturas sólidas: PASS;
- `validate-campus-city-v62.mjs`: PASS;
- `validate-campus-interiors-v63.mjs`: PASS;
- `validate-campus-live-v64.mjs`: PASS;
- `validate-campus-mobility-v65.mjs`: PASS;
- `validate-unified-auth-v59.mjs`: PASS;
- suíte geral após Etapa 10: 359/368 PASS; 9 falhas remanescentes idênticas à Etapa 9.

## Etapa 11 — Vale do Silício: física e circulação

- sintaxe `lobby/assets/vale3d.js`: PASS;
- `validate-vale-physics-v65.mjs`: 12/12 PASS;
- `validate-vale-entry-v65.mjs`: 9/9 PASS;
- OBB para prédios rotacionados: PASS;
- volume físico do jogador: PASS;
- proteção contra tunneling por subdivisão do movimento: PASS;
- degraus/altura de superfície nas entradas: PASS;
- colisão com veículos terrestres: PASS;
- teleporte e saída em ponto seguro: PASS;
- `validate-campus-city-v62.mjs`: PASS;
- `validate-campus-interiors-v63.mjs`: PASS;
- `validate-campus-live-v64.mjs`: PASS;
- `validate-campus-mobility-v65.mjs`: PASS;
- `validate-unified-auth-v59.mjs`: PASS;
- suíte geral após Etapa 11: 359/368 PASS; as 9 falhas remanescentes são idênticas às da Etapa 10 e ficam fora deste escopo.

## Etapa 12 — Masterplan estrutural do Lobby Geral

- `validate-lobby-masterplan-v65.mjs`: PASS;
- Campus ampliado para 112 × 76 m: PASS;
- centros das quatro salas sincronizados entre 2D/3D: PASS;
- 10 destinos externos dentro dos limites com margem: PASS;
- lotes dos destinos sem sobreposição: PASS;
- atrações recreativas fora do núcleo central: PASS;
- avenidas arteriais com largura mínima de 6,4 m: PASS;
- 7 travessias principais e passarelas fora da praça central: PASS;
- base urbana legada removida no 2D e 3D: PASS;
- piso 3D derivado de `WORLD_X/WORLD_Z`: PASS;
- `validate-vale-entry-v65.mjs`: 9/9 PASS;
- `validate-vale-physics-v65.mjs`: 12/12 PASS;
- `validate-campus-city-v62.mjs`: PASS;
- `validate-campus-interiors-v63.mjs`: PASS;
- `validate-campus-live-v64.mjs`: PASS;
- `validate-campus-mobility-v65.mjs`: PASS;
- `validate-unified-auth-v59.mjs`: PASS;
- suíte geral comparável após Etapa 12: 359/368 PASS; as 9 falhas remanescentes são as mesmas da Etapa 11 e ficam fora deste escopo;
- suíte ampliada: 383/393 PASS, sem regressão em relação à Etapa 11.

## Etapa 13 — Vale do Silício: reorganização urbana e visual

- sintaxe `lobby/assets/vale3d.js`: PASS;
- sintaxe `lobby/assets/vale-lite.js`: PASS;
- `validate-vale-urban-stage13-v65.mjs`: 21/21 PASS;
- Vale ampliado para 840 × 840 m: PASS;
- 27 empresas preservadas e sem lotes sobrepostos: PASS;
- ruas planejadas sem atravessar lotes: PASS;
- 38 segmentos viários + 8 faixas de pedestre: PASS;
- avenidas principais com 14 m e calçadas com 3,2 m: PASS;
- malha radial legada removida no 2D e 3D: PASS;
- distritos com quadras/gateways próprios: PASS;
- portal sul e Hall da Inovação sincronizados: PASS;
- fachadas orientadas e OBB preservado: PASS;
- placas 3D com profundidade e menor sobreposição visual: PASS;
- 2D e 3D consumindo o mesmo `urban_plan`: PASS;
- colisão/rotação 2D alinhada à organização 3D: PASS;
- `validate-vale-entry-v65.mjs`: 9/9 PASS;
- `validate-vale-physics-v65.mjs`: 12/12 PASS;
- `validate-lobby-masterplan-v65.mjs`: PASS;
- `validate-campus-city-v62.mjs`: PASS;
- `validate-campus-interiors-v63.mjs`: PASS;
- `validate-campus-live-v64.mjs`: PASS;
- `validate-campus-mobility-v65.mjs`: PASS;
- `validate-unified-auth-v59.mjs`: PASS;
- suíte geral após Etapa 13: 359/368 PASS; as mesmas 9 falhas da Etapa 12 permanecem fora deste escopo.


## Validação adicional — Etapa 14

- `core/tools/validate-campus-open-areas-stage14-v65.mjs`: **18/18 PASS**.
- Entrada/câmera do Vale: **PASS**.
- Física/circulação do Vale: **PASS**.
- Masterplan do Lobby: **PASS**.
- Urbanismo do Vale: **PASS**.
- Cidade v62: **PASS**.
- Interiores v63: **PASS**.
- Cidade Viva v64: **PASS**.
- Mobilidade v65: **PASS**.
- Autenticação unificada v59: **PASS**.
- Suíte `core/tests/*.test.mjs`: **359/368 PASS**.

As nove falhas restantes são anteriores à Etapa 14 e continuam concentradas em saídas, roster público, Central de Apoio, GitHub/Professor, responsividade mobile e rotas legadas.

## Validação adicional — Etapa 15

- `core/tools/validate-campus-interior-runtime-stage15-v65.mjs`: **18/18 PASS**.
- contrato histórico P5.7 de interiores: **PASS**.
- Entrada/câmera do Vale: **PASS**.
- Física/circulação do Vale: **PASS**.
- Masterplan do Lobby: **PASS**.
- Urbanismo do Vale: **PASS**.
- Áreas abertas do Lobby: **PASS**.
- Cidade v62: **PASS**.
- Interiores v63: **PASS**.
- Cidade Viva v64: **PASS**.
- Mobilidade v65: **PASS**.
- Autenticação unificada v59: **PASS**.
- Suíte `core/tests/*.test.mjs`: **359/368 PASS**.

Os interiores 3D agora usam montagem sob demanda e descarte na saída. As nove falhas remanescentes são anteriores à Etapa 15 e continuam fora deste escopo.

## Validação adicional — Etapa 16

- `core/tools/validate-campus-interactions-stage16-v65.mjs`: **22/22 PASS**.
- escadas externas físicas: **PASS**.
- escorregador com degraus/plataforma físicos: **PASS**.
- Mirante com deck superior + descida: **PASS**.
- passeio panorâmico completo no trilho: **PASS**.
- estações e viagem ponto a ponto do monotrilho: **PASS**.
- feedback animado de chegada nas estações: **PASS**.
- elevador/escada interna 3D e equivalência 2D: **PASS**.
- Etapas 10–15: **PASS**.
- Cidade v62: **PASS**.
- Interiores v63: **PASS**.
- Cidade Viva v64: **PASS**.
- Mobilidade v65: **PASS**.
- Autenticação unificada v59: **PASS**.
- Suíte `core/tests/*.test.mjs`: **359/368 PASS**.

As nove falhas restantes são idênticas às da Etapa 15 e não pertencem a este bloco de atrações/interações.

## Etapa 17 — Laboratório Virtual / adaptações

- Validador dedicado: 10/10 PASS.
- Regressão adaptação + loading + integração Wave 2: 21/21 PASS.
- Etapas 10–16: PASS.
- Cidade v62, Interiores v63, Cidade Viva v64, Mobilidade v65 e Login Único v59: PASS.
- Suíte geral: 359/368 PASS; 9 falhas históricas fora do escopo permanecem.
- Migration `064_p10932_lab_adaptation_reconciliation.sql` criada e não aplicada automaticamente porque o projeto Supabase referenciado pelo pacote não está conectado nesta sessão.

## Validação adicional — Etapa 18

- `core/tools/validate-stage18-responsive-performance.mjs`: **12/12 PASS**.
- auditoria mobile/tablet P10.9.9: **9/9 PASS**.
- recuperação mobile do Lobby P5.11.5.2: **PASS**.
- sintaxe dos JS alterados de Lobby/Lab: **PASS**.
- validador próprio do LABDS: **PASS**.
- Etapas 10–17: **PASS**.
- Cidade v62: **PASS**.
- Interiores v63: **PASS**.
- Cidade Viva v64: **PASS**.
- Mobilidade v65: **PASS**.
- Autenticação unificada v59: **PASS**.
- suíte `core/tests/*.test.mjs`: **368/376 PASS**.

A contagem total aumentou de 368 para 376 porque o antigo teste mobile P10.9.9 deixava de carregar antes dos seus nove subtestes quando a pasta histórica de evidências não existia. Na Etapa 18 esses subtestes passam a executar de fato. Restam oito falhas de outros blocos: saídas/supervisão histórica, roster público, Central de Apoio, GitHub/Professor e rotas legadas.


## Validação adicional — Etapa 19

- `core/tools/validate-stage19-visual-polish.mjs`: **12/12 PASS**.
- culling de rótulos do Campus por proximidade: **PASS**.
- névoa dinâmica do Campus por ciclo temporal: **PASS**.
- sky dome + atmosfera dinâmica do Vale 3D: **PASS**.
- culling de placas do Vale preservando LOD das empresas: **PASS**.
- Vale 2D com paleta temporal compartilhada: **PASS**.
- nomes de distritos e empresas por proximidade/zoom: **PASS**.
- Etapas 10–18: **PASS**.
- Cidade v62: **PASS**.
- Interiores v63: **PASS**.
- Cidade Viva v64: **PASS**.
- Mobilidade v65: **PASS**.
- Autenticação unificada v59: **PASS**.
- suíte `core/tests/*.test.mjs`: **368/376 PASS**.

As oito falhas restantes são as mesmas da Etapa 18: supervisão histórica, roster público, Central de Apoio, GitHub/Professor e rotas legadas. Nenhuma pertence ao polimento visual.

## Validação adicional — Etapa 20

- `core/tools/validate-vale-rendering-stage20-v65.mjs`: **12/12 PASS**.
- Vale 2D: zoom inicial legível, scroll, pinch e atalhos de zoom: **PASS**.
- Vale 2D: tamanho mínimo de edifícios para não reduzir a pontos: **PASS**.
- Vale 3D: clipping, névoa, LOD e leitura de silhuetas: **PASS**.
- recuperação de visibilidade do `worldRoot`: **PASS**.
- entrada/câmera, física, urbanismo e polimento do Vale: **PASS**.
- Masterplan, áreas abertas, interiores modularizados, atrações e responsividade: **PASS**.
- Cidade v62, Interiores v63, Cidade Viva v64, Mobilidade v65 e Login Único v59: **PASS**.
- suíte `core/tests/*.test.mjs`: **368/376 PASS**.

As oito falhas restantes são idênticas às da Etapa 19 e permanecem fora do Vale do Silício.

## Validação adicional — Etapa 21

- `core/tools/validate-vale-minimap-overlay-stage21-v65.mjs`: **11/11 PASS**.
- canvas fullscreen restrito a `#game3d`: **PASS**.
- ausência do seletor genérico `.game-stage canvas` no Lobby: **PASS**.
- minimapa com caixa independente e limite máximo 160 × 160 px: **PASS**.
- minimapa oculto fora de Vale + 3D: **PASS**.
- WebGL e minimapa usam canvases distintos: **PASS**.
- cache-bust do CSS sincronizado entre `index.html` e `sw.js`: **PASS**.
- Etapas 10–20: **PASS**.
- Cidade v62, Interiores v63, Cidade Viva v64, Mobilidade v65 e Login Único v59: **PASS**.
- suíte `core/tests/*.test.mjs`: **368/376 PASS**.

As oito falhas restantes são as mesmas da Etapa 20 e não pertencem ao Vale do Silício.

## Validação adicional — Etapa 22

- `p1096-github-teacher-review-panel-v14.10.8.7.test.mjs` + `p1097-github-application-simulator-v14.10.8.8.test.mjs`: **12/12 PASS**.
- painel de auditoria GitHub privado e sem escrita remota: **PASS**.
- simulador com REST restrito a `GET`: **PASS**.
- overview docente isolado em `action: 'overview'`: **PASS**.
- ausência de `update`, `insert`, `delete`, `PATCH`, `PUT` e `DELETE` no simulador: **PASS**.
- bundle público verificado a partir de `PUBLIC-DEPLOY.json` sem JSON/CSV identificável de auditoria GitHub: **PASS**.
- fixtures privadas permanecem em `core/tests/`, fora da publicação estática: **PASS**.
- Cidade v62, Interiores v63, Cidade Viva v64, Mobilidade v65 e Login Único v59: **PASS**.
- suíte `core/tests/*.test.mjs`: **371/376 PASS**.

As cinco falhas restantes não pertencem ao GitHub/Professor: supervisão histórica, roster público, Central de Apoio e duas rotas legadas.

## Validação adicional — Etapa 23

- `p101-nonblocking-supervision-font-sync-v14.10.1.test.mjs` + `p106-session-resilience-v14.10.6.test.mjs`: **11/11 PASS**.
- ramo `action==='event'` registra saídas sem `security_locked:true`: **PASS**.
- resposta de evento mantém `locked:false`: **PASS**.
- política adaptativa `ignore_focus_events` preservada para `home_study`/`relaxed`: **PASS**.
- limiar `max_focus_violations:3` continua apenas como alerta: **PASS**.
- UI continua informando que saídas não bloqueiam automaticamente: **PASS**.
- Cidade v62, Interiores v63, Cidade Viva v64, Mobilidade v65 e Login Único v59: **PASS**.
- suíte `core/tests/*.test.mjs`: **372/376 PASS**.

As quatro falhas restantes não pertencem à supervisão: roster público, Central de Apoio e duas rotas legadas.


## Etapa 24 — Roster público / privacidade
- `p10919-pedagogical-adaptations-v14.10.8.19.test.mjs` + `p10922-personalized-experiences-v14.10.8.20.test.mjs`: 20/20 PASS.
- `validate-stage24-public-roster-privacy.mjs`: 9/9 PASS.
- validadores oficiais: PASS.
- suíte completa: 373/376 PASS.
- nenhuma alteração de banco nesta etapa.


## Etapa 25 — Central de Apoio
- Validador específico: 12/12 PASS.
- Regressões staff/RLS/segurança: PASS.
- Validadores oficiais: PASS.
- Suíte completa: 374/376 PASS.
- Falhas restantes: somente P7.1 rotas canônicas/históricas.

## Etapa 26 — fechamento P7.1

Validação das rotas canônicas e aliases históricos:
- 10 plataformas canônicas presentes e com IDs únicos;
- 13 aliases históricos presentes como stubs mínimos;
- autenticação unificada preservada;
- `location.search` e `location.hash` preservados;
- alias histórico `FLIPDS/` restaurado;
- nenhum login paralelo por senha ou segredo de backend nos stubs.

Resultados:
- `core/tools/validate-legacy-routes-stage26.mjs`: **12/12 PASS**;
- `core/tests/p71-production-cleanup-v14.0.test.mjs`: **4/4 PASS**;
- regressões Hub/Auth/Sessão/Pré-publicação: **34/34 PASS**;
- validadores oficiais: **PASS**;
- suíte completa: **376/376 PASS — 0 falhas**.

## Etapa 27 — Fase 2.1 / Estrutura visual dos prédios
- `core/tools/validate-building-personality-stage27-v65.mjs`: **28/28 PASS**;
- 27 empresas ativas preservadas;
- 8 famílias arquitetônicas leves por categoria;
- collider continua derivado do footprint original;
- entrada física e degraus preservados;
- LOD preservado;
- meshes estimados de janelas: 600 → 282 (~53% menor);
- Etapa 20 (renderização do Vale): **12/12 PASS** após atualização do contrato de silhueta;
- física, urbanismo, responsividade, Cidade v62, Interiores v63, Cidade Viva v64, Mobilidade v65 e Login Único v59: **PASS**;
- suíte completa: **376/376 PASS — 0 falhas**.

## Etapa 29 / Fase 2.3
- `core/tools/validate-space-identity-stage29-v65.mjs`: 16/16 PASS.
- Regressões de personalidade, pistas/trilhos, masterplan, áreas abertas, interações, Vale urbano/física/renderização e responsividade: PASS.
- Cinco validadores oficiais: PASS.
- `node --test core/tests/*.test.mjs`: 376/376 PASS.

## Etapa 30 / Fase 2.4 — Ambientação estrutural
- `core/tools/validate-stage30-ambient-environment.mjs`: **20/20 PASS**;
- vegetação do Campus: instanciada e escalada por qualidade: **PASS**;
- vegetação do Vale: 20 pontos oficiais preservados e instanciados: **PASS**;
- nuvens/estrelas/tráfego aéreo ambiental com orçamento Eco→Ultra: **PASS**;
- iluminação arterial sem PointLights em massa: **PASS**;
- Fases 2.1–2.3: **PASS**;
- masterplan, urbanismo, física, Vale 3D, mobile, interiores e atrações: **PASS**;
- cinco validadores oficiais: **PASS**;
- `node --test core/tests/*.test.mjs`: **376/376 PASS — 0 falhas**.

## Etapa 31 / Fase 3.1 — Ciclo temporal 24h = 24min
- `core/tools/validate-stage31-world-time.mjs`: **16/16 PASS**;
- ciclo completo de 24 minutos: **PASS**;
- 60 segundos reais = 1 hora de jogo: **PASS**;
- Campus 2D/3D + Vale 2D/3D usam o mesmo `worldTimeControl`: **PASS**;
- modo antigo `auto` migra para `cycle`: **PASS**;
- Vale 3D possui sol/lua sincronizados: **PASS**;
- comando administrativo exige staff + token HMAC server-side: **PASS**;
- cache `stage31` na cadeia principal/dynamic world: **PASS**;
- Fases 2.1–2.4 e regressões de mapa: **PASS**;
- cinco validadores oficiais: **PASS**;
- `node --test core/tests/*.test.mjs`: **376/376 PASS — 0 falhas**.

Observação de deploy: o controle global de horário requer publicação da Edge Function `lobby-presence` atualizada. Nenhuma migration é necessária.

## Etapa 32 / Fase 3.2 — Sistema de clima
- `core/tools/validate-stage32-world-weather.mjs`: **20/20 PASS**;
- Limpo usa zero partículas e é o fallback seguro: **PASS**;
- Chuva, Neve e Tempestade em 2D/3D: **PASS**;
- orçamento Low < Medium < High < Ultra: **PASS**;
- `saveData` e `prefers-reduced-motion` reduzem custo: **PASS**;
- relâmpagos exclusivos de Tempestade: **PASS**;
- precipitação oculta em interiores: **PASS**;
- comando administrativo exige staff + token HMAC: **PASS**;
- Fases 2.1–3.1 e regressões de mapas: **PASS**;
- cinco validadores oficiais: **PASS**;
- `node --test core/tests/*.test.mjs`: **376/376 PASS — 0 falhas**.

Observação de deploy: o controle global de clima requer publicação da Edge Function `lobby-presence` atualizada. Nenhuma migration é necessária e nenhum deploy em produção foi realizado nesta etapa.

## Etapa 33 / Fase 4.1 — Interiores e personalidade interna
- `core/tools/validate-stage33-interior-personality.mjs`: **27/27 PASS**;
- 10 famílias visuais internas: **PASS**;
- 4 temas acadêmicos 1DS/2DS/3DS/SUB: **PASS**;
- equipamentos por `room.kind`: **PASS**;
- Centro de Provas, Lab Virtual, CTF, COSMOS, Maker e demais prédios com personalidade própria: **PASS**;
- 2D e 3D compartilham estilo/ícones: **PASS**;
- animações limitadas ao piso ativo e `prefers-reduced-motion`: **PASS**;
- lazy mount/dispose da Etapa 15: **PASS**;
- Etapas 27–32: **PASS**;
- cinco validadores oficiais: **PASS**;
- `node --test core/tests/*.test.mjs`: **376/376 PASS — 0 falhas**.

Nenhuma migration, Edge Function ou alteração de banco foi realizada na Etapa 33.

## Etapa 34 / Fase 4.2 — Comportamento contextual do avatar
- `core/tools/validate-stage34-contextual-avatar.mjs`: **37/37 PASS**;
- estado contextual em `sessionStorage` + BroadcastChannel opcional: **PASS**;
- Prova deriva `exam-running`/`exam-paused`/finalização do status real do servidor: **PASS**;
- Lab deriva `lab-active` do evento real de ferramenta aberta e retorna para espera ao fechar: **PASS**;
- avatar procedural e rigged possuem poses de prova/pausa/programação: **PASS**;
- 2D e 3D usam o mesmo contexto, bloqueio e indicador: **PASS**;
- saída manual protegida durante contexto travado e logout limpa estado: **PASS**;
- interiores continuam lazy/dispose: **PASS**;
- contratos históricos de cache da Etapa 33 e do avatar rigged atualizados para aceitar fases posteriores sem remover fallback procedural: **PASS**;
- Etapas 15–33 e regressões de mapas/Lab/clima/tempo: **PASS**;
- cinco validadores oficiais: **PASS**;
- `node --test core/tests/*.test.mjs`: **376/376 PASS — 0 falhas**.

Nenhuma migration, Edge Function ou alteração de banco foi realizada na Etapa 34.
