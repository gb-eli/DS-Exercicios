# CORREÇÕES — ETAPA 16

## Interações e atrações do Lobby

Escopo isolado desta etapa: escadas externas, elevadores/escadas internas, escorregador, parquinho, Mirante AGV, estações/monotrilho e passeio panorâmico no trilho. Laboratório pedagógico/adaptações dos alunos não foi alterado.

### Problemas encontrados
- As escadas externas existiam visualmente e tinham superfícies de altura, mas `canStand()` bloqueava os próprios degraus por eles estarem dentro da área de colisão do prédio.
- O escorregador possuía malha visual de escada, mas os degraus/plataforma não participavam da superfície física compartilhada do Campus.
- A subida guiada do Mirante terminava no alto sem uma superfície física persistente; no frame seguinte o jogador podia voltar a cair para o solo.
- A Estação Intermodal abria o seletor de monotrilho, mas o `ride-manager` possuía texto para `coaster` sem existir uma rota `CAMPUS_RIDES.coaster` executável.
- Durante uma viagem, o trem visual seguia sua animação ambiente independente em vez de acompanhar o passageiro.
- As estações não davam feedback visual de chegada do trem.

### Alterações
- Colisão externa passa a aceitar superfícies `step` e `ramp` das escadas, mantendo `roof` e `bridge`.
- Os 72+ degraus externos das quatro salas continuam derivados do masterplan e agora podem ser percorridos fisicamente.
- Escorregador ganhou 8 superfícies de degrau + plataforma superior física alinhadas à geometria 3D.
- Mirante ganhou três decks físicos, incluindo deck superior a 13,32 m.
- Subida do Mirante termina no deck superior e a nova rota `tower-down` permite descida segura ao interagir novamente no alto.
- Modo 2D preserva a mesma alternância lógica do Mirante.
- Criada rota `CAMPUS_RIDES.coaster` para uma volta panorâmica completa pelo circuito do Campus, partindo e retornando à Estação Intermodal.
- Modal do monotrilho ganhou botão contextual **Montanha-russa panorâmica**, exibido somente quando a interação vem da Estação Intermodal; estações comuns continuam oferecendo somente viagens ponto a ponto.
- Durante viagem normal ou passeio panorâmico, o trem visual acompanha o trajeto do passageiro.
- Avatar do jogador fica oculto dentro do trem durante essas viagens, evitando sobreposição visual.
- Cada estação ganhou indicador/balizador que pulsa quando o trem está parado naquele ponto.
- Elevadores e escadas internas existentes foram preservados: cabine 3D com tempo de viagem e troca de pavimento; 2D mantém equivalência funcional.
- Parquinho continua com balanços/gangorra animados e experiência local controlada pelo `ride-manager`.

### Validação
- `validate-campus-interactions-stage16-v65.mjs`: 22/22 PASS.
- Etapas 10–15: PASS.
- Cidade/Interiores/Cidade Viva/Mobilidade/Login Único: PASS.
- Suíte geral: 359/368 PASS, exatamente as mesmas 9 falhas da Etapa 15.

A sensação final de subida, viagem e câmera ainda deve ser validada em navegador WebGL após deploy, mas os contratos de física/rotas/interações estão coerentes e sem regressão automatizada.

Nenhuma migration, Edge Function ou alteração de banco nesta etapa.
