# Auditoria — Modo Aluno v0.1.40

## Problema relatado
Alunos perceberam desaparecimento dos botões de download e suspeita de quebra do código durante a atividade.

## Causas encontradas
1. Na reorganização de UX, `Baixar arquivo` e `Baixar projeto ZIP` eram movidos para o menu **Ferramentas**. Portanto deixavam de ficar visíveis na barra principal.
2. No Modo VS Code, `.practice-toolbar` é ocultada propositalmente; como os downloads estavam nessa barra/menu, não havia botão de download visível dentro do workspace VS Code.
3. Existia um listener direto para `finishExerciseButton`. O elemento é criado dinamicamente antes do vínculo, mas a chamada não era defensiva; uma falha inesperada na montagem dinâmica poderia interromper a continuação do `init()`.

## Correções
- `Baixar arquivo` e `Baixar projeto ZIP` permanecem ações principais visíveis na prática normal.
- Modo VS Code ganhou `Baixar arquivo` e `Baixar ZIP` próprios no cabeçalho.
- Os quatro botões usam as mesmas rotinas `requestWorkDownload()` / `performWorkDownload()`, sem duplicar lógica de geração.
- Download pode ser realizado antes de 100% como cópia de segurança; a plataforma mostra o estado dos arquivos antes de gerar.
- Listener de conclusão usa encadeamento opcional para não bloquear a inicialização caso o botão dinâmico não exista.

## Persistência revisada
As chaves de armazenamento da v0.1.39 são compatíveis com a v0.1.38. Permanecem ativos:
- salvamento automático durante a edição;
- backup do estado local anterior;
- `beforeunload`;
- `pagehide`;
- salvamento quando a aba fica oculta.

## Testes executados
- `node --check` em todos os arquivos JavaScript;
- conferência de todos os IDs usados por listeners diretos;
- nenhum listener direto aponta para elemento ausente;
- geração real de ZIP via `Utils.createZip()`;
- validação do ZIP gerado com `unzip -t`: sem erros;
- pacote Aluno verificado sem arquivos do Modo Professor.
