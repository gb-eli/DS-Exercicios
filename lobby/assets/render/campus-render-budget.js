// F89 — orçamento explícito do Campus para exploração normal.
// O mapa completo continua disponível em mirantes/câmeras/airdrop; o culling vale apenas no chão.
const BUDGETS=Object.freeze({
  low:Object.freeze({experienceRadius:34,buildingRadius:46,intervalMs:520}),
  medium:Object.freeze({experienceRadius:44,buildingRadius:60,intervalMs:420}),
  high:Object.freeze({experienceRadius:54,buildingRadius:78,intervalMs:340}),
  ultra:Object.freeze({experienceRadius:64,buildingRadius:96,intervalMs:300})
});
export function campusRenderBudget(quality='medium',profile={}){
  const base=BUDGETS[quality]||BUDGETS.medium,constrained=!!(profile?.saveData||profile?.mobile&&Number(profile?.memory||8)<=4);
  if(!constrained)return base;
  return Object.freeze({experienceRadius:Math.max(28,base.experienceRadius-8),buildingRadius:Math.max(40,base.buildingRadius-10),intervalMs:Math.max(base.intervalMs,520)});
}
export function applyCampusRenderBudget({quality='medium',profile={},player,buildingRoots=[],experienceRoots=[],forceFull=false}={}){
  const budget=campusRenderBudget(quality,profile);let visibleBuildings=0,visibleExperiences=0;
  for(const root of buildingRoots){if(!root)continue;const x=Number(root.position?.x)||0,z=Number(root.position?.z)||0,d=Math.hypot((Number(player?.x)||0)-x,(Number(player?.z)||0)-z),show=forceFull||d<=budget.buildingRadius;root.visible=show;if(show)visibleBuildings++;}
  for(const root of experienceRoots){if(!root)continue;const exp=root.userData?.experience,x=Number(exp?.entrance?.x??exp?.x??root.position?.x)||0,z=Number(exp?.entrance?.z??exp?.z??root.position?.z)||0,d=Math.hypot((Number(player?.x)||0)-x,(Number(player?.z)||0)-z),show=forceFull||d<=budget.experienceRadius;root.visible=show;if(show)visibleExperiences++;}
  return{...budget,visibleBuildings,visibleExperiences};
}
