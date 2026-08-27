window.EXERCICIOS_MOBILE = [
  {
    "numero": 1,
    "studentReferenceStripped": true,
    "codigo": "MOB01",
    "disciplina": "Programação Mobile",
    "fase": 1,
    "faseNome": "Introdução ao Desenvolvimento Mobile",
    "fasePedagogica": 1,
    "titulo": "MOB01 - Introdução ao Mobile",
    "nomeCurto": "Introdução ao Mobile",
    "tema": "Introdução ao desenvolvimento mobile",
    "objetivo": "Compreender o que diferencia uma experiência mobile de uma página pensada apenas para desktop e reconhecer Web, Web Mobile e aplicativo como entregas diferentes.",
    "produto": "Página comparativa interativa sobre experiências Web e Mobile.",
    "contextoProfissional": "Primeiro contato com decisões de produto e interface para dispositivos móveis.",
    "alteracaoObrigatoria": "Personalize um dos três cartões com um exemplo de aplicativo ou serviço conhecido e explique em uma frase por que ele se encaixa naquela categoria.",
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
    "pasta": "mobile-01",
    "repositorio": "atividades-mobile-sub",
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
      "readme": "# MOB01 - Introdução ao Desenvolvimento Mobile\n\nNesta atividade, você compara **Web tradicional**, **Web Mobile** e **Aplicativo Mobile**.\n\n## Conceitos principais\n\n- tela menor não significa apenas reduzir o tamanho dos elementos;\n- o toque substitui muitas interações feitas com mouse;\n- o dispositivo pode oferecer câmera, GPS, sensores e notificações;\n- a conexão pode mudar enquanto a pessoa se movimenta.\n\n## Como testar\n\n1. Abra `index.html` no navegador.\n2. Reduza a largura da janela para simular um celular.\n3. Clique em **Comparar experiências**.\n4. Observe a reorganização dos cartões e a mensagem apresentada.\n\n## Reflexão\n\nExplique com suas palavras por que uma boa experiência mobile exige decisões próprias de interface.\n"
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
    "classroom": {
      "titulo": "MOB01 — Introdução ao Mobile",
      "descricao": "Nesta atividade, vamos estudar introdução ao desenvolvimento mobile.\n\nCompreender o que diferencia uma experiência mobile de uma página pensada apenas para desktop e reconhecer Web, Web Mobile e aplicativo como entregas diferentes.\n\nAlteração obrigatória: Personalize um dos três cartões com um exemplo de aplicativo ou serviço conhecido e explique em uma frase por que ele se encaixa naquela categoria.\n\nEntrega: anexar o link do repositório do GitHub."
    },
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
    "glossario": [
      {
        "id": "viewport",
        "termo": "viewport",
        "categoria": "Configuração de tela",
        "traducao": "área visível",
        "explicacao": "Instrui o navegador sobre como dimensionar a página no dispositivo.",
        "erroComum": "Confundir viewport com tamanho físico da tela.",
        "linguagem": "html",
        "exercicio": "MOB01",
        "ondeAparece": "No <head> de index.html: meta name=\"viewport\".",
        "exemploPratico": "Faz a largura lógica acompanhar a largura do celular.",
        "analogia": "É como dizer ao navegador qual tamanho de janela ele deve considerar antes de organizar a página."
      },
      {
        "id": "mobile",
        "termo": "mobile",
        "categoria": "Conceito",
        "traducao": "móvel",
        "explicacao": "Experiência projetada considerando uso em dispositivos móveis.",
        "erroComum": "Achar que mobile significa apenas tela pequena.",
        "linguagem": "conceito",
        "exercicio": "MOB01",
        "ondeAparece": "É o conceito central de toda a atividade.",
        "exemploPratico": "Uma interface pensada para uso rápido, por toque e em tela pequena.",
        "analogia": "Mobile é o contexto de uso, não apenas o tamanho do monitor."
      },
      {
        "id": "aria-live",
        "termo": "aria-live",
        "categoria": "Acessibilidade",
        "traducao": "região de atualização",
        "explicacao": "Permite anunciar mudanças de conteúdo para tecnologias assistivas.",
        "erroComum": "Usar em qualquer texto sem necessidade.",
        "linguagem": "html",
        "exercicio": "MOB01",
        "ondeAparece": "No parágrafo #resumoMobile.",
        "exemploPratico": "A mensagem alterada pelo JavaScript pode ser anunciada por tecnologia assistiva.",
        "analogia": "Funciona como uma região que avisa: “o conteúdo aqui mudou”."
      },
      {
        "id": "web-mobile",
        "termo": "Web Mobile",
        "categoria": "Conceito",
        "traducao": "Web pensada para celular",
        "explicacao": "Experiência Web adaptada a telas menores, toque e contexto móvel.",
        "erroComum": "Achar que basta reduzir a largura do site.",
        "linguagem": "conceito",
        "exercicio": "MOB01",
        "ondeAparece": "Compare a grade no modo Computador e Celular.",
        "exemploPratico": "Um cardápio online que reorganiza botões para uso com uma mão.",
        "analogia": "É como reorganizar uma mochila pequena: não basta encolher os objetos; é preciso priorizar o que fica acessível."
      },
      {
        "id": "app-mobile",
        "termo": "Aplicativo Mobile",
        "categoria": "Conceito",
        "traducao": "software para dispositivo móvel",
        "explicacao": "Aplicação instalada ou distribuída para um ambiente móvel, podendo integrar serviços do sistema.",
        "erroComum": "Achar que todo app precisa acessar todos os sensores.",
        "linguagem": "conceito",
        "exercicio": "MOB01",
        "ondeAparece": "Aparece nos cartões de comparação do HTML.",
        "exemploPratico": "Um app de mapas usando localização e notificações.",
        "analogia": "É um programa que vive no ecossistema do aparelho e conversa com serviços oferecidos pelo sistema."
      },
      {
        "id": "media-query",
        "termo": "@media",
        "categoria": "CSS responsivo",
        "traducao": "regra condicional por tela",
        "explicacao": "Permite aplicar regras CSS quando a tela atende a uma condição, como largura máxima.",
        "erroComum": "Usar breakpoint sem entender o que precisa mudar.",
        "linguagem": "css",
        "exercicio": "MOB01",
        "ondeAparece": "No fim de estilo.css, reorganiza a grade quando a tela fica estreita.",
        "exemploPratico": "Três cartões lado a lado no desktop viram uma coluna no celular.",
        "analogia": "É como uma regra: “se a sala ficar pequena, reorganize as mesas”."
      },
      {
        "id": "touch",
        "termo": "toque",
        "categoria": "Interação",
        "traducao": "entrada pelo dedo",
        "explicacao": "Principal forma de interação direta em celulares e tablets.",
        "erroComum": "Projetar alvos pequenos como se o usuário tivesse um ponteiro preciso.",
        "linguagem": "conceito",
        "exercicio": "MOB01",
        "ondeAparece": "O botão Comparar experiências representa uma ação tocável.",
        "exemploPratico": "Botão grande para confirmar uma compra.",
        "analogia": "O dedo é menos preciso que a ponta do cursor do mouse."
      }
    ],
    "dicasProgressivas": {
      "html": [
        "Relembre o papel deste arquivo.",
        "Localize primeiro os ids e classes usados na atividade.",
        "Compare seu trabalho com os critérios e a explicação. A solução completa fica somente no Modo Professor.",
        "Teste no preview antes de validar."
      ],
      "css": [
        "Relembre o papel deste arquivo.",
        "Localize primeiro os ids e classes usados na atividade.",
        "Compare seu trabalho com os critérios e a explicação. A solução completa fica somente no Modo Professor.",
        "Teste no preview antes de validar."
      ],
      "js": [
        "Relembre o papel deste arquivo.",
        "Localize primeiro os ids e classes usados na atividade.",
        "Compare seu trabalho com os critérios e a explicação. A solução completa fica somente no Modo Professor.",
        "Teste no preview antes de validar."
      ],
      "readme": [
        "Relembre o papel deste arquivo.",
        "Localize primeiro os ids e classes usados na atividade.",
        "Compare seu trabalho com os critérios e a explicação. A solução completa fica somente no Modo Professor.",
        "Teste no preview antes de validar."
      ]
    },
    "comportamento": {
      "descricao": "Execute a ação principal e confira se a interface responde. Textos e detalhes visuais podem ser personalizados.",
      "criterios": [
        {
          "id": "comparar",
          "tipo": "event",
          "evento": "click",
          "seletor": "#compararExperiencias",
          "rotulo": "Usar o botão de comparação"
        },
        {
          "id": "resumo-alterado",
          "tipo": "textChangedFrom",
          "seletor": "#resumoMobile",
          "valor": "Toque no botão para resumir a ideia principal.",
          "rotulo": "A mensagem de resumo foi atualizada"
        }
      ]
    },
    "aulaVisual": {
      "titulo": "Mapa mental — o que torna uma experiência realmente mobile?",
      "pergunta": "Mobile é só diminuir um site para caber no celular?",
      "ideiaCentral": "Não. Mobile combina contexto de uso, toque, espaço de tela, conexão e recursos do aparelho.",
      "fluxo": [
        {
          "id": "contexto",
          "rotulo": "1. Contexto",
          "detalhe": "A pessoa pode estar em movimento, usando uma mão e com atenção dividida."
        },
        {
          "id": "tela",
          "rotulo": "2. Tela",
          "detalhe": "Há menos espaço; conteúdo e ações precisam de prioridade."
        },
        {
          "id": "toque",
          "rotulo": "3. Toque",
          "detalhe": "O dedo substitui o ponteiro do mouse e exige áreas de toque claras."
        },
        {
          "id": "recursos",
          "rotulo": "4. Recursos",
          "detalhe": "Câmera, GPS, sensores e notificações podem participar da experiência."
        },
        {
          "id": "resposta",
          "rotulo": "5. Resposta",
          "detalhe": "A interface precisa confirmar imediatamente o que aconteceu após a ação."
        }
      ],
      "comparacao": [
        {
          "titulo": "Web tradicional",
          "texto": "Abre no navegador; pode ter sido pensada primeiro para tela grande."
        },
        {
          "titulo": "Web Mobile",
          "texto": "Continua no navegador, mas reorganiza conteúdo, navegação e interação para telas menores."
        },
        {
          "titulo": "Aplicativo Mobile",
          "texto": "Pode ser instalado e integrar recursos do sistema e do aparelho."
        }
      ],
      "observe": "No Preview, a comparação entre Computador e Celular mostra as três colunas reorganizadas em uma coluna e o botão ocupando toda a largura.",
      "miniDesafio": "Antes de clicar no botão, peça ao aluno para prever o que o JavaScript mudará na tela."
    },
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 2,
    "studentReferenceStripped": true,
    "codigo": "MOB02",
    "disciplina": "Programação Mobile",
    "fase": 1,
    "faseNome": "Introdução ao Desenvolvimento Mobile",
    "fasePedagogica": 1,
    "titulo": "MOB02 - Como funciona um dispositivo móvel",
    "nomeCurto": "Como funciona um dispositivo móvel",
    "tema": "Funcionamento de dispositivos e aplicativos móveis",
    "objetivo": "Compreender a relação entre entrada, sistema operacional, aplicativo, dados, permissões, sensores e saída.",
    "produto": "Simulador visual de um fluxo entre toque, sistema operacional, sensor e aplicativo.",
    "contextoProfissional": "Modelo mental para futuramente trabalhar câmera, GPS, armazenamento e permissões.",
    "alteracaoObrigatoria": "Acrescente uma sexta camada chamada Rede, Nuvem ou Notificação e descreva em uma frase quando ela participa do fluxo.",
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
    "pasta": "mobile-02",
    "repositorio": "atividades-mobile-sub",
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
      "readme": "# MOB02 - Como funciona um dispositivo móvel\n\nUm aplicativo não trabalha sozinho. Ele depende do **sistema operacional**, do **hardware**, dos **dados** e das **permissões**.\n\n## Camadas estudadas\n\n1. entrada do usuário ou sensor;\n2. sistema operacional;\n3. lógica do aplicativo;\n4. dados locais ou serviços de internet;\n5. resposta apresentada à pessoa.\n\n## Permissões\n\nCâmera, microfone e localização são exemplos de recursos que podem exigir autorização do usuário.\n\n## Teste\n\nAbra `index.html`, execute a simulação e explique por que o aplicativo não deveria acessar todos os recursos do aparelho sem permissão.\n"
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
    "classroom": {
      "titulo": "MOB02 — Como funciona um dispositivo móvel",
      "descricao": "Nesta atividade, vamos estudar funcionamento de dispositivos e aplicativos móveis.\n\nCompreender a relação entre entrada, sistema operacional, aplicativo, dados, permissões, sensores e saída.\n\nAlteração obrigatória: Acrescente uma sexta camada chamada Rede, Nuvem ou Notificação e descreva em uma frase quando ela participa do fluxo.\n\nEntrega: anexar o link do repositório do GitHub."
    },
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
    "glossario": [
      {
        "id": "sistema-operacional",
        "termo": "sistema operacional",
        "categoria": "Plataforma",
        "traducao": "software base",
        "explicacao": "Gerencia hardware, aplicativos, permissões e serviços do aparelho.",
        "erroComum": "Confundir Android/iOS com um aplicativo comum.",
        "linguagem": "conceito",
        "exercicio": "MOB02",
        "ondeAparece": "Na segunda camada do fluxo em index.html.",
        "exemploPratico": "Android verifica se o app pode acessar localização.",
        "analogia": "É como o administrador do prédio: controla quem pode acessar cada recurso."
      },
      {
        "id": "permiss-o",
        "termo": "permissão",
        "categoria": "Segurança",
        "traducao": "autorização",
        "explicacao": "Controle dado ao usuário sobre acesso a câmera, localização e outros recursos.",
        "erroComum": "Solicitar acesso sem necessidade.",
        "linguagem": "conceito",
        "exercicio": "MOB02",
        "ondeAparece": "Na explicação da camada Sistema operacional.",
        "exemploPratico": "Usuário autoriza ou nega acesso à câmera.",
        "analogia": "É uma chave de acesso que o usuário decide entregar ou não."
      },
      {
        "id": "sensor",
        "termo": "sensor",
        "categoria": "Hardware",
        "traducao": "componente de medição",
        "explicacao": "Capta informações como movimento, orientação ou proximidade.",
        "erroComum": "Achar que todo dispositivo possui todos os sensores.",
        "linguagem": "conceito",
        "exercicio": "MOB02",
        "ondeAparece": "Na camada Entrada.",
        "exemploPratico": "Acelerômetro percebe movimento/orientação.",
        "analogia": "É um “sentido” do dispositivo para perceber algo do ambiente."
      },
      {
        "id": "hardware",
        "termo": "hardware",
        "categoria": "Dispositivo",
        "traducao": "parte física",
        "explicacao": "Componentes físicos do aparelho: processador, memória, tela, câmera, GPS e sensores.",
        "erroComum": "Confundir hardware com Android/iOS.",
        "linguagem": "conceito",
        "exercicio": "MOB02",
        "ondeAparece": "A lista de camadas cita câmera, microfone, GPS e sensores.",
        "exemploPratico": "Câmera registra imagem; GPS fornece localização.",
        "analogia": "É o corpo físico do aparelho."
      },
      {
        "id": "entrada",
        "termo": "entrada",
        "categoria": "Fluxo",
        "traducao": "dado recebido",
        "explicacao": "Ação ou dado que chega ao sistema por toque, sensor, câmera, teclado ou outro recurso.",
        "erroComum": "Pensar que entrada é apenas texto digitado.",
        "linguagem": "conceito",
        "exercicio": "MOB02",
        "ondeAparece": "Primeiro item da lista de camadas.",
        "exemploPratico": "Tocar no botão “usar localização”.",
        "analogia": "É a pergunta ou sinal que inicia o processamento."
      },
      {
        "id": "saida",
        "termo": "saída",
        "categoria": "Fluxo",
        "traducao": "resposta apresentada",
        "explicacao": "Resultado entregue ao usuário por tela, som, vibração ou notificação.",
        "erroComum": "Achar que saída é somente console.",
        "linguagem": "conceito",
        "exercicio": "MOB02",
        "ondeAparece": "Último item da lista de camadas.",
        "exemploPratico": "Mostrar a posição atual no mapa e vibrar ao concluir.",
        "analogia": "É a resposta que volta ao usuário."
      },
      {
        "id": "api",
        "termo": "API",
        "categoria": "Integração",
        "traducao": "ponte entre sistemas",
        "explicacao": "Interface que permite ao aplicativo solicitar dados ou ações de outro serviço.",
        "erroComum": "Confundir API com banco de dados.",
        "linguagem": "conceito",
        "exercicio": "MOB02",
        "ondeAparece": "Aparece em “dados e serviços”.",
        "exemploPratico": "Consultar previsão do tempo pela internet.",
        "analogia": "É como um balcão com pedidos definidos: você pede no formato esperado e recebe uma resposta."
      }
    ],
    "dicasProgressivas": {
      "html": [
        "Identifique a função deste arquivo.",
        "Procure as palavras entrada, sistema, aplicativo, dados e saída.",
        "Compare ids e seletores.",
        "Execute a simulação antes de validar."
      ],
      "css": [
        "Identifique a função deste arquivo.",
        "Procure as palavras entrada, sistema, aplicativo, dados e saída.",
        "Compare ids e seletores.",
        "Execute a simulação antes de validar."
      ],
      "js": [
        "Identifique a função deste arquivo.",
        "Procure as palavras entrada, sistema, aplicativo, dados e saída.",
        "Compare ids e seletores.",
        "Execute a simulação antes de validar."
      ],
      "readme": [
        "Identifique a função deste arquivo.",
        "Procure as palavras entrada, sistema, aplicativo, dados e saída.",
        "Compare ids e seletores.",
        "Execute a simulação antes de validar."
      ]
    },
    "comportamento": {
      "descricao": "Execute a ação principal e confira se a interface responde. Textos e detalhes visuais podem ser personalizados.",
      "criterios": [
        {
          "id": "simular",
          "tipo": "event",
          "evento": "click",
          "seletor": "#simularFluxo",
          "rotulo": "Executar a simulação"
        },
        {
          "id": "fluxo-alterado",
          "tipo": "textChangedFrom",
          "seletor": "#fluxoMobile",
          "valor": "A simulação ainda não foi executada.",
          "rotulo": "A sequência foi apresentada"
        }
      ]
    },
    "aulaVisual": {
      "titulo": "Mapa visual — do toque até a resposta do aplicativo",
      "pergunta": "O que acontece entre tocar na tela e receber uma resposta?",
      "ideiaCentral": "A ação atravessa camadas: entrada → sistema operacional/permissões → aplicativo → dados/serviços → saída.",
      "fluxo": [
        {
          "id": "entrada",
          "rotulo": "1. Entrada",
          "detalhe": "Toque, câmera, microfone, GPS ou sensor fornecem um dado."
        },
        {
          "id": "sistema",
          "rotulo": "2. Sistema operacional",
          "detalhe": "Android/iOS media o acesso ao hardware e verifica permissões."
        },
        {
          "id": "app",
          "rotulo": "3. Aplicativo",
          "detalhe": "O código interpreta a ação e decide o que precisa fazer."
        },
        {
          "id": "dados",
          "rotulo": "4. Dados/serviços",
          "detalhe": "O app pode consultar armazenamento local, API, internet ou nuvem."
        },
        {
          "id": "saida",
          "rotulo": "5. Saída",
          "detalhe": "Tela, som, vibração ou notificação apresentam a resposta."
        }
      ],
      "comparacao": [
        {
          "titulo": "Hardware",
          "texto": "Parte física: câmera, GPS, memória, tela, sensores."
        },
        {
          "titulo": "Sistema operacional",
          "texto": "Gerencia recursos, apps, segurança e permissões."
        },
        {
          "titulo": "Aplicativo",
          "texto": "Implementa as regras e a experiência que o usuário vê."
        }
      ],
      "observe": "A ação “Simular toque” apresenta a sequência percorrida entre entrada, sistema operacional, aplicativo, dados e saída.",
      "miniDesafio": "Pergunte: se a permissão de localização for negada, em qual etapa o fluxo precisa tratar o problema?"
    },
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 3,
    "studentReferenceStripped": true,
    "codigo": "MOB03",
    "disciplina": "Programação Mobile",
    "fase": 1,
    "faseNome": "Introdução ao Desenvolvimento Mobile",
    "fasePedagogica": 1,
    "titulo": "MOB03 - Tecnologias Mobile",
    "nomeCurto": "Tecnologias Mobile",
    "tema": "Tecnologias e abordagens de desenvolvimento mobile",
    "objetivo": "Comparar desenvolvimento nativo, Web/PWA e multiplataforma e perceber que a escolha depende dos requisitos do projeto.",
    "produto": "Guia interativo de cenários e abordagens mobile.",
    "contextoProfissional": "Análise inicial de trade-offs antes da escolha de uma stack.",
    "alteracaoObrigatoria": "Acrescente um quarto cenário de projeto e inclua no JavaScript uma recomendação justificada para esse cenário.",
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
    "pasta": "mobile-03",
    "repositorio": "atividades-mobile-sub",
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
      "readme": "# MOB03 - Tecnologias Mobile\n\nExistem diferentes formas de entregar uma experiência mobile. A escolha depende de **requisitos**, **equipe**, **plataformas**, **prazo** e **recursos do dispositivo**.\n\n## Nativo\n\nNormalmente usa ferramentas e linguagens ligadas diretamente ao sistema operacional, como Kotlin/Java no Android e Swift no iOS.\n\n## Web e PWA\n\nUsa HTML, CSS e JavaScript. Uma PWA pode acrescentar recursos como instalação e cache, dependendo do navegador e da plataforma.\n\n## Multiplataforma\n\nTecnologias como React Native e Flutter buscam compartilhar código entre Android e iOS.\n\n## Teste\n\nExecute os três cenários da página. Não existe uma tecnologia universalmente melhor: justifique a escolha com base no problema.\n"
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
    "classroom": {
      "titulo": "MOB03 — Tecnologias Mobile",
      "descricao": "Nesta atividade, vamos estudar tecnologias e abordagens de desenvolvimento mobile.\n\nComparar desenvolvimento nativo, Web/PWA e multiplataforma e perceber que a escolha depende dos requisitos do projeto.\n\nAlteração obrigatória: Acrescente um quarto cenário de projeto e inclua no JavaScript uma recomendação justificada para esse cenário.\n\nEntrega: anexar o link do repositório do GitHub."
    },
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
    "glossario": [
      {
        "id": "nativo",
        "termo": "nativo",
        "categoria": "Abordagem",
        "traducao": "específico da plataforma",
        "explicacao": "Aplicativo desenvolvido com tecnologias diretamente ligadas ao sistema operacional alvo.",
        "erroComum": "Achar que nativo significa automaticamente melhor em qualquer projeto.",
        "linguagem": "conceito",
        "exercicio": "MOB03",
        "ondeAparece": "Primeiro cartão e cenário Android.",
        "exemploPratico": "App interno feito somente para aparelhos Android da empresa.",
        "analogia": "É construir diretamente para uma plataforma específica."
      },
      {
        "id": "pwa",
        "termo": "PWA",
        "categoria": "Abordagem Web",
        "traducao": "Progressive Web App",
        "explicacao": "Aplicação Web que pode adicionar capacidades como instalação e cache conforme suporte.",
        "erroComum": "Tratar PWA como idêntica a app nativo.",
        "linguagem": "conceito",
        "exercicio": "MOB03",
        "ondeAparece": "Segundo cartão Web/PWA.",
        "exemploPratico": "Portal acessado por link que pode ser instalado conforme suporte.",
        "analogia": "É uma aplicação Web que ganha capacidades progressivamente."
      },
      {
        "id": "multiplataforma",
        "termo": "multiplataforma",
        "categoria": "Abordagem",
        "traducao": "várias plataformas",
        "explicacao": "Estratégia que busca compartilhar código entre Android, iOS ou outros alvos.",
        "erroComum": "Imaginar que 100% do código sempre será compartilhado.",
        "linguagem": "conceito",
        "exercicio": "MOB03",
        "ondeAparece": "Terceiro cartão e cenário Android+iOS.",
        "exemploPratico": "Equipe pequena compartilha grande parte do projeto entre duas plataformas.",
        "analogia": "É tentar usar uma base comum para chegar a mais de um destino."
      },
      {
        "id": "kotlin",
        "termo": "Kotlin",
        "categoria": "Linguagem",
        "traducao": "linguagem usada no ecossistema Android",
        "explicacao": "Linguagem moderna muito usada para desenvolvimento Android nativo.",
        "erroComum": "Achar que Kotlin é o próprio Android.",
        "linguagem": "conceito",
        "exercicio": "MOB03",
        "ondeAparece": "Exemplo citado no cartão Nativo.",
        "exemploPratico": "Aplicativo Android feito especificamente para os dispositivos da empresa.",
        "analogia": "É uma ferramenta de linguagem dentro de uma abordagem nativa."
      },
      {
        "id": "swift",
        "termo": "Swift",
        "categoria": "Linguagem",
        "traducao": "linguagem do ecossistema Apple",
        "explicacao": "Linguagem usada no desenvolvimento nativo para plataformas Apple.",
        "erroComum": "Confundir Swift com framework multiplataforma.",
        "linguagem": "conceito",
        "exercicio": "MOB03",
        "ondeAparece": "Exemplo citado no cartão Nativo.",
        "exemploPratico": "Aplicativo iOS integrado profundamente a recursos Apple.",
        "analogia": "Assim como Kotlin pode atender Android nativo, Swift atende o ecossistema Apple."
      },
      {
        "id": "react-native",
        "termo": "React Native",
        "categoria": "Framework",
        "traducao": "framework JavaScript multiplataforma",
        "explicacao": "Permite criar interfaces mobile usando JavaScript/TypeScript e componentes do ecossistema React Native.",
        "erroComum": "Entrar em React Native antes de entender fundamentos de Mobile.",
        "linguagem": "conceito",
        "exercicio": "MOB03",
        "ondeAparece": "É citado somente como exemplo de multiplataforma nesta fase.",
        "exemploPratico": "Um app Android+iOS mantido por uma equipe JavaScript.",
        "analogia": "É uma ponte de desenvolvimento multiplataforma, não a definição de “mobile”."
      },
      {
        "id": "flutter",
        "termo": "Flutter",
        "categoria": "Framework",
        "traducao": "framework multiplataforma",
        "explicacao": "Framework multiplataforma que usa Dart e seu próprio conjunto de widgets.",
        "erroComum": "Achar que Flutter e React Native são a mesma tecnologia.",
        "linguagem": "conceito",
        "exercicio": "MOB03",
        "ondeAparece": "É citado no cartão Multiplataforma.",
        "exemploPratico": "Aplicação única para Android e iOS construída com uma base compartilhada.",
        "analogia": "É outra estratégia para resolver o mesmo tipo de problema multiplataforma."
      },
      {
        "id": "framework",
        "termo": "framework",
        "categoria": "Arquitetura/Ferramenta",
        "traducao": "estrutura de desenvolvimento",
        "explicacao": "Conjunto organizado de bibliotecas, convenções e ferramentas que orienta a construção do software.",
        "erroComum": "Confundir framework com linguagem.",
        "linguagem": "conceito",
        "exercicio": "MOB03",
        "ondeAparece": "React Native e Flutter são apresentados como exemplos.",
        "exemploPratico": "React Native usa JavaScript/TypeScript; a linguagem e o framework não são a mesma coisa.",
        "analogia": "É como uma estrutura pronta de construção: define encaixes e formas de trabalhar."
      }
    ],
    "dicasProgressivas": {
      "html": [
        "Comece diferenciando abordagem de ferramenta.",
        "Confira os values do select e as chaves do objeto respostas.",
        "Teste todos os cenários.",
        "Justifique a escolha, não apenas o nome da tecnologia."
      ],
      "css": [
        "Comece diferenciando abordagem de ferramenta.",
        "Confira os values do select e as chaves do objeto respostas.",
        "Teste todos os cenários.",
        "Justifique a escolha, não apenas o nome da tecnologia."
      ],
      "js": [
        "Comece diferenciando abordagem de ferramenta.",
        "Confira os values do select e as chaves do objeto respostas.",
        "Teste todos os cenários.",
        "Justifique a escolha, não apenas o nome da tecnologia."
      ],
      "readme": [
        "Comece diferenciando abordagem de ferramenta.",
        "Confira os values do select e as chaves do objeto respostas.",
        "Teste todos os cenários.",
        "Justifique a escolha, não apenas o nome da tecnologia."
      ]
    },
    "comportamento": {
      "descricao": "Selecione um cenário, clique em Analisar e confira se a recomendação muda. Textos e detalhes podem ser personalizados.",
      "criterios": [
        {
          "id": "analisar",
          "tipo": "event",
          "evento": "click",
          "seletor": "#analisarTecnologia",
          "rotulo": "Selecionar um cenário e usar o botão Analisar"
        },
        {
          "id": "recomendacao-alterada",
          "tipo": "textChangedFrom",
          "seletor": "#recomendacaoTecnologia",
          "valor": "Selecione um cenário e analise.",
          "rotulo": "A recomendação foi atualizada"
        }
      ]
    },
    "aulaVisual": {
      "titulo": "Mapa de decisão — escolher tecnologia pelo problema",
      "pergunta": "Existe uma tecnologia mobile que é sempre a melhor?",
      "ideiaCentral": "Não. A escolha depende de plataforma, equipe, distribuição, recursos do aparelho, prazo e manutenção.",
      "fluxo": [
        {
          "id": "problema",
          "rotulo": "1. Entenda o problema",
          "detalhe": "Quem usa? Em quais aparelhos? Precisa instalar? Precisa de hardware específico?"
        },
        {
          "id": "web",
          "rotulo": "2. Web / PWA",
          "detalhe": "Boa quando acesso por link, alcance e tecnologias Web são importantes."
        },
        {
          "id": "nativo",
          "rotulo": "3. Nativo",
          "detalhe": "Boa quando há foco em uma plataforma e integração profunda com o sistema."
        },
        {
          "id": "multi",
          "rotulo": "4. Multiplataforma",
          "detalhe": "Busca compartilhar código entre Android/iOS com frameworks como React Native ou Flutter."
        },
        {
          "id": "decisao",
          "rotulo": "5. Justifique",
          "detalhe": "A recomendação precisa explicar o motivo, não apenas citar uma ferramenta."
        }
      ],
      "comparacao": [
        {
          "titulo": "Nativo",
          "texto": "Kotlin/Java no Android e Swift no iOS são exemplos de tecnologias ligadas à plataforma."
        },
        {
          "titulo": "Web / PWA",
          "texto": "HTML, CSS e JavaScript executados pelo navegador com recursos progressivos."
        },
        {
          "titulo": "Multiplataforma",
          "texto": "Um projeto compartilha grande parte da lógica entre plataformas."
        }
      ],
      "observe": "Os três cenários do seletor produzem respostas diferentes porque cada requisito favorece uma abordagem tecnológica.",
      "miniDesafio": "Troque um cenário e peça para a turma defender uma tecnologia diferente com argumentos técnicos."
    },
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 4,
    "studentReferenceStripped": true,
    "codigo": "MOB04",
    "disciplina": "Programação Mobile",
    "fase": 1,
    "faseNome": "Introdução ao Desenvolvimento Mobile",
    "fasePedagogica": 1,
    "titulo": "MOB04 - Ecossistema de Desenvolvimento Mobile",
    "nomeCurto": "Ecossistema e ferramentas",
    "tema": "Ferramentas e fluxo de desenvolvimento mobile",
    "objetivo": "Reconhecer o papel de editor/IDE, SDK, framework, emulador, dispositivo real, Git/GitHub, build e distribuição dentro do processo de desenvolvimento.",
    "produto": "Mapa interativo do ecossistema e do fluxo de desenvolvimento mobile.",
    "contextoProfissional": "Preparação conceitual para as ferramentas que serão usadas nas próximas fases.",
    "alteracaoObrigatoria": "Adicione um quinto cartão de ferramenta relacionado a testes, depuração, design ou distribuição e indique em qual etapa do fluxo ele seria usado.",
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
    "pasta": "mobile-04",
    "repositorio": "atividades-mobile-sub",
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
      "readme": "# MOB04 - Ecossistema de Desenvolvimento Mobile\n\nDesenvolver para dispositivos móveis envolve mais do que uma linguagem. Existe um **ecossistema de ferramentas**.\n\n## Ferramentas que aparecerão na disciplina\n\n- **VS Code:** edição de código;\n- **Git e GitHub:** versionamento e entrega;\n- **Navegador/PWA:** testes de experiências Web Mobile;\n- **React Native e Expo:** desenvolvimento multiplataforma em uma fase posterior;\n- **Android Studio:** SDK, emulador e aprofundamento Android;\n- **Aparelho real:** teste de toque, câmera, localização e comportamento real.\n\n## Fluxo de trabalho\n\nPlanejar → programar → executar → testar → corrigir → versionar → gerar uma versão de distribuição.\n\n## Importante\n\nNas próximas fases, antes de React Native, estudaremos responsividade, Mobile First, zona do polegar, Flexbox, CSS Grid e JavaScript aplicado a interfaces móveis.\n"
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
    "classroom": {
      "titulo": "MOB04 — Ecossistema e ferramentas",
      "descricao": "Nesta atividade, vamos estudar ferramentas e fluxo de desenvolvimento mobile.\n\nReconhecer o papel de editor/IDE, SDK, framework, emulador, dispositivo real, Git/GitHub, build e distribuição dentro do processo de desenvolvimento.\n\nAlteração obrigatória: Adicione um quinto cartão de ferramenta relacionado a testes, depuração, design ou distribuição e indique em qual etapa do fluxo ele seria usado.\n\nEntrega: anexar o link do repositório do GitHub."
    },
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
    "glossario": [
      {
        "id": "ide",
        "termo": "IDE",
        "categoria": "Ferramenta",
        "traducao": "Integrated Development Environment",
        "explicacao": "Ambiente que reúne edição, execução e depuração de software.",
        "erroComum": "Achar que toda IDE serve igualmente para todas as plataformas.",
        "linguagem": "conceito",
        "exercicio": "MOB04",
        "ondeAparece": "Cartão Editor / IDE.",
        "exemploPratico": "Android Studio reúne editor, execução, emulador e depuração.",
        "analogia": "É uma oficina de desenvolvimento com várias ferramentas no mesmo lugar."
      },
      {
        "id": "sdk",
        "termo": "SDK",
        "categoria": "Ferramenta",
        "traducao": "Software Development Kit",
        "explicacao": "Conjunto de ferramentas e APIs para desenvolver para uma plataforma.",
        "erroComum": "Confundir SDK com linguagem de programação.",
        "linguagem": "conceito",
        "exercicio": "MOB04",
        "ondeAparece": "Cartão SDK e framework.",
        "exemploPratico": "SDK Android disponibiliza ferramentas/APIs para criar apps Android.",
        "analogia": "É uma caixa de ferramentas oficial para construir para uma plataforma."
      },
      {
        "id": "emulador",
        "termo": "emulador",
        "categoria": "Teste",
        "traducao": "simulação de dispositivo",
        "explicacao": "Executa uma representação de um aparelho para testes no computador.",
        "erroComum": "Substituir todos os testes em aparelho real pelo emulador.",
        "linguagem": "conceito",
        "exercicio": "MOB04",
        "ondeAparece": "Cartão Teste.",
        "exemploPratico": "Simular um aparelho Android no computador.",
        "analogia": "É um aparelho virtual útil para testar, mas não substitui totalmente o físico."
      },
      {
        "id": "versionamento",
        "termo": "versionamento",
        "categoria": "Processo",
        "traducao": "controle de versões",
        "explicacao": "Registra mudanças do projeto ao longo do tempo, normalmente com Git.",
        "erroComum": "Usar Git apenas no momento final da entrega.",
        "linguagem": "conceito",
        "exercicio": "MOB04",
        "ondeAparece": "Cartão Versionamento.",
        "exemploPratico": "Commitar uma mudança funcional antes de começar a próxima.",
        "analogia": "É um histórico com pontos de retorno do projeto."
      },
      {
        "id": "git",
        "termo": "Git",
        "categoria": "Versionamento",
        "traducao": "controle de versões",
        "explicacao": "Sistema que registra mudanças do projeto e permite comparar, recuperar e organizar versões.",
        "erroComum": "Usar Git apenas para “mandar para o GitHub”.",
        "linguagem": "conceito",
        "exercicio": "MOB04",
        "ondeAparece": "O cartão Versionamento cita Git e GitHub.",
        "exemploPratico": "Criar commits após cada etapa funcional.",
        "analogia": "É um histórico detalhado e reversível do projeto."
      },
      {
        "id": "github",
        "termo": "GitHub",
        "categoria": "Colaboração",
        "traducao": "hospedagem de repositórios Git",
        "explicacao": "Serviço que hospeda repositórios e facilita colaboração, revisão e entrega.",
        "erroComum": "Confundir Git com GitHub.",
        "linguagem": "conceito",
        "exercicio": "MOB04",
        "ondeAparece": "Aparece junto ao Git no cartão Versionamento.",
        "exemploPratico": "Publicar o repositório da atividade.",
        "analogia": "Git é o sistema de versionamento; GitHub é um serviço que recebe repositórios Git."
      },
      {
        "id": "build",
        "termo": "build",
        "categoria": "Distribuição",
        "traducao": "construção de uma versão executável",
        "explicacao": "Processo que prepara/empacota o projeto para execução, teste ou distribuição.",
        "erroComum": "Achar que salvar o arquivo já gera automaticamente uma versão instalável.",
        "linguagem": "conceito",
        "exercicio": "MOB04",
        "ondeAparece": "Última etapa do fluxo de desenvolvimento.",
        "exemploPratico": "Gerar uma versão Android para instalação.",
        "analogia": "É como transformar os arquivos de trabalho em um produto preparado para entrega."
      },
      {
        "id": "debug",
        "termo": "depuração",
        "categoria": "Teste",
        "traducao": "investigação de erros",
        "explicacao": "Processo de observar estado, mensagens e execução para localizar e corrigir problemas.",
        "erroComum": "Tentar corrigir sem reproduzir nem entender o erro.",
        "linguagem": "conceito",
        "exercicio": "MOB04",
        "ondeAparece": "Editor/IDE e ferramentas de teste ajudam na depuração.",
        "exemploPratico": "Ler erro, localizar linha e testar correção.",
        "analogia": "É investigar uma falha com evidências, não adivinhar."
      },
      {
        "id": "dispositivo-real",
        "termo": "dispositivo real",
        "categoria": "Teste",
        "traducao": "aparelho físico",
        "explicacao": "Celular ou tablet físico usado para testar comportamento que pode diferir do emulador.",
        "erroComum": "Confiar somente no emulador.",
        "linguagem": "conceito",
        "exercicio": "MOB04",
        "ondeAparece": "O fluxo de teste cita aparelho real.",
        "exemploPratico": "Testar câmera, desempenho, toque e permissões no celular.",
        "analogia": "É o ambiente onde o usuário de fato vai executar o produto."
      }
    ],
    "dicasProgressivas": {
      "html": [
        "Associe cada ferramenta a uma função.",
        "Confira o atributo hidden da lista.",
        "Teste mostrar e ocultar duas vezes.",
        "Lembre que React Native aparece apenas em fase posterior."
      ],
      "css": [
        "Associe cada ferramenta a uma função.",
        "Confira o atributo hidden da lista.",
        "Teste mostrar e ocultar duas vezes.",
        "Lembre que React Native aparece apenas em fase posterior."
      ],
      "js": [
        "Associe cada ferramenta a uma função.",
        "Confira o atributo hidden da lista.",
        "Teste mostrar e ocultar duas vezes.",
        "Lembre que React Native aparece apenas em fase posterior."
      ],
      "readme": [
        "Associe cada ferramenta a uma função.",
        "Confira o atributo hidden da lista.",
        "Teste mostrar e ocultar duas vezes.",
        "Lembre que React Native aparece apenas em fase posterior."
      ]
    },
    "comportamento": {
      "descricao": "Execute a ação principal e confira se a interface responde. Textos e detalhes visuais podem ser personalizados.",
      "criterios": [
        {
          "id": "mostrar",
          "tipo": "event",
          "evento": "click",
          "seletor": "#mostrarFluxoDesenvolvimento",
          "rotulo": "Usar o botão de fluxo"
        },
        {
          "id": "lista-visivel",
          "tipo": "notHidden",
          "seletor": "#fluxoDesenvolvimento",
          "rotulo": "A lista de etapas ficou visível"
        }
      ]
    },
    "aulaVisual": {
      "titulo": "Mapa do ecossistema — da ideia até a distribuição",
      "pergunta": "Programar um app significa usar apenas um editor de código?",
      "ideiaCentral": "Não. Desenvolvimento mobile envolve ferramentas diferentes em um fluxo: escrever, executar, testar, versionar, construir e distribuir.",
      "fluxo": [
        {
          "id": "planejar",
          "rotulo": "1. Planejar",
          "detalhe": "Definir problema, telas, dados, recursos e requisitos."
        },
        {
          "id": "editar",
          "rotulo": "2. Editar",
          "detalhe": "VS Code ou uma IDE ajuda a escrever e organizar o código."
        },
        {
          "id": "sdk",
          "rotulo": "3. SDK / framework",
          "detalhe": "Fornece APIs, bibliotecas e comandos para a plataforma."
        },
        {
          "id": "testar",
          "rotulo": "4. Testar",
          "detalhe": "Navegador, emulador e aparelho real revelam comportamentos diferentes."
        },
        {
          "id": "versionar",
          "rotulo": "5. Versionar",
          "detalhe": "Git registra alterações; GitHub ajuda colaboração e entrega."
        },
        {
          "id": "build",
          "rotulo": "6. Build/distribuição",
          "detalhe": "O projeto é transformado em uma versão pronta para instalar ou publicar."
        }
      ],
      "comparacao": [
        {
          "titulo": "Editor/IDE",
          "texto": "Lugar onde você escreve, navega e depura o projeto."
        },
        {
          "titulo": "SDK/framework",
          "texto": "Conjunto de ferramentas e APIs usadas para desenvolver."
        },
        {
          "titulo": "Emulador/aparelho real",
          "texto": "Ambientes de teste; um não substitui completamente o outro."
        }
      ],
      "observe": "A ação “Mostrar fluxo” apresenta as etapas do processo e a relação entre editor, SDK/framework, teste, versionamento e distribuição.",
      "miniDesafio": "Pergunte em qual etapa entrariam Git, Android Studio, Expo e um celular conectado por USB."
    },
    "referenciaCompletaPadrao": false
  }
];

window.DISCIPLINE_CONFIGS = {
  "mobile": {
    "name": "Plataforma 2DS Sub - Programação Mobile - Aluno",
    "shortName": "Programação Mobile",
    "slug": "mobile",
    "storagePrefix": "ds2sub_mobile",
    "version": "0.1.42",
    "releasedAt": "2026-08-12T22:11:00-03:00",
    "versionManifest": "version.json",
    "classroomUrl": "https://classroom.google.com/",
    "githubDefault": "https://github.com/",
    "repositorio": "atividades-mobile-sub",
    "minimumActiveSeconds": 300
  }
};

window.DISCIPLINES = {
  "mobile": {
    "label": "Programação Mobile",
    "config": {
      "name": "Plataforma 2DS Sub - Programação Mobile - Aluno",
      "shortName": "Programação Mobile",
      "slug": "mobile",
      "storagePrefix": "ds2sub_mobile",
      "version": "0.1.42",
      "releasedAt": "2026-08-12T22:11:00-03:00",
      "versionManifest": "version.json",
      "classroomUrl": "https://classroom.google.com/",
      "githubDefault": "https://github.com/",
      "repositorio": "atividades-mobile-sub",
      "minimumActiveSeconds": 300
    },
    "exercises": [
      {
        "numero": 1,
        "codigo": "MOB01",
        "disciplina": "Programação Mobile",
        "fase": 1,
        "faseNome": "Introdução ao Desenvolvimento Mobile",
        "fasePedagogica": 1,
        "titulo": "MOB01 - Introdução ao Mobile",
        "nomeCurto": "Introdução ao Mobile",
        "tema": "Introdução ao desenvolvimento mobile",
        "objetivo": "Compreender o que diferencia uma experiência mobile de uma página pensada apenas para desktop e reconhecer Web, Web Mobile e aplicativo como entregas diferentes.",
        "produto": "Página comparativa interativa sobre experiências Web e Mobile.",
        "contextoProfissional": "Primeiro contato com decisões de produto e interface para dispositivos móveis.",
        "alteracaoObrigatoria": "Personalize um dos três cartões com um exemplo de aplicativo ou serviço conhecido e explique em uma frase por que ele se encaixa naquela categoria.",
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
        "pasta": "mobile-01",
        "repositorio": "atividades-mobile-sub",
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
          "readme": "# MOB01 - Introdução ao Desenvolvimento Mobile\n\nNesta atividade, você compara **Web tradicional**, **Web Mobile** e **Aplicativo Mobile**.\n\n## Conceitos principais\n\n- tela menor não significa apenas reduzir o tamanho dos elementos;\n- o toque substitui muitas interações feitas com mouse;\n- o dispositivo pode oferecer câmera, GPS, sensores e notificações;\n- a conexão pode mudar enquanto a pessoa se movimenta.\n\n## Como testar\n\n1. Abra `index.html` no navegador.\n2. Reduza a largura da janela para simular um celular.\n3. Clique em **Comparar experiências**.\n4. Observe a reorganização dos cartões e a mensagem apresentada.\n\n## Reflexão\n\nExplique com suas palavras por que uma boa experiência mobile exige decisões próprias de interface.\n"
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
        "classroom": {
          "titulo": "MOB01 — Introdução ao Mobile",
          "descricao": "Nesta atividade, vamos estudar introdução ao desenvolvimento mobile.\n\nCompreender o que diferencia uma experiência mobile de uma página pensada apenas para desktop e reconhecer Web, Web Mobile e aplicativo como entregas diferentes.\n\nAlteração obrigatória: Personalize um dos três cartões com um exemplo de aplicativo ou serviço conhecido e explique em uma frase por que ele se encaixa naquela categoria.\n\nEntrega: anexar o link do repositório do GitHub."
        },
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
        "glossario": [
          {
            "id": "viewport",
            "termo": "viewport",
            "categoria": "Configuração de tela",
            "traducao": "área visível",
            "explicacao": "Instrui o navegador sobre como dimensionar a página no dispositivo.",
            "erroComum": "Confundir viewport com tamanho físico da tela.",
            "linguagem": "html",
            "exercicio": "MOB01",
            "ondeAparece": "No <head> de index.html: meta name=\"viewport\".",
            "exemploPratico": "Faz a largura lógica acompanhar a largura do celular.",
            "analogia": "É como dizer ao navegador qual tamanho de janela ele deve considerar antes de organizar a página."
          },
          {
            "id": "mobile",
            "termo": "mobile",
            "categoria": "Conceito",
            "traducao": "móvel",
            "explicacao": "Experiência projetada considerando uso em dispositivos móveis.",
            "erroComum": "Achar que mobile significa apenas tela pequena.",
            "linguagem": "conceito",
            "exercicio": "MOB01",
            "ondeAparece": "É o conceito central de toda a atividade.",
            "exemploPratico": "Uma interface pensada para uso rápido, por toque e em tela pequena.",
            "analogia": "Mobile é o contexto de uso, não apenas o tamanho do monitor."
          },
          {
            "id": "aria-live",
            "termo": "aria-live",
            "categoria": "Acessibilidade",
            "traducao": "região de atualização",
            "explicacao": "Permite anunciar mudanças de conteúdo para tecnologias assistivas.",
            "erroComum": "Usar em qualquer texto sem necessidade.",
            "linguagem": "html",
            "exercicio": "MOB01",
            "ondeAparece": "No parágrafo #resumoMobile.",
            "exemploPratico": "A mensagem alterada pelo JavaScript pode ser anunciada por tecnologia assistiva.",
            "analogia": "Funciona como uma região que avisa: “o conteúdo aqui mudou”."
          },
          {
            "id": "web-mobile",
            "termo": "Web Mobile",
            "categoria": "Conceito",
            "traducao": "Web pensada para celular",
            "explicacao": "Experiência Web adaptada a telas menores, toque e contexto móvel.",
            "erroComum": "Achar que basta reduzir a largura do site.",
            "linguagem": "conceito",
            "exercicio": "MOB01",
            "ondeAparece": "Compare a grade no modo Computador e Celular.",
            "exemploPratico": "Um cardápio online que reorganiza botões para uso com uma mão.",
            "analogia": "É como reorganizar uma mochila pequena: não basta encolher os objetos; é preciso priorizar o que fica acessível."
          },
          {
            "id": "app-mobile",
            "termo": "Aplicativo Mobile",
            "categoria": "Conceito",
            "traducao": "software para dispositivo móvel",
            "explicacao": "Aplicação instalada ou distribuída para um ambiente móvel, podendo integrar serviços do sistema.",
            "erroComum": "Achar que todo app precisa acessar todos os sensores.",
            "linguagem": "conceito",
            "exercicio": "MOB01",
            "ondeAparece": "Aparece nos cartões de comparação do HTML.",
            "exemploPratico": "Um app de mapas usando localização e notificações.",
            "analogia": "É um programa que vive no ecossistema do aparelho e conversa com serviços oferecidos pelo sistema."
          },
          {
            "id": "media-query",
            "termo": "@media",
            "categoria": "CSS responsivo",
            "traducao": "regra condicional por tela",
            "explicacao": "Permite aplicar regras CSS quando a tela atende a uma condição, como largura máxima.",
            "erroComum": "Usar breakpoint sem entender o que precisa mudar.",
            "linguagem": "css",
            "exercicio": "MOB01",
            "ondeAparece": "No fim de estilo.css, reorganiza a grade quando a tela fica estreita.",
            "exemploPratico": "Três cartões lado a lado no desktop viram uma coluna no celular.",
            "analogia": "É como uma regra: “se a sala ficar pequena, reorganize as mesas”."
          },
          {
            "id": "touch",
            "termo": "toque",
            "categoria": "Interação",
            "traducao": "entrada pelo dedo",
            "explicacao": "Principal forma de interação direta em celulares e tablets.",
            "erroComum": "Projetar alvos pequenos como se o usuário tivesse um ponteiro preciso.",
            "linguagem": "conceito",
            "exercicio": "MOB01",
            "ondeAparece": "O botão Comparar experiências representa uma ação tocável.",
            "exemploPratico": "Botão grande para confirmar uma compra.",
            "analogia": "O dedo é menos preciso que a ponta do cursor do mouse."
          }
        ],
        "dicasProgressivas": {
          "html": [
            "Relembre o papel deste arquivo.",
            "Localize primeiro os ids e classes usados na atividade.",
            "Compare seu trabalho com os critérios e a explicação. A solução completa fica somente no Modo Professor.",
            "Teste no preview antes de validar."
          ],
          "css": [
            "Relembre o papel deste arquivo.",
            "Localize primeiro os ids e classes usados na atividade.",
            "Compare seu trabalho com os critérios e a explicação. A solução completa fica somente no Modo Professor.",
            "Teste no preview antes de validar."
          ],
          "js": [
            "Relembre o papel deste arquivo.",
            "Localize primeiro os ids e classes usados na atividade.",
            "Compare seu trabalho com os critérios e a explicação. A solução completa fica somente no Modo Professor.",
            "Teste no preview antes de validar."
          ],
          "readme": [
            "Relembre o papel deste arquivo.",
            "Localize primeiro os ids e classes usados na atividade.",
            "Compare seu trabalho com os critérios e a explicação. A solução completa fica somente no Modo Professor.",
            "Teste no preview antes de validar."
          ]
        },
        "comportamento": {
          "descricao": "Execute a ação principal e confira se a interface responde. Textos e detalhes visuais podem ser personalizados.",
          "criterios": [
            {
              "id": "comparar",
              "tipo": "event",
              "evento": "click",
              "seletor": "#compararExperiencias",
              "rotulo": "Usar o botão de comparação"
            },
            {
              "id": "resumo-alterado",
              "tipo": "textChangedFrom",
              "seletor": "#resumoMobile",
              "valor": "Toque no botão para resumir a ideia principal.",
              "rotulo": "A mensagem de resumo foi atualizada"
            }
          ]
        },
        "aulaVisual": {
          "titulo": "Mapa mental — o que torna uma experiência realmente mobile?",
          "pergunta": "Mobile é só diminuir um site para caber no celular?",
          "ideiaCentral": "Não. Mobile combina contexto de uso, toque, espaço de tela, conexão e recursos do aparelho.",
          "fluxo": [
            {
              "id": "contexto",
              "rotulo": "1. Contexto",
              "detalhe": "A pessoa pode estar em movimento, usando uma mão e com atenção dividida."
            },
            {
              "id": "tela",
              "rotulo": "2. Tela",
              "detalhe": "Há menos espaço; conteúdo e ações precisam de prioridade."
            },
            {
              "id": "toque",
              "rotulo": "3. Toque",
              "detalhe": "O dedo substitui o ponteiro do mouse e exige áreas de toque claras."
            },
            {
              "id": "recursos",
              "rotulo": "4. Recursos",
              "detalhe": "Câmera, GPS, sensores e notificações podem participar da experiência."
            },
            {
              "id": "resposta",
              "rotulo": "5. Resposta",
              "detalhe": "A interface precisa confirmar imediatamente o que aconteceu após a ação."
            }
          ],
          "comparacao": [
            {
              "titulo": "Web tradicional",
              "texto": "Abre no navegador; pode ter sido pensada primeiro para tela grande."
            },
            {
              "titulo": "Web Mobile",
              "texto": "Continua no navegador, mas reorganiza conteúdo, navegação e interação para telas menores."
            },
            {
              "titulo": "Aplicativo Mobile",
              "texto": "Pode ser instalado e integrar recursos do sistema e do aparelho."
            }
          ],
          "observe": "No Preview, a comparação entre Computador e Celular mostra as três colunas reorganizadas em uma coluna e o botão ocupando toda a largura.",
          "miniDesafio": "Antes de clicar no botão, peça ao aluno para prever o que o JavaScript mudará na tela."
        },
        "referenciaCompletaPadrao": false
      },
      {
        "numero": 2,
        "codigo": "MOB02",
        "disciplina": "Programação Mobile",
        "fase": 1,
        "faseNome": "Introdução ao Desenvolvimento Mobile",
        "fasePedagogica": 1,
        "titulo": "MOB02 - Como funciona um dispositivo móvel",
        "nomeCurto": "Como funciona um dispositivo móvel",
        "tema": "Funcionamento de dispositivos e aplicativos móveis",
        "objetivo": "Compreender a relação entre entrada, sistema operacional, aplicativo, dados, permissões, sensores e saída.",
        "produto": "Simulador visual de um fluxo entre toque, sistema operacional, sensor e aplicativo.",
        "contextoProfissional": "Modelo mental para futuramente trabalhar câmera, GPS, armazenamento e permissões.",
        "alteracaoObrigatoria": "Acrescente uma sexta camada chamada Rede, Nuvem ou Notificação e descreva em uma frase quando ela participa do fluxo.",
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
        "pasta": "mobile-02",
        "repositorio": "atividades-mobile-sub",
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
          "readme": "# MOB02 - Como funciona um dispositivo móvel\n\nUm aplicativo não trabalha sozinho. Ele depende do **sistema operacional**, do **hardware**, dos **dados** e das **permissões**.\n\n## Camadas estudadas\n\n1. entrada do usuário ou sensor;\n2. sistema operacional;\n3. lógica do aplicativo;\n4. dados locais ou serviços de internet;\n5. resposta apresentada à pessoa.\n\n## Permissões\n\nCâmera, microfone e localização são exemplos de recursos que podem exigir autorização do usuário.\n\n## Teste\n\nAbra `index.html`, execute a simulação e explique por que o aplicativo não deveria acessar todos os recursos do aparelho sem permissão.\n"
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
        "classroom": {
          "titulo": "MOB02 — Como funciona um dispositivo móvel",
          "descricao": "Nesta atividade, vamos estudar funcionamento de dispositivos e aplicativos móveis.\n\nCompreender a relação entre entrada, sistema operacional, aplicativo, dados, permissões, sensores e saída.\n\nAlteração obrigatória: Acrescente uma sexta camada chamada Rede, Nuvem ou Notificação e descreva em uma frase quando ela participa do fluxo.\n\nEntrega: anexar o link do repositório do GitHub."
        },
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
        "glossario": [
          {
            "id": "sistema-operacional",
            "termo": "sistema operacional",
            "categoria": "Plataforma",
            "traducao": "software base",
            "explicacao": "Gerencia hardware, aplicativos, permissões e serviços do aparelho.",
            "erroComum": "Confundir Android/iOS com um aplicativo comum.",
            "linguagem": "conceito",
            "exercicio": "MOB02",
            "ondeAparece": "Na segunda camada do fluxo em index.html.",
            "exemploPratico": "Android verifica se o app pode acessar localização.",
            "analogia": "É como o administrador do prédio: controla quem pode acessar cada recurso."
          },
          {
            "id": "permiss-o",
            "termo": "permissão",
            "categoria": "Segurança",
            "traducao": "autorização",
            "explicacao": "Controle dado ao usuário sobre acesso a câmera, localização e outros recursos.",
            "erroComum": "Solicitar acesso sem necessidade.",
            "linguagem": "conceito",
            "exercicio": "MOB02",
            "ondeAparece": "Na explicação da camada Sistema operacional.",
            "exemploPratico": "Usuário autoriza ou nega acesso à câmera.",
            "analogia": "É uma chave de acesso que o usuário decide entregar ou não."
          },
          {
            "id": "sensor",
            "termo": "sensor",
            "categoria": "Hardware",
            "traducao": "componente de medição",
            "explicacao": "Capta informações como movimento, orientação ou proximidade.",
            "erroComum": "Achar que todo dispositivo possui todos os sensores.",
            "linguagem": "conceito",
            "exercicio": "MOB02",
            "ondeAparece": "Na camada Entrada.",
            "exemploPratico": "Acelerômetro percebe movimento/orientação.",
            "analogia": "É um “sentido” do dispositivo para perceber algo do ambiente."
          },
          {
            "id": "hardware",
            "termo": "hardware",
            "categoria": "Dispositivo",
            "traducao": "parte física",
            "explicacao": "Componentes físicos do aparelho: processador, memória, tela, câmera, GPS e sensores.",
            "erroComum": "Confundir hardware com Android/iOS.",
            "linguagem": "conceito",
            "exercicio": "MOB02",
            "ondeAparece": "A lista de camadas cita câmera, microfone, GPS e sensores.",
            "exemploPratico": "Câmera registra imagem; GPS fornece localização.",
            "analogia": "É o corpo físico do aparelho."
          },
          {
            "id": "entrada",
            "termo": "entrada",
            "categoria": "Fluxo",
            "traducao": "dado recebido",
            "explicacao": "Ação ou dado que chega ao sistema por toque, sensor, câmera, teclado ou outro recurso.",
            "erroComum": "Pensar que entrada é apenas texto digitado.",
            "linguagem": "conceito",
            "exercicio": "MOB02",
            "ondeAparece": "Primeiro item da lista de camadas.",
            "exemploPratico": "Tocar no botão “usar localização”.",
            "analogia": "É a pergunta ou sinal que inicia o processamento."
          },
          {
            "id": "saida",
            "termo": "saída",
            "categoria": "Fluxo",
            "traducao": "resposta apresentada",
            "explicacao": "Resultado entregue ao usuário por tela, som, vibração ou notificação.",
            "erroComum": "Achar que saída é somente console.",
            "linguagem": "conceito",
            "exercicio": "MOB02",
            "ondeAparece": "Último item da lista de camadas.",
            "exemploPratico": "Mostrar a posição atual no mapa e vibrar ao concluir.",
            "analogia": "É a resposta que volta ao usuário."
          },
          {
            "id": "api",
            "termo": "API",
            "categoria": "Integração",
            "traducao": "ponte entre sistemas",
            "explicacao": "Interface que permite ao aplicativo solicitar dados ou ações de outro serviço.",
            "erroComum": "Confundir API com banco de dados.",
            "linguagem": "conceito",
            "exercicio": "MOB02",
            "ondeAparece": "Aparece em “dados e serviços”.",
            "exemploPratico": "Consultar previsão do tempo pela internet.",
            "analogia": "É como um balcão com pedidos definidos: você pede no formato esperado e recebe uma resposta."
          }
        ],
        "dicasProgressivas": {
          "html": [
            "Identifique a função deste arquivo.",
            "Procure as palavras entrada, sistema, aplicativo, dados e saída.",
            "Compare ids e seletores.",
            "Execute a simulação antes de validar."
          ],
          "css": [
            "Identifique a função deste arquivo.",
            "Procure as palavras entrada, sistema, aplicativo, dados e saída.",
            "Compare ids e seletores.",
            "Execute a simulação antes de validar."
          ],
          "js": [
            "Identifique a função deste arquivo.",
            "Procure as palavras entrada, sistema, aplicativo, dados e saída.",
            "Compare ids e seletores.",
            "Execute a simulação antes de validar."
          ],
          "readme": [
            "Identifique a função deste arquivo.",
            "Procure as palavras entrada, sistema, aplicativo, dados e saída.",
            "Compare ids e seletores.",
            "Execute a simulação antes de validar."
          ]
        },
        "comportamento": {
          "descricao": "Execute a ação principal e confira se a interface responde. Textos e detalhes visuais podem ser personalizados.",
          "criterios": [
            {
              "id": "simular",
              "tipo": "event",
              "evento": "click",
              "seletor": "#simularFluxo",
              "rotulo": "Executar a simulação"
            },
            {
              "id": "fluxo-alterado",
              "tipo": "textChangedFrom",
              "seletor": "#fluxoMobile",
              "valor": "A simulação ainda não foi executada.",
              "rotulo": "A sequência foi apresentada"
            }
          ]
        },
        "aulaVisual": {
          "titulo": "Mapa visual — do toque até a resposta do aplicativo",
          "pergunta": "O que acontece entre tocar na tela e receber uma resposta?",
          "ideiaCentral": "A ação atravessa camadas: entrada → sistema operacional/permissões → aplicativo → dados/serviços → saída.",
          "fluxo": [
            {
              "id": "entrada",
              "rotulo": "1. Entrada",
              "detalhe": "Toque, câmera, microfone, GPS ou sensor fornecem um dado."
            },
            {
              "id": "sistema",
              "rotulo": "2. Sistema operacional",
              "detalhe": "Android/iOS media o acesso ao hardware e verifica permissões."
            },
            {
              "id": "app",
              "rotulo": "3. Aplicativo",
              "detalhe": "O código interpreta a ação e decide o que precisa fazer."
            },
            {
              "id": "dados",
              "rotulo": "4. Dados/serviços",
              "detalhe": "O app pode consultar armazenamento local, API, internet ou nuvem."
            },
            {
              "id": "saida",
              "rotulo": "5. Saída",
              "detalhe": "Tela, som, vibração ou notificação apresentam a resposta."
            }
          ],
          "comparacao": [
            {
              "titulo": "Hardware",
              "texto": "Parte física: câmera, GPS, memória, tela, sensores."
            },
            {
              "titulo": "Sistema operacional",
              "texto": "Gerencia recursos, apps, segurança e permissões."
            },
            {
              "titulo": "Aplicativo",
              "texto": "Implementa as regras e a experiência que o usuário vê."
            }
          ],
          "observe": "A ação “Simular toque” apresenta a sequência percorrida entre entrada, sistema operacional, aplicativo, dados e saída.",
          "miniDesafio": "Pergunte: se a permissão de localização for negada, em qual etapa o fluxo precisa tratar o problema?"
        },
        "referenciaCompletaPadrao": false
      },
      {
        "numero": 3,
        "codigo": "MOB03",
        "disciplina": "Programação Mobile",
        "fase": 1,
        "faseNome": "Introdução ao Desenvolvimento Mobile",
        "fasePedagogica": 1,
        "titulo": "MOB03 - Tecnologias Mobile",
        "nomeCurto": "Tecnologias Mobile",
        "tema": "Tecnologias e abordagens de desenvolvimento mobile",
        "objetivo": "Comparar desenvolvimento nativo, Web/PWA e multiplataforma e perceber que a escolha depende dos requisitos do projeto.",
        "produto": "Guia interativo de cenários e abordagens mobile.",
        "contextoProfissional": "Análise inicial de trade-offs antes da escolha de uma stack.",
        "alteracaoObrigatoria": "Acrescente um quarto cenário de projeto e inclua no JavaScript uma recomendação justificada para esse cenário.",
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
        "pasta": "mobile-03",
        "repositorio": "atividades-mobile-sub",
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
          "readme": "# MOB03 - Tecnologias Mobile\n\nExistem diferentes formas de entregar uma experiência mobile. A escolha depende de **requisitos**, **equipe**, **plataformas**, **prazo** e **recursos do dispositivo**.\n\n## Nativo\n\nNormalmente usa ferramentas e linguagens ligadas diretamente ao sistema operacional, como Kotlin/Java no Android e Swift no iOS.\n\n## Web e PWA\n\nUsa HTML, CSS e JavaScript. Uma PWA pode acrescentar recursos como instalação e cache, dependendo do navegador e da plataforma.\n\n## Multiplataforma\n\nTecnologias como React Native e Flutter buscam compartilhar código entre Android e iOS.\n\n## Teste\n\nExecute os três cenários da página. Não existe uma tecnologia universalmente melhor: justifique a escolha com base no problema.\n"
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
        "classroom": {
          "titulo": "MOB03 — Tecnologias Mobile",
          "descricao": "Nesta atividade, vamos estudar tecnologias e abordagens de desenvolvimento mobile.\n\nComparar desenvolvimento nativo, Web/PWA e multiplataforma e perceber que a escolha depende dos requisitos do projeto.\n\nAlteração obrigatória: Acrescente um quarto cenário de projeto e inclua no JavaScript uma recomendação justificada para esse cenário.\n\nEntrega: anexar o link do repositório do GitHub."
        },
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
        "glossario": [
          {
            "id": "nativo",
            "termo": "nativo",
            "categoria": "Abordagem",
            "traducao": "específico da plataforma",
            "explicacao": "Aplicativo desenvolvido com tecnologias diretamente ligadas ao sistema operacional alvo.",
            "erroComum": "Achar que nativo significa automaticamente melhor em qualquer projeto.",
            "linguagem": "conceito",
            "exercicio": "MOB03",
            "ondeAparece": "Primeiro cartão e cenário Android.",
            "exemploPratico": "App interno feito somente para aparelhos Android da empresa.",
            "analogia": "É construir diretamente para uma plataforma específica."
          },
          {
            "id": "pwa",
            "termo": "PWA",
            "categoria": "Abordagem Web",
            "traducao": "Progressive Web App",
            "explicacao": "Aplicação Web que pode adicionar capacidades como instalação e cache conforme suporte.",
            "erroComum": "Tratar PWA como idêntica a app nativo.",
            "linguagem": "conceito",
            "exercicio": "MOB03",
            "ondeAparece": "Segundo cartão Web/PWA.",
            "exemploPratico": "Portal acessado por link que pode ser instalado conforme suporte.",
            "analogia": "É uma aplicação Web que ganha capacidades progressivamente."
          },
          {
            "id": "multiplataforma",
            "termo": "multiplataforma",
            "categoria": "Abordagem",
            "traducao": "várias plataformas",
            "explicacao": "Estratégia que busca compartilhar código entre Android, iOS ou outros alvos.",
            "erroComum": "Imaginar que 100% do código sempre será compartilhado.",
            "linguagem": "conceito",
            "exercicio": "MOB03",
            "ondeAparece": "Terceiro cartão e cenário Android+iOS.",
            "exemploPratico": "Equipe pequena compartilha grande parte do projeto entre duas plataformas.",
            "analogia": "É tentar usar uma base comum para chegar a mais de um destino."
          },
          {
            "id": "kotlin",
            "termo": "Kotlin",
            "categoria": "Linguagem",
            "traducao": "linguagem usada no ecossistema Android",
            "explicacao": "Linguagem moderna muito usada para desenvolvimento Android nativo.",
            "erroComum": "Achar que Kotlin é o próprio Android.",
            "linguagem": "conceito",
            "exercicio": "MOB03",
            "ondeAparece": "Exemplo citado no cartão Nativo.",
            "exemploPratico": "Aplicativo Android feito especificamente para os dispositivos da empresa.",
            "analogia": "É uma ferramenta de linguagem dentro de uma abordagem nativa."
          },
          {
            "id": "swift",
            "termo": "Swift",
            "categoria": "Linguagem",
            "traducao": "linguagem do ecossistema Apple",
            "explicacao": "Linguagem usada no desenvolvimento nativo para plataformas Apple.",
            "erroComum": "Confundir Swift com framework multiplataforma.",
            "linguagem": "conceito",
            "exercicio": "MOB03",
            "ondeAparece": "Exemplo citado no cartão Nativo.",
            "exemploPratico": "Aplicativo iOS integrado profundamente a recursos Apple.",
            "analogia": "Assim como Kotlin pode atender Android nativo, Swift atende o ecossistema Apple."
          },
          {
            "id": "react-native",
            "termo": "React Native",
            "categoria": "Framework",
            "traducao": "framework JavaScript multiplataforma",
            "explicacao": "Permite criar interfaces mobile usando JavaScript/TypeScript e componentes do ecossistema React Native.",
            "erroComum": "Entrar em React Native antes de entender fundamentos de Mobile.",
            "linguagem": "conceito",
            "exercicio": "MOB03",
            "ondeAparece": "É citado somente como exemplo de multiplataforma nesta fase.",
            "exemploPratico": "Um app Android+iOS mantido por uma equipe JavaScript.",
            "analogia": "É uma ponte de desenvolvimento multiplataforma, não a definição de “mobile”."
          },
          {
            "id": "flutter",
            "termo": "Flutter",
            "categoria": "Framework",
            "traducao": "framework multiplataforma",
            "explicacao": "Framework multiplataforma que usa Dart e seu próprio conjunto de widgets.",
            "erroComum": "Achar que Flutter e React Native são a mesma tecnologia.",
            "linguagem": "conceito",
            "exercicio": "MOB03",
            "ondeAparece": "É citado no cartão Multiplataforma.",
            "exemploPratico": "Aplicação única para Android e iOS construída com uma base compartilhada.",
            "analogia": "É outra estratégia para resolver o mesmo tipo de problema multiplataforma."
          },
          {
            "id": "framework",
            "termo": "framework",
            "categoria": "Arquitetura/Ferramenta",
            "traducao": "estrutura de desenvolvimento",
            "explicacao": "Conjunto organizado de bibliotecas, convenções e ferramentas que orienta a construção do software.",
            "erroComum": "Confundir framework com linguagem.",
            "linguagem": "conceito",
            "exercicio": "MOB03",
            "ondeAparece": "React Native e Flutter são apresentados como exemplos.",
            "exemploPratico": "React Native usa JavaScript/TypeScript; a linguagem e o framework não são a mesma coisa.",
            "analogia": "É como uma estrutura pronta de construção: define encaixes e formas de trabalhar."
          }
        ],
        "dicasProgressivas": {
          "html": [
            "Comece diferenciando abordagem de ferramenta.",
            "Confira os values do select e as chaves do objeto respostas.",
            "Teste todos os cenários.",
            "Justifique a escolha, não apenas o nome da tecnologia."
          ],
          "css": [
            "Comece diferenciando abordagem de ferramenta.",
            "Confira os values do select e as chaves do objeto respostas.",
            "Teste todos os cenários.",
            "Justifique a escolha, não apenas o nome da tecnologia."
          ],
          "js": [
            "Comece diferenciando abordagem de ferramenta.",
            "Confira os values do select e as chaves do objeto respostas.",
            "Teste todos os cenários.",
            "Justifique a escolha, não apenas o nome da tecnologia."
          ],
          "readme": [
            "Comece diferenciando abordagem de ferramenta.",
            "Confira os values do select e as chaves do objeto respostas.",
            "Teste todos os cenários.",
            "Justifique a escolha, não apenas o nome da tecnologia."
          ]
        },
        "comportamento": {
          "descricao": "Selecione um cenário, clique em Analisar e confira se a recomendação muda. Textos e detalhes podem ser personalizados.",
          "criterios": [
            {
              "id": "analisar",
              "tipo": "event",
              "evento": "click",
              "seletor": "#analisarTecnologia",
              "rotulo": "Selecionar um cenário e usar o botão Analisar"
            },
            {
              "id": "recomendacao-alterada",
              "tipo": "textChangedFrom",
              "seletor": "#recomendacaoTecnologia",
              "valor": "Selecione um cenário e analise.",
              "rotulo": "A recomendação foi atualizada"
            }
          ]
        },
        "aulaVisual": {
          "titulo": "Mapa de decisão — escolher tecnologia pelo problema",
          "pergunta": "Existe uma tecnologia mobile que é sempre a melhor?",
          "ideiaCentral": "Não. A escolha depende de plataforma, equipe, distribuição, recursos do aparelho, prazo e manutenção.",
          "fluxo": [
            {
              "id": "problema",
              "rotulo": "1. Entenda o problema",
              "detalhe": "Quem usa? Em quais aparelhos? Precisa instalar? Precisa de hardware específico?"
            },
            {
              "id": "web",
              "rotulo": "2. Web / PWA",
              "detalhe": "Boa quando acesso por link, alcance e tecnologias Web são importantes."
            },
            {
              "id": "nativo",
              "rotulo": "3. Nativo",
              "detalhe": "Boa quando há foco em uma plataforma e integração profunda com o sistema."
            },
            {
              "id": "multi",
              "rotulo": "4. Multiplataforma",
              "detalhe": "Busca compartilhar código entre Android/iOS com frameworks como React Native ou Flutter."
            },
            {
              "id": "decisao",
              "rotulo": "5. Justifique",
              "detalhe": "A recomendação precisa explicar o motivo, não apenas citar uma ferramenta."
            }
          ],
          "comparacao": [
            {
              "titulo": "Nativo",
              "texto": "Kotlin/Java no Android e Swift no iOS são exemplos de tecnologias ligadas à plataforma."
            },
            {
              "titulo": "Web / PWA",
              "texto": "HTML, CSS e JavaScript executados pelo navegador com recursos progressivos."
            },
            {
              "titulo": "Multiplataforma",
              "texto": "Um projeto compartilha grande parte da lógica entre plataformas."
            }
          ],
          "observe": "Os três cenários do seletor produzem respostas diferentes porque cada requisito favorece uma abordagem tecnológica.",
          "miniDesafio": "Troque um cenário e peça para a turma defender uma tecnologia diferente com argumentos técnicos."
        },
        "referenciaCompletaPadrao": false
      },
      {
        "numero": 4,
        "codigo": "MOB04",
        "disciplina": "Programação Mobile",
        "fase": 1,
        "faseNome": "Introdução ao Desenvolvimento Mobile",
        "fasePedagogica": 1,
        "titulo": "MOB04 - Ecossistema de Desenvolvimento Mobile",
        "nomeCurto": "Ecossistema e ferramentas",
        "tema": "Ferramentas e fluxo de desenvolvimento mobile",
        "objetivo": "Reconhecer o papel de editor/IDE, SDK, framework, emulador, dispositivo real, Git/GitHub, build e distribuição dentro do processo de desenvolvimento.",
        "produto": "Mapa interativo do ecossistema e do fluxo de desenvolvimento mobile.",
        "contextoProfissional": "Preparação conceitual para as ferramentas que serão usadas nas próximas fases.",
        "alteracaoObrigatoria": "Adicione um quinto cartão de ferramenta relacionado a testes, depuração, design ou distribuição e indique em qual etapa do fluxo ele seria usado.",
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
        "pasta": "mobile-04",
        "repositorio": "atividades-mobile-sub",
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
          "readme": "# MOB04 - Ecossistema de Desenvolvimento Mobile\n\nDesenvolver para dispositivos móveis envolve mais do que uma linguagem. Existe um **ecossistema de ferramentas**.\n\n## Ferramentas que aparecerão na disciplina\n\n- **VS Code:** edição de código;\n- **Git e GitHub:** versionamento e entrega;\n- **Navegador/PWA:** testes de experiências Web Mobile;\n- **React Native e Expo:** desenvolvimento multiplataforma em uma fase posterior;\n- **Android Studio:** SDK, emulador e aprofundamento Android;\n- **Aparelho real:** teste de toque, câmera, localização e comportamento real.\n\n## Fluxo de trabalho\n\nPlanejar → programar → executar → testar → corrigir → versionar → gerar uma versão de distribuição.\n\n## Importante\n\nNas próximas fases, antes de React Native, estudaremos responsividade, Mobile First, zona do polegar, Flexbox, CSS Grid e JavaScript aplicado a interfaces móveis.\n"
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
        "classroom": {
          "titulo": "MOB04 — Ecossistema e ferramentas",
          "descricao": "Nesta atividade, vamos estudar ferramentas e fluxo de desenvolvimento mobile.\n\nReconhecer o papel de editor/IDE, SDK, framework, emulador, dispositivo real, Git/GitHub, build e distribuição dentro do processo de desenvolvimento.\n\nAlteração obrigatória: Adicione um quinto cartão de ferramenta relacionado a testes, depuração, design ou distribuição e indique em qual etapa do fluxo ele seria usado.\n\nEntrega: anexar o link do repositório do GitHub."
        },
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
        "glossario": [
          {
            "id": "ide",
            "termo": "IDE",
            "categoria": "Ferramenta",
            "traducao": "Integrated Development Environment",
            "explicacao": "Ambiente que reúne edição, execução e depuração de software.",
            "erroComum": "Achar que toda IDE serve igualmente para todas as plataformas.",
            "linguagem": "conceito",
            "exercicio": "MOB04",
            "ondeAparece": "Cartão Editor / IDE.",
            "exemploPratico": "Android Studio reúne editor, execução, emulador e depuração.",
            "analogia": "É uma oficina de desenvolvimento com várias ferramentas no mesmo lugar."
          },
          {
            "id": "sdk",
            "termo": "SDK",
            "categoria": "Ferramenta",
            "traducao": "Software Development Kit",
            "explicacao": "Conjunto de ferramentas e APIs para desenvolver para uma plataforma.",
            "erroComum": "Confundir SDK com linguagem de programação.",
            "linguagem": "conceito",
            "exercicio": "MOB04",
            "ondeAparece": "Cartão SDK e framework.",
            "exemploPratico": "SDK Android disponibiliza ferramentas/APIs para criar apps Android.",
            "analogia": "É uma caixa de ferramentas oficial para construir para uma plataforma."
          },
          {
            "id": "emulador",
            "termo": "emulador",
            "categoria": "Teste",
            "traducao": "simulação de dispositivo",
            "explicacao": "Executa uma representação de um aparelho para testes no computador.",
            "erroComum": "Substituir todos os testes em aparelho real pelo emulador.",
            "linguagem": "conceito",
            "exercicio": "MOB04",
            "ondeAparece": "Cartão Teste.",
            "exemploPratico": "Simular um aparelho Android no computador.",
            "analogia": "É um aparelho virtual útil para testar, mas não substitui totalmente o físico."
          },
          {
            "id": "versionamento",
            "termo": "versionamento",
            "categoria": "Processo",
            "traducao": "controle de versões",
            "explicacao": "Registra mudanças do projeto ao longo do tempo, normalmente com Git.",
            "erroComum": "Usar Git apenas no momento final da entrega.",
            "linguagem": "conceito",
            "exercicio": "MOB04",
            "ondeAparece": "Cartão Versionamento.",
            "exemploPratico": "Commitar uma mudança funcional antes de começar a próxima.",
            "analogia": "É um histórico com pontos de retorno do projeto."
          },
          {
            "id": "git",
            "termo": "Git",
            "categoria": "Versionamento",
            "traducao": "controle de versões",
            "explicacao": "Sistema que registra mudanças do projeto e permite comparar, recuperar e organizar versões.",
            "erroComum": "Usar Git apenas para “mandar para o GitHub”.",
            "linguagem": "conceito",
            "exercicio": "MOB04",
            "ondeAparece": "O cartão Versionamento cita Git e GitHub.",
            "exemploPratico": "Criar commits após cada etapa funcional.",
            "analogia": "É um histórico detalhado e reversível do projeto."
          },
          {
            "id": "github",
            "termo": "GitHub",
            "categoria": "Colaboração",
            "traducao": "hospedagem de repositórios Git",
            "explicacao": "Serviço que hospeda repositórios e facilita colaboração, revisão e entrega.",
            "erroComum": "Confundir Git com GitHub.",
            "linguagem": "conceito",
            "exercicio": "MOB04",
            "ondeAparece": "Aparece junto ao Git no cartão Versionamento.",
            "exemploPratico": "Publicar o repositório da atividade.",
            "analogia": "Git é o sistema de versionamento; GitHub é um serviço que recebe repositórios Git."
          },
          {
            "id": "build",
            "termo": "build",
            "categoria": "Distribuição",
            "traducao": "construção de uma versão executável",
            "explicacao": "Processo que prepara/empacota o projeto para execução, teste ou distribuição.",
            "erroComum": "Achar que salvar o arquivo já gera automaticamente uma versão instalável.",
            "linguagem": "conceito",
            "exercicio": "MOB04",
            "ondeAparece": "Última etapa do fluxo de desenvolvimento.",
            "exemploPratico": "Gerar uma versão Android para instalação.",
            "analogia": "É como transformar os arquivos de trabalho em um produto preparado para entrega."
          },
          {
            "id": "debug",
            "termo": "depuração",
            "categoria": "Teste",
            "traducao": "investigação de erros",
            "explicacao": "Processo de observar estado, mensagens e execução para localizar e corrigir problemas.",
            "erroComum": "Tentar corrigir sem reproduzir nem entender o erro.",
            "linguagem": "conceito",
            "exercicio": "MOB04",
            "ondeAparece": "Editor/IDE e ferramentas de teste ajudam na depuração.",
            "exemploPratico": "Ler erro, localizar linha e testar correção.",
            "analogia": "É investigar uma falha com evidências, não adivinhar."
          },
          {
            "id": "dispositivo-real",
            "termo": "dispositivo real",
            "categoria": "Teste",
            "traducao": "aparelho físico",
            "explicacao": "Celular ou tablet físico usado para testar comportamento que pode diferir do emulador.",
            "erroComum": "Confiar somente no emulador.",
            "linguagem": "conceito",
            "exercicio": "MOB04",
            "ondeAparece": "O fluxo de teste cita aparelho real.",
            "exemploPratico": "Testar câmera, desempenho, toque e permissões no celular.",
            "analogia": "É o ambiente onde o usuário de fato vai executar o produto."
          }
        ],
        "dicasProgressivas": {
          "html": [
            "Associe cada ferramenta a uma função.",
            "Confira o atributo hidden da lista.",
            "Teste mostrar e ocultar duas vezes.",
            "Lembre que React Native aparece apenas em fase posterior."
          ],
          "css": [
            "Associe cada ferramenta a uma função.",
            "Confira o atributo hidden da lista.",
            "Teste mostrar e ocultar duas vezes.",
            "Lembre que React Native aparece apenas em fase posterior."
          ],
          "js": [
            "Associe cada ferramenta a uma função.",
            "Confira o atributo hidden da lista.",
            "Teste mostrar e ocultar duas vezes.",
            "Lembre que React Native aparece apenas em fase posterior."
          ],
          "readme": [
            "Associe cada ferramenta a uma função.",
            "Confira o atributo hidden da lista.",
            "Teste mostrar e ocultar duas vezes.",
            "Lembre que React Native aparece apenas em fase posterior."
          ]
        },
        "comportamento": {
          "descricao": "Execute a ação principal e confira se a interface responde. Textos e detalhes visuais podem ser personalizados.",
          "criterios": [
            {
              "id": "mostrar",
              "tipo": "event",
              "evento": "click",
              "seletor": "#mostrarFluxoDesenvolvimento",
              "rotulo": "Usar o botão de fluxo"
            },
            {
              "id": "lista-visivel",
              "tipo": "notHidden",
              "seletor": "#fluxoDesenvolvimento",
              "rotulo": "A lista de etapas ficou visível"
            }
          ]
        },
        "aulaVisual": {
          "titulo": "Mapa do ecossistema — da ideia até a distribuição",
          "pergunta": "Programar um app significa usar apenas um editor de código?",
          "ideiaCentral": "Não. Desenvolvimento mobile envolve ferramentas diferentes em um fluxo: escrever, executar, testar, versionar, construir e distribuir.",
          "fluxo": [
            {
              "id": "planejar",
              "rotulo": "1. Planejar",
              "detalhe": "Definir problema, telas, dados, recursos e requisitos."
            },
            {
              "id": "editar",
              "rotulo": "2. Editar",
              "detalhe": "VS Code ou uma IDE ajuda a escrever e organizar o código."
            },
            {
              "id": "sdk",
              "rotulo": "3. SDK / framework",
              "detalhe": "Fornece APIs, bibliotecas e comandos para a plataforma."
            },
            {
              "id": "testar",
              "rotulo": "4. Testar",
              "detalhe": "Navegador, emulador e aparelho real revelam comportamentos diferentes."
            },
            {
              "id": "versionar",
              "rotulo": "5. Versionar",
              "detalhe": "Git registra alterações; GitHub ajuda colaboração e entrega."
            },
            {
              "id": "build",
              "rotulo": "6. Build/distribuição",
              "detalhe": "O projeto é transformado em uma versão pronta para instalar ou publicar."
            }
          ],
          "comparacao": [
            {
              "titulo": "Editor/IDE",
              "texto": "Lugar onde você escreve, navega e depura o projeto."
            },
            {
              "titulo": "SDK/framework",
              "texto": "Conjunto de ferramentas e APIs usadas para desenvolver."
            },
            {
              "titulo": "Emulador/aparelho real",
              "texto": "Ambientes de teste; um não substitui completamente o outro."
            }
          ],
          "observe": "A ação “Mostrar fluxo” apresenta as etapas do processo e a relação entre editor, SDK/framework, teste, versionamento e distribuição.",
          "miniDesafio": "Pergunte em qual etapa entrariam Git, Android Studio, Expo e um celular conectado por USB."
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
    "codigo": "MOB01",
    "disciplina": "Programação Mobile",
    "fase": 1,
    "faseNome": "Introdução ao Desenvolvimento Mobile",
    "fasePedagogica": 1,
    "titulo": "MOB01 - Introdução ao Mobile",
    "nomeCurto": "Introdução ao Mobile",
    "tema": "Introdução ao desenvolvimento mobile",
    "objetivo": "Compreender o que diferencia uma experiência mobile de uma página pensada apenas para desktop e reconhecer Web, Web Mobile e aplicativo como entregas diferentes.",
    "produto": "Página comparativa interativa sobre experiências Web e Mobile.",
    "contextoProfissional": "Primeiro contato com decisões de produto e interface para dispositivos móveis.",
    "alteracaoObrigatoria": "Personalize um dos três cartões com um exemplo de aplicativo ou serviço conhecido e explique em uma frase por que ele se encaixa naquela categoria.",
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
    "pasta": "mobile-01",
    "repositorio": "atividades-mobile-sub",
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
      "readme": "# MOB01 - Introdução ao Desenvolvimento Mobile\n\nNesta atividade, você compara **Web tradicional**, **Web Mobile** e **Aplicativo Mobile**.\n\n## Conceitos principais\n\n- tela menor não significa apenas reduzir o tamanho dos elementos;\n- o toque substitui muitas interações feitas com mouse;\n- o dispositivo pode oferecer câmera, GPS, sensores e notificações;\n- a conexão pode mudar enquanto a pessoa se movimenta.\n\n## Como testar\n\n1. Abra `index.html` no navegador.\n2. Reduza a largura da janela para simular um celular.\n3. Clique em **Comparar experiências**.\n4. Observe a reorganização dos cartões e a mensagem apresentada.\n\n## Reflexão\n\nExplique com suas palavras por que uma boa experiência mobile exige decisões próprias de interface.\n"
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
    "classroom": {
      "titulo": "MOB01 — Introdução ao Mobile",
      "descricao": "Nesta atividade, vamos estudar introdução ao desenvolvimento mobile.\n\nCompreender o que diferencia uma experiência mobile de uma página pensada apenas para desktop e reconhecer Web, Web Mobile e aplicativo como entregas diferentes.\n\nAlteração obrigatória: Personalize um dos três cartões com um exemplo de aplicativo ou serviço conhecido e explique em uma frase por que ele se encaixa naquela categoria.\n\nEntrega: anexar o link do repositório do GitHub."
    },
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
    "glossario": [
      {
        "id": "viewport",
        "termo": "viewport",
        "categoria": "Configuração de tela",
        "traducao": "área visível",
        "explicacao": "Instrui o navegador sobre como dimensionar a página no dispositivo.",
        "erroComum": "Confundir viewport com tamanho físico da tela.",
        "linguagem": "html",
        "exercicio": "MOB01",
        "ondeAparece": "No <head> de index.html: meta name=\"viewport\".",
        "exemploPratico": "Faz a largura lógica acompanhar a largura do celular.",
        "analogia": "É como dizer ao navegador qual tamanho de janela ele deve considerar antes de organizar a página."
      },
      {
        "id": "mobile",
        "termo": "mobile",
        "categoria": "Conceito",
        "traducao": "móvel",
        "explicacao": "Experiência projetada considerando uso em dispositivos móveis.",
        "erroComum": "Achar que mobile significa apenas tela pequena.",
        "linguagem": "conceito",
        "exercicio": "MOB01",
        "ondeAparece": "É o conceito central de toda a atividade.",
        "exemploPratico": "Uma interface pensada para uso rápido, por toque e em tela pequena.",
        "analogia": "Mobile é o contexto de uso, não apenas o tamanho do monitor."
      },
      {
        "id": "aria-live",
        "termo": "aria-live",
        "categoria": "Acessibilidade",
        "traducao": "região de atualização",
        "explicacao": "Permite anunciar mudanças de conteúdo para tecnologias assistivas.",
        "erroComum": "Usar em qualquer texto sem necessidade.",
        "linguagem": "html",
        "exercicio": "MOB01",
        "ondeAparece": "No parágrafo #resumoMobile.",
        "exemploPratico": "A mensagem alterada pelo JavaScript pode ser anunciada por tecnologia assistiva.",
        "analogia": "Funciona como uma região que avisa: “o conteúdo aqui mudou”."
      },
      {
        "id": "web-mobile",
        "termo": "Web Mobile",
        "categoria": "Conceito",
        "traducao": "Web pensada para celular",
        "explicacao": "Experiência Web adaptada a telas menores, toque e contexto móvel.",
        "erroComum": "Achar que basta reduzir a largura do site.",
        "linguagem": "conceito",
        "exercicio": "MOB01",
        "ondeAparece": "Compare a grade no modo Computador e Celular.",
        "exemploPratico": "Um cardápio online que reorganiza botões para uso com uma mão.",
        "analogia": "É como reorganizar uma mochila pequena: não basta encolher os objetos; é preciso priorizar o que fica acessível."
      },
      {
        "id": "app-mobile",
        "termo": "Aplicativo Mobile",
        "categoria": "Conceito",
        "traducao": "software para dispositivo móvel",
        "explicacao": "Aplicação instalada ou distribuída para um ambiente móvel, podendo integrar serviços do sistema.",
        "erroComum": "Achar que todo app precisa acessar todos os sensores.",
        "linguagem": "conceito",
        "exercicio": "MOB01",
        "ondeAparece": "Aparece nos cartões de comparação do HTML.",
        "exemploPratico": "Um app de mapas usando localização e notificações.",
        "analogia": "É um programa que vive no ecossistema do aparelho e conversa com serviços oferecidos pelo sistema."
      },
      {
        "id": "media-query",
        "termo": "@media",
        "categoria": "CSS responsivo",
        "traducao": "regra condicional por tela",
        "explicacao": "Permite aplicar regras CSS quando a tela atende a uma condição, como largura máxima.",
        "erroComum": "Usar breakpoint sem entender o que precisa mudar.",
        "linguagem": "css",
        "exercicio": "MOB01",
        "ondeAparece": "No fim de estilo.css, reorganiza a grade quando a tela fica estreita.",
        "exemploPratico": "Três cartões lado a lado no desktop viram uma coluna no celular.",
        "analogia": "É como uma regra: “se a sala ficar pequena, reorganize as mesas”."
      },
      {
        "id": "touch",
        "termo": "toque",
        "categoria": "Interação",
        "traducao": "entrada pelo dedo",
        "explicacao": "Principal forma de interação direta em celulares e tablets.",
        "erroComum": "Projetar alvos pequenos como se o usuário tivesse um ponteiro preciso.",
        "linguagem": "conceito",
        "exercicio": "MOB01",
        "ondeAparece": "O botão Comparar experiências representa uma ação tocável.",
        "exemploPratico": "Botão grande para confirmar uma compra.",
        "analogia": "O dedo é menos preciso que a ponta do cursor do mouse."
      }
    ],
    "dicasProgressivas": {
      "html": [
        "Relembre o papel deste arquivo.",
        "Localize primeiro os ids e classes usados na atividade.",
        "Compare seu trabalho com os critérios e a explicação. A solução completa fica somente no Modo Professor.",
        "Teste no preview antes de validar."
      ],
      "css": [
        "Relembre o papel deste arquivo.",
        "Localize primeiro os ids e classes usados na atividade.",
        "Compare seu trabalho com os critérios e a explicação. A solução completa fica somente no Modo Professor.",
        "Teste no preview antes de validar."
      ],
      "js": [
        "Relembre o papel deste arquivo.",
        "Localize primeiro os ids e classes usados na atividade.",
        "Compare seu trabalho com os critérios e a explicação. A solução completa fica somente no Modo Professor.",
        "Teste no preview antes de validar."
      ],
      "readme": [
        "Relembre o papel deste arquivo.",
        "Localize primeiro os ids e classes usados na atividade.",
        "Compare seu trabalho com os critérios e a explicação. A solução completa fica somente no Modo Professor.",
        "Teste no preview antes de validar."
      ]
    },
    "comportamento": {
      "descricao": "Execute a ação principal e confira se a interface responde. Textos e detalhes visuais podem ser personalizados.",
      "criterios": [
        {
          "id": "comparar",
          "tipo": "event",
          "evento": "click",
          "seletor": "#compararExperiencias",
          "rotulo": "Usar o botão de comparação"
        },
        {
          "id": "resumo-alterado",
          "tipo": "textChangedFrom",
          "seletor": "#resumoMobile",
          "valor": "Toque no botão para resumir a ideia principal.",
          "rotulo": "A mensagem de resumo foi atualizada"
        }
      ]
    },
    "aulaVisual": {
      "titulo": "Mapa mental — o que torna uma experiência realmente mobile?",
      "pergunta": "Mobile é só diminuir um site para caber no celular?",
      "ideiaCentral": "Não. Mobile combina contexto de uso, toque, espaço de tela, conexão e recursos do aparelho.",
      "fluxo": [
        {
          "id": "contexto",
          "rotulo": "1. Contexto",
          "detalhe": "A pessoa pode estar em movimento, usando uma mão e com atenção dividida."
        },
        {
          "id": "tela",
          "rotulo": "2. Tela",
          "detalhe": "Há menos espaço; conteúdo e ações precisam de prioridade."
        },
        {
          "id": "toque",
          "rotulo": "3. Toque",
          "detalhe": "O dedo substitui o ponteiro do mouse e exige áreas de toque claras."
        },
        {
          "id": "recursos",
          "rotulo": "4. Recursos",
          "detalhe": "Câmera, GPS, sensores e notificações podem participar da experiência."
        },
        {
          "id": "resposta",
          "rotulo": "5. Resposta",
          "detalhe": "A interface precisa confirmar imediatamente o que aconteceu após a ação."
        }
      ],
      "comparacao": [
        {
          "titulo": "Web tradicional",
          "texto": "Abre no navegador; pode ter sido pensada primeiro para tela grande."
        },
        {
          "titulo": "Web Mobile",
          "texto": "Continua no navegador, mas reorganiza conteúdo, navegação e interação para telas menores."
        },
        {
          "titulo": "Aplicativo Mobile",
          "texto": "Pode ser instalado e integrar recursos do sistema e do aparelho."
        }
      ],
      "observe": "No Preview, a comparação entre Computador e Celular mostra as três colunas reorganizadas em uma coluna e o botão ocupando toda a largura.",
      "miniDesafio": "Antes de clicar no botão, peça ao aluno para prever o que o JavaScript mudará na tela."
    },
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 2,
    "studentReferenceStripped": true,
    "codigo": "MOB02",
    "disciplina": "Programação Mobile",
    "fase": 1,
    "faseNome": "Introdução ao Desenvolvimento Mobile",
    "fasePedagogica": 1,
    "titulo": "MOB02 - Como funciona um dispositivo móvel",
    "nomeCurto": "Como funciona um dispositivo móvel",
    "tema": "Funcionamento de dispositivos e aplicativos móveis",
    "objetivo": "Compreender a relação entre entrada, sistema operacional, aplicativo, dados, permissões, sensores e saída.",
    "produto": "Simulador visual de um fluxo entre toque, sistema operacional, sensor e aplicativo.",
    "contextoProfissional": "Modelo mental para futuramente trabalhar câmera, GPS, armazenamento e permissões.",
    "alteracaoObrigatoria": "Acrescente uma sexta camada chamada Rede, Nuvem ou Notificação e descreva em uma frase quando ela participa do fluxo.",
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
    "pasta": "mobile-02",
    "repositorio": "atividades-mobile-sub",
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
      "readme": "# MOB02 - Como funciona um dispositivo móvel\n\nUm aplicativo não trabalha sozinho. Ele depende do **sistema operacional**, do **hardware**, dos **dados** e das **permissões**.\n\n## Camadas estudadas\n\n1. entrada do usuário ou sensor;\n2. sistema operacional;\n3. lógica do aplicativo;\n4. dados locais ou serviços de internet;\n5. resposta apresentada à pessoa.\n\n## Permissões\n\nCâmera, microfone e localização são exemplos de recursos que podem exigir autorização do usuário.\n\n## Teste\n\nAbra `index.html`, execute a simulação e explique por que o aplicativo não deveria acessar todos os recursos do aparelho sem permissão.\n"
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
    "classroom": {
      "titulo": "MOB02 — Como funciona um dispositivo móvel",
      "descricao": "Nesta atividade, vamos estudar funcionamento de dispositivos e aplicativos móveis.\n\nCompreender a relação entre entrada, sistema operacional, aplicativo, dados, permissões, sensores e saída.\n\nAlteração obrigatória: Acrescente uma sexta camada chamada Rede, Nuvem ou Notificação e descreva em uma frase quando ela participa do fluxo.\n\nEntrega: anexar o link do repositório do GitHub."
    },
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
    "glossario": [
      {
        "id": "sistema-operacional",
        "termo": "sistema operacional",
        "categoria": "Plataforma",
        "traducao": "software base",
        "explicacao": "Gerencia hardware, aplicativos, permissões e serviços do aparelho.",
        "erroComum": "Confundir Android/iOS com um aplicativo comum.",
        "linguagem": "conceito",
        "exercicio": "MOB02",
        "ondeAparece": "Na segunda camada do fluxo em index.html.",
        "exemploPratico": "Android verifica se o app pode acessar localização.",
        "analogia": "É como o administrador do prédio: controla quem pode acessar cada recurso."
      },
      {
        "id": "permiss-o",
        "termo": "permissão",
        "categoria": "Segurança",
        "traducao": "autorização",
        "explicacao": "Controle dado ao usuário sobre acesso a câmera, localização e outros recursos.",
        "erroComum": "Solicitar acesso sem necessidade.",
        "linguagem": "conceito",
        "exercicio": "MOB02",
        "ondeAparece": "Na explicação da camada Sistema operacional.",
        "exemploPratico": "Usuário autoriza ou nega acesso à câmera.",
        "analogia": "É uma chave de acesso que o usuário decide entregar ou não."
      },
      {
        "id": "sensor",
        "termo": "sensor",
        "categoria": "Hardware",
        "traducao": "componente de medição",
        "explicacao": "Capta informações como movimento, orientação ou proximidade.",
        "erroComum": "Achar que todo dispositivo possui todos os sensores.",
        "linguagem": "conceito",
        "exercicio": "MOB02",
        "ondeAparece": "Na camada Entrada.",
        "exemploPratico": "Acelerômetro percebe movimento/orientação.",
        "analogia": "É um “sentido” do dispositivo para perceber algo do ambiente."
      },
      {
        "id": "hardware",
        "termo": "hardware",
        "categoria": "Dispositivo",
        "traducao": "parte física",
        "explicacao": "Componentes físicos do aparelho: processador, memória, tela, câmera, GPS e sensores.",
        "erroComum": "Confundir hardware com Android/iOS.",
        "linguagem": "conceito",
        "exercicio": "MOB02",
        "ondeAparece": "A lista de camadas cita câmera, microfone, GPS e sensores.",
        "exemploPratico": "Câmera registra imagem; GPS fornece localização.",
        "analogia": "É o corpo físico do aparelho."
      },
      {
        "id": "entrada",
        "termo": "entrada",
        "categoria": "Fluxo",
        "traducao": "dado recebido",
        "explicacao": "Ação ou dado que chega ao sistema por toque, sensor, câmera, teclado ou outro recurso.",
        "erroComum": "Pensar que entrada é apenas texto digitado.",
        "linguagem": "conceito",
        "exercicio": "MOB02",
        "ondeAparece": "Primeiro item da lista de camadas.",
        "exemploPratico": "Tocar no botão “usar localização”.",
        "analogia": "É a pergunta ou sinal que inicia o processamento."
      },
      {
        "id": "saida",
        "termo": "saída",
        "categoria": "Fluxo",
        "traducao": "resposta apresentada",
        "explicacao": "Resultado entregue ao usuário por tela, som, vibração ou notificação.",
        "erroComum": "Achar que saída é somente console.",
        "linguagem": "conceito",
        "exercicio": "MOB02",
        "ondeAparece": "Último item da lista de camadas.",
        "exemploPratico": "Mostrar a posição atual no mapa e vibrar ao concluir.",
        "analogia": "É a resposta que volta ao usuário."
      },
      {
        "id": "api",
        "termo": "API",
        "categoria": "Integração",
        "traducao": "ponte entre sistemas",
        "explicacao": "Interface que permite ao aplicativo solicitar dados ou ações de outro serviço.",
        "erroComum": "Confundir API com banco de dados.",
        "linguagem": "conceito",
        "exercicio": "MOB02",
        "ondeAparece": "Aparece em “dados e serviços”.",
        "exemploPratico": "Consultar previsão do tempo pela internet.",
        "analogia": "É como um balcão com pedidos definidos: você pede no formato esperado e recebe uma resposta."
      }
    ],
    "dicasProgressivas": {
      "html": [
        "Identifique a função deste arquivo.",
        "Procure as palavras entrada, sistema, aplicativo, dados e saída.",
        "Compare ids e seletores.",
        "Execute a simulação antes de validar."
      ],
      "css": [
        "Identifique a função deste arquivo.",
        "Procure as palavras entrada, sistema, aplicativo, dados e saída.",
        "Compare ids e seletores.",
        "Execute a simulação antes de validar."
      ],
      "js": [
        "Identifique a função deste arquivo.",
        "Procure as palavras entrada, sistema, aplicativo, dados e saída.",
        "Compare ids e seletores.",
        "Execute a simulação antes de validar."
      ],
      "readme": [
        "Identifique a função deste arquivo.",
        "Procure as palavras entrada, sistema, aplicativo, dados e saída.",
        "Compare ids e seletores.",
        "Execute a simulação antes de validar."
      ]
    },
    "comportamento": {
      "descricao": "Execute a ação principal e confira se a interface responde. Textos e detalhes visuais podem ser personalizados.",
      "criterios": [
        {
          "id": "simular",
          "tipo": "event",
          "evento": "click",
          "seletor": "#simularFluxo",
          "rotulo": "Executar a simulação"
        },
        {
          "id": "fluxo-alterado",
          "tipo": "textChangedFrom",
          "seletor": "#fluxoMobile",
          "valor": "A simulação ainda não foi executada.",
          "rotulo": "A sequência foi apresentada"
        }
      ]
    },
    "aulaVisual": {
      "titulo": "Mapa visual — do toque até a resposta do aplicativo",
      "pergunta": "O que acontece entre tocar na tela e receber uma resposta?",
      "ideiaCentral": "A ação atravessa camadas: entrada → sistema operacional/permissões → aplicativo → dados/serviços → saída.",
      "fluxo": [
        {
          "id": "entrada",
          "rotulo": "1. Entrada",
          "detalhe": "Toque, câmera, microfone, GPS ou sensor fornecem um dado."
        },
        {
          "id": "sistema",
          "rotulo": "2. Sistema operacional",
          "detalhe": "Android/iOS media o acesso ao hardware e verifica permissões."
        },
        {
          "id": "app",
          "rotulo": "3. Aplicativo",
          "detalhe": "O código interpreta a ação e decide o que precisa fazer."
        },
        {
          "id": "dados",
          "rotulo": "4. Dados/serviços",
          "detalhe": "O app pode consultar armazenamento local, API, internet ou nuvem."
        },
        {
          "id": "saida",
          "rotulo": "5. Saída",
          "detalhe": "Tela, som, vibração ou notificação apresentam a resposta."
        }
      ],
      "comparacao": [
        {
          "titulo": "Hardware",
          "texto": "Parte física: câmera, GPS, memória, tela, sensores."
        },
        {
          "titulo": "Sistema operacional",
          "texto": "Gerencia recursos, apps, segurança e permissões."
        },
        {
          "titulo": "Aplicativo",
          "texto": "Implementa as regras e a experiência que o usuário vê."
        }
      ],
      "observe": "A ação “Simular toque” apresenta a sequência percorrida entre entrada, sistema operacional, aplicativo, dados e saída.",
      "miniDesafio": "Pergunte: se a permissão de localização for negada, em qual etapa o fluxo precisa tratar o problema?"
    },
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 3,
    "studentReferenceStripped": true,
    "codigo": "MOB03",
    "disciplina": "Programação Mobile",
    "fase": 1,
    "faseNome": "Introdução ao Desenvolvimento Mobile",
    "fasePedagogica": 1,
    "titulo": "MOB03 - Tecnologias Mobile",
    "nomeCurto": "Tecnologias Mobile",
    "tema": "Tecnologias e abordagens de desenvolvimento mobile",
    "objetivo": "Comparar desenvolvimento nativo, Web/PWA e multiplataforma e perceber que a escolha depende dos requisitos do projeto.",
    "produto": "Guia interativo de cenários e abordagens mobile.",
    "contextoProfissional": "Análise inicial de trade-offs antes da escolha de uma stack.",
    "alteracaoObrigatoria": "Acrescente um quarto cenário de projeto e inclua no JavaScript uma recomendação justificada para esse cenário.",
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
    "pasta": "mobile-03",
    "repositorio": "atividades-mobile-sub",
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
      "readme": "# MOB03 - Tecnologias Mobile\n\nExistem diferentes formas de entregar uma experiência mobile. A escolha depende de **requisitos**, **equipe**, **plataformas**, **prazo** e **recursos do dispositivo**.\n\n## Nativo\n\nNormalmente usa ferramentas e linguagens ligadas diretamente ao sistema operacional, como Kotlin/Java no Android e Swift no iOS.\n\n## Web e PWA\n\nUsa HTML, CSS e JavaScript. Uma PWA pode acrescentar recursos como instalação e cache, dependendo do navegador e da plataforma.\n\n## Multiplataforma\n\nTecnologias como React Native e Flutter buscam compartilhar código entre Android e iOS.\n\n## Teste\n\nExecute os três cenários da página. Não existe uma tecnologia universalmente melhor: justifique a escolha com base no problema.\n"
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
    "classroom": {
      "titulo": "MOB03 — Tecnologias Mobile",
      "descricao": "Nesta atividade, vamos estudar tecnologias e abordagens de desenvolvimento mobile.\n\nComparar desenvolvimento nativo, Web/PWA e multiplataforma e perceber que a escolha depende dos requisitos do projeto.\n\nAlteração obrigatória: Acrescente um quarto cenário de projeto e inclua no JavaScript uma recomendação justificada para esse cenário.\n\nEntrega: anexar o link do repositório do GitHub."
    },
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
    "glossario": [
      {
        "id": "nativo",
        "termo": "nativo",
        "categoria": "Abordagem",
        "traducao": "específico da plataforma",
        "explicacao": "Aplicativo desenvolvido com tecnologias diretamente ligadas ao sistema operacional alvo.",
        "erroComum": "Achar que nativo significa automaticamente melhor em qualquer projeto.",
        "linguagem": "conceito",
        "exercicio": "MOB03",
        "ondeAparece": "Primeiro cartão e cenário Android.",
        "exemploPratico": "App interno feito somente para aparelhos Android da empresa.",
        "analogia": "É construir diretamente para uma plataforma específica."
      },
      {
        "id": "pwa",
        "termo": "PWA",
        "categoria": "Abordagem Web",
        "traducao": "Progressive Web App",
        "explicacao": "Aplicação Web que pode adicionar capacidades como instalação e cache conforme suporte.",
        "erroComum": "Tratar PWA como idêntica a app nativo.",
        "linguagem": "conceito",
        "exercicio": "MOB03",
        "ondeAparece": "Segundo cartão Web/PWA.",
        "exemploPratico": "Portal acessado por link que pode ser instalado conforme suporte.",
        "analogia": "É uma aplicação Web que ganha capacidades progressivamente."
      },
      {
        "id": "multiplataforma",
        "termo": "multiplataforma",
        "categoria": "Abordagem",
        "traducao": "várias plataformas",
        "explicacao": "Estratégia que busca compartilhar código entre Android, iOS ou outros alvos.",
        "erroComum": "Imaginar que 100% do código sempre será compartilhado.",
        "linguagem": "conceito",
        "exercicio": "MOB03",
        "ondeAparece": "Terceiro cartão e cenário Android+iOS.",
        "exemploPratico": "Equipe pequena compartilha grande parte do projeto entre duas plataformas.",
        "analogia": "É tentar usar uma base comum para chegar a mais de um destino."
      },
      {
        "id": "kotlin",
        "termo": "Kotlin",
        "categoria": "Linguagem",
        "traducao": "linguagem usada no ecossistema Android",
        "explicacao": "Linguagem moderna muito usada para desenvolvimento Android nativo.",
        "erroComum": "Achar que Kotlin é o próprio Android.",
        "linguagem": "conceito",
        "exercicio": "MOB03",
        "ondeAparece": "Exemplo citado no cartão Nativo.",
        "exemploPratico": "Aplicativo Android feito especificamente para os dispositivos da empresa.",
        "analogia": "É uma ferramenta de linguagem dentro de uma abordagem nativa."
      },
      {
        "id": "swift",
        "termo": "Swift",
        "categoria": "Linguagem",
        "traducao": "linguagem do ecossistema Apple",
        "explicacao": "Linguagem usada no desenvolvimento nativo para plataformas Apple.",
        "erroComum": "Confundir Swift com framework multiplataforma.",
        "linguagem": "conceito",
        "exercicio": "MOB03",
        "ondeAparece": "Exemplo citado no cartão Nativo.",
        "exemploPratico": "Aplicativo iOS integrado profundamente a recursos Apple.",
        "analogia": "Assim como Kotlin pode atender Android nativo, Swift atende o ecossistema Apple."
      },
      {
        "id": "react-native",
        "termo": "React Native",
        "categoria": "Framework",
        "traducao": "framework JavaScript multiplataforma",
        "explicacao": "Permite criar interfaces mobile usando JavaScript/TypeScript e componentes do ecossistema React Native.",
        "erroComum": "Entrar em React Native antes de entender fundamentos de Mobile.",
        "linguagem": "conceito",
        "exercicio": "MOB03",
        "ondeAparece": "É citado somente como exemplo de multiplataforma nesta fase.",
        "exemploPratico": "Um app Android+iOS mantido por uma equipe JavaScript.",
        "analogia": "É uma ponte de desenvolvimento multiplataforma, não a definição de “mobile”."
      },
      {
        "id": "flutter",
        "termo": "Flutter",
        "categoria": "Framework",
        "traducao": "framework multiplataforma",
        "explicacao": "Framework multiplataforma que usa Dart e seu próprio conjunto de widgets.",
        "erroComum": "Achar que Flutter e React Native são a mesma tecnologia.",
        "linguagem": "conceito",
        "exercicio": "MOB03",
        "ondeAparece": "É citado no cartão Multiplataforma.",
        "exemploPratico": "Aplicação única para Android e iOS construída com uma base compartilhada.",
        "analogia": "É outra estratégia para resolver o mesmo tipo de problema multiplataforma."
      },
      {
        "id": "framework",
        "termo": "framework",
        "categoria": "Arquitetura/Ferramenta",
        "traducao": "estrutura de desenvolvimento",
        "explicacao": "Conjunto organizado de bibliotecas, convenções e ferramentas que orienta a construção do software.",
        "erroComum": "Confundir framework com linguagem.",
        "linguagem": "conceito",
        "exercicio": "MOB03",
        "ondeAparece": "React Native e Flutter são apresentados como exemplos.",
        "exemploPratico": "React Native usa JavaScript/TypeScript; a linguagem e o framework não são a mesma coisa.",
        "analogia": "É como uma estrutura pronta de construção: define encaixes e formas de trabalhar."
      }
    ],
    "dicasProgressivas": {
      "html": [
        "Comece diferenciando abordagem de ferramenta.",
        "Confira os values do select e as chaves do objeto respostas.",
        "Teste todos os cenários.",
        "Justifique a escolha, não apenas o nome da tecnologia."
      ],
      "css": [
        "Comece diferenciando abordagem de ferramenta.",
        "Confira os values do select e as chaves do objeto respostas.",
        "Teste todos os cenários.",
        "Justifique a escolha, não apenas o nome da tecnologia."
      ],
      "js": [
        "Comece diferenciando abordagem de ferramenta.",
        "Confira os values do select e as chaves do objeto respostas.",
        "Teste todos os cenários.",
        "Justifique a escolha, não apenas o nome da tecnologia."
      ],
      "readme": [
        "Comece diferenciando abordagem de ferramenta.",
        "Confira os values do select e as chaves do objeto respostas.",
        "Teste todos os cenários.",
        "Justifique a escolha, não apenas o nome da tecnologia."
      ]
    },
    "comportamento": {
      "descricao": "Selecione um cenário, clique em Analisar e confira se a recomendação muda. Textos e detalhes podem ser personalizados.",
      "criterios": [
        {
          "id": "analisar",
          "tipo": "event",
          "evento": "click",
          "seletor": "#analisarTecnologia",
          "rotulo": "Selecionar um cenário e usar o botão Analisar"
        },
        {
          "id": "recomendacao-alterada",
          "tipo": "textChangedFrom",
          "seletor": "#recomendacaoTecnologia",
          "valor": "Selecione um cenário e analise.",
          "rotulo": "A recomendação foi atualizada"
        }
      ]
    },
    "aulaVisual": {
      "titulo": "Mapa de decisão — escolher tecnologia pelo problema",
      "pergunta": "Existe uma tecnologia mobile que é sempre a melhor?",
      "ideiaCentral": "Não. A escolha depende de plataforma, equipe, distribuição, recursos do aparelho, prazo e manutenção.",
      "fluxo": [
        {
          "id": "problema",
          "rotulo": "1. Entenda o problema",
          "detalhe": "Quem usa? Em quais aparelhos? Precisa instalar? Precisa de hardware específico?"
        },
        {
          "id": "web",
          "rotulo": "2. Web / PWA",
          "detalhe": "Boa quando acesso por link, alcance e tecnologias Web são importantes."
        },
        {
          "id": "nativo",
          "rotulo": "3. Nativo",
          "detalhe": "Boa quando há foco em uma plataforma e integração profunda com o sistema."
        },
        {
          "id": "multi",
          "rotulo": "4. Multiplataforma",
          "detalhe": "Busca compartilhar código entre Android/iOS com frameworks como React Native ou Flutter."
        },
        {
          "id": "decisao",
          "rotulo": "5. Justifique",
          "detalhe": "A recomendação precisa explicar o motivo, não apenas citar uma ferramenta."
        }
      ],
      "comparacao": [
        {
          "titulo": "Nativo",
          "texto": "Kotlin/Java no Android e Swift no iOS são exemplos de tecnologias ligadas à plataforma."
        },
        {
          "titulo": "Web / PWA",
          "texto": "HTML, CSS e JavaScript executados pelo navegador com recursos progressivos."
        },
        {
          "titulo": "Multiplataforma",
          "texto": "Um projeto compartilha grande parte da lógica entre plataformas."
        }
      ],
      "observe": "Os três cenários do seletor produzem respostas diferentes porque cada requisito favorece uma abordagem tecnológica.",
      "miniDesafio": "Troque um cenário e peça para a turma defender uma tecnologia diferente com argumentos técnicos."
    },
    "referenciaCompletaPadrao": false
  },
  {
    "numero": 4,
    "studentReferenceStripped": true,
    "codigo": "MOB04",
    "disciplina": "Programação Mobile",
    "fase": 1,
    "faseNome": "Introdução ao Desenvolvimento Mobile",
    "fasePedagogica": 1,
    "titulo": "MOB04 - Ecossistema de Desenvolvimento Mobile",
    "nomeCurto": "Ecossistema e ferramentas",
    "tema": "Ferramentas e fluxo de desenvolvimento mobile",
    "objetivo": "Reconhecer o papel de editor/IDE, SDK, framework, emulador, dispositivo real, Git/GitHub, build e distribuição dentro do processo de desenvolvimento.",
    "produto": "Mapa interativo do ecossistema e do fluxo de desenvolvimento mobile.",
    "contextoProfissional": "Preparação conceitual para as ferramentas que serão usadas nas próximas fases.",
    "alteracaoObrigatoria": "Adicione um quinto cartão de ferramenta relacionado a testes, depuração, design ou distribuição e indique em qual etapa do fluxo ele seria usado.",
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
    "pasta": "mobile-04",
    "repositorio": "atividades-mobile-sub",
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
      "readme": "# MOB04 - Ecossistema de Desenvolvimento Mobile\n\nDesenvolver para dispositivos móveis envolve mais do que uma linguagem. Existe um **ecossistema de ferramentas**.\n\n## Ferramentas que aparecerão na disciplina\n\n- **VS Code:** edição de código;\n- **Git e GitHub:** versionamento e entrega;\n- **Navegador/PWA:** testes de experiências Web Mobile;\n- **React Native e Expo:** desenvolvimento multiplataforma em uma fase posterior;\n- **Android Studio:** SDK, emulador e aprofundamento Android;\n- **Aparelho real:** teste de toque, câmera, localização e comportamento real.\n\n## Fluxo de trabalho\n\nPlanejar → programar → executar → testar → corrigir → versionar → gerar uma versão de distribuição.\n\n## Importante\n\nNas próximas fases, antes de React Native, estudaremos responsividade, Mobile First, zona do polegar, Flexbox, CSS Grid e JavaScript aplicado a interfaces móveis.\n"
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
    "classroom": {
      "titulo": "MOB04 — Ecossistema e ferramentas",
      "descricao": "Nesta atividade, vamos estudar ferramentas e fluxo de desenvolvimento mobile.\n\nReconhecer o papel de editor/IDE, SDK, framework, emulador, dispositivo real, Git/GitHub, build e distribuição dentro do processo de desenvolvimento.\n\nAlteração obrigatória: Adicione um quinto cartão de ferramenta relacionado a testes, depuração, design ou distribuição e indique em qual etapa do fluxo ele seria usado.\n\nEntrega: anexar o link do repositório do GitHub."
    },
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
    "glossario": [
      {
        "id": "ide",
        "termo": "IDE",
        "categoria": "Ferramenta",
        "traducao": "Integrated Development Environment",
        "explicacao": "Ambiente que reúne edição, execução e depuração de software.",
        "erroComum": "Achar que toda IDE serve igualmente para todas as plataformas.",
        "linguagem": "conceito",
        "exercicio": "MOB04",
        "ondeAparece": "Cartão Editor / IDE.",
        "exemploPratico": "Android Studio reúne editor, execução, emulador e depuração.",
        "analogia": "É uma oficina de desenvolvimento com várias ferramentas no mesmo lugar."
      },
      {
        "id": "sdk",
        "termo": "SDK",
        "categoria": "Ferramenta",
        "traducao": "Software Development Kit",
        "explicacao": "Conjunto de ferramentas e APIs para desenvolver para uma plataforma.",
        "erroComum": "Confundir SDK com linguagem de programação.",
        "linguagem": "conceito",
        "exercicio": "MOB04",
        "ondeAparece": "Cartão SDK e framework.",
        "exemploPratico": "SDK Android disponibiliza ferramentas/APIs para criar apps Android.",
        "analogia": "É uma caixa de ferramentas oficial para construir para uma plataforma."
      },
      {
        "id": "emulador",
        "termo": "emulador",
        "categoria": "Teste",
        "traducao": "simulação de dispositivo",
        "explicacao": "Executa uma representação de um aparelho para testes no computador.",
        "erroComum": "Substituir todos os testes em aparelho real pelo emulador.",
        "linguagem": "conceito",
        "exercicio": "MOB04",
        "ondeAparece": "Cartão Teste.",
        "exemploPratico": "Simular um aparelho Android no computador.",
        "analogia": "É um aparelho virtual útil para testar, mas não substitui totalmente o físico."
      },
      {
        "id": "versionamento",
        "termo": "versionamento",
        "categoria": "Processo",
        "traducao": "controle de versões",
        "explicacao": "Registra mudanças do projeto ao longo do tempo, normalmente com Git.",
        "erroComum": "Usar Git apenas no momento final da entrega.",
        "linguagem": "conceito",
        "exercicio": "MOB04",
        "ondeAparece": "Cartão Versionamento.",
        "exemploPratico": "Commitar uma mudança funcional antes de começar a próxima.",
        "analogia": "É um histórico com pontos de retorno do projeto."
      },
      {
        "id": "git",
        "termo": "Git",
        "categoria": "Versionamento",
        "traducao": "controle de versões",
        "explicacao": "Sistema que registra mudanças do projeto e permite comparar, recuperar e organizar versões.",
        "erroComum": "Usar Git apenas para “mandar para o GitHub”.",
        "linguagem": "conceito",
        "exercicio": "MOB04",
        "ondeAparece": "O cartão Versionamento cita Git e GitHub.",
        "exemploPratico": "Criar commits após cada etapa funcional.",
        "analogia": "É um histórico detalhado e reversível do projeto."
      },
      {
        "id": "github",
        "termo": "GitHub",
        "categoria": "Colaboração",
        "traducao": "hospedagem de repositórios Git",
        "explicacao": "Serviço que hospeda repositórios e facilita colaboração, revisão e entrega.",
        "erroComum": "Confundir Git com GitHub.",
        "linguagem": "conceito",
        "exercicio": "MOB04",
        "ondeAparece": "Aparece junto ao Git no cartão Versionamento.",
        "exemploPratico": "Publicar o repositório da atividade.",
        "analogia": "Git é o sistema de versionamento; GitHub é um serviço que recebe repositórios Git."
      },
      {
        "id": "build",
        "termo": "build",
        "categoria": "Distribuição",
        "traducao": "construção de uma versão executável",
        "explicacao": "Processo que prepara/empacota o projeto para execução, teste ou distribuição.",
        "erroComum": "Achar que salvar o arquivo já gera automaticamente uma versão instalável.",
        "linguagem": "conceito",
        "exercicio": "MOB04",
        "ondeAparece": "Última etapa do fluxo de desenvolvimento.",
        "exemploPratico": "Gerar uma versão Android para instalação.",
        "analogia": "É como transformar os arquivos de trabalho em um produto preparado para entrega."
      },
      {
        "id": "debug",
        "termo": "depuração",
        "categoria": "Teste",
        "traducao": "investigação de erros",
        "explicacao": "Processo de observar estado, mensagens e execução para localizar e corrigir problemas.",
        "erroComum": "Tentar corrigir sem reproduzir nem entender o erro.",
        "linguagem": "conceito",
        "exercicio": "MOB04",
        "ondeAparece": "Editor/IDE e ferramentas de teste ajudam na depuração.",
        "exemploPratico": "Ler erro, localizar linha e testar correção.",
        "analogia": "É investigar uma falha com evidências, não adivinhar."
      },
      {
        "id": "dispositivo-real",
        "termo": "dispositivo real",
        "categoria": "Teste",
        "traducao": "aparelho físico",
        "explicacao": "Celular ou tablet físico usado para testar comportamento que pode diferir do emulador.",
        "erroComum": "Confiar somente no emulador.",
        "linguagem": "conceito",
        "exercicio": "MOB04",
        "ondeAparece": "O fluxo de teste cita aparelho real.",
        "exemploPratico": "Testar câmera, desempenho, toque e permissões no celular.",
        "analogia": "É o ambiente onde o usuário de fato vai executar o produto."
      }
    ],
    "dicasProgressivas": {
      "html": [
        "Associe cada ferramenta a uma função.",
        "Confira o atributo hidden da lista.",
        "Teste mostrar e ocultar duas vezes.",
        "Lembre que React Native aparece apenas em fase posterior."
      ],
      "css": [
        "Associe cada ferramenta a uma função.",
        "Confira o atributo hidden da lista.",
        "Teste mostrar e ocultar duas vezes.",
        "Lembre que React Native aparece apenas em fase posterior."
      ],
      "js": [
        "Associe cada ferramenta a uma função.",
        "Confira o atributo hidden da lista.",
        "Teste mostrar e ocultar duas vezes.",
        "Lembre que React Native aparece apenas em fase posterior."
      ],
      "readme": [
        "Associe cada ferramenta a uma função.",
        "Confira o atributo hidden da lista.",
        "Teste mostrar e ocultar duas vezes.",
        "Lembre que React Native aparece apenas em fase posterior."
      ]
    },
    "comportamento": {
      "descricao": "Execute a ação principal e confira se a interface responde. Textos e detalhes visuais podem ser personalizados.",
      "criterios": [
        {
          "id": "mostrar",
          "tipo": "event",
          "evento": "click",
          "seletor": "#mostrarFluxoDesenvolvimento",
          "rotulo": "Usar o botão de fluxo"
        },
        {
          "id": "lista-visivel",
          "tipo": "notHidden",
          "seletor": "#fluxoDesenvolvimento",
          "rotulo": "A lista de etapas ficou visível"
        }
      ]
    },
    "aulaVisual": {
      "titulo": "Mapa do ecossistema — da ideia até a distribuição",
      "pergunta": "Programar um app significa usar apenas um editor de código?",
      "ideiaCentral": "Não. Desenvolvimento mobile envolve ferramentas diferentes em um fluxo: escrever, executar, testar, versionar, construir e distribuir.",
      "fluxo": [
        {
          "id": "planejar",
          "rotulo": "1. Planejar",
          "detalhe": "Definir problema, telas, dados, recursos e requisitos."
        },
        {
          "id": "editar",
          "rotulo": "2. Editar",
          "detalhe": "VS Code ou uma IDE ajuda a escrever e organizar o código."
        },
        {
          "id": "sdk",
          "rotulo": "3. SDK / framework",
          "detalhe": "Fornece APIs, bibliotecas e comandos para a plataforma."
        },
        {
          "id": "testar",
          "rotulo": "4. Testar",
          "detalhe": "Navegador, emulador e aparelho real revelam comportamentos diferentes."
        },
        {
          "id": "versionar",
          "rotulo": "5. Versionar",
          "detalhe": "Git registra alterações; GitHub ajuda colaboração e entrega."
        },
        {
          "id": "build",
          "rotulo": "6. Build/distribuição",
          "detalhe": "O projeto é transformado em uma versão pronta para instalar ou publicar."
        }
      ],
      "comparacao": [
        {
          "titulo": "Editor/IDE",
          "texto": "Lugar onde você escreve, navega e depura o projeto."
        },
        {
          "titulo": "SDK/framework",
          "texto": "Conjunto de ferramentas e APIs usadas para desenvolver."
        },
        {
          "titulo": "Emulador/aparelho real",
          "texto": "Ambientes de teste; um não substitui completamente o outro."
        }
      ],
      "observe": "A ação “Mostrar fluxo” apresenta as etapas do processo e a relação entre editor, SDK/framework, teste, versionamento e distribuição.",
      "miniDesafio": "Pergunte em qual etapa entrariam Git, Android Studio, Expo e um celular conectado por USB."
    },
    "referenciaCompletaPadrao": false
  }
];

window.APP_CONFIG = {
  "name": "Plataforma 2DS Sub - Programação Mobile - Aluno",
  "shortName": "Programação Mobile",
  "slug": "mobile",
  "storagePrefix": "ds2sub_mobile",
  "version": "0.1.42",
  "releasedAt": "2026-08-12T22:11:00-03:00",
  "versionManifest": "version.json",
  "classroomUrl": "https://classroom.google.com/",
  "githubDefault": "https://github.com/",
  "repositorio": "atividades-mobile-sub",
  "minimumActiveSeconds": 300
};

window.ACTIVE_DISCIPLINE = "frontend";
