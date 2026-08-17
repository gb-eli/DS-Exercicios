# P1 — LABs DS1 / DS2 / DS3 / Sub no AGV Education Core — v8

Data: 13/08/2026

## Escopo

A v8 conecta os quatro portais legados de exercícios ao Core sem alterar a organização pedagógica de cada portal:

- `lab-ds1`: 11 atividades — 1DS A;
- `lab-ds2`: 58 atividades — 2DS A;
- `lab-ds3`: 8 atividades — 3DS C;
- `lab-sub`: 11 atividades — DS Subsequente;
- total: **88 atividades canônicas**.

Essas plataformas não tinham uma economia oficial central. Por isso todas as 88 atividades foram cadastradas com `no_economic_reward` e zero XP/pontos/moedas. A integração não inventa recompensas.

## Identidade e escopo

O frontend usa a publishable key e uma bridge comum. O backend `lab-exercises-core` revalida em toda operação:

1. JWT válido;
2. perfil ativo `student`;
3. senha inicial já substituída;
4. matrícula ativa na turma exigida pela plataforma;
5. plataforma registrada e ativa;
6. `activity_id` presente no `activity_catalog`.

Mapeamento server-side:

| Plataforma | Turma exigida |
|---|---|
| `lab-ds1` | `1DS-A-MANHA` |
| `lab-ds2` | `2DS-A-MANHA` |
| `lab-ds3` | `3DS-C-MANHA` |
| `lab-sub` | `DS-SUB-NOITE` |

Um aluno de outra turma não consegue forjar progresso chamando a Edge Function diretamente.

## Progresso central

Eventos aceitos por `lab-exercises-core v1`:

- `start` — atividade iniciada;
- `touch` — atividade em andamento;
- `complete` — entrega concluída pelo portal e enviada para revisão.

A conclusão não significa aprovação docente. O fluxo central é:

`started/in_progress → completed + review_status=pending → reviewed + review_status=approved`

Se o professor solicitar ajustes, a atividade volta para `in_progress` e recebe `review_status=changes_requested`.

## Modo Professor

`agv-teacher-activity v3` permite, após validar professor→turma→aluno:

- listar atividade atual/recentes;
- abrir gabarito privado da atividade;
- visualizar resposta-modelo, arquivos preenchidos, explicação, rubrica e dicas de intervenção;
- escrever feedback;
- **Aprovar**;
- **Solicitar ajustes**;
- registrar a decisão em `admin_audit_log`.

`activity_teacher_content` permanece server-only: RLS ativo e sem grants diretos para `anon` ou `authenticated`.

## Importação privada dos gabaritos

Os pacotes Professor foram processados fora da árvore pública e geraram:

- 88 referências docentes;
- 168 arquivos de solução preenchidos.

O JSON privado **não é incluído no ZIP público**. No Console Professor, `admin/super_admin` possui a ação **Importar gabaritos**, que envia lotes pequenos para `agv-teacher-activity`. Professor comum não pode importar nem alterar a base privada.

Estado live no fechamento da v8:

- LAB Virtual: 88 referências já live;
- LAB DS1: 4 referências live (3 Análise + 1 Introdução usada para validar a ingestão);
- DS2/DS3/Sub: aguardam a importação administrativa do JSON privado.

## Anti-gabarito no pacote Aluno

A v8 trata como falha de segurança qualquer solução final presente no bundle aluno.

Correções aplicadas:

- removidos objetos `professor`, `gabarito` e `solution` dos dados das versões aluno;
- arquivos finais não explicitamente fornecidos passaram a ser starters;
- código-base realmente fornecido foi preservado;
- DS2: removidos 196 exemplos de código-resposta, 62 códigos de comparação e 87 snippets extras com solução;
- rótulos de “referência” foram convertidos para “estrutura de apoio” quando o conteúdo é starter;
- o antigo modo professor embutido no JavaScript do aluno foi neutralizado.

### 1DS — Análise e Método

As três atividades tinham chaves de correção no bundle aluno (`solution`, `essential`, classificação e justificativa). Isso foi removido.

A correção agora usa `lab-analysis-validate v1`:

- lê a chave somente de `activity_teacher_content`;
- devolve feedback genérico, nunca o gabarito;
- aplica rate limit por aluno/atividade;
- grava `analysis_validated` no progresso.

O trigger `guard_analysis_completion_server_validation` impede `completed/reviewed` se `analysis_validated` não for verdadeiro. Portanto alterar o frontend ou chamar a API genérica não libera a atividade.

## Limitação explícita dos portais legados

Nesta v8, **Auth e progresso são centrais**, mas o conteúdo dos arquivos digitados nos quatro portais legados ainda não é sincronizado entre computadores pelo Core.

A sincronização completa de arquivos/revisões/autosave entre PCs pertence ao sistema unificado Exercícios Práticos DS. Não declarar os LABs legados como equivalentes a essa persistência.

## Próximas ações

1. importar o JSON privado de 88 gabaritos pelo Console Professor;
2. testar um aluno real de cada turma e um professor com escopo restrito;
3. adicionar sincronização opcional de arquivos aos portais legados somente se houver benefício real;
4. restringir CORS ao domínio de produção;
5. tratar os WARNs já conhecidos do Security Advisor.
