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
            67
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
      "html": false,
      "css": false,
      "js": false
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
        "Leia a explicação e observe a referência",
        "Digite o arquivo manualmente no editor",
        "Execute o código atual",
        "Teste o comportamento no preview ou terminal correspondente",
        "Corrija os erros encontrados",
        "Valide o arquivo",
        "Conclua a atividade e gere a evidência",
        "Baixe o projeto, envie ao GitHub e entregue o link no Classroom"
      ]
    },
    "referenciaCompletaPadrao": false,
    "arquivosApoio": [
      "css",
      "js"
    ],
    "tempoEstimado": "20–25 min",
    "nivel": "Iniciante",
    "politicaDigitacao": {
      "modo": "manual",
      "copiarReferencia": false,
      "colarNoEditor": false,
      "autocompletar": false
    }
  },
  {
    "numero": 2,
    "studentReferenceStripped": true,
    "titulo": "Exercício 02 — Formulário Acessível: HTML de Presente + CSS + JavaScript",
    "nomeCurto": "Formulário: CSS + JS",
    "tema": "Estilização e comportamento de um formulário acessível a partir de um HTML fornecido",
    "objetivo": "Receber o HTML completo do formulário como arquivo presente e desenvolver manualmente o CSS e o JavaScript, testando aparência, responsividade e comportamento no preview.",
    "retomadas": [
      "HTML semântico e formulários",
      "label, input, select, fieldset e legend",
      "ligação entre arquivos HTML, CSS e JavaScript"
    ],
    "novos": [
      "estilização de formulário com CSS",
      "foco visível e responsividade",
      "seleção do formulário com querySelector",
      "evento submit e preventDefault",
      "console como apoio de teste"
    ],
    "pasta": "exercicio-02",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/",
    "githubUrl": "https://github.com/",
    "ordemArquivos": [
      "css",
      "js"
    ],
    "arquivos": {
      "html": "<!DOCTYPE html>\n<html lang=\"pt-BR\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <meta name=\"description\" content=\"Formulário acessível para cadastro de usuários em um sistema interno.\">\n    <title>Cadastro de Usuário | Portal DS</title>\n    <link rel=\"stylesheet\" href=\"estilo.css\">\n</head>\n<body>\n    <header>\n        <h1>Cadastro de Usuário</h1>\n        <p>Informe os dados necessários para liberar o acesso ao sistema interno.</p>\n    </header>\n\n    <main>\n        <section aria-labelledby=\"titulo-cadastro\">\n            <h2 id=\"titulo-cadastro\">Dados para acesso ao sistema</h2>\n            <p id=\"orientacao-formulario\">Todos os campos são obrigatórios.</p>\n\n            <form action=\"#\" method=\"post\" aria-describedby=\"orientacao-formulario\">\n                <fieldset>\n                    <legend>Identificação</legend>\n\n                    <div>\n                        <label for=\"nome\">Nome completo</label>\n                        <input type=\"text\" id=\"nome\" name=\"nome\" autocomplete=\"name\" required>\n                    </div>\n\n                    <div>\n                        <label for=\"email\">E-mail institucional</label>\n                        <input type=\"email\" id=\"email\" name=\"email\" autocomplete=\"email\" required>\n                    </div>\n                </fieldset>\n\n                <fieldset>\n                    <legend>Vínculo com o sistema</legend>\n\n                    <div>\n                        <label for=\"perfil\">Perfil de acesso</label>\n                        <select id=\"perfil\" name=\"perfil\" required>\n                            <option value=\"\">Selecione um perfil</option>\n                            <option value=\"aluno\">Aluno</option>\n                            <option value=\"professor\">Professor</option>\n                            <option value=\"suporte\">Suporte técnico</option>\n                        </select>\n                    </div>\n\n                    <div>\n                        <label for=\"setor\">Setor</label>\n                        <select id=\"setor\" name=\"setor\" required>\n                            <option value=\"\">Selecione um setor</option>\n                            <option value=\"desenvolvimento\">Desenvolvimento de Sistemas</option>\n                            <option value=\"laboratorio\">Laboratório de Informática</option>\n                            <option value=\"administracao\">Administração</option>\n                        </select>\n                    </div>\n                </fieldset>\n\n                <fieldset>\n                    <legend>Confirmação</legend>\n                    <div>\n                        <input type=\"checkbox\" id=\"aceite\" name=\"aceite\" required>\n                        <label for=\"aceite\">Li e concordo com as regras de uso do sistema.</label>\n                    </div>\n                </fieldset>\n\n                <div>\n                    <button type=\"submit\">Cadastrar usuário</button>\n                    <button type=\"reset\">Limpar formulário</button>\n                </div>\n            </form>\n        </section>\n    </main>\n\n    <footer>\n        <p>Projeto educacional — 3º DS · Programação no Desenvolvimento de Sistemas</p>\n    </footer>\n    <script src=\"script.js\"></script>\n</body>\n</html>\n",
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
          "titulo": "Base visual e caixa previsível",
          "linhas": [
            1,
            4
          ],
          "explicacao": "Comece definindo a fonte, as cores gerais, o fundo e box-sizing. Em seguida, organize a largura central de header, main e footer para que a página não encoste nas bordas da tela.",
          "tarefa": "Digite manualmente as linhas 1 a 4 como referência. Você pode variar cores, fonte e largura quando o resultado continuar legível e responsivo.",
          "entregavel": "A página deve ter base visual, box-sizing e uma largura central responsiva.",
          "teste": "Execute e confirme que o formulário aparece centralizado e sem estourar a largura da página."
        },
        {
          "titulo": "Seção, grupos e espaçamento",
          "linhas": [
            5,
            9
          ],
          "explicacao": "Agora estilize a área principal do formulário e os fieldsets. Padding cria espaço interno, margin separa os grupos, border delimita e border-radius suaviza os cantos.",
          "tarefa": "Digite uma solução equivalente para section, fieldset, legend e o espaçamento entre grupos. Não precisa usar exatamente os mesmos números.",
          "entregavel": "Section e fieldsets precisam estar visualmente separados e com espaçamento consistente.",
          "teste": "Confira se os três grupos do formulário ficam fáceis de distinguir."
        },
        {
          "titulo": "Rótulos, campos e foco",
          "linhas": [
            10,
            12
          ],
          "explicacao": "Os labels precisam ficar legíveis e os campos devem ocupar o espaço disponível. O estado :focus ajuda quem navega pelo teclado a identificar onde está.",
          "tarefa": "Estilize labels, inputs e selects. Mantenha foco visível; cores e medidas podem ser diferentes.",
          "entregavel": "Campos legíveis, largura adequada e foco claramente perceptível.",
          "teste": "Use Tab e Shift+Tab no preview e confirme que o foco aparece em cada controle."
        },
        {
          "titulo": "Botões e ações",
          "linhas": [
            13,
            16
          ],
          "explicacao": "Os botões recebem uma base comum e depois cores diferentes para submit e reset. O tipo do botão já veio no HTML presente; aqui você cuida apenas da apresentação.",
          "tarefa": "Crie a aparência dos botões. Você pode escolher outras cores, desde que envio e limpeza continuem fáceis de reconhecer.",
          "entregavel": "Botões utilizáveis, com bom contraste e diferença visual entre enviar e limpar.",
          "teste": "Passe o foco pelos botões e clique em Limpar formulário para conferir a ação nativa."
        },
        {
          "titulo": "Responsividade no celular",
          "linhas": [
            17,
            17
          ],
          "explicacao": "A media query adapta a largura e transforma os botões em controles largos no celular. O objetivo é evitar aperto e facilitar o toque.",
          "tarefa": "Crie uma media query para telas menores. A largura de corte e os valores podem variar.",
          "entregavel": "O formulário precisa continuar utilizável em largura de celular.",
          "teste": "Mude o preview para Celular e confirme que não existe rolagem horizontal desnecessária."
        }
      ],
      "js": [
        {
          "titulo": "Localizar o formulário",
          "linhas": [
            1,
            2
          ],
          "explicacao": "O HTML já existe. Agora o JavaScript usa document.querySelector(\"form\") para localizar o formulário no DOM e guardar essa referência em uma constante.",
          "tarefa": "Digite a seleção do formulário. O nome da constante pode ser diferente, desde que você localize o form corretamente.",
          "entregavel": "Uma referência JavaScript para o formulário existente na página.",
          "teste": "Execute e confirme que não aparece erro de elemento inexistente no console."
        },
        {
          "titulo": "Ouvir o envio",
          "linhas": [
            3,
            6
          ],
          "explicacao": "addEventListener registra uma função para o evento submit. event.preventDefault() impede o recarregamento da página durante o teste e console.info registra que o envio foi interceptado.",
          "tarefa": "Implemente um evento de submit equivalente. Você pode usar função tradicional ou arrow function.",
          "entregavel": "O envio do formulário deve ser capturado pelo JavaScript sem recarregar a página.",
          "teste": "Preencha todos os campos, marque o aceite e envie. Confira a mensagem no console."
        },
        {
          "titulo": "Mensagem de inicialização",
          "linhas": [
            7,
            7
          ],
          "explicacao": "A última mensagem no console ajuda a confirmar que script.js foi realmente carregado pelo HTML presente.",
          "tarefa": "Registre uma mensagem de inicialização no console. O texto pode ser personalizado.",
          "entregavel": "Uma mensagem que permita confirmar que o arquivo JavaScript carregou.",
          "teste": "Execute novamente e abra a aba Console para localizar sua mensagem."
        }
      ]
    },
    "roteiro": [
      "O index.html é fornecido completo como presente e já faz parte do projeto.",
      "Comece pelo estilo.css: organize base visual, grupos, campos, foco, botões e responsividade.",
      "Execute o projeto e teste o formulário em computador e celular.",
      "Depois avance para script.js e conecte um evento de submit ao formulário.",
      "Preencha os campos, envie o formulário e confira o console.",
      "Valide CSS e JavaScript, conclua a atividade e baixe o projeto completo com os três arquivos."
    ],
    "classroom": {
      "titulo": "Exercício 02 — Formulário Acessível: HTML de Presente + CSS + JavaScript",
      "descricao": "Objetivo: estilizar e adicionar comportamento básico a um formulário acessível.\n\nO arquivo `index.html` é fornecido completo pela plataforma como presente e já faz parte do projeto. Você NÃO precisa digitar nem validar o HTML.\n\nSua produção:\n1. Desenvolva `estilo.css`, mantendo o formulário legível, com foco visível e responsividade.\n2. Execute e teste no preview, inclusive em largura de celular.\n3. Desenvolva `script.js`, localizando o formulário e tratando o evento `submit`.\n4. Preencha o formulário, teste o envio e confira o Console.\n5. Valide CSS e JavaScript.\n\nEntrega: baixe o projeto completo, envie a pasta `exercicio-02` ao repositório `atividades-praticas` e anexe o link no Google Classroom.\n\nPortal da Atividade: plataforma do 3º DS — Programação no Desenvolvimento de Sistemas."
    },
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
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
        },
        "tagsExatasEstritas": [
          "main",
          "h1"
        ]
      },
      "flexibilidadeAluno": {
        "comentariosIgnorados": true,
        "espacosIndentacaoIgnorados": true,
        "textosDadosPersonalizados": true,
        "elementosExtrasValidos": true,
        "observacao": "A validação prioriza os requisitos pedagógicos e o funcionamento. Diferenças cosméticas ou comentários não impedem 100%."
      }
    },
    "fasePedagogica": 2,
    "apoioAutomatico": {
      "enabled": false,
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
        "Receba o index.html completo como presente no projeto",
        "Digite e teste o estilo.css",
        "Valide o CSS",
        "Digite e teste o script.js",
        "Preencha e envie o formulário no preview",
        "Valide o JavaScript",
        "Conclua a atividade e gere a evidência",
        "Baixe o projeto completo, envie ao GitHub e entregue o link no Classroom"
      ]
    },
    "referenciaCompletaPadrao": false,
    "arquivosApoio": [],
    "tempoEstimado": "25–35 min",
    "nivel": "Iniciante",
    "politicaDigitacao": {
      "modo": "manual-css-js",
      "copiarReferencia": false,
      "colarNoEditor": false,
      "autocompletar": false,
      "htmlPresente": true
    },
    "modeloPedagogico": {
      "tipo": "construcao-com-arquivo-presente",
      "rotulo": "HTML presente · CSS e JS manuais",
      "como": "O HTML completo já está pronto no projeto. Sua tarefa é construir o visual no CSS e depois adicionar o comportamento básico no JavaScript, digitando os dois arquivos manualmente.",
      "obrigatorio": [
        "usar o index.html fornecido pela plataforma",
        "criar uma estilização legível e responsiva em estilo.css",
        "manter foco visível para navegação por teclado",
        "adaptar a interface para telas menores",
        "localizar o formulário no JavaScript",
        "tratar o evento submit sem recarregar a página",
        "testar o formulário no preview e conferir o console"
      ],
      "variar": [
        "cores, fontes, medidas e espaçamentos do CSS",
        "breakpoint da media query",
        "nome da variável que guarda o formulário",
        "função tradicional ou arrow function para o evento",
        "texto das mensagens do console"
      ]
    },
    "situacaoProblema": "O HTML do cadastro já foi entregue pela equipe. Agora você recebeu a tarefa de transformar essa estrutura em uma interface agradável e responsiva e, depois, adicionar o primeiro comportamento JavaScript ao envio do formulário.",
    "passosDesafio": [
      "Abra o projeto: o index.html já está completo como presente.",
      "Vá direto para estilo.css e crie a apresentação visual do formulário.",
      "Teste foco, espaçamento, botões e visualização em celular.",
      "Valide o CSS e avance para script.js.",
      "No JavaScript, localize o formulário e trate o evento submit.",
      "Preencha o formulário, envie, confira o Console e valide o JS."
    ],
    "testeAntesValidar": [
      "No CSS: navegue com Tab e confira o foco visível.",
      "No CSS: teste o preview em Computador e Celular.",
      "No JS: preencha todos os campos e envie o formulário.",
      "No JS: confira se a página não recarrega e se o Console registra a ação."
    ],
    "faseConstrucao": "HTML fornecido → CSS manual → JavaScript manual",
    "arquivosPresentes": [
      "html"
    ],
    "presente": {
      "arquivo": "html",
      "titulo": "🎁 HTML de presente",
      "mensagem": "A Carla reclamou que é muita linha, pessoal 😄. Então pega esse HTML de presente completinho! O index.html já está pronto dentro do projeto. Você não precisa digitar nem validar o HTML. Vá para o CSS agora e, depois de concluir o CSS, faça o JavaScript.",
      "somenteLeitura": true,
      "foraDaValidacao": true
    },
    "validacaoPorArquivo": {
      "css": {
        "tipo": "css-semantico",
        "cssSemantico": {
          "boxSizingBorderBox": true,
          "espacamentosMinimos": 2,
          "larguraResponsiva": true,
          "mediaQueriesMinimas": 1,
          "estadosInteracao": true
        },
        "requisitosRecomendados": []
      },
      "js": {
        "tipo": "js-conceitual",
        "jsConceitual": {
          "acessosDomMinimos": 1,
          "eventosMinimos": 1
        }
      }
    }
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
          "explicacao": "O início identifica o documento, define idioma, codificação, viewport, descrição, título e a ligação com o arquivo de estilos fornecido.",
          "tarefa": "Depois de compreender esta parte, pratique digitando manualmente as linhas 1 a 10 no arquivo index.html. Não copie e cole."
        },
        {
          "titulo": "Contexto da listagem",
          "linhas": [
            11,
            21
          ],
          "explicacao": "O cabeçalho e a seção principal explicam o objetivo da tabela e deixam explícito que o status não pode depender somente de cor.",
          "tarefa": "Depois de compreender esta parte, pratique digitando manualmente as linhas 11 a 21 no arquivo index.html. Não copie e cole."
        },
        {
          "titulo": "Região rolável e legenda",
          "linhas": [
            22,
            25
          ],
          "explicacao": "A div permite rolagem horizontal dentro da própria região em telas pequenas. O caption descreve o conjunto de dados da tabela.",
          "tarefa": "Depois de compreender esta parte, pratique digitando manualmente as linhas 22 a 25 no arquivo index.html. Não copie e cole."
        },
        {
          "titulo": "Cabeçalhos das colunas",
          "linhas": [
            26,
            35
          ],
          "explicacao": "O thead reúne os títulos. Cada th usa scope=\"col\" para indicar que identifica uma coluna inteira.",
          "tarefa": "Depois de compreender esta parte, pratique digitando manualmente as linhas 26 a 35 no arquivo index.html. Não copie e cole."
        },
        {
          "titulo": "Linhas de registros",
          "linhas": [
            36,
            54
          ],
          "explicacao": "O tbody contém uma linha para cada ordem de serviço. As células seguem a mesma ordem dos cabeçalhos e os prazos usam time com datetime.",
          "tarefa": "Depois de compreender esta parte, pratique digitando manualmente as linhas 36 a 54 no arquivo index.html. Não copie e cole."
        },
        {
          "titulo": "Status textual e foco",
          "linhas": [
            55,
            67
          ],
          "explicacao": "Cada situação aparece como texto dentro da célula. As linhas podem receber foco para facilitar a leitura e a evidência de interação.",
          "tarefa": "Depois de compreender esta parte, pratique digitando manualmente as linhas 55 a 67 no arquivo index.html. Não copie e cole."
        },
        {
          "titulo": "Encerramento e script de apoio",
          "linhas": [
            68,
            74
          ],
          "explicacao": "A página termina com o rodapé e liga o script de apoio. O conteúdo principal do exercício continua sendo o HTML da tabela.",
          "tarefa": "Depois de compreender esta parte, pratique digitando manualmente as linhas 68 a 74 no arquivo index.html. Não copie e cole."
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
      "html": false,
      "css": false,
      "js": false
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
        },
        "tagsExatasEstritas": [
          "main",
          "h1"
        ]
      },
      "flexibilidadeAluno": {
        "comentariosIgnorados": true,
        "espacosIndentacaoIgnorados": true,
        "textosDadosPersonalizados": true,
        "elementosExtrasValidos": true,
        "observacao": "A validação prioriza os requisitos pedagógicos e o funcionamento. Diferenças cosméticas ou comentários não impedem 100%."
      }
    },
    "fasePedagogica": 3,
    "apoioAutomatico": {
      "enabled": false,
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
        "Leia a explicação e observe a referência",
        "Digite o arquivo manualmente no editor",
        "Execute o código atual",
        "Teste o comportamento no preview ou terminal correspondente",
        "Corrija os erros encontrados",
        "Valide o arquivo",
        "Conclua a atividade e gere a evidência",
        "Baixe o projeto, envie ao GitHub e entregue o link no Classroom"
      ]
    },
    "referenciaCompletaPadrao": false,
    "arquivosApoio": [
      "css",
      "js"
    ],
    "tempoEstimado": "25–30 min",
    "nivel": "Iniciante",
    "politicaDigitacao": {
      "modo": "manual",
      "copiarReferencia": false,
      "colarNoEditor": false,
      "autocompletar": false
    },
    "modeloPedagogico": {
      "tipo": "reproducao-guiada",
      "rotulo": "Reprodução manual guiada",
      "como": "Digite a tabela por partes: estrutura, cabeçalhos e registros. Você pode mudar os dados, desde que mantenha a semântica e a quantidade mínima exigida.",
      "obrigatorio": [
        "table com caption, thead e tbody",
        "cinco cabeçalhos th com scope=\"col\"",
        "pelo menos três registros completos",
        "cinco células por registro",
        "coluna de status com texto visível"
      ],
      "variar": [
        "dados dos registros",
        "nomes de responsáveis",
        "prazos, prioridades e textos de status"
      ]
    },
    "situacaoProblema": "A equipe de suporte precisa consultar várias ordens de serviço sem perder a relação entre código, responsável, prioridade, prazo e situação. Seu desafio é organizar esses dados em uma tabela semântica que continue compreensível no computador e no celular.",
    "passosDesafio": [
      "Crie a estrutura da página e explique o objetivo da listagem.",
      "Monte table, caption, thead e tbody.",
      "Crie cinco cabeçalhos de coluna usando th e scope=\"col\".",
      "Adicione pelo menos três registros completos, mantendo a mesma ordem das colunas.",
      "Mostre a situação em texto, execute o preview e teste a tabela também em largura de celular."
    ],
    "testeAntesValidar": [
      "Confira se cada linha possui cinco células correspondentes aos cabeçalhos.",
      "Teste o foco/clique em uma linha ou na região da tabela.",
      "Reduza a largura do preview e confirme que a rolagem acontece dentro da região da tabela."
    ],
    "faseConstrucao": "reprodução guiada em pequenos blocos"
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
          "explicacao": "O arquivo principal fica na raiz. Por isso, estilo.css é referenciado diretamente, sem ../.",
          "tarefa": "Use as linhas 1–10 como referência visual e construa este bloco manualmente no seu arquivo. Não copie e cole; você pode adaptar textos quando os requisitos forem preservados.",
          "entregavel": "Crie o início do documento com metadados, título e link para o CSS.",
          "teste": "Confira se o href do CSS aponta para um arquivo existente na mesma pasta."
        },
        {
          "titulo": "Cabeçalho e menu da raiz",
          "linhas": [
            11,
            24
          ],
          "explicacao": "No arquivo da raiz, os links para páginas internas entram na subpasta. Apenas Painel recebe aria-current.",
          "tarefa": "Use as linhas 11–24 como referência visual e construa este bloco manualmente no seu arquivo. Não copie e cole; você pode adaptar textos quando os requisitos forem preservados.",
          "entregavel": "Monte o cabeçalho e um menu com três destinos coerentes.",
          "teste": "Confira: Painel aponta para a raiz; Cadastro e Relatório entram na subpasta."
        },
        {
          "titulo": "Apresentação e ação principal",
          "linhas": [
            26,
            34
          ],
          "explicacao": "A primeira região explica o propósito do portal e cria um caminho direto para o cadastro.",
          "tarefa": "Use as linhas 26–34 como referência visual e construa este bloco manualmente no seu arquivo. Não copie e cole; você pode adaptar textos quando os requisitos forem preservados.",
          "entregavel": "Crie uma seção de apresentação com título, texto e um link funcional para a página de cadastro.",
          "teste": "Clique no link da ação principal no preview e confirme o destino."
        },
        {
          "titulo": "Atalhos para as páginas",
          "linhas": [
            36,
            57
          ],
          "explicacao": "Os artigos funcionam como atalhos. O conteúdo pode mudar, mas os links precisam continuar corretos.",
          "tarefa": "Use as linhas 36–57 como referência visual e construa este bloco manualmente no seu arquivo. Não copie e cole; você pode adaptar textos quando os requisitos forem preservados.",
          "entregavel": "Crie atalhos para pelo menos Cadastro e Relatório; personalize textos se quiser.",
          "teste": "Teste pelo menos um atalho para cada página interna."
        },
        {
          "titulo": "Fechamento e JavaScript",
          "linhas": [
            58,
            66
          ],
          "explicacao": "O documento é encerrado e script.js é carregado a partir da própria raiz.",
          "tarefa": "Use as linhas 58–66 como referência visual e construa este bloco manualmente no seu arquivo. Não copie e cole; você pode adaptar textos quando os requisitos forem preservados.",
          "entregavel": "Finalize main, rodapé e carregamento do JavaScript compartilhado.",
          "teste": "Confira se script.js usa caminho direto, sem ../."
        }
      ],
      "htmlCadastro": [
        {
          "titulo": "Documento interno e CSS compartilhado",
          "linhas": [
            1,
            10
          ],
          "explicacao": "A página está dentro de uma subpasta, então ../ volta um nível antes de localizar estilo.css.",
          "tarefa": "Use as linhas 1–10 como referência visual e construa este bloco manualmente no seu arquivo. Não copie e cole; você pode adaptar textos quando os requisitos forem preservados.",
          "entregavel": "Crie o início de cadastro.html e conecte o CSS compartilhado com caminho relativo correto.",
          "teste": "No preview, confirme que a página recebe os estilos do projeto."
        },
        {
          "titulo": "Cabeçalho e menu da página interna",
          "linhas": [
            11,
            24
          ],
          "explicacao": "Para voltar à raiz use ../. Entre arquivos da mesma subpasta, não é necessário subir um nível.",
          "tarefa": "Use as linhas 11–24 como referência visual e construa este bloco manualmente no seu arquivo. Não copie e cole; você pode adaptar textos quando os requisitos forem preservados.",
          "entregavel": "Monte o mesmo menu, marcando somente Cadastro como página atual.",
          "teste": "Teste um link que volte à raiz e outro que permaneça dentro da subpasta."
        },
        {
          "titulo": "Conteúdo e formulário",
          "linhas": [
            26,
            57
          ],
          "explicacao": "O formulário retoma conceitos anteriores, agora dentro de uma página própria do miniportal.",
          "tarefa": "Use as linhas 26–57 como referência visual e construa este bloco manualmente no seu arquivo. Não copie e cole; você pode adaptar textos quando os requisitos forem preservados.",
          "entregavel": "Crie a seção principal e um formulário com nome, e-mail, perfil e botão de envio.",
          "teste": "Use Tab para percorrer os campos e tente enviar o formulário."
        },
        {
          "titulo": "Rodapé, script e fechamento",
          "linhas": [
            58,
            66
          ],
          "explicacao": "O rodapé volta ao painel e ../script.js acessa o JavaScript compartilhado na pasta principal.",
          "tarefa": "Use as linhas 58–66 como referência visual e construa este bloco manualmente no seu arquivo. Não copie e cole; você pode adaptar textos quando os requisitos forem preservados.",
          "entregavel": "Finalize a página e conecte o JavaScript usando o caminho relativo correto.",
          "teste": "Confira se o painel Problemas não mostra CSS/JavaScript desconectado."
        }
      ],
      "htmlRelatorio": [
        {
          "titulo": "Documento e menu do relatório",
          "linhas": [
            1,
            24
          ],
          "explicacao": "A estrutura inicial repete o padrão do miniportal, mas Relatório é a página atual.",
          "tarefa": "Use as linhas 1–24 como referência visual e construa este bloco manualmente no seu arquivo. Não copie e cole; você pode adaptar textos quando os requisitos forem preservados.",
          "entregavel": "Crie o início da página e o menu, marcando somente Relatório com aria-current.",
          "teste": "Teste Painel, Cadastro e Relatório a partir desta página."
        },
        {
          "titulo": "Região de relatório",
          "linhas": [
            26,
            31
          ],
          "explicacao": "A seção apresenta o contexto e explica por que ../ é necessário dentro da subpasta.",
          "tarefa": "Use as linhas 26–31 como referência visual e construa este bloco manualmente no seu arquivo. Não copie e cole; você pode adaptar textos quando os requisitos forem preservados.",
          "entregavel": "Crie a região principal com título e uma explicação curta sobre o relatório.",
          "teste": "Confira se a hierarquia de títulos continua coerente."
        },
        {
          "titulo": "Estrutura da tabela",
          "linhas": [
            32,
            42
          ],
          "explicacao": "A tabela começa com região rolável, caption, thead e quatro cabeçalhos de coluna.",
          "tarefa": "Use as linhas 32–42 como referência visual e construa este bloco manualmente no seu arquivo. Não copie e cole; você pode adaptar textos quando os requisitos forem preservados.",
          "entregavel": "Monte a estrutura da tabela e seus cabeçalhos antes de adicionar os registros.",
          "teste": "Confira se cada th possui scope=\"col\"."
        },
        {
          "titulo": "Registros e fechamento da tabela",
          "linhas": [
            43,
            64
          ],
          "explicacao": "O tbody recebe os registros. Os dados podem mudar, desde que as quatro colunas e o status textual sejam preservados.",
          "tarefa": "Use as linhas 43–64 como referência visual e construa este bloco manualmente no seu arquivo. Não copie e cole; você pode adaptar textos quando os requisitos forem preservados.",
          "entregavel": "Adicione pelo menos três registros completos e encerre tabela, região e seção.",
          "teste": "Confira se cada linha possui quatro células e um status visível em texto."
        },
        {
          "titulo": "Rodapé, script e fechamento",
          "linhas": [
            65,
            74
          ],
          "explicacao": "A página retorna ao painel e carrega o JavaScript compartilhado com ../script.js.",
          "tarefa": "Use as linhas 65–74 como referência visual e construa este bloco manualmente no seu arquivo. Não copie e cole; você pode adaptar textos quando os requisitos forem preservados.",
          "entregavel": "Finalize o documento e conecte o recurso compartilhado.",
          "teste": "Execute a página novamente e confira o painel Problemas."
        }
      ],
      "css": [
        {
          "titulo": "Identidade compartilhada",
          "linhas": [
            1,
            80
          ],
          "explicacao": "Um único arquivo CSS mantém cabeçalho, menu e painéis consistentes nas três páginas.",
          "tarefa": "Depois de compreender esta parte, pratique digitando manualmente as linhas 1 a 80 no arquivo estilo.css. Não copie e cole."
        },
        {
          "titulo": "Formulário, tabela e responsividade",
          "linhas": [
            81,
            180
          ],
          "explicacao": "O mesmo CSS atende componentes diferentes e reorganiza o layout em telas menores.",
          "tarefa": "Depois de compreender esta parte, pratique digitando manualmente as linhas 81 a 180 no arquivo estilo.css. Não copie e cole."
        }
      ],
      "js": [
        {
          "titulo": "Script compartilhado",
          "linhas": [
            1,
            11
          ],
          "explicacao": "O optional chaining permite que o mesmo script funcione nas páginas com e sem formulário.",
          "tarefa": "Depois de compreender esta parte, pratique digitando manualmente as linhas 1 a 11 no arquivo script.js. Não copie e cole."
        }
      ]
    },
    "roteiro": [
      "Apresentar a estrutura de pastas antes de escrever os links.",
      "Criar a página principal na raiz e duas páginas HTML dentro de uma subpasta.",
      "Comparar caminhos usados na raiz com caminhos usados dentro da subpasta.",
      "Construir o mesmo menu nas três páginas e usar aria-current somente na página aberta.",
      "Conectar estilo.css e script.js compartilhados usando caminhos adequados.",
      "Executar localmente, visitar todos os links e confirmar que nenhuma página depende de caminho do computador.",
      "Validar os três arquivos HTML produzidos pelo aluno; CSS, JavaScript e README permanecem como arquivos de apoio no ZIP.",
      "Subir a pasta do exercício no repositório atividades-praticas e anexar o link no Classroom."
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
      "js": false,
      "readme": false
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
          },
          "tagsExatasEstritas": [
            "main",
            "h1"
          ]
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
          },
          "tagsExatasEstritas": [
            "main",
            "h1"
          ]
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
          },
          "tagsExatasEstritas": [
            "main",
            "h1"
          ]
        }
      },
      "flexibilidadeAluno": {
        "comentariosIgnorados": true,
        "espacosIndentacaoIgnorados": true,
        "textosDadosPersonalizados": true,
        "elementosExtrasValidos": true,
        "observacao": "A validação prioriza os requisitos pedagógicos e o funcionamento. Diferenças cosméticas ou comentários não impedem 100%."
      }
    },
    "fasePedagogica": 4,
    "apoioAutomatico": {
      "enabled": false,
      "policy": "manual-only",
      "reason": "Gabarito e solução completa ficam no Core protegido do professor."
    },
    "fluxoEntrega": {
      "etapas": [
        "Leia a explicação e observe a referência",
        "Digite o arquivo manualmente no editor",
        "Execute o código atual",
        "Teste o comportamento no preview ou terminal correspondente",
        "Corrija os erros encontrados",
        "Valide o arquivo",
        "Conclua a atividade e gere a evidência",
        "Baixe o projeto, envie ao GitHub e entregue o link no Classroom"
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
    "nivel": "Fundamentos",
    "politicaDigitacao": {
      "modo": "manual",
      "copiarReferencia": false,
      "colarNoEditor": false,
      "autocompletar": false
    },
    "modeloPedagogico": {
      "tipo": "construcao-guiada",
      "rotulo": "Construção guiada por arquivos",
      "como": "Construa o miniportal um arquivo por vez. A referência mostra uma solução funcional, mas você não precisa reproduzir todas as linhas exatamente: o objetivo é criar três páginas conectadas por caminhos relativos corretos.",
      "obrigatorio": [
        "três páginas HTML conectadas entre si",
        "uma página principal na raiz e duas páginas em uma subpasta",
        "menu consistente nas três páginas",
        "caminhos relativos corretos em links, CSS e JavaScript",
        "um único link marcado com aria-current=\"page\" em cada página",
        "nenhum caminho absoluto do computador"
      ],
      "variar": [
        "textos, títulos e conteúdo interno das páginas",
        "nomes dos arquivos e da subpasta, se todos os caminhos forem atualizados",
        "registros, opções e conteúdo do formulário/tabela",
        "organização textual que preserve navegação e semântica"
      ]
    },
    "situacaoProblema": "Um sistema cresceu e agora precisa separar painel, cadastro e relatório em páginas diferentes. Seu trabalho é organizar o projeto em pastas e garantir que todos os links e recursos continuem funcionando quando a pasta for movida ou publicada no GitHub Pages.",
    "passosDesafio": [
      "Planeje a estrutura do projeto: uma página principal, uma subpasta e duas páginas internas.",
      "Construa a página principal e crie o menu com links para as páginas internas.",
      "Construa a página de cadastro e use ../ somente quando precisar voltar à pasta principal.",
      "Construa a página de relatório e mantenha o mesmo menu, marcando a página atual.",
      "Confira as conexões com estilo.css e script.js em cada nível da pasta.",
      "Execute as três páginas, teste a ida e a volta entre elas e só então valide os três HTMLs."
    ],
    "testeAntesValidar": [
      "Abra index.html e navegue para Cadastro e Relatório pelo preview.",
      "Em uma página dentro da subpasta, teste um link que volte para a página principal.",
      "Confirme que CSS e JavaScript continuam conectados nas três páginas.",
      "Se renomeou algum arquivo ou pasta, confirme que não existe caminho quebrado no painel Problemas."
    ],
    "faseConstrucao": "construção guiada por regiões/arquivos",
    "projetoGuiado": {
      "produto": "Miniportal com três páginas navegáveis e estrutura de pastas portátil.",
      "arquivosAluno": [
        "index.html — página principal e ponto de entrada do projeto",
        "paginas/cadastro.html — página interna com formulário",
        "paginas/relatorio.html — página interna com tabela"
      ],
      "arquivosApoio": [
        "estilo.css — aparência compartilhada; já faz parte do projeto",
        "script.js — comportamento compartilhado; já faz parte do projeto",
        "README.md — explica a estrutura e os caminhos relativos"
      ],
      "marcos": [
        "Marco 1: estrutura de pastas criada e página principal funcionando.",
        "Marco 2: Cadastro abre pela página principal e consegue voltar.",
        "Marco 3: Relatório abre pela página principal e consegue voltar.",
        "Marco 4: as três páginas mantêm menu, CSS e JavaScript conectados.",
        "Marco 5: os três arquivos HTML foram executados e validados."
      ]
    }
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
          "titulo": "Documento e recursos",
          "linhas": [
            1,
            10
          ],
          "explicacao": "O início do documento configura idioma, codificação, viewport, título e CSS.",
          "tarefa": "Observe as linhas 1–10 da referência e construa uma região equivalente no seu index.html. Não precisa reproduzir textos ou valores exatamente; preserve os requisitos desta etapa.",
          "entregavel": "Crie a base do documento e conecte estilo.css.",
          "teste": "Execute e confira se a página abre sem erro de recurso."
        },
        {
          "titulo": "Cabeçalho e navegação interna",
          "linhas": [
            11,
            25
          ],
          "explicacao": "Os links usam # para navegar para regiões da mesma página. Cada href deve corresponder a um id existente.",
          "tarefa": "Observe as linhas 11–25 da referência e construa uma região equivalente no seu index.html. Não precisa reproduzir textos ou valores exatamente; preserve os requisitos desta etapa.",
          "entregavel": "Crie o cabeçalho e links para as quatro regiões do painel.",
          "teste": "Clique nos quatro links e confirme os destinos."
        },
        {
          "titulo": "Visão geral",
          "linhas": [
            27,
            35
          ],
          "explicacao": "A apresentação informa o objetivo da tela e oferece uma ação direta para o formulário.",
          "tarefa": "Observe as linhas 27–35 da referência e construa uma região equivalente no seu index.html. Não precisa reproduzir textos ou valores exatamente; preserve os requisitos desta etapa.",
          "entregavel": "Crie a região de apresentação com um h2 e um link para o formulário.",
          "teste": "Teste o link da ação principal."
        },
        {
          "titulo": "Indicadores em articles",
          "linhas": [
            37,
            68
          ],
          "explicacao": "Cada indicador é uma unidade independente com título, valor e explicação. Os textos e números podem ser personalizados.",
          "tarefa": "Observe as linhas 37–68 da referência e construa uma região equivalente no seu index.html. Não precisa reproduzir textos ou valores exatamente; preserve os requisitos desta etapa.",
          "entregavel": "Crie quatro articles com indicadores próprios.",
          "teste": "Conte os articles e confira se cada um possui um título compreensível."
        },
        {
          "titulo": "Formulário acessível",
          "linhas": [
            70,
            110
          ],
          "explicacao": "O formulário combina labels, ids, names, required, autocomplete, select, fieldset, legend e botões.",
          "tarefa": "Observe as linhas 70–110 da referência e construa uma região equivalente no seu index.html. Não precisa reproduzir textos ou valores exatamente; preserve os requisitos desta etapa.",
          "entregavel": "Construa o formulário completo; personalize opções sem perder os requisitos de acessibilidade.",
          "teste": "Percorra com Tab, preencha os campos obrigatórios e envie."
        },
        {
          "titulo": "Estrutura da tabela",
          "linhas": [
            112,
            130
          ],
          "explicacao": "Antes dos registros, monte a região rolável, caption, thead e cinco cabeçalhos com scope=\"col\".",
          "tarefa": "Observe as linhas 112–130 da referência e construa uma região equivalente no seu index.html. Não precisa reproduzir textos ou valores exatamente; preserve os requisitos desta etapa.",
          "entregavel": "Crie a estrutura da tabela e seus cinco cabeçalhos.",
          "teste": "Confira se caption e scope=\"col\" estão presentes."
        },
        {
          "titulo": "Registros da tabela",
          "linhas": [
            131,
            155
          ],
          "explicacao": "O tbody deve possuir pelo menos três linhas completas. Os dados podem ser totalmente diferentes da referência.",
          "tarefa": "Observe as linhas 131–155 da referência e construa uma região equivalente no seu index.html. Não precisa reproduzir textos ou valores exatamente; preserve os requisitos desta etapa.",
          "entregavel": "Adicione três ou mais registros com cinco células e status textual.",
          "teste": "Confira se todas as linhas possuem a mesma quantidade de células."
        },
        {
          "titulo": "Fechamento e teste final",
          "linhas": [
            156,
            165
          ],
          "explicacao": "O documento termina com rodapé e JavaScript de apoio. Depois disso, o foco passa a ser testar o sistema, não copiar mais código.",
          "tarefa": "Observe as linhas 156–165 da referência e construa uma região equivalente no seu index.html. Não precisa reproduzir textos ou valores exatamente; preserve os requisitos desta etapa.",
          "entregavel": "Finalize a página e conecte script.js.",
          "teste": "Execute novamente, envie o formulário e só então valide o index.html."
        }
      ]
    },
    "roteiro": [
      "Apresentar o painel como integração de componentes já estudados, não como 165 linhas para decorar.",
      "Planejar quatro regiões: visão geral, indicadores, novo registro e registros.",
      "Construir cabeçalho e navegação interna, conferindo se cada href corresponde a um id existente.",
      "Criar os quatro indicadores usando article e conteúdo próprio.",
      "Construir o formulário acessível e testar foco, campos obrigatórios e envio.",
      "Construir a tabela acessível e usar dados próprios mantendo cinco colunas e status textual.",
      "Executar o preview, testar as interações obrigatórias e validar somente o index.html produzido pelo aluno.",
      "Subir a pasta do exercício no repositório atividades-praticas e entregar o link no Classroom."
    ],
    "classroom": {
      "titulo": "Exercício 05 — Protótipo HTML de Painel Administrativo",
      "descricao": "Objetivo: combinar navegação, indicadores, formulário e tabela em um painel administrativo semântico.\n\nOrientações:\nCrie a pasta `exercicio-05` no repositório `atividades-praticas`.\nDigite o arquivo `index.html` apresentado na plataforma.\nOrganize a página em cabeçalho, navegação, conteúdo principal e rodapé.\nCrie links internos para visão geral, indicadores, novo registro e registros.\nInclua pelo menos quatro indicadores usando `article`.\nAdicione um formulário acessível com rótulos associados, campos obrigatórios, `name`, `autocomplete`, `fieldset` e `legend`.\nCrie uma tabela com `caption`, `thead`, `tbody`, `th scope=\"col\"` e pelo menos três registros.\nEscreva os status em texto visível.\nTeste a ordem de leitura, o teclado e a visualização em celular.\nValide o HTML antes da entrega.\n\nEntrega: anexe no Google Classroom o link do repositório com a pasta `exercicio-05`.\n\nPortal da Atividade: plataforma do 3º DS — Programação no Desenvolvimento de Sistemas."
    },
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
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
        },
        "tagsExatasEstritas": [
          "main",
          "h1"
        ]
      },
      "flexibilidadeAluno": {
        "comentariosIgnorados": true,
        "espacosIndentacaoIgnorados": true,
        "textosDadosPersonalizados": true,
        "elementosExtrasValidos": true,
        "observacao": "A validação prioriza os requisitos pedagógicos e o funcionamento. Diferenças cosméticas ou comentários não impedem 100%."
      }
    },
    "fasePedagogica": 5,
    "apoioAutomatico": {
      "enabled": false,
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
        "Leia a explicação e observe a referência",
        "Digite o arquivo manualmente no editor",
        "Execute o código atual",
        "Teste o comportamento no preview ou terminal correspondente",
        "Corrija os erros encontrados",
        "Valide o arquivo",
        "Conclua a atividade e gere a evidência",
        "Baixe o projeto, envie ao GitHub e entregue o link no Classroom"
      ]
    },
    "referenciaCompletaPadrao": false,
    "arquivosApoio": [
      "css",
      "js"
    ],
    "tempoEstimado": "35–40 min",
    "nivel": "Fundamentos",
    "politicaDigitacao": {
      "modo": "manual",
      "copiarReferencia": false,
      "colarNoEditor": false,
      "autocompletar": false
    },
    "modeloPedagogico": {
      "tipo": "construcao-guiada",
      "rotulo": "Construção guiada por regiões",
      "como": "Construa o painel por regiões funcionais. A referência possui 165 linhas, mas não é necessário reproduzi-la linha por linha: sua solução pode ser menor ou diferente se cumprir os requisitos semânticos, de acessibilidade e de comportamento.",
      "obrigatorio": [
        "cabeçalho e navegação interna para as regiões do painel",
        "uma região de apresentação/visão geral",
        "quatro indicadores representados por article",
        "formulário acessível com rótulos, campos obrigatórios e prioridade",
        "tabela acessível com pelo menos três registros e cinco colunas",
        "status apresentados em texto, sem depender apenas de cor"
      ],
      "variar": [
        "textos, números, usuários e registros",
        "nomes e valores dos indicadores",
        "ids e nomes de campos quando as relações label/for, href/id e name continuarem corretas",
        "quantidade de conteúdo adicional e ordem interna que mantenha a semântica e a navegação"
      ]
    },
    "situacaoProblema": "A coordenação precisa de uma tela administrativa única para consultar indicadores, registrar uma solicitação e acompanhar registros recentes. Seu desafio é integrar componentes que você já conhece em uma estrutura semântica coerente, sem precisar copiar exatamente o painel de referência.",
    "passosDesafio": [
      "Planeje as quatro regiões: visão geral, indicadores, novo registro e registros.",
      "Crie o cabeçalho e faça a navegação interna apontar para ids existentes.",
      "Monte quatro indicadores com article, título, valor e explicação.",
      "Construa o formulário com labels associados, campos obrigatórios, select, prioridade e botões.",
      "Construa a tabela com caption, cabeçalhos, três registros e status textuais.",
      "Execute a página, teste os links, preencha/envie o formulário e confira a tabela antes de validar."
    ],
    "testeAntesValidar": [
      "Clique em todos os links do menu e confira se cada um leva à região correta.",
      "Percorra o formulário com teclado, preencha os campos e envie com dados válidos.",
      "Confira se a tabela possui cinco cabeçalhos e pelo menos três linhas completas.",
      "Altere textos, valores ou registros e confirme que o validador continua aceitando uma solução semanticamente equivalente."
    ],
    "faseConstrucao": "construção guiada por regiões/arquivos",
    "projetoGuiado": {
      "produto": "Painel administrativo semântico com indicadores, formulário e tabela funcionando em uma única página.",
      "arquivosAluno": [
        "index.html — arquivo principal que o aluno constrói e valida"
      ],
      "arquivosApoio": [
        "estilo.css — aparência do painel",
        "script.js — comportamento do formulário"
      ],
      "marcos": [
        "Marco 1: cabeçalho, navegação e visão geral prontos.",
        "Marco 2: quatro indicadores estruturados como articles.",
        "Marco 3: formulário acessível preenchível e enviável.",
        "Marco 4: tabela acessível com três registros completos.",
        "Marco 5: navegação, formulário e tabela testados; index.html validado."
      ]
    }
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
          "explicacao": "O seletor universal inclui os pseudoelementos e faz padding e border participarem das dimensões definidas.",
          "tarefa": "Use as linhas 1 a 7 como referência do conceito. Implemente manualmente uma solução equivalente em estilo.css; cores, medidas e organização podem variar quando o comportamento continuar correto."
        },
        {
          "titulo": "Variáveis e base da página",
          "linhas": [
            8,
            33
          ],
          "explicacao": "As variáveis centralizam decisões visuais; body remove a margem padrão e cria uma base que ocupa a tela sem largura mínima indevida.",
          "tarefa": "Use as linhas 8 a 33 como referência do conceito. Implemente manualmente uma solução equivalente em estilo.css; cores, medidas e organização podem variar quando o comportamento continuar correto."
        },
        {
          "titulo": "Contêiner e espaços externos",
          "linhas": [
            35,
            109
          ],
          "explicacao": "A largura do painel combina porcentagem e limite máximo. Padding, margin e gap organizam o fluxo geral.",
          "tarefa": "Use as linhas 35 a 109 como referência do conceito. Implemente manualmente uma solução equivalente em estilo.css; cores, medidas e organização podem variar quando o comportamento continuar correto."
        },
        {
          "titulo": "Grade flexível com gap",
          "linhas": [
            110,
            117
          ],
          "explicacao": "A grade usa auto-fit e minmax para distribuir os cards. O gap cria distância uniforme sem depender de margens laterais.",
          "tarefa": "Use as linhas 110 a 117 como referência do conceito. Implemente manualmente uma solução equivalente em estilo.css; cores, medidas e organização podem variar quando o comportamento continuar correto."
        },
        {
          "titulo": "Box Model de cada card",
          "linhas": [
            118,
            138
          ],
          "explicacao": "Cada card reúne min-width, padding, border, border-radius, background e overflow-wrap para manter o conteúdo dentro da caixa.",
          "tarefa": "Use as linhas 118 a 138 como referência do conceito. Implemente manualmente uma solução equivalente em estilo.css; cores, medidas e organização podem variar quando o comportamento continuar correto."
        },
        {
          "titulo": "Estados e elementos internos",
          "linhas": [
            140,
            177
          ],
          "explicacao": "Hover, foco e seleção fornecem retorno visual; os elementos internos usam margin e dimensões próprias.",
          "tarefa": "Use as linhas 140 a 177 como referência do conceito. Implemente manualmente uma solução equivalente em estilo.css; cores, medidas e organização podem variar quando o comportamento continuar correto."
        },
        {
          "titulo": "Representação e modo compacto",
          "linhas": [
            179,
            241
          ],
          "explicacao": "A demonstração mostra as camadas do Box Model e o modo compacto altera gap e padding sem reescrever o HTML.",
          "tarefa": "Use as linhas 179 a 241 como referência do conceito. Implemente manualmente uma solução equivalente em estilo.css; cores, medidas e organização podem variar quando o comportamento continuar correto."
        },
        {
          "titulo": "Adaptação para telas menores",
          "linhas": [
            242,
            260
          ],
          "explicacao": "A media query reorganiza cabeçalho, seções e rodapé em uma coluna e mantém o botão dentro da largura disponível.",
          "tarefa": "Use as linhas 242 a 260 como referência do conceito. Implemente manualmente uma solução equivalente em estilo.css; cores, medidas e organização podem variar quando o comportamento continuar correto."
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
      "html": false,
      "css": false,
      "js": false
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
      },
      "requisitosRecomendados": [
        "cardOverflow",
        "interaction"
      ],
      "flexibilidadeAluno": {
        "comentariosIgnorados": true,
        "espacosIndentacaoIgnorados": true,
        "textosDadosPersonalizados": true,
        "elementosExtrasValidos": true,
        "observacao": "A validação prioriza os requisitos pedagógicos e o funcionamento. Diferenças cosméticas ou comentários não impedem 100%."
      }
    },
    "fasePedagogica": 6,
    "apoioAutomatico": {
      "enabled": false,
      "policy": "manual-only",
      "reason": "Gabarito e solução completa ficam no Core protegido do professor."
    },
    "fluxoEntrega": {
      "etapas": [
        "Leia a explicação e observe a referência",
        "Digite o arquivo manualmente no editor",
        "Execute o código atual",
        "Teste o comportamento no preview ou terminal correspondente",
        "Corrija os erros encontrados",
        "Valide o arquivo",
        "Conclua a atividade e gere a evidência",
        "Baixe o projeto, envie ao GitHub e entregue o link no Classroom"
      ]
    },
    "referenciaCompletaPadrao": false,
    "arquivosApoio": [
      "html",
      "js"
    ],
    "tempoEstimado": "30–35 min",
    "nivel": "CSS aplicado",
    "politicaDigitacao": {
      "modo": "manual",
      "copiarReferencia": false,
      "colarNoEditor": false,
      "autocompletar": false
    },
    "modeloPedagogico": {
      "tipo": "pratica-conceitual",
      "rotulo": "Prática conceitual guiada",
      "como": "A referência é uma solução possível. Digite por blocos, mas entenda que o validador procura os conceitos de Box Model e responsividade, não cores ou medidas idênticas.",
      "obrigatorio": [
        "box-sizing: border-box",
        "layout dos cards com Grid ou Flexbox e gap",
        "padding, border, border-radius e background nos cards",
        "proteção contra conteúdo longo",
        "largura responsiva",
        "pelo menos uma media query",
        "estado de interação visível"
      ],
      "variar": [
        "cores",
        "unidades e medidas",
        "ordem das propriedades",
        "Grid ou Flexbox para distribuir os cards",
        "valores de espaçamento que mantenham o layout funcional"
      ]
    },
    "situacaoProblema": "Os cards do painel estão visualmente apertados e precisam se adaptar a diferentes telas. Seu desafio é aplicar Box Model e um layout flexível sem copiar exatamente as medidas ou cores da referência.",
    "passosDesafio": [
      "Aplique box-sizing para controlar o tamanho dos elementos.",
      "Distribua os cards com Grid ou Flexbox e use gap.",
      "Defina padding, border, border-radius e background nos cards.",
      "Proteja textos longos e mantenha largura responsiva.",
      "Crie uma media query e um estado visual de interação.",
      "Execute e compare computador e celular antes de validar."
    ],
    "testeAntesValidar": [
      "Troque algumas medidas ou cores e confirme que o layout continua funcional.",
      "Teste um texto longo dentro de um card.",
      "Confira o preview em largura pequena sem overflow global."
    ],
    "faseConstrucao": "desafio conceitual por requisitos"
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
          "explicacao": "Comece com box-sizing, variáveis visuais, fundo, tipografia e largura-base. Essas regras preparam o projeto antes do Flexbox principal.",
          "tarefa": "Use as linhas 1 a 50 como referência do conceito. Implemente manualmente uma solução equivalente em estilo.css; cores, medidas e organização podem variar quando o comportamento continuar correto."
        },
        {
          "titulo": "Cabeçalho com Flexbox",
          "linhas": [
            51,
            60
          ],
          "explicacao": "O cabeçalho usa display:flex, distribuição, alinhamento, quebra e gap para organizar marca, navegação e perfil.",
          "tarefa": "Use as linhas 51 a 60 como referência do conceito. Implemente manualmente uma solução equivalente em estilo.css; cores, medidas e organização podem variar quando o comportamento continuar correto."
        },
        {
          "titulo": "Marca, navegação e perfil",
          "linhas": [
            62,
            140
          ],
          "explicacao": "Os grupos internos também usam Flexbox e áreas de toque adequadas. Observe como os elementos podem quebrar sem sobreposição.",
          "tarefa": "Use as linhas 62 a 140 como referência do conceito. Implemente manualmente uma solução equivalente em estilo.css; cores, medidas e organização podem variar quando o comportamento continuar correto."
        },
        {
          "titulo": "Apresentação e resumo",
          "linhas": [
            141,
            207
          ],
          "explicacao": "A área de apresentação organiza título, texto e resumo com Flexbox, mantendo min-width e espaçamentos responsivos.",
          "tarefa": "Use as linhas 141 a 207 como referência do conceito. Implemente manualmente uma solução equivalente em estilo.css; cores, medidas e organização podem variar quando o comportamento continuar correto."
        },
        {
          "titulo": "Barra de ferramentas",
          "linhas": [
            208,
            231
          ],
          "explicacao": "Aqui está o núcleo da atividade: a barra usa display:flex, justify-content, align-items, flex-wrap e gap.",
          "tarefa": "Use as linhas 208 a 231 como referência do conceito. Implemente manualmente uma solução equivalente em estilo.css; cores, medidas e organização podem variar quando o comportamento continuar correto."
        },
        {
          "titulo": "Busca e grupo de ações",
          "linhas": [
            232,
            291
          ],
          "explicacao": "Busca, filtros e ação principal formam grupos flexíveis com flex-grow/flex-basis, foco visível e área de toque.",
          "tarefa": "Use as linhas 232 a 291 como referência do conceito. Implemente manualmente uma solução equivalente em estilo.css; cores, medidas e organização podem variar quando o comportamento continuar correto."
        },
        {
          "titulo": "Cards, orientação e rodapé",
          "linhas": [
            292,
            376
          ],
          "explicacao": "O restante da interface demonstra como combinar Flexbox com Grid sem usar posicionamento absoluto para montar a barra.",
          "tarefa": "Use as linhas 292 a 376 como referência do conceito. Implemente manualmente uma solução equivalente em estilo.css; cores, medidas e organização podem variar quando o comportamento continuar correto."
        },
        {
          "titulo": "Adaptação mobile",
          "linhas": [
            377,
            405
          ],
          "explicacao": "A media query reorganiza os grupos em telas menores e mantém controles acessíveis sem rolagem horizontal global.",
          "tarefa": "Use as linhas 377 a 405 como referência do conceito. Implemente manualmente uma solução equivalente em estilo.css; cores, medidas e organização podem variar quando o comportamento continuar correto."
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
      "html": false,
      "css": false,
      "js": false
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
      },
      "requisitosRecomendados": [
        "touchArea",
        "interaction"
      ],
      "flexibilidadeAluno": {
        "comentariosIgnorados": true,
        "espacosIndentacaoIgnorados": true,
        "textosDadosPersonalizados": true,
        "elementosExtrasValidos": true,
        "observacao": "A validação prioriza os requisitos pedagógicos e o funcionamento. Diferenças cosméticas ou comentários não impedem 100%."
      }
    },
    "fasePedagogica": 7,
    "apoioAutomatico": {
      "enabled": false,
      "policy": "manual-only",
      "reason": "Gabarito e solução completa ficam no Core protegido do professor."
    },
    "fluxoEntrega": {
      "etapas": [
        "Leia a explicação e observe a referência",
        "Digite o arquivo manualmente no editor",
        "Execute o código atual",
        "Teste o comportamento no preview ou terminal correspondente",
        "Corrija os erros encontrados",
        "Valide o arquivo",
        "Conclua a atividade e gere a evidência",
        "Baixe o projeto, envie ao GitHub e entregue o link no Classroom"
      ]
    },
    "referenciaCompletaPadrao": false,
    "arquivosApoio": [
      "html",
      "js"
    ],
    "tempoEstimado": "30–35 min",
    "nivel": "CSS aplicado",
    "politicaDigitacao": {
      "modo": "manual",
      "copiarReferencia": false,
      "colarNoEditor": false,
      "autocompletar": false
    },
    "modeloPedagogico": {
      "tipo": "pratica-conceitual",
      "rotulo": "Prática conceitual guiada",
      "como": "Use a referência para compreender Flexbox, mas você não precisa copiar valores visuais. O que importa é a barra distribuir, alinhar, quebrar e permanecer acessível.",
      "obrigatorio": [
        "display:flex na barra principal",
        "justify-content e align-items",
        "flex-wrap e gap",
        "grupos flexíveis para busca e ações",
        "crescimento ou base flexível",
        "controles acessíveis",
        "media query",
        "estado de foco/hover",
        "sem position:absolute para montar a barra"
      ],
      "variar": [
        "cores e tamanhos",
        "unidades",
        "ordem das regras",
        "valores de flex-basis/flex-grow",
        "detalhes visuais que não prejudiquem o comportamento"
      ]
    },
    "situacaoProblema": "Uma barra de ferramentas precisa acomodar busca, filtros e ações sem quebrar quando a tela fica estreita. Seu desafio é resolver a organização usando Flexbox e permitir que os elementos se reorganizem naturalmente.",
    "passosDesafio": [
      "Transforme a barra principal em um contêiner flexível.",
      "Configure distribuição, alinhamento, quebra e espaçamento.",
      "Organize busca e ações em grupos flexíveis.",
      "Defina crescimento/base flexível para evitar esmagamento.",
      "Crie estados de foco/hover e uma media query.",
      "Execute, pesquise um módulo, use um filtro e teste em tela estreita."
    ],
    "testeAntesValidar": [
      "Reduza o preview e observe a quebra controlada.",
      "Digite na busca e confirme que o campo continua utilizável.",
      "Use um filtro e confira o estado visual de foco/ativo."
    ],
    "faseConstrucao": "desafio conceitual por requisitos"
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
          "explicacao": "A base usa border-box, variáveis e limites de largura para evitar dimensões imprevisíveis.",
          "tarefa": "Use as linhas 1 a 42 como referência do conceito. Implemente manualmente uma solução equivalente em estilo.css; cores, medidas e organização podem variar quando o comportamento continuar correto."
        },
        {
          "titulo": "Flexbox dentro dos componentes",
          "linhas": [
            43,
            88
          ],
          "explicacao": "Cabeçalhos, marca e botões continuam lineares e são organizados com Flexbox.",
          "tarefa": "Use as linhas 43 a 88 como referência do conceito. Implemente manualmente uma solução equivalente em estilo.css; cores, medidas e organização podem variar quando o comportamento continuar correto."
        },
        {
          "titulo": "Grade principal e áreas",
          "linhas": [
            89,
            151
          ],
          "explicacao": "O dashboard usa três colunas, áreas nomeadas e minmax para distribuir as regiões.",
          "tarefa": "Use as linhas 89 a 151 como referência do conceito. Implemente manualmente uma solução equivalente em estilo.css; cores, medidas e organização podem variar quando o comportamento continuar correto."
        },
        {
          "titulo": "Subgrade de indicadores",
          "linhas": [
            152,
            162
          ],
          "explicacao": "Os quatro indicadores formam outra grade independente dentro da grade principal.",
          "tarefa": "Use as linhas 152 a 162 como referência do conceito. Implemente manualmente uma solução equivalente em estilo.css; cores, medidas e organização podem variar quando o comportamento continuar correto."
        },
        {
          "titulo": "Painéis, gráfico e tabela",
          "linhas": [
            163,
            214
          ],
          "explicacao": "Cada painel controla sua própria estrutura sem alterar o posicionamento global.",
          "tarefa": "Use as linhas 163 a 214 como referência do conceito. Implemente manualmente uma solução equivalente em estilo.css; cores, medidas e organização podem variar quando o comportamento continuar correto."
        },
        {
          "titulo": "Modo compacto",
          "linhas": [
            215,
            227
          ],
          "explicacao": "A mudança de densidade comprova que a grade permanece estável com espaçamentos diferentes.",
          "tarefa": "Use as linhas 215 a 227 como referência do conceito. Implemente manualmente uma solução equivalente em estilo.css; cores, medidas e organização podem variar quando o comportamento continuar correto."
        },
        {
          "titulo": "Adaptação para tablet",
          "linhas": [
            228,
            244
          ],
          "explicacao": "A primeira media query reorganiza o painel em duas colunas e transforma o menu em faixa horizontal.",
          "tarefa": "Use as linhas 228 a 244 como referência do conceito. Implemente manualmente uma solução equivalente em estilo.css; cores, medidas e organização podem variar quando o comportamento continuar correto."
        },
        {
          "titulo": "Adaptação para celular",
          "linhas": [
            245,
            270
          ],
          "explicacao": "A segunda media query cria uma única coluna e mantém todas as regiões legíveis.",
          "tarefa": "Use as linhas 245 a 270 como referência do conceito. Implemente manualmente uma solução equivalente em estilo.css; cores, medidas e organização podem variar quando o comportamento continuar correto."
        }
      ],
      "html": [
        {
          "titulo": "Estrutura do dashboard",
          "linhas": [
            1,
            112
          ],
          "explicacao": "O HTML de apoio separa menu, indicadores, atividade, tarefas e registros em regiões semânticas.",
          "tarefa": "Use as linhas 1 a 112 como referência do conceito. Implemente manualmente uma solução equivalente em index.html; cores, medidas e organização podem variar quando o comportamento continuar correto."
        }
      ],
      "js": [
        {
          "titulo": "Interações de apoio",
          "linhas": [
            1,
            38
          ],
          "explicacao": "O JavaScript de apoio alterna períodos, densidade visual e tarefas para testar o crescimento da grade.",
          "tarefa": "Use as linhas 1 a 38 como referência do conceito. Implemente manualmente uma solução equivalente em script.js; cores, medidas e organização podem variar quando o comportamento continuar correto."
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
      "html": false,
      "css": false,
      "js": false
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
      },
      "requisitosRecomendados": [
        "overflow",
        "interaction"
      ],
      "flexibilidadeAluno": {
        "comentariosIgnorados": true,
        "espacosIndentacaoIgnorados": true,
        "textosDadosPersonalizados": true,
        "elementosExtrasValidos": true,
        "observacao": "A validação prioriza os requisitos pedagógicos e o funcionamento. Diferenças cosméticas ou comentários não impedem 100%."
      }
    },
    "fasePedagogica": 8,
    "apoioAutomatico": {
      "enabled": false,
      "policy": "manual-only",
      "reason": "Gabarito e solução completa ficam no Core protegido do professor."
    },
    "fluxoEntrega": {
      "etapas": [
        "Leia a explicação e observe a referência",
        "Digite o arquivo manualmente no editor",
        "Execute o código atual",
        "Teste o comportamento no preview ou terminal correspondente",
        "Corrija os erros encontrados",
        "Valide o arquivo",
        "Conclua a atividade e gere a evidência",
        "Baixe o projeto, envie ao GitHub e entregue o link no Classroom"
      ]
    },
    "referenciaCompletaPadrao": false,
    "arquivosApoio": [
      "html",
      "js"
    ],
    "tempoEstimado": "35–40 min",
    "nivel": "CSS aplicado",
    "politicaDigitacao": {
      "modo": "manual",
      "copiarReferencia": false,
      "colarNoEditor": false,
      "autocompletar": false
    },
    "modeloPedagogico": {
      "tipo": "pratica-conceitual",
      "rotulo": "Prática conceitual guiada",
      "como": "A referência demonstra uma solução de Grid. O aluno pode organizar as regiões com áreas nomeadas ou grid-column/grid-row, desde que o dashboard se comporte corretamente.",
      "obrigatorio": [
        "Grid no contêiner principal",
        "colunas responsivas e gap",
        "dimensionamento com fr, minmax ou repeat",
        "posicionamento de pelo menos quatro regiões",
        "uma grade interna",
        "duas media queries",
        "proteção contra overflow",
        "estado de interação"
      ],
      "variar": [
        "grid-template-areas ou grid-column/grid-row",
        "cores, medidas e unidades",
        "quantidade de colunas intermediárias",
        "uso de Flexbox dentro de componentes lineares"
      ]
    },
    "situacaoProblema": "O painel administrativo possui várias regiões concorrendo por espaço. Seu desafio é organizar indicadores, gráfico, tarefas e tabela usando CSS Grid, mantendo responsividade e evitando sobreposição.",
    "passosDesafio": [
      "Crie o Grid principal com colunas e gap.",
      "Defina dimensionamento responsivo usando fr, minmax ou repeat.",
      "Posicione pelo menos quatro regiões com áreas ou linhas/colunas.",
      "Use uma grade interna em um componente adequado.",
      "Proteja regiões largas contra overflow.",
      "Crie duas adaptações responsivas e estados de interação.",
      "Execute, teste um controle do dashboard e confira tablet/celular."
    ],
    "testeAntesValidar": [
      "Teste a grade em três larguras diferentes.",
      "Use um controle do dashboard e confira o estado visual.",
      "Verifique se a tabela ou conteúdo largo rola sem empurrar a página inteira."
    ],
    "faseConstrucao": "desafio conceitual por requisitos"
  }
];

window.APP_CONFIG = {
  "name": "Plataforma 3DS — Programação no Desenvolvimento de Sistemas",
  "version": "0.11.9",
  "releasedAt": "2026-08-13T11:18:00-03:00",
  "versionManifest": "version.json?v=0.11.8",
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
  "behaviorScenarios": true,
  "updatedAt": "2026-08-13",
  "manualTypingRequired": true,
  "disableReferenceCopy": true,
  "disableEditorPaste": true,
  "disableAutocomplete": true,
  "pedagogicalProgression": true,
  "conceptualValidationReady": true,
  "pedagogicalProgressionStartsAtExercise": 2,
  "release": "Exercício 02: HTML de presente, produção CSS → JavaScript e opção global de ir direto à prática",
  "exercise01ContentBaseline": "0.11.1",
  "exercise01Policy": "conteudo-preservado-correcao-de-bugs-permitida",
  "versao": "0.11.8",
  "data": "13/08/2026",
  "validationFlexibilityPatch": true,
  "strictStudentTeacherSeparation": true,
  "directPracticeOption": true,
  "exercise02HtmlGift": true
};
