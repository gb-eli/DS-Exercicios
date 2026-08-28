# Auditoria v0.1.41 — Estado dos códigos e layout dos editores

## Problemas confirmados

1. `shell.js` injetava controles de fonte em todos os `.code-window`, inclusive no editor do aluno, que já possuía controles próprios. Isso duplicava barras e fazia os cabeçalhos quebrarem/desalinharem.
2. O objeto `window.DISCIPLINES` registrava Mobile, mas não Front-End. A troca entre disciplinas podia ficar inconsistente.
3. O armazenamento ainda usava `state_v2`, sem metadados explícitos de disciplina/exercício/arquivo. Estados antigos contaminados continuavam sendo aceitos sem checagem de tipo de conteúdo.
4. A troca de arquivo não criava uma barreira explícita de salvamento antes de mudar o contexto visual.
5. O Modo VS Code acumulava controles demais nos cabeçalhos e a barra de status podia sobrepor visualmente a parte inferior do workspace.

## Correções

- `state_v3` com contexto: usuário + disciplina + exercício + arquivo.
- Migração de `state_v2` somente após validação de compatibilidade do conteúdo.
- HTML, CSS, JavaScript e Python recebem verificação básica contra contaminação cruzada.
- Se houver conteúdo incompatível, a plataforma tenta nesta ordem: snapshot atual compatível → cópia de segurança anterior (`_backup`) → snapshot da cópia de segurança. Só depois isola o conteúdo. O `state_v2` antigo permanece preservado.
- Salvamento forçado antes de trocar de arquivo, exercício ou disciplina.
- Registro correto de `frontend` e `mobile` em `window.DISCIPLINES`.
- Controles globais de fonte não são mais injetados no editor do aluno.
- Barra de comandos do editor separada do cabeçalho do arquivo.
- Modo VS Code com cabeçalhos únicos, referência e editor alinhados e Status Bar fixa com espaço reservado.
- Layout normal reorganizado para manter referência e editor lado a lado em desktop/notebook.

## Testes executados

- `node --check` em todos os JavaScripts.
- Parsing dos CSS com PostCSS: sem erros.
- HTML sem IDs duplicados.
- Simulação de migração com JavaScript colocado propositalmente no slot HTML: conteúdo incompatível detectado.
- Simulação com backup contendo o HTML correto: HTML recuperado automaticamente da cópia de segurança.
- Simulação de migração de HTML/CSS/JS válidos: conteúdos preservados.
- Simulação FE01 -> FE02: nenhuma resposta de FE01 aparece em FE02.
- Registro das disciplinas: `frontend` e `mobile` presentes e com prefixes `ds2sub_frontend` e `ds2sub_mobile`.

## Observação

O teste visual automatizado via Chromium headless não pôde ser concluído neste ambiente porque o processo do Chromium ficou bloqueado. As regras CSS, a estrutura HTML e os breakpoints foram validados estaticamente; os prints enviados pelo usuário foram usados como referência para a reorganização.
