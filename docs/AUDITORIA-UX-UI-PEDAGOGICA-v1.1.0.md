# Auditoria UX/UI + Pedagógica — Recuperações 2DS Sub v1.1.0

**Data:** 27/08/2026  
**Escopo:** Programação Front-End e Programação Mobile I — 2DS Subsequente  
**Valor:** 5,0 pontos por recuperação — 20 itens de 0,25 ponto.

## 1. Resultado executivo

A v1.0.0 tinha uma boa base de prova, mas apresentava uma incompatibilidade crítica com o modelo de aula desejado: a revisão era individual e cada estudante podia avançar por conta própria. A auditoria também encontrou problemas de qualidade em alguns distratores, baixa variedade de formatos em Mobile, risco de questões de ordenação serem marcadas como respondidas antes de interação, polling capaz de sobrescrever estado local, alvos pequenos no mapa de questões mobile, métricas contaminadas por tentativas anteriores e ausência de chat professor × aluno.

A v1.1.0 corrige esses pontos e reorganiza o fluxo em três momentos claramente separados:

1. **Revisão coletiva sincronizada:** professor controla tela e etapa; alunos espelham exatamente o mesmo conteúdo.
2. **Espera:** revisão encerrada; ninguém inicia a prova até o professor liberar.
3. **Prova individual:** cada aluno avança no próprio ritmo, com chat privado e acompanhamento docente.

### Nota de auditoria após correções

| Dimensão | v1.0.0 | v1.1.0 | Situação |
|---|---:|---:|---|
| Coerência pedagógica | 82/100 | **95/100** | Muito boa |
| Qualidade das questões | 80/100 | **93/100** | Muito boa |
| Qualidade dos distratores | 74/100 | **92/100** | Muito boa |
| Revisão/retomada | 58/100 | **96/100** | Excelente para uso guiado |
| UX aluno | 79/100 | **93/100** | Muito boa |
| UX professor | 72/100 | **95/100** | Muito boa |
| Acessibilidade/acomodações | 82/100 | **91/100** | Muito boa |
| Integridade técnica da prova | 73/100 | **94/100** | Muito boa |

> As notas acima representam uma auditoria heurística e técnica do fluxo e do código. Elas não substituem um teste de carga real com a turma e a infraestrutura de produção.

## 2. Auditoria da revisão e retomada

### Problema crítico encontrado na v1.0.0 — CORRIGIDO

O progresso de revisão era armazenado por aluno (`review_step`). Isso permitia que estudantes ficassem em telas diferentes, contrariando uma revisão conduzida pelo professor.

### Novo modelo v1.1.0

A sessão agora possui uma posição global:

- `review_card_index`: tela atual;
- `review_stage_index`: etapa de explicação dentro da tela;
- `review_revision`: versão da posição, usada para sincronização;
- `review_started_at` e `review_ended_at`: trilha de auditoria.

O professor controla **Anterior**, **Próxima etapa** e **Ir para tela**. O aluno não possui controle de avanço durante a revisão.

### Profundidade da revisão

**Front-End:** 9 telas × 3 etapas = **27 etapas guiadas**.  
**Mobile I:** 11 telas × 3 etapas = **33 etapas guiadas**.

Cada etapa possui:

- conceito curto;
- explicação detalhada, sem excesso de texto;
- exemplo prático;
- foco visual sincronizado;
- nota exclusiva para o professor completar oralmente;
- indicação de tela/etapa.

### Conteúdos Front-End retomados

- programação: entrada → processamento → saída;
- HTML, CSS e JavaScript e divisão de responsabilidades;
- HTML semântico;
- formulário e associação `label`/`input`;
- CSS, seletores, cascata, variáveis e Box Model;
- Flexbox e Grid;
- responsividade e media queries;
- VS Code, Git e GitHub;
- variável, `let` e `const` em JavaScript.

### Conteúdos Mobile retomados

- aplicativo Android e fluxo de interação;
- Kotlin e MainActivity;
- TextView, EditText e Button;
- `setOnClickListener`;
- `strings.xml`, `R.string` e `getString()`;
- API Build: fabricante, modelo, versão e SDK;
- UI x UX;
- feedback de interface;
- zona do polegar;
- Lei de Fitts;
- Lei de Hick;
- consistência;
- responsividade em mobile.

### Modo foco visual

A ilustração não é estática: a região correspondente ao conceito em explicação recebe destaque. Exemplos:

- entrada → processamento → saída;
- HTML → CSS → JS;
- `main`/`nav`/`section`/`article`;
- conteúdo → padding → border → margin;
- Flexbox → Grid;
- VS Code → Git → GitHub;
- toque → listener → código → feedback;
- strings.xml → R.string → getString();
- UI → UX;
- Fitts: alvo/tamanho/distância;
- Hick: excesso de escolhas → priorização.

## 3. Presença online na revisão

O painel docente exibe a lista da turma e diferencia aluno online/offline. A presença é baseada em heartbeat recente.

Correção adicional: o heartbeat só é enviado quando a página do aluno está visível. Assim, uma aba abandonada em segundo plano não permanece indefinidamente como “online”.

A atualização da revisão ocorre aproximadamente a cada **1,5 segundo**, proporcionando sincronização suficientemente rápida para condução em sala sem exigir WebSocket nesta versão.

## 4. Auditoria das questões

### Distribuição final

| Disciplina | Múltipla escolha | Associação | Ordenação | Total |
|---|---:|---:|---:|---:|
| Front-End | 17 | 1 | 2 | 20 |
| Mobile I | 16 | 2 | 2 | 20 |

A versão anterior de Mobile possuía 19 questões de múltipla escolha em 20. A variedade foi ampliada para reduzir monotonia e avaliar relações e sequência de raciocínio.

### Critérios usados na auditoria

Cada item foi analisado quanto a:

- alinhamento ao conteúdo realmente trabalhado;
- uma única resposta defensável;
- linguagem compatível com recuperação;
- ausência de pegadinha desnecessária;
- ausência de pista por tamanho ou construção gramatical;
- distratores conceitualmente plausíveis;
- equilíbrio entre memória, compreensão e aplicação;
- explicação de gabarito coerente;
- dica que orienta conceito sem entregar resposta.

### Ajustes relevantes feitos

- FE04 e FE05: alternativas de elementos semânticos ganharam descrições de função, reduzindo pista pelo tamanho da tag.
- FE09: distratores agora comparam propriedades CSS de espaçamento/layout, em vez de opções de outros assuntos.
- FE11/FE12: alternativas comparam estratégias reais de layout, exigindo entender Flexbox/Grid.
- FE13: distratores agora são comportamentos de layout plausíveis (fixo, zoom, rolagem) em vez de conceitos sem relação.
- FE17/FE18: alternativas ficaram restritas ao comportamento de `let`/`const`, reduzindo eliminação por assunto.
- MO02: transformada em associação de componentes e funções.
- MO03: distratores usam TextView/EditText/Button de forma plausível.
- MO05: transformada em associação da API Build.
- MO06: alternativas comparam propriedades da própria API Build.
- MO08: alternativas tratam consequências de entrada/validação em vez de misturar ergonomia e versão Android.
- MO10: removida pista gramatical e melhorado o contraste entre referência e recuperação de recurso.
- MO13: alternativas aproximadas em extensão e todas ligadas à avaliação de interface, reduzindo a resposta “mais completa = correta”.
- MO20: transformada em ordenação do fluxo de interação.

## 5. Auditoria das alternativas

### Embaralhamento

As alternativas de múltipla escolha são embaralhadas por aluno. Portanto, a letra correta não permanece fixa no modo aluno.

### Distribuição dos IDs corretos no catálogo

Antes do embaralhamento:

- Front-End (17 singles): A=4, B=7, C=4, D=2.
- Mobile (16 singles): A=6, B=6, C=1, D=3.

Como o backend embaralha as opções com seed individual, essa distribuição não se converte em padrão visível aos estudantes.

### Comprimento das alternativas

Após revisão, as alternativas foram aproximadas em extensão quando isso poderia virar pista. Em tags HTML, foram acrescentadas descrições funcionais equivalentes em vez de exibir apenas `<main>`, `<nav>`, etc.

## 6. Bugs e riscos técnicos auditados

| Severidade | Achado | Correção v1.1.0 |
|---|---|---|
| P0 | Revisão era autônoma por aluno | posição global controlada pelo professor |
| P0 | Questão de ordenar podia parecer respondida sem interação | propriedade `touched` obrigatória no front e backend |
| P0 | Polling podia sobrescrever resposta ainda não salva | respostas locais “dirty” não são substituídas pelo servidor |
| P0 | Simulador público poderia expor o gabarito por URL | simulador/gabarito removidos de `recuperacao/` e isolados em `tools/simulador-professor-local/` com aviso **NÃO PUBLICAR** |
| P1 | Métricas misturavam tentativas antigas | estatísticas usam somente a tentativa atual |
| P1 | Chat inexistente | chat privado professor × aluno com leitura/não lidas |
| P1 | Polling do chat podia apagar texto digitado | atualização suspensa enquanto textarea está sendo editada |
| P1 | Mapa de 20 questões tinha alvos pequenos em celular | 5 colunas e alvo mínimo de 44 px |
| P1 | Aviso offline prometia sincronização automática que não existia | texto corrigido: aluno não deve avançar até a conexão voltar |
| P1 | Professor podia iniciar prova direto da revisão | fluxo exige encerrar revisão → espera → iniciar prova |
| P2 | Associação sem rótulo acessível forte | label/aria adicionado aos selects |
| P2 | Sessão em rascunho criava membros como “revisão” | membros começam em espera até o professor iniciar |
| P2 | Presença podia permanecer ativa em aba oculta | heartbeat somente com página visível |

## 6.1 Segurança do gabarito e do simulador

A auditoria encontrou um risco crítico de empacotamento: a v1.0.0 mantinha `simulador.html` e `simulator-catalog.js` dentro da mesma árvore pública da recuperação. Mesmo que o aluno não recebesse um link para o simulador, um arquivo público com o gabarito poderia ser acessado diretamente por URL.

Na v1.1.0 funcional:

- `recuperacao/` não contém simulador, `answer_key` nem catálogo com respostas corretas;
- o gabarito da prova real é mantido apenas no backend/Edge Function;
- o simulador docente foi movido para `tools/simulador-professor-local/`;
- essa pasta contém `NAO-PUBLICAR.txt` e deve permanecer fora do host público;
- os arquivos públicos do aluno recebem apenas `public_config`, nunca `answer_key`.

Esse ponto é classificado como **P0**, pois a exposição de um arquivo de gabarito invalidaria a integridade da recuperação, mesmo com autenticação e tela cheia.

## 7. Chat professor × aluno

O chat fica disponível durante:

- revisão;
- tela de espera;
- prova em andamento;
- prova pausada.

Características:

- conversa privada por aluno;
- badge de mensagens não lidas no professor;
- histórico registrado na sessão;
- marcação de leitura;
- atalhos do aluno: dúvida de enunciado, problema técnico, orientação;
- atalhos do professor: orientar leitura, pista conceitual e suporte técnico;
- limite de 800 caracteres por mensagem;
- sem comunicação aluno × aluno.

### Regra pedagógica recomendada

O chat deve esclarecer **enunciado, vocabulário, funcionamento da interface ou dificuldade técnica**. Quando houver ajuda conceitual, a orientação deve apontar o princípio a considerar, sem eliminar alternativas ou indicar a resposta correta.

## 8. UX do aluno

### Revisão

- sem botões “próximo/anterior”;
- indicador “Revisão sincronizada com o professor”;
- conteúdo textual + visual espelhado;
- destaque do conceito em explicação;
- progresso por tela e etapa;
- chat disponível.

### Prova

- entrada explícita em modo prova;
- tela cheia;
- uma questão principal por vez;
- autosave ao avançar;
- mapa de questões com alvo touch adequado;
- status de respostas completas, sem revelar acerto/erro;
- checkpoints 5/10/15;
- chat acessível sem abandonar o documento da prova;
- acomodações individuais.

## 9. UX do professor

Durante a revisão:

- mesma tela do aluno;
- nota de apoio exclusiva para o docente;
- controle de etapa;
- salto para qualquer tela;
- quantidade de alunos online;
- lista nominal online/offline;
- acesso direto ao chat por aluno;
- avisos e efeitos coletivos.

Durante a prova:

- progresso individual;
- questão atual;
- respondidas;
- acertos/nota no painel privado;
- tempo médio;
- perda de foco/saída de tela cheia;
- questões críticas;
- ranking privado;
- chat;
- tempo extra;
- dica/ajuda;
- tentativa adicional;
- reabertura;
- remoção/restauração;
- acomodações.

## 10. Limitações conhecidas

1. **Sincronização por polling:** a revisão pode ter atraso de até aproximadamente 1,5 s. Para sala de aula é aceitável; WebSocket/Realtime seria evolução futura.
2. **Tela cheia não é bloqueio absoluto:** navegador web pode registrar saída/perda de foco, mas não impedir outro dispositivo ou todo uso de Alt+Tab.
3. **Arrastar no mobile:** HTML Drag and Drop varia entre navegadores touch. As setas permanecem como alternativa funcional e acessível.
4. **Sem áudio/TTS nesta versão:** a explicação do sistema é visual/textual por etapas. O professor complementa oralmente. TTS pode ser incluído depois se for desejado.
5. **Requer backend atualizado:** sincronização e chat dependem da migration 059 e da Edge Function v1.1.0.

## 11. Sequência recomendada para a aula

1. Professor abre as duas sessões em rascunho.
2. Inicia **Revisão guiada** da disciplina.
3. Confere quantidade de alunos online.
4. Avança etapa a etapa e complementa oralmente.
5. Usa chat/aviso se algum aluno reportar problema.
6. Pressiona **Encerrar revisão**.
7. Todos ficam na tela “Aguardando prova”.
8. Professor confirma organização da sala e pressiona **Iniciar prova**.
9. Cada aluno inicia e avança no próprio ritmo.
10. Professor acompanha métricas e chats sem expor ranking.
11. Encerrada a sessão, revisa questões críticas antes de publicar resultados.

## 12. Parecer final

A arquitetura v1.1.0 está pedagogicamente coerente com uma recuperação precedida por retomada coletiva. A principal melhoria é a separação rigorosa entre **ensino sincronizado** e **avaliação individual**. As questões estão mais equilibradas, os distratores exigem maior compreensão, o fluxo de revisão agora permite explicação gradual e o chat resolve a necessidade de comunicação sem interromper a prova inteira.

