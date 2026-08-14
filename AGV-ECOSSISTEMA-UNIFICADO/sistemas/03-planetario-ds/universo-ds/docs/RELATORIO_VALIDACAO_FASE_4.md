# Relatório de validação — Fase 4

## Aprovado automaticamente

- sintaxe e imports dos arquivos JavaScript;
- arquivos obrigatórios;
- manifesto PWA;
- caminhos do Service Worker;
- sete módulos carregáveis;
- persistência e XP idempotente;
- cálculos de período LEO e GEO;
- relação entre velocidade e altitude;
- posição orbital finita;
- geração de trajetória;
- cinco regimes orbitais;
- três desafios;
- quatro estações de solo;
- satélite coerente aprovado;
- satélite incompatível rejeitado;
- Worker orbital produzindo posição, energia e contato;
- Worker de telemetria da Fase 3;
- estados, fila, replay e qualidade adaptativa.

## Teste HTTP

O servidor local respondeu `200 OK` para a aplicação. O Chromium disponível neste ambiente não concluiu a captura headless e ficou bloqueado durante a inicialização gráfica. Portanto, não foi possível registrar uma evidência visual automatizada confiável.

## Testes manuais necessários

- Android em 320, 360, 390 e 412 px;
- iPhone 13, 14 e 15 em orientação paisagem;
- Chromebook ou notebook escolar;
- arraste e zoom do globo;
- fallback sem WebGL2;
- mudança entre os quatro perfis gráficos;
- Worker após várias trocas de aba;
- contato de solo em 1200×;
- instalação PWA em URL real do GitHub Pages.
