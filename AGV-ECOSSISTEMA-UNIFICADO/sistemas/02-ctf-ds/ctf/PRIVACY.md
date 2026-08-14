# Política de Privacidade — linguagem simples

## Dados usados

A plataforma pode utilizar nome do aluno, turma, progresso, respostas, tentativas, configurações de acessibilidade, carteira virtual, inventário, histórico de exportações, aceite dos termos e eventos técnicos de integridade.

## Onde ficam

Os dados do perfil ficam criptografados no IndexedDB do próprio navegador. Não existe banco remoto obrigatório e os laboratórios não enviam respostas para servidor.

## Senha

A senha não é armazenada em texto puro. Ela protege uma chave local por PBKDF2; os dados são cifrados com AES-GCM.

## Retenção

O perfil expira após cinco dias sem atualização. O navegador ainda pode apagar dados por limpeza manual, política do equipamento, modo privado ou falta de espaço. Gere backups periódicos.

## Exportar, corrigir e excluir

O aluno pode exportar um backup criptografado, corrigir nome ou turma mediante senha, alterar a senha, bloquear a sessão e excluir o perfil do equipamento.

## O que não fazemos

Não usamos publicidade, rastreamento comercial, geolocalização, reconhecimento facial, biometria ou venda de dados. Não publicamos nome, imagem ou feedback do aluno automaticamente.
