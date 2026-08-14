const camera=(id,name,icon,opts={})=>({
  id,name,icon,
  sensor:opts.sensor||'CMOS',sensorWidthMm:opts.sensorWidthMm||6.4,sensorHeightMm:opts.sensorHeightMm||4.8,
  megapixels:opts.megapixels||2,pixelSizeUm:opts.pixelSizeUm||3.75,maxFps:opts.maxFps||30,
  cooled:Boolean(opts.cooled),mono:Boolean(opts.mono),bitDepth:opts.bitDepth||12,readNoiseE:opts.readNoiseE||2.4,
  idealFor:opts.idealFor||[],strengths:opts.strengths||[],limits:opts.limits||[],color:opts.color||'#69e5ff'
});

export const ASTRO_CAMERAS=[
  camera('smartphone','Celular acoplado','▣',{sensor:'CMOS móvel',sensorWidthMm:5.8,sensorHeightMm:4.3,megapixels:12,pixelSizeUm:1.4,maxFps:60,bitDepth:10,readNoiseE:4.2,idealFor:['moon','jupiter','saturn'],strengths:['Acessível','Vídeo rápido','Boa introdução'],limits:['Compressão automática','Sensor pequeno','Controle limitado'],color:'#7bdff2'}),
  camera('planetary-color','Câmera planetária colorida','◉',{sensorWidthMm:6.4,sensorHeightMm:4.8,megapixels:2.1,pixelSizeUm:2.9,maxFps:140,bitDepth:12,readNoiseE:1.5,idealFor:['moon','jupiter','saturn','mars'],strengths:['Alta taxa de quadros','Baixo ruído de leitura','Controle manual'],limits:['Campo pequeno','Não é ideal para objetos extensos'],color:'#ffca70'}),
  camera('deep-sky-color','Câmera refrigerada colorida','⬢',{sensorWidthMm:17.7,sensorHeightMm:13.4,megapixels:16,pixelSizeUm:3.8,maxFps:20,cooled:true,bitDepth:14,readNoiseE:1.3,idealFor:['orion-nebula','andromeda','pleiades'],strengths:['Refrigeração','Campo amplo','Captura de céu profundo'],limits:['Sessões longas','Exige rastreamento estável'],color:'#9d8cff'}),
  camera('deep-sky-mono','Câmera refrigerada monocromática','◈',{sensorWidthMm:19.1,sensorHeightMm:13,pixelSizeUm:3.76,megapixels:20,maxFps:18,cooled:true,mono:true,bitDepth:16,readNoiseE:1.1,idealFor:['orion-nebula','andromeda','pleiades'],strengths:['Alta sensibilidade','Filtros científicos','Controle de canais'],limits:['Fluxo de trabalho mais complexo','Necessita roda de filtros'],color:'#75f0bd'})
];
export const ASTRO_CAMERA_BY_ID=Object.fromEntries(ASTRO_CAMERAS.map(item=>[item.id,item]));

const target=(id,name,kind,icon,opts={})=>({
  id,name,kind,icon,brightness:opts.brightness??.7,detail:opts.detail??.7,
  recommendedPreset:opts.recommendedPreset||'planetary',minimumFrames:opts.minimumFrames||100,
  focalHint:opts.focalHint||'Média',exposureHint:opts.exposureHint||'Curta',filters:opts.filters||['L'],
  features:opts.features||[],description:opts.description||'',color:opts.color||'#dff8ff'
});
export const ASTRO_TARGETS=[
  target('moon','Lua','lunar','◐',{brightness:1,detail:1,recommendedPreset:'lunar',minimumFrames:80,focalHint:'Média a longa',exposureHint:'1–15 ms',filters:['L','R'],features:['crateras','mares','terminador'],description:'Captura rápida e mosaicos com grande contraste.',color:'#e7edf2'}),
  target('jupiter','Júpiter','planetary','♃',{brightness:.94,detail:.9,recommendedPreset:'planetary',minimumFrames:1500,focalHint:'Longa',exposureHint:'3–12 ms',filters:['RGB','IR-cut'],features:['faixas','Grande Mancha Vermelha','luas'],description:'Vídeo de alta velocidade e seleção dos melhores quadros.',color:'#ddb68d'}),
  target('saturn','Saturno','planetary','♄',{brightness:.8,detail:.92,recommendedPreset:'planetary',minimumFrames:1800,focalHint:'Longa',exposureHint:'8–25 ms',filters:['RGB','IR-cut'],features:['anéis','divisão didática','Titã'],description:'Exige foco preciso e boa estabilidade atmosférica.',color:'#e9d29e'}),
  target('mars','Marte','planetary','♂',{brightness:.72,detail:.7,recommendedPreset:'planetary',minimumFrames:1400,focalHint:'Longa',exposureHint:'4–18 ms',filters:['RGB','R'],features:['disco','calota didática','albedo'],description:'Pequeno no sensor; depende de escala e condições favoráveis.',color:'#d77150'}),
  target('orion-nebula','Nebulosa de Órion','deep-sky','☁',{brightness:.62,detail:.88,recommendedPreset:'deep-sky',minimumFrames:30,focalHint:'Curta a média',exposureHint:'30–180 s',filters:['RGB','Hα','OIII'],features:['Trapézio','gás ionizado','regiões tênues'],description:'Combina exposições curtas e longas para preservar o núcleo.',color:'#78d5c9'}),
  target('andromeda','Galáxia de Andrômeda','deep-sky','⌁',{brightness:.5,detail:.72,recommendedPreset:'deep-sky',minimumFrames:40,focalHint:'Curta',exposureHint:'60–240 s',filters:['RGB','L'],features:['núcleo','disco','galáxias satélites'],description:'Objeto extenso; enquadramento e céu escuro são essenciais.',color:'#c8b0ff'})
];
export const ASTRO_TARGET_BY_ID=Object.fromEntries(ASTRO_TARGETS.map(item=>[item.id,item]));

export const ASTRO_CAPTURE_PRESETS=[
  {id:'lunar',name:'Lunar e mosaico',icon:'◐',mode:'video',exposureMs:8,gain:45,frames:500,subSeconds:0,dither:false,coolingC:0,qualityKeep:35,description:'Vídeo curto com regiões sobrepostas para formar mosaico.'},
  {id:'planetary',name:'Planetária rápida',icon:'◎',mode:'video',exposureMs:10,gain:62,frames:2200,subSeconds:0,dither:false,coolingC:0,qualityKeep:25,description:'Muitos quadros curtos para congelar a turbulência.'},
  {id:'deep-sky',name:'Céu profundo RGB',icon:'✦',mode:'sequence',exposureMs:0,gain:38,frames:45,subSeconds:120,dither:true,coolingC:-10,qualityKeep:80,description:'Sequência longa com rastreamento, dithering e calibração.'},
  {id:'narrowband',name:'Céu profundo em filtros',icon:'λ',mode:'sequence',exposureMs:0,gain:45,frames:36,subSeconds:180,dither:true,coolingC:-15,qualityKeep:85,description:'Captura monocromática em canais Hα/OIII/SII para composição científica.'}
];
export const ASTRO_PRESET_BY_ID=Object.fromEntries(ASTRO_CAPTURE_PRESETS.map(item=>[item.id,item]));

export const ASTRO_SESSION_CONDITIONS=[
  {id:'excellent',name:'Noite estável e escura',seeing:.88,transparency:.92,tracking:.93,skyGlow:.12,clouds:.02,description:'Condição ideal para detalhes finos e exposições longas.'},
  {id:'suburban',name:'Céu suburbano',seeing:.67,transparency:.62,tracking:.82,skyGlow:.48,clouds:.08,description:'Gradiente de fundo e contraste reduzido em céu profundo.'},
  {id:'turbulent',name:'Atmosfera turbulenta',seeing:.35,transparency:.78,tracking:.86,skyGlow:.22,clouds:.12,description:'Quadros planetários variam muito; seleção se torna essencial.'},
  {id:'tracking-error',name:'Rastreamento impreciso',seeing:.72,transparency:.8,tracking:.45,skyGlow:.2,clouds:.05,description:'Estrelas alongadas em exposições longas e alinhamento mais difícil.'}
];
export const ASTRO_CONDITION_BY_ID=Object.fromEntries(ASTRO_SESSION_CONDITIONS.map(item=>[item.id,item]));

export const ASTRO_CALIBRATION_FRAMES=[
  {id:'bias',name:'Bias',icon:'B',minimum:20,purpose:'Mede o sinal eletrônico de leitura com exposição mínima e sensor protegido.'},
  {id:'dark',name:'Dark',icon:'D',minimum:10,purpose:'Registra ruído térmico e pixels quentes com mesma exposição e temperatura das imagens.'},
  {id:'flat',name:'Flat',icon:'F',minimum:10,purpose:'Corrige vinheta, poeira e diferenças de resposta do conjunto óptico.'}
];
export const ASTRO_CALIBRATION_BY_ID=Object.fromEntries(ASTRO_CALIBRATION_FRAMES.map(item=>[item.id,item]));

export const ASTRO_STACK_METHODS=[
  {id:'average',name:'Média',description:'Combina todos os quadros e melhora a relação sinal/ruído.'},
  {id:'median',name:'Mediana',description:'Resiste melhor a valores extremos, mas pode reter menos sinal fraco.'},
  {id:'sigma',name:'Rejeição sigma',description:'Remove valores discrepantes após estimar a distribuição dos pixels.'}
];
export const ASTRO_STACK_BY_ID=Object.fromEntries(ASTRO_STACK_METHODS.map(item=>[item.id,item]));

export const ASTRO_PALETTES=[
  {id:'natural',name:'Cor natural',channels:['R','G','B'],colors:['#ff786b','#75e6a0','#6ba9ff'],description:'Equilíbrio de cor visual ou RGB.'},
  {id:'luminance',name:'Luminância',channels:['L'],colors:['#eff7ff'],description:'Representação monocromática para estrutura e contraste.'},
  {id:'hoo',name:'HOO didática',channels:['Hα','OIII','OIII'],colors:['#ff5b62','#55d6d8','#4b8cff'],description:'Mapeia hidrogênio e oxigênio em uma composição de falso colorido.'},
  {id:'sho',name:'SHO didática',channels:['SII','Hα','OIII'],colors:['#ffbb55','#72dc74','#5c8dff'],description:'Paleta científica de três canais para separar emissões.'}
];
export const ASTRO_PALETTE_BY_ID=Object.fromEntries(ASTRO_PALETTES.map(item=>[item.id,item]));

export const ASTROPHOTOGRAPHY_MODES=[
  {id:'planner',label:'Planejar',icon:'⌖'},
  {id:'capture',label:'Capturar',icon:'◉'},
  {id:'calibration',label:'Calibrar',icon:'▦'},
  {id:'stack',label:'Empilhar',icon:'▥'},
  {id:'process',label:'Processar',icon:'◈'},
  {id:'notebook',label:'Caderno',icon:'✓'}
];

export const ASTROPHOTOGRAPHY_GOALS=[
  {id:'plan',label:'Planejar uma sessão compatível',xp:160},
  {id:'capture',label:'Capturar uma sequência',xp:220},
  {id:'calibrate',label:'Criar e aplicar calibração',xp:200},
  {id:'stack',label:'Alinhar e empilhar quadros',xp:240},
  {id:'process',label:'Processar e comparar resultado',xp:260},
  {id:'export',label:'Exportar caderno e evidência',xp:160}
];

export const ASTROPHOTOGRAPHY_SAFETY=[
  'A simulação usa parâmetros didáticos; equipamentos reais exigem manual, supervisão e procedimentos próprios.',
  'Nunca fotografe o Sol através de telescópio ou lente sem filtro solar certificado instalado corretamente na abertura frontal.'
];

export const ASTRO_OPTICAL_SETUPS=[
  {id:'refractor-70',name:'Refrator 70/700',apertureMm:70,focalLengthMm:700,fRatio:10,tracking:'altaz',idealFor:['moon','jupiter','saturn']},
  {id:'newtonian-130',name:'Newtoniano 130/650',apertureMm:130,focalLengthMm:650,fRatio:5,tracking:'equatorial',idealFor:['moon','jupiter','orion-nebula','andromeda']},
  {id:'sct-150',name:'Schmidt-Cassegrain 150/1500',apertureMm:150,focalLengthMm:1500,fRatio:10,tracking:'goto',idealFor:['moon','jupiter','saturn','mars']},
  {id:'smart-80',name:'Telescópio inteligente 80/400',apertureMm:80,focalLengthMm:400,fRatio:5,tracking:'goto',idealFor:['orion-nebula','andromeda']}
];
export const ASTRO_OPTICAL_BY_ID=Object.fromEntries(ASTRO_OPTICAL_SETUPS.map(item=>[item.id,item]));
