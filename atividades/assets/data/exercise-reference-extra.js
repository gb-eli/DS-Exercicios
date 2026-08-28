// Referências pedagógicas públicas adicionais — v14.8.7.
// Criadas especificamente para transcrição do aluno. Não contêm regras privadas de correção.

const cssBase = `:root {
  color-scheme: dark;
  --fundo: #0d1117;
  --painel: #161b22;
  --borda: #30363d;
  --texto: #e6edf3;
  --suave: #9da7b3;
  --destaque: #58a6ff;
  --sucesso: #3fb950;
  --perigo: #f85149;
}
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; font-family: Arial, Helvetica, sans-serif; background: var(--fundo); color: var(--texto); }
main { width: min(820px, 92%); margin: 0 auto; padding: 36px 0; }
section { background: var(--painel); border: 1px solid var(--borda); border-radius: 14px; padding: 22px; margin-bottom: 18px; }
h1 { margin-top: 0; }
p { color: var(--suave); line-height: 1.55; }
input, button, select { min-height: 44px; border-radius: 9px; font: inherit; }
input, select { width: 100%; padding: 9px 11px; margin: 6px 0 12px; color: var(--texto); background: #0d1117; border: 1px solid var(--borda); }
button { padding: 9px 15px; border: 0; background: var(--destaque); color: #07111f; font-weight: 800; cursor: pointer; }
button.secundario { background: #30363d; color: var(--texto); }
button.perigo { background: var(--perigo); color: white; }
ul { padding-left: 22px; }
li { margin: 8px 0; }
.linha { display: flex; gap: 9px; align-items: center; flex-wrap: wrap; }
.cartao { padding: 14px; border: 1px solid var(--borda); border-radius: 10px; margin: 10px 0; }
.mensagem { min-height: 24px; color: var(--suave); }
.destaque { border-color: var(--destaque); box-shadow: 0 0 0 2px rgba(88,166,255,.2); }
@media (max-width: 620px) { main { padding-top: 20px; } .linha > * { width: 100%; } }
`;

function html(titulo, corpo) {
  return `<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${titulo}</title>\n  <link rel="stylesheet" href="estilo.css">\n  <script src="script.js" defer></script>\n</head>\n<body>\n  <main>\n    <section>\n      <h1>${titulo}</h1>\n      ${corpo}\n    </section>\n  </main>\n</body>\n</html>\n`;
}

function ref(titulo, corpo, script, css = '') {
  return {
    titulo,
    mode: 'transcricao',
    files: {
      'index.html': html(titulo, corpo),
      'estilo.css': cssBase + css,
      'script.js': script.trim() + '\n'
    }
  };
}

export const EXERCISE_REFERENCE_EXTRAS = {
  'programacao-front-end:16': ref(
    'Exercício 16 — Lista de Nomes com Array',
    `<p>Um array guarda vários valores em uma única variável.</p>\n      <button id="mostrar" type="button">Mostrar nomes</button>\n      <ul id="lista"></ul>`,
    `const nomes = ['Ana', 'Bruno', 'Carla', 'Diego'];
const botao = document.querySelector('#mostrar');
const lista = document.querySelector('#lista');

botao.addEventListener('click', () => {
  lista.innerHTML = '';
  for (const nome of nomes) {
    const item = document.createElement('li');
    item.textContent = nome;
    lista.appendChild(item);
  }
});`
  ),

  'programacao-front-end:17': ref(
    'Exercício 17 — Percorrendo Arrays com forEach',
    `<p>Use <code>forEach()</code> para percorrer cada elemento.</p>\n      <button id="carregar" type="button">Carregar tecnologias</button>\n      <ul id="tecnologias"></ul>`,
    `const tecnologias = ['HTML', 'CSS', 'JavaScript', 'Git'];
const lista = document.querySelector('#tecnologias');
const botao = document.querySelector('#carregar');

botao.addEventListener('click', () => {
  lista.innerHTML = '';
  tecnologias.forEach((tecnologia, indice) => {
    const item = document.createElement('li');
    item.textContent = \`${'${indice + 1}'} - ${'${tecnologia}'}\`;
    lista.appendChild(item);
  });
});`
  ),

  'programacao-front-end:18': ref(
    'Exercício 18 — Eventos com addEventListener',
    `<p id="mensagem" class="mensagem">Clique no botão para disparar um evento.</p>\n      <button id="acao" type="button">Executar ação</button>`,
    `const botao = document.querySelector('#acao');
const mensagem = document.querySelector('#mensagem');
let cliques = 0;

botao.addEventListener('click', () => {
  cliques += 1;
  mensagem.textContent = \`Evento executado ${'${cliques}'} vez(es).\`;
});`
  ),

  'programacao-front-end:19': ref(
    'Exercício 19 — Manipulando Classes com classList',
    `<div id="cartao" class="cartao">Este cartão pode receber uma classe CSS.</div>\n      <button id="alternar" type="button">Alternar destaque</button>`,
    `const cartao = document.querySelector('#cartao');
const botao = document.querySelector('#alternar');

botao.addEventListener('click', () => {
  cartao.classList.toggle('destaque');
  const ativo = cartao.classList.contains('destaque');
  botao.textContent = ativo ? 'Remover destaque' : 'Alternar destaque';
});`
  ),

  'programacao-front-end:20': ref(
    'Exercício 20 — Lista de Tarefas',
    `<label for="tarefa">Nova tarefa</label>\n      <div class="linha">\n        <input id="tarefa" type="text" placeholder="Ex.: revisar JavaScript">\n        <button id="adicionar" type="button">Adicionar</button>\n      </div>\n      <ul id="lista"></ul>`,
    `const campo = document.querySelector('#tarefa');
const botao = document.querySelector('#adicionar');
const lista = document.querySelector('#lista');

function adicionarTarefa() {
  const texto = campo.value.trim();
  if (!texto) return;
  const item = document.createElement('li');
  item.textContent = texto;
  lista.appendChild(item);
  campo.value = '';
  campo.focus();
}

botao.addEventListener('click', adicionarTarefa);
campo.addEventListener('keydown', (evento) => {
  if (evento.key === 'Enter') adicionarTarefa();
});`
  ),

  'programacao-front-end:21': ref(
    'Exercício 21 — Lista de Tarefas com Edição e Remoção',
    `<label for="tarefa">Nova tarefa</label>\n      <div class="linha">\n        <input id="tarefa" type="text" placeholder="Digite uma tarefa">\n        <button id="adicionar" type="button">Adicionar</button>\n      </div>\n      <ul id="lista"></ul>`,
    `const campo = document.querySelector('#tarefa');
const lista = document.querySelector('#lista');

document.querySelector('#adicionar').addEventListener('click', () => {
  const texto = campo.value.trim();
  if (!texto) return;
  const item = document.createElement('li');
  const span = document.createElement('span');
  span.textContent = texto;
  const editar = document.createElement('button');
  editar.textContent = 'Editar';
  editar.className = 'secundario';
  const remover = document.createElement('button');
  remover.textContent = 'Remover';
  remover.className = 'perigo';

  editar.addEventListener('click', () => {
    const novoTexto = prompt('Edite a tarefa:', span.textContent);
    if (novoTexto?.trim()) span.textContent = novoTexto.trim();
  });
  remover.addEventListener('click', () => item.remove());

  item.append(span, ' ', editar, ' ', remover);
  lista.appendChild(item);
  campo.value = '';
});`
  ),

  'programacao-front-end:22': ref(
    'Exercício 22 — Cadastro Simples com Objeto',
    `<label for="nome">Nome</label>\n      <input id="nome" type="text">\n      <label for="idade">Idade</label>\n      <input id="idade" type="number" min="0">\n      <button id="cadastrar" type="button">Cadastrar</button>\n      <div id="resultado" class="cartao" hidden></div>`,
    `const nome = document.querySelector('#nome');
const idade = document.querySelector('#idade');
const resultado = document.querySelector('#resultado');

document.querySelector('#cadastrar').addEventListener('click', () => {
  const pessoa = {
    nome: nome.value.trim(),
    idade: Number(idade.value)
  };
  if (!pessoa.nome || !pessoa.idade) return;
  resultado.hidden = false;
  resultado.textContent = \`${'${pessoa.nome}'} tem ${'${pessoa.idade}'} anos.\`;
});`
  ),

  'programacao-front-end:23': ref(
    'Exercício 23 — Cadastro de Alunos com Array de Objetos',
    `<label for="nome">Aluno</label>\n      <input id="nome" type="text">\n      <label for="nota">Nota</label>\n      <input id="nota" type="number" min="0" max="10" step="0.1">\n      <button id="adicionar" type="button">Adicionar aluno</button>\n      <div id="alunos"></div>`,
    `const alunos = [];
const nome = document.querySelector('#nome');
const nota = document.querySelector('#nota');
const saida = document.querySelector('#alunos');

function renderizar() {
  saida.innerHTML = '';
  alunos.forEach((aluno) => {
    const cartao = document.createElement('div');
    cartao.className = 'cartao';
    cartao.textContent = \`${'${aluno.nome}'} — nota ${'${aluno.nota.toFixed(1)}'}\`;
    saida.appendChild(cartao);
  });
}

document.querySelector('#adicionar').addEventListener('click', () => {
  const aluno = { nome: nome.value.trim(), nota: Number(nota.value) };
  if (!aluno.nome || Number.isNaN(aluno.nota)) return;
  alunos.push(aluno);
  renderizar();
  nome.value = '';
  nota.value = '';
});`
  ),

  'programacao-front-end:24': ref(
    'Exercício 24 — Salvando Dados com localStorage',
    `<label for="preferencia">Mensagem para salvar</label>\n      <input id="preferencia" type="text">\n      <div class="linha">\n        <button id="salvar" type="button">Salvar</button>\n        <button id="limpar" type="button" class="secundario">Limpar</button>\n      </div>\n      <p id="status" class="mensagem"></p>`,
    `const campo = document.querySelector('#preferencia');
const status = document.querySelector('#status');
const CHAVE = 'ex24_mensagem';

function carregar() {
  const valor = localStorage.getItem(CHAVE) || '';
  campo.value = valor;
  status.textContent = valor ? 'Dado recuperado do navegador.' : 'Nenhum dado salvo.';
}

document.querySelector('#salvar').addEventListener('click', () => {
  localStorage.setItem(CHAVE, campo.value);
  status.textContent = 'Dado salvo no localStorage.';
});

document.querySelector('#limpar').addEventListener('click', () => {
  localStorage.removeItem(CHAVE);
  campo.value = '';
  status.textContent = 'Dado removido.';
});

carregar();`
  ),

  'programacao-front-end:25': ref(
    'Exercício 25 — Consulta de CEP com ViaCEP',
    `<label for="cep">CEP</label>\n      <div class="linha">\n        <input id="cep" inputmode="numeric" maxlength="9" placeholder="00000-000">\n        <button id="consultar" type="button">Consultar</button>\n      </div>\n      <div id="endereco" class="cartao">Informe um CEP.</div>`,
    `const campo = document.querySelector('#cep');
const endereco = document.querySelector('#endereco');

document.querySelector('#consultar').addEventListener('click', async () => {
  const cep = campo.value.replace(/\D/g, '');
  if (cep.length !== 8) {
    endereco.textContent = 'Digite um CEP com 8 números.';
    return;
  }
  endereco.textContent = 'Consultando...';
  const resposta = await fetch(\`https://viacep.com.br/ws/${'${cep}'}/json/\`);
  const dados = await resposta.json();
  if (dados.erro) {
    endereco.textContent = 'CEP não encontrado.';
    return;
  }
  endereco.textContent = \`${'${dados.logradouro}'}, ${'${dados.bairro}'} — ${'${dados.localidade}'}/${'${dados.uf}'}\`;
});`
  ),

  'programacao-front-end:26': ref(
    'Exercício 26 — ViaCEP com Tratamento de Erros',
    `<label for="cep">CEP</label>\n      <div class="linha">\n        <input id="cep" inputmode="numeric" maxlength="9" placeholder="00000-000">\n        <button id="consultar" type="button">Consultar</button>\n      </div>\n      <p id="status" class="mensagem" aria-live="polite"></p>\n      <div id="endereco" class="cartao" hidden></div>`,
    `const cepInput = document.querySelector('#cep');
const status = document.querySelector('#status');
const endereco = document.querySelector('#endereco');

async function consultarCep() {
  const cep = cepInput.value.replace(/\D/g, '');
  endereco.hidden = true;
  if (cep.length !== 8) {
    status.textContent = 'CEP inválido: use exatamente 8 números.';
    return;
  }
  try {
    status.textContent = 'Consultando...';
    const resposta = await fetch(\`https://viacep.com.br/ws/${'${cep}'}/json/\`);
    if (!resposta.ok) throw new Error('Falha HTTP');
    const dados = await resposta.json();
    if (dados.erro) throw new Error('CEP não encontrado');
    endereco.hidden = false;
    endereco.textContent = \`${'${dados.logradouro || "Logradouro não informado"}'} — ${'${dados.localidade}'}/${'${dados.uf}'}\`;
    status.textContent = 'Consulta concluída.';
  } catch (erro) {
    status.textContent = \`Não foi possível consultar: ${'${erro.message}'}.\`;
  }
}

document.querySelector('#consultar').addEventListener('click', consultarCep);`
  ),

  'programacao-front-end:27': ref(
    'Exercício 27 — Arrow Functions',
    `<label for="valorA">Valor A</label>\n      <input id="valorA" type="number" value="5">\n      <label for="valorB">Valor B</label>\n      <input id="valorB" type="number" value="3">\n      <button id="calcular" type="button">Calcular</button>\n      <p id="resultado" class="mensagem"></p>`,
    `const somar = (a, b) => a + b;
const multiplicar = (a, b) => a * b;
const resultado = document.querySelector('#resultado');

document.querySelector('#calcular').addEventListener('click', () => {
  const a = Number(document.querySelector('#valorA').value);
  const b = Number(document.querySelector('#valorB').value);
  resultado.textContent = \`Soma: ${'${somar(a, b)}'} | Multiplicação: ${'${multiplicar(a, b)}'}\`;
});`
  ),

  'programacao-front-end:28': ref(
    'Exercício 28 — Transformando Dados com map()',
    `<p>Transforme os preços usando <code>map()</code>.</p>\n      <button id="transformar" type="button">Aplicar desconto</button>\n      <ul id="precos"></ul>`,
    `const precos = [100, 80, 50, 25];
const lista = document.querySelector('#precos');

function renderizar(valores) {
  lista.innerHTML = '';
  valores.forEach((valor) => {
    const item = document.createElement('li');
    item.textContent = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    lista.appendChild(item);
  });
}

document.querySelector('#transformar').addEventListener('click', () => {
  const comDesconto = precos.map((preco) => preco * 0.9);
  renderizar(comDesconto);
});

renderizar(precos);`
  )
};
