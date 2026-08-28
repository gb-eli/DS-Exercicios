/**
 * EduAuth Offline — configuração estrutural de DESENVOLVIMENTO.
 * DEVELOPMENT TEST KEY — DO NOT USE IN PRODUCTION.
 * Substitua este arquivo durante o provisionamento do EduAuth Professor.
 */
export const EDUAUTH_CORE_VERSION='1.0.0';
export const EDUAUTH_ENVIRONMENT='development';
export const EDUAUTH_PRODUCTION_PROVISIONED=false;

export const PLATFORM={
  id:'desafio-informatica-agv',
  code:1,
  name:'Desafio de Informática AGV',
  version:'2.5.7',
  subjectId:'informatica-empresarial',
  policyVersion:1
};

export const MODES={
  CLASS_SHARED_PIN:{id:'CLASS_SHARED_PIN',prefix:'C1',numericCode:1},
  SESSION_SCOPED_PIN:{id:'SESSION_SCOPED_PIN',prefix:'S1',numericCode:2},
  SIGNED_GRANT:{id:'SIGNED_GRANT',prefix:'G1',numericCode:3},
  PROFILE_RECOVERY_ENVELOPE:{id:'PROFILE_RECOVERY_ENVELOPE',prefix:'R1',numericCode:4}
};

export const ACTIONS={
  'lesson-start':{
    id:'lesson-start',numericCode:1,label:'Iniciar aula',risk:'LOW',preferredMode:'CLASS_SHARED_PIN',
    pinLength:8,ttlSeconds:0,sharedAcrossClass:true,sessionBound:false,singleUse:false,requireReason:false,fixedPerLesson:true
  },
  'result-release':{
    id:'result-release',numericCode:2,label:'Liberar resultado antes do tempo mínimo',risk:'MEDIUM',preferredMode:'CLASS_SHARED_PIN',
    strongerMode:'SIGNED_GRANT',pinLength:8,ttlSeconds:3600,sharedAcrossClass:true,sessionBound:false,singleUse:false,requireReason:true,hourlyClassRelease:true
  },
  'early-completion':{
    id:'early-completion',numericCode:3,label:'Liberar PDF ou resultado antecipadamente',risk:'HIGH',preferredMode:'CLASS_SHARED_PIN',
    strongerMode:'SIGNED_GRANT',pinLength:8,ttlSeconds:3600,sharedAcrossClass:true,sessionBound:false,singleUse:false,requireReason:true,hourlyClassRelease:true
  },
  'profile-recovery':{
    id:'profile-recovery',numericCode:4,label:'Redefinir senha do perfil',risk:'HIGH',preferredMode:'SESSION_SCOPED_PIN',
    strongerMode:'PROFILE_RECOVERY_ENVELOPE',pinLength:10,ttlSeconds:180,sharedAcrossClass:false,sessionBound:true,singleUse:true,requireReason:true
  }
};

export const REGISTRY={
  platforms:{'01':'desafio-informatica-agv'},
  classes:{'01':'1adm','02':'2adm'},
  subjects:{'01':'informatica-empresarial'},
  lessons:{
    '00':'platform-general','01':'1adm-01','02':'1adm-02','03':'1adm-03','04':'1adm-04','05':'1adm-05',
    '06':'1adm-06','07':'1adm-07','08':'2adm-01','09':'2adm-02','10':'2adm-03','11':'diagnostico','12':'1adm-08','13':'1adm-09','14':'2adm-04','15':'2adm-05'
  },
  activities:{'01':'guided-lesson','02':'diagnostic-general','03':'diagnostic-class','04':'profile','05':'class-release'},
  actions:{'01':'lesson-start','02':'result-release','03':'early-completion','04':'profile-recovery'}
};

export const POLICIES={
  useUtc:true,classWindowSeconds:900,classReleaseWindowSeconds:3600,sessionWindowSeconds:300,highRiskWindowSeconds:180,
  allowedClockDriftSlots:1,maximumAttempts:5,progressiveDelay:true
};

// Chaves simétricas de teste publicadas apenas para integração estrutural.
export const TEST_KEYS={
  notice:'DEVELOPMENT TEST KEY — DO NOT USE IN PRODUCTION',
  class:{keyId:'desafio-informatica-agv-class-01',version:1,rawBase64:'1Gs+af77dKsMHrM7TCJW4d/CZusK0XeaT/J1ZUPITkc='},
  session:{keyId:'desafio-informatica-agv-session-01',version:1,rawBase64:'C91nlspEQFH5EJWTQ9s0S2sWImZ/0AekCRzHaBP3MCo='}
};

export const SIGNING_PUBLIC_KEY={
  keyId:'teacher-signing-test-01',algorithm:'ECDSA-P256-SHA256',environment:'development',
  jwk:{key_ops:['verify'],ext:true,kty:'EC',x:'fJjFL-vATHoNbu6_naHT4H0l7b7E9G8IT2AolJPgymk',y:'nLZGWG5qQu1-IN9XGMVuaDxHNM8dyFDr5nioO3Nnr_k',crv:'P-256'}
};

export const RECOVERY_PUBLIC_KEY={
  keyId:'teacher-recovery-test-01',algorithm:'RSA-OAEP-256',environment:'development',
  jwk:{key_ops:['encrypt'],ext:true,kty:'RSA',n:'kvcRqc2QwQBQFLxWZJNFtzv9zcWEb8dVQujEEYfZRAhZby0tuQiAs7zwHSrSjA9t3EXEIkpIpDqbXLPTRCBcW8bZ1qxcofmRtzBB0iMiuMSfX8P2DykM0PjY9xjtoHwCABZSf0tJk_35af89xhUFh7xluhFBI78tTRlKMTgJwVyXalU8fWgmnHO2nbxh18vUVxk5Hh_b36MtHbYb104dC90qgu5_bpZO7xDJP_ON9TeCygImKcHzeyEakCWJ0sZNjNBRJS-cR1TYe8itSvr5MWXrkFpHfUW6O2CuG6IKsT_4NVgE_we9Gg1sSOCy_JkV23Fk4d8ZggU7NzCHUlaWuQ',e:'AQAB',alg:'RSA-OAEP-256'}
};

export function normalizeId(value){return String(value??'').trim().toLowerCase().replace(/º/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
export function classIdForRegistry(value){const n=normalizeId(value);if(n==='1adm'||n==='1-adm')return'1adm';if(n==='2adm'||n==='2-adm')return'2adm';return n||'1adm'}
export function lessonIdForRegistry(value){return normalizeId(value)||'platform-general'}
export function codeFor(group,id){
  const normalized=normalizeId(id);const entry=Object.entries(REGISTRY[group]||{}).find(([,value])=>normalizeId(value)===normalized);
  if(!entry)throw new Error(`Identificador EduAuth não registrado: ${group}/${id}`);return Number(entry[0]);
}
export function idFor(group,code){const key=String(code).padStart(2,'0'),value=REGISTRY[group]?.[key];if(!value)throw new Error(`Código EduAuth desconhecido: ${group}/${key}`);return value}
