export const SPACE_HISTORY = [
  {
    id: 'mercury', year: '1958–1963', title: 'Projeto Mercury', badge: 'Primeiros voos humanos dos EUA',
    objective: 'Colocar uma pessoa em órbita, verificar se ela poderia trabalhar no espaço e recuperá-la com segurança.',
    dsFocus: 'Telemetria básica, cálculo de trajetória, comunicação solo–cápsula e procedimentos de segurança.',
    computing: 'Grande parte dos cálculos era preparada no solo; pessoas e computadores eletrônicos conferiam trajetórias e janelas de voo.',
    evolution: 'Provou as capacidades fundamentais que permitiram avançar para missões mais longas e complexas.',
    color: '#55dcff', icon: '◉', crew: '1 pessoa', destination: 'Órbita terrestre',
    source: 'https://www.nasa.gov/history/project-mercury-overview-introduction/'
  },
  {
    id: 'gemini', year: '1961–1966', title: 'Projeto Gemini', badge: 'A ponte para a Lua',
    objective: 'Testar permanência prolongada, encontro orbital, acoplamento, atividade extraveicular e reentrada controlada.',
    dsFocus: 'Máquinas de estados, sincronização, orientação, navegação relativa e coordenação entre sistemas.',
    computing: 'A complexidade operacional cresceu: mais estados, manobras, interfaces e decisões coordenadas entre tripulação e solo.',
    evolution: 'Transformou objetivos isolados de Mercury em procedimentos repetíveis necessários para Apollo.',
    color: '#8b6cff', icon: '◇', crew: '2 pessoas', destination: 'Órbita terrestre',
    source: 'https://www.nasa.gov/gemini/'
  },
  {
    id: 'apollo', year: '1961–1972', title: 'Programa Apollo', badge: 'Exploração lunar',
    objective: 'Levar tripulações à Lua, pousar, realizar atividades científicas e retornar com segurança.',
    dsFocus: 'Software de orientação, prioridades, tolerância a falhas, integração de módulos e validação rigorosa.',
    computing: 'O Apollo Guidance Computer executava software embarcado com recursos muito limitados, exigindo projeto cuidadoso e prioridades.',
    evolution: 'Consolidou engenharia de software para sistemas críticos e integração em escala inédita.',
    color: '#ffcf5a', icon: '◐', crew: '3 pessoas', destination: 'Lua',
    source: 'https://www.nasa.gov/the-apollo-program/'
  },
  {
    id: 'shuttle', year: '1972–2011', title: 'Programa Ônibus Espacial', badge: 'Veículo parcialmente reutilizável',
    objective: 'Transportar pessoas e cargas, apoiar satélites, laboratórios e a construção de infraestrutura orbital.',
    dsFocus: 'Redundância computacional, controle de voo, interfaces de cabine, manutenção e operação reutilizável.',
    computing: 'Sistemas digitais passaram a controlar mais funções de voo e a integrar computadores redundantes.',
    evolution: 'Aumentou a frequência e a variedade das operações humanas em órbita baixa.',
    color: '#63e6a8', icon: '△', crew: '2–8 pessoas', destination: 'Órbita terrestre',
    source: 'https://www.nasa.gov/space-shuttle/'
  },
  {
    id: 'iss', year: '1998–presente', title: 'Estação Espacial Internacional', badge: 'Laboratório orbital distribuído',
    objective: 'Manter presença humana contínua, conduzir pesquisas e operar uma infraestrutura internacional em órbita.',
    dsFocus: 'Sistemas distribuídos, inventário, energia, redes, suporte à vida, manutenção e colaboração entre equipes.',
    computing: 'Múltiplos subsistemas e parceiros precisam trocar dados e manter operações contínuas com procedimentos bem definidos.',
    evolution: 'Mudou a exploração de missões curtas para operação permanente e cooperativa.',
    color: '#ff7eaa', icon: '✣', crew: 'Expedições internacionais', destination: 'Órbita terrestre',
    source: 'https://www.nasa.gov/international-space-station/'
  },
  {
    id: 'rovers', year: '1997–presente', title: 'Rovers em Marte', badge: 'Robótica e autonomia',
    objective: 'Explorar o terreno, analisar rochas e atmosfera e executar ciência a grande distância da Terra.',
    dsFocus: 'Filas de comandos, autonomia, sensores, visão computacional, planejamento de rotas e bancos de dados científicos.',
    computing: 'O atraso de comunicação exige que o veículo execute sequências e proteja a si próprio sem controle humano instantâneo.',
    evolution: 'Ampliou o papel do software autônomo e da robótica na exploração planetária.',
    color: '#ff8e5b', icon: '⬡', crew: 'Robôs', destination: 'Marte',
    source: 'https://science.nasa.gov/mission/mars-2020-perseverance/'
  },
  {
    id: 'frameworks', year: '2000–presente', title: 'Frameworks reutilizáveis', badge: 'Arquitetura por componentes',
    objective: 'Reaproveitar infraestrutura de software de voo, reduzir riscos e acelerar o desenvolvimento de novas missões.',
    dsFocus: 'Componentes, portas, filas, telemetria, comandos, abstração de hardware e sistemas operacionais.',
    computing: 'Projetos como cFS e F Prime organizam funções comuns em arquiteturas portáveis e testáveis.',
    evolution: 'Substitui soluções totalmente isoladas por bases reutilizáveis e comunidades de software.',
    color: '#7ee7ff', icon: '⌘', crew: 'Equipes de software', destination: 'Diversas missões',
    source: 'https://fprime.jpl.nasa.gov/overview/'
  }
];

export const EVOLUTION_ORDER = ['mercury', 'gemini', 'apollo'];

export const HISTORY_COMPARISON = [
  { label: 'Objetivo principal', mercury: 'Primeiro domínio do voo humano', gemini: 'Treinar técnicas para missões complexas', apollo: 'Explorar a Lua e retornar' },
  { label: 'Tripulação típica', mercury: '1', gemini: '2', apollo: '3' },
  { label: 'Conceito DS', mercury: 'Entrada e telemetria', gemini: 'Estados e sincronização', apollo: 'Prioridades e tolerância a falhas' },
  { label: 'Complexidade', mercury: 'Fundamental', gemini: 'Intermediária', apollo: 'Sistêmica e integrada' }
];
