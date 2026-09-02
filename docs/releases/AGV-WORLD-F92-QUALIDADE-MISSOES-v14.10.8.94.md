# AGV World F92 — Qualidade Modular dos Ambientes de Missão

**Release:** v14.10.8.94  
**Build:** 14.10.8.94-stage63-f92-mission-graphics  
**Data:** 2026-09-02

## Objetivo

Levar a arquitetura gráfica modular das F90/F91 para **Base de Operações AGV, Estação Orbital AGV, Lua AGV e Marte AGV**, mantendo os quatro runtimes sob demanda, a topologia atual dos mundos, multiplayer, interiores/veículos existentes e os perfis Econômico/Médio/Alto/Ultra.

## Camada compartilhada

Novo arquivo:

`lobby/assets/render/mission-world-quality.js`

O módulo deriva o perfil visual da F90 e acrescenta parâmetros próprios para ambientes militar, orbital, lunar e marciano:

- distância de objetos, detalhes e camadas premium;
- densidade de superfície, estrelas e partículas;
- orçamento de luzes e intensidade emissiva;
- nível de materiais físicos;
- orçamento de clima/poeira marciana;
- DPR, sombras e tamanho de shadow map com limite por hardware.

O seletor de qualidade aplica o perfil imediatamente, sem reconstruir o mundo.

## Base de Operações

- Cerca perimetral convertida de painéis individuais para um `InstancedMesh`.
- Marcações e luzes repetidas da pista convertidas para instancing.
- Edificações recebem camadas de detalhe médio e premium por distância.
- Antenas, beacons e luz da torre ficam reservados aos perfis superiores.
- Pista, circuito de treinamento, veículos de apoio, clima, Avatar V2, sombras, emissivos e DPR respondem ao seletor durante a execução.
- Horário/clima continuam controlando a atmosfera; a qualidade entra apenas como offset visual.

## Estação Orbital

- Estrelas e cinturão de asteroides usam draw range progressivo.
- Linhas repetidas dos painéis solares usam um único `InstancedMesh`.
- Módulos orbitais recebem janelas/camadas médias e antenas/beacons premium por distância.
- Nuvens da Terra, órbitas secundárias, corredores emissivos, grade solar, materiais da cúpula e luzes passam a respeitar o perfil.
- A cúpula usa material físico somente quando hardware e qualidade permitem.
- O ciclo temporal orbital continua sendo a fonte principal da exposição.

## Lua

- Crateras passam para dois lotes instanciados: bowls e bordas.
- Rochas lunares passam para um único `InstancedMesh`.
- Base Lunar recebe janelas progressivas, antenas e detalhes premium por distância.
- Estrelas, crateras, rochas, painéis de energia, experimentos, Terra atmosférica, Avatar V2, sombras e DPR respondem ao seletor.
- Gravidade, rover, presença, retorno orbital e interações foram preservados.

## Marte

- Crateras e rochas marcianas passam para lotes instanciados.
- Cânions, detalhes de superfície e painéis de energia recebem orçamento progressivo.
- Base Marciana recebe camadas médias e premium por distância.
- Estrelas e poeira usam draw range variável.
- Densidade visual da tempestade e contribuição da poeira no fog passam a respeitar o orçamento de qualidade.
- Gravidade, rover, presença, retorno orbital e interações foram preservados.

## Ganho estrutural medido

Harness estrutural com renderer controlado, comparando a mesma sequência de primeiro frame da F91 com a F92:

| Mundo | F91 | F92 | Variação |
| --- | ---: | ---: | ---: |
| Base de Operações | 353 | 225 | -36,3% |
| Estação Orbital | 186 | 201 | +8,1% |
| Lua | 204 | 145 | -28,9% |
| Marte | 244 | 169 | -30,7% |
| **Total** | **987** | **740** | **-25,0%** |

A Estação Orbital adicionou grupos explícitos de LOD para módulos e materiais, elevando levemente sua estrutura base. Mesmo assim, a grade repetida dos painéis solares foi instanciada e, no conjunto dos quatro mundos, houve redução exata de 25,0% nos objetos de cena do harness.

Em Econômico, a F92 manteve 645 objetos visíveis no conjunto após a troca em execução. Esses números medem estrutura de cena; não representam diretamente ganho de FPS em GPU real.

## Performance e carregamento

Os quatro runtimes e o helper novo continuam fora do `CRITICAL_SHELL`.

- Shell crítico F91: 1.113.088 bytes
- Shell crítico F92: 1.113.111 bytes
- Diferença: **+23 bytes (~0,002%)**

O custo de boot praticamente não mudou. Os mundos continuam importados somente quando necessários e agora todos possuem entrada de prefetch sem carregamento antecipado obrigatório.

## Validação

- F92: **10/10 PASS**
- O2 observabilidade: **7/7 PASS**
- F91 histórico: **9/10**; falha apenas na versão esperada `14.10.8.93`.
- F90 histórico: **8/10**; falhas históricas de versão e cache do Vale já avançado pela F91.
- F89 histórico: **10/11**; falha apenas na versão esperada `14.10.8.91`.
- JS/SW do Lobby, sem vendor: **143 arquivos, 0 erros sintáticos**.
- Grafo do Lobby: **146 módulos, 424 imports locais, 0 ausentes**.
- Runtimes/hosts 3D: **17/17 importáveis como ESM**.
- Service Worker crítico: **67 URLs, 0 ausentes, 0 runtimes 3D/helpers de missão**.
- Harness controlado: **Base, Órbita, Lua e Marte com primeiro frame PASS e troca Ultra → Econômico PASS**.

## Backend

A F92 **não exige migration nova nem alteração de Edge Function**. Para uma instalação já consolidada até a migration 079, a publicação é somente de frontend + Service Worker.

## Próxima fase sugerida

F93: aplicar contratos especializados aos ambientes restantes de maior complexidade visual — Parque de Diversões, Museu do Hardware, Colégio AGV e Labirinto — preservando o carregamento sob demanda de cada mapa.
