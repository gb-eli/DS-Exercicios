const clamp=(value,min,max)=>Math.min(max,Math.max(min,Number(value)||0));
export class SourceReliabilityEngine {
  constructor(criteria=[]){this.criteria=criteria;}
  score(ratings={}){
    let weighted=0,total=0;
    for(const criterion of this.criteria){const value=clamp(ratings[criterion.id],0,4);weighted+=value*criterion.weight;total+=4*criterion.weight;}
    return total?Math.round(weighted/total*100):0;
  }
  band(score){if(score>=75)return 'alta';if(score>=45)return 'média';return 'baixa';}
  feedback(score){if(score>=75)return 'Boa base para uso, mantendo contexto e citação.';if(score>=45)return 'Útil com cautela: confirme pontos importantes em outra fonte.';return 'Baixa confiabilidade: não use como evidência sem verificação independente.';}
  compareExpected(score,expectedBand){const band=this.band(score);return {band,expectedBand,matched:band===expectedBand,feedback:this.feedback(score)};}
}
