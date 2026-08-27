# Política de Privacidade — linguagem simples

**Plataforma:** Desafio de Informática AGV  
**Versão:** 1.0.0  
**Atualização:** 30/07/2026

## O que é utilizado

A plataforma utiliza somente os dados necessários para identificar o perfil local, registrar progresso, respostas, resultados, aceites, exportações e autorizações do professor relacionadas à atividade.

## Onde os dados ficam

Os perfis protegidos permanecem no navegador, em IndexedDB, criptografados com Web Crypto API. Resultados e backups somente saem do dispositivo quando o usuário escolhe exportar um arquivo ou abrir um serviço externo, como o Google Classroom.

## O que não é solicitado

Esta versão não solicita câmera, microfone, localização, biometria, reconhecimento facial, contatos nem publicidade. Não vende dados e não cria perfil comercial.

## Tempo de permanência

O perfil local é renovado por até 10 dias após cada salvamento bem-sucedido. A plataforma mantém uma cópia criptografada no IndexedDB e um checkpoint redundante local quando o navegador permite. Modo privado, políticas do equipamento, limite de armazenamento ou limpeza manual ainda podem apagar os dados antes desse período; por isso, resultados importantes devem ser exportados em backup.

## Controle do estudante

O estudante pode consultar os aceites, exportar backup, remover o próprio perfil do equipamento e continuar em sessão temporária. A exclusão local não apaga arquivos que já tenham sido enviados ao Classroom ou guardados em outro local.

## Permissões e arquivos

Seleção de arquivo, download, cópia para área de transferência e síntese de voz acontecem somente após uma ação explícita do usuário. Consulte `PERMISSIONS.md`.

## Limitações

A aplicação é totalmente front-end. Logs locais e tokens de integridade detectam inconsistências comuns, mas não equivalem a auditoria central ou assinatura de servidor.

## Responsabilidade e revisão

Idealização e validação pedagógica: Professor Gabriel. Esta política deve ser revisada pela equipe pedagógica ou responsável institucional antes de publicação oficial, especialmente quando usada com estudantes menores de idade.
