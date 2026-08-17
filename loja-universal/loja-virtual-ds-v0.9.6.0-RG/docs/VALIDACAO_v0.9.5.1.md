# Validação v0.9.5.1

## Resultado

- Regressão: **PASS** em 15 grupos.
- Erros de sintaxe JavaScript: **0**.
- Pacotes executáveis: **7**.
- Referências quebradas no runtime: **0**.
- Arquivos no runtime GitHub Pages: **426**.
- Projeto completo: **54.34 MB**.
- Runtime GitHub Pages: **5.27 MB**.
- Redução do conteúdo publicado: **90.31%**.
- Assets visuais de desenvolvimento separados: **49.06 MB**.

## Contratos gráficos

Ultra e Realismo foram corrigidos para representar apenas recursos realmente disponíveis. A versão não afirma KTX2, HDR/IBL, texturas 4K ou família 3D premium concluída.

## Integridade

Todos os manifestos dos pacotes foram conferidos por tamanho e SHA-256. Concept arts e capturas históricas não aparecem no gerenciador nem no pacote GitHub Pages.

## Teste HTTP

O runtime foi servido em `127.0.0.1` e retornou HTTP 200 para a entrada, CSS, JavaScript principal, manifesto de pacotes, cenário cinematográfico e GLB LOD0. O CSS foi confirmado pelo token `--cyan:#2ad7ff`.

A tentativa de captura automatizada com Chromium headless ficou bloqueada até o timeout do ambiente. Portanto, esta validação confirma estrutura, recursos, HTTP e regressão, mas não afirma uma nova inspeção visual automatizada do WebGL nesta execução.
