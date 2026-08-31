# Correções — Etapa 12

## Masterplan estrutural do Lobby Geral

Esta etapa reorganiza a estrutura macro do Campus antes das fases de detalhamento de cada distrito e dos interiores.

### 1. Campus ampliado

- Antes: `WORLD_X=40`, `WORLD_Z=25` → aproximadamente 80 × 50 m.
- Agora: `WORLD_X=56`, `WORLD_Z=38` → aproximadamente 112 × 76 m.
- O objetivo é criar margem real entre prédios, atrações, circulação e bordas do mapa.

### 2. Zoneamento

- Norte: Plataforma Unificada + Banco + Loja.
- Oeste: Laboratório Virtual + Fliperama + CTF.
- Leste: COSMOS + Desafio DS + Desafio Informática.
- Sul: Centro de Provas + corredor/portal do Vale do Silício.
- Quatro salas (1DS, 2DS, 3DS, SUB) permanecem como quadrantes intermediários entre núcleo e distritos externos.

### 3. Circulação

- avenidas principais: 6,4–7,0 m;
- calçadas ampliadas;
- anel viário externo mais distante do núcleo;
- travessias maiores nos eixos principais;
- passarelas deslocadas para ±24 m do centro;
- Vale com eixo monumental de 7,2 m.

### 4. Redução de poluição visual

Foi removida a segunda malha urbana legada que ainda era desenhada por cima da cidade atual no 2D e no 3D. Essa base continha vias, muros e uma pista de pouso sobrepostas à rede urbana modular.

A praça central também ficou mais compacta e a cobertura foi reduzida para manter visão aberta dos quatro eixos.

### 5. 2D e 3D sincronizados

As coordenadas macro são compartilhadas pelos módulos de dados. O mapa 2D e o 3D passam a refletir a mesma estrutura de:

- salas;
- destinos;
- vias;
- praças;
- garagens;
- passarelas;
- monotrilho/estações;
- atrações;
- tráfego/NPCs/sinalização.

As escadas e telhados externos das quatro salas também deixaram de ter posições hardcoded separadas e agora derivam diretamente de `CAMPUS_ZONE_LAYOUT`.

### 6. O que ficou para as próximas etapas

Esta etapa não reconstrói ainda os detalhes de cada prédio/ambiente. Permanecem para fases seguintes:

- detalhamento urbano do Vale do Silício;
- acabamento do Lobby principal;
- modularização/descarregamento real de interiores;
- elevadores/escadas/interações finais;
- estações e atrações com animações completas;
- polimento de céu, vegetação e iluminação por distrito.

## Validação

- Masterplan estrutural: PASS.
- Vale entrada/câmera: 9/9 PASS.
- Vale física/circulação: 12/12 PASS.
- Cidade, Interiores, Cidade Viva, Mobilidade e Login Único: PASS.
- Suíte comparável: 359/368 PASS, sem regressão.
- Suíte ampliada: 383/393 PASS, sem regressão.
