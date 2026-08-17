export const JOURNEY_ENTRY_MODES = [
  { id:'continue', icon:'▶', title:'Continuar jornada', summary:'Retome exatamente a etapa e o laboratório em que parou.' },
  { id:'guided', icon:'✦', title:'Iniciar uma trilha', summary:'Siga uma história com objetivos, explicações e checkpoints.' },
  { id:'free', icon:'◌', title:'Explorar livremente', summary:'Escolha qualquer laboratório sem sequência obrigatória.' },
  { id:'tour', icon:'⌁', title:'Conhecer as ferramentas', summary:'Aprenda onde ficam e por que usar os principais recursos.' }
];

export const GUIDED_STORIES = {
  technology:{role:'Especialista de sistemas',mission:'Preparar a arquitetura digital de uma missão orbital.',opening:'Uma missão está pronta para decolar, mas os sistemas precisam ser compreendidos e validados antes da autorização final.',completion:'A arquitetura foi revisada e o veículo está pronto para operação.',color:'#5ee3ff'},
  programming:{role:'Desenvolvedor de software de missão',mission:'Construir uma cadeia confiável de dados, estados e decisões.',opening:'A equipe recebeu telemetria incompleta e precisa decidir quais linguagens, estruturas e validações usar.',completion:'O fluxo de software foi validado da entrada científica ao relatório.',color:'#7af0bc'},
  exploration:{role:'Explorador científico',mission:'Viajar do Sistema Solar ao universo profundo e registrar descobertas.',opening:'O observatório detectou destinos de interesse. Sua tarefa é preparar a rota, explorar e documentar cada escala.',completion:'A expedição registrou uma coleção completa de destinos cósmicos.',color:'#a98cff'},
  planets:{role:'Pesquisador planetário',mission:'Comparar mundos e compreender como ambiente e tecnologia mudam a exploração.',opening:'A equipe precisa escolher destinos para uma expedição. Você analisará gravidade, atmosfera, terreno e observação.',completion:'O relatório comparativo dos mundos foi concluído.',color:'#ffcb68'},
  missions:{role:'Diretor de operações',mission:'Acompanhar a evolução das missões e executar uma campanha integrada.',opening:'Você foi chamado para revisar decisões históricas e conduzir uma nova missão do lançamento ao destino.',completion:'A missão foi registrada com seus checkpoints e evidências.',color:'#ff879d'},
  culture:{role:'Curador científico e tecnológico',mission:'Transformar uma curiosidade cultural em investigação, experiência e projeto de carreira.',opening:'Uma obra, organização ou profissão despertou sua curiosidade. Sua tarefa é separar ciência e ficção, encontrar tecnologias e experimentar laboratórios relacionados.',completion:'A referência cultural foi convertida em uma trilha científica e profissional.',color:'#d2a8ff'},
  projects:{role:'Líder de projeto interdisciplinar',mission:'Investigar um problema, experimentar uma profissão, verificar fontes e publicar evidências.',opening:'Sua equipe recebeu um desafio espacial que exige ciência, tecnologia, comunicação e decisões responsáveis.',completion:'O projeto foi documentado em um portfólio ou exposição digital verificável.',color:'#8ee8ff'}
};

export const MODULE_PURPOSES = {
  'journey-center':'organizar a sequência, o enredo e o próximo passo da jornada',
  'project-curation-studio':'transformar investigação, decisões profissionais e fontes verificadas em portfólio e exposição digital',
  'culture-discovery':'conectar agências, empresas, carreiras e cultura aos conteúdos científicos e tecnológicos',
  'technology-hub':'relacionar sensores, software, computadores, comunicação e painéis',
  'technical-operations':'operar painéis, interpretar telemetria, inspecionar hotspots e recuperar falhas didáticas',
  'space-workshop':'montar componentes, conectar energia, dados e comandos, diagnosticar e reparar falhas',
  academy:'compreender o fluxo básico entre entrada, processamento e saída',
  languages:'escolher linguagens conforme risco, desempenho, hardware e dados',
  'mission-control':'observar como a telemetria vira alerta e decisão operacional',
  'mission-control-advanced':'investigar estados, prioridades, replay e tolerância a falhas',
  earth:'entender órbita, energia, cobertura e comunicação de satélites',
  launch:'analisar cálculos e intertravamentos de um foguete',
  'launch-remaster':'inspecionar o veículo e acompanhar visualmente as fases do lançamento',
  moon:'relacionar computador, pouso e ciência lunar',
  mars:'experimentar autonomia, atraso de comunicação, visão e amostras',
  station:'investigar sistemas integrados de suporte à vida, energia e logística',
  'station-remaster':'explorar estação, cápsulas, EVA e acoplamento em 360°',
  'solar-remaster':'localizar corpos e compreender escalas do Sistema Solar',
  'planetary-remaster':'comparar terreno, gravidade e mobilidade na Lua e em Marte',
  observatory:'entender como instrumentos transformam luz em dados científicos',
  'telescope-lab':'montar, alinhar e configurar telescópios para transformar luz ou rádio em uma observação rastreável',
  'astrophotography-lab':'planejar capturas, calibrar sensores, alinhar e empilhar quadros e documentar o processamento',
  'deep-space-remaster':'explorar objetos e escalas do universo profundo',
  'curiosity-center':'consultar dados, fontes, comparações e curiosidades antes da prática',
  'integrated-campaigns':'unir laboratórios em uma missão com checkpoints e evidências',
  history:'compreender a evolução das tecnologias e decisões espaciais'
};

export const TOOL_TOUR_STEPS = [
  {id:'journey',anchor:'journey-guided',title:'Jornadas guiadas',purpose:'Use quando o aluno precisa de uma sequência com enredo, objetivo e conclusão.',action:'Abra a central de jornadas para escolher uma trilha.'},
  {id:'free',anchor:'journey-free',title:'Exploração livre',purpose:'Use para acessar os laboratórios sem uma sequência obrigatória.',action:'Toque para revelar o catálogo modular.'},
  {id:'continue',anchor:'journey-continue',title:'Continuar de onde parou',purpose:'Retoma o progresso salvo sem procurar novamente o laboratório correto.',action:'O botão abre a etapa atual da trilha ativa.'},
  {id:'profile',anchor:'profile-card',title:'Perfil e progresso',purpose:'Separa XP, descobertas e trilhas por estudante.',action:'Troque ou crie um perfil quando o dispositivo for compartilhado.'},
  {id:'settings',anchor:'settings-button',title:'Acessibilidade e desempenho',purpose:'Adapta gráficos, movimento, contraste, texto e controles ao equipamento e ao aluno.',action:'Abra as configurações para ajustar a experiência.'}
];

export const LOADING_STAGES = [
  {id:'shell',progress:12,label:'Preparando interface',detail:'Carregando apenas controles e dados essenciais.'},
  {id:'module',progress:38,label:'Abrindo laboratório',detail:'Baixando o código somente do módulo escolhido.'},
  {id:'data',progress:67,label:'Organizando experiência',detail:'Preparando objetivo, estado local e recursos didáticos.'},
  {id:'scene',progress:88,label:'Iniciando cenário',detail:'A cena leve aparece primeiro; detalhes gráficos chegam sob demanda.'},
  {id:'ready',progress:100,label:'Laboratório pronto',detail:'Controles, fallback e progresso verificados.'}
];

export const getGuidedStepGuide=(trailId,step,trail=null)=>{
  const story=trail?.story||GUIDED_STORIES[trailId]||GUIDED_STORIES.exploration;
  const purpose=MODULE_PURPOSES[step?.moduleId]||'aplicar uma ferramenta específica dentro da missão';
  const adaptation=trail?.adaptationMode||'standard';
  return {
    role:story.role,
    mission:story.mission,
    why:step?.why||`Este laboratório é usado agora para ${purpose}.`,
    tool:`Ferramenta atual: ${step?.title||'laboratório'}. ${step?.objective||''}`.trim(),
    expected:step?.expected?`Resultado esperado: ${step.expected}`:step?.evidence?`Resultado esperado: ${step.evidence}`:'Conclua o objetivo e registre a evidência.',
    evidencePrompt:step?.evidencePrompt||'Descreva brevemente o que você observou ou decidiu.',
    narration:step?.narration||step?.objective||'',
    supportHint:adaptation==='support'?(step?.supportHint||'Leia o objetivo em partes e use o botão “Por que usar?”.'):'',
    advancedChallenge:adaptation==='advanced'?(step?.advancedChallenge||'Relacione a ferramenta a uma decisão técnica da missão.'):'',
    opening:story.opening,
    completion:story.completion,
    color:story.color||trail?.accent
  };
};
