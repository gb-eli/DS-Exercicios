# Changelog — Fliperama DS v0.36.0

## Fase 7.17A — Expansão real das fases · Bloco 1/3

### Trap Lab
- campanha ampliada de 3 para 6 fases;
- novas fases: Poço de Impulso, Corredor Binário e Núcleo de Saída;
- física existente, coyote time, jump buffer, checkpoints, terminais e três modos preservados;
- seis fases atravessadas por agente físico automatizado nos três modos.

### Labirinto de Dados
- campanha ampliada de 3 para 5 mapas;
- novos mapas: Matriz Espelhada e Cache Fantasma;
- todos os caminhos, coletas e pontos críticos validados por alcançabilidade;
- vitória transferida para o quinto mapa.

### Aventura de Salas
- grafo ampliado de 8 para 12 salas;
- novas salas: Relé de Rede, Laboratório de Refrigeração, Baia de Diagnóstico e Câmara do Núcleo;
- nova cadeia de flags: `relay-synced`, `cooling-online`, `diagnostics-passed`, `system-sealed`;
- final exige Núcleo de Memória + selo de estabilidade;
- save migrado para schema 2 preservando entradas das salas antigas.

### Ponte 8→16 Bits
- mundo ampliado de 4200 px para 6300 px;
- progressão ampliada de 4 para 6 zonas;
- plataformas: 11 → 17;
- perigos: 5 → 9;
- fragmentos: 9 → 15;
- fragmentos exigidos: 8 → 12;
- checkpoints: 3 → 5;
- portal final e HUD atualizados para a nova meta.

### Consistência
- save do Reator de Blocos schema 2 corrigido;
- textos do Reator, Vector Fleet e Sentinela Orbital sincronizados com suas campanhas atuais;
- diagnósticos e documentação atualizados para v0.36.0.
