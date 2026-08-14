# Histórico de versões

## v2.3.0 — 31/07/2026

### Proteção das respostas e integridade

- Removidos os validadores com respostas literais do catálogo público de missões.
- Adicionados verificadores selados por AES-GCM: a resposta fornecida tenta abrir um comprovante criptográfico específico da missão.
- Adicionados validadores estruturais para desafios com múltiplas soluções corretas de HTML, CSS, JavaScript, senhas, Node.js e Jinja.
- Adicionados comprovantes de captura vinculados ao perfil e incluídos na evidência exportada.
- Artefatos que precisam aparecer no DOM são armazenados de forma ofuscada e materializados somente ao abrir a missão.
- Adicionada detecção educativa de padrões de conclusão extremamente rápida, sem banimento automático.
- Eventos de segurança passaram a possuir cadeia local e área de consulta no perfil.
- Mantido bloqueio da carteira diante de adulteração de moedas, XP, inventário ou extrato.

### Limitação honesta

- Como o projeto roda integralmente no GitHub Pages, um usuário avançado ainda pode estudar o código e testar hipóteses localmente. A atualização impede a busca casual por listas de respostas e aumenta a rastreabilidade, mas não substitui validação por backend.

**Validação pedagógica e funcional:** Professor Gabriel  
**Apoio:** ChatGPT — GPT-5.6 Thinking

## v2.2.0 — 30/07/2026

### Segurança, integridade e termos

- Adicionado Termo de Ciência, Uso Responsável e Compromisso Pedagógico, versionado e obrigatório.
- Adicionados aviso de simulações fictícias, política de privacidade e escopo autorizado em cada missão.
- Registros de aceite passaram a integrar o perfil criptografado e a evidência.
- Reforçada a validação de backups, URLs e estruturas importadas.
- Adicionada Content Security Policy para scripts, objetos, frames e conexões.

### Carteira, loja e gamificação

- Moedas, XP, estrelas, itens e emblemas migrados para livro-razão encadeado.
- Adicionados saldos disponível, em análise e bloqueado.
- Adicionadas reconciliação, detecção de replay, IDs/nonces duplicados e divergência de inventário.
- Compras passam a gerar recibo e duas transações coerentes: débito e concessão do item.
- Adulterações mantêm a carteira bloqueada até revisão autorizada ou restauração válida.
- Loja declarada exclusivamente educacional, sem valor financeiro e sem influência na nota.

### Pedagogia, interface e desempenho

- Adicionada rubrica de proficiência separada da gamificação.
- Evidência passou a registrar termos, integridade e critérios pedagógicos.
- Adicionados alto contraste, redução de partículas, modo foco e qualidade adaptativa.
- Adicionada animação breve de agradecimento pela colaboração dos estudantes, exibida uma vez por versão.
- Atualizados créditos, documentação, manifests e testes.

**Validação pedagógica e funcional:** Professor Gabriel  
**Apoio:** ChatGPT — GPT-5.6 Thinking

## v2.1.0 — 29/07/2026

- Integrado o núcleo universal EduAuth Offline 1.0.0.
- Adicionados códigos-base Base32 Crockford, checksum, PIN coletivo e PIN de sessão.
- Adicionadas expiração, uso único, escopo, limite de tentativas e autorizações ECDSA.
- Gerados os cinco arquivos obrigatórios do EduAuth Professor.
- Mantido provisionamento de produção como pendência explícita.

## v2.0.0 — 29/07/2026

- Migração para IndexedDB e AES-GCM.
- Perfis locais, backup criptografado, bloqueio, expiração e recuperação administrativa.
- Central de entrega, evidência HTML, Classroom assistido e horário escolar.

## v1.6.0 — 29/07/2026

- Central de tutoriais, cursor virtual, spotlight e demonstrações das 13 ferramentas.
