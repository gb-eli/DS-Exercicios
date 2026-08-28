import crypto from 'node:crypto';
import { inferExerciseNumber } from './legacy-github-mapper.mjs';

export function normalizeText(content=''){
  return String(content).replace(/\r\n?/g,'\n');
}

export function gitBlobSha(content=''){
  const body=Buffer.from(String(content),'utf8');
  const header=Buffer.from(`blob ${body.length}\0`,'utf8');
  return crypto.createHash('sha1').update(Buffer.concat([header,body])).digest('hex');
}

export function buildReferenceSignatureIndex(referenceVariants=[]){
  const byBlob=new Map();
  for(const ref of referenceVariants||[]){
    const content=String(ref?.content??'');
    if(!content) continue;
    const sha=ref.gitBlobSha||gitBlobSha(content);
    const item={...ref,gitBlobSha:sha};
    if(!byBlob.has(sha)) byBlob.set(sha,[]);
    byBlob.get(sha).push(item);
  }
  return {byBlob};
}

export function classifyEvidence({path='',content=''}={}){
  const p=String(path).toLowerCase();
  if(/(^|\/)readme(?:\.[^/]*)?$/i.test(p)) return {kind:'documentation',language:'markdown'};
  if(/\.(zip|rar|7z|png|jpe?g|gif|pdf)$/i.test(p)) return {kind:'binary_or_archive',language:null};
  if(/\.py$/i.test(p)||/\b(input|print)\s*\(|\b(if|elif|else|for|while)\b[^\n]*:/m.test(String(content))) return {kind:'code',language:'python'};
  if(/\.html?$/i.test(p)||/<(?:!doctype|html|body|head)\b/i.test(String(content))) return {kind:'code',language:'html'};
  if(/\.css$/i.test(p)) return {kind:'code',language:'css'};
  if(/\.m?js$/i.test(p)||/\b(?:const|let|var|function|document\.)\b/.test(String(content))) return {kind:'code',language:'javascript'};
  if(/\.kt$/i.test(p)) return {kind:'code',language:'kotlin'};
  if(/\.xml$/i.test(p)) return {kind:'code',language:'xml'};
  return {kind:'unknown',language:null};
}

export function resolveContentMapping({claimedExerciseNumber,path='',content='',referenceIndex}={}){
  const claimed=Number(claimedExerciseNumber)||null;
  const pathExercise=inferExerciseNumber(path);
  const evidence=classifyEvidence({path,content});
  const sha=content ? gitBlobSha(content) : null;
  const exactMatches=sha&&referenceIndex?.byBlob?.get(sha) ? referenceIndex.byBlob.get(sha) : [];
  const exactExercises=[...new Set(exactMatches.map(x=>Number(x.exerciseNumber)).filter(Number.isFinite))];
  const exactClaim=claimed&&exactExercises.includes(claimed);
  const matchedOther=exactExercises.find(n=>n!==claimed)||null;
  let state='unresolved',confidence=0;
  if(exactClaim){state='exact_reference_match';confidence=1}
  else if(matchedOther){state='content_matches_other_exercise';confidence=1}
  else if(evidence.kind==='documentation'){state='documentation_only';confidence=0.35}
  else if(pathExercise===claimed&&evidence.kind==='code'){state='path_claim_candidate';confidence=0.78}
  else if(pathExercise&&claimed&&pathExercise!==claimed){state='path_claim_conflict';confidence=0.45}
  else if(evidence.kind==='code'){state='code_unmatched';confidence=0.5}
  return {
    claimedExerciseNumber:claimed,pathExercise,gitBlobSha:sha,evidence,
    exactMatches,exactExercises,matchedExerciseNumber:exactClaim?claimed:matchedOther,
    state,confidence,
    pathContentConflict:Boolean(matchedOther&&(pathExercise==null||pathExercise!==matchedOther)),
    safeForAutomaticCredit:state==='exact_reference_match',
  };
}

function normalizeRepoPath(path=''){
  const raw=String(path||'').replace(/\\/g,'/').replace(/^\.\//,'');
  const parts=[];
  for(const part of raw.split('/')){
    if(!part||part==='.') continue;
    if(part==='..') parts.pop(); else parts.push(part);
  }
  return parts.join('/');
}

function dirnameRepoPath(path=''){
  const normalized=normalizeRepoPath(path);
  const i=normalized.lastIndexOf('/');
  return i>=0?normalized.slice(0,i):'';
}

function resolveRepoResource(htmlPath,resource){
  const value=String(resource||'').trim();
  if(!value||/^(?:[a-z]+:|\/\/|#|data:)/i.test(value)) return null;
  const base=dirnameRepoPath(htmlPath);
  return normalizeRepoPath(base?`${base}/${value}`:value);
}

export function extractHtmlProjectReferences(htmlContent=''){
  const html=String(htmlContent||'');
  const resources=[];
  for(const m of html.matchAll(/<link\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi)){
    resources.push({kind:'stylesheet',raw:m[1]});
  }
  for(const m of html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi)){
    resources.push({kind:'script',raw:m[1]});
  }
  const ids=[...new Set([...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map(m=>m[1]))];
  const inlineHandlers=[...html.matchAll(/\bon([a-z]+)\s*=\s*["']([^"']+)["']/gi)].map(m=>({event:m[1].toLowerCase(),code:m[2]}));
  return {resources,ids,inlineHandlers};
}

export function extractJavascriptDomIdReferences(jsContent=''){
  const js=String(jsContent||'');
  const ids=[];
  for(const m of js.matchAll(/getElementById\s*\(\s*["']([^"']+)["']\s*\)/g)) ids.push(m[1]);
  for(const m of js.matchAll(/querySelector\s*\(\s*["']#([^"']+)["']\s*\)/g)) ids.push(m[1]);
  return [...new Set(ids)];
}

export function auditFrontendProject({htmlPath='index.html',htmlContent='',files=[]}={}){
  const normalizedFiles=(files||[]).map(f=>({path:normalizeRepoPath(f?.path||''),content:String(f?.content??'')}));
  const byPath=new Map(normalizedFiles.map(f=>[f.path,f]));
  const htmlRefs=extractHtmlProjectReferences(htmlContent);
  const resources=htmlRefs.resources.map(r=>{
    const resolvedPath=resolveRepoResource(htmlPath,r.raw);
    return {...r,resolvedPath,exists:resolvedPath==null?true:byPath.has(resolvedPath)};
  });
  const linkedScripts=resources.filter(r=>r.kind==='script'&&r.exists&&r.resolvedPath).map(r=>byPath.get(r.resolvedPath)).filter(Boolean);
  const jsFiles=linkedScripts.length?linkedScripts:normalizedFiles.filter(f=>/\.m?js$/i.test(f.path));
  const jsDomIds=[...new Set(jsFiles.flatMap(f=>extractJavascriptDomIdReferences(f.content)))];
  const htmlIds=new Set(htmlRefs.ids);
  const missingDomIds=jsDomIds.filter(id=>!htmlIds.has(id));
  const missingScripts=resources.filter(r=>r.kind==='script'&&!r.exists);
  const missingStylesheets=resources.filter(r=>r.kind==='stylesheet'&&!r.exists);
  const integrationReady=missingScripts.length===0&&missingDomIds.length===0;
  const severity=missingScripts.length||missingDomIds.length?3:missingStylesheets.length?1:0;
  return {
    htmlPath:normalizeRepoPath(htmlPath),
    resources,
    htmlIds:[...htmlIds],
    javascriptDomIds:jsDomIds,
    missingDomIds,
    missingScripts,
    missingStylesheets,
    inlineHandlers:htmlRefs.inlineHandlers,
    integrationReady,
    severity,
    state:missingScripts.length?'missing_script':missingDomIds.length?'dom_id_mismatch':missingStylesheets.length?'missing_stylesheet':'integrated',
  };
}
