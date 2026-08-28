export class TelemetryAnimationBridge{
 constructor(renderer){this.renderer=renderer;this.last='';this.enabled=true;}
 update(state={}){if(!this.enabled||!this.renderer)return null;let clip=null;if(state.stageSeparated||state.separation)clip='Separation';else if(state.docking||state.capture)clip='Capture';else if(state.roverSpeed>.05||state.speed>.2)clip='Drive';else if(state.armActive)clip='Arm';else if(state.solarDeploy)clip='Deploy';else if(state.hatchOpen)clip='Open';else if(state.gimbal)clip='Gimbal';if(clip&&clip!==this.last){const match=this.renderer.animationList().find(name=>name.toLowerCase().includes(clip.toLowerCase()));if(match){this.renderer.playAnimation(match,{restart:true});this.last=clip;return match;}}return null;}
 reset(){this.last='';}
}
