import fs from 'node:fs'; import vm from 'node:vm';
function load(file,varname){const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});return ctx.window[varname]||[]}
const defs=[
 ['lab-sub','programacao-front-end-sub','sistemas/07-lab-exercicios-sub/versao-aluno/data/exercicios.js','EXERCICIOS_FRONTEND'],
 ['lab-sub','programacao-mobile-sub','sistemas/07-lab-exercicios-sub/versao-aluno/data/mobile-exercicios.js','EXERCICIOS_MOBILE'],
 ['lab-ds1','introducao-programacao','sistemas/08-lab-exercicios-ds1/modo-aluno/data/exercicios.js','EXERCICIOS'],
 ['lab-ds2','programacao-front-end','sistemas/09-lab-exercicios-ds2/modo-aluno/frontend/data/exercicios.js','EXERCICIOS'],
 ['lab-ds2','inovacao-tecnologica-empreendedorismo','sistemas/09-lab-exercicios-ds2/modo-aluno/inovacao/data/atividades.js','ATIVIDADES_INOVACAO'],
 ['lab-ds3','programacao-desenvolvimento-sistemas','sistemas/10-lab-exercicios-ds3/modo-aluno/data/exercicios.js','EXERCICIOS'],
];
const records=[];
for(const [platform,subject,file,v] of defs){for(const x of load(file,v)){records.push({platform_code:platform,activity_id:`exercise:${subject}:${String(x.numero).padStart(2,'0')}`,name:x.titulo||x.nomeCurto||`Exercício ${x.numero}`,subject,number:Number(x.numero),minimum_seconds:Number(x.tempoMinimoSegundos||0),reward_policy:'no_economic_reward',metadata:{kind:'exercise',subject,number:Number(x.numero),legacyCode:x.codigo||null,minimumSeconds:Number(x.tempoMinimoSegundos||0),source:'canonical-student-bundle'}})}}
const ad=JSON.parse(fs.readFileSync('sistemas/08-lab-exercicios-ds1/modo-aluno/disciplinas/analise-metodos/data/analysis-data.json','utf8'));
for(let n=1;n<=3;n++){const x=ad[`activity${String(n).padStart(2,'0')}`];records.push({platform_code:'lab-ds1',activity_id:`exercise:analise-metodo-sistemas:${String(n).padStart(2,'0')}`,name:x.titulo||`Atividade ${n}`,subject:'analise-metodo-sistemas',number:n,minimum_seconds:0,reward_policy:'no_economic_reward',metadata:{kind:'exercise',subject:'analise-metodo-sistemas',number:n,source:'canonical-student-bundle'}})}
records.sort((a,b)=>a.platform_code.localeCompare(b.platform_code)||a.subject.localeCompare(b.subject)||a.number-b.number);
if(records.length!==88) throw new Error(`expected 88 got ${records.length}`);
fs.writeFileSync('core/catalog/lab-exercises-88.json',JSON.stringify({version:'1.0.0',generatedAt:new Date().toISOString(),records},null,2));
function q(s){return `'${String(s).replaceAll("'","''")}'`};
const groups=[]; for(let i=0;i<records.length;i+=15) groups.push(records.slice(i,i+15));
for(let i=0;i<groups.length;i++){
 let sql=['-- Generated safe catalog seed. No teacher answers included.'];
 for(const r of groups[i]) sql.push(`insert into public.activity_catalog(platform_id,activity_id,name,reward_policy,max_xp,max_points,max_coins,repeatable,active,metadata,updated_at) select p.id,${q(r.activity_id)},${q(r.name)},'no_economic_reward',0,0,0,false,true,${q(JSON.stringify(r.metadata))}::jsonb,now() from public.platforms p where p.code=${q(r.platform_code)} and p.active=true on conflict(platform_id,activity_id) do update set name=excluded.name,reward_policy='no_economic_reward',max_xp=0,max_points=0,max_coins=0,repeatable=false,active=true,metadata=excluded.metadata,updated_at=now();`);
 fs.writeFileSync(`core/database/021_lab_exercises_catalog_${String(i+1).padStart(2,'0')}.sql`,sql.join('\n'));
}
console.log(JSON.stringify({records:records.length,byPlatform:Object.fromEntries([...new Set(records.map(r=>r.platform_code))].map(p=>[p,records.filter(r=>r.platform_code===p).length])),chunks:groups.length},null,2));
