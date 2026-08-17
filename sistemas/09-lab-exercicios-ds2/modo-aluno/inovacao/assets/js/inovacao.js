(() => {
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const activities=window.ATIVIDADES_INOVACAO||[];
  const VISUAL_ACTIVITIES=new Set([8,12,13,20,21,22,26,28,29,30]);
  let user=null,currentIndex=0,saveTimer=null,pitchTimer=null,pitchRemaining=60;
  const progressNs=()=>window.APP_CONFIG?.progressNamespace||'2ds-inovacao-empreendedorismo-manha';
  const username=()=>user?.username||'sem-usuario';
  const key=a=>`ds2_${progressNs()}_${username()}_at${a.numero}_v1`;
  const now=()=>new Date().toISOString();

  function escapeHtml(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function stateFor(activity){
    try{
      const parsed=JSON.parse(localStorage.getItem(key(activity)))||{};
      return {answers:{},visual:{},completed:false,updatedAt:null,completedAt:null,...parsed,answers:parsed.answers||{},visual:parsed.visual||{}};
    }catch{return {answers:{},visual:{},completed:false,updatedAt:null,completedAt:null};}
  }
  function saveState(activity,state,{silent=true}={}){state.updatedAt=now();localStorage.setItem(key(activity),JSON.stringify(state));AppSharedAuth.log('atividade_inovacao_salva',{numero:activity.numero,completed:state.completed});if(!silent)toast('Progresso salvo.');}
  function fieldValid(field,value){
    if(!field.required)return true;
    if(field.type==='number'){const n=Number(value);return value!==''&&Number.isFinite(n)&&n>=Number(field.min??-Infinity);}
    if(field.type==='select')return String(value||'').trim().length>0;
    return String(value||'').trim().length>=Number(field.minChars||3);
  }
  function stats(activity,state=stateFor(activity)){
    const required=activity.campos.filter(f=>f.required),valid=required.filter(f=>fieldValid(f,state.answers?.[f.id])).length;
    const percent=state.completed?100:Math.round(valid/Math.max(1,required.length)*90);
    const has=Object.values(state.answers||{}).some(v=>String(v??'').trim()!=='')||Object.values(state.visual||{}).some(v=>String(v??'').trim()!=='');
    const status=state.completed?'Concluído':has?'Em andamento':'Não iniciado';
    return {valid,total:required.length,percent,status,has};
  }
  function allStats(){return activities.map((a,i)=>({activity:a,index:i,state:stateFor(a),stats:stats(a)}));}
  function modules(){return [...new Set(activities.map(a=>a.modulo))];}
  function shortModule(m){return m.replace(/^Módulo \d+ · /,'');}
  function show(view){['homeView','activitiesView','activityView'].forEach(id=>$('#'+id).hidden=id!==view);window.scrollTo({top:0,behavior:'smooth'});}
  function setRoute(route,replace=false){const h=`#${route}`;if(location.hash===h)return;history[replace?'replaceState':'pushState']({route},'',`${location.pathname}${location.search}${h}`);}
  function route(){if(!user)return;const h=(location.hash||'#home').slice(1);let m=h.match(/^activity-(\d{1,2})$/);if(m){const i=activities.findIndex(a=>a.numero===Number(m[1]));if(i>=0)return openActivity(i,{history:false});}if(h==='activities')return openActivities({history:false});return openHome({history:false});}
  function openHome(opts={}){stopPitchTimer();show('homeView');renderHome();if(opts.history!==false)setRoute('home');}
  function openActivities(opts={}){stopPitchTimer();show('activitiesView');renderActivities();if(opts.history!==false)setRoute('activities');}
  async function openActivity(index,opts={}){if(!activities[index])return;stopPitchTimer();currentIndex=index;show('activityView');renderActivity();await AppSharedAuth.saveSession({innovationLastActivity:activities[index].numero});AppSharedAuth.log('atividade_inovacao_aberta',{numero:activities[index].numero});if(opts.history!==false)setRoute(`activity-${String(activities[index].numero).padStart(2,'0')}`);}

  function renderHome(){
    const all=allStats(),completed=all.filter(x=>x.stats.status==='Concluído').length,inProgress=all.filter(x=>x.stats.status==='Em andamento').length,avg=Math.round(all.reduce((s,x)=>s+x.stats.percent,0)/Math.max(1,all.length));
    $('#homeGreeting').textContent=`Olá, ${(user.displayName||'aluno').split(/\s+/)[0]}!`;
    $('#totalActivities').textContent=activities.length;$('#completedActivities').textContent=completed;$('#inProgressActivities').textContent=inProgress;$('#overallProgress').textContent=`${avg}%`;
    $('#moduleCards').innerHTML=modules().map(mod=>{const list=all.filter(x=>x.activity.modulo===mod),done=list.filter(x=>x.stats.status==='Concluído').length,p=Math.round(list.reduce((s,x)=>s+x.stats.percent,0)/Math.max(1,list.length));return `<article class="module-card card"><span class="chip">${escapeHtml(mod.split(' · ')[0])}</span><h3>${escapeHtml(shortModule(mod))}</h3><p>${done} de ${list.length} atividades concluídas</p><div class="progress" aria-label="${p}%"><i style="width:${p}%"></i></div></article>`;}).join('');
    const candidates=all.filter(x=>x.stats.has&&x.stats.status!=='Concluído');const resume=$('#resumeActivity');resume.hidden=!candidates.length;if(candidates.length)resume.onclick=()=>openActivity(candidates.at(-1).index);
  }
  function renderActivities(){
    const q=$('#searchInput').value.trim().toLowerCase(),mf=$('#moduleFilter').value,sf=$('#statusFilter').value,all=allStats();
    $('#listCompleted').textContent=`${all.filter(x=>x.stats.status==='Concluído').length}/${activities.length}`;
    const filtered=all.filter(({activity,stats})=>{const hay=`${activity.numero} ${activity.titulo} ${activity.objetivo} ${activity.conceitos.join(' ')}`.toLowerCase();return(!q||hay.includes(q))&&(!mf||activity.modulo===mf)&&(!sf||stats.status===sf);});
    $('#activityGrid').innerHTML=filtered.length?filtered.map(({activity,index,stats})=>`<article class="activity-card card"><div class="activity-number">${String(activity.numero).padStart(2,'0')}</div><div><div class="card-chips"><span class="chip ${stats.status==='Concluído'?'success':'info'}">${stats.status}</span>${VISUAL_ACTIVITIES.has(activity.numero)?'<span class="chip visual-chip">◫ atividade visual</span>':''}</div><h3>${escapeHtml(activity.nomeCurto)}</h3><p>${escapeHtml(activity.objetivo)}</p><div class="meta-line"><span class="chip">${escapeHtml(shortModule(activity.modulo))}</span><span class="chip">${escapeHtml(activity.tempoEstimado)}</span><span class="chip">${stats.percent}%</span></div></div><button data-open="${index}">${stats.status==='Concluído'?'Revisar':stats.status==='Em andamento'?'Continuar':'Começar'}</button></article>`).join(''):'<article class="card empty-state"><strong>Nenhuma atividade encontrada.</strong><p>Altere a pesquisa ou os filtros.</p></article>';
    $$('[data-open]').forEach(b=>b.onclick=()=>openActivity(Number(b.dataset.open)));
  }

  function fieldMarkup(field,value,extraClass=''){
    const id=`field_${field.id}`,help=field.help?`<span class="field-help">${escapeHtml(field.help)}</span>`:'',cls=`field-block ${extraClass}`.trim();
    if(field.type==='select')return `<div class="${cls}"><label for="${id}">${escapeHtml(field.label)}<select id="${id}" data-field="${field.id}"><option value="">Selecione...</option>${field.options.map(o=>`<option${value===o?' selected':''}>${escapeHtml(o)}</option>`).join('')}</select>${help}</label></div>`;
    if(field.type==='number')return `<div class="${cls}"><label for="${id}">${escapeHtml(field.label)}<input id="${id}" data-field="${field.id}" type="number" min="${field.min??0}" step="${field.step||'1'}" placeholder="${escapeHtml(field.placeholder||'')}" value="${escapeHtml(value??'')}">${help}</label></div>`;
    if(field.type==='text')return `<div class="${cls}"><label for="${id}">${escapeHtml(field.label)}<input id="${id}" data-field="${field.id}" type="text" placeholder="${escapeHtml(field.placeholder||'')}" value="${escapeHtml(value??'')}">${help}<span class="char-count" data-count="${field.id}">${String(value||'').trim().length}${field.minChars?` / mínimo sugerido ${field.minChars}`:''}</span></label></div>`;
    return `<div class="${cls}"><label for="${id}">${escapeHtml(field.label)}<textarea id="${id}" data-field="${field.id}" placeholder="${escapeHtml(field.placeholder||'')}">${escapeHtml(value??'')}</textarea>${help}<span class="char-count" data-count="${field.id}">${String(value||'').trim().length}${field.minChars?` / mínimo sugerido ${field.minChars}`:''}</span></label></div>`;
  }
  function fieldBy(a,id){return a.campos.find(f=>f.id===id);}
  function fm(a,state,id,cls=''){const f=fieldBy(a,id);return f?fieldMarkup(f,state.answers?.[id],cls):'';}
  function visualSelect(id,label,value){return `<label class="matrix-score">${escapeHtml(label)}<select data-visual="${id}">${[1,2,3,4,5].map(n=>`<option value="${n}"${String(value||'3')===String(n)?' selected':''}>${n}</option>`).join('')}</select></label>`;}
  function visualText(id,label,value,placeholder){return `<label>${escapeHtml(label)}<input type="text" data-visual="${id}" value="${escapeHtml(value||'')}" placeholder="${escapeHtml(placeholder)}"></label>`;}

  function renderSpecialFields(a,state){
    const generic=()=>a.campos.map(f=>fieldMarkup(f,state.answers?.[f.id])).join('');
    if(a.numero===8){
      return `<section class="visual-workspace"><div class="visual-title"><span class="chip visual-chip">Mapa visual</span><div><h3>Mapa de Empatia</h3><p>Preencha os quatro quadrantes pensando na mesma pessoa ou público.</p></div></div><div class="empathy-grid">${fm(a,state,'pensa','empathy-cell think')}${fm(a,state,'faz','empathy-cell do')}${fm(a,state,'dores','empathy-cell pain')}${fm(a,state,'ganhos','empathy-cell gain')}</div></section>`;
    }
    if(a.numero===12){
      const v=state.visual||{};
      return `<section class="visual-workspace"><div class="visual-title"><span class="chip visual-chip">Ferramenta de decisão</span><div><h3>Matriz Impacto × Esforço</h3><p>Dê notas de 1 a 5. Quanto maior o impacto, melhor; quanto maior o esforço, mais difícil.</p></div></div><div class="matrix-layout"><div class="matrix-controls">${['A','B','C'].map(letter=>`<article class="matrix-idea"><strong>Ideia ${letter}</strong>${visualText(`idea${letter}`,'Nome',v[`idea${letter}`],`Ideia ${letter}`)}<div class="score-pair">${visualSelect(`impact${letter}`,'Impacto',v[`impact${letter}`])}${visualSelect(`effort${letter}`,'Esforço',v[`effort${letter}`])}</div></article>`).join('')}</div><div><div class="impact-matrix" id="impactMatrix"><span class="axis-y">Impacto ↑</span><span class="axis-x">Esforço →</span><div class="quadrant q1"><b>Ganhos rápidos</b><small>alto impacto · baixo esforço</small></div><div class="quadrant q2"><b>Projetos maiores</b><small>alto impacto · alto esforço</small></div><div class="quadrant q3"><b>Baixa prioridade</b><small>baixo impacto · baixo esforço</small></div><div class="quadrant q4"><b>Evitar/reavaliar</b><small>baixo impacto · alto esforço</small></div><div id="matrixDots"></div></div><p class="visual-caption">A matriz é um apoio. A justificativa escrita continua sendo a parte principal da atividade.</p></div></div></section><div class="section-divider"><span>Registro da decisão</span></div>${generic()}`;
    }
    if(a.numero===13){
      return `<section class="visual-workspace proposal-workspace"><div class="visual-title"><span class="chip visual-chip">Proposta de valor</span><div><h3>Cartão de valor</h3><p>O painel se atualiza enquanto você escreve. Foque no resultado para o usuário, não apenas nas funcionalidades.</p></div></div><div id="valueProposalPreview" class="value-proposal-preview"></div></section>${fm(a,state,'solucao')}${fm(a,state,'valor')}${fm(a,state,'beneficio')}`;
    }
    if(a.numero===20){
      return `<section class="visual-workspace canvas-workspace"><div class="visual-title"><span class="chip visual-chip">Business Model Canvas</span><div><h3>Visão integrada do modelo</h3><p>O quadro reaproveita respostas das atividades 13 e 16 a 20. Campos ainda não trabalhados aparecem como pendentes.</p></div></div><div id="businessCanvasPreview" class="business-canvas"></div></section><div class="section-divider"><span>Estrutura de custos desta atividade</span></div>${generic()}`;
    }
    if(a.numero===21){
      return `<section class="visual-workspace"><div class="visual-title"><span class="chip visual-chip">Escopo do MVP</span><div><h3>Do que precisamos aprender primeiro?</h3><p>Separe hipótese, versão mínima e tudo o que pode esperar.</p></div></div><div class="mvp-board">${fm(a,state,'hipotese','mvp-card hypothesis')}${fm(a,state,'mvp','mvp-card core')}${fm(a,state,'fora','mvp-card later')}</div></section>`;
    }
    if(a.numero===22){
      return `<section class="visual-workspace"><div class="visual-title"><span class="chip visual-chip">Fluxo visual</span><div><h3>Jornada principal do protótipo</h3><p>Escreva os passos usando linhas, setas ou ponto e vírgula e veja o fluxo sendo montado.</p></div></div><div id="flowPreview" class="flow-preview"></div></section><div class="flow-form-grid">${fm(a,state,'inicio','flow-start')}${fm(a,state,'passos','flow-steps')}${fm(a,state,'resultado','flow-result')}${fm(a,state,'erro','flow-error')}</div>`;
    }
    if(a.numero===26){
      return `<section class="visual-workspace finance-workspace"><div class="visual-title"><span class="chip visual-chip">Simulador financeiro</span><div><h3>Viabilidade mensal</h3><p>Altere os valores e acompanhe receita, custo, resultado, margem e ponto de equilíbrio.</p></div></div><div id="financialDashboard" class="financial-dashboard"></div></section><div class="finance-input-grid">${fm(a,state,'clientes')}${fm(a,state,'preco')}${fm(a,state,'fixos')}${fm(a,state,'variavel')}</div>${fm(a,state,'analise')}`;
    }
    if(a.numero===28){
      return `<section class="visual-workspace pitch-workspace"><div class="visual-title"><span class="chip visual-chip">Ensaio de pitch</span><div><h3>60 segundos para explicar sua ideia</h3><p>O contador ajuda no ensaio; o tempo estimado é calculado pelo tamanho do roteiro.</p></div></div><div class="pitch-console"><div class="pitch-clock"><strong id="pitchClock">60</strong><span>segundos</span></div><div class="pitch-metrics"><div><strong id="pitchWords">0</strong><span>palavras</span></div><div><strong id="pitchEstimate">0s</strong><span>fala estimada</span></div><div><strong id="pitchFit">roteiro vazio</strong><span>ajuste</span></div></div><div class="pitch-actions"><button type="button" id="startPitchTimer">▶ Ensaiar 60s</button><button type="button" id="resetPitchTimer" class="secondary">↺ Reiniciar</button></div></div></section><div class="pitch-script-grid">${fm(a,state,'abertura','pitch-part')}${fm(a,state,'solucao','pitch-part')}${fm(a,state,'evidencia','pitch-part')}${fm(a,state,'fechamento','pitch-part')}</div>`;
    }
    if(a.numero===29){
      return `<section class="visual-workspace"><div class="visual-title"><span class="chip visual-chip">Pitch deck</span><div><h3>Prévia dos slides</h3><p>Coloque preferencialmente um slide por linha, no formato “Título — objetivo”. A prévia aceita de 6 a 8 ideias de slides.</p></div></div><div id="deckPreview" class="deck-preview"></div></section>${fm(a,state,'slides')}${fm(a,state,'demo')}${fm(a,state,'perguntas')}`;
    }
    if(a.numero===30){
      return `<section class="visual-workspace final-workspace"><div class="visual-title"><span class="chip visual-chip">Projeto integrado</span><div><h3>Painel do projeto final</h3><p>Use esta visão para conferir se problema, valor, modelo, MVP e validação contam uma história coerente.</p></div></div><div id="finalProjectPreview" class="final-project-preview"></div></section><div class="final-form-grid">${fm(a,state,'nome','wide')}${fm(a,state,'resumo')}${fm(a,state,'valor')}${fm(a,state,'modelo')}${fm(a,state,'mvp')}${fm(a,state,'validacao')}${fm(a,state,'proximos','wide')}</div>`;
    }
    return generic();
  }

  function renderActivity(){
    const a=activities[currentIndex],state=stateFor(a),st=stats(a,state);
    $('#activityModule').textContent=a.modulo;$('#activityTitle').textContent=a.titulo;$('#activityObjective').textContent=a.objetivo;$('#activityTime').textContent=`⏱ ${a.tempoEstimado}`;$('#activityLevel').textContent=a.nivel;$('#activityStatus').textContent=st.status;$('#activityPercent').textContent=`${st.percent}%`;$('#activityProgressBar').style.width=`${st.percent}%`;$('#activityProduct').textContent=a.produto;$('#conceptList').innerHTML=a.conceitos.map(c=>`<span class="chip">${escapeHtml(c)}</span>`).join('');
    $('#fieldsContainer').innerHTML=renderSpecialFields(a,state);
    $$('[data-field]').forEach(el=>{el.addEventListener('input',()=>fieldChanged(el,a));el.addEventListener('change',()=>fieldChanged(el,a));});
    $$('[data-visual]').forEach(el=>{el.addEventListener('input',()=>visualChanged(el,a));el.addEventListener('change',()=>visualChanged(el,a));});
    bindDynamicTools(a);updateActivityVisuals(a);$('[data-field]')?.focus({preventScroll:true});
    $('#navPosition').textContent=`${currentIndex+1} de ${activities.length}`;$('#prevActivity').disabled=currentIndex===0;$('#nextActivity').disabled=currentIndex===activities.length-1;$('#validationMessage').textContent='';
  }
  function fieldChanged(el,a){
    const state=stateFor(a);state.answers=state.answers||{};state.answers[el.dataset.field]=el.value;
    if(state.completed&&!a.campos.every(f=>!f.required||fieldValid(f,state.answers[f.id]))){state.completed=false;state.completedAt=null;}
    clearTimeout(saveTimer);saveTimer=setTimeout(()=>saveState(a,state),350);
    const field=a.campos.find(f=>f.id===el.dataset.field),counter=$(`[data-count="${CSS.escape(el.dataset.field)}"]`);if(counter)counter.textContent=`${String(el.value||'').trim().length}${field?.minChars?` / mínimo sugerido ${field.minChars}`:''}`;
    const st=stats(a,state);$('#activityStatus').textContent=st.status;$('#activityPercent').textContent=`${st.percent}%`;$('#activityProgressBar').style.width=`${st.percent}%`;updateActivityVisuals(a);
  }
  function visualChanged(el,a){
    const state=stateFor(a);state.visual=state.visual||{};state.visual[el.dataset.visual]=el.value;clearTimeout(saveTimer);saveTimer=setTimeout(()=>saveState(a,state),350);updateActivityVisuals(a);
  }
  function collect(){const a=activities[currentIndex],state=stateFor(a);state.answers=state.answers||{};state.visual=state.visual||{};$$('[data-field]').forEach(el=>state.answers[el.dataset.field]=el.value);$$('[data-visual]').forEach(el=>state.visual[el.dataset.visual]=el.value);return {a,state};}
  function validateCurrent(){const {a,state}=collect();const invalid=a.campos.filter(f=>f.required&&!fieldValid(f,state.answers[f.id]));return {a,state,invalid};}
  function complete(){
    const {a,state,invalid}=validateCurrent(),msg=$('#validationMessage');
    if(invalid.length){state.completed=false;saveState(a,state);msg.className='validation-message warning';msg.textContent=`Ainda faltam ${invalid.length} campo(s) com desenvolvimento suficiente. Complete as ideias com suas próprias palavras.`;const first=$(`[data-field="${CSS.escape(invalid[0].id)}"]`);first?.focus();return;}
    state.completed=true;state.completedAt=now();saveState(a,state);AppSharedAuth.log('atividade_inovacao_concluida',{numero:a.numero});msg.className='validation-message success';msg.textContent='Atividade concluída. O conteúdo foi salvo no seu progresso.';renderActivity();toast('Atividade concluída!');
  }

  function value(id){return $(`[data-field="${id}"]`)?.value||'';}
  function visualValue(id,fallback=''){return $(`[data-visual="${id}"]`)?.value||fallback;}
  function updateActivityVisuals(a){
    if(!a)return;
    if(a.numero===12)updateImpactMatrix();
    if(a.numero===13)updateValueProposal();
    if(a.numero===20)updateBusinessCanvas();
    if(a.numero===22)updateFlowPreview();
    if(a.numero===26)updateFinancialDashboard();
    if(a.numero===28)updatePitchMetrics();
    if(a.numero===29)updateDeckPreview();
    if(a.numero===30)updateFinalProjectPreview();
  }
  function updateImpactMatrix(){
    const box=$('#matrixDots');if(!box)return;
    box.innerHTML=['A','B','C'].map((letter,i)=>{const impact=Number(visualValue(`impact${letter}`,'3')),effort=Number(visualValue(`effort${letter}`,'3')),name=visualValue(`idea${letter}`,`Ideia ${letter}`),left=8+(effort-1)*21,bottom=8+(impact-1)*21;return `<span class="matrix-dot dot-${i+1}" style="left:${left}%;bottom:${bottom}%" title="${escapeHtml(name)} · impacto ${impact} · esforço ${effort}"><b>${letter}</b><em>${escapeHtml(name)}</em></span>`;}).join('');
  }
  function updateValueProposal(){
    const box=$('#valueProposalPreview');if(!box)return;const solution=value('solucao').trim()||'Sua solução',proposal=value('valor').trim()||'Escreva a proposta de valor para visualizar aqui.',benefit=value('beneficio').trim()||'O benefício principal aparecerá aqui.';
    box.innerHTML=`<div class="value-logo">${escapeHtml(solution.slice(0,2).toUpperCase())}</div><div><small>${escapeHtml(solution)}</small><blockquote>${escapeHtml(proposal)}</blockquote><p><b>Benefício percebido:</b> ${escapeHtml(benefit)}</p></div>`;
  }
  function savedAnswer(number,id){const activity=activities.find(x=>x.numero===number);return activity?String(stateFor(activity).answers?.[id]||'').trim():'';}
  function canvasCell(title,text,cls=''){return `<article class="canvas-cell ${cls} ${String(text||'').trim()?'filled':''}"><strong>${escapeHtml(title)}</strong><p>${escapeHtml(compactText(text,145))}</p></article>`;}
  function updateBusinessCanvas(){
    const box=$('#businessCanvasPreview');if(!box)return;
    const segmentos=[savedAnswer(16,'prioritario'),savedAnswer(16,'usuarios'),savedAnswer(16,'clientes')].filter(Boolean).join(' · ');
    const proposta=[savedAnswer(13,'valor'),savedAnswer(13,'beneficio')].filter(Boolean).join(' · ');
    const canais=[savedAnswer(17,'descoberta'),savedAnswer(17,'entrega')].filter(Boolean).join(' · ');
    const relacionamento=savedAnswer(17,'relacionamento');
    const recursos=savedAnswer(18,'recursos'),atividades=savedAnswer(18,'atividades'),parceiros=savedAnswer(18,'parceiros');
    const receitas=[savedAnswer(19,'modelo'),savedAnswer(19,'explicacao')].filter(Boolean).join(' · ');
    const custos=[value('iniciais'),value('recorrentes'),value('reduzir')].filter(v=>String(v||'').trim()).join(' · ');
    box.innerHTML=canvasCell('Parcerias-chave',parceiros,'partners')+canvasCell('Atividades-chave',atividades,'activities')+canvasCell('Proposta de valor',proposta,'value')+canvasCell('Relacionamento',relacionamento,'relationship')+canvasCell('Segmentos',segmentos,'segments')+canvasCell('Recursos-chave',recursos,'resources')+canvasCell('Canais',canais,'channels')+canvasCell('Estrutura de custos',custos,'costs')+canvasCell('Fontes de receita',receitas,'revenue');
  }
  function parseSteps(text){return String(text||'').split(/\n|→|->|;|\|/).map(s=>s.replace(/^\s*[-•\d.)]+\s*/,'').trim()).filter(Boolean).slice(0,8);}
  function updateFlowPreview(){
    const box=$('#flowPreview');if(!box)return;const start=value('inicio').trim(),steps=parseSteps(value('passos')),result=value('resultado').trim();const items=[start||'Início',...steps,result||'Resultado'].filter(Boolean);box.innerHTML=items.map((s,i)=>`<div class="flow-node ${i===0?'start':i===items.length-1?'end':''}"><span>${i+1}</span><p>${escapeHtml(s)}</p></div>${i<items.length-1?'<i class="flow-arrow">→</i>':''}`).join('');
  }
  function money(v){return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number.isFinite(v)?v:0);}
  function updateFinancialDashboard(){
    const box=$('#financialDashboard');if(!box)return;const n=id=>Number(value(id)||0),clientes=n('clientes'),preco=n('preco'),fixos=n('fixos'),variavel=n('variavel'),receita=clientes*preco,custo=fixos+clientes*variavel,resultado=receita-custo,margem=receita>0?resultado/receita*100:0,contrib=preco-variavel,breakEven=contrib>0?Math.ceil(fixos/contrib):null;
    const tone=resultado>0?'positive':resultado<0?'negative':'neutral';
    box.innerHTML=`<article><span>Receita estimada</span><strong>${money(receita)}</strong><small>${clientes} × ${money(preco)}</small></article><article><span>Custo estimado</span><strong>${money(custo)}</strong><small>fixo + variável</small></article><article class="${tone}"><span>Resultado</span><strong>${money(resultado)}</strong><small>margem ${margem.toFixed(1).replace('.',',')}%</small></article><article><span>Ponto de equilíbrio</span><strong>${breakEven===null?'—':`${breakEven} un.`}</strong><small>${breakEven===null?'preço deve superar custo variável':'estimativa mínima mensal'}</small></article>`;
  }
  function pitchText(){return ['abertura','solucao','evidencia','fechamento'].map(value).join(' ').trim();}
  function updatePitchMetrics(){
    const text=pitchText(),words=text?text.split(/\s+/).filter(Boolean).length:0,seconds=Math.round(words/130*60),wordsEl=$('#pitchWords'),estimate=$('#pitchEstimate'),fit=$('#pitchFit');if(!wordsEl)return;wordsEl.textContent=words;estimate.textContent=seconds?`${seconds}s`:'0s';fit.textContent=!words?'roteiro vazio':seconds<=50?'há espaço':seconds<=65?'bom para 60s':'precisa reduzir';fit.className=seconds>65?'warn':seconds>0&&seconds<=65?'ok':'';
  }
  function startPitchTimer(){stopPitchTimer();pitchRemaining=60;renderPitchClock();pitchTimer=setInterval(()=>{pitchRemaining--;renderPitchClock();if(pitchRemaining<=0){stopPitchTimer(false);toast('60 segundos concluídos!');}},1000);}
  function resetPitchTimer(){stopPitchTimer();pitchRemaining=60;renderPitchClock();}
  function stopPitchTimer(reset=false){if(pitchTimer){clearInterval(pitchTimer);pitchTimer=null;}if(reset){pitchRemaining=60;renderPitchClock();}}
  function renderPitchClock(){const el=$('#pitchClock');if(el)el.textContent=Math.max(0,pitchRemaining);}
  function updateDeckPreview(){
    const box=$('#deckPreview');if(!box)return;let slides=String(value('slides')||'').split(/\n/).map(s=>s.trim()).filter(Boolean).slice(0,8);if(!slides.length)slides=['Problema','Usuário','Solução','Diferencial','Modelo','Validação'];box.innerHTML=slides.map((line,i)=>{const clean=line.replace(/^\s*[-•\d.)]+\s*/,'');const parts=clean.split(/\s+[—–-]\s+/,2);return `<article class="deck-slide"><span>${String(i+1).padStart(2,'0')}</span><div><strong>${escapeHtml(parts[0]||`Slide ${i+1}`)}</strong><p>${escapeHtml(parts[1]||'Defina o objetivo deste slide.')}</p></div></article>`;}).join('');
  }
  function compactText(text,max=110){const t=String(text||'').trim();return t?`${t.slice(0,max)}${t.length>max?'…':''}`:'Ainda não preenchido.';}
  function updateFinalProjectPreview(){
    const box=$('#finalProjectPreview');if(!box)return;const name=value('nome').trim()||'Projeto sem nome';const sections=[['Problema + público',value('resumo')],['Proposta de valor',value('valor')],['Modelo',value('modelo')],['MVP',value('mvp')],['Validação',value('validacao')],['Próximos passos',value('proximos')]];box.innerHTML=`<div class="final-project-head"><div class="project-mark">${escapeHtml(name.slice(0,2).toUpperCase())}</div><div><small>Projeto de inovação</small><h3>${escapeHtml(name)}</h3></div></div><div class="final-project-grid">${sections.map(([title,text])=>`<article class="${String(text||'').trim()?'filled':''}"><span>${escapeHtml(title)}</span><p>${escapeHtml(compactText(text))}</p></article>`).join('')}</div>`;
  }
  function bindDynamicTools(a){if(a.numero===28){$('#startPitchTimer').onclick=startPitchTimer;$('#resetPitchTimer').onclick=resetPitchTimer;renderPitchClock();}}

  function visualMarkdown(a,state){
    if(a.numero!==12)return '';
    const v=state.visual||{},rows=['A','B','C'].map(letter=>`| ${letter} | ${String(v[`idea${letter}`]||`Ideia ${letter}`).trim()} | ${v[`impact${letter}`]||3} | ${v[`effort${letter}`]||3} |`).join('\n');
    return `## Matriz Impacto × Esforço\n\n| Ideia | Nome | Impacto (1-5) | Esforço (1-5) |\n|---|---|---:|---:|\n${rows}\n\n`;
  }
  function markdownActivity(a,state){
    let md=`# ${a.titulo}\n\n**Disciplina:** Inovação Tecnológica e Empreendedorismo  \n**Aluno:** ${user.displayName} (@${user.username})${user.group?`  \n**Turma:** ${user.group}`:''}  \n**Módulo:** ${a.modulo}  \n**Status:** ${state.completed?'Concluído':'Em andamento'}  \n**Atualizado em:** ${state.updatedAt||now()}\n\n## Objetivo\n\n${a.objetivo}\n\n## Produto da atividade\n\n${a.produto}\n\n`;
    md+=visualMarkdown(a,state);md+='## Respostas\n\n';a.campos.forEach(f=>{md+=`### ${f.label}\n\n${String(state.answers?.[f.id]||'').trim()||'_Não respondido._'}\n\n`;});return md;
  }
  function download(name,text,type='text/markdown;charset=utf-8'){const blob=new Blob([text],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function exportCurrent(){const {a,state}=collect();saveState(a,state);download(`inovacao-exercicio-${String(a.numero).padStart(2,'0')}-${username()}.md`,markdownActivity(a,state));AppSharedAuth.log('atividade_inovacao_exportada',{numero:a.numero});}
  function exportAll(){let md=`# Portfólio — Inovação Tecnológica e Empreendedorismo\n\n**Aluno:** ${user.displayName} (@${user.username})${user.group?`  \n**Turma:** ${user.group}`:''}  \n**Exportado em:** ${now()}\n\n`;allStats().forEach(({activity,state})=>{md+=`---\n\n${markdownActivity(activity,state)}\n`;});download(`portfolio-inovacao-${username()}.md`,md);AppSharedAuth.log('portfolio_inovacao_exportado',{total:activities.length});}
  function renderPortfolio(){const all=allStats(),done=all.filter(x=>x.stats.status==='Concluído').length,started=all.filter(x=>x.stats.has).length,avg=Math.round(all.reduce((s,x)=>s+x.stats.percent,0)/Math.max(1,all.length));$('#portfolioSummary').innerHTML=`<div><strong>${done}</strong><span>concluídas</span></div><div><strong>${started}</strong><span>iniciadas</span></div><div><strong>${activities.length-done}</strong><span>pendentes</span></div><div><strong>${avg}%</strong><span>progresso geral</span></div>`;$('#portfolioList').innerHTML=all.map(x=>`<div class="portfolio-row"><span>${String(x.activity.numero).padStart(2,'0')} · ${escapeHtml(x.activity.nomeCurto)}</span><span class="chip">${x.stats.status} · ${x.stats.percent}%</span></div>`).join('');}
  function openPortfolio(){renderPortfolio();$('#portfolioModal').hidden=false;}
  function closePortfolio(){$('#portfolioModal').hidden=true;}
  function toast(text){const t=$('#toast');t.textContent=text;t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),2200);}
  function bind(){
    $('#viewActivities').onclick=()=>openActivities();$('#backHome').onclick=()=>openHome();$('#backActivities').onclick=()=>openActivities();$('#searchInput').oninput=renderActivities;$('#moduleFilter').onchange=renderActivities;$('#statusFilter').onchange=renderActivities;$('#clearFilters').onclick=()=>{$('#searchInput').value='';$('#moduleFilter').value='';$('#statusFilter').value='';renderActivities();};
    $('#saveActivity').onclick=()=>{const {a,state}=collect();saveState(a,state,{silent:false});};$('#completeActivity').onclick=complete;$('#exportActivity').onclick=exportCurrent;$('#prevActivity').onclick=()=>openActivity(currentIndex-1);$('#nextActivity').onclick=()=>openActivity(currentIndex+1);
    $('#portfolioButton').onclick=openPortfolio;$('#closePortfolio').onclick=closePortfolio;$('#portfolioModal').addEventListener('click',e=>{if(e.target===$('#portfolioModal'))closePortfolio();});$('#exportAllHome').onclick=exportAll;$('#exportAllModal').onclick=exportAll;$('#classroomButton').onclick=()=>window.open(window.APP_CONFIG?.classroomUrl||'https://classroom.google.com/','_blank','noopener');window.addEventListener('popstate',route);
    const mf=$('#moduleFilter');modules().forEach(m=>{const o=document.createElement('option');o.value=m;o.textContent=m;mf.appendChild(o);});
  }
  function ready(ev){user=ev.detail.user;$('#appMain').hidden=false;route();}
  document.addEventListener('sharedauth:ready',ready);
  document.addEventListener('DOMContentLoaded',bind);
})();
