# Auditoria de liberação para aula — 17/08/2026

## Resultado
**Aprovado para acesso e trabalho dos alunos com as ressalvas abaixo.**

### Acesso / navegação
- Hub, Atividades, Professor, Admin e Lobby possuem referências locais válidas no pacote.
- Sessão compartilhada, primeiro acesso e troca de senha permanecem sem alteração neste hotfix.
- O backend/Supabase ao vivo não pôde ser revalidado nesta execução; portanto a auditoria de autenticação live deve ser confirmada em um login real antes de liberar em massa.

### Editor
- HTML/CSS/JS/Python usam o mesmo editor com destaque de sintaxe leve.
- Todos os arquivos do exercício ficam acessíveis por abas desde o início.
- Orientações e Preview/Terminal iniciam recolhidos; aluno pode ir direto à prática.
- Autosave local imediato + sincronização em nuvem permanecem ativos.
- Paste, drop, replacement e inserção externa em massa são bloqueados durante a sessão supervisionada.
- Digitação anormal continua registrada como evento para conferência.

### Preview / terminal
- Preview HTML/CSS/JS permanece isolado em Preview Host + iframe sandboxado.
- Corrigido starter para apontar para o nome real do CSS (`estilo.css` ou `style.css`) e JS do exercício.
- Python executa pelo terminal Pyodide; depende do carregamento do runtime CDN.
- Não existe “terminal com gabarito”. Isso é intencional: código-resposta não deve ser enviado ao navegador do aluno.

### Validação / conclusão
- 3DS 01–03 possuem validador HTML estrutural suportado pelo validador unificado atual.
- Parte dos exercícios antigos de 2DS/SUB e 3DS 04+ usa formatos de validação ainda não migrados integralmente.
- v14.7.3 impede falso positivo nesses casos: salva o trabalho, mas não marca automaticamente como concluído.
- Conclusão exige conteúdo significativo em todos os arquivos definidos; arquivo só com comentário não conta.
- A validação definitiva antifraude ainda deve migrar para backend antes de valer como nota automática.

### UX/UI/CSS
- Admin recebeu correção explícita de overflow para notebook e mobile.
- Dialogs do Admin possuem rolagem própria.
- Em notebook de 1101–1280px, editor + Preview/Terminal podem permanecer lado a lado com Orientações recolhidas.
- Em telas menores, a interface empilha os painéis e prioriza o editor.
- Ferramentas secundárias continuam recolhidas para reduzir poluição visual.

## Recomendação de uso hoje
- **3DS:** liberar apenas os exercícios históricos 01–03 e o próximo exercício novo somente depois de reconstruído/validado.
- **Exercícios antigos com validador em migração:** permitir abrir, editar e salvar; não usar “Concluído” como nota automática.
- Fazer 1 login real de aluno + 1 login de professor após publicar para confirmar o backend ao vivo.
