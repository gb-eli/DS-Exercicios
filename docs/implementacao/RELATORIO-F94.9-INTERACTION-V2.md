# AGV World — F94.9 Interaction V2

Base: F94.8 Camera V2 / v14.10.8.96
Cache: `stage71-f949-interaction-v2`

## Objetivo
Padronizar o contrato de interação do AGV World e impedir affordances enganosas em objetos sem implementação jogável real.

## Implementado
- `core/interaction-v2/interaction-contract.js` com níveis L0–L5 e verbos semânticos.
- `core/interaction-v2/interaction-manager.js` com execução central, debounce, feedback, auditoria e normalização de resultados.
- Pipeline central do Lobby passa por `InteractionManager` para objetos, jogadores, bancos, portais, saída de veículo e Mirante.
- Feedback visual de início/sucesso/erro no cartão de interação.
- Auditoria registra tipo, verbo, nível, mundo, modo e duração sem gravar texto digitado ou dados pessoais.
- Objetos sem interação ativa deixam de prometer ação funcional: desconhecidos ficam `Apenas cenário` e desabilitados.
- `vale-vehicle` agora é classificado como informativo (`Examinar`), não como direção.
- `vale-sport` deixa de sugerir minijogo funcional; `military-support-vehicle` deixa de sugerir direção.
- Veículos funcionais mantêm semântica correta: terrestre L4, aéreo L4 e embarque multiplayer L5.
- NPCs e recepções usam feedback animado leve quando apropriado.

## Níveis
- L0 — Decorativo
- L1 — Informacional
- L2 — Animado
- L3 — Stateful/interativo
- L4 — Experiência jogável
- L5 — Multiplayer/autoritativo

## Limites desta fase
A F94.9 não cria novas animações 3D específicas para todo objeto, não implementa física nova e não transforma objetos atualmente decorativos em veículos/minijogos reais. Ela torna a UI honesta, cria o contrato e o pipeline necessários para essas evoluções posteriores.

## Próxima etapa
F94.10 — carregamento modular/interiores e identidade de ambientes; depois qualidade gráfica/assets, Vehicle Core + Rapier e, por fim, NetworkManager + Colyseus.
