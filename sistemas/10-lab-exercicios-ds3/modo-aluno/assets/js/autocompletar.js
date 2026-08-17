window.AutoCompleteSupport = (() => {
  'use strict';
  const VERSION = 2;
  const MARKER_TEXT = 'Código parcialmente completado por uma versão antiga da plataforma.';
  function normalizeToken(value, fallback = 'valor') { return String(value || fallback).trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9._-]+/g,'-').replace(/^-+|-+$/g,'') || fallback; }
  function projectToken(){ return normalizeToken(window.APP_CONFIG?.repositorio,'3ds-programacao'); }
  function config(){ return { enabled:false, blocks:{} }; }
  function blocks(){ return []; }
  function markerFor(file){ const key=String(file||'').toLowerCase(); if(key.startsWith('html'))return `<!-- ${MARKER_TEXT} -->`; if(key==='css')return `/* ${MARKER_TEXT} */`; if(key==='py'||key==='python')return `# ${MARKER_TEXT}`; return `// ${MARKER_TEXT}`; }
  function hasMarker(code,file){ return String(code||'').includes(markerFor(file)); }
  function addMarker(code,file){ const text=String(code||''), marker=markerFor(file); if(!text.trim()||text.includes(marker))return text; return `${marker}\n${text}`; }
  function insertBlock(){ return {ok:false,message:'Autocompletar indisponível. Observe a referência e digite o código manualmente.'}; }
  function signalDetails(){ return []; }
  function eligibility(){ return {available:false,unlocked:false,origin:'desativado',reason:'Autocompletar desativado. O código deve ser digitado manualmente.',signals:[]}; }
  function approximatePercentage(){ return 0; }
  return { VERSION, MARKER_TEXT, normalizeToken, projectToken, config, blocks, markerFor, hasMarker, addMarker, insertBlock, signalDetails, eligibility, approximatePercentage };
})();
