import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const lobby=read('lobby/assets/lobby.js');
const lobby3d=read('lobby/assets/lobby3d.js');
const html=read('lobby/index.html');
const app=read('atividades/assets/js/app.js');
const db=read('core/database/027_p4_lobby_presence.sql');
const checks=[
 ['quatro zonas', ['1DS-A-MANHA','2DS-A-MANHA','3DS-C-MANHA','DS-SUB-NOITE'].every(x=>lobby.includes(x))],
 ['movimento WASD', [lobby,lobby3d].some(x=>x.includes('KeyW')&&x.includes('KeyA')&&x.includes('KeyS')&&x.includes('KeyD'))],
 ['toque mobile', (html.includes('touch-controls')&&lobby.includes('[data-key]'))||(html.includes('move-joystick')&&read('lobby/assets/lobby3d.js').includes('bindJoystick'))],
 ['portal depende de release', lobby.includes('studentReleases')&&lobby.includes('classReleases')&&lobby.includes('default_locked')],
 ['sem acesso outra turma', lobby.includes('atividades pertencem àquela turma')],
 ['deep link atividade', lobby.includes('?exercise=')&&app.includes("get('exercise')")],
 ['revalidação backend', app.includes("callActivityProgress({action:'start'")],
 ['presença RLS', db.includes('enable row level security')&&db.includes('student_id=auth.uid()')],
 ['sem chat livre', !lobby.includes('chat_message')&&!html.includes('textarea')],
 ['emotes', ['wave','like','spark'].every(x=>lobby.includes(x)||lobby3d.includes(x))],
];
for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} — ${n}`);if(!ok)process.exitCode=1}
