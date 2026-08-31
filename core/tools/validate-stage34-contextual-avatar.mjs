import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const must=(ok,msg)=>{console.log(`${ok?'PASS':'FAIL'}  ${msg}`);if(!ok)process.exitCode=1};
const context=read('core/session/avatar-context.js');
const interiors=read('lobby/assets/world/campus-interiors.js');
const d3=read('lobby/assets/lobby3d.js');
const lite=read('lobby/assets/lobby-lite.js');
const avatar=read('lobby/assets/characters/avatar-system.js');
const rigged=read('lobby/assets/rigged-avatar.js');
const lobby=read('lobby/assets/lobby.js');
const lobbyHtml=read('lobby/index.html');
const lobbyCss=read('lobby/assets/lobby.css');
const boot=read('lobby/assets/boot.js');
const vendor=read('lobby/assets/vendor-loader.js');
const sw=read('lobby/sw.js');
const exam=read('prova/assets/student.js');
const examHtml=read('prova/index.html');
const lab=read('sistemas/01-lab-virtual/LABDS/lab/js/app.js');
const labHtml=read('sistemas/01-lab-virtual/LABDS/lab/index.html');
const labBoot=read('sistemas/01-lab-virtual/LABDS/lab/js/core/bootstrap.js');
const labSw=read('sistemas/01-lab-virtual/LABDS/lab/service-worker.js');

must(context.includes("agv:lobby-avatar-context:v1")&&context.includes('sessionStorage'),'estado contextual usa armazenamento apenas da sessão');
must(context.includes('BroadcastChannel')&&context.includes('agv-lobby-avatar-context-v34'),'sincronização opcional entre abas usa canal dedicado');
for(const state of ['waiting','exam-running','exam-paused','exam-finished','lab-waiting','lab-active'])must(context.includes(`'${state}'`),`estado contextual ${state}`);
must(context.includes("'practical-exam'")&&context.includes("'lab-virtual'"),'somente interiores conhecidos são aceitos');
must(!/full_name|\bemail\b|cgm|cpf/i.test(context),'ponte contextual não armazena identidade nominal/CGM/CPF/e-mail');
must(!/supabase|rest\/v1|functions\/v1|service_role|sb_secret/i.test(context),'ponte contextual não depende de banco nem segredo de backend');

must(interiors.includes('CAMPUS_CONTEXTUAL_ANCHORS')&&interiors.includes("'practical-exam':Object.freeze")&&interiors.includes("'lab-virtual':Object.freeze"),'âncoras contextuais existem para Prova e Lab');
must(interiors.includes("'exam-running':Object.freeze({floor:1")&&interiors.includes("action:'exam'"),'prova ativa usa carteira no pavimento de prova');
must(interiors.includes("'lab-active':Object.freeze({floor:0")&&interiors.includes("action:'program'"),'Lab ativo usa bancada de programação');

must(avatar.includes("localAction==='exam'")&&avatar.includes("localAction==='exam-paused'")&&avatar.includes("localAction==='program'"),'avatar procedural possui poses prova/pausa/programação');
must(rigged.includes("localAction==='exam'")&&rigged.includes("localAction==='exam-paused'")&&rigged.includes("localAction==='program'"),'avatar rigged possui poses prova/pausa/programação');
must(d3.includes('applyContextualAvatarState')&&d3.includes('contextLocked()')&&d3.includes('contextualTransition'),'runtime 3D aplica transição e trava movimento contextual');
must(d3.includes("['exam-running','exam-paused','lab-active']")&&d3.includes("setLocalAction(kind){if(contextLocked())return false"),'3D impede ação manual durante contexto travado');
must(lite.includes('applyContextualAvatarState')&&lite.includes('contextLocked()')&&lite.includes('drawContextBadge'),'runtime 2D aplica estado, trava movimento e mostra indicador');
must(lite.includes("'exam-running':['✎','PROVA'")&&lite.includes("'lab-active':['⌨','LAB'"),'2D diferencia prova e laboratório visualmente');
must(d3.includes('reducedMotion?260')&&lite.includes('reducedMotion?240'),'transições respeitam redução de movimento');

must(lobby.includes('startAvatarContextBridge')&&lobby.includes('applyAvatarContext')&&lobby.includes('avatar-context-status'),'Lobby consome e exibe o estado contextual');
must(lobby.includes('seedCampusToolAvatarContext(destination)')&&lobby.includes("id==='practical-exam'")&&lobby.includes("id==='lab-virtual'"),'portais inicializam estado de espera sem iniciar a atividade');
must(lobby.includes("AGVAvatarContext?.isLocked?.(state.avatarContext)")&&lobby.includes('Finalize ou saia da atividade'),'saída manual do interior é protegida enquanto contexto está travado');
must(lobby.includes("AGVAvatarContext?.clear?.('logout')"),'logout limpa o contexto da sessão');
must(lobbyCss.includes('.avatar-context-status')&&lobbyHtml.includes('id="avatar-context-status"'),'HUD possui chip de contexto responsivo');

must(exam.includes('syncAvatarExamContext')&&exam.includes("status==='running'")&&exam.includes("state:'exam-running'"),'Prova publica estado fazendo prova a partir do status servidor');
must(exam.includes("status==='paused'")&&exam.includes("state:'exam-paused'")&&exam.includes("'finished','grading','score_scheduled','published','cancelled'"),'Prova publica pausa e finalização');
must(examHtml.includes('avatar-context.js?v=14.10.8.65-stage34')&&examHtml.includes('student.js?v=14.10.8.65-stage34'),'Prova carrega ponte e student stage34');
must(lab.includes("document.addEventListener('labds:toolopen'")&&lab.includes("state:active?'lab-active':'lab-waiting'"),'Lab publica programando ao abrir ferramenta');
must(lab.includes("document.addEventListener('labds:toolclose'")&&lab.includes("setLabAvatarContext('waiting')"),'Lab retorna ao estado de espera ao fechar ferramenta');
must(labHtml.includes('avatar-context.js?v=14.10.8.65-stage34')&&labHtml.includes('bootstrap.js?v=14.10.8.65-stage34'),'Lab carrega ponte e bootstrap stage34');
must(labBoot.includes('js/app.js?v=14.10.8.65-stage34')&&labSw.includes('stage34')&&labSw.includes('js/app.js?v=14.10.8.65-stage34'),'cache do Lab força app contextual novo');

must(lobbyHtml.includes('lobby.css?v=14.10.8.65-stage34')&&lobbyHtml.includes('vendor-loader.js?v=14.10.8.65-stage34'),'HTML do Lobby publica stage34');
must(vendor.includes('stage34')&&boot.includes('stage34')&&lobby.includes('lobby3d.js?v=14.10.8.65-stage34')&&lobby.includes('lobby-lite.js?v=14.10.8.65-stage34'),'cadeia JS do Lobby publica stage34');
must(sw.includes('agv-lobby-runtime-${VERSION}-stage34')&&sw.includes('avatar-context.js?v=14.10.8.65-stage34')&&sw.includes('lobby.css?v=14.10.8.65-stage34'),'Service Worker publica shell contextual stage34');
must(![context,interiors,d3,lite,avatar,rigged,lobby,exam,lab].some(t=>/service_role|sb_secret/i.test(t)),'sem segredo de backend nos arquivos da fase');

if(process.exitCode)process.exit(process.exitCode);
console.log('\nVALIDAÇÃO ETAPA 34 — FASE 4.2: PASS');
