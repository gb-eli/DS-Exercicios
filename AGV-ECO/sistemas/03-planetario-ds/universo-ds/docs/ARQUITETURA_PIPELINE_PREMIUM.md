# Arquitetura do Pipeline Premium

## Fluxo

```text
manifest.json
    ↓
PremiumAssetManager
    ├── seleção de LOD
    ├── carregamento sob demanda
    ├── cache em memória
    └── diagnóstico
    ↓
GlbGeometryParser
    ├── POSITION
    ├── NORMAL
    ├── COLOR_0
    └── índices
    ↓
PremiumAssetSceneRenderer
    ├── buffers GPU
    ├── PBR aproximado
    ├── triplanar mapping
    ├── ambiente HDR
    ├── câmera 360°
    ├── corte técnico
    └── modos diagnósticos
```

## Componentes

### `PremiumAssetManager`

Responsável por manifesto, escolha do LOD, download, cache em RAM, texturas, ambiente e métricas de carregamento.

### `GlbGeometryParser`

Parser GLB 2.0 sem dependência externa. Suporta os atributos usados pelo starter pack:

- `POSITION`;
- `NORMAL`;
- `COLOR_0`;
- índices `UNSIGNED_SHORT` ou `UNSIGNED_INT`;
- bufferViews intercaladas ou contíguas;
- cores normalizadas.

### `HdrEnvironmentParser`

Leitor Radiance RGBE com suporte a pixels planos e scanlines RLE. Converte o ambiente para `Float32Array`.

### `AssetPackCache`

Armazena seletivamente:

- três GLBs;
- textura de albedo;
- textura de roughness;
- ambiente HDR.

### `PremiumAssetSceneRenderer`

Renderizador WebGL2 com:

- câmera orbital;
- projeção em perspectiva;
- iluminação direta;
- reflexão de ambiente;
- PBR aproximado;
- raio X;
- normais;
- mapa térmico;
- corte técnico;
- fullscreen;
- fallback 2D;
- descarte explícito de recursos.

## Contrato de substituição futura

Um artista pode substituir um arquivo GLB desde que preserve:

- ID do asset;
- orientação e unidade documentadas;
- presença de posição, normal e índices;
- limites de tamanho do LOD;
- entrada correspondente no manifesto.

O portal não precisa ser reescrito.

## Política de assets

- formato final: GLB/glTF 2.0;
- origem no centro do objeto;
- transformações aplicadas antes da exportação;
- materiais reutilizados sempre que possível;
- LODs com complexidade crescente;
- texturas WebP como fallback;
- slot futuro para KTX2/BasisU;
- colisores e hierarquias serão adicionados quando um módulo exigir física detalhada.
