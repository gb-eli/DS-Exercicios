# Auditoria de duplicidade — v14.10.8.37

A v14.10.8.36 continha duas árvores concorrentes do frontend: raiz e `core/`, além de `core/core/`.

Conflitos confirmados antes da limpeza:

- `index.html` raiz: assets centrais em v14.10.8.36.
- `core/index.html`: referências ainda em v14.10.8.18, v14.10.8.19.1 e v14.10.8.28.
- `lobby/assets/boot.js` e `core/lobby/assets/boot.js`: conteúdo divergente.
- `prova/` e `core/prova/`: quatro arquivos divergentes, com o espelho usando v14.10.8.33/v14.10.8.18/v14.10.8.19.1.
- `core/core/`: 251 arquivos, dos quais 248 eram cópias byte-a-byte e 3 já haviam divergido.
- `sistemas/` e `core/sistemas/`: mais de mil caminhos em comum e centenas de arquivos exclusivos em cada árvore, caracterizando ramificação acidental.

A v14.10.8.37 remove esses espelhos e estabelece uma única fonte de verdade.
