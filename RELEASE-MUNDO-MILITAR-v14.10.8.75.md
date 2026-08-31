# AGV World F73 — Base de Operações AGV

**Versão:** 14.10.8.75  
**Build:** 14.10.8.75-stage44-military  
**Fase:** world-f73-military-streaming  
**Base:** F72 / 14.10.8.74

## Objetivo

Adicionar um novo mapa operacional carregado sob demanda, reutilizando a fundação de streaming da F72. O ambiente é educacional e recreativo, focado em logística, engenharia, resgate, aviação, manutenção, coordenação e observação. **Não há armamentos, combate, tiro, munição ou projéteis.**

## Entregas

- Novo **Portal Base de Operações AGV** no Campus.
- Novo mundo `military` / área `military-agv`, com limites e conversão de coordenadas próprios.
- Runtime **2D** (`military-lite.js`) e **3D** (`military3d.js`) importados dinamicamente apenas quando o aluno viaja para a Base.
- Ao sair do mapa, o World Manager encerra o runtime e o 3D descarta renderer, geometrias, materiais, clima, câmera, avatares e listeners.
- Portaria institucional e corredor de retorno ao Campus.
- Centro de Operações AGV.
- Hangar de Logística.
- Hangar de Engenharia.
- Centro de Resgate e Primeiros Socorros.
- Alojamento de treinamento.
- Pista de aviação para transporte, observação e resgate.
- Circuito recreativo com escalada, pneus e barras de equilíbrio.
- Torre de Observação.
- Veículos cenográficos de apoio: caminhão logístico, van de resgate, rover de engenharia e helicóptero de observação sem armamento.
- Minimapa e teleporte global com destinos próprios da Base.
- Presença, chat de proximidade e reunião assinada reconhecem `military-agv`.
- Usuários da Base são filtrados do Campus para não aparecerem em coordenadas erradas.
- Carros/vans/ônibus multiplayer continuam restritos ao Campus.

## Streaming em duas camadas

A F73 usa duas etapas de carregamento:

1. **Mapa sob demanda:** `military-lite.js` e `military3d.js` não fazem parte do boot inicial nem do `CRITICAL_SHELL` do Service Worker.
2. **Interior sob demanda:** os interiores dos hangares não existem no 3D externo. O grupo `military-interior-streamed-f73:*` é criado somente ao entrar e é removido/disposto ao sair.

A troca 2D ↔ 3D preserva o hangar em que o usuário estava. O comando de reunir da equipe também consegue recolocar um usuário dentro de `military:logistics` ou `military:engineering`.

## Backend

A F73 adiciona a área `military-agv` ao contrato de presença e aceita a cena `military` nos tokens assinados de reunir/chat.

### Migration necessária

`core/database/068_lobby_military_world.sql`

Ela atualiza `lobby_presence_area_chk` para aceitar:

- `central`
- `1ds`
- `2ds`
- `3ds`
- `sub`
- `vale-silicio`
- `rural-agv`
- `military-agv`

### Edge Function

É necessário republicar:

`core/edge-functions/lobby-presence/index.ts`

A função:

- reconhece `military` em reunir/chat;
- normaliza a área assinada para `military-agv`;
- impede sessões de veículos terrestres multiplayer em `military-agv`;
- mantém a validação de distância e sessão para presença/chat.

## Manutenção incluída

- O teste F72 foi tornado compatível com releases futuras sem perder a garantia de lazy loading do Mundo Rural.
- O validador legado da Fase 33 deixou de exigir literalmente `14.10.8.65` e agora valida corretamente qualquer cache-bust de fase >=33.
- Corrigido `emissiveIntensity` da porta dos hangares para um ternário explícito.
- A troca de runtime agora restaura interior militar ativo.

## Validação

- F73 específica: **9/9 PASS**
- Regressão cumulativa F63A → F73: **65/65 PASS**
- Trilhos / monotrilho: **20/20 PASS**
- Mobilidade / Cidade Viva: **PASS**
- Masterplan do Campus: **PASS**
- Horário global: **16/16 PASS**
- Clima global: **20/20 PASS**
- Runtime de interiores: **18/18 PASS**
- Personalidade dos interiores / Fase 33: **PASS**
- JavaScript + Service Worker: **50 arquivos PASS**
- Edge Function TypeScript: **PASS**
- HTML: **212/212 IDs únicos**
- Smoke HTTP local: **8/8 HTTP 200**
- E2E visual automatizado em navegador: **não executado nesta fase**

## Implantação

Para a Base funcionar integralmente com presença/chat/reunir:

1. aplicar `068_lobby_military_world.sql`;
2. republicar `lobby-presence`;
3. publicar o frontend da versão 14.10.8.75;
4. limpar/atualizar o Service Worker caso a publicação anterior continue em cache.

As migrations F65/F67/F72 anteriores continuam necessárias caso ainda não tenham sido aplicadas nos respectivos recursos.
