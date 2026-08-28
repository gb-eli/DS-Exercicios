# Auditoria de compatibilidade histórica das referências — DS Exercícios v14.10.8.2

**Data:** 22/08/2026  
**Base:** `DS-Exercicios-v14.10.8-AUDITADO.zip`  
**Hotfix candidato:** `v14.10.8.2` / UI `0.22.8.2`  
**Projeto Supabase auditado:** `iresvqwyaqotghjssncg` — Portal Lab DS - Plataformas Unificadas  
**Situação de produção ao gerar este relatório:** nenhuma migration deste hotfix aplicada, nenhuma nova Edge Function publicada e nenhum código de aluno alterado.

---

## 1. Problema confirmado

A plataforma possuía uma única referência vigente por exercício/arquivo em `exercise_reference_files`. Durante correções sucessivas, algumas referências foram alteradas além de bugs visuais. Isso cria um problema pedagógico real: um aluno pode começar digitando uma referência correta disponível naquele momento e, depois de uma atualização, ser comparado contra outra implementação oficial.

O problema não é apenas de espaços, comentários ou cores. O histórico dos alunos mostra alterações estruturais reais de referência. No Exercício 06 de Introdução à Programação, por exemplo, existe código iniciado com nomes como `num_tabuada`, `primeiro_multiplicador` e `ultimo_multiplicador`, enquanto a referência atual usa `numero`, `inicio` e `fim`.

Portanto, a autocorreção baseada somente no snapshot atual não é suficiente para preservar a justiça da atividade.

---

## 2. Evidências do banco de produção

Levantamento somente leitura realizado antes de qualquer alteração:

| Indicador | Quantidade |
|---|---:|
| Arquivos atuais em `student_files` | 450 |
| Revisões em `student_file_history` | 14.131 |
| Pares aluno/exercício com código salvo | 197 |
| Alunos distintos com código salvo | 83 |
| Exercícios com código de aluno | 42 |
| Pares que começaram antes do timestamp mais recente da referência | 133 |
| Pares que começaram antes e continuaram depois do timestamp mais recente | 24 |
| Referências atuais em `exercise_reference_files` | 199 |

**Observação:** `updated_at` sozinho não prova que o conteúdo mudou em todas as ocorrências, porque uma atualização pode apenas regravar o mesmo conteúdo. Por isso, ele foi usado como sinal de risco e foi complementado pela comparação de conteúdo dos catálogos e pelo histórico real dos arquivos dos alunos.

Casos com exposição relevante incluem, entre outros:

- Introdução à Programação Ex. 06: 12 de 17 alunos começaram antes do último timestamp da referência; 4 atravessaram a atualização.
- Introdução à Programação Ex. 07: 5 de 6 começaram antes; 4 atravessaram a atualização.
- Programação Front-End 2DS Ex. 16: 11 de 12 começaram antes; 2 atravessaram a atualização.
- Programação Front-End Sub Ex. 04: 5 de 6 começaram antes; 3 atravessaram a atualização.
- Programação Front-End Sub Ex. 06: 4 de 5 começaram antes; 2 atravessaram a atualização.

---

## 3. Evidências dos catálogos de referência do próprio pacote

Foram comparadas as seis fontes locais de referência existentes na base:

- `exercise-reference-catalog-current.js`
- `exercise-reference-ds2-corrected.js`
- `exercise-reference.js`
- `exercise-reference-extra.js`
- `exercise-reference-synced.js`
- `exercise-reference-3ds-restored.js`

Após deduplicação por conteúdo:

| Indicador | Quantidade |
|---|---:|
| Chaves de exercício representadas | 70 |
| Pares exercício/arquivo | 193 |
| Snapshots de conteúdo distintos | 257 |
| Pares exercício/arquivo com mais de uma variante | 64 |
| Exercícios com pelo menos um arquivo multiversão | 22 |

Isso confirma que o próprio projeto já preservava, de forma dispersa, várias gerações oficiais do mesmo arquivo. O hotfix transforma essa redundância acidental em histórico explícito e utilizável.

---

## 4. Por que a versão precisa ser por arquivo

A auditoria encontrou exercícios em que `index.html`, `estilo.css` e `script.js` foram atualizados em momentos diferentes. Em produção existem inclusive combinações híbridas: um HTML pode coincidir com uma geração mais nova enquanto o CSS ainda corresponde à anterior.

Por isso, não foi adotada uma única versão rígida para o exercício inteiro. A compatibilidade é feita por arquivo. Cada HTML, CSS, JavaScript, Python, Kotlin ou outro arquivo pode encontrar a variante oficial mais próxima do que o aluno realmente vinha construindo.

Esse desenho evita inventar um “pacote de versão” que nunca existiu exatamente daquela forma em produção.

---

## 5. Solução implementada no hotfix

### 5.1. Histórico oficial de referências no banco

Foi criada a migration:

`core/database/044_p109_reference_file_version_history.sql`

Ela cria `public.exercise_reference_file_versions`, com conteúdo, hash, origem, rótulo, chave de versão, período efetivo, indicador de atual/histórica e metadados.

A migration:

1. importa os 257 snapshots oficiais conhecidos nos catálogos locais;
2. captura o estado atual de `exercise_reference_files` no momento da instalação;
3. deduplica conteúdos iguais por exercício/arquivo/hash;
4. instala um trigger que preserva automaticamente todas as futuras mudanças de referência;
5. mantém somente uma variante marcada como atual por exercício/arquivo;
6. aplica RLS para que o aluno somente veja versões de exercícios em que pode trabalhar;
7. **não executa UPDATE nem DELETE em `student_files` ou `student_file_history`**.

### 5.2. Referência no workspace do aluno

A interface ganhou um seletor por arquivo:

- **Auto — mais próxima do seu código**;
- **Atual**;
- **versões anteriores oficiais**.

No modo Auto, o navegador compara o arquivo digitado pelo aluno com as variantes oficiais disponíveis e mostra a referência mais compatível. O status informa se a escolha automática corresponde à referência atual ou a uma anterior, junto com uma porcentagem aproximada de compatibilidade.

A seleção manual serve para visualização e continuidade pedagógica. Ela **não controla a nota do servidor**.

### 5.3. Autocorreção retrocompatível

O candidato `exercise-autograde` foi consolidado como **v8-reference-history**. Antes de finalizar o pacote, a produção foi conferida e estava com **exercise-autograde v7 ACTIVE, verify_jwt=true**. O candidato v8 foi então ajustado para preservar os fluxos do v7 (inclusive sincronização de dicas/ajuda progressiva) e acrescentar o histórico de referências, evitando downgrade do backend.

Para cada arquivo do exercício, o servidor:

1. reúne a referência atual e todas as variantes históricas oficiais;
2. calcula a compatibilidade usando as mesmas métricas estruturais já existentes;
3. escolhe automaticamente a melhor variante oficial por arquivo;
4. registra se o arquivo casou com a referência atual ou anterior;
5. calcula a nota com a melhor referência oficial válida;
6. nunca confia em uma versão escolhida pelo cliente para aumentar a nota.

O retorno passa a registrar `reference_match` como `current`, `legacy` ou `mixed`, além da versão/origem escolhida em cada arquivo.

### 5.4. Fallback local corrigido

Foi corrigida uma divergência adicional em **Programação Front-End Sub 08, 09 e 10**. O manifesto já esperava `index.html`, `estilo.css` e `script.js`, mas o fallback local ainda podia expor uma estrutura antiga. O catálogo atual local foi sincronizado com a referência corrente do Supabase para esses três exercícios.

As versões antigas não são descartadas; elas passam a fazer parte do histórico.

---

## 6. Compatibilidade e segurança de deploy

O hotfix foi construído para degradar com segurança:

- sem a nova tabela histórica, o frontend continua mostrando a referência atual/fallback como antes;
- sem histórico disponível, a Edge Function continua conseguindo corrigir usando a referência atual;
- a interface não escreve em `exercise_reference_file_versions`;
- o aluno não consegue indicar ao servidor “use esta versão para me dar nota”; a decisão é server-side;
- nenhuma rotina deste hotfix substitui ou apaga o código existente dos alunos.

A versão foi identificada como **v14.10.8.2 / UI 0.22.8.2** para invalidar caches de navegador e diferenciar claramente este hotfix da base v14.10.8.

---

## 7. Resultado da regressão local

Após as alterações:

- **208/208 testes aprovados**;
- 4 novos testes específicos para compatibilidade histórica;
- JavaScript do projeto verificado por sintaxe;
- Edge Function candidata v8 verificada por transpile/sintaxe TypeScript e por preservação dos contratos ativos do v7;
- migration verificada quanto à estrutura dos blocos e seeds históricos;
- teste específico garante que a migration não altera `student_files`.

Os novos testes cobrem:

- seletor e detecção automática de variante;
- escolha server-side da melhor referência por arquivo;
- rejeição de confiança na escolha manual do cliente;
- preservação do histórico e ausência de mutação dos arquivos dos alunos.

---

## 8. Ordem recomendada para produção

1. Fazer backup/snapshot lógico do banco antes da mudança.
2. Aplicar `044_p109_reference_file_version_history.sql`.
3. Verificar contagem de versões e RLS no banco.
4. Publicar o candidato `exercise-autograde` v8-reference-history com JWT obrigatório, somente após conferir que ele permanece um superset funcional do v7 ativo.
5. Publicar o frontend v14.10.8.2.
6. Fazer smoke autenticado com pelo menos:
   - um aluno que começou antes da troca;
   - um aluno que começou depois da troca;
   - um exercício HTML/CSS/JS;
   - um exercício Python;
   - um caso em que arquivos diferentes casam com versões diferentes.
7. Só depois considerar o hotfix como produção estável.

**Produção não foi alterada durante esta auditoria.**

---

## 9. Limitação deliberada desta primeira fase

Para maximizar a justiça imediata, a autocorreção aceita a melhor variante **oficial** conhecida, mesmo quando não é possível reconstruir com certeza o intervalo exato em que aquela variante esteve publicada.

Em uma segunda fase, os intervalos `effective_from/effective_to` podem ser refinados usando releases e timestamps históricos. Assim, o servidor poderá limitar versões antigas às que estavam disponíveis quando o aluno iniciou aquele arquivo. Isso reduz ainda mais a possibilidade de um aluno novo escolher deliberadamente uma referência antiga mais fácil.

A implementação atual já impede o principal abuso: o aluno não escolhe qual versão o servidor usará para a nota; o autograder calcula sozinho a melhor correspondência oficial.

---

## 10. Conclusão

O problema de regressão pedagógica foi confirmado e a correção não deve ser simplesmente “voltar para o código antigo” ou “manter apenas o novo”. A solução adequada é preservar múltiplas referências oficiais, comparar por arquivo e reconhecer automaticamente a geração que melhor corresponde ao trabalho já iniciado pelo aluno.

O hotfix v14.10.8.2 deixa essa arquitetura pronta sem apagar dados existentes e com fallback para a operação atual. A próxima ação segura é aplicar a migration e a Edge Function em produção somente após revisão do pacote e, em seguida, executar o smoke autenticado antes de liberar aos alunos.
