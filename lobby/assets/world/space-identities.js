// Etapa 29 / Fase 2.3 — identidade visual compartilhada entre os mapas 2D e 3D.
// Uma assinatura por espaço evita poluição visual e mantém o custo de render previsível.
export const CAMPUS_SPACE_IDENTITIES=Object.freeze({
  'plaza-academic':Object.freeze({icon:'▦',tagline:'APRENDER • CRIAR • COMPARTILHAR',motif:'knowledge',accent:'#36d2ff'}),
  'plaza-civic':Object.freeze({icon:'◆',tagline:'SERVIÇOS • ENCONTROS • COMUNIDADE',motif:'civic',accent:'#61e7a6'}),
  'plaza-gamer':Object.freeze({icon:'✦',tagline:'JOGAR • DESAFIAR • COOPERAR',motif:'gamer',accent:'#ff7fd5'}),
  'plaza-innovation':Object.freeze({icon:'⬡',tagline:'PROTOTIPAR • TESTAR • INOVAR',motif:'innovation',accent:'#61e7a6'}),
  'plaza-mobility':Object.freeze({icon:'⇄',tagline:'ROTAS • ESTAÇÕES • MOVIMENTO',motif:'mobility',accent:'#ffae63'})
});

export const VALE_DISTRICT_IDENTITIES=Object.freeze({
  'praca-das-startups':Object.freeze({icon:'◎',tagline:'IDEIAS EM MOVIMENTO',motif:'startup',accent:'#51e7a3'}),
  'distrito-educacao-e-conhecimento':Object.freeze({icon:'▦',tagline:'CONHECIMENTO APLICADO',motif:'knowledge',accent:'#36d2ff'}),
  'distrito-dados-e-sistemas':Object.freeze({icon:'⌁',tagline:'DADOS • SISTEMAS • AUTOMAÇÃO',motif:'data',accent:'#61e7a6'}),
  'distrito-esportes-e-eventos':Object.freeze({icon:'◉',tagline:'MOVIMENTO • EVENTOS • EQUIPE',motif:'sports',accent:'#34d399'}),
  'distrito-games-e-esports':Object.freeze({icon:'✦',tagline:'GAMES • E-SPORTS • EXPERIÊNCIAS',motif:'gamer',accent:'#b58cff'}),
  'distrito-maker-e-robotica':Object.freeze({icon:'⚙',tagline:'MAKER • ROBÓTICA • PROTÓTIPOS',motif:'maker',accent:'#ffae63'}),
  'distrito-midia-e-comunicacao':Object.freeze({icon:'◫',tagline:'MÍDIA • CONTEÚDO • COMUNICAÇÃO',motif:'media',accent:'#f472b6'}),
  'distrito-imersivo-e-virtual':Object.freeze({icon:'◇',tagline:'IMERSÃO • XR • MUNDOS VIRTUAIS',motif:'immersive',accent:'#8b5cf6'})
});

export function campusSpaceIdentity(id){return CAMPUS_SPACE_IDENTITIES[id]||null;}
export function valeDistrictIdentity(id){return VALE_DISTRICT_IDENTITIES[id]||Object.freeze({icon:'◇',tagline:'VALE DO SILÍCIO AGV',motif:'tech',accent:'#72e6ff'});}
