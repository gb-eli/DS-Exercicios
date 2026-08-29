# Checklist de teste real — Fliperama DS v0.36.0

## Antes de publicar

- [x] `index.html`, `app.js`, `app.css`, `sw.js` e JSONs válidos.
- [x] 18 experiências reconhecidas pela auditoria.
- [x] 38 testes específicos da expansão aprovados.
- [x] 18 testes físicos aprovados.
- [x] CPU/multiplayer preservados: 116/116.
- [x] Arcade preservado: 37/37.
- [x] Conteúdo educacional preservado: 120/120.
- [x] Museu/Linha do Tempo preservados: 62/62.
- [x] UX responsiva preservada: 25/25.
- [x] Experiências 3D preservadas: 26/26.
- [x] VoxelCraft preservado: 22/22.
- [x] Auditoria geral: 18/18 jogos, 116 verificações, zero falhas.

## Playtest em computador

### Trap Lab
- [ ] Jogar as 6 fases em pelo menos um modo sem usar save.
- [ ] Confirmar checkpoints das fases novas.
- [ ] Confirmar que terminais/portões das fases 4–6 não prendem o personagem.

### Labirinto de Dados
- [ ] Concluir os 5 mapas em sequência.
- [ ] Conferir leitura visual e controles no mapa Cache Fantasma.

### Aventura de Salas
- [ ] Percorrer as 12 salas.
- [ ] Executar a cadeia Relé → Refrigeração → Diagnóstico → Núcleo.
- [ ] Confirmar que o final permanece bloqueado antes do selo.

### Ponte 8→16 Bits
- [ ] Atravessar as 6 zonas sem usar debug.
- [ ] Testar os 5 checkpoints.
- [ ] Confirmar coleta de pelo menos 12 dos 15 fragmentos.
- [ ] Confirmar entrada no portal final.

## Mobile

- [ ] Testar orientação retrato e paisagem.
- [ ] Confirmar que HUD não cobre controles.
- [ ] Confirmar toque simultâneo quando aplicável.
- [ ] Observar frame pacing nas novas partes da Ponte.

## Observação

O ambiente de construção não fornece um playtest visual Chromium confiável por limitações recorrentes de DBus/GPU/política de navegador. Por isso, os itens de percepção visual, áudio, toque real e frame pacing permanecem explicitamente manuais.
