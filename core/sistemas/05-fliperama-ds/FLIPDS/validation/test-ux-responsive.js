#!/usr/bin/env node
'use strict';
const fs=require('node:fs'); const path=require('node:path');
const root=path.resolve(__dirname,'..');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'app.css'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const version=JSON.parse(fs.readFileSync(path.join(root,'version.json'),'utf8'));
const results=[];
function test(name,ok,detail=''){results.push({name,status:ok?'pass':'fail',detail}); if(!ok) process.exitCode=1;}

test('Versão pública v0.39.0 sincronizada', String(version.version).startsWith('0.39.0') && (app.includes("version: '0.39.0'") || app.includes("version: '0.39.0-hotfix1'")) && (sw.includes("VERSION = '0.39.0'") || sw.includes("VERSION = '0.39.0-hotfix1'")) && index.includes('v0.39.0'));
test('Abertura usa semântica de diálogo', app.includes('id="intro-overlay" class="intro-overlay" hidden role="dialog" aria-modal="true"'));
test('Abertura possui botão fechar independente', app.includes('id="intro-close"') && app.includes("query('#intro-close').addEventListener('click', closeIntro)"));
test('Abertura aceita fechamento por Esc', app.includes("if (!introOverlay.hidden)") && app.includes('closeIntro();'));
test('Abertura possui foco programático seguro', app.includes("query('.intro-shell').focus({ preventScroll: true })") && app.includes('tabindex="-1"'));
test('SessionStorage não pode bloquear abertura', app.includes('function safeSessionGet') && app.includes('function safeSessionSet') && app.includes('catch { /* modo privado'));
test('Overlay inicial possui rolagem vertical', /\.intro-overlay\s*\{[\s\S]*?overflow-y:\s*auto/.test(css));
test('Shell inicial respeita 100dvh', /\.intro-shell\s*\{[\s\S]*?max-height:\s*calc\(100dvh/.test(css));
test('Ações da abertura permanecem acessíveis', /\.intro-actions\s*\{[\s\S]*?position:\s*sticky[\s\S]*?bottom:\s*-1px/.test(css));
test('Safe-area aplicada à abertura', css.includes('env(safe-area-inset-top)') && css.includes('env(safe-area-inset-bottom)'));
test('Onboarding do jogo possui rolagem própria', /\.game-overlay\s*\{[\s\S]*?overflow-y:\s*auto/.test(css));
test('Onboarding evita centralização que corta conteúdo', /\.game-overlay\s*\{[\s\S]*?place-content:\s*start center/.test(css));
test('Botões de onboarding mantêm altura tocável', /\.game-overlay \.button\s*\{[^}]*min-height:\s*46px/.test(css));
test('Select de onboarding mantém altura tocável', /\.game-overlay select\s*\{[^}]*min-height:\s*44px/.test(css));
test('Diálogo de jogo limitado à viewport', css.includes('.game-dialog,\n.details-dialog') && css.includes('max-height: min(94dvh, 940px)'));
test('Game shell possui altura dinâmica', css.includes('.game-shell { height: min(94dvh, 920px); }'));
test('Controles touch respeitam laterais seguras', css.includes('env(safe-area-inset-left)') && css.includes('env(safe-area-inset-right)'));
test('Layout específico para telas até 420px', css.includes('@media (max-width: 420px)'));
test('Layout específico para landscape baixo', css.includes('@media (max-height: 520px) and (orientation: landscape)'));
test('Layout compacto para altura até 760px', css.includes('@media (max-height: 760px)'));
test('Ações do modal de detalhes empilham no celular', /@media \(max-width: 760px\)[\s\S]*?\.details-actions \{ flex-direction: column; \}/.test(css));
test('Body bloqueia apenas rolagem horizontal global', css.includes('body { min-width: 0; overflow-x: clip; }'));
test('Hotfix não removeu os 25 runtimes do catálogo', ((app.match(/jogavel/g)||[]).length >= 25), `${(app.match(/jogavel/g)||[]).length-1} ocorrências de status jogável estimadas`);
test('Hotfix UX/UI anterior preservado sem remoção', css.includes('v0.34.2 · Hotfix UX/UI') && css.includes('viewports compactas'));
test('Service Worker usa cache da nova revisão', (sw.includes("const VERSION = '0.39.0';") || sw.includes("const VERSION = '0.39.0-hotfix1';")));

const summary={product:'Fliperama DS',version:'0.38.4',phase:version.phase,generatedAt:new Date().toISOString(),summary:{total:results.length,passed:results.filter(r=>r.status==='pass').length,failed:results.filter(r=>r.status==='fail').length},results};
fs.writeFileSync(path.join(__dirname,'ux-responsive-test-results.json'),JSON.stringify(summary,null,2));
for(const r of results) console.log(`${r.status==='pass'?'PASS':'FAIL'}: ${r.name}${r.detail?' — '+r.detail:''}`);
console.log(`\n${summary.summary.passed}/${summary.summary.total} verificações aprovadas.`);
