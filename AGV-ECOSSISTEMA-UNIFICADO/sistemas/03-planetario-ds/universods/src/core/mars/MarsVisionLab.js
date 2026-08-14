import { SAMPLE_LABELS } from '../../data/marsSystems.js';

export class MarsVisionLab {
  classify(features={}){
    const f={red:0,green:0,blue:0,texture:0,layers:0,reflective:0,...features};
    const scores={
      basalt:Math.max(0,100-Math.abs(f.red-42)*1.2-Math.abs(f.texture-78)*.7-Math.abs(f.reflective-18)*.35),
      clay:Math.max(0,100-Math.abs(f.red-67)-Math.abs(f.layers-88)*.7-Math.abs(f.texture-28)*.45),
      sulfate:Math.max(0,100-Math.abs(f.reflective-82)*.9-Math.abs(f.layers-57)*.5-Math.abs(f.red-74)*.55),
      meteorite:Math.max(0,100-Math.abs(f.reflective-91)-Math.abs(f.layers-8)*.8-Math.abs(f.blue-39)*.5)
    };
    const ranking=Object.entries(scores).sort((a,b)=>b[1]-a[1]);const [label,score]=ranking[0];const second=ranking[1]?.[1]??0;const confidence=Math.max(0,Math.min(99,Math.round(score*.72+(score-second)*.8)));
    return {label:confidence>=48?label:'unknown',labelText:SAMPLE_LABELS[confidence>=48?label:'unknown'],confidence,scores:Object.fromEntries(Object.entries(scores).map(([k,v])=>[k,Math.round(v)])),explanation:this.explain(label,f)};
  }
  explain(label,f){
    if(label==='basalt')return `Baixa refletância (${f.reflective}) e textura elevada (${f.texture}) favorecem basalto.`;
    if(label==='clay')return `Estratificação alta (${f.layers}) e textura fina (${f.texture}) favorecem argila.`;
    if(label==='sulfate')return `Refletância alta (${f.reflective}) e camadas intermediárias favorecem sulfato.`;
    return `Refletância metálica (${f.reflective}) e poucas camadas (${f.layers}) favorecem meteorito.`;
  }
}
