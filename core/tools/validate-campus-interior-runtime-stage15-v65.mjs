import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'../..');
const file=path.join(root,'lobby/assets/lobby3d.js');
const src=fs.readFileSync(file,'utf8');
const checks=[];
const check=(name,ok)=>checks.push({name,ok:!!ok});

check('runtime exterior separado',src.includes("exteriorRoot.name='campus-exterior-runtime'"));
check('runtime interior separado',src.includes("interiorRoot.name='campus-interior-runtime'"));
check('interior inicia desmontado',src.includes('interiorRoot.visible=false'));
check('ambiente externo monta no exteriorRoot',src.includes('createCampusEnvironment({THREE,scene:exteriorRoot'));
check('portais montam no exteriorRoot',src.includes('createPortalSystem({THREE,scene:exteriorRoot'));
check('laboratório é lazy',src.includes('const ensureClassInterior=key=>')&&src.includes('labInterior({accent:color,key,title:zone.label,origin})'));
check('interior de ferramenta é lazy',src.includes('const ensureToolInterior=id=>')&&src.includes('room=toolInterior(profile)'));
check('saída descarta laboratório',src.includes('releaseClassInterior(key)')&&src.includes('disposeObject(room.group)'));
check('saída descarta interior de ferramenta',src.includes('releaseToolInterior(id)')&&src.includes('avatarSystem.disposeAvatar(room.receptionistAvatar)'));
check('exterior suspenso dentro do prédio',src.includes('exteriorRoot.visible=!inside')&&src.includes('interiorRoot.visible=inside'));
check('câmera usa apenas colisões do interior quando montado',src.includes('activeInterior||activeToolInterior?activeInteriorCollisionRoots:cameraCollisionRoots'));
check('objetos de interação internos têm ciclo próprio',src.includes('__interiorScope')&&src.includes('removeScopedWorldObjects'));
check('avatares remotos ficam no runtime externo',src.includes('exteriorRoot.add(avatar);const w=presenceToWorld'));
check('atualizações externas param no interior',src.includes('const insideRuntime=!!activeInterior||!!activeToolInterior')&&src.includes('if(!insideRuntime){updateCampusClock(nowMs);updateActivityBoard();updateChallenge(nowMs,motionTime);}'));
check('tráfego externo é pausado no interior',src.includes('const exteriorActive=!activeInterior&&!activeToolInterior;'));
check('entrada de ferramenta monta sob demanda',src.includes('const room=ensureToolInterior(id)'));
check('entrada de laboratório monta sob demanda',src.includes('const r=ensureClassInterior(key)'));
check('teleporte desmonta interior ativo',src.includes("runtime:'unmounted'"));

let failed=0;
for(const c of checks){console.log(`${c.ok?'PASS':'FAIL'} ${c.name}`);if(!c.ok)failed++;}
console.log(`\n${checks.length-failed}/${checks.length} PASS`);
if(failed)process.exit(1);
