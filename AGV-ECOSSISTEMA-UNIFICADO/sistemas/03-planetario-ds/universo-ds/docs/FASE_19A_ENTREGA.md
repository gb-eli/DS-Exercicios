# Macrofase 19 — Bloco A

## Escopo entregue

Interiores HD por corte técnico, componentes interativos, hotspots glTF, peças articuladas, colliders compostos, áudio espacializado e ponte de telemetria.

## Funcionamento

Cada hotspot vem de `node.extras.interaction`. Ao ativá-lo, o sistema seleciona o nó, destaca a primitive correspondente, reposiciona a câmera, resolve o clip de animação mais compatível e toca um som mecânico sintetizado. Nenhum arquivo de áudio externo é obrigatório.

## Compatibilidade

O procedural permanece abaixo da camada GLB. Em falha de WebGL, contexto perdido ou asset indisponível, o laboratório continua utilizável no fallback existente.
