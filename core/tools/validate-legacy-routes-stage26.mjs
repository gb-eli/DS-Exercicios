import fs from 'node:fs';
import path from 'node:path';

const ROOT=process.cwd();
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const catalog=JSON.parse(read('core/catalog/platform-integration-v14.0.json'));
const legacy=JSON.parse(read('core/catalog/legacy-routes-v14.0.json'));
const checks=[];
const check=(name,ok,detail='')=>{checks.push({name,ok:!!ok,detail});console.log(`${ok?'PASS':'FAIL'} - ${name}${detail?` — ${detail}`:''}`);};

check('catálogo mantém 10 plataformas canônicas',catalog.platforms?.length===10,`version=${catalog.version}`);
check('ids canônicos são únicos',new Set(catalog.platforms.map(p=>p.id)).size===10);
check('10 rotas canônicas existem',catalog.platforms.every(p=>fs.existsSync(path.join(ROOT,p.route))));
check('catálogo mantém aliases históricos',legacy.aliases?.length>=13,`aliases=${legacy.aliases?.length||0}`);
check('todos os aliases existem',legacy.aliases.every(a=>fs.existsSync(path.join(ROOT,a.legacy))));
check('aliases são diretórios mínimos',legacy.aliases.every(a=>{const dir=path.dirname(path.join(ROOT,a.legacy));return fs.readdirSync(dir,{withFileTypes:true}).filter(x=>x.isFile()).map(x=>x.name).join(',')==='index.html';}));
check('stubs usam autenticação unificada',legacy.aliases.every(a=>/unified-auth-guard\.js/.test(read(a.legacy))&&/AGVUnifiedAuth\?\.readSession/.test(read(a.legacy))));
check('stubs preservam query e hash',legacy.aliases.every(a=>/target\.search=location\.search/.test(read(a.legacy))&&/target\.hash=location\.hash/.test(read(a.legacy))));
check('stubs apontam para o destino declarado',legacy.aliases.every(a=>read(a.legacy).includes(JSON.stringify(a.canonical))));
check('stubs não reintroduzem login por senha',legacy.aliases.every(a=>!/signInWithPassword|service_role|SUPABASE_SERVICE/i.test(read(a.legacy))));
check('alias histórico FLIPDS foi restaurado',fs.existsSync(path.join(ROOT,'sistemas/05-fliperama-ds/FLIPDS/index.html')));
check('resolução de alias preserva parâmetros',legacy.aliases.every(a=>{const base=new URL(`https://example.invalid/${a.legacy}?returnTo=atividades%2F#checkpoint`);const target=new URL(a.canonical,base);target.search=base.search;target.hash=base.hash;return target.search==='?returnTo=atividades%2F'&&target.hash==='#checkpoint';}));

const failed=checks.filter(c=>!c.ok);
console.log(`\nStage26 legacy routes: ${checks.length-failed.length}/${checks.length} PASS`);
if(failed.length)process.exit(1);
