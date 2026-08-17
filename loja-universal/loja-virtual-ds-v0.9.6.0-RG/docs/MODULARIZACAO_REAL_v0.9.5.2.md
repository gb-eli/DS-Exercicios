# Modularização Real sem Perda Visual — v0.9.6.0-RG

## Garantia de fidelidade

Esta fase não recomprime, simplifica ou substitui nenhum GLB, material, preview, textura, clip ou VFX. Os recursos em `assets/avatars`, `assets/equipment` e `assets/vfx` foram comparados por SHA-256 com a v0.9.5.1.

- Assets comparados: 197
- Assets idênticos: 197
- Assets visuais alterados: 0

## Alterações de arquitetura

- Entrada inicial reduzida para scripts essenciais.
- Módulos opcionais são ES Modules carregados por `import()`.
- Avatar, preview 360°, VFX, benchmark, pacotes e SDK carregam somente quando solicitados.
- Cópias Base64 dos GLBs foram retiradas do runtime web e mantidas apenas em `dev/fallback-base64`.
- Os arquivos GLB originais continuam sendo buscados por `fetch` e armazenados pelo cache do navegador.
- CSS foi dividido em camadas com ordem de cascata fixa, preservando a aparência independentemente da ordem de carregamento.

## Redução do carregamento inicial

- JavaScript: 612153 → 185007 bytes (69.78% menor).
- CSS: 111914 → 73651 bytes (34.19% menor).

A redução vem da transferência adiada, não de perda de qualidade.


## Correções de confiabilidade

- O boot agora carrega configurações e estado em sequência antes de iniciar a interface.
- `DS_ECONOMY_CONFIG` e `DS_STORE_CONFIG` são publicados explicitamente.
- URLs de módulos dinâmicos são resolvidas por `document.baseURI`, mantendo compatibilidade com subpastas do GitHub Pages.
