export const GUIDED_TRAILS = [
  {id:'technology',title:'Trilha de Tecnologia Espacial',icon:'⌬',accent:'#5ee3ff',duration:'55–80 min',level:'Iniciante a intermediário',summary:'Descubra como sensores, computadores, redes, painéis e software trabalham juntos.',steps:[
    {id:'tech-intro',moduleId:'technology-hub',title:'Mapa da arquitetura digital',objective:'Explore as oito camadas e identifique onde os dados nascem, são processados e apresentados.',evidence:'Camada técnica selecionada.'},
    {id:'tech-sensors',moduleId:'academy',title:'Entrada, processamento e saída',objective:'Conclua a sequência sensor → processamento → atuador.',evidence:'Pipeline validado.'},
    {id:'tech-languages',moduleId:'languages',title:'Escolha de linguagens',objective:'Compare linguagens por camada, hardware, risco e desempenho.',evidence:'Cenário de linguagem analisado.'},
    {id:'tech-telemetry',moduleId:'mission-control',title:'Fluxo de telemetria',objective:'Observe leitura, alerta, estado e decisão no centro de controle.',evidence:'Anomalia identificada.'},
    {id:'tech-orbit',moduleId:'earth',title:'Satélite como sistema',objective:'Relacione energia, comunicação, órbita e sensores.',evidence:'Subsistema orbital inspecionado.'},
    {id:'tech-panel',moduleId:'technical-operations',title:'Painel operacional e hotspots',objective:'Inspecione um subsistema, use um modo técnico e execute um comando de recuperação.',evidence:'Telemetria e decisão técnica registradas.'},
    {id:'tech-workshop',moduleId:'space-workshop',title:'Oficina de montagem e manutenção',objective:'Monte componentes, conecte energia, dados e comandos e execute o diagnóstico final.',evidence:'Sistema montado ou falha de manutenção registrada.'},
    {id:'tech-station',moduleId:'station',title:'Sistemas integrados da estação',objective:'Analise suporte à vida, energia, logística e robótica.',evidence:'Sistema crítico revisado.'}
  ]},
  {id:'programming',title:'Trilha de Programação Espacial',icon:'</>',accent:'#7af0bc',duration:'60–90 min',level:'Intermediário',summary:'Percorra lógica, estados, filas, dados, autonomia e visualização científica.',steps:[
    {id:'prog-map',moduleId:'technology-hub',title:'Linguagens e camadas',objective:'Compare Assembly, C, C++, Python, JavaScript, TypeScript e SQL.',evidence:'Linguagem relacionada a uma camada.'},
    {id:'prog-language',moduleId:'languages',title:'Decisão tecnológica',objective:'Resolva os cenários escolhendo tecnologia pelo contexto.',evidence:'Escolha técnica justificada.'},
    {id:'prog-state',moduleId:'mission-control-advanced',title:'Estados e filas',objective:'Investigue prioridades, replay e tolerância a falhas.',evidence:'Cenário de controle revisado.'},
    {id:'prog-mars',moduleId:'mars',title:'Autonomia marciana',objective:'Observe atraso, rota A*, visão e banco de amostras.',evidence:'Comando autônomo executado.'},
    {id:'prog-observe',moduleId:'observatory',title:'Dados científicos',objective:'Processe imagem ou espectro e registre uma observação.',evidence:'Dado científico interpretado.'},
    {id:'prog-astro',moduleId:'astrophotography-lab',title:'Pipeline de astrofotografia',objective:'Planeje, calibre, alinhe, empilhe e processe uma sequência de imagens.',evidence:'Pipeline e parâmetros registrados.'}
  ]},
  {id:'exploration',title:'Trilha de Exploração Imersiva',icon:'✦',accent:'#a98cff',duration:'50–75 min',level:'Livre',summary:'Viaje do Sistema Solar ao universo profundo seguindo uma sequência de exploração.',steps:[
    {id:'exp-curiosity',moduleId:'curiosity-center',title:'Preparação científica',objective:'Escolha um destino, leia a ficha rápida e registre uma descoberta.',evidence:'Destino descoberto.'},
    {id:'exp-solar',moduleId:'solar-remaster',title:'Voo pelo Sistema Solar',objective:'Inspecione um planeta e compare escala e órbita.',evidence:'Planeta inspecionado.'},
    {id:'exp-surface',moduleId:'planetary-remaster',title:'Superfície da Lua ou Marte',objective:'Caminhe, pilote rover ou drone e localize um ponto científico.',evidence:'Objetivo de superfície visitado.'},
    {id:'exp-station',moduleId:'station-remaster',title:'Órbita e estação',objective:'Explore exterior, interior ou aproximação orbital.',evidence:'Setor orbital visitado.'},
    {id:'exp-telescope',moduleId:'telescope-lab',title:'Observar antes de viajar mais longe',objective:'Monte um instrumento, ajuste foco e registre um alvo.',evidence:'Observação telescópica registrada.'},
    {id:'exp-astro',moduleId:'astrophotography-lab',title:'Registrar o céu',objective:'Capture e empilhe um alvo para produzir um registro científico.',evidence:'Imagem processada e anotação salva.'},
    {id:'exp-deep',moduleId:'deep-space-remaster',title:'Universo profundo',objective:'Viaje até uma nebulosa, galáxia ou objeto extremo.',evidence:'Destino cósmico observado.'}
  ]},
  {id:'planets',title:'Trilha dos Planetas',icon:'◌',accent:'#ffcb68',duration:'45–70 min',level:'Iniciante',summary:'Aprenda comparação, gravidade, atmosfera, luas e técnicas de observação.',steps:[
    {id:'planet-data',moduleId:'curiosity-center',title:'Dados planetários',objective:'Compare Terra, Lua e Marte ou três planetas.',evidence:'Comparação criada.'},
    {id:'planet-system',moduleId:'solar-remaster',title:'Posição e escala',objective:'Localize planetas rochosos e gigantes no Sistema Solar.',evidence:'Corpo selecionado.'},
    {id:'planet-earth',moduleId:'earth',title:'Terra e órbitas',objective:'Observe camadas da Terra e a função dos satélites.',evidence:'Órbita analisada.'},
    {id:'planet-surface',moduleId:'planetary-remaster',title:'Gravidade e terreno',objective:'Compare mobilidade e ambiente na Lua e em Marte.',evidence:'Ambiente comparado.'},
    {id:'planet-telescope',moduleId:'telescope-lab',title:'Como observamos',objective:'Escolha telescópio, alvo e filtro para uma observação.',evidence:'Observação registrada.'}
  ]},
  {id:'missions',title:'Trilha de Missões Espaciais',icon:'▲',accent:'#ff879d',duration:'60–100 min',level:'Intermediário',summary:'Siga a evolução histórica e execute uma campanha com lançamento, destino e evidência.',steps:[
    {id:'mission-history',moduleId:'history',title:'Evolução das missões',objective:'Percorra marcos da computação espacial e escolha um período.',evidence:'Marco histórico estudado.'},
    {id:'mission-launch',moduleId:'launch-remaster',title:'Preparação e lançamento',objective:'Inspecione o veículo e acompanhe as fases do lançamento.',evidence:'Lançamento acompanhado.'},
    {id:'mission-moon',moduleId:'moon',title:'Operação lunar',objective:'Investigue o computador Apollo, pouso ou ciência de superfície.',evidence:'Tarefa lunar concluída.'},
    {id:'mission-mars',moduleId:'mars',title:'Robótica e atraso',objective:'Planeje comando e analise uma amostra marciana.',evidence:'Amostra ou rota registrada.'},
    {id:'mission-campaign',moduleId:'integrated-campaigns',title:'Campanha integrada',objective:'Inicie uma campanha e avance por seus checkpoints.',evidence:'Campanha iniciada ou retomada.'}
  ]}  ,{id:'culture',title:'Trilha Cultura Espacial e Carreiras',icon:'◈',accent:'#d2a8ff',duration:'45–70 min',level:'Livre e interdisciplinar',summary:'Use cultura, organizações e profissões como porta de entrada para ciência e Desenvolvimento de Sistemas.',steps:[
    {id:'culture-entry',moduleId:'culture-discovery',title:'Escolher uma porta de entrada',objective:'Selecione interesses, conheça uma organização, uma carreira e uma obra cultural.',evidence:'Interesse e referências registrados.'},
    {id:'culture-science',moduleId:'curiosity-center',title:'Separar fato e curiosidade',objective:'Abra fichas relacionadas e verifique dados, fontes e contexto científico.',evidence:'Fonte e conceito científico consultados.'},
    {id:'culture-code',moduleId:'technology-hub',title:'Conectar com tecnologia',objective:'Relacione a referência escolhida a sensores, software, telemetria ou arquitetura digital.',evidence:'Tecnologia relacionada identificada.'},
    {id:'culture-experience',moduleId:'deep-space-remaster',title:'Experimentar uma ideia espacial',objective:'Explore um destino ou fenômeno conectado ao tema cultural escolhido.',evidence:'Destino imersivo visitado.'},
    {id:'culture-history',moduleId:'history',title:'Localizar no tempo',objective:'Compare a obra ou tecnologia com um marco real da exploração espacial.',evidence:'Marco histórico relacionado.'},
    {id:'culture-discussion',moduleId:'culture-discovery',title:'Ciência, ficção e carreira',objective:'Registre uma análise separando ciência, dramatização e oportunidades profissionais.',evidence:'Discussão exportada.'}
  ]}
  ,{id:'projects',title:'Trilha de Projetos e Curadoria Científica',icon:'▧',accent:'#8ee8ff',duration:'60–120 min',level:'Interdisciplinar',summary:'Escolha um desafio, experimente uma profissão, verifique fontes e publique uma exposição ou portfólio.',steps:[
    {id:'project-entry',moduleId:'project-curation-studio',title:'Escolher o projeto',objective:'Selecione um projeto interdisciplinar, uma função e registre o desafio central.',evidence:'Projeto e função registrados.'},
    {id:'project-research',moduleId:'curiosity-center',title:'Construir repertório',objective:'Consulte fichas, dados e fontes relacionados ao problema escolhido.',evidence:'Fatos e referências consultados.'},
    {id:'project-technology',moduleId:'technology-hub',title:'Relacionar tecnologia',objective:'Identifique sensores, software, dados ou arquitetura necessários ao projeto.',evidence:'Camada tecnológica definida.'},
    {id:'project-practice',moduleId:'project-curation-studio',title:'Simular uma profissão',objective:'Resolva um cenário de carreira e analise o impacto da decisão.',evidence:'Decisão profissional registrada.'},
    {id:'project-sources',moduleId:'project-curation-studio',title:'Verificar confiabilidade',objective:'Avalie ao menos três casos com a rubrica de autoridade, evidência, atualização, transparência e corroboração.',evidence:'Três avaliações de fontes salvas.'},
    {id:'project-publish',moduleId:'project-curation-studio',title:'Publicar o resultado',objective:'Adicione itens ao portfólio e exporte uma exposição digital ou evidência final.',evidence:'Portfólio ou exposição exportada.'}
  ]}


];

export const GUIDED_TRAIL_BY_ID = Object.fromEntries(GUIDED_TRAILS.map(item=>[item.id,item]));

