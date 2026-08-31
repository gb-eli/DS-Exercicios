import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=(p)=>fs.readFileSync(new URL(`../../${p}`,import.meta.url),'utf8');
const bridge=read('sistemas/01-lab-virtual/LABDS/lab/js/agv-core-bridge.js');
const core=read('sistemas/01-lab-virtual/LABDS/lab/js/v3/core.js');
const app=read('sistemas/01-lab-virtual/LABDS/lab/js/app.js');
const css=read('sistemas/01-lab-virtual/LABDS/lab/css/v3.css');
const fullscreen=read('core/session/fullscreen-platform-bridge.js');
const migration=read('core/database/064_p10932_lab_adaptation_reconciliation.sql');

test('Etapa 17: identidade do Lab herda acomodação global e preferência do aluno',()=>{
  assert.match(bridge,/student_accommodations\?select=id,config,updated_at/);
  assert.match(bridge,/accommodation_type=eq\.learning_mode/);
  assert.match(bridge,/pedagogical_adaptation_preferences\?select=mode/);
  assert.match(bridge,/getAdaptation:\(\)=>identity\?\.adaptation\|\|null/);
});

test('Etapa 17: falha de sincronização do Core não derruba prática autenticada',()=>{
  assert.match(core,/await window\.LABDS\.AGVCore\.requireSession\(\);/);
  assert.match(core,/try\{applyCentralState\(await window\.LABDS\.AGVCore\.loadCoreState\(\)\);\}\s*catch\(error\)\{activateCoreDegraded\(error\);\}/);
  assert.match(core,/state\.authority='agv-core'/);
  assert.match(core,/mode:'agv-core-degraded'/);
  assert.match(bridge,/AGV Core • prática disponível/);
});

test('Etapa 17: modo degradado mantém autoridade central e não converte recompensa em local',()=>{
  assert.match(core,/const isCoreAuthority=\(\)=>state\.authority==='agv-core'/);
  assert.match(core,/if\(isCoreAuthority\(\)\)\{/);
  assert.match(core,/completeActivity\?\./);
});

test('Etapa 17: Lab aplica perfil pedagógico sem diagnóstico nominal no frontend',()=>{
  for(const token of ['lab-pedagogical-adapted','lab-reduced-visual-load','lab-large-controls','lab-motor-friendly','lab-predictable-feedback','lab-home-study']) assert.match(core,new RegExp(token));
  assert.match(core,/root\.dataset\.pedagogicalProfile/);
  assert.doesNotMatch(`${bridge}\n${core}\n${app}\n${css}`,/maria fernanda|andré roberto|andre roberto|nathan ramos|natan ramos/i);
});

test('Etapa 17: redução de carga visual também interrompe rotação automática da vitrine',()=>{
  assert.match(app,/function adaptationPausesShowcase\(\)/);
  assert.match(app,/lab-reduced-visual-load/);
  assert.match(app,/lab-predictable-feedback/);
  assert.match(app,/if\(state\.showcaseManualPause\|\|adaptationPausesShowcase\(\)/);
});

test('Etapa 17: CSS fornece controles ampliados e modo motor previsível',()=>{
  assert.match(css,/html\.lab-large-controls button/);
  assert.match(css,/min-height:48px/);
  assert.match(css,/html\.lab-motor-friendly button/);
  assert.match(css,/min-height:50px/);
  assert.match(css,/html\.lab-reduced-visual-load #dynamicShowcase\{display:none!important\}/);
});

test('Etapa 17: fullscreen global respeita acomodação domiciliar/relaxada',()=>{
  assert.match(fullscreen,/student_accommodations\?select=config/);
  assert.match(fullscreen,/mode==='home_study'\|\|mode==='relaxed'\|\|supervision\.require_fullscreen===false/);
  assert.match(fullscreen,/requireForUser=false/);
});

test('Etapa 17: migration normaliza roster privado sem versionar nomes',()=>{
  assert.match(migration,/prepare_pedagogical_adaptation_roster_row/);
  assert.match(migration,/new\.normalized_name := public\.normalize_student_name\(new\.student_name\)/);
  assert.doesNotMatch(migration,/maria fernanda|andré roberto|andre roberto|nathan ramos|natan ramos/i);
});

test('Etapa 17: novos registros do roster reaplicam adaptação a perfis existentes',()=>{
  assert.match(migration,/after_pedagogical_adaptation_roster_reconcile/);
  assert.match(migration,/perform public\.apply_pedagogical_adaptation_for_profile\(r\.id\)/);
  assert.match(migration,/public\.normalize_student_name\(p\.full_name\)=new\.normalized_name/);
  assert.match(migration,/new\.class_code is null or c\.code=new\.class_code/);
});

test('Etapa 17: migration faz reconciliação única dos perfis ativos existentes',()=>{
  assert.match(migration,/for r in select id from public\.profiles where active=true loop/);
  assert.match(migration,/perform public\.apply_pedagogical_adaptation_for_profile\(r\.id\)/);
});
