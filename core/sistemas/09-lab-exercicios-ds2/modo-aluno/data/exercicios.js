window.EXERCICIOS = [
  {
    "numero": 1,
    "studentReferenceStripped": true,
    "titulo": "Exercício 01 — Alterando HTML com JavaScript",
    "nomeCurto": "Alterando HTML",
    "tema": "Primeira interação com o DOM",
    "objetivo": "Alterar um texto da página ao clicar em um botão.",
    "retomadas": [
      "HTML e CSS básicos"
    ],
    "novos": [
      "função",
      "onclick",
      "getElementById",
      "innerText"
    ],
    "pasta": "exercicio-01",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
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
          "titulo": "Estrutura da página",
          "linhas": [
            1,
            8
          ],
          "explicacao": "O início define o documento, o idioma, a codificação e liga o arquivo de estilos.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Estrutura da página”.",
            "A função desta parte é: O início define o documento, o idioma, a codificação e liga o arquivo de estilos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<!DOCTYPE html>",
              "descricao": "Informa ao navegador que o documento usa o padrão HTML5."
            },
            {
              "nome": "<html>",
              "descricao": "Elemento raiz que envolve todo o documento."
            },
            {
              "nome": "<head>",
              "descricao": "Reúne configurações e referências que não formam o conteúdo principal."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma mensagem interativa que muda após o clique ficará disponível na página.",
          "alerta": "ID diferente entre HTML e JavaScript."
        },
        {
          "titulo": "Elemento que será alterado",
          "linhas": [
            10,
            14
          ],
          "explicacao": "O parágrafo possui o id mensagem. O botão chama a função alterarTexto.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Elemento que será alterado”.",
            "A função desta parte é: O parágrafo possui o id mensagem. O botão chama a função alterarTexto.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            },
            {
              "nome": "onclick",
              "descricao": "Atributo HTML que chama uma função quando ocorre um clique."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma mensagem interativa que muda após o clique ficará disponível na página.",
          "alerta": "Esquecer os parênteses na chamada da função."
        },
        {
          "titulo": "Ligação com JavaScript",
          "linhas": [
            16,
            18
          ],
          "explicacao": "O arquivo script.js é carregado antes do fechamento do body.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Ligação com JavaScript”.",
            "A função desta parte é: O arquivo script.js é carregado antes do fechamento do body.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<script>",
              "descricao": "Liga ou contém o código JavaScript executado pela página."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma mensagem interativa que muda após o clique ficará disponível na página.",
          "alerta": "ID diferente entre HTML e JavaScript."
        }
      ],
      "css": [
        {
          "titulo": "Estilo da página",
          "linhas": [
            1,
            6
          ],
          "explicacao": "O body recebe fonte, fundo, alinhamento e espaçamento.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Estilo da página”.",
            "A função desta parte é: O body recebe fonte, fundo, alinhamento e espaçamento.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "ID diferente entre HTML e JavaScript."
        },
        {
          "titulo": "Título e parágrafo",
          "linhas": [
            8,
            14
          ],
          "explicacao": "O título recebe cor e o parágrafo fica maior.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Título e parágrafo”.",
            "A função desta parte é: O título recebe cor e o parágrafo fica maior.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "Título e parágrafo",
              "descricao": "Trecho selecionado pelo tutorial para construir uma parte específica da atividade."
            },
            {
              "nome": "Linhas 8–14",
              "descricao": "Intervalo validado dentro do arquivo CSS."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Esquecer os parênteses na chamada da função."
        },
        {
          "titulo": "Botão",
          "linhas": [
            16,
            20
          ],
          "explicacao": "O botão recebe espaçamento, tamanho e cursor de clique.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Botão”.",
            "A função desta parte é: O botão recebe espaçamento, tamanho e cursor de clique.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "Botão",
              "descricao": "Trecho selecionado pelo tutorial para construir uma parte específica da atividade."
            },
            {
              "nome": "Linhas 16–20",
              "descricao": "Intervalo validado dentro do arquivo CSS."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "ID diferente entre HTML e JavaScript."
        }
      ],
      "js": [
        {
          "titulo": "Criação da função",
          "linhas": [
            1,
            1
          ],
          "explicacao": "A função reúne o comando que será executado no clique.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Criação da função”.",
            "A função desta parte é: A função reúne o comando que será executado no clique.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma mensagem interativa que muda após o clique responderá aos dados ou ações do usuário.",
          "alerta": "ID diferente entre HTML e JavaScript.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "HTML estático: O texto só muda quando o arquivo é editado."
        },
        {
          "titulo": "Localizar e alterar",
          "linhas": [
            2,
            3
          ],
          "explicacao": "getElementById localiza o parágrafo e innerText troca seu texto.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Localizar e alterar”.",
            "A função desta parte é: getElementById localiza o parágrafo e innerText troca seu texto.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma mensagem interativa que muda após o clique responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer os parênteses na chamada da função.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 01 — Alterando HTML com JavaScript",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como o JavaScript pode alterar textos da página usando função, botão e `innerText`.\n\n**O que será desenvolvido**\n\nNeste exercício, será criada uma página com um título, um texto e um botão para alterar a mensagem.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-01`.\n\nArquivos obrigatórios:\n- `index.html`\n- `estilo.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá alterar o conteúdo do parágrafo quando o botão for acionado.\n\n**Como testar**\n\n- Abrir a página e clicar em Alterar texto.\n- Confirmar que somente o parágrafo é alterado.\n- Abrir cada gaveta e relacionar seu conteúdo com a etapa atual.\n- Executar o caso principal e depois alterar apenas uma entrada.\n- Verificar o comportamento em tela estreita e tela larga.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-01` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como o JavaScript pode alterar textos da página usando função, botão e `innerText`.",
      "desenvolvimento": "Neste exercício, será criada uma página com um título, um texto e um botão para alterar a mensagem.",
      "funcionamento": "O programa deverá alterar o conteúdo do parágrafo quando o botão for acionado.",
      "testes": [
        "Abrir a página e clicar em Alterar texto.",
        "Confirmar que somente o parágrafo é alterado.",
        "Abrir cada gaveta e relacionar seu conteúdo com a etapa atual.",
        "Executar o caso principal e depois alterar apenas uma entrada.",
        "Verificar o comportamento em tela estreita e tela larga."
      ],
      "arquivos": [
        "index.html",
        "estilo.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-01` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "contextoDetalhado": [
      "A atividade constrói uma mensagem interativa que muda após o clique.",
      "Em aplicações reais, avisos, confirmações e respostas de interfaces mudam sem recarregar a página.",
      "O exercício conecta HTML e CSS básicos aos novos recursos função, onclick, getElementById, innerText.",
      "O tutorial separa estrutura, aparência e comportamento para mostrar como cada arquivo contribui para o resultado final.",
      "As gavetas podem ser abertas a qualquer momento para revisar o contexto, consultar exemplos, entender o trecho atual e conferir o glossário."
    ],
    "fluxoAprendizagem": [
      "Estrutura: Estrutura da página",
      "Estrutura: Elemento que será alterado",
      "Estrutura: Ligação com JavaScript",
      "Aparência: Estilo da página",
      "Aparência: Título e parágrafo",
      "Aparência: Botão",
      "Criação da função",
      "Localizar e alterar"
    ],
    "dicasExtras": [
      "Localize no código onde aparece `função` e observe o que muda no preview quando esse trecho é executado.",
      "Leia o código em três perguntas: qual dado entra, qual regra é aplicada e qual resultado aparece na página?",
      "Use a gaveta Explicação da etapa antes de escrever o trecho; nela estão as partes, o motivo, o resultado esperado e os alertas.",
      "Depois do primeiro teste correto, altere apenas um valor para descobrir qual parte da lógica controla o comportamento.",
      "Evite este erro frequente: ID diferente entre HTML e JavaScript.",
      "Teste orientado: Abrir a página e clicar em Alterar texto."
    ],
    "perguntasGuia": [
      "Qual problema da atividade é resolvido por `função`?",
      "Qual é a diferença entre `função` e `onclick` neste exercício?",
      "Que valor é lido antes da regra e que resultado é produzido depois?",
      "Como você explicaria a lógica de uma mensagem interativa que muda após o clique sem ler o código palavra por palavra?",
      "O que aconteceria se este erro fosse cometido: ID diferente entre HTML e JavaScript."
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Cenário de teste: Abrir a página e clicar em Alterar texto.",
      "Cenário de teste: Confirmar que somente o parágrafo é alterado.",
      "Exemplo guiado: execute uma mensagem interativa que muda após o clique com os valores usados no tutorial.",
      "Variação: altere somente uma entrada e compare o novo resultado com o anterior."
    ],
    "glossarioExtra": [
      {
        "termo": "DOM",
        "tipo": "Modelo da página",
        "definicao": "Representação em objetos da estrutura HTML que o JavaScript pode consultar e alterar."
      },
      {
        "termo": "elemento",
        "tipo": "Parte da página",
        "definicao": "Objeto correspondente a uma tag HTML, como parágrafo, botão, input ou seção."
      },
      {
        "termo": "id",
        "tipo": "Identificador HTML",
        "definicao": "Nome único usado para localizar um elemento específico na página."
      },
      {
        "termo": "innerText",
        "tipo": "Propriedade do DOM",
        "definicao": "Lê ou altera o texto visível dentro de um elemento."
      }
    ],
    "comparacoes": [
      {
        "titulo": "HTML estático",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "O texto só muda quando o arquivo é editado."
      },
      {
        "titulo": "HTML controlado pelo JavaScript",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "O texto muda durante a interação, sem recarregar a página."
      }
    ],
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 2,
    "studentReferenceStripped": true,
    "titulo": "Exercício 02 — Modo Claro e Modo Escuro com JavaScript",
    "nomeCurto": "Modo claro e escuro",
    "tema": "Alteração visual da página",
    "objetivo": "Alternar cores da página por meio de dois botões.",
    "retomadas": [
      "função",
      "onclick",
      "innerText"
    ],
    "novos": [
      "document.body.style",
      "backgroundColor",
      "color"
    ],
    "pasta": "exercicio-02",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
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
          "titulo": "Estrutura básica",
          "linhas": [
            1,
            8
          ],
          "explicacao": "A página liga o arquivo CSS e prepara o documento.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Estrutura básica”.",
            "A função desta parte é: A página liga o arquivo CSS e prepara o documento.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<!DOCTYPE html>",
              "descricao": "Informa ao navegador que o documento usa o padrão HTML5."
            },
            {
              "nome": "<html>",
              "descricao": "Elemento raiz que envolve todo o documento."
            },
            {
              "nome": "<head>",
              "descricao": "Reúne configurações e referências que não formam o conteúdo principal."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um seletor de tema claro e escuro ficará disponível na página.",
          "alerta": "Escrever background-color no JavaScript em vez de backgroundColor."
        },
        {
          "titulo": "Mensagem e botões",
          "linhas": [
            10,
            16
          ],
          "explicacao": "Dois botões chamam funções diferentes para cada tema.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Mensagem e botões”.",
            "A função desta parte é: Dois botões chamam funções diferentes para cada tema.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            },
            {
              "nome": "onclick",
              "descricao": "Atributo HTML que chama uma função quando ocorre um clique."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um seletor de tema claro e escuro ficará disponível na página.",
          "alerta": "Escrever background-color no JavaScript em vez de backgroundColor."
        },
        {
          "titulo": "Arquivo JavaScript",
          "linhas": [
            18,
            19
          ],
          "explicacao": "O script é carregado no final da página.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Arquivo JavaScript”.",
            "A função desta parte é: O script é carregado no final da página.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "Arquivo JavaScript",
              "descricao": "Trecho selecionado pelo tutorial para construir uma parte específica da atividade."
            },
            {
              "nome": "Linhas 18–19",
              "descricao": "Intervalo validado dentro do arquivo HTML."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um seletor de tema claro e escuro ficará disponível na página.",
          "alerta": "Escrever background-color no JavaScript em vez de backgroundColor."
        }
      ],
      "css": [
        {
          "titulo": "Tema inicial",
          "linhas": [
            1,
            7
          ],
          "explicacao": "O modo inicial usa fundo branco e texto preto.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Tema inicial”.",
            "A função desta parte é: O modo inicial usa fundo branco e texto preto.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Escrever background-color no JavaScript em vez de backgroundColor."
        },
        {
          "titulo": "Textos",
          "linhas": [
            9,
            15
          ],
          "explicacao": "O título e o parágrafo recebem tamanhos adequados.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Textos”.",
            "A função desta parte é: O título e o parágrafo recebem tamanhos adequados.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "Textos",
              "descricao": "Trecho selecionado pelo tutorial para construir uma parte específica da atividade."
            },
            {
              "nome": "Linhas 9–15",
              "descricao": "Intervalo validado dentro do arquivo CSS."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Escrever background-color no JavaScript em vez de backgroundColor."
        },
        {
          "titulo": "Botões",
          "linhas": [
            17,
            22
          ],
          "explicacao": "Os botões recebem aparência simples e margem.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Botões”.",
            "A função desta parte é: Os botões recebem aparência simples e margem.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "Botões",
              "descricao": "Trecho selecionado pelo tutorial para construir uma parte específica da atividade."
            },
            {
              "nome": "Linhas 17–22",
              "descricao": "Intervalo validado dentro do arquivo CSS."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Escrever background-color no JavaScript em vez de backgroundColor."
        }
      ],
      "js": [
        {
          "titulo": "Modo claro",
          "linhas": [
            1,
            7
          ],
          "explicacao": "A primeira função define fundo branco, texto preto e atualiza a mensagem.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Modo claro”.",
            "A função desta parte é: A primeira função define fundo branco, texto preto e atualiza a mensagem.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um seletor de tema claro e escuro responderá aos dados ou ações do usuário.",
          "alerta": "Escrever background-color no JavaScript em vez de backgroundColor.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "CSS inicial: Define a aparência usada quando a página abre."
        },
        {
          "titulo": "Modo escuro",
          "linhas": [
            9,
            15
          ],
          "explicacao": "A segunda função define fundo preto, texto branco e atualiza a mensagem.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Modo escuro”.",
            "A função desta parte é: A segunda função define fundo preto, texto branco e atualiza a mensagem.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um seletor de tema claro e escuro responderá aos dados ou ações do usuário.",
          "alerta": "Escrever background-color no JavaScript em vez de backgroundColor.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 02 — Modo Claro e Modo Escuro com JavaScript",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como o JavaScript pode alterar a cor de fundo da página e a cor do texto, criando um modo claro e um modo escuro.\n\n**O que será desenvolvido**\n\nNeste exercício, será criada uma página com uma mensagem e dois botões para alternar entre o modo claro e o modo escuro.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-02`.\n\nArquivos obrigatórios:\n- `index.html`\n- `estilo.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá aplicar as cores do tema escolhido e atualizar a mensagem exibida ao usuário.\n\n**Como testar**\n\n- Ativar modo escuro.\n- Voltar ao modo claro.\n- Abrir cada gaveta e relacionar seu conteúdo com a etapa atual.\n- Executar o caso principal e depois alterar apenas uma entrada.\n- Verificar o comportamento em tela estreita e tela larga.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-02` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como o JavaScript pode alterar a cor de fundo da página e a cor do texto, criando um modo claro e um modo escuro.",
      "desenvolvimento": "Neste exercício, será criada uma página com uma mensagem e dois botões para alternar entre o modo claro e o modo escuro.",
      "funcionamento": "O programa deverá aplicar as cores do tema escolhido e atualizar a mensagem exibida ao usuário.",
      "testes": [
        "Ativar modo escuro.",
        "Voltar ao modo claro.",
        "Abrir cada gaveta e relacionar seu conteúdo com a etapa atual.",
        "Executar o caso principal e depois alterar apenas uma entrada.",
        "Verificar o comportamento em tela estreita e tela larga."
      ],
      "arquivos": [
        "index.html",
        "estilo.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-02` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "contextoDetalhado": [
      "A atividade constrói um seletor de tema claro e escuro.",
      "Em aplicações reais, sites permitem adaptar contraste e conforto visual às preferências do usuário.",
      "O exercício conecta função, onclick, innerText aos novos recursos document.body.style, backgroundColor, color.",
      "O tutorial separa estrutura, aparência e comportamento para mostrar como cada arquivo contribui para o resultado final.",
      "As gavetas podem ser abertas a qualquer momento para revisar o contexto, consultar exemplos, entender o trecho atual e conferir o glossário."
    ],
    "fluxoAprendizagem": [
      "Estrutura: Estrutura básica",
      "Estrutura: Mensagem e botões",
      "Estrutura: Arquivo JavaScript",
      "Aparência: Tema inicial",
      "Aparência: Textos",
      "Aparência: Botões",
      "Modo claro",
      "Modo escuro"
    ],
    "dicasExtras": [
      "Localize no código onde aparece `document.body.style` e observe o que muda no preview quando esse trecho é executado.",
      "Leia o código em três perguntas: qual dado entra, qual regra é aplicada e qual resultado aparece na página?",
      "Use a gaveta Explicação da etapa antes de escrever o trecho; nela estão as partes, o motivo, o resultado esperado e os alertas.",
      "Depois do primeiro teste correto, altere apenas um valor para descobrir qual parte da lógica controla o comportamento.",
      "Evite este erro frequente: Escrever background-color no JavaScript em vez de backgroundColor.",
      "Teste orientado: Ativar modo escuro."
    ],
    "perguntasGuia": [
      "Qual problema da atividade é resolvido por `document.body.style`?",
      "Qual é a diferença entre `document.body.style` e `backgroundColor` neste exercício?",
      "Que valor é lido antes da regra e que resultado é produzido depois?",
      "Como você explicaria a lógica de um seletor de tema claro e escuro sem ler o código palavra por palavra?",
      "O que aconteceria se este erro fosse cometido: Escrever background-color no JavaScript em vez de backgroundColor."
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Cenário de teste: Ativar modo escuro.",
      "Cenário de teste: Voltar ao modo claro.",
      "Exemplo guiado: execute um seletor de tema claro e escuro com os valores usados no tutorial.",
      "Variação: altere somente uma entrada e compare o novo resultado com o anterior."
    ],
    "glossarioExtra": [
      {
        "termo": "tema",
        "tipo": "Estado visual",
        "definicao": "Conjunto coordenado de cores e estilos aplicado à interface."
      },
      {
        "termo": "modo escuro",
        "tipo": "Tema visual",
        "definicao": "Configuração que usa fundo escuro e textos claros."
      },
      {
        "termo": "modo claro",
        "tipo": "Tema visual",
        "definicao": "Configuração que usa fundo claro e textos escuros."
      },
      {
        "termo": "camelCase",
        "tipo": "Convenção de escrita",
        "definicao": "Forma de escrever nomes compostos sem hífen, iniciando as palavras seguintes com letra maiúscula."
      }
    ],
    "comparacoes": [
      {
        "titulo": "CSS inicial",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Define a aparência usada quando a página abre."
      },
      {
        "titulo": "Estilo alterado pelo JavaScript",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Muda a propriedade durante a execução e usa camelCase."
      }
    ],
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 3,
    "studentReferenceStripped": true,
    "titulo": "Exercício 03 — Alterando Tamanho, Fonte e Estilo do Texto",
    "nomeCurto": "Tamanho, fonte e estilo",
    "tema": "Manipulação direta de estilos",
    "objetivo": "Alterar três propriedades visuais de um texto.",
    "retomadas": [
      "funções",
      "onclick",
      "getElementById"
    ],
    "novos": [
      "style.fontSize",
      "style.fontFamily",
      "style.fontWeight"
    ],
    "pasta": "exercicio-03",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
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
          "titulo": "Texto-alvo",
          "linhas": [
            10,
            12
          ],
          "explicacao": "O parágrafo mensagem será alterado pelas três funções.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Texto-alvo”.",
            "A função desta parte é: O parágrafo mensagem será alterado pelas três funções.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um painel de personalização de texto ficará disponível na página.",
          "alerta": "Usar font-size em vez de fontSize no JavaScript."
        },
        {
          "titulo": "Três comandos",
          "linhas": [
            14,
            16
          ],
          "explicacao": "Cada botão chama uma função específica.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Três comandos”.",
            "A função desta parte é: Cada botão chama uma função específica.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            },
            {
              "nome": "onclick",
              "descricao": "Atributo HTML que chama uma função quando ocorre um clique."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um painel de personalização de texto ficará disponível na página.",
          "alerta": "Usar font-size em vez de fontSize no JavaScript."
        }
      ],
      "css": [
        {
          "titulo": "Base visual",
          "linhas": [
            1,
            15
          ],
          "explicacao": "A página é centralizada e os textos recebem tamanhos iniciais.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Base visual”.",
            "A função desta parte é: A página é centralizada e os textos recebem tamanhos iniciais.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Usar font-size em vez de fontSize no JavaScript."
        },
        {
          "titulo": "Botões",
          "linhas": [
            17,
            22
          ],
          "explicacao": "Os botões recebem espaçamento e cursor.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Botões”.",
            "A função desta parte é: Os botões recebem espaçamento e cursor.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "Botões",
              "descricao": "Trecho selecionado pelo tutorial para construir uma parte específica da atividade."
            },
            {
              "nome": "Linhas 17–22",
              "descricao": "Intervalo validado dentro do arquivo CSS."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Usar font-size em vez de fontSize no JavaScript."
        }
      ],
      "js": [
        {
          "titulo": "Tamanho",
          "linhas": [
            1,
            4
          ],
          "explicacao": "fontSize muda o tamanho do texto.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Tamanho”.",
            "A função desta parte é: fontSize muda o tamanho do texto.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um painel de personalização de texto responderá aos dados ou ações do usuário.",
          "alerta": "Usar font-size em vez de fontSize no JavaScript.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Nome no CSS: No CSS, propriedades compostas usam hífen."
        },
        {
          "titulo": "Fonte",
          "linhas": [
            6,
            9
          ],
          "explicacao": "fontFamily muda a família tipográfica.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Fonte”.",
            "A função desta parte é: fontFamily muda a família tipográfica.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um painel de personalização de texto responderá aos dados ou ações do usuário.",
          "alerta": "Usar font-size em vez de fontSize no JavaScript.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Negrito",
          "linhas": [
            11,
            14
          ],
          "explicacao": "fontWeight aplica o peso bold.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Negrito”.",
            "A função desta parte é: fontWeight aplica o peso bold.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um painel de personalização de texto responderá aos dados ou ações do usuário.",
          "alerta": "Usar font-size em vez de fontSize no JavaScript.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Nome no JavaScript: No JavaScript, a mesma propriedade usa camelCase."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 03 — Alterando Tamanho, Fonte e Estilo do Texto",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como o JavaScript pode alterar o tamanho, a fonte e o estilo de um texto da página.\n\n**O que será desenvolvido**\n\nNeste exercício, será criada uma página com um texto e três botões para alterar tamanho, fonte e negrito.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-03`.\n\nArquivos obrigatórios:\n- `index.html`\n- `estilo.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá executar uma alteração diferente no texto para cada botão acionado.\n\n**Como testar**\n\n- Acionar cada botão separadamente.\n- Confirmar que as alterações podem permanecer juntas.\n- Abrir cada gaveta e relacionar seu conteúdo com a etapa atual.\n- Executar o caso principal e depois alterar apenas uma entrada.\n- Verificar o comportamento em tela estreita e tela larga.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-03` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como o JavaScript pode alterar o tamanho, a fonte e o estilo de um texto da página.",
      "desenvolvimento": "Neste exercício, será criada uma página com um texto e três botões para alterar tamanho, fonte e negrito.",
      "funcionamento": "O programa deverá executar uma alteração diferente no texto para cada botão acionado.",
      "testes": [
        "Acionar cada botão separadamente.",
        "Confirmar que as alterações podem permanecer juntas.",
        "Abrir cada gaveta e relacionar seu conteúdo com a etapa atual.",
        "Executar o caso principal e depois alterar apenas uma entrada.",
        "Verificar o comportamento em tela estreita e tela larga."
      ],
      "arquivos": [
        "index.html",
        "estilo.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-03` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "contextoDetalhado": [
      "A atividade constrói um painel de personalização de texto.",
      "Em aplicações reais, leitores, plataformas educacionais e sistemas acessíveis ajustam fonte, tamanho e destaque.",
      "O exercício conecta funções, onclick, getElementById aos novos recursos style.fontSize, style.fontFamily, style.fontWeight.",
      "O tutorial separa estrutura, aparência e comportamento para mostrar como cada arquivo contribui para o resultado final.",
      "As gavetas podem ser abertas a qualquer momento para revisar o contexto, consultar exemplos, entender o trecho atual e conferir o glossário."
    ],
    "fluxoAprendizagem": [
      "Estrutura: Texto-alvo",
      "Estrutura: Três comandos",
      "Aparência: Base visual",
      "Aparência: Botões",
      "Tamanho",
      "Fonte",
      "Negrito"
    ],
    "dicasExtras": [
      "Localize no código onde aparece `style.fontSize` e observe o que muda no preview quando esse trecho é executado.",
      "Leia o código em três perguntas: qual dado entra, qual regra é aplicada e qual resultado aparece na página?",
      "Use a gaveta Explicação da etapa antes de escrever o trecho; nela estão as partes, o motivo, o resultado esperado e os alertas.",
      "Depois do primeiro teste correto, altere apenas um valor para descobrir qual parte da lógica controla o comportamento.",
      "Evite este erro frequente: Usar font-size em vez de fontSize no JavaScript.",
      "Teste orientado: Acionar cada botão separadamente."
    ],
    "perguntasGuia": [
      "Qual problema da atividade é resolvido por `style.fontSize`?",
      "Qual é a diferença entre `style.fontSize` e `style.fontFamily` neste exercício?",
      "Que valor é lido antes da regra e que resultado é produzido depois?",
      "Como você explicaria a lógica de um painel de personalização de texto sem ler o código palavra por palavra?",
      "O que aconteceria se este erro fosse cometido: Usar font-size em vez de fontSize no JavaScript."
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Cenário de teste: Acionar cada botão separadamente.",
      "Cenário de teste: Confirmar que as alterações podem permanecer juntas.",
      "Exemplo guiado: execute um painel de personalização de texto com os valores usados no tutorial.",
      "Variação: altere somente uma entrada e compare o novo resultado com o anterior."
    ],
    "glossarioExtra": [
      {
        "termo": "camelCase",
        "tipo": "Convenção de escrita",
        "definicao": "Forma de escrever nomes compostos sem hífen, iniciando as palavras seguintes com letra maiúscula."
      },
      {
        "termo": "propriedade CSS",
        "tipo": "Regra visual",
        "definicao": "Característica de aparência, como cor, tamanho, família da fonte ou espaçamento."
      },
      {
        "termo": "fontSize",
        "tipo": "Propriedade de estilo",
        "definicao": "Versão em camelCase de font-size usada no JavaScript."
      },
      {
        "termo": "fontFamily",
        "tipo": "Propriedade de estilo",
        "definicao": "Versão em camelCase de font-family usada no JavaScript."
      }
    ],
    "comparacoes": [
      {
        "titulo": "Nome no CSS",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "No CSS, propriedades compostas usam hífen."
      },
      {
        "titulo": "Nome no JavaScript",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "No JavaScript, a mesma propriedade usa camelCase."
      }
    ],
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 4,
    "studentReferenceStripped": true,
    "titulo": "Exercício 04 — Capturando Nome com Input",
    "nomeCurto": "Capturando nome",
    "tema": "Entrada de dados",
    "objetivo": "Capturar um texto digitado e montar uma mensagem personalizada.",
    "retomadas": [
      "função",
      "onclick",
      "innerText"
    ],
    "novos": [
      "input",
      "value",
      "let",
      "concatenação"
    ],
    "pasta": "exercicio-04",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
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
          "titulo": "Card principal",
          "linhas": [
            10,
            13
          ],
          "explicacao": "O main agrupa o conteúdo da atividade.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Card principal”.",
            "A função desta parte é: O main agrupa o conteúdo da atividade.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma saudação personalizada a partir de um campo ficará disponível na página.",
          "alerta": "Esquecer .value."
        },
        {
          "titulo": "Campo de nome",
          "linhas": [
            15,
            16
          ],
          "explicacao": "O label identifica o campo e o input recebe o nome.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Campo de nome”.",
            "A função desta parte é: O label identifica o campo e o input recebe o nome.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "<input>",
              "descricao": "Campo de entrada usado para capturar um valor do usuário."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma saudação personalizada a partir de um campo ficará disponível na página.",
          "alerta": "Usar um id diferente no JavaScript."
        },
        {
          "titulo": "Botão",
          "linhas": [
            18,
            18
          ],
          "explicacao": "O clique chama a função mostrarNome.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Botão”.",
            "A função desta parte é: O clique chama a função mostrarNome.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            },
            {
              "nome": "onclick",
              "descricao": "Atributo HTML que chama uma função quando ocorre um clique."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma saudação personalizada a partir de um campo ficará disponível na página.",
          "alerta": "Esquecer .value."
        }
      ],
      "css": [
        {
          "titulo": "Página e card",
          "linhas": [
            1,
            15
          ],
          "explicacao": "O body centraliza e o main cria o card branco.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Página e card”.",
            "A função desta parte é: O body centraliza e o main cria o card branco.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Esquecer .value."
        },
        {
          "titulo": "Campo",
          "linhas": [
            25,
            36
          ],
          "explicacao": "Label e input recebem espaçamento e tamanho.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Campo”.",
            "A função desta parte é: Label e input recebem espaçamento e tamanho.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "Campo",
              "descricao": "Trecho selecionado pelo tutorial para construir uma parte específica da atividade."
            },
            {
              "nome": "Linhas 25–36",
              "descricao": "Intervalo validado dentro do arquivo CSS."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Usar um id diferente no JavaScript."
        },
        {
          "titulo": "Botão",
          "linhas": [
            38,
            43
          ],
          "explicacao": "O botão recebe tamanho e cursor.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Botão”.",
            "A função desta parte é: O botão recebe tamanho e cursor.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "Botão",
              "descricao": "Trecho selecionado pelo tutorial para construir uma parte específica da atividade."
            },
            {
              "nome": "Linhas 38–43",
              "descricao": "Intervalo validado dentro do arquivo CSS."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Esquecer .value."
        }
      ],
      "js": [
        {
          "titulo": "Captura do valor",
          "linhas": [
            1,
            2
          ],
          "explicacao": "A variável nome recebe o conteúdo digitado no input.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Captura do valor”.",
            "A função desta parte é: A variável nome recebe o conteúdo digitado no input.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma saudação personalizada a partir de um campo responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer .value.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Ler um input: value obtém o conteúdo digitado no campo."
        },
        {
          "titulo": "Mensagem personalizada",
          "linhas": [
            4,
            5
          ],
          "explicacao": "A concatenação junta o texto fixo ao nome digitado.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Mensagem personalizada”.",
            "A função desta parte é: A concatenação junta o texto fixo ao nome digitado.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma saudação personalizada a partir de um campo responderá aos dados ou ações do usuário.",
          "alerta": "Usar um id diferente no JavaScript.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 04 — Capturando Nome com Input",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como o JavaScript pode capturar um nome digitado em um campo de texto e exibir uma mensagem personalizada na página.\n\n**O que será desenvolvido**\n\nNeste exercício, será criada uma página com um campo para digitar o nome e um botão para exibir uma mensagem personalizada.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-04`.\n\nArquivos obrigatórios:\n- `index.html`\n- `estilo.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá ler o conteúdo do campo e apresentar uma mensagem de boas-vindas com o nome informado.\n\n**Como testar**\n\n- Digitar um nome e clicar no botão.\n- Abrir cada gaveta e relacionar seu conteúdo com a etapa atual.\n- Executar o caso principal e depois alterar apenas uma entrada.\n- Verificar o comportamento em tela estreita e tela larga.\n- Conferir a correspondência entre IDs, classes, funções e resultado visual.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-04` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como o JavaScript pode capturar um nome digitado em um campo de texto e exibir uma mensagem personalizada na página.",
      "desenvolvimento": "Neste exercício, será criada uma página com um campo para digitar o nome e um botão para exibir uma mensagem personalizada.",
      "funcionamento": "O programa deverá ler o conteúdo do campo e apresentar uma mensagem de boas-vindas com o nome informado.",
      "testes": [
        "Digitar um nome e clicar no botão.",
        "Abrir cada gaveta e relacionar seu conteúdo com a etapa atual.",
        "Executar o caso principal e depois alterar apenas uma entrada.",
        "Verificar o comportamento em tela estreita e tela larga.",
        "Conferir a correspondência entre IDs, classes, funções e resultado visual."
      ],
      "arquivos": [
        "index.html",
        "estilo.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-04` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "contextoDetalhado": [
      "A atividade constrói uma saudação personalizada a partir de um campo.",
      "Em aplicações reais, formulários capturam dados e devolvem respostas relacionadas ao que foi digitado.",
      "O exercício conecta função, onclick, innerText aos novos recursos input, value, let, concatenação.",
      "O tutorial separa estrutura, aparência e comportamento para mostrar como cada arquivo contribui para o resultado final.",
      "As gavetas podem ser abertas a qualquer momento para revisar o contexto, consultar exemplos, entender o trecho atual e conferir o glossário."
    ],
    "fluxoAprendizagem": [
      "Estrutura: Card principal",
      "Estrutura: Campo de nome",
      "Estrutura: Botão",
      "Aparência: Página e card",
      "Aparência: Campo",
      "Aparência: Botão",
      "Captura do valor",
      "Mensagem personalizada"
    ],
    "dicasExtras": [
      "Localize no código onde aparece `input` e observe o que muda no preview quando esse trecho é executado.",
      "Leia o código em três perguntas: qual dado entra, qual regra é aplicada e qual resultado aparece na página?",
      "Use a gaveta Explicação da etapa antes de escrever o trecho; nela estão as partes, o motivo, o resultado esperado e os alertas.",
      "Depois do primeiro teste correto, altere apenas um valor para descobrir qual parte da lógica controla o comportamento.",
      "Evite este erro frequente: Esquecer .value.",
      "Teste orientado: Digitar um nome e clicar no botão."
    ],
    "perguntasGuia": [
      "Qual problema da atividade é resolvido por `input`?",
      "Qual é a diferença entre `input` e `value` neste exercício?",
      "Que valor é lido antes da regra e que resultado é produzido depois?",
      "Como você explicaria a lógica de uma saudação personalizada a partir de um campo sem ler o código palavra por palavra?",
      "O que aconteceria se este erro fosse cometido: Esquecer .value."
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Cenário de teste: Digitar um nome e clicar no botão.",
      "Exemplo guiado: execute uma saudação personalizada a partir de um campo com os valores usados no tutorial.",
      "Variação: altere somente uma entrada e compare o novo resultado com o anterior.",
      "Aplicação real: relacione o comportamento do exercício a esta situação: formulários capturam dados e devolvem respostas relacionadas ao que foi digitado."
    ],
    "glossarioExtra": [
      {
        "termo": "input",
        "tipo": "Campo de entrada",
        "definicao": "Elemento HTML usado para o usuário digitar ou selecionar um valor."
      },
      {
        "termo": "value",
        "tipo": "Propriedade de formulário",
        "definicao": "Conteúdo atual de um campo input ou select."
      },
      {
        "termo": "captura",
        "tipo": "Leitura de dados",
        "definicao": "Ação de obter no JavaScript o valor fornecido pelo usuário."
      },
      {
        "termo": "concatenação",
        "tipo": "Operação com textos",
        "definicao": "União de dois ou mais trechos de texto em uma única string."
      }
    ],
    "comparacoes": [
      {
        "titulo": "Ler um input",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "value obtém o conteúdo digitado no campo."
      },
      {
        "titulo": "Alterar um texto",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "innerText altera o conteúdo visível de outro elemento."
      }
    ],
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 5,
    "studentReferenceStripped": true,
    "titulo": "Exercício 05 — Contador de Cliques com JavaScript",
    "nomeCurto": "Contador de cliques",
    "tema": "Estado numérico",
    "objetivo": "Controlar uma variável numérica e atualizar seu valor na página.",
    "retomadas": [
      "funções",
      "onclick",
      "innerText"
    ],
    "novos": [
      "variável global",
      "++",
      "--"
    ],
    "pasta": "exercicio-05",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
    "arquivos": {
      "html": "<!doctype html>\n<html lang=\"pt-BR\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Atividade</title>\n</head>\n<body>\n  <main>\n    <!-- Desenvolva aqui a estrutura solicitada. -->\n  </main>\n</body>\n</html>\n",
      "css": "/* Desenvolva aqui os estilos solicitados. */\n",
      "js": "'use strict';\n// Desenvolva aqui o comportamento solicitado.\n"
    },
    "nomesArquivos": {
      "html": "index.html",
      "css": "style.css",
      "js": "script.js"
    },
    "passos": {
      "html": [
        {
          "titulo": "Área do contador",
          "linhas": [
            10,
            12
          ],
          "explicacao": "A div agrupa o título e o número atual.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Área do contador”.",
            "A função desta parte é: A div agrupa o título e o número atual.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um contador de interações ficará disponível na página.",
          "alerta": "Criar contador dentro das funções e perder o valor."
        },
        {
          "titulo": "Três botões",
          "linhas": [
            14,
            16
          ],
          "explicacao": "Cada botão chama uma função diferente.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Três botões”.",
            "A função desta parte é: Cada botão chama uma função diferente.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            },
            {
              "nome": "onclick",
              "descricao": "Atributo HTML que chama uma função quando ocorre um clique."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um contador de interações ficará disponível na página.",
          "alerta": "Criar contador dentro das funções e perder o valor."
        }
      ],
      "css": [
        {
          "titulo": "Card",
          "linhas": [
            1,
            15
          ],
          "explicacao": "A página usa um card centralizado.",
          "detalhes": [
            "Este trecho pertence ao arquivo `style.css` e trabalha a etapa “Card”.",
            "A função desta parte é: A página usa um card centralizado.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Criar contador dentro das funções e perder o valor."
        },
        {
          "titulo": "Número",
          "linhas": [
            21,
            25
          ],
          "explicacao": "O contador recebe tamanho grande e negrito.",
          "detalhes": [
            "Este trecho pertence ao arquivo `style.css` e trabalha a etapa “Número”.",
            "A função desta parte é: O contador recebe tamanho grande e negrito.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "Número",
              "descricao": "Trecho selecionado pelo tutorial para construir uma parte específica da atividade."
            },
            {
              "nome": "Linhas 21–25",
              "descricao": "Intervalo validado dentro do arquivo CSS."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Criar contador dentro das funções e perder o valor."
        },
        {
          "titulo": "Botões",
          "linhas": [
            27,
            32
          ],
          "explicacao": "Os botões recebem espaçamento e tamanho.",
          "detalhes": [
            "Este trecho pertence ao arquivo `style.css` e trabalha a etapa “Botões”.",
            "A função desta parte é: Os botões recebem espaçamento e tamanho.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "Botões",
              "descricao": "Trecho selecionado pelo tutorial para construir uma parte específica da atividade."
            },
            {
              "nome": "Linhas 27–32",
              "descricao": "Intervalo validado dentro do arquivo CSS."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Criar contador dentro das funções e perder o valor."
        }
      ],
      "js": [
        {
          "titulo": "Variável global",
          "linhas": [
            1,
            1
          ],
          "explicacao": "contador guarda o valor atual fora das funções.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Variável global”.",
            "A função desta parte é: contador guarda o valor atual fora das funções.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um contador de interações responderá aos dados ou ações do usuário.",
          "alerta": "Criar contador dentro das funções e perder o valor.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Dado do programa: A variável guarda o estado numérico atual."
        },
        {
          "titulo": "Atualização do DOM",
          "linhas": [
            3,
            5
          ],
          "explicacao": "A função centraliza a atualização do parágrafo.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Atualização do DOM”.",
            "A função desta parte é: A função centraliza a atualização do parágrafo.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um contador de interações responderá aos dados ou ações do usuário.",
          "alerta": "Criar contador dentro das funções e perder o valor.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Aumentar e diminuir",
          "linhas": [
            7,
            15
          ],
          "explicacao": "++ soma um e -- subtrai um.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Aumentar e diminuir”.",
            "A função desta parte é: ++ soma um e -- subtrai um.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um contador de interações responderá aos dados ou ações do usuário.",
          "alerta": "Criar contador dentro das funções e perder o valor.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Dado exibido: A interface mostra uma cópia do estado."
        },
        {
          "titulo": "Zerar",
          "linhas": [
            17,
            20
          ],
          "explicacao": "A função redefine o valor para zero.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Zerar”.",
            "A função desta parte é: A função redefine o valor para zero.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um contador de interações responderá aos dados ou ações do usuário.",
          "alerta": "Criar contador dentro das funções e perder o valor.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 05 — Contador de Cliques com JavaScript",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como o JavaScript pode controlar uma variável numérica e atualizar o resultado na página.\n\n**O que será desenvolvido**\n\nNeste exercício, será criada uma página com um contador e botões para aumentar, diminuir e zerar o valor.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-05`.\n\nArquivos obrigatórios:\n- `index.html`\n- `style.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá aumentar, diminuir ou zerar o contador conforme o botão escolhido.\n\n**Como testar**\n\n- Aumentar três vezes.\n- Diminuir uma vez.\n- Zerar.\n- Abrir cada gaveta e relacionar seu conteúdo com a etapa atual.\n- Executar o caso principal e depois alterar apenas uma entrada.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-05` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como o JavaScript pode controlar uma variável numérica e atualizar o resultado na página.",
      "desenvolvimento": "Neste exercício, será criada uma página com um contador e botões para aumentar, diminuir e zerar o valor.",
      "funcionamento": "O programa deverá aumentar, diminuir ou zerar o contador conforme o botão escolhido.",
      "testes": [
        "Aumentar três vezes.",
        "Diminuir uma vez.",
        "Zerar.",
        "Abrir cada gaveta e relacionar seu conteúdo com a etapa atual.",
        "Executar o caso principal e depois alterar apenas uma entrada."
      ],
      "arquivos": [
        "index.html",
        "style.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-05` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "contextoDetalhado": [
      "A atividade constrói um contador de interações.",
      "Em aplicações reais, painéis acompanham quantidade de cliques, votos, itens ou ações realizadas.",
      "O exercício conecta funções, onclick, innerText aos novos recursos variável global, ++, --.",
      "O tutorial separa estrutura, aparência e comportamento para mostrar como cada arquivo contribui para o resultado final.",
      "As gavetas podem ser abertas a qualquer momento para revisar o contexto, consultar exemplos, entender o trecho atual e conferir o glossário."
    ],
    "fluxoAprendizagem": [
      "Estrutura: Área do contador",
      "Estrutura: Três botões",
      "Aparência: Card",
      "Aparência: Número",
      "Aparência: Botões",
      "Variável global",
      "Atualização do DOM",
      "Aumentar e diminuir"
    ],
    "dicasExtras": [
      "Localize no código onde aparece `variável global` e observe o que muda no preview quando esse trecho é executado.",
      "Leia o código em três perguntas: qual dado entra, qual regra é aplicada e qual resultado aparece na página?",
      "Use a gaveta Explicação da etapa antes de escrever o trecho; nela estão as partes, o motivo, o resultado esperado e os alertas.",
      "Depois do primeiro teste correto, altere apenas um valor para descobrir qual parte da lógica controla o comportamento.",
      "Evite este erro frequente: Criar contador dentro das funções e perder o valor.",
      "Teste orientado: Aumentar três vezes."
    ],
    "perguntasGuia": [
      "Qual problema da atividade é resolvido por `variável global`?",
      "Qual é a diferença entre `variável global` e `++` neste exercício?",
      "Que valor é lido antes da regra e que resultado é produzido depois?",
      "Como você explicaria a lógica de um contador de interações sem ler o código palavra por palavra?",
      "O que aconteceria se este erro fosse cometido: Criar contador dentro das funções e perder o valor."
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Cenário de teste: Aumentar três vezes.",
      "Cenário de teste: Diminuir uma vez.",
      "Cenário de teste: Zerar.",
      "Exemplo guiado: execute um contador de interações com os valores usados no tutorial."
    ],
    "glossarioExtra": [
      {
        "termo": "contador",
        "tipo": "Variável de estado",
        "definicao": "Número que registra quantas vezes uma ação ocorreu ou qual etapa foi alcançada."
      },
      {
        "termo": "incremento",
        "tipo": "Atualização numérica",
        "definicao": "Aumento de um valor, normalmente em uma unidade."
      },
      {
        "termo": "decremento",
        "tipo": "Atualização numérica",
        "definicao": "Redução de um valor, normalmente em uma unidade."
      },
      {
        "termo": "estado",
        "tipo": "Dados atuais",
        "definicao": "Conjunto de valores que representa a situação atual da aplicação."
      }
    ],
    "comparacoes": [
      {
        "titulo": "Dado do programa",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "A variável guarda o estado numérico atual."
      },
      {
        "titulo": "Dado exibido",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "A interface mostra uma cópia do estado."
      }
    ],
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 6,
    "studentReferenceStripped": true,
    "titulo": "Exercício 06 — Calculadora Simples com JavaScript",
    "nomeCurto": "Calculadora simples",
    "tema": "Operações matemáticas",
    "objetivo": "Capturar dois números e executar quatro operações.",
    "retomadas": [
      "input",
      "value",
      "Number",
      "funções"
    ],
    "novos": [
      "return",
      "objeto simples",
      "validação de divisão"
    ],
    "pasta": "exercicio-06",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
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
          "titulo": "Entradas numéricas",
          "linhas": [
            12,
            16
          ],
          "explicacao": "Dois campos recebem os números.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Entradas numéricas”.",
            "A função desta parte é: Dois campos recebem os números.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "<input>",
              "descricao": "Campo de entrada usado para capturar um valor do usuário."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma calculadora com quatro operações ficará disponível na página.",
          "alerta": "Esquecer Number e concatenar textos."
        },
        {
          "titulo": "Operações",
          "linhas": [
            18,
            23
          ],
          "explicacao": "Quatro botões chamam as operações.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Operações”.",
            "A função desta parte é: Quatro botões chamam as operações.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            },
            {
              "nome": "onclick",
              "descricao": "Atributo HTML que chama uma função quando ocorre um clique."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma calculadora com quatro operações ficará disponível na página.",
          "alerta": "Não validar divisão por zero."
        },
        {
          "titulo": "Resultado",
          "linhas": [
            26,
            26
          ],
          "explicacao": "O parágrafo mostra o cálculo.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Resultado”.",
            "A função desta parte é: O parágrafo mostra o cálculo.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma calculadora com quatro operações ficará disponível na página.",
          "alerta": "Esquecer Number e concatenar textos."
        }
      ],
      "css": [
        {
          "titulo": "Card e campos",
          "linhas": [
            1,
            33
          ],
          "explicacao": "A interface centraliza os campos em um card.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Card e campos”.",
            "A função desta parte é: A interface centraliza os campos em um card.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Esquecer Number e concatenar textos."
        },
        {
          "titulo": "Botões e resultado",
          "linhas": [
            35,
            57
          ],
          "explicacao": "Botões azuis e resultado em destaque.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Botões e resultado”.",
            "A função desta parte é: Botões azuis e resultado em destaque.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Não validar divisão por zero."
        }
      ],
      "js": [
        {
          "titulo": "Função auxiliar",
          "linhas": [
            1,
            5
          ],
          "explicacao": "pegarValores converte os campos e devolve os dois números.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Função auxiliar”.",
            "A função desta parte é: pegarValores converte os campos e devolve os dois números.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            },
            {
              "nome": "Number()",
              "descricao": "Converte um valor para número."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma calculadora com quatro operações responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer Number e concatenar textos.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Valor do campo: O navegador entrega o conteúdo do input como texto."
        },
        {
          "titulo": "Soma e subtração",
          "linhas": [
            7,
            17
          ],
          "explicacao": "Cada função usa o objeto retornado.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Soma e subtração”.",
            "A função desta parte é: Cada função usa o objeto retornado.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma calculadora com quatro operações responderá aos dados ou ações do usuário.",
          "alerta": "Não validar divisão por zero.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Multiplicação",
          "linhas": [
            19,
            23
          ],
          "explicacao": "O operador * multiplica.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Multiplicação”.",
            "A função desta parte é: O operador * multiplica.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma calculadora com quatro operações responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer Number e concatenar textos.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Valor convertido: A conversão permite realizar cálculos numéricos."
        },
        {
          "titulo": "Divisão segura",
          "linhas": [
            25,
            34
          ],
          "explicacao": "A condição impede divisão por zero.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Divisão segura”.",
            "A função desta parte é: A condição impede divisão por zero.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma calculadora com quatro operações responderá aos dados ou ações do usuário.",
          "alerta": "Não validar divisão por zero.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 06 — Calculadora Simples com JavaScript",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como o JavaScript pode capturar números digitados pelo usuário, realizar cálculos e exibir o resultado na página.\n\n**O que será desenvolvido**\n\nNeste exercício, será criada uma calculadora com dois campos numéricos, quatro botões de operação e uma área de resultado.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-06`.\n\nArquivos obrigatórios:\n- `index.html`\n- `estilo.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá somar, subtrair, multiplicar ou dividir os valores, impedindo a divisão por zero.\n\n**Como testar**\n\n- 2 + 3 = 5.\n- 10 / 2 = 5.\n- 10 / 0 mostra aviso.\n- Abrir cada gaveta e relacionar seu conteúdo com a etapa atual.\n- Executar o caso principal e depois alterar apenas uma entrada.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-06` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como o JavaScript pode capturar números digitados pelo usuário, realizar cálculos e exibir o resultado na página.",
      "desenvolvimento": "Neste exercício, será criada uma calculadora com dois campos numéricos, quatro botões de operação e uma área de resultado.",
      "funcionamento": "O programa deverá somar, subtrair, multiplicar ou dividir os valores, impedindo a divisão por zero.",
      "testes": [
        "2 + 3 = 5.",
        "10 / 2 = 5.",
        "10 / 0 mostra aviso.",
        "Abrir cada gaveta e relacionar seu conteúdo com a etapa atual.",
        "Executar o caso principal e depois alterar apenas uma entrada."
      ],
      "arquivos": [
        "index.html",
        "estilo.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-06` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "contextoDetalhado": [
      "A atividade constrói uma calculadora com quatro operações.",
      "Em aplicações reais, sistemas recebem textos dos campos, convertem números e protegem operações inválidas.",
      "O exercício conecta input, value, Number aos novos recursos return, objeto simples, validação de divisão.",
      "O tutorial separa estrutura, aparência e comportamento para mostrar como cada arquivo contribui para o resultado final.",
      "As gavetas podem ser abertas a qualquer momento para revisar o contexto, consultar exemplos, entender o trecho atual e conferir o glossário."
    ],
    "fluxoAprendizagem": [
      "Estrutura: Entradas numéricas",
      "Estrutura: Operações",
      "Estrutura: Resultado",
      "Aparência: Card e campos",
      "Aparência: Botões e resultado",
      "Função auxiliar",
      "Soma e subtração",
      "Multiplicação"
    ],
    "dicasExtras": [
      "Localize no código onde aparece `return` e observe o que muda no preview quando esse trecho é executado.",
      "Leia o código em três perguntas: qual dado entra, qual regra é aplicada e qual resultado aparece na página?",
      "Use a gaveta Explicação da etapa antes de escrever o trecho; nela estão as partes, o motivo, o resultado esperado e os alertas.",
      "Depois do primeiro teste correto, altere apenas um valor para descobrir qual parte da lógica controla o comportamento.",
      "Evite este erro frequente: Esquecer Number e concatenar textos.",
      "Teste orientado: 2 + 3 = 5"
    ],
    "perguntasGuia": [
      "Qual problema da atividade é resolvido por `return`?",
      "Qual é a diferença entre `return` e `objeto simples` neste exercício?",
      "Que valor é lido antes da regra e que resultado é produzido depois?",
      "Como você explicaria a lógica de uma calculadora com quatro operações sem ler o código palavra por palavra?",
      "O que aconteceria se este erro fosse cometido: Esquecer Number e concatenar textos."
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Cenário de teste: 2 + 3 = 5",
      "Cenário de teste: 10 / 2 = 5"
    ],
    "glossarioExtra": [
      {
        "termo": "operação",
        "tipo": "Processamento",
        "definicao": "Cálculo realizado com um ou mais valores."
      },
      {
        "termo": "divisão por zero",
        "tipo": "Situação inválida",
        "definicao": "Operação matemática que deve ser impedida ou tratada pelo programa."
      },
      {
        "termo": "operador aritmético",
        "tipo": "Símbolo de cálculo",
        "definicao": "Símbolo como +, -, * ou / usado para realizar cálculos."
      },
      {
        "termo": "Number",
        "tipo": "Função de conversão",
        "definicao": "Converte um valor para o tipo numérico quando possível."
      }
    ],
    "comparacoes": [
      {
        "titulo": "Valor do campo",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "O navegador entrega o conteúdo do input como texto."
      },
      {
        "titulo": "Valor convertido",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "A conversão permite realizar cálculos numéricos."
      }
    ],
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 7,
    "studentReferenceStripped": true,
    "titulo": "Exercício 07 — Conversor de Temperatura com JavaScript",
    "nomeCurto": "Conversor de temperatura",
    "tema": "Aplicação de fórmulas",
    "objetivo": "Converter Celsius em Fahrenheit ou Kelvin.",
    "retomadas": [
      "input",
      "Number",
      "funções",
      "operações"
    ],
    "novos": [
      "fórmulas",
      "limpeza de campo"
    ],
    "pasta": "exercicio-07",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
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
          "titulo": "Campo Celsius",
          "linhas": [
            12,
            13
          ],
          "explicacao": "O campo recebe a temperatura de entrada.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Campo Celsius”.",
            "A função desta parte é: O campo recebe a temperatura de entrada.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "Campo Celsius",
              "descricao": "Trecho selecionado pelo tutorial para construir uma parte específica da atividade."
            },
            {
              "nome": "Linhas 12–13",
              "descricao": "Intervalo validado dentro do arquivo HTML."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um conversor de temperaturas ficará disponível na página.",
          "alerta": "Esquecer parênteses na fórmula Fahrenheit."
        },
        {
          "titulo": "Botões",
          "linhas": [
            15,
            19
          ],
          "explicacao": "Cada botão chama uma conversão ou limpa.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Botões”.",
            "A função desta parte é: Cada botão chama uma conversão ou limpa.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            },
            {
              "nome": "onclick",
              "descricao": "Atributo HTML que chama uma função quando ocorre um clique."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um conversor de temperaturas ficará disponível na página.",
          "alerta": "Esquecer parênteses na fórmula Fahrenheit."
        },
        {
          "titulo": "Resultado",
          "linhas": [
            22,
            22
          ],
          "explicacao": "O resultado será atualizado pelo JavaScript.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Resultado”.",
            "A função desta parte é: O resultado será atualizado pelo JavaScript.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um conversor de temperaturas ficará disponível na página.",
          "alerta": "Esquecer parênteses na fórmula Fahrenheit."
        }
      ],
      "css": [
        {
          "titulo": "Interface",
          "linhas": [
            1,
            57
          ],
          "explicacao": "O mesmo padrão visual da calculadora organiza o conversor.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Interface”.",
            "A função desta parte é: O mesmo padrão visual da calculadora organiza o conversor.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Esquecer parênteses na fórmula Fahrenheit."
        }
      ],
      "js": [
        {
          "titulo": "Fahrenheit",
          "linhas": [
            1,
            7
          ],
          "explicacao": "A fórmula multiplica por 9/5 e soma 32.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Fahrenheit”.",
            "A função desta parte é: A fórmula multiplica por 9/5 e soma 32.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um conversor de temperaturas responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer parênteses na fórmula Fahrenheit.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Valor de entrada: A temperatura começa em uma escala conhecida."
        },
        {
          "titulo": "Kelvin",
          "linhas": [
            9,
            15
          ],
          "explicacao": "A fórmula soma 273.15.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Kelvin”.",
            "A função desta parte é: A fórmula soma 273.15.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um conversor de temperaturas responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer parênteses na fórmula Fahrenheit.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Limpar",
          "linhas": [
            17,
            20
          ],
          "explicacao": "A função apaga o campo e restaura a mensagem.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Limpar”.",
            "A função desta parte é: A função apaga o campo e restaura a mensagem.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um conversor de temperaturas responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer parênteses na fórmula Fahrenheit.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Valor transformado: A fórmula cria uma nova representação da mesma grandeza."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 07 — Conversor de Temperatura com JavaScript",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como o JavaScript pode capturar um valor digitado pelo usuário, realizar cálculos com fórmulas e exibir o resultado na página.\n\n**O que será desenvolvido**\n\nNeste exercício, será criada um conversor com um campo em Celsius e botões para converter para Fahrenheit, Kelvin e limpar.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-07`.\n\nArquivos obrigatórios:\n- `index.html`\n- `estilo.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá converter Celsius para Fahrenheit ou Kelvin e limpar o campo quando solicitado.\n\n**Como testar**\n\n- 0 °C = 32 °F.\n- 0 °C = 273.15 K.\n- Abrir cada gaveta e relacionar seu conteúdo com a etapa atual.\n- Executar o caso principal e depois alterar apenas uma entrada.\n- Verificar o comportamento em tela estreita e tela larga.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-07` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como o JavaScript pode capturar um valor digitado pelo usuário, realizar cálculos com fórmulas e exibir o resultado na página.",
      "desenvolvimento": "Neste exercício, será criada um conversor com um campo em Celsius e botões para converter para Fahrenheit, Kelvin e limpar.",
      "funcionamento": "O programa deverá converter Celsius para Fahrenheit ou Kelvin e limpar o campo quando solicitado.",
      "testes": [
        "0 °C = 32 °F.",
        "0 °C = 273.15 K.",
        "Abrir cada gaveta e relacionar seu conteúdo com a etapa atual.",
        "Executar o caso principal e depois alterar apenas uma entrada.",
        "Verificar o comportamento em tela estreita e tela larga."
      ],
      "arquivos": [
        "index.html",
        "estilo.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-07` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "contextoDetalhado": [
      "A atividade constrói um conversor de temperaturas.",
      "Em aplicações reais, aplicações transformam valores usando fórmulas e apresentam unidades diferentes.",
      "O exercício conecta input, Number, funções aos novos recursos fórmulas, limpeza de campo.",
      "O tutorial separa estrutura, aparência e comportamento para mostrar como cada arquivo contribui para o resultado final.",
      "As gavetas podem ser abertas a qualquer momento para revisar o contexto, consultar exemplos, entender o trecho atual e conferir o glossário."
    ],
    "fluxoAprendizagem": [
      "Estrutura: Campo Celsius",
      "Estrutura: Botões",
      "Estrutura: Resultado",
      "Aparência: Interface",
      "Fahrenheit",
      "Kelvin",
      "Limpar"
    ],
    "dicasExtras": [
      "Localize no código onde aparece `fórmulas` e observe o que muda no preview quando esse trecho é executado.",
      "Leia o código em três perguntas: qual dado entra, qual regra é aplicada e qual resultado aparece na página?",
      "Use a gaveta Explicação da etapa antes de escrever o trecho; nela estão as partes, o motivo, o resultado esperado e os alertas.",
      "Depois do primeiro teste correto, altere apenas um valor para descobrir qual parte da lógica controla o comportamento.",
      "Evite este erro frequente: Esquecer parênteses na fórmula Fahrenheit.",
      "Teste orientado: 0 °C = 32 °F"
    ],
    "perguntasGuia": [
      "Qual problema da atividade é resolvido por `fórmulas`?",
      "Qual é a diferença entre `fórmulas` e `limpeza de campo` neste exercício?",
      "Que valor é lido antes da regra e que resultado é produzido depois?",
      "Como você explicaria a lógica de um conversor de temperaturas sem ler o código palavra por palavra?",
      "O que aconteceria se este erro fosse cometido: Esquecer parênteses na fórmula Fahrenheit."
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Cenário de teste: 0 °C = 32 °F",
      "Cenário de teste: 0 °C = 273.15 K",
      "Exemplo guiado: execute um conversor de temperaturas com os valores usados no tutorial.",
      "Variação: altere somente uma entrada e compare o novo resultado com o anterior."
    ],
    "glossarioExtra": [
      {
        "termo": "Celsius",
        "tipo": "Escala de temperatura",
        "definicao": "Escala que usa 0 °C para o congelamento da água em condições padrão."
      },
      {
        "termo": "Fahrenheit",
        "tipo": "Escala de temperatura",
        "definicao": "Escala usada em alguns países e obtida por uma fórmula de conversão."
      },
      {
        "termo": "Kelvin",
        "tipo": "Escala de temperatura",
        "definicao": "Escala absoluta usada em contextos científicos."
      },
      {
        "termo": "conversão",
        "tipo": "Transformação de valor",
        "definicao": "Cálculo que representa a mesma grandeza em outra unidade ou formato."
      }
    ],
    "comparacoes": [
      {
        "titulo": "Valor de entrada",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "A temperatura começa em uma escala conhecida."
      },
      {
        "titulo": "Valor transformado",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "A fórmula cria uma nova representação da mesma grandeza."
      }
    ],
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 8,
    "studentReferenceStripped": true,
    "titulo": "Exercício 08 — Média e Situação do Aluno com JavaScript",
    "nomeCurto": "Média e situação",
    "tema": "Condições encadeadas",
    "objetivo": "Calcular a média e classificar a situação do aluno.",
    "retomadas": [
      "input",
      "Number",
      "operações",
      "funções"
    ],
    "novos": [
      "if",
      "else if",
      "else"
    ],
    "pasta": "exercicio-08",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
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
          "titulo": "Duas notas",
          "linhas": [
            12,
            16
          ],
          "explicacao": "Os campos recebem as duas notas.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Duas notas”.",
            "A função desta parte é: Os campos recebem as duas notas.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "<input>",
              "descricao": "Campo de entrada usado para capturar um valor do usuário."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um classificador de média escolar ficará disponível na página.",
          "alerta": "Colocar media >= 5 antes de media >= 7."
        },
        {
          "titulo": "Calcular e mostrar",
          "linhas": [
            18,
            20
          ],
          "explicacao": "O botão chama a função e o parágrafo exibe o resultado.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Calcular e mostrar”.",
            "A função desta parte é: O botão chama a função e o parágrafo exibe o resultado.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            },
            {
              "nome": "onclick",
              "descricao": "Atributo HTML que chama uma função quando ocorre um clique."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um classificador de média escolar ficará disponível na página.",
          "alerta": "Colocar media >= 5 antes de media >= 7."
        }
      ],
      "css": [
        {
          "titulo": "Interface",
          "linhas": [
            1,
            57
          ],
          "explicacao": "O card mantém o padrão visual das atividades anteriores.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Interface”.",
            "A função desta parte é: O card mantém o padrão visual das atividades anteriores.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Colocar media >= 5 antes de media >= 7."
        }
      ],
      "js": [
        {
          "titulo": "Captura e média",
          "linhas": [
            1,
            6
          ],
          "explicacao": "As notas são convertidas e a média é calculada.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Captura e média”.",
            "A função desta parte é: As notas são convertidas e a média é calculada.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            },
            {
              "nome": "Number()",
              "descricao": "Converte um valor para número."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um classificador de média escolar responderá aos dados ou ações do usuário.",
          "alerta": "Colocar media >= 5 antes de media >= 7.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Cálculo: Produz o valor numérico que será analisado."
        },
        {
          "titulo": "Classificação",
          "linhas": [
            8,
            14
          ],
          "explicacao": "if, else if e else separam as três situações.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Classificação”.",
            "A função desta parte é: if, else if e else separam as três situações.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "else if",
              "descricao": "Testa uma nova condição quando a anterior foi falsa."
            },
            {
              "nome": "else",
              "descricao": "Executa o caminho alternativo quando as condições anteriores são falsas."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um classificador de média escolar responderá aos dados ou ações do usuário.",
          "alerta": "Colocar media >= 5 antes de media >= 7.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Resultado final",
          "linhas": [
            16,
            17
          ],
          "explicacao": "A página mostra média e situação.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Resultado final”.",
            "A função desta parte é: A página mostra média e situação.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um classificador de média escolar responderá aos dados ou ações do usuário.",
          "alerta": "Colocar media >= 5 antes de media >= 7.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Classificação: Transforma o número em uma situação compreensível."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 08 — Média e Situação do Aluno com JavaScript",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como o JavaScript pode capturar notas digitadas, calcular a média e exibir a situação do aluno.\n\n**O que será desenvolvido**\n\nNeste exercício, será criada uma calculadora de média com dois campos de notas, um botão e uma área de resultado.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-08`.\n\nArquivos obrigatórios:\n- `index.html`\n- `estilo.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá classificar o aluno como aprovado, em recuperação ou reprovado conforme a média.\n\n**Como testar**\n\n- Regras: média maior ou igual a 7 — Aprovado; média maior ou igual a 5 — Recuperação; média abaixo de 5 — Reprovado.\n- 8 e 6 = média 7, aprovado.\n- 6 e 4 = média 5, recuperação.\n- 4 e 2 = média 3, reprovado.\n- Abrir cada gaveta e relacionar seu conteúdo com a etapa atual.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-08` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como o JavaScript pode capturar notas digitadas, calcular a média e exibir a situação do aluno.",
      "desenvolvimento": "Neste exercício, será criada uma calculadora de média com dois campos de notas, um botão e uma área de resultado.",
      "funcionamento": "O programa deverá classificar o aluno como aprovado, em recuperação ou reprovado conforme a média.",
      "testes": [
        "Regras: média maior ou igual a 7 — Aprovado; média maior ou igual a 5 — Recuperação; média abaixo de 5 — Reprovado.",
        "8 e 6 = média 7, aprovado.",
        "6 e 4 = média 5, recuperação.",
        "4 e 2 = média 3, reprovado.",
        "Abrir cada gaveta e relacionar seu conteúdo com a etapa atual."
      ],
      "arquivos": [
        "index.html",
        "estilo.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-08` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "contextoDetalhado": [
      "A atividade constrói um classificador de média escolar.",
      "Em aplicações reais, regras de negócio convertem um cálculo em uma situação compreensível.",
      "O exercício conecta input, Number, operações aos novos recursos if, else if, else.",
      "O tutorial separa estrutura, aparência e comportamento para mostrar como cada arquivo contribui para o resultado final.",
      "As gavetas podem ser abertas a qualquer momento para revisar o contexto, consultar exemplos, entender o trecho atual e conferir o glossário."
    ],
    "fluxoAprendizagem": [
      "Estrutura: Duas notas",
      "Estrutura: Calcular e mostrar",
      "Aparência: Interface",
      "Captura e média",
      "Classificação",
      "Resultado final"
    ],
    "dicasExtras": [
      "Localize no código onde aparece `if` e observe o que muda no preview quando esse trecho é executado.",
      "Leia o código em três perguntas: qual dado entra, qual regra é aplicada e qual resultado aparece na página?",
      "Use a gaveta Explicação da etapa antes de escrever o trecho; nela estão as partes, o motivo, o resultado esperado e os alertas.",
      "Depois do primeiro teste correto, altere apenas um valor para descobrir qual parte da lógica controla o comportamento.",
      "Evite este erro frequente: Colocar media >= 5 antes de media >= 7.",
      "Teste orientado: 8 e 6 = média 7, aprovado"
    ],
    "perguntasGuia": [
      "Qual problema da atividade é resolvido por `if`?",
      "Qual é a diferença entre `if` e `else if` neste exercício?",
      "Que valor é lido antes da regra e que resultado é produzido depois?",
      "Como você explicaria a lógica de um classificador de média escolar sem ler o código palavra por palavra?",
      "O que aconteceria se este erro fosse cometido: Colocar media >= 5 antes de media >= 7."
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Cenário de teste: 8 e 6 = média 7, aprovado",
      "Cenário de teste: 6 e 4 = média 5, recuperação",
      "Cenário de teste: 4 e 2 = média 3, reprovado"
    ],
    "glossarioExtra": [
      {
        "termo": "média",
        "tipo": "Resultado de cálculo",
        "definicao": "Valor obtido ao somar notas e dividir pela quantidade considerada."
      },
      {
        "termo": "situação",
        "tipo": "Classificação",
        "definicao": "Texto que comunica o resultado de uma regra, como aprovado ou recuperação."
      },
      {
        "termo": "aprovação",
        "tipo": "Regra de negócio",
        "definicao": "Condição usada para decidir se uma média atende ao limite definido."
      },
      {
        "termo": "else if",
        "tipo": "Estrutura condicional",
        "definicao": "Permite testar uma nova condição quando a anterior foi falsa."
      }
    ],
    "comparacoes": [
      {
        "titulo": "Cálculo",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Produz o valor numérico que será analisado."
      },
      {
        "titulo": "Classificação",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Transforma o número em uma situação compreensível."
      }
    ],
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 9,
    "studentReferenceStripped": true,
    "titulo": "Exercício 09 — Validação de Campo com JavaScript",
    "nomeCurto": "Validação de campo",
    "tema": "Validação de entrada",
    "objetivo": "Verificar se um nome foi preenchido corretamente.",
    "retomadas": [
      "input",
      "value",
      "if/else"
    ],
    "novos": [
      "trim",
      "length",
      "validação em três situações"
    ],
    "pasta": "exercicio-09",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
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
          "titulo": "Campo e botão",
          "linhas": [
            12,
            15
          ],
          "explicacao": "O input recebe o nome e o botão inicia a validação.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Campo e botão”.",
            "A função desta parte é: O input recebe o nome e o botão inicia a validação.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "<input>",
              "descricao": "Campo de entrada usado para capturar um valor do usuário."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma validação de nome em três situações ficará disponível na página.",
          "alerta": "Não usar trim e aceitar apenas espaços."
        },
        {
          "titulo": "Área de mensagem",
          "linhas": [
            17,
            17
          ],
          "explicacao": "O parágrafo mostrará o resultado.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Área de mensagem”.",
            "A função desta parte é: O parágrafo mostrará o resultado.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "Área de mensagem",
              "descricao": "Trecho selecionado pelo tutorial para construir uma parte específica da atividade."
            },
            {
              "nome": "Linhas 17–17",
              "descricao": "Intervalo validado dentro do arquivo HTML."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma validação de nome em três situações ficará disponível na página.",
          "alerta": "Não usar trim e aceitar apenas espaços."
        }
      ],
      "css": [
        {
          "titulo": "Interface",
          "linhas": [
            1,
            57
          ],
          "explicacao": "O card segue o padrão visual dos exercícios anteriores.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Interface”.",
            "A função desta parte é: O card segue o padrão visual dos exercícios anteriores.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Não usar trim e aceitar apenas espaços."
        }
      ],
      "js": [
        {
          "titulo": "Limpeza do texto",
          "linhas": [
            1,
            3
          ],
          "explicacao": "trim remove espaços das extremidades.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Limpeza do texto”.",
            "A função desta parte é: trim remove espaços das extremidades.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma validação de nome em três situações responderá aos dados ou ações do usuário.",
          "alerta": "Não usar trim e aceitar apenas espaços.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Texto original: Pode conter espaços antes e depois."
        },
        {
          "titulo": "Três verificações",
          "linhas": [
            5,
            11
          ],
          "explicacao": "O programa verifica vazio, menos de três caracteres ou válido.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Três verificações”.",
            "A função desta parte é: O programa verifica vazio, menos de três caracteres ou válido.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "else if",
              "descricao": "Testa uma nova condição quando a anterior foi falsa."
            },
            {
              "nome": "else",
              "descricao": "Executa o caminho alternativo quando as condições anteriores são falsas."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma validação de nome em três situações responderá aos dados ou ações do usuário.",
          "alerta": "Não usar trim e aceitar apenas espaços.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Mensagem final",
          "linhas": [
            13,
            14
          ],
          "explicacao": "A mensagem escolhida é colocada na página.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Mensagem final”.",
            "A função desta parte é: A mensagem escolhida é colocada na página.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma validação de nome em três situações responderá aos dados ou ações do usuário.",
          "alerta": "Não usar trim e aceitar apenas espaços.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Texto tratado: Remove espaços externos antes de validar o tamanho."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 09 — Validação de Campo com JavaScript",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como o JavaScript pode capturar um texto, verificar se o campo foi preenchido corretamente e exibir uma mensagem de validação.\n\n**O que será desenvolvido**\n\nNeste exercício, será criada uma página com um campo para digitar o nome, um botão de validação e uma área de mensagem.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-09`.\n\nArquivos obrigatórios:\n- `index.html`\n- `estilo.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá verificar campo vazio, nome com menos de três caracteres e campo preenchido corretamente.\n\n**Como testar**\n\n- Campo vazio.\n- Nome com 2 caracteres.\n- Nome com 3 ou mais.\n- Abrir cada gaveta e relacionar seu conteúdo com a etapa atual.\n- Executar o caso principal e depois alterar apenas uma entrada.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-09` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como o JavaScript pode capturar um texto, verificar se o campo foi preenchido corretamente e exibir uma mensagem de validação.",
      "desenvolvimento": "Neste exercício, será criada uma página com um campo para digitar o nome, um botão de validação e uma área de mensagem.",
      "funcionamento": "O programa deverá verificar campo vazio, nome com menos de três caracteres e campo preenchido corretamente.",
      "testes": [
        "Campo vazio.",
        "Nome com 2 caracteres.",
        "Nome com 3 ou mais.",
        "Abrir cada gaveta e relacionar seu conteúdo com a etapa atual.",
        "Executar o caso principal e depois alterar apenas uma entrada."
      ],
      "arquivos": [
        "index.html",
        "estilo.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-09` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "contextoDetalhado": [
      "A atividade constrói uma validação de nome em três situações.",
      "Em aplicações reais, formulários precisam impedir dados vazios, incompletos ou inadequados.",
      "O exercício conecta input, value, if/else aos novos recursos trim, length, validação em três situações.",
      "O tutorial separa estrutura, aparência e comportamento para mostrar como cada arquivo contribui para o resultado final.",
      "As gavetas podem ser abertas a qualquer momento para revisar o contexto, consultar exemplos, entender o trecho atual e conferir o glossário."
    ],
    "fluxoAprendizagem": [
      "Estrutura: Campo e botão",
      "Estrutura: Área de mensagem",
      "Aparência: Interface",
      "Limpeza do texto",
      "Três verificações",
      "Mensagem final"
    ],
    "dicasExtras": [
      "Localize no código onde aparece `trim` e observe o que muda no preview quando esse trecho é executado.",
      "Leia o código em três perguntas: qual dado entra, qual regra é aplicada e qual resultado aparece na página?",
      "Use a gaveta Explicação da etapa antes de escrever o trecho; nela estão as partes, o motivo, o resultado esperado e os alertas.",
      "Depois do primeiro teste correto, altere apenas um valor para descobrir qual parte da lógica controla o comportamento.",
      "Evite este erro frequente: Não usar trim e aceitar apenas espaços.",
      "Teste orientado: Campo vazio"
    ],
    "perguntasGuia": [
      "Qual problema da atividade é resolvido por `trim`?",
      "Qual é a diferença entre `trim` e `length` neste exercício?",
      "Que valor é lido antes da regra e que resultado é produzido depois?",
      "Como você explicaria a lógica de uma validação de nome em três situações sem ler o código palavra por palavra?",
      "O que aconteceria se este erro fosse cometido: Não usar trim e aceitar apenas espaços."
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Cenário de teste: Campo vazio",
      "Cenário de teste: Nome com 2 caracteres",
      "Cenário de teste: Nome com 3 ou mais"
    ],
    "glossarioExtra": [
      {
        "termo": "validação",
        "tipo": "Verificação de entrada",
        "definicao": "Conjunto de regras que decide se um dado pode ser aceito."
      },
      {
        "termo": "trim",
        "tipo": "Método de string",
        "definicao": "Remove espaços do início e do fim de um texto."
      },
      {
        "termo": "length",
        "tipo": "Propriedade de tamanho",
        "definicao": "Informa a quantidade de caracteres de uma string ou itens de um array."
      },
      {
        "termo": "campo obrigatório",
        "tipo": "Regra de formulário",
        "definicao": "Campo que precisa possuir um valor válido antes de continuar."
      }
    ],
    "comparacoes": [
      {
        "titulo": "Texto original",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Pode conter espaços antes e depois."
      },
      {
        "titulo": "Texto tratado",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Remove espaços externos antes de validar o tamanho."
      }
    ],
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 10,
    "studentReferenceStripped": true,
    "titulo": "Exercício 10 — Login Simples com Condição em JavaScript",
    "nomeCurto": "Login simples",
    "tema": "Condições e operadores lógicos",
    "objetivo": "Validar um login didático em três situações.",
    "retomadas": [
      "inputs",
      "value",
      "trim",
      "if/else"
    ],
    "novos": [
      "else if",
      "===",
      "||",
      "&&"
    ],
    "pasta": "exercicio-10",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
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
          "titulo": "Estrutura e arquivo CSS",
          "linhas": [
            1,
            8
          ],
          "explicacao": "A estrutura inicial configura o documento e liga o CSS.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Estrutura e arquivo CSS”.",
            "A função desta parte é: A estrutura inicial configura o documento e liga o CSS.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<!DOCTYPE html>",
              "descricao": "Informa ao navegador que o documento usa o padrão HTML5."
            },
            {
              "nome": "<html>",
              "descricao": "Elemento raiz que envolve todo o documento."
            },
            {
              "nome": "<head>",
              "descricao": "Reúne configurações e referências que não formam o conteúdo principal."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um login didático com condições ficará disponível na página.",
          "alerta": "Usar = no lugar de ===."
        },
        {
          "titulo": "Campos de login",
          "linhas": [
            10,
            18
          ],
          "explicacao": "O card possui campos de usuário e senha identificados por id.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Campos de login”.",
            "A função desta parte é: O card possui campos de usuário e senha identificados por id.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<input>",
              "descricao": "Campo de entrada usado para capturar um valor do usuário."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um login didático com condições ficará disponível na página.",
          "alerta": "Trocar && por || na credencial correta."
        },
        {
          "titulo": "Ações e resultado",
          "linhas": [
            20,
            27
          ],
          "explicacao": "Os botões chamam as funções e o parágrafo mostra o resultado.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Ações e resultado”.",
            "A função desta parte é: Os botões chamam as funções e o parágrafo mostra o resultado.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            },
            {
              "nome": "onclick",
              "descricao": "Atributo HTML que chama uma função quando ocorre um clique."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um login didático com condições ficará disponível na página.",
          "alerta": "Usar = no lugar de ===."
        },
        {
          "titulo": "Ligação com JavaScript",
          "linhas": [
            29,
            31
          ],
          "explicacao": "O script é carregado ao final do body.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Ligação com JavaScript”.",
            "A função desta parte é: O script é carregado ao final do body.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<script>",
              "descricao": "Liga ou contém o código JavaScript executado pela página."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um login didático com condições ficará disponível na página.",
          "alerta": "Trocar && por || na credencial correta."
        }
      ],
      "css": [
        {
          "titulo": "Configuração geral",
          "linhas": [
            1,
            11
          ],
          "explicacao": "box-sizing organiza as medidas e o body centraliza a página.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Configuração geral”.",
            "A função desta parte é: box-sizing organiza as medidas e o body centraliza a página.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Usar = no lugar de ===."
        },
        {
          "titulo": "Card",
          "linhas": [
            13,
            20
          ],
          "explicacao": "A classe container cria a área branca central.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Card”.",
            "A função desta parte é: A classe container cria a área branca central.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Trocar && por || na credencial correta."
        },
        {
          "titulo": "Campos",
          "linhas": [
            27,
            42
          ],
          "explicacao": "Labels e inputs são organizados em coluna.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Campos”.",
            "A função desta parte é: Labels e inputs são organizados em coluna.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Usar = no lugar de ===."
        },
        {
          "titulo": "Botões",
          "linhas": [
            44,
            69
          ],
          "explicacao": "Os botões usam cores diferentes e estados hover.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Botões”.",
            "A função desta parte é: Os botões usam cores diferentes e estados hover.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: flex",
              "descricao": "Organiza elementos em um eixo flexível."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Trocar && por || na credencial correta."
        },
        {
          "titulo": "Mensagens e celular",
          "linhas": [
            71,
            94
          ],
          "explicacao": "Resultado, dica e media query completam a interface.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Mensagens e celular”.",
            "A função desta parte é: Resultado, dica e media query completam a interface.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "@media",
              "descricao": "Regra que aplica estilos conforme as características da tela."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Usar = no lugar de ===."
        }
      ],
      "js": [
        {
          "titulo": "Captura dos valores",
          "linhas": [
            1,
            4
          ],
          "explicacao": "Usuário, senha e elemento de resultado são recuperados.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Captura dos valores”.",
            "A função desta parte é: Usuário, senha e elemento de resultado são recuperados.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um login didático com condições responderá aos dados ou ações do usuário.",
          "alerta": "Usar = no lugar de ===.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "E lógico: As duas comparações precisam ser verdadeiras."
        },
        {
          "titulo": "Campos vazios",
          "linhas": [
            6,
            8
          ],
          "explicacao": "O operador || aceita que qualquer campo vazio gere o aviso.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Campos vazios”.",
            "A função desta parte é: O operador || aceita que qualquer campo vazio gere o aviso.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um login didático com condições responderá aos dados ou ações do usuário.",
          "alerta": "Trocar && por || na credencial correta.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Credenciais corretas",
          "linhas": [
            9,
            11
          ],
          "explicacao": "O operador && exige usuário e senha corretos ao mesmo tempo.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Credenciais corretas”.",
            "A função desta parte é: O operador && exige usuário e senha corretos ao mesmo tempo.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "else if",
              "descricao": "Testa uma nova condição quando a anterior foi falsa."
            },
            {
              "nome": "else",
              "descricao": "Executa o caminho alternativo quando as condições anteriores são falsas."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um login didático com condições responderá aos dados ou ações do usuário.",
          "alerta": "Usar = no lugar de ===.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "OU lógico: Basta uma das comparações ser verdadeira."
        },
        {
          "titulo": "Acesso negado",
          "linhas": [
            12,
            15
          ],
          "explicacao": "O else trata todas as demais combinações.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Acesso negado”.",
            "A função desta parte é: O else trata todas as demais combinações.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "else",
              "descricao": "Executa o caminho alternativo quando as condições anteriores são falsas."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um login didático com condições responderá aos dados ou ações do usuário.",
          "alerta": "Trocar && por || na credencial correta.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Limpeza",
          "linhas": [
            18,
            24
          ],
          "explicacao": "A segunda função limpa campos, mensagem e devolve o foco.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Limpeza”.",
            "A função desta parte é: A segunda função limpa campos, mensagem e devolve o foco.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um login didático com condições responderá aos dados ou ações do usuário.",
          "alerta": "Usar = no lugar de ===.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "OU lógico: Basta uma das comparações ser verdadeira."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 10 — Login Simples com Condição em JavaScript",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como o JavaScript pode capturar dados digitados pelo usuário, comparar informações e exibir uma mensagem de acesso na página.\n\n**O que será desenvolvido**\n\nNeste exercício, será criada uma página de login com campos de usuário e senha, botões para entrar e limpar e uma área de mensagem.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-10`.\n\nArquivos obrigatórios:\n- `index.html`\n- `estilo.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá verificar campos vazios, credenciais incorretas e credenciais preenchidas corretamente.\n\n**Como testar**\n\n- Para realizar o teste, utilize:.\n- Usuário: `aluno`  \nSenha: `1234`.\n- Campos vazios.\n- Usuário incorreto.\n- Senha incorreta.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-10` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como o JavaScript pode capturar dados digitados pelo usuário, comparar informações e exibir uma mensagem de acesso na página.",
      "desenvolvimento": "Neste exercício, será criada uma página de login com campos de usuário e senha, botões para entrar e limpar e uma área de mensagem.",
      "funcionamento": "O programa deverá verificar campos vazios, credenciais incorretas e credenciais preenchidas corretamente.",
      "testes": [
        "Para realizar o teste, utilize:.",
        "Usuário: `aluno`  \nSenha: `1234`.",
        "Campos vazios.",
        "Usuário incorreto.",
        "Senha incorreta."
      ],
      "arquivos": [
        "index.html",
        "estilo.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-10` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "contextoDetalhado": [
      "A atividade constrói um login didático com condições.",
      "Em aplicações reais, telas de acesso comparam credenciais e informam claramente cada resultado.",
      "O exercício conecta inputs, value, trim aos novos recursos else if, ===, ||, &&.",
      "O tutorial separa estrutura, aparência e comportamento para mostrar como cada arquivo contribui para o resultado final.",
      "As gavetas podem ser abertas a qualquer momento para revisar o contexto, consultar exemplos, entender o trecho atual e conferir o glossário."
    ],
    "fluxoAprendizagem": [
      "Estrutura: Estrutura e arquivo CSS",
      "Estrutura: Campos de login",
      "Estrutura: Ações e resultado",
      "Estrutura: Ligação com JavaScript",
      "Aparência: Configuração geral",
      "Aparência: Card",
      "Aparência: Campos",
      "Aparência: Botões"
    ],
    "dicasExtras": [
      "Localize no código onde aparece `else if` e observe o que muda no preview quando esse trecho é executado.",
      "Leia o código em três perguntas: qual dado entra, qual regra é aplicada e qual resultado aparece na página?",
      "Use a gaveta Explicação da etapa antes de escrever o trecho; nela estão as partes, o motivo, o resultado esperado e os alertas.",
      "Depois do primeiro teste correto, altere apenas um valor para descobrir qual parte da lógica controla o comportamento.",
      "Evite este erro frequente: Usar = no lugar de ===.",
      "Teste orientado: Campos vazios"
    ],
    "perguntasGuia": [
      "Qual problema da atividade é resolvido por `else if`?",
      "Qual é a diferença entre `else if` e `===` neste exercício?",
      "Que valor é lido antes da regra e que resultado é produzido depois?",
      "Como você explicaria a lógica de um login didático com condições sem ler o código palavra por palavra?",
      "O que aconteceria se este erro fosse cometido: Usar = no lugar de ===."
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Cenário de teste: Campos vazios",
      "Cenário de teste: Usuário incorreto",
      "Cenário de teste: Senha incorreta"
    ],
    "glossarioExtra": [
      {
        "termo": "credencial",
        "tipo": "Dado de acesso",
        "definicao": "Informação apresentada para verificar uma tentativa de entrada."
      },
      {
        "termo": "autenticação",
        "tipo": "Verificação de identidade",
        "definicao": "Processo de conferir se as credenciais correspondem ao acesso esperado."
      },
      {
        "termo": "condição composta",
        "tipo": "Expressão lógica",
        "definicao": "Condição formada pela combinação de duas ou mais comparações."
      },
      {
        "termo": "operador lógico",
        "tipo": "Símbolo lógico",
        "definicao": "Operador como && ou || que combina resultados verdadeiros e falsos."
      }
    ],
    "comparacoes": [
      {
        "titulo": "E lógico",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "As duas comparações precisam ser verdadeiras."
      },
      {
        "titulo": "OU lógico",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Basta uma das comparações ser verdadeira."
      }
    ],
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 11,
    "studentReferenceStripped": true,
    "titulo": "Exercício 11 — Contador com Laço de Repetição em JavaScript",
    "nomeCurto": "Contador com laço",
    "tema": "Laço for e repetição controlada",
    "objetivo": "Gerar uma contagem de 1 até o número informado usando o laço for.",
    "retomadas": [
      "input",
      "value",
      "Number()",
      "if",
      "return",
      "innerText"
    ],
    "novos": [
      "for",
      "contador",
      "numero++",
      "+=",
      "<="
    ],
    "pasta": "exercicio-11",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
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
          "titulo": "Estrutura e ligação com o CSS",
          "linhas": [
            1,
            9
          ],
          "explicacao": "A estrutura inicial prepara o documento, adapta a página para diferentes telas e conecta o arquivo estilo.css.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Estrutura e ligação com o CSS”.",
            "A função desta parte é: A estrutura inicial prepara o documento, adapta a página para diferentes telas e conecta o arquivo estilo.css.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<!DOCTYPE html>",
              "descricao": "Informa ao navegador que o documento usa o padrão HTML5."
            },
            {
              "nome": "<html>",
              "descricao": "Elemento raiz que envolve todo o documento."
            },
            {
              "nome": "<head>",
              "descricao": "Reúne configurações e referências que não formam o conteúdo principal."
            },
            {
              "nome": "<body>",
              "descricao": "Contém os elementos visíveis e interativos da página."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um gerador de contagem com laço for ficará disponível na página.",
          "alerta": "Esquecer numero++ e criar repetição infinita."
        },
        {
          "titulo": "Título e orientação",
          "linhas": [
            10,
            13
          ],
          "explicacao": "O conteúdo principal informa o objetivo da página antes da interação.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Título e orientação”.",
            "A função desta parte é: O conteúdo principal informa o objetivo da página antes da interação.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um gerador de contagem com laço for ficará disponível na página.",
          "alerta": "Usar numero < limite e não mostrar o último número."
        },
        {
          "titulo": "Campo numérico",
          "linhas": [
            14,
            17
          ],
          "explicacao": "O input recebe o número final. Os atributos min e max registram os limites de 1 a 100.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Campo numérico”.",
            "A função desta parte é: O input recebe o número final. Os atributos min e max registram os limites de 1 a 100.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "<input>",
              "descricao": "Campo de entrada usado para capturar um valor do usuário."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um gerador de contagem com laço for ficará disponível na página.",
          "alerta": "Esquecer Number() e comparar texto em situações futuras."
        },
        {
          "titulo": "Botões e resultado",
          "linhas": [
            18,
            28
          ],
          "explicacao": "Os botões chamam as funções e a seção apresenta mensagens e a contagem.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Botões e resultado”.",
            "A função desta parte é: Os botões chamam as funções e a seção apresenta mensagens e a contagem.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            },
            {
              "nome": "onclick",
              "descricao": "Atributo HTML que chama uma função quando ocorre um clique."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um gerador de contagem com laço for ficará disponível na página.",
          "alerta": "Colocar o resultado dentro do laço e substituir o texto a cada repetição."
        },
        {
          "titulo": "Ligação com JavaScript",
          "linhas": [
            30,
            32
          ],
          "explicacao": "O arquivo script.js é carregado no final para controlar a página.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Ligação com JavaScript”.",
            "A função desta parte é: O arquivo script.js é carregado no final para controlar a página.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<script>",
              "descricao": "Liga ou contém o código JavaScript executado pela página."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um gerador de contagem com laço for ficará disponível na página.",
          "alerta": "Esquecer numero++ e criar repetição infinita."
        }
      ],
      "css": [
        {
          "titulo": "Configuração geral",
          "linhas": [
            1,
            11
          ],
          "explicacao": "O box-sizing facilita as medidas e o body define fonte, cores, margem e espaçamento.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Configuração geral”.",
            "A função desta parte é: O box-sizing facilita as medidas e o body define fonte, cores, margem e espaçamento.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Esquecer numero++ e criar repetição infinita."
        },
        {
          "titulo": "Cartão principal",
          "linhas": [
            13,
            21
          ],
          "explicacao": "A classe container cria o cartão central, limita a largura e adiciona sombra.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Cartão principal”.",
            "A função desta parte é: A classe container cria o cartão central, limita a largura e adiciona sombra.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Usar numero < limite e não mostrar o último número."
        },
        {
          "titulo": "Campo e foco",
          "linhas": [
            34,
            52
          ],
          "explicacao": "O label identifica o campo e o estado de foco ajuda o aluno a localizar onde está digitando.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Campo e foco”.",
            "A função desta parte é: O label identifica o campo e o estado de foco ajuda o aluno a localizar onde está digitando.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Esquecer Number() e comparar texto em situações futuras."
        },
        {
          "titulo": "Botões",
          "linhas": [
            54,
            81
          ],
          "explicacao": "Os botões ficam alinhados, possuem cores diferentes e mudam ao passar o mouse.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Botões”.",
            "A função desta parte é: Os botões ficam alinhados, possuem cores diferentes e mudam ao passar o mouse.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: flex",
              "descricao": "Organiza elementos em um eixo flexível."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Colocar o resultado dentro do laço e substituir o texto a cada repetição."
        },
        {
          "titulo": "Resultado e celular",
          "linhas": [
            83,
            90
          ],
          "explicacao": "A área de resultado destaca a contagem. A media query, mais abaixo, adapta os elementos ao celular.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Resultado e celular”.",
            "A função desta parte é: A área de resultado destaca a contagem. A media query, mais abaixo, adapta os elementos ao celular.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Esquecer numero++ e criar repetição infinita."
        }
      ],
      "js": [
        {
          "titulo": "Captura dos elementos",
          "linhas": [
            1,
            7
          ],
          "explicacao": "A função recupera o valor digitado e os dois elementos usados para mostrar mensagens.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Captura dos elementos”.",
            "A função desta parte é: A função recupera o valor digitado e os dois elementos usados para mostrar mensagens.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um gerador de contagem com laço for responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer numero++ e criar repetição infinita.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Repetição manual: Funciona somente para uma sequência previamente escrita."
        },
        {
          "titulo": "Campo obrigatório",
          "linhas": [
            8,
            12
          ],
          "explicacao": "A primeira condição impede a execução quando o campo está vazio.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Campo obrigatório”.",
            "A função desta parte é: A primeira condição impede a execução quando o campo está vazio.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um gerador de contagem com laço for responderá aos dados ou ações do usuário.",
          "alerta": "Usar numero < limite e não mostrar o último número.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Conversão e limites",
          "linhas": [
            14,
            19
          ],
          "explicacao": "Number converte o valor para número e a condição aceita somente valores de 1 a 100.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Conversão e limites”.",
            "A função desta parte é: Number converte o valor para número e a condição aceita somente valores de 1 a 100.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "Number()",
              "descricao": "Converte um valor para número."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um gerador de contagem com laço for responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer Number() e comparar texto em situações futuras.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Repetição com for: Adapta a quantidade de repetições ao valor informado."
        },
        {
          "titulo": "Laço de repetição for",
          "linhas": [
            22,
            31
          ],
          "explicacao": "O for começa em 1, repete enquanto numero for menor ou igual ao limite e soma 1 com numero++.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Laço de repetição for”.",
            "A função desta parte é: O for começa em 1, repete enquanto numero for menor ou igual ao limite e soma 1 com numero++.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "for",
              "descricao": "Controla uma repetição por inicialização, condição e atualização."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um gerador de contagem com laço for responderá aos dados ou ações do usuário.",
          "alerta": "Colocar o resultado dentro do laço e substituir o texto a cada repetição.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Mensagem e limpeza",
          "linhas": [
            32,
            44
          ],
          "explicacao": "O resultado é mostrado na página e a segunda função permite reiniciar a atividade.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Mensagem e limpeza”.",
            "A função desta parte é: O resultado é mostrado na página e a segunda função permite reiniciar a atividade.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um gerador de contagem com laço for responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer numero++ e criar repetição infinita.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Repetição com for: Adapta a quantidade de repetições ao valor informado."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 11 — Contador com Laço de Repetição em JavaScript",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como o JavaScript pode repetir instruções com o laço `for`, formando uma contagem na página.\n\n**O que será desenvolvido**\n\nNeste exercício, será criada uma página com um campo para informar o número final da contagem, um botão para gerar, um botão para limpar e uma área para apresentar os números gerados.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-11`.\n\nArquivos obrigatórios:\n- `index.html`\n- `estilo.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá verificar se o campo foi preenchido, aceitar números entre 1 e 100 e utilizar um laço de repetição para mostrar a contagem de 1 até o número informado.\n\n**Como testar**\n\n- Campo vazio.\n- Número 0.\n- Número 101.\n- Número 1.\n- Número 5.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-11` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como o JavaScript pode repetir instruções com o laço `for`, formando uma contagem na página.",
      "desenvolvimento": "Neste exercício, será criada uma página com um campo para informar o número final da contagem, um botão para gerar, um botão para limpar e uma área para apresentar os números gerados.",
      "funcionamento": "O programa deverá verificar se o campo foi preenchido, aceitar números entre 1 e 100 e utilizar um laço de repetição para mostrar a contagem de 1 até o número informado.",
      "testes": [
        "Campo vazio.",
        "Número 0.",
        "Número 101.",
        "Número 1.",
        "Número 5."
      ],
      "arquivos": [
        "index.html",
        "estilo.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-11` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "contextoDetalhado": [
      "A atividade constrói um gerador de contagem com laço for.",
      "Em aplicações reais, repetições automatizam tarefas que seriam cansativas e sujeitas a erro quando escritas linha por linha.",
      "O exercício conecta input, value, Number() aos novos recursos for, contador, numero++, +=.",
      "O tutorial separa estrutura, aparência e comportamento para mostrar como cada arquivo contribui para o resultado final.",
      "As gavetas podem ser abertas a qualquer momento para revisar o contexto, consultar exemplos, entender o trecho atual e conferir o glossário."
    ],
    "fluxoAprendizagem": [
      "Estrutura: Estrutura e ligação com o CSS",
      "Estrutura: Título e orientação",
      "Estrutura: Campo numérico",
      "Estrutura: Botões e resultado",
      "Estrutura: Ligação com JavaScript",
      "Aparência: Configuração geral",
      "Aparência: Cartão principal",
      "Aparência: Campo e foco"
    ],
    "dicasExtras": [
      "Localize no código onde aparece `for` e observe o que muda no preview quando esse trecho é executado.",
      "Leia o código em três perguntas: qual dado entra, qual regra é aplicada e qual resultado aparece na página?",
      "Use a gaveta Explicação da etapa antes de escrever o trecho; nela estão as partes, o motivo, o resultado esperado e os alertas.",
      "Depois do primeiro teste correto, altere apenas um valor para descobrir qual parte da lógica controla o comportamento.",
      "Evite este erro frequente: Esquecer numero++ e criar repetição infinita.",
      "Teste orientado: Campo vazio."
    ],
    "perguntasGuia": [
      "Qual problema da atividade é resolvido por `for`?",
      "Qual é a diferença entre `for` e `contador` neste exercício?",
      "Que valor é lido antes da regra e que resultado é produzido depois?",
      "Como você explicaria a lógica de um gerador de contagem com laço for sem ler o código palavra por palavra?",
      "O que aconteceria se este erro fosse cometido: Esquecer numero++ e criar repetição infinita."
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Cenário de teste: Campo vazio.",
      "Cenário de teste: Número 0."
    ],
    "glossarioExtra": [
      {
        "termo": "laço",
        "tipo": "Estrutura de repetição",
        "definicao": "Bloco que executa comandos várias vezes enquanto uma regra permitir."
      },
      {
        "termo": "contador",
        "tipo": "Variável de estado",
        "definicao": "Número que registra quantas vezes uma ação ocorreu ou qual etapa foi alcançada."
      },
      {
        "termo": "incremento",
        "tipo": "Atualização numérica",
        "definicao": "Aumento de um valor, normalmente em uma unidade."
      },
      {
        "termo": "condição de continuidade",
        "tipo": "Parte do laço",
        "definicao": "Expressão avaliada antes de cada repetição para decidir se o laço continua."
      }
    ],
    "comparacoes": [
      {
        "titulo": "Repetição manual",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Funciona somente para uma sequência previamente escrita."
      },
      {
        "titulo": "Repetição com for",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Adapta a quantidade de repetições ao valor informado."
      }
    ],
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 12,
    "studentReferenceStripped": true,
    "titulo": "Exercício 12 — Identificando Tipos de Dados com JavaScript",
    "nomeCurto": "Tipos de dados",
    "tema": "String, number, boolean e typeof",
    "objetivo": "Capturar três tipos de valores e identificar o tipo de cada um com typeof.",
    "retomadas": [
      "inputs",
      "value",
      "trim",
      "Number()",
      "if",
      "innerText"
    ],
    "novos": [
      "string",
      "number",
      "boolean",
      "typeof",
      "checked",
      "return"
    ],
    "pasta": "exercicio-12",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
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
          "titulo": "Estrutura e ligação com o CSS",
          "linhas": [
            1,
            8
          ],
          "explicacao": "O documento define idioma, codificação, adaptação para telas e carrega o arquivo estilo.css.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Estrutura e ligação com o CSS”.",
            "A função desta parte é: O documento define idioma, codificação, adaptação para telas e carrega o arquivo estilo.css.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<!DOCTYPE html>",
              "descricao": "Informa ao navegador que o documento usa o padrão HTML5."
            },
            {
              "nome": "<html>",
              "descricao": "Elemento raiz que envolve todo o documento."
            },
            {
              "nome": "<head>",
              "descricao": "Reúne configurações e referências que não formam o conteúdo principal."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um inspetor de tipos de dados ficará disponível na página.",
          "alerta": "Usar typeof na value da idade antes de converter e obter string."
        },
        {
          "titulo": "Campos de texto e número",
          "linhas": [
            10,
            18
          ],
          "explicacao": "O nome chega inicialmente como texto. A idade também vem do input como texto e será convertida no JavaScript.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Campos de texto e número”.",
            "A função desta parte é: O nome chega inicialmente como texto. A idade também vem do input como texto e será convertida no JavaScript.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<input>",
              "descricao": "Campo de entrada usado para capturar um valor do usuário."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um inspetor de tipos de dados ficará disponível na página.",
          "alerta": "Esquecer Number() e manter a idade como texto."
        },
        {
          "titulo": "Valor verdadeiro ou falso",
          "linhas": [
            20,
            23
          ],
          "explicacao": "O checkbox informa se a opção está marcada. No JavaScript, esse estado será um valor booleano.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Valor verdadeiro ou falso”.",
            "A função desta parte é: O checkbox informa se a opção está marcada. No JavaScript, esse estado será um valor booleano.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<input>",
              "descricao": "Campo de entrada usado para capturar um valor do usuário."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um inspetor de tipos de dados ficará disponível na página.",
          "alerta": "Usar value no checkbox em vez de checked."
        },
        {
          "titulo": "Botões e área de resultado",
          "linhas": [
            25,
            36
          ],
          "explicacao": "Os botões chamam as funções e a seção reúne as mensagens que mostrarão valores e tipos.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Botões e área de resultado”.",
            "A função desta parte é: Os botões chamam as funções e a seção reúne as mensagens que mostrarão valores e tipos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            },
            {
              "nome": "onclick",
              "descricao": "Atributo HTML que chama uma função quando ocorre um clique."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um inspetor de tipos de dados ficará disponível na página.",
          "alerta": "Esquecer return e continuar mostrando resultados após o erro."
        },
        {
          "titulo": "Ligação com o JavaScript",
          "linhas": [
            39,
            41
          ],
          "explicacao": "O arquivo script.js é carregado no final do body.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Ligação com o JavaScript”.",
            "A função desta parte é: O arquivo script.js é carregado no final do body.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<script>",
              "descricao": "Liga ou contém o código JavaScript executado pela página."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um inspetor de tipos de dados ficará disponível na página.",
          "alerta": "Usar typeof na value da idade antes de converter e obter string."
        }
      ],
      "css": [
        {
          "titulo": "Configuração geral",
          "linhas": [
            1,
            11
          ],
          "explicacao": "box-sizing organiza as medidas e o body define fonte, cores e espaçamento.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Configuração geral”.",
            "A função desta parte é: box-sizing organiza as medidas e o body define fonte, cores e espaçamento.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Usar typeof na value da idade antes de converter e obter string."
        },
        {
          "titulo": "Card principal",
          "linhas": [
            13,
            32
          ],
          "explicacao": "A classe container cria o cartão central e os textos iniciais.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Card principal”.",
            "A função desta parte é: A classe container cria o cartão central e os textos iniciais.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Esquecer Number() e manter a idade como texto."
        },
        {
          "titulo": "Campos e foco",
          "linhas": [
            34,
            53
          ],
          "explicacao": "Labels, inputs e o destaque de foco deixam o formulário organizado e acessível.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Campos e foco”.",
            "A função desta parte é: Labels, inputs e o destaque de foco deixam o formulário organizado e acessível.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Usar value no checkbox em vez de checked."
        },
        {
          "titulo": "Checkbox e botões",
          "linhas": [
            55,
            94
          ],
          "explicacao": "A opção booleana e os dois botões recebem alinhamento e cores diferentes.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Checkbox e botões”.",
            "A função desta parte é: A opção booleana e os dois botões recebem alinhamento e cores diferentes.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: flex",
              "descricao": "Organiza elementos em um eixo flexível."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Esquecer return e continuar mostrando resultados após o erro."
        },
        {
          "titulo": "Resultado e responsividade",
          "linhas": [
            96,
            134
          ],
          "explicacao": "A área de resultado ganha destaque e a media query adapta a página ao celular.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Resultado e responsividade”.",
            "A função desta parte é: A área de resultado ganha destaque e a media query adapta a página ao celular.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "@media",
              "descricao": "Regra que aplica estilos conforme as características da tela."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Usar typeof na value da idade antes de converter e obter string."
        }
      ],
      "js": [
        {
          "titulo": "Captura e conversão dos dados",
          "linhas": [
            1,
            5
          ],
          "explicacao": "Nome é string, idade é convertida com Number() e checked retorna um booleano.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Captura e conversão dos dados”.",
            "A função desta parte é: Nome é string, idade é convertida com Number() e checked retorna um booleano.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            },
            {
              "nome": ".checked",
              "descricao": "Informa se um checkbox está marcado."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um inspetor de tipos de dados responderá aos dados ou ações do usuário.",
          "alerta": "Usar typeof na value da idade antes de converter e obter string.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Valor: É o conteúdo guardado."
        },
        {
          "titulo": "Elementos de resultado",
          "linhas": [
            7,
            10
          ],
          "explicacao": "Os parágrafos são localizados para receber as mensagens da análise.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Elementos de resultado”.",
            "A função desta parte é: Os parágrafos são localizados para receber as mensagens da análise.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um inspetor de tipos de dados responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer Number() e manter a idade como texto.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Validação dos campos",
          "linhas": [
            12,
            19
          ],
          "explicacao": "A condição interrompe a função com return quando nome ou idade estiverem vazios.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Validação dos campos”.",
            "A função desta parte é: A condição interrompe a função com return quando nome ou idade estiverem vazios.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um inspetor de tipos de dados responderá aos dados ou ações do usuário.",
          "alerta": "Usar value no checkbox em vez de checked.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Tipo: Informa a categoria do valor, neste caso number."
        },
        {
          "titulo": "Operador typeof",
          "linhas": [
            21,
            31
          ],
          "explicacao": "typeof identifica string, number e boolean. O resultado é unido ao texto com concatenação.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Operador typeof”.",
            "A função desta parte é: typeof identifica string, number e boolean. O resultado é unido ao texto com concatenação.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "typeof",
              "descricao": "Retorna o nome do tipo de um valor."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um inspetor de tipos de dados responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer return e continuar mostrando resultados após o erro.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Limpeza do formulário",
          "linhas": [
            34,
            46
          ],
          "explicacao": "A segunda função limpa os campos, desmarca o checkbox e restaura as mensagens.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Limpeza do formulário”.",
            "A função desta parte é: A segunda função limpa os campos, desmarca o checkbox e restaura as mensagens.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            },
            {
              "nome": ".checked",
              "descricao": "Informa se um checkbox está marcado."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um inspetor de tipos de dados responderá aos dados ou ações do usuário.",
          "alerta": "Usar typeof na value da idade antes de converter e obter string.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Tipo: Informa a categoria do valor, neste caso number."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 12 — Identificando Tipos de Dados com JavaScript",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como o JavaScript pode trabalhar com textos, números e valores verdadeiros ou falsos, identificando o tipo de cada informação com o operador `typeof`.\n\n**O que será desenvolvido**\n\nNeste exercício, será criada uma página com um campo para nome, um campo para idade, uma opção para informar se a pessoa é estudante, botões para analisar e limpar e uma área para apresentar os valores e seus respectivos tipos.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-12`.\n\nArquivos obrigatórios:\n- `index.html`\n- `estilo.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá verificar se os campos obrigatórios foram preenchidos, converter a idade para número e apresentar os tipos `string`, `number` e `boolean` encontrados pelo JavaScript.\n\n**Como testar**\n\n- Nome e idade vazios.\n- Nome preenchido e idade vazia.\n- Nome Gabriel, idade 18 e checkbox desmarcado.\n- Nome Ana, idade 16 e checkbox marcado.\n- Confirmar string, number e boolean no resultado.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-12` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como o JavaScript pode trabalhar com textos, números e valores verdadeiros ou falsos, identificando o tipo de cada informação com o operador `typeof`.",
      "desenvolvimento": "Neste exercício, será criada uma página com um campo para nome, um campo para idade, uma opção para informar se a pessoa é estudante, botões para analisar e limpar e uma área para apresentar os valores e seus respectivos tipos.",
      "funcionamento": "O programa deverá verificar se os campos obrigatórios foram preenchidos, converter a idade para número e apresentar os tipos `string`, `number` e `boolean` encontrados pelo JavaScript.",
      "testes": [
        "Nome e idade vazios.",
        "Nome preenchido e idade vazia.",
        "Nome Gabriel, idade 18 e checkbox desmarcado.",
        "Nome Ana, idade 16 e checkbox marcado.",
        "Confirmar string, number e boolean no resultado."
      ],
      "arquivos": [
        "index.html",
        "estilo.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-12` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "contextoDetalhado": [
      "A atividade constrói um inspetor de tipos de dados.",
      "Em aplicações reais, programas precisam reconhecer texto, número e booleano para aplicar operações corretas.",
      "O exercício conecta inputs, value, trim aos novos recursos string, number, boolean, typeof.",
      "O tutorial separa estrutura, aparência e comportamento para mostrar como cada arquivo contribui para o resultado final.",
      "As gavetas podem ser abertas a qualquer momento para revisar o contexto, consultar exemplos, entender o trecho atual e conferir o glossário."
    ],
    "fluxoAprendizagem": [
      "Estrutura: Estrutura e ligação com o CSS",
      "Estrutura: Campos de texto e número",
      "Estrutura: Valor verdadeiro ou falso",
      "Estrutura: Botões e área de resultado",
      "Estrutura: Ligação com o JavaScript",
      "Aparência: Configuração geral",
      "Aparência: Card principal",
      "Aparência: Campos e foco"
    ],
    "dicasExtras": [
      "Localize no código onde aparece `string` e observe o que muda no preview quando esse trecho é executado.",
      "Leia o código em três perguntas: qual dado entra, qual regra é aplicada e qual resultado aparece na página?",
      "Use a gaveta Explicação da etapa antes de escrever o trecho; nela estão as partes, o motivo, o resultado esperado e os alertas.",
      "Depois do primeiro teste correto, altere apenas um valor para descobrir qual parte da lógica controla o comportamento.",
      "Evite este erro frequente: Usar typeof na value da idade antes de converter e obter string.",
      "Teste orientado: Nome e idade vazios."
    ],
    "perguntasGuia": [
      "Qual problema da atividade é resolvido por `string`?",
      "Qual é a diferença entre `string` e `number` neste exercício?",
      "Que valor é lido antes da regra e que resultado é produzido depois?",
      "Como você explicaria a lógica de um inspetor de tipos de dados sem ler o código palavra por palavra?",
      "O que aconteceria se este erro fosse cometido: Usar typeof na value da idade antes de converter e obter string."
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Cenário de teste: Nome e idade vazios.",
      "Cenário de teste: Nome preenchido e idade vazia.",
      "Cenário de teste: Nome Gabriel, idade 18 e checkbox desmarcado."
    ],
    "glossarioExtra": [
      {
        "termo": "tipo de dado",
        "tipo": "Classificação de valor",
        "definicao": "Categoria que determina como um valor pode ser usado, como string, number ou boolean."
      },
      {
        "termo": "string",
        "tipo": "Tipo de dado",
        "definicao": "Texto delimitado por aspas."
      },
      {
        "termo": "number",
        "tipo": "Tipo de dado",
        "definicao": "Valor numérico inteiro ou decimal."
      },
      {
        "termo": "boolean",
        "tipo": "Tipo de dado",
        "definicao": "Valor lógico que pode ser true ou false."
      },
      {
        "termo": "undefined",
        "tipo": "Ausência de valor",
        "definicao": "Resultado usado quando uma variável ou propriedade não recebeu um valor definido."
      }
    ],
    "comparacoes": [
      {
        "titulo": "Valor",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "É o conteúdo guardado."
      },
      {
        "titulo": "Tipo",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Informa a categoria do valor, neste caso number."
      }
    ],
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 13,
    "studentReferenceStripped": true,
    "titulo": "Exercício 13 — Trabalhando com var, let e const em JavaScript",
    "nomeCurto": "var, let e const",
    "tema": "Declaração, reatribuição e constantes",
    "objetivo": "Comparar var, let e const em um painel que altera valores e mantém um limite fixo.",
    "retomadas": [
      "inputs",
      "value",
      "trim",
      "Number()",
      "if",
      "return",
      "funções",
      "innerText"
    ],
    "novos": [
      "var",
      "let",
      "const",
      "reatribuição",
      "constante",
      "+="
    ],
    "pasta": "exercicio-13",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
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
          "titulo": "Estrutura e arquivos",
          "linhas": [
            1,
            8
          ],
          "explicacao": "O documento configura idioma, adaptação às telas e ligação com o arquivo estilo.css.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Estrutura e arquivos”.",
            "A função desta parte é: O documento configura idioma, adaptação às telas e ligação com o arquivo estilo.css.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<!DOCTYPE html>",
              "descricao": "Informa ao navegador que o documento usa o padrão HTML5."
            },
            {
              "nome": "<html>",
              "descricao": "Elemento raiz que envolve todo o documento."
            },
            {
              "nome": "<head>",
              "descricao": "Reúne configurações e referências que não formam o conteúdo principal."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um laboratório de var, let e const ficará disponível na página.",
          "alerta": "Tentar alterar LIMITE_PONTOS ou TURMA depois da declaração."
        },
        {
          "titulo": "Título e apresentação",
          "linhas": [
            10,
            14
          ],
          "explicacao": "A área inicial informa o número da atividade e o objetivo visual do laboratório.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Título e apresentação”.",
            "A função desta parte é: A área inicial informa o número da atividade e o objetivo visual do laboratório.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "var",
              "descricao": "Declaração antiga com escopo de função."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um laboratório de var, let e const ficará disponível na página.",
          "alerta": "Escrever pontos =+ quantidade em vez de pontos += quantidade."
        },
        {
          "titulo": "Cartões das variáveis",
          "linhas": [
            16,
            34
          ],
          "explicacao": "Cada cartão possui um id que será atualizado pelo JavaScript para representar var, let e const.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Cartões das variáveis”.",
            "A função desta parte é: Cada cartão possui um id que será atualizado pelo JavaScript para representar var, let e const.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "var",
              "descricao": "Declaração antiga com escopo de função."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um laboratório de var, let e const ficará disponível na página.",
          "alerta": "Usar o valor do input sem converter com Number()."
        },
        {
          "titulo": "Campos e botões",
          "linhas": [
            36,
            47
          ],
          "explicacao": "Os inputs recebem o nome do projeto e os pontos; os botões chamam as funções de atualizar e reiniciar.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Campos e botões”.",
            "A função desta parte é: Os inputs recebem o nome do projeto e os pontos; os botões chamam as funções de atualizar e reiniciar.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<input>",
              "descricao": "Campo de entrada usado para capturar um valor do usuário."
            },
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            },
            {
              "nome": "onclick",
              "descricao": "Atributo HTML que chama uma função quando ocorre um clique."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um laboratório de var, let e const ficará disponível na página.",
          "alerta": "Confundir const com um valor que nunca muda internamente em objetos; aqui trabalhamos apenas reatribuição."
        },
        {
          "titulo": "Resultado e JavaScript",
          "linhas": [
            49,
            55
          ],
          "explicacao": "A seção mostra as mensagens e o script.js é carregado no final da página.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Resultado e JavaScript”.",
            "A função desta parte é: A seção mostra as mensagens e o script.js é carregado no final da página.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "<script>",
              "descricao": "Liga ou contém o código JavaScript executado pela página."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um laboratório de var, let e const ficará disponível na página.",
          "alerta": "Tentar alterar LIMITE_PONTOS ou TURMA depois da declaração."
        }
      ],
      "css": [
        {
          "titulo": "Configuração geral",
          "linhas": [
            1,
            21
          ],
          "explicacao": "O body cria o fundo e o container organiza o cartão principal.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Configuração geral”.",
            "A função desta parte é: O body cria o fundo e o container organiza o cartão principal.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Tentar alterar LIMITE_PONTOS ou TURMA depois da declaração."
        },
        {
          "titulo": "Título e etiqueta",
          "linhas": [
            23,
            47
          ],
          "explicacao": "A etiqueta, o título e a introdução recebem cores e alinhamento.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Título e etiqueta”.",
            "A função desta parte é: A etiqueta, o título e a introdução recebem cores e alinhamento.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Escrever pontos =+ quantidade em vez de pontos += quantidade."
        },
        {
          "titulo": "Grade e cartões",
          "linhas": [
            49,
            104
          ],
          "explicacao": "Grid organiza os três cartões e cada declaração recebe uma cor diferente.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Grade e cartões”.",
            "A função desta parte é: Grid organiza os três cartões e cada declaração recebe uma cor diferente.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "var",
              "descricao": "Declaração antiga com escopo de função."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Usar o valor do input sem converter com Number()."
        },
        {
          "titulo": "Formulário e botões",
          "linhas": [
            106,
            156
          ],
          "explicacao": "Campos, foco e botões são formatados para facilitar a interação.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Formulário e botões”.",
            "A função desta parte é: Campos, foco e botões são formatados para facilitar a interação.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: flex",
              "descricao": "Organiza elementos em um eixo flexível."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Confundir const com um valor que nunca muda internamente em objetos; aqui trabalhamos apenas reatribuição."
        },
        {
          "titulo": "Resultado e celular",
          "linhas": [
            158,
            182
          ],
          "explicacao": "A área de resultado ganha destaque e a media query transforma a grade em coluna no celular.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Resultado e celular”.",
            "A função desta parte é: A área de resultado ganha destaque e a media query transforma a grade em coluna no celular.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "@media",
              "descricao": "Regra que aplica estilos conforme as características da tela."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Tentar alterar LIMITE_PONTOS ou TURMA depois da declaração."
        }
      ],
      "js": [
        {
          "titulo": "Declarações iniciais",
          "linhas": [
            1,
            4
          ],
          "explicacao": "var e let guardam valores que serão alterados. const mantém valores fixos durante a execução.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Declarações iniciais”.",
            "A função desta parte é: var e let guardam valores que serão alterados. const mantém valores fixos durante a execução.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "var",
              "descricao": "Declaração antiga com escopo de função."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de var, let e const responderá aos dados ou ações do usuário.",
          "alerta": "Tentar alterar LIMITE_PONTOS ou TURMA depois da declaração.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "var: Declaração antiga, com escopo de função e comportamentos mais permissivos."
        },
        {
          "titulo": "Captura dos campos",
          "linhas": [
            6,
            10
          ],
          "explicacao": "A função recupera o texto, converte a pontuação e guarda o elemento de mensagem.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Captura dos campos”.",
            "A função desta parte é: A função recupera o texto, converte a pontuação e guarda o elemento de mensagem.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "var",
              "descricao": "Declaração antiga com escopo de função."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de var, let e const responderá aos dados ou ações do usuário.",
          "alerta": "Escrever pontos =+ quantidade em vez de pontos += quantidade.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Validações",
          "linhas": [
            12,
            23
          ],
          "explicacao": "As condições impedem campos vazios e pontos menores ou iguais a zero.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Validações”.",
            "A função desta parte é: As condições impedem campos vazios e pontos menores ou iguais a zero.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de var, let e const responderá aos dados ou ações do usuário.",
          "alerta": "Usar o valor do input sem converter com Number().",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "let: Permite reatribuição e respeita escopo de bloco."
        },
        {
          "titulo": "Reatribuição e limite",
          "linhas": [
            25,
            38
          ],
          "explicacao": "projeto e pontos recebem novos valores, enquanto LIMITE_PONTOS não é alterado.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Reatribuição e limite”.",
            "A função desta parte é: projeto e pontos recebem novos valores, enquanto LIMITE_PONTOS não é alterado.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "var",
              "descricao": "Declaração antiga com escopo de função."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "else",
              "descricao": "Executa o caminho alternativo quando as condições anteriores são falsas."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de var, let e const responderá aos dados ou ações do usuário.",
          "alerta": "Confundir const com um valor que nunca muda internamente em objetos; aqui trabalhamos apenas reatribuição.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Atualização da página",
          "linhas": [
            41,
            48
          ],
          "explicacao": "A função mostrarValores envia os valores das variáveis para os cartões e para o resumo.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Atualização da página”.",
            "A função desta parte é: A função mostrarValores envia os valores das variáveis para os cartões e para o resumo.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de var, let e const responderá aos dados ou ações do usuário.",
          "alerta": "Tentar alterar LIMITE_PONTOS ou TURMA depois da declaração.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "const: Não permite reatribuir a referência declarada."
        },
        {
          "titulo": "Reinício",
          "linhas": [
            50,
            62
          ],
          "explicacao": "A função reinicia somente as variáveis que podem mudar e mantém as constantes.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Reinício”.",
            "A função desta parte é: A função reinicia somente as variáveis que podem mudar e mantém as constantes.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de var, let e const responderá aos dados ou ações do usuário.",
          "alerta": "Escrever pontos =+ quantidade em vez de pontos += quantidade.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Estado inicial",
          "linhas": [
            62,
            62
          ],
          "explicacao": "A chamada final apresenta os valores iniciais assim que a página é carregada.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Estado inicial”.",
            "A função desta parte é: A chamada final apresenta os valores iniciais assim que a página é carregada.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "Estado inicial",
              "descricao": "Trecho selecionado pelo tutorial para construir uma parte específica da atividade."
            },
            {
              "nome": "Linhas 62–62",
              "descricao": "Intervalo validado dentro do arquivo JS."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de var, let e const responderá aos dados ou ações do usuário.",
          "alerta": "Usar o valor do input sem converter com Number().",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "const: Não permite reatribuir a referência declarada."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 13 — Trabalhando com var, let e const em JavaScript",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como o JavaScript declara e altera valores usando `var`, `let` e `const`.\n\n**O que será desenvolvido**\n\nNeste exercício, será criada uma página chamada Laboratório de Variáveis, com três cartões para mostrar os valores declarados com `var`, `let` e `const`, campos para informar o nome de um projeto e uma pontuação, botões para atualizar e reiniciar e uma área de resultado.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-13`.\n\nArquivos obrigatórios:\n- `index.html`\n- `estilo.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá permitir a alteração do nome do projeto e da pontuação, impedir valores vazios ou menores que zero, limitar a pontuação ao valor definido pela constante e manter os valores atualizados na página.\n\n**Como testar**\n\n- Para testar, informe um nome de projeto e adicione uma pontuação entre 1 e 50.\n- Campos vazios.\n- Pontuação zero ou negativa.\n- Projeto Portal 2DS com 10 pontos.\n- Somar valores até atingir o limite de 50.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-13` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como o JavaScript declara e altera valores usando `var`, `let` e `const`.",
      "desenvolvimento": "Neste exercício, será criada uma página chamada Laboratório de Variáveis, com três cartões para mostrar os valores declarados com `var`, `let` e `const`, campos para informar o nome de um projeto e uma pontuação, botões para atualizar e reiniciar e uma área de resultado.",
      "funcionamento": "O programa deverá permitir a alteração do nome do projeto e da pontuação, impedir valores vazios ou menores que zero, limitar a pontuação ao valor definido pela constante e manter os valores atualizados na página.",
      "testes": [
        "Para testar, informe um nome de projeto e adicione uma pontuação entre 1 e 50.",
        "Campos vazios.",
        "Pontuação zero ou negativa.",
        "Projeto Portal 2DS com 10 pontos.",
        "Somar valores até atingir o limite de 50."
      ],
      "arquivos": [
        "index.html",
        "estilo.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-13` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "validacao": {
      "strictDeclarations": true
    },
    "contextoDetalhado": [
      "A atividade constrói um laboratório de var, let e const.",
      "Em aplicações reais, escolher a declaração correta reduz alterações acidentais e deixa a intenção do código mais clara.",
      "O exercício conecta inputs, value, trim aos novos recursos var, let, const, reatribuição.",
      "O tutorial separa estrutura, aparência e comportamento para mostrar como cada arquivo contribui para o resultado final.",
      "As gavetas podem ser abertas a qualquer momento para revisar o contexto, consultar exemplos, entender o trecho atual e conferir o glossário."
    ],
    "fluxoAprendizagem": [
      "Estrutura: Estrutura e arquivos",
      "Estrutura: Título e apresentação",
      "Estrutura: Cartões das variáveis",
      "Estrutura: Campos e botões",
      "Estrutura: Resultado e JavaScript",
      "Aparência: Configuração geral",
      "Aparência: Título e etiqueta",
      "Aparência: Grade e cartões"
    ],
    "dicasExtras": [
      "Localize no código onde aparece `var` e observe o que muda no preview quando esse trecho é executado.",
      "Leia o código em três perguntas: qual dado entra, qual regra é aplicada e qual resultado aparece na página?",
      "Use a gaveta Explicação da etapa antes de escrever o trecho; nela estão as partes, o motivo, o resultado esperado e os alertas.",
      "Depois do primeiro teste correto, altere apenas um valor para descobrir qual parte da lógica controla o comportamento.",
      "Evite este erro frequente: Tentar alterar LIMITE_PONTOS ou TURMA depois da declaração.",
      "Teste orientado: Campos vazios"
    ],
    "perguntasGuia": [
      "Qual problema da atividade é resolvido por `var`?",
      "Qual é a diferença entre `var` e `let` neste exercício?",
      "Que valor é lido antes da regra e que resultado é produzido depois?",
      "Como você explicaria a lógica de um laboratório de var, let e const sem ler o código palavra por palavra?",
      "O que aconteceria se este erro fosse cometido: Tentar alterar LIMITE_PONTOS ou TURMA depois da declaração."
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Cenário de teste: Campos vazios",
      "Cenário de teste: Pontuação zero ou negativa",
      "Cenário de teste: Projeto Portal 2DS com 10 pontos"
    ],
    "glossarioExtra": [
      {
        "termo": "escopo",
        "tipo": "Regra de acesso",
        "definicao": "Região do programa na qual uma variável pode ser utilizada."
      },
      {
        "termo": "reatribuição",
        "tipo": "Alteração de variável",
        "definicao": "Substituição do valor guardado em uma variável já declarada."
      },
      {
        "termo": "declaração",
        "tipo": "Criação de identificador",
        "definicao": "Instrução que apresenta uma variável ou função ao programa."
      },
      {
        "termo": "constante",
        "tipo": "Referência fixa",
        "definicao": "Identificador declarado com const que não pode receber outra referência."
      }
    ],
    "comparacoes": [
      {
        "titulo": "var",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Declaração antiga, com escopo de função e comportamentos mais permissivos."
      },
      {
        "titulo": "let",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Permite reatribuição e respeita escopo de bloco."
      },
      {
        "titulo": "const",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Não permite reatribuir a referência declarada."
      }
    ],
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 14,
    "studentReferenceStripped": true,
    "titulo": "Exercício 14 — Variáveis Locais e Globais em JavaScript",
    "nomeCurto": "Variáveis locais e globais",
    "tema": "Escopo de variáveis e funções",
    "objetivo": "Diferenciar variáveis globais e locais por meio de um painel que registra visitantes.",
    "retomadas": [
      "let",
      "const",
      "inputs",
      "value",
      "trim()",
      "if",
      "return",
      "funções",
      "innerText",
      "incremento"
    ],
    "novos": [
      "escopo global",
      "escopo local",
      "variável global",
      "variável local",
      "acesso entre funções"
    ],
    "pasta": "exercicio-14",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
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
          "titulo": "Estrutura e arquivos",
          "linhas": [
            1,
            8
          ],
          "explicacao": "O documento configura idioma, responsividade e a ligação com o arquivo de estilos.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Estrutura e arquivos”.",
            "A função desta parte é: O documento configura idioma, responsividade e a ligação com o arquivo de estilos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<!DOCTYPE html>",
              "descricao": "Informa ao navegador que o documento usa o padrão HTML5."
            },
            {
              "nome": "<html>",
              "descricao": "Elemento raiz que envolve todo o documento."
            },
            {
              "nome": "<head>",
              "descricao": "Reúne configurações e referências que não formam o conteúdo principal."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um painel que diferencia dados locais e globais ficará disponível na página.",
          "alerta": "Declarar totalVisitas dentro de registrarVisita e perder o total a cada clique."
        },
        {
          "titulo": "Apresentação da atividade",
          "linhas": [
            10,
            15
          ],
          "explicacao": "O título e a introdução explicam que o painel será usado para observar diferentes escopos.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Apresentação da atividade”.",
            "A função desta parte é: O título e a introdução explicam que o painel será usado para observar diferentes escopos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um painel que diferencia dados locais e globais ficará disponível na página.",
          "alerta": "Tentar utilizar nomeVisitante dentro de mostrarResumo."
        },
        {
          "titulo": "Cartões global e local",
          "linhas": [
            17,
            31
          ],
          "explicacao": "Os cartões possuem ids que receberão valores das variáveis pelo JavaScript.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Cartões global e local”.",
            "A função desta parte é: Os cartões possuem ids que receberão valores das variáveis pelo JavaScript.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um painel que diferencia dados locais e globais ficará disponível na página.",
          "alerta": "Esquecer o incremento totalVisitas++."
        },
        {
          "titulo": "Campo e ações",
          "linhas": [
            33,
            48
          ],
          "explicacao": "O input recebe o nome e cada botão chama uma função diferente.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Campo e ações”.",
            "A função desta parte é: O input recebe o nome e cada botão chama uma função diferente.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            },
            {
              "nome": "onclick",
              "descricao": "Atributo HTML que chama uma função quando ocorre um clique."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um painel que diferencia dados locais e globais ficará disponível na página.",
          "alerta": "Criar outra variável local com o mesmo nome da global sem perceber o sombreamento."
        },
        {
          "titulo": "Mensagens e script",
          "linhas": [
            50,
            54
          ],
          "explicacao": "A área de resultado apresenta mensagens e o script é carregado no final.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Mensagens e script”.",
            "A função desta parte é: A área de resultado apresenta mensagens e o script é carregado no final.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<script>",
              "descricao": "Liga ou contém o código JavaScript executado pela página."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um painel que diferencia dados locais e globais ficará disponível na página.",
          "alerta": "Confundir o texto que ficou no HTML com a existência da variável local depois da função."
        }
      ],
      "css": [
        {
          "titulo": "Configuração geral",
          "linhas": [
            1,
            24
          ],
          "explicacao": "O body e o container organizam o fundo, a largura e o cartão principal.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Configuração geral”.",
            "A função desta parte é: O body e o container organizam o fundo, a largura e o cartão principal.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Declarar totalVisitas dentro de registrarVisita e perder o total a cada clique."
        },
        {
          "titulo": "Cabeçalho da página",
          "linhas": [
            26,
            49
          ],
          "explicacao": "A etiqueta, o título e a introdução recebem cores e alinhamento.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Cabeçalho da página”.",
            "A função desta parte é: A etiqueta, o título e a introdução recebem cores e alinhamento.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Tentar utilizar nomeVisitante dentro de mostrarResumo."
        },
        {
          "titulo": "Painel de escopos",
          "linhas": [
            51,
            106
          ],
          "explicacao": "A grade cria dois cartões e usa cores diferentes para global e local.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Painel de escopos”.",
            "A função desta parte é: A grade cria dois cartões e usa cores diferentes para global e local.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Esquecer o incremento totalVisitas++."
        },
        {
          "titulo": "Campo e botões",
          "linhas": [
            108,
            175
          ],
          "explicacao": "O formulário e as ações são preparados para mouse, teclado e toque.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Campo e botões”.",
            "A função desta parte é: O formulário e as ações são preparados para mouse, teclado e toque.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "@media",
              "descricao": "Regra que aplica estilos conforme as características da tela."
            },
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Criar outra variável local com o mesmo nome da global sem perceber o sombreamento."
        },
        {
          "titulo": "Resultado e responsividade",
          "linhas": [
            177,
            183
          ],
          "explicacao": "A mensagem ganha destaque e a media query reorganiza a tela no celular.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Resultado e responsividade”.",
            "A função desta parte é: A mensagem ganha destaque e a media query reorganiza a tela no celular.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Confundir o texto que ficou no HTML com a existência da variável local depois da função."
        }
      ],
      "js": [
        {
          "titulo": "Variáveis globais",
          "linhas": [
            1,
            2
          ],
          "explicacao": "Estas variáveis foram declaradas fora das funções e podem ser acessadas por várias partes do programa.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Variáveis globais”.",
            "A função desta parte é: Estas variáveis foram declaradas fora das funções e podem ser acessadas por várias partes do programa.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um painel que diferencia dados locais e globais responderá aos dados ou ações do usuário.",
          "alerta": "Declarar totalVisitas dentro de registrarVisita e perder o total a cada clique.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Variável global: Declarada fora das funções e compartilhada entre elas."
        },
        {
          "titulo": "Variáveis locais da visita",
          "linhas": [
            4,
            7
          ],
          "explicacao": "campoNome, nomeVisitante e mensagem existem somente dentro da função registrarVisita.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Variáveis locais da visita”.",
            "A função desta parte é: campoNome, nomeVisitante e mensagem existem somente dentro da função registrarVisita.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um painel que diferencia dados locais e globais responderá aos dados ou ações do usuário.",
          "alerta": "Tentar utilizar nomeVisitante dentro de mostrarResumo.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Validação",
          "linhas": [
            9,
            15
          ],
          "explicacao": "A condição impede o registro quando o nome está vazio.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Validação”.",
            "A função desta parte é: A condição impede o registro quando o nome está vazio.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um painel que diferencia dados locais e globais responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer o incremento totalVisitas++.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Variável local: Existe somente dentro da função ou bloco."
        },
        {
          "titulo": "Atualização global e mensagem local",
          "linhas": [
            17,
            28
          ],
          "explicacao": "A variável global é incrementada e mensagemLocal é usada apenas dentro desta função.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Atualização global e mensagem local”.",
            "A função desta parte é: A variável global é incrementada e mensagemLocal é usada apenas dentro desta função.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um painel que diferencia dados locais e globais responderá aos dados ou ações do usuário.",
          "alerta": "Criar outra variável local com o mesmo nome da global sem perceber o sombreamento.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Limpeza do campo",
          "linhas": [
            30,
            31
          ],
          "explicacao": "O campo é limpo sem apagar o total global de visitas.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Limpeza do campo”.",
            "A função desta parte é: O campo é limpo sem apagar o total global de visitas.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "Limpeza do campo",
              "descricao": "Trecho selecionado pelo tutorial para construir uma parte específica da atividade."
            },
            {
              "nome": "Linhas 30–31",
              "descricao": "Intervalo validado dentro do arquivo JS."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um painel que diferencia dados locais e globais responderá aos dados ou ações do usuário.",
          "alerta": "Confundir o texto que ficou no HTML com a existência da variável local depois da função.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Variável local: Existe somente dentro da função ou bloco."
        },
        {
          "titulo": "Resumo em outra função",
          "linhas": [
            34,
            39
          ],
          "explicacao": "mostrarResumo acessa as variáveis globais, mas não consegue acessar as variáveis locais de registrarVisita.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Resumo em outra função”.",
            "A função desta parte é: mostrarResumo acessa as variáveis globais, mas não consegue acessar as variáveis locais de registrarVisita.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um painel que diferencia dados locais e globais responderá aos dados ou ações do usuário.",
          "alerta": "Declarar totalVisitas dentro de registrarVisita e perder o total a cada clique.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Reinício do painel",
          "linhas": [
            42,
            54
          ],
          "explicacao": "A função altera a variável global e restaura os elementos visuais.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Reinício do painel”.",
            "A função desta parte é: A função altera a variável global e restaura os elementos visuais.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um painel que diferencia dados locais e globais responderá aos dados ou ações do usuário.",
          "alerta": "Tentar utilizar nomeVisitante dentro de mostrarResumo.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Variável local: Existe somente dentro da função ou bloco."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 14 — Variáveis Locais e Globais em JavaScript",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como o JavaScript organiza variáveis que podem ser acessadas em diferentes partes do programa e variáveis que existem somente dentro de uma função.\n\n**O que será desenvolvido**\n\nNeste exercício, será criada uma página chamada Painel de Visitas, com um cartão para mostrar informações globais do sistema, um cartão para mostrar o visitante atual, um campo para digitar o nome, botões para registrar uma visita, exibir um resumo e reiniciar o painel, além de uma área para mensagens.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-14`.\n\nArquivos obrigatórios:\n- `index.html`\n- `estilo.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá validar o campo vazio, registrar o nome do visitante, aumentar o total de visitas, mostrar um resumo e demonstrar que a variável global pode ser utilizada por várias funções, enquanto as variáveis locais pertencem somente à função em que foram criadas.\n\n**Como testar**\n\n- Para testar, registre diferentes nomes, abra o resumo depois de algumas visitas e utilize o botão \"Reiniciar\".\n- Campo vazio.\n- Registrar uma visita com o nome Ana.\n- Registrar três visitantes diferentes.\n- Mostrar o resumo depois das visitas.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-14` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como o JavaScript organiza variáveis que podem ser acessadas em diferentes partes do programa e variáveis que existem somente dentro de uma função.",
      "desenvolvimento": "Neste exercício, será criada uma página chamada Painel de Visitas, com um cartão para mostrar informações globais do sistema, um cartão para mostrar o visitante atual, um campo para digitar o nome, botões para registrar uma visita, exibir um resumo e reiniciar o painel, além de uma área para mensagens.",
      "funcionamento": "O programa deverá validar o campo vazio, registrar o nome do visitante, aumentar o total de visitas, mostrar um resumo e demonstrar que a variável global pode ser utilizada por várias funções, enquanto as variáveis locais pertencem somente à função em que foram criadas.",
      "testes": [
        "Para testar, registre diferentes nomes, abra o resumo depois de algumas visitas e utilize o botão \"Reiniciar\".",
        "Campo vazio.",
        "Registrar uma visita com o nome Ana.",
        "Registrar três visitantes diferentes.",
        "Mostrar o resumo depois das visitas."
      ],
      "arquivos": [
        "index.html",
        "estilo.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-14` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false
    },
    "contextoDetalhado": [
      "A atividade constrói um painel que diferencia dados locais e globais.",
      "Em aplicações reais, o escopo controla onde uma informação pode ser lida ou alterada.",
      "O exercício conecta let, const, inputs aos novos recursos escopo global, escopo local, variável global, variável local.",
      "O tutorial separa estrutura, aparência e comportamento para mostrar como cada arquivo contribui para o resultado final.",
      "As gavetas podem ser abertas a qualquer momento para revisar o contexto, consultar exemplos, entender o trecho atual e conferir o glossário."
    ],
    "fluxoAprendizagem": [
      "Estrutura: Estrutura e arquivos",
      "Estrutura: Apresentação da atividade",
      "Estrutura: Cartões global e local",
      "Estrutura: Campo e ações",
      "Estrutura: Mensagens e script",
      "Aparência: Configuração geral",
      "Aparência: Cabeçalho da página",
      "Aparência: Painel de escopos"
    ],
    "dicasExtras": [
      "Localize no código onde aparece `escopo global` e observe o que muda no preview quando esse trecho é executado.",
      "Leia o código em três perguntas: qual dado entra, qual regra é aplicada e qual resultado aparece na página?",
      "Use a gaveta Explicação da etapa antes de escrever o trecho; nela estão as partes, o motivo, o resultado esperado e os alertas.",
      "Depois do primeiro teste correto, altere apenas um valor para descobrir qual parte da lógica controla o comportamento.",
      "Evite este erro frequente: Declarar totalVisitas dentro de registrarVisita e perder o total a cada clique.",
      "Teste orientado: Campo vazio"
    ],
    "perguntasGuia": [
      "Qual problema da atividade é resolvido por `escopo global`?",
      "Qual é a diferença entre `escopo global` e `escopo local` neste exercício?",
      "Que valor é lido antes da regra e que resultado é produzido depois?",
      "Como você explicaria a lógica de um painel que diferencia dados locais e globais sem ler o código palavra por palavra?",
      "O que aconteceria se este erro fosse cometido: Declarar totalVisitas dentro de registrarVisita e perder o total a cada clique."
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Cenário de teste: Campo vazio",
      "Cenário de teste: Registrar uma visita com o nome Ana",
      "Cenário de teste: Registrar três visitantes diferentes"
    ],
    "glossarioExtra": [
      {
        "termo": "escopo local",
        "tipo": "Regra de acesso",
        "definicao": "Área interna de uma função ou bloco em que uma variável foi criada."
      },
      {
        "termo": "escopo global",
        "tipo": "Regra de acesso",
        "definicao": "Área externa às funções que pode ser acessada por diferentes partes do script."
      },
      {
        "termo": "variável local",
        "tipo": "Variável por escopo",
        "definicao": "Variável disponível somente dentro da função ou bloco em que foi declarada."
      },
      {
        "termo": "variável global",
        "tipo": "Variável por escopo",
        "definicao": "Variável declarada fora das funções e compartilhada por diferentes funções."
      }
    ],
    "comparacoes": [
      {
        "titulo": "Variável global",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Declarada fora das funções e compartilhada entre elas."
      },
      {
        "titulo": "Variável local",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Existe somente dentro da função ou bloco."
      }
    ],
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 15,
    "studentReferenceStripped": true,
    "titulo": "Exercício 15 — Funções com Parâmetros e Retorno em JavaScript",
    "nomeCurto": "Funções com parâmetros e retorno",
    "tema": "Parâmetros, argumentos e return",
    "objetivo": "Criar funções reutilizáveis que recebem valores, processam dados e devolvem resultados.",
    "retomadas": [
      "inputs",
      "Number()",
      "if",
      "return",
      "const",
      "funções",
      "innerText",
      "toFixed()"
    ],
    "novos": [
      "parâmetros",
      "argumentos",
      "valor de retorno",
      "reutilização de funções",
      "composição de funções"
    ],
    "pasta": "exercicio-15",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
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
          "titulo": "Estrutura inicial",
          "linhas": [
            1,
            8
          ],
          "explicacao": "O documento configura idioma, responsividade e a ligação com o CSS.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Estrutura inicial”.",
            "A função desta parte é: O documento configura idioma, responsividade e a ligação com o CSS.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<!DOCTYPE html>",
              "descricao": "Informa ao navegador que o documento usa o padrão HTML5."
            },
            {
              "nome": "<html>",
              "descricao": "Elemento raiz que envolve todo o documento."
            },
            {
              "nome": "<head>",
              "descricao": "Reúne configurações e referências que não formam o conteúdo principal."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um laboratório de funções reutilizáveis ficará disponível na página.",
          "alerta": "Esquecer de escrever return dentro da função."
        },
        {
          "titulo": "Título e contexto",
          "linhas": [
            10,
            15
          ],
          "explicacao": "A atividade apresenta a calculadora e o objetivo da aula.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Título e contexto”.",
            "A função desta parte é: A atividade apresenta a calculadora e o objetivo da aula.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um laboratório de funções reutilizáveis ficará disponível na página.",
          "alerta": "Confundir parâmetros com argumentos."
        },
        {
          "titulo": "Parâmetros e retorno",
          "linhas": [
            17,
            29
          ],
          "explicacao": "Os cartões explicam visualmente a entrada e a saída de uma função.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Parâmetros e retorno”.",
            "A função desta parte é: Os cartões explicam visualmente a entrada e a saída de uma função.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um laboratório de funções reutilizáveis ficará disponível na página.",
          "alerta": "Usar o valor do input como texto sem Number()."
        },
        {
          "titulo": "Campos do cálculo",
          "linhas": [
            31,
            52
          ],
          "explicacao": "Os inputs recebem o preço e o percentual que serão enviados como argumentos.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Campos do cálculo”.",
            "A função desta parte é: Os inputs recebem o preço e o percentual que serão enviados como argumentos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<input>",
              "descricao": "Campo de entrada usado para capturar um valor do usuário."
            },
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            },
            {
              "nome": "onclick",
              "descricao": "Atributo HTML que chama uma função quando ocorre um clique."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um laboratório de funções reutilizáveis ficará disponível na página.",
          "alerta": "Calcular o preço final antes de calcular o valor do desconto."
        },
        {
          "titulo": "Ações e resultado",
          "linhas": [
            54,
            78
          ],
          "explicacao": "Os botões executam as funções e os cartões apresentam os resultados.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Ações e resultado”.",
            "A função desta parte é: Os botões executam as funções e os cartões apresentam os resultados.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<script>",
              "descricao": "Liga ou contém o código JavaScript executado pela página."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um laboratório de funções reutilizáveis ficará disponível na página.",
          "alerta": "Chamar a função sem enviar todos os argumentos."
        },
        {
          "titulo": "Ligação com JavaScript",
          "linhas": [
            78,
            78
          ],
          "explicacao": "O script é carregado no final da página.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Ligação com JavaScript”.",
            "A função desta parte é: O script é carregado no final da página.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "Ligação com JavaScript",
              "descricao": "Trecho selecionado pelo tutorial para construir uma parte específica da atividade."
            },
            {
              "nome": "Linhas 78–78",
              "descricao": "Intervalo validado dentro do arquivo HTML."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um laboratório de funções reutilizáveis ficará disponível na página.",
          "alerta": "Tentar acessar uma variável local de outra função."
        }
      ],
      "css": [
        {
          "titulo": "Configuração da página",
          "linhas": [
            1,
            24
          ],
          "explicacao": "O body e o container definem o fundo e a área principal.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Configuração da página”.",
            "A função desta parte é: O body e o container definem o fundo e a área principal.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Esquecer de escrever return dentro da função."
        },
        {
          "titulo": "Cabeçalho visual",
          "linhas": [
            26,
            49
          ],
          "explicacao": "A etiqueta, o título e a introdução organizam a apresentação.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Cabeçalho visual”.",
            "A função desta parte é: A etiqueta, o título e a introdução organizam a apresentação.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Confundir parâmetros com argumentos."
        },
        {
          "titulo": "Cartões explicativos",
          "linhas": [
            51,
            80
          ],
          "explicacao": "A grade mostra parâmetros e retorno lado a lado.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Cartões explicativos”.",
            "A função desta parte é: A grade mostra parâmetros e retorno lado a lado.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Usar o valor do input como texto sem Number()."
        },
        {
          "titulo": "Formulário e ações",
          "linhas": [
            82,
            139
          ],
          "explicacao": "Campos e botões recebem estilos adequados para mouse, teclado e toque.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Formulário e ações”.",
            "A função desta parte é: Campos e botões recebem estilos adequados para mouse, teclado e toque.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Calcular o preço final antes de calcular o valor do desconto."
        },
        {
          "titulo": "Área de resultado",
          "linhas": [
            141,
            185
          ],
          "explicacao": "Os três cartões mostram os valores calculados e destacam o preço final.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Área de resultado”.",
            "A função desta parte é: Os três cartões mostram os valores calculados e destacam o preço final.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "@media",
              "descricao": "Regra que aplica estilos conforme as características da tela."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Chamar a função sem enviar todos os argumentos."
        },
        {
          "titulo": "Responsividade",
          "linhas": [
            185,
            185
          ],
          "explicacao": "No celular, cartões e botões passam para uma única coluna.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Responsividade”.",
            "A função desta parte é: No celular, cartões e botões passam para uma única coluna.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "Responsividade",
              "descricao": "Trecho selecionado pelo tutorial para construir uma parte específica da atividade."
            },
            {
              "nome": "Linhas 185–185",
              "descricao": "Intervalo validado dentro do arquivo CSS."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Tentar acessar uma variável local de outra função."
        }
      ],
      "js": [
        {
          "titulo": "Função de desconto",
          "linhas": [
            1,
            3
          ],
          "explicacao": "A função recebe preço e percentual como parâmetros e devolve o valor do desconto.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Função de desconto”.",
            "A função desta parte é: A função recebe preço e percentual como parâmetros e devolve o valor do desconto.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de funções reutilizáveis responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer de escrever return dentro da função.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Parâmetro: a e b são nomes definidos para receber valores."
        },
        {
          "titulo": "Função de preço final",
          "linhas": [
            5,
            7
          ],
          "explicacao": "Outra função recebe dois valores e retorna a subtração.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Função de preço final”.",
            "A função desta parte é: Outra função recebe dois valores e retorna a subtração.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de funções reutilizáveis responderá aos dados ou ações do usuário.",
          "alerta": "Confundir parâmetros com argumentos.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Função de formatação",
          "linhas": [
            9,
            11
          ],
          "explicacao": "A função recebe um número e devolve um texto formatado como moeda.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Função de formatação”.",
            "A função desta parte é: A função recebe um número e devolve um texto formatado como moeda.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de funções reutilizáveis responderá aos dados ou ações do usuário.",
          "alerta": "Usar o valor do input como texto sem Number().",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Argumento: 5 e 3 são os valores reais enviados."
        },
        {
          "titulo": "Captura dos campos",
          "linhas": [
            13,
            20
          ],
          "explicacao": "A função principal recupera os elementos e converte os valores digitados.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Captura dos campos”.",
            "A função desta parte é: A função principal recupera os elementos e converte os valores digitados.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            },
            {
              "nome": "Number()",
              "descricao": "Converte um valor para número."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de funções reutilizáveis responderá aos dados ou ações do usuário.",
          "alerta": "Calcular o preço final antes de calcular o valor do desconto.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Validação",
          "linhas": [
            22,
            42
          ],
          "explicacao": "As condições verificam preço e percentual antes de realizar o cálculo.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Validação”.",
            "A função desta parte é: As condições verificam preço e percentual antes de realizar o cálculo.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de funções reutilizáveis responderá aos dados ou ações do usuário.",
          "alerta": "Chamar a função sem enviar todos os argumentos.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Retorno: Devolve o resultado para quem chamou a função."
        },
        {
          "titulo": "Chamadas com argumentos",
          "linhas": [
            44,
            50
          ],
          "explicacao": "Os valores digitados são enviados para as funções como argumentos.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Chamadas com argumentos”.",
            "A função desta parte é: Os valores digitados são enviados para as funções como argumentos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de funções reutilizáveis responderá aos dados ou ações do usuário.",
          "alerta": "Tentar acessar uma variável local de outra função.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Uso dos retornos",
          "linhas": [
            52,
            65
          ],
          "explicacao": "Os resultados devolvidos pelas funções são exibidos na página.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Uso dos retornos”.",
            "A função desta parte é: Os resultados devolvidos pelas funções são exibidos na página.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de funções reutilizáveis responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer de escrever return dentro da função.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Retorno: Devolve o resultado para quem chamou a função."
        },
        {
          "titulo": "Limpeza",
          "linhas": [
            68,
            77
          ],
          "explicacao": "A função limpar restaura campos, valores e mensagem.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Limpeza”.",
            "A função desta parte é: A função limpar restaura campos, valores e mensagem.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de funções reutilizáveis responderá aos dados ou ações do usuário.",
          "alerta": "Confundir parâmetros com argumentos.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 15 — Funções com Parâmetros e Retorno em JavaScript",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como o JavaScript pode receber valores em funções, realizar cálculos e devolver resultados para outras partes do programa.\n\n**O que será desenvolvido**\n\nNeste exercício, será criada uma Calculadora de Desconto com campos para informar o preço do produto e o percentual de desconto, botões para calcular e limpar, uma explicação visual sobre parâmetros e retorno e uma área para mostrar o preço original, o valor descontado e o preço final.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-15`.\n\nArquivos obrigatórios:\n- `index.html`\n- `estilo.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá validar os valores digitados, enviar o preço e o percentual como parâmetros para uma função, utilizar `return` para devolver o resultado, calcular o preço final e atualizar as informações apresentadas na página.\n\n**Como testar**\n\n- Para testar, utilize valores como preço `150` e desconto `10`, verificando se o resultado final é `R$ 135,00`.\n- Preço 150 e desconto 10.\n- Preço 79,90 e desconto 25.\n- Preço vazio.\n- Preço igual a zero.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-15` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como o JavaScript pode receber valores em funções, realizar cálculos e devolver resultados para outras partes do programa.",
      "desenvolvimento": "Neste exercício, será criada uma Calculadora de Desconto com campos para informar o preço do produto e o percentual de desconto, botões para calcular e limpar, uma explicação visual sobre parâmetros e retorno e uma área para mostrar o preço original, o valor descontado e o preço final.",
      "funcionamento": "O programa deverá validar os valores digitados, enviar o preço e o percentual como parâmetros para uma função, utilizar `return` para devolver o resultado, calcular o preço final e atualizar as informações apresentadas na página.",
      "testes": [
        "Para testar, utilize valores como preço `150` e desconto `10`, verificando se o resultado final é `R$ 135,00`.",
        "Preço 150 e desconto 10.",
        "Preço 79,90 e desconto 25.",
        "Preço vazio.",
        "Preço igual a zero."
      ],
      "arquivos": [
        "index.html",
        "estilo.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-15` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false
    },
    "contextoDetalhado": [
      "A atividade constrói um laboratório de funções reutilizáveis.",
      "Em aplicações reais, funções evitam repetir regras e permitem combinar entradas, processamento e retorno.",
      "O exercício conecta inputs, Number(), if aos novos recursos parâmetros, argumentos, valor de retorno, reutilização de funções.",
      "O tutorial separa estrutura, aparência e comportamento para mostrar como cada arquivo contribui para o resultado final.",
      "As gavetas podem ser abertas a qualquer momento para revisar o contexto, consultar exemplos, entender o trecho atual e conferir o glossário."
    ],
    "fluxoAprendizagem": [
      "Estrutura: Estrutura inicial",
      "Estrutura: Título e contexto",
      "Estrutura: Parâmetros e retorno",
      "Estrutura: Campos do cálculo",
      "Estrutura: Ações e resultado",
      "Estrutura: Ligação com JavaScript",
      "Aparência: Configuração da página",
      "Aparência: Cabeçalho visual"
    ],
    "dicasExtras": [
      "Localize no código onde aparece `parâmetros` e observe o que muda no preview quando esse trecho é executado.",
      "Leia o código em três perguntas: qual dado entra, qual regra é aplicada e qual resultado aparece na página?",
      "Use a gaveta Explicação da etapa antes de escrever o trecho; nela estão as partes, o motivo, o resultado esperado e os alertas.",
      "Depois do primeiro teste correto, altere apenas um valor para descobrir qual parte da lógica controla o comportamento.",
      "Evite este erro frequente: Esquecer de escrever return dentro da função.",
      "Teste orientado: Preço 150 e desconto 10"
    ],
    "perguntasGuia": [
      "Qual problema da atividade é resolvido por `parâmetros`?",
      "Qual é a diferença entre `parâmetros` e `argumentos` neste exercício?",
      "Que valor é lido antes da regra e que resultado é produzido depois?",
      "Como você explicaria a lógica de um laboratório de funções reutilizáveis sem ler o código palavra por palavra?",
      "O que aconteceria se este erro fosse cometido: Esquecer de escrever return dentro da função."
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Cenário de teste: Preço 150 e desconto 10",
      "Cenário de teste: Preço 79,90 e desconto 25"
    ],
    "glossarioExtra": [
      {
        "termo": "parâmetro",
        "tipo": "Entrada da definição",
        "definicao": "Nome usado na declaração da função para representar um valor recebido."
      },
      {
        "termo": "argumento",
        "tipo": "Valor da chamada",
        "definicao": "Valor real enviado para preencher um parâmetro."
      },
      {
        "termo": "retorno",
        "tipo": "Saída da função",
        "definicao": "Valor devolvido para o ponto em que a função foi chamada."
      },
      {
        "termo": "composição de funções",
        "tipo": "Organização de lógica",
        "definicao": "Uso do resultado de uma função como entrada ou parte de outra operação."
      }
    ],
    "comparacoes": [
      {
        "titulo": "Parâmetro",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "a e b são nomes definidos para receber valores."
      },
      {
        "titulo": "Argumento",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "5 e 3 são os valores reais enviados."
      },
      {
        "titulo": "Retorno",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Devolve o resultado para quem chamou a função."
      }
    ],
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 16,
    "studentReferenceStripped": true,
    "titulo": "Exercício 16 — Lista de Nomes com Array em JavaScript",
    "nomeCurto": "Lista de nomes com array",
    "tema": "Arrays, índices, push e length",
    "objetivo": "Armazenar vários nomes em um array, acessar posições e apresentar os dados na página.",
    "retomadas": [
      "const",
      "inputs",
      "trim()",
      "if",
      "return",
      "for",
      "funções",
      "createElement",
      "innerText"
    ],
    "novos": [
      "array",
      "índice",
      "push()",
      "length",
      "primeiro elemento",
      "último elemento"
    ],
    "pasta": "exercicio-16",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
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
          "titulo": "Estrutura inicial",
          "linhas": [
            1,
            8
          ],
          "explicacao": "O documento prepara idioma, responsividade e o arquivo de estilos.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Estrutura inicial”.",
            "A função desta parte é: O documento prepara idioma, responsividade e o arquivo de estilos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<!DOCTYPE html>",
              "descricao": "Informa ao navegador que o documento usa o padrão HTML5."
            },
            {
              "nome": "<html>",
              "descricao": "Elemento raiz que envolve todo o documento."
            },
            {
              "nome": "<head>",
              "descricao": "Reúne configurações e referências que não formam o conteúdo principal."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma lista de nomes armazenada em array ficará disponível na página.",
          "alerta": "Escrever nomes = nomeDigitado e substituir o array por um texto."
        },
        {
          "titulo": "Apresentação",
          "linhas": [
            10,
            15
          ],
          "explicacao": "O título explica que os nomes serão armazenados em um array.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Apresentação”.",
            "A função desta parte é: O título explica que os nomes serão armazenados em um array.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma lista de nomes armazenada em array ficará disponível na página.",
          "alerta": "Esquecer os parênteses em push()."
        },
        {
          "titulo": "Indicadores do array",
          "linhas": [
            17,
            35
          ],
          "explicacao": "Os cartões receberão quantidade, primeiro nome e último nome.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Indicadores do array”.",
            "A função desta parte é: Os cartões receberão quantidade, primeiro nome e último nome.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<input>",
              "descricao": "Campo de entrada usado para capturar um valor do usuário."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma lista de nomes armazenada em array ficará disponível na página.",
          "alerta": "Usar nomes.length como último índice sem subtrair 1."
        },
        {
          "titulo": "Entrada e botões",
          "linhas": [
            37,
            51
          ],
          "explicacao": "O input recebe o nome e os botões chamam as funções.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Entrada e botões”.",
            "A função desta parte é: O input recebe o nome e os botões chamam as funções.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            },
            {
              "nome": "onclick",
              "descricao": "Atributo HTML que chama uma função quando ocorre um clique."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma lista de nomes armazenada em array ficará disponível na página.",
          "alerta": "Começar o for em 1 e ignorar a posição zero."
        },
        {
          "titulo": "Lista e mensagem",
          "linhas": [
            53,
            61
          ],
          "explicacao": "A mensagem informa o resultado e a lista ordenada apresenta os participantes.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Lista e mensagem”.",
            "A função desta parte é: A mensagem informa o resultado e a lista ordenada apresenta os participantes.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<script>",
              "descricao": "Liga ou contém o código JavaScript executado pela página."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma lista de nomes armazenada em array ficará disponível na página.",
          "alerta": "Usar indice <= nomes.length e acessar uma posição inexistente."
        },
        {
          "titulo": "Ligação com o script",
          "linhas": [
            61,
            61
          ],
          "explicacao": "O JavaScript é carregado no final do documento.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Ligação com o script”.",
            "A função desta parte é: O JavaScript é carregado no final do documento.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "Ligação com o script",
              "descricao": "Trecho selecionado pelo tutorial para construir uma parte específica da atividade."
            },
            {
              "nome": "Linhas 61–61",
              "descricao": "Intervalo validado dentro do arquivo HTML."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma lista de nomes armazenada em array ficará disponível na página.",
          "alerta": "Tentar reatribuir const nomes em vez de alterar seu conteúdo."
        }
      ],
      "css": [
        {
          "titulo": "Página e container",
          "linhas": [
            1,
            24
          ],
          "explicacao": "A página recebe fundo, espaçamento e um cartão central responsivo.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Página e container”.",
            "A função desta parte é: A página recebe fundo, espaçamento e um cartão central responsivo.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Escrever nomes = nomeDigitado e substituir o array por um texto."
        },
        {
          "titulo": "Título e etiqueta",
          "linhas": [
            26,
            49
          ],
          "explicacao": "A apresentação visual organiza o início da atividade.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Título e etiqueta”.",
            "A função desta parte é: A apresentação visual organiza o início da atividade.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Esquecer os parênteses em push()."
        },
        {
          "titulo": "Painel do array",
          "linhas": [
            51,
            86
          ],
          "explicacao": "A grade mostra três informações importantes do array.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Painel do array”.",
            "A função desta parte é: A grade mostra três informações importantes do array.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Usar nomes.length como último índice sem subtrair 1."
        },
        {
          "titulo": "Entrada e ações",
          "linhas": [
            88,
            145
          ],
          "explicacao": "Campo e botões são preparados para diferentes dispositivos.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Entrada e ações”.",
            "A função desta parte é: Campo e botões são preparados para diferentes dispositivos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Começar o for em 1 e ignorar a posição zero."
        },
        {
          "titulo": "Lista de nomes",
          "linhas": [
            147,
            177
          ],
          "explicacao": "Cada item recebe destaque e a lista vazia possui um estado próprio.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Lista de nomes”.",
            "A função desta parte é: Cada item recebe destaque e a lista vazia possui um estado próprio.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "@media",
              "descricao": "Regra que aplica estilos conforme as características da tela."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Usar indice <= nomes.length e acessar uma posição inexistente."
        },
        {
          "titulo": "Responsividade",
          "linhas": [
            177,
            177
          ],
          "explicacao": "No celular, painéis e botões ficam em uma coluna.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Responsividade”.",
            "A função desta parte é: No celular, painéis e botões ficam em uma coluna.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "Responsividade",
              "descricao": "Trecho selecionado pelo tutorial para construir uma parte específica da atividade."
            },
            {
              "nome": "Linhas 177–177",
              "descricao": "Intervalo validado dentro do arquivo CSS."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Tentar reatribuir const nomes em vez de alterar seu conteúdo."
        }
      ],
      "js": [
        {
          "titulo": "Criação do array",
          "linhas": [
            1,
            1
          ],
          "explicacao": "O array começa vazio e será preenchido durante o uso da página.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Criação do array”.",
            "A função desta parte é: O array começa vazio e será preenchido durante o uso da página.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista de nomes armazenada em array responderá aos dados ou ações do usuário.",
          "alerta": "Escrever nomes = nomeDigitado e substituir o array por um texto.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Variáveis separadas: A quantidade precisa ser prevista e o código cresce rapidamente."
        },
        {
          "titulo": "Captura e validação",
          "linhas": [
            3,
            13
          ],
          "explicacao": "A função captura o nome e impede a inclusão de um valor vazio.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Captura e validação”.",
            "A função desta parte é: A função captura o nome e impede a inclusão de um valor vazio.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista de nomes armazenada em array responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer os parênteses em push().",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Adição com push",
          "linhas": [
            15,
            17
          ],
          "explicacao": "push() adiciona o novo nome ao final do array.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Adição com push”.",
            "A função desta parte é: push() adiciona o novo nome ao final do array.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "push()",
              "descricao": "Adiciona um item ao final do array."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista de nomes armazenada em array responderá aos dados ou ações do usuário.",
          "alerta": "Usar nomes.length como último índice sem subtrair 1.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Array: A coleção cresce dinamicamente e mantém posições numeradas."
        },
        {
          "titulo": "Mensagem e limpeza do campo",
          "linhas": [
            19,
            25
          ],
          "explicacao": "A página informa a inclusão e prepara o campo para outro nome.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Mensagem e limpeza do campo”.",
            "A função desta parte é: A página informa a inclusão e prepara o campo para outro nome.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista de nomes armazenada em array responderá aos dados ou ações do usuário.",
          "alerta": "Começar o for em 1 e ignorar a posição zero.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Percorrendo o array",
          "linhas": [
            28,
            36
          ],
          "explicacao": "O laço for usa os índices para criar um item para cada nome.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Percorrendo o array”.",
            "A função desta parte é: O laço for usa os índices para criar um item para cada nome.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "for",
              "descricao": "Controla uma repetição por inicialização, condição e atualização."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista de nomes armazenada em array responderá aos dados ou ações do usuário.",
          "alerta": "Usar indice <= nomes.length e acessar uma posição inexistente.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Array: A coleção cresce dinamicamente e mantém posições numeradas."
        },
        {
          "titulo": "Quantidade e posições",
          "linhas": [
            38,
            47
          ],
          "explicacao": "length mostra a quantidade; índice zero e length - 1 acessam primeiro e último.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Quantidade e posições”.",
            "A função desta parte é: length mostra a quantidade; índice zero e length - 1 acessam primeiro e último.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "else",
              "descricao": "Executa o caminho alternativo quando as condições anteriores são falsas."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista de nomes armazenada em array responderá aos dados ou ações do usuário.",
          "alerta": "Tentar reatribuir const nomes em vez de alterar seu conteúdo.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Estado vazio",
          "linhas": [
            48,
            56
          ],
          "explicacao": "Quando o array está vazio, a interface mostra uma mensagem adequada.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Estado vazio”.",
            "A função desta parte é: Quando o array está vazio, a interface mostra uma mensagem adequada.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista de nomes armazenada em array responderá aos dados ou ações do usuário.",
          "alerta": "Escrever nomes = nomeDigitado e substituir o array por um texto.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Array: A coleção cresce dinamicamente e mantém posições numeradas."
        },
        {
          "titulo": "Limpando o array",
          "linhas": [
            60,
            64
          ],
          "explicacao": "Definir length como zero remove todos os itens sem trocar a constante.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Limpando o array”.",
            "A função desta parte é: Definir length como zero remove todos os itens sem trocar a constante.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista de nomes armazenada em array responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer os parênteses em push().",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 16 — Lista de Nomes com Array em JavaScript",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como o JavaScript pode armazenar vários valores dentro de um array e utilizar posições numéricas para acessar os dados cadastrados.\n\n**O que será desenvolvido**\n\nNeste exercício, será criada uma Lista de Participantes com um campo para digitar nomes, botões para adicionar e limpar, indicadores de quantidade, primeiro e último nome e uma lista numerada com todos os participantes cadastrados.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-16`.\n\nArquivos obrigatórios:\n- `index.html`\n- `estilo.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá validar o campo vazio, adicionar cada novo nome ao array com `push()`, utilizar `length` para mostrar a quantidade, acessar a primeira e a última posição e percorrer o array para construir a lista na página.\n\n**Como testar**\n\n- Para testar, cadastre pelo menos três nomes, confira a quantidade e as posições mostradas e depois utilize o botão \"Limpar lista\".\n- Campo vazio.\n- Adicionar o nome Ana.\n- Adicionar três nomes e conferir length.\n- Conferir índice zero.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-16` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como o JavaScript pode armazenar vários valores dentro de um array e utilizar posições numéricas para acessar os dados cadastrados.",
      "desenvolvimento": "Neste exercício, será criada uma Lista de Participantes com um campo para digitar nomes, botões para adicionar e limpar, indicadores de quantidade, primeiro e último nome e uma lista numerada com todos os participantes cadastrados.",
      "funcionamento": "O programa deverá validar o campo vazio, adicionar cada novo nome ao array com `push()`, utilizar `length` para mostrar a quantidade, acessar a primeira e a última posição e percorrer o array para construir a lista na página.",
      "testes": [
        "Para testar, cadastre pelo menos três nomes, confira a quantidade e as posições mostradas e depois utilize o botão \"Limpar lista\".",
        "Campo vazio.",
        "Adicionar o nome Ana.",
        "Adicionar três nomes e conferir length.",
        "Conferir índice zero."
      ],
      "arquivos": [
        "index.html",
        "estilo.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-16` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false
    },
    "contextoDetalhado": [
      "A atividade constrói uma lista de nomes armazenada em array.",
      "Em aplicações reais, coleções organizam vários valores relacionados sem criar uma variável para cada item.",
      "O exercício conecta const, inputs, trim() aos novos recursos array, índice, push(), length.",
      "O tutorial separa estrutura, aparência e comportamento para mostrar como cada arquivo contribui para o resultado final.",
      "As gavetas podem ser abertas a qualquer momento para revisar o contexto, consultar exemplos, entender o trecho atual e conferir o glossário."
    ],
    "fluxoAprendizagem": [
      "Estrutura: Estrutura inicial",
      "Estrutura: Apresentação",
      "Estrutura: Indicadores do array",
      "Estrutura: Entrada e botões",
      "Estrutura: Lista e mensagem",
      "Estrutura: Ligação com o script",
      "Aparência: Página e container",
      "Aparência: Título e etiqueta"
    ],
    "dicasExtras": [
      "Localize no código onde aparece `array` e observe o que muda no preview quando esse trecho é executado.",
      "Leia o código em três perguntas: qual dado entra, qual regra é aplicada e qual resultado aparece na página?",
      "Use a gaveta Explicação da etapa antes de escrever o trecho; nela estão as partes, o motivo, o resultado esperado e os alertas.",
      "Depois do primeiro teste correto, altere apenas um valor para descobrir qual parte da lógica controla o comportamento.",
      "Evite este erro frequente: Escrever nomes = nomeDigitado e substituir o array por um texto.",
      "Teste orientado: Campo vazio"
    ],
    "perguntasGuia": [
      "Qual problema da atividade é resolvido por `array`?",
      "Qual é a diferença entre `array` e `índice` neste exercício?",
      "Que valor é lido antes da regra e que resultado é produzido depois?",
      "Como você explicaria a lógica de uma lista de nomes armazenada em array sem ler o código palavra por palavra?",
      "O que aconteceria se este erro fosse cometido: Escrever nomes = nomeDigitado e substituir o array por um texto."
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor."
    ],
    "glossarioExtra": [
      {
        "termo": "array",
        "tipo": "Coleção ordenada",
        "definicao": "Estrutura que guarda vários valores em posições numeradas."
      },
      {
        "termo": "índice",
        "tipo": "Posição numérica",
        "definicao": "Número que identifica a posição de um item, começando normalmente em zero."
      },
      {
        "termo": "posição",
        "tipo": "Local na coleção",
        "definicao": "Lugar ocupado por um valor dentro do array."
      },
      {
        "termo": "push",
        "tipo": "Método de array",
        "definicao": "Adiciona um novo item ao final do array."
      },
      {
        "termo": "length",
        "tipo": "Propriedade de tamanho",
        "definicao": "Informa a quantidade de caracteres de uma string ou itens de um array."
      }
    ],
    "comparacoes": [
      {
        "titulo": "Variáveis separadas",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "A quantidade precisa ser prevista e o código cresce rapidamente."
      },
      {
        "titulo": "Array",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "A coleção cresce dinamicamente e mantém posições numeradas."
      }
    ],
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 17,
    "studentReferenceStripped": true,
    "titulo": "Exercício 17 — Percorrendo Arrays com forEach em JavaScript",
    "nomeCurto": "Percorrendo arrays com forEach",
    "tema": "forEach, callback, item e índice",
    "objetivo": "Percorrer todos os valores de um array com forEach e construir uma lista dinâmica.",
    "retomadas": [
      "array",
      "índice",
      "length",
      "const",
      "let",
      "funções",
      "createElement",
      "appendChild",
      "innerText"
    ],
    "novos": [
      "forEach()",
      "callback",
      "parâmetro do item",
      "parâmetro do índice",
      "execução para cada elemento"
    ],
    "pasta": "exercicio-17",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
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
          "titulo": "Estrutura inicial",
          "linhas": [
            1,
            8
          ],
          "explicacao": "O documento configura idioma, responsividade e o arquivo de estilos.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Estrutura inicial”.",
            "A função desta parte é: O documento configura idioma, responsividade e o arquivo de estilos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<!DOCTYPE html>",
              "descricao": "Informa ao navegador que o documento usa o padrão HTML5."
            },
            {
              "nome": "<html>",
              "descricao": "Elemento raiz que envolve todo o documento."
            },
            {
              "nome": "<head>",
              "descricao": "Reúne configurações e referências que não formam o conteúdo principal."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma lista dinâmica percorrida com forEach ficará disponível na página.",
          "alerta": "Escrever forEach sem os parênteses."
        },
        {
          "titulo": "Título da trilha",
          "linhas": [
            10,
            15
          ],
          "explicacao": "A introdução informa que o objetivo é percorrer um array com forEach.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Título da trilha”.",
            "A função desta parte é: A introdução informa que o objetivo é percorrer um array com forEach.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma lista dinâmica percorrida com forEach ficará disponível na página.",
          "alerta": "Esquecer de passar uma função para o método."
        },
        {
          "titulo": "Conceitos principais",
          "linhas": [
            17,
            35
          ],
          "explicacao": "Os cartões antecipam os termos array, callback e índice.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Conceitos principais”.",
            "A função desta parte é: Os cartões antecipam os termos array, callback e índice.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma lista dinâmica percorrida com forEach ficará disponível na página.",
          "alerta": "Confundir o primeiro parâmetro da callback com o índice."
        },
        {
          "titulo": "Indicadores",
          "linhas": [
            37,
            49
          ],
          "explicacao": "Os elementos mostram o tamanho do array e quantos itens foram processados.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Indicadores”.",
            "A função desta parte é: Os elementos mostram o tamanho do array e quantos itens foram processados.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            },
            {
              "nome": "onclick",
              "descricao": "Atributo HTML que chama uma função quando ocorre um clique."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma lista dinâmica percorrida com forEach ficará disponível na página.",
          "alerta": "Exibir o índice diretamente e começar a numeração em zero."
        },
        {
          "titulo": "Botões e mensagem",
          "linhas": [
            51,
            61
          ],
          "explicacao": "Os botões executam as funções e a mensagem informa o resultado.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Botões e mensagem”.",
            "A função desta parte é: Os botões executam as funções e a mensagem informa o resultado.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma lista dinâmica percorrida com forEach ficará disponível na página.",
          "alerta": "Tentar usar return para interromper todo o forEach."
        },
        {
          "titulo": "Lista dinâmica",
          "linhas": [
            63,
            65
          ],
          "explicacao": "A lista ordenada será preenchida pelo JavaScript.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Lista dinâmica”.",
            "A função desta parte é: A lista ordenada será preenchida pelo JavaScript.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<script>",
              "descricao": "Liga ou contém o código JavaScript executado pela página."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma lista dinâmica percorrida com forEach ficará disponível na página.",
          "alerta": "Usar uma arrow function antes de ela ser apresentada formalmente."
        }
      ],
      "css": [
        {
          "titulo": "Página principal",
          "linhas": [
            1,
            24
          ],
          "explicacao": "O body e o container centralizam a atividade e definem o fundo.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Página principal”.",
            "A função desta parte é: O body e o container centralizam a atividade e definem o fundo.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Escrever forEach sem os parênteses."
        },
        {
          "titulo": "Cabeçalho",
          "linhas": [
            26,
            49
          ],
          "explicacao": "A etiqueta, o título e a introdução organizam a apresentação.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Cabeçalho”.",
            "A função desta parte é: A etiqueta, o título e a introdução organizam a apresentação.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Esquecer de passar uma função para o método."
        },
        {
          "titulo": "Cartões dos conceitos",
          "linhas": [
            51,
            82
          ],
          "explicacao": "A grade apresenta array, callback e índice em três cartões.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Cartões dos conceitos”.",
            "A função desta parte é: A grade apresenta array, callback e índice em três cartões.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Confundir o primeiro parâmetro da callback com o índice."
        },
        {
          "titulo": "Resumo do processamento",
          "linhas": [
            84,
            119
          ],
          "explicacao": "Dois indicadores exibem o total e a quantidade processada.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Resumo do processamento”.",
            "A função desta parte é: Dois indicadores exibem o total e a quantidade processada.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Exibir o índice diretamente e começar a numeração em zero."
        },
        {
          "titulo": "Ações e mensagens",
          "linhas": [
            121,
            166
          ],
          "explicacao": "Os botões e a área de mensagem recebem estilos de interação.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Ações e mensagens”.",
            "A função desta parte é: Os botões e a área de mensagem recebem estilos de interação.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Tentar usar return para interromper todo o forEach."
        },
        {
          "titulo": "Lista e responsividade",
          "linhas": [
            168,
            181
          ],
          "explicacao": "A trilha ganha cartões e passa para uma coluna em telas menores.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Lista e responsividade”.",
            "A função desta parte é: A trilha ganha cartões e passa para uma coluna em telas menores.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Usar uma arrow function antes de ela ser apresentada formalmente."
        }
      ],
      "js": [
        {
          "titulo": "Array de tecnologias",
          "linhas": [
            1,
            7
          ],
          "explicacao": "O array possui cinco strings que serão visitadas pelo forEach.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Array de tecnologias”.",
            "A função desta parte é: O array possui cinco strings que serão visitadas pelo forEach.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista dinâmica percorrida com forEach responderá aos dados ou ações do usuário.",
          "alerta": "Escrever forEach sem os parênteses.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Acesso manual: Exige escrever cada posição e conhecer a quantidade."
        },
        {
          "titulo": "Preparação da função",
          "linhas": [
            9,
            14
          ],
          "explicacao": "A função recupera os elementos, cria um contador local e limpa a lista.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Preparação da função”.",
            "A função desta parte é: A função recupera os elementos, cria um contador local e limpa a lista.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista dinâmica percorrida com forEach responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer de passar uma função para o método.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Início do forEach",
          "linhas": [
            16,
            18
          ],
          "explicacao": "A callback recebe tecnologia e índice em cada repetição.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Início do forEach”.",
            "A função desta parte é: A callback recebe tecnologia e índice em cada repetição.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "forEach()",
              "descricao": "Executa um callback para cada item do array."
            },
            {
              "nome": "createElement()",
              "descricao": "Cria um novo elemento no DOM."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista dinâmica percorrida com forEach responderá aos dados ou ações do usuário.",
          "alerta": "Confundir o primeiro parâmetro da callback com o índice.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Percurso com forEach: Executa o callback automaticamente para todos os itens."
        },
        {
          "titulo": "Criação do item",
          "linhas": [
            19,
            24
          ],
          "explicacao": "O índice é convertido para uma posição iniciada em 1 e o texto é preparado.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Criação do item”.",
            "A função desta parte é: O índice é convertido para uma posição iniciada em 1 e o texto é preparado.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "appendChild()",
              "descricao": "Insere um elemento como filho de outro."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista dinâmica percorrida com forEach responderá aos dados ou ações do usuário.",
          "alerta": "Exibir o índice diretamente e começar a numeração em zero.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Inserção e contagem",
          "linhas": [
            26,
            28
          ],
          "explicacao": "Cada item é adicionado e o contador local é incrementado.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Inserção e contagem”.",
            "A função desta parte é: Cada item é adicionado e o contador local é incrementado.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista dinâmica percorrida com forEach responderá aos dados ou ações do usuário.",
          "alerta": "Tentar usar return para interromper todo o forEach.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Percurso com forEach: Executa o callback automaticamente para todos os itens."
        },
        {
          "titulo": "Atualização dos indicadores",
          "linhas": [
            31,
            36
          ],
          "explicacao": "A página mostra o tamanho do array e a quantidade processada.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Atualização dos indicadores”.",
            "A função desta parte é: A página mostra o tamanho do array e a quantidade processada.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista dinâmica percorrida com forEach responderá aos dados ou ações do usuário.",
          "alerta": "Usar uma arrow function antes de ela ser apresentada formalmente.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Mensagem final",
          "linhas": [
            38,
            41
          ],
          "explicacao": "A mensagem confirma que todos os itens foram percorridos.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Mensagem final”.",
            "A função desta parte é: A mensagem confirma que todos os itens foram percorridos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista dinâmica percorrida com forEach responderá aos dados ou ações do usuário.",
          "alerta": "Escrever forEach sem os parênteses.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Percurso com forEach: Executa o callback automaticamente para todos os itens."
        },
        {
          "titulo": "Limpeza da trilha",
          "linhas": [
            44,
            48
          ],
          "explicacao": "A função restaura a lista, o contador e a mensagem inicial.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Limpeza da trilha”.",
            "A função desta parte é: A função restaura a lista, o contador e a mensagem inicial.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista dinâmica percorrida com forEach responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer de passar uma função para o método.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 17 — Percorrendo Arrays com forEach em JavaScript",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como o JavaScript pode percorrer todos os itens de um array utilizando o método `forEach()` e uma função executada para cada elemento.\n\n**O que será desenvolvido**\n\nNeste exercício, será criada uma Trilha de Tecnologias Front-End com cartões explicativos sobre array, callback e índice, indicadores da quantidade de itens, botões para mostrar e limpar e uma lista numerada com as etapas HTML, CSS, JavaScript, Git e GitHub.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-17`.\n\nArquivos obrigatórios:\n- `index.html`\n- `estilo.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá utilizar `forEach()` para acessar cada tecnologia, receber o item e o índice na função de callback, criar um elemento da lista, mostrar a posição correspondente e contar quantos itens foram processados.\n\n**Como testar**\n\n- Para testar, clique em \"Mostrar trilha\", confira as cinco etapas e depois utilize o botão \"Limpar\".\n- Abrir a página antes de executar o forEach.\n- Mostrar as cinco tecnologias.\n- Conferir a primeira posição como 1ª etapa.\n- Conferir a última posição como 5ª etapa.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-17` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como o JavaScript pode percorrer todos os itens de um array utilizando o método `forEach()` e uma função executada para cada elemento.",
      "desenvolvimento": "Neste exercício, será criada uma Trilha de Tecnologias Front-End com cartões explicativos sobre array, callback e índice, indicadores da quantidade de itens, botões para mostrar e limpar e uma lista numerada com as etapas HTML, CSS, JavaScript, Git e GitHub.",
      "funcionamento": "O programa deverá utilizar `forEach()` para acessar cada tecnologia, receber o item e o índice na função de callback, criar um elemento da lista, mostrar a posição correspondente e contar quantos itens foram processados.",
      "testes": [
        "Para testar, clique em \"Mostrar trilha\", confira as cinco etapas e depois utilize o botão \"Limpar\".",
        "Abrir a página antes de executar o forEach.",
        "Mostrar as cinco tecnologias.",
        "Conferir a primeira posição como 1ª etapa.",
        "Conferir a última posição como 5ª etapa."
      ],
      "arquivos": [
        "index.html",
        "estilo.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-17` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false
    },
    "contextoDetalhado": [
      "A atividade constrói uma lista dinâmica percorrida com forEach.",
      "Em aplicações reais, interfaces transformam cada item de uma coleção em conteúdo visível.",
      "O exercício conecta array, índice, length aos novos recursos forEach(), callback, parâmetro do item, parâmetro do índice.",
      "O tutorial separa estrutura, aparência e comportamento para mostrar como cada arquivo contribui para o resultado final.",
      "As gavetas podem ser abertas a qualquer momento para revisar o contexto, consultar exemplos, entender o trecho atual e conferir o glossário."
    ],
    "fluxoAprendizagem": [
      "Estrutura: Estrutura inicial",
      "Estrutura: Título da trilha",
      "Estrutura: Conceitos principais",
      "Estrutura: Indicadores",
      "Estrutura: Botões e mensagem",
      "Estrutura: Lista dinâmica",
      "Aparência: Página principal",
      "Aparência: Cabeçalho"
    ],
    "dicasExtras": [
      "Localize no código onde aparece `forEach()` e observe o que muda no preview quando esse trecho é executado.",
      "Leia o código em três perguntas: qual dado entra, qual regra é aplicada e qual resultado aparece na página?",
      "Use a gaveta Explicação da etapa antes de escrever o trecho; nela estão as partes, o motivo, o resultado esperado e os alertas.",
      "Depois do primeiro teste correto, altere apenas um valor para descobrir qual parte da lógica controla o comportamento.",
      "Evite este erro frequente: Escrever forEach sem os parênteses.",
      "Teste orientado: Abrir a página antes de executar o forEach"
    ],
    "perguntasGuia": [
      "Qual problema da atividade é resolvido por `forEach()`?",
      "Qual é a diferença entre `forEach()` e `callback` neste exercício?",
      "Que valor é lido antes da regra e que resultado é produzido depois?",
      "Como você explicaria a lógica de uma lista dinâmica percorrida com forEach sem ler o código palavra por palavra?",
      "O que aconteceria se este erro fosse cometido: Escrever forEach sem os parênteses."
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Cenário de teste: Abrir a página antes de executar o forEach",
      "Cenário de teste: Mostrar as cinco tecnologias"
    ],
    "glossarioExtra": [
      {
        "termo": "forEach",
        "tipo": "Método de array",
        "definicao": "Executa uma função uma vez para cada item de um array."
      },
      {
        "termo": "callback",
        "tipo": "Função recebida",
        "definicao": "Função entregue a outro recurso para ser executada em um momento ou situação específica."
      },
      {
        "termo": "item atual",
        "tipo": "Parâmetro do percurso",
        "definicao": "Valor do array que está sendo processado naquela repetição."
      },
      {
        "termo": "índice atual",
        "tipo": "Parâmetro do percurso",
        "definicao": "Posição do item que está sendo processado pelo callback."
      }
    ],
    "comparacoes": [
      {
        "titulo": "Acesso manual",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Exige escrever cada posição e conhecer a quantidade."
      },
      {
        "titulo": "Percurso com forEach",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Executa o callback automaticamente para todos os itens."
      }
    ],
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 18,
    "studentReferenceStripped": true,
    "titulo": "Exercício 18 — Eventos com addEventListener em JavaScript",
    "nomeCurto": "Eventos com addEventListener",
    "tema": "Registro de eventos sem onclick no HTML",
    "objetivo": "Registrar eventos no JavaScript com addEventListener e executar callbacks em diferentes interações.",
    "retomadas": [
      "getElementById",
      "funções",
      "callback",
      "const",
      "let",
      "innerText",
      "style",
      "value",
      "length"
    ],
    "novos": [
      "addEventListener()",
      "evento click",
      "evento input",
      "mouseenter",
      "mouseleave",
      "objeto event",
      "event.target"
    ],
    "pasta": "exercicio-18",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
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
          "titulo": "Estrutura inicial",
          "linhas": [
            1,
            8
          ],
          "explicacao": "A página configura idioma, responsividade e o arquivo de estilos.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Estrutura inicial”.",
            "A função desta parte é: A página configura idioma, responsividade e o arquivo de estilos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<!DOCTYPE html>",
              "descricao": "Informa ao navegador que o documento usa o padrão HTML5."
            },
            {
              "nome": "<html>",
              "descricao": "Elemento raiz que envolve todo o documento."
            },
            {
              "nome": "<head>",
              "descricao": "Reúne configurações e referências que não formam o conteúdo principal."
            },
            {
              "nome": "addEventListener()",
              "descricao": "Registra uma função para responder a um evento."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um laboratório de eventos ficará disponível na página.",
          "alerta": "Escrever addEventListener sem os parênteses."
        },
        {
          "titulo": "Apresentação",
          "linhas": [
            10,
            15
          ],
          "explicacao": "O título informa que os eventos serão registrados no JavaScript.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Apresentação”.",
            "A função desta parte é: O título informa que os eventos serão registrados no JavaScript.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um laboratório de eventos ficará disponível na página.",
          "alerta": "Usar click sem aspas."
        },
        {
          "titulo": "Conceitos dos eventos",
          "linhas": [
            17,
            35
          ],
          "explicacao": "Os cartões apresentam elemento, evento e callback.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Conceitos dos eventos”.",
            "A função desta parte é: Os cartões apresentam elemento, evento e callback.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<input>",
              "descricao": "Campo de entrada usado para capturar um valor do usuário."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um laboratório de eventos ficará disponível na página.",
          "alerta": "Executar a função ao registrá-la: reiniciarPainel()."
        },
        {
          "titulo": "Campo e visualização",
          "linhas": [
            37,
            51
          ],
          "explicacao": "O input dispara o evento input e a área mostra o texto digitado.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Campo e visualização”.",
            "A função desta parte é: O input dispara o evento input e a área mostra o texto digitado.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um laboratório de eventos ficará disponível na página.",
          "alerta": "Escrever evento.value em vez de evento.target.value."
        },
        {
          "titulo": "Área do mouse e botões",
          "linhas": [
            53,
            62
          ],
          "explicacao": "Os elementos possuem ids, mas não utilizam onclick no HTML.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Área do mouse e botões”.",
            "A função desta parte é: Os elementos possuem ids, mas não utilizam onclick no HTML.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um laboratório de eventos ficará disponível na página.",
          "alerta": "Selecionar um id que não existe no HTML."
        },
        {
          "titulo": "Indicadores e script",
          "linhas": [
            64,
            77
          ],
          "explicacao": "Os indicadores recebem os resultados e o script é carregado no final.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Indicadores e script”.",
            "A função desta parte é: Os indicadores recebem os resultados e o script é carregado no final.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "<script>",
              "descricao": "Liga ou contém o código JavaScript executado pela página."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um laboratório de eventos ficará disponível na página.",
          "alerta": "Colocar novamente onclick no botão e duplicar o evento."
        }
      ],
      "css": [
        {
          "titulo": "Página e container",
          "linhas": [
            1,
            24
          ],
          "explicacao": "A atividade recebe fundo e cartão principal responsivo.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Página e container”.",
            "A função desta parte é: A atividade recebe fundo e cartão principal responsivo.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Escrever addEventListener sem os parênteses."
        },
        {
          "titulo": "Cabeçalho",
          "linhas": [
            26,
            49
          ],
          "explicacao": "A etiqueta e o título organizam a apresentação.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Cabeçalho”.",
            "A função desta parte é: A etiqueta e o título organizam a apresentação.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Usar click sem aspas."
        },
        {
          "titulo": "Cartões conceituais",
          "linhas": [
            51,
            82
          ],
          "explicacao": "A grade mostra os conceitos em três cartões.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Cartões conceituais”.",
            "A função desta parte é: A grade mostra os conceitos em três cartões.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Executar a função ao registrá-la: reiniciarPainel()."
        },
        {
          "titulo": "Campo e pré-visualização",
          "linhas": [
            84,
            132
          ],
          "explicacao": "O input e a mensagem recebem estilos para interação.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Campo e pré-visualização”.",
            "A função desta parte é: O input e a mensagem recebem estilos para interação.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Escrever evento.value em vez de evento.target.value."
        },
        {
          "titulo": "Área e botões",
          "linhas": [
            134,
            185
          ],
          "explicacao": "A área reage ao mouse e os botões controlam as ações.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Área e botões”.",
            "A função desta parte é: A área reage ao mouse e os botões controlam as ações.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "@media",
              "descricao": "Regra que aplica estilos conforme as características da tela."
            },
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Selecionar um id que não existe no HTML."
        },
        {
          "titulo": "Resumo e responsividade",
          "linhas": [
            185,
            185
          ],
          "explicacao": "Os indicadores se reorganizam em uma coluna no celular.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Resumo e responsividade”.",
            "A função desta parte é: Os indicadores se reorganizam em uma coluna no celular.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "Resumo e responsividade",
              "descricao": "Trecho selecionado pelo tutorial para construir uma parte específica da atividade."
            },
            {
              "nome": "Linhas 185–185",
              "descricao": "Intervalo validado dentro do arquivo CSS."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Colocar novamente onclick no botão e duplicar o evento."
        }
      ],
      "js": [
        {
          "titulo": "Seleção dos elementos",
          "linhas": [
            1,
            5
          ],
          "explicacao": "Os elementos são selecionados uma vez e guardados em constantes.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Seleção dos elementos”.",
            "A função desta parte é: Os elementos são selecionados uma vez e guardados em constantes.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de eventos responderá aos dados ou ações do usuário.",
          "alerta": "Escrever addEventListener sem os parênteses.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Evento no HTML: Mistura a chamada do JavaScript com a marcação."
        },
        {
          "titulo": "Evento de clique",
          "linhas": [
            9,
            17
          ],
          "explicacao": "addEventListener registra uma callback para o clique do botão.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Evento de clique”.",
            "A função desta parte é: addEventListener registra uma callback para o clique do botão.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "addEventListener()",
              "descricao": "Registra uma função para responder a um evento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de eventos responderá aos dados ou ações do usuário.",
          "alerta": "Usar click sem aspas.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Objeto do evento",
          "linhas": [
            19,
            21
          ],
          "explicacao": "A callback do input recebe o objeto evento e acessa event.target.value.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Objeto do evento”.",
            "A função desta parte é: A callback do input recebe o objeto evento e acessa event.target.value.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            },
            {
              "nome": "addEventListener()",
              "descricao": "Registra uma função para responder a um evento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de eventos responderá aos dados ou ações do usuário.",
          "alerta": "Executar a função ao registrá-la: reiniciarPainel().",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Evento no JavaScript: Mantém comportamento no script e permite vários listeners."
        },
        {
          "titulo": "Pré-visualização",
          "linhas": [
            23,
            35
          ],
          "explicacao": "O texto e a quantidade de caracteres são atualizados a cada digitação.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Pré-visualização”.",
            "A função desta parte é: O texto e a quantidade de caracteres são atualizados a cada digitação.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "else",
              "descricao": "Executa o caminho alternativo quando as condições anteriores são falsas."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de eventos responderá aos dados ou ações do usuário.",
          "alerta": "Escrever evento.value em vez de evento.target.value.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Entrada do mouse",
          "linhas": [
            38,
            48
          ],
          "explicacao": "mouseenter altera o texto, o fundo e o último evento.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Entrada do mouse”.",
            "A função desta parte é: mouseenter altera o texto, o fundo e o último evento.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "addEventListener()",
              "descricao": "Registra uma função para responder a um evento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de eventos responderá aos dados ou ações do usuário.",
          "alerta": "Selecionar um id que não existe no HTML.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Evento no JavaScript: Mantém comportamento no script e permite vários listeners."
        },
        {
          "titulo": "Saída do mouse",
          "linhas": [
            51,
            61
          ],
          "explicacao": "mouseleave restaura a área de interação.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Saída do mouse”.",
            "A função desta parte é: mouseleave restaura a área de interação.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "addEventListener()",
              "descricao": "Registra uma função para responder a um evento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de eventos responderá aos dados ou ações do usuário.",
          "alerta": "Colocar novamente onclick no botão e duplicar o evento.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Callback nomeada",
          "linhas": [
            64,
            66
          ],
          "explicacao": "O botão Reiniciar utiliza uma função já declarada como callback.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Callback nomeada”.",
            "A função desta parte é: O botão Reiniciar utiliza uma função já declarada como callback.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de eventos responderá aos dados ou ações do usuário.",
          "alerta": "Escrever addEventListener sem os parênteses.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Evento no JavaScript: Mantém comportamento no script e permite vários listeners."
        },
        {
          "titulo": "Reinício",
          "linhas": [
            68,
            77
          ],
          "explicacao": "A função restaura os valores, textos e estilos iniciais.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Reinício”.",
            "A função desta parte é: A função restaura os valores, textos e estilos iniciais.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de eventos responderá aos dados ou ações do usuário.",
          "alerta": "Usar click sem aspas.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 18 — Eventos com addEventListener em JavaScript",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como o JavaScript pode registrar eventos diretamente no arquivo `script.js`, mantendo o HTML sem os atributos `onclick`.\n\n**O que será desenvolvido**\n\nNeste exercício, será criado um Painel de Eventos com um campo de texto, uma pré-visualização da mensagem, uma área de interação com o mouse, botões para registrar e reiniciar e indicadores dos cliques, caracteres digitados e último evento executado.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-18`.\n\nArquivos obrigatórios:\n- `index.html`\n- `estilo.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá selecionar os elementos pelo `id`, utilizar `addEventListener()` para registrar eventos de clique, digitação, entrada e saída do mouse, receber o objeto do evento no campo de texto e executar funções de callback quando cada interação acontecer.\n\n**Como testar**\n\n- Para testar, digite uma mensagem, clique várias vezes em \"Registrar clique\", passe o mouse sobre a área destacada e depois utilize o botão \"Reiniciar\".\n- Confirmar que o HTML não contém onclick.\n- Registrar três cliques.\n- Digitar uma mensagem e contar caracteres.\n- Apagar todo o texto.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-18` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como o JavaScript pode registrar eventos diretamente no arquivo `script.js`, mantendo o HTML sem os atributos `onclick`.",
      "desenvolvimento": "Neste exercício, será criado um Painel de Eventos com um campo de texto, uma pré-visualização da mensagem, uma área de interação com o mouse, botões para registrar e reiniciar e indicadores dos cliques, caracteres digitados e último evento executado.",
      "funcionamento": "O programa deverá selecionar os elementos pelo `id`, utilizar `addEventListener()` para registrar eventos de clique, digitação, entrada e saída do mouse, receber o objeto do evento no campo de texto e executar funções de callback quando cada interação acontecer.",
      "testes": [
        "Para testar, digite uma mensagem, clique várias vezes em \"Registrar clique\", passe o mouse sobre a área destacada e depois utilize o botão \"Reiniciar\".",
        "Confirmar que o HTML não contém onclick.",
        "Registrar três cliques.",
        "Digitar uma mensagem e contar caracteres.",
        "Apagar todo o texto."
      ],
      "arquivos": [
        "index.html",
        "estilo.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-18` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false
    },
    "contextoDetalhado": [
      "A atividade constrói um laboratório de eventos.",
      "Em aplicações reais, interfaces respondem a clique, digitação e movimentos do ponteiro por callbacks.",
      "O exercício conecta getElementById, funções, callback aos novos recursos addEventListener(), evento click, evento input, mouseenter.",
      "O tutorial separa estrutura, aparência e comportamento para mostrar como cada arquivo contribui para o resultado final.",
      "As gavetas podem ser abertas a qualquer momento para revisar o contexto, consultar exemplos, entender o trecho atual e conferir o glossário."
    ],
    "fluxoAprendizagem": [
      "Estrutura: Estrutura inicial",
      "Estrutura: Apresentação",
      "Estrutura: Conceitos dos eventos",
      "Estrutura: Campo e visualização",
      "Estrutura: Área do mouse e botões",
      "Estrutura: Indicadores e script",
      "Aparência: Página e container",
      "Aparência: Cabeçalho"
    ],
    "dicasExtras": [
      "Localize no código onde aparece `addEventListener()` e observe o que muda no preview quando esse trecho é executado.",
      "Leia o código em três perguntas: qual dado entra, qual regra é aplicada e qual resultado aparece na página?",
      "Use a gaveta Explicação da etapa antes de escrever o trecho; nela estão as partes, o motivo, o resultado esperado e os alertas.",
      "Depois do primeiro teste correto, altere apenas um valor para descobrir qual parte da lógica controla o comportamento.",
      "Evite este erro frequente: Escrever addEventListener sem os parênteses.",
      "Teste orientado: Confirmar que o HTML não contém onclick"
    ],
    "perguntasGuia": [
      "Qual problema da atividade é resolvido por `addEventListener()`?",
      "Qual é a diferença entre `addEventListener()` e `evento click` neste exercício?",
      "Que valor é lido antes da regra e que resultado é produzido depois?",
      "Como você explicaria a lógica de um laboratório de eventos sem ler o código palavra por palavra?",
      "O que aconteceria se este erro fosse cometido: Escrever addEventListener sem os parênteses."
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Cenário de teste: Confirmar que o HTML não contém onclick",
      "Cenário de teste: Registrar três cliques"
    ],
    "glossarioExtra": [
      {
        "termo": "evento",
        "tipo": "Interação detectada",
        "definicao": "Acontecimento como clique, digitação ou movimento do ponteiro."
      },
      {
        "termo": "addEventListener",
        "tipo": "Registro de evento",
        "definicao": "Método que associa um tipo de evento a uma função callback."
      },
      {
        "termo": "callback",
        "tipo": "Função recebida",
        "definicao": "Função entregue a outro recurso para ser executada em um momento ou situação específica."
      },
      {
        "termo": "event.target",
        "tipo": "Origem do evento",
        "definicao": "Elemento específico que iniciou o evento."
      }
    ],
    "comparacoes": [
      {
        "titulo": "Evento no HTML",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Mistura a chamada do JavaScript com a marcação."
      },
      {
        "titulo": "Evento no JavaScript",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Mantém comportamento no script e permite vários listeners."
      }
    ],
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 19,
    "studentReferenceStripped": true,
    "titulo": "Exercício 19 — Manipulando Classes com classList em JavaScript",
    "nomeCurto": "Manipulando classes com classList",
    "tema": "add, remove, toggle e contains",
    "objetivo": "Controlar a aparência de elementos adicionando, removendo, alternando e verificando classes CSS.",
    "retomadas": [
      "addEventListener()",
      "click",
      "callback",
      "getElementById",
      "if",
      "array",
      "push()",
      "join()"
    ],
    "novos": [
      "classList",
      "classList.add()",
      "classList.remove()",
      "classList.toggle()",
      "classList.contains()"
    ],
    "pasta": "exercicio-19",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
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
          "titulo": "Estrutura inicial",
          "linhas": [
            1,
            8
          ],
          "explicacao": "O documento configura idioma, responsividade e o arquivo de estilos.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Estrutura inicial”.",
            "A função desta parte é: O documento configura idioma, responsividade e o arquivo de estilos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<!DOCTYPE html>",
              "descricao": "Informa ao navegador que o documento usa o padrão HTML5."
            },
            {
              "nome": "<html>",
              "descricao": "Elemento raiz que envolve todo o documento."
            },
            {
              "nome": "<head>",
              "descricao": "Reúne configurações e referências que não formam o conteúdo principal."
            },
            {
              "nome": "classList",
              "descricao": "Controla as classes CSS de um elemento."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um laboratório de classes CSS ficará disponível na página.",
          "alerta": "Escrever classlist com L minúsculo"
        },
        {
          "titulo": "Apresentação",
          "linhas": [
            10,
            15
          ],
          "explicacao": "O título apresenta o laboratório de classes CSS.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Apresentação”.",
            "A função desta parte é: O título apresenta o laboratório de classes CSS.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um laboratório de classes CSS ficará disponível na página.",
          "alerta": "Esquecer o ponto antes de classList"
        },
        {
          "titulo": "Métodos de classList",
          "linhas": [
            17,
            41
          ],
          "explicacao": "Os cartões explicam add, remove, toggle e contains.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Métodos de classList”.",
            "A função desta parte é: Os cartões explicam add, remove, toggle e contains.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um laboratório de classes CSS ficará disponível na página.",
          "alerta": "Usar toggle sem informar a classe"
        },
        {
          "titulo": "Cartão de perfil",
          "linhas": [
            43,
            56
          ],
          "explicacao": "O elemento recebe classes que modificarão seu tema e destaque.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Cartão de perfil”.",
            "A função desta parte é: O elemento recebe classes que modificarão seu tema e destaque.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um laboratório de classes CSS ficará disponível na página.",
          "alerta": "Confundir add com appendChild"
        },
        {
          "titulo": "Botões sem onclick",
          "linhas": [
            58,
            63
          ],
          "explicacao": "Os botões possuem ids e os eventos serão registrados no JavaScript.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Botões sem onclick”.",
            "A função desta parte é: Os botões possuem ids e os eventos serão registrados no JavaScript.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um laboratório de classes CSS ficará disponível na página.",
          "alerta": "Verificar uma classe com elemento.contains"
        },
        {
          "titulo": "Status e script",
          "linhas": [
            65,
            66
          ],
          "explicacao": "A área informa as classes ativas e o script é carregado no final.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Status e script”.",
            "A função desta parte é: A área informa as classes ativas e o script é carregado no final.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "Status e script",
              "descricao": "Trecho selecionado pelo tutorial para construir uma parte específica da atividade."
            },
            {
              "nome": "Linhas 65–66",
              "descricao": "Intervalo validado dentro do arquivo HTML."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um laboratório de classes CSS ficará disponível na página.",
          "alerta": "Alterar className e apagar classes existentes"
        }
      ],
      "css": [
        {
          "titulo": "Página principal",
          "linhas": [
            1,
            24
          ],
          "explicacao": "O body e o container definem o fundo e a área central.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Página principal”.",
            "A função desta parte é: O body e o container definem o fundo e a área central.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Escrever classlist com L minúsculo"
        },
        {
          "titulo": "Cabeçalho e conceitos",
          "linhas": [
            26,
            82
          ],
          "explicacao": "A apresentação e os quatro cartões organizam os métodos.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Cabeçalho e conceitos”.",
            "A função desta parte é: A apresentação e os quatro cartões organizam os métodos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "display: flex",
              "descricao": "Organiza elementos em um eixo flexível."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Esquecer o ponto antes de classList"
        },
        {
          "titulo": "Cartão de perfil",
          "linhas": [
            84,
            132
          ],
          "explicacao": "O cartão base, o avatar e os textos recebem os estilos iniciais.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Cartão de perfil”.",
            "A função desta parte é: O cartão base, o avatar e os textos recebem os estilos iniciais.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Usar toggle sem informar a classe"
        },
        {
          "titulo": "Classes controladas",
          "linhas": [
            134,
            157
          ],
          "explicacao": "tema-escuro, destaque e oculto alteram a aparência.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Classes controladas”.",
            "A função desta parte é: tema-escuro, destaque e oculto alteram a aparência.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Confundir add com appendChild"
        },
        {
          "titulo": "Botões e status",
          "linhas": [
            159,
            200
          ],
          "explicacao": "As ações e o painel de classes ativas são estilizados.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Botões e status”.",
            "A função desta parte é: As ações e o painel de classes ativas são estilizados.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "@media",
              "descricao": "Regra que aplica estilos conforme as características da tela."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Verificar uma classe com elemento.contains"
        },
        {
          "titulo": "Responsividade",
          "linhas": [
            200,
            200
          ],
          "explicacao": "A grade e o cartão se reorganizam em tablet e celular.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Responsividade”.",
            "A função desta parte é: A grade e o cartão se reorganizam em tablet e celular.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "Responsividade",
              "descricao": "Trecho selecionado pelo tutorial para construir uma parte específica da atividade."
            },
            {
              "nome": "Linhas 200–200",
              "descricao": "Intervalo validado dentro do arquivo CSS."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Alterar className e apagar classes existentes"
        }
      ],
      "js": [
        {
          "titulo": "Seleção dos elementos",
          "linhas": [
            1,
            6
          ],
          "explicacao": "Os elementos são selecionados e guardados em constantes.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Seleção dos elementos”.",
            "A função desta parte é: Os elementos são selecionados e guardados em constantes.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de classes CSS responderá aos dados ou ações do usuário.",
          "alerta": "Escrever classlist com L minúsculo",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Estilo direto: Altera uma propriedade por vez dentro do JavaScript."
        },
        {
          "titulo": "Alternância do tema",
          "linhas": [
            8,
            11
          ],
          "explicacao": "toggle adiciona ou remove tema-escuro automaticamente.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Alternância do tema”.",
            "A função desta parte é: toggle adiciona ou remove tema-escuro automaticamente.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "addEventListener()",
              "descricao": "Registra uma função para responder a um evento."
            },
            {
              "nome": "classList",
              "descricao": "Controla as classes CSS de um elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de classes CSS responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer o ponto antes de classList",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "add, remove e contains",
          "linhas": [
            13,
            22
          ],
          "explicacao": "O destaque é verificado antes de ser adicionado ou removido.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “add, remove e contains”.",
            "A função desta parte é: O destaque é verificado antes de ser adicionado ou removido.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "else",
              "descricao": "Executa o caminho alternativo quando as condições anteriores são falsas."
            },
            {
              "nome": "addEventListener()",
              "descricao": "Registra uma função para responder a um evento."
            },
            {
              "nome": "classList",
              "descricao": "Controla as classes CSS de um elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de classes CSS responderá aos dados ou ações do usuário.",
          "alerta": "Usar toggle sem informar a classe",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Classe CSS: Ativa ou desativa um conjunto de estilos definido no CSS."
        },
        {
          "titulo": "Ocultação dos detalhes",
          "linhas": [
            24,
            34
          ],
          "explicacao": "A classe oculto é alternada e o texto do botão acompanha o estado.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Ocultação dos detalhes”.",
            "A função desta parte é: A classe oculto é alternada e o texto do botão acompanha o estado.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "else",
              "descricao": "Executa o caminho alternativo quando as condições anteriores são falsas."
            },
            {
              "nome": "classList",
              "descricao": "Controla as classes CSS de um elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de classes CSS responderá aos dados ou ações do usuário.",
          "alerta": "Confundir add com appendChild",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Callback nomeada",
          "linhas": [
            36,
            36
          ],
          "explicacao": "O botão Restaurar utiliza uma função nomeada.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Callback nomeada”.",
            "A função desta parte é: O botão Restaurar utiliza uma função nomeada.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "Callback nomeada",
              "descricao": "Trecho selecionado pelo tutorial para construir uma parte específica da atividade."
            },
            {
              "nome": "Linhas 36–36",
              "descricao": "Intervalo validado dentro do arquivo JS."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de classes CSS responderá aos dados ou ações do usuário.",
          "alerta": "Verificar uma classe com elemento.contains",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Classe CSS: Ativa ou desativa um conjunto de estilos definido no CSS."
        },
        {
          "titulo": "Restauração",
          "linhas": [
            38,
            44
          ],
          "explicacao": "remove retira todas as classes adicionais.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Restauração”.",
            "A função desta parte é: remove retira todas as classes adicionais.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "classList",
              "descricao": "Controla as classes CSS de um elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de classes CSS responderá aos dados ou ações do usuário.",
          "alerta": "Alterar className e apagar classes existentes",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Verificação das classes",
          "linhas": [
            46,
            61
          ],
          "explicacao": "contains identifica as classes ativas e preenche um array.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Verificação das classes”.",
            "A função desta parte é: contains identifica as classes ativas e preenche um array.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "push()",
              "descricao": "Adiciona um item ao final do array."
            },
            {
              "nome": "classList",
              "descricao": "Controla as classes CSS de um elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de classes CSS responderá aos dados ou ações do usuário.",
          "alerta": "Escrever classlist com L minúsculo",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Classe CSS: Ativa ou desativa um conjunto de estilos definido no CSS."
        },
        {
          "titulo": "Exibição do status",
          "linhas": [
            63,
            67
          ],
          "explicacao": "length e join produzem a mensagem mostrada ao usuário.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Exibição do status”.",
            "A função desta parte é: length e join produzem a mensagem mostrada ao usuário.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "else",
              "descricao": "Executa o caminho alternativo quando as condições anteriores são falsas."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um laboratório de classes CSS responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer o ponto antes de classList",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 19 — Manipulando Classes com classList em JavaScript",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como o JavaScript pode adicionar, remover, alternar e verificar classes CSS em elementos da página.\n\n**O que será desenvolvido**\n\nNeste exercício, será criado um Laboratório de Classes CSS com um cartão de perfil, botões para alternar o tema, ativar um destaque, ocultar os detalhes e restaurar a aparência original, além de uma área que mostra as classes atualmente ativas.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-19`.\n\nArquivos obrigatórios:\n- `index.html`\n- `estilo.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá registrar os cliques com `addEventListener()`, utilizar `classList.toggle()` para alternar classes, `classList.add()` e `classList.remove()` para controlar o destaque e a restauração e `classList.contains()` para verificar o estado dos elementos.\n\n**Como testar**\n\n- Para testar, ative o tema escuro, o destaque e a ocultação dos detalhes; confira a lista de classes e depois utilize o botão \"Restaurar\".\n- HTML sem onclick.\n- Alternar tema duas vezes.\n- Adicionar e remover destaque.\n- Ocultar e mostrar detalhes.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-19` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como o JavaScript pode adicionar, remover, alternar e verificar classes CSS em elementos da página.",
      "desenvolvimento": "Neste exercício, será criado um Laboratório de Classes CSS com um cartão de perfil, botões para alternar o tema, ativar um destaque, ocultar os detalhes e restaurar a aparência original, além de uma área que mostra as classes atualmente ativas.",
      "funcionamento": "O programa deverá registrar os cliques com `addEventListener()`, utilizar `classList.toggle()` para alternar classes, `classList.add()` e `classList.remove()` para controlar o destaque e a restauração e `classList.contains()` para verificar o estado dos elementos.",
      "testes": [
        "Para testar, ative o tema escuro, o destaque e a ocultação dos detalhes; confira a lista de classes e depois utilize o botão \"Restaurar\".",
        "HTML sem onclick.",
        "Alternar tema duas vezes.",
        "Adicionar e remover destaque.",
        "Ocultar e mostrar detalhes."
      ],
      "arquivos": [
        "index.html",
        "estilo.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-19` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false
    },
    "contextoDetalhado": [
      "A atividade constrói um laboratório de classes CSS.",
      "Em aplicações reais, estados visuais como destaque, tema e ocultação são controlados por classes reutilizáveis.",
      "O exercício conecta addEventListener(), click, callback aos novos recursos classList, classList.add(), classList.remove(), classList.toggle().",
      "O tutorial separa estrutura, aparência e comportamento para mostrar como cada arquivo contribui para o resultado final.",
      "As gavetas podem ser abertas a qualquer momento para revisar o contexto, consultar exemplos, entender o trecho atual e conferir o glossário."
    ],
    "fluxoAprendizagem": [
      "Estrutura: Estrutura inicial",
      "Estrutura: Apresentação",
      "Estrutura: Métodos de classList",
      "Estrutura: Cartão de perfil",
      "Estrutura: Botões sem onclick",
      "Estrutura: Status e script",
      "Aparência: Página principal",
      "Aparência: Cabeçalho e conceitos"
    ],
    "dicasExtras": [
      "Localize no código onde aparece `classList` e observe o que muda no preview quando esse trecho é executado.",
      "Leia o código em três perguntas: qual dado entra, qual regra é aplicada e qual resultado aparece na página?",
      "Use a gaveta Explicação da etapa antes de escrever o trecho; nela estão as partes, o motivo, o resultado esperado e os alertas.",
      "Depois do primeiro teste correto, altere apenas um valor para descobrir qual parte da lógica controla o comportamento.",
      "Evite este erro frequente: Escrever classlist com L minúsculo",
      "Teste orientado: HTML sem onclick"
    ],
    "perguntasGuia": [
      "Qual problema da atividade é resolvido por `classList`?",
      "Qual é a diferença entre `classList` e `classList.add()` neste exercício?",
      "Que valor é lido antes da regra e que resultado é produzido depois?",
      "Como você explicaria a lógica de um laboratório de classes CSS sem ler o código palavra por palavra?",
      "O que aconteceria se este erro fosse cometido: Escrever classlist com L minúsculo"
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor."
    ],
    "glossarioExtra": [
      {
        "termo": "classList",
        "tipo": "Gerenciador de classes",
        "definicao": "Objeto que permite adicionar, remover, alternar e verificar classes CSS."
      },
      {
        "termo": "add",
        "tipo": "Método de classList",
        "definicao": "Adiciona uma classe sem apagar as outras."
      },
      {
        "termo": "remove",
        "tipo": "Método de classList",
        "definicao": "Remove uma classe específica."
      },
      {
        "termo": "toggle",
        "tipo": "Método de classList",
        "definicao": "Adiciona a classe quando ela não existe e remove quando existe."
      },
      {
        "termo": "contains",
        "tipo": "Método de classList",
        "definicao": "Verifica se uma classe está aplicada ao elemento."
      }
    ],
    "comparacoes": [
      {
        "titulo": "Estilo direto",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Altera uma propriedade por vez dentro do JavaScript."
      },
      {
        "titulo": "Classe CSS",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Ativa ou desativa um conjunto de estilos definido no CSS."
      }
    ],
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 20,
    "studentReferenceStripped": true,
    "titulo": "Exercício 20 — Lista de Tarefas com JavaScript",
    "nomeCurto": "Lista de tarefas",
    "tema": "Array, criação de elementos e estado concluído",
    "objetivo": "Criar uma lista de tarefas dinâmica, marcar itens como concluídos e atualizar indicadores.",
    "retomadas": [
      "array",
      "push()",
      "length",
      "createElement",
      "appendChild",
      "addEventListener",
      "classList",
      "keydown"
    ],
    "novos": [
      "lista de tarefas",
      "querySelectorAll()",
      "estado concluído",
      "tecla Enter",
      "resumo dinâmico"
    ],
    "pasta": "exercicio-20",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
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
          "titulo": "Estrutura da página",
          "linhas": [
            1,
            8
          ],
          "explicacao": "O documento configura idioma, responsividade e o arquivo de estilos.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Estrutura da página”.",
            "A função desta parte é: O documento configura idioma, responsividade e o arquivo de estilos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<!DOCTYPE html>",
              "descricao": "Informa ao navegador que o documento usa o padrão HTML5."
            },
            {
              "nome": "<html>",
              "descricao": "Elemento raiz que envolve todo o documento."
            },
            {
              "nome": "<head>",
              "descricao": "Reúne configurações e referências que não formam o conteúdo principal."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma lista de tarefas com estados ficará disponível na página.",
          "alerta": "Esquecer de adicionar a tarefa ao array com push()."
        },
        {
          "titulo": "Apresentação",
          "linhas": [
            10,
            15
          ],
          "explicacao": "O título e a introdução apresentam a lista de tarefas.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Apresentação”.",
            "A função desta parte é: O título e a introdução apresentam a lista de tarefas.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma lista de tarefas com estados ficará disponível na página.",
          "alerta": "Usar onclick no HTML em vez de addEventListener()."
        },
        {
          "titulo": "Conceitos retomados",
          "linhas": [
            17,
            35
          ],
          "explicacao": "Os cartões relembram array, createElement e classList.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Conceitos retomados”.",
            "A função desta parte é: Os cartões relembram array, createElement e classList.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "classList",
              "descricao": "Controla as classes CSS de um elemento."
            },
            {
              "nome": "createElement()",
              "descricao": "Cria um novo elemento no DOM."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma lista de tarefas com estados ficará disponível na página.",
          "alerta": "Criar o botão, mas não adicioná-lo ao item com appendChild()."
        },
        {
          "titulo": "Entrada da tarefa",
          "linhas": [
            37,
            50
          ],
          "explicacao": "O campo e o botão possuem ids usados pelo JavaScript.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Entrada da tarefa”.",
            "A função desta parte é: O campo e o botão possuem ids usados pelo JavaScript.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma lista de tarefas com estados ficará disponível na página.",
          "alerta": "Alternar a classe no botão em vez de no li."
        },
        {
          "titulo": "Indicadores",
          "linhas": [
            56,
            74
          ],
          "explicacao": "Os cartões mostram total, concluídas e pendentes.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Indicadores”.",
            "A função desta parte é: Os cartões mostram total, concluídas e pendentes.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma lista de tarefas com estados ficará disponível na página.",
          "alerta": "Contar todos os elementos .tarefa em vez de .tarefa.concluida."
        },
        {
          "titulo": "Lista e limpeza",
          "linhas": [
            76,
            83
          ],
          "explicacao": "A lista receberá itens dinâmicos e o botão limpará todos.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Lista e limpeza”.",
            "A função desta parte é: A lista receberá itens dinâmicos e o botão limpará todos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<script>",
              "descricao": "Liga ou contém o código JavaScript executado pela página."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma lista de tarefas com estados ficará disponível na página.",
          "alerta": "Não limpar o array ao usar o botão Limpar todas."
        }
      ],
      "css": [
        {
          "titulo": "Página e container",
          "linhas": [
            1,
            24
          ],
          "explicacao": "O fundo e o cartão principal organizam a interface.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Página e container”.",
            "A função desta parte é: O fundo e o cartão principal organizam a interface.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Esquecer de adicionar a tarefa ao array com push()."
        },
        {
          "titulo": "Cabeçalho",
          "linhas": [
            26,
            49
          ],
          "explicacao": "A etiqueta, o título e a introdução recebem identidade visual.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Cabeçalho”.",
            "A função desta parte é: A etiqueta, o título e a introdução recebem identidade visual.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Usar onclick no HTML em vez de addEventListener()."
        },
        {
          "titulo": "Conceitos",
          "linhas": [
            51,
            82
          ],
          "explicacao": "A grade apresenta três conceitos retomados.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Conceitos”.",
            "A função desta parte é: A grade apresenta três conceitos retomados.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Criar o botão, mas não adicioná-lo ao item com appendChild()."
        },
        {
          "titulo": "Entrada e botões",
          "linhas": [
            84,
            139
          ],
          "explicacao": "Campo e botões são preparados para mouse, teclado e toque.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Entrada e botões”.",
            "A função desta parte é: Campo e botões são preparados para mouse, teclado e toque.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Alternar a classe no botão em vez de no li."
        },
        {
          "titulo": "Resumo",
          "linhas": [
            141,
            176
          ],
          "explicacao": "Os indicadores exibem o andamento da lista.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Resumo”.",
            "A função desta parte é: Os indicadores exibem o andamento da lista.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "display: flex",
              "descricao": "Organiza elementos em um eixo flexível."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Contar todos os elementos .tarefa em vez de .tarefa.concluida."
        },
        {
          "titulo": "Itens e estado concluído",
          "linhas": [
            178,
            245
          ],
          "explicacao": "As classes tarefa e concluida controlam a aparência dos itens.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Itens e estado concluído”.",
            "A função desta parte é: As classes tarefa e concluida controlam a aparência dos itens.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "@media",
              "descricao": "Regra que aplica estilos conforme as características da tela."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Não limpar o array ao usar o botão Limpar todas."
        },
        {
          "titulo": "Responsividade",
          "linhas": [
            245,
            245
          ],
          "explicacao": "No celular, os elementos passam para uma coluna.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Responsividade”.",
            "A função desta parte é: No celular, os elementos passam para uma coluna.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "Responsividade",
              "descricao": "Trecho selecionado pelo tutorial para construir uma parte específica da atividade."
            },
            {
              "nome": "Linhas 245–245",
              "descricao": "Intervalo validado dentro do arquivo CSS."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Esquecer de adicionar a tarefa ao array com push()."
        }
      ],
      "js": [
        {
          "titulo": "Array e elementos",
          "linhas": [
            1,
            7
          ],
          "explicacao": "O array começa vazio e os principais elementos são selecionados.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Array e elementos”.",
            "A função desta parte é: O array começa vazio e os principais elementos são selecionados.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista de tarefas com estados responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer de adicionar a tarefa ao array com push().",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Item fixo no HTML: A tarefa precisa existir antes da página abrir."
        },
        {
          "titulo": "Eventos iniciais",
          "linhas": [
            9,
            17
          ],
          "explicacao": "Clique, tecla Enter e limpeza são registrados com addEventListener.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Eventos iniciais”.",
            "A função desta parte é: Clique, tecla Enter e limpeza são registrados com addEventListener.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "addEventListener()",
              "descricao": "Registra uma função para responder a um evento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista de tarefas com estados responderá aos dados ou ações do usuário.",
          "alerta": "Usar onclick no HTML em vez de addEventListener().",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Validação",
          "linhas": [
            19,
            29
          ],
          "explicacao": "A função impede a inclusão de uma tarefa vazia.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Validação”.",
            "A função desta parte é: A função impede a inclusão de uma tarefa vazia.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista de tarefas com estados responderá aos dados ou ações do usuário.",
          "alerta": "Criar o botão, mas não adicioná-lo ao item com appendChild().",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Item criado no JavaScript: A tarefa é criada quando o usuário cadastra um novo texto."
        },
        {
          "titulo": "Inclusão no array",
          "linhas": [
            31,
            43
          ],
          "explicacao": "push adiciona o texto e a interface é preparada para o novo item.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Inclusão no array”.",
            "A função desta parte é: push adiciona o texto e a interface é preparada para o novo item.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista de tarefas com estados responderá aos dados ou ações do usuário.",
          "alerta": "Alternar a classe no botão em vez de no li.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Criação do item",
          "linhas": [
            46,
            58
          ],
          "explicacao": "li, span e button são criados diretamente pelo JavaScript.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Criação do item”.",
            "A função desta parte é: li, span e button são criados diretamente pelo JavaScript.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "addEventListener()",
              "descricao": "Registra uma função para responder a um evento."
            },
            {
              "nome": "classList",
              "descricao": "Controla as classes CSS de um elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista de tarefas com estados responderá aos dados ou ações do usuário.",
          "alerta": "Contar todos os elementos .tarefa em vez de .tarefa.concluida.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Item criado no JavaScript: A tarefa é criada quando o usuário cadastra um novo texto."
        },
        {
          "titulo": "Conclusão e reabertura",
          "linhas": [
            60,
            73
          ],
          "explicacao": "A classe concluida é alternada e o texto do botão é atualizado.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Conclusão e reabertura”.",
            "A função desta parte é: A classe concluida é alternada e o texto do botão é atualizado.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "else",
              "descricao": "Executa o caminho alternativo quando as condições anteriores são falsas."
            },
            {
              "nome": "classList",
              "descricao": "Controla as classes CSS de um elemento."
            },
            {
              "nome": "appendChild()",
              "descricao": "Insere um elemento como filho de outro."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista de tarefas com estados responderá aos dados ou ações do usuário.",
          "alerta": "Não limpar o array ao usar o botão Limpar todas.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Resumo da lista",
          "linhas": [
            81,
            96
          ],
          "explicacao": "querySelectorAll conta as tarefas concluídas e calcula as pendentes.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Resumo da lista”.",
            "A função desta parte é: querySelectorAll conta as tarefas concluídas e calcula as pendentes.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista de tarefas com estados responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer de adicionar a tarefa ao array com push().",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Item criado no JavaScript: A tarefa é criada quando o usuário cadastra um novo texto."
        },
        {
          "titulo": "Limpeza",
          "linhas": [
            99,
            103
          ],
          "explicacao": "O array, a lista, a mensagem e os indicadores voltam ao estado inicial.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Limpeza”.",
            "A função desta parte é: O array, a lista, a mensagem e os indicadores voltam ao estado inicial.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista de tarefas com estados responderá aos dados ou ações do usuário.",
          "alerta": "Usar onclick no HTML em vez de addEventListener().",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 20 — Lista de Tarefas com JavaScript",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como o JavaScript pode armazenar tarefas em um array, criar elementos dinamicamente e alterar o estado visual de cada item.\n\n**O que será desenvolvido**\n\nNeste exercício, será criada uma Lista de Tarefas com campo de entrada, botão para adicionar, suporte à tecla Enter, indicadores de total, concluídas e pendentes, botão para limpar e itens que podem ser marcados como concluídos ou reabertos.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-20`.\n\nArquivos obrigatórios:\n- `index.html`\n- `estilo.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá validar o campo vazio, adicionar o texto ao array com `push()`, criar os elementos com `createElement()`, registrar eventos com `addEventListener()`, alternar a classe `concluida` com `classList.toggle()` e atualizar o resumo da lista.\n\n**Como testar**\n\n- Para testar, cadastre pelo menos três tarefas, marque algumas como concluídas, reabra uma delas e utilize o botão \"Limpar todas\".\n- Tentar adicionar campo vazio.\n- Adicionar uma tarefa pelo botão.\n- Adicionar outra tarefa com Enter.\n- Marcar uma tarefa como concluída.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-20` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como o JavaScript pode armazenar tarefas em um array, criar elementos dinamicamente e alterar o estado visual de cada item.",
      "desenvolvimento": "Neste exercício, será criada uma Lista de Tarefas com campo de entrada, botão para adicionar, suporte à tecla Enter, indicadores de total, concluídas e pendentes, botão para limpar e itens que podem ser marcados como concluídos ou reabertos.",
      "funcionamento": "O programa deverá validar o campo vazio, adicionar o texto ao array com `push()`, criar os elementos com `createElement()`, registrar eventos com `addEventListener()`, alternar a classe `concluida` com `classList.toggle()` e atualizar o resumo da lista.",
      "testes": [
        "Para testar, cadastre pelo menos três tarefas, marque algumas como concluídas, reabra uma delas e utilize o botão \"Limpar todas\".",
        "Tentar adicionar campo vazio.",
        "Adicionar uma tarefa pelo botão.",
        "Adicionar outra tarefa com Enter.",
        "Marcar uma tarefa como concluída."
      ],
      "arquivos": [
        "index.html",
        "estilo.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-20` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false
    },
    "contextoDetalhado": [
      "A atividade constrói uma lista de tarefas com estados.",
      "Em aplicações reais, aplicações criam elementos dinamicamente e atualizam indicadores conforme o usuário interage.",
      "O exercício conecta array, push(), length aos novos recursos lista de tarefas, querySelectorAll(), estado concluído, tecla Enter.",
      "O tutorial separa estrutura, aparência e comportamento para mostrar como cada arquivo contribui para o resultado final.",
      "As gavetas podem ser abertas a qualquer momento para revisar o contexto, consultar exemplos, entender o trecho atual e conferir o glossário."
    ],
    "fluxoAprendizagem": [
      "Estrutura: Estrutura da página",
      "Estrutura: Apresentação",
      "Estrutura: Conceitos retomados",
      "Estrutura: Entrada da tarefa",
      "Estrutura: Indicadores",
      "Estrutura: Lista e limpeza",
      "Aparência: Página e container",
      "Aparência: Cabeçalho"
    ],
    "dicasExtras": [
      "Localize no código onde aparece `lista de tarefas` e observe o que muda no preview quando esse trecho é executado.",
      "Leia o código em três perguntas: qual dado entra, qual regra é aplicada e qual resultado aparece na página?",
      "Use a gaveta Explicação da etapa antes de escrever o trecho; nela estão as partes, o motivo, o resultado esperado e os alertas.",
      "Depois do primeiro teste correto, altere apenas um valor para descobrir qual parte da lógica controla o comportamento.",
      "Evite este erro frequente: Esquecer de adicionar a tarefa ao array com push().",
      "Teste orientado: Tentar adicionar campo vazio"
    ],
    "perguntasGuia": [
      "Qual problema da atividade é resolvido por `lista de tarefas`?",
      "Qual é a diferença entre `lista de tarefas` e `querySelectorAll()` neste exercício?",
      "Que valor é lido antes da regra e que resultado é produzido depois?",
      "Como você explicaria a lógica de uma lista de tarefas com estados sem ler o código palavra por palavra?",
      "O que aconteceria se este erro fosse cometido: Esquecer de adicionar a tarefa ao array com push()."
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor."
    ],
    "glossarioExtra": [
      {
        "termo": "createElement",
        "tipo": "Criação no DOM",
        "definicao": "Cria um novo elemento HTML em memória."
      },
      {
        "termo": "appendChild",
        "tipo": "Inserção no DOM",
        "definicao": "Adiciona um elemento como filho de outro elemento."
      },
      {
        "termo": "querySelectorAll",
        "tipo": "Consulta do DOM",
        "definicao": "Seleciona todos os elementos que correspondem a um seletor CSS."
      },
      {
        "termo": "estado",
        "tipo": "Dados atuais",
        "definicao": "Conjunto de valores que representa a situação atual da aplicação."
      }
    ],
    "comparacoes": [
      {
        "titulo": "Item fixo no HTML",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "A tarefa precisa existir antes da página abrir."
      },
      {
        "titulo": "Item criado no JavaScript",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "A tarefa é criada quando o usuário cadastra um novo texto."
      }
    ],
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 21,
    "studentReferenceStripped": true,
    "titulo": "Exercício 21 — Lista de Tarefas com Edição e Remoção",
    "nomeCurto": "Lista de tarefas com edição e remoção",
    "tema": "Índices, atualização e splice",
    "objetivo": "Editar e remover tarefas de um array usando índices, prompt, confirm e splice.",
    "retomadas": [
      "array",
      "push()",
      "forEach()",
      "índice",
      "createElement",
      "appendChild",
      "addEventListener",
      "length"
    ],
    "novos": [
      "atualização por índice",
      "splice()",
      "prompt()",
      "confirm()",
      "renderização completa da lista"
    ],
    "pasta": "exercicio-21",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
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
          "titulo": "Estrutura inicial",
          "linhas": [
            1,
            8
          ],
          "explicacao": "O documento configura idioma, responsividade e o arquivo de estilos.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Estrutura inicial”.",
            "A função desta parte é: O documento configura idioma, responsividade e o arquivo de estilos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<!DOCTYPE html>",
              "descricao": "Informa ao navegador que o documento usa o padrão HTML5."
            },
            {
              "nome": "<html>",
              "descricao": "Elemento raiz que envolve todo o documento."
            },
            {
              "nome": "<head>",
              "descricao": "Reúne configurações e referências que não formam o conteúdo principal."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um gerenciador de tarefas editáveis ficará disponível na página.",
          "alerta": "Usar splice sem informar a quantidade de itens."
        },
        {
          "titulo": "Apresentação",
          "linhas": [
            10,
            15
          ],
          "explicacao": "A introdução mostra que as tarefas poderão ser alteradas e removidas.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Apresentação”.",
            "A função desta parte é: A introdução mostra que as tarefas poderão ser alteradas e removidas.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um gerenciador de tarefas editáveis ficará disponível na página.",
          "alerta": "Editar o texto visual sem atualizar o array."
        },
        {
          "titulo": "Conceitos novos",
          "linhas": [
            17,
            35
          ],
          "explicacao": "Os cartões apresentam índice, atualização e splice.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Conceitos novos”.",
            "A função desta parte é: Os cartões apresentam índice, atualização e splice.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um gerenciador de tarefas editáveis ficará disponível na página.",
          "alerta": "Confundir o índice mostrado ao usuário com o índice real do array."
        },
        {
          "titulo": "Entrada da tarefa",
          "linhas": [
            37,
            50
          ],
          "explicacao": "O campo e o botão permitem cadastrar novos itens.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Entrada da tarefa”.",
            "A função desta parte é: O campo e o botão permitem cadastrar novos itens.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um gerenciador de tarefas editáveis ficará disponível na página.",
          "alerta": "Chamar editarTarefa sem enviar o índice."
        },
        {
          "titulo": "Resumo",
          "linhas": [
            56,
            68
          ],
          "explicacao": "Os indicadores mostram a quantidade e a última ação executada.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Resumo”.",
            "A função desta parte é: Os indicadores mostram a quantidade e a última ação executada.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um gerenciador de tarefas editáveis ficará disponível na página.",
          "alerta": "Não renderizar a lista depois de uma alteração."
        },
        {
          "titulo": "Lista dinâmica",
          "linhas": [
            70,
            78
          ],
          "explicacao": "A lista será preenchida com botões de edição e remoção.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Lista dinâmica”.",
            "A função desta parte é: A lista será preenchida com botões de edição e remoção.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<script>",
              "descricao": "Liga ou contém o código JavaScript executado pela página."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um gerenciador de tarefas editáveis ficará disponível na página.",
          "alerta": "Não tratar o valor null retornado por prompt."
        }
      ],
      "css": [
        {
          "titulo": "Página e container",
          "linhas": [
            1,
            24
          ],
          "explicacao": "A interface recebe fundo e cartão principal responsivo.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Página e container”.",
            "A função desta parte é: A interface recebe fundo e cartão principal responsivo.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Usar splice sem informar a quantidade de itens."
        },
        {
          "titulo": "Cabeçalho",
          "linhas": [
            26,
            49
          ],
          "explicacao": "A etiqueta e o título criam a identidade visual.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Cabeçalho”.",
            "A função desta parte é: A etiqueta e o título criam a identidade visual.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Editar o texto visual sem atualizar o array."
        },
        {
          "titulo": "Cartões de conceitos",
          "linhas": [
            51,
            82
          ],
          "explicacao": "A grade apresenta os três conceitos centrais.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Cartões de conceitos”.",
            "A função desta parte é: A grade apresenta os três conceitos centrais.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Confundir o índice mostrado ao usuário com o índice real do array."
        },
        {
          "titulo": "Entrada e botões",
          "linhas": [
            84,
            139
          ],
          "explicacao": "O campo e os botões são preparados para diferentes dispositivos.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Entrada e botões”.",
            "A função desta parte é: O campo e os botões são preparados para diferentes dispositivos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Chamar editarTarefa sem enviar o índice."
        },
        {
          "titulo": "Resumo e lista",
          "linhas": [
            141,
            220
          ],
          "explicacao": "Os indicadores e os itens recebem organização visual.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Resumo e lista”.",
            "A função desta parte é: Os indicadores e os itens recebem organização visual.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "@media",
              "descricao": "Regra que aplica estilos conforme as características da tela."
            },
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "display: flex",
              "descricao": "Organiza elementos em um eixo flexível."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Não renderizar a lista depois de uma alteração."
        },
        {
          "titulo": "Ações de editar e remover",
          "linhas": [
            222,
            248
          ],
          "explicacao": "Cada ação recebe cor própria para facilitar a identificação.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Ações de editar e remover”.",
            "A função desta parte é: Cada ação recebe cor própria para facilitar a identificação.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Não tratar o valor null retornado por prompt."
        },
        {
          "titulo": "Responsividade",
          "linhas": [
            248,
            248
          ],
          "explicacao": "No celular, entrada, itens e ações passam para uma coluna.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Responsividade”.",
            "A função desta parte é: No celular, entrada, itens e ações passam para uma coluna.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "Responsividade",
              "descricao": "Trecho selecionado pelo tutorial para construir uma parte específica da atividade."
            },
            {
              "nome": "Linhas 248–248",
              "descricao": "Intervalo validado dentro do arquivo CSS."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Usar splice sem informar a quantidade de itens."
        }
      ],
      "js": [
        {
          "titulo": "Array e elementos",
          "linhas": [
            1,
            7
          ],
          "explicacao": "O array começa vazio e os principais elementos são selecionados.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Array e elementos”.",
            "A função desta parte é: O array começa vazio e os principais elementos são selecionados.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um gerenciador de tarefas editáveis responderá aos dados ou ações do usuário.",
          "alerta": "Usar splice sem informar a quantidade de itens.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Atualização: Substitui o valor que permanece na mesma posição."
        },
        {
          "titulo": "Registro dos eventos",
          "linhas": [
            9,
            17
          ],
          "explicacao": "Clique, Enter e limpeza usam addEventListener.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Registro dos eventos”.",
            "A função desta parte é: Clique, Enter e limpeza usam addEventListener.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "addEventListener()",
              "descricao": "Registra uma função para responder a um evento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um gerenciador de tarefas editáveis responderá aos dados ou ações do usuário.",
          "alerta": "Editar o texto visual sem atualizar o array.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Inclusão",
          "linhas": [
            19,
            38
          ],
          "explicacao": "A função valida, adiciona com push e atualiza a interface.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Inclusão”.",
            "A função desta parte é: A função valida, adiciona com push e atualiza a interface.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um gerenciador de tarefas editáveis responderá aos dados ou ações do usuário.",
          "alerta": "Confundir o índice mostrado ao usuário com o índice real do array.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Remoção: Retira um item e reorganiza as posições seguintes."
        },
        {
          "titulo": "Renderização",
          "linhas": [
            40,
            84
          ],
          "explicacao": "A lista é reconstruída com forEach e botões para cada índice.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Renderização”.",
            "A função desta parte é: A lista é reconstruída com forEach e botões para cada índice.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um gerenciador de tarefas editáveis responderá aos dados ou ações do usuário.",
          "alerta": "Chamar editarTarefa sem enviar o índice.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Edição",
          "linhas": [
            87,
            117
          ],
          "explicacao": "prompt recebe o novo texto e o array é atualizado pelo índice.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Edição”.",
            "A função desta parte é: prompt recebe o novo texto e o array é atualizado pelo índice.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            },
            {
              "nome": "confirm()",
              "descricao": "Solicita uma confirmação booleana."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um gerenciador de tarefas editáveis responderá aos dados ou ações do usuário.",
          "alerta": "Não renderizar a lista depois de uma alteração.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Remoção: Retira um item e reorganiza as posições seguintes."
        },
        {
          "titulo": "Remoção",
          "linhas": [
            120,
            139
          ],
          "explicacao": "confirm solicita autorização e splice remove um item.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Remoção”.",
            "A função desta parte é: confirm solicita autorização e splice remove um item.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            },
            {
              "nome": "splice()",
              "descricao": "Remove ou altera itens de um array a partir de um índice."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um gerenciador de tarefas editáveis responderá aos dados ou ações do usuário.",
          "alerta": "Não tratar o valor null retornado por prompt.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Resumo e mensagem",
          "linhas": [
            142,
            154
          ],
          "explicacao": "Funções auxiliares evitam repetição e atualizam a interface.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Resumo e mensagem”.",
            "A função desta parte é: Funções auxiliares evitam repetição e atualizam a interface.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            },
            {
              "nome": "confirm()",
              "descricao": "Solicita uma confirmação booleana."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um gerenciador de tarefas editáveis responderá aos dados ou ações do usuário.",
          "alerta": "Usar splice sem informar a quantidade de itens.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Remoção: Retira um item e reorganiza as posições seguintes."
        },
        {
          "titulo": "Limpeza completa",
          "linhas": [
            157,
            166
          ],
          "explicacao": "A função valida, confirma e esvazia todo o array.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Limpeza completa”.",
            "A função desta parte é: A função valida, confirma e esvazia todo o array.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um gerenciador de tarefas editáveis responderá aos dados ou ações do usuário.",
          "alerta": "Editar o texto visual sem atualizar o array.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 21 — Lista de Tarefas com Edição e Remoção",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como o JavaScript pode localizar, editar e remover itens armazenados em um array.\n\n**O que será desenvolvido**\n\nNeste exercício, será criado um Gerenciador de Tarefas com inclusão pelo botão ou pela tecla Enter, indicadores de total e última ação, botões para editar e remover cada item e uma opção para limpar toda a lista.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-21`.\n\nArquivos obrigatórios:\n- `index.html`\n- `estilo.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá utilizar o índice de cada tarefa, atualizar uma posição do array, remover itens com `splice()`, solicitar um novo texto com `prompt()`, pedir confirmação com `confirm()` e renderizar novamente a lista depois de cada alteração.\n\n**Como testar**\n\n- Para testar, cadastre pelo menos três tarefas, edite uma delas, cancele uma edição, remova outra, cancele uma remoção e utilize o botão \"Limpar todas\".\n- Tentar adicionar uma tarefa vazia.\n- Adicionar três tarefas.\n- Editar a segunda tarefa.\n- Cancelar uma edição.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-21` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como o JavaScript pode localizar, editar e remover itens armazenados em um array.",
      "desenvolvimento": "Neste exercício, será criado um Gerenciador de Tarefas com inclusão pelo botão ou pela tecla Enter, indicadores de total e última ação, botões para editar e remover cada item e uma opção para limpar toda a lista.",
      "funcionamento": "O programa deverá utilizar o índice de cada tarefa, atualizar uma posição do array, remover itens com `splice()`, solicitar um novo texto com `prompt()`, pedir confirmação com `confirm()` e renderizar novamente a lista depois de cada alteração.",
      "testes": [
        "Para testar, cadastre pelo menos três tarefas, edite uma delas, cancele uma edição, remova outra, cancele uma remoção e utilize o botão \"Limpar todas\".",
        "Tentar adicionar uma tarefa vazia.",
        "Adicionar três tarefas.",
        "Editar a segunda tarefa.",
        "Cancelar uma edição."
      ],
      "arquivos": [
        "index.html",
        "estilo.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-21` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false
    },
    "contextoDetalhado": [
      "A atividade constrói um gerenciador de tarefas editáveis.",
      "Em aplicações reais, sistemas localizam registros pelo índice, atualizam valores e removem itens.",
      "O exercício conecta array, push(), forEach() aos novos recursos atualização por índice, splice(), prompt(), confirm().",
      "O tutorial separa estrutura, aparência e comportamento para mostrar como cada arquivo contribui para o resultado final.",
      "As gavetas podem ser abertas a qualquer momento para revisar o contexto, consultar exemplos, entender o trecho atual e conferir o glossário."
    ],
    "fluxoAprendizagem": [
      "Estrutura: Estrutura inicial",
      "Estrutura: Apresentação",
      "Estrutura: Conceitos novos",
      "Estrutura: Entrada da tarefa",
      "Estrutura: Resumo",
      "Estrutura: Lista dinâmica",
      "Aparência: Página e container",
      "Aparência: Cabeçalho"
    ],
    "dicasExtras": [
      "Localize no código onde aparece `atualização por índice` e observe o que muda no preview quando esse trecho é executado.",
      "Leia o código em três perguntas: qual dado entra, qual regra é aplicada e qual resultado aparece na página?",
      "Use a gaveta Explicação da etapa antes de escrever o trecho; nela estão as partes, o motivo, o resultado esperado e os alertas.",
      "Depois do primeiro teste correto, altere apenas um valor para descobrir qual parte da lógica controla o comportamento.",
      "Evite este erro frequente: Usar splice sem informar a quantidade de itens.",
      "Teste orientado: Tentar adicionar uma tarefa vazia"
    ],
    "perguntasGuia": [
      "Qual problema da atividade é resolvido por `atualização por índice`?",
      "Qual é a diferença entre `atualização por índice` e `splice()` neste exercício?",
      "Que valor é lido antes da regra e que resultado é produzido depois?",
      "Como você explicaria a lógica de um gerenciador de tarefas editáveis sem ler o código palavra por palavra?",
      "O que aconteceria se este erro fosse cometido: Usar splice sem informar a quantidade de itens."
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor."
    ],
    "glossarioExtra": [
      {
        "termo": "splice",
        "tipo": "Método de array",
        "definicao": "Remove, substitui ou insere itens a partir de um índice."
      },
      {
        "termo": "prompt",
        "tipo": "Caixa de entrada",
        "definicao": "Abre uma caixa simples para solicitar texto ao usuário."
      },
      {
        "termo": "confirm",
        "tipo": "Caixa de confirmação",
        "definicao": "Abre uma pergunta que retorna true para confirmar e false para cancelar."
      },
      {
        "termo": "renderização",
        "tipo": "Atualização visual",
        "definicao": "Processo de reconstruir a interface a partir dos dados atuais."
      }
    ],
    "comparacoes": [
      {
        "titulo": "Atualização",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Substitui o valor que permanece na mesma posição."
      },
      {
        "titulo": "Remoção",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Retira um item e reorganiza as posições seguintes."
      }
    ],
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 22,
    "studentReferenceStripped": true,
    "titulo": "Exercício 22 — Cadastro Simples com Objeto em JavaScript",
    "nomeCurto": "Cadastro simples com objeto",
    "tema": "Objetos, propriedades e notação de ponto",
    "objetivo": "Agrupar dados relacionados em um objeto e acessar suas propriedades pela notação de ponto.",
    "retomadas": [
      "const",
      "Number()",
      "if",
      "return",
      "inputs",
      "select",
      "checkbox",
      "addEventListener",
      "innerText"
    ],
    "novos": [
      "objeto literal",
      "propriedade",
      "valor",
      "notação de ponto",
      "booleano em objeto"
    ],
    "pasta": "exercicio-22",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
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
          "titulo": "Estrutura inicial",
          "linhas": [
            1,
            8
          ],
          "explicacao": "O documento configura idioma, responsividade e o arquivo de estilos.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Estrutura inicial”.",
            "A função desta parte é: O documento configura idioma, responsividade e o arquivo de estilos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<!DOCTYPE html>",
              "descricao": "Informa ao navegador que o documento usa o padrão HTML5."
            },
            {
              "nome": "<html>",
              "descricao": "Elemento raiz que envolve todo o documento."
            },
            {
              "nome": "<head>",
              "descricao": "Reúne configurações e referências que não formam o conteúdo principal."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um cadastro representado por um objeto ficará disponível na página.",
          "alerta": "Usar colchetes ou parênteses incorretamente ao criar o objeto."
        },
        {
          "titulo": "Apresentação",
          "linhas": [
            10,
            15
          ],
          "explicacao": "O título apresenta o cadastro que será armazenado em um objeto.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Apresentação”.",
            "A função desta parte é: O título apresenta o cadastro que será armazenado em um objeto.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um cadastro representado por um objeto ficará disponível na página.",
          "alerta": "Separar propriedades com ponto e vírgula em vez de vírgula."
        },
        {
          "titulo": "Conceitos do objeto",
          "linhas": [
            17,
            35
          ],
          "explicacao": "Os cartões explicam objeto, propriedade e notação de ponto.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Conceitos do objeto”.",
            "A função desta parte é: Os cartões explicam objeto, propriedade e notação de ponto.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um cadastro representado por um objeto ficará disponível na página.",
          "alerta": "Escrever participante = nomeDigitado e substituir o objeto."
        },
        {
          "titulo": "Campos do cadastro",
          "linhas": [
            37,
            69
          ],
          "explicacao": "Nome, idade, curso e situação ativa fornecem valores de tipos diferentes.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Campos do cadastro”.",
            "A função desta parte é: Nome, idade, curso e situação ativa fornecem valores de tipos diferentes.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<input>",
              "descricao": "Campo de entrada usado para capturar um valor do usuário."
            },
            {
              "nome": "<select>",
              "descricao": "Campo que permite escolher uma opção predefinida."
            },
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um cadastro representado por um objeto ficará disponível na página.",
          "alerta": "Confundir propriedade com variável independente."
        },
        {
          "titulo": "Ações e mensagem",
          "linhas": [
            71,
            84
          ],
          "explicacao": "Os botões e a área de mensagem controlam o fluxo da atividade.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Ações e mensagem”.",
            "A função desta parte é: Os botões e a área de mensagem controlam o fluxo da atividade.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um cadastro representado por um objeto ficará disponível na página.",
          "alerta": "Ler checked como texto em vez de booleano."
        },
        {
          "titulo": "Cartão e propriedades",
          "linhas": [
            86,
            115
          ],
          "explicacao": "A interface apresenta o participante e cada propriedade do objeto.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Cartão e propriedades”.",
            "A função desta parte é: A interface apresenta o participante e cada propriedade do objeto.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<script>",
              "descricao": "Liga ou contém o código JavaScript executado pela página."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um cadastro representado por um objeto ficará disponível na página.",
          "alerta": "Esquecer de acessar a propriedade com participante.nome."
        }
      ],
      "css": [
        {
          "titulo": "Página e container",
          "linhas": [
            1,
            24
          ],
          "explicacao": "A página recebe fundo e cartão principal responsivo.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Página e container”.",
            "A função desta parte é: A página recebe fundo e cartão principal responsivo.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Usar colchetes ou parênteses incorretamente ao criar o objeto."
        },
        {
          "titulo": "Cabeçalho",
          "linhas": [
            26,
            49
          ],
          "explicacao": "A etiqueta e o título organizam a apresentação.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Cabeçalho”.",
            "A função desta parte é: A etiqueta e o título organizam a apresentação.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Separar propriedades com ponto e vírgula em vez de vírgula."
        },
        {
          "titulo": "Cartões conceituais",
          "linhas": [
            51,
            82
          ],
          "explicacao": "A grade apresenta os conceitos centrais.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Cartões conceituais”.",
            "A função desta parte é: A grade apresenta os conceitos centrais.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Escrever participante = nomeDigitado e substituir o objeto."
        },
        {
          "titulo": "Formulário",
          "linhas": [
            84,
            170
          ],
          "explicacao": "Os campos, checkbox e botões recebem estilos de interação.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Formulário”.",
            "A função desta parte é: Os campos, checkbox e botões recebem estilos de interação.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "display: flex",
              "descricao": "Organiza elementos em um eixo flexível."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Confundir propriedade com variável independente."
        },
        {
          "titulo": "Cartão do participante",
          "linhas": [
            172,
            230
          ],
          "explicacao": "A área visual apresenta avatar, nome e curso.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Cartão do participante”.",
            "A função desta parte é: A área visual apresenta avatar, nome e curso.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "@media",
              "descricao": "Regra que aplica estilos conforme as características da tela."
            },
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Ler checked como texto em vez de booleano."
        },
        {
          "titulo": "Propriedades e responsividade",
          "linhas": [
            232,
            241
          ],
          "explicacao": "Os valores do objeto são organizados e adaptados ao celular.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Propriedades e responsividade”.",
            "A função desta parte é: Os valores do objeto são organizados e adaptados ao celular.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Esquecer de acessar a propriedade com participante.nome."
        }
      ],
      "js": [
        {
          "titulo": "Objeto participante",
          "linhas": [
            1,
            6
          ],
          "explicacao": "O objeto literal reúne quatro propriedades com tipos diferentes.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Objeto participante”.",
            "A função desta parte é: O objeto literal reúne quatro propriedades com tipos diferentes.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um cadastro representado por um objeto responderá aos dados ou ações do usuário.",
          "alerta": "Usar colchetes ou parênteses incorretamente ao criar o objeto.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Variáveis independentes: Os dados existem, mas não estão formalmente agrupados."
        },
        {
          "titulo": "Seleção e eventos",
          "linhas": [
            8,
            20
          ],
          "explicacao": "Os campos e botões são selecionados e recebem callbacks.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Seleção e eventos”.",
            "A função desta parte é: Os campos e botões são selecionados e recebem callbacks.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "addEventListener()",
              "descricao": "Registra uma função para responder a um evento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um cadastro representado por um objeto responderá aos dados ou ações do usuário.",
          "alerta": "Separar propriedades com ponto e vírgula em vez de vírgula.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Leitura dos campos",
          "linhas": [
            22,
            26
          ],
          "explicacao": "A função captura e converte os dados digitados.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Leitura dos campos”.",
            "A função desta parte é: A função captura e converte os dados digitados.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            },
            {
              "nome": "Number()",
              "descricao": "Converte um valor para número."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um cadastro representado por um objeto responderá aos dados ou ações do usuário.",
          "alerta": "Escrever participante = nomeDigitado e substituir o objeto.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Objeto: As propriedades mostram que os dados pertencem à mesma entidade."
        },
        {
          "titulo": "Validações",
          "linhas": [
            28,
            53
          ],
          "explicacao": "Nome, idade e curso são verificados antes do cadastro.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Validações”.",
            "A função desta parte é: Nome, idade e curso são verificados antes do cadastro.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um cadastro representado por um objeto responderá aos dados ou ações do usuário.",
          "alerta": "Confundir propriedade com variável independente.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Atualização das propriedades",
          "linhas": [
            55,
            64
          ],
          "explicacao": "A notação de ponto altera cada propriedade do objeto.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Atualização das propriedades”.",
            "A função desta parte é: A notação de ponto altera cada propriedade do objeto.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": ".checked",
              "descricao": "Informa se um checkbox está marcado."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um cadastro representado por um objeto responderá aos dados ou ações do usuário.",
          "alerta": "Ler checked como texto em vez de booleano.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Objeto: As propriedades mostram que os dados pertencem à mesma entidade."
        },
        {
          "titulo": "Leitura das propriedades",
          "linhas": [
            71,
            94
          ],
          "explicacao": "Os valores do objeto são usados para atualizar a página.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Leitura das propriedades”.",
            "A função desta parte é: Os valores do objeto são usados para atualizar a página.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um cadastro representado por um objeto responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer de acessar a propriedade com participante.nome.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Função de mensagem",
          "linhas": [
            97,
            100
          ],
          "explicacao": "Uma função auxiliar atualiza o texto e a cor.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Função de mensagem”.",
            "A função desta parte é: Uma função auxiliar atualiza o texto e a cor.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um cadastro representado por um objeto responderá aos dados ou ações do usuário.",
          "alerta": "Usar colchetes ou parênteses incorretamente ao criar o objeto.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Objeto: As propriedades mostram que os dados pertencem à mesma entidade."
        },
        {
          "titulo": "Reinício",
          "linhas": [
            103,
            120
          ],
          "explicacao": "Objeto, formulário e interface retornam aos valores iniciais.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Reinício”.",
            "A função desta parte é: Objeto, formulário e interface retornam aos valores iniciais.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um cadastro representado por um objeto responderá aos dados ou ações do usuário.",
          "alerta": "Separar propriedades com ponto e vírgula em vez de vírgula.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 22 — Cadastro Simples com Objeto em JavaScript",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como o JavaScript pode reunir informações relacionadas dentro de um único objeto.\n\n**O que será desenvolvido**\n\nNeste exercício, será criado um Cadastro de Participante com campos para nome, idade, curso e situação ativa, além de um cartão que apresenta os valores armazenados nas propriedades do objeto.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-22`.\n\nArquivos obrigatórios:\n- `index.html`\n- `estilo.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá criar o objeto `participante`, validar os campos, atualizar as propriedades com a notação de ponto, acessar os valores para preencher a interface e reiniciar o objeto e o formulário quando solicitado.\n\n**Como testar**\n\n- Para testar, cadastre um participante ativo, confira as quatro propriedades exibidas, faça outro cadastro com valores diferentes e utilize o botão \"Reiniciar\".\n- Tentar cadastrar sem nome.\n- Tentar cadastrar com idade zero.\n- Tentar cadastrar com idade maior que 120.\n- Tentar cadastrar sem curso.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-22` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como o JavaScript pode reunir informações relacionadas dentro de um único objeto.",
      "desenvolvimento": "Neste exercício, será criado um Cadastro de Participante com campos para nome, idade, curso e situação ativa, além de um cartão que apresenta os valores armazenados nas propriedades do objeto.",
      "funcionamento": "O programa deverá criar o objeto `participante`, validar os campos, atualizar as propriedades com a notação de ponto, acessar os valores para preencher a interface e reiniciar o objeto e o formulário quando solicitado.",
      "testes": [
        "Para testar, cadastre um participante ativo, confira as quatro propriedades exibidas, faça outro cadastro com valores diferentes e utilize o botão \"Reiniciar\".",
        "Tentar cadastrar sem nome.",
        "Tentar cadastrar com idade zero.",
        "Tentar cadastrar com idade maior que 120.",
        "Tentar cadastrar sem curso."
      ],
      "arquivos": [
        "index.html",
        "estilo.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-22` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false
    },
    "contextoDetalhado": [
      "A atividade constrói um cadastro representado por um objeto.",
      "Em aplicações reais, dados relacionados de uma mesma entidade ficam reunidos por propriedades.",
      "O exercício conecta const, Number(), if aos novos recursos objeto literal, propriedade, valor, notação de ponto.",
      "O tutorial separa estrutura, aparência e comportamento para mostrar como cada arquivo contribui para o resultado final.",
      "As gavetas podem ser abertas a qualquer momento para revisar o contexto, consultar exemplos, entender o trecho atual e conferir o glossário."
    ],
    "fluxoAprendizagem": [
      "Estrutura: Estrutura inicial",
      "Estrutura: Apresentação",
      "Estrutura: Conceitos do objeto",
      "Estrutura: Campos do cadastro",
      "Estrutura: Ações e mensagem",
      "Estrutura: Cartão e propriedades",
      "Aparência: Página e container",
      "Aparência: Cabeçalho"
    ],
    "dicasExtras": [
      "Localize no código onde aparece `objeto literal` e observe o que muda no preview quando esse trecho é executado.",
      "Leia o código em três perguntas: qual dado entra, qual regra é aplicada e qual resultado aparece na página?",
      "Use a gaveta Explicação da etapa antes de escrever o trecho; nela estão as partes, o motivo, o resultado esperado e os alertas.",
      "Depois do primeiro teste correto, altere apenas um valor para descobrir qual parte da lógica controla o comportamento.",
      "Evite este erro frequente: Usar colchetes ou parênteses incorretamente ao criar o objeto.",
      "Teste orientado: Tentar cadastrar sem nome"
    ],
    "perguntasGuia": [
      "Qual problema da atividade é resolvido por `objeto literal`?",
      "Qual é a diferença entre `objeto literal` e `propriedade` neste exercício?",
      "Que valor é lido antes da regra e que resultado é produzido depois?",
      "Como você explicaria a lógica de um cadastro representado por um objeto sem ler o código palavra por palavra?",
      "O que aconteceria se este erro fosse cometido: Usar colchetes ou parênteses incorretamente ao criar o objeto."
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Cenário de teste: Tentar cadastrar sem nome",
      "Cenário de teste: Tentar cadastrar com idade zero"
    ],
    "glossarioExtra": [
      {
        "termo": "objeto literal",
        "tipo": "Estrutura de dados",
        "definicao": "Objeto criado diretamente com chaves e pares propriedade-valor."
      },
      {
        "termo": "propriedade",
        "tipo": "Campo do objeto",
        "definicao": "Nome que identifica uma informação dentro de um objeto."
      },
      {
        "termo": "valor",
        "tipo": "Dado armazenado",
        "definicao": "Conteúdo associado a uma variável, propriedade ou posição."
      },
      {
        "termo": "notação de ponto",
        "tipo": "Acesso a objeto",
        "definicao": "Sintaxe objeto.propriedade usada para ler ou alterar uma propriedade."
      }
    ],
    "comparacoes": [
      {
        "titulo": "Variáveis independentes",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Os dados existem, mas não estão formalmente agrupados."
      },
      {
        "titulo": "Objeto",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "As propriedades mostram que os dados pertencem à mesma entidade."
      }
    ],
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 23,
    "studentReferenceStripped": true,
    "titulo": "Exercício 23 — Cadastro de Alunos com Array de Objetos",
    "nomeCurto": "Cadastro de alunos com array de objetos",
    "tema": "Array de objetos, propriedades e forEach",
    "objetivo": "Criar vários objetos, armazená-los em um array e apresentar os registros dinamicamente.",
    "retomadas": [
      "array",
      "objeto literal",
      "propriedades",
      "push()",
      "forEach()",
      "createElement",
      "splice()",
      "notação de ponto"
    ],
    "novos": [
      "array de objetos",
      "objeto criado por cadastro",
      "acesso a objetos durante o forEach",
      "resumo por propriedades"
    ],
    "pasta": "exercicio-23",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
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
          "titulo": "Estrutura inicial",
          "linhas": [
            1,
            8
          ],
          "explicacao": "O documento configura idioma, responsividade e o arquivo de estilos.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Estrutura inicial”.",
            "A função desta parte é: O documento configura idioma, responsividade e o arquivo de estilos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<!DOCTYPE html>",
              "descricao": "Informa ao navegador que o documento usa o padrão HTML5."
            },
            {
              "nome": "<html>",
              "descricao": "Elemento raiz que envolve todo o documento."
            },
            {
              "nome": "<head>",
              "descricao": "Reúne configurações e referências que não formam o conteúdo principal."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um cadastro de alunos com vários objetos ficará disponível na página.",
          "alerta": "Adicionar somente o nome ao array em vez do objeto completo."
        },
        {
          "titulo": "Apresentação",
          "linhas": [
            10,
            15
          ],
          "explicacao": "O título apresenta o cadastro com vários objetos.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Apresentação”.",
            "A função desta parte é: O título apresenta o cadastro com vários objetos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um cadastro de alunos com vários objetos ficará disponível na página.",
          "alerta": "Criar o objeto fora da função e reutilizar o mesmo registro."
        },
        {
          "titulo": "Conceitos principais",
          "linhas": [
            17,
            35
          ],
          "explicacao": "Os cartões explicam array, objeto e forEach.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Conceitos principais”.",
            "A função desta parte é: Os cartões explicam array, objeto e forEach.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um cadastro de alunos com vários objetos ficará disponível na página.",
          "alerta": "Acessar aluno[0] em vez de aluno.nome."
        },
        {
          "titulo": "Campos do aluno",
          "linhas": [
            37,
            69
          ],
          "explicacao": "Nome, turma e média fornecem os valores do novo objeto.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Campos do aluno”.",
            "A função desta parte é: Nome, turma e média fornecem os valores do novo objeto.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<input>",
              "descricao": "Campo de entrada usado para capturar um valor do usuário."
            },
            {
              "nome": "<select>",
              "descricao": "Campo que permite escolher uma opção predefinida."
            },
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um cadastro de alunos com vários objetos ficará disponível na página.",
          "alerta": "Confundir o objeto aluno com o array alunos."
        },
        {
          "titulo": "Mensagem e resumo",
          "linhas": [
            71,
            93
          ],
          "explicacao": "A interface apresenta mensagens e indicadores da turma.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Mensagem e resumo”.",
            "A função desta parte é: A interface apresenta mensagens e indicadores da turma.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um cadastro de alunos com vários objetos ficará disponível na página.",
          "alerta": "Calcular a situação depois de criar o objeto sem atualizar a propriedade."
        },
        {
          "titulo": "Lista dinâmica",
          "linhas": [
            95,
            101
          ],
          "explicacao": "Os cartões dos alunos serão inseridos pelo JavaScript.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Lista dinâmica”.",
            "A função desta parte é: Os cartões dos alunos serão inseridos pelo JavaScript.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<script>",
              "descricao": "Liga ou contém o código JavaScript executado pela página."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para um cadastro de alunos com vários objetos ficará disponível na página.",
          "alerta": "Esquecer de renderizar novamente depois de remover um objeto."
        }
      ],
      "css": [
        {
          "titulo": "Página e container",
          "linhas": [
            1,
            24
          ],
          "explicacao": "A página recebe fundo e um container responsivo.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Página e container”.",
            "A função desta parte é: A página recebe fundo e um container responsivo.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Adicionar somente o nome ao array em vez do objeto completo."
        },
        {
          "titulo": "Cabeçalho",
          "linhas": [
            26,
            49
          ],
          "explicacao": "A etiqueta, o título e a introdução organizam a apresentação.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Cabeçalho”.",
            "A função desta parte é: A etiqueta, o título e a introdução organizam a apresentação.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Criar o objeto fora da função e reutilizar o mesmo registro."
        },
        {
          "titulo": "Cartões conceituais",
          "linhas": [
            51,
            82
          ],
          "explicacao": "A grade apresenta os conteúdos centrais.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Cartões conceituais”.",
            "A função desta parte é: A grade apresenta os conteúdos centrais.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Acessar aluno[0] em vez de aluno.nome."
        },
        {
          "titulo": "Formulário e ações",
          "linhas": [
            84,
            162
          ],
          "explicacao": "Campos e botões recebem estilos para diferentes dispositivos.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Formulário e ações”.",
            "A função desta parte é: Campos e botões recebem estilos para diferentes dispositivos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Confundir o objeto aluno com o array alunos."
        },
        {
          "titulo": "Resumo e lista",
          "linhas": [
            164,
            223
          ],
          "explicacao": "Indicadores e cartões são organizados em grades.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Resumo e lista”.",
            "A função desta parte é: Indicadores e cartões são organizados em grades.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "display: flex",
              "descricao": "Organiza elementos em um eixo flexível."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Calcular a situação depois de criar o objeto sem atualizar a propriedade."
        },
        {
          "titulo": "Cartão do aluno",
          "linhas": [
            225,
            274
          ],
          "explicacao": "Situação, propriedades e remoção recebem estilos específicos.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Cartão do aluno”.",
            "A função desta parte é: Situação, propriedades e remoção recebem estilos específicos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "@media",
              "descricao": "Regra que aplica estilos conforme as características da tela."
            },
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Esquecer de renderizar novamente depois de remover um objeto."
        },
        {
          "titulo": "Responsividade",
          "linhas": [
            274,
            274
          ],
          "explicacao": "No celular, todos os elementos passam para uma coluna.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Responsividade”.",
            "A função desta parte é: No celular, todos os elementos passam para uma coluna.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "Responsividade",
              "descricao": "Trecho selecionado pelo tutorial para construir uma parte específica da atividade."
            },
            {
              "nome": "Linhas 274–274",
              "descricao": "Intervalo validado dentro do arquivo CSS."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Adicionar somente o nome ao array em vez do objeto completo."
        }
      ],
      "js": [
        {
          "titulo": "Array e elementos",
          "linhas": [
            1,
            7
          ],
          "explicacao": "O array alunos começa vazio e os campos são selecionados.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Array e elementos”.",
            "A função desta parte é: O array alunos começa vazio e os campos são selecionados.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um cadastro de alunos com vários objetos responderá aos dados ou ações do usuário.",
          "alerta": "Adicionar somente o nome ao array em vez do objeto completo.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Um objeto: Representa somente um registro."
        },
        {
          "titulo": "Eventos",
          "linhas": [
            9,
            17
          ],
          "explicacao": "Os botões registram callbacks de cadastro e limpeza.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Eventos”.",
            "A função desta parte é: Os botões registram callbacks de cadastro e limpeza.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "addEventListener()",
              "descricao": "Registra uma função para responder a um evento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um cadastro de alunos com vários objetos responderá aos dados ou ações do usuário.",
          "alerta": "Criar o objeto fora da função e reutilizar o mesmo registro.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Leitura e validação",
          "linhas": [
            19,
            52
          ],
          "explicacao": "Nome, turma e média são capturados e verificados.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Leitura e validação”.",
            "A função desta parte é: Nome, turma e média são capturados e verificados.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            },
            {
              "nome": "Number()",
              "descricao": "Converte um valor para número."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um cadastro de alunos com vários objetos responderá aos dados ou ações do usuário.",
          "alerta": "Acessar aluno[0] em vez de aluno.nome.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Array de objetos: Permite guardar vários registros completos na mesma coleção."
        },
        {
          "titulo": "Criação do objeto",
          "linhas": [
            54,
            71
          ],
          "explicacao": "A situação é calculada e o objeto aluno é adicionado ao array.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Criação do objeto”.",
            "A função desta parte é: A situação é calculada e o objeto aluno é adicionado ao array.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "push()",
              "descricao": "Adiciona um item ao final do array."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um cadastro de alunos com vários objetos responderá aos dados ou ações do usuário.",
          "alerta": "Confundir o objeto aluno com o array alunos.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Percorrendo objetos",
          "linhas": [
            74,
            132
          ],
          "explicacao": "forEach acessa cada objeto e cria um cartão com suas propriedades.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Percorrendo objetos”.",
            "A função desta parte é: forEach acessa cada objeto e cria um cartão com suas propriedades.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "else",
              "descricao": "Executa o caminho alternativo quando as condições anteriores são falsas."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um cadastro de alunos com vários objetos responderá aos dados ou ações do usuário.",
          "alerta": "Calcular a situação depois de criar o objeto sem atualizar a propriedade.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Array de objetos: Permite guardar vários registros completos na mesma coleção."
        },
        {
          "titulo": "Remoção",
          "linhas": [
            135,
            139
          ],
          "explicacao": "splice remove o objeto localizado pelo índice.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Remoção”.",
            "A função desta parte é: splice remove o objeto localizado pelo índice.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um cadastro de alunos com vários objetos responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer de renderizar novamente depois de remover um objeto.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Resumo",
          "linhas": [
            142,
            164
          ],
          "explicacao": "Outro forEach conta os alunos aprovados e em recuperação.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Resumo”.",
            "A função desta parte é: Outro forEach conta os alunos aprovados e em recuperação.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um cadastro de alunos com vários objetos responderá aos dados ou ações do usuário.",
          "alerta": "Adicionar somente o nome ao array em vez do objeto completo.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Array de objetos: Permite guardar vários registros completos na mesma coleção."
        },
        {
          "titulo": "Limpeza e mensagens",
          "linhas": [
            167,
            180
          ],
          "explicacao": "Funções auxiliares limpam campos, exibem mensagens e esvaziam o array.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Limpeza e mensagens”.",
            "A função desta parte é: Funções auxiliares limpam campos, exibem mensagens e esvaziam o array.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em um cadastro de alunos com vários objetos responderá aos dados ou ações do usuário.",
          "alerta": "Criar o objeto fora da função e reutilizar o mesmo registro.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 23 — Cadastro de Alunos com Array de Objetos",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como o JavaScript pode armazenar vários objetos dentro de um array.\n\n**O que será desenvolvido**\n\nNeste exercício, será criado um Cadastro de Alunos com campos para nome, turma e média, cartões individuais, identificação da situação escolar, indicadores de aprovados e recuperação e botões para remover registros.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-23`.\n\nArquivos obrigatórios:\n- `index.html`\n- `estilo.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá criar um objeto para cada aluno, adicionar o objeto ao array com `push()`, percorrer os registros com `forEach()`, acessar as propriedades pela notação de ponto, calcular a situação a partir da média e atualizar o resumo da turma.\n\n**Como testar**\n\n- Para testar, cadastre pelo menos três alunos com médias diferentes, confira os cartões e os indicadores, remova um cadastro e utilize o botão \"Limpar cadastros\".\n- Tentar cadastrar sem nome.\n- Tentar cadastrar sem turma.\n- Tentar cadastrar com média negativa.\n- Tentar cadastrar com média maior que 10.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-23` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como o JavaScript pode armazenar vários objetos dentro de um array.",
      "desenvolvimento": "Neste exercício, será criado um Cadastro de Alunos com campos para nome, turma e média, cartões individuais, identificação da situação escolar, indicadores de aprovados e recuperação e botões para remover registros.",
      "funcionamento": "O programa deverá criar um objeto para cada aluno, adicionar o objeto ao array com `push()`, percorrer os registros com `forEach()`, acessar as propriedades pela notação de ponto, calcular a situação a partir da média e atualizar o resumo da turma.",
      "testes": [
        "Para testar, cadastre pelo menos três alunos com médias diferentes, confira os cartões e os indicadores, remova um cadastro e utilize o botão \"Limpar cadastros\".",
        "Tentar cadastrar sem nome.",
        "Tentar cadastrar sem turma.",
        "Tentar cadastrar com média negativa.",
        "Tentar cadastrar com média maior que 10."
      ],
      "arquivos": [
        "index.html",
        "estilo.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-23` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false
    },
    "contextoDetalhado": [
      "A atividade constrói um cadastro de alunos com vários objetos.",
      "Em aplicações reais, sistemas reais mantêm coleções de registros e calculam resumos a partir das propriedades.",
      "O exercício conecta array, objeto literal, propriedades aos novos recursos array de objetos, objeto criado por cadastro, acesso a objetos durante o forEach, resumo por propriedades.",
      "O tutorial separa estrutura, aparência e comportamento para mostrar como cada arquivo contribui para o resultado final.",
      "As gavetas podem ser abertas a qualquer momento para revisar o contexto, consultar exemplos, entender o trecho atual e conferir o glossário."
    ],
    "fluxoAprendizagem": [
      "Estrutura: Estrutura inicial",
      "Estrutura: Apresentação",
      "Estrutura: Conceitos principais",
      "Estrutura: Campos do aluno",
      "Estrutura: Mensagem e resumo",
      "Estrutura: Lista dinâmica",
      "Aparência: Página e container",
      "Aparência: Cabeçalho"
    ],
    "dicasExtras": [
      "Localize no código onde aparece `array de objetos` e observe o que muda no preview quando esse trecho é executado.",
      "Leia o código em três perguntas: qual dado entra, qual regra é aplicada e qual resultado aparece na página?",
      "Use a gaveta Explicação da etapa antes de escrever o trecho; nela estão as partes, o motivo, o resultado esperado e os alertas.",
      "Depois do primeiro teste correto, altere apenas um valor para descobrir qual parte da lógica controla o comportamento.",
      "Evite este erro frequente: Adicionar somente o nome ao array em vez do objeto completo.",
      "Teste orientado: Tentar cadastrar sem nome"
    ],
    "perguntasGuia": [
      "Qual problema da atividade é resolvido por `array de objetos`?",
      "Qual é a diferença entre `array de objetos` e `objeto criado por cadastro` neste exercício?",
      "Que valor é lido antes da regra e que resultado é produzido depois?",
      "Como você explicaria a lógica de um cadastro de alunos com vários objetos sem ler o código palavra por palavra?",
      "O que aconteceria se este erro fosse cometido: Adicionar somente o nome ao array em vez do objeto completo."
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor."
    ],
    "glossarioExtra": [
      {
        "termo": "array de objetos",
        "tipo": "Coleção de registros",
        "definicao": "Array em que cada posição guarda um objeto completo."
      },
      {
        "termo": "registro",
        "tipo": "Conjunto de dados",
        "definicao": "Objeto que representa uma entidade, como um aluno ou participante."
      },
      {
        "termo": "propriedade",
        "tipo": "Campo do objeto",
        "definicao": "Nome que identifica uma informação dentro de um objeto."
      },
      {
        "termo": "resumo",
        "tipo": "Informação agregada",
        "definicao": "Resultado calculado a partir de vários registros."
      }
    ],
    "comparacoes": [
      {
        "titulo": "Um objeto",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Representa somente um registro."
      },
      {
        "titulo": "Array de objetos",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Permite guardar vários registros completos na mesma coleção."
      }
    ],
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 24,
    "studentReferenceStripped": true,
    "titulo": "Exercício 24 — Salvando Dados com localStorage",
    "nomeCurto": "Salvando dados com localStorage",
    "tema": "Persistência local, JSON.stringify e JSON.parse",
    "objetivo": "Salvar e recuperar um array de objetos no navegador usando localStorage e JSON.",
    "retomadas": [
      "array de objetos",
      "push()",
      "forEach()",
      "splice()",
      "createElement",
      "addEventListener",
      "propriedades"
    ],
    "novos": [
      "localStorage",
      "setItem()",
      "getItem()",
      "removeItem()",
      "JSON.stringify()",
      "JSON.parse()",
      "persistência local"
    ],
    "pasta": "exercicio-24",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
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
          "titulo": "Estrutura inicial",
          "linhas": [
            1,
            8
          ],
          "explicacao": "O documento configura idioma, responsividade e o arquivo de estilos.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Estrutura inicial”.",
            "A função desta parte é: O documento configura idioma, responsividade e o arquivo de estilos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "<!DOCTYPE html>",
              "descricao": "Informa ao navegador que o documento usa o padrão HTML5."
            },
            {
              "nome": "<html>",
              "descricao": "Elemento raiz que envolve todo o documento."
            },
            {
              "nome": "<head>",
              "descricao": "Reúne configurações e referências que não formam o conteúdo principal."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma lista de lembretes persistentes ficará disponível na página.",
          "alerta": "Tentar salvar um array diretamente sem JSON.stringify()."
        },
        {
          "titulo": "Apresentação",
          "linhas": [
            10,
            15
          ],
          "explicacao": "O título apresenta dados que permanecem salvos no navegador.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Apresentação”.",
            "A função desta parte é: O título apresenta dados que permanecem salvos no navegador.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma lista de lembretes persistentes ficará disponível na página.",
          "alerta": "Esquecer de usar JSON.parse() depois do getItem()."
        },
        {
          "titulo": "Conceitos de persistência",
          "linhas": [
            17,
            35
          ],
          "explicacao": "Os cartões explicam localStorage, stringify e parse.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Conceitos de persistência”.",
            "A função desta parte é: Os cartões explicam localStorage, stringify e parse.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "JSON.stringify()",
              "descricao": "Converte um valor JavaScript em texto JSON."
            },
            {
              "nome": "JSON.parse()",
              "descricao": "Converte texto JSON em valor JavaScript."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma lista de lembretes persistentes ficará disponível na página.",
          "alerta": "Usar a mesma chave com nomes diferentes no setItem e getItem."
        },
        {
          "titulo": "Campos do lembrete",
          "linhas": [
            37,
            62
          ],
          "explicacao": "Texto e categoria formam o objeto que será salvo.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Campos do lembrete”.",
            "A função desta parte é: Texto e categoria formam o objeto que será salvo.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<select>",
              "descricao": "Campo que permite escolher uma opção predefinida."
            },
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma lista de lembretes persistentes ficará disponível na página.",
          "alerta": "Não tratar o retorno null quando a chave ainda não existe."
        },
        {
          "titulo": "Mensagem e resumo",
          "linhas": [
            64,
            86
          ],
          "explicacao": "A página informa o resultado e resume os dados armazenados.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Mensagem e resumo”.",
            "A função desta parte é: A página informa o resultado e resume os dados armazenados.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma lista de lembretes persistentes ficará disponível na página.",
          "alerta": "Remover o item da tela sem atualizar o localStorage."
        },
        {
          "titulo": "Lista persistente",
          "linhas": [
            88,
            97
          ],
          "explicacao": "A área será preenchida com os lembretes recuperados do navegador.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Lista persistente”.",
            "A função desta parte é: A área será preenchida com os lembretes recuperados do navegador.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<script>",
              "descricao": "Liga ou contém o código JavaScript executado pela página."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma lista de lembretes persistentes ficará disponível na página.",
          "alerta": "Confundir removeItem() com a remoção de apenas um objeto do array."
        }
      ],
      "css": [
        {
          "titulo": "Página e container",
          "linhas": [
            1,
            24
          ],
          "explicacao": "A interface recebe fundo e cartão principal.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Página e container”.",
            "A função desta parte é: A interface recebe fundo e cartão principal.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Tentar salvar um array diretamente sem JSON.stringify()."
        },
        {
          "titulo": "Cabeçalho",
          "linhas": [
            26,
            49
          ],
          "explicacao": "A etiqueta e o título organizam a apresentação.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Cabeçalho”.",
            "A função desta parte é: A etiqueta e o título organizam a apresentação.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Esquecer de usar JSON.parse() depois do getItem()."
        },
        {
          "titulo": "Cartões conceituais",
          "linhas": [
            51,
            83
          ],
          "explicacao": "A grade apresenta os três conceitos novos.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Cartões conceituais”.",
            "A função desta parte é: A grade apresenta os três conceitos novos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Usar a mesma chave com nomes diferentes no setItem e getItem."
        },
        {
          "titulo": "Formulário e botões",
          "linhas": [
            85,
            164
          ],
          "explicacao": "Campos e ações recebem estilos responsivos.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Formulário e botões”.",
            "A função desta parte é: Campos e ações recebem estilos responsivos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Não tratar o retorno null quando a chave ainda não existe."
        },
        {
          "titulo": "Resumo",
          "linhas": [
            166,
            201
          ],
          "explicacao": "Os indicadores mostram quantidade e estado do armazenamento.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Resumo”.",
            "A função desta parte é: Os indicadores mostram quantidade e estado do armazenamento.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Remover o item da tela sem atualizar o localStorage."
        },
        {
          "titulo": "Cartões persistentes",
          "linhas": [
            203,
            269
          ],
          "explicacao": "Cada lembrete recebe categoria, referência e botão de remoção.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Cartões persistentes”.",
            "A função desta parte é: Cada lembrete recebe categoria, referência e botão de remoção.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "@media",
              "descricao": "Regra que aplica estilos conforme as características da tela."
            },
            {
              "nome": "display: flex",
              "descricao": "Organiza elementos em um eixo flexível."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Confundir removeItem() com a remoção de apenas um objeto do array."
        },
        {
          "titulo": "Responsividade",
          "linhas": [
            269,
            269
          ],
          "explicacao": "No celular, todos os componentes passam para uma coluna.",
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Responsividade”.",
            "A função desta parte é: No celular, todos os componentes passam para uma coluna.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "Responsividade",
              "descricao": "Trecho selecionado pelo tutorial para construir uma parte específica da atividade."
            },
            {
              "nome": "Linhas 269–269",
              "descricao": "Intervalo validado dentro do arquivo CSS."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Tentar salvar um array diretamente sem JSON.stringify()."
        }
      ],
      "js": [
        {
          "titulo": "Chave e carregamento",
          "linhas": [
            1,
            9
          ],
          "explicacao": "A chave identifica os dados e o array é carregado antes da interface.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Chave e carregamento”.",
            "A função desta parte é: A chave identifica os dados e o array é carregado antes da interface.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista de lembretes persistentes responderá aos dados ou ações do usuário.",
          "alerta": "Tentar salvar um array diretamente sem JSON.stringify().",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Somente na memória: Os valores desaparecem quando a página é recarregada."
        },
        {
          "titulo": "Eventos e renderização inicial",
          "linhas": [
            11,
            20
          ],
          "explicacao": "Os botões recebem callbacks e os dados recuperados são exibidos.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Eventos e renderização inicial”.",
            "A função desta parte é: Os botões recebem callbacks e os dados recuperados são exibidos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "addEventListener()",
              "descricao": "Registra uma função para responder a um evento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista de lembretes persistentes responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer de usar JSON.parse() depois do getItem().",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Recuperando dados",
          "linhas": [
            22,
            32
          ],
          "explicacao": "getItem busca o texto e JSON.parse reconstrói o array.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Recuperando dados”.",
            "A função desta parte é: getItem busca o texto e JSON.parse reconstrói o array.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            },
            {
              "nome": "localStorage.getItem()",
              "descricao": "Recupera o texto associado a uma chave."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista de lembretes persistentes responderá aos dados ou ações do usuário.",
          "alerta": "Usar a mesma chave com nomes diferentes no setItem e getItem.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Persistência local: O texto JSON permanece associado à origem da página."
        },
        {
          "titulo": "Salvando dados",
          "linhas": [
            35,
            43
          ],
          "explicacao": "JSON.stringify converte o array e setItem grava o texto.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Salvando dados”.",
            "A função desta parte é: JSON.stringify converte o array e setItem grava o texto.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista de lembretes persistentes responderá aos dados ou ações do usuário.",
          "alerta": "Não tratar o retorno null quando a chave ainda não existe.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Novo lembrete",
          "linhas": [
            46,
            82
          ],
          "explicacao": "A função valida, cria o objeto, adiciona ao array e salva.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Novo lembrete”.",
            "A função desta parte é: A função valida, cria o objeto, adiciona ao array e salva.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            },
            {
              "nome": "push()",
              "descricao": "Adiciona um item ao final do array."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista de lembretes persistentes responderá aos dados ou ações do usuário.",
          "alerta": "Remover o item da tela sem atualizar o localStorage.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Persistência local: O texto JSON permanece associado à origem da página."
        },
        {
          "titulo": "Renderização",
          "linhas": [
            85,
            134
          ],
          "explicacao": "forEach cria cartões para os objetos recuperados.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Renderização”.",
            "A função desta parte é: forEach cria cartões para os objetos recuperados.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "else",
              "descricao": "Executa o caminho alternativo quando as condições anteriores são falsas."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista de lembretes persistentes responderá aos dados ou ações do usuário.",
          "alerta": "Confundir removeItem() com a remoção de apenas um objeto do array.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Remoção e resumo",
          "linhas": [
            137,
            180
          ],
          "explicacao": "A remoção atualiza a chave e o resumo conta categorias.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Remoção e resumo”.",
            "A função desta parte é: A remoção atualiza a chave e o resumo conta categorias.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista de lembretes persistentes responderá aos dados ou ações do usuário.",
          "alerta": "Tentar salvar um array diretamente sem JSON.stringify().",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Persistência local: O texto JSON permanece associado à origem da página."
        },
        {
          "titulo": "Limpeza do armazenamento",
          "linhas": [
            193,
            205
          ],
          "explicacao": "A função confirma, remove a chave e restaura a interface.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Limpeza do armazenamento”.",
            "A função desta parte é: A função confirma, remove a chave e restaura a interface.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "localStorage.removeItem()",
              "descricao": "Remove uma chave e seu valor."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma lista de lembretes persistentes responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer de usar JSON.parse() depois do getItem().",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 24 — Salvando Dados com localStorage",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como o JavaScript pode salvar informações no navegador para que elas continuem disponíveis após atualizar ou reabrir a página.\n\n**O que será desenvolvido**\n\nNeste exercício, será criada uma Lista de Lembretes Persistentes com texto, categoria, cartões salvos, indicadores, remoção individual e um botão para limpar todo o armazenamento.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-24`.\n\nArquivos obrigatórios:\n- `index.html`\n- `estilo.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá recuperar os dados com `localStorage.getItem()`, converter o texto com `JSON.parse()`, salvar o array de objetos com `JSON.stringify()` e `localStorage.setItem()`, remover a chave com `removeItem()` e carregar os lembretes automaticamente ao abrir a página.\n\n**Como testar**\n\n- Para testar, cadastre pelo menos três lembretes, atualize a página para confirmar que eles permanecem, remova um item e utilize o botão \"Limpar armazenamento\".\n- Abrir a página sem dados salvos.\n- Tentar salvar sem texto.\n- Tentar salvar sem categoria.\n- Salvar três lembretes.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-24` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como o JavaScript pode salvar informações no navegador para que elas continuem disponíveis após atualizar ou reabrir a página.",
      "desenvolvimento": "Neste exercício, será criada uma Lista de Lembretes Persistentes com texto, categoria, cartões salvos, indicadores, remoção individual e um botão para limpar todo o armazenamento.",
      "funcionamento": "O programa deverá recuperar os dados com `localStorage.getItem()`, converter o texto com `JSON.parse()`, salvar o array de objetos com `JSON.stringify()` e `localStorage.setItem()`, remover a chave com `removeItem()` e carregar os lembretes automaticamente ao abrir a página.",
      "testes": [
        "Para testar, cadastre pelo menos três lembretes, atualize a página para confirmar que eles permanecem, remova um item e utilize o botão \"Limpar armazenamento\".",
        "Abrir a página sem dados salvos.",
        "Tentar salvar sem texto.",
        "Tentar salvar sem categoria.",
        "Salvar três lembretes."
      ],
      "arquivos": [
        "index.html",
        "estilo.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-24` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false
    },
    "contextoDetalhado": [
      "A atividade constrói uma lista de lembretes persistentes.",
      "Em aplicações reais, dados simples podem permanecer no navegador mesmo depois de atualizar a página.",
      "O exercício conecta array de objetos, push(), forEach() aos novos recursos localStorage, setItem(), getItem(), removeItem().",
      "O tutorial separa estrutura, aparência e comportamento para mostrar como cada arquivo contribui para o resultado final.",
      "As gavetas podem ser abertas a qualquer momento para revisar o contexto, consultar exemplos, entender o trecho atual e conferir o glossário."
    ],
    "fluxoAprendizagem": [
      "Estrutura: Estrutura inicial",
      "Estrutura: Apresentação",
      "Estrutura: Conceitos de persistência",
      "Estrutura: Campos do lembrete",
      "Estrutura: Mensagem e resumo",
      "Estrutura: Lista persistente",
      "Aparência: Página e container",
      "Aparência: Cabeçalho"
    ],
    "dicasExtras": [
      "Localize no código onde aparece `localStorage` e observe o que muda no preview quando esse trecho é executado.",
      "Leia o código em três perguntas: qual dado entra, qual regra é aplicada e qual resultado aparece na página?",
      "Use a gaveta Explicação da etapa antes de escrever o trecho; nela estão as partes, o motivo, o resultado esperado e os alertas.",
      "Depois do primeiro teste correto, altere apenas um valor para descobrir qual parte da lógica controla o comportamento.",
      "Evite este erro frequente: Tentar salvar um array diretamente sem JSON.stringify().",
      "Teste orientado: Abrir a página sem dados salvos"
    ],
    "perguntasGuia": [
      "Qual problema da atividade é resolvido por `localStorage`?",
      "Qual é a diferença entre `localStorage` e `setItem()` neste exercício?",
      "Que valor é lido antes da regra e que resultado é produzido depois?",
      "Como você explicaria a lógica de uma lista de lembretes persistentes sem ler o código palavra por palavra?",
      "O que aconteceria se este erro fosse cometido: Tentar salvar um array diretamente sem JSON.stringify()."
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor."
    ],
    "glossarioExtra": [
      {
        "termo": "localStorage",
        "tipo": "Armazenamento do navegador",
        "definicao": "Recurso que mantém pares de chave e texto no navegador."
      },
      {
        "termo": "chave",
        "tipo": "Identificador de armazenamento",
        "definicao": "Nome usado para salvar e recuperar um valor."
      },
      {
        "termo": "JSON.stringify",
        "tipo": "Conversão para texto",
        "definicao": "Transforma arrays e objetos em texto JSON."
      },
      {
        "termo": "JSON.parse",
        "tipo": "Reconstrução de dados",
        "definicao": "Converte um texto JSON novamente em valor JavaScript."
      },
      {
        "termo": "persistência",
        "tipo": "Manutenção de dados",
        "definicao": "Capacidade de conservar informações depois que uma execução termina."
      }
    ],
    "comparacoes": [
      {
        "titulo": "Somente na memória",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Os valores desaparecem quando a página é recarregada."
      },
      {
        "titulo": "Persistência local",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "O texto JSON permanece associado à origem da página."
      }
    ],
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 25,
    "studentReferenceStripped": true,
    "titulo": "Exercício 25 — Consulta de CEP com ViaCEP",
    "nomeCurto": "Consulta de CEP: fluxo da API",
    "tema": "API, endpoint, fetch, Promise, JSON e atualização do DOM",
    "objetivo": "Visualizar todas as etapas de uma consulta de CEP, desde a validação até o uso das propriedades do JSON.",
    "retomadas": [
      "objetos",
      "propriedades",
      "funções",
      "if",
      "return",
      "addEventListener",
      "replace()",
      "innerText"
    ],
    "novos": [
      "API",
      "webservice",
      "fetch()",
      "then()",
      "response.json()",
      "resposta JSON",
      "consulta externa"
    ],
    "pasta": "exercicio-25",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
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
          "titulo": "Contexto da consulta",
          "explicacao": "A página apresenta a consulta como um fluxo entre o navegador e um serviço externo.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Contexto da consulta”.",
            "A função desta parte é: A página apresenta a consulta como um fluxo entre o navegador e um serviço externo.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "resultadoEsperado": "A estrutura necessária para uma consulta de endereço por CEP ficará disponível na página.",
          "linhas": [
            11,
            17
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "alerta": "Confundir endpoint com o objeto JSON recebido."
        },
        {
          "titulo": "API, endpoint e JSON",
          "explicacao": "Os três cartões separam conceitos que costumam ser confundidos.",
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "fetch()",
              "descricao": "Inicia uma requisição HTTP e retorna uma Promise."
            }
          ],
          "linhas": [
            18,
            24
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “API, endpoint e JSON”.",
            "A função desta parte é: Os três cartões separam conceitos que costumam ser confundidos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma consulta de endereço por CEP ficará disponível na página.",
          "alerta": "Acreditar que fetch devolve o endereço imediatamente."
        },
        {
          "titulo": "Entrada e botões de apoio",
          "explicacao": "Além de consultar, o aluno pode preencher um exemplo e reiniciar a tela.",
          "resultadoEsperado": "A estrutura necessária para uma consulta de endereço por CEP ficará disponível na página.",
          "linhas": [
            25,
            38
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Entrada e botões de apoio”.",
            "A função desta parte é: Além de consultar, o aluno pode preencher um exemplo e reiniciar a tela.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<input>",
              "descricao": "Campo de entrada usado para capturar um valor do usuário."
            },
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "alerta": "Esquecer de retornar resposta.json() no primeiro then."
        },
        {
          "titulo": "Endpoint visível",
          "explicacao": "A URL gerada fica visível para relacionar o valor digitado com a requisição.",
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "linhas": [
            39,
            44
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Endpoint visível”.",
            "A função desta parte é: A URL gerada fica visível para relacionar o valor digitado com a requisição.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "resultadoEsperado": "A estrutura necessária para uma consulta de endereço por CEP ficará disponível na página.",
          "alerta": "Usar dados.cidade quando a propriedade correta é dados.localidade."
        },
        {
          "titulo": "Fluxo em quatro etapas",
          "explicacao": "A interface mostra em qual etapa a consulta está.",
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Fluxo em quatro etapas”.",
            "A função desta parte é: A interface mostra em qual etapa a consulta está.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "linhas": [
            45,
            52
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma consulta de endereço por CEP ficará disponível na página.",
          "alerta": "Executar a consulta antes de validar os oito dígitos."
        },
        {
          "titulo": "Mensagem e indicadores",
          "explicacao": "O usuário recebe feedback sobre o andamento e o resultado.",
          "linhas": [
            53,
            62
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Mensagem e indicadores”.",
            "A função desta parte é: O usuário recebe feedback sobre o andamento e o resultado.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma consulta de endereço por CEP ficará disponível na página.",
          "alerta": "Confundir endpoint com o objeto JSON recebido."
        },
        {
          "titulo": "Propriedades do objeto",
          "explicacao": "Os rótulos usam a notação dados.propriedade para aproximar interface e código.",
          "linhas": [
            63,
            77
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Propriedades do objeto”.",
            "A função desta parte é: Os rótulos usam a notação dados.propriedade para aproximar interface e código.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<script>",
              "descricao": "Liga ou contém o código JavaScript executado pela página."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma consulta de endereço por CEP ficará disponível na página.",
          "alerta": "Acreditar que fetch devolve o endereço imediatamente."
        }
      ],
      "css": [
        {
          "titulo": "Base visual",
          "explicacao": "Box model, fundo e container estruturam a página.",
          "linhas": [
            1,
            5
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Base visual”.",
            "A função desta parte é: Box model, fundo e container estruturam a página.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Confundir endpoint com o objeto JSON recebido."
        },
        {
          "titulo": "Identidade e conceitos",
          "explicacao": "Cores e cartões organizam o vocabulário novo.",
          "linhas": [
            6,
            14
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Identidade e conceitos”.",
            "A função desta parte é: Cores e cartões organizam o vocabulário novo.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Acreditar que fetch devolve o endereço imediatamente."
        },
        {
          "titulo": "Entrada e ações",
          "explicacao": "Campo e botões ficam acessíveis em mouse, teclado e toque.",
          "linhas": [
            15,
            26
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Entrada e ações”.",
            "A função desta parte é: Campo e botões ficam acessíveis em mouse, teclado e toque.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "display: flex",
              "descricao": "Organiza elementos em um eixo flexível."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Esquecer de retornar resposta.json() no primeiro then."
        },
        {
          "titulo": "Endpoint e fluxo",
          "explicacao": "Estados ativo e concluído tornam o processo visível.",
          "linhas": [
            27,
            38
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Endpoint e fluxo”.",
            "A função desta parte é: Estados ativo e concluído tornam o processo visível.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "display: flex",
              "descricao": "Organiza elementos em um eixo flexível."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Usar dados.cidade quando a propriedade correta é dados.localidade."
        },
        {
          "titulo": "Feedback e resumo",
          "explicacao": "Mensagens e indicadores comunicam o estado sem depender apenas de alertas.",
          "linhas": [
            39,
            45
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Feedback e resumo”.",
            "A função desta parte é: Mensagens e indicadores comunicam o estado sem depender apenas de alertas.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Executar a consulta antes de validar os oito dígitos."
        },
        {
          "titulo": "Resultado da API",
          "explicacao": "As propriedades são agrupadas em uma grade legível.",
          "linhas": [
            46,
            54
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Resultado da API”.",
            "A função desta parte é: As propriedades são agrupadas em uma grade legível.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Confundir endpoint com o objeto JSON recebido."
        },
        {
          "titulo": "Responsividade",
          "explicacao": "No celular, as grades passam para uma coluna.",
          "linhas": [
            55,
            61
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Responsividade”.",
            "A função desta parte é: No celular, as grades passam para uma coluna.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "@media",
              "descricao": "Regra que aplica estilos conforme as características da tela."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Acreditar que fetch devolve o endereço imediatamente."
        }
      ],
      "js": [
        {
          "titulo": "Elementos usados pelo JavaScript",
          "explicacao": "As constantes guardam referências para campo, mensagem, botão e URL.",
          "partes": [
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            }
          ],
          "linhas": [
            1,
            6
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Elementos usados pelo JavaScript”.",
            "A função desta parte é: As constantes guardam referências para campo, mensagem, botão e URL.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma consulta de endereço por CEP responderá aos dados ou ações do usuário.",
          "alerta": "Confundir endpoint com o objeto JSON recebido.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Dado local: Valor disponível imediatamente na página."
        },
        {
          "titulo": "Eventos e exemplos",
          "explicacao": "Cada interação registra uma função callback.",
          "comparacao": "O clique e a tecla Enter chamam a mesma função consultarCep, evitando duplicação.",
          "linhas": [
            7,
            19
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Eventos e exemplos”.",
            "A função desta parte é: Cada interação registra uma função callback.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "addEventListener()",
              "descricao": "Registra uma função para responder a um evento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma consulta de endereço por CEP responderá aos dados ou ações do usuário.",
          "alerta": "Acreditar que fetch devolve o endereço imediatamente.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "CEP limpo e endpoint",
          "explicacao": "replace remove caracteres que não são dígitos e a URL é montada dinamicamente.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "linhas": [
            20,
            30
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “CEP limpo e endpoint”.",
            "A função desta parte é: replace remove caracteres que não são dígitos e a URL é montada dinamicamente.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            },
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma consulta de endereço por CEP responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer de retornar resposta.json() no primeiro then.",
          "comparacao": "Dado externo: Resposta chega depois de uma requisição à API."
        },
        {
          "titulo": "Validação antes do fetch",
          "explicacao": "O código interrompe a função com return quando não existem oito dígitos.",
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "linhas": [
            31,
            43
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Validação antes do fetch”.",
            "A função desta parte é: O código interrompe a função com return quando não existem oito dígitos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            }
          ],
          "resultadoEsperado": "A interação prevista em uma consulta de endereço por CEP responderá aos dados ou ações do usuário.",
          "alerta": "Usar dados.cidade quando a propriedade correta é dados.localidade.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "fetch e primeira etapa da Promise",
          "explicacao": "fetch devolve uma Promise; o primeiro then recebe a resposta e chama response.json().",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “fetch e primeira etapa da Promise”.",
            "A função desta parte é: fetch devolve uma Promise; o primeiro then recebe a resposta e chama response.json().",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "linhas": [
            44,
            57
          ],
          "partes": [
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            },
            {
              "nome": "fetch()",
              "descricao": "Inicia uma requisição HTTP e retorna uma Promise."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma consulta de endereço por CEP responderá aos dados ou ações do usuário.",
          "alerta": "Executar a consulta antes de validar os oito dígitos.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Dado externo: Resposta chega depois de uma requisição à API."
        },
        {
          "titulo": "Objeto JSON recebido",
          "explicacao": "O segundo then verifica dados.erro e usa as propriedades do objeto.",
          "resultadoEsperado": "A interação prevista em uma consulta de endereço por CEP responderá aos dados ou ações do usuário.",
          "linhas": [
            58,
            72
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Objeto JSON recebido”.",
            "A função desta parte é: O segundo then verifica dados.erro e usa as propriedades do objeto.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            },
            {
              "nome": "then()",
              "descricao": "Define a próxima etapa de uma Promise concluída."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "alerta": "Confundir endpoint com o objeto JSON recebido.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Falha básica",
          "explicacao": "catch apresenta uma mensagem genérica. O Exercício 26 detalha a classificação de erros.",
          "alerta": "Acreditar que fetch devolve o endereço imediatamente.",
          "linhas": [
            73,
            80
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Falha básica”.",
            "A função desta parte é: catch apresenta uma mensagem genérica. O Exercício 26 detalha a classificação de erros.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "catch()",
              "descricao": "Recebe rejeições e erros lançados na cadeia."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma consulta de endereço por CEP responderá aos dados ou ações do usuário.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Dado externo: Resposta chega depois de uma requisição à API."
        },
        {
          "titulo": "Preenchimento por propriedades",
          "explicacao": "Cada propriedade do objeto é enviada para um elemento da página.",
          "linhas": [
            81,
            91
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Preenchimento por propriedades”.",
            "A função desta parte é: Cada propriedade do objeto é enviada para um elemento da página.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma consulta de endereço por CEP responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer de retornar resposta.json() no primeiro then.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Fluxo visual",
          "explicacao": "As classes ativo e concluido mostram a etapa atual.",
          "linhas": [
            92,
            108
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Fluxo visual”.",
            "A função desta parte é: As classes ativo e concluido mostram a etapa atual.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "for",
              "descricao": "Controla uma repetição por inicialização, condição e atualização."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma consulta de endereço por CEP responderá aos dados ou ações do usuário.",
          "alerta": "Usar dados.cidade quando a propriedade correta é dados.localidade.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Dado externo: Resposta chega depois de uma requisição à API."
        },
        {
          "titulo": "Limpeza e mensagens",
          "explicacao": "Funções auxiliares restauram dados e evitam repetição.",
          "linhas": [
            109,
            126
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Limpeza e mensagens”.",
            "A função desta parte é: Funções auxiliares restauram dados e evitam repetição.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            },
            {
              "nome": "forEach()",
              "descricao": "Executa um callback para cada item do array."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma consulta de endereço por CEP responderá aos dados ou ações do usuário.",
          "alerta": "Executar a consulta antes de validar os oito dígitos.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 25 — Consulta de CEP com ViaCEP",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como uma página envia uma requisição para uma API e transforma a resposta JSON em informações visíveis.\n\n**O que será desenvolvido**\n\nNeste exercício, será criado um Laboratório de Consulta de CEP que mostra a URL montada, destaca as etapas de validação, requisição, conversão do JSON e atualização da página, além de permitir preencher um CEP de exemplo.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-25`.\n\nArquivos obrigatórios:\n- `index.html`\n- `estilo.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá limpar o CEP com `replace()`, validar oito dígitos, montar o endpoint, executar `fetch()`, converter a resposta com `response.json()` e acessar propriedades como `dados.logradouro`, `dados.localidade` e `dados.uf`.\n\n**Como testar**\n\n- Durante o teste, observe como o valor `01001-000` se transforma em `01001000`, como a URL é formada e em qual momento cada etapa visual é ativada.\n- CEP vazio.\n- CEP com sete dígitos.\n- Botão de exemplo.\n- CEP 01001-000.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-25` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como uma página envia uma requisição para uma API e transforma a resposta JSON em informações visíveis.",
      "desenvolvimento": "Neste exercício, será criado um Laboratório de Consulta de CEP que mostra a URL montada, destaca as etapas de validação, requisição, conversão do JSON e atualização da página, além de permitir preencher um CEP de exemplo.",
      "funcionamento": "O programa deverá limpar o CEP com `replace()`, validar oito dígitos, montar o endpoint, executar `fetch()`, converter a resposta com `response.json()` e acessar propriedades como `dados.logradouro`, `dados.localidade` e `dados.uf`.",
      "testes": [
        "Durante o teste, observe como o valor `01001-000` se transforma em `01001000`, como a URL é formada e em qual momento cada etapa visual é ativada.",
        "CEP vazio.",
        "CEP com sete dígitos.",
        "Botão de exemplo.",
        "CEP 01001-000."
      ],
      "arquivos": [
        "index.html",
        "estilo.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-25` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false
    },
    "contextoDetalhado": [
      "A atividade constrói uma consulta de endereço por CEP.",
      "Em aplicações reais, front-ends consomem APIs externas e usam propriedades da resposta JSON.",
      "O exercício conecta objetos, propriedades, funções aos novos recursos API, webservice, fetch(), then().",
      "O tutorial separa estrutura, aparência e comportamento para mostrar como cada arquivo contribui para o resultado final.",
      "As gavetas podem ser abertas a qualquer momento para revisar o contexto, consultar exemplos, entender o trecho atual e conferir o glossário."
    ],
    "fluxoAprendizagem": [
      "Estrutura: Contexto da consulta",
      "Estrutura: API, endpoint e JSON",
      "Estrutura: Entrada e botões de apoio",
      "Estrutura: Endpoint visível",
      "Estrutura: Fluxo em quatro etapas",
      "Estrutura: Mensagem e indicadores",
      "Estrutura: Propriedades do objeto",
      "Aparência: Base visual"
    ],
    "dicasExtras": [
      "Localize no código onde aparece `API` e observe o que muda no preview quando esse trecho é executado.",
      "Leia o código em três perguntas: qual dado entra, qual regra é aplicada e qual resultado aparece na página?",
      "Use a gaveta Explicação da etapa antes de escrever o trecho; nela estão as partes, o motivo, o resultado esperado e os alertas.",
      "Depois do primeiro teste correto, altere apenas um valor para descobrir qual parte da lógica controla o comportamento.",
      "Evite este erro frequente: Confundir endpoint com o objeto JSON recebido.",
      "Teste orientado: CEP vazio"
    ],
    "perguntasGuia": [
      "Qual problema da atividade é resolvido por `API`?",
      "Qual é a diferença entre `API` e `webservice` neste exercício?",
      "Que valor é lido antes da regra e que resultado é produzido depois?",
      "Como você explicaria a lógica de uma consulta de endereço por CEP sem ler o código palavra por palavra?",
      "O que aconteceria se este erro fosse cometido: Confundir endpoint com o objeto JSON recebido."
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor."
    ],
    "glossarioExtra": [
      {
        "termo": "API",
        "tipo": "Integração entre sistemas",
        "definicao": "Interface que disponibiliza dados ou operações para outros programas."
      },
      {
        "termo": "endpoint",
        "tipo": "Endereço de serviço",
        "definicao": "URL específica usada para executar uma operação em uma API."
      },
      {
        "termo": "Promise",
        "tipo": "Resultado futuro",
        "definicao": "Objeto que representa uma operação que ainda poderá terminar com sucesso ou falha."
      },
      {
        "termo": "fetch",
        "tipo": "Requisição web",
        "definicao": "Função que inicia uma requisição HTTP e retorna uma Promise."
      },
      {
        "termo": "JSON",
        "tipo": "Formato de dados",
        "definicao": "Formato textual estruturado por propriedades, valores, arrays e objetos."
      }
    ],
    "comparacoes": [
      {
        "titulo": "Dado local",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Valor disponível imediatamente na página."
      },
      {
        "titulo": "Dado externo",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Resposta chega depois de uma requisição à API."
      }
    ],
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 26,
    "studentReferenceStripped": true,
    "titulo": "Exercício 26 — Consulta de CEP com Tratamento de Erros",
    "nomeCurto": "Consulta de CEP: diagnóstico de erros",
    "tema": "Validação, response.ok, throw, catch, finally e diagnóstico",
    "objetivo": "Classificar falhas de validação, CEP inexistente, HTTP e conexão, mantendo a interface em estado consistente.",
    "retomadas": [
      "API",
      "fetch()",
      "then()",
      "response.json()",
      "objetos",
      "propriedades",
      "if",
      "return",
      "addEventListener"
    ],
    "novos": [
      "response.ok",
      "response.status",
      "throw new Error()",
      "catch(error)",
      "error.message",
      "finally()",
      "botão disabled"
    ],
    "pasta": "exercicio-26",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
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
          "titulo": "Central de diagnóstico",
          "explicacao": "A atividade muda o foco: além de consultar, o aluno precisa descobrir por que uma tentativa falhou.",
          "linhas": [
            11,
            15
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Central de diagnóstico”.",
            "A função desta parte é: A atividade muda o foco: além de consultar, o aluno precisa descobrir por que uma tentativa falhou.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma consulta de CEP com diagnóstico de falhas ficará disponível na página.",
          "alerta": "Tratar qualquer resposta recebida como sucesso."
        },
        {
          "titulo": "Três peças do tratamento",
          "explicacao": "response.ok, throw e finally são apresentados separadamente antes do código completo.",
          "linhas": [
            16,
            22
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Três peças do tratamento”.",
            "A função desta parte é: response.ok, throw e finally são apresentados separadamente antes do código completo.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "response.ok",
              "descricao": "Indica se o status HTTP representa sucesso."
            },
            {
              "nome": "throw",
              "descricao": "Lança um erro e interrompe o fluxo normal."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma consulta de CEP com diagnóstico de falhas ficará disponível na página.",
          "alerta": "Chamar response.json antes de verificar response.ok."
        },
        {
          "titulo": "Roteiro de testes",
          "explicacao": "Botões preenchem casos de sucesso, CEP inexistente e formato inválido.",
          "resultadoEsperado": "A estrutura necessária para uma consulta de CEP com diagnóstico de falhas ficará disponível na página.",
          "linhas": [
            23,
            37
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Roteiro de testes”.",
            "A função desta parte é: Botões preenchem casos de sucesso, CEP inexistente e formato inválido.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<input>",
              "descricao": "Campo de entrada usado para capturar um valor do usuário."
            },
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "alerta": "Esquecer new Error ao usar throw."
        },
        {
          "titulo": "Fluxo try/catch/finally",
          "explicacao": "Cinco cartões mostram validação, HTTP, JSON, catch e finally.",
          "linhas": [
            38,
            46
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Fluxo try/catch/finally”.",
            "A função desta parte é: Cinco cartões mostram validação, HTTP, JSON, catch e finally.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma consulta de CEP com diagnóstico de falhas ficará disponível na página.",
          "alerta": "Colocar a mensagem de sucesso dentro de finally."
        },
        {
          "titulo": "Painel de diagnóstico",
          "explicacao": "Tipo, status HTTP, tentativas e explicação ficam visíveis.",
          "linhas": [
            47,
            59
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Painel de diagnóstico”.",
            "A função desta parte é: Tipo, status HTTP, tentativas e explicação ficam visíveis.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma consulta de CEP com diagnóstico de falhas ficará disponível na página.",
          "alerta": "Não limpar dados antigos depois de um erro."
        },
        {
          "titulo": "Resultado protegido",
          "explicacao": "Dados antigos são apagados quando uma nova tentativa termina em erro.",
          "linhas": [
            60,
            76
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Resultado protegido”.",
            "A função desta parte é: Dados antigos são apagados quando uma nova tentativa termina em erro.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<script>",
              "descricao": "Liga ou contém o código JavaScript executado pela página."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma consulta de CEP com diagnóstico de falhas ficará disponível na página.",
          "alerta": "Deixar o botão desabilitado quando a Promise termina."
        }
      ],
      "css": [
        {
          "titulo": "Base visual",
          "explicacao": "Container e fundo criam uma área de diagnóstico.",
          "linhas": [
            1,
            5
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Base visual”.",
            "A função desta parte é: Container e fundo criam uma área de diagnóstico.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Tratar qualquer resposta recebida como sucesso."
        },
        {
          "titulo": "Conceitos",
          "explicacao": "Cores suaves destacam termos sem competir com o resultado.",
          "linhas": [
            6,
            14
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Conceitos”.",
            "A função desta parte é: Cores suaves destacam termos sem competir com o resultado.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Chamar response.json antes de verificar response.ok."
        },
        {
          "titulo": "Consulta e testes",
          "explicacao": "Botões de roteiro facilitam demonstrações em sala.",
          "linhas": [
            15,
            27
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Consulta e testes”.",
            "A função desta parte é: Botões de roteiro facilitam demonstrações em sala.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "display: flex",
              "descricao": "Organiza elementos em um eixo flexível."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Esquecer new Error ao usar throw."
        },
        {
          "titulo": "Estados do fluxo",
          "explicacao": "As classes ativo, sucesso e falha mostram o caminho executado.",
          "linhas": [
            28,
            38
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Estados do fluxo”.",
            "A função desta parte é: As classes ativo, sucesso e falha mostram o caminho executado.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "display: flex",
              "descricao": "Organiza elementos em um eixo flexível."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Colocar a mensagem de sucesso dentro de finally."
        },
        {
          "titulo": "Diagnóstico legível",
          "explicacao": "Os indicadores exibem informações diferentes, não apenas uma mensagem genérica.",
          "linhas": [
            39,
            48
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Diagnóstico legível”.",
            "A função desta parte é: Os indicadores exibem informações diferentes, não apenas uma mensagem genérica.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Não limpar dados antigos depois de um erro."
        },
        {
          "titulo": "Resultado do endereço",
          "explicacao": "A grade mantém os dados organizados e pode ser limpa em falhas.",
          "linhas": [
            49,
            57
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Resultado do endereço”.",
            "A função desta parte é: A grade mantém os dados organizados e pode ser limpa em falhas.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Deixar o botão desabilitado quando a Promise termina."
        },
        {
          "titulo": "Responsividade",
          "explicacao": "No celular, todas as grades ficam em uma coluna.",
          "linhas": [
            58,
            64
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Responsividade”.",
            "A função desta parte é: No celular, todas as grades ficam em uma coluna.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "@media",
              "descricao": "Regra que aplica estilos conforme as características da tela."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Tratar qualquer resposta recebida como sucesso."
        }
      ],
      "js": [
        {
          "titulo": "Estado e referências",
          "explicacao": "totalTentativas guarda um estado numérico; as constantes apontam para a interface.",
          "linhas": [
            1,
            6
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Estado e referências”.",
            "A função desta parte é: totalTentativas guarda um estado numérico; as constantes apontam para a interface.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "let",
              "descricao": "Declara uma variável com escopo de bloco e possibilidade de reatribuição."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma consulta de CEP com diagnóstico de falhas responderá aos dados ou ações do usuário.",
          "alerta": "Tratar qualquer resposta recebida como sucesso.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Fluxo de sucesso: Processa uma resposta aceita e convertida."
        },
        {
          "titulo": "Eventos e roteiro",
          "explicacao": "querySelectorAll encontra todos os botões que possuem data-cep.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Eventos e roteiro”.",
            "A função desta parte é: querySelectorAll encontra todos os botões que possuem data-cep.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "linhas": [
            7,
            19
          ],
          "partes": [
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "forEach()",
              "descricao": "Executa um callback para cada item do array."
            },
            {
              "nome": "addEventListener()",
              "descricao": "Registra uma função para responder a um evento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma consulta de CEP com diagnóstico de falhas responderá aos dados ou ações do usuário.",
          "alerta": "Chamar response.json antes de verificar response.ok.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Validação local",
          "explicacao": "A expressão regular exige oito dígitos e impede o fetch quando o formato está errado.",
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            }
          ],
          "linhas": [
            20,
            37
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Validação local”.",
            "A função desta parte é: A expressão regular exige oito dígitos e impede o fetch quando o formato está errado.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma consulta de CEP com diagnóstico de falhas responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer new Error ao usar throw.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Fluxo de falha: Centraliza erros lançados e rejeições."
        },
        {
          "titulo": "response.ok e status",
          "explicacao": "A resposta pode chegar, mas ainda representar erro HTTP.",
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "linhas": [
            38,
            48
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “response.ok e status”.",
            "A função desta parte é: A resposta pode chegar, mas ainda representar erro HTTP.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            },
            {
              "nome": "fetch()",
              "descricao": "Inicia uma requisição HTTP e retorna uma Promise."
            }
          ],
          "resultadoEsperado": "A interação prevista em uma consulta de CEP com diagnóstico de falhas responderá aos dados ou ações do usuário.",
          "alerta": "Colocar a mensagem de sucesso dentro de finally.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Erro de regra de negócio",
          "explicacao": "Um HTTP 200 pode conter dados.erro. Nesse caso, o código lança outro tipo de erro.",
          "linhas": [
            49,
            61
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Erro de regra de negócio”.",
            "A função desta parte é: Um HTTP 200 pode conter dados.erro. Nesse caso, o código lança outro tipo de erro.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "then()",
              "descricao": "Define a próxima etapa de uma Promise concluída."
            },
            {
              "nome": "throw",
              "descricao": "Lança um erro e interrompe o fluxo normal."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma consulta de CEP com diagnóstico de falhas responderá aos dados ou ações do usuário.",
          "alerta": "Não limpar dados antigos depois de um erro.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Finalização: Restaura o estado comum depois de sucesso ou falha."
        },
        {
          "titulo": "catch classifica o problema",
          "explicacao": "erro.message diferencia CEP inexistente, HTTP e conexão.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “catch classifica o problema”.",
            "A função desta parte é: erro.message diferencia CEP inexistente, HTTP e conexão.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "linhas": [
            62,
            74
          ],
          "partes": [
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "else if",
              "descricao": "Testa uma nova condição quando a anterior foi falsa."
            },
            {
              "nome": "else",
              "descricao": "Executa o caminho alternativo quando as condições anteriores são falsas."
            },
            {
              "nome": "catch()",
              "descricao": "Recebe rejeições e erros lançados na cadeia."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma consulta de CEP com diagnóstico de falhas responderá aos dados ou ações do usuário.",
          "alerta": "Deixar o botão desabilitado quando a Promise termina.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "finally sempre executa",
          "explicacao": "O botão é reativado em sucesso ou falha.",
          "alerta": "Tratar qualquer resposta recebida como sucesso.",
          "linhas": [
            75,
            82
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “finally sempre executa”.",
            "A função desta parte é: O botão é reativado em sucesso ou falha.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "finally()",
              "descricao": "Executa uma finalização comum ao sucesso e à falha."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma consulta de CEP com diagnóstico de falhas responderá aos dados ou ações do usuário.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Finalização: Restaura o estado comum depois de sucesso ou falha."
        },
        {
          "titulo": "Estado de carregamento",
          "explicacao": "O botão é desabilitado para evitar cliques repetidos e a tentativa é contabilizada.",
          "linhas": [
            83,
            95
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Estado de carregamento”.",
            "A função desta parte é: O botão é desabilitado para evitar cliques repetidos e a tentativa é contabilizada.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma consulta de CEP com diagnóstico de falhas responderá aos dados ou ações do usuário.",
          "alerta": "Chamar response.json antes de verificar response.ok.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Mensagem diagnóstica",
          "explicacao": "Uma função centraliza estado, tipo e explicação do erro.",
          "linhas": [
            96,
            103
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Mensagem diagnóstica”.",
            "A função desta parte é: Uma função centraliza estado, tipo e explicação do erro.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma consulta de CEP com diagnóstico de falhas responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer new Error ao usar throw.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Finalização: Restaura o estado comum depois de sucesso ou falha."
        },
        {
          "titulo": "Preenchimento seguro",
          "explicacao": "Somente uma resposta válida chega a esta função.",
          "linhas": [
            104,
            114
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Preenchimento seguro”.",
            "A função desta parte é: Somente uma resposta válida chega a esta função.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma consulta de CEP com diagnóstico de falhas responderá aos dados ou ações do usuário.",
          "alerta": "Colocar a mensagem de sucesso dentro de finally.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Classes do fluxo",
          "explicacao": "A interface recebe classes conforme cada etapa avança.",
          "linhas": [
            115,
            127
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Classes do fluxo”.",
            "A função desta parte é: A interface recebe classes conforme cada etapa avança.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "forEach()",
              "descricao": "Executa um callback para cada item do array."
            },
            {
              "nome": "classList",
              "descricao": "Controla as classes CSS de um elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma consulta de CEP com diagnóstico de falhas responderá aos dados ou ações do usuário.",
          "alerta": "Não limpar dados antigos depois de um erro.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Finalização: Restaura o estado comum depois de sucesso ou falha."
        },
        {
          "titulo": "Restauração completa",
          "explicacao": "Campos, contadores, dados e estados retornam ao início.",
          "linhas": [
            128,
            151
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Restauração completa”.",
            "A função desta parte é: Campos, contadores, dados e estados retornam ao início.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            },
            {
              "nome": "forEach()",
              "descricao": "Executa um callback para cada item do array."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma consulta de CEP com diagnóstico de falhas responderá aos dados ou ações do usuário.",
          "alerta": "Deixar o botão desabilitado quando a Promise termina.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 26 — Consulta de CEP com Tratamento de Erros",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como o JavaScript identifica, classifica e comunica erros durante uma consulta externa.\n\n**O que será desenvolvido**\n\nNeste exercício, será criada uma Central de Diagnóstico de CEP com roteiro de testes, fluxo visual de validação, HTTP, JSON, `catch()` e `finally()`, além de indicadores de status, tipo de erro, código HTTP e tentativas.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-26`.\n\nArquivos obrigatórios:\n- `index.html`\n- `estilo.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá bloquear formatos inválidos antes do `fetch()`, verificar `response.ok`, lançar erros com `throw new Error()`, diferenciar CEP inexistente, resposta HTTP e falha de conexão pelo `erro.message`, limpar resultados antigos e usar `finally()` para reativar o botão.\n\n**Como testar**\n\n- Utilize os botões de teste para comparar sucesso, CEP inexistente e formato inválido. Explique por que uma resposta HTTP recebida não significa necessariamente sucesso e por que o `finally()` executa em todos os resultados.\n- Formato inválido.\n- Sucesso com 01001-000.\n- CEP inexistente 99999-999.\n- Resposta HTTP simulada nos testes.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-26` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como o JavaScript identifica, classifica e comunica erros durante uma consulta externa.",
      "desenvolvimento": "Neste exercício, será criada uma Central de Diagnóstico de CEP com roteiro de testes, fluxo visual de validação, HTTP, JSON, `catch()` e `finally()`, além de indicadores de status, tipo de erro, código HTTP e tentativas.",
      "funcionamento": "O programa deverá bloquear formatos inválidos antes do `fetch()`, verificar `response.ok`, lançar erros com `throw new Error()`, diferenciar CEP inexistente, resposta HTTP e falha de conexão pelo `erro.message`, limpar resultados antigos e usar `finally()` para reativar o botão.",
      "testes": [
        "Utilize os botões de teste para comparar sucesso, CEP inexistente e formato inválido. Explique por que uma resposta HTTP recebida não significa necessariamente sucesso e por que o `finally()` executa em todos os resultados.",
        "Formato inválido.",
        "Sucesso com 01001-000.",
        "CEP inexistente 99999-999.",
        "Resposta HTTP simulada nos testes."
      ],
      "arquivos": [
        "index.html",
        "estilo.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-26` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false
    },
    "contextoDetalhado": [
      "A atividade constrói uma consulta de CEP com diagnóstico de falhas.",
      "Em aplicações reais, interfaces precisam diferenciar entrada inválida, recurso inexistente, erro HTTP e conexão.",
      "O exercício conecta API, fetch(), then() aos novos recursos response.ok, response.status, throw new Error(), catch(error).",
      "O tutorial separa estrutura, aparência e comportamento para mostrar como cada arquivo contribui para o resultado final.",
      "As gavetas podem ser abertas a qualquer momento para revisar o contexto, consultar exemplos, entender o trecho atual e conferir o glossário."
    ],
    "fluxoAprendizagem": [
      "Estrutura: Central de diagnóstico",
      "Estrutura: Três peças do tratamento",
      "Estrutura: Roteiro de testes",
      "Estrutura: Fluxo try/catch/finally",
      "Estrutura: Painel de diagnóstico",
      "Estrutura: Resultado protegido",
      "Aparência: Base visual",
      "Aparência: Conceitos"
    ],
    "dicasExtras": [
      "Localize no código onde aparece `response.ok` e observe o que muda no preview quando esse trecho é executado.",
      "Leia o código em três perguntas: qual dado entra, qual regra é aplicada e qual resultado aparece na página?",
      "Use a gaveta Explicação da etapa antes de escrever o trecho; nela estão as partes, o motivo, o resultado esperado e os alertas.",
      "Depois do primeiro teste correto, altere apenas um valor para descobrir qual parte da lógica controla o comportamento.",
      "Evite este erro frequente: Tratar qualquer resposta recebida como sucesso.",
      "Teste orientado: Formato inválido"
    ],
    "perguntasGuia": [
      "Qual problema da atividade é resolvido por `response.ok`?",
      "Qual é a diferença entre `response.ok` e `response.status` neste exercício?",
      "Que valor é lido antes da regra e que resultado é produzido depois?",
      "Como você explicaria a lógica de uma consulta de CEP com diagnóstico de falhas sem ler o código palavra por palavra?",
      "O que aconteceria se este erro fosse cometido: Tratar qualquer resposta recebida como sucesso."
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor."
    ],
    "glossarioExtra": [
      {
        "termo": "response.ok",
        "tipo": "Propriedade HTTP",
        "definicao": "Indica se o status da resposta está entre 200 e 299."
      },
      {
        "termo": "status HTTP",
        "tipo": "Código de resposta",
        "definicao": "Número que informa o resultado da requisição, como 200, 404 ou 500."
      },
      {
        "termo": "throw",
        "tipo": "Lançamento de erro",
        "definicao": "Interrompe o fluxo normal e envia um erro para o tratamento."
      },
      {
        "termo": "catch",
        "tipo": "Tratamento de falha",
        "definicao": "Recebe erros lançados ou rejeições de uma cadeia de Promise."
      },
      {
        "termo": "finally",
        "tipo": "Finalização",
        "definicao": "Executa ao final da operação, tanto no sucesso quanto na falha."
      }
    ],
    "comparacoes": [
      {
        "titulo": "Fluxo de sucesso",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Processa uma resposta aceita e convertida."
      },
      {
        "titulo": "Fluxo de falha",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Centraliza erros lançados e rejeições."
      },
      {
        "titulo": "Finalização",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Restaura o estado comum depois de sucesso ou falha."
      }
    ],
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 27,
    "studentReferenceStripped": true,
    "titulo": "Exercício 27 — Arrow Functions em JavaScript",
    "nomeCurto": "Arrow functions: comparação detalhada",
    "tema": "Função convencional, arrow function, callbacks e retorno implícito",
    "objetivo": "Comparar detalhadamente três formas equivalentes de declarar funções e reconhecer cada parte da sintaxe.",
    "retomadas": [
      "function",
      "parâmetros",
      "argumentos",
      "return",
      "const",
      "addEventListener",
      "callback",
      "forEach"
    ],
    "novos": [
      "arrow function",
      "=>",
      "function expression",
      "retorno implícito",
      "escopo léxico",
      "diferenças de this",
      "hoisting comparado"
    ],
    "pasta": "exercicio-27",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
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
          "titulo": "Objetivo comparativo",
          "explicacao": "A atividade informa que a regra será escrita de três formas equivalentes.",
          "linhas": [
            11,
            17
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Objetivo comparativo”.",
            "A função desta parte é: A atividade informa que a regra será escrita de três formas equivalentes.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma comparação entre funções convencionais e arrow functions ficará disponível na página.",
          "alerta": "Esquecer de guardar a arrow em const."
        },
        {
          "titulo": "Mapa das partes da função",
          "explicacao": "Cada cor identifica uma parte da sintaxe.",
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            }
          ],
          "linhas": [
            18,
            26
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Mapa das partes da função”.",
            "A função desta parte é: Cada cor identifica uma parte da sintaxe.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma comparação entre funções convencionais e arrow functions ficará disponível na página.",
          "alerta": "Usar function e => na mesma declaração."
        },
        {
          "titulo": "Código lado a lado",
          "explicacao": "Os três blocos mostram o que permanece igual e o que muda.",
          "comparacao": "A operação matemática é a mesma; apenas a forma de declarar e retornar muda.",
          "linhas": [
            27,
            48
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Código lado a lado”.",
            "A função desta parte é: Os três blocos mostram o que permanece igual e o que muda.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma comparação entre funções convencionais e arrow functions ficará disponível na página.",
          "alerta": "Adicionar chaves e esquecer return."
        },
        {
          "titulo": "Argumentos fornecidos pelo usuário",
          "explicacao": "Valor e percentual serão enviados para os parâmetros das funções.",
          "linhas": [
            49,
            62
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Argumentos fornecidos pelo usuário”.",
            "A função desta parte é: Valor e percentual serão enviados para os parâmetros das funções.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<input>",
              "descricao": "Campo de entrada usado para capturar um valor do usuário."
            },
            {
              "nome": "<button>",
              "descricao": "Elemento interativo que pode iniciar uma ação."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma comparação entre funções convencionais e arrow functions ficará disponível na página.",
          "alerta": "Escrever = > com espaço entre os símbolos."
        },
        {
          "titulo": "Resultados independentes",
          "explicacao": "Cada cartão apresenta o valor obtido por uma forma de função.",
          "linhas": [
            63,
            84
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Resultados independentes”.",
            "A função desta parte é: Cada cartão apresenta o valor obtido por uma forma de função.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma comparação entre funções convencionais e arrow functions ficará disponível na página.",
          "alerta": "Confundir parâmetro com argumento."
        },
        {
          "titulo": "Diagnóstico de equivalência",
          "explicacao": "A página verifica se as três implementações devolvem exatamente o mesmo número.",
          "linhas": [
            85,
            98
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `index.html` e trabalha a etapa “Diagnóstico de equivalência”.",
            "A função desta parte é: A página verifica se as três implementações devolvem exatamente o mesmo número.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "id",
              "descricao": "Identificador usado para localizar um elemento específico."
            },
            {
              "nome": "class",
              "descricao": "Nome de classe usado para aplicar estilos ou representar estados."
            },
            {
              "nome": "<script>",
              "descricao": "Liga ou contém o código JavaScript executado pela página."
            },
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            }
          ],
          "porQue": "O HTML cria os elementos, textos, campos e identificadores que o CSS e o JavaScript utilizarão.",
          "resultadoEsperado": "A estrutura necessária para uma comparação entre funções convencionais e arrow functions ficará disponível na página.",
          "alerta": "Afirmar que arrow sempre substitui função convencional."
        }
      ],
      "css": [
        {
          "titulo": "Base e container",
          "explicacao": "A página recebe uma área ampla para comparação.",
          "linhas": [
            1,
            5
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Base e container”.",
            "A função desta parte é: A página recebe uma área ampla para comparação.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Esquecer de guardar a arrow em const."
        },
        {
          "titulo": "Cabeçalho",
          "explicacao": "A identidade visual apresenta o novo conteúdo.",
          "linhas": [
            6,
            10
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Cabeçalho”.",
            "A função desta parte é: A identidade visual apresenta o novo conteúdo.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Usar function e => na mesma declaração."
        },
        {
          "titulo": "Cores semânticas da sintaxe",
          "explicacao": "As mesmas cores aparecem no mapa e nos códigos.",
          "linhas": [
            11,
            20
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Cores semânticas da sintaxe”.",
            "A função desta parte é: As mesmas cores aparecem no mapa e nos códigos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Adicionar chaves e esquecer return."
        },
        {
          "titulo": "Comparação lado a lado",
          "explicacao": "Os códigos usam pre e overflow para manter legibilidade.",
          "linhas": [
            21,
            29
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Comparação lado a lado”.",
            "A função desta parte é: Os códigos usam pre e overflow para manter legibilidade.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Escrever = > com espaço entre os símbolos."
        },
        {
          "titulo": "Formulário e ações",
          "explicacao": "Cada botão executa uma forma específica ou a comparação completa.",
          "linhas": [
            30,
            43
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Formulário e ações”.",
            "A função desta parte é: Cada botão executa uma forma específica ou a comparação completa.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Confundir parâmetro com argumento."
        },
        {
          "titulo": "Cartões de resultado",
          "explicacao": "A classe ativo indica qual forma acabou de ser executada.",
          "linhas": [
            44,
            52
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Cartões de resultado”.",
            "A função desta parte é: A classe ativo indica qual forma acabou de ser executada.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Afirmar que arrow sempre substitui função convencional."
        },
        {
          "titulo": "Diagnóstico",
          "explicacao": "Os dados explicam forma, equivalência, parâmetros e retorno.",
          "linhas": [
            53,
            60
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Diagnóstico”.",
            "A função desta parte é: Os dados explicam forma, equivalência, parâmetros e retorno.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "display: grid",
              "descricao": "Organiza elementos em linhas e colunas de uma grade."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            },
            {
              "nome": "background",
              "descricao": "Define fundo, cor ou gradiente de uma área."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cantos de um elemento."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Esquecer de guardar a arrow em const."
        },
        {
          "titulo": "Responsividade",
          "explicacao": "Em telas menores, códigos e resultados ficam empilhados.",
          "linhas": [
            61,
            72
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `estilo.css` e trabalha a etapa “Responsividade”.",
            "A função desta parte é: Em telas menores, códigos e resultados ficam empilhados.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "@media",
              "descricao": "Regra que aplica estilos conforme as características da tela."
            },
            {
              "nome": "grid-template-columns",
              "descricao": "Define a quantidade e o tamanho das colunas da grade."
            }
          ],
          "porQue": "O CSS separa a apresentação visual da lógica e ajuda a manter a interface legível em diferentes telas.",
          "resultadoEsperado": "O preview apresentará organização, hierarquia visual e adaptação ao tamanho da tela.",
          "alerta": "Usar function e => na mesma declaração."
        }
      ],
      "js": [
        {
          "titulo": "Declaração convencional",
          "explicacao": "A função começa com function, possui nome, parâmetros, chaves e return.",
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            }
          ],
          "comparacao": "Declaração convencional: Possui nome após function e pode ser chamada antes da declaração.",
          "linhas": [
            1,
            6
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Declaração convencional”.",
            "A função desta parte é: A função começa com function, possui nome, parâmetros, chaves e return.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma comparação entre funções convencionais e arrow functions responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer de guardar a arrow em const.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Arrow com bloco",
          "explicacao": "A função é uma expressão armazenada em uma constante e utiliza =>.",
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "=>",
              "descricao": "Separa os parâmetros do corpo de uma arrow function."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "return",
              "descricao": "Encerra a função e devolve um valor."
            }
          ],
          "comparacao": "Ela faz o mesmo cálculo, mas não usa a palavra function.",
          "linhas": [
            7,
            12
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Arrow com bloco”.",
            "A função desta parte é: A função é uma expressão armazenada em uma constante e utiliza =>.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma comparação entre funções convencionais e arrow functions responderá aos dados ou ações do usuário.",
          "alerta": "Usar function e => na mesma declaração.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Arrow curta",
          "explicacao": "Sem chaves, a expressão após a seta é retornada automaticamente.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Arrow curta”.",
            "A função desta parte é: Sem chaves, a expressão após a seta é retornada automaticamente.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "alerta": "Adicionar chaves e esquecer return.",
          "linhas": [
            13,
            16
          ],
          "partes": [
            {
              "nome": "=>",
              "descricao": "Separa os parâmetros do corpo de uma arrow function."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma comparação entre funções convencionais e arrow functions responderá aos dados ou ações do usuário.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Arrow com bloco: É uma expressão guardada em const e usa retorno explícito."
        },
        {
          "titulo": "Referências da interface",
          "explicacao": "Elementos são selecionados uma vez e reutilizados.",
          "linhas": [
            17,
            22
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Referências da interface”.",
            "A função desta parte é: Elementos são selecionados uma vez e reutilizados.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "querySelectorAll()",
              "descricao": "Seleciona todos os elementos que correspondem ao seletor."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma comparação entre funções convencionais e arrow functions responderá aos dados ou ações do usuário.",
          "alerta": "Escrever = > com espaço entre os símbolos.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Callback convencional",
          "explicacao": "O segundo argumento de addEventListener é uma função convencional anônima.",
          "comparacao": "Arrow curta: Uma única expressão é devolvida implicitamente.",
          "linhas": [
            23,
            27
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Callback convencional”.",
            "A função desta parte é: O segundo argumento de addEventListener é uma função convencional anônima.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "addEventListener()",
              "descricao": "Registra uma função para responder a um evento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma comparação entre funções convencionais e arrow functions responderá aos dados ou ações do usuário.",
          "alerta": "Confundir parâmetro com argumento.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Callback com arrow",
          "explicacao": "O mesmo papel de callback é escrito com () => { ... }.",
          "comparacao": "As duas formas respondem ao clique; a arrow é mais curta.",
          "linhas": [
            28,
            36
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Callback com arrow”.",
            "A função desta parte é: O mesmo papel de callback é escrito com () => { ... }.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "=>",
              "descricao": "Separa os parâmetros do corpo de uma arrow function."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "addEventListener()",
              "descricao": "Registra uma função para responder a um evento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma comparação entre funções convencionais e arrow functions responderá aos dados ou ações do usuário.",
          "alerta": "Afirmar que arrow sempre substitui função convencional.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Parâmetros e argumentos",
          "explicacao": "lerValores devolve um objeto; depois valor e percentual são passados como argumentos.",
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            },
            {
              "nome": "Number()",
              "descricao": "Converte um valor para número."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            }
          ],
          "linhas": [
            37,
            53
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Parâmetros e argumentos”.",
            "A função desta parte é: lerValores devolve um objeto; depois valor e percentual são passados como argumentos.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma comparação entre funções convencionais e arrow functions responderá aos dados ou ações do usuário.",
          "alerta": "Esquecer de guardar a arrow em const.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Arrow curta: Uma única expressão é devolvida implicitamente."
        },
        {
          "titulo": "Escolha da implementação",
          "explicacao": "O modo decide qual função será chamada, mas os mesmos argumentos são usados.",
          "linhas": [
            54,
            69
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Escolha da implementação”.",
            "A função desta parte é: O modo decide qual função será chamada, mas os mesmos argumentos são usados.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "if",
              "descricao": "Executa um bloco quando uma condição é verdadeira."
            },
            {
              "nome": "else if",
              "descricao": "Testa uma nova condição quando a anterior foi falsa."
            },
            {
              "nome": "else",
              "descricao": "Executa o caminho alternativo quando as condições anteriores são falsas."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma comparação entre funções convencionais e arrow functions responderá aos dados ou ações do usuário.",
          "alerta": "Usar function e => na mesma declaração.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Retorno usado pela interface",
          "explicacao": "O número devolvido é formatado e exibido.",
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "linhas": [
            70,
            78
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Retorno usado pela interface”.",
            "A função desta parte é: O número devolvido é formatado e exibido.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": "classList",
              "descricao": "Controla as classes CSS de um elemento."
            }
          ],
          "resultadoEsperado": "A interação prevista em uma comparação entre funções convencionais e arrow functions responderá aos dados ou ações do usuário.",
          "alerta": "Adicionar chaves e esquecer return.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Arrow curta: Uma única expressão é devolvida implicitamente."
        },
        {
          "titulo": "Equivalência das três formas",
          "explicacao": "Os resultados são comparados com ===.",
          "resultadoEsperado": "A interação prevista em uma comparação entre funções convencionais e arrow functions responderá aos dados ou ações do usuário.",
          "linhas": [
            79,
            93
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Equivalência das três formas”.",
            "A função desta parte é: Os resultados são comparados com ===.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "=>",
              "descricao": "Separa os parâmetros do corpo de uma arrow function."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "alerta": "Escrever = > com espaço entre os símbolos.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Arrow de uma expressão",
          "explicacao": "formatarMoeda possui um parâmetro e retorno implícito.",
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Arrow de uma expressão”.",
            "A função desta parte é: formatarMoeda possui um parâmetro e retorno implícito.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "linhas": [
            94,
            97
          ],
          "partes": [
            {
              "nome": "=>",
              "descricao": "Separa os parâmetros do corpo de uma arrow function."
            },
            {
              "nome": "const",
              "descricao": "Declara uma referência que não poderá ser reatribuída."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma comparação entre funções convencionais e arrow functions responderá aos dados ou ações do usuário.",
          "alerta": "Confundir parâmetro com argumento.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Arrow curta: Uma única expressão é devolvida implicitamente."
        },
        {
          "titulo": "Reinício e callback arrow",
          "explicacao": "forEach recebe uma arrow function para repetir a limpeza dos três resultados.",
          "comparacao": "Arrow functions são muito usadas em callbacks de métodos de array.",
          "linhas": [
            98,
            117
          ],
          "detalhes": [
            "Este trecho pertence ao arquivo `script.js` e trabalha a etapa “Reinício e callback arrow”.",
            "A função desta parte é: forEach recebe uma arrow function para repetir a limpeza dos três resultados.",
            "Observe as linhas destacadas no editor e procure a mudança correspondente no preview antes de avançar."
          ],
          "partes": [
            {
              "nome": "function",
              "descricao": "Declara uma função convencional com nome."
            },
            {
              "nome": "=>",
              "descricao": "Separa os parâmetros do corpo de uma arrow function."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo valor do atributo id."
            },
            {
              "nome": "innerText",
              "descricao": "Lê ou altera o texto visível do elemento."
            },
            {
              "nome": ".value",
              "descricao": "Obtém ou altera o valor atual de um campo."
            }
          ],
          "porQue": "O JavaScript transforma a estrutura estática em comportamento, usando dados, condições, funções ou eventos.",
          "resultadoEsperado": "A interação prevista em uma comparação entre funções convencionais e arrow functions responderá aos dados ou ações do usuário.",
          "alerta": "Afirmar que arrow sempre substitui função convencional.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 27 — Arrow Functions em JavaScript",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como uma mesma função pode ser escrita na forma convencional e com arrow function.\n\n**O que será desenvolvido**\n\nNeste exercício, será criado um Comparador de Funções que calcula um desconto usando uma declaração convencional, uma arrow function com bloco e uma arrow function curta com retorno implícito.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-27`.\n\nArquivos obrigatórios:\n- `index.html`\n- `estilo.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá identificar nome, parâmetros, argumentos, corpo, `return` e o símbolo `=>`, executar cada implementação separadamente e comparar os três resultados. A atividade também mostrará callbacks escritos com `function` e com arrow function.\n\n**Como testar**\n\n- Para testar, use o valor `200` e o desconto `15`. Execute cada forma individualmente e depois utilize \"Comparar as três\". Observe que o resultado é o mesmo, embora a sintaxe seja diferente.\n- Campo valor vazio.\n- Percentual negativo.\n- Percentual maior que 100.\n- Executar convencional.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-27` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como uma mesma função pode ser escrita na forma convencional e com arrow function.",
      "desenvolvimento": "Neste exercício, será criado um Comparador de Funções que calcula um desconto usando uma declaração convencional, uma arrow function com bloco e uma arrow function curta com retorno implícito.",
      "funcionamento": "O programa deverá identificar nome, parâmetros, argumentos, corpo, `return` e o símbolo `=>`, executar cada implementação separadamente e comparar os três resultados. A atividade também mostrará callbacks escritos com `function` e com arrow function.",
      "testes": [
        "Para testar, use o valor `200` e o desconto `15`. Execute cada forma individualmente e depois utilize \"Comparar as três\". Observe que o resultado é o mesmo, embora a sintaxe seja diferente.",
        "Campo valor vazio.",
        "Percentual negativo.",
        "Percentual maior que 100.",
        "Executar convencional."
      ],
      "arquivos": [
        "index.html",
        "estilo.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-27` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "contextoDetalhado": [
      "A atividade constrói uma comparação entre funções convencionais e arrow functions.",
      "Em aplicações reais, equipes escolhem sintaxes diferentes conforme legibilidade, callback e comportamento de contexto.",
      "O exercício conecta function, parâmetros, argumentos aos novos recursos arrow function, =>, function expression, retorno implícito.",
      "O tutorial separa estrutura, aparência e comportamento para mostrar como cada arquivo contribui para o resultado final.",
      "As gavetas podem ser abertas a qualquer momento para revisar o contexto, consultar exemplos, entender o trecho atual e conferir o glossário."
    ],
    "fluxoAprendizagem": [
      "Estrutura: Objetivo comparativo",
      "Estrutura: Mapa das partes da função",
      "Estrutura: Código lado a lado",
      "Estrutura: Argumentos fornecidos pelo usuário",
      "Estrutura: Resultados independentes",
      "Estrutura: Diagnóstico de equivalência",
      "Aparência: Base e container",
      "Aparência: Cabeçalho"
    ],
    "dicasExtras": [
      "Localize no código onde aparece `arrow function` e observe o que muda no preview quando esse trecho é executado.",
      "Leia o código em três perguntas: qual dado entra, qual regra é aplicada e qual resultado aparece na página?",
      "Use a gaveta Explicação da etapa antes de escrever o trecho; nela estão as partes, o motivo, o resultado esperado e os alertas.",
      "Depois do primeiro teste correto, altere apenas um valor para descobrir qual parte da lógica controla o comportamento.",
      "Evite este erro frequente: Esquecer de guardar a arrow em const.",
      "Teste orientado: Campo valor vazio"
    ],
    "perguntasGuia": [
      "Qual problema da atividade é resolvido por `arrow function`?",
      "Qual é a diferença entre `arrow function` e `=>` neste exercício?",
      "Que valor é lido antes da regra e que resultado é produzido depois?",
      "Como você explicaria a lógica de uma comparação entre funções convencionais e arrow functions sem ler o código palavra por palavra?",
      "O que aconteceria se este erro fosse cometido: Esquecer de guardar a arrow em const."
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor."
    ],
    "comparacoes": [
      {
        "titulo": "Declaração convencional",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Possui nome após function e pode ser chamada antes da declaração."
      },
      {
        "titulo": "Arrow com bloco",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "É uma expressão guardada em const e usa retorno explícito."
      },
      {
        "titulo": "Arrow curta",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Uma única expressão é devolvida implicitamente."
      }
    ],
    "glossarioExtra": [
      {
        "termo": "arrow function",
        "tipo": "Forma de função",
        "definicao": "Função escrita com a seta => e normalmente armazenada em uma variável ou constante."
      },
      {
        "termo": "retorno implícito",
        "tipo": "Forma de retorno",
        "definicao": "Valor devolvido automaticamente por uma arrow de uma única expressão sem chaves."
      },
      {
        "termo": "callback",
        "tipo": "Função recebida",
        "definicao": "Função entregue a outro recurso para ser executada em um momento ou situação específica."
      },
      {
        "termo": "hoisting",
        "tipo": "Comportamento da linguagem",
        "definicao": "Disponibilização antecipada de algumas declarações durante a preparação do código."
      },
      {
        "termo": "this léxico",
        "tipo": "Contexto de arrow",
        "definicao": "Comportamento em que a arrow reutiliza o this do escopo externo."
      }
    ],
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false
    },
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 28,
    "studentReferenceStripped": true,
    "titulo": "Exercício 28 — Transformando Dados com map()",
    "nomeCurto": "Transformando dados com map()",
    "tema": "map, callback, retorno e novo array",
    "objetivo": "Transformar cada objeto de um array com map(), criando um novo array sem alterar o original.",
    "retomadas": [
      "array de objetos",
      "arrow function",
      "callback",
      "return",
      "forEach()",
      "createElement",
      "notação de ponto"
    ],
    "novos": [
      "map()",
      "novo array",
      "imutabilidade introdutória",
      "item transformado",
      "mesmo comprimento",
      "map versus forEach"
    ],
    "pasta": "exercicio-28",
    "repositorio": "atividades-praticas",
    "classroomUrl": "https://classroom.google.com/u/6/w/ODQyMTU3NDI1MTAy/t/all",
    "githubUrl": "https://github.com/",
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
          "titulo": "Estrutura do documento",
          "explicacao": "Configura idioma, responsividade, título e conexão com o CSS.",
          "linhas": [
            1,
            8
          ],
          "detalhes": [
            "Este trecho trabalha a etapa “Estrutura do documento”.",
            "Configura idioma, responsividade, título e conexão com o CSS.",
            "Leia o código identificando entrada, transformação e saída antes de avançar."
          ],
          "partes": [
            {
              "nome": "<!DOCTYPE html>",
              "descricao": "Informa que o documento utiliza HTML5."
            },
            {
              "nome": "link",
              "descricao": "Conecta o arquivo estilo.css."
            }
          ],
          "porQue": "Sem essa estrutura o navegador não interpreta a página e seus arquivos da forma esperada.",
          "resultadoEsperado": "A página possui título, idioma e estilos carregados.",
          "alerta": "Esquecer o link do CSS.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Objetivo e conceitos",
          "explicacao": "Apresenta o laboratório e os três elementos fundamentais do map().",
          "linhas": [
            11,
            32
          ],
          "detalhes": [
            "Este trecho trabalha a etapa “Objetivo e conceitos”.",
            "Apresenta o laboratório e os três elementos fundamentais do map().",
            "Leia o código identificando entrada, transformação e saída antes de avançar."
          ],
          "partes": [
            {
              "nome": "section",
              "descricao": "Agrupa uma parte temática da página."
            },
            {
              "nome": "article",
              "descricao": "Representa cada conceito em um cartão."
            }
          ],
          "porQue": "O aluno precisa compreender o fluxo antes de digitar a implementação.",
          "resultadoEsperado": "Três cartões explicam array original, callback e novo array.",
          "alerta": "Confundir callback com o array retornado.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Fluxo visual do map",
          "explicacao": "Mostra a sequência produtos → map(callback) → novo array.",
          "linhas": [
            34,
            40
          ],
          "detalhes": [
            "Este trecho trabalha a etapa “Fluxo visual do map”.",
            "Mostra a sequência produtos → map(callback) → novo array.",
            "Leia o código identificando entrada, transformação e saída antes de avançar."
          ],
          "partes": [
            {
              "nome": "code",
              "descricao": "Destaca um termo ou trecho de código."
            },
            {
              "nome": "→",
              "descricao": "Representa a passagem de dados entre etapas."
            }
          ],
          "porQue": "A representação visual facilita perceber que existe uma entrada e uma saída diferentes.",
          "resultadoEsperado": "O fluxo do método aparece antes do formulário.",
          "alerta": "Achar que map altera automaticamente o array original.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Controles da transformação",
          "explicacao": "Recebe o percentual, a operação e disponibiliza os botões.",
          "linhas": [
            42,
            65
          ],
          "detalhes": [
            "Este trecho trabalha a etapa “Controles da transformação”.",
            "Recebe o percentual, a operação e disponibiliza os botões.",
            "Leia o código identificando entrada, transformação e saída antes de avançar."
          ],
          "partes": [
            {
              "nome": "input type=\"number\"",
              "descricao": "Recebe um valor numérico."
            },
            {
              "nome": "select",
              "descricao": "Permite escolher desconto ou acréscimo."
            }
          ],
          "porQue": "Os controles fornecem os argumentos usados pelo callback.",
          "resultadoEsperado": "O usuário escolhe percentual e operação.",
          "alerta": "Usar um percentual fora do intervalo.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Mensagem e resumo",
          "explicacao": "Reserva elementos para feedback e indicadores dos arrays.",
          "linhas": [
            67,
            86
          ],
          "detalhes": [
            "Este trecho trabalha a etapa “Mensagem e resumo”.",
            "Reserva elementos para feedback e indicadores dos arrays.",
            "Leia o código identificando entrada, transformação e saída antes de avançar."
          ],
          "partes": [
            {
              "nome": "aria-live",
              "descricao": "Ajuda tecnologias assistivas a anunciar mudanças."
            },
            {
              "nome": "strong",
              "descricao": "Destaca o valor de um indicador."
            }
          ],
          "porQue": "O usuário precisa saber o que ocorreu e verificar a preservação do original.",
          "resultadoEsperado": "A interface exibe quantidades e estado do array original.",
          "alerta": "Atualizar os dados sem atualizar os indicadores.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Comparação entre arrays",
          "explicacao": "Cria painéis separados para o antes e o depois.",
          "linhas": [
            88,
            118
          ],
          "detalhes": [
            "Este trecho trabalha a etapa “Comparação entre arrays”.",
            "Cria painéis separados para o antes e o depois.",
            "Leia o código identificando entrada, transformação e saída antes de avançar."
          ],
          "partes": [
            {
              "nome": "listaOriginal",
              "descricao": "Recebe os produtos de entrada."
            },
            {
              "nome": "listaTransformada",
              "descricao": "Recebe o resultado retornado por map."
            }
          ],
          "porQue": "A comparação lado a lado torna visível a criação de um novo array.",
          "resultadoEsperado": "Os preços originais e transformados aparecem em painéis diferentes.",
          "alerta": "Renderizar os dois resultados no mesmo elemento.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "map versus forEach",
          "explicacao": "Resume quando utilizar map() e quando utilizar forEach().",
          "linhas": [
            120,
            132
          ],
          "detalhes": [
            "Este trecho trabalha a etapa “map versus forEach”.",
            "Resume quando utilizar map() e quando utilizar forEach().",
            "Leia o código identificando entrada, transformação e saída antes de avançar."
          ],
          "partes": [
            {
              "nome": "map()",
              "descricao": "Transforma e retorna um novo array."
            },
            {
              "nome": "forEach()",
              "descricao": "Percorre para executar ações e retorna undefined."
            }
          ],
          "porQue": "A comparação evita escolher o método somente pela aparência da sintaxe.",
          "resultadoEsperado": "Dois cartões explicam a finalidade de cada método.",
          "alerta": "Esperar que forEach retorne automaticamente um array.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        }
      ],
      "css": [
        {
          "titulo": "Base da página",
          "explicacao": "Define box model, fundo, tipografia e container.",
          "linhas": [
            1,
            3
          ],
          "detalhes": [
            "Este trecho trabalha a etapa “Base da página”.",
            "Define box model, fundo, tipografia e container.",
            "Leia o código identificando entrada, transformação e saída antes de avançar."
          ],
          "partes": [
            {
              "nome": "box-sizing",
              "descricao": "Inclui bordas e preenchimentos no cálculo do tamanho."
            }
          ],
          "porQue": "Cria uma base previsível para todos os componentes.",
          "resultadoEsperado": "A página ocupa a tela sem estouro horizontal.",
          "alerta": "Remover box-sizing e alterar os tamanhos dos cartões.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Cabeçalho e conceitos",
          "explicacao": "Estiliza etiqueta, título, introdução e cartões conceituais.",
          "linhas": [
            24,
            64
          ],
          "detalhes": [
            "Este trecho trabalha a etapa “Cabeçalho e conceitos”.",
            "Estiliza etiqueta, título, introdução e cartões conceituais.",
            "Leia o código identificando entrada, transformação e saída antes de avançar."
          ],
          "partes": [
            {
              "nome": "grid-template-columns",
              "descricao": "Define três colunas para os conceitos."
            },
            {
              "nome": "border-radius",
              "descricao": "Arredonda os cartões."
            }
          ],
          "porQue": "A hierarquia visual organiza o conteúdo antes da prática.",
          "resultadoEsperado": "Os três conceitos aparecem em cartões alinhados.",
          "alerta": "Fixar larguras que prejudiquem o celular.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Fluxo e formulário",
          "explicacao": "Destaca o fluxo do método e prepara os controles.",
          "linhas": [
            69,
            114
          ],
          "detalhes": [
            "Este trecho trabalha a etapa “Fluxo e formulário”.",
            "Destaca o fluxo do método e prepara os controles.",
            "Leia o código identificando entrada, transformação e saída antes de avançar."
          ],
          "partes": [
            {
              "nome": "overflow-x",
              "descricao": "Permite rolagem horizontal somente no fluxo se necessário."
            },
            {
              "nome": ":focus",
              "descricao": "Mostra visualmente o campo ativo."
            }
          ],
          "porQue": "A interface precisa continuar legível em diferentes larguras.",
          "resultadoEsperado": "Fluxo, input e select ficam claros e acessíveis.",
          "alerta": "Retirar o foco visual dos campos.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Botões e feedback",
          "explicacao": "Organiza ações, mensagem e indicadores.",
          "linhas": [
            119,
            176
          ],
          "detalhes": [
            "Este trecho trabalha a etapa “Botões e feedback”.",
            "Organiza ações, mensagem e indicadores.",
            "Leia o código identificando entrada, transformação e saída antes de avançar."
          ],
          "partes": [
            {
              "nome": "cursor: pointer",
              "descricao": "Indica que o botão é clicável."
            },
            {
              "nome": "grid",
              "descricao": "Distribui os indicadores igualmente."
            }
          ],
          "porQue": "Ações e resultados precisam ser reconhecidos rapidamente.",
          "resultadoEsperado": "Botões e três indicadores aparecem organizados.",
          "alerta": "Usar cores sem contraste suficiente.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Painéis dos arrays",
          "explicacao": "Monta a comparação em duas colunas e destaca o novo array.",
          "linhas": [
            181,
            218
          ],
          "detalhes": [
            "Este trecho trabalha a etapa “Painéis dos arrays”.",
            "Monta a comparação em duas colunas e destaca o novo array.",
            "Leia o código identificando entrada, transformação e saída antes de avançar."
          ],
          "partes": [
            {
              "nome": "minmax(0, 1fr)",
              "descricao": "Evita que conteúdo interno force transbordamento."
            },
            {
              "nome": ".destaque",
              "descricao": "Diferencia visualmente o resultado do map."
            }
          ],
          "porQue": "O antes e o depois precisam caber lado a lado sem quebrar a página.",
          "resultadoEsperado": "Dois painéis equilibrados exibem os arrays.",
          "alerta": "Usar 1fr sem proteger conteúdos longos.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Produtos e totais",
          "explicacao": "Estiliza cada item, preço, total e estado vazio.",
          "linhas": [
            227,
            260
          ],
          "detalhes": [
            "Este trecho trabalha a etapa “Produtos e totais”.",
            "Estiliza cada item, preço, total e estado vazio.",
            "Leia o código identificando entrada, transformação e saída antes de avançar."
          ],
          "partes": [
            {
              "nome": "justify-content",
              "descricao": "Separa nome e preço."
            },
            {
              "nome": "font-style",
              "descricao": "Diferencia a mensagem de lista vazia."
            }
          ],
          "porQue": "Cada produto deve ser lido como uma unidade independente.",
          "resultadoEsperado": "Produtos aparecem como linhas com nome e preço.",
          "alerta": "Não permitir quebra ou espaço para nomes maiores.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Comparação de métodos e responsividade",
          "explicacao": "Estiliza os cartões didáticos e reorganiza tudo no celular.",
          "linhas": [
            269,
            299
          ],
          "detalhes": [
            "Este trecho trabalha a etapa “Comparação de métodos e responsividade”.",
            "Estiliza os cartões didáticos e reorganiza tudo no celular.",
            "Leia o código identificando entrada, transformação e saída antes de avançar."
          ],
          "partes": [
            {
              "nome": "@media",
              "descricao": "Aplica regras conforme a largura da tela."
            },
            {
              "nome": "1fr",
              "descricao": "Transforma grades em uma única coluna."
            }
          ],
          "porQue": "A atividade deve funcionar em computador, tablet e celular.",
          "resultadoEsperado": "Em telas menores, os painéis ficam empilhados.",
          "alerta": "Manter duas colunas em uma tela estreita.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        }
      ],
      "js": [
        {
          "titulo": "Array original de objetos",
          "explicacao": "Cria quatro produtos que serão lidos, mas não alterados pelo map().",
          "linhas": [
            1,
            6
          ],
          "detalhes": [
            "Este trecho trabalha a etapa “Array original de objetos”.",
            "Cria quatro produtos que serão lidos, mas não alterados pelo map().",
            "Leia o código identificando entrada, transformação e saída antes de avançar."
          ],
          "partes": [
            {
              "nome": "const produtos",
              "descricao": "Guarda a referência do array original."
            },
            {
              "nome": "objeto",
              "descricao": "Agrupa nome e preço de cada produto."
            }
          ],
          "porQue": "O método precisa de uma coleção de entrada para executar a transformação.",
          "resultadoEsperado": "O array original contém quatro objetos.",
          "alerta": "Modificar diretamente produto.preco dentro do callback.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Entrada: dados existentes que serão apenas lidos."
        },
        {
          "titulo": "Novo array e referências",
          "explicacao": "Separa o resultado e seleciona os elementos usados pela interface.",
          "linhas": [
            8,
            14
          ],
          "detalhes": [
            "Este trecho trabalha a etapa “Novo array e referências”.",
            "Separa o resultado e seleciona os elementos usados pela interface.",
            "Leia o código identificando entrada, transformação e saída antes de avançar."
          ],
          "partes": [
            {
              "nome": "let",
              "descricao": "Permite substituir o array resultante a cada execução."
            },
            {
              "nome": "getElementById()",
              "descricao": "Localiza um elemento pelo id."
            }
          ],
          "porQue": "O resultado precisa existir em uma variável diferente do original.",
          "resultadoEsperado": "O novo array começa vazio e os elementos são localizados.",
          "alerta": "Usar a mesma variável para entrada e saída.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Original e resultado possuem referências diferentes."
        },
        {
          "titulo": "Arrow de formatação",
          "explicacao": "Converte um número para moeda brasileira usando retorno implícito.",
          "linhas": [
            16,
            20
          ],
          "detalhes": [
            "Este trecho trabalha a etapa “Arrow de formatação”.",
            "Converte um número para moeda brasileira usando retorno implícito.",
            "Leia o código identificando entrada, transformação e saída antes de avançar."
          ],
          "partes": [
            {
              "nome": "=>",
              "descricao": "Indica uma arrow function."
            },
            {
              "nome": "retorno implícito",
              "descricao": "Devolve a expressão sem escrever return."
            }
          ],
          "porQue": "A mesma formatação é reutilizada em preços e totais.",
          "resultadoEsperado": "Valores numéricos aparecem como moeda em reais.",
          "alerta": "Adicionar chaves sem adicionar return.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Arrow curta: apropriada para uma única expressão."
        },
        {
          "titulo": "Callback de transformação",
          "explicacao": "Recebe um produto e devolve um novo objeto com o preço calculado.",
          "linhas": [
            22,
            36
          ],
          "detalhes": [
            "Este trecho trabalha a etapa “Callback de transformação”.",
            "Recebe um produto e devolve um novo objeto com o preço calculado.",
            "Leia o código identificando entrada, transformação e saída antes de avançar."
          ],
          "partes": [
            {
              "nome": "parâmetros",
              "descricao": "Recebem produto, percentual e operação."
            },
            {
              "nome": "return",
              "descricao": "Define o item que entrará no novo array."
            },
            {
              "nome": "novo objeto",
              "descricao": "Evita alterar o objeto original."
            }
          ],
          "porQue": "Cada execução do callback precisa produzir exatamente um novo item.",
          "resultadoEsperado": "Um produto de entrada gera um produto de saída.",
          "alerta": "Esquecer o return e criar posições undefined.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "map usa o valor retornado pelo callback para preencher o novo array."
        },
        {
          "titulo": "Eventos e estado inicial",
          "explicacao": "Liga os botões às funções e renderiza o array original.",
          "linhas": [
            10,
            48
          ],
          "detalhes": [
            "Este trecho trabalha a etapa “Eventos e estado inicial”.",
            "Liga os botões às funções e renderiza o array original.",
            "Leia o código identificando entrada, transformação e saída antes de avançar."
          ],
          "partes": [
            {
              "nome": "addEventListener",
              "descricao": "Registra a função executada no clique."
            },
            {
              "nome": "renderizarProdutos",
              "descricao": "Cria os cartões visuais."
            }
          ],
          "porQue": "A página precisa iniciar com os dados originais visíveis e aguardar ações.",
          "resultadoEsperado": "O painel original aparece antes de qualquer transformação.",
          "alerta": "Executar transformarProdutos imediatamente ao carregar.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Validação da entrada",
          "explicacao": "Converte o percentual e impede valores fora de 1 a 100.",
          "linhas": [
            50,
            64
          ],
          "detalhes": [
            "Este trecho trabalha a etapa “Validação da entrada”.",
            "Converte o percentual e impede valores fora de 1 a 100.",
            "Leia o código identificando entrada, transformação e saída antes de avançar."
          ],
          "partes": [
            {
              "nome": "Number()",
              "descricao": "Converte o valor textual do input em número."
            },
            {
              "nome": "if",
              "descricao": "Interrompe a execução quando a entrada é inválida."
            }
          ],
          "porQue": "Um callback deve receber argumentos válidos para produzir resultados confiáveis.",
          "resultadoEsperado": "Valores inválidos mostram mensagem e não executam map.",
          "alerta": "Validar apenas se o campo está vazio.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Execução do map()",
          "explicacao": "Percorre todos os produtos e guarda os retornos em um novo array.",
          "linhas": [
            67,
            73
          ],
          "detalhes": [
            "Este trecho trabalha a etapa “Execução do map()”.",
            "Percorre todos os produtos e guarda os retornos em um novo array.",
            "Leia o código identificando entrada, transformação e saída antes de avançar."
          ],
          "partes": [
            {
              "nome": "map()",
              "descricao": "Executa um callback para cada item e retorna um novo array."
            },
            {
              "nome": "produto",
              "descricao": "Representa o item atual."
            },
            {
              "nome": "return",
              "descricao": "Entrega o novo item ao map."
            }
          ],
          "porQue": "Este é o núcleo pedagógico do exercício: transformar sem mutar o original.",
          "resultadoEsperado": "O novo array possui quatro produtos transformados.",
          "alerta": "Usar forEach esperando receber um novo array.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "map retorna array; forEach retorna undefined."
        },
        {
          "titulo": "Renderização e mensagem",
          "explicacao": "Mostra o novo array, atualiza indicadores e descreve a operação.",
          "linhas": [
            75,
            90
          ],
          "detalhes": [
            "Este trecho trabalha a etapa “Renderização e mensagem”.",
            "Mostra o novo array, atualiza indicadores e descreve a operação.",
            "Leia o código identificando entrada, transformação e saída antes de avançar."
          ],
          "partes": [
            {
              "nome": "operador ternário",
              "descricao": "Escolhe o texto desconto ou acréscimo."
            },
            {
              "nome": "mensagem",
              "descricao": "Explica o resultado ao usuário."
            }
          ],
          "porQue": "A transformação só fica compreensível quando a saída é comparada com a entrada.",
          "resultadoEsperado": "O painel direito exibe os novos preços e a operação executada.",
          "alerta": "Atualizar o array sem atualizar o DOM.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "forEach para renderizar",
          "explicacao": "Percorre uma lista apenas para criar elementos, sem precisar de novo array.",
          "linhas": [
            92,
            109
          ],
          "detalhes": [
            "Este trecho trabalha a etapa “forEach para renderizar”.",
            "Percorre uma lista apenas para criar elementos, sem precisar de novo array.",
            "Leia o código identificando entrada, transformação e saída antes de avançar."
          ],
          "partes": [
            {
              "nome": "forEach()",
              "descricao": "Executa uma ação para cada produto."
            },
            {
              "nome": "indice",
              "descricao": "Informa a posição atual."
            },
            {
              "nome": "appendChild",
              "descricao": "Insere elementos no DOM."
            }
          ],
          "porQue": "Aqui o objetivo é causar um efeito visual, não transformar dados.",
          "resultadoEsperado": "Cada produto gera um cartão no elemento de destino.",
          "alerta": "Trocar map por forEach na etapa que precisa retornar dados.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "forEach é adequado para renderização; map é adequado para transformação."
        },
        {
          "titulo": "Total sem reduce()",
          "explicacao": "Soma os preços usando forEach, mantendo reduce() para um exercício posterior.",
          "linhas": [
            111,
            118
          ],
          "detalhes": [
            "Este trecho trabalha a etapa “Total sem reduce()”.",
            "Soma os preços usando forEach, mantendo reduce() para um exercício posterior.",
            "Leia o código identificando entrada, transformação e saída antes de avançar."
          ],
          "partes": [
            {
              "nome": "acumulador",
              "descricao": "A variável total guarda a soma parcial."
            },
            {
              "nome": "+=",
              "descricao": "Adiciona o preço ao valor já acumulado."
            }
          ],
          "porQue": "O resumo precisa comparar o total original e o transformado sem antecipar reduce().",
          "resultadoEsperado": "A função devolve a soma dos preços da lista recebida.",
          "alerta": "Declarar total dentro do callback e perder a soma.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "reduce() fará esse tipo de acumulação de forma específica no Exercício 32."
        },
        {
          "titulo": "Resumo e preservação",
          "explicacao": "Atualiza quantidades, totais e declara visualmente que o original foi preservado.",
          "linhas": [
            121,
            136
          ],
          "detalhes": [
            "Este trecho trabalha a etapa “Resumo e preservação”.",
            "Atualiza quantidades, totais e declara visualmente que o original foi preservado.",
            "Leia o código identificando entrada, transformação e saída antes de avançar."
          ],
          "partes": [
            {
              "nome": "length",
              "descricao": "Informa a quantidade de itens."
            },
            {
              "nome": "innerText",
              "descricao": "Atualiza o texto visível."
            }
          ],
          "porQue": "Os indicadores comprovam duas propriedades importantes do map: mesmo tamanho e novo array.",
          "resultadoEsperado": "Original e transformado exibem quantidade e totais corretos.",
          "alerta": "Afirmar preservação sem verificar que o código não altera produto.preco.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        },
        {
          "titulo": "Restauração do laboratório",
          "explicacao": "Esvazia apenas o resultado e retorna os controles aos valores iniciais.",
          "linhas": [
            138,
            153
          ],
          "detalhes": [
            "Este trecho trabalha a etapa “Restauração do laboratório”.",
            "Esvazia apenas o resultado e retorna os controles aos valores iniciais.",
            "Leia o código identificando entrada, transformação e saída antes de avançar."
          ],
          "partes": [
            {
              "nome": "[]",
              "descricao": "Cria um novo array vazio."
            },
            {
              "nome": "focus()",
              "descricao": "Devolve o cursor ao campo principal."
            }
          ],
          "porQue": "Permite repetir a experiência sem modificar o array de entrada.",
          "resultadoEsperado": "O painel transformado volta ao estado vazio.",
          "alerta": "Esvaziar o array produtos por engano.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima.",
          "comparacao": "Restaurar o resultado não significa reconstruir o array original."
        },
        {
          "titulo": "Função auxiliar de mensagem",
          "explicacao": "Centraliza a atualização do texto e da cor do feedback.",
          "linhas": [
            156,
            159
          ],
          "detalhes": [
            "Este trecho trabalha a etapa “Função auxiliar de mensagem”.",
            "Centraliza a atualização do texto e da cor do feedback.",
            "Leia o código identificando entrada, transformação e saída antes de avançar."
          ],
          "partes": [
            {
              "nome": "parâmetros",
              "descricao": "Recebem texto e cor."
            },
            {
              "nome": "style.color",
              "descricao": "Altera a cor da mensagem."
            }
          ],
          "porQue": "Evita repetir as mesmas duas instruções em vários pontos.",
          "resultadoEsperado": "Todas as ações usam uma mensagem consistente.",
          "alerta": "Confundir a variável texto com o elemento mensagem.",
          "exemplo": "// Estrutura de apoio: escreva o trecho com base na explicação e nos conceitos acima."
        }
      ]
    },
    "classroom": {
      "titulo": "Exercício 28 — Transformando Dados com map()",
      "descricao": "**Objetivo da atividade**\n\nNesta atividade, vamos praticar como o método `map()` transforma cada item de um array e retorna um novo array, preservando os dados originais.\n\n**O que será desenvolvido**\n\nNeste exercício, será criado um Laboratório do `map()` com produtos, preços, percentual, escolha entre desconto e acréscimo, comparação entre o array original e o novo array e uma explicação visual da diferença entre `map()` e `forEach()`.\n\n**Organização dos arquivos**\n\nUtilize o tutorial da plataforma e as explicações da aula para digitar, testar e revisar o código. Salve a atividade no repositório `atividades-praticas`, dentro da pasta `exercicio-28`.\n\nArquivos obrigatórios:\n- `index.html`\n- `estilo.css`\n- `script.js`\n\n**Funcionamento esperado**\n\nO programa deverá manter o array original, utilizar uma arrow function como callback, devolver um novo objeto em cada execução, armazenar o resultado retornado por `map()`, renderizar os dois arrays lado a lado e comprovar que ambos possuem a mesma quantidade de itens.\n\n**Como testar**\n\n- Para testar, execute um desconto de 10%, depois um acréscimo de 20%, compare os preços e totais, tente um percentual inválido e utilize o botão \"Restaurar laboratório\".\n- Executar 10% de desconto e conferir os quatro preços.\n- Executar 20% de acréscimo e conferir o total.\n- Tentar percentual vazio, zero, negativo e maior que 100.\n- Comparar o comprimento dos dois arrays.\n\n**Antes de entregar**\n\n- A página abre sem arquivos ausentes e sem erros visíveis.\n- A interação principal funciona com os dados de teste.\n- Os arquivos estão dentro da pasta `exercicio-28` e não soltos na raiz do repositório.\n- O link do repositório abre corretamente para quem receber a entrega.\n\n**Entrega**\n\nAnexe no Google Classroom o link do repositório `atividades-praticas`. Confira se a pasta do exercício e os arquivos obrigatórios aparecem no GitHub.",
      "formato": "v2",
      "objetivo": "Nesta atividade, vamos praticar como o método `map()` transforma cada item de um array e retorna um novo array, preservando os dados originais.",
      "desenvolvimento": "Neste exercício, será criado um Laboratório do `map()` com produtos, preços, percentual, escolha entre desconto e acréscimo, comparação entre o array original e o novo array e uma explicação visual da diferença entre `map()` e `forEach()`.",
      "funcionamento": "O programa deverá manter o array original, utilizar uma arrow function como callback, devolver um novo objeto em cada execução, armazenar o resultado retornado por `map()`, renderizar os dois arrays lado a lado e comprovar que ambos possuem a mesma quantidade de itens.",
      "testes": [
        "Para testar, execute um desconto de 10%, depois um acréscimo de 20%, compare os preços e totais, tente um percentual inválido e utilize o botão \"Restaurar laboratório\".",
        "Executar 10% de desconto e conferir os quatro preços.",
        "Executar 20% de acréscimo e conferir o total.",
        "Tentar percentual vazio, zero, negativo e maior que 100.",
        "Comparar o comprimento dos dois arrays."
      ],
      "arquivos": [
        "index.html",
        "estilo.css",
        "script.js"
      ],
      "criterios": [
        "A página abre sem arquivos ausentes e sem erros visíveis.",
        "A interação principal funciona com os dados de teste.",
        "Os arquivos estão dentro da pasta `exercicio-28` e não soltos na raiz do repositório.",
        "O link do repositório abre corretamente para quem receber a entrega."
      ],
      "entrega": "Anexar no Google Classroom o link do repositório atividades-praticas."
    },
    "contextoDetalhado": [
      "A atividade simula uma transformação de preços semelhante ao processamento realizado por lojas virtuais, relatórios e sistemas administrativos.",
      "O array `produtos` representa a fonte original; ele deve continuar intacto para que os dados de entrada possam ser comparados ou reutilizados.",
      "O método `map()` chama uma função para cada item e utiliza cada valor retornado para montar um novo array.",
      "A arrow function estudada no exercício anterior aparece como callback, conectando a sintaxe nova a uma aplicação prática.",
      "A interface mostra entrada e saída lado a lado para tornar visíveis o mesmo comprimento, os novos objetos e a preservação dos valores originais.",
      "As gavetas detalham a anatomia do callback, o papel do return e a diferença entre map() e forEach()."
    ],
    "fluxoAprendizagem": [
      "Identificar o array original e os objetos armazenados.",
      "Reconhecer a função callback e seus parâmetros.",
      "Calcular o novo preço sem alterar produto.preco.",
      "Devolver um novo objeto com return.",
      "Executar map() e guardar o array retornado.",
      "Renderizar original e resultado em áreas separadas.",
      "Comparar map() com forEach() conforme a finalidade.",
      "Testar desconto, acréscimo, validação e restauração."
    ],
    "dicasExtras": [
      "Leia `produtos.map(...)` como: para cada produto, devolva o produto transformado.",
      "Dentro do callback, procure o `return`: ele define exatamente o que será colocado no novo array.",
      "Compare `produtos.length` com `produtosTransformados.length`; o map mantém uma saída para cada entrada.",
      "Verifique que nenhum trecho executa `produto.preco = novoPreco`; assim o objeto original é preservado.",
      "Use map() quando precisa do array resultante. Use forEach() para ações como criar elementos no DOM.",
      "Faça primeiro um teste de 10% de desconto e calcule manualmente o preço do Teclado para conferir o resultado."
    ],
    "perguntasGuia": [
      "Qual array existe antes da execução e qual array passa a existir depois?",
      "O que o callback recebe em cada repetição?",
      "Por que o `return` dentro do callback é obrigatório neste exemplo?",
      "O que aconteceria se fosse usado forEach() no lugar de map() na atribuição do novo array?",
      "Como o código comprova que o array original não foi alterado?",
      "Por que o map() retorna a mesma quantidade de itens neste exercício?"
    ],
    "exemplosExtras": [
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor.",
      "Estrutura de apoio: descreva em pseudocódigo a regra antes de implementá-la no editor."
    ],
    "glossarioExtra": [
      {
        "termo": "map()",
        "tipo": "Método de array",
        "definicao": "Executa um callback para cada item e retorna um novo array formado pelos valores devolvidos."
      },
      {
        "termo": "callback",
        "tipo": "Função recebida",
        "definicao": "Função entregue ao map para ser executada uma vez para cada item."
      },
      {
        "termo": "item atual",
        "tipo": "Parâmetro",
        "definicao": "Valor da posição que o map está processando naquele momento."
      },
      {
        "termo": "return do callback",
        "tipo": "Saída",
        "definicao": "Valor que ocupará a posição correspondente no novo array."
      },
      {
        "termo": "novo array",
        "tipo": "Resultado",
        "definicao": "Array retornado pelo map, separado da coleção usada como entrada."
      },
      {
        "termo": "imutabilidade",
        "tipo": "Princípio",
        "definicao": "Ideia de produzir novos valores sem modificar diretamente os dados originais."
      },
      {
        "termo": "mesmo comprimento",
        "tipo": "Característica",
        "definicao": "Em map, cada item de entrada produz um item de saída."
      },
      {
        "termo": "forEach()",
        "tipo": "Método de array",
        "definicao": "Percorre itens para executar ações, mas retorna undefined em vez de um novo array."
      }
    ],
    "comparacoes": [
      {
        "titulo": "map()",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Retorna um novo array e usa o retorno do callback como novo item."
      },
      {
        "titulo": "forEach()",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "É apropriado para efeitos como exibir ou registrar; não retorna um novo array."
      },
      {
        "titulo": "Mutação direta",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Altera o objeto original e dificulta comparar antes e depois."
      },
      {
        "titulo": "Novo objeto",
        "codigo": "Estrutura conceitual — a solução completa fica somente no Modo Professor.",
        "explicacao": "Produz uma saída independente, preservando as propriedades originais."
      }
    ],
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false
    },
    "referenciaCompletaPadrao": false
  }
];
