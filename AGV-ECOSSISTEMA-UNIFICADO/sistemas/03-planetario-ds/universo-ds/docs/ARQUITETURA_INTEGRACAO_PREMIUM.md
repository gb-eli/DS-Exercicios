# Arquitetura — Integração Premium

```text
CosmosApp
   │
   ├── módulo imersivo original
   │      ├── simulação / Worker
   │      └── renderizador procedural
   │
   └── PremiumIntegrationOrchestrator
          ├── observa seleções com MutationObserver
          ├── resolve contexto e asset
          ├── escolhe LOD pelo perfil
          └── PremiumAssetOverlayRenderer
                 ├── PremiumAssetManager
                 ├── GlbGeometryParser
                 ├── HdrEnvironmentParser
                 ├── textura albedo/roughness
                 └── canvas WebGL2 transparente
```

## Responsabilidades

### `premiumIntegrationSystems.js`

Mantém mapeamentos puros de:

- veículo → asset;
- câmera → enquadramento;
- mundo → asset;
- peça do museu → asset.

### `PremiumIntegrationOrchestrator`

- detecta o laboratório ativo;
- monta e remonta a camada após re-renderizações;
- observa botões ativos;
- troca asset sem reiniciar a simulação;
- recarrega o LOD após mudança de qualidade;
- atualiza a HUD de diagnóstico;
- destrói observer, canvas e recursos.

### `PremiumAssetOverlayRenderer`

- cria contexto WebGL2 com alpha;
- carrega GLB, texturas e HDR;
- cria buffers, VAO e texturas;
- aplica iluminação PBR aproximada;
- desenha sobre o cenário procedural;
- trata perda/restauração de contexto;
- libera recursos de CPU e GPU.

## Princípios

- simulação nunca depende do GLB;
- asset não guarda estado de missão;
- troca de asset não reinicia Worker;
- falha gráfica mantém o procedural;
- todos os recursos são liberados ao sair;
- modelos continuam carregados sob demanda.
