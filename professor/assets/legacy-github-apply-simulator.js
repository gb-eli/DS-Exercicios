(()=>{
  'use strict';
  const $=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cfg=window.AGV_TEACHER_CONFIG;
  const auth=window.AGVSession.create({supabaseUrl:cfg.supabaseUrl,publishableKey:cfg.publishableKey});
  const suspicious=new Set(['subject_scope_mismatch','identity_scope_mismatch','wrong_exercise']);
  const decisionLabels={approved:'Aprovar',score_adjusted:'Nota ajustada',request_fix:'Solicitar correção',review:'Revisar vínculo',not_corresponding:'Não correspondente'};
  const fieldLabels={claim_status:'Claim',exercise_status:'Status atividade',progress_percent:'Progresso',approval_status:'Aprovação',completion_source:'Origem',submitted_score:'Nota registrada',teacher_feedback:'Feedback'};
  const reasonLabels={current_claim_not_found:'Claim atual não localizado',current_claim_ambiguous:'Mais de um claim atual corresponde à decisão',suspicious_link_cannot_auto_approve:'Vínculo suspeito não pode ser aprovado automaticamente',claim_is_no_longer_pending:'Claim já não está pendente',approved_without_score:'Aprovação sem nota definida',would_reduce_existing_submitted_score:'A proposta reduziria uma nota já registrada',different_completion_source:'A atividade possui outra origem de conclusão',student_state_changed_after_teacher_decision:'O estado do aluno mudou depois da decisão'};
  const warningLabels={already_completed_pending_review:'Atividade já consta como concluída, aguardando validação',would_replace_existing_teacher_feedback:'A proposta substituiria feedback docente existente',approval_of_low_confidence_result:'Aprovação sobre resultado tecnicamente fraco',review_decision_has_no_database_mutation:'Revisar vínculo não produz alteração de banco'};
  const fallbackSubjects={
    '51875c25-08bc-44a7-af0c-162413edd9df':'introducao-programacao',
    '718b598f-d2c8-40e2-b9f8-9a6980c1caca':'inovacao-tecnologica-empreendedorismo',
    '74f4a657-a75d-4eb2-a1e1-e639ffa3179a':'programacao-desenvolvimento-sistemas',
    '3815053a-f49d-446b-9b0c-006a601aa194':'programacao-front-end',
    'ad1f8cc9-d1ba-4e11-b61c-cf94219d5644':'programacao-front-end-sub',
    '4240a7d8-23b3-414d-a259-de3eb38dc000':'programacao-mobile-sub',
    'ad1c2081-9bea-459b-b6f6-272f452bc573':'analise-metodo-sistemas'
  };
  const st={decisionsFile:null,decisions:null,decisionsText:'',sourceHash:null,currentRows:[],plan:null,filtered:[],selected:null};

  function normalizeName(v=''){return String(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim().toUpperCase()}
  function normalizeRepo(v=''){let s=String(v).trim().replace(/^https?:\/\/(www\.)?github\.com\//i,'').split(/[?#]/)[0].replace(/\.git$/i,'');const p=s.split('/').filter(Boolean);return(p.length>=2?`${p[0]}/${p[1]}`:s).toLowerCase()}
  function clamp10(v){if(v===null||v===undefined||v==='')return null;const n=Number(v);return Number.isFinite(n)?Math.round(Math.max(0,Math.min(10,n))*10)/10:null}
  function score100(v){const n=clamp10(v);return n===null?null:Math.round(n*1000)/100}
  function same(a,b){if(a==null&&b==null)return true;if(typeof a==='number'||typeof b==='number'){const na=a==null?null:Number(a),nb=b==null?null:Number(b);if(na===null||nb===null)return na===nb;return Math.abs(na-nb)<.0001}return String(a??'')===String(b??'')}
  function key(r){return [normalizeName(r.student),String(r.subject||'').toLowerCase(),Number(r.exercise_number||0),normalizeRepo(r.repository||r.repository_url||'')].join('|')}
  function setMsg(text,error=false){const el=$('github-sim-message');if(!el)return;el.textContent=text;el.classList.toggle('error',error)}
  function fmt(v,field=''){if(v===null||v===undefined||v==='')return '—';if(field==='submitted_score'||field==='progress_percent')return `${Number(v).toFixed(Number(v)%1?1:0)}%`;return String(v)}
  function proposal(decision,current){
    const p={claim_status:current?.claim_status??null,exercise_status:current?.exercise_status??null,progress_percent:current?.progress_percent??null,approval_status:current?.approval_status??null,completion_source:current?.completion_source??null,submitted_score:current?.submitted_score??null,teacher_feedback:current?.teacher_feedback??null};
    const feedback=String(decision?.feedback||'').trim()||null,score=score100(decision?.final_score??decision?.suggested_score);
    if(['approved','score_adjusted'].includes(decision?.decision)){p.claim_status='approved';p.exercise_status='completed';p.progress_percent=100;p.approval_status='approved';p.completion_source=current?.completion_source||'legacy_claim';p.submitted_score=score;p.teacher_feedback=feedback}
    else if(decision?.decision==='request_fix'){p.claim_status=current?.claim_status||'pending';p.exercise_status='in_progress';p.approval_status='changes_requested';p.teacher_feedback=feedback||'Revisão solicitada pelo professor.'}
    else if(decision?.decision==='not_corresponding'){p.claim_status='rejected';p.exercise_status='in_progress';p.approval_status='changes_requested';p.teacher_feedback=feedback||'O repositório informado não corresponde a esta atividade.'}
    return p;
  }
  function simulate(decision,current,{ambiguous=false,changedAfterDecision=false}={}){
    const p=proposal(decision,current||{}),reasons=[],warnings=[];
    const currentScore=current?.submitted_score==null?null:Number(current.submitted_score),nextScore=p.submitted_score==null?null:Number(p.submitted_score);
    if(!current)reasons.push('current_claim_not_found');
    if(ambiguous)reasons.push('current_claim_ambiguous');
    if(suspicious.has(String(decision?.status||''))&&['approved','score_adjusted'].includes(decision?.decision))reasons.push('suspicious_link_cannot_auto_approve');
    if(current?.claim_status&&current.claim_status!=='pending')reasons.push('claim_is_no_longer_pending');
    if(['approved','score_adjusted'].includes(decision?.decision)&&nextScore===null)reasons.push('approved_without_score');
    if(currentScore!==null&&nextScore!==null&&nextScore<currentScore)reasons.push('would_reduce_existing_submitted_score');
    if(current?.completion_source&&current.completion_source!=='legacy_claim'&&['approved','score_adjusted','request_fix','not_corresponding'].includes(decision?.decision))reasons.push('different_completion_source');
    if(changedAfterDecision)reasons.push('student_state_changed_after_teacher_decision');
    if(current?.exercise_status==='completed'&&current?.approval_status==='pending')warnings.push('already_completed_pending_review');
    if(current?.teacher_feedback&&p.teacher_feedback&&current.teacher_feedback!==p.teacher_feedback)warnings.push('would_replace_existing_teacher_feedback');
    if(['approved','score_adjusted'].includes(decision?.decision)&&['nonfunctional','not_found','incomplete'].includes(String(decision?.status||'')))warnings.push('approval_of_low_confidence_result');
    if(decision?.decision==='review')warnings.push('review_decision_has_no_database_mutation');
    const diff={};for(const field of Object.keys(p)){const before=current?.[field]??null,after=p[field]??null;if(!same(before,after))diff[field]={before,after}}
    const noOp=decision?.decision==='review'||!Object.keys(diff).length;
    return{decision,current:current||null,proposal:p,diff,blocked:reasons.length>0,no_op:noOp,reasons,warnings};
  }
  async function sha256(text){if(!crypto?.subtle)return null;const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return [...new Uint8Array(buf)].map(x=>x.toString(16).padStart(2,'0')).join('')}
  async function api(path,{method='GET',body}={}){return auth.request(path,{method,body})}
  async function invoke(name,body){return api(`/functions/v1/${encodeURIComponent(name)}`,{method:'POST',body})}
  function array(v){return Array.isArray(v)?v:[]}
  function overviewStudents(raw){
    const profiles=array(raw.students||raw.profiles||raw.student_profiles).filter(x=>!x.role||x.role==='student');
    const prereg=array(raw.preregistrations||raw.student_preregistrations).filter(x=>x.active!==false),byId=new Map(profiles.map(x=>[String(x.id),x])),out=[];
    for(const q of prereg){const id=q.claimed_user_id?String(q.claimed_user_id):null,p=id?byId.get(id):null;if(id)out.push({id,full_name:p?.full_name||q.full_name})}
    for(const p of profiles)if(!out.some(x=>String(x.id)===String(p.id)))out.push({id:String(p.id),full_name:p.full_name});
    return out;
  }
  function overviewProgress(raw){return array(raw.progress||raw.student_progress)}
  async function loadCurrent(){
    if(!auth.read())throw new Error('Entre no Console Professor antes de simular.');
    const [raw,claims,exercises,subjectsResult]=await Promise.all([
      invoke(cfg.staffFunction,{action:'overview'}),
      api('/rest/v1/legacy_exercise_claims?select=id,student_id,exercise_id,repository_url,status,next_exercise_id,submitted_at,reviewed_at,teacher_feedback,updated_at&order=submitted_at.asc'),
      api('/rest/v1/exercises?select=id,exercise_number,subject_id,title'),
      api('/rest/v1/subjects?select=id,slug,name').catch(()=>[])
    ]);
    const students=overviewStudents(raw),progress=overviewProgress(raw),studentMap=new Map(students.map(s=>[String(s.id),s.full_name])),exerciseMap=new Map(array(exercises).map(e=>[String(e.id),e])),subjectMap=new Map(array(subjectsResult).map(s=>[String(s.id),s.slug]));
    const progressMap=new Map(progress.map(p=>[[p.student_id||p.user_id,p.exercise_id].map(String).join('|'),p]));
    st.currentRows=array(claims).map(c=>{
      const e=exerciseMap.get(String(c.exercise_id))||{},pr=progressMap.get(`${c.student_id}|${c.exercise_id}`)||{};
      return{claim_id:c.id,student_id:c.student_id,exercise_id:c.exercise_id,student:studentMap.get(String(c.student_id))||String(c.student_id),subject:subjectMap.get(String(e.subject_id))||fallbackSubjects[String(e.subject_id)]||String(e.subject_id||''),exercise_number:e.exercise_number,exercise_title:e.title,repository_url:c.repository_url,repository:normalizeRepo(c.repository_url),claim_status:c.status,claim_updated_at:c.updated_at,claim_submitted_at:c.submitted_at,claim_reviewed_at:c.reviewed_at,claim_teacher_feedback:c.teacher_feedback,exercise_status:pr.status??null,progress_percent:pr.progress_percent??pr.progress??null,approval_status:pr.approval_status??null,completion_source:pr.completion_source??null,submitted_score:pr.submitted_score??null,auto_score:pr.auto_score??null,teacher_feedback:pr.teacher_feedback??null,last_activity_at:pr.last_activity_at??pr.updated_at??null,completed_at:pr.completed_at??null};
    });
    return st.currentRows;
  }
  function buildPlan(){
    const index=new Map();for(const r of st.currentRows){const k=key(r);if(!index.has(k))index.set(k,[]);index.get(k).push(r)}
    const generatedAt=st.decisions?.generated_at||null,items=st.decisions.decisions.map(d=>{const candidates=index.get(key(d))||[],current=candidates[0]||null,da=Date.parse(d.reviewed_at||generatedAt||'')||0,ca=Date.parse(current?.last_activity_at||current?.claim_updated_at||'')||0;return simulate(d,current,{ambiguous:candidates.length>1,changedAfterDecision:da>0&&ca>da})});
    const counts={decisions:items.length,safe_to_apply:items.filter(x=>!x.blocked&&!x.no_op).length,blocked:items.filter(x=>x.blocked).length,no_op:items.filter(x=>x.no_op&&!x.blocked).length,approvals:items.filter(x=>['approved','score_adjusted'].includes(x.decision?.decision)).length,correction_requests:items.filter(x=>x.decision?.decision==='request_fix').length,rejected_links:items.filter(x=>x.decision?.decision==='not_corresponding').length,manual_review:items.filter(x=>x.decision?.decision==='review').length};
    st.plan={schema:'agv-legacy-github-application-plan-v1',generated_at:new Date().toISOString(),source_decisions_generated_at:generatedAt,source_decisions_sha256:st.sourceHash,production_write_applied:false,policy:{score_scale_source:'0-10',score_scale_student_exercises:'0-100',score_conversion:'submitted_score = final_score * 10',suspicious_links_auto_approval:false,lower_existing_score_without_review:false,different_completion_source_without_review:false},current_snapshot:{claims_loaded:st.currentRows.length,loaded_at:new Date().toISOString()},counts,items};
    st.filtered=items;st.selected=null;render();
  }
  function renderKpis(){if(!st.plan)return;$('gs-kpi-decisions').textContent=String(st.plan.counts.decisions);$('gs-kpi-safe').textContent=String(st.plan.counts.safe_to_apply);$('gs-kpi-blocked').textContent=String(st.plan.counts.blocked);$('gs-kpi-noop').textContent=String(st.plan.counts.no_op)}
  function applyFilter(){if(!st.plan)return;const q=String($('gs-search')?.value||'').trim().toLocaleLowerCase('pt-BR'),risk=$('gs-risk')?.value||'all',decision=$('gs-decision')?.value||'all';st.filtered=st.plan.items.filter(x=>(!q||String(x.decision.student).toLocaleLowerCase('pt-BR').includes(q))&&(risk==='all'||(risk==='blocked'?x.blocked:risk==='safe'?!x.blocked&&!x.no_op:risk==='noop'?x.no_op&&!x.blocked:true))&&(decision==='all'||x.decision.decision===decision));renderList()}
  function render(){renderKpis();applyFilter();$('github-sim-export').disabled=false;$('github-sim-content').classList.remove('hidden')}
  function renderList(){const box=$('gs-list'),rows=st.filtered;if(!box)return;if(!rows.length){box.innerHTML='<div class="mini-empty">Nenhuma decisão com esses filtros.</div>';$('gs-list-count').textContent='0 registros';return}box.innerHTML=rows.map((x,i)=>{const risk=x.blocked?'blocked':x.no_op?'noop':'safe';return `<button class="github-sim-row ${risk}${st.selected===x?' selected':''}" data-gs-i="${i}" type="button"><span class="gs-main"><strong>${esc(x.decision.student)}</strong><small>${esc(x.decision.subject)} • Ex. ${String(x.decision.exercise_number).padStart(2,'0')}</small></span><span class="gs-decision">${esc(decisionLabels[x.decision.decision]||x.decision.decision)}</span><span class="gs-risk ${risk}">${risk==='blocked'?'Bloqueado':risk==='noop'?'Sem alteração':'Aplicável'}</span><span class="gs-score">${x.decision.final_score==null?'—':`${Number(x.decision.final_score).toFixed(1)}/10`}</span></button>`}).join('');box.querySelectorAll('[data-gs-i]').forEach(b=>b.addEventListener('click',()=>{st.selected=rows[Number(b.dataset.gsI)];renderList();renderDetail(st.selected)}));$('gs-list-count').textContent=`${rows.length} de ${st.plan.items.length} decisões`}
  function renderDetail(x){const box=$('gs-detail');if(!box)return;const d=x.decision,c=x.current,risk=x.blocked?'blocked':x.no_op?'noop':'safe';const fields=['claim_status','exercise_status','progress_percent','approval_status','completion_source','submitted_score','teacher_feedback'];const rows=fields.map(f=>{const before=c?.[f]??null,after=x.proposal?.[f]??null,chg=!same(before,after);return `<tr class="${chg?'changed':''}"><th>${esc(fieldLabels[f]||f)}</th><td>${esc(fmt(before,f))}</td><td>${esc(fmt(after,f))}</td><td>${chg?'→ muda':'='}</td></tr>`}).join('');box.innerHTML=`<div class="gs-detail-head"><div><p class="eyebrow">Simulação somente leitura</p><h3>${esc(d.student)} — Ex. ${String(d.exercise_number).padStart(2,'0')}</h3><p class="muted">${esc(d.subject)} • ${esc(d.repository)}</p></div><span class="gs-risk ${risk}">${risk==='blocked'?'Bloqueado':risk==='noop'?'Sem alteração':'Aplicável'}</span></div><div class="gs-summary"><article><span>Decisão</span><strong>${esc(decisionLabels[d.decision]||d.decision)}</strong></article><article><span>Nota</span><strong>${d.final_score==null?'—':`${Number(d.final_score).toFixed(1)}/10 → ${(Number(d.final_score)*10).toFixed(0)}/100`}</strong></article><article><span>Claim atual</span><strong>${esc(c?.claim_status||'Não localizado')}</strong></article></div>${x.reasons.length?`<section class="gs-alert blocked"><h4>Bloqueios</h4>${x.reasons.map(v=>`<p>${esc(reasonLabels[v]||v)}</p>`).join('')}</section>`:''}${x.warnings.length?`<section class="gs-alert warning"><h4>Avisos</h4>${x.warnings.map(v=>`<p>${esc(warningLabels[v]||v)}</p>`).join('')}</section>`:''}<div class="gs-diff"><table><thead><tr><th>Campo</th><th>Antes</th><th>Depois</th><th>Impacto</th></tr></thead><tbody>${rows}</tbody></table></div><p class="live-footnote">Este painel não possui comando de atualização, inserção ou exclusão. A saída é apenas um plano JSON para revisão.</p>`}
  async function importDecisions(file){if(!file)return;try{const text=await file.text(),data=JSON.parse(text);if(data?.schema!=='agv-legacy-github-teacher-decisions-v1'||!Array.isArray(data.decisions))throw new Error('Arquivo de decisões incompatível. Exporte novamente pelo painel Auditoria GitHub.');if(data.production_write_applied===true)throw new Error('O arquivo indica escrita em produção e não pode ser usado como fonte segura desta simulação.');st.decisionsFile=file;st.decisions=data;st.decisionsText=text;st.sourceHash=await sha256(text);$('github-sim-run').disabled=false;setMsg(`${data.decisions.length} decisão(ões) carregada(s). Clique em “Simular com estado atual”.`)}catch(e){setMsg(e.message||'Falha ao carregar decisões.',true)}}
  async function run(){if(!st.decisions)return;const btn=$('github-sim-run');btn.disabled=true;btn.textContent='Lendo estado atual…';setMsg('Consultando claims e progresso atuais em modo somente leitura…');try{await loadCurrent();buildPlan();setMsg(`Simulação concluída: ${st.plan.counts.safe_to_apply} aplicável(is), ${st.plan.counts.blocked} bloqueada(s), ${st.plan.counts.no_op} sem alteração. Nenhuma escrita foi enviada.`)}catch(e){setMsg(e.message||'Falha ao montar simulação.',true)}finally{btn.disabled=false;btn.textContent='Simular com estado atual'}}
  function exportPlan(){if(!st.plan)return;const blob=new Blob([JSON.stringify(st.plan,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`AGV-PLANO-APLICACAO-GITHUB-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();const u=a.href;a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000);setMsg(`Plano exportado com ${st.plan.items.length} decisão(ões). production_write_applied=false.`)}
  function toggle(){const p=$('teacher-github-simulator-panel');p?.classList.toggle('hidden');if(p&&!p.classList.contains('hidden'))p.scrollIntoView({behavior:'smooth',block:'start'})}
  $('teacher-github-simulator-toggle')?.addEventListener('click',toggle);
  $('github-sim-decisions-file')?.addEventListener('change',e=>importDecisions(e.target.files?.[0]));
  $('github-sim-run')?.addEventListener('click',run);
  $('github-sim-export')?.addEventListener('click',exportPlan);
  $('gs-search')?.addEventListener('input',applyFilter);$('gs-risk')?.addEventListener('change',applyFilter);$('gs-decision')?.addEventListener('change',applyFilter);
})();
