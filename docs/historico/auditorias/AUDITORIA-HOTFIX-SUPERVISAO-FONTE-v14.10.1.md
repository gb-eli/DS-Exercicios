# Auditoria Hotfix v14.10.1 — Supervisão não bloqueante + fonte/linhas sincronizadas

**Data:** 2026-08-19  
**Base auditada:** v14.10.0  
**Candidato:** v14.10.1 / Atividades UI 0.22.1  
**Fase:** P10.1-supervisao-nao-bloqueante-font-sync

## 1. Bloqueio indevido por saídas da atividade

### Causa raiz
A Edge Function `supervision` v3 registrava `visibility_hidden` e `fullscreen_exit` em `focus_violation_count`. Ao atingir `max_focus_violations` (3 em todas as 92 políticas), o backend alterava `student_exercises` para `status='blocked'`, `security_locked=true` e gravava a mensagem `Limite de 3 saídas da atividade atingido.`.

### Correção aplicada em produção
Foi aplicada a migration `disable_automatic_focus_exit_locking` / fonte local `core/database/039_p101_disable_automatic_focus_exit_locking.sql`.

A política de produção passou a ser não bloqueante por quantidade de saídas:
- 92/92 políticas com `max_focus_violations = 1.000.000`;
- trigger de banco impede que painel/importador restaure limite baixo;
- saídas continuam registradas em telemetria/supervisão;
- bloqueios de segurança por outros motivos não foram removidos.

Também foram desbloqueadas exclusivamente atividades/sessões cujo motivo era o limite de saídas.

**Verificação pós-correção:**
- atividades ainda bloqueadas por limite de saídas: **0**;
- sessões ainda bloqueadas por limite de saídas: **0**;
- políticas com modo não bloqueante: **92/92**.

> A Edge Function `supervision` de produção permanece na v3. O bloqueio por quantidade foi neutralizado no banco. A fonte v14.10.1 já remove o ramo de bloqueio automático para um futuro deploy controlado.

## 2. Referência e editor com tipografia idêntica

Foi criado um conjunto único de variáveis CSS para editor, realce, gutter e referência:
- fonte padrão: **14 px**;
- família: Cascadia Code / JetBrains Mono / SFMono-Regular / Consolas / monospace;
- altura de linha: **1.55**;
- mesma métrica em editor do aluno, syntax highlight, números de linha e código de referência.

Isso elimina o efeito em que a referência ficava mais comprimida que o editor.

## 3. Controles de tamanho − / +

O workspace ganhou controles `−` e `+` na barra de ferramentas.
- intervalo: **11 px a 22 px**;
- passo: **1 px**;
- altera referência e editor simultaneamente;
- altera também gutter/números de linha;
- preferência persistida em `localStorage` (`epds:code-font-size`).

## 4. Linha fantasma / código na mesma linha

O renderer mantém a regra:
- uma linha real do arquivo = um elemento visual `.reference-line`;
- os elementos são unidos com `join('')`, sem inserir newline DOM artificial;
- somente a quebra final vazia criada pelo EOF é retirada;
- linhas vazias intencionais dentro do código são preservadas;
- `.reference-line-code` usa `white-space: pre`;
- editor e referência usam a mesma altura de linha.

Auditoria no Supabase de produção:
- referências ativas/visíveis: **148**;
- referências multiline: **148**;
- referências colapsadas com `\\n` literal sem newline real: **0**.

Portanto, não há referência ativa armazenada em uma única linha por erro de transporte.

## 5. Interface de supervisão

A interface passou a informar que:
- as saídas são registradas para supervisão;
- não há bloqueio automático por quantidade de saídas.

O painel Admin deixa de oferecer um limite baixo de saídas e envia o valor não bloqueante de 1.000.000.

## 6. Segurança preservada

A correção não desativa:
- registro de eventos de supervisão;
- detecção de padrões maliciosos;
- bloqueio server-side por regras de segurança reais;
- session guard;
- liberação pedagógica de exercícios;
- fullscreen do portal quando aplicável.

Somente o bloqueio automático baseado na contagem de saídas foi neutralizado.

## 7. Regressão

Resultado da suíte integral:
- **165 testes**;
- **165 aprovados**;
- **0 falhas**.

Sintaxe JavaScript:
- **711 arquivos `.js` verificados com `node --check`**;
- **0 falhas**.

## 8. Status de publicação

- **Correção de banco para o bloqueio por saídas: ativa em produção.**
- **Frontend v14.10.1: ainda precisa ser publicado no host atual.**
- Não foi feito novo deploy da Edge Function `supervision`; produção permanece v3 com política de banco não bloqueante.
