# AGV World F77 — Sistema Solar e Viagens Espaciais

**Versão:** `14.10.8.79`  
**Build:** `14.10.8.79-stage48-solar-system`  
**Data:** 31/08/2026  
**Status:** Release Candidate

## Objetivo

Unificar a experiência espacial já criada na Estação Orbital, Lua e Marte por meio de uma Central Interplanetária visual, sem adicionar um novo mundo, banco ou renderer. A F77 melhora orientação e transição entre destinos preservando o streaming sob demanda das superfícies lunar e marciana.

## Entregas principais

- **Central Interplanetária AGV** incorporada à Estação Orbital;
- holograma 3D do Sistema Solar usando o renderer orbital já existente;
- versão 2D equivalente para o modo leve;
- Sol, Mercúrio, Vênus, Terra, Lua, Marte, Júpiter, Saturno, Urano e Netuno no catálogo visual;
- órbitas visualmente comprimidas e cinturão de asteroides;
- Lua e Marte destacados como destinos disponíveis;
- painel unificado de seleção de destino;
- distância de referência, resumo e fatos do destino antes do embarque;
- animação de transição com desacoplamento, cruzeiro, aproximação e preparação de chegada;
- barra de progresso e opção **Pular animação**;
- `Esc` encurta apenas a animação, sem cancelar ou corromper a troca de mundo;
- movimento na Estação bloqueado durante a viagem e liberado de forma segura depois;
- portais de Lua e Marte passam a abrir o mesmo planejador interplanetário;
- retorno de Lua/Marte continua restaurando a posição anterior na Estação.

## Escala didática

A interface deixa explícito que o mapa orbital usa **escala visual comprimida** e que a animação não representa duração real de viagem. Como referência, a Lua é apresentada a aproximadamente 384.400 km da Terra e Marte com distância variável de aproximadamente 54,6 a 401 milhões de km conforme as órbitas.

Os planetas, órbitas, Sol e asteroides continuam sendo representações procedurais/estilizadas voltadas à navegação e ensino, e não uma simulação astronômica em escala física.

## Streaming e desempenho

A F77 não coloca os mundos pesados no boot inicial. `moon-lite.js`, `moon3d.js`, `mars-lite.js` e `mars3d.js` continuam fora do shell crítico do Service Worker e só são importados quando o aluno efetivamente viaja para o respectivo destino.

A Central Interplanetária utiliza o mesmo runtime e o mesmo renderer da Estação Orbital. Não há segundo WebGL renderer para o holograma.

## Backend / banco

**Nenhuma migration nova é necessária na F77.**  
**Nenhuma nova publicação de Edge Function é necessária especificamente para a F77.**

A fase reutiliza as áreas existentes `space-agv`, `moon-agv` e `mars-agv`.

Se o ambiente de produção ainda não recebeu a F76, o conjunto backend atual continua sendo:

- `core/database/071_lobby_mars_world.sql`;
- `core/edge-functions/lobby-presence/index.ts`.

## Validação

- F77: **9/9 PASS**
- regressão F63A → F77: **100/100 PASS**
- trilhos/monotrilho: **20/20 PASS**
- interiores lazy: **18/18 PASS**
- horário global: **16/16 PASS**
- clima global: **20/20 PASS**
- mobilidade: **PASS**
- masterplan: **PASS**
- personalidade dos interiores: **PASS**
- fundação: **6/6 PASS**
- sintaxe: **59 módulos JS + Service Worker PASS**
- Edge Function atual: **TypeScript `tsc` PASS** com stubs ambientes locais de Deno/JSR
- HTML: **234/234 IDs únicos**
- smoke HTTP: **8/8 — 200 OK**
- E2E visual automatizado em navegador: **não executado**

## Limitações conhecidas

- somente Lua e Marte são destinos selecionáveis nesta fase;
- distâncias e tamanhos no holograma não são proporcionais à escala astronômica real;
- duração visual da viagem é comprimida para poucos segundos;
- corpos celestes continuam procedurais/estilizados;
- futuras fases podem ampliar missões observacionais, asteroides e outros planetas sem alterar o modelo atual de streaming.
