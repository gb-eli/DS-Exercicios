# AGV • Hub Educacional — Patch Front-End Sub v0.1.41

## Objetivo

Aplicar o padrão do ambiente de prática do **2DS Sub — Programação Front-End** sem alterar o conteúdo pedagógico dos exercícios FE01–FE07:

- referência completa à esquerda;
- editor do aluno à direita;
- referência somente leitura e bloqueada para copiar;
- numeração de linhas;
- realce de sintaxe no padrão visual do VS Code;
- `Salvar`, `Baixar arquivo`, `Baixar ZIP`, `GitHub` e `Google Classroom` sempre acessíveis;
- download baseado nos arquivos reais do aluno em `student_files`;
- layout responsivo: referência acima do editor em telas estreitas.

## O que já foi aplicado no Supabase

O banco de produção já recebeu:

1. `exercise_reference_files` para FE01–FE07 (24 arquivos no total (FE01–FE06 com 3 cada; FE07 com 6));
2. liberação uniforme de HTML/CSS/JS base para FE01–FE07 na turma DS-SUB-NOITE;
3. configuração `exercises.config.student_workspace` em FE01–FE07;
4. link do Classroom da disciplina no `classroom_links`;
5. correção da constraint de URL do Classroom.

Não reaplique migrations antigas nem insira gabaritos de professor no pacote do aluno.

## Integração recomendada

Copie:

```text
assets/css/reference-workspace.css
assets/js/reference-workspace.js
```

para a mesma estrutura do projeto atual.

No HTML do ambiente de prática, carregue o CSS **depois** do CSS principal:

```html
<link rel="stylesheet" href="assets/css/reference-workspace.css?v=0.1.41">
```

Carregue o JavaScript **depois** de autenticação, Supabase e `app.js`, para que o cliente autenticado e o editor já existam:

```html
<script src="assets/js/reference-workspace.js?v=0.1.41"></script>
```

Depois inicialize apontando para o container real da prática e o painel real do editor:

```html
<script>
window.addEventListener('load', () => {
  AGVReferenceWorkspacePatch.autoInit({
    client: window.supabaseClient, // substitua pela variável já usada no projeto, se necessário
    workspaceSelector: '.practice-workspace',
    studentPaneSelector: '.practice-editor-pane',
    saveHook: async () => {
      // Preferir a rotina atual da aplicação, sem duplicar persistência.
      // Ex.: await saveAllStudentFiles();
    }
  });
});
</script>
```

Se o cliente Supabase já estiver exposto como `window.supabaseClient`, `window.sb`, `window.client`, `window.AGV.supabase` ou equivalente reconhecido pelo patch, `client` pode ser omitido.

## Uso das rotinas existentes

A versão anterior do Front-End Sub já possuía `requestWorkDownload()` / `performWorkDownload()` e `Utils.createZip()`.

Ao integrar na fonte real, **prefira reaproveitar essas rotinas** no `saveHook`/botões existentes. O patch contém fallback próprio de ZIP sem dependência externa apenas para não deixar o recurso indisponível caso as funções antigas não estejam expostas globalmente.

## Regras de segurança

- Não inserir `service_role`, `sb_secret`, JWT secret ou senha de banco no frontend.
- O patch usa somente a sessão autenticada já aberta pela aplicação.
- `exercise_reference_files` continua protegido pelo RLS.
- `student_delivery_settings` é lido/escrito somente pelo próprio aluno conforme RLS.
- `classroom_links` é lido somente por aluno matriculado na turma correspondente.
- O ZIP contém apenas linhas da tabela `student_files` do aluno e exercício atuais.
- O código de referência nunca é incluído no ZIP do aluno.

## GitHub

Se `student_delivery_settings.repository_url` já existir, o botão abre o repositório.

Se estiver vazio, o aluno recebe o prompt:

```text
Cole o endereço do repositório atividades-frontend-sub no GitHub:
```

A URL é validada como `https://github.com/<usuario>/<repositorio>` e então gravada no registro do próprio aluno.

## Classroom

O botão consulta `classroom_links` usando a turma ativa e a disciplina do exercício. Para Programação Front-End Sub, o link já está cadastrado no banco.

## Responsividade

- Acima de 900 px: 50% referência / 50% editor.
- Até 900 px: referência em cima, editor embaixo.
- Até 520 px: botões ocupam duas colunas e a fonte do código reduz levemente.

## Verificação pós-publicação

1. Entrar como aluno do DS Sub.
2. Abrir FE06 por `?exercise=<uuid>`.
3. Confirmar no Network que existe GET para `exercise_reference_files`.
4. Confirmar 3 abas: `estilo.css`, `index.html`, `script.js` (ordem alfabética no patch).
5. Confirmar linhas numeradas e cores de sintaxe.
6. Digitar à direita e salvar.
7. Baixar arquivo atual e abrir o conteúdo.
8. Baixar ZIP e validar que contém apenas `student_files`.
9. Testar GitHub sem URL cadastrada e depois com URL salva.
10. Testar Classroom.
11. Repetir em celular/tablet.

