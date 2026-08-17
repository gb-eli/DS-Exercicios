# Museu do Fliperama DS — v0.32.0

O museu usa uma arquitetura em camadas:

1. **Vista 2D:** SVG local e leve, disponível imediatamente.
2. **360° procedural:** módulo Canvas importado somente após ação do usuário.
3. **GLB/glTF futuro:** modelo real opcional indicado no catálogo, com fallback automático.

Nenhuma imagem ou modelo pesado é antecipado na abertura do portal.

## Catálogo

`data/catalog.json` é a fonte de caminhos e capacidades visuais. Cada registro informa grupo, imagem, situação do modelo, forma procedural e cores de apresentação.

## Regras para futuros modelos

Consulte `models/README.md`. Um modelo nunca poderá substituir a vista 2D obrigatória nem bloquear aparelhos sem WebGL.
