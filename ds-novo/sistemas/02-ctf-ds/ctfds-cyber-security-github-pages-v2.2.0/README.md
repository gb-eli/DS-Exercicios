# CTF DS — Cyber Security Lab v2.2.0

Plataforma educacional frontend, gamificada, responsiva e offline para aprendizagem de cibersegurança ofensiva e defensiva em ambientes autorizados e simulados.

**Idealização, desenvolvimento pedagógico, coordenação e validação:** Professor Gabriel  
**Contexto:** curso Técnico em Desenvolvimento de Sistemas — Colégio Alberto  
**Assistência tecnológica desta atualização:** ChatGPT — GPT-5.6 Thinking

## Publicação no GitHub Pages

Não há compilação, servidor próprio ou banco remoto obrigatório.

1. Extraia o ZIP.
2. Envie **todo o conteúdo extraído** para a raiz do repositório.
3. No GitHub, abra **Settings → Pages**.
4. Selecione **Deploy from a branch**.
5. Escolha `main` e `/ (root)`.
6. Salve e aguarde a publicação.

Consulte `GITHUB_PAGES_DEPLOY.md` e `PUBLISH_CHECKLIST.md`.

## Configuração do professor

Edite `js/config/platform-config.js` para configurar instituição, atividade, turmas, horários, retenção, Classroom, GitHub, VS Code e catálogo das demais plataformas. Links vazios permanecem desativados; a aplicação não simula integrações inexistentes.

## Destaques da versão 2.2.0

### Termo e uso autorizado

- aceite obrigatório, acessível e versionado;
- resumo, termo completo, privacidade e aviso de simulações fictícias;
- caixas não pré-marcadas;
- registro criptografado no perfil e no histórico;
- novo aceite quando a versão relevante mudar;
- escopo autorizado visível em todas as missões;
- recompensas, loja e evidência final bloqueadas sem aceite válido.

### Carteira por extrato

- moedas, XP, estrelas, itens e emblemas derivados de um ledger encadeado;
- saldo disponível, em análise e bloqueado;
- sequência, nonce, hash anterior, hash atual e tag de integridade;
- reconciliação na abertura, salvamento, compra, recompensa, importação e exportação;
- compras atômicas dentro do perfil criptografado;
- recibos e histórico sem edição de transações antigas;
- adulterações simples restauram os campos derivados e mantêm a carteira bloqueada para revisão;
- loja exclusivamente virtual e educacional, sem dinheiro real e sem impacto na nota.

### Avaliação separada da gamificação

- rubrica de proficiência configurável;
- critérios de investigação, uso de ferramentas, prática segura e evidência;
- revisão docente obrigatória;
- moedas, compras, personagens e cosméticos não determinam nota.

### Segurança frontend

- perfis criptografados em IndexedDB com AES-GCM;
- PBKDF2-HMAC-SHA-256 para proteção por senha;
- validação estrutural de backups;
- rejeição de `__proto__`, `constructor` e `prototype` em dados importados;
- validação de links externos e bloqueio de protocolos perigosos;
- Content Security Policy compatível com GitHub Pages;
- nenhuma execução de código importado, tema, item ou configuração;
- EduAuth Offline preservado em ambiente de desenvolvimento até provisionamento real.

### Acessibilidade e desempenho

- alto contraste;
- redução de movimento e partículas;
- presets automático, baixo, médio e alto;
- modo foco;
- navegação por teclado e foco visível;
- interface responsiva para celular, Chromebook e computador.

## Conteúdo preservado

- 68 missões CTF;
- oito operações iniciais tutorializadas;
- dez aulas guiadas;
- 13 ferramentas locais;
- gaveta lateral e tutoriais animados;
- 25 dossiês, 15 casos públicos, dez trilhas e oito carreiras;
- gamificação, campanha, emblemas, personagens e loja;
- EduAuth Offline, perfis, backup, recuperação, horário escolar, evidência e Classroom assistido.

## Arquivos de documentação

- `TERMS.md`
- `PRIVACY.md`
- `SIMULATION_NOTICE.md`
- `EDUCATIONAL_USE.md`
- `PERMISSIONS.md`
- `ASSESSMENT.md`
- `SECURITY.md`
- `CREDITS.md`
- `CHANGELOG.md`
- `KNOWN_ISSUES.md`
- `RECOVERY_GUIDE.md`
- `TEST_REPORT.md`

## Testes

Com Node.js disponível:

```bash
npm run check
```

O comando valida conteúdo, progressão, ferramentas, EduAuth, criptografia, backup, recuperação, ledger, adulteração, termos, evidência, XSS e escopo autorizado.

## Limitações honestas

O projeto roda integralmente no navegador. Um usuário com controle total do ambiente pode analisar ou modificar JavaScript e armazenamento. A arquitetura reduz adulterações casuais, detecta inconsistências e impede que estados incoerentes produzam compras ou recompensas válidas, mas não substitui um backend autoritativo.

O GitHub Pages não confirma entregas do Classroom, não fornece auditoria central e não protege segredos simétricos publicados no frontend. Autorizações EduAuth reais dependem do provisionamento futuro do EduAuth Professor.
