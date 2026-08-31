import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('painel GitHub privado existe e não possui escrita remota',()=>{
 const html=read('professor/index.html'),js=read('professor/assets/legacy-github-review.js');
 assert.match(html,/teacher-github-audit-toggle/);assert.match(html,/github-audit-file/);assert.match(html,/legacy-github-review\.js\?v=14\.10\.8\.65/);
 assert.match(js,/localStorage/);assert.match(html,/Exportar decisões/);assert.doesNotMatch(js,/\/rest\/v1\//);assert.doesNotMatch(js,/functions\/v1/);assert.doesNotMatch(js,/fetch\s*\(/);
 assert.match(js,/subject_scope_mismatch/);assert.match(js,/identity_scope_mismatch/);assert.match(js,/wrong_exercise/);
});
test('bundle publicável não embarca relatórios identificáveis GitHub',()=>{
 const deploy=JSON.parse(read('PUBLIC-DEPLOY.json'));
 const leaked=[];
 const isLeak=name=>/(?:AUDITORIA-GITHUB|GITHUB-(?:AUDIT|AUDITORIA|RELATORIO)).*\.(?:json|csv)$/i.test(name);
 const walk=dir=>{if(!fs.existsSync(dir))return;for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else if(isLeak(entry.name))leaked.push(path.relative(root,full));}};
 for(const publicPath of deploy.publicFrontendPaths||[]){const full=path.join(root,publicPath);if(fs.existsSync(full)&&fs.statSync(full).isDirectory())walk(full);else if(fs.existsSync(full)&&isLeak(path.basename(full)))leaked.push(publicPath);}
 assert.deepEqual(leaked,[]);
 assert.ok((deploy.neverPublishAsStatic||[]).some(v=>String(v).startsWith('core/tests')),'fixtures de auditoria devem permanecer fora do bundle estático');
});
test('migration 046 é somente infraestrutura de revisão e não baixa aluno',()=>{
 const sql=read('core/database/046_p1096_github_teacher_review_fields.sql');
 for(const table of ['legacy_exercise_claims','student_exercises','student_files','student_file_history']) assert.doesNotMatch(sql,new RegExp(`(?:insert\\s+into|update|delete\\s+from|truncate)\\s+(?:public\\.)?${table}`,'i'));
 assert.match(sql,/review_score/);assert.match(sql,/teacher_feedback/);assert.match(sql,/reviewed_at/);
});
test('release .7 mantém gate de produção fechado',()=>{
 const d=JSON.parse(read('release-current.json'));assert.equal(d.version,'14.10.8.65');assert.equal(d.productionWriteApproved,false);assert.equal(d.liveDeployApplied,false);assert.equal(d.backupConfirmed,false);
});
