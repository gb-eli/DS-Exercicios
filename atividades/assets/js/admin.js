
import { supabase, handleSessionInvalid } from './supabase.js?v=14.10.8.36';
import { normalizeWeekendVoucherCode, formatWeekendVoucherDate } from './weekend-voucher.js?v=14.10.8.36';
import { openExperienceCenter } from './admin-experiences.js?v=14.10.8.20';
import { openSupportCenter } from './admin-support.js?v=14.10.8.36';

let payload=null, currentClass='all', pollTimer=null, liveCtx=null, detailCtx=null, rosterCtx=null, teamData=[], teamClasses=[], teamAssignments=[], teamClassCtx=null, staffRole='teacher', supervisionTimer=null, securityWatchTimer=null, lastSecurityEventId=0, releaseCtx=null, releaseSubjectId='', weekendVoucherCtx=null;
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const progressScore=p=>Math.max(0,Math.min(100,Math.round(Number(p?.submitted_score ?? (p?.auto_score_at ? p?.auto_score : (p?.progress_percent||0)))||0)));
const isPartial=p=>p?.submitted_score!==null&&p?.submitted_score!==undefined&&String(p?.status||'')!=='completed';
const progressStateLabel=p=>p?.security_locked||p?.status==='blocked'?'Bloqueado':p?.approval_status==='changes_requested'?'Ajustes solicitados':p?.approval_status==='pending'?'Aguardando revisão':isPartial(p)?`Entrega parcial ${progressScore(p)}%`:p?.status==='completed'?'Concluído':p?.status==='not_started'?'Não iniciado':'Em andamento';

const CONFIRMED_ACADEMIC_POINTS={
  'introducao-programacao':{from:1,to:6,value:0.75},
  'programacao-front-end':{from:1,to:20,value:0.20},
  'programacao-desenvolvimento-sistemas':{from:1,to:8,value:0.50}
};
const academicMaxPoints=ex=>{const configured=Number(ex?.config?.academic_max_points);if(Number.isFinite(configured)&&configured>0)return configured;const rule=CONFIRMED_ACADEMIC_POINTS[String(ex?.subject_slug||'')],number=Number(ex?.exercise_number);return rule&&number>=rule.from&&number<=rule.to?rule.value:null};
const formatAcademicPoints=value=>Number(value).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
const academicEarnedPoints=(ex,p)=>{const max=academicMaxPoints(ex);if(max===null||p?.submitted_score===null||p?.submitted_score===undefined)return null;return Math.max(0,Math.min(max,max*(Number(p.submitted_score)||0)/100))};

let shellBound=false;
function ensureAdminShell(){
  if(!$('staff-view')){
    document.querySelector('.main-content')?.insertAdjacentHTML('beforeend', `
      <section id="staff-view" class="staff-dashboard hidden" aria-labelledby="staff-title">
        <header class="staff-page-header">
          <div class="staff-page-heading">
            <p class="eyebrow">Professor / Administração</p>
            <h2 id="staff-title">Painel de acompanhamento</h2>
            <p class="muted">Acompanhe acessos, progresso, revisões e apoios individuais.</p>
          </div>
          <div class="staff-page-status">
            <span id="staff-role-chip" class="staff-role-chip">Professor</span>
            <span class="status-chip"><span class="status-dot"></span> sincronizado</span>
          </div>
        </header>

        <section id="staff-summary" class="staff-summary"></section>

        <section class="panel staff-controls">
          <div class="staff-filters">
            <label class="staff-field">
              <span>Turma</span>
              <select id="staff-class-filter"><option value="all">Todas as turmas</option></select>
            </label>
            <label class="staff-field staff-search-field">
              <span>Buscar aluno</span>
              <input id="staff-search" type="search" placeholder="Nome ou e-mail">
            </label>
            <label class="staff-field">
              <span>Acesso</span>
              <select id="staff-access-filter">
                <option value="all">Todos</option>
                <option value="never">Nunca acessou</option>
                <option value="linked">Conta vinculada</option>
                <option value="missing_cgm">CGM pendente</option>
              </select>
            </label>
            <label class="staff-review-filter">
              <input id="staff-review-only" type="checkbox">
              <span>Somente pendências</span>
            </label>
          </div>

          <div class="staff-commandbar">
            <button id="staff-supervision-btn" class="button button-ghost" type="button">Supervisão</button>
            <button id="staff-validations-btn" class="button button-ghost" type="button">Validações</button>
            <button id="staff-ranking-btn" class="button button-ghost" type="button">Ranking</button>
            <button id="staff-weekend-voucher-btn" class="button button-ghost" type="button">Ponto extra</button>
            <button id="staff-releases-btn" class="button button-ghost" type="button">Liberações</button>
            <button id="staff-experiences-btn" class="button button-ghost" type="button">Experiências</button>
            <button id="staff-support-btn" class="button button-ghost" type="button">Mensagens</button>
            <button id="staff-admin-central-btn" class="button button-ghost hidden" type="button">Admin Central</button>
            <button id="staff-team-btn" class="button button-ghost" type="button">Equipe</button>
            <button id="staff-refresh-btn" class="button button-primary" type="button">Atualizar</button>
            <button id="staff-back-btn" class="button button-ghost" type="button">Sair</button>
          </div>
        </section>

        <section class="panel staff-list-panel">
          <div class="staff-list-heading">
            <div>
              <p class="eyebrow">Alunos</p>
              <h3>Acompanhamento da turma</h3>
            </div>
            <span id="staff-visible-count" class="staff-visible-count"></span>
          </div>
          <div id="staff-students" class="staff-students"></div>
        </section>
      </section>`);
    document.body.insertAdjacentHTML('beforeend', `
      <dialog id="student-detail-dialog" class="history-dialog">
        <div class="history-card panel detail-card">
          <div class="history-head"><div><p class="eyebrow">Aluno</p><h3 id="student-detail-title">Detalhes</h3></div><button id="student-detail-close-btn" class="button button-ghost button-small" type="button">Fechar</button></div>
          <div id="student-detail-body"></div>
        </div>
      </dialog>

      <dialog id="roster-dialog" class="history-dialog">
        <form id="roster-form" class="history-card panel roster-card">
          <div class="history-head">
            <div><p class="eyebrow">Matrícula</p><h3 id="roster-title">Editar cadastro</h3></div>
            <button id="roster-close-btn" class="button button-ghost button-small" type="button">Fechar</button>
          </div>
          <div class="roster-form-grid">
            <label><span>E-mail institucional</span><input id="roster-email" type="email" placeholder="nome@escola.pr.gov.br"></label>
            <label><span>CGM</span><input id="roster-cgm" type="text" inputmode="numeric" placeholder="Informe apenas se precisar cadastrar/corrigir"></label>
            <label><span>Situação</span>
              <select id="roster-status">
                <option value="Matriculado">Matriculado</option>
                <option value="Transferido">Transferido</option>
              </select>
            </label>
          </div>
          <p id="roster-hint" class="muted"></p>
          <p id="roster-message" class="form-message hidden"></p>
          <div class="dialog-actions">
            <button class="button button-primary" type="submit">Salvar cadastro</button>
          </div>
        </form>
      </dialog>


      <dialog id="team-dialog" class="history-dialog">
        <div class="history-card panel team-card">
          <div class="history-head">
            <div><p class="eyebrow">Administração</p><h3>Equipe do sistema</h3><p class="muted">Cadastre professores e administradores autorizados. Para uma conta nova, o servidor gera uma senha temporária individual, exibida uma única vez, e exige troca no primeiro acesso.</p></div>
            <button id="team-close-btn" class="button button-ghost button-small" type="button">Fechar</button>
          </div>
          <div id="team-credential" class="team-temp-password hidden"><span>Senha temporária individual — copie agora</span><strong id="team-credential-value"></strong><small>Esta credencial é exibida somente nesta criação. O usuário deverá trocá-la no primeiro acesso.</small></div>
          <form id="team-form" class="team-form">
            <label><span>Nome completo</span><input id="team-name" required placeholder="Nome do professor"></label>
            <label><span>E-mail institucional</span><input id="team-email" type="email" required placeholder="nome@escola.pr.gov.br"></label>
            <label><span>Perfil</span><select id="team-role"><option value="teacher">Professor</option><option value="admin">Administrador</option></select></label>
            <button class="button button-primary" type="submit">Autorizar acesso</button>
          </form>
          <p id="team-message" class="form-message hidden"></p>
          <div id="team-list" class="team-list"></div>
        </div>
      </dialog>


      <dialog id="team-classes-dialog" class="history-dialog">
        <form id="team-classes-form" class="history-card panel team-classes-card">
          <div class="history-head">
            <div>
              <p class="eyebrow">Escopo do professor</p>
              <h3 id="team-classes-title">Turmas atribuídas</h3>
              <p class="muted">O professor verá e poderá gerenciar somente os alunos e exercícios das turmas marcadas.</p>
            </div>
            <button id="team-classes-close-btn" class="button button-ghost button-small" type="button">Fechar</button>
          </div>
          <div id="team-classes-list" class="team-class-options"></div>
          <p id="team-classes-message" class="form-message hidden"></p>
          <div class="dialog-actions">
            <button class="button button-primary" type="submit">Salvar turmas</button>
          </div>
        </form>
      </dialog>


      <dialog id="supervision-center-dialog" class="history-dialog">
        <div class="history-card panel supervision-center-card">
          <div class="history-head">
            <div><p class="eyebrow">Tempo real</p><h3>Central de supervisão</h3><p class="muted">Sessões ativas, exercício atual, IP, foco e sinais de segurança.</p></div>
            <button id="supervision-center-close" class="button button-ghost button-small" type="button">Fechar</button>
          </div>
          <div id="supervision-live-list" class="supervision-live-list"></div>
          <div class="supervision-feed-head"><h4>Eventos recentes</h4><span class="muted">Objetivo = evento observado • Heurística = sinal para conferência</span></div>
          <div id="security-feed-list" class="security-feed-list"></div>
        </div>
      </dialog>

      <dialog id="legacy-review-dialog" class="history-dialog">
        <div class="history-card panel legacy-review-card">
          <div class="history-head">
            <div><p class="eyebrow">Portal antigo</p><h3>Validações pendentes</h3></div>
            <button id="legacy-review-close" class="button button-ghost button-small" type="button">Fechar</button>
          </div>
          <div id="legacy-review-list" class="legacy-review-list"></div>
        </div>
      </dialog>

      <dialog id="weekend-voucher-dialog" class="history-dialog">
        <div class="history-card panel weekend-voucher-admin-card">
          <div class="history-head">
            <div><p class="eyebrow">Fim de semana</p><h3>Validar ponto extra</h3><p class="muted">Digite o código enviado pelo aluno. O sistema consulta o registro seguro e confirma aluno, turma, horário, motivo e situação do resgate.</p></div>
            <button id="weekend-voucher-close" class="button button-ghost button-small" type="button">Fechar</button>
          </div>
          <form id="weekend-voucher-form" class="weekend-voucher-admin-form">
            <label><span>Código do aluno</span><input id="weekend-voucher-code-input" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" inputmode="text" placeholder="FDS-ABCD-2345" maxlength="14" required></label>
            <button class="button button-primary" type="submit">Verificar código</button>
          </form>
          <p id="weekend-voucher-message" class="form-message hidden"></p>
          <div id="weekend-voucher-result" class="weekend-voucher-result hidden"></div>
        </div>
      </dialog>

      <dialog id="ranking-dialog" class="history-dialog">
        <div class="history-card panel ranking-card">
          <div class="history-head">
            <div><p class="eyebrow">Indicadores</p><h3>Ranking de atividades</h3><p class="muted">Prioriza atividades verificadas. Eventos de segurança não aparecem no ranking.</p></div>
            <button id="ranking-close" class="button button-ghost button-small" type="button">Fechar</button>
          </div>
          <div id="ranking-list" class="ranking-list"></div>
        </div>
      </dialog>

      <dialog id="release-dialog" class="history-dialog">
        <div class="history-card panel release-card">
          <div class="history-head">
            <div><p class="eyebrow">Controle da turma</p><h3>Liberações e segurança</h3><p class="muted">Defina quais exercícios a turma pode fazer e ajuste as regras do modo supervisionado.</p></div>
            <button id="release-close" class="button button-ghost button-small" type="button">Fechar</button>
          </div>
          <div class="release-toolbar">
            <label><span>Turma</span><select id="release-class-select"></select></label>
            <label><span>Disciplina</span><select id="release-subject-select"></select></label>
            <button id="release-all-btn" class="button button-ghost button-small" type="button">Liberar todos</button>
            <button id="lock-all-btn" class="button button-ghost button-small" type="button">Bloquear todos</button>
          </div>
          <div id="release-list" class="release-list"></div>
        </div>
      </dialog>

      <dialog id="live-dialog" class="history-dialog">
        <div class="history-card panel live-card">
          <div class="history-head"><div><p class="eyebrow">Acompanhamento</p><h3 id="live-title">Exercício do aluno</h3></div><button id="live-close-btn" class="button button-ghost button-small" type="button">Fechar</button></div>
          <div id="live-file-tabs" class="file-tabs horizontal"></div>
          <div class="live-meta">
            <span id="live-status" class="muted">Aguardando...</span>
            <span id="live-cursor" class="live-cursor"></span>
          </div>
          <textarea id="live-code-editor" class="live-code-editor" spellcheck="false" aria-label="Código do aluno em acompanhamento"></textarea>
          <p class="live-help">Quando o aluno estiver em sessão ativa, alterações aparecem por WebSocket. Ao focar este editor, o aluno é avisado de que o professor está editando.</p>
        </div>
      </dialog>`);
  }
  if(!shellBound){
    $('staff-refresh-btn')?.addEventListener('click',refreshStaff);
    $('staff-supervision-btn')?.addEventListener('click',openSupervisionCenter);
    $('staff-validations-btn')?.addEventListener('click',openLegacyReviews);
    $('staff-ranking-btn')?.addEventListener('click',openRanking);
    $('staff-weekend-voucher-btn')?.addEventListener('click',openWeekendVoucherVerifier);
    $('staff-releases-btn')?.addEventListener('click',openReleaseManager);
    $('staff-experiences-btn')?.addEventListener('click',()=>openExperienceCenter({supabase}));
    $('staff-support-btn')?.addEventListener('click',()=>openSupportCenter({supabase}));
    $('supervision-center-close')?.addEventListener('click',closeSupervisionCenter);
    $('legacy-review-close')?.addEventListener('click',()=>$('legacy-review-dialog')?.close());
    $('ranking-close')?.addEventListener('click',()=>$('ranking-dialog')?.close());
    $('weekend-voucher-close')?.addEventListener('click',()=>$('weekend-voucher-dialog')?.close());
    $('weekend-voucher-form')?.addEventListener('submit',verifyWeekendVoucherFromForm);
    $('release-close')?.addEventListener('click',()=>$('release-dialog')?.close());
    $('release-class-select')?.addEventListener('change',()=>{releaseSubjectId='';loadReleaseMatrix();});
    $('release-subject-select')?.addEventListener('change',event=>{releaseSubjectId=event.target.value;renderReleaseMatrix();});
    $('release-all-btn')?.addEventListener('click',()=>bulkClassRelease(true));
    $('lock-all-btn')?.addEventListener('click',()=>bulkClassRelease(false));
    $('staff-class-filter')?.addEventListener('change',e=>{currentClass=e.target.value;renderSummary();renderStudents()});
    $('staff-search')?.addEventListener('input',()=>{renderSummary();renderStudents()});
    $('staff-review-only')?.addEventListener('change',()=>{renderSummary();renderStudents()});
    $('staff-access-filter')?.addEventListener('change',()=>{renderSummary();renderStudents()});
    $('live-close-btn')?.addEventListener('click',closeLive);
    $('live-code-editor')?.addEventListener('focus',onTeacherLiveFocus);
    $('live-code-editor')?.addEventListener('blur',onTeacherLiveBlur);
    $('live-code-editor')?.addEventListener('input',onTeacherLiveInput);
    $('student-detail-close-btn')?.addEventListener('click',()=>$('student-detail-dialog')?.close());
    $('roster-close-btn')?.addEventListener('click',()=>$('roster-dialog')?.close());
    $('roster-form')?.addEventListener('submit',saveRosterRecord);
    $('staff-admin-central-btn')?.addEventListener('click',()=>{location.href='../admin/';});
    $('staff-team-btn')?.addEventListener('click',openTeamManager);
    $('team-close-btn')?.addEventListener('click',()=>$('team-dialog')?.close());
    $('team-form')?.addEventListener('submit',saveTeamMember);
    $('team-classes-close-btn')?.addEventListener('click',()=>$('team-classes-dialog')?.close());
    $('team-classes-form')?.addEventListener('submit',saveTeamClasses);
    $('staff-back-btn')?.addEventListener('click',async()=>{await supabase.auth.signOut();location.reload()});
    shellBound=true;
  }
}

async function staffFunctionResult(name,body,fallback='Falha no painel administrativo.'){
  const {data,error}=await supabase.functions.invoke(name,{body});
  if(!error&&!data?.error)return data||{};
  let details=data||null;
  try{if(!details&&error?.context?.clone)details=await error.context.clone().json();}catch(_){}
  await handleSessionInvalid(details);
  const e=new Error(details?.reason||details?.error||error?.message||fallback);
  e.code=details?.error||'function_error';e.status=error?.context?.status||null;e.details=details;throw e;
}

async function callStaff(body){return staffFunctionResult('staff-dashboard',body,'Falha ao carregar o painel.');}

async function callAdminRoster(body){return staffFunctionResult('admin-roster',body,'Falha ao carregar a lista de alunos.');}
async function callStaffDirectory(body){return staffFunctionResult('staff-directory',body,'Falha ao carregar a equipe.');}
async function callSupervision(body){
  const {data,error}=await supabase.functions.invoke('supervision',{body});
  if(!error&&!data?.error)return data||{};
  let details=data||null;
  try{if(!details&&error?.context?.clone)details=await error.context.clone().json();}catch(_){}
  await handleSessionInvalid(details);
  const e=new Error(details?.reason||details?.error||error?.message||'Falha na supervisão.');
  e.code=details?.error||'function_error';e.status=error?.context?.status||null;e.details=details;throw e;
}
function weekendVoucherStatusLabel(v){
  if(v?.status==='revoked')return 'Revogado';
  if(v?.status==='redeemed')return 'Já resgatado';
  return 'Disponível para resgate';
}
function setWeekendVoucherMessage(text='',ok=false){const box=$('weekend-voucher-message');if(!box)return;box.textContent=text;box.classList.toggle('hidden',!text);box.classList.toggle('ok',Boolean(ok));}
function openWeekendVoucherVerifier(){
  weekendVoucherCtx=null;const result=$('weekend-voucher-result'),input=$('weekend-voucher-code-input');if(result){result.classList.add('hidden');result.replaceChildren();}if(input)input.value='';setWeekendVoucherMessage('');
  try{$('weekend-voucher-dialog')?.showModal();}catch(_){}setTimeout(()=>input?.focus(),60);
}
function renderWeekendVoucherResult(voucher){
  const host=$('weekend-voucher-result');if(!host)return;host.replaceChildren();host.classList.remove('hidden');
  const status=weekendVoucherStatusLabel(voucher),redeemable=voucher?.status==='issued';
  host.innerHTML=`<div class="weekend-voucher-admin-status ${esc(voucher?.status||'issued')}"><strong>${esc(status)}</strong><span>${esc(voucher?.code||'')}</span></div>
    <dl class="weekend-voucher-admin-grid">
      <div><dt>Aluno</dt><dd>${esc(voucher?.student_name||'—')}</dd></div>
      <div><dt>Turma</dt><dd>${esc(voucher?.class_code||voucher?.class_name||'—')}${voucher?.class_name&&voucher?.class_code?` • ${esc(voucher.class_name)}`:''}</dd></div>
      <div><dt>Recompensa</dt><dd><strong>+${esc(voucher?.reward_points??1)} ponto</strong></dd></div>
      <div><dt>Emitido em</dt><dd>${esc(formatWeekendVoucherDate(voucher?.issued_at))}</dd></div>
      <div><dt>Fim de semana</dt><dd>${esc(voucher?.weekend_id||'—')}</dd></div>
      <div><dt>Motivo</dt><dd>${esc(voucher?.reason||'—')}</dd></div>
      ${voucher?.redeemed_at?`<div><dt>Resgatado em</dt><dd>${esc(formatWeekendVoucherDate(voucher.redeemed_at))}</dd></div>`:''}
    </dl>
    ${redeemable?`<label class="weekend-voucher-note"><span>Observação do resgate (opcional)</span><textarea id="weekend-voucher-redeem-note" placeholder="Ex.: ponto registrado na atividade combinada"></textarea></label><button id="weekend-voucher-redeem-btn" class="button button-primary" type="button">Marcar +1 ponto como resgatado</button>`:''}`;
  $('weekend-voucher-redeem-btn')?.addEventListener('click',redeemWeekendVoucher);
}
async function verifyWeekendVoucherFromForm(event){
  event.preventDefault();const input=$('weekend-voucher-code-input'),code=normalizeWeekendVoucherCode(input?.value);weekendVoucherCtx=null;
  const host=$('weekend-voucher-result');if(host){host.classList.add('hidden');host.replaceChildren();}
  if(!code){setWeekendVoucherMessage('Código inválido. Use o formato FDS-XXXX-XXXX.');return;}
  if(input)input.value=code;setWeekendVoucherMessage('Verificando código…');
  try{const data=await staffFunctionResult('weekend-bonus-voucher',{action:'verify',code},'Falha ao verificar o código.');weekendVoucherCtx=data?.voucher||null;renderWeekendVoucherResult(weekendVoucherCtx);setWeekendVoucherMessage('Código válido e conferido no servidor.',true);}catch(error){setWeekendVoucherMessage(error?.code==='voucher_not_found'?'Código não encontrado. Confira com o aluno.':error?.code==='voucher_out_of_scope'?'Este voucher pertence a uma turma fora do seu escopo.':error?.message||'Não foi possível verificar o código.');}
}
async function redeemWeekendVoucher(){
  const code=normalizeWeekendVoucherCode(weekendVoucherCtx?.code);if(!code)return;const btn=$('weekend-voucher-redeem-btn');if(btn)btn.disabled=true;setWeekendVoucherMessage('Registrando resgate…');
  try{const note=$('weekend-voucher-redeem-note')?.value?.trim()||'';const data=await staffFunctionResult('weekend-bonus-voucher',{action:'redeem',code,note},'Falha ao registrar o resgate.');weekendVoucherCtx=data?.voucher||weekendVoucherCtx;renderWeekendVoucherResult(weekendVoucherCtx);setWeekendVoucherMessage(data?.already_redeemed?'Este código já estava resgatado.':'Resgate registrado. O voucher não pode ser usado novamente.',true);}catch(error){setWeekendVoucherMessage(error?.message||'Não foi possível registrar o resgate.');if(btn)btn.disabled=false;}
}
function studentNameById(id){return studentRecords().find(s=>s.id===id)?.full_name||'Aluno';}
function escapeAttr(s){return esc(s).replace(/'/g,'&#39;');}

export function isStaff(profile){return ['teacher','admin','super_admin'].includes(profile?.role)}
export async function openStaffPanel(){
  ensureAdminShell();
  ['loading-view','login-view','password-view','dashboard-view','exercise-view'].forEach(id=>$(id)?.classList.add('hidden'));
  $('staff-view').classList.remove('hidden');
  $('staff-btn')?.classList.add('hidden');

  try{
    const status=await callStaff({action:'staff_status'});
    staffRole=status?.role||'teacher';
  }catch(error){
    console.error(error);
    if(['session_revoked','session_claim_missing'].includes(String(error?.code||'')))return;
    staffRole='teacher';
  }

  const isAdmin=['admin','super_admin'].includes(staffRole);
  $('staff-admin-central-btn')?.classList.toggle('hidden',!isAdmin);
  $('staff-team-btn')?.classList.toggle('hidden',!isAdmin);
  const chip=$('staff-role-chip');
  if(chip) chip.textContent=isAdmin?'Administrador':'Professor';

  await refreshStaff();
  clearInterval(securityWatchTimer);
  await refreshSupervisionBadge();
  securityWatchTimer=setInterval(()=>{if(!document.hidden)refreshSupervisionBadge();},15000);
}
async function refreshSupervisionBadge(){
  const btn=$('staff-supervision-btn');if(!btn)return;
  try{
    const data=await callSupervision({action:'security_feed'});
    const recent=(data.events||[]).filter(e=>['high','critical'].includes(e.severity)&&Date.now()-new Date(e.created_at).getTime()<10*60*1000);
    btn.textContent=recent.length?`Supervisão • ${recent.length}`:'Supervisão';
    btn.classList.toggle('has-alerts',recent.length>0);
  }catch(_){}
}
async function refreshStaff(){
  const box=$('staff-students');
  if(box) box.innerHTML='<div class="staff-state"><strong>Carregando painel...</strong><span>Sincronizando turmas, acessos e progresso.</span></div>';
  try{
    payload=await callStaff({action:'overview'});
    renderFilters(); renderSummary(); renderStudents();
  }catch(error){
    console.error(error);
    if(box) box.innerHTML='<div class="staff-state"><strong>Não foi possível carregar o painel.</strong><span>Confira sua conexão e tente novamente.</span><button id="staff-retry-btn" class="button button-primary button-small" type="button">Tentar novamente</button></div>';
    $('staff-retry-btn')?.addEventListener('click',refreshStaff);
  }
}
function renderFilters(){
  const sel=$('staff-class-filter'), prev=sel.value||currentClass;
  sel.innerHTML='<option value="all">Todas as turmas</option>'+payload.classes.map(c=>`<option value="${c.id}">${esc(c.name)} — ${esc(c.shift||'')}</option>`).join('');
  if([...sel.options].some(o=>o.value===prev)) sel.value=prev;
  currentClass=sel.value;
}
function studentRecords(){
  const profilesById=new Map((payload.profiles||[]).map(p=>[p.id,p]));
  const prereg=(payload.preregistrations||[]).filter(r=>r.active!==false);
  const claimed=new Set();
  const rows=prereg.map(r=>{
    const p=r.claimed_user_id?profilesById.get(r.claimed_user_id):null;
    if(p) claimed.add(p.id);
    return {
      id:p?.id||null, roster_id:r.id, class_id:r.class_id,
      full_name:p?.full_name||r.full_name,
      email:p?.email||r.institutional_email||'',
      last_login_at:p?.last_login_at||null,
      claimed_at:r.claimed_at||null,
      enrollment_status:r.enrollment_status,
      has_cgm:r.has_cgm!==false,
      claimed:!!p
    };
  });
  for(const p of (payload.profiles||[])){
    if(claimed.has(p.id)) continue;
    const m=(payload.memberships||[]).find(x=>x.user_id===p.id);
    rows.push({...p,class_id:m?.class_id||null,claimed:true,has_cgm:true,enrollment_status:'Matriculado'});
  }
  return rows.sort((a,b)=>String(a.full_name||'').localeCompare(String(b.full_name||''),'pt-BR'));
}
function classForStudent(student){
  const id=typeof student==='string'?student:student?.id;
  const direct=typeof student==='object'?student?.class_id:null;
  if(direct) return payload.classes.find(c=>c.id===direct)||null;
  const m=payload.memberships.find(x=>x.user_id===id);
  return payload.classes.find(c=>c.id===m?.class_id)||null;
}
function progressForStudent(id){
  if(!id) return {rows:[],completed:0,avg:0,last:null,pending:0,changes:0,partial:0,attempts:0};
  const rows=payload.progress.filter(p=>p.student_id===id);
  const completed=rows.filter(r=>r.status==='completed').length;
  const avg=rows.length?Math.round(rows.reduce((a,r)=>a+Number(r.progress_percent||0),0)/rows.length):0;
  const last=rows.map(r=>r.last_activity_at).filter(Boolean).sort().pop()||null;
  const pending=rows.filter(r=>r.approval_status==='pending').length;
  const changes=rows.filter(r=>r.approval_status==='changes_requested').length;
  const partial=rows.filter(isPartial).length;
  const attempts=rows.reduce((a,r)=>a+Number(r.attempts||0),0);
  return {rows,completed,avg,last,pending,changes,partial,attempts};
}
function filteredStudents(){
  const q=$('staff-search').value.trim().toLowerCase();
  return studentRecords().filter(p=>{
    const c=classForStudent(p);
    const reviewOnly=$('staff-review-only')?.checked;
    const accessFilter=$('staff-access-filter')?.value||'all';
    const pr=progressForStudent(p.id);
    const reviewOk=!reviewOnly || pr.pending>0 || pr.changes>0 || pr.partial>0;
    const accessOk =
      accessFilter==='all' ||
      (accessFilter==='never' && !p.id) ||
      (accessFilter==='linked' && !!p.id) ||
      (accessFilter==='missing_cgm' && !p.has_cgm);
    return (currentClass==='all'||c?.id===currentClass) &&
      (!q||`${p.full_name} ${p.email||''}`.toLowerCase().includes(q)) &&
      reviewOk && accessOk;
  });
}
function renderSummary(){
  const students=filteredStudents();
  const avg=students.length?Math.round(students.reduce((a,s)=>a+progressForStudent(s.id).avg,0)/students.length):0;
  const logged=students.filter(s=>!!s.id).length;
  const never=students.filter(s=>!s.id).length;
  const pendingCgm=students.filter(s=>!s.has_cgm).length;
  const reviews=students.reduce((a,s)=>a+progressForStudent(s.id).pending,0);
  const partials=students.reduce((a,s)=>a+progressForStudent(s.id).partial,0);
  $('staff-summary').innerHTML=`
    <article class="staff-metric"><span>Total de alunos</span><strong>${students.length}</strong><small>no filtro atual</small></article>
    <article class="staff-metric"><span>Progresso médio</span><strong>${avg}%</strong><small>atividades iniciadas</small></article>
    <article class="staff-metric"><span>Já acessaram</span><strong>${logged}</strong><small>contas vinculadas</small></article>
    <article class="staff-metric"><span>Nunca acessaram</span><strong>${never}</strong><small>aguardando login</small></article>
    <article class="staff-metric ${pendingCgm ? 'attention' : ''}"><span>CGM pendente</span><strong>${pendingCgm}</strong><small>cadastros incompletos</small></article>
    <article class="staff-metric ${reviews ? 'attention' : ''}"><span>Revisões</span><strong>${reviews}</strong><small>aguardando professor</small></article>
    <article class="staff-metric ${partials ? 'attention' : ''}"><span>Entregas parciais</span><strong>${partials}</strong><small>alunos ainda em andamento</small></article>`;
  const visibleCount=$('staff-visible-count');
  if(visibleCount) visibleCount.textContent=`${students.length} aluno${students.length===1?'':'s'}`;
}
function exerciseLabel(id){
  const ex=payload.exercises?.find(e=>e.id===id);
  return ex?`Ex. ${String(ex.exercise_number).padStart(2,'0')} — ${ex.title}`:'Exercício';
}
function renderStudents(){
  const box=$('staff-students'), students=filteredStudents();
  if(!students.length){box.innerHTML='<div class="staff-state"><strong>Nenhum aluno encontrado.</strong><span>Ajuste os filtros ou a busca para ampliar os resultados.</span></div>';return}
  box.innerHTML=students.map(s=>{
    const c=classForStudent(s), pr=progressForStudent(s.id);
    const recent=pr.rows.slice().sort((a,b)=>new Date(b.last_activity_at||0)-new Date(a.last_activity_at||0))[0];
    const badges=[
      !s.has_cgm?'<span class="badge danger">CGM pendente</span>':'',
      !s.id?'<span class="badge info">Nunca acessou</span>':'<span class="badge success">Conta vinculada</span>',
      pr.pending?`<span class="badge warning">${pr.pending} revisão</span>`:'',
      pr.changes?`<span class="badge danger">${pr.changes} ajustes</span>`:'',
      pr.partial?`<span class="badge warning">${pr.partial} parcial${pr.partial===1?'':'is'}</span>`:''
    ].join('');
    return `<article class="student-row ${!s.id?'not-claimed':''}">
      <div class="student-main">
        <div class="student-name-line">
          <strong>${esc(s.full_name)}</strong>
          <div class="badges">${badges}</div>
        </div>
        <span class="student-meta">${esc(c?.name||'Sem turma')}</span>
        <span class="student-email">${esc(s.email||'E-mail não localizado')}</span>
      </div>

      <div class="student-progress-block">
        <div class="student-progress-head">
          <strong>${pr.avg}%</strong>
          <span>${pr.completed} concluído${pr.completed===1?'':'s'}</span>
        </div>
        <div class="progress-bar mini"><progress class="progress-native" max="100" value="${pr.avg}" aria-label="${pr.avg}% concluído"></progress></div>
      </div>

      <div class="student-actions">
        ${!s.id?'<span class="access-state">Aguardando primeiro acesso</span>':''}
        ${s.id&&recent?`<button class="button button-ghost button-small live-btn" data-student="${s.id}" data-exercise="${recent.exercise_id}" data-name="${esc(s.full_name)}">Ver código</button>`:''}
        ${s.roster_id?`<button class="button button-ghost button-small roster-btn" data-roster="${s.roster_id}">Matrícula</button>`:''}
        ${s.id?`<button class="button button-primary button-small detail-btn" data-student="${s.id}" data-name="${esc(s.full_name)}">Gerenciar</button>`:''}
      </div>
    </article>`;
  }).join('');
  box.querySelectorAll('.live-btn').forEach(b=>b.addEventListener('click',()=>openLive(b.dataset.student,b.dataset.exercise,b.dataset.name)));
  box.querySelectorAll('.roster-btn').forEach(b=>b.addEventListener('click',()=>openRosterEditor(b.dataset.roster)));
  box.querySelectorAll('.detail-btn').forEach(b=>b.addEventListener('click',()=>openStudentDetail(b.dataset.student,b.dataset.name)));
}



async function openSupervisionCenter(){
  $('supervision-center-dialog').showModal();
  await refreshSupervisionCenter();
  clearInterval(supervisionTimer);
  supervisionTimer=setInterval(()=>{if(!document.hidden&&$('supervision-center-dialog')?.open)refreshSupervisionCenter();},6000);
}
function closeSupervisionCenter(){
  clearInterval(supervisionTimer);supervisionTimer=null;
  $('supervision-center-dialog')?.close();
}
async function refreshSupervisionCenter(){
  try{
    const [live,feed]=await Promise.all([
      callSupervision({action:'live_overview'}),
      callSupervision({action:'security_feed'})
    ]);
    const sessions=live.sessions||[];
    $('supervision-live-list').innerHTML=sessions.length?sessions.map(s=>{
      const fresh=Date.now()-new Date(s.last_seen_at).getTime()<8000;
      return `<article class="supervision-session ${s.locked?'locked':''}">
        <div class="supervision-session-main">
          <div><strong>${esc(studentNameById(s.student_id))}</strong><span>${esc(exerciseLabel(s.exercise_id))}</span></div>
          <div class="badges">
            <span class="badge ${fresh?'success':'warning'}">${fresh?'Online':'Sem sinal recente'}</span>
            ${s.locked?'<span class="badge danger">Bloqueado</span>':''}
            <span class="badge info">${esc(s.current_file||'sem arquivo')}</span>
          </div>
        </div>
        <div class="supervision-session-data">
          <span>Cursor <strong>${Number(s.cursor_start||0)}–${Number(s.cursor_end||0)}</strong></span>
          <span>Saídas <strong>${Number(s.focus_violation_count||0)}</strong></span>
          <span>Sinais <strong>${Number(s.suspicious_score||0)}</strong></span>
          <span>IP <strong>${esc(s.ip_address||'—')}</strong></span>
        </div>
        <div class="student-actions">
          <button class="button button-primary button-small session-live-btn" data-student="${s.student_id}" data-exercise="${s.exercise_id}">Abrir ao vivo</button>
          ${s.locked?`<button class="button button-ghost button-small session-unlock-btn" data-student="${s.student_id}" data-exercise="${s.exercise_id}">Liberar atividade</button>`:''}
        </div>
      </article>`;
    }).join(''):'<div class="staff-state"><strong>Nenhum aluno em atividade agora.</strong><span>Quando uma sessão supervisionada começar, ela aparecerá aqui.</span></div>';
    $('supervision-live-list').querySelectorAll('.session-live-btn').forEach(b=>b.onclick=()=>openLive(b.dataset.student,b.dataset.exercise,studentNameById(b.dataset.student)));
    $('supervision-live-list').querySelectorAll('.session-unlock-btn').forEach(b=>b.onclick=async()=>{await callSupervision({action:'unlock_activity',student_id:b.dataset.student,exercise_id:b.dataset.exercise});await refreshSupervisionCenter();await refreshStaff();});

    const events=(feed.events||[]).slice(0,80);
    $('security-feed-list').innerHTML=events.length?events.map(ev=>`<article class="security-event severity-${ev.severity}">
      <div><strong>${esc(studentNameById(ev.student_id))}</strong><span>${esc(exerciseLabel(ev.exercise_id))}</span></div>
      <div><span class="badge ${ev.confidence==='objective'?'success':'info'}">${ev.confidence==='objective'?'Objetivo':'Heurística'}</span><span class="badge ${ev.severity==='critical'||ev.severity==='high'?'danger':'warning'}">${esc(ev.event_type)}</span></div>
      <small>${new Date(ev.created_at).toLocaleString('pt-BR')} • IP ${esc(ev.ip_address||'—')}</small>
    </article>`).join(''):'<p class="muted">Nenhum evento de segurança registrado.</p>';
  }catch(error){
    console.error(error);
    $('supervision-live-list').innerHTML='<p class="form-error">Não foi possível carregar a supervisão.</p>';
  }
}

async function openLegacyReviews(){
  if(!$('legacy-review-dialog').open)$('legacy-review-dialog').showModal();
  const box=$('legacy-review-list');box.innerHTML='<div class="loading-card">Carregando validações...</div>';
  try{
    const data=await callSupervision({action:'legacy_feed'});
    const claims=(data.claims||[]).filter(c=>c.status==='pending');
    box.innerHTML=claims.length?claims.map((c,i)=>`<article class="legacy-review-item">
      <div class="legacy-review-head">
        <div><strong>${esc(studentNameById(c.student_id))}</strong><span>${esc(exerciseLabel(c.exercise_id))}</span></div>
        <span class="badge warning">Aguardando validação</span>
      </div>
      <a class="repository-link" href="${escapeAttr(c.repository_url)}" target="_blank" rel="noopener noreferrer">Abrir repositório ↗</a>
      <textarea id="legacy-feedback-${i}" placeholder="Feedback opcional para o aluno"></textarea>
      <div class="review-actions">
        <button class="button button-ghost legacy-reject" data-id="${c.id}" data-feedback="legacy-feedback-${i}">Solicitar ajustes</button>
        <button class="button button-primary legacy-approve" data-id="${c.id}" data-feedback="legacy-feedback-${i}">Aprovar</button>
      </div>
    </article>`).join(''):'<div class="staff-state"><strong>Nenhuma validação pendente.</strong><span>Entregas do portal antigo aparecerão aqui.</span></div>';
    box.querySelectorAll('.legacy-approve').forEach(b=>b.onclick=()=>reviewLegacyClaim(b,'approved'));
    box.querySelectorAll('.legacy-reject').forEach(b=>b.onclick=()=>reviewLegacyClaim(b,'rejected'));
  }catch(error){box.innerHTML='<p class="form-error">Não foi possível carregar as validações.</p>';}
}
async function reviewLegacyClaim(btn,status){
  btn.disabled=true;
  const feedback=$(btn.dataset.feedback)?.value.trim()||'';
  try{await callSupervision({action:'review_legacy',claim_id:btn.dataset.id,status,teacher_feedback:feedback});await openLegacyReviews();await refreshStaff();}
  finally{btn.disabled=false;}
}

async function openRanking(){
  $('ranking-dialog').showModal();
  const box=$('ranking-list');box.innerHTML='<div class="loading-card">Calculando ranking...</div>';
  try{
    const data=await callSupervision({action:'rankings'});
    box.innerHTML=(data.ranking||[]).map((r,i)=>`<article class="ranking-row">
      <span class="ranking-position">${i+1}</span>
      <div><strong>${esc(r.full_name)}</strong><span>${r.verified} verificadas • ${r.completed} concluídas${r.last_completion?` • primeira conclusão ${new Date(r.last_completion).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'})}`:''}</span></div>
      <strong class="ranking-score">${r.verified}</strong>
    </article>`).join('')||'<p class="muted">Ainda não há atividades concluídas.</p>';
  }catch(error){box.innerHTML='<p class="form-error">Não foi possível carregar o ranking.</p>';}
}

async function openReleaseManager(){
  $('release-dialog').showModal();
  const sel=$('release-class-select');
  sel.innerHTML=(payload.classes||[]).map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('');
  if(currentClass!=='all'&&[...sel.options].some(o=>o.value===currentClass))sel.value=currentClass;
  await loadReleaseMatrix();
}
async function loadReleaseMatrix(){
  const classId=$('release-class-select').value;if(!classId)return;
  const box=$('release-list');box.innerHTML='<div class="loading-card">Carregando exercícios...</div>';
  try{
    const {data:links,error:le}=await supabase.from('class_subjects').select('subject_id').eq('class_id',classId).eq('active',true);if(le)throw le;
    const subjectIds=[...new Set((links||[]).map(x=>x.subject_id).filter(Boolean))];
    if(!subjectIds.length){box.innerHTML='<p class="muted">Nenhuma disciplina vinculada.</p>';return;}
    const [sr,er]=await Promise.all([
      supabase.from('subjects').select('id,name,slug').in('id',subjectIds).eq('active',true).order('name'),
      supabase.from('exercises').select('id,subject_id,class_id,exercise_number,title,default_locked,config').in('subject_id',subjectIds).eq('active',true).eq('visible',true).order('exercise_number')
    ]);if(sr.error)throw sr.error;if(er.error)throw er.error;
    const subjects=sr.data||[],subjectSlugs=new Map(subjects.map(x=>[String(x.id),String(x.slug||'')]));
    const exercises=(er.data||[]).filter(ex=>!ex.class_id||String(ex.class_id)===String(classId)).map(ex=>({...ex,subject_slug:subjectSlugs.get(String(ex.subject_id))||''}));
    if(!releaseSubjectId||!subjects.some(x=>String(x.id)===String(releaseSubjectId)))releaseSubjectId=String(subjects[0]?.id||'');
    const ids=exercises.map(x=>x.id);
    const [rr,pp]=await Promise.all([
      ids.length?supabase.from('exercise_releases').select('id,exercise_id,enabled,updated_at').eq('class_id',classId).is('student_id',null).in('exercise_id',ids):Promise.resolve({data:[]}),
      ids.length?supabase.from('exercise_security_policies').select('exercise_id,require_fullscreen,max_focus_violations,block_paste,detect_devtools,detect_rapid_input,block_external_network,teacher_live_edit').in('exercise_id',ids):Promise.resolve({data:[]})
    ]);
    releaseCtx={classId,exercises,subjects,releases:rr.data||[],policies:pp.data||[]};
    const select=$('release-subject-select');if(select){select.innerHTML=subjects.map(x=>`<option value="${x.id}" ${String(x.id)===String(releaseSubjectId)?'selected':''}>${esc(x.name)}</option>`).join('');}
    renderReleaseMatrix();
  }catch(error){console.error(error);box.innerHTML='<p class="form-error">Não foi possível carregar as liberações.</p>';}
}
function releaseExercises(){return (releaseCtx?.exercises||[]).filter(ex=>!releaseSubjectId||String(ex.subject_id)===String(releaseSubjectId));}

function classReleaseFor(id){return (releaseCtx?.releases||[]).filter(r=>r.exercise_id===id).sort((a,b)=>new Date(b.updated_at||0)-new Date(a.updated_at||0))[0]||null}
function securityPolicyFor(id){return (releaseCtx?.policies||[]).find(p=>p.exercise_id===id)||{require_fullscreen:true,max_focus_violations:3,block_paste:true,detect_devtools:true,detect_rapid_input:true,block_external_network:false,teacher_live_edit:true}}
function renderReleaseMatrix(){
  const box=$('release-list');
  box.innerHTML=releaseExercises().map((ex,i)=>{
    const rel=classReleaseFor(ex.id),p=securityPolicyFor(ex.id),enabled=rel?rel.enabled:!ex.default_locked;
    return `<details class="release-item" data-exercise="${ex.id}">
      <summary>
        <span class="release-number">${String(ex.exercise_number).padStart(2,'0')}</span>
        <strong>${esc(ex.title)}${academicMaxPoints(ex)===null?'':` <small class="release-academic-value">• Vale ${formatAcademicPoints(academicMaxPoints(ex))}</small>`}</strong>
        <label class="release-switch" onclick="event.stopPropagation()"><input class="release-enabled" type="checkbox" ${enabled?'checked':''}><span>${enabled?'Liberado':'Bloqueado'}</span></label>
      </summary>
      <div class="release-security-grid">
        <label><span>Tela cheia</span><input class="pol-fullscreen" type="checkbox" ${p.require_fullscreen?'checked':''}></label>
        <label><span>Saídas de atividade</span><input class="pol-focus" type="text" value="Alerta após 3 saídas • não bloqueia" disabled></label>
        <label><span>Bloquear colagem</span><input class="pol-paste" type="checkbox" ${p.block_paste?'checked':''}></label>
        <label><span>Heurística DevTools</span><input class="pol-devtools" type="checkbox" ${p.detect_devtools?'checked':''}></label>
        <label><span>Entrada rápida</span><input class="pol-rapid" type="checkbox" ${p.detect_rapid_input?'checked':''}></label>
        <label><span>Bloquear rede externa</span><input class="pol-network" type="checkbox" ${p.block_external_network?'checked':''}></label>
        <label><span>Professor edita ao vivo</span><input class="pol-live" type="checkbox" ${p.teacher_live_edit?'checked':''}></label>
        <button class="button button-primary button-small save-policy" type="button">Salvar segurança</button>
      </div>
    </details>`;
  }).join('');
  box.querySelectorAll('.release-enabled').forEach(input=>input.onchange=()=>saveClassRelease(input.closest('.release-item'),input.checked));
  box.querySelectorAll('.save-policy').forEach(btn=>btn.onclick=()=>saveSecurityPolicy(btn.closest('.release-item')));
}
async function saveClassRelease(item,enabled){
  const exerciseId=item.dataset.exercise,classId=releaseCtx.classId,existing=classReleaseFor(exerciseId);
  let res;
  if(existing)res=await supabase.from('exercise_releases').update({enabled,updated_at:new Date().toISOString()}).eq('id',existing.id).select().single();
  else res=await supabase.from('exercise_releases').insert({class_id:classId,student_id:null,exercise_id:exerciseId,enabled}).select().single();
  if(res.error){alert('Não foi possível alterar a liberação.');return;}
  await loadReleaseMatrix();
}
async function saveSecurityPolicy(item){
  const exerciseId=item.dataset.exercise;
  const policy={
    exercise_id:exerciseId,
    require_fullscreen:item.querySelector('.pol-fullscreen').checked,
    max_focus_violations:3,
    block_paste:item.querySelector('.pol-paste').checked,
    detect_devtools:item.querySelector('.pol-devtools').checked,
    detect_rapid_input:item.querySelector('.pol-rapid').checked,
    block_external_network:item.querySelector('.pol-network').checked,
    teacher_live_edit:item.querySelector('.pol-live').checked,
    updated_at:new Date().toISOString()
  };
  const {error}=await supabase.from('exercise_security_policies').upsert(policy,{onConflict:'exercise_id'});
  if(error){alert('Não foi possível salvar a política.');return;}
  await loadReleaseMatrix();
}
async function bulkClassRelease(enabled){
  const scoped=releaseExercises();if(!scoped.length)return;
  for(const ex of scoped){
    const old=classReleaseFor(ex.id);
    if(old)await supabase.from('exercise_releases').update({enabled,updated_at:new Date().toISOString()}).eq('id',old.id);
    else await supabase.from('exercise_releases').insert({class_id:releaseCtx.classId,student_id:null,exercise_id:ex.id,enabled});
  }
  await loadReleaseMatrix();
}

function setTeamMessage(text='',ok=false){
  const el=$('team-message'); if(!el)return;
  el.textContent=text; el.classList.toggle('hidden',!text); el.classList.toggle('ok',!!ok);
}
async function openTeamManager(){
  if(!['admin','super_admin'].includes(staffRole)) return;
  $('team-dialog').showModal();
  setTeamMessage();
  $('team-list').innerHTML='<div class="loading-card">Carregando equipe...</div>';
  await refreshTeamList();
}
async function refreshTeamList(){
  try{
    const data=await callStaffDirectory({action:'list'});
    teamData=data.staff||[];
    teamClasses=data.classes||[];
    teamAssignments=data.assignments||[];

    $('team-list').innerHTML=teamData.map(m=>{
      const assigned=teamAssignments.filter(a=>String(a.teacher_email).toLowerCase()===String(m.email).toLowerCase() && a.active!==false);
      const assignedNames=assigned.map(a=>teamClasses.find(c=>c.id===a.class_id)?.name).filter(Boolean);
      const scopeHtml=m.role==='teacher'
        ? (assignedNames.length
          ? `<div class="team-scope"><span>Turmas</span><div>${assignedNames.map(n=>`<em>${esc(n)}</em>`).join('')}</div></div>`
          : `<div class="team-scope empty"><span>Turmas</span><strong>Sem turma — sem acesso aos alunos</strong></div>`)
        : `<div class="team-scope global"><span>Escopo</span><strong>Acesso global</strong></div>`;

      return `<article class="team-row ${m.active?'':'inactive'}">
        <div class="team-person">
          <strong>${esc(m.full_name)}</strong>
          <span>${esc(m.email)}</span>
          ${scopeHtml}
        </div>
        <span class="badge ${m.role==='admin'?'warning':'info'}">${m.role==='admin'?'Administrador':'Professor'}</span>
        <div class="team-row-actions">
          ${m.role==='teacher'?`<button class="button button-ghost button-small team-classes-btn" data-email="${esc(m.email)}">Turmas</button>`:''}
          <button class="button button-ghost button-small team-toggle" data-email="${esc(m.email)}" data-active="${m.active?'1':'0'}">${m.active?'Desativar':'Ativar'}</button>
        </div>
      </article>`;
    }).join('') || '<div class="staff-state"><strong>Nenhum membro cadastrado.</strong><span>Autorize um professor ou administrador usando o formulário acima.</span></div>';

    $('team-list').querySelectorAll('.team-toggle').forEach(b=>b.onclick=()=>toggleTeamMember(b.dataset.email,b.dataset.active!=='1'));
    $('team-list').querySelectorAll('.team-classes-btn').forEach(b=>b.onclick=()=>openTeamClasses(b.dataset.email));
  }catch(error){
    console.error(error);
    $('team-list').innerHTML='<p class="form-error">Não foi possível carregar a equipe.</p>';
  }
}

function setTeamClassesMessage(text='',ok=false){
  const el=$('team-classes-message'); if(!el)return;
  el.textContent=text;
  el.classList.toggle('hidden',!text);
  el.classList.toggle('ok',!!ok);
}
function openTeamClasses(email){
  const member=teamData.find(m=>String(m.email).toLowerCase()===String(email).toLowerCase());
  if(!member||member.role!=='teacher') return;
  teamClassCtx=member;
  $('team-classes-title').textContent=`Turmas de ${member.full_name}`;
  setTeamClassesMessage();

  const selected=new Set(
    teamAssignments
      .filter(a=>String(a.teacher_email).toLowerCase()===String(email).toLowerCase() && a.active!==false)
      .map(a=>String(a.class_id))
  );

  $('team-classes-list').innerHTML=teamClasses.map(c=>`
    <label class="team-class-option">
      <input type="checkbox" value="${c.id}" ${selected.has(String(c.id))?'checked':''}>
      <span>
        <strong>${esc(c.name)}</strong>
        <small>${esc(c.code||'')} ${c.shift?`• ${esc(c.shift)}`:''}</small>
      </span>
    </label>
  `).join('') || '<p class="muted">Nenhuma turma ativa encontrada.</p>';

  $('team-classes-dialog').showModal();
}
async function saveTeamClasses(event){
  event.preventDefault();
  if(!teamClassCtx) return;
  const submit=event.submitter;
  submit.disabled=true;
  submit.textContent='Salvando...';
  setTeamClassesMessage();
  try{
    const classIds=[...$('team-classes-list').querySelectorAll('input[type="checkbox"]:checked')].map(i=>i.value);
    await callStaffDirectory({action:'set_classes',email:teamClassCtx.email,class_ids:classIds});
    setTeamClassesMessage(classIds.length?'Turmas atualizadas. O escopo já está valendo no servidor.':'Professor ficou sem turmas e não terá acesso a alunos.',true);
    await refreshTeamList();
  }catch(error){
    console.error(error);
    setTeamClassesMessage('Não foi possível atualizar as turmas deste professor.');
  }finally{
    submit.disabled=false;
    submit.textContent='Salvar turmas';
  }
}

async function saveTeamMember(event){
  event.preventDefault(); setTeamMessage();
  const submit=event.submitter; submit.disabled=true; submit.textContent='Salvando...';
  try{
    const result=await callStaffDirectory({action:'upsert',full_name:$('team-name').value.trim(),email:$('team-email').value.trim().toLowerCase(),role:$('team-role').value});
    const credential=$('team-credential'),credentialValue=$('team-credential-value');
    if(result?.temporary_password){
      credentialValue.textContent=result.temporary_password;
      credential.classList.remove('hidden');
    }else{
      credentialValue.textContent='';
      credential.classList.add('hidden');
    }
    setTeamMessage(
      $('team-role').value==='teacher'
        ? (result?.temporary_password?'Professor criado. Copie a senha temporária acima e depois use Turmas para definir o escopo.':'Professor atualizado. Use Turmas para revisar o escopo de acesso.')
        : (result?.temporary_password?'Administrador criado. Copie a senha temporária acima; ele deverá trocá-la no primeiro acesso.':'Administrador atualizado com acesso global.'),
      true
    );
    $('team-name').value=''; $('team-email').value=''; $('team-role').value='teacher';
    await refreshTeamList();
  }catch(error){
    console.error(error);
    const msg=String(error?.message||'');
    setTeamMessage(msg==='invalid_school_email'?'Use um e-mail @escola.pr.gov.br.':'Não foi possível autorizar este acesso.');
  }finally{submit.disabled=false;submit.textContent='Autorizar acesso';}
}
async function toggleTeamMember(email,active){
  try{await callStaffDirectory({action:'set_active',email,active});await refreshTeamList();}
  catch(error){console.error(error);setTeamMessage('Não foi possível alterar o acesso.');}
}

function rosterRecordById(id){
  return (payload?.preregistrations||[]).find(r=>r.id===id)||null;
}
function setRosterMessage(text='',ok=false){
  const el=$('roster-message'); if(!el)return;
  el.textContent=text;
  el.classList.toggle('hidden',!text);
  el.classList.toggle('ok',!!ok);
}
function openRosterEditor(id){
  const r=rosterRecordById(id); if(!r)return;
  rosterCtx=r;
  $('roster-title').textContent=r.full_name||'Editar matrícula';
  $('roster-email').value=r.institutional_email||'';
  $('roster-status').value=r.enrollment_status==='Transferido'?'Transferido':'Matriculado';
  $('roster-cgm').value='';
  $('roster-email').disabled=!!r.claimed_user_id;
  $('roster-cgm').disabled=!!r.claimed_user_id;
  $('roster-hint').textContent=r.claimed_user_id
    ? 'A conta já foi vinculada. E-mail e CGM ficam bloqueados aqui; você ainda pode alterar a situação da matrícula.'
    : (r.has_cgm ? 'CGM já cadastrado. Deixe o campo vazio para mantê-lo.' : 'CGM pendente: informe o número correto para liberar o primeiro acesso.');
  setRosterMessage();
  $('roster-dialog').showModal();
}
async function saveRosterRecord(event){
  event.preventDefault();
  if(!rosterCtx)return;
  const submit=event.submitter;
  submit.disabled=true; submit.textContent='Salvando...';
  setRosterMessage();
  try{
    const body={
      action:'update_preregistration',
      id:rosterCtx.id,
      enrollment_status:$('roster-status').value
    };
    if(!rosterCtx.claimed_user_id){
      body.institutional_email=$('roster-email').value.trim().toLowerCase();
      const cgm=$('roster-cgm').value.trim();
      if(cgm) body.cgm=cgm;
    }
    await callAdminRoster(body);
    setRosterMessage('Cadastro atualizado com segurança.',true);
    await refreshStaff();
    const updated=rosterRecordById(rosterCtx.id);
    if(updated){rosterCtx=updated;openRosterEditor(updated.id);}
  }catch(error){
    console.error(error);
    const msg=String(error?.message||'');
    const map={
      invalid_cgm:'CGM inválido. Use apenas números.',
      invalid_school_email:'Use um e-mail institucional @escola.pr.gov.br.',
      email_locked_after_claim:'A conta já foi vinculada; o e-mail não pode ser alterado aqui.',
      cgm_locked_after_claim:'A conta já foi vinculada; o CGM não pode ser alterado aqui.'
    };
    setRosterMessage(map[msg]||'Não foi possível atualizar a matrícula.');
  }finally{
    submit.disabled=false; submit.textContent='Salvar cadastro';
  }
}

async function openStudentDetail(studentId,name){
  detailCtx={studentId,name,data:null,exerciseId:null};
  $('student-detail-title').textContent=name;
  $('student-detail-body').innerHTML='<div class="loading-card">Carregando dados...</div>';
  $('student-detail-dialog').showModal();
  const data=await callStaff({action:'student_detail',student_id:studentId});
  detailCtx.data=data;
  const student=studentRecords().find(s=>s.id===studentId);
  const cls=classForStudent(student||studentId);
  let allowedExercises=payload.exercises||[];
  if(cls?.id){
    const {data:links}=await supabase.from('class_subjects').select('subject_id').eq('class_id',cls.id).eq('active',true);
    const subjectIds=new Set((links||[]).map(x=>x.subject_id));
    allowedExercises=allowedExercises.filter(e=>subjectIds.has(e.subject_id));
  }
  const progressMap=new Map((data.progress||[]).map(r=>[r.exercise_id,r]));
  const rows=allowedExercises.slice().sort((a,b)=>Number(a.exercise_number||999)-Number(b.exercise_number||999)).map(ex=>({
    exercise_id:ex.id,
    ...(progressMap.get(ex.id)||{status:'not_started',progress_percent:0,approval_status:'not_required'})
  }));
  const pending=rows.filter(r=>r.status!=='completed').length;
  const globalMode=(data.accommodations||[]).find(a=>!a.exercise_id&&a.active&&a.accommodation_type==='learning_mode');
  const globalConfig=globalMode?.config&&typeof globalMode.config==='object'?globalMode.config:{};
  const globalLabel=globalMode?String(globalConfig.title||'Apoio pedagógico individualizado'):'';
  const adaptationRequest=(data.adaptation_requests||[]).find(item=>item.status==='pending');
  $('student-detail-body').innerHTML=`
    <div class="student-detail-summary"><strong>${rows.filter(r=>r.status==='completed').length} concluídos</strong><span>${pending} pendentes / não iniciados</span></div>
    ${globalMode?`<div class="student-detail-summary adaptation-admin-summary"><strong>${esc(globalLabel)}</strong><span>${globalConfig.default_mode==='adapted'?'Modo adaptado é o padrão inicial':'Aluno escolhe quando ativar'}${globalConfig.allow_switch===false?'':' • troca de modo permitida'}</span></div>`:''}
    ${adaptationRequest&&!globalMode?`<div class="student-detail-summary adaptation-admin-summary"><strong>Solicitação de adaptação pendente</strong><span>O aluno pediu uma forma de organização pedagógica diferente. Nenhuma justificativa sensível foi solicitada.</span><div class="review-actions"><button id="apply-guided-adaptation" class="button button-ghost button-small" type="button">Aplicar apoio guiado</button><button id="apply-reinforced-adaptation" class="button button-primary button-small" type="button">Aplicar reforçado</button><button id="close-adaptation-request" class="button button-ghost button-small" type="button">Encerrar pedido</button></div></div>`:''}
    <div class="student-exercise-grid">
      ${rows.map(r=>{const ex=allowedExercises.find(item=>String(item.id)===String(r.exercise_id)),max=academicMaxPoints(ex),earned=academicEarnedPoints(ex,r);return `
        <button class="exercise-manage-card ${r.status==='not_started'?'not-started':''}" data-exercise="${r.exercise_id}">
          <span>${esc(exerciseLabel(r.exercise_id))}</span>
          <strong>${max===null?`${progressScore(r)}%`:`${earned===null?'—':formatAcademicPoints(earned)} / ${formatAcademicPoints(max)}`}</strong>
          <small>${esc(progressStateLabel(r))}${max===null?'':` • ${progressScore(r)}%`} • ${Number(r.attempts||0)} tentativa(s)</small>
        </button>`}).join('') || '<p class="muted">Nenhum exercício disponível para esta turma.</p>'}
    </div>
    <div id="exercise-management" class="exercise-management hidden"></div>`;
  $('student-detail-body').querySelectorAll('.exercise-manage-card').forEach(b=>b.onclick=()=>renderExerciseManagement(b.dataset.exercise).catch(error=>{console.error(error);alert('Não foi possível carregar a configuração atual da atividade.');}));
  if(adaptationRequest&&!globalMode){
    $('apply-guided-adaptation')?.addEventListener('click',()=>applyRequestedAdaptation(adaptationRequest.id,'guided'));
    $('apply-reinforced-adaptation')?.addEventListener('click',()=>applyRequestedAdaptation(adaptationRequest.id,'reinforced'));
    $('close-adaptation-request')?.addEventListener('click',()=>resolveAdaptationRequest(adaptationRequest.id,'closed'));
  }
}

function adaptationPreset(kind='guided'){
  const reinforced=kind==='reinforced';
  return {profile_key:reinforced?'reinforced_code':'guided_code',title:reinforced?'Apoio pedagógico reforçado':'Apoio pedagógico disponível',student_message:reinforced?'A atividade pode ser feita uma etapa por vez, com destaque, ajuda extra de conteúdo e código e checkpoints.':'A atividade pode ser organizada em passos menores, com instruções diretas, explicações de termos e ajuda guiada para código.',default_mode:'conventional',allow_switch:true,offer_prompt:true,recommended_font_size:reinforced?19:18,features:{short_instructions:true,step_by_step:true,focus_cues:true,larger_controls:reinforced,reduced_visual_load:true,predictable_feedback:true,extra_checkpoints:true,extra_help:true,code_help:true,guided_code_help:true,term_explanations:true,content_explanations:true,micro_steps:true,highlight_current_step:true}};
}
async function resolveAdaptationRequest(id,status='approved'){
  const studentId=detailCtx.studentId,name=detailCtx.name;
  await callStaff({action:'resolve_adaptation_request',id,status});
  if($('student-detail-dialog')?.open)$('student-detail-dialog').close();
  await openStudentDetail(studentId,name);
}
async function applyRequestedAdaptation(id,kind){
  const studentId=detailCtx.studentId,name=detailCtx.name;
  await callStaff({action:'set_accommodation',student_id:studentId,global_scope:true,accommodation_type:'learning_mode',reason:'Plano pedagógico individualizado definido pelo professor.',config:adaptationPreset(kind)});
  await callStaff({action:'resolve_adaptation_request',id,status:'approved'});
  if($('student-detail-dialog')?.open)$('student-detail-dialog').close();
  await openStudentDetail(studentId,name);
}
async function referenceBaseFlags(exerciseId){
  try{const {data,error}=await supabase.from('exercise_reference_files').select('filename').eq('exercise_id',exerciseId);if(error)throw error;const names=new Set((data||[]).map(x=>String(x.filename||'').toLowerCase()));return{known:true,html:names.has('index.html')||names.has('index.htm'),css:names.has('estilo.css')||names.has('style.css')||names.has('styles.css'),js:names.has('script.js')||names.has('main.js')||names.has('app.js')}}catch(error){console.warn('Referências não confirmadas no painel administrativo.',error);return{known:false,html:false,css:false,js:false}}
}
async function renderExerciseManagement(exerciseId){
  detailCtx.exerciseId=exerciseId;
  const r=detailCtx.data.progress.find(x=>x.exercise_id===exerciseId)||{};
  const exercise=payload.exercises?.find(x=>String(x.id)===String(exerciseId))||null,maxPoints=academicMaxPoints(exercise),earnedPoints=academicEarnedPoints(exercise,r);
  const rel=detailCtx.data.releases.find(x=>x.exercise_id===exerciseId)||{};
  const base=await referenceBaseFlags(exerciseId);
  detailCtx.releaseVersion=String(rel.updated_at||'');
  detailCtx.referenceBases=base;
  const acc=detailCtx.data.accommodations.filter(x=>x.exercise_id===exerciseId&&x.active);
  const box=$('exercise-management'); box.classList.remove('hidden');
  box.innerHTML=`
    <div class="management-head">
      <div><p class="eyebrow">Configuração individual</p><h3>${esc(exerciseLabel(exerciseId))}</h3></div>
      <button id="manage-live-btn" class="button button-ghost button-small">Abrir código</button>
    </div>
    <div class="student-detail-summary"><strong>${esc(progressStateLabel(r))}</strong><span>${maxPoints===null?'':`Valor máximo ${formatAcademicPoints(maxPoints)} • Nota obtida ${earnedPoints===null?'—':formatAcademicPoints(earnedPoints)} • `}Autocorreção ${Math.round(Number(r.auto_score||0))}% • Melhor entrega ${r.submitted_score==null?'—':`${progressScore(r)}%`} • ${Number(r.attempts||0)} tentativa(s)</span></div>
    <div class="management-grid">
      <section class="management-section">
        <h4>Acomodações e apoio</h4>
        <label class="switch-row"><span>HTML-base${base.html?' · referência protegida':''}</span><input id="acc-html" type="checkbox" ${(rel.allow_html_base||base.html)?'checked':''} ${base.html?'disabled':''}></label>
        <label class="switch-row"><span>CSS-base${base.css?' · referência protegida':''}</span><input id="acc-css" type="checkbox" ${(rel.allow_css_base||base.css)?'checked':''} ${base.css?'disabled':''}></label>
        <label class="switch-row"><span>JavaScript-base${base.js?' · referência protegida':''}</span><input id="acc-js" type="checkbox" ${(rel.allow_js_base||base.js)?'checked':''} ${base.js?'disabled':''}></label>
        ${(base.html||base.css||base.js)?'<p class="muted">Bases com referência oficial não podem ser desligadas por este painel. Isso evita que o código de referência desapareça para o aluno.</p>':''}
        <label class="switch-row"><span>Dicas extras</span><input id="acc-hints" type="checkbox" ${rel.allow_extra_hints?'checked':''}></label>
        <label class="switch-row"><span>Apoio guiado</span><input id="acc-guided" type="checkbox" ${rel.allow_guided_support?'checked':''}></label>
        <textarea id="acc-reason" placeholder="Motivo/observação pedagógica"></textarea>
        <button id="save-release-btn" class="button button-primary">Salvar apoios</button>
      </section>
      <section class="management-section">
        <h4>Feedback e aprovação</h4>
        <textarea id="teacher-feedback" placeholder="Orientação, dica extra ou ajuste solicitado">${esc(r.teacher_feedback||'')}</textarea>
        <div class="review-actions">
          <button id="request-review-btn" class="button button-ghost">Marcar para revisão</button>
          <button id="request-changes-btn" class="button button-ghost">Solicitar ajustes</button>
          <button id="approve-btn" class="button button-primary">Aprovar manualmente</button>
        </div>
      </section>
      <section class="management-section full">
        <h4>Acomodações ativas</h4>
        <div class="accommodation-list">
          ${acc.map(a=>`<div class="accommodation-item"><div><strong>${esc(a.accommodation_type)}</strong><small>${esc(a.reason||'Sem observação')}</small></div><button class="button button-ghost button-small disable-acc" data-id="${a.id}">Desativar</button></div>`).join('')||'<p class="muted">Nenhuma acomodação individual registrada.</p>'}
        </div>
        <div class="custom-accommodation">
          <input id="custom-acc-title" placeholder="Ex.: tempo adicional, validação simplificada">
          <textarea id="custom-acc-text" placeholder="Descreva o apoio que deve aparecer para o aluno"></textarea>
          <button id="add-custom-acc" class="button button-ghost">Adicionar acomodação personalizada</button>
        </div>
      </section>
    </div>`;
  $('manage-live-btn').onclick=()=>openLive(detailCtx.studentId,exerciseId,detailCtx.name);
  $('save-release-btn').onclick=saveRelease;
  $('request-review-btn').onclick=()=>manualReview('pending');
  $('request-changes-btn').onclick=()=>manualReview('changes_requested');
  $('approve-btn').onclick=()=>manualReview('approved');
  $('add-custom-acc').onclick=addCustomAccommodation;
  box.querySelectorAll('.disable-acc').forEach(b=>b.onclick=()=>disableAccommodation(b.dataset.id));
}
async function saveRelease(){
  const expected=String(detailCtx.releaseVersion||''),fresh=await callStaff({action:'student_detail',student_id:detailCtx.studentId}),current=(fresh.releases||[]).find(x=>x.exercise_id===detailCtx.exerciseId)||{};
  if(String(current.updated_at||'')!==expected){detailCtx.data=fresh;await renderExerciseManagement(detailCtx.exerciseId);alert('Esta configuração foi alterada em outro painel. Os valores foram atualizados; revise antes de salvar novamente.');return;}
  const base=detailCtx.referenceBases?.known?detailCtx.referenceBases:await referenceBaseFlags(detailCtx.exerciseId);
  await callStaff({action:'set_release',student_id:detailCtx.studentId,exercise_id:detailCtx.exerciseId,
    allow_html_base:$('acc-html').checked||base.html,allow_css_base:$('acc-css').checked||base.css,allow_js_base:$('acc-js').checked||base.js,
    allow_extra_hints:$('acc-hints').checked,allow_guided_support:$('acc-guided').checked});
  const reason=$('acc-reason').value.trim();
  if(reason) await callStaff({action:'set_accommodation',student_id:detailCtx.studentId,exercise_id:detailCtx.exerciseId,accommodation_type:'teacher_support',reason,config:{message:reason}});
  await reopenDetail();
}
async function manualReview(status){
  await callStaff({action:'manual_review',student_id:detailCtx.studentId,exercise_id:detailCtx.exerciseId,approval_status:status,teacher_feedback:$('teacher-feedback').value.trim()});
  await reopenDetail();
}
async function addCustomAccommodation(){
  const title=$('custom-acc-title').value.trim()||'apoio_personalizado';
  const text=$('custom-acc-text').value.trim();
  if(!text)return;
  await callStaff({action:'set_accommodation',student_id:detailCtx.studentId,exercise_id:detailCtx.exerciseId,accommodation_type:title,reason:text,config:{message:text}});
  await reopenDetail();
}
async function disableAccommodation(id){
  await callStaff({action:'disable_accommodation',id});
  await reopenDetail();
}
async function reopenDetail(){
  const ex=detailCtx.exerciseId;
  const data=await callStaff({action:'student_detail',student_id:detailCtx.studentId});
  detailCtx.data=data; await renderExerciseManagement(ex);
  await refreshStaff();
}
async function openLive(studentId,exerciseId,name){
  closeLive();
  liveCtx={studentId,exerciseId,name,active:null,files:[],session:null,channel:null,teacherDirty:false,saveTimer:null};
  $('live-title').textContent=`${name} • ${exerciseLabel(exerciseId)}`;
  $('live-code-editor').value='';
  $('live-code-editor').readOnly=false;
  $('live-dialog').showModal();
  try{
    const [live,policyRes]=await Promise.all([
      callSupervision({action:'live_overview'}),
      supabase.from('exercise_security_policies').select('teacher_live_edit').eq('exercise_id',exerciseId).maybeSingle()
    ]);
    liveCtx.session=(live.sessions||[]).find(s=>s.student_id===studentId&&s.exercise_id===exerciseId)||null;
    liveCtx.canEdit=policyRes.data?.teacher_live_edit!==false;
    $('live-code-editor').readOnly=!liveCtx.canEdit;
    if(!liveCtx.canEdit)$('live-status').textContent='Acompanhamento somente leitura — edição ao vivo desativada para este exercício.';
    if(liveCtx.session?.channel_key)connectTeacherLiveChannel();
  }catch(_){}
  await updateLive();
  pollTimer=setInterval(()=>{if(!document.hidden&&$('live-dialog')?.open)updateLive();},5000);
}
function connectTeacherLiveChannel(){
  if(!liveCtx?.session?.channel_key||liveCtx.channel)return;
  liveCtx.channel=supabase
    .channel(`epds-live:${liveCtx.session.channel_key}`,{config:{broadcast:{self:false}}})
    .on('broadcast',{event:'code_snapshot'},({payload})=>{
      if(!liveCtx||!payload?.filename)return;
      let file=liveCtx.files.find(f=>f.filename===payload.filename);
      if(!file){file={id:null,filename:payload.filename,content:''};liveCtx.files.push(file);}
      file.content=String(payload.content||'');
      if(file.filename===(liveCtx.files.find(f=>f.id===liveCtx.active)?.filename||liveCtx.activeFilename) && document.activeElement!==$('live-code-editor')){
        $('live-code-editor').value=file.content;
      }
      $('live-cursor').textContent=`${payload.filename} • cursor ${Number(payload.cursor_start||0)}–${Number(payload.cursor_end||0)}`;
      $('live-status').textContent='WebSocket ao vivo • aluno digitando';
    })
    .on('broadcast',{event:'cursor'},({payload})=>{
      if(payload?.filename)$('live-cursor').textContent=`${payload.filename} • cursor ${Number(payload.cursor_start||0)}–${Number(payload.cursor_end||0)}`;
    })
    .subscribe();
}
async function updateLive(){
  if(!liveCtx)return;
  try{
    const data=await callStaff({action:'student_files',student_id:liveCtx.studentId,exercise_id:liveCtx.exerciseId});
    const files=data.files||[];liveCtx.files=files;
    if(!liveCtx.active||!files.some(f=>f.id===liveCtx.active)) liveCtx.active=files[0]?.id||null;
    $('live-file-tabs').innerHTML=files.map(f=>`<button type="button" class="file-tab ${f.id===liveCtx.active?'active':''}" data-id="${f.id}">${esc(f.filename)}</button>`).join('');
    $('live-file-tabs').querySelectorAll('.file-tab').forEach(b=>b.onclick=()=>{liveCtx.active=b.dataset.id;const f=liveCtx.files.find(x=>x.id===liveCtx.active);$('live-code-editor').value=f?.content||'';updateLiveMeta();});
    const file=files.find(f=>f.id===liveCtx.active);
    if(document.activeElement!==$('live-code-editor')&&!liveCtx.teacherDirty)$('live-code-editor').value=file?.content||'';
    updateLiveMeta(file);
  }catch(e){$('live-status').textContent='Falha ao atualizar acompanhamento.'}
}
function updateLiveMeta(file=null){
  const s=liveCtx?.session;
  if(s){
    const fresh=Date.now()-new Date(s.last_seen_at).getTime()<8000;
    $('live-status').textContent=`${fresh?'Ao vivo':'Sem sinal recente'} • ${s.fullscreen?'tela cheia':'fora da tela cheia'} • ${s.focus_violation_count||0} saídas • IP ${s.ip_address||'—'}`;
    $('live-cursor').textContent=`${s.current_file||file?.filename||'arquivo'} • cursor ${s.cursor_start||0}–${s.cursor_end||0}`;
  }else if(file)$('live-status').textContent=`Salvo • revisão ${file.revision} • ${new Date(file.saved_at).toLocaleTimeString('pt-BR')}`;
  else $('live-status').textContent='Aguardando primeiro salvamento';
}
async function persistTeacherEdit(){
  if(!liveCtx)return;
  const file=liveCtx.files.find(f=>f.id===liveCtx.active);if(!file)return;
  const content=$('live-code-editor').value;
  try{
    const data=await callSupervision({action:'teacher_edit',student_id:liveCtx.studentId,exercise_id:liveCtx.exerciseId,filename:file.filename,content});
    if(data.file){file.content=data.file.content;file.revision=data.file.revision;file.saved_at=data.file.saved_at;}
    liveCtx.teacherDirty=false;
  }catch(e){$('live-status').textContent='Falha ao persistir edição do professor.'}
}
function onTeacherLiveFocus(){
  if(!liveCtx?.channel||liveCtx?.canEdit===false)return;
  liveCtx.channel.send({type:'broadcast',event:'teacher_editing',payload:{editing:true,teacher_name:'Professor'}});
}
function onTeacherLiveBlur(){
  if(liveCtx?.channel)liveCtx.channel.send({type:'broadcast',event:'teacher_editing',payload:{editing:false}});
  if(liveCtx?.teacherDirty)persistTeacherEdit();
}
function onTeacherLiveInput(){
  if(!liveCtx||liveCtx.canEdit===false)return;
  const file=liveCtx.files.find(f=>f.id===liveCtx.active);if(!file)return;
  liveCtx.teacherDirty=true;file.content=$('live-code-editor').value;
  liveCtx.channel?.send({type:'broadcast',event:'teacher_edit',payload:{filename:file.filename,content:file.content,at:new Date().toISOString()}});
  clearTimeout(liveCtx.saveTimer);liveCtx.saveTimer=setTimeout(persistTeacherEdit,700);
}
function closeLive(){
  clearInterval(pollTimer);pollTimer=null;
  if(liveCtx?.saveTimer)clearTimeout(liveCtx.saveTimer);
  if(liveCtx?.channel){try{liveCtx.channel.send({type:'broadcast',event:'teacher_editing',payload:{editing:false}})}catch(_){};supabase.removeChannel(liveCtx.channel).catch(()=>{});}
  liveCtx=null;
  if($('live-dialog')?.open)$('live-dialog').close();
}
