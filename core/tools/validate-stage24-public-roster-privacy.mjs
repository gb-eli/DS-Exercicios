import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const release=JSON.parse(read('release-current.json'));
const deploy=JSON.parse(read('PUBLIC-DEPLOY.json'));
const migration=read('core/database/049_p10919_pedagogical_adaptations.sql');
const checks=[];
const ok=(name,fn)=>{fn();checks.push(name);console.log(`PASS ${checks.length}: ${name}`)};

ok('release declara seed nominal separado',()=>assert.equal(release.privacy?.private_roster_seed_separate,true));
ok('release declara nomes fora do bundle público',()=>assert.equal(release.privacy?.student_names_in_public_bundle,false));
ok('release declara exclusão dos sources privados do deploy',()=>assert.equal(release.privacy?.public_deploy_excludes_private_roster_sources,true));
ok('core/database não é caminho público',()=>assert.equal((deploy.publicFrontendPaths||[]).includes('core/database/'),false));
ok('core/database está em neverPublishAsStatic',()=>assert.ok((deploy.neverPublishAsStatic||[]).includes('core/database/')));
ok('roster vive no schema private',()=>assert.match(migration,/create table if not exists private\.pedagogical_adaptation_roster/));
ok('anon/authenticated não têm acesso ao roster',()=>assert.match(migration,/revoke all on table private\.pedagogical_adaptation_roster from public, anon, authenticated/));
ok('migration versionada não contém seed nominal do roster',()=>assert.doesNotMatch(migration,/insert\s+into\s+private\.pedagogical_adaptation_roster/i));

const textExt=new Set(['.js','.mjs','.html','.css','.json','.txt','.md']);
const forbidden=/private\.pedagogical_adaptation_roster|insert\s+into\s+[^\n;]*adaptation_roster|diagnosis_text|clinical_reason|medical_reason|laudo_text/i;
const hits=[];
function scan(target){
  if(!fs.existsSync(target))return;
  const st=fs.statSync(target);
  if(st.isDirectory()){for(const name of fs.readdirSync(target))scan(path.join(target,name));return;}
  if(!textExt.has(path.extname(target).toLowerCase()))return;
  const text=fs.readFileSync(target,'utf8');
  if(forbidden.test(text))hits.push(path.relative(root,target));
}
for(const rel of deploy.publicFrontendPaths||[]){
  if(rel.endsWith('/'))scan(path.join(root,rel));
  else scan(path.join(root,rel));
}
ok('caminhos publicáveis não contêm roster privado ou campos clínicos',()=>assert.deepEqual(hits,[]));
console.log(`\nStage 24: ${checks.length}/${checks.length} PASS`);
