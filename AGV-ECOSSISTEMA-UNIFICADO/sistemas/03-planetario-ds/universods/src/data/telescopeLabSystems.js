const source=(label,url)=>({label,url});

export const TELESCOPE_SOURCES={
  celestronTypes:source('Celestron — Guia de tubos ópticos','https://www.celestron.com/blogs/knowledgebase/the-ultimate-guide-to-celestron-optical-tubes'),
  celestronBeginner:source('Celestron — Como escolher o primeiro telescópio','https://www.celestron.com/pages/how-to-buy-your-first-telescope'),
  nasaSkywatching:source('NASA Science — Skywatching FAQ','https://science.nasa.gov/skywatching/faq/'),
  nasaMoon:source('NASA Science — Moon Viewing Tips','https://science.nasa.gov/moon/viewing-tips/'),
  nasaBinoculars:source('NASA Science — Binóculos como primeiro instrumento','https://science.nasa.gov/solar-system/skywatching/night-sky-network/binoculars-a-great-first-telescope/'),
  nasaJupiter:source('NASA Science — Jupiter','https://science.nasa.gov/jupiter/'),
  marketReference:source('Referência de mercado brasileira consultada em 04/08/2026','https://lista.mercadolivre.com.br/telescopio-dobsoniano-150mm')
};

const telescope=(id,name,type,icon,apertureMm,focalLengthMm,opts={})=>({
  id,name,type,icon,apertureMm,focalLengthMm,fRatio:Number((focalLengthMm/Math.max(1,apertureMm)).toFixed(1)),
  mount:opts.mount||'altaz',band:opts.band||'optical',weightKg:opts.weightKg||0,portability:opts.portability||3,difficulty:opts.difficulty||2,
  priceBandBRL:opts.priceBandBRL||null,priceNote:opts.priceNote||'Faixa didática e variável; consulte data e loja antes de comprar.',
  strengths:opts.strengths||[],limits:opts.limits||[],bestFor:opts.bestFor||[],parts:opts.parts||[],color:opts.color||'#5ee3ff',sourceIds:opts.sourceIds||['celestronTypes','celestronBeginner']
});

export const TELESCOPE_CATALOG=[
  telescope('refractor-70','Refrator 70/700','refractor','↗',70,700,{mount:'altaz',weightKg:4.8,portability:5,difficulty:1,priceBandBRL:[800,1500],color:'#8fd8ff',strengths:['Contraste alto na Lua','Montagem simples','Baixa manutenção'],limits:['Abertura pequena','Aberração cromática em modelos simples'],bestFor:['moon','jupiter','saturn','double-star'],parts:['tripod','mount','tube','finder','eyepiece']}),
  telescope('newtonian-130','Refletor Newtoniano 130/650','newtonian','◈',130,650,{mount:'equatorial',weightKg:9.2,portability:3,difficulty:2,priceBandBRL:[2000,3500],color:'#72efc3',strengths:['Boa abertura por custo','Campo amplo','Nebulosas e aglomerados'],limits:['Exige colimação','Tubo mais volumoso'],bestFor:['moon','jupiter','saturn','pleiades','orion-nebula','andromeda'],parts:['tripod','mount','tube','finder','eyepiece','counterweight']}),
  telescope('dobsonian-150','Dobsoniano 150/1200','dobsonian','⬡',150,1200,{mount:'dobsonian',weightKg:16,portability:2,difficulty:2,priceBandBRL:[3000,5500],color:'#ffcb68',strengths:['Grande coleta de luz','Base estável','Excelente para céu profundo'],limits:['Transporte volumoso','Rastreamento manual'],bestFor:['moon','jupiter','saturn','orion-nebula','andromeda','pleiades'],parts:['base','tube','finder','eyepiece']}),
  telescope('maksutov-127','Maksutov-Cassegrain 127/1500','catadioptric','◎',127,1500,{mount:'goto',weightKg:8.1,portability:4,difficulty:2,priceBandBRL:[6000,14000],color:'#c7a4ff',strengths:['Tubo compacto','Alto contraste planetário','Longa distância focal'],limits:['Campo estreito','Resfriamento mais lento'],bestFor:['moon','jupiter','saturn','mars','double-star'],parts:['tripod','mount','tube','finder','diagonal','eyepiece']}),
  telescope('sct-150','Schmidt-Cassegrain 150/1500','catadioptric','◉',150,1500,{mount:'goto',weightKg:11.5,portability:3,difficulty:3,priceBandBRL:[8500,18000],color:'#ff9cb8',strengths:['Versátil','Compacto para a abertura','Rastreamento computadorizado'],limits:['Custo elevado','Configuração e energia adicionais'],bestFor:['moon','jupiter','saturn','mars','orion-nebula','double-star'],parts:['tripod','mount','tube','finder','diagonal','eyepiece','controller']}),
  telescope('smart-80','Telescópio inteligente 80 mm','smart','▣',80,400,{mount:'goto',weightKg:5,portability:5,difficulty:1,priceBandBRL:[5000,12000],color:'#66f0df',strengths:['Empilhamento automático','Controle por aplicativo','Fácil registro digital'],limits:['Experiência dependente de software','Menos aprendizagem manual de alinhamento'],bestFor:['moon','orion-nebula','andromeda','pleiades'],parts:['tripod','smart-tube','controller']}),
  telescope('radio-dish','Radiotelescópio didático','radio','⌁',3000,1,{mount:'altaz',band:'radio',weightKg:0,portability:1,difficulty:4,priceBandBRL:null,priceNote:'Equipamento institucional; não tratado como produto de varejo.',color:'#ffbd73',strengths:['Observa comprimentos de onda de rádio','Opera com nuvens leves','Relaciona antena, RF e processamento'],limits:['Não produz imagem óptica direta','Requer eletrônica e análise de sinais'],bestFor:['hydrogen-line','radio-jupiter'],parts:['dish','feed','receiver','computer'],sourceIds:['nasaSkywatching']})
];
export const TELESCOPE_BY_ID=Object.fromEntries(TELESCOPE_CATALOG.map(item=>[item.id,item]));

export const TELESCOPE_MOUNTS=[
  {id:'altaz',name:'Altazimutal',icon:'┼',description:'Movimento simples em altura e azimute; adequada para iniciação visual.',alignmentStars:0},
  {id:'equatorial',name:'Equatorial',icon:'⌖',description:'Alinha um eixo ao polo celeste e facilita acompanhar a rotação aparente do céu.',alignmentStars:1},
  {id:'dobsonian',name:'Dobsoniana',icon:'⬡',description:'Base altazimutal robusta e manual, comum em refletores de maior abertura.',alignmentStars:0},
  {id:'goto',name:'GoTo computadorizada',icon:'◎',description:'Usa motores e alinhamento por estrelas para localizar e acompanhar alvos.',alignmentStars:2}
];

export const TELESCOPE_EYEPIECES=[
  {id:'ep-25',name:'Ocular 25 mm',focalMm:25,apparentFov:52,use:'Campo amplo e localização'},
  {id:'ep-15',name:'Ocular 15 mm',focalMm:15,apparentFov:60,use:'Visão intermediária'},
  {id:'ep-10',name:'Ocular 10 mm',focalMm:10,apparentFov:52,use:'Planetas e Lua'},
  {id:'ep-6',name:'Ocular 6 mm',focalMm:6,apparentFov:58,use:'Alta ampliação quando o céu permite'}
];
export const EYEPIECE_BY_ID=Object.fromEntries(TELESCOPE_EYEPIECES.map(item=>[item.id,item]));

export const TELESCOPE_FILTERS=[
  {id:'none',name:'Sem filtro',icon:'○',transmission:1,targets:['moon','jupiter','saturn','mars','pleiades','orion-nebula','andromeda','double-star'],effect:'Imagem natural.'},
  {id:'moon',name:'Filtro lunar',icon:'◐',transmission:.45,targets:['moon'],effect:'Reduz brilho e melhora conforto na observação lunar.'},
  {id:'uhc',name:'UHC',icon:'U',transmission:.7,targets:['orion-nebula'],effect:'Aumenta contraste de nebulosas de emissão em céu urbano ou suburbano.'},
  {id:'oiii',name:'OIII',icon:'O',transmission:.55,targets:['orion-nebula'],effect:'Realça linhas de oxigênio ionizado em nebulosas compatíveis.'},
  {id:'red',name:'Vermelho suave',icon:'R',transmission:.72,targets:['mars','jupiter'],effect:'Pode destacar contraste em detalhes planetários de forma didática.'},
  {id:'neutral',name:'Densidade neutra',icon:'N',transmission:.65,targets:['moon','jupiter'],effect:'Reduz intensidade sem mudar fortemente a cor.'}
];
export const FILTER_BY_ID=Object.fromEntries(TELESCOPE_FILTERS.map(item=>[item.id,item]));

const target=(id,name,kind,icon,opts={})=>({id,name,kind,icon,band:opts.band||'optical',brightness:opts.brightness??.7,detail:opts.detail??.6,angularSizeArcsec:opts.angularSizeArcsec||60,features:opts.features||[],description:opts.description||'',recommendedFilters:opts.recommendedFilters||['none'],minimumApertureMm:opts.minimumApertureMm??50,sourceId:opts.sourceId||'nasaSkywatching',color:opts.color||'#dff7ff'});
export const TELESCOPE_TARGETS=[
  target('moon','Lua','moon','◐',{brightness:1,detail:1,angularSizeArcsec:1860,features:['crateras','mares','terminador'],description:'O alvo mais acessível para aprender foco, contraste e escala.',recommendedFilters:['moon','neutral','none'],sourceId:'nasaMoon',color:'#e8ecf2'}),
  target('jupiter','Júpiter','planet','♃',{brightness:.95,detail:.82,angularSizeArcsec:45,features:['faixas','Grande Mancha Vermelha','luas galileanas'],description:'Pequeno telescópio pode revelar luas e faixas principais.',recommendedFilters:['none','red','neutral'],sourceId:'nasaJupiter',color:'#d9b384'}),
  target('saturn','Saturno','planet','♄',{brightness:.82,detail:.86,angularSizeArcsec:40,features:['anéis','Titã','divisão didática'],description:'Os anéis exigem foco cuidadoso e ampliação moderada.',recommendedFilters:['none','neutral'],color:'#e7d09b'}),
  target('mars','Marte','planet','♂',{brightness:.72,detail:.55,angularSizeArcsec:18,features:['disco avermelhado','calota polar didática','variações de albedo'],description:'O tamanho aparente varia bastante; detalhes dependem de boas condições.',recommendedFilters:['none','red'],color:'#d26b4b'}),
  target('pleiades','Plêiades (M45)','cluster','✦',{brightness:.75,detail:.7,angularSizeArcsec:6600,features:['aglomerado aberto','estrelas azuis','campo amplo'],description:'Alvo de campo amplo; ampliações muito altas prejudicam a visão do conjunto.',recommendedFilters:['none'],color:'#a8d7ff'}),
  target('orion-nebula','Nebulosa de Órion (M42)','nebula','☁',{brightness:.6,detail:.8,angularSizeArcsec:3900,features:['gás ionizado','Trapézio','asas da nebulosa'],description:'A abertura e o céu escuro ajudam a perceber estruturas tênues.',recommendedFilters:['none','uhc','oiii'],minimumApertureMm:70,color:'#86d4cc'}),
  target('andromeda','Galáxia de Andrômeda (M31)','galaxy','⌁',{brightness:.48,detail:.45,angularSizeArcsec:11400,features:['núcleo brilhante','disco difuso','galáxias satélites didáticas'],description:'O campo amplo e o céu escuro são mais importantes do que ampliação extrema.',recommendedFilters:['none'],minimumApertureMm:70,color:'#cbb5ff'}),
  target('double-star','Estrela dupla Albireo','double','✧',{brightness:.8,detail:.72,angularSizeArcsec:35,features:['duas componentes','contraste de cores','separação angular'],description:'Um bom teste de foco, estabilidade e resolução.',recommendedFilters:['none'],color:'#ffd28c'}),
  target('hydrogen-line','Linha de hidrogênio 21 cm','radio','λ',{band:'radio',brightness:.62,detail:.75,angularSizeArcsec:7200,features:['espectro de rádio','pico de intensidade','mapa de varredura'],description:'Simulação didática de recepção e processamento de radiofrequência.',recommendedFilters:['none'],minimumApertureMm:0,color:'#ffbf72'}),
  target('radio-jupiter','Emissão de rádio de Júpiter','radio','⌁',{band:'radio',brightness:.7,detail:.68,angularSizeArcsec:3600,features:['rajadas','ruído','série temporal'],description:'Relaciona antena, receptor, filtragem digital e análise de sinais.',recommendedFilters:['none'],minimumApertureMm:0,color:'#ffc88b'})
];
export const TARGET_BY_ID=Object.fromEntries(TELESCOPE_TARGETS.map(item=>[item.id,item]));

export const SKY_CONDITIONS=[
  {id:'urban',name:'Centro urbano',bortle:8,darkness:.25,seeing:.58,clouds:.15,wind:.2,description:'Fundo brilhante; Lua e planetas permanecem acessíveis.'},
  {id:'suburban',name:'Bairro suburbano',bortle:6,darkness:.48,seeing:.68,clouds:.1,wind:.15,description:'Aglomerados e nebulosas brilhantes começam a aparecer.'},
  {id:'rural',name:'Área rural escura',bortle:3,darkness:.82,seeing:.78,clouds:.05,wind:.1,description:'Melhor contraste para céu profundo.'},
  {id:'unstable',name:'Atmosfera turbulenta',bortle:4,darkness:.72,seeing:.34,clouds:.22,wind:.75,description:'A imagem oscila; alta ampliação perde qualidade.'},
  {id:'cloudy',name:'Nuvens intermitentes',bortle:5,darkness:.55,seeing:.62,clouds:.68,wind:.3,description:'A transparência varia e interrompe alvos ópticos.'}
];
export const SKY_BY_ID=Object.fromEntries(SKY_CONDITIONS.map(item=>[item.id,item]));

export const ALIGNMENT_STARS=[
  {id:'sirius',name:'Sírius',azimuth:118,altitude:34},
  {id:'canopus',name:'Canopus',azimuth:164,altitude:27},
  {id:'achernar',name:'Achernar',azimuth:226,altitude:48}
];

export const TELESCOPE_LAB_MODES=[
  {id:'gallery',label:'Galeria',icon:'⬡'},
  {id:'assembly',label:'Montagem',icon:'⚙'},
  {id:'alignment',label:'Alinhamento',icon:'⌖'},
  {id:'observe',label:'Observação',icon:'◉'},
  {id:'compare',label:'Comparar',icon:'▥'},
  {id:'evidence',label:'Evidência',icon:'✓'}
];

export const TELESCOPE_LAB_GOALS=[
  {id:'assemble',label:'Montar um instrumento',xp:180},
  {id:'align',label:'Concluir alinhamento',xp:160},
  {id:'observe-three',label:'Registrar três alvos',xp:320},
  {id:'compare',label:'Comparar três instrumentos',xp:180},
  {id:'export',label:'Exportar evidência',xp:140}
];

export const TELESCOPE_SAFETY=[
  'Nunca aponte um instrumento óptico para o Sol sem filtro solar certificado instalado na abertura frontal e orientação especializada.',
  'Não use filtros solares de ocular improvisados.',
  'A simulação não substitui manual, supervisão ou procedimentos de segurança do equipamento real.'
];

export const PRICE_REVIEW={currency:'BRL',reviewedAt:'2026-08-04',region:'Brasil',method:'Faixas didáticas amplas baseadas em guias de categoria e anúncios de mercado; não constituem recomendação de compra.'};
