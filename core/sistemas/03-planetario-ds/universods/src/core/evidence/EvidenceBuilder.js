const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const formatDuration=ms=>{const total=Math.max(0,Math.floor(Number(ms||0)/1000));const h=Math.floor(total/3600),m=Math.floor(total%3600/60),s=total%60;return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;};
const hash=text=>{let value=2166136261;for(const char of text){value^=char.charCodeAt(0);value=Math.imul(value,16777619);}return (value>>>0).toString(16).padStart(8,'0').toUpperCase();};

export class EvidenceBuilder {
  build({profile,plan,session,quality='balanced',appVersion='10.0.0'}){
    const snap=typeof session.snapshot==='function'?session.snapshot():session;
    const report={
      schema:'cosmos-ds-evidence-v1',generatedAt:new Date().toISOString(),appVersion,
      student:{id:profile.id,name:profile.name,className:profile.className,callsign:profile.callsign,level:profile.level,xp:profile.xp},
      mission:{id:plan.id,title:plan.title,moduleId:plan.moduleId,difficulty:plan.difficulty,objective:plan.objective,minimumMinutes:plan.durationMinutes,classroomUrl:plan.classroomUrl},
      session:{id:snap.id,state:snap.state,startedAt:snap.startedAt,finishedAt:snap.finishedAt,activeMs:snap.activeMs,idleMs:snap.idleMs,idleWarnings:snap.idleWarnings,earlyRelease:snap.earlyRelease,progress:{completed:snap.checkpoints.length,total:plan.checkpoints.length}},
      checkpoints:plan.checkpoints.map(item=>({...item,status:snap.checkpoints.some(done=>done.id===item.id)?'completed':'pending',record:snap.checkpoints.find(done=>done.id===item.id)??null})),
      events:(snap.events||[]).slice(-120),environment:{quality}
    };
    report.validationCode=hash(JSON.stringify(report));
    return report;
  }
  toJson(report){return JSON.stringify(report,null,2);}
  toHtml(report){const completed=report.checkpoints.filter(item=>item.status==='completed').length;return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Evidência — ${escapeHtml(report.mission.title)}</title><style>body{font-family:Arial,sans-serif;margin:0;color:#132036;background:#eef3f8}main{max-width:900px;margin:24px auto;background:white;padding:32px;border-radius:20px;box-shadow:0 12px 40px #2342}h1{margin:0;color:#0b3155}h2{margin-top:28px;border-bottom:2px solid #dce8f2;padding-bottom:8px}.meta{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.meta div,.checkpoint{border:1px solid #dbe6ef;border-radius:12px;padding:12px}.checkpoint.completed{border-left:5px solid #169b62}.checkpoint.pending{border-left:5px solid #c28b18}.code{font-family:monospace;background:#eef6ff;padding:10px;border-radius:8px}@media(max-width:650px){main{margin:0;border-radius:0;padding:20px}.meta{grid-template-columns:1fr}}@media print{body{background:white}main{box-shadow:none;margin:0;max-width:none}}</style></head><body><main><p>COSMOS DS · Evidência de atividade</p><h1>${escapeHtml(report.mission.title)}</h1><p>${escapeHtml(report.mission.objective)}</p><section class="meta"><div><b>Estudante</b><br>${escapeHtml(report.student.name)}<br>${escapeHtml(report.student.className)}</div><div><b>Tempo ativo</b><br>${formatDuration(report.session.activeMs)}<br>Mínimo ${report.mission.minimumMinutes} min</div><div><b>Progresso</b><br>${completed}/${report.checkpoints.length} checkpoints<br>Estado ${escapeHtml(report.session.state)}</div></section><h2>Checkpoints</h2>${report.checkpoints.map(item=>`<article class="checkpoint ${item.status}"><b>${item.order}. ${escapeHtml(item.title)}</b><p>${escapeHtml(item.evidence)}</p><small>${item.record?.completedAt?`Concluído em ${escapeHtml(item.record.completedAt)}`:'Pendente'}</small></article>`).join('')}<h2>Rastreabilidade</h2><p>Alertas de inatividade: ${report.session.idleWarnings}. Liberação antecipada: ${report.session.earlyRelease?'sim':'não'}.</p><p class="code">Código de validação: ${report.validationCode}</p><p>Gerado em ${escapeHtml(report.generatedAt)} · COSMOS DS ${escapeHtml(report.appVersion)}</p></main></body></html>`;}
  static formatDuration(ms){return formatDuration(ms);}
}
