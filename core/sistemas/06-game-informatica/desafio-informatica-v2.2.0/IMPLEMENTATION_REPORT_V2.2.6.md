# Relatório de implementação — v2.2.6

Data: 03/08/2026

## Escopo da fase

A versão 2.2.6 ativa a primeira fase do plano de evolução: **Central de Contas, aceite assistido dos termos e identificação inequívoca das aulas**. A prioridade foi tornar seguro e prático o uso de notebooks compartilhados por vários estudantes sem misturar progresso, resultados ou sessões.

## Central de Contas

Foram implementados:

- conta atual sempre identificada;
- lista dos demais perfis salvos no dispositivo;
- entrada com senha individual;
- troca de estudante com salvamento e bloqueio prévios;
- saída e bloqueio sem perda de dados;
- criação de novo estudante sem sobrescrever a conta anterior;
- sessão temporária com opção de proteção ou descarte;
- exportação e importação de backup protegido;
- exclusão controlada mediante a senha do perfil;
- resumo não sensível de aulas concluídas, em andamento e registros.

Nenhum perfil protegido é desbloqueado automaticamente ao atualizar ou reabrir a plataforma.

## Correção da exclusão

Durante os testes foi identificado um risco de o encerramento normal salvar novamente um perfil logo após sua exclusão. O fluxo foi alterado para:

1. validar a senha;
2. concluir a fila de gravações pendentes;
3. remover o registro do IndexedDB;
4. limpar a sessão em memória sem executar novo salvamento;
5. atualizar a lista de contas.

## Termos

O aceite recebeu:

- botão **Ir até o final do termo**;
- indicador visual de leitura;
- marcador acessível no fim do documento;
- botão **Marcar todos como aceitos** inicialmente desativado;
- liberação do aceite conjunto somente após alcançar o fim;
- manutenção das caixas individuais;
- registro do método de aceite, leitura final e marcação conjunta.

A plataforma não aceita termos silenciosamente nem marca confirmações antes da ação do estudante.

## Identificação da aula

O catálogo e o ambiente guiado agora informam:

- turma;
- turno;
- número da aula;
- total de aulas da trilha;
- estado da aula;
- comando **Continuar do ponto salvo** para sessões em andamento.

## Persistência e privacidade

Os dados de cada perfil continuam criptografados com PBKDF2-HMAC-SHA-256 e AES-GCM. A lista de seleção utiliza somente metadados mínimos necessários para reconhecer o estudante e o estado geral do progresso; respostas detalhadas e resultados permanecem dentro do cofre criptografado.

## Responsividade

A Central de Contas e o fluxo de termos receberam regras específicas para:

- celulares de 320 a 430 px;
- iPhone e Android;
- tablets;
- notebooks;
- computadores de mesa;
- botões empilhados e áreas de toque ampliadas em telas pequenas.

## Testes

O pacote passou por:

- validação estática de 10 aulas e 35 módulos JavaScript;
- testes de segurança, termos e privacidade;
- testes de PDFs;
- 19 testes EduAuth;
- 6 testes dos geradores do professor;
- auditoria de 248 questões guiadas e 68 diagnósticas;
- testes de cronômetro, checkpoint, retomada e tutorial;
- testes dedicados de troca, bloqueio, exclusão e aceite assistido.

A navegação visual automatizada em `localhost` e `file://` foi bloqueada pelas políticas administrativas do navegador disponível no ambiente de execução. A sintaxe, estrutura, imports, estados e fluxos foram validados automaticamente; recomenda-se a conferência rápida no endereço final do GitHub Pages após a publicação.

## Publicação

O caminho público existente foi preservado. Na atualização modular, publique o arquivo `sw.js` por último e faça uma atualização forçada antes do primeiro teste.
