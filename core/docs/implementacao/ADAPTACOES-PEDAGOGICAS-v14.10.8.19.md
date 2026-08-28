# Adaptações pedagógicas — v14.10.8.19

## Objetivo

Adicionar modos de apoio individualizados sem expor diagnóstico, laudo ou justificativa clínica no frontend.

## Modos

- **Guiado:** instruções mais diretas, etapas abertas e checklist de conclusão.
- **Reforçado:** uma etapa por vez, controles maiores, menos carga visual e checkpoints adicionais.
- **Motor/previsível:** controles ampliados, navegação por teclado e ausência de exigência de movimentos rápidos.
- **Estruturado com extensão:** organização previsível sem reduzir a complexidade; o aluno pode avançar mais rápido nas partes dominadas.
- **Estudo domiciliar:** roteiro assíncrono, retomada por etapas, salvamento contínuo e sessão protegida sem fullscreen obrigatório.

## Escolha do aluno

O aluno recebe um aviso de apoio e pode aceitar o modo adaptado ou permanecer no modo convencional. Quando autorizado, pode trocar de modo a qualquer momento. Para perfis definidos pelo professor como padrão adaptado, a interface já inicia no modo adaptado, preservando a possibilidade de troca.

A escolha passa a ser sincronizada na tabela `pedagogical_adaptation_preferences`, contendo somente a chave do perfil e `adapted`/`conventional`. O `localStorage` continua como fallback, mas a preferência acompanha o aluno em outro navegador/dispositivo.

## Privacidade

O repositório não contém a lista nominal de estudantes nem tipos de laudo. O GitHub recebe apenas a infraestrutura dos perfis. O vínculo individual é cadastrado diretamente no Supabase em `private.pedagogical_adaptation_roster`, fora do schema público exposto pelo PostgREST.

A tabela `student_accommodations` recebe somente `learning_mode` e configurações pedagógicas. O campo `reason` usa texto genérico e não registra diagnóstico.

## Acomodações globais

Acomodações com `exercise_id = null` passam a valer em todos os exercícios do aluno. Uma acomodação específica de exercício pode ter prioridade sobre a global.

## Estudo domiciliar

O modo domiciliar não elimina autenticação, sessão ou validações de backend. Ele altera apenas controles de supervisão incompatíveis com estudo assíncrono:

- fullscreen deixa de ser obrigatório;
- troca de guia não pausa o exercício;
- colagem não é bloqueada pelo monitor de supervisão;
- heurísticas de DevTools/entrada rápida deixam de ser aplicadas;
- bloqueio de rede externa, autenticação, sessão ativa, permissões, salvamento e autocorreção continuam ativos.

## Cadastro individual

Os dados individuais devem ser aplicados diretamente no Supabase após a migration `049_p10919_pedagogical_adaptations.sql`. O arquivo privado de seed não deve ser commitado no GitHub.


## Solicitação pelo aluno

Mesmo sem uma acomodação pré-cadastrada, o aluno pode usar **Solicitar adaptação** no ambiente da atividade. O pedido registra apenas a conta e o estado `pending`; não há campo para justificativa clínica ou informação sensível. Professor/Admin visualiza o pedido no detalhe do aluno e pode aplicar apoio guiado ou reforçado, ou encerrar o pedido.


## Compatibilidade com acomodações anteriores

A migration converte registros legados `adapted_mode` para `learning_mode`, preserva as configurações existentes e acrescenta o contrato mínimo (`profile_key`, escolha de modo e recursos). Isso evita que acomodações já cadastradas deixem de aparecer na nova interface.

## Situação das turmas no backend atual

Na preparação desta versão, o banco de produção possui as turmas `1DS-A-MANHA`, `2DS-A-MANHA`, `3DS-C-MANHA` e `DS-SUB-NOITE`. As turmas de Administração ainda não estão cadastradas nesse projeto Supabase.

Por isso, os perfis individuais de 2ADM ficam preparados no seed privado, mas só serão aplicados quando a turma correspondente e o vínculo do aluno existirem no banco. Para 1ADM não foi criado perfil nominal, pois a fonte fornecida não traz estudante identificado dessa turma. O botão **Solicitar adaptação** permanece disponível para qualquer aluno autenticado, inclusive alunos sem perfil pré-cadastrado.


## Revisão R3 — ajuda extra e passo a passo

O modo adaptado passa a oferecer, quando habilitado no perfil individual:

- uma etapa atual destacada visualmente;
- microinstrução `ler → fazer → executar/conferir → marcar`;
- ajuda extra recolhível, que o aluno pode abrir ou fechar quando quiser;
- explicação do objetivo e do conteúdo em linguagem direta;
- glossário de termos de programação quando o exercício possui conceitos catalogados;
- orientação para trabalhar com os arquivos e depurar código sem entregar a solução pronta;
- controles maiores quando o perfil pedagógico solicitar;
- escolha persistente entre modo adaptado e convencional.

### Estudo domiciliar

O perfil domiciliar recebe uma estrutura mais detalhada: organização antes de começar, execução por pequenas partes, explicação de termos, ajuda por arquivo/código, checkpoints, orientação para retomada e revisão antes do envio. A ajuda continua opcional e pode ser ocultada a qualquer momento.

Os vínculos nominais permanecem exclusivamente no seed privado do Supabase. Este documento público não contém nomes de estudantes nem informações clínicas.
