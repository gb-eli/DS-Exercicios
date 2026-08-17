# Validação v0.9.2 — Laboratório de Formatos

## Resultado geral

**APROVADO** para servir como base da v0.9.3.

## Regressão preservada

- Suite consolidada: `PASS`.
- Verificações executadas: 10.
- Erros de sintaxe JavaScript: 0.
- Catálogo, assets, avatar, equipamentos, VFX, carteira e SDK permaneceram válidos.

## GLB

- Modelos analisados: 39.
- Volume original: 269376 bytes.
- Gzip: 58771 bytes, redução de 78.18%.
- Brotli: 47082 bytes, redução de 82.52%.
- Participação média do JSON: 77.16%.
- Amostras GLTF + BIN: 4.

## Imagens

- Fontes representativas: 8.
- Variantes válidas: 26.
- WebP lossless, q90 e q80: gerados e decodificados.
- AVIF q80: gerado em duas artes documentais de maior porte.
- Canal alfa: erro médio zero nas variantes testadas.

## Navegador

- Painel renderizado por Chromium via `set_content`.
- Erros de console: 0.
- Transbordamento horizontal móvel: False.
- Status visual: `PASS`.

## Limites honestos

Meshopt, Draco e KTX2/BasisU não foram convertidos neste ambiente por ausência dos encoders nativos. Esses formatos permanecem bloqueados por gate de validação. Nenhum asset oficial foi substituído.
