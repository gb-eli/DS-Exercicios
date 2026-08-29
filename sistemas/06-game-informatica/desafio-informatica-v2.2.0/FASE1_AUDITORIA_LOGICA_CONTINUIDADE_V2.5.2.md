# Fase 1 — Auditoria de lógica, continuidade e preservação dos dados

**Projeto auditado:** Desafio de Informática AGV  
**Versão:** 2.5.2  
**Data:** 04/08/2026  
**Escopo:** perfis, IndexedDB, checkpoint redundante, retomada, cronômetros, conclusão, PDF, diagnóstico, múltiplas abas e atualização do service worker.

## Resultado geral

A suíte oficial passou integralmente: 13 aulas, 41 arquivos JavaScript, contas, retenção, retomada, PDF, senhas, ferramentas, avaliações e entrega. Entretanto, a análise de cenários de falha encontrou problemas de continuidade que não são cobertos pelos testes atuais.

## Achados críticos

### C1 — Cópia redundante mais nova pode ser substituída por uma cópia antiga do IndexedDB

**Cenário de reprodução:**
1. O perfil está salvo no IndexedDB às 10:00.
2. Às 10:10, o IndexedDB falha, mas o checkpoint redundante do `localStorage` é atualizado com o progresso novo.
3. O navegador é reaberto e o IndexedDB volta a funcionar, ainda contendo a cópia das 10:00.
4. A inicialização prefere o registro do IndexedDB apenas porque ele existe, sem comparar `updatedAt`.
5. A cópia antiga pode sobrescrever o checkpoint redundante das 10:10.

**Impacto:** perda de etapas, tempo, conclusão ou entrega justamente depois de uma falha temporária de armazenamento.

**Origem:** `getRecord()` e `listValidProfiles()` não escolhem o registro mais recente entre IndexedDB e checkpoint redundante.

**Correção recomendada:** comparar revisão e `updatedAt`; escolher sempre o registro mais novo; sincronizar o mais novo para o armazenamento desatualizado; nunca sobrescrever uma cópia nova por uma antiga.

---

### C2 — Duas abas abertas podem apagar o progresso mais recente

**Cenário de reprodução:**
1. O mesmo aluno desbloqueia o perfil em duas abas.
2. Na aba A, conclui uma atividade.
3. A aba B continua com uma cópia antiga do perfil.
4. Ao salvar ou bloquear por inatividade, a aba B grava o perfil inteiro antigo por cima do perfil concluído.

**Impacto:** a conclusão, o tempo, documentos ou resultados da aba A podem desaparecer.

**Origem:** gravação de todo o perfil sem controle de revisão, trava de edição ou detecção de conflito entre abas.

**Correção recomendada:** `BroadcastChannel`/evento de armazenamento, identificador da aba, contador de revisão e bloqueio de gravação quando outra aba possui versão mais nova; oferecer “recarregar progresso mais recente”.

---

### C3 — A tela final para o cronômetro e pode recriar a sensação de tempo reiniciado

**Cenário de reprodução:**
1. O aluno termina todas as missões com 10 minutos ativos.
2. A plataforma abre “Revise e conclua a atividade” e executa `stopTimer()`.
3. O aluno fica três minutos nessa tela.
4. Ao clicar em “Concluir atividade”, o sistema ainda considera somente 10 minutos e agenda mais 2min30s para liberar o PDF.

**Impacto:** o estudante espera, mas esse tempo não é contado. Isso pode parecer exatamente o bug de o contador recomeçar.

**Origem:** `gateEnteredAt` existe no estado, mas não é utilizado; o cronômetro é interrompido antes de registrar a conclusão.

**Correção recomendada:** registrar a atividade como concluída ao entrar na tela final e criar imediatamente um `pdfReleaseAt` absoluto; o botão deve apenas processar/abrir o fluxo de entrega. Alternativamente, continuar contando o tempo na tela final.

---

## Achados de alta prioridade

### A1 — Salvamentos críticos não são aguardados antes de mudar de tela

A conclusão da aula chama `saveRuntime()` e `flushStorage()` sem aguardar a finalização. O diagnóstico também chama `saveResult()` e `clearDiagnosticProgress()` e muda de tela imediatamente.

**Risco:** fechar a aba durante a animação, logo após concluir ou durante atualização automática pode perder o último estado.

**Correção recomendada:** tornar os fluxos finais assíncronos, aguardar a persistência, confirmar releitura do registro e somente depois abrir a tela de resultado.

---

### A2 — O checkpoint de emergência funciona apenas na aba atual

O checkpoint guiado é gravado em `sessionStorage`.

**Consequência:** ele sobrevive ao F5, mas é removido ao fechar a aba ou o navegador. Se o IndexedDB ainda não terminou de gravar, o último passo pode ser perdido.

**Correção recomendada:** checkpoint local mínimo e temporário, com revisão, perfil, aula, etapa, tempo e estado final; evitar respostas e dados sensíveis em texto aberto; remover após confirmar a gravação criptografada.

---

### A3 — Resposta do diagnóstico pode ser duplicada se houver recarga durante o feedback

A resposta é salva antes de o índice da questão ser incrementado. Existe uma janela de aproximadamente 0,6 a 1,45 segundo em que:

- a resposta já está em `answers`;
- `index` ainda aponta para a mesma questão.

Se a página recarregar nesse momento, a mesma questão aparece novamente e pode gerar uma resposta duplicada.

**Correção recomendada:** salvar resposta e próximo índice em uma única atualização atômica; na retomada, reconciliar `index` com as respostas já registradas por `questionId`.

---

### A4 — Atualização do service worker pode recarregar uma atividade em andamento

O novo service worker usa `skipWaiting`, assume os clientes e o aplicativo recarrega imediatamente em `controllerchange`.

**Risco:** se uma nova versão for publicada durante uma aula, o navegador pode atualizar a página sem o aluno solicitar. Isso agrava as janelas de salvamento e pode misturar revisão curricular e checkpoint.

**Correção recomendada:** não atualizar automaticamente durante aula/diagnóstico; mostrar “Nova versão disponível — atualizar depois de salvar”; aplicar a atualização na tela inicial ou após logout.

---

## Achados médios

### M1 — “Verificar meu progresso” faz uma comparação superficial

A verificação considera consistente quando:

- o ID do perfil coincide; e
- a quantidade de aulas no objeto `progress` é igual.

Ela não compara etapa, tempo, conclusão, revisão, resultado ou hash. Duas cópias diferentes podem ser exibidas como consistentes.

**Correção recomendada:** comparar hash/revisão do payload, `updatedAt`, aulas concluídas, etapa atual, `completion.id` e quantidade de resultados.

---

### M2 — Escritas do IndexedDB não aguardam o término da transação

O código considera a operação concluída quando o pedido `put()` dispara sucesso, sem aguardar `transaction.oncomplete`.

**Risco:** o status visual pode indicar “Salvo” antes da confirmação definitiva da transação.

**Correção recomendada:** aguardar simultaneamente o pedido e a conclusão da transação; tratar `abort` e `error` da transação.

---

### M3 — Perfil recém-criado depende de nova interação para ativar o bloqueio por inatividade

O temporizador de bloqueio é acionado por eventos globais. Após criar um perfil, não há chamada explícita em todos os caminhos para iniciar o relógio de inatividade.

**Correção recomendada:** iniciar/reiniciar o relógio após criar, proteger, importar ou desbloquear um perfil.

## Testes adicionais recomendados

1. Falha no IndexedDB seguida de recuperação com cópia redundante mais nova.
2. Duas abas salvando o mesmo perfil em ordens diferentes.
3. Fechar a aba imediatamente após concluir a última missão.
4. Permanecer cinco minutos na tela “Concluir atividade”.
5. Recarregar durante o feedback de uma questão diagnóstica.
6. Publicar nova versão enquanto uma aula está aberta.
7. Comparar payloads divergentes com a mesma quantidade de aulas.
8. Simular aborto de transação depois do `put()`.
9. Retomar após fechar completamente o navegador.
10. Confirmar que a conclusão e o horário absoluto do PDF nunca retrocedem.

## Opções de implementação

### 100%
Corrige todos os achados C1–C3, A1–A4 e M1–M3, adicionando testes de regressão completos.

### Parcial recomendada
Corrige C1, C2, C3, A1, A2, A3 e M1. Mantém a atualização automática do service worker e deixa melhorias de transação/inatividade para uma fase técnica posterior.

### Mínima de emergência
Corrige somente C1, C3, A1 e A3 — os riscos mais prováveis para a próxima aula.

## Estado da versão auditada

Nenhum arquivo do projeto foi alterado nesta auditoria. A versão publicada continua sendo a 2.5.2 até a aprovação do conjunto de correções.
