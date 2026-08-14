# VoxelCraft DS 3D — integração Fliperama 11

Jogo voxel educacional restaurado e consolidado no Fliperama DS 0.17.0.

## Modos

- **Aprendizagem:** missões, explicações e trechos de lógica.
- **Livre:** exploração sem objetivo obrigatório.
- **Desafio:** metas maiores e XP ampliado.

## Qualidade

- Baixo: celular básico;
- Médio: Chromebook/tablet;
- Alto: notebook/PC;
- Ultra: computador potente;
- Automático: decisão por memória, núcleos e tipo de ponteiro.

Em aparelhos de toque, limites adicionais são aplicados mesmo quando o usuário seleciona perfil elevado.

## Controles

- computador: WASD/setas, mouse, Espaço, Shift, C, clique esquerdo e direito;
- celular/tablet: dois joysticks e botões Pular, Quebrar, Construir e Agachar.

## Persistência e segurança

O mundo é salvo em IndexedDB com schema validado. Coordenadas, inventário, XP e alterações são limitados antes de serem restaurados. O jogo não executa código fornecido pelo aluno e não utiliza `eval`, `new Function` ou `document.write`.

## Renderizador local

Three.js 0.180.0 está incluído em `lab/vendor/three/three.module.min.js`. O VoxelCraft não depende mais de CDN externa para criar o mundo 3D, preservando a execução em redes escolares restritas e no cache offline.

## Isolamento no Fliperama DS

A versão migrada usa o banco `fliperama-ds.voxelcraft` e a chave `fliperama-ds.voxelcraft.settings.v10`. Na primeira abertura, ela pode importar uma cópia do mundo antigo do Lab, mas todas as gravações seguintes permanecem no namespace do Fliperama.
