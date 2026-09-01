# AGV World F90 — Qualidade Gráfica Modular

**Release:** v14.10.8.92  
**Build:** 14.10.8.92-stage61-f90-graphics  
**Data:** 2026-09-01  
**Base:** F89 v14.10.8.91

## Objetivo

A F90 inicia a evolução gráfica por fases sem desfazer os ganhos de desempenho das F85–F89. A estratégia é separar qualidade visual em camadas progressivas, mantendo uma base barata para dispositivos modestos e liberando detalhes adicionais somente quando o perfil gráfico e a distância justificarem o custo.

Esta fase melhora o núcleo visual compartilhado, o Avatar V2, o Campus, as Vilas DS e os módulos Biblioteca/Laboratórios/Neon. Os demais mundos recebem a nova fundação compartilhada de avatar/performance e cache-bust coerente; a modernização ambiental específica de Vale, Rural, Base, Orbital, Lua, Marte, Parque e Museu continua nas próximas fases.

## Perfis gráficos compartilhados

Novo módulo `lobby/assets/render/visual-quality-profile.js` centraliza:

- Econômico / `low`;
- Médio / `medium`;
- Alto / `high`;
- Ultra / `ultra`;
- DPR progressivo;
- sombras por perfil;
- anisotropia;
- densidade de vegetação;
- nível de detalhe;
- exposição;
- contenção automática de efeitos caros em aparelhos móveis modestos e em `saveData`.

O modo Automático continua conservador e orientado ao hardware. Uma escolha manual explícita, porém, deixa de ser silenciosamente rebaixada no carregamento inicial: Alto/Ultra são respeitados e o controlador adaptativo continua podendo reduzir qualidade posteriormente se a performance realmente cair.

## Avatar V2

O avatar procedural ganhou camadas progressivas:

### Médio

- sobrancelhas;
- boca;
- gola/acabamento facial adicional.

### Alto / Ultra

- costura e detalhe frontal da camiseta;
- detalhes de mangas;
- sola/calçado com acabamento adicional;
- sombras e acessórios condicionados por qualidade e distância.

A atualização ocorre pelo mesmo Avatar V2 utilizado pelos mundos integrados. A troca de qualidade reaplica o nível visual aos avatares já existentes sem exigir recarregar o mundo.

Também foi corrigido o rastreamento de avatares durante atualização de aparência para evitar retenção indevida do objeto substituto.

## Campus 3D

As fachadas do Campus agora têm camadas de detalhe por perfil:

- base barata em todos os perfis;
- marquises e acentos extras no Médio;
- painéis solares e brises no Alto;
- antenas, balizadores e elementos de cobertura no Ultra.

As marcações repetidas de pista foram convertidas para `THREE.InstancedMesh`, reduzindo a necessidade de meshes independentes. Elementos viários premium e sinalização/luzes visuais adicionais só entram nos perfis mais altos.

A qualidade pode ser alterada em runtime: ambiente, Avatar V2, portais, DPR, exposição e sombras são atualizados sem reconstruir todo o Campus.

## Vilas e módulos do Campus

Foi corrigida uma inconsistência funcional das fases anteriores: `village3d.js` e `campus-module3d.js` tinham interface de qualidade, mas a troca praticamente não alterava o renderer/cena.

Na F90, `setQuality()` passa a atualizar realmente:

- DPR;
- exposição;
- sombras;
- detalhes de fachada;
- detalhes de ruas;
- vegetação e mobiliário premium;
- qualidade visual do avatar.

Isso vale para as quatro Vilas DS e para Biblioteca, Laboratórios e Neon/Lazer.

## Desempenho e carregamento

A F90 preserva a arquitetura modular das fases anteriores:

- 18 mundos;
- 18 adapters;
- 17 conexões estruturais;
- 15 zonas terrestres de airdrop;
- runtimes 3D continuam fora do shell crítico;
- Campus/Vale continuam lazy;
- Vilas e módulos continuam carregados sob demanda;
- airdrop continua pré-carregando somente o setor escolhido.

O módulo visual compartilhado é pequeno e foi colocado no shell **opcional**, não no crítico.

### Impacto no shell crítico

| Release | Bytes locais únicos no shell crítico |
|---|---:|
| F89 | 1.106.556 |
| F90 | 1.108.902 |
| Diferença | +2.346 (+0,21%) |

O acréscimo é pequeno e ocorre principalmente pelo novo comportamento de qualidade do Avatar V2. O shell continua com **0 runtimes `*3d.js`**.

## Cache e versionamento

- release: `v14.10.8.92`;
- build: `14.10.8.92-stage61-f90-graphics`;
- Service Worker atualizado;
- imports dos runtimes/hosts que usam Avatar V2 ou performance foram cache-bustados para F90;
- `PUBLIC-DEPLOY.json` atualizado para fase 90.

## Validação F90

### Gate específico

**F90: 10/10 PASS**

O gate cobre:

1. versão/cache F90;
2. perfis visuais progressivos e contenção mobile;
3. respeito a qualidade manual explícita;
4. Avatar V2 com camadas de detalhe e LOD visual;
5. fachadas/ruas do Campus e instancing;
6. alteração de qualidade em tempo real no Campus;
7. alteração real de qualidade em Vilas/módulos;
8. cache-bust dos hosts/runtimes modificados;
9. nenhum runtime 3D no shell crítico;
10. preservação da topologia modular, airdrop, Realtime e velocidade padrão.

### Observabilidade

**O2: 7/7 PASS**

A instrumentação de FPS, renderer, buffers, texturas e snapshots de performance permanece funcional.

### JavaScript / ESM / imports

- arquivos JS/SW verificados: **141**;
- erros sintáticos: **0**;
- imports locais verificados: **411**;
- imports locais ausentes: **0**;
- runtimes/hosts 3D principais importados como ESM: **15/15**.

### Service Worker

- URLs críticas: **67**;
- arquivos críticos locais únicos: **66**;
- críticos ausentes: **0**;
- runtimes 3D no shell crítico: **0**;
- opcionais verificados: **8**;
- opcionais ausentes: **0**.

## Testes históricos

Os validadores F82–F89 antigos preservam asserts literais de versão, quantidade de mundos, cache-busts ou topologias daquele momento. Eles não foram alterados para fabricar aprovação após a evolução arquitetural.

A regressão mais próxima, F89, mantém **10/11**, falhando somente no assert que exige literalmente `14.10.8.91`. O O2 permanece 7/7.

## Smoke visual

Foi tentado Chromium headless contra o Lobby F90. O processo expirou sem produzir DOM/screenshot e registrou erros de infraestrutura `DBus/zygote` na sandbox. Portanto o smoke visual automatizado é **inconclusivo** e não está sendo declarado como aprovado.

## Backend

A F90 **não cria migration nova nem exige alteração de backend**.

Ambientes já atualizados até a F88/F89 (migration 079 + Edge Function consolidada) precisam apenas de frontend/Service Worker F90. Ambientes anteriores devem primeiro concluir as migrations e Edge Functions exigidas pelas fases anteriores.

## Próximas fases gráficas sugeridas

A fundação desta release permite evoluir os ambientes sem duplicar lógica de qualidade. As próximas fases podem modernizar, em grupos:

- Vale + Rural;
- Base de Operações;
- Estação Orbital + Lua + Marte;
- Parque de Diversões;
- Museu;
- Colégio/Labirinto;
- materiais/texturas/GLB otimizados, LODs e KTX2/Draco/Meshopt quando houver assets adequados.
