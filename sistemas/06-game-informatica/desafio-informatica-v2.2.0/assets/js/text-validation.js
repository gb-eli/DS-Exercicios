const clean=value=>String(value??'').replace(/[<>]/g,' ').trim();
export const normalizeNarrative=value=>clean(value)
  .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .toLowerCase().replace(/[^a-z0-9@._%+\-\s]/g,' ')
  .replace(/\s+/g,' ').trim();

const STOPWORDS=new Set('a o as os um uma uns umas de da do das dos e em no na nos nas para por com sem ao aos à às que se seu sua seus suas este esta isso isto aquele aquela como mais menos muito muita muito muito eu voce você voces vocês nós nos ja já foi ser estar está sao são tem tenho temos segue seguem envio enviamos encaminho encaminhamos favor prezado prezada bom boa dia tarde noite'.split(/\s+/).map(normalizeNarrative));

const CONCEPT_VARIANTS={
  ola:['olá','oi','bom dia','boa tarde','boa noite','prezado','prezada','caro','cara','saudações'],
  atenciosamente:['atenciosamente','cordialmente','obrigado','obrigada','agradeço','agradecemos','grato','grata','abraços','até mais'],
  anexo:['anexo','anexado','anexada','arquivo','pdf','documento','segue o arquivo','estou enviando','encaminho o arquivo','material'],
  compartilhada:['compartilhada','compartilhado','compartilhei','acesso','link','liberei o acesso','disponível','disponivel'],
  pendencias:['pendências','pendencia','pendente','pendentes','casos em aberto','itens em aberto','itens a resolver','pontos a resolver','acompanhamento'],
  atrasos:['atrasos','atrasado','atrasados','fora do prazo','prazo vencido','prazos vencidos','demora','pendências de prazo'],
  administrativo:['administrativo','administrativa','administrativos','administrativas','administração','gestão','setor administrativo'],
  relatorio:['relatório','relatorio','informe','demonstrativo','levantamento','documento','consolidado','arquivo'],
  analise:['análise','analise','analisar','avaliação','avaliacao','avaliar','revisão','revisao','revisar','conferência','conferencia','conferir','verificação','verificacao','verificar','checar'],
  avaliacao:['avaliação','avaliacao','resultado','análise','analise','verificação','verificacao','atividade avaliativa'],
  plano:['plano','planejamento','proposta','ações','acoes','medidas','passos','estratégia','estrategia'],
  regularizacao:['regularização','regularizacao','regularizar','correção','correcao','corrigir','ajuste','ajustar','adequação','adequacao','resolver'],
  recomendacao:['recomendação','recomendacao','recomendo','recomendamos','sugestão','sugestao','sugerimos','orientação','orientacao'],
  resumo:['resumo','síntese','sintese','consolidado','visão geral','visao geral','principais pontos'],
  revisao:['revisão','revisao','revisar','conferência','conferencia','conferir','checagem','verificação','verificacao'],
  demanda:['demanda','solicitação','solicitacao','pedido','necessidade','requisição','requisicao'],
  apresentacao:['apresentação','apresentacao','slides','slide','material de apresentação','material visual'],
  comunicado:['comunicado','aviso','mensagem','informativo','comunicação','comunicacao'],
  continuidade:['continuidade','continuação','continuacao','seguir','prosseguimento','manter o atendimento','retomada'],
  retomada:['retomada','retomar','continuidade','volta','reinício','reinicio','recomeço','recomeco'],
  recuperacao:['recuperação','recuperacao','retomada','regularização','regularizacao','correção','correcao'],
  operacao:['operação','operacao','atividade','processo','rotina','execução','execucao'],
  regional:['regional','região','regiao','local','unidade','paraná','parana','curitiba','paranaguá','paranagua'],
  parana:['paraná','parana','estado do paraná','estado do parana'],
  atendimento:['atendimento','suporte','serviço','servico','assistência','assistencia'],
  servicos:['serviços','servicos','serviço','servico','atendimentos','atendimento'],
  expansao:['expansão','expansao','ampliação','ampliacao','ampliar','crescimento','aumentar'],
  conexao:['conexão','conexao','conectividade','rede','acesso','ligação','ligacao'],
  trabalho:['trabalho','atividade','rotina','processo','serviço','servico'],
  prioridades:['prioridades','prioridade','mais importante','itens críticos','itens criticos','urgências','urgencias'],
  materiais:['materiais','material','itens','suprimentos','recursos'],
  agosto:['agosto','08'],
  prazo:['prazo','prazos','data limite','até','ate','vencimento'],
  participantes:['participantes','pessoas','inscritos','alunos','equipe'],
  lista:['lista','relação','relacao','nomes','participantes'],
  horarios:['horários','horarios','horário','horario','jornada','turnos'],
  treinamento:['treinamento','capacitação','capacitacao','curso','formação','formacao'],
  conferencia:['conferência','conferencia','conferir','revisão','revisao','checagem'],
  compras:['compras','aquisições','aquisicoes','pedidos','fornecimentos'],
  gerencial:['gerencial','gestão','gestao','direção','direcao','administração','administracao'],
  fornecedores:['fornecedores','fornecedor','prestadores','prestador'],
  solicitacoes:['solicitações','solicitacoes','pedidos','demandas','requisições','requisicoes'],
  semanal:['semanal','semana','da semana'],
  resultado:['resultado','resultados','conclusão','conclusao','retorno'],
  acoes:['ações','acoes','medidas','passos','providências','providencias'],
  reuniao:['reunião','reuniao','encontro','reunião de gestão','reuniao de gestao']
};

const canonical=value=>normalizeNarrative(value).replace(/\s+/g,' ');
function levenshtein(a,b){
  if(a===b)return 0;if(!a.length)return b.length;if(!b.length)return a.length;
  const prev=Array.from({length:b.length+1},(_,i)=>i),cur=new Array(b.length+1);
  for(let i=1;i<=a.length;i++){
    cur[0]=i;
    for(let j=1;j<=b.length;j++)cur[j]=Math.min(cur[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));
    for(let j=0;j<=b.length;j++)prev[j]=cur[j];
  }
  return prev[b.length];
}
function nearToken(a,b){
  if(a===b)return true;
  if(Math.min(a.length,b.length)<5)return false;
  if(a.slice(0,5)===b.slice(0,5))return true;
  const limit=Math.max(a.length,b.length)>=9?2:1;
  return Math.abs(a.length-b.length)<=limit&&levenshtein(a,b)<=limit;
}
function phrasePresent(text,phrase){
  const p=canonical(phrase);if(!p)return false;
  if(text.includes(p))return true;
  const pTokens=p.split(' ').filter(Boolean),tTokens=text.split(' ').filter(Boolean);
  if(pTokens.length===1)return tTokens.some(token=>nearToken(token,pTokens[0]));
  return pTokens.every(token=>tTokens.some(candidate=>nearToken(candidate,token)));
}
export function conceptVariants(concept){
  const key=canonical(concept),mapped=CONCEPT_VARIANTS[key];
  return [...new Set([concept,...(mapped||[])])];
}
export function conceptSatisfied(value,concept){
  const text=canonical(value);if(!text)return false;
  return conceptVariants(concept).some(variant=>phrasePresent(text,variant));
}
export function flexibleConceptCoverage(value,concepts=[],options={}){
  const unique=[...new Set((concepts||[]).map(item=>clean(item)).filter(Boolean))];
  if(!unique.length)return {ok:true,matched:[],missing:[],ratio:1,required:0};
  const matched=unique.filter(concept=>conceptSatisfied(value,concept));
  const ratio=matched.length/unique.length;
  const minimumRatio=Math.max(0,Math.min(1,Number(options.minimumRatio??0.45)));
  const required=Math.max(Number(options.minimumConcepts??1),Math.ceil(unique.length*minimumRatio));
  return {ok:matched.length>=Math.min(unique.length,required),matched,missing:unique.filter(x=>!matched.includes(x)),ratio,required};
}
export function meaningfulTokens(value){
  return canonical(value).split(' ').filter(token=>token.length>=3&&!STOPWORDS.has(token)&&!/^\d+$/.test(token));
}
export function contextualOverlap(value,reference){
  const input=[...new Set(meaningfulTokens(value))],ref=[...new Set(meaningfulTokens(reference))];
  if(!ref.length)return 0;
  let matched=0;
  for(const token of ref)if(input.some(candidate=>nearToken(candidate,token)))matched++;
  return matched/ref.length;
}
export function narrativeLooksComplete(value,{minWords=4,minChars=18}={}){
  const text=clean(value),words=canonical(value).split(' ').filter(Boolean);
  return text.length>=minChars&&words.length>=minWords;
}

export function narrativeIntentSatisfied(value){
  return ['anexo','analise','demanda','plano','recomendacao','resumo','revisao','resultado'].some(concept=>conceptSatisfied(value,concept))
    || /\b(envio|enviar|encaminho|encaminhar|segue|seguem|informo|informamos|solicito|solicitamos|peco|pedimos|confira|confiram|verifique|verifiquem)\b/.test(normalizeNarrative(value));
}
