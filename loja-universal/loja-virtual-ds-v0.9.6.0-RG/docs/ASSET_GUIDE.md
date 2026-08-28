# Guia de Assets — v0.3.0

## Contrato

- Ícones de UI: SVG 64×64, `currentColor` ou gradiente interno.
- Miniaturas de catálogo: WebP 512×512.
- Prévia de produto: SVG transparente com viewBox 512×512.
- Texturas: PNG e WebP 256×256.
- Assets pesados futuros: GLB/glTF 2.0 e KTX2.

## Pastas

- `assets/ui/icons`: navegação e ações.
- `assets/ui/coins`: estados da Carteira Virtual DS.
- `assets/ui/rarity`: molduras.
- `assets/ui/chests`: baús.
- `assets/ui/discounts`: 10, 25, 38, 60, 80, 99 e Grátis.
- `assets/items/thumbnails`: cards WebP.
- `assets/items/vectors`: prévias transparentes.
- `assets/materials`: materiais oficiais.

Nunca referenciar arquivos por posição de pasta. Use o catálogo e `assets/asset-manifest.json`.
