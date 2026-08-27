import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('atividades/index.html');
const css=read('atividades/assets/css/app.css');
const adminCss=read('atividades/assets/css/admin.css');
const professorCss=read('professor/assets/professor.css');
const standaloneAdminCss=read('admin/assets/admin.css');
const master=read('PADRAO_MESTRE_FRONTEND_PROFISSIONAL_ANTI_AI_SLOP.md');

test('P10.9.12 embeds the master UX standard and preserves functional priority',()=>{
  assert.match(master,/1\. Função[\s\S]*2\. Fluxo[\s\S]*3\. Clareza/);
  assert.match(master,/Não existe card soup/);
  assert.match(master,/Mobile não é apenas desktop empilhado/);
});

test('P10.9.12 removes decorative AI-slop elements from the student primary flow',()=>{
  assert.doesNotMatch(html,/next-action-orb|weekend-mode-orbit|weekend-reward-icon/);
  assert.doesNotMatch(css,/radial-gradient|weekendShimmer|weekendFloat|weekendRewardPulse/);
  const gradients=(css.match(/linear-gradient/g)||[]).length;
  assert.ok(gradients<=2,`only the existing subtle body grid may use linear-gradient; found ${gradients}`);
});

test('P10.9.12 keeps weekend reward specific, compact and functional',()=>{
  for(const id of ['weekend-mode-toggle','weekend-voucher-open','weekend-reward-close','weekend-reward-code','weekend-reward-copy','weekend-reward-confirm']){
    assert.match(html,new RegExp(`id="${id}"`));
  }
  assert.match(html,/<ul class="weekend-reward-benefits">/);
  assert.match(css,/\.weekend-reward-card\{[^}]*text-align:left/);
  assert.match(css,/\.weekend-mode-banner\{[\s\S]*border-left:3px solid var\(--bonus\)/);
});

test('P10.9.12 reduces universal decoration while preserving meaningful surfaces',()=>{
  assert.match(css,/\.panel\{[\s\S]*box-shadow:none/);
  assert.doesNotMatch(css,/\.platform-card:hover\{[^}]*transform:/);
  assert.doesNotMatch(adminCss,/staff-metric\.attention[\s\S]{0,180}linear-gradient/);
  assert.match(css,/\.status-chip\{/); // status chip remains semantically justified
  assert.match(css,/\.weekend-reward-close\{[^}]*border-radius:50%/); // iconographic close remains circular
});



test('P10.9.12 applies the same restraint to professor and standalone admin surfaces',()=>{
  assert.doesNotMatch(professorCss,/radial-gradient/);
  assert.match(professorCss,/login-card[^}]*box-shadow:none/);
  assert.doesNotMatch(professorCss,/presence-dot[^}]*box-shadow:(?!none)/);
  assert.doesNotMatch(standaloneAdminCss,/radial-gradient/);
  assert.doesNotMatch(standaloneAdminCss,/monitor-hero[^}]*linear-gradient/);
  assert.doesNotMatch(standaloneAdminCss,/security-critical[^}]*linear-gradient|security-pulse[^}]*animation:/);
  assert.match(standaloneAdminCss,/\.dialog\{[^}]*box-shadow:/); // overlay elevation remains justified
});

test('P10.9.12 keeps primary student actions and responsive fixes intact',()=>{
  for(const id of ['resume-btn','view-all-activities-btn','exercise-submit-button','weekend-mode-countdown']){
    assert.match(html,new RegExp(`id="${id}"`));
  }
  assert.match(css,/@media\(max-width:900px\)/);
  assert.match(css,/min-height:44px/);
  assert.match(css,/--radius-lg:14px/);
});
