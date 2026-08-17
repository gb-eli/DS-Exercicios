# Pipeline de Compressão 3D — v0.9.6.0-RG

## Política

A otimização desta versão é sem perdas. Os 39 GLBs originais foram preservados e receberam variantes Gzip para transferência. O navegador descompacta o arquivo e confere o SHA-256 antes da renderização.

## Resultado

- GLBs: 39
- Tamanho original: 420084 bytes
- Transferência Gzip: 72722 bytes
- Redução: 82.69%
- Fidelidade: byte a byte após descompactação

## Fallback

Quando `DecompressionStream('gzip')` não está disponível ou a validação falha, o runtime busca o GLB original.

## Meshopt e KTX2

Nenhuma variante Meshopt/KTX2 foi publicada sem toolchain nativa e inspeção visual. Os GLBs atuais não possuem imagens de textura incorporadas, portanto KTX2 será aplicado quando existirem mapas PBR reais.
