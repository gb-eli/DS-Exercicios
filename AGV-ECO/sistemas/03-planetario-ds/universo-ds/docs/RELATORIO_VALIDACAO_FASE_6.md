# Relatório de validação — Fase 6

## Aprovações automatizadas

- 44 arquivos JavaScript analisados;
- 41 arquivos estruturais obrigatórios;
- nove módulos disponíveis;
- imports relativos existentes;
- manifesto PWA válido;
- Service Worker apontando para arquivos existentes;
- versão 6.0.0;
- carga nominal do ApolloComputer dentro do orçamento;
- sobrecarga didática gerando alarme;
- reinício prioritário preservando tarefas críticas;
- parser e executor Assembly;
- atuador THROTTLE alterado pelo programa;
- linha do tempo e fontes HTTPS;
- três locais de pouso;
- seis intertravamentos;
- dois alarmes;
- pouso nominal concluído;
- combustível residual positivo;
- falha e recuperação do radar;
- seis objetivos de superfície em sequência;
- amostras e distância do rover registradas;
- Worker lunar serializando estado, altitude e combustível;
- XP sem duplicação;
- regressão das fases anteriores;
- qualidade automática adaptativa.

## HTTP

Os arquivos críticos responderam com HTTP 200 em servidor local:

- portal;
- registro de módulos;
- módulo Lua e Apollo;
- renderizador lunar;
- Worker lunar;
- dados Apollo;
- manifesto.

## Limitação visual do ambiente

O Chromium headless disponível não inicializou EGL/SwiftShader e permaneceu bloqueado durante a captura. Portanto, a revisão visual automatizada de WebGL não foi considerada evidência válida.

## Playtest necessário em equipamentos reais

- Android 360 e 412 px;
- iPhone;
- tablet;
- Chromebook;
- notebook Windows;
- WebGL2 ativo;
- fallback Canvas 2D;
- modos Desempenho, Equilibrado e Experiência;
- Reduzir movimento;
- operação offline após primeira abertura.
