# Etapa 30 — Fase 2.4: ambientação estrutural do Lobby e Vale

Data: 31/08/2026

## Escopo

Fase limitada à ambientação estrutural e otimização visual do Campus/Lobby e Vale do Silício. Não inclui sistema completo de clima, veículos dirigíveis novos, NPCs inteligentes, subsolo ou mudanças de banco/backend.

## Implementado

### Campus / Lobby 3D
- vegetação periférica migrada para `InstancedMesh`;
- 12 árvores com três silhuetas e variação de tonalidade;
- 8 vasos convertidos para duas instâncias compartilhadas;
- nuvens leves instanciadas por qualidade;
- campo de estrelas em `Points`, visível conforme o período noturno;
- dois drones ambientais de grande porte com corredores periféricos;
- orçamento visual por qualidade (`low`, `medium`, `high`, `ultra`);
- modo Eco remove nuvens e aeronaves decorativas e reduz vegetação;
- `prefers-reduced-motion` interrompe movimento ambiental não essencial.

### Vale do Silício 3D
- 20 pontos oficiais de paisagismo do `urban_plan` preservados;
- árvores migradas de grupos individuais para troncos/copas instanciados;
- três silhuetas de vegetação e variação de tonalidade;
- drone já existente ampliado visualmente;
- três rotas aéreas decorativas: drone observador, drone de carga e shuttle aéreo;
- nuvens e estrelas escaladas por orçamento de qualidade;
- iluminação arterial continua sem dezenas de `PointLight`: apenas o emissivo dos postes responde ao período noturno;
- ambiente extra é suspenso junto com o `worldRoot` durante interiores.

### Mapas 2D
- Campus 2D usa os mesmos pontos, silhuetas e tons de árvores do contrato compartilhado;
- Vale 2D diferencia três silhuetas de vegetação sem adicionar rótulos ou ruído visual.

## Otimização

Componente de vegetação, aproximadamente:
- Campus: de ~96 meshes individuais de árvores/vasos para 4 grupos instanciados;
- Vale: de ~40 meshes individuais de árvores para 2 grupos instanciados.

Esses números são referentes somente ao componente de vegetação/vasos, não ao total de draw calls da cena.

## Cache

A cadeia principal do Lobby usa `stage30`:
- `vendor-loader.js`;
- `boot.js`;
- `lobby.js`;
- `lobby3d.js`;
- `lobby-lite.js`;
- `vale3d.js`;
- `vale-lite.js`;
- Service Worker.

Novo módulo pré-carregado:
- `lobby/assets/world/ambient-landscape.js?v=14.10.8.65-stage30`.

## Validação

- `validate-stage30-ambient-environment.mjs`: 20/20 PASS;
- Fases 2.1, 2.2 e 2.3: PASS;
- masterplan, urbanismo, física, renderização do Vale, responsividade, interiores e atrações: PASS;
- cinco validadores oficiais: PASS;
- suíte completa: **376/376 PASS — 0 falhas**.

## Banco / backend

Nenhuma migration, Edge Function ou alteração de banco nesta etapa.
