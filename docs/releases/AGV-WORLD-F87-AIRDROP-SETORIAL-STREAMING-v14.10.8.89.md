# AGV World F87 — Airdrop Setorial + Streaming Real

**Versão:** 14.10.8.89  
**Build:** stage58-f87-airdrop-sectors  
**Base:** F86 v14.10.8.88  
**Data:** 01/09/2026

## Objetivo

A F87 transforma o início aéreo em um fluxo modular. O avião não depende mais do Campus 3D completo, e a descida não exige que todos os mundos sejam carregados ao mesmo tempo.

Fluxo final:

1. equipe inicia a partida aérea;
2. participantes entram no runtime aéreo leve;
3. abre o mapa estratégico 2D;
4. cada participante escolhe a zona de queda;
5. ao saltar, somente o proxy do setor escolhido é mantido;
6. abaixo de 56 m, somente o módulo 3D do destino escolhido começa a ser pré-carregado;
7. no pouso, o runtime aéreo é removido e o mundo completo escolhido é montado;
8. os demais mundos permanecem descarregados.

## Zonas atmosféricas

A F87 possui 12 zonas terrestres de pouso:

- Campus DS;
- Vila 1DS;
- Vila 2DS;
- Vila 3DS;
- Vila SUB;
- Vale do Silício AGV;
- Mundo Rural AGV;
- Base de Operações AGV;
- Parque de Diversões AGV;
- Colégio AGV;
- Labirinto com Armadilhas;
- Museu do Hardware AGV.

Estação Orbital, Lua e Marte ficam fora do airdrop atmosférico e continuam ligados ao sistema de navegação espacial.

## Avião leve

Uma correção importante foi aplicada antes do fechamento da release: o próprio voo agora roda no `airdrop-transit3d.js`, em qualidade baixa e com geometria procedural reduzida. O sistema não abre mais o `lobby3d.js` completo apenas para colocar os usuários no avião.

O avião apresenta:

- rota sincronizada por sessão;
- posição e direção compartilhadas;
- participantes visíveis no mesmo avião;
- mapa estratégico 2D em modal amplo;
- nenhuma pré-carga de mundo 3D enquanto o jogador ainda não saltou.

## Streaming durante a queda

A descida possui quatro estágios:

- **Visão geral:** proxy simples e identificação do setor;
- **Distrito:** vias/proxies principais;
- **Detalhe local:** POIs procedurais leves;
- **Pré-carga do destino:** abaixo de 56 m o JavaScript 3D de apenas um mundo é carregado em memória de módulo, sem instanciar seu renderer.

O mundo real só é montado no pouso.

Configuração principal:

- altitude inicial: 96 m;
- visão de distrito: abaixo de 65 m;
- início de prefetch: 56 m;
- proxy detalhado: abaixo de 34 m;
- abertura automática do paraquedas: 24 m.

## Multiplayer do airdrop

O canal Realtime rápido da F85 foi estendido com:

- `airdropTargetWorldId`;
- `airdropX`;
- `airdropZ`.

Durante o voo todos os participantes da sessão podem aparecer no mesmo avião. Após o salto, usuários que escolheram a mesma zona permanecem visíveis entre si durante queda livre e paraquedas.

A presença persistente do banco continua independente do estado efêmero de animação/movimento.

## Mapa estratégico

O mapa de queda usa posições próprias e espaçadas para evitar a distorção que fazia submapas parecerem menores que atrações isoladas. As quatro Vilas DS aparecem como distritos reais e fazem parte do mesmo contrato modular criado na F86.

## Performance

A F87 mantém as otimizações anteriores e acrescenta:

- avião fora do Campus 3D completo;
- nenhum runtime `*3d.js` no shell crítico do Service Worker;
- `airdrop-transit3d.js` fora do shell crítico;
- `world-runtime-prefetch.js` fora do shell crítico;
- prefetch de apenas um destino por jogador;
- unload do runtime aéreo antes de montar o destino completo.

## Backend

A F87 não adiciona migration nova ao atualizar a partir da F86.

Ela depende dos contratos já existentes, principalmente:

- 077 — sessões de airdrop;
- 078 — áreas das Vilas modulares.

## Validação

Gate específico F87:

- 10/10 testes aprovados.

Estrutura:

- 15 mundos persistentes;
- 14 conexões estruturais;
- 12 zonas atmosféricas;
- 3 mundos orbitais excluídos do paraquedas.

Validações adicionais no fechamento:

- sintaxe JS de aplicação e Service Worker;
- grafo de imports locais sem arquivos ausentes;
- módulos 3D selecionados importáveis como ESM;
- nenhum `3d.js` no shell crítico;
- integridade do ZIP.

O smoke visual automatizado via Chromium permaneceu inconclusivo no ambiente de execução por falha de DBus/zygote. Portanto ele não é contabilizado como teste visual aprovado.

## Regressões históricas

Os testes históricos fecham em:

- F86: 8/9 — somente versão/cache antigo;
- F85: 10/11 — somente versão/cache antigo;
- F84: 8/10 — versão antiga + um assert que exige especificamente que o avião rode dentro do Campus 3D; na F87 isso foi intencionalmente substituído pelo runtime aéreo leve;
- F82: 6/8 — dois asserts históricos de versionamento/cache.

Os testes antigos O3–O5 também congelam quantidades de mundos, conexões e hashes anteriores às Vilas/backend atuais.

Esses asserts históricos não foram reescritos para simular aprovação.

## Próxima fase sugerida

F88 — Fragmentação adicional do Campus:

- Biblioteca;
- Área Neon/lazer;
- laboratórios e espaços de alta densidade;
- setores especiais;
- assets/LOD próprios por submapa;
- spawn de veículos generalizado por mundo;
- melhoria visual mapa a mapa com orçamento de performance por dispositivo.
