# Relatório de validação — Fase 12

## Resultado

`npm run validate` aprovado.

- 91 arquivos JavaScript;
- 55 arquivos estruturais obrigatórios;
- 15 módulos disponíveis;
- 10 renderizadores auditados.

## Testes funcionais

- quatro veículos cadastrados;
- ônibus espacial didático presente;
- oito câmeras;
- quatro inspeções;
- bloqueio de inspeção na câmera incorreta;
- liberação após sequência completa;
- configurações de voo válidas nos quatro veículos;
- primeiro estágio reutilizável com reserva;
- replay registrando e buscando telemetria;
- troca de veículo reiniciando inspeções;
- Worker físico e regressão da Fase 5;
- carregamento lazy;
- XP idempotente;
- perfis gráficos.

## Servidor

Os seguintes caminhos responderam HTTP 200:

- `/`;
- módulo de lançamento imersivo;
- renderizador;
- modelo de experiência;
- Worker de lançamento;
- folha de estilos.

## Browser

A tentativa de captura headless foi interrompida após o Chromium não concluir inicialização estável de DBus/EGL. Não foi usada como prova visual.

## Playtest recomendado

- Android 360/390/412 px;
- iPhone em paisagem;
- Chromebook;
- notebook Windows integrado;
- notebook com GPU dedicada;
- controle Xbox/compatível;
- touch e mouse;
- modos Desempenho, Equilibrado e Experiência;
- troca rápida de módulos para observar consumo residual.
