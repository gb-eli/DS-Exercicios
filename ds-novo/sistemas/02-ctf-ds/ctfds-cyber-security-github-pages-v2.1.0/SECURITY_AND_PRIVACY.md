# Segurança e privacidade

## Dados armazenados

O perfil pode conter nome, turma, progresso, respostas, configurações, evidências, histórico de exportações e auditoria.

No navegador compatível, esses dados são criptografados antes de serem gravados no IndexedDB. A lista de perfis mostra somente nome reduzido, turma, último acesso e expiração.

## Senhas

- A senha não é armazenada em texto puro.
- PBKDF2-HMAC-SHA-256 deriva a chave de proteção.
- Cada perfil utiliza salt aleatório.
- AES-GCM fornece confidencialidade e autenticação.
- Não use senha do Google, Classroom, e-mail, banco ou GitHub.

## Computadores compartilhados

Use **Sair e bloquear**. A ação remove a chave de descriptografia da memória e mantém somente o envelope criptografado.

## Recuperação administrativa

A recuperação depende de:

- perfil protegido pela chave pública configurada;
- arquivo administrativo correto;
- frase-senha mestre correta;
- confirmação de identidade e motivo.

A senha antiga nunca é mostrada. Não existe entrada secreta.

## Limitações

O navegador pode remover dados por limpeza manual, modo privado, falta de espaço, reinstalação ou política institucional. Exporte backups regularmente.

A cadeia de auditoria permite detectar inconsistências, mas não é absolutamente imutável em um site sem backend.

## Laboratórios

Todos os cenários são fictícios e locais. A plataforma não autoriza testes em sistemas externos.

## EduAuth Offline

A integração EduAuth elimina a necessidade de senha administrativa fixa, mas não transforma uma aplicação frontend em um servidor seguro.

- PIN coletivo e PIN de sessão usam HMAC-SHA-256.
- Ações críticas usam autorização ECDSA assinada.
- A chave privada de assinatura nunca fica no repositório.
- As chaves HMAC entregues nesta versão são somente de teste.
- O código-base pode ser mostrado publicamente; ele não é a senha.
- O QR Code é opcional e gerado localmente.
- A plataforma não registra PIN digitado, PIN esperado, segredo ou HMAC completo.
- Logs EduAuth são locais e podem ser apagados pelo navegador.
- O provisionamento de produção deve ocorrer antes do uso real.
