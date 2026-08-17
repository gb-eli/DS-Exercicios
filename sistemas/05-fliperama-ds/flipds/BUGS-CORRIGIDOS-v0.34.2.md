# Bugs corrigidos — v0.34.2

## Crítico

### Abertura inicial maior que a viewport
A abertura podia ultrapassar a altura disponível e bloquear os botões de entrada. Agora possui limite por `100dvh`, rolagem própria, safe-area e botão fechar no topo.

### Tutorial impossível de iniciar em telas baixas
O onboarding ficava dentro de uma área com `overflow: hidden`; listas grandes podiam empurrar **Começar partida** para fora da área alcançável. O overlay agora é rolável e alinhado pelo início.

## Alto

- Falha de `sessionStorage` podia interromper a abertura: adicionados wrappers seguros.
- `Esc` não fechava a abertura: corrigido.
- Dialogs de jogo e detalhes podiam exceder a altura útil: corrigidos com `dvh`.
- Safe-area lateral não era aplicada aos controles touch: corrigido.

## Médio

- Em celulares muito estreitos, título e ações do HUD competiam pelo mesmo espaço.
- Em landscape baixo, abertura e HUD consumiam espaço excessivo.
- Botões do modal de detalhes ficavam apertados horizontalmente no celular.

## Não incluído nesta revisão

O upgrade artístico dos jogos não faz parte do hotfix. Ele permanece planejado para a v0.35.0.
