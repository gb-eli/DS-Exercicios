# Plataforma 2DS — Modo Aluno — v0.7.0

Pacote preparado para a turma **2º DS A — Manhã**, com duas disciplinas independentes dentro da mesma publicação.

## Disciplinas

### 1. Programação Front-End

- diretório: `frontend/`
- versão preservada: `0.5.29`
- exercícios atuais: `01 a 28`
- ambiente de código: HTML + CSS + JavaScript
- editor, Preview, Console, Terminal virtual, validação, GitHub e Classroom
- progresso antigo preservado pelo namespace `2ds-frontend-manha`

### 2. Inovação Tecnológica e Empreendedorismo

- diretório: `inovacao/`
- versão atual: `0.2.0`
- exercícios mapeados: `01 a 30`
- atividades de análise, pesquisa, ideação, modelo de negócio, MVP, validação, viabilidade e pitch
- validação flexível para respostas textuais
- 10 atividades com interfaces visuais próprias: 08, 12, 13, 20, 21, 22, 26, 28, 29 e 30
- Mapa de Empatia em quadrantes, Matriz Impacto × Esforço interativa, cartão de Proposta de Valor, Business Model Canvas consolidado, quadro de MVP, fluxo de protótipo, simulador financeiro, cronômetro de pitch, prévia de pitch deck e painel do projeto final
- exportação por atividade e portfólio completo em Markdown
- progresso no namespace `2ds-inovacao-empreendedorismo-manha`

## Entrada principal

Publique a pasta `modo-aluno/` no GitHub Pages e abra `modo-aluno/index.html`.

A página inicial apresenta um seletor com as duas disciplinas. Links antigos do tipo `#exercise-XX` são redirecionados para Front-End.

## Compartilhamento de usuário local

A nova disciplina usa o mesmo namespace de autenticação local já existente em Front-End (`2ds-frontend-manha`) para reconhecer os usuários cadastrados no mesmo navegador. O progresso das disciplinas continua separado.

## Evolução v0.7.0

A disciplina de Inovação ganhou uma camada prática visual sem alterar os critérios textuais já existentes. Os dados auxiliares da Matriz Impacto × Esforço são salvos junto ao progresso da atividade e incluídos na exportação Markdown.

## Próximas fases sugeridas

1. Validar a sequência de conteúdos de Inovação com o planejamento/RCO da disciplina.
2. Criar o Modo Professor de Inovação com gabaritos orientativos, acompanhamento e critérios.
3. Adicionar entregas com anexos/evidências quando houver integração com Supabase.
4. Integrar autenticação e progresso ao Supabase mantendo o modo local como fallback.

## Atualização v0.7.1 — foco no editor
- Front-End v0.5.30 com syntax highlighting no editor do aluno.
- Código de referência e editor são a área principal da prática.
- Materiais de apoio, Explorador, checkpoints e ferramentas começam recolhidos.
- Preview/Console/Terminal começam recolhidos e são abertos quando necessários.
- Autosave permanece silencioso durante a digitação.
