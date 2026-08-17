export const careers = [
  {
    id: 'soc', title: 'Analista de SOC', icon: '◉', level: 'Entrada / Júnior',
    mission: 'Monitorar alertas, correlacionar eventos, classificar incidentes e apoiar contenção.',
    skills: ['Redes', 'Logs e SIEM', 'Windows/Linux', 'Resposta a incidentes', 'Comunicação'],
    route: 'ADS, Sistemas de Informação, Redes, Ciência da Computação ou curso técnico + laboratórios práticos.',
  },
  {
    id: 'pentest', title: 'Pentester Ético', icon: '⚑', level: 'Júnior a Sênior',
    mission: 'Testar controles dentro de escopo autorizado, documentar evidências e recomendar correções.',
    skills: ['Web', 'Redes', 'Linux', 'Scripts', 'Relatórios técnicos', 'Ética e escopo'],
    route: 'Base forte em redes e programação, CTFs legais, laboratórios isolados e certificações práticas.',
  },
  {
    id: 'appsec', title: 'Especialista AppSec', icon: '⌘', level: 'Pleno / Sênior',
    mission: 'Integrar segurança ao desenvolvimento, revisar código, modelar ameaças e apoiar correções.',
    skills: ['Programação', 'OWASP', 'DevSecOps', 'Threat modeling', 'APIs', 'Cloud'],
    route: 'Engenharia de Software, ADS, Ciência da Computação ou experiência como desenvolvedor com especialização em segurança.',
  },
  {
    id: 'dfir', title: 'Forense e Resposta a Incidentes', icon: '⌕', level: 'Pleno / Sênior',
    mission: 'Preservar evidências, construir linhas do tempo, investigar causas e apoiar recuperação.',
    skills: ['Forense', 'Sistemas operacionais', 'Memória e disco', 'Logs', 'Cadeia de custódia'],
    route: 'Computação, Segurança da Informação, Redes ou Sistemas de Informação com estudos em investigação digital.',
  },
  {
    id: 'cloud', title: 'Engenharia de Segurança em Cloud', icon: '☁', level: 'Pleno / Sênior',
    mission: 'Proteger identidades, workloads, redes, segredos, pipelines e postura de nuvem.',
    skills: ['IAM', 'Cloud', 'Containers', 'Infraestrutura como código', 'Observabilidade'],
    route: 'Computação/infraestrutura + fundamentos de uma nuvem pública e automação segura.',
  },
  {
    id: 'grc', title: 'GRC, Riscos e Privacidade', icon: '§', level: 'Entrada a Sênior',
    mission: 'Mapear riscos, políticas, controles, auditorias, continuidade e requisitos de privacidade.',
    skills: ['Gestão de riscos', 'LGPD', 'ISO 27001', 'Políticas', 'Auditoria', 'Comunicação'],
    route: 'Tecnologia, Administração, Direito ou áreas correlatas com especialização em governança e segurança.',
  },
  {
    id: 'threat', title: 'Threat Intelligence', icon: '◇', level: 'Pleno / Sênior',
    mission: 'Transformar sinais e fontes em inteligência útil para defesa e tomada de decisão.',
    skills: ['Pesquisa', 'Análise', 'Indicadores', 'Contexto geopolítico', 'Redação'],
    route: 'Computação, segurança, análise de dados ou inteligência com prática em investigação de fontes autorizadas.',
  },
  {
    id: 'security-engineer', title: 'Engenheiro(a) de Segurança', icon: '⚙', level: 'Pleno / Sênior',
    mission: 'Projetar e automatizar controles de identidade, rede, endpoints, dados e detecção.',
    skills: ['Arquitetura', 'Automação', 'Redes', 'Cloud', 'Endpoints', 'Criptografia'],
    route: 'Engenharia, Computação, Redes ou Sistemas de Informação com experiência prática em infraestrutura e software.',
  },
];

export const educationPaths = [
  { title: 'Curso técnico', text: 'Boa porta de entrada para infraestrutura, redes, desenvolvimento e suporte. Combine com laboratórios e portfólio.' },
  { title: 'Tecnólogo', text: 'ADS, Redes de Computadores, Segurança da Informação, Defesa Cibernética e áreas próximas oferecem formação aplicada.' },
  { title: 'Bacharelado', text: 'Sistemas de Informação, Ciência da Computação, Engenharia de Software e Engenharia da Computação ampliam fundamentos.' },
  { title: 'Pós-graduação', text: 'Pode aprofundar segurança ofensiva ética, defesa, forense, cloud, gestão de riscos, privacidade ou segurança de software.' },
];

export const hiringSectors = [
  { icon: '▣', title: 'Bancos e fintechs', text: 'Fraude, identidade, proteção de dados, aplicações, cloud e resposta a incidentes.' },
  { icon: '⌂', title: 'Governo e serviços públicos', text: 'Continuidade, proteção de cidadãos, infraestrutura crítica, conformidade e operações de segurança.' },
  { icon: '☁', title: 'Tecnologia e cloud', text: 'AppSec, DevSecOps, produtos, plataformas, identidade e segurança de infraestrutura.' },
  { icon: '◫', title: 'Consultorias e MSSPs', text: 'SOC, testes autorizados, auditoria, implantação de controles e atendimento a múltiplos clientes.' },
  { icon: '+', title: 'Saúde e educação', text: 'Dados sensíveis, privacidade, disponibilidade, dispositivos e conscientização.' },
  { icon: '◇', title: 'Varejo, indústria e logística', text: 'E-commerce, pagamentos, OT/IoT, fornecedores, continuidade e prevenção de perdas.' },
];
