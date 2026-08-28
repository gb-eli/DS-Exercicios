# Testes UX e responsividade — v0.34.2

Resultado: **25/25 verificações aprovadas**.

Cobertura:

- versão pública e Service Worker;
- semântica do diálogo inicial;
- botão fechar;
- tecla Esc;
- foco;
- falha de sessionStorage;
- rolagem da abertura;
- `100dvh`;
- ações sticky;
- safe-area;
- rolagem do onboarding;
- botões/selects touch-friendly;
- limites de dialogs;
- telas até 420 px;
- telas com altura até 760 px;
- landscape até 520 px;
- modal de detalhes no celular;
- preservação das 18 experiências;
- ausência de jogos novos no hotfix.

O arquivo bruto está em `validation/ux-responsive-test-results.json`.

## Limitação do ambiente

A tentativa de abrir `http://127.0.0.1` com Chromium/Playwright retornou `ERR_BLOCKED_BY_ADMINISTRATOR`. Por isso esta suíte não afirma que houve inspeção visual automatizada real.
