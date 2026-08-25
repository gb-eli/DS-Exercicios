# Contingência de recuperação de senha — v14.10.8.19.1

Enquanto o serviço de envio de e-mail (Resend) não estiver operacional, o Portal de Exercícios usa um fluxo temporário de recuperação por **e-mail institucional + CGM**.

## Fluxo

1. O aluno seleciona **Esqueci minha senha**.
2. Informa e-mail institucional e CGM.
3. O frontend chama a Edge Function `temporary-cgm-password-reset`.
4. O servidor valida a conta, o CGM inicial e limites de tentativa.
5. Se os dados conferirem, a senha é redefinida para o CGM inicial.
6. Sessões antigas são revogadas e `must_change_password` volta para `true`.
7. No próximo acesso, o aluno deve cadastrar uma senha pessoal.

O frontend não recebe service role e não executa APIs administrativas. A resposta para dados incorretos é deliberadamente genérica para não confirmar existência de conta nem CGM.

## Estado verificado em 25/08/2026

- `temporary-cgm-password-reset`: **ACTIVE**, versão 1.
- 104 contas ativas de alunos.
- 99 possuem CGM inicial recuperável.
- 5 não possuem CGM recuperável e pertencem ao `DS-SUB-NOITE`.

Esses cinco casos exigem cadastro do CGM correto; nenhum valor deve ser inventado.

## Retorno ao fluxo por e-mail

Quando o Resend estiver configurado, o formulário temporário pode ser retirado e a recuperação por link voltar a usar a rota pública `/reset-password/`, que permanece no repositório.
