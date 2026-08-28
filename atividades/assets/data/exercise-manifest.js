// Manifesto público alinhado ao catálogo ativo/visível do Supabase — v14.9.0.
// O banco é a fonte de verdade para disponibilidade; este arquivo fornece metadados e arquivos iniciais.
export const EXERCISE_MANIFEST = {
  "introducao-programacao:1": {
    "subject": "introducao-programacao",
    "numero": 1,
    "titulo": "Exercício 01 - Variáveis, tipos, entrada e saída",
    "objetivo": "Criar uma ficha digital usando variáveis, entradas, conversões e f-strings.",
    "modulo": "Python",
    "conceitos": [
      "print()",
      "input()",
      "str",
      "int",
      "float",
      "bool",
      "f-strings"
    ],
    "passos": [
      {
        "titulo": "Preparação e estrutura",
        "arquivo": "main.py",
        "linhas": [
          1,
          4
        ],
        "explicacao": "Prepare o arquivo e reconheça a estrutura necessária para criar uma ficha digital usando variáveis, entradas, conversões e f-strings.",
        "resultado": "A parte construída deve continuar compatível com as etapas anteriores."
      },
      {
        "titulo": "Entrada ou conteúdo principal",
        "arquivo": "main.py",
        "linhas": [
          5,
          8
        ],
        "explicacao": "Construa a parte que recebe dados ou apresenta o conteúdo principal. Conceitos em foco: print(), input(), str.",
        "resultado": "A parte construída deve continuar compatível com as etapas anteriores."
      },
      {
        "titulo": "Lógica e processamento",
        "arquivo": "main.py",
        "linhas": [
          9,
          13
        ],
        "explicacao": "Aplique a lógica central da atividade. Observe a ordem das instruções e como os dados são transformados.",
        "resultado": "A parte construída deve continuar compatível com as etapas anteriores."
      },
      {
        "titulo": "Saída, resultado e testes",
        "arquivo": "main.py",
        "linhas": [
          11,
          13
        ],
        "explicacao": "Execute, teste entradas diferentes, leia mensagens de erro e confirme o resultado antes de concluir.",
        "resultado": "A parte construída deve continuar compatível com as etapas anteriores."
      }
    ],
    "arquivosFornecidos": [],
    "validacao": {
      "minChars": 120,
      "regras": [
        {
          "arquivo": "main.py",
          "rotulo": "Entrada de dados",
          "padroes": [
            "\\binput\\s*\\("
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Conversão para inteiro",
          "padroes": [
            "\\bint\\s*\\("
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Conversão para decimal",
          "padroes": [
            "\\bfloat\\s*\\("
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Saída formatada",
          "padroes": [
            "f[\\\"\\']|\\.format\\s*\\("
          ]
        }
      ]
    },
    "files": [
      {
        "filename": "main.py",
        "language": "python"
      }
    ]
  },
  "introducao-programacao:2": {
    "subject": "introducao-programacao",
    "numero": 2,
    "titulo": "Exercício 02 - Operadores e cálculos em Python",
    "objetivo": "Revisar operadores matemáticos criando um resumo de desempenho com notas, tempo, aproveitamento e bônus.",
    "modulo": "Python",
    "conceitos": [
      "+",
      "-",
      "*",
      "/",
      "//",
      "%",
      "**",
      "abs()",
      "round()",
      "float()",
      "int()",
      "f-strings"
    ],
    "passos": [
      {
        "titulo": "Entradas e conversões",
        "arquivo": "main.py",
        "linhas": [
          1,
          6
        ],
        "explicacao": "Crie as variáveis de entrada e converta notas para float e quantidades para int. O replace permite usar vírgula em valores decimais.",
        "resultado": "O programa recebe cinco valores numéricos do usuário."
      },
      {
        "titulo": "Soma, divisão e arredondamento",
        "arquivo": "main.py",
        "linhas": [
          8,
          10
        ],
        "explicacao": "Some as notas, divida por dois para calcular a média e use round para controlar as casas decimais.",
        "resultado": "Soma, média e diferença ficam disponíveis para a saída."
      },
      {
        "titulo": "Divisão inteira e resto",
        "arquivo": "main.py",
        "linhas": [
          11,
          12
        ],
        "explicacao": "Use // para obter horas completas e % para descobrir quantos minutos sobraram.",
        "resultado": "O total de minutos é apresentado como horas e minutos."
      },
      {
        "titulo": "Porcentagem e potência",
        "arquivo": "main.py",
        "linhas": [
          13,
          14
        ],
        "explicacao": "Calcule o aproveitamento multiplicando a razão por 100 e use ** para gerar os pontos de bônus.",
        "resultado": "O programa calcula porcentagem e potência."
      },
      {
        "titulo": "Saída formatada e testes",
        "arquivo": "main.py",
        "linhas": [
          16,
          22
        ],
        "explicacao": "Apresente todos os resultados com f-strings. Execute com os dados sugeridos e depois provoque um erro de conversão para interpretar o traceback.",
        "resultado": "O terminal mostra o resumo completo do desempenho."
      }
    ],
    "arquivosFornecidos": [],
    "validacao": {
      "minChars": 300,
      "regras": [
        {
          "arquivo": "main.py",
          "rotulo": "Cinco entradas de dados",
          "padroes": [
            "(?:input\\s*\\([^)]*\\).*?){5}"
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Conversões float e int",
          "padroes": [
            "float\\s*\\(",
            "int\\s*\\("
          ],
          "modo": "todos"
        },
        {
          "arquivo": "main.py",
          "rotulo": "Soma e divisão",
          "padroes": [
            "\\+",
            "(?<!/)\\/(?!/)"
          ],
          "modo": "todos"
        },
        {
          "arquivo": "main.py",
          "rotulo": "Subtração ou diferença absoluta",
          "padroes": [
            "abs\\s*\\(",
            "\\-"
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Divisão inteira",
          "padroes": [
            "//"
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Resto da divisão",
          "padroes": [
            "%"
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Potência",
          "padroes": [
            "\\*\\*"
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Arredondamento",
          "padroes": [
            "round\\s*\\(",
            "\\.\\d+f"
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Saída formatada",
          "padroes": [
            "f[\\\"\\']",
            "\\.format\\s*\\("
          ]
        }
      ]
    },
    "files": [
      {
        "filename": "main.py",
        "language": "python"
      }
    ]
  },
  "introducao-programacao:3": {
    "subject": "introducao-programacao",
    "numero": 3,
    "titulo": "Exercício 03 - Condições com if e else em Python",
    "objetivo": "Criar um verificador de acesso que escolha entre duas respostas usando if e else.",
    "modulo": "Python",
    "conceitos": [
      "if",
      "else",
      ">=",
      "dois-pontos",
      "indentação",
      "int()",
      "f-strings"
    ],
    "passos": [
      {
        "titulo": "Entradas e valor de referência",
        "arquivo": "main.py",
        "linhas": [
          1,
          4
        ],
        "explicacao": "Receba o nome e a idade. Depois, guarde a idade mínima em uma variável para não repetir um número solto pelo código.",
        "resultado": "O programa possui os dados necessários para fazer a decisão."
      },
      {
        "titulo": "Criando a condição com if",
        "arquivo": "main.py",
        "linhas": [
          8,
          10
        ],
        "explicacao": "Use if para verificar se a idade é maior ou igual à idade mínima. Observe os dois-pontos e a indentação do bloco verdadeiro.",
        "resultado": "Idades iguais ou superiores a 14 recebem a mensagem de acesso liberado."
      },
      {
        "titulo": "Criando o caminho alternativo com else",
        "arquivo": "main.py",
        "linhas": [
          11,
          14
        ],
        "explicacao": "Use else para executar o segundo caminho quando a condição for falsa. Calcule quantos anos faltam e mostre a informação.",
        "resultado": "Idades inferiores a 14 recebem a mensagem alternativa e o cálculo correto."
      },
      {
        "titulo": "Executando os dois caminhos",
        "arquivo": "main.py",
        "linhas": [
          6,
          14
        ],
        "explicacao": "Execute uma vez com idade 15 e outra com idade 12. Depois provoque um erro retirando os dois-pontos ou a indentação e leia o traceback.",
        "resultado": "O aluno confirma que apenas um bloco é executado em cada teste e compreende os erros principais."
      }
    ],
    "arquivosFornecidos": [],
    "validacao": {
      "minChars": 180,
      "regras": [
        {
          "arquivo": "main.py",
          "rotulo": "Entrada do nome e da idade",
          "padroes": [
            "(?:input\\s*\\([^)]*\\).*?){2}"
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Conversão da idade para inteiro",
          "padroes": [
            "\\bint\\s*\\("
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Condição if com comparação",
          "padroes": [
            "\\bif\\s+[^\\n:]+(?:>=|>|==|<=|<)[^\\n:]*:"
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Caminho alternativo com else",
          "padroes": [
            "\\belse\\s*:"
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Saída nos dois caminhos",
          "padroes": [
            "(?:\\bprint\\s*\\([^\\n]*\\).*?){2}"
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Mensagem formatada ou personalizada",
          "padroes": [
            "f[\\\"\\']",
            "\\.format\\s*\\("
          ]
        }
      ]
    },
    "files": [
      {
        "filename": "main.py",
        "language": "python"
      }
    ]
  },
  "introducao-programacao:4": {
    "subject": "introducao-programacao",
    "numero": 4,
    "titulo": "Exercício 04 - Condições com if, elif e else em Python",
    "objetivo": "Calcular a média de duas notas e escolher entre Aprovado, Recuperação e Reprovado usando if, elif e else.",
    "modulo": "Python",
    "conceitos": [
      "if",
      "elif",
      "else",
      ">=",
      "ordem das condições",
      "dois-pontos",
      "indentação",
      "float()",
      "f-strings"
    ],
    "passos": [
      {
        "titulo": "Entradas e cálculo da média",
        "arquivo": "main.py",
        "linhas": [
          1,
          6
        ],
        "explicacao": "Receba o nome e as duas notas, converta os valores para float e calcule a média. O replace permite digitar notas com vírgula.",
        "resultado": "O programa possui uma média numérica pronta para ser classificada."
      },
      {
        "titulo": "Primeiro caminho com if",
        "arquivo": "main.py",
        "linhas": [
          8,
          9
        ],
        "explicacao": "A primeira condição verifica o maior intervalo. Quando a média for igual ou superior a 7, a situação será Aprovado.",
        "resultado": "Médias a partir de 7 entram no primeiro bloco."
      },
      {
        "titulo": "Caminho intermediário com elif",
        "arquivo": "main.py",
        "linhas": [
          10,
          11
        ],
        "explicacao": "O elif só é analisado quando o if foi falso. Como médias 7 ou maiores já foram tratadas, verificar media >= 5 identifica a faixa de recuperação.",
        "resultado": "Médias de 5 até valores menores que 7 recebem Recuperação."
      },
      {
        "titulo": "Caminho final com else",
        "arquivo": "main.py",
        "linhas": [
          12,
          13
        ],
        "explicacao": "O else não possui nova condição. Ele cobre tudo o que não passou pelo if nem pelo elif: médias inferiores a 5.",
        "resultado": "Médias abaixo de 5 recebem Reprovado."
      },
      {
        "titulo": "Saída e três testes",
        "arquivo": "main.py",
        "linhas": [
          15,
          18
        ],
        "explicacao": "Mostre nome, média e situação. Execute uma vez para cada caminho e depois provoque SyntaxError, IndentationError e ValueError.",
        "resultado": "Os três resultados são confirmados e os principais erros são interpretados."
      }
    ],
    "arquivosFornecidos": [],
    "validacao": {
      "minChars": 210,
      "regras": [
        {
          "arquivo": "main.py",
          "rotulo": "Nome e duas notas",
          "padroes": [
            "(?:input\\s*\\([^)]*\\).*?){3}"
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Conversão das notas para decimal",
          "padroes": [
            "(?:\\bfloat\\s*\\([^\\n]*\\).*?){2}"
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Cálculo da média",
          "padroes": [
            "=\\s*\\(?[^\\n=]+\\+[^\\n=]+\\)?\\s*\\/\\s*2",
            "sum\\s*\\([^)]*\\)\\s*\\/\\s*2"
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Primeiro caminho com if",
          "padroes": [
            "\\bif\\s+[^\\n:]+(?:>=|>|==|<=|<)[^\\n:]*:"
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Caminho intermediário com elif",
          "padroes": [
            "\\belif\\s+[^\\n:]+(?:>=|>|==|<=|<)[^\\n:]*:"
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Caminho final com else",
          "padroes": [
            "\\belse\\s*:"
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Três situações possíveis",
          "padroes": [
            "aprovad",
            "recupera",
            "reprovad"
          ],
          "modo": "todos"
        },
        {
          "arquivo": "main.py",
          "rotulo": "Saída formatada",
          "padroes": [
            "f[\\\"\\']",
            "\\.format\\s*\\("
          ]
        }
      ]
    },
    "files": [
      {
        "filename": "main.py",
        "language": "python"
      }
    ]
  },
  "introducao-programacao:5": {
    "subject": "introducao-programacao",
    "numero": 5,
    "titulo": "Exercício 05 - Operadores lógicos e validações em Python",
    "objetivo": "Combinar idade, ingresso e autorização usando and, or e not, validando dados antes de liberar o acesso a um evento.",
    "modulo": "Python",
    "conceitos": [
      "and",
      "or",
      "not",
      "booleanos",
      "validação de dados",
      "if",
      "elif",
      "else",
      "int()",
      "f-strings"
    ],
    "passos": [
      {
        "titulo": "Entradas do controle de acesso",
        "arquivo": "main.py",
        "linhas": [
          1,
          5
        ],
        "explicacao": "Receba nome, idade, informação sobre o ingresso e autorização. Observe que a idade precisa ser convertida para inteiro.",
        "resultado": "O programa possui os dados necessários para tomar a decisão."
      },
      {
        "titulo": "Transformando respostas em booleanos",
        "arquivo": "main.py",
        "linhas": [
          7,
          10
        ],
        "explicacao": "Converta as respostas s/sim em valores booleanos e registre também se cada resposta pertence ao conjunto permitido.",
        "resultado": "O programa diferencia resposta verdadeira de resposta inválida."
      },
      {
        "titulo": "Validando com or e not",
        "arquivo": "main.py",
        "linhas": [
          12,
          13
        ],
        "explicacao": "Use or para reunir diferentes situações inválidas e not para negar a validade de uma resposta.",
        "resultado": "Dados impossíveis ou respostas desconhecidas são identificados antes das regras de acesso."
      },
      {
        "titulo": "Combinando critérios com and",
        "arquivo": "main.py",
        "linhas": [
          14,
          19
        ],
        "explicacao": "Adultos precisam de ingresso. Adolescentes de 14 a 17 anos precisam de ingresso e autorização. Compare os caminhos do if, elif e else.",
        "resultado": "O acesso é decidido a partir de mais de um critério ao mesmo tempo."
      },
      {
        "titulo": "Exibindo resultado e motivo",
        "arquivo": "main.py",
        "linhas": [
          21,
          27
        ],
        "explicacao": "Apresente participante, idade e resultado. Quando não houver ingresso, mostre também o motivo sem alterar casos de dados inválidos.",
        "resultado": "O terminal explica claramente a decisão tomada."
      },
      {
        "titulo": "Executando cenários",
        "arquivo": "main.py",
        "linhas": [
          1,
          27
        ],
        "explicacao": "Teste adulto, adolescente autorizado, adolescente sem autorização e dados inválidos. Depois provoque erros de conversão e indentação.",
        "resultado": "O aluno compara and, or e not em situações diferentes."
      }
    ],
    "arquivosFornecidos": [],
    "validacao": {
      "minChars": 430,
      "regras": [
        {
          "arquivo": "main.py",
          "rotulo": "Entrada numérica de idade",
          "padroes": [
            "\\bint\\s*\\([^\\n]*input\\s*\\(",
            "\\binput\\s*\\([^)]*\\)[\\s\\S]*?\\bint\\s*\\("
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Quatro entradas de dados",
          "padroes": [
            "(?:(?:\\binput\\s*\\()[\\s\\S]*?){4}"
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Operadores lógicos",
          "padroes": [
            "\\band\\b",
            "\\bor\\b",
            "\\bnot\\b"
          ],
          "modo": "todos"
        },
        {
          "arquivo": "main.py",
          "rotulo": "Decisão com if, elif e else",
          "padroes": [
            "\\bif\\s+[^\\n:]+:",
            "\\belif\\s+[^\\n:]+:",
            "\\belse\\s*:"
          ],
          "modo": "todos"
        },
        {
          "arquivo": "main.py",
          "rotulo": "Validação de respostas",
          "padroes": [
            "\\bin\\s*\\([^\\n]+\\)",
            "Dados inválidos"
          ],
          "modo": "todos"
        },
        {
          "arquivo": "main.py",
          "rotulo": "Resultados de acesso",
          "padroes": [
            "Entrada liberada",
            "Entrada liberada com autorização",
            "Entrada não permitida"
          ],
          "modo": "todos"
        },
        {
          "arquivo": "main.py",
          "rotulo": "Saída no terminal",
          "padroes": [
            "\\bprint\\s*\\(",
            "f[\"\\']"
          ]
        }
      ]
    },
    "files": [
      {
        "filename": "main.py",
        "language": "python"
      }
    ]
  },
  "introducao-programacao:6": {
    "subject": "introducao-programacao",
    "numero": 6,
    "titulo": "Exercício 06 - Repetição com for em Python",
    "objetivo": "Criar uma tabuada configurável usando for e range(), entendendo a variável de controle e o limite final exclusivo.",
    "modulo": "Python",
    "conceitos": [
      "for",
      "range()",
      "variável de controle",
      "repetição",
      "int()",
      "if",
      "else",
      "indentação",
      "f-strings"
    ],
    "passos": [
      {
        "titulo": "Entradas e conversões",
        "arquivo": "main.py",
        "linhas": [
          1,
          4
        ],
        "explicacao": "Receba o número da tabuada e os limites do intervalo. Use int() porque os valores controlarão a sequência e as multiplicações.",
        "resultado": "O programa possui três números inteiros para construir a tabuada."
      },
      {
        "titulo": "Validação do intervalo",
        "arquivo": "main.py",
        "linhas": [
          6,
          9
        ],
        "explicacao": "Retome if e else para impedir um intervalo invertido. Se o início for maior que o fim, mostre uma orientação clara.",
        "resultado": "Intervalos inválidos não entram no laço de repetição."
      },
      {
        "titulo": "Laço for e função range",
        "arquivo": "main.py",
        "linhas": [
          11,
          11
        ],
        "explicacao": "O for atribui a cada repetição um valor à variável multiplicador. O range começa em inicio e para antes do limite final.",
        "resultado": "O programa percorre uma sequência de multiplicadores."
      },
      {
        "titulo": "Incluindo o último valor",
        "arquivo": "main.py",
        "linhas": [
          11,
          11
        ],
        "explicacao": "Use fim + 1 porque o segundo limite do range é exclusivo. Assim, o multiplicador final informado pelo usuário também aparece.",
        "resultado": "A sequência inclui o último multiplicador solicitado."
      },
      {
        "titulo": "Cálculo e saída repetida",
        "arquivo": "main.py",
        "linhas": [
          12,
          13
        ],
        "explicacao": "Dentro do bloco indentado, calcule o produto e mostre uma linha da tabuada. Essas duas instruções serão repetidas pelo for.",
        "resultado": "O terminal apresenta todas as multiplicações do intervalo."
      },
      {
        "titulo": "Execução e leitura de erros",
        "arquivo": "main.py",
        "linhas": [
          1,
          13
        ],
        "explicacao": "Execute vários intervalos. Depois remova dois-pontos, indentação ou digite texto em um campo numérico para interpretar SyntaxError, IndentationError e ValueError.",
        "resultado": "O aluno entende o funcionamento e consegue corrigir erros comuns do laço."
      }
    ],
    "arquivosFornecidos": [],
    "validacao": {
      "minChars": 210,
      "regras": [
        {
          "arquivo": "main.py",
          "rotulo": "Três entradas numéricas",
          "padroes": [
            "(?:[\\s\\S]*?input\\s*\\(){3}"
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Conversão para inteiro",
          "padroes": [
            "\\bint\\s*\\("
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Estrutura for",
          "padroes": [
            "\\bfor\\s+[A-Za-z_][A-Za-z0-9_]*\\s+in\\s+"
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Uso da função range",
          "padroes": [
            "\\brange\\s*\\("
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Inclusão do limite final",
          "padroes": [
            "range\\s*\\([^\\n)]*(?:[A-Za-z_][A-Za-z0-9_]*\\s*\\+\\s*1|1\\s*\\+\\s*[A-Za-z_][A-Za-z0-9_]*)",
            "(?:\\+=\\s*1|=\\s*[A-Za-z_][A-Za-z0-9_]*\\s*\\+\\s*1)[\\s\\S]*?range\\s*\\("
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Multiplicação dentro do exercício",
          "padroes": [
            "\\*"
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Validação com if e else",
          "padroes": [
            "\\bif\\s+[^\\n:]+:",
            "\\belse\\s*:"
          ],
          "modo": "todos"
        },
        {
          "arquivo": "main.py",
          "rotulo": "Saída formatada",
          "padroes": [
            "f[\\\"\\']",
            "\\.format\\s*\\("
          ]
        }
      ]
    },
    "files": [
      {
        "filename": "main.py",
        "language": "python"
      }
    ]
  },
  "introducao-programacao:7": {
    "subject": "introducao-programacao",
    "numero": 7,
    "titulo": "Exercício 07 - Contadores e acumuladores em Python",
    "objetivo": "Registrar pedidos de uma lanchonete, acumular o total vendido e contar pedidos pequenos, médios e grandes durante um laço for.",
    "modulo": "Python",
    "conceitos": [
      "for",
      "range()",
      "contador",
      "acumulador",
      "+=",
      "ticket médio",
      "if",
      "elif",
      "else",
      "int()",
      "float()",
      "f-strings"
    ],
    "passos": [
      {
        "titulo": "Quantidade e valores iniciais",
        "arquivo": "main.py",
        "linhas": [
          1,
          7
        ],
        "explicacao": "Receba a quantidade de pedidos e inicialize o acumulador de vendas e os três contadores antes do laço.",
        "resultado": "As variáveis começam prontas para registrar as vendas."
      },
      {
        "titulo": "Validando a quantidade",
        "arquivo": "main.py",
        "linhas": [
          9,
          12
        ],
        "explicacao": "Use if e else para impedir a execução quando não existir pelo menos um pedido.",
        "resultado": "Somente quantidades positivas iniciam a repetição."
      },
      {
        "titulo": "Repetindo os pedidos",
        "arquivo": "main.py",
        "linhas": [
          12,
          14
        ],
        "explicacao": "Use for e range para solicitar o valor de cada pedido.",
        "resultado": "Cada pedido possui uma entrada própria no terminal."
      },
      {
        "titulo": "Acumulando as vendas",
        "arquivo": "main.py",
        "linhas": [
          14,
          14
        ],
        "explicacao": "total_vendas += valor adiciona cada novo pedido ao valor total já armazenado.",
        "resultado": "Ao final do laço, o acumulador contém o total vendido."
      },
      {
        "titulo": "Contando por faixa de valor",
        "arquivo": "main.py",
        "linhas": [
          16,
          22
        ],
        "explicacao": "Use if, elif e else para aumentar apenas um dos contadores: pequeno, médio ou grande.",
        "resultado": "Cada pedido é contado em exatamente uma faixa."
      },
      {
        "titulo": "Calculando o ticket médio",
        "arquivo": "main.py",
        "linhas": [
          24,
          31
        ],
        "explicacao": "Depois do laço, divida o total vendido pela quantidade e mostre o resumo financeiro e os contadores.",
        "resultado": "O terminal apresenta total, ticket médio e distribuição dos pedidos."
      },
      {
        "titulo": "Executando e corrigindo erros",
        "arquivo": "main.py",
        "linhas": [
          1,
          31
        ],
        "explicacao": "Teste valores em várias faixas, inclusive 20 e 50. Depois provoque ValueError e IndentationError.",
        "resultado": "O aluno distingue repetição, acumulação e contagem em um contexto comercial."
      }
    ],
    "arquivosFornecidos": [],
    "validacao": {
      "minChars": 360,
      "regras": [
        {
          "arquivo": "main.py",
          "rotulo": "Entrada da quantidade",
          "padroes": [
            "\\bint\\s*\\([^\\n]*input\\s*\\("
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Entrada repetida de valor",
          "padroes": [
            "\\bfloat\\s*\\([^\\n]*input\\s*\\(",
            "\\binput\\s*\\([^)]*\\)[\\s\\S]*?\\bfloat\\s*\\("
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Estrutura for com range",
          "padroes": [
            "\\bfor\\s+[A-Za-z_][A-Za-z0-9_]*\\s+in\\s+range\\s*\\("
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Uso de acumulador",
          "padroes": [
            "(?:([A-Za-z_][A-Za-z0-9_]*)\\s*\\+=\\s*[A-Za-z_][A-Za-z0-9_]*|([A-Za-z_][A-Za-z0-9_]*)\\s*=\\s*\\2\\s*\\+\\s*[A-Za-z_][A-Za-z0-9_]*)"
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Pelo menos três contagens",
          "padroes": [
            "(?:(?:[A-Za-z_][A-Za-z0-9_]*\\s*\\+=\\s*1|([A-Za-z_][A-Za-z0-9_]*)\\s*=\\s*\\1\\s*\\+\\s*1)[\\s\\S]*?){3}"
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Decisão em três faixas",
          "padroes": [
            "\\bif\\s+[^\\n:]+:",
            "\\belif\\s+[^\\n:]+:",
            "\\belse\\s*:"
          ],
          "modo": "todos"
        },
        {
          "arquivo": "main.py",
          "rotulo": "Cálculo de média por pedido",
          "padroes": [
            "[A-Za-z_][A-Za-z0-9_]*\\s*=\\s*[A-Za-z_][A-Za-z0-9_]*\\s*/\\s*[A-Za-z_][A-Za-z0-9_]*"
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Resumo financeiro",
          "padroes": [
            "Total vendido",
            "Ticket médio",
            "Pedidos pequenos",
            "Pedidos médios",
            "Pedidos grandes"
          ],
          "modo": "todos"
        }
      ]
    },
    "files": [
      {
        "filename": "main.py",
        "language": "python"
      }
    ]
  },
  "introducao-programacao:8": {
    "subject": "introducao-programacao",
    "numero": 8,
    "titulo": "Exercício 08 - Repetição com while em Python",
    "objetivo": "Repetir a solicitação de senha enquanto houver tentativas e o acesso ainda não estiver liberado.",
    "modulo": "Python",
    "conceitos": [
      "while",
      "contador",
      "booleano",
      "and",
      "not",
      "+=",
      "if",
      "else",
      "condição de continuidade"
    ],
    "passos": [
      {
        "titulo": "Dados iniciais do controle",
        "arquivo": "main.py",
        "linhas": [
          1,
          5
        ],
        "explicacao": "Defina a senha didática, o limite, o contador e o valor booleano que registra o acesso.",
        "resultado": "O programa começa com três tentativas e acesso ainda não liberado."
      },
      {
        "titulo": "Condição do while",
        "arquivo": "main.py",
        "linhas": [
          7,
          8
        ],
        "explicacao": "O while continua somente enquanto restarem tentativas e o acesso continuar falso. O operador not inverte o valor booleano.",
        "resultado": "A entrada de senha se repete apenas quando necessário."
      },
      {
        "titulo": "Verificando a senha",
        "arquivo": "main.py",
        "linhas": [
          10,
          13
        ],
        "explicacao": "Quando a senha é igual à senha correta, altere o booleano. Caso contrário, siga para a contagem do erro.",
        "resultado": "A condição diferencia tentativa correta de tentativa incorreta."
      },
      {
        "titulo": "Contando tentativas",
        "arquivo": "main.py",
        "linhas": [
          13,
          17
        ],
        "explicacao": "Use += 1 para aumentar o contador e calcule quantas tentativas ainda restam.",
        "resultado": "Cada erro aproxima o programa do limite definido."
      },
      {
        "titulo": "Exibindo tentativas restantes",
        "arquivo": "main.py",
        "linhas": [
          16,
          17
        ],
        "explicacao": "Mostre a mensagem intermediária apenas quando ainda existir outra tentativa.",
        "resultado": "O terminal orienta o usuário sem anunciar um número negativo."
      },
      {
        "titulo": "Resultado final",
        "arquivo": "main.py",
        "linhas": [
          19,
          22
        ],
        "explicacao": "Depois que o while termina, verifique por que ele terminou e apresente sucesso ou bloqueio.",
        "resultado": "O programa distingue encerramento por acerto e encerramento pelo limite."
      },
      {
        "titulo": "Executando e investigando falhas",
        "arquivo": "main.py",
        "linhas": [
          1,
          22
        ],
        "explicacao": "Teste acertos e erros. Depois, remova a atualização do contador para entender um laço infinito e use o botão Interromper.",
        "resultado": "O aluno compreende a condição de continuidade e sabe interromper uma repetição incorreta."
      }
    ],
    "arquivosFornecidos": [],
    "validacao": {
      "minChars": 280,
      "regras": [
        {
          "arquivo": "main.py",
          "rotulo": "Entrada de senha",
          "padroes": [
            "\\binput\\s*\\("
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Estrutura while",
          "padroes": [
            "\\bwhile\\s+[^\\n:]+:"
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Controle de tentativas",
          "padroes": [
            "(?:[A-Za-z_][A-Za-z0-9_]*\\s*\\+=\\s*1|([A-Za-z_][A-Za-z0-9_]*)\\s*=\\s*\\1\\s*\\+\\s*1)"
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Comparação de senha",
          "padroes": [
            "=="
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Decisão com if e else",
          "padroes": [
            "\\bif\\s+[^\\n:]+:",
            "\\belse\\s*:"
          ],
          "modo": "todos"
        },
        {
          "arquivo": "main.py",
          "rotulo": "Controle de encerramento",
          "padroes": [
            "\\bnot\\b",
            "\\bbreak\\b"
          ]
        },
        {
          "arquivo": "main.py",
          "rotulo": "Mensagens no terminal",
          "padroes": [
            "\\bprint\\s*\\(",
            "f[\"\\']"
          ]
        }
      ]
    },
    "files": [
      {
        "filename": "main.py",
        "language": "python"
      }
    ]
  },
  "programacao-front-end:1": {
    "subject": "programacao-front-end",
    "numero": 1,
    "titulo": "Exercício 01 — Alterando HTML com JavaScript",
    "objetivo": "Alterar um texto da página ao clicar em um botão.",
    "tema": "Primeira interação com o DOM",
    "retomadas": [
      "HTML e CSS básicos"
    ],
    "novos": [
      "função",
      "onclick",
      "getElementById",
      "innerText"
    ],
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
          "exemplo": "function alterarTexto() {",
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
          "exemplo": "document.getElementById(\"mensagem\").innerText =\n        \"O texto foi alterado usando JavaScript!\";"
        }
      ]
    },
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-front-end:2": {
    "subject": "programacao-front-end",
    "numero": 2,
    "titulo": "Exercício 02 — Modo Claro e Modo Escuro com JavaScript",
    "objetivo": "Alternar cores da página por meio de dois botões.",
    "tema": "Alteração visual da página",
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
          "exemplo": "function modoClaro() {\n    document.body.style.backgroundColor = \"white\";\n    document.body.style.color = \"black\";\n\n    document.getElementById(\"mensagem\").innerText =\n        \"Modo claro ativado!\";\n}",
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
          "exemplo": "function modoEscuro() {\n    document.body.style.backgroundColor = \"black\";\n    document.body.style.color = \"white\";\n\n    document.getElementById(\"mensagem\").innerText =\n        \"Modo escuro ativado!\";\n}"
        }
      ]
    },
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-front-end:3": {
    "subject": "programacao-front-end",
    "numero": 3,
    "titulo": "Exercício 03 — Alterando Tamanho, Fonte e Estilo do Texto",
    "objetivo": "Alterar três propriedades visuais de um texto.",
    "tema": "Manipulação direta de estilos",
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
          "exemplo": "function aumentarTexto() {\n    document.getElementById(\"mensagem\")\n        .style.fontSize = \"30px\";\n}",
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
          "exemplo": "function mudarFonte() {\n    document.getElementById(\"mensagem\")\n        .style.fontFamily = \"Courier New\";\n}"
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
          "exemplo": "function negritoTexto() {\n    document.getElementById(\"mensagem\")\n        .style.fontWeight = \"bold\";\n}",
          "comparacao": "Nome no JavaScript: No JavaScript, a mesma propriedade usa camelCase."
        }
      ]
    },
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-front-end:4": {
    "subject": "programacao-front-end",
    "numero": 4,
    "titulo": "Exercício 04 — Capturando Nome com Input",
    "objetivo": "Capturar um texto digitado e montar uma mensagem personalizada.",
    "tema": "Entrada de dados",
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
          "exemplo": "function mostrarNome() {\n    let nome = document.getElementById(\"nome\").value;",
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
          "exemplo": "document.getElementById(\"mensagem\").innerText =\n        \"Bem-vindo, \" + nome + \"!\";"
        }
      ]
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-front-end:5": {
    "subject": "programacao-front-end",
    "numero": 5,
    "titulo": "Exercício 05 — Contador de Cliques com JavaScript",
    "objetivo": "Controlar uma variável numérica e atualizar seu valor na página.",
    "tema": "Estado numérico",
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
          "exemplo": "let contador = 0;",
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
          "exemplo": "function atualizarContador() {\n    document.getElementById(\"contador\").innerText = contador;\n}"
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
          "exemplo": "function aumentar() {\n    contador++;\n    atualizarContador();\n}\n\nfunction diminuir() {\n    contador--;\n    atualizarContador();",
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
          "exemplo": "function zerar() {\n    contador = 0;\n    atualizarContador();\n}"
        }
      ]
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-front-end:6": {
    "subject": "programacao-front-end",
    "numero": 6,
    "titulo": "Exercício 06 — Calculadora Simples com JavaScript",
    "objetivo": "Capturar dois números e executar quatro operações.",
    "tema": "Operações matemáticas",
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
          "exemplo": "function pegarValores() {\n    let n1 = Number(document.getElementById(\"num1\").value);\n    let n2 = Number(document.getElementById(\"num2\").value);\n    return { n1, n2 };\n}",
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
          "exemplo": "function somar() {\n    let valores = pegarValores();\n    document.getElementById(\"resultado\").innerText = \"Resultado: \" +\n        (valores.n1 + valores.n2);\n}\n\nfunction subtrair() {\n    let valores = pegarValores();"
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
          "exemplo": "function multiplicar() {\n    let valores = pegarValores();\n    document.getElementById(\"resultado\").innerText = \"Resultado: \" +\n        (valores.n1 * valores.n2);\n}",
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
          "exemplo": "function dividir() {\n    let valores = pegarValores();\n    if (valores.n2 === 0) {\n        document.getElementById(\"resultado\").innerText =\n            \"Resultado: divisão por zero não permitida\";\n    } else {\n        document.getElementById(\"resultado\").innerText = \"Resultado: \" +\n            (valores.n1 / valores.n2);"
        }
      ]
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-front-end:7": {
    "subject": "programacao-front-end",
    "numero": 7,
    "titulo": "Exercício 07 — Conversor de Temperatura com JavaScript",
    "objetivo": "Converter Celsius em Fahrenheit ou Kelvin.",
    "tema": "Aplicação de fórmulas",
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
          "exemplo": "function converterFahrenheit() {\n    let celsius = Number(document.getElementById(\"celsius\").value);\n\n    let fahrenheit = (celsius * 9 / 5) + 32;\n\n    document.getElementById(\"resultado\").innerText =\n        \"Resultado: \" + fahrenheit + \" °F\";",
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
          "exemplo": "function converterKelvin() {\n    let celsius = Number(document.getElementById(\"celsius\").value);\n\n    let kelvin = celsius + 273.15;\n\n    document.getElementById(\"resultado\").innerText ="
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
          "exemplo": "}\n\nfunction limpar() {\n    document.getElementById(\"celsius\").value = \"\";",
          "comparacao": "Valor transformado: A fórmula cria uma nova representação da mesma grandeza."
        }
      ]
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-front-end:8": {
    "subject": "programacao-front-end",
    "numero": 8,
    "titulo": "Exercício 08 — Média e Situação do Aluno com JavaScript",
    "objetivo": "Calcular a média e classificar a situação do aluno.",
    "tema": "Condições encadeadas",
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
          "exemplo": "function calcularMedia() {\n    let nota1 = Number(document.getElementById(\"nota1\").value);\n    let nota2 = Number(document.getElementById(\"nota2\").value);\n\n    let media = (nota1 + nota2) / 2;\n    let situacao = \"\";",
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
          "exemplo": "if (media >= 7) {\n        situacao = \"Aprovado\";\n    } else if (media >= 5) {\n        situacao = \"Recuperação\";\n    } else {\n        situacao = \"Reprovado\";\n    }"
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
          "exemplo": "document.getElementById(\"resultado\").innerText =\n        \"Média: \" + media + \" - Situação: \" + situacao;",
          "comparacao": "Classificação: Transforma o número em uma situação compreensível."
        }
      ]
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-front-end:9": {
    "subject": "programacao-front-end",
    "numero": 9,
    "titulo": "Exercício 09 — Validação de Campo com JavaScript",
    "objetivo": "Verificar se um nome foi preenchido corretamente.",
    "tema": "Validação de entrada",
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
          "exemplo": "function validarCampo() {\n    let nome = document.getElementById(\"nome\").value.trim();\n    let mensagem = \"\";",
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
          "exemplo": "if (nome === \"\") {\n        mensagem = \"O campo nome está vazio.\";\n    } else if (nome.length < 3) {\n        mensagem = \"Digite pelo menos 3 caracteres.\";\n    } else {\n        mensagem = \"Campo preenchido corretamente!\";\n    }"
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
          "exemplo": "document.getElementById(\"mensagem\").innerText =\n        \"Mensagem: \" + mensagem;",
          "comparacao": "Texto tratado: Remove espaços externos antes de validar o tamanho."
        }
      ]
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-front-end:10": {
    "subject": "programacao-front-end",
    "numero": 10,
    "titulo": "Exercício 10 — Login Simples com Condição em JavaScript",
    "objetivo": "Validar um login didático em três situações.",
    "tema": "Condições e operadores lógicos",
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
          "exemplo": "function verificarLogin() {\n    let usuario = document.getElementById(\"usuario\").value.trim();\n    let senha = document.getElementById(\"senha\").value.trim();\n    let resultado = document.getElementById(\"resultado\");",
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
          "exemplo": "if (usuario === \"\" || senha === \"\") {\n        resultado.innerText = \"Resultado: preencha o usuário e a senha.\";\n        resultado.style.color = \"#b26a00\";"
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
          "exemplo": "} else if (usuario === \"aluno\" && senha === \"1234\") {\n        resultado.innerText = \"Resultado: acesso permitido!\";\n        resultado.style.color = \"green\";",
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
          "exemplo": "} else {\n        resultado.innerText = \"Resultado: usuário ou senha incorretos.\";\n        resultado.style.color = \"red\";\n    }"
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
          "exemplo": "function limparCampos() {\n    document.getElementById(\"usuario\").value = \"\";\n    document.getElementById(\"senha\").value = \"\";\n    document.getElementById(\"resultado\").innerText = \"Resultado: \";\n    document.getElementById(\"resultado\").style.color = \"#333\";\n    document.getElementById(\"usuario\").focus();\n}",
          "comparacao": "OU lógico: Basta uma das comparações ser verdadeira."
        }
      ]
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-front-end:11": {
    "subject": "programacao-front-end",
    "numero": 11,
    "titulo": "Exercício 11 — Contador com Laço de Repetição em JavaScript",
    "objetivo": "Gerar uma contagem de 1 até o número informado usando o laço for.",
    "tema": "Laço for e repetição controlada",
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
          "exemplo": "function gerarContagem() {\n    let limiteDigitado = document.getElementById(\"limite\").value;\n    let mensagem = document.getElementById(\"mensagem\");\n    let resultado = document.getElementById(\"resultado\");\n\n    resultado.innerText = \"\";",
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
          "exemplo": "if (limiteDigitado === \"\") {\n        mensagem.innerText = \"Digite o número final da contagem.\";\n        mensagem.style.color = \"#b3261e\";\n        return;\n    }"
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
          "exemplo": "let limite = Number(limiteDigitado);\n\n    if (limite < 1 || limite > 100) {\n        mensagem.innerText = \"Digite um número entre 1 e 100.\";\n        mensagem.style.color = \"#b3261e\";\n        return;",
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
          "exemplo": "let contagem = \"\";\n\n    for (let numero = 1; numero <= limite; numero++) {\n        contagem += numero;\n\n        if (numero < limite) {\n            contagem += \" - \";\n        }"
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
          "exemplo": "mensagem.innerText = \"Contagem gerada com sucesso!\";\n    mensagem.style.color = \"green\";\n    resultado.innerText = contagem;\n}\n\nfunction limparCampos() {\n    document.getElementById(\"limite\").value = \"\";\n    document.getElementById(\"mensagem\").innerText =",
          "comparacao": "Repetição com for: Adapta a quantidade de repetições ao valor informado."
        }
      ]
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-front-end:12": {
    "subject": "programacao-front-end",
    "numero": 12,
    "titulo": "Exercício 12 — Identificando Tipos de Dados com JavaScript",
    "objetivo": "Capturar três tipos de valores e identificar o tipo de cada um com typeof.",
    "tema": "String, number, boolean e typeof",
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
          "exemplo": "function analisarDados() {\n    let nome = document.getElementById(\"nome\").value.trim();\n    let idadeDigitada = document.getElementById(\"idade\").value;\n    let idade = Number(idadeDigitada);\n    let estudante = document.getElementById(\"estudante\").checked;",
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
          "exemplo": "let mensagem = document.getElementById(\"mensagem\");\n    let resultadoNome = document.getElementById(\"resultadoNome\");\n    let resultadoIdade = document.getElementById(\"resultadoIdade\");\n    let resultadoEstudante = document.getElementById(\"resultadoEstudante\");"
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
          "exemplo": "if (nome === \"\" || idadeDigitada === \"\") {\n        mensagem.innerText = \"Preencha o nome e a idade antes de analisar.\";\n        mensagem.style.color = \"#b3261e\";\n        resultadoNome.innerText = \"\";\n        resultadoIdade.innerText = \"\";\n        resultadoEstudante.innerText = \"\";\n        return;\n    }",
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
          "exemplo": "mensagem.innerText = \"Dados analisados com sucesso!\";\n    mensagem.style.color = \"green\";\n\n    resultadoNome.innerText =\n        \"Nome: \" + nome + \" | Tipo: \" + typeof nome;\n\n    resultadoIdade.innerText =\n        \"Idade: \" + idade + \" | Tipo: \" + typeof idade;"
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
          "exemplo": "function limparCampos() {\n    document.getElementById(\"nome\").value = \"\";\n    document.getElementById(\"idade\").value = \"\";\n    document.getElementById(\"estudante\").checked = false;\n\n    document.getElementById(\"mensagem\").innerText =\n        \"Preencha os campos e clique em “Analisar dados”.\";\n    document.getElementById(\"mensagem\").style.color = \"#52606d\";",
          "comparacao": "Tipo: Informa a categoria do valor, neste caso number."
        }
      ]
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-front-end:13": {
    "subject": "programacao-front-end",
    "numero": 13,
    "titulo": "Exercício 13 — Trabalhando com var, let e const em JavaScript",
    "objetivo": "Comparar var, let e const em um painel que altera valores e mantém um limite fixo.",
    "tema": "Declaração, reatribuição e constantes",
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
          "exemplo": "var projeto = \"Projeto Front-End\";\nlet pontos = 0;\nconst LIMITE_PONTOS = 50;\nconst TURMA = \"2DS\";",
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
          "exemplo": "function atualizarPainel() {\n    let novoNome = document.getElementById(\"nomeProjeto\").value.trim();\n    let valorDigitado = document.getElementById(\"pontosAdicionar\").value;\n    let quantidade = Number(valorDigitado);\n    var mensagem = document.getElementById(\"mensagem\");"
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
          "exemplo": "if (novoNome === \"\" || valorDigitado === \"\") {\n        mensagem.innerText = \"Preencha o nome do projeto e os pontos.\";\n        mensagem.style.color = \"#b3261e\";\n        return;\n    }\n\n    if (quantidade <= 0) {\n        mensagem.innerText = \"Digite uma quantidade maior que zero.\";",
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
          "exemplo": "pontos += quantidade;\n\n    if (pontos >= LIMITE_PONTOS) {\n        pontos = LIMITE_PONTOS;\n        mensagem.innerText = \"O limite de pontos foi atingido.\";\n        mensagem.style.color = \"#b26a00\";\n    } else {\n        mensagem.innerText = \"Os valores de var e let foram atualizados.\";"
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
          "exemplo": "document.getElementById(\"valorLet\").innerText = pontos;\n    document.getElementById(\"valorConst\").innerText = LIMITE_PONTOS;\n    document.getElementById(\"resumo\").innerText =\n        \"Turma: \" + TURMA + \" | Projeto: \" + projeto +\n        \" | Pontos: \" + pontos + \" de \" + LIMITE_PONTOS;\n}\n\nfunction reiniciarPainel() {",
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
          "exemplo": "pontos = 0;\n\n    document.getElementById(\"nomeProjeto\").value = \"\";\n    document.getElementById(\"pontosAdicionar\").value = \"\";\n    document.getElementById(\"mensagem\").innerText =\n        \"Preencha os campos para testar as variáveis.\";\n    document.getElementById(\"mensagem\").style.color = \"#52606d\";\n"
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
          "exemplo": "mostrarValores();",
          "comparacao": "const: Não permite reatribuir a referência declarada."
        }
      ]
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "validacao": {
      "strictDeclarations": true
    },
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-front-end:14": {
    "subject": "programacao-front-end",
    "numero": 14,
    "titulo": "Exercício 14 — Variáveis Locais e Globais em JavaScript",
    "objetivo": "Diferenciar variáveis globais e locais por meio de um painel que registra visitantes.",
    "tema": "Escopo de variáveis e funções",
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
          "exemplo": "let totalVisitas = 0;\nconst NOME_SISTEMA = \"Portal 2DS\";",
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
          "exemplo": "function registrarVisita() {\n    const campoNome = document.getElementById(\"nomeVisitante\");\n    let nomeVisitante = campoNome.value.trim();\n    let mensagem = document.getElementById(\"mensagem\");"
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
          "exemplo": "if (nomeVisitante === \"\") {\n        mensagem.innerText = \"Digite o nome do visitante.\";\n        mensagem.style.color = \"#b3261e\";\n        campoNome.focus();\n        return;\n    }",
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
          "exemplo": "let mensagemLocal =\n        \"Olá, \" + nomeVisitante + \"! Sua visita foi registrada.\";\n\n    document.getElementById(\"visitanteAtual\").innerText = nomeVisitante;\n    document.getElementById(\"totalVisitas\").innerText = totalVisitas;\n    document.getElementById(\"nomeSistema\").innerText = NOME_SISTEMA;\n\n    mensagem.innerText = mensagemLocal;"
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
          "exemplo": "campoNome.focus();\n}",
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
          "exemplo": "let textoResumo =\n        NOME_SISTEMA + \" recebeu \" + totalVisitas + \" visita(s).\";\n\n    document.getElementById(\"resumo\").innerText = textoResumo;\n}"
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
          "exemplo": "document.getElementById(\"nomeVisitante\").value = \"\";\n    document.getElementById(\"visitanteAtual\").innerText =\n        \"Aguardando uma visita.\";\n    document.getElementById(\"totalVisitas\").innerText = totalVisitas;\n    document.getElementById(\"nomeSistema\").innerText = NOME_SISTEMA;\n    document.getElementById(\"mensagem\").innerText =\n        \"Digite um nome para registrar uma visita.\";\n    document.getElementById(\"mensagem\").style.color = \"#52606d\";",
          "comparacao": "Variável local: Existe somente dentro da função ou bloco."
        }
      ]
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false
    },
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-front-end:15": {
    "subject": "programacao-front-end",
    "numero": 15,
    "titulo": "Exercício 15 — Funções com Parâmetros e Retorno em JavaScript",
    "objetivo": "Criar funções reutilizáveis que recebem valores, processam dados e devolvem resultados.",
    "tema": "Parâmetros, argumentos e return",
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
          "exemplo": "function calcularValorDesconto(preco, percentual) {\n    return preco * (percentual / 100);\n}",
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
          "exemplo": "function calcularPrecoFinal(preco, valorDesconto) {\n    return preco - valorDesconto;\n}"
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
          "exemplo": "function formatarMoeda(valor) {\n    return \"R$ \" + valor.toFixed(2).replace(\".\", \",\");\n}",
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
          "exemplo": "function mostrarCalculo() {\n    const campoPreco = document.getElementById(\"preco\");\n    const campoPercentual = document.getElementById(\"percentual\");\n    const mensagem = document.getElementById(\"mensagem\");\n\n    const preco = Number(campoPreco.value);\n    const percentual = Number(campoPercentual.value);"
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
          "exemplo": "mensagem.innerText = \"Digite um preço maior que zero.\";\n        mensagem.style.color = \"#b3261e\";\n        campoPreco.focus();\n        return;\n    }\n\n    if (\n        campoPercentual.value === \"\" ||",
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
          "exemplo": "document.getElementById(\"precoOriginal\").innerText =\n        formatarMoeda(preco);\n\n    document.getElementById(\"valorDesconto\").innerText =\n        formatarMoeda(valorDesconto);"
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
          "exemplo": "formatarMoeda(precoFinal);\n\n    mensagem.innerText =\n        \"Desconto calculado com funções, parâmetros e retorno.\";\n    mensagem.style.color = \"green\";\n}\n\nfunction limpar() {",
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
          "exemplo": "document.getElementById(\"precoFinal\").innerText =\n        \"R$ 0,00\";\n\n    document.getElementById(\"mensagem\").innerText =\n        \"Preencha os campos para realizar o cálculo.\";\n\n    document.getElementById(\"mensagem\").style.color = \"#52606d\";\n    document.getElementById(\"preco\").focus();"
        }
      ]
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false
    },
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-front-end:16": {
    "subject": "programacao-front-end",
    "numero": 16,
    "titulo": "Exercício 16 — Lista de Nomes com Array em JavaScript",
    "objetivo": "Armazenar vários nomes em um array, acessar posições e apresentar os dados na página.",
    "tema": "Arrays, índices, push e length",
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
          "exemplo": "const nomes = [];",
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
          "exemplo": "function adicionarNome() {\n    const campoNome = document.getElementById(\"nome\");\n    const nomeDigitado = campoNome.value.trim();\n    const mensagem = document.getElementById(\"mensagem\");\n\n    if (nomeDigitado === \"\") {\n        mensagem.innerText = \"Digite um nome antes de adicionar.\";\n        mensagem.style.color = \"#b3261e\";"
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
          "exemplo": "nomes.push(nomeDigitado);\n\n    atualizarLista();",
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
          "exemplo": "mensagem.innerText =\n        nomeDigitado + \" foi adicionado ao array.\";\n    mensagem.style.color = \"green\";\n\n    campoNome.value = \"\";\n    campoNome.focus();\n}"
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
          "exemplo": "const lista = document.getElementById(\"listaNomes\");\n    lista.innerHTML = \"\";\n\n    for (let indice = 0; indice < nomes.length; indice++) {\n        const item = document.createElement(\"li\");\n        item.innerText = nomes[indice];\n        lista.appendChild(item);\n    }",
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
          "exemplo": "nomes.length;\n\n    if (nomes.length > 0) {\n        document.getElementById(\"primeiroNome\").innerText =\n            nomes[0];\n\n        document.getElementById(\"ultimoNome\").innerText =\n            nomes[nomes.length - 1];"
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
          "exemplo": "'<li class=\"vazio\">Nenhum nome cadastrado.</li>';\n\n        document.getElementById(\"primeiroNome\").innerText = \"—\";\n        document.getElementById(\"ultimoNome\").innerText = \"—\";\n    }\n}\n\nfunction limparLista() {",
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
          "exemplo": "\"A lista foi limpa.\";\n    document.getElementById(\"mensagem\").style.color = \"#5d6878\";\n    document.getElementById(\"nome\").value = \"\";\n    document.getElementById(\"nome\").focus();\n}"
        }
      ]
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false
    },
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-front-end:17": {
    "subject": "programacao-front-end",
    "numero": 17,
    "titulo": "Exercício 17 — Percorrendo Arrays com forEach em JavaScript",
    "objetivo": "Percorrer todos os valores de um array com forEach e construir uma lista dinâmica.",
    "tema": "forEach, callback, item e índice",
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
          "exemplo": "const tecnologias = [\n    \"HTML\",\n    \"CSS\",\n    \"JavaScript\",\n    \"Git\",\n    \"GitHub\"\n];",
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
          "exemplo": "function mostrarTrilha() {\n    const lista = document.getElementById(\"listaTecnologias\");\n    const mensagem = document.getElementById(\"mensagem\");\n    let quantidadeProcessada = 0;\n\n    lista.innerHTML = \"\";"
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
          "exemplo": "tecnologias.forEach(function (tecnologia, indice) {\n        const item = document.createElement(\"li\");\n        const numeroEtapa = indice + 1;",
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
          "exemplo": "item.innerText =\n            numeroEtapa + \"ª etapa: \" + tecnologia;\n\n        lista.appendChild(item);\n        quantidadeProcessada++;"
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
          "exemplo": "document.getElementById(\"quantidade\").innerText =\n        tecnologias.length;",
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
          "exemplo": "quantidadeProcessada;\n\n    mensagem.innerText =\n        \"O forEach percorreu todos os itens do array.\";\n    mensagem.style.color = \"green\";\n}"
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
          "exemplo": "function limparTrilha() {\n    document.getElementById(\"listaTecnologias\").innerHTML =\n        '<li class=\"vazio\">A trilha ainda não foi exibida.</li>';",
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
          "exemplo": "document.getElementById(\"mensagem\").innerText =\n        \"Clique em “Mostrar trilha” para executar o forEach.\";\n\n    document.getElementById(\"mensagem\").style.color = \"#5d6878\";\n}"
        }
      ]
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false
    },
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-front-end:18": {
    "subject": "programacao-front-end",
    "numero": 18,
    "titulo": "Exercício 18 — Eventos com addEventListener em JavaScript",
    "objetivo": "Registrar eventos no JavaScript com addEventListener e executar callbacks em diferentes interações.",
    "tema": "Registro de eventos sem onclick no HTML",
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
          "exemplo": "const campoTexto = document.getElementById(\"texto\");\nconst preVisualizacao = document.getElementById(\"preVisualizacao\");\nconst areaInteracao = document.getElementById(\"areaInteracao\");\nconst btnRegistrar = document.getElementById(\"btnRegistrar\");\nconst btnReiniciar = document.getElementById(\"btnReiniciar\");",
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
          "exemplo": "btnRegistrar.addEventListener(\"click\", function () {\n    totalCliques++;\n\n    document.getElementById(\"totalCliques\").innerText =\n        totalCliques;\n\n    document.getElementById(\"ultimoEvento\").innerText =\n        \"click\";"
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
          "exemplo": "campoTexto.addEventListener(\"input\", function (evento) {\n    const textoDigitado = evento.target.value;",
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
          "exemplo": "preVisualizacao.innerText =\n            \"A mensagem aparecerá aqui.\";\n    } else {\n        preVisualizacao.innerText = textoDigitado;\n    }\n\n    document.getElementById(\"totalCaracteres\").innerText =\n        textoDigitado.length;"
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
          "exemplo": "\"O evento mouseenter foi executado.\";\n\n    areaInteracao.style.backgroundColor = \"#ffe7c7\";\n    areaInteracao.style.borderColor = \"#d46b08\";\n\n    document.getElementById(\"ultimoEvento\").innerText =\n        \"mouseenter\";\n});",
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
          "exemplo": "areaInteracao.style.backgroundColor = \"#fff9f2\";\n    areaInteracao.style.borderColor = \"#9a4d08\";\n\n    document.getElementById(\"ultimoEvento\").innerText =\n        \"mouseleave\";\n});\n\nbtnReiniciar.addEventListener(\"click\", reiniciarPainel);"
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
          "exemplo": "\"A mensagem aparecerá aqui.\";\n\n    areaInteracao.innerText =",
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
          "exemplo": "areaInteracao.style.backgroundColor = \"#fff9f2\";\n    areaInteracao.style.borderColor = \"#9a4d08\";\n\n    document.getElementById(\"totalCliques\").innerText = \"0\";\n    document.getElementById(\"totalCaracteres\").innerText = \"0\";\n    document.getElementById(\"ultimoEvento\").innerText =\n        \"Nenhum\";\n"
        }
      ]
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false
    },
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-front-end:19": {
    "subject": "programacao-front-end",
    "numero": 19,
    "titulo": "Exercício 19 — Manipulando Classes com classList em JavaScript",
    "objetivo": "Controlar a aparência de elementos adicionando, removendo, alternando e verificando classes CSS.",
    "tema": "add, remove, toggle e contains",
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
          "exemplo": "const cartaoPerfil = document.getElementById(\"cartaoPerfil\");\nconst detalhes = document.getElementById(\"detalhes\");\nconst btnTema = document.getElementById(\"btnTema\");\nconst btnDestaque = document.getElementById(\"btnDestaque\");\nconst btnDetalhes = document.getElementById(\"btnDetalhes\");\nconst btnRestaurar = document.getElementById(\"btnRestaurar\");",
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
          "exemplo": "btnTema.addEventListener(\"click\", function () {\n    cartaoPerfil.classList.toggle(\"tema-escuro\");\n    atualizarStatus();\n});"
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
          "exemplo": "btnDestaque.addEventListener(\"click\", function () {\n    if (cartaoPerfil.classList.contains(\"destaque\")) {\n        cartaoPerfil.classList.remove(\"destaque\");\n    } else {\n        cartaoPerfil.classList.add(\"destaque\");\n    }\n\n    atualizarStatus();",
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
          "exemplo": "detalhes.classList.toggle(\"oculto\");\n\n    if (detalhes.classList.contains(\"oculto\")) {\n        btnDetalhes.innerText = \"Mostrar detalhes\";\n    } else {\n        btnDetalhes.innerText = \"Ocultar detalhes\";\n    }\n"
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
          "exemplo": "cartaoPerfil.classList.toggle(\"tema-escuro\");",
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
          "exemplo": "cartaoPerfil.classList.remove(\"tema-escuro\");\n    cartaoPerfil.classList.remove(\"destaque\");\n    detalhes.classList.remove(\"oculto\");\n    btnDetalhes.innerText = \"Ocultar detalhes\";\n    atualizarStatus();\n}"
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
          "exemplo": "const classesAtivas = [];\n\n    if (cartaoPerfil.classList.contains(\"tema-escuro\")) {\n        classesAtivas.push(\"tema-escuro\");\n    }\n\n    if (cartaoPerfil.classList.contains(\"destaque\")) {\n        classesAtivas.push(\"destaque\");",
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
          "exemplo": "status.innerText = \"Nenhuma classe adicional.\";\n    } else {\n        status.innerText = classesAtivas.join(\", \");\n    }\n}"
        }
      ]
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false
    },
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-front-end:20": {
    "subject": "programacao-front-end",
    "numero": 20,
    "titulo": "Exercício 20 — Lista de Tarefas com JavaScript",
    "objetivo": "Criar uma lista de tarefas dinâmica, marcar itens como concluídos e atualizar indicadores.",
    "tema": "Array, criação de elementos e estado concluído",
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
          "exemplo": "const tarefas = [];\n\nconst campoTarefa = document.getElementById(\"tarefa\");\nconst btnAdicionar = document.getElementById(\"btnAdicionar\");\nconst btnLimpar = document.getElementById(\"btnLimpar\");\nconst listaTarefas = document.getElementById(\"listaTarefas\");\nconst mensagem = document.getElementById(\"mensagem\");",
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
          "exemplo": "btnAdicionar.addEventListener(\"click\", adicionarTarefa);\n\ncampoTarefa.addEventListener(\"keydown\", function (evento) {\n    if (evento.key === \"Enter\") {\n        adicionarTarefa();\n    }\n});\n"
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
          "exemplo": "function adicionarTarefa() {\n    const textoTarefa = campoTarefa.value.trim();\n\n    if (textoTarefa === \"\") {\n        mensagem.innerText =\n            \"Digite uma tarefa antes de adicionar.\";\n        mensagem.style.color = \"#b3261e\";\n        campoTarefa.focus();",
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
          "exemplo": "if (tarefas.length === 1) {\n        listaTarefas.innerHTML = \"\";\n    }\n\n    criarItemTarefa(textoTarefa, tarefas.length);\n\n    mensagem.innerText =\n        \"Tarefa adicionada à lista.\";"
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
          "exemplo": "function criarItemTarefa(texto, numero) {\n    const item = document.createElement(\"li\");\n    item.classList.add(\"tarefa\");\n\n    const descricao = document.createElement(\"span\");\n    descricao.innerText = numero + \". \" + texto;\n\n    const botaoConcluir = document.createElement(\"button\");",
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
          "exemplo": "if (item.classList.contains(\"concluida\")) {\n            botaoConcluir.innerText = \"Reabrir\";\n        } else {\n            botaoConcluir.innerText = \"Concluir\";\n        }\n\n        atualizarResumo();\n    });"
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
          "exemplo": "document.getElementById(\"totalTarefas\").innerText =\n        tarefas.length;\n\n    document.getElementById(\"tarefasConcluidas\").innerText =\n        concluidas;\n\n    document.getElementById(\"tarefasPendentes\").innerText =\n        pendentes;",
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
          "exemplo": "campoTarefa.value = \"\";\n    atualizarResumo();\n    campoTarefa.focus();\n}"
        }
      ]
    },
    "permitirBase": {
      "html": true,
      "css": true,
      "js": false
    },
    "validacao": {
      "strictDeclarations": false
    },
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-desenvolvimento-sistemas:1": {
    "subject": "programacao-desenvolvimento-sistemas",
    "numero": 1,
    "titulo": "Exercício 01 — Estrutura Semântica de um Sistema de Chamados",
    "objetivo": "Organizar a página inicial de um sistema de suporte usando elementos semânticos, hierarquia de títulos e navegação interna.",
    "tema": "HTML semântico aplicado a uma interface de sistema",
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
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "ordemArquivos": [
      "html"
    ],
    "tempoEstimado": "20–25 min",
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
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-desenvolvimento-sistemas:2": {
    "subject": "programacao-desenvolvimento-sistemas",
    "numero": 2,
    "titulo": "Exercício 02 — Formulário Acessível de Cadastro de Usuário",
    "objetivo": "Construir um formulário organizado e acessível, associando corretamente rótulos, campos, grupos e atributos de preenchimento.",
    "tema": "HTML semântico, formulários e acessibilidade em um sistema interno",
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
    "passos": {
      "html": [
        {
          "titulo": "Documento e metadados",
          "linhas": [
            1,
            9
          ],
          "explicacao": "O documento informa o idioma, a codificação, a adaptação para telas e uma descrição do formulário. Esses dados ajudam o navegador e tecnologias assistivas a interpretar a página.",
          "tarefa": "Depois de compreender esta parte, pratique digitando manualmente as linhas 1 a 9 no arquivo index.html. Não copie e cole."
        },
        {
          "titulo": "Cabeçalho e contexto",
          "linhas": [
            10,
            14
          ],
          "explicacao": "O header apresenta um único h1 e explica por que o usuário preencherá o cadastro. O texto deve ser direto e orientar antes da interação.",
          "tarefa": "Depois de compreender esta parte, pratique digitando manualmente as linhas 10 a 14 no arquivo index.html. Não copie e cole."
        },
        {
          "titulo": "Região principal e formulário",
          "linhas": [
            15,
            20
          ],
          "explicacao": "O main contém a seção principal. O formulário usa aria-describedby para relacionar a orientação geral ao conjunto de campos.",
          "tarefa": "Depois de compreender esta parte, pratique digitando manualmente as linhas 15 a 20 no arquivo index.html. Não copie e cole."
        },
        {
          "titulo": "Identificação do usuário",
          "linhas": [
            21,
            34
          ],
          "explicacao": "O primeiro fieldset agrupa nome e e-mail. Cada campo possui label ligado pelo par for e id, tipo coerente, name, autocomplete e required.",
          "tarefa": "Depois de compreender esta parte, pratique digitando manualmente as linhas 21 a 34 no arquivo index.html. Não copie e cole."
        },
        {
          "titulo": "Perfil e setor",
          "linhas": [
            35,
            58
          ],
          "explicacao": "O segundo fieldset usa elementos select para opções conhecidas. A opção inicial vazia evita que uma escolha seja registrada sem decisão do usuário.",
          "tarefa": "Depois de compreender esta parte, pratique digitando manualmente as linhas 35 a 58 no arquivo index.html. Não copie e cole."
        },
        {
          "titulo": "Aceite das regras",
          "linhas": [
            59,
            66
          ],
          "explicacao": "O checkbox também precisa de rótulo associado. O atributo required impede o envio sem a confirmação solicitada.",
          "tarefa": "Depois de compreender esta parte, pratique digitando manualmente as linhas 59 a 66 no arquivo index.html. Não copie e cole."
        },
        {
          "titulo": "Ações e encerramento",
          "linhas": [
            67,
            81
          ],
          "explicacao": "Os botões usam tipos explícitos: submit envia e reset limpa. Depois, form, section, main e body são encerrados corretamente.",
          "tarefa": "Depois de compreender esta parte, pratique digitando manualmente as linhas 67 a 81 no arquivo index.html. Não copie e cole."
        }
      ]
    },
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "ordemArquivos": [
      "html"
    ],
    "tempoEstimado": "25–30 min",
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
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-desenvolvimento-sistemas:3": {
    "subject": "programacao-desenvolvimento-sistemas",
    "numero": 3,
    "titulo": "Exercício 03 — Tabela de Registros e Status",
    "objetivo": "Construir uma tabela de chamados com legenda, cabeçalhos associados, linhas de dados e situações compreensíveis sem depender apenas de cor.",
    "tema": "HTML semântico aplicado à representação acessível de dados tabulares",
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
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "ordemArquivos": [
      "html"
    ],
    "tempoEstimado": "25–30 min",
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
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-desenvolvimento-sistemas:4": {
    "subject": "programacao-desenvolvimento-sistemas",
    "numero": 4,
    "titulo": "Exercício 04 — Painel de Prioridades com Filtro Interativo",
    "objetivo": "Construir um painel responsivo que organize tarefas por situação e permita filtrar os cartões com JavaScript, integrando HTML, CSS e DOM.",
    "tema": "Interface de acompanhamento com HTML semântico, CSS responsivo e filtro por estado",
    "retomadas": [
      "estrutura semântica",
      "formulários e tabelas acessíveis",
      "organização de conteúdo em article"
    ],
    "novos": [
      "data-* para representar estado",
      "layout responsivo com Grid/Flexbox",
      "seleção de elementos no DOM",
      "eventos de clique",
      "dataset e atualização de estado visual"
    ],
    "requisitosPublicos": [
      "Use index.html, estilo.css e script.js. Os três arquivos fazem parte da entrega.",
      "Crie uma área de filtros com as opções Todos, Pendente, Em andamento e Concluído.",
      "Mostre pelo menos seis cartões de tarefas, distribuídos entre os três estados.",
      "Cada tarefa deve possuir título, responsável ou setor e indicação textual de situação.",
      "Os filtros devem funcionar sem recarregar a página e manter visível somente o grupo escolhido.",
      "O filtro ativo deve possuir indicação visual e de acessibilidade.",
      "A grade de cartões deve se adaptar a telas menores sem criar rolagem horizontal."
    ],
    "passos": {
      "html": [
        {
          "titulo": "Estruture o painel",
          "explicacao": "Monte header e main, crie uma região de controles e uma seção para as tarefas. Use elementos semânticos em vez de uma sequência de divs sem significado."
        },
        {
          "titulo": "Crie filtros e tarefas",
          "explicacao": "Adicione os quatro filtros pedidos e pelo menos seis tarefas. Cada tarefa precisa carregar seu estado de forma que o JavaScript consiga identificá-lo."
        }
      ],
      "css": [
        {
          "titulo": "Organize a interface",
          "explicacao": "Crie uma grade ou composição flexível, espaçamento consistente, estados visuais e foco perceptível nos controles."
        },
        {
          "titulo": "Adapte para telas menores",
          "explicacao": "Inclua uma regra responsiva para que filtros e cartões continuem legíveis no celular e no notebook."
        }
      ],
      "js": [
        {
          "titulo": "Selecione os elementos",
          "explicacao": "Localize os controles de filtro e os cartões do painel usando o DOM."
        },
        {
          "titulo": "Implemente a filtragem",
          "explicacao": "Ao clicar em um filtro, compare o filtro escolhido com o estado de cada cartão e mostre ou esconda os elementos necessários."
        },
        {
          "titulo": "Atualize o estado do controle",
          "explicacao": "Marque qual filtro está ativo visualmente e também por atributo acessível. Teste todas as opções antes de validar."
        }
      ]
    },
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "ordemArquivos": [
      "html",
      "css",
      "js"
    ],
    "tempoEstimado": "35–45 min",
    "avaliacao": {
      "autoridade": "backend-privado",
      "minimoEntrega": 80,
      "githubObrigatorio": true,
      "mensagem": "A correção oficial é feita no servidor. O navegador recebe apenas o percentual e os critérios públicos atendidos."
    },
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-desenvolvimento-sistemas:5": {
    "subject": "programacao-desenvolvimento-sistemas",
    "numero": 5,
    "titulo": "Exercício 05 — Protótipo HTML de Painel Administrativo",
    "objetivo": "Combinar indicadores, formulário, tabela e navegação interna em um protótipo semântico pronto para receber CSS e programação.",
    "tema": "Planejamento estrutural de interface com regiões funcionais de um sistema",
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
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "ordemArquivos": [
      "html"
    ],
    "tempoEstimado": "35–40 min",
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
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-desenvolvimento-sistemas:6": {
    "subject": "programacao-desenvolvimento-sistemas",
    "numero": 6,
    "titulo": "Exercício 06 — Cards e Box Model em um Painel",
    "objetivo": "Aplicar box-sizing, margin, padding, border e gap para organizar cards responsivos sem transbordamento.",
    "tema": "CSS aplicado a cards de indicadores e dimensões previsíveis",
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
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "ordemArquivos": [
      "css"
    ],
    "tempoEstimado": "30–35 min",
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
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-desenvolvimento-sistemas:7": {
    "subject": "programacao-desenvolvimento-sistemas",
    "numero": 7,
    "titulo": "Exercício 07 — Barra de Ferramentas com Flexbox",
    "objetivo": "Distribuir marca, navegação, pesquisa, filtros e ação principal usando Flexbox com quebra controlada.",
    "tema": "CSS aplicado à distribuição de ferramentas e ações de um sistema",
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
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "ordemArquivos": [
      "css"
    ],
    "tempoEstimado": "30–35 min",
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
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-desenvolvimento-sistemas:8": {
    "subject": "programacao-desenvolvimento-sistemas",
    "numero": 8,
    "titulo": "Exercício 08 — Dashboard com CSS Grid",
    "objetivo": "Distribuir menu, indicadores, atividade, tarefas e registros usando CSS Grid sem sobreposição.",
    "tema": "CSS aplicado à organização bidimensional de um painel administrativo",
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
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "ordemArquivos": [
      "css"
    ],
    "tempoEstimado": "35–40 min",
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
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-front-end-sub:1": {
    "subject": "programacao-front-end-sub",
    "numero": 1,
    "titulo": "FE01 - Ambiente, VS Code, pastas e primeiro projeto",
    "objetivo": "Preparar uma pasta Web organizada, conectar HTML, CSS e JavaScript e executar a página no navegador.",
    "tema": "Organização do ambiente de desenvolvimento",
    "produto": "Primeira página Front-End documentada e com uma interação de verificação do ambiente.",
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
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false,
      "readme": false
    },
    "ordemArquivos": [
      "html",
      "css",
      "js",
      "readme"
    ],
    "tempoMinimoSegundos": 300,
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
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      },
      {
        "filename": "README.md",
        "language": "markdown"
      }
    ]
  },
  "programacao-front-end-sub:2": {
    "subject": "programacao-front-end-sub",
    "numero": 2,
    "titulo": "FE02 - HTML semântico em uma página profissional",
    "objetivo": "Construir uma página empresarial com regiões semânticas que comuniquem claramente a função de cada conteúdo.",
    "tema": "Semântica e organização do conteúdo",
    "produto": "Página institucional de uma empresa de serviços, com navegação interna e informações de atendimento.",
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
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "ordemArquivos": [
      "html",
      "css",
      "js"
    ],
    "tempoMinimoSegundos": 300,
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
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-front-end-sub:3": {
    "subject": "programacao-front-end-sub",
    "numero": 3,
    "titulo": "FE03 - Formulário acessível de cadastro",
    "objetivo": "Construir um formulário de cadastro compreensível pelo teclado, pelo navegador e por tecnologias assistivas.",
    "tema": "Formulários semânticos e acessibilidade",
    "produto": "Formulário profissional de cadastro de cliente, com grupos de campos, rótulos associados, tipos adequados e confirmação acessível.",
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
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "ordemArquivos": [
      "html",
      "css",
      "js"
    ],
    "tempoMinimoSegundos": 300,
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
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-front-end-sub:4": {
    "subject": "programacao-front-end-sub",
    "numero": 4,
    "titulo": "FE04 - CSS: seletores, cascata, variáveis e Box Model",
    "objetivo": "Aplicar diferentes tipos de seletores, compreender a cascata, reutilizar valores com variáveis e controlar o Box Model de componentes.",
    "tema": "Fundamentos de estilização e controle do espaço",
    "produto": "Vitrine profissional de planos com cartão recomendado e alternância entre temas claro e escuro.",
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
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "ordemArquivos": [
      "html",
      "css",
      "js"
    ],
    "tempoMinimoSegundos": 300,
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
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-front-end-sub:5": {
    "subject": "programacao-front-end-sub",
    "numero": 5,
    "titulo": "FE05 - Layout profissional com Flexbox",
    "objetivo": "Construir um layout profissional com contêineres flexíveis, distribuição de espaço, alinhamento, quebra de linha e adaptação para telas pequenas.",
    "tema": "Distribuição, alinhamento e adaptação de componentes",
    "produto": "Painel profissional de serviços com cartões flexíveis, indicadores laterais e alternância de direção.",
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
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "ordemArquivos": [
      "html",
      "css",
      "js"
    ],
    "tempoMinimoSegundos": 300,
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
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-front-end-sub:6": {
    "subject": "programacao-front-end-sub",
    "numero": 6,
    "titulo": "FE06 - Grid, media queries e responsividade",
    "objetivo": "Construir um dashboard com CSS Grid, regiões nomeadas, colunas flexíveis e reorganização para computador, tablet e celular.",
    "tema": "Layout bidimensional e adaptação por breakpoint",
    "produto": "Dashboard operacional responsivo com indicadores, tarefas, agenda, equipe e alertas.",
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
    "permitirBase": {
      "html": false,
      "css": false,
      "js": false
    },
    "ordemArquivos": [
      "html",
      "css",
      "js"
    ],
    "tempoMinimoSegundos": 300,
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
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-front-end-sub:7": {
    "subject": "programacao-front-end-sub",
    "numero": 7,
    "titulo": "FE07 - Do algoritmo ao código: Python e JavaScript",
    "objetivo": "Representar um algoritmo sequencial em pseudocódigo e executá-lo com resultados equivalentes no navegador e no terminal Python.",
    "tema": "Entrada, processamento e saída em diferentes linguagens",
    "produto": "Calculadora de orçamento rápido com uma versão Web em JavaScript e uma versão de terminal em Python.",
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
    "permitirBase": {
      "pseudocodigo": false,
      "html": false,
      "css": false,
      "js": false,
      "python": false,
      "readme": false
    },
    "ordemArquivos": [
      "pseudocodigo",
      "html",
      "css",
      "js",
      "python",
      "readme"
    ],
    "tempoMinimoSegundos": 300,
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
    "files": [
      {
        "filename": "algoritmo.txt",
        "language": "text"
      },
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      },
      {
        "filename": "main.py",
        "language": "text"
      },
      {
        "filename": "README.md",
        "language": "markdown"
      }
    ]
  },
  "programacao-front-end-sub:8": {
    "subject": "programacao-front-end-sub",
    "numero": 8,
    "titulo": "Exercício 08 — Média e situação do aluno",
    "objetivo": "Calcular a média de dois valores e apresentar a situação do aluno com uma condição.",
    "modulo": "JavaScript: condições e validação",
    "tempoEstimado": "25–35 min",
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-front-end-sub:9": {
    "subject": "programacao-front-end-sub",
    "numero": 9,
    "titulo": "Exercício 09 — Validação de campo",
    "objetivo": "Validar um campo de entrada antes de apresentar a mensagem de sucesso.",
    "modulo": "JavaScript: condições e validação",
    "tempoEstimado": "25–35 min",
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-front-end-sub:10": {
    "subject": "programacao-front-end-sub",
    "numero": 10,
    "titulo": "Exercício 10 — Login simples com condição",
    "objetivo": "Comparar usuário e senha com uma condição e informar se o acesso foi liberado.",
    "modulo": "JavaScript: condições e validação",
    "tempoEstimado": "25–35 min",
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      }
    ]
  },
  "programacao-mobile-sub:1": {
    "subject": "programacao-mobile-sub",
    "numero": 1,
    "titulo": "MOB01 - Introdução ao Mobile",
    "objetivo": "Compreender o que diferencia uma experiência mobile de uma página pensada apenas para desktop e reconhecer Web, Web Mobile e aplicativo como entregas diferentes.",
    "tema": "Introdução ao desenvolvimento mobile",
    "produto": "Página comparativa interativa sobre experiências Web e Mobile.",
    "retomadas": [
      "HTML, CSS e JavaScript básicos",
      "uso de navegador"
    ],
    "novos": [
      "desenvolvimento mobile",
      "Web Mobile",
      "aplicativo mobile",
      "viewport",
      "características do uso em celular"
    ],
    "passos": {
      "html": [
        {
          "titulo": "Preparação para telas móveis",
          "linhas": [
            1,
            9
          ],
          "explicacao": "O meta viewport informa ao navegador que a largura visual deve acompanhar o dispositivo.",
          "detalhes": {
            "objetivo": "Reconhecer a configuração mínima de uma página preparada para telas móveis.",
            "porque": "Sem viewport, o navegador pode simular uma largura desktop e reduzir toda a página.",
            "ordem": "O navegador lê metadados e arquivos conectados antes de montar o conteúdo.",
            "erroComum": "Esquecer o viewport ou escrever caminhos de arquivos incorretos.",
            "conferir": "Abra o preview no modo Celular e confirme que o conteúdo ocupa a largura disponível.",
            "explicacaoSimples": "O meta viewport informa ao navegador que a largura visual deve acompanhar o dispositivo.",
            "exemploPratico": "No Preview, alterne Computador → Celular. Observe as três colunas virando uma coluna e o botão ocupando toda a largura."
          },
          "termos": [
            "viewport",
            "media-query"
          ],
          "focoVisual": "tela"
        },
        {
          "titulo": "Comparação de experiências",
          "linhas": [
            10,
            36
          ],
          "explicacao": "Os cartões apresentam três formas diferentes de entregar uma experiência digital.",
          "detalhes": {
            "objetivo": "Distinguir Web tradicional, Web Mobile e aplicativo.",
            "porque": "A disciplina precisa separar conceitos antes de estudar tecnologias específicas.",
            "ordem": "O header apresenta o tema; depois o main organiza comparação e explicação.",
            "erroComum": "Achar que qualquer site aberto no celular já possui boa experiência mobile.",
            "conferir": "Leia cada cartão e explique uma diferença entre eles.",
            "explicacaoSimples": "Os cartões apresentam três formas diferentes de entregar uma experiência digital.",
            "exemploPratico": "No Preview, alterne Computador → Celular. Observe as três colunas virando uma coluna e o botão ocupando toda a largura."
          },
          "termos": [
            "mobile",
            "web-mobile",
            "app-mobile"
          ],
          "focoVisual": "contexto"
        },
        {
          "titulo": "Ação e resultado",
          "linhas": [
            37,
            48
          ],
          "explicacao": "O botão permite executar uma pequena interação e a região aria-live anuncia a mudança.",
          "detalhes": {
            "objetivo": "Relacionar interface, interação e feedback.",
            "porque": "Aplicações móveis precisam responder claramente às ações do usuário.",
            "ordem": "O botão dispara o JavaScript, que atualiza o texto de resultado.",
            "erroComum": "Mudar o id do botão ou da saída e quebrar a ligação com o JavaScript.",
            "conferir": "Clique no botão e confirme que a mensagem muda.",
            "explicacaoSimples": "O botão permite executar uma pequena interação e a região aria-live anuncia a mudança.",
            "exemploPratico": "No Preview, alterne Computador → Celular. Observe as três colunas virando uma coluna e o botão ocupando toda a largura."
          },
          "termos": [
            "touch",
            "aria-live"
          ],
          "focoVisual": "resposta"
        }
      ],
      "css": [
        {
          "titulo": "Base visual",
          "linhas": [
            1,
            28
          ],
          "explicacao": "Variáveis, box-sizing e regras gerais criam uma base previsível.",
          "detalhes": {
            "objetivo": "Organizar estilos reutilizáveis.",
            "porque": "Interfaces mobile precisam manter consistência visual em diferentes tamanhos.",
            "ordem": "Primeiro vêm variáveis e regras globais; depois componentes.",
            "erroComum": "Criar larguras fixas maiores que a tela.",
            "conferir": "Use o preview Celular e confira se não aparece rolagem horizontal.",
            "explicacaoSimples": "Variáveis, box-sizing e regras gerais criam uma base previsível.",
            "exemploPratico": "No Preview, alterne Computador → Celular. Observe as três colunas virando uma coluna e o botão ocupando toda a largura."
          },
          "termos": [
            "root",
            "boxSizing"
          ],
          "focoVisual": "contexto"
        },
        {
          "titulo": "Grade e componentes",
          "linhas": [
            29,
            75
          ],
          "explicacao": "Grid organiza os três cartões e os componentes recebem espaçamento e contraste.",
          "detalhes": {
            "objetivo": "Observar uma interface que pode mudar de colunas sem alterar o HTML.",
            "porque": "O mesmo conteúdo pode precisar de outra distribuição em telas menores.",
            "ordem": "A grade ampla é definida antes da regra de tela pequena.",
            "erroComum": "Fixar três colunas mesmo quando não há espaço.",
            "conferir": "Compare Computador e Celular no preview.",
            "explicacaoSimples": "Grid organiza os três cartões e os componentes recebem espaçamento e contraste.",
            "exemploPratico": "No Preview, alterne Computador → Celular. Observe as três colunas virando uma coluna e o botão ocupando toda a largura."
          },
          "termos": [
            "grid",
            "gap"
          ],
          "focoVisual": "tela"
        },
        {
          "titulo": "Adaptação para tela pequena",
          "linhas": [
            77,
            82
          ],
          "explicacao": "A media query troca a grade por uma coluna e amplia o botão.",
          "detalhes": {
            "objetivo": "Perceber a primeira adaptação responsiva sem aprofundar ainda em responsividade.",
            "porque": "Mobile exige reorganização, não apenas redução.",
            "ordem": "Quando a largura fica menor que o breakpoint, essas regras substituem as anteriores.",
            "erroComum": "Usar media query sem fechar corretamente as chaves.",
            "conferir": "No preview Celular, confirme uma coluna e botão ocupando a largura.",
            "explicacaoSimples": "A media query troca a grade por uma coluna e amplia o botão.",
            "exemploPratico": "No Preview, alterne Computador → Celular. Observe as três colunas virando uma coluna e o botão ocupando toda a largura."
          },
          "termos": [
            "media-query",
            "web-mobile"
          ],
          "focoVisual": "tela"
        }
      ],
      "js": [
        {
          "titulo": "Localização dos elementos",
          "linhas": [
            1,
            2
          ],
          "explicacao": "querySelector encontra o botão e a região de saída.",
          "detalhes": {
            "objetivo": "Entender como o JavaScript acessa a interface.",
            "porque": "A interação depende de referências corretas aos elementos HTML.",
            "ordem": "Primeiro os elementos são localizados.",
            "erroComum": "Usar seletor diferente do id existente no HTML.",
            "conferir": "Confira os ids no HTML e no JS.",
            "explicacaoSimples": "querySelector encontra o botão e a região de saída.",
            "exemploPratico": "No Preview, alterne Computador → Celular. Observe as três colunas virando uma coluna e o botão ocupando toda a largura."
          },
          "termos": [
            "querySelector"
          ],
          "focoVisual": "resposta"
        },
        {
          "titulo": "Resposta ao toque/clique",
          "linhas": [
            4,
            8
          ],
          "explicacao": "O evento atualiza texto, classe e rótulo do botão.",
          "detalhes": {
            "objetivo": "Criar feedback após uma ação do usuário.",
            "porque": "Em mobile, feedback imediato ajuda a pessoa a entender que o toque funcionou.",
            "ordem": "O listener espera a ação e executa o callback.",
            "erroComum": "Executar as alterações fora do evento.",
            "conferir": "Clique no botão no preview e observe três mudanças.",
            "explicacaoSimples": "O evento atualiza texto, classe e rótulo do botão.",
            "exemploPratico": "No Preview, alterne Computador → Celular. Observe as três colunas virando uma coluna e o botão ocupando toda a largura."
          },
          "termos": [
            "addEventListener",
            "textContent",
            "classList"
          ],
          "focoVisual": "resposta"
        }
      ],
      "readme": [
        {
          "titulo": "Objetivo e conceitos",
          "linhas": [
            1,
            12
          ],
          "explicacao": "O README registra os conceitos discutidos na atividade.",
          "detalhes": {
            "objetivo": "Documentar o que foi aprendido.",
            "porque": "Documentação ajuda a transformar código em conhecimento reutilizável.",
            "ordem": "Leia o objetivo antes das instruções de teste.",
            "erroComum": "Copiar a explicação sem compreender as diferenças.",
            "conferir": "Explique uma diferença sem consultar o código.",
            "explicacaoSimples": "O README registra os conceitos discutidos na atividade.",
            "exemploPratico": "No Preview, alterne Computador → Celular. Observe as três colunas virando uma coluna e o botão ocupando toda a largura."
          },
          "termos": [
            "heading"
          ],
          "focoVisual": "contexto"
        },
        {
          "titulo": "Teste e reflexão",
          "linhas": [
            14,
            21
          ],
          "explicacao": "As instruções orientam teste em largura reduzida e uma reflexão final.",
          "detalhes": {
            "objetivo": "Relacionar observação prática ao conceito.",
            "porque": "O aluno precisa perceber o comportamento, não apenas finalizar arquivos.",
            "ordem": "Teste primeiro; depois escreva a reflexão.",
            "erroComum": "Ignorar a simulação de tela pequena.",
            "conferir": "Reduza a janela e confira o comportamento.",
            "explicacaoSimples": "As instruções orientam teste em largura reduzida e uma reflexão final.",
            "exemploPratico": "No Preview, alterne Computador → Celular. Observe as três colunas virando uma coluna e o botão ocupando toda a largura."
          },
          "termos": [
            "code"
          ],
          "focoVisual": "recursos"
        }
      ]
    },
    "ordemArquivos": [
      "html",
      "css",
      "js",
      "readme"
    ],
    "tempoMinimoSegundos": 300,
    "validacao": {
      "strictDeclarations": false,
      "aceitarEquivalencias": true,
      "htmlEstrutura": {
        "idsObrigatorios": [
          "titulo-comparacao",
          "compararExperiencias",
          "resumoMobile"
        ],
        "tagsMinimas": {
          "header": 1,
          "main": 1,
          "section": 1,
          "article": 1,
          "button": 1,
          "footer": 1
        },
        "referenciasArquivos": {
          "css": "estilo.css",
          "js": "script.js"
        },
        "seletoresObrigatorios": [
          {
            "selector": "meta[name=\"viewport\"]",
            "message": "Mantenha o meta viewport."
          },
          {
            "selector": "#resumoMobile[aria-live=\"polite\"]",
            "message": "Mantenha a região de feedback acessível."
          }
        ]
      },
      "markdownEstrutura": {
        "codigoExercicio": "MOB01",
        "minimoCaracteres": 80,
        "titulosObrigatorios": [],
        "arquivosObrigatorios": [],
        "conteudosObrigatorios": [
          "Web Mobile",
          "Aplicativo Mobile"
        ]
      },
      "politica": "conceitos_essenciais"
    },
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      },
      {
        "filename": "README.md",
        "language": "markdown"
      }
    ]
  },
  "programacao-mobile-sub:2": {
    "subject": "programacao-mobile-sub",
    "numero": 2,
    "titulo": "MOB02 - Como funciona um dispositivo móvel",
    "objetivo": "Compreender a relação entre entrada, sistema operacional, aplicativo, dados, permissões, sensores e saída.",
    "tema": "Funcionamento de dispositivos e aplicativos móveis",
    "produto": "Simulador visual de um fluxo entre toque, sistema operacional, sensor e aplicativo.",
    "retomadas": [
      "estrutura HTML",
      "eventos JavaScript simples"
    ],
    "novos": [
      "hardware",
      "sistema operacional",
      "sensores",
      "permissões",
      "entrada e saída",
      "fluxo de aplicativo"
    ],
    "passos": {
      "html": [
        {
          "titulo": "Configuração e apresentação",
          "linhas": [
            1,
            15
          ],
          "explicacao": "O documento prepara viewport, CSS, JavaScript e apresenta o tema.",
          "detalhes": {
            "objetivo": "Relacionar estrutura Web com o estudo conceitual de mobile.",
            "porque": "Mesmo em uma atividade introdutória, a interface precisa estar preparada para telas menores.",
            "ordem": "Head conecta arquivos; body inicia a apresentação.",
            "erroComum": "Remover o viewport ou trocar nomes de arquivos.",
            "conferir": "Abra em modo Celular.",
            "explicacaoSimples": "O documento prepara viewport, CSS, JavaScript e apresenta o tema.",
            "exemploPratico": "Clique em “Simular toque” e leia a sequência como se fosse um caminho percorrido dentro do aparelho."
          },
          "termos": [
            "viewport"
          ],
          "focoVisual": "sistema"
        },
        {
          "titulo": "Camadas do dispositivo",
          "linhas": [
            17,
            27
          ],
          "explicacao": "A lista ordenada representa um fluxo simplificado entre entrada, sistema, app, dados e saída.",
          "detalhes": {
            "objetivo": "Visualizar como diferentes partes cooperam.",
            "porque": "Ajuda a evitar a ideia de que o aplicativo controla diretamente todo o hardware.",
            "ordem": "A informação avança da entrada até a saída.",
            "erroComum": "Confundir sistema operacional com o próprio aplicativo.",
            "conferir": "Explique o papel de Android/iOS no fluxo.",
            "explicacaoSimples": "A lista ordenada representa um fluxo simplificado entre entrada, sistema, app, dados e saída.",
            "exemploPratico": "Clique em “Simular toque” e leia a sequência como se fosse um caminho percorrido dentro do aparelho."
          },
          "termos": [
            "hardware",
            "sistema-operacional",
            "permiss-o",
            "sensor",
            "api",
            "entrada",
            "saida"
          ],
          "focoVisual": "app"
        },
        {
          "titulo": "Simulação de interação",
          "linhas": [
            29,
            39
          ],
          "explicacao": "O botão dispara uma sequência explicada em linguagem simples.",
          "detalhes": {
            "objetivo": "Relacionar toque, permissão, sensor, processamento e saída.",
            "porque": "Esse fluxo aparecerá novamente quando estudarmos APIs do aparelho.",
            "ordem": "A pessoa toca; o JS atualiza a saída.",
            "erroComum": "Achar que GPS pode ser usado sem autorização.",
            "conferir": "Execute a simulação.",
            "explicacaoSimples": "O botão dispara uma sequência explicada em linguagem simples.",
            "exemploPratico": "Clique em “Simular toque” e leia a sequência como se fosse um caminho percorrido dentro do aparelho."
          },
          "termos": [
            "ariaLive"
          ],
          "focoVisual": "entrada"
        }
      ],
      "css": [
        {
          "titulo": "Base da interface",
          "linhas": [
            1,
            9
          ],
          "explicacao": "As regras definem cores, largura máxima e tipografia.",
          "detalhes": {
            "objetivo": "Manter conteúdo legível em diferentes telas.",
            "porque": "Mobile exige previsibilidade e legibilidade.",
            "ordem": "Base antes dos componentes.",
            "erroComum": "Largura fixa maior que o dispositivo.",
            "conferir": "Verifique a tela de celular.",
            "explicacaoSimples": "As regras definem cores, largura máxima e tipografia.",
            "exemploPratico": "Clique em “Simular toque” e leia a sequência como se fosse um caminho percorrido dentro do aparelho."
          },
          "termos": [
            "root"
          ],
          "focoVisual": "saida"
        },
        {
          "titulo": "Representação das camadas",
          "linhas": [
            10,
            17
          ],
          "explicacao": "Grid organiza número, título e explicação de cada camada.",
          "detalhes": {
            "objetivo": "Transformar um conceito em uma sequência visual.",
            "porque": "Organização visual ajuda a compreender fluxo.",
            "ordem": "A lista recebe layout depois do painel.",
            "erroComum": "Perder alinhamento por falta de box-sizing.",
            "conferir": "Observe os números e textos.",
            "explicacaoSimples": "Grid organiza número, título e explicação de cada camada.",
            "exemploPratico": "Clique em “Simular toque” e leia a sequência como se fosse um caminho percorrido dentro do aparelho."
          },
          "termos": [
            "grid"
          ],
          "focoVisual": "saida"
        },
        {
          "titulo": "Ajuste de tela pequena",
          "linhas": [
            18,
            18
          ],
          "explicacao": "A media query reduz espaçamento e amplia o botão.",
          "detalhes": {
            "objetivo": "Identificar adaptação básica.",
            "porque": "A interação precisa continuar confortável.",
            "ordem": "Regra pequena substitui apenas o necessário.",
            "erroComum": "Esquecer de fechar a media query.",
            "conferir": "Teste no modo Celular.",
            "explicacaoSimples": "A media query reduz espaçamento e amplia o botão.",
            "exemploPratico": "Clique em “Simular toque” e leia a sequência como se fosse um caminho percorrido dentro do aparelho."
          },
          "termos": [
            "media"
          ],
          "focoVisual": "saida"
        }
      ],
      "js": [
        {
          "titulo": "Referências",
          "linhas": [
            1,
            2
          ],
          "explicacao": "O código encontra botão e saída.",
          "detalhes": {
            "objetivo": "Conectar ação e feedback.",
            "porque": "O app precisa saber qual elemento recebeu a ação.",
            "ordem": "Seletores vêm antes do listener.",
            "erroComum": "ID divergente.",
            "conferir": "Compare HTML e JS.",
            "explicacaoSimples": "O código encontra botão e saída.",
            "exemploPratico": "Clique em “Simular toque” e leia a sequência como se fosse um caminho percorrido dentro do aparelho."
          },
          "termos": [
            "querySelector"
          ],
          "focoVisual": "app"
        },
        {
          "titulo": "Fluxo explicado",
          "linhas": [
            4,
            8
          ],
          "explicacao": "Ao clicar, o código apresenta a sequência e aplica feedback visual.",
          "detalhes": {
            "objetivo": "Representar uma cadeia de eventos.",
            "porque": "Antes de programar sensores reais, o aluno precisa compreender a lógica do fluxo.",
            "ordem": "Evento → processamento → atualização.",
            "erroComum": "Colocar a atualização fora do evento.",
            "conferir": "Clique e leia a sequência.",
            "explicacaoSimples": "Ao clicar, o código apresenta a sequência e aplica feedback visual.",
            "exemploPratico": "Clique em “Simular toque” e leia a sequência como se fosse um caminho percorrido dentro do aparelho."
          },
          "termos": [
            "addEventListener"
          ],
          "focoVisual": "saida"
        }
      ],
      "readme": [
        {
          "titulo": "Dependências do aplicativo",
          "linhas": [
            1,
            13
          ],
          "explicacao": "A documentação resume hardware, sistema operacional, dados e permissões.",
          "detalhes": {
            "objetivo": "Fixar o modelo mental da atividade.",
            "porque": "Esses conceitos serão usados em câmera, GPS e armazenamento.",
            "ordem": "Leia as camadas na ordem.",
            "erroComum": "Achar que permissão é detalhe opcional.",
            "conferir": "Dê um exemplo de recurso que pede permissão.",
            "explicacaoSimples": "A documentação resume hardware, sistema operacional, dados e permissões.",
            "exemploPratico": "Clique em “Simular toque” e leia a sequência como se fosse um caminho percorrido dentro do aparelho."
          },
          "termos": [
            "heading"
          ],
          "focoVisual": "dados"
        },
        {
          "titulo": "Permissões e teste",
          "linhas": [
            14,
            19
          ],
          "explicacao": "O final destaca privacidade e pede uma explicação.",
          "detalhes": {
            "objetivo": "Relacionar tecnologia a controle do usuário.",
            "porque": "Uso responsável de recursos do aparelho é parte do desenvolvimento mobile.",
            "ordem": "Estude permissão antes de executar o teste.",
            "erroComum": "Dizer que o app deve pedir acesso a tudo.",
            "conferir": "Explique por que pedir apenas o necessário.",
            "explicacaoSimples": "O final destaca privacidade e pede uma explicação.",
            "exemploPratico": "Clique em “Simular toque” e leia a sequência como se fosse um caminho percorrido dentro do aparelho."
          },
          "termos": [
            "code"
          ],
          "focoVisual": "sistema"
        }
      ]
    },
    "ordemArquivos": [
      "html",
      "css",
      "js",
      "readme"
    ],
    "tempoMinimoSegundos": 300,
    "validacao": {
      "strictDeclarations": false,
      "aceitarEquivalencias": true,
      "htmlEstrutura": {
        "idsObrigatorios": [
          "titulo-camadas",
          "simularFluxo",
          "fluxoMobile"
        ],
        "tagsMinimas": {
          "header": 1,
          "main": 1,
          "section": 1,
          "ol": 1,
          "li": 3,
          "button": 1,
          "footer": 1
        },
        "referenciasArquivos": {
          "css": "estilo.css",
          "js": "script.js"
        },
        "seletoresObrigatorios": [
          {
            "selector": "meta[name=\"viewport\"]",
            "message": "Mantenha o meta viewport."
          },
          {
            "selector": "#fluxoMobile[aria-live=\"polite\"]",
            "message": "Mantenha a região de feedback acessível."
          }
        ]
      },
      "markdownEstrutura": {
        "codigoExercicio": "MOB02",
        "minimoCaracteres": 80,
        "conteudosObrigatorios": [
          "sistema operacional",
          "permissões"
        ]
      },
      "politica": "conceitos_essenciais"
    },
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      },
      {
        "filename": "README.md",
        "language": "markdown"
      }
    ]
  },
  "programacao-mobile-sub:3": {
    "subject": "programacao-mobile-sub",
    "numero": 3,
    "titulo": "MOB03 - Tecnologias Mobile",
    "objetivo": "Comparar desenvolvimento nativo, Web/PWA e multiplataforma e perceber que a escolha depende dos requisitos do projeto.",
    "tema": "Tecnologias e abordagens de desenvolvimento mobile",
    "produto": "Guia interativo de cenários e abordagens mobile.",
    "retomadas": [
      "HTML semântico",
      "objetos e eventos JavaScript introdutórios"
    ],
    "novos": [
      "Android",
      "iOS",
      "nativo",
      "PWA",
      "multiplataforma",
      "React Native",
      "Flutter",
      "trade-offs"
    ],
    "passos": {
      "html": [
        {
          "titulo": "Apresentação das abordagens",
          "linhas": [
            1,
            25
          ],
          "explicacao": "A página apresenta três estratégias sem declarar uma vencedora.",
          "detalhes": {
            "objetivo": "Distinguir nativo, Web/PWA e multiplataforma.",
            "porque": "Escolha tecnológica depende do contexto.",
            "ordem": "Primeiro conceitos; depois cenário.",
            "erroComum": "Memorizar ferramenta sem entender abordagem.",
            "conferir": "Explique uma vantagem possível de cada abordagem.",
            "explicacaoSimples": "A página apresenta três estratégias sem declarar uma vencedora.",
            "exemploPratico": "Teste os três cenários no seletor e perceba que a resposta muda porque o requisito mudou."
          },
          "termos": [
            "nativo",
            "pwa",
            "multiplataforma",
            "kotlin",
            "swift",
            "react-native",
            "flutter",
            "framework"
          ],
          "focoVisual": "web"
        },
        {
          "titulo": "Cenários de decisão",
          "linhas": [
            27,
            43
          ],
          "explicacao": "Select e botão permitem comparar decisões conforme o problema.",
          "detalhes": {
            "objetivo": "Aprender que requisitos orientam tecnologia.",
            "porque": "Desenvolvimento profissional começa pelo problema, não pela ferramenta favorita.",
            "ordem": "Selecionar cenário → analisar → ler justificativa.",
            "erroComum": "Tratar recomendação como regra absoluta.",
            "conferir": "Teste os três cenários.",
            "explicacaoSimples": "Select e botão permitem comparar decisões conforme o problema.",
            "exemploPratico": "Teste os três cenários no seletor e perceba que a resposta muda porque o requisito mudou."
          },
          "termos": [
            "select",
            "option",
            "ariaLive"
          ],
          "focoVisual": "decisao"
        }
      ],
      "css": [
        {
          "titulo": "Base e cartões",
          "linhas": [
            1,
            11
          ],
          "explicacao": "A interface usa variáveis, painel e grade para comparar abordagens.",
          "detalhes": {
            "objetivo": "Organizar comparação visual.",
            "porque": "Comparações precisam ser escaneáveis em telas pequenas.",
            "ordem": "Base antes de componentes.",
            "erroComum": "Criar cartões estreitos demais.",
            "conferir": "Compare desktop e celular.",
            "explicacaoSimples": "A interface usa variáveis, painel e grade para comparar abordagens.",
            "exemploPratico": "Teste os três cenários no seletor e perceba que a resposta muda porque o requisito mudou."
          },
          "termos": [
            "grid"
          ],
          "focoVisual": "web"
        },
        {
          "titulo": "Controles de escolha",
          "linhas": [
            12,
            17
          ],
          "explicacao": "Select, botão e resultado recebem estilos de interação e leitura.",
          "detalhes": {
            "objetivo": "Destacar uma ação principal.",
            "porque": "Formulários mobile precisam de áreas confortáveis.",
            "ordem": "Label vem antes do controle; resultado vem depois da ação.",
            "erroComum": "Remover label e reduzir clareza.",
            "conferir": "Use o seletor no preview.",
            "explicacaoSimples": "Select, botão e resultado recebem estilos de interação e leitura.",
            "exemploPratico": "Teste os três cenários no seletor e perceba que a resposta muda porque o requisito mudou."
          },
          "termos": [
            "select"
          ],
          "focoVisual": "decisao"
        },
        {
          "titulo": "Tela pequena",
          "linhas": [
            18,
            18
          ],
          "explicacao": "A grade vira uma coluna e o botão ocupa a largura.",
          "detalhes": {
            "objetivo": "Perceber reorganização para mobile.",
            "porque": "Uma comparação horizontal pode não caber no celular.",
            "ordem": "Breakpoint substitui a grade ampla.",
            "erroComum": "Manter três colunas no celular.",
            "conferir": "Abra modo Celular.",
            "explicacaoSimples": "A grade vira uma coluna e o botão ocupa a largura.",
            "exemploPratico": "Teste os três cenários no seletor e perceba que a resposta muda porque o requisito mudou."
          },
          "termos": [
            "media"
          ],
          "focoVisual": "web"
        }
      ],
      "js": [
        {
          "titulo": "Dados e elementos",
          "linhas": [
            1,
            11
          ],
          "explicacao": "O código localiza controles e guarda recomendações em um objeto.",
          "detalhes": {
            "objetivo": "Relacionar cenário a resposta.",
            "porque": "Objetos ajudam a organizar informações por chave.",
            "ordem": "Elementos e dados são preparados antes do evento.",
            "erroComum": "Usar chave diferente do value do option.",
            "conferir": "Compare values do HTML com chaves do objeto.",
            "explicacaoSimples": "O código localiza controles e guarda recomendações em um objeto.",
            "exemploPratico": "Teste os três cenários no seletor e perceba que a resposta muda porque o requisito mudou."
          },
          "termos": [
            "querySelector"
          ],
          "focoVisual": "problema"
        },
        {
          "titulo": "Análise do cenário",
          "linhas": [
            12,
            14
          ],
          "explicacao": "O clique usa o value escolhido para buscar uma resposta.",
          "detalhes": {
            "objetivo": "Criar uma decisão simples baseada em entrada do usuário.",
            "porque": "Interfaces mobile frequentemente transformam seleção em feedback.",
            "ordem": "Clique → leitura do value → busca → saída.",
            "erroComum": "Não tratar o cenário vazio.",
            "conferir": "Teste com e sem cenário selecionado.",
            "explicacaoSimples": "O clique usa o value escolhido para buscar uma resposta.",
            "exemploPratico": "Teste os três cenários no seletor e perceba que a resposta muda porque o requisito mudou."
          },
          "termos": [
            "addEventListener",
            "textContent"
          ],
          "focoVisual": "decisao"
        }
      ],
      "readme": [
        {
          "titulo": "Comparação tecnológica",
          "linhas": [
            1,
            17
          ],
          "explicacao": "A documentação diferencia as três abordagens e dá exemplos.",
          "detalhes": {
            "objetivo": "Fixar vocabulário técnico.",
            "porque": "O aluno precisará reconhecer essas opções ao longo da disciplina.",
            "ordem": "Leia abordagem por abordagem.",
            "erroComum": "Confundir PWA com aplicativo nativo.",
            "conferir": "Dê um exemplo de tecnologia de cada grupo.",
            "explicacaoSimples": "A documentação diferencia as três abordagens e dá exemplos.",
            "exemploPratico": "Teste os três cenários no seletor e perceba que a resposta muda porque o requisito mudou."
          },
          "termos": [
            "heading"
          ],
          "focoVisual": "problema"
        },
        {
          "titulo": "Critério de escolha",
          "linhas": [
            19,
            19
          ],
          "explicacao": "A conclusão reforça que requisitos guiam a escolha.",
          "detalhes": {
            "objetivo": "Evitar pensamento de ferramenta única.",
            "porque": "Decisões técnicas são trade-offs.",
            "ordem": "Teste cenários após estudar conceitos.",
            "erroComum": "Responder apenas com nome de tecnologia sem justificar.",
            "conferir": "Explique qual requisito pesou mais.",
            "explicacaoSimples": "A conclusão reforça que requisitos guiam a escolha.",
            "exemploPratico": "Teste os três cenários no seletor e perceba que a resposta muda porque o requisito mudou."
          },
          "termos": [
            "code"
          ],
          "focoVisual": "decisao"
        }
      ]
    },
    "ordemArquivos": [
      "html",
      "css",
      "js",
      "readme"
    ],
    "tempoMinimoSegundos": 300,
    "validacao": {
      "strictDeclarations": false,
      "aceitarEquivalencias": true,
      "htmlEstrutura": {
        "idsObrigatorios": [
          "titulo-tecnologias",
          "cenario",
          "analisarTecnologia",
          "recomendacaoTecnologia"
        ],
        "tagsMinimas": {
          "header": 1,
          "main": 1,
          "section": 1,
          "article": 1,
          "select": 1,
          "option": 2,
          "button": 1,
          "footer": 1
        },
        "referenciasArquivos": {
          "css": "estilo.css",
          "js": "script.js"
        },
        "seletoresObrigatorios": [
          {
            "selector": "meta[name=\"viewport\"]",
            "message": "Mantenha o meta viewport."
          },
          {
            "selector": "#recomendacaoTecnologia[aria-live=\"polite\"]",
            "message": "Mantenha a saída acessível."
          }
        ]
      },
      "markdownEstrutura": {
        "codigoExercicio": "MOB03",
        "minimoCaracteres": 80,
        "conteudosObrigatorios": [
          "Nativo",
          "PWA"
        ]
      },
      "politica": "conceitos_essenciais"
    },
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      },
      {
        "filename": "README.md",
        "language": "markdown"
      }
    ]
  },
  "programacao-mobile-sub:4": {
    "subject": "programacao-mobile-sub",
    "numero": 4,
    "titulo": "MOB04 - Ecossistema de Desenvolvimento Mobile",
    "objetivo": "Reconhecer o papel de editor/IDE, SDK, framework, emulador, dispositivo real, Git/GitHub, build e distribuição dentro do processo de desenvolvimento.",
    "tema": "Ferramentas e fluxo de desenvolvimento mobile",
    "produto": "Mapa interativo do ecossistema e do fluxo de desenvolvimento mobile.",
    "retomadas": [
      "organização de projeto Web",
      "controle simples de visibilidade com JavaScript"
    ],
    "novos": [
      "IDE",
      "SDK",
      "framework",
      "emulador",
      "dispositivo real",
      "Git/GitHub",
      "build",
      "Android Studio",
      "Expo"
    ],
    "passos": {
      "html": [
        {
          "titulo": "Ferramentas do ecossistema",
          "linhas": [
            1,
            26
          ],
          "explicacao": "A página apresenta editor/IDE, SDK/framework, teste e versionamento.",
          "detalhes": {
            "objetivo": "Reconhecer que desenvolvimento mobile é um conjunto de ferramentas.",
            "porque": "Nenhuma ferramenta isolada cobre planejamento, código, teste e distribuição.",
            "ordem": "A apresentação vem antes da simulação do fluxo.",
            "erroComum": "Confundir framework com editor ou sistema operacional.",
            "conferir": "Explique a função de cada cartão.",
            "explicacaoSimples": "A página apresenta editor/IDE, SDK/framework, teste e versionamento.",
            "exemploPratico": "Clique em “Mostrar fluxo” e relacione cada etapa com uma ferramenta que você já conhece."
          },
          "termos": [
            "ide",
            "sdk",
            "emulador",
            "git",
            "github",
            "debug",
            "dispositivo-real"
          ],
          "focoVisual": "editar"
        },
        {
          "titulo": "Fluxo de desenvolvimento",
          "linhas": [
            28,
            44
          ],
          "explicacao": "O botão revela uma sequência de trabalho simplificada.",
          "detalhes": {
            "objetivo": "Relacionar ferramentas a etapas de desenvolvimento.",
            "porque": "O aluno precisa entender o processo antes de configurar ambientes mais complexos.",
            "ordem": "Planejar → escrever → executar → corrigir/versionar → distribuir.",
            "erroComum": "Achar que build/distribuição acontece antes dos testes.",
            "conferir": "Mostre e oculte a lista.",
            "explicacaoSimples": "O botão revela uma sequência de trabalho simplificada.",
            "exemploPratico": "Clique em “Mostrar fluxo” e relacione cada etapa com uma ferramenta que você já conhece."
          },
          "termos": [
            "versionamento",
            "build"
          ],
          "focoVisual": "planejar"
        }
      ],
      "css": [
        {
          "titulo": "Base e grade",
          "linhas": [
            1,
            11
          ],
          "explicacao": "A grade organiza quatro categorias de ferramentas.",
          "detalhes": {
            "objetivo": "Criar leitura comparativa.",
            "porque": "O layout precisa manter clareza em telas diferentes.",
            "ordem": "Base → grade → cartões.",
            "erroComum": "Usar colunas fixas que causam overflow.",
            "conferir": "Compare desktop e celular.",
            "explicacaoSimples": "A grade organiza quatro categorias de ferramentas.",
            "exemploPratico": "Clique em “Mostrar fluxo” e relacione cada etapa com uma ferramenta que você já conhece."
          },
          "termos": [
            "grid"
          ],
          "focoVisual": "editar"
        },
        {
          "titulo": "Fluxo e estado oculto",
          "linhas": [
            12,
            18
          ],
          "explicacao": "A lista possui estilo próprio e respeita o atributo hidden.",
          "detalhes": {
            "objetivo": "Visualizar conteúdo controlado por JavaScript.",
            "porque": "Interfaces móveis frequentemente revelam informações sob demanda.",
            "ordem": "O CSS estiliza a lista visível e preserva hidden.",
            "erroComum": "Usar display que anule o atributo hidden.",
            "conferir": "Clique no botão e confira.",
            "explicacaoSimples": "A lista possui estilo próprio e respeita o atributo hidden.",
            "exemploPratico": "Clique em “Mostrar fluxo” e relacione cada etapa com uma ferramenta que você já conhece."
          },
          "termos": [
            "hidden"
          ],
          "focoVisual": "testar"
        },
        {
          "titulo": "Tela pequena",
          "linhas": [
            19,
            19
          ],
          "explicacao": "A grade passa a uma coluna e o botão cresce.",
          "detalhes": {
            "objetivo": "Manter conforto em largura reduzida.",
            "porque": "Ferramentas precisam continuar legíveis no celular.",
            "ordem": "Breakpoint sobrescreve a grade.",
            "erroComum": "Manter duas colunas estreitas.",
            "conferir": "Teste modo Celular.",
            "explicacaoSimples": "A grade passa a uma coluna e o botão cresce.",
            "exemploPratico": "Clique em “Mostrar fluxo” e relacione cada etapa com uma ferramenta que você já conhece."
          },
          "termos": [
            "media"
          ],
          "focoVisual": "testar"
        }
      ],
      "js": [
        {
          "titulo": "Elementos do fluxo",
          "linhas": [
            1,
            3
          ],
          "explicacao": "O script localiza botão, lista e mensagem.",
          "detalhes": {
            "objetivo": "Preparar os elementos que mudarão.",
            "porque": "A interação depende dessas referências.",
            "ordem": "Seletores antes do evento.",
            "erroComum": "ID incorreto.",
            "conferir": "Compare com HTML.",
            "explicacaoSimples": "O script localiza botão, lista e mensagem.",
            "exemploPratico": "Clique em “Mostrar fluxo” e relacione cada etapa com uma ferramenta que você já conhece."
          },
          "termos": [
            "querySelector"
          ],
          "focoVisual": "testar"
        },
        {
          "titulo": "Alternância de estado",
          "linhas": [
            5,
            11
          ],
          "explicacao": "O evento lê hidden, alterna visibilidade e atualiza rótulos.",
          "detalhes": {
            "objetivo": "Entender estado simples de interface.",
            "porque": "Mostrar/ocultar conteúdo será recorrente em navegação mobile.",
            "ordem": "Ler estado → inverter → atualizar feedback.",
            "erroComum": "Inverter a lógica de hidden.",
            "conferir": "Clique duas vezes e confirme os dois estados.",
            "explicacaoSimples": "O evento lê hidden, alterna visibilidade e atualiza rótulos.",
            "exemploPratico": "Clique em “Mostrar fluxo” e relacione cada etapa com uma ferramenta que você já conhece."
          },
          "termos": [
            "hidden",
            "classList",
            "textContent"
          ],
          "focoVisual": "versionar"
        }
      ],
      "readme": [
        {
          "titulo": "Mapa de ferramentas",
          "linhas": [
            1,
            16
          ],
          "explicacao": "O README relaciona ferramentas que aparecerão ao longo da disciplina.",
          "detalhes": {
            "objetivo": "Criar visão de longo prazo.",
            "porque": "Ajuda a entender por que cada ferramenta será introduzida em uma fase diferente.",
            "ordem": "Leia função antes do nome da ferramenta.",
            "erroComum": "Instalar tudo sem saber para que serve.",
            "conferir": "Associe cada ferramenta a uma etapa.",
            "explicacaoSimples": "O README relaciona ferramentas que aparecerão ao longo da disciplina.",
            "exemploPratico": "Clique em “Mostrar fluxo” e relacione cada etapa com uma ferramenta que você já conhece."
          },
          "termos": [
            "heading"
          ],
          "focoVisual": "sdk"
        },
        {
          "titulo": "Próximas fases",
          "linhas": [
            17,
            20
          ],
          "explicacao": "A documentação deixa explícito que responsividade e ergonomia vêm antes de React Native.",
          "detalhes": {
            "objetivo": "Compreender a sequência pedagógica da disciplina.",
            "porque": "Framework não substitui fundamentos de interface mobile.",
            "ordem": "Fundamentos → interface → JS → recursos → frameworks.",
            "erroComum": "Pular diretamente para React Native.",
            "conferir": "Explique por que responsividade vem antes.",
            "explicacaoSimples": "A documentação deixa explícito que responsividade e ergonomia vêm antes de React Native.",
            "exemploPratico": "Clique em “Mostrar fluxo” e relacione cada etapa com uma ferramenta que você já conhece."
          },
          "termos": [
            "code"
          ],
          "focoVisual": "build"
        }
      ]
    },
    "ordemArquivos": [
      "html",
      "css",
      "js",
      "readme"
    ],
    "tempoMinimoSegundos": 300,
    "validacao": {
      "strictDeclarations": false,
      "aceitarEquivalencias": true,
      "htmlEstrutura": {
        "idsObrigatorios": [
          "titulo-ferramentas",
          "mostrarFluxoDesenvolvimento",
          "fluxoDesenvolvimento",
          "statusFluxo"
        ],
        "tagsMinimas": {
          "header": 1,
          "main": 1,
          "section": 1,
          "article": 1,
          "ol": 1,
          "li": 3,
          "button": 1,
          "footer": 1
        },
        "referenciasArquivos": {
          "css": "estilo.css",
          "js": "script.js"
        },
        "seletoresObrigatorios": [
          {
            "selector": "meta[name=\"viewport\"]",
            "message": "Mantenha o meta viewport."
          },
          {
            "selector": "#fluxoDesenvolvimento[hidden]",
            "message": "A lista deve iniciar recolhida."
          },
          {
            "selector": "#statusFluxo[aria-live=\"polite\"]",
            "message": "Mantenha o status acessível."
          }
        ]
      },
      "markdownEstrutura": {
        "codigoExercicio": "MOB04",
        "minimoCaracteres": 80,
        "conteudosObrigatorios": [
          "VS Code",
          "Git"
        ]
      },
      "politica": "conceitos_essenciais"
    },
    "files": [
      {
        "filename": "index.html",
        "language": "html"
      },
      {
        "filename": "estilo.css",
        "language": "css"
      },
      {
        "filename": "script.js",
        "language": "javascript"
      },
      {
        "filename": "README.md",
        "language": "markdown"
      }
    ]
  },
  "programacao-mobile-sub:5": {
    "subject": "programacao-mobile-sub",
    "numero": 5,
    "titulo": "Exercício 05 — Primeira interface Android: texto, botão e interação",
    "objetivo": "Criar uma primeira interface Android em Kotlin com texto, botão e resposta a toque.",
    "modulo": "Android com Kotlin",
    "tempoEstimado": "30–40 min",
    "files": [
      {
        "filename": "MainActivity.kt",
        "language": "kotlin"
      }
    ]
  },
  "inovacao-tecnologica-empreendedorismo:1": {
    "subject": "inovacao-tecnologica-empreendedorismo",
    "numero": 1,
    "titulo": "Exercício 01 — Tipos de inovação",
    "objetivo": "Reconhecer diferentes formas de inovar em produtos, serviços, processos e modelos de negócio.",
    "modulo": "Módulo 1 · Fundamentos da inovação",
    "produto": "Classificação comentada de quatro exemplos",
    "conceitos": [
      "produto",
      "serviço",
      "processo",
      "modelo de negócio"
    ],
    "tempoEstimado": "25–35 min",
    "campos": [
      {
        "id": "produto",
        "type": "textarea",
        "label": "Dê um exemplo de inovação em produto.",
        "placeholder": "Explique o que mudou e por que gera valor.",
        "required": true,
        "minChars": 30
      },
      {
        "id": "servico",
        "type": "textarea",
        "label": "Dê um exemplo de inovação em serviço.",
        "placeholder": "Explique a mudança percebida pelo usuário.",
        "required": true,
        "minChars": 30
      },
      {
        "id": "processo",
        "type": "textarea",
        "label": "Dê um exemplo de inovação em processo.",
        "placeholder": "Mostre como o trabalho pode ficar melhor, mais rápido ou mais seguro.",
        "required": true,
        "minChars": 30
      },
      {
        "id": "modelo",
        "type": "textarea",
        "label": "Dê um exemplo de inovação em modelo de negócio.",
        "placeholder": "Explique como a organização passa a entregar ou capturar valor de outro jeito.",
        "required": true,
        "minChars": 30
      }
    ],
    "files": [
      {
        "filename": "atividade.md",
        "language": "markdown"
      }
    ],
    "legacyNumber": 2
  },
  "inovacao-tecnologica-empreendedorismo:2": {
    "subject": "inovacao-tecnologica-empreendedorismo",
    "numero": 2,
    "titulo": "Exercício 02 — Tecnologias emergentes e oportunidades",
    "objetivo": "Relacionar tecnologias atuais a problemas e oportunidades reais.",
    "modulo": "Módulo 1 · Fundamentos da inovação",
    "produto": "Radar de oportunidade tecnológica",
    "conceitos": [
      "IA",
      "IoT",
      "computação em nuvem",
      "automação",
      "realidade aumentada"
    ],
    "tempoEstimado": "25–35 min",
    "campos": [
      {
        "id": "tecnologia",
        "type": "select",
        "label": "Escolha uma tecnologia para analisar.",
        "required": true,
        "options": [
          "Inteligência Artificial",
          "Internet das Coisas (IoT)",
          "Computação em nuvem",
          "Automação",
          "Realidade aumentada/virtual",
          "Outra"
        ]
      },
      {
        "id": "uso",
        "type": "textarea",
        "label": "Onde essa tecnologia já aparece ou poderia aparecer?",
        "placeholder": "Descreva um contexto real.",
        "required": true,
        "minChars": 30
      },
      {
        "id": "oportunidade",
        "type": "textarea",
        "label": "Que problema ela poderia ajudar a resolver?",
        "placeholder": "Explique o problema e o possível benefício.",
        "required": true,
        "minChars": 40
      },
      {
        "id": "risco",
        "type": "textarea",
        "label": "Que cuidado, limitação ou risco precisa ser considerado?",
        "placeholder": "Pode envolver custo, privacidade, segurança, acesso, ética etc.",
        "required": true,
        "minChars": 30
      }
    ],
    "files": [
      {
        "filename": "atividade.md",
        "language": "markdown"
      }
    ],
    "legacyNumber": 3
  },
  "inovacao-tecnologica-empreendedorismo:3": {
    "subject": "inovacao-tecnologica-empreendedorismo",
    "numero": 3,
    "titulo": "Exercício 03 — Entrevista de descoberta",
    "objetivo": "Planejar perguntas que validem o problema sem induzir respostas.",
    "modulo": "Módulo 2 · Problema e usuário",
    "produto": "Roteiro de entrevista",
    "conceitos": [
      "entrevista",
      "pesquisa",
      "descoberta",
      "evidência"
    ],
    "tempoEstimado": "25–35 min",
    "campos": [
      {
        "id": "objetivo",
        "type": "textarea",
        "label": "O que você precisa descobrir com a entrevista?",
        "placeholder": "Defina o foco da conversa.",
        "required": true,
        "minChars": 30
      },
      {
        "id": "perguntas",
        "type": "textarea",
        "label": "Escreva pelo menos cinco perguntas abertas.",
        "placeholder": "Evite perguntas que já indiquem a resposta desejada.",
        "required": true,
        "minChars": 80
      },
      {
        "id": "registro",
        "type": "textarea",
        "label": "Como você registraria as respostas e padrões encontrados?",
        "placeholder": "Explique uma forma simples e organizada.",
        "required": true,
        "minChars": 25
      }
    ],
    "files": [
      {
        "filename": "atividade.md",
        "language": "markdown"
      }
    ],
    "legacyNumber": 9
  },
  "inovacao-tecnologica-empreendedorismo:4": {
    "subject": "inovacao-tecnologica-empreendedorismo",
    "numero": 4,
    "titulo": "Exercício 04 — Geração de ideias",
    "objetivo": "Gerar alternativas antes de escolher a primeira solução que vier à mente.",
    "modulo": "Módulo 3 · Ideação e proposta de valor",
    "produto": "Lista ampla de ideias",
    "conceitos": [
      "brainstorming",
      "divergência",
      "criatividade"
    ],
    "tempoEstimado": "25–35 min",
    "campos": [
      {
        "id": "ideias",
        "type": "textarea",
        "label": "Gere pelo menos oito ideias de solução para o problema escolhido.",
        "placeholder": "Podem ser simples, ousadas, digitais ou não. Uma por linha.",
        "required": true,
        "minChars": 100
      },
      {
        "id": "inusitada",
        "type": "textarea",
        "label": "Qual ideia é a mais diferente ou inesperada? Por quê?",
        "placeholder": "Explique o potencial dela.",
        "required": true,
        "minChars": 30
      }
    ],
    "files": [
      {
        "filename": "atividade.md",
        "language": "markdown"
      }
    ],
    "legacyNumber": 11
  },
  "inovacao-tecnologica-empreendedorismo:5": {
    "subject": "inovacao-tecnologica-empreendedorismo",
    "numero": 5,
    "titulo": "Exercício 05 — Preço e percepção de valor",
    "objetivo": "Relacionar preço, custo, público e valor percebido.",
    "modulo": "Módulo 6 · Viabilidade e operação",
    "produto": "Hipótese de preço",
    "conceitos": [
      "preço",
      "valor percebido",
      "concorrência",
      "posicionamento"
    ],
    "tempoEstimado": "25–35 min",
    "campos": [
      {
        "id": "entrega",
        "type": "textarea",
        "label": "O que exatamente o cliente recebe ao pagar?",
        "placeholder": "Descreva o pacote, acesso ou serviço.",
        "required": true,
        "minChars": 30
      },
      {
        "id": "preco",
        "type": "number",
        "label": "Qual seria um preço inicial de teste (R$)?",
        "placeholder": "0.00",
        "required": true,
        "min": 0,
        "step": "0.01"
      },
      {
        "id": "justificativa",
        "type": "textarea",
        "label": "Por que esse preço faria sentido?",
        "placeholder": "Considere custo, alternativas, benefício e capacidade de pagamento.",
        "required": true,
        "minChars": 40
      },
      {
        "id": "teste",
        "type": "textarea",
        "label": "Como você validaria se o preço está adequado?",
        "placeholder": "Entrevista, pré-venda, comparação, experimento etc.",
        "required": true,
        "minChars": 30
      }
    ],
    "files": [
      {
        "filename": "atividade.md",
        "language": "markdown"
      }
    ],
    "legacyNumber": 25
  },
  "inovacao-tecnologica-empreendedorismo:6": {
    "subject": "inovacao-tecnologica-empreendedorismo",
    "numero": 6,
    "titulo": "Exercício 06 — Viabilidade financeira simplificada",
    "objetivo": "Fazer uma primeira estimativa de receita, custo e resultado sem tratar projeções como certeza.",
    "modulo": "Módulo 6 · Viabilidade e operação",
    "produto": "Simulação financeira básica",
    "conceitos": [
      "receita",
      "custo",
      "resultado",
      "ponto de equilíbrio"
    ],
    "tempoEstimado": "30–40 min",
    "campos": [
      {
        "id": "clientes",
        "type": "number",
        "label": "Quantidade estimada de clientes/unidades no mês",
        "placeholder": "10",
        "required": true,
        "min": 0,
        "step": "1"
      },
      {
        "id": "preco",
        "type": "number",
        "label": "Preço médio por cliente/unidade (R$)",
        "placeholder": "20.00",
        "required": true,
        "min": 0,
        "step": "0.01"
      },
      {
        "id": "fixos",
        "type": "number",
        "label": "Custos fixos mensais estimados (R$)",
        "placeholder": "100.00",
        "required": true,
        "min": 0,
        "step": "0.01"
      },
      {
        "id": "variavel",
        "type": "number",
        "label": "Custo variável por cliente/unidade (R$)",
        "placeholder": "2.00",
        "required": true,
        "min": 0,
        "step": "0.01"
      },
      {
        "id": "analise",
        "type": "textarea",
        "label": "Depois de calcular, o que precisaria mudar para melhorar a viabilidade?",
        "placeholder": "Preço, quantidade, custo, escopo, canal...",
        "required": true,
        "minChars": 30
      }
    ],
    "files": [
      {
        "filename": "atividade.md",
        "language": "markdown"
      }
    ],
    "legacyNumber": 26
  },
  "analise-metodo-sistemas:1": {
    "subject": "analise-metodo-sistemas",
    "numero": 1,
    "titulo": "Problema, Público e Proposta de Solução",
    "objetivo": "Identificar problema, público afetado, contexto, objetivo e proposta de solução para um sistema.",
    "modulo": "Análise e Método para Sistemas",
    "produto": "Registro estruturado da análise",
    "conceitos": [
      "problema",
      "público",
      "contexto",
      "objetivo",
      "proposta de solução"
    ],
    "tempoEstimado": "25–35 min",
    "orientacao": "Use a referência à esquerda como estrutura de apoio e desenvolva sua própria análise no arquivo atividade.md.",
    "files": [
      {
        "filename": "atividade.md",
        "language": "markdown"
      }
    ]
  },
  "analise-metodo-sistemas:2": {
    "subject": "analise-metodo-sistemas",
    "numero": 2,
    "titulo": "Métodos Ágil x Waterfall — qual escolher?",
    "objetivo": "Comparar abordagem tradicional (Waterfall/Cascata) e abordagem ágil e justificar a escolha em diferentes cenários.",
    "modulo": "Análise e Método para Sistemas",
    "produto": "Registro estruturado da análise",
    "conceitos": [
      "Waterfall",
      "Cascata",
      "Ágil",
      "Híbrido",
      "justificativa"
    ],
    "tempoEstimado": "25–35 min",
    "orientacao": "Use a referência à esquerda como estrutura de apoio e desenvolva sua própria análise no arquivo atividade.md.",
    "files": [
      {
        "filename": "atividade.md",
        "language": "markdown"
      }
    ]
  },
  "analise-metodo-sistemas:3": {
    "subject": "analise-metodo-sistemas",
    "numero": 3,
    "titulo": "Documentação e Rastreabilidade de um Sistema",
    "objetivo": "Organizar decisões, versões, tarefas, testes, evidências e mudanças para manter a rastreabilidade de um sistema.",
    "modulo": "Análise e Método para Sistemas",
    "produto": "Registro estruturado da análise",
    "conceitos": [
      "requisito",
      "decisão",
      "tarefa",
      "versão",
      "teste",
      "evidência"
    ],
    "tempoEstimado": "25–35 min",
    "orientacao": "Use a referência à esquerda como estrutura de apoio e desenvolva sua própria análise no arquivo atividade.md.",
    "files": [
      {
        "filename": "atividade.md",
        "language": "markdown"
      }
    ]
  },
  "analise-metodo-sistemas:4": {
    "subject": "analise-metodo-sistemas",
    "numero": 4,
    "titulo": "Segurança na Análise de Sistemas",
    "objetivo": "Analisar requisitos de autenticação, autorização, proteção de dados, auditoria e recuperação em um sistema.",
    "modulo": "Análise e Método para Sistemas",
    "produto": "Registro estruturado da análise",
    "conceitos": [
      "autenticação",
      "autorização",
      "proteção de dados",
      "auditoria",
      "recuperação"
    ],
    "tempoEstimado": "25–35 min",
    "orientacao": "Use a referência à esquerda como estrutura de apoio e desenvolva sua própria análise no arquivo atividade.md.",
    "files": [
      {
        "filename": "atividade.md",
        "language": "markdown"
      }
    ]
  },
  "analise-metodo-sistemas:5": {
    "subject": "analise-metodo-sistemas",
    "numero": 5,
    "titulo": "Auditoria de um Sistema Real",
    "objetivo": "Avaliar um sistema com critérios de funcionamento, clareza, acessibilidade, desempenho, segurança e evidências.",
    "modulo": "Análise e Método para Sistemas",
    "produto": "Registro estruturado da análise",
    "conceitos": [
      "funcionamento",
      "clareza",
      "acessibilidade",
      "desempenho",
      "segurança",
      "evidência"
    ],
    "tempoEstimado": "25–35 min",
    "orientacao": "Use a referência à esquerda como estrutura de apoio e desenvolva sua própria análise no arquivo atividade.md.",
    "files": [
      {
        "filename": "atividade.md",
        "language": "markdown"
      }
    ]
  }
};
