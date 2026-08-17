import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const lobby=read('lobby/assets/lobby.js');
const lobbyHtml=read('lobby/index.html');
const mig=read('core/database/028_p4_lobby_staff_moderation_security.sql');
const moderation=read('core/edge-functions/lobby-moderation/index.ts');
const supervision=read('core/edge-functions/supervision/index.ts');
const staff=read('core/edge-functions/staff-directory/index.ts');
const app=read('atividades/assets/js/app.js');
const workspace=read('atividades/assets/js/workspace.js');
const bridge=read('sistemas/01-lab-virtual/LABDS/lab/js/agv-core-bridge.js');
const checks=[
 ['sem senha compartilhada no runtime',![lobby,app,staff,bridge].some(x=>x.includes('agv@2026'))],
 ['equipe entra no lobby',['teacher','admin','super_admin'].every(x=>lobby.includes(x))&&lobbyHtml.includes('staff-mode')],
 ['interação alvo',lobby.includes('interaction_target_id')&&lobbyHtml.includes('data-target-emote')],
 ['expulsão server-side',lobby.includes("functions.invoke('lobby-moderation'")&&moderation.includes("action==='kick'")&&mig.includes('lobby_blocks')],
 ['confirmação antes de expulsar',lobby.includes('A conta, a matrícula e as atividades não serão afetadas.')&&lobby.includes('confirm(`Expulsar')],
 ['lista expulsões ativas',moderation.includes("action==='list_blocks'")&&lobby.includes('loadModeration')&&lobbyHtml.includes('moderation-list')],
 ['readmissão antecipada',moderation.includes("action==='unblock'")&&lobby.includes('unblockStudent')&&lobby.includes('Readmitir agora')],
 ['professor escopado',moderation.includes('if(!isAdmin)')&&moderation.includes("teacher_classes")&&moderation.includes('student_out_of_scope')],
 ['expulsão não desativa perfil',!moderation.includes("from('profiles').update({active:false")],
 ['heartbeat reduzido',lobby.includes('n-state.lastPresence<5000')&&lobby.includes('setTimeout(poll,4000)')],
 ['start supervisionado revalida release',supervision.includes("action==='start_session'")&&supervision.includes("await released(user.id,eid)")],
 ['legacy exige release',supervision.includes("action==='legacy_submit'")&&supervision.includes("await released(user.id,eid)")],
 ['legacy não libera próximo no submit',supervision.includes('approval_required:true')&&supervision.includes('next_exercise:null')],
 ['aprovação libera próximo',supervision.includes("action==='review_legacy'")&&supervision.includes("from('exercise_releases')")],
 ['RPC econômico legado revogado',mig.includes('revoke execute on function public.claim_core_reward')&&mig.includes('from public,anon,authenticated')],
 ['staff provisionado individualmente',staff.includes('temporaryPassword')&&staff.includes('provisioned_by_admin:true')&&mig.includes('STAFF_SELF_SIGNUP_DISABLED')],
 ['workspace sem guidance innerHTML',!workspace.includes('guidance.innerHTML')&&workspace.includes('objective.textContent')],
 ['class_id explícito é exclusivo',supervision.includes('if(e.class_id)return e.class_id===cid')],
];
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} — ${name}`);if(!ok)process.exitCode=1}
