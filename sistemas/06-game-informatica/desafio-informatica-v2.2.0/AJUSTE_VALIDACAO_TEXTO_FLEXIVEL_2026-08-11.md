# Ajuste — validação flexível de textos do aluno

Data: 11/08/2026
Base: Desafio de Informática AGV v2.5.7

## Objetivo

Reduzir a rigidez nas atividades em que o estudante precisa redigir texto, especialmente no correio simulado, evitando reprovação por não repetir palavras ou frases exatas do enunciado.

## Alterações realizadas

- Criado `assets/js/text-validation.js`, um avaliador local e offline para textos narrativos.
- A validação passa a ignorar diferenças de maiúsculas/minúsculas, acentos, pontuação e espaçamento.
- Adicionados grupos de palavras equivalentes e sinônimos para conceitos recorrentes, como relatório/documento, análise/revisão/conferência, plano/ações/medidas, anexo/arquivo/PDF, entre outros.
- Pequenos erros de digitação em palavras relevantes podem ser aceitos quando a intenção permanece reconhecível.
- O assunto do e-mail não precisa repetir todas as palavras-chave; basta identificar adequadamente o tema principal.
- O corpo do e-mail aceita redação própria, ordem diferente das informações e palavras equivalentes.
- Saudação e encerramento profissional deixaram de bloquear a tarefa: quando ausentes, geram orientação pedagógica (warning), não erro.
- Textos claramente sem relação com a atividade continuam sendo recusados.
- Destinatário, CC obrigatório, anexo correto, versão do arquivo, conflitos e permissões continuam com validação rigorosa.
- No Google Documentos simulado, o campo de comentário agora informa explicitamente que o aluno pode escrever com suas próprias palavras e não precisa copiar o enunciado.

## Exemplos agora aceitos

- `Documento para a gestão` em vez de exigir literalmente `Relatório gerencial`.
- `Estou enviando o PDF para você verificar` como alternativa a expressões fixas com `anexo` e `análise`.
- `Encaminho o documento para conferência` como redação equivalente.

## Segurança pedagógica

A flexibilização não significa aceitar qualquer texto. Uma resposta longa, porém totalmente fora do assunto, continua inválida. A regra procura equilibrar liberdade de escrita com o cumprimento real da tarefa.

## Testes

A suíte completa `npm test` foi executada após o ajuste e passou integralmente, incluindo testes de e-mail, documentos, avaliações, responsividade, continuidade, segurança, armazenamento e fluxo pedagógico.
