# Atualização v14.10.8.45 — Fase C: Arquitetura e Ambiente

Data: 2026-08-28

## Objetivo

Elevar o Campus DS 3D da base funcional/procedural da v14.10.8.44 para uma arquitetura visual mais próxima do lobby futurista de referência, preservando Camera V2, presença online, portais, interiores, regras de atividade, fallback 2D e integração Supabase.

## Alterações principais

### 1. Novo módulo de ambiente

Criado `lobby/assets/world/campus-environment.js`.

O módulo agora concentra:

- piso e paisagismo-base do Campus;
- praça central;
- núcleo holográfico AGV;
- cobertura circular da praça;
- volumetria dos quatro prédios;
- fachadas e materiais arquitetônicos;
- iluminação-base do Campus;
- raízes de colisão de câmera dos prédios.

O `lobby3d.js` deixa de conter as implementações antigas de piso, prédio, fonte e cobertura, reduzindo duplicação e separando ambiente de gameplay.

### 2. Praça Central V2

A praça recebeu:

- diâmetro visual ampliado;
- três anéis concêntricos luminosos;
- oito trilhas radiais embutidas no piso;
- pavimentação procedural refinada;
- núcleo central em camadas;
- coluna holográfica;
- objeto icosaédrico central;
- três anéis holográficos animáveis;
- cobertura circular com oito apoios e dois anéis superiores.

A estrutura mantém as referências esperadas pelo loop atual (`pool`, `crown`, `rings`) para evitar regressão nas animações já existentes.

### 3. Prédios V2

Cada laboratório passou a ter uma fachada arquitetônica composta em vez de uma única caixa:

- podium/base;
- volume principal recuado;
- duas alas laterais;
- fachada frontal profunda;
- abertura central de entrada;
- marquise avançada;
- apoios cilíndricos;
- painéis de vidro em grade;
- montantes verticais;
- lâminas de vidro e luz;
- iluminação embutida;
- fechamento traseiro;
- coroamento superior em camadas;
- cobertura com acento luminoso.

### 4. Orientação correta das fachadas

O manifesto de mundo agora possui `buildingRotation`.

- 1DS e 2DS: fachada voltada para o centro a partir do lado norte;
- 3DS e SUB: rotação de `Math.PI`, voltando a fachada para a praça a partir do lado sul.

Isso corrige a leitura espacial quando a câmera orbita o Campus e melhora a coerência com as portas externas.

### 5. Materiais PBR escalonados por qualidade

Nas qualidades `high` e `ultra`, as superfícies de vidro podem utilizar `MeshPhysicalMaterial`, com:

- transmissão;
- espessura;
- IOR;
- clearcoat;
- transparência;
- emissivo controlado por turma.

Nos modos `low` e `medium`, o sistema mantém `MeshStandardMaterial`, evitando transformar a evolução visual em requisito de hardware.

### 6. Iluminação modular

Criada `createCampusLighting()` no módulo do ambiente.

A iluminação continua compatível com o ciclo de dia/noite existente e expõe:

- Hemisphere Light;
- luz direcional principal com sombras;
- luz direcional quente de preenchimento;
- Point Light central;
- luzes arquitetônicas de fachada apenas em High/Ultra.

### 7. Colisão atualizada

O envelope dos colliders externos foi ampliado para acompanhar a nova volumetria arquitetônica:

- largura: de aproximadamente ±8 para ±8.8;
- profundidade: de aproximadamente ±4.5 para ±4.9.

A Camera V2 usa as raízes reais dos novos prédios para raycast.

### 8. Preparação para GLB/glTF

Criados:

- `lobby/assets/world/environment-assets.js`;
- `lobby/assets/models/environment/README.md`.

Contrato preparado para próxima etapa:

- GLB/glTF 2.0;
- unidades em metros;
- eixo Y para cima;
- frente em -Z;
- Meshopt preferencial para geometria;
- KTX2/Basis para texturas;
- colisores com sufixo `_COL`;
- LODs `_LOD0`, `_LOD1` e `_LOD2`.

Os arquivos GLB continuam opcionais. A geometria procedural da Fase C é o fallback oficial e não depende deles para o lobby inicializar.

## Arquivos novos

- `lobby/assets/world/campus-environment.js`
- `lobby/assets/world/environment-assets.js`
- `lobby/assets/models/environment/README.md`
- `release-v14.10.8.45.json`

## Arquivos alterados

- `lobby/assets/lobby3d.js`
- `lobby/assets/world/campus-manifest.js`
- `lobby/assets/boot.js`
- `lobby/sw.js`
- arquivos de versionamento/cache para `14.10.8.45`
- `release-current.json`
- `repair-lobby.html`
- links de versão no Hub/Lobby

## Preservado

- Supabase e schema do banco;
- presença online;
- sincronização de usuários;
- modo professor/admin;
- portais;
- interiores 3D;
- interação com terminais;
- Camera V2;
- controles desktop/mobile;
- fallback Lobby Lite 2D;
- recuperação do Lobby;
- avatar GLB atual e fallback procedural.

## Próxima fase recomendada

**Fase D — Avatar/Personagens V2**:

1. integrar loader GLTF padrão local;
2. substituir o GLB mínimo por personagem visualmente mais completo;
3. Idle/Walk/Run/Jump e emotes por AnimationMixer;
4. cabelos, roupas, tênis, mochilas e acessórios por variantes;
5. LOD de personagem e orçamento de texturas;
6. preservar presença multiplayer atual.
