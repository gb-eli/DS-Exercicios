# Validação v0.4.0

- Três arquivos GLB com cabeçalho glTF 2.0 válido.
- LOD0: 78 nós; LOD1: 71 nós; LOD2: 62 nós.
- 14 materiais/meshes compartilhados.
- 11 clips de animação em todos os LODs.
- Sete slots oficiais e três itens modulares iniciais.
- Geometria carregada pelo trimesh com limites 3D coerentes.
- JavaScript validado com `node --check`.
- HTML sem IDs duplicados.
- ZIP testado sem corrupção.

A renderização WebGL usa um loader local especializado no subconjunto glTF utilizado pela Loja Virtual DS. Não depende de CDN.
