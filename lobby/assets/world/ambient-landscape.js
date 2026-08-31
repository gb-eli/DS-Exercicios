const freezeList=list=>Object.freeze(list.map(item=>Object.freeze(item)));

export const CAMPUS_AMBIENT=Object.freeze({
  trees:freezeList([
    {x:-49,z:-15,scale:1.05,shape:'broad',tone:'#2d7d59'},
    {x:-49,z:15,scale:.98,shape:'tall',tone:'#256b4d'},
    {x:49,z:-15,scale:1.08,shape:'broad',tone:'#358a62'},
    {x:49,z:15,scale:1.0,shape:'tall',tone:'#2b7654'},
    {x:-38,z:-31,scale:.94,shape:'compact',tone:'#2f815b'},
    {x:38,z:-31,scale:1.02,shape:'broad',tone:'#347f5c'},
    {x:-38,z:31,scale:1.0,shape:'tall',tone:'#286f50'},
    {x:38,z:31,scale:.96,shape:'compact',tone:'#32845e'},
    {x:-20,z:-31,scale:.9,shape:'compact',tone:'#3a8c66'},
    {x:20,z:-31,scale:.94,shape:'tall',tone:'#2d7756'},
    {x:-20,z:31,scale:.94,shape:'broad',tone:'#337f5b'},
    {x:20,z:31,scale:.9,shape:'compact',tone:'#3a8a64'}
  ]),
  planters:freezeList([
    {x:-10,z:-4},{x:10,z:-4},{x:-10,z:4},{x:10,z:4},
    {x:-21,z:-7},{x:21,z:-7},{x:-21,z:7},{x:21,z:7}
  ]),
  clouds:freezeList([
    {x:-52,y:35,z:-48,s:4.8},{x:34,y:42,z:-56,s:5.6},{x:58,y:39,z:-10,s:4.2},
    {x:-55,y:44,z:20,s:5.0},{x:20,y:38,z:48,s:4.4},{x:2,y:48,z:-62,s:6.1}
  ]),
  aerial:freezeList([
    {id:'campus-survey-drone',kind:'drone',accent:'#72e6ff',y:17,speed:.028,scale:1.35,path:[[-42,-25],[42,-25],[42,25],[-42,25],[-42,-25]]},
    {id:'campus-cargo-drone',kind:'cargo-drone',accent:'#8f8cff',y:23,speed:.021,scale:1.65,path:[[0,-31],[37,0],[0,31],[-37,0],[0,-31]]}
  ])
});

export const VALE_AMBIENT=Object.freeze({
  clouds:freezeList([
    {x:-300,y:94,z:-250,s:14},{x:25,y:120,z:-330,s:18},{x:305,y:105,z:-190,s:15},
    {x:335,y:128,z:160,s:19},{x:45,y:98,z:310,s:15},{x:-285,y:116,z:250,s:17},
    {x:-380,y:132,z:20,s:20},{x:180,y:142,z:35,s:16}
  ]),
  aerial:freezeList([
    {id:'vale-drone-observador',kind:'drone',accent:'#72e6ff',y:48,speed:.010,scale:2.4,path:[[-300,-260],[280,-260],[320,230],[-280,260],[-300,-260]]},
    {id:'vale-drone-carga',kind:'cargo-drone',accent:'#a78bfa',y:62,speed:.007,scale:2.9,path:[[-360,40],[-90,-330],[300,-180],[250,300],[-280,260],[-360,40]]},
    {id:'vale-air-shuttle',kind:'shuttle',accent:'#51e7a3',y:76,speed:.005,scale:3.2,path:[[0,-370],[350,-40],[140,340],[-320,180],[-260,-280],[0,-370]]}
  ])
});

export function ambientBudget(quality='medium',area='campus'){
  const q=['low','medium','high','ultra'].includes(String(quality))?String(quality):'medium';
  const campus={low:{trees:4,planters:0,clouds:0,aerial:0,stars:24},medium:{trees:8,planters:4,clouds:2,aerial:1,stars:72},high:{trees:10,planters:8,clouds:4,aerial:2,stars:128},ultra:{trees:12,planters:8,clouds:6,aerial:2,stars:180}};
  const vale={low:{trees:8,clouds:0,aerial:0,stars:36},medium:{trees:14,clouds:3,aerial:1,stars:96},high:{trees:18,clouds:6,aerial:2,stars:168},ultra:{trees:20,clouds:8,aerial:3,stars:240}};
  return Object.freeze({...((area==='vale'?vale:campus)[q])});
}
