import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath,pathToFileURL } from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const weatherPath=path.join(root,'lobby/assets/world/weather-system.js');
const weather=await import(pathToFileURL(weatherPath).href+`?t=${Date.now()}`);
const checks=[];const check=(name,ok)=>checks.push({name,ok:!!ok});
const html=read('lobby/index.html'),app=read('lobby/assets/lobby.js'),adapter=read('lobby/assets/core/world-adapter.js'),campus3d=read('lobby/assets/lobby3d.js'),vale3d=read('lobby/assets/vale3d.js'),campus2d=read('lobby/assets/lobby-lite.js'),vale2d=read('lobby/assets/vale-lite.js'),edge=read('core/edge-functions/lobby-presence/index.ts'),sw=read('lobby/sw.js'),boot=read('lobby/assets/boot.js');

check('tipos oficiais de clima são quatro',JSON.stringify(weather.WORLD_WEATHER_TYPES)===JSON.stringify(['clear','rain','snow','storm']));
check('clima inválido cai para Limpo',weather.normalizeWeatherType('tornado')==='clear'&&weather.resolveWorldWeather({active:true,type:'x',intensity:'normal'}).id==='clear');
check('intensidade inválida cai para Normal',weather.normalizeWeatherIntensity('absurda')==='normal');
check('Limpo não cria precipitação',weather.weatherParticleBudget('ultra','clear')===0&&weather.resolveWorldWeather(null).id==='clear');
const low=weather.weatherParticleBudget('low','rain'),medium=weather.weatherParticleBudget('medium','rain'),high=weather.weatherParticleBudget('high','rain'),ultra=weather.weatherParticleBudget('ultra','rain');
check('orçamento cresce Low < Medium < High < Ultra',low<medium&&medium<high&&high<ultra);
check('reduced-motion e saveData reduzem orçamento',weather.weatherParticleBudget('high','rain',{reducedMotion:true})<high&&weather.weatherParticleBudget('high','rain',{saveData:true})<high);
check('neve usa orçamento menor que tempestade',weather.weatherParticleBudget('high','snow')<weather.weatherParticleBudget('high','storm'));
check('relâmpago só ocorre em tempestade',weather.stormFlashAt(0,'rain')===0&&weather.stormFlashAt(0,'snow')===0&&weather.stormFlashAt(0,'clear')===0&&weather.stormFlashAt(7.35,{active:true,type:'storm',intensity:'normal'})>0);
check('reduced-motion desliga relâmpago',weather.stormFlashAt(0,{active:true,type:'storm',intensity:'normal'},{reducedMotion:true})===0);
check('HUD e painel da equipe expõem clima e intensidade',html.includes('id="world-weather"')&&html.includes('id="staff-world-weather-control"')&&html.includes('value="rain"')&&html.includes('value="snow"')&&html.includes('value="storm"')&&html.includes('id="staff-world-weather-intensity"'));
check('frontend valida token antes de aplicar clima',app.includes("action:'verify_world_weather',token")&&app.includes('applySessionWorldWeatherControl(data.control)')&&app.includes("action:'issue_world_weather',type,intensity"));
check('comando de clima é restrito à equipe e assinado',edge.includes("kind:'world_weather_control'")&&edge.includes("if(action==='issue_world_weather')")&&edge.includes('if(!STAFF.has(String(p.role)))')&&edge.includes('signWorldWeather')&&edge.includes('verifyWorldWeather'));
check('Edge Function aceita apenas quatro climas e três intensidades',edge.includes("['clear','rain','snow','storm']")&&edge.includes("['light','normal','strong']"));
check('Campus 3D usa sistema compartilhado e orçamento por qualidade',campus3d.includes('createWorldWeatherEffects')&&campus3d.includes('weatherEffects?.setQuality?.(quality)')&&campus3d.includes('resolveWorldWeather(state.worldWeatherControl)'));
check('Vale 3D usa o mesmo sistema compartilhado',vale3d.includes('createWorldWeatherEffects')&&vale3d.includes('weatherEffects?.setQuality?.(quality)')&&vale3d.includes('resolveWorldWeather(state.worldWeatherControl)'));
check('precipitação é ocultada em interiores 3D',campus3d.includes('weatherEffects?.points)weatherEffects.points.visible=false')&&vale3d.includes('weatherEffects?.points)weatherEffects.points.visible=false'));
check('Campus e Vale 2D desenham clima compartilhado',campus2d.includes('drawWorldWeather2D')&&campus2d.includes('resolveWorldWeather(state.worldWeatherControl)')&&vale2d.includes('drawWorldWeather2D')&&vale2d.includes('resolveWorldWeather(state.worldWeatherControl)'));
check('2D não desenha precipitação em interiores',campus2d.includes('if(!activeToolInterior)drawWorldWeather2D')&&vale2d.includes('else{drawWorld(w,h,time);drawPlayer(w,h);drawWorldWeather2D'));
check('boot valida módulo de clima antes de iniciar',boot.includes("'world/weather-system.js':['WORLD_WEATHER_TYPES','resolveWorldWeather','createWorldWeatherEffects']")&&boot.includes("'world/weather-system.js','render/camera-controller.js'"));
check('cache da fase 32 ou posterior protege runtimes e weather-system',/runtime-\$\{VERSION\}-stage(?:3[2-9]|[4-9]\d|\d{3,})/.test(sw)&&/vendor-loader\.js\?v=14\.10\.8\.65-stage(?:3[2-9]|[4-9]\d|\d{3,})/.test(html)&&/lobby3d\.js\?v=14\.10\.8\.65-stage(?:3[2-9]|[4-9]\d|\d{3,})/.test(adapter)&&/weather-system\.js\?v=14\.10\.8\.65-stage(?:3[2-9]|[4-9]\d|\d{3,})/.test(sw));

let failed=0;for(const item of checks){console.log(`${item.ok?'PASS':'FAIL'}  ${item.name}`);if(!item.ok)failed++;}
console.log(`\n${checks.length-failed}/${checks.length} PASS`);if(failed)process.exit(1);
