# Testes — Upgrade gráfico v0.35.0

A suíte `validation/test-visual-upgrade.js` valida versão, manifesto visual, perfis gráficos, temas CSS, previews, presença das melhorias nos seis runtimes e preservação integral dos módulos de simulação.

## Resultado
- 69 verificações específicas aprovadas;
- 6 jogos modernizados;
- 12 previews modernizados;
- 17/17 módulos de simulação com SHA-256 idêntico à baseline v0.34.2;
- 18 runtimes preservados;
- nenhuma alteração de lógica detectada.

## Limitação
O smoke test visual em Chromium não concluiu porque o processo do navegador travou com falhas de DBus/GPU no ambiente. Nenhuma captura visual foi contabilizada como aprovada.
