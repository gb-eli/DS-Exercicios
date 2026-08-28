# Modos Gráficos Oficiais — v0.9.4.3

## Contrato

Os nomes internos oficiais são `basic`, `intermediate`, `advanced`, `ultra` e `realism`. A aplicação converte automaticamente configurações antigas:

| Antigo | Oficial |
|---|---|
| economy | basic |
| balanced | intermediate |
| high | advanced |
| ultraAdvanced | realism |

## Matriz

| Modo | DPR | Textura | Partículas | Sombras | LOD | Meta |
|---|---:|---:|---:|---:|---|---:|
| Básico | 1.0 | 512 px | 60 | desligadas | LOD2 | 60 FPS |
| Intermediário | 1.3 | 1K | 220 | 512 | LOD1 | 60 FPS |
| Avançado | 1.7 | 2K | 650 | 1024 | LOD0 | 60 FPS |
| Ultra | 2.15 | 4K seletivo | 1.400 | 2048 | LOD0 | 60 FPS |
| Realismo | 2.5 | 4K seletivo | 2.200 | 4096 | LOD0 | 45 FPS |

## Regras

- Ultra e Realismo nunca baixam pacotes pesados silenciosamente.
- O modo selecionado é persistido por dispositivo.
- A prioridade de FPS pode reduzir DPR e partículas sem mudar o pacote instalado.
- O Modo Realismo usa acabamento mais cinematográfico e menos neon saturado.
- Todas as funções continuam disponíveis no Básico; apenas a complexidade visual diminui.
- Recursos fora de uso continuam sujeitos ao LRU da v0.9.4.

## Cenários

- Básico: Estúdio Essencial.
- Intermediário: Estúdio Neon Balanceado.
- Avançado: Estúdio Tech Avançado.
- Ultra: Estúdio Ultra Holográfico.
- Realismo: Estúdio Realismo Cinematográfico.
