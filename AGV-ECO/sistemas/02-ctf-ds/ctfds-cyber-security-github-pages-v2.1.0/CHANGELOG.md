# Histórico de versões

## v2.0.0 — 29/07/2026

### Perfil local e segurança

- Migração para IndexedDB.
- Criptografia AES-GCM de 256 bits.
- Envelope criptográfico protegido pela senha do aluno.
- Backup `.edu-profile` criptografado.
- Alteração de senha preservando o progresso.
- Bloqueio automático por inatividade.
- Expiração após cinco dias.
- Perfil temporário.
- Log com verificação de integridade.
- Recuperação administrativa opcional por RSA-OAEP.

### Experiência educacional

- Central de conclusão e entrega.
- Evidência HTML.
- Classroom configurável.
- Indicador do horário escolar.
- Lembretes contextuais.
- Página Sobre, créditos e limitações.
- Catálogo de plataformas preparado para links reais.

### Compatibilidade

- Preservadas 68 missões, tutoriais, ferramentas, dossiês, aulas, carreiras e progressão.
- Migração automática dos perfis da versão 1.6.
- Atualizado o Service Worker para o cache `ctfds-v2.0.0`.

**Validação pedagógica e funcional:** Professor Gabriel  
**Apoio:** ChatGPT — GPT-5.6 Thinking

## v1.6.0 — 29/07/2026

- Central de tutoriais.
- Cursor virtual e spotlight.
- Demonstrações das 13 ferramentas.
- Melhorias nas oito missões iniciais.

## v2.1.0 — 29/07/2026

- Integrado o núcleo universal EduAuth Offline 1.0.0.
- Adicionados códigos-base Base32 Crockford com checksum CRC32C.
- Adicionados PIN coletivo e PIN individual com HMAC-SHA-256.
- Adicionadas expiração, uso único, escopo por recurso, limite de tentativas e atraso progressivo.
- Adicionada verificação de autorizações ECDSA assinadas, sem chave privada no frontend.
- Integradas recuperação de perfil, redefinição, exclusão e zeragem de progresso.
- Adicionado QR Code opcional, cópia e leitura em voz alta.
- Gerados os cinco arquivos obrigatórios para o futuro EduAuth Professor.
- Mantidas chaves somente de desenvolvimento; provisionamento de produção continua pendente.
