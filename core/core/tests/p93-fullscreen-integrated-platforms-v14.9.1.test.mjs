import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const catalog=JSON.parse(read('core/catalog/platform-integration-v14.0.json'));
const bridge=read('core/session/fullscreen-platform-bridge.js');
const legacy=read('validacao-antiga/index.html');
const release=JSON.parse(read('release-current.json'));
const cacheVersion=(release.runtimeCacheVersion||release.version).replace(/\./g,'\\.');

test('P9.1 all integrated platform routes inherit global student fullscreen',()=>{
  assert.equal(catalog.platforms.length,10);
  for(const item of catalog.platforms){
    const html=read(item.route);
    assert.match(html,new RegExp(`fullscreen-portal\\.css\\?v=${cacheVersion}`));
    assert.match(html,new RegExp(`fullscreen-portal\\.js\\?v=${cacheVersion}`));
    assert.match(html,new RegExp(`agv-session\\.js\\?v=${cacheVersion}`));
    assert.match(html,new RegExp(`fullscreen-platform-bridge\\.js\\?v=${cacheVersion}`));
  }
});

test('P9.1 shared bridge scopes fullscreen to authenticated students and fails closed on profile lookup',()=>{
  assert.match(bridge,/profile\?\.role\|\|'student'/);
  assert.match(bridge,/===\s*'student'/);
  assert.match(bridge,/requireForUser=true/);
  assert.match(bridge,/fullscreen\.require\(requireForUser\)/);
  assert.doesNotMatch(bridge,/service_role|sb_secret|SUPABASE_SERVICE_ROLE_KEY/);
});

test('P9.1 legacy validation remains the only explicit fullscreen exemption',()=>{
  assert.match(legacy,/data-fullscreen-exempt="true"/);
  for(const item of catalog.platforms){
    assert.doesNotMatch(read(item.route),/data-fullscreen-exempt="true"/);
  }
});

test('P9.1 release metadata is aligned',()=>{
  const [major,minor,patch]=release.version.split('.').map(Number);
  assert.ok(major>14||(major===14&&(minor>9||(minor===9&&patch>=1))));
  if(release.version==='14.9.1'){
    assert.equal(release.requiresDatabaseChange,false);
    assert.equal(release.requiresEdgeFunctionDeploy,false);
  }else{
    assert.equal(typeof release.requiresDatabaseChange,'boolean');
    assert.equal(typeof release.requiresEdgeFunctionDeploy,'boolean');
  }
});
