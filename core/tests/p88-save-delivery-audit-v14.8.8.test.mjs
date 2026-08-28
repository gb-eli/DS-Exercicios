import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const ws=fs.readFileSync(path.join(root,'atividades/assets/js/workspace.js'),'utf8');
const html=fs.readFileSync(path.join(root,'atividades/index.html'),'utf8');
const release=JSON.parse(fs.readFileSync(path.join(root,'release-current.json'),'utf8'));
const version=JSON.parse(fs.readFileSync(path.join(root,'atividades/version.json'),'utf8'));
const migration=fs.readFileSync(path.join(root,'core/database/025_student_delivery_repositories_by_subject.sql'),'utf8');

test('P8.8 serializes cloud writes and protects newer in-memory content from stale responses',()=>{
  assert.match(ws,/saveQueues:new Map\(\)/);
  assert.match(ws,/function saveFileSnapshot\(fileId,content,force=false\)/);
  assert.match(ws,/const previous=state\.saveQueues\.get\(fileId\)\|\|Promise\.resolve\(\)/);
  assert.match(ws,/then\(\(\)=>performFileSave\(fileId,content,force\)\)/);
  assert.match(ws,/if\(String\(file\.content\?\?''\)===String\(content\?\?''\)\)file\.content=data\.content/);
  assert.match(ws,/if\(currentContent===data\.content\)localStorage\.removeItem\(cacheKey\(file\)\)/);
});

test('P8.8 waits pending autosaves before save_all and downloads only student files',()=>{
  assert.match(ws,/async function waitForPendingSaves\(\)/);
  assert.match(ws,/for\(let pass=0;pass<8&&state\.saveQueues\.size;pass\+=1\)/);
  assert.match(ws,/await waitForPendingSaves\(\)/);
  assert.match(ws,/action:'save_all'/);
  assert.match(ws,/createStoreZip\(files\)/);
  assert.doesNotMatch(ws,/createStoreZip\([^)]*reference/i);
  assert.match(html,/id="download-current-btn"/);
  assert.match(html,/id="download-zip-btn"/);
});

test('P8.8 manual save only claims cloud success after server confirmation and page lifecycle preserves drafts',()=>{
  assert.match(ws,/async function manualSaveFeedback\(\)/);
  assert.match(ws,/result\?\.synced&&result\?\.current!==false/);
  assert.match(ws,/Código preservado localmente; a nuvem não confirmou o salvamento/);
  assert.match(ws,/window\.addEventListener\('beforeunload',protectActiveDraft\)/);
  assert.match(ws,/window\.addEventListener\('pagehide'/);
  assert.match(ws,/document\.addEventListener\('visibilitychange'/);
});

test('P8.8 GitHub is scoped per subject while legacy repository_url remains compatible',()=>{
  assert.match(migration,/repository_urls jsonb not null default '\{\}'::jsonb/);
  assert.match(ws,/select\('repository_url,repository_urls'\)/);
  assert.match(ws,/\[repositoryKey\(\)\]:repository/);
  assert.match(ws,/state\.repositoryUrl=perSubject\|\|null/);
  assert.match(ws,/state\.legacyRepositoryUrl=data\?\.repository_url\|\|null/);
  assert.match(ws,/state\.legacyRepositoryUrl\|\|`https:\/\/github\.com\/`/);
});

test('P8.8 Classroom uses exact class+subject mapping and never falls back to generic Classroom home',()=>{
  assert.match(ws,/CLASSROOM_FALLBACKS/);
  assert.match(ws,/eq\('class_id',state\.classId\)\.eq\('subject_id',state\.subject\.id\)/);
  assert.match(ws,/if\(!url\)throw new Error\('Classroom desta turma e disciplina ainda não foi configurado\.'/);
  assert.doesNotMatch(ws,/state\.classroomUrl\|\|'https:\/\/classroom\.google\.com\/'/);
});

test('P8.8 store ZIP is structurally valid',async()=>{
  const mod=await import(pathToFileURL(path.join(root,'atividades/assets/js/downloads.js')).href+`?test=${Date.now()}`);
  const blob=mod.createStoreZip([
    {filename:'index.html',content:'<!doctype html><title>Teste</title>'},
    {filename:'style.css',content:'body{margin:0}'},
    {filename:'script.js',content:'console.log("ok")'}
  ],{date:new Date('2026-08-19T08:00:00Z')});
  const tmp=path.join(os.tmpdir(),`agv-p88-${process.pid}-${Date.now()}.zip`);
  fs.writeFileSync(tmp,Buffer.from(await blob.arrayBuffer()));
  execFileSync('unzip',['-t',tmp],{stdio:'pipe'});
  fs.unlinkSync(tmp);
});

test('P8.8 release and cache busting remain aligned in later compatible releases',()=>{
  const [major,minor,patch]=String(release.version).split('.').map(Number);
  const [uiMajor,uiMinor,uiPatch]=String(version.version).split('.').map(Number);
  assert.ok(major>14||(major===14&&(minor>8||(minor===8&&patch>=8))));
  assert.equal(typeof release.requiresDatabaseChange,'boolean');
  assert.ok(uiMajor>0||(uiMajor===0&&(uiMinor>20||(uiMinor===20&&uiPatch>=8))));
  assert.equal(version.release,`v${release.version}`);
  const escaped=String(release.runtimeCacheVersion||release.version).replaceAll('.', '\\.');
  assert.match(html,new RegExp(`app\\.js\\?v=${escaped}`));
  assert.match(ws,new RegExp(`exercise-manifest\\.js\\?v=${escaped}`));
});
