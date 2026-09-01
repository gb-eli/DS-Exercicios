# AGV World F88 — Campus Modular

**Versão:** 14.10.8.90  
**Base:** F87 v14.10.8.89  
**Fase:** Fragmentação adicional do Campus / módulos sob demanda

## Objetivo

Reduzir a carga permanente do Campus DS movendo áreas pesadas que não precisam existir simultaneamente para mundos modulares independentes, sem perder sua presença visual e seus acessos no mapa principal.

## Novos mundos

A F88 adiciona três mundos persistentes ao WorldRegistry:

1. `campus-library` — **Biblioteca Central AGV**
2. `campus-labs` — **Distrito de Laboratórios AGV**
3. `campus-neon` — **Parque Neon & Lazer AGV**

O catálogo passa de 15 para **18 mundos**, com **18 adapters** e **17 conexões estruturais**.

Cada módulo possui runtime Lite e runtime 3D próprio. O runtime 3D genérico (`campus-module3d.js`) não integra o shell crítico e só é importado quando o módulo é solicitado.

## O que saiu do runtime principal do Campus

O Campus deixa de instanciar como experiências permanentes:

- Laboratório Virtual;
- Piscina Neon;
- Parkour;
- Playground;
- Escorregador.

Também foram removidas da superfície ativa do Campus as antigas etapas físicas de escorregador/parkour que continuariam gerando colisão mesmo após a extração visual.

No lugar desses cinco blocos, o hub mantém apenas três gateways leves:

- Biblioteca Central;
- Distrito de Laboratórios;
- Parque Neon & Lazer.

O Lab Virtual continua disponível dentro do Distrito de Laboratórios como link de ferramenta, sem precisar manter seu prédio/interior pesado ativo no Campus central.

## Mapa 2D e proporções

O mapa 2D passa a representar os novos módulos como distritos proporcionais, não como pequenos POIs:

- Biblioteca: 18 × 12 unidades de layout;
- Laboratórios: 18 × 12;
- Neon & Lazer: 26 × 14.

Os gateways ganharam representação explícita com portal e indicação **ENTRAR NO SETOR**.

As quatro Vilas DS da F86 permanecem como distritos modulares. A hierarquia visual passa a privilegiar mundos/distritos e gateways sobre atrações e mobiliário.

## Caminhos e circulação

A malha de caminhos do Campus foi atualizada para não apontar para objetos que deixaram o hub:

- o antigo caminho de `lab-virtual` termina no gateway do Distrito de Laboratórios;
- antigas ligações de lazer Norte/Sul foram simplificadas em um acesso ao Parque Neon.

Isso reduz fiação visual e evita wayfinding para coordenadas sem destino ativo.

## Airdrop

As três novas áreas passam a ser zonas terrestres válidas de queda.

O catálogo de airdrop cresce de 12 para **15 setores terrestres**, mantendo Estação Orbital, Lua e Marte fora da lógica atmosférica.

A arquitetura F87 permanece: avião leve → mapa estratégico → salto → proxy do setor → prefetch de um único mundo → runtime completo no pouso.

## Multiplayer/backend

A migration `079_lobby_campus_modules.sql` adiciona:

- `campus-library`;
- `campus-labs`;
- `campus-neon`.

A Edge Function `lobby-presence` reconhece os três ambientes para presença, chat por proximidade, reunião de um aluno/todos e validação de área. Veículos exclusivos do Campus não podem ser usados para burlar mudança de mundo dentro dos módulos.

## Cache e desempenho

- versão: `14.10.8.90`;
- cache: `stage59-f88-campus-modules`;
- shell crítico validado com **68 itens / 0 ausentes**;
- **0 runtimes 3D** no shell crítico;
- `campus-module3d.js` permanece sob demanda;
- Campus não instancia mais as cinco experiências pesadas extraídas.

A F88 reduz trabalho permanente de render/interação/colisão, mas não apresenta um número artificial de ganho de FPS: medição visual/GPU real deve ser feita no hardware alvo após publicação.

## Gate técnico

- F88: **11/11 PASS**;
- JavaScript ESM + Service Worker: **139 arquivos / 0 erros sintáticos**;
- grafo do Lobby: **130 módulos / 398 imports locais / 0 ausentes**;
- shell crítico: **68 / 68 existentes, 0 runtimes 3D**;
- TypeScript da Edge Function: parser sem erro sintático; o `tsc` local acusa apenas resolução de ambiente Deno/`jsr:` e ausência do global `Deno`, esperadas fora do runtime Supabase.

## Regressões históricas

Os testes F82–F87 preservam os comportamentos centrais, mas alguns asserts históricos falham por exigirem literalmente versões, contagens de mundos/zonas e URLs anteriores. Não foram alterados para fabricar aprovação.

Resultados nesta árvore:

- F87: 5/10 (falhas: versão, 12→15 setores, 15→18 mundos/adapters e URLs/counts antigos);
- F86: 6/9 (versão e contagens/layout congelados em 15 mundos);
- F85: 8/11 (versão, proporções antigas e cache-bust anterior);
- F84: 8/10 (versão e antigo requisito de avião dentro do Campus 3D);
- F82: 6/8 (cache/versionamento histórico);
- O2 observabilidade: 7/7.

## Alterações em relação à F87

Implementação, antes da documentação de release:

- **5 arquivos novos**;
- **25 arquivos modificados**;
- **0 removidos**.

Novos arquivos funcionais:

- `core/database/079_lobby_campus_modules.sql`
- `core/tests/f88-campus-modules-v14.10.8.90.test.mjs`
- `lobby/assets/campus-module-lite.js`
- `lobby/assets/campus-module3d.js`
- `lobby/assets/world/campus-module-world.js`

## Limites conhecidos

- O código/metadata legado de alguns interiores antigos ainda existe para compatibilidade, mas não é instanciado pelos caminhos normais do Campus. Uma fase futura pode remover código morto definitivamente.
- A infraestrutura física de trilhos/estações ainda existe no Campus; desde a F85 o trem não circula ocioso, mas a rede visual não foi integralmente extraída nesta fase.
- O smoke visual automatizado em Chromium não é usado como evidência nesta release se o ambiente de sandbox não inicializar EGL/zygote. O gate se baseia em testes, parser ESM, grafo de imports e validação estrutural.

