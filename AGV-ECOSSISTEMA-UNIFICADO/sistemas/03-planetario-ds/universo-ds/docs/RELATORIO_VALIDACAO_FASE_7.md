# Relatório de validação — Fase 7

## Resultado

Validação automatizada aprovada.

## Estrutura

- versão 7.0.0;
- 54 arquivos JavaScript validados;
- 51 arquivos estruturais obrigatórios;
- 10 módulos disponíveis;
- imports relativos resolvidos;
- manifesto e Service Worker válidos.

## Testes funcionais

- A* encontra rota e evita obstáculos;
- custo e quantidade de nós são finitos;
- fila respeita latência;
- ACK é produzido após a entrega;
- comando executado não é repetido;
- quatro amostras são classificadas;
- banco aceita registro e rejeita duplicidade;
- exportação declara o esquema correto;
- drone lança, mapeia, rejeita repetição e retorna;
- rover percorre rota e consome energia;
- patinagem é injetada e recuperada;
- Worker marciano serializa energia, fila e estado;
- XP permanece idempotente;
- regressão das Fases 1 a 6 aprovada.

## Teste HTTP

Responderam com HTTP 200:

- portal;
- `src/main.js`;
- módulo de Marte;
- renderizador;
- Worker;
- modelo de missão;
- dados marcianos;
- Service Worker.

## Limitação visual

O ambiente de execução não oferece uma captura WebGL confiável por Chromium/EGL. O playtest visual final deve ser realizado em Android, iPhone, Chromebook e notebook Windows, verificando câmera, legibilidade, toque, orientação paisagem e consumo de bateria.

## Dimensão do projeto

- 119 arquivos no pacote completo;
- aproximadamente 1,05 MB descompactado antes da compactação final;
- 32 arquivos novos ou alterados em relação à Fase 6.
