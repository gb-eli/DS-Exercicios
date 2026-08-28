#!/usr/bin/env node
'use strict';
const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..');const gameRoot=path.join(root,'games','crystal-cascade-3d');
const {Engine,COLOR_NAMES,SPECIAL}=require(path.join(gameRoot,'engine.js'));
const data=JSON.parse(fs.readFileSync(path.join(gameRoot,'levels.json'),'utf8'));const checks=[];
function check(name,passed,detail=''){checks.push({name,passed:!!passed,detail});if(!passed)console.error('FAIL',name,detail);}
function metric(e,l){let m=e.score+(l.blockers?.flatMap(x=>x.cells||[]).length-e.blockers.size)*500;for(const [k,v] of Object.entries(l.collect||{}))m+=Math.min(v,e.collected[k]||0)*300;return m;}
function solve(level,seed){const e=new Engine(level,seed);let steps=0;while(e.status==='playing'&&steps++<level.moves+2){let best=null,bestVal=-1e30;const snap=e.snapshot();for(let i=0;i<64;i++)for(const j of [i+1,i+8]){if(j>=64||!e.adjacent(i,j))continue;const t=new Engine(level,seed);t.restore(snap);const r=t.swap(i,j);if(!r.ok)continue;const val=metric(t,level)+(t.goalsMet()?1e9:0)+t.moves*5;if(val>bestVal){bestVal=val;best=[i,j];}}if(!best)break;e.swap(...best);}return e;}
check('12 fases definidas',data.levels.length===12,`encontradas ${data.levels.length}`);
check('Tabuleiro 8×8',data.board.columns===8&&data.board.rows===8,'estrutura principal');
check('Seis famílias de cristais',data.board.colors===6&&COLOR_NAMES.length===6,COLOR_NAMES.join(', '));
let prev=0;
for(const [idx,level] of data.levels.entries()){
  check(`Fase ${idx+1} possui nome`,typeof level.name==='string'&&level.name.length>3,level.name);
  check(`Fase ${idx+1} possui movimentos`,Number.isInteger(level.moves)&&level.moves>=18&&level.moves<=25,`${level.moves}`);
  check(`Fase ${idx+1} possui meta crescente`,level.targetScore>=1800&&level.targetScore>=prev,`${level.targetScore}`);prev=level.targetScore;
  const blockerCells=(level.blockers||[]).flatMap(g=>g.cells||[]);check(`Fase ${idx+1} bloqueadores válidos`,blockerCells.every(x=>Number.isInteger(x)&&x>=0&&x<64)&&new Set(blockerCells).size===blockerCells.length,`${blockerCells.length} células`);
  check(`Fase ${idx+1} coletas válidas`,Object.entries(level.collect||{}).every(([k,v])=>COLOR_NAMES.includes(k)&&Number.isInteger(v)&&v>0),JSON.stringify(level.collect||{}));
  const e=new Engine(level,0xCC3700+idx*997);check(`Fase ${idx+1} inicia sem match automático`,e.findMatches().indices.length===0,'tabuleiro limpo');check(`Fase ${idx+1} inicia com jogada possível`,e.hasValidMove(),'ao menos uma troca válida');
  const solved=solve(level,0xCC3700+idx*997);check(`Fase ${idx+1} conclusão automatizada`,solved.status==='victory',`status ${solved.status}; score ${solved.score}; movimentos ${solved.moves}; gelo ${solved.blockers.size}`);
}
// invalid swap must not spend a move
{const e=new Engine(data.levels[0],123);let pair=null;for(let i=0;i<64&&!pair;i++)for(const j of [i+1,i+8]){if(j>=64||!e.adjacent(i,j))continue;const snap=e.snapshot();const r=e.swap(i,j);e.restore(snap);if(!r.ok)pair=[i,j];}if(pair){const before=e.moves;const r=e.swap(...pair);check('Troca sem combinação é rejeitada',!r.ok&&e.moves===before,`${pair.join('↔')}`);}else check('Troca sem combinação é rejeitada',false,'nenhuma troca inválida encontrada');}
// special construction using crafted boards
function baseBoard(){return Array.from({length:64},(_,i)=>({color:(i+Math.floor(i/8)*2)%6,special:null}));}
{const e=new Engine(data.levels[0],1);const b=baseBoard();b[0]={color:0,special:null};b[1]={color:0,special:null};b[2]={color:0,special:null};b[3]={color:0,special:null};e.board=b;const r=e.resolveMatches(2);check('Combinação de 4 cria especial',r.createdSpecials.some(x=>x.type===SPECIAL.ROW||x.type===SPECIAL.COL),JSON.stringify(r.createdSpecials));}
{const e=new Engine(data.levels[0],1);const b=baseBoard();for(let i=0;i<5;i++)b[i]={color:1,special:null};e.board=b;const r=e.resolveMatches(2);check('Combinação de 5 cria explosão',r.createdSpecials.some(x=>x.type===SPECIAL.BOMB),JSON.stringify(r.createdSpecials));}
{const e=new Engine(data.levels[0],3);const snap=e.snapshot();e.score=999;e.restore(snap);check('Snapshot restaura tabuleiro',e.score===snap.score&&e.board.length===64,'schema 1');}
// integration
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
for(const token of ['crystal-cascade-3d','games/crystal-cascade-3d/runtime','fliperama-ds-crystal-cascade'])check(`Integração app: ${token}`,app.includes(token),'app.js');
for(const file of ['index.html','style.css','engine.js','game.js','levels.json'])check(`Arquivo do jogo: ${file}`,fs.existsSync(path.join(gameRoot,file)),file);
for(const file of ['logo.svg','preview-01.svg','preview-02.svg'])check(`Mídia: ${file}`,fs.existsSync(path.join(root,'media','games','crystal-cascade-3d',file)),file);
const profiles=JSON.parse(fs.readFileSync(path.join(root,'game-profiles.json'),'utf8'));const learning=JSON.parse(fs.readFileSync(path.join(root,'education','game-learning.json'),'utf8'));
check('Perfil externo registrado',!!profiles['crystal-cascade-3d'],'game-profiles.json');check('Ficha educacional registrada',!!learning['crystal-cascade-3d'],'game-learning.json');
check('Three.js local reutilizado',fs.readFileSync(path.join(gameRoot,'game.js'),'utf8').includes("../voxelcraft-ds/vendor/three/three.module.min.js"),'sem CDN');
check('Sem identidade comercial copiada',!/(candy\s*crush|king\.com)/i.test([app,fs.readFileSync(path.join(gameRoot,'game.js'),'utf8')].join('\n')),'identidade autoral');
const passed=checks.filter(x=>x.passed).length,failed=checks.length-passed;const result={product:'Fliperama DS',version:'0.37.2',game:'Crystal Cascade 3D',generatedAt:new Date().toISOString(),summary:{checks:checks.length,passed,failed},items:checks};fs.writeFileSync(path.join(__dirname,'crystal-cascade-results-v0.37.2.json'),JSON.stringify(result,null,2)+'\n');
const md=['# Testes — Crystal Cascade 3D v0.37.2','',`- Verificações: **${checks.length}**`,`- Aprovadas: **${passed}**`,`- Falhas: **${failed}**`,'','## Itens','',...checks.map(x=>`- ${x.passed?'✅':'❌'} **${x.name}** — ${x.detail}`),''];fs.writeFileSync(path.join(root,'TESTES-CRYSTAL-CASCADE-v0.37.2.md'),md.join('\n'));
console.log(JSON.stringify(result.summary,null,2));if(failed)process.exitCode=1;
