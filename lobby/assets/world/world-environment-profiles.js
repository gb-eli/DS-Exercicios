const freeze=value=>Object.freeze(value);
export const WORLD_ENVIRONMENT_PROFILE_VERSION=1;
export const WORLD_ENVIRONMENT_PROFILES=freeze({
  'campus-ds':freeze({identity:'campus-tech',streaming:freeze({loadRadius:30,unloadRadius:46,maxLoaded:5}),lighting:freeze({ambient:1.0,local:1.0}),palette:freeze(['#36d2ff','#61e7a6','#b58cff','#ffae63'])}),
  'vale-silicio':freeze({identity:'innovation-district',streaming:freeze({loadRadius:70,unloadRadius:105,maxLoaded:5}),lighting:freeze({ambient:1.08,local:1.12}),palette:freeze(['#62e6ff','#61e7a6','#ffbd66'])}),
  'rural-agv':freeze({identity:'rural-living',streaming:freeze({loadRadius:58,unloadRadius:88,maxLoaded:5}),lighting:freeze({ambient:1.16,local:.82}),palette:freeze(['#86d46a','#e8c67a','#6fbbe8'])}),
  'military-agv':freeze({identity:'operations-base',streaming:freeze({loadRadius:58,unloadRadius:88,maxLoaded:5}),lighting:freeze({ambient:.94,local:1.1}),palette:freeze(['#b7c598','#d6b36a','#7da1b6'])}),
  'space-agv':freeze({identity:'orbital-research',streaming:freeze({loadRadius:52,unloadRadius:80,maxLoaded:4}),lighting:freeze({ambient:.72,local:1.32}),palette:freeze(['#7adfff','#9f9cff','#e6f4ff'])}),
  'moon-agv':freeze({identity:'lunar-expedition',streaming:freeze({loadRadius:62,unloadRadius:96,maxLoaded:4}),lighting:freeze({ambient:.78,local:1.08}),palette:freeze(['#c8d3dd','#8da9be','#76d9ff'])}),
  'mars-agv':freeze({identity:'mars-expedition',streaming:freeze({loadRadius:68,unloadRadius:102,maxLoaded:4}),lighting:freeze({ambient:1.0,local:1.02}),palette:freeze(['#d47d5b','#f0b76f','#79d8e8'])}),
  'parque-diversoes-agv':freeze({identity:'theme-park',streaming:freeze({loadRadius:58,unloadRadius:90,maxLoaded:6}),lighting:freeze({ambient:1.08,local:1.24}),palette:freeze(['#ff7fd5','#72e6ff','#ffd166'])}),
  'colegio-agv':freeze({identity:'school-campus',streaming:freeze({loadRadius:42,unloadRadius:66,maxLoaded:5}),lighting:freeze({ambient:1.12,local:1.0}),palette:freeze(['#3aa5ff','#64d98b','#ffd166'])}),
  'labirinto-armadilhas':freeze({identity:'challenge-maze',streaming:freeze({loadRadius:34,unloadRadius:52,maxLoaded:4}),lighting:freeze({ambient:.9,local:1.18}),palette:freeze(['#ff9c62','#75d8ff','#d18cff'])}),
  'museu-hardware-agv':freeze({identity:'hardware-museum',streaming:freeze({loadRadius:36,unloadRadius:54,maxLoaded:4}),lighting:freeze({ambient:1.02,local:1.2}),palette:freeze(['#72e6ff','#b58cff','#ffbd66'])})
});
export function worldEnvironmentProfile(worldId){return WORLD_ENVIRONMENT_PROFILES[String(worldId||'')]||WORLD_ENVIRONMENT_PROFILES['campus-ds'];}
export function interiorLightBudget(quality='medium'){
  return freeze({low:freeze({points:1,intensity:3.2}),medium:freeze({points:2,intensity:4.4}),high:freeze({points:3,intensity:5.4}),ultra:freeze({points:4,intensity:6.4})}[quality]||{points:2,intensity:4.4});
}
