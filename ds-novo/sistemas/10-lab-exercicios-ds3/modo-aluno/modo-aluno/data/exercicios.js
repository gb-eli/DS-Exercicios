window.EXERCICIOS = [
  {
    "numero": 1,
    "titulo": "Exercício 01 — Estrutura Semântica de um Sistema de Chamados",
    "nomeCurto": "Sistema de Chamados",
    "tema": "HTML semântico aplicado a uma interface de sistema",
    "objetivo": "Organizar a página inicial de um sistema de suporte usando elementos semânticos, hierarquia de títulos e navegação interna.",
    "retomadas": [
      "estrutura básica do HTML",
      "títulos e parágrafos",
      "listas e links"
    ],
    "novos": [
      "header, nav, main e footer",
      "section e article",
      "hierarquia semântica",
      "aria-label e aria-labelledby"
    ],
    "pasta": "exercicio-01",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/",
    "githubUrl": "https://github.com/",
    "ordemArquivos": [
      "html"
    ],
    "arquivos": {
      "html": "<!DOCTYPE html>\n<html lang=\"pt-BR\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <meta name=\"description\" content=\"Central de chamados para atendimento de suporte técnico.\">\n    <title>Central de Chamados | Suporte DS</title>\n    <link rel=\"stylesheet\" href=\"estilo.css\">\n</head>\n<body>\n    <header>\n        <h1>Central de Chamados</h1>\n        <p>Acompanhe solicitações e prioridades da equipe de suporte.</p>\n\n        <nav aria-label=\"Navegação principal\">\n            <ul>\n                <li><a href=\"#resumo\">Resumo</a></li>\n                <li><a href=\"#chamados\">Chamados recentes</a></li>\n                <li><a href=\"#orientacoes\">Orientações</a></li>\n            </ul>\n        </nav>\n    </header>\n\n    <main>\n        <section id=\"resumo\" aria-labelledby=\"titulo-resumo\">\n            <h2 id=\"titulo-resumo\">Resumo do atendimento</h2>\n            <ul>\n                <li>3 chamados em análise</li>\n                <li>2 chamados aguardando resposta</li>\n                <li>5 chamados concluídos hoje</li>\n            </ul>\n        </section>\n\n        <section id=\"chamados\" aria-labelledby=\"titulo-chamados\">\n            <h2 id=\"titulo-chamados\">Chamados recentes</h2>\n\n            <article>\n                <h3>Computador sem acesso à internet</h3>\n                <p><strong>Setor:</strong> Laboratório 02</p>\n                <p><strong>Prioridade:</strong> Alta</p>\n                <p>Verificar cabo de rede, configuração e disponibilidade do ponto.</p>\n            </article>\n\n            <article>\n                <h3>Instalação do ambiente Python</h3>\n                <p><strong>Setor:</strong> Desenvolvimento de Sistemas</p>\n                <p><strong>Prioridade:</strong> Média</p>\n                <p>Preparar Python, extensão do VS Code e teste de execução no terminal.</p>\n            </article>\n        </section>\n\n        <section id=\"orientacoes\" aria-labelledby=\"titulo-orientacoes\">\n            <h2 id=\"titulo-orientacoes\">Orientações para abrir um chamado</h2>\n            <ol>\n                <li>Descreva o problema com clareza.</li>\n                <li>Informe o equipamento e o local.</li>\n                <li>Registre mensagens de erro ou testes já realizados.</li>\n            </ol>\n        </section>\n    </main>\n\n    <footer>\n        <p>Projeto educacional — 3º DS · Programação no Desenvolvimento de Sistemas</p>\n    </footer>\n    <script src=\"script.js\"></script>\n</body>\n</html>\n",
      "css": ":root { font-family: Inter, system-ui, sans-serif; color: #18212f; background: #eef3f8; }\n* { box-sizing: border-box; }\nbody { margin: 0; line-height: 1.6; }\nheader, main, footer { width: min(100% - 2rem, 980px); margin-inline: auto; }\nheader { padding-block: 2rem 1rem; }\nnav ul { display: flex; flex-wrap: wrap; gap: .75rem; padding: 0; list-style: none; }\nnav a { display: inline-block; padding: .55rem .8rem; border-radius: .65rem; background: #fff; color: #174a75; text-decoration: none; }\nsection { margin-block: 1rem; padding: 1.25rem; border-radius: 1rem; background: #fff; box-shadow: 0 10px 30px rgba(25,42,70,.08); }\narticle { padding: 1rem; border-left: .3rem solid #3478b8; background: #f5f9fd; }\narticle + article { margin-top: .8rem; }\nfooter { padding-block: 1rem 2rem; color: #4d5a6a; }\n@media (max-width: 540px) { header, main, footer { width: min(100% - 1rem, 980px); } section { padding: 1rem; } }\n",
      "js": "// Arquivo de apoio. O foco pedagógico deste exercício é a semântica do HTML.\ndocument.querySelectorAll('nav a[href^=\"#\"]').forEach((link) => {\n  link.addEventListener('click', () => {\n    document.querySelectorAll('nav a[aria-current]').forEach((item) => item.removeAttribute('aria-current'));\n    link.setAttribute('aria-current', 'location');\n  });\n});\nconsole.info('Exercício 01 carregado.');\n"
    },
    "nomesArquivos": {
      "html": "index.html",
      "css": "estilo.css",
      "js": "script.js"
    },
    "passos": {
      "html": [
        {
          "titulo": "Documento e metadados",
          "linhas": [
            1,
            9
          ],
          "explicacao": "O início informa que o documento usa HTML5, define o idioma, a codificação, a adaptação para telas e o título mostrado na aba do navegador."
        },
        {
          "titulo": "Cabeçalho do sistema",
          "linhas": [
            10,
            13
          ],
          "explicacao": "O header reúne a identidade da página: título principal e uma explicação curta sobre a central de chamados."
        },
        {
          "titulo": "Navegação interna",
          "linhas": [
            14,
            22
          ],
          "explicacao": "O nav agrupa links que levam às regiões principais da mesma página. O aria-label descreve a finalidade da navegação."
        },
        {
          "titulo": "Conteúdo principal",
          "linhas": [
            23,
            32
          ],
          "explicacao": "O main identifica o conteúdo central. A primeira section apresenta indicadores resumidos do atendimento."
        },
        {
          "titulo": "Chamados como artigos",
          "linhas": [
            33,
            50
          ],
          "explicacao": "Cada article representa um chamado que poderia ser compreendido separadamente, com título, setor, prioridade e descrição."
        },
        {
          "titulo": "Orientações em sequência",
          "linhas": [
            51,
            58
          ],
          "explicacao": "A terceira section utiliza uma lista ordenada para mostrar etapas que devem ser executadas na ordem indicada."
        },
        {
          "titulo": "Rodapé e encerramento",
          "linhas": [
            59,
            68
          ],
          "explicacao": "O footer encerra a página e informa o contexto educacional do projeto."
        }
      ]
    },
    "roteiro": [
      "Apresentar um sistema de chamados e discutir quais regiões a interface precisa ter.",
      "Retomar a estrutura básica do HTML e explicar por que semântica não significa apenas aparência.",
      "Explicar header, nav, main, section, article e footer por partes, relacionando cada tag à função que desempenha.",
      "Mostrar no preview como a ordem de leitura permanece compreensível mesmo sem CSS.",
      "Pedir que os alunos digitem o documento e permitir pequenas mudanças nos textos e nos exemplos de chamados.",
      "Validar a estrutura semântica, baixar o arquivo e orientar a entrega no GitHub e no Classroom."
    ],
    "classroom": {
      "titulo": "Exercício 01 — Estrutura Semântica de um Sistema de Chamados",
      "descricao": "Objetivo: construir a estrutura HTML da página inicial de um sistema de suporte técnico usando elementos semânticos.\n\nOrientações:\nCrie a pasta `exercicio-01` no repositório `atividades-praticas`.\nDigite o arquivo `index.html` apresentado na plataforma.\nUse `header`, `nav`, `main`, `section`, `article` e `footer` de acordo com a função de cada região.\nMantenha um único `h1` e organize os demais títulos sem pular níveis.\nInclua uma navegação interna, um resumo, pelo menos dois chamados e as orientações de atendimento.\nTeste o arquivo no navegador e valide a atividade na plataforma.\n\nEntrega: anexe no Google Classroom o link do repositório com a pasta `exercicio-01`.\n\nPortal da Atividade: plataforma do 3º DS — Programação no Desenvolvimento de Sistemas."
    },
    "professor": {
      "testes": [
        "Confirmar a existência de um único h1 e de títulos h2 e h3 em ordem coerente.",
        "Confirmar que header, nav, main, sections, articles e footer possuem funções claras.",
        "Testar os três links da navegação interna.",
        "Substituir os textos por exemplos equivalentes e confirmar que a validação continua aceitando a solução.",
        "Remover uma tag semântica obrigatória e confirmar que o diagnóstico informa o ponto ausente."
      ],
      "erros": [
        "Usar div para todas as regiões, sem header, main, section, article ou footer.",
        "Criar mais de um h1 ou pular diretamente de h1 para h3.",
        "Colocar article fora de uma section ou deixar chamados sem título próprio.",
        "Criar links internos cujo destino não existe.",
        "Esquecer de fechar listas, seções ou o corpo do documento."
      ],
      "notas": [
        "A validação é semântica: os textos podem ser alterados e a indentação pode variar.",
        "Explique que a estrutura ajuda acessibilidade, manutenção, SEO e leitura por outras ferramentas.",
        "Não introduza CSS neste exercício; a aparência simples ajuda a observar a organização do documento.",
        "Permita que o aluno troque os exemplos de chamados, desde que preserve os requisitos estruturais."
      ],
      "python": "# Continuidade da trilha\n# Esta estrutura será estilizada nos exercícios 06 a 10,\n# programada com JavaScript nos exercícios 11 a 30\n# e integrada ao Python nos exercícios finais."
    },
    "permitirBase": {
      "html": false
    },
    "validacao": {
      "tipo": "html-semantico",
      "htmlSemantico": {
        "doctype": true,
        "idioma": true,
        "charset": true,
        "viewport": true,
        "tagsMinimas": {
          "header": 1,
          "nav": 1,
          "main": 1,
          "section": 3,
          "article": 2,
          "footer": 1,
          "h1": 1,
          "h2": 3,
          "h3": 2,
          "a": 3
        },
        "tagsExatas": {
          "main": 1,
          "h1": 1
        },
        "relacoes": [
          {
            "pai": "header",
            "filho": "nav",
            "minimo": 1,
            "descricao": "coloque a navegação principal dentro do cabeçalho"
          },
          {
            "pai": "main",
            "filho": "section",
            "minimo": 3,
            "descricao": "organize as áreas de conteúdo como seções dentro do conteúdo principal"
          },
          {
            "pai": "section",
            "filho": "article",
            "minimo": 2,
            "descricao": "represente cada chamado como article dentro da seção correspondente"
          }
        ],
        "linksInternos": 3,
        "artigoComTitulo": true,
        "hierarquiaTitulos": true,
        "idsUnicos": true
      }
    },
    "fasePedagogica": 1,
    "apoioAutomatico": {
      "enabled": true,
      "initialAccess": true,
      "minActiveSeconds": 180,
      "minAttempts": 2,
      "minKeystrokes": 40,
      "minExecutions": 1,
      "minHints": 1,
      "requiredSignals": 3,
      "blocks": {
        "html": [
          {
            "id": "estrutura-documento-html",
            "title": "Completar estrutura inicial do documento",
            "description": "Insere somente o início do documento. Depois consulte o arquivo completo de referência exibido ao lado e digite as regiões semânticas solicitadas.",
            "reason": "fase inicial",
            "mode": "replace-empty",
            "content": "<!DOCTYPE html>\n<html lang=\"pt-BR\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Sistema de Chamados</title>\n</head>\n<body>\n    <!-- Continue aqui a estrutura semântica do sistema. -->\n</body>\n</html>"
          }
        ]
      }
    },
    "ordemDownloads": [
      "html",
      "css",
      "js"
    ],
    "fluxoEntrega": {
      "etapas": [
        "Digite ou complete o arquivo solicitado",
        "Execute o código atual",
        "Teste o comportamento no preview",
        "Valide o arquivo",
        "Conclua a atividade",
        "Gere a evidência",
        "Baixe o ZIP e entregue no Classroom"
      ]
    },
    "referenciaCompletaPadrao": true,
    "arquivosApoio": [
      "css",
      "js"
    ],
    "tempoEstimado": "20–25 min",
    "nivel": "Iniciante"
  },
  {
    "numero": 2,
    "titulo": "Exercício 02 — Formulário Acessível de Cadastro de Usuário",
    "nomeCurto": "Cadastro Acessível",
    "tema": "HTML semântico, formulários e acessibilidade em um sistema interno",
    "objetivo": "Construir um formulário organizado e acessível, associando corretamente rótulos, campos, grupos e atributos de preenchimento.",
    "retomadas": [
      "estrutura semântica",
      "hierarquia de títulos",
      "atributos básicos"
    ],
    "novos": [
      "form, label, fieldset e legend",
      "required, autocomplete e tipos de input",
      "associação entre rótulo e campo",
      "select, option e botões de formulário"
    ],
    "pasta": "exercicio-02",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/",
    "githubUrl": "https://github.com/",
    "ordemArquivos": [
      "html"
    ],
    "arquivos": {
      "html": "<!DOCTYPE html>\n<html lang=\"pt-BR\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <meta name=\"description\" content=\"Formulário acessível para cadastro de usuários em um sistema interno.\">\n    <title>Cadastro de Usuário | Portal DS</title>\n    <link rel=\"stylesheet\" href=\"estilo.css\">\n</head>\n<body>\n    <header>\n        <h1>Cadastro de Usuário</h1>\n        <p>Informe os dados necessários para liberar o acesso ao sistema interno.</p>\n    </header>\n\n    <main>\n        <section aria-labelledby=\"titulo-cadastro\">\n            <h2 id=\"titulo-cadastro\">Dados para acesso ao sistema</h2>\n            <p id=\"orientacao-formulario\">Todos os campos são obrigatórios.</p>\n\n            <form action=\"#\" method=\"post\" aria-describedby=\"orientacao-formulario\">\n                <fieldset>\n                    <legend>Identificação</legend>\n\n                    <div>\n                        <label for=\"nome\">Nome completo</label>\n                        <input type=\"text\" id=\"nome\" name=\"nome\" autocomplete=\"name\" required>\n                    </div>\n\n                    <div>\n                        <label for=\"email\">E-mail institucional</label>\n                        <input type=\"email\" id=\"email\" name=\"email\" autocomplete=\"email\" required>\n                    </div>\n                </fieldset>\n\n                <fieldset>\n                    <legend>Vínculo com o sistema</legend>\n\n                    <div>\n                        <label for=\"perfil\">Perfil de acesso</label>\n                        <select id=\"perfil\" name=\"perfil\" required>\n                            <option value=\"\">Selecione um perfil</option>\n                            <option value=\"aluno\">Aluno</option>\n                            <option value=\"professor\">Professor</option>\n                            <option value=\"suporte\">Suporte técnico</option>\n                        </select>\n                    </div>\n\n                    <div>\n                        <label for=\"setor\">Setor</label>\n                        <select id=\"setor\" name=\"setor\" required>\n                            <option value=\"\">Selecione um setor</option>\n                            <option value=\"desenvolvimento\">Desenvolvimento de Sistemas</option>\n                            <option value=\"laboratorio\">Laboratório de Informática</option>\n                            <option value=\"administracao\">Administração</option>\n                        </select>\n                    </div>\n                </fieldset>\n\n                <fieldset>\n                    <legend>Confirmação</legend>\n                    <div>\n                        <input type=\"checkbox\" id=\"aceite\" name=\"aceite\" required>\n                        <label for=\"aceite\">Li e concordo com as regras de uso do sistema.</label>\n                    </div>\n                </fieldset>\n\n                <div>\n                    <button type=\"submit\">Cadastrar usuário</button>\n                    <button type=\"reset\">Limpar formulário</button>\n                </div>\n            </form>\n        </section>\n    </main>\n\n    <footer>\n        <p>Projeto educacional — 3º DS · Programação no Desenvolvimento de Sistemas</p>\n    </footer>\n    <script src=\"script.js\"></script>\n</body>\n</html>\n",
      "css": ":root { font-family: Inter, system-ui, sans-serif; color: #18212f; background: #edf3f8; }\n* { box-sizing: border-box; }\nbody { margin: 0; line-height: 1.55; }\nheader, main, footer { width: min(100% - 2rem, 820px); margin-inline: auto; }\nheader { padding-block: 2rem 1rem; }\nsection { padding: 1.4rem; border-radius: 1rem; background: #fff; box-shadow: 0 12px 35px rgba(25,42,70,.09); }\nfieldset { margin: 0 0 1rem; padding: 1rem; border: 1px solid #c9d7e5; border-radius: .8rem; }\nlegend { padding-inline: .35rem; font-weight: 700; }\nfieldset div + div { margin-top: .85rem; }\nlabel { display: block; margin-bottom: .3rem; font-weight: 650; }\ninput:not([type=\"checkbox\"]), select { width: 100%; min-height: 2.7rem; padding: .65rem .75rem; border: 1px solid #8fa5ba; border-radius: .55rem; font: inherit; }\ninput:focus, select:focus, button:focus { outline: .2rem solid #77b7ee; outline-offset: .12rem; }\nbutton { min-height: 2.7rem; padding: .65rem 1rem; border: 0; border-radius: .55rem; font: inherit; font-weight: 700; cursor: pointer; }\nbutton[type=\"submit\"] { background: #155e95; color: #fff; }\nbutton[type=\"reset\"] { background: #dce7f0; color: #20364a; }\nfooter { padding-block: 1rem 2rem; color: #4d5a6a; }\n@media (max-width: 540px) { header, main, footer { width: min(100% - 1rem, 820px); } section { padding: 1rem; } button { width: 100%; margin-top: .5rem; } }\n",
      "js": "// Arquivo de apoio. O envio real dos dados será estudado em exercícios posteriores.\nconst formulario = document.querySelector('form');\nformulario?.addEventListener('submit', (event) => {\n  event.preventDefault();\n  console.info('Formulário válido e pronto para integração futura.');\n});\nconsole.info('Exercício 02 carregado.');\n"
    },
    "nomesArquivos": {
      "html": "index.html",
      "css": "estilo.css",
      "js": "script.js"
    },
    "passos": {
      "html": [
        {
          "titulo": "Documento e metadados",
          "linhas": [
            1,
            9
          ],
          "explicacao": "O documento informa o idioma, a codificação, a adaptação para telas e uma descrição do formulário. Esses dados ajudam o navegador e tecnologias assistivas a interpretar a página."
        },
        {
          "titulo": "Cabeçalho e contexto",
          "linhas": [
            10,
            14
          ],
          "explicacao": "O header apresenta um único h1 e explica por que o usuário preencherá o cadastro. O texto deve ser direto e orientar antes da interação."
        },
        {
          "titulo": "Região principal e formulário",
          "linhas": [
            15,
            20
          ],
          "explicacao": "O main contém a seção principal. O formulário usa aria-describedby para relacionar a orientação geral ao conjunto de campos."
        },
        {
          "titulo": "Identificação do usuário",
          "linhas": [
            21,
            34
          ],
          "explicacao": "O primeiro fieldset agrupa nome e e-mail. Cada campo possui label ligado pelo par for e id, tipo coerente, name, autocomplete e required."
        },
        {
          "titulo": "Perfil e setor",
          "linhas": [
            35,
            58
          ],
          "explicacao": "O segundo fieldset usa elementos select para opções conhecidas. A opção inicial vazia evita que uma escolha seja registrada sem decisão do usuário."
        },
        {
          "titulo": "Aceite das regras",
          "linhas": [
            59,
            66
          ],
          "explicacao": "O checkbox também precisa de rótulo associado. O atributo required impede o envio sem a confirmação solicitada."
        },
        {
          "titulo": "Ações e encerramento",
          "linhas": [
            67,
            82
          ],
          "explicacao": "Os botões usam tipos explícitos: submit envia e reset limpa. Depois, form, section, main e body são encerrados corretamente."
        }
      ]
    },
    "roteiro": [
      "Retomar a estrutura semântica do exercício anterior e apresentar o cadastro de usuários como parte de um sistema real.",
      "Demonstrar a diferença entre texto solto e label associado ao campo, testando o clique no rótulo.",
      "Explicar fieldset e legend como agrupamento semântico, não apenas visual.",
      "Comparar input text, email e checkbox, mostrando por que o tipo do campo importa.",
      "Testar required, autocomplete e a navegação usando apenas Tab, Shift+Tab, espaço e Enter.",
      "Pedir que os alunos digitem o formulário e permitir mudanças de textos e opções sem perder os requisitos de acessibilidade.",
      "Validar, baixar o index.html e orientar o envio da pasta exercicio-02 ao GitHub e ao Classroom."
    ],
    "classroom": {
      "titulo": "Exercício 02 — Formulário Acessível de Cadastro de Usuário",
      "descricao": "Objetivo: construir um formulário HTML organizado e acessível para o cadastro de usuários de um sistema interno.\n\nOrientações:\nCrie a pasta `exercicio-02` no repositório `atividades-praticas`.\nDigite o arquivo `index.html` apresentado na plataforma.\nInclua os campos nome, e-mail, perfil, setor e aceite das regras.\nAssocie cada campo ao seu `label` usando `for` e `id`.\nOrganize os campos com `fieldset` e `legend`.\nUse tipos de campo coerentes, `required` e `autocomplete` quando indicado.\nTeste o formulário usando o mouse e somente o teclado.\nValide o arquivo na plataforma antes de entregar.\n\nEntrega: anexe no Google Classroom o link do repositório com a pasta `exercicio-02`.\n\nPortal da Atividade: plataforma do 3º DS — Programação no Desenvolvimento de Sistemas."
    },
    "professor": {
      "testes": [
        "Clicar em cada label e confirmar que o foco vai para o campo correspondente.",
        "Navegar por todos os controles usando Tab e Shift+Tab, sem depender do mouse.",
        "Tentar enviar o formulário vazio e confirmar a atuação dos campos required.",
        "Digitar um e-mail inválido e observar a validação nativa do navegador.",
        "Alterar textos, ids e opções de forma coerente e confirmar que a validação aceita a solução equivalente.",
        "Remover um label, um legend ou um tipo de input obrigatório e confirmar o diagnóstico específico."
      ],
      "erros": [
        "Usar placeholder como substituto do label.",
        "Criar label com for que não corresponde ao id de nenhum campo.",
        "Usar type=\"text\" para o e-mail ou esquecer o type do checkbox.",
        "Agrupar campos sem fieldset e legend.",
        "Esquecer name ou required nos controles necessários.",
        "Forçar a ordem do teclado com tabindex positivo."
      ],
      "notas": [
        "A validação aceita textos, valores e ids diferentes quando as associações permanecem corretas.",
        "Mostre que clicar no label amplia a área de interação, algo especialmente útil no checkbox e em telas sensíveis ao toque.",
        "Não introduza CSS ainda; a prioridade é a estrutura e o comportamento nativo do formulário.",
        "O formulário não precisa salvar dados nesta etapa. JavaScript e persistência serão acrescentados em exercícios posteriores."
      ],
      "python": "# Continuidade da trilha\n# Os mesmos dados de usuário serão representados\n# por dicionários, classes e APIs nos blocos de Python."
    },
    "permitirBase": {
      "html": false
    },
    "validacao": {
      "tipo": "html-semantico",
      "htmlSemantico": {
        "doctype": true,
        "idioma": true,
        "charset": true,
        "viewport": true,
        "tagsMinimas": {
          "header": 1,
          "main": 1,
          "section": 1,
          "form": 1,
          "fieldset": 3,
          "legend": 3,
          "label": 5,
          "input": 3,
          "select": 2,
          "option": 4,
          "button": 2,
          "footer": 1,
          "h1": 1,
          "h2": 1
        },
        "tagsExatas": {
          "main": 1,
          "form": 1,
          "h1": 1
        },
        "relacoes": [
          {
            "pai": "main",
            "filho": "form",
            "minimo": 1,
            "descricao": "coloque o formulário dentro do conteúdo principal"
          },
          {
            "pai": "form",
            "filho": "fieldset",
            "minimo": 3,
            "descricao": "organize os campos em grupos com fieldset"
          },
          {
            "pai": "fieldset",
            "filho": "legend",
            "minimo": 3,
            "descricao": "dê um título a cada grupo usando legend"
          }
        ],
        "hierarquiaTitulos": true,
        "idsUnicos": true,
        "formularioAcessivel": {
          "controlesMinimos": 5,
          "labelsAssociados": true,
          "tiposInputMinimos": {
            "text": 1,
            "email": 1,
            "checkbox": 1
          },
          "selectsMinimos": 2,
          "camposObrigatoriosMinimos": 5,
          "autocompletesMinimos": 2,
          "fieldsetsComLegend": 3,
          "botaoSubmit": true,
          "nomesObrigatorios": true,
          "tabindexPositivoProibido": true
        }
      }
    },
    "fasePedagogica": 2,
    "apoioAutomatico": {
      "enabled": true,
      "initialAccess": true,
      "minActiveSeconds": 180,
      "minAttempts": 2,
      "minKeystrokes": 40,
      "minExecutions": 1,
      "minHints": 1,
      "requiredSignals": 3,
      "blocks": {
        "html": [
          {
            "id": "estrutura-documento-html",
            "title": "Completar estrutura inicial do documento",
            "description": "Insere o documento HTML básico. O formulário, os rótulos, grupos e campos acessíveis ainda deverão ser construídos pelo aluno.",
            "reason": "fase inicial",
            "mode": "replace-empty",
            "content": "<!DOCTYPE html>\n<html lang=\"pt-BR\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Cadastro de Usuário</title>\n</head>\n<body>\n    <!-- Construa aqui o formulário acessível. -->\n</body>\n</html>"
          }
        ]
      }
    },
    "ordemDownloads": [
      "html",
      "css",
      "js"
    ],
    "fluxoEntrega": {
      "etapas": [
        "Digite ou complete o arquivo solicitado",
        "Execute o código atual",
        "Teste o comportamento no preview",
        "Valide o arquivo",
        "Conclua a atividade",
        "Gere a evidência",
        "Baixe o ZIP e entregue no Classroom"
      ]
    },
    "referenciaCompletaPadrao": true,
    "arquivosApoio": [
      "css",
      "js"
    ],
    "tempoEstimado": "25–30 min",
    "nivel": "Iniciante"
  },
  {
    "numero": 3,
    "titulo": "Exercício 03 — Tabela de Registros e Status",
    "nomeCurto": "Registros e Status",
    "tema": "HTML semântico aplicado à representação acessível de dados tabulares",
    "objetivo": "Construir uma tabela de chamados com legenda, cabeçalhos associados, linhas de dados e situações compreensíveis sem depender apenas de cor.",
    "retomadas": [
      "estrutura semântica",
      "hierarquia de títulos",
      "atributos e acessibilidade"
    ],
    "novos": [
      "table, caption, thead e tbody",
      "tr, th, td e scope",
      "time e status textual",
      "região rolável para telas menores"
    ],
    "pasta": "exercicio-03",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/",
    "githubUrl": "https://github.com/",
    "ordemArquivos": [
      "html"
    ],
    "arquivos": {
      "html": "<!DOCTYPE html>\n<html lang=\"pt-BR\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <meta name=\"description\" content=\"Tabela de chamados e ordens de serviço com cabeçalhos e status acessíveis.\">\n    <title>Registros e Status | Portal DS</title>\n    <link rel=\"stylesheet\" href=\"estilo.css\">\n</head>\n<body>\n    <header>\n        <h1>Registros de Atendimento</h1>\n        <p>Consulte os chamados, responsáveis, prioridades, prazos e situações atuais.</p>\n    </header>\n\n    <main>\n        <section aria-labelledby=\"titulo-registros\">\n            <h2 id=\"titulo-registros\">Chamados da equipe de suporte</h2>\n            <p>Os estados são apresentados por texto para que a informação não dependa apenas de cores.</p>\n\n            <div class=\"table-scroll\" role=\"region\" aria-label=\"Tabela rolável de chamados\" tabindex=\"0\">\n                <table>\n                    <caption>Ordens de serviço registradas em agosto de 2026</caption>\n                    <thead>\n                        <tr>\n                            <th scope=\"col\">Código</th>\n                            <th scope=\"col\">Responsável</th>\n                            <th scope=\"col\">Prioridade</th>\n                            <th scope=\"col\">Prazo</th>\n                            <th scope=\"col\">Situação</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr tabindex=\"0\">\n                            <td>OS-031</td>\n                            <td>Ana Ribeiro</td>\n                            <td>Alta</td>\n                            <td><time datetime=\"2026-08-06\">06/08/2026</time></td>\n                            <td><span class=\"status\">Em atendimento</span></td>\n                        </tr>\n                        <tr tabindex=\"0\">\n                            <td>OS-032</td>\n                            <td>Bruno Lima</td>\n                            <td>Média</td>\n                            <td><time datetime=\"2026-08-08\">08/08/2026</time></td>\n                            <td><span class=\"status\">Aguardando usuário</span></td>\n                        </tr>\n                        <tr tabindex=\"0\">\n                            <td>OS-033</td>\n                            <td>Carla Souza</td>\n                            <td>Baixa</td>\n                            <td><time datetime=\"2026-08-12\">12/08/2026</time></td>\n                            <td><span class=\"status\">Planejado</span></td>\n                        </tr>\n                        <tr tabindex=\"0\">\n                            <td>OS-034</td>\n                            <td>Diego Martins</td>\n                            <td>Alta</td>\n                            <td><time datetime=\"2026-08-05\">05/08/2026</time></td>\n                            <td><span class=\"status\">Concluído</span></td>\n                        </tr>\n                    </tbody>\n                </table>\n            </div>\n        </section>\n    </main>\n\n    <footer>\n        <p>Projeto educacional — 3º DS · Programação no Desenvolvimento de Sistemas</p>\n    </footer>\n\n    <script src=\"script.js\"></script>\n</body>\n</html>",
      "css": ":root { font-family: Inter, system-ui, sans-serif; color: #172231; background: #eef3f8; }\n* { box-sizing: border-box; }\nbody { margin: 0; line-height: 1.55; }\nheader, main, footer { width: min(100% - 2rem, 1080px); margin-inline: auto; }\nheader { padding-block: 2rem 1rem; }\nsection { padding: 1.35rem; border-radius: 1rem; background: #fff; box-shadow: 0 12px 35px rgba(25,42,70,.09); }\n.table-scroll { overflow-x: auto; border: 1px solid #c7d5e3; border-radius: .8rem; }\ntable { width: 100%; min-width: 760px; border-collapse: collapse; }\ncaption { padding: 1rem; font-size: 1.1rem; font-weight: 750; text-align: left; color: #183f61; }\nth, td { padding: .8rem .9rem; border-top: 1px solid #d8e1ea; text-align: left; vertical-align: top; }\nthead th { background: #173f62; color: #fff; border-top: 0; }\ntbody tr:nth-child(even) { background: #f5f8fb; }\ntbody tr:hover, tbody tr:focus-visible { background: #e5f2ff; outline: .18rem solid #2e7fbd; outline-offset: -.18rem; }\n.status { display: inline-block; padding: .25rem .55rem; border-radius: 999px; background: #e6eef5; font-weight: 700; white-space: nowrap; }\nfooter { padding-block: 1rem 2rem; color: #4d5a6a; }\n@media (max-width: 540px) { header, main, footer { width: min(100% - 1rem, 1080px); } section { padding: .9rem; } }\n",
      "js": "// Arquivo de apoio. O foco pedagógico deste exercício é a tabela semântica.\ndocument.querySelectorAll('tbody tr').forEach((linha) => {\n  linha.addEventListener('click', () => linha.focus());\n});\nconsole.info('Exercício 03 carregado.');\n"
    },
    "nomesArquivos": {
      "html": "index.html",
      "css": "estilo.css",
      "js": "script.js"
    },
    "passos": {
      "html": [
        {
          "titulo": "Documento e arquivos de apoio",
          "linhas": [
            1,
            10
          ],
          "explicacao": "O início identifica o documento, define idioma, codificação, viewport, descrição, título e a ligação com o arquivo de estilos fornecido."
        },
        {
          "titulo": "Contexto da listagem",
          "linhas": [
            11,
            21
          ],
          "explicacao": "O cabeçalho e a seção principal explicam o objetivo da tabela e deixam explícito que o status não pode depender somente de cor."
        },
        {
          "titulo": "Região rolável e legenda",
          "linhas": [
            22,
            25
          ],
          "explicacao": "A div permite rolagem horizontal dentro da própria região em telas pequenas. O caption descreve o conjunto de dados da tabela."
        },
        {
          "titulo": "Cabeçalhos das colunas",
          "linhas": [
            26,
            35
          ],
          "explicacao": "O thead reúne os títulos. Cada th usa scope=\"col\" para indicar que identifica uma coluna inteira."
        },
        {
          "titulo": "Linhas de registros",
          "linhas": [
            36,
            54
          ],
          "explicacao": "O tbody contém uma linha para cada ordem de serviço. As células seguem a mesma ordem dos cabeçalhos e os prazos usam time com datetime."
        },
        {
          "titulo": "Status textual e foco",
          "linhas": [
            55,
            67
          ],
          "explicacao": "Cada situação aparece como texto dentro da célula. As linhas podem receber foco para facilitar a leitura e a evidência de interação."
        },
        {
          "titulo": "Encerramento e script de apoio",
          "linhas": [
            68,
            74
          ],
          "explicacao": "A página termina com o rodapé e liga o script de apoio. O conteúdo principal do exercício continua sendo o HTML da tabela."
        }
      ]
    },
    "roteiro": [
      "Apresentar uma listagem real de chamados e discutir por que uma sequência de parágrafos não representa bem dados organizados em colunas.",
      "Explicar table, caption, thead, tbody, tr, th e td, construindo primeiro o cabeçalho e depois uma linha de dados.",
      "Demonstrar scope=\"col\" e relacionar o atributo à leitura feita por tecnologias assistivas.",
      "Comparar status somente por cor com status escrito em texto e reforçar que cor deve ser apoio, não a única informação.",
      "Adicionar pelo menos três registros coerentes e testar a leitura das colunas.",
      "Abrir o preview em computador e celular, verificando a rolagem apenas dentro da região da tabela.",
      "Validar, baixar o index.html e orientar o envio da pasta exercicio-03 ao GitHub e ao Classroom."
    ],
    "classroom": {
      "titulo": "Exercício 03 — Tabela de Registros e Status",
      "descricao": "Objetivo: representar chamados ou ordens de serviço em uma tabela HTML semântica e acessível.\n\nOrientações:\nCrie a pasta `exercicio-03` no repositório `atividades-praticas`.\nDigite o arquivo `index.html` apresentado na plataforma.\nCrie uma tabela com `caption`, `thead` e `tbody`.\nUse `th` com `scope=\"col\"` para identificar as colunas.\nInclua código, responsável, prioridade, prazo e situação.\nCadastre pelo menos três registros completos.\nEscreva o status em texto; não dependa apenas de cores.\nTeste a tabela em tela grande e em visualização de celular.\nValide o arquivo na plataforma antes de entregar.\n\nEntrega: anexe no Google Classroom o link do repositório com a pasta `exercicio-03`.\n\nPortal da Atividade: plataforma do 3º DS — Programação no Desenvolvimento de Sistemas."
    },
    "professor": {
      "testes": [
        "Confirmar a presença de caption, thead e tbody em uma única tabela.",
        "Verificar cinco cabeçalhos th com scope=\"col\".",
        "Conferir pelo menos três linhas completas no tbody.",
        "Ler uma linha seguindo a ordem código, responsável, prioridade, prazo e situação.",
        "Alterar textos e registros mantendo a estrutura e confirmar que a validação aceita a solução equivalente.",
        "Remover caption, scope ou o texto de um status e confirmar o diagnóstico específico.",
        "Testar em viewport estreito e confirmar que a rolagem horizontal fica contida na região da tabela."
      ],
      "erros": [
        "Montar a listagem apenas com divs ou parágrafos, sem table.",
        "Usar td no cabeçalho em vez de th.",
        "Esquecer caption, thead ou tbody.",
        "Criar th sem scope=\"col\".",
        "Misturar quantidades de células entre as linhas.",
        "Representar a situação somente por uma classe ou cor, sem texto visível.",
        "Deixar a tabela causar rolagem horizontal em toda a página."
      ],
      "notas": [
        "A validação aceita registros, nomes, datas e textos diferentes, desde que a estrutura tabular permaneça correta.",
        "O arquivo estilo.css é fornecido como apoio visual; a produção avaliada nesta etapa é o HTML.",
        "O tabindex zero nas linhas permite demonstrar foco sem alterar a ordem natural do teclado.",
        "Não introduza arrays ou JavaScript de dados ainda. A tabela será alimentada dinamicamente em exercícios posteriores."
      ],
      "python": "# Continuidade da trilha\n# Os registros desta tabela serão representados\n# por listas de dicionários e objetos em Python."
    },
    "permitirBase": {
      "html": false
    },
    "validacao": {
      "tipo": "html-semantico",
      "htmlSemantico": {
        "doctype": true,
        "idioma": true,
        "charset": true,
        "viewport": true,
        "tagsMinimas": {
          "header": 1,
          "main": 1,
          "section": 1,
          "table": 1,
          "caption": 1,
          "thead": 1,
          "tbody": 1,
          "tr": 4,
          "th": 5,
          "td": 15,
          "footer": 1,
          "h1": 1,
          "h2": 1
        },
        "tagsExatas": {
          "main": 1,
          "table": 1,
          "h1": 1
        },
        "relacoes": [
          {
            "pai": "table",
            "filho": "caption",
            "minimo": 1,
            "descricao": "inclua uma legenda caption dentro da tabela"
          },
          {
            "pai": "thead",
            "filho": "th",
            "minimo": 5,
            "descricao": "use cabeçalhos th no thead"
          },
          {
            "pai": "tbody",
            "filho": "tr",
            "minimo": 3,
            "descricao": "inclua pelo menos três registros no tbody"
          }
        ],
        "hierarquiaTitulos": true,
        "idsUnicos": true,
        "tabelaAcessivel": {
          "tabelasMinimas": 1,
          "captionObrigatorio": true,
          "cabecalhosMinimos": 5,
          "scopeColMinimo": 5,
          "linhasCorpoMinimas": 3,
          "celulasPorLinhaMinimas": 5,
          "colunaStatus": true,
          "statusTextual": true,
          "padroesCabecalhoStatus": [
            "status",
            "situação",
            "situacao",
            "estado"
          ]
        }
      }
    },
    "fasePedagogica": 3,
    "apoioAutomatico": {
      "enabled": true,
      "initialAccess": true,
      "minActiveSeconds": 180,
      "minAttempts": 2,
      "minKeystrokes": 40,
      "minExecutions": 1,
      "minHints": 1,
      "requiredSignals": 3,
      "blocks": {
        "html": [
          {
            "id": "estrutura-documento-html",
            "title": "Completar estrutura inicial do documento",
            "description": "Insere somente a estrutura inicial do HTML. A tabela, os cabeçalhos, registros, status e prazos continuam sendo construídos pelo aluno.",
            "reason": "fase inicial",
            "mode": "replace-empty",
            "content": "<!DOCTYPE html>\n<html lang=\"pt-BR\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Registros e Status</title>\n</head>\n<body>\n    <!-- Construa aqui a tabela semântica de registros. -->\n</body>\n</html>"
          }
        ]
      }
    },
    "ordemDownloads": [
      "html",
      "css",
      "js"
    ],
    "fluxoEntrega": {
      "etapas": [
        "Digite ou complete o arquivo solicitado",
        "Execute o código atual",
        "Teste o comportamento no preview",
        "Valide o arquivo",
        "Conclua a atividade",
        "Gere a evidência",
        "Baixe o ZIP e entregue no Classroom"
      ]
    },
    "referenciaCompletaPadrao": true,
    "arquivosApoio": [
      "css",
      "js"
    ],
    "tempoEstimado": "25–30 min",
    "nivel": "Iniciante"
  },
  {
    "numero": 4,
    "titulo": "Exercício 04 — Navegação e Organização de Páginas",
    "nomeCurto": "Navegação Multipágina",
    "tema": "HTML aplicado à organização de projetos, estrutura de pastas e caminhos relativos",
    "objetivo": "Organizar um miniportal com páginas de painel, cadastro e relatório, mantendo navegação consistente e caminhos relativos portáveis.",
    "retomadas": [
      "estrutura semântica",
      "links",
      "formulários",
      "tabelas e status"
    ],
    "novos": [
      "estrutura de pastas",
      "caminhos relativos",
      "../ para subir um nível",
      "menu consistente entre páginas",
      "recursos compartilhados"
    ],
    "pasta": "exercicio-04",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/",
    "githubUrl": "https://github.com/",
    "ordemArquivos": [
      "html",
      "htmlCadastro",
      "htmlRelatorio",
      "css",
      "js"
    ],
    "arquivos": {
      "html": "<!DOCTYPE html>\n<html lang=\"pt-BR\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <meta name=\"description\" content=\"Portal de serviços com navegação entre painel, cadastro e relatório.\">\n    <title>Painel | Portal de Serviços DS</title>\n    <link rel=\"stylesheet\" href=\"estilo.css\">\n</head>\n<body>\n    <header class=\"topo\">\n        <div>\n            <p class=\"marca\">Portal de Serviços DS</p>\n            <h1>Painel de atendimento</h1>\n        </div>\n\n        <nav aria-label=\"Navegação principal\">\n            <ul>\n                <li><a href=\"index.html\" aria-current=\"page\">Painel</a></li>\n                <li><a href=\"paginas/cadastro.html\">Cadastro</a></li>\n                <li><a href=\"paginas/relatorio.html\">Relatório</a></li>\n            </ul>\n        </nav>\n    </header>\n\n    <main>\n        <section class=\"boas-vindas\" aria-labelledby=\"titulo-visao-geral\">\n            <div>\n                <p class=\"etiqueta\">Visão geral</p>\n                <h2 id=\"titulo-visao-geral\">Organize as rotinas do sistema</h2>\n                <p>Este miniportal separa cada responsabilidade em uma página própria e mantém o mesmo menu em todo o projeto.</p>\n            </div>\n            <a class=\"botao\" href=\"paginas/cadastro.html\">Cadastrar usuário</a>\n        </section>\n\n        <section class=\"grade\" aria-label=\"Atalhos do sistema\">\n            <article>\n                <p class=\"numero\">01</p>\n                <h2>Cadastro</h2>\n                <p>Registre usuários, perfis e setores em uma página dedicada.</p>\n                <a href=\"paginas/cadastro.html\">Abrir cadastro</a>\n            </article>\n\n            <article>\n                <p class=\"numero\">02</p>\n                <h2>Relatório</h2>\n                <p>Consulte registros recentes e acompanhe a situação dos atendimentos.</p>\n                <a href=\"paginas/relatorio.html\">Abrir relatório</a>\n            </article>\n\n            <article>\n                <p class=\"numero\">03</p>\n                <h2>Estrutura</h2>\n                <p>Observe como caminhos relativos conectam arquivos localizados em pastas diferentes.</p>\n                <a href=\"README.md\">Ler orientações</a>\n            </article>\n        </section>\n    </main>\n\n    <footer>\n        <p>3º DS — Programação no Desenvolvimento de Sistemas</p>\n    </footer>\n\n    <script src=\"script.js\"></script>\n</body>\n</html>",
      "htmlCadastro": "<!DOCTYPE html>\n<html lang=\"pt-BR\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <meta name=\"description\" content=\"Página de cadastro do Portal de Serviços DS.\">\n    <title>Cadastro | Portal de Serviços DS</title>\n    <link rel=\"stylesheet\" href=\"../estilo.css\">\n</head>\n<body>\n    <header class=\"topo\">\n        <div>\n            <p class=\"marca\">Portal de Serviços DS</p>\n            <h1>Cadastro de usuário</h1>\n        </div>\n\n        <nav aria-label=\"Navegação principal\">\n            <ul>\n                <li><a href=\"../index.html\">Painel</a></li>\n                <li><a href=\"cadastro.html\" aria-current=\"page\">Cadastro</a></li>\n                <li><a href=\"relatorio.html\">Relatório</a></li>\n            </ul>\n        </nav>\n    </header>\n\n    <main>\n        <section class=\"painel-formulario\" aria-labelledby=\"titulo-formulario\">\n            <div>\n                <p class=\"etiqueta\">Novo registro</p>\n                <h2 id=\"titulo-formulario\">Dados para acesso ao sistema</h2>\n                <p>Preencha os campos e observe que esta página reutiliza os arquivos compartilhados da pasta principal.</p>\n            </div>\n\n            <form>\n                <div class=\"campo\">\n                    <label for=\"nome\">Nome completo</label>\n                    <input type=\"text\" id=\"nome\" name=\"nome\" autocomplete=\"name\" required>\n                </div>\n\n                <div class=\"campo\">\n                    <label for=\"email\">E-mail institucional</label>\n                    <input type=\"email\" id=\"email\" name=\"email\" autocomplete=\"email\" required>\n                </div>\n\n                <div class=\"campo\">\n                    <label for=\"perfil\">Perfil</label>\n                    <select id=\"perfil\" name=\"perfil\" required>\n                        <option value=\"\">Selecione</option>\n                        <option value=\"aluno\">Aluno</option>\n                        <option value=\"professor\">Professor</option>\n                        <option value=\"suporte\">Suporte</option>\n                    </select>\n                </div>\n\n                <button type=\"submit\">Salvar cadastro</button>\n            </form>\n        </section>\n    </main>\n\n    <footer>\n        <p><a href=\"../index.html\">Voltar ao painel</a></p>\n    </footer>\n\n    <script src=\"../script.js\"></script>\n</body>\n</html>",
      "htmlRelatorio": "<!DOCTYPE html>\n<html lang=\"pt-BR\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <meta name=\"description\" content=\"Página de relatório do Portal de Serviços DS.\">\n    <title>Relatório | Portal de Serviços DS</title>\n    <link rel=\"stylesheet\" href=\"../estilo.css\">\n</head>\n<body>\n    <header class=\"topo\">\n        <div>\n            <p class=\"marca\">Portal de Serviços DS</p>\n            <h1>Relatório de atendimentos</h1>\n        </div>\n\n        <nav aria-label=\"Navegação principal\">\n            <ul>\n                <li><a href=\"../index.html\">Painel</a></li>\n                <li><a href=\"cadastro.html\">Cadastro</a></li>\n                <li><a href=\"relatorio.html\" aria-current=\"page\">Relatório</a></li>\n            </ul>\n        </nav>\n    </header>\n\n    <main>\n        <section aria-labelledby=\"titulo-registros\">\n            <p class=\"etiqueta\">Acompanhamento</p>\n            <h2 id=\"titulo-registros\">Registros recentes</h2>\n            <p>Esta página está dentro da pasta <code>paginas</code>, por isso usa <code>../</code> para retornar à pasta principal.</p>\n\n            <div class=\"table-scroll\" role=\"region\" aria-label=\"Tabela rolável de atendimentos\" tabindex=\"0\">\n                <table>\n                    <caption>Atendimentos registrados na semana</caption>\n                    <thead>\n                        <tr>\n                            <th scope=\"col\">Código</th>\n                            <th scope=\"col\">Usuário</th>\n                            <th scope=\"col\">Serviço</th>\n                            <th scope=\"col\">Situação</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr>\n                            <td>AT-041</td>\n                            <td>Marina Alves</td>\n                            <td>Criação de acesso</td>\n                            <td><span class=\"status\">Concluído</span></td>\n                        </tr>\n                        <tr>\n                            <td>AT-042</td>\n                            <td>Rafael Lima</td>\n                            <td>Troca de perfil</td>\n                            <td><span class=\"status\">Em análise</span></td>\n                        </tr>\n                        <tr>\n                            <td>AT-043</td>\n                            <td>Bianca Souza</td>\n                            <td>Recuperação de senha</td>\n                            <td><span class=\"status\">Aguardando</span></td>\n                        </tr>\n                    </tbody>\n                </table>\n            </div>\n        </section>\n    </main>\n\n    <footer>\n        <p><a href=\"../index.html\">Voltar ao painel</a></p>\n    </footer>\n\n    <script src=\"../script.js\"></script>\n</body>\n</html>",
      "css": ":root {\n    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif;\n    color: #eaf2ff;\n    background: #07111f;\n    line-height: 1.55;\n}\n\n* { box-sizing: border-box; }\n\nbody {\n    min-height: 100vh;\n    margin: 0;\n    background:\n        radial-gradient(circle at top right, rgba(31, 128, 255, .22), transparent 32rem),\n        linear-gradient(145deg, #07111f, #0b1a2e 58%, #0d2340);\n}\n\na { color: #8fd3ff; }\n\na:focus-visible,\nbutton:focus-visible,\ninput:focus-visible,\nselect:focus-visible,\n[tabindex=\"0\"]:focus-visible {\n    outline: .2rem solid #67d4ff;\n    outline-offset: .2rem;\n}\n\n.topo,\nmain,\nfooter {\n    width: min(100% - 2rem, 1120px);\n    margin-inline: auto;\n}\n\n.topo {\n    display: flex;\n    align-items: end;\n    justify-content: space-between;\n    gap: 1.5rem;\n    padding-block: 2rem 1.25rem;\n}\n\n.marca,\n.etiqueta {\n    margin: 0 0 .3rem;\n    color: #6fd7ff;\n    font-size: .78rem;\n    font-weight: 800;\n    letter-spacing: .12em;\n    text-transform: uppercase;\n}\n\nh1, h2, p { margin-top: 0; }\n\nnav ul {\n    display: flex;\n    flex-wrap: wrap;\n    gap: .55rem;\n    margin: 0;\n    padding: 0;\n    list-style: none;\n}\n\nnav a {\n    display: inline-block;\n    padding: .65rem .85rem;\n    border: 1px solid rgba(143, 211, 255, .24);\n    border-radius: .7rem;\n    color: #dcecff;\n    text-decoration: none;\n}\n\nnav a:hover,\nnav a[aria-current=\"page\"] {\n    border-color: #6fd7ff;\n    background: rgba(68, 172, 255, .18);\n    color: #fff;\n}\n\nmain > section,\n.boas-vindas,\n.grade article {\n    border: 1px solid rgba(143, 211, 255, .18);\n    border-radius: 1rem;\n    background: rgba(10, 28, 49, .78);\n    box-shadow: 0 1.4rem 4rem rgba(0, 0, 0, .22);\n}\n\n.boas-vindas {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 1.5rem;\n    padding: 1.5rem;\n}\n\n.botao,\nbutton {\n    display: inline-flex;\n    min-height: 2.75rem;\n    align-items: center;\n    justify-content: center;\n    padding: .65rem 1rem;\n    border: 0;\n    border-radius: .7rem;\n    background: linear-gradient(135deg, #1c88ff, #27c2f0);\n    color: #03101d;\n    font: inherit;\n    font-weight: 850;\n    text-decoration: none;\n    cursor: pointer;\n}\n\n.grade {\n    display: grid;\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n    gap: 1rem;\n    margin-top: 1rem;\n}\n\n.grade article { padding: 1.25rem; }\n.numero { color: #6fd7ff; font-weight: 900; }\n\n.painel-formulario,\nmain > section:not(.boas-vindas) { padding: 1.5rem; }\n\nform {\n    display: grid;\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    gap: 1rem;\n    margin-top: 1.4rem;\n}\n\n.campo:last-of-type,\nform button { grid-column: 1 / -1; }\n\nlabel {\n    display: block;\n    margin-bottom: .35rem;\n    font-weight: 750;\n}\n\ninput,\nselect {\n    width: 100%;\n    min-height: 2.8rem;\n    padding: .65rem .75rem;\n    border: 1px solid #4d6b88;\n    border-radius: .6rem;\n    background: #081523;\n    color: #f2f7ff;\n    font: inherit;\n}\n\n.table-scroll {\n    overflow-x: auto;\n    border: 1px solid rgba(143, 211, 255, .2);\n    border-radius: .8rem;\n}\n\ntable {\n    width: 100%;\n    min-width: 680px;\n    border-collapse: collapse;\n}\n\ncaption,\nth,\ntd { padding: .8rem .9rem; text-align: left; }\ncaption { font-weight: 800; }\nthead { background: #12395c; }\nth, td { border-top: 1px solid rgba(143, 211, 255, .16); }\ntbody tr:hover { background: rgba(70, 167, 255, .1); }\n.status { font-weight: 800; }\n\nfooter { padding-block: 1.5rem 2.5rem; color: #a9bdd2; }\n\n@media (max-width: 760px) {\n    .topo,\n    .boas-vindas { align-items: stretch; flex-direction: column; }\n    .grade { grid-template-columns: 1fr; }\n    form { grid-template-columns: 1fr; }\n}\n\n@media (max-width: 480px) {\n    .topo,\n    main,\n    footer { width: min(100% - 1rem, 1120px); }\n    nav a { width: 100%; }\n    nav li { flex: 1 1 100%; }\n    .boas-vindas,\n    .painel-formulario,\n    main > section:not(.boas-vindas) { padding: 1rem; }\n}",
      "js": "// Arquivo compartilhado pelas três páginas do miniportal.\n(() => {\n    const formulario = document.querySelector('form');\n\n    formulario?.addEventListener('submit', (event) => {\n        event.preventDefault();\n        const nome = document.querySelector('#nome')?.value.trim();\n        const mensagem = nome ? `Cadastro de ${nome} preparado com sucesso.` : 'Cadastro preparado com sucesso.';\n        alert(mensagem);\n    });\n\n    console.info(`Página atual: ${document.title}`);\n})();",
      "readme": "# Exercício 04 — Navegação e Organização de Páginas\n\n## Estrutura\n\n```text\nexercicio-04/\n├── index.html\n├── estilo.css\n├── script.js\n├── README.md\n└── paginas/\n    ├── cadastro.html\n    └── relatorio.html\n```\n\n## Como executar\n\nAbra `index.html` no navegador. Use o menu para visitar as três páginas.\n\nOs arquivos dentro de `paginas/` utilizam `../` para acessar `index.html`, `estilo.css` e `script.js`, que estão um nível acima.\n\nNão utilize caminhos do computador, como `C:\\Users\\...`, nem caminhos iniciados por `file:///`. O projeto deve funcionar depois de ser movido para outra pasta ou publicado no GitHub Pages.\n"
    },
    "nomesArquivos": {
      "html": "index.html",
      "htmlCadastro": "paginas/cadastro.html",
      "htmlRelatorio": "paginas/relatorio.html",
      "css": "estilo.css",
      "js": "script.js",
      "readme": "README.md"
    },
    "passos": {
      "html": [
        {
          "titulo": "Documento principal e recursos",
          "linhas": [
            1,
            10
          ],
          "explicacao": "O index.html fica na pasta principal e usa estilo.css e script.js sem subir ou entrar em outra pasta."
        },
        {
          "titulo": "Menu da página principal",
          "linhas": [
            11,
            27
          ],
          "explicacao": "Os links para Cadastro e Relatório entram na pasta paginas. O aria-current identifica a página aberta."
        },
        {
          "titulo": "Conteúdo do painel",
          "linhas": [
            28,
            60
          ],
          "explicacao": "O painel apresenta atalhos para as páginas do miniportal e reforça que cada arquivo possui uma responsabilidade."
        },
        {
          "titulo": "Encerramento",
          "linhas": [
            61,
            66
          ],
          "explicacao": "O rodapé e o script compartilhado permanecem na pasta principal."
        }
      ],
      "htmlCadastro": [
        {
          "titulo": "Recursos um nível acima",
          "linhas": [
            1,
            10
          ],
          "explicacao": "Como cadastro.html está dentro de paginas, ../estilo.css retorna um nível antes de localizar o arquivo."
        },
        {
          "titulo": "Menu relativo da página interna",
          "linhas": [
            11,
            27
          ],
          "explicacao": "Para voltar ao painel use ../index.html. Para navegar entre páginas da mesma pasta use apenas cadastro.html ou relatorio.html."
        },
        {
          "titulo": "Formulário da página",
          "linhas": [
            28,
            65
          ],
          "explicacao": "O formulário retoma rótulos, campos obrigatórios e select, agora dentro de uma página própria."
        },
        {
          "titulo": "Script compartilhado",
          "linhas": [
            66,
            66
          ],
          "explicacao": "O caminho ../script.js acessa o arquivo comum localizado na pasta principal."
        }
      ],
      "htmlRelatorio": [
        {
          "titulo": "Cabeçalho da página de relatório",
          "linhas": [
            1,
            27
          ],
          "explicacao": "O título é diferente e o menu preserva os mesmos destinos, marcando Relatório como página atual."
        },
        {
          "titulo": "Explicação do caminho ../",
          "linhas": [
            28,
            35
          ],
          "explicacao": "A própria página registra por que ../ é necessário ao retornar à pasta principal."
        },
        {
          "titulo": "Tabela de registros",
          "linhas": [
            36,
            73
          ],
          "explicacao": "A tabela retoma caption, th com scope e status textual em uma página específica de consulta."
        },
        {
          "titulo": "Retorno e recurso compartilhado",
          "linhas": [
            74,
            74
          ],
          "explicacao": "O rodapé retorna ao painel e o script é carregado com ../script.js."
        }
      ],
      "css": [
        {
          "titulo": "Identidade compartilhada",
          "linhas": [
            1,
            80
          ],
          "explicacao": "Um único arquivo CSS mantém cabeçalho, menu e painéis consistentes nas três páginas."
        },
        {
          "titulo": "Formulário, tabela e responsividade",
          "linhas": [
            81,
            180
          ],
          "explicacao": "O mesmo CSS atende componentes diferentes e reorganiza o layout em telas menores."
        }
      ],
      "js": [
        {
          "titulo": "Script compartilhado",
          "linhas": [
            1,
            11
          ],
          "explicacao": "O optional chaining permite que o mesmo script funcione nas páginas com e sem formulário."
        }
      ]
    },
    "roteiro": [
      "Apresentar a estrutura de pastas antes de escrever os links.",
      "Criar index.html na raiz e a pasta paginas com cadastro.html e relatorio.html.",
      "Comparar caminhos da raiz com caminhos usados dentro da subpasta.",
      "Construir o mesmo menu nas três páginas e usar aria-current na página aberta.",
      "Conectar estilo.css e script.js compartilhados usando caminhos adequados.",
      "Executar localmente, visitar todos os links e confirmar que nenhuma página depende de caminho do computador.",
      "Validar os cinco arquivos na plataforma e subir a pasta exercicio-04 no repositório atividades-praticas."
    ],
    "classroom": {
      "titulo": "Exercício 04 — Navegação e Organização de Páginas",
      "descricao": "Objetivo: organizar um miniportal com três páginas HTML e caminhos relativos funcionais.\n\nOrientações:\nCrie a pasta `exercicio-04` no repositório `atividades-praticas`.\nNa raiz, crie `index.html`, `estilo.css`, `script.js` e `README.md`.\nCrie a pasta `paginas` com `cadastro.html` e `relatorio.html`.\nMantenha o mesmo menu nas três páginas.\nNo index, use caminhos que entram em `paginas/`.\nNas páginas internas, use `../index.html`, `../estilo.css` e `../script.js` para retornar um nível.\nNão use caminhos do computador nem endereços `file:///`.\nAbra `index.html`, teste todos os links e valide os arquivos na plataforma.\n\nEntrega: anexe no Google Classroom o link do repositório com a pasta `exercicio-04`.\n\nPortal da Atividade: plataforma do 3º DS — Programação no Desenvolvimento de Sistemas."
    },
    "professor": {
      "testes": [
        "Abrir index.html e visitar Cadastro e Relatório pelo menu.",
        "Em cadastro.html, voltar ao painel e abrir relatorio.html sem erro 404.",
        "Confirmar títulos distintos nas três páginas.",
        "Mover a pasta exercicio-04 para outro local e repetir o teste de navegação.",
        "Remover ../ de um recurso interno e confirmar o diagnóstico da plataforma.",
        "Inserir um caminho C:\\Users\\... e confirmar que a validação rejeita caminho absoluto local.",
        "Testar em celular e verificar ausência de rolagem horizontal da página."
      ],
      "erros": [
        "Colocar todas as páginas na mesma pasta e ainda usar ../.",
        "Usar /index.html, file:/// ou caminho completo do computador.",
        "Usar paginas/cadastro.html dentro da própria pasta paginas.",
        "Copiar o mesmo title para todas as páginas.",
        "Alterar o menu de uma página e deixar destinos inconsistentes.",
        "Referenciar estilo.css sem ../ nas páginas internas.",
        "Criar links que funcionam apenas no computador do aluno."
      ],
      "notas": [
        "A validação aceita textos, classes e conteúdo visual diferentes; os destinos relativos e a estrutura semântica devem permanecer corretos.",
        "O CSS e o JavaScript são arquivos compartilhados. A base pode ser liberada porque o foco principal é a organização multipágina.",
        "O exercício prepara os alunos para sites maiores, templates Flask e publicação em GitHub Pages.",
        "Demonstre a leitura do caminho da esquerda para a direita e o significado de cada ../."
      ],
      "python": "# Continuidade da trilha\n# Em Flask, templates/ e static/ também exigirão\n# organização de pastas e referências coerentes."
    },
    "permitirBase": {
      "html": false,
      "htmlCadastro": false,
      "htmlRelatorio": false,
      "css": false,
      "js": false
    },
    "validacao": {
      "tipo": "html-semantico",
      "htmlSemanticoPorArquivo": {
        "html": {
          "doctype": true,
          "idioma": true,
          "charset": true,
          "viewport": true,
          "tagsMinimas": {
            "header": 1,
            "nav": 1,
            "main": 1,
            "footer": 1,
            "h1": 1,
            "section": 2,
            "article": 3,
            "a": 6,
            "h2": 3
          },
          "tagsExatas": {
            "main": 1,
            "h1": 1
          },
          "hierarquiaTitulos": true,
          "idsUnicos": true,
          "navegacaoMultipagina": {
            "linksMinimos": 3,
            "linksObrigatorios": [
              [
                "index.html",
                "./index.html"
              ],
              [
                "paginas/cadastro.html",
                "./paginas/cadastro.html"
              ],
              [
                "paginas/relatorio.html",
                "./paginas/relatorio.html"
              ]
            ],
            "proibirCaminhosAbsolutos": true,
            "ariaCurrent": true,
            "termosTitulo": [
              "painel"
            ],
            "stylesheetObrigatorio": [
              "estilo.css",
              "./estilo.css"
            ],
            "scriptObrigatorio": [
              "script.js",
              "./script.js"
            ]
          }
        },
        "htmlCadastro": {
          "doctype": true,
          "idioma": true,
          "charset": true,
          "viewport": true,
          "tagsMinimas": {
            "header": 1,
            "nav": 1,
            "main": 1,
            "footer": 1,
            "h1": 1,
            "form": 1,
            "label": 3,
            "input": 2,
            "select": 1,
            "button": 1,
            "a": 4,
            "h2": 1
          },
          "tagsExatas": {
            "main": 1,
            "h1": 1
          },
          "hierarquiaTitulos": true,
          "idsUnicos": true,
          "navegacaoMultipagina": {
            "linksMinimos": 3,
            "linksObrigatorios": [
              [
                "../index.html"
              ],
              [
                "cadastro.html",
                "./cadastro.html"
              ],
              [
                "relatorio.html",
                "./relatorio.html"
              ]
            ],
            "proibirCaminhosAbsolutos": true,
            "ariaCurrent": true,
            "termosTitulo": [
              "cadastro"
            ],
            "stylesheetObrigatorio": [
              "../estilo.css"
            ],
            "scriptObrigatorio": [
              "../script.js"
            ]
          },
          "formularioAcessivel": {
            "formulariosMinimos": 1,
            "controlesMinimos": 3,
            "labelsAssociadosMinimos": 3,
            "inputsPorTipo": {
              "text": 1,
              "email": 1
            },
            "selectsMinimos": 1,
            "camposObrigatoriosMinimos": 3,
            "autocompletesMinimos": 2,
            "botaoSubmit": true,
            "nomesObrigatorios": true,
            "tabindexPositivoProibido": true
          }
        },
        "htmlRelatorio": {
          "doctype": true,
          "idioma": true,
          "charset": true,
          "viewport": true,
          "tagsMinimas": {
            "header": 1,
            "nav": 1,
            "main": 1,
            "footer": 1,
            "h1": 1,
            "table": 1,
            "caption": 1,
            "thead": 1,
            "tbody": 1,
            "tr": 4,
            "th": 4,
            "td": 12,
            "a": 4,
            "h2": 1
          },
          "tagsExatas": {
            "main": 1,
            "h1": 1
          },
          "hierarquiaTitulos": true,
          "idsUnicos": true,
          "navegacaoMultipagina": {
            "linksMinimos": 3,
            "linksObrigatorios": [
              [
                "../index.html"
              ],
              [
                "cadastro.html",
                "./cadastro.html"
              ],
              [
                "relatorio.html",
                "./relatorio.html"
              ]
            ],
            "proibirCaminhosAbsolutos": true,
            "ariaCurrent": true,
            "termosTitulo": [
              "relatorio",
              "relatório"
            ],
            "stylesheetObrigatorio": [
              "../estilo.css"
            ],
            "scriptObrigatorio": [
              "../script.js"
            ]
          },
          "tabelaAcessivel": {
            "tabelasMinimas": 1,
            "captionObrigatorio": true,
            "cabecalhosMinimos": 4,
            "scopeColMinimo": 4,
            "linhasCorpoMinimas": 3,
            "celulasPorLinhaMinimas": 4,
            "colunaStatus": true,
            "statusTextual": true,
            "padroesCabecalhoStatus": [
              "status",
              "situação",
              "situacao",
              "estado"
            ]
          }
        }
      }
    },
    "fasePedagogica": 4,
    "apoioAutomatico": {
      "enabled": true,
      "initialAccess": false,
      "minActiveSeconds": 180,
      "minAttempts": 2,
      "minKeystrokes": 40,
      "minExecutions": 1,
      "minHints": 1,
      "requiredSignals": 3,
      "blocks": {
        "css": [
          {
            "id": "identidade-visual-base",
            "title": "Completar estilos-base compartilhados",
            "description": "Insere variáveis, Box Model básico e estilos gerais. A navegação entre páginas, os caminhos relativos e a organização principal não são preenchidos.",
            "reason": "tentativa prolongada",
            "mode": "append",
            "content": ":root {\n    --fundo: #07111f;\n    --superficie: #101d2f;\n    --texto: #eaf2ff;\n    --destaque: #67d4ff;\n    font-family: Inter, system-ui, sans-serif;\n    line-height: 1.5;\n}\n\n* {\n    box-sizing: border-box;\n}\n\nbody {\n    margin: 0;\n    min-height: 100vh;\n    background: var(--fundo);\n    color: var(--texto);\n}"
          }
        ]
      }
    },
    "fluxoEntrega": {
      "etapas": [
        "Digite ou complete o arquivo solicitado",
        "Execute o código atual",
        "Teste o comportamento no preview",
        "Valide o arquivo",
        "Conclua a atividade",
        "Gere a evidência",
        "Baixe o ZIP e entregue no Classroom"
      ]
    },
    "referenciaCompletaPadrao": true,
    "ordemArquivosAluno": [
      "html",
      "htmlCadastro",
      "htmlRelatorio"
    ],
    "ordemDownloads": [
      "html",
      "htmlCadastro",
      "htmlRelatorio",
      "css",
      "js",
      "readme"
    ],
    "arquivosApoio": [
      "css",
      "js",
      "readme"
    ],
    "tempoEstimado": "30–35 min",
    "nivel": "Fundamentos"
  },
  {
    "numero": 5,
    "titulo": "Exercício 05 — Protótipo HTML de Painel Administrativo",
    "nomeCurto": "Painel Administrativo",
    "tema": "Planejamento estrutural de interface com regiões funcionais de um sistema",
    "objetivo": "Combinar indicadores, formulário, tabela e navegação interna em um protótipo semântico pronto para receber CSS e programação.",
    "retomadas": [
      "estrutura semântica",
      "navegação interna",
      "formulários acessíveis",
      "tabelas e status"
    ],
    "novos": [
      "planejamento estrutural de interface",
      "organização por regiões funcionais",
      "ordem de leitura de um dashboard",
      "reutilização de componentes HTML"
    ],
    "pasta": "exercicio-05",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/",
    "githubUrl": "https://github.com/",
    "ordemArquivos": [
      "html"
    ],
    "arquivos": {
      "html": "<!DOCTYPE html>\n<html lang=\"pt-BR\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <meta name=\"description\" content=\"Protótipo semântico de painel administrativo com indicadores, formulário e registros.\">\n    <title>Painel Administrativo | Sistema DS</title>\n    <link rel=\"stylesheet\" href=\"estilo.css\">\n</head>\n<body>\n    <header class=\"topo\">\n        <div>\n            <p class=\"marca\">Sistema DS</p>\n            <h1>Painel administrativo</h1>\n        </div>\n\n        <nav aria-label=\"Navegação do painel\">\n            <ul>\n                <li><a href=\"#visao-geral\">Visão geral</a></li>\n                <li><a href=\"#indicadores\">Indicadores</a></li>\n                <li><a href=\"#novo-registro\">Novo registro</a></li>\n                <li><a href=\"#registros\">Registros</a></li>\n            </ul>\n        </nav>\n    </header>\n\n    <main>\n        <section id=\"visao-geral\" class=\"apresentacao\" aria-labelledby=\"titulo-visao-geral\">\n            <div>\n                <p class=\"etiqueta\">Central de operações</p>\n                <h2 id=\"titulo-visao-geral\">Acompanhe as rotinas do sistema</h2>\n                <p>O painel reúne informações essenciais para consultar resultados, cadastrar solicitações e acompanhar registros em uma única ordem de leitura.</p>\n            </div>\n            <a class=\"acao-principal\" href=\"#novo-registro\">Criar solicitação</a>\n        </section>\n\n        <section id=\"indicadores\" aria-labelledby=\"titulo-indicadores\">\n            <div class=\"cabecalho-secao\">\n                <p class=\"etiqueta\">Resumo do dia</p>\n                <h2 id=\"titulo-indicadores\">Indicadores principais</h2>\n            </div>\n\n            <div class=\"grade-indicadores\">\n                <article>\n                    <h3>Usuários ativos</h3>\n                    <p class=\"valor\">128</p>\n                    <p>Contas com acesso liberado.</p>\n                </article>\n\n                <article>\n                    <h3>Solicitações abertas</h3>\n                    <p class=\"valor\">17</p>\n                    <p>Registros aguardando atendimento.</p>\n                </article>\n\n                <article>\n                    <h3>Em análise</h3>\n                    <p class=\"valor\">09</p>\n                    <p>Solicitações em verificação.</p>\n                </article>\n\n                <article>\n                    <h3>Concluídas hoje</h3>\n                    <p class=\"valor\">24</p>\n                    <p>Atendimentos finalizados no dia.</p>\n                </article>\n            </div>\n        </section>\n\n        <section id=\"novo-registro\" class=\"painel-formulario\" aria-labelledby=\"titulo-formulario\">\n            <div>\n                <p class=\"etiqueta\">Entrada de dados</p>\n                <h2 id=\"titulo-formulario\">Cadastrar nova solicitação</h2>\n                <p>Os campos organizam os dados mínimos necessários para encaminhar um atendimento.</p>\n            </div>\n\n            <form id=\"form-solicitacao\">\n                <div class=\"campo\">\n                    <label for=\"solicitante\">Nome do solicitante</label>\n                    <input type=\"text\" id=\"solicitante\" name=\"solicitante\" autocomplete=\"name\" required>\n                </div>\n\n                <div class=\"campo\">\n                    <label for=\"email\">E-mail para contato</label>\n                    <input type=\"email\" id=\"email\" name=\"email\" autocomplete=\"email\" required>\n                </div>\n\n                <div class=\"campo\">\n                    <label for=\"categoria\">Categoria</label>\n                    <select id=\"categoria\" name=\"categoria\" required>\n                        <option value=\"\">Selecione</option>\n                        <option value=\"acesso\">Acesso ao sistema</option>\n                        <option value=\"cadastro\">Atualização de cadastro</option>\n                        <option value=\"suporte\">Suporte técnico</option>\n                    </select>\n                </div>\n\n                <fieldset>\n                    <legend>Prioridade</legend>\n                    <label><input type=\"radio\" name=\"prioridade\" value=\"normal\" required> Normal</label>\n                    <label><input type=\"radio\" name=\"prioridade\" value=\"urgente\"> Urgente</label>\n                </fieldset>\n\n                <div class=\"acoes-formulario\">\n                    <button type=\"submit\">Registrar solicitação</button>\n                    <button type=\"reset\">Limpar campos</button>\n                </div>\n                <p id=\"feedback-formulario\" class=\"feedback\" role=\"status\" aria-live=\"polite\"></p>\n            </form>\n        </section>\n\n        <section id=\"registros\" aria-labelledby=\"titulo-registros\">\n            <div class=\"cabecalho-secao\">\n                <p class=\"etiqueta\">Acompanhamento</p>\n                <h2 id=\"titulo-registros\">Registros recentes</h2>\n            </div>\n\n            <div class=\"table-scroll\" role=\"region\" aria-label=\"Tabela rolável de solicitações\" tabindex=\"0\">\n                <table>\n                    <caption>Solicitações registradas no painel administrativo</caption>\n                    <thead>\n                        <tr>\n                            <th scope=\"col\">Código</th>\n                            <th scope=\"col\">Solicitante</th>\n                            <th scope=\"col\">Categoria</th>\n                            <th scope=\"col\">Prioridade</th>\n                            <th scope=\"col\">Status</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr tabindex=\"0\">\n                            <td>SD-051</td>\n                            <td>Camila Rocha</td>\n                            <td>Acesso ao sistema</td>\n                            <td>Normal</td>\n                            <td><span class=\"status\">Em análise</span></td>\n                        </tr>\n                        <tr tabindex=\"0\">\n                            <td>SD-052</td>\n                            <td>Felipe Santos</td>\n                            <td>Suporte técnico</td>\n                            <td>Urgente</td>\n                            <td><span class=\"status\">Em atendimento</span></td>\n                        </tr>\n                        <tr tabindex=\"0\">\n                            <td>SD-053</td>\n                            <td>Juliana Mendes</td>\n                            <td>Atualização de cadastro</td>\n                            <td>Normal</td>\n                            <td><span class=\"status\">Concluído</span></td>\n                        </tr>\n                    </tbody>\n                </table>\n            </div>\n        </section>\n    </main>\n\n    <footer>\n        <p>3º DS — Programação no Desenvolvimento de Sistemas</p>\n        <a href=\"#visao-geral\">Voltar ao início do painel</a>\n    </footer>\n\n    <script src=\"script.js\"></script>\n</body>\n</html>",
      "css": "* {\n    box-sizing: border-box;\n}\n\n:root {\n    color-scheme: dark;\n    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif;\n    background: #08111f;\n    color: #e8eef8;\n}\n\nhtml {\n    scroll-behavior: smooth;\n}\n\nbody {\n    margin: 0;\n    background: linear-gradient(180deg, #08111f 0%, #0d1728 100%);\n    min-height: 100vh;\n}\n\na {\n    color: #8ee8ff;\n}\n\n.topo,\nmain,\nfooter {\n    width: min(1180px, calc(100% - 32px));\n    margin-inline: auto;\n}\n\n.topo {\n    display: flex;\n    align-items: end;\n    justify-content: space-between;\n    gap: 24px;\n    padding: 32px 0 24px;\n    border-bottom: 1px solid #26344a;\n}\n\n.marca,\n.etiqueta {\n    margin: 0 0 6px;\n    color: #77d9f3;\n    font-size: .8rem;\n    font-weight: 800;\n    letter-spacing: .12em;\n    text-transform: uppercase;\n}\n\nh1,\nh2,\nh3,\np {\n    margin-top: 0;\n}\n\nh1 {\n    margin-bottom: 0;\n    font-size: clamp(2rem, 5vw, 3.7rem);\n}\n\nnav ul {\n    display: flex;\n    flex-wrap: wrap;\n    gap: 10px;\n    padding: 0;\n    margin: 0;\n    list-style: none;\n}\n\nnav a,\n.acao-principal,\nbutton {\n    display: inline-flex;\n    align-items: center;\n    min-height: 44px;\n    padding: 10px 15px;\n    border: 1px solid #34445e;\n    border-radius: 12px;\n    background: #111e31;\n    color: #eef7ff;\n    text-decoration: none;\n    font: inherit;\n    font-weight: 700;\n    cursor: pointer;\n}\n\nnav a:hover,\nnav a:focus-visible,\nbutton:hover,\nbutton:focus-visible,\n.acao-principal:hover,\n.acao-principal:focus-visible {\n    border-color: #67d7f4;\n    outline: 3px solid rgba(103, 215, 244, .25);\n    outline-offset: 2px;\n}\n\nmain {\n    display: grid;\n    gap: 28px;\n    padding: 32px 0 48px;\n}\n\nsection {\n    min-width: 0;\n    padding: clamp(22px, 4vw, 38px);\n    border: 1px solid #26344a;\n    border-radius: 22px;\n    background: rgba(15, 27, 45, .88);\n    box-shadow: 0 18px 50px rgba(0, 0, 0, .18);\n}\n\n.apresentacao {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 24px;\n}\n\n.apresentacao > div {\n    max-width: 760px;\n}\n\n.acao-principal,\nbutton[type=\"submit\"] {\n    border-color: #4fd2f5;\n    background: #0f6f8c;\n}\n\n.grade-indicadores {\n    display: grid;\n    grid-template-columns: repeat(4, minmax(0, 1fr));\n    gap: 16px;\n}\n\n.grade-indicadores article {\n    padding: 20px;\n    border: 1px solid #30425e;\n    border-radius: 16px;\n    background: #0a1526;\n}\n\n.valor {\n    margin-bottom: 6px;\n    font-size: 2rem;\n    font-weight: 900;\n    color: #8ee8ff;\n}\n\n.painel-formulario {\n    display: grid;\n    grid-template-columns: minmax(240px, .8fr) minmax(300px, 1.2fr);\n    gap: 32px;\n}\n\nform {\n    display: grid;\n    gap: 16px;\n}\n\n.campo {\n    display: grid;\n    gap: 7px;\n}\n\nlabel,\nlegend {\n    font-weight: 700;\n}\n\ninput,\nselect {\n    width: 100%;\n    min-height: 46px;\n    padding: 10px 12px;\n    border: 1px solid #3b4d69;\n    border-radius: 10px;\n    background: #081322;\n    color: #fff;\n    font: inherit;\n}\n\ninput[type=\"radio\"] {\n    width: auto;\n    min-height: auto;\n}\n\nfieldset {\n    display: flex;\n    flex-wrap: wrap;\n    gap: 14px;\n    padding: 14px;\n    border: 1px solid #3b4d69;\n    border-radius: 12px;\n}\n\nfieldset label {\n    display: flex;\n    align-items: center;\n    gap: 7px;\n}\n\n.acoes-formulario {\n    display: flex;\n    flex-wrap: wrap;\n    gap: 10px;\n}\n\n.feedback {\n    min-height: 24px;\n    margin: 0;\n    color: #9ff4c5;\n    font-weight: 700;\n}\n\n.table-scroll {\n    min-width: 0;\n    max-width: 100%;\n    overflow-x: auto;\n    border: 1px solid #30425e;\n    border-radius: 14px;\n}\n\ntable {\n    width: 100%;\n    min-width: 760px;\n    border-collapse: collapse;\n}\n\ncaption {\n    padding: 15px;\n    text-align: left;\n    font-weight: 800;\n}\n\nth,\ntd {\n    padding: 14px;\n    border-top: 1px solid #26344a;\n    text-align: left;\n}\n\nth {\n    color: #9fe9fb;\n}\n\ntbody tr:focus,\ntbody tr.selecionado {\n    outline: 3px solid #67d7f4;\n    outline-offset: -3px;\n    background: #122942;\n}\n\n.status {\n    white-space: nowrap;\n    font-weight: 800;\n}\n\nfooter {\n    display: flex;\n    justify-content: space-between;\n    gap: 16px;\n    padding: 24px 0 36px;\n    border-top: 1px solid #26344a;\n}\n\n@media (max-width: 860px) {\n    .topo,\n    .apresentacao,\n    footer {\n        align-items: flex-start;\n        flex-direction: column;\n    }\n\n    .grade-indicadores {\n        grid-template-columns: repeat(2, minmax(0, 1fr));\n    }\n\n    .painel-formulario {\n        grid-template-columns: 1fr;\n    }\n}\n\n@media (max-width: 520px) {\n    .grade-indicadores {\n        grid-template-columns: 1fr;\n    }\n\n    nav ul,\n    nav li,\n    nav a,\n    .acao-principal {\n        width: 100%;\n    }\n}\n",
      "js": "const formulario = document.querySelector('#form-solicitacao');\nconst feedback = document.querySelector('#feedback-formulario');\nconst linhas = document.querySelectorAll('tbody tr');\n\nformulario?.addEventListener('submit', (event) => {\n    event.preventDefault();\n    const nome = document.querySelector('#solicitante')?.value.trim();\n    feedback.textContent = nome\n        ? `Protótipo validado: solicitação de ${nome} pronta para ser programada.`\n        : 'Protótipo validado e pronto para receber programação.';\n});\n\nformulario?.addEventListener('reset', () => {\n    feedback.textContent = 'Campos limpos.';\n});\n\nlinhas.forEach((linha) => {\n    linha.addEventListener('click', () => {\n        linhas.forEach((item) => item.classList.remove('selecionado'));\n        linha.classList.add('selecionado');\n    });\n});\n"
    },
    "nomesArquivos": {
      "html": "index.html",
      "css": "estilo.css",
      "js": "script.js"
    },
    "passos": {
      "html": [
        {
          "titulo": "Documento e identidade do painel",
          "linhas": [
            1,
            10
          ],
          "explicacao": "O início identifica o documento, conecta os arquivos de apoio e apresenta o cabeçalho principal do sistema."
        },
        {
          "titulo": "Navegação entre regiões",
          "linhas": [
            11,
            25
          ],
          "explicacao": "O menu usa links internos para levar o usuário diretamente às regiões de visão geral, indicadores, formulário e registros."
        },
        {
          "titulo": "Visão geral e ação principal",
          "linhas": [
            27,
            35
          ],
          "explicacao": "A primeira seção contextualiza o painel e oferece uma ação clara para chegar ao formulário sem quebrar a ordem de leitura."
        },
        {
          "titulo": "Indicadores organizados em artigos",
          "linhas": [
            37,
            68
          ],
          "explicacao": "Cada indicador é um article com título, valor e explicação. Assim, cada card continua compreensível mesmo antes do CSS."
        },
        {
          "titulo": "Formulário acessível",
          "linhas": [
            70,
            110
          ],
          "explicacao": "Labels, ids, names, required, autocomplete, select, fieldset e legend estruturam uma entrada de dados coerente."
        },
        {
          "titulo": "Tabela de acompanhamento",
          "linhas": [
            112,
            155
          ],
          "explicacao": "A tabela reúne caption, cabeçalhos com scope e registros com status textual, preservando relações entre linhas e colunas."
        },
        {
          "titulo": "Encerramento do protótipo",
          "linhas": [
            156,
            165
          ],
          "explicacao": "O rodapé permite voltar ao início e o script de apoio demonstra como a estrutura poderá receber comportamento nos próximos blocos."
        }
      ]
    },
    "roteiro": [
      "Apresentar o painel como uma combinação de regiões já estudadas, e não como um conjunto de divs sem função.",
      "Planejar no papel a ordem: cabeçalho, navegação, visão geral, indicadores, formulário, tabela e rodapé.",
      "Construir os links internos e confirmar que cada href aponta para um id existente.",
      "Representar cada indicador com article, h3, valor e explicação.",
      "Retomar as regras de acessibilidade do formulário e da tabela.",
      "Testar a página sem CSS para verificar se a ordem de leitura continua coerente.",
      "Abrir o preview, testar formulário, foco, rolagem da tabela e validar o index.html.",
      "Enviar a pasta exercicio-05 ao repositório atividades-praticas e anexar o link no Classroom."
    ],
    "classroom": {
      "titulo": "Exercício 05 — Protótipo HTML de Painel Administrativo",
      "descricao": "Objetivo: combinar navegação, indicadores, formulário e tabela em um painel administrativo semântico.\n\nOrientações:\nCrie a pasta `exercicio-05` no repositório `atividades-praticas`.\nDigite o arquivo `index.html` apresentado na plataforma.\nOrganize a página em cabeçalho, navegação, conteúdo principal e rodapé.\nCrie links internos para visão geral, indicadores, novo registro e registros.\nInclua pelo menos quatro indicadores usando `article`.\nAdicione um formulário acessível com rótulos associados, campos obrigatórios, `name`, `autocomplete`, `fieldset` e `legend`.\nCrie uma tabela com `caption`, `thead`, `tbody`, `th scope=\"col\"` e pelo menos três registros.\nEscreva os status em texto visível.\nTeste a ordem de leitura, o teclado e a visualização em celular.\nValide o HTML antes da entrega.\n\nEntrega: anexe no Google Classroom o link do repositório com a pasta `exercicio-05`.\n\nPortal da Atividade: plataforma do 3º DS — Programação no Desenvolvimento de Sistemas."
    },
    "professor": {
      "testes": [
        "Desativar o CSS e confirmar que a ordem de leitura do painel continua coerente.",
        "Usar todos os links do menu e confirmar que apontam para IDs existentes.",
        "Contar pelo menos quatro indicadores estruturados como article com h3 e descrição.",
        "Percorrer todos os campos do formulário usando somente Tab e Shift+Tab.",
        "Confirmar labels associados, fieldset com legend, required, name e autocomplete.",
        "Conferir caption, cinco cabeçalhos com scope=\"col\" e três linhas completas na tabela.",
        "Alterar textos, números e registros sem mudar a estrutura e confirmar que a validação aceita a solução equivalente.",
        "Remover um indicador, um label, caption ou link interno e conferir o diagnóstico específico."
      ],
      "erros": [
        "Criar o painel inteiro apenas com divs, sem regiões semânticas.",
        "Usar links internos para IDs que não existem.",
        "Apresentar números soltos sem título e contexto em cada indicador.",
        "Misturar o formulário dentro da tabela.",
        "Usar placeholder como substituto de label.",
        "Usar cor como única informação do status.",
        "Alterar a ordem visual com CSS sem preservar uma ordem lógica no HTML."
      ],
      "notas": [
        "O foco avaliado é a arquitetura HTML. O CSS e o JavaScript são fornecidos como apoio e serão aprofundados nos próximos exercícios.",
        "A validação aceita textos, valores, nomes, categorias e registros diferentes, desde que todas as regiões funcionais permaneçam presentes e acessíveis.",
        "Este exercício funciona como integração formativa dos Exercícios 01 a 04.",
        "Use a página sem CSS para demonstrar que semântica e ordem de leitura não dependem da aparência."
      ],
      "python": "# Continuidade da trilha\n# As regiões do painel serão alimentadas por\n# listas, dicionários, objetos e APIs em Python."
    },
    "permitirBase": {
      "html": false
    },
    "validacao": {
      "tipo": "html-semantico",
      "htmlSemantico": {
        "doctype": true,
        "idioma": true,
        "charset": true,
        "viewport": true,
        "tagsMinimas": {
          "header": 1,
          "nav": 1,
          "main": 1,
          "footer": 1,
          "section": 4,
          "article": 4,
          "h1": 1,
          "h2": 4,
          "h3": 4,
          "a": 6,
          "form": 1,
          "label": 5,
          "input": 4,
          "select": 1,
          "fieldset": 1,
          "legend": 1,
          "button": 2,
          "table": 1,
          "caption": 1,
          "thead": 1,
          "tbody": 1,
          "tr": 4,
          "th": 5,
          "td": 15
        },
        "tagsExatas": {
          "main": 1,
          "h1": 1,
          "table": 1,
          "form": 1
        },
        "relacoes": [
          {
            "pai": "section",
            "filho": "article",
            "minimo": 4,
            "descricao": "organize pelo menos quatro indicadores como artigos dentro de uma seção"
          },
          {
            "pai": "form",
            "filho": "label",
            "minimo": 5,
            "descricao": "mantenha os rótulos dos campos dentro do formulário"
          },
          {
            "pai": "table",
            "filho": "caption",
            "minimo": 1,
            "descricao": "inclua uma legenda caption dentro da tabela"
          },
          {
            "pai": "thead",
            "filho": "th",
            "minimo": 5,
            "descricao": "use cabeçalhos th no thead"
          },
          {
            "pai": "tbody",
            "filho": "tr",
            "minimo": 3,
            "descricao": "inclua pelo menos três registros no tbody"
          }
        ],
        "linksInternos": 4,
        "artigoComTitulo": true,
        "hierarquiaTitulos": true,
        "idsUnicos": true,
        "formularioAcessivel": {
          "controlesMinimos": 5,
          "labelsAssociados": true,
          "tiposInputMinimos": {
            "text": 1,
            "email": 1,
            "radio": 2
          },
          "selectsMinimos": 1,
          "camposObrigatoriosMinimos": 4,
          "autocompletesMinimos": 2,
          "fieldsetsComLegend": 1,
          "botaoSubmit": true,
          "nomesObrigatorios": true,
          "tabindexPositivoProibido": true
        },
        "tabelaAcessivel": {
          "tabelasMinimas": 1,
          "captionObrigatorio": true,
          "cabecalhosMinimos": 5,
          "scopeColMinimo": 5,
          "linhasCorpoMinimas": 3,
          "celulasPorLinhaMinimas": 5,
          "colunaStatus": true,
          "statusTextual": true,
          "padroesCabecalhoStatus": [
            "status",
            "situação",
            "situacao",
            "estado"
          ]
        }
      }
    },
    "fasePedagogica": 5,
    "apoioAutomatico": {
      "enabled": false,
      "initialAccess": false,
      "minActiveSeconds": 180,
      "minAttempts": 2,
      "minKeystrokes": 40,
      "minExecutions": 1,
      "minHints": 1,
      "requiredSignals": 3,
      "blocks": {}
    },
    "ordemDownloads": [
      "html",
      "css",
      "js"
    ],
    "fluxoEntrega": {
      "etapas": [
        "Digite ou complete o arquivo solicitado",
        "Execute o código atual",
        "Teste o comportamento no preview",
        "Valide o arquivo",
        "Conclua a atividade",
        "Gere a evidência",
        "Baixe o ZIP e entregue no Classroom"
      ]
    },
    "referenciaCompletaPadrao": true,
    "arquivosApoio": [
      "css",
      "js"
    ],
    "tempoEstimado": "35–40 min",
    "nivel": "Fundamentos"
  },
  {
    "numero": 6,
    "titulo": "Exercício 06 — Cards e Box Model em um Painel",
    "nomeCurto": "Cards e Box Model",
    "tema": "CSS aplicado a cards de indicadores e dimensões previsíveis",
    "objetivo": "Aplicar box-sizing, margin, padding, border e gap para organizar cards responsivos sem transbordamento.",
    "retomadas": [
      "ligação do CSS",
      "seletores e classes",
      "estrutura semântica com article"
    ],
    "novos": [
      "Box Model",
      "box-sizing",
      "margin e padding",
      "border e border-radius",
      "gap",
      "proteção contra transbordamento"
    ],
    "pasta": "exercicio-06",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/",
    "githubUrl": "https://github.com/",
    "ordemArquivos": [
      "css"
    ],
    "ordemArquivosAluno": [
      "css"
    ],
    "ordemArquivosProfessor": [
      "html",
      "css",
      "js"
    ],
    "ordemDownloads": [
      "html",
      "css",
      "js"
    ],
    "arquivos": {
      "html": "<!DOCTYPE html>\n<html lang=\"pt-BR\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <meta name=\"description\" content=\"Painel de indicadores para praticar cards e o Box Model do CSS.\">\n    <title>Indicadores do Sistema | Cards e Box Model</title>\n    <link rel=\"stylesheet\" href=\"estilo.css\">\n</head>\n<body>\n    <header class=\"topo\">\n        <div>\n            <p class=\"etiqueta\">Sistema DS</p>\n            <h1>Indicadores de atendimento</h1>\n            <p class=\"subtitulo\">Compare conteúdo, preenchimento, borda, margem e espaçamento entre os cards.</p>\n        </div>\n        <button id=\"alternar-densidade\" type=\"button\" aria-pressed=\"false\">Ativar modo compacto</button>\n    </header>\n\n    <main class=\"painel\">\n        <section class=\"introducao\" aria-labelledby=\"titulo-introducao\">\n            <div>\n                <p class=\"etiqueta\">Exercício 06</p>\n                <h2 id=\"titulo-introducao\">Como o Box Model organiza uma interface?</h2>\n            </div>\n            <p>Cada card possui uma área de conteúdo, padding interno, border e espaço externo criado pelo layout.</p>\n        </section>\n\n        <section class=\"grade-cards\" aria-label=\"Indicadores principais do sistema\">\n            <article class=\"card-indicador\" tabindex=\"0\">\n                <span class=\"icone\" aria-hidden=\"true\">US</span>\n                <p class=\"rotulo\">Usuários ativos</p>\n                <strong class=\"valor\">128</strong>\n                <p class=\"descricao\">Contas com acesso liberado ao sistema.</p>\n            </article>\n\n            <article class=\"card-indicador\" tabindex=\"0\">\n                <span class=\"icone\" aria-hidden=\"true\">CH</span>\n                <p class=\"rotulo\">Chamados abertos</p>\n                <strong class=\"valor\">17</strong>\n                <p class=\"descricao\">Solicitações que ainda precisam de atendimento.</p>\n            </article>\n\n            <article class=\"card-indicador\" tabindex=\"0\">\n                <span class=\"icone\" aria-hidden=\"true\">AN</span>\n                <p class=\"rotulo\">Em análise</p>\n                <strong class=\"valor\">09</strong>\n                <p class=\"descricao\">Registros que estão sendo verificados pela equipe.</p>\n            </article>\n\n            <article class=\"card-indicador\" tabindex=\"0\">\n                <span class=\"icone\" aria-hidden=\"true\">OK</span>\n                <p class=\"rotulo\">Concluídos hoje</p>\n                <strong class=\"valor\">24</strong>\n                <p class=\"descricao\">Atendimentos finalizados durante o dia.</p>\n            </article>\n        </section>\n\n        <section class=\"demonstracao-box\" aria-labelledby=\"titulo-box-model\">\n            <div>\n                <p class=\"etiqueta\">Leitura visual</p>\n                <h2 id=\"titulo-box-model\">Camadas do Box Model</h2>\n                <p>Observe como o espaço total de um componente é formado por quatro partes.</p>\n            </div>\n\n            <div class=\"box-model\" aria-label=\"Representação das camadas do Box Model\">\n                <div class=\"camada margem\">\n                    <span>margin</span>\n                    <div class=\"camada borda\">\n                        <span>border</span>\n                        <div class=\"camada preenchimento\">\n                            <span>padding</span>\n                            <div class=\"camada conteudo\">content</div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </section>\n    </main>\n\n    <footer>\n        <p>3º DS — Programação no Desenvolvimento de Sistemas</p>\n        <p id=\"mensagem-selecao\" role=\"status\" aria-live=\"polite\">Selecione um card para destacar um indicador.</p>\n    </footer>\n\n    <script src=\"script.js\"></script>\n</body>\n</html>",
      "css": "/* 1. O box-sizing torna largura e altura mais previsíveis. */\n*,\n*::before,\n*::after {\n    box-sizing: border-box;\n}\n\n:root {\n    --fundo: #07111f;\n    --superficie: #101d2f;\n    --superficie-clara: #17263a;\n    --borda: #2d4059;\n    --texto: #eef6ff;\n    --texto-suave: #a9bad0;\n    --destaque: #5eead4;\n    --destaque-forte: #2dd4bf;\n    --raio: 18px;\n}\n\nbody {\n    margin: 0;\n    min-width: 0;\n    min-height: 100vh;\n    background: linear-gradient(145deg, var(--fundo), #0d1b2d);\n    color: var(--texto);\n    font-family: Arial, Helvetica, sans-serif;\n    line-height: 1.5;\n}\n\nbutton,\narticle {\n    font: inherit;\n}\n\n.topo,\n.painel,\nfooter {\n    width: min(100% - 2rem, 1120px);\n    margin-inline: auto;\n}\n\n.topo {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    gap: 1.5rem;\n    padding-block: 2rem 1.25rem;\n}\n\nh1,\nh2,\np {\n    margin-top: 0;\n}\n\nh1 {\n    margin-bottom: 0.35rem;\n    font-size: clamp(1.9rem, 5vw, 3.4rem);\n    line-height: 1.05;\n}\n\n.subtitulo,\n.descricao,\n.introducao > p,\n.demonstracao-box > div > p,\nfooter {\n    color: var(--texto-suave);\n}\n\n.etiqueta {\n    margin-bottom: 0.35rem;\n    color: var(--destaque);\n    font-size: 0.78rem;\n    font-weight: 800;\n    letter-spacing: 0.13em;\n    text-transform: uppercase;\n}\n\nbutton {\n    flex: 0 0 auto;\n    padding: 0.75rem 1rem;\n    border: 1px solid var(--destaque);\n    border-radius: 999px;\n    background: transparent;\n    color: var(--texto);\n    cursor: pointer;\n}\n\nbutton:hover,\nbutton:focus-visible {\n    background: var(--destaque);\n    color: #06231e;\n    outline: 3px solid rgba(94, 234, 212, 0.24);\n    outline-offset: 3px;\n}\n\n.painel {\n    padding-block: 1rem 3rem;\n}\n\n.introducao,\n.demonstracao-box {\n    display: grid;\n    grid-template-columns: minmax(0, 1fr) minmax(240px, 0.7fr);\n    gap: 2rem;\n    align-items: end;\n    margin-bottom: 1.5rem;\n}\n\n/* 2. O gap cria espaço entre os cards sem somar margens individuais. */\n.grade-cards {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));\n    gap: 1rem;\n    margin-bottom: 2rem;\n}\n\n/* 3. Cada card demonstra padding, border e conteúdo interno. */\n.card-indicador {\n    min-width: 0;\n    padding: 1.25rem;\n    border: 1px solid var(--borda);\n    border-radius: var(--raio);\n    background: linear-gradient(160deg, var(--superficie-clara), var(--superficie));\n    box-shadow: 0 16px 38px rgba(0, 0, 0, 0.22);\n    overflow-wrap: anywhere;\n    cursor: pointer;\n    transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease;\n}\n\n.card-indicador:hover,\n.card-indicador:focus-visible,\n.card-indicador.selecionado {\n    border-color: var(--destaque);\n    box-shadow: 0 18px 44px rgba(45, 212, 191, 0.18);\n    transform: translateY(-4px);\n    outline: none;\n}\n\n.icone {\n    display: grid;\n    place-items: center;\n    width: 2.7rem;\n    height: 2.7rem;\n    margin-bottom: 1rem;\n    border: 1px solid rgba(94, 234, 212, 0.45);\n    border-radius: 12px;\n    background: rgba(94, 234, 212, 0.1);\n    color: var(--destaque);\n    font-size: 0.78rem;\n    font-weight: 900;\n}\n\n.rotulo {\n    margin-bottom: 0.25rem;\n    color: var(--texto-suave);\n    font-weight: 700;\n}\n\n.valor {\n    display: block;\n    margin-bottom: 0.75rem;\n    font-size: clamp(2rem, 7vw, 3.25rem);\n    line-height: 1;\n}\n\n.descricao {\n    margin-bottom: 0;\n}\n\n.demonstracao-box {\n    align-items: center;\n    padding: 1.5rem;\n    border: 1px solid var(--borda);\n    border-radius: var(--raio);\n    background: rgba(16, 29, 47, 0.7);\n}\n\n.box-model {\n    min-width: 0;\n    overflow-x: auto;\n}\n\n.camada {\n    display: grid;\n    place-items: center;\n    min-width: 0;\n    border-radius: 12px;\n    text-align: center;\n}\n\n.camada > span {\n    justify-self: start;\n    margin: 0.25rem;\n    font-size: 0.72rem;\n    font-weight: 800;\n    text-transform: uppercase;\n}\n\n.margem {\n    padding: 0.55rem;\n    background: #3b2d55;\n}\n\n.borda {\n    width: 100%;\n    padding: 0.55rem;\n    background: #7c3f58;\n}\n\n.preenchimento {\n    width: 100%;\n    padding: 0.7rem;\n    background: #8a6a28;\n}\n\n.conteudo {\n    width: 100%;\n    min-height: 74px;\n    padding: 1rem;\n    background: #146b67;\n    color: white;\n    font-weight: 800;\n}\n\nfooter {\n    display: flex;\n    justify-content: space-between;\n    gap: 1rem;\n    padding-block: 1.25rem 2rem;\n    border-top: 1px solid var(--borda);\n}\n\n.compacto .grade-cards {\n    gap: 0.55rem;\n}\n\n.compacto .card-indicador {\n    padding: 0.8rem;\n}\n\n@media (max-width: 700px) {\n    .topo,\n    .introducao,\n    .demonstracao-box,\n    footer {\n        grid-template-columns: 1fr;\n        flex-direction: column;\n        align-items: stretch;\n    }\n\n    .topo,\n    footer {\n        display: flex;\n    }\n\n    button {\n        width: 100%;\n    }\n}\n",
      "js": "const botaoDensidade = document.querySelector('#alternar-densidade');\nconst cards = document.querySelectorAll('.card-indicador');\nconst mensagem = document.querySelector('#mensagem-selecao');\n\nbotaoDensidade?.addEventListener('click', () => {\n    const compacto = document.body.classList.toggle('compacto');\n    botaoDensidade.setAttribute('aria-pressed', String(compacto));\n    botaoDensidade.textContent = compacto ? 'Desativar modo compacto' : 'Ativar modo compacto';\n});\n\ncards.forEach((card) => {\n    card.addEventListener('click', () => {\n        cards.forEach((item) => item.classList.remove('selecionado'));\n        card.classList.add('selecionado');\n        const rotulo = card.querySelector('.rotulo')?.textContent || 'Indicador';\n        mensagem.textContent = `${rotulo} foi selecionado.`;\n    });\n});\n"
    },
    "nomesArquivos": {
      "html": "index.html",
      "css": "estilo.css",
      "js": "script.js"
    },
    "passos": {
      "css": [
        {
          "titulo": "Box sizing previsível",
          "linhas": [
            1,
            7
          ],
          "explicacao": "O seletor universal inclui os pseudoelementos e faz padding e border participarem das dimensões definidas."
        },
        {
          "titulo": "Variáveis e base da página",
          "linhas": [
            8,
            33
          ],
          "explicacao": "As variáveis centralizam decisões visuais; body remove a margem padrão e cria uma base que ocupa a tela sem largura mínima indevida."
        },
        {
          "titulo": "Contêiner e espaços externos",
          "linhas": [
            35,
            109
          ],
          "explicacao": "A largura do painel combina porcentagem e limite máximo. Padding, margin e gap organizam o fluxo geral."
        },
        {
          "titulo": "Grade flexível com gap",
          "linhas": [
            110,
            117
          ],
          "explicacao": "A grade usa auto-fit e minmax para distribuir os cards. O gap cria distância uniforme sem depender de margens laterais."
        },
        {
          "titulo": "Box Model de cada card",
          "linhas": [
            118,
            138
          ],
          "explicacao": "Cada card reúne min-width, padding, border, border-radius, background e overflow-wrap para manter o conteúdo dentro da caixa."
        },
        {
          "titulo": "Estados e elementos internos",
          "linhas": [
            140,
            177
          ],
          "explicacao": "Hover, foco e seleção fornecem retorno visual; os elementos internos usam margin e dimensões próprias."
        },
        {
          "titulo": "Representação e modo compacto",
          "linhas": [
            179,
            241
          ],
          "explicacao": "A demonstração mostra as camadas do Box Model e o modo compacto altera gap e padding sem reescrever o HTML."
        },
        {
          "titulo": "Adaptação para telas menores",
          "linhas": [
            242,
            260
          ],
          "explicacao": "A media query reorganiza cabeçalho, seções e rodapé em uma coluna e mantém o botão dentro da largura disponível."
        }
      ]
    },
    "roteiro": [
      "Reabrir o painel do Exercício 05 e perguntar quais espaços pertencem ao conteúdo, ao componente e ao layout.",
      "Apresentar content, padding, border e margin usando a representação visual da página.",
      "Explicar por que box-sizing: border-box evita somas inesperadas de largura.",
      "Construir a grade dos quatro cards usando grid e gap.",
      "Aplicar padding, border, border-radius e proteção contra textos longos.",
      "Testar hover, foco, seleção e o botão de modo compacto.",
      "Redimensionar o navegador e verificar se não existe rolagem horizontal global.",
      "Baixar os três arquivos e entregar a pasta exercicio-06 no repositório atividades-praticas."
    ],
    "classroom": {
      "titulo": "Exercício 06 — Cards e Box Model em um Painel",
      "descricao": "Objetivo: aplicar Box Model e espaçamentos em quatro cards de indicadores.\n\nOrientações:\nCrie a pasta `exercicio-06` no repositório `atividades-praticas`.\nBaixe ou copie o `index.html` e o `script.js` de apoio.\nDigite o arquivo `estilo.css` apresentado na plataforma.\nConfigure `box-sizing: border-box` para todos os elementos e pseudoelementos.\nOrganize os cards com Grid ou Flexbox e use `gap` para o espaço entre eles.\nNos cards, aplique padding, border, border-radius, background e uma proteção contra transbordamento de texto.\nUse largura responsiva e uma media query para telas menores.\nTeste o botão de modo compacto, a seleção dos cards, o teclado e diferentes larguras de tela.\nA página não deve apresentar rolagem horizontal global.\n\nEntrega: anexe no Google Classroom o link do repositório com a pasta `exercicio-06`.\n\nPortal da Atividade: plataforma do 3º DS — Programação no Desenvolvimento de Sistemas."
    },
    "professor": {
      "testes": [
        "Remover box-sizing e demonstrar como padding e border aumentam as dimensões totais.",
        "Trocar gap por margens em cada card e comparar a manutenção do layout.",
        "Aumentar o texto de um indicador e confirmar que o card não amplia a página.",
        "Testar as larguras 1280 px, 768 px e 390 px.",
        "Usar Tab para alcançar botão e cards e conferir o foco visível.",
        "Ativar o modo compacto e conferir a mudança de gap e padding.",
        "Alterar cores, unidades e valores mantendo os conceitos e confirmar que a validação flexível aceita.",
        "Remover border, padding, gap ou media query e conferir o diagnóstico conceitual."
      ],
      "erros": [
        "Definir largura fixa nos cards somando padding e border sem box-sizing.",
        "Usar margens laterais diferentes em cada card no lugar de gap.",
        "Permitir que palavras longas aumentem a largura do grid.",
        "Aplicar padding somente no texto, deixando a área clicável pequena.",
        "Usar outline: none sem fornecer outro foco visível.",
        "Criar media query, mas manter largura fixa maior que a tela."
      ],
      "notas": [
        "O HTML e o JavaScript são arquivos de apoio; a produção avaliada é o estilo.css.",
        "A validação é conceitual: cores, valores, unidades e ordem das propriedades podem variar.",
        "Os nomes de classes já presentes no HTML devem ser reutilizados para que o CSS alcance os componentes.",
        "Este exercício inicia o bloco de CSS aplicado a interfaces."
      ],
      "python": "# Comparação futura\n# Em interfaces Python, componentes também precisam\n# de dimensões, espaçamentos e estados previsíveis."
    },
    "permitirBase": {
      "css": false
    },
    "validacao": {
      "tipo": "css-semantico",
      "cssSemantico": {
        "boxSizingBorderBox": true,
        "layout": {
          "seletores": [
            ".grade-cards",
            ".cards",
            ".indicadores"
          ],
          "displays": [
            "grid",
            "flex"
          ],
          "exigirGap": true,
          "exigirColunasFlexiveis": true
        },
        "card": {
          "seletores": [
            ".card-indicador",
            ".card",
            "article"
          ],
          "gruposPropriedades": [
            [
              "padding",
              "padding-block",
              "padding-inline"
            ],
            [
              "border",
              "border-width",
              "border-style"
            ],
            [
              "border-radius"
            ],
            [
              "background",
              "background-color"
            ]
          ],
          "exigirProtecaoConteudo": true
        },
        "espacamentosMinimos": 3,
        "larguraResponsiva": true,
        "mediaQueriesMinimas": 1,
        "estadosInteracao": true
      }
    },
    "fasePedagogica": 6,
    "apoioAutomatico": {
      "enabled": true,
      "initialAccess": false,
      "minActiveSeconds": 180,
      "minAttempts": 2,
      "minKeystrokes": 40,
      "minExecutions": 1,
      "minHints": 1,
      "requiredSignals": 3,
      "blocks": {
        "css": [
          {
            "id": "variaveis-e-tipografia-base",
            "title": "Completar variáveis e tipografia-base",
            "description": "Insere somente variáveis visuais e tipografia. O Box Model dos cards, espaçamentos, bordas, layout e responsividade continuam sendo responsabilidade do aluno.",
            "reason": "tentativa prolongada",
            "mode": "append",
            "content": ":root {\n    --fundo: #07111f;\n    --superficie: #101d2f;\n    --texto: #eef6ff;\n    --texto-suave: #a9bad0;\n    --destaque: #5eead4;\n}\n\nbody {\n    margin: 0;\n    min-height: 100vh;\n    background: var(--fundo);\n    color: var(--texto);\n    font-family: Arial, Helvetica, sans-serif;\n    line-height: 1.5;\n}"
          }
        ]
      }
    },
    "fluxoEntrega": {
      "etapas": [
        "Digite ou complete o arquivo solicitado",
        "Execute o código atual",
        "Teste o comportamento no preview",
        "Valide o arquivo",
        "Conclua a atividade",
        "Gere a evidência",
        "Baixe o ZIP e entregue no Classroom"
      ]
    },
    "referenciaCompletaPadrao": true,
    "arquivosApoio": [
      "html",
      "js"
    ],
    "tempoEstimado": "30–35 min",
    "nivel": "CSS aplicado"
  },
  {
    "numero": 7,
    "titulo": "Exercício 07 — Barra de Ferramentas com Flexbox",
    "nomeCurto": "Barra com Flexbox",
    "tema": "CSS aplicado à distribuição de ferramentas e ações de um sistema",
    "objetivo": "Distribuir marca, navegação, pesquisa, filtros e ação principal usando Flexbox com quebra controlada.",
    "retomadas": [
      "classes e seletores",
      "Box Model",
      "gap e responsividade"
    ],
    "novos": [
      "display: flex",
      "justify-content",
      "align-items",
      "flex-wrap",
      "flex-grow e flex-basis",
      "área de toque"
    ],
    "pasta": "exercicio-07",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/",
    "githubUrl": "https://github.com/",
    "ordemArquivos": [
      "css"
    ],
    "ordemArquivosAluno": [
      "css"
    ],
    "ordemArquivosProfessor": [
      "html",
      "css",
      "js"
    ],
    "ordemDownloads": [
      "html",
      "css",
      "js"
    ],
    "arquivos": {
      "html": "<!DOCTYPE html>\n<html lang=\"pt-BR\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <meta name=\"description\" content=\"Painel de módulos com barra de ferramentas responsiva construída com Flexbox.\">\n    <title>Central de Módulos | Barra de Ferramentas</title>\n    <link rel=\"stylesheet\" href=\"estilo.css\">\n</head>\n<body>\n    <header class=\"cabecalho-principal\">\n        <a class=\"marca\" href=\"#conteudo-principal\" aria-label=\"Sistema DS — ir para o conteúdo principal\">\n            <span class=\"marca-simbolo\" aria-hidden=\"true\">DS</span>\n            <span>\n                <strong>Sistema DS</strong>\n                <small>Central de módulos</small>\n            </span>\n        </a>\n\n        <nav class=\"navegacao\" aria-label=\"Navegação principal\">\n            <ul>\n                <li><a class=\"ativo\" href=\"#modulos\" aria-current=\"page\">Módulos</a></li>\n                <li><a href=\"#atividade\">Atividade</a></li>\n                <li><a href=\"#ajuda\">Ajuda</a></li>\n            </ul>\n        </nav>\n\n        <button class=\"botao-perfil\" type=\"button\" aria-label=\"Abrir opções do perfil de estudante\">\n            <span aria-hidden=\"true\">GA</span>\n            <span>Gabriel</span>\n        </button>\n    </header>\n\n    <main id=\"conteudo-principal\">\n        <section class=\"apresentacao\" aria-labelledby=\"titulo-pagina\">\n            <div>\n                <p class=\"etiqueta\">Exercício 07</p>\n                <h1 id=\"titulo-pagina\">Barra de ferramentas com Flexbox</h1>\n                <p>Organize pesquisa, filtros e ações sem posicionamento absoluto e com quebra controlada em telas menores.</p>\n            </div>\n            <div class=\"resumo\" aria-label=\"Resumo dos módulos\">\n                <strong id=\"total-visivel\">6</strong>\n                <span>módulos visíveis</span>\n            </div>\n        </section>\n\n        <section class=\"barra-ferramentas\" aria-labelledby=\"titulo-ferramentas\">\n            <div class=\"titulo-ferramentas\">\n                <p class=\"etiqueta\">Ferramentas</p>\n                <h2 id=\"titulo-ferramentas\">Localizar e organizar módulos</h2>\n            </div>\n\n            <form class=\"grupo-busca\" role=\"search\">\n                <label class=\"sr-only\" for=\"busca\">Pesquisar módulos</label>\n                <input id=\"busca\" name=\"busca\" type=\"search\" placeholder=\"Pesquisar por nome ou tecnologia\">\n                <button type=\"submit\">Pesquisar</button>\n            </form>\n\n            <div class=\"grupo-acoes\" aria-label=\"Filtros e ação principal\">\n                <button class=\"botao-filtro ativo\" type=\"button\" data-filtro=\"todos\" aria-pressed=\"true\">Todos</button>\n                <button class=\"botao-filtro\" type=\"button\" data-filtro=\"ativos\" aria-pressed=\"false\">Ativos</button>\n                <button class=\"botao-filtro\" type=\"button\" data-filtro=\"planejados\" aria-pressed=\"false\">Planejados</button>\n                <button class=\"botao-principal\" type=\"button\" id=\"novo-modulo\">Novo módulo</button>\n            </div>\n        </section>\n\n        <section id=\"modulos\" aria-labelledby=\"titulo-modulos\">\n            <div class=\"cabecalho-secao\">\n                <div>\n                    <p class=\"etiqueta\">Catálogo</p>\n                    <h2 id=\"titulo-modulos\">Módulos do sistema</h2>\n                </div>\n                <p id=\"mensagem-filtro\" role=\"status\" aria-live=\"polite\">Mostrando todos os módulos.</p>\n            </div>\n\n            <div class=\"grade-modulos\">\n                <article class=\"card-modulo\" data-status=\"ativos\" data-termos=\"usuarios cadastro html css\">\n                    <span class=\"status ativo-status\">Ativo</span>\n                    <h3>Cadastro de usuários</h3>\n                    <p>Formulários e dados básicos dos usuários do sistema.</p>\n                    <a href=\"#atividade\">Abrir módulo</a>\n                </article>\n\n                <article class=\"card-modulo\" data-status=\"ativos\" data-termos=\"chamados suporte atendimento\">\n                    <span class=\"status ativo-status\">Ativo</span>\n                    <h3>Central de chamados</h3>\n                    <p>Acompanhamento das solicitações e prioridades da equipe.</p>\n                    <a href=\"#atividade\">Abrir módulo</a>\n                </article>\n\n                <article class=\"card-modulo\" data-status=\"ativos\" data-termos=\"relatorios tabela dados\">\n                    <span class=\"status ativo-status\">Ativo</span>\n                    <h3>Relatórios</h3>\n                    <p>Consulta de registros, indicadores e resultados recentes.</p>\n                    <a href=\"#atividade\">Abrir módulo</a>\n                </article>\n\n                <article class=\"card-modulo\" data-status=\"planejados\" data-termos=\"estoque produtos javascript\">\n                    <span class=\"status planejado-status\">Planejado</span>\n                    <h3>Controle de estoque</h3>\n                    <p>Entrada, saída e quantidade disponível de produtos.</p>\n                    <a href=\"#atividade\">Ver planejamento</a>\n                </article>\n\n                <article class=\"card-modulo\" data-status=\"planejados\" data-termos=\"financeiro orçamento python\">\n                    <span class=\"status planejado-status\">Planejado</span>\n                    <h3>Orçamentos</h3>\n                    <p>Cálculos, categorias e acompanhamento de propostas.</p>\n                    <a href=\"#atividade\">Ver planejamento</a>\n                </article>\n\n                <article class=\"card-modulo\" data-status=\"planejados\" data-termos=\"api integracao flask\">\n                    <span class=\"status planejado-status\">Planejado</span>\n                    <h3>Integrações</h3>\n                    <p>Comunicação com serviços externos e APIs do sistema.</p>\n                    <a href=\"#atividade\">Ver planejamento</a>\n                </article>\n            </div>\n        </section>\n\n        <section id=\"atividade\" class=\"orientacao\" aria-labelledby=\"titulo-atividade\">\n            <div>\n                <p class=\"etiqueta\">Desafio de layout</p>\n                <h2 id=\"titulo-atividade\">Teste a barra em diferentes larguras</h2>\n            </div>\n            <p>Confirme que pesquisa, filtros e botão principal permanecem acessíveis, quebram de linha de forma organizada e não criam rolagem horizontal global.</p>\n        </section>\n    </main>\n\n    <footer id=\"ajuda\">\n        <p>3º DS — Programação no Desenvolvimento de Sistemas</p>\n        <a href=\"#conteudo-principal\">Voltar ao início</a>\n    </footer>\n\n    <script src=\"script.js\"></script>\n</body>\n</html>\n",
      "css": "/* 1. Base previsível para todas as caixas. */\n*,\n*::before,\n*::after {\n    box-sizing: border-box;\n}\n\n:root {\n    --fundo: #07111f;\n    --superficie: #101d2f;\n    --superficie-clara: #17263a;\n    --borda: #2b4059;\n    --texto: #eef6ff;\n    --texto-suave: #a9bad0;\n    --destaque: #60a5fa;\n    --destaque-forte: #2563eb;\n    --sucesso: #5eead4;\n    --raio: 16px;\n}\n\nhtml {\n    scroll-behavior: smooth;\n}\n\nbody {\n    margin: 0;\n    min-width: 0;\n    min-height: 100vh;\n    background: linear-gradient(145deg, var(--fundo), #0d1b2d);\n    color: var(--texto);\n    font-family: Arial, Helvetica, sans-serif;\n    line-height: 1.5;\n}\n\nbutton,\ninput {\n    font: inherit;\n}\n\na {\n    color: inherit;\n}\n\n.cabecalho-principal,\nmain,\nfooter {\n    width: min(100% - 2rem, 1180px);\n    margin-inline: auto;\n}\n\n/* 2. O cabeçalho distribui marca, navegação e perfil. */\n.cabecalho-principal {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    flex-wrap: wrap;\n    gap: 1rem;\n    padding-block: 1.25rem;\n    border-bottom: 1px solid var(--borda);\n}\n\n.marca,\n.botao-perfil,\n.navegacao ul {\n    display: flex;\n    align-items: center;\n}\n\n.marca {\n    gap: 0.75rem;\n    text-decoration: none;\n}\n\n.marca-simbolo {\n    display: grid;\n    place-items: center;\n    width: 2.75rem;\n    min-height: 2.75rem;\n    border-radius: 12px;\n    background: var(--destaque);\n    color: #061326;\n    font-weight: 900;\n}\n\n.marca strong,\n.marca small {\n    display: block;\n}\n\n.marca small {\n    color: var(--texto-suave);\n}\n\n.navegacao ul {\n    flex-wrap: wrap;\n    gap: 0.35rem;\n    margin: 0;\n    padding: 0;\n    list-style: none;\n}\n\n.navegacao a {\n    display: block;\n    min-height: 44px;\n    padding: 0.7rem 0.9rem;\n    border-radius: 999px;\n    color: var(--texto-suave);\n    text-decoration: none;\n}\n\n.navegacao a:hover,\n.navegacao a:focus-visible,\n.navegacao a.ativo {\n    background: var(--superficie-clara);\n    color: var(--texto);\n}\n\n.botao-perfil {\n    gap: 0.55rem;\n    min-height: 44px;\n    padding: 0.55rem 0.8rem;\n    border: 1px solid var(--borda);\n    border-radius: 999px;\n    background: var(--superficie);\n    color: var(--texto);\n    cursor: pointer;\n}\n\n.botao-perfil span:first-child {\n    display: grid;\n    place-items: center;\n    width: 2rem;\n    height: 2rem;\n    border-radius: 50%;\n    background: var(--sucesso);\n    color: #06231e;\n    font-size: 0.75rem;\n    font-weight: 900;\n}\n\nmain {\n    padding-block: 2rem 3rem;\n}\n\n.apresentacao,\n.cabecalho-secao,\n.orientacao {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    flex-wrap: wrap;\n    gap: 1rem;\n}\n\n.apresentacao {\n    margin-bottom: 1.5rem;\n}\n\nh1,\nh2,\nh3,\np {\n    margin-top: 0;\n}\n\nh1 {\n    max-width: 760px;\n    margin-bottom: 0.6rem;\n    font-size: clamp(2rem, 6vw, 4rem);\n    line-height: 1.05;\n}\n\n.apresentacao > div:first-child > p:last-child,\n.card-modulo p,\n.orientacao > p,\nfooter,\n#mensagem-filtro {\n    color: var(--texto-suave);\n}\n\n.etiqueta {\n    margin-bottom: 0.3rem;\n    color: var(--sucesso);\n    font-size: 0.78rem;\n    font-weight: 900;\n    letter-spacing: 0.13em;\n    text-transform: uppercase;\n}\n\n.resumo {\n    flex: 0 0 auto;\n    padding: 1rem 1.25rem;\n    border: 1px solid var(--borda);\n    border-radius: var(--raio);\n    background: var(--superficie);\n    text-align: center;\n}\n\n.resumo strong,\n.resumo span {\n    display: block;\n}\n\n.resumo strong {\n    font-size: 2rem;\n}\n\n/* 3. A barra usa Flexbox e permite quebra controlada. */\n.barra-ferramentas {\n    display: flex;\n    justify-content: space-between;\n    align-items: flex-end;\n    flex-wrap: wrap;\n    gap: 1rem;\n    margin-bottom: 2rem;\n    padding: 1.1rem;\n    border: 1px solid var(--borda);\n    border-radius: var(--raio);\n    background: rgba(16, 29, 47, 0.88);\n}\n\n.titulo-ferramentas {\n    flex: 1 1 220px;\n    min-width: 0;\n}\n\n.titulo-ferramentas h2 {\n    margin-bottom: 0;\n    font-size: 1.15rem;\n}\n\n/* 4. Busca e ações também são grupos flexíveis. */\n.grupo-busca,\n.grupo-acoes {\n    display: flex;\n    align-items: center;\n    flex-wrap: wrap;\n    gap: 0.65rem;\n    min-width: 0;\n}\n\n.grupo-busca {\n    flex: 2 1 320px;\n}\n\n.grupo-busca input {\n    flex: 1 1 190px;\n    min-width: 0;\n    min-height: 44px;\n    padding: 0.7rem 0.85rem;\n    border: 1px solid var(--borda);\n    border-radius: 12px;\n    background: #071525;\n    color: var(--texto);\n}\n\n.grupo-acoes {\n    flex: 1 1 auto;\n    justify-content: flex-end;\n}\n\nbutton {\n    min-height: 44px;\n    padding: 0.65rem 0.9rem;\n    border: 1px solid var(--borda);\n    border-radius: 12px;\n    background: var(--superficie-clara);\n    color: var(--texto);\n    cursor: pointer;\n}\n\nbutton:hover,\nbutton:focus-visible,\ninput:focus-visible,\na:focus-visible {\n    border-color: var(--destaque);\n    outline: 3px solid rgba(96, 165, 250, 0.28);\n    outline-offset: 3px;\n}\n\n.botao-filtro.ativo {\n    border-color: var(--destaque);\n    background: rgba(96, 165, 250, 0.16);\n}\n\n.botao-principal {\n    border-color: var(--destaque);\n    background: var(--destaque-forte);\n    font-weight: 800;\n}\n\n.cabecalho-secao {\n    align-items: end;\n    margin-bottom: 1rem;\n}\n\n.grade-modulos {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));\n    gap: 1rem;\n}\n\n.card-modulo {\n    min-width: 0;\n    padding: 1.1rem;\n    border: 1px solid var(--borda);\n    border-radius: var(--raio);\n    background: linear-gradient(160deg, var(--superficie-clara), var(--superficie));\n    overflow-wrap: anywhere;\n}\n\n.card-modulo[hidden] {\n    display: none;\n}\n\n.card-modulo h3 {\n    margin-bottom: 0.45rem;\n}\n\n.card-modulo a {\n    color: var(--destaque);\n    font-weight: 800;\n}\n\n.status {\n    display: inline-flex;\n    margin-bottom: 1rem;\n    padding: 0.3rem 0.55rem;\n    border-radius: 999px;\n    font-size: 0.75rem;\n    font-weight: 900;\n}\n\n.ativo-status {\n    background: rgba(94, 234, 212, 0.14);\n    color: var(--sucesso);\n}\n\n.planejado-status {\n    background: rgba(96, 165, 250, 0.14);\n    color: #93c5fd;\n}\n\n.orientacao {\n    margin-top: 2rem;\n    padding: 1.2rem;\n    border-left: 4px solid var(--destaque);\n    background: rgba(16, 29, 47, 0.7);\n}\n\n.orientacao > p {\n    flex: 1 1 360px;\n    margin-bottom: 0;\n}\n\nfooter {\n    display: flex;\n    justify-content: space-between;\n    flex-wrap: wrap;\n    gap: 1rem;\n    padding-block: 1.25rem 2rem;\n    border-top: 1px solid var(--borda);\n}\n\n.sr-only {\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    padding: 0;\n    margin: -1px;\n    overflow: hidden;\n    clip: rect(0, 0, 0, 0);\n    white-space: nowrap;\n    border: 0;\n}\n\n/* 5. Em telas menores, os grupos ocupam a largura disponível. */\n@media (max-width: 760px) {\n    .cabecalho-principal,\n    .apresentacao,\n    .cabecalho-secao,\n    .orientacao,\n    footer {\n        align-items: stretch;\n        flex-direction: column;\n    }\n\n    .navegacao,\n    .navegacao ul,\n    .botao-perfil,\n    .grupo-busca,\n    .grupo-acoes {\n        width: 100%;\n    }\n\n    .navegacao ul,\n    .grupo-acoes {\n        justify-content: flex-start;\n    }\n\n    .grupo-busca button,\n    .botao-principal {\n        flex: 1 1 150px;\n    }\n}\n\n",
      "js": "const formularioBusca = document.querySelector('.grupo-busca');\nconst campoBusca = document.querySelector('#busca');\nconst botoesFiltro = document.querySelectorAll('[data-filtro]');\nconst cards = document.querySelectorAll('.card-modulo');\nconst mensagem = document.querySelector('#mensagem-filtro');\nconst totalVisivel = document.querySelector('#total-visivel');\nconst botaoNovo = document.querySelector('#novo-modulo');\n\nlet filtroAtual = 'todos';\n\nfunction aplicarFiltros() {\n    const termo = campoBusca.value.trim().toLowerCase();\n    let quantidade = 0;\n\n    cards.forEach((card) => {\n        const atendeStatus = filtroAtual === 'todos' || card.dataset.status === filtroAtual;\n        const texto = `${card.textContent} ${card.dataset.termos || ''}`.toLowerCase();\n        const atendeBusca = !termo || texto.includes(termo);\n        const visivel = atendeStatus && atendeBusca;\n        card.hidden = !visivel;\n        if (visivel) quantidade += 1;\n    });\n\n    totalVisivel.textContent = String(quantidade);\n    mensagem.textContent = quantidade === 1\n        ? 'Mostrando 1 módulo.'\n        : `Mostrando ${quantidade} módulos.`;\n}\n\nformularioBusca.addEventListener('submit', (evento) => {\n    evento.preventDefault();\n    aplicarFiltros();\n});\n\ncampoBusca.addEventListener('input', aplicarFiltros);\n\nbotoesFiltro.forEach((botao) => {\n    botao.addEventListener('click', () => {\n        filtroAtual = botao.dataset.filtro;\n        botoesFiltro.forEach((item) => {\n            const ativo = item === botao;\n            item.classList.toggle('ativo', ativo);\n            item.setAttribute('aria-pressed', String(ativo));\n        });\n        aplicarFiltros();\n    });\n});\n\nbotaoNovo.addEventListener('click', () => {\n    mensagem.textContent = 'A ação “Novo módulo” foi acionada. O formulário será construído em exercícios futuros.';\n});\n\n"
    },
    "nomesArquivos": {
      "html": "index.html",
      "css": "estilo.css",
      "js": "script.js"
    },
    "passos": {
      "css": [
        {
          "titulo": "Base, variáveis e tipografia",
          "linhas": [
            1,
            50
          ],
          "explicacao": "Comece com box-sizing, variáveis visuais, fundo, tipografia e largura-base. Essas regras preparam o projeto antes do Flexbox principal."
        },
        {
          "titulo": "Cabeçalho com Flexbox",
          "linhas": [
            51,
            60
          ],
          "explicacao": "O cabeçalho usa display:flex, distribuição, alinhamento, quebra e gap para organizar marca, navegação e perfil."
        },
        {
          "titulo": "Marca, navegação e perfil",
          "linhas": [
            62,
            140
          ],
          "explicacao": "Os grupos internos também usam Flexbox e áreas de toque adequadas. Observe como os elementos podem quebrar sem sobreposição."
        },
        {
          "titulo": "Apresentação e resumo",
          "linhas": [
            141,
            207
          ],
          "explicacao": "A área de apresentação organiza título, texto e resumo com Flexbox, mantendo min-width e espaçamentos responsivos."
        },
        {
          "titulo": "Barra de ferramentas",
          "linhas": [
            208,
            231
          ],
          "explicacao": "Aqui está o núcleo da atividade: a barra usa display:flex, justify-content, align-items, flex-wrap e gap."
        },
        {
          "titulo": "Busca e grupo de ações",
          "linhas": [
            232,
            291
          ],
          "explicacao": "Busca, filtros e ação principal formam grupos flexíveis com flex-grow/flex-basis, foco visível e área de toque."
        },
        {
          "titulo": "Cards, orientação e rodapé",
          "linhas": [
            292,
            376
          ],
          "explicacao": "O restante da interface demonstra como combinar Flexbox com Grid sem usar posicionamento absoluto para montar a barra."
        },
        {
          "titulo": "Adaptação mobile",
          "linhas": [
            377,
            405
          ],
          "explicacao": "A media query reorganiza os grupos em telas menores e mantém controles acessíveis sem rolagem horizontal global."
        }
      ]
    },
    "roteiro": [
      "Retomar o Box Model e perguntar por que uma barra pode transbordar quando os controles possuem larguras fixas.",
      "Identificar os três grupos principais: título, pesquisa e ações.",
      "Aplicar display: flex na barra e comparar justify-content e align-items.",
      "Ativar flex-wrap e reduzir a largura para observar a quebra controlada.",
      "Transformar busca e ações em grupos flexíveis com gap.",
      "Usar flex-basis, flex-grow e min-width: 0 para permitir adaptação.",
      "Garantir botões com altura mínima e foco visível.",
      "Testar pesquisa, filtros, largura de celular e ausência de rolagem horizontal.",
      "Baixar os arquivos e enviar a pasta exercicio-07 ao repositório atividades-praticas."
    ],
    "classroom": {
      "titulo": "Exercício 07 — Barra de Ferramentas com Flexbox",
      "descricao": "# Exercício 07 — Barra de Ferramentas com Flexbox\n\n**Nesta atividade, vamos praticar a organização de uma barra real de sistema usando Flexbox.**\n\nCrie a pasta `exercicio-07` dentro do repositório `atividades-praticas`.\n\nBaixe ou copie o `index.html` e o `script.js` de apoio. Digite e compreenda o arquivo `estilo.css` apresentado na plataforma.\n\nA barra deve reunir:\n\n- marca e navegação do sistema;\n- campo de pesquisa;\n- botões de filtro;\n- botão de ação principal;\n- alinhamento vertical coerente;\n- espaçamento com `gap`;\n- quebra controlada com `flex-wrap`;\n- adaptação para celular sem rolagem horizontal global.\n\n***Neste exercício, será criada uma barra de ferramentas responsiva com logo, menu, pesquisa, filtros e ação principal.***\n\nO comportamento esperado é que os grupos se distribuam com `justify-content`, sejam alinhados com `align-items` e quebrem de linha de modo organizado quando a largura diminuir. Evite usar `position: absolute` para montar o layout.\n\nTestes sugeridos:\n\n1. abra a página em largura de computador;\n2. reduza para aproximadamente 760 px e 390 px;\n3. confirme que nenhum controle fica cortado;\n4. navegue com Tab e observe o foco visível;\n5. teste pesquisa, filtros e o botão “Novo módulo”;\n6. confirme área de toque confortável nos botões.\n\nA pasta deve conter `index.html`, `estilo.css`, `script.js` e `README.md`.\n\n**Entrega: anexar o link do repositório do GitHub.**\n"
    },
    "professor": {
      "testes": [
        "Remover display: flex da barra e comparar a distribuição dos grupos.",
        "Alternar justify-content entre flex-start, space-between e center.",
        "Remover flex-wrap e reduzir a largura para demonstrar transbordamento.",
        "Aumentar o texto de um botão e confirmar quebra controlada.",
        "Testar as larguras 1280 px, 760 px e 390 px.",
        "Navegar com Tab e confirmar foco visível em links, pesquisa e botões.",
        "Alterar cores e valores mantendo os conceitos para testar a validação flexível.",
        "Adicionar position: absolute à barra e observar o diagnóstico."
      ],
      "erros": [
        "Usar position: absolute para alinhar pesquisa ou botões.",
        "Esquecer flex-wrap e permitir que a barra fique maior que a tela.",
        "Aplicar gap somente na barra externa e deixar os botões colados.",
        "Definir largura fixa para o campo de busca sem permitir crescimento.",
        "Criar botões com área de toque pequena.",
        "Remover o foco visível para teclado."
      ],
      "notas": [
        "A produção avaliada é o estilo.css; HTML e JavaScript são arquivos de apoio.",
        "A validação aceita Grid no catálogo, mas a barra e seus grupos devem usar Flexbox.",
        "Cores, unidades, valores e ordem das propriedades podem variar.",
        "Este exercício prepara o uso de Flexbox em cabeçalhos, formulários e barras de sistemas reais."
      ],
      "python": "# Comparação futura\n# Interfaces em Python também organizam controles\n# em linhas, colunas e contêineres responsivos."
    },
    "permitirBase": {
      "css": false
    },
    "validacao": {
      "tipo": "css-flexbox",
      "flexboxSemantico": {
        "barra": {
          "seletores": [
            ".barra-ferramentas",
            ".toolbar",
            ".barra-acoes"
          ],
          "exigirJustifyContent": true,
          "exigirAlignItems": true,
          "exigirFlexWrap": true,
          "exigirGap": true,
          "proibirPosicionamentoAbsoluto": true
        },
        "grupos": {
          "seletores": [
            ".grupo-busca",
            ".grupo-acoes",
            ".acoes",
            ".ferramentas"
          ],
          "quantidadeMinima": 2,
          "exigirGap": true
        },
        "crescimentoFlexivel": true,
        "controlesAcessiveis": true,
        "mediaQueriesMinimas": 1,
        "estadosInteracao": true
      }
    },
    "fasePedagogica": 7,
    "apoioAutomatico": {
      "enabled": true,
      "initialAccess": false,
      "minActiveSeconds": 180,
      "minAttempts": 2,
      "minKeystrokes": 40,
      "minExecutions": 1,
      "minHints": 1,
      "requiredSignals": 3,
      "blocks": {
        "css": [
          {
            "id": "variaveis-e-tipografia-base",
            "title": "Completar variáveis e tipografia-base",
            "description": "Insere somente a identidade visual inicial. O Flexbox da barra, os grupos internos, a quebra e a responsividade continuam sendo construídos pelo aluno.",
            "reason": "tentativa prolongada",
            "mode": "append",
            "content": ":root {\n    --fundo: #07111f;\n    --superficie: #101d2f;\n    --texto: #eef6ff;\n    --texto-suave: #a9bad0;\n    --destaque: #60a5fa;\n}\n\nbody {\n    margin: 0;\n    min-height: 100vh;\n    background: var(--fundo);\n    color: var(--texto);\n    font-family: Arial, Helvetica, sans-serif;\n    line-height: 1.5;\n}"
          }
        ]
      }
    },
    "fluxoEntrega": {
      "etapas": [
        "Digite ou complete o arquivo solicitado",
        "Execute o código atual",
        "Teste o comportamento no preview",
        "Valide o arquivo",
        "Conclua a atividade",
        "Gere a evidência",
        "Baixe o ZIP e entregue no Classroom"
      ]
    },
    "referenciaCompletaPadrao": true,
    "arquivosApoio": [
      "html",
      "js"
    ],
    "tempoEstimado": "30–35 min",
    "nivel": "CSS aplicado"
  },
  {
    "numero": 8,
    "titulo": "Exercício 08 — Dashboard com CSS Grid",
    "nomeCurto": "Dashboard com Grid",
    "tema": "CSS aplicado à organização bidimensional de um painel administrativo",
    "objetivo": "Distribuir menu, indicadores, atividade, tarefas e registros usando CSS Grid sem sobreposição.",
    "retomadas": [
      "Box Model",
      "Flexbox",
      "gap e responsividade"
    ],
    "novos": [
      "display: grid",
      "grid-template-columns",
      "grid-template-areas",
      "grid-area",
      "repeat() e minmax()",
      "subgrades responsivas"
    ],
    "pasta": "exercicio-08",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/",
    "githubUrl": "https://github.com/",
    "ordemArquivos": [
      "css"
    ],
    "ordemArquivosAluno": [
      "css"
    ],
    "ordemArquivosProfessor": [
      "html",
      "css",
      "js"
    ],
    "ordemDownloads": [
      "html",
      "css",
      "js"
    ],
    "arquivos": {
      "html": "<!DOCTYPE html>\n<html lang=\"pt-BR\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <meta name=\"description\" content=\"Dashboard administrativo responsivo organizado com CSS Grid.\">\n    <title>Dashboard DS | CSS Grid</title>\n    <link rel=\"stylesheet\" href=\"estilo.css\">\n</head>\n<body>\n    <header class=\"topo\">\n        <a class=\"marca\" href=\"#conteudo-principal\" aria-label=\"Sistema DS — ir para o conteúdo principal\">\n            <span class=\"marca-simbolo\" aria-hidden=\"true\">DS</span>\n            <span><strong>Sistema DS</strong><small>Painel administrativo</small></span>\n        </a>\n        <div class=\"acoes-topo\">\n            <button type=\"button\" id=\"alternar-densidade\" aria-pressed=\"false\">Modo compacto</button>\n            <button class=\"perfil\" type=\"button\" aria-label=\"Abrir perfil de Gabriel\">GA</button>\n        </div>\n    </header>\n\n    <main id=\"conteudo-principal\" class=\"dashboard-grid\">\n        <aside class=\"menu-lateral\" aria-label=\"Menu do painel\">\n            <p class=\"menu-titulo\">Navegação</p>\n            <nav>\n                <a class=\"ativo\" href=\"#resumo\" aria-current=\"page\">Visão geral</a>\n                <a href=\"#indicadores\">Indicadores</a>\n                <a href=\"#atividade\">Atividade</a>\n                <a href=\"#registros\">Registros</a>\n            </nav>\n            <div class=\"progresso-lateral\">\n                <span>Meta semanal</span>\n                <strong>78%</strong>\n                <progress max=\"100\" value=\"78\">78%</progress>\n            </div>\n        </aside>\n\n        <section id=\"resumo\" class=\"boas-vindas\" aria-labelledby=\"titulo-dashboard\">\n            <div>\n                <p class=\"etiqueta\">Exercício 08</p>\n                <h1 id=\"titulo-dashboard\">Dashboard com CSS Grid</h1>\n                <p>Organize regiões diferentes sem sobreposição e faça o painel se adaptar progressivamente a telas menores.</p>\n            </div>\n            <div class=\"periodos\" aria-label=\"Período dos dados\">\n                <button class=\"periodo ativo\" type=\"button\" data-periodo=\"semana\" aria-pressed=\"true\">Semana</button>\n                <button class=\"periodo\" type=\"button\" data-periodo=\"mes\" aria-pressed=\"false\">Mês</button>\n                <button class=\"periodo\" type=\"button\" data-periodo=\"trimestre\" aria-pressed=\"false\">Trimestre</button>\n            </div>\n        </section>\n\n        <section id=\"indicadores\" class=\"grade-indicadores\" aria-label=\"Indicadores principais\">\n            <article class=\"card-indicador\">\n                <span>Chamados abertos</span><strong id=\"valor-abertos\">18</strong><small>3 urgentes</small>\n            </article>\n            <article class=\"card-indicador\">\n                <span>Resolvidos</span><strong id=\"valor-resolvidos\">42</strong><small>+12% no período</small>\n            </article>\n            <article class=\"card-indicador\">\n                <span>Tempo médio</span><strong id=\"valor-tempo\">2h 18m</strong><small>meta: menos de 3h</small>\n            </article>\n            <article class=\"card-indicador\">\n                <span>Satisfação</span><strong id=\"valor-satisfacao\">94%</strong><small>128 avaliações</small>\n            </article>\n        </section>\n\n        <section id=\"atividade\" class=\"painel-atividade\" aria-labelledby=\"titulo-atividade\">\n            <div class=\"cabecalho-painel\">\n                <div><p class=\"etiqueta\">Desempenho</p><h2 id=\"titulo-atividade\">Atendimentos concluídos</h2></div>\n                <p id=\"legenda-periodo\" role=\"status\" aria-live=\"polite\">Dados da semana atual.</p>\n            </div>\n            <div class=\"grafico\" aria-label=\"Gráfico de atendimentos concluídos por dia\">\n                <div class=\"barra\" style=\"--valor: 42%\"><span>Seg</span><strong>12</strong></div>\n                <div class=\"barra\" style=\"--valor: 66%\"><span>Ter</span><strong>19</strong></div>\n                <div class=\"barra\" style=\"--valor: 54%\"><span>Qua</span><strong>15</strong></div>\n                <div class=\"barra\" style=\"--valor: 82%\"><span>Qui</span><strong>24</strong></div>\n                <div class=\"barra\" style=\"--valor: 72%\"><span>Sex</span><strong>21</strong></div>\n            </div>\n        </section>\n\n        <aside class=\"painel-tarefas\" aria-labelledby=\"titulo-tarefas\">\n            <div class=\"cabecalho-painel\"><div><p class=\"etiqueta\">Prioridades</p><h2 id=\"titulo-tarefas\">Próximas ações</h2></div></div>\n            <ol class=\"lista-tarefas\">\n                <li><span class=\"marcador urgente\">1</span><div><strong>Revisar chamado #204</strong><small>Vence hoje, 19h30</small></div></li>\n                <li><span class=\"marcador\">2</span><div><strong>Validar novo cadastro</strong><small>Aguardando análise</small></div></li>\n                <li><span class=\"marcador\">3</span><div><strong>Publicar relatório semanal</strong><small>Prazo: amanhã</small></div></li>\n            </ol>\n            <button type=\"button\" id=\"adicionar-tarefa\">Adicionar tarefa simulada</button>\n        </aside>\n\n        <section id=\"registros\" class=\"painel-registros\" aria-labelledby=\"titulo-registros\">\n            <div class=\"cabecalho-painel\">\n                <div><p class=\"etiqueta\">Registros</p><h2 id=\"titulo-registros\">Chamados recentes</h2></div>\n                <a href=\"#conteudo-principal\">Ver todos</a>\n            </div>\n            <div class=\"tabela-responsiva\" tabindex=\"0\" aria-label=\"Tabela com rolagem horizontal quando necessária\">\n                <table>\n                    <caption>Últimos chamados atualizados</caption>\n                    <thead><tr><th scope=\"col\">Código</th><th scope=\"col\">Assunto</th><th scope=\"col\">Responsável</th><th scope=\"col\">Status</th><th scope=\"col\">Prazo</th></tr></thead>\n                    <tbody>\n                        <tr><td>#204</td><td>Acesso ao painel</td><td>Ana</td><td><span class=\"status urgente\">Urgente</span></td><td><time datetime=\"2026-08-05T19:30\">Hoje, 19h30</time></td></tr>\n                        <tr><td>#203</td><td>Cadastro incompleto</td><td>Bruno</td><td><span class=\"status andamento\">Em andamento</span></td><td><time datetime=\"2026-08-06\">Amanhã</time></td></tr>\n                        <tr><td>#202</td><td>Relatório mensal</td><td>Carla</td><td><span class=\"status resolvido\">Resolvido</span></td><td><time datetime=\"2026-08-04\">04/08</time></td></tr>\n                    </tbody>\n                </table>\n            </div>\n        </section>\n    </main>\n\n    <footer><p>3º DS — Programação no Desenvolvimento de Sistemas</p><a href=\"#conteudo-principal\">Voltar ao início</a></footer>\n    <script src=\"script.js\"></script>\n</body>\n</html>",
      "css": "/* 1. Base e Box Model previsível. */\n*,\n*::before,\n*::after {\n    box-sizing: border-box;\n}\n\n:root {\n    --fundo: #07111f;\n    --superficie: #101d2f;\n    --superficie-clara: #18283d;\n    --borda: #2b4059;\n    --texto: #eef6ff;\n    --texto-suave: #a9bad0;\n    --destaque: #60a5fa;\n    --destaque-forte: #2563eb;\n    --sucesso: #5eead4;\n    --alerta: #fbbf24;\n    --perigo: #fb7185;\n    --raio: 18px;\n}\n\nhtml { scroll-behavior: smooth; }\nbody {\n    margin: 0;\n    min-width: 0;\n    min-height: 100vh;\n    background: linear-gradient(145deg, var(--fundo), #0c1a2c);\n    color: var(--texto);\n    font-family: Arial, Helvetica, sans-serif;\n    line-height: 1.5;\n}\nbutton, input { font: inherit; }\na { color: inherit; }\n\n.topo,\n.dashboard-grid,\nfooter {\n    width: min(100% - 2rem, 1240px);\n    margin-inline: auto;\n}\n\n/* 2. Flexbox continua útil para componentes lineares. */\n.topo,\n.marca,\n.acoes-topo,\n.periodos,\n.cabecalho-painel {\n    display: flex;\n    align-items: center;\n}\n\n.topo {\n    justify-content: space-between;\n    gap: 1rem;\n    padding-block: 1rem;\n    border-bottom: 1px solid var(--borda);\n}\n.marca { gap: .75rem; text-decoration: none; }\n.marca-simbolo {\n    display: grid;\n    place-items: center;\n    width: 2.8rem;\n    height: 2.8rem;\n    border-radius: 13px;\n    background: var(--destaque);\n    color: #061326;\n    font-weight: 900;\n}\n.marca strong, .marca small { display: block; }\n.marca small { color: var(--texto-suave); }\n.acoes-topo { gap: .65rem; }\nbutton {\n    min-height: 44px;\n    padding: .68rem .9rem;\n    border: 1px solid var(--borda);\n    border-radius: 12px;\n    background: var(--superficie);\n    color: var(--texto);\n    cursor: pointer;\n}\nbutton:hover, button:focus-visible, a:focus-visible {\n    border-color: var(--destaque);\n    outline: 3px solid rgba(96, 165, 250, .28);\n    outline-offset: 2px;\n}\n.perfil { width: 44px; padding: 0; border-radius: 50%; background: var(--sucesso); color: #06231e; font-weight: 900; }\n\n/* 3. Grade principal com áreas nomeadas. */\n.dashboard-grid {\n    display: grid;\n    grid-template-columns: minmax(210px, 250px) minmax(0, 2fr) minmax(240px, 1fr);\n    grid-template-areas:\n        \"menu boas boas\"\n        \"menu indicadores indicadores\"\n        \"menu atividade tarefas\"\n        \"menu registros registros\";\n    gap: 1.25rem;\n    padding-block: 1.5rem 3rem;\n    align-items: start;\n}\n\n.menu-lateral { grid-area: menu; position: sticky; top: 1rem; }\n.boas-vindas { grid-area: boas; }\n.grade-indicadores { grid-area: indicadores; }\n.painel-atividade { grid-area: atividade; }\n.painel-tarefas { grid-area: tarefas; }\n.painel-registros { grid-area: registros; }\n\n.menu-lateral,\n.boas-vindas,\n.card-indicador,\n.painel-atividade,\n.painel-tarefas,\n.painel-registros {\n    min-width: 0;\n    border: 1px solid var(--borda);\n    border-radius: var(--raio);\n    background: rgba(16, 29, 47, .92);\n}\n\n.menu-lateral { padding: 1rem; }\n.menu-titulo, .etiqueta {\n    margin: 0 0 .55rem;\n    color: var(--sucesso);\n    font-size: .76rem;\n    font-weight: 900;\n    letter-spacing: .12em;\n    text-transform: uppercase;\n}\n.menu-lateral nav { display: grid; gap: .35rem; }\n.menu-lateral a { padding: .75rem .8rem; border-radius: 10px; color: var(--texto-suave); text-decoration: none; }\n.menu-lateral a:hover, .menu-lateral a:focus-visible, .menu-lateral a.ativo { background: var(--superficie-clara); color: var(--texto); }\n.progresso-lateral { display: grid; gap: .45rem; margin-top: 1.4rem; padding-top: 1rem; border-top: 1px solid var(--borda); }\nprogress { width: 100%; accent-color: var(--sucesso); }\n\n.boas-vindas {\n    display: flex;\n    justify-content: space-between;\n    align-items: end;\n    flex-wrap: wrap;\n    gap: 1rem;\n    padding: 1.3rem;\n}\nh1, h2, h3, p { margin-top: 0; }\nh1 { max-width: 760px; margin-bottom: .55rem; font-size: clamp(2rem, 5vw, 3.7rem); line-height: 1.05; }\n.boas-vindas > div:first-child > p:last-child, small, footer, #legenda-periodo { color: var(--texto-suave); }\n.periodos { flex-wrap: wrap; gap: .4rem; }\n.periodo { min-height: 40px; padding: .5rem .75rem; }\n.periodo.ativo { border-color: var(--destaque); background: var(--destaque-forte); }\n\n/* 4. Subgrade responsiva para os indicadores. */\n.grade-indicadores {\n    display: grid;\n    grid-template-columns: repeat(4, minmax(0, 1fr));\n    gap: 1rem;\n}\n.card-indicador { padding: 1rem; }\n.card-indicador span, .card-indicador strong, .card-indicador small { display: block; }\n.card-indicador span { color: var(--texto-suave); }\n.card-indicador strong { margin-block: .35rem; font-size: clamp(1.7rem, 4vw, 2.6rem); }\n\n.painel-atividade, .painel-tarefas, .painel-registros { padding: 1.15rem; }\n.cabecalho-painel { justify-content: space-between; align-items: start; gap: 1rem; flex-wrap: wrap; }\n.cabecalho-painel h2 { margin-bottom: .3rem; }\n\n.grafico {\n    display: grid;\n    grid-template-columns: repeat(5, minmax(42px, 1fr));\n    align-items: end;\n    gap: .65rem;\n    min-height: 260px;\n    margin-top: 1rem;\n    padding: 1rem .8rem 0;\n    border-radius: 14px;\n    background: linear-gradient(to top, rgba(96,165,250,.06), transparent), repeating-linear-gradient(to top, transparent 0 49px, rgba(169,186,208,.14) 50px);\n}\n.barra {\n    display: grid;\n    grid-template-rows: 1fr auto;\n    align-items: end;\n    gap: .45rem;\n    height: 100%;\n    text-align: center;\n}\n.barra::before {\n    content: \"\";\n    width: 100%;\n    height: var(--valor);\n    min-height: 24px;\n    border-radius: 10px 10px 4px 4px;\n    background: linear-gradient(var(--destaque), var(--destaque-forte));\n}\n.barra strong { grid-row: 1; align-self: end; margin-bottom: calc(var(--valor) + .35rem); font-size: .8rem; }\n.barra span { grid-row: 2; color: var(--texto-suave); font-size: .8rem; }\n\n.lista-tarefas { display: grid; gap: .7rem; margin: 1rem 0; padding: 0; list-style: none; }\n.lista-tarefas li { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: .7rem; align-items: start; padding: .75rem; border-radius: 12px; background: var(--superficie-clara); }\n.lista-tarefas strong, .lista-tarefas small { display: block; }\n.marcador { display: grid; place-items: center; width: 2rem; height: 2rem; border-radius: 50%; background: var(--destaque); color: #061326; font-weight: 900; }\n.marcador.urgente { background: var(--perigo); }\n#Adicionar-tarefa, #adicionar-tarefa { width: 100%; }\n\n.tabela-responsiva { max-width: 100%; overflow-x: auto; border-radius: 12px; }\ntable { width: 100%; min-width: 720px; border-collapse: collapse; }\ncaption { padding: .75rem; color: var(--texto-suave); text-align: left; }\nth, td { padding: .8rem; border-bottom: 1px solid var(--borda); text-align: left; }\nth { color: var(--texto-suave); font-size: .78rem; text-transform: uppercase; }\n.status { display: inline-block; padding: .28rem .55rem; border-radius: 999px; font-size: .78rem; font-weight: 800; }\n.status.urgente { background: rgba(251,113,133,.18); color: #fecdd3; }\n.status.andamento { background: rgba(251,191,36,.18); color: #fde68a; }\n.status.resolvido { background: rgba(94,234,212,.16); color: #99f6e4; }\nfooter { display: flex; justify-content: space-between; gap: 1rem; padding-block: 1.2rem 2rem; border-top: 1px solid var(--borda); }\n\n/* 5. O modo compacto prova que as regiões continuam organizadas. */\nbody.compacto .dashboard-grid { gap: .75rem; }\nbody.compacto .menu-lateral,\nbody.compacto .boas-vindas,\nbody.compacto .card-indicador,\nbody.compacto .painel-atividade,\nbody.compacto .painel-tarefas,\nbody.compacto .painel-registros { border-radius: 12px; }\nbody.compacto .card-indicador,\nbody.compacto .painel-atividade,\nbody.compacto .painel-tarefas,\nbody.compacto .painel-registros { padding: .8rem; }\n\n/* 6. Tablet: duas colunas principais e menu horizontal. */\n@media (max-width: 960px) {\n    .dashboard-grid {\n        grid-template-columns: minmax(0, 1.45fr) minmax(240px, .85fr);\n        grid-template-areas:\n            \"boas boas\"\n            \"menu menu\"\n            \"indicadores indicadores\"\n            \"atividade tarefas\"\n            \"registros registros\";\n    }\n    .menu-lateral { position: static; }\n    .menu-lateral nav { grid-template-columns: repeat(4, minmax(120px, 1fr)); overflow-x: auto; }\n    .progresso-lateral { grid-template-columns: auto auto minmax(120px, 1fr); align-items: center; margin-top: .8rem; }\n    .grade-indicadores { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n}\n\n/* 7. Celular: todas as regiões em uma única coluna. */\n@media (max-width: 650px) {\n    .topo, .dashboard-grid, footer { width: min(100% - 1rem, 1240px); }\n    .topo, footer { align-items: flex-start; flex-direction: column; }\n    .acoes-topo { width: 100%; }\n    .acoes-topo button:first-child { flex: 1; }\n    .dashboard-grid {\n        grid-template-columns: minmax(0, 1fr);\n        grid-template-areas:\n            \"boas\"\n            \"menu\"\n            \"indicadores\"\n            \"atividade\"\n            \"tarefas\"\n            \"registros\";\n        gap: .8rem;\n    }\n    .boas-vindas { align-items: flex-start; }\n    .periodos { width: 100%; }\n    .periodos button { flex: 1 1 90px; }\n    .grade-indicadores { grid-template-columns: minmax(0, 1fr); gap: .7rem; }\n    .menu-lateral nav { grid-template-columns: repeat(4, minmax(130px, 1fr)); }\n    .progresso-lateral { grid-template-columns: 1fr auto; }\n    .progresso-lateral progress { grid-column: 1 / -1; }\n    .grafico { min-height: 230px; gap: .35rem; padding-inline: .35rem; }\n}",
      "js": "const dadosPorPeriodo = {\n    semana: { abertos: 18, resolvidos: 42, tempo: \"2h 18m\", satisfacao: \"94%\", legenda: \"Dados da semana atual.\", barras: [42, 66, 54, 82, 72] },\n    mes: { abertos: 63, resolvidos: 168, tempo: \"2h 31m\", satisfacao: \"92%\", legenda: \"Dados consolidados do mês.\", barras: [64, 78, 70, 88, 81] },\n    trimestre: { abertos: 147, resolvidos: 492, tempo: \"2h 44m\", satisfacao: \"91%\", legenda: \"Dados consolidados do trimestre.\", barras: [72, 84, 76, 93, 87] }\n};\n\nconst botoesPeriodo = [...document.querySelectorAll(\".periodo\")];\nconst barras = [...document.querySelectorAll(\".barra\")];\n\nfunction aplicarPeriodo(periodo) {\n    const dados = dadosPorPeriodo[periodo];\n    document.querySelector(\"#valor-abertos\").textContent = dados.abertos;\n    document.querySelector(\"#valor-resolvidos\").textContent = dados.resolvidos;\n    document.querySelector(\"#valor-tempo\").textContent = dados.tempo;\n    document.querySelector(\"#valor-satisfacao\").textContent = dados.satisfacao;\n    document.querySelector(\"#legenda-periodo\").textContent = dados.legenda;\n    barras.forEach((barra, indice) => barra.style.setProperty(\"--valor\", `${dados.barras[indice]}%`));\n    botoesPeriodo.forEach(botao => {\n        const ativo = botao.dataset.periodo === periodo;\n        botao.classList.toggle(\"ativo\", ativo);\n        botao.setAttribute(\"aria-pressed\", String(ativo));\n    });\n}\n\nbotoesPeriodo.forEach(botao => botao.addEventListener(\"click\", () => aplicarPeriodo(botao.dataset.periodo)));\n\ndocument.querySelector(\"#alternar-densidade\").addEventListener(\"click\", evento => {\n    const compacto = document.body.classList.toggle(\"compacto\");\n    evento.currentTarget.textContent = compacto ? \"Modo confortável\" : \"Modo compacto\";\n    evento.currentTarget.setAttribute(\"aria-pressed\", String(compacto));\n});\n\ndocument.querySelector(\"#adicionar-tarefa\").addEventListener(\"click\", () => {\n    const lista = document.querySelector(\".lista-tarefas\");\n    const item = document.createElement(\"li\");\n    item.innerHTML = '<span class=\"marcador\">+</span><div><strong>Nova tarefa simulada</strong><small>Incluída para testar o crescimento da grade.</small></div>';\n    lista.append(item);\n});"
    },
    "nomesArquivos": {
      "html": "index.html",
      "css": "estilo.css",
      "js": "script.js"
    },
    "passos": {
      "css": [
        {
          "titulo": "Base e Box Model",
          "linhas": [
            1,
            42
          ],
          "explicacao": "A base usa border-box, variáveis e limites de largura para evitar dimensões imprevisíveis."
        },
        {
          "titulo": "Flexbox dentro dos componentes",
          "linhas": [
            43,
            88
          ],
          "explicacao": "Cabeçalhos, marca e botões continuam lineares e são organizados com Flexbox."
        },
        {
          "titulo": "Grade principal e áreas",
          "linhas": [
            89,
            151
          ],
          "explicacao": "O dashboard usa três colunas, áreas nomeadas e minmax para distribuir as regiões."
        },
        {
          "titulo": "Subgrade de indicadores",
          "linhas": [
            152,
            162
          ],
          "explicacao": "Os quatro indicadores formam outra grade independente dentro da grade principal."
        },
        {
          "titulo": "Painéis, gráfico e tabela",
          "linhas": [
            163,
            214
          ],
          "explicacao": "Cada painel controla sua própria estrutura sem alterar o posicionamento global."
        },
        {
          "titulo": "Modo compacto",
          "linhas": [
            215,
            227
          ],
          "explicacao": "A mudança de densidade comprova que a grade permanece estável com espaçamentos diferentes."
        },
        {
          "titulo": "Adaptação para tablet",
          "linhas": [
            228,
            244
          ],
          "explicacao": "A primeira media query reorganiza o painel em duas colunas e transforma o menu em faixa horizontal."
        },
        {
          "titulo": "Adaptação para celular",
          "linhas": [
            245,
            270
          ],
          "explicacao": "A segunda media query cria uma única coluna e mantém todas as regiões legíveis."
        }
      ],
      "html": [
        {
          "titulo": "Estrutura do dashboard",
          "linhas": [
            1,
            112
          ],
          "explicacao": "O HTML de apoio separa menu, indicadores, atividade, tarefas e registros em regiões semânticas."
        }
      ],
      "js": [
        {
          "titulo": "Interações de apoio",
          "linhas": [
            1,
            38
          ],
          "explicacao": "O JavaScript de apoio alterna períodos, densidade visual e tarefas para testar o crescimento da grade."
        }
      ]
    },
    "roteiro": [
      "Retomar a diferença entre eixo único do Flexbox e organização bidimensional do Grid.",
      "Identificar as regiões principais do dashboard antes de escrever CSS.",
      "Aplicar display: grid no contêiner principal.",
      "Definir colunas com minmax e unidades fr.",
      "Nomear as áreas e associar cada região com grid-area.",
      "Criar uma subgrade para os indicadores com repeat e minmax.",
      "Usar Flexbox apenas dentro de componentes lineares.",
      "Criar reorganização para tablet e uma coluna para celular.",
      "Testar períodos, modo compacto, tabela e ausência de sobreposição.",
      "Baixar os arquivos e enviar a pasta exercicio-08 ao repositório atividades-praticas."
    ],
    "classroom": {
      "titulo": "Exercício 08 — Dashboard com CSS Grid",
      "descricao": "# Exercício 08 — Dashboard com CSS Grid\n\n**Nesta atividade, vamos praticar a criação de um dashboard administrativo responsivo usando CSS Grid.**\n\nCrie a pasta `exercicio-08` dentro do repositório `atividades-praticas`.\n\nBaixe ou copie o `index.html` e o `script.js` de apoio. Digite, teste e compreenda o arquivo `estilo.css` apresentado na plataforma.\n\nO dashboard deve conter:\n\n- menu lateral;\n- apresentação e filtros de período;\n- grade de indicadores;\n- painel de atividade;\n- painel de próximas tarefas;\n- tabela de registros;\n- áreas nomeadas ou posicionamento coerente na grade;\n- adaptação para tablet e celular.\n\n***Neste exercício, será criado um painel administrativo com diferentes regiões organizadas por CSS Grid.***\n\nUse `display: grid`, `grid-template-columns`, `gap`, `minmax()` e posicionamento por `grid-area`, `grid-column` ou solução equivalente. Flexbox pode continuar sendo usado dentro de componentes lineares, como cabeçalhos e grupos de botões.\n\nTestes sugeridos:\n\n1. abra a página em largura de computador;\n2. teste aproximadamente 960 px, 650 px e 390 px;\n3. confirme que nenhuma região se sobrepõe;\n4. verifique que indicadores e painéis mudam de colunas de forma legível;\n5. alterne Semana, Mês e Trimestre;\n6. ative o modo compacto;\n7. confirme ausência de rolagem horizontal global.\n\nA pasta deve conter `index.html`, `estilo.css`, `script.js` e `README.md`.\n\n**Entrega: anexar o link do repositório do GitHub.**"
    },
    "professor": {
      "testes": [
        "Remover display: grid do dashboard e comparar o fluxo normal.",
        "Trocar as três colunas por duas colunas e analisar as áreas.",
        "Remover minmax e testar textos maiores.",
        "Apagar uma associação grid-area e observar a posição automática.",
        "Testar 1440 px, 960 px, 650 px e 390 px.",
        "Ativar modo compacto e adicionar tarefa simulada.",
        "Trocar cores e medidas mantendo os conceitos para testar a validação flexível.",
        "Aplicar position: absolute ao dashboard e observar o diagnóstico."
      ],
      "erros": [
        "Usar Grid nos elementos filhos, mas esquecer display: grid no contêiner principal.",
        "Definir colunas fixas que ultrapassam a largura da tela.",
        "Criar áreas no template e não atribuir grid-area às regiões.",
        "Usar position: absolute para encaixar painéis.",
        "Esquecer min-width: 0 em regiões com tabela ou conteúdo longo.",
        "Manter quatro colunas de indicadores no celular."
      ],
      "notas": [
        "A produção avaliada é o estilo.css; HTML e JavaScript são arquivos de apoio.",
        "A validação aceita áreas nomeadas ou posicionamento equivalente com grid-column/grid-row.",
        "Flexbox deve ser usado para componentes lineares, não como substituto obrigatório do Grid principal.",
        "Cores, unidades, valores e ordem das propriedades podem variar."
      ],
      "python": "# Comparação futura\n# Interfaces gráficas em Python também usam\n# gerenciadores de grade para linhas e colunas."
    },
    "permitirBase": {
      "css": false
    },
    "validacao": {
      "tipo": "css-grid",
      "gridSemantico": {
        "principal": {
          "seletores": [
            ".dashboard-grid",
            ".grade-dashboard",
            ".painel-grid",
            ".layout-dashboard"
          ],
          "exigirColunas": true,
          "exigirGap": true,
          "proibirPosicionamentoAbsoluto": true
        },
        "dimensionamentoAvancado": true,
        "posicionamentosMinimos": 4,
        "subgradesMinimas": 1,
        "mediaQueriesMinimas": 2,
        "estadosInteracao": true,
        "protecoesOverflow": true
      }
    },
    "fasePedagogica": 8,
    "apoioAutomatico": {
      "enabled": true,
      "initialAccess": false,
      "minActiveSeconds": 180,
      "minAttempts": 2,
      "minKeystrokes": 40,
      "minExecutions": 1,
      "minHints": 1,
      "requiredSignals": 3,
      "blocks": {
        "css": [
          {
            "id": "variaveis-e-tipografia-base",
            "title": "Completar variáveis e tipografia-base",
            "description": "Insere somente a identidade visual inicial. O Grid principal, as áreas, subgrades, dimensionamento e media queries continuam sendo construídos pelo aluno.",
            "reason": "tentativa prolongada",
            "mode": "append",
            "content": ":root {\n    --fundo: #07111f;\n    --superficie: #101d2f;\n    --texto: #eef6ff;\n    --texto-suave: #a9bad0;\n    --destaque: #60a5fa;\n}\n\nbody {\n    margin: 0;\n    min-height: 100vh;\n    background: var(--fundo);\n    color: var(--texto);\n    font-family: Arial, Helvetica, sans-serif;\n    line-height: 1.5;\n}"
          }
        ]
      }
    },
    "fluxoEntrega": {
      "etapas": [
        "Digite ou complete o arquivo solicitado",
        "Execute o código atual",
        "Teste o comportamento no preview",
        "Valide o arquivo",
        "Conclua a atividade",
        "Gere a evidência",
        "Baixe o ZIP e entregue no Classroom"
      ]
    },
    "referenciaCompletaPadrao": true,
    "arquivosApoio": [
      "html",
      "js"
    ],
    "tempoEstimado": "35–40 min",
    "nivel": "CSS aplicado"
  }
];
window.APP_CONFIG = {"name":"Plataforma 3DS — Programação no Desenvolvimento de Sistemas","version":"0.11.0","releasedAt":"2026-08-07T12:03:00-03:00","versionManifest":"version.json","classroomUrl":"https://classroom.google.com/","githubDefault":"https://github.com/","repositorio":"3ds-programacao-desenvolvimento-sistemas","scope":"aluno","storageNamespace":"3ds-programacao-ds","cleanHomeRelease":true,"separateActivitiesPage":true,"activityFilters":true,"hashNavigation":true,"vscodeWorkspaceRelease":true,"integratedConsole":true,"virtualTerminal":true,"executionCheckpoints":true,"behaviorScenarios":true};
