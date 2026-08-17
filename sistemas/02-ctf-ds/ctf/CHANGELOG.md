# Histórico de versões

## v3.2.0 — 03/08/2026

### Estabilização, atualização segura e acabamento

- Criado fluxo de atualização segura do Service Worker com salvamento antes da ativação.
- Navegação e manifesto de versão usam network-first; módulos estáticos permanecem consistentes no cache versionado.
- Adicionado diagnóstico local de CPU, memória, WebGL, armazenamento, conexão e benchmark.
- Qualidade recomendada pode ser aplicada ao perfil sem envio de informações para servidores.
- Modo imersivo recebeu tela cheia, tentativa opcional de paisagem, aviso de orientação e safe areas.
- Perda de contexto WebGL e FPS crítico persistente acionam recuperação ou fallback 2D.
- Histórico imersivo registra FPS, escala e orientação.
- Revisadas fontes pequenas, foco de teclado, HUD, mobile e legibilidade do painel investigativo.
- Perfil migrado para schema 15, workspace versão 9 e rascunho versão 8.

**Validação pedagógica e funcional:** Professor Gabriel  
**Apoio:** ChatGPT — GPT-5.6 Thinking

## v3.1.0 — 03/08/2026

- Concluída a migração das 68 missões para o Investigative Workspace.
- Criados 28 casos específicos para web, defesa, finanças, Web3, mobile, cloud, código seguro, reversão e resposta a ransomware.
- Ampliada a camada imersiva para oito ambientes procedurais e 55 associações com missões.
- Adicionados laboratório AppSec, cofre forense e centro mobile com fallback 2D.
- Implementada adaptação dinâmica de resolução e partículas no modo Automático.
- Renderização pausada quando a página está oculta ou a cena está fora da área visível.
- Adicionado encerramento integral da campanha após a última operação.
- Perfil migrado para schema 14, workspace para versão 8 e rascunho para versão 7.

## v2.9.0 — 03/08/2026

### Simulation Suite

- Convertidas mais dez missões, totalizando quarenta casos investigativos e 28 missões preservadas no formato anterior.
- Adicionados simuladores locais de e-mail, navegador, celular, logs, scanner de rede fictício e central SOC.
- Criadas interfaces profissionais responsivas com resultados textuais equivalentes para acessibilidade.
- O scanner utiliza somente endereços reservados; nenhuma ferramenta executa requisição, varredura, rastreamento ou comunicação real.
- O uso dos simuladores passou a integrar o rascunho criptografado e o percurso investigativo.
- Adicionados cenários de fraude, blockchain fictícia, mobile, cloud, forense, cabeçalhos, autenticação, domínio de e-mail e redes.
- Service Worker atualizado para os novos módulos e documentação da Simulation Suite.
- Perfil migrado para schema 12.

**Validação pedagógica e funcional:** Professor Gabriel  
**Apoio:** ChatGPT — GPT-5.6 Thinking

## v2.8.0 — 03/08/2026

### Narrative Engine e campanha contínua

- Convertidas mais dez missões, totalizando trinta casos investigativos e 38 missões preservadas no formato anterior.
- Criados sete arcos narrativos alinhados aos blocos da campanha.
- Adicionada uma equipe fictícia recorrente com funções distintas na investigação.
- Adicionadas aberturas curtas e puláveis, canal de operação com comunicações progressivas e encerramentos contextuais.
- Decisões anteriores passam a produzir retornos narrativos nas missões seguintes, sem alterar resposta, nota, XP ou recompensa.
- Criadas variações determinísticas de posto, turno e codinome por perfil, sem diferença de dificuldade.
- O perfil foi migrado para schema 11 e o workspace investigativo para versão 5.

**Validação pedagógica e funcional:** Professor Gabriel  
**Apoio:** ChatGPT — GPT-5.6 Thinking

## v2.7.0 — 03/08/2026

### Investigação avançada

- Convertidas mais dez missões, totalizando vinte casos investigativos e 48 missões preservadas no formato anterior.
- Adicionados materiais principais, confirmatórios, contextuais e contraditórios.
- Criado mural com anotação, confiança e relação de cada evidência com a hipótese.
- Adicionadas linhas do tempo visuais operáveis por botões e teclado.
- Adicionadas decisões revisáveis com consequências educativas, sem punições definitivas.
- Criadas quatro camadas de ajuda progressiva e pedidos de apoio registrados somente no perfil local.
- Implementada liberação progressiva de documentos, registros, comunicações e arquivos por ações coerentes.
- Adicionadas animações contextuais leves de resolução para os casos avançados.
- Perfil migrado para schema 10 e rascunho investigativo para versão 4.

**Validação pedagógica e funcional:** Professor Gabriel  
**Apoio:** ChatGPT — GPT-5.6 Thinking

## v2.6.1 — 03/08/2026

### Estabilização do Investigative Workspace

- Adicionado percurso mínimo configurável para os dez casos piloto: materiais, ferramenta, evidências e análise conforme a missão.
- A resposta permanece salva quando o percurso ainda está incompleto; o sistema orienta o próximo passo sem contabilizar tentativa incorreta.
- Implementado carregamento verdadeiramente sob demanda e liberação do caso da memória ao fechar a missão.
- Adicionado cronômetro de tempo ativo, com pausa por inatividade ou página oculta e sem uso automático como nota.
- Adicionada proteção do mesmo perfil contra edição simultânea em duas abas, com opção consciente de assumir a sessão.
- Gavetas agrupadas no celular em Caso, Investigação, Análise e Ajuda.
- Rascunho investigativo atualizado, migração para schema 9, cache offline revisado e comando `npm test` adicionado.

**Validação pedagógica e funcional:** Professor Gabriel  
**Apoio:** ChatGPT — GPT-5.6 Thinking

## v2.6.0 — 03/08/2026

### Investigative Workspace

- Convertidas dez missões piloto para casos investigativos com gavetas e conteúdo sob demanda.
- Adicionados documentos, registros, comunicações, arquivos, ferramentas e mural de evidências.
- Adicionados hipótese, linha do tempo, recomendação e conclusão persistentes por perfil.
- Criado layout de três áreas no computador e fluxo adaptado para celular.
- Preservadas as outras 58 missões para migração gradual após validação em sala.
- Pacotes investigativos ofuscados para reduzir buscas casuais por pistas publicadas.

**Validação pedagógica e funcional:** Professor Gabriel  
**Apoio:** ChatGPT — GPT-5.6 Thinking

## v2.5.0 — 03/08/2026

### Blocos e checkpoints

- Reorganizadas as 68 missões em sete pacotes: seis blocos de dez e um bloco final de oito.
- Adicionada progressão por bloco, com os pacotes futuros bloqueados até a conclusão do anterior.
- Adicionado checkpoint automático ao final de cada pacote.
- O relatório do checkpoint mostra conclusão, precisão, média de estrelas, tentativas, pistas, testes locais e uso de ferramentas.
- Cada checkpoint concede uma única vez XP, Cyber Coins, estrelas e um emblema temático, todos registrados no extrato.
- Adicionada consulta dos checkpoints no dashboard, na Central de Missões, no perfil e na evidência exportada.
- Filtros por área técnica foram preservados como forma secundária de exploração.
- Perfis antigos mantêm as missões já concluídas e podem consultar ou resgatar checkpoints concluídos.

**Validação pedagógica e funcional:** Professor Gabriel  
**Apoio:** ChatGPT — GPT-5.6 Thinking

## v2.4.0 — 03/08/2026

### Central de Missões e continuidade

- Reorganizado o layout das missões com objetivo principal em destaque, instruções em etapas e melhor aproveitamento da tela no computador.
- Adicionados busca, filtros por status, navegação por trilhas e card de retomada.
- Modo guiado revisado para ensinar o uso da ferramenta sem fornecer resposta, entrada específica ou deslocamento pronto.
- Rascunhos de respostas, evidências, testes e ferramentas passaram a ser salvos por perfil criptografado.
- Separados os controles de trocar conta, sair, limpar cache, limpar rascunhos, reiniciar progresso e excluir perfil.
- Corrigida a primeira missão para revelar o artefato somente após a ação solicitada.

**Validação pedagógica e funcional:** Professor Gabriel  
**Apoio:** ChatGPT — GPT-5.6 Thinking

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
