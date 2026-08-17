export const SPACE_LANGUAGES = [
  {
    id: 'assembly', name: 'Assembly didático', icon: '01', accent: '#ffcf5a', layer: 'Baixo nível',
    use: 'Ensinar instruções próximas do processador, memória limitada, registradores e prioridades históricas.',
    fit: 'Computadores embarcados antigos e estudo do Apollo Guidance Computer.',
    caution: 'A plataforma usa uma versão educacional simplificada; sistemas reais possuem arquiteturas e instruções específicas.',
    snippet: 'LOAD TEMP\nCMP LIMIT\nJGT ALARM\nCALL CONTROL'
  },
  {
    id: 'c', name: 'C', icon: 'C', accent: '#55dcff', layer: 'Embarcado e sistemas',
    use: 'Software com controle de recursos, portabilidade e integração próxima ao hardware.',
    fit: 'Frameworks embarcados e aplicações de voo, como partes do ecossistema cFS.',
    caution: 'Escolha comum em sistemas críticos, mas sempre depende da missão, plataforma e processo de certificação.',
    snippet: 'if (temperature > limit) {\n  enter_safe_mode();\n}'
  },
  {
    id: 'cpp', name: 'C++', icon: 'C+', accent: '#8b6cff', layer: 'Componentes e desempenho',
    use: 'Arquiteturas orientadas a componentes, abstrações controladas, filas, threads e alto desempenho.',
    fit: 'F Prime e outros sistemas embarcados e de simulação.',
    caution: 'Recursos da linguagem são usados de forma disciplinada em ambientes restritos.',
    snippet: 'TelemetryPort.send(reading);\nhealth.check(component);'
  },
  {
    id: 'python', name: 'Python', icon: 'Py', accent: '#63e6a8', layer: 'Ciência e automação',
    use: 'Análise de dados, protótipos, automação, aprendizado de máquina, testes e processamento científico.',
    fit: 'Solo, laboratórios, ciência de dados e ferramentas de apoio.',
    caution: 'Nem todo código Python é adequado para controle de tempo real; contexto e hardware importam.',
    snippet: 'anomalies = [x for x in data\n             if x.temp > limit]'
  },
  {
    id: 'typescript', name: 'JavaScript / TypeScript', icon: 'TS', accent: '#7ee7ff', layer: 'Web e visualização',
    use: 'Interfaces, dashboards, simuladores web, visualização 3D e experiências educacionais no navegador.',
    fit: 'O próprio COSMOS DS, painéis de telemetria e integração com APIs.',
    caution: 'É a linguagem da plataforma web, não uma afirmação sobre todo software de voo.',
    snippet: 'bus.on("telemetry", packet =>\n  dashboard.update(packet));'
  },
  {
    id: 'sql', name: 'SQL', icon: 'DB', accent: '#ff7eaa', layer: 'Dados e evidências',
    use: 'Consultar séries históricas, amostras, inventários, missões, usuários e registros de telemetria.',
    fit: 'Sistemas de solo, análise científica e gestão de operações.',
    caution: 'Bancos e dialetos variam; a modelagem dos dados é tão importante quanto a consulta.',
    snippet: 'SELECT sensor, MAX(value)\nFROM telemetry\nGROUP BY sensor;'
  }
];

export const LANGUAGE_SCENARIOS = [
  { id: 'web-dashboard', prompt: 'Construir um dashboard 3D responsivo que roda no navegador.', answer: 'typescript', explanation: 'JavaScript/TypeScript integra interface, eventos, WebGL e APIs no navegador.' },
  { id: 'flight-component', prompt: 'Criar um componente embarcado com filas, portas e desempenho previsível.', answer: 'cpp', explanation: 'C++ aparece em frameworks de componentes como F Prime.' },
  { id: 'science-analysis', prompt: 'Analisar milhares de amostras e testar rapidamente um modelo científico.', answer: 'python', explanation: 'Python é adequado para análise, automação e prototipação científica.' },
  { id: 'historical-memory', prompt: 'Compreender registradores, instruções e memória muito limitada de um computador histórico.', answer: 'assembly', explanation: 'Assembly didático aproxima o aluno do funcionamento do processador.' },
  { id: 'mission-records', prompt: 'Consultar o maior valor de cada sensor em um histórico de telemetria.', answer: 'sql', explanation: 'SQL organiza e consulta dados persistidos.' }
];
