import { platformConfig } from '../config/platform-config.js';
import { challenges } from '../data/challenges.js';
import { lessons } from '../data/lessons.js';
import { escapeHtml } from '../core/utils.js';

const formatDate = (value = Date.now()) => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: platformConfig.timezone }).format(new Date(value));

export const renderDelivery = (profile) => {
  const completed = Object.keys(profile.completed || {}).length;
  const completedLessons = Object.values(profile.lessonProgress || {}).filter(Boolean).length;
  const delivery = profile.delivery || {};
  const classroom = platformConfig.integrations.classroom;
  return `
    <div class="page-head"><div><p class="eyebrow">CONCLUSÃO // EVIDÊNCIA // ENTREGA ASSISTIDA</p><h1>Central de conclusão e entrega</h1><p>Prepare a evidência, confira o arquivo e abra o destino configurado pelo professor. Abrir o Classroom não significa que a atividade foi entregue.</p></div></div>
    <section class="delivery-grid">
      <article class="card delivery-summary">
        <div class="section-title" style="margin-top:0"><h2>RESUMO DA ATIVIDADE</h2><small>ATUALIZADO ${formatDate(profile.updatedAt)}</small></div>
        <div class="delivery-metrics"><div><span>Missões</span><b>${completed}/${challenges.length}</b></div><div><span>Aulas</span><b>${completedLessons}/${lessons.length}</b></div><div><span>XP</span><b>${profile.xp}</b></div><div><span>Estrelas</span><b>${profile.stars}</b></div></div>
        <dl class="activity-context"><div><dt>Turma</dt><dd>${escapeHtml(profile.className)}</dd></div><div><dt>Disciplina</dt><dd>${escapeHtml(platformConfig.activity.discipline)}</dd></div><div><dt>Atividade</dt><dd>${escapeHtml(platformConfig.activity.title)}</dd></div><div><dt>Resultado esperado</dt><dd>${escapeHtml(platformConfig.activity.expectedResult)}</dd></div></dl>
      </article>
      <article class="card">
        <div class="section-title" style="margin-top:0"><h2>1. PREPARAR RESULTADO</h2><small>ARQUIVO REAL</small></div>
        <p>Gere um relatório HTML que pode ser aberto no celular ou computador. Ele contém identificação escolar, progresso, habilidades e histórico resumido — nunca inclui sua senha.</p>
        <div class="data-actions"><button class="primary-button" data-generate-evidence>GERAR EVIDÊNCIA HTML</button><button class="secondary-button" data-export-progress>EXPORTAR BACKUP CRIPTOGRAFADO</button></div>
        <div class="delivery-status ${delivery.evidenceGeneratedAt ? 'complete' : ''}"><span>${delivery.evidenceGeneratedAt ? '✓' : '○'}</span><div><strong>${delivery.evidenceGeneratedAt ? 'Evidência preparada' : 'Evidência ainda não gerada'}</strong><small>${delivery.evidenceGeneratedAt ? `Última geração: ${formatDate(delivery.evidenceGeneratedAt)}` : 'Gere o arquivo antes de fechar ou trocar de equipamento.'}</small></div></div>
      </article>
      <article class="card">
        <div class="section-title" style="margin-top:0"><h2>2. CONFERIR E ENTREGAR</h2><small>CONFIRMAÇÃO MANUAL</small></div>
        <ol class="delivery-checklist">
          <li><label><input type="checkbox" data-delivery-check="fileLocated" ${delivery.checks?.fileLocated ? 'checked' : ''}> Localizei o arquivo na pasta Downloads.</label></li>
          <li><label><input type="checkbox" data-delivery-check="fileOpened" ${delivery.checks?.fileOpened ? 'checked' : ''}> Abri o arquivo e conferi nome, turma e resultados.</label></li>
          <li><label><input type="checkbox" data-delivery-check="attached" ${delivery.checks?.attached ? 'checked' : ''}> Anexei o arquivo ou link na atividade correta.</label></li>
          <li><label><input type="checkbox" data-delivery-check="submitted" ${delivery.checks?.submitted ? 'checked' : ''}> Cliquei em Entregar e conferi o status no Classroom.</label></li>
        </ol>
        ${classroom.enabled && (classroom.assignmentUrl || classroom.courseUrl)
          ? `<button class="primary-button" data-open-classroom>ABRIR ${classroom.assignmentUrl ? 'ESTA ATIVIDADE' : 'GOOGLE CLASSROOM'} ↗</button>`
          : `<div class="integration-unconfigured"><strong>Google Classroom ainda não configurado</strong><p>O professor deve preencher o link em <code>js/config/platform-config.js</code>. Nenhum botão falso foi criado.</p></div>`}
        <p class="muted">Status interno: ${delivery.checks?.submitted ? '<strong>Aluno declarou que entregou</strong>' : 'Entrega ainda não confirmada pelo aluno'}. Sem API autenticada, a plataforma não consegue confirmar o envio real.</p>
      </article>
      <article class="card delivery-help">
        <div class="section-title" style="margin-top:0"><h2>PRECISO DE AJUDA</h2><small>DIAGNÓSTICO PROGRESSIVO</small></div>
        <details><summary>O arquivo não aparece</summary><p>Confira a pasta Downloads, o gerenciador de arquivos e se o navegador possui permissão para baixar. Gere novamente se necessário.</p></details>
        <details><summary>O upload não inicia</summary><p>Confirme a internet, a conta escolar correta e o espaço disponível no Drive. Contas escolares podem possuir somente 5 GB ou, no máximo, 15 GB.</p></details>
        <details><summary>Estou no celular</summary><p>Abra o Classroom com a conta escolar, entre na atividade, toque em “Seu trabalho”, escolha “Adicionar ou criar” e selecione o arquivo em Downloads.</p></details>
        <details><summary>Estou sem internet</summary><p>Continue praticando e mantenha o perfil protegido. A evidência pode ser gerada localmente; abra o Classroom quando a conexão voltar.</p></details>
      </article>
    </section>`;
};

const safe = (value) => escapeHtml(String(value ?? ''));
export const buildEvidenceHtml = (profile) => {
  const completedIds = Object.keys(profile.completed || {});
  const rows = completedIds.map((id) => {
    const mission = challenges.find((item) => item.id === id);
    const result = profile.completed[id];
    return `<tr><td>${safe(mission?.title || id)}</td><td>${safe(mission?.track || mission?.category || '')}</td><td>${safe(result?.stars || result?.rating || '✓')}</td><td>${safe(result?.completedAt ? formatDate(result.completedAt) : '')}</td></tr>`;
  }).join('');
  const skills = Object.entries(profile.skills || {}).map(([name, value]) => `<li><span>${safe(name)}</span><b>${Math.round(value)}</b></li>`).join('');
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Evidência CTF DS</title><style>body{font-family:system-ui;max-width:1000px;margin:auto;padding:32px;color:#15202b}header{border-bottom:4px solid #00a878;padding-bottom:18px}h1{margin:.2rem 0}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:24px 0}.metric{padding:16px;background:#eef8f4;border-radius:12px}.metric b{display:block;font-size:1.6rem}table{width:100%;border-collapse:collapse}th,td{padding:10px;border:1px solid #d8e0e6;text-align:left}ul{padding:0;list-style:none}li{display:flex;justify-content:space-between;padding:8px;border-bottom:1px solid #ddd}footer{margin-top:32px;font-size:.85rem;color:#5e6c76}</style></head><body><header><small>${safe(platformConfig.institution)} · ${safe(platformConfig.program)}</small><h1>Evidência — ${safe(platformConfig.title)}</h1><p>Aluno: <strong>${safe(profile.studentName)}</strong> · Turma: <strong>${safe(profile.className)}</strong></p><p>Gerado em ${safe(formatDate())}</p></header><section class="grid"><div class="metric">Missões concluídas<b>${completedIds.length}/${challenges.length}</b></div><div class="metric">XP<b>${safe(profile.xp)}</b></div><div class="metric">Estrelas<b>${safe(profile.stars)}</b></div><div class="metric">Nível<b>${safe(profile.level)}</b></div></section><h2>Habilidades</h2><ul>${skills}</ul><h2>Missões concluídas</h2><table><thead><tr><th>Missão</th><th>Área</th><th>Resultado</th><th>Data</th></tr></thead><tbody>${rows || '<tr><td colspan="4">Nenhuma missão concluída até o momento.</td></tr>'}</tbody></table><footer><p>Idealização e desenvolvimento pedagógico: Professor Gabriel. Documento gerado localmente; não confirma entrega no Google Classroom.</p><p>Versão ${safe(platformConfig.version)} · Nenhuma senha, chave privada ou credencial foi incluída.</p></footer></body></html>`;
};
