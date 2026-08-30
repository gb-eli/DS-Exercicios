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
