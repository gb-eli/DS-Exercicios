# Campanha Integral — CTF DS v3.1.0

## Objetivo

A versão 3.1.0 conclui a migração das 68 missões para o Investigative Workspace. Todas as operações passam a combinar caso narrativo, materiais sob demanda, ferramenta, evidências, análise e conclusão defensiva.

## Cobertura completa

- 68 casos investigativos;
- sete arcos narrativos;
- sete blocos com checkpoints;
- 68 pacotes de caso materializados somente quando abertos;
- 58 investigações avançadas após o bloco inicial;
- 36 casos integrados diretamente à Simulation Suite;
- oito ambientes 3D/360;
- 55 associações contextuais entre missões e ambientes imersivos.

## Estrutura de cada caso

Cada missão pode oferecer, conforme a competência avaliada:

- apresentação e objetivo;
- documentos;
- registros e logs;
- comunicações;
- arquivos;
- simuladores e ferramentas locais;
- evidências anotáveis;
- hipótese, linha do tempo e decisão;
- recomendação defensiva;
- conclusão e debriefing.

Os requisitos variam por missão. A plataforma não exige artificialmente a mesma quantidade de evidências ou ações em todos os casos.

## Novos ambientes da fase

Além da sala de servidores, SOC, rede, central orbital e incidente financeiro, a campanha inclui:

- **Laboratório AppSec 3D** — fluxos de aplicação, validação, código e proteção;
- **Cofre Forense 3D** — preservação de artefatos, integridade e cadeia de custódia;
- **Centro Mobile 3D** — dispositivos, permissões, armazenamento e isolamento.

Todos possuem fallback 2D equivalente.

## Otimização adaptativa

No modo Automático, o motor pode reduzir ou recuperar gradualmente:

- resolução interna;
- densidade de partículas;
- carga visual;
- escala de renderização.

O render é pausado quando a página fica oculta ou o ambiente sai da área visível. Recursos WebGL são descartados ao fechar a ferramenta.

## Persistência

- perfil: schema 14;
- workspace: versão 8;
- rascunho: versão 7;
- cache: `ctfds-v3.1.0`.

O perfil preserva investigação, evidências, decisões, simuladores, uso 3D/360 e progresso dos blocos.

## Limites

Todo o conteúdo é fictício e local. A plataforma não acessa redes, contas, dispositivos, serviços financeiros, satélites, organizações ou sistemas externos. O projeto permanece frontend e não substitui um backend autoritativo.
