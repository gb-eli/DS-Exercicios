# Bugs e ajustes — v0.39.0

## Chess Arena 360

- CPU Mestre podia consumir o orçamento de busca antes de reconhecer um mate em 1 em algumas posições. Foi adicionada uma varredura tática imediata de xeque-mate antes da busca alpha-beta.
- Previews iniciais não possuíam `aria-label`, requisito usado pela auditoria de mídia. Os dois SVGs foram corrigidos.
- Testes regressivos antigos ainda exigiam literalmente v0.38.6/24 experiências. As expectativas de release foram atualizadas para v0.39.0/25 sem alterar regras históricas dos jogos.

## Regras validadas

- roque curto e longo;
- bloqueio de roque através de casa atacada;
- en passant;
- quatro opções de promoção;
- xeque e xeque-mate;
- afogamento;
- repetição tripla;
- regra dos 50 lances;
- material insuficiente;
- preservação de direitos de roque e alvo de en passant no save.
