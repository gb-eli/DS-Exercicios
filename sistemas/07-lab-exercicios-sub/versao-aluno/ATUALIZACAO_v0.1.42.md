# Atualização v0.1.42 — correção estrutural do Modo Aluno

- Remove as camadas cumulativas conflitantes de CSS adicionadas após a v0.1.37.
- Consolida desktop, notebook, tablet e iPhone em uma única hierarquia de breakpoints.
- Mantém referência + editor lado a lado somente quando há espaço.
- Abaixo de 980 px, o Modo VS Code usa abas e não comprime dois editores.
- Remove fundos pretos puros e usa azul-grafite consistente.
- Troca glifos incomuns por rótulos curtos confiáveis.
- Esconde as camadas antigas de highlight/line numbers quando CodeMirror está ativo.
- Cria `state_v4`; estados v2/v3 são preservados, mas o código antigo não é migrado automaticamente.
- Limpa o preview ao trocar disciplina, exercício ou arquivo.
- Associa o preview ao hash do projeto atual e ignora respostas obsoletas.
