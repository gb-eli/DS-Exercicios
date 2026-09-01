// F85 — contrato de modularização visual/streaming do Campus DS.
// Nesta fase, os distritos orientam o mapa 2D e o futuro load/unload; os runtimes físicos continuam compatíveis.
const freeze=o=>Object.freeze(o);
export const CAMPUS_MODULAR_SCHEMA=2;
export const CAMPUS_MAP_VIEW=freeze({minX:-60,maxX:60,minZ:-42,maxZ:42,padding:5,defaultZoom:1.08,portraitZoom:1.16});
export const CAMPUS_HUB=freeze({id:'campus-hub',name:'Estação Central AGV',x:0,z:0,w:23,d:18,accent:'#72e6ff',kind:'hub',loadPolicy:'always'});
export const CAMPUS_MODULAR_DISTRICTS=Object.freeze([
  freeze({id:'vila-1ds',zone:'1ds',name:'Vila 1DS',subtitle:'Pesquisa e laboratório',x:-30,z:-18,w:29,d:20,accent:'#36d2ff',entry:{x:-17.5,z:-12.4},loadPolicy:'on-demand',airdropSector:'1ds'}),
  freeze({id:'vila-2ds',zone:'2ds',name:'Vila 2DS',subtitle:'Ciência e desenvolvimento',x:30,z:-18,w:29,d:20,accent:'#51e7a3',entry:{x:17.5,z:-12.4},loadPolicy:'on-demand',airdropSector:'2ds'}),
  freeze({id:'vila-3ds',zone:'3ds',name:'Vila 3DS',subtitle:'Cyber e projetos avançados',x:-30,z:18,w:29,d:20,accent:'#b58cff',entry:{x:-17.5,z:12.4},loadPolicy:'on-demand',airdropSector:'3ds'}),
  freeze({id:'vila-sub',zone:'sub',name:'Vila SUB',subtitle:'Inovação e subsequente',x:30,z:18,w:29,d:20,accent:'#ffae63',entry:{x:17.5,z:12.4},loadPolicy:'on-demand',airdropSector:'sub'}),
  freeze({id:'mod-library',module:'library',name:'Biblioteca Central',subtitle:'Leitura, estudo e mídia',x:-46,z:-5,w:18,d:12,accent:'#7ddcff',entry:{x:-34,z:-6},loadPolicy:'on-demand',airdropSector:'campus-library'}),
  freeze({id:'mod-labs',module:'labs',name:'Distrito de Laboratórios',subtitle:'Simulação, robótica e maker',x:-48,z:-29,w:18,d:12,accent:'#55d9ff',entry:{x:-44,z:-26},loadPolicy:'on-demand',airdropSector:'campus-labs'}),
  freeze({id:'mod-neon',module:'neon',name:'Parque Neon & Lazer',subtitle:'Piscina, parkour e convivência',x:0,z:18,w:26,d:14,accent:'#43d9ff',entry:{x:0,z:15},loadPolicy:'on-demand',airdropSector:'campus-neon'})
]);
export const CAMPUS_AIRDROP_SECTORS=Object.freeze([
  freeze({id:'central',name:'Hub Central',x:0,z:0,w:28,d:23,loadTarget:'campus-hub'}),
  ...CAMPUS_MODULAR_DISTRICTS.map(d=>freeze({id:d.airdropSector,name:d.name,x:d.x,z:d.z,w:d.w,d:d.d,loadTarget:d.id})),
  freeze({id:'north-worlds',name:'Terminal Norte',x:0,z:32,w:45,d:10,loadTarget:'north-gateways'}),
  freeze({id:'south-mobility',name:'Mobilidade Sul',x:0,z:-31,w:45,d:10,loadTarget:'south-gateways'})
]);
export function campusAirdropSectorAt(x,z){return CAMPUS_AIRDROP_SECTORS.find(s=>Math.abs(Number(x)-s.x)<=s.w/2&&Math.abs(Number(z)-s.z)<=s.d/2)||CAMPUS_AIRDROP_SECTORS[0];}
