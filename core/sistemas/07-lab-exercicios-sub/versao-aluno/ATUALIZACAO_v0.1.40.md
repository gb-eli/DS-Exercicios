# Atualização v0.1.40 — Modo Aluno

Correção de regressão observada em sala após a separação dos pacotes Aluno/Professor.

## Correções
- `Baixar arquivo` e `Baixar projeto ZIP` voltam a ficar visíveis na barra principal da prática.
- Modo VS Code passa a ter botões próprios `Baixar arquivo` e `Baixar ZIP` no cabeçalho.
- Os downloads continuam disponíveis mesmo antes de 100%; quando incompletos, o modal informa o estado e permite salvar uma cópia de segurança.
- O listener de conclusão ficou defensivo para evitar que uma ausência inesperada de elemento interrompa a inicialização do restante da interface.
- Salvamento local, backup automático, `beforeunload`, `pagehide` e `visibilitychange` foram mantidos.
- Nenhum arquivo do Modo Professor foi reintroduzido no pacote Aluno.
