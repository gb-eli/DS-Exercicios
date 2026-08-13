# Relatório de Integração — EduAuth Offline

## Identificação

- Plataforma: CTF DS — Cyber Security Lab
- Versão da plataforma: 2.3.0
- EduAuth Core: 1.0.0
- Data: 29/07/2026
- Hospedagem prevista: GitHub Pages
- Funcionamento offline: sim
- Situação: integração estrutural concluída em ambiente de desenvolvimento
- Provisionamento de produção: pendente

## Diagnóstico do sistema anterior

A versão 2.0.0 não continha senha fixa de professor, senha mestre embutida, código universal ou comparação direta com texto estático. Foram encontrados:

| Local | Finalidade | Mecanismo anterior | Risco | Substituição/integração |
|---|---|---|---|---|
| `js/core/storage.js` | Senha local do aluno | PBKDF2 + envelope AES-GCM | adequado | preservado; não é senha administrativa |
| `js/core/storage.js` | Frase-senha da chave privada de recuperação | PBKDF2 + AES-GCM | alto impacto, mas não estática | preservada dentro de `PROFILE_RECOVERY_ENVELOPE` |
| `js/app.js` | Zerar progresso | confirmação simples do navegador | alto | `SESSION_SCOPED_PIN`, 10 dígitos, uso único |
| `js/app.js` | Excluir perfil local | confirmação simples do navegador | crítico | `SIGNED_GRANT` |
| `js/app.js` | Configurar recuperação | acesso direto ao formulário | crítico | `SIGNED_GRANT` |
| `js/app.js` | Redefinir senha | arquivo administrativo + frase-senha | alto | solicitação EduAuth + envelope criptográfico existente |

Nenhum valor sensível antigo foi incluído neste relatório.

## Arquitetura aplicada

A implementação adiciona:

- Base32 Crockford tolerante a maiúsculas, espaços e hífens;
- checksum CRC32C para detectar erro de digitação;
- serialização canônica antes de HMAC e assinatura;
- `CLASS_SHARED_PIN` com HMAC-SHA-256 e janelas de 15 minutos;
- `SESSION_SCOPED_PIN` com sessão, solicitação, nonce, perfil pseudonimizado, validade e consumo;
- `SIGNED_GRANT` com ECDSA P-256 e somente chave pública no frontend;
- `PROFILE_RECOVERY_ENVELOPE` ligado ao envelope RSA-OAEP já existente;
- limite de cinco tentativas e atraso progressivo;
- autorizações limitadas à ação e ao recurso;
- sessão EduAuth em `sessionStorage`;
- auditoria local em IndexedDB separado;
- QR Code opcional gerado localmente, sem câmera obrigatória;
- leitura em voz alta e botão de cópia;
- bypass explicitamente restrito ao ambiente de desenvolvimento.

## Ações integradas

| Ação | Risco | Modalidade | Validade | PIN | Escopo |
|---|---|---|---:|---:|---|
| Iniciar desafio supervisionado | LOW | CLASS_SHARED_PIN | 15 min | 8 | turma, aula e atividade |
| Iniciar aula guiada supervisionada | LOW | CLASS_SHARED_PIN | 15 min | 8 | turma, aula e atividade |
| Liberar resultado individual | MEDIUM | SESSION_SCOPED_PIN | 5 min | 8 | sessão e resultado |
| Redefinir senha do perfil | HIGH | PROFILE_RECOVERY_ENVELOPE + PIN de sessão | 3 min | 10 | perfil e solicitação |
| Zerar progresso | HIGH | SESSION_SCOPED_PIN / SIGNED_GRANT | 3 min | 10 | perfil atual |
| Excluir perfil do dispositivo | CRITICAL | SIGNED_GRANT | 2 min | não se aplica | perfil atual |
| Configurar recuperação | CRITICAL | SIGNED_GRANT | 2 min | não se aplica | chave administrativa |

A proteção de início de desafio e de aula está implementada, porém desativada na configuração padrão para não bloquear a campanha antes do provisionamento do EduAuth Professor.

## Código-base

Formato:

```text
EA1-<MODO>-K<VERSÃO>-<PAYLOAD BASE32>-<CRC32C>
```

Prefixos:

- `EA1-C1`: coletivo;
- `EA1-S1`: sessão;
- `EA1-G1`: autorização assinada;
- `EA1-R1`: recuperação.

O payload compacto transporta códigos de plataforma, turma, disciplina, aula, atividade, ação e faixa UTC. Solicitações individuais acrescentam identificadores truncados da sessão e solicitação, nonce, perfil pseudonimizado e expiração.

## Interface

Estados implementados:

- preparação;
- autorização necessária;
- código-base público;
- copiar;
- ouvir;
- QR opcional;
- PIN ou token assinado;
- cronômetro;
- tentativas;
- renovação da solicitação;
- validação;
- sucesso;
- erro neutro;
- aviso de ambiente de desenvolvimento.

A interface funciona sem câmera e foi organizada para celular, Chromebook e computador.

## Arquivos criados

- `js/eduauth/index.js`
- `js/eduauth/core/*`
- `js/eduauth/modes/*`
- `js/eduauth/config/*`
- `js/eduauth/storage/*`
- `js/eduauth/ui/*`
- `eduauth-platform-manifest.json`
- `eduauth-action-registry.json`
- `eduauth-test-vectors.json`
- `eduauth-provisioning-template.json`
- `eduauth-integration-report.md`

## Arquivos modificados

- `index.html`
- `css/app.css`
- `js/app.js`
- `js/core/storage.js`
- `js/config/platform-config.js`
- `js/data/changelog.js`
- `js/modules/profile.js`
- `js/modules/teacher-recovery.js`
- `sw.js`
- `package.json`
- `README.md`
- `CHANGELOG.md`
- `SECURITY_AND_PRIVACY.md`
- `GITHUB_PAGES_DEPLOY.md`
- `tests/validate.mjs`

## Testes executados

- código coletivo válido;
- PIN coletivo incompatível;
- checksum inválido;
- código de outra turma;
- código de outra aula;
- código de outra plataforma;
- sessão válida;
- sessão expirada;
- sessão de outro contexto;
- consumo após uso;
- cinco tentativas incorretas;
- atraso progressivo;
- autorização ECDSA válida;
- token alterado;
- token fora do recurso;
- QR Code local;
- sintaxe dos módulos;
- imports;
- arquivos do Service Worker;
- perfil local, backup e recuperação já existentes;
- renderização estrutural das 68 missões.

## Limitações

- Não existe backend nem servidor central de autorização.
- As chaves HMAC de teste estão no frontend e podem ser analisadas.
- Logs locais podem ser apagados pelo usuário ou navegador.
- Não existe revogação central.
- A autorização assinada é mais forte que o PIN simétrico, mas ainda depende do controle local do navegador.
- O EduAuth Professor ainda não foi criado/provisionado.
- O bypass de desenvolvimento precisa ser removido no provisionamento de produção.
- O QR Code é alternativa para o código-base; câmera não é necessária na plataforma do aluno.

## Pendências reais

1. Construir o EduAuth Professor a partir dos cinco arquivos de retorno.
2. Gerar chaves de produção separadas para esta plataforma.
3. Substituir `js/eduauth/config/key-config.js` por configuração provisionada.
4. Preencher repositório e origem no manifest.
5. Executar novamente os vetores de produção.
6. Marcar `productionProvisioned: true`.
7. Remover o bypass de desenvolvimento e publicar uma nova versão.

## Resultado

```text
EDUAUTH PLATFORM INTEGRATION: VALID
```

A declaração acima significa que a integração estrutural e os vetores de desenvolvimento estão válidos. Não significa que o provisionamento de produção já foi realizado.
