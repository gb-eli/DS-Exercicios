# Relatório de integração — EduAuth Offline v2.5.0

## Estado atual

A plataforma é estática e publicada no GitHub Pages. O EduAuth funciona localmente com chaves de desenvolvimento e possui quatro ações:

| Ação | Modalidade atual | Regra |
|---|---|---|
| Iniciar aula | `CLASS_SHARED_PIN` | senha fixa por turma e aula, `timeSlot = 0` |
| Liberar resultado | `CLASS_SHARED_PIN` | código coletivo por turma e hora |
| Liberar comprovante PDF | `CLASS_SHARED_PIN` | código coletivo por turma e hora |
| Recuperar perfil | `SESSION_SCOPED_PIN` + envelope | solicitação individual de 3 minutos |

## Senha fixa da aula

O protocolo ainda preserva, por compatibilidade técnica, o mecanismo legado de senha por aula. Desde a versão 2.5.7 ele não é chamado pela interface do estudante; todas as aulas estão abertas. O mecanismo legado era derivado do contexto:

- plataforma;
- turma;
- disciplina;
- aula;
- ação;
- política;
- recurso.

Data e hora não entram no contexto da senha da aula. Assim, a mesma aula conserva o mesmo código em aplicações futuras. A senha de uma aula não funciona em outra turma ou aula.

## Código coletivo de liberação

A liberação antecipada usa:

- turma atual;
- data/hora UTC correspondente à hora atual;
- atividade `class-release`;
- ação `result-release` ou `early-completion`;
- PIN de 8 dígitos.

O código é compartilhado pelos alunos da mesma turma durante aquela hora e muda ao trocar turma ou hora.

## Progresso

A autorização coletiva não substitui o progresso. Ela apenas libera o PDF ou resultado. A aula é registrada como concluída assim que todas as etapas terminam, e o horário automático do PDF fica persistido no perfil.

## Segurança e limitações

- HMAC-SHA-256 para PINs;
- comparação sem indicar acertos parciais;
- código diferente por contexto;
- painel do professor protegido por verificador PBKDF2;
- chave privada ausente do frontend;
- recuperação de perfil por envelope RSA-OAEP.

As chaves HMAC de desenvolvimento ficam no frontend e, portanto, não oferecem a mesma proteção de um backend institucional. Antes de produção, devem ser provisionadas e rotacionadas pelo EduAuth Professor.

## Testes

A suíte valida:

- senha fixa em datas diferentes;
- separação entre aulas e turmas;
- código coletivo válido somente na hora atual;
- mudança do código entre turmas e horas;
- recuperação individual e expiração;
- assinatura e criptografia dos perfis.
