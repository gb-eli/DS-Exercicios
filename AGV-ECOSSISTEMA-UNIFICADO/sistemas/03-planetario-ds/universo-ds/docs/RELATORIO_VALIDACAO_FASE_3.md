# Relatório de validação — Fase 3

Data: 3 de agosto de 2026.

## Validação automatizada aprovada

Comando:

```bash
npm run validate
```

Resultados:

- 25 arquivos JavaScript verificados;
- 22 arquivos obrigatórios confirmados;
- imports relativos existentes;
- manifesto PWA válido;
- Service Worker sem referências ausentes;
- versão `3.0.0` confirmada;
- seis módulos lazy-loaded;
- XP idempotente;
- quatro cenários com resposta e recompensa;
- máquina de estados bloqueando salto inválido;
- sequência válida chegando a DEPLOYMENT;
- fila crítica substituindo item de menor prioridade;
- backpressure rejeitando carga `low`;
- replay detectando anomalias;
- Worker produzindo amostra serializável em teste isolado;
- qualidade automática reduzida após FPS baixo persistente.

## Inspeção estática

Confirmado:

- Worker encerrado no `unmount`;
- timer de fallback encerrado;
- radar destruído;
- ResizeObserver desconectado;
- listeners removidos;
- módulos futuros permanecem fora do carregamento inicial;
- caminhos relativos compatíveis com GitHub Pages.

## Limitação do ambiente

O Chromium deste ambiente bloqueou por política administrativa tanto URLs `localhost` quanto URLs `file://`. A automação visual não conseguiu abrir a aplicação, apesar de o servidor local responder normalmente por HTTP.

Consequentemente, ainda devem ser feitos testes visuais em equipamentos reais:

- Android;
- iPhone;
- Chromebook;
- notebook escolar;
- computador com GPU dedicada.

## Checklist manual recomendado

1. abrir o portal;
2. mudar os quatro perfis gráficos;
3. abrir o Centro Avançado;
4. confirmar movimento do radar;
5. pausar e retomar telemetria;
6. executar cada cenário;
7. testar uma resposta incorreta;
8. completar sequência de estados;
9. saturar a fila e ativar backpressure;
10. analisar replay;
11. voltar ao portal;
12. abrir novamente e confirmar persistência de XP;
13. testar redução de movimento;
14. testar rotação retrato/paisagem no celular.
