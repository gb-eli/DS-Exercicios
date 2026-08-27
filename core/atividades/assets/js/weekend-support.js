const DEFAULT_TIME_ZONE='America/Sao_Paulo';
const DAY_INDEX={Sunday:0,Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5,Saturday:6};

function zonedParts(epochMs,timeZone=DEFAULT_TIME_ZONE){
  const dtf=new Intl.DateTimeFormat('en-US',{timeZone,weekday:'long',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
  const raw=Object.fromEntries(dtf.formatToParts(new Date(epochMs)).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
  return {weekday:raw.weekday,year:Number(raw.year),month:Number(raw.month),day:Number(raw.day),hour:Number(raw.hour),minute:Number(raw.minute),second:Number(raw.second)};
}
function timeZoneOffsetMs(epochMs,timeZone=DEFAULT_TIME_ZONE){
  const p=zonedParts(epochMs,timeZone);
  const asUtc=Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second);
  return asUtc-Math.floor(epochMs/1000)*1000;
}
function zonedLocalToEpoch(year,month,day,hour=0,minute=0,second=0,timeZone=DEFAULT_TIME_ZONE){
  const wallUtc=Date.UTC(year,month-1,day,hour,minute,second);
  let candidate=wallUtc-timeZoneOffsetMs(wallUtc,timeZone);
  candidate=wallUtc-timeZoneOffsetMs(candidate,timeZone);
  return candidate;
}
function addCalendarDays(year,month,day,days){
  const d=new Date(Date.UTC(year,month-1,day+days));
  return {year:d.getUTCFullYear(),month:d.getUTCMonth()+1,day:d.getUTCDate()};
}
function pad2(n){return String(Math.max(0,Math.floor(Number(n)||0))).padStart(2,'0');}
export function formatWeekendCountdown(ms){
  const total=Math.max(0,Math.floor(Number(ms||0)/1000));
  const days=Math.floor(total/86400),hours=Math.floor((total%86400)/3600),minutes=Math.floor((total%3600)/60),seconds=total%60;
  return days>0?`${days}d ${pad2(hours)}h ${pad2(minutes)}m ${pad2(seconds)}s`:`${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
}
export function getWeekendWindow(now=Date.now(),timeZone=DEFAULT_TIME_ZONE){
  const epoch=now instanceof Date?now.getTime():Number(now);
  const p=zonedParts(epoch,timeZone),dayIndex=DAY_INDEX[p.weekday];
  const isWeekend=dayIndex===6||dayIndex===0;
  let sunday={year:p.year,month:p.month,day:p.day};
  if(dayIndex===6)sunday=addCalendarDays(p.year,p.month,p.day,1);
  const cutoffMs=isWeekend?zonedLocalToEpoch(sunday.year,sunday.month,sunday.day,18,0,0,timeZone):null;
  const eligible=Boolean(isWeekend&&epoch<cutoffMs);
  const weekendId=isWeekend?`${sunday.year}-${pad2(sunday.month)}-${pad2(sunday.day)}`:null;
  return {eligible,isWeekend,phase:dayIndex===6?'saturday':dayIndex===0?(eligible?'sunday':'closed'):'weekday',timeZone,weekendId,cutoffMs,remainingMs:eligible?Math.max(0,cutoffMs-epoch):0,local:p};
}

function normalizeText(value){return String(value??'').replace(/\r\n?/g,'\n');}
function meaningfulLines(value){return normalizeText(value).split('\n').map((text,index)=>({text,index:index+1,trim:text.trim()})).filter(x=>x.trim);}
function firstMismatchLine(student,reference){
  const s=meaningfulLines(student),r=meaningfulLines(reference);if(!s.length)return 1;if(!r.length)return null;
  const max=Math.max(s.length,r.length);
  for(let i=0;i<max;i++){
    if(!s[i])return s.length?Math.max(1,s[s.length-1].index):1;
    if(!r[i])return s[i].index;
    if(s[i].trim.replace(/\s+/g,' ')!==r[i].trim.replace(/\s+/g,' '))return s[i].index;
  }
  return null;
}
function balanceIssues(source){
  const text=normalizeText(source),pairs=[['(',')','parênteses'],['{','}','chaves'],['[',']','colchetes']];
  const issues=[];
  for(const [open,close,label] of pairs){const a=[...text].filter(c=>c===open).length,b=[...text].filter(c=>c===close).length;if(a!==b)issues.push(`${label}: ${a} abertura(s) e ${b} fechamento(s)`);}
  return issues;
}
function extractIds(html){return new Set([...normalizeText(html).matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map(m=>m[1]));}
function extractClasses(html){
  const out=new Set();for(const m of normalizeText(html).matchAll(/\bclass\s*=\s*["']([^"']+)["']/gi))for(const c of m[1].split(/\s+/).filter(Boolean))out.add(c);return out;
}
function extractJsIdRefs(js){
  const out=new Set();const text=normalizeText(js);
  for(const m of text.matchAll(/getElementById\s*\(\s*["']([^"']+)["']\s*\)/g))out.add(m[1]);
  for(const m of text.matchAll(/querySelector(?:All)?\s*\(\s*["']#([A-Za-z_][\w:-]*)["']\s*\)/g))out.add(m[1]);
  return out;
}
function extractHtmlAssetRefs(html){
  const out=[];const text=normalizeText(html);
  for(const m of text.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi))out.push({kind:'script',path:m[1]});
  for(const m of text.matchAll(/<link\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi))if(/stylesheet/i.test(m[0]))out.push({kind:'style',path:m[1]});
  return out;
}
function basename(path){return String(path||'').split(/[?#]/)[0].split('/').filter(Boolean).pop()||'';}
function structuralSignals(language,reference,student){
  const lang=String(language||'').toLowerCase(),r=normalizeText(reference),s=normalizeText(student),missing=[];
  if(lang==='html'){
    const tags=['main','header','footer','nav','section','article','aside','form','fieldset','label','input','button','select','textarea','table','thead','tbody','tr','th','td'];
    for(const t of tags)if(new RegExp(`<${t}\\b`,'i').test(r)&&!new RegExp(`<${t}\\b`,'i').test(s))missing.push(`<${t}>`);
  }else if(lang==='css'){
    const props=['display','flex-direction','flex-wrap','justify-content','align-items','gap','grid-template-columns','margin','padding','border','background','color','@media'];
    for(const p of props)if(new RegExp(`${p.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}\\s*:`,'i').test(r)&&!new RegExp(`${p.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}\\s*:`,'i').test(s))missing.push(p);
    if(/@media/i.test(r)&&!/@media/i.test(s)&&!missing.includes('@media'))missing.push('@media');
  }else if(['javascript','js','mjs'].includes(lang)){
    const signals=['addEventListener','getElementById','querySelector','function','const','let','if','else','for','while','return'];
    for(const sig of signals)if(new RegExp(`\\b${sig}\\b`).test(r)&&!new RegExp(`\\b${sig}\\b`).test(s))missing.push(sig);
  }else if(['python','py'].includes(lang)){
    const signals=['input','print','if','elif','else','for','while','range','def','return'];
    for(const sig of signals)if(new RegExp(`\\b${sig}\\b`).test(r)&&!new RegExp(`\\b${sig}\\b`).test(s))missing.push(sig);
  }
  return missing.slice(0,5);
}
export function buildWeekendDiagnostics({filename='',language='',studentContent='',referenceContent='',files=[],serverDetail=null}={}){
  const suggestions=[],student=normalizeText(studentContent),reference=normalizeText(referenceContent),name=String(filename||'arquivo');
  const fileMap=new Map((files||[]).map(f=>[String(f.filename||'').toLowerCase(),normalizeText(f.content)]));
  const activeScore=serverDetail?Math.round(Number(serverDetail.score||0)):null;
  if(serverDetail?.missing||!student.trim()){
    suggestions.push({level:'high',title:`Comece pelo ${name}`,message:'Este arquivo ainda está vazio ou não foi encontrado. Crie a estrutura mínima indicada na referência antes de avançar.',focusLine:1});
  }
  const balances=balanceIssues(student);
  if(serverDetail?.syntax_ok===false&&balances.length)suggestions.push({level:'high',title:'Fechamento de código',message:`Revise ${balances[0]}. Um fechamento ausente costuma impedir a execução.`,focusLine:firstMismatchLine(student,reference)||1});
  const htmlEntry=[...fileMap.entries()].find(([n])=>/\.html?$/.test(n));
  const jsEntry=[...fileMap.entries()].find(([n])=>/\.(?:js|mjs)$/.test(n));
  if(htmlEntry){
    const available=new Set([...fileMap.keys()].map(basename));
    for(const asset of extractHtmlAssetRefs(htmlEntry[1])){
      const target=basename(asset.path);if(target&&!available.has(target))suggestions.push({level:'high',title:'Arquivo não conectado',message:`O HTML tenta carregar “${target}”, mas esse arquivo não existe com esse nome no projeto. Corrija o nome no HTML ou no arquivo.`,focusLine:name.toLowerCase()===htmlEntry[0]?Math.max(1,normalizeText(htmlEntry[1]).split('\n').findIndex(line=>line.includes(asset.path))+1):null});
    }
  }
  if(htmlEntry&&jsEntry){
    const ids=extractIds(htmlEntry[1]);for(const id of extractJsIdRefs(jsEntry[1]))if(!ids.has(id))suggestions.push({level:'high',title:'ID desconectado',message:`O JavaScript procura “#${id}”, mas esse ID não existe no HTML. Confira a grafia nos dois arquivos.`,focusLine:name.toLowerCase()===jsEntry[0]?Math.max(1,normalizeText(jsEntry[1]).split('\n').findIndex(line=>line.includes(id))+1):null});
  }
  const missingSignals=structuralSignals(language,reference,student);
  if(missingSignals.length)suggestions.push({level:'medium',title:'Parte estrutural faltando',message:`Compare esta região com a referência: ainda não aparecem ${missingSignals.join(', ')}. Implemente primeiro esses elementos e teste novamente.`,focusLine:firstMismatchLine(student,reference)||1});
  if(!suggestions.length&&activeScore!==null&&activeScore<100){
    const focus=firstMismatchLine(student,reference);
    suggestions.push({level:activeScore>=70?'medium':'high',title:'Ajuste localizado',message:focus?`Seu arquivo está em ${activeScore}%. Revise a região próxima da linha ${focus}; é o primeiro ponto que se afasta da referência mais compatível.`:`Seu arquivo está em ${activeScore}%. Compare nomes, condições e ligações entre os arquivos antes de alterar grandes blocos.`,focusLine:focus});
  }
  if(!suggestions.length&&activeScore===100)suggestions.push({level:'ok',title:'Arquivo correto',message:'A autocorreção chegou a 100% neste arquivo. Você pode seguir para os outros arquivos ou entregar a atividade.',focusLine:null});
  const focusLine=suggestions.find(s=>Number.isFinite(Number(s.focusLine))&&Number(s.focusLine)>0)?.focusLine||null;
  const steps=suggestions.filter(s=>s.level!=='ok').slice(0,3).map((s,i)=>`${i+1}. ${s.message}`);
  if(steps.length)steps.push(`${steps.length+1}. Execute “Auto corrigir” novamente para confirmar o ajuste.`);
  return {filename:name,score:activeScore,focusLine,suggestions:suggestions.slice(0,4),steps};
}

export const WEEKEND_SUPPORT_TIME_ZONE=DEFAULT_TIME_ZONE;
