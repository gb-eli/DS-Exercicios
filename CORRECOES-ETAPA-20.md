# CORREÇÕES — ETAPA 20

## Vale do Silício — recuperação de renderização 2D/3D

Escopo: corrigir o estado em que o Vale aparece como um fundo escuro com apenas eixos/ruas e pequenos pontos, sem redesenhar novamente a cidade e sem alterar física, interiores, banco ou autenticação.

### Diagnóstico

A foto de produção corresponde ao mapa do Vale excessivamente aberto após a ampliação urbana para 840 × 840 m. O 2D mantinha zoom fixo muito baixo e a própria UI informava que o scroll fazia zoom, embora `vale-lite.js` não possuísse evento de roda. Em paralelo, o 3D podia ficar visualmente vazio no perfil Eco por combinar mapa muito amplo, LOD curto, névoa noturna e materiais escuros.

### Vale 2D

- zoom inicial desktop aumentado para 1.08;
- zoom inicial touch/telefone aumentado para 0.82;
- scroll do mouse implementado de fato;
- pinch zoom implementado para touch;
- atalhos `+`, `-` e `0` adicionados;
- faixa de zoom limitada de 0.62 a 1.90;
- prédios recebem tamanho mínimo de 9 × 8 px para não virarem pontos;
- a câmera 2D continua seguindo o jogador e o mapa amplo permanece navegável;
- listeners de zoom são removidos corretamente no `stop()`.

### Vale 3D

- plano de clipping ampliado para 1400 m;
- sky dome ampliado para cobrir com folga os limites urbanos;
- névoa noturna reduzida para não apagar bairros próximos;
- LOD de prédios ampliado: Eco 265 m, Médio 340 m, Alto 430 m e Ultra 520 m;
- corpos dos prédios ficaram ligeiramente mais legíveis em baixa luz;
- telhados recebem uma leitura/acento discreto para serem reconhecidos também em câmera elevada;
- câmera inicial abre mais o terreno (`pitch .43`, distância `9.2`);
- recuperação defensiva garante que `worldRoot` volte a `visible=true` quando não existe interior ativo.

### Segurança de escopo

- nenhum prédio/lote foi reposicionado;
- física e colisões da Etapa 11 preservadas;
- urbanismo da Etapa 13 preservado;
- interiores modularizados preservados;
- sem migration, Edge Function ou alteração de banco.

## Validação

- `validate-vale-rendering-stage20-v65.mjs`: **12/12 PASS**;
- entrada/câmera do Vale: **PASS**;
- física/circulação: **PASS**;
- urbanismo: **PASS**;
- masterplan, áreas abertas, interiores, atrações, responsividade e polimento visual: **PASS**;
- Cidade/Interiores/Cidade Viva/Mobilidade/Login Único: **PASS**;
- suíte completa: **368/376 PASS**;
- as 8 falhas restantes são as mesmas da Etapa 19 e não pertencem ao Vale.
