# AGV World F89 — Campus Performance

**Versão:** 14.10.8.91  
**Base:** F88 — 14.10.8.90  
**Fase:** limpeza física do Campus, transporte modular, render budget e instancing.

## Objetivo

Reduzir custo permanente do Campus sem retirar os mundos modulares criados nas F86–F88 e sem comprometer a experiência de airdrop, Realtime, teletransporte ou mobilidade.

## Alterações principais

### 1. Limpeza física do hub

O Campus principal não mantém mais os contratos/objetos legados de parkour, piscina, playground, escorregador e Laboratório Virtual. Esses conteúdos permanecem nos submapas adequados, especialmente `campus-neon` e `campus-labs`.

- removidos exports e superfícies legadas de parkour do contrato do Campus;
- `CAMPUS_RIDES` do hub passa a conter apenas Mirante/subida e descida;
- o código de desafio de parkour não é mais instanciado em `lobby3d.js`/`lobby-lite.js`;
- APIs históricas de challenge permanecem como no-op para compatibilidade temporária.

### 2. Monotrilho efêmero

As estações continuam permanentes e leves. A geometria completa de trilho, guia, suportes e trem só é criada quando uma viagem começa.

- `ensureActive()` cria a infraestrutura de viagem;
- `releaseActive()` remove e faz dispose ao concluir/cancelar;
- suportes usam `THREE.InstancedMesh`;
- materiais temporários são clones próprios da viagem, evitando descartar materiais das estações permanentes;
- parada de embarque/desembarque continua em 5 segundos por estação.

### 3. Estação como hub modular

A janela da Estação Central também oferece acesso direto a:

- Biblioteca Central AGV;
- Distrito de Laboratórios AGV;
- Parque Neon & Lazer AGV;
- Vilas 1DS, 2DS, 3DS e SUB;
- Vale do Silício pelo fluxo ferroviário existente.

Ao entrar em um setor modular, o `WorldManager` troca o runtime em vez de manter Campus 3D + destino ativos simultaneamente.

### 4. Render budget por qualidade

Novo módulo `campus-render-budget.js` controla visibilidade de prédios e experiências distantes durante exploração no solo.

| Qualidade | Raio experiências | Raio prédios | Intervalo |
|---|---:|---:|---:|
| Econômico | 34 | 46 | 520 ms |
| Equilibrado | 44 | 60 | 420 ms |
| Alto | 54 | 78 | 340 ms |
| Ultra | 64 | 96 | 300 ms |

Em mobile restrito/economia de dados, os raios são reduzidos. Mirantes e câmeras de segurança podem solicitar visão completa.

### 5. Campus 3D realmente fora do boot inicial

`campus-environment.js` foi removido de:

- `boot.js` / preflight inicial;
- `CRITICAL_SHELL` do Service Worker.

Ele continua disponível normalmente quando `lobby3d.js` é solicitado.

## Métricas estruturais F88 → F89

- shell crítico local: **1.170.145 B → 1.106.556 B**;
- redução do shell crítico: **63.589 B (5,43%)**;
- preflight: **34 → 33 arquivos**;
- arquivos críticos do SW: **68 → 67**;
- runtimes `*3d.js` no shell crítico: **0**;
- `lobby3d.js`: **160.303 B → 153.330 B**;
- `lobby-lite.js`: **66.480 B → 61.877 B**;
- `campus-environment.js`: **57.331 B → 52.294 B**;
- `campus-experiences.js`: **10.177 B → 7.887 B**;
- redução combinada desses quatro módulos: **18.903 B (6,42%)**.

Estas são métricas de tamanho/carga, não estimativas de FPS. O ganho real de FPS depende de hardware, resolução, quantidade de usuários e setor ativo.

## Topologia preservada

- 18 mundos persistentes;
- 18 adapters;
- 17 conexões estruturais;
- 15 setores terrestres de airdrop;
- quatro Vilas DS modulares;
- Biblioteca/Labs/Neon modulares.

## Validação

### Gate F89

**11/11 PASS**

Valida versão, topologia, limpeza física, monotrilho efêmero, instancing, descarte seguro, render budget, boot/cache, estação modular, dwell de 5 s, Realtime/qualidade e airdrop.

### Sintaxe/imports

- **140 arquivos JS/SW**: 0 erros de sintaxe;
- **130 módulos** no grafo do Lobby;
- **397 imports locais**;
- **0 imports ausentes**;
- **15 módulos/hosts 3D principais** importados como ESM: 15 PASS / 0 FAIL;
- Service Worker: **67 itens críticos / 0 ausentes / 0 runtimes 3D**.

### Regressão histórica

Os testes antigos não são editados para fabricar aprovação. Na árvore F89:

- F88: 9/11 — duas falhas por versão/cache literal 14.10.8.90;
- F87: 5/10 — versão, topologia antiga (antes da F88) e URLs históricas;
- F86: 6/9 — versão e quantidade antiga de mundos;
- F85: 8/11 — versão, quantidade antiga de distritos e URL histórica de lazy import;
- F84: 7/10 — versão e contratos de airdrop anteriores à F87;
- F82: 6/8 — asserts históricos de versão/cache;
- O2 Observabilidade: **7/7 PASS**.

## Backend

A F89 **não cria migration nova** e não altera o contrato de backend da F88.

Se a instalação já está em F88 com migration `079` e Edge Function consolidada, esta é uma atualização de frontend/cache.

## Limitação de validação visual

O smoke visual foi tentado novamente nesta própria F89 com Chromium headless local. O processo expirou sem produzir screenshot e registrou falhas de `DBus`/`zygote`, a mesma limitação da sandbox observada nas fases anteriores. O smoke visual é portanto **inconclusivo**, não aprovado; nenhuma afirmação de ganho de FPS é baseada nesse navegador de sandbox.
