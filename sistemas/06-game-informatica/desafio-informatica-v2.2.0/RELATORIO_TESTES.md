# Relatório de testes — v2.5.7

## Escopo

Validação da remoção das senhas de entrada das aulas e da redução do tempo mínimo do comprovante para cinco minutos.

## Resultados

- 13 aulas carregadas e validadas;
- 42 arquivos JavaScript aprovados na validação estática;
- acesso direto às aulas do 1º e 2º ADM sem modal EduAuth;
- aceite dos termos preservado;
- tempo mínimo do comprovante confirmado em 5 minutos;
- conclusão imediata e horário absoluto do PDF preservados;
- código coletivo opcional por turma/hora validado;
- senha do perfil do aluno e senha mestre do painel preservadas;
- retomada, duas abas, IndexedDB e checkpoint redundante aprovados;
- PDF e entrega guiada no Classroom aprovados;
- planilha, documentos, Gmail e apresentações aprovados;
- 80 questões guiadas e 68 diagnósticas mantidas equilibradas;
- 47 recursos essenciais carregados por HTTP em subpasta equivalente ao GitHub Pages;
- ZIP completo e atualização modular revalidados após a compactação.

## Observação

O protocolo EduAuth mantém o mecanismo legado de senha por aula somente para compatibilidade técnica e testes históricos. A interface do aluno não o utiliza desde a versão 2.5.7.
