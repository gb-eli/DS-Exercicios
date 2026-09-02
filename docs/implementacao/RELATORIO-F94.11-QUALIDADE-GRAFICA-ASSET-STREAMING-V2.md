# AGV World — F94.11
## Qualidade Gráfica Real + Asset Streaming V2

**Base:** F94.10 — Carregamento Modular + Interiores + Identidade Ambiental  
**Versão:** v14.10.8.96  
**Cache:** `stage74-f9411-graphics-streaming`  
**Backend:** inalterado  
**Escopo ativo desta fase:** Campus, Vale do Silício e Mundo Rural

## Objetivo

A F94.11 transforma os níveis Econômico, Médio, Alto e Ultra em perfis gráficos com diferenças estruturais e não apenas diferenças de resolução. A fase também introduz o primeiro pipeline real de assets GLB com LOD carregado e descartado em runtime, preservando os ambientes procedurais existentes como fallback.

A implementação foi mantida incremental. Three.js continua sendo o renderer; Rapier, Colyseus, Meshopt e KTX2 não foram introduzidos como dependências obrigatórias nesta fase.

## 1. Quality Feature Matrix V2

Foi criado `lobby/assets/render/quality-feature-matrix.js`.

A matriz passa a controlar explicitamente:

- tier de material;
- uso de `MeshPhysicalMaterial` quando permitido;
- clearcoat e transmissão de vidro;
- reflexos e detalhe normal;
- orçamento de sombras;
- partículas;
- densidade de props e vegetação;
- decals;
- detalhes animados;
- tamanho máximo de textura;
- viés de mip/LOD;
- orçamento aproximado de memória visual;
- quantidade máxima de luzes dinâmicas.

Perfis-base:

| Perfil | Material | Textura máxima | Orçamento visual | LOD bias | Luzes dinâmicas |
|---|---:|---:|---:|---:|---:|
| Econômico | tier 0 | 512 px | 96 MB | 1,55 | 2 |
| Médio | tier 1 | 1024 px | 160 MB | 1,15 | 5 |
| Alto | tier 2 / físico | 2048 px | 256 MB | 0,82 | 10 |
| Ultra | tier 3 / físico | 4096 px | 384 MB | 0,62 | 18 |

Em dispositivos restritos, `saveData`, memória baixa, poucos núcleos ou mobile podem reduzir dinamicamente esses tetos sem mudar a escolha visual feita pelo usuário.

## 2. Materiais realmente mudam em runtime

Antes, parte da mudança de qualidade podia apenas esconder ou exibir objetos já construídos com o mesmo material. Nesta fase, materiais criados pelo helper gráfico recebem um `agvQualitySpec` e podem ser reconstruídos quando o perfil muda.

Isso permite, por exemplo:

- Médio permanecer em `MeshStandardMaterial`;
- Alto/Ultra utilizar material físico em superfícies compatíveis;
- Ultra habilitar maior transmissão/clearcoat em vidro;
- sombras e recepção de sombra acompanharem o orçamento do tier.

A troca não exige recarregar o mundo inteiro.

## 3. Visual Asset Budget V2

Foi criado `visual-asset-budget.js`.

Cada mundo integrado possui um orçamento de assets visuais, com:

- reserva e liberação estimada de bytes;
- pressão de memória observável;
- política de textura;
- escolha de LOD por distância e qualidade;
- diagnóstico de pico/uso;
- preferência declarada por Meshopt e KTX2 para packs futuros.

A escolha de LOD é propositalmente diferente por qualidade. Um objeto próximo pode ser LOD2 no Econômico, LOD1 no Médio e LOD0 no Alto/Ultra.

## 4. Primeiro Asset Streaming V2 com GLB real

Foi criado `world-detail-asset-streamer.js` com um loader GLB leve e local.

O streamer:

- registra slots por mundo;
- mede distância ao jogador;
- escolhe LOD conforme qualidade;
- carrega o GLB necessário;
- troca LOD quando necessário;
- remove o root antigo;
- descarta geometria/material ao sair do raio;
- atualiza a escolha quando a qualidade muda;
- oferece diagnóstico por mundo.

O Mirante/visão de longa distância não força LOD0 em máquinas fracas. Ele força disponibilidade do asset, mas respeita o melhor LOD permitido pelo perfil gráfico atual.

## 5. Assets GLB incluídos

A F94.11 inclui nove GLBs locais, todos GLB 2.0 válidos e parseados pelo runtime local.

| Asset | Tamanho | Meshes | Triângulos |
|---|---:|---:|---:|
| Campus kiosk LOD0 | 11.252 B | 7 | 392 |
| Campus kiosk LOD1 | 4.064 B | 5 | 60 |
| Campus kiosk LOD2 | 2.684 B | 3 | 36 |
| Vale pylon LOD0 | 12.468 B | 7 | 444 |
| Vale pylon LOD1 | 3.424 B | 3 | 64 |
| Vale pylon LOD2 | 2.736 B | 2 | 52 |
| Rural wind turbine LOD0 | 7.312 B | 6 | 176 |
| Rural wind turbine LOD1 | 5.568 B | 4 | 136 |
| Rural wind turbine LOD2 | 3.844 B | 2 | 112 |

Esses primeiros assets são **texture-free** e utilizam fatores PBR de metallic/roughness. Por isso KTX2 ainda não é aplicável a eles. A geometria também está sem compressão Meshopt nesta primeira passagem.

**Não considerar F94.11 como evidência de Meshopt/KTX2 já ativos.** A infraestrutura e a preferência estão prontas; a conversão real entra com os packs texturizados de produção.

## 6. Campus

O Campus mantém o `SpatialStreamingManager` da F94.10 e adiciona:

- quatro smart kiosks GLB na praça central;
- LOD real por qualidade/distância;
- orçamento visual integrado ao orçamento dos setores procedurais;
- material factory consciente do tier;
- camadas extras progressivas por qualidade;
- detalhes Ultra com animação em tempo real;
- diagnóstico separado de streaming espacial e de assets visuais.

A integração preserva o hotfix F94.9.1 de criação do runtime do Campus 3D.

## 7. Vale do Silício

O Vale recebe:

- quatro pylons de inovação em GLB LOD0/1/2;
- streamer anexado ao `worldRoot`, portanto ocultado corretamente ao entrar em interiores;
- material-aware quality;
- LOD de edifícios guiado pelo mesmo Asset Budget;
- camada Médio com elementos adicionais;
- camada Alto com painéis de vidro;
- camada Ultra com halos holográficos animados.

Isso inicia a redução da sensação de mapa grande/genérico sem transformar o Vale em um bloco monolítico pesado.

## 8. Mundo Rural

O Rural recebe:

- duas turbinas eólicas GLB em LOD0/1/2;
- streamer anexado ao `worldRoot`;
- orçamento visual e LOD por qualidade;
- camadas progressivas de bancos/arbustos, iluminação e fireflies;
- detalhes Ultra animados em runtime.

O número de animais e a densidade de conteúdo rural ainda são tarefas de conteúdo posteriores; F94.11 cria a infraestrutura para adicioná-los de forma escalável.

## 9. Service Worker e boot

O cache atual é:

`stage74-f9411-graphics-streaming`

Os novos módulos gráficos e GLBs entram no `OPTIONAL_SHELL`, e não no `CRITICAL_SHELL`.

Isso é deliberado: falha ou ausência de um detalhe GLB não deve bloquear login ou inicialização do Lobby, seguindo a correção arquitetural feita na F94.5.1.

## 10. Validação técnica

Resultados da fase:

- F94.11: **10/10 PASS**;
- 162 arquivos JS do Lobby: **0 erros sintáticos**;
- 444 referências de import local detectadas: **0 ausentes**;
- 104 referências locais do Service Worker: **0 ausentes**;
- 9 GLBs: válidos, parseados pelo loader local;
- Camera V2 preservada;
- Interaction V2 preservada;
- hotfix Campus 3D preservado;
- nenhuma alteração em `core/database`;
- nenhuma alteração em `core/edge-functions`.

Regressão selecionada F94.7/F94.8/F94.9/F94.9.1/F94.11: **22/26 PASS**. As quatro falhas são asserts históricos que exigem literalmente cache-bust/version markers antigos. Os testes funcionais atuais de câmera, interação, Campus 3D e F94.11 passam.

O teste legado F94.10 ficou **7/8 PASS**; a única falha também exige o marcador exato da F94.10, substituído intencionalmente pela F94.11.

## 11. Limitações e verdade de validação

Não houve execução visual WebGL real nesta sessão. Portanto:

- não há medição confiável de ganho de FPS;
- não há percentual declarado de economia de VRAM;
- não se declara a experiência visual como final;
- não se declara Meshopt/KTX2 ativos;
- não se declara todos os mundos migrados para Asset Streaming V2.

A integração ativa desta fase é **Campus + Vale + Rural**.

## 12. Próximo passo recomendado

Após smoke visual real da F94.11, a sequência técnica recomendada é:

**Vehicle Core V2 → Rapier por subsistema → expansão de assets/identidade por mapa → NetworkManager → Colyseus no notebook.**

Caso o smoke mostre que a diferença de qualidade ainda precisa de maior impacto visual antes da física, pode ser feita uma F94.11.x/F94.12 dedicada a packs de ambiente texturizados e vegetação/props instanciados, sem alterar a arquitetura.
