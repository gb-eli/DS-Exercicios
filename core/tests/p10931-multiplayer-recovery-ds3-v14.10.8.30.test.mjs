import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');

function jsonAssignment(text,prefix,suffix){
  const start=text.indexOf(prefix);assert.ok(start>=0,`prefix ${prefix}`);
  const from=start+prefix.length;const end=text.lastIndexOf(suffix);assert.ok(end>from,`suffix ${suffix}`);
  return JSON.parse(text.slice(from,end).trim());
}

test('DS1/DS2 practical exam exposes multiplayer lobby, guild chat and pedagogical accommodations',()=>{
  const student=read('prova/assets/student.js');
  const edge=read('core/edge-functions/practical-exam/index.ts');
  const css=read('prova/assets/prova.css');
  assert.match(student,/PROVA PRÁTICA EM EQUIPE/);
  assert.match(student,/Formação das equipes/);
  assert.doesNotMatch(student,/MATCH FOUND/);
  assert.match(student,/team_chat_send/);
  assert.match(student,/fullscreen_optional/);
  assert.match(student,/exam-reduce-motion/);
  assert.match(edge,/team_chat_list/);
  assert.match(edge,/practicalStudentAccommodation/);
  assert.match(edge,/student_accommodations/);
  assert.match(css,/team-chat-panel/);
  assert.match(css,/session-start-notice/);
});

test('DS3 recovery has 20 questions worth exactly 5 points',()=>{
  const ts=read('core/edge-functions/recovery-exam/catalog.ts');
  const prefix='export const RECOVERY_QUESTIONS:RecoveryQuestion[] = ';
  const from=ts.indexOf(prefix)+prefix.length;
  const body=ts.slice(from,ts.lastIndexOf('] as RecoveryQuestion[];')+1);
  const all=JSON.parse(body);
  const ds3=all.filter(q=>q.subject==='programacao_ds3');
  assert.equal(ds3.length,20);
  assert.equal(ds3.reduce((sum,q)=>sum+Number(q.points||0),0),5);
  assert.equal(new Set(ds3.map(q=>q.key)).size,20);
});

test('DS3 review is teacher-synchronized content: 8 cards x 3 stages',()=>{
  const catalog=jsonAssignment(read('recuperacao/assets/catalog.js'),'window.RECOVERY_CATALOG=',';');
  const ds3=catalog.programacao_ds3;
  assert.ok(ds3);
  assert.equal(ds3.cards.length,8);
  assert.ok(ds3.cards.every(card=>Array.isArray(card.stages)&&card.stages.length===3));
  const notes=jsonAssignment(read('core/edge-functions/recovery-exam/review-notes.ts'),'export const RECOVERY_REVIEW_NOTES =',' as const;');
  assert.equal(notes.programacao_ds3.length,8);
  assert.ok(notes.programacao_ds3.every(group=>group.length===3));
});

test('database patches preserve RLS boundaries and enable DS3 subject',()=>{
  const ds3=read('core/database/061_p10931_recovery_ds3_programacao.sql');
  const chat=read('core/database/062_p10931_practical_exam_guild_chat.sql');
  assert.match(ds3,/programacao_ds3/);
  assert.match(chat,/enable row level security/i);
  assert.match(chat,/revoke all .*anon.*authenticated/i);
  assert.match(chat,/practical_exam_team_chat_messages/);
});

test('public package contains no nominal Maria Fernanda seed',()=>{
  const candidates=[
    'core/database/061_p10931_recovery_ds3_programacao.sql',
    'core/database/062_p10931_practical_exam_guild_chat.sql',
    'prova/assets/student.js','recuperacao/assets/student.js','recuperacao/assets/catalog.js'
  ];
  for(const rel of candidates) assert.doesNotMatch(read(rel),/maria fernanda/i,rel);
});
