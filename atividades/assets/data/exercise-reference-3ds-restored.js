// Referências pedagógicas públicas restauradas para 3DS — exercícios 05 a 08.
// Conteúdo destinado à transcrição manual do aluno. Não contém critérios privados de correção.

export const EXERCISE_REFERENCE_3DS_RESTORED = {
  'programacao-desenvolvimento-sistemas:5': {
    titulo: 'Exercício 05 — Protótipo HTML de Painel Administrativo',
    mode: 'transcricao',
    languages: {'index.html':'html','estilo.css':'css','script.js':'javascript'},
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Painel administrativo</title>
  <link rel="stylesheet" href="estilo.css">
  <script src="script.js" defer></script>
</head>
<body>
  <header>
    <h1>Painel administrativo</h1>
    <nav aria-label="Navegação do painel">
      <a href="#visao-geral">Visão geral</a>
      <a href="#indicadores">Indicadores</a>
      <a href="#cadastro">Cadastro</a>
      <a href="#registros">Registros</a>
    </nav>
  </header>

  <main>
    <section id="visao-geral">
      <h2>Visão geral</h2>
      <p>Acompanhe os dados principais e registre novos usuários.</p>
      <a href="#cadastro">Ir para o cadastro</a>
    </section>

    <section id="indicadores">
      <h2>Indicadores</h2>
      <div class="indicadores">
        <article><h3>Usuários</h3><strong>24</strong><p>Cadastros ativos</p></article>
        <article><h3>Projetos</h3><strong>8</strong><p>Projetos em andamento</p></article>
        <article><h3>Alertas</h3><strong>3</strong><p>Itens para revisar</p></article>
        <article><h3>Entregas</h3><strong>17</strong><p>Entregas concluídas</p></article>
      </div>
    </section>

    <section id="cadastro">
      <h2>Novo usuário</h2>
      <form id="formCadastro">
        <label for="nome">Nome</label>
        <input id="nome" name="nome" type="text" autocomplete="name" required>

        <label for="email">E-mail</label>
        <input id="email" name="email" type="email" autocomplete="email" required>

        <label for="setor">Setor</label>
        <select id="setor" name="setor" required>
          <option value="">Selecione</option>
          <option>Desenvolvimento</option>
          <option>Suporte</option>
        </select>

        <fieldset>
          <legend>Status inicial</legend>
          <label><input type="radio" name="status" value="Ativo" required> Ativo</label>
          <label><input type="radio" name="status" value="Pendente"> Pendente</label>
        </fieldset>

        <label for="observacao">Observação</label>
        <input id="observacao" name="observacao" type="text">

        <button type="submit">Cadastrar</button>
        <button type="reset">Limpar</button>
      </form>
      <p id="mensagem" role="status" aria-live="polite"></p>
    </section>

    <section id="registros">
      <h2>Registros</h2>
      <div class="tabela-responsiva">
        <table>
          <caption>Usuários cadastrados no sistema</caption>
          <thead>
            <tr><th scope="col">Nome</th><th scope="col">E-mail</th><th scope="col">Setor</th><th scope="col">Perfil</th><th scope="col">Status</th></tr>
          </thead>
          <tbody>
            <tr><td>Ana Lima</td><td>ana@exemplo.com</td><td>Desenvolvimento</td><td>Aluna</td><td>Ativo</td></tr>
            <tr><td>Bruno Reis</td><td>bruno@exemplo.com</td><td>Suporte</td><td>Monitor</td><td>Pendente</td></tr>
            <tr><td>Carla Dias</td><td>carla@exemplo.com</td><td>Desenvolvimento</td><td>Aluna</td><td>Ativo</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>

  <footer><p>Protótipo administrativo • 3DS</p></footer>
</body>
</html>
`,
      'estilo.css': `* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; background: #f4f7fb; color: #182233; }
header, main, footer { width: min(1080px, 92%); margin: auto; }
header { padding: 24px 0 12px; }
nav { display: flex; flex-wrap: wrap; gap: 12px; }
main { display: grid; gap: 16px; padding: 16px 0 32px; }
section { padding: 18px; background: #fff; border: 1px solid #d8e0ea; border-radius: 14px; }
.indicadores { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }
.indicadores article { padding: 14px; border: 1px solid #d8e0ea; border-radius: 10px; }
form { display: grid; gap: 8px; }
input, select, button { min-height: 42px; font: inherit; }
.tabela-responsiva { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 10px; border-bottom: 1px solid #d8e0ea; text-align: left; }
`,
      'script.js': `const formulario = document.querySelector('#formCadastro');
const mensagem = document.querySelector('#mensagem');

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const nome = document.querySelector('#nome').value.trim();
  mensagem.textContent = nome ? \`Cadastro de ${'${nome}'} preparado com sucesso.\` : 'Preencha o nome.';
});
`
    }
  },

  'programacao-desenvolvimento-sistemas:6': {
    titulo: 'Exercício 06 — Cards e Box Model em um Painel',
    mode: 'transcricao',
    languages: {'index.html':'html','estilo.css':'css','script.js':'javascript'},
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cards e Box Model</title>
  <link rel="stylesheet" href="estilo.css">
  <script src="script.js" defer></script>
</head>
<body>
  <main class="painel">
    <header class="cabecalho-painel">
      <div><p class="rotulo">3DS</p><h1>Indicadores do projeto</h1></div>
      <button id="alternarEspacamento" type="button">Alternar espaçamento</button>
    </header>

    <section class="grade-cards" aria-label="Indicadores">
      <article class="card"><h2>Tarefas</h2><strong>12</strong><p>Itens planejados</p></article>
      <article class="card"><h2>Concluídas</h2><strong>7</strong><p>Entregas finalizadas</p></article>
      <article class="card"><h2>Revisões</h2><strong>3</strong><p>Itens em validação</p></article>
      <article class="card"><h2>Pendências</h2><strong>2</strong><p>Itens para corrigir</p></article>
    </section>
  </main>
</body>
</html>
`,
      'estilo.css': `*, *::before, *::after { box-sizing: border-box; }
:root { --fundo:#eef3f8; --painel:#ffffff; --borda:#cad5e1; --texto:#1b2735; --destaque:#1264a3; }
body { margin: 0; min-height: 100vh; font-family: system-ui, sans-serif; background: var(--fundo); color: var(--texto); }
.painel { width: min(1000px, 92%); margin: 0 auto; padding: 32px 0; }
.cabecalho-painel { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 20px; }
.rotulo { margin: 0; color: var(--destaque); font-weight: 800; }
.grade-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 16px; }
.card { min-width: 0; margin: 0; padding: 20px; border: 2px solid var(--borda); border-radius: 14px; background: var(--painel); overflow-wrap: anywhere; }
.card h2 { margin: 0 0 12px; font-size: 1rem; }
.card strong { display: block; margin-bottom: 8px; font-size: 2rem; }
.card p { margin: 0; }
.painel.compacto .grade-cards { gap: 8px; }
.painel.compacto .card { padding: 12px; border-width: 1px; }
button { min-height: 42px; padding: 0 14px; border: 0; border-radius: 9px; background: var(--destaque); color: white; font: inherit; cursor: pointer; }
@media (max-width: 640px) { .cabecalho-painel { align-items: stretch; flex-direction: column; } }
`,
      'script.js': `const painel = document.querySelector('.painel');
const botao = document.querySelector('#alternarEspacamento');

botao.addEventListener('click', () => {
  const compacto = painel.classList.toggle('compacto');
  botao.textContent = compacto ? 'Usar espaçamento normal' : 'Alternar espaçamento';
});
`
    }
  },

  'programacao-desenvolvimento-sistemas:7': {
    titulo: 'Exercício 07 — Barra de Ferramentas com Flexbox',
    mode: 'transcricao',
    languages: {'index.html':'html','estilo.css':'css','script.js':'javascript'},
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Toolbar com Flexbox</title>
  <link rel="stylesheet" href="estilo.css">
  <script src="script.js" defer></script>
</head>
<body>
  <main>
    <h1>Projetos da turma</h1>
    <section class="barra-ferramentas" aria-label="Ferramentas do painel">
      <div class="grupo-busca">
        <label for="busca">Buscar projeto</label>
        <input id="busca" type="search" placeholder="Digite um nome">
      </div>
      <div class="grupo-acoes">
        <button id="filtrar" type="button">Filtrar</button>
        <button id="ordenar" type="button">Ordenar</button>
        <button id="novo" type="button">Novo projeto</button>
      </div>
    </section>

    <section class="lista-projetos" id="listaProjetos">
      <article class="projeto"><h2>Portal escolar</h2><p>Front-End</p></article>
      <article class="projeto"><h2>Dashboard DS</h2><p>Interface</p></article>
      <article class="projeto"><h2>API acadêmica</h2><p>Back-End</p></article>
    </section>
    <p id="status" role="status" aria-live="polite"></p>
  </main>
</body>
</html>
`,
      'estilo.css': `* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; background: #f3f6fa; color: #172033; }
main { width: min(1040px, 92%); margin: auto; padding: 30px 0; }
.barra-ferramentas { display: flex; justify-content: space-between; align-items: end; flex-wrap: wrap; gap: 14px; padding: 16px; border: 1px solid #ccd6e2; border-radius: 12px; background: white; }
.grupo-busca { display: flex; flex: 1 1 280px; flex-direction: column; gap: 6px; min-width: 0; }
.grupo-acoes { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
input, button { min-height: 44px; border-radius: 9px; font: inherit; }
input { width: 100%; padding: 8px 11px; border: 1px solid #b9c6d5; }
button { padding: 0 14px; border: 0; background: #1264a3; color: white; cursor: pointer; }
button:focus-visible, input:focus-visible { outline: 3px solid #7dc7ff; outline-offset: 2px; }
.lista-projetos { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 12px; margin-top: 16px; }
.projeto { padding: 16px; border: 1px solid #ccd6e2; border-radius: 12px; background: white; }
@media (max-width: 680px) { .grupo-acoes, .grupo-acoes button { width: 100%; } }
`,
      'script.js': `const busca = document.querySelector('#busca');
const projetos = [...document.querySelectorAll('.projeto')];
const status = document.querySelector('#status');

busca.addEventListener('input', () => {
  const termo = busca.value.trim().toLowerCase();
  let visiveis = 0;
  projetos.forEach((projeto) => {
    const mostrar = projeto.textContent.toLowerCase().includes(termo);
    projeto.hidden = !mostrar;
    if (mostrar) visiveis += 1;
  });
  status.textContent = \`${'${visiveis}'} projeto(s) visível(is).\`;
});
`
    }
  },

  'programacao-desenvolvimento-sistemas:8': {
    titulo: 'Exercício 08 — Dashboard com CSS Grid',
    mode: 'transcricao',
    languages: {'index.html':'html','estilo.css':'css','script.js':'javascript'},
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard com CSS Grid</title>
  <link rel="stylesheet" href="estilo.css">
  <script src="script.js" defer></script>
</head>
<body>
  <main class="dashboard-grid" id="dashboard">
    <nav class="menu"><h1>DS Admin</h1><a href="#indicadores">Indicadores</a><a href="#atividade">Atividade</a><a href="#registros">Registros</a></nav>

    <section class="indicadores" id="indicadores">
      <article><span>Projetos</span><strong>18</strong></article>
      <article><span>Alunos</span><strong>32</strong></article>
      <article><span>Entregas</span><strong>74</strong></article>
      <article><span>Pendências</span><strong>6</strong></article>
    </section>

    <section class="painel atividade" id="atividade"><h2>Atividade recente</h2><p>Última sincronização há poucos minutos.</p><button id="densidade" type="button">Alternar densidade</button></section>
    <section class="painel tarefas"><h2>Tarefas</h2><ul><li>Revisar layout</li><li>Testar responsividade</li><li>Publicar projeto</li></ul></section>
    <section class="painel registros" id="registros"><h2>Registros</h2><div class="tabela"><table><thead><tr><th>Projeto</th><th>Status</th></tr></thead><tbody><tr><td>Portal</td><td>Ativo</td></tr><tr><td>Dashboard</td><td>Revisão</td></tr></tbody></table></div></section>
  </main>
</body>
</html>
`,
      'estilo.css': `* { box-sizing: border-box; }
:root { --fundo:#edf2f7; --painel:#fff; --borda:#d2dce8; --texto:#172033; --destaque:#135f99; }
body { margin: 0; font-family: system-ui, sans-serif; background: var(--fundo); color: var(--texto); }
.dashboard-grid { width: min(1180px, 94%); margin: 24px auto; display: grid; grid-template-columns: minmax(180px, .7fr) repeat(2, minmax(0, 1fr)); grid-template-areas: "menu indicadores indicadores" "menu atividade tarefas" "menu registros registros"; gap: 14px; }
.menu { grid-area: menu; display: flex; flex-direction: column; gap: 10px; padding: 18px; border-radius: 14px; background: #13243a; color: white; }
.menu a { color: #d9efff; }
.indicadores { grid-area: indicadores; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
.indicadores article, .painel { min-width: 0; padding: 16px; border: 1px solid var(--borda); border-radius: 14px; background: var(--painel); }
.indicadores strong { display: block; margin-top: 6px; font-size: 1.8rem; }
.atividade { grid-area: atividade; }
.tarefas { grid-area: tarefas; }
.registros { grid-area: registros; }
.tabela { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 10px; border-bottom: 1px solid var(--borda); text-align: left; }
.dashboard-grid.compacto { gap: 7px; }
.dashboard-grid.compacto .painel, .dashboard-grid.compacto .indicadores article { padding: 10px; }
button { min-height: 42px; padding: 0 14px; border: 0; border-radius: 8px; background: var(--destaque); color: white; font: inherit; }
@media (max-width: 900px) { .dashboard-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-areas: "menu menu" "indicadores indicadores" "atividade tarefas" "registros registros"; } .menu { flex-direction: row; flex-wrap: wrap; align-items: center; } .indicadores { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 620px) { .dashboard-grid { grid-template-columns: 1fr; grid-template-areas: "menu" "indicadores" "atividade" "tarefas" "registros"; } .indicadores { grid-template-columns: 1fr; } }
`,
      'script.js': `const dashboard = document.querySelector('#dashboard');
const botao = document.querySelector('#densidade');

botao.addEventListener('click', () => {
  const compacto = dashboard.classList.toggle('compacto');
  botao.textContent = compacto ? 'Usar densidade normal' : 'Alternar densidade';
});
`
    }
  }
};
