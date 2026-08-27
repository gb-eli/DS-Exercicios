#!/usr/bin/env python3
import argparse, json, os
from pathlib import Path
from playwright.sync_api import sync_playwright

VIEWPORTS=[('phone360',360,800),('phone390',390,844),('phone430',430,932),('tablet768',768,1024),('tablet820',820,1180),('desktop1024',1024,768),('desktop1366',1366,900)]

HTML_BODY='''
<div id="app" class="app-shell">
<header class="topbar">
  <div class="brand-lockup"><span class="brand-symbol">DS</span><div class="brand-copy"><p class="eyebrow">Desenvolvimento de Sistemas</p><h1>Exercícios Práticos DS</h1></div></div>
  <span class="platform-version">0.22</span>
  <div class="session-actions"><div class="identity-mini"><strong>Aluno Teste</strong><span>2DS</span></div><button class="button button-ghost">Hub</button><button class="button button-ghost">Lobby</button><button class="button button-ghost">Sair</button></div>
</header>
<main class="main-content">
<section class="exercise-view reference-active" id="exercise-view">
 <div class="exercise-toolbar panel"><button class="button button-ghost">← Disciplinas</button><div><p class="eyebrow">Programação Front-End</p><h2>Exercício responsivo longo</h2></div><div class="exercise-status-group"><span class="status-chip">Disponível</span></div></div>
 <section class="weekend-mode-banner"><div class="weekend-mode-copy"><span class="weekend-mode-kicker">Benefício de fim de semana</span><strong>Modo Final de Semana ativo</strong><span>Ajuda extra disponível até domingo às 18:00.</span></div><div class="weekend-mode-actions"><span class="weekend-mode-countdown">22:14:59</span><button class="button button-small weekend-voucher-open">Ver código +1 ponto</button><button class="button button-small weekend-mode-toggle">Desativar ajuda extra</button></div></section>
 <div class="exercise-layout">
  <aside class="panel exercise-sidebar"><div class="sidebar-section"><p class="eyebrow">Orientação</p><div class="exercise-guidance"><strong>Passo a passo</strong><p>Revise o código e corrija a linha destacada.</p></div></div><div class="sidebar-section"><button class="button button-small">Auto corrigir</button></div></aside>
  <section class="panel workspace-panel">
   <div class="workspace-toolbar"><div><strong>script-com-nome-bastante-comprido.js</strong><span class="muted">JavaScript</span></div><div class="workspace-actions workspace-primary-actions"><button class="button button-small">Orientações</button><button class="button button-small">Preview</button><button class="button button-small">Executar</button><button class="button button-primary button-small">Entregar</button></div></div>
   <div class="workspace-subbar"><div class="file-tabs horizontal quick-file-tabs"><button class="file-tab active">index.html</button><button class="file-tab">estilo-responsivo-com-nome-grande.css</button><button class="file-tab">script-com-nome-bastante-comprido.js</button></div><span class="workspace-save-pill">Salvo</span></div>
   <div class="workspace-utilitybar"><button class="button button-small">Salvar</button><button class="button button-small">Símbolos</button><button class="button button-small">Baixar meu arquivo</button><button class="button button-small">Baixar meus códigos</button><button class="button button-small">GitHub</button><button class="button button-small">Classroom</button><div class="code-font-controls"><button class="button button-small">−</button><span class="code-font-size-label">16 px</span><button class="button button-small">+</button></div><span class="workspace-action-status">Código preservado</span></div>
   <div class="editor-shell"><div class="editor-line-numbers"><span>1</span><span>2</span><span>3</span></div><pre class="code-highlight"></pre><textarea class="code-editor">const elementoComNomeMuitoLongo = document.getElementById('resultado-da-atividade-com-identificador-extremamente-longo');\nelementoComNomeMuitoLongo.textContent = 'Teste de responsividade';</textarea></div>
  </section>
  <section class="panel output-panel"><div class="output-tabs"><button class="output-tab active">Referência</button><button class="output-tab">Preview</button><button class="output-tab">Terminal</button></div><section class="reference-pane"><div class="reference-head"><div><span class="eyebrow">Referência</span><strong>script.js</strong></div><span class="reference-lock">Somente leitura</span></div><div class="reference-version-control"><label>Versão</label><select><option>Auto • mais próxima do seu código</option></select><small>Compatibilidade</small></div><p class="reference-note">Observe e transcreva.</p><pre class="reference-code">const identificadorExtremamenteLongoSemEspacosParaTestarMinContentNoCelular = document.getElementById('resultado-da-atividade-com-identificador-extremamente-longo');\nidentificadorExtremamenteLongoSemEspacosParaTestarMinContentNoCelular.textContent='Referência extensa';</pre></section></section>
 </div>
</section>
</main></div>
'''

def run(root:Path,out:Path):
    css=(root/'atividades/assets/css/app.css').read_text(encoding='utf-8')
    out.mkdir(parents=True,exist_ok=True)
    results=[]
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox','--disable-dev-shm-usage'])
        for name,w,h in VIEWPORTS:
            page=browser.new_page(viewport={'width':w,'height':h}, device_scale_factor=1, is_mobile=w<=820, has_touch=w<=820)
            page.set_content(f'<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>{css}</style></head><body>{HTML_BODY}</body></html>',wait_until='domcontentloaded')
            page.wait_for_timeout(50)
            metrics=page.evaluate('''() => {
              const q=s=>document.querySelector(s), rect=s=>{const e=q(s); if(!e)return null; const r=e.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)}};
              const util=q('.workspace-utilitybar'), small=[...document.querySelectorAll('.button-small,.file-tab,.output-tab')].map(e=>Math.round(e.getBoundingClientRect().height));
              return {
                viewport:innerWidth, bodyScrollWidth:document.body.scrollWidth, htmlScrollWidth:document.documentElement.scrollWidth,
                exercise:rect('.exercise-view'), layout:rect('.exercise-layout'), workspace:rect('.workspace-panel'), sidebar:rect('.exercise-sidebar'), output:rect('.output-panel'),
                topbar:rect('.topbar'), utility:rect('.workspace-utilitybar'), editor:rect('.editor-shell'), reference:rect('.reference-pane'),
                utilDisplay:getComputedStyle(util).display, utilColumns:getComputedStyle(util).gridTemplateColumns,
                minTouchTarget:small.length?Math.min(...small):0,
                horizontalOverflow:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)>innerWidth+1
              };
            }''')
            metrics['name']=name; metrics['height']=h
            results.append(metrics)
            page.screenshot(path=str(out/f'{name}.png'),full_page=True)
            page.close()
        browser.close()
    (out/'metrics.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    return results

def main():
    ap=argparse.ArgumentParser();ap.add_argument('root');ap.add_argument('out');args=ap.parse_args()
    results=run(Path(args.root),Path(args.out))
    print(json.dumps(results,ensure_ascii=False,indent=2))
if __name__=='__main__':main()
