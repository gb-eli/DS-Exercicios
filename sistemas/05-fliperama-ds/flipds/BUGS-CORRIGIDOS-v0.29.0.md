# Bugs corrigidos — Fliperama DS v0.29.0

## Trap Lab

- terminal da Fase 3 estava numa posição inadequada para interação consistente;
- salto não aceitava pequenas imprecisões ao sair de uma borda;
- salto pressionado pouco antes da aterrissagem era descartado;
- saves antigos não possuíam os novos estados físicos.

## Ponte 8→16 Bits

- a fórmula da zona limitava o HUD à Zona 3;
- checkpoint intermediário ficava excessivamente próximo de um perigo;
- plataformas altas exigiam uma sequência rígida e dificultavam a recuperação após erro;
- perigos eram largos demais para a tolerância desejada;
- área de coleta dos fragmentos era pequena;
- não havia coyote time nem jump buffer;
- saves anteriores não possuíam os novos estados físicos.
