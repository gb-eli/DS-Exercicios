# GERENCIADOR DE PACOTES GRÁFICOS — v0.9.3

## Estrutura

A versão possui 8 pacotes. O Essencial é obrigatório; os demais são preparados apenas após ação do usuário.

| Pacote | Arquivos | Tamanho atual | Dependências |
|---|---:|---:|---|
| Essencial | 58 | 739.3 KB | — |
| Equilibrado | 114 | 1.6 MB | graphics-essential |
| Alta qualidade | 38 | 546.5 KB | graphics-balanced |
| Ultra | 4 | 7.4 KB | graphics-high-core |
| Cinemático / Experiência máxima | 16 | 15.5 MB | graphics-ultra-core |
| Módulo de equipamentos 3D | 38 | 124.1 KB | graphics-balanced |
| Módulo VFX Ultra | 35 | 1.1 MB | graphics-ultra-core |
| Referências e documentação visual | 13 | 7.5 MB | — |

## Persistência

- Cache Storage: arquivos estáticos e GLBs.
- IndexedDB: estados, versões, escolhas e histórico de instalação.
- `navigator.storage.persist()`: solicitado somente pelo usuário.
- `navigator.storage.estimate()`: mostra uso e quota.

## GitHub Pages

Os pacotes são listas versionadas de arquivos, não ZIPs baixados pelo navegador. Isso permite cache direto, atualização incremental e reutilização entre sessões.
