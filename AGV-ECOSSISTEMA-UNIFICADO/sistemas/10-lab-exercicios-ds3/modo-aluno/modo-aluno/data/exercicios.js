window.EXERCICIOS = [
  {
    "numero": 1,
    "studentReferenceStripped": true,
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
      "html": "<!doctype html>\n<html lang=\"pt-BR\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Atividade</title>\n</head>\n<body>\n  <main>\n    <!-- Desenvolva aqui a estrutura solicitada. -->\n  </main>\n</body>\n</html>\n",
      "css": "/* Desenvolva aqui os estilos solicitados. */\n",
      "js": "'use strict';\n// Desenvolva aqui o comportamento solicitado.\n"
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
      "enabled": false,
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
      },
      "policy": "manual-only",
      "reason": "Gabarito e solução completa ficam no Core protegido do professor."
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
    "referenciaCompletaPadrao": false,
    "arquivosApoio": [
      "css",
      "js"
    ],
    "tempoEstimado": "20–25 min",
    "nivel": "Iniciante"
  },
  {
    "numero": 2,
    "studentReferenceStripped": true,
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
      "html": "<!doctype html>\n<html lang=\"pt-BR\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Atividade</title>\n</head>\n<body>\n  <main>\n    <!-- Desenvolva aqui a estrutura solicitada. -->\n  </main>\n</body>\n</html>\n",
      "css": "/* Desenvolva aqui os estilos solicitados. */\n",
      "js": "'use strict';\n// Desenvolva aqui o comportamento solicitado.\n"
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
      "enabled": false,
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
      },
      "policy": "manual-only",
      "reason": "Gabarito e solução completa ficam no Core protegido do professor."
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
    "referenciaCompletaPadrao": false,
    "arquivosApoio": [
      "css",
      "js"
    ],
    "tempoEstimado": "25–30 min",
    "nivel": "Iniciante"
  },
  {
    "numero": 3,
    "studentReferenceStripped": true,
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
      "html": "<!doctype html>\n<html lang=\"pt-BR\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Atividade</title>\n</head>\n<body>\n  <main>\n    <!-- Desenvolva aqui a estrutura solicitada. -->\n  </main>\n</body>\n</html>\n",
      "css": "/* Desenvolva aqui os estilos solicitados. */\n",
      "js": "'use strict';\n// Desenvolva aqui o comportamento solicitado.\n"
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
      "enabled": false,
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
      },
      "policy": "manual-only",
      "reason": "Gabarito e solução completa ficam no Core protegido do professor."
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
    "referenciaCompletaPadrao": false,
    "arquivosApoio": [
      "css",
      "js"
    ],
    "tempoEstimado": "25–30 min",
    "nivel": "Iniciante"
  },
  {
    "numero": 4,
    "studentReferenceStripped": true,
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
      "html": "<!doctype html>\n<html lang=\"pt-BR\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Atividade</title>\n</head>\n<body>\n  <main>\n    <!-- Desenvolva aqui a estrutura solicitada. -->\n  </main>\n</body>\n</html>\n",
      "htmlCadastro": "<!doctype html>\n<html lang=\"pt-BR\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Atividade</title>\n</head>\n<body>\n  <main>\n    <!-- Desenvolva aqui a estrutura solicitada. -->\n  </main>\n</body>\n</html>\n",
      "htmlRelatorio": "<!doctype html>\n<html lang=\"pt-BR\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Atividade</title>\n</head>\n<body>\n  <main>\n    <!-- Desenvolva aqui a estrutura solicitada. -->\n  </main>\n</body>\n</html>\n",
      "css": "/* Desenvolva aqui os estilos solicitados. */\n",
      "js": "'use strict';\n// Desenvolva aqui o comportamento solicitado.\n",
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
      "enabled": false,
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
      },
      "policy": "manual-only",
      "reason": "Gabarito e solução completa ficam no Core protegido do professor."
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
    "referenciaCompletaPadrao": false,
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
    "studentReferenceStripped": true,
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
      "html": "<!doctype html>\n<html lang=\"pt-BR\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Atividade</title>\n</head>\n<body>\n  <main>\n    <!-- Desenvolva aqui a estrutura solicitada. -->\n  </main>\n</body>\n</html>\n",
      "css": "/* Desenvolva aqui os estilos solicitados. */\n",
      "js": "'use strict';\n// Desenvolva aqui o comportamento solicitado.\n"
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
      "blocks": {},
      "policy": "manual-only",
      "reason": "Gabarito e solução completa ficam no Core protegido do professor."
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
    "referenciaCompletaPadrao": false,
    "arquivosApoio": [
      "css",
      "js"
    ],
    "tempoEstimado": "35–40 min",
    "nivel": "Fundamentos"
  },
  {
    "numero": 6,
    "studentReferenceStripped": true,
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
      "html": "<!doctype html>\n<html lang=\"pt-BR\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Atividade</title>\n</head>\n<body>\n  <main>\n    <!-- Desenvolva aqui a estrutura solicitada. -->\n  </main>\n</body>\n</html>\n",
      "css": "/* Desenvolva aqui os estilos solicitados. */\n",
      "js": "'use strict';\n// Desenvolva aqui o comportamento solicitado.\n"
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
      "enabled": false,
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
      },
      "policy": "manual-only",
      "reason": "Gabarito e solução completa ficam no Core protegido do professor."
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
    "referenciaCompletaPadrao": false,
    "arquivosApoio": [
      "html",
      "js"
    ],
    "tempoEstimado": "30–35 min",
    "nivel": "CSS aplicado"
  },
  {
    "numero": 7,
    "studentReferenceStripped": true,
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
      "html": "<!doctype html>\n<html lang=\"pt-BR\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Atividade</title>\n</head>\n<body>\n  <main>\n    <!-- Desenvolva aqui a estrutura solicitada. -->\n  </main>\n</body>\n</html>\n",
      "css": "/* Desenvolva aqui os estilos solicitados. */\n",
      "js": "'use strict';\n// Desenvolva aqui o comportamento solicitado.\n"
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
      "enabled": false,
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
      },
      "policy": "manual-only",
      "reason": "Gabarito e solução completa ficam no Core protegido do professor."
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
    "referenciaCompletaPadrao": false,
    "arquivosApoio": [
      "html",
      "js"
    ],
    "tempoEstimado": "30–35 min",
    "nivel": "CSS aplicado"
  },
  {
    "numero": 8,
    "studentReferenceStripped": true,
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
      "html": "<!doctype html>\n<html lang=\"pt-BR\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Atividade</title>\n</head>\n<body>\n  <main>\n    <!-- Desenvolva aqui a estrutura solicitada. -->\n  </main>\n</body>\n</html>\n",
      "css": "/* Desenvolva aqui os estilos solicitados. */\n",
      "js": "'use strict';\n// Desenvolva aqui o comportamento solicitado.\n"
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
      "enabled": false,
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
      },
      "policy": "manual-only",
      "reason": "Gabarito e solução completa ficam no Core protegido do professor."
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
    "referenciaCompletaPadrao": false,
    "arquivosApoio": [
      "html",
      "js"
    ],
    "tempoEstimado": "35–40 min",
    "nivel": "CSS aplicado"
  }
];

window.APP_CONFIG = {
  "name": "Plataforma 3DS — Programação no Desenvolvimento de Sistemas",
  "version": "0.11.0",
  "releasedAt": "2026-08-07T12:03:00-03:00",
  "versionManifest": "version.json",
  "classroomUrl": "https://classroom.google.com/",
  "githubDefault": "https://github.com/",
  "repositorio": "3ds-programacao-desenvolvimento-sistemas",
  "scope": "aluno",
  "storageNamespace": "3ds-programacao-ds",
  "cleanHomeRelease": true,
  "separateActivitiesPage": true,
  "activityFilters": true,
  "hashNavigation": true,
  "vscodeWorkspaceRelease": true,
  "integratedConsole": true,
  "virtualTerminal": true,
  "executionCheckpoints": true,
  "behaviorScenarios": true
};
