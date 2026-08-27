export const SPACE_TECHNOLOGIES = [
  {id:'embedded',name:'Software embarcado',icon:'µC',category:'computacao',summary:'Código próximo do hardware para ler sensores, controlar atuadores e cumprir prazos previsíveis.',tools:['C','C++','RTOS','testes de hardware'],risks:['tempo real','memória limitada','falha de sensor'],modules:['academy','launch','station']},
  {id:'flight-computer',name:'Computador de voo',icon:'CPU',category:'computacao',summary:'Coordena estados, navegação, comandos, redundância e registro de eventos da missão.',tools:['máquina de estados','watchdog','logs','redundância'],risks:['estado inválido','reinicialização','dados corrompidos'],modules:['mission-control-advanced','launch-remaster']},
  {id:'telemetry',name:'Telemetria',icon:'TX',category:'dados',summary:'Transforma medições em pacotes que podem ser transmitidos, validados, armazenados e analisados.',tools:['JSON','binário','filas','CRC','timestamps'],risks:['pacote perdido','ordem incorreta','latência'],modules:['mission-control','earth']},
  {id:'robotics',name:'Robótica planetária',icon:'RVR',category:'robotica',summary:'Integra sensores, planejamento, motores, visão e autonomia em rovers e drones.',tools:['A*','visão computacional','controle','mapas'],risks:['terreno','atraso de comunicação','energia'],modules:['mars','planetary-remaster']},
  {id:'computer-vision',name:'Visão computacional',icon:'CV',category:'dados',summary:'Extrai padrões de imagens para navegação, ciência, inspeção e classificação.',tools:['Python','matrizes','filtros','classificação'],risks:['ruído','iluminação','falso positivo'],modules:['mars','observatory']},
  {id:'mission-database',name:'Banco de dados científico',icon:'DB',category:'dados',summary:'Organiza telemetria, imagens, amostras, eventos e resultados para consulta posterior.',tools:['SQL','índices','validação','backup'],risks:['duplicidade','metadados incompletos','perda de histórico'],modules:['mars','observatory']},
  {id:'networks',name:'Comunicação espacial',icon:'RF',category:'comunicacao',summary:'Planeja enlace, antena, prioridade e tolerância a atraso entre veículo e centro de controle.',tools:['uplink','downlink','fila','janela de contato'],risks:['atraso','ruído','interrupção'],modules:['earth','station']},
  {id:'simulation',name:'Simulação digital',icon:'SIM',category:'computacao',summary:'Permite testar comportamento, falhas e decisões antes de operar um sistema real.',tools:['JavaScript','TypeScript','WebGL','Workers'],risks:['modelo simplificado','parâmetros incorretos','desempenho'],modules:['physics-controls','cinematic-studio']},
  {id:'cybersecurity',name:'Segurança de sistemas críticos',icon:'SEC',category:'computacao',summary:'Protege comandos, identidades, atualizações, logs e limites de autorização.',tools:['autenticação','assinatura','controle de acesso','auditoria'],risks:['comando indevido','credencial exposta','alteração não autorizada'],modules:['mission-control-advanced','mission-director']},
  {id:'web-interface',name:'Interfaces de missão',icon:'UI',category:'interface',summary:'Transforma dados complexos em painéis legíveis, alertas, controles e evidências.',tools:['HTML','CSS','JavaScript','acessibilidade'],risks:['sobrecarga visual','alerta ambíguo','controle conflitante'],modules:['mission-control','performance-qa']}
];

export const SPACE_LANGUAGES_C2 = [
  {id:'assembly',name:'Assembly',layer:'baixo nível',role:'Rotinas próximas do processador e estudo de instruções, registradores e memória.',strength:'controle explícito',caution:'alta complexidade e baixa portabilidade'},
  {id:'c',name:'C',layer:'embarcado',role:'Drivers, leitura de sensores, controle de recursos e software de tempo previsível.',strength:'desempenho e proximidade do hardware',caution:'exige cuidado com memória'},
  {id:'cpp',name:'C++',layer:'embarcado e simulação',role:'Sistemas complexos, bibliotecas de controle, robótica e simulação de alto desempenho.',strength:'abstração com desempenho',caution:'complexidade deve ser controlada'},
  {id:'python',name:'Python',layer:'ciência e automação',role:'Análise de dados, protótipos, processamento de imagens e automação de testes.',strength:'produtividade e ecossistema',caution:'nem sempre serve para laços críticos'},
  {id:'javascript',name:'JavaScript',layer:'experiência web',role:'Interfaces, painéis, simulações educacionais e visualizações interativas no navegador.',strength:'execução ampla no navegador',caution:'tarefas pesadas precisam ser separadas'},
  {id:'typescript',name:'TypeScript',layer:'aplicações web',role:'Projetos grandes com contratos de dados, módulos e manutenção mais segura.',strength:'tipagem e organização',caution:'a tipagem não substitui validação em execução'},
  {id:'sql',name:'SQL',layer:'dados',role:'Consulta de telemetria, eventos, amostras e histórico de missão.',strength:'consultas e integridade',caution:'modelo e índices precisam ser bem planejados'},
  {id:'java',name:'Java',layer:'serviços',role:'Serviços, ferramentas corporativas, integração e processamento de dados.',strength:'ecossistema maduro',caution:'não é escolha automática para hardware restrito'},
  {id:'fortran',name:'Fortran',layer:'computação científica',role:'Cálculos numéricos e manutenção de códigos científicos históricos.',strength:'computação numérica',caution:'integração moderna exige planejamento'},
  {id:'matlab',name:'MATLAB/Octave',layer:'modelagem',role:'Prototipagem matemática, sinais, controle e análise de sistemas.',strength:'ferramentas de engenharia',caution:'licenciamento e portabilidade variam'}
];

export const SPACE_SENSORS = [
  {id:'accelerometer',name:'Acelerômetro',unit:'m/s²',min:-16,max:16,normal:[-1.2,1.2],use:'Mede aceleração e ajuda a detectar movimento, vibração e mudança de velocidade.',vehicles:['foguete','rover','satélite']},
  {id:'gyroscope',name:'Giroscópio',unit:'°/s',min:-500,max:500,normal:[-8,8],use:'Mede rotação para estimar atitude e estabilizar o veículo.',vehicles:['satélite','cápsula','drone']},
  {id:'magnetometer',name:'Magnetômetro e bússola',unit:'µT',min:-100,max:100,normal:[20,65],use:'Mede campo magnético e fornece referência de orientação quando aplicável.',vehicles:['satélite','rover','drone']},
  {id:'sun-sensor',name:'Sensor solar',unit:'%',min:0,max:100,normal:[55,100],use:'Estima direção e intensidade do Sol para orientação e geração de energia.',vehicles:['satélite','estação']},
  {id:'star-tracker',name:'Rastreador de estrelas',unit:'arcsec',min:0,max:120,normal:[0.2,8],use:'Compara estrelas observadas com um catálogo para determinar orientação.',vehicles:['satélite','telescópio']},
  {id:'thermal',name:'Sensor térmico',unit:'°C',min:-180,max:180,normal:[-20,65],use:'Monitora componentes, cabine, baterias e condições ambientais.',vehicles:['todos']},
  {id:'pressure',name:'Sensor de pressão',unit:'kPa',min:0,max:120,normal:[85,105],use:'Monitora cabine, tanques e linhas de fluido.',vehicles:['cápsula','estação','foguete']},
  {id:'radiation',name:'Dosímetro de radiação',unit:'µSv/h',min:0,max:2000,normal:[0.1,120],use:'Estima exposição de pessoas e componentes à radiação ionizante.',vehicles:['estação','traje','sonda']},
  {id:'altimeter',name:'Radar altímetro',unit:'m',min:0,max:10000,normal:[10,2500],use:'Estima distância até a superfície durante aproximação e pouso.',vehicles:['módulo lunar','drone','sonda']},
  {id:'proximity',name:'Sensor de proximidade',unit:'m',min:0,max:100,normal:[1,35],use:'Apoia acoplamento, desvio de obstáculos e operações robóticas.',vehicles:['estação','rover','braço robótico']},
  {id:'camera',name:'Câmera científica',unit:'SNR',min:0,max:100,normal:[45,92],use:'Registra imagens para navegação, inspeção, ciência e comunicação pública.',vehicles:['rover','satélite','telescópio']},
  {id:'spectrometer',name:'Espectrômetro',unit:'qualidade',min:0,max:100,normal:[60,98],use:'Analisa como a matéria interage com diferentes comprimentos de onda.',vehicles:['rover','sonda','telescópio']}
];

export const DIGITAL_ARCHITECTURE_LAYERS = [
  {id:'environment',order:1,title:'Ambiente e fenômeno',detail:'Movimento, temperatura, luz, pressão, radiação, distância ou imagem.'},
  {id:'sensor',order:2,title:'Sensor',detail:'Converte uma grandeza física em dados digitais ou analógicos.'},
  {id:'embedded',order:3,title:'Software embarcado',detail:'Filtra, valida, converte unidades e executa regras locais.'},
  {id:'flight',order:4,title:'Computador de voo',detail:'Coordena estados, prioridades, autonomia e segurança.'},
  {id:'network',order:5,title:'Comunicação',detail:'Empacota e transmite dados por uma janela de contato.'},
  {id:'control',order:6,title:'Centro de controle',detail:'Recebe, apresenta alertas e permite decisões autorizadas.'},
  {id:'database',order:7,title:'Banco e análise',detail:'Persiste o histórico, permite consultas e produz evidências.'},
  {id:'interface',order:8,title:'Interface e aprendizado',detail:'Transforma dados em painéis, relatórios, desafios e decisões humanas.'}
];

export const TELEMETRY_SCENARIOS = [
  {id:'temp-motor',title:'Temperatura do motor',packet:{sensor:'thermal',value:138,unit:'°C',sequence:41,status:'warning'},expected:'warning',explanation:'O valor permanece no intervalo físico, mas ultrapassa a faixa operacional definida para o exercício.'},
  {id:'gyro-noise',title:'Ruído no giroscópio',packet:{sensor:'gyroscope',value:720,unit:'°/s',sequence:42,status:'ok'},expected:'invalid',explanation:'A leitura ultrapassa o limite configurado do sensor e deve ser rejeitada antes do controle.'},
  {id:'pressure-safe',title:'Pressão da cabine',packet:{sensor:'pressure',value:99.8,unit:'kPa',sequence:43,status:'ok'},expected:'ok',explanation:'Unidade, sequência e faixa são coerentes com o cenário didático.'},
  {id:'packet-gap',title:'Salto de sequência',packet:{sensor:'camera',value:78,unit:'SNR',sequence:49,status:'ok'},previousSequence:45,expected:'warning',explanation:'O pacote é válido, mas há lacuna de sequência que pode indicar perda de dados.'},
  {id:'wrong-unit',title:'Unidade incompatível',packet:{sensor:'altimeter',value:420,unit:'km/h',sequence:50,status:'ok'},expected:'invalid',explanation:'O radar altímetro foi configurado para metros; a unidade recebida não corresponde ao contrato.'}
];

export const TECHNOLOGY_CHALLENGES = [
  {id:'ch1',prompt:'Qual tecnologia é central para ordenar alertas e comandos por importância?',answer:'telemetry',options:['telemetry','computer-vision','web-interface'],explanation:'Telemetria e mensageria lidam com pacotes, prioridade, ordem e histórico.'},
  {id:'ch2',prompt:'Qual linguagem combina melhor com um protótipo de classificação de imagens científicas?',answer:'python',options:['assembly','python','sql'],explanation:'Python é adequado para prototipagem e análise de imagens; depois o sistema pode ser otimizado.'},
  {id:'ch3',prompt:'Qual sensor ajuda a medir a velocidade angular de uma cápsula?',answer:'gyroscope',options:['pressure','gyroscope','spectrometer'],explanation:'O giroscópio mede rotação e apoia a estimativa de atitude.'},
  {id:'ch4',prompt:'Qual camada deve rejeitar rapidamente uma leitura impossível antes de ela chegar ao painel?',answer:'embedded',options:['embedded','interface','database'],explanation:'A validação local no software embarcado reduz decisões baseadas em dados inválidos.'},
  {id:'ch5',prompt:'Qual tecnologia organiza amostras e permite consultas históricas?',answer:'mission-database',options:['robotics','mission-database','networks'],explanation:'O banco científico mantém integridade, metadados e consultas.'},
  {id:'ch6',prompt:'Qual linguagem é adequada para consultas estruturadas de telemetria?',answer:'sql',options:['sql','cpp','javascript'],explanation:'SQL descreve consultas e operações sobre dados organizados.'}
];
