import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {LESSONS,APP_VERSION,DATA_SCHEMA_VERSION} from '../assets/js/data.js';
import {REGISTRY,EDUAUTH_ENVIRONMENT,EDUAUTH_PRODUCTION_PROVISIONED} from '../assets/js/eduauth/config.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.name==='node_modules'?[]:entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);
const files=walk(root);

assert.equal(APP_VERSION,'2.5.7');
assert.equal(DATA_SCHEMA_VERSION,24);
assert.equal(EDUAUTH_ENVIRONMENT,'development');
assert.equal(EDUAUTH_PRODUCTION_PROVISIONED,false);

for(const lesson of LESSONS){
  assert.equal(Object.hasOwn(lesson,'password'),false,`Aula ${lesson.id} ainda possui senha fixa.`);
  assert.ok(Object.values(REGISTRY.lessons).includes(lesson.id.toLowerCase()),`Aula não registrada no EduAuth: ${lesson.id}`);
}

const requiredReturnFiles=[
  'eduauth-platform-manifest.json','eduauth-action-registry.json','eduauth-integration-report.md',
  'eduauth-test-vectors.json','eduauth-provisioning-template.json'
];
for(const name of requiredReturnFiles)assert.ok(fs.existsSync(path.join(root,'eduauth',name)),`Arquivo de retorno ausente: ${name}`);

const requiredGovernanceFiles=[
  'TERMS.md','PRIVACY.md','SIMULATION_NOTICE.md','PERMISSIONS.md','EDUCATIONAL_USE.md','ASSESSMENT.md',
  'SECURITY.md','CREDITS.md','terms-manifest.json','permissions-manifest.json','assessment-rubric.json',
  'version-manifest.json','curriculum-plan.json','contributors.config.json','economy-manifest.json','KNOWN_ISSUES.md','PUBLICATION_CHECKLIST.md'
];
for(const name of requiredGovernanceFiles)assert.ok(fs.existsSync(path.join(root,name)),`Entregável transversal ausente: ${name}`);


for(const file of files.filter(file=>file.endsWith('.json')))JSON.parse(fs.readFileSync(file,'utf8'));

const privateJwkKeys=new Set(['d','p','q','dp','dq','qi','oth']);
const scanPrivate=(value,where)=>{
  if(Array.isArray(value))return value.forEach((item,index)=>scanPrivate(item,`${where}[${index}]`));
  if(!value||typeof value!=='object')return;
  for(const [key,item] of Object.entries(value)){
    assert.equal(privateJwkKeys.has(key),false,`Parâmetro privado JWK encontrado em ${where}.${key}`);
    scanPrivate(item,`${where}.${key}`);
  }
};
for(const file of files.filter(file=>file.endsWith('.json')))scanPrivate(JSON.parse(fs.readFileSync(file,'utf8')),path.relative(root,file));

for(const file of files.filter(file=>/\.(js|json|html|md)$/i.test(file))){
  const text=fs.readFileSync(file,'utf8');
  assert.equal(/BEGIN (?:RSA |EC )?PRIVATE KEY/.test(text),false,`PEM privado encontrado em ${path.relative(root,file)}`);
}

for(const file of files.filter(file=>file.includes(`${path.sep}assets${path.sep}js${path.sep}eduauth${path.sep}`)&&file.endsWith('.js'))){
  assert.equal(fs.readFileSync(file,'utf8').includes('Math.random'),false,`Math.random encontrado em ${path.relative(root,file)}`);
}

const jsFiles=files.filter(file=>file.endsWith('.js'));
for(const file of jsFiles){
  const text=fs.readFileSync(file,'utf8');
  const importPattern=/(?:import|export)\s+(?:[^'\"]+?\s+from\s+)?['\"]([^'\"]+)['\"]/g;
  for(const match of text.matchAll(importPattern)){
    const ref=match[1].split('?')[0];
    if(ref.startsWith('.'))assert.ok(fs.existsSync(path.resolve(path.dirname(file),ref)),`Import ausente: ${path.relative(root,file)} -> ${ref}`);
  }
}

const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const assetBlock=sw.match(/const CORE_ASSETS=\[(.*?)\];/s)?.[1]||'';
for(const match of assetBlock.matchAll(/'([^']+)'/g)){
  const ref=match[1];if(ref==='./')continue;
  assert.ok(fs.existsSync(path.join(root,ref.replace(/^\.\//,''))),`Recurso offline ausente: ${ref}`);
}


for(const file of files.filter(file=>/\.(js|html)$/i.test(file)&&!file.includes(`${path.sep}tests${path.sep}`))){
  const text=fs.readFileSync(file,'utf8');
  assert.equal(/\beval\s*\(/.test(text),false,`eval encontrado em ${path.relative(root,file)}`);
  assert.equal(/new\s+Function\s*\(/.test(text),false,`new Function encontrado em ${path.relative(root,file)}`);
  assert.equal(/(?:href|src)\s*=\s*["']javascript:/i.test(text),false,`URL javascript: encontrada em ${path.relative(root,file)}`);
}
const economy=JSON.parse(fs.readFileSync(path.join(root,'economy-manifest.json'),'utf8'));
assert.equal(economy.store.enabled,false);
assert.equal(economy.wallet.enabled,false);
assert.equal(economy.virtualCurrency.enabled,false);
assert.equal(economy.xp.affectsGrade,false);

console.log(`Validação estática aprovada: ${LESSONS.length} aulas, ${jsFiles.length} arquivos JavaScript e ${requiredReturnFiles.length} arquivos EduAuth de retorno.`);

const appJs=fs.readFileSync(path.join(root,'assets/js/app.js'),'utf8');
const completionPdf=fs.readFileSync(path.join(root,'assets/js/completion-pdf.js'),'utf8');
assert.match(appJs,/activityLog/,'Registro detalhado da sessão ausente');
assert.match(completionPdf,/Linha do tempo das ações|Histórico da sessão/,'PDF sem histórico da sessão');

