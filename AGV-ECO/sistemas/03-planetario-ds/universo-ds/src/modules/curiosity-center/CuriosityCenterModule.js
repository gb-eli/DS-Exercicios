import { SPACE_KNOWLEDGE, KNOWLEDGE_SOURCES, KNOWLEDGE_TYPES } from '../../data/knowledge/spaceKnowledge.js';
import { KnowledgeEngine } from '../../core/knowledge/KnowledgeEngine.js';
import { KnowledgeProfileStore } from '../../core/knowledge/KnowledgeProfileStore.js';
import { KnowledgeOrbRenderer } from '../../rendering/KnowledgeOrbRenderer.js';

const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const typeLabel=type=>({celestial:'Mundo',mission:'Missão',technology:'Tecnologia',curiosity:'Curiosidade'}[type]||type);

class CuriosityCenterModule {
  constructor(){
    this.container=null;this.context=null;this.engine=new KnowledgeEngine(SPACE_KNOWLEDGE,KNOWLEDGE_SOURCES);this.profileState=null;this.renderer=null;
    this.selectedId='earth';this.query='';this.type='all';this.category='all';this.onlyFavorites=false;this.onlyUndiscovered=false;this.detailOpen=false;this.detailTab='quick';this.compareOpen=false;this.photoMode=false;this.results=[];
    this.onClick=e=>this.handleClick(e);this.onInput=e=>this.handleInput(e);this.onKeyDown=e=>this.handleKeyDown(e);
  }
  mount(container,context){
    this.container=container;this.context=context;this.profileState=new KnowledgeProfileStore(context.settingsStore.storage,context.profileStore.active().id);
    const requested=sessionStorage.getItem('cosmos-ds-knowledge-target');sessionStorage.removeItem('cosmos-ds-knowledge-target');
    this.selectedId=this.engine.get(requested)?requested:this.engine.get(this.profileState.snapshot().lastViewed)?this.profileState.snapshot().lastViewed:'earth';
    this.results=this.engine.search();container.addEventListener('click',this.onClick);container.addEventListener('input',this.onInput);addEventListener('keydown',this.onKeyDown);this.render();this.startRenderer();
  }
  unmount(){this.renderer?.destroy();this.container?.removeEventListener('click',this.onClick);this.container?.removeEventListener('input',this.onInput);removeEventListener('keydown',this.onKeyDown);}
  selected(){return this.engine.get(this.selectedId)||this.engine.get('earth');}
  render(){
    const item=this.selected(),state=this.profileState.snapshot(),profile=this.context.settingsStore.getProfile();
    this.container.innerHTML=`<section class="knowledge-module quality-${profile.id}">
      <div class="knowledge-stage ${this.photoMode?'photo-mode':''}" id="knowledge-stage">
        <canvas id="knowledge-canvas" aria-label="Visualização 3D e 360 graus do item selecionado"></canvas>
        <div class="knowledge-vignette" aria-hidden="true"></div><div class="knowledge-grid-horizon" aria-hidden="true"></div>
        <header class="knowledge-topbar immersive-hud">
          <button class="hud-icon" data-action="back" aria-label="Voltar">←</button>
          <div class="knowledge-target-chip"><i id="knowledge-target-symbol" style="--knowledge-a:${item.visual.colors[0]}">${escapeHtml(item.symbol)}</i><div><b id="knowledge-target-name">${escapeHtml(item.name)}</b><small id="knowledge-target-meta">${escapeHtml(typeLabel(item.type))} · ${escapeHtml(item.category)}</small></div></div>
          <div class="knowledge-top-actions"><span class="hud-status" id="knowledge-renderer">-- FPS</span><button class="hud-icon" data-action="reset-view" title="Recentrar">◎</button><button class="hud-icon" data-action="fullscreen" title="Tela cheia">⛶</button><button class="hud-icon" data-action="toggle-photo" title="Modo foto">◫</button></div>
        </header>
        <div class="knowledge-objective objective-chip"><span>COSMOS CURIOSO · C1.1</span><b>Explore, escaneie, compare e conecte ciência com programação.</b></div>
        <aside class="knowledge-search immersive-hud">
          <label><span>⌕</span><input id="knowledge-query" value="${escapeHtml(this.query)}" placeholder="Buscar planeta, missão, linguagem, sensor…" autocomplete="off"></label>
          <div class="knowledge-type-row">${KNOWLEDGE_TYPES.map(entry=>`<button class="${this.type===entry.id?'active':''}" data-action="set-type" data-type="${entry.id}">${entry.label}</button>`).join('')}</div>
          <select id="knowledge-category" aria-label="Filtrar por categoria"><option value="all">Todas as categorias</option>${this.engine.categories().map(category=>`<option value="${escapeHtml(category)}" ${this.category===category?'selected':''}>${escapeHtml(category)}</option>`).join('')}</select>
          <div class="knowledge-filter-actions"><button class="${this.onlyFavorites?'active':''}" data-action="toggle-favorites">★ Favoritos</button><button class="${this.onlyUndiscovered?'active':''}" data-action="toggle-undiscovered">? Não vistos</button><button data-action="random-item">Aleatório</button></div>
        </aside>
        <aside class="knowledge-progress immersive-hud"><div><span>DESCOBERTAS</span><b>${state.discovered.length}/${SPACE_KNOWLEDGE.length}</b></div><div><span>FAVORITOS</span><b>${state.favorites.length}</b></div><div><span>COMPARAR</span><b>${state.comparison.length}/3</b></div></aside>
        <div class="knowledge-crosshair" aria-hidden="true"><i></i><i></i></div>
        <div class="knowledge-action-stack immersive-hud">
          <button data-action="discover-item">SCAN</button><button class="${state.favorites.includes(item.id)?'active':''}" data-action="favorite-item">★</button><button class="${state.comparison.includes(item.id)?'active':''}" data-action="compare-item">⇄</button><button data-action="open-detail">INFO</button><button data-action="open-related-module">3D</button>
        </div>
        <nav class="knowledge-card-rail immersive-hud" id="knowledge-card-rail">${this.cardsMarkup()}</nav>
        <aside class="knowledge-detail-drawer immersive-hud ${this.detailOpen?'open':''}" id="knowledge-detail-drawer" aria-hidden="${!this.detailOpen}">${this.detailMarkup()}</aside>
        <section class="knowledge-compare-overlay immersive-hud ${this.compareOpen?'open':''}" aria-hidden="${!this.compareOpen}">${this.comparisonMarkup()}</section>
        <div class="knowledge-scan-flash" id="knowledge-scan-flash" aria-hidden="true"></div>
      </div>
    </section>`;
  }
  startRenderer(){const canvas=this.container.querySelector('#knowledge-canvas');this.renderer=new KnowledgeOrbRenderer(canvas,this.context.settingsStore,{onTelemetry:data=>this.updateTelemetry(data),onContextState:state=>{if(String(state).startsWith('fallback:'))this.context.toast('Visual simplificado ativado; todo o conteúdo continua disponível.');}});this.renderer.setTarget(this.selected());this.renderer.start();}
  refresh({restartRenderer=false}={}){const oldRenderer=this.renderer;if(restartRenderer)oldRenderer?.destroy();this.render();if(restartRenderer)this.startRenderer();else{this.renderer=oldRenderer;this.renderer.canvas=this.container.querySelector('#knowledge-canvas');this.renderer.destroy();this.startRenderer();}}
  filterResults(){this.results=this.engine.search(this.query,{type:this.type,category:this.category,favorites:this.profileState.snapshot().favorites,discovered:this.profileState.snapshot().discovered,onlyFavorites:this.onlyFavorites,onlyUndiscovered:this.onlyUndiscovered});}
  cardsMarkup(){this.filterResults();if(!this.results.length)return '<div class="knowledge-empty"><b>Nenhum item encontrado</b><span>Tente outro termo ou remova os filtros.</span></div>';return this.results.map(item=>`<button class="knowledge-card ${item.id===this.selectedId?'active':''}" data-action="select-item" data-id="${item.id}" style="--knowledge-a:${item.visual.colors[0]};--knowledge-b:${item.visual.colors[1]}"><i>${escapeHtml(item.symbol)}</i><span><b>${escapeHtml(item.name)}</b><small>${escapeHtml(item.category)}</small></span>${this.profileState.isFavorite(item.id)?'<em>★</em>':''}</button>`).join('');}
  detailMarkup(){const item=this.selected(),sources=this.engine.sourcesFor(item.id),related=this.engine.related(item.id),state=this.profileState.snapshot();return `<button class="drawer-close" data-action="close-detail">×</button>
    <div class="knowledge-detail-head"><i style="--knowledge-a:${item.visual.colors[0]}">${escapeHtml(item.symbol)}</i><div><span class="eyebrow">${escapeHtml(typeLabel(item.type))}</span><h2>${escapeHtml(item.name)}</h2><p>${escapeHtml(item.summary)}</p></div></div>
    <div class="knowledge-detail-tabs"><button class="${this.detailTab==='quick'?'active':''}" data-action="detail-tab" data-tab="quick">Rápido</button><button class="${this.detailTab==='expanded'?'active':''}" data-action="detail-tab" data-tab="expanded">Descobrir</button><button class="${this.detailTab==='technical'?'active':''}" data-action="detail-tab" data-tab="technical">DS/Técnico</button></div>
    <div class="knowledge-detail-body">${this.detailTab==='quick'?this.quickMarkup(item):this.detailTab==='expanded'?this.expandedMarkup(item,sources,related):this.technicalMarkup(item)}</div>
    <div class="knowledge-detail-footer"><button class="button small ${state.favorites.includes(item.id)?'primary':'secondary'}" data-action="favorite-item">${state.favorites.includes(item.id)?'★ Favorito':'☆ Favoritar'}</button><button class="button small secondary" data-action="compare-item">Comparar</button><button class="button small primary" data-action="open-related-module">Abrir laboratório 3D</button></div>`;}
  quickMarkup(item){return `<article class="knowledge-highlight"><span>VOCÊ SABIA?</span><b>${escapeHtml(item.quickFact)}</b></article><div class="knowledge-metrics">${Object.entries(item.metrics||{}).slice(0,8).map(([key,value])=>`<div><span>${escapeHtml(key.toUpperCase())}</span><b>${escapeHtml(value)}</b></div>`).join('')}</div><p class="knowledge-approx">Valores físicos são aproximados e apresentados para comparação didática.</p>`;}
  expandedMarkup(item,sources,related){return `<h3>Fatos essenciais</h3><div class="knowledge-fact-list">${item.facts.map(fact=>`<article><i>✓</i><span>${escapeHtml(fact)}</span></article>`).join('')}</div><h3>Curiosidades</h3><div class="knowledge-fact-list curiosity">${item.curiosities.map(fact=>`<article><i>✦</i><span>${escapeHtml(fact)}</span></article>`).join('')}</div><h3>Conexões</h3><div class="knowledge-related">${related.map(entry=>`<button data-action="select-item" data-id="${entry.id}"><i>${escapeHtml(entry.symbol)}</i><span>${escapeHtml(entry.name)}</span></button>`).join('')}</div><h3>Fontes oficiais</h3><div class="knowledge-sources">${sources.map(source=>`<button data-action="open-source" data-source="${source.id}"><b>${escapeHtml(source.organization)}</b><span>${escapeHtml(source.label)}</span></button>`).join('')}</div>`;}
  technicalMarkup(item){const t=item.technical;return `<article class="knowledge-architecture"><span>ARQUITETURA DIGITAL</span><h3>${escapeHtml(t.headline)}</h3>${t.systems.map((system,index)=>`<div style="--depth:${index}"><i>${String(index+1).padStart(2,'0')}</i><b>${escapeHtml(system)}</b></div>`).join('')}</article><h3>Linguagens relacionadas</h3><div class="knowledge-language-tags">${t.languages.map(language=>`<span>${escapeHtml(language)}</span>`).join('')}</div><article class="knowledge-challenge"><span>DESAFIO DS</span><b>${escapeHtml(t.challenge)}</b></article>`;}
  comparisonMarkup(){const state=this.profileState.snapshot(),data=this.engine.compare(state.comparison);return `<header><div><span class="eyebrow">COMPARADOR ESPACIAL</span><h2>Compare até três descobertas</h2></div><button class="hud-icon" data-action="close-comparison">×</button></header>${data.items.length?`<div class="knowledge-compare-items">${data.items.map(item=>`<article style="--knowledge-a:${item.visual.colors[0]}"><i>${escapeHtml(item.symbol)}</i><b>${escapeHtml(item.name)}</b><button data-action="compare-item" data-id="${item.id}">remover</button></article>`).join('')}</div><div class="knowledge-compare-table">${data.metrics.slice(0,10).map(metric=>`<div><b>${escapeHtml(metric.key)}</b>${metric.values.map(value=>`<span>${escapeHtml(value)}</span>`).join('')}</div>`).join('')}</div><footer><button class="button secondary" data-action="clear-comparison">Limpar</button><button class="button primary" data-action="award-comparison" ${data.items.length<2?'disabled':''}>Registrar comparação</button></footer>`:'<div class="knowledge-empty"><b>Selecione itens com o botão ⇄</b><span>Planetas, missões e tecnologias podem ser comparados lado a lado.</span></div>'}`;}
  selectItem(id){const item=this.engine.get(id);if(!item)return;this.selectedId=id;this.profileState.setLastViewed(id);this.detailOpen=false;this.detailTab='quick';this.renderer?.setTarget(item);this.updateSelectedUi();}
  updateSelectedUi(){const item=this.selected(),state=this.profileState.snapshot();const name=this.container.querySelector('#knowledge-target-name'),symbol=this.container.querySelector('#knowledge-target-symbol'),meta=this.container.querySelector('#knowledge-target-meta');if(name)name.textContent=item.name;if(symbol){symbol.textContent=item.symbol;symbol.style.setProperty('--knowledge-a',item.visual.colors[0]);}if(meta)meta.textContent=`${typeLabel(item.type)} · ${item.category}`;const rail=this.container.querySelector('#knowledge-card-rail');if(rail)rail.innerHTML=this.cardsMarkup();this.container.querySelectorAll('.knowledge-action-stack button')[1]?.classList.toggle('active',state.favorites.includes(item.id));this.container.querySelectorAll('.knowledge-action-stack button')[2]?.classList.toggle('active',state.comparison.includes(item.id));}
  discover(){const item=this.selected(),fresh=this.profileState.discover(item.id);const flash=this.container.querySelector('#knowledge-scan-flash');flash?.classList.remove('active');requestAnimationFrame(()=>flash?.classList.add('active'));if(fresh){const awarded=this.context.profileStore.addXp(35,`knowledge-discovery-${item.id}`);if(awarded)this.context.toast(`Descoberta registrada: ${item.name} · +35 XP.`);}else this.context.toast(`${item.name} já faz parte da sua coleção.`);this.checkCertification();this.renderAndRestart();}
  checkCertification(){const state=this.profileState.snapshot(),types=new Set(state.discovered.map(id=>this.engine.get(id)?.type).filter(Boolean));if(state.discovered.length>=8&&types.size>=4){const awarded=this.context.profileStore.addXp(350,'knowledge-c1-certification');if(awarded)this.context.toast('Certificação Explorador do Conhecimento: +350 XP.');}}
  renderAndRestart(){this.renderer?.destroy();this.render();this.startRenderer();}
  handleClick(event){const target=event.target.closest('[data-action]');if(!target)return;const action=target.dataset.action;
    if(action==='back')return this.context.onBack();
    if(action==='select-item')return this.selectItem(target.dataset.id);
    if(action==='set-type'){this.type=target.dataset.type;this.renderAndRestart();return;}
    if(action==='toggle-favorites'){this.onlyFavorites=!this.onlyFavorites;this.renderAndRestart();return;}
    if(action==='toggle-undiscovered'){this.onlyUndiscovered=!this.onlyUndiscovered;this.renderAndRestart();return;}
    if(action==='random-item'){const item=this.engine.random(this.profileState.snapshot().discovered);this.selectItem(item.id);return;}
    if(action==='discover-item')return this.discover();
    if(action==='favorite-item'){this.profileState.toggleFavorite(target.dataset.id||this.selectedId);this.context.toast(this.profileState.isFavorite(target.dataset.id||this.selectedId)?'Adicionado aos favoritos.':'Removido dos favoritos.');this.renderAndRestart();return;}
    if(action==='compare-item'){this.profileState.toggleComparison(target.dataset.id||this.selectedId);this.compareOpen=true;this.renderAndRestart();return;}
    if(action==='open-detail'){this.detailOpen=true;this.updateDetail();return;}
    if(action==='close-detail'){this.detailOpen=false;this.updateDetail();return;}
    if(action==='detail-tab'){this.detailTab=target.dataset.tab;this.updateDetail();return;}
    if(action==='open-comparison'){this.compareOpen=true;this.renderAndRestart();return;}
    if(action==='close-comparison'){this.compareOpen=false;this.renderAndRestart();return;}
    if(action==='clear-comparison'){this.profileState.clearComparison();this.renderAndRestart();return;}
    if(action==='award-comparison'){const count=this.profileState.snapshot().comparison.length;if(count>=2){const key=`knowledge-comparison-${[...this.profileState.snapshot().comparison].sort().join('-')}`;const awarded=this.context.profileStore.addXp(120,key);this.context.toast(awarded?'Comparação registrada: +120 XP.':'Esta comparação já foi registrada.');}return;}
    if(action==='open-related-module'){const module=this.selected().technical?.module;if(module)this.context.openModule(module);return;}
    if(action==='open-source'){const source=KNOWLEDGE_SOURCES[target.dataset.source];if(source)window.open(source.url,'_blank','noopener,noreferrer');return;}
    if(action==='reset-view')return this.renderer?.reset();
    if(action==='fullscreen')return this.renderer?.requestFullscreen();
    if(action==='toggle-photo'){this.photoMode=!this.photoMode;this.container.querySelector('#knowledge-stage')?.classList.toggle('photo-mode',this.photoMode);return;}
  }
  handleInput(event){if(event.target.id==='knowledge-query')this.query=event.target.value;else if(event.target.id==='knowledge-category')this.category=event.target.value;else return;this.filterResults();const rail=this.container.querySelector('#knowledge-card-rail');if(rail)rail.innerHTML=this.cardsMarkup();}
  handleKeyDown(event){if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;const key=event.key.toLowerCase();if(key==='i'){this.detailOpen=!this.detailOpen;this.updateDetail();}if(key==='s')this.discover();if(key==='r')this.renderer?.reset();if(key==='p'){this.photoMode=!this.photoMode;this.container.querySelector('#knowledge-stage')?.classList.toggle('photo-mode',this.photoMode);}if(key==='c'){this.compareOpen=!this.compareOpen;this.renderAndRestart();}}
  updateDetail(){const drawer=this.container.querySelector('#knowledge-detail-drawer');if(!drawer)return;drawer.classList.toggle('open',this.detailOpen);drawer.setAttribute('aria-hidden',String(!this.detailOpen));drawer.innerHTML=this.detailMarkup();}
  updateTelemetry(data){const el=this.container.querySelector('#knowledge-renderer');if(el)el.textContent=`${data.fps||'--'} FPS · ${data.renderer}`;}
}

export function createModule(){return new CuriosityCenterModule();}
