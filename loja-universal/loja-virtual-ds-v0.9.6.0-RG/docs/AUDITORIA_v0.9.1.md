# Auditoria técnica e linha de base — Loja Virtual DS v0.9.1

## Resultado

**Status:** PASS_WITH_FINDINGS  
**Origem congelada:** v0.9.0  
**Natureza:** auditoria não destrutiva; nenhum item, animação, textura ou recurso visual foi removido.

## Inventário consolidado

- Arquivos: **776**
- Tamanho descompactado: **62.12 MB**
- Núcleo e assets de execução: **13.00 MB**
- Produtos: **71**
- Modelos GLB: **43**, todos estruturalmente válidos: **True**
- Modelos com animações: **4**
- Clips incorporados nos GLBs: **102**
- Efeitos VFX: **17**
- Falas: **8**
- Referências locais verificadas: **1676**
- Referências quebradas no runtime distribuído: **22**
- Referências históricas em logs/documentos: **52**
- Caminhos relativos do CSS-fonte que dependem da etapa de distribuição: **2**
- JavaScript com erro sintático: **0**
- JSON inválido: **0**

## Achados principais

1. **A base funcional está íntegra.** Catálogo, GLBs, VFX, adaptadores e SDK passaram nos validadores existentes e na nova auditoria.
2. **Os conteúdos de referência e capturas ocupam parcela expressiva do pacote.** `assets/concepts` e `assets/previews` são valiosos para documentação, mas não devem entrar no carregamento da aplicação.
3. **Existem duplicações exatas de arquivos de prévia e distribuição.** Elas permanecem nesta versão para preservar compatibilidade; a futura v0.9.3 deverá separar pacote de execução e pacote de documentação.
4. **Os GLBs atuais são pequenos e não usam extensões de compressão.** Isso cria uma boa base para o laboratório comparativo Meshopt/Draco da v0.9.2, sem substituir os originais.
5. **PNG e WebP coexistem intencionalmente.** Na próxima fase será medida a fidelidade e o custo real antes de escolher o formato por categoria.
6. **Não há KTX2/BasisU na base atual.** A conversão deve ocorrer em cópias de teste, validando materiais, alfa, emissivos e animações.
7. **A demonstração ainda concentra parte do runtime em scripts relativamente grandes e assets Base64 de fallback.** O code splitting e os pacotes serão tratados depois do laboratório de formatos.

## Maiores imagens

- `lab/formats/image-formats/style-guide-avatar-ui/reference.png` — 2.16 MB, 1448×1086
- `assets/concepts/vfx-animations.png` — 2.16 MB, 1448×1086
- `assets/concepts/accessories-items.png` — 2.04 MB, 1448×1086
- `assets/concepts/character-costumes.png` — 2.03 MB, 1448×1086
- `assets/concepts/style-guide-avatar-ui.png` — 1.92 MB, 1448×1086
- `assets/concepts/wallet-ui-flow.png` — 1.80 MB, 1448×1086
- `assets/previews/v0.9.5-benchmark-result.png` — 1.54 MB, 1440×3078
- `lab/formats/image-formats/style-guide-avatar-ui/style-guide-avatar-ui-webp-lossless.webp` — 1.53 MB, 1448×1086
- `assets/previews/v0.9.5-benchmark-mobile.png` — 1.21 MB, 390×6668
- `assets/previews/v0.9.4.3-realism-desktop.png` — 1.14 MB, 1440×1718
- `assets/previews/v0.9.5-benchmark-desktop.png` — 1.11 MB, 1440×2125
- `assets/previews/v0.3.0-assets.png` — 1.09 MB, 1440×1000

## Duplicações exatas relevantes

- 0.88 MB duplicados: `assets/previews/v0.8.0-desktop.png`, `preview-desktop.png`
- 0.83 MB duplicados: `assets/previews/v0.8.0-validation.png`, `preview-validation.png`
- 0.42 MB duplicados: `assets/previews/v0.8.0-mobile.png`, `preview-mobile.png`
- 0.35 MB duplicados: `assets/previews/v0.7.0-product-360.png`, `preview-store.png`
- 0.02 MB duplicados: `dist/ds-store-foundation.js`, `src/core/foundation.js`
- 0.01 MB duplicados: `dist/ds-store-sdk.js`, `src/sdk/ds-store-sdk.js`
- 0.01 MB duplicados: `assets/vfx/vfx-manifest.json`, `catalog/vfx.json`
- 0.00 MB duplicados: `assets/equipment/models/backpack-scholar.glb`, `lab/formats/glb-transfer/backpack-scholar/backpack-scholar.glb`

## Decisão de preservação

Nenhum arquivo foi apagado nesta fase. A linha de base registra hashes SHA-256 de todos os arquivos para detectar regressões e permitir rollback.

## Próxima fase autorizável

**v0.9.2 — Laboratório de formatos**: testar Meshopt, Draco, KTX2/BasisU, WebP e AVIF em amostras controladas, comparando tamanho, decodificação, memória, FPS e fidelidade visual antes de mudar o pipeline oficial.
