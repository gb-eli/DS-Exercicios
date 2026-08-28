# Testes da expansão de progressão — Fliperama DS v0.36.0

Arquivo executável: `validation/test-progression-expansion-v0.36.0.js`  
Resultado: `validation/progression-expansion-results-v0.36.0.json`

## Resultado

- Verificações: **38**
- Aprovadas: **38**
- Falhas: **0**

## Cobertura

### Trap Lab
- 6 fases registradas;
- um início e uma saída por fase;
- percurso automatizado completo nos modos Explorador, Programador e Precisão;
- vitória confirmada somente após a sexta fase.

### Labirinto de Dados
- 5 mapas registrados;
- 5/5 mapas sem células críticas desconectadas;
- avanço forçado entre todos os mapas;
- vitória confirmada após o mapa 5.

### Aventura de Salas
- 12 salas registradas;
- quatro salas novas presentes no grafo;
- migração de save schema 1 → 2;
- vitória bloqueada sem `system-sealed`;
- cadeia relé → refrigeração → diagnóstico → selo validada;
- vitória confirmada com Núcleo de Memória + selo.

### Ponte 8→16 Bits
- largura de mundo 6300 px;
- 15 fragmentos posicionados e 12 exigidos;
- 5 checkpoints;
- Zona 5 e Zona 6 detectadas;
- portal concluível após cumprir a nova meta.

### Reator de Blocos
- save schema 2 produzido pela versão atual pode ser restaurado;
- save schema 1 migra para schema 2.

### Conteúdo
- perfis e ficha educacional sincronizados com 6 fases, 5 mapas, 12 salas e 6 zonas.
