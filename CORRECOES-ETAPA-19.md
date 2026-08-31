# CORREÇÕES — ETAPA 19

## Polimento visual final do Lobby / Vale

Escopo desta etapa: atmosfera, céu, iluminação, distância visual e legibilidade de placas/rótulos no Lobby principal e no Vale do Silício, sem alterar física, rotas, interiores, autenticação, adaptações ou banco.

### Campus 3D

- placas e rótulos externos recebem distância de leitura (`labelCullDistance`);
- nomes completos deixam de permanecer visíveis em toda a extensão do Campus;
- atualização de visibilidade ocorre em baixa frequência, evitando custo desnecessário por frame;
- névoa agora acompanha o ciclo dia/noite;
- durante o dia a distância visual é mais aberta e a cor atmosférica acompanha o céu;
- à noite a névoa fica um pouco mais fechada, preservando leitura e profundidade;
- o culling visual permanece suspenso quando um interior modular está ativo.

### Vale do Silício 3D

- fundo escuro fixo substituído por sky dome atmosférico;
- céu, névoa, exposição e iluminação acompanham o ciclo temporal compartilhado do Lobby;
- atualização da atmosfera é limitada a intervalos de 30 s;
- distritos recebem acentos cromáticos discretos no piso, sem neon excessivo;
- placas de distritos, esportes e ambientes especiais passam a aparecer por proximidade;
- placas das empresas continuam respeitando seu LOD próprio;
- portal sul preserva distância maior de leitura para orientação.

### Vale do Silício 2D

- plano de fundo passa a usar a mesma paleta de céu/ciclo temporal do Lobby;
- estrelas aparecem somente quando o período noturno justifica;
- nomes de distritos aparecem por proximidade/zoom;
- nomes das 27 empresas deixam de aparecer todos simultaneamente;
- quando o nome completo está oculto, permanece um marcador discreto para preservar orientação.

### Compatibilidade

- o validador da Etapa 15 foi atualizado apenas para aceitar a nova chamada de culling dentro do mesmo bloco `if (!insideRuntime)`, mantendo a exigência de que atualizações externas parem dentro de interiores.
- nenhuma migration, Edge Function ou alteração de banco foi feita.

## Validação

- `validate-stage19-visual-polish.mjs`: **12/12 PASS**;
- regressões das Etapas 10–19: **PASS**;
- Cidade/Interiores/Cidade Viva/Mobilidade/Login Único: **PASS**;
- sintaxe de `lobby3d.js`, `vale3d.js` e `vale-lite.js`: **PASS**;
- suíte completa: **368/376 PASS**;
- as 8 falhas remanescentes são as mesmas da Etapa 18 e ficam fora deste escopo.
