# AGV World F68 — Trânsito Inteligente

**Versão:** 14.10.8.70  
**Build:** 14.10.8.70-stage39-traffic  
**Base:** F67 / 14.10.8.69

## Entregue

- 8 semáforos 3D funcionais no Campus, com fases NS/EW sincronizadas.
- Tráfego automático com progresso independente, parada no vermelho e prevenção de colisão.
- Limites locais de 20, 25, 30 e 40 km/h aplicados à direção manual.
- HUD com velocidade, marcha, limite da via e estado do semáforo.
- Frenagem preventiva em vermelho/amarelo.
- Colisão com tráfego automático, veículos multiplayer e obstáculos fixos.
- Registro do último ponto seguro e reposicionamento após colisão relevante.
- Faixas de pedestres e malha viária existentes preservadas, sem duplicar ruas.

## Backend

Esta fase **não exige migration nem alteração nova na Edge Function**.

Para usar passageiros multiplayer, continuam valendo os pré-requisitos da F67:
1. aplicar `core/database/066_lobby_vehicle_multiplayer.sql`;
2. publicar a Edge Function `lobby-presence` da F67/F68.

O Cinema continua dependendo da migration 065 caso ainda não esteja implantada.

## Compatibilidade preservada

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

- teste dedicado F68: **7/7**;
- regressão selecionada F63A/F64/F66/F67/F68 + Campus: **31/31**;
- trilhos/monotrilho/mobilidade: **20/20** no validador de pistas e PASS no validador de mobilidade;
- fundação F63A: **6/6**;
- ciclo de horário: **16/16**;
- clima: **20/20**;
- sintaxe: **40 módulos JS do Lobby + Service Worker** sem erro;
- HTML: **190 IDs / 190 únicos**;
- smoke HTTP local: **5/5 endpoints principais com 200 OK**.

Não foi executado E2E visual automatizado em navegador nesta fase.

## Próxima fase sugerida

Central de segurança/câmeras do Campus, com monitores múltiplos, seleção de câmera e zoom; depois veículos aéreos e pontos de observação.
