import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'../..');
const supervision=fs.readFileSync(path.join(root,'atividades/assets/js/supervision.js'),'utf8');
const staff=fs.readFileSync(path.join(root,'atividades/assets/js/admin.js'),'utf8');
const lobby=fs.readFileSync(path.join(root,'lobby/assets/lobby.js'),'utf8');

assert.match(supervision,/document\.hidden[\s\S]*15000[\s\S]*\}, 5000\)/,'adaptive heartbeat');
assert.doesNotMatch(supervision,/setInterval\(beat,\s*2000\)/,'old 2s heartbeat removed');
assert.match(staff,/live-dialog'\)\?\.open\)updateLive\(\);\},5000\)/,'live polling visible/open only');
assert.match(staff,/supervision-center-dialog'\)\?\.open\)refreshSupervisionCenter\(\);\},6000\)/,'supervision polling visible/open only');
assert.match(staff,/securityWatchTimer=setInterval\(\(\)=>\{if\(!document\.hidden\)refreshSupervisionBadge\(\);\},15000\)/,'security badge pauses hidden');
assert.match(lobby,/if\(!document\.hidden\)loadActivities\(\)\.catch\(\(\)=>\{\}\)\},30000\)/,'lobby polling visible only');

const activeFiles=['index.html','assets/hub.js','admin/index.html','admin/assets/admin.js','professor/index.html','professor/assets/professor.js','atividades/index.html','atividades/assets/js/app.js','atividades/assets/js/workspace.js','lobby/index.html','lobby/assets/lobby.js'].map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n');
assert.doesNotMatch(activeFiles,/agv@2026/i,'historical shared password absent');
assert.doesNotMatch(activeFiles,/SUPABASE_SERVICE_ROLE_KEY|service_role["'`]\s*[:=]/i,'service role secret absent');
console.log('P7.0 production audit v13.9 — PASS');
