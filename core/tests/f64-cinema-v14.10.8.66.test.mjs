import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {classifyCinemaSource,normalizeCinemaMedia} from '../../lobby/assets/world/cinema-media.js';
import {CAMPUS_DESTINATION_MAP,CAMPUS_TOOL_BUILDING_COLLIDERS} from '../../lobby/assets/world/campus-destinations.js';
import {CAMPUS_INTERIOR_MAP,CAMPUS_INTERIOR_INTERACTIONS} from '../../lobby/assets/world/campus-interiors.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');

test('F64 reconhece vídeo direto, YouTube e iframe sem aceitar protocolos não HTTP',()=>{
  assert.deepEqual(classifyCinemaSource('https://cdn.example.edu/aula.mp4'),{source_type:'direct',source_url:'https://cdn.example.edu/aula.mp4'});
  const yt=classifyCinemaSource('https://youtu.be/dQw4w9WgXcQ');
  assert.equal(yt.source_type,'youtube');
  assert.match(yt.source_url,/youtube-nocookie\.com\/embed\/dQw4w9WgXcQ/);
  const frame=classifyCinemaSource('<iframe src="https://player.vimeo.com/video/123456"></iframe>');
  assert.equal(frame.source_type,'vimeo');
  assert.deepEqual(classifyCinemaSource('javascript:alert(1)'),{source_type:'invalid',source_url:null});
  assert.equal(normalizeCinemaMedia({enabled:false,source_url:'https://cdn.example.edu/aula.mp4'}).source_type,'none');
});

test('F64 posiciona o Cinema AGV fora do corredor sul e sem sobreposição com outros prédios',()=>{
  const cinema=CAMPUS_DESTINATION_MAP.cinema;
  assert.ok(cinema);
  assert.equal(cinema.architecture,'cinema');
  assert.equal(cinema.x,29);
  assert.equal(cinema.z,31);
  const collider=CAMPUS_TOOL_BUILDING_COLLIDERS.find(item=>item.id==='cinema');
  assert.ok(collider.maxZ<38);
  for(const other of CAMPUS_TOOL_BUILDING_COLLIDERS.filter(item=>item.id!=='cinema')){
    const overlap=!(collider.maxX<other.minX||collider.minX>other.maxX||collider.maxZ<other.minZ||collider.minZ>other.maxZ);
    assert.equal(overlap,false,`cinema colidiu com ${other.id}`);
  }
});

test('F64 cria interior lazy do cinema e interação específica da tela',()=>{
  const cinema=CAMPUS_INTERIOR_MAP.cinema;
  assert.ok(cinema);
  assert.equal(cinema.template,'cinema');
  assert.ok(cinema.floorMaps.some(f=>f.rooms.some(r=>r.kind==='cinema')));
  assert.ok(CAMPUS_INTERIOR_INTERACTIONS.some(ref=>ref.interiorId==='cinema'&&ref.type==='cinema-screen'));
  const three=read('lobby/assets/lobby3d.js');
  assert.match(three,/new THREE\.VideoTexture\(video\)/);
  assert.match(three,/disposeCinemaVideo\(\)/);
  assert.match(three,/if\(id==='cinema'\)applyCinemaScreen\(room\)/);
});

test('F64 oferece player e programação persistente com RLS para equipe',()=>{
  const html=read('lobby/index.html'),lobby=read('lobby/assets/lobby.js'),migration=read('core/database/065_lobby_cinema_media.sql');
  assert.match(html,/id="cinema-modal"/);
  assert.match(html,/media-src 'self' https: blob:/);
  assert.match(html,/frame-src https:\/\/www\.youtube\.com https:\/\/www\.youtube-nocookie\.com https:\/\/player\.vimeo\.com/);
  assert.match(lobby,/from\('lobby_cinema_media'\)/);
  assert.match(lobby,/agv-lobby-cinema-v66/);
  assert.match(migration,/private\.lobby_cinema_staff/);
  assert.match(migration,/for update[\s\S]*to authenticated/);
  assert.match(migration,/grant select, insert, update on public\.lobby_cinema_media to authenticated/);
});

test('F64 inclui o módulo do cinema no preflight e no shell offline',()=>{
  const boot=read('lobby/assets/boot.js'),sw=read('lobby/sw.js'),config=read('lobby/assets/config.js');
  assert.ok(boot.includes('world/cinema-media.js'));
  assert.ok(sw.includes('world/cinema-media.js'));
  const current=config.match(/LOBBY_VERSION='([^']+)'/)?.[1];assert.ok(current);assert.ok(Number(current.split('.').at(-1))>=66);
});
