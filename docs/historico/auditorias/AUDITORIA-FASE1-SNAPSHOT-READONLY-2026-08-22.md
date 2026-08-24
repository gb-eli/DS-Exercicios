# CENTRAL DS — FASE 1: SNAPSHOT E AUDITORIA READ-ONLY

**Data do snapshot:** 2026-08-22 10:12 BRT (13:12 UTC)  
**Projeto Supabase:** `Portal Lab DS - Plataformas Unificadas`  
**Project ref:** `iresvqwyaqotghjssncg`  
**PostgreSQL:** 17.6  
**Modo:** somente leitura — nenhuma DDL/DML aplicada

## 1. Bases congeladas por hash

- `DS-Exercicios-v14.10.8-AUDITADO.zip`
  - SHA-256: `78df1bf3515472918376708cd708d334658aef741da41943eec1a8534eb15179`
- `DS-Exercicios-v14.10.8.2-REFERENCIAS-HISTORICAS-AUDITADO.zip`
  - SHA-256: `23a26c223cb887200057a19d4e504f3eb9d55755664dc15fd286c0878e89d538`
- `PLANO_CENTRAL_DS_REFERENCIAS_VERSIONADAS_AUDITORIA_ALUNOS.md`
  - SHA-256: `080cbe0dd1c0ba40e8334e68ef7289f135072de5e9c341e20d48200cb647efc4`

## 2. Estado do banco no snapshot

| Item | Valor |
|---|---:|
| Alunos ativos | 85 |
| Exercícios ativos | 62 |
| Arquivos de referência atuais | 199 |
| Arquivos atuais de alunos | 450 |
| Revisões em `student_file_history` | 14.130 |
| Registros em `student_exercises` | 308 |
| `exercise_reference_versions` existe? | Não |
| `exercise_reference_version_files` existe? | Não |

### Fingerprints de integridade

Esses hashes não substituem um backup lógico; servem para detectar alteração do conjunto entre o preflight e a migração.

- referências atuais: `91b258f1ea253e22a7c13f80e3248196`
- arquivos atuais dos alunos: `e160d456994d8f131d5247e797fe6e1e`
- histórico dos arquivos: `f2068adb4146f7cc70ab3c83145029a6`
- progresso/nota dos exercícios: `815fe3fc96a6556ccd5f348b6e4492f3`

## 3. Turmas ativas

| Turma | Alunos ativos |
|---|---:|
| 1DS-A-MANHA | 25 |
| 2DS-A-MANHA | 30 |
| 3DS-C-MANHA | 18 |
| DS-SUB-NOITE | 12 |

Total: **85 alunos ativos**.

## 4. Linha de produção que precisa ser preservada

- Última migration aplicada no Supabase: `20260820040251_p112_legacy_help_progress_merge`.
- `exercise-autograde` em produção: **v7**, `verify_jwt=true`.
- SHA-256 reportado da Edge Function viva: `17aa4170426ac74575de2b37eb99423f618e8bebed84da5308d8813c86ef04d0`.

Conclusão: qualquer versão histórica deve ser incorporada **sobre o contrato do autograder v7**, preservando:

- sessão supervisionada obrigatória;
- `grade` / `submit`;
- `set_help_hint`;
- `merge_help_legacy`;
- pontuação oficial que não diminui em nova submissão;
- required files por disciplina;
- sincronização do progresso de ajuda.

## 5. Exercícios com maior risco de troca de referência durante o trabalho

Critério: aluno começou antes do `updated_at` mais recente da referência e continuou editando depois desse instante.

| Prioridade | Turma | Disciplina | Ex. | Alunos com histórico analisável | Começaram antes | Atravessaram troca |
|---:|---|---|---:|---:|---:|---:|
| 1 | 1DS-A-MANHA | introducao-programacao | 06 | 13 | 8 | **4** |
| 2 | 1DS-A-MANHA | introducao-programacao | 07 | 5 | 4 | **4** |
| 3 | DS-SUB-NOITE | programacao-front-end-sub | 04 | 5 | 4 | **3** |
| 4 | 2DS-A-MANHA | programacao-front-end | 16 | 8 | 8 | **2** |
| 5 | 1DS-A-MANHA | introducao-programacao | 01 | 7 | 6 | **2** |
| 6 | 1DS-A-MANHA | introducao-programacao | 05 | 4 | 3 | 1 |
| 7 | 1DS-A-MANHA | introducao-programacao | 04 | 1 | 1 | 1 |
| 8 | 2DS-A-MANHA | programacao-front-end | 12 | 1 | 1 | 1 |
| 9 | DS-SUB-NOITE | programacao-front-end-sub | 03 | 1 | 1 | 1 |

Esses são os primeiros candidatos para a auditoria histórica detalhada após a importação das referências versionadas.

## 6. Evidência de múltiplas referências já existentes no ZIP

A varredura local da v14.10.8 identificou:

- **70 chaves exercício/arquivo** catalogadas na extração de variantes;
- **64 arquivos** com mais de uma variante conhecida;
- fontes diferentes como `exercise-reference`, `exercise-reference-ds2-corrected`, `exercise-reference-catalog-current` e `exercise-reference-synced`.

Isso comprova que a redundância de referências já existe no projeto; o banco apenas não possui uma camada formal para preservá-la.

## 7. PNG publicado

O ZIP contém imagens de várias áreas do sistema, porém a auditoria automática do pacote **não localizou um conjunto confiável e identificado de PNGs de código de referência dos exercícios**. Portanto, a origem `png` não pode ser reconstruída silenciosamente a partir de imagens genéricas do pacote.

Regra para a próxima fase:

- somente cadastrar `source_type='png'` quando o PNG original/publicado estiver disponível ou quando seu código puder ser comprovadamente vinculado a um snapshot oficial existente;
- não inventar versão PNG a partir da referência atual.

## 8. Advisors de segurança — baseline

O advisor não apontou falha específica nas tabelas de trabalho do aluno usada nesta auditoria, mas existem avisos prévios no projeto que devem permanecer fora do escopo da migração de referências, salvo se afetarem diretamente o novo schema.

Principais grupos observados:

- tabelas com RLS ativado e sem policy explícita, em vários casos aparentemente destinadas a acesso service-side;
- funções `SECURITY DEFINER` em `public` executáveis por `anon`/`authenticated`, incluindo guards de referência;
- proteção contra senhas vazadas desativada.

Para as **novas** estruturas de versionamento a regra será mais restritiva:

- RLS ativado desde a criação;
- `anon`: sem acesso;
- aluno autenticado: somente leitura de versões liberadas para exercício que ele pode acessar;
- staff: leitura conforme escopo;
- escrita: service-side/migration, nunca aluno.

## 9. Advisors de performance — baseline

Existem avisos anteriores de FKs sem índice, índices ainda sem uso e políticas permissivas múltiplas. Nenhum deles justifica mexer na produção durante esta Fase 1.

Na modelagem nova serão criados índices somente para os caminhos necessários:

- `exercise_id`;
- `reference_version_id`;
- `exercise_id + is_current`;
- `exercise_id + version_key`;
- `student_id + exercise_id` para a futura auditoria/cache.

## 10. Backup antes de qualquer escrita

**Nenhuma escrita foi feita nesta fase.**

Antes da primeira migration em produção deve existir um backup lógico/restaurável. O conector disponível nesta sessão não oferece operação de download de backup/`db dump`, então o snapshot atual é apenas de integridade, não substitui o dump.

Procedimento obrigatório antes da migration:

1. gerar backup lógico pelo Supabase CLI (`supabase db dump`) ou confirmar backup restaurável no Dashboard;
2. registrar data/hora do backup;
3. repetir os fingerprints acima;
4. se os fingerprints divergirem, gerar novo preflight antes da DDL;
5. somente então aplicar a migration de referências versionadas.

## 11. Decisão da Fase 1

**APROVADA para avançar ao desenvolvimento local da Fase 2.**

**NÃO aprovada para escrita em produção ainda.**

Motivos:

- schema de versões ainda não existe em produção;
- há casos reais de alunos atravessando troca de referência;
- o ZIP já possui variantes oficiais suficientes para justificar histórico;
- é preciso preservar o autograder v7;
- backup restaurável ainda precisa ser confirmado antes da primeira DDL.

## 12. Próxima implementação

Fase 2 será preparada localmente com:

1. `exercise_reference_versions` — metadados da versão/publicação;
2. `exercise_reference_version_files` — arquivos integrantes da versão;
3. compatibilidade por arquivo para combinações mistas;
4. captura automática de novas alterações de `exercise_reference_files`;
5. RLS restritivo;
6. sem alteração de `student_files`, `student_file_history`, notas ou feedbacks;
7. preflight e rollback documentados.
