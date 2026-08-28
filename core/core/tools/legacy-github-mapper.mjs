const stripAccents=(v='')=>String(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const safeDecode=v=>{try{return decodeURIComponent(v)}catch{return v}};

export function normalizeGitHubTarget(rawUrl){
  const input=String(rawUrl||'').trim();
  let url;
  try{url=new URL(input)}catch{return {valid:false,reason:'invalid_url',rawUrl:input}};
  if(url.hostname.toLowerCase()!=='github.com') return {valid:false,reason:'not_github',rawUrl:input};
  const parts=url.pathname.split('/').filter(Boolean).map(safeDecode);
  if(parts.length<2) return {valid:false,reason:'missing_repository',rawUrl:input};
  const owner=parts[0];
  const repository=parts[1].replace(/\.git$/i,'');
  if(!owner||!repository) return {valid:false,reason:'missing_repository',rawUrl:input};
  let branch=null,filePath=null,targetType='repository';
  if(parts[2]==='blob'&&parts.length>=5){branch=parts[3];filePath=parts.slice(4).join('/');targetType='file'}
  else if(parts[2]==='tree'&&parts.length>=4){branch=parts[3];filePath=parts.slice(4).join('/');targetType='directory'}
  return {
    valid:true,rawUrl:input,owner,repository,repositorySlug:`${owner}/${repository}`,
    canonicalUrl:`https://github.com/${owner}/${repository}`,
    branch,filePath,targetType,
  };
}

export function inferExerciseNumber(path){
  const raw=safeDecode(String(path||''));
  const normalized=stripAccents(raw).toLowerCase().replace(/\\/g,'/');
  const basename=normalized.split('/').filter(Boolean).pop()||normalized;
  const patterns=[
    /(?:exercicio|exerc|ex|atividade|atv|tarefa|task)[\s._-]*0*(\d{1,3})(?:\D|$)/i,
    /^ml[\s._-]*0*(\d{1,3})(?:\D|$)/i,
    /(?:^|[/_-])0*(\d{1,3})(?:\D|$)/,
  ];
  for(const pattern of patterns){
    const m=basename.match(pattern)||normalized.match(pattern);
    if(m){const n=Number(m[1]);if(Number.isInteger(n)&&n>0&&n<=999)return n}
  }
  return null;
}

export function classifyRepositoryEntries(entries=[],claimedExerciseNumbers=[]){
  const claims=new Set((claimedExerciseNumbers||[]).map(Number).filter(Number.isFinite));
  const candidates=[];
  for(const entry of entries||[]){
    const path=String(entry?.path||entry?.name||'');
    const n=inferExerciseNumber(path);
    if(!n) continue;
    const exactClaim=claims.size===0||claims.has(n);
    const lower=stripAccents(path).toLowerCase();
    let confidence=0.72;
    let method='path_number';
    if(/(?:exercicio|exerc|atividade|tarefa|task|\bex)\D*0*\d/i.test(lower)){confidence=0.96;method='named_exercise'}
    else if(/(?:^|\/)ml\D*0*\d/i.test(lower)){confidence=0.84;method='student_prefix_number'}
    if(!exactClaim) confidence=Math.min(confidence,0.55);
    candidates.push({exerciseNumber:n,path,type:entry?.type||null,confidence,method,claimed:exactClaim});
  }
  const byNumber=new Map();
  for(const c of candidates){
    const prev=byNumber.get(c.exerciseNumber);
    if(!prev||c.confidence>prev.confidence) byNumber.set(c.exerciseNumber,c);
  }
  const mappings=[...byNumber.values()].sort((a,b)=>a.exerciseNumber-b.exerciseNumber);
  const mapped=new Set(mappings.filter(x=>x.claimed).map(x=>x.exerciseNumber));
  const missingClaims=[...claims].filter(n=>!mapped.has(n)).sort((a,b)=>a-b);
  const extraMappings=mappings.filter(x=>claims.size&&!claims.has(x.exerciseNumber));
  return {mappings,missingClaims,extraMappings,ambiguous:missingClaims.length>0||extraMappings.length>0};
}

export function shouldAutoApproveMapping(mapping,{minConfidence=0.9}={}){
  return Boolean(mapping&&mapping.claimed&&Number(mapping.confidence)>=minConfidence);
}
