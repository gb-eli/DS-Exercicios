const STORAGE_KEY='agv:museu-hardware:progress:v1';
const SETTINGS_STORAGE_KEY='agv:museu-hardware:settings:v1';

const ITEMS=Object.freeze({
  museu_hardware_agv_galeria_origens:Object.freeze({
    title:'Mainframes e computação institucional',short:'Grandes computadores que ocupavam salas inteiras e processavam dados em lote.',
    period:'1940–1970',generation:'Pré-microcomputador',cpu:'Arquiteturas discretas, válvulas e depois transistores',gpu:'Não aplicável',memory:'Memória de linhas de atraso, tambores magnéticos e núcleos de ferrite',media:'Cartões perfurados, fita de papel e fita magnética',
    facts:['O processamento era caro e centralizado.','Terminais e interfaces interativas surgiram gradualmente.','Miniaturização e circuitos integrados abriram caminho para o computador pessoal.'],
    accessibility:'Esta ala apresenta gabinetes grandes com painéis de luzes e uma tela simulando um terminal textual.',
    quiz:Object.freeze({question:'Qual tecnologia ajudou a reduzir o tamanho dos computadores antes dos microprocessadores?',options:['Transistores','Blu-ray','Wi-Fi','Ray tracing'],answer:0,explanation:'Os transistores substituíram válvulas em muitas máquinas e permitiram equipamentos menores, mais confiáveis e eficientes.'})
  }),
  museu_hardware_agv_galeria_home:Object.freeze({
    title:'Microcomputadores domésticos',short:'O computador deixa centros de processamento e começa a chegar a casas, escolas e pequenos negócios.',
    period:'1970–1984',generation:'Primeiros microcomputadores',cpu:'Microprocessadores de 8 bits e início dos 16 bits',gpu:'Circuitos de vídeo simples ou chips dedicados básicos',memory:'De poucos KB a centenas de KB',media:'Fita cassete, disquete e cartucho em alguns sistemas',
    facts:['Teclado e monitor tornam a interação mais direta.','BASIC popularizou a programação para iniciantes.','Jogos e aplicativos domésticos crescem junto com a distribuição em mídia removível.'],
    accessibility:'A exposição mostra um microcomputador com teclado integrado e uma tela reproduzindo uma interface simples de época.',
    quiz:Object.freeze({question:'Qual linguagem ficou fortemente associada ao aprendizado em muitos microcomputadores?',options:['BASIC','Rust','Swift','Kotlin'],answer:0,explanation:'BASIC foi amplamente disponibilizada em microcomputadores e usada para ensinar programação.'})
  }),
  museu_hardware_agv_galeria_console:Object.freeze({
    title:'Primeiros consoles domésticos',short:'Videogames dedicados conectados à televisão transformam a sala em espaço de jogo.',
    period:'1972–1984',generation:'1ª e 2ª gerações de consoles',cpu:'Lógica discreta e processadores simples de 8 bits',gpu:'Geradores de vídeo e circuitos gráficos simples',memory:'Muito limitada, frequentemente medida em bytes ou poucos KB',media:'Jogos embutidos e cartuchos',
    facts:['Controles simples priorizavam acesso imediato.','A televisão era o principal display.','Cartuchos ajudaram a separar hardware e biblioteca de jogos.'],
    accessibility:'A peça tem formato de console baixo com controles laterais e uma tela exibindo um jogo de raquetes.',
    quiz:Object.freeze({question:'O que tornou possível trocar jogos sem trocar o console inteiro?',options:['Cartuchos removíveis','Mouse óptico','SSD NVMe','Bluetooth'],answer:0,explanation:'Cartuchos removíveis permitiram distribuir jogos separados do hardware principal.'})
  }),
  museu_hardware_agv_galeria_8bit:Object.freeze({
    title:'Era dos 8 bits',short:'Consoles de cartucho e computadores de 8 bits consolidam personagens, gêneros e padrões de controle.',
    period:'1983–1992',generation:'3ª geração de consoles',cpu:'CPUs de 8 bits em frequências de poucos MHz',gpu:'PPUs e chips gráficos dedicados a tiles/sprites',memory:'KB de RAM e memória de vídeo',media:'Cartucho ROM',
    facts:['Tiles e sprites permitiam gráficos eficientes.','Trilhas sonoras usavam canais de áudio sintetizado.','A limitação de memória influenciou fortemente o design dos jogos.'],
    accessibility:'A exposição mostra um console de cartucho sobre pedestal e uma tela com plataforma 2D colorida.',
    quiz:Object.freeze({question:'Qual técnica gráfica era comum para montar cenários em consoles de 8 bits?',options:['Tiles','Path tracing','Fotogrametria','Volumetria neural'],answer:0,explanation:'Tiles reutilizavam pequenos blocos gráficos para formar cenários com pouca memória.'})
  }),
  museu_hardware_agv_galeria_16_32:Object.freeze({
    title:'16/32 bits e transição para o 3D',short:'Mais memória, áudio digital e mídias ópticas ampliam mundos, animações e experiências 3D.',
    period:'1988–2001',generation:'4ª e 5ª gerações',cpu:'16/32 bits, dezenas de MHz',gpu:'Chips 2D avançados e primeiros aceleradores 3D dedicados',memory:'Centenas de KB a alguns MB',media:'Cartucho e CD-ROM',
    facts:['CD-ROM aumentou muito a capacidade de armazenamento.','Polígonos substituem sprites em muitos gêneros.','Áudio digital e cenas pré-renderizadas se tornam mais frequentes.'],
    accessibility:'A peça é um console baixo com unidade de disco e a tela simula um jogo de luta de transição 2D/3D.',
    quiz:Object.freeze({question:'Qual mídia ampliou muito a capacidade de armazenamento nessa transição?',options:['CD-ROM','Cartão perfurado','Fita VHS como padrão','Papel térmico'],answer:0,explanation:'CD-ROM ofereceu muito mais espaço que cartuchos típicos da época.'})
  }),
  museu_hardware_agv_galeria_arcade:Object.freeze({
    title:'Arcades e fliperamas',short:'Máquinas dedicadas combinam hardware, gabinete, tela, som e controles em uma experiência social.',
    period:'1970–2000',generation:'Arcade clássico',cpu:'Variável por placa; 8, 16 e 32 bits ao longo das décadas',gpu:'Hardware dedicado por sistema/placa',memory:'De KB a dezenas de MB conforme a época',media:'ROMs, placas proprietárias e posteriormente discos',
    facts:['O gabinete fazia parte da experiência.','Arcades frequentemente recebiam hardware mais poderoso antes dos consoles domésticos.','Placares e partidas locais incentivavam competição social.'],
    accessibility:'Um gabinete alto com monitor inclinado, joystick e botões representa os fliperamas.',
    quiz:Object.freeze({question:'O que diferencia um arcade clássico de um console doméstico?',options:['Gabinete e hardware dedicados ao local de jogo','Sempre usa controle sem fio','Precisa de internet','Não possui tela'],answer:0,explanation:'O arcade integra gabinete, display, controles e hardware em uma máquina instalada no espaço público.'})
  }),
  museu_hardware_agv_galeria_portateis:Object.freeze({
    title:'Videogames portáteis',short:'Bateria, tela integrada e controles compactos levam jogos para fora da sala.',
    period:'1989–Atual',generation:'Portáteis dedicados e híbridos',cpu:'De 8 bits a SoCs multicore modernos',gpu:'De controladores 2D simples a GPUs integradas modernas',memory:'De KB a vários GB',media:'Cartucho, disco proprietário, cartão e distribuição digital',
    facts:['Eficiência energética é essencial.','Telas evoluíram de monocromáticas para LCD/OLED coloridas.','Portáteis modernos podem compartilhar bibliotecas com consoles e PCs.'],
    accessibility:'A peça é um aparelho pequeno segurável com tela central, direcional e botões.',
    quiz:Object.freeze({question:'Qual característica é central no projeto de um console portátil?',options:['Eficiência energética','Gabinete de dois metros','Alimentação trifásica','Ausência de tela'],answer:0,explanation:'Como depende de bateria, eficiência energética influencia desempenho, autonomia e temperatura.'})
  }),
  museu_hardware_agv_galeria_pc:Object.freeze({
    title:'Evolução do PC pessoal',short:'Interfaces gráficas, armazenamento local e internet tornam o PC uma plataforma de trabalho, criação e jogos.',
    period:'1981–2009',generation:'PC compatível e desktop gráfico',cpu:'x86 de 16/32 bits, depois 64 bits',gpu:'De adaptadores 2D a aceleradoras 3D dedicadas',memory:'De centenas de KB a vários GB',media:'Disquete, HDD, CD/DVD e USB',
    facts:['Padrões de hardware estimularam upgrades.','A GUI tornou o computador mais acessível a usuários não técnicos.','Internet e jogos 3D aceleraram demanda por placas de vídeo.'],
    accessibility:'A exposição mostra gabinete, monitor e teclado de desktop, com tela simulando janelas e interface gráfica.',
    quiz:Object.freeze({question:'Qual componente ganhou importância com os jogos 3D em PCs?',options:['Placa de vídeo/GPU','Leitor de cartão perfurado','Fax interno obrigatório','Drive de fita como único armazenamento'],answer:0,explanation:'A GPU passou a executar grande parte do trabalho de renderização 3D.'})
  }),
  museu_hardware_agv_galeria_pc_gamer:Object.freeze({
    title:'PC gamer de alto desempenho',short:'CPUs multicore, GPUs poderosas, SSDs e monitores de alta taxa de atualização ampliam desempenho e personalização.',
    period:'2010–Atual',generation:'PC gamer moderno',cpu:'Multicore 64 bits',gpu:'GPUs programáveis com rasterização avançada e ray tracing em gerações recentes',memory:'Tipicamente vários GB a dezenas de GB',media:'SSD SATA/NVMe e distribuição digital',
    facts:['Taxa de quadros e latência viram métricas importantes.','SSDs reduzem tempos de carregamento.','Gabinetes e refrigeração são parte da personalização.'],
    accessibility:'Uma torre vertical com elementos luminosos representa o PC gamer; a tela mostra uma demonstração em primeira pessoa.',
    quiz:Object.freeze({question:'Qual armazenamento é comum em PCs gamer atuais por oferecer baixa latência?',options:['SSD NVMe','Fita cassete','Cartão perfurado','Disquete de 5¼'],answer:0,explanation:'SSDs NVMe usam PCIe e oferecem alta largura de banda e baixa latência.'})
  }),
  museu_hardware_agv_galeria_atual:Object.freeze({
    title:'Geração atual de consoles e ecossistemas',short:'Armazenamento rápido, CPUs multicore, GPUs modernas e serviços conectados aproximam consoles e PCs.',
    period:'2020–Atual',generation:'9ª geração e ecossistemas atuais',cpu:'Multicore 64 bits',gpu:'Arquiteturas modernas com recursos de ray tracing e upscaling',memory:'Memória unificada de alta largura de banda em muitos consoles',media:'SSD interno, mídia óptica em alguns modelos e distribuição digital',
    facts:['SSDs mudaram o design de carregamento e streaming de mundos.','Cross-play e serviços online conectam plataformas.','Acessibilidade e opções de desempenho ganharam mais espaço.'],
    accessibility:'A peça é um console vertical contemporâneo acompanhado por controle; a tela mostra uma aventura 3D genérica.',
    quiz:Object.freeze({question:'Qual componente reduziu significativamente tempos de carregamento na geração atual?',options:['SSD','Fita magnética','Disquete','Cartão perfurado'],answer:0,explanation:'SSDs oferecem acesso muito mais rápido que discos rígidos tradicionais.'})
  })
});

export const MUSEU_HARDWARE_CATALOG=ITEMS;
export const MUSEU_HARDWARE_GUIDED_ORDER=Object.freeze(Object.keys(ITEMS));

function safeParse(raw,fallback){try{const value=JSON.parse(raw);return value&&typeof value==='object'?value:fallback}catch{return fallback}}
export function loadMuseumProgress(){
  let raw=null;try{raw=localStorage.getItem(STORAGE_KEY)}catch{}
  const data=safeParse(raw,{visited:[],quiz:{},tour:{active:false,index:0},updatedAt:null});
  return {visited:new Set(Array.isArray(data.visited)?data.visited:[]),quiz:{...(data.quiz||{})},tour:{active:!!data.tour?.active,index:Number(data.tour?.index)||0},updatedAt:data.updatedAt||null};
}
export function saveMuseumProgress(progress){
  const payload={visited:[...(progress?.visited||[])],quiz:{...(progress?.quiz||{})},tour:{active:!!progress?.tour?.active,index:Math.max(0,Number(progress?.tour?.index)||0)},updatedAt:new Date().toISOString()};
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(payload))}catch{}
  return payload;
}
export function resetMuseumProgress(){try{localStorage.removeItem(STORAGE_KEY)}catch{}return loadMuseumProgress();}
export function museumCatalogItem(id){return ITEMS[id]||null;}
export function museumQuizAnswer(id,choice){const item=museumCatalogItem(id),quiz=item?.quiz;if(!quiz)return null;const selected=Number(choice),correct=selected===quiz.answer;return{galleryId:id,choice:selected,correct,answer:quiz.answer,explanation:quiz.explanation};}
export function museumProgressSnapshot(progress){const total=MUSEU_HARDWARE_GUIDED_ORDER.length,visited=progress?.visited?.size||0,answered=Object.keys(progress?.quiz||{}).length,correct=Object.values(progress?.quiz||{}).filter(Boolean).length;return{visited,total,percent:Math.round(visited/total*100),quizAnswered:answered,quizCorrect:correct,tour:{active:!!progress?.tour?.active,index:Math.max(0,Number(progress?.tour?.index)||0)}};}


export function loadMuseumSettings(){
  let raw=null;try{raw=localStorage.getItem(SETTINGS_STORAGE_KEY)}catch{}
  const data=safeParse(raw,{captions:true,reducedMotion:false,highContrast:false,largeText:false,updatedAt:null});
  return museumSettingsSnapshot(data);
}
export function saveMuseumSettings(settings){
  const payload=museumSettingsSnapshot(settings);
  payload.updatedAt=new Date().toISOString();
  try{localStorage.setItem(SETTINGS_STORAGE_KEY,JSON.stringify(payload))}catch{}
  return payload;
}
export function museumSettingsSnapshot(settings){
  return {captions:settings?.captions!==false,reducedMotion:!!settings?.reducedMotion,highContrast:!!settings?.highContrast,largeText:!!settings?.largeText,updatedAt:settings?.updatedAt||null};
}
