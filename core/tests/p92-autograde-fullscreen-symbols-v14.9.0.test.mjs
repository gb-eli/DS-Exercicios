import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('atividades/index.html');
const app=read('atividades/assets/js/app.js');
const ws=read('atividades/assets/js/workspace.js');
const sup=read('atividades/assets/js/supervision.js');
const grade=read('core/edge-functions/exercise-autograde/index.ts');
const migration=read('core/database/037_p92_autograde_scores.sql');
const legacy=read('validacao-antiga/assets/legacy.js');
const legacyHtml=read('validacao-antiga/index.html');
const hub=read('assets/hub.js');
const hubHtml=read('index.html');
const lobby=read('lobby/assets/lobby.js');
const lobbyHtml=read('lobby/index.html');
const fullscreen=read('core/session/fullscreen-portal.js');
const admin=read('admin/assets/admin.js');
const embedded=read('atividades/assets/js/admin.js');
const staff=read('core/edge-functions/staff-dashboard/index.ts');
const version=JSON.parse(read('atividades/version.json'));
const release=JSON.parse(read('release-current.json'));

test('P9 score columns persist latest autocorrection and score at submission',()=>{
  assert.match(migration,/auto_score numeric/);
  assert.match(migration,/submitted_score numeric/);
  assert.match(migration,/autograde_details jsonb/);
  assert.match(grade,/auto_score:score/);
  assert.match(grade,/submitted_score:officialScore/);
  assert.match(grade,/officialScore=action==='submit'\?Math\.max\(previousSubmitted,score\)/);
  assert.match(grade,/status:fullyCompleted\?'completed':'in_progress'/);
});

test('P9 autograder is server authoritative, flexible, and requires supervised session',()=>{
  assert.match(grade,/from\('exercise_reference_files'\)/);
  assert.match(grade,/from\('student_files'\)/);
  assert.match(grade,/canonicalTokens/);
  assert.match(grade,/replace\/\^\\s\*#|strip\(/);
  assert.match(grade,/active_supervised_session_required/);
  assert.match(grade,/if\(!activitySession\)return J/);
  assert.match(grade,/score:100[\s\S]*canonical_match:true/);
  assert.match(grade,/Math\.min\(99,score\)/);
  assert.doesNotMatch(ws,/SUPABASE_SERVICE_ROLE_KEY|service_role/i);
});

test('P9 student workspace exposes autocorrection and partial submission',()=>{
  for(const id of ['autograde-meter','autograde-score','autograde-bar','validate-btn','mark-complete-btn','exercise-submit-score']) assert.match(html,new RegExp(`id=["']${id}["']`));
  assert.match(html,/>Auto corrigir</);
  assert.match(html,/>Entregar</);
  assert.match(html,/Você pode entregar mesmo sem 100%/);
  assert.match(ws,/exercise-autograde/);
  assert.match(ws,/action:'grade'/);
  assert.match(ws,/action:'submit'/);
  assert.match(ws,/Entrega parcial registrada/);
});

test('P9 downloads contain only student-authored files',()=>{
  assert.match(html,/id="download-current-btn"[^>]*>Baixar meu arquivo</);
  assert.match(html,/id="download-zip-btn"[^>]*>Baixar meus códigos</);
  assert.match(ws,/saveAllBeforeExport/);
  assert.match(ws,/createStoreZip\(files\)/);
  assert.doesNotMatch(ws,/createStoreZip\([^)]*reference/i);
});

test('P9 fullscreen is portal-level for students and not restarted per exercise',()=>{
  assert.match(app,/requestPortalFullscreen\(\{silent:true\}\)/);
  assert.match(app,/setPortalFullscreenRequired\(requireStudentFullscreen\)/);
  assert.match(sup,/export async function stopSupervision\([^)]*exitFullscreen=false/);
  assert.match(sup,/if\(needsFullscreen&&!document\.fullscreenElement\)[\s\S]*waitingForFullscreen=true[\s\S]*else await armCurrentSession\(\)/);
  assert.match(hub,/AGVFullscreen\?\.require\(role==='student'\)/);
  assert.match(lobby,/AGVFullscreen\?\.require\(p\.role==='student'\)/);
  assert.match(hubHtml,/fullscreen-portal\.js\?v=14\.(?:9\.[0-9]+|10\.\d+)/);
  assert.match(lobbyHtml,/fullscreen-portal\.js\?v=14\.(?:9\.[0-9]+|10\.\d+)/);
  assert.match(fullscreen,/Tela cheia obrigatória/);
  assert.match(fullscreen,/state\.required&&!document\.fullscreenElement\)void request\(\{silent:true\}\)/);
});

test('P9 old-platform validator is the explicit fullscreen exception and supports batch selection',()=>{
  assert.match(legacyHtml,/data-fullscreen-exempt="true"/);
  assert.doesNotMatch(legacyHtml,/fullscreen-portal\.js/);
  assert.match(legacyHtml,/id="select-all"/);
  assert.match(legacyHtml,/id="repository-url"/);
  assert.match(legacy,/input\[data-exercise\]:checked/);
  assert.match(legacy,/exercise_ids:ids/);
  assert.match(legacy,/legacy-batch-submit/);
  assert.match(app,/validacao-antiga\//);
});

test('P9 global Symbols palette uses database formats and inserts at cursor without Clipboard API',()=>{
  assert.match(html,/id="symbols-btn"/);
  assert.match(html,/id="symbol-palette"/);
  assert.match(ws,/sw\.symbol_palette\|\|cfg\.symbol_palette/);
  assert.match(ws,/sw\.typing_assist\|\|cfg\.typing_assist/);
  assert.match(ws,/sw\.keyboard_helper\|\|cfg\.keyboard_helper/);
  assert.match(ws,/setRangeText\(text,start,end,'end'\)/);
  assert.match(ws,/markTrustedEditorInsertion\(\)/);
  assert.doesNotMatch(ws,/navigator\.clipboard/);
});

test('P9 subject separation scopes admin bulk actions to selected discipline',()=>{
  assert.match(admin,/activitySubject/);
  assert.match(admin,/displayedActivities/);
  assert.match(admin,/Liberar disciplina/);
  assert.match(embedded,/release-subject/);
  assert.match(embedded,/releaseExercises\(\)/);
});

test('P9 staff overview includes auto and submitted scores',()=>{
  assert.match(staff,/auto_score,auto_score_at,submitted_score,submitted_at/);
  assert.match(admin,/Nota\/Autocorreção/);
});

test('P9 release and cache are aligned',()=>{
  assert.match(release.version,/^14\.(?:9\.[0-9]+|10\.\d+)(?:\.\d+)?$/);
  assert.equal(version.release,`v${release.version}`);
  assert.match(version.version,/^0\.(?:21\.[0-9]+|22\.\d+)(?:\.\d+)?$/);
  assert.match(html,/app\.js\?v=14\.(?:9\.[0-9]+|10\.\d+)(?:\.\d+)?/);
  assert.match(app,/workspace\.js\?v=14\.(?:9\.[0-9]+|10\.\d+)(?:\.\d+)?/);
});
