# Fliperama DS v0.35.0 · Fase 7.16A

## Objetivo
Executar o primeiro bloco do upgrade gráfico dos 18 jogos atuais antes de adicionar novos títulos.

## Escopo
Trap Lab, Vector Fleet, Raster Rally, Space Blocks, Labirinto de Dados e Reator de Blocos.

## Implementação
- iluminação e profundidade desenhadas no próprio runtime Phaser;
- ambientação CSS temática no palco, acima do canvas e abaixo dos overlays de tutorial/resultado;
- efeitos adaptados aos perfis gráficos;
- suporte a `prefers-reduced-motion`;
- 12 previews SVG modernizados;
- manifesto visual separado;
- simulação e saves preservados.

## Validação automatizada
- 109 verificações gerais;
- 116 verificações de CPU/multiplayer;
- 37 verificações da expansão arcade;
- 120 educacionais;
- 62 Museu/Linha do Tempo;
- 16 física 2D;
- 26 experiências 3D;
- 22 VoxelCraft;
- 25 UX/responsividade;
- 69 upgrade gráfico.

**Total: 602 verificações aprovadas, 0 falhas automatizadas.**

## Integridade da lógica
Foi extraída uma baseline SHA-256 dos módulos de simulação da v0.34.2. Os 17 módulos encontrados no bundle foram comparados na v0.35.0 e permaneceram idênticos.

## Validação visual
Foi tentado um smoke test com Chromium headless. O processo travou por erros de DBus/GPU do ambiente e não produziu screenshot. O playtest visual permanece no checklist manual.

## Próximo bloco
Fase 7.16B: Vector Tennis, Sentinela Orbital, Aventura de Salas, Board Arena, Puzzle Forge e Motion Beat.

## Fechamento técnico
- 18 experiências jogáveis preservadas;
- 106 módulos no bundle;
- 69 arquivos de mídia;
- 86 SVGs válidos;
- 232 arquivos/rotas HTTP verificados antes da geração dos hashes finais;
- 0 rotas HTTP com falha;
- `index.html` diretamente na raiz.
