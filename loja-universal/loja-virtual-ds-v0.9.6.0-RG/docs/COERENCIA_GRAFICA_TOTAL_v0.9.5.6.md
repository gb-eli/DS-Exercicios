# Coerência Gráfica Total — v0.9.6.0-RG

## Fonte única
`DSAvatarProfile` mantém os IDs equipados e migra o loadout legado. O mesmo estado alimenta Perfil, Inventário, Loja, transações, prévia equipada e Exibição DS.

## Snapshot leve
`DSAvatarSnapshot` usa o avatar-base e as miniaturas reais dos equipamentos. É uma representação 2D coerente e barata, não uma falsa captura WebGL. O botão 3D abre o GLB completo.

## Exibição DS
Sobreposição leve com desfile, aceno, salto, dança, giro, pose de vitória e mensagens aprovadas. Quando o visualizador 3D está carregado, o mesmo comando também é enviado ao rig.

## Transações
A animação visual muda conforme Básico, Intermediário, Avançado, Ultra ou Realismo, mas não interfere na autorização financeira.
