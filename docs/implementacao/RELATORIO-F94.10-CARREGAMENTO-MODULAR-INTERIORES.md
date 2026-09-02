# AGV World — F94.10
## Carregamento Modular + Interiores + Identidade Ambiental

**Base:** F94.9.1 — Hotfix Campus 3D  
**Versão:** v14.10.8.96  
**Cache:** `stage73-f9410-modular-streaming`  
**Backend:** inalterado

## Objetivo

A F94.10 inicia a migração do AGV World de ambientes monolíticos para uma arquitetura espacial modular. O foco desta fase é reduzir custo de cena e preparar os mundos para receber maior densidade visual sem exigir que todos os prédios, interiores e elementos detalhados permaneçam carregados simultaneamente.

A implementação foi deliberadamente iniciada pelo **Campus 3D**, porque ele é o ambiente central e porque a F94.9.1 acabou de estabilizar sua criação de runtime. Outros mundos recebem perfis ambientais nesta fase, mas não são declarados como totalmente migrados antes de terem seus próprios chunks implementados e testados.

## 1. SpatialStreamingManager

Foi criado `lobby/assets/core/streaming-v2/spatial-streaming-manager.js`.

O manager oferece:

- registro de chunks espaciais;
- `loadRadius` e `unloadRadius` independentes;
- histerese para evitar carregar/descarregar no limite a cada frame;
- prioridade;
- orçamento máximo de chunks carregados;
- chunks `always`;
- preload;
- pin temporário;
- carregamento e descarregamento assíncronos;
- diagnóstico de estado;
- tratamento de erro por chunk;
- `dispose()` global.

O descarregamento não é apenas `visible=false`. No Campus, os roots de setor são retirados da cena e o descarte percorre geometria, material e texturas associadas para permitir liberação efetiva dos recursos pelo runtime/GC.

## 2. Campus 3D dividido em setores

`campus-environment.js` foi reorganizado em duas camadas.

### Camada global permanente

Permanece ativa porque compõe a leitura espacial contínua do Campus:

- piso/base;
- rede urbana principal;
- vias e conexões;
- trilha de mobilidade;
- fonte central;
- cobertura/canopy;
- estações de trânsito;
- elementos globais necessários à navegação.

### Camada espacial modular

Passa a ser construída e liberada por proximidade:

- edifícios dos setores;
- raízes de experiências associadas aos setores;
- elementos do Hub e distritos modulares.

O Hub possui política `always`. Os demais distritos usam carregamento sob demanda por distância.

Variantes procedurais dos prédios são determinísticas por zona, evitando que um prédio mude de aparência ao descarregar e carregar novamente.

## 3. Colisão acompanha o streaming

A Camera V2 não trabalha mais com uma cópia congelada dos roots de colisão do ambiente. O Campus usa o array mutável do ambiente para que chunks recém-carregados passem a participar do conjunto de colisão e chunks descarregados sejam removidos dele.

Isso prepara a arquitetura para a futura integração com `three-mesh-bvh` e, depois, Rapier, sem manter colliders de setores inexistentes em memória.

## 4. Mirante 360°/50× preservado

O Mirante não pode observar um mundo do qual os setores distantes foram descarregados.

Por isso, quando o estado de Mirante ou visão de segurança está ativo, o Campus chama o streaming com `forceFull`. Todos os setores necessários ficam temporariamente carregados/pinados para a observação em longa distância.

Ao voltar à navegação convencional, o orçamento espacial volta a atuar.

## 5. Interiores sob demanda

A arquitetura existente de interiores lazy foi preservada e consolidada:

- interior é criado quando necessário;
- interior não precisa permanecer montado enquanto o aluno está no exterior;
- ao sair, roots interiores podem ser removidos/liberados;
- teleporte e saída atualizam imediatamente o streaming externo.

Nesta fase, um interior de múltiplos andares ainda pode construir seu conjunto interno de andares em uma única instância e alternar visibilidade. O descarregamento de geometria **por andar** fica para uma etapa posterior caso a medição mostre necessidade.

## 6. Iluminação local dos interiores

Foi adicionado orçamento de luz por nível gráfico.

Cada interior compatível recebe:

- `HemisphereLight` de preenchimento;
- PointLights locais;
- quantidade/intensidade dependentes da qualidade gráfica;
- accent coerente com o ambiente.

Isso reduz o problema de interiores escuros sem obrigar todos os níveis gráficos a manter o mesmo número de luzes dinâmicas.

## 7. Perfis de identidade ambiental

Foi criado `world-environment-profiles.js` com perfis para 11 famílias de mundos prioritários:

- Campus DS;
- Vale do Silício;
- Mundo Rural;
- Base Militar;
- Estação Espacial;
- Lua;
- Marte;
- Parque;
- Colégio AGV;
- Labirinto;
- Museu do Hardware.

Os perfis centralizam, inicialmente:

- identidade do ambiente;
- raio de streaming futuro;
- raio de unload;
- orçamento de chunks;
- iluminação;
- paleta-base.

**Importante:** nesta release, o Campus é a integração ativa completa do novo streaming. Os demais perfis são contrato de migração, não evidência de que os respectivos runtimes já estejam totalmente chunked.

## 8. Pipeline de assets preparado

O contrato de assets continua definindo:

- GLB/glTF;
- unidade em metros;
- eixo Y para cima;
- Meshopt preferencial para geometria;
- KTX2 preferencial para textura;
- sufixo `_COL` para colisão;
- `_LOD0`, `_LOD1`, `_LOD2` para níveis de detalhe.

A F94.10 **não tenta substituir todos os prédios procedurais por GLB de uma vez**. O objetivo é criar a infraestrutura correta para que a próxima fase possa acrescentar densidade visual sem recriar o problema de carregamento monolítico.

## 9. Observabilidade

O snapshot técnico do Campus passa a incluir estado do streaming:

- chunks registrados;
- carregados;
- carregando;
- erros;
- distância;
- política;
- pin;
- orçamento máximo.

O runtime também expõe `getStreamingState()` para diagnóstico.

## 10. Cache e atualização

O Service Worker passa para:

`stage73-f9410-modular-streaming`

Os lazy imports do Campus 3D usam o marcador:

`f9410-modular-streaming`

Os arquivos novos do streaming e perfis ambientais entram no shell opcional, evitando que uma funcionalidade de otimização volte a se tornar gate crítico de autenticação/boot.

## 11. Validação

Resultado local:

- F94.10: **8/8 PASS**;
- suíte atual selecionada (F94.8 + F94.9 + F94.9.1 + F94.10): **23/23 PASS**;
- JS do Lobby: **157 arquivos / 0 erros sintáticos**;
- imports locais: **428 / 0 ausentes**;
- referências locais do Service Worker: **83 / 0 ausentes**;
- `core/database`: **0 alterações**;
- `core/edge-functions`: **0 alterações**.

Não houve navegador WebGL real nesta sessão. Portanto, não é correto afirmar ganho percentual de FPS, memória ou qualidade visual. A validação visual/performance deve ser feita depois da publicação em máquina real.

## 12. Critérios de smoke test após deploy

No Campus 3D:

1. entrar no 3D e confirmar primeiro frame;
2. caminhar do Hub para dois distritos diferentes;
3. confirmar que edifícios aparecem antes da chegada e não piscam no limite;
4. voltar ao Hub;
5. entrar e sair de interior;
6. conferir iluminação interna em Econômico, Médio, Alto e Ultra;
7. abrir Mirante e testar 50× olhando setores distantes;
8. sair do Mirante e continuar andando;
9. abrir diagnóstico e conferir `streaming.loaded`, `errors=0` e estados dos chunks;
10. repetir no mobile/PC mais fraco para observar stutter de carga.

## 13. Próxima fase

**F94.11 — Qualidade Gráfica Real + Asset Streaming V2**

Prioridades propostas:

- Campus como referência visual;
- Vale e Rural como primeiros mundos de grande escala;
- asset loader central GLB/glTF;
- LOD real;
- Meshopt;
- KTX2/Basis;
- material/PBR coerente;
- vegetação e props instanciados;
- iluminação/decoração realmente diferentes por tier;
- budget de memória e asset residency;
- fallback procedural se asset não estiver disponível.

Depois: Vehicle Core + Rapier → NetworkManager → Colyseus no notebook.

**F95 permanece suspensa.**
