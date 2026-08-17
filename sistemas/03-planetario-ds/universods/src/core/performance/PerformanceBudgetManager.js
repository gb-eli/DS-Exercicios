const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const QUALITY_PACKS={
light:{id:'light',label:'Leve',targetFps:45,maxTriangles:120000,maxDrawCalls:90,maxTextureMb:96,renderScale:.62,particles:.35,lodBias:-1},
balanced:{id:'balanced',label:'Equilibrado',targetFps:50,maxTriangles:320000,maxDrawCalls:180,maxTextureMb:220,renderScale:.84,particles:.72,lodBias:0},
premium:{id:'premium',label:'Premium',targetFps:60,maxTriangles:850000,maxDrawCalls:360,maxTextureMb:520,renderScale:1,particles:1,lodBias:1}
};
export class PerformanceBudgetManager{
 constructor(pack='balanced'){this.samples=[];this.setPack(pack);this.dynamicScale=this.pack.renderScale;this.recommendation=pack;}
 setPack(id){this.pack=QUALITY_PACKS[id]||QUALITY_PACKS.balanced;this.dynamicScale=this.pack.renderScale;return this.snapshot();}
 sample({fps=60,frameMs=16.7,triangles=0,drawCalls=0,textureMb=0,memoryMb=0}={}){const s={fps:Number(fps),frameMs:Number(frameMs),triangles:Number(triangles),drawCalls:Number(drawCalls),textureMb:Number(textureMb),memoryMb:Number(memoryMb),at:Date.now()};this.samples.push(s);if(this.samples.length>120)this.samples.shift();const avg=this.average();const overloaded=avg.fps<this.pack.targetFps*.82||avg.drawCalls>this.pack.maxDrawCalls||avg.triangles>this.pack.maxTriangles||avg.textureMb>this.pack.maxTextureMb;if(overloaded)this.dynamicScale=clamp(this.dynamicScale-.04,.48,this.pack.renderScale);else if(avg.fps>this.pack.targetFps*1.08)this.dynamicScale=clamp(this.dynamicScale+.015,.48,this.pack.renderScale);this.recommendation=this.recommend(avg);return{...s,overloaded,dynamicScale:this.dynamicScale,recommendation:this.recommendation};}
 average(){if(!this.samples.length)return{fps:60,frameMs:16.7,triangles:0,drawCalls:0,textureMb:0,memoryMb:0};const keys=['fps','frameMs','triangles','drawCalls','textureMb','memoryMb'];return Object.fromEntries(keys.map(k=>[k,this.samples.reduce((a,s)=>a+s[k],0)/this.samples.length]));}
 recommend(avg=this.average()){if(avg.fps<36||avg.memoryMb>900||avg.textureMb>300)return'light';if(avg.fps>56&&avg.memoryMb<650&&avg.drawCalls<220)return'premium';return'balanced';}
 diagnostics(){const avg=this.average();return{pack:this.pack.id,label:this.pack.label,average:avg,dynamicScale:this.dynamicScale,recommendation:this.recommendation,budgets:{triangles:avg.triangles/this.pack.maxTriangles,drawCalls:avg.drawCalls/this.pack.maxDrawCalls,textures:avg.textureMb/this.pack.maxTextureMb}};}
 snapshot(){return structuredClone({pack:this.pack,dynamicScale:this.dynamicScale,recommendation:this.recommendation,average:this.average()});}
}
