const DANGEROUS_KEYS=new Set(['__proto__','prototype','constructor']);

export function cleanText(value,maxLength=500){
  return String(value??'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/[<>]/g,'').replace(/\s+/g,' ').trim().slice(0,maxLength);
}
export function cleanMultiline(value,maxLength=2000){
  return String(value??'').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,'').replace(/[<>]/g,'').replace(/\r\n?/g,'\n').trim().slice(0,maxLength);
}
export function safeNumber(value,{min=0,max=100000,fallback=0,integer=true}={}){
  const n=Number(value);if(!Number.isFinite(n))return fallback;const bounded=Math.max(min,Math.min(max,n));return integer?Math.round(bounded):bounded;
}
export function safeIdentifier(value,maxLength=120){return cleanText(value,maxLength).replace(/[^a-zA-Z0-9._:-]/g,'-')}
export function safeFileName(value='arquivo'){return cleanText(value,120).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9._-]+/g,'-').replace(/^[-.]+|[-.]+$/g,'').toLowerCase()||'arquivo'}
export function safeUrl(value,{allowHttp=false,allowRelative=true}={}){
  const raw=String(value??'').trim();if(!raw)return'';
  if(allowRelative&&/^(\.?\.?\/|[a-zA-Z0-9_-]+\/)/.test(raw)&&!raw.includes(':'))return raw;
  try{const url=new URL(raw,globalThis.location?.href||'https://example.invalid/');const allowed=url.protocol==='https:'||(allowHttp&&url.protocol==='http:');return allowed?url.href:''}catch{return''}
}
export function assertSafeStructure(value,{maxDepth=12,maxArray=500,maxKeys=200}={}){
  const seen=new WeakSet();
  const visit=(node,depth)=>{
    if(depth>maxDepth)throw new Error('Estrutura excede a profundidade permitida.');
    if(node===null||typeof node!=='object')return;
    if(seen.has(node))throw new Error('Estrutura circular não permitida.');seen.add(node);
    if(Array.isArray(node)){if(node.length>maxArray)throw new Error('Arquivo contém itens demais.');node.forEach(item=>visit(item,depth+1));return}
    const proto=Object.getPrototypeOf(node);if(proto!==Object.prototype&&proto!==null)throw new Error('Objeto não permitido.');
    const keys=Object.keys(node);if(keys.length>maxKeys)throw new Error('Objeto contém campos demais.');
    for(const key of keys){if(DANGEROUS_KEYS.has(key))throw new Error('Campo inseguro detectado.');visit(node[key],depth+1)}
  };visit(value,0);return value;
}
function cleanDate(value){const d=new Date(value);return Number.isFinite(d.getTime())?d.toISOString():new Date(0).toISOString()}
function cleanAreas(value){return (Array.isArray(value)?value:[]).slice(0,20).map(area=>({area:cleanText(area?.area,80),total:safeNumber(area?.total,{max:200}),answered:safeNumber(area?.answered,{max:200}),correct:safeNumber(area?.correct,{max:200}),percent:safeNumber(area?.percent,{max:100})}))}
function cleanAnswers(value){return (Array.isArray(value)?value:[]).slice(0,200).map(answer=>({questionId:safeIdentifier(answer?.questionId,80),area:cleanText(answer?.area,80),difficulty:['basic','intermediate','advanced'].includes(answer?.difficulty)?answer.difficulty:'basic',type:['single','multi','order','text'].includes(answer?.type)?answer.type:'single',question:cleanText(answer?.question,900),choice:cleanText(answer?.choice,900),correctAnswer:cleanText(answer?.correctAnswer,900),correct:Boolean(answer?.correct),explanation:cleanText(answer?.explanation,1600),at:cleanDate(answer?.at)}))}
function cleanEvents(value){return (Array.isArray(value)?value:[]).slice(0,500).map(event=>({type:safeIdentifier(event?.type,60),detail:cleanText(event?.detail,260),at:cleanDate(event?.at)}))}
function cleanTeacherRelease(value){if(!value?.authorized)return null;return{authorized:true,at:cleanDate(value.at),note:cleanText(value.note,360),eduauth:value.eduauth?{mode:safeIdentifier(value.eduauth.mode,40),risk:safeIdentifier(value.eduauth.risk,20),requestId:safeIdentifier(value.eduauth.requestId,80),sessionId:safeIdentifier(value.eduauth.sessionId,80),actionId:safeIdentifier(value.eduauth.actionId,60),expiresAt:value.eduauth.expiresAt||null}:null}}
function cleanTerms(value){if(!value||typeof value!=='object')return null;return{status:value.status==='aceito'?'aceito':'não validado',generalTermsVersion:cleanText(value.generalTermsVersion,30),activityTermsVersion:cleanText(value.activityTermsVersion,30),acceptedAt:value.acceptedAt?cleanDate(value.acceptedAt):'',generalAcceptanceId:safeIdentifier(value.generalAcceptanceId,20),activityAcceptanceId:safeIdentifier(value.activityAcceptanceId,20),recordIntegrity:Boolean(value.recordIntegrity),educationalPurpose:Boolean(value.educationalPurpose)}}

export function sanitizeDiagnosticResult(input){
  assertSafeStructure(input);if(input?.kind!=='agv-diagnostic-result')throw new Error('Tipo de resultado não reconhecido.');
  const selectedClass=['1ADM','2ADM'].includes(input.selectedClass)?input.selectedClass:'';if(!selectedClass)throw new Error('Turma do resultado não reconhecida.');
  const result={kind:'agv-diagnostic-result',id:safeIdentifier(input.id,120),version:cleanText(input.version,30),student:{id:safeIdentifier(input.student?.id,80),name:cleanText(input.student?.name,90),classId:selectedClass},diagnosticMode:input.diagnosticMode==='general'?'general':'class',diagnosticModeLabel:cleanText(input.diagnosticModeLabel,120),selectedClass,classProfileUsed:['1ADM','2ADM'].includes(input.classProfileUsed)?input.classProfileUsed:null,startedAt:cleanDate(input.startedAt),endedAt:cleanDate(input.endedAt),durationSeconds:safeNumber(input.durationSeconds,{max:6*60*60}),minimumRequiredSeconds:safeNumber(input.minimumRequiredSeconds,{max:6*60*60}),minimumMet:Boolean(input.minimumMet),maximumAllowedSeconds:safeNumber(input.maximumAllowedSeconds,{max:6*60*60}),teacherRelease:cleanTeacherRelease(input.teacherRelease),finishReason:cleanText(input.finishReason,60),totalQuestions:safeNumber(input.totalQuestions,{max:200}),answered:safeNumber(input.answered,{max:200}),unanswered:safeNumber(input.unanswered,{max:200}),correct:safeNumber(input.correct,{max:200}),accuracy:safeNumber(input.accuracy,{max:100}),completionPercent:safeNumber(input.completionPercent,{max:100}),rawProficiency:safeNumber(input.rawProficiency,{max:100}),proficiency:safeNumber(input.proficiency,{max:100}),classification:cleanText(input.classification,120),validity:cleanText(input.validity,180),advancedAccuracy:safeNumber(input.advancedAccuracy,{max:100}),strongAreas:safeNumber(input.strongAreas,{max:30}),xp:safeNumber(input.xp,{max:100000}),maxStreak:safeNumber(input.maxStreak,{max:200}),powerupsUsed:safeNumber(input.powerupsUsed,{max:20}),integrity:{score:safeNumber(input.integrity?.score,{max:100,fallback:100}),shields:safeNumber(input.integrity?.shields,{max:10,fallback:3}),rapidAttempts:safeNumber(input.integrity?.rapidAttempts,{max:1000}),events:cleanEvents(input.integrity?.events)},areas:cleanAreas(input.areas),answers:cleanAnswers(input.answers),questionBankVersion:cleanText(input.questionBankVersion,60),validationToken:cleanText(input.validationToken,120),termsAcceptance:cleanTerms(input.termsAcceptance),delivery:{resultExported:Boolean(input.delivery?.resultExported),classroomOpened:Boolean(input.delivery?.classroomOpened),attachedConfirmed:Boolean(input.delivery?.attachedConfirmed),deliveredConfirmed:Boolean(input.delivery?.deliveredConfirmed)}};
  if(!result.id||!result.student.name)throw new Error('Resultado sem identificação suficiente.');
  result.answered=Math.min(result.answered,result.totalQuestions);result.correct=Math.min(result.correct,result.answered);result.unanswered=Math.max(0,result.totalQuestions-result.answered);
  return result;
}
