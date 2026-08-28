# Auditoria geral por fases — DS Exercícios v14.10.0

Data: 19/08/2026  
Base auditada: ZIP `exe3ds (1).zip` enviado pelo usuário.  
Release candidato: **14.10.0** — UI **0.22.0**.

## Resumo executivo

A versão enviada já continha vários hotfixes visuais recentes, mas a auditoria encontrou divergências funcionais e de fonte que justificavam nova revisão. A linha de base tinha **93 testes: 81 aprovados e 12 falhas** (parte das falhas era suíte histórica desatualizada). Após correções, restauração das auditorias recentes e novos testes específicos, a suíte terminou em **160/160 testes aprovados, 0 falhas**. Todos os arquivos JavaScript do projeto passaram em `node --check`.

O catálogo público contém **62 exercícios ativos**. A auditoria integral das referências não encontrou `\\n` importado como texto, três linhas vazias consecutivas artificiais, referência ausente, JavaScript inválido, Python inválido, seletor JavaScript apontando para ID inexistente ou CSS embutido quando existe arquivo CSS separado.

## Fase 1 — Estrutura, versão e baseline

- Identificada a base enviada como v14.9.4 / UI 0.21.4.
- Confirmado o renderer `linefix` e o hotfix de alto contraste já presentes.
- Baseline: 93 testes, 81 pass, 12 fail.
- Restaurados testes de auditoria P8.7 até P9.5 que não estavam presentes no ZIP enviado.
- Release consolidado em v14.10.0 / UI 0.22.0 com cache bust único para Atividades e superfícies críticas revisadas.

## Fase 2 — Exercícios, referências e coerência dos códigos

- Auditados os **62 exercícios do manifesto** e seus arquivos de referência.
- Produção Supabase verificada: 62 exercícios ativos/visíveis, sem arquivos com newline literal e sem anomalia de múltiplas linhas vazias detectada.
- Python de referência é compilado na regressão.
- JavaScript de referência é compilado com `new Function` na regressão.
- HTML/CSS/JS são conferidos quanto a ligação entre arquivos e IDs usados pelo JavaScript.
- **Bug corrigido:** Exercício 05 de Front-End 2DS ainda declarava `style.css` no manifesto, mas referência e HTML usam `estilo.css`. O manifesto agora usa `estilo.css`, evitando arquivo duplicado e Preview quebrado.
- Mantido Front-End 2DS 01–20 com HTML, CSS e JavaScript separados.

## Fase 3 — Referência, linha fantasma, espaço fantasma e cores

- O renderer de referência mantém **1 linha do arquivo = 1 linha visual**.
- Nenhum `\n` é inserido artificialmente entre os elementos de linha (`join('')`).
- A quebra final normal do arquivo não cria uma última linha numerada vazia.
- Linhas vazias reais internas são preservadas.
- O container da referência usa `white-space: normal`; somente o conteúdo de cada linha usa `white-space: pre`, impedindo whitespace do DOM de virar linha fantasma.
- Referência usa line-height compacto 1.35, sem margem/padding vertical artificial.
- Alias de referência corrigido para `atividade.md ↔ referencia.md` e `main.kt ↔ MainActivity.kt`.
- Paleta de alto contraste confirmada contra fundo `#1e1e1e`: texto 15.16:1; número de linha 8.40:1; comentário 8.10:1; string 8.41:1; número 12.31:1; keyword 9.67:1; tag 9.35:1; atributo 12.37:1.

## Fase 4 — Editor e código fantasma

- Removido o newline artificial que existia apenas na camada de syntax highlight e podia causar desalinhamento/scroll fantasma.
- Textarea permanece visível enquanto o highlight não estiver validado; somente entra em modo transparente quando `pre.textContent === editor.value`.
- Editor, gutter e highlight usam a mesma fonte/line-height.
- Numeração acompanha o scroll do textarea.
- Nenhum JavaScript crítico de Atividades grava CSS inline no elemento de progresso da autocorreção.

## Fase 5 — Preview e execução

- **Bug corrigido:** ao embutir `script.js`, o Preview podia remover semanticamente o `defer` e executar o código no `<head>` antes de o DOM existir.
- Novo `preview-builder.js` preserva a semântica: script clássico local com `defer` é movido para o final do `body` quando é incorporado.
- CSS local é incorporado ao Preview; assets externos/desconhecidos não são substituídos indevidamente.
- Preview continua em host dedicado e sandbox `allow-scripts`, sem `allow-same-origin`.
- Python continua executado no terminal/runtime Python; Markdown possui preview textual isolado.

## Fase 6 — Salvamento, arquivos e downloads

- Fonte local de `student-files` reconciliada com o comportamento do v7 ativo em produção: session guard, `save`, `save_all`, `checkpoint` e criação somente de arquivo esperado ausente.
- Reconciliação preserva código já salvo pelo aluno e não sobrescreve arquivos existentes.
- Downloads aguardam salvamentos pendentes e usam somente arquivos do aluno.
- ZIP de download não inclui referência pedagógica nem regra privada.

## Fase 7 — GitHub e Classroom

- Confirmados botões permanentes **GitHub** e **Classroom** no workspace.
- Ambos salvam antes de abrir.
- GitHub usa configuração por disciplina (`repository_urls`) com compatibilidade ao campo legado e valida URL `https://github.com/usuario/repositorio`.
- Classroom resolve vínculo por turma + disciplina e mantém fallback das disciplinas já configuradas.

## Fase 8 — Porcentagens durante a digitação e autocorreção

- Adicionadas três métricas visíveis no workspace: **Conclusão**, **Acerto** e **Erro**.
- Conclusão é estimada localmente durante a digitação, por arquivo, comparando o volume estrutural preenchido com a referência pública. Ela não é apresentada como nota.
- Acerto/Erro são autoridade server-side e são recalculados automaticamente depois de uma breve pausa na digitação quando a sessão supervisionada está ativa.
- Debounce: 1,8 s após digitação; limite de nova correção automática em ~3,5 s para evitar excesso de chamadas.
- Botão **Auto corrigir** permanece disponível para correção manual imediata.
- Barra de acerto passou a usar `<progress>` em vez de `element.style.width`, compatível com a CSP sem `unsafe-inline`.
- Entrega parcial continua permitida; `submitted_score` registra a nota da entrega. Para Front-End 2DS, os três arquivos precisam existir e ter conteúdo.

## Fase 9 — Backend, segurança e reprodutibilidade

- Produção verificada com `student-files v7`, `exercise-autograde v3` e `staff-dashboard v10` ativos.
- O ZIP enviado estava atrás da produção em código-fonte de `student-files` e não trazia `exercise-autograde`; a fonte auditada foi restaurada/sincronizada no pacote completo.
- Migrations e testes das auditorias recentes ausentes no ZIP enviado foram restaurados para tornar o projeto reproduzível.
- `agv-core-browser-bootstrap.js` deixou de usar `@supabase/supabase-js@2/+esm` e passa a usar UMD pinado 2.111.0 com fonte de contingência.
- Nenhum redeploy de Edge Function ou migration foi necessário nesta auditoria; backend de produção foi apenas verificado.

## Fase 10 — Regressão e bundle público

- **160/160 testes aprovados**.
- **Todos os `.js` passaram em `node --check`**.
- 16 rotas principais do bundle público auditadas: **0 referências locais ausentes**.
- Bundle público: **0 ocorrências** de `SUPABASE_SERVICE_ROLE_KEY`, `sb_secret_`, `AGV_PRIVATE_EXERCISE_RULES_V1` ou arquivo privado de gabarito.
- Um arquivo de teste interno do Lab Virtual que continha marcador `sb_secret_` foi excluído do bundle público; permanece apenas como material de desenvolvimento no pacote-fonte.

## Resultado

O código está em condição de **release candidate auditado**. O próximo passo operacional é publicar o conteúdo do bundle `PUBLIC-DEPLOY-DS-v14.10.0.zip` no host atual e executar um smoke autenticado com uma conta real de aluno. Nenhuma conta de aluno foi criada ou alterada para esta auditoria.
