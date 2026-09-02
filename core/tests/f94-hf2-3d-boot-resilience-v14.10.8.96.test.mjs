import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=file=>fs.readFileSync(path.join(ROOT,file),'utf8');
const lobby=read('lobby/assets/lobby.js');

test('HF2 usa bootstrap gráfico seguro antes do primeiro frame',()=>{
  assert.match(lobby,/targetQuality=.*graphicsCalibrator\.initialQuality/s);
  assert.match(lobby,/bootQuality=targetQuality==='low'\?'low':calibrationDevice\.mobile\?'low':'medium'/);
  assert.match(lobby,/initialQuality:bootQuality/);
  assert.match(lobby,/runtime_3d_boot_plan/);
  assert.match(lobby,/runtime_3d_target_quality_applied/);
});

test('HF2 amplia janelas de inicialização sem remover fallback',()=>{
  assert.match(lobby,/COARSE_POINTER\?24000:20000/);
  assert.match(lobby,/lobby_3d_first_frame_timeout'\)\),8500/);
  assert.match(lobby,/Abrindo o mapa 2D automaticamente/);
  assert.match(lobby,/runtime_lite_recovery_failed/);
});

test('HF2 aplica cache-bust coerente na cadeia pública',()=>{
  for(const file of ['lobby/assets/vendor-loader.js','lobby/assets/sw-register.js','lobby/assets/boot.js','lobby/index.html','lobby/sw.js'])assert.match(read(file),/stage65-f94-auto-calibration-hf2/,file);
});
