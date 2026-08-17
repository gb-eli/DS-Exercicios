export const describeProfileRecoveryEnvelope = () => ({
  mode: 'PROFILE_RECOVERY_ENVELOPE',
  purpose: 'Redefinir a senha do perfil sem revelar a senha anterior.',
  studentProtection: 'PBKDF2-HMAC-SHA-256 + AES-256-GCM',
  teacherProtection: 'RSA-OAEP-256 com chave privada fora da plataforma',
  passwordDisclosure: false,
});
