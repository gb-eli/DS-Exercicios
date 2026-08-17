# Fase 3 — Auditoria pedagógica e simulação completa — v2.5.5

## Escopo

Foram revisadas as 13 aulas ativas como se fossem percorridas por estudantes do 1º e 2º ADM. A auditoria verificou contexto, objetivos, sequência, tarefas práticas, fórmulas, gráficos, documentos, anexos, e-mail, ajuda, avaliação, recuperação e conclusão.

As Aulas 1, 2 e 3 do 1º ADM permaneceram congeladas em conteúdo. Foram apenas incluídas nos testes de regressão.

## Problemas encontrados e corrigidos

### 1. Gráficos genéricos nas apresentações

O simulador de apresentações exibia sempre os mesmos setores e barras, mesmo quando a base da aula era diferente. Isso gerava contradições especialmente na recuperação do 2º ADM.

Correção:

- cada apresentação possui título de gráfico próprio;
- categorias e valores vêm do cenário da aula;
- os tópicos e as notas do apresentador são contextualizados;
- os gráficos continuam identificados como dados fictícios.

### 2. Filtros com enunciado ambíguo

Algumas avaliações pediam “casos em aberto” ou “demandas que dependem de decisão”, mas a ferramenta aplicava somente o valor `Pendente`. Como havia também registros `Em análise`, a instrução permitia mais de uma interpretação.

Correção:

- o enunciado informa explicitamente quando o filtro esperado é `Pendente`;
- filtros de recuperação informam explicitamente `Atrasado`;
- a ajuda de avaliação explica onde procurar sem revelar o critério correto.

### 3. Fórmulas após filtros

Algumas etapas filtravam a planilha e, em seguida, pediam SOMA ou MÉDIA da faixa completa. Sem explicação, o aluno poderia não saber se deveria considerar linhas ocultas.

Correção:

- os enunciados passam a dizer “na base completa” quando a fórmula usa todas as linhas;
- SOMASE e CONT.SE continuam indicando explicitamente o critério usado.

### 4. E-mail dependente de palavras literais

Mensagens profissionais eram rejeitadas quando o aluno usava “Bom dia” em vez de “Olá”, “Cordialmente” em vez de “Atenciosamente” ou “arquivo PDF” em vez de “anexo”.

Correção:

- saudações profissionais equivalentes são aceitas;
- encerramentos profissionais equivalentes são aceitos;
- termos administrativos e de anexo possuem variantes semânticas controladas;
- destinatário, CC, arquivo, permissão e contexto continuam obrigatórios;
- mensagens sem saudação, sem encerramento ou com arquivo errado continuam bloqueadas.

## Verificações pedagógicas automatizadas

O novo teste `pedagogical-flow.test.mjs` verifica:

- 13 aulas e seus objetivos;
- ausência de hardware, jogos e 3D nas trilhas atuais;
- carga mínima de interações em cada aula;
- validade das respostas e feedbacks;
- montagem correta dos blocos de fórmula;
- produção do PDF antes de ele ser exigido no e-mail;
- gráficos contextualizados;
- categorias do gráfico pertencentes à base da aula;
- filtros sem ambiguidade;
- escopo das fórmulas depois de filtros;
- avaliação e recuperação realmente diferentes;
- anexos diferentes entre avaliação e recuperação;
- aceitação de redação profissional equivalente;
- rejeição de mensagem sem saudação ou com arquivo incorreto;
- ajuda de avaliação sem entrega do critério correto.

## Resultado

A sequência atual está coerente com Informática Empresarial:

1. contexto administrativo;
2. uso da ferramenta;
3. produção da evidência;
4. comunicação do resultado;
5. conclusão e entrega guiada.

A avaliação e a recuperação verificam competências equivalentes por problemáticas, dados, fórmulas e arquivos diferentes.
