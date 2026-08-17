// Reforço v4: etapas adicionais de maior complexidade para garantir progressão e prática.
export const GUIDED_REINFORCEMENT_V4 = {
  "1ADM-01": [
    {
      "type": "quiz",
      "title": "Revisão aplicada: estrutura e endereços",
      "description": "Analise situações em que arquivo, aba, intervalo e permissões podem ser confundidos.",
      "questions": [
        {
          "q": "Uma pasta de trabalho chamada Controle_2026 possui abas Produtos, Entradas e Resumo. O que “Resumo” representa?",
          "options": [
            "Outro arquivo no Drive",
            "Uma aba dentro do mesmo arquivo",
            "Um intervalo nomeado",
            "Uma permissão de compartilhamento"
          ],
          "answer": 1,
          "why": "Aba é uma página interna da mesma pasta de trabalho.",
          "difficulty": "intermediate"
        },
        {
          "q": "O intervalo B3:D7 contém quantas células?",
          "options": [
            "12",
            "15",
            "20",
            "21"
          ],
          "answer": 1,
          "why": "São 3 colunas por 5 linhas: 15 células.",
          "difficulty": "intermediate"
        },
        {
          "q": "Qual referência representa da coluna F, linha 12 até coluna H, linha 18?",
          "options": [
            "F12:H18",
            "12F:18H",
            "F12-F18",
            "H18:F12 apenas"
          ],
          "answer": 0,
          "why": "Intervalos usam célula inicial, dois-pontos e célula final.",
          "difficulty": "intermediate"
        },
        {
          "q": "Você precisa compartilhar uma planilha para que a pedagoga apenas deixe observações. Qual permissão é mais adequada?",
          "options": [
            "Leitor",
            "Comentador",
            "Editor",
            "Proprietário"
          ],
          "answer": 1,
          "why": "Comentador permite observações sem alteração direta dos dados.",
          "difficulty": "intermediate"
        },
        {
          "q": "Ao renomear a aba “Planilha1” para “Movimentações”, o que acontece com o arquivo?",
          "options": [
            "O arquivo inteiro muda de nome",
            "Apenas a página interna muda de nome",
            "Uma cópia é criada",
            "As fórmulas são apagadas"
          ],
          "answer": 1,
          "why": "Nome do arquivo e nome da aba são elementos diferentes.",
          "difficulty": "intermediate"
        },
        {
          "q": "Qual prática reduz confusão em uma planilha com vários setores?",
          "options": [
            "Usar nomes de abas como Aba1, Aba2 e Aba3",
            "Usar nomes curtos e descritivos, como Vendas e Estoque",
            "Criar um arquivo para cada linha",
            "Colocar todos os dados em uma única célula"
          ],
          "answer": 1,
          "why": "Nomes descritivos facilitam navegação e manutenção.",
          "difficulty": "intermediate"
        }
      ]
    },
    {
      "type": "challenge",
      "title": "Missão de auditoria da planilha",
      "description": "Você recebeu uma planilha desorganizada. Escolha a ação tecnicamente correta em cada situação.",
      "questions": [
        {
          "q": "A fórmula usa Dados!C5. O termo “Dados” indica:",
          "options": [
            "Nome do arquivo",
            "Nome da aba",
            "Nome do usuário",
            "Tipo de dado"
          ],
          "answer": 1,
          "why": "Referência com exclamação aponta para uma aba.",
          "difficulty": "advanced"
        },
        {
          "q": "O arquivo precisa ser editado por duas pessoas e apenas consultado por quinze. Qual configuração é adequada?",
          "options": [
            "Editor para todos",
            "Editor para as duas responsáveis e leitor para os demais",
            "Comentador para todos e proprietário para o aluno",
            "Qualquer pessoa com link como editor"
          ],
          "answer": 1,
          "why": "Permissão deve seguir a necessidade de cada grupo.",
          "difficulty": "advanced"
        },
        {
          "q": "Ao selecionar A1:C3, qual célula NÃO pertence ao intervalo?",
          "options": [
            "B2",
            "C3",
            "A3",
            "D2"
          ],
          "answer": 3,
          "why": "D2 está fora das colunas A a C.",
          "difficulty": "advanced"
        },
        {
          "q": "Qual nome de aba é mais adequado para registros diários de entradas e saídas?",
          "options": [
            "Coisas",
            "Planilha2",
            "Movimentações",
            "Teste final novo"
          ],
          "answer": 2,
          "why": "Movimentações descreve diretamente a finalidade.",
          "difficulty": "advanced"
        },
        {
          "q": "Uma pessoa recebe o link, mas vê “Acesso negado”. Qual verificação deve ser feita primeiro?",
          "options": [
            "Cor da aba",
            "Permissão associada ao e-mail ou ao link",
            "Tamanho da fonte",
            "Quantidade de linhas"
          ],
          "answer": 1,
          "why": "Link e permissão são controles diferentes.",
          "difficulty": "advanced"
        },
        {
          "q": "Qual é a principal vantagem de manter abas separadas para Dados e Resumo?",
          "options": [
            "Aumentar o número de cores",
            "Separar base de registro da análise, reduzindo alterações acidentais",
            "Evitar qualquer fórmula",
            "Transformar a planilha em documento"
          ],
          "answer": 1,
          "why": "Separar base e análise melhora organização e segurança.",
          "difficulty": "advanced"
        }
      ],
      "badge": "Arquiteto de Planilhas"
    }
  ],
  "1ADM-02": [
    {
      "type": "quiz",
      "title": "Revisão aplicada: formatação com propósito",
      "description": "Escolha formatações que melhorem leitura sem transformar a tabela em decoração.",
      "questions": [
        {
          "q": "Qual combinação cria melhor hierarquia para um título principal?",
          "options": [
            "Fonte pequena, itálico e cinza claro",
            "Fonte maior, negrito e contraste suficiente",
            "Todas as letras com cores diferentes",
            "Borda em cada palavra"
          ],
          "answer": 1,
          "why": "Hierarquia depende de tamanho, peso e contraste.",
          "difficulty": "intermediate"
        },
        {
          "q": "Em uma base de dados, por que mesclar células no meio da tabela pode ser prejudicial?",
          "options": [
            "Porque aumenta o preço do arquivo",
            "Porque dificulta filtros, ordenação e seleção de registros",
            "Porque impede negrito",
            "Porque altera o sistema operacional"
          ],
          "answer": 1,
          "why": "Mesclagem quebra a estrutura tabular.",
          "difficulty": "intermediate"
        },
        {
          "q": "Qual uso de cor é mais funcional?",
          "options": [
            "Uma cor aleatória por linha",
            "Cores consistentes para cabeçalho, alerta e total",
            "Fundo escuro com texto escuro",
            "Dez cores sem legenda"
          ],
          "answer": 1,
          "why": "Cores devem representar funções reconhecíveis.",
          "difficulty": "intermediate"
        },
        {
          "q": "Uma coluna mostra valores monetários. Qual formato é mais adequado?",
          "options": [
            "Texto simples",
            "Moeda com duas casas decimais",
            "Porcentagem",
            "Data"
          ],
          "answer": 1,
          "why": "Formato monetário comunica unidade e precisão.",
          "difficulty": "intermediate"
        },
        {
          "q": "Qual recurso ajuda a manter o cabeçalho visível ao rolar muitos registros?",
          "options": [
            "Congelar linha",
            "Mesclar todas as células",
            "Ocultar a planilha",
            "Converter em imagem"
          ],
          "answer": 0,
          "why": "Congelamento mantém referência visual.",
          "difficulty": "intermediate"
        },
        {
          "q": "Ao imprimir, parte da tabela fica fora da página. Qual ajuste é mais coerente?",
          "options": [
            "Aumentar todas as fontes",
            "Revisar orientação, margens e escala de impressão",
            "Adicionar mais colunas vazias",
            "Apagar o cabeçalho"
          ],
          "answer": 1,
          "why": "Configurações de página devem ser ajustadas ao conteúdo.",
          "difficulty": "intermediate"
        }
      ]
    },
    {
      "type": "challenge",
      "title": "Missão: relatório profissional",
      "description": "Avalie detalhes de uma planilha que será apresentada à direção.",
      "questions": [
        {
          "q": "O total geral aparece no meio dos registros com a mesma formatação. Qual melhoria é mais adequada?",
          "options": [
            "Ocultar o total",
            "Separar a linha de total e usar destaque consistente",
            "Usar fonte decorativa",
            "Duplicar o total em todas as linhas"
          ],
          "answer": 1,
          "why": "Separação e destaque facilitam interpretação.",
          "difficulty": "advanced"
        },
        {
          "q": "Qual contraste tende a ser inadequado para leitura?",
          "options": [
            "Texto preto em fundo branco",
            "Texto branco em azul escuro",
            "Texto amarelo claro em fundo branco",
            "Texto azul escuro em fundo claro"
          ],
          "answer": 2,
          "why": "Baixo contraste prejudica leitura.",
          "difficulty": "advanced"
        },
        {
          "q": "Uma tabela usa vermelho e verde para status. Qual complemento melhora acessibilidade?",
          "options": [
            "Remover todos os status",
            "Adicionar texto ou ícones além da cor",
            "Usar apenas tons mais claros",
            "Aumentar o número de cores"
          ],
          "answer": 1,
          "why": "Não se deve depender somente da percepção de cor.",
          "difficulty": "advanced"
        },
        {
          "q": "Por que bordas muito grossas em todas as células podem ser ruins?",
          "options": [
            "Podem competir visualmente com os dados e reduzir hierarquia",
            "Impedem fórmulas",
            "Excluem linhas",
            "Desativam filtros"
          ],
          "answer": 0,
          "why": "Bordas devem orientar, não dominar o conteúdo.",
          "difficulty": "advanced"
        },
        {
          "q": "Qual alinhamento costuma ser mais legível para valores numéricos comparáveis?",
          "options": [
            "Cada célula em um alinhamento",
            "Alinhamento consistente, normalmente à direita",
            "Sempre centralizado",
            "Sempre inclinado"
          ],
          "answer": 1,
          "why": "Consistência favorece comparação de dígitos.",
          "difficulty": "advanced"
        },
        {
          "q": "Uma fonte decorativa foi aplicada em 800 linhas. Qual problema principal?",
          "options": [
            "A planilha terá menos células",
            "Legibilidade e profissionalismo podem ser prejudicados",
            "As fórmulas mudarão",
            "O arquivo vira PDF"
          ],
          "answer": 1,
          "why": "Fontes decorativas não são adequadas para grande volume de dados.",
          "difficulty": "advanced"
        }
      ],
      "badge": "Designer de Dados"
    }
  ],
  "1ADM-03": [
    {
      "type": "quiz",
      "title": "Revisão aplicada: operações e referências",
      "description": "Escolha expressões que produzam resultados automáticos e reutilizáveis.",
      "questions": [
        {
          "q": "Quantidade em B2 e valor unitário em C2. Qual fórmula calcula o total?",
          "options": [
            "=B2+C2",
            "=B2*C2",
            "=B2/C2",
            "=B2-C2"
          ],
          "answer": 1,
          "why": "Total por item é quantidade multiplicada pelo valor unitário.",
          "difficulty": "intermediate"
        },
        {
          "q": "Estoque inicial em B2, entradas em C2 e saídas em D2. Qual fórmula calcula estoque atual?",
          "options": [
            "=B2+C2-D2",
            "=B2-C2+D2",
            "=B2*C2/D2",
            "=SOMA(B2:D2)"
          ],
          "answer": 0,
          "why": "Entradas aumentam e saídas reduzem o estoque.",
          "difficulty": "intermediate"
        },
        {
          "q": "Valor total em D2 e número de parcelas em E2. Qual fórmula calcula valor da parcela?",
          "options": [
            "=D2*E2",
            "=D2/E2",
            "=E2/D2",
            "=D2-E2"
          ],
          "answer": 1,
          "why": "Divisão distribui o total pela quantidade de parcelas.",
          "difficulty": "intermediate"
        },
        {
          "q": "Qual fórmula atualiza automaticamente se B2 ou C2 mudar?",
          "options": [
            "=10*20",
            "=B2*C2",
            "200",
            "\"B2*C2\""
          ],
          "answer": 1,
          "why": "Referências mantêm a fórmula ligada aos dados.",
          "difficulty": "intermediate"
        },
        {
          "q": "Em =B2*(1+C2), C2 representa melhor:",
          "options": [
            "Um desconto ou acréscimo em formato decimal",
            "Uma linha inteira",
            "O nome da aba",
            "Uma senha"
          ],
          "answer": 0,
          "why": "Somar 1 ao percentual cria o fator de acréscimo.",
          "difficulty": "intermediate"
        },
        {
          "q": "Qual símbolo deve iniciar uma fórmula?",
          "options": [
            "#",
            "=",
            "@",
            "&"
          ],
          "answer": 1,
          "why": "O sinal de igualdade informa à planilha que haverá cálculo.",
          "difficulty": "intermediate"
        }
      ]
    },
    {
      "type": "challenge",
      "title": "Missão: cálculo administrativo",
      "description": "Interprete fórmulas com mais de uma operação.",
      "questions": [
        {
          "q": "Custo em B2 e margem em C2. Qual fórmula calcula preço de venda com margem sobre o custo?",
          "options": [
            "=B2*(1+C2)",
            "=B2+C2",
            "=B2/C2",
            "=C2-B2"
          ],
          "answer": 0,
          "why": "O fator 1+C2 aplica o percentual ao custo.",
          "difficulty": "advanced"
        },
        {
          "q": "Receita em B2 e despesa em C2. Margem sobre receita é:",
          "options": [
            "=(B2-C2)/B2",
            "=B2-C2/B2",
            "=B2/(B2-C2)",
            "=C2/B2+1"
          ],
          "answer": 0,
          "why": "Primeiro calcula-se o resultado e depois divide-se pela receita.",
          "difficulty": "advanced"
        },
        {
          "q": "Qual fórmula calcula 10% de desconto sobre D2?",
          "options": [
            "=D2*10",
            "=D2*(1-10%)",
            "=D2/10%",
            "=D2+10%"
          ],
          "answer": 1,
          "why": "1-10% mantém 90% do valor.",
          "difficulty": "advanced"
        },
        {
          "q": "Por que =B2+C2*D2 pode diferir de =(B2+C2)*D2?",
          "options": [
            "Por causa da prioridade da multiplicação",
            "Porque parênteses não funcionam",
            "Porque + não é operador",
            "Porque D2 vira texto"
          ],
          "answer": 0,
          "why": "Multiplicação ocorre antes da soma quando não há parênteses.",
          "difficulty": "advanced"
        },
        {
          "q": "Uma fórmula copiada para baixo deve mudar B2 para B3, mas manter taxa em F1. Qual versão é correta?",
          "options": [
            "=B2*$F$1",
            "=B$2*F1",
            "=$B$2*$F$1",
            "=B2*F1"
          ],
          "answer": 0,
          "why": "B2 é relativo e $F$1 permanece fixo.",
          "difficulty": "advanced"
        },
        {
          "q": "Se E2 for zero, =D2/E2 produz:",
          "options": [
            "0",
            "Erro de divisão por zero",
            "D2",
            "Uma célula vazia"
          ],
          "answer": 1,
          "why": "Divisão por zero não é definida.",
          "difficulty": "advanced"
        }
      ],
      "badge": "Analista de Cálculos"
    }
  ],
  "1ADM-04": [
    {
      "type": "quiz",
      "title": "Revisão aplicada: resumindo dados",
      "description": "Escolha a função adequada e observe detalhes de intervalo.",
      "questions": [
        {
          "q": "Qual função retorna o maior valor sem informar sua posição?",
          "options": [
            "MÁXIMO",
            "MAIOR com segundo argumento",
            "MÉDIA",
            "CONT.SE"
          ],
          "answer": 0,
          "why": "MÁXIMO devolve o maior número do intervalo.",
          "difficulty": "intermediate"
        },
        {
          "q": "Qual fórmula calcula a média de C2:C20?",
          "options": [
            "=SOMA(C2:C20)",
            "=MÉDIA(C2:C20)",
            "=MÁXIMO(C2:C20)",
            "=C2:C20/19"
          ],
          "answer": 1,
          "why": "MÉDIA realiza soma dividida pela quantidade de valores numéricos.",
          "difficulty": "intermediate"
        },
        {
          "q": "Por que =SOMA(B2-B10) está incorreta para um intervalo?",
          "options": [
            "Porque usa hífen em vez de dois-pontos",
            "Porque SOMA não aceita números",
            "Porque faltam aspas",
            "Porque B10 não existe"
          ],
          "answer": 0,
          "why": "Intervalos contínuos usam dois-pontos.",
          "difficulty": "intermediate"
        },
        {
          "q": "Qual função é adequada para descobrir o menor estoque registrado?",
          "options": [
            "MÍNIMO",
            "MÉDIA",
            "SOMA",
            "CONT.SE"
          ],
          "answer": 0,
          "why": "MÍNIMO retorna o menor valor.",
          "difficulty": "intermediate"
        },
        {
          "q": "Se uma célula do intervalo contém texto, MÉDIA geralmente:",
          "options": [
            "Conta o texto como zero sempre",
            "Ignora texto não numérico em células do intervalo",
            "Apaga o texto",
            "Converte qualquer palavra em número"
          ],
          "answer": 1,
          "why": "Textos em referências de intervalo não entram como números.",
          "difficulty": "intermediate"
        },
        {
          "q": "Qual fórmula soma duas faixas separadas?",
          "options": [
            "=SOMA(B2:B10;D2:D10)",
            "=SOMA(B2:D10)",
            "=B2:B10+D2:D10",
            "=SOMA(B2-B10-D2-D10)"
          ],
          "answer": 0,
          "why": "SOMA pode receber vários argumentos separados por ponto e vírgula.",
          "difficulty": "intermediate"
        }
      ]
    },
    {
      "type": "challenge",
      "title": "Missão: indicadores consistentes",
      "description": "Analise resultados e armadilhas comuns.",
      "questions": [
        {
          "q": "Uma média de vendas aumentou porque uma venda excepcional foi muito alta. Qual medida adicional ajuda a interpretar?",
          "options": [
            "Somente MÁXIMO",
            "Mediana e distribuição dos valores",
            "Cor da célula",
            "Quantidade de abas"
          ],
          "answer": 1,
          "why": "Média pode ser influenciada por valores extremos.",
          "difficulty": "advanced"
        },
        {
          "q": "Qual fórmula retorna o segundo maior valor de B2:B20?",
          "options": [
            "=MÁXIMO(B2:B20;2)",
            "=MAIOR(B2:B20;2)",
            "=MÉDIA(B2:B20;2)",
            "=MÍNIMO(B2:B20;2)"
          ],
          "answer": 1,
          "why": "MAIOR recebe o intervalo e a posição desejada.",
          "difficulty": "advanced"
        },
        {
          "q": "Se B2:B10 contém células vazias, MÉDIA:",
          "options": [
            "Divide sempre por 9",
            "Considera apenas células numéricas",
            "Retorna zero",
            "Não pode ser calculada"
          ],
          "answer": 1,
          "why": "Células vazias não entram na contagem numérica.",
          "difficulty": "advanced"
        },
        {
          "q": "Qual intervalo inclui B2 até B100 sem o cabeçalho em B1?",
          "options": [
            "B1:B100",
            "B2:B100",
            "B2;B100",
            "2B:100B"
          ],
          "answer": 1,
          "why": "O intervalo começa na primeira linha de dados.",
          "difficulty": "advanced"
        },
        {
          "q": "Um total não confere. Qual verificação é mais importante?",
          "options": [
            "Se a fonte está em negrito",
            "Se o intervalo inclui todas as linhas e não inclui totais duplicados",
            "Se a aba tem cor",
            "Se o título está centralizado"
          ],
          "answer": 1,
          "why": "Erros de faixa e totais incluídos novamente são causas comuns.",
          "difficulty": "advanced"
        },
        {
          "q": "Qual função retorna a quantidade de células numéricas em B2:B20?",
          "options": [
            "CONT.NÚM",
            "CONT.SE",
            "SOMA",
            "MÁXIMO"
          ],
          "answer": 0,
          "why": "CONT.NÚM conta células com números.",
          "difficulty": "advanced"
        }
      ],
      "badge": "Analista de Indicadores"
    }
  ],
  "1ADM-05": [
    {
      "type": "quiz",
      "title": "Revisão aplicada: condições completas",
      "description": "Interprete condições e resultados sem inverter a lógica.",
      "questions": [
        {
          "q": "Qual fórmula mostra “REPOR” quando D2 é menor que 8?",
          "options": [
            "=SE(D2<8;\"REPOR\";\"OK\")",
            "=SE(D2>8;\"REPOR\";\"OK\")",
            "=SE(D2=8;\"OK\";\"REPOR\")",
            "=CONT.SE(D2;8)"
          ],
          "answer": 0,
          "why": "A condição verdadeira é estoque abaixo de 8.",
          "difficulty": "intermediate"
        },
        {
          "q": "“Pelo menos 1000” deve ser representado por:",
          "options": [
            ">1000",
            ">=1000",
            "<1000",
            "=0"
          ],
          "answer": 1,
          "why": "Pelo menos inclui 1000 e valores maiores.",
          "difficulty": "intermediate"
        },
        {
          "q": "Em =SE(B2=\"PAGO\";\"FINALIZADO\";\"PENDENTE\"), se B2 contém PAGO, retorna:",
          "options": [
            "PENDENTE",
            "FINALIZADO",
            "PAGO",
            "Erro"
          ],
          "answer": 1,
          "why": "A condição é verdadeira.",
          "difficulty": "intermediate"
        },
        {
          "q": "Qual erro existe em =SE(C2>=7;APROVADO;RECUPERAÇÃO)?",
          "options": [
            "Textos de saída sem aspas",
            "Operador inválido",
            "SE não aceita números",
            "Falta multiplicação"
          ],
          "answer": 0,
          "why": "Textos literais precisam de aspas.",
          "difficulty": "intermediate"
        },
        {
          "q": "Qual fórmula identifica saldo negativo em B2?",
          "options": [
            "=SE(B2<0;\"NEGATIVO\";\"NÃO NEGATIVO\")",
            "=SE(B2>0;\"NEGATIVO\";\"NÃO NEGATIVO\")",
            "=SOMA(B2<0)",
            "=B2-0"
          ],
          "answer": 0,
          "why": "Saldo menor que zero é negativo.",
          "difficulty": "intermediate"
        },
        {
          "q": "O terceiro argumento da função SE é:",
          "options": [
            "A condição",
            "O resultado verdadeiro",
            "O resultado falso",
            "O intervalo de soma"
          ],
          "answer": 2,
          "why": "Após condição e verdadeiro vem o retorno falso.",
          "difficulty": "intermediate"
        }
      ]
    },
    {
      "type": "challenge",
      "title": "Missão: regras empresariais",
      "description": "Escolha fórmulas para decisões com mais detalhes.",
      "questions": [
        {
          "q": "Vencimento em C2 e pagamento em D2. Qual condição indica atraso se não há pagamento e a data venceu?",
          "options": [
            "=SE(E(C2<HOJE();D2=\"\");\"ATRASADO\";\"REGULAR\")",
            "=SE(OU(C2<HOJE();D2=\"\");\"ATRASADO\";\"REGULAR\")",
            "=SE(C2>HOJE();\"ATRASADO\";\"REGULAR\")",
            "=CONT.SE(C2:D2;\"ATRASADO\")"
          ],
          "answer": 0,
          "why": "As duas condições precisam ser verdadeiras, portanto usa E.",
          "difficulty": "advanced"
        },
        {
          "q": "Qual fórmula classifica nota: aprovado >=7, recuperação >=5, senão reprovado?",
          "options": [
            "=SE(B2>=7;\"APROVADO\";SE(B2>=5;\"RECUPERAÇÃO\";\"REPROVADO\"))",
            "=SE(B2>=5;\"APROVADO\";\"REPROVADO\")",
            "=SE(B2<7;\"APROVADO\";\"RECUPERAÇÃO\")",
            "=MÉDIA(B2)"
          ],
          "answer": 0,
          "why": "O segundo SE trata a faixa intermediária.",
          "difficulty": "advanced"
        },
        {
          "q": "Quando usar E dentro de SE?",
          "options": [
            "Quando pelo menos uma condição basta",
            "Quando todas as condições precisam ser verdadeiras",
            "Para somar intervalos",
            "Para concatenar textos"
          ],
          "answer": 1,
          "why": "E só retorna verdadeiro se todas as condições forem verdadeiras.",
          "difficulty": "advanced"
        },
        {
          "q": "Quando usar OU dentro de SE?",
          "options": [
            "Quando qualquer uma das condições pode atender à regra",
            "Quando todas precisam ser verdadeiras",
            "Para criar gráfico",
            "Para ordenar dados"
          ],
          "answer": 0,
          "why": "OU retorna verdadeiro se ao menos uma condição for satisfeita.",
          "difficulty": "advanced"
        },
        {
          "q": "Qual fórmula evita resultado em linha vazia?",
          "options": [
            "=SE(A2=\"\";\"\";B2*C2)",
            "=B2*C2",
            "=SE(A2<>\"\";\"\";B2*C2)",
            "=SOMA(A2:C2)"
          ],
          "answer": 0,
          "why": "Primeiro verifica-se se a linha possui dado identificador.",
          "difficulty": "advanced"
        },
        {
          "q": "Uma regra considera meta atingida entre 1000 e 5000. Qual condição é correta?",
          "options": [
            "E(B2>=1000;B2<=5000)",
            "OU(B2>=1000;B2<=5000)",
            "B2>=1000<=5000",
            "SOMA(B2;1000;5000)"
          ],
          "answer": 0,
          "why": "A faixa exige limite inferior e superior simultaneamente.",
          "difficulty": "advanced"
        }
      ],
      "badge": "Especialista em Regras"
    }
  ],
  "1ADM-06": [
    {
      "type": "quiz",
      "title": "Revisão aplicada: critérios e textos",
      "description": "Diferencie contagem, soma por critério e concatenação.",
      "questions": [
        {
          "q": "Qual função conta quantas células em E2:E50 contêm “PENDENTE”?",
          "options": [
            "=CONT.SE(E2:E50;\"PENDENTE\")",
            "=SOMASE(E2:E50;\"PENDENTE\")",
            "=SOMA(E2:E50)",
            "=SE(E2:E50=\"PENDENTE\")"
          ],
          "answer": 0,
          "why": "CONT.SE conta ocorrências que atendem ao critério.",
          "difficulty": "intermediate"
        },
        {
          "q": "Qual fórmula soma valores em D quando B contém “Vendas”?",
          "options": [
            "=SOMASE(B2:B50;\"Vendas\";D2:D50)",
            "=CONT.SE(B2:B50;\"Vendas\")",
            "=SOMA(B2:D50)",
            "=SE(B2:B50=\"Vendas\";D2:D50)"
          ],
          "answer": 0,
          "why": "SOMASE separa intervalo de critério e intervalo de soma.",
          "difficulty": "intermediate"
        },
        {
          "q": "Qual fórmula une código A2 e descrição B2 com hífen?",
          "options": [
            "=A2&\" - \"&B2",
            "=SOMA(A2;B2)",
            "=A2-B2",
            "=MÉDIA(A2:B2)"
          ],
          "answer": 0,
          "why": "& concatena textos e valores.",
          "difficulty": "intermediate"
        },
        {
          "q": "Qual critério conta valores maiores que 100?",
          "options": [
            "\">100\"",
            "100>",
            "\"=100\"",
            "\"<100\""
          ],
          "answer": 0,
          "why": "Operador e valor ficam em uma string de critério.",
          "difficulty": "intermediate"
        },
        {
          "q": "CONT.SE retorna:",
          "options": [
            "Soma dos valores",
            "Quantidade de células que atendem ao critério",
            "Maior valor",
            "Texto concatenado"
          ],
          "answer": 1,
          "why": "A função conta ocorrências.",
          "difficulty": "intermediate"
        },
        {
          "q": "Em SOMASE(A2:A20;\"RH\";D2:D20), D2:D20 representa:",
          "options": [
            "Intervalo de critérios",
            "Intervalo a somar",
            "Nome da aba",
            "Resultado falso"
          ],
          "answer": 1,
          "why": "O terceiro argumento contém os valores somados.",
          "difficulty": "intermediate"
        }
      ]
    },
    {
      "type": "challenge",
      "title": "Missão: análise por múltiplos critérios",
      "description": "Use funções mais precisas em situações administrativas.",
      "questions": [
        {
          "q": "Qual fórmula conta registros que são “PENDENTE” em C e do setor “Vendas” em B?",
          "options": [
            "=CONT.SES(C2:C100;\"PENDENTE\";B2:B100;\"Vendas\")",
            "=CONT.SE(C2:C100;\"PENDENTE\";B2:B100;\"Vendas\")",
            "=SOMASES(C2:C100;B2:B100;\"Vendas\")",
            "=SOMA(B2:C100)"
          ],
          "answer": 0,
          "why": "CONT.SES trabalha com pares de intervalos e critérios.",
          "difficulty": "advanced"
        },
        {
          "q": "Qual fórmula soma D quando B é Vendas e C é Pago?",
          "options": [
            "=SOMASES(D2:D100;B2:B100;\"Vendas\";C2:C100;\"Pago\")",
            "=SOMASE(B2:B100;\"Vendas\";D2:D100;C2:C100;\"Pago\")",
            "=CONT.SES(D2:D100;B2:B100;\"Vendas\")",
            "=SOMA(D2:D100)"
          ],
          "answer": 0,
          "why": "SOMASES suporta múltiplos critérios.",
          "difficulty": "advanced"
        },
        {
          "q": "Como contar células que começam com “ADM”?",
          "options": [
            "=CONT.SE(A2:A50;\"ADM*\")",
            "=CONT.SE(A2:A50;\"*ADM\")",
            "=SOMASE(A2:A50;\"ADM\")",
            "=A2&\"ADM\""
          ],
          "answer": 0,
          "why": "O asterisco representa qualquer sequência após ADM.",
          "difficulty": "advanced"
        },
        {
          "q": "Como unir nome e sobrenome ignorando espaços extras com ferramenta moderna?",
          "options": [
            "=ARRUMAR(A2&\" \"&B2)",
            "=SOMA(A2:B2)",
            "=MÉDIA(A2:B2)",
            "=A2-B2"
          ],
          "answer": 0,
          "why": "ARRUMAR remove espaços excedentes da concatenação.",
          "difficulty": "advanced"
        },
        {
          "q": "Qual problema ocorre se intervalo de soma e critério têm tamanhos diferentes?",
          "options": [
            "A função pode retornar resultado incorreto ou erro",
            "A fonte muda",
            "A planilha cria uma aba",
            "Nada, sempre é permitido"
          ],
          "answer": 0,
          "why": "As linhas precisam corresponder entre os intervalos.",
          "difficulty": "advanced"
        },
        {
          "q": "Qual fórmula conta células não vazias em A2:A100?",
          "options": [
            "=CONT.VALORES(A2:A100)",
            "=CONT.SE(A2:A100;\"\")",
            "=MÍNIMO(A2:A100)",
            "=SOMASE(A2:A100;\"<>\")"
          ],
          "answer": 0,
          "why": "CONT.VALORES conta valores de diferentes tipos.",
          "difficulty": "advanced"
        }
      ],
      "badge": "Mestre dos Critérios"
    }
  ],
  "1ADM-07": [
    {
      "type": "quiz",
      "title": "Revisão aplicada: regras visuais",
      "description": "Escolha regras que destaquem exceções sem distorcer a leitura.",
      "questions": [
        {
          "q": "Para destacar estoque abaixo de 10, qual regra é adequada?",
          "options": [
            "Maior que 10",
            "Menor que 10",
            "Texto contém 10",
            "Data é amanhã"
          ],
          "answer": 1,
          "why": "O alerta deve ser acionado quando o valor estiver abaixo do limite.",
          "difficulty": "intermediate"
        },
        {
          "q": "Qual vantagem da formatação condicional?",
          "options": [
            "Muda o valor da célula",
            "Altera automaticamente a aparência conforme uma regra",
            "Substitui fórmulas",
            "Impede compartilhamento"
          ],
          "answer": 1,
          "why": "A aparência responde ao conteúdo sem alterar o dado.",
          "difficulty": "intermediate"
        },
        {
          "q": "Para destacar o texto “PENDENTE”, qual regra é apropriada?",
          "options": [
            "Texto contém ou é igual a PENDENTE",
            "Número maior que zero",
            "Escala de datas",
            "Borda manual"
          ],
          "answer": 0,
          "why": "A regra deve avaliar conteúdo textual.",
          "difficulty": "intermediate"
        },
        {
          "q": "Por que usar muitas cores sem legenda é ruim?",
          "options": [
            "Aumenta a memória RAM",
            "Cria ambiguidade e poluição visual",
            "Remove filtros",
            "Apaga fórmulas"
          ],
          "answer": 1,
          "why": "Cores precisam ter significado consistente.",
          "difficulty": "intermediate"
        },
        {
          "q": "Uma escala de cores é mais útil para:",
          "options": [
            "Comparar intensidade de valores",
            "Identificar um único texto exato",
            "Renomear abas",
            "Compartilhar arquivos"
          ],
          "answer": 0,
          "why": "Escalas ajudam a perceber gradientes e extremos.",
          "difficulty": "intermediate"
        },
        {
          "q": "A regra é aplicada a B2:B10, mas novos dados vão até B30. Qual problema?",
          "options": [
            "Novas linhas podem ficar fora da regra",
            "A fórmula muda para texto",
            "O arquivo fica oculto",
            "A aba é excluída"
          ],
          "answer": 0,
          "why": "O intervalo da regra precisa acompanhar a base.",
          "difficulty": "intermediate"
        }
      ]
    },
    {
      "type": "challenge",
      "title": "Missão: painel de exceções",
      "description": "Analise prioridades, fórmulas personalizadas e acessibilidade.",
      "questions": [
        {
          "q": "Qual fórmula personalizada destaca a linha inteira A2:E100 quando E é “ATRASADO”?",
          "options": [
            "=$E2=\"ATRASADO\"",
            "=E$2=\"ATRASADO\"",
            "=$A$2:$E$100=\"ATRASADO\"",
            "=CONT.SE(E2;\"ATRASADO\")"
          ],
          "answer": 0,
          "why": "Coluna E fica fixa e a linha varia para cada registro.",
          "difficulty": "advanced"
        },
        {
          "q": "Duas regras aplicam cores diferentes à mesma célula. O que deve ser revisado?",
          "options": [
            "Prioridade e condições das regras",
            "Nome do arquivo",
            "Velocidade da internet",
            "Quantidade de abas"
          ],
          "answer": 0,
          "why": "Regras sobrepostas podem competir; ordem e condições importam.",
          "difficulty": "advanced"
        },
        {
          "q": "Qual combinação é mais acessível para status?",
          "options": [
            "Somente vermelho/verde",
            "Cor mais texto ou ícone de status",
            "Somente tom pastel",
            "Fonte muito pequena"
          ],
          "answer": 1,
          "why": "Informação não deve depender apenas de cor.",
          "difficulty": "advanced"
        },
        {
          "q": "Por que barras de dados podem induzir erro se misturam valores negativos e positivos?",
          "options": [
            "A escala e o zero precisam estar claramente representados",
            "Barras alteram os valores",
            "Não funcionam com números",
            "Excluem células vazias"
          ],
          "answer": 0,
          "why": "O ponto zero e a escala afetam interpretação.",
          "difficulty": "advanced"
        },
        {
          "q": "Qual regra destaca os 10 maiores valores sem escolher limite fixo?",
          "options": [
            "Regra de maiores valores / top 10",
            "Texto contém 10",
            "Data anterior a hoje",
            "Borda externa"
          ],
          "answer": 0,
          "why": "Regras de ranking se ajustam aos dados.",
          "difficulty": "advanced"
        },
        {
          "q": "Antes de usar cor vermelha para “crítico”, qual decisão é essencial?",
          "options": [
            "Definir critério objetivo que determina o estado crítico",
            "Escolher a fonte mais decorativa",
            "Inserir uma imagem",
            "Mesclar todas as linhas"
          ],
          "answer": 0,
          "why": "O significado visual deve vir de uma regra mensurável.",
          "difficulty": "advanced"
        }
      ],
      "badge": "Guardião dos Indicadores"
    }
  ],
  "2ADM-01": [
    {
      "type": "quiz",
      "title": "Revisão aplicada: arquitetura da planilha",
      "description": "Avalie estrutura, referências e automação em uma base administrativa.",
      "questions": [
        {
          "q": "Qual desenho é mais adequado para controle de estoque?",
          "options": [
            "Uma linha por produto e colunas para atributos",
            "Todos os produtos na mesma célula",
            "Uma cor por produto sem código",
            "Uma aba por cada movimentação"
          ],
          "answer": 0,
          "why": "Estrutura tabular permite filtros, fórmulas e auditoria.",
          "difficulty": "intermediate"
        },
        {
          "q": "Taxa em Config!B1 deve permanecer fixa. Qual referência usar?",
          "options": [
            "Config!B1",
            "Config!$B$1",
            "$Config!B1",
            "Config:B1"
          ],
          "answer": 1,
          "why": "$ fixa linha e coluna da taxa.",
          "difficulty": "intermediate"
        },
        {
          "q": "Qual fórmula calcula saldo: inicial + entradas - saídas?",
          "options": [
            "=B2+C2-D2",
            "=B2-C2+D2",
            "=SOMA(B2:D2)",
            "=B2*C2/D2"
          ],
          "answer": 0,
          "why": "Entradas somam; saídas subtraem.",
          "difficulty": "intermediate"
        },
        {
          "q": "Por que proteger colunas de fórmula?",
          "options": [
            "Evitar alteração acidental mantendo campos de entrada editáveis",
            "Impedir qualquer leitura",
            "Substituir backup",
            "Criar gráficos automaticamente"
          ],
          "answer": 0,
          "why": "Proteção reduz perda de lógica sem bloquear dados necessários.",
          "difficulty": "intermediate"
        },
        {
          "q": "Qual recurso padroniza a coluna Status?",
          "options": [
            "Validação com lista suspensa",
            "Texto livre sem regra",
            "Mesclagem",
            "Cor manual"
          ],
          "answer": 0,
          "why": "Validação impede variações de escrita.",
          "difficulty": "intermediate"
        },
        {
          "q": "Um total está duplicado porque a linha de subtotal foi incluída na SOMA. Qual solução?",
          "options": [
            "Ajustar o intervalo para excluir subtotais ou usar estrutura adequada",
            "Mudar a cor",
            "Ocultar o erro",
            "Somar novamente"
          ],
          "answer": 0,
          "why": "Faixas devem evitar dupla contagem.",
          "difficulty": "intermediate"
        }
      ]
    },
    {
      "type": "challenge",
      "title": "Missão: auditoria e automação",
      "description": "Resolva falhas reais de uma planilha de controle.",
      "questions": [
        {
          "q": "Ao copiar =C2*$H$1 para baixo, o que muda?",
          "options": [
            "C2 vira C3, mas H1 permanece fixo",
            "Ambos permanecem fixos",
            "H1 vira H2",
            "C2 vira D2"
          ],
          "answer": 0,
          "why": "Referência relativa muda; absoluta não.",
          "difficulty": "advanced"
        },
        {
          "q": "Qual técnica facilita expansão automática da base?",
          "options": [
            "Tabela estruturada ou intervalos dinâmicos",
            "Faixa fixa até linha 10",
            "Células mescladas",
            "Valores em uma única coluna sem cabeçalho"
          ],
          "answer": 0,
          "why": "Estruturas dinâmicas acompanham novos registros.",
          "difficulty": "advanced"
        },
        {
          "q": "Uma coluna numérica contém “R$ 1.200,00” como texto importado. Qual consequência?",
          "options": [
            "Cálculos e ordenação podem falhar até converter para número",
            "A planilha soma normalmente em qualquer caso",
            "O arquivo vira PDF",
            "A fórmula muda de idioma"
          ],
          "answer": 0,
          "why": "Texto com símbolos pode precisar de conversão conforme localidade.",
          "difficulty": "advanced"
        },
        {
          "q": "Qual prática ajuda a detectar alteração indevida de fórmulas?",
          "options": [
            "Comparar com modelo, proteger intervalo e usar histórico de versões",
            "Liberar edição para todos",
            "Apagar histórico",
            "Copiar resultados como texto"
          ],
          "answer": 0,
          "why": "Modelo, proteção e histórico oferecem controle.",
          "difficulty": "advanced"
        },
        {
          "q": "Em base compartilhada, qual opção permite análise individual sem mudar a visão dos colegas?",
          "options": [
            "Visualização de filtro",
            "Filtro comum aplicado por todos",
            "Ocultar linhas manualmente",
            "Excluir registros"
          ],
          "answer": 0,
          "why": "Visualizações de filtro isolam a análise.",
          "difficulty": "advanced"
        },
        {
          "q": "Qual teste valida melhor uma fórmula de estoque?",
          "options": [
            "Usar casos de entrada zero, saída zero, saída maior e valores normais",
            "Testar apenas uma linha positiva",
            "Mudar a fonte",
            "Duplicar a planilha sem conferir"
          ],
          "answer": 0,
          "why": "Casos de borda revelam erros lógicos.",
          "difficulty": "advanced"
        }
      ],
      "badge": "Auditor de Planilhas"
    }
  ],
  "2ADM-02": [
    {
      "type": "quiz",
      "title": "Revisão aplicada: critérios empresariais",
      "description": "Use funções condicionais para classificar e resumir operações.",
      "questions": [
        {
          "q": "Qual fórmula conta pagamentos pendentes em E2:E100?",
          "options": [
            "=CONT.SE(E2:E100;\"PENDENTE\")",
            "=SOMASE(E2:E100;\"PENDENTE\")",
            "=SOMA(E2:E100)",
            "=SE(E2:E100=\"PENDENTE\")"
          ],
          "answer": 0,
          "why": "CONT.SE conta ocorrências.",
          "difficulty": "intermediate"
        },
        {
          "q": "Qual fórmula soma valores de Vendas já pagas?",
          "options": [
            "=SOMASES(D2:D100;B2:B100;\"Vendas\";E2:E100;\"PAGO\")",
            "=CONT.SES(D2:D100;\"Vendas\";E2:E100;\"PAGO\")",
            "=SOMA(B2:E100)",
            "=SE(B2=\"Vendas\";D2)"
          ],
          "answer": 0,
          "why": "SOMASES combina múltiplos critérios.",
          "difficulty": "intermediate"
        },
        {
          "q": "Quando usar SE com E?",
          "options": [
            "Quando todas as condições devem ser verdadeiras",
            "Quando qualquer uma basta",
            "Para concatenar",
            "Para criar gráfico"
          ],
          "answer": 0,
          "why": "E exige todas as condições.",
          "difficulty": "intermediate"
        },
        {
          "q": "Qual fórmula marca atraso se vencimento C2 já passou e status D2 não é PAGO?",
          "options": [
            "=SE(E(C2<HOJE();D2<>\"PAGO\");\"ATRASADO\";\"REGULAR\")",
            "=SE(OU(C2<HOJE();D2<>\"PAGO\");\"ATRASADO\";\"REGULAR\")",
            "=CONT.SE(C2:D2;\"ATRASADO\")",
            "=SOMA(C2;D2)"
          ],
          "answer": 0,
          "why": "Atraso depende simultaneamente de prazo e status.",
          "difficulty": "advanced"
        },
        {
          "q": "Por que usar SEERRO em uma busca?",
          "options": [
            "Para tratar falhas previstas sem esconder a lógica principal",
            "Para corrigir qualquer dado automaticamente",
            "Para substituir validação",
            "Para aumentar o número de linhas"
          ],
          "answer": 0,
          "why": "SEERRO apresenta saída controlada quando a expressão falha.",
          "difficulty": "intermediate"
        },
        {
          "q": "Qual critério conta valores entre 100 e 500?",
          "options": [
            "CONT.SES(A2:A100;\">=100\";A2:A100;\"<=500\")",
            "CONT.SE(A2:A100;\">=100<=500\")",
            "SOMASE(A2:A100;100;500)",
            "MÉDIA(A2:A100)"
          ],
          "answer": 0,
          "why": "Dois critérios no mesmo intervalo definem a faixa.",
          "difficulty": "intermediate"
        }
      ]
    },
    {
      "type": "challenge",
      "title": "Missão: decisões auditáveis",
      "description": "Analise fórmulas com múltiplos critérios e riscos de interpretação.",
      "questions": [
        {
          "q": "Qual fórmula classifica estoque: crítico <5, atenção <10, normal caso contrário?",
          "options": [
            "=SE(D2<5;\"CRÍTICO\";SE(D2<10;\"ATENÇÃO\";\"NORMAL\"))",
            "=SE(D2<10;\"NORMAL\";\"CRÍTICO\")",
            "=CONT.SE(D2;\"CRÍTICO\")",
            "=SOMA(D2)"
          ],
          "answer": 0,
          "why": "Condições devem ser testadas da faixa mais restrita para a seguinte.",
          "difficulty": "advanced"
        },
        {
          "q": "Qual risco de usar correspondência aproximada em busca por código?",
          "options": [
            "Retornar item incorreto se a base não estiver ordenada ou se era necessária correspondência exata",
            "Apagar a tabela",
            "Desativar filtros",
            "Converter números em datas"
          ],
          "answer": 0,
          "why": "Códigos normalmente exigem correspondência exata.",
          "difficulty": "advanced"
        },
        {
          "q": "Qual fórmula conta pendências de Vendas no mês indicado em H1?",
          "options": [
            "=CONT.SES(B:B;\"Vendas\";E:E;\"PENDENTE\";A:A;\">=\"&DATA(ANO(H1);MÊS(H1);1);A:A;\"<=\"&FIMMÊS(H1;0))",
            "=CONT.SE(E:E;\"PENDENTE\")",
            "=SOMASE(B:B;\"Vendas\";E:E)",
            "=MÉDIA(A:E)"
          ],
          "answer": 0,
          "why": "CONT.SES combina setor, status e intervalo de datas.",
          "difficulty": "advanced"
        },
        {
          "q": "Para evitar erro em divisão de margem quando receita é zero, qual abordagem é adequada?",
          "options": [
            "=SE(B2=0;\"\";(B2-C2)/B2)",
            "=B2-C2/B2",
            "=SEERRO(B2;C2)",
            "=CONT.SE(B2;0)"
          ],
          "answer": 0,
          "why": "A fórmula trata explicitamente o denominador zero.",
          "difficulty": "advanced"
        },
        {
          "q": "Qual função moderna filtra apenas registros pendentes?",
          "options": [
            "=FILTRAR(A2:E100;E2:E100=\"PENDENTE\")",
            "=SOMA(A2:E100)",
            "=MÁXIMO(E2:E100)",
            "=CONCATENAR(A2:E100)"
          ],
          "answer": 0,
          "why": "FILTRAR retorna linhas que atendem à condição.",
          "difficulty": "advanced"
        },
        {
          "q": "Uma regra usa textos “Pago”, “PAGO” e “pago”. Qual melhoria estrutural é melhor?",
          "options": [
            "Validação de dados com valores padronizados",
            "Adicionar três CONT.SE separados",
            "Usar mais cores",
            "Deixar como está"
          ],
          "answer": 0,
          "why": "Padronização evita critérios inconsistentes.",
          "difficulty": "advanced"
        }
      ],
      "badge": "Especialista em Automação"
    }
  ],
  "2ADM-03": [
    {
      "type": "quiz",
      "title": "Revisão aplicada: análise e visualização",
      "description": "Escolha filtros, gráficos e indicadores adequados à decisão.",
      "questions": [
        {
          "q": "Para comparar vendas por setor em um período, qual gráfico é geralmente apropriado?",
          "options": [
            "Barras ou colunas",
            "Pizza com dezenas de categorias",
            "Dispersão sem variável numérica dupla",
            "Organograma"
          ],
          "answer": 0,
          "why": "Barras facilitam comparação entre categorias.",
          "difficulty": "intermediate"
        },
        {
          "q": "Para mostrar tendência mensal, qual gráfico é mais adequado?",
          "options": [
            "Linha",
            "Pizza",
            "Radar sem contexto",
            "Nuvem de palavras"
          ],
          "answer": 0,
          "why": "Linhas mostram evolução temporal.",
          "difficulty": "intermediate"
        },
        {
          "q": "Qual filtro ajuda a localizar apenas pagamentos pendentes acima de R$ 500?",
          "options": [
            "Status=PENDENTE e Valor>500",
            "Status=PAGO ou Valor<500",
            "Ordenar apenas por nome",
            "Ocultar o cabeçalho"
          ],
          "answer": 0,
          "why": "Os dois critérios precisam ser aplicados.",
          "difficulty": "intermediate"
        },
        {
          "q": "Qual indicador é mais útil para estoque?",
          "options": [
            "Quantidade de produtos abaixo do mínimo",
            "Quantidade de cores da planilha",
            "Número de abas",
            "Tamanho do arquivo"
          ],
          "answer": 0,
          "why": "Indicador deve apoiar uma decisão operacional.",
          "difficulty": "intermediate"
        },
        {
          "q": "Por que validar totais do dashboard com a base?",
          "options": [
            "Para detectar filtros, fórmulas ou intervalos incorretos",
            "Para escolher uma fonte",
            "Para reduzir linhas",
            "Para permitir compartilhamento"
          ],
          "answer": 0,
          "why": "Dashboard precisa ser reconciliado com a fonte.",
          "difficulty": "intermediate"
        },
        {
          "q": "Qual recurso permite resumir dados por setor e mês sem fórmulas linha a linha?",
          "options": [
            "Tabela dinâmica",
            "Mesclagem",
            "Comentário",
            "Proteção de intervalo"
          ],
          "answer": 0,
          "why": "Tabela dinâmica agrega e reorganiza dados.",
          "difficulty": "intermediate"
        }
      ]
    },
    {
      "type": "challenge",
      "title": "Missão: dashboard executivo",
      "description": "Interprete escolhas de visualização e indicadores com rigor.",
      "questions": [
        {
          "q": "Um gráfico de vendas começa o eixo em 990 e termina em 1010. Qual cuidado é necessário?",
          "options": [
            "A escala pode exagerar pequenas diferenças e deve ser explicitada",
            "O gráfico sempre estará correto",
            "É necessário converter para pizza",
            "O eixo deve ser ocultado"
          ],
          "answer": 0,
          "why": "Eixo truncado altera percepção.",
          "difficulty": "advanced"
        },
        {
          "q": "Qual KPI melhor mede cumprimento de prazo?",
          "options": [
            "Percentual concluído no prazo, com definição clara de prazo",
            "Número total de cores",
            "Maior valor da base",
            "Quantidade de usuários"
          ],
          "answer": 0,
          "why": "KPI deve corresponder ao objetivo operacional.",
          "difficulty": "advanced"
        },
        {
          "q": "Por que um dashboard com 20 gráficos pode ser menos útil?",
          "options": [
            "Excesso de elementos dificulta prioridade e leitura",
            "Mais gráficos sempre melhoram decisão",
            "Gráficos eliminam necessidade de dados",
            "O navegador não suporta mais de cinco"
          ],
          "answer": 0,
          "why": "Seleção de poucos indicadores relevantes melhora clareza.",
          "difficulty": "advanced"
        },
        {
          "q": "Uma média de atendimento caiu, mas o volume aumentou muito. Qual análise complementar é importante?",
          "options": [
            "Distribuição, percentis e segmentação por período/setor",
            "Somente mudar a cor do cartão",
            "Excluir dias de pico",
            "Mostrar apenas o maior valor"
          ],
          "answer": 0,
          "why": "Média isolada pode esconder variação e contexto.",
          "difficulty": "advanced"
        },
        {
          "q": "Qual desenho permite atualização com novos dados sem refazer gráficos?",
          "options": [
            "Base estruturada, intervalos dinâmicos e fontes consistentes",
            "Gráfico ligado a faixa fixa de três linhas",
            "Valores digitados manualmente no gráfico",
            "Imagem do gráfico"
          ],
          "answer": 0,
          "why": "Estrutura dinâmica acompanha expansão.",
          "difficulty": "advanced"
        },
        {
          "q": "Um gráfico de pizza possui 18 categorias semelhantes. Qual alternativa melhora leitura?",
          "options": [
            "Usar barras ordenadas e agrupar categorias pequenas quando adequado",
            "Adicionar mais cores",
            "Remover rótulos",
            "Transformar em animação"
          ],
          "answer": 0,
          "why": "Barras são melhores para muitas categorias.",
          "difficulty": "advanced"
        }
      ],
      "badge": "Analista de Dashboards"
    }
  ]
};

// v2.2.8: as aulas reorganizadas já possuem prática suficiente e não recebem os reforços legados.
for(const lessonId of ['1ADM-03','1ADM-04','1ADM-05','1ADM-06','1ADM-07','1ADM-08','1ADM-09','2ADM-01','2ADM-02','2ADM-03','2ADM-04','2ADM-05']){
  GUIDED_REINFORCEMENT_V4[lessonId]=[];
}
