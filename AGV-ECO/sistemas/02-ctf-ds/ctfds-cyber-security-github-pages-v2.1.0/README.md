# CTF DS — Cyber Security Lab v2.1.0

Plataforma educacional frontend, gamificada e responsiva para introdução à cibersegurança, defesa, desenvolvimento seguro, criptografia, redes, forense, segurança financeira, mobile, cloud, DevSecOps, criptoativos e engenharia reversa defensiva.

**Idealização, desenvolvimento pedagógico, coordenação e validação:** Professor Gabriel  
**Contexto:** curso Técnico em Desenvolvimento de Sistemas — Colégio Alberto  
**Assistência tecnológica desta atualização:** ChatGPT, modelo GPT-5.6 Thinking

## Publicação

O projeto está pronto para funcionar como site estático no GitHub Pages. Não existe etapa de compilação, instalação ou backend.

1. Crie um repositório no GitHub.
2. Envie **todo o conteúdo desta pasta** para a raiz do repositório.
3. Abra **Settings → Pages**.
4. Em **Build and deployment**, selecione **Deploy from a branch**.
5. Selecione a branch `main` e a pasta `/ (root)`.
6. Salve e aguarde a publicação.

Consulte [GITHUB_PAGES_DEPLOY.md](./GITHUB_PAGES_DEPLOY.md) para o checklist completo.

## Configuração do professor

Edite somente:

```text
js/config/platform-config.js
```

Nesse arquivo podem ser configurados:

- instituição e curso;
- disciplina, atividade e resultado esperado;
- turma e turno;
- horários escolares;
- link geral ou direto do Google Classroom;
- links de GitHub e VS Code, quando aplicáveis;
- catálogo de outras plataformas educacionais;
- retenção e bloqueio de sessão.

Os links externos ficam desativados enquanto estiverem vazios. A plataforma não cria botões falsos nem simula integração.

## Recursos da versão 2.0

### Perfil local protegido

- nome completo do aluno, turma e senha local;
- múltiplos perfis por equipamento;
- lista pública reduzida para primeiro nome e inicial;
- dados criptografados em IndexedDB com AES-GCM de 256 bits;
- chave do perfil protegida por PBKDF2-HMAC-SHA-256;
- salt e IV aleatórios;
- expiração após cinco dias sem salvamento;
- bloqueio automático após dez minutos de inatividade;
- botão **Sair e bloquear**;
- solicitação opcional de armazenamento persistente;
- migração automática do perfil da versão 1.6 após autenticação;
- sessão temporária sem persistência.

### Backup, importação e integridade

- exportação em arquivo `.edu-profile` criptografado;
- importação controlada, sem mesclagem silenciosa;
- conflito exige confirmação antes de substituição;
- histórico de exportações;
- log de auditoria com cadeia de hashes;
- verificação de integridade pelo aluno;
- alteração de senha sem apagar progresso.

### Recuperação administrativa

O modo do professor pode:

1. gerar um par de chaves RSA-OAEP;
2. manter somente a chave pública no navegador;
3. baixar a chave privada em arquivo administrativo criptografado;
4. proteger perfis desbloqueados posteriormente;
5. redefinir a senha do aluno sem revelar a senha anterior;
6. preservar identidade, respostas, fases, XP, itens e histórico;
7. registrar motivo e identificação administrativa.

Não existe senha universal. Se a frase-senha mestre e o arquivo administrativo forem perdidos, a recuperação não será possível.

### Central de conclusão e entrega

- resumo de missões, aulas, XP e estrelas;
- geração de evidência HTML real;
- backup criptografado;
- checklist de localização, conferência, anexo e entrega;
- abertura do Classroom somente quando um link válido estiver configurado;
- diferenciação entre arquivo gerado, Classroom aberto e entrega declarada;
- ajuda para Downloads, celular, internet e armazenamento cheio.

Sem uma API autenticada, a plataforma não afirma que uma atividade foi realmente entregue.

### Horário escolar

- fuso `America/Sao_Paulo`;
- horários da manhã e da noite;
- associação por turma;
- indicador discreto da aula atual;
- intervalo, última aula e estudo fora do turno;
- lembretes nos marcos de 30, 20, 15, 10, 5 e 2 minutos;
- lembretes configuráveis;
- nenhuma inferência de presença física ou localização.

### Créditos e versões

- página Sobre;
- protagonismo e direção pedagógica do professor Gabriel;
- colaboração coletiva dos estudantes e professores;
- registro verdadeiro do apoio de inteligência artificial;
- versão atual e changelog;
- limitações do frontend e do GitHub Pages;
- catálogo de outras ferramentas preparado, mas desativado até receber links válidos.

### Campanha e aprendizagem preservadas

- 68 missões CTF progressivas;
- oito operações tutoriais iniciais;
- 13 ferramentas locais funcionais;
- tutorial animado com cursor virtual, spotlight, pausa e etapas puláveis;
- dez aulas guiadas;
- 25 dossiês e 15 casos públicos;
- dez trilhas técnicas além do treinamento inicial;
- ferramentas profissionais de referência;
- XP, níveis, estrelas, moedas, emblemas, combos e loja;
- carreiras e competências profissionais;
- funcionamento offline depois do primeiro carregamento.

## Segurança e escopo

A plataforma é um simulador local e autorizado. Ela não:

- escaneia redes;
- executa comandos reais;
- acessa arquivos privados;
- testa bancos, carteiras, redes sociais ou serviços externos;
- captura credenciais;
- executa malware;
- envia respostas para um servidor;
- confirma presença ou entrega escolar.

As marcas e casos reais aparecem somente para contextualização. As atividades práticas usam dados e organizações fictícias.

## Limitações do GitHub Pages

Todo código do projeto fica público. Um aluno avançado pode inspecionar os arquivos e localizar respostas ou regras de validação. A criptografia protege os perfis no navegador, mas não transforma um site estático em um servidor confiável.

Para recursos como:

- placar centralizado;
- flags individuais;
- sincronização de turmas;
- relatórios do professor;
- confirmação real do Classroom;
- OAuth;
- recuperação institucional entre dispositivos;

será necessário um backend autorizado e políticas institucionais.

## Teste local

```bash
python -m http.server 8080
```

Abra:

```text
http://localhost:8080
```

Validação automatizada:

```bash
npm run check
```

## Estrutura

```text
ctfds-main/
├── .nojekyll
├── .gitignore
├── index.html
├── manifest.webmanifest
├── sw.js
├── README.md
├── CHANGELOG.md
├── SECURITY_AND_PRIVACY.md
├── GITHUB_PAGES_DEPLOY.md
├── css/
│   └── app.css
├── assets/icons/
│   └── icon.svg
├── tests/
│   └── validate.mjs
└── js/
    ├── app.js
    ├── config/
    │   └── platform-config.js
    ├── core/
    │   ├── state.js
    │   ├── storage.js
    │   └── utils.js
    ├── data/
    │   ├── changelog.js
    │   ├── challenges.js
    │   ├── careers.js
    │   ├── intel.js
    │   ├── lessons.js
    │   ├── store-items.js
    │   └── tool-catalog.js
    └── modules/
        ├── about.js
        ├── academy.js
        ├── careers.js
        ├── ctf.js
        ├── dashboard.js
        ├── delivery.js
        ├── effects.js
        ├── guided-tutorial.js
        ├── intel.js
        ├── mission-scenarios.js
        ├── profile.js
        ├── schedule.js
        ├── store.js
        ├── teacher-recovery.js
        ├── terminal.js
        └── tools.js
```

## EduAuth Offline 1.0.0

A versão 2.1.0 inclui a integração estrutural do protocolo universal EduAuth Offline.

Recursos incluídos:

- código-base público em Base32 Crockford;
- checksum CRC32C;
- PIN coletivo de turma;
- PIN individual vinculado à sessão;
- autorização assinada ECDSA;
- recuperação criptográfica de perfil;
- cinco tentativas e atraso progressivo;
- expiração e uso único;
- QR Code opcional, sem exigir câmera;
- auditoria local em IndexedDB;
- interface responsiva para celular, Chromebook e computador.

### Atenção: provisionamento

O pacote usa chaves marcadas como:

```text
DEVELOPMENT TEST KEY — DO NOT USE IN PRODUCTION
```

Isso é intencional. O EduAuth Professor ainda deverá ser criado e gerar as chaves definitivas. Antes de usar autorizações reais em sala:

1. leia `eduauth-integration-report.md`;
2. importe o manifest e o registro de ações no EduAuth Professor;
3. gere o provisionamento de produção;
4. substitua `js/eduauth/config/key-config.js`;
5. execute `npm run check`;
6. marque a plataforma como provisionada;
7. remova o bypass de desenvolvimento;
8. publique uma nova versão.

Arquivos de retorno:

- `eduauth-platform-manifest.json`;
- `eduauth-action-registry.json`;
- `eduauth-test-vectors.json`;
- `eduauth-provisioning-template.json`;
- `eduauth-integration-report.md`.
