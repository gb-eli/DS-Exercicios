# Revisão gráfica e de animações — v0.9.4.2

## Problemas encontrados

1. A interface ainda exibia v0.9.3 em áreas da versão v0.9.4.1.
2. O fallback 2D do avatar deixava o overlay de carregamento ativo.
3. Os VFX iniciavam fora da tela e podiam terminar antes da abertura do estúdio.
4. As falas do estúdio eram renderizadas no balão oculto da aba Personagem.
5. Listeners de animação eram acumulados durante novas renderizações.
6. O botão Equipar do inventário não alterava o personagem.
7. A troca de LOD perdia a referência antes de descartar buffers WebGL.
8. A troca entre clips era instantânea e visualmente brusca.
9. Joelhos, pés, mãos e cabeça tinham pouco movimento secundário.
10. No celular, os comandos ficavam distantes da prévia.
11. O perfil não mostrava o conjunto equipado nem oferecia ações rápidas.
12. Alguns textos e cards de equipamento tinham legibilidade insuficiente.

## Alterações realizadas

- Estado persistente do loadout em `localStorage`, com evento de sincronização.
- Crossfade de 220 ms entre poses.
- Movimento secundário procedural em Idle, Walk, Run, Wave, Goodbye e DanceLoop.
- Preview sticky no celular, mantendo personagem e animação visíveis.
- Inventário com equipamento funcional e handlers restritos ao próprio grid.
- Perfil com resumo do conjunto e atalhos de animação.
- VFX e falas ligados ao ciclo de vida da tela ativa.
- Descarte de GPU corrigido na troca de LOD.
- Tipografia e espaçamento ajustados sem substituir a identidade visual.

## Limites desta manutenção

O rig continua sendo o rig voxel rígido atual. A reconstrução humanoide completa, com mais ossos, mãos detalhadas, joelhos e blending avançado, permanece planejada para a v0.10.0. Esta versão melhora o resultado atual sem invalidar GLBs, slots ou animações existentes.
