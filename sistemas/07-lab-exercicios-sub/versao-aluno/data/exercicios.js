window.EXERCICIOS_FRONTEND = [
  {
    "numero": 1,
    "studentReferenceStripped": true,
    "codigo": "FE01",
    "titulo": "FE01 - Ambiente, VS Code, pastas e primeiro projeto",
    "nomeCurto": "Ambiente, VS Code, pastas e primeiro projeto",
    "tema": "Organização do ambiente de desenvolvimento",
    "objetivo": "Preparar uma pasta Web organizada, conectar HTML, CSS e JavaScript e executar a página no navegador.",
    "produto": "Primeira página Front-End documentada e com uma interação de verificação do ambiente.",
    "contextoProfissional": "Organização inicial de um projeto Web, semelhante à estrutura usada por equipes para separar conteúdo, aparência, comportamento e documentação.",
    "alteracaoObrigatoria": "No README.md, substitua os campos de identificação pelo seu nome, confirme a turma e descreva como executou a página. Depois, personalize o texto do rodapé no index.html sem remover a identificação FE01.",
    "retomadas": [
      "uso básico de arquivos e pastas",
      "navegação no computador"
    ],
    "novos": [
      "Visual Studio Code",
      "estrutura de projeto Web",
      "index.html",
      "estilo.css",
      "script.js",
      "README.md",
      "console do navegador"
    ],
    "pasta": "exercicio-01",
    "repositorio": "atividades-frontend-sub",
    "classroomUrl": "https://classroom.google.com/",
    "githubUrl": "https://github.com/",
    "tempoMinimoSegundos": 300,
    "ordemArquivos": [
      "html",
      "css",
      "js",
      "readme"
    ],
    "arquivos": {
      "html": "<!doctype html>\n<html lang=\"pt-BR\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Atividade</title>\n</head>\n<body>\n  <main>\n    <!-- Desenvolva aqui a estrutura solicitada. -->\n  </main>\n</body>\n</html>\n",
      "css": "/* Desenvolva aqui os estilos solicitados. */\n",
      "js": "'use strict';\n// Desenvolva aqui o comportamento solicitado.\n",
      "readme": "# FE01 - Meu primeiro projeto Front-End\n\nPrimeiro projeto da disciplina **Programação Front-End**, organizado para testar a ligação entre HTML, CSS e JavaScript.\n\n## Estrutura da pasta\n\n```text\nexercicio-01/\n-  index.html\n-  estilo.css\n-  script.js\n-  README.md\n```\n\n## Como executar\n\n1. Abra a pasta no Visual Studio Code.\n2. Abra o arquivo `index.html` no navegador ou utilize a extensão Live Server.\n3. Clique em **Verificar projeto**.\n4. Confirme se a mensagem de sucesso aparece na página.\n\n## Identificação do estudante\n\n- Nome: **substitua pelo seu nome**\n- Turma: **2 DS Subsequente - Noturno**\n- Forma escolhida para executar: **descreva aqui**\n\n## Entrega\n\nEnvie o link do repositório solicitado pelo professor e anexe a evidência gerada pela plataforma.\n"
    },
    "nomesArquivos": {
      "html": "index.html",
      "css": "estilo.css",
      "js": "script.js",
      "readme": "README.md"
    },
    "linguagens": {
      "html": "html",
      "css": "css",
      "js": "js",
      "readme": "markdown"
    },
    "passos": {
      "html": [
        {
          "titulo": "Documento e arquivos conectados",
          "linhas": [
            1,
            9
          ],
          "explicacao": "O início cria o documento HTML, define o idioma e conecta estilo.css e script.js. O atributo defer faz o JavaScript esperar a leitura do HTML.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de html dentro do exercício.",
            "porque": "O HTML define a estrutura que o CSS estiliza e o JavaScript localiza.",
            "ordem": "O navegador lê a declaração, o head e depois constrói os elementos do body.",
            "erroComum": "Tag não fechada, id divergente ou caminho de arquivo incorreto.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "doctype",
            "lang",
            "defer"
          ]
        },
        {
          "titulo": "Cabeçalho e conteúdo principal",
          "linhas": [
            10,
            42
          ],
          "explicacao": "O corpo usa header, main, section e article para organizar a apresentação do projeto, a função de cada arquivo e o teste do ambiente.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de html dentro do exercício.",
            "porque": "O HTML define a estrutura que o CSS estiliza e o JavaScript localiza.",
            "ordem": "O navegador lê a declaração, o head e depois constrói os elementos do body.",
            "erroComum": "Tag não fechada, id divergente ou caminho de arquivo incorreto.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "id"
          ]
        },
        {
          "titulo": "Resultado e encerramento",
          "linhas": [
            43,
            52
          ],
          "explicacao": "O parágrafo com aria-live receberá a mensagem do JavaScript. O footer identifica o exercício e encerra a página.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de html dentro do exercício.",
            "porque": "O HTML define a estrutura que o CSS estiliza e o JavaScript localiza.",
            "ordem": "O navegador lê a declaração, o head e depois constrói os elementos do body.",
            "erroComum": "Tag não fechada, id divergente ou caminho de arquivo incorreto.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "ariaLive"
          ]
        }
      ],
      "css": [
        {
          "titulo": "Variáveis e preparação",
          "linhas": [
            1,
            18
          ],
          "explicacao": "As variáveis guardam as cores principais. O seletor universal aplica box-sizing para facilitar o controle dos tamanhos.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de css dentro do exercício.",
            "porque": "O CSS transforma a estrutura HTML em uma interface legível e responsiva.",
            "ordem": "A cascata combina regras gerais, componentes e ajustes de tela pequena.",
            "erroComum": "Seletor sem correspondência, propriedade inválida ou largura fixa causando overflow.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "root",
            "boxSizing"
          ]
        },
        {
          "titulo": "Layout e componentes",
          "linhas": [
            19,
            103
          ],
          "explicacao": "Estas regras estilizam o corpo, o cabeçalho, os painéis, os cartões, o botão e a mensagem de status.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de css dentro do exercício.",
            "porque": "O CSS transforma a estrutura HTML em uma interface legível e responsiva.",
            "ordem": "A cascata combina regras gerais, componentes e ajustes de tela pequena.",
            "erroComum": "Seletor sem correspondência, propriedade inválida ou largura fixa causando overflow.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "grid"
          ]
        },
        {
          "titulo": "Responsividade",
          "linhas": [
            104,
            131
          ],
          "explicacao": "A media query reorganiza os cartões em uma coluna e amplia o botão quando a tela é pequena.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de css dentro do exercício.",
            "porque": "O CSS transforma a estrutura HTML em uma interface legível e responsiva.",
            "ordem": "A cascata combina regras gerais, componentes e ajustes de tela pequena.",
            "erroComum": "Seletor sem correspondência, propriedade inválida ou largura fixa causando overflow.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "media"
          ]
        }
      ],
      "js": [
        {
          "titulo": "Localização dos elementos",
          "linhas": [
            1,
            2
          ],
          "explicacao": "querySelector localiza o botão e a área que exibirá a resposta do teste.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de js dentro do exercício.",
            "porque": "Este bloco conecta uma ação do usuário ao comportamento visível da página.",
            "ordem": "Primeiro os elementos são localizados; depois o evento é registrado; por último o callback altera a interface.",
            "erroComum": "Executar a alteração fora do evento ou usar um seletor que não encontra o elemento.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "querySelector"
          ]
        },
        {
          "titulo": "Resposta ao clique",
          "linhas": [
            4,
            8
          ],
          "explicacao": "addEventListener aguarda o clique e então muda a mensagem, adiciona a classe de sucesso e atualiza o texto do botão.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de js dentro do exercício.",
            "porque": "Este bloco conecta uma ação do usuário ao comportamento visível da página.",
            "ordem": "Primeiro os elementos são localizados; depois o evento é registrado; por último o callback altera a interface.",
            "erroComum": "Executar a alteração fora do evento ou usar um seletor que não encontra o elemento.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "addEventListener",
            "textContent",
            "classList"
          ]
        }
      ],
      "readme": [
        {
          "titulo": "Apresentação e estrutura",
          "linhas": [
            1,
            14
          ],
          "explicacao": "O README apresenta o exercício e registra a estrutura esperada da pasta.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de readme dentro do exercício.",
            "porque": "Este trecho existe para manter a sequência entre estrutura, comportamento, teste e entrega.",
            "ordem": "Leia de cima para baixo e acompanhe como cada linha prepara a próxima ação.",
            "erroComum": "Compare nomes, fechamento, pontuação e posição das instruções antes de validar.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "heading",
            "code"
          ]
        },
        {
          "titulo": "Execução e teste",
          "linhas": [
            16,
            23
          ],
          "explicacao": "Estas etapas orientam a abertura no VS Code, a execução no navegador e o teste do botão.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de readme dentro do exercício.",
            "porque": "Este trecho existe para manter a sequência entre estrutura, comportamento, teste e entrega.",
            "ordem": "Leia de cima para baixo e acompanhe como cada linha prepara a próxima ação.",
            "erroComum": "Compare nomes, fechamento, pontuação e posição das instruções antes de validar.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "heading"
          ]
        },
        {
          "titulo": "Identificação e entrega",
          "linhas": [
            25,
            30
          ],
          "explicacao": "O estudante deve substituir os campos de identificação e manter documentada a forma usada para executar a página.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de readme dentro do exercício.",
            "porque": "Este trecho existe para manter a sequência entre estrutura, comportamento, teste e entrega.",
            "ordem": "Leia de cima para baixo e acompanhe como cada linha prepara a próxima ação.",
            "erroComum": "Compare nomes, fechamento, pontuação e posição das instruções antes de validar.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "heading"
          ]
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 01 - Ambiente, VS Code, pastas e primeiro projeto",
      "descricao": "Nesta atividade, vamos preparar o ambiente de Programação Front-End e construir a primeira pasta de projeto no Visual Studio Code.\n\nVocê criará os arquivos index.html, estilo.css, script.js e README.md, compreenderá a função de cada um, abrirá a página no navegador e usará o botão de verificação para confirmar que os três arquivos principais estão conectados.\n\nAlteração obrigatória: complete a identificação no README.md e personalize o rodapé da página sem remover a indicação do FE01.\n\nAo terminar, valide todos os arquivos na plataforma, gere a evidência e salve o projeto na pasta exercicio-01 do repositório atividades-frontend-sub.\n\nEntrega: anexar o link do repositório do GitHub."
    },
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false,
      "readme": false
    },
    "validacao": {
      "strictDeclarations": false,
      "aceitarEquivalencias": true,
      "htmlEstrutura": {
        "idsObrigatorios": [
          "titulo-arquivos",
          "titulo-teste",
          "testarProjeto",
          "statusProjeto"
        ],
        "tagsMinimas": {
          "header": 1,
          "main": 1,
          "section": 1,
          "article": 1,
          "footer": 1,
          "button": 1,
          "h1": 1,
          "h2": 1
        },
        "referenciasArquivos": {
          "css": "estilo.css",
          "js": "script.js"
        },
        "seletoresObrigatorios": [
          {
            "selector": "#testarProjeto[type=\"button\"]",
            "message": "Mantenha o botão de verificação com type=\"button\"."
          }
        ]
      },
      "markdownEstrutura": {
        "codigoExercicio": "FE01",
        "minimoCaracteres": 50,
        "titulosObrigatorios": [],
        "arquivosObrigatorios": [
          "index.html",
          "estilo.css",
          "script.js"
        ],
        "conteudosObrigatorios": [
          "navegador"
        ],
        "proibirPlaceholders": [
          "substitua pelo seu nome",
          "descreva aqui"
        ]
      },
      "jsComportamento": [
        {
          "event": "click",
          "triggerId": "testarProjeto",
          "acoes": [
            {
              "type": "text",
              "targetId": "statusProjeto"
            },
            {
              "type": "classAdd",
              "targetId": "statusProjeto"
            },
            {
              "type": "text",
              "targetId": "testarProjeto"
            }
          ]
        }
      ],
      "politica": "conceitos_essenciais"
    },
    "glossario": [
      {
        "id": "doctype",
        "termo": "doctype",
        "categoria": "Declaração",
        "traducao": "Documento HTML",
        "explicacao": "Informa ao navegador que o arquivo utiliza HTML moderno.",
        "erroComum": "Esquecer ou alterar pode ativar modos antigos do navegador.",
        "linguagem": "html",
        "exercicio": "FE01"
      },
      {
        "id": "lang",
        "termo": "lang",
        "categoria": "Atributo",
        "traducao": "Idioma",
        "explicacao": "Indica que o conteúdo principal está em português do Brasil.",
        "erroComum": "Usar um idioma incorreto prejudica leitores de tela.",
        "linguagem": "html",
        "exercicio": "FE01"
      },
      {
        "id": "defer",
        "termo": "defer",
        "categoria": "Atributo",
        "traducao": "Adiar",
        "explicacao": "Faz o JavaScript aguardar a leitura do HTML antes de executar.",
        "erroComum": "Sem defer, o script pode procurar elementos que ainda não existem.",
        "linguagem": "html",
        "exercicio": "FE01"
      },
      {
        "id": "id",
        "termo": "id",
        "categoria": "Atributo",
        "traducao": "Identificador",
        "explicacao": "Cria um nome único para localizar um elemento no CSS ou JavaScript.",
        "erroComum": "Repetir o mesmo id ou escrever nomes diferentes quebra seletores.",
        "linguagem": "html",
        "exercicio": "FE01"
      },
      {
        "id": "ariaLive",
        "termo": "aria-live",
        "categoria": "Atributo de acessibilidade",
        "traducao": "Região viva",
        "explicacao": "Faz leitores de tela anunciarem mudanças no conteúdo.",
        "erroComum": "Remover pode ocultar mensagens dinâmicas para usuários de leitor de tela.",
        "linguagem": "html",
        "exercicio": "FE01"
      },
      {
        "id": "root",
        "termo": "root",
        "categoria": "Seletor",
        "traducao": "Raiz do documento",
        "explicacao": "Centraliza variáveis CSS reutilizáveis.",
        "erroComum": "Declarar variável e não usar var() reduz a utilidade.",
        "linguagem": "css",
        "exercicio": "FE01"
      },
      {
        "id": "boxSizing",
        "termo": "box-sizing",
        "categoria": "Propriedade",
        "traducao": "Modelo de caixa",
        "explicacao": "Inclui padding e borda no tamanho final do elemento.",
        "erroComum": "Sem ela, largura e altura podem crescer além do esperado.",
        "linguagem": "css",
        "exercicio": "FE01"
      },
      {
        "id": "grid",
        "termo": "grid",
        "categoria": "Valor de display",
        "traducao": "Grade",
        "explicacao": "Organiza elementos em linhas e colunas.",
        "erroComum": "Definir grid sem colunas pode não produzir o layout esperado.",
        "linguagem": "css",
        "exercicio": "FE01"
      },
      {
        "id": "media",
        "termo": "media",
        "categoria": "Regra condicional",
        "traducao": "Consulta de mídia",
        "explicacao": "Aplica regras quando a tela atende a uma condição.",
        "erroComum": "Usar largura fixa ou condição incorreta causa overflow.",
        "linguagem": "css",
        "exercicio": "FE01"
      },
      {
        "id": "querySelector",
        "termo": "querySelector",
        "categoria": "Método",
        "traducao": "Selecionar elemento",
        "explicacao": "Localiza o primeiro elemento que corresponde a um seletor CSS.",
        "erroComum": "Se o seletor estiver errado, o resultado será null.",
        "linguagem": "js",
        "exercicio": "FE01"
      },
      {
        "id": "addEventListener",
        "termo": "addEventListener",
        "categoria": "Método",
        "traducao": "Adicionar observador de evento",
        "explicacao": "Registra uma função para executar quando uma ação acontece.",
        "erroComum": "Colocar a lógica fora do callback faz ela executar antes do clique.",
        "linguagem": "js",
        "exercicio": "FE01"
      },
      {
        "id": "textContent",
        "termo": "textContent",
        "categoria": "Propriedade",
        "traducao": "Conteúdo textual",
        "explicacao": "Lê ou altera texto sem interpretar HTML.",
        "erroComum": "Usar innerHTML sem necessidade aumenta risco e pode alterar a estrutura.",
        "linguagem": "js",
        "exercicio": "FE01"
      },
      {
        "id": "classList",
        "termo": "classList",
        "categoria": "Propriedade",
        "traducao": "Lista de classes",
        "explicacao": "Permite adicionar, remover ou alternar classes CSS.",
        "erroComum": "Digitar uma classe diferente da existente impede o estilo.",
        "linguagem": "js",
        "exercicio": "FE01"
      },
      {
        "id": "heading",
        "termo": "heading",
        "categoria": "Sintaxe Markdown",
        "traducao": "Título",
        "explicacao": "Organiza a documentação em seções com #.",
        "erroComum": "Usar títulos sem conteúdo deixa o README incompleto.",
        "linguagem": "markdown",
        "exercicio": "FE01"
      },
      {
        "id": "code",
        "termo": "code",
        "categoria": "Sintaxe Markdown",
        "traducao": "Código em linha",
        "explicacao": "Destaca nomes de arquivos e comandos com crases.",
        "erroComum": "Aspas comuns não produzem o mesmo destaque.",
        "linguagem": "markdown",
        "exercicio": "FE01"
      }
    ],
    "dicasProgressivas": {
      "html": [
        "Relembre: o HTML organiza o conteúdo e conecta os outros arquivos.",
        "Localize: confira primeiro o head, depois os IDs usados pelo JavaScript.",
        "Compare: os nomes escritos em id devem ser exatamente iguais aos seletores.",
        "Estrutura parcial: mantenha abertura e fechamento das tags na ordem correta.",
        "Exemplo semelhante: crie outro botão e outra área de mensagem com nomes diferentes."
      ],
      "css": [
        "Relembre: seletores escolhem elementos e propriedades definem a apresentação.",
        "Localize: confira a regra que deveria afetar o elemento observado.",
        "Compare: verifique ponto da classe, dois-pontos, ponto e vírgula e unidade.",
        "Estrutura parcial: seletor { propriedade: valor; }.",
        "Exemplo semelhante: teste uma cor ou espaçamento diferente permitido."
      ],
      "js": [
        "Relembre: primeiro localize o elemento; depois registre a ação.",
        "Localize: confira o seletor e o callback do evento.",
        "Compare: a alteração precisa estar dentro da função executada pelo evento.",
        "Estrutura parcial: elemento.addEventListener('click', () => { /* ação */ });",
        "Exemplo semelhante: altere o texto de outro elemento com outro botão."
      ],
      "python": [
        "Relembre: input() sempre devolve texto.",
        "Localize: confira as linhas de entrada e conversão.",
        "Compare: o cálculo deve usar valores numéricos, não strings.",
        "Estrutura parcial: valor = float(input('Pergunta: ')).",
        "Exemplo semelhante: calcule quantidade x preço com outros nomes."
      ]
    },
    "comportamento": {
      "titulo": "Teste comportamental do ambiente",
      "instrucao": "Execute o preview e clique em Verificar projeto. Para concluir, basta a ação funcionar e a mensagem de status mudar.",
      "criterios": [
        {
          "id": "acao-principal",
          "tipo": "event",
          "evento": "click",
          "seletor": "#testarProjeto",
          "rotulo": "Clicar no botão Verificar projeto"
        },
        {
          "id": "mensagem-alterada",
          "tipo": "textNotEquals",
          "seletor": "#statusProjeto",
          "valor": "Aguardando a verificação.",
          "rotulo": "A mensagem de status foi atualizada"
        }
      ]
    },
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 2,
    "studentReferenceStripped": true,
    "codigo": "FE02",
    "titulo": "FE02 - HTML semântico em uma página profissional",
    "nomeCurto": "HTML semântico em uma página profissional",
    "tema": "Semântica e organização do conteúdo",
    "objetivo": "Construir uma página empresarial com regiões semânticas que comuniquem claramente a função de cada conteúdo.",
    "produto": "Página institucional de uma empresa de serviços, com navegação interna e informações de atendimento.",
    "contextoProfissional": "Sites empresariais precisam ser compreensíveis para pessoas, mecanismos de busca, leitores de tela e equipes que darão manutenção no código.",
    "alteracaoObrigatoria": "Personalize a seção Equipe com uma função profissional e uma responsabilidade adicional. Soluções semanticamente equivalentes e conteúdos extras são aceitos desde que as regiões obrigatórias permaneçam.",
    "retomadas": [
      "estrutura básica do documento HTML",
      "ligação entre HTML, CSS e JavaScript"
    ],
    "novos": [
      "header",
      "nav",
      "main",
      "section",
      "article",
      "aside",
      "footer",
      "address",
      "navegação interna",
      "aria-labelledby",
      "aria-expanded",
      "atributo hidden"
    ],
    "pasta": "exercicio-02",
    "repositorio": "atividades-frontend-sub",
    "classroomUrl": "https://classroom.google.com/",
    "githubUrl": "https://github.com/",
    "tempoMinimoSegundos": 300,
    "ordemArquivos": [
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
    "linguagens": {
      "html": "html",
      "css": "css",
      "js": "js"
    },
    "passos": {
      "html": [
        {
          "titulo": "Documento, acessibilidade e cabeçalho",
          "linhas": [
            1,
            26
          ],
          "explicacao": "O documento define idioma e viewport, conecta os arquivos, oferece um link para pular o cabeçalho e usa header e nav para apresentar a empresa e a navegação principal.",
          "detalhes": {
            "objetivo": "Reconhecer a preparação do documento, o link de salto e os elementos semânticos usados no cabeçalho.",
            "porque": "Idioma, viewport e navegação acessível criam uma base que funciona para teclado, leitores de tela e telas pequenas.",
            "ordem": "O navegador interpreta a declaração e o head; depois cria o link de salto, o header e a nav antes do conteúdo principal.",
            "erroComum": "O href do link de salto não corresponder ao id do main ou os links da navegação apontarem para seções inexistentes.",
            "conferir": "Use Tab ao abrir a página, acione o link de salto e confira se o foco chega ao conteúdo principal."
          },
          "termos": [
            "doctype",
            "lang",
            "skipLink",
            "header",
            "nav"
          ]
        },
        {
          "titulo": "Conteúdo principal e serviços",
          "linhas": [
            28,
            47
          ],
          "explicacao": "main identifica o conteúdo central. A primeira section reúne o tema Serviços e cada article representa um serviço independente que poderia ser reutilizado ou distribuído separadamente.",
          "detalhes": {
            "objetivo": "Diferenciar main, section e article conforme o papel de cada conteúdo.",
            "porque": "A semântica permite que a estrutura continue compreensível sem depender de cores, bordas ou posição visual.",
            "ordem": "O main inicia o conteúdo central; a section apresenta o tema Serviços; cada article descreve um serviço independente.",
            "erroComum": "Usar article apenas porque o conteúdo aparece em cartão ou criar section sem título relacionado.",
            "conferir": "Desative o CSS mentalmente e verifique se os títulos e elementos ainda descrevem uma hierarquia lógica."
          },
          "termos": [
            "main",
            "section",
            "article"
          ]
        },
        {
          "titulo": "Processo e equipe",
          "linhas": [
            49,
            61
          ],
          "explicacao": "Duas sections agrupam assuntos diferentes. Os títulos ligados por aria-labelledby nomeiam cada região de forma explícita.",
          "detalhes": {
            "objetivo": "Relacionar regiões temáticas aos títulos usando aria-labelledby.",
            "porque": "Uma região nomeada ajuda tecnologias assistivas a navegar entre blocos extensos.",
            "ordem": "Cada section é criada e seu aria-labelledby aponta para o id do h2 que a nomeia.",
            "erroComum": "Digitar um id no aria-labelledby diferente do id existente no título.",
            "conferir": "Compare caractere por caractere o valor do atributo e o id do título de cada região."
          },
          "termos": [
            "section",
            "ariaLabelledby"
          ]
        },
        {
          "titulo": "Conteúdo complementar e contato",
          "linhas": [
            63,
            85
          ],
          "explicacao": "aside concentra uma informação complementar sobre atendimento. footer e address encerram a página com dados de contato e identificação do exercício.",
          "detalhes": {
            "objetivo": "Distinguir informação complementar, encerramento e dados de contato.",
            "porque": "aside, footer e address descrevem papéis que uma div genérica não comunica.",
            "ordem": "O aside complementa o main; o footer encerra a página; address identifica os contatos relacionados.",
            "erroComum": "Colocar informação indispensável somente no aside ou usar address para qualquer texto de localização.",
            "conferir": "Pergunte se a página ainda é compreensível sem o aside e se o address contém realmente contato."
          },
          "termos": [
            "aside",
            "address"
          ]
        }
      ],
      "css": [
        {
          "titulo": "Variáveis e base visual",
          "linhas": [
            1,
            40
          ],
          "explicacao": "As variáveis centralizam as cores. box-sizing e as regras do body criam uma base previsível para a página.",
          "detalhes": {
            "objetivo": "Compreender variáveis CSS, cálculo de caixas e base visual do documento.",
            "porque": "Uma base previsível evita repetição de cores e diferenças inesperadas de largura.",
            "ordem": "As variáveis são declaradas primeiro; box-sizing prepara as caixas; body aplica tipografia, fundo e cor.",
            "erroComum": "Usar var() com nome inexistente ou esquecer que padding aumenta a caixa sem border-box.",
            "conferir": "Altere temporariamente uma variável e observe todos os componentes que dependem dela."
          },
          "termos": [
            "customProperty",
            "boxSizing"
          ]
        },
        {
          "titulo": "Navegação e tipografia",
          "linhas": [
            42,
            105
          ],
          "explicacao": "O link de salto aparece ao receber foco. Cabeçalho, títulos, textos e navegação são estilizados sem depender de Flexbox ou Grid.",
          "detalhes": {
            "objetivo": "Estilizar navegação e textos preservando foco visível e leitura clara.",
            "porque": "Links precisam funcionar tanto com ponteiro quanto com teclado, e a tipografia deve manter hierarquia.",
            "ordem": "O link de salto fica fora da tela, aparece com foco e depois as regras estilizam cabeçalho, títulos e navegação.",
            "erroComum": "Usar display:none no link de salto ou remover outline sem criar um estilo de foco equivalente.",
            "conferir": "Navegue somente com Tab e confirme que cada link ativo permanece claramente visível."
          },
          "termos": [
            "skipLink",
            "focusVisible"
          ]
        },
        {
          "titulo": "Regiões semânticas e interação",
          "linhas": [
            107,
            163
          ],
          "explicacao": "section, aside, footer e article recebem aparência coerente. O botão e a área de detalhes ganham estados visuais claros.",
          "detalhes": {
            "objetivo": "Dar aparência consistente às regiões sem substituir o significado do HTML.",
            "porque": "O CSS deve reforçar a leitura sem ser a única fonte de organização ou estado.",
            "ordem": "Regras gerais criam os painéis; artigos recebem acabamento; botão e detalhes recebem estados de interação.",
            "erroComum": "Aplicar seletor a uma classe inexistente ou ocultar conteúdo apenas por cor.",
            "conferir": "Inspecione a classe de cada região e teste hover e foco do botão."
          },
          "termos": [
            "focusVisible",
            "hidden"
          ]
        },
        {
          "titulo": "Adaptação para telas pequenas",
          "linhas": [
            165,
            184
          ],
          "explicacao": "A media query reduz espaçamentos, transforma os itens da navegação em blocos e amplia o botão no celular.",
          "detalhes": {
            "objetivo": "Adaptar espaçamento, navegação e botão a uma tela estreita.",
            "porque": "Conteúdo legível no computador pode ficar apertado ou difícil de tocar no celular.",
            "ordem": "Quando a largura atinge o breakpoint, as regras mais recentes substituem apenas o necessário.",
            "erroComum": "Criar largura fixa ou botão pequeno que continua causando rolagem horizontal.",
            "conferir": "Teste em 320 px e confirme que links e botão ocupam área adequada sem corte."
          },
          "termos": [
            "mediaQuery"
          ]
        }
      ],
      "js": [
        {
          "titulo": "Elementos controlados",
          "linhas": [
            1,
            2
          ],
          "explicacao": "querySelector localiza o botão e a região complementar que começará oculta.",
          "detalhes": {
            "objetivo": "Localizar o botão e a região complementar usando seletores reais.",
            "porque": "O JavaScript precisa de referências válidas antes de registrar comportamento.",
            "ordem": "querySelector é executado ao carregar o script e guarda cada elemento em uma constante.",
            "erroComum": "Seletor incorreto retornar null e causar erro ao usar addEventListener.",
            "conferir": "Compare os seletores com os ids e classes do HTML e teste no console se os elementos existem."
          },
          "termos": [
            "querySelector"
          ]
        },
        {
          "titulo": "Estado acessível do atendimento",
          "linhas": [
            4,
            10
          ],
          "explicacao": "O clique lê aria-expanded, atualiza o atributo, controla hidden e troca o texto do botão sem remover a semântica do HTML.",
          "detalhes": {
            "objetivo": "Sincronizar clique, visibilidade, texto e estado acessível.",
            "porque": "Usuários visuais e de tecnologia assistiva precisam receber a mesma informação.",
            "ordem": "O clique lê aria-expanded, calcula o novo estado, atualiza o atributo, muda hidden e troca o rótulo.",
            "erroComum": "Alterar hidden sem atualizar aria-expanded ou comparar o atributo com booleano em vez de string.",
            "conferir": "Clique duas vezes e confirme que a região abre e fecha, o texto muda e aria-expanded alterna."
          },
          "termos": [
            "addEventListener",
            "getAttribute",
            "setAttribute",
            "hidden",
            "ariaExpanded",
            "ternary"
          ]
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 02 - HTML semântico em uma página profissional",
      "descricao": "Nesta atividade, vamos construir uma página institucional usando elementos HTML semânticos. A página deverá apresentar a empresa, sua navegação, serviços, processo de trabalho, equipe, atendimento e contato.\n\nVocê praticará header, nav, main, section, article, aside, footer e address, além de relações acessíveis com aria-labelledby, aria-expanded e hidden.\n\nAlteração obrigatória: personalize a seção Equipe com uma função profissional e uma responsabilidade adicional, mantendo a organização semântica.\n\nAo terminar, valide os três arquivos, teste a navegação por âncoras, revele e oculte os horários, gere a evidência e salve tudo na pasta exercicio-02.\n\nEntrega: anexar o link do repositório do GitHub."
    },
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false,
      "aceitarEquivalencias": true,
      "htmlEstrutura": {
        "idsObrigatorios": [
          "conteudo",
          "servicos",
          "processo",
          "equipe",
          "atendimento",
          "mostrarAtendimento",
          "detalhesAtendimento",
          "contato"
        ],
        "tagsMinimas": {
          "header": 1,
          "nav": 1,
          "main": 1,
          "section": 1,
          "article": 1,
          "aside": 1,
          "footer": 1,
          "h1": 1,
          "h2": 1,
          "button": 1
        },
        "referenciasArquivos": {
          "css": "estilo.css",
          "js": "script.js"
        },
        "ancorasObrigatorias": [
          "#servicos",
          "#contato"
        ],
        "atributosObrigatorios": [
          {
            "selector": "#detalhesAtendimento",
            "attribute": "hidden"
          }
        ]
      },
      "jsComportamento": [
        {
          "event": "click",
          "triggerId": "mostrarAtendimento",
          "acoes": [
            {
              "type": "getAttribute",
              "targetId": "mostrarAtendimento",
              "attribute": "aria-expanded"
            },
            {
              "type": "setAttribute",
              "targetId": "mostrarAtendimento",
              "attribute": "aria-expanded"
            },
            {
              "type": "hidden",
              "targetId": "detalhesAtendimento"
            },
            {
              "type": "text",
              "targetId": "mostrarAtendimento"
            }
          ]
        }
      ],
      "politica": "conceitos_essenciais"
    },
    "glossario": [
      {
        "id": "doctype",
        "termo": "<!DOCTYPE html>",
        "categoria": "Declaração",
        "traducao": "Documento HTML moderno",
        "explicacao": "Informa ao navegador que o arquivo utiliza o padrão atual do HTML.",
        "erroComum": "Remover a declaração pode ativar um modo antigo de renderização.",
        "linguagem": "html",
        "exercicio": "FE02"
      },
      {
        "id": "lang",
        "termo": "lang",
        "categoria": "Atributo",
        "traducao": "Idioma",
        "explicacao": "Indica o idioma principal do documento para navegadores e leitores de tela.",
        "erroComum": "Usar idioma incorreto prejudica pronúncia e acessibilidade.",
        "linguagem": "html",
        "exercicio": "FE02"
      },
      {
        "id": "skipLink",
        "termo": "link de salto",
        "categoria": "Recurso de acessibilidade",
        "traducao": "Pular para o conteúdo",
        "explicacao": "Permite que uma pessoa usando teclado ignore a navegação repetida e vá diretamente ao conteúdo principal.",
        "erroComum": "O destino do href precisa existir e receber foco de forma previsível.",
        "linguagem": "html",
        "exercicio": "FE02"
      },
      {
        "id": "header",
        "termo": "header",
        "categoria": "Elemento semântico",
        "traducao": "Cabeçalho",
        "explicacao": "Agrupa a apresentação inicial de uma página ou seção.",
        "erroComum": "Usar header apenas como caixa visual, sem relação com o conteúdo, reduz a clareza semântica.",
        "linguagem": "html",
        "exercicio": "FE02"
      },
      {
        "id": "nav",
        "termo": "nav",
        "categoria": "Elemento semântico",
        "traducao": "Navegação",
        "explicacao": "Identifica um conjunto principal de links de navegação.",
        "erroComum": "Colocar qualquer lista de links em nav sem necessidade pode enfraquecer a estrutura.",
        "linguagem": "html",
        "exercicio": "FE02"
      },
      {
        "id": "main",
        "termo": "main",
        "categoria": "Elemento semântico",
        "traducao": "Conteúdo principal",
        "explicacao": "Marca o conteúdo central e único da página.",
        "erroComum": "Deve existir apenas um main visível por página.",
        "linguagem": "html",
        "exercicio": "FE02"
      },
      {
        "id": "section",
        "termo": "section",
        "categoria": "Elemento semântico",
        "traducao": "Seção temática",
        "explicacao": "Agrupa conteúdo relacionado que normalmente possui um título.",
        "erroComum": "Criar section sem tema ou título pode ser menos adequado que uma div.",
        "linguagem": "html",
        "exercicio": "FE02"
      },
      {
        "id": "article",
        "termo": "article",
        "categoria": "Elemento semântico",
        "traducao": "Conteúdo independente",
        "explicacao": "Representa um conteúdo que poderia ser reutilizado ou distribuído separadamente.",
        "erroComum": "Usar article para qualquer cartão apenas por aparência não garante semântica correta.",
        "linguagem": "html",
        "exercicio": "FE02"
      },
      {
        "id": "ariaLabelledby",
        "termo": "aria-labelledby",
        "categoria": "Atributo de acessibilidade",
        "traducao": "Nomeado por outro elemento",
        "explicacao": "Relaciona uma região ao id do título que fornece seu nome acessível.",
        "erroComum": "Referenciar um id inexistente deixa a região sem o nome esperado.",
        "linguagem": "html",
        "exercicio": "FE02"
      },
      {
        "id": "aside",
        "termo": "aside",
        "categoria": "Elemento semântico",
        "traducao": "Conteúdo complementar",
        "explicacao": "Agrupa informação relacionada, mas secundária ao conteúdo principal.",
        "erroComum": "Não deve receber o conteúdo essencial que o usuário precisa para compreender a página.",
        "linguagem": "html",
        "exercicio": "FE02"
      },
      {
        "id": "address",
        "termo": "address",
        "categoria": "Elemento semântico",
        "traducao": "Informações de contato",
        "explicacao": "Identifica dados de contato do autor, organização ou seção relacionada.",
        "erroComum": "Não deve ser usado apenas para qualquer endereço postal sem contexto de contato.",
        "linguagem": "html",
        "exercicio": "FE02"
      },
      {
        "id": "hidden",
        "termo": "hidden",
        "categoria": "Atributo/propriedade",
        "traducao": "Oculto",
        "explicacao": "Remove temporariamente um elemento da apresentação e da árvore de acessibilidade.",
        "erroComum": "Alterar apenas a aparência no CSS pode deixar conteúdo oculto ainda acessível ou focável.",
        "linguagem": "html/js",
        "exercicio": "FE02"
      },
      {
        "id": "ariaExpanded",
        "termo": "aria-expanded",
        "categoria": "Atributo de acessibilidade",
        "traducao": "Expandido ou recolhido",
        "explicacao": "Comunica se um controle revela ou oculta uma região.",
        "erroComum": "O valor precisa acompanhar o estado visual real.",
        "linguagem": "html/js",
        "exercicio": "FE02"
      },
      {
        "id": "customProperty",
        "termo": "--variavel",
        "categoria": "Propriedade personalizada",
        "traducao": "Variável CSS",
        "explicacao": "Guarda um valor reutilizável, como uma cor, para manter consistência.",
        "erroComum": "Usar var() com nome diferente faz a propriedade perder o valor.",
        "linguagem": "css",
        "exercicio": "FE02"
      },
      {
        "id": "boxSizing",
        "termo": "box-sizing",
        "categoria": "Propriedade CSS",
        "traducao": "Cálculo da caixa",
        "explicacao": "Com border-box, padding e borda passam a fazer parte da largura definida.",
        "erroComum": "Sem essa regra, caixas podem ultrapassar a largura esperada.",
        "linguagem": "css",
        "exercicio": "FE02"
      },
      {
        "id": "focusVisible",
        "termo": ":focus-visible",
        "categoria": "Pseudoclasse",
        "traducao": "Foco visível",
        "explicacao": "Aplica estilo quando o elemento recebe foco por uma forma que precisa de indicação visual, como teclado.",
        "erroComum": "Remover o contorno sem alternativa torna a navegação por teclado difícil.",
        "linguagem": "css",
        "exercicio": "FE02"
      },
      {
        "id": "mediaQuery",
        "termo": "@media",
        "categoria": "Regra condicional CSS",
        "traducao": "Consulta de mídia",
        "explicacao": "Aplica ajustes de estilo conforme características da tela.",
        "erroComum": "Criar @media sem ajustar o layout real não garante responsividade.",
        "linguagem": "css",
        "exercicio": "FE02"
      },
      {
        "id": "querySelector",
        "termo": "querySelector",
        "categoria": "Método do DOM",
        "traducao": "Selecionar elemento",
        "explicacao": "Localiza o primeiro elemento que corresponde a um seletor CSS.",
        "erroComum": "Se o seletor estiver incorreto, o resultado será null.",
        "linguagem": "javascript",
        "exercicio": "FE02"
      },
      {
        "id": "addEventListener",
        "termo": "addEventListener",
        "categoria": "Método",
        "traducao": "Registrar evento",
        "explicacao": "Associa uma função a uma ação, como clique.",
        "erroComum": "Executar a alteração fora do callback faz a ação acontecer antes do clique.",
        "linguagem": "javascript",
        "exercicio": "FE02"
      },
      {
        "id": "getAttribute",
        "termo": "getAttribute",
        "categoria": "Método",
        "traducao": "Ler atributo",
        "explicacao": "Obtém o valor atual de um atributo do elemento.",
        "erroComum": "Comparar com booleano em vez de texto pode produzir resultado inesperado.",
        "linguagem": "javascript",
        "exercicio": "FE02"
      },
      {
        "id": "setAttribute",
        "termo": "setAttribute",
        "categoria": "Método",
        "traducao": "Atualizar atributo",
        "explicacao": "Define ou altera o valor de um atributo.",
        "erroComum": "Atualizar aria-expanded sem mudar a região visível cria divergência de acessibilidade.",
        "linguagem": "javascript",
        "exercicio": "FE02"
      },
      {
        "id": "ternary",
        "termo": "operador ternário",
        "categoria": "Operador condicional",
        "traducao": "Escolha curta",
        "explicacao": "Escolhe entre dois valores usando condição ? valor1 : valor2.",
        "erroComum": "Encadear muitos ternários reduz a legibilidade.",
        "linguagem": "javascript",
        "exercicio": "FE02"
      }
    ],
    "dicasProgressivas": {
      "html": [
        "Relembre: escolha a tag pelo papel do conteúdo, não pela aparência.",
        "Localize: confira main, sections, articles, aside e address e seus títulos.",
        "Compare: todo aria-labelledby precisa apontar para um id existente.",
        "Estrutura parcial: <section aria-labelledby=\"titulo-x\"><h2 id=\"titulo-x\">...</h2>...</section>.",
        "Exemplo semelhante: organize uma página de biblioteca usando header, nav, main, article e aside."
      ],
      "css": [
        "Relembre: o CSS apresenta a estrutura sem substituir a semântica.",
        "Localize: teste primeiro variáveis, foco e link de salto.",
        "Compare: confira seletor, propriedade, valor, unidade e fechamento.",
        "Estrutura parcial: @media (max-width: ...px) { seletor { propriedade: valor; } }.",
        "Exemplo semelhante: transforme uma navegação horizontal em blocos em outra largura."
      ],
      "js": [
        "Relembre: o estado visual e o estado acessível precisam ser iguais.",
        "Localize: confira botão, região oculta e callback do click.",
        "Compare: aria-expanded usa texto \"true\" ou \"false\", enquanto hidden é booleano.",
        "Estrutura parcial: const aberto = botao.getAttribute(...) === \"true\"; depois atualize os dois estados.",
        "Exemplo semelhante: crie um botão que revela uma seção de dúvidas com IDs diferentes."
      ]
    },
    "comportamento": {
      "titulo": "Teste comportamental da área de atendimento",
      "instrucao": "Execute o preview e use o botão de horários. A plataforma verifica a ação principal e se os detalhes realmente aparecem.",
      "criterios": [
        {
          "id": "acao-principal",
          "tipo": "event",
          "evento": "click",
          "seletor": "#mostrarAtendimento",
          "rotulo": "Acionar o botão de horários"
        },
        {
          "id": "conteudo-visivel",
          "tipo": "notHidden",
          "seletor": "#detalhesAtendimento",
          "rotulo": "Os detalhes de atendimento ficaram visíveis"
        }
      ]
    },
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 3,
    "studentReferenceStripped": true,
    "codigo": "FE03",
    "titulo": "FE03 - Formulário acessível de cadastro",
    "nomeCurto": "Formulário acessível de cadastro",
    "tema": "Formulários semânticos e acessibilidade",
    "objetivo": "Construir um formulário de cadastro compreensível pelo teclado, pelo navegador e por tecnologias assistivas.",
    "produto": "Formulário profissional de cadastro de cliente, com grupos de campos, rótulos associados, tipos adequados e confirmação acessível.",
    "contextoProfissional": "Cadastros são usados em atendimento, vendas, suporte e sistemas internos. Um formulário mal estruturado aumenta erros, abandono e barreiras de acesso.",
    "alteracaoObrigatoria": "Acrescente um campo opcional relacionado ao atendimento, com label associado, id, name e autocomplete quando existir um valor apropriado. Textos, opções e conteúdo adicional podem ser personalizados sem remover os requisitos de acessibilidade.",
    "retomadas": [
      "estrutura semântica do documento",
      "ligação entre HTML, CSS e JavaScript",
      "hierarquia de títulos"
    ],
    "novos": [
      "form",
      "label e for",
      "fieldset e legend",
      "input text, email, tel, radio e checkbox",
      "select e option",
      "textarea",
      "required",
      "name",
      "autocomplete",
      "aria-describedby",
      "role=status",
      "aria-live"
    ],
    "pasta": "exercicio-03",
    "repositorio": "atividades-frontend-sub",
    "classroomUrl": "https://classroom.google.com/",
    "githubUrl": "https://github.com/",
    "tempoMinimoSegundos": 300,
    "ordemArquivos": [
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
    "linguagens": {
      "html": "html",
      "css": "css",
      "js": "js"
    },
    "passos": {
      "html": [
        {
          "titulo": "Documento e orientação inicial",
          "linhas": [
            1,
            21
          ],
          "explicacao": "O documento define idioma, viewport, arquivos conectados, link de salto, título principal e aviso visual dos campos obrigatórios.",
          "detalhes": {
            "objetivo": "Preparar documento, link de salto e instruções de preenchimento.",
            "porque": "A pessoa precisa entender o formulário e chegar diretamente a ele por teclado.",
            "ordem": "O head configura a página; o body apresenta salto, cabeçalho e indicação dos campos obrigatórios.",
            "erroComum": "Usar apenas cor ou asterisco sem explicação textual para obrigatoriedade.",
            "conferir": "Use Tab e confirme que a orientação inicial e o formulário possuem ordem lógica."
          },
          "termos": [
            "form"
          ]
        },
        {
          "titulo": "Dados da pessoa responsável",
          "linhas": [
            23,
            48
          ],
          "explicacao": "O primeiro fieldset reúne dados pessoais. Cada controle possui label, id e name, enquanto type, autocomplete, required e aria-describedby melhoram preenchimento e acessibilidade.",
          "detalhes": {
            "objetivo": "Construir campos pessoais com agrupamento, rótulos e atributos adequados.",
            "porque": "fieldset e legend dão contexto; label, type e autocomplete ajudam preenchimento correto.",
            "ordem": "O fieldset abre o grupo, legend o nomeia e cada label aponta para o id de seu controle.",
            "erroComum": "for diferente do id, campo obrigatório sem required ou input sem name.",
            "conferir": "Clique em cada label e verifique se o campo correspondente recebe foco."
          },
          "termos": [
            "fieldset",
            "legend",
            "label",
            "required",
            "autocomplete",
            "ariaDescribedby"
          ]
        },
        {
          "titulo": "Necessidade e preferência de retorno",
          "linhas": [
            50,
            86
          ],
          "explicacao": "O segundo grupo utiliza select, radio, textarea e checkbox. O fieldset interno e sua legend nomeiam corretamente o conjunto de opções de retorno.",
          "detalhes": {
            "objetivo": "Combinar select, radios, textarea e checkbox sem perder semântica.",
            "porque": "Cada tipo de controle representa uma forma diferente de escolha ou entrada.",
            "ordem": "O select escolhe a necessidade; o grupo radio define uma opção; textarea recebe detalhes; checkbox registra consentimento.",
            "erroComum": "Radios com names diferentes ou opção inicial do select considerada válida indevidamente.",
            "conferir": "Escolha opções diferentes e confira se apenas um radio do grupo permanece marcado."
          },
          "termos": [
            "select",
            "radio",
            "textarea",
            "checkbox",
            "fieldset",
            "legend"
          ]
        },
        {
          "titulo": "Ações e mensagem de estado",
          "linhas": [
            88,
            95
          ],
          "explicacao": "Os botões possuem tipos explícitos. A área role=status com aria-live comunica a confirmação sem depender apenas de alterações visuais.",
          "detalhes": {
            "objetivo": "Definir envio, limpeza e feedback acessível.",
            "porque": "Tipos explícitos impedem ações acidentais e role=status anuncia a confirmação.",
            "ordem": "Os botões aparecem ao final do form e a região de status aguarda a mensagem do JavaScript.",
            "erroComum": "Botão sem type agir como submit ou status depender somente de cor.",
            "conferir": "Envie pelo botão e pela tecla Enter, depois use Limpar e observe o estado."
          },
          "termos": [
            "roleStatus",
            "submit",
            "reset"
          ]
        }
      ],
      "css": [
        {
          "titulo": "Base visual e link de salto",
          "linhas": [
            1,
            49
          ],
          "explicacao": "Variáveis, box-sizing, cores e o link de salto estabelecem uma base legível e previsível.",
          "detalhes": {
            "objetivo": "Estabelecer cores, Box Model e navegação inicial acessível.",
            "porque": "A base reduz inconsistências e torna o link de salto perceptível ao receber foco.",
            "ordem": "Variáveis e box-sizing vêm antes das regras do body e do link.",
            "erroComum": "Ocultar definitivamente o link ou usar contraste insuficiente.",
            "conferir": "Pressione Tab logo após carregar e confirme a aparição do link de salto."
          },
          "termos": [
            "focusVisible"
          ]
        },
        {
          "titulo": "Painéis e grupos do formulário",
          "linhas": [
            51,
            111
          ],
          "explicacao": "Cabeçalho, formulário, fieldset, legend e campos recebem espaçamento e contraste sem alterar sua ordem semântica.",
          "detalhes": {
            "objetivo": "Organizar visualmente formulário, fieldsets e legendas.",
            "porque": "Espaçamento e contraste ajudam a perceber grupos sem alterar a ordem semântica.",
            "ordem": "Cabeçalho e formulário criam os painéis; fieldset delimita grupos; legend os identifica.",
            "erroComum": "Remover borda e espaçamento de tal forma que os grupos fiquem indistinguíveis.",
            "conferir": "Observe se cada conjunto de campos continua claramente separado em telas grandes e pequenas."
          },
          "termos": [
            "fieldset",
            "legend"
          ]
        },
        {
          "titulo": "Controles e foco visível",
          "linhas": [
            113,
            156
          ],
          "explicacao": "Inputs, select, textarea e botões mantêm tamanho confortável. focus-visible destaca claramente o elemento ativo para navegação por teclado.",
          "detalhes": {
            "objetivo": "Garantir controles legíveis, tocáveis e navegáveis por teclado.",
            "porque": "Campos precisam acomodar texto, zoom e foco sem corte.",
            "ordem": "Uma regra comum prepara os controles e focus-visible destaca somente o elemento ativo.",
            "erroComum": "Altura fixa cortar conteúdo ou outline ser removido sem substituição.",
            "conferir": "Percorra todos os campos com Tab e confira foco e tamanho de toque."
          },
          "termos": [
            "focusVisible",
            "minHeight"
          ]
        },
        {
          "titulo": "Ações, status e telas pequenas",
          "linhas": [
            158,
            209
          ],
          "explicacao": "Botões e mensagem de status ganham estados claros. A media query preserva leitura e toque em telas estreitas.",
          "detalhes": {
            "objetivo": "Estilizar ações e feedback e reorganizar o formulário no celular.",
            "porque": "Botões e mensagens precisam permanecer claros em qualquer largura.",
            "ordem": "Estados de botão e status são definidos; a media query reduz espaços e empilha ações.",
            "erroComum": "Botões ultrapassarem a tela ou mensagem longa causar overflow.",
            "conferir": "Teste em 320 px com uma mensagem longa e confirme que tudo quebra linha."
          },
          "termos": [
            "roleStatus"
          ]
        }
      ],
      "js": [
        {
          "titulo": "Referências do formulário",
          "linhas": [
            1,
            2
          ],
          "explicacao": "querySelector localiza o formulário e a região que comunicará o resultado.",
          "detalhes": {
            "objetivo": "Localizar form e status antes de tratar eventos.",
            "porque": "As funções precisam manipular exatamente os elementos presentes no HTML.",
            "ordem": "O script carrega, querySelector encontra os elementos e as constantes ficam disponíveis aos eventos.",
            "erroComum": "Classe ou id divergente retornar null.",
            "conferir": "Compare seletores e HTML e confirme ausência de erro no console."
          },
          "termos": [
            "form",
            "roleStatus"
          ]
        },
        {
          "titulo": "Confirmação de envio",
          "linhas": [
            4,
            16
          ],
          "explicacao": "O evento submit impede recarregamento, lê os dados com FormData, cria uma mensagem com textContent, revela o status e move o foco para a confirmação.",
          "detalhes": {
            "objetivo": "Tratar o submit, ler dados e produzir feedback seguro.",
            "porque": "O evento submit inclui clique e Enter; FormData lê campos pelo name; textContent evita interpretar HTML.",
            "ordem": "O envio é interceptado, os dados são lidos, a mensagem é criada, o status é revelado e recebe foco.",
            "erroComum": "Campo sem name não aparecer ou usar innerHTML com dados digitados.",
            "conferir": "Envie dados diferentes e confirme que a mensagem usa o valor atual sem recarregar a página."
          },
          "termos": [
            "submit",
            "preventDefault",
            "formData",
            "textContent",
            "focus"
          ]
        },
        {
          "titulo": "Limpeza do estado",
          "linhas": [
            17,
            20
          ],
          "explicacao": "O evento reset volta a ocultar a mensagem e remove o texto anterior.",
          "detalhes": {
            "objetivo": "Sincronizar a limpeza dos campos com a mensagem de confirmação.",
            "porque": "Uma confirmação antiga não pode permanecer depois que os dados foram apagados.",
            "ordem": "O reset padrão limpa os controles e o callback oculta e esvazia a região de status.",
            "erroComum": "Limpar apenas os campos e deixar feedback desatualizado.",
            "conferir": "Envie, depois limpe e confirme que a mensagem também desaparece."
          },
          "termos": [
            "reset",
            "textContent"
          ]
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 03 - Formulário acessível de cadastro",
      "descricao": "Nesta atividade, vamos construir um formulário profissional de cadastro com rótulos associados, agrupamento por fieldset e legend, tipos de campo adequados, preenchimento automático, campos obrigatórios e uma confirmação acessível.\n\nAlteração obrigatória: acrescente um campo opcional relacionado ao atendimento, mantendo label, id e name corretamente associados.\n\nTeste o formulário com mouse e teclado, envie dados válidos, confira a mensagem de confirmação e use o botão de limpeza.\n\nEntrega: anexar o link do repositório do GitHub."
    },
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false,
      "aceitarEquivalencias": true,
      "htmlEstrutura": {
        "idsObrigatorios": [
          "conteudo",
          "cadastroCliente",
          "nome",
          "email",
          "telefone",
          "servico",
          "retornoEmail",
          "retornoTelefone",
          "mensagem",
          "termos",
          "statusCadastro"
        ],
        "tagsMinimas": {
          "main": 1,
          "form": 1,
          "fieldset": 1,
          "legend": 1,
          "label": 3,
          "input": 3,
          "select": 1,
          "option": 1,
          "textarea": 1,
          "button": 1,
          "h1": 1
        },
        "referenciasArquivos": {
          "css": "estilo.css",
          "js": "script.js"
        },
        "seletoresObrigatorios": [
          {
            "selector": "label[for=\"nome\"]",
            "message": "Associe um label ao campo nome."
          },
          {
            "selector": "label[for=\"email\"]",
            "message": "Associe um label ao campo e-mail."
          },
          {
            "selector": "button[type=\"submit\"]",
            "message": "Inclua um botão de envio com type=\"submit\"."
          }
        ],
        "rotulosAssociados": [
          "nome",
          "email",
          "telefone",
          "servico",
          "mensagem",
          "termos"
        ],
        "proibirTabindexPositivo": false,
        "atributosObrigatorios": [
          {
            "selector": "#nome",
            "attribute": "required"
          },
          {
            "selector": "#email",
            "attribute": "type",
            "value": "email"
          },
          {
            "selector": "#email",
            "attribute": "required"
          },
          {
            "selector": "#servico",
            "attribute": "required"
          },
          {
            "selector": "#termos",
            "attribute": "type",
            "value": "checkbox"
          },
          {
            "selector": "#termos",
            "attribute": "required"
          }
        ]
      },
      "jsComportamento": [
        {
          "event": "submit",
          "triggerId": "cadastroCliente",
          "acoes": [
            {
              "type": "preventDefault"
            },
            {
              "type": "formData"
            },
            {
              "type": "dataGet"
            },
            {
              "type": "text",
              "targetId": "statusCadastro"
            },
            {
              "type": "hidden",
              "targetId": "statusCadastro"
            },
            {
              "type": "focus",
              "targetId": "statusCadastro"
            }
          ]
        },
        {
          "event": "reset",
          "triggerId": "cadastroCliente",
          "acoes": [
            {
              "type": "hidden",
              "targetId": "statusCadastro"
            },
            {
              "type": "text",
              "targetId": "statusCadastro"
            }
          ]
        }
      ],
      "politica": "conceitos_essenciais"
    },
    "glossario": [
      {
        "id": "form",
        "termo": "form",
        "categoria": "Elemento semântico",
        "traducao": "Formulário",
        "explicacao": "Agrupa controles que coletam e enviam dados.",
        "erroComum": "Campos fora do form podem não participar do envio.",
        "linguagem": "html",
        "exercicio": "FE03"
      },
      {
        "id": "fieldset",
        "termo": "fieldset",
        "categoria": "Elemento de formulário",
        "traducao": "Grupo de campos",
        "explicacao": "Agrupa controles relacionados de forma visual e semântica.",
        "erroComum": "Usar apenas div perde o agrupamento anunciado por leitores de tela.",
        "linguagem": "html",
        "exercicio": "FE03"
      },
      {
        "id": "legend",
        "termo": "legend",
        "categoria": "Elemento de formulário",
        "traducao": "Legenda do grupo",
        "explicacao": "Nomeia um fieldset e explica o tema daquele conjunto de campos.",
        "erroComum": "Colocar legend fora do fieldset quebra a relação semântica.",
        "linguagem": "html",
        "exercicio": "FE03"
      },
      {
        "id": "label",
        "termo": "label",
        "categoria": "Elemento de formulário",
        "traducao": "Rótulo",
        "explicacao": "Identifica claramente a informação esperada em um campo.",
        "erroComum": "O atributo for precisa corresponder ao id do controle.",
        "linguagem": "html",
        "exercicio": "FE03"
      },
      {
        "id": "required",
        "termo": "required",
        "categoria": "Atributo",
        "traducao": "Obrigatório",
        "explicacao": "Informa ao navegador que o campo precisa ser preenchido antes do envio.",
        "erroComum": "Apenas escrever um asterisco não cria validação funcional.",
        "linguagem": "html",
        "exercicio": "FE03"
      },
      {
        "id": "autocomplete",
        "termo": "autocomplete",
        "categoria": "Atributo",
        "traducao": "Preenchimento automático",
        "explicacao": "Informa o tipo de dado para que o navegador ajude a preencher o campo.",
        "erroComum": "Valor inadequado pode oferecer uma informação errada ao usuário.",
        "linguagem": "html",
        "exercicio": "FE03"
      },
      {
        "id": "ariaDescribedby",
        "termo": "aria-describedby",
        "categoria": "Atributo de acessibilidade",
        "traducao": "Descrito por",
        "explicacao": "Liga o campo a um texto complementar, como instrução ou formato esperado.",
        "erroComum": "O id referenciado precisa existir e ser único.",
        "linguagem": "html",
        "exercicio": "FE03"
      },
      {
        "id": "select",
        "termo": "select",
        "categoria": "Controle de formulário",
        "traducao": "Lista de seleção",
        "explicacao": "Permite escolher uma opção dentro de uma lista definida.",
        "erroComum": "Uma opção inicial sem valor deve continuar sendo tratada como não selecionada quando obrigatória.",
        "linguagem": "html",
        "exercicio": "FE03"
      },
      {
        "id": "radio",
        "termo": "radio",
        "categoria": "Tipo de input",
        "traducao": "Escolha única",
        "explicacao": "Permite escolher uma opção dentro de um grupo com o mesmo name.",
        "erroComum": "Names diferentes fazem os radios deixarem de formar um grupo.",
        "linguagem": "html",
        "exercicio": "FE03"
      },
      {
        "id": "textarea",
        "termo": "textarea",
        "categoria": "Controle de formulário",
        "traducao": "Texto multilinha",
        "explicacao": "Recebe textos maiores, como uma descrição.",
        "erroComum": "Inserir o valor inicial no atributo value não funciona como em input.",
        "linguagem": "html",
        "exercicio": "FE03"
      },
      {
        "id": "checkbox",
        "termo": "checkbox",
        "categoria": "Tipo de input",
        "traducao": "Marcação independente",
        "explicacao": "Representa uma escolha que pode estar marcada ou desmarcada.",
        "erroComum": "Tratar checkbox como texto sem verificar checked produz leitura incorreta.",
        "linguagem": "html/js",
        "exercicio": "FE03"
      },
      {
        "id": "roleStatus",
        "termo": "role=\"status\"",
        "categoria": "Função de acessibilidade",
        "traducao": "Região de status",
        "explicacao": "Faz mensagens atualizadas serem anunciadas sem deslocar o foco automaticamente.",
        "erroComum": "Usar apenas cor não comunica a confirmação para todos.",
        "linguagem": "html",
        "exercicio": "FE03"
      },
      {
        "id": "focusVisible",
        "termo": ":focus-visible",
        "categoria": "Pseudoclasse",
        "traducao": "Foco visível",
        "explicacao": "Destaca o controle ativo durante navegação por teclado.",
        "erroComum": "Remover outline sem substituto prejudica acessibilidade.",
        "linguagem": "css",
        "exercicio": "FE03"
      },
      {
        "id": "minHeight",
        "termo": "min-height",
        "categoria": "Propriedade CSS",
        "traducao": "Altura mínima",
        "explicacao": "Garante uma área mínima sem impedir que o conteúdo aumente a caixa.",
        "erroComum": "Usar height fixa pode cortar textos e mensagens.",
        "linguagem": "css",
        "exercicio": "FE03"
      },
      {
        "id": "submit",
        "termo": "submit",
        "categoria": "Evento",
        "traducao": "Envio",
        "explicacao": "É disparado quando o formulário é enviado pelo botão ou pela tecla Enter.",
        "erroComum": "Escutar apenas o clique do botão ignora outras formas válidas de envio.",
        "linguagem": "javascript",
        "exercicio": "FE03"
      },
      {
        "id": "preventDefault",
        "termo": "preventDefault",
        "categoria": "Método do evento",
        "traducao": "Impedir ação padrão",
        "explicacao": "Impede o recarregamento padrão para que a plataforma trate os dados na página.",
        "erroComum": "Usar sem explicar pode esconder que um formulário real normalmente envia dados.",
        "linguagem": "javascript",
        "exercicio": "FE03"
      },
      {
        "id": "formData",
        "termo": "FormData",
        "categoria": "Objeto da Web API",
        "traducao": "Dados do formulário",
        "explicacao": "Lê os campos associados ao formulário usando seus atributos name.",
        "erroComum": "Campo sem name não aparece nos dados coletados.",
        "linguagem": "javascript",
        "exercicio": "FE03"
      },
      {
        "id": "textContent",
        "termo": "textContent",
        "categoria": "Propriedade do DOM",
        "traducao": "Conteúdo textual",
        "explicacao": "Insere texto sem interpretar tags HTML.",
        "erroComum": "Usar innerHTML com conteúdo do usuário pode criar risco de injeção.",
        "linguagem": "javascript",
        "exercicio": "FE03"
      },
      {
        "id": "focus",
        "termo": "focus",
        "categoria": "Método",
        "traducao": "Mover foco",
        "explicacao": "Move o foco para um elemento, ajudando o usuário a encontrar a confirmação.",
        "erroComum": "Mover foco sem necessidade pode interromper a navegação.",
        "linguagem": "javascript",
        "exercicio": "FE03"
      },
      {
        "id": "reset",
        "termo": "reset",
        "categoria": "Evento",
        "traducao": "Limpeza do formulário",
        "explicacao": "É disparado quando os campos voltam aos valores iniciais.",
        "erroComum": "A mensagem de confirmação também precisa ser limpa para não ficar desatualizada.",
        "linguagem": "javascript",
        "exercicio": "FE03"
      }
    ],
    "dicasProgressivas": {
      "html": [
        "Relembre: cada campo precisa de rótulo e cada grupo precisa de contexto.",
        "Localize: confira for/id, name, type, required e autocomplete.",
        "Compare: radios do mesmo grupo compartilham o mesmo name.",
        "Estrutura parcial: <label for=\"campo\">...</label><input id=\"campo\" name=\"campo\" ...>.",
        "Exemplo semelhante: monte um formulário de inscrição com contato e preferência de turno."
      ],
      "css": [
        "Relembre: formulários precisam permanecer legíveis com teclado, zoom e celular.",
        "Localize: confira controles, foco e área das ações.",
        "Compare: use min-height quando o conteúdo puder crescer.",
        "Estrutura parcial: controle:focus-visible { outline: ...; outline-offset: ...; }.",
        "Exemplo semelhante: estilize outro formulário mantendo rótulos visíveis e contraste."
      ],
      "js": [
        "Relembre: trate o evento submit do formulário, não apenas o clique.",
        "Localize: confira preventDefault, FormData, status e reset.",
        "Compare: campos sem name não entram no FormData.",
        "Estrutura parcial: formulario.addEventListener(\"submit\", evento => { evento.preventDefault(); ... });.",
        "Exemplo semelhante: gere uma confirmação de reserva usando textContent."
      ]
    },
    "comportamento": {
      "titulo": "Teste comportamental do formulário",
      "instrucao": "Preencha os campos necessários e envie. A aprovação depende do envio produzir uma confirmação visível e preenchida, sem exigir uma frase específica.",
      "criterios": [
        {
          "id": "envio-realizado",
          "tipo": "event",
          "evento": "submit",
          "seletor": "#cadastroCliente",
          "rotulo": "Enviar o formulário preenchido"
        },
        {
          "id": "confirmacao-visivel",
          "tipo": "notHidden",
          "seletor": "#statusCadastro",
          "rotulo": "A confirmação de cadastro ficou visível"
        },
        {
          "id": "confirmacao-preenchida",
          "tipo": "textNonEmpty",
          "seletor": "#statusCadastro",
          "rotulo": "A confirmação apresenta os dados processados"
        }
      ]
    },
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 4,
    "studentReferenceStripped": true,
    "codigo": "FE04",
    "titulo": "FE04 - CSS: seletores, cascata, variáveis e Box Model",
    "nomeCurto": "CSS: seletores, cascata, variáveis e Box Model",
    "tema": "Fundamentos de estilização e controle do espaço",
    "objetivo": "Aplicar diferentes tipos de seletores, compreender a cascata, reutilizar valores com variáveis e controlar o Box Model de componentes.",
    "produto": "Vitrine profissional de planos com cartão recomendado e alternância entre temas claro e escuro.",
    "contextoProfissional": "Sistemas de design usam variáveis e regras reutilizáveis para manter consistência. Seletores e especificidade precisam ser planejados para evitar estilos difíceis de manter.",
    "alteracaoObrigatoria": "Crie uma variável visual adicional e use-a em pelo menos dois seletores. Personalize o cartão recomendado mantendo seletores de classe, id e atributo semanticamente equivalentes.",
    "retomadas": [
      "HTML semântico",
      "atributos id e class",
      "ligação entre HTML, CSS e JavaScript"
    ],
    "novos": [
      "seletores CSS",
      "cascata",
      "especificidade",
      "variáveis CSS",
      "var()",
      "Box Model",
      "box-sizing",
      "pseudoclasses"
    ],
    "pasta": "exercicio-04",
    "repositorio": "atividades-frontend-sub",
    "classroomUrl": "https://classroom.google.com/",
    "githubUrl": "https://github.com/",
    "tempoMinimoSegundos": 300,
    "ordemArquivos": [
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
    "linguagens": {
      "html": "html",
      "css": "css",
      "js": "js"
    },
    "passos": {
      "html": [
        {
          "titulo": "Conexão dos arquivos e cabeçalho",
          "linhas": [
            1,
            17
          ],
          "explicacao": "O documento conecta CSS e JavaScript, apresenta o produto e cria um botão acessível com aria-pressed e uma região de status.",
          "detalhes": {
            "objetivo": "Preparar a página e o controle de tema com estado acessível.",
            "porque": "CSS e JavaScript precisam estar conectados e o botão precisa comunicar sua alternância.",
            "ordem": "O head conecta os arquivos; o header apresenta o exercício; o botão e o status ficam prontos para o script.",
            "erroComum": "Caminho incorreto ou aria-pressed não acompanhar o tema.",
            "conferir": "Verifique Network/console e clique no botão observando texto, aparência e atributo."
          },
          "termos": [
            "ariaPressed"
          ]
        },
        {
          "titulo": "Cartões com diferentes identificadores",
          "linhas": [
            19,
            43
          ],
          "explicacao": "Os artigos reutilizam a classe cartao. O plano recomendado combina classe adicional, id e atributo data-status para demonstrar diferentes seletores.",
          "detalhes": {
            "objetivo": "Criar uma base HTML que permita comparar seletores de classe, ID e atributo.",
            "porque": "O mesmo componente pode receber regra geral e exceções com prioridades diferentes.",
            "ordem": "Todos recebem cartao; o recomendado recebe classe extra, id e data-status para demonstrar camadas.",
            "erroComum": "Repetir id ou escrever seletor que não corresponde ao atributo.",
            "conferir": "Inspecione cada artigo e liste quais seletores CSS conseguem selecioná-lo."
          },
          "termos": [
            "classSelector",
            "idSelector",
            "dataAttribute"
          ]
        },
        {
          "titulo": "Resumo e encerramento",
          "linhas": [
            45,
            55
          ],
          "explicacao": "O aside sintetiza os conceitos e o footer encerra a página sem alterar a estrutura principal.",
          "detalhes": {
            "objetivo": "Separar conteúdo complementar e identificação final.",
            "porque": "O aside resume conceitos sem interromper a lista principal de planos.",
            "ordem": "Depois dos cartões, o aside acrescenta orientação e o footer encerra o documento.",
            "erroComum": "Usar aside para informação obrigatória ou colocar elementos fora do body.",
            "conferir": "Leia a página sem CSS e confirme que a ordem continua compreensível."
          },
          "termos": [
            "boxModel"
          ]
        }
      ],
      "css": [
        {
          "titulo": "Variáveis, seletor universal e elemento",
          "linhas": [
            1,
            23
          ],
          "explicacao": "As propriedades personalizadas centralizam cores e medidas. O seletor universal aplica border-box e o seletor body define a base visual.",
          "detalhes": {
            "objetivo": "Compreender variáveis, seletor universal e regra de elemento.",
            "porque": "Esses níveis preparam valores reutilizáveis e uma base comum antes dos componentes.",
            "ordem": "Variáveis são declaradas em :root, * ajusta caixas e body define aparência global.",
            "erroComum": "Confundir a função universal com uma regra específica de componente.",
            "conferir": "Localize onde cada variável é consumida por var() e altere uma delas temporariamente."
          },
          "termos": [
            "root",
            "customProperty",
            "universal",
            "boxModel"
          ]
        },
        {
          "titulo": "Cascata e tema alternativo",
          "linhas": [
            25,
            73
          ],
          "explicacao": "A classe tema-claro redefine variáveis. Por causa da cascata, todos os componentes que usam var() atualizam sua aparência sem repetir regras.",
          "detalhes": {
            "objetivo": "Observar como a cascata troca valores sem duplicar todos os componentes.",
            "porque": "Redefinir variáveis em uma classe de estado permite temas mais fáceis de manter.",
            "ordem": "As variáveis padrão existem em :root; tema-claro redefine algumas quando a classe está no body.",
            "erroComum": "Aplicar a classe no elemento errado ou colocar valor fixo onde deveria haver var().",
            "conferir": "Ative a classe no DevTools e confirme quais propriedades mudam por herança das variáveis."
          },
          "termos": [
            "cascade",
            "var",
            "customProperty"
          ]
        },
        {
          "titulo": "Interação do botão e foco visível",
          "linhas": [
            75,
            99
          ],
          "explicacao": "O botão recebe estados de interação claros para mouse e teclado. O foco visível ajuda quem navega sem o mouse.",
          "detalhes": {
            "objetivo": "Identificar estados de interação e foco acessível no botão.",
            "porque": "Interfaces precisam indicar visualmente quando um controle está sob o mouse ou recebeu foco pelo teclado.",
            "ordem": "Primeiro é definido o botão; depois hover e focus-visible ajustam o retorno visual.",
            "erroComum": "Remover o outline sem fornecer outro indicador visível de foco.",
            "conferir": "Use Tab para chegar ao botão e confirme que o foco continua claramente perceptível."
          },
          "termos": [
            "focusVisible"
          ]
        },
        {
          "titulo": "Seletores e Box Model dos cartões",
          "linhas": [
            101,
            156
          ],
          "explicacao": "A classe geral define width, margin, padding e border. Classe composta, id e atributo acrescentam destaque em camadas de especificidade.",
          "detalhes": {
            "objetivo": "Comparar seletor de classe, classe composta, ID e atributo no Box Model.",
            "porque": "As regras mostram reutilização, exceções e especificidade em um mesmo componente.",
            "ordem": "A classe geral cria a caixa; seletores mais específicos acrescentam destaques ao plano recomendado.",
            "erroComum": "Usar seletor mais forte desnecessariamente ou confundir margin, padding e border.",
            "conferir": "No painel Computed, identifique de qual seletor veio cada valor do cartão recomendado."
          },
          "termos": [
            "classSelector",
            "idSelector",
            "attributeSelector",
            "specificity",
            "margin",
            "padding",
            "border"
          ]
        },
        {
          "titulo": "Adaptação para telas pequenas",
          "linhas": [
            158,
            176
          ],
          "explicacao": "O rodapé finaliza a página e a media query reduz espaçamentos e amplia o botão em telas estreitas.",
          "detalhes": {
            "objetivo": "Concluir a composição e adaptar a interface para celular.",
            "porque": "O mesmo conteúdo precisa permanecer legível e fácil de tocar em larguras menores.",
            "ordem": "Depois dos componentes principais, a media query sobrescreve apenas espaçamentos e largura do botão.",
            "erroComum": "Usar larguras fixas que causem rolagem horizontal ou deixar o botão pequeno demais para toque.",
            "conferir": "Teste o preview em 320 px e confirme que cartões e botão permanecem dentro da tela."
          },
          "termos": [
            "mediaQuery"
          ]
        }
      ],
      "js": [
        {
          "titulo": "Referências dos elementos",
          "linhas": [
            1,
            2
          ],
          "explicacao": "querySelector localiza o botão e a região de status.",
          "detalhes": {
            "objetivo": "Guardar botão e status em constantes para uso no evento.",
            "porque": "Referências claras evitam repetir seletores e facilitam conferir os elementos controlados.",
            "ordem": "querySelector executa ao carregar o script e retorna cada elemento.",
            "erroComum": "Selecionar o id errado ou executar antes do DOM sem defer.",
            "conferir": "Confirme o atributo defer e compare cada seletor com o HTML."
          },
          "termos": [
            "classListToggle",
            "ariaPressed"
          ]
        },
        {
          "titulo": "Alternância de estado",
          "linhas": [
            4,
            10
          ],
          "explicacao": "classList.toggle muda a classe do body; aria-pressed, texto do botão e mensagem são atualizados de forma segura.",
          "detalhes": {
            "objetivo": "Alternar classe visual e manter atributos, textos e mensagem sincronizados.",
            "porque": "A mudança precisa ser percebida visualmente e anunciada de forma acessível.",
            "ordem": "O clique chama toggle, recebe o booleano do novo estado e usa esse valor nas atualizações.",
            "erroComum": "Inverter os textos ou atualizar aria-pressed com valor diferente do estado real.",
            "conferir": "Clique repetidamente e observe classe do body, atributo, rótulo e mensagem."
          },
          "termos": [
            "classListToggle",
            "ariaPressed",
            "boolean"
          ]
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 04 - CSS: seletores, cascata, variáveis e Box Model",
      "descricao": "Nesta atividade, vamos construir uma vitrine de planos e praticar seletores de elemento, classe, id, atributo e pseudoclasse, além de cascata, especificidade, variáveis CSS e Box Model.\n\nAlteração obrigatória: crie uma variável visual adicional, use-a em pelo menos dois seletores e personalize o cartão recomendado sem remover os conceitos exigidos.\n\nTeste os dois temas, o foco do botão, o Box Model no DevTools e a página em tela pequena.\n\nEntrega: anexar o link do repositório do GitHub."
    },
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false,
      "aceitarEquivalencias": true,
      "htmlEstrutura": {
        "idsObrigatorios": [
          "alternarTema",
          "statusTema",
          "conteudo",
          "titulo-planos",
          "planoDestaque",
          "titulo-resumo"
        ],
        "tagsMinimas": {
          "header": 1,
          "main": 1,
          "section": 1,
          "article": 1,
          "aside": 1,
          "footer": 1,
          "button": 1,
          "h1": 1,
          "h2": 1,
          "h3": 1
        },
        "referenciasArquivos": {
          "css": "estilo.css",
          "js": "script.js"
        },
        "seletoresObrigatorios": [
          {
            "selector": "#alternarTema[aria-pressed]",
            "message": "Inclua o botão de tema com aria-pressed."
          }
        ],
        "atributosObrigatorios": [
          {
            "selector": "#alternarTema",
            "attribute": "type",
            "value": "button"
          }
        ]
      },
      "cssEstrutura": {
        "minimoVariaveis": 3,
        "minimoUsosVar": 3,
        "tiposSeletores": [
          "elemento",
          "classe",
          "id",
          "atributo",
          "pseudoclasse"
        ],
        "exigirBoxSizing": true,
        "exigirBoxModelCompleto": true,
        "proibir": [],
        "minimoTiposSeletores": 2
      },
      "jsComportamento": [
        {
          "event": "click",
          "triggerId": "alternarTema",
          "acoes": [
            {
              "type": "bodyClassToggle"
            },
            {
              "type": "setAttribute",
              "targetId": "alternarTema",
              "attribute": "aria-pressed"
            },
            {
              "type": "text",
              "targetId": "alternarTema"
            },
            {
              "type": "text",
              "targetId": "statusTema"
            }
          ]
        }
      ],
      "politica": "conceitos_essenciais"
    },
    "glossario": [
      {
        "id": "root",
        "termo": ":root",
        "categoria": "Pseudoclasse",
        "traducao": "Raiz do documento",
        "explicacao": "Seleciona o elemento raiz e é um local comum para declarar variáveis CSS globais.",
        "erroComum": "Declarar variável com nome diferente do usado em var() impede a aplicação.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "customProperty",
        "termo": "propriedade personalizada",
        "categoria": "Recurso CSS",
        "traducao": "Variável CSS",
        "explicacao": "Guarda cores e medidas reutilizáveis iniciadas por dois hífens.",
        "erroComum": "Esquecer os dois hífens torna a declaração inválida.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "var",
        "termo": "var()",
        "categoria": "Função CSS",
        "traducao": "Usar variável",
        "explicacao": "Recupera o valor de uma propriedade personalizada.",
        "erroComum": "Referenciar uma variável inexistente pode invalidar a propriedade.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "universal",
        "termo": "*",
        "categoria": "Seletor universal",
        "traducao": "Todos os elementos",
        "explicacao": "Seleciona todos os elementos para aplicar uma preparação comum.",
        "erroComum": "Regras pesadas no seletor universal podem afetar a página inteira.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "cascade",
        "termo": "cascata",
        "categoria": "Mecanismo CSS",
        "traducao": "Combinação de regras",
        "explicacao": "Decide qual declaração vence considerando origem, importância, especificidade e ordem.",
        "erroComum": "Achar que a última regra sempre vence ignora especificidade.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "specificity",
        "termo": "especificidade",
        "categoria": "Regra de prioridade",
        "traducao": "Peso do seletor",
        "explicacao": "Compara o peso de seletores para decidir qual regra prevalece.",
        "erroComum": "Usar muitos IDs e !important dificulta manutenção.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "classSelector",
        "termo": ".classe",
        "categoria": "Seletor de classe",
        "traducao": "Selecionar por classe",
        "explicacao": "Aplica a mesma regra a vários elementos com a classe indicada.",
        "erroComum": "Esquecer o ponto faz o navegador procurar uma tag.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "idSelector",
        "termo": "#id",
        "categoria": "Seletor de ID",
        "traducao": "Selecionar identificador único",
        "explicacao": "Seleciona um elemento por seu id e possui alta especificidade.",
        "erroComum": "Reutilizar o mesmo id em vários elementos é inválido.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "attributeSelector",
        "termo": "[atributo]",
        "categoria": "Seletor de atributo",
        "traducao": "Selecionar por atributo",
        "explicacao": "Seleciona elementos que possuem um atributo ou valor específico.",
        "erroComum": "Aspas ou valor divergente impedem a correspondência.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "boxModel",
        "termo": "Box Model",
        "categoria": "Modelo de caixa",
        "traducao": "Conteúdo, preenchimento, borda e margem",
        "explicacao": "Explica como o navegador calcula o espaço ocupado por cada elemento.",
        "erroComum": "Confundir padding com margin altera o espaço interno e externo.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "margin",
        "termo": "margin",
        "categoria": "Propriedade CSS",
        "traducao": "Margem externa",
        "explicacao": "Cria espaço fora da borda do elemento.",
        "erroComum": "Usar margin quando o objetivo é espaço interno produz layout diferente.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "padding",
        "termo": "padding",
        "categoria": "Propriedade CSS",
        "traducao": "Preenchimento interno",
        "explicacao": "Cria espaço entre o conteúdo e a borda.",
        "erroComum": "Padding soma ao tamanho quando box-sizing não é border-box.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "border",
        "termo": "border",
        "categoria": "Propriedade CSS",
        "traducao": "Borda",
        "explicacao": "Desenha o limite visual da caixa.",
        "erroComum": "Definir apenas cor sem estilo e espessura pode não mostrar borda.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "hover",
        "termo": ":hover",
        "categoria": "Pseudoclasse",
        "traducao": "Ponteiro sobre o elemento",
        "explicacao": "Aplica estilo enquanto o ponteiro está sobre um elemento.",
        "erroComum": "Não deve ser a única forma de revelar informação importante.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "focusVisible",
        "termo": ":focus-visible",
        "categoria": "Pseudoclasse",
        "traducao": "Foco por teclado",
        "explicacao": "Destaca a interação de teclado sem depender do mouse.",
        "erroComum": "Remover o foco deixa usuários sem saber onde estão.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "classListToggle",
        "termo": "classList.toggle",
        "categoria": "Método do DOM",
        "traducao": "Alternar classe",
        "explicacao": "Adiciona uma classe quando ausente e remove quando presente.",
        "erroComum": "Alternar a classe no elemento errado não muda as variáveis esperadas.",
        "linguagem": "javascript",
        "exercicio": "FE04"
      },
      {
        "id": "ariaPressed",
        "termo": "aria-pressed",
        "categoria": "Atributo de acessibilidade",
        "traducao": "Estado de botão pressionado",
        "explicacao": "Comunica se um botão de alternância está ativo.",
        "erroComum": "O valor precisa acompanhar a classe visual aplicada.",
        "linguagem": "html/js",
        "exercicio": "FE04"
      },
      {
        "id": "dataAttribute",
        "termo": "data-*",
        "categoria": "Atributo personalizado",
        "traducao": "Dado do elemento",
        "explicacao": "Armazena informação específica da aplicação sem inventar atributos inválidos.",
        "erroComum": "O seletor CSS precisa usar exatamente o nome e valor declarados.",
        "linguagem": "html/css",
        "exercicio": "FE04"
      },
      {
        "id": "boolean",
        "termo": "booleano",
        "categoria": "Tipo lógico",
        "traducao": "Verdadeiro ou falso",
        "explicacao": "Representa o estado retornado por classList.toggle e orienta as mensagens do botão.",
        "erroComum": "Comparar booleano com as strings \"true\" ou \"false\" altera a lógica.",
        "linguagem": "javascript",
        "exercicio": "FE04"
      }
    ],
    "dicasProgressivas": {
      "html": [
        "Relembre: classes podem ser reutilizadas; IDs devem ser únicos; data-* guarda dados.",
        "Localize: compare os atributos dos cartões com os seletores CSS.",
        "Compare: o valor de aria-pressed precisa iniciar coerente com o tema.",
        "Estrutura parcial: <article class=\"cartao destaque\" id=\"...\" data-status=\"...\">.",
        "Exemplo semelhante: diferencie produtos comuns e recomendados com classes e atributos próprios."
      ],
      "css": [
        "Relembre: a cascata escolhe regras; o Box Model calcula o espaço.",
        "Localize: confira :root, var(), classe geral e seletores mais específicos.",
        "Compare: margin é externo, padding é interno e border fica entre ambos.",
        "Estrutura parcial: .componente { margin: ...; padding: ...; border: ...; }.",
        "Exemplo semelhante: crie tema alternativo redefinindo apenas variáveis em uma classe do body."
      ],
      "js": [
        "Relembre: classList.toggle retorna o novo estado como booleano.",
        "Localize: confira onde a classe é aplicada e quais textos dependem dela.",
        "Compare: aria-pressed recebe o mesmo estado usado na interface.",
        "Estrutura parcial: const ativo = elemento.classList.toggle(\"classe\"); depois use ativo nas mensagens.",
        "Exemplo semelhante: alterne um modo de alto contraste em outra página."
      ]
    },
    "comportamento": {
      "titulo": "Teste comportamental do tema",
      "instrucao": "Execute o preview e altere o tema. O requisito essencial é existir uma mudança visual real após o clique.",
      "criterios": [
        {
          "id": "acao-principal",
          "tipo": "event",
          "evento": "click",
          "seletor": "#alternarTema",
          "rotulo": "Acionar o botão de tema"
        },
        {
          "id": "classe-tema",
          "tipo": "visualChanged",
          "seletor": "body",
          "propriedades": [
            "color",
            "backgroundColor",
            "borderColor",
            "boxShadow",
            "fontWeight"
          ],
          "rotulo": "O tema produziu uma mudança visual real"
        }
      ]
    },
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 5,
    "studentReferenceStripped": true,
    "codigo": "FE05",
    "titulo": "FE05 - Layout profissional com Flexbox",
    "nomeCurto": "Layout profissional com Flexbox",
    "tema": "Distribuição, alinhamento e adaptação de componentes",
    "objetivo": "Construir um layout profissional com contêineres flexíveis, distribuição de espaço, alinhamento, quebra de linha e adaptação para telas pequenas.",
    "produto": "Painel profissional de serviços com cartões flexíveis, indicadores laterais e alternância de direção.",
    "contextoProfissional": "Interfaces administrativas e páginas de serviços precisam reorganizar componentes conforme o espaço disponível. Flexbox facilita alinhamento em um eixo, distribuição de espaço e adaptação de grupos de componentes.",
    "alteracaoObrigatoria": "Adicione um quarto cartão de serviço com conteúdo próprio e mantenha-o responsivo usando flex ou flex-basis. Personalize o espaçamento do layout sem usar Grid e sem alterar a ordem semântica do HTML.",
    "retomadas": [
      "HTML semântico",
      "seletores e classes",
      "variáveis CSS",
      "Box Model"
    ],
    "novos": [
      "display flex",
      "eixo principal e transversal",
      "flex-direction",
      "justify-content",
      "align-items",
      "flex-wrap",
      "gap",
      "flex-basis",
      "layout responsivo"
    ],
    "pasta": "exercicio-05",
    "repositorio": "atividades-frontend-sub",
    "classroomUrl": "https://classroom.google.com/",
    "githubUrl": "https://github.com/",
    "tempoMinimoSegundos": 300,
    "ordemArquivos": [
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
    "linguagens": {
      "html": "html",
      "css": "css",
      "js": "js"
    },
    "passos": {
      "html": [
        {
          "titulo": "Cabeçalho e controles",
          "linhas": [
            1,
            33
          ],
          "explicacao": "A página conecta os arquivos, oferece salto para o conteúdo e reúne título, botão de alternância e navegação. aria-pressed e aria-controls comunicam o estado do controle.",
          "detalhes": {
            "objetivo": "Preparar apresentação, navegação e botão que controla a demonstração de Flexbox.",
            "porque": "A estrutura semântica e os atributos acessíveis devem existir antes do layout visual.",
            "ordem": "O head conecta arquivos; header apresenta; botão aponta para a lista controlada; nav oferece navegação.",
            "erroComum": "aria-controls apontar para id inexistente ou aria-pressed ficar desatualizado.",
            "conferir": "Compare atributos do botão com o id da lista e teste o controle com teclado."
          },
          "termos": [
            "ariaControls",
            "ariaPressed"
          ]
        },
        {
          "titulo": "Área principal e cartões",
          "linhas": [
            35,
            104
          ],
          "explicacao": "main contém uma área de serviços e um aside de indicadores. A lista reúne artigos independentes que serão distribuídos pelo Flexbox.",
          "detalhes": {
            "objetivo": "Organizar conteúdo, aside e cartões que se tornarão itens flexíveis.",
            "porque": "Flexbox atua nos filhos diretos, portanto a hierarquia HTML define quais elementos serão distribuídos.",
            "ordem": "main contém layout-principal; a seção recebe lista-servicos; cada article vira item da lista; aside ocupa outra faixa.",
            "erroComum": "Esperar que netos sejam itens do contêiner principal ou colocar artigo fora da lista.",
            "conferir": "Desenhe a árvore pai-filho e marque quais elementos são filhos diretos de cada contêiner flexível."
          },
          "termos": [
            "flexContainer",
            "flexItem"
          ]
        },
        {
          "titulo": "Orientações e encerramento",
          "linhas": [
            106,
            122
          ],
          "explicacao": "A seção final resume as propriedades praticadas e o rodapé identifica a atividade.",
          "detalhes": {
            "objetivo": "Retomar as propriedades utilizadas e finalizar a página.",
            "porque": "A seção de orientação ajuda a relacionar o resultado visual ao conceito, sem substituir a prática.",
            "ordem": "Após o layout demonstrativo, a orientação resume propriedades e o footer identifica a atividade.",
            "erroComum": "Duplicar instruções ou usar lista sem relação com o conteúdo praticado.",
            "conferir": "Associe cada termo da orientação a uma regra existente no CSS."
          },
          "termos": [
            "justifyContent",
            "alignItems",
            "flexWrap",
            "gap"
          ]
        }
      ],
      "css": [
        {
          "titulo": "Base visual e contêiner do topo",
          "linhas": [
            1,
            121
          ],
          "explicacao": "Variáveis, Box Model e estilos básicos preparam o projeto. topo-conteudo usa Flexbox para distribuir apresentação e controle.",
          "detalhes": {
            "objetivo": "Preparar a aparência e ativar Flexbox no topo.",
            "porque": "O topo precisa distribuir texto e controle e continuar quebrando corretamente em telas menores.",
            "ordem": "Variáveis e base vêm primeiro; depois topo-conteudo recebe display:flex, alinhamentos e gap.",
            "erroComum": "Aplicar justify-content em elemento que não possui display:flex.",
            "conferir": "No DevTools, selecione topo-conteudo e identifique eixos principal e transversal."
          },
          "termos": [
            "displayFlex",
            "justifyContent",
            "alignItems",
            "gap"
          ]
        },
        {
          "titulo": "Navegação e layout principal",
          "linhas": [
            122,
            162
          ],
          "explicacao": "A navegação quebra itens quando necessário. layout-principal organiza conteúdo e painel lateral, usando flex para controlar crescimento e tamanho-base.",
          "detalhes": {
            "objetivo": "Usar wrap, crescimento e tamanho-base em dois contêineres.",
            "porque": "A navegação precisa quebrar e o conteúdo principal precisa dividir espaço com o aside.",
            "ordem": "A navegação ativa flex e wrap; layout-principal ativa flex; filhos definem grow e basis.",
            "erroComum": "Usar width fixa que impede flexibilidade ou esquecer min-width:0 em conteúdo longo.",
            "conferir": "Reduza a largura lentamente e observe quando links e colunas se reorganizam."
          },
          "termos": [
            "flexWrap",
            "flexGrow",
            "flexBasis"
          ]
        },
        {
          "titulo": "Cartões flexíveis",
          "linhas": [
            163,
            223
          ],
          "explicacao": "A lista usa flex-wrap e gap. Cada cartão também é flexível em coluna, e o rodapé interno usa margin-top: auto para permanecer na base.",
          "detalhes": {
            "objetivo": "Distribuir cartões em várias linhas e alinhar conteúdo interno.",
            "porque": "flex-wrap, gap e flex-basis permitem cartões adaptáveis; coluna e margin-top:auto alinham seus rodapés.",
            "ordem": "A lista vira contêiner; artigos definem tamanho e direção; a área final consome o espaço livre.",
            "erroComum": "Aplicar margin-top:auto sem pai flex em coluna ou impedir wrap.",
            "conferir": "Aumente um texto de cartão e verifique se o botão/rodapé continua na base sem corte."
          },
          "termos": [
            "flexContainer",
            "flexItem",
            "flexWrap",
            "gap",
            "flexDirection",
            "marginAuto"
          ]
        },
        {
          "titulo": "Indicadores e responsividade",
          "linhas": [
            248,
            326
          ],
          "explicacao": "Os indicadores usam direção vertical. As media queries mudam a direção dos principais contêineres e evitam rolagem horizontal em telas estreitas.",
          "detalhes": {
            "objetivo": "Alternar direção de indicadores e reorganizar os principais contêineres no mobile.",
            "porque": "Uma direção adequada no desktop pode não caber em tela estreita.",
            "ordem": "Indicadores recebem coluna; breakpoints mudam topo, layout e dimensões dos itens.",
            "erroComum": "Mudar flex-direction sem revisar alinhamentos e larguras dos filhos.",
            "conferir": "Teste em 1365, 620 e 320 px e identifique a direção de cada contêiner."
          },
          "termos": [
            "flexDirection",
            "flexBasis"
          ]
        }
      ],
      "js": [
        {
          "titulo": "Elementos controlados",
          "linhas": [
            1,
            3
          ],
          "explicacao": "querySelector localiza o botão, a lista de serviços e a região de status.",
          "detalhes": {
            "objetivo": "Localizar botão, lista e status usados na demonstração.",
            "porque": "O evento precisa alterar a região certa e comunicar o resultado.",
            "ordem": "O script guarda três referências antes de registrar o click.",
            "erroComum": "Classe da lista divergente ou ausência do status causar null.",
            "conferir": "Compare os três seletores com o HTML e verifique console limpo."
          },
          "termos": [
            "querySelector"
          ]
        },
        {
          "titulo": "Alternância de direção",
          "linhas": [
            5,
            15
          ],
          "explicacao": "O clique alterna uma classe, atualiza aria-pressed, o texto do botão e a mensagem acessível sem inserir HTML inseguro.",
          "detalhes": {
            "objetivo": "Alternar a classe que muda o eixo do Flexbox e sincronizar feedback.",
            "porque": "A atividade permite observar a diferença entre linha e coluna em tempo real.",
            "ordem": "O clique chama toggle, lê o booleano retornado e atualiza aria-pressed, rótulo e status.",
            "erroComum": "Aplicar a classe no botão em vez da lista ou usar texto oposto ao estado.",
            "conferir": "Clique, inspecione a classe da lista e compare a direção calculada no CSS."
          },
          "termos": [
            "classListToggle",
            "ariaPressed",
            "textContent"
          ]
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 05 - Layout profissional com Flexbox",
      "descricao": "Nesta atividade, vamos construir uma central profissional de serviços usando Flexbox para organizar cabeçalho, navegação, área principal, cartões, indicadores e ações internas.\n\nAlteração obrigatória: adicione um quarto cartão de serviço, use flex ou flex-basis para integrá-lo ao layout e personalize o espaçamento sem usar Grid.\n\nTeste a quebra dos cartões, a alternância entre linhas e coluna, o foco por teclado e a página em telas de 390 px, 760 px e desktop.\n\nEntrega: anexar o link do repositório do GitHub."
    },
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false,
      "aceitarEquivalencias": true,
      "htmlEstrutura": {
        "idsObrigatorios": [
          "alternarDirecao",
          "listaServicos",
          "statusLayout",
          "conteudo",
          "servicos",
          "indicadores",
          "orientacoes"
        ],
        "tagsMinimas": {
          "header": 1,
          "nav": 1,
          "main": 1,
          "section": 1,
          "article": 1,
          "aside": 1,
          "footer": 1,
          "button": 1,
          "h1": 1,
          "h2": 1,
          "h3": 1
        },
        "referenciasArquivos": {
          "css": "estilo.css",
          "js": "script.js"
        },
        "ancorasObrigatorias": [
          "#servicos"
        ],
        "seletoresObrigatorios": [
          {
            "selector": "#alternarDirecao[aria-pressed][aria-controls=\"listaServicos\"]",
            "message": "Inclua o botão de alternância com aria-pressed e aria-controls."
          },
          {
            "selector": "#listaServicos .cartao-servico",
            "message": "Mantenha a lista de serviços com cartões identificáveis."
          }
        ],
        "atributosObrigatorios": []
      },
      "cssFlexbox": {
        "minimoDisplaysFlex": 2,
        "exigirFlexWrap": false,
        "exigirFlexDirection": false,
        "exigirJustifyContent": false,
        "exigirAlignItems": false,
        "exigirGap": true,
        "exigirFlexItemSizing": false,
        "exigirMediaQuery": false,
        "proibir": []
      },
      "jsComportamento": [
        {
          "event": "click",
          "triggerId": "alternarDirecao",
          "acoes": [
            {
              "type": "classToggle",
              "targetId": "listaServicos"
            },
            {
              "type": "setAttribute",
              "targetId": "alternarDirecao",
              "attribute": "aria-pressed"
            },
            {
              "type": "text",
              "targetId": "alternarDirecao"
            },
            {
              "type": "text",
              "targetId": "statusLayout"
            }
          ]
        }
      ],
      "politica": "conceitos_essenciais"
    },
    "glossario": [
      {
        "id": "flexContainer",
        "termo": "contêiner flexível",
        "categoria": "Papel no Flexbox",
        "traducao": "Elemento pai",
        "explicacao": "É o elemento que recebe display:flex e organiza seus filhos diretos.",
        "erroComum": "Aplicar propriedades de alinhamento no filho em vez do pai não produz o resultado esperado.",
        "linguagem": "css",
        "exercicio": "FE05"
      },
      {
        "id": "flexItem",
        "termo": "item flexível",
        "categoria": "Papel no Flexbox",
        "traducao": "Filho direto",
        "explicacao": "É cada filho direto organizado pelo contêiner Flexbox.",
        "erroComum": "Elementos internos mais profundos não viram itens do mesmo contêiner automaticamente.",
        "linguagem": "css",
        "exercicio": "FE05"
      },
      {
        "id": "displayFlex",
        "termo": "display: flex",
        "categoria": "Declaração CSS",
        "traducao": "Ativar Flexbox",
        "explicacao": "Transforma os filhos diretos em itens flexíveis.",
        "erroComum": "Escrever flex sem display ou no seletor errado não ativa o layout.",
        "linguagem": "css",
        "exercicio": "FE05"
      },
      {
        "id": "justifyContent",
        "termo": "justify-content",
        "categoria": "Propriedade Flexbox",
        "traducao": "Alinhamento no eixo principal",
        "explicacao": "Distribui os itens ao longo do eixo principal.",
        "erroComum": "O eixo principal muda quando flex-direction muda.",
        "linguagem": "css",
        "exercicio": "FE05"
      },
      {
        "id": "alignItems",
        "termo": "align-items",
        "categoria": "Propriedade Flexbox",
        "traducao": "Alinhamento no eixo transversal",
        "explicacao": "Alinha itens no eixo perpendicular ao principal.",
        "erroComum": "Confundir com justify-content gera alinhamento no eixo errado.",
        "linguagem": "css",
        "exercicio": "FE05"
      },
      {
        "id": "flexWrap",
        "termo": "flex-wrap",
        "categoria": "Propriedade Flexbox",
        "traducao": "Quebra de linha",
        "explicacao": "Permite que itens passem para novas linhas quando falta espaço.",
        "erroComum": "Sem wrap, os itens podem encolher demais ou causar overflow.",
        "linguagem": "css",
        "exercicio": "FE05"
      },
      {
        "id": "gap",
        "termo": "gap",
        "categoria": "Propriedade de layout",
        "traducao": "Espaço entre itens",
        "explicacao": "Cria espaçamento uniforme entre itens de Flexbox ou Grid.",
        "erroComum": "Usar margens diferentes em cada item pode duplicar espaço nas bordas.",
        "linguagem": "css",
        "exercicio": "FE05"
      },
      {
        "id": "flexGrow",
        "termo": "flex-grow",
        "categoria": "Propriedade do item",
        "traducao": "Capacidade de crescer",
        "explicacao": "Define quanto um item pode ocupar do espaço livre.",
        "erroComum": "Valor alto não define largura fixa; ele distribui espaço restante.",
        "linguagem": "css",
        "exercicio": "FE05"
      },
      {
        "id": "flexBasis",
        "termo": "flex-basis",
        "categoria": "Propriedade do item",
        "traducao": "Tamanho-base",
        "explicacao": "Define o tamanho inicial considerado antes de crescer ou encolher.",
        "erroComum": "Confundir com width sem considerar flex-grow e flex-shrink causa surpresa.",
        "linguagem": "css",
        "exercicio": "FE05"
      },
      {
        "id": "flexDirection",
        "termo": "flex-direction",
        "categoria": "Propriedade Flexbox",
        "traducao": "Direção dos itens",
        "explicacao": "Define se o eixo principal segue linha ou coluna.",
        "erroComum": "Ao mudar para column, justify-content passa a atuar verticalmente.",
        "linguagem": "css",
        "exercicio": "FE05"
      },
      {
        "id": "marginAuto",
        "termo": "margin-top: auto",
        "categoria": "Técnica Flexbox",
        "traducao": "Empurrar até o final",
        "explicacao": "Consome o espaço livre disponível e mantém um bloco na base de um cartão flexível.",
        "erroComum": "Só funciona como esperado quando o pai organiza os filhos com Flexbox.",
        "linguagem": "css",
        "exercicio": "FE05"
      },
      {
        "id": "ariaControls",
        "termo": "aria-controls",
        "categoria": "Atributo de acessibilidade",
        "traducao": "Controla a região",
        "explicacao": "Relaciona um botão ao id da região cujo estado ele altera.",
        "erroComum": "O valor precisa apontar para um id existente.",
        "linguagem": "html",
        "exercicio": "FE05"
      },
      {
        "id": "ariaPressed",
        "termo": "aria-pressed",
        "categoria": "Atributo de acessibilidade",
        "traducao": "Estado de alternância",
        "explicacao": "Indica se o modo controlado pelo botão está ativo.",
        "erroComum": "Deixar o atributo desatualizado cria divergência com a interface.",
        "linguagem": "html/js",
        "exercicio": "FE05"
      },
      {
        "id": "querySelector",
        "termo": "querySelector",
        "categoria": "Método do DOM",
        "traducao": "Selecionar elemento",
        "explicacao": "Localiza botão, lista e status por seletores CSS.",
        "erroComum": "Seletor divergente retorna null e interrompe a interação.",
        "linguagem": "javascript",
        "exercicio": "FE05"
      },
      {
        "id": "classListToggle",
        "termo": "classList.toggle",
        "categoria": "Método do DOM",
        "traducao": "Alternar classe",
        "explicacao": "Ativa ou remove a classe que muda a direção do layout.",
        "erroComum": "A classe precisa existir no CSS e ser aplicada à região correta.",
        "linguagem": "javascript",
        "exercicio": "FE05"
      },
      {
        "id": "textContent",
        "termo": "textContent",
        "categoria": "Propriedade do DOM",
        "traducao": "Alterar texto",
        "explicacao": "Atualiza mensagens e rótulos com texto seguro.",
        "erroComum": "Usar innerHTML sem necessidade aumenta riscos e não é necessário para texto.",
        "linguagem": "javascript",
        "exercicio": "FE05"
      }
    ],
    "dicasProgressivas": {
      "html": [
        "Relembre: Flexbox organiza somente os filhos diretos do contêiner.",
        "Localize: identifique cada pai flexível e seus itens.",
        "Compare: aria-controls deve apontar para a lista realmente modificada.",
        "Estrutura parcial: contêiner > itens diretos; conteúdos internos podem formar outro Flexbox.",
        "Exemplo semelhante: organize uma equipe em cartões e um painel lateral."
      ],
      "css": [
        "Relembre: justify-content atua no eixo principal e align-items no transversal.",
        "Localize: confira display:flex antes das propriedades Flexbox.",
        "Compare: flex-basis define base; flex-grow distribui espaço livre; wrap permite novas linhas.",
        "Estrutura parcial: .lista { display:flex; flex-wrap:wrap; gap:...; } .item { flex: 1 1 ...; }.",
        "Exemplo semelhante: crie uma barra de ferramentas que quebra em telas estreitas."
      ],
      "js": [
        "Relembre: o JavaScript deve alternar uma classe já prevista no CSS.",
        "Localize: confira botão, lista, status e callback.",
        "Compare: classe, aria-pressed, texto do botão e status precisam representar o mesmo estado.",
        "Estrutura parcial: const vertical = lista.classList.toggle(\"vertical\");.",
        "Exemplo semelhante: alterne a direção de uma galeria com outro nome de classe."
      ]
    },
    "comportamento": {
      "titulo": "Teste comportamental do Flexbox",
      "instrucao": "Execute o preview e altere a organização dos cartões. A validação observa se a ação realmente modifica o layout.",
      "criterios": [
        {
          "id": "acao-principal",
          "tipo": "event",
          "evento": "click",
          "seletor": "#alternarDirecao",
          "rotulo": "Acionar o botão de direção"
        },
        {
          "id": "classe-layout",
          "tipo": "visualChanged",
          "seletor": "#listaServicos",
          "propriedades": [
            "flexDirection",
            "flexWrap",
            "gap",
            "justifyContent",
            "alignItems",
            "alignContent",
            "flexBasis",
            "width",
            "order",
            "padding"
          ],
          "rotulo": "O layout dos cartões realmente mudou"
        }
      ]
    },
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 6,
    "studentReferenceStripped": true,
    "codigo": "FE06",
    "titulo": "FE06 - Grid, media queries e responsividade",
    "nomeCurto": "Grid, media queries e responsividade",
    "tema": "Layout bidimensional e adaptação por breakpoint",
    "objetivo": "Construir um dashboard com CSS Grid, regiões nomeadas, colunas flexíveis e reorganização para computador, tablet e celular.",
    "produto": "Dashboard operacional responsivo com indicadores, tarefas, agenda, equipe e alertas.",
    "contextoProfissional": "Dashboards administrativos precisam organizar várias regiões simultaneamente e manter a leitura em telas diferentes. CSS Grid permite controlar linhas e colunas, enquanto media queries definem mudanças de composição sem alterar a ordem semântica.",
    "alteracaoObrigatoria": "Adicione um quinto indicador com dados próprios e crie uma nova área de pendências no dashboard. Defina a posição dessa área em telas amplas e sua ordem em telas pequenas, mantendo responsividade e sem usar larguras fixas que causem rolagem horizontal.",
    "retomadas": [
      "HTML semântico",
      "variáveis CSS",
      "Box Model",
      "Flexbox e componentes adaptáveis"
    ],
    "novos": [
      "display grid",
      "grid-template-columns",
      "grid-template-areas",
      "grid-area",
      "repeat",
      "minmax",
      "auto-fit",
      "media queries",
      "breakpoints responsivos"
    ],
    "pasta": "exercicio-06",
    "repositorio": "atividades-frontend-sub",
    "classroomUrl": "https://classroom.google.com/",
    "githubUrl": "https://github.com/",
    "tempoMinimoSegundos": 300,
    "ordemArquivos": [
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
    "linguagens": {
      "html": "html",
      "css": "css",
      "js": "js"
    },
    "passos": {
      "html": [
        {
          "titulo": "Cabeçalho e controle de densidade",
          "linhas": [
            1,
            22
          ],
          "explicacao": "A página conecta os arquivos, oferece salto ao dashboard e inclui um botão acessível que controla o modo compacto.",
          "detalhes": {
            "objetivo": "Preparar o dashboard e um botão acessível para alternar densidade.",
            "porque": "O controle visual precisa estar relacionado ao painel que ele modifica e comunicar seu estado.",
            "ordem": "O head conecta arquivos; o link de salto antecede o header; o botão aponta para o dashboard.",
            "erroComum": "aria-controls divergente ou id duplicado no painel.",
            "conferir": "Use teclado, ative o botão e confira aria-pressed e região controlada."
          },
          "termos": [
            "ariaPressed"
          ]
        },
        {
          "titulo": "Resumo e indicadores",
          "linhas": [
            24,
            56
          ],
          "explicacao": "A primeira região contém o status do layout e uma grade de indicadores que usa auto-fit e minmax.",
          "detalhes": {
            "objetivo": "Criar uma região de resumo e uma coleção de indicadores adaptáveis.",
            "porque": "O HTML preserva a ordem de leitura enquanto o Grid decide a distribuição visual.",
            "ordem": "A região de resumo contém status e, em seguida, a grade reúne cada indicador como item.",
            "erroComum": "Usar a posição visual como única forma de indicar importância.",
            "conferir": "Leia o HTML na ordem do código e confirme que a sequência faz sentido sem CSS."
          },
          "termos": [
            "gridContainer",
            "gridItem"
          ]
        },
        {
          "titulo": "Regiões do dashboard",
          "linhas": [
            58,
            104
          ],
          "explicacao": "Tarefas, agenda, equipe e alertas são regiões semânticas independentes posicionadas por grid-template-areas.",
          "detalhes": {
            "objetivo": "Separar tarefas, agenda, equipe e alertas em regiões semânticas.",
            "porque": "Cada região poderá receber grid-area sem perder seu significado ou ordem de leitura.",
            "ordem": "As regiões aparecem em ordem lógica no HTML e recebem classes para o mapa visual.",
            "erroComum": "Nome da classe ou área divergir do declarado no CSS.",
            "conferir": "Crie uma tabela relacionando classe HTML, grid-area do item e nome no grid-template-areas."
          },
          "termos": [
            "semanticRegion",
            "gridArea"
          ]
        },
        {
          "titulo": "Rodapé",
          "linhas": [
            106,
            110
          ],
          "explicacao": "O rodapé identifica exercício, disciplina e turma.",
          "detalhes": {
            "objetivo": "Encerrar e identificar o exercício sem interferir no Grid principal.",
            "porque": "O rodapé pertence ao documento, não ao mapa interno do dashboard.",
            "ordem": "Depois do main e de todas as regiões, o footer finaliza o body.",
            "erroComum": "Inserir footer dentro do grid quando ele não faz parte do mapa planejado.",
            "conferir": "Confirme no DOM que o footer é irmão do main, não filho do dashboard."
          },
          "termos": [
            "semanticRegion"
          ]
        }
      ],
      "css": [
        {
          "titulo": "Base e cabeçalho em Grid",
          "linhas": [
            1,
            113
          ],
          "explicacao": "Variáveis, Box Model e um cabeçalho bidimensional preparam a composição.",
          "detalhes": {
            "objetivo": "Preparar variáveis, Box Model e primeiro Grid bidimensional.",
            "porque": "O cabeçalho demonstra alinhamento em linhas e colunas antes do dashboard maior.",
            "ordem": "A base visual é declarada e o cabeçalho ativa grid com colunas e alinhamentos.",
            "erroComum": "Usar propriedades de item no contêiner ou deixar conteúdo longo sem min-width:0.",
            "conferir": "Ative o overlay de Grid no DevTools e observe linhas e colunas do cabeçalho."
          },
          "termos": [
            "gridContainer",
            "gridItem",
            "gridTemplateColumns",
            "gap"
          ]
        },
        {
          "titulo": "Mapa principal do dashboard",
          "linhas": [
            114,
            144
          ],
          "explicacao": "grid-template-columns e grid-template-areas definem o mapa de regiões em telas amplas.",
          "detalhes": {
            "objetivo": "Definir colunas e áreas nomeadas para telas amplas.",
            "porque": "grid-template-areas torna a composição legível e relaciona nomes a regiões.",
            "ordem": "O contêiner define colunas, gap e mapa; cada item associa seu grid-area.",
            "erroComum": "Linhas do mapa com quantidade diferente de células ou área não retangular.",
            "conferir": "Leia o mapa como uma tabela e localize cada nome no layout renderizado."
          },
          "termos": [
            "gridTemplateColumns",
            "gridTemplateAreas",
            "gridArea"
          ]
        },
        {
          "titulo": "Grades internas",
          "linhas": [
            145,
            281
          ],
          "explicacao": "repeat, auto-fit e minmax tornam indicadores e componentes internos adaptáveis.",
          "detalhes": {
            "objetivo": "Usar repeat, auto-fit e minmax em coleções internas.",
            "porque": "As colunas se ajustam automaticamente conforme espaço e quantidade de conteúdo.",
            "ordem": "Cada subgrade ativa display:grid e define faixas repetidas e limites de tamanho.",
            "erroComum": "Mínimo maior que a viewport ou repeat aplicado no seletor errado.",
            "conferir": "Redimensione a página e conte quantas colunas cabem sem corte."
          },
          "termos": [
            "repeat",
            "autoFit",
            "minmax",
            "gap"
          ]
        },
        {
          "titulo": "Breakpoints responsivos",
          "linhas": [
            295,
            333
          ],
          "explicacao": "As media queries redefinem colunas e áreas para tablet e celular, sem mudar a ordem do HTML.",
          "detalhes": {
            "objetivo": "Reorganizar colunas e áreas para tablet e celular.",
            "porque": "O mesmo mapa amplo não cabe em telas estreitas, mas a ordem semântica pode ser preservada.",
            "ordem": "Breakpoints posteriores redefinem template-columns e template-areas conforme a largura.",
            "erroComum": "Mudar colunas sem atualizar áreas ou deixar nome ausente no novo mapa.",
            "conferir": "Compare os mapas de desktop, tablet e celular e confira todas as regiões."
          },
          "termos": [
            "mediaQuery",
            "gridTemplateAreas",
            "gridTemplateColumns"
          ]
        }
      ],
      "js": [
        {
          "titulo": "Elementos controlados",
          "linhas": [
            1,
            3
          ],
          "explicacao": "querySelector localiza botão, dashboard e região de status.",
          "detalhes": {
            "objetivo": "Localizar botão, dashboard e status da densidade.",
            "porque": "O script precisa de referências válidas para sincronizar estado e mensagem.",
            "ordem": "querySelector guarda os três elementos antes do evento.",
            "erroComum": "Selecionar um elemento interno em vez do contêiner que possui a classe compacta.",
            "conferir": "Confira seletores e execute no console document.querySelector para cada um."
          },
          "termos": [
            "querySelector"
          ]
        },
        {
          "titulo": "Modo compacto",
          "linhas": [
            5,
            15
          ],
          "explicacao": "O clique alterna uma classe, atualiza aria-pressed, texto do botão e feedback acessível.",
          "detalhes": {
            "objetivo": "Alternar classe, estado acessível e textos usando um booleano real.",
            "porque": "A densidade muda visualmente, mas o botão também precisa informar se o modo está ativo.",
            "ordem": "O click alterna a classe; toggle retorna true/false; esse valor atualiza atributo, rótulo e mensagem.",
            "erroComum": "Comparar booleano com string ou atualizar textos antes de obter o novo estado.",
            "conferir": "Clique duas vezes e acompanhe classe, booleano retornado, aria-pressed e mensagem."
          },
          "termos": [
            "classListToggle",
            "ariaPressed",
            "boolean"
          ]
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 06 - Grid, media queries e responsividade",
      "descricao": "Nesta atividade, vamos construir um dashboard operacional com CSS Grid, regiões nomeadas, colunas flexíveis e breakpoints para computador, tablet e celular.\n\nAlteração obrigatória: adicione um quinto indicador e uma nova área de pendências, definindo sua posição em telas amplas e sua ordem em telas pequenas.\n\nTeste o layout em aproximadamente 1180 px, 900 px, 620 px e 390 px, use o modo compacto e confirme que não existe rolagem horizontal.\n\nEntrega: anexar o link do repositório do GitHub."
    },
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false,
      "aceitarEquivalencias": true,
      "htmlEstrutura": {
        "idsObrigatorios": [
          "alternarDensidade",
          "dashboard",
          "statusLayout",
          "resumo",
          "tarefas",
          "agenda",
          "equipe",
          "alertas"
        ],
        "tagsMinimas": {
          "header": 1,
          "main": 1,
          "section": 1,
          "article": 1,
          "aside": 1,
          "footer": 1,
          "button": 1,
          "h1": 1,
          "h2": 1
        },
        "referenciasArquivos": {
          "css": "estilo.css",
          "js": "script.js"
        },
        "seletoresObrigatorios": [
          {
            "selector": "#alternarDensidade[aria-pressed][aria-controls=\"dashboard\"]",
            "message": "Inclua o botão com aria-pressed e aria-controls."
          },
          {
            "selector": "#resumo .indicador",
            "message": "Mantenha a grade de indicadores identificável."
          }
        ],
        "atributosObrigatorios": []
      },
      "cssGridResponsivo": {
        "minimoDisplaysGrid": 2,
        "exigirTemplateColumns": true,
        "exigirTemplateAreas": false,
        "minimoGridAreas": 0,
        "exigirGap": true,
        "exigirMinmax": false,
        "exigirRepeat": false,
        "exigirAutoFitOuFill": false,
        "minimoMediaQueries": 1,
        "proibir": []
      },
      "jsComportamento": [
        {
          "event": "click",
          "triggerId": "alternarDensidade",
          "acoes": [
            {
              "type": "classToggle",
              "targetId": "dashboard"
            },
            {
              "type": "setAttribute",
              "targetId": "alternarDensidade",
              "attribute": "aria-pressed"
            },
            {
              "type": "text",
              "targetId": "alternarDensidade"
            },
            {
              "type": "text",
              "targetId": "statusLayout"
            }
          ]
        }
      ],
      "politica": "conceitos_essenciais"
    },
    "glossario": [
      {
        "id": "gridContainer",
        "termo": "contêiner Grid",
        "categoria": "Papel no CSS Grid",
        "traducao": "Elemento pai bidimensional",
        "explicacao": "Recebe display:grid e organiza itens em linhas e colunas.",
        "erroComum": "Propriedades grid no elemento errado não afetam os filhos esperados.",
        "linguagem": "css",
        "exercicio": "FE06"
      },
      {
        "id": "gridItem",
        "termo": "item de Grid",
        "categoria": "Papel no CSS Grid",
        "traducao": "Filho direto",
        "explicacao": "É posicionado nas linhas, colunas ou áreas definidas pelo contêiner.",
        "erroComum": "Um neto não participa diretamente do Grid do avô.",
        "linguagem": "css",
        "exercicio": "FE06"
      },
      {
        "id": "gridTemplateColumns",
        "termo": "grid-template-columns",
        "categoria": "Propriedade Grid",
        "traducao": "Modelo de colunas",
        "explicacao": "Define quantidade e tamanho das colunas.",
        "erroComum": "Colunas fixas largas podem causar overflow em telas pequenas.",
        "linguagem": "css",
        "exercicio": "FE06"
      },
      {
        "id": "gridTemplateAreas",
        "termo": "grid-template-areas",
        "categoria": "Propriedade Grid",
        "traducao": "Mapa de áreas",
        "explicacao": "Desenha um mapa textual para posicionar regiões nomeadas.",
        "erroComum": "Cada linha precisa ter o mesmo número de células e áreas retangulares.",
        "linguagem": "css",
        "exercicio": "FE06"
      },
      {
        "id": "gridArea",
        "termo": "grid-area",
        "categoria": "Propriedade do item",
        "traducao": "Nome da área",
        "explicacao": "Liga um item a uma área declarada no mapa do contêiner.",
        "erroComum": "Nome divergente faz o item usar posicionamento automático.",
        "linguagem": "css",
        "exercicio": "FE06"
      },
      {
        "id": "repeat",
        "termo": "repeat()",
        "categoria": "Função CSS",
        "traducao": "Repetir faixas",
        "explicacao": "Evita repetir manualmente a mesma definição de coluna ou linha.",
        "erroComum": "Quantidade ou faixa inválida torna a declaração inutilizável.",
        "linguagem": "css",
        "exercicio": "FE06"
      },
      {
        "id": "autoFit",
        "termo": "auto-fit",
        "categoria": "Palavra-chave Grid",
        "traducao": "Ajuste automático",
        "explicacao": "Cria a quantidade de colunas que couber na largura disponível.",
        "erroComum": "Sem minmax, os itens podem ficar pequenos demais ou não se adaptar bem.",
        "linguagem": "css",
        "exercicio": "FE06"
      },
      {
        "id": "minmax",
        "termo": "minmax()",
        "categoria": "Função CSS",
        "traducao": "Limite mínimo e máximo",
        "explicacao": "Define uma faixa que pode crescer sem ficar menor que o mínimo.",
        "erroComum": "Mínimo maior que a tela pode continuar causando overflow.",
        "linguagem": "css",
        "exercicio": "FE06"
      },
      {
        "id": "gap",
        "termo": "gap",
        "categoria": "Propriedade de layout",
        "traducao": "Espaço entre células",
        "explicacao": "Cria distância uniforme entre linhas e colunas.",
        "erroComum": "Somar margens desnecessárias pode aumentar demais os espaços.",
        "linguagem": "css",
        "exercicio": "FE06"
      },
      {
        "id": "mediaQuery",
        "termo": "@media",
        "categoria": "Regra condicional CSS",
        "traducao": "Consulta de tela",
        "explicacao": "Troca o mapa e as colunas conforme a largura disponível.",
        "erroComum": "Apenas declarar breakpoint sem reorganizar as áreas não resolve o layout.",
        "linguagem": "css",
        "exercicio": "FE06"
      },
      {
        "id": "semanticRegion",
        "termo": "section/aside",
        "categoria": "Elementos semânticos",
        "traducao": "Regiões de conteúdo",
        "explicacao": "Mantêm significado no HTML enquanto o CSS muda apenas a posição visual.",
        "erroComum": "Alterar a ordem visual sem considerar a ordem de leitura pode confundir teclado e leitor de tela.",
        "linguagem": "html",
        "exercicio": "FE06"
      },
      {
        "id": "ariaPressed",
        "termo": "aria-pressed",
        "categoria": "Atributo de acessibilidade",
        "traducao": "Estado do modo compacto",
        "explicacao": "Comunica se o botão de densidade está ativo.",
        "erroComum": "O atributo precisa acompanhar a classe compacta.",
        "linguagem": "html/js",
        "exercicio": "FE06"
      },
      {
        "id": "querySelector",
        "termo": "querySelector",
        "categoria": "Método do DOM",
        "traducao": "Selecionar elemento",
        "explicacao": "Localiza botão, dashboard e região de status.",
        "erroComum": "Se um id ou classe divergir, o método retorna null.",
        "linguagem": "javascript",
        "exercicio": "FE06"
      },
      {
        "id": "classListToggle",
        "termo": "classList.toggle",
        "categoria": "Método do DOM",
        "traducao": "Alternar classe",
        "explicacao": "Liga ou desliga o modo compacto no dashboard.",
        "erroComum": "A classe precisa ter regras correspondentes no CSS.",
        "linguagem": "javascript",
        "exercicio": "FE06"
      },
      {
        "id": "boolean",
        "termo": "booleano",
        "categoria": "Tipo lógico",
        "traducao": "Verdadeiro ou falso",
        "explicacao": "Representa o estado retornado por classList.toggle e orienta os textos do controle.",
        "erroComum": "Comparar com as strings \"true\" e \"false\" é diferente de usar booleanos reais.",
        "linguagem": "javascript",
        "exercicio": "FE06"
      }
    ],
    "dicasProgressivas": {
      "html": [
        "Relembre: a ordem do HTML deve fazer sentido mesmo quando o Grid muda posições.",
        "Localize: associe cada região semântica à classe usada no CSS.",
        "Compare: o botão de densidade deve controlar o id correto.",
        "Estrutura parcial: <section class=\"regiao tarefas\" ...>...</section>.",
        "Exemplo semelhante: estruture um painel escolar com resumo, agenda, avisos e equipe."
      ],
      "css": [
        "Relembre: Grid trabalha com linhas e colunas; áreas nomeadas desenham um mapa.",
        "Localize: confira contêiner, grid-area de cada item e todos os mapas responsivos.",
        "Compare: cada linha do grid-template-areas precisa ter a mesma quantidade de células.",
        "Estrutura parcial: grid-template-columns: ...; grid-template-areas: \"a b\" \"c b\";.",
        "Exemplo semelhante: use repeat(auto-fit, minmax(...)) em uma grade de indicadores diferente."
      ],
      "js": [
        "Relembre: toggle devolve um booleano com o novo estado.",
        "Localize: confira botão, dashboard e status.",
        "Compare: o CSS deve possuir regras para a classe compacta aplicada.",
        "Estrutura parcial: const compacto = dashboard.classList.toggle(\"compacto\");.",
        "Exemplo semelhante: alterne um modo espaçoso em um painel com outra classe."
      ]
    },
    "comportamento": {
      "titulo": "Teste comportamental do Grid",
      "instrucao": "Execute o preview e altere a densidade do dashboard. A validação exige apenas uma mudança real de layout após a ação.",
      "criterios": [
        {
          "id": "acao-principal",
          "tipo": "event",
          "evento": "click",
          "seletor": "#alternarDensidade",
          "rotulo": "Acionar o botão de densidade"
        },
        {
          "id": "classe-layout",
          "tipo": "visualChanged",
          "seletor": "#dashboard",
          "propriedades": [
            "gap",
            "padding",
            "gridTemplateColumns",
            "gridTemplateRows",
            "gridTemplateAreas",
            "gridAutoColumns",
            "gridAutoRows",
            "width"
          ],
          "rotulo": "O dashboard realmente mudou de densidade"
        }
      ]
    },
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 7,
    "studentReferenceStripped": true,
    "codigo": "FE07",
    "titulo": "FE07 - Do algoritmo ao código: Python e JavaScript",
    "nomeCurto": "Do algoritmo ao código: Python e JavaScript",
    "tema": "Entrada, processamento e saída em diferentes linguagens",
    "objetivo": "Representar um algoritmo sequencial em pseudocódigo e executá-lo com resultados equivalentes no navegador e no terminal Python.",
    "produto": "Calculadora de orçamento rápido com uma versão Web em JavaScript e uma versão de terminal em Python.",
    "contextoProfissional": "Equipes transformam regras de negócio em algoritmos antes de escolher a interface ou a linguagem. O mesmo cálculo pode atender uma página Web, um script interno ou futuramente uma API.",
    "alteracaoObrigatoria": "Altere a taxa operacional de 10% para 12% nas três representações: algoritmo.txt, script.js e main.py. Depois personalize o nome do serviço exibido na interface sem remover a estrutura Entrada -> Processamento -> Saída.",
    "retomadas": [
      "HTML semântico e formulários",
      "CSS responsivo",
      "seleção de elementos e evento de envio"
    ],
    "novos": [
      "algoritmo",
      "pseudocódigo",
      "entrada",
      "processamento",
      "saída",
      "input() em Python",
      "Number() em JavaScript",
      "print() e textContent",
      "comparação entre linguagens"
    ],
    "pasta": "exercicio-07",
    "repositorio": "atividades-frontend-sub",
    "classroomUrl": "https://classroom.google.com/",
    "githubUrl": "https://github.com/",
    "tempoMinimoSegundos": 300,
    "ordemArquivos": [
      "pseudocodigo",
      "html",
      "css",
      "js",
      "python",
      "readme"
    ],
    "arquivos": {
      "pseudocodigo": "// Desenvolva aqui a atividade solicitada.\n",
      "html": "<!doctype html>\n<html lang=\"pt-BR\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Atividade</title>\n</head>\n<body>\n  <main>\n    <!-- Desenvolva aqui a estrutura solicitada. -->\n  </main>\n</body>\n</html>\n",
      "css": "/* Desenvolva aqui os estilos solicitados. */\n",
      "js": "'use strict';\n// Desenvolva aqui o comportamento solicitado.\n",
      "python": "# Desenvolva aqui a solução solicitada.\n",
      "readme": "# FE07 - Do algoritmo ao código: Python e JavaScript\n\n## Objetivo\n\nRepresentar e executar o mesmo algoritmo sequencial em pseudocódigo, JavaScript e Python, identificando claramente entrada, processamento e saída.\n\n## Arquivos\n\n- `algoritmo.txt`: descrição do algoritmo em pseudocódigo;\n- `index.html`: interface de entrada e saída no navegador;\n- `estilo.css`: apresentação responsiva;\n- `script.js`: execução do algoritmo no navegador;\n- `main.py`: execução equivalente no terminal Python.\n\n\n## Entrada, Processamento e Saída\n\n- **Entrada:** nome do cliente, horas previstas e valor por hora.\n- **Processamento:** cálculo do subtotal, da taxa operacional e do total.\n- **Saída:** apresentação dos resultados no navegador e no terminal.\n\n## Executar a versão Web\n\nAbra `index.html` no navegador ou utilize uma extensão de servidor local no VS Code.\n\n## Executar a versão Python\n\nNo terminal aberto dentro da pasta `exercicio-07`, execute:\n\n```bash\npython main.py\n```\n\nUse os mesmos dados nas duas versões e compare os resultados.\n"
    },
    "nomesArquivos": {
      "pseudocodigo": "algoritmo.txt",
      "html": "index.html",
      "css": "estilo.css",
      "js": "script.js",
      "python": "main.py",
      "readme": "README.md"
    },
    "linguagens": {
      "pseudocodigo": "text",
      "html": "html",
      "css": "css",
      "js": "js",
      "python": "python",
      "readme": "markdown"
    },
    "passos": {
      "pseudocodigo": [
        {
          "titulo": "Início e entradas",
          "linhas": [
            1,
            5
          ],
          "explicacao": "O pseudocódigo começa, solicita três dados e usa nomes que revelam o significado de cada informação.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de pseudocodigo dentro do exercício.",
            "porque": "Este trecho existe para manter a sequência entre estrutura, comportamento, teste e entrega.",
            "ordem": "Leia de cima para baixo e acompanhe como cada linha prepara a próxima ação.",
            "erroComum": "Compare nomes, fechamento, pontuação e posição das instruções antes de validar.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "entrada"
          ]
        },
        {
          "titulo": "Processamento sequencial",
          "linhas": [
            6,
            8
          ],
          "explicacao": "As três atribuições representam as regras do orçamento. Cada resultado é usado pela instrução seguinte.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de pseudocodigo dentro do exercício.",
            "porque": "Este trecho existe para manter a sequência entre estrutura, comportamento, teste e entrega.",
            "ordem": "Leia de cima para baixo e acompanhe como cada linha prepara a próxima ação.",
            "erroComum": "Compare nomes, fechamento, pontuação e posição das instruções antes de validar.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "processamento"
          ]
        },
        {
          "titulo": "Saídas e encerramento",
          "linhas": [
            10,
            14
          ],
          "explicacao": "A parte final apresenta os valores produzidos e encerra o algoritmo.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de pseudocodigo dentro do exercício.",
            "porque": "Este trecho existe para manter a sequência entre estrutura, comportamento, teste e entrega.",
            "ordem": "Leia de cima para baixo e acompanhe como cada linha prepara a próxima ação.",
            "erroComum": "Compare nomes, fechamento, pontuação e posição das instruções antes de validar.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "saida"
          ]
        }
      ],
      "html": [
        {
          "titulo": "Documento e apresentação",
          "linhas": [
            1,
            18
          ],
          "explicacao": "O documento conecta CSS e JavaScript e apresenta a proposta de comparar linguagens.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de html dentro do exercício.",
            "porque": "O HTML define a estrutura que o CSS estiliza e o JavaScript localiza.",
            "ordem": "O navegador lê a declaração, o head e depois constrói os elementos do body.",
            "erroComum": "Tag não fechada, id divergente ou caminho de arquivo incorreto.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "doctype",
            "lang"
          ]
        },
        {
          "titulo": "Entradas do algoritmo",
          "linhas": [
            20,
            41
          ],
          "explicacao": "O formulário oferece campos associados a labels e utiliza tipos numéricos coerentes.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de html dentro do exercício.",
            "porque": "O HTML define a estrutura que o CSS estiliza e o JavaScript localiza.",
            "ordem": "O navegador lê a declaração, o head e depois constrói os elementos do body.",
            "erroComum": "Tag não fechada, id divergente ou caminho de arquivo incorreto.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "id"
          ]
        },
        {
          "titulo": "Processamento e saída",
          "linhas": [
            44,
            74
          ],
          "explicacao": "A página explica as regras e reserva uma região de status para o resultado calculado.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de html dentro do exercício.",
            "porque": "O HTML define a estrutura que o CSS estiliza e o JavaScript localiza.",
            "ordem": "O navegador lê a declaração, o head e depois constrói os elementos do body.",
            "erroComum": "Tag não fechada, id divergente ou caminho de arquivo incorreto.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "ariaLive"
          ]
        }
      ],
      "css": [
        {
          "titulo": "Variáveis e base visual",
          "linhas": [
            1,
            81
          ],
          "explicacao": "Variáveis, Box Model e estilos globais criam uma base consistente.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de css dentro do exercício.",
            "porque": "O CSS transforma a estrutura HTML em uma interface legível e responsiva.",
            "ordem": "A cascata combina regras gerais, componentes e ajustes de tela pequena.",
            "erroComum": "Seletor sem correspondência, propriedade inválida ou largura fixa causando overflow.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "root",
            "boxSizing"
          ]
        },
        {
          "titulo": "Layout e componentes",
          "linhas": [
            82,
            178
          ],
          "explicacao": "Grid organiza os painéis; formulário e resultado recebem estilos próprios.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de css dentro do exercício.",
            "porque": "O CSS transforma a estrutura HTML em uma interface legível e responsiva.",
            "ordem": "A cascata combina regras gerais, componentes e ajustes de tela pequena.",
            "erroComum": "Seletor sem correspondência, propriedade inválida ou largura fixa causando overflow.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "grid"
          ]
        },
        {
          "titulo": "Responsividade",
          "linhas": [
            180,
            203
          ],
          "explicacao": "Os breakpoints transformam o layout em uma coluna e ajustam espaços para celular.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de css dentro do exercício.",
            "porque": "O CSS transforma a estrutura HTML em uma interface legível e responsiva.",
            "ordem": "A cascata combina regras gerais, componentes e ajustes de tela pequena.",
            "erroComum": "Seletor sem correspondência, propriedade inválida ou largura fixa causando overflow.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "media"
          ]
        }
      ],
      "js": [
        {
          "titulo": "Referências da interface",
          "linhas": [
            1,
            6
          ],
          "explicacao": "querySelector guarda referências para o formulário, os campos e a região de saída.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de js dentro do exercício.",
            "porque": "Este bloco conecta uma ação do usuário ao comportamento visível da página.",
            "ordem": "Primeiro os elementos são localizados; depois o evento é registrado; por último o callback altera a interface.",
            "erroComum": "Executar a alteração fora do evento ou usar um seletor que não encontra o elemento.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "querySelector"
          ]
        },
        {
          "titulo": "Entrada",
          "linhas": [
            7,
            14
          ],
          "explicacao": "O envio é interceptado e os valores são lidos. Number converte textos numéricos em números.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de js dentro do exercício.",
            "porque": "Este bloco conecta uma ação do usuário ao comportamento visível da página.",
            "ordem": "Primeiro os elementos são localizados; depois o evento é registrado; por último o callback altera a interface.",
            "erroComum": "Executar a alteração fora do evento ou usar um seletor que não encontra o elemento.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "value",
            "Number",
            "preventDefault"
          ]
        },
        {
          "titulo": "Processamento",
          "linhas": [
            15,
            19
          ],
          "explicacao": "As regras do pseudocódigo aparecem na mesma ordem e produzem subtotal, taxa e total.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de js dentro do exercício.",
            "porque": "Este bloco conecta uma ação do usuário ao comportamento visível da página.",
            "ordem": "Primeiro os elementos são localizados; depois o evento é registrado; por último o callback altera a interface.",
            "erroComum": "Executar a alteração fora do evento ou usar um seletor que não encontra o elemento.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "Number"
          ]
        },
        {
          "titulo": "Saída segura",
          "linhas": [
            20,
            29
          ],
          "explicacao": "textContent apresenta o resultado sem interpretar conteúdo do usuário como HTML.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de js dentro do exercício.",
            "porque": "Este bloco conecta uma ação do usuário ao comportamento visível da página.",
            "ordem": "Primeiro os elementos são localizados; depois o evento é registrado; por último o callback altera a interface.",
            "erroComum": "Executar a alteração fora do evento ou usar um seletor que não encontra o elemento.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "textContent"
          ]
        }
      ],
      "python": [
        {
          "titulo": "Cabeçalho e entrada",
          "linhas": [
            1,
            8
          ],
          "explicacao": "input recebe textos do terminal; float converte horas e valor para números decimais.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de python dentro do exercício.",
            "porque": "Este bloco representa a mesma sequência de entrada, processamento e saída em Python.",
            "ordem": "O interpretador executa as linhas em ordem: pergunta, conversão, cálculo e impressão.",
            "erroComum": "Esquecer conversão, usar vírgula decimal ou digitar uma variável com nome diferente.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "input",
            "strip",
            "float"
          ]
        },
        {
          "titulo": "Processamento equivalente",
          "linhas": [
            9,
            13
          ],
          "explicacao": "As mesmas três regras usadas no JavaScript são escritas com a sintaxe do Python.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de python dentro do exercício.",
            "porque": "Este bloco representa a mesma sequência de entrada, processamento e saída em Python.",
            "ordem": "O interpretador executa as linhas em ordem: pergunta, conversão, cálculo e impressão.",
            "erroComum": "Esquecer conversão, usar vírgula decimal ou digitar uma variável com nome diferente.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "float"
          ]
        },
        {
          "titulo": "Saída formatada",
          "linhas": [
            14,
            19
          ],
          "explicacao": "print e f-strings mostram os resultados com duas casas decimais.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de python dentro do exercício.",
            "porque": "Este bloco representa a mesma sequência de entrada, processamento e saída em Python.",
            "ordem": "O interpretador executa as linhas em ordem: pergunta, conversão, cálculo e impressão.",
            "erroComum": "Esquecer conversão, usar vírgula decimal ou digitar uma variável com nome diferente.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "print",
            "fstring"
          ]
        }
      ],
      "readme": [
        {
          "titulo": "Objetivo, arquivos e etapas",
          "linhas": [
            1,
            24
          ],
          "explicacao": "A documentação explica o objetivo, a função de cada arquivo e identifica entrada, processamento e saída.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de readme dentro do exercício.",
            "porque": "Este trecho existe para manter a sequência entre estrutura, comportamento, teste e entrega.",
            "ordem": "Leia de cima para baixo e acompanhe como cada linha prepara a próxima ação.",
            "erroComum": "Compare nomes, fechamento, pontuação e posição das instruções antes de validar.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "heading",
            "code"
          ]
        },
        {
          "titulo": "Como executar",
          "linhas": [
            25,
            34
          ],
          "explicacao": "As duas formas de execução são registradas para que outra pessoa consiga reproduzir os testes.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de readme dentro do exercício.",
            "porque": "Este trecho existe para manter a sequência entre estrutura, comportamento, teste e entrega.",
            "ordem": "Leia de cima para baixo e acompanhe como cada linha prepara a próxima ação.",
            "erroComum": "Compare nomes, fechamento, pontuação e posição das instruções antes de validar.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "code"
          ]
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 07 - Do algoritmo ao código: Python e JavaScript",
      "descricao": "Nesta atividade, vamos representar um orçamento em pseudocódigo e executar a mesma sequência em JavaScript e Python.\n\nAlteração obrigatória: troque a taxa operacional de 10% para 12% nas três representações e personalize o nome do serviço.\n\nTeste os mesmos valores no navegador e no terminal Python e confirme resultados equivalentes.\n\nEntrega: anexar o link do repositório do GitHub."
    },
    "permitirBase": {
      "pseudocodigo": false,
      "html": false,
      "css": false,
      "js": false,
      "python": false,
      "readme": false
    },
    "validacao": {
      "strictDeclarations": false,
      "aceitarEquivalencias": true,
      "algoritmoSequencialPseudocodigo": {
        "minimoEntradas": 2,
        "minimoSaidas": 2,
        "exigirInicioFim": false,
        "exigirTaxa": true,
        "minimoAtribuicoes": 2
      },
      "htmlEstrutura": {
        "idsObrigatorios": [
          "simulador",
          "formularioOrcamento",
          "nomeCliente",
          "horasPrevistas",
          "valorHora",
          "resultadoOrcamento"
        ],
        "tagsMinimas": {
          "header": 1,
          "main": 1,
          "section": 1,
          "aside": 1,
          "footer": 1,
          "form": 1,
          "input": 3,
          "label": 3,
          "button": 1,
          "h1": 1,
          "h2": 1,
          "ol": 1
        },
        "referenciasArquivos": {
          "css": "estilo.css",
          "js": "script.js"
        },
        "rotulosAssociados": [
          "nomeCliente",
          "horasPrevistas",
          "valorHora"
        ],
        "seletoresObrigatorios": [
          {
            "selector": "#formularioOrcamento button[type=\"submit\"]",
            "message": "Inclua um botão de envio dentro do formulário."
          },
          {
            "selector": "#resultadoOrcamento[role=\"status\"]",
            "message": "Mantenha uma região de status para a saída."
          }
        ],
        "atributosObrigatorios": [
          {
            "selector": "#nomeCliente",
            "attribute": "required"
          },
          {
            "selector": "#horasPrevistas",
            "attribute": "type",
            "value": "number"
          },
          {
            "selector": "#valorHora",
            "attribute": "type",
            "value": "number"
          }
        ],
        "proibirTabindexPositivo": false
      },
      "cssEstrutura": {
        "minimoVariaveis": 3,
        "minimoUsosVar": 3,
        "tiposSeletores": [
          "elemento",
          "classe",
          "pseudoclasse"
        ],
        "exigirBoxSizing": true,
        "exigirBoxModelCompleto": false,
        "proibir": [],
        "minimoTiposSeletores": 2
      },
      "algoritmoSequencialJS": {
        "minimoLeiturasValue": 2,
        "minimoConversoesNumericas": 1,
        "exigirSubmit": true,
        "exigirPreventDefault": true,
        "exigirTaxa": true,
        "exigirSaidaSegura": true,
        "proibir": [
          "innerHTML",
          "eval(",
          "for(",
          "while(",
          " if(",
          "switch("
        ]
      },
      "algoritmoSequencialPython": {
        "minimoInputs": 2,
        "minimoConversoesNumericas": 1,
        "minimoPrints": 2,
        "exigirTaxa": true,
        "proibir": [
          "eval(",
          "exec(",
          " if ",
          "for ",
          "while ",
          "def ",
          "class "
        ]
      },
      "markdownEstrutura": {
        "codigoExercicio": "FE07",
        "minimoCaracteres": 60,
        "titulosObrigatorios": [],
        "arquivosObrigatorios": [
          "index.html",
          "script.js",
          "main.py"
        ],
        "conteudosObrigatorios": [
          "python main.py"
        ]
      },
      "politica": "conceitos_essenciais"
    },
    "glossario": [
      {
        "id": "doctype",
        "termo": "doctype",
        "categoria": "Declaração",
        "traducao": "Documento HTML",
        "explicacao": "Informa ao navegador que o arquivo utiliza HTML moderno.",
        "erroComum": "Esquecer ou alterar pode ativar modos antigos do navegador.",
        "linguagem": "html",
        "exercicio": "FE07"
      },
      {
        "id": "lang",
        "termo": "lang",
        "categoria": "Atributo",
        "traducao": "Idioma",
        "explicacao": "Indica que o conteúdo principal está em português do Brasil.",
        "erroComum": "Usar um idioma incorreto prejudica leitores de tela.",
        "linguagem": "html",
        "exercicio": "FE07"
      },
      {
        "id": "id",
        "termo": "id",
        "categoria": "Atributo",
        "traducao": "Identificador",
        "explicacao": "Cria um nome único para localizar um elemento no CSS ou JavaScript.",
        "erroComum": "Repetir o mesmo id ou escrever nomes diferentes quebra seletores.",
        "linguagem": "html",
        "exercicio": "FE07"
      },
      {
        "id": "ariaLive",
        "termo": "aria-live",
        "categoria": "Atributo de acessibilidade",
        "traducao": "Região viva",
        "explicacao": "Faz leitores de tela anunciarem mudanças no conteúdo.",
        "erroComum": "Remover pode ocultar mensagens dinâmicas para usuários de leitor de tela.",
        "linguagem": "html",
        "exercicio": "FE07"
      },
      {
        "id": "root",
        "termo": "root",
        "categoria": "Seletor",
        "traducao": "Raiz do documento",
        "explicacao": "Centraliza variáveis CSS reutilizáveis.",
        "erroComum": "Declarar variável e não usar var() reduz a utilidade.",
        "linguagem": "css",
        "exercicio": "FE07"
      },
      {
        "id": "boxSizing",
        "termo": "box-sizing",
        "categoria": "Propriedade",
        "traducao": "Modelo de caixa",
        "explicacao": "Inclui padding e borda no tamanho final do elemento.",
        "erroComum": "Sem ela, largura e altura podem crescer além do esperado.",
        "linguagem": "css",
        "exercicio": "FE07"
      },
      {
        "id": "grid",
        "termo": "grid",
        "categoria": "Valor de display",
        "traducao": "Grade",
        "explicacao": "Organiza elementos em linhas e colunas.",
        "erroComum": "Definir grid sem colunas pode não produzir o layout esperado.",
        "linguagem": "css",
        "exercicio": "FE07"
      },
      {
        "id": "media",
        "termo": "media",
        "categoria": "Regra condicional",
        "traducao": "Consulta de mídia",
        "explicacao": "Aplica regras quando a tela atende a uma condição.",
        "erroComum": "Usar largura fixa ou condição incorreta causa overflow.",
        "linguagem": "css",
        "exercicio": "FE07"
      },
      {
        "id": "querySelector",
        "termo": "querySelector",
        "categoria": "Método",
        "traducao": "Selecionar elemento",
        "explicacao": "Localiza o primeiro elemento que corresponde a um seletor CSS.",
        "erroComum": "Se o seletor estiver errado, o resultado será null.",
        "linguagem": "js",
        "exercicio": "FE07"
      },
      {
        "id": "value",
        "termo": "value",
        "categoria": "Propriedade",
        "traducao": "Valor do campo",
        "explicacao": "Lê o texto ou número informado em um input.",
        "erroComum": "Esquecer a conversão mantém números como texto.",
        "linguagem": "js",
        "exercicio": "FE07"
      },
      {
        "id": "Number",
        "termo": "Number",
        "categoria": "Função",
        "traducao": "Número",
        "explicacao": "Converte um valor para número no JavaScript.",
        "erroComum": "Texto inválido produz NaN.",
        "linguagem": "js",
        "exercicio": "FE07"
      },
      {
        "id": "preventDefault",
        "termo": "preventDefault",
        "categoria": "Método",
        "traducao": "Impedir comportamento padrão",
        "explicacao": "Evita o recarregamento automático de um formulário.",
        "erroComum": "Sem ele, a página pode recarregar e apagar o resultado.",
        "linguagem": "js",
        "exercicio": "FE07"
      },
      {
        "id": "textContent",
        "termo": "textContent",
        "categoria": "Propriedade",
        "traducao": "Conteúdo textual",
        "explicacao": "Lê ou altera texto sem interpretar HTML.",
        "erroComum": "Usar innerHTML sem necessidade aumenta risco e pode alterar a estrutura.",
        "linguagem": "js",
        "exercicio": "FE07"
      },
      {
        "id": "input",
        "termo": "input",
        "categoria": "Função nativa",
        "traducao": "Entrada",
        "explicacao": "Mostra uma pergunta, pausa o programa e devolve o que foi digitado como str.",
        "erroComum": "Tentar calcular sem converter o texto gera erro ou resultado incorreto.",
        "linguagem": "python",
        "exercicio": "FE07"
      },
      {
        "id": "strip",
        "termo": "strip",
        "categoria": "Método de string",
        "traducao": "Remover espaços externos",
        "explicacao": "Remove espaços antes e depois do texto digitado.",
        "erroComum": "Não altera espaços internos do nome.",
        "linguagem": "python",
        "exercicio": "FE07"
      },
      {
        "id": "float",
        "termo": "float",
        "categoria": "Tipo e função de conversão",
        "traducao": "Número decimal",
        "explicacao": "Converte texto numérico para valor decimal.",
        "erroComum": "Vírgula decimal ou texto inválido gera ValueError.",
        "linguagem": "python",
        "exercicio": "FE07"
      },
      {
        "id": "print",
        "termo": "print",
        "categoria": "Função nativa",
        "traducao": "Saída",
        "explicacao": "Exibe informações no terminal.",
        "erroComum": "Esquecer parênteses ou aspas causa SyntaxError.",
        "linguagem": "python",
        "exercicio": "FE07"
      },
      {
        "id": "fstring",
        "termo": "f-string",
        "categoria": "Literal formatado",
        "traducao": "Texto interpolado",
        "explicacao": "Insere valores de variáveis dentro de uma string iniciada por f.",
        "erroComum": "Esquecer o f mostra as chaves como texto comum.",
        "linguagem": "python",
        "exercicio": "FE07"
      },
      {
        "id": "heading",
        "termo": "heading",
        "categoria": "Sintaxe Markdown",
        "traducao": "Título",
        "explicacao": "Organiza a documentação em seções com #.",
        "erroComum": "Usar títulos sem conteúdo deixa o README incompleto.",
        "linguagem": "markdown",
        "exercicio": "FE07"
      },
      {
        "id": "code",
        "termo": "code",
        "categoria": "Sintaxe Markdown",
        "traducao": "Código em linha",
        "explicacao": "Destaca nomes de arquivos e comandos com crases.",
        "erroComum": "Aspas comuns não produzem o mesmo destaque.",
        "linguagem": "markdown",
        "exercicio": "FE07"
      },
      {
        "id": "entrada",
        "termo": "entrada",
        "categoria": "Etapa de algoritmo",
        "traducao": "Dados recebidos",
        "explicacao": "Representa as informações fornecidas antes do processamento.",
        "erroComum": "Usar a entrada diretamente em cálculo sem converter o tipo quando necessário.",
        "linguagem": "pseudocodigo",
        "exercicio": "FE07"
      },
      {
        "id": "processamento",
        "termo": "processamento",
        "categoria": "Etapa de algoritmo",
        "traducao": "Transformação dos dados",
        "explicacao": "Reúne cálculos e regras que transformam as entradas em resultados.",
        "erroComum": "Misturar saída ou mensagens dentro do cálculo dificulta compreender a sequência.",
        "linguagem": "pseudocodigo",
        "exercicio": "FE07"
      },
      {
        "id": "saida",
        "termo": "saída",
        "categoria": "Etapa de algoritmo",
        "traducao": "Resultado apresentado",
        "explicacao": "Mostra ao usuário os valores produzidos pelo processamento.",
        "erroComum": "Exibir uma variável antes de ela receber o resultado correto.",
        "linguagem": "pseudocodigo",
        "exercicio": "FE07"
      }
    ],
    "dicasProgressivas": {
      "html": [
        "Relembre: o HTML organiza o conteúdo e conecta os outros arquivos.",
        "Localize: confira primeiro o head, depois os IDs usados pelo JavaScript.",
        "Compare: os nomes escritos em id devem ser exatamente iguais aos seletores.",
        "Estrutura parcial: mantenha abertura e fechamento das tags na ordem correta.",
        "Exemplo semelhante: crie outro botão e outra área de mensagem com nomes diferentes."
      ],
      "css": [
        "Relembre: seletores escolhem elementos e propriedades definem a apresentação.",
        "Localize: confira a regra que deveria afetar o elemento observado.",
        "Compare: verifique ponto da classe, dois-pontos, ponto e vírgula e unidade.",
        "Estrutura parcial: seletor { propriedade: valor; }.",
        "Exemplo semelhante: teste uma cor ou espaçamento diferente permitido."
      ],
      "js": [
        "Relembre: primeiro localize o elemento; depois registre a ação.",
        "Localize: confira o seletor e o callback do evento.",
        "Compare: a alteração precisa estar dentro da função executada pelo evento.",
        "Estrutura parcial: elemento.addEventListener('click', () => { /* ação */ });",
        "Exemplo semelhante: altere o texto de outro elemento com outro botão."
      ],
      "python": [
        "Relembre: input() sempre devolve texto.",
        "Localize: confira as linhas de entrada e conversão.",
        "Compare: o cálculo deve usar valores numéricos, não strings.",
        "Estrutura parcial: valor = float(input('Pergunta: ')).",
        "Exemplo semelhante: calcule quantidade x preço com outros nomes."
      ]
    },
    "comportamento": {
      "titulo": "Teste comportamental do orçamento",
      "instrucao": "Execute o preview e envie o formulário. O resultado precisa mudar depois do cálculo; a redação da saída pode ser personalizada.",
      "criterios": [
        {
          "id": "enviar-orcamento",
          "tipo": "event",
          "evento": "submit",
          "seletor": "#formularioOrcamento",
          "rotulo": "Enviar o formulário de orçamento"
        },
        {
          "id": "resultado-alterado",
          "tipo": "textChangedFrom",
          "seletor": "#resultadoOrcamento",
          "valor": "Preencha os dados e selecione o botão Calcular orçamento.",
          "rotulo": "A saída mudou após o cálculo"
        }
      ]
    },
    "referenciaCompletaPadrao": false
  }
];

window.DISCIPLINE_CONFIGS = {
  "frontend": {
    "name": "Plataforma 2DS Sub - Programação Front-End - Aluno",
    "shortName": "Programação Front-End",
    "slug": "frontend",
    "storagePrefix": "ds2sub_frontend",
    "version": "0.1.42",
    "releasedAt": "2026-08-12T22:11:00-03:00",
    "versionManifest": "version.json",
    "classroomUrl": "https://classroom.google.com/",
    "githubDefault": "https://github.com/",
    "repositorio": "atividades-frontend-sub",
    "minimumActiveSeconds": 300
  }
};

window.DISCIPLINES = {
  "frontend": {
    "label": "Programação Front-End",
    "config": {
      "name": "Plataforma 2DS Sub - Programação Front-End - Aluno",
      "shortName": "Programação Front-End",
      "slug": "frontend",
      "storagePrefix": "ds2sub_frontend",
      "version": "0.1.42",
      "releasedAt": "2026-08-12T22:11:00-03:00",
      "versionManifest": "version.json",
      "classroomUrl": "https://classroom.google.com/",
      "githubDefault": "https://github.com/",
      "repositorio": "atividades-frontend-sub",
      "minimumActiveSeconds": 300
    },
    "exercises": [
      {
        "numero": 1,
        "codigo": "FE01",
        "titulo": "FE01 - Ambiente, VS Code, pastas e primeiro projeto",
        "nomeCurto": "Ambiente, VS Code, pastas e primeiro projeto",
        "tema": "Organização do ambiente de desenvolvimento",
        "objetivo": "Preparar uma pasta Web organizada, conectar HTML, CSS e JavaScript e executar a página no navegador.",
        "produto": "Primeira página Front-End documentada e com uma interação de verificação do ambiente.",
        "contextoProfissional": "Organização inicial de um projeto Web, semelhante à estrutura usada por equipes para separar conteúdo, aparência, comportamento e documentação.",
        "alteracaoObrigatoria": "No README.md, substitua os campos de identificação pelo seu nome, confirme a turma e descreva como executou a página. Depois, personalize o texto do rodapé no index.html sem remover a identificação FE01.",
        "retomadas": [
          "uso básico de arquivos e pastas",
          "navegação no computador"
        ],
        "novos": [
          "Visual Studio Code",
          "estrutura de projeto Web",
          "index.html",
          "estilo.css",
          "script.js",
          "README.md",
          "console do navegador"
        ],
        "pasta": "exercicio-01",
        "repositorio": "atividades-frontend-sub",
        "classroomUrl": "https://classroom.google.com/",
        "githubUrl": "https://github.com/",
        "tempoMinimoSegundos": 300,
        "ordemArquivos": [
          "html",
          "css",
          "js",
          "readme"
        ],
        "arquivos": {
          "html": "<!doctype html>\n<html lang=\"pt-BR\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Atividade</title>\n</head>\n<body>\n  <main>\n    <!-- Desenvolva aqui a estrutura solicitada. -->\n  </main>\n</body>\n</html>\n",
          "css": "/* Desenvolva aqui os estilos solicitados. */\n",
          "js": "'use strict';\n// Desenvolva aqui o comportamento solicitado.\n",
          "readme": "# FE01 - Meu primeiro projeto Front-End\n\nPrimeiro projeto da disciplina **Programação Front-End**, organizado para testar a ligação entre HTML, CSS e JavaScript.\n\n## Estrutura da pasta\n\n```text\nexercicio-01/\n-  index.html\n-  estilo.css\n-  script.js\n-  README.md\n```\n\n## Como executar\n\n1. Abra a pasta no Visual Studio Code.\n2. Abra o arquivo `index.html` no navegador ou utilize a extensão Live Server.\n3. Clique em **Verificar projeto**.\n4. Confirme se a mensagem de sucesso aparece na página.\n\n## Identificação do estudante\n\n- Nome: **substitua pelo seu nome**\n- Turma: **2 DS Subsequente - Noturno**\n- Forma escolhida para executar: **descreva aqui**\n\n## Entrega\n\nEnvie o link do repositório solicitado pelo professor e anexe a evidência gerada pela plataforma.\n"
        },
        "nomesArquivos": {
          "html": "index.html",
          "css": "estilo.css",
          "js": "script.js",
          "readme": "README.md"
        },
        "linguagens": {
          "html": "html",
          "css": "css",
          "js": "js",
          "readme": "markdown"
        },
        "passos": {
          "html": [
            {
              "titulo": "Documento e arquivos conectados",
              "linhas": [
                1,
                9
              ],
              "explicacao": "O início cria o documento HTML, define o idioma e conecta estilo.css e script.js. O atributo defer faz o JavaScript esperar a leitura do HTML.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de html dentro do exercício.",
                "porque": "O HTML define a estrutura que o CSS estiliza e o JavaScript localiza.",
                "ordem": "O navegador lê a declaração, o head e depois constrói os elementos do body.",
                "erroComum": "Tag não fechada, id divergente ou caminho de arquivo incorreto.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "doctype",
                "lang",
                "defer"
              ]
            },
            {
              "titulo": "Cabeçalho e conteúdo principal",
              "linhas": [
                10,
                42
              ],
              "explicacao": "O corpo usa header, main, section e article para organizar a apresentação do projeto, a função de cada arquivo e o teste do ambiente.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de html dentro do exercício.",
                "porque": "O HTML define a estrutura que o CSS estiliza e o JavaScript localiza.",
                "ordem": "O navegador lê a declaração, o head e depois constrói os elementos do body.",
                "erroComum": "Tag não fechada, id divergente ou caminho de arquivo incorreto.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "id"
              ]
            },
            {
              "titulo": "Resultado e encerramento",
              "linhas": [
                43,
                52
              ],
              "explicacao": "O parágrafo com aria-live receberá a mensagem do JavaScript. O footer identifica o exercício e encerra a página.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de html dentro do exercício.",
                "porque": "O HTML define a estrutura que o CSS estiliza e o JavaScript localiza.",
                "ordem": "O navegador lê a declaração, o head e depois constrói os elementos do body.",
                "erroComum": "Tag não fechada, id divergente ou caminho de arquivo incorreto.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "ariaLive"
              ]
            }
          ],
          "css": [
            {
              "titulo": "Variáveis e preparação",
              "linhas": [
                1,
                18
              ],
              "explicacao": "As variáveis guardam as cores principais. O seletor universal aplica box-sizing para facilitar o controle dos tamanhos.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de css dentro do exercício.",
                "porque": "O CSS transforma a estrutura HTML em uma interface legível e responsiva.",
                "ordem": "A cascata combina regras gerais, componentes e ajustes de tela pequena.",
                "erroComum": "Seletor sem correspondência, propriedade inválida ou largura fixa causando overflow.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "root",
                "boxSizing"
              ]
            },
            {
              "titulo": "Layout e componentes",
              "linhas": [
                19,
                103
              ],
              "explicacao": "Estas regras estilizam o corpo, o cabeçalho, os painéis, os cartões, o botão e a mensagem de status.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de css dentro do exercício.",
                "porque": "O CSS transforma a estrutura HTML em uma interface legível e responsiva.",
                "ordem": "A cascata combina regras gerais, componentes e ajustes de tela pequena.",
                "erroComum": "Seletor sem correspondência, propriedade inválida ou largura fixa causando overflow.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "grid"
              ]
            },
            {
              "titulo": "Responsividade",
              "linhas": [
                104,
                131
              ],
              "explicacao": "A media query reorganiza os cartões em uma coluna e amplia o botão quando a tela é pequena.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de css dentro do exercício.",
                "porque": "O CSS transforma a estrutura HTML em uma interface legível e responsiva.",
                "ordem": "A cascata combina regras gerais, componentes e ajustes de tela pequena.",
                "erroComum": "Seletor sem correspondência, propriedade inválida ou largura fixa causando overflow.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "media"
              ]
            }
          ],
          "js": [
            {
              "titulo": "Localização dos elementos",
              "linhas": [
                1,
                2
              ],
              "explicacao": "querySelector localiza o botão e a área que exibirá a resposta do teste.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de js dentro do exercício.",
                "porque": "Este bloco conecta uma ação do usuário ao comportamento visível da página.",
                "ordem": "Primeiro os elementos são localizados; depois o evento é registrado; por último o callback altera a interface.",
                "erroComum": "Executar a alteração fora do evento ou usar um seletor que não encontra o elemento.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "querySelector"
              ]
            },
            {
              "titulo": "Resposta ao clique",
              "linhas": [
                4,
                8
              ],
              "explicacao": "addEventListener aguarda o clique e então muda a mensagem, adiciona a classe de sucesso e atualiza o texto do botão.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de js dentro do exercício.",
                "porque": "Este bloco conecta uma ação do usuário ao comportamento visível da página.",
                "ordem": "Primeiro os elementos são localizados; depois o evento é registrado; por último o callback altera a interface.",
                "erroComum": "Executar a alteração fora do evento ou usar um seletor que não encontra o elemento.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "addEventListener",
                "textContent",
                "classList"
              ]
            }
          ],
          "readme": [
            {
              "titulo": "Apresentação e estrutura",
              "linhas": [
                1,
                14
              ],
              "explicacao": "O README apresenta o exercício e registra a estrutura esperada da pasta.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de readme dentro do exercício.",
                "porque": "Este trecho existe para manter a sequência entre estrutura, comportamento, teste e entrega.",
                "ordem": "Leia de cima para baixo e acompanhe como cada linha prepara a próxima ação.",
                "erroComum": "Compare nomes, fechamento, pontuação e posição das instruções antes de validar.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "heading",
                "code"
              ]
            },
            {
              "titulo": "Execução e teste",
              "linhas": [
                16,
                23
              ],
              "explicacao": "Estas etapas orientam a abertura no VS Code, a execução no navegador e o teste do botão.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de readme dentro do exercício.",
                "porque": "Este trecho existe para manter a sequência entre estrutura, comportamento, teste e entrega.",
                "ordem": "Leia de cima para baixo e acompanhe como cada linha prepara a próxima ação.",
                "erroComum": "Compare nomes, fechamento, pontuação e posição das instruções antes de validar.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "heading"
              ]
            },
            {
              "titulo": "Identificação e entrega",
              "linhas": [
                25,
                30
              ],
              "explicacao": "O estudante deve substituir os campos de identificação e manter documentada a forma usada para executar a página.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de readme dentro do exercício.",
                "porque": "Este trecho existe para manter a sequência entre estrutura, comportamento, teste e entrega.",
                "ordem": "Leia de cima para baixo e acompanhe como cada linha prepara a próxima ação.",
                "erroComum": "Compare nomes, fechamento, pontuação e posição das instruções antes de validar.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "heading"
              ]
            }
          ]
        },
        "classroom": {
          "titulo": "Exercício 01 - Ambiente, VS Code, pastas e primeiro projeto",
          "descricao": "Nesta atividade, vamos preparar o ambiente de Programação Front-End e construir a primeira pasta de projeto no Visual Studio Code.\n\nVocê criará os arquivos index.html, estilo.css, script.js e README.md, compreenderá a função de cada um, abrirá a página no navegador e usará o botão de verificação para confirmar que os três arquivos principais estão conectados.\n\nAlteração obrigatória: complete a identificação no README.md e personalize o rodapé da página sem remover a indicação do FE01.\n\nAo terminar, valide todos os arquivos na plataforma, gere a evidência e salve o projeto na pasta exercicio-01 do repositório atividades-frontend-sub.\n\nEntrega: anexar o link do repositório do GitHub."
        },
        "permitirBase": {
          "html": false,
          "css": false,
          "js": false,
          "readme": false
        },
        "validacao": {
          "strictDeclarations": false,
          "aceitarEquivalencias": true,
          "htmlEstrutura": {
            "idsObrigatorios": [
              "titulo-arquivos",
              "titulo-teste",
              "testarProjeto",
              "statusProjeto"
            ],
            "tagsMinimas": {
              "header": 1,
              "main": 1,
              "section": 1,
              "article": 1,
              "footer": 1,
              "button": 1,
              "h1": 1,
              "h2": 1
            },
            "referenciasArquivos": {
              "css": "estilo.css",
              "js": "script.js"
            },
            "seletoresObrigatorios": [
              {
                "selector": "#testarProjeto[type=\"button\"]",
                "message": "Mantenha o botão de verificação com type=\"button\"."
              }
            ]
          },
          "markdownEstrutura": {
            "codigoExercicio": "FE01",
            "minimoCaracteres": 50,
            "titulosObrigatorios": [],
            "arquivosObrigatorios": [
              "index.html",
              "estilo.css",
              "script.js"
            ],
            "conteudosObrigatorios": [
              "navegador"
            ],
            "proibirPlaceholders": [
              "substitua pelo seu nome",
              "descreva aqui"
            ]
          },
          "jsComportamento": [
            {
              "event": "click",
              "triggerId": "testarProjeto",
              "acoes": [
                {
                  "type": "text",
                  "targetId": "statusProjeto"
                },
                {
                  "type": "classAdd",
                  "targetId": "statusProjeto"
                },
                {
                  "type": "text",
                  "targetId": "testarProjeto"
                }
              ]
            }
          ],
          "politica": "conceitos_essenciais"
        },
        "glossario": [
          {
            "id": "doctype",
            "termo": "doctype",
            "categoria": "Declaração",
            "traducao": "Documento HTML",
            "explicacao": "Informa ao navegador que o arquivo utiliza HTML moderno.",
            "erroComum": "Esquecer ou alterar pode ativar modos antigos do navegador.",
            "linguagem": "html",
            "exercicio": "FE01"
          },
          {
            "id": "lang",
            "termo": "lang",
            "categoria": "Atributo",
            "traducao": "Idioma",
            "explicacao": "Indica que o conteúdo principal está em português do Brasil.",
            "erroComum": "Usar um idioma incorreto prejudica leitores de tela.",
            "linguagem": "html",
            "exercicio": "FE01"
          },
          {
            "id": "defer",
            "termo": "defer",
            "categoria": "Atributo",
            "traducao": "Adiar",
            "explicacao": "Faz o JavaScript aguardar a leitura do HTML antes de executar.",
            "erroComum": "Sem defer, o script pode procurar elementos que ainda não existem.",
            "linguagem": "html",
            "exercicio": "FE01"
          },
          {
            "id": "id",
            "termo": "id",
            "categoria": "Atributo",
            "traducao": "Identificador",
            "explicacao": "Cria um nome único para localizar um elemento no CSS ou JavaScript.",
            "erroComum": "Repetir o mesmo id ou escrever nomes diferentes quebra seletores.",
            "linguagem": "html",
            "exercicio": "FE01"
          },
          {
            "id": "ariaLive",
            "termo": "aria-live",
            "categoria": "Atributo de acessibilidade",
            "traducao": "Região viva",
            "explicacao": "Faz leitores de tela anunciarem mudanças no conteúdo.",
            "erroComum": "Remover pode ocultar mensagens dinâmicas para usuários de leitor de tela.",
            "linguagem": "html",
            "exercicio": "FE01"
          },
          {
            "id": "root",
            "termo": "root",
            "categoria": "Seletor",
            "traducao": "Raiz do documento",
            "explicacao": "Centraliza variáveis CSS reutilizáveis.",
            "erroComum": "Declarar variável e não usar var() reduz a utilidade.",
            "linguagem": "css",
            "exercicio": "FE01"
          },
          {
            "id": "boxSizing",
            "termo": "box-sizing",
            "categoria": "Propriedade",
            "traducao": "Modelo de caixa",
            "explicacao": "Inclui padding e borda no tamanho final do elemento.",
            "erroComum": "Sem ela, largura e altura podem crescer além do esperado.",
            "linguagem": "css",
            "exercicio": "FE01"
          },
          {
            "id": "grid",
            "termo": "grid",
            "categoria": "Valor de display",
            "traducao": "Grade",
            "explicacao": "Organiza elementos em linhas e colunas.",
            "erroComum": "Definir grid sem colunas pode não produzir o layout esperado.",
            "linguagem": "css",
            "exercicio": "FE01"
          },
          {
            "id": "media",
            "termo": "media",
            "categoria": "Regra condicional",
            "traducao": "Consulta de mídia",
            "explicacao": "Aplica regras quando a tela atende a uma condição.",
            "erroComum": "Usar largura fixa ou condição incorreta causa overflow.",
            "linguagem": "css",
            "exercicio": "FE01"
          },
          {
            "id": "querySelector",
            "termo": "querySelector",
            "categoria": "Método",
            "traducao": "Selecionar elemento",
            "explicacao": "Localiza o primeiro elemento que corresponde a um seletor CSS.",
            "erroComum": "Se o seletor estiver errado, o resultado será null.",
            "linguagem": "js",
            "exercicio": "FE01"
          },
          {
            "id": "addEventListener",
            "termo": "addEventListener",
            "categoria": "Método",
            "traducao": "Adicionar observador de evento",
            "explicacao": "Registra uma função para executar quando uma ação acontece.",
            "erroComum": "Colocar a lógica fora do callback faz ela executar antes do clique.",
            "linguagem": "js",
            "exercicio": "FE01"
          },
          {
            "id": "textContent",
            "termo": "textContent",
            "categoria": "Propriedade",
            "traducao": "Conteúdo textual",
            "explicacao": "Lê ou altera texto sem interpretar HTML.",
            "erroComum": "Usar innerHTML sem necessidade aumenta risco e pode alterar a estrutura.",
            "linguagem": "js",
            "exercicio": "FE01"
          },
          {
            "id": "classList",
            "termo": "classList",
            "categoria": "Propriedade",
            "traducao": "Lista de classes",
            "explicacao": "Permite adicionar, remover ou alternar classes CSS.",
            "erroComum": "Digitar uma classe diferente da existente impede o estilo.",
            "linguagem": "js",
            "exercicio": "FE01"
          },
          {
            "id": "heading",
            "termo": "heading",
            "categoria": "Sintaxe Markdown",
            "traducao": "Título",
            "explicacao": "Organiza a documentação em seções com #.",
            "erroComum": "Usar títulos sem conteúdo deixa o README incompleto.",
            "linguagem": "markdown",
            "exercicio": "FE01"
          },
          {
            "id": "code",
            "termo": "code",
            "categoria": "Sintaxe Markdown",
            "traducao": "Código em linha",
            "explicacao": "Destaca nomes de arquivos e comandos com crases.",
            "erroComum": "Aspas comuns não produzem o mesmo destaque.",
            "linguagem": "markdown",
            "exercicio": "FE01"
          }
        ],
        "dicasProgressivas": {
          "html": [
            "Relembre: o HTML organiza o conteúdo e conecta os outros arquivos.",
            "Localize: confira primeiro o head, depois os IDs usados pelo JavaScript.",
            "Compare: os nomes escritos em id devem ser exatamente iguais aos seletores.",
            "Estrutura parcial: mantenha abertura e fechamento das tags na ordem correta.",
            "Exemplo semelhante: crie outro botão e outra área de mensagem com nomes diferentes."
          ],
          "css": [
            "Relembre: seletores escolhem elementos e propriedades definem a apresentação.",
            "Localize: confira a regra que deveria afetar o elemento observado.",
            "Compare: verifique ponto da classe, dois-pontos, ponto e vírgula e unidade.",
            "Estrutura parcial: seletor { propriedade: valor; }.",
            "Exemplo semelhante: teste uma cor ou espaçamento diferente permitido."
          ],
          "js": [
            "Relembre: primeiro localize o elemento; depois registre a ação.",
            "Localize: confira o seletor e o callback do evento.",
            "Compare: a alteração precisa estar dentro da função executada pelo evento.",
            "Estrutura parcial: elemento.addEventListener('click', () => { /* ação */ });",
            "Exemplo semelhante: altere o texto de outro elemento com outro botão."
          ],
          "python": [
            "Relembre: input() sempre devolve texto.",
            "Localize: confira as linhas de entrada e conversão.",
            "Compare: o cálculo deve usar valores numéricos, não strings.",
            "Estrutura parcial: valor = float(input('Pergunta: ')).",
            "Exemplo semelhante: calcule quantidade x preço com outros nomes."
          ]
        },
        "comportamento": {
          "titulo": "Teste comportamental do ambiente",
          "instrucao": "Execute o preview e clique em Verificar projeto. Para concluir, basta a ação funcionar e a mensagem de status mudar.",
          "criterios": [
            {
              "id": "acao-principal",
              "tipo": "event",
              "evento": "click",
              "seletor": "#testarProjeto",
              "rotulo": "Clicar no botão Verificar projeto"
            },
            {
              "id": "mensagem-alterada",
              "tipo": "textNotEquals",
              "seletor": "#statusProjeto",
              "valor": "Aguardando a verificação.",
              "rotulo": "A mensagem de status foi atualizada"
            }
          ]
        },
        "referenciaCompletaPadrao": false
      },
      {
        "numero": 2,
        "codigo": "FE02",
        "titulo": "FE02 - HTML semântico em uma página profissional",
        "nomeCurto": "HTML semântico em uma página profissional",
        "tema": "Semântica e organização do conteúdo",
        "objetivo": "Construir uma página empresarial com regiões semânticas que comuniquem claramente a função de cada conteúdo.",
        "produto": "Página institucional de uma empresa de serviços, com navegação interna e informações de atendimento.",
        "contextoProfissional": "Sites empresariais precisam ser compreensíveis para pessoas, mecanismos de busca, leitores de tela e equipes que darão manutenção no código.",
        "alteracaoObrigatoria": "Personalize a seção Equipe com uma função profissional e uma responsabilidade adicional. Soluções semanticamente equivalentes e conteúdos extras são aceitos desde que as regiões obrigatórias permaneçam.",
        "retomadas": [
          "estrutura básica do documento HTML",
          "ligação entre HTML, CSS e JavaScript"
        ],
        "novos": [
          "header",
          "nav",
          "main",
          "section",
          "article",
          "aside",
          "footer",
          "address",
          "navegação interna",
          "aria-labelledby",
          "aria-expanded",
          "atributo hidden"
        ],
        "pasta": "exercicio-02",
        "repositorio": "atividades-frontend-sub",
        "classroomUrl": "https://classroom.google.com/",
        "githubUrl": "https://github.com/",
        "tempoMinimoSegundos": 300,
        "ordemArquivos": [
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
        "linguagens": {
          "html": "html",
          "css": "css",
          "js": "js"
        },
        "passos": {
          "html": [
            {
              "titulo": "Documento, acessibilidade e cabeçalho",
              "linhas": [
                1,
                26
              ],
              "explicacao": "O documento define idioma e viewport, conecta os arquivos, oferece um link para pular o cabeçalho e usa header e nav para apresentar a empresa e a navegação principal.",
              "detalhes": {
                "objetivo": "Reconhecer a preparação do documento, o link de salto e os elementos semânticos usados no cabeçalho.",
                "porque": "Idioma, viewport e navegação acessível criam uma base que funciona para teclado, leitores de tela e telas pequenas.",
                "ordem": "O navegador interpreta a declaração e o head; depois cria o link de salto, o header e a nav antes do conteúdo principal.",
                "erroComum": "O href do link de salto não corresponder ao id do main ou os links da navegação apontarem para seções inexistentes.",
                "conferir": "Use Tab ao abrir a página, acione o link de salto e confira se o foco chega ao conteúdo principal."
              },
              "termos": [
                "doctype",
                "lang",
                "skipLink",
                "header",
                "nav"
              ]
            },
            {
              "titulo": "Conteúdo principal e serviços",
              "linhas": [
                28,
                47
              ],
              "explicacao": "main identifica o conteúdo central. A primeira section reúne o tema Serviços e cada article representa um serviço independente que poderia ser reutilizado ou distribuído separadamente.",
              "detalhes": {
                "objetivo": "Diferenciar main, section e article conforme o papel de cada conteúdo.",
                "porque": "A semântica permite que a estrutura continue compreensível sem depender de cores, bordas ou posição visual.",
                "ordem": "O main inicia o conteúdo central; a section apresenta o tema Serviços; cada article descreve um serviço independente.",
                "erroComum": "Usar article apenas porque o conteúdo aparece em cartão ou criar section sem título relacionado.",
                "conferir": "Desative o CSS mentalmente e verifique se os títulos e elementos ainda descrevem uma hierarquia lógica."
              },
              "termos": [
                "main",
                "section",
                "article"
              ]
            },
            {
              "titulo": "Processo e equipe",
              "linhas": [
                49,
                61
              ],
              "explicacao": "Duas sections agrupam assuntos diferentes. Os títulos ligados por aria-labelledby nomeiam cada região de forma explícita.",
              "detalhes": {
                "objetivo": "Relacionar regiões temáticas aos títulos usando aria-labelledby.",
                "porque": "Uma região nomeada ajuda tecnologias assistivas a navegar entre blocos extensos.",
                "ordem": "Cada section é criada e seu aria-labelledby aponta para o id do h2 que a nomeia.",
                "erroComum": "Digitar um id no aria-labelledby diferente do id existente no título.",
                "conferir": "Compare caractere por caractere o valor do atributo e o id do título de cada região."
              },
              "termos": [
                "section",
                "ariaLabelledby"
              ]
            },
            {
              "titulo": "Conteúdo complementar e contato",
              "linhas": [
                63,
                85
              ],
              "explicacao": "aside concentra uma informação complementar sobre atendimento. footer e address encerram a página com dados de contato e identificação do exercício.",
              "detalhes": {
                "objetivo": "Distinguir informação complementar, encerramento e dados de contato.",
                "porque": "aside, footer e address descrevem papéis que uma div genérica não comunica.",
                "ordem": "O aside complementa o main; o footer encerra a página; address identifica os contatos relacionados.",
                "erroComum": "Colocar informação indispensável somente no aside ou usar address para qualquer texto de localização.",
                "conferir": "Pergunte se a página ainda é compreensível sem o aside e se o address contém realmente contato."
              },
              "termos": [
                "aside",
                "address"
              ]
            }
          ],
          "css": [
            {
              "titulo": "Variáveis e base visual",
              "linhas": [
                1,
                40
              ],
              "explicacao": "As variáveis centralizam as cores. box-sizing e as regras do body criam uma base previsível para a página.",
              "detalhes": {
                "objetivo": "Compreender variáveis CSS, cálculo de caixas e base visual do documento.",
                "porque": "Uma base previsível evita repetição de cores e diferenças inesperadas de largura.",
                "ordem": "As variáveis são declaradas primeiro; box-sizing prepara as caixas; body aplica tipografia, fundo e cor.",
                "erroComum": "Usar var() com nome inexistente ou esquecer que padding aumenta a caixa sem border-box.",
                "conferir": "Altere temporariamente uma variável e observe todos os componentes que dependem dela."
              },
              "termos": [
                "customProperty",
                "boxSizing"
              ]
            },
            {
              "titulo": "Navegação e tipografia",
              "linhas": [
                42,
                105
              ],
              "explicacao": "O link de salto aparece ao receber foco. Cabeçalho, títulos, textos e navegação são estilizados sem depender de Flexbox ou Grid.",
              "detalhes": {
                "objetivo": "Estilizar navegação e textos preservando foco visível e leitura clara.",
                "porque": "Links precisam funcionar tanto com ponteiro quanto com teclado, e a tipografia deve manter hierarquia.",
                "ordem": "O link de salto fica fora da tela, aparece com foco e depois as regras estilizam cabeçalho, títulos e navegação.",
                "erroComum": "Usar display:none no link de salto ou remover outline sem criar um estilo de foco equivalente.",
                "conferir": "Navegue somente com Tab e confirme que cada link ativo permanece claramente visível."
              },
              "termos": [
                "skipLink",
                "focusVisible"
              ]
            },
            {
              "titulo": "Regiões semânticas e interação",
              "linhas": [
                107,
                163
              ],
              "explicacao": "section, aside, footer e article recebem aparência coerente. O botão e a área de detalhes ganham estados visuais claros.",
              "detalhes": {
                "objetivo": "Dar aparência consistente às regiões sem substituir o significado do HTML.",
                "porque": "O CSS deve reforçar a leitura sem ser a única fonte de organização ou estado.",
                "ordem": "Regras gerais criam os painéis; artigos recebem acabamento; botão e detalhes recebem estados de interação.",
                "erroComum": "Aplicar seletor a uma classe inexistente ou ocultar conteúdo apenas por cor.",
                "conferir": "Inspecione a classe de cada região e teste hover e foco do botão."
              },
              "termos": [
                "focusVisible",
                "hidden"
              ]
            },
            {
              "titulo": "Adaptação para telas pequenas",
              "linhas": [
                165,
                184
              ],
              "explicacao": "A media query reduz espaçamentos, transforma os itens da navegação em blocos e amplia o botão no celular.",
              "detalhes": {
                "objetivo": "Adaptar espaçamento, navegação e botão a uma tela estreita.",
                "porque": "Conteúdo legível no computador pode ficar apertado ou difícil de tocar no celular.",
                "ordem": "Quando a largura atinge o breakpoint, as regras mais recentes substituem apenas o necessário.",
                "erroComum": "Criar largura fixa ou botão pequeno que continua causando rolagem horizontal.",
                "conferir": "Teste em 320 px e confirme que links e botão ocupam área adequada sem corte."
              },
              "termos": [
                "mediaQuery"
              ]
            }
          ],
          "js": [
            {
              "titulo": "Elementos controlados",
              "linhas": [
                1,
                2
              ],
              "explicacao": "querySelector localiza o botão e a região complementar que começará oculta.",
              "detalhes": {
                "objetivo": "Localizar o botão e a região complementar usando seletores reais.",
                "porque": "O JavaScript precisa de referências válidas antes de registrar comportamento.",
                "ordem": "querySelector é executado ao carregar o script e guarda cada elemento em uma constante.",
                "erroComum": "Seletor incorreto retornar null e causar erro ao usar addEventListener.",
                "conferir": "Compare os seletores com os ids e classes do HTML e teste no console se os elementos existem."
              },
              "termos": [
                "querySelector"
              ]
            },
            {
              "titulo": "Estado acessível do atendimento",
              "linhas": [
                4,
                10
              ],
              "explicacao": "O clique lê aria-expanded, atualiza o atributo, controla hidden e troca o texto do botão sem remover a semântica do HTML.",
              "detalhes": {
                "objetivo": "Sincronizar clique, visibilidade, texto e estado acessível.",
                "porque": "Usuários visuais e de tecnologia assistiva precisam receber a mesma informação.",
                "ordem": "O clique lê aria-expanded, calcula o novo estado, atualiza o atributo, muda hidden e troca o rótulo.",
                "erroComum": "Alterar hidden sem atualizar aria-expanded ou comparar o atributo com booleano em vez de string.",
                "conferir": "Clique duas vezes e confirme que a região abre e fecha, o texto muda e aria-expanded alterna."
              },
              "termos": [
                "addEventListener",
                "getAttribute",
                "setAttribute",
                "hidden",
                "ariaExpanded",
                "ternary"
              ]
            }
          ]
        },
        "classroom": {
          "titulo": "Exercício 02 - HTML semântico em uma página profissional",
          "descricao": "Nesta atividade, vamos construir uma página institucional usando elementos HTML semânticos. A página deverá apresentar a empresa, sua navegação, serviços, processo de trabalho, equipe, atendimento e contato.\n\nVocê praticará header, nav, main, section, article, aside, footer e address, além de relações acessíveis com aria-labelledby, aria-expanded e hidden.\n\nAlteração obrigatória: personalize a seção Equipe com uma função profissional e uma responsabilidade adicional, mantendo a organização semântica.\n\nAo terminar, valide os três arquivos, teste a navegação por âncoras, revele e oculte os horários, gere a evidência e salve tudo na pasta exercicio-02.\n\nEntrega: anexar o link do repositório do GitHub."
        },
        "permitirBase": {
          "html": false,
          "css": false,
          "js": false
        },
        "validacao": {
          "strictDeclarations": false,
          "aceitarEquivalencias": true,
          "htmlEstrutura": {
            "idsObrigatorios": [
              "conteudo",
              "servicos",
              "processo",
              "equipe",
              "atendimento",
              "mostrarAtendimento",
              "detalhesAtendimento",
              "contato"
            ],
            "tagsMinimas": {
              "header": 1,
              "nav": 1,
              "main": 1,
              "section": 1,
              "article": 1,
              "aside": 1,
              "footer": 1,
              "h1": 1,
              "h2": 1,
              "button": 1
            },
            "referenciasArquivos": {
              "css": "estilo.css",
              "js": "script.js"
            },
            "ancorasObrigatorias": [
              "#servicos",
              "#contato"
            ],
            "atributosObrigatorios": [
              {
                "selector": "#detalhesAtendimento",
                "attribute": "hidden"
              }
            ]
          },
          "jsComportamento": [
            {
              "event": "click",
              "triggerId": "mostrarAtendimento",
              "acoes": [
                {
                  "type": "getAttribute",
                  "targetId": "mostrarAtendimento",
                  "attribute": "aria-expanded"
                },
                {
                  "type": "setAttribute",
                  "targetId": "mostrarAtendimento",
                  "attribute": "aria-expanded"
                },
                {
                  "type": "hidden",
                  "targetId": "detalhesAtendimento"
                },
                {
                  "type": "text",
                  "targetId": "mostrarAtendimento"
                }
              ]
            }
          ],
          "politica": "conceitos_essenciais"
        },
        "glossario": [
          {
            "id": "doctype",
            "termo": "<!DOCTYPE html>",
            "categoria": "Declaração",
            "traducao": "Documento HTML moderno",
            "explicacao": "Informa ao navegador que o arquivo utiliza o padrão atual do HTML.",
            "erroComum": "Remover a declaração pode ativar um modo antigo de renderização.",
            "linguagem": "html",
            "exercicio": "FE02"
          },
          {
            "id": "lang",
            "termo": "lang",
            "categoria": "Atributo",
            "traducao": "Idioma",
            "explicacao": "Indica o idioma principal do documento para navegadores e leitores de tela.",
            "erroComum": "Usar idioma incorreto prejudica pronúncia e acessibilidade.",
            "linguagem": "html",
            "exercicio": "FE02"
          },
          {
            "id": "skipLink",
            "termo": "link de salto",
            "categoria": "Recurso de acessibilidade",
            "traducao": "Pular para o conteúdo",
            "explicacao": "Permite que uma pessoa usando teclado ignore a navegação repetida e vá diretamente ao conteúdo principal.",
            "erroComum": "O destino do href precisa existir e receber foco de forma previsível.",
            "linguagem": "html",
            "exercicio": "FE02"
          },
          {
            "id": "header",
            "termo": "header",
            "categoria": "Elemento semântico",
            "traducao": "Cabeçalho",
            "explicacao": "Agrupa a apresentação inicial de uma página ou seção.",
            "erroComum": "Usar header apenas como caixa visual, sem relação com o conteúdo, reduz a clareza semântica.",
            "linguagem": "html",
            "exercicio": "FE02"
          },
          {
            "id": "nav",
            "termo": "nav",
            "categoria": "Elemento semântico",
            "traducao": "Navegação",
            "explicacao": "Identifica um conjunto principal de links de navegação.",
            "erroComum": "Colocar qualquer lista de links em nav sem necessidade pode enfraquecer a estrutura.",
            "linguagem": "html",
            "exercicio": "FE02"
          },
          {
            "id": "main",
            "termo": "main",
            "categoria": "Elemento semântico",
            "traducao": "Conteúdo principal",
            "explicacao": "Marca o conteúdo central e único da página.",
            "erroComum": "Deve existir apenas um main visível por página.",
            "linguagem": "html",
            "exercicio": "FE02"
          },
          {
            "id": "section",
            "termo": "section",
            "categoria": "Elemento semântico",
            "traducao": "Seção temática",
            "explicacao": "Agrupa conteúdo relacionado que normalmente possui um título.",
            "erroComum": "Criar section sem tema ou título pode ser menos adequado que uma div.",
            "linguagem": "html",
            "exercicio": "FE02"
          },
          {
            "id": "article",
            "termo": "article",
            "categoria": "Elemento semântico",
            "traducao": "Conteúdo independente",
            "explicacao": "Representa um conteúdo que poderia ser reutilizado ou distribuído separadamente.",
            "erroComum": "Usar article para qualquer cartão apenas por aparência não garante semântica correta.",
            "linguagem": "html",
            "exercicio": "FE02"
          },
          {
            "id": "ariaLabelledby",
            "termo": "aria-labelledby",
            "categoria": "Atributo de acessibilidade",
            "traducao": "Nomeado por outro elemento",
            "explicacao": "Relaciona uma região ao id do título que fornece seu nome acessível.",
            "erroComum": "Referenciar um id inexistente deixa a região sem o nome esperado.",
            "linguagem": "html",
            "exercicio": "FE02"
          },
          {
            "id": "aside",
            "termo": "aside",
            "categoria": "Elemento semântico",
            "traducao": "Conteúdo complementar",
            "explicacao": "Agrupa informação relacionada, mas secundária ao conteúdo principal.",
            "erroComum": "Não deve receber o conteúdo essencial que o usuário precisa para compreender a página.",
            "linguagem": "html",
            "exercicio": "FE02"
          },
          {
            "id": "address",
            "termo": "address",
            "categoria": "Elemento semântico",
            "traducao": "Informações de contato",
            "explicacao": "Identifica dados de contato do autor, organização ou seção relacionada.",
            "erroComum": "Não deve ser usado apenas para qualquer endereço postal sem contexto de contato.",
            "linguagem": "html",
            "exercicio": "FE02"
          },
          {
            "id": "hidden",
            "termo": "hidden",
            "categoria": "Atributo/propriedade",
            "traducao": "Oculto",
            "explicacao": "Remove temporariamente um elemento da apresentação e da árvore de acessibilidade.",
            "erroComum": "Alterar apenas a aparência no CSS pode deixar conteúdo oculto ainda acessível ou focável.",
            "linguagem": "html/js",
            "exercicio": "FE02"
          },
          {
            "id": "ariaExpanded",
            "termo": "aria-expanded",
            "categoria": "Atributo de acessibilidade",
            "traducao": "Expandido ou recolhido",
            "explicacao": "Comunica se um controle revela ou oculta uma região.",
            "erroComum": "O valor precisa acompanhar o estado visual real.",
            "linguagem": "html/js",
            "exercicio": "FE02"
          },
          {
            "id": "customProperty",
            "termo": "--variavel",
            "categoria": "Propriedade personalizada",
            "traducao": "Variável CSS",
            "explicacao": "Guarda um valor reutilizável, como uma cor, para manter consistência.",
            "erroComum": "Usar var() com nome diferente faz a propriedade perder o valor.",
            "linguagem": "css",
            "exercicio": "FE02"
          },
          {
            "id": "boxSizing",
            "termo": "box-sizing",
            "categoria": "Propriedade CSS",
            "traducao": "Cálculo da caixa",
            "explicacao": "Com border-box, padding e borda passam a fazer parte da largura definida.",
            "erroComum": "Sem essa regra, caixas podem ultrapassar a largura esperada.",
            "linguagem": "css",
            "exercicio": "FE02"
          },
          {
            "id": "focusVisible",
            "termo": ":focus-visible",
            "categoria": "Pseudoclasse",
            "traducao": "Foco visível",
            "explicacao": "Aplica estilo quando o elemento recebe foco por uma forma que precisa de indicação visual, como teclado.",
            "erroComum": "Remover o contorno sem alternativa torna a navegação por teclado difícil.",
            "linguagem": "css",
            "exercicio": "FE02"
          },
          {
            "id": "mediaQuery",
            "termo": "@media",
            "categoria": "Regra condicional CSS",
            "traducao": "Consulta de mídia",
            "explicacao": "Aplica ajustes de estilo conforme características da tela.",
            "erroComum": "Criar @media sem ajustar o layout real não garante responsividade.",
            "linguagem": "css",
            "exercicio": "FE02"
          },
          {
            "id": "querySelector",
            "termo": "querySelector",
            "categoria": "Método do DOM",
            "traducao": "Selecionar elemento",
            "explicacao": "Localiza o primeiro elemento que corresponde a um seletor CSS.",
            "erroComum": "Se o seletor estiver incorreto, o resultado será null.",
            "linguagem": "javascript",
            "exercicio": "FE02"
          },
          {
            "id": "addEventListener",
            "termo": "addEventListener",
            "categoria": "Método",
            "traducao": "Registrar evento",
            "explicacao": "Associa uma função a uma ação, como clique.",
            "erroComum": "Executar a alteração fora do callback faz a ação acontecer antes do clique.",
            "linguagem": "javascript",
            "exercicio": "FE02"
          },
          {
            "id": "getAttribute",
            "termo": "getAttribute",
            "categoria": "Método",
            "traducao": "Ler atributo",
            "explicacao": "Obtém o valor atual de um atributo do elemento.",
            "erroComum": "Comparar com booleano em vez de texto pode produzir resultado inesperado.",
            "linguagem": "javascript",
            "exercicio": "FE02"
          },
          {
            "id": "setAttribute",
            "termo": "setAttribute",
            "categoria": "Método",
            "traducao": "Atualizar atributo",
            "explicacao": "Define ou altera o valor de um atributo.",
            "erroComum": "Atualizar aria-expanded sem mudar a região visível cria divergência de acessibilidade.",
            "linguagem": "javascript",
            "exercicio": "FE02"
          },
          {
            "id": "ternary",
            "termo": "operador ternário",
            "categoria": "Operador condicional",
            "traducao": "Escolha curta",
            "explicacao": "Escolhe entre dois valores usando condição ? valor1 : valor2.",
            "erroComum": "Encadear muitos ternários reduz a legibilidade.",
            "linguagem": "javascript",
            "exercicio": "FE02"
          }
        ],
        "dicasProgressivas": {
          "html": [
            "Relembre: escolha a tag pelo papel do conteúdo, não pela aparência.",
            "Localize: confira main, sections, articles, aside e address e seus títulos.",
            "Compare: todo aria-labelledby precisa apontar para um id existente.",
            "Estrutura parcial: <section aria-labelledby=\"titulo-x\"><h2 id=\"titulo-x\">...</h2>...</section>.",
            "Exemplo semelhante: organize uma página de biblioteca usando header, nav, main, article e aside."
          ],
          "css": [
            "Relembre: o CSS apresenta a estrutura sem substituir a semântica.",
            "Localize: teste primeiro variáveis, foco e link de salto.",
            "Compare: confira seletor, propriedade, valor, unidade e fechamento.",
            "Estrutura parcial: @media (max-width: ...px) { seletor { propriedade: valor; } }.",
            "Exemplo semelhante: transforme uma navegação horizontal em blocos em outra largura."
          ],
          "js": [
            "Relembre: o estado visual e o estado acessível precisam ser iguais.",
            "Localize: confira botão, região oculta e callback do click.",
            "Compare: aria-expanded usa texto \"true\" ou \"false\", enquanto hidden é booleano.",
            "Estrutura parcial: const aberto = botao.getAttribute(...) === \"true\"; depois atualize os dois estados.",
            "Exemplo semelhante: crie um botão que revela uma seção de dúvidas com IDs diferentes."
          ]
        },
        "comportamento": {
          "titulo": "Teste comportamental da área de atendimento",
          "instrucao": "Execute o preview e use o botão de horários. A plataforma verifica a ação principal e se os detalhes realmente aparecem.",
          "criterios": [
            {
              "id": "acao-principal",
              "tipo": "event",
              "evento": "click",
              "seletor": "#mostrarAtendimento",
              "rotulo": "Acionar o botão de horários"
            },
            {
              "id": "conteudo-visivel",
              "tipo": "notHidden",
              "seletor": "#detalhesAtendimento",
              "rotulo": "Os detalhes de atendimento ficaram visíveis"
            }
          ]
        },
        "referenciaCompletaPadrao": false
      },
      {
        "numero": 3,
        "codigo": "FE03",
        "titulo": "FE03 - Formulário acessível de cadastro",
        "nomeCurto": "Formulário acessível de cadastro",
        "tema": "Formulários semânticos e acessibilidade",
        "objetivo": "Construir um formulário de cadastro compreensível pelo teclado, pelo navegador e por tecnologias assistivas.",
        "produto": "Formulário profissional de cadastro de cliente, com grupos de campos, rótulos associados, tipos adequados e confirmação acessível.",
        "contextoProfissional": "Cadastros são usados em atendimento, vendas, suporte e sistemas internos. Um formulário mal estruturado aumenta erros, abandono e barreiras de acesso.",
        "alteracaoObrigatoria": "Acrescente um campo opcional relacionado ao atendimento, com label associado, id, name e autocomplete quando existir um valor apropriado. Textos, opções e conteúdo adicional podem ser personalizados sem remover os requisitos de acessibilidade.",
        "retomadas": [
          "estrutura semântica do documento",
          "ligação entre HTML, CSS e JavaScript",
          "hierarquia de títulos"
        ],
        "novos": [
          "form",
          "label e for",
          "fieldset e legend",
          "input text, email, tel, radio e checkbox",
          "select e option",
          "textarea",
          "required",
          "name",
          "autocomplete",
          "aria-describedby",
          "role=status",
          "aria-live"
        ],
        "pasta": "exercicio-03",
        "repositorio": "atividades-frontend-sub",
        "classroomUrl": "https://classroom.google.com/",
        "githubUrl": "https://github.com/",
        "tempoMinimoSegundos": 300,
        "ordemArquivos": [
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
        "linguagens": {
          "html": "html",
          "css": "css",
          "js": "js"
        },
        "passos": {
          "html": [
            {
              "titulo": "Documento e orientação inicial",
              "linhas": [
                1,
                21
              ],
              "explicacao": "O documento define idioma, viewport, arquivos conectados, link de salto, título principal e aviso visual dos campos obrigatórios.",
              "detalhes": {
                "objetivo": "Preparar documento, link de salto e instruções de preenchimento.",
                "porque": "A pessoa precisa entender o formulário e chegar diretamente a ele por teclado.",
                "ordem": "O head configura a página; o body apresenta salto, cabeçalho e indicação dos campos obrigatórios.",
                "erroComum": "Usar apenas cor ou asterisco sem explicação textual para obrigatoriedade.",
                "conferir": "Use Tab e confirme que a orientação inicial e o formulário possuem ordem lógica."
              },
              "termos": [
                "form"
              ]
            },
            {
              "titulo": "Dados da pessoa responsável",
              "linhas": [
                23,
                48
              ],
              "explicacao": "O primeiro fieldset reúne dados pessoais. Cada controle possui label, id e name, enquanto type, autocomplete, required e aria-describedby melhoram preenchimento e acessibilidade.",
              "detalhes": {
                "objetivo": "Construir campos pessoais com agrupamento, rótulos e atributos adequados.",
                "porque": "fieldset e legend dão contexto; label, type e autocomplete ajudam preenchimento correto.",
                "ordem": "O fieldset abre o grupo, legend o nomeia e cada label aponta para o id de seu controle.",
                "erroComum": "for diferente do id, campo obrigatório sem required ou input sem name.",
                "conferir": "Clique em cada label e verifique se o campo correspondente recebe foco."
              },
              "termos": [
                "fieldset",
                "legend",
                "label",
                "required",
                "autocomplete",
                "ariaDescribedby"
              ]
            },
            {
              "titulo": "Necessidade e preferência de retorno",
              "linhas": [
                50,
                86
              ],
              "explicacao": "O segundo grupo utiliza select, radio, textarea e checkbox. O fieldset interno e sua legend nomeiam corretamente o conjunto de opções de retorno.",
              "detalhes": {
                "objetivo": "Combinar select, radios, textarea e checkbox sem perder semântica.",
                "porque": "Cada tipo de controle representa uma forma diferente de escolha ou entrada.",
                "ordem": "O select escolhe a necessidade; o grupo radio define uma opção; textarea recebe detalhes; checkbox registra consentimento.",
                "erroComum": "Radios com names diferentes ou opção inicial do select considerada válida indevidamente.",
                "conferir": "Escolha opções diferentes e confira se apenas um radio do grupo permanece marcado."
              },
              "termos": [
                "select",
                "radio",
                "textarea",
                "checkbox",
                "fieldset",
                "legend"
              ]
            },
            {
              "titulo": "Ações e mensagem de estado",
              "linhas": [
                88,
                95
              ],
              "explicacao": "Os botões possuem tipos explícitos. A área role=status com aria-live comunica a confirmação sem depender apenas de alterações visuais.",
              "detalhes": {
                "objetivo": "Definir envio, limpeza e feedback acessível.",
                "porque": "Tipos explícitos impedem ações acidentais e role=status anuncia a confirmação.",
                "ordem": "Os botões aparecem ao final do form e a região de status aguarda a mensagem do JavaScript.",
                "erroComum": "Botão sem type agir como submit ou status depender somente de cor.",
                "conferir": "Envie pelo botão e pela tecla Enter, depois use Limpar e observe o estado."
              },
              "termos": [
                "roleStatus",
                "submit",
                "reset"
              ]
            }
          ],
          "css": [
            {
              "titulo": "Base visual e link de salto",
              "linhas": [
                1,
                49
              ],
              "explicacao": "Variáveis, box-sizing, cores e o link de salto estabelecem uma base legível e previsível.",
              "detalhes": {
                "objetivo": "Estabelecer cores, Box Model e navegação inicial acessível.",
                "porque": "A base reduz inconsistências e torna o link de salto perceptível ao receber foco.",
                "ordem": "Variáveis e box-sizing vêm antes das regras do body e do link.",
                "erroComum": "Ocultar definitivamente o link ou usar contraste insuficiente.",
                "conferir": "Pressione Tab logo após carregar e confirme a aparição do link de salto."
              },
              "termos": [
                "focusVisible"
              ]
            },
            {
              "titulo": "Painéis e grupos do formulário",
              "linhas": [
                51,
                111
              ],
              "explicacao": "Cabeçalho, formulário, fieldset, legend e campos recebem espaçamento e contraste sem alterar sua ordem semântica.",
              "detalhes": {
                "objetivo": "Organizar visualmente formulário, fieldsets e legendas.",
                "porque": "Espaçamento e contraste ajudam a perceber grupos sem alterar a ordem semântica.",
                "ordem": "Cabeçalho e formulário criam os painéis; fieldset delimita grupos; legend os identifica.",
                "erroComum": "Remover borda e espaçamento de tal forma que os grupos fiquem indistinguíveis.",
                "conferir": "Observe se cada conjunto de campos continua claramente separado em telas grandes e pequenas."
              },
              "termos": [
                "fieldset",
                "legend"
              ]
            },
            {
              "titulo": "Controles e foco visível",
              "linhas": [
                113,
                156
              ],
              "explicacao": "Inputs, select, textarea e botões mantêm tamanho confortável. focus-visible destaca claramente o elemento ativo para navegação por teclado.",
              "detalhes": {
                "objetivo": "Garantir controles legíveis, tocáveis e navegáveis por teclado.",
                "porque": "Campos precisam acomodar texto, zoom e foco sem corte.",
                "ordem": "Uma regra comum prepara os controles e focus-visible destaca somente o elemento ativo.",
                "erroComum": "Altura fixa cortar conteúdo ou outline ser removido sem substituição.",
                "conferir": "Percorra todos os campos com Tab e confira foco e tamanho de toque."
              },
              "termos": [
                "focusVisible",
                "minHeight"
              ]
            },
            {
              "titulo": "Ações, status e telas pequenas",
              "linhas": [
                158,
                209
              ],
              "explicacao": "Botões e mensagem de status ganham estados claros. A media query preserva leitura e toque em telas estreitas.",
              "detalhes": {
                "objetivo": "Estilizar ações e feedback e reorganizar o formulário no celular.",
                "porque": "Botões e mensagens precisam permanecer claros em qualquer largura.",
                "ordem": "Estados de botão e status são definidos; a media query reduz espaços e empilha ações.",
                "erroComum": "Botões ultrapassarem a tela ou mensagem longa causar overflow.",
                "conferir": "Teste em 320 px com uma mensagem longa e confirme que tudo quebra linha."
              },
              "termos": [
                "roleStatus"
              ]
            }
          ],
          "js": [
            {
              "titulo": "Referências do formulário",
              "linhas": [
                1,
                2
              ],
              "explicacao": "querySelector localiza o formulário e a região que comunicará o resultado.",
              "detalhes": {
                "objetivo": "Localizar form e status antes de tratar eventos.",
                "porque": "As funções precisam manipular exatamente os elementos presentes no HTML.",
                "ordem": "O script carrega, querySelector encontra os elementos e as constantes ficam disponíveis aos eventos.",
                "erroComum": "Classe ou id divergente retornar null.",
                "conferir": "Compare seletores e HTML e confirme ausência de erro no console."
              },
              "termos": [
                "form",
                "roleStatus"
              ]
            },
            {
              "titulo": "Confirmação de envio",
              "linhas": [
                4,
                16
              ],
              "explicacao": "O evento submit impede recarregamento, lê os dados com FormData, cria uma mensagem com textContent, revela o status e move o foco para a confirmação.",
              "detalhes": {
                "objetivo": "Tratar o submit, ler dados e produzir feedback seguro.",
                "porque": "O evento submit inclui clique e Enter; FormData lê campos pelo name; textContent evita interpretar HTML.",
                "ordem": "O envio é interceptado, os dados são lidos, a mensagem é criada, o status é revelado e recebe foco.",
                "erroComum": "Campo sem name não aparecer ou usar innerHTML com dados digitados.",
                "conferir": "Envie dados diferentes e confirme que a mensagem usa o valor atual sem recarregar a página."
              },
              "termos": [
                "submit",
                "preventDefault",
                "formData",
                "textContent",
                "focus"
              ]
            },
            {
              "titulo": "Limpeza do estado",
              "linhas": [
                17,
                20
              ],
              "explicacao": "O evento reset volta a ocultar a mensagem e remove o texto anterior.",
              "detalhes": {
                "objetivo": "Sincronizar a limpeza dos campos com a mensagem de confirmação.",
                "porque": "Uma confirmação antiga não pode permanecer depois que os dados foram apagados.",
                "ordem": "O reset padrão limpa os controles e o callback oculta e esvazia a região de status.",
                "erroComum": "Limpar apenas os campos e deixar feedback desatualizado.",
                "conferir": "Envie, depois limpe e confirme que a mensagem também desaparece."
              },
              "termos": [
                "reset",
                "textContent"
              ]
            }
          ]
        },
        "classroom": {
          "titulo": "Exercício 03 - Formulário acessível de cadastro",
          "descricao": "Nesta atividade, vamos construir um formulário profissional de cadastro com rótulos associados, agrupamento por fieldset e legend, tipos de campo adequados, preenchimento automático, campos obrigatórios e uma confirmação acessível.\n\nAlteração obrigatória: acrescente um campo opcional relacionado ao atendimento, mantendo label, id e name corretamente associados.\n\nTeste o formulário com mouse e teclado, envie dados válidos, confira a mensagem de confirmação e use o botão de limpeza.\n\nEntrega: anexar o link do repositório do GitHub."
        },
        "permitirBase": {
          "html": false,
          "css": false,
          "js": false
        },
        "validacao": {
          "strictDeclarations": false,
          "aceitarEquivalencias": true,
          "htmlEstrutura": {
            "idsObrigatorios": [
              "conteudo",
              "cadastroCliente",
              "nome",
              "email",
              "telefone",
              "servico",
              "retornoEmail",
              "retornoTelefone",
              "mensagem",
              "termos",
              "statusCadastro"
            ],
            "tagsMinimas": {
              "main": 1,
              "form": 1,
              "fieldset": 1,
              "legend": 1,
              "label": 3,
              "input": 3,
              "select": 1,
              "option": 1,
              "textarea": 1,
              "button": 1,
              "h1": 1
            },
            "referenciasArquivos": {
              "css": "estilo.css",
              "js": "script.js"
            },
            "seletoresObrigatorios": [
              {
                "selector": "label[for=\"nome\"]",
                "message": "Associe um label ao campo nome."
              },
              {
                "selector": "label[for=\"email\"]",
                "message": "Associe um label ao campo e-mail."
              },
              {
                "selector": "button[type=\"submit\"]",
                "message": "Inclua um botão de envio com type=\"submit\"."
              }
            ],
            "rotulosAssociados": [
              "nome",
              "email",
              "telefone",
              "servico",
              "mensagem",
              "termos"
            ],
            "proibirTabindexPositivo": false,
            "atributosObrigatorios": [
              {
                "selector": "#nome",
                "attribute": "required"
              },
              {
                "selector": "#email",
                "attribute": "type",
                "value": "email"
              },
              {
                "selector": "#email",
                "attribute": "required"
              },
              {
                "selector": "#servico",
                "attribute": "required"
              },
              {
                "selector": "#termos",
                "attribute": "type",
                "value": "checkbox"
              },
              {
                "selector": "#termos",
                "attribute": "required"
              }
            ]
          },
          "jsComportamento": [
            {
              "event": "submit",
              "triggerId": "cadastroCliente",
              "acoes": [
                {
                  "type": "preventDefault"
                },
                {
                  "type": "formData"
                },
                {
                  "type": "dataGet"
                },
                {
                  "type": "text",
                  "targetId": "statusCadastro"
                },
                {
                  "type": "hidden",
                  "targetId": "statusCadastro"
                },
                {
                  "type": "focus",
                  "targetId": "statusCadastro"
                }
              ]
            },
            {
              "event": "reset",
              "triggerId": "cadastroCliente",
              "acoes": [
                {
                  "type": "hidden",
                  "targetId": "statusCadastro"
                },
                {
                  "type": "text",
                  "targetId": "statusCadastro"
                }
              ]
            }
          ],
          "politica": "conceitos_essenciais"
        },
        "glossario": [
          {
            "id": "form",
            "termo": "form",
            "categoria": "Elemento semântico",
            "traducao": "Formulário",
            "explicacao": "Agrupa controles que coletam e enviam dados.",
            "erroComum": "Campos fora do form podem não participar do envio.",
            "linguagem": "html",
            "exercicio": "FE03"
          },
          {
            "id": "fieldset",
            "termo": "fieldset",
            "categoria": "Elemento de formulário",
            "traducao": "Grupo de campos",
            "explicacao": "Agrupa controles relacionados de forma visual e semântica.",
            "erroComum": "Usar apenas div perde o agrupamento anunciado por leitores de tela.",
            "linguagem": "html",
            "exercicio": "FE03"
          },
          {
            "id": "legend",
            "termo": "legend",
            "categoria": "Elemento de formulário",
            "traducao": "Legenda do grupo",
            "explicacao": "Nomeia um fieldset e explica o tema daquele conjunto de campos.",
            "erroComum": "Colocar legend fora do fieldset quebra a relação semântica.",
            "linguagem": "html",
            "exercicio": "FE03"
          },
          {
            "id": "label",
            "termo": "label",
            "categoria": "Elemento de formulário",
            "traducao": "Rótulo",
            "explicacao": "Identifica claramente a informação esperada em um campo.",
            "erroComum": "O atributo for precisa corresponder ao id do controle.",
            "linguagem": "html",
            "exercicio": "FE03"
          },
          {
            "id": "required",
            "termo": "required",
            "categoria": "Atributo",
            "traducao": "Obrigatório",
            "explicacao": "Informa ao navegador que o campo precisa ser preenchido antes do envio.",
            "erroComum": "Apenas escrever um asterisco não cria validação funcional.",
            "linguagem": "html",
            "exercicio": "FE03"
          },
          {
            "id": "autocomplete",
            "termo": "autocomplete",
            "categoria": "Atributo",
            "traducao": "Preenchimento automático",
            "explicacao": "Informa o tipo de dado para que o navegador ajude a preencher o campo.",
            "erroComum": "Valor inadequado pode oferecer uma informação errada ao usuário.",
            "linguagem": "html",
            "exercicio": "FE03"
          },
          {
            "id": "ariaDescribedby",
            "termo": "aria-describedby",
            "categoria": "Atributo de acessibilidade",
            "traducao": "Descrito por",
            "explicacao": "Liga o campo a um texto complementar, como instrução ou formato esperado.",
            "erroComum": "O id referenciado precisa existir e ser único.",
            "linguagem": "html",
            "exercicio": "FE03"
          },
          {
            "id": "select",
            "termo": "select",
            "categoria": "Controle de formulário",
            "traducao": "Lista de seleção",
            "explicacao": "Permite escolher uma opção dentro de uma lista definida.",
            "erroComum": "Uma opção inicial sem valor deve continuar sendo tratada como não selecionada quando obrigatória.",
            "linguagem": "html",
            "exercicio": "FE03"
          },
          {
            "id": "radio",
            "termo": "radio",
            "categoria": "Tipo de input",
            "traducao": "Escolha única",
            "explicacao": "Permite escolher uma opção dentro de um grupo com o mesmo name.",
            "erroComum": "Names diferentes fazem os radios deixarem de formar um grupo.",
            "linguagem": "html",
            "exercicio": "FE03"
          },
          {
            "id": "textarea",
            "termo": "textarea",
            "categoria": "Controle de formulário",
            "traducao": "Texto multilinha",
            "explicacao": "Recebe textos maiores, como uma descrição.",
            "erroComum": "Inserir o valor inicial no atributo value não funciona como em input.",
            "linguagem": "html",
            "exercicio": "FE03"
          },
          {
            "id": "checkbox",
            "termo": "checkbox",
            "categoria": "Tipo de input",
            "traducao": "Marcação independente",
            "explicacao": "Representa uma escolha que pode estar marcada ou desmarcada.",
            "erroComum": "Tratar checkbox como texto sem verificar checked produz leitura incorreta.",
            "linguagem": "html/js",
            "exercicio": "FE03"
          },
          {
            "id": "roleStatus",
            "termo": "role=\"status\"",
            "categoria": "Função de acessibilidade",
            "traducao": "Região de status",
            "explicacao": "Faz mensagens atualizadas serem anunciadas sem deslocar o foco automaticamente.",
            "erroComum": "Usar apenas cor não comunica a confirmação para todos.",
            "linguagem": "html",
            "exercicio": "FE03"
          },
          {
            "id": "focusVisible",
            "termo": ":focus-visible",
            "categoria": "Pseudoclasse",
            "traducao": "Foco visível",
            "explicacao": "Destaca o controle ativo durante navegação por teclado.",
            "erroComum": "Remover outline sem substituto prejudica acessibilidade.",
            "linguagem": "css",
            "exercicio": "FE03"
          },
          {
            "id": "minHeight",
            "termo": "min-height",
            "categoria": "Propriedade CSS",
            "traducao": "Altura mínima",
            "explicacao": "Garante uma área mínima sem impedir que o conteúdo aumente a caixa.",
            "erroComum": "Usar height fixa pode cortar textos e mensagens.",
            "linguagem": "css",
            "exercicio": "FE03"
          },
          {
            "id": "submit",
            "termo": "submit",
            "categoria": "Evento",
            "traducao": "Envio",
            "explicacao": "É disparado quando o formulário é enviado pelo botão ou pela tecla Enter.",
            "erroComum": "Escutar apenas o clique do botão ignora outras formas válidas de envio.",
            "linguagem": "javascript",
            "exercicio": "FE03"
          },
          {
            "id": "preventDefault",
            "termo": "preventDefault",
            "categoria": "Método do evento",
            "traducao": "Impedir ação padrão",
            "explicacao": "Impede o recarregamento padrão para que a plataforma trate os dados na página.",
            "erroComum": "Usar sem explicar pode esconder que um formulário real normalmente envia dados.",
            "linguagem": "javascript",
            "exercicio": "FE03"
          },
          {
            "id": "formData",
            "termo": "FormData",
            "categoria": "Objeto da Web API",
            "traducao": "Dados do formulário",
            "explicacao": "Lê os campos associados ao formulário usando seus atributos name.",
            "erroComum": "Campo sem name não aparece nos dados coletados.",
            "linguagem": "javascript",
            "exercicio": "FE03"
          },
          {
            "id": "textContent",
            "termo": "textContent",
            "categoria": "Propriedade do DOM",
            "traducao": "Conteúdo textual",
            "explicacao": "Insere texto sem interpretar tags HTML.",
            "erroComum": "Usar innerHTML com conteúdo do usuário pode criar risco de injeção.",
            "linguagem": "javascript",
            "exercicio": "FE03"
          },
          {
            "id": "focus",
            "termo": "focus",
            "categoria": "Método",
            "traducao": "Mover foco",
            "explicacao": "Move o foco para um elemento, ajudando o usuário a encontrar a confirmação.",
            "erroComum": "Mover foco sem necessidade pode interromper a navegação.",
            "linguagem": "javascript",
            "exercicio": "FE03"
          },
          {
            "id": "reset",
            "termo": "reset",
            "categoria": "Evento",
            "traducao": "Limpeza do formulário",
            "explicacao": "É disparado quando os campos voltam aos valores iniciais.",
            "erroComum": "A mensagem de confirmação também precisa ser limpa para não ficar desatualizada.",
            "linguagem": "javascript",
            "exercicio": "FE03"
          }
        ],
        "dicasProgressivas": {
          "html": [
            "Relembre: cada campo precisa de rótulo e cada grupo precisa de contexto.",
            "Localize: confira for/id, name, type, required e autocomplete.",
            "Compare: radios do mesmo grupo compartilham o mesmo name.",
            "Estrutura parcial: <label for=\"campo\">...</label><input id=\"campo\" name=\"campo\" ...>.",
            "Exemplo semelhante: monte um formulário de inscrição com contato e preferência de turno."
          ],
          "css": [
            "Relembre: formulários precisam permanecer legíveis com teclado, zoom e celular.",
            "Localize: confira controles, foco e área das ações.",
            "Compare: use min-height quando o conteúdo puder crescer.",
            "Estrutura parcial: controle:focus-visible { outline: ...; outline-offset: ...; }.",
            "Exemplo semelhante: estilize outro formulário mantendo rótulos visíveis e contraste."
          ],
          "js": [
            "Relembre: trate o evento submit do formulário, não apenas o clique.",
            "Localize: confira preventDefault, FormData, status e reset.",
            "Compare: campos sem name não entram no FormData.",
            "Estrutura parcial: formulario.addEventListener(\"submit\", evento => { evento.preventDefault(); ... });.",
            "Exemplo semelhante: gere uma confirmação de reserva usando textContent."
          ]
        },
        "comportamento": {
          "titulo": "Teste comportamental do formulário",
          "instrucao": "Preencha os campos necessários e envie. A aprovação depende do envio produzir uma confirmação visível e preenchida, sem exigir uma frase específica.",
          "criterios": [
            {
              "id": "envio-realizado",
              "tipo": "event",
              "evento": "submit",
              "seletor": "#cadastroCliente",
              "rotulo": "Enviar o formulário preenchido"
            },
            {
              "id": "confirmacao-visivel",
              "tipo": "notHidden",
              "seletor": "#statusCadastro",
              "rotulo": "A confirmação de cadastro ficou visível"
            },
            {
              "id": "confirmacao-preenchida",
              "tipo": "textNonEmpty",
              "seletor": "#statusCadastro",
              "rotulo": "A confirmação apresenta os dados processados"
            }
          ]
        },
        "referenciaCompletaPadrao": false
      },
      {
        "numero": 4,
        "codigo": "FE04",
        "titulo": "FE04 - CSS: seletores, cascata, variáveis e Box Model",
        "nomeCurto": "CSS: seletores, cascata, variáveis e Box Model",
        "tema": "Fundamentos de estilização e controle do espaço",
        "objetivo": "Aplicar diferentes tipos de seletores, compreender a cascata, reutilizar valores com variáveis e controlar o Box Model de componentes.",
        "produto": "Vitrine profissional de planos com cartão recomendado e alternância entre temas claro e escuro.",
        "contextoProfissional": "Sistemas de design usam variáveis e regras reutilizáveis para manter consistência. Seletores e especificidade precisam ser planejados para evitar estilos difíceis de manter.",
        "alteracaoObrigatoria": "Crie uma variável visual adicional e use-a em pelo menos dois seletores. Personalize o cartão recomendado mantendo seletores de classe, id e atributo semanticamente equivalentes.",
        "retomadas": [
          "HTML semântico",
          "atributos id e class",
          "ligação entre HTML, CSS e JavaScript"
        ],
        "novos": [
          "seletores CSS",
          "cascata",
          "especificidade",
          "variáveis CSS",
          "var()",
          "Box Model",
          "box-sizing",
          "pseudoclasses"
        ],
        "pasta": "exercicio-04",
        "repositorio": "atividades-frontend-sub",
        "classroomUrl": "https://classroom.google.com/",
        "githubUrl": "https://github.com/",
        "tempoMinimoSegundos": 300,
        "ordemArquivos": [
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
        "linguagens": {
          "html": "html",
          "css": "css",
          "js": "js"
        },
        "passos": {
          "html": [
            {
              "titulo": "Conexão dos arquivos e cabeçalho",
              "linhas": [
                1,
                17
              ],
              "explicacao": "O documento conecta CSS e JavaScript, apresenta o produto e cria um botão acessível com aria-pressed e uma região de status.",
              "detalhes": {
                "objetivo": "Preparar a página e o controle de tema com estado acessível.",
                "porque": "CSS e JavaScript precisam estar conectados e o botão precisa comunicar sua alternância.",
                "ordem": "O head conecta os arquivos; o header apresenta o exercício; o botão e o status ficam prontos para o script.",
                "erroComum": "Caminho incorreto ou aria-pressed não acompanhar o tema.",
                "conferir": "Verifique Network/console e clique no botão observando texto, aparência e atributo."
              },
              "termos": [
                "ariaPressed"
              ]
            },
            {
              "titulo": "Cartões com diferentes identificadores",
              "linhas": [
                19,
                43
              ],
              "explicacao": "Os artigos reutilizam a classe cartao. O plano recomendado combina classe adicional, id e atributo data-status para demonstrar diferentes seletores.",
              "detalhes": {
                "objetivo": "Criar uma base HTML que permita comparar seletores de classe, ID e atributo.",
                "porque": "O mesmo componente pode receber regra geral e exceções com prioridades diferentes.",
                "ordem": "Todos recebem cartao; o recomendado recebe classe extra, id e data-status para demonstrar camadas.",
                "erroComum": "Repetir id ou escrever seletor que não corresponde ao atributo.",
                "conferir": "Inspecione cada artigo e liste quais seletores CSS conseguem selecioná-lo."
              },
              "termos": [
                "classSelector",
                "idSelector",
                "dataAttribute"
              ]
            },
            {
              "titulo": "Resumo e encerramento",
              "linhas": [
                45,
                55
              ],
              "explicacao": "O aside sintetiza os conceitos e o footer encerra a página sem alterar a estrutura principal.",
              "detalhes": {
                "objetivo": "Separar conteúdo complementar e identificação final.",
                "porque": "O aside resume conceitos sem interromper a lista principal de planos.",
                "ordem": "Depois dos cartões, o aside acrescenta orientação e o footer encerra o documento.",
                "erroComum": "Usar aside para informação obrigatória ou colocar elementos fora do body.",
                "conferir": "Leia a página sem CSS e confirme que a ordem continua compreensível."
              },
              "termos": [
                "boxModel"
              ]
            }
          ],
          "css": [
            {
              "titulo": "Variáveis, seletor universal e elemento",
              "linhas": [
                1,
                23
              ],
              "explicacao": "As propriedades personalizadas centralizam cores e medidas. O seletor universal aplica border-box e o seletor body define a base visual.",
              "detalhes": {
                "objetivo": "Compreender variáveis, seletor universal e regra de elemento.",
                "porque": "Esses níveis preparam valores reutilizáveis e uma base comum antes dos componentes.",
                "ordem": "Variáveis são declaradas em :root, * ajusta caixas e body define aparência global.",
                "erroComum": "Confundir a função universal com uma regra específica de componente.",
                "conferir": "Localize onde cada variável é consumida por var() e altere uma delas temporariamente."
              },
              "termos": [
                "root",
                "customProperty",
                "universal",
                "boxModel"
              ]
            },
            {
              "titulo": "Cascata e tema alternativo",
              "linhas": [
                25,
                73
              ],
              "explicacao": "A classe tema-claro redefine variáveis. Por causa da cascata, todos os componentes que usam var() atualizam sua aparência sem repetir regras.",
              "detalhes": {
                "objetivo": "Observar como a cascata troca valores sem duplicar todos os componentes.",
                "porque": "Redefinir variáveis em uma classe de estado permite temas mais fáceis de manter.",
                "ordem": "As variáveis padrão existem em :root; tema-claro redefine algumas quando a classe está no body.",
                "erroComum": "Aplicar a classe no elemento errado ou colocar valor fixo onde deveria haver var().",
                "conferir": "Ative a classe no DevTools e confirme quais propriedades mudam por herança das variáveis."
              },
              "termos": [
                "cascade",
                "var",
                "customProperty"
              ]
            },
            {
              "titulo": "Interação do botão e foco visível",
              "linhas": [
                75,
                99
              ],
              "explicacao": "O botão recebe estados de interação claros para mouse e teclado. O foco visível ajuda quem navega sem o mouse.",
              "detalhes": {
                "objetivo": "Identificar estados de interação e foco acessível no botão.",
                "porque": "Interfaces precisam indicar visualmente quando um controle está sob o mouse ou recebeu foco pelo teclado.",
                "ordem": "Primeiro é definido o botão; depois hover e focus-visible ajustam o retorno visual.",
                "erroComum": "Remover o outline sem fornecer outro indicador visível de foco.",
                "conferir": "Use Tab para chegar ao botão e confirme que o foco continua claramente perceptível."
              },
              "termos": [
                "focusVisible"
              ]
            },
            {
              "titulo": "Seletores e Box Model dos cartões",
              "linhas": [
                101,
                156
              ],
              "explicacao": "A classe geral define width, margin, padding e border. Classe composta, id e atributo acrescentam destaque em camadas de especificidade.",
              "detalhes": {
                "objetivo": "Comparar seletor de classe, classe composta, ID e atributo no Box Model.",
                "porque": "As regras mostram reutilização, exceções e especificidade em um mesmo componente.",
                "ordem": "A classe geral cria a caixa; seletores mais específicos acrescentam destaques ao plano recomendado.",
                "erroComum": "Usar seletor mais forte desnecessariamente ou confundir margin, padding e border.",
                "conferir": "No painel Computed, identifique de qual seletor veio cada valor do cartão recomendado."
              },
              "termos": [
                "classSelector",
                "idSelector",
                "attributeSelector",
                "specificity",
                "margin",
                "padding",
                "border"
              ]
            },
            {
              "titulo": "Adaptação para telas pequenas",
              "linhas": [
                158,
                176
              ],
              "explicacao": "O rodapé finaliza a página e a media query reduz espaçamentos e amplia o botão em telas estreitas.",
              "detalhes": {
                "objetivo": "Concluir a composição e adaptar a interface para celular.",
                "porque": "O mesmo conteúdo precisa permanecer legível e fácil de tocar em larguras menores.",
                "ordem": "Depois dos componentes principais, a media query sobrescreve apenas espaçamentos e largura do botão.",
                "erroComum": "Usar larguras fixas que causem rolagem horizontal ou deixar o botão pequeno demais para toque.",
                "conferir": "Teste o preview em 320 px e confirme que cartões e botão permanecem dentro da tela."
              },
              "termos": [
                "mediaQuery"
              ]
            }
          ],
          "js": [
            {
              "titulo": "Referências dos elementos",
              "linhas": [
                1,
                2
              ],
              "explicacao": "querySelector localiza o botão e a região de status.",
              "detalhes": {
                "objetivo": "Guardar botão e status em constantes para uso no evento.",
                "porque": "Referências claras evitam repetir seletores e facilitam conferir os elementos controlados.",
                "ordem": "querySelector executa ao carregar o script e retorna cada elemento.",
                "erroComum": "Selecionar o id errado ou executar antes do DOM sem defer.",
                "conferir": "Confirme o atributo defer e compare cada seletor com o HTML."
              },
              "termos": [
                "classListToggle",
                "ariaPressed"
              ]
            },
            {
              "titulo": "Alternância de estado",
              "linhas": [
                4,
                10
              ],
              "explicacao": "classList.toggle muda a classe do body; aria-pressed, texto do botão e mensagem são atualizados de forma segura.",
              "detalhes": {
                "objetivo": "Alternar classe visual e manter atributos, textos e mensagem sincronizados.",
                "porque": "A mudança precisa ser percebida visualmente e anunciada de forma acessível.",
                "ordem": "O clique chama toggle, recebe o booleano do novo estado e usa esse valor nas atualizações.",
                "erroComum": "Inverter os textos ou atualizar aria-pressed com valor diferente do estado real.",
                "conferir": "Clique repetidamente e observe classe do body, atributo, rótulo e mensagem."
              },
              "termos": [
                "classListToggle",
                "ariaPressed",
                "boolean"
              ]
            }
          ]
        },
        "classroom": {
          "titulo": "Exercício 04 - CSS: seletores, cascata, variáveis e Box Model",
          "descricao": "Nesta atividade, vamos construir uma vitrine de planos e praticar seletores de elemento, classe, id, atributo e pseudoclasse, além de cascata, especificidade, variáveis CSS e Box Model.\n\nAlteração obrigatória: crie uma variável visual adicional, use-a em pelo menos dois seletores e personalize o cartão recomendado sem remover os conceitos exigidos.\n\nTeste os dois temas, o foco do botão, o Box Model no DevTools e a página em tela pequena.\n\nEntrega: anexar o link do repositório do GitHub."
        },
        "permitirBase": {
          "html": false,
          "css": false,
          "js": false
        },
        "validacao": {
          "strictDeclarations": false,
          "aceitarEquivalencias": true,
          "htmlEstrutura": {
            "idsObrigatorios": [
              "alternarTema",
              "statusTema",
              "conteudo",
              "titulo-planos",
              "planoDestaque",
              "titulo-resumo"
            ],
            "tagsMinimas": {
              "header": 1,
              "main": 1,
              "section": 1,
              "article": 1,
              "aside": 1,
              "footer": 1,
              "button": 1,
              "h1": 1,
              "h2": 1,
              "h3": 1
            },
            "referenciasArquivos": {
              "css": "estilo.css",
              "js": "script.js"
            },
            "seletoresObrigatorios": [
              {
                "selector": "#alternarTema[aria-pressed]",
                "message": "Inclua o botão de tema com aria-pressed."
              }
            ],
            "atributosObrigatorios": [
              {
                "selector": "#alternarTema",
                "attribute": "type",
                "value": "button"
              }
            ]
          },
          "cssEstrutura": {
            "minimoVariaveis": 3,
            "minimoUsosVar": 3,
            "tiposSeletores": [
              "elemento",
              "classe",
              "id",
              "atributo",
              "pseudoclasse"
            ],
            "exigirBoxSizing": true,
            "exigirBoxModelCompleto": true,
            "proibir": [],
            "minimoTiposSeletores": 2
          },
          "jsComportamento": [
            {
              "event": "click",
              "triggerId": "alternarTema",
              "acoes": [
                {
                  "type": "bodyClassToggle"
                },
                {
                  "type": "setAttribute",
                  "targetId": "alternarTema",
                  "attribute": "aria-pressed"
                },
                {
                  "type": "text",
                  "targetId": "alternarTema"
                },
                {
                  "type": "text",
                  "targetId": "statusTema"
                }
              ]
            }
          ],
          "politica": "conceitos_essenciais"
        },
        "glossario": [
          {
            "id": "root",
            "termo": ":root",
            "categoria": "Pseudoclasse",
            "traducao": "Raiz do documento",
            "explicacao": "Seleciona o elemento raiz e é um local comum para declarar variáveis CSS globais.",
            "erroComum": "Declarar variável com nome diferente do usado em var() impede a aplicação.",
            "linguagem": "css",
            "exercicio": "FE04"
          },
          {
            "id": "customProperty",
            "termo": "propriedade personalizada",
            "categoria": "Recurso CSS",
            "traducao": "Variável CSS",
            "explicacao": "Guarda cores e medidas reutilizáveis iniciadas por dois hífens.",
            "erroComum": "Esquecer os dois hífens torna a declaração inválida.",
            "linguagem": "css",
            "exercicio": "FE04"
          },
          {
            "id": "var",
            "termo": "var()",
            "categoria": "Função CSS",
            "traducao": "Usar variável",
            "explicacao": "Recupera o valor de uma propriedade personalizada.",
            "erroComum": "Referenciar uma variável inexistente pode invalidar a propriedade.",
            "linguagem": "css",
            "exercicio": "FE04"
          },
          {
            "id": "universal",
            "termo": "*",
            "categoria": "Seletor universal",
            "traducao": "Todos os elementos",
            "explicacao": "Seleciona todos os elementos para aplicar uma preparação comum.",
            "erroComum": "Regras pesadas no seletor universal podem afetar a página inteira.",
            "linguagem": "css",
            "exercicio": "FE04"
          },
          {
            "id": "cascade",
            "termo": "cascata",
            "categoria": "Mecanismo CSS",
            "traducao": "Combinação de regras",
            "explicacao": "Decide qual declaração vence considerando origem, importância, especificidade e ordem.",
            "erroComum": "Achar que a última regra sempre vence ignora especificidade.",
            "linguagem": "css",
            "exercicio": "FE04"
          },
          {
            "id": "specificity",
            "termo": "especificidade",
            "categoria": "Regra de prioridade",
            "traducao": "Peso do seletor",
            "explicacao": "Compara o peso de seletores para decidir qual regra prevalece.",
            "erroComum": "Usar muitos IDs e !important dificulta manutenção.",
            "linguagem": "css",
            "exercicio": "FE04"
          },
          {
            "id": "classSelector",
            "termo": ".classe",
            "categoria": "Seletor de classe",
            "traducao": "Selecionar por classe",
            "explicacao": "Aplica a mesma regra a vários elementos com a classe indicada.",
            "erroComum": "Esquecer o ponto faz o navegador procurar uma tag.",
            "linguagem": "css",
            "exercicio": "FE04"
          },
          {
            "id": "idSelector",
            "termo": "#id",
            "categoria": "Seletor de ID",
            "traducao": "Selecionar identificador único",
            "explicacao": "Seleciona um elemento por seu id e possui alta especificidade.",
            "erroComum": "Reutilizar o mesmo id em vários elementos é inválido.",
            "linguagem": "css",
            "exercicio": "FE04"
          },
          {
            "id": "attributeSelector",
            "termo": "[atributo]",
            "categoria": "Seletor de atributo",
            "traducao": "Selecionar por atributo",
            "explicacao": "Seleciona elementos que possuem um atributo ou valor específico.",
            "erroComum": "Aspas ou valor divergente impedem a correspondência.",
            "linguagem": "css",
            "exercicio": "FE04"
          },
          {
            "id": "boxModel",
            "termo": "Box Model",
            "categoria": "Modelo de caixa",
            "traducao": "Conteúdo, preenchimento, borda e margem",
            "explicacao": "Explica como o navegador calcula o espaço ocupado por cada elemento.",
            "erroComum": "Confundir padding com margin altera o espaço interno e externo.",
            "linguagem": "css",
            "exercicio": "FE04"
          },
          {
            "id": "margin",
            "termo": "margin",
            "categoria": "Propriedade CSS",
            "traducao": "Margem externa",
            "explicacao": "Cria espaço fora da borda do elemento.",
            "erroComum": "Usar margin quando o objetivo é espaço interno produz layout diferente.",
            "linguagem": "css",
            "exercicio": "FE04"
          },
          {
            "id": "padding",
            "termo": "padding",
            "categoria": "Propriedade CSS",
            "traducao": "Preenchimento interno",
            "explicacao": "Cria espaço entre o conteúdo e a borda.",
            "erroComum": "Padding soma ao tamanho quando box-sizing não é border-box.",
            "linguagem": "css",
            "exercicio": "FE04"
          },
          {
            "id": "border",
            "termo": "border",
            "categoria": "Propriedade CSS",
            "traducao": "Borda",
            "explicacao": "Desenha o limite visual da caixa.",
            "erroComum": "Definir apenas cor sem estilo e espessura pode não mostrar borda.",
            "linguagem": "css",
            "exercicio": "FE04"
          },
          {
            "id": "hover",
            "termo": ":hover",
            "categoria": "Pseudoclasse",
            "traducao": "Ponteiro sobre o elemento",
            "explicacao": "Aplica estilo enquanto o ponteiro está sobre um elemento.",
            "erroComum": "Não deve ser a única forma de revelar informação importante.",
            "linguagem": "css",
            "exercicio": "FE04"
          },
          {
            "id": "focusVisible",
            "termo": ":focus-visible",
            "categoria": "Pseudoclasse",
            "traducao": "Foco por teclado",
            "explicacao": "Destaca a interação de teclado sem depender do mouse.",
            "erroComum": "Remover o foco deixa usuários sem saber onde estão.",
            "linguagem": "css",
            "exercicio": "FE04"
          },
          {
            "id": "classListToggle",
            "termo": "classList.toggle",
            "categoria": "Método do DOM",
            "traducao": "Alternar classe",
            "explicacao": "Adiciona uma classe quando ausente e remove quando presente.",
            "erroComum": "Alternar a classe no elemento errado não muda as variáveis esperadas.",
            "linguagem": "javascript",
            "exercicio": "FE04"
          },
          {
            "id": "ariaPressed",
            "termo": "aria-pressed",
            "categoria": "Atributo de acessibilidade",
            "traducao": "Estado de botão pressionado",
            "explicacao": "Comunica se um botão de alternância está ativo.",
            "erroComum": "O valor precisa acompanhar a classe visual aplicada.",
            "linguagem": "html/js",
            "exercicio": "FE04"
          },
          {
            "id": "dataAttribute",
            "termo": "data-*",
            "categoria": "Atributo personalizado",
            "traducao": "Dado do elemento",
            "explicacao": "Armazena informação específica da aplicação sem inventar atributos inválidos.",
            "erroComum": "O seletor CSS precisa usar exatamente o nome e valor declarados.",
            "linguagem": "html/css",
            "exercicio": "FE04"
          },
          {
            "id": "boolean",
            "termo": "booleano",
            "categoria": "Tipo lógico",
            "traducao": "Verdadeiro ou falso",
            "explicacao": "Representa o estado retornado por classList.toggle e orienta as mensagens do botão.",
            "erroComum": "Comparar booleano com as strings \"true\" ou \"false\" altera a lógica.",
            "linguagem": "javascript",
            "exercicio": "FE04"
          }
        ],
        "dicasProgressivas": {
          "html": [
            "Relembre: classes podem ser reutilizadas; IDs devem ser únicos; data-* guarda dados.",
            "Localize: compare os atributos dos cartões com os seletores CSS.",
            "Compare: o valor de aria-pressed precisa iniciar coerente com o tema.",
            "Estrutura parcial: <article class=\"cartao destaque\" id=\"...\" data-status=\"...\">.",
            "Exemplo semelhante: diferencie produtos comuns e recomendados com classes e atributos próprios."
          ],
          "css": [
            "Relembre: a cascata escolhe regras; o Box Model calcula o espaço.",
            "Localize: confira :root, var(), classe geral e seletores mais específicos.",
            "Compare: margin é externo, padding é interno e border fica entre ambos.",
            "Estrutura parcial: .componente { margin: ...; padding: ...; border: ...; }.",
            "Exemplo semelhante: crie tema alternativo redefinindo apenas variáveis em uma classe do body."
          ],
          "js": [
            "Relembre: classList.toggle retorna o novo estado como booleano.",
            "Localize: confira onde a classe é aplicada e quais textos dependem dela.",
            "Compare: aria-pressed recebe o mesmo estado usado na interface.",
            "Estrutura parcial: const ativo = elemento.classList.toggle(\"classe\"); depois use ativo nas mensagens.",
            "Exemplo semelhante: alterne um modo de alto contraste em outra página."
          ]
        },
        "comportamento": {
          "titulo": "Teste comportamental do tema",
          "instrucao": "Execute o preview e altere o tema. O requisito essencial é existir uma mudança visual real após o clique.",
          "criterios": [
            {
              "id": "acao-principal",
              "tipo": "event",
              "evento": "click",
              "seletor": "#alternarTema",
              "rotulo": "Acionar o botão de tema"
            },
            {
              "id": "classe-tema",
              "tipo": "visualChanged",
              "seletor": "body",
              "propriedades": [
                "color",
                "backgroundColor",
                "borderColor",
                "boxShadow",
                "fontWeight"
              ],
              "rotulo": "O tema produziu uma mudança visual real"
            }
          ]
        },
        "referenciaCompletaPadrao": false
      },
      {
        "numero": 5,
        "codigo": "FE05",
        "titulo": "FE05 - Layout profissional com Flexbox",
        "nomeCurto": "Layout profissional com Flexbox",
        "tema": "Distribuição, alinhamento e adaptação de componentes",
        "objetivo": "Construir um layout profissional com contêineres flexíveis, distribuição de espaço, alinhamento, quebra de linha e adaptação para telas pequenas.",
        "produto": "Painel profissional de serviços com cartões flexíveis, indicadores laterais e alternância de direção.",
        "contextoProfissional": "Interfaces administrativas e páginas de serviços precisam reorganizar componentes conforme o espaço disponível. Flexbox facilita alinhamento em um eixo, distribuição de espaço e adaptação de grupos de componentes.",
        "alteracaoObrigatoria": "Adicione um quarto cartão de serviço com conteúdo próprio e mantenha-o responsivo usando flex ou flex-basis. Personalize o espaçamento do layout sem usar Grid e sem alterar a ordem semântica do HTML.",
        "retomadas": [
          "HTML semântico",
          "seletores e classes",
          "variáveis CSS",
          "Box Model"
        ],
        "novos": [
          "display flex",
          "eixo principal e transversal",
          "flex-direction",
          "justify-content",
          "align-items",
          "flex-wrap",
          "gap",
          "flex-basis",
          "layout responsivo"
        ],
        "pasta": "exercicio-05",
        "repositorio": "atividades-frontend-sub",
        "classroomUrl": "https://classroom.google.com/",
        "githubUrl": "https://github.com/",
        "tempoMinimoSegundos": 300,
        "ordemArquivos": [
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
        "linguagens": {
          "html": "html",
          "css": "css",
          "js": "js"
        },
        "passos": {
          "html": [
            {
              "titulo": "Cabeçalho e controles",
              "linhas": [
                1,
                33
              ],
              "explicacao": "A página conecta os arquivos, oferece salto para o conteúdo e reúne título, botão de alternância e navegação. aria-pressed e aria-controls comunicam o estado do controle.",
              "detalhes": {
                "objetivo": "Preparar apresentação, navegação e botão que controla a demonstração de Flexbox.",
                "porque": "A estrutura semântica e os atributos acessíveis devem existir antes do layout visual.",
                "ordem": "O head conecta arquivos; header apresenta; botão aponta para a lista controlada; nav oferece navegação.",
                "erroComum": "aria-controls apontar para id inexistente ou aria-pressed ficar desatualizado.",
                "conferir": "Compare atributos do botão com o id da lista e teste o controle com teclado."
              },
              "termos": [
                "ariaControls",
                "ariaPressed"
              ]
            },
            {
              "titulo": "Área principal e cartões",
              "linhas": [
                35,
                104
              ],
              "explicacao": "main contém uma área de serviços e um aside de indicadores. A lista reúne artigos independentes que serão distribuídos pelo Flexbox.",
              "detalhes": {
                "objetivo": "Organizar conteúdo, aside e cartões que se tornarão itens flexíveis.",
                "porque": "Flexbox atua nos filhos diretos, portanto a hierarquia HTML define quais elementos serão distribuídos.",
                "ordem": "main contém layout-principal; a seção recebe lista-servicos; cada article vira item da lista; aside ocupa outra faixa.",
                "erroComum": "Esperar que netos sejam itens do contêiner principal ou colocar artigo fora da lista.",
                "conferir": "Desenhe a árvore pai-filho e marque quais elementos são filhos diretos de cada contêiner flexível."
              },
              "termos": [
                "flexContainer",
                "flexItem"
              ]
            },
            {
              "titulo": "Orientações e encerramento",
              "linhas": [
                106,
                122
              ],
              "explicacao": "A seção final resume as propriedades praticadas e o rodapé identifica a atividade.",
              "detalhes": {
                "objetivo": "Retomar as propriedades utilizadas e finalizar a página.",
                "porque": "A seção de orientação ajuda a relacionar o resultado visual ao conceito, sem substituir a prática.",
                "ordem": "Após o layout demonstrativo, a orientação resume propriedades e o footer identifica a atividade.",
                "erroComum": "Duplicar instruções ou usar lista sem relação com o conteúdo praticado.",
                "conferir": "Associe cada termo da orientação a uma regra existente no CSS."
              },
              "termos": [
                "justifyContent",
                "alignItems",
                "flexWrap",
                "gap"
              ]
            }
          ],
          "css": [
            {
              "titulo": "Base visual e contêiner do topo",
              "linhas": [
                1,
                121
              ],
              "explicacao": "Variáveis, Box Model e estilos básicos preparam o projeto. topo-conteudo usa Flexbox para distribuir apresentação e controle.",
              "detalhes": {
                "objetivo": "Preparar a aparência e ativar Flexbox no topo.",
                "porque": "O topo precisa distribuir texto e controle e continuar quebrando corretamente em telas menores.",
                "ordem": "Variáveis e base vêm primeiro; depois topo-conteudo recebe display:flex, alinhamentos e gap.",
                "erroComum": "Aplicar justify-content em elemento que não possui display:flex.",
                "conferir": "No DevTools, selecione topo-conteudo e identifique eixos principal e transversal."
              },
              "termos": [
                "displayFlex",
                "justifyContent",
                "alignItems",
                "gap"
              ]
            },
            {
              "titulo": "Navegação e layout principal",
              "linhas": [
                122,
                162
              ],
              "explicacao": "A navegação quebra itens quando necessário. layout-principal organiza conteúdo e painel lateral, usando flex para controlar crescimento e tamanho-base.",
              "detalhes": {
                "objetivo": "Usar wrap, crescimento e tamanho-base em dois contêineres.",
                "porque": "A navegação precisa quebrar e o conteúdo principal precisa dividir espaço com o aside.",
                "ordem": "A navegação ativa flex e wrap; layout-principal ativa flex; filhos definem grow e basis.",
                "erroComum": "Usar width fixa que impede flexibilidade ou esquecer min-width:0 em conteúdo longo.",
                "conferir": "Reduza a largura lentamente e observe quando links e colunas se reorganizam."
              },
              "termos": [
                "flexWrap",
                "flexGrow",
                "flexBasis"
              ]
            },
            {
              "titulo": "Cartões flexíveis",
              "linhas": [
                163,
                223
              ],
              "explicacao": "A lista usa flex-wrap e gap. Cada cartão também é flexível em coluna, e o rodapé interno usa margin-top: auto para permanecer na base.",
              "detalhes": {
                "objetivo": "Distribuir cartões em várias linhas e alinhar conteúdo interno.",
                "porque": "flex-wrap, gap e flex-basis permitem cartões adaptáveis; coluna e margin-top:auto alinham seus rodapés.",
                "ordem": "A lista vira contêiner; artigos definem tamanho e direção; a área final consome o espaço livre.",
                "erroComum": "Aplicar margin-top:auto sem pai flex em coluna ou impedir wrap.",
                "conferir": "Aumente um texto de cartão e verifique se o botão/rodapé continua na base sem corte."
              },
              "termos": [
                "flexContainer",
                "flexItem",
                "flexWrap",
                "gap",
                "flexDirection",
                "marginAuto"
              ]
            },
            {
              "titulo": "Indicadores e responsividade",
              "linhas": [
                248,
                326
              ],
              "explicacao": "Os indicadores usam direção vertical. As media queries mudam a direção dos principais contêineres e evitam rolagem horizontal em telas estreitas.",
              "detalhes": {
                "objetivo": "Alternar direção de indicadores e reorganizar os principais contêineres no mobile.",
                "porque": "Uma direção adequada no desktop pode não caber em tela estreita.",
                "ordem": "Indicadores recebem coluna; breakpoints mudam topo, layout e dimensões dos itens.",
                "erroComum": "Mudar flex-direction sem revisar alinhamentos e larguras dos filhos.",
                "conferir": "Teste em 1365, 620 e 320 px e identifique a direção de cada contêiner."
              },
              "termos": [
                "flexDirection",
                "flexBasis"
              ]
            }
          ],
          "js": [
            {
              "titulo": "Elementos controlados",
              "linhas": [
                1,
                3
              ],
              "explicacao": "querySelector localiza o botão, a lista de serviços e a região de status.",
              "detalhes": {
                "objetivo": "Localizar botão, lista e status usados na demonstração.",
                "porque": "O evento precisa alterar a região certa e comunicar o resultado.",
                "ordem": "O script guarda três referências antes de registrar o click.",
                "erroComum": "Classe da lista divergente ou ausência do status causar null.",
                "conferir": "Compare os três seletores com o HTML e verifique console limpo."
              },
              "termos": [
                "querySelector"
              ]
            },
            {
              "titulo": "Alternância de direção",
              "linhas": [
                5,
                15
              ],
              "explicacao": "O clique alterna uma classe, atualiza aria-pressed, o texto do botão e a mensagem acessível sem inserir HTML inseguro.",
              "detalhes": {
                "objetivo": "Alternar a classe que muda o eixo do Flexbox e sincronizar feedback.",
                "porque": "A atividade permite observar a diferença entre linha e coluna em tempo real.",
                "ordem": "O clique chama toggle, lê o booleano retornado e atualiza aria-pressed, rótulo e status.",
                "erroComum": "Aplicar a classe no botão em vez da lista ou usar texto oposto ao estado.",
                "conferir": "Clique, inspecione a classe da lista e compare a direção calculada no CSS."
              },
              "termos": [
                "classListToggle",
                "ariaPressed",
                "textContent"
              ]
            }
          ]
        },
        "classroom": {
          "titulo": "Exercício 05 - Layout profissional com Flexbox",
          "descricao": "Nesta atividade, vamos construir uma central profissional de serviços usando Flexbox para organizar cabeçalho, navegação, área principal, cartões, indicadores e ações internas.\n\nAlteração obrigatória: adicione um quarto cartão de serviço, use flex ou flex-basis para integrá-lo ao layout e personalize o espaçamento sem usar Grid.\n\nTeste a quebra dos cartões, a alternância entre linhas e coluna, o foco por teclado e a página em telas de 390 px, 760 px e desktop.\n\nEntrega: anexar o link do repositório do GitHub."
        },
        "permitirBase": {
          "html": false,
          "css": false,
          "js": false
        },
        "validacao": {
          "strictDeclarations": false,
          "aceitarEquivalencias": true,
          "htmlEstrutura": {
            "idsObrigatorios": [
              "alternarDirecao",
              "listaServicos",
              "statusLayout",
              "conteudo",
              "servicos",
              "indicadores",
              "orientacoes"
            ],
            "tagsMinimas": {
              "header": 1,
              "nav": 1,
              "main": 1,
              "section": 1,
              "article": 1,
              "aside": 1,
              "footer": 1,
              "button": 1,
              "h1": 1,
              "h2": 1,
              "h3": 1
            },
            "referenciasArquivos": {
              "css": "estilo.css",
              "js": "script.js"
            },
            "ancorasObrigatorias": [
              "#servicos"
            ],
            "seletoresObrigatorios": [
              {
                "selector": "#alternarDirecao[aria-pressed][aria-controls=\"listaServicos\"]",
                "message": "Inclua o botão de alternância com aria-pressed e aria-controls."
              },
              {
                "selector": "#listaServicos .cartao-servico",
                "message": "Mantenha a lista de serviços com cartões identificáveis."
              }
            ],
            "atributosObrigatorios": []
          },
          "cssFlexbox": {
            "minimoDisplaysFlex": 2,
            "exigirFlexWrap": false,
            "exigirFlexDirection": false,
            "exigirJustifyContent": false,
            "exigirAlignItems": false,
            "exigirGap": true,
            "exigirFlexItemSizing": false,
            "exigirMediaQuery": false,
            "proibir": []
          },
          "jsComportamento": [
            {
              "event": "click",
              "triggerId": "alternarDirecao",
              "acoes": [
                {
                  "type": "classToggle",
                  "targetId": "listaServicos"
                },
                {
                  "type": "setAttribute",
                  "targetId": "alternarDirecao",
                  "attribute": "aria-pressed"
                },
                {
                  "type": "text",
                  "targetId": "alternarDirecao"
                },
                {
                  "type": "text",
                  "targetId": "statusLayout"
                }
              ]
            }
          ],
          "politica": "conceitos_essenciais"
        },
        "glossario": [
          {
            "id": "flexContainer",
            "termo": "contêiner flexível",
            "categoria": "Papel no Flexbox",
            "traducao": "Elemento pai",
            "explicacao": "É o elemento que recebe display:flex e organiza seus filhos diretos.",
            "erroComum": "Aplicar propriedades de alinhamento no filho em vez do pai não produz o resultado esperado.",
            "linguagem": "css",
            "exercicio": "FE05"
          },
          {
            "id": "flexItem",
            "termo": "item flexível",
            "categoria": "Papel no Flexbox",
            "traducao": "Filho direto",
            "explicacao": "É cada filho direto organizado pelo contêiner Flexbox.",
            "erroComum": "Elementos internos mais profundos não viram itens do mesmo contêiner automaticamente.",
            "linguagem": "css",
            "exercicio": "FE05"
          },
          {
            "id": "displayFlex",
            "termo": "display: flex",
            "categoria": "Declaração CSS",
            "traducao": "Ativar Flexbox",
            "explicacao": "Transforma os filhos diretos em itens flexíveis.",
            "erroComum": "Escrever flex sem display ou no seletor errado não ativa o layout.",
            "linguagem": "css",
            "exercicio": "FE05"
          },
          {
            "id": "justifyContent",
            "termo": "justify-content",
            "categoria": "Propriedade Flexbox",
            "traducao": "Alinhamento no eixo principal",
            "explicacao": "Distribui os itens ao longo do eixo principal.",
            "erroComum": "O eixo principal muda quando flex-direction muda.",
            "linguagem": "css",
            "exercicio": "FE05"
          },
          {
            "id": "alignItems",
            "termo": "align-items",
            "categoria": "Propriedade Flexbox",
            "traducao": "Alinhamento no eixo transversal",
            "explicacao": "Alinha itens no eixo perpendicular ao principal.",
            "erroComum": "Confundir com justify-content gera alinhamento no eixo errado.",
            "linguagem": "css",
            "exercicio": "FE05"
          },
          {
            "id": "flexWrap",
            "termo": "flex-wrap",
            "categoria": "Propriedade Flexbox",
            "traducao": "Quebra de linha",
            "explicacao": "Permite que itens passem para novas linhas quando falta espaço.",
            "erroComum": "Sem wrap, os itens podem encolher demais ou causar overflow.",
            "linguagem": "css",
            "exercicio": "FE05"
          },
          {
            "id": "gap",
            "termo": "gap",
            "categoria": "Propriedade de layout",
            "traducao": "Espaço entre itens",
            "explicacao": "Cria espaçamento uniforme entre itens de Flexbox ou Grid.",
            "erroComum": "Usar margens diferentes em cada item pode duplicar espaço nas bordas.",
            "linguagem": "css",
            "exercicio": "FE05"
          },
          {
            "id": "flexGrow",
            "termo": "flex-grow",
            "categoria": "Propriedade do item",
            "traducao": "Capacidade de crescer",
            "explicacao": "Define quanto um item pode ocupar do espaço livre.",
            "erroComum": "Valor alto não define largura fixa; ele distribui espaço restante.",
            "linguagem": "css",
            "exercicio": "FE05"
          },
          {
            "id": "flexBasis",
            "termo": "flex-basis",
            "categoria": "Propriedade do item",
            "traducao": "Tamanho-base",
            "explicacao": "Define o tamanho inicial considerado antes de crescer ou encolher.",
            "erroComum": "Confundir com width sem considerar flex-grow e flex-shrink causa surpresa.",
            "linguagem": "css",
            "exercicio": "FE05"
          },
          {
            "id": "flexDirection",
            "termo": "flex-direction",
            "categoria": "Propriedade Flexbox",
            "traducao": "Direção dos itens",
            "explicacao": "Define se o eixo principal segue linha ou coluna.",
            "erroComum": "Ao mudar para column, justify-content passa a atuar verticalmente.",
            "linguagem": "css",
            "exercicio": "FE05"
          },
          {
            "id": "marginAuto",
            "termo": "margin-top: auto",
            "categoria": "Técnica Flexbox",
            "traducao": "Empurrar até o final",
            "explicacao": "Consome o espaço livre disponível e mantém um bloco na base de um cartão flexível.",
            "erroComum": "Só funciona como esperado quando o pai organiza os filhos com Flexbox.",
            "linguagem": "css",
            "exercicio": "FE05"
          },
          {
            "id": "ariaControls",
            "termo": "aria-controls",
            "categoria": "Atributo de acessibilidade",
            "traducao": "Controla a região",
            "explicacao": "Relaciona um botão ao id da região cujo estado ele altera.",
            "erroComum": "O valor precisa apontar para um id existente.",
            "linguagem": "html",
            "exercicio": "FE05"
          },
          {
            "id": "ariaPressed",
            "termo": "aria-pressed",
            "categoria": "Atributo de acessibilidade",
            "traducao": "Estado de alternância",
            "explicacao": "Indica se o modo controlado pelo botão está ativo.",
            "erroComum": "Deixar o atributo desatualizado cria divergência com a interface.",
            "linguagem": "html/js",
            "exercicio": "FE05"
          },
          {
            "id": "querySelector",
            "termo": "querySelector",
            "categoria": "Método do DOM",
            "traducao": "Selecionar elemento",
            "explicacao": "Localiza botão, lista e status por seletores CSS.",
            "erroComum": "Seletor divergente retorna null e interrompe a interação.",
            "linguagem": "javascript",
            "exercicio": "FE05"
          },
          {
            "id": "classListToggle",
            "termo": "classList.toggle",
            "categoria": "Método do DOM",
            "traducao": "Alternar classe",
            "explicacao": "Ativa ou remove a classe que muda a direção do layout.",
            "erroComum": "A classe precisa existir no CSS e ser aplicada à região correta.",
            "linguagem": "javascript",
            "exercicio": "FE05"
          },
          {
            "id": "textContent",
            "termo": "textContent",
            "categoria": "Propriedade do DOM",
            "traducao": "Alterar texto",
            "explicacao": "Atualiza mensagens e rótulos com texto seguro.",
            "erroComum": "Usar innerHTML sem necessidade aumenta riscos e não é necessário para texto.",
            "linguagem": "javascript",
            "exercicio": "FE05"
          }
        ],
        "dicasProgressivas": {
          "html": [
            "Relembre: Flexbox organiza somente os filhos diretos do contêiner.",
            "Localize: identifique cada pai flexível e seus itens.",
            "Compare: aria-controls deve apontar para a lista realmente modificada.",
            "Estrutura parcial: contêiner > itens diretos; conteúdos internos podem formar outro Flexbox.",
            "Exemplo semelhante: organize uma equipe em cartões e um painel lateral."
          ],
          "css": [
            "Relembre: justify-content atua no eixo principal e align-items no transversal.",
            "Localize: confira display:flex antes das propriedades Flexbox.",
            "Compare: flex-basis define base; flex-grow distribui espaço livre; wrap permite novas linhas.",
            "Estrutura parcial: .lista { display:flex; flex-wrap:wrap; gap:...; } .item { flex: 1 1 ...; }.",
            "Exemplo semelhante: crie uma barra de ferramentas que quebra em telas estreitas."
          ],
          "js": [
            "Relembre: o JavaScript deve alternar uma classe já prevista no CSS.",
            "Localize: confira botão, lista, status e callback.",
            "Compare: classe, aria-pressed, texto do botão e status precisam representar o mesmo estado.",
            "Estrutura parcial: const vertical = lista.classList.toggle(\"vertical\");.",
            "Exemplo semelhante: alterne a direção de uma galeria com outro nome de classe."
          ]
        },
        "comportamento": {
          "titulo": "Teste comportamental do Flexbox",
          "instrucao": "Execute o preview e altere a organização dos cartões. A validação observa se a ação realmente modifica o layout.",
          "criterios": [
            {
              "id": "acao-principal",
              "tipo": "event",
              "evento": "click",
              "seletor": "#alternarDirecao",
              "rotulo": "Acionar o botão de direção"
            },
            {
              "id": "classe-layout",
              "tipo": "visualChanged",
              "seletor": "#listaServicos",
              "propriedades": [
                "flexDirection",
                "flexWrap",
                "gap",
                "justifyContent",
                "alignItems",
                "alignContent",
                "flexBasis",
                "width",
                "order",
                "padding"
              ],
              "rotulo": "O layout dos cartões realmente mudou"
            }
          ]
        },
        "referenciaCompletaPadrao": false
      },
      {
        "numero": 6,
        "codigo": "FE06",
        "titulo": "FE06 - Grid, media queries e responsividade",
        "nomeCurto": "Grid, media queries e responsividade",
        "tema": "Layout bidimensional e adaptação por breakpoint",
        "objetivo": "Construir um dashboard com CSS Grid, regiões nomeadas, colunas flexíveis e reorganização para computador, tablet e celular.",
        "produto": "Dashboard operacional responsivo com indicadores, tarefas, agenda, equipe e alertas.",
        "contextoProfissional": "Dashboards administrativos precisam organizar várias regiões simultaneamente e manter a leitura em telas diferentes. CSS Grid permite controlar linhas e colunas, enquanto media queries definem mudanças de composição sem alterar a ordem semântica.",
        "alteracaoObrigatoria": "Adicione um quinto indicador com dados próprios e crie uma nova área de pendências no dashboard. Defina a posição dessa área em telas amplas e sua ordem em telas pequenas, mantendo responsividade e sem usar larguras fixas que causem rolagem horizontal.",
        "retomadas": [
          "HTML semântico",
          "variáveis CSS",
          "Box Model",
          "Flexbox e componentes adaptáveis"
        ],
        "novos": [
          "display grid",
          "grid-template-columns",
          "grid-template-areas",
          "grid-area",
          "repeat",
          "minmax",
          "auto-fit",
          "media queries",
          "breakpoints responsivos"
        ],
        "pasta": "exercicio-06",
        "repositorio": "atividades-frontend-sub",
        "classroomUrl": "https://classroom.google.com/",
        "githubUrl": "https://github.com/",
        "tempoMinimoSegundos": 300,
        "ordemArquivos": [
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
        "linguagens": {
          "html": "html",
          "css": "css",
          "js": "js"
        },
        "passos": {
          "html": [
            {
              "titulo": "Cabeçalho e controle de densidade",
              "linhas": [
                1,
                22
              ],
              "explicacao": "A página conecta os arquivos, oferece salto ao dashboard e inclui um botão acessível que controla o modo compacto.",
              "detalhes": {
                "objetivo": "Preparar o dashboard e um botão acessível para alternar densidade.",
                "porque": "O controle visual precisa estar relacionado ao painel que ele modifica e comunicar seu estado.",
                "ordem": "O head conecta arquivos; o link de salto antecede o header; o botão aponta para o dashboard.",
                "erroComum": "aria-controls divergente ou id duplicado no painel.",
                "conferir": "Use teclado, ative o botão e confira aria-pressed e região controlada."
              },
              "termos": [
                "ariaPressed"
              ]
            },
            {
              "titulo": "Resumo e indicadores",
              "linhas": [
                24,
                56
              ],
              "explicacao": "A primeira região contém o status do layout e uma grade de indicadores que usa auto-fit e minmax.",
              "detalhes": {
                "objetivo": "Criar uma região de resumo e uma coleção de indicadores adaptáveis.",
                "porque": "O HTML preserva a ordem de leitura enquanto o Grid decide a distribuição visual.",
                "ordem": "A região de resumo contém status e, em seguida, a grade reúne cada indicador como item.",
                "erroComum": "Usar a posição visual como única forma de indicar importância.",
                "conferir": "Leia o HTML na ordem do código e confirme que a sequência faz sentido sem CSS."
              },
              "termos": [
                "gridContainer",
                "gridItem"
              ]
            },
            {
              "titulo": "Regiões do dashboard",
              "linhas": [
                58,
                104
              ],
              "explicacao": "Tarefas, agenda, equipe e alertas são regiões semânticas independentes posicionadas por grid-template-areas.",
              "detalhes": {
                "objetivo": "Separar tarefas, agenda, equipe e alertas em regiões semânticas.",
                "porque": "Cada região poderá receber grid-area sem perder seu significado ou ordem de leitura.",
                "ordem": "As regiões aparecem em ordem lógica no HTML e recebem classes para o mapa visual.",
                "erroComum": "Nome da classe ou área divergir do declarado no CSS.",
                "conferir": "Crie uma tabela relacionando classe HTML, grid-area do item e nome no grid-template-areas."
              },
              "termos": [
                "semanticRegion",
                "gridArea"
              ]
            },
            {
              "titulo": "Rodapé",
              "linhas": [
                106,
                110
              ],
              "explicacao": "O rodapé identifica exercício, disciplina e turma.",
              "detalhes": {
                "objetivo": "Encerrar e identificar o exercício sem interferir no Grid principal.",
                "porque": "O rodapé pertence ao documento, não ao mapa interno do dashboard.",
                "ordem": "Depois do main e de todas as regiões, o footer finaliza o body.",
                "erroComum": "Inserir footer dentro do grid quando ele não faz parte do mapa planejado.",
                "conferir": "Confirme no DOM que o footer é irmão do main, não filho do dashboard."
              },
              "termos": [
                "semanticRegion"
              ]
            }
          ],
          "css": [
            {
              "titulo": "Base e cabeçalho em Grid",
              "linhas": [
                1,
                113
              ],
              "explicacao": "Variáveis, Box Model e um cabeçalho bidimensional preparam a composição.",
              "detalhes": {
                "objetivo": "Preparar variáveis, Box Model e primeiro Grid bidimensional.",
                "porque": "O cabeçalho demonstra alinhamento em linhas e colunas antes do dashboard maior.",
                "ordem": "A base visual é declarada e o cabeçalho ativa grid com colunas e alinhamentos.",
                "erroComum": "Usar propriedades de item no contêiner ou deixar conteúdo longo sem min-width:0.",
                "conferir": "Ative o overlay de Grid no DevTools e observe linhas e colunas do cabeçalho."
              },
              "termos": [
                "gridContainer",
                "gridItem",
                "gridTemplateColumns",
                "gap"
              ]
            },
            {
              "titulo": "Mapa principal do dashboard",
              "linhas": [
                114,
                144
              ],
              "explicacao": "grid-template-columns e grid-template-areas definem o mapa de regiões em telas amplas.",
              "detalhes": {
                "objetivo": "Definir colunas e áreas nomeadas para telas amplas.",
                "porque": "grid-template-areas torna a composição legível e relaciona nomes a regiões.",
                "ordem": "O contêiner define colunas, gap e mapa; cada item associa seu grid-area.",
                "erroComum": "Linhas do mapa com quantidade diferente de células ou área não retangular.",
                "conferir": "Leia o mapa como uma tabela e localize cada nome no layout renderizado."
              },
              "termos": [
                "gridTemplateColumns",
                "gridTemplateAreas",
                "gridArea"
              ]
            },
            {
              "titulo": "Grades internas",
              "linhas": [
                145,
                281
              ],
              "explicacao": "repeat, auto-fit e minmax tornam indicadores e componentes internos adaptáveis.",
              "detalhes": {
                "objetivo": "Usar repeat, auto-fit e minmax em coleções internas.",
                "porque": "As colunas se ajustam automaticamente conforme espaço e quantidade de conteúdo.",
                "ordem": "Cada subgrade ativa display:grid e define faixas repetidas e limites de tamanho.",
                "erroComum": "Mínimo maior que a viewport ou repeat aplicado no seletor errado.",
                "conferir": "Redimensione a página e conte quantas colunas cabem sem corte."
              },
              "termos": [
                "repeat",
                "autoFit",
                "minmax",
                "gap"
              ]
            },
            {
              "titulo": "Breakpoints responsivos",
              "linhas": [
                295,
                333
              ],
              "explicacao": "As media queries redefinem colunas e áreas para tablet e celular, sem mudar a ordem do HTML.",
              "detalhes": {
                "objetivo": "Reorganizar colunas e áreas para tablet e celular.",
                "porque": "O mesmo mapa amplo não cabe em telas estreitas, mas a ordem semântica pode ser preservada.",
                "ordem": "Breakpoints posteriores redefinem template-columns e template-areas conforme a largura.",
                "erroComum": "Mudar colunas sem atualizar áreas ou deixar nome ausente no novo mapa.",
                "conferir": "Compare os mapas de desktop, tablet e celular e confira todas as regiões."
              },
              "termos": [
                "mediaQuery",
                "gridTemplateAreas",
                "gridTemplateColumns"
              ]
            }
          ],
          "js": [
            {
              "titulo": "Elementos controlados",
              "linhas": [
                1,
                3
              ],
              "explicacao": "querySelector localiza botão, dashboard e região de status.",
              "detalhes": {
                "objetivo": "Localizar botão, dashboard e status da densidade.",
                "porque": "O script precisa de referências válidas para sincronizar estado e mensagem.",
                "ordem": "querySelector guarda os três elementos antes do evento.",
                "erroComum": "Selecionar um elemento interno em vez do contêiner que possui a classe compacta.",
                "conferir": "Confira seletores e execute no console document.querySelector para cada um."
              },
              "termos": [
                "querySelector"
              ]
            },
            {
              "titulo": "Modo compacto",
              "linhas": [
                5,
                15
              ],
              "explicacao": "O clique alterna uma classe, atualiza aria-pressed, texto do botão e feedback acessível.",
              "detalhes": {
                "objetivo": "Alternar classe, estado acessível e textos usando um booleano real.",
                "porque": "A densidade muda visualmente, mas o botão também precisa informar se o modo está ativo.",
                "ordem": "O click alterna a classe; toggle retorna true/false; esse valor atualiza atributo, rótulo e mensagem.",
                "erroComum": "Comparar booleano com string ou atualizar textos antes de obter o novo estado.",
                "conferir": "Clique duas vezes e acompanhe classe, booleano retornado, aria-pressed e mensagem."
              },
              "termos": [
                "classListToggle",
                "ariaPressed",
                "boolean"
              ]
            }
          ]
        },
        "classroom": {
          "titulo": "Exercício 06 - Grid, media queries e responsividade",
          "descricao": "Nesta atividade, vamos construir um dashboard operacional com CSS Grid, regiões nomeadas, colunas flexíveis e breakpoints para computador, tablet e celular.\n\nAlteração obrigatória: adicione um quinto indicador e uma nova área de pendências, definindo sua posição em telas amplas e sua ordem em telas pequenas.\n\nTeste o layout em aproximadamente 1180 px, 900 px, 620 px e 390 px, use o modo compacto e confirme que não existe rolagem horizontal.\n\nEntrega: anexar o link do repositório do GitHub."
        },
        "permitirBase": {
          "html": false,
          "css": false,
          "js": false
        },
        "validacao": {
          "strictDeclarations": false,
          "aceitarEquivalencias": true,
          "htmlEstrutura": {
            "idsObrigatorios": [
              "alternarDensidade",
              "dashboard",
              "statusLayout",
              "resumo",
              "tarefas",
              "agenda",
              "equipe",
              "alertas"
            ],
            "tagsMinimas": {
              "header": 1,
              "main": 1,
              "section": 1,
              "article": 1,
              "aside": 1,
              "footer": 1,
              "button": 1,
              "h1": 1,
              "h2": 1
            },
            "referenciasArquivos": {
              "css": "estilo.css",
              "js": "script.js"
            },
            "seletoresObrigatorios": [
              {
                "selector": "#alternarDensidade[aria-pressed][aria-controls=\"dashboard\"]",
                "message": "Inclua o botão com aria-pressed e aria-controls."
              },
              {
                "selector": "#resumo .indicador",
                "message": "Mantenha a grade de indicadores identificável."
              }
            ],
            "atributosObrigatorios": []
          },
          "cssGridResponsivo": {
            "minimoDisplaysGrid": 2,
            "exigirTemplateColumns": true,
            "exigirTemplateAreas": false,
            "minimoGridAreas": 0,
            "exigirGap": true,
            "exigirMinmax": false,
            "exigirRepeat": false,
            "exigirAutoFitOuFill": false,
            "minimoMediaQueries": 1,
            "proibir": []
          },
          "jsComportamento": [
            {
              "event": "click",
              "triggerId": "alternarDensidade",
              "acoes": [
                {
                  "type": "classToggle",
                  "targetId": "dashboard"
                },
                {
                  "type": "setAttribute",
                  "targetId": "alternarDensidade",
                  "attribute": "aria-pressed"
                },
                {
                  "type": "text",
                  "targetId": "alternarDensidade"
                },
                {
                  "type": "text",
                  "targetId": "statusLayout"
                }
              ]
            }
          ],
          "politica": "conceitos_essenciais"
        },
        "glossario": [
          {
            "id": "gridContainer",
            "termo": "contêiner Grid",
            "categoria": "Papel no CSS Grid",
            "traducao": "Elemento pai bidimensional",
            "explicacao": "Recebe display:grid e organiza itens em linhas e colunas.",
            "erroComum": "Propriedades grid no elemento errado não afetam os filhos esperados.",
            "linguagem": "css",
            "exercicio": "FE06"
          },
          {
            "id": "gridItem",
            "termo": "item de Grid",
            "categoria": "Papel no CSS Grid",
            "traducao": "Filho direto",
            "explicacao": "É posicionado nas linhas, colunas ou áreas definidas pelo contêiner.",
            "erroComum": "Um neto não participa diretamente do Grid do avô.",
            "linguagem": "css",
            "exercicio": "FE06"
          },
          {
            "id": "gridTemplateColumns",
            "termo": "grid-template-columns",
            "categoria": "Propriedade Grid",
            "traducao": "Modelo de colunas",
            "explicacao": "Define quantidade e tamanho das colunas.",
            "erroComum": "Colunas fixas largas podem causar overflow em telas pequenas.",
            "linguagem": "css",
            "exercicio": "FE06"
          },
          {
            "id": "gridTemplateAreas",
            "termo": "grid-template-areas",
            "categoria": "Propriedade Grid",
            "traducao": "Mapa de áreas",
            "explicacao": "Desenha um mapa textual para posicionar regiões nomeadas.",
            "erroComum": "Cada linha precisa ter o mesmo número de células e áreas retangulares.",
            "linguagem": "css",
            "exercicio": "FE06"
          },
          {
            "id": "gridArea",
            "termo": "grid-area",
            "categoria": "Propriedade do item",
            "traducao": "Nome da área",
            "explicacao": "Liga um item a uma área declarada no mapa do contêiner.",
            "erroComum": "Nome divergente faz o item usar posicionamento automático.",
            "linguagem": "css",
            "exercicio": "FE06"
          },
          {
            "id": "repeat",
            "termo": "repeat()",
            "categoria": "Função CSS",
            "traducao": "Repetir faixas",
            "explicacao": "Evita repetir manualmente a mesma definição de coluna ou linha.",
            "erroComum": "Quantidade ou faixa inválida torna a declaração inutilizável.",
            "linguagem": "css",
            "exercicio": "FE06"
          },
          {
            "id": "autoFit",
            "termo": "auto-fit",
            "categoria": "Palavra-chave Grid",
            "traducao": "Ajuste automático",
            "explicacao": "Cria a quantidade de colunas que couber na largura disponível.",
            "erroComum": "Sem minmax, os itens podem ficar pequenos demais ou não se adaptar bem.",
            "linguagem": "css",
            "exercicio": "FE06"
          },
          {
            "id": "minmax",
            "termo": "minmax()",
            "categoria": "Função CSS",
            "traducao": "Limite mínimo e máximo",
            "explicacao": "Define uma faixa que pode crescer sem ficar menor que o mínimo.",
            "erroComum": "Mínimo maior que a tela pode continuar causando overflow.",
            "linguagem": "css",
            "exercicio": "FE06"
          },
          {
            "id": "gap",
            "termo": "gap",
            "categoria": "Propriedade de layout",
            "traducao": "Espaço entre células",
            "explicacao": "Cria distância uniforme entre linhas e colunas.",
            "erroComum": "Somar margens desnecessárias pode aumentar demais os espaços.",
            "linguagem": "css",
            "exercicio": "FE06"
          },
          {
            "id": "mediaQuery",
            "termo": "@media",
            "categoria": "Regra condicional CSS",
            "traducao": "Consulta de tela",
            "explicacao": "Troca o mapa e as colunas conforme a largura disponível.",
            "erroComum": "Apenas declarar breakpoint sem reorganizar as áreas não resolve o layout.",
            "linguagem": "css",
            "exercicio": "FE06"
          },
          {
            "id": "semanticRegion",
            "termo": "section/aside",
            "categoria": "Elementos semânticos",
            "traducao": "Regiões de conteúdo",
            "explicacao": "Mantêm significado no HTML enquanto o CSS muda apenas a posição visual.",
            "erroComum": "Alterar a ordem visual sem considerar a ordem de leitura pode confundir teclado e leitor de tela.",
            "linguagem": "html",
            "exercicio": "FE06"
          },
          {
            "id": "ariaPressed",
            "termo": "aria-pressed",
            "categoria": "Atributo de acessibilidade",
            "traducao": "Estado do modo compacto",
            "explicacao": "Comunica se o botão de densidade está ativo.",
            "erroComum": "O atributo precisa acompanhar a classe compacta.",
            "linguagem": "html/js",
            "exercicio": "FE06"
          },
          {
            "id": "querySelector",
            "termo": "querySelector",
            "categoria": "Método do DOM",
            "traducao": "Selecionar elemento",
            "explicacao": "Localiza botão, dashboard e região de status.",
            "erroComum": "Se um id ou classe divergir, o método retorna null.",
            "linguagem": "javascript",
            "exercicio": "FE06"
          },
          {
            "id": "classListToggle",
            "termo": "classList.toggle",
            "categoria": "Método do DOM",
            "traducao": "Alternar classe",
            "explicacao": "Liga ou desliga o modo compacto no dashboard.",
            "erroComum": "A classe precisa ter regras correspondentes no CSS.",
            "linguagem": "javascript",
            "exercicio": "FE06"
          },
          {
            "id": "boolean",
            "termo": "booleano",
            "categoria": "Tipo lógico",
            "traducao": "Verdadeiro ou falso",
            "explicacao": "Representa o estado retornado por classList.toggle e orienta os textos do controle.",
            "erroComum": "Comparar com as strings \"true\" e \"false\" é diferente de usar booleanos reais.",
            "linguagem": "javascript",
            "exercicio": "FE06"
          }
        ],
        "dicasProgressivas": {
          "html": [
            "Relembre: a ordem do HTML deve fazer sentido mesmo quando o Grid muda posições.",
            "Localize: associe cada região semântica à classe usada no CSS.",
            "Compare: o botão de densidade deve controlar o id correto.",
            "Estrutura parcial: <section class=\"regiao tarefas\" ...>...</section>.",
            "Exemplo semelhante: estruture um painel escolar com resumo, agenda, avisos e equipe."
          ],
          "css": [
            "Relembre: Grid trabalha com linhas e colunas; áreas nomeadas desenham um mapa.",
            "Localize: confira contêiner, grid-area de cada item e todos os mapas responsivos.",
            "Compare: cada linha do grid-template-areas precisa ter a mesma quantidade de células.",
            "Estrutura parcial: grid-template-columns: ...; grid-template-areas: \"a b\" \"c b\";.",
            "Exemplo semelhante: use repeat(auto-fit, minmax(...)) em uma grade de indicadores diferente."
          ],
          "js": [
            "Relembre: toggle devolve um booleano com o novo estado.",
            "Localize: confira botão, dashboard e status.",
            "Compare: o CSS deve possuir regras para a classe compacta aplicada.",
            "Estrutura parcial: const compacto = dashboard.classList.toggle(\"compacto\");.",
            "Exemplo semelhante: alterne um modo espaçoso em um painel com outra classe."
          ]
        },
        "comportamento": {
          "titulo": "Teste comportamental do Grid",
          "instrucao": "Execute o preview e altere a densidade do dashboard. A validação exige apenas uma mudança real de layout após a ação.",
          "criterios": [
            {
              "id": "acao-principal",
              "tipo": "event",
              "evento": "click",
              "seletor": "#alternarDensidade",
              "rotulo": "Acionar o botão de densidade"
            },
            {
              "id": "classe-layout",
              "tipo": "visualChanged",
              "seletor": "#dashboard",
              "propriedades": [
                "gap",
                "padding",
                "gridTemplateColumns",
                "gridTemplateRows",
                "gridTemplateAreas",
                "gridAutoColumns",
                "gridAutoRows",
                "width"
              ],
              "rotulo": "O dashboard realmente mudou de densidade"
            }
          ]
        },
        "referenciaCompletaPadrao": false
      },
      {
        "numero": 7,
        "codigo": "FE07",
        "titulo": "FE07 - Do algoritmo ao código: Python e JavaScript",
        "nomeCurto": "Do algoritmo ao código: Python e JavaScript",
        "tema": "Entrada, processamento e saída em diferentes linguagens",
        "objetivo": "Representar um algoritmo sequencial em pseudocódigo e executá-lo com resultados equivalentes no navegador e no terminal Python.",
        "produto": "Calculadora de orçamento rápido com uma versão Web em JavaScript e uma versão de terminal em Python.",
        "contextoProfissional": "Equipes transformam regras de negócio em algoritmos antes de escolher a interface ou a linguagem. O mesmo cálculo pode atender uma página Web, um script interno ou futuramente uma API.",
        "alteracaoObrigatoria": "Altere a taxa operacional de 10% para 12% nas três representações: algoritmo.txt, script.js e main.py. Depois personalize o nome do serviço exibido na interface sem remover a estrutura Entrada -> Processamento -> Saída.",
        "retomadas": [
          "HTML semântico e formulários",
          "CSS responsivo",
          "seleção de elementos e evento de envio"
        ],
        "novos": [
          "algoritmo",
          "pseudocódigo",
          "entrada",
          "processamento",
          "saída",
          "input() em Python",
          "Number() em JavaScript",
          "print() e textContent",
          "comparação entre linguagens"
        ],
        "pasta": "exercicio-07",
        "repositorio": "atividades-frontend-sub",
        "classroomUrl": "https://classroom.google.com/",
        "githubUrl": "https://github.com/",
        "tempoMinimoSegundos": 300,
        "ordemArquivos": [
          "pseudocodigo",
          "html",
          "css",
          "js",
          "python",
          "readme"
        ],
        "arquivos": {
          "pseudocodigo": "// Desenvolva aqui a atividade solicitada.\n",
          "html": "<!doctype html>\n<html lang=\"pt-BR\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Atividade</title>\n</head>\n<body>\n  <main>\n    <!-- Desenvolva aqui a estrutura solicitada. -->\n  </main>\n</body>\n</html>\n",
          "css": "/* Desenvolva aqui os estilos solicitados. */\n",
          "js": "'use strict';\n// Desenvolva aqui o comportamento solicitado.\n",
          "python": "# Desenvolva aqui a solução solicitada.\n",
          "readme": "# FE07 - Do algoritmo ao código: Python e JavaScript\n\n## Objetivo\n\nRepresentar e executar o mesmo algoritmo sequencial em pseudocódigo, JavaScript e Python, identificando claramente entrada, processamento e saída.\n\n## Arquivos\n\n- `algoritmo.txt`: descrição do algoritmo em pseudocódigo;\n- `index.html`: interface de entrada e saída no navegador;\n- `estilo.css`: apresentação responsiva;\n- `script.js`: execução do algoritmo no navegador;\n- `main.py`: execução equivalente no terminal Python.\n\n\n## Entrada, Processamento e Saída\n\n- **Entrada:** nome do cliente, horas previstas e valor por hora.\n- **Processamento:** cálculo do subtotal, da taxa operacional e do total.\n- **Saída:** apresentação dos resultados no navegador e no terminal.\n\n## Executar a versão Web\n\nAbra `index.html` no navegador ou utilize uma extensão de servidor local no VS Code.\n\n## Executar a versão Python\n\nNo terminal aberto dentro da pasta `exercicio-07`, execute:\n\n```bash\npython main.py\n```\n\nUse os mesmos dados nas duas versões e compare os resultados.\n"
        },
        "nomesArquivos": {
          "pseudocodigo": "algoritmo.txt",
          "html": "index.html",
          "css": "estilo.css",
          "js": "script.js",
          "python": "main.py",
          "readme": "README.md"
        },
        "linguagens": {
          "pseudocodigo": "text",
          "html": "html",
          "css": "css",
          "js": "js",
          "python": "python",
          "readme": "markdown"
        },
        "passos": {
          "pseudocodigo": [
            {
              "titulo": "Início e entradas",
              "linhas": [
                1,
                5
              ],
              "explicacao": "O pseudocódigo começa, solicita três dados e usa nomes que revelam o significado de cada informação.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de pseudocodigo dentro do exercício.",
                "porque": "Este trecho existe para manter a sequência entre estrutura, comportamento, teste e entrega.",
                "ordem": "Leia de cima para baixo e acompanhe como cada linha prepara a próxima ação.",
                "erroComum": "Compare nomes, fechamento, pontuação e posição das instruções antes de validar.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "entrada"
              ]
            },
            {
              "titulo": "Processamento sequencial",
              "linhas": [
                6,
                8
              ],
              "explicacao": "As três atribuições representam as regras do orçamento. Cada resultado é usado pela instrução seguinte.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de pseudocodigo dentro do exercício.",
                "porque": "Este trecho existe para manter a sequência entre estrutura, comportamento, teste e entrega.",
                "ordem": "Leia de cima para baixo e acompanhe como cada linha prepara a próxima ação.",
                "erroComum": "Compare nomes, fechamento, pontuação e posição das instruções antes de validar.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "processamento"
              ]
            },
            {
              "titulo": "Saídas e encerramento",
              "linhas": [
                10,
                14
              ],
              "explicacao": "A parte final apresenta os valores produzidos e encerra o algoritmo.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de pseudocodigo dentro do exercício.",
                "porque": "Este trecho existe para manter a sequência entre estrutura, comportamento, teste e entrega.",
                "ordem": "Leia de cima para baixo e acompanhe como cada linha prepara a próxima ação.",
                "erroComum": "Compare nomes, fechamento, pontuação e posição das instruções antes de validar.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "saida"
              ]
            }
          ],
          "html": [
            {
              "titulo": "Documento e apresentação",
              "linhas": [
                1,
                18
              ],
              "explicacao": "O documento conecta CSS e JavaScript e apresenta a proposta de comparar linguagens.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de html dentro do exercício.",
                "porque": "O HTML define a estrutura que o CSS estiliza e o JavaScript localiza.",
                "ordem": "O navegador lê a declaração, o head e depois constrói os elementos do body.",
                "erroComum": "Tag não fechada, id divergente ou caminho de arquivo incorreto.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "doctype",
                "lang"
              ]
            },
            {
              "titulo": "Entradas do algoritmo",
              "linhas": [
                20,
                41
              ],
              "explicacao": "O formulário oferece campos associados a labels e utiliza tipos numéricos coerentes.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de html dentro do exercício.",
                "porque": "O HTML define a estrutura que o CSS estiliza e o JavaScript localiza.",
                "ordem": "O navegador lê a declaração, o head e depois constrói os elementos do body.",
                "erroComum": "Tag não fechada, id divergente ou caminho de arquivo incorreto.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "id"
              ]
            },
            {
              "titulo": "Processamento e saída",
              "linhas": [
                44,
                74
              ],
              "explicacao": "A página explica as regras e reserva uma região de status para o resultado calculado.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de html dentro do exercício.",
                "porque": "O HTML define a estrutura que o CSS estiliza e o JavaScript localiza.",
                "ordem": "O navegador lê a declaração, o head e depois constrói os elementos do body.",
                "erroComum": "Tag não fechada, id divergente ou caminho de arquivo incorreto.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "ariaLive"
              ]
            }
          ],
          "css": [
            {
              "titulo": "Variáveis e base visual",
              "linhas": [
                1,
                81
              ],
              "explicacao": "Variáveis, Box Model e estilos globais criam uma base consistente.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de css dentro do exercício.",
                "porque": "O CSS transforma a estrutura HTML em uma interface legível e responsiva.",
                "ordem": "A cascata combina regras gerais, componentes e ajustes de tela pequena.",
                "erroComum": "Seletor sem correspondência, propriedade inválida ou largura fixa causando overflow.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "root",
                "boxSizing"
              ]
            },
            {
              "titulo": "Layout e componentes",
              "linhas": [
                82,
                178
              ],
              "explicacao": "Grid organiza os painéis; formulário e resultado recebem estilos próprios.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de css dentro do exercício.",
                "porque": "O CSS transforma a estrutura HTML em uma interface legível e responsiva.",
                "ordem": "A cascata combina regras gerais, componentes e ajustes de tela pequena.",
                "erroComum": "Seletor sem correspondência, propriedade inválida ou largura fixa causando overflow.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "grid"
              ]
            },
            {
              "titulo": "Responsividade",
              "linhas": [
                180,
                203
              ],
              "explicacao": "Os breakpoints transformam o layout em uma coluna e ajustam espaços para celular.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de css dentro do exercício.",
                "porque": "O CSS transforma a estrutura HTML em uma interface legível e responsiva.",
                "ordem": "A cascata combina regras gerais, componentes e ajustes de tela pequena.",
                "erroComum": "Seletor sem correspondência, propriedade inválida ou largura fixa causando overflow.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "media"
              ]
            }
          ],
          "js": [
            {
              "titulo": "Referências da interface",
              "linhas": [
                1,
                6
              ],
              "explicacao": "querySelector guarda referências para o formulário, os campos e a região de saída.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de js dentro do exercício.",
                "porque": "Este bloco conecta uma ação do usuário ao comportamento visível da página.",
                "ordem": "Primeiro os elementos são localizados; depois o evento é registrado; por último o callback altera a interface.",
                "erroComum": "Executar a alteração fora do evento ou usar um seletor que não encontra o elemento.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "querySelector"
              ]
            },
            {
              "titulo": "Entrada",
              "linhas": [
                7,
                14
              ],
              "explicacao": "O envio é interceptado e os valores são lidos. Number converte textos numéricos em números.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de js dentro do exercício.",
                "porque": "Este bloco conecta uma ação do usuário ao comportamento visível da página.",
                "ordem": "Primeiro os elementos são localizados; depois o evento é registrado; por último o callback altera a interface.",
                "erroComum": "Executar a alteração fora do evento ou usar um seletor que não encontra o elemento.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "value",
                "Number",
                "preventDefault"
              ]
            },
            {
              "titulo": "Processamento",
              "linhas": [
                15,
                19
              ],
              "explicacao": "As regras do pseudocódigo aparecem na mesma ordem e produzem subtotal, taxa e total.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de js dentro do exercício.",
                "porque": "Este bloco conecta uma ação do usuário ao comportamento visível da página.",
                "ordem": "Primeiro os elementos são localizados; depois o evento é registrado; por último o callback altera a interface.",
                "erroComum": "Executar a alteração fora do evento ou usar um seletor que não encontra o elemento.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "Number"
              ]
            },
            {
              "titulo": "Saída segura",
              "linhas": [
                20,
                29
              ],
              "explicacao": "textContent apresenta o resultado sem interpretar conteúdo do usuário como HTML.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de js dentro do exercício.",
                "porque": "Este bloco conecta uma ação do usuário ao comportamento visível da página.",
                "ordem": "Primeiro os elementos são localizados; depois o evento é registrado; por último o callback altera a interface.",
                "erroComum": "Executar a alteração fora do evento ou usar um seletor que não encontra o elemento.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "textContent"
              ]
            }
          ],
          "python": [
            {
              "titulo": "Cabeçalho e entrada",
              "linhas": [
                1,
                8
              ],
              "explicacao": "input recebe textos do terminal; float converte horas e valor para números decimais.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de python dentro do exercício.",
                "porque": "Este bloco representa a mesma sequência de entrada, processamento e saída em Python.",
                "ordem": "O interpretador executa as linhas em ordem: pergunta, conversão, cálculo e impressão.",
                "erroComum": "Esquecer conversão, usar vírgula decimal ou digitar uma variável com nome diferente.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "input",
                "strip",
                "float"
              ]
            },
            {
              "titulo": "Processamento equivalente",
              "linhas": [
                9,
                13
              ],
              "explicacao": "As mesmas três regras usadas no JavaScript são escritas com a sintaxe do Python.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de python dentro do exercício.",
                "porque": "Este bloco representa a mesma sequência de entrada, processamento e saída em Python.",
                "ordem": "O interpretador executa as linhas em ordem: pergunta, conversão, cálculo e impressão.",
                "erroComum": "Esquecer conversão, usar vírgula decimal ou digitar uma variável com nome diferente.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "float"
              ]
            },
            {
              "titulo": "Saída formatada",
              "linhas": [
                14,
                19
              ],
              "explicacao": "print e f-strings mostram os resultados com duas casas decimais.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de python dentro do exercício.",
                "porque": "Este bloco representa a mesma sequência de entrada, processamento e saída em Python.",
                "ordem": "O interpretador executa as linhas em ordem: pergunta, conversão, cálculo e impressão.",
                "erroComum": "Esquecer conversão, usar vírgula decimal ou digitar uma variável com nome diferente.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "print",
                "fstring"
              ]
            }
          ],
          "readme": [
            {
              "titulo": "Objetivo, arquivos e etapas",
              "linhas": [
                1,
                24
              ],
              "explicacao": "A documentação explica o objetivo, a função de cada arquivo e identifica entrada, processamento e saída.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de readme dentro do exercício.",
                "porque": "Este trecho existe para manter a sequência entre estrutura, comportamento, teste e entrega.",
                "ordem": "Leia de cima para baixo e acompanhe como cada linha prepara a próxima ação.",
                "erroComum": "Compare nomes, fechamento, pontuação e posição das instruções antes de validar.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "heading",
                "code"
              ]
            },
            {
              "titulo": "Como executar",
              "linhas": [
                25,
                34
              ],
              "explicacao": "As duas formas de execução são registradas para que outra pessoa consiga reproduzir os testes.",
              "detalhes": {
                "objetivo": "Compreender a função deste bloco de readme dentro do exercício.",
                "porque": "Este trecho existe para manter a sequência entre estrutura, comportamento, teste e entrega.",
                "ordem": "Leia de cima para baixo e acompanhe como cada linha prepara a próxima ação.",
                "erroComum": "Compare nomes, fechamento, pontuação e posição das instruções antes de validar.",
                "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
              },
              "termos": [
                "code"
              ]
            }
          ]
        },
        "classroom": {
          "titulo": "Exercício 07 - Do algoritmo ao código: Python e JavaScript",
          "descricao": "Nesta atividade, vamos representar um orçamento em pseudocódigo e executar a mesma sequência em JavaScript e Python.\n\nAlteração obrigatória: troque a taxa operacional de 10% para 12% nas três representações e personalize o nome do serviço.\n\nTeste os mesmos valores no navegador e no terminal Python e confirme resultados equivalentes.\n\nEntrega: anexar o link do repositório do GitHub."
        },
        "permitirBase": {
          "pseudocodigo": false,
          "html": false,
          "css": false,
          "js": false,
          "python": false,
          "readme": false
        },
        "validacao": {
          "strictDeclarations": false,
          "aceitarEquivalencias": true,
          "algoritmoSequencialPseudocodigo": {
            "minimoEntradas": 2,
            "minimoSaidas": 2,
            "exigirInicioFim": false,
            "exigirTaxa": true,
            "minimoAtribuicoes": 2
          },
          "htmlEstrutura": {
            "idsObrigatorios": [
              "simulador",
              "formularioOrcamento",
              "nomeCliente",
              "horasPrevistas",
              "valorHora",
              "resultadoOrcamento"
            ],
            "tagsMinimas": {
              "header": 1,
              "main": 1,
              "section": 1,
              "aside": 1,
              "footer": 1,
              "form": 1,
              "input": 3,
              "label": 3,
              "button": 1,
              "h1": 1,
              "h2": 1,
              "ol": 1
            },
            "referenciasArquivos": {
              "css": "estilo.css",
              "js": "script.js"
            },
            "rotulosAssociados": [
              "nomeCliente",
              "horasPrevistas",
              "valorHora"
            ],
            "seletoresObrigatorios": [
              {
                "selector": "#formularioOrcamento button[type=\"submit\"]",
                "message": "Inclua um botão de envio dentro do formulário."
              },
              {
                "selector": "#resultadoOrcamento[role=\"status\"]",
                "message": "Mantenha uma região de status para a saída."
              }
            ],
            "atributosObrigatorios": [
              {
                "selector": "#nomeCliente",
                "attribute": "required"
              },
              {
                "selector": "#horasPrevistas",
                "attribute": "type",
                "value": "number"
              },
              {
                "selector": "#valorHora",
                "attribute": "type",
                "value": "number"
              }
            ],
            "proibirTabindexPositivo": false
          },
          "cssEstrutura": {
            "minimoVariaveis": 3,
            "minimoUsosVar": 3,
            "tiposSeletores": [
              "elemento",
              "classe",
              "pseudoclasse"
            ],
            "exigirBoxSizing": true,
            "exigirBoxModelCompleto": false,
            "proibir": [],
            "minimoTiposSeletores": 2
          },
          "algoritmoSequencialJS": {
            "minimoLeiturasValue": 2,
            "minimoConversoesNumericas": 1,
            "exigirSubmit": true,
            "exigirPreventDefault": true,
            "exigirTaxa": true,
            "exigirSaidaSegura": true,
            "proibir": [
              "innerHTML",
              "eval(",
              "for(",
              "while(",
              " if(",
              "switch("
            ]
          },
          "algoritmoSequencialPython": {
            "minimoInputs": 2,
            "minimoConversoesNumericas": 1,
            "minimoPrints": 2,
            "exigirTaxa": true,
            "proibir": [
              "eval(",
              "exec(",
              " if ",
              "for ",
              "while ",
              "def ",
              "class "
            ]
          },
          "markdownEstrutura": {
            "codigoExercicio": "FE07",
            "minimoCaracteres": 60,
            "titulosObrigatorios": [],
            "arquivosObrigatorios": [
              "index.html",
              "script.js",
              "main.py"
            ],
            "conteudosObrigatorios": [
              "python main.py"
            ]
          },
          "politica": "conceitos_essenciais"
        },
        "glossario": [
          {
            "id": "doctype",
            "termo": "doctype",
            "categoria": "Declaração",
            "traducao": "Documento HTML",
            "explicacao": "Informa ao navegador que o arquivo utiliza HTML moderno.",
            "erroComum": "Esquecer ou alterar pode ativar modos antigos do navegador.",
            "linguagem": "html",
            "exercicio": "FE07"
          },
          {
            "id": "lang",
            "termo": "lang",
            "categoria": "Atributo",
            "traducao": "Idioma",
            "explicacao": "Indica que o conteúdo principal está em português do Brasil.",
            "erroComum": "Usar um idioma incorreto prejudica leitores de tela.",
            "linguagem": "html",
            "exercicio": "FE07"
          },
          {
            "id": "id",
            "termo": "id",
            "categoria": "Atributo",
            "traducao": "Identificador",
            "explicacao": "Cria um nome único para localizar um elemento no CSS ou JavaScript.",
            "erroComum": "Repetir o mesmo id ou escrever nomes diferentes quebra seletores.",
            "linguagem": "html",
            "exercicio": "FE07"
          },
          {
            "id": "ariaLive",
            "termo": "aria-live",
            "categoria": "Atributo de acessibilidade",
            "traducao": "Região viva",
            "explicacao": "Faz leitores de tela anunciarem mudanças no conteúdo.",
            "erroComum": "Remover pode ocultar mensagens dinâmicas para usuários de leitor de tela.",
            "linguagem": "html",
            "exercicio": "FE07"
          },
          {
            "id": "root",
            "termo": "root",
            "categoria": "Seletor",
            "traducao": "Raiz do documento",
            "explicacao": "Centraliza variáveis CSS reutilizáveis.",
            "erroComum": "Declarar variável e não usar var() reduz a utilidade.",
            "linguagem": "css",
            "exercicio": "FE07"
          },
          {
            "id": "boxSizing",
            "termo": "box-sizing",
            "categoria": "Propriedade",
            "traducao": "Modelo de caixa",
            "explicacao": "Inclui padding e borda no tamanho final do elemento.",
            "erroComum": "Sem ela, largura e altura podem crescer além do esperado.",
            "linguagem": "css",
            "exercicio": "FE07"
          },
          {
            "id": "grid",
            "termo": "grid",
            "categoria": "Valor de display",
            "traducao": "Grade",
            "explicacao": "Organiza elementos em linhas e colunas.",
            "erroComum": "Definir grid sem colunas pode não produzir o layout esperado.",
            "linguagem": "css",
            "exercicio": "FE07"
          },
          {
            "id": "media",
            "termo": "media",
            "categoria": "Regra condicional",
            "traducao": "Consulta de mídia",
            "explicacao": "Aplica regras quando a tela atende a uma condição.",
            "erroComum": "Usar largura fixa ou condição incorreta causa overflow.",
            "linguagem": "css",
            "exercicio": "FE07"
          },
          {
            "id": "querySelector",
            "termo": "querySelector",
            "categoria": "Método",
            "traducao": "Selecionar elemento",
            "explicacao": "Localiza o primeiro elemento que corresponde a um seletor CSS.",
            "erroComum": "Se o seletor estiver errado, o resultado será null.",
            "linguagem": "js",
            "exercicio": "FE07"
          },
          {
            "id": "value",
            "termo": "value",
            "categoria": "Propriedade",
            "traducao": "Valor do campo",
            "explicacao": "Lê o texto ou número informado em um input.",
            "erroComum": "Esquecer a conversão mantém números como texto.",
            "linguagem": "js",
            "exercicio": "FE07"
          },
          {
            "id": "Number",
            "termo": "Number",
            "categoria": "Função",
            "traducao": "Número",
            "explicacao": "Converte um valor para número no JavaScript.",
            "erroComum": "Texto inválido produz NaN.",
            "linguagem": "js",
            "exercicio": "FE07"
          },
          {
            "id": "preventDefault",
            "termo": "preventDefault",
            "categoria": "Método",
            "traducao": "Impedir comportamento padrão",
            "explicacao": "Evita o recarregamento automático de um formulário.",
            "erroComum": "Sem ele, a página pode recarregar e apagar o resultado.",
            "linguagem": "js",
            "exercicio": "FE07"
          },
          {
            "id": "textContent",
            "termo": "textContent",
            "categoria": "Propriedade",
            "traducao": "Conteúdo textual",
            "explicacao": "Lê ou altera texto sem interpretar HTML.",
            "erroComum": "Usar innerHTML sem necessidade aumenta risco e pode alterar a estrutura.",
            "linguagem": "js",
            "exercicio": "FE07"
          },
          {
            "id": "input",
            "termo": "input",
            "categoria": "Função nativa",
            "traducao": "Entrada",
            "explicacao": "Mostra uma pergunta, pausa o programa e devolve o que foi digitado como str.",
            "erroComum": "Tentar calcular sem converter o texto gera erro ou resultado incorreto.",
            "linguagem": "python",
            "exercicio": "FE07"
          },
          {
            "id": "strip",
            "termo": "strip",
            "categoria": "Método de string",
            "traducao": "Remover espaços externos",
            "explicacao": "Remove espaços antes e depois do texto digitado.",
            "erroComum": "Não altera espaços internos do nome.",
            "linguagem": "python",
            "exercicio": "FE07"
          },
          {
            "id": "float",
            "termo": "float",
            "categoria": "Tipo e função de conversão",
            "traducao": "Número decimal",
            "explicacao": "Converte texto numérico para valor decimal.",
            "erroComum": "Vírgula decimal ou texto inválido gera ValueError.",
            "linguagem": "python",
            "exercicio": "FE07"
          },
          {
            "id": "print",
            "termo": "print",
            "categoria": "Função nativa",
            "traducao": "Saída",
            "explicacao": "Exibe informações no terminal.",
            "erroComum": "Esquecer parênteses ou aspas causa SyntaxError.",
            "linguagem": "python",
            "exercicio": "FE07"
          },
          {
            "id": "fstring",
            "termo": "f-string",
            "categoria": "Literal formatado",
            "traducao": "Texto interpolado",
            "explicacao": "Insere valores de variáveis dentro de uma string iniciada por f.",
            "erroComum": "Esquecer o f mostra as chaves como texto comum.",
            "linguagem": "python",
            "exercicio": "FE07"
          },
          {
            "id": "heading",
            "termo": "heading",
            "categoria": "Sintaxe Markdown",
            "traducao": "Título",
            "explicacao": "Organiza a documentação em seções com #.",
            "erroComum": "Usar títulos sem conteúdo deixa o README incompleto.",
            "linguagem": "markdown",
            "exercicio": "FE07"
          },
          {
            "id": "code",
            "termo": "code",
            "categoria": "Sintaxe Markdown",
            "traducao": "Código em linha",
            "explicacao": "Destaca nomes de arquivos e comandos com crases.",
            "erroComum": "Aspas comuns não produzem o mesmo destaque.",
            "linguagem": "markdown",
            "exercicio": "FE07"
          },
          {
            "id": "entrada",
            "termo": "entrada",
            "categoria": "Etapa de algoritmo",
            "traducao": "Dados recebidos",
            "explicacao": "Representa as informações fornecidas antes do processamento.",
            "erroComum": "Usar a entrada diretamente em cálculo sem converter o tipo quando necessário.",
            "linguagem": "pseudocodigo",
            "exercicio": "FE07"
          },
          {
            "id": "processamento",
            "termo": "processamento",
            "categoria": "Etapa de algoritmo",
            "traducao": "Transformação dos dados",
            "explicacao": "Reúne cálculos e regras que transformam as entradas em resultados.",
            "erroComum": "Misturar saída ou mensagens dentro do cálculo dificulta compreender a sequência.",
            "linguagem": "pseudocodigo",
            "exercicio": "FE07"
          },
          {
            "id": "saida",
            "termo": "saída",
            "categoria": "Etapa de algoritmo",
            "traducao": "Resultado apresentado",
            "explicacao": "Mostra ao usuário os valores produzidos pelo processamento.",
            "erroComum": "Exibir uma variável antes de ela receber o resultado correto.",
            "linguagem": "pseudocodigo",
            "exercicio": "FE07"
          }
        ],
        "dicasProgressivas": {
          "html": [
            "Relembre: o HTML organiza o conteúdo e conecta os outros arquivos.",
            "Localize: confira primeiro o head, depois os IDs usados pelo JavaScript.",
            "Compare: os nomes escritos em id devem ser exatamente iguais aos seletores.",
            "Estrutura parcial: mantenha abertura e fechamento das tags na ordem correta.",
            "Exemplo semelhante: crie outro botão e outra área de mensagem com nomes diferentes."
          ],
          "css": [
            "Relembre: seletores escolhem elementos e propriedades definem a apresentação.",
            "Localize: confira a regra que deveria afetar o elemento observado.",
            "Compare: verifique ponto da classe, dois-pontos, ponto e vírgula e unidade.",
            "Estrutura parcial: seletor { propriedade: valor; }.",
            "Exemplo semelhante: teste uma cor ou espaçamento diferente permitido."
          ],
          "js": [
            "Relembre: primeiro localize o elemento; depois registre a ação.",
            "Localize: confira o seletor e o callback do evento.",
            "Compare: a alteração precisa estar dentro da função executada pelo evento.",
            "Estrutura parcial: elemento.addEventListener('click', () => { /* ação */ });",
            "Exemplo semelhante: altere o texto de outro elemento com outro botão."
          ],
          "python": [
            "Relembre: input() sempre devolve texto.",
            "Localize: confira as linhas de entrada e conversão.",
            "Compare: o cálculo deve usar valores numéricos, não strings.",
            "Estrutura parcial: valor = float(input('Pergunta: ')).",
            "Exemplo semelhante: calcule quantidade x preço com outros nomes."
          ]
        },
        "comportamento": {
          "titulo": "Teste comportamental do orçamento",
          "instrucao": "Execute o preview e envie o formulário. O resultado precisa mudar depois do cálculo; a redação da saída pode ser personalizada.",
          "criterios": [
            {
              "id": "enviar-orcamento",
              "tipo": "event",
              "evento": "submit",
              "seletor": "#formularioOrcamento",
              "rotulo": "Enviar o formulário de orçamento"
            },
            {
              "id": "resultado-alterado",
              "tipo": "textChangedFrom",
              "seletor": "#resultadoOrcamento",
              "valor": "Preencha os dados e selecione o botão Calcular orçamento.",
              "rotulo": "A saída mudou após o cálculo"
            }
          ]
        },
        "referenciaCompletaPadrao": false
      }
    ]
  }
};

window.EXERCICIOS = [
  {
    "numero": 1,
    "studentReferenceStripped": true,
    "codigo": "FE01",
    "titulo": "FE01 - Ambiente, VS Code, pastas e primeiro projeto",
    "nomeCurto": "Ambiente, VS Code, pastas e primeiro projeto",
    "tema": "Organização do ambiente de desenvolvimento",
    "objetivo": "Preparar uma pasta Web organizada, conectar HTML, CSS e JavaScript e executar a página no navegador.",
    "produto": "Primeira página Front-End documentada e com uma interação de verificação do ambiente.",
    "contextoProfissional": "Organização inicial de um projeto Web, semelhante à estrutura usada por equipes para separar conteúdo, aparência, comportamento e documentação.",
    "alteracaoObrigatoria": "No README.md, substitua os campos de identificação pelo seu nome, confirme a turma e descreva como executou a página. Depois, personalize o texto do rodapé no index.html sem remover a identificação FE01.",
    "retomadas": [
      "uso básico de arquivos e pastas",
      "navegação no computador"
    ],
    "novos": [
      "Visual Studio Code",
      "estrutura de projeto Web",
      "index.html",
      "estilo.css",
      "script.js",
      "README.md",
      "console do navegador"
    ],
    "pasta": "exercicio-01",
    "repositorio": "atividades-frontend-sub",
    "classroomUrl": "https://classroom.google.com/",
    "githubUrl": "https://github.com/",
    "tempoMinimoSegundos": 300,
    "ordemArquivos": [
      "html",
      "css",
      "js",
      "readme"
    ],
    "arquivos": {
      "html": "<!doctype html>\n<html lang=\"pt-BR\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Atividade</title>\n</head>\n<body>\n  <main>\n    <!-- Desenvolva aqui a estrutura solicitada. -->\n  </main>\n</body>\n</html>\n",
      "css": "/* Desenvolva aqui os estilos solicitados. */\n",
      "js": "'use strict';\n// Desenvolva aqui o comportamento solicitado.\n",
      "readme": "# FE01 - Meu primeiro projeto Front-End\n\nPrimeiro projeto da disciplina **Programação Front-End**, organizado para testar a ligação entre HTML, CSS e JavaScript.\n\n## Estrutura da pasta\n\n```text\nexercicio-01/\n-  index.html\n-  estilo.css\n-  script.js\n-  README.md\n```\n\n## Como executar\n\n1. Abra a pasta no Visual Studio Code.\n2. Abra o arquivo `index.html` no navegador ou utilize a extensão Live Server.\n3. Clique em **Verificar projeto**.\n4. Confirme se a mensagem de sucesso aparece na página.\n\n## Identificação do estudante\n\n- Nome: **substitua pelo seu nome**\n- Turma: **2 DS Subsequente - Noturno**\n- Forma escolhida para executar: **descreva aqui**\n\n## Entrega\n\nEnvie o link do repositório solicitado pelo professor e anexe a evidência gerada pela plataforma.\n"
    },
    "nomesArquivos": {
      "html": "index.html",
      "css": "estilo.css",
      "js": "script.js",
      "readme": "README.md"
    },
    "linguagens": {
      "html": "html",
      "css": "css",
      "js": "js",
      "readme": "markdown"
    },
    "passos": {
      "html": [
        {
          "titulo": "Documento e arquivos conectados",
          "linhas": [
            1,
            9
          ],
          "explicacao": "O início cria o documento HTML, define o idioma e conecta estilo.css e script.js. O atributo defer faz o JavaScript esperar a leitura do HTML.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de html dentro do exercício.",
            "porque": "O HTML define a estrutura que o CSS estiliza e o JavaScript localiza.",
            "ordem": "O navegador lê a declaração, o head e depois constrói os elementos do body.",
            "erroComum": "Tag não fechada, id divergente ou caminho de arquivo incorreto.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "doctype",
            "lang",
            "defer"
          ]
        },
        {
          "titulo": "Cabeçalho e conteúdo principal",
          "linhas": [
            10,
            42
          ],
          "explicacao": "O corpo usa header, main, section e article para organizar a apresentação do projeto, a função de cada arquivo e o teste do ambiente.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de html dentro do exercício.",
            "porque": "O HTML define a estrutura que o CSS estiliza e o JavaScript localiza.",
            "ordem": "O navegador lê a declaração, o head e depois constrói os elementos do body.",
            "erroComum": "Tag não fechada, id divergente ou caminho de arquivo incorreto.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "id"
          ]
        },
        {
          "titulo": "Resultado e encerramento",
          "linhas": [
            43,
            52
          ],
          "explicacao": "O parágrafo com aria-live receberá a mensagem do JavaScript. O footer identifica o exercício e encerra a página.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de html dentro do exercício.",
            "porque": "O HTML define a estrutura que o CSS estiliza e o JavaScript localiza.",
            "ordem": "O navegador lê a declaração, o head e depois constrói os elementos do body.",
            "erroComum": "Tag não fechada, id divergente ou caminho de arquivo incorreto.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "ariaLive"
          ]
        }
      ],
      "css": [
        {
          "titulo": "Variáveis e preparação",
          "linhas": [
            1,
            18
          ],
          "explicacao": "As variáveis guardam as cores principais. O seletor universal aplica box-sizing para facilitar o controle dos tamanhos.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de css dentro do exercício.",
            "porque": "O CSS transforma a estrutura HTML em uma interface legível e responsiva.",
            "ordem": "A cascata combina regras gerais, componentes e ajustes de tela pequena.",
            "erroComum": "Seletor sem correspondência, propriedade inválida ou largura fixa causando overflow.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "root",
            "boxSizing"
          ]
        },
        {
          "titulo": "Layout e componentes",
          "linhas": [
            19,
            103
          ],
          "explicacao": "Estas regras estilizam o corpo, o cabeçalho, os painéis, os cartões, o botão e a mensagem de status.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de css dentro do exercício.",
            "porque": "O CSS transforma a estrutura HTML em uma interface legível e responsiva.",
            "ordem": "A cascata combina regras gerais, componentes e ajustes de tela pequena.",
            "erroComum": "Seletor sem correspondência, propriedade inválida ou largura fixa causando overflow.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "grid"
          ]
        },
        {
          "titulo": "Responsividade",
          "linhas": [
            104,
            131
          ],
          "explicacao": "A media query reorganiza os cartões em uma coluna e amplia o botão quando a tela é pequena.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de css dentro do exercício.",
            "porque": "O CSS transforma a estrutura HTML em uma interface legível e responsiva.",
            "ordem": "A cascata combina regras gerais, componentes e ajustes de tela pequena.",
            "erroComum": "Seletor sem correspondência, propriedade inválida ou largura fixa causando overflow.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "media"
          ]
        }
      ],
      "js": [
        {
          "titulo": "Localização dos elementos",
          "linhas": [
            1,
            2
          ],
          "explicacao": "querySelector localiza o botão e a área que exibirá a resposta do teste.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de js dentro do exercício.",
            "porque": "Este bloco conecta uma ação do usuário ao comportamento visível da página.",
            "ordem": "Primeiro os elementos são localizados; depois o evento é registrado; por último o callback altera a interface.",
            "erroComum": "Executar a alteração fora do evento ou usar um seletor que não encontra o elemento.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "querySelector"
          ]
        },
        {
          "titulo": "Resposta ao clique",
          "linhas": [
            4,
            8
          ],
          "explicacao": "addEventListener aguarda o clique e então muda a mensagem, adiciona a classe de sucesso e atualiza o texto do botão.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de js dentro do exercício.",
            "porque": "Este bloco conecta uma ação do usuário ao comportamento visível da página.",
            "ordem": "Primeiro os elementos são localizados; depois o evento é registrado; por último o callback altera a interface.",
            "erroComum": "Executar a alteração fora do evento ou usar um seletor que não encontra o elemento.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "addEventListener",
            "textContent",
            "classList"
          ]
        }
      ],
      "readme": [
        {
          "titulo": "Apresentação e estrutura",
          "linhas": [
            1,
            14
          ],
          "explicacao": "O README apresenta o exercício e registra a estrutura esperada da pasta.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de readme dentro do exercício.",
            "porque": "Este trecho existe para manter a sequência entre estrutura, comportamento, teste e entrega.",
            "ordem": "Leia de cima para baixo e acompanhe como cada linha prepara a próxima ação.",
            "erroComum": "Compare nomes, fechamento, pontuação e posição das instruções antes de validar.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "heading",
            "code"
          ]
        },
        {
          "titulo": "Execução e teste",
          "linhas": [
            16,
            23
          ],
          "explicacao": "Estas etapas orientam a abertura no VS Code, a execução no navegador e o teste do botão.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de readme dentro do exercício.",
            "porque": "Este trecho existe para manter a sequência entre estrutura, comportamento, teste e entrega.",
            "ordem": "Leia de cima para baixo e acompanhe como cada linha prepara a próxima ação.",
            "erroComum": "Compare nomes, fechamento, pontuação e posição das instruções antes de validar.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "heading"
          ]
        },
        {
          "titulo": "Identificação e entrega",
          "linhas": [
            25,
            30
          ],
          "explicacao": "O estudante deve substituir os campos de identificação e manter documentada a forma usada para executar a página.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de readme dentro do exercício.",
            "porque": "Este trecho existe para manter a sequência entre estrutura, comportamento, teste e entrega.",
            "ordem": "Leia de cima para baixo e acompanhe como cada linha prepara a próxima ação.",
            "erroComum": "Compare nomes, fechamento, pontuação e posição das instruções antes de validar.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "heading"
          ]
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 01 - Ambiente, VS Code, pastas e primeiro projeto",
      "descricao": "Nesta atividade, vamos preparar o ambiente de Programação Front-End e construir a primeira pasta de projeto no Visual Studio Code.\n\nVocê criará os arquivos index.html, estilo.css, script.js e README.md, compreenderá a função de cada um, abrirá a página no navegador e usará o botão de verificação para confirmar que os três arquivos principais estão conectados.\n\nAlteração obrigatória: complete a identificação no README.md e personalize o rodapé da página sem remover a indicação do FE01.\n\nAo terminar, valide todos os arquivos na plataforma, gere a evidência e salve o projeto na pasta exercicio-01 do repositório atividades-frontend-sub.\n\nEntrega: anexar o link do repositório do GitHub."
    },
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false,
      "readme": false
    },
    "validacao": {
      "strictDeclarations": false,
      "aceitarEquivalencias": true,
      "htmlEstrutura": {
        "idsObrigatorios": [
          "titulo-arquivos",
          "titulo-teste",
          "testarProjeto",
          "statusProjeto"
        ],
        "tagsMinimas": {
          "header": 1,
          "main": 1,
          "section": 1,
          "article": 1,
          "footer": 1,
          "button": 1,
          "h1": 1,
          "h2": 1
        },
        "referenciasArquivos": {
          "css": "estilo.css",
          "js": "script.js"
        },
        "seletoresObrigatorios": [
          {
            "selector": "#testarProjeto[type=\"button\"]",
            "message": "Mantenha o botão de verificação com type=\"button\"."
          }
        ]
      },
      "markdownEstrutura": {
        "codigoExercicio": "FE01",
        "minimoCaracteres": 50,
        "titulosObrigatorios": [],
        "arquivosObrigatorios": [
          "index.html",
          "estilo.css",
          "script.js"
        ],
        "conteudosObrigatorios": [
          "navegador"
        ],
        "proibirPlaceholders": [
          "substitua pelo seu nome",
          "descreva aqui"
        ]
      },
      "jsComportamento": [
        {
          "event": "click",
          "triggerId": "testarProjeto",
          "acoes": [
            {
              "type": "text",
              "targetId": "statusProjeto"
            },
            {
              "type": "classAdd",
              "targetId": "statusProjeto"
            },
            {
              "type": "text",
              "targetId": "testarProjeto"
            }
          ]
        }
      ],
      "politica": "conceitos_essenciais"
    },
    "glossario": [
      {
        "id": "doctype",
        "termo": "doctype",
        "categoria": "Declaração",
        "traducao": "Documento HTML",
        "explicacao": "Informa ao navegador que o arquivo utiliza HTML moderno.",
        "erroComum": "Esquecer ou alterar pode ativar modos antigos do navegador.",
        "linguagem": "html",
        "exercicio": "FE01"
      },
      {
        "id": "lang",
        "termo": "lang",
        "categoria": "Atributo",
        "traducao": "Idioma",
        "explicacao": "Indica que o conteúdo principal está em português do Brasil.",
        "erroComum": "Usar um idioma incorreto prejudica leitores de tela.",
        "linguagem": "html",
        "exercicio": "FE01"
      },
      {
        "id": "defer",
        "termo": "defer",
        "categoria": "Atributo",
        "traducao": "Adiar",
        "explicacao": "Faz o JavaScript aguardar a leitura do HTML antes de executar.",
        "erroComum": "Sem defer, o script pode procurar elementos que ainda não existem.",
        "linguagem": "html",
        "exercicio": "FE01"
      },
      {
        "id": "id",
        "termo": "id",
        "categoria": "Atributo",
        "traducao": "Identificador",
        "explicacao": "Cria um nome único para localizar um elemento no CSS ou JavaScript.",
        "erroComum": "Repetir o mesmo id ou escrever nomes diferentes quebra seletores.",
        "linguagem": "html",
        "exercicio": "FE01"
      },
      {
        "id": "ariaLive",
        "termo": "aria-live",
        "categoria": "Atributo de acessibilidade",
        "traducao": "Região viva",
        "explicacao": "Faz leitores de tela anunciarem mudanças no conteúdo.",
        "erroComum": "Remover pode ocultar mensagens dinâmicas para usuários de leitor de tela.",
        "linguagem": "html",
        "exercicio": "FE01"
      },
      {
        "id": "root",
        "termo": "root",
        "categoria": "Seletor",
        "traducao": "Raiz do documento",
        "explicacao": "Centraliza variáveis CSS reutilizáveis.",
        "erroComum": "Declarar variável e não usar var() reduz a utilidade.",
        "linguagem": "css",
        "exercicio": "FE01"
      },
      {
        "id": "boxSizing",
        "termo": "box-sizing",
        "categoria": "Propriedade",
        "traducao": "Modelo de caixa",
        "explicacao": "Inclui padding e borda no tamanho final do elemento.",
        "erroComum": "Sem ela, largura e altura podem crescer além do esperado.",
        "linguagem": "css",
        "exercicio": "FE01"
      },
      {
        "id": "grid",
        "termo": "grid",
        "categoria": "Valor de display",
        "traducao": "Grade",
        "explicacao": "Organiza elementos em linhas e colunas.",
        "erroComum": "Definir grid sem colunas pode não produzir o layout esperado.",
        "linguagem": "css",
        "exercicio": "FE01"
      },
      {
        "id": "media",
        "termo": "media",
        "categoria": "Regra condicional",
        "traducao": "Consulta de mídia",
        "explicacao": "Aplica regras quando a tela atende a uma condição.",
        "erroComum": "Usar largura fixa ou condição incorreta causa overflow.",
        "linguagem": "css",
        "exercicio": "FE01"
      },
      {
        "id": "querySelector",
        "termo": "querySelector",
        "categoria": "Método",
        "traducao": "Selecionar elemento",
        "explicacao": "Localiza o primeiro elemento que corresponde a um seletor CSS.",
        "erroComum": "Se o seletor estiver errado, o resultado será null.",
        "linguagem": "js",
        "exercicio": "FE01"
      },
      {
        "id": "addEventListener",
        "termo": "addEventListener",
        "categoria": "Método",
        "traducao": "Adicionar observador de evento",
        "explicacao": "Registra uma função para executar quando uma ação acontece.",
        "erroComum": "Colocar a lógica fora do callback faz ela executar antes do clique.",
        "linguagem": "js",
        "exercicio": "FE01"
      },
      {
        "id": "textContent",
        "termo": "textContent",
        "categoria": "Propriedade",
        "traducao": "Conteúdo textual",
        "explicacao": "Lê ou altera texto sem interpretar HTML.",
        "erroComum": "Usar innerHTML sem necessidade aumenta risco e pode alterar a estrutura.",
        "linguagem": "js",
        "exercicio": "FE01"
      },
      {
        "id": "classList",
        "termo": "classList",
        "categoria": "Propriedade",
        "traducao": "Lista de classes",
        "explicacao": "Permite adicionar, remover ou alternar classes CSS.",
        "erroComum": "Digitar uma classe diferente da existente impede o estilo.",
        "linguagem": "js",
        "exercicio": "FE01"
      },
      {
        "id": "heading",
        "termo": "heading",
        "categoria": "Sintaxe Markdown",
        "traducao": "Título",
        "explicacao": "Organiza a documentação em seções com #.",
        "erroComum": "Usar títulos sem conteúdo deixa o README incompleto.",
        "linguagem": "markdown",
        "exercicio": "FE01"
      },
      {
        "id": "code",
        "termo": "code",
        "categoria": "Sintaxe Markdown",
        "traducao": "Código em linha",
        "explicacao": "Destaca nomes de arquivos e comandos com crases.",
        "erroComum": "Aspas comuns não produzem o mesmo destaque.",
        "linguagem": "markdown",
        "exercicio": "FE01"
      }
    ],
    "dicasProgressivas": {
      "html": [
        "Relembre: o HTML organiza o conteúdo e conecta os outros arquivos.",
        "Localize: confira primeiro o head, depois os IDs usados pelo JavaScript.",
        "Compare: os nomes escritos em id devem ser exatamente iguais aos seletores.",
        "Estrutura parcial: mantenha abertura e fechamento das tags na ordem correta.",
        "Exemplo semelhante: crie outro botão e outra área de mensagem com nomes diferentes."
      ],
      "css": [
        "Relembre: seletores escolhem elementos e propriedades definem a apresentação.",
        "Localize: confira a regra que deveria afetar o elemento observado.",
        "Compare: verifique ponto da classe, dois-pontos, ponto e vírgula e unidade.",
        "Estrutura parcial: seletor { propriedade: valor; }.",
        "Exemplo semelhante: teste uma cor ou espaçamento diferente permitido."
      ],
      "js": [
        "Relembre: primeiro localize o elemento; depois registre a ação.",
        "Localize: confira o seletor e o callback do evento.",
        "Compare: a alteração precisa estar dentro da função executada pelo evento.",
        "Estrutura parcial: elemento.addEventListener('click', () => { /* ação */ });",
        "Exemplo semelhante: altere o texto de outro elemento com outro botão."
      ],
      "python": [
        "Relembre: input() sempre devolve texto.",
        "Localize: confira as linhas de entrada e conversão.",
        "Compare: o cálculo deve usar valores numéricos, não strings.",
        "Estrutura parcial: valor = float(input('Pergunta: ')).",
        "Exemplo semelhante: calcule quantidade x preço com outros nomes."
      ]
    },
    "comportamento": {
      "titulo": "Teste comportamental do ambiente",
      "instrucao": "Execute o preview e clique em Verificar projeto. Para concluir, basta a ação funcionar e a mensagem de status mudar.",
      "criterios": [
        {
          "id": "acao-principal",
          "tipo": "event",
          "evento": "click",
          "seletor": "#testarProjeto",
          "rotulo": "Clicar no botão Verificar projeto"
        },
        {
          "id": "mensagem-alterada",
          "tipo": "textNotEquals",
          "seletor": "#statusProjeto",
          "valor": "Aguardando a verificação.",
          "rotulo": "A mensagem de status foi atualizada"
        }
      ]
    },
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 2,
    "studentReferenceStripped": true,
    "codigo": "FE02",
    "titulo": "FE02 - HTML semântico em uma página profissional",
    "nomeCurto": "HTML semântico em uma página profissional",
    "tema": "Semântica e organização do conteúdo",
    "objetivo": "Construir uma página empresarial com regiões semânticas que comuniquem claramente a função de cada conteúdo.",
    "produto": "Página institucional de uma empresa de serviços, com navegação interna e informações de atendimento.",
    "contextoProfissional": "Sites empresariais precisam ser compreensíveis para pessoas, mecanismos de busca, leitores de tela e equipes que darão manutenção no código.",
    "alteracaoObrigatoria": "Personalize a seção Equipe com uma função profissional e uma responsabilidade adicional. Soluções semanticamente equivalentes e conteúdos extras são aceitos desde que as regiões obrigatórias permaneçam.",
    "retomadas": [
      "estrutura básica do documento HTML",
      "ligação entre HTML, CSS e JavaScript"
    ],
    "novos": [
      "header",
      "nav",
      "main",
      "section",
      "article",
      "aside",
      "footer",
      "address",
      "navegação interna",
      "aria-labelledby",
      "aria-expanded",
      "atributo hidden"
    ],
    "pasta": "exercicio-02",
    "repositorio": "atividades-frontend-sub",
    "classroomUrl": "https://classroom.google.com/",
    "githubUrl": "https://github.com/",
    "tempoMinimoSegundos": 300,
    "ordemArquivos": [
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
    "linguagens": {
      "html": "html",
      "css": "css",
      "js": "js"
    },
    "passos": {
      "html": [
        {
          "titulo": "Documento, acessibilidade e cabeçalho",
          "linhas": [
            1,
            26
          ],
          "explicacao": "O documento define idioma e viewport, conecta os arquivos, oferece um link para pular o cabeçalho e usa header e nav para apresentar a empresa e a navegação principal.",
          "detalhes": {
            "objetivo": "Reconhecer a preparação do documento, o link de salto e os elementos semânticos usados no cabeçalho.",
            "porque": "Idioma, viewport e navegação acessível criam uma base que funciona para teclado, leitores de tela e telas pequenas.",
            "ordem": "O navegador interpreta a declaração e o head; depois cria o link de salto, o header e a nav antes do conteúdo principal.",
            "erroComum": "O href do link de salto não corresponder ao id do main ou os links da navegação apontarem para seções inexistentes.",
            "conferir": "Use Tab ao abrir a página, acione o link de salto e confira se o foco chega ao conteúdo principal."
          },
          "termos": [
            "doctype",
            "lang",
            "skipLink",
            "header",
            "nav"
          ]
        },
        {
          "titulo": "Conteúdo principal e serviços",
          "linhas": [
            28,
            47
          ],
          "explicacao": "main identifica o conteúdo central. A primeira section reúne o tema Serviços e cada article representa um serviço independente que poderia ser reutilizado ou distribuído separadamente.",
          "detalhes": {
            "objetivo": "Diferenciar main, section e article conforme o papel de cada conteúdo.",
            "porque": "A semântica permite que a estrutura continue compreensível sem depender de cores, bordas ou posição visual.",
            "ordem": "O main inicia o conteúdo central; a section apresenta o tema Serviços; cada article descreve um serviço independente.",
            "erroComum": "Usar article apenas porque o conteúdo aparece em cartão ou criar section sem título relacionado.",
            "conferir": "Desative o CSS mentalmente e verifique se os títulos e elementos ainda descrevem uma hierarquia lógica."
          },
          "termos": [
            "main",
            "section",
            "article"
          ]
        },
        {
          "titulo": "Processo e equipe",
          "linhas": [
            49,
            61
          ],
          "explicacao": "Duas sections agrupam assuntos diferentes. Os títulos ligados por aria-labelledby nomeiam cada região de forma explícita.",
          "detalhes": {
            "objetivo": "Relacionar regiões temáticas aos títulos usando aria-labelledby.",
            "porque": "Uma região nomeada ajuda tecnologias assistivas a navegar entre blocos extensos.",
            "ordem": "Cada section é criada e seu aria-labelledby aponta para o id do h2 que a nomeia.",
            "erroComum": "Digitar um id no aria-labelledby diferente do id existente no título.",
            "conferir": "Compare caractere por caractere o valor do atributo e o id do título de cada região."
          },
          "termos": [
            "section",
            "ariaLabelledby"
          ]
        },
        {
          "titulo": "Conteúdo complementar e contato",
          "linhas": [
            63,
            85
          ],
          "explicacao": "aside concentra uma informação complementar sobre atendimento. footer e address encerram a página com dados de contato e identificação do exercício.",
          "detalhes": {
            "objetivo": "Distinguir informação complementar, encerramento e dados de contato.",
            "porque": "aside, footer e address descrevem papéis que uma div genérica não comunica.",
            "ordem": "O aside complementa o main; o footer encerra a página; address identifica os contatos relacionados.",
            "erroComum": "Colocar informação indispensável somente no aside ou usar address para qualquer texto de localização.",
            "conferir": "Pergunte se a página ainda é compreensível sem o aside e se o address contém realmente contato."
          },
          "termos": [
            "aside",
            "address"
          ]
        }
      ],
      "css": [
        {
          "titulo": "Variáveis e base visual",
          "linhas": [
            1,
            40
          ],
          "explicacao": "As variáveis centralizam as cores. box-sizing e as regras do body criam uma base previsível para a página.",
          "detalhes": {
            "objetivo": "Compreender variáveis CSS, cálculo de caixas e base visual do documento.",
            "porque": "Uma base previsível evita repetição de cores e diferenças inesperadas de largura.",
            "ordem": "As variáveis são declaradas primeiro; box-sizing prepara as caixas; body aplica tipografia, fundo e cor.",
            "erroComum": "Usar var() com nome inexistente ou esquecer que padding aumenta a caixa sem border-box.",
            "conferir": "Altere temporariamente uma variável e observe todos os componentes que dependem dela."
          },
          "termos": [
            "customProperty",
            "boxSizing"
          ]
        },
        {
          "titulo": "Navegação e tipografia",
          "linhas": [
            42,
            105
          ],
          "explicacao": "O link de salto aparece ao receber foco. Cabeçalho, títulos, textos e navegação são estilizados sem depender de Flexbox ou Grid.",
          "detalhes": {
            "objetivo": "Estilizar navegação e textos preservando foco visível e leitura clara.",
            "porque": "Links precisam funcionar tanto com ponteiro quanto com teclado, e a tipografia deve manter hierarquia.",
            "ordem": "O link de salto fica fora da tela, aparece com foco e depois as regras estilizam cabeçalho, títulos e navegação.",
            "erroComum": "Usar display:none no link de salto ou remover outline sem criar um estilo de foco equivalente.",
            "conferir": "Navegue somente com Tab e confirme que cada link ativo permanece claramente visível."
          },
          "termos": [
            "skipLink",
            "focusVisible"
          ]
        },
        {
          "titulo": "Regiões semânticas e interação",
          "linhas": [
            107,
            163
          ],
          "explicacao": "section, aside, footer e article recebem aparência coerente. O botão e a área de detalhes ganham estados visuais claros.",
          "detalhes": {
            "objetivo": "Dar aparência consistente às regiões sem substituir o significado do HTML.",
            "porque": "O CSS deve reforçar a leitura sem ser a única fonte de organização ou estado.",
            "ordem": "Regras gerais criam os painéis; artigos recebem acabamento; botão e detalhes recebem estados de interação.",
            "erroComum": "Aplicar seletor a uma classe inexistente ou ocultar conteúdo apenas por cor.",
            "conferir": "Inspecione a classe de cada região e teste hover e foco do botão."
          },
          "termos": [
            "focusVisible",
            "hidden"
          ]
        },
        {
          "titulo": "Adaptação para telas pequenas",
          "linhas": [
            165,
            184
          ],
          "explicacao": "A media query reduz espaçamentos, transforma os itens da navegação em blocos e amplia o botão no celular.",
          "detalhes": {
            "objetivo": "Adaptar espaçamento, navegação e botão a uma tela estreita.",
            "porque": "Conteúdo legível no computador pode ficar apertado ou difícil de tocar no celular.",
            "ordem": "Quando a largura atinge o breakpoint, as regras mais recentes substituem apenas o necessário.",
            "erroComum": "Criar largura fixa ou botão pequeno que continua causando rolagem horizontal.",
            "conferir": "Teste em 320 px e confirme que links e botão ocupam área adequada sem corte."
          },
          "termos": [
            "mediaQuery"
          ]
        }
      ],
      "js": [
        {
          "titulo": "Elementos controlados",
          "linhas": [
            1,
            2
          ],
          "explicacao": "querySelector localiza o botão e a região complementar que começará oculta.",
          "detalhes": {
            "objetivo": "Localizar o botão e a região complementar usando seletores reais.",
            "porque": "O JavaScript precisa de referências válidas antes de registrar comportamento.",
            "ordem": "querySelector é executado ao carregar o script e guarda cada elemento em uma constante.",
            "erroComum": "Seletor incorreto retornar null e causar erro ao usar addEventListener.",
            "conferir": "Compare os seletores com os ids e classes do HTML e teste no console se os elementos existem."
          },
          "termos": [
            "querySelector"
          ]
        },
        {
          "titulo": "Estado acessível do atendimento",
          "linhas": [
            4,
            10
          ],
          "explicacao": "O clique lê aria-expanded, atualiza o atributo, controla hidden e troca o texto do botão sem remover a semântica do HTML.",
          "detalhes": {
            "objetivo": "Sincronizar clique, visibilidade, texto e estado acessível.",
            "porque": "Usuários visuais e de tecnologia assistiva precisam receber a mesma informação.",
            "ordem": "O clique lê aria-expanded, calcula o novo estado, atualiza o atributo, muda hidden e troca o rótulo.",
            "erroComum": "Alterar hidden sem atualizar aria-expanded ou comparar o atributo com booleano em vez de string.",
            "conferir": "Clique duas vezes e confirme que a região abre e fecha, o texto muda e aria-expanded alterna."
          },
          "termos": [
            "addEventListener",
            "getAttribute",
            "setAttribute",
            "hidden",
            "ariaExpanded",
            "ternary"
          ]
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 02 - HTML semântico em uma página profissional",
      "descricao": "Nesta atividade, vamos construir uma página institucional usando elementos HTML semânticos. A página deverá apresentar a empresa, sua navegação, serviços, processo de trabalho, equipe, atendimento e contato.\n\nVocê praticará header, nav, main, section, article, aside, footer e address, além de relações acessíveis com aria-labelledby, aria-expanded e hidden.\n\nAlteração obrigatória: personalize a seção Equipe com uma função profissional e uma responsabilidade adicional, mantendo a organização semântica.\n\nAo terminar, valide os três arquivos, teste a navegação por âncoras, revele e oculte os horários, gere a evidência e salve tudo na pasta exercicio-02.\n\nEntrega: anexar o link do repositório do GitHub."
    },
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false,
      "aceitarEquivalencias": true,
      "htmlEstrutura": {
        "idsObrigatorios": [
          "conteudo",
          "servicos",
          "processo",
          "equipe",
          "atendimento",
          "mostrarAtendimento",
          "detalhesAtendimento",
          "contato"
        ],
        "tagsMinimas": {
          "header": 1,
          "nav": 1,
          "main": 1,
          "section": 1,
          "article": 1,
          "aside": 1,
          "footer": 1,
          "h1": 1,
          "h2": 1,
          "button": 1
        },
        "referenciasArquivos": {
          "css": "estilo.css",
          "js": "script.js"
        },
        "ancorasObrigatorias": [
          "#servicos",
          "#contato"
        ],
        "atributosObrigatorios": [
          {
            "selector": "#detalhesAtendimento",
            "attribute": "hidden"
          }
        ]
      },
      "jsComportamento": [
        {
          "event": "click",
          "triggerId": "mostrarAtendimento",
          "acoes": [
            {
              "type": "getAttribute",
              "targetId": "mostrarAtendimento",
              "attribute": "aria-expanded"
            },
            {
              "type": "setAttribute",
              "targetId": "mostrarAtendimento",
              "attribute": "aria-expanded"
            },
            {
              "type": "hidden",
              "targetId": "detalhesAtendimento"
            },
            {
              "type": "text",
              "targetId": "mostrarAtendimento"
            }
          ]
        }
      ],
      "politica": "conceitos_essenciais"
    },
    "glossario": [
      {
        "id": "doctype",
        "termo": "<!DOCTYPE html>",
        "categoria": "Declaração",
        "traducao": "Documento HTML moderno",
        "explicacao": "Informa ao navegador que o arquivo utiliza o padrão atual do HTML.",
        "erroComum": "Remover a declaração pode ativar um modo antigo de renderização.",
        "linguagem": "html",
        "exercicio": "FE02"
      },
      {
        "id": "lang",
        "termo": "lang",
        "categoria": "Atributo",
        "traducao": "Idioma",
        "explicacao": "Indica o idioma principal do documento para navegadores e leitores de tela.",
        "erroComum": "Usar idioma incorreto prejudica pronúncia e acessibilidade.",
        "linguagem": "html",
        "exercicio": "FE02"
      },
      {
        "id": "skipLink",
        "termo": "link de salto",
        "categoria": "Recurso de acessibilidade",
        "traducao": "Pular para o conteúdo",
        "explicacao": "Permite que uma pessoa usando teclado ignore a navegação repetida e vá diretamente ao conteúdo principal.",
        "erroComum": "O destino do href precisa existir e receber foco de forma previsível.",
        "linguagem": "html",
        "exercicio": "FE02"
      },
      {
        "id": "header",
        "termo": "header",
        "categoria": "Elemento semântico",
        "traducao": "Cabeçalho",
        "explicacao": "Agrupa a apresentação inicial de uma página ou seção.",
        "erroComum": "Usar header apenas como caixa visual, sem relação com o conteúdo, reduz a clareza semântica.",
        "linguagem": "html",
        "exercicio": "FE02"
      },
      {
        "id": "nav",
        "termo": "nav",
        "categoria": "Elemento semântico",
        "traducao": "Navegação",
        "explicacao": "Identifica um conjunto principal de links de navegação.",
        "erroComum": "Colocar qualquer lista de links em nav sem necessidade pode enfraquecer a estrutura.",
        "linguagem": "html",
        "exercicio": "FE02"
      },
      {
        "id": "main",
        "termo": "main",
        "categoria": "Elemento semântico",
        "traducao": "Conteúdo principal",
        "explicacao": "Marca o conteúdo central e único da página.",
        "erroComum": "Deve existir apenas um main visível por página.",
        "linguagem": "html",
        "exercicio": "FE02"
      },
      {
        "id": "section",
        "termo": "section",
        "categoria": "Elemento semântico",
        "traducao": "Seção temática",
        "explicacao": "Agrupa conteúdo relacionado que normalmente possui um título.",
        "erroComum": "Criar section sem tema ou título pode ser menos adequado que uma div.",
        "linguagem": "html",
        "exercicio": "FE02"
      },
      {
        "id": "article",
        "termo": "article",
        "categoria": "Elemento semântico",
        "traducao": "Conteúdo independente",
        "explicacao": "Representa um conteúdo que poderia ser reutilizado ou distribuído separadamente.",
        "erroComum": "Usar article para qualquer cartão apenas por aparência não garante semântica correta.",
        "linguagem": "html",
        "exercicio": "FE02"
      },
      {
        "id": "ariaLabelledby",
        "termo": "aria-labelledby",
        "categoria": "Atributo de acessibilidade",
        "traducao": "Nomeado por outro elemento",
        "explicacao": "Relaciona uma região ao id do título que fornece seu nome acessível.",
        "erroComum": "Referenciar um id inexistente deixa a região sem o nome esperado.",
        "linguagem": "html",
        "exercicio": "FE02"
      },
      {
        "id": "aside",
        "termo": "aside",
        "categoria": "Elemento semântico",
        "traducao": "Conteúdo complementar",
        "explicacao": "Agrupa informação relacionada, mas secundária ao conteúdo principal.",
        "erroComum": "Não deve receber o conteúdo essencial que o usuário precisa para compreender a página.",
        "linguagem": "html",
        "exercicio": "FE02"
      },
      {
        "id": "address",
        "termo": "address",
        "categoria": "Elemento semântico",
        "traducao": "Informações de contato",
        "explicacao": "Identifica dados de contato do autor, organização ou seção relacionada.",
        "erroComum": "Não deve ser usado apenas para qualquer endereço postal sem contexto de contato.",
        "linguagem": "html",
        "exercicio": "FE02"
      },
      {
        "id": "hidden",
        "termo": "hidden",
        "categoria": "Atributo/propriedade",
        "traducao": "Oculto",
        "explicacao": "Remove temporariamente um elemento da apresentação e da árvore de acessibilidade.",
        "erroComum": "Alterar apenas a aparência no CSS pode deixar conteúdo oculto ainda acessível ou focável.",
        "linguagem": "html/js",
        "exercicio": "FE02"
      },
      {
        "id": "ariaExpanded",
        "termo": "aria-expanded",
        "categoria": "Atributo de acessibilidade",
        "traducao": "Expandido ou recolhido",
        "explicacao": "Comunica se um controle revela ou oculta uma região.",
        "erroComum": "O valor precisa acompanhar o estado visual real.",
        "linguagem": "html/js",
        "exercicio": "FE02"
      },
      {
        "id": "customProperty",
        "termo": "--variavel",
        "categoria": "Propriedade personalizada",
        "traducao": "Variável CSS",
        "explicacao": "Guarda um valor reutilizável, como uma cor, para manter consistência.",
        "erroComum": "Usar var() com nome diferente faz a propriedade perder o valor.",
        "linguagem": "css",
        "exercicio": "FE02"
      },
      {
        "id": "boxSizing",
        "termo": "box-sizing",
        "categoria": "Propriedade CSS",
        "traducao": "Cálculo da caixa",
        "explicacao": "Com border-box, padding e borda passam a fazer parte da largura definida.",
        "erroComum": "Sem essa regra, caixas podem ultrapassar a largura esperada.",
        "linguagem": "css",
        "exercicio": "FE02"
      },
      {
        "id": "focusVisible",
        "termo": ":focus-visible",
        "categoria": "Pseudoclasse",
        "traducao": "Foco visível",
        "explicacao": "Aplica estilo quando o elemento recebe foco por uma forma que precisa de indicação visual, como teclado.",
        "erroComum": "Remover o contorno sem alternativa torna a navegação por teclado difícil.",
        "linguagem": "css",
        "exercicio": "FE02"
      },
      {
        "id": "mediaQuery",
        "termo": "@media",
        "categoria": "Regra condicional CSS",
        "traducao": "Consulta de mídia",
        "explicacao": "Aplica ajustes de estilo conforme características da tela.",
        "erroComum": "Criar @media sem ajustar o layout real não garante responsividade.",
        "linguagem": "css",
        "exercicio": "FE02"
      },
      {
        "id": "querySelector",
        "termo": "querySelector",
        "categoria": "Método do DOM",
        "traducao": "Selecionar elemento",
        "explicacao": "Localiza o primeiro elemento que corresponde a um seletor CSS.",
        "erroComum": "Se o seletor estiver incorreto, o resultado será null.",
        "linguagem": "javascript",
        "exercicio": "FE02"
      },
      {
        "id": "addEventListener",
        "termo": "addEventListener",
        "categoria": "Método",
        "traducao": "Registrar evento",
        "explicacao": "Associa uma função a uma ação, como clique.",
        "erroComum": "Executar a alteração fora do callback faz a ação acontecer antes do clique.",
        "linguagem": "javascript",
        "exercicio": "FE02"
      },
      {
        "id": "getAttribute",
        "termo": "getAttribute",
        "categoria": "Método",
        "traducao": "Ler atributo",
        "explicacao": "Obtém o valor atual de um atributo do elemento.",
        "erroComum": "Comparar com booleano em vez de texto pode produzir resultado inesperado.",
        "linguagem": "javascript",
        "exercicio": "FE02"
      },
      {
        "id": "setAttribute",
        "termo": "setAttribute",
        "categoria": "Método",
        "traducao": "Atualizar atributo",
        "explicacao": "Define ou altera o valor de um atributo.",
        "erroComum": "Atualizar aria-expanded sem mudar a região visível cria divergência de acessibilidade.",
        "linguagem": "javascript",
        "exercicio": "FE02"
      },
      {
        "id": "ternary",
        "termo": "operador ternário",
        "categoria": "Operador condicional",
        "traducao": "Escolha curta",
        "explicacao": "Escolhe entre dois valores usando condição ? valor1 : valor2.",
        "erroComum": "Encadear muitos ternários reduz a legibilidade.",
        "linguagem": "javascript",
        "exercicio": "FE02"
      }
    ],
    "dicasProgressivas": {
      "html": [
        "Relembre: escolha a tag pelo papel do conteúdo, não pela aparência.",
        "Localize: confira main, sections, articles, aside e address e seus títulos.",
        "Compare: todo aria-labelledby precisa apontar para um id existente.",
        "Estrutura parcial: <section aria-labelledby=\"titulo-x\"><h2 id=\"titulo-x\">...</h2>...</section>.",
        "Exemplo semelhante: organize uma página de biblioteca usando header, nav, main, article e aside."
      ],
      "css": [
        "Relembre: o CSS apresenta a estrutura sem substituir a semântica.",
        "Localize: teste primeiro variáveis, foco e link de salto.",
        "Compare: confira seletor, propriedade, valor, unidade e fechamento.",
        "Estrutura parcial: @media (max-width: ...px) { seletor { propriedade: valor; } }.",
        "Exemplo semelhante: transforme uma navegação horizontal em blocos em outra largura."
      ],
      "js": [
        "Relembre: o estado visual e o estado acessível precisam ser iguais.",
        "Localize: confira botão, região oculta e callback do click.",
        "Compare: aria-expanded usa texto \"true\" ou \"false\", enquanto hidden é booleano.",
        "Estrutura parcial: const aberto = botao.getAttribute(...) === \"true\"; depois atualize os dois estados.",
        "Exemplo semelhante: crie um botão que revela uma seção de dúvidas com IDs diferentes."
      ]
    },
    "comportamento": {
      "titulo": "Teste comportamental da área de atendimento",
      "instrucao": "Execute o preview e use o botão de horários. A plataforma verifica a ação principal e se os detalhes realmente aparecem.",
      "criterios": [
        {
          "id": "acao-principal",
          "tipo": "event",
          "evento": "click",
          "seletor": "#mostrarAtendimento",
          "rotulo": "Acionar o botão de horários"
        },
        {
          "id": "conteudo-visivel",
          "tipo": "notHidden",
          "seletor": "#detalhesAtendimento",
          "rotulo": "Os detalhes de atendimento ficaram visíveis"
        }
      ]
    },
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 3,
    "studentReferenceStripped": true,
    "codigo": "FE03",
    "titulo": "FE03 - Formulário acessível de cadastro",
    "nomeCurto": "Formulário acessível de cadastro",
    "tema": "Formulários semânticos e acessibilidade",
    "objetivo": "Construir um formulário de cadastro compreensível pelo teclado, pelo navegador e por tecnologias assistivas.",
    "produto": "Formulário profissional de cadastro de cliente, com grupos de campos, rótulos associados, tipos adequados e confirmação acessível.",
    "contextoProfissional": "Cadastros são usados em atendimento, vendas, suporte e sistemas internos. Um formulário mal estruturado aumenta erros, abandono e barreiras de acesso.",
    "alteracaoObrigatoria": "Acrescente um campo opcional relacionado ao atendimento, com label associado, id, name e autocomplete quando existir um valor apropriado. Textos, opções e conteúdo adicional podem ser personalizados sem remover os requisitos de acessibilidade.",
    "retomadas": [
      "estrutura semântica do documento",
      "ligação entre HTML, CSS e JavaScript",
      "hierarquia de títulos"
    ],
    "novos": [
      "form",
      "label e for",
      "fieldset e legend",
      "input text, email, tel, radio e checkbox",
      "select e option",
      "textarea",
      "required",
      "name",
      "autocomplete",
      "aria-describedby",
      "role=status",
      "aria-live"
    ],
    "pasta": "exercicio-03",
    "repositorio": "atividades-frontend-sub",
    "classroomUrl": "https://classroom.google.com/",
    "githubUrl": "https://github.com/",
    "tempoMinimoSegundos": 300,
    "ordemArquivos": [
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
    "linguagens": {
      "html": "html",
      "css": "css",
      "js": "js"
    },
    "passos": {
      "html": [
        {
          "titulo": "Documento e orientação inicial",
          "linhas": [
            1,
            21
          ],
          "explicacao": "O documento define idioma, viewport, arquivos conectados, link de salto, título principal e aviso visual dos campos obrigatórios.",
          "detalhes": {
            "objetivo": "Preparar documento, link de salto e instruções de preenchimento.",
            "porque": "A pessoa precisa entender o formulário e chegar diretamente a ele por teclado.",
            "ordem": "O head configura a página; o body apresenta salto, cabeçalho e indicação dos campos obrigatórios.",
            "erroComum": "Usar apenas cor ou asterisco sem explicação textual para obrigatoriedade.",
            "conferir": "Use Tab e confirme que a orientação inicial e o formulário possuem ordem lógica."
          },
          "termos": [
            "form"
          ]
        },
        {
          "titulo": "Dados da pessoa responsável",
          "linhas": [
            23,
            48
          ],
          "explicacao": "O primeiro fieldset reúne dados pessoais. Cada controle possui label, id e name, enquanto type, autocomplete, required e aria-describedby melhoram preenchimento e acessibilidade.",
          "detalhes": {
            "objetivo": "Construir campos pessoais com agrupamento, rótulos e atributos adequados.",
            "porque": "fieldset e legend dão contexto; label, type e autocomplete ajudam preenchimento correto.",
            "ordem": "O fieldset abre o grupo, legend o nomeia e cada label aponta para o id de seu controle.",
            "erroComum": "for diferente do id, campo obrigatório sem required ou input sem name.",
            "conferir": "Clique em cada label e verifique se o campo correspondente recebe foco."
          },
          "termos": [
            "fieldset",
            "legend",
            "label",
            "required",
            "autocomplete",
            "ariaDescribedby"
          ]
        },
        {
          "titulo": "Necessidade e preferência de retorno",
          "linhas": [
            50,
            86
          ],
          "explicacao": "O segundo grupo utiliza select, radio, textarea e checkbox. O fieldset interno e sua legend nomeiam corretamente o conjunto de opções de retorno.",
          "detalhes": {
            "objetivo": "Combinar select, radios, textarea e checkbox sem perder semântica.",
            "porque": "Cada tipo de controle representa uma forma diferente de escolha ou entrada.",
            "ordem": "O select escolhe a necessidade; o grupo radio define uma opção; textarea recebe detalhes; checkbox registra consentimento.",
            "erroComum": "Radios com names diferentes ou opção inicial do select considerada válida indevidamente.",
            "conferir": "Escolha opções diferentes e confira se apenas um radio do grupo permanece marcado."
          },
          "termos": [
            "select",
            "radio",
            "textarea",
            "checkbox",
            "fieldset",
            "legend"
          ]
        },
        {
          "titulo": "Ações e mensagem de estado",
          "linhas": [
            88,
            95
          ],
          "explicacao": "Os botões possuem tipos explícitos. A área role=status com aria-live comunica a confirmação sem depender apenas de alterações visuais.",
          "detalhes": {
            "objetivo": "Definir envio, limpeza e feedback acessível.",
            "porque": "Tipos explícitos impedem ações acidentais e role=status anuncia a confirmação.",
            "ordem": "Os botões aparecem ao final do form e a região de status aguarda a mensagem do JavaScript.",
            "erroComum": "Botão sem type agir como submit ou status depender somente de cor.",
            "conferir": "Envie pelo botão e pela tecla Enter, depois use Limpar e observe o estado."
          },
          "termos": [
            "roleStatus",
            "submit",
            "reset"
          ]
        }
      ],
      "css": [
        {
          "titulo": "Base visual e link de salto",
          "linhas": [
            1,
            49
          ],
          "explicacao": "Variáveis, box-sizing, cores e o link de salto estabelecem uma base legível e previsível.",
          "detalhes": {
            "objetivo": "Estabelecer cores, Box Model e navegação inicial acessível.",
            "porque": "A base reduz inconsistências e torna o link de salto perceptível ao receber foco.",
            "ordem": "Variáveis e box-sizing vêm antes das regras do body e do link.",
            "erroComum": "Ocultar definitivamente o link ou usar contraste insuficiente.",
            "conferir": "Pressione Tab logo após carregar e confirme a aparição do link de salto."
          },
          "termos": [
            "focusVisible"
          ]
        },
        {
          "titulo": "Painéis e grupos do formulário",
          "linhas": [
            51,
            111
          ],
          "explicacao": "Cabeçalho, formulário, fieldset, legend e campos recebem espaçamento e contraste sem alterar sua ordem semântica.",
          "detalhes": {
            "objetivo": "Organizar visualmente formulário, fieldsets e legendas.",
            "porque": "Espaçamento e contraste ajudam a perceber grupos sem alterar a ordem semântica.",
            "ordem": "Cabeçalho e formulário criam os painéis; fieldset delimita grupos; legend os identifica.",
            "erroComum": "Remover borda e espaçamento de tal forma que os grupos fiquem indistinguíveis.",
            "conferir": "Observe se cada conjunto de campos continua claramente separado em telas grandes e pequenas."
          },
          "termos": [
            "fieldset",
            "legend"
          ]
        },
        {
          "titulo": "Controles e foco visível",
          "linhas": [
            113,
            156
          ],
          "explicacao": "Inputs, select, textarea e botões mantêm tamanho confortável. focus-visible destaca claramente o elemento ativo para navegação por teclado.",
          "detalhes": {
            "objetivo": "Garantir controles legíveis, tocáveis e navegáveis por teclado.",
            "porque": "Campos precisam acomodar texto, zoom e foco sem corte.",
            "ordem": "Uma regra comum prepara os controles e focus-visible destaca somente o elemento ativo.",
            "erroComum": "Altura fixa cortar conteúdo ou outline ser removido sem substituição.",
            "conferir": "Percorra todos os campos com Tab e confira foco e tamanho de toque."
          },
          "termos": [
            "focusVisible",
            "minHeight"
          ]
        },
        {
          "titulo": "Ações, status e telas pequenas",
          "linhas": [
            158,
            209
          ],
          "explicacao": "Botões e mensagem de status ganham estados claros. A media query preserva leitura e toque em telas estreitas.",
          "detalhes": {
            "objetivo": "Estilizar ações e feedback e reorganizar o formulário no celular.",
            "porque": "Botões e mensagens precisam permanecer claros em qualquer largura.",
            "ordem": "Estados de botão e status são definidos; a media query reduz espaços e empilha ações.",
            "erroComum": "Botões ultrapassarem a tela ou mensagem longa causar overflow.",
            "conferir": "Teste em 320 px com uma mensagem longa e confirme que tudo quebra linha."
          },
          "termos": [
            "roleStatus"
          ]
        }
      ],
      "js": [
        {
          "titulo": "Referências do formulário",
          "linhas": [
            1,
            2
          ],
          "explicacao": "querySelector localiza o formulário e a região que comunicará o resultado.",
          "detalhes": {
            "objetivo": "Localizar form e status antes de tratar eventos.",
            "porque": "As funções precisam manipular exatamente os elementos presentes no HTML.",
            "ordem": "O script carrega, querySelector encontra os elementos e as constantes ficam disponíveis aos eventos.",
            "erroComum": "Classe ou id divergente retornar null.",
            "conferir": "Compare seletores e HTML e confirme ausência de erro no console."
          },
          "termos": [
            "form",
            "roleStatus"
          ]
        },
        {
          "titulo": "Confirmação de envio",
          "linhas": [
            4,
            16
          ],
          "explicacao": "O evento submit impede recarregamento, lê os dados com FormData, cria uma mensagem com textContent, revela o status e move o foco para a confirmação.",
          "detalhes": {
            "objetivo": "Tratar o submit, ler dados e produzir feedback seguro.",
            "porque": "O evento submit inclui clique e Enter; FormData lê campos pelo name; textContent evita interpretar HTML.",
            "ordem": "O envio é interceptado, os dados são lidos, a mensagem é criada, o status é revelado e recebe foco.",
            "erroComum": "Campo sem name não aparecer ou usar innerHTML com dados digitados.",
            "conferir": "Envie dados diferentes e confirme que a mensagem usa o valor atual sem recarregar a página."
          },
          "termos": [
            "submit",
            "preventDefault",
            "formData",
            "textContent",
            "focus"
          ]
        },
        {
          "titulo": "Limpeza do estado",
          "linhas": [
            17,
            20
          ],
          "explicacao": "O evento reset volta a ocultar a mensagem e remove o texto anterior.",
          "detalhes": {
            "objetivo": "Sincronizar a limpeza dos campos com a mensagem de confirmação.",
            "porque": "Uma confirmação antiga não pode permanecer depois que os dados foram apagados.",
            "ordem": "O reset padrão limpa os controles e o callback oculta e esvazia a região de status.",
            "erroComum": "Limpar apenas os campos e deixar feedback desatualizado.",
            "conferir": "Envie, depois limpe e confirme que a mensagem também desaparece."
          },
          "termos": [
            "reset",
            "textContent"
          ]
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 03 - Formulário acessível de cadastro",
      "descricao": "Nesta atividade, vamos construir um formulário profissional de cadastro com rótulos associados, agrupamento por fieldset e legend, tipos de campo adequados, preenchimento automático, campos obrigatórios e uma confirmação acessível.\n\nAlteração obrigatória: acrescente um campo opcional relacionado ao atendimento, mantendo label, id e name corretamente associados.\n\nTeste o formulário com mouse e teclado, envie dados válidos, confira a mensagem de confirmação e use o botão de limpeza.\n\nEntrega: anexar o link do repositório do GitHub."
    },
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false,
      "aceitarEquivalencias": true,
      "htmlEstrutura": {
        "idsObrigatorios": [
          "conteudo",
          "cadastroCliente",
          "nome",
          "email",
          "telefone",
          "servico",
          "retornoEmail",
          "retornoTelefone",
          "mensagem",
          "termos",
          "statusCadastro"
        ],
        "tagsMinimas": {
          "main": 1,
          "form": 1,
          "fieldset": 1,
          "legend": 1,
          "label": 3,
          "input": 3,
          "select": 1,
          "option": 1,
          "textarea": 1,
          "button": 1,
          "h1": 1
        },
        "referenciasArquivos": {
          "css": "estilo.css",
          "js": "script.js"
        },
        "seletoresObrigatorios": [
          {
            "selector": "label[for=\"nome\"]",
            "message": "Associe um label ao campo nome."
          },
          {
            "selector": "label[for=\"email\"]",
            "message": "Associe um label ao campo e-mail."
          },
          {
            "selector": "button[type=\"submit\"]",
            "message": "Inclua um botão de envio com type=\"submit\"."
          }
        ],
        "rotulosAssociados": [
          "nome",
          "email",
          "telefone",
          "servico",
          "mensagem",
          "termos"
        ],
        "proibirTabindexPositivo": false,
        "atributosObrigatorios": [
          {
            "selector": "#nome",
            "attribute": "required"
          },
          {
            "selector": "#email",
            "attribute": "type",
            "value": "email"
          },
          {
            "selector": "#email",
            "attribute": "required"
          },
          {
            "selector": "#servico",
            "attribute": "required"
          },
          {
            "selector": "#termos",
            "attribute": "type",
            "value": "checkbox"
          },
          {
            "selector": "#termos",
            "attribute": "required"
          }
        ]
      },
      "jsComportamento": [
        {
          "event": "submit",
          "triggerId": "cadastroCliente",
          "acoes": [
            {
              "type": "preventDefault"
            },
            {
              "type": "formData"
            },
            {
              "type": "dataGet"
            },
            {
              "type": "text",
              "targetId": "statusCadastro"
            },
            {
              "type": "hidden",
              "targetId": "statusCadastro"
            },
            {
              "type": "focus",
              "targetId": "statusCadastro"
            }
          ]
        },
        {
          "event": "reset",
          "triggerId": "cadastroCliente",
          "acoes": [
            {
              "type": "hidden",
              "targetId": "statusCadastro"
            },
            {
              "type": "text",
              "targetId": "statusCadastro"
            }
          ]
        }
      ],
      "politica": "conceitos_essenciais"
    },
    "glossario": [
      {
        "id": "form",
        "termo": "form",
        "categoria": "Elemento semântico",
        "traducao": "Formulário",
        "explicacao": "Agrupa controles que coletam e enviam dados.",
        "erroComum": "Campos fora do form podem não participar do envio.",
        "linguagem": "html",
        "exercicio": "FE03"
      },
      {
        "id": "fieldset",
        "termo": "fieldset",
        "categoria": "Elemento de formulário",
        "traducao": "Grupo de campos",
        "explicacao": "Agrupa controles relacionados de forma visual e semântica.",
        "erroComum": "Usar apenas div perde o agrupamento anunciado por leitores de tela.",
        "linguagem": "html",
        "exercicio": "FE03"
      },
      {
        "id": "legend",
        "termo": "legend",
        "categoria": "Elemento de formulário",
        "traducao": "Legenda do grupo",
        "explicacao": "Nomeia um fieldset e explica o tema daquele conjunto de campos.",
        "erroComum": "Colocar legend fora do fieldset quebra a relação semântica.",
        "linguagem": "html",
        "exercicio": "FE03"
      },
      {
        "id": "label",
        "termo": "label",
        "categoria": "Elemento de formulário",
        "traducao": "Rótulo",
        "explicacao": "Identifica claramente a informação esperada em um campo.",
        "erroComum": "O atributo for precisa corresponder ao id do controle.",
        "linguagem": "html",
        "exercicio": "FE03"
      },
      {
        "id": "required",
        "termo": "required",
        "categoria": "Atributo",
        "traducao": "Obrigatório",
        "explicacao": "Informa ao navegador que o campo precisa ser preenchido antes do envio.",
        "erroComum": "Apenas escrever um asterisco não cria validação funcional.",
        "linguagem": "html",
        "exercicio": "FE03"
      },
      {
        "id": "autocomplete",
        "termo": "autocomplete",
        "categoria": "Atributo",
        "traducao": "Preenchimento automático",
        "explicacao": "Informa o tipo de dado para que o navegador ajude a preencher o campo.",
        "erroComum": "Valor inadequado pode oferecer uma informação errada ao usuário.",
        "linguagem": "html",
        "exercicio": "FE03"
      },
      {
        "id": "ariaDescribedby",
        "termo": "aria-describedby",
        "categoria": "Atributo de acessibilidade",
        "traducao": "Descrito por",
        "explicacao": "Liga o campo a um texto complementar, como instrução ou formato esperado.",
        "erroComum": "O id referenciado precisa existir e ser único.",
        "linguagem": "html",
        "exercicio": "FE03"
      },
      {
        "id": "select",
        "termo": "select",
        "categoria": "Controle de formulário",
        "traducao": "Lista de seleção",
        "explicacao": "Permite escolher uma opção dentro de uma lista definida.",
        "erroComum": "Uma opção inicial sem valor deve continuar sendo tratada como não selecionada quando obrigatória.",
        "linguagem": "html",
        "exercicio": "FE03"
      },
      {
        "id": "radio",
        "termo": "radio",
        "categoria": "Tipo de input",
        "traducao": "Escolha única",
        "explicacao": "Permite escolher uma opção dentro de um grupo com o mesmo name.",
        "erroComum": "Names diferentes fazem os radios deixarem de formar um grupo.",
        "linguagem": "html",
        "exercicio": "FE03"
      },
      {
        "id": "textarea",
        "termo": "textarea",
        "categoria": "Controle de formulário",
        "traducao": "Texto multilinha",
        "explicacao": "Recebe textos maiores, como uma descrição.",
        "erroComum": "Inserir o valor inicial no atributo value não funciona como em input.",
        "linguagem": "html",
        "exercicio": "FE03"
      },
      {
        "id": "checkbox",
        "termo": "checkbox",
        "categoria": "Tipo de input",
        "traducao": "Marcação independente",
        "explicacao": "Representa uma escolha que pode estar marcada ou desmarcada.",
        "erroComum": "Tratar checkbox como texto sem verificar checked produz leitura incorreta.",
        "linguagem": "html/js",
        "exercicio": "FE03"
      },
      {
        "id": "roleStatus",
        "termo": "role=\"status\"",
        "categoria": "Função de acessibilidade",
        "traducao": "Região de status",
        "explicacao": "Faz mensagens atualizadas serem anunciadas sem deslocar o foco automaticamente.",
        "erroComum": "Usar apenas cor não comunica a confirmação para todos.",
        "linguagem": "html",
        "exercicio": "FE03"
      },
      {
        "id": "focusVisible",
        "termo": ":focus-visible",
        "categoria": "Pseudoclasse",
        "traducao": "Foco visível",
        "explicacao": "Destaca o controle ativo durante navegação por teclado.",
        "erroComum": "Remover outline sem substituto prejudica acessibilidade.",
        "linguagem": "css",
        "exercicio": "FE03"
      },
      {
        "id": "minHeight",
        "termo": "min-height",
        "categoria": "Propriedade CSS",
        "traducao": "Altura mínima",
        "explicacao": "Garante uma área mínima sem impedir que o conteúdo aumente a caixa.",
        "erroComum": "Usar height fixa pode cortar textos e mensagens.",
        "linguagem": "css",
        "exercicio": "FE03"
      },
      {
        "id": "submit",
        "termo": "submit",
        "categoria": "Evento",
        "traducao": "Envio",
        "explicacao": "É disparado quando o formulário é enviado pelo botão ou pela tecla Enter.",
        "erroComum": "Escutar apenas o clique do botão ignora outras formas válidas de envio.",
        "linguagem": "javascript",
        "exercicio": "FE03"
      },
      {
        "id": "preventDefault",
        "termo": "preventDefault",
        "categoria": "Método do evento",
        "traducao": "Impedir ação padrão",
        "explicacao": "Impede o recarregamento padrão para que a plataforma trate os dados na página.",
        "erroComum": "Usar sem explicar pode esconder que um formulário real normalmente envia dados.",
        "linguagem": "javascript",
        "exercicio": "FE03"
      },
      {
        "id": "formData",
        "termo": "FormData",
        "categoria": "Objeto da Web API",
        "traducao": "Dados do formulário",
        "explicacao": "Lê os campos associados ao formulário usando seus atributos name.",
        "erroComum": "Campo sem name não aparece nos dados coletados.",
        "linguagem": "javascript",
        "exercicio": "FE03"
      },
      {
        "id": "textContent",
        "termo": "textContent",
        "categoria": "Propriedade do DOM",
        "traducao": "Conteúdo textual",
        "explicacao": "Insere texto sem interpretar tags HTML.",
        "erroComum": "Usar innerHTML com conteúdo do usuário pode criar risco de injeção.",
        "linguagem": "javascript",
        "exercicio": "FE03"
      },
      {
        "id": "focus",
        "termo": "focus",
        "categoria": "Método",
        "traducao": "Mover foco",
        "explicacao": "Move o foco para um elemento, ajudando o usuário a encontrar a confirmação.",
        "erroComum": "Mover foco sem necessidade pode interromper a navegação.",
        "linguagem": "javascript",
        "exercicio": "FE03"
      },
      {
        "id": "reset",
        "termo": "reset",
        "categoria": "Evento",
        "traducao": "Limpeza do formulário",
        "explicacao": "É disparado quando os campos voltam aos valores iniciais.",
        "erroComum": "A mensagem de confirmação também precisa ser limpa para não ficar desatualizada.",
        "linguagem": "javascript",
        "exercicio": "FE03"
      }
    ],
    "dicasProgressivas": {
      "html": [
        "Relembre: cada campo precisa de rótulo e cada grupo precisa de contexto.",
        "Localize: confira for/id, name, type, required e autocomplete.",
        "Compare: radios do mesmo grupo compartilham o mesmo name.",
        "Estrutura parcial: <label for=\"campo\">...</label><input id=\"campo\" name=\"campo\" ...>.",
        "Exemplo semelhante: monte um formulário de inscrição com contato e preferência de turno."
      ],
      "css": [
        "Relembre: formulários precisam permanecer legíveis com teclado, zoom e celular.",
        "Localize: confira controles, foco e área das ações.",
        "Compare: use min-height quando o conteúdo puder crescer.",
        "Estrutura parcial: controle:focus-visible { outline: ...; outline-offset: ...; }.",
        "Exemplo semelhante: estilize outro formulário mantendo rótulos visíveis e contraste."
      ],
      "js": [
        "Relembre: trate o evento submit do formulário, não apenas o clique.",
        "Localize: confira preventDefault, FormData, status e reset.",
        "Compare: campos sem name não entram no FormData.",
        "Estrutura parcial: formulario.addEventListener(\"submit\", evento => { evento.preventDefault(); ... });.",
        "Exemplo semelhante: gere uma confirmação de reserva usando textContent."
      ]
    },
    "comportamento": {
      "titulo": "Teste comportamental do formulário",
      "instrucao": "Preencha os campos necessários e envie. A aprovação depende do envio produzir uma confirmação visível e preenchida, sem exigir uma frase específica.",
      "criterios": [
        {
          "id": "envio-realizado",
          "tipo": "event",
          "evento": "submit",
          "seletor": "#cadastroCliente",
          "rotulo": "Enviar o formulário preenchido"
        },
        {
          "id": "confirmacao-visivel",
          "tipo": "notHidden",
          "seletor": "#statusCadastro",
          "rotulo": "A confirmação de cadastro ficou visível"
        },
        {
          "id": "confirmacao-preenchida",
          "tipo": "textNonEmpty",
          "seletor": "#statusCadastro",
          "rotulo": "A confirmação apresenta os dados processados"
        }
      ]
    },
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 4,
    "studentReferenceStripped": true,
    "codigo": "FE04",
    "titulo": "FE04 - CSS: seletores, cascata, variáveis e Box Model",
    "nomeCurto": "CSS: seletores, cascata, variáveis e Box Model",
    "tema": "Fundamentos de estilização e controle do espaço",
    "objetivo": "Aplicar diferentes tipos de seletores, compreender a cascata, reutilizar valores com variáveis e controlar o Box Model de componentes.",
    "produto": "Vitrine profissional de planos com cartão recomendado e alternância entre temas claro e escuro.",
    "contextoProfissional": "Sistemas de design usam variáveis e regras reutilizáveis para manter consistência. Seletores e especificidade precisam ser planejados para evitar estilos difíceis de manter.",
    "alteracaoObrigatoria": "Crie uma variável visual adicional e use-a em pelo menos dois seletores. Personalize o cartão recomendado mantendo seletores de classe, id e atributo semanticamente equivalentes.",
    "retomadas": [
      "HTML semântico",
      "atributos id e class",
      "ligação entre HTML, CSS e JavaScript"
    ],
    "novos": [
      "seletores CSS",
      "cascata",
      "especificidade",
      "variáveis CSS",
      "var()",
      "Box Model",
      "box-sizing",
      "pseudoclasses"
    ],
    "pasta": "exercicio-04",
    "repositorio": "atividades-frontend-sub",
    "classroomUrl": "https://classroom.google.com/",
    "githubUrl": "https://github.com/",
    "tempoMinimoSegundos": 300,
    "ordemArquivos": [
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
    "linguagens": {
      "html": "html",
      "css": "css",
      "js": "js"
    },
    "passos": {
      "html": [
        {
          "titulo": "Conexão dos arquivos e cabeçalho",
          "linhas": [
            1,
            17
          ],
          "explicacao": "O documento conecta CSS e JavaScript, apresenta o produto e cria um botão acessível com aria-pressed e uma região de status.",
          "detalhes": {
            "objetivo": "Preparar a página e o controle de tema com estado acessível.",
            "porque": "CSS e JavaScript precisam estar conectados e o botão precisa comunicar sua alternância.",
            "ordem": "O head conecta os arquivos; o header apresenta o exercício; o botão e o status ficam prontos para o script.",
            "erroComum": "Caminho incorreto ou aria-pressed não acompanhar o tema.",
            "conferir": "Verifique Network/console e clique no botão observando texto, aparência e atributo."
          },
          "termos": [
            "ariaPressed"
          ]
        },
        {
          "titulo": "Cartões com diferentes identificadores",
          "linhas": [
            19,
            43
          ],
          "explicacao": "Os artigos reutilizam a classe cartao. O plano recomendado combina classe adicional, id e atributo data-status para demonstrar diferentes seletores.",
          "detalhes": {
            "objetivo": "Criar uma base HTML que permita comparar seletores de classe, ID e atributo.",
            "porque": "O mesmo componente pode receber regra geral e exceções com prioridades diferentes.",
            "ordem": "Todos recebem cartao; o recomendado recebe classe extra, id e data-status para demonstrar camadas.",
            "erroComum": "Repetir id ou escrever seletor que não corresponde ao atributo.",
            "conferir": "Inspecione cada artigo e liste quais seletores CSS conseguem selecioná-lo."
          },
          "termos": [
            "classSelector",
            "idSelector",
            "dataAttribute"
          ]
        },
        {
          "titulo": "Resumo e encerramento",
          "linhas": [
            45,
            55
          ],
          "explicacao": "O aside sintetiza os conceitos e o footer encerra a página sem alterar a estrutura principal.",
          "detalhes": {
            "objetivo": "Separar conteúdo complementar e identificação final.",
            "porque": "O aside resume conceitos sem interromper a lista principal de planos.",
            "ordem": "Depois dos cartões, o aside acrescenta orientação e o footer encerra o documento.",
            "erroComum": "Usar aside para informação obrigatória ou colocar elementos fora do body.",
            "conferir": "Leia a página sem CSS e confirme que a ordem continua compreensível."
          },
          "termos": [
            "boxModel"
          ]
        }
      ],
      "css": [
        {
          "titulo": "Variáveis, seletor universal e elemento",
          "linhas": [
            1,
            23
          ],
          "explicacao": "As propriedades personalizadas centralizam cores e medidas. O seletor universal aplica border-box e o seletor body define a base visual.",
          "detalhes": {
            "objetivo": "Compreender variáveis, seletor universal e regra de elemento.",
            "porque": "Esses níveis preparam valores reutilizáveis e uma base comum antes dos componentes.",
            "ordem": "Variáveis são declaradas em :root, * ajusta caixas e body define aparência global.",
            "erroComum": "Confundir a função universal com uma regra específica de componente.",
            "conferir": "Localize onde cada variável é consumida por var() e altere uma delas temporariamente."
          },
          "termos": [
            "root",
            "customProperty",
            "universal",
            "boxModel"
          ]
        },
        {
          "titulo": "Cascata e tema alternativo",
          "linhas": [
            25,
            73
          ],
          "explicacao": "A classe tema-claro redefine variáveis. Por causa da cascata, todos os componentes que usam var() atualizam sua aparência sem repetir regras.",
          "detalhes": {
            "objetivo": "Observar como a cascata troca valores sem duplicar todos os componentes.",
            "porque": "Redefinir variáveis em uma classe de estado permite temas mais fáceis de manter.",
            "ordem": "As variáveis padrão existem em :root; tema-claro redefine algumas quando a classe está no body.",
            "erroComum": "Aplicar a classe no elemento errado ou colocar valor fixo onde deveria haver var().",
            "conferir": "Ative a classe no DevTools e confirme quais propriedades mudam por herança das variáveis."
          },
          "termos": [
            "cascade",
            "var",
            "customProperty"
          ]
        },
        {
          "titulo": "Interação do botão e foco visível",
          "linhas": [
            75,
            99
          ],
          "explicacao": "O botão recebe estados de interação claros para mouse e teclado. O foco visível ajuda quem navega sem o mouse.",
          "detalhes": {
            "objetivo": "Identificar estados de interação e foco acessível no botão.",
            "porque": "Interfaces precisam indicar visualmente quando um controle está sob o mouse ou recebeu foco pelo teclado.",
            "ordem": "Primeiro é definido o botão; depois hover e focus-visible ajustam o retorno visual.",
            "erroComum": "Remover o outline sem fornecer outro indicador visível de foco.",
            "conferir": "Use Tab para chegar ao botão e confirme que o foco continua claramente perceptível."
          },
          "termos": [
            "focusVisible"
          ]
        },
        {
          "titulo": "Seletores e Box Model dos cartões",
          "linhas": [
            101,
            156
          ],
          "explicacao": "A classe geral define width, margin, padding e border. Classe composta, id e atributo acrescentam destaque em camadas de especificidade.",
          "detalhes": {
            "objetivo": "Comparar seletor de classe, classe composta, ID e atributo no Box Model.",
            "porque": "As regras mostram reutilização, exceções e especificidade em um mesmo componente.",
            "ordem": "A classe geral cria a caixa; seletores mais específicos acrescentam destaques ao plano recomendado.",
            "erroComum": "Usar seletor mais forte desnecessariamente ou confundir margin, padding e border.",
            "conferir": "No painel Computed, identifique de qual seletor veio cada valor do cartão recomendado."
          },
          "termos": [
            "classSelector",
            "idSelector",
            "attributeSelector",
            "specificity",
            "margin",
            "padding",
            "border"
          ]
        },
        {
          "titulo": "Adaptação para telas pequenas",
          "linhas": [
            158,
            176
          ],
          "explicacao": "O rodapé finaliza a página e a media query reduz espaçamentos e amplia o botão em telas estreitas.",
          "detalhes": {
            "objetivo": "Concluir a composição e adaptar a interface para celular.",
            "porque": "O mesmo conteúdo precisa permanecer legível e fácil de tocar em larguras menores.",
            "ordem": "Depois dos componentes principais, a media query sobrescreve apenas espaçamentos e largura do botão.",
            "erroComum": "Usar larguras fixas que causem rolagem horizontal ou deixar o botão pequeno demais para toque.",
            "conferir": "Teste o preview em 320 px e confirme que cartões e botão permanecem dentro da tela."
          },
          "termos": [
            "mediaQuery"
          ]
        }
      ],
      "js": [
        {
          "titulo": "Referências dos elementos",
          "linhas": [
            1,
            2
          ],
          "explicacao": "querySelector localiza o botão e a região de status.",
          "detalhes": {
            "objetivo": "Guardar botão e status em constantes para uso no evento.",
            "porque": "Referências claras evitam repetir seletores e facilitam conferir os elementos controlados.",
            "ordem": "querySelector executa ao carregar o script e retorna cada elemento.",
            "erroComum": "Selecionar o id errado ou executar antes do DOM sem defer.",
            "conferir": "Confirme o atributo defer e compare cada seletor com o HTML."
          },
          "termos": [
            "classListToggle",
            "ariaPressed"
          ]
        },
        {
          "titulo": "Alternância de estado",
          "linhas": [
            4,
            10
          ],
          "explicacao": "classList.toggle muda a classe do body; aria-pressed, texto do botão e mensagem são atualizados de forma segura.",
          "detalhes": {
            "objetivo": "Alternar classe visual e manter atributos, textos e mensagem sincronizados.",
            "porque": "A mudança precisa ser percebida visualmente e anunciada de forma acessível.",
            "ordem": "O clique chama toggle, recebe o booleano do novo estado e usa esse valor nas atualizações.",
            "erroComum": "Inverter os textos ou atualizar aria-pressed com valor diferente do estado real.",
            "conferir": "Clique repetidamente e observe classe do body, atributo, rótulo e mensagem."
          },
          "termos": [
            "classListToggle",
            "ariaPressed",
            "boolean"
          ]
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 04 - CSS: seletores, cascata, variáveis e Box Model",
      "descricao": "Nesta atividade, vamos construir uma vitrine de planos e praticar seletores de elemento, classe, id, atributo e pseudoclasse, além de cascata, especificidade, variáveis CSS e Box Model.\n\nAlteração obrigatória: crie uma variável visual adicional, use-a em pelo menos dois seletores e personalize o cartão recomendado sem remover os conceitos exigidos.\n\nTeste os dois temas, o foco do botão, o Box Model no DevTools e a página em tela pequena.\n\nEntrega: anexar o link do repositório do GitHub."
    },
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false,
      "aceitarEquivalencias": true,
      "htmlEstrutura": {
        "idsObrigatorios": [
          "alternarTema",
          "statusTema",
          "conteudo",
          "titulo-planos",
          "planoDestaque",
          "titulo-resumo"
        ],
        "tagsMinimas": {
          "header": 1,
          "main": 1,
          "section": 1,
          "article": 1,
          "aside": 1,
          "footer": 1,
          "button": 1,
          "h1": 1,
          "h2": 1,
          "h3": 1
        },
        "referenciasArquivos": {
          "css": "estilo.css",
          "js": "script.js"
        },
        "seletoresObrigatorios": [
          {
            "selector": "#alternarTema[aria-pressed]",
            "message": "Inclua o botão de tema com aria-pressed."
          }
        ],
        "atributosObrigatorios": [
          {
            "selector": "#alternarTema",
            "attribute": "type",
            "value": "button"
          }
        ]
      },
      "cssEstrutura": {
        "minimoVariaveis": 3,
        "minimoUsosVar": 3,
        "tiposSeletores": [
          "elemento",
          "classe",
          "id",
          "atributo",
          "pseudoclasse"
        ],
        "exigirBoxSizing": true,
        "exigirBoxModelCompleto": true,
        "proibir": [],
        "minimoTiposSeletores": 2
      },
      "jsComportamento": [
        {
          "event": "click",
          "triggerId": "alternarTema",
          "acoes": [
            {
              "type": "bodyClassToggle"
            },
            {
              "type": "setAttribute",
              "targetId": "alternarTema",
              "attribute": "aria-pressed"
            },
            {
              "type": "text",
              "targetId": "alternarTema"
            },
            {
              "type": "text",
              "targetId": "statusTema"
            }
          ]
        }
      ],
      "politica": "conceitos_essenciais"
    },
    "glossario": [
      {
        "id": "root",
        "termo": ":root",
        "categoria": "Pseudoclasse",
        "traducao": "Raiz do documento",
        "explicacao": "Seleciona o elemento raiz e é um local comum para declarar variáveis CSS globais.",
        "erroComum": "Declarar variável com nome diferente do usado em var() impede a aplicação.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "customProperty",
        "termo": "propriedade personalizada",
        "categoria": "Recurso CSS",
        "traducao": "Variável CSS",
        "explicacao": "Guarda cores e medidas reutilizáveis iniciadas por dois hífens.",
        "erroComum": "Esquecer os dois hífens torna a declaração inválida.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "var",
        "termo": "var()",
        "categoria": "Função CSS",
        "traducao": "Usar variável",
        "explicacao": "Recupera o valor de uma propriedade personalizada.",
        "erroComum": "Referenciar uma variável inexistente pode invalidar a propriedade.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "universal",
        "termo": "*",
        "categoria": "Seletor universal",
        "traducao": "Todos os elementos",
        "explicacao": "Seleciona todos os elementos para aplicar uma preparação comum.",
        "erroComum": "Regras pesadas no seletor universal podem afetar a página inteira.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "cascade",
        "termo": "cascata",
        "categoria": "Mecanismo CSS",
        "traducao": "Combinação de regras",
        "explicacao": "Decide qual declaração vence considerando origem, importância, especificidade e ordem.",
        "erroComum": "Achar que a última regra sempre vence ignora especificidade.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "specificity",
        "termo": "especificidade",
        "categoria": "Regra de prioridade",
        "traducao": "Peso do seletor",
        "explicacao": "Compara o peso de seletores para decidir qual regra prevalece.",
        "erroComum": "Usar muitos IDs e !important dificulta manutenção.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "classSelector",
        "termo": ".classe",
        "categoria": "Seletor de classe",
        "traducao": "Selecionar por classe",
        "explicacao": "Aplica a mesma regra a vários elementos com a classe indicada.",
        "erroComum": "Esquecer o ponto faz o navegador procurar uma tag.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "idSelector",
        "termo": "#id",
        "categoria": "Seletor de ID",
        "traducao": "Selecionar identificador único",
        "explicacao": "Seleciona um elemento por seu id e possui alta especificidade.",
        "erroComum": "Reutilizar o mesmo id em vários elementos é inválido.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "attributeSelector",
        "termo": "[atributo]",
        "categoria": "Seletor de atributo",
        "traducao": "Selecionar por atributo",
        "explicacao": "Seleciona elementos que possuem um atributo ou valor específico.",
        "erroComum": "Aspas ou valor divergente impedem a correspondência.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "boxModel",
        "termo": "Box Model",
        "categoria": "Modelo de caixa",
        "traducao": "Conteúdo, preenchimento, borda e margem",
        "explicacao": "Explica como o navegador calcula o espaço ocupado por cada elemento.",
        "erroComum": "Confundir padding com margin altera o espaço interno e externo.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "margin",
        "termo": "margin",
        "categoria": "Propriedade CSS",
        "traducao": "Margem externa",
        "explicacao": "Cria espaço fora da borda do elemento.",
        "erroComum": "Usar margin quando o objetivo é espaço interno produz layout diferente.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "padding",
        "termo": "padding",
        "categoria": "Propriedade CSS",
        "traducao": "Preenchimento interno",
        "explicacao": "Cria espaço entre o conteúdo e a borda.",
        "erroComum": "Padding soma ao tamanho quando box-sizing não é border-box.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "border",
        "termo": "border",
        "categoria": "Propriedade CSS",
        "traducao": "Borda",
        "explicacao": "Desenha o limite visual da caixa.",
        "erroComum": "Definir apenas cor sem estilo e espessura pode não mostrar borda.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "hover",
        "termo": ":hover",
        "categoria": "Pseudoclasse",
        "traducao": "Ponteiro sobre o elemento",
        "explicacao": "Aplica estilo enquanto o ponteiro está sobre um elemento.",
        "erroComum": "Não deve ser a única forma de revelar informação importante.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "focusVisible",
        "termo": ":focus-visible",
        "categoria": "Pseudoclasse",
        "traducao": "Foco por teclado",
        "explicacao": "Destaca a interação de teclado sem depender do mouse.",
        "erroComum": "Remover o foco deixa usuários sem saber onde estão.",
        "linguagem": "css",
        "exercicio": "FE04"
      },
      {
        "id": "classListToggle",
        "termo": "classList.toggle",
        "categoria": "Método do DOM",
        "traducao": "Alternar classe",
        "explicacao": "Adiciona uma classe quando ausente e remove quando presente.",
        "erroComum": "Alternar a classe no elemento errado não muda as variáveis esperadas.",
        "linguagem": "javascript",
        "exercicio": "FE04"
      },
      {
        "id": "ariaPressed",
        "termo": "aria-pressed",
        "categoria": "Atributo de acessibilidade",
        "traducao": "Estado de botão pressionado",
        "explicacao": "Comunica se um botão de alternância está ativo.",
        "erroComum": "O valor precisa acompanhar a classe visual aplicada.",
        "linguagem": "html/js",
        "exercicio": "FE04"
      },
      {
        "id": "dataAttribute",
        "termo": "data-*",
        "categoria": "Atributo personalizado",
        "traducao": "Dado do elemento",
        "explicacao": "Armazena informação específica da aplicação sem inventar atributos inválidos.",
        "erroComum": "O seletor CSS precisa usar exatamente o nome e valor declarados.",
        "linguagem": "html/css",
        "exercicio": "FE04"
      },
      {
        "id": "boolean",
        "termo": "booleano",
        "categoria": "Tipo lógico",
        "traducao": "Verdadeiro ou falso",
        "explicacao": "Representa o estado retornado por classList.toggle e orienta as mensagens do botão.",
        "erroComum": "Comparar booleano com as strings \"true\" ou \"false\" altera a lógica.",
        "linguagem": "javascript",
        "exercicio": "FE04"
      }
    ],
    "dicasProgressivas": {
      "html": [
        "Relembre: classes podem ser reutilizadas; IDs devem ser únicos; data-* guarda dados.",
        "Localize: compare os atributos dos cartões com os seletores CSS.",
        "Compare: o valor de aria-pressed precisa iniciar coerente com o tema.",
        "Estrutura parcial: <article class=\"cartao destaque\" id=\"...\" data-status=\"...\">.",
        "Exemplo semelhante: diferencie produtos comuns e recomendados com classes e atributos próprios."
      ],
      "css": [
        "Relembre: a cascata escolhe regras; o Box Model calcula o espaço.",
        "Localize: confira :root, var(), classe geral e seletores mais específicos.",
        "Compare: margin é externo, padding é interno e border fica entre ambos.",
        "Estrutura parcial: .componente { margin: ...; padding: ...; border: ...; }.",
        "Exemplo semelhante: crie tema alternativo redefinindo apenas variáveis em uma classe do body."
      ],
      "js": [
        "Relembre: classList.toggle retorna o novo estado como booleano.",
        "Localize: confira onde a classe é aplicada e quais textos dependem dela.",
        "Compare: aria-pressed recebe o mesmo estado usado na interface.",
        "Estrutura parcial: const ativo = elemento.classList.toggle(\"classe\"); depois use ativo nas mensagens.",
        "Exemplo semelhante: alterne um modo de alto contraste em outra página."
      ]
    },
    "comportamento": {
      "titulo": "Teste comportamental do tema",
      "instrucao": "Execute o preview e altere o tema. O requisito essencial é existir uma mudança visual real após o clique.",
      "criterios": [
        {
          "id": "acao-principal",
          "tipo": "event",
          "evento": "click",
          "seletor": "#alternarTema",
          "rotulo": "Acionar o botão de tema"
        },
        {
          "id": "classe-tema",
          "tipo": "visualChanged",
          "seletor": "body",
          "propriedades": [
            "color",
            "backgroundColor",
            "borderColor",
            "boxShadow",
            "fontWeight"
          ],
          "rotulo": "O tema produziu uma mudança visual real"
        }
      ]
    },
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 5,
    "studentReferenceStripped": true,
    "codigo": "FE05",
    "titulo": "FE05 - Layout profissional com Flexbox",
    "nomeCurto": "Layout profissional com Flexbox",
    "tema": "Distribuição, alinhamento e adaptação de componentes",
    "objetivo": "Construir um layout profissional com contêineres flexíveis, distribuição de espaço, alinhamento, quebra de linha e adaptação para telas pequenas.",
    "produto": "Painel profissional de serviços com cartões flexíveis, indicadores laterais e alternância de direção.",
    "contextoProfissional": "Interfaces administrativas e páginas de serviços precisam reorganizar componentes conforme o espaço disponível. Flexbox facilita alinhamento em um eixo, distribuição de espaço e adaptação de grupos de componentes.",
    "alteracaoObrigatoria": "Adicione um quarto cartão de serviço com conteúdo próprio e mantenha-o responsivo usando flex ou flex-basis. Personalize o espaçamento do layout sem usar Grid e sem alterar a ordem semântica do HTML.",
    "retomadas": [
      "HTML semântico",
      "seletores e classes",
      "variáveis CSS",
      "Box Model"
    ],
    "novos": [
      "display flex",
      "eixo principal e transversal",
      "flex-direction",
      "justify-content",
      "align-items",
      "flex-wrap",
      "gap",
      "flex-basis",
      "layout responsivo"
    ],
    "pasta": "exercicio-05",
    "repositorio": "atividades-frontend-sub",
    "classroomUrl": "https://classroom.google.com/",
    "githubUrl": "https://github.com/",
    "tempoMinimoSegundos": 300,
    "ordemArquivos": [
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
    "linguagens": {
      "html": "html",
      "css": "css",
      "js": "js"
    },
    "passos": {
      "html": [
        {
          "titulo": "Cabeçalho e controles",
          "linhas": [
            1,
            33
          ],
          "explicacao": "A página conecta os arquivos, oferece salto para o conteúdo e reúne título, botão de alternância e navegação. aria-pressed e aria-controls comunicam o estado do controle.",
          "detalhes": {
            "objetivo": "Preparar apresentação, navegação e botão que controla a demonstração de Flexbox.",
            "porque": "A estrutura semântica e os atributos acessíveis devem existir antes do layout visual.",
            "ordem": "O head conecta arquivos; header apresenta; botão aponta para a lista controlada; nav oferece navegação.",
            "erroComum": "aria-controls apontar para id inexistente ou aria-pressed ficar desatualizado.",
            "conferir": "Compare atributos do botão com o id da lista e teste o controle com teclado."
          },
          "termos": [
            "ariaControls",
            "ariaPressed"
          ]
        },
        {
          "titulo": "Área principal e cartões",
          "linhas": [
            35,
            104
          ],
          "explicacao": "main contém uma área de serviços e um aside de indicadores. A lista reúne artigos independentes que serão distribuídos pelo Flexbox.",
          "detalhes": {
            "objetivo": "Organizar conteúdo, aside e cartões que se tornarão itens flexíveis.",
            "porque": "Flexbox atua nos filhos diretos, portanto a hierarquia HTML define quais elementos serão distribuídos.",
            "ordem": "main contém layout-principal; a seção recebe lista-servicos; cada article vira item da lista; aside ocupa outra faixa.",
            "erroComum": "Esperar que netos sejam itens do contêiner principal ou colocar artigo fora da lista.",
            "conferir": "Desenhe a árvore pai-filho e marque quais elementos são filhos diretos de cada contêiner flexível."
          },
          "termos": [
            "flexContainer",
            "flexItem"
          ]
        },
        {
          "titulo": "Orientações e encerramento",
          "linhas": [
            106,
            122
          ],
          "explicacao": "A seção final resume as propriedades praticadas e o rodapé identifica a atividade.",
          "detalhes": {
            "objetivo": "Retomar as propriedades utilizadas e finalizar a página.",
            "porque": "A seção de orientação ajuda a relacionar o resultado visual ao conceito, sem substituir a prática.",
            "ordem": "Após o layout demonstrativo, a orientação resume propriedades e o footer identifica a atividade.",
            "erroComum": "Duplicar instruções ou usar lista sem relação com o conteúdo praticado.",
            "conferir": "Associe cada termo da orientação a uma regra existente no CSS."
          },
          "termos": [
            "justifyContent",
            "alignItems",
            "flexWrap",
            "gap"
          ]
        }
      ],
      "css": [
        {
          "titulo": "Base visual e contêiner do topo",
          "linhas": [
            1,
            121
          ],
          "explicacao": "Variáveis, Box Model e estilos básicos preparam o projeto. topo-conteudo usa Flexbox para distribuir apresentação e controle.",
          "detalhes": {
            "objetivo": "Preparar a aparência e ativar Flexbox no topo.",
            "porque": "O topo precisa distribuir texto e controle e continuar quebrando corretamente em telas menores.",
            "ordem": "Variáveis e base vêm primeiro; depois topo-conteudo recebe display:flex, alinhamentos e gap.",
            "erroComum": "Aplicar justify-content em elemento que não possui display:flex.",
            "conferir": "No DevTools, selecione topo-conteudo e identifique eixos principal e transversal."
          },
          "termos": [
            "displayFlex",
            "justifyContent",
            "alignItems",
            "gap"
          ]
        },
        {
          "titulo": "Navegação e layout principal",
          "linhas": [
            122,
            162
          ],
          "explicacao": "A navegação quebra itens quando necessário. layout-principal organiza conteúdo e painel lateral, usando flex para controlar crescimento e tamanho-base.",
          "detalhes": {
            "objetivo": "Usar wrap, crescimento e tamanho-base em dois contêineres.",
            "porque": "A navegação precisa quebrar e o conteúdo principal precisa dividir espaço com o aside.",
            "ordem": "A navegação ativa flex e wrap; layout-principal ativa flex; filhos definem grow e basis.",
            "erroComum": "Usar width fixa que impede flexibilidade ou esquecer min-width:0 em conteúdo longo.",
            "conferir": "Reduza a largura lentamente e observe quando links e colunas se reorganizam."
          },
          "termos": [
            "flexWrap",
            "flexGrow",
            "flexBasis"
          ]
        },
        {
          "titulo": "Cartões flexíveis",
          "linhas": [
            163,
            223
          ],
          "explicacao": "A lista usa flex-wrap e gap. Cada cartão também é flexível em coluna, e o rodapé interno usa margin-top: auto para permanecer na base.",
          "detalhes": {
            "objetivo": "Distribuir cartões em várias linhas e alinhar conteúdo interno.",
            "porque": "flex-wrap, gap e flex-basis permitem cartões adaptáveis; coluna e margin-top:auto alinham seus rodapés.",
            "ordem": "A lista vira contêiner; artigos definem tamanho e direção; a área final consome o espaço livre.",
            "erroComum": "Aplicar margin-top:auto sem pai flex em coluna ou impedir wrap.",
            "conferir": "Aumente um texto de cartão e verifique se o botão/rodapé continua na base sem corte."
          },
          "termos": [
            "flexContainer",
            "flexItem",
            "flexWrap",
            "gap",
            "flexDirection",
            "marginAuto"
          ]
        },
        {
          "titulo": "Indicadores e responsividade",
          "linhas": [
            248,
            326
          ],
          "explicacao": "Os indicadores usam direção vertical. As media queries mudam a direção dos principais contêineres e evitam rolagem horizontal em telas estreitas.",
          "detalhes": {
            "objetivo": "Alternar direção de indicadores e reorganizar os principais contêineres no mobile.",
            "porque": "Uma direção adequada no desktop pode não caber em tela estreita.",
            "ordem": "Indicadores recebem coluna; breakpoints mudam topo, layout e dimensões dos itens.",
            "erroComum": "Mudar flex-direction sem revisar alinhamentos e larguras dos filhos.",
            "conferir": "Teste em 1365, 620 e 320 px e identifique a direção de cada contêiner."
          },
          "termos": [
            "flexDirection",
            "flexBasis"
          ]
        }
      ],
      "js": [
        {
          "titulo": "Elementos controlados",
          "linhas": [
            1,
            3
          ],
          "explicacao": "querySelector localiza o botão, a lista de serviços e a região de status.",
          "detalhes": {
            "objetivo": "Localizar botão, lista e status usados na demonstração.",
            "porque": "O evento precisa alterar a região certa e comunicar o resultado.",
            "ordem": "O script guarda três referências antes de registrar o click.",
            "erroComum": "Classe da lista divergente ou ausência do status causar null.",
            "conferir": "Compare os três seletores com o HTML e verifique console limpo."
          },
          "termos": [
            "querySelector"
          ]
        },
        {
          "titulo": "Alternância de direção",
          "linhas": [
            5,
            15
          ],
          "explicacao": "O clique alterna uma classe, atualiza aria-pressed, o texto do botão e a mensagem acessível sem inserir HTML inseguro.",
          "detalhes": {
            "objetivo": "Alternar a classe que muda o eixo do Flexbox e sincronizar feedback.",
            "porque": "A atividade permite observar a diferença entre linha e coluna em tempo real.",
            "ordem": "O clique chama toggle, lê o booleano retornado e atualiza aria-pressed, rótulo e status.",
            "erroComum": "Aplicar a classe no botão em vez da lista ou usar texto oposto ao estado.",
            "conferir": "Clique, inspecione a classe da lista e compare a direção calculada no CSS."
          },
          "termos": [
            "classListToggle",
            "ariaPressed",
            "textContent"
          ]
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 05 - Layout profissional com Flexbox",
      "descricao": "Nesta atividade, vamos construir uma central profissional de serviços usando Flexbox para organizar cabeçalho, navegação, área principal, cartões, indicadores e ações internas.\n\nAlteração obrigatória: adicione um quarto cartão de serviço, use flex ou flex-basis para integrá-lo ao layout e personalize o espaçamento sem usar Grid.\n\nTeste a quebra dos cartões, a alternância entre linhas e coluna, o foco por teclado e a página em telas de 390 px, 760 px e desktop.\n\nEntrega: anexar o link do repositório do GitHub."
    },
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false,
      "aceitarEquivalencias": true,
      "htmlEstrutura": {
        "idsObrigatorios": [
          "alternarDirecao",
          "listaServicos",
          "statusLayout",
          "conteudo",
          "servicos",
          "indicadores",
          "orientacoes"
        ],
        "tagsMinimas": {
          "header": 1,
          "nav": 1,
          "main": 1,
          "section": 1,
          "article": 1,
          "aside": 1,
          "footer": 1,
          "button": 1,
          "h1": 1,
          "h2": 1,
          "h3": 1
        },
        "referenciasArquivos": {
          "css": "estilo.css",
          "js": "script.js"
        },
        "ancorasObrigatorias": [
          "#servicos"
        ],
        "seletoresObrigatorios": [
          {
            "selector": "#alternarDirecao[aria-pressed][aria-controls=\"listaServicos\"]",
            "message": "Inclua o botão de alternância com aria-pressed e aria-controls."
          },
          {
            "selector": "#listaServicos .cartao-servico",
            "message": "Mantenha a lista de serviços com cartões identificáveis."
          }
        ],
        "atributosObrigatorios": []
      },
      "cssFlexbox": {
        "minimoDisplaysFlex": 2,
        "exigirFlexWrap": false,
        "exigirFlexDirection": false,
        "exigirJustifyContent": false,
        "exigirAlignItems": false,
        "exigirGap": true,
        "exigirFlexItemSizing": false,
        "exigirMediaQuery": false,
        "proibir": []
      },
      "jsComportamento": [
        {
          "event": "click",
          "triggerId": "alternarDirecao",
          "acoes": [
            {
              "type": "classToggle",
              "targetId": "listaServicos"
            },
            {
              "type": "setAttribute",
              "targetId": "alternarDirecao",
              "attribute": "aria-pressed"
            },
            {
              "type": "text",
              "targetId": "alternarDirecao"
            },
            {
              "type": "text",
              "targetId": "statusLayout"
            }
          ]
        }
      ],
      "politica": "conceitos_essenciais"
    },
    "glossario": [
      {
        "id": "flexContainer",
        "termo": "contêiner flexível",
        "categoria": "Papel no Flexbox",
        "traducao": "Elemento pai",
        "explicacao": "É o elemento que recebe display:flex e organiza seus filhos diretos.",
        "erroComum": "Aplicar propriedades de alinhamento no filho em vez do pai não produz o resultado esperado.",
        "linguagem": "css",
        "exercicio": "FE05"
      },
      {
        "id": "flexItem",
        "termo": "item flexível",
        "categoria": "Papel no Flexbox",
        "traducao": "Filho direto",
        "explicacao": "É cada filho direto organizado pelo contêiner Flexbox.",
        "erroComum": "Elementos internos mais profundos não viram itens do mesmo contêiner automaticamente.",
        "linguagem": "css",
        "exercicio": "FE05"
      },
      {
        "id": "displayFlex",
        "termo": "display: flex",
        "categoria": "Declaração CSS",
        "traducao": "Ativar Flexbox",
        "explicacao": "Transforma os filhos diretos em itens flexíveis.",
        "erroComum": "Escrever flex sem display ou no seletor errado não ativa o layout.",
        "linguagem": "css",
        "exercicio": "FE05"
      },
      {
        "id": "justifyContent",
        "termo": "justify-content",
        "categoria": "Propriedade Flexbox",
        "traducao": "Alinhamento no eixo principal",
        "explicacao": "Distribui os itens ao longo do eixo principal.",
        "erroComum": "O eixo principal muda quando flex-direction muda.",
        "linguagem": "css",
        "exercicio": "FE05"
      },
      {
        "id": "alignItems",
        "termo": "align-items",
        "categoria": "Propriedade Flexbox",
        "traducao": "Alinhamento no eixo transversal",
        "explicacao": "Alinha itens no eixo perpendicular ao principal.",
        "erroComum": "Confundir com justify-content gera alinhamento no eixo errado.",
        "linguagem": "css",
        "exercicio": "FE05"
      },
      {
        "id": "flexWrap",
        "termo": "flex-wrap",
        "categoria": "Propriedade Flexbox",
        "traducao": "Quebra de linha",
        "explicacao": "Permite que itens passem para novas linhas quando falta espaço.",
        "erroComum": "Sem wrap, os itens podem encolher demais ou causar overflow.",
        "linguagem": "css",
        "exercicio": "FE05"
      },
      {
        "id": "gap",
        "termo": "gap",
        "categoria": "Propriedade de layout",
        "traducao": "Espaço entre itens",
        "explicacao": "Cria espaçamento uniforme entre itens de Flexbox ou Grid.",
        "erroComum": "Usar margens diferentes em cada item pode duplicar espaço nas bordas.",
        "linguagem": "css",
        "exercicio": "FE05"
      },
      {
        "id": "flexGrow",
        "termo": "flex-grow",
        "categoria": "Propriedade do item",
        "traducao": "Capacidade de crescer",
        "explicacao": "Define quanto um item pode ocupar do espaço livre.",
        "erroComum": "Valor alto não define largura fixa; ele distribui espaço restante.",
        "linguagem": "css",
        "exercicio": "FE05"
      },
      {
        "id": "flexBasis",
        "termo": "flex-basis",
        "categoria": "Propriedade do item",
        "traducao": "Tamanho-base",
        "explicacao": "Define o tamanho inicial considerado antes de crescer ou encolher.",
        "erroComum": "Confundir com width sem considerar flex-grow e flex-shrink causa surpresa.",
        "linguagem": "css",
        "exercicio": "FE05"
      },
      {
        "id": "flexDirection",
        "termo": "flex-direction",
        "categoria": "Propriedade Flexbox",
        "traducao": "Direção dos itens",
        "explicacao": "Define se o eixo principal segue linha ou coluna.",
        "erroComum": "Ao mudar para column, justify-content passa a atuar verticalmente.",
        "linguagem": "css",
        "exercicio": "FE05"
      },
      {
        "id": "marginAuto",
        "termo": "margin-top: auto",
        "categoria": "Técnica Flexbox",
        "traducao": "Empurrar até o final",
        "explicacao": "Consome o espaço livre disponível e mantém um bloco na base de um cartão flexível.",
        "erroComum": "Só funciona como esperado quando o pai organiza os filhos com Flexbox.",
        "linguagem": "css",
        "exercicio": "FE05"
      },
      {
        "id": "ariaControls",
        "termo": "aria-controls",
        "categoria": "Atributo de acessibilidade",
        "traducao": "Controla a região",
        "explicacao": "Relaciona um botão ao id da região cujo estado ele altera.",
        "erroComum": "O valor precisa apontar para um id existente.",
        "linguagem": "html",
        "exercicio": "FE05"
      },
      {
        "id": "ariaPressed",
        "termo": "aria-pressed",
        "categoria": "Atributo de acessibilidade",
        "traducao": "Estado de alternância",
        "explicacao": "Indica se o modo controlado pelo botão está ativo.",
        "erroComum": "Deixar o atributo desatualizado cria divergência com a interface.",
        "linguagem": "html/js",
        "exercicio": "FE05"
      },
      {
        "id": "querySelector",
        "termo": "querySelector",
        "categoria": "Método do DOM",
        "traducao": "Selecionar elemento",
        "explicacao": "Localiza botão, lista e status por seletores CSS.",
        "erroComum": "Seletor divergente retorna null e interrompe a interação.",
        "linguagem": "javascript",
        "exercicio": "FE05"
      },
      {
        "id": "classListToggle",
        "termo": "classList.toggle",
        "categoria": "Método do DOM",
        "traducao": "Alternar classe",
        "explicacao": "Ativa ou remove a classe que muda a direção do layout.",
        "erroComum": "A classe precisa existir no CSS e ser aplicada à região correta.",
        "linguagem": "javascript",
        "exercicio": "FE05"
      },
      {
        "id": "textContent",
        "termo": "textContent",
        "categoria": "Propriedade do DOM",
        "traducao": "Alterar texto",
        "explicacao": "Atualiza mensagens e rótulos com texto seguro.",
        "erroComum": "Usar innerHTML sem necessidade aumenta riscos e não é necessário para texto.",
        "linguagem": "javascript",
        "exercicio": "FE05"
      }
    ],
    "dicasProgressivas": {
      "html": [
        "Relembre: Flexbox organiza somente os filhos diretos do contêiner.",
        "Localize: identifique cada pai flexível e seus itens.",
        "Compare: aria-controls deve apontar para a lista realmente modificada.",
        "Estrutura parcial: contêiner > itens diretos; conteúdos internos podem formar outro Flexbox.",
        "Exemplo semelhante: organize uma equipe em cartões e um painel lateral."
      ],
      "css": [
        "Relembre: justify-content atua no eixo principal e align-items no transversal.",
        "Localize: confira display:flex antes das propriedades Flexbox.",
        "Compare: flex-basis define base; flex-grow distribui espaço livre; wrap permite novas linhas.",
        "Estrutura parcial: .lista { display:flex; flex-wrap:wrap; gap:...; } .item { flex: 1 1 ...; }.",
        "Exemplo semelhante: crie uma barra de ferramentas que quebra em telas estreitas."
      ],
      "js": [
        "Relembre: o JavaScript deve alternar uma classe já prevista no CSS.",
        "Localize: confira botão, lista, status e callback.",
        "Compare: classe, aria-pressed, texto do botão e status precisam representar o mesmo estado.",
        "Estrutura parcial: const vertical = lista.classList.toggle(\"vertical\");.",
        "Exemplo semelhante: alterne a direção de uma galeria com outro nome de classe."
      ]
    },
    "comportamento": {
      "titulo": "Teste comportamental do Flexbox",
      "instrucao": "Execute o preview e altere a organização dos cartões. A validação observa se a ação realmente modifica o layout.",
      "criterios": [
        {
          "id": "acao-principal",
          "tipo": "event",
          "evento": "click",
          "seletor": "#alternarDirecao",
          "rotulo": "Acionar o botão de direção"
        },
        {
          "id": "classe-layout",
          "tipo": "visualChanged",
          "seletor": "#listaServicos",
          "propriedades": [
            "flexDirection",
            "flexWrap",
            "gap",
            "justifyContent",
            "alignItems",
            "alignContent",
            "flexBasis",
            "width",
            "order",
            "padding"
          ],
          "rotulo": "O layout dos cartões realmente mudou"
        }
      ]
    },
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 6,
    "studentReferenceStripped": true,
    "codigo": "FE06",
    "titulo": "FE06 - Grid, media queries e responsividade",
    "nomeCurto": "Grid, media queries e responsividade",
    "tema": "Layout bidimensional e adaptação por breakpoint",
    "objetivo": "Construir um dashboard com CSS Grid, regiões nomeadas, colunas flexíveis e reorganização para computador, tablet e celular.",
    "produto": "Dashboard operacional responsivo com indicadores, tarefas, agenda, equipe e alertas.",
    "contextoProfissional": "Dashboards administrativos precisam organizar várias regiões simultaneamente e manter a leitura em telas diferentes. CSS Grid permite controlar linhas e colunas, enquanto media queries definem mudanças de composição sem alterar a ordem semântica.",
    "alteracaoObrigatoria": "Adicione um quinto indicador com dados próprios e crie uma nova área de pendências no dashboard. Defina a posição dessa área em telas amplas e sua ordem em telas pequenas, mantendo responsividade e sem usar larguras fixas que causem rolagem horizontal.",
    "retomadas": [
      "HTML semântico",
      "variáveis CSS",
      "Box Model",
      "Flexbox e componentes adaptáveis"
    ],
    "novos": [
      "display grid",
      "grid-template-columns",
      "grid-template-areas",
      "grid-area",
      "repeat",
      "minmax",
      "auto-fit",
      "media queries",
      "breakpoints responsivos"
    ],
    "pasta": "exercicio-06",
    "repositorio": "atividades-frontend-sub",
    "classroomUrl": "https://classroom.google.com/",
    "githubUrl": "https://github.com/",
    "tempoMinimoSegundos": 300,
    "ordemArquivos": [
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
    "linguagens": {
      "html": "html",
      "css": "css",
      "js": "js"
    },
    "passos": {
      "html": [
        {
          "titulo": "Cabeçalho e controle de densidade",
          "linhas": [
            1,
            22
          ],
          "explicacao": "A página conecta os arquivos, oferece salto ao dashboard e inclui um botão acessível que controla o modo compacto.",
          "detalhes": {
            "objetivo": "Preparar o dashboard e um botão acessível para alternar densidade.",
            "porque": "O controle visual precisa estar relacionado ao painel que ele modifica e comunicar seu estado.",
            "ordem": "O head conecta arquivos; o link de salto antecede o header; o botão aponta para o dashboard.",
            "erroComum": "aria-controls divergente ou id duplicado no painel.",
            "conferir": "Use teclado, ative o botão e confira aria-pressed e região controlada."
          },
          "termos": [
            "ariaPressed"
          ]
        },
        {
          "titulo": "Resumo e indicadores",
          "linhas": [
            24,
            56
          ],
          "explicacao": "A primeira região contém o status do layout e uma grade de indicadores que usa auto-fit e minmax.",
          "detalhes": {
            "objetivo": "Criar uma região de resumo e uma coleção de indicadores adaptáveis.",
            "porque": "O HTML preserva a ordem de leitura enquanto o Grid decide a distribuição visual.",
            "ordem": "A região de resumo contém status e, em seguida, a grade reúne cada indicador como item.",
            "erroComum": "Usar a posição visual como única forma de indicar importância.",
            "conferir": "Leia o HTML na ordem do código e confirme que a sequência faz sentido sem CSS."
          },
          "termos": [
            "gridContainer",
            "gridItem"
          ]
        },
        {
          "titulo": "Regiões do dashboard",
          "linhas": [
            58,
            104
          ],
          "explicacao": "Tarefas, agenda, equipe e alertas são regiões semânticas independentes posicionadas por grid-template-areas.",
          "detalhes": {
            "objetivo": "Separar tarefas, agenda, equipe e alertas em regiões semânticas.",
            "porque": "Cada região poderá receber grid-area sem perder seu significado ou ordem de leitura.",
            "ordem": "As regiões aparecem em ordem lógica no HTML e recebem classes para o mapa visual.",
            "erroComum": "Nome da classe ou área divergir do declarado no CSS.",
            "conferir": "Crie uma tabela relacionando classe HTML, grid-area do item e nome no grid-template-areas."
          },
          "termos": [
            "semanticRegion",
            "gridArea"
          ]
        },
        {
          "titulo": "Rodapé",
          "linhas": [
            106,
            110
          ],
          "explicacao": "O rodapé identifica exercício, disciplina e turma.",
          "detalhes": {
            "objetivo": "Encerrar e identificar o exercício sem interferir no Grid principal.",
            "porque": "O rodapé pertence ao documento, não ao mapa interno do dashboard.",
            "ordem": "Depois do main e de todas as regiões, o footer finaliza o body.",
            "erroComum": "Inserir footer dentro do grid quando ele não faz parte do mapa planejado.",
            "conferir": "Confirme no DOM que o footer é irmão do main, não filho do dashboard."
          },
          "termos": [
            "semanticRegion"
          ]
        }
      ],
      "css": [
        {
          "titulo": "Base e cabeçalho em Grid",
          "linhas": [
            1,
            113
          ],
          "explicacao": "Variáveis, Box Model e um cabeçalho bidimensional preparam a composição.",
          "detalhes": {
            "objetivo": "Preparar variáveis, Box Model e primeiro Grid bidimensional.",
            "porque": "O cabeçalho demonstra alinhamento em linhas e colunas antes do dashboard maior.",
            "ordem": "A base visual é declarada e o cabeçalho ativa grid com colunas e alinhamentos.",
            "erroComum": "Usar propriedades de item no contêiner ou deixar conteúdo longo sem min-width:0.",
            "conferir": "Ative o overlay de Grid no DevTools e observe linhas e colunas do cabeçalho."
          },
          "termos": [
            "gridContainer",
            "gridItem",
            "gridTemplateColumns",
            "gap"
          ]
        },
        {
          "titulo": "Mapa principal do dashboard",
          "linhas": [
            114,
            144
          ],
          "explicacao": "grid-template-columns e grid-template-areas definem o mapa de regiões em telas amplas.",
          "detalhes": {
            "objetivo": "Definir colunas e áreas nomeadas para telas amplas.",
            "porque": "grid-template-areas torna a composição legível e relaciona nomes a regiões.",
            "ordem": "O contêiner define colunas, gap e mapa; cada item associa seu grid-area.",
            "erroComum": "Linhas do mapa com quantidade diferente de células ou área não retangular.",
            "conferir": "Leia o mapa como uma tabela e localize cada nome no layout renderizado."
          },
          "termos": [
            "gridTemplateColumns",
            "gridTemplateAreas",
            "gridArea"
          ]
        },
        {
          "titulo": "Grades internas",
          "linhas": [
            145,
            281
          ],
          "explicacao": "repeat, auto-fit e minmax tornam indicadores e componentes internos adaptáveis.",
          "detalhes": {
            "objetivo": "Usar repeat, auto-fit e minmax em coleções internas.",
            "porque": "As colunas se ajustam automaticamente conforme espaço e quantidade de conteúdo.",
            "ordem": "Cada subgrade ativa display:grid e define faixas repetidas e limites de tamanho.",
            "erroComum": "Mínimo maior que a viewport ou repeat aplicado no seletor errado.",
            "conferir": "Redimensione a página e conte quantas colunas cabem sem corte."
          },
          "termos": [
            "repeat",
            "autoFit",
            "minmax",
            "gap"
          ]
        },
        {
          "titulo": "Breakpoints responsivos",
          "linhas": [
            295,
            333
          ],
          "explicacao": "As media queries redefinem colunas e áreas para tablet e celular, sem mudar a ordem do HTML.",
          "detalhes": {
            "objetivo": "Reorganizar colunas e áreas para tablet e celular.",
            "porque": "O mesmo mapa amplo não cabe em telas estreitas, mas a ordem semântica pode ser preservada.",
            "ordem": "Breakpoints posteriores redefinem template-columns e template-areas conforme a largura.",
            "erroComum": "Mudar colunas sem atualizar áreas ou deixar nome ausente no novo mapa.",
            "conferir": "Compare os mapas de desktop, tablet e celular e confira todas as regiões."
          },
          "termos": [
            "mediaQuery",
            "gridTemplateAreas",
            "gridTemplateColumns"
          ]
        }
      ],
      "js": [
        {
          "titulo": "Elementos controlados",
          "linhas": [
            1,
            3
          ],
          "explicacao": "querySelector localiza botão, dashboard e região de status.",
          "detalhes": {
            "objetivo": "Localizar botão, dashboard e status da densidade.",
            "porque": "O script precisa de referências válidas para sincronizar estado e mensagem.",
            "ordem": "querySelector guarda os três elementos antes do evento.",
            "erroComum": "Selecionar um elemento interno em vez do contêiner que possui a classe compacta.",
            "conferir": "Confira seletores e execute no console document.querySelector para cada um."
          },
          "termos": [
            "querySelector"
          ]
        },
        {
          "titulo": "Modo compacto",
          "linhas": [
            5,
            15
          ],
          "explicacao": "O clique alterna uma classe, atualiza aria-pressed, texto do botão e feedback acessível.",
          "detalhes": {
            "objetivo": "Alternar classe, estado acessível e textos usando um booleano real.",
            "porque": "A densidade muda visualmente, mas o botão também precisa informar se o modo está ativo.",
            "ordem": "O click alterna a classe; toggle retorna true/false; esse valor atualiza atributo, rótulo e mensagem.",
            "erroComum": "Comparar booleano com string ou atualizar textos antes de obter o novo estado.",
            "conferir": "Clique duas vezes e acompanhe classe, booleano retornado, aria-pressed e mensagem."
          },
          "termos": [
            "classListToggle",
            "ariaPressed",
            "boolean"
          ]
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 06 - Grid, media queries e responsividade",
      "descricao": "Nesta atividade, vamos construir um dashboard operacional com CSS Grid, regiões nomeadas, colunas flexíveis e breakpoints para computador, tablet e celular.\n\nAlteração obrigatória: adicione um quinto indicador e uma nova área de pendências, definindo sua posição em telas amplas e sua ordem em telas pequenas.\n\nTeste o layout em aproximadamente 1180 px, 900 px, 620 px e 390 px, use o modo compacto e confirme que não existe rolagem horizontal.\n\nEntrega: anexar o link do repositório do GitHub."
    },
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false,
      "aceitarEquivalencias": true,
      "htmlEstrutura": {
        "idsObrigatorios": [
          "alternarDensidade",
          "dashboard",
          "statusLayout",
          "resumo",
          "tarefas",
          "agenda",
          "equipe",
          "alertas"
        ],
        "tagsMinimas": {
          "header": 1,
          "main": 1,
          "section": 1,
          "article": 1,
          "aside": 1,
          "footer": 1,
          "button": 1,
          "h1": 1,
          "h2": 1
        },
        "referenciasArquivos": {
          "css": "estilo.css",
          "js": "script.js"
        },
        "seletoresObrigatorios": [
          {
            "selector": "#alternarDensidade[aria-pressed][aria-controls=\"dashboard\"]",
            "message": "Inclua o botão com aria-pressed e aria-controls."
          },
          {
            "selector": "#resumo .indicador",
            "message": "Mantenha a grade de indicadores identificável."
          }
        ],
        "atributosObrigatorios": []
      },
      "cssGridResponsivo": {
        "minimoDisplaysGrid": 2,
        "exigirTemplateColumns": true,
        "exigirTemplateAreas": false,
        "minimoGridAreas": 0,
        "exigirGap": true,
        "exigirMinmax": false,
        "exigirRepeat": false,
        "exigirAutoFitOuFill": false,
        "minimoMediaQueries": 1,
        "proibir": []
      },
      "jsComportamento": [
        {
          "event": "click",
          "triggerId": "alternarDensidade",
          "acoes": [
            {
              "type": "classToggle",
              "targetId": "dashboard"
            },
            {
              "type": "setAttribute",
              "targetId": "alternarDensidade",
              "attribute": "aria-pressed"
            },
            {
              "type": "text",
              "targetId": "alternarDensidade"
            },
            {
              "type": "text",
              "targetId": "statusLayout"
            }
          ]
        }
      ],
      "politica": "conceitos_essenciais"
    },
    "glossario": [
      {
        "id": "gridContainer",
        "termo": "contêiner Grid",
        "categoria": "Papel no CSS Grid",
        "traducao": "Elemento pai bidimensional",
        "explicacao": "Recebe display:grid e organiza itens em linhas e colunas.",
        "erroComum": "Propriedades grid no elemento errado não afetam os filhos esperados.",
        "linguagem": "css",
        "exercicio": "FE06"
      },
      {
        "id": "gridItem",
        "termo": "item de Grid",
        "categoria": "Papel no CSS Grid",
        "traducao": "Filho direto",
        "explicacao": "É posicionado nas linhas, colunas ou áreas definidas pelo contêiner.",
        "erroComum": "Um neto não participa diretamente do Grid do avô.",
        "linguagem": "css",
        "exercicio": "FE06"
      },
      {
        "id": "gridTemplateColumns",
        "termo": "grid-template-columns",
        "categoria": "Propriedade Grid",
        "traducao": "Modelo de colunas",
        "explicacao": "Define quantidade e tamanho das colunas.",
        "erroComum": "Colunas fixas largas podem causar overflow em telas pequenas.",
        "linguagem": "css",
        "exercicio": "FE06"
      },
      {
        "id": "gridTemplateAreas",
        "termo": "grid-template-areas",
        "categoria": "Propriedade Grid",
        "traducao": "Mapa de áreas",
        "explicacao": "Desenha um mapa textual para posicionar regiões nomeadas.",
        "erroComum": "Cada linha precisa ter o mesmo número de células e áreas retangulares.",
        "linguagem": "css",
        "exercicio": "FE06"
      },
      {
        "id": "gridArea",
        "termo": "grid-area",
        "categoria": "Propriedade do item",
        "traducao": "Nome da área",
        "explicacao": "Liga um item a uma área declarada no mapa do contêiner.",
        "erroComum": "Nome divergente faz o item usar posicionamento automático.",
        "linguagem": "css",
        "exercicio": "FE06"
      },
      {
        "id": "repeat",
        "termo": "repeat()",
        "categoria": "Função CSS",
        "traducao": "Repetir faixas",
        "explicacao": "Evita repetir manualmente a mesma definição de coluna ou linha.",
        "erroComum": "Quantidade ou faixa inválida torna a declaração inutilizável.",
        "linguagem": "css",
        "exercicio": "FE06"
      },
      {
        "id": "autoFit",
        "termo": "auto-fit",
        "categoria": "Palavra-chave Grid",
        "traducao": "Ajuste automático",
        "explicacao": "Cria a quantidade de colunas que couber na largura disponível.",
        "erroComum": "Sem minmax, os itens podem ficar pequenos demais ou não se adaptar bem.",
        "linguagem": "css",
        "exercicio": "FE06"
      },
      {
        "id": "minmax",
        "termo": "minmax()",
        "categoria": "Função CSS",
        "traducao": "Limite mínimo e máximo",
        "explicacao": "Define uma faixa que pode crescer sem ficar menor que o mínimo.",
        "erroComum": "Mínimo maior que a tela pode continuar causando overflow.",
        "linguagem": "css",
        "exercicio": "FE06"
      },
      {
        "id": "gap",
        "termo": "gap",
        "categoria": "Propriedade de layout",
        "traducao": "Espaço entre células",
        "explicacao": "Cria distância uniforme entre linhas e colunas.",
        "erroComum": "Somar margens desnecessárias pode aumentar demais os espaços.",
        "linguagem": "css",
        "exercicio": "FE06"
      },
      {
        "id": "mediaQuery",
        "termo": "@media",
        "categoria": "Regra condicional CSS",
        "traducao": "Consulta de tela",
        "explicacao": "Troca o mapa e as colunas conforme a largura disponível.",
        "erroComum": "Apenas declarar breakpoint sem reorganizar as áreas não resolve o layout.",
        "linguagem": "css",
        "exercicio": "FE06"
      },
      {
        "id": "semanticRegion",
        "termo": "section/aside",
        "categoria": "Elementos semânticos",
        "traducao": "Regiões de conteúdo",
        "explicacao": "Mantêm significado no HTML enquanto o CSS muda apenas a posição visual.",
        "erroComum": "Alterar a ordem visual sem considerar a ordem de leitura pode confundir teclado e leitor de tela.",
        "linguagem": "html",
        "exercicio": "FE06"
      },
      {
        "id": "ariaPressed",
        "termo": "aria-pressed",
        "categoria": "Atributo de acessibilidade",
        "traducao": "Estado do modo compacto",
        "explicacao": "Comunica se o botão de densidade está ativo.",
        "erroComum": "O atributo precisa acompanhar a classe compacta.",
        "linguagem": "html/js",
        "exercicio": "FE06"
      },
      {
        "id": "querySelector",
        "termo": "querySelector",
        "categoria": "Método do DOM",
        "traducao": "Selecionar elemento",
        "explicacao": "Localiza botão, dashboard e região de status.",
        "erroComum": "Se um id ou classe divergir, o método retorna null.",
        "linguagem": "javascript",
        "exercicio": "FE06"
      },
      {
        "id": "classListToggle",
        "termo": "classList.toggle",
        "categoria": "Método do DOM",
        "traducao": "Alternar classe",
        "explicacao": "Liga ou desliga o modo compacto no dashboard.",
        "erroComum": "A classe precisa ter regras correspondentes no CSS.",
        "linguagem": "javascript",
        "exercicio": "FE06"
      },
      {
        "id": "boolean",
        "termo": "booleano",
        "categoria": "Tipo lógico",
        "traducao": "Verdadeiro ou falso",
        "explicacao": "Representa o estado retornado por classList.toggle e orienta os textos do controle.",
        "erroComum": "Comparar com as strings \"true\" e \"false\" é diferente de usar booleanos reais.",
        "linguagem": "javascript",
        "exercicio": "FE06"
      }
    ],
    "dicasProgressivas": {
      "html": [
        "Relembre: a ordem do HTML deve fazer sentido mesmo quando o Grid muda posições.",
        "Localize: associe cada região semântica à classe usada no CSS.",
        "Compare: o botão de densidade deve controlar o id correto.",
        "Estrutura parcial: <section class=\"regiao tarefas\" ...>...</section>.",
        "Exemplo semelhante: estruture um painel escolar com resumo, agenda, avisos e equipe."
      ],
      "css": [
        "Relembre: Grid trabalha com linhas e colunas; áreas nomeadas desenham um mapa.",
        "Localize: confira contêiner, grid-area de cada item e todos os mapas responsivos.",
        "Compare: cada linha do grid-template-areas precisa ter a mesma quantidade de células.",
        "Estrutura parcial: grid-template-columns: ...; grid-template-areas: \"a b\" \"c b\";.",
        "Exemplo semelhante: use repeat(auto-fit, minmax(...)) em uma grade de indicadores diferente."
      ],
      "js": [
        "Relembre: toggle devolve um booleano com o novo estado.",
        "Localize: confira botão, dashboard e status.",
        "Compare: o CSS deve possuir regras para a classe compacta aplicada.",
        "Estrutura parcial: const compacto = dashboard.classList.toggle(\"compacto\");.",
        "Exemplo semelhante: alterne um modo espaçoso em um painel com outra classe."
      ]
    },
    "comportamento": {
      "titulo": "Teste comportamental do Grid",
      "instrucao": "Execute o preview e altere a densidade do dashboard. A validação exige apenas uma mudança real de layout após a ação.",
      "criterios": [
        {
          "id": "acao-principal",
          "tipo": "event",
          "evento": "click",
          "seletor": "#alternarDensidade",
          "rotulo": "Acionar o botão de densidade"
        },
        {
          "id": "classe-layout",
          "tipo": "visualChanged",
          "seletor": "#dashboard",
          "propriedades": [
            "gap",
            "padding",
            "gridTemplateColumns",
            "gridTemplateRows",
            "gridTemplateAreas",
            "gridAutoColumns",
            "gridAutoRows",
            "width"
          ],
          "rotulo": "O dashboard realmente mudou de densidade"
        }
      ]
    },
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 7,
    "studentReferenceStripped": true,
    "codigo": "FE07",
    "titulo": "FE07 - Do algoritmo ao código: Python e JavaScript",
    "nomeCurto": "Do algoritmo ao código: Python e JavaScript",
    "tema": "Entrada, processamento e saída em diferentes linguagens",
    "objetivo": "Representar um algoritmo sequencial em pseudocódigo e executá-lo com resultados equivalentes no navegador e no terminal Python.",
    "produto": "Calculadora de orçamento rápido com uma versão Web em JavaScript e uma versão de terminal em Python.",
    "contextoProfissional": "Equipes transformam regras de negócio em algoritmos antes de escolher a interface ou a linguagem. O mesmo cálculo pode atender uma página Web, um script interno ou futuramente uma API.",
    "alteracaoObrigatoria": "Altere a taxa operacional de 10% para 12% nas três representações: algoritmo.txt, script.js e main.py. Depois personalize o nome do serviço exibido na interface sem remover a estrutura Entrada -> Processamento -> Saída.",
    "retomadas": [
      "HTML semântico e formulários",
      "CSS responsivo",
      "seleção de elementos e evento de envio"
    ],
    "novos": [
      "algoritmo",
      "pseudocódigo",
      "entrada",
      "processamento",
      "saída",
      "input() em Python",
      "Number() em JavaScript",
      "print() e textContent",
      "comparação entre linguagens"
    ],
    "pasta": "exercicio-07",
    "repositorio": "atividades-frontend-sub",
    "classroomUrl": "https://classroom.google.com/",
    "githubUrl": "https://github.com/",
    "tempoMinimoSegundos": 300,
    "ordemArquivos": [
      "pseudocodigo",
      "html",
      "css",
      "js",
      "python",
      "readme"
    ],
    "arquivos": {
      "pseudocodigo": "// Desenvolva aqui a atividade solicitada.\n",
      "html": "<!doctype html>\n<html lang=\"pt-BR\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Atividade</title>\n</head>\n<body>\n  <main>\n    <!-- Desenvolva aqui a estrutura solicitada. -->\n  </main>\n</body>\n</html>\n",
      "css": "/* Desenvolva aqui os estilos solicitados. */\n",
      "js": "'use strict';\n// Desenvolva aqui o comportamento solicitado.\n",
      "python": "# Desenvolva aqui a solução solicitada.\n",
      "readme": "# FE07 - Do algoritmo ao código: Python e JavaScript\n\n## Objetivo\n\nRepresentar e executar o mesmo algoritmo sequencial em pseudocódigo, JavaScript e Python, identificando claramente entrada, processamento e saída.\n\n## Arquivos\n\n- `algoritmo.txt`: descrição do algoritmo em pseudocódigo;\n- `index.html`: interface de entrada e saída no navegador;\n- `estilo.css`: apresentação responsiva;\n- `script.js`: execução do algoritmo no navegador;\n- `main.py`: execução equivalente no terminal Python.\n\n\n## Entrada, Processamento e Saída\n\n- **Entrada:** nome do cliente, horas previstas e valor por hora.\n- **Processamento:** cálculo do subtotal, da taxa operacional e do total.\n- **Saída:** apresentação dos resultados no navegador e no terminal.\n\n## Executar a versão Web\n\nAbra `index.html` no navegador ou utilize uma extensão de servidor local no VS Code.\n\n## Executar a versão Python\n\nNo terminal aberto dentro da pasta `exercicio-07`, execute:\n\n```bash\npython main.py\n```\n\nUse os mesmos dados nas duas versões e compare os resultados.\n"
    },
    "nomesArquivos": {
      "pseudocodigo": "algoritmo.txt",
      "html": "index.html",
      "css": "estilo.css",
      "js": "script.js",
      "python": "main.py",
      "readme": "README.md"
    },
    "linguagens": {
      "pseudocodigo": "text",
      "html": "html",
      "css": "css",
      "js": "js",
      "python": "python",
      "readme": "markdown"
    },
    "passos": {
      "pseudocodigo": [
        {
          "titulo": "Início e entradas",
          "linhas": [
            1,
            5
          ],
          "explicacao": "O pseudocódigo começa, solicita três dados e usa nomes que revelam o significado de cada informação.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de pseudocodigo dentro do exercício.",
            "porque": "Este trecho existe para manter a sequência entre estrutura, comportamento, teste e entrega.",
            "ordem": "Leia de cima para baixo e acompanhe como cada linha prepara a próxima ação.",
            "erroComum": "Compare nomes, fechamento, pontuação e posição das instruções antes de validar.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "entrada"
          ]
        },
        {
          "titulo": "Processamento sequencial",
          "linhas": [
            6,
            8
          ],
          "explicacao": "As três atribuições representam as regras do orçamento. Cada resultado é usado pela instrução seguinte.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de pseudocodigo dentro do exercício.",
            "porque": "Este trecho existe para manter a sequência entre estrutura, comportamento, teste e entrega.",
            "ordem": "Leia de cima para baixo e acompanhe como cada linha prepara a próxima ação.",
            "erroComum": "Compare nomes, fechamento, pontuação e posição das instruções antes de validar.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "processamento"
          ]
        },
        {
          "titulo": "Saídas e encerramento",
          "linhas": [
            10,
            14
          ],
          "explicacao": "A parte final apresenta os valores produzidos e encerra o algoritmo.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de pseudocodigo dentro do exercício.",
            "porque": "Este trecho existe para manter a sequência entre estrutura, comportamento, teste e entrega.",
            "ordem": "Leia de cima para baixo e acompanhe como cada linha prepara a próxima ação.",
            "erroComum": "Compare nomes, fechamento, pontuação e posição das instruções antes de validar.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "saida"
          ]
        }
      ],
      "html": [
        {
          "titulo": "Documento e apresentação",
          "linhas": [
            1,
            18
          ],
          "explicacao": "O documento conecta CSS e JavaScript e apresenta a proposta de comparar linguagens.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de html dentro do exercício.",
            "porque": "O HTML define a estrutura que o CSS estiliza e o JavaScript localiza.",
            "ordem": "O navegador lê a declaração, o head e depois constrói os elementos do body.",
            "erroComum": "Tag não fechada, id divergente ou caminho de arquivo incorreto.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "doctype",
            "lang"
          ]
        },
        {
          "titulo": "Entradas do algoritmo",
          "linhas": [
            20,
            41
          ],
          "explicacao": "O formulário oferece campos associados a labels e utiliza tipos numéricos coerentes.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de html dentro do exercício.",
            "porque": "O HTML define a estrutura que o CSS estiliza e o JavaScript localiza.",
            "ordem": "O navegador lê a declaração, o head e depois constrói os elementos do body.",
            "erroComum": "Tag não fechada, id divergente ou caminho de arquivo incorreto.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "id"
          ]
        },
        {
          "titulo": "Processamento e saída",
          "linhas": [
            44,
            74
          ],
          "explicacao": "A página explica as regras e reserva uma região de status para o resultado calculado.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de html dentro do exercício.",
            "porque": "O HTML define a estrutura que o CSS estiliza e o JavaScript localiza.",
            "ordem": "O navegador lê a declaração, o head e depois constrói os elementos do body.",
            "erroComum": "Tag não fechada, id divergente ou caminho de arquivo incorreto.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "ariaLive"
          ]
        }
      ],
      "css": [
        {
          "titulo": "Variáveis e base visual",
          "linhas": [
            1,
            81
          ],
          "explicacao": "Variáveis, Box Model e estilos globais criam uma base consistente.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de css dentro do exercício.",
            "porque": "O CSS transforma a estrutura HTML em uma interface legível e responsiva.",
            "ordem": "A cascata combina regras gerais, componentes e ajustes de tela pequena.",
            "erroComum": "Seletor sem correspondência, propriedade inválida ou largura fixa causando overflow.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "root",
            "boxSizing"
          ]
        },
        {
          "titulo": "Layout e componentes",
          "linhas": [
            82,
            178
          ],
          "explicacao": "Grid organiza os painéis; formulário e resultado recebem estilos próprios.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de css dentro do exercício.",
            "porque": "O CSS transforma a estrutura HTML em uma interface legível e responsiva.",
            "ordem": "A cascata combina regras gerais, componentes e ajustes de tela pequena.",
            "erroComum": "Seletor sem correspondência, propriedade inválida ou largura fixa causando overflow.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "grid"
          ]
        },
        {
          "titulo": "Responsividade",
          "linhas": [
            180,
            203
          ],
          "explicacao": "Os breakpoints transformam o layout em uma coluna e ajustam espaços para celular.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de css dentro do exercício.",
            "porque": "O CSS transforma a estrutura HTML em uma interface legível e responsiva.",
            "ordem": "A cascata combina regras gerais, componentes e ajustes de tela pequena.",
            "erroComum": "Seletor sem correspondência, propriedade inválida ou largura fixa causando overflow.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "media"
          ]
        }
      ],
      "js": [
        {
          "titulo": "Referências da interface",
          "linhas": [
            1,
            6
          ],
          "explicacao": "querySelector guarda referências para o formulário, os campos e a região de saída.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de js dentro do exercício.",
            "porque": "Este bloco conecta uma ação do usuário ao comportamento visível da página.",
            "ordem": "Primeiro os elementos são localizados; depois o evento é registrado; por último o callback altera a interface.",
            "erroComum": "Executar a alteração fora do evento ou usar um seletor que não encontra o elemento.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "querySelector"
          ]
        },
        {
          "titulo": "Entrada",
          "linhas": [
            7,
            14
          ],
          "explicacao": "O envio é interceptado e os valores são lidos. Number converte textos numéricos em números.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de js dentro do exercício.",
            "porque": "Este bloco conecta uma ação do usuário ao comportamento visível da página.",
            "ordem": "Primeiro os elementos são localizados; depois o evento é registrado; por último o callback altera a interface.",
            "erroComum": "Executar a alteração fora do evento ou usar um seletor que não encontra o elemento.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "value",
            "Number",
            "preventDefault"
          ]
        },
        {
          "titulo": "Processamento",
          "linhas": [
            15,
            19
          ],
          "explicacao": "As regras do pseudocódigo aparecem na mesma ordem e produzem subtotal, taxa e total.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de js dentro do exercício.",
            "porque": "Este bloco conecta uma ação do usuário ao comportamento visível da página.",
            "ordem": "Primeiro os elementos são localizados; depois o evento é registrado; por último o callback altera a interface.",
            "erroComum": "Executar a alteração fora do evento ou usar um seletor que não encontra o elemento.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "Number"
          ]
        },
        {
          "titulo": "Saída segura",
          "linhas": [
            20,
            29
          ],
          "explicacao": "textContent apresenta o resultado sem interpretar conteúdo do usuário como HTML.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de js dentro do exercício.",
            "porque": "Este bloco conecta uma ação do usuário ao comportamento visível da página.",
            "ordem": "Primeiro os elementos são localizados; depois o evento é registrado; por último o callback altera a interface.",
            "erroComum": "Executar a alteração fora do evento ou usar um seletor que não encontra o elemento.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "textContent"
          ]
        }
      ],
      "python": [
        {
          "titulo": "Cabeçalho e entrada",
          "linhas": [
            1,
            8
          ],
          "explicacao": "input recebe textos do terminal; float converte horas e valor para números decimais.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de python dentro do exercício.",
            "porque": "Este bloco representa a mesma sequência de entrada, processamento e saída em Python.",
            "ordem": "O interpretador executa as linhas em ordem: pergunta, conversão, cálculo e impressão.",
            "erroComum": "Esquecer conversão, usar vírgula decimal ou digitar uma variável com nome diferente.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "input",
            "strip",
            "float"
          ]
        },
        {
          "titulo": "Processamento equivalente",
          "linhas": [
            9,
            13
          ],
          "explicacao": "As mesmas três regras usadas no JavaScript são escritas com a sintaxe do Python.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de python dentro do exercício.",
            "porque": "Este bloco representa a mesma sequência de entrada, processamento e saída em Python.",
            "ordem": "O interpretador executa as linhas em ordem: pergunta, conversão, cálculo e impressão.",
            "erroComum": "Esquecer conversão, usar vírgula decimal ou digitar uma variável com nome diferente.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "float"
          ]
        },
        {
          "titulo": "Saída formatada",
          "linhas": [
            14,
            19
          ],
          "explicacao": "print e f-strings mostram os resultados com duas casas decimais.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de python dentro do exercício.",
            "porque": "Este bloco representa a mesma sequência de entrada, processamento e saída em Python.",
            "ordem": "O interpretador executa as linhas em ordem: pergunta, conversão, cálculo e impressão.",
            "erroComum": "Esquecer conversão, usar vírgula decimal ou digitar uma variável com nome diferente.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "print",
            "fstring"
          ]
        }
      ],
      "readme": [
        {
          "titulo": "Objetivo, arquivos e etapas",
          "linhas": [
            1,
            24
          ],
          "explicacao": "A documentação explica o objetivo, a função de cada arquivo e identifica entrada, processamento e saída.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de readme dentro do exercício.",
            "porque": "Este trecho existe para manter a sequência entre estrutura, comportamento, teste e entrega.",
            "ordem": "Leia de cima para baixo e acompanhe como cada linha prepara a próxima ação.",
            "erroComum": "Compare nomes, fechamento, pontuação e posição das instruções antes de validar.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "heading",
            "code"
          ]
        },
        {
          "titulo": "Como executar",
          "linhas": [
            25,
            34
          ],
          "explicacao": "As duas formas de execução são registradas para que outra pessoa consiga reproduzir os testes.",
          "detalhes": {
            "objetivo": "Compreender a função deste bloco de readme dentro do exercício.",
            "porque": "Este trecho existe para manter a sequência entre estrutura, comportamento, teste e entrega.",
            "ordem": "Leia de cima para baixo e acompanhe como cada linha prepara a próxima ação.",
            "erroComum": "Compare nomes, fechamento, pontuação e posição das instruções antes de validar.",
            "conferir": "Localize o trecho destacado, observe o resultado e explique com suas palavras o que mudou."
          },
          "termos": [
            "code"
          ]
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 07 - Do algoritmo ao código: Python e JavaScript",
      "descricao": "Nesta atividade, vamos representar um orçamento em pseudocódigo e executar a mesma sequência em JavaScript e Python.\n\nAlteração obrigatória: troque a taxa operacional de 10% para 12% nas três representações e personalize o nome do serviço.\n\nTeste os mesmos valores no navegador e no terminal Python e confirme resultados equivalentes.\n\nEntrega: anexar o link do repositório do GitHub."
    },
    "permitirBase": {
      "pseudocodigo": false,
      "html": false,
      "css": false,
      "js": false,
      "python": false,
      "readme": false
    },
    "validacao": {
      "strictDeclarations": false,
      "aceitarEquivalencias": true,
      "algoritmoSequencialPseudocodigo": {
        "minimoEntradas": 2,
        "minimoSaidas": 2,
        "exigirInicioFim": false,
        "exigirTaxa": true,
        "minimoAtribuicoes": 2
      },
      "htmlEstrutura": {
        "idsObrigatorios": [
          "simulador",
          "formularioOrcamento",
          "nomeCliente",
          "horasPrevistas",
          "valorHora",
          "resultadoOrcamento"
        ],
        "tagsMinimas": {
          "header": 1,
          "main": 1,
          "section": 1,
          "aside": 1,
          "footer": 1,
          "form": 1,
          "input": 3,
          "label": 3,
          "button": 1,
          "h1": 1,
          "h2": 1,
          "ol": 1
        },
        "referenciasArquivos": {
          "css": "estilo.css",
          "js": "script.js"
        },
        "rotulosAssociados": [
          "nomeCliente",
          "horasPrevistas",
          "valorHora"
        ],
        "seletoresObrigatorios": [
          {
            "selector": "#formularioOrcamento button[type=\"submit\"]",
            "message": "Inclua um botão de envio dentro do formulário."
          },
          {
            "selector": "#resultadoOrcamento[role=\"status\"]",
            "message": "Mantenha uma região de status para a saída."
          }
        ],
        "atributosObrigatorios": [
          {
            "selector": "#nomeCliente",
            "attribute": "required"
          },
          {
            "selector": "#horasPrevistas",
            "attribute": "type",
            "value": "number"
          },
          {
            "selector": "#valorHora",
            "attribute": "type",
            "value": "number"
          }
        ],
        "proibirTabindexPositivo": false
      },
      "cssEstrutura": {
        "minimoVariaveis": 3,
        "minimoUsosVar": 3,
        "tiposSeletores": [
          "elemento",
          "classe",
          "pseudoclasse"
        ],
        "exigirBoxSizing": true,
        "exigirBoxModelCompleto": false,
        "proibir": [],
        "minimoTiposSeletores": 2
      },
      "algoritmoSequencialJS": {
        "minimoLeiturasValue": 2,
        "minimoConversoesNumericas": 1,
        "exigirSubmit": true,
        "exigirPreventDefault": true,
        "exigirTaxa": true,
        "exigirSaidaSegura": true,
        "proibir": [
          "innerHTML",
          "eval(",
          "for(",
          "while(",
          " if(",
          "switch("
        ]
      },
      "algoritmoSequencialPython": {
        "minimoInputs": 2,
        "minimoConversoesNumericas": 1,
        "minimoPrints": 2,
        "exigirTaxa": true,
        "proibir": [
          "eval(",
          "exec(",
          " if ",
          "for ",
          "while ",
          "def ",
          "class "
        ]
      },
      "markdownEstrutura": {
        "codigoExercicio": "FE07",
        "minimoCaracteres": 60,
        "titulosObrigatorios": [],
        "arquivosObrigatorios": [
          "index.html",
          "script.js",
          "main.py"
        ],
        "conteudosObrigatorios": [
          "python main.py"
        ]
      },
      "politica": "conceitos_essenciais"
    },
    "glossario": [
      {
        "id": "doctype",
        "termo": "doctype",
        "categoria": "Declaração",
        "traducao": "Documento HTML",
        "explicacao": "Informa ao navegador que o arquivo utiliza HTML moderno.",
        "erroComum": "Esquecer ou alterar pode ativar modos antigos do navegador.",
        "linguagem": "html",
        "exercicio": "FE07"
      },
      {
        "id": "lang",
        "termo": "lang",
        "categoria": "Atributo",
        "traducao": "Idioma",
        "explicacao": "Indica que o conteúdo principal está em português do Brasil.",
        "erroComum": "Usar um idioma incorreto prejudica leitores de tela.",
        "linguagem": "html",
        "exercicio": "FE07"
      },
      {
        "id": "id",
        "termo": "id",
        "categoria": "Atributo",
        "traducao": "Identificador",
        "explicacao": "Cria um nome único para localizar um elemento no CSS ou JavaScript.",
        "erroComum": "Repetir o mesmo id ou escrever nomes diferentes quebra seletores.",
        "linguagem": "html",
        "exercicio": "FE07"
      },
      {
        "id": "ariaLive",
        "termo": "aria-live",
        "categoria": "Atributo de acessibilidade",
        "traducao": "Região viva",
        "explicacao": "Faz leitores de tela anunciarem mudanças no conteúdo.",
        "erroComum": "Remover pode ocultar mensagens dinâmicas para usuários de leitor de tela.",
        "linguagem": "html",
        "exercicio": "FE07"
      },
      {
        "id": "root",
        "termo": "root",
        "categoria": "Seletor",
        "traducao": "Raiz do documento",
        "explicacao": "Centraliza variáveis CSS reutilizáveis.",
        "erroComum": "Declarar variável e não usar var() reduz a utilidade.",
        "linguagem": "css",
        "exercicio": "FE07"
      },
      {
        "id": "boxSizing",
        "termo": "box-sizing",
        "categoria": "Propriedade",
        "traducao": "Modelo de caixa",
        "explicacao": "Inclui padding e borda no tamanho final do elemento.",
        "erroComum": "Sem ela, largura e altura podem crescer além do esperado.",
        "linguagem": "css",
        "exercicio": "FE07"
      },
      {
        "id": "grid",
        "termo": "grid",
        "categoria": "Valor de display",
        "traducao": "Grade",
        "explicacao": "Organiza elementos em linhas e colunas.",
        "erroComum": "Definir grid sem colunas pode não produzir o layout esperado.",
        "linguagem": "css",
        "exercicio": "FE07"
      },
      {
        "id": "media",
        "termo": "media",
        "categoria": "Regra condicional",
        "traducao": "Consulta de mídia",
        "explicacao": "Aplica regras quando a tela atende a uma condição.",
        "erroComum": "Usar largura fixa ou condição incorreta causa overflow.",
        "linguagem": "css",
        "exercicio": "FE07"
      },
      {
        "id": "querySelector",
        "termo": "querySelector",
        "categoria": "Método",
        "traducao": "Selecionar elemento",
        "explicacao": "Localiza o primeiro elemento que corresponde a um seletor CSS.",
        "erroComum": "Se o seletor estiver errado, o resultado será null.",
        "linguagem": "js",
        "exercicio": "FE07"
      },
      {
        "id": "value",
        "termo": "value",
        "categoria": "Propriedade",
        "traducao": "Valor do campo",
        "explicacao": "Lê o texto ou número informado em um input.",
        "erroComum": "Esquecer a conversão mantém números como texto.",
        "linguagem": "js",
        "exercicio": "FE07"
      },
      {
        "id": "Number",
        "termo": "Number",
        "categoria": "Função",
        "traducao": "Número",
        "explicacao": "Converte um valor para número no JavaScript.",
        "erroComum": "Texto inválido produz NaN.",
        "linguagem": "js",
        "exercicio": "FE07"
      },
      {
        "id": "preventDefault",
        "termo": "preventDefault",
        "categoria": "Método",
        "traducao": "Impedir comportamento padrão",
        "explicacao": "Evita o recarregamento automático de um formulário.",
        "erroComum": "Sem ele, a página pode recarregar e apagar o resultado.",
        "linguagem": "js",
        "exercicio": "FE07"
      },
      {
        "id": "textContent",
        "termo": "textContent",
        "categoria": "Propriedade",
        "traducao": "Conteúdo textual",
        "explicacao": "Lê ou altera texto sem interpretar HTML.",
        "erroComum": "Usar innerHTML sem necessidade aumenta risco e pode alterar a estrutura.",
        "linguagem": "js",
        "exercicio": "FE07"
      },
      {
        "id": "input",
        "termo": "input",
        "categoria": "Função nativa",
        "traducao": "Entrada",
        "explicacao": "Mostra uma pergunta, pausa o programa e devolve o que foi digitado como str.",
        "erroComum": "Tentar calcular sem converter o texto gera erro ou resultado incorreto.",
        "linguagem": "python",
        "exercicio": "FE07"
      },
      {
        "id": "strip",
        "termo": "strip",
        "categoria": "Método de string",
        "traducao": "Remover espaços externos",
        "explicacao": "Remove espaços antes e depois do texto digitado.",
        "erroComum": "Não altera espaços internos do nome.",
        "linguagem": "python",
        "exercicio": "FE07"
      },
      {
        "id": "float",
        "termo": "float",
        "categoria": "Tipo e função de conversão",
        "traducao": "Número decimal",
        "explicacao": "Converte texto numérico para valor decimal.",
        "erroComum": "Vírgula decimal ou texto inválido gera ValueError.",
        "linguagem": "python",
        "exercicio": "FE07"
      },
      {
        "id": "print",
        "termo": "print",
        "categoria": "Função nativa",
        "traducao": "Saída",
        "explicacao": "Exibe informações no terminal.",
        "erroComum": "Esquecer parênteses ou aspas causa SyntaxError.",
        "linguagem": "python",
        "exercicio": "FE07"
      },
      {
        "id": "fstring",
        "termo": "f-string",
        "categoria": "Literal formatado",
        "traducao": "Texto interpolado",
        "explicacao": "Insere valores de variáveis dentro de uma string iniciada por f.",
        "erroComum": "Esquecer o f mostra as chaves como texto comum.",
        "linguagem": "python",
        "exercicio": "FE07"
      },
      {
        "id": "heading",
        "termo": "heading",
        "categoria": "Sintaxe Markdown",
        "traducao": "Título",
        "explicacao": "Organiza a documentação em seções com #.",
        "erroComum": "Usar títulos sem conteúdo deixa o README incompleto.",
        "linguagem": "markdown",
        "exercicio": "FE07"
      },
      {
        "id": "code",
        "termo": "code",
        "categoria": "Sintaxe Markdown",
        "traducao": "Código em linha",
        "explicacao": "Destaca nomes de arquivos e comandos com crases.",
        "erroComum": "Aspas comuns não produzem o mesmo destaque.",
        "linguagem": "markdown",
        "exercicio": "FE07"
      },
      {
        "id": "entrada",
        "termo": "entrada",
        "categoria": "Etapa de algoritmo",
        "traducao": "Dados recebidos",
        "explicacao": "Representa as informações fornecidas antes do processamento.",
        "erroComum": "Usar a entrada diretamente em cálculo sem converter o tipo quando necessário.",
        "linguagem": "pseudocodigo",
        "exercicio": "FE07"
      },
      {
        "id": "processamento",
        "termo": "processamento",
        "categoria": "Etapa de algoritmo",
        "traducao": "Transformação dos dados",
        "explicacao": "Reúne cálculos e regras que transformam as entradas em resultados.",
        "erroComum": "Misturar saída ou mensagens dentro do cálculo dificulta compreender a sequência.",
        "linguagem": "pseudocodigo",
        "exercicio": "FE07"
      },
      {
        "id": "saida",
        "termo": "saída",
        "categoria": "Etapa de algoritmo",
        "traducao": "Resultado apresentado",
        "explicacao": "Mostra ao usuário os valores produzidos pelo processamento.",
        "erroComum": "Exibir uma variável antes de ela receber o resultado correto.",
        "linguagem": "pseudocodigo",
        "exercicio": "FE07"
      }
    ],
    "dicasProgressivas": {
      "html": [
        "Relembre: o HTML organiza o conteúdo e conecta os outros arquivos.",
        "Localize: confira primeiro o head, depois os IDs usados pelo JavaScript.",
        "Compare: os nomes escritos em id devem ser exatamente iguais aos seletores.",
        "Estrutura parcial: mantenha abertura e fechamento das tags na ordem correta.",
        "Exemplo semelhante: crie outro botão e outra área de mensagem com nomes diferentes."
      ],
      "css": [
        "Relembre: seletores escolhem elementos e propriedades definem a apresentação.",
        "Localize: confira a regra que deveria afetar o elemento observado.",
        "Compare: verifique ponto da classe, dois-pontos, ponto e vírgula e unidade.",
        "Estrutura parcial: seletor { propriedade: valor; }.",
        "Exemplo semelhante: teste uma cor ou espaçamento diferente permitido."
      ],
      "js": [
        "Relembre: primeiro localize o elemento; depois registre a ação.",
        "Localize: confira o seletor e o callback do evento.",
        "Compare: a alteração precisa estar dentro da função executada pelo evento.",
        "Estrutura parcial: elemento.addEventListener('click', () => { /* ação */ });",
        "Exemplo semelhante: altere o texto de outro elemento com outro botão."
      ],
      "python": [
        "Relembre: input() sempre devolve texto.",
        "Localize: confira as linhas de entrada e conversão.",
        "Compare: o cálculo deve usar valores numéricos, não strings.",
        "Estrutura parcial: valor = float(input('Pergunta: ')).",
        "Exemplo semelhante: calcule quantidade x preço com outros nomes."
      ]
    },
    "comportamento": {
      "titulo": "Teste comportamental do orçamento",
      "instrucao": "Execute o preview e envie o formulário. O resultado precisa mudar depois do cálculo; a redação da saída pode ser personalizada.",
      "criterios": [
        {
          "id": "enviar-orcamento",
          "tipo": "event",
          "evento": "submit",
          "seletor": "#formularioOrcamento",
          "rotulo": "Enviar o formulário de orçamento"
        },
        {
          "id": "resultado-alterado",
          "tipo": "textChangedFrom",
          "seletor": "#resultadoOrcamento",
          "valor": "Preencha os dados e selecione o botão Calcular orçamento.",
          "rotulo": "A saída mudou após o cálculo"
        }
      ]
    },
    "referenciaCompletaPadrao": false
  }
];

window.APP_CONFIG = {
  "name": "Plataforma 2DS Sub - Programação Front-End - Aluno",
  "shortName": "Programação Front-End",
  "slug": "frontend",
  "storagePrefix": "ds2sub_frontend",
  "version": "0.1.42",
  "releasedAt": "2026-08-12T22:11:00-03:00",
  "versionManifest": "version.json",
  "classroomUrl": "https://classroom.google.com/",
  "githubDefault": "https://github.com/",
  "repositorio": "atividades-frontend-sub",
  "minimumActiveSeconds": 300
};
