const clean=value=>String(value??'').replace(/\s+/g,' ').trim();
export class KnowledgeNarrator{
  constructor(synth=globalThis.speechSynthesis){this.synth=synth;this.active=false;}
  available(){return Boolean(this.synth&&globalThis.SpeechSynthesisUtterance);}
  buildText(item,mode='summary'){
    if(!item)return'';
    if(mode==='description')return clean(`Audiodescrição. ${item.name}. Categoria ${item.category}. A visualização usa ${item.visual?.colors?.length||3} cores e representa ${item.visual?.kind==='body'?'um corpo celeste':'um objeto ou conceito espacial'}. ${item.summary} Curiosidade: ${item.quickFact}`);
    if(mode==='technical')return clean(`${item.name}. ${item.summary} Sistemas relacionados: ${(item.technical?.systems||[]).join(', ')}. Linguagens: ${(item.technical?.languages||[]).join(', ')}. Desafio: ${item.technical?.challenge||''}`);
    return clean(`${item.name}. ${item.summary} Você sabia? ${item.quickFact}`);
  }
  speak(item,mode='summary',lang='pt-BR'){
    const text=this.buildText(item,mode);if(!text||!this.available())return false;this.stop();const utterance=new SpeechSynthesisUtterance(text);utterance.lang=lang;utterance.rate=.96;utterance.pitch=1;utterance.onend=()=>{this.active=false;};utterance.onerror=()=>{this.active=false;};this.active=true;this.synth.speak(utterance);return true;
  }
  stop(){try{this.synth?.cancel?.();}catch{}this.active=false;}
  destroy(){this.stop();}
}
