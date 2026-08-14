# Relatório de validação — Fliperama DS v0.36.0

## Fase 7.17A — Expansão real das fases · Bloco 1/3

Data de fechamento: 07/08/2026.

## Escopo

A v0.36.0 inicia a expansão de duração e progressão dos jogos já existentes, sem introduzir jogos novos. Foram ampliados Trap Lab, Labirinto de Dados, Aventura de Salas e Ponte 8→16 Bits.

## Entregas

### Trap Lab — 3 → 6 fases

Novas fases:

4. **Poço de Impulso** — reforça controle de salto e leitura de altura;
5. **Corredor Binário** — combina plataformas, perigos e terminal;
6. **Núcleo de Saída** — concentra a progressão final e conclui a campanha.

As seis fases foram atravessadas pelo agente físico automatizado nos modos Explorador, Programador e Precisão. Coyote time, jump buffer, checkpoints e portões permanecem ativos.

### Labirinto de Dados — 3 → 5 mapas

Novos mapas:

4. **Matriz Espelhada**;
5. **Cache Fantasma**.

A análise de alcançabilidade confirmou que todas as células caminháveis e todos os pontos críticos pertencem ao percurso válido. A condição de vitória foi movida para o quinto mapa.

### Aventura de Salas — 8 → 12 salas

Nova ala:

- Relé de Rede;
- Laboratório de Refrigeração;
- Baia de Diagnóstico;
- Câmara do Núcleo.

A nova progressão exige sincronizar o relé, estabilizar refrigeração, concluir diagnóstico e aplicar `system-sealed`. O final no Observatório exige o Núcleo de Memória e o selo. Saves schema 1 são migrados para schema 2 com todas as novas entradas de salas.

### Ponte 8→16 Bits — 4 → 6 zonas

- largura: 4200 → 6300 px;
- plataformas: 11 → 17;
- perigos: 5 → 9;
- fragmentos posicionados: 9 → 15;
- fragmentos exigidos: 8 → 12;
- checkpoints: 3 → 5;
- zonas: 4 → 6.

Durante os testes, um apoio muito próximo ao portal e um checkpoint sobreposto a perigo foram detectados e corrigidos antes do fechamento.

## Correções adicionais de consistência

- Reator de Blocos: restauração agora aceita schema 2 e migra schema 1 → 2;
- Reator de Blocos: ficha textual sincronizada com cinco fases;
- Vector Fleet: textos sincronizados com campanhas de 5–7 ondas;
- Sentinela Orbital: textos sincronizados com campanhas de 4–6 ondas;
- diagnósticos técnicos atualizados para a fase atual.

## Validação automatizada

| Suíte | Aprovadas | Falhas |
|---|---:|---:|
| Auditoria geral dos jogos | 116 | 0 |
| CPU, multiplayer e qualidade | 116 | 0 |
| Expansão arcade preservada | 37 | 0 |
| Conteúdo educacional | 120 | 0 |
| Museu e Linha do Tempo | 62 | 0 |
| UX e responsividade | 25 | 0 |
| Física/plataformas | 18 | 0 |
| Experiências 3D | 26 | 0 |
| VoxelCraft | 22 | 0 |
| Expansão de progressão v0.36.0 | 38 | 0 |
| **Total** | **580** | **0** |

A auditoria geral reconhece **18/18 experiências aprovadas**, sem alertas e sem falhas automatizadas.

## Limitação do ambiente de playtest

O Chromium do ambiente de construção já apresentou bloqueios recorrentes por política/DBus/GPU nas fases anteriores. Por isso, esta entrega não declara como aprovado um playtest visual automatizado que não pôde ser executado de forma confiável. Toque real, áudio, sensação visual e frame pacing permanecem no checklist manual.

## Próximo bloco

A v0.36.1 / Fase 7.17B está planejada para Puzzle Forge, State Quest RPG, Raster Rally e Corredores Raycast.

## Integridade de publicação

- Rotas HTTP verificadas: **264/264**;
- Falhas HTTP: **0**;
- Arquivos JSON validados: **32**;
- Arquivos SVG validados: **86**;
- Arquivos JavaScript verificados por sintaxe: **20**;
- `index.html` será publicado diretamente na raiz do ZIP.
