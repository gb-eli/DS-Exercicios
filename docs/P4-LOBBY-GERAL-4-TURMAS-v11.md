# P4 — Lobby Geral + 4 Áreas de Turma — v11

## Objetivo
Criar uma camada jogável/social antes do portal de exercícios, sem transformar a animação em autoridade pedagógica.

## Fluxo
1. Aluno autentica no AGV Core.
2. Entra na Praça Central do Lobby DS.
3. Pode circular livremente por 1DS, 2DS, 3DS e DS Sub.
4. Cada área possui um portal visual próprio.
5. Portais de outras turmas são apenas visitáveis/socialmente.
6. O portal da própria turma consulta `exercise_releases`.
7. Sem liberação: cadeado e mensagem de espera.
8. Com liberação: portal anima/ilumina e abre a lista de atividades liberadas.
9. Ao escolher uma atividade, o lobby envia `?exercise=<uuid>` ao portal de exercícios.
10. `activity-progress` revalida no servidor a liberação antes de iniciar.

## Portais visuais
- 1DS — Porta Neon
- 2DS — Cano Tech
- 3DS — Portal Quantum
- DS Sub — Arcade Gate

## Presença social
Tabela `lobby_presence` com RLS:
- aluno lê presença de usuários autenticados ativos;
- grava/atualiza somente a própria posição;
- trigger privado força primeiro nome e turma a partir do perfil/matrícula;
- emotes limitados a `wave`, `like` e `spark`;
- sem chat livre nesta fase;
- clientes consideram online apenas registros atualizados nos últimos 20 segundos.

## Segurança pedagógica
Todos os exercícios ativos foram alterados para `default_locked=true`.
A atividade só fica disponível quando:
- há override individual válido; ou
- há liberação de turma válida.

Precedência preservada:
`security lock -> student release -> class release -> default_locked`.

A animação do lobby nunca substitui `activity-progress`.

## Compatibilidade
O pacote inclui `/atividades/` baseado no Exercícios Práticos DS v0.14.1-P3, atualizado para v0.14.2 com:
- botão de retorno ao Lobby;
- deep-link por `?exercise=<uuid>`;
- revalidação normal antes de `openExercise()`.
