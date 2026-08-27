# Auditoria — Persistência e integridade de estado do workspace — v14.10.3

Data: 19/08/2026  
Base auditada: v14.10.2  
Release candidata: v14.10.3  
UI Atividades: 0.22.3

## Escopo da fase

Esta fase revisou troca de arquivos, autosave, salvamento manual, recuperação após recarga, saída/retorno ao dashboard, download individual, ZIP dos códigos, Preview com conteúdo ainda não sincronizado e concorrência ao abrir exercícios.

## Problemas encontrados e corrigidos

### 1. Rascunho legado podia ser ignorado
Versões antigas podiam deixar no `localStorage` uma cópia sem `savedAt` e sem `remoteRevision`. Como o algoritmo antigo recuperava somente quando o timestamp local era comprovadamente mais novo, esse rascunho divergente podia ser ignorado.

Correção: caches legados divergentes agora são recuperados. Uma cópia local que já havia sido sincronizada normalmente é removida após a confirmação do servidor, portanto um cache legado remanescente é tratado de forma conservadora como trabalho não sincronizado.

### 2. Clock skew entre navegador e servidor
A recuperação v2 dependia principalmente de relógio local versus `saved_at` do servidor. Um computador com relógio atrasado podia ter um rascunho real não recuperado.

Correção: `remoteRevision` é o primeiro sinal. Se o rascunho foi criado sobre a mesma revisão remota e diverge do servidor, ele é recuperado mesmo com relógio local atrasado. Timestamp fica como critério complementar quando o servidor já avançou de revisão.

### 3. Saída do workspace sem barreira final de todas as filas
A desmontagem salvava o arquivo ativo, porém não aguardava explicitamente todas as filas já existentes antes de encerrar supervisão e limpar o estado.

Correção: `unmountWorkspace()` chama `waitForPendingSaves()` antes de `stopSupervision()` e só então limpa `saveQueues` e `state.active`.

### 4. Abertura concorrente por clique duplo
Dois acionamentos quase simultâneos em um exercício podiam iniciar montagens concorrentes do workspace.

Correção: `exerciseOpening` impede segunda abertura enquanto a primeira ainda está em andamento. Se `mountWorkspace()` falhar, `unmountWorkspace()` é executado antes de liberar novamente a navegação.

## Comportamentos preservados e verificados

- autosave grava cópia local imediatamente e envia à nuvem após debounce de 1,2 s;
- troca de arquivo aguarda salvamento do arquivo anterior;
- `save_all` espera filas pendentes antes de exportar;
- download do arquivo atual usa o conteúdo atual do editor;
- ZIP contém somente arquivos do aluno e nunca inclui referência/gabarito;
- Preview usa o conteúdo atual do arquivo ativo, mesmo antes da resposta de autosave;
- `beforeunload`, `pagehide` e `visibilitychange` preservam rascunho local;
- cache é separado por aluno + exercício + filename;
- histórico restaurado entra novamente no fluxo normal de autosave;
- GitHub/Classroom continuam salvando antes de abrir.

## Regressão

- Teste específico P10.3: 7/7 aprovado.
- Suíte completa: 176/176 aprovada.
- JavaScript verificado por `node --check`: 712 arquivos, 0 erros.
- JSON parseado: 440 arquivos, 0 erros.

## Backend

Nenhuma alteração de banco ou Edge Function foi necessária nesta fase. O backend de produção permanece o mesmo confirmado na v14.10.1/v14.10.2.

## Publicação

`PUBLIC-DEPLOY-DS-v14.10.3.zip` contém somente a camada estática necessária ao host. Pastas de testes, ferramentas internas, migrations e Edge Functions permanecem somente no pacote completo auditado.
