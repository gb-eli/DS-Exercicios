# Auditoria DS2 Front-End — HTML, CSS e JavaScript separados — v14.9.3

Data: 2026-08-19
Escopo: `programacao-front-end` — exercícios ativos/visíveis 01–20.

## Regra pedagógica adotada

Cada atividade de Front-End do 2DS possui exatamente três arquivos independentes e conectados:

- `index.html` — estrutura e conteúdo;
- `estilo.css` — aparência;
- `script.js` — comportamento.

O HTML referencia `estilo.css` com `<link rel="stylesheet" ...>` e `script.js` com `<script src="script.js" defer></script>`.
Não é permitido colocar CSS em `<style>`/`style=` nem JavaScript em atributos `onclick`, `oninput`, `onchange` etc.

## Problemas encontrados

A versão anteriormente importada no Supabase tinha referências genéricas em que:

- os 20 exercícios ativos tinham HTML e JavaScript, mas não tinham referência CSS separada;
- o CSS estava dentro de `<style>` no próprio HTML;
- alguns códigos não correspondiam ao objetivo cadastrado do exercício;
- exemplos claros: Ex. 18 estava como contador de cliques em vez de contador de caracteres; Ex. 19 estava usando `classList` em vez de mostrar/ocultar senha;
- alguns HTMLs ainda possuíam eventos JavaScript inline (`onclick`).

## Correções aplicadas em produção

As referências dos exercícios 01–20 foram revisadas e normalizadas para três arquivos.
Também foram corrigidas divergências de conteúdo/objetivo, incluindo:

- Ex. 01 — alteração por `textContent`;
- Ex. 02 — modo claro/escuro com `classList.toggle()`;
- Ex. 04 — nome com `trim()`;
- Ex. 05 — contador simples que incrementa a cada clique;
- Ex. 07 — Celsius para Fahrenheit;
- Ex. 08 — média e situação aprovado/reprovado;
- Ex. 09 — validação de campo vazio/preenchido;
- Ex. 11 — laço `for` de 1 a 10;
- Ex. 12 — `typeof` para string, number, boolean, null e object;
- Ex. 16 — array de nomes, quantidade e inclusão de novo nome;
- Ex. 17 — `forEach` exibindo nome e posição;
- Ex. 18 — contador de caracteres em tempo real com evento `input`;
- Ex. 19 — mostrar/ocultar senha alterando `type`.

Os HTMLs que ainda dependiam de `onclick` foram migrados para IDs + `addEventListener` no `script.js`.

## Auditoria final do Supabase

Resultado pós-correção:

- 20 exercícios ativos auditados;
- 60 arquivos de referência no total;
- 20/20 com `index.html`;
- 20/20 com `estilo.css`;
- 20/20 com `script.js`;
- 0 HTML com `<style>`;
- 0 HTML com atributo `style=`;
- 0 HTML com `onclick`, `oninput`, `onchange`, `onsubmit`, `onkeyup` ou `onkeydown`;
- 0 HTML sem link para `estilo.css`;
- 0 HTML sem ligação para `script.js`;
- 0 CSS em uma única linha;
- 0 JavaScript em uma única linha;
- 0 seletor/ID utilizado pelo JavaScript sem elemento correspondente no HTML;
- 20/20 liberações com HTML/CSS/JS-base habilitados.

## Proteção contra regressão

Migration em produção: `guard_ds2_frontend_canonical_three_files`.

Enquanto o exercício 01–20 estiver ativo e visível, o banco:

- aceita somente `index.html`, `estilo.css` e `script.js` como referências;
- rejeita CSS embutido;
- rejeita JavaScript inline em atributos `on*`;
- exige conexão com CSS e JS;
- rejeita remoção de um dos arquivos canônicos.

Teste adversarial em produção confirmou a recusa de CSS embutido, evento inline, quarto arquivo e exclusão de arquivo canônico.

## Código dos alunos

Nenhum `student_files.content` foi modificado durante esta correção.

Na auditoria, 28 workspaces de alunos já existentes no 2DS possuíam os três arquivos (`index.html`, `estilo.css`, `script.js`).
A Edge Function `student-files v7` agora também reconcilia workspaces antigos: caso falte um arquivo esperado, adiciona somente o arquivo ausente sem sobrescrever os demais.

## Autocorreção

`exercise-autograde v3` está ativo em produção e considera cada uma das três referências.

- arquivo ausente = 0 naquele componente;
- arquivo vazio = 0 naquele componente;
- código parcial continua recebendo percentual parcial;
- no 2DS, a entrega exige que os três arquivos existam e possuam conteúdo;
- não é necessário obter 100% para entregar;
- 100% continua reservado ao código estruturalmente correto.

Os percentuais provisórios calculados antes da referência em três arquivos foram preservados no metadata e zerados para recálculo; nenhuma nota final `submitted_score` foi apagada.

## Frontend / fallback

Foi criado `exercise-reference-ds2-corrected.js` com as 20 referências canônicas em três arquivos e o workspace v14.9.3 o utiliza como primeira contingência local para o 2DS.
Isso impede que uma falha transitória do Supabase faça o portal voltar às referências antigas.

## Testes

- suíte específica P9.5: 6/6 aprovada;
- regressão integral: 149/149 aprovada;
- `node --check` nos JavaScripts da área de atividades: aprovado;
- JSONs: válidos.

## Produção x publicação

Banco, trigger e Edge Functions desta correção já estão ativos no Supabase de produção.
O frontend v14.9.3 ainda precisa substituir a versão hospedada para garantir o fallback corrigido, a reconciliação visual e o cache novo em todos os computadores.
