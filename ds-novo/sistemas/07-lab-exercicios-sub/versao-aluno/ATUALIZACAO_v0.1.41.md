# Atualização v0.1.41 — isolamento dos códigos e correção de layout

- Corrige duplicação dos controles de fonte no editor do aluno.
- Reorganiza o editor normal em duas áreas alinhadas no desktop/notebook.
- Corrige a estrutura visual do Modo VS Code em notebook e computador.
- Registra corretamente Front-End e Programação Mobile no seletor de disciplinas.
- Cria armazenamento `state_v3`, isolado por usuário + disciplina + exercício + arquivo.
- Migra estados `state_v2` apenas quando o conteúdo é compatível com o tipo do arquivo.
- Impede que JavaScript seja carregado como HTML/CSS e vice-versa.
- Preserva o salvamento antigo para recuperação caso seja detectada mistura.
- Força o salvamento do arquivo atual antes de trocar de arquivo ou exercício.
