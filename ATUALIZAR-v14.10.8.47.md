# DS-Exercicios — v14.10.8.47

## Fase E — Portal V2 + FX

Release incremental construída sobre a base completa v14.10.8.46 / Fase D.

### Implementado

- `lobby/assets/game/portal-manager.js`
  - criação centralizada dos quatro portais;
  - estrutura arquitetônica V2;
  - campo energético em três camadas;
  - partículas determinísticas;
  - scanlines;
  - anéis luminosos de piso;
  - luzes dinâmicas por proximidade;
  - estados visuais `PORTAL ABERTO` e `AGUARDANDO`;
  - gerenciamento de qualidade `low / medium / high / ultra`.
- `lobby/assets/lobby3d.js`
  - remove os construtores antigos `portalGate` e `portalParticles`;
  - usa `createPortalSystem()`;
  - encaminha alterações de qualidade ao Portal V2;
  - mantém o mesmo contrato de proximidade usado pelo gameplay.
- `lobby/assets/boot.js`
  - valida o novo módulo Portal V2 no boot.
- `lobby/sw.js`
  - adiciona o Portal V2 ao shell offline.
- `lobby/assets/lobby.css`
  - adiciona anel visual de viagem do portal sem introduzir biblioteca de pós-processamento.

### Qualidade

- **Eco**: estrutura + core energético; efeitos caros desligados.
- **Médio**: partículas e scanlines reduzidas.
- **Alto**: halo e PointLight dinâmicos.
- **Ultra**: veil adicional e segunda luz de proximidade.

### Compatibilidade preservada

- mesma lógica de abertura/fechamento dos portais;
- mesma posição dos quatro portais definida em `campus-manifest.js`;
- Camera V2;
- Avatar V2;
- interiores 3D;
- Lobby Lite;
- presença online;
- Supabase;
- mobile;
- GitHub Pages / estrutura de rotas.

### Banco

Nenhuma alteração de banco de dados ou schema.

### Regra de publicação

Este pacote é **PATCH incremental**. Aplicar por cima da árvore completa atual. Não apagar os demais arquivos do repositório antes da cópia.
