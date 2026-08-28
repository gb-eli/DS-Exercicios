# Arquitetura da Fundação Universal

## Fonte da verdade

- Catálogo: `catalog/items.json`.
- Regras econômicas: `config/economy.config.json`.
- Saldo: derivado das transações autorizadas do livro-caixa.
- Inventário: cada item deve ter uma compra, recompensa ou concessão correspondente.

## Limites entre módulos

1. A plataforma emite um evento educacional.
2. O adaptador transforma o evento para o contrato DS.
3. A carteira valida tipo, valor, identificador e origem.
4. O evento é registrado no livro-caixa.
5. A interface reage ao estado da transação.
6. O módulo 3D nunca altera saldo ou regras de compra.

## Política de assets

- Modelos finais: GLB ou glTF 2.0.
- Compressão: Meshopt como padrão; Draco quando adequado.
- Texturas 3D: KTX2/BasisU.
- Pré-visualizações: WebP; transparência: PNG.
- UI: SVG e CSS.
- Pivôs, unidades, nomes de ossos e slots devem ser consistentes.
- LOD 0–3 e descarte explícito de recursos WebGL.
