# Changelog — Fliperama DS v0.35.0

## Fase 7.16A — Upgrade gráfico dos jogos atuais · Bloco 1/3

### Jogos modernizados
- Trap Lab
- Vector Fleet
- Raster Rally
- Space Blocks
- Labirinto de Dados
- Reator de Blocos

### Alterações
- camadas de atmosfera por jogo no palco, sem capturar ponteiro;
- profundidade, sombras, glow e iluminação adicionados diretamente aos runtimes;
- diferenças visuais preservadas entre Histórico, Baixo, Médio, Alto e Ultra;
- 12 previews SVG redesenhados;
- manifesto `graphics/visual-upgrade-v0.35.0.json`;
- nenhuma regra de simulação alterada;
- hotfix UX/UI v0.34.2 preservado;
- CPU e multiplayer v0.34.1 preservados.

### Validação
- 69 testes específicos do upgrade gráfico;
- 17 módulos de simulação comparados por SHA-256 com a baseline v0.34.2 e preservados;
- todas as suítes anteriores repetidas.
