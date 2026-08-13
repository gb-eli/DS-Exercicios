# CTF DS — Cyber Security Lab v3.2.0

Plataforma educacional frontend, gamificada, responsiva e offline para aprendizagem de cibersegurança ofensiva e defensiva em ambientes autorizados e simulados.

**Idealização, desenvolvimento pedagógico, coordenação e validação:** Professor Gabriel  
**Contexto:** curso Técnico em Desenvolvimento de Sistemas — Colégio Alberto  
**Assistência tecnológica desta atualização:** ChatGPT — GPT-5.6 Thinking

## Campanha integral

A versão 3.2.0 estabiliza a campanha integral com atualização segura, diagnóstico local do dispositivo, modo imersivo móvel e acabamento visual. As **68 missões** continuam no formato investigativo. A campanha contém:

- sete blocos e checkpoints formativos;
- sete arcos narrativos;
- documentos, registros, comunicações, arquivos e evidências por missão;
- 58 investigações avançadas após o bloco inicial;
- 36 casos com simuladores profissionais fictícios;
- oito ambientes 3D/360 procedurais;
- 55 integrações contextuais entre missões e ambientes imersivos;
- fallback 2D completo;
- qualidade Automático, Baixo, Médio, Alto e Ultra.

Consulte `STABLE_RUNTIME_V3_2.md`, `VISUAL_QA_MATRIX.md`, `FULL_CAMPAIGN_V3_1.md`, `INVESTIGATIVE_WORKSPACE.md`, `NARRATIVE_ENGINE.md`, `SIMULATION_SUITE.md` e `IMMERSIVE_3D_360.md`.

## Proteção Anti-Leak

- 62 respostas determinísticas verificadas por comprovantes AES-GCM selados;
- seis validadores estruturais para respostas de código;
- nenhum catálogo público `missão → resposta`;
- 68 pacotes investigativos ofuscados e carregados sob demanda;
- comprovantes de conclusão vinculados ao perfil;
- detecção local de padrões anormais sem banimento automático;
- carteira e inventário derivados de ledger reconciliado.

A proteção aumenta a resistência contra busca casual, mas não substitui validação por backend. Consulte `ANTI_LEAK_SECURITY.md`.

## Publicação no GitHub Pages

Não há compilação nem servidor próprio obrigatório.

1. Extraia o ZIP.
2. Envie todo o conteúdo extraído para a raiz do repositório.
3. Em **Settings → Pages**, selecione **Deploy from a branch**.
4. Escolha `main` e `/ (root)`.
5. Salve e valide o endereço publicado.

Consulte `GITHUB_PAGES_DEPLOY.md` e `PUBLISH_CHECKLIST.md`.

## Configuração do professor

Edite `js/config/platform-config.js` para ajustar instituição, atividade, turmas, horários, retenção e links reais. Campos vazios permanecem desativados; a aplicação não simula integrações externas inexistentes.

## Investigative Workspace

Toda missão apresenta o objetivo principal antes das informações complementares. Os materiais ficam organizados em gavetas:

- Caso;
- Investigação;
- Análise;
- Evidências;
- Ajuda.

O perfil salva materiais lidos, ferramentas, evidências, anotações, linha do tempo, decisões, hipótese, recomendação, conclusão e resposta em rascunho.

## Simulation Suite

Seis simuladores locais:

- e-mail;
- navegador;
- celular;
- análise de logs;
- scanner de rede fictício;
- central SOC.

Nenhum simulador acessa rede, conta, dispositivo, e-mail ou serviço real.

## Immersive 3D/360

Oito ambientes procedurais:

1. sala de servidores;
2. centro SOC;
3. mapa de rede;
4. central orbital;
5. incidente financeiro;
6. laboratório AppSec;
7. cofre forense;
8. centro mobile.

O modo Automático adapta resolução e partículas conforme o FPS. O motor pausa fora de foco, descarta recursos ao fechar e oferece fallback 2D completo.

## Perfis e continuidade

- IndexedDB criptografado com AES-GCM;
- senha protegida por PBKDF2-HMAC-SHA-256;
- múltiplas contas locais;
- bloqueio de conflito entre abas;
- backup e importação criptografados;
- recuperação administrativa autorizada;
- schema 15, workspace 9 e rascunho 8;
- caches offline `ctfds-static-v3.2.0` e `ctfds-runtime-v3.2.0`.

## Gamificação e avaliação

- sete checkpoints por bloco;
- XP, moedas, estrelas e emblemas registrados no ledger;
- loja apenas cosmética;
- gamificação não determina nota;
- proficiência é formativa e exige revisão docente.

## Testes

Com Node.js:

```bash
npm test
```

A suíte valida missões, casos, arcos, simuladores, ambientes 3D/360, fallback, salvamento, EduAuth, criptografia, carteira, termos, evidências, XSS, imports e cache offline.

## Limitações honestas

O projeto roda no navegador. Um usuário com controle total do ambiente pode estudar ou modificar JavaScript e armazenamento. A arquitetura reduz adulterações casuais, detecta inconsistências e bloqueia estados inválidos, mas não equivale a um backend autoritativo.

O GitHub Pages não fornece sincronização central, auditoria remota ou confirmação real de entrega no Classroom. O EduAuth continua em ambiente de desenvolvimento até provisionamento oficial.
