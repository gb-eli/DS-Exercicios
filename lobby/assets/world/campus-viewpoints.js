// v14.10.8.73 — F71 Mirantes e Binóculos
// Pontos panorâmicos locais do Campus. Não acessa dados acadêmicos nem grava estado persistente.

const freezePoint=(value={})=>Object.freeze({x:Number(value.x)||0,y:Number(value.y)||0,z:Number(value.z)||0});

export const CAMPUS_VIEWPOINT_LANDMARKS=Object.freeze([
  Object.freeze({id:'plaza',name:'Praça Central',icon:'◆',category:'Centro',target:freezePoint({x:0,y:2.2,z:0}),description:'Núcleo de circulação, fonte e encontros do Campus.'}),
  Object.freeze({id:'unified-platform',name:'Plataforma Unificada',icon:'🧪',category:'Acadêmico',target:freezePoint({x:0,y:5.2,z:31}),description:'Atividades, prática e desafios no eixo acadêmico norte.'}),
  Object.freeze({id:'security-center',name:'Central de Segurança',icon:'📹',category:'Operações',target:freezePoint({x:-29,y:5.1,z:31}),description:'Centro de câmeras, energia, redes e operação do Campus.'}),
  Object.freeze({id:'cinema',name:'Cinema AGV',icon:'🎬',category:'Cultura',target:freezePoint({x:29,y:4.6,z:31}),description:'Cinema e espaço de exibições do distrito cultural.'}),
  Object.freeze({id:'lab-1ds',name:'Laboratório 1DS',icon:'1',category:'Laboratórios',target:freezePoint({x:-30,y:5.6,z:-18}),description:'Edifício do 1DS no quadrante sudoeste.'}),
  Object.freeze({id:'lab-2ds',name:'Laboratório 2DS',icon:'2',category:'Laboratórios',target:freezePoint({x:30,y:5.6,z:-18}),description:'Edifício do 2DS no quadrante sudeste.'}),
  Object.freeze({id:'lab-3ds',name:'Laboratório 3DS',icon:'3',category:'Laboratórios',target:freezePoint({x:-30,y:5.6,z:18}),description:'Edifício do 3DS no quadrante noroeste.'}),
  Object.freeze({id:'lab-sub',name:'Laboratório SUB',icon:'S',category:'Laboratórios',target:freezePoint({x:30,y:5.6,z:18}),description:'Edifício do Subsequente no quadrante nordeste.'}),
  Object.freeze({id:'vale-gate',name:'Portal do Vale',icon:'🏙',category:'Mobilidade',target:freezePoint({x:0,y:3.2,z:-29.5}),description:'Acesso para o Vale do Silício AGV.'}),
  Object.freeze({id:'monorail',name:'Monotrilho Central',icon:'🚝',category:'Mobilidade',target:freezePoint({x:0,y:3.1,z:-8.5}),description:'Estação central e corredor elevado do monotrilho.'})
]);
export const CAMPUS_VIEWPOINT_LANDMARK_MAP=Object.freeze(Object.fromEntries(CAMPUS_VIEWPOINT_LANDMARKS.map(item=>[item.id,item])));

const makeViewpoint=item=>Object.freeze({
  ...item,
  entry:freezePoint(item.entry),
  camera:freezePoint(item.camera),
  defaultTarget:freezePoint(item.defaultTarget||{x:0,y:3,z:0}),
  baseFov:Number(item.baseFov)||58,
  maxZoom:Number(item.maxZoom)||6,
  focusIds:Object.freeze([...(item.focusIds||CAMPUS_VIEWPOINT_LANDMARKS.map(x=>x.id))])
});

export const CAMPUS_VIEWPOINTS=Object.freeze([
  makeViewpoint({
    id:'viewpoint-west',name:'Mirante AGV',label:'MIRANTE OESTE',icon:'🔭',district:'Tech Oeste',accent:'#ffae63',
    entry:{x:-37.3,y:0,z:6.6},camera:{x:-33.5,y:14.7,z:6},defaultTarget:{x:0,y:3.4,z:2},baseFov:60,maxZoom:6,
    focusIds:['plaza','lab-1ds','lab-3ds','security-center','unified-platform','monorail','vale-gate'],
    description:'Deck panorâmico principal do Campus, conectado à Torre de Controle AGV.'
  }),
  makeViewpoint({
    id:'viewpoint-east',name:'Mirante Ciência',label:'MIRANTE CIÊNCIA',icon:'🔭',district:'Distrito Ciência',accent:'#8f8cff',
    entry:{x:51,y:0,z:12.5},camera:{x:51,y:13.4,z:12.5},defaultTarget:{x:4,y:3.4,z:4},baseFov:58,maxZoom:6,
    focusIds:['plaza','lab-2ds','lab-sub','cinema','unified-platform','monorail','vale-gate'],
    description:'Ponto elevado no limite leste, voltado para Ciência, Inovação e Centro Cívico.'
  }),
  makeViewpoint({
    id:'viewpoint-southwest',name:'Mirante Pesquisa',label:'MIRANTE PESQUISA',icon:'🔭',district:'Distrito Pesquisa',accent:'#55d9ff',
    entry:{x:-51,y:0,z:-12.5},camera:{x:-51,y:12.8,z:-12.5},defaultTarget:{x:-3,y:3.1,z:-2},baseFov:58,maxZoom:6,
    focusIds:['plaza','lab-1ds','lab-2ds','security-center','monorail','vale-gate','unified-platform'],
    description:'Ponto elevado do corredor de Pesquisa, com visão do eixo sul e do Portal do Vale.'
  })
]);

export const CAMPUS_VIEWPOINT_MAP=Object.freeze(Object.fromEntries(CAMPUS_VIEWPOINTS.map(item=>[item.id,item])));
export const CAMPUS_VIEWPOINT_DEFAULT='viewpoint-west';

export function viewpointZoomFov(viewpoint,zoom=1){
  const base=Math.max(38,Math.min(78,Number(viewpoint?.baseFov)||58));
  const max=Math.max(2,Math.min(8,Number(viewpoint?.maxZoom)||6));
  const z=Math.max(1,Math.min(max,Number(zoom)||1));
  return Math.max(10,Math.min(78,base/Math.pow(z,.78)));
}

export function viewpointLandmarks(viewpoint){
  const def=typeof viewpoint==='string'?CAMPUS_VIEWPOINT_MAP[viewpoint]:viewpoint;
  if(!def)return[];
  return (def.focusIds||[]).map(id=>CAMPUS_VIEWPOINT_LANDMARK_MAP[id]).filter(Boolean);
}
