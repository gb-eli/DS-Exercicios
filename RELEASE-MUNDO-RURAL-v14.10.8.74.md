# AGV World F72 — Mundo Rural AGV

**Versão:** `14.10.8.74`  
**Build:** `14.10.8.74-stage43-rural`  
**Fase:** `world-f72-rural-streaming`  
**Base:** `14.10.8.73` (F71 — Mirantes e Binóculos)

## Objetivo

A F72 inaugura a fundação de **mapas externos carregados sob demanda**. O Campus permanece como mundo principal e leve; o Mundo Rural só instancia seu runtime 2D/3D quando o usuário viaja para ele. Ao voltar ao Campus, o runtime rural é encerrado e seus recursos 3D são descartados.

## Mundo Rural

O primeiro mapa externo inclui:

- Estrada de entrada e portal de retorno ao Campus;
- Fazenda Pedagógica AGV;
- Casa da Fazenda, Celeiro AGV, Silo de Grãos e Estábulo;
- Milharal, Campo de Trigo e Horta Pedagógica;
- Pomar Experimental e pasto;
- Rio Veiga e ponte principal;
- Mirante Rural;
- Vacas, cavalo, ovelhas e galinha;
- Vegetação procedural, cercas e relevo visual de fundo;
- Ciclo de horário e clima compartilhados com o restante do AGV World.

## Streaming / descarregamento

`RURAL_WORLD_ADAPTER` usa `import()` dinâmico para `rural-lite.js` e `rural3d.js`. Esses dois runtimes não fazem parte do `CRITICAL_SHELL` do Service Worker nem do preflight normal do `boot.js`.

Quando há troca de mapa, o `World Manager` chama `stop()` no runtime ativo. O Rural 3D remove listeners, encerra o loop de animação, descarta efeitos climáticos e câmera e executa `renderer.dispose()` e descarte de geometrias, materiais e texturas da cena.

Na primeira visita, o Service Worker pode armazenar os módulos rurais após a requisição normal; isso permite fallback de cache em visitas posteriores sem transformar o Rural em dependência do boot principal.

## Navegação

- Portal **Mundo Rural AGV** no Campus;
- Portal de retorno no início da estrada rural;
- Teleporte global com filtro `Mundo Rural AGV`;
- Destinos rápidos: entrada, fazenda, celeiro, ponte, rio, pasto, pomar, mirante e retorno;
- Minimapa rural próprio;
- A posição anterior no Campus é preservada e restaurada no retorno.

## Presença e multiplayer

A presença passa a aceitar a área `rural-agv` com conversão de coordenadas própria.

Também foram atualizados:

- chat de proximidade;
- reunião/teleporte assinado da equipe;
- filtragem de usuários entre mapas.

Usuários no Rural não são projetados no Campus e vice-versa.

**Veículos terrestres multiplayer continuam restritos ao Campus.** A F72 não tenta reutilizar o contrato de veículo em um mapa externo sem uma regra de mobilidade própria.

## Banco / backend obrigatórios

### Migration 067

Aplicar:

`core/database/067_lobby_rural_world.sql`

Ela atualiza `lobby_presence_area_chk` para permitir:

- `central`
- `1ds`
- `2ds`
- `3ds`
- `sub`
- `vale-silicio`
- `rural-agv`

### Edge Function

Republicar:

`core/edge-functions/lobby-presence/index.ts`

A função passa a reconhecer `scene='rural'`, normaliza a área de `gather` conforme o mapa assinado, habilita chat/reunir no Rural e mantém as sessões de veículos terrestres bloqueadas em mapas externos.

## Compatibilidade preservada

A F72 preserva:

- F64 Cinema AGV;
- F66 direção manual;
- F67 passageiros multiplayer;
- F68 trânsito inteligente;
- F69 Central de Segurança/CCTV;
- F70 mobilidade aérea;
- F71 mirantes/binóculos;
- interiores lazy do Campus;
- monotrilho, montanha-russa, parkour, horário e clima.

## Validação

- F72 específica: **8/8 PASS**;
- regressão acumulada F63A → F72: **56/56 PASS**;
- runtime de interiores/lazy load: **18/18 PASS**;
- trilhos e monotrilho: **20/20 PASS**;
- mobilidade/cidade viva: **PASS**;
- masterplan do Campus: **PASS**;
- horário: **16/16 PASS**;
- clima: **20/20 PASS**;
- sintaxe: **47 arquivos JavaScript/Service Worker PASS**;
- Edge Function `lobby-presence`: **parser TypeScript PASS**;
- HTML: **211/211 IDs únicos**;
- smoke HTTP local: **7/7 respostas 200 OK**.

Não foi executado E2E visual automatizado em navegador nesta fase. O pacote também não implica que migration/Edge Function já tenham sido aplicadas em produção.

## Pendências planejadas

A fundação de streaming da F72 pode ser reutilizada para os próximos mundos, especialmente ambiente militar e o eixo espacial/Lua/Marte. Veículos rurais/off-road, montaria e multiplayer de mobilidade entre mapas não fazem parte desta fase.
