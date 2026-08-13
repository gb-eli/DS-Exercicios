export const PROJECT_COMPETENCIES = [
  {id:'research',label:'Pesquisa e curadoria'},
  {id:'programming',label:'Programação'},
  {id:'data',label:'Dados e visualização'},
  {id:'systems',label:'Pensamento sistêmico'},
  {id:'communication',label:'Comunicação científica'},
  {id:'design',label:'Design e experiência'},
  {id:'teamwork',label:'Trabalho em equipe'},
  {id:'ethics',label:'Ética e responsabilidade'},
  {id:'testing',label:'Testes e qualidade'},
  {id:'creativity',label:'Criatividade'}
];

export const INTERDISCIPLINARY_PROJECTS = [
  {id:'mission-dashboard',title:'Painel de uma Missão Espacial',icon:'▤',area:'Tecnologia e Programação',duration:'3 a 5 aulas',summary:'Projete um painel que transforme telemetria em decisões claras para uma equipe de missão.',challenge:'Como apresentar energia, temperatura, comunicação e alertas sem esconder riscos importantes?',roles:['embedded-developer','mission-operator','critical-ux','systems-engineer'],modules:['technology-hub','mission-control-advanced','technical-operations'],deliverables:['mapa de dados','protótipo do painel','regras de alerta','relatório de testes'],competencies:['programming','data','systems','design','testing'],stages:['investigate','prototype','validate','publish']},
  {id:'mars-science',title:'Dossiê Científico de Marte',icon:'●',area:'Ciência, Dados e Robótica',duration:'3 a 4 aulas',summary:'Investigue ambiente, sensores e amostras marcianas para produzir uma comunicação científica baseada em evidências.',challenge:'Quais dados sustentam uma conclusão e quais ainda exigem cautela?',roles:['planetary-data','robotics-specialist','science-communicator'],modules:['curiosity-center','mars','astrophotography-lab'],deliverables:['pergunta de pesquisa','tabela de evidências','visualização','resumo científico'],competencies:['research','data','communication','ethics'],stages:['investigate','analyze','review','publish']},
  {id:'climate-satellite',title:'Satélite para Observar a Terra',icon:'◎',area:'Geotecnologia e Sociedade',duration:'4 a 6 aulas',summary:'Planeje uma missão de observação da Terra para acompanhar clima, vegetação, litoral ou desastres.',challenge:'Como escolher sensores, órbita e produtos de dados úteis para uma necessidade real?',roles:['systems-engineer','planetary-data','embedded-developer','science-communicator'],modules:['earth','technical-operations','technology-hub'],deliverables:['objetivo da missão','arquitetura do satélite','produto de dados','painel de comunicação pública'],competencies:['systems','data','research','communication','ethics'],stages:['define','design','simulate','publish']},
  {id:'lunar-habitat',title:'Habitat Lunar Seguro',icon:'◐',area:'Física, Engenharia e Design',duration:'4 a 6 aulas',summary:'Crie uma proposta didática de habitat lunar integrando energia, suporte à vida, comunicação e manutenção.',challenge:'Como manter pessoas seguras em um ambiente hostil e distante?',roles:['systems-engineer','critical-ux','robotics-specialist','mission-operator'],modules:['moon','station','space-workshop'],deliverables:['mapa de riscos','diagrama de sistemas','procedimento de emergência','exposição do projeto'],competencies:['systems','design','testing','teamwork','ethics'],stages:['investigate','design','test','publish']},
  {id:'observing-night',title:'Noite de Observação Planejada',icon:'⌕',area:'Astronomia e Astrofotografia',duration:'2 a 4 aulas',summary:'Planeje uma sessão de observação, selecione instrumentos e produza um caderno científico.',challenge:'Como transformar condições imperfeitas do céu em um plano realista e seguro?',roles:['planetary-data','science-communicator','systems-engineer'],modules:['telescope-lab','astrophotography-lab','observatory'],deliverables:['plano de observação','escolha justificada de equipamento','registro processado','caderno digital'],competencies:['research','data','testing','communication'],stages:['plan','capture','process','publish']},
  {id:'space-exhibition',title:'Exposição Digital: Espaço, Ciência e Cultura',icon:'◈',area:'Cultura, História e Comunicação',duration:'3 a 5 aulas',summary:'Crie uma pequena exposição digital que conecte história, ciência, carreira e cultura espacial.',challenge:'Como despertar curiosidade sem misturar fato, hipótese e ficção?',roles:['science-curator','science-communicator','critical-ux','systems-engineer'],modules:['culture-discovery','history','people','curiosity-center'],deliverables:['tema curatorial','seleção de fontes','seis peças digitais','texto de abertura'],competencies:['research','communication','design','creativity','ethics'],stages:['curate','verify','design','publish']}
];

export const CAREER_SIMULATIONS = [
  {id:'embedded-developer',name:'Desenvolvedor de Software Embarcado',area:'Programação',icon:'</>',summary:'Transforma requisitos de sensores e atuadores em software previsível, testável e econômico.',skills:['C/C++','máquinas de estados','testes','tempo real'],modules:['languages','technology-hub','mission-control-advanced'],scenario:'Um sensor térmico envia picos inesperados durante uma manobra.',choices:[
    {id:'ignore',label:'Ignorar leituras extremas',score:0,feedback:'Oculta um risco e não cria rastreabilidade.'},
    {id:'filter-only',label:'Aplicar apenas uma média móvel',score:1,feedback:'Pode reduzir ruído, mas ainda não trata falha, unidade ou redundância.'},
    {id:'validate',label:'Validar intervalo, unidade, sequência e sensor redundante',score:3,feedback:'Combina validação, tolerância a falhas e registro para diagnóstico.'}
  ]},
  {id:'mission-operator',name:'Operador de Missão',area:'Operações',icon:'◉',summary:'Acompanha telemetria, executa procedimentos e comunica decisões sob pressão.',skills:['checklists','telemetria','comunicação','gestão de risco'],modules:['mission-control','technical-operations','integrated-campaigns'],scenario:'A energia cai e dois subsistemas pedem prioridade ao mesmo tempo.',choices:[
    {id:'all-on',label:'Manter tudo ligado',score:0,feedback:'Pode acelerar a perda de energia.'},
    {id:'random-off',label:'Desligar um sistema aleatoriamente',score:0,feedback:'Não considera criticidade nem dependências.'},
    {id:'prioritize',label:'Aplicar matriz de criticidade e preservar suporte à vida/comunicação',score:3,feedback:'A decisão usa prioridades, procedimento e registro.'}
  ]},
  {id:'critical-ux',name:'Designer de UX para Sistemas Críticos',area:'Design',icon:'◇',summary:'Organiza informação para reduzir erro humano em painéis, alertas e procedimentos.',skills:['hierarquia visual','acessibilidade','prototipação','testes com usuários'],modules:['technical-operations','mission-control','teacher-trail-studio'],scenario:'O painel mostra 30 métricas com o mesmo peso visual.',choices:[
    {id:'more-color',label:'Adicionar muitas cores',score:0,feedback:'Mais cor não cria prioridade e pode aumentar confusão.'},
    {id:'hide-all',label:'Ocultar quase todas as métricas',score:1,feedback:'Reduz ruído, mas pode esconder contexto necessário.'},
    {id:'hierarchy',label:'Agrupar por criticidade, tendência e ação esperada',score:3,feedback:'Cria leitura progressiva e ajuda a decidir.'}
  ]},
  {id:'systems-engineer',name:'Engenheiro de Sistemas',area:'Integração',icon:'⌬',summary:'Conecta requisitos, interfaces, riscos e testes entre várias equipes.',skills:['arquitetura','requisitos','interfaces','verificação'],modules:['technology-hub','space-workshop','performance-qa'],scenario:'Um novo instrumento exige mais energia, dados e refrigeração.',choices:[
    {id:'approve',label:'Aprovar sem revisar o restante',score:0,feedback:'Ignora impactos sistêmicos.'},
    {id:'reject',label:'Rejeitar apenas por aumentar a complexidade',score:1,feedback:'Evita risco, mas não avalia valor e alternativas.'},
    {id:'tradeoff',label:'Realizar análise de interfaces, orçamento e testes',score:3,feedback:'Compara benefícios, limites e dependências antes da decisão.'}
  ]},
  {id:'planetary-data',name:'Analista de Dados Planetários',area:'Dados',icon:'▦',summary:'Transforma imagens, espectros e telemetria em evidências e incertezas compreensíveis.',skills:['Python','estatística','visualização','qualidade de dados'],modules:['mars','observatory','astrophotography-lab'],scenario:'Uma imagem processada parece mostrar uma estrutura incomum.',choices:[
    {id:'announce',label:'Divulgar como descoberta',score:0,feedback:'Uma imagem isolada pode conter artefatos.'},
    {id:'discard',label:'Descartar sem análise',score:0,feedback:'Pode eliminar um dado útil.'},
    {id:'verify',label:'Revisar calibração, comparar quadros e buscar dados independentes',score:3,feedback:'Distingue sinal, ruído e hipótese.'}
  ]},
  {id:'robotics-specialist',name:'Especialista em Robótica Planetária',area:'Robótica',icon:'⚙',summary:'Integra mobilidade, sensores, autonomia e segurança em terrenos desconhecidos.',skills:['controle','visão computacional','planejamento de rota','simulação'],modules:['mars','physics-controls','space-workshop'],scenario:'O rover encontra terreno inclinado e comunicação atrasada.',choices:[
    {id:'speed',label:'Aumentar a velocidade',score:0,feedback:'Eleva o risco de perda de estabilidade.'},
    {id:'stop-forever',label:'Interromper a missão indefinidamente',score:1,feedback:'É seguro, mas não busca uma solução operacional.'},
    {id:'replan',label:'Recalcular rota, reduzir velocidade e validar inclinação',score:3,feedback:'Combina autonomia, limites e confirmação.'}
  ]},
  {id:'science-communicator',name:'Comunicador Científico',area:'Comunicação',icon:'✦',summary:'Traduz resultados complexos sem esconder incerteza, fonte ou contexto.',skills:['escrita','visualização','checagem','acessibilidade'],modules:['culture-discovery','curiosity-center','people'],scenario:'Uma postagem viral afirma que uma missão encontrou vida.',choices:[
    {id:'repeat',label:'Repetir para aproveitar o interesse',score:0,feedback:'Amplifica uma alegação sem confirmação.'},
    {id:'deny',label:'Negar sem consultar evidências',score:0,feedback:'Troca uma afirmação sem fonte por outra.'},
    {id:'context',label:'Verificar a fonte, explicar o dado e separar hipótese de conclusão',score:3,feedback:'Preserva interesse e rigor.'}
  ]},
  {id:'science-curator',name:'Curador de Ciência e Cultura',area:'Curadoria',icon:'◈',summary:'Seleciona peças, fontes e narrativas para construir uma exposição coerente e confiável.',skills:['pesquisa','contextualização','direitos autorais','design de narrativa'],modules:['culture-discovery','history','curiosity-center'],scenario:'Uma obra de ficção oferece uma cena visualmente forte, mas cientificamente simplificada.',choices:[
    {id:'present-fact',label:'Apresentar como explicação científica',score:0,feedback:'Mistura recurso narrativo com evidência.'},
    {id:'exclude',label:'Excluir toda referência cultural',score:1,feedback:'Perde uma porta de entrada para discussão.'},
    {id:'frame',label:'Usar como referência, explicando ciência, licença e limites',score:3,feedback:'A obra desperta curiosidade sem substituir fontes.'}
  ]}
];

export const SOURCE_RELIABILITY_CRITERIA = [
  {id:'authority',label:'Autoridade',question:'É possível identificar autor, instituição e responsabilidade?',weight:1.1},
  {id:'evidence',label:'Evidências',question:'Apresenta dados, método, referências ou documentos verificáveis?',weight:1.4},
  {id:'currency',label:'Atualização',question:'A data é adequada para o tipo de informação?',weight:0.8},
  {id:'transparency',label:'Transparência',question:'Separa fato, opinião, hipótese, publicidade e conflito de interesse?',weight:1.0},
  {id:'corroboration',label:'Corroboração',question:'A alegação pode ser confirmada em fontes independentes?',weight:1.2}
];

export const SOURCE_RELIABILITY_CASES = [
  {id:'official-mission',title:'Página oficial de uma missão',kind:'Fonte institucional',summary:'Página assinada pela organização responsável, com objetivos, instrumentos, datas e links técnicos.',expectedBand:'alta',clues:['responsabilidade identificada','documentação técnica','atualização registrada']},
  {id:'peer-reviewed',title:'Artigo científico revisado por pares',kind:'Pesquisa científica',summary:'Resumo de estudo com autores, método, dados, limitações e referências bibliográficas.',expectedBand:'alta',clues:['método explícito','limitações','referências']},
  {id:'museum-education',title:'Material de museu ou universidade',kind:'Divulgação educacional',summary:'Texto didático com autoria institucional, referências e linguagem adaptada ao público.',expectedBand:'alta',clues:['instituição reconhecida','objetivo educacional','fontes indicadas']},
  {id:'quality-news',title:'Reportagem com fontes nomeadas',kind:'Jornalismo',summary:'Notícia recente que diferencia anúncio, contexto e análise, citando documentos e especialistas.',expectedBand:'média',clues:['fontes identificadas','data recente','depende da matéria original']},
  {id:'company-release',title:'Comunicado de uma empresa',kind:'Fonte primária interessada',summary:'Apresenta dados do próprio produto ou missão, mas possui interesse institucional e promocional.',expectedBand:'média',clues:['fonte direta','possível viés','precisa de confirmação independente']},
  {id:'personal-blog',title:'Blog pessoal sem referências',kind:'Opinião',summary:'Texto com linguagem convincente, mas sem autoria verificável, dados originais ou referências.',expectedBand:'baixa',clues:['sem evidências','opinião não separada','difícil corroborar']},
  {id:'anonymous-ai',title:'Texto anônimo gerado automaticamente',kind:'Conteúdo sem procedência',summary:'Resposta sem fontes, data, autoria, método ou forma de conferir as afirmações.',expectedBand:'baixa',clues:['sem procedência','pode inventar detalhes','exige checagem externa']},
  {id:'viral-post',title:'Postagem viral com imagem isolada',kind:'Rede social',summary:'Afirmação extraordinária baseada em uma imagem recortada, sem origem, contexto ou dados.',expectedBand:'baixa',clues:['contexto ausente','apelo emocional','não oferece fonte primária']}
];

export const EXHIBITION_THEMES = [
  {id:'deep-space',name:'Universo Profundo',accent:'#a98cff',background:'#050817'},
  {id:'mission-control',name:'Centro de Controle',accent:'#5ee3ff',background:'#03121a'},
  {id:'mars-lab',name:'Laboratório Marciano',accent:'#ff9b6a',background:'#160a08'},
  {id:'lunar-museum',name:'Museu Lunar',accent:'#e8edf6',background:'#0b0e16'}
];

export const PROJECT_PORTFOLIO_ARTIFACT_TYPES = [
  {id:'report',label:'Relatório'},
  {id:'code',label:'Código ou pseudocódigo'},
  {id:'data',label:'Dados ou gráfico'},
  {id:'image',label:'Imagem ou observação'},
  {id:'prototype',label:'Protótipo'},
  {id:'reflection',label:'Reflexão'},
  {id:'evidence',label:'Evidência de laboratório'}
];

export const PROJECT_STAGES = [
  {id:'investigate',label:'Investigar'},
  {id:'define',label:'Definir problema'},
  {id:'plan',label:'Planejar'},
  {id:'curate',label:'Curar conteúdo'},
  {id:'analyze',label:'Analisar'},
  {id:'design',label:'Projetar'},
  {id:'prototype',label:'Prototipar'},
  {id:'simulate',label:'Simular'},
  {id:'capture',label:'Capturar'},
  {id:'process',label:'Processar'},
  {id:'verify',label:'Verificar fontes'},
  {id:'review',label:'Revisar'},
  {id:'validate',label:'Validar'},
  {id:'test',label:'Testar'},
  {id:'publish',label:'Publicar'}
];

export const PROJECT_CURATION_GOALS = [
  {id:'choose-project',label:'Escolha um projeto interdisciplinar'},
  {id:'career-simulation',label:'Conclua uma simulação de carreira'},
  {id:'review-sources',label:'Avalie ao menos três fontes'},
  {id:'portfolio',label:'Adicione três itens ao portfólio'},
  {id:'exhibition',label:'Monte uma exposição com três peças'},
  {id:'export',label:'Exporte a evidência ou exposição'}
];
