# Correções — Etapa 13

## Vale do Silício — reorganização urbana e visual

Esta etapa reorganiza somente o Vale do Silício sobre a base de câmera/física das Etapas 10 e 11. Não altera interiores detalhados, elevadores, atrações do Lobby Geral, atividades práticas ou banco.

### Alterações estruturais

- área do Vale: 640 × 640 m → 840 × 840 m;
- malha radial substituída por quadras ortogonais;
- 2 avenidas de 14 m, vias secundárias de 7–9 m e ruas locais de 6 m;
- calçadas de 3,2 m;
- 38 segmentos de rua e 8 travessias;
- Portal de Retorno movido para o portão sul;
- quadras próprias por distrito;
- complexo esportivo deslocado para a borda norte;
- mobilidade/hangar/pista consolidados a sudoeste.

### Empresas e fachadas

- 27 empresas preservadas;
- nenhum lote se sobrepõe;
- nenhuma rua atravessa lote;
- fachadas orientadas para vias com rotações ortogonais;
- colisão OBB das etapas anteriores preservada;
- placas 3D passam a respeitar profundidade da cena.

### 2D ↔ 3D

- ambos consomem `world.urban_plan`;
- ruas, quadras e faixas de pedestre derivam da mesma fonte;
- prédios 2D passam a respeitar a rotação do 3D;
- colisão 2D também usa coordenadas locais/OBB.

### Paisagismo e leitura visual

- paisagismo propositalmente esparso;
- bancos na praça;
- iluminação urbana concentrada nas avenidas;
- placas distritais menores e posicionadas nos gateways;
- remoção dos spokes/rings radiais que poluíam a leitura da cidade.

### Validação

- urbanismo Etapa 13: 21/21 PASS;
- entrada/câmera: 9/9 PASS;
- física/circulação: 12/12 PASS;
- Masterplan/Cidade/Interiores/Cidade Viva/Mobilidade/Login Único: PASS;
- suíte geral: 359/368 PASS;
- 9 falhas remanescentes são idênticas às da Etapa 12 e não pertencem a esta fase.
