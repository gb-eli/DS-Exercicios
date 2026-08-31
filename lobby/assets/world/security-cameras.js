// v14.10.8.71 — F69: Central de Segurança e Câmeras do Campus AGV.
// Somente visualização do mundo público do Lobby. Nenhum dado acadêmico é lido ou alterado.

const camera=(id,label,zone,position,target,extra={})=>Object.freeze({
  id,label,zone,
  position:Object.freeze({x:Number(position[0]),y:Number(position[1]),z:Number(position[2])}),
  target:Object.freeze({x:Number(target[0]),y:Number(target[1]),z:Number(target[2])}),
  baseFov:Number(extra.baseFov||52),
  public:extra.public!==false,
  description:String(extra.description||`Visão pública • ${zone}`)
});

export const CAMPUS_SECURITY_CAMERAS=Object.freeze([
  camera('cam-central','CAM 01 • Praça Central','Centro Cívico',[-9,11,-8],[0,1.3,0],{baseFov:50,description:'Praça, fonte, encontros e circulação central.'}),
  camera('cam-north','CAM 02 • Eixo Norte','Eixo Acadêmico',[0,13,37],[0,1.5,17],{baseFov:48,description:'Plataforma, Banco, Loja, Cinema e Central de Segurança.'}),
  camera('cam-south','CAM 03 • Mobilidade Sul','Eixo de Mobilidade',[7,12,-36],[0,1.2,-20],{baseFov:50,description:'Terminal sul, monotrilho, vias e Centro de Provas.'}),
  camera('cam-west','CAM 04 • Distrito Oeste','Pesquisa & Cyber',[-52,10,6],[-27,1.5,1],{baseFov:54,description:'Laboratórios 1DS/3DS, Pesquisa, Cyber e Arcade.'}),
  camera('cam-east','CAM 05 • Distrito Leste','Ciência & Inovação',[52,10,6],[27,1.5,1],{baseFov:54,description:'Laboratórios 2DS/SUB, Ciência, Desafios e Inovação.'}),
  camera('cam-cinema','CAM 06 • Distrito Cultural','Cinema AGV',[38,10,37],[27,1.5,26],{baseFov:46,description:'Entorno público do Cinema AGV e eixo cultural.'}),
  camera('cam-vale-gate','CAM 07 • Portal Metropolitano','Portal do Vale',[-11,9,-35],[0,2.1,-26],{baseFov:48,description:'Portal do Vale e corredor tecnológico de acesso.'}),
  camera('cam-rail','CAM 08 • Monotrilho Central','Transporte',[13,12,-2],[0,2.2,-9],{baseFov:44,description:'Estação central e trecho urbano do monotrilho.'})
]);

export const CAMPUS_SECURITY_CAMERA_MAP=Object.freeze(Object.fromEntries(CAMPUS_SECURITY_CAMERAS.map(item=>[item.id,item])));
export const CAMPUS_SECURITY_DEFAULT_CAMERA='cam-central';
export const CAMPUS_SECURITY_GRID_IDS=Object.freeze(['cam-central','cam-south','cam-west','cam-east']);

export function securityCameraZoomFov(def,zoom=1){
  const base=Math.max(35,Math.min(75,Number(def?.baseFov)||52));
  const z=Math.max(1,Math.min(4,Number(zoom)||1));
  return Math.max(16,Math.min(75,base/Math.pow(z,.72)));
}
