import { createRequest, formatPin, parseRequestCode, generatePin, ACTIONS, POLICIES } from './eduauth/core.js?v=20260811r38';
import { GUIDED_REINFORCEMENT_V4 } from './guided-v4.js?v=20260811r38';

let refreshTimer=null;
const formatClock=seconds=>`${String(Math.floor(Math.max(0,seconds)/60)).padStart(2,'0')}:${String(Math.max(0,seconds)%60).padStart(2,'0')}`;
const lessonStageLabel=stage=>({explain:'Explicação',demo:'Demonstração',quiz:'Revisão',sheet:'Prática',formula:'Fórmula','office-lab':'Planilha','email-lab':'E-mail','document-lab':'Documento','presentation-lab':'Apresentação',challenge:'Desafio'}[stage.type]||stage.type);

// Mantido como leitura de compatibilidade: desde a v2.5.7 nenhuma aula exige PIN de entrada.
export async function getLessonCodeSnapshot({lesson}){
  if(!lesson?.id||!lesson?.classId)throw new Error('Aula inválida.');
  return {lessonId:lesson.id,classId:lesson.classId,openAccess:true,pin:'',formattedPin:'',code:'',fixed:false};
}

export async function getClassReleaseCodeSnapshot({classId,nowMs=Date.now()}){
  const current=await createRequest({modeName:'CLASS_SHARED_PIN',actionId:'early-completion',classId,lessonId:'platform-general',activityId:'class-release',resourceId:'platform-general',nowMs});
  const windowSeconds=POLICIES.classReleaseWindowSeconds||3600,validUntilMs=(current.context.timeSlot+1)*windowSeconds*1000;
  return {classId,pin:current.pin,formattedPin:formatPin(current.pin),code:current.code,slot:current.context.timeSlot,validUntilMs,secondsRemaining:Math.max(0,Math.ceil((validUntilMs-nowMs)/1000))};
}

export async function getAuthorizationPinSnapshot(code,{nowMs=Date.now()}={}){
  const parsed=parseRequestCode(String(code||''));const context=parsed.context,action=ACTIONS[context.actionId];
  if(!['early-completion','result-release'].includes(context.actionId))throw new Error(`A solicitação é para “${action?.label||context.actionId}”.`);
  const pin=await generatePin(context);return {pin,formattedPin:formatPin(pin),context,action,expiresAt:(context.timeSlot+1)*(POLICIES.classReleaseWindowSeconds||3600),code:parsed.formatted};
}

export function lessonCodePanelHTML({lessons,classes,esc}){
  const classOptions=Object.entries(classes).map(([id,item])=>`<option value="${esc(id)}" ${id==='1ADM'?'selected':''}>${esc(item.label)}</option>`).join('');
  const lessonOptions=lessons.filter(lesson=>lesson.classId==='1ADM').map(lesson=>`<option value="${esc(lesson.id)}" ${lesson.id==='1ADM-04'?'selected':''}>Aula ${lesson.order} — ${esc(lesson.title)}</option>`).join('');
  return `<section class="panel panel-pad teacher-code-panel" id="lessonCodePanel">
    <div class="section-title" style="margin-top:0"><div><span class="hero-kicker">ACESSO ÀS AULAS</span><h2>Aulas abertas e liberação coletiva</h2><p>Todas as aulas do 1º e do 2º ADM estão liberadas sem senha. O código coletivo permanece disponível somente para antecipar PDF ou resultado durante a hora atual.</p></div><span class="terms-status valid" id="codeEnvironment">Acesso aberto</span></div>
    <div class="form-grid teacher-code-controls"><div class="field"><label for="codeClass">Turma</label><select class="select" id="codeClass">${classOptions}</select></div><div class="field"><label for="codeLesson">Revisar aula</label><select class="select" id="codeLesson">${lessonOptions}</select></div></div>
    <div class="teacher-code-display" aria-live="polite">
      <div class="teacher-pin-card open-access"><small>Entrada nas aulas</small><strong>ACESSO LIVRE</strong><span>O estudante entra diretamente pela própria turma, sem senha.</span></div>
      <div class="teacher-pin-card authorization"><small>Código coletivo opcional</small><strong id="teacherReleasePin">---- ----</strong><span>Antecipar PDF/resultado · válido por <b id="teacherReleaseCountdown">--:--</b></span><button class="btn btn-primary btn-small" id="copyReleasePin">Copiar liberação</button></div>
    </div>
    <div class="info-grid teacher-lesson-summary"><div class="info-card success"><h4 id="teacherLessonTitle">Carregando aula...</h4><p id="teacherLessonSubtitle"></p><div id="teacherLessonObjectives"></div></div><div class="info-card"><h4>Como funciona</h4><ol class="teacher-flow"><li>O aluno escolhe a turma e entra diretamente na aula.</li><li>O progresso fica salvo para continuar em casa ou recuperar atividades atrasadas.</li><li>Ao terminar, a atividade já fica concluída e salva.</li><li>O PDF é liberado automaticamente após 5 minutos de sessão; o código coletivo pode antecipar quando necessário.</li></ol></div></div>
    <details class="eduauth-signed teacher-code-details"><summary>Detalhes técnicos da liberação</summary><p><strong>Solicitação coletiva da turma:</strong></p><code id="teacherReleaseCode">Carregando...</code><div class="action-cluster"><button class="btn btn-secondary btn-small" id="refreshTeacherCode">Atualizar agora</button></div></details>
    <p class="eduauth-status" id="teacherCodeStatus"></p>
  </section>`;
}

export function unmountLessonCodePanel(){if(refreshTimer){clearInterval(refreshTimer);refreshTimer=null}}

export async function mountLessonCodePanel(root,{lessons,classes,esc,toast}){
  unmountLessonCodePanel();const panel=root.querySelector('#lessonCodePanel');if(!panel)return;
  const classSelect=panel.querySelector('#codeClass'),lessonSelect=panel.querySelector('#codeLesson');let releaseSnapshot=null;
  const selectedLesson=()=>lessons.find(lesson=>lesson.id===lessonSelect.value);
  const updateLessonOptions=()=>{const available=lessons.filter(lesson=>lesson.classId===classSelect.value);lessonSelect.innerHTML=available.map(lesson=>`<option value="${esc(lesson.id)}">Aula ${lesson.order} — ${esc(lesson.title)}</option>`).join('');const preferredId=classSelect.value==='1ADM'?'1ADM-04':'2ADM-01';lessonSelect.value=(available.find(item=>item.id===preferredId)||available[0])?.id||''};
  const copy=async(text,label)=>{try{await navigator.clipboard.writeText(text)}catch{const area=document.createElement('textarea');area.value=text;document.body.appendChild(area);area.select();document.execCommand('copy');area.remove()}toast(`${label} copiado.`, 'good')};
  const renderSummary=lesson=>{panel.querySelector('#teacherLessonTitle').textContent=lesson?`Aula ${lesson.order} — ${lesson.title}`:'Aula indisponível';panel.querySelector('#teacherLessonSubtitle').textContent=lesson?.subtitle||'';const stages=lesson?[...(lesson.stages||[]),...(GUIDED_REINFORCEMENT_V4[lesson.id]||[])]:[];panel.querySelector('#teacherLessonObjectives').innerHTML=lesson?`<p><strong>Objetivos:</strong> ${lesson.objectives.map(esc).join(' · ')}</p><p><strong>Estrutura:</strong> ${stages.map(stage=>esc(lessonStageLabel(stage))).join(', ')}.</p>`:''};
  const refresh=async({announce=false}={})=>{try{const lesson=selectedLesson();releaseSnapshot=await getClassReleaseCodeSnapshot({classId:classSelect.value});panel.querySelector('#teacherReleasePin').textContent=releaseSnapshot.formattedPin;panel.querySelector('#teacherReleaseCode').textContent=releaseSnapshot.code;renderSummary(lesson);panel.querySelector('#teacherCodeStatus').textContent=`Aulas de ${classes[classSelect.value]?.short||classSelect.value} abertas. Código coletivo opcional atualizado.`;if(announce)toast('Painel atualizado.','good')}catch(error){panel.querySelector('#teacherCodeStatus').textContent=error.message}};
  const tick=async()=>{if(!releaseSnapshot)return;const left=Math.max(0,Math.ceil((releaseSnapshot.validUntilMs-Date.now())/1000));panel.querySelector('#teacherReleaseCountdown').textContent=formatClock(left);if(left<=0)await refresh()};
  classSelect.onchange=()=>{updateLessonOptions();refresh({announce:true})};lessonSelect.onchange=()=>renderSummary(selectedLesson());panel.querySelector('#copyReleasePin').onclick=()=>releaseSnapshot&&copy(releaseSnapshot.pin,'Código coletivo');panel.querySelector('#refreshTeacherCode').onclick=()=>refresh({announce:true});await refresh();tick();refreshTimer=setInterval(tick,1000)
}
