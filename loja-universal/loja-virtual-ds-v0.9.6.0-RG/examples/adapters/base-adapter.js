export class DSPlatformAdapter {
  constructor(dsStore, platformId){this.store=dsStore;this.platformId=platformId;}
  reward({eventId,profileId,type,amount,evidenceId=null,metadata={}}){
    return this.store.reward({eventId,profileId,type,amount,platformId:this.platformId,evidenceId,metadata});
  }
  phaseCompleted(data){return this.reward({...data,type:'PHASE_COMPLETED'});}
  missionCompleted(data){return this.reward({...data,type:'MISSION_COMPLETED'});}
  labCompleted(data){return this.reward({...data,type:'LAB_COMPLETED'});}
  tutorialCompleted(data){return this.reward({...data,type:'TUTORIAL_COMPLETED'});}
}