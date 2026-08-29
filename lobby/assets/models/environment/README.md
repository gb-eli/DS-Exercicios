# Campus DS — contrato de assets 3D

A v14.10.8.45 continua funcional sem modelos externos: o ambiente procedural da Fase C é o fallback oficial.

Quando os modelos autorais forem adicionados, usar **GLB/glTF 2.0**, escala em metros, eixo Y para cima e frente em -Z. Aplicar transforms antes da exportação. Pivôs devem ficar no piso/centro do objeto. Colisores simplificados usam o sufixo `_COL`; LODs, quando existirem, usam `_LOD0`, `_LOD1` e `_LOD2`.

Orçamento recomendado por prédio: 25–60 mil triângulos em LOD0, até 8 materiais compartilháveis e texturas de 1K/2K conforme importância visual. Preferir Meshopt para geometria e KTX2/Basis para texturas quando os loaders forem integrados. Não exportar FBX/OBJ para runtime.
