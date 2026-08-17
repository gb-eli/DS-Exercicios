const defaults=()=>({schema:'cosmos-ds-project-portfolio-v1',activeProjectId:null,activeRoleId:null,projectStages:{},projectNotes:{},careerDecisions:{},sourceReviews:{},portfolio:[],exhibition:{title:'Minha exposição espacial',intro:'Uma seleção de descobertas, projetos e evidências do COSMOS DS.',theme:'deep-space',selectedArtifactIds:[]},visitedTabs:[],exports:0,updatedAt:null});
const unique=list=>[...new Set(list)];
export class StudentPortfolioStore {
  constructor(storage,profileId){this.storage=storage;this.key=`project-curation:${profileId}`;}
  snapshot(){const value=this.storage.get(this.key,null)||{};return {...defaults(),...value,projectStages:{...(value.projectStages||{})},projectNotes:{...(value.projectNotes||{})},careerDecisions:{...(value.careerDecisions||{})},sourceReviews:{...(value.sourceReviews||{})},portfolio:[...(value.portfolio||[])],exhibition:{...defaults().exhibition,...(value.exhibition||{})}};}
  save(state){const next={...defaults(),...state,visitedTabs:unique(state.visitedTabs||[]),portfolio:(state.portfolio||[]).slice(-50),exhibition:{...defaults().exhibition,...state.exhibition,selectedArtifactIds:unique(state.exhibition?.selectedArtifactIds||[]).slice(0,6)},updatedAt:new Date().toISOString()};this.storage.set(this.key,next);return next;}
  visitTab(tab){const state=this.snapshot();state.visitedTabs=unique([...state.visitedTabs,tab]);return this.save(state);}
  selectProject(id){const state=this.snapshot();state.activeProjectId=id;return this.save(state);}
  selectRole(id){const state=this.snapshot();state.activeRoleId=id;return this.save(state);}
  toggleStage(projectId,stage){const state=this.snapshot(),current=state.projectStages[projectId]||[];state.projectStages={...state.projectStages,[projectId]:current.includes(stage)?current.filter(item=>item!==stage):[...current,stage]};return this.save(state);}
  note(projectId,text){const state=this.snapshot();state.projectNotes={...state.projectNotes,[projectId]:String(text||'').trim()};return this.save(state);}
  decideCareer(careerId,result){const state=this.snapshot();state.careerDecisions={...state.careerDecisions,[careerId]:{...result,createdAt:new Date().toISOString()}};return this.save(state);}
  reviewSource(sourceId,review){const state=this.snapshot();state.sourceReviews={...state.sourceReviews,[sourceId]:{...review,createdAt:new Date().toISOString()}};return this.save(state);}
  addArtifact(artifact){const state=this.snapshot(),item={id:`artifact-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,createdAt:new Date().toISOString(),...artifact};state.portfolio=[...state.portfolio,item];return this.save(state);}
  removeArtifact(id){const state=this.snapshot();state.portfolio=state.portfolio.filter(item=>item.id!==id);state.exhibition.selectedArtifactIds=state.exhibition.selectedArtifactIds.filter(item=>item!==id);return this.save(state);}
  updateExhibition(patch){const state=this.snapshot();state.exhibition={...state.exhibition,...patch};return this.save(state);}
  toggleExhibitionArtifact(id){const state=this.snapshot(),selected=state.exhibition.selectedArtifactIds;state.exhibition.selectedArtifactIds=selected.includes(id)?selected.filter(item=>item!==id):[...selected,id].slice(-6);return this.save(state);}
  exported(){const state=this.snapshot();state.exports=(state.exports||0)+1;return this.save(state);}
}
