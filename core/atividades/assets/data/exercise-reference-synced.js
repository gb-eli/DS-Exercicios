// Snapshot local de contingência das referências públicas existentes no Supabase — v14.9.0.
// O workspace consulta o banco primeiro; estes dados só evitam painel vazio em falha temporária.
export const EXERCISE_REFERENCE_SYNCED = {
  "introducao-programacao:6": {
    "titulo": "Exercício 06 — Repetição com for em Python",
    "mode": "transcricao",
    "files": {
      "main.py": "# Exercício 06 — Repetição com for em Python\nnumero = int(input(\"Número da tabuada: \"))\ninicio = int(input(\"Multiplicador inicial: \"))\nfim = int(input(\"Multiplicador final: \"))\n\nif inicio > fim:\n    print(\"Intervalo inválido.\")\nelse:\n    print(f\"\\n--- TABUADA DO {numero} ---\")\n    for multiplicador in range(inicio, fim + 1):\n        resultado = numero * multiplicador\n        print(f\"{numero} x {multiplicador} = {resultado}\")\n"
    }
  },
  "introducao-programacao:7": {
    "titulo": "Exercício 07 — Contadores e acumuladores em Python",
    "mode": "transcricao",
    "files": {
      "main.py": "# Exercício 07 — Contadores e acumuladores em Python\nquantidade = int(input(\"Quantidade de pedidos: \"))\n\nif quantidade <= 0:\n    print(\"Quantidade inválida.\")\nelse:\n    total_vendas = 0.0\n    pedidos_pequenos = 0\n    pedidos_medios = 0\n    pedidos_grandes = 0\n\n    for numero_pedido in range(1, quantidade + 1):\n        valor = float(input(f\"Valor do pedido {numero_pedido}: R$ \").replace(\",\", \".\"))\n        total_vendas += valor\n\n        if valor < 20:\n            pedidos_pequenos += 1\n        elif valor < 50:\n            pedidos_medios += 1\n        else:\n            pedidos_grandes += 1\n\n    ticket_medio = total_vendas / quantidade\n    print(f\"\\nTotal vendido: R$ {total_vendas:.2f}\")\n    print(f\"Ticket médio: R$ {ticket_medio:.2f}\")\n    print(f\"Pedidos pequenos: {pedidos_pequenos}\")\n    print(f\"Pedidos médios: {pedidos_medios}\")\n    print(f\"Pedidos grandes: {pedidos_grandes}\")\n"
    }
  },
  "introducao-programacao:8": {
    "titulo": "Exercício 08 — Repetição com while em Python",
    "mode": "transcricao",
    "files": {
      "main.py": "# Exercício 08 - Repetição com while em Python\nsenha_correta = \"python123\"\nlimite_tentativas = 3\ntentativas = 0\nacesso_liberado = False\n\nwhile tentativas < limite_tentativas and not acesso_liberado:\n    senha = input(f\"Digite a senha ({tentativas + 1}/{limite_tentativas}): \")\n\n    if senha == senha_correta:\n        acesso_liberado = True\n    else:\n        tentativas += 1\n        restantes = limite_tentativas - tentativas\n        if restantes > 0:\n            print(f\"Senha incorreta. Restam {restantes} tentativa(s).\")\n\nif acesso_liberado:\n    print(\"Acesso liberado!\")\nelse:\n    print(\"Acesso bloqueado: limite de tentativas atingido.\")\n"
    }
  },
  "programacao-front-end-sub:6": {
    "titulo": "FE06 — Grid, media queries e responsividade",
    "mode": "transcricao",
    "files": {
      "index.html": "<!DOCTYPE html>\n<html lang=\"pt-BR\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Dashboard responsivo</title>\n  <link rel=\"stylesheet\" href=\"estilo.css\">\n  <script src=\"script.js\" defer></script>\n</head>\n<body>\n  <header>\n    <h1>Dashboard operacional</h1>\n    <button id=\"alternarDensidade\" type=\"button\" aria-pressed=\"false\" aria-controls=\"dashboard\">Ativar modo compacto</button>\n    <p id=\"statusLayout\" aria-live=\"polite\">Densidade confortável.</p>\n  </header>\n  <main id=\"dashboard\">\n    <section id=\"resumo\"><h2>Resumo</h2><div class=\"indicadores\"><article class=\"indicador\"><strong>12</strong><span>Tarefas</span></article><article class=\"indicador\"><strong>4</strong><span>Reuniões</span></article><article class=\"indicador\"><strong>3</strong><span>Alertas</span></article></div></section>\n    <section id=\"tarefas\"><h2>Tarefas</h2><p>Revisar projeto e publicar versão.</p></section>\n    <section id=\"agenda\"><h2>Agenda</h2><p>14h — alinhamento da equipe.</p></section>\n    <section id=\"equipe\"><h2>Equipe</h2><p>Front-End, QA e Produto.</p></section>\n    <aside id=\"alertas\"><h2>Alertas</h2><p>Há uma entrega próxima.</p></aside>\n  </main>\n  <footer>FE06 • Grid responsivo</footer>\n</body>\n</html>",
      "estilo.css": "* { box-sizing:border-box; }\nbody { margin:0; font-family:system-ui,sans-serif; background:#eef2f7; color:#172033; }\nheader, #dashboard, footer { width:min(1100px,94%); margin:auto; }\nheader { padding:1.5rem 0; }\n#dashboard { display:grid; grid-template-columns:2fr 1fr; grid-template-areas:\"resumo resumo\" \"tarefas agenda\" \"equipe alertas\"; gap:1rem; }\n#resumo{grid-area:resumo} #tarefas{grid-area:tarefas} #agenda{grid-area:agenda} #equipe{grid-area:equipe} #alertas{grid-area:alertas}\nsection, aside { min-width:0; padding:1rem; background:white; border-radius:12px; }\n.indicadores { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:.75rem; }\n.indicador { display:grid; gap:.25rem; padding:.8rem; background:#f8fafc; border-radius:10px; }\n#dashboard.compacto section, #dashboard.compacto aside { padding:.65rem; }\n@media(max-width:760px){ #dashboard{grid-template-columns:1fr;grid-template-areas:\"resumo\" \"tarefas\" \"agenda\" \"equipe\" \"alertas\";} }\n",
      "script.js": "const botao = document.querySelector(\"#alternarDensidade\");\nconst dashboard = document.querySelector(\"#dashboard\");\nconst statusLayout = document.querySelector(\"#statusLayout\");\n\nbotao.addEventListener(\"click\", () => {\n  const compacto = dashboard.classList.toggle(\"compacto\");\n  botao.setAttribute(\"aria-pressed\", String(compacto));\n  botao.textContent = compacto ? \"Desativar modo compacto\" : \"Ativar modo compacto\";\n  statusLayout.textContent = compacto ? \"Densidade compacta.\" : \"Densidade confortável.\";\n});"
    }
  },
  "programacao-front-end-sub:7": {
    "titulo": "FE07 — Do algoritmo ao código: Python e JavaScript",
    "mode": "transcricao",
    "files": {
      "algoritmo.txt": "INÍCIO\n    LER nome_do_cliente\n    LER horas_previstas\n    LER valor_por_hora\n\n    subtotal <- horas_previstas * valor_por_hora\n    taxa_operacional <- subtotal * 0.10\n    total <- subtotal + taxa_operacional\n\n    EXIBIR nome_do_cliente\n    EXIBIR subtotal\n    EXIBIR taxa_operacional\n    EXIBIR total\nFIM\n",
      "index.html": "<!DOCTYPE html>\n<html lang=\"pt-BR\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Simulador de orçamento</title>\n  <link rel=\"stylesheet\" href=\"estilo.css\">\n  <script src=\"script.js\" defer></script>\n</head>\n<body>\n  <header><h1>Do algoritmo ao código</h1></header>\n  <main id=\"simulador\">\n    <section>\n      <h2>Orçamento em JavaScript</h2>\n      <form id=\"formularioOrcamento\">\n        <label for=\"nomeCliente\">Cliente</label><input id=\"nomeCliente\" name=\"nomeCliente\" required>\n        <label for=\"horasPrevistas\">Horas previstas</label><input id=\"horasPrevistas\" name=\"horasPrevistas\" type=\"number\" min=\"1\" required>\n        <label for=\"valorHora\">Valor por hora</label><input id=\"valorHora\" name=\"valorHora\" type=\"number\" min=\"0\" step=\"0.01\" required>\n        <button type=\"submit\">Calcular orçamento</button>\n      </form>\n      <p id=\"resultadoOrcamento\" role=\"status\" aria-live=\"polite\"></p>\n    </section>\n    <aside><h2>Algoritmo</h2><ol><li>Ler nome, horas e valor.</li><li>Calcular subtotal.</li><li>Aplicar taxa de 10%.</li><li>Mostrar o total.</li></ol></aside>\n  </main>\n  <footer>FE07 • Python e JavaScript</footer>\n</body>\n</html>",
      "estilo.css": ":root { --fundo:#f8fafc; --painel:#fff; --destaque:#0369a1; --texto:#172033; }\n* { box-sizing:border-box; }\nbody { margin:0; font-family:system-ui,sans-serif; background:var(--fundo); color:var(--texto); }\nheader, #simulador, footer { width:min(900px,92%); margin:auto; }\n#simulador { display:grid; grid-template-columns:2fr 1fr; gap:1rem; }\nsection, aside { padding:1rem; background:var(--painel); border-radius:12px; }\nform { display:grid; gap:.6rem; }\ninput, button { font:inherit; padding:.7rem; }\nbutton { background:var(--destaque); color:white; border:0; border-radius:8px; cursor:pointer; }\nbutton:hover { filter:brightness(1.08); }\n@media(max-width:700px){ #simulador{grid-template-columns:1fr;} }",
      "script.js": "const formulario = document.querySelector(\"#formularioOrcamento\");\nconst resultado = document.querySelector(\"#resultadoOrcamento\");\n\nformulario.addEventListener(\"submit\", (event) => {\n  event.preventDefault();\n  const nome = document.querySelector(\"#nomeCliente\").value.trim();\n  const horas = Number(document.querySelector(\"#horasPrevistas\").value);\n  const valorHora = Number(document.querySelector(\"#valorHora\").value);\n  const subtotal = horas * valorHora;\n  const taxa = subtotal * 0.10;\n  const total = subtotal + taxa;\n  resultado.textContent = nome + \": subtotal R$ \" + subtotal.toFixed(2) + \", taxa R$ \" + taxa.toFixed(2) + \", total R$ \" + total.toFixed(2) + \".\";\n});",
      "main.py": "nome_cliente = input(\"Nome do cliente: \").strip()\nhoras_previstas = float(input(\"Horas previstas: \").replace(\",\", \".\"))\nvalor_hora = float(input(\"Valor por hora: R$ \").replace(\",\", \".\"))\n\nsubtotal = horas_previstas * valor_hora\ntaxa = subtotal * 0.10\ntotal = subtotal + taxa\n\nprint(\"\\n--- ORÇAMENTO ---\")\nprint(f\"Cliente: {nome_cliente}\")\nprint(f\"Subtotal: R$ {subtotal:.2f}\")\nprint(f\"Taxa (10%): R$ {taxa:.2f}\")\nprint(f\"Total: R$ {total:.2f}\")",
      "README.md": "# FE07 - Do algoritmo ao código: Python e JavaScript\n\n## Objetivo\nRepresentar e executar o mesmo algoritmo sequencial em pseudocódigo, JavaScript e Python, identificando entrada, processamento e saída.\n\n## Arquivos\n- algoritmo.txt\n- index.html\n- estilo.css\n- script.js\n- main.py\n\nUse os mesmos dados nas duas versões e compare os resultados.\n"
    }
  },
  "analise-metodo-sistemas:1": {
    "titulo": "Problema, Público e Proposta de Solução",
    "mode": "transcricao",
    "languages": {
      "referencia.md": "markdown"
    },
    "files": {
      "referencia.md": "# Referência — Problema, Público e Proposta de Solução\n\n## Estrutura para transcrição\n- Problema observado:\n- Evidência do problema:\n- Público afetado:\n- Contexto de uso:\n- Objetivo da solução:\n- Proposta de solução:\n- Como a proposta reduz o problema:\n\n> Use a estrutura para registrar sua análise. Não copie uma solução pronta."
    }
  },
  "analise-metodo-sistemas:2": {
    "titulo": "Métodos Ágil x Waterfall — qual escolher?",
    "mode": "transcricao",
    "languages": {
      "referencia.md": "markdown"
    },
    "files": {
      "referencia.md": "# Referência — Métodos Ágil x Waterfall\n\n## Para cada cenário registre\n- Cenário:\n- Método escolhido: Ágil | Waterfall/Cascata | Híbrido\n- Evidências do cenário:\n- Por que esse método é adequado:\n- Principal risco da escolha:\n\n> A justificativa vale mais do que apenas marcar o método."
    }
  },
  "analise-metodo-sistemas:3": {
    "titulo": "Documentação e Rastreabilidade de um Sistema",
    "mode": "transcricao",
    "languages": {
      "referencia.md": "markdown"
    },
    "files": {
      "referencia.md": "# Referência — Documentação e Rastreabilidade\n\n## Registro mínimo\n- Requisito ou necessidade:\n- Decisão tomada:\n- Tarefa relacionada:\n- Versão/alteração:\n- Teste realizado:\n- Resultado do teste:\n- Evidência (link, commit, print ou arquivo):\n\n> O objetivo é permitir que outra pessoa acompanhe a evolução do sistema."
    }
  },
  "analise-metodo-sistemas:4": {
    "titulo": "Segurança na Análise de Sistemas",
    "mode": "transcricao",
    "languages": {
      "referencia.md": "markdown"
    },
    "files": {
      "referencia.md": "# Referência — Segurança na Análise de Sistemas\n\n## Para cada requisito registre\n- Requisito de segurança:\n- Categoria: autenticação | autorização | proteção de dados | auditoria | recuperação\n- Risco que reduz:\n- Como verificar/testar:\n\n> Escreva requisitos claros e verificáveis; evite frases vagas como “o sistema deve ser seguro”."
    }
  },
  "analise-metodo-sistemas:5": {
    "titulo": "Auditoria de um Sistema Real",
    "mode": "transcricao",
    "languages": {
      "referencia.md": "markdown"
    },
    "files": {
      "referencia.md": "# Referência — Auditoria de um Sistema Real\n\n## Modelo de achado\n- Critério:\n- Problema encontrado:\n- Evidência:\n- Impacto:\n- Gravidade: baixa | média | alta\n- Recomendação:\n- Como validar a correção:\n\n> Faça observações baseadas em evidências e proponha melhorias que possam ser verificadas."
    }
  },
  "inovacao-tecnologica-empreendedorismo:1": {
    "titulo": "Exercício 01 — Tipos de inovação",
    "mode": "transcricao",
    "languages": {
      "referencia.md": "markdown"
    },
    "files": {
      "referencia.md": "# Referência — Tipos de inovação\n\n## Estrutura\n- Produto: mudança no que é oferecido.\n- Processo: mudança na forma de produzir ou executar.\n- Organizacional: mudança na forma de organizar o trabalho.\n- Marketing: mudança na forma de divulgar, posicionar ou vender.\n\n## Exemplo\n- Situação: escola cria agendamento digital de laboratórios.\n- Tipo: inovação de processo.\n- Justificativa: altera a forma como a reserva é realizada."
    }
  },
  "inovacao-tecnologica-empreendedorismo:2": {
    "titulo": "Exercício 02 — Tecnologias emergentes e oportunidades",
    "mode": "transcricao",
    "languages": {
      "referencia.md": "markdown"
    },
    "files": {
      "referencia.md": "# Referência — Tecnologias emergentes e oportunidades\n\n## Modelo\n- Tecnologia escolhida: Inteligência Artificial\n- Problema observado: demora para responder dúvidas repetidas\n- Oportunidade: assistente de atendimento\n- Público: alunos e professores\n- Benefício esperado: respostas mais rápidas\n- Risco: informação incorreta\n- Forma de reduzir o risco: validação humana e fontes confiáveis"
    }
  },
  "inovacao-tecnologica-empreendedorismo:3": {
    "titulo": "Exercício 03 — Entrevista de descoberta",
    "mode": "transcricao",
    "languages": {
      "referencia.md": "markdown"
    },
    "files": {
      "referencia.md": "# Referência — Entrevista de descoberta\n\n## Roteiro\n1. Como você resolve esse problema hoje?\n2. Com que frequência isso acontece?\n3. Qual é a parte mais difícil?\n4. O que você já tentou fazer para resolver?\n5. Quanto tempo você perde nesse processo?\n6. O que uma solução ideal deveria facilitar?\n\n## Regra\nEvite perguntas que induzam a resposta. Registre frases importantes do entrevistado."
    }
  },
  "inovacao-tecnologica-empreendedorismo:4": {
    "titulo": "Exercício 04 — Geração de ideias",
    "mode": "transcricao",
    "languages": {
      "referencia.md": "markdown"
    },
    "files": {
      "referencia.md": "# Referência — Geração de ideias\n\n## Ideias\n1. Agenda visual de laboratórios\n2. Reserva por QR Code\n3. Notificação automática de conflito\n4. Lista de espera\n5. Sugestão de horário alternativo\n\n## Regra\nPrimeiro gere quantidade. Depois avalie qualidade e viabilidade."
    }
  },
  "inovacao-tecnologica-empreendedorismo:5": {
    "titulo": "Exercício 05 — Preço e percepção de valor",
    "mode": "transcricao",
    "languages": {
      "referencia.md": "markdown"
    },
    "files": {
      "referencia.md": "# Referência — Preço e percepção de valor\n\n## Modelo\n- Benefício principal: reduzir tempo e conflitos\n- Alternativa atual: processo manual\n- Custo da alternativa: tempo da equipe\n- Faixa de preço testada: R$ X a R$ Y\n- Pergunta ao cliente: qual valor parece justo para esse benefício?\n\n> O preço deve considerar custo, valor percebido e alternativas."
    }
  },
  "inovacao-tecnologica-empreendedorismo:6": {
    "titulo": "Exercício 06 — Viabilidade financeira simplificada",
    "mode": "transcricao",
    "languages": {
      "referencia.md": "markdown"
    },
    "files": {
      "referencia.md": "# Referência — Viabilidade financeira simplificada\n\n## Fórmulas\nReceita mensal = número de clientes × preço mensal\n\nResultado mensal = receita mensal - custos mensais\n\nPonto de equilíbrio = custos fixos / margem por cliente\n\n## Exemplo\n- 10 clientes × R$ 100 = R$ 1.000\n- Custos mensais = R$ 600\n- Resultado = R$ 400"
    }
  },
  "programacao-front-end-sub:8": {
    "titulo": "Exercício 08 — Média e situação do aluno",
    "mode": "transcricao",
    "languages": {
      "index.html": "html",
      "script.js": "javascript"
    },
    "files": {
      "index.html": "<!DOCTYPE html>\n<html lang=\"pt-BR\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Exercício 08 — Média e Situação do Aluno com JavaScript</title>\n  <style>body{font-family:Arial,sans-serif;max-width:760px;margin:40px auto;padding:0 16px;line-height:1.5}input,button{padding:10px;margin:6px 4px 6px 0}</style>\n</head>\n<body>\n  <h1 id=\"titulo\">Exercício 08 — Média e Situação do Aluno com JavaScript</h1>\n  <input id=\"entrada1\" placeholder=\"Valor 1\">\n  <input id=\"entrada2\" placeholder=\"Valor 2\">\n  <button id=\"executar\">Executar</button>\n  <p id=\"saida\">Resultado aparecerá aqui.</p>\n  <script src=\"script.js\"></script>\n</body>\n</html>",
      "script.js": "// Exercício 08 — Média e situação\nconst n1 = document.querySelector(\"#entrada1\");\nconst n2 = document.querySelector(\"#entrada2\");\nconst saida = document.querySelector(\"#saida\");\n\ndocument.querySelector(\"#executar\").addEventListener(\"click\", () => {\n  const media = (Number(n1.value) + Number(n2.value)) / 2;\n  const situacao = media >= 6 ? \"Aprovado\" : \"Reprovado\";\n  saida.textContent = `Média: ${media.toFixed(1)} — ${situacao}`;\n});\n"
    }
  },
  "programacao-front-end-sub:9": {
    "titulo": "Exercício 09 — Validação de campo",
    "mode": "transcricao",
    "languages": {
      "index.html": "html",
      "script.js": "javascript"
    },
    "files": {
      "index.html": "<!DOCTYPE html>\n<html lang=\"pt-BR\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Exercício 09 — Validação de Campo com JavaScript</title>\n</head>\n<body>\n  <h1>Exercício 09 — Validação de Campo com JavaScript</h1>\n  <input id=\"entrada1\" placeholder=\"Valor 1\">\n  <button id=\"executar\">Executar</button>\n  <p id=\"saida\">Resultado aparecerá aqui.</p>\n  <script src=\"script.js\"></script>\n</body>\n</html>",
      "script.js": "// Exercício 09 — Validação de campo\nconst entrada = document.querySelector(\"#entrada1\");\nconst saida = document.querySelector(\"#saida\");\n\ndocument.querySelector(\"#executar\").addEventListener(\"click\", () => {\n  if (entrada.value.trim() === \"\") {\n    saida.textContent = \"Preencha o campo.\";\n    return;\n  }\n  saida.textContent = \"Campo preenchido corretamente.\";\n});\n"
    }
  },
  "programacao-front-end-sub:10": {
    "titulo": "Exercício 10 — Login simples com condição",
    "mode": "transcricao",
    "languages": {
      "index.html": "html",
      "script.js": "javascript"
    },
    "files": {
      "index.html": "<!DOCTYPE html>\n<html lang=\"pt-BR\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Exercício 10 — Login Simples com Condição em JavaScript</title>\n</head>\n<body>\n  <h1>Exercício 10 — Login Simples com Condição em JavaScript</h1>\n  <input id=\"entrada1\" placeholder=\"Usuário\">\n  <input id=\"entrada2\" placeholder=\"Senha\">\n  <button id=\"executar\">Executar</button>\n  <p id=\"saida\">Resultado aparecerá aqui.</p>\n  <script src=\"script.js\"></script>\n</body>\n</html>",
      "script.js": "// Exercício 10 — Login simples\nconst usuario = document.querySelector(\"#entrada1\");\nconst senha = document.querySelector(\"#entrada2\");\nconst saida = document.querySelector(\"#saida\");\n\ndocument.querySelector(\"#executar\").addEventListener(\"click\", () => {\n  if (usuario.value === \"aluno\" && senha.value === \"1234\") {\n    saida.textContent = \"Acesso liberado.\";\n  } else {\n    saida.textContent = \"Usuário ou senha inválidos.\";\n  }\n});\n"
    }
  },
  "programacao-mobile-sub:5": {
    "titulo": "Exercício 05 — Primeira interface Android: texto, botão e interação",
    "mode": "transcricao",
    "languages": {
      "MainActivity.kt": "kotlin",
      "referencia.md": "markdown"
    },
    "files": {
      "MainActivity.kt": "package com.example.meuapp\n\nimport android.os.Bundle\nimport android.view.Gravity\nimport android.widget.Button\nimport android.widget.LinearLayout\nimport android.widget.TextView\nimport androidx.appcompat.app.AppCompatActivity\n\nclass MainActivity : AppCompatActivity() {\n    override fun onCreate(savedInstanceState: Bundle?) {\n        super.onCreate(savedInstanceState)\n\n        val layout = LinearLayout(this).apply {\n            orientation = LinearLayout.VERTICAL\n            gravity = Gravity.CENTER\n            setPadding(32, 32, 32, 32)\n        }\n\n        val mensagem = TextView(this).apply {\n            text = \"Meu primeiro app interativo\"\n            textSize = 22f\n        }\n\n        val botao = Button(this).apply {\n            text = \"Toque aqui\"\n        }\n\n        botao.setOnClickListener {\n            mensagem.text = \"Botão tocado com sucesso!\"\n        }\n\n        layout.addView(mensagem)\n        layout.addView(botao)\n        setContentView(layout)\n    }\n}\n",
      "referencia.md": "# Referência — Primeira interface Android\n\n## Passos para transcrição\n1. Crie ou abra um projeto Android vazio em Kotlin.\n2. Abra o arquivo `MainActivity.kt`.\n3. Transcreva o código exibido na referência.\n4. Execute o aplicativo no emulador ou dispositivo.\n5. Toque no botão e observe a mudança da mensagem.\n6. Confira se texto, botão e interação funcionam antes de salvar a atividade.\n"
    }
  }
};
