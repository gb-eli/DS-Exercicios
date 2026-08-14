# 1DS Core - v1.9.2

Núcleo compartilhado da Central 1º DS.

Nesta etapa, o núcleo centraliza:
- tokens visuais e layout-base (`core.css`);
- contrato de armazenamento (`storage.js`);
- download seguro por Blob (`downloads.js`);
- utilitários mínimos de acessibilidade (`a11y.js`);
- contrato comum de autenticação/usuário/disciplina (`auth-contract.js`);
- inicialização do core (`core.js`).

A implementação específica dos exercícios permanece dentro de cada disciplina. A extração é progressiva para evitar regressões.
