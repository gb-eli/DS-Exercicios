# AGV World F69 — Central de Segurança e Câmeras

**Versão:** 14.10.8.71  
**Build:** 14.10.8.71-stage40-security  
**Base:** F68 / 14.10.8.70

## Entregue

- Novo prédio **Central de Segurança AGV** no eixo norte, em `x=-29, z=31`, simétrico ao Cinema e sem sobreposição com os lotes existentes.
- Arquitetura 3D própria com torre operacional, antena, fachada técnica e sinalização dedicada.
- Interior lazy-loaded em dois pavimentos:
  - térreo: recepção, despacho operacional e **Sala de Controle CCTV**;
  - 1º pavimento: monitoramento visual de energia, supervisão de redes e sala de incidentes.
- Console CCTV interativo no térreo, acionado com `E`.
- **8 câmeras públicas externas** distribuídas pelo Campus:
  1. Praça Central;
  2. Eixo Norte;
  3. Mobilidade Sul;
  4. Distrito Oeste;
  5. Distrito Leste;
  6. Distrito Cultural / Cinema;
  7. Portal do Vale;
  8. Monotrilho Central.
- Visualização individual com seleção de câmera.
- Mosaico **2 × 2** com quatro feeds estratégicos simultâneos.
- Zoom óptico virtual de **1× a 4×** por alteração de FOV.
- A matriz usa **uma única cena e um único renderer WebGL**, com viewport/scissor para o mosaico, evitando quatro renderizadores concorrentes.
- Painel lateral responsivo que mantém o Campus visível durante o monitoramento.
- Clima, ciclo dia/noite, NPCs, tráfego automático e presença multiplayer continuam atualizados durante o CCTV.
- Tecla `Esc` encerra o monitoramento; sair do prédio, trocar para 2D ou fazer logout também fecha a matriz com segurança.

## Privacidade e escopo

A F69 é uma funcionalidade visual do **mundo virtual público**. Ela:

- não grava vídeo;
- não implementa reconhecimento facial;
- não mostra interiores;
- não mostra provas ou atividades;
- não consulta nem apresenta dados acadêmicos;
- não cria histórico de CCTV.

## Backend

Esta fase **não exige migration nem alteração de Edge Function**.

Continuam valendo, apenas caso ainda não tenham sido implantados:

- migration `065_lobby_cinema_media.sql` para programação persistente do Cinema;
- migration `066_lobby_vehicle_multiplayer.sql` + Edge Function `lobby-presence` para caronas multiplayer.

## Compatibilidade preservada

- F68: trânsito inteligente, semáforos, limites e colisões;
- F67: passageiros multiplayer;
- F66: direção manual;
- F64: Cinema AGV;
- F63A: fundação do mundo;
- interiores lazy-loaded;
- monotrilho e estações;
- parkour e atrações;
- clima e ciclo dia/noite;
- modo 2D como alternativa de desempenho.

## Validação concluída

- teste dedicado F69: **7/7**;
- regressão selecionada F63A/F64/F66/F67/F68/F69 + Campus: **38/38**;
- trilhos/monotrilho: **20/20**;
- mobilidade/cidade viva: **PASS**;
- masterplan: **PASS**, incluindo Central sem sobreposição com os demais lotes;
- ciclo de horário: **16/16**;
- clima: **20/20**;
- sintaxe: **41 módulos JS first-party + Service Worker** sem erro;
- HTML: **198 IDs / 198 únicos** após o painel/legenda CCTV;
- smoke HTTP local dos arquivos principais: **6/6 com HTTP 200**.

Não foi executado E2E visual automatizado em navegador nesta fase.

## Próxima fase sugerida

Veículos aéreos e voo (drone/helicóptero), seguidos por mirantes/binóculos e expansão para novos mapas carregados sob demanda.
