import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const ws=fs.readFileSync(path.join(root,'atividades/assets/js/workspace.js'),'utf8');
const app=fs.readFileSync(path.join(root,'atividades/assets/js/app.js'),'utf8');
const html=fs.readFileSync(path.join(root,'atividades/index.html'),'utf8');
const release=JSON.parse(fs.readFileSync(path.join(root,'release-current.json'),'utf8'));
const version=JSON.parse(fs.readFileSync(path.join(root,'atividades/version.json'),'utf8'));
const recovery=await import(pathToFileURL(path.join(root,'atividades/assets/js/draft-recovery.js')).href+`?t=${Date.now()}`);

test('P10.3 recovers divergent legacy drafts instead of silently discarding them',()=>{
  const file={revision:8,saved_at:'2026-08-19T20:00:00Z'};
  assert.equal(recovery.shouldRecoverCachedDraft(file,{content:'local antigo',legacy:true,savedAt:0,remoteRevision:0},'nuvem'),true);
  assert.equal(recovery.shouldRecoverCachedDraft(file,{content:'igual',legacy:true},'igual'),false);
});

test('P10.3 revision-aware recovery resists client/server clock skew',()=>{
  const file={revision:8,saved_at:'2026-08-19T20:00:00Z'};
  // Same base revision means this is an unsynced local edit even if the client clock is behind.
  assert.equal(recovery.shouldRecoverCachedDraft(file,{content:'editado',savedAt:1,remoteRevision:8},'nuvem'),true);
  // A draft based on an older remote revision must not overwrite newer server content unless its timestamp is demonstrably newer.
  assert.equal(recovery.shouldRecoverCachedDraft(file,{content:'stale',savedAt:Date.parse('2026-08-19T19:59:00Z'),remoteRevision:7},'nuvem'),false);
  assert.equal(recovery.shouldRecoverCachedDraft(file,{content:'novo depois',savedAt:Date.parse('2026-08-19T20:01:00Z'),remoteRevision:7},'nuvem'),true);
});

test('P10.3 file switch and unmount create explicit save barriers',()=>{
  assert.match(ws,/if\(state\.active && state\.active\.id!==id\) await saveActiveFile\(false\)/);
  assert.match(ws,/export async function unmountWorkspace\(\)[\s\S]*await saveActiveFile\(false\)[\s\S]*await waitForPendingSaves\(\)[\s\S]*await stopSupervision\(\)/);
  assert.match(ws,/state\.saveQueues=new Map\(\)/);
});

test('P10.3 local draft is written immediately before debounce and lifecycle exit',()=>{
  assert.match(ws,/function scheduleSave\(\)[\s\S]*persistLocalDraft\(state\.active,state\.active\.content\)[\s\S]*setTimeout\(\(\)=>saveFileSnapshot\(fileId,content,false\),1200\)/);
  assert.match(ws,/window\.addEventListener\('beforeunload',protectActiveDraft\)/);
  assert.match(ws,/window\.addEventListener\('pagehide',[\s\S]*protectActiveDraft\(\)[\s\S]*saveActiveFile\(false\)/);
});

test('P10.3 double-open is guarded and failed mount is cleaned up',()=>{
  assert.match(app,/let exerciseOpening = false/);
  assert.match(app,/async function openExercise\(exercise\) \{\s*if\(exerciseOpening\)return;\s*exerciseOpening=true;/);
  assert.match(app,/await mountWorkspace\([\s\S]*catch \(error\)[\s\S]*await unmountWorkspace\(\)\.catch\(\(\)=>\{\}\)[\s\S]*finally\{\s*exerciseOpening=false/);
});

test('P10.3 preview and downloads always consume current editor content',()=>{
  assert.match(ws,/state\.files\.map\(f=>\(\{filename:f\.filename,content:f\.id===state\.active\?\.id\?\$\('code-editor'\)\.value:\(f\.content\|\|''\)/);
  assert.match(ws,/downloadTextFile\(file\.filename,content\)/);
  assert.match(ws,/createStoreZip\(files\)/);
  assert.doesNotMatch(ws,/createStoreZip\([^)]*reference/i);
});

test('P10.3 release, UI and cache busting are aligned',()=>{
  assert.equal(release.version,'14.10.8.18');
  assert.equal(version.version,'0.22.8.14');
  assert.equal(version.release,'v14.10.8.18');
  assert.match(html,/app\.js\?v=14\.10\.8/);
  assert.match(ws,/draft-recovery\.js\?v=14\.10\.8/);
  assert.match(app,/workspace\.js\?v=14\.10\.8/);
});
