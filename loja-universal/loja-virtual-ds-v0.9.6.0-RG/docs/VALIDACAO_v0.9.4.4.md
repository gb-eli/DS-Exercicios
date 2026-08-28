# Validação — Loja Virtual DS v0.9.4.4

## Resultado

- Regressão: **PASS** em 11 grupos.
- JavaScript: nenhum erro sintático.
- GLBs: **3 válidos**, com 28 clips em cada LOD.
- Articulações intermediárias: **10**.
- Slots preservados: **16**.
- Produtos preservados: **71**.
- Equipamentos 3D preservados: **36**.

## Verificação profunda dos GLBs

Todos os canais apontam para nodes, samplers e acessores existentes. Nenhum `bufferView` ultrapassa o bloco BIN. Os três modelos também foram abertos estruturalmente pelo Trimesh.

## Navegador

O Chromium renderizou a interface por injeção integral do HTML/CSS/JS porque a política administrativa bloqueia `localhost`. Foram confirmados:

- 14 itens de navegação;
- tela Personagem ativa;
- 4 controles regionais do rig;
- 18 botões avançados de clips na área principal;
- layout móvel em 390 × 844 sem overflow horizontal;
- ausência de erros de console.

O WebGL não ficou disponível nessa execução, portanto o navegador usou o fallback 2D. A integridade dos clips 3D foi validada estruturalmente; não é afirmada inspeção visual automatizada do movimento GLB nessa máquina.

## Limites conhecidos

O rig continua sendo voxel com partes rígidas. Não há skinning por pesos, dedos modelados ou blendshapes faciais.
