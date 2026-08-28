export type RecoveryQuestion={subject:string;key:string;topic:string;prompt:string;type:string;points:number;options:Array<{id:string;label:string}>;correct:any;hint:string;explanation:string;visual?:any};
export const RECOVERY_QUESTIONS:RecoveryQuestion[] = [
  {
    "subject": "frontend_sub",
    "key": "fe01",
    "topic": "Fundamentos",
    "prompt": "Um sistema recebe o nome digitado pelo usuário, processa esse valor e mostra uma saudação. Qual descrição representa melhor o papel da programação?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "Organizar instruções que determinam como dados são recebidos, processados e apresentados."
      },
      {
        "id": "b",
        "label": "Definir propriedades visuais que controlam cores, tamanhos e espaçamentos da interface."
      },
      {
        "id": "c",
        "label": "Organizar arquivos do computador em pastas para que todos sejam executados automaticamente."
      },
      {
        "id": "d",
        "label": "Converter páginas existentes em programas completos sem definir regras para dados e ações."
      }
    ],
    "correct": "a",
    "hint": "Pense na sequência entrada → processamento → saída.",
    "explanation": "Programar significa definir instruções e regras para transformar entradas em resultados.",
    "visual": null
  },
  {
    "subject": "frontend_sub",
    "key": "fe02",
    "topic": "Ferramentas",
    "prompt": "Durante a criação de um site, um estudante precisa editar index.html, estilo.css e script.js. Qual é a principal função do Visual Studio Code nesse trabalho?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "Hospedar publicamente o projeto para acesso pela internet."
      },
      {
        "id": "b",
        "label": "Registrar automaticamente commits e enviar alterações ao GitHub."
      },
      {
        "id": "c",
        "label": "Editar e organizar os arquivos de código do projeto."
      },
      {
        "id": "d",
        "label": "Substituir o navegador na renderização final do site."
      }
    ],
    "correct": "c",
    "hint": "Separe editor, versionador e hospedagem.",
    "explanation": "VS Code é o editor/ambiente de trabalho do código.",
    "visual": null
  },
  {
    "subject": "frontend_sub",
    "key": "fe03",
    "topic": "Arquivos",
    "prompt": "Relacione cada arquivo à função mais adequada.",
    "type": "match",
    "points": 0.25,
    "options": [
      {
        "id": "index_html",
        "label": "index.html"
      },
      {
        "id": "estilo_css",
        "label": "estilo.css"
      },
      {
        "id": "script_js",
        "label": "script.js"
      },
      {
        "id": "readme_md",
        "label": "README.md"
      }
    ],
    "correct": {
      "index_html": "estrutura_da_pagina",
      "estilo_css": "aparencia_e_layout",
      "script_js": "comportamento_interacao",
      "readme_md": "documentacao_do_projeto"
    },
    "hint": "Estrutura, aparência, comportamento e documentação são responsabilidades diferentes.",
    "explanation": "HTML estrutura; CSS apresenta; JS interage; README documenta.",
    "visual": {
      "targets": [
        {
          "id": "estrutura_da_pagina",
          "label": "Estrutura da página"
        },
        {
          "id": "aparencia_e_layout",
          "label": "Aparência e layout"
        },
        {
          "id": "comportamento_interacao",
          "label": "Comportamento/interação"
        },
        {
          "id": "documentacao_do_projeto",
          "label": "Documentação do projeto"
        }
      ]
    }
  },
  {
    "subject": "frontend_sub",
    "key": "fe04",
    "topic": "HTML semântico",
    "prompt": "Qual elemento representa de forma mais adequada o conteúdo principal exclusivo de uma página?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "O elemento <footer>, destinado ao rodapé da página."
      },
      {
        "id": "b",
        "label": "O elemento <main>, destinado ao conteúdo principal da página."
      },
      {
        "id": "c",
        "label": "O elemento <nav>, destinado aos principais links de navegação."
      },
      {
        "id": "d",
        "label": "O elemento <aside>, destinado a conteúdo complementar ao principal."
      }
    ],
    "correct": "b",
    "hint": "Considere o significado do conteúdo, não sua posição visual.",
    "explanation": "<main> identifica o conteúdo principal da página.",
    "visual": null
  },
  {
    "subject": "frontend_sub",
    "key": "fe05",
    "topic": "HTML semântico",
    "prompt": "Uma área contém os principais links de navegação entre seções do site. Qual elemento semântico descreve melhor esse conjunto?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "O elemento <article>, usado para um conteúdo independente ou autocontido."
      },
      {
        "id": "b",
        "label": "O elemento <header>, usado para conteúdo introdutório de uma página ou seção."
      },
      {
        "id": "c",
        "label": "O elemento <section>, usado para agrupar conteúdo tematicamente relacionado."
      },
      {
        "id": "d",
        "label": "O elemento <nav>, usado para agrupar os principais links de navegação."
      }
    ],
    "correct": "d",
    "hint": "Procure o elemento cujo nome representa navegação.",
    "explanation": "<nav> representa uma região de navegação.",
    "visual": null
  },
  {
    "subject": "frontend_sub",
    "key": "fe06",
    "topic": "Formulários",
    "prompt": "Analise: <label for=\"nome\">Nome</label> e <input id=\"nome\" type=\"text\">. Qual é a principal vantagem dessa associação?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "Transformar o campo de texto em um botão de confirmação associado ao mesmo rótulo."
      },
      {
        "id": "b",
        "label": "Relacionar o rótulo ao campo correspondente, favorecendo compreensão e acessibilidade."
      },
      {
        "id": "c",
        "label": "Enviar o formulário assim que a pessoa termina de preencher o campo identificado."
      },
      {
        "id": "d",
        "label": "Aplicar automaticamente ao campo uma regra CSS específica baseada apenas no rótulo."
      }
    ],
    "correct": "b",
    "hint": "Pense em identificação de campo e tecnologias assistivas.",
    "explanation": "for e id associam semanticamente o rótulo ao controle.",
    "visual": null
  },
  {
    "subject": "frontend_sub",
    "key": "fe07",
    "topic": "CSS",
    "prompt": "Qual é a principal função do CSS em uma página Web?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "Armazenar dados digitados pelo usuário e manter essas informações após fechar a página."
      },
      {
        "id": "b",
        "label": "Definir a estrutura semântica e a hierarquia de conteúdo que compõem o documento HTML."
      },
      {
        "id": "c",
        "label": "Controlar apresentação, espaçamento e organização visual dos elementos."
      },
      {
        "id": "d",
        "label": "Publicar os arquivos do projeto em um repositório remoto sempre que uma regra é alterada."
      }
    ],
    "correct": "c",
    "hint": "HTML estrutura; CSS apresenta; JS interage.",
    "explanation": "CSS define estilos e layout.",
    "visual": null
  },
  {
    "subject": "frontend_sub",
    "key": "fe08",
    "topic": "Box Model",
    "prompt": "Ordene as camadas do Box Model do centro para fora.",
    "type": "order",
    "points": 0.25,
    "options": [
      {
        "id": "conteudo",
        "label": "Conteúdo"
      },
      {
        "id": "padding",
        "label": "Padding"
      },
      {
        "id": "border",
        "label": "Border"
      },
      {
        "id": "margin",
        "label": "Margin"
      }
    ],
    "correct": [
      "conteudo",
      "padding",
      "border",
      "margin"
    ],
    "hint": "Comece pelo que o elemento contém e termine pelo espaço externo.",
    "explanation": "Conteúdo → padding → border → margin.",
    "visual": null
  },
  {
    "subject": "frontend_sub",
    "key": "fe09",
    "topic": "Box Model",
    "prompt": "Um cartão precisa aumentar a distância entre seu texto e a própria borda. Qual propriedade é mais adequada?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "margin, porque controla o espaço externo entre o cartão e elementos vizinhos."
      },
      {
        "id": "b",
        "label": "border-width, porque aumenta a espessura da borda ao redor do cartão."
      },
      {
        "id": "c",
        "label": "gap, porque controla a distância entre itens dentro de layouts Flexbox ou Grid."
      },
      {
        "id": "d",
        "label": "padding, porque controla o espaço interno entre o conteúdo e a borda do cartão."
      }
    ],
    "correct": "d",
    "hint": "Espaço interno e espaço externo não são a mesma coisa.",
    "explanation": "padding cria espaço interno entre conteúdo e borda.",
    "visual": null
  },
  {
    "subject": "frontend_sub",
    "key": "fe10",
    "topic": "CSS",
    "prompt": "Considere :root { --cor-principal: #224488; }. Qual vantagem existe em usar essa variável CSS?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "Reutilizar o mesmo valor visual em regras diferentes e manter consistência."
      },
      {
        "id": "b",
        "label": "Criar elementos HTML reutilizáveis que recebem automaticamente o valor declarado na variável."
      },
      {
        "id": "c",
        "label": "Executar uma função JavaScript sempre que o valor visual armazenado na variável for alterado."
      },
      {
        "id": "d",
        "label": "Definir a resolução do dispositivo e adaptar automaticamente o navegador a esse tamanho."
      }
    ],
    "correct": "a",
    "hint": "Pense em reutilização e manutenção.",
    "explanation": "Custom properties centralizam valores reutilizáveis.",
    "visual": null
  },
  {
    "subject": "frontend_sub",
    "key": "fe11",
    "topic": "Flexbox",
    "prompt": "Uma barra de ações precisa manter quatro botões na mesma linha e distribuir o espaço entre eles. Qual regra de layout atende melhor esse objetivo?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "Usar Grid com duas linhas fixas, mesmo que a barra tenha apenas um eixo principal."
      },
      {
        "id": "b",
        "label": "Usar Flexbox e distribuir os botões ao longo do eixo principal da barra."
      },
      {
        "id": "c",
        "label": "Usar posicionamento absoluto e definir manualmente uma coordenada para cada botão."
      },
      {
        "id": "d",
        "label": "Usar margens individuais em cada botão para tentar simular a distribuição do espaço."
      }
    ],
    "correct": "b",
    "hint": "Procure o recurso pensado para organizar itens ao longo de um eixo.",
    "explanation": "Flexbox é adequado para distribuir e alinhar itens em um eixo principal.",
    "visual": null
  },
  {
    "subject": "frontend_sub",
    "key": "fe12",
    "topic": "Grid",
    "prompt": "Um dashboard precisa distribuir cartões em duas colunas e várias linhas, mantendo alinhamento entre linhas e colunas. Qual recurso é mais adequado?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "Usar Flexbox sem quebra de linha, mantendo todos os cartões em um único eixo."
      },
      {
        "id": "b",
        "label": "Usar margens manuais para tentar alinhar cada cartão de forma independente."
      },
      {
        "id": "c",
        "label": "Usar Grid para definir colunas e permitir que os cartões ocupem linhas sucessivas."
      },
      {
        "id": "d",
        "label": "Usar posicionamento absoluto para informar coordenadas diferentes a cada cartão."
      }
    ],
    "correct": "c",
    "hint": "Observe que o problema exige controle bidimensional.",
    "explanation": "CSS Grid é apropriado quando o layout precisa controlar linhas e colunas.",
    "visual": null
  },
  {
    "subject": "frontend_sub",
    "key": "fe13",
    "topic": "Responsividade",
    "prompt": "Uma página usa três colunas em telas largas. Em telas estreitas, passa para uma coluna e aumenta a largura dos botões. Qual decisão descreve melhor o que aconteceu?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "O layout permaneceu fixo e o navegador apenas reduziu visualmente toda a página."
      },
      {
        "id": "b",
        "label": "A interface adaptou sua organização ao espaço disponível por meio de responsividade."
      },
      {
        "id": "c",
        "label": "A página passou a depender de rolagem horizontal para preservar as três colunas."
      },
      {
        "id": "d",
        "label": "Os elementos mantiveram dimensões rígidas e apenas o nível de zoom foi modificado."
      }
    ],
    "correct": "b",
    "hint": "Considere a adaptação do layout ao espaço disponível.",
    "explanation": "Responsividade reorganiza a interface conforme as condições da tela.",
    "visual": null
  },
  {
    "subject": "frontend_sub",
    "key": "fe14",
    "topic": "Media Query",
    "prompt": "Analise: @media (max-width: 600px) { .cards { grid-template-columns: 1fr; } }. Quando essa regra entra em ação?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "Quando a largura disponível da viewport atende à condição definida pela media query."
      },
      {
        "id": "b",
        "label": "Quando uma interação de clique satisfaz a condição indicada dentro do seletor CSS."
      },
      {
        "id": "c",
        "label": "Quando uma alteração local é registrada e enviada para o repositório remoto do projeto."
      },
      {
        "id": "d",
        "label": "Quando uma variável JavaScript recebe um valor que corresponde ao limite configurado."
      }
    ],
    "correct": "a",
    "hint": "@media testa uma condição de mídia, como largura.",
    "explanation": "A regra é aplicada quando a viewport satisfaz max-width: 600px.",
    "visual": null
  },
  {
    "subject": "frontend_sub",
    "key": "fe15",
    "topic": "Git/GitHub",
    "prompt": "Depois de editar arquivos no VS Code, um estudante quer registrar uma versão e enviá-la para um repositório remoto. Qual relação entre as ferramentas está correta?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "VS Code registra o histórico; GitHub cria commits locais; Git apenas publica a página."
      },
      {
        "id": "b",
        "label": "Git registra versões localmente; GitHub hospeda o repositório remoto; VS Code edita os arquivos."
      },
      {
        "id": "c",
        "label": "GitHub substitui o editor; VS Code substitui o Git; Git organiza somente arquivos HTML."
      },
      {
        "id": "d",
        "label": "Git edita o código; VS Code hospeda o repositório; GitHub aplica automaticamente estilos CSS."
      }
    ],
    "correct": "b",
    "hint": "Separe editor, controle de versão e hospedagem remota.",
    "explanation": "VS Code é o editor; Git controla versões; GitHub hospeda o repositório remoto.",
    "visual": null
  },
  {
    "subject": "frontend_sub",
    "key": "fe16",
    "topic": "Git/GitHub",
    "prompt": "Ordene um fluxo coerente depois de alterar um arquivo local.",
    "type": "order",
    "points": 0.25,
    "options": [
      {
        "id": "alterar_e_salvar_o_arquivo",
        "label": "Alterar e salvar o arquivo"
      },
      {
        "id": "selecionar_alteracoes_para_o_commit",
        "label": "Selecionar alterações para o commit"
      },
      {
        "id": "criar_o_commit",
        "label": "Criar o commit"
      },
      {
        "id": "enviar_com_push",
        "label": "Enviar com push"
      }
    ],
    "correct": [
      "alterar_e_salvar_o_arquivo",
      "selecionar_alteracoes_para_o_commit",
      "criar_o_commit",
      "enviar_com_push"
    ],
    "hint": "Primeiro mude o arquivo; push acontece depois do commit.",
    "explanation": "Fluxo simplificado: editar/salvar → stage → commit → push.",
    "visual": null
  },
  {
    "subject": "frontend_sub",
    "key": "fe17",
    "topic": "JavaScript",
    "prompt": "Considere: let quantidade = 5; depois quantidade = 8;. Qual interpretação está correta?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "A segunda linha cria outra variável quantidade, preservando a primeira com valor 5."
      },
      {
        "id": "b",
        "label": "A segunda linha gera erro, pois let impede qualquer nova atribuição após a declaração."
      },
      {
        "id": "c",
        "label": "A mesma variável passa de 5 para 8, pois let permite uma nova atribuição de valor."
      },
      {
        "id": "d",
        "label": "A variável continua valendo 5, porque a segunda linha altera apenas sua apresentação."
      }
    ],
    "correct": "c",
    "hint": "Observe se let permite ou impede reatribuição.",
    "explanation": "Uma variável declarada com let pode receber outro valor posteriormente.",
    "visual": null
  },
  {
    "subject": "frontend_sub",
    "key": "fe18",
    "topic": "JavaScript",
    "prompt": "Considere: const escola = \"AGV\";. O uso de const indica que:",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "O identificador escola não pode receber uma nova atribuição depois de ser declarado."
      },
      {
        "id": "b",
        "label": "O identificador escola só pode armazenar texto e não admite outros tipos de valor."
      },
      {
        "id": "c",
        "label": "O valor de escola é automaticamente transformado em conteúdo HTML pelo navegador."
      },
      {
        "id": "d",
        "label": "O valor de escola é automaticamente mantido em um repositório Git após a execução."
      }
    ],
    "correct": "a",
    "hint": "Const está relacionado a reatribuição, não ao tipo do dado.",
    "explanation": "const impede reatribuir o identificador a outro valor; isso não significa que todo conteúdo interno de objetos seja imutável.",
    "visual": null
  },
  {
    "subject": "frontend_sub",
    "key": "fe19",
    "topic": "Responsividade",
    "prompt": "Compare dois layouts no celular: A mantém três cartões minúsculos lado a lado; B reorganiza os cartões em uma coluna legível. Qual decisão demonstra melhor adaptação?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "Layout A, porque mantém exatamente o desenho do desktop."
      },
      {
        "id": "b",
        "label": "Layout B, porque reorganiza o conteúdo para o espaço disponível."
      },
      {
        "id": "c",
        "label": "Ambos, porque responsividade depende somente da cor de fundo."
      },
      {
        "id": "d",
        "label": "Nenhum, porque sites responsivos não podem mudar o número de colunas."
      }
    ],
    "correct": "b",
    "hint": "Responsividade preserva usabilidade, não necessariamente o mesmo arranjo.",
    "explanation": "Reorganizar colunas mantém legibilidade e interação em telas menores.",
    "visual": {
      "kind": "responsive_compare"
    }
  },
  {
    "subject": "frontend_sub",
    "key": "fe20",
    "topic": "Integração",
    "prompt": "Um botão já existe no HTML, possui aparência definida no CSS e precisa trocar uma mensagem quando for clicado. Qual divisão de responsabilidades é mais adequada?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "HTML trata o clique; CSS registra a mensagem; JavaScript define apenas a estrutura semântica."
      },
      {
        "id": "b",
        "label": "HTML cria os elementos; CSS define a aparência; JavaScript trata o evento e atualiza a mensagem."
      },
      {
        "id": "c",
        "label": "HTML registra versões; CSS executa o clique; JavaScript hospeda os arquivos do projeto."
      },
      {
        "id": "d",
        "label": "HTML define somente cores; CSS recebe os dados; JavaScript substitui toda a estrutura da página."
      }
    ],
    "correct": "b",
    "hint": "Separe estrutura, apresentação e comportamento.",
    "explanation": "HTML estrutura, CSS apresenta e JavaScript implementa a interação.",
    "visual": null
  },
  {
    "subject": "mobile_sub",
    "key": "mo01",
    "topic": "Android/Kotlin",
    "prompt": "Qual é a função principal do Kotlin nas atividades Android desenvolvidas?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "Publicar e distribuir automaticamente o aplicativo em lojas e dispositivos compatíveis."
      },
      {
        "id": "b",
        "label": "Definir a lógica, as regras e os comportamentos executados pelo aplicativo durante a interação."
      },
      {
        "id": "c",
        "label": "Modificar componentes físicos do aparelho para adequá-los às necessidades da aplicação."
      },
      {
        "id": "d",
        "label": "Definir somente imagens, cores e tamanhos utilizados na apresentação visual do aplicativo."
      }
    ],
    "correct": "b",
    "hint": "Pense no código da MainActivity.",
    "explanation": "Kotlin implementa a lógica do aplicativo.",
    "visual": null
  },
  {
    "subject": "mobile_sub",
    "key": "mo02",
    "topic": "Componentes",
    "prompt": "Relacione cada componente Android à função que ele exerce em uma interface simples.",
    "type": "match",
    "points": 0.25,
    "options": [
      {
        "id": "textview",
        "label": "TextView"
      },
      {
        "id": "edittext",
        "label": "EditText"
      },
      {
        "id": "button",
        "label": "Button"
      }
    ],
    "correct": {
      "textview": "exibir_texto_ou_resposta",
      "edittext": "receber_texto_digitado",
      "button": "disparar_uma_acao"
    },
    "hint": "Pense em saída de texto, entrada de dados e ação do usuário.",
    "explanation": "TextView exibe conteúdo; EditText recebe digitação; Button representa uma ação acionável.",
    "visual": {
      "targets": [
        {
          "id": "exibir_texto_ou_resposta",
          "label": "Exibir texto ou resposta"
        },
        {
          "id": "receber_texto_digitado",
          "label": "Receber texto digitado"
        },
        {
          "id": "disparar_uma_acao",
          "label": "Disparar uma ação"
        }
      ]
    }
  },
  {
    "subject": "mobile_sub",
    "key": "mo03",
    "topic": "Componentes",
    "prompt": "Um app precisa pedir o nome do usuário e depois mostrar uma saudação. Qual combinação de componentes atende melhor às duas tarefas?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "TextView para receber o nome e EditText para apresentar a saudação depois do toque."
      },
      {
        "id": "b",
        "label": "EditText para receber o nome e TextView para apresentar a saudação ao usuário."
      },
      {
        "id": "c",
        "label": "EditText para receber o nome e Button para ser usado como área principal de resposta."
      },
      {
        "id": "d",
        "label": "Button para receber o nome digitado e TextView para apresentar a saudação resultante."
      }
    ],
    "correct": "b",
    "hint": "Separe componente de entrada e componente de saída.",
    "explanation": "EditText recebe a digitação; TextView pode apresentar a resposta.",
    "visual": null
  },
  {
    "subject": "mobile_sub",
    "key": "mo04",
    "topic": "Interação",
    "prompt": "Um botão deve executar uma ação quando o usuário o toca. Qual recurso representa esse comportamento nas atividades?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "Build.MODEL, usado para consultar uma informação referente ao modelo do dispositivo."
      },
      {
        "id": "b",
        "label": "R.string, usado para identificar um recurso textual armazenado dentro do projeto Android."
      },
      {
        "id": "c",
        "label": "textSize, usado para configurar o tamanho visual do texto apresentado por um componente."
      },
      {
        "id": "d",
        "label": "setOnClickListener, usado para registrar a ação executada quando o botão é acionado."
      }
    ],
    "correct": "d",
    "hint": "Procure o listener de clique/toque.",
    "explanation": "setOnClickListener registra a ação executada no clique.",
    "visual": null
  },
  {
    "subject": "mobile_sub",
    "key": "mo05",
    "topic": "Android",
    "prompt": "Relacione cada propriedade da API Build à informação que ela fornece.",
    "type": "match",
    "points": 0.25,
    "options": [
      {
        "id": "build_manufacturer",
        "label": "Build.MANUFACTURER"
      },
      {
        "id": "build_model",
        "label": "Build.MODEL"
      },
      {
        "id": "build_version_release",
        "label": "Build.VERSION.RELEASE"
      },
      {
        "id": "build_version_sdk_int",
        "label": "Build.VERSION.SDK_INT"
      }
    ],
    "correct": {
      "build_manufacturer": "fabricante_do_dispositivo",
      "build_model": "modelo_do_dispositivo",
      "build_version_release": "versao_do_android",
      "build_version_sdk_int": "nivel_da_api_sdk"
    },
    "hint": "Diferencie nome do fabricante, modelo, versão apresentada ao usuário e nível de API.",
    "explanation": "MANUFACTURER informa fabricante; MODEL informa modelo; RELEASE informa versão do Android; SDK_INT informa o nível de API.",
    "visual": {
      "targets": [
        {
          "id": "fabricante_do_dispositivo",
          "label": "Fabricante do dispositivo"
        },
        {
          "id": "modelo_do_dispositivo",
          "label": "Modelo do dispositivo"
        },
        {
          "id": "versao_do_android",
          "label": "Versão do Android"
        },
        {
          "id": "nivel_da_api_sdk",
          "label": "Nível da API/SDK"
        }
      ]
    }
  },
  {
    "subject": "mobile_sub",
    "key": "mo06",
    "topic": "Android",
    "prompt": "Um app precisa exibir tanto “Android 15” quanto o nível numérico da API do aparelho. Qual associação está correta?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "Build.VERSION.RELEASE fornece a versão legível; Build.VERSION.SDK_INT fornece o nível da API."
      },
      {
        "id": "b",
        "label": "Build.VERSION.SDK_INT fornece a versão legível; Build.VERSION.RELEASE fornece o modelo do aparelho."
      },
      {
        "id": "c",
        "label": "Build.MODEL fornece a versão legível; Build.VERSION.SDK_INT fornece o fabricante do aparelho."
      },
      {
        "id": "d",
        "label": "Build.MANUFACTURER fornece a versão legível; Build.MODEL fornece o nível numérico da API."
      }
    ],
    "correct": "a",
    "hint": "RELEASE e SDK_INT representam informações diferentes da versão do sistema.",
    "explanation": "VERSION.RELEASE representa a versão legível; VERSION.SDK_INT representa o nível numérico da API.",
    "visual": null
  },
  {
    "subject": "mobile_sub",
    "key": "mo07",
    "topic": "Interação",
    "prompt": "Ordene um fluxo coerente para um app simples de saudação.",
    "type": "order",
    "points": 0.25,
    "options": [
      {
        "id": "usuario_digita_o_nome",
        "label": "Usuário digita o nome"
      },
      {
        "id": "usuario_toca_no_botao",
        "label": "Usuário toca no botão"
      },
      {
        "id": "listener_executa_a_logica",
        "label": "Listener executa a lógica"
      },
      {
        "id": "codigo_valida_o_valor",
        "label": "Código valida o valor"
      },
      {
        "id": "textview_mostra_a_resposta",
        "label": "TextView mostra a resposta"
      }
    ],
    "correct": [
      "usuario_digita_o_nome",
      "usuario_toca_no_botao",
      "listener_executa_a_logica",
      "codigo_valida_o_valor",
      "textview_mostra_a_resposta"
    ],
    "hint": "Comece pela ação do usuário e termine pelo feedback.",
    "explanation": "Entrada → toque → evento → validação → resposta.",
    "visual": null
  },
  {
    "subject": "mobile_sub",
    "key": "mo08",
    "topic": "Validação",
    "prompt": "Antes de montar uma saudação, o app verifica se o campo de nome está vazio. Qual é o principal motivo dessa validação?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "Evitar processar uma entrada ausente e orientar a pessoa sobre o que precisa ser preenchido."
      },
      {
        "id": "b",
        "label": "Converter automaticamente qualquer texto digitado para um valor válido antes de usar o campo."
      },
      {
        "id": "c",
        "label": "Impedir que o teclado virtual seja aberto quando a pessoa seleciona o campo de entrada."
      },
      {
        "id": "d",
        "label": "Garantir que o conteúdo digitado continue salvo mesmo depois que o aplicativo for encerrado."
      }
    ],
    "correct": "a",
    "hint": "Validação protege o fluxo e melhora o feedback ao usuário.",
    "explanation": "Validar uma entrada obrigatória evita processar dados ausentes e permite orientar o usuário.",
    "visual": null
  },
  {
    "subject": "mobile_sub",
    "key": "mo09",
    "topic": "Recursos",
    "prompt": "Em um projeto Android, qual prática descreve melhor o uso de strings.xml?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "Centralizar textos da interface para facilitar reutilização, manutenção e futura localização."
      },
      {
        "id": "b",
        "label": "Centralizar toda a lógica de interação para que a Activity não precise registrar eventos de clique."
      },
      {
        "id": "c",
        "label": "Centralizar dimensões de tela para que o mesmo layout seja aplicado sem qualquer adaptação."
      },
      {
        "id": "d",
        "label": "Centralizar dados do dispositivo para substituir as propriedades disponibilizadas pela API Build."
      }
    ],
    "correct": "a",
    "hint": "Strings.xml é um arquivo de recursos textuais.",
    "explanation": "Centralizar textos em strings.xml reduz repetição e facilita manutenção e localização.",
    "visual": null
  },
  {
    "subject": "mobile_sub",
    "key": "mo10",
    "topic": "Recursos",
    "prompt": "Considere getString(R.string.mensagem_principal). O que essa expressão faz?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "Localiza um texto em um serviço externo usando R.string como endereço da consulta de rede."
      },
      {
        "id": "b",
        "label": "Recupera, no código, o texto associado ao recurso mensagem_principal definido no projeto."
      },
      {
        "id": "c",
        "label": "Cria em tempo de execução um novo recurso de texto com o nome mensagem_principal."
      },
      {
        "id": "d",
        "label": "Altera diretamente o conteúdo de qualquer TextView que possua o mesmo nome do recurso."
      }
    ],
    "correct": "b",
    "hint": "R.string aponta para recursos do próprio aplicativo.",
    "explanation": "getString() recupera o texto associado ao identificador de recurso informado.",
    "visual": null
  },
  {
    "subject": "mobile_sub",
    "key": "mo11",
    "topic": "Responsividade",
    "prompt": "Uma mesma tela precisa permanecer legível em celulares com larguras diferentes, reorganizando elementos quando necessário. Qual decisão está mais relacionada a esse objetivo?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "Manter dimensões fixas e permitir rolagem horizontal sempre que faltar espaço."
      },
      {
        "id": "b",
        "label": "Aplicar responsividade para adaptar distribuição, tamanho e hierarquia ao espaço disponível."
      },
      {
        "id": "c",
        "label": "Aumentar o número de opções visíveis para evitar mudanças entre tamanhos de tela."
      },
      {
        "id": "d",
        "label": "Usar o mesmo posicionamento absoluto para todos os elementos em qualquer dispositivo."
      }
    ],
    "correct": "b",
    "hint": "Responsividade não é apenas reduzir a interface; é adaptar o layout.",
    "explanation": "Uma interface responsiva reorganiza elementos para preservar legibilidade e usabilidade.",
    "visual": null
  },
  {
    "subject": "mobile_sub",
    "key": "mo12",
    "topic": "UI",
    "prompt": "Qual situação está mais diretamente relacionada à UI de um aplicativo?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "Definir hierarquia visual, aparência dos botões, campos, ícones e tipografia."
      },
      {
        "id": "b",
        "label": "Medir se o usuário conclui uma tarefa com pouco esforço ao longo de todo o fluxo."
      },
      {
        "id": "c",
        "label": "Avaliar se a quantidade de escolhas aumenta o tempo necessário para decidir."
      },
      {
        "id": "d",
        "label": "Investigar a satisfação do usuário depois de várias etapas e interações."
      }
    ],
    "correct": "a",
    "hint": "UI trata da camada visível e interativa.",
    "explanation": "UI envolve a apresentação e os componentes com os quais a pessoa interage diretamente.",
    "visual": null
  },
  {
    "subject": "mobile_sub",
    "key": "mo13",
    "topic": "UX",
    "prompt": "Qual situação está mais diretamente relacionada à UX?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "Avaliar apenas se cores e contrastes escolhidos deixam a primeira tela visualmente agradável."
      },
      {
        "id": "b",
        "label": "Avaliar apenas se a tipografia e os ícones seguem o estilo visual definido para o aplicativo."
      },
      {
        "id": "c",
        "label": "Avaliar apenas se botões e campos mantêm dimensões e formatos visualmente padronizados."
      },
      {
        "id": "d",
        "label": "Avaliar se a pessoa entende o fluxo, recebe feedback e conclui a tarefa com pouco esforço."
      }
    ],
    "correct": "d",
    "hint": "UX observa a experiência de uso ao longo da tarefa.",
    "explanation": "UX considera clareza, esforço, feedback, previsibilidade e sucesso na realização da tarefa.",
    "visual": null
  },
  {
    "subject": "mobile_sub",
    "key": "mo14",
    "topic": "Zona do polegar",
    "prompt": "Em um aplicativo usado principalmente com uma mão, uma ação muito frequente deve considerar:",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "facilidade de alcance pelo polegar, reduzindo deslocamento e esforço em uma ação usada com frequência."
      },
      {
        "id": "b",
        "label": "posicionamento na região superior mais distante para separar a ação principal do conteúdo."
      },
      {
        "id": "c",
        "label": "mudança frequente de posição entre telas para estimular o usuário a observar toda a interface."
      },
      {
        "id": "d",
        "label": "redução da área de toque para aproveitar melhor o espaço disponível e evitar toques acidentais."
      }
    ],
    "correct": "a",
    "hint": "Ergonomia = menor esforço para ações frequentes.",
    "explanation": "A zona do polegar orienta posicionamento de ações frequentes.",
    "visual": null
  },
  {
    "subject": "mobile_sub",
    "key": "mo15",
    "topic": "Lei de Fitts",
    "prompt": "Dois botões executam a mesma ação. O primeiro é pequeno e distante da posição atual do dedo; o segundo tem área de toque adequada e está mais próximo. Segundo a Lei de Fitts:",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "o primeiro tende a ser mais rápido por ocupar menos espaço."
      },
      {
        "id": "b",
        "label": "os dois sempre terão exatamente o mesmo tempo de seleção."
      },
      {
        "id": "c",
        "label": "o segundo tende a ser alcançado e selecionado mais rapidamente."
      },
      {
        "id": "d",
        "label": "o primeiro oferece melhor experiência por exigir maior precisão."
      }
    ],
    "correct": "c",
    "hint": "Considere tamanho do alvo e distância de movimento.",
    "explanation": "Alvos maiores e mais próximos reduzem o tempo de seleção.",
    "visual": {
      "kind": "fitts_compare"
    }
  },
  {
    "subject": "mobile_sub",
    "key": "mo16",
    "topic": "Lei de Hick",
    "prompt": "Uma tela apresenta 18 ações de mesma importância; outra mostra quatro ações relevantes para aquele momento. Considerando a Lei de Hick:",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "a primeira tende a acelerar a escolha porque oferece mais alternativas visíveis ao mesmo tempo."
      },
      {
        "id": "b",
        "label": "a segunda pode reduzir o tempo e o esforço de decisão ao priorizar apenas as ações relevantes."
      },
      {
        "id": "c",
        "label": "a quantidade de opções apresentadas não interfere no tempo necessário para decidir entre ações."
      },
      {
        "id": "d",
        "label": "a segunda necessariamente prejudica a tarefa porque qualquer redução de opções limita o usuário."
      }
    ],
    "correct": "b",
    "hint": "Mais opções concorrentes aumentam complexidade de escolha.",
    "explanation": "Reduzir e organizar opções relevantes pode acelerar a decisão.",
    "visual": {
      "kind": "hick_compare"
    }
  },
  {
    "subject": "mobile_sub",
    "key": "mo17",
    "topic": "Consistência",
    "prompt": "Em várias telas, um botão azul significa “continuar”. Em outra tela, o mesmo padrão visual passa a significar “excluir”. Qual problema existe?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "A interface se torna mais responsiva porque reutiliza exatamente o mesmo componente visual."
      },
      {
        "id": "b",
        "label": "A repetição da cor elimina a necessidade de um rótulo textual que explique a ação disponível."
      },
      {
        "id": "c",
        "label": "A mudança de significado não interfere na compreensão quando o texto do botão está correto."
      },
      {
        "id": "d",
        "label": "A interface perde consistência porque um padrão visual conhecido passa a comunicar outra ação."
      }
    ],
    "correct": "d",
    "hint": "Padrões semelhantes devem comunicar significados previsíveis.",
    "explanation": "Consistência reduz ambiguidade e carga cognitiva.",
    "visual": null
  },
  {
    "subject": "mobile_sub",
    "key": "mo18",
    "topic": "UX/UI",
    "prompt": "Compare duas interfaces: A tem ação principal pequena, opções espalhadas e nenhum feedback; B destaca a ação principal, usa área de toque adequada, agrupa opções e mostra feedback. Qual decisão é melhor?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "A, porque distribuir as ações pela tela aumenta as possibilidades de exploração durante o uso."
      },
      {
        "id": "b",
        "label": "B, porque destaca a ação principal, reduz esforço de interação e comunica feedback de forma clara."
      },
      {
        "id": "c",
        "label": "A, porque retirar feedback reduz distrações e deixa a interface visualmente mais simples."
      },
      {
        "id": "d",
        "label": "As duas são equivalentes, pois a experiência do usuário depende principalmente da escolha de cores."
      }
    ],
    "correct": "b",
    "hint": "Observe clareza, esforço e feedback.",
    "explanation": "A interface B oferece melhores condições de uso.",
    "visual": {
      "kind": "ux_compare"
    }
  },
  {
    "subject": "mobile_sub",
    "key": "mo19",
    "topic": "Feedback",
    "prompt": "Após tocar em “Enviar”, o app precisa consultar dados e leva alguns segundos. Qual resposta de interface é mais adequada durante a espera?",
    "type": "single",
    "points": 0.25,
    "options": [
      {
        "id": "a",
        "label": "Mostrar um estado de carregamento ou mensagem que confirme que a ação foi recebida."
      },
      {
        "id": "b",
        "label": "Manter a tela completamente igual para evitar qualquer mudança visual durante o processamento."
      },
      {
        "id": "c",
        "label": "Mover o botão para outra posição a cada toque para demonstrar que o aplicativo continua ativo."
      },
      {
        "id": "d",
        "label": "Apagar os textos da tela até a tarefa terminar para impedir novas decisões do usuário."
      }
    ],
    "correct": "a",
    "hint": "Feedback reduz incerteza enquanto o sistema trabalha.",
    "explanation": "Um indicador ou mensagem de carregamento informa que a ação foi reconhecida e está em andamento.",
    "visual": null
  },
  {
    "subject": "mobile_sub",
    "key": "mo20",
    "topic": "Integração",
    "prompt": "Depois que o usuário toca no botão de um app de saudação, ordene uma sequência coerente para tratar a interação.",
    "type": "order",
    "points": 0.25,
    "options": [
      {
        "id": "ler_o_texto_digitado_no_campo",
        "label": "Ler o texto digitado no campo"
      },
      {
        "id": "validar_se_o_valor_necessario_foi_inform",
        "label": "Validar se o valor necessário foi informado"
      },
      {
        "id": "preparar_a_mensagem_de_resposta",
        "label": "Preparar a mensagem de resposta"
      },
      {
        "id": "atualizar_o_textview_com_o_resultado",
        "label": "Atualizar o TextView com o resultado"
      }
    ],
    "correct": [
      "ler_o_texto_digitado_no_campo",
      "validar_se_o_valor_necessario_foi_inform",
      "preparar_a_mensagem_de_resposta",
      "atualizar_o_textview_com_o_resultado"
    ],
    "hint": "Depois do toque, primeiro obtenha o dado; depois valide; só então prepare e mostre o resultado.",
    "explanation": "Uma sequência coerente é ler a entrada, validar, preparar a resposta e atualizar a interface.",
    "visual": null
  }
] as RecoveryQuestion[];

