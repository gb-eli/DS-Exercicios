const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const PROFILES={
performance:{renderScale:.62,steps:30,shadowSamples:1,bloom:.12,ao:.15,dof:0,motion:0,particles:.35,exposure:1.0},
balanced:{renderScale:.84,steps:56,shadowSamples:2,bloom:.28,ao:.36,dof:.12,motion:.08,particles:.7,exposure:1.08},
experience:{renderScale:1,steps:92,shadowSamples:4,bloom:.48,ao:.62,dof:.32,motion:.22,particles:1,exposure:1.18}
};
export class CinematicPostProcessController{
 constructor(profile='balanced'){this.profile='balanced';this.state={};this.telemetry={};this.setProfile(profile);}
 setProfile(profile){this.profile=PROFILES[profile]?profile:'balanced';this.state={...PROFILES[this.profile],toneMapping:'aces',autoExposure:true,cinema:false};return this.snapshot();}
 setCinema(value){this.state.cinema=Boolean(value);this.state.dof=this.state.cinema?Math.max(this.state.dof,.28):PROFILES[this.profile].dof;this.state.motion=this.state.cinema?Math.max(this.state.motion,.16):PROFILES[this.profile].motion;return this.snapshot();}
 updateTelemetry(data={}){this.telemetry={...this.telemetry,...data};const luminance=Number(data.luminance??.55),speed=Math.abs(Number(data.speed??0)),danger=Number(data.danger??0);if(this.state.autoExposure)this.state.exposure=clamp(PROFILES[this.profile].exposure+(0.52-luminance)*.55,.62,1.8);this.state.motion=clamp((this.state.cinema?.15:0)+speed*.012,0,this.profile==='performance'?0:.48);this.state.bloom=clamp(PROFILES[this.profile].bloom+danger*.16,0,.7);return this.snapshot();}
 setExposure(value){this.state.autoExposure=false;this.state.exposure=clamp(Number(value)||1,.4,2.2);return this.snapshot();}
 setAutoExposure(value){this.state.autoExposure=Boolean(value);}
 budget(){const s=this.state;return{renderScale:s.renderScale,raySteps:s.steps,shadowSamples:s.shadowSamples,particleFactor:s.particles,estimatedGpuMs:Number((2.8+s.steps*.045+s.shadowSamples*.7+s.bloom*2+s.ao*1.2+s.dof*1.7+s.motion*1.4).toFixed(2))};}
 snapshot(){return structuredClone({...this.state,profile:this.profile,budget:this.budget()});}
}
