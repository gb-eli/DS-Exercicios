export const EDUAUTH_KEY_CONFIG = {
  environment: 'development',
  productionProvisioned: false,
  classKey: {
    keyId: 'ctfds-class-01', keyVersion: 1, algorithm: 'HMAC-SHA-256',
    materialBase64: '2uBTbvMC0ES/iUTmHy8AqFyO0AF6hAfd1dQUOZhbgUM=',
    warning: 'DEVELOPMENT TEST KEY — DO NOT USE IN PRODUCTION',
  },
  sessionKey: {
    keyId: 'ctfds-session-01', keyVersion: 1, algorithm: 'HMAC-SHA-256',
    materialBase64: 'NBwrtil05kWGJwJTGnvdLj3v8qntCngh62pAxMnkEiY=',
    warning: 'DEVELOPMENT TEST KEY — DO NOT USE IN PRODUCTION',
  },
  signingPublicKey: {
    keyId: 'teacher-signing-test-01', algorithm: 'ECDSA-P256-SHA256',
    jwk: { key_ops: ['verify'], ext: true, kty: 'EC', x: 'evxq_Fr_SVjYakgvViZIDYJ3DogCw90Yp0V_NU5jq-0', y: 'KwreBBBm4ZND6-4JeutC6fIU1W9gLhL6dt3w3Uq-Nfg', crv: 'P-256' },
    warning: 'DEVELOPMENT TEST PUBLIC KEY — REPLACE DURING PROVISIONING',
  },
  recoveryPublicKey: { keyId: 'teacher-recovery-runtime', source: 'runtime-generated-or-imported', required: false },
};
