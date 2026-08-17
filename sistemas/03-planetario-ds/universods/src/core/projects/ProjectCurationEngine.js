const clone=value=>structuredClone(value);
export class ProjectCurationEngine {
  constructor({projects=[],careers=[],sources=[],competencies=[],themes=[]}={}){this.projects=projects;this.careers=careers;this.sources=sources;this.competencies=competencies;this.themes=themes;}
  project(id){const value=this.projects.find(item=>item.id===id);return value?clone(value):null;}
  career(id){const value=this.careers.find(item=>item.id===id);return value?clone(value):null;}
  source(id){const value=this.sources.find(item=>item.id===id);return value?clone(value):null;}
  compatibleCareers(projectId){const project=this.projects.find(item=>item.id===projectId);return project?clone(this.careers.filter(item=>project.roles.includes(item.id))):[];}
  careerDecision(careerId,choiceId){const career=this.careers.find(item=>item.id===careerId),choice=career?.choices.find(item=>item.id===choiceId);return choice?clone({careerId,choiceId,score:choice.score,maxScore:3,feedback:choice.feedback,label:choice.label}):null;}
  completion(state={}){
    const project=this.projects.find(item=>item.id===state.activeProjectId),stages=project?.stages||[],done=stages.filter(stage=>state.projectStages?.[project.id]?.includes(stage)).length;
    return {projectStages:stages.length?Math.round(done/stages.length*100):0,career:Object.keys(state.careerDecisions||{}).length,sourceReviews:Object.keys(state.sourceReviews||{}).length,portfolio:(state.portfolio||[]).length,exhibition:(state.exhibition?.selectedArtifactIds||[]).length};
  }
  validate(){const projectIds=new Set(this.projects.map(item=>item.id)),careerIds=new Set(this.careers.map(item=>item.id)),sourceIds=new Set(this.sources.map(item=>item.id));const brokenRoles=this.projects.filter(project=>project.roles.some(id=>!careerIds.has(id))).map(item=>item.id);return {ok:projectIds.size===this.projects.length&&careerIds.size===this.careers.length&&sourceIds.size===this.sources.length&&!brokenRoles.length,brokenRoles};}
}
