# AGV World v14.10.8.69 — F67 Passageiros Multiplayer

## Entrega
A direção manual da F66 agora pode transportar outros participantes online no mesmo veículo.

### Fluxo do motorista
- aproxima-se de um veículo utilizável;
- escolhe **Motorista**;
- o servidor valida proximidade e se o veículo está livre;
- a viagem é criada como sessão multiplayer;
- posição, direção e velocidade são sincronizadas em Realtime.

### Fluxo do passageiro
- aproxima-se de um veículo dirigido por outro participante;
- pressiona **E** / Embarcar;
- o servidor valida proximidade e vaga;
- recebe um assento exclusivo;
- acompanha o motorista em tempo real;
- pode descer com **E**.

### Capacidade
- AGV E-Car: 1 motorista + 1 carona;
- AGV E-Bike: somente motorista;
- Maker Van: 1 motorista + 3 caronas;
- Shuttle Acadêmico: 1 motorista + 7 caronas.

## Segurança e arquitetura
- cliente autenticado tem **somente SELECT** nas tabelas de veículos;
- escrita acontece pelo Edge Function `lobby-presence` com service role;
- motorista só inicia o veículo se estiver próximo;
- passageiro só embarca se estiver próximo;
- veículo ocupado, lotado e sessão expirada são bloqueados no servidor;
- saltos anormais de posição são rejeitados e registrados como evento de segurança;
- sessões sem atualização por 12 segundos são consideradas expiradas.

## Banco / deploy obrigatório
1. Aplicar `core/database/066_lobby_vehicle_multiplayer.sql`.
2. Publicar a Edge Function atualizada `core/edge-functions/lobby-presence/`.
3. Publicar o frontend da release v14.10.8.69.

## Mantido
Cinema AGV, direção manual, modo Carona automático individual, minimapa, interiores lazy-loaded, monotrilho, parkour, clima e ciclos de horário.

## Próxima fase sugerida
Trânsito inteligente: colisão entre veículos, semáforos, faixa de pedestres, limite por via e respawn seguro de veículos.

## Validação local
- 28/28 testes de regressão selecionados: PASS
- 6/6 testes específicos F67: PASS
- 20/20 validações de trilhos/monotrilho: PASS
- validador Cidade Viva / Mobilidade: PASS
- fundação F63A: 6/6 PASS
- 40 arquivos JS do Lobby: sintaxe OK
- Edge Function modificada: parser TypeScript sem erros
- HTML do Lobby: 188 IDs / 188 únicos
- smoke HTTP local: Lobby, lobby.js, lobby3d.js e migration 066 retornaram HTTP 200
