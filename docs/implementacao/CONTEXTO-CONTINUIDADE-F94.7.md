# Contexto de continuidade — AGV World F94.7

Base atual de trabalho: **F94.7 — Locomoção Real Unificada**, derivada da F94.6 e preservando os hotfixes F94.1–F94.5.1 e a Prova Prática F94.4.

## Concluído

- Runtime Contract V2 ativo;
- PlayerLocomotion V2 aplicado ao movimento a pé real nos runtimes 2D e 3D principais;
- 18 mundos persistentes cobertos diretamente ou por hosts compartilhados;
- fixed timestep 60 Hz;
- aceleração/desaceleração compartilhadas;
- exterior 16/28 e interiores 8/13;
- teleporte limpa velocidade residual;
- veículos, rides e airdrop mantidos fora do kernel terrestre;
- cache `stage69-f947-locomotion-live`.

## Não avançar para Colyseus ainda

Primeiro concluir:

1. F94.8 Camera V2;
2. Interaction V2;
3. streaming modular/interiores;
4. qualidade gráfica/assets;
5. Vehicle Core/Rapier.

Depois: NetworkManager + Colyseus no notebook, com Supabase Realtime fallback e Solo.

## Próximo trabalho

**F94.8 — Camera V2**: corrigir eixo vertical/invert Y, permitir olhar para o céu, unificar sensibilidade e pitch em todos os mapas, câmera de veículo e fundação do Mirante 360° com zoom óptico até 50x.
