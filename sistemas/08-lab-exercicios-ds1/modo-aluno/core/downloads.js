
window.DSCore = window.DSCore || {};
window.DSCore.downloads = (() => {
  function save(name,content,type='text/plain;charset=utf-8'){
    const blob=content instanceof Blob?content:new Blob([content],{type});
    const url=URL.createObjectURL(blob); const link=document.createElement('a');
    link.href=url;link.download=name;link.rel='noopener noreferrer';document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  return {save};
})();
