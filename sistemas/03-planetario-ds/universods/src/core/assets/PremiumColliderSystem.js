function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];}
function sub(a,b){return[a[0]-b[0],a[1]-b[1],a[2]-b[2]];}
export class PremiumColliderSystem{
 constructor(scene){this.scene=scene;this.colliders=scene?.colliders||[];}
 list(){return this.colliders.map(item=>structuredClone(item));}
 raycast(origin,direction,{maxDistance=Infinity}={}){let best=null;for(const collider of this.colliders){const node=this.scene.nodes[collider.node],center=node?.translation||[0,0,0];let distance=null;if(collider.type==='sphere'){const oc=sub(origin,center),b=dot(oc,direction),c=dot(oc,oc)-collider.radius**2,d=b*b-c;if(d>=0){const t=-b-Math.sqrt(d);if(t>=0)distance=t;}}else{const radius=collider.radius||Math.hypot(...(collider.size||[1,1,1]))/2;const oc=sub(origin,center),b=dot(oc,direction),c=dot(oc,oc)-radius**2,d=b*b-c;if(d>=0){const t=-b-Math.sqrt(d);if(t>=0)distance=t;}}if(distance!==null&&distance<=maxDistance&&(!best||distance<best.distance))best={...collider,distance,nodeName:node?.name||collider.name};}return best;}
 interactions(){return(this.scene?.interactions||[]).map(item=>structuredClone(item));}
}
