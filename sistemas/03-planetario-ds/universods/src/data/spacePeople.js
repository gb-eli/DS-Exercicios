export const SPACE_PEOPLE = [
  {
    id: 'katherine-johnson', name: 'Katherine Johnson', years: '1918–2020', role: 'Matemática e analista de trajetórias', group: 'Cálculo e navegação', icon: '∿', accent: '#55dcff',
    contribution: 'Calculou trajetórias para missões iniciais e conferiu resultados de computadores eletrônicos, conectando matemática, validação e segurança de voo.',
    dsLink: 'Validação independente, precisão numérica, testes cruzados e confiança em resultados computacionais.',
    mission: 'Mercury e contribuições para programas posteriores',
    source: 'https://science.nasa.gov/people/katherine-johnson/'
  },
  {
    id: 'margaret-hamilton', name: 'Margaret Hamilton', years: '1936–', role: 'Liderança de software de voo', group: 'Engenharia de software', icon: '</>', accent: '#8b6cff',
    contribution: 'Liderou a equipe de software de voo do Apollo no MIT Instrumentation Laboratory e ajudou a consolidar práticas para software crítico.',
    dsLink: 'Priorização de tarefas, recuperação de erros, requisitos, integração e engenharia de software confiável.',
    mission: 'Programa Apollo',
    source: 'https://science.nasa.gov/people/margaret-hamilton/'
  },
  {
    id: 'yuri-gagarin', name: 'Yuri Gagarin', years: '1934–1968', role: 'Cosmonauta', group: 'Operações humanas', icon: '★', accent: '#ffcf5a',
    contribution: 'Realizou o primeiro voo humano ao espaço, demonstrando que uma pessoa poderia sobreviver e operar durante uma missão orbital.',
    dsLink: 'Interface humano–máquina, monitoramento de estado, procedimentos e comunicação.',
    mission: 'Vostok 1',
    source: 'https://www.nasa.gov/history/remembering-yuri-gagarin-50-years-later/'
  },
  {
    id: 'valentina-tereshkova', name: 'Valentina Tereshkova', years: '1937–', role: 'Cosmonauta', group: 'Operações humanas', icon: '✦', accent: '#ff7eaa',
    contribution: 'Tornou-se a primeira mulher a viajar ao espaço e ampliou a compreensão sobre operações humanas em missão.',
    dsLink: 'Coleta de dados, procedimentos operacionais, comunicação e fatores humanos.',
    mission: 'Vostok 6',
    source: 'https://www.nasa.gov/image-article/valentina-tereshkova-first-woman-space/'
  },
  {
    id: 'neil-armstrong', name: 'Neil Armstrong', years: '1930–2012', role: 'Astronauta e comandante', group: 'Pilotagem e decisão', icon: '◐', accent: '#63e6a8',
    contribution: 'Comandou a Apollo 11 e participou de decisões críticas durante a descida e o pouso lunar.',
    dsLink: 'Consciência situacional, interface, contingência, decisão humana e automação supervisionada.',
    mission: 'Gemini 8 e Apollo 11',
    source: 'https://www.nasa.gov/mission/apollo-11/'
  },
  {
    id: 'marcos-pontes', name: 'Marcos Pontes', years: '1963–', role: 'Astronauta brasileiro', group: 'Pesquisa e cooperação', icon: '◆', accent: '#7ee7ff',
    contribution: 'Participou de uma missão à Estação Espacial Internacional, representando o Brasil em uma operação espacial tripulada.',
    dsLink: 'Integração internacional, procedimentos, experimentos, documentação e trabalho em equipe.',
    mission: 'Missão Centenário / ISS',
    source: 'https://www.nasa.gov/wp-content/uploads/2016/01/pontes_marcos.pdf'
  },
  {
    id: 'elon-musk', name: 'Elon Musk', years: '1971–', role: 'Empreendedor e fundador da SpaceX', group: 'Estratégia e produto', icon: '↗', accent: '#ff8e5b',
    contribution: 'É associado à criação e direção estratégica da SpaceX, com foco em redução de custos, reutilização, desenvolvimento iterativo e expansão do acesso ao espaço.',
    dsLink: 'Visão de produto, experimentação, ciclos de versão, análise de falhas e integração entre software, hardware e negócio.',
    mission: 'SpaceX, Falcon, Dragon, Starlink e Starship',
    source: 'https://ir.spacex.com/leadership/'
  },
  {
    id: 'gwynne-shotwell', name: 'Gwynne Shotwell', years: '1963–', role: 'Liderança operacional e empresarial', group: 'Operações e gestão', icon: '◎', accent: '#9ee86f',
    contribution: 'Representa a importância da operação, contratos, execução, relacionamento institucional e transformação de engenharia em serviços espaciais sustentáveis.',
    dsLink: 'Gestão de requisitos, operação, negociação, entrega contínua e coordenação de equipes multidisciplinares.',
    mission: 'Operações e expansão da SpaceX',
    source: 'https://ir.spacex.com/leadership/'
  }

];

export const ROLE_CHALLENGE = [
  { prompt: 'Quem melhor representa validação independente de trajetórias e conferência de cálculos?', answer: 'katherine-johnson' },
  { prompt: 'Quem se conecta diretamente a prioridades, recuperação de erros e software de voo Apollo?', answer: 'margaret-hamilton' },
  { prompt: 'Quem representa integração brasileira em uma missão à estação espacial?', answer: 'marcos-pontes' }
];
