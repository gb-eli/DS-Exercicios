# AGV World F70 — Mobilidade Aérea

**Versão:** 14.10.8.72  
**Build:** 14.10.8.72-stage41-aerial  
**Base:** F69 / 14.10.8.71

## Entregue

- Novo módulo `world/aerial-mobility.js`, isolado dos dados acadêmicos e do multiplayer terrestre.
- **3 helipontos** no Campus:
  1. Heliponto Mobilidade (`H-MOB`) — eixo sul;
  2. Heliponto Operacional Oeste (`H-OPS`);
  3. Heliponto Ciência Leste (`H-CIE`).
- **Drone AGV Explorer** utilizável.
- **Helicóptero AGV** utilizável.
- Modelos 3D próprios com rotores animados, luzes, trem/skids e identidade visual diferente dos veículos terrestres.
- Pilotagem manual:
  - `W` / ↑: acelerar para frente;
  - `S` / ↓: reduzir / deslocar para trás;
  - `A` / `D`: guinar/virar;
  - `Espaço`: subir;
  - `Shift`: descer;
  - `C`: alternar câmera;
  - `E`: sair somente depois do pouso.
- No celular:
  - joystick controla velocidade e direção;
  - botão de ação vira **SUBIR**;
  - botão de corrida vira **DESCER**.
- Perfis **Passeio / Normal / Ágil** alteram a velocidade máxima conforme a aeronave.
- Teto de voo específico por aeronave.
- Colisão em baixa altitude contra os volumes dos edifícios.
- Acima da altura de segurança, a aeronave pode sobrevoar construções sem tratar o prédio como uma parede infinita.
- Limites do Campus continuam obrigatórios também no ar.
- Não é possível abandonar a aeronave no ar: o runtime exige altitude baixa e presença em um heliponto.
- HUD de voo mostra:
  - velocidade;
  - estado/marcha de voo;
  - altitude atual;
  - teto da aeronave;
  - subindo / descendo / em voo / pousado;
  - nome do heliponto quando pousado.
- Minimapa mostra os três helipontos, os veículos aéreos estacionados e a altitude do piloto.
- Novo modo de câmera **Aérea**, disponível pelo ciclo de câmera e pelas configurações 3D.
- As aeronaves estacionadas somem enquanto estão sendo pilotadas e reaparecem depois do encerramento do voo.

## Decisão de arquitetura — multiplayer aéreo

A F70 **não envia aeronaves ao multiplayer terrestre da F67**.

O contrato atual de `lobby_vehicle_sessions` trabalha com posição terrestre (`x`, `z`, heading e velocidade) e não possui altitude. Reutilizá-lo para voo criaria estados incompletos e clientes divergentes.

Por isso, nesta fase:

- voo é local;
- carros/vans/ônibus continuam multiplayer normalmente;
- nenhum payload aéreo falso é enviado ao Edge Function;
- uma futura fase de multiplayer aéreo deverá adicionar altitude e regras de autoridade de sessão explicitamente no backend.

## Backend

Esta fase **não exige migration nem novo deploy de Edge Function**.

Continuam necessários apenas se ainda não estiverem implantados:

- migration `065_lobby_cinema_media.sql` para programação persistente do Cinema;
- migration `066_lobby_vehicle_multiplayer.sql` + Edge Function `lobby-presence` para o multiplayer terrestre da F67.

## Compatibilidade preservada

- F69: Central de Segurança e CCTV;
- F68: trânsito inteligente, semáforos e colisões terrestres;
- F67: passageiros multiplayer terrestres;
- F66: direção manual terrestre;
- F64: Cinema AGV;
- F63A: fundação do mundo;
- monotrilho, estações e montanha-russa;
- clima e ciclo dia/noite;
- parkour e atrações;
- interiores lazy-loaded;
- modo 2D como alternativa de desempenho.

## Validação concluída

- teste dedicado F70: **7/7**;
- regressão selecionada F63A/F64/F66/F67/F68/F69/F70: **41/41**;
- trilhos/monotrilho: **20/20**;
- mobilidade/cidade viva: **PASS**;
- masterplan: **PASS**;
- ciclo de horário: **16/16**;
- clima: **20/20**;
- sintaxe: **42 módulos JavaScript first-party + Service Worker** sem erro;
- HTML: **202 IDs / 202 únicos**;
- smoke HTTP local: **6/6 com HTTP 200**.

Não foi executado E2E visual automatizado em navegador nesta fase.

## Próximas fases do roadmap

1. Mirantes e binóculos com zoom e pontos panorâmicos.
2. Multiplayer aéreo deliberado, com altitude sincronizada e passageiros do helicóptero.
3. Novos mapas carregados sob demanda: rural/fazenda, militar e outros biomas.
4. Estação espacial, Lua e Marte.
