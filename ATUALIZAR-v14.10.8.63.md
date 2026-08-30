# AGV Education Core — v14.10.8.63

## Fase 62B — Connected Interiors

Base: **v14.10.8.62 — Campus City / Fase 62A**

Esta fase transforma os 10 prédios funcionais do Campus em edifícios exploráveis antes de abrir as ferramentas reais.

### Implementado
- 10 perfis de interiores conectados: Plataforma Unificada, Banco, Loja, Lab Virtual, CTF, COSMOS, Desafio DS, Fliperama, Desafio Informática e Centro de Provas.
- térreo + primeiro pavimento para cada prédio;
- recepção funcional em todos os prédios;
- halls e corredores internos;
- elevador e escada em todos os prédios;
- portal interno que abre a ferramenta real usando a sessão AGV existente;
- garagens acessíveis em Lab Virtual, Fliperama, Desafio Informática e Centro de Provas;
- equivalência de navegação no modo 2D e no modo 3D;
- preservação do interior ao alternar 2D ↔ 3D;
- suporte a reunião da turma em interiores de prédios pelo fluxo de gather;
- presença pública continua sendo registrada na entrada externa do prédio, evitando expor coordenadas virtuais internas no backend;
- Service Worker, boot e página de reparo atualizados para validar o módulo `campus-interiors.js`.

### Arquitetura
Novo módulo de dados:

`lobby/assets/world/campus-interiors.js`

Ele concentra perfis, pavimentos, recepções, elevadores, escadas, garagens e pontos de portal.

### Segurança e backend
- nenhuma migration;
- nenhuma alteração de schema Supabase;
- nenhuma `service_role` no frontend;
- autenticação unificada preservada.

### Próxima fase
**62C — Integração Sistêmica e Cidade Viva**

- interiores especializados por prédio;
- NPCs/recepcionistas contextuais;
- mapas internos e wayfinding por andar;
- elevadores com animação/transição;
- garagens com veículos interativos;
- estações conectadas aos prédios;
- eventos institucionais e rotas guiadas;
- integração visual e física mais profunda com o Vale do Silício AGV.
