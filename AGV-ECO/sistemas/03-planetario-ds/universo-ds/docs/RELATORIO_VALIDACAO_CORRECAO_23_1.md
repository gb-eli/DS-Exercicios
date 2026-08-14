# Relatório de validação — Correção 23.1

## Problema reproduzido pela captura

A interface do Lançamento Imersivo abria, mas a camada premium exibia `Failed to fetch` e não mostrava o GLB. O erro vinha do carregamento do manifesto ou dos arquivos binários em uma prévia de editor móvel.

## Alterações validadas

- resolução de URLs baseada em `import.meta.url`;
- caminhos alternativos a partir da raiz e da página;
- Cache API, Fetch e XMLHttpRequest;
- falha da camada premium isolada da simulação;
- fallback visual local por família de asset;
- nova tentativa pelo badge;
- cache do carregador no Service Worker;
- regressão integral das Fases 1 a 23.

## Resultados

- 144 arquivos JavaScript validados;
- 24 módulos disponíveis;
- 20 renderizadores auditados;
- todos os testes automatizados aprovados;
- manifesto, GLB e HDR respondendo HTTP 200;
- pacote completo e incremental verificados.

## Limite conhecido

Editores que abrem o projeto diretamente por `file://` ou `content://` podem impedir Workers, áudio, Cache API ou binários mesmo com XHR. Nessa situação, a versão 23.1 mantém o modelo local e o cenário procedural. Para GLB/PBR/HDR completos, usar GitHub Pages ou servidor HTTP.
