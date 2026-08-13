# Validação — Loja Virtual DS v0.9.1

## Escopo

Auditoria não destrutiva sobre a versão v0.9.0, preservando a experiência, os assets e a compatibilidade.

## Validações executadas

- Catálogo de 71 itens.
- Manifesto de assets.
- 39 arquivos GLB.
- 36 equipamentos e 16 slots.
- 17 VFX e 8 falas.
- SDK e dez adaptadores.
- Eventos idempotentes, fila offline e ponte `postMessage`.
- Sintaxe dos arquivos JavaScript.
- Parse dos arquivos JSON.
- Referências locais do runtime.
- Dimensões e peso das imagens.
- Duplicações exatas por SHA-256.
- Lock de todos os arquivos da v0.9.0.

## Resultado

**PASS.** Não foram encontrados arquivos GLB inválidos, erros sintáticos, JSON corrompido ou referências quebradas na distribuição utilizada pela demonstração.

## Achados que não quebram a versão

- Duas referências do CSS-fonte dependem do caminho final de distribuição; o CSS em `dist/` resolve corretamente.
- Logs históricos de testes contêm caminhos absolutos antigos. Eles são evidência documental e não são utilizados pelo runtime.
- Conceitos e capturas ocupam grande parte do ZIP e deverão ser separados do pacote de execução em fase futura.
- Existem duplicações exatas mantidas nesta versão para compatibilidade.
- Os GLBs ainda não utilizam Meshopt ou Draco.
- As texturas 3D ainda não utilizam KTX2/BasisU.

## Garantias

- Nenhum asset foi removido.
- Nenhum ID permanente foi alterado.
- Nenhuma regra financeira foi modificada.
- O SDK permanece na versão 0.9.0, compatível com a release auditada 0.9.1.
