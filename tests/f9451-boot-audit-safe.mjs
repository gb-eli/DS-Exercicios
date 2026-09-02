import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root=path.resolve(process.argv[2]||'.');
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const checks=[];
const ok=(name,value,detail='')=>checks.push({name,pass:!!value,detail});

const boot=read('lobby/assets/boot.js');
const sw=read('lobby/sw.js');
const lobby=read('lobby/assets/lobby.js');
const managerSrc=read('lobby/assets/core/world-manager.js');
const adapterSrc=read('lobby/assets/core/world-adapter.js');
const html=read('lobby/index.html');

ok('audit_not_boot_required',!/requiredAssets=\[[^\]]*world-runtime-audit/s.test(boot),'world-runtime-audit fora de requiredAssets');
ok('audit_not_sw_critical',!sw.split('const OPTIONAL_SHELL=')[0].includes('world-runtime-audit.js'),'auditoria fora do CRITICAL_SHELL');
ok('audit_is_sw_optional',sw.split('const OPTIONAL_SHELL=')[1]?.includes('world-runtime-audit.js'),'auditoria no OPTIONAL_SHELL');
ok('manager_has_no_static_audit_import',!managerSrc.includes("from './world-runtime-audit.js"),'world-manager tolera auditoria ausente');
ok('adapter_has_no_static_audit_import',!adapterSrc.includes("from './world-runtime-audit.js"),'world-adapter tolera auditoria ausente');
ok('lobby_lazy_loads_audit',lobby.includes("import('./core/world-runtime-audit.js?v=14.10.8.96-f9451-audit-safe')")&&lobby.includes('world_audit_optional_unavailable'),'import lazy com fallback');
ok('login_error_target_exists',html.includes('id="login-message"'),'falhas de boot ficam visíveis');
ok('cache_bust_stage67',html.includes('stage67-f9451-audit-safe')&&sw.includes('stage67-f9451-audit-safe'),'cadeia nova de cache');
ok('auth_and_runtime_errors_are_separated',lobby.includes('lobby_authenticated_boot_failed')&&lobby.includes("if(!session){redirectToUnifiedLogin();return;}"),'falha de runtime não vira loop de login');

// WorldManager must work with the audit module completely absent.
delete globalThis.__agvWorldRuntimeAudit;
const managerUrl=pathToFileURL(path.join(root,'lobby/assets/core/world-manager.js')).href+`?t=${Date.now()}`;
const {createWorldManager}=await import(managerUrl);
const state={worldId:'x',scene:'x',runtimeMode:'lite',runtimeStatus:'idle',runtimeRevision:0};
const manager=createWorldManager({worldState:state});
const runtime={stop(){this.stopped=true}};
const adapter={id:'test-world',scene:'test',label:'Test',auditEnabled:true,supports:m=>m==='lite',async createRuntime(){return runtime}};
const started=await manager.start({adapter,mode:'lite',context:{}});
ok('manager_starts_without_audit',started===runtime&&state.runtimeStatus==='ready','observabilidade ausente não impede runtime');
manager.stop('test');
ok('manager_stops_without_audit',state.runtimeStatus==='idle','stop tolerante à ausência');

// Audit module itself must be importable even outside a browser DOM.
const auditUrl=pathToFileURL(path.join(root,'lobby/assets/core/world-runtime-audit.js')).href+`?t=${Date.now()}`;
const {WORLD_RUNTIME_AUDIT}=await import(auditUrl);
WORLD_RUNTIME_AUDIT.registerWorlds([{id:'test-world',scene:'test',name:'Teste',enabled:true,capabilities:{lite:true}}]);
ok('audit_optional_module_imports',WORLD_RUNTIME_AUDIT.snapshot({compact:true}).worldCount>=1,'módulo opcional inicializa defensivamente');

const pass=checks.filter(c=>c.pass).length;
const result={suite:'F94.5.1 boot audit safe',pass,total:checks.length,failed:checks.filter(c=>!c.pass),checks};
console.log(JSON.stringify(result,null,2));
if(pass!==checks.length)process.exit(1);
