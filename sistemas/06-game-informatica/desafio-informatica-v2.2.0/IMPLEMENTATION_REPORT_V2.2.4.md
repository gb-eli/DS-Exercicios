# Relatório de implementação — v2.2.4

## Objetivo

Disponibilizar ao professor a geração imediata da autorização individual solicitada quando um aluno precisa concluir a aula antes do tempo mínimo pedagógico.

## Fluxo implementado

1. O aluno abre **Solicitar liberação antecipada** e informa o motivo.
2. A plataforma cria um código-base `EA1-S1-K01` vinculado à sessão, perfil, aula, recurso e ação.
3. O professor cola o código no painel protegido.
4. O painel valida formato, checksum, modalidade, ação e expiração.
5. É produzido um PIN individual de 10 dígitos, válido por três minutos e de uso único.
6. O aluno digita o PIN na própria solicitação e conclui a atividade com a autorização registrada no comprovante.

## Segurança e limitações

- O painel continua protegido pela senha mestre da publicação.
- Códigos coletivos ou pertencentes a outras ações são recusados.
- Solicitações expiradas exigem geração de um novo código no computador do aluno.
- A autorização permanece vinculada àquela sessão; não existe senha geral de liberação.
- Como o projeto usa GitHub Pages, mantém-se a limitação de uma aplicação estática sem autenticação de servidor.

## Contingência

Foi entregue separadamente ao professor um gerador emergencial local. Esse arquivo não faz parte do pacote público e não deve ser publicado no GitHub Pages.

## Arquivos centrais

- `assets/js/teacher-codes.js`
- `assets/css/app.css`
- `professor.html`
- `tests/teacher-codes.test.mjs`
- `sw.js`
