export function shouldRecoverCachedDraft(file,draft,serverContent){
  if(!draft||String(draft.content??'')===String(serverContent??''))return false;
  // Caches concluídos são removidos após confirmação da nuvem. Se uma versão
  // antiga deixou conteúdo divergente, preserve o trabalho em vez de descartá-lo.
  if(draft.legacy)return true;
  const remoteRevision=Number(file?.revision||0),draftRevision=Number(draft.remoteRevision||0);
  if(remoteRevision&&draftRevision){
    if(draftRevision===remoteRevision)return true;
    if(draftRevision>remoteRevision)return true;
    // O servidor avançou desde a base do rascunho. Nesse caso, só uma edição
    // comprovadamente posterior à gravação remota deve ser restaurada.
    const remoteAt=Date.parse(file?.saved_at||0)||0;
    return Boolean(draft.savedAt&&draft.savedAt>remoteAt+250);
  }
  const remoteAt=Date.parse(file?.saved_at||0)||0;
  return Boolean(draft.savedAt&&draft.savedAt>remoteAt+250);
}
