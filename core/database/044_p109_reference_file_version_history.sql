-- P10.9 — histórico imutável de referências por arquivo e compatibilidade retroativa.
-- Objetivo: nunca mais penalizar um aluno porque HTML/CSS/JS/Python de referência mudou depois do início da atividade.
-- Estratégia: exercise_reference_files continua sendo a projeção atual; esta tabela preserva cada conteúdo oficial conhecido.

create table if not exists public.exercise_reference_file_versions (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  filename text not null,
  language text not null default 'text',
  content text not null default '',
  version_key text not null,
  label text not null default 'Referência histórica',
  source_kind text not null default 'snapshot',
  source_ref text,
  effective_from timestamptz,
  effective_to timestamptz,
  is_current boolean not null default false,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  content_hash text generated always as (md5(replace(content, E'\r\n', E'\n'))) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint exercise_reference_file_versions_version_key_chk check (char_length(version_key) between 1 and 160),
  constraint exercise_reference_file_versions_filename_chk check (char_length(trim(filename)) between 1 and 180),
  constraint exercise_reference_file_versions_unique_content unique (exercise_id, filename, content_hash)
);

create unique index if not exists exercise_reference_file_versions_one_current_idx
  on public.exercise_reference_file_versions(exercise_id, lower(filename))
  where is_current = true and active = true;
create index if not exists exercise_reference_file_versions_exercise_idx
  on public.exercise_reference_file_versions(exercise_id, filename, active, is_current);

alter table public.exercise_reference_file_versions enable row level security;
revoke all on public.exercise_reference_file_versions from anon, authenticated;
grant select on public.exercise_reference_file_versions to authenticated;

drop policy if exists exercise_reference_file_versions_staff_read on public.exercise_reference_file_versions;
create policy exercise_reference_file_versions_staff_read
on public.exercise_reference_file_versions for select to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.active = true
      and p.role <> 'student'::public.user_role
  )
);

drop policy if exists exercise_reference_file_versions_student_read_released on public.exercise_reference_file_versions;
create policy exercise_reference_file_versions_student_read_released
on public.exercise_reference_file_versions for select to authenticated
using (
  active = true
  and private.student_can_work_on_exercise((select auth.uid()), exercise_id)
);

-- Variantes históricas embarcadas nos catálogos auditados. O ON CONFLICT garante idempotência.

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'referencia.md', 'markdown', $ref_4f7a18a90d$# Referência — Problema, Público e Proposta de Solução

## Estrutura para transcrição
- Problema observado:
- Evidência do problema:
- Público afetado:
- Contexto de uso:
- Objetivo da solução:
- Proposta de solução:
- Como a proposta reduz o problema:

> Use a estrutura para registrar sua análise. Não copie uma solução pronta.$ref_4f7a18a90d$, 'bundle:exercise-reference-synced:4f7a18a90d5f', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"d54b1ab416626209012d315fe8b0475446840403de97bc768a34a06edb6e366e","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'analise-metodo-sistemas' and e.exercise_number = 1
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'referencia.md', 'markdown', $ref_60b56965e2$# Referência — Métodos Ágil x Waterfall

## Para cada cenário registre
- Cenário:
- Método escolhido: Ágil | Waterfall/Cascata | Híbrido
- Evidências do cenário:
- Por que esse método é adequado:
- Principal risco da escolha:

> A justificativa vale mais do que apenas marcar o método.$ref_60b56965e2$, 'bundle:exercise-reference-synced:60b56965e23b', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"0e628a6c304af8b27023494fbcfc35806e21a5ef3916bcd7491b64a99499c9d1","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'analise-metodo-sistemas' and e.exercise_number = 2
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'referencia.md', 'markdown', $ref_77ea04dd95$# Referência — Documentação e Rastreabilidade

## Registro mínimo
- Requisito ou necessidade:
- Decisão tomada:
- Tarefa relacionada:
- Versão/alteração:
- Teste realizado:
- Resultado do teste:
- Evidência (link, commit, print ou arquivo):

> O objetivo é permitir que outra pessoa acompanhe a evolução do sistema.$ref_77ea04dd95$, 'bundle:exercise-reference-synced:77ea04dd95a2', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"3d7236510da28f915fc5746075f56fc587f98de975245c370601bdc47fbdc604","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'analise-metodo-sistemas' and e.exercise_number = 3
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'referencia.md', 'markdown', $ref_151339cdb9$# Referência — Segurança na Análise de Sistemas

## Para cada requisito registre
- Requisito de segurança:
- Categoria: autenticação | autorização | proteção de dados | auditoria | recuperação
- Risco que reduz:
- Como verificar/testar:

> Escreva requisitos claros e verificáveis; evite frases vagas como “o sistema deve ser seguro”.$ref_151339cdb9$, 'bundle:exercise-reference-synced:151339cdb938', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"c4933be28cc71f719b75239db2ea31f89042c03b5fb10387c97b65676af147d5","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'analise-metodo-sistemas' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'referencia.md', 'markdown', $ref_18cbed40a4$# Referência — Auditoria de um Sistema Real

## Modelo de achado
- Critério:
- Problema encontrado:
- Evidência:
- Impacto:
- Gravidade: baixa | média | alta
- Recomendação:
- Como validar a correção:

> Faça observações baseadas em evidências e proponha melhorias que possam ser verificadas.$ref_18cbed40a4$, 'bundle:exercise-reference-synced:18cbed40a48b', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"1300afc393e49a91e5e734a30dd32ac914c97a3a5ff2b074aebd2aebf4fba2a9","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'analise-metodo-sistemas' and e.exercise_number = 5
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'referencia.md', 'markdown', $ref_8cb3ee5613$# Referência — Tipos de inovação

## Estrutura
- Produto: mudança no que é oferecido.
- Processo: mudança na forma de produzir ou executar.
- Organizacional: mudança na forma de organizar o trabalho.
- Marketing: mudança na forma de divulgar, posicionar ou vender.

## Exemplo
- Situação: escola cria agendamento digital de laboratórios.
- Tipo: inovação de processo.
- Justificativa: altera a forma como a reserva é realizada.$ref_8cb3ee5613$, 'bundle:exercise-reference-synced:8cb3ee561307', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"f63a64a471121cf65dd0e4104f20d3f9ebccb95385adc99ff435cf459cd9e218","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'inovacao-tecnologica-empreendedorismo' and e.exercise_number = 1
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'referencia.md', 'markdown', $ref_5ca5fffd8a$# Referência — Tecnologias emergentes e oportunidades

## Modelo
- Tecnologia escolhida: Inteligência Artificial
- Problema observado: demora para responder dúvidas repetidas
- Oportunidade: assistente de atendimento
- Público: alunos e professores
- Benefício esperado: respostas mais rápidas
- Risco: informação incorreta
- Forma de reduzir o risco: validação humana e fontes confiáveis$ref_5ca5fffd8a$, 'bundle:exercise-reference-synced:5ca5fffd8ab2', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"14a7c88107c7051c183a347c52456ca15517d18930cfdbcbab23b96d267db542","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'inovacao-tecnologica-empreendedorismo' and e.exercise_number = 2
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'referencia.md', 'markdown', $ref_3c1b62a76f$# Referência — Entrevista de descoberta

## Roteiro
1. Como você resolve esse problema hoje?
2. Com que frequência isso acontece?
3. Qual é a parte mais difícil?
4. O que você já tentou fazer para resolver?
5. Quanto tempo você perde nesse processo?
6. O que uma solução ideal deveria facilitar?

## Regra
Evite perguntas que induzam a resposta. Registre frases importantes do entrevistado.$ref_3c1b62a76f$, 'bundle:exercise-reference-synced:3c1b62a76fd0', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"9685deb771bdb12daf5b65c22d0b1c1eff75e1f747e954bcd24558a822f54182","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'inovacao-tecnologica-empreendedorismo' and e.exercise_number = 3
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'referencia.md', 'markdown', $ref_dec34a1841$# Referência — Geração de ideias

## Ideias
1. Agenda visual de laboratórios
2. Reserva por QR Code
3. Notificação automática de conflito
4. Lista de espera
5. Sugestão de horário alternativo

## Regra
Primeiro gere quantidade. Depois avalie qualidade e viabilidade.$ref_dec34a1841$, 'bundle:exercise-reference-synced:dec34a184115', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"4b5055e44efc86c23833d28882ea8517c5a1f416d3987398d94637b20aa392ff","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'inovacao-tecnologica-empreendedorismo' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'referencia.md', 'markdown', $ref_26c65045ba$# Referência — Preço e percepção de valor

## Modelo
- Benefício principal: reduzir tempo e conflitos
- Alternativa atual: processo manual
- Custo da alternativa: tempo da equipe
- Faixa de preço testada: R$ X a R$ Y
- Pergunta ao cliente: qual valor parece justo para esse benefício?

> O preço deve considerar custo, valor percebido e alternativas.$ref_26c65045ba$, 'bundle:exercise-reference-synced:26c65045bac5', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"88129306fac5ccb449f6adc78b906d9edb59ad9342b5bafe555053bc5ccb19e0","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'inovacao-tecnologica-empreendedorismo' and e.exercise_number = 5
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'referencia.md', 'markdown', $ref_2f4c254e53$# Referência — Viabilidade financeira simplificada

## Fórmulas
Receita mensal = número de clientes × preço mensal

Resultado mensal = receita mensal - custos mensais

Ponto de equilíbrio = custos fixos / margem por cliente

## Exemplo
- 10 clientes × R$ 100 = R$ 1.000
- Custos mensais = R$ 600
- Resultado = R$ 400$ref_2f4c254e53$, 'bundle:exercise-reference-synced:2f4c254e536e', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"a70c995586fe5019fc18c249618ec432be8ab153729a12769d1aedf5d00cfccd","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'inovacao-tecnologica-empreendedorismo' and e.exercise_number = 6
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'README.md', 'markdown', $ref_0014713792$# Exercício 01 — Variáveis, tipos, entrada e saída

## Objetivo

Criar uma ficha digital usando variáveis, entradas, conversões e f-strings.

## Tecnologia

Python

## Arquivos

- `main.py`

## Conteúdos

- print()
- input()
- str
- int
- float
- bool
- f-strings

## Como executar

```bash
python main.py
```

A execução Python também pode ser testada na plataforma quando houver conexão.

## Testes mínimos

- Execute o código original.
- Altere pelo menos um valor ou conteúdo.
- Provoque um erro controlado e leia a mensagem.
- Corrija o erro e execute novamente.
$ref_0014713792$, 'bundle:exercise-reference:0014713792cc', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"9910f22e533897ce8d89115fcedea2413302156887fc898ef777fa1fb7136fde","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'introducao-programacao' and e.exercise_number = 1
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'main.py', 'python', $ref_830ead4f81$# Exercício 01 — Ficha digital
nome = input("Digite seu nome: ").strip()
idade = int(input("Digite sua idade: "))
turma = input("Digite sua turma: ").strip().upper()
altura = float(input("Digite sua altura: ").replace(",", "."))
programou = input("Já programou? (sim/não): ").strip().lower() == "sim"

print("\n--- FICHA DO ALUNO ---")
print(f"Nome: {nome}")
print(f"Idade: {idade} anos")
print(f"Turma: {turma}")
print(f"Altura: {altura:.2f} m")
print(f"Já programou: {programou}")
$ref_830ead4f81$, 'bundle:exercise-reference:830ead4f8196', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"49c5e6c54c40d6ff4957d0049e7a2cb1dc1f127f276d49995deef640c52fafaa","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'introducao-programacao' and e.exercise_number = 1
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'README.md', 'markdown', $ref_9d5550bd9a$# Exercício 02 — Operadores e cálculos em Python

## Objetivo

Revisar operadores matemáticos criando um resumo de desempenho com notas, tempo de estudo, aproveitamento e pontos de bônus.

## Arquivos

- `main.py`

## Conteúdos trabalhados

- soma `+`;
- subtração `-`;
- multiplicação `*`;
- divisão `/`;
- divisão inteira `//`;
- resto da divisão `%`;
- potência `**`;
- valor absoluto com `abs()`;
- arredondamento com `round()`;
- conversões com `float()` e `int()`;
- saída formatada com f-strings.

## Como executar

No terminal do VS Code, dentro da pasta do exercício:

```bash
py main.py
```

ou:

```bash
python main.py
```

## Dados sugeridos para teste

```text
Primeira nota: 8
Segunda nota: 6
Minutos estudados: 135
Questões corretas: 8
Total de questões: 10
```

## Resultado principal esperado

- soma das notas: `14.00`;
- média: `7.00`;
- diferença: `2.00`;
- tempo: `2 h e 15 min`;
- aproveitamento: `80.0%`;
- pontos de bônus: `64`.

## Testes adicionais

1. Use notas com vírgula, como `7,5`.
2. Altere a quantidade de minutos e observe `//` e `%`.
3. Digite texto onde o programa espera número e leia o erro no terminal.
4. Corrija o valor e execute novamente.
$ref_9d5550bd9a$, 'bundle:exercise-reference:9d5550bd9a3e', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"09dec18c99c3ddbe32fe01bf75bda96a0f5d6a26460f35bc95910e425a7701d8","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'introducao-programacao' and e.exercise_number = 2
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'main.py', 'python', $ref_70f63c58cd$# Exercício 02 — Operadores e cálculos em Python
nota1 = float(input("Digite a primeira nota: ").replace(",", "."))
nota2 = float(input("Digite a segunda nota: ").replace(",", "."))
minutos_estudo = int(input("Digite o total de minutos estudados: "))
questoes_corretas = int(input("Digite a quantidade de questões corretas: "))
total_questoes = int(input("Digite o total de questões: "))

soma_notas = nota1 + nota2
media = round(soma_notas / 2, 2)
diferenca = abs(nota1 - nota2)
horas_estudo = minutos_estudo // 60
minutos_restantes = minutos_estudo % 60
aproveitamento = round((questoes_corretas / total_questoes) * 100, 1)
pontos_bonus = questoes_corretas ** 2

print("\n--- RESUMO DE DESEMPENHO ---")
print(f"Soma das notas: {soma_notas:.2f}")
print(f"Média: {media:.2f}")
print(f"Diferença entre as notas: {diferenca:.2f}")
print(f"Tempo de estudo: {horas_estudo} h e {minutos_restantes} min")
print(f"Aproveitamento: {aproveitamento:.1f}%")
print(f"Pontos de bônus: {pontos_bonus}")
$ref_70f63c58cd$, 'bundle:exercise-reference:70f63c58cd3e', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"fbd8e02031ea01a4356ca232c01c9769aa94be81f145455deaec0ecf4957518b","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'introducao-programacao' and e.exercise_number = 2
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'README.md', 'markdown', $ref_153d61a75c$# Exercício 03 — Condições com `if` e `else`

## Objetivo

Revisar a tomada de decisão em Python por meio de uma condição simples com dois caminhos possíveis.

## Arquivos

- `main.py`

## Conteúdos trabalhados

- comparação com `>=`;
- estrutura `if`;
- estrutura `else`;
- dois-pontos ao final da condição;
- indentação dos blocos;
- variável de referência;
- cálculo dentro do bloco `else`;
- mensagens com f-strings.

## Como executar

No terminal do VS Code, dentro da pasta do exercício:

```bash
py main.py
```

ou:

```bash
python main.py
```

## Dados sugeridos para teste

### Teste 1 — acesso liberado

```text
Nome: Ana
Idade: 15
```

### Teste 2 — acesso ainda não liberado

```text
Nome: Lucas
Idade: 12
```

## Resultados esperados

- para uma idade igual ou superior a 14, o programa deve liberar o acesso;
- para uma idade inferior a 14, o programa deve informar quantos anos faltam;
- apenas um dos blocos deve ser executado em cada teste.

## Erros para observar

1. Remova os dois-pontos depois do `if` e leia o `SyntaxError`.
2. Retire a indentação de uma linha e leia o `IndentationError`.
3. Digite texto no lugar da idade e leia o `ValueError`.
4. Corrija o código e execute novamente.
$ref_153d61a75c$, 'bundle:exercise-reference:153d61a75cde', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"96a4e0e90f9f38397d773639c5d6f9a96d11970c7bd198aebb76745865d4dba3","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'introducao-programacao' and e.exercise_number = 3
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'main.py', 'python', $ref_c30eeb77d9$# Exercício 03 — Condições com if e else
nome = input("Digite seu nome: ").strip()
idade = int(input("Digite sua idade: "))
idade_minima = 14

print("\n--- VERIFICAÇÃO DE ACESSO ---")

if idade >= idade_minima:
    print(f"{nome}, seu acesso à oficina foi liberado.")
    print("Você já possui a idade mínima exigida.")
else:
    anos_faltantes = idade_minima - idade
    print(f"{nome}, seu acesso ainda não foi liberado.")
    print(f"Faltam {anos_faltantes} ano(s) para atingir a idade mínima.")
$ref_c30eeb77d9$, 'bundle:exercise-reference:c30eeb77d904', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"135edffe8b97cad072167705413b35f86e4a92e3a82bc256baf63135eb8b5ff4","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'introducao-programacao' and e.exercise_number = 3
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'README.md', 'markdown', $ref_809dd6991d$# Exercício 04 — Condições com `if`, `elif` e `else`

## Objetivo

Aprender a criar três caminhos de decisão em Python, classificando a situação escolar de um aluno a partir da média de duas notas.

## Arquivos

- `main.py`

## Conteúdos trabalhados

- entrada de texto com `input()`;
- conversão com `float()`;
- cálculo de média;
- estrutura `if`;
- uma condição intermediária com `elif`;
- caminho final com `else`;
- operadores `>=`;
- dois-pontos e indentação;
- f-strings e formatação decimal.

## Como executar

No terminal do VS Code, dentro da pasta do exercício:

```bash
py main.py
```

ou:

```bash
python main.py
```

## Regras da classificação

```text
Média igual ou superior a 7,0       → Aprovado
Média igual ou superior a 5,0       → Recuperação
Média inferior a 5,0                → Reprovado
```

A ordem das condições é importante. Quando a primeira condição for falsa, o Python verifica o `elif`. O `else` será usado somente quando nenhuma condição anterior for verdadeira.

## Testes obrigatórios

### Teste 1 — Aprovado

```text
Nome: Ana
Nota 1: 8
Nota 2: 6
Resultado: Média 7.0 — Aprovado
```

### Teste 2 — Recuperação

```text
Nome: Bruno
Nota 1: 6
Nota 2: 5
Resultado: Média 5.5 — Recuperação
```

### Teste 3 — Reprovado

```text
Nome: Carla
Nota 1: 4
Nota 2: 5
Resultado: Média 4.5 — Reprovado
```

## Erros para observar

1. Remova os dois-pontos depois de `if` ou `elif` e leia o `SyntaxError`.
2. Retire a indentação de uma linha e leia o `IndentationError`.
3. Digite uma palavra no lugar de uma nota e leia o `ValueError`.
4. Troque a ordem das condições e observe como a classificação pode ficar incorreta.
5. Corrija o código e execute novamente.
$ref_809dd6991d$, 'bundle:exercise-reference:809dd6991da9', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"11c14c78be71567346a7b1527d343ffa3e06067f51ccf8182b05676658ab9ea1","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'introducao-programacao' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'main.py', 'python', $ref_4391b94bd5$# Exercício 04 — Condições com if, elif e else
nome = input("Digite o nome do aluno: ").strip()
nota1 = float(input("Digite a primeira nota: ").replace(",", "."))
nota2 = float(input("Digite a segunda nota: ").replace(",", "."))

media = (nota1 + nota2) / 2

if media >= 7:
    situacao = "Aprovado"
elif media >= 5:
    situacao = "Recuperação"
else:
    situacao = "Reprovado"

print("\n--- RESULTADO ESCOLAR ---")
print(f"Aluno: {nome}")
print(f"Média: {media:.1f}")
print(f"Situação: {situacao}")
$ref_4391b94bd5$, 'bundle:exercise-reference:4391b94bd5f2', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"a64b7ce71057abc73c6809d6620cab5a2635f42e738b065376d5128a74bc9de7","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'introducao-programacao' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'README.md', 'markdown', $ref_20c54c994f$# Exercício 05 — Operadores lógicos e validações em Python

## Objetivo

Combinar critérios com `and`, `or` e `not` para construir um controle de acesso a um evento, validando idade e respostas informadas pelo usuário.

## Arquivo

- `main.py`

## Conteúdos trabalhados

- operadores lógicos `and`, `or` e `not`;
- valores booleanos;
- validação de intervalo de idade;
- validação de respostas de texto;
- condições combinadas;
- `if`, `elif` e `else`;
- conversão com `int()`;
- f-strings;
- leitura de erros no terminal.

## Regras do programa

1. Idades menores que 0 ou maiores que 120 representam dados inválidos.
2. Respostas diferentes de `s`, `sim`, `n`, `nao` ou `não` representam dados inválidos.
3. Participantes com 18 anos ou mais precisam possuir ingresso válido.
4. Participantes de 14 a 17 anos precisam possuir ingresso válido **e** autorização do responsável.
5. Participantes abaixo de 14 anos não têm a entrada liberada nesta atividade.
6. Quando o ingresso não estiver confirmado, o terminal informa o motivo.

## Como executar

No terminal do VS Code, dentro da pasta `exercicio-05`:

```bash
py main.py
```

ou:

```bash
python main.py
```

## Testes obrigatórios

### Teste 1 — Adulto com ingresso

```text
Nome: Ana
Idade: 20
Ingresso: s
Autorização: n
Resultado: Entrada liberada
```

### Teste 2 — Adolescente autorizado

```text
Nome: Bruno
Idade: 16
Ingresso: s
Autorização: s
Resultado: Entrada liberada com autorização
```

### Teste 3 — Adolescente sem autorização

```text
Nome: Carla
Idade: 16
Ingresso: s
Autorização: n
Resultado: Entrada não permitida
```

### Teste 4 — Dados inválidos

```text
Nome: Davi
Idade: 150
Ingresso: s
Autorização: s
Resultado: Dados inválidos
```

## Erros para observar

1. Troque um `and` por `or` e observe como a regra muda.
2. Remova um `not` da validação e compare o resultado.
3. Digite texto no campo da idade e leia o `ValueError`.
4. Remova os dois-pontos de uma condição e leia o `SyntaxError`.
5. Retire a indentação de uma linha e leia o `IndentationError`.
6. Corrija o código e execute novamente.
$ref_20c54c994f$, 'bundle:exercise-reference:20c54c994f03', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"bf680636d993fd0f5a33fa61e497f5bd0f8f2e6dc34aedef839709729f040bec","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'introducao-programacao' and e.exercise_number = 5
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'main.py', 'python', $ref_c4906986e5$# Exercício 05 — Operadores lógicos e validações
nome = input("Digite seu nome: ").strip()
idade = int(input("Digite sua idade: "))
resposta_ingresso = input("Possui ingresso válido? (s/n): ").strip().lower()
resposta_autorizacao = input("Possui autorização do responsável? (s/n): ").strip().lower()

ingresso = resposta_ingresso in ("s", "sim")
autorizacao = resposta_autorizacao in ("s", "sim")
ingresso_resposta_valida = resposta_ingresso in ("s", "sim", "n", "nao", "não")
autorizacao_resposta_valida = resposta_autorizacao in ("s", "sim", "n", "nao", "não")

if idade < 0 or idade > 120 or not ingresso_resposta_valida or not autorizacao_resposta_valida:
    resultado = "Dados inválidos"
elif idade >= 18 and ingresso:
    resultado = "Entrada liberada"
elif idade >= 14 and ingresso and autorizacao:
    resultado = "Entrada liberada com autorização"
else:
    resultado = "Entrada não permitida"

print("\n--- CONTROLE DE ACESSO AO EVENTO ---")
print(f"Participante: {nome}")
print(f"Idade: {idade}")
print(f"Resultado: {resultado}")

if not ingresso and resultado != "Dados inválidos":
    print("Motivo: ingresso não confirmado.")
$ref_c4906986e5$, 'bundle:exercise-reference:c4906986e589', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"f3e503826d3ca49642caf39e2cbedce43620844dab5fcef710deb23f2a3055ed","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'introducao-programacao' and e.exercise_number = 5
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'main.py', 'python', $ref_f1764ae093$# Exercício 06 — Repetição com for em Python
numero = int(input("Número da tabuada: "))
inicio = int(input("Multiplicador inicial: "))
fim = int(input("Multiplicador final: "))

if inicio > fim:
    print("Intervalo inválido.")
else:
    print(f"\n--- TABUADA DO {numero} ---")
    for multiplicador in range(inicio, fim + 1):
        resultado = numero * multiplicador
        print(f"{numero} x {multiplicador} = {resultado}")
$ref_f1764ae093$, 'bundle:exercise-reference-synced:f1764ae093bf', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"ac85a2731a202d7edb6198e3389c2c61ef07b815edb8f601ffd2099f85303c85","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'introducao-programacao' and e.exercise_number = 6
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'main.py', 'python', $ref_08e4d8d318$# Exercício 07 — Contadores e acumuladores em Python
quantidade = int(input("Quantidade de pedidos: "))

if quantidade <= 0:
    print("Quantidade inválida.")
else:
    total_vendas = 0.0
    pedidos_pequenos = 0
    pedidos_medios = 0
    pedidos_grandes = 0

    for numero_pedido in range(1, quantidade + 1):
        valor = float(input(f"Valor do pedido {numero_pedido}: R$ ").replace(",", "."))
        total_vendas += valor

        if valor < 20:
            pedidos_pequenos += 1
        elif valor < 50:
            pedidos_medios += 1
        else:
            pedidos_grandes += 1

    ticket_medio = total_vendas / quantidade
    print(f"\nTotal vendido: R$ {total_vendas:.2f}")
    print(f"Ticket médio: R$ {ticket_medio:.2f}")
    print(f"Pedidos pequenos: {pedidos_pequenos}")
    print(f"Pedidos médios: {pedidos_medios}")
    print(f"Pedidos grandes: {pedidos_grandes}")
$ref_08e4d8d318$, 'bundle:exercise-reference-synced:08e4d8d31830', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"c8a1153fde8a4dadf56ae43a887841feb35d5fe0c1cd089f8ceefd830ff694d1","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'introducao-programacao' and e.exercise_number = 7
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'main.py', 'python', $ref_c1dc2f4cba$# Exercício 08 - Repetição com while em Python
senha_correta = "python123"
limite_tentativas = 3
tentativas = 0
acesso_liberado = False

while tentativas < limite_tentativas and not acesso_liberado:
    senha = input(f"Digite a senha ({tentativas + 1}/{limite_tentativas}): ")

    if senha == senha_correta:
        acesso_liberado = True
    else:
        tentativas += 1
        restantes = limite_tentativas - tentativas
        if restantes > 0:
            print(f"Senha incorreta. Restam {restantes} tentativa(s).")

if acesso_liberado:
    print("Acesso liberado!")
else:
    print("Acesso bloqueado: limite de tentativas atingido.")
$ref_c1dc2f4cba$, 'bundle:exercise-reference-synced:c1dc2f4cba6d', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"edc519104b489b10e4ce47c361db210fe25bae94ef46ef9cf89b83640ca1997e","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'introducao-programacao' and e.exercise_number = 8
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_b48feca9dd$:root { font-family: Inter, system-ui, sans-serif; color: #18212f; background: #eef3f8; }
* { box-sizing: border-box; }
body { margin: 0; line-height: 1.6; }
header, main, footer { width: min(100% - 2rem, 980px); margin-inline: auto; }
header { padding-block: 2rem 1rem; }
nav ul { display: flex; flex-wrap: wrap; gap: .75rem; padding: 0; list-style: none; }
nav a { display: inline-block; padding: .55rem .8rem; border-radius: .65rem; background: #fff; color: #174a75; text-decoration: none; }
section { margin-block: 1rem; padding: 1.25rem; border-radius: 1rem; background: #fff; box-shadow: 0 10px 30px rgba(25,42,70,.08); }
article { padding: 1rem; border-left: .3rem solid #3478b8; background: #f5f9fd; }
article + article { margin-top: .8rem; }
footer { padding-block: 1rem 2rem; color: #4d5a6a; }
@media (max-width: 540px) { header, main, footer { width: min(100% - 1rem, 980px); } section { padding: 1rem; } }
$ref_b48feca9dd$, 'bundle:exercise-reference:b48feca9dd38', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"b305a829b06bf2d488a8555a004e472264cdb621128c782c78e0a1dcce5f079a","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 1
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_445967b271$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Central de chamados para atendimento de suporte técnico.">
    <title>Central de Chamados | Suporte DS</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <header>
        <h1>Central de Chamados</h1>
        <p>Acompanhe solicitações e prioridades da equipe de suporte.</p>

        <nav aria-label="Navegação principal">
            <ul>
                <li><a href="#resumo">Resumo</a></li>
                <li><a href="#chamados">Chamados recentes</a></li>
                <li><a href="#orientacoes">Orientações</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="resumo" aria-labelledby="titulo-resumo">
            <h2 id="titulo-resumo">Resumo do atendimento</h2>
            <ul>
                <li>3 chamados em análise</li>
                <li>2 chamados aguardando resposta</li>
                <li>5 chamados concluídos hoje</li>
            </ul>
        </section>

        <section id="chamados" aria-labelledby="titulo-chamados">
            <h2 id="titulo-chamados">Chamados recentes</h2>

            <article>
                <h3>Computador sem acesso à internet</h3>
                <p><strong>Setor:</strong> Laboratório 02</p>
                <p><strong>Prioridade:</strong> Alta</p>
                <p>Verificar cabo de rede, configuração e disponibilidade do ponto.</p>
            </article>

            <article>
                <h3>Instalação do ambiente Python</h3>
                <p><strong>Setor:</strong> Desenvolvimento de Sistemas</p>
                <p><strong>Prioridade:</strong> Média</p>
                <p>Preparar Python, extensão do VS Code e teste de execução no terminal.</p>
            </article>
        </section>

        <section id="orientacoes" aria-labelledby="titulo-orientacoes">
            <h2 id="titulo-orientacoes">Orientações para abrir um chamado</h2>
            <ol>
                <li>Descreva o problema com clareza.</li>
                <li>Informe o equipamento e o local.</li>
                <li>Registre mensagens de erro ou testes já realizados.</li>
            </ol>
        </section>
    </main>

    <footer>
        <p>Projeto educacional — 3º DS · Programação no Desenvolvimento de Sistemas</p>
    </footer>
    <script src="script.js"></script>
</body>
</html>
$ref_445967b271$, 'bundle:exercise-reference:445967b2715f', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"b4b914234230fe9de6dbeef50e17840e192b0accde1694b5b41e6956b2d223a1","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 1
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_a44973caa7$// Arquivo de apoio. O foco pedagógico deste exercício é a semântica do HTML.
document.querySelectorAll('nav a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    document.querySelectorAll('nav a[aria-current]').forEach((item) => item.removeAttribute('aria-current'));
    link.setAttribute('aria-current', 'location');
  });
});
console.info('Exercício 01 carregado.');
$ref_a44973caa7$, 'bundle:exercise-reference:a44973caa7ee', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"2cf4fb0adfdd5b33473b9ffe54d8dd252dff7a756d7264797e1ff5a9f2cd9ce8","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 1
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_eba69df177$:root { font-family: Inter, system-ui, sans-serif; color: #18212f; background: #edf3f8; }
* { box-sizing: border-box; }
body { margin: 0; line-height: 1.55; }
header, main, footer { width: min(100% - 2rem, 820px); margin-inline: auto; }
header { padding-block: 2rem 1rem; }
section { padding: 1.4rem; border-radius: 1rem; background: #fff; box-shadow: 0 12px 35px rgba(25,42,70,.09); }
fieldset { margin: 0 0 1rem; padding: 1rem; border: 1px solid #c9d7e5; border-radius: .8rem; }
legend { padding-inline: .35rem; font-weight: 700; }
fieldset div + div { margin-top: .85rem; }
label { display: block; margin-bottom: .3rem; font-weight: 650; }
input:not([type="checkbox"]), select { width: 100%; min-height: 2.7rem; padding: .65rem .75rem; border: 1px solid #8fa5ba; border-radius: .55rem; font: inherit; }
input:focus, select:focus, button:focus { outline: .2rem solid #77b7ee; outline-offset: .12rem; }
button { min-height: 2.7rem; padding: .65rem 1rem; border: 0; border-radius: .55rem; font: inherit; font-weight: 700; cursor: pointer; }
button[type="submit"] { background: #155e95; color: #fff; }
button[type="reset"] { background: #dce7f0; color: #20364a; }
footer { padding-block: 1rem 2rem; color: #4d5a6a; }
@media (max-width: 540px) { header, main, footer { width: min(100% - 1rem, 820px); } section { padding: 1rem; } button { width: 100%; margin-top: .5rem; } }
$ref_eba69df177$, 'bundle:exercise-reference:eba69df1772a', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"00a74bf5fad318be7fa92d0237b6ca4e79b5a68abfe2b8308076ca7b875c793f","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 2
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_c0f184899b$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Formulário acessível para cadastro de usuários em um sistema interno.">
    <title>Cadastro de Usuário | Portal DS</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <header>
        <h1>Cadastro de Usuário</h1>
        <p>Informe os dados necessários para liberar o acesso ao sistema interno.</p>
    </header>

    <main>
        <section aria-labelledby="titulo-cadastro">
            <h2 id="titulo-cadastro">Dados para acesso ao sistema</h2>
            <p id="orientacao-formulario">Todos os campos são obrigatórios.</p>

            <form action="#" method="post" aria-describedby="orientacao-formulario">
                <fieldset>
                    <legend>Identificação</legend>

                    <div>
                        <label for="nome">Nome completo</label>
                        <input type="text" id="nome" name="nome" autocomplete="name" required>
                    </div>

                    <div>
                        <label for="email">E-mail institucional</label>
                        <input type="email" id="email" name="email" autocomplete="email" required>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Vínculo com o sistema</legend>

                    <div>
                        <label for="perfil">Perfil de acesso</label>
                        <select id="perfil" name="perfil" required>
                            <option value="">Selecione um perfil</option>
                            <option value="aluno">Aluno</option>
                            <option value="professor">Professor</option>
                            <option value="suporte">Suporte técnico</option>
                        </select>
                    </div>

                    <div>
                        <label for="setor">Setor</label>
                        <select id="setor" name="setor" required>
                            <option value="">Selecione um setor</option>
                            <option value="desenvolvimento">Desenvolvimento de Sistemas</option>
                            <option value="laboratorio">Laboratório de Informática</option>
                            <option value="administracao">Administração</option>
                        </select>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Confirmação</legend>
                    <div>
                        <input type="checkbox" id="aceite" name="aceite" required>
                        <label for="aceite">Li e concordo com as regras de uso do sistema.</label>
                    </div>
                </fieldset>

                <div>
                    <button type="submit">Cadastrar usuário</button>
                    <button type="reset">Limpar formulário</button>
                </div>
            </form>
        </section>
    </main>

    <footer>
        <p>Projeto educacional — 3º DS · Programação no Desenvolvimento de Sistemas</p>
    </footer>
    <script src="script.js"></script>
</body>
</html>
$ref_c0f184899b$, 'bundle:exercise-reference:c0f184899b63', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"483847ee4e7d2474fecff84a5448212a14dccf37151db47d91cadce7006a28de","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 2
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_59ec26da65$// Arquivo de apoio. O envio real dos dados será estudado em exercícios posteriores.
const formulario = document.querySelector('form');
formulario?.addEventListener('submit', (event) => {
  event.preventDefault();
  console.info('Formulário válido e pronto para integração futura.');
});
console.info('Exercício 02 carregado.');
$ref_59ec26da65$, 'bundle:exercise-reference:59ec26da65fb', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"443255c890d86ba7376853476f4b10ddc88838bacd901c612578ed062284fcfe","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 2
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_352682f287$:root { font-family: Inter, system-ui, sans-serif; color: #172231; background: #eef3f8; }
* { box-sizing: border-box; }
body { margin: 0; line-height: 1.55; }
header, main, footer { width: min(100% - 2rem, 1080px); margin-inline: auto; }
header { padding-block: 2rem 1rem; }
section { padding: 1.35rem; border-radius: 1rem; background: #fff; box-shadow: 0 12px 35px rgba(25,42,70,.09); }
.table-scroll { overflow-x: auto; border: 1px solid #c7d5e3; border-radius: .8rem; }
table { width: 100%; min-width: 760px; border-collapse: collapse; }
caption { padding: 1rem; font-size: 1.1rem; font-weight: 750; text-align: left; color: #183f61; }
th, td { padding: .8rem .9rem; border-top: 1px solid #d8e1ea; text-align: left; vertical-align: top; }
thead th { background: #173f62; color: #fff; border-top: 0; }
tbody tr:nth-child(even) { background: #f5f8fb; }
tbody tr:hover, tbody tr:focus-visible { background: #e5f2ff; outline: .18rem solid #2e7fbd; outline-offset: -.18rem; }
.status { display: inline-block; padding: .25rem .55rem; border-radius: 999px; background: #e6eef5; font-weight: 700; white-space: nowrap; }
footer { padding-block: 1rem 2rem; color: #4d5a6a; }
@media (max-width: 540px) { header, main, footer { width: min(100% - 1rem, 1080px); } section { padding: .9rem; } }
$ref_352682f287$, 'bundle:exercise-reference:352682f287b9', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"604ab8fc1d842f34b3b8dd4b494fa96615ad673fbd12f21fbe1a79a76cb29c62","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 3
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_9e25694a96$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Tabela de chamados e ordens de serviço com cabeçalhos e status acessíveis.">
    <title>Registros e Status | Portal DS</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <header>
        <h1>Registros de Atendimento</h1>
        <p>Consulte os chamados, responsáveis, prioridades, prazos e situações atuais.</p>
    </header>

    <main>
        <section aria-labelledby="titulo-registros">
            <h2 id="titulo-registros">Chamados da equipe de suporte</h2>
            <p>Os estados são apresentados por texto para que a informação não dependa apenas de cores.</p>

            <div class="table-scroll" role="region" aria-label="Tabela rolável de chamados" tabindex="0">
                <table>
                    <caption>Ordens de serviço registradas em agosto de 2026</caption>
                    <thead>
                        <tr>
                            <th scope="col">Código</th>
                            <th scope="col">Responsável</th>
                            <th scope="col">Prioridade</th>
                            <th scope="col">Prazo</th>
                            <th scope="col">Situação</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr tabindex="0">
                            <td>OS-031</td>
                            <td>Ana Ribeiro</td>
                            <td>Alta</td>
                            <td><time datetime="2026-08-06">06/08/2026</time></td>
                            <td><span class="status">Em atendimento</span></td>
                        </tr>
                        <tr tabindex="0">
                            <td>OS-032</td>
                            <td>Bruno Lima</td>
                            <td>Média</td>
                            <td><time datetime="2026-08-08">08/08/2026</time></td>
                            <td><span class="status">Aguardando usuário</span></td>
                        </tr>
                        <tr tabindex="0">
                            <td>OS-033</td>
                            <td>Carla Souza</td>
                            <td>Baixa</td>
                            <td><time datetime="2026-08-12">12/08/2026</time></td>
                            <td><span class="status">Planejado</span></td>
                        </tr>
                        <tr tabindex="0">
                            <td>OS-034</td>
                            <td>Diego Martins</td>
                            <td>Alta</td>
                            <td><time datetime="2026-08-05">05/08/2026</time></td>
                            <td><span class="status">Concluído</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </main>

    <footer>
        <p>Projeto educacional — 3º DS · Programação no Desenvolvimento de Sistemas</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>$ref_9e25694a96$, 'bundle:exercise-reference:9e25694a96f0', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"f6a1faa8529a0bc56f924949efba8a6e33cd57909562f8f856dedadd99f21dce","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 3
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_b64e12f64d$// Arquivo de apoio. O foco pedagógico deste exercício é a tabela semântica.
document.querySelectorAll('tbody tr').forEach((linha) => {
  linha.addEventListener('click', () => linha.focus());
});
console.info('Exercício 03 carregado.');
$ref_b64e12f64d$, 'bundle:exercise-reference:b64e12f64d02', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"7628319d477cd0f6bee8d934920a631a7828f9d4bdbc4c6be8cfced3d9d095ca","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 3
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'chamados.html', 'html', $ref_877c8a4d6e$<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="estilo.css"><title>Chamados</title></head><body><nav><a href="index.html">Início</a> <a href="chamados.html">Chamados</a> <a href="equipe.html">Equipe</a></nav><main><h1>Chamados</h1><p>CH-101 - Rede do laboratório</p></main><script src="script.js"></script></body></html>
$ref_877c8a4d6e$, 'bundle:exercise-reference-catalog-current:877c8a4d6ef0', 'Histórica • exercise-reference-catalog-current', 'bundle_snapshot', 'exercise-reference-catalog-current', false, true, '{"bundle_source":"exercise-reference-catalog-current","sha256":"de72bf62a0eaf987a2b16d53fc4d98d6f4e7e540745a27ab7e050b39df099a48","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'equipe.html', 'html', $ref_9f5e4f85f1$<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="estilo.css"><title>Equipe</title></head><body><nav><a href="index.html">Início</a> <a href="chamados.html">Chamados</a> <a href="equipe.html">Equipe</a></nav><main><h1>Equipe</h1><p>Responsáveis pelo atendimento.</p></main><script src="script.js"></script></body></html>
$ref_9f5e4f85f1$, 'bundle:exercise-reference-catalog-current:9f5e4f85f1b1', 'Histórica • exercise-reference-catalog-current', 'bundle_snapshot', 'exercise-reference-catalog-current', false, true, '{"bundle_source":"exercise-reference-catalog-current","sha256":"7561fc661edf5abd4d2edf290b1e4c45cf2ba6af2dd2d83e5b52c75103543022","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_7879a62d7e$body { font-family: system-ui, sans-serif; margin: 0; line-height: 1.6; background: #eef3f8; color: #172231; }
header, main { width: min(100% - 2rem, 900px); margin-inline: auto; }
nav a { margin-right: .75rem; }
$ref_7879a62d7e$, 'bundle:exercise-reference-catalog-current:7879a62d7ea9', 'Histórica • exercise-reference-catalog-current', 'bundle_snapshot', 'exercise-reference-catalog-current', false, true, '{"bundle_source":"exercise-reference-catalog-current","sha256":"9126257f7b671feeea47d52fec01a00955d0313074d32f8a307ee475317adee0","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_c09b91122e$:root {
  font-family: Inter, system-ui, sans-serif;
  color: #eaf2ff;
  background: #07111f;
}
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; background: linear-gradient(160deg, #07111f, #0d2139); }
.topo, main { width: min(1100px, calc(100% - 2rem)); margin-inline: auto; }
.topo { padding: 2.5rem 0 1.5rem; }
.etiqueta { color: #67d3ff; font-weight: 800; }
h1 { margin: .35rem 0; font-size: clamp(2rem, 6vw, 3.8rem); }
.filtros { display: flex; flex-wrap: wrap; gap: .65rem; margin-bottom: 1rem; }
.filtro { padding: .7rem 1rem; border: 1px solid #31506f; border-radius: .8rem; background: #10243a; color: #eaf2ff; cursor: pointer; }
.filtro.ativo, .filtro[aria-pressed="true"] { background: #67d3ff; color: #05111d; border-color: #67d3ff; }
.filtro:focus-visible { outline: 3px solid #a7e8ff; outline-offset: 3px; }
.grade-tarefas { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; padding-bottom: 2rem; }
.tarefa { min-width: 0; padding: 1.15rem; border: 1px solid #284560; border-radius: 1rem; background: #10243a; }
.tarefa h2 { font-size: 1.05rem; line-height: 1.3; }
.situacao { display: inline-block; padding: .3rem .55rem; border-radius: 999px; background: #173653; color: #bfeaff; font-size: .8rem; font-weight: 800; }
.tarefa[hidden] { display: none; }
@media (max-width: 760px) {
  .grade-tarefas { grid-template-columns: 1fr; }
  .filtros { display: grid; grid-template-columns: 1fr 1fr; }
}
$ref_c09b91122e$, 'bundle:exercise-reference:c09b91122e55', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"51956daa0ce24861642aeeae9009c7e810a49d6be84e2ade1762e9342f80431b","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_2862b6acd4$<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Central DS - Início</title>
  <link rel="stylesheet" href="estilo.css">
</head>
<body>
  <header><h1>Central de Atendimento DS</h1><nav><a href="index.html">Início</a> <a href="chamados.html">Chamados</a> <a href="equipe.html">Equipe</a></nav></header>
  <main><h2>Visão geral</h2><p>Projeto com páginas separadas e caminhos relativos.</p></main>
  <script src="script.js"></script>
</body>
</html>
$ref_2862b6acd4$, 'bundle:exercise-reference-catalog-current:2862b6acd4c0', 'Histórica • exercise-reference-catalog-current', 'bundle_snapshot', 'exercise-reference-catalog-current', false, true, '{"bundle_source":"exercise-reference-catalog-current","sha256":"908bb332d1def68393ad408da6512eef1d98f83d8fbcb4628e38341e4b0e4675","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_4058de7dd2$<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Painel de Prioridades</title>
  <link rel="stylesheet" href="estilo.css">
</head>
<body>
  <header class="topo">
    <p class="etiqueta">3DS · Desenvolvimento de Sistemas</p>
    <h1>Painel de Prioridades</h1>
    <p>Filtre as tarefas pelo estado atual de atendimento.</p>
  </header>

  <main>
    <section class="filtros" aria-label="Filtrar tarefas">
      <button class="filtro ativo" data-filter="todos" aria-pressed="true">Todos</button>
      <button class="filtro" data-filter="pendente" aria-pressed="false">Pendente</button>
      <button class="filtro" data-filter="andamento" aria-pressed="false">Em andamento</button>
      <button class="filtro" data-filter="concluido" aria-pressed="false">Concluído</button>
    </section>

    <section class="grade-tarefas" aria-label="Tarefas do painel">
      <article class="tarefa" data-status="pendente">
        <span class="situacao">Pendente</span>
        <h2>Revisar cadastro de usuários</h2>
        <p><strong>Responsável:</strong> Equipe de suporte</p>
      </article>
      <article class="tarefa" data-status="andamento">
        <span class="situacao">Em andamento</span>
        <h2>Ajustar formulário de chamados</h2>
        <p><strong>Responsável:</strong> Front-end</p>
      </article>
      <article class="tarefa" data-status="concluido">
        <span class="situacao">Concluído</span>
        <h2>Atualizar documentação</h2>
        <p><strong>Responsável:</strong> Análise</p>
      </article>
      <article class="tarefa" data-status="pendente">
        <span class="situacao">Pendente</span>
        <h2>Conferir permissões do painel</h2>
        <p><strong>Responsável:</strong> Segurança</p>
      </article>
      <article class="tarefa" data-status="andamento">
        <span class="situacao">Em andamento</span>
        <h2>Testar versão mobile</h2>
        <p><strong>Responsável:</strong> QA</p>
      </article>
      <article class="tarefa" data-status="concluido">
        <span class="situacao">Concluído</span>
        <h2>Organizar backlog da sprint</h2>
        <p><strong>Responsável:</strong> Produto</p>
      </article>
    </section>
  </main>

  <script src="script.js"></script>
</body>
</html>
$ref_4058de7dd2$, 'bundle:exercise-reference:4058de7dd231', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"62e9f8a14f05edda1c498f05440643dbc275bef9890c94df02751103aad52148","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_5d069636d2$console.info('Exercício 04: navegação multipágina carregada.');
$ref_5d069636d2$, 'bundle:exercise-reference-catalog-current:5d069636d21e', 'Histórica • exercise-reference-catalog-current', 'bundle_snapshot', 'exercise-reference-catalog-current', false, true, '{"bundle_source":"exercise-reference-catalog-current","sha256":"a471a932b50a47519bc29f182d8de3c8cf32f1934c6c7febe84583d1f764ac04","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_75fe3fb4bc$const filtros = document.querySelectorAll('[data-filter]');
const tarefas = document.querySelectorAll('[data-status]');

filtros.forEach((botao) => {
  botao.addEventListener('click', () => {
    const filtroSelecionado = botao.dataset.filter;

    filtros.forEach((item) => {
      const ativo = item === botao;
      item.classList.toggle('ativo', ativo);
      item.setAttribute('aria-pressed', String(ativo));
    });

    tarefas.forEach((tarefa) => {
      const mostrar = filtroSelecionado === 'todos' || tarefa.dataset.status === filtroSelecionado;
      tarefa.hidden = !mostrar;
    });
  });
});
$ref_75fe3fb4bc$, 'bundle:exercise-reference:75fe3fb4bcdc', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"9bd5d94f8a10e667b5fc7cde406d650884b08ef4a3cab4e451d850b9f7d90b3c","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_891f5ab6c8$* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; background: #f4f7fb; color: #182233; }
header, main, footer { width: min(1080px, 92%); margin: auto; }
header { padding: 24px 0 12px; }
nav { display: flex; flex-wrap: wrap; gap: 12px; }
main { display: grid; gap: 16px; padding: 16px 0 32px; }
section { padding: 18px; background: #fff; border: 1px solid #d8e0ea; border-radius: 14px; }
.indicadores { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }
.indicadores article { padding: 14px; border: 1px solid #d8e0ea; border-radius: 10px; }
form { display: grid; gap: 8px; }
input, select, button { min-height: 42px; font: inherit; }
.tabela-responsiva { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 10px; border-bottom: 1px solid #d8e0ea; text-align: left; }
$ref_891f5ab6c8$, 'bundle:exercise-reference-3ds-restored:891f5ab6c8b0', 'Histórica • exercise-reference-3ds-restored', 'bundle_snapshot', 'exercise-reference-3ds-restored', false, true, '{"bundle_source":"exercise-reference-3ds-restored","sha256":"bdff23702843ff399a92f39b6c807ba3971e6e0a955d3c2abfec3711605ad166","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 5
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_5a522c75aa$<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Painel administrativo</title>
  <link rel="stylesheet" href="estilo.css">
  <script src="script.js" defer></script>
</head>
<body>
  <header>
    <h1>Painel administrativo</h1>
    <nav aria-label="Navegação do painel">
      <a href="#visao-geral">Visão geral</a>
      <a href="#indicadores">Indicadores</a>
      <a href="#cadastro">Cadastro</a>
      <a href="#registros">Registros</a>
    </nav>
  </header>

  <main>
    <section id="visao-geral">
      <h2>Visão geral</h2>
      <p>Acompanhe os dados principais e registre novos usuários.</p>
      <a href="#cadastro">Ir para o cadastro</a>
    </section>

    <section id="indicadores">
      <h2>Indicadores</h2>
      <div class="indicadores">
        <article><h3>Usuários</h3><strong>24</strong><p>Cadastros ativos</p></article>
        <article><h3>Projetos</h3><strong>8</strong><p>Projetos em andamento</p></article>
        <article><h3>Alertas</h3><strong>3</strong><p>Itens para revisar</p></article>
        <article><h3>Entregas</h3><strong>17</strong><p>Entregas concluídas</p></article>
      </div>
    </section>

    <section id="cadastro">
      <h2>Novo usuário</h2>
      <form id="formCadastro">
        <label for="nome">Nome</label>
        <input id="nome" name="nome" type="text" autocomplete="name" required>

        <label for="email">E-mail</label>
        <input id="email" name="email" type="email" autocomplete="email" required>

        <label for="setor">Setor</label>
        <select id="setor" name="setor" required>
          <option value="">Selecione</option>
          <option>Desenvolvimento</option>
          <option>Suporte</option>
        </select>

        <fieldset>
          <legend>Status inicial</legend>
          <label><input type="radio" name="status" value="Ativo" required> Ativo</label>
          <label><input type="radio" name="status" value="Pendente"> Pendente</label>
        </fieldset>

        <label for="observacao">Observação</label>
        <input id="observacao" name="observacao" type="text">

        <button type="submit">Cadastrar</button>
        <button type="reset">Limpar</button>
      </form>
      <p id="mensagem" role="status" aria-live="polite"></p>
    </section>

    <section id="registros">
      <h2>Registros</h2>
      <div class="tabela-responsiva">
        <table>
          <caption>Usuários cadastrados no sistema</caption>
          <thead>
            <tr><th scope="col">Nome</th><th scope="col">E-mail</th><th scope="col">Setor</th><th scope="col">Perfil</th><th scope="col">Status</th></tr>
          </thead>
          <tbody>
            <tr><td>Ana Lima</td><td>ana@exemplo.com</td><td>Desenvolvimento</td><td>Aluna</td><td>Ativo</td></tr>
            <tr><td>Bruno Reis</td><td>bruno@exemplo.com</td><td>Suporte</td><td>Monitor</td><td>Pendente</td></tr>
            <tr><td>Carla Dias</td><td>carla@exemplo.com</td><td>Desenvolvimento</td><td>Aluna</td><td>Ativo</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>

  <footer><p>Protótipo administrativo • 3DS</p></footer>
</body>
</html>
$ref_5a522c75aa$, 'bundle:exercise-reference-3ds-restored:5a522c75aaf8', 'Histórica • exercise-reference-3ds-restored', 'bundle_snapshot', 'exercise-reference-3ds-restored', false, true, '{"bundle_source":"exercise-reference-3ds-restored","sha256":"5d7c21a7a83b4b3065feb40403178fa2bb207ef40909fcb74e18d965a3a06422","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 5
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_b0f1d42fdb$const formulario = document.querySelector('#formCadastro');
const mensagem = document.querySelector('#mensagem');

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const nome = document.querySelector('#nome').value.trim();
  mensagem.textContent = nome ? `Cadastro de ${nome} preparado com sucesso.` : 'Preencha o nome.';
});
$ref_b0f1d42fdb$, 'bundle:exercise-reference-3ds-restored:b0f1d42fdbb2', 'Histórica • exercise-reference-3ds-restored', 'bundle_snapshot', 'exercise-reference-3ds-restored', false, true, '{"bundle_source":"exercise-reference-3ds-restored","sha256":"d9ee2f5fc98bdd8c01a8ed20f1c00097aabb1c9522bf5089d92c6ee1adda233a","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 5
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_8656eb1a2f$*, *::before, *::after { box-sizing: border-box; }
:root { --fundo:#eef3f8; --painel:#ffffff; --borda:#cad5e1; --texto:#1b2735; --destaque:#1264a3; }
body { margin: 0; min-height: 100vh; font-family: system-ui, sans-serif; background: var(--fundo); color: var(--texto); }
.painel { width: min(1000px, 92%); margin: 0 auto; padding: 32px 0; }
.cabecalho-painel { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 20px; }
.rotulo { margin: 0; color: var(--destaque); font-weight: 800; }
.grade-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 16px; }
.card { min-width: 0; margin: 0; padding: 20px; border: 2px solid var(--borda); border-radius: 14px; background: var(--painel); overflow-wrap: anywhere; }
.card h2 { margin: 0 0 12px; font-size: 1rem; }
.card strong { display: block; margin-bottom: 8px; font-size: 2rem; }
.card p { margin: 0; }
.painel.compacto .grade-cards { gap: 8px; }
.painel.compacto .card { padding: 12px; border-width: 1px; }
button { min-height: 42px; padding: 0 14px; border: 0; border-radius: 9px; background: var(--destaque); color: white; font: inherit; cursor: pointer; }
@media (max-width: 640px) { .cabecalho-painel { align-items: stretch; flex-direction: column; } }
$ref_8656eb1a2f$, 'bundle:exercise-reference-3ds-restored:8656eb1a2f99', 'Histórica • exercise-reference-3ds-restored', 'bundle_snapshot', 'exercise-reference-3ds-restored', false, true, '{"bundle_source":"exercise-reference-3ds-restored","sha256":"a073aa031bd1f88de302d02ebe1582430afebbd481eb57e86c4b5aac17e582aa","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 6
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_bb2ec5d640$<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cards e Box Model</title>
  <link rel="stylesheet" href="estilo.css">
  <script src="script.js" defer></script>
</head>
<body>
  <main class="painel">
    <header class="cabecalho-painel">
      <div><p class="rotulo">3DS</p><h1>Indicadores do projeto</h1></div>
      <button id="alternarEspacamento" type="button">Alternar espaçamento</button>
    </header>

    <section class="grade-cards" aria-label="Indicadores">
      <article class="card"><h2>Tarefas</h2><strong>12</strong><p>Itens planejados</p></article>
      <article class="card"><h2>Concluídas</h2><strong>7</strong><p>Entregas finalizadas</p></article>
      <article class="card"><h2>Revisões</h2><strong>3</strong><p>Itens em validação</p></article>
      <article class="card"><h2>Pendências</h2><strong>2</strong><p>Itens para corrigir</p></article>
    </section>
  </main>
</body>
</html>
$ref_bb2ec5d640$, 'bundle:exercise-reference-3ds-restored:bb2ec5d64012', 'Histórica • exercise-reference-3ds-restored', 'bundle_snapshot', 'exercise-reference-3ds-restored', false, true, '{"bundle_source":"exercise-reference-3ds-restored","sha256":"a0471e4e33c79c78dc58ea8f1e9ca042d581c58869a3ddda8b7b141bc054d350","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 6
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_40b3a53c5c$const painel = document.querySelector('.painel');
const botao = document.querySelector('#alternarEspacamento');

botao.addEventListener('click', () => {
  const compacto = painel.classList.toggle('compacto');
  botao.textContent = compacto ? 'Usar espaçamento normal' : 'Alternar espaçamento';
});
$ref_40b3a53c5c$, 'bundle:exercise-reference-3ds-restored:40b3a53c5c7c', 'Histórica • exercise-reference-3ds-restored', 'bundle_snapshot', 'exercise-reference-3ds-restored', false, true, '{"bundle_source":"exercise-reference-3ds-restored","sha256":"fd17d29ef70a77b4d5b545c3bbab6b561ccda7c4725bbf0f9612b11dee240910","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 6
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_8726ef6c97$* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; background: #f3f6fa; color: #172033; }
main { width: min(1040px, 92%); margin: auto; padding: 30px 0; }
.barra-ferramentas { display: flex; justify-content: space-between; align-items: end; flex-wrap: wrap; gap: 14px; padding: 16px; border: 1px solid #ccd6e2; border-radius: 12px; background: white; }
.grupo-busca { display: flex; flex: 1 1 280px; flex-direction: column; gap: 6px; min-width: 0; }
.grupo-acoes { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
input, button { min-height: 44px; border-radius: 9px; font: inherit; }
input { width: 100%; padding: 8px 11px; border: 1px solid #b9c6d5; }
button { padding: 0 14px; border: 0; background: #1264a3; color: white; cursor: pointer; }
button:focus-visible, input:focus-visible { outline: 3px solid #7dc7ff; outline-offset: 2px; }
.lista-projetos { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 12px; margin-top: 16px; }
.projeto { padding: 16px; border: 1px solid #ccd6e2; border-radius: 12px; background: white; }
@media (max-width: 680px) { .grupo-acoes, .grupo-acoes button { width: 100%; } }
$ref_8726ef6c97$, 'bundle:exercise-reference-3ds-restored:8726ef6c9716', 'Histórica • exercise-reference-3ds-restored', 'bundle_snapshot', 'exercise-reference-3ds-restored', false, true, '{"bundle_source":"exercise-reference-3ds-restored","sha256":"cd49f66256a7a9865d742da96e25ef29c3eaeb9fd91460d86eee6e9f5e5d76e3","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 7
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_656b454058$<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Toolbar com Flexbox</title>
  <link rel="stylesheet" href="estilo.css">
  <script src="script.js" defer></script>
</head>
<body>
  <main>
    <h1>Projetos da turma</h1>
    <section class="barra-ferramentas" aria-label="Ferramentas do painel">
      <div class="grupo-busca">
        <label for="busca">Buscar projeto</label>
        <input id="busca" type="search" placeholder="Digite um nome">
      </div>
      <div class="grupo-acoes">
        <button id="filtrar" type="button">Filtrar</button>
        <button id="ordenar" type="button">Ordenar</button>
        <button id="novo" type="button">Novo projeto</button>
      </div>
    </section>

    <section class="lista-projetos" id="listaProjetos">
      <article class="projeto"><h2>Portal escolar</h2><p>Front-End</p></article>
      <article class="projeto"><h2>Dashboard DS</h2><p>Interface</p></article>
      <article class="projeto"><h2>API acadêmica</h2><p>Back-End</p></article>
    </section>
    <p id="status" role="status" aria-live="polite"></p>
  </main>
</body>
</html>
$ref_656b454058$, 'bundle:exercise-reference-3ds-restored:656b45405894', 'Histórica • exercise-reference-3ds-restored', 'bundle_snapshot', 'exercise-reference-3ds-restored', false, true, '{"bundle_source":"exercise-reference-3ds-restored","sha256":"8632bb55df346eb95830e759826fbb667e5016163bf3a867c6188f339163b095","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 7
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_e9a542ac81$const busca = document.querySelector('#busca');
const projetos = [...document.querySelectorAll('.projeto')];
const status = document.querySelector('#status');

busca.addEventListener('input', () => {
  const termo = busca.value.trim().toLowerCase();
  let visiveis = 0;
  projetos.forEach((projeto) => {
    const mostrar = projeto.textContent.toLowerCase().includes(termo);
    projeto.hidden = !mostrar;
    if (mostrar) visiveis += 1;
  });
  status.textContent = `${visiveis} projeto(s) visível(is).`;
});
$ref_e9a542ac81$, 'bundle:exercise-reference-3ds-restored:e9a542ac8108', 'Histórica • exercise-reference-3ds-restored', 'bundle_snapshot', 'exercise-reference-3ds-restored', false, true, '{"bundle_source":"exercise-reference-3ds-restored","sha256":"3c25ff808e2ee70db74fef644f032cabd2d1f7e54831507b14cdf72e1d3a9969","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 7
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_5265b5d914$* { box-sizing: border-box; }
:root { --fundo:#edf2f7; --painel:#fff; --borda:#d2dce8; --texto:#172033; --destaque:#135f99; }
body { margin: 0; font-family: system-ui, sans-serif; background: var(--fundo); color: var(--texto); }
.dashboard-grid { width: min(1180px, 94%); margin: 24px auto; display: grid; grid-template-columns: minmax(180px, .7fr) repeat(2, minmax(0, 1fr)); grid-template-areas: "menu indicadores indicadores" "menu atividade tarefas" "menu registros registros"; gap: 14px; }
.menu { grid-area: menu; display: flex; flex-direction: column; gap: 10px; padding: 18px; border-radius: 14px; background: #13243a; color: white; }
.menu a { color: #d9efff; }
.indicadores { grid-area: indicadores; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
.indicadores article, .painel { min-width: 0; padding: 16px; border: 1px solid var(--borda); border-radius: 14px; background: var(--painel); }
.indicadores strong { display: block; margin-top: 6px; font-size: 1.8rem; }
.atividade { grid-area: atividade; }
.tarefas { grid-area: tarefas; }
.registros { grid-area: registros; }
.tabela { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 10px; border-bottom: 1px solid var(--borda); text-align: left; }
.dashboard-grid.compacto { gap: 7px; }
.dashboard-grid.compacto .painel, .dashboard-grid.compacto .indicadores article { padding: 10px; }
button { min-height: 42px; padding: 0 14px; border: 0; border-radius: 8px; background: var(--destaque); color: white; font: inherit; }
@media (max-width: 900px) { .dashboard-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-areas: "menu menu" "indicadores indicadores" "atividade tarefas" "registros registros"; } .menu { flex-direction: row; flex-wrap: wrap; align-items: center; } .indicadores { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 620px) { .dashboard-grid { grid-template-columns: 1fr; grid-template-areas: "menu" "indicadores" "atividade" "tarefas" "registros"; } .indicadores { grid-template-columns: 1fr; } }
$ref_5265b5d914$, 'bundle:exercise-reference-3ds-restored:5265b5d914af', 'Histórica • exercise-reference-3ds-restored', 'bundle_snapshot', 'exercise-reference-3ds-restored', false, true, '{"bundle_source":"exercise-reference-3ds-restored","sha256":"7d2fd666d48237fd6c961543db4fa27ea2b0fc2fdf67dd8dca168032eb8344e8","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 8
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_32eac6bbf1$<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard com CSS Grid</title>
  <link rel="stylesheet" href="estilo.css">
  <script src="script.js" defer></script>
</head>
<body>
  <main class="dashboard-grid" id="dashboard">
    <nav class="menu"><h1>DS Admin</h1><a href="#indicadores">Indicadores</a><a href="#atividade">Atividade</a><a href="#registros">Registros</a></nav>

    <section class="indicadores" id="indicadores">
      <article><span>Projetos</span><strong>18</strong></article>
      <article><span>Alunos</span><strong>32</strong></article>
      <article><span>Entregas</span><strong>74</strong></article>
      <article><span>Pendências</span><strong>6</strong></article>
    </section>

    <section class="painel atividade" id="atividade"><h2>Atividade recente</h2><p>Última sincronização há poucos minutos.</p><button id="densidade" type="button">Alternar densidade</button></section>
    <section class="painel tarefas"><h2>Tarefas</h2><ul><li>Revisar layout</li><li>Testar responsividade</li><li>Publicar projeto</li></ul></section>
    <section class="painel registros" id="registros"><h2>Registros</h2><div class="tabela"><table><thead><tr><th>Projeto</th><th>Status</th></tr></thead><tbody><tr><td>Portal</td><td>Ativo</td></tr><tr><td>Dashboard</td><td>Revisão</td></tr></tbody></table></div></section>
  </main>
</body>
</html>
$ref_32eac6bbf1$, 'bundle:exercise-reference-3ds-restored:32eac6bbf1fb', 'Histórica • exercise-reference-3ds-restored', 'bundle_snapshot', 'exercise-reference-3ds-restored', false, true, '{"bundle_source":"exercise-reference-3ds-restored","sha256":"459e6d33348bb589b7cd7ec9348c8d65ff9c99f6a958447d869c58faacc44bd2","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 8
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_05551be520$const dashboard = document.querySelector('#dashboard');
const botao = document.querySelector('#densidade');

botao.addEventListener('click', () => {
  const compacto = dashboard.classList.toggle('compacto');
  botao.textContent = compacto ? 'Usar densidade normal' : 'Alternar densidade';
});
$ref_05551be520$, 'bundle:exercise-reference-3ds-restored:05551be52019', 'Histórica • exercise-reference-3ds-restored', 'bundle_snapshot', 'exercise-reference-3ds-restored', false, true, '{"bundle_source":"exercise-reference-3ds-restored","sha256":"39814472cfec1fa383b62397e1e22e127756b2168b1febf799abbf2fa60a7666","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number = 8
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'README.md', 'markdown', $ref_25f92040d1$# FE01 - Meu primeiro projeto Front-End

Primeiro projeto da disciplina **Programação Front-End**, organizado para testar a ligação entre HTML, CSS e JavaScript.

## Estrutura da pasta

```text
exercicio-01/
-  index.html
-  estilo.css
-  script.js
-  README.md
```

## Como executar

1. Abra a pasta no Visual Studio Code.
2. Abra o arquivo `index.html` no navegador ou utilize a extensão Live Server.
3. Clique em **Verificar projeto**.
4. Confirme se a mensagem de sucesso aparece na página.

## Identificação do estudante

- Nome: **substitua pelo seu nome**
- Turma: **2 DS Subsequente - Noturno**
- Forma escolhida para executar: **descreva aqui**

## Entrega

Envie o link do repositório solicitado pelo professor e anexe a evidência gerada pela plataforma.
$ref_25f92040d1$, 'bundle:exercise-reference:25f92040d193', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"e6eccc93b86ee64c7cd5551c23dbfdcfd6e1903ed08a1dca05e40bc2600bd526","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 1
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_b3ca971cc2$:root {
    --fundo: #07111f;
    --painel: #10243a;
    --painel-claro: #173653;
    --texto: #f3f7ff;
    --texto-suave: #b8c7da;
    --destaque: #38bdf8;
    --sucesso: #4ade80;
    --borda: #2b4d6c;
}

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    font-family: Arial, Helvetica, sans-serif;
    background: linear-gradient(145deg, #050b14, var(--fundo));
    color: var(--texto);
}

.cabecalho,
main,
footer {
    width: min(960px, 92%);
    margin-inline: auto;
}

.cabecalho {
    padding: 48px 0 24px;
}

.etiqueta {
    color: var(--destaque);
    font-weight: 700;
    letter-spacing: 0.04em;
}

h1,
h2,
p {
    margin-top: 0;
}

h1 {
    font-size: clamp(2rem, 5vw, 3.7rem);
    margin-bottom: 12px;
}

p,
span {
    color: var(--texto-suave);
    line-height: 1.6;
}

.painel {
    padding: 24px;
    margin-bottom: 20px;
    background: rgba(16, 36, 58, 0.92);
    border: 1px solid var(--borda);
    border-radius: 18px;
}

.grade-arquivos {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
}

article {
    display: grid;
    gap: 8px;
    padding: 18px;
    background: var(--painel-claro);
    border: 1px solid var(--borda);
    border-radius: 14px;
}

button {
    min-height: 48px;
    padding: 12px 18px;
    border: 0;
    border-radius: 12px;
    background: var(--destaque);
    color: #04131f;
    font: inherit;
    font-weight: 800;
    cursor: pointer;
}

button:hover,
button:focus-visible {
    filter: brightness(1.1);
}

.status {
    margin-top: 16px;
    padding: 14px;
    background: #07192a;
    border-left: 4px solid var(--destaque);
    border-radius: 8px;
}

.status.sucesso {
    color: var(--sucesso);
    border-left-color: var(--sucesso);
}

footer {
    padding: 8px 0 36px;
}

@media (max-width: 640px) {
    .cabecalho {
        padding-top: 28px;
    }

    .painel {
        padding: 18px;
    }

    .grade-arquivos {
        grid-template-columns: 1fr;
    }

    button {
        width: 100%;
    }
}
$ref_b3ca971cc2$, 'bundle:exercise-reference:b3ca971cc2b4', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"bcc0900e7894bb4f8f71deb4cc5450323f8ecde701ed758b23fa31d4fa3e5c93","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 1
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_3afac018ab$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meu primeiro projeto Front-End</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <header class="cabecalho">
        <p class="etiqueta">Programação Front-End - 2 DS Subsequente</p>
        <h1>Meu primeiro projeto Front-End</h1>
        <p>Uma página organizada para conferir se HTML, CSS e JavaScript estão conectados corretamente.</p>
    </header>

    <main>
        <section class="painel" aria-labelledby="titulo-arquivos">
            <h2 id="titulo-arquivos">Arquivos do projeto</h2>
            <div class="grade-arquivos">
                <article>
                    <strong>index.html</strong>
                    <span>Organiza o conteúdo e conecta os demais arquivos.</span>
                </article>
                <article>
                    <strong>estilo.css</strong>
                    <span>Controla cores, espaçamentos e responsividade.</span>
                </article>
                <article>
                    <strong>script.js</strong>
                    <span>Adiciona comportamento e responde às ações do usuário.</span>
                </article>
                <article>
                    <strong>README.md</strong>
                    <span>Documenta o projeto, o estudante e a forma de execução.</span>
                </article>
            </div>
        </section>

        <section class="painel" aria-labelledby="titulo-teste">
            <h2 id="titulo-teste">Teste do ambiente</h2>
            <p>Abra a página no navegador e use o botão para verificar a ligação entre os arquivos.</p>
            <button id="testarProjeto" type="button">Verificar projeto</button>
            <p id="statusProjeto" class="status" aria-live="polite">Aguardando a verificação.</p>
        </section>
    </main>

    <footer>
        <p>Exercício FE01 - Colégio Estadual Alberto Gomes Veiga</p>
    </footer>
</body>
</html>
$ref_3afac018ab$, 'bundle:exercise-reference:3afac018ab4d', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"514f40f0d4e0bd3342b6577bd181a77ac03bea7700ff0700f03f7060d26ac135","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 1
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_18b5437bc0$const botaoTeste = document.querySelector('#testarProjeto');
const statusProjeto = document.querySelector('#statusProjeto');

botaoTeste.addEventListener('click', () => {
    statusProjeto.textContent = 'Projeto verificado: HTML, CSS e JavaScript estão conectados.';
    statusProjeto.classList.add('sucesso');
    botaoTeste.textContent = 'Ambiente verificado';
});
$ref_18b5437bc0$, 'bundle:exercise-reference:18b5437bc0db', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"6677f0f82ea6e066183d3a2b4ff223aa7a767af68425354bdbb0bbe38da86977","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 1
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_7a8fc6158f$<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exercício 10 — Login Simples com Condição em JavaScript</title>
</head>
<body>
  <h1>Exercício 10 — Login Simples com Condição em JavaScript</h1>
  <input id="entrada1" placeholder="Usuário">
  <input id="entrada2" placeholder="Senha">
  <button id="executar">Executar</button>
  <p id="saida">Resultado aparecerá aqui.</p>
  <script src="script.js"></script>
</body>
</html>$ref_7a8fc6158f$, 'bundle:exercise-reference-synced:7a8fc6158f04', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"312b35db92fadf631611fa0e9de574f66ce777558bcc926700c3d08a28eb3e87","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 10
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_fe9a1ebf15$// Exercício 10 — Login simples
const usuario = document.querySelector("#entrada1");
const senha = document.querySelector("#entrada2");
const saida = document.querySelector("#saida");

document.querySelector("#executar").addEventListener("click", () => {
  if (usuario.value === "aluno" && senha.value === "1234") {
    saida.textContent = "Acesso liberado.";
  } else {
    saida.textContent = "Usuário ou senha inválidos.";
  }
});
$ref_fe9a1ebf15$, 'bundle:exercise-reference-synced:fe9a1ebf153b', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"28aa8cb4288f5c3d812165bbe49318a9a031e817ea76dd33b5aa584f0b304377","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 10
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_fdc509e88a$:root {
    --fundo: #08121f;
    --superficie: #10243a;
    --superficie-clara: #183754;
    --texto: #f5f8ff;
    --texto-suave: #c2cede;
    --destaque: #67e8f9;
    --borda: #31516f;
    --sucesso: #86efac;
}

* {
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    background: var(--fundo);
    color: var(--texto);
}

.pular-conteudo {
    position: absolute;
    left: 16px;
    top: -80px;
    padding: 12px 16px;
    background: var(--destaque);
    color: #04131f;
    font-weight: 700;
    border-radius: 8px;
}

.pular-conteudo:focus {
    top: 16px;
}

.cabecalho,
main,
footer {
    width: min(900px, 92%);
    margin-inline: auto;
}

.cabecalho {
    padding: 52px 0 28px;
}

.etiqueta {
    color: var(--destaque);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

h1 {
    max-width: 760px;
    margin: 0 0 12px;
    font-size: clamp(2.2rem, 7vw, 4.6rem);
    line-height: 1;
}

h2,
h3,
p {
    margin-top: 0;
}

p,
li,
address {
    color: var(--texto-suave);
    line-height: 1.65;
}

nav {
    margin-top: 26px;
    padding-top: 18px;
    border-top: 1px solid var(--borda);
}

nav ul {
    margin: 0;
    padding: 0;
    list-style: none;
}

nav li {
    display: inline-block;
    margin: 0 18px 10px 0;
}

a {
    color: var(--destaque);
}

nav a {
    font-weight: 700;
    text-decoration-thickness: 2px;
    text-underline-offset: 5px;
}

section,
aside,
footer {
    margin-bottom: 22px;
    padding: 24px;
    background: var(--superficie);
    border: 1px solid var(--borda);
    border-radius: 16px;
}

article {
    margin-top: 14px;
    padding: 18px;
    background: var(--superficie-clara);
    border-left: 4px solid var(--destaque);
    border-radius: 10px;
}

ol {
    padding-left: 24px;
}

button {
    min-height: 48px;
    padding: 12px 18px;
    border: 0;
    border-radius: 10px;
    background: var(--destaque);
    color: #04131f;
    font: inherit;
    font-weight: 800;
    cursor: pointer;
}

button:hover,
button:focus-visible {
    filter: brightness(1.08);
}

#detalhesAtendimento {
    margin-top: 18px;
    padding: 16px;
    border: 1px solid var(--sucesso);
    border-radius: 10px;
}

#detalhesAtendimento p:last-child {
    margin-bottom: 0;
}

footer {
    margin-bottom: 38px;
}

address {
    font-style: normal;
}

@media (max-width: 520px) {
    .cabecalho {
        padding-top: 34px;
    }

    section,
    aside,
    footer {
        padding: 18px;
    }

    nav li {
        display: block;
        margin-right: 0;
    }

    button {
        width: 100%;
    }
}
$ref_fdc509e88a$, 'bundle:exercise-reference:fdc509e88a90', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"a3190d59ec72ec1b20d2560c8e3646d9c1c2ea0ca98983d3f212f4eba36a8d36","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 2
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_10b134cd8e$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Horizonte Soluções Digitais</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <a class="pular-conteudo" href="#conteudo">Pular para o conteúdo principal</a>

    <header class="cabecalho">
        <p class="etiqueta">Tecnologia para pequenos negócios</p>
        <h1>Horizonte Soluções Digitais</h1>
        <p>Organizamos presença digital, atendimento e processos para empresas que desejam crescer com clareza.</p>

        <nav aria-label="Navegação principal">
            <ul>
                <li><a href="#servicos">Serviços</a></li>
                <li><a href="#processo">Como trabalhamos</a></li>
                <li><a href="#equipe">Equipe</a></li>
                <li><a href="#contato">Contato</a></li>
            </ul>
        </nav>
    </header>

    <main id="conteudo">
        <section id="servicos" aria-labelledby="titulo-servicos">
            <h2 id="titulo-servicos">Serviços para a rotina da empresa</h2>
            <p>Cada serviço resolve uma necessidade comum de organização, divulgação ou relacionamento com clientes.</p>

            <article>
                <h3>Site institucional</h3>
                <p>Página profissional para apresentar a empresa, seus serviços e os canais de contato.</p>
            </article>

            <article>
                <h3>Catálogo digital</h3>
                <p>Organização de produtos ou serviços em uma experiência simples para computador e celular.</p>
            </article>

            <article>
                <h3>Automação de atendimento</h3>
                <p>Formulários e fluxos básicos para reduzir tarefas repetitivas e registrar solicitações.</p>
            </article>
        </section>

        <section id="processo" aria-labelledby="titulo-processo">
            <h2 id="titulo-processo">Como trabalhamos</h2>
            <ol>
                <li>Entendemos o problema e as pessoas envolvidas.</li>
                <li>Organizamos o conteúdo e desenhamos a solução.</li>
                <li>Construímos, testamos e registramos as melhorias.</li>
            </ol>
        </section>

        <section id="equipe" aria-labelledby="titulo-equipe">
            <h2 id="titulo-equipe">Equipe responsável</h2>
            <p>Profissionais de atendimento, design e desenvolvimento trabalham juntos para transformar necessidades em soluções úteis.</p>
        </section>

        <aside id="atendimento" aria-labelledby="titulo-atendimento">
            <h2 id="titulo-atendimento">Atendimento</h2>
            <p>Precisa conversar antes de solicitar um projeto?</p>
            <button id="mostrarAtendimento" type="button" aria-expanded="false" aria-controls="detalhesAtendimento">
                Mostrar horários
            </button>
            <div id="detalhesAtendimento" hidden>
                <p>Segunda a sexta, das 8h às 18h.</p>
                <p>Retorno inicial em até um dia útil.</p>
            </div>
        </aside>
    </main>

    <footer id="contato">
        <h2>Contato profissional</h2>
        <address>
            Avenida Central, 250 - Curitiba/PR<br>
            <a href="mailto:contato@horizontedigital.example">contato@horizontedigital.example</a>
        </address>
        <p>Exercício FE02 - Programação Front-End</p>
    </footer>
</body>
</html>
$ref_10b134cd8e$, 'bundle:exercise-reference:10b134cd8ee0', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"40249350a818f8fb193408bd966f5fbd23d8bb0fa8e9a1f5cfd0951666eccbee","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 2
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_c524716b94$const botaoAtendimento = document.querySelector('#mostrarAtendimento');
const detalhesAtendimento = document.querySelector('#detalhesAtendimento');

botaoAtendimento.addEventListener('click', () => {
    const estaAberto = botaoAtendimento.getAttribute('aria-expanded') === 'true';

    botaoAtendimento.setAttribute('aria-expanded', String(!estaAberto));
    detalhesAtendimento.hidden = estaAberto;
    botaoAtendimento.textContent = estaAberto ? 'Mostrar horários' : 'Ocultar horários';
});
$ref_c524716b94$, 'bundle:exercise-reference:c524716b94c8', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"b53180195f2b67102c5ead4ac7869afcbe3b972030085421f1e497a7fecb16a5","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 2
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_d7c9781051$:root {
    --fundo: #07111f;
    --painel: #10243a;
    --campo: #0a192a;
    --texto: #f4f8ff;
    --texto-suave: #c4d0df;
    --destaque: #67e8f9;
    --sucesso: #86efac;
    --borda: #385875;
    --foco: #facc15;
}

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    font-family: Arial, Helvetica, sans-serif;
    background: var(--fundo);
    color: var(--texto);
}

.pular-conteudo {
    position: absolute;
    top: -80px;
    left: 16px;
    padding: 12px 16px;
    border-radius: 8px;
    background: var(--foco);
    color: #111827;
    font-weight: 800;
}

.pular-conteudo:focus {
    top: 16px;
}

main {
    width: min(760px, 92%);
    margin-inline: auto;
    padding: 48px 0;
}

.cabecalho,
form {
    padding: 26px;
    border: 1px solid var(--borda);
    border-radius: 18px;
    background: var(--painel);
}

.cabecalho {
    margin-bottom: 22px;
}

.etiqueta {
    color: var(--destaque);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

h1,
p {
    margin-top: 0;
}

h1 {
    margin-bottom: 12px;
    font-size: clamp(2rem, 7vw, 3.5rem);
}

p,
small {
    color: var(--texto-suave);
    line-height: 1.55;
}

fieldset {
    margin: 0 0 24px;
    padding: 20px;
    border: 1px solid var(--borda);
    border-radius: 14px;
}

legend {
    padding: 0 8px;
    color: var(--destaque);
    font-weight: 800;
}

.campo {
    margin-bottom: 18px;
}

.campo:last-child {
    margin-bottom: 0;
}

label {
    display: block;
    margin-bottom: 7px;
    font-weight: 700;
}

input,
select,
textarea,
button {
    font: inherit;
}

input,
select,
textarea {
    width: 100%;
    margin-top: 7px;
    padding: 12px;
    border: 1px solid var(--borda);
    border-radius: 9px;
    background: var(--campo);
    color: var(--texto);
}

textarea {
    resize: vertical;
}

input:focus-visible,
select:focus-visible,
textarea:focus-visible,
button:focus-visible,
a:focus-visible {
    outline: 3px solid var(--foco);
    outline-offset: 3px;
}

.grupo-opcoes {
    margin-bottom: 18px;
}

.opcao {
    margin-bottom: 12px;
    font-weight: 400;
}

.opcao input {
    width: auto;
    margin: 0 8px 0 0;
}

.termos {
    line-height: 1.5;
}

.acoes {
    margin-top: 8px;
}

button {
    min-height: 48px;
    margin: 0 10px 10px 0;
    padding: 12px 18px;
    border: 0;
    border-radius: 10px;
    background: var(--destaque);
    color: #04131f;
    font-weight: 800;
    cursor: pointer;
}

button:hover {
    filter: brightness(1.08);
}

button.secundario {
    border: 1px solid var(--borda);
    background: transparent;
    color: var(--texto);
}

.status {
    margin-top: 14px;
    padding: 16px;
    border-left: 5px solid var(--sucesso);
    border-radius: 8px;
    background: #0a1c21;
    color: var(--texto);
    line-height: 1.5;
}

@media (max-width: 520px) {
    main {
        padding: 24px 0;
    }

    .cabecalho,
    form,
    fieldset {
        padding: 18px;
    }

    button {
        width: 100%;
        margin-right: 0;
    }
}
$ref_d7c9781051$, 'bundle:exercise-reference:d7c978105133', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"e2dd7f590742fba993f356d4fcdc6f61d6a47b0acbf3eb5e98a58ba3f42e804e","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 3
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_3c212c743c$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro de cliente | Horizonte Digital</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <a class="pular-conteudo" href="#conteudo">Pular para o formulário</a>

    <main id="conteudo">
        <header class="cabecalho">
            <p class="etiqueta">Atendimento comercial</p>
            <h1>Cadastro de cliente</h1>
            <p>Preencha os campos para solicitar o primeiro contato da equipe.</p>
            <p><span aria-hidden="true">*</span> Campos obrigatórios.</p>
        </header>

        <form id="cadastroCliente">
            <fieldset>
                <legend>Dados da pessoa responsável</legend>

                <div class="campo">
                    <label for="nome">Nome completo <span aria-hidden="true">*</span></label>
                    <input id="nome" name="nome" type="text" autocomplete="name" minlength="3" required>
                </div>

                <div class="campo">
                    <label for="email">E-mail profissional <span aria-hidden="true">*</span></label>
                    <input id="email" name="email" type="email" autocomplete="email" aria-describedby="ajudaEmail" required>
                    <small id="ajudaEmail">Exemplo: nome@empresa.com.br</small>
                </div>

                <div class="campo">
                    <label for="telefone">Telefone <span aria-hidden="true">*</span></label>
                    <input id="telefone" name="telefone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(41) 99999-9999" required>
                </div>

                <div class="campo">
                    <label for="empresa">Empresa</label>
                    <input id="empresa" name="empresa" type="text" autocomplete="organization">
                </div>
            </fieldset>

            <fieldset>
                <legend>Necessidade de atendimento</legend>

                <div class="campo">
                    <label for="servico">Serviço de interesse <span aria-hidden="true">*</span></label>
                    <select id="servico" name="servico" required>
                        <option value="" selected disabled>Selecione uma opção</option>
                        <option value="site">Site institucional</option>
                        <option value="sistema">Sistema interno</option>
                        <option value="manutencao">Manutenção de projeto</option>
                    </select>
                </div>

                <fieldset class="grupo-opcoes">
                    <legend>Como prefere receber o retorno? <span aria-hidden="true">*</span></legend>

                    <label class="opcao" for="retornoEmail">
                        <input id="retornoEmail" name="retorno" type="radio" value="E-mail" required>
                        E-mail
                    </label>

                    <label class="opcao" for="retornoTelefone">
                        <input id="retornoTelefone" name="retorno" type="radio" value="Telefone">
                        Telefone
                    </label>
                </fieldset>

                <div class="campo">
                    <label for="mensagem">Explique brevemente a necessidade</label>
                    <textarea id="mensagem" name="mensagem" rows="5" maxlength="300" aria-describedby="ajudaMensagem"></textarea>
                    <small id="ajudaMensagem">Não informe senhas, documentos ou outros dados sensíveis.</small>
                </div>

                <label class="opcao termos" for="termos">
                    <input id="termos" name="termos" type="checkbox" required>
                    Confirmo que os dados podem ser usados para responder a esta solicitação. <span aria-hidden="true">*</span>
                </label>
            </fieldset>

            <div class="acoes">
                <button type="submit">Enviar cadastro</button>
                <button class="secundario" type="reset">Limpar formulário</button>
            </div>

            <div id="statusCadastro" class="status" role="status" aria-live="polite" tabindex="-1" hidden></div>
        </form>
    </main>
</body>
</html>
$ref_3c212c743c$, 'bundle:exercise-reference:3c212c743c44', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"efc4ce0b329838c68b9fd1c1de750fbe7115acd0c0537aa37bb7c1848199b9f5","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 3
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_5fa626d161$const formulario = document.querySelector('#cadastroCliente');
const statusCadastro = document.querySelector('#statusCadastro');

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const dados = new FormData(formulario);
    const nome = dados.get('nome');
    const servico = formulario.elements.servico.options[formulario.elements.servico.selectedIndex].text;
    const retorno = dados.get('retorno');

    statusCadastro.textContent = `Cadastro de ${nome} recebido. Interesse: ${servico}. Retorno preferido: ${retorno}.`;
    statusCadastro.hidden = false;
    statusCadastro.focus();
});

formulario.addEventListener('reset', () => {
    statusCadastro.hidden = true;
    statusCadastro.textContent = '';
});
$ref_5fa626d161$, 'bundle:exercise-reference:5fa626d161d9', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"5097aa54238d8646bc0fcd46185db56386504fad5f48081e29b46bedd7210552","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 3
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_4689b93adf$:root {
    --cor-fundo: #07111f;
    --cor-superficie: #10243a;
    --cor-superficie-elevada: #173653;
    --cor-texto: #f3f7ff;
    --cor-texto-suave: #b8c7da;
    --cor-destaque: #38bdf8;
    --cor-borda: #2b4d6c;
    --espacamento-base: 16px;
    --raio: 18px;
}

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    font-family: Arial, Helvetica, sans-serif;
    background: var(--cor-fundo);
    color: var(--cor-texto);
}

body.tema-claro {
    --cor-fundo: #eef6ff;
    --cor-superficie: #ffffff;
    --cor-superficie-elevada: #e7f1fb;
    --cor-texto: #10243a;
    --cor-texto-suave: #43576d;
    --cor-destaque: #0369a1;
    --cor-borda: #b7cee3;
}

.cabecalho,
main,
footer {
    width: min(820px, 92%);
    margin-inline: auto;
}

.cabecalho {
    padding: 48px 0 24px;
}

.etiqueta {
    color: var(--cor-destaque);
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

h1,
h2,
h3,
p {
    margin-top: 0;
}

h1 {
    max-width: 700px;
    margin-bottom: 12px;
    font-size: clamp(2.2rem, 6vw, 4.5rem);
    line-height: 1.05;
}

.introducao,
.cartao p,
.resumo p,
footer p {
    color: var(--cor-texto-suave);
    line-height: 1.65;
}

button {
    min-height: 48px;
    padding: 12px 18px;
    border: 2px solid transparent;
    border-radius: 12px;
    background: var(--cor-destaque);
    color: var(--cor-fundo);
    font: inherit;
    font-weight: 800;
    cursor: pointer;
}

button:hover {
    filter: brightness(1.12);
}

button:focus-visible {
    outline: 3px solid var(--cor-texto);
    outline-offset: 4px;
}

.status {
    margin: 14px 0 0;
    color: var(--cor-texto-suave);
}

.painel {
    margin-bottom: calc(var(--espacamento-base) * 1.5);
    padding: calc(var(--espacamento-base) * 1.5);
    border: 1px solid var(--cor-borda);
    border-radius: var(--raio);
    background: var(--cor-superficie);
}

.cartao {
    width: 100%;
    margin: var(--espacamento-base) 0;
    padding: calc(var(--espacamento-base) * 1.25);
    border: 2px solid var(--cor-borda);
    border-radius: 14px;
    background: var(--cor-superficie-elevada);
}

.cartao.destaque {
    border-color: var(--cor-destaque);
}

#planoDestaque {
    padding: calc(var(--espacamento-base) * 1.5);
}

[data-status="recomendado"] {
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--cor-destaque) 20%, transparent);
}

.selo {
    display: inline-block;
    margin-bottom: 8px;
    padding: 5px 9px;
    border: 1px solid var(--cor-borda);
    border-radius: 999px;
    color: var(--cor-texto);
    font-size: 0.78rem;
    font-weight: 800;
    text-transform: uppercase;
}

.preco {
    margin-bottom: 0;
    color: var(--cor-texto);
    font-size: 2rem;
    font-weight: 900;
}

.preco span {
    color: var(--cor-destaque);
    font-size: 1rem;
}

.resumo {
    border-left: 6px solid var(--cor-destaque);
}

footer {
    padding: 0 0 36px;
}

@media (max-width: 560px) {
    .cabecalho {
        padding-top: 28px;
    }

    .painel,
    .cartao,
    #planoDestaque {
        padding: var(--espacamento-base);
    }

    button {
        width: 100%;
    }
}
$ref_4689b93adf$, 'bundle:exercise-reference:4689b93adf20', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"82314a2a6bfff1de9948031007f8fae6c4e5bf260a0576f9afbbf3b2f34525d0","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_5d1fe6a028$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vitrine de planos - CSS profissional</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <header class="cabecalho">
        <p class="etiqueta">FE04 - Seletores, cascata e Box Model</p>
        <h1>Planos para presença digital</h1>
        <p class="introducao">Compare soluções para empresas que precisam publicar, organizar e evoluir seus canais digitais.</p>
        <button id="alternarTema" type="button" aria-pressed="false">Ativar tema claro</button>
        <p id="statusTema" class="status" role="status" aria-live="polite">Tema escuro ativo.</p>
    </header>

    <main id="conteudo">
        <section class="painel" aria-labelledby="titulo-planos">
            <h2 id="titulo-planos">Planos disponíveis</h2>

            <article class="cartao" data-status="essencial">
                <p class="selo">Essencial</p>
                <h3>Presença</h3>
                <p>Uma página institucional organizada para apresentar serviços e contatos.</p>
                <p class="preco"><span>R$</span> 490</p>
            </article>

            <article id="planoDestaque" class="cartao destaque" data-status="recomendado">
                <p class="selo">Recomendado</p>
                <h3>Negócio</h3>
                <p>Site com páginas de serviços, formulário de contato e identidade visual consistente.</p>
                <p class="preco"><span>R$</span> 890</p>
            </article>

            <article class="cartao" data-status="avancado">
                <p class="selo">Avançado</p>
                <h3>Operação</h3>
                <p>Interface preparada para catálogos, integrações e evolução contínua do produto.</p>
                <p class="preco"><span>R$</span> 1.490</p>
            </article>
        </section>

        <aside class="painel resumo" aria-labelledby="titulo-resumo">
            <h2 id="titulo-resumo">Como o CSS decide o resultado?</h2>
            <p>Seletores encontram elementos. A cascata combina origem, especificidade e ordem. As variáveis reduzem repetição. O Box Model controla conteúdo, preenchimento, borda e margem.</p>
        </aside>
    </main>

    <footer>
        <p>Exercício FE04 - Programação Front-End - 2 DS Subsequente</p>
    </footer>
</body>
</html>
$ref_5d1fe6a028$, 'bundle:exercise-reference:5d1fe6a02818', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"3c844b349ac70ba0e924a5ee37287fb00fb0d03a05cbc207c6e85ae5948d55c4","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_3ccf6e50a1$const botaoTema = document.querySelector('#alternarTema');
const statusTema = document.querySelector('#statusTema');

botaoTema.addEventListener('click', () => {
    const temaClaroAtivo = document.body.classList.toggle('tema-claro');

    botaoTema.setAttribute('aria-pressed', String(temaClaroAtivo));
    botaoTema.textContent = temaClaroAtivo ? 'Ativar tema escuro' : 'Ativar tema claro';
    statusTema.textContent = temaClaroAtivo ? 'Tema claro ativo.' : 'Tema escuro ativo.';
});
$ref_3ccf6e50a1$, 'bundle:exercise-reference:3ccf6e50a106', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"c1356ee57bceaa1bc6dfd189b78ab35aef38cce9a59386f706f6fd3b64beb212","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_cfc97a522d$:root {
    --fundo: #07111f;
    --superficie: #10243a;
    --superficie-clara: #173653;
    --texto: #f4f8ff;
    --texto-suave: #bccbdd;
    --destaque: #38bdf8;
    --sucesso: #4ade80;
    --alerta: #fbbf24;
    --perigo: #fb7185;
    --borda: #2c4c69;
    --espaco-layout: 20px;
}

* {
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    margin: 0;
    min-height: 100vh;
    font-family: Arial, Helvetica, sans-serif;
    background: var(--fundo);
    color: var(--texto);
}

.pular-conteudo {
    position: absolute;
    top: -70px;
    left: 16px;
    z-index: 10;
    padding: 12px 16px;
    border-radius: 10px;
    background: var(--destaque);
    color: #04131f;
    font-weight: 800;
}

.pular-conteudo:focus {
    top: 16px;
}

.topo,
.layout-principal,
.orientacoes,
.rodape-pagina {
    width: min(1120px, 92%);
    margin-inline: auto;
}

.topo {
    padding: 44px 0 24px;
}

.topo-conteudo {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--espaco-layout);
}

.topo-conteudo > div {
    flex: 1 1 680px;
}

.etiqueta,
.sobrelinha {
    margin: 0 0 8px;
    color: var(--destaque);
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

h1,
h2,
h3,
p {
    margin-top: 0;
}

h1 {
    max-width: 760px;
    margin-bottom: 12px;
    font-size: clamp(2.2rem, 6vw, 4.6rem);
    line-height: 1.04;
}

p,
li,
span {
    color: var(--texto-suave);
    line-height: 1.6;
}

button {
    min-height: 48px;
    padding: 12px 18px;
    border: 0;
    border-radius: 12px;
    background: var(--destaque);
    color: #04131f;
    font: inherit;
    font-weight: 800;
    cursor: pointer;
}

button:hover {
    filter: brightness(1.1);
}

button:focus-visible,
a:focus-visible {
    outline: 3px solid var(--texto);
    outline-offset: 4px;
}

nav {
    margin-top: 24px;
    padding-top: 18px;
    border-top: 1px solid var(--borda);
}

nav ul {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 24px;
    margin: 0;
    padding: 0;
    list-style: none;
}

nav a,
.cartao-rodape a {
    color: var(--destaque);
    font-weight: 800;
    text-underline-offset: 4px;
}

.layout-principal {
    display: flex;
    align-items: flex-start;
    gap: var(--espaco-layout);
}

.conteudo {
    flex: 1 1 760px;
    min-width: 0;
}

.painel-lateral {
    flex: 0 1 270px;
    padding: 22px;
    border: 1px solid var(--borda);
    border-radius: 18px;
    background: var(--superficie);
}

.secao-cabecalho {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 12px 24px;
    margin-bottom: 18px;
}

.status {
    max-width: 310px;
    margin: 0;
    padding-left: 12px;
    border-left: 4px solid var(--destaque);
}

.lista-servicos {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    gap: var(--espaco-layout);
}

.lista-servicos.modo-coluna {
    flex-direction: column;
}

.cartao-servico {
    display: flex;
    flex: 1 1 260px;
    flex-direction: column;
    min-width: 0;
    padding: 20px;
    border: 1px solid var(--borda);
    border-radius: 18px;
    background: var(--superficie);
}

.cartao-servico.destaque {
    border-color: var(--perigo);
    box-shadow: 0 0 0 3px rgb(251 113 133 / 18%);
}

.cartao-topo,
.cartao-rodape {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
}

.cartao-topo {
    margin-bottom: 18px;
}

.cartao-rodape {
    margin-top: auto;
    padding-top: 18px;
    border-top: 1px solid var(--borda);
}

.situacao {
    padding: 5px 9px;
    border-radius: 999px;
    color: #06121f;
    font-size: 0.78rem;
    font-weight: 900;
}

.em-andamento {
    background: var(--sucesso);
}

.aguardando {
    background: var(--alerta);
}

.urgente {
    background: var(--perigo);
}

.prazo {
    font-weight: 800;
}

.indicadores {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.indicadores article {
    padding: 16px;
    border: 1px solid var(--borda);
    border-radius: 14px;
    background: var(--superficie-clara);
}

.indicadores strong,
.indicadores span {
    display: block;
}

.indicadores strong {
    margin-bottom: 4px;
    color: var(--texto);
    font-size: 1.55rem;
}

.orientacoes {
    margin-top: var(--espaco-layout);
    padding: 24px;
    border: 1px solid var(--borda);
    border-radius: 18px;
    background: var(--superficie);
}

.orientacoes code {
    color: var(--destaque);
}

.rodape-pagina {
    padding: 24px 0 36px;
}

@media (max-width: 760px) {
    .topo {
        padding-top: 28px;
    }

    .topo-conteudo,
    .layout-principal,
    .secao-cabecalho {
        flex-direction: column;
        align-items: stretch;
    }

    .painel-lateral {
        width: 100%;
    }

    .status {
        max-width: none;
    }

    button {
        width: 100%;
    }
}

@media (max-width: 480px) {
    nav ul,
    .cartao-topo,
    .cartao-rodape {
        flex-direction: column;
        align-items: flex-start;
    }

    .cartao-servico,
    .orientacoes,
    .painel-lateral {
        padding: 18px;
    }
}
$ref_cfc97a522d$, 'bundle:exercise-reference:cfc97a522d61', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"2033a7a4ec87b8fe84e7b1d8ff002adbe3eba415285fcfcb5fc69232772694b5","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 5
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_8f6e120e32$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel de serviços - Flexbox</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <a class="pular-conteudo" href="#conteudo">Pular para o conteúdo</a>

    <header class="topo">
        <div class="topo-conteudo">
            <div>
                <p class="etiqueta">FE05 - Layout profissional com Flexbox</p>
                <h1>Central de serviços digitais</h1>
                <p class="introducao">Acompanhe serviços, prazos e responsáveis em uma interface organizada para diferentes tamanhos de tela.</p>
            </div>

            <button id="alternarDirecao" type="button" aria-pressed="false" aria-controls="listaServicos">
                Exibir cartões em coluna
            </button>
        </div>

        <nav aria-label="Navegação principal">
            <ul>
                <li><a href="#servicos">Serviços</a></li>
                <li><a href="#indicadores">Indicadores</a></li>
                <li><a href="#orientacoes">Orientações</a></li>
            </ul>
        </nav>
    </header>

    <main id="conteudo" class="layout-principal">
        <section id="servicos" class="conteudo" aria-labelledby="titulo-servicos">
            <div class="secao-cabecalho">
                <div>
                    <p class="sobrelinha">Fila da equipe</p>
                    <h2 id="titulo-servicos">Serviços em acompanhamento</h2>
                </div>
                <p id="statusLayout" class="status" role="status" aria-live="polite">Cartões distribuídos em linhas flexíveis.</p>
            </div>

            <div id="listaServicos" class="lista-servicos">
                <article class="cartao-servico">
                    <div class="cartao-topo">
                        <span class="situacao em-andamento">Em andamento</span>
                        <span class="prazo">2 dias</span>
                    </div>
                    <h3>Site institucional</h3>
                    <p>Revisão da página inicial e organização dos canais de contato.</p>
                    <footer class="cartao-rodape">
                        <span>Responsável: Ana</span>
                        <a href="#orientacoes">Ver detalhes</a>
                    </footer>
                </article>

                <article class="cartao-servico">
                    <div class="cartao-topo">
                        <span class="situacao aguardando">Aguardando</span>
                        <span class="prazo">4 dias</span>
                    </div>
                    <h3>Catálogo digital</h3>
                    <p>Cadastro inicial de produtos e preparação das categorias.</p>
                    <footer class="cartao-rodape">
                        <span>Responsável: Bruno</span>
                        <a href="#orientacoes">Ver detalhes</a>
                    </footer>
                </article>

                <article class="cartao-servico destaque">
                    <div class="cartao-topo">
                        <span class="situacao urgente">Prioridade</span>
                        <span class="prazo">Hoje</span>
                    </div>
                    <h3>Formulário de orçamento</h3>
                    <p>Ajuste dos campos obrigatórios e das mensagens de retorno.</p>
                    <footer class="cartao-rodape">
                        <span>Responsável: Carla</span>
                        <a href="#orientacoes">Ver detalhes</a>
                    </footer>
                </article>
            </div>
        </section>

        <aside id="indicadores" class="painel-lateral" aria-labelledby="titulo-indicadores">
            <h2 id="titulo-indicadores">Indicadores do dia</h2>
            <div class="indicadores">
                <article>
                    <strong>3</strong>
                    <span>serviços ativos</span>
                </article>
                <article>
                    <strong>1</strong>
                    <span>prioridade alta</span>
                </article>
                <article>
                    <strong>2 dias</strong>
                    <span>prazo médio</span>
                </article>
            </div>
        </aside>
    </main>

    <section id="orientacoes" class="orientacoes" aria-labelledby="titulo-orientacoes">
        <h2 id="titulo-orientacoes">Como o Flexbox organiza a interface?</h2>
        <p>O contêiner controla direção, alinhamento, distribuição, quebra de linha e espaçamento. Os itens podem crescer ou reduzir conforme o espaço disponível.</p>
        <ul>
            <li><code>display: flex</code> ativa o modelo flexível.</li>
            <li><code>flex-wrap</code> permite distribuir cartões em novas linhas.</li>
            <li><code>justify-content</code> atua no eixo principal.</li>
            <li><code>align-items</code> atua no eixo transversal.</li>
            <li><code>flex</code> controla crescimento, redução e tamanho-base.</li>
        </ul>
    </section>

    <footer class="rodape-pagina">
        <p>Exercício FE05 - Programação Front-End - 2 DS Subsequente</p>
    </footer>
</body>
</html>
$ref_8f6e120e32$, 'bundle:exercise-reference:8f6e120e32fb', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"6a352dfad37087661afdd7bfb1898e9296477dc62d7d2181d65bb80b7a59beac","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 5
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_1035369cca$const botaoDirecao = document.querySelector('#alternarDirecao');
const listaServicos = document.querySelector('#listaServicos');
const statusLayout = document.querySelector('#statusLayout');

botaoDirecao.addEventListener('click', () => {
    const modoColunaAtivo = listaServicos.classList.toggle('modo-coluna');

    botaoDirecao.setAttribute('aria-pressed', String(modoColunaAtivo));
    botaoDirecao.textContent = modoColunaAtivo
        ? 'Exibir cartões em linhas'
        : 'Exibir cartões em coluna';
    statusLayout.textContent = modoColunaAtivo
        ? 'Cartões organizados em uma única coluna.'
        : 'Cartões distribuídos em linhas flexíveis.';
});
$ref_1035369cca$, 'bundle:exercise-reference:1035369cca1d', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"31ec8dc06476b2922578c71ed3a6e81fbecbec9738a351a45d4ea8fc288494da","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 5
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_755653cd2e$* { box-sizing:border-box; }
body { margin:0; font-family:system-ui,sans-serif; background:#eef2f7; color:#172033; }
header, #dashboard, footer { width:min(1100px,94%); margin:auto; }
header { padding:1.5rem 0; }
#dashboard { display:grid; grid-template-columns:2fr 1fr; grid-template-areas:"resumo resumo" "tarefas agenda" "equipe alertas"; gap:1rem; }
#resumo{grid-area:resumo} #tarefas{grid-area:tarefas} #agenda{grid-area:agenda} #equipe{grid-area:equipe} #alertas{grid-area:alertas}
section, aside { min-width:0; padding:1rem; background:white; border-radius:12px; }
.indicadores { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:.75rem; }
.indicador { display:grid; gap:.25rem; padding:.8rem; background:#f8fafc; border-radius:10px; }
#dashboard.compacto section, #dashboard.compacto aside { padding:.65rem; }
@media(max-width:760px){ #dashboard{grid-template-columns:1fr;grid-template-areas:"resumo" "tarefas" "agenda" "equipe" "alertas";} }
$ref_755653cd2e$, 'bundle:exercise-reference-synced:755653cd2ee3', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"8b9bb9c069f78283d809e7b161696b76683c0198eb40361f927e133cb97b0723","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 6
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_e36b75fbe9$<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard responsivo</title>
  <link rel="stylesheet" href="estilo.css">
  <script src="script.js" defer></script>
</head>
<body>
  <header>
    <h1>Dashboard operacional</h1>
    <button id="alternarDensidade" type="button" aria-pressed="false" aria-controls="dashboard">Ativar modo compacto</button>
    <p id="statusLayout" aria-live="polite">Densidade confortável.</p>
  </header>
  <main id="dashboard">
    <section id="resumo"><h2>Resumo</h2><div class="indicadores"><article class="indicador"><strong>12</strong><span>Tarefas</span></article><article class="indicador"><strong>4</strong><span>Reuniões</span></article><article class="indicador"><strong>3</strong><span>Alertas</span></article></div></section>
    <section id="tarefas"><h2>Tarefas</h2><p>Revisar projeto e publicar versão.</p></section>
    <section id="agenda"><h2>Agenda</h2><p>14h — alinhamento da equipe.</p></section>
    <section id="equipe"><h2>Equipe</h2><p>Front-End, QA e Produto.</p></section>
    <aside id="alertas"><h2>Alertas</h2><p>Há uma entrega próxima.</p></aside>
  </main>
  <footer>FE06 • Grid responsivo</footer>
</body>
</html>$ref_e36b75fbe9$, 'bundle:exercise-reference-synced:e36b75fbe965', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"c58f5e37a62d15b12222ef0e1bdd88d0be6724fcb4bfa0e84280396cd7217e99","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 6
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_1510a1fe07$const botao = document.querySelector("#alternarDensidade");
const dashboard = document.querySelector("#dashboard");
const statusLayout = document.querySelector("#statusLayout");

botao.addEventListener("click", () => {
  const compacto = dashboard.classList.toggle("compacto");
  botao.setAttribute("aria-pressed", String(compacto));
  botao.textContent = compacto ? "Desativar modo compacto" : "Ativar modo compacto";
  statusLayout.textContent = compacto ? "Densidade compacta." : "Densidade confortável.";
});$ref_1510a1fe07$, 'bundle:exercise-reference-synced:1510a1fe07a4', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"72955997b11b9aebf2db98478985e5b05bc02a13ff8c60e2ea34a21494e815d3","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 6
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'README.md', 'markdown', $ref_bb4c84bad8$# FE07 - Do algoritmo ao código: Python e JavaScript

## Objetivo
Representar e executar o mesmo algoritmo sequencial em pseudocódigo, JavaScript e Python, identificando entrada, processamento e saída.

## Arquivos
- algoritmo.txt
- index.html
- estilo.css
- script.js
- main.py

Use os mesmos dados nas duas versões e compare os resultados.
$ref_bb4c84bad8$, 'bundle:exercise-reference-synced:bb4c84bad8f8', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"778629fd5f384e6951278144b4f3db682f3992496e04780fed6cdaddf91f0b65","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 7
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'algoritmo.txt', 'text', $ref_3b24a54bd5$INÍCIO
    LER nome_do_cliente
    LER horas_previstas
    LER valor_por_hora

    subtotal <- horas_previstas * valor_por_hora
    taxa_operacional <- subtotal * 0.10
    total <- subtotal + taxa_operacional

    EXIBIR nome_do_cliente
    EXIBIR subtotal
    EXIBIR taxa_operacional
    EXIBIR total
FIM
$ref_3b24a54bd5$, 'bundle:exercise-reference-synced:3b24a54bd5b1', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"40065d0e339d4fda637f2e33733d343f2be184eaa7387befd3845ce80d84e82d","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 7
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_8a51953384$:root { --fundo:#f8fafc; --painel:#fff; --destaque:#0369a1; --texto:#172033; }
* { box-sizing:border-box; }
body { margin:0; font-family:system-ui,sans-serif; background:var(--fundo); color:var(--texto); }
header, #simulador, footer { width:min(900px,92%); margin:auto; }
#simulador { display:grid; grid-template-columns:2fr 1fr; gap:1rem; }
section, aside { padding:1rem; background:var(--painel); border-radius:12px; }
form { display:grid; gap:.6rem; }
input, button { font:inherit; padding:.7rem; }
button { background:var(--destaque); color:white; border:0; border-radius:8px; cursor:pointer; }
button:hover { filter:brightness(1.08); }
@media(max-width:700px){ #simulador{grid-template-columns:1fr;} }$ref_8a51953384$, 'bundle:exercise-reference-synced:8a519533840f', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"2c44480a61f3a2d70cee2824faeff23ff2cbb6496019e38107a30592015453b5","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 7
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_602efd9bc2$<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simulador de orçamento</title>
  <link rel="stylesheet" href="estilo.css">
  <script src="script.js" defer></script>
</head>
<body>
  <header><h1>Do algoritmo ao código</h1></header>
  <main id="simulador">
    <section>
      <h2>Orçamento em JavaScript</h2>
      <form id="formularioOrcamento">
        <label for="nomeCliente">Cliente</label><input id="nomeCliente" name="nomeCliente" required>
        <label for="horasPrevistas">Horas previstas</label><input id="horasPrevistas" name="horasPrevistas" type="number" min="1" required>
        <label for="valorHora">Valor por hora</label><input id="valorHora" name="valorHora" type="number" min="0" step="0.01" required>
        <button type="submit">Calcular orçamento</button>
      </form>
      <p id="resultadoOrcamento" role="status" aria-live="polite"></p>
    </section>
    <aside><h2>Algoritmo</h2><ol><li>Ler nome, horas e valor.</li><li>Calcular subtotal.</li><li>Aplicar taxa de 10%.</li><li>Mostrar o total.</li></ol></aside>
  </main>
  <footer>FE07 • Python e JavaScript</footer>
</body>
</html>$ref_602efd9bc2$, 'bundle:exercise-reference-synced:602efd9bc233', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"49d83dd2e1f67187eb2077255dcfb046831b3c3bfdf9ca227ca7f601b0cdd5eb","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 7
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'main.py', 'python', $ref_e204c6ad9b$nome_cliente = input("Nome do cliente: ").strip()
horas_previstas = float(input("Horas previstas: ").replace(",", "."))
valor_hora = float(input("Valor por hora: R$ ").replace(",", "."))

subtotal = horas_previstas * valor_hora
taxa = subtotal * 0.10
total = subtotal + taxa

print("\n--- ORÇAMENTO ---")
print(f"Cliente: {nome_cliente}")
print(f"Subtotal: R$ {subtotal:.2f}")
print(f"Taxa (10%): R$ {taxa:.2f}")
print(f"Total: R$ {total:.2f}")$ref_e204c6ad9b$, 'bundle:exercise-reference-synced:e204c6ad9b07', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"7eec112dbdae8078ce4dec5241bde427108881b4ff8c41ba1a667d5c675c6fd4","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 7
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_b7fd9eb012$const formulario = document.querySelector("#formularioOrcamento");
const resultado = document.querySelector("#resultadoOrcamento");

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  const nome = document.querySelector("#nomeCliente").value.trim();
  const horas = Number(document.querySelector("#horasPrevistas").value);
  const valorHora = Number(document.querySelector("#valorHora").value);
  const subtotal = horas * valorHora;
  const taxa = subtotal * 0.10;
  const total = subtotal + taxa;
  resultado.textContent = nome + ": subtotal R$ " + subtotal.toFixed(2) + ", taxa R$ " + taxa.toFixed(2) + ", total R$ " + total.toFixed(2) + ".";
});$ref_b7fd9eb012$, 'bundle:exercise-reference-synced:b7fd9eb0120c', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"e245f119718c225511dad29d33e22640cf08eec9600473634db302094468f54f","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 7
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_820e1c2a72$<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exercício 08 — Média e Situação do Aluno com JavaScript</title>
  <style>body{font-family:Arial,sans-serif;max-width:760px;margin:40px auto;padding:0 16px;line-height:1.5}input,button{padding:10px;margin:6px 4px 6px 0}</style>
</head>
<body>
  <h1 id="titulo">Exercício 08 — Média e Situação do Aluno com JavaScript</h1>
  <input id="entrada1" placeholder="Valor 1">
  <input id="entrada2" placeholder="Valor 2">
  <button id="executar">Executar</button>
  <p id="saida">Resultado aparecerá aqui.</p>
  <script src="script.js"></script>
</body>
</html>$ref_820e1c2a72$, 'bundle:exercise-reference-synced:820e1c2a7235', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"a559a9eed72164c1b5396b3f3dcb59b72ec0e64324ef8eed480cd1528d6d6ea8","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 8
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_e3df576e0d$// Exercício 08 — Média e situação
const n1 = document.querySelector("#entrada1");
const n2 = document.querySelector("#entrada2");
const saida = document.querySelector("#saida");

document.querySelector("#executar").addEventListener("click", () => {
  const media = (Number(n1.value) + Number(n2.value)) / 2;
  const situacao = media >= 6 ? "Aprovado" : "Reprovado";
  saida.textContent = `Média: ${media.toFixed(1)} — ${situacao}`;
});
$ref_e3df576e0d$, 'bundle:exercise-reference-synced:e3df576e0df7', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"f079d3fceb2e01c4de6bd1860491ff155cf2c298fcbf90fc4c3ea0c9cba1057b","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 8
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_7f886024e8$<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exercício 09 — Validação de Campo com JavaScript</title>
</head>
<body>
  <h1>Exercício 09 — Validação de Campo com JavaScript</h1>
  <input id="entrada1" placeholder="Valor 1">
  <button id="executar">Executar</button>
  <p id="saida">Resultado aparecerá aqui.</p>
  <script src="script.js"></script>
</body>
</html>$ref_7f886024e8$, 'bundle:exercise-reference-synced:7f886024e842', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"016f8e9701b91ad9fb1f997c7110f584534bb1cff3e2d725bec9b1c4cfcf2b48","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 9
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_2573cad570$// Exercício 09 — Validação de campo
const entrada = document.querySelector("#entrada1");
const saida = document.querySelector("#saida");

document.querySelector("#executar").addEventListener("click", () => {
  if (entrada.value.trim() === "") {
    saida.textContent = "Preencha o campo.";
    return;
  }
  saida.textContent = "Campo preenchido corretamente.";
});
$ref_2573cad570$, 'bundle:exercise-reference-synced:2573cad5704f', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"3aadec309fc048b87ebe61a400328911ab48bd620e6241495c6349edcf94b940","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end-sub' and e.exercise_number = 9
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_dded64bab2$* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    padding: 40px 16px;
    font-family: Arial, sans-serif;
    background-color: #f3f4f6;
    color: #1f2937;
}

.container {
    width: min(620px, 100%);
    margin: auto;
    padding: 28px;
    background-color: white;
    border-radius: 14px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.10);
}

h1 {
    margin-top: 0;
    color: #2563eb;
}

p {
    line-height: 1.5;
}

label {
    display: block;
    margin-top: 16px;
    font-weight: bold;
}

input, textarea, select, button {
    font: inherit;
}

input, textarea, select {
    width: 100%;
    margin-top: 7px;
    padding: 11px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
}

button {
    margin-top: 18px;
    padding: 10px 16px;
    border: 0;
    border-radius: 8px;
    background-color: #2563eb;
    color: white;
    cursor: pointer;
}

button:hover {
    filter: brightness(0.9);
}

.resultado {
    min-height: 28px;
    margin-top: 20px;
    padding: 14px;
    border-left: 4px solid #2563eb;
    background-color: #eff6ff;
    border-radius: 8px;
}

ul {
    padding-left: 22px;
}

@media (max-width: 520px) {
    body {
        padding: 20px 12px;
    }

    .container {
        padding: 20px;
    }
}
$ref_dded64bab2$, 'bundle:exercise-reference-ds2-corrected:dded64bab2ab', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"a18db871dbd5566b21a5b5fa364c14e273471f29f49bf82e75948fc76ded2b8c","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 1
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_944a9a8e54$body {
    font-family: Arial, sans-serif;
    background-color: #f2f2f2;
    text-align: center;
    padding: 40px;
}

h1 {
    color: #333333;
}

p {
    font-size: 20px;
}

button {
    padding: 10px 20px;
    font-size: 18px;
    cursor: pointer;
}
$ref_944a9a8e54$, 'bundle:exercise-reference:944a9a8e542c', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"1df068cdde2bb2b1a49037a79275d40ec41950a39dac362f3f8cffd7ce94274f","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 1
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_0dc7f9e5c9$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 01 — Alterando HTML com JavaScript</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <main class="container">
        <h1>Alterando HTML com JavaScript</h1>
        <p id="mensagem">Clique no botão para alterar este texto.</p>
        <button id="alterarTexto" type="button">Alterar texto</button>
    </main>
</body>
</html>
$ref_0dc7f9e5c9$, 'bundle:exercise-reference-ds2-corrected:0dc7f9e5c9af', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"e2ae8a9acd265ec6261f1e09ff0f421a782a51add523cbb7ba72546437c1aa69","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 1
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_0578302720$<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 01</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <h1>Alterando Conteúdo com JavaScript</h1>

    <p id="mensagem">Clique no botão para alterar este texto.</p>

    <button onclick="alterarTexto()">Alterar texto</button>

    <script src="script.js"></script>
</body>
</html>
$ref_0578302720$, 'bundle:exercise-reference:057830272006', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"dbd838e5eb6962e18d09b7ba98e78329adf297b165d5ab39130219f7c41f92d1","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 1
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_21781dba51$const mensagem = document.querySelector("#mensagem");
const botao = document.querySelector("#alterarTexto");

botao.addEventListener("click", () => {
    mensagem.textContent = "O texto foi alterado usando JavaScript!";
});
$ref_21781dba51$, 'bundle:exercise-reference-ds2-corrected:21781dba5109', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"5cba3953a74386dfa6d000474867ea2edf171020c029499f5277b329735cd327","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 1
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_59b30f78f4$function alterarTexto() {
    document.getElementById("mensagem").innerText =
        "O texto foi alterado usando JavaScript!";
}
$ref_59b30f78f4$, 'bundle:exercise-reference:59b30f78f42a', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"afcb1dd88e28624797d3c8f982aedb2a4c07f4cf4dd359f2b6a493b453c61e5e","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 1
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_2db22d0489$* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    padding: 40px 16px;
    font-family: Arial, sans-serif;
    background-color: #f3f4f6;
    color: #1f2937;
}

.container {
    width: min(620px, 100%);
    margin: auto;
    padding: 28px;
    background-color: white;
    border-radius: 14px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.10);
}

h1 {
    margin-top: 0;
    color: #1d4ed8;
}

p {
    line-height: 1.5;
}

label {
    display: block;
    margin-top: 16px;
    font-weight: bold;
}

input, textarea, select, button {
    font: inherit;
}

input, textarea, select {
    width: 100%;
    margin-top: 7px;
    padding: 11px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
}

button {
    margin-top: 18px;
    padding: 10px 16px;
    border: 0;
    border-radius: 8px;
    background-color: #1d4ed8;
    color: white;
    cursor: pointer;
}

button:hover {
    filter: brightness(0.9);
}

.resultado {
    min-height: 28px;
    margin-top: 20px;
    padding: 14px;
    border-left: 4px solid #1d4ed8;
    background-color: #eff6ff;
    border-radius: 8px;
}

ul {
    padding-left: 22px;
}

@media (max-width: 520px) {
    body {
        padding: 20px 12px;
    }

    .container {
        padding: 20px;
    }
}
$ref_2db22d0489$, 'bundle:exercise-reference-ds2-corrected:2db22d04892c', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"ffc709bed0892ee900c7719cc14a3b2a3e5994efe4e8e8274020b83c93ac7e1e","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 10
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_e485ed6455$* {
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    text-align: center;
    padding: 40px 16px;
    margin: 0;
}

.container {
    background-color: white;
    max-width: 430px;
    margin: auto;
    padding: 28px;
    border-radius: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.12);
}

h1 {
    color: #333;
    margin-top: 0;
}

label {
    display: block;
    margin-top: 15px;
    font-weight: bold;
    text-align: left;
}

input {
    width: 100%;
    padding: 11px;
    margin-top: 6px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;
}

.botoes {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

button {
    flex: 1;
    padding: 11px 16px;
    border: none;
    border-radius: 8px;
    background-color: #007bff;
    color: white;
    font-size: 16px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

button.secundario {
    background-color: #6c757d;
}

button.secundario:hover {
    background-color: #545b62;
}

#resultado {
    min-height: 24px;
    margin-top: 22px;
    font-size: 18px;
    font-weight: bold;
}

.dica {
    margin-bottom: 0;
    color: #555;
    font-size: 14px;
}

@media (max-width: 480px) {
    body {
        padding: 20px 12px;
    }

    .container {
        padding: 22px;
    }

    .botoes {
        flex-direction: column;
    }
}
$ref_e485ed6455$, 'bundle:exercise-reference:e485ed6455bc', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"4ece7f17237fde62ec714fecda27146b9aed79a371e04b42265cd15620bd9fd8","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 10
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_ded1d43431$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 10 — Simulação de Login</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <main class="container">
        <h1>Simulação de Login</h1>
        <p>Atividade didática para praticar condições.</p>
        <label for="usuario">Usuário:</label>
        <input type="text" id="usuario">
        <label for="senha">Senha:</label>
        <input type="password" id="senha">
        <button id="entrar" type="button">Entrar</button>
        <p id="resultado" class="resultado">Resultado:</p>
    </main>
</body>
</html>
$ref_ded1d43431$, 'bundle:exercise-reference-ds2-corrected:ded1d434317e', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"2d52e4a6ffff2ea1fac4e296fbc124f6d0014a382f59985dee8b117b2d7908f8","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 10
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_477a175d21$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 10 — Login Simples</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <main class="container">
        <h1>Login Simples</h1>
        <p>Digite o usuário e a senha para testar a validação.</p>

        <label for="usuario">Usuário:</label>
        <input type="text" id="usuario" placeholder="Digite o usuário">

        <label for="senha">Senha:</label>
        <input type="password" id="senha" placeholder="Digite a senha">

        <div class="botoes">
            <button onclick="verificarLogin()">Entrar</button>
            <button class="secundario" onclick="limparCampos()">Limpar</button>
        </div>

        <p id="resultado">Resultado: </p>
        <p class="dica">Teste com o usuário <strong>aluno</strong> e a senha <strong>1234</strong>.</p>
    </main>

    <script src="script.js"></script>
</body>
</html>
$ref_477a175d21$, 'bundle:exercise-reference:477a175d21c6', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"26fff7d13fdd283c87334a0983ac027844f79fb19edc7ae854b92174ddc7ee5c","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 10
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_c2d7badda0$const usuario = document.querySelector("#usuario");
const senha = document.querySelector("#senha");
const botao = document.querySelector("#entrar");
const resultado = document.querySelector("#resultado");

botao.addEventListener("click", () => {
    const usuarioDigitado = usuario.value.trim();
    const senhaDigitada = senha.value.trim();

    if (usuarioDigitado === "aluno" && senhaDigitada === "1234") {
        resultado.textContent = "Resultado: acesso permitido!";
    } else {
        resultado.textContent = "Resultado: usuário ou senha incorretos.";
    }
});
$ref_c2d7badda0$, 'bundle:exercise-reference-ds2-corrected:c2d7badda031', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"de1e6d6695e4d3b49faafdbcbc4e6321b325620058c2555ca22406b87bb3a58c","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 10
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_8d8e462e5d$function verificarLogin() {
    let usuario = document.getElementById("usuario").value.trim();
    let senha = document.getElementById("senha").value.trim();
    let resultado = document.getElementById("resultado");

    if (usuario === "" || senha === "") {
        resultado.innerText = "Resultado: preencha o usuário e a senha.";
        resultado.style.color = "#b26a00";
    } else if (usuario === "aluno" && senha === "1234") {
        resultado.innerText = "Resultado: acesso permitido!";
        resultado.style.color = "green";
    } else {
        resultado.innerText = "Resultado: usuário ou senha incorretos.";
        resultado.style.color = "red";
    }
}

function limparCampos() {
    document.getElementById("usuario").value = "";
    document.getElementById("senha").value = "";
    document.getElementById("resultado").innerText = "Resultado: ";
    document.getElementById("resultado").style.color = "#333";
    document.getElementById("usuario").focus();
}
$ref_8d8e462e5d$, 'bundle:exercise-reference:8d8e462e5d37', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"114882f3058d48178249b2b8cce892270ca1faac47e0d84bedf613870218b1c5","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 10
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_c2151f60d9$* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    padding: 40px 16px;
    font-family: Arial, sans-serif;
    background-color: #f3f4f6;
    color: #1f2937;
}

.container {
    width: min(620px, 100%);
    margin: auto;
    padding: 28px;
    background-color: white;
    border-radius: 14px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.10);
}

h1 {
    margin-top: 0;
    color: #0f766e;
}

p {
    line-height: 1.5;
}

label {
    display: block;
    margin-top: 16px;
    font-weight: bold;
}

input, textarea, select, button {
    font: inherit;
}

input, textarea, select {
    width: 100%;
    margin-top: 7px;
    padding: 11px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
}

button {
    margin-top: 18px;
    padding: 10px 16px;
    border: 0;
    border-radius: 8px;
    background-color: #0f766e;
    color: white;
    cursor: pointer;
}

button:hover {
    filter: brightness(0.9);
}

.resultado {
    min-height: 28px;
    margin-top: 20px;
    padding: 14px;
    border-left: 4px solid #0f766e;
    background-color: #f0fdfa;
    border-radius: 8px;
}

ul {
    padding-left: 22px;
}

@media (max-width: 520px) {
    body {
        padding: 20px 12px;
    }

    .container {
        padding: 20px;
    }
}
$ref_c2151f60d9$, 'bundle:exercise-reference-ds2-corrected:c2151f60d93a', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"4105e4713c705057d9b3a14fd4df866b2bf97d82f2f6e701598f15ea25735f94","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 11
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_9c064e5d82$* {
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    background-color: #eef3f8;
    color: #263238;
    margin: 0;
    padding: 40px 16px;
}

.container {
    width: 100%;
    max-width: 620px;
    margin: auto;
    padding: 30px;
    background-color: white;
    border-radius: 14px;
    box-shadow: 0 12px 30px rgba(38, 50, 56, 0.15);
}

h1 {
    margin-top: 0;
    color: #174ea6;
    text-align: center;
}

.container > p {
    color: #52606d;
    text-align: center;
}

label {
    display: block;
    margin-top: 22px;
    font-weight: bold;
}

input {
    width: 100%;
    margin-top: 8px;
    padding: 12px;
    border: 1px solid #aeb8c2;
    border-radius: 8px;
    font-size: 16px;
}

input:focus {
    border-color: #174ea6;
    outline: 3px solid rgba(23, 78, 166, 0.15);
}

.botoes {
    display: flex;
    gap: 10px;
    margin-top: 22px;
}

button {
    flex: 1;
    padding: 12px 16px;
    border: none;
    border-radius: 8px;
    background-color: #174ea6;
    color: white;
    font-size: 16px;
    cursor: pointer;
}

button:hover {
    background-color: #0f3d82;
}

button.secundario {
    background-color: #607d8b;
}

button.secundario:hover {
    background-color: #455a64;
}

.painel-resultado {
    margin-top: 26px;
    padding: 20px;
    border-left: 5px solid #174ea6;
    border-radius: 8px;
    background-color: #f5f8fc;
}

.painel-resultado h2 {
    margin-top: 0;
    font-size: 20px;
}

#mensagem {
    color: #52606d;
}

#resultado {
    min-height: 52px;
    margin-bottom: 0;
    color: #174ea6;
    font-size: 20px;
    font-weight: bold;
    line-height: 1.7;
    overflow-wrap: anywhere;
}

@media (max-width: 520px) {
    body {
        padding: 20px 12px;
    }

    .container {
        padding: 22px;
    }

    h1 {
        font-size: 25px;
    }

    .botoes {
        flex-direction: column;
    }

    #resultado {
        font-size: 18px;
    }
}
$ref_9c064e5d82$, 'bundle:exercise-reference:9c064e5d82ab', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"23342e12f1eca608c0e7eb0a18e69263d0003e47a5a81374e624f677af575731","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 11
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_77652ef863$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 11 — Lista Numérica com Laço for</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <main class="container">
        <h1>Lista Numérica com Laço for</h1>
        <p>Clique no botão para mostrar os números de 1 até 10.</p>
        <button id="gerar" type="button">Gerar lista</button>
        <ul id="lista"></ul>
    </main>
</body>
</html>
$ref_77652ef863$, 'bundle:exercise-reference-ds2-corrected:77652ef86312', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"475703fcf2fe519118ee5172716e028c5337bd1726cdcd9d5f0289fabddf9f27","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 11
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_6277af3e23$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 11 — Contador com Laço</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <main class="container">
        <h1>Contador com Laço de Repetição</h1>
        <p>Digite um número para gerar uma contagem de 1 até ele.</p>

        <label for="limite">Número final da contagem:</label>
        <input type="number" id="limite" min="1" max="100"
               placeholder="Digite um número entre 1 e 100">

        <div class="botoes">
            <button onclick="gerarContagem()">Gerar contagem</button>
            <button class="secundario" onclick="limparCampos()">Limpar</button>
        </div>

        <section class="painel-resultado">
            <h2>Resultado</h2>
            <p id="mensagem">Informe um número para começar.</p>
            <p id="resultado" aria-live="polite"></p>
        </section>
    </main>

    <script src="script.js"></script>
</body>
</html>
$ref_6277af3e23$, 'bundle:exercise-reference:6277af3e23a8', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"31ea43d6b4a3ad7ae37c2ebcedf0ad270ea3285016458b497d65fb7282714e90","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 11
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_1c3d3aa874$const botao = document.querySelector("#gerar");
const lista = document.querySelector("#lista");

botao.addEventListener("click", () => {
    lista.innerHTML = "";

    for (let numero = 1; numero <= 10; numero++) {
        const item = document.createElement("li");
        item.textContent = numero;
        lista.appendChild(item);
    }
});
$ref_1c3d3aa874$, 'bundle:exercise-reference-ds2-corrected:1c3d3aa87472', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"cda8300e9aff9c30f7df8484d0d5bb342d10ed693ce4ec0aa77885bef325d815","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 11
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_ac5226849d$function gerarContagem() {
    let limiteDigitado = document.getElementById("limite").value;
    let mensagem = document.getElementById("mensagem");
    let resultado = document.getElementById("resultado");

    resultado.innerText = "";

    if (limiteDigitado === "") {
        mensagem.innerText = "Digite o número final da contagem.";
        mensagem.style.color = "#b3261e";
        return;
    }

    let limite = Number(limiteDigitado);

    if (limite < 1 || limite > 100) {
        mensagem.innerText = "Digite um número entre 1 e 100.";
        mensagem.style.color = "#b3261e";
        return;
    }

    let contagem = "";

    for (let numero = 1; numero <= limite; numero++) {
        contagem += numero;

        if (numero < limite) {
            contagem += " - ";
        }
    }

    mensagem.innerText = "Contagem gerada com sucesso!";
    mensagem.style.color = "green";
    resultado.innerText = contagem;
}

function limparCampos() {
    document.getElementById("limite").value = "";
    document.getElementById("mensagem").innerText =
        "Informe um número para começar.";
    document.getElementById("mensagem").style.color = "#52606d";
    document.getElementById("resultado").innerText = "";
    document.getElementById("limite").focus();
}
$ref_ac5226849d$, 'bundle:exercise-reference:ac5226849d26', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"4b4cd86739ddfd416676cfbfa4c494fabdb6773f54297ad0cf61be6bfc005d12","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 11
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_8d90daa804$* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    padding: 40px 16px;
    font-family: Arial, sans-serif;
    background-color: #f3f4f6;
    color: #1f2937;
}

.container {
    width: min(620px, 100%);
    margin: auto;
    padding: 28px;
    background-color: white;
    border-radius: 14px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.10);
}

h1 {
    margin-top: 0;
    color: #7e22ce;
}

p {
    line-height: 1.5;
}

label {
    display: block;
    margin-top: 16px;
    font-weight: bold;
}

input, textarea, select, button {
    font: inherit;
}

input, textarea, select {
    width: 100%;
    margin-top: 7px;
    padding: 11px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
}

button {
    margin-top: 18px;
    padding: 10px 16px;
    border: 0;
    border-radius: 8px;
    background-color: #7e22ce;
    color: white;
    cursor: pointer;
}

button:hover {
    filter: brightness(0.9);
}

.resultado {
    min-height: 28px;
    margin-top: 20px;
    padding: 14px;
    border-left: 4px solid #7e22ce;
    background-color: #faf5ff;
    border-radius: 8px;
}

ul {
    padding-left: 22px;
}

@media (max-width: 520px) {
    body {
        padding: 20px 12px;
    }

    .container {
        padding: 20px;
    }
}
$ref_8d90daa804$, 'bundle:exercise-reference-ds2-corrected:8d90daa804a4', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"901e4031dc0d17d57e1e71743fbcaae79559fb071ef9ad83e21a36d17e365b05","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 12
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_8289d93a7b$* {
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    background-color: #eef3f8;
    color: #263238;
    margin: 0;
    padding: 40px 16px;
}

.container {
    width: 100%;
    max-width: 560px;
    margin: auto;
    padding: 30px;
    background-color: white;
    border-radius: 14px;
    box-shadow: 0 12px 30px rgba(38, 50, 56, 0.15);
}

h1 {
    margin-top: 0;
    color: #174ea6;
    text-align: center;
}

.container > p {
    text-align: center;
    color: #52606d;
}

label {
    display: block;
    margin-top: 18px;
    font-weight: bold;
}

input[type="text"],
input[type="number"] {
    width: 100%;
    padding: 11px;
    margin-top: 7px;
    border: 1px solid #aeb8c2;
    border-radius: 8px;
    font-size: 16px;
}

input:focus {
    border-color: #174ea6;
    outline: 3px solid rgba(23, 78, 166, 0.15);
}

.opcao {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    font-weight: normal;
    line-height: 1.4;
}

.opcao input {
    margin-top: 3px;
}

.botoes {
    display: flex;
    gap: 10px;
    margin-top: 24px;
}

button {
    flex: 1;
    padding: 12px 16px;
    border: none;
    border-radius: 8px;
    background-color: #174ea6;
    color: white;
    font-size: 16px;
    cursor: pointer;
}

button:hover {
    background-color: #0f3d82;
}

button.secundario {
    background-color: #607d8b;
}

button.secundario:hover {
    background-color: #455a64;
}

.resultado {
    margin-top: 25px;
    padding: 18px;
    border-left: 5px solid #174ea6;
    border-radius: 8px;
    background-color: #f5f8fc;
}

.resultado h2 {
    margin-top: 0;
    font-size: 20px;
}

.resultado p {
    margin: 8px 0;
    overflow-wrap: anywhere;
}

#mensagem {
    color: #52606d;
}

@media (max-width: 520px) {
    body {
        padding: 20px 12px;
    }

    .container {
        padding: 22px;
    }

    h1 {
        font-size: 25px;
    }

    .botoes {
        flex-direction: column;
    }
}
$ref_8289d93a7b$, 'bundle:exercise-reference:8289d93a7b25', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"615a3a4f213b1d4c898b888c25c7f7932f98500e0516bf72f08dfd2d639129d7","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 12
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_8e71b0284f$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 12 — Identificando Tipos de Dados</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <main class="container">
        <h1>Identificando Tipos de Dados</h1>
        <p>Clique para identificar os tipos de cinco valores diferentes.</p>
        <button id="analisar" type="button">Analisar tipos</button>
        <ul id="resultado" class="resultado"></ul>
    </main>
</body>
</html>
$ref_8e71b0284f$, 'bundle:exercise-reference-ds2-corrected:8e71b0284f5f', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"a60f1ce26591cb0200b1e77601fe5611fd9a140128fd6d27c86fe7e233cd0f96","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 12
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_e34638fa0e$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 12 — Tipos de Dados</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <main class="container">
        <h1>Tipos de Dados em JavaScript</h1>
        <p>Preencha os dados para descobrir o tipo de cada valor.</p>

        <label for="nome">Nome:</label>
        <input type="text" id="nome" placeholder="Digite seu nome">

        <label for="idade">Idade:</label>
        <input type="number" id="idade" placeholder="Digite sua idade">

        <label class="opcao" for="estudante">
            <input type="checkbox" id="estudante">
            Sou estudante do curso de Desenvolvimento de Sistemas
        </label>

        <div class="botoes">
            <button onclick="analisarDados()">Analisar dados</button>
            <button class="secundario" onclick="limparCampos()">Limpar</button>
        </div>

        <section id="resultado" class="resultado">
            <h2>Resultado da análise</h2>
            <p id="mensagem">Preencha os campos e clique em “Analisar dados”.</p>
            <p id="resultadoNome"></p>
            <p id="resultadoIdade"></p>
            <p id="resultadoEstudante"></p>
        </section>
    </main>

    <script src="script.js"></script>
</body>
</html>
$ref_e34638fa0e$, 'bundle:exercise-reference:e34638fa0e84', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"04a4b93af57c3162af3d181792d9422ef333824410470f1876d2a2ac1e2e5318","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 12
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_835dad5dfe$const botao = document.querySelector("#analisar");
const resultado = document.querySelector("#resultado");

botao.addEventListener("click", () => {
    const nome = "Ana";
    const idade = 16;
    const matriculado = true;
    const semValor = null;
    const aluno = { nome: "Ana", turma: "2DS" };

    const tipos = [
        "nome: " + typeof nome,
        "idade: " + typeof idade,
        "matriculado: " + typeof matriculado,
        "semValor: " + typeof semValor,
        "aluno: " + typeof aluno
    ];

    resultado.innerHTML = "";
    tipos.forEach((tipo) => {
        const item = document.createElement("li");
        item.textContent = tipo;
        resultado.appendChild(item);
    });
});
$ref_835dad5dfe$, 'bundle:exercise-reference-ds2-corrected:835dad5dfe65', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"aeae201e39fb1506d4719d4ed350fa492c99abce9d20709d2cf427a423dffea0","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 12
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_0163a9bb36$function analisarDados() {
    let nome = document.getElementById("nome").value.trim();
    let idadeDigitada = document.getElementById("idade").value;
    let idade = Number(idadeDigitada);
    let estudante = document.getElementById("estudante").checked;

    let mensagem = document.getElementById("mensagem");
    let resultadoNome = document.getElementById("resultadoNome");
    let resultadoIdade = document.getElementById("resultadoIdade");
    let resultadoEstudante = document.getElementById("resultadoEstudante");

    if (nome === "" || idadeDigitada === "") {
        mensagem.innerText = "Preencha o nome e a idade antes de analisar.";
        mensagem.style.color = "#b3261e";
        resultadoNome.innerText = "";
        resultadoIdade.innerText = "";
        resultadoEstudante.innerText = "";
        return;
    }

    mensagem.innerText = "Dados analisados com sucesso!";
    mensagem.style.color = "green";

    resultadoNome.innerText =
        "Nome: " + nome + " | Tipo: " + typeof nome;

    resultadoIdade.innerText =
        "Idade: " + idade + " | Tipo: " + typeof idade;

    resultadoEstudante.innerText =
        "É estudante: " + estudante + " | Tipo: " + typeof estudante;
}

function limparCampos() {
    document.getElementById("nome").value = "";
    document.getElementById("idade").value = "";
    document.getElementById("estudante").checked = false;

    document.getElementById("mensagem").innerText =
        "Preencha os campos e clique em “Analisar dados”.";
    document.getElementById("mensagem").style.color = "#52606d";
    document.getElementById("resultadoNome").innerText = "";
    document.getElementById("resultadoIdade").innerText = "";
    document.getElementById("resultadoEstudante").innerText = "";
    document.getElementById("nome").focus();
}
$ref_0163a9bb36$, 'bundle:exercise-reference:0163a9bb36f2', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"f1536152754c6834ae18c23877a665f8747a733c6f8265135a9d0716e94eb2fe","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 12
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_2651d2349f$* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    padding: 40px 16px;
    font-family: Arial, sans-serif;
    background-color: #f3f4f6;
    color: #1f2937;
}

.container {
    width: min(620px, 100%);
    margin: auto;
    padding: 28px;
    background-color: white;
    border-radius: 14px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.10);
}

h1 {
    margin-top: 0;
    color: #a21caf;
}

p {
    line-height: 1.5;
}

label {
    display: block;
    margin-top: 16px;
    font-weight: bold;
}

input, textarea, select, button {
    font: inherit;
}

input, textarea, select {
    width: 100%;
    margin-top: 7px;
    padding: 11px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
}

button {
    margin-top: 18px;
    padding: 10px 16px;
    border: 0;
    border-radius: 8px;
    background-color: #a21caf;
    color: white;
    cursor: pointer;
}

button:hover {
    filter: brightness(0.9);
}

.resultado {
    min-height: 28px;
    margin-top: 20px;
    padding: 14px;
    border-left: 4px solid #a21caf;
    background-color: #fdf4ff;
    border-radius: 8px;
}

ul {
    padding-left: 22px;
}

@media (max-width: 520px) {
    body {
        padding: 20px 12px;
    }

    .container {
        padding: 20px;
    }
}
$ref_2651d2349f$, 'bundle:exercise-reference-ds2-corrected:2651d2349f88', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"9015faab0e34eb1dcb5f67799170a6abe0c4f3c52b5c8c6ece9b43eb22712859","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 13
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_06415da65a$* {
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #edf3ff, #f7f9fc);
    color: #263238;
    margin: 0;
    padding: 40px 16px;
}

.container {
    width: 100%;
    max-width: 760px;
    margin: auto;
    padding: 32px;
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 14px 35px rgba(32, 54, 86, 0.16);
}

.etiqueta {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 999px;
    background-color: #e8e3ff;
    color: #5139a8;
    font-weight: bold;
}

h1 {
    margin: 14px 0 8px;
    color: #263b80;
    text-align: center;
}

.introducao {
    margin-top: 0;
    color: #52606d;
    text-align: center;
}

.painel-variaveis {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin: 26px 0;
}

.cartao {
    min-height: 145px;
    padding: 18px;
    border: 2px solid transparent;
    border-radius: 12px;
    text-align: center;
}

.cartao h2 {
    margin: 0 0 8px;
    font-family: "Courier New", monospace;
}

.cartao p {
    min-height: 36px;
    margin: 0 0 12px;
    color: #52606d;
}

.cartao strong {
    display: block;
    overflow-wrap: anywhere;
    font-size: 20px;
}

.cartao.var {
    background-color: #fff4e5;
    border-color: #ffb74d;
}

.cartao.let {
    background-color: #e8f4ff;
    border-color: #64b5f6;
}

.cartao.const {
    background-color: #edf8ed;
    border-color: #81c784;
}

label {
    display: block;
    margin-top: 16px;
    font-weight: bold;
}

input {
    width: 100%;
    padding: 11px;
    margin-top: 7px;
    border: 1px solid #aeb8c2;
    border-radius: 8px;
    font-size: 16px;
}

input:focus {
    border-color: #5139a8;
    outline: 3px solid rgba(81, 57, 168, 0.15);
}

.botoes {
    display: flex;
    gap: 10px;
    margin-top: 22px;
}

button {
    flex: 1;
    padding: 12px 16px;
    border: none;
    border-radius: 8px;
    background-color: #5139a8;
    color: white;
    font-size: 16px;
    cursor: pointer;
}

button:hover {
    background-color: #3d2b82;
}

button.secundario {
    background-color: #607d8b;
}

button.secundario:hover {
    background-color: #455a64;
}

.resultado {
    margin-top: 24px;
    padding: 18px;
    border-left: 5px solid #5139a8;
    border-radius: 8px;
    background-color: #f6f4ff;
}

.resultado h2 {
    margin-top: 0;
    font-size: 20px;
}

.resultado p {
    margin: 8px 0;
}

#resumo {
    font-weight: bold;
    overflow-wrap: anywhere;
}

@media (max-width: 680px) {
    body {
        padding: 20px 12px;
    }

    .container {
        padding: 22px;
    }

    .painel-variaveis {
        grid-template-columns: 1fr;
    }

    .cartao {
        min-height: auto;
    }

    .botoes {
        flex-direction: column;
    }
}
$ref_06415da65a$, 'bundle:exercise-reference:06415da65aa4', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"e31070abed5ace697c2487ee03e49829f77321274aa94f4007b8571403c9d027","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 13
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_3ccdb30f1c$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 13 — Trabalhando com var, let e const</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <main class="container">
        <h1>Trabalhando com var, let e const</h1>
        <p id="varValor">var curso: Front-End</p>
        <p id="letValor">let pontos: 0</p>
        <p id="constValor">const ano: 2026</p>
        <button id="alterar" type="button">Alterar valores permitidos</button>
    </main>
</body>
</html>
$ref_3ccdb30f1c$, 'bundle:exercise-reference-ds2-corrected:3ccdb30f1cd7', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"13f3b41ba3f4dccf23d474474b3aa604ad2acd70efa9da4725d3447562f9473b","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 13
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_529f9120be$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 13 — var, let e const</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <main class="container">
        <span class="etiqueta">Exercício 13</span>
        <h1>Laboratório de Variáveis</h1>
        <p class="introducao">Altere os valores e observe o papel de var, let e const.</p>

        <section class="painel-variaveis">
            <article class="cartao var">
                <h2>var</h2>
                <p>Nome do projeto</p>
                <strong id="valorVar">Projeto Front-End</strong>
            </article>

            <article class="cartao let">
                <h2>let</h2>
                <p>Pontuação atual</p>
                <strong id="valorLet">0</strong>
            </article>

            <article class="cartao const">
                <h2>const</h2>
                <p>Limite de pontos</p>
                <strong id="valorConst">50</strong>
            </article>
        </section>

        <label for="nomeProjeto">Novo nome do projeto:</label>
        <input type="text" id="nomeProjeto" placeholder="Exemplo: Portal 2DS">

        <label for="pontosAdicionar">Pontos para adicionar:</label>
        <input type="number" id="pontosAdicionar" min="1" max="50" placeholder="Exemplo: 10">

        <div class="botoes">
            <button onclick="atualizarPainel()">Atualizar valores</button>
            <button class="secundario" onclick="reiniciarPainel()">Reiniciar</button>
        </div>

        <section class="resultado">
            <h2>Resultado</h2>
            <p id="mensagem">Preencha os campos para testar as variáveis.</p>
            <p id="resumo"></p>
        </section>
    </main>

    <script src="script.js"></script>
</body>
</html>
$ref_529f9120be$, 'bundle:exercise-reference:529f9120be9c', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"ef13c3775b9970256da0430909c9cbd84218318de541fe538c5485ce923add73","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 13
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_bd5cdbd0fc$var curso = "Front-End";
let pontos = 0;
const ANO = 2026;

const botao = document.querySelector("#alterar");

botao.addEventListener("click", () => {
    curso = "Desenvolvimento Web";
    pontos = pontos + 10;

    document.querySelector("#varValor").textContent =
        "var curso: " + curso;
    document.querySelector("#letValor").textContent =
        "let pontos: " + pontos;
    document.querySelector("#constValor").textContent =
        "const ano: " + ANO;
});
$ref_bd5cdbd0fc$, 'bundle:exercise-reference-ds2-corrected:bd5cdbd0fc26', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"e83bce2d68ae038f1b7dc59b74e0fa214edc2103522becf64c3ea6db8c4d4a51","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 13
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_f9c2fb4df7$var projeto = "Projeto Front-End";
let pontos = 0;
const LIMITE_PONTOS = 50;
const TURMA = "2DS";

function atualizarPainel() {
    let novoNome = document.getElementById("nomeProjeto").value.trim();
    let valorDigitado = document.getElementById("pontosAdicionar").value;
    let quantidade = Number(valorDigitado);
    var mensagem = document.getElementById("mensagem");

    if (novoNome === "" || valorDigitado === "") {
        mensagem.innerText = "Preencha o nome do projeto e os pontos.";
        mensagem.style.color = "#b3261e";
        return;
    }

    if (quantidade <= 0) {
        mensagem.innerText = "Digite uma quantidade maior que zero.";
        mensagem.style.color = "#b3261e";
        return;
    }

    projeto = novoNome;
    pontos += quantidade;

    if (pontos >= LIMITE_PONTOS) {
        pontos = LIMITE_PONTOS;
        mensagem.innerText = "O limite de pontos foi atingido.";
        mensagem.style.color = "#b26a00";
    } else {
        mensagem.innerText = "Os valores de var e let foram atualizados.";
        mensagem.style.color = "green";
    }

    mostrarValores();
}

function mostrarValores() {
    document.getElementById("valorVar").innerText = projeto;
    document.getElementById("valorLet").innerText = pontos;
    document.getElementById("valorConst").innerText = LIMITE_PONTOS;
    document.getElementById("resumo").innerText =
        "Turma: " + TURMA + " | Projeto: " + projeto +
        " | Pontos: " + pontos + " de " + LIMITE_PONTOS;
}

function reiniciarPainel() {
    projeto = "Projeto Front-End";
    pontos = 0;

    document.getElementById("nomeProjeto").value = "";
    document.getElementById("pontosAdicionar").value = "";
    document.getElementById("mensagem").innerText =
        "Preencha os campos para testar as variáveis.";
    document.getElementById("mensagem").style.color = "#52606d";

    mostrarValores();
    document.getElementById("nomeProjeto").focus();
}

mostrarValores();
$ref_f9c2fb4df7$, 'bundle:exercise-reference:f9c2fb4df751', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"f86179fe618bbd744023b825302f16ffebc1d5866daa8374b114dd762600e75f","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 13
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_e379a5e496$* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    padding: 40px 16px;
    font-family: Arial, sans-serif;
    background-color: #f3f4f6;
    color: #1f2937;
}

.container {
    width: min(620px, 100%);
    margin: auto;
    padding: 28px;
    background-color: white;
    border-radius: 14px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.10);
}

h1 {
    margin-top: 0;
    color: #047857;
}

p {
    line-height: 1.5;
}

label {
    display: block;
    margin-top: 16px;
    font-weight: bold;
}

input, textarea, select, button {
    font: inherit;
}

input, textarea, select {
    width: 100%;
    margin-top: 7px;
    padding: 11px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
}

button {
    margin-top: 18px;
    padding: 10px 16px;
    border: 0;
    border-radius: 8px;
    background-color: #047857;
    color: white;
    cursor: pointer;
}

button:hover {
    filter: brightness(0.9);
}

.resultado {
    min-height: 28px;
    margin-top: 20px;
    padding: 14px;
    border-left: 4px solid #047857;
    background-color: #ecfdf5;
    border-radius: 8px;
}

ul {
    padding-left: 22px;
}

@media (max-width: 520px) {
    body {
        padding: 20px 12px;
    }

    .container {
        padding: 20px;
    }
}
$ref_e379a5e496$, 'bundle:exercise-reference-ds2-corrected:e379a5e496b2', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"89d7d861e0583b6dd38d87599a70405bc8d863e026c2fa0cef2cd4163dda8c7e","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 14
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_74104deb99$* {
    box-sizing: border-box;
}

body {
    min-height: 100vh;
    margin: 0;
    padding: 40px 16px;
    font-family: Arial, sans-serif;
    color: #263238;
    background: linear-gradient(135deg, #eaf4ff, #f8fbff);
}

.container {
    width: 100%;
    max-width: 760px;
    margin: auto;
    padding: 32px;
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 14px 35px rgba(32, 54, 86, 0.16);
}

.etiqueta {
    display: inline-block;
    padding: 6px 12px;
    color: #174ea6;
    background-color: #e8f0fe;
    border-radius: 999px;
    font-weight: bold;
}

h1 {
    margin: 14px 0 8px;
    color: #173b73;
    text-align: center;
}

.introducao {
    margin: 0;
    color: #52606d;
    text-align: center;
}

.painel-escopo {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin: 28px 0;
}

.cartao {
    min-height: 165px;
    padding: 20px;
    border: 2px solid transparent;
    border-radius: 14px;
}

.cartao.global {
    background-color: #e8f4ff;
    border-color: #64b5f6;
}

.cartao.local {
    background-color: #f2ecff;
    border-color: #9575cd;
}

.tipo {
    display: inline-block;
    margin-bottom: 12px;
    padding: 5px 9px;
    border-radius: 999px;
    background-color: rgba(255, 255, 255, 0.75);
    font-size: 14px;
    font-weight: bold;
}

.cartao h2 {
    margin: 0 0 12px;
    font-size: 22px;
}

.cartao p {
    margin: 0;
    line-height: 1.5;
}

label {
    display: block;
    margin-top: 18px;
    font-weight: bold;
}

input {
    width: 100%;
    margin-top: 8px;
    padding: 12px;
    border: 1px solid #aeb8c2;
    border-radius: 8px;
    font-size: 16px;
}

input:focus {
    border-color: #174ea6;
    outline: 3px solid rgba(23, 78, 166, 0.15);
}

.botoes {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 22px;
}

button {
    padding: 12px 14px;
    border: none;
    border-radius: 8px;
    color: white;
    background-color: #174ea6;
    font-size: 16px;
    cursor: pointer;
}

button:hover {
    background-color: #123b7a;
}

button.resumo {
    background-color: #6a43a3;
}

button.resumo:hover {
    background-color: #50317f;
}

button.secundario {
    background-color: #607d8b;
}

button.secundario:hover {
    background-color: #455a64;
}

.resultado {
    margin-top: 24px;
    padding: 18px;
    border-left: 5px solid #174ea6;
    border-radius: 8px;
    background-color: #f3f7fd;
}

.resultado h2 {
    margin-top: 0;
    font-size: 20px;
}

.resultado p {
    margin: 8px 0;
}

#resumo {
    font-weight: bold;
}

@media (max-width: 680px) {
    body {
        padding: 20px 12px;
    }

    .container {
        padding: 22px;
    }

    .painel-escopo {
        grid-template-columns: 1fr;
    }

    .botoes {
        grid-template-columns: 1fr;
    }
}
$ref_74104deb99$, 'bundle:exercise-reference:74104deb99cc', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"5435e92f869b247780e7e5301fd5b9b697cb4805f5342d4f7b8dac42f6fe824e","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 14
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_8f6012a256$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 14 — Variáveis Locais e Globais</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <main class="container">
        <h1>Variáveis Locais e Globais</h1>
        <p id="global" class="resultado">Total global de visitas: 0</p>
        <label for="nome">Nome do visitante:</label>
        <input type="text" id="nome">
        <button id="registrar" type="button">Registrar visita</button>
        <p id="local" class="resultado">Variável local: aguardando.</p>
    </main>
</body>
</html>
$ref_8f6012a256$, 'bundle:exercise-reference-ds2-corrected:8f6012a25665', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"686a3dbee3a452061f485f15bdd90911cbfcf6ca3d43b22a40b9ea3fca2981a1","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 14
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_bbfefbbb27$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 14 — Variáveis Locais e Globais</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <main class="container">
        <span class="etiqueta">Exercício 14</span>
        <h1>Painel de Visitas</h1>
        <p class="introducao">
            Registre visitantes e observe a diferença entre variáveis globais e locais.
        </p>

        <section class="painel-escopo">
            <article class="cartao global">
                <span class="tipo">Variável global</span>
                <h2 id="nomeSistema">Portal 2DS</h2>
                <p>Total de visitas: <strong id="totalVisitas">0</strong></p>
            </article>

            <article class="cartao local">
                <span class="tipo">Variável local</span>
                <h2>Visitante atual</h2>
                <p id="visitanteAtual">Aguardando uma visita.</p>
            </article>
        </section>

        <label for="nomeVisitante">Nome do visitante:</label>
        <input
            type="text"
            id="nomeVisitante"
            placeholder="Exemplo: Ana"
            autocomplete="off"
        >

        <div class="botoes">
            <button onclick="registrarVisita()">Registrar visita</button>
            <button class="resumo" onclick="mostrarResumo()">Mostrar resumo</button>
            <button class="secundario" onclick="reiniciarPainel()">Reiniciar</button>
        </div>

        <section class="resultado" aria-live="polite">
            <h2>Mensagem</h2>
            <p id="mensagem">Digite um nome para registrar uma visita.</p>
            <p id="resumo"></p>
        </section>
    </main>

    <script src="script.js"></script>
</body>
</html>
$ref_bbfefbbb27$, 'bundle:exercise-reference:bbfefbbb2743', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"d0732036a6ee014a3a015956a57a5bd903410060703adb569c57f93f0880bef8","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 14
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_3c964b7a67$let totalVisitas = 0;
const campoNome = document.querySelector("#nome");
const botao = document.querySelector("#registrar");
const globalSaida = document.querySelector("#global");
const localSaida = document.querySelector("#local");

botao.addEventListener("click", () => {
    const nomeVisitante = campoNome.value.trim();

    if (nomeVisitante === "") {
        localSaida.textContent = "Variável local: digite um nome.";
        return;
    }

    totalVisitas++;
    const mensagemLocal = "Último visitante: " + nomeVisitante;

    globalSaida.textContent = "Total global de visitas: " + totalVisitas;
    localSaida.textContent = mensagemLocal;
});
$ref_3c964b7a67$, 'bundle:exercise-reference-ds2-corrected:3c964b7a6764', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"3af0b8b295413b7d7fc01fb67ea8c2eca2be777bc8e4e00e55c4048174dabcc5","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 14
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_0c6e931599$let totalVisitas = 0;
const NOME_SISTEMA = "Portal 2DS";

function registrarVisita() {
    const campoNome = document.getElementById("nomeVisitante");
    let nomeVisitante = campoNome.value.trim();
    let mensagem = document.getElementById("mensagem");

    if (nomeVisitante === "") {
        mensagem.innerText = "Digite o nome do visitante.";
        mensagem.style.color = "#b3261e";
        campoNome.focus();
        return;
    }

    totalVisitas++;

    let mensagemLocal =
        "Olá, " + nomeVisitante + "! Sua visita foi registrada.";

    document.getElementById("visitanteAtual").innerText = nomeVisitante;
    document.getElementById("totalVisitas").innerText = totalVisitas;
    document.getElementById("nomeSistema").innerText = NOME_SISTEMA;

    mensagem.innerText = mensagemLocal;
    mensagem.style.color = "green";
    document.getElementById("resumo").innerText = "";

    campoNome.value = "";
    campoNome.focus();
}

function mostrarResumo() {
    let textoResumo =
        NOME_SISTEMA + " recebeu " + totalVisitas + " visita(s).";

    document.getElementById("resumo").innerText = textoResumo;
}

function reiniciarPainel() {
    totalVisitas = 0;

    document.getElementById("nomeVisitante").value = "";
    document.getElementById("visitanteAtual").innerText =
        "Aguardando uma visita.";
    document.getElementById("totalVisitas").innerText = totalVisitas;
    document.getElementById("nomeSistema").innerText = NOME_SISTEMA;
    document.getElementById("mensagem").innerText =
        "Digite um nome para registrar uma visita.";
    document.getElementById("mensagem").style.color = "#52606d";
    document.getElementById("resumo").innerText = "";

    document.getElementById("nomeVisitante").focus();
}
$ref_0c6e931599$, 'bundle:exercise-reference:0c6e931599f2', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"8681d42522be535888310c1b7275a582376c0ab3847a93e63c5b666a742cd710","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 14
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_bf8c0e0e77$* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    padding: 40px 16px;
    font-family: Arial, sans-serif;
    background-color: #f3f4f6;
    color: #1f2937;
}

.container {
    width: min(620px, 100%);
    margin: auto;
    padding: 28px;
    background-color: white;
    border-radius: 14px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.10);
}

h1 {
    margin-top: 0;
    color: #166534;
}

p {
    line-height: 1.5;
}

label {
    display: block;
    margin-top: 16px;
    font-weight: bold;
}

input, textarea, select, button {
    font: inherit;
}

input, textarea, select {
    width: 100%;
    margin-top: 7px;
    padding: 11px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
}

button {
    margin-top: 18px;
    padding: 10px 16px;
    border: 0;
    border-radius: 8px;
    background-color: #166534;
    color: white;
    cursor: pointer;
}

button:hover {
    filter: brightness(0.9);
}

.resultado {
    min-height: 28px;
    margin-top: 20px;
    padding: 14px;
    border-left: 4px solid #166534;
    background-color: #f0fdf4;
    border-radius: 8px;
}

ul {
    padding-left: 22px;
}

@media (max-width: 520px) {
    body {
        padding: 20px 12px;
    }

    .container {
        padding: 20px;
    }
}
$ref_bf8c0e0e77$, 'bundle:exercise-reference-ds2-corrected:bf8c0e0e7708', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"79c199b260f27ee75d524e3c0f017fa0d6222aaa7645a117a6209d1e5b4acacd","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 15
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_c0980cc4e1$* {
    box-sizing: border-box;
}

body {
    min-height: 100vh;
    margin: 0;
    padding: 40px 16px;
    font-family: Arial, sans-serif;
    color: #263238;
    background: linear-gradient(135deg, #eef8f1, #f7fbff);
}

.container {
    width: 100%;
    max-width: 760px;
    margin: auto;
    padding: 32px;
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 14px 35px rgba(32, 72, 52, 0.16);
}

.etiqueta {
    display: inline-block;
    padding: 6px 12px;
    color: #176b3a;
    background-color: #e5f5ea;
    border-radius: 999px;
    font-weight: bold;
}

h1 {
    margin: 14px 0 8px;
    color: #174f31;
    text-align: center;
}

.introducao {
    margin: 0;
    color: #52606d;
    text-align: center;
}

.explicacao-funcao {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    margin: 28px 0;
}

.explicacao-funcao article {
    padding: 18px;
    border: 1px solid #cae5d3;
    border-radius: 12px;
    background-color: #f3fbf5;
}

.explicacao-funcao span {
    color: #176b3a;
    font-weight: bold;
}

.explicacao-funcao p {
    margin: 8px 0 0;
    line-height: 1.5;
}

label {
    display: block;
    margin-top: 18px;
    font-weight: bold;
}

input {
    width: 100%;
    margin-top: 8px;
    padding: 12px;
    border: 1px solid #aeb8c2;
    border-radius: 8px;
    font-size: 16px;
}

input:focus {
    border-color: #176b3a;
    outline: 3px solid rgba(23, 107, 58, 0.15);
}

.botoes {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 10px;
    margin-top: 22px;
}

button {
    padding: 12px 14px;
    border: none;
    border-radius: 8px;
    color: white;
    background-color: #176b3a;
    font-size: 16px;
    cursor: pointer;
}

button:hover {
    background-color: #10522c;
}

button.secundario {
    background-color: #607d8b;
}

button.secundario:hover {
    background-color: #455a64;
}

.resultado {
    margin-top: 26px;
    padding: 20px;
    border-left: 5px solid #176b3a;
    border-radius: 10px;
    background-color: #f4f9f5;
}

.resultado h2 {
    margin-top: 0;
}

#mensagem {
    color: #52606d;
}

.valores {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: 18px;
}

.valores article {
    padding: 16px;
    border: 1px solid #d8e4dc;
    border-radius: 10px;
    background-color: white;
}

.valores span {
    display: block;
    margin-bottom: 9px;
    color: #52606d;
    font-size: 14px;
}

.valores strong {
    color: #263238;
    font-size: 20px;
}

.valores .destaque {
    color: white;
    background-color: #176b3a;
    border-color: #176b3a;
}

.valores .destaque span,
.valores .destaque strong {
    color: white;
}

@media (max-width: 680px) {
    body {
        padding: 20px 12px;
    }

    .container {
        padding: 22px;
    }

    .explicacao-funcao,
    .valores,
    .botoes {
        grid-template-columns: 1fr;
    }
}
$ref_c0980cc4e1$, 'bundle:exercise-reference:c0980cc4e1d8', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"8fa520f3f6d54cc6cb56fda873ef1310d3395247d393826d7418356f76a5308a","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 15
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_2afe083997$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 15 — Funções com Parâmetros e Retorno</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <main class="container">
        <h1>Funções com Parâmetros e Retorno</h1>
        <label for="preco">Preço do produto:</label>
        <input type="number" id="preco" min="0" step="0.01">
        <label for="desconto">Desconto (%):</label>
        <input type="number" id="desconto" min="0" max="100">
        <button id="calcular" type="button">Calcular preço final</button>
        <p id="resultado" class="resultado">Resultado:</p>
    </main>
</body>
</html>
$ref_2afe083997$, 'bundle:exercise-reference-ds2-corrected:2afe0839971c', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"5bc12edd50217fd906e447587d1996a57dfc5e8c4404fad7ddbc56a367d3499e","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 15
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_4705c34c64$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 15 — Calculadora de Desconto</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <main class="container">
        <span class="etiqueta">Exercício 15</span>
        <h1>Calculadora de Desconto</h1>
        <p class="introducao">
            Informe o preço e o percentual para calcular o valor final.
        </p>

        <section class="explicacao-funcao">
            <article>
                <span>Parâmetros</span>
                <p>Os valores entram na função para serem utilizados no cálculo.</p>
            </article>

            <article>
                <span>Retorno</span>
                <p>O resultado é devolvido com a palavra reservada <strong>return</strong>.</p>
            </article>
        </section>

        <label for="preco">Preço do produto:</label>
        <input
            type="number"
            id="preco"
            min="0"
            step="0.01"
            placeholder="Exemplo: 150"
        >

        <label for="percentual">Percentual de desconto:</label>
        <input
            type="number"
            id="percentual"
            min="0"
            max="100"
            step="1"
            placeholder="Exemplo: 10"
        >

        <div class="botoes">
            <button onclick="mostrarCalculo()">Calcular desconto</button>
            <button class="secundario" onclick="limpar()">Limpar</button>
        </div>

        <section class="resultado" aria-live="polite">
            <h2>Resultado</h2>
            <p id="mensagem">Preencha os campos para realizar o cálculo.</p>

            <div class="valores">
                <article>
                    <span>Preço original</span>
                    <strong id="precoOriginal">R$ 0,00</strong>
                </article>

                <article>
                    <span>Valor do desconto</span>
                    <strong id="valorDesconto">R$ 0,00</strong>
                </article>

                <article class="destaque">
                    <span>Preço final</span>
                    <strong id="precoFinal">R$ 0,00</strong>
                </article>
            </div>
        </section>
    </main>

    <script src="script.js"></script>
</body>
</html>
$ref_4705c34c64$, 'bundle:exercise-reference:4705c34c649f', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"354bc459a88da3c27bd4422c789ccd365629b6e5759c501086c7d86fc0f1cce6","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 15
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_22d65fd01c$function calcularDesconto(preco, percentual) {
    return preco * (percentual / 100);
}

function calcularPrecoFinal(preco, desconto) {
    return preco - desconto;
}

const botao = document.querySelector("#calcular");
const resultado = document.querySelector("#resultado");

botao.addEventListener("click", () => {
    const preco = Number(document.querySelector("#preco").value);
    const percentual = Number(document.querySelector("#desconto").value);
    const valorDesconto = calcularDesconto(preco, percentual);
    const precoFinal = calcularPrecoFinal(preco, valorDesconto);

    resultado.textContent = "Preço final: R$ " + precoFinal.toFixed(2);
});
$ref_22d65fd01c$, 'bundle:exercise-reference-ds2-corrected:22d65fd01c03', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"c32700ac7381e2684c28d60750d5de6852dad41c662114e6bacb020da955c703","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 15
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_ba46930bad$function calcularValorDesconto(preco, percentual) {
    return preco * (percentual / 100);
}

function calcularPrecoFinal(preco, valorDesconto) {
    return preco - valorDesconto;
}

function formatarMoeda(valor) {
    return "R$ " + valor.toFixed(2).replace(".", ",");
}

function mostrarCalculo() {
    const campoPreco = document.getElementById("preco");
    const campoPercentual = document.getElementById("percentual");
    const mensagem = document.getElementById("mensagem");

    const preco = Number(campoPreco.value);
    const percentual = Number(campoPercentual.value);

    if (campoPreco.value === "" || preco <= 0) {
        mensagem.innerText = "Digite um preço maior que zero.";
        mensagem.style.color = "#b3261e";
        campoPreco.focus();
        return;
    }

    if (
        campoPercentual.value === "" ||
        percentual < 0 ||
        percentual > 100
    ) {
        mensagem.innerText = "Digite um desconto entre 0 e 100.";
        mensagem.style.color = "#b3261e";
        campoPercentual.focus();
        return;
    }

    const valorDesconto =
        calcularValorDesconto(preco, percentual);

    const precoFinal =
        calcularPrecoFinal(preco, valorDesconto);

    document.getElementById("precoOriginal").innerText =
        formatarMoeda(preco);

    document.getElementById("valorDesconto").innerText =
        formatarMoeda(valorDesconto);

    document.getElementById("precoFinal").innerText =
        formatarMoeda(precoFinal);

    mensagem.innerText =
        "Desconto calculado com funções, parâmetros e retorno.";
    mensagem.style.color = "green";
}

function limpar() {
    document.getElementById("preco").value = "";
    document.getElementById("percentual").value = "";

    document.getElementById("precoOriginal").innerText =
        "R$ 0,00";

    document.getElementById("valorDesconto").innerText =
        "R$ 0,00";

    document.getElementById("precoFinal").innerText =
        "R$ 0,00";

    document.getElementById("mensagem").innerText =
        "Preencha os campos para realizar o cálculo.";

    document.getElementById("mensagem").style.color = "#52606d";
    document.getElementById("preco").focus();
}
$ref_ba46930bad$, 'bundle:exercise-reference:ba46930bad20', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"b3eacccb4cefe8fb56970ff5ef2f6192dd2ec7f8873c1480c6bb05f20e34360e","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 15
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_456eb4b437$* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    padding: 40px 16px;
    font-family: Arial, sans-serif;
    background-color: #f3f4f6;
    color: #1f2937;
}

.container {
    width: min(620px, 100%);
    margin: auto;
    padding: 28px;
    background-color: white;
    border-radius: 14px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.10);
}

h1 {
    margin-top: 0;
    color: #0369a1;
}

p {
    line-height: 1.5;
}

label {
    display: block;
    margin-top: 16px;
    font-weight: bold;
}

input, textarea, select, button {
    font: inherit;
}

input, textarea, select {
    width: 100%;
    margin-top: 7px;
    padding: 11px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
}

button {
    margin-top: 18px;
    padding: 10px 16px;
    border: 0;
    border-radius: 8px;
    background-color: #0369a1;
    color: white;
    cursor: pointer;
}

button:hover {
    filter: brightness(0.9);
}

.resultado {
    min-height: 28px;
    margin-top: 20px;
    padding: 14px;
    border-left: 4px solid #0369a1;
    background-color: #f0f9ff;
    border-radius: 8px;
}

ul {
    padding-left: 22px;
}

@media (max-width: 520px) {
    body {
        padding: 20px 12px;
    }

    .container {
        padding: 20px;
    }
}
$ref_456eb4b437$, 'bundle:exercise-reference-ds2-corrected:456eb4b437e2', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"043d7d2ab352f1e596ef97076353edb52d6df8a7d304cfeab29cf05f6a7ef2da","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 16
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_616cc0ad2f$:root {
  color-scheme: dark;
  --fundo: #0d1117;
  --painel: #161b22;
  --borda: #30363d;
  --texto: #e6edf3;
  --suave: #9da7b3;
  --destaque: #58a6ff;
  --sucesso: #3fb950;
  --perigo: #f85149;
}
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; font-family: Arial, Helvetica, sans-serif; background: var(--fundo); color: var(--texto); }
main { width: min(820px, 92%); margin: 0 auto; padding: 36px 0; }
section { background: var(--painel); border: 1px solid var(--borda); border-radius: 14px; padding: 22px; margin-bottom: 18px; }
h1 { margin-top: 0; }
p { color: var(--suave); line-height: 1.55; }
input, button, select { min-height: 44px; border-radius: 9px; font: inherit; }
input, select { width: 100%; padding: 9px 11px; margin: 6px 0 12px; color: var(--texto); background: #0d1117; border: 1px solid var(--borda); }
button { padding: 9px 15px; border: 0; background: var(--destaque); color: #07111f; font-weight: 800; cursor: pointer; }
button.secundario { background: #30363d; color: var(--texto); }
button.perigo { background: var(--perigo); color: white; }
ul { padding-left: 22px; }
li { margin: 8px 0; }
.linha { display: flex; gap: 9px; align-items: center; flex-wrap: wrap; }
.cartao { padding: 14px; border: 1px solid var(--borda); border-radius: 10px; margin: 10px 0; }
.mensagem { min-height: 24px; color: var(--suave); }
.destaque { border-color: var(--destaque); box-shadow: 0 0 0 2px rgba(88,166,255,.2); }
@media (max-width: 620px) { main { padding-top: 20px; } .linha > * { width: 100%; } }
$ref_616cc0ad2f$, 'bundle:exercise-reference-extra:616cc0ad2f0c', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"3b7f3ae88f8f093bf00e8f6f8c0b8929a9c625311285cbeb4b4bbd3a7e5ca3df","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 16
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_cd9c66bbd6$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 16 — Lista de Nomes com Array</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <main class="container">
        <h1>Lista de Nomes com Array</h1>
        <label for="nome">Novo nome:</label>
        <input type="text" id="nome">
        <button id="adicionar" type="button">Adicionar nome</button>
        <p id="quantidade" class="resultado">Quantidade de nomes: 3</p>
        <ul id="lista"></ul>
    </main>
</body>
</html>
$ref_cd9c66bbd6$, 'bundle:exercise-reference-ds2-corrected:cd9c66bbd6cf', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"7b574efddf22b11b0a5ebc893bb1983244e86703bdd8fbbcdee7cca20593648c","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 16
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_0afd1c76c0$<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exercício 16 — Lista de Nomes com Array</title>
  <link rel="stylesheet" href="estilo.css">
  <script src="script.js" defer></script>
</head>
<body>
  <main>
    <section>
      <h1>Exercício 16 — Lista de Nomes com Array</h1>
      <p>Um array guarda vários valores em uma única variável.</p>
      <button id="mostrar" type="button">Mostrar nomes</button>
      <ul id="lista"></ul>
    </section>
  </main>
</body>
</html>
$ref_0afd1c76c0$, 'bundle:exercise-reference-extra:0afd1c76c01d', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"6c99c3adfa71d01f945ea34f0c4cc7820ca8e69bf4b40d46ecd7d5dab4300eed","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 16
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_bd9ed8f6e7$const nomes = ["Ana", "Bruno", "Carla"];
const campo = document.querySelector("#nome");
const botao = document.querySelector("#adicionar");
const lista = document.querySelector("#lista");
const quantidade = document.querySelector("#quantidade");

function mostrarNomes() {
    lista.innerHTML = "";

    for (const nome of nomes) {
        const item = document.createElement("li");
        item.textContent = nome;
        lista.appendChild(item);
    }

    quantidade.textContent = "Quantidade de nomes: " + nomes.length;
}

botao.addEventListener("click", () => {
    const novoNome = campo.value.trim();
    if (novoNome === "") return;

    nomes.push(novoNome);
    campo.value = "";
    mostrarNomes();
});

mostrarNomes();
$ref_bd9ed8f6e7$, 'bundle:exercise-reference-ds2-corrected:bd9ed8f6e749', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"91346c25558aba7b3d2f137c4ab05c928a4a97adb775b6b6a127870b539d9ebe","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 16
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_ac15482b96$const nomes = ['Ana', 'Bruno', 'Carla', 'Diego'];
const botao = document.querySelector('#mostrar');
const lista = document.querySelector('#lista');

botao.addEventListener('click', () => {
  lista.innerHTML = '';
  for (const nome of nomes) {
    const item = document.createElement('li');
    item.textContent = nome;
    lista.appendChild(item);
  }
});
$ref_ac15482b96$, 'bundle:exercise-reference-extra:ac15482b966a', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"ebc5c9860bd09e7d1bf2a9dce531d61e07ecf94a9f32292b8fef95a68938d4ed","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 16
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_cb0ab14d7e$* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    padding: 40px 16px;
    font-family: Arial, sans-serif;
    background-color: #f3f4f6;
    color: #1f2937;
}

.container {
    width: min(620px, 100%);
    margin: auto;
    padding: 28px;
    background-color: white;
    border-radius: 14px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.10);
}

h1 {
    margin-top: 0;
    color: #4338ca;
}

p {
    line-height: 1.5;
}

label {
    display: block;
    margin-top: 16px;
    font-weight: bold;
}

input, textarea, select, button {
    font: inherit;
}

input, textarea, select {
    width: 100%;
    margin-top: 7px;
    padding: 11px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
}

button {
    margin-top: 18px;
    padding: 10px 16px;
    border: 0;
    border-radius: 8px;
    background-color: #4338ca;
    color: white;
    cursor: pointer;
}

button:hover {
    filter: brightness(0.9);
}

.resultado {
    min-height: 28px;
    margin-top: 20px;
    padding: 14px;
    border-left: 4px solid #4338ca;
    background-color: #eef2ff;
    border-radius: 8px;
}

ul {
    padding-left: 22px;
}

@media (max-width: 520px) {
    body {
        padding: 20px 12px;
    }

    .container {
        padding: 20px;
    }
}
$ref_cb0ab14d7e$, 'bundle:exercise-reference-ds2-corrected:cb0ab14d7e9f', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"395f439146134e28b08c85170ffbf2a409197ea39e3cc2e5353d723de9bb143a","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 17
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_616cc0ad2f$:root {
  color-scheme: dark;
  --fundo: #0d1117;
  --painel: #161b22;
  --borda: #30363d;
  --texto: #e6edf3;
  --suave: #9da7b3;
  --destaque: #58a6ff;
  --sucesso: #3fb950;
  --perigo: #f85149;
}
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; font-family: Arial, Helvetica, sans-serif; background: var(--fundo); color: var(--texto); }
main { width: min(820px, 92%); margin: 0 auto; padding: 36px 0; }
section { background: var(--painel); border: 1px solid var(--borda); border-radius: 14px; padding: 22px; margin-bottom: 18px; }
h1 { margin-top: 0; }
p { color: var(--suave); line-height: 1.55; }
input, button, select { min-height: 44px; border-radius: 9px; font: inherit; }
input, select { width: 100%; padding: 9px 11px; margin: 6px 0 12px; color: var(--texto); background: #0d1117; border: 1px solid var(--borda); }
button { padding: 9px 15px; border: 0; background: var(--destaque); color: #07111f; font-weight: 800; cursor: pointer; }
button.secundario { background: #30363d; color: var(--texto); }
button.perigo { background: var(--perigo); color: white; }
ul { padding-left: 22px; }
li { margin: 8px 0; }
.linha { display: flex; gap: 9px; align-items: center; flex-wrap: wrap; }
.cartao { padding: 14px; border: 1px solid var(--borda); border-radius: 10px; margin: 10px 0; }
.mensagem { min-height: 24px; color: var(--suave); }
.destaque { border-color: var(--destaque); box-shadow: 0 0 0 2px rgba(88,166,255,.2); }
@media (max-width: 620px) { main { padding-top: 20px; } .linha > * { width: 100%; } }
$ref_616cc0ad2f$, 'bundle:exercise-reference-extra:616cc0ad2f0c', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"3b7f3ae88f8f093bf00e8f6f8c0b8929a9c625311285cbeb4b4bbd3a7e5ca3df","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 17
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_b0bd5d4ecd$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 17 — Percorrendo Arrays com forEach</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <main class="container">
        <h1>Percorrendo Arrays com forEach</h1>
        <p>Clique para mostrar os nomes com a posição de cada item.</p>
        <button id="mostrar" type="button">Mostrar nomes</button>
        <ul id="lista"></ul>
    </main>
</body>
</html>
$ref_b0bd5d4ecd$, 'bundle:exercise-reference-ds2-corrected:b0bd5d4ecddf', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"35c81a20351ed979866aafa4bd678c8e415c505468fd0f9c52e777dd8d12202a","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 17
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_bb725c8f07$<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exercício 17 — Percorrendo Arrays com forEach</title>
  <link rel="stylesheet" href="estilo.css">
  <script src="script.js" defer></script>
</head>
<body>
  <main>
    <section>
      <h1>Exercício 17 — Percorrendo Arrays com forEach</h1>
      <p>Use <code>forEach()</code> para percorrer cada elemento.</p>
      <button id="carregar" type="button">Carregar tecnologias</button>
      <ul id="tecnologias"></ul>
    </section>
  </main>
</body>
</html>
$ref_bb725c8f07$, 'bundle:exercise-reference-extra:bb725c8f07d7', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"b412d425959986444d77ca4504b378536f4e9d83d1e06e67f70d4a708d3a96fb","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 17
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_35a5a771d8$const nomes = ["Ana", "Bruno", "Carla", "Diego"];
const botao = document.querySelector("#mostrar");
const lista = document.querySelector("#lista");

botao.addEventListener("click", () => {
    lista.innerHTML = "";

    nomes.forEach((nome, indice) => {
        const item = document.createElement("li");
        item.textContent = (indice + 1) + " - " + nome;
        lista.appendChild(item);
    });
});
$ref_35a5a771d8$, 'bundle:exercise-reference-ds2-corrected:35a5a771d8fe', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"5b844976d6ebc2cf9e3d9b4e11ec0aa42678739d65fc46a297bb76956afbedee","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 17
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_eae38ca7c2$const tecnologias = ['HTML', 'CSS', 'JavaScript', 'Git'];
const lista = document.querySelector('#tecnologias');
const botao = document.querySelector('#carregar');

botao.addEventListener('click', () => {
  lista.innerHTML = '';
  tecnologias.forEach((tecnologia, indice) => {
    const item = document.createElement('li');
    item.textContent = `${indice + 1} - ${tecnologia}`;
    lista.appendChild(item);
  });
});
$ref_eae38ca7c2$, 'bundle:exercise-reference-extra:eae38ca7c266', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"cf9b78fb589e1c015e68c0cf3f144f0791675e7f811b69ca069f4be32fb0876f","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 17
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_fdeae607f9$* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    padding: 40px 16px;
    font-family: Arial, sans-serif;
    background-color: #f3f4f6;
    color: #1f2937;
}

.container {
    width: min(620px, 100%);
    margin: auto;
    padding: 28px;
    background-color: white;
    border-radius: 14px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.10);
}

h1 {
    margin-top: 0;
    color: #b45309;
}

p {
    line-height: 1.5;
}

label {
    display: block;
    margin-top: 16px;
    font-weight: bold;
}

input, textarea, select, button {
    font: inherit;
}

input, textarea, select {
    width: 100%;
    margin-top: 7px;
    padding: 11px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
}

button {
    margin-top: 18px;
    padding: 10px 16px;
    border: 0;
    border-radius: 8px;
    background-color: #b45309;
    color: white;
    cursor: pointer;
}

button:hover {
    filter: brightness(0.9);
}

.resultado {
    min-height: 28px;
    margin-top: 20px;
    padding: 14px;
    border-left: 4px solid #b45309;
    background-color: #fffbeb;
    border-radius: 8px;
}

ul {
    padding-left: 22px;
}

@media (max-width: 520px) {
    body {
        padding: 20px 12px;
    }

    .container {
        padding: 20px;
    }
}
$ref_fdeae607f9$, 'bundle:exercise-reference-ds2-corrected:fdeae607f9ac', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"b44820557e3145c27b7731a2fd7e68a2a832b90926806ab0242ac48192aa52c7","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 18
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_616cc0ad2f$:root {
  color-scheme: dark;
  --fundo: #0d1117;
  --painel: #161b22;
  --borda: #30363d;
  --texto: #e6edf3;
  --suave: #9da7b3;
  --destaque: #58a6ff;
  --sucesso: #3fb950;
  --perigo: #f85149;
}
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; font-family: Arial, Helvetica, sans-serif; background: var(--fundo); color: var(--texto); }
main { width: min(820px, 92%); margin: 0 auto; padding: 36px 0; }
section { background: var(--painel); border: 1px solid var(--borda); border-radius: 14px; padding: 22px; margin-bottom: 18px; }
h1 { margin-top: 0; }
p { color: var(--suave); line-height: 1.55; }
input, button, select { min-height: 44px; border-radius: 9px; font: inherit; }
input, select { width: 100%; padding: 9px 11px; margin: 6px 0 12px; color: var(--texto); background: #0d1117; border: 1px solid var(--borda); }
button { padding: 9px 15px; border: 0; background: var(--destaque); color: #07111f; font-weight: 800; cursor: pointer; }
button.secundario { background: #30363d; color: var(--texto); }
button.perigo { background: var(--perigo); color: white; }
ul { padding-left: 22px; }
li { margin: 8px 0; }
.linha { display: flex; gap: 9px; align-items: center; flex-wrap: wrap; }
.cartao { padding: 14px; border: 1px solid var(--borda); border-radius: 10px; margin: 10px 0; }
.mensagem { min-height: 24px; color: var(--suave); }
.destaque { border-color: var(--destaque); box-shadow: 0 0 0 2px rgba(88,166,255,.2); }
@media (max-width: 620px) { main { padding-top: 20px; } .linha > * { width: 100%; } }
$ref_616cc0ad2f$, 'bundle:exercise-reference-extra:616cc0ad2f0c', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"3b7f3ae88f8f093bf00e8f6f8c0b8929a9c625311285cbeb4b4bbd3a7e5ca3df","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 18
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_82a47facc5$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 18 — Contador de Caracteres em Tempo Real</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <main class="container">
        <h1>Contador de Caracteres em Tempo Real</h1>
        <label for="texto">Digite uma mensagem:</label>
        <textarea id="texto" rows="5" placeholder="Comece a digitar..."></textarea>
        <p id="contador" class="resultado">Caracteres digitados: 0</p>
    </main>
</body>
</html>
$ref_82a47facc5$, 'bundle:exercise-reference-ds2-corrected:82a47facc53d', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"9a8b26de94a615120e187421bd88c363912c01e8f78af0b5ef594226fb603b9a","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 18
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_9156b5d97f$<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exercício 18 — Eventos com addEventListener</title>
  <link rel="stylesheet" href="estilo.css">
  <script src="script.js" defer></script>
</head>
<body>
  <main>
    <section>
      <h1>Exercício 18 — Eventos com addEventListener</h1>
      <p id="mensagem" class="mensagem">Clique no botão para disparar um evento.</p>
      <button id="acao" type="button">Executar ação</button>
    </section>
  </main>
</body>
</html>
$ref_9156b5d97f$, 'bundle:exercise-reference-extra:9156b5d97f97', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"c5232d7054399c5e0fd9df0a2bc8734fb2bdfd0c5b914def8d8d5bf78873c7eb","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 18
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_5a8428faa0$const campo = document.querySelector("#texto");
const contador = document.querySelector("#contador");

campo.addEventListener("input", () => {
    contador.textContent =
        "Caracteres digitados: " + campo.value.length;
});
$ref_5a8428faa0$, 'bundle:exercise-reference-ds2-corrected:5a8428faa088', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"6f00e98961dac87ccd0624409e59aded21485e7ac15ccab68c1143f8048d3dd1","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 18
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_2e75ea8d47$const botao = document.querySelector('#acao');
const mensagem = document.querySelector('#mensagem');
let cliques = 0;

botao.addEventListener('click', () => {
  cliques += 1;
  mensagem.textContent = `Evento executado ${cliques} vez(es).`;
});
$ref_2e75ea8d47$, 'bundle:exercise-reference-extra:2e75ea8d4744', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"e485ef7d877c23876f267e50fc409e6877b2ee8925a0ea35e3aefed58e095eba","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 18
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_1cd4efd010$* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    padding: 40px 16px;
    font-family: Arial, sans-serif;
    background-color: #f3f4f6;
    color: #1f2937;
}

.container {
    width: min(620px, 100%);
    margin: auto;
    padding: 28px;
    background-color: white;
    border-radius: 14px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.10);
}

h1 {
    margin-top: 0;
    color: #be123c;
}

p {
    line-height: 1.5;
}

label {
    display: block;
    margin-top: 16px;
    font-weight: bold;
}

input, textarea, select, button {
    font: inherit;
}

input, textarea, select {
    width: 100%;
    margin-top: 7px;
    padding: 11px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
}

button {
    margin-top: 18px;
    padding: 10px 16px;
    border: 0;
    border-radius: 8px;
    background-color: #be123c;
    color: white;
    cursor: pointer;
}

button:hover {
    filter: brightness(0.9);
}

.resultado {
    min-height: 28px;
    margin-top: 20px;
    padding: 14px;
    border-left: 4px solid #be123c;
    background-color: #fff1f2;
    border-radius: 8px;
}

ul {
    padding-left: 22px;
}

@media (max-width: 520px) {
    body {
        padding: 20px 12px;
    }

    .container {
        padding: 20px;
    }
}
$ref_1cd4efd010$, 'bundle:exercise-reference-ds2-corrected:1cd4efd010db', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"746628b49e0ef0e1a0a57a7b8a2fe700445a9fcd66d70718afd2fc9fbbf9eb22","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 19
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_616cc0ad2f$:root {
  color-scheme: dark;
  --fundo: #0d1117;
  --painel: #161b22;
  --borda: #30363d;
  --texto: #e6edf3;
  --suave: #9da7b3;
  --destaque: #58a6ff;
  --sucesso: #3fb950;
  --perigo: #f85149;
}
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; font-family: Arial, Helvetica, sans-serif; background: var(--fundo); color: var(--texto); }
main { width: min(820px, 92%); margin: 0 auto; padding: 36px 0; }
section { background: var(--painel); border: 1px solid var(--borda); border-radius: 14px; padding: 22px; margin-bottom: 18px; }
h1 { margin-top: 0; }
p { color: var(--suave); line-height: 1.55; }
input, button, select { min-height: 44px; border-radius: 9px; font: inherit; }
input, select { width: 100%; padding: 9px 11px; margin: 6px 0 12px; color: var(--texto); background: #0d1117; border: 1px solid var(--borda); }
button { padding: 9px 15px; border: 0; background: var(--destaque); color: #07111f; font-weight: 800; cursor: pointer; }
button.secundario { background: #30363d; color: var(--texto); }
button.perigo { background: var(--perigo); color: white; }
ul { padding-left: 22px; }
li { margin: 8px 0; }
.linha { display: flex; gap: 9px; align-items: center; flex-wrap: wrap; }
.cartao { padding: 14px; border: 1px solid var(--borda); border-radius: 10px; margin: 10px 0; }
.mensagem { min-height: 24px; color: var(--suave); }
.destaque { border-color: var(--destaque); box-shadow: 0 0 0 2px rgba(88,166,255,.2); }
@media (max-width: 620px) { main { padding-top: 20px; } .linha > * { width: 100%; } }
$ref_616cc0ad2f$, 'bundle:exercise-reference-extra:616cc0ad2f0c', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"3b7f3ae88f8f093bf00e8f6f8c0b8929a9c625311285cbeb4b4bbd3a7e5ca3df","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 19
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_8312f594a3$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 19 — Mostrar e Ocultar Senha</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <main class="container">
        <h1>Mostrar e Ocultar Senha</h1>
        <label for="senha">Senha:</label>
        <input type="password" id="senha" placeholder="Digite uma senha">
        <button id="alternar" type="button">Mostrar senha</button>
    </main>
</body>
</html>
$ref_8312f594a3$, 'bundle:exercise-reference-ds2-corrected:8312f594a3e7', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"96bb4379a2b192629eadf679e62951e8055f4466b246b8d30e2321cb890247c6","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 19
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_99beda0918$<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exercício 19 — Manipulando Classes com classList</title>
  <link rel="stylesheet" href="estilo.css">
  <script src="script.js" defer></script>
</head>
<body>
  <main>
    <section>
      <h1>Exercício 19 — Manipulando Classes com classList</h1>
      <div id="cartao" class="cartao">Este cartão pode receber uma classe CSS.</div>
      <button id="alternar" type="button">Alternar destaque</button>
    </section>
  </main>
</body>
</html>
$ref_99beda0918$, 'bundle:exercise-reference-extra:99beda0918f5', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"19269d4ab1dc3efc23f491e8467148919168c85778c4eac481acffaaa24168ea","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 19
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_cb350ec31d$const campoSenha = document.querySelector("#senha");
const botao = document.querySelector("#alternar");

botao.addEventListener("click", () => {
    const estaOculta = campoSenha.type === "password";
    campoSenha.type = estaOculta ? "text" : "password";
    botao.textContent = estaOculta ? "Ocultar senha" : "Mostrar senha";
});
$ref_cb350ec31d$, 'bundle:exercise-reference-ds2-corrected:cb350ec31d6a', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"c3818c08ab56330992e315937e2f5b797433325e5572dd8b11193281a270fdf1","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 19
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_db9b23d50b$const cartao = document.querySelector('#cartao');
const botao = document.querySelector('#alternar');

botao.addEventListener('click', () => {
  cartao.classList.toggle('destaque');
  const ativo = cartao.classList.contains('destaque');
  botao.textContent = ativo ? 'Remover destaque' : 'Alternar destaque';
});
$ref_db9b23d50b$, 'bundle:exercise-reference-extra:db9b23d50bb4', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"2c4d84c514b609cb839a9411061c630754a886851daeb246d638c90296eeb05b","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 19
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_c2f6d7c7fb$* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    padding: 40px 16px;
    font-family: Arial, sans-serif;
    background-color: #f3f4f6;
    color: #1f2937;
}

.container {
    width: min(620px, 100%);
    margin: auto;
    padding: 28px;
    background-color: white;
    border-radius: 14px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.10);
}

h1 {
    margin-top: 0;
    color: #7c3aed;
}

p {
    line-height: 1.5;
}

label {
    display: block;
    margin-top: 16px;
    font-weight: bold;
}

input, textarea, select, button {
    font: inherit;
}

input, textarea, select {
    width: 100%;
    margin-top: 7px;
    padding: 11px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
}

button {
    margin-top: 18px;
    padding: 10px 16px;
    border: 0;
    border-radius: 8px;
    background-color: #7c3aed;
    color: white;
    cursor: pointer;
}

button:hover {
    filter: brightness(0.9);
}

.resultado {
    min-height: 28px;
    margin-top: 20px;
    padding: 14px;
    border-left: 4px solid #7c3aed;
    background-color: #f5f3ff;
    border-radius: 8px;
}

ul {
    padding-left: 22px;
}

@media (max-width: 520px) {
    body {
        padding: 20px 12px;
    }

    .container {
        padding: 20px;
    }
}

body.escuro {
    background-color: #111827;
    color: #f9fafb;
}

body.escuro .container {
    background-color: #1f2937;
}
$ref_c2f6d7c7fb$, 'bundle:exercise-reference-ds2-corrected:c2f6d7c7fb72', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"1ec74eea271d735ec06b6f294ed5d92c86a42bd29ce5e0a31e44516792d3f0b7","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 2
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_31fc5f2370$body {
    font-family: Arial, sans-serif;
    background-color: white;
    color: black;
    text-align: center;
    padding: 40px;
}

h1 {
    font-size: 32px;
}

p {
    font-size: 20px;
}

button {
    padding: 10px 20px;
    font-size: 18px;
    cursor: pointer;
    margin: 5px;
}
$ref_31fc5f2370$, 'bundle:exercise-reference:31fc5f237084', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"138e115e7eafc103499b806cce79e983b432c4660f29ad08580919926fccc19c","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 2
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_885fcc03ed$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 02 — Modo Claro e Modo Escuro</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <main class="container">
        <h1>Modo Claro e Modo Escuro</h1>
        <p id="mensagem">Clique no botão para alternar o tema da página.</p>
        <button id="alternarTema" type="button">Alternar tema</button>
    </main>
</body>
</html>
$ref_885fcc03ed$, 'bundle:exercise-reference-ds2-corrected:885fcc03edb5', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"b8553e6eaf5b0beee01f13ccac60dc6743f74b887e65d2edbd3983be8e617fdb","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 2
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_cd336dbed6$<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 02</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <h1>Modo Claro e Modo Escuro</h1>

    <p id="mensagem">Clique em um dos botões para alterar o tema da página.</p>

    <button onclick="modoClaro()">Modo claro</button>
    <button onclick="modoEscuro()">Modo escuro</button>

    <script src="script.js"></script>
</body>
</html>
$ref_cd336dbed6$, 'bundle:exercise-reference:cd336dbed624', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"cdb44f679853dca9d237e7cb7fa3e8d4a55f973e39a04910b2b8682b341d54ce","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 2
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_427ef6bbc2$const botao = document.querySelector("#alternarTema");
const mensagem = document.querySelector("#mensagem");

botao.addEventListener("click", () => {
    document.body.classList.toggle("escuro");

    if (document.body.classList.contains("escuro")) {
        mensagem.textContent = "Modo escuro ativado!";
    } else {
        mensagem.textContent = "Modo claro ativado!";
    }
});
$ref_427ef6bbc2$, 'bundle:exercise-reference-ds2-corrected:427ef6bbc250', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"ea4b24cd89a2682eed1f8c08ce44e4e83afccce128428d918d1ce5a6a37c3838","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 2
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_66fd93f1af$function modoClaro() {
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";

    document.getElementById("mensagem").innerText =
        "Modo claro ativado!";
}

function modoEscuro() {
    document.body.style.backgroundColor = "black";
    document.body.style.color = "white";

    document.getElementById("mensagem").innerText =
        "Modo escuro ativado!";
}
$ref_66fd93f1af$, 'bundle:exercise-reference:66fd93f1af2e', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"6cb9f5b30ffbc9f9e844092541ed58590d5c55bc00ff4434059e33dadbf6209f","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 2
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_e379a5e496$* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    padding: 40px 16px;
    font-family: Arial, sans-serif;
    background-color: #f3f4f6;
    color: #1f2937;
}

.container {
    width: min(620px, 100%);
    margin: auto;
    padding: 28px;
    background-color: white;
    border-radius: 14px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.10);
}

h1 {
    margin-top: 0;
    color: #047857;
}

p {
    line-height: 1.5;
}

label {
    display: block;
    margin-top: 16px;
    font-weight: bold;
}

input, textarea, select, button {
    font: inherit;
}

input, textarea, select {
    width: 100%;
    margin-top: 7px;
    padding: 11px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
}

button {
    margin-top: 18px;
    padding: 10px 16px;
    border: 0;
    border-radius: 8px;
    background-color: #047857;
    color: white;
    cursor: pointer;
}

button:hover {
    filter: brightness(0.9);
}

.resultado {
    min-height: 28px;
    margin-top: 20px;
    padding: 14px;
    border-left: 4px solid #047857;
    background-color: #ecfdf5;
    border-radius: 8px;
}

ul {
    padding-left: 22px;
}

@media (max-width: 520px) {
    body {
        padding: 20px 12px;
    }

    .container {
        padding: 20px;
    }
}
$ref_e379a5e496$, 'bundle:exercise-reference-ds2-corrected:e379a5e496b2', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"89d7d861e0583b6dd38d87599a70405bc8d863e026c2fa0cef2cd4163dda8c7e","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 20
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_616cc0ad2f$:root {
  color-scheme: dark;
  --fundo: #0d1117;
  --painel: #161b22;
  --borda: #30363d;
  --texto: #e6edf3;
  --suave: #9da7b3;
  --destaque: #58a6ff;
  --sucesso: #3fb950;
  --perigo: #f85149;
}
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; font-family: Arial, Helvetica, sans-serif; background: var(--fundo); color: var(--texto); }
main { width: min(820px, 92%); margin: 0 auto; padding: 36px 0; }
section { background: var(--painel); border: 1px solid var(--borda); border-radius: 14px; padding: 22px; margin-bottom: 18px; }
h1 { margin-top: 0; }
p { color: var(--suave); line-height: 1.55; }
input, button, select { min-height: 44px; border-radius: 9px; font: inherit; }
input, select { width: 100%; padding: 9px 11px; margin: 6px 0 12px; color: var(--texto); background: #0d1117; border: 1px solid var(--borda); }
button { padding: 9px 15px; border: 0; background: var(--destaque); color: #07111f; font-weight: 800; cursor: pointer; }
button.secundario { background: #30363d; color: var(--texto); }
button.perigo { background: var(--perigo); color: white; }
ul { padding-left: 22px; }
li { margin: 8px 0; }
.linha { display: flex; gap: 9px; align-items: center; flex-wrap: wrap; }
.cartao { padding: 14px; border: 1px solid var(--borda); border-radius: 10px; margin: 10px 0; }
.mensagem { min-height: 24px; color: var(--suave); }
.destaque { border-color: var(--destaque); box-shadow: 0 0 0 2px rgba(88,166,255,.2); }
@media (max-width: 620px) { main { padding-top: 20px; } .linha > * { width: 100%; } }
$ref_616cc0ad2f$, 'bundle:exercise-reference-extra:616cc0ad2f0c', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"3b7f3ae88f8f093bf00e8f6f8c0b8929a9c625311285cbeb4b4bbd3a7e5ca3df","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 20
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_efaa068b07$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 20 — Lista de Tarefas</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <main class="container">
        <h1>Lista de Tarefas</h1>
        <label for="tarefa">Nova tarefa:</label>
        <input type="text" id="tarefa" placeholder="Ex.: revisar JavaScript">
        <button id="adicionar" type="button">Adicionar tarefa</button>
        <ul id="lista"></ul>
    </main>
</body>
</html>
$ref_efaa068b07$, 'bundle:exercise-reference-ds2-corrected:efaa068b071e', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"c61c0b1dee4e73d2fbd20c2922ed3265e459d738523785deb9f1208a7faa12f1","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 20
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_56344aa689$<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exercício 20 — Lista de Tarefas</title>
  <link rel="stylesheet" href="estilo.css">
  <script src="script.js" defer></script>
</head>
<body>
  <main>
    <section>
      <h1>Exercício 20 — Lista de Tarefas</h1>
      <label for="tarefa">Nova tarefa</label>
      <div class="linha">
        <input id="tarefa" type="text" placeholder="Ex.: revisar JavaScript">
        <button id="adicionar" type="button">Adicionar</button>
      </div>
      <ul id="lista"></ul>
    </section>
  </main>
</body>
</html>
$ref_56344aa689$, 'bundle:exercise-reference-extra:56344aa6894c', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"742fb1c9127736bce8e3c891fbcec475552c8f082929b2f3ce9557e37ecf47f3","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 20
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_0c5c2d8ea7$const campo = document.querySelector("#tarefa");
const botao = document.querySelector("#adicionar");
const lista = document.querySelector("#lista");

function adicionarTarefa() {
    const texto = campo.value.trim();
    if (texto === "") return;

    const item = document.createElement("li");
    item.textContent = texto;
    lista.appendChild(item);

    campo.value = "";
    campo.focus();
}

botao.addEventListener("click", adicionarTarefa);
$ref_0c5c2d8ea7$, 'bundle:exercise-reference-ds2-corrected:0c5c2d8ea7bb', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"8a0803967da5079fccedba5e0e40ed1b900adda27197a8697ede1059c5bed37e","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 20
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_b8c9661fe2$const campo = document.querySelector('#tarefa');
const botao = document.querySelector('#adicionar');
const lista = document.querySelector('#lista');

function adicionarTarefa() {
  const texto = campo.value.trim();
  if (!texto) return;
  const item = document.createElement('li');
  item.textContent = texto;
  lista.appendChild(item);
  campo.value = '';
  campo.focus();
}

botao.addEventListener('click', adicionarTarefa);
campo.addEventListener('keydown', (evento) => {
  if (evento.key === 'Enter') adicionarTarefa();
});
$ref_b8c9661fe2$, 'bundle:exercise-reference-extra:b8c9661fe265', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"3ac4d101918b6d6283f989c42c44cf9d08a97a56bf3f261cdf8e8c67be702c70","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 20
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_616cc0ad2f$:root {
  color-scheme: dark;
  --fundo: #0d1117;
  --painel: #161b22;
  --borda: #30363d;
  --texto: #e6edf3;
  --suave: #9da7b3;
  --destaque: #58a6ff;
  --sucesso: #3fb950;
  --perigo: #f85149;
}
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; font-family: Arial, Helvetica, sans-serif; background: var(--fundo); color: var(--texto); }
main { width: min(820px, 92%); margin: 0 auto; padding: 36px 0; }
section { background: var(--painel); border: 1px solid var(--borda); border-radius: 14px; padding: 22px; margin-bottom: 18px; }
h1 { margin-top: 0; }
p { color: var(--suave); line-height: 1.55; }
input, button, select { min-height: 44px; border-radius: 9px; font: inherit; }
input, select { width: 100%; padding: 9px 11px; margin: 6px 0 12px; color: var(--texto); background: #0d1117; border: 1px solid var(--borda); }
button { padding: 9px 15px; border: 0; background: var(--destaque); color: #07111f; font-weight: 800; cursor: pointer; }
button.secundario { background: #30363d; color: var(--texto); }
button.perigo { background: var(--perigo); color: white; }
ul { padding-left: 22px; }
li { margin: 8px 0; }
.linha { display: flex; gap: 9px; align-items: center; flex-wrap: wrap; }
.cartao { padding: 14px; border: 1px solid var(--borda); border-radius: 10px; margin: 10px 0; }
.mensagem { min-height: 24px; color: var(--suave); }
.destaque { border-color: var(--destaque); box-shadow: 0 0 0 2px rgba(88,166,255,.2); }
@media (max-width: 620px) { main { padding-top: 20px; } .linha > * { width: 100%; } }
$ref_616cc0ad2f$, 'bundle:exercise-reference-extra:616cc0ad2f0c', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"3b7f3ae88f8f093bf00e8f6f8c0b8929a9c625311285cbeb4b4bbd3a7e5ca3df","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 21
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_5b539f8847$<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exercício 21 — Lista de Tarefas com Edição e Remoção</title>
  <link rel="stylesheet" href="estilo.css">
  <script src="script.js" defer></script>
</head>
<body>
  <main>
    <section>
      <h1>Exercício 21 — Lista de Tarefas com Edição e Remoção</h1>
      <label for="tarefa">Nova tarefa</label>
      <div class="linha">
        <input id="tarefa" type="text" placeholder="Digite uma tarefa">
        <button id="adicionar" type="button">Adicionar</button>
      </div>
      <ul id="lista"></ul>
    </section>
  </main>
</body>
</html>
$ref_5b539f8847$, 'bundle:exercise-reference-extra:5b539f8847ed', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"96886bd1e36d2c55f8c41fdf8f4b395ab37fab33dfe49c6921c22284047684d0","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 21
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_615378f7c8$const campo = document.querySelector('#tarefa');
const lista = document.querySelector('#lista');

document.querySelector('#adicionar').addEventListener('click', () => {
  const texto = campo.value.trim();
  if (!texto) return;
  const item = document.createElement('li');
  const span = document.createElement('span');
  span.textContent = texto;
  const editar = document.createElement('button');
  editar.textContent = 'Editar';
  editar.className = 'secundario';
  const remover = document.createElement('button');
  remover.textContent = 'Remover';
  remover.className = 'perigo';

  editar.addEventListener('click', () => {
    const novoTexto = prompt('Edite a tarefa:', span.textContent);
    if (novoTexto?.trim()) span.textContent = novoTexto.trim();
  });
  remover.addEventListener('click', () => item.remove());

  item.append(span, ' ', editar, ' ', remover);
  lista.appendChild(item);
  campo.value = '';
});
$ref_615378f7c8$, 'bundle:exercise-reference-extra:615378f7c8fb', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"09f4542cfc193107ac0ed1cb8b4bb8fa162ea8ee5a6da9e838b80e7097044aff","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 21
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_616cc0ad2f$:root {
  color-scheme: dark;
  --fundo: #0d1117;
  --painel: #161b22;
  --borda: #30363d;
  --texto: #e6edf3;
  --suave: #9da7b3;
  --destaque: #58a6ff;
  --sucesso: #3fb950;
  --perigo: #f85149;
}
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; font-family: Arial, Helvetica, sans-serif; background: var(--fundo); color: var(--texto); }
main { width: min(820px, 92%); margin: 0 auto; padding: 36px 0; }
section { background: var(--painel); border: 1px solid var(--borda); border-radius: 14px; padding: 22px; margin-bottom: 18px; }
h1 { margin-top: 0; }
p { color: var(--suave); line-height: 1.55; }
input, button, select { min-height: 44px; border-radius: 9px; font: inherit; }
input, select { width: 100%; padding: 9px 11px; margin: 6px 0 12px; color: var(--texto); background: #0d1117; border: 1px solid var(--borda); }
button { padding: 9px 15px; border: 0; background: var(--destaque); color: #07111f; font-weight: 800; cursor: pointer; }
button.secundario { background: #30363d; color: var(--texto); }
button.perigo { background: var(--perigo); color: white; }
ul { padding-left: 22px; }
li { margin: 8px 0; }
.linha { display: flex; gap: 9px; align-items: center; flex-wrap: wrap; }
.cartao { padding: 14px; border: 1px solid var(--borda); border-radius: 10px; margin: 10px 0; }
.mensagem { min-height: 24px; color: var(--suave); }
.destaque { border-color: var(--destaque); box-shadow: 0 0 0 2px rgba(88,166,255,.2); }
@media (max-width: 620px) { main { padding-top: 20px; } .linha > * { width: 100%; } }
$ref_616cc0ad2f$, 'bundle:exercise-reference-extra:616cc0ad2f0c', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"3b7f3ae88f8f093bf00e8f6f8c0b8929a9c625311285cbeb4b4bbd3a7e5ca3df","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 22
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_ce5dce7f5d$<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exercício 22 — Cadastro Simples com Objeto</title>
  <link rel="stylesheet" href="estilo.css">
  <script src="script.js" defer></script>
</head>
<body>
  <main>
    <section>
      <h1>Exercício 22 — Cadastro Simples com Objeto</h1>
      <label for="nome">Nome</label>
      <input id="nome" type="text">
      <label for="idade">Idade</label>
      <input id="idade" type="number" min="0">
      <button id="cadastrar" type="button">Cadastrar</button>
      <div id="resultado" class="cartao" hidden></div>
    </section>
  </main>
</body>
</html>
$ref_ce5dce7f5d$, 'bundle:exercise-reference-extra:ce5dce7f5dd1', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"d9c5929c0cd562b38647b1a9f6c80ca760b9a754e5f1e6e995fe49550e77f818","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 22
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_f10ff98709$const nome = document.querySelector('#nome');
const idade = document.querySelector('#idade');
const resultado = document.querySelector('#resultado');

document.querySelector('#cadastrar').addEventListener('click', () => {
  const pessoa = {
    nome: nome.value.trim(),
    idade: Number(idade.value)
  };
  if (!pessoa.nome || !pessoa.idade) return;
  resultado.hidden = false;
  resultado.textContent = `${pessoa.nome} tem ${pessoa.idade} anos.`;
});
$ref_f10ff98709$, 'bundle:exercise-reference-extra:f10ff9870955', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"2df18554dbb049bfa0fc263ede28fffbbd02ef8390f5a496d104ba4242803eb1","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 22
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_616cc0ad2f$:root {
  color-scheme: dark;
  --fundo: #0d1117;
  --painel: #161b22;
  --borda: #30363d;
  --texto: #e6edf3;
  --suave: #9da7b3;
  --destaque: #58a6ff;
  --sucesso: #3fb950;
  --perigo: #f85149;
}
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; font-family: Arial, Helvetica, sans-serif; background: var(--fundo); color: var(--texto); }
main { width: min(820px, 92%); margin: 0 auto; padding: 36px 0; }
section { background: var(--painel); border: 1px solid var(--borda); border-radius: 14px; padding: 22px; margin-bottom: 18px; }
h1 { margin-top: 0; }
p { color: var(--suave); line-height: 1.55; }
input, button, select { min-height: 44px; border-radius: 9px; font: inherit; }
input, select { width: 100%; padding: 9px 11px; margin: 6px 0 12px; color: var(--texto); background: #0d1117; border: 1px solid var(--borda); }
button { padding: 9px 15px; border: 0; background: var(--destaque); color: #07111f; font-weight: 800; cursor: pointer; }
button.secundario { background: #30363d; color: var(--texto); }
button.perigo { background: var(--perigo); color: white; }
ul { padding-left: 22px; }
li { margin: 8px 0; }
.linha { display: flex; gap: 9px; align-items: center; flex-wrap: wrap; }
.cartao { padding: 14px; border: 1px solid var(--borda); border-radius: 10px; margin: 10px 0; }
.mensagem { min-height: 24px; color: var(--suave); }
.destaque { border-color: var(--destaque); box-shadow: 0 0 0 2px rgba(88,166,255,.2); }
@media (max-width: 620px) { main { padding-top: 20px; } .linha > * { width: 100%; } }
$ref_616cc0ad2f$, 'bundle:exercise-reference-extra:616cc0ad2f0c', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"3b7f3ae88f8f093bf00e8f6f8c0b8929a9c625311285cbeb4b4bbd3a7e5ca3df","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 23
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_0c1dc71187$<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exercício 23 — Cadastro de Alunos com Array de Objetos</title>
  <link rel="stylesheet" href="estilo.css">
  <script src="script.js" defer></script>
</head>
<body>
  <main>
    <section>
      <h1>Exercício 23 — Cadastro de Alunos com Array de Objetos</h1>
      <label for="nome">Aluno</label>
      <input id="nome" type="text">
      <label for="nota">Nota</label>
      <input id="nota" type="number" min="0" max="10" step="0.1">
      <button id="adicionar" type="button">Adicionar aluno</button>
      <div id="alunos"></div>
    </section>
  </main>
</body>
</html>
$ref_0c1dc71187$, 'bundle:exercise-reference-extra:0c1dc7118750', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"a18e46ff91985539d23399857f467dd062fdeaccb877c90dee0aa6183fb321bb","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 23
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_8fb73bb506$const alunos = [];
const nome = document.querySelector('#nome');
const nota = document.querySelector('#nota');
const saida = document.querySelector('#alunos');

function renderizar() {
  saida.innerHTML = '';
  alunos.forEach((aluno) => {
    const cartao = document.createElement('div');
    cartao.className = 'cartao';
    cartao.textContent = `${aluno.nome} — nota ${aluno.nota.toFixed(1)}`;
    saida.appendChild(cartao);
  });
}

document.querySelector('#adicionar').addEventListener('click', () => {
  const aluno = { nome: nome.value.trim(), nota: Number(nota.value) };
  if (!aluno.nome || Number.isNaN(aluno.nota)) return;
  alunos.push(aluno);
  renderizar();
  nome.value = '';
  nota.value = '';
});
$ref_8fb73bb506$, 'bundle:exercise-reference-extra:8fb73bb5060f', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"0fed168ed4a6b61f3b696e5eec51397b34c6b40d1e40dd28888e989572f38802","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 23
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_616cc0ad2f$:root {
  color-scheme: dark;
  --fundo: #0d1117;
  --painel: #161b22;
  --borda: #30363d;
  --texto: #e6edf3;
  --suave: #9da7b3;
  --destaque: #58a6ff;
  --sucesso: #3fb950;
  --perigo: #f85149;
}
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; font-family: Arial, Helvetica, sans-serif; background: var(--fundo); color: var(--texto); }
main { width: min(820px, 92%); margin: 0 auto; padding: 36px 0; }
section { background: var(--painel); border: 1px solid var(--borda); border-radius: 14px; padding: 22px; margin-bottom: 18px; }
h1 { margin-top: 0; }
p { color: var(--suave); line-height: 1.55; }
input, button, select { min-height: 44px; border-radius: 9px; font: inherit; }
input, select { width: 100%; padding: 9px 11px; margin: 6px 0 12px; color: var(--texto); background: #0d1117; border: 1px solid var(--borda); }
button { padding: 9px 15px; border: 0; background: var(--destaque); color: #07111f; font-weight: 800; cursor: pointer; }
button.secundario { background: #30363d; color: var(--texto); }
button.perigo { background: var(--perigo); color: white; }
ul { padding-left: 22px; }
li { margin: 8px 0; }
.linha { display: flex; gap: 9px; align-items: center; flex-wrap: wrap; }
.cartao { padding: 14px; border: 1px solid var(--borda); border-radius: 10px; margin: 10px 0; }
.mensagem { min-height: 24px; color: var(--suave); }
.destaque { border-color: var(--destaque); box-shadow: 0 0 0 2px rgba(88,166,255,.2); }
@media (max-width: 620px) { main { padding-top: 20px; } .linha > * { width: 100%; } }
$ref_616cc0ad2f$, 'bundle:exercise-reference-extra:616cc0ad2f0c', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"3b7f3ae88f8f093bf00e8f6f8c0b8929a9c625311285cbeb4b4bbd3a7e5ca3df","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 24
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_d7c6933a8b$<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exercício 24 — Salvando Dados com localStorage</title>
  <link rel="stylesheet" href="estilo.css">
  <script src="script.js" defer></script>
</head>
<body>
  <main>
    <section>
      <h1>Exercício 24 — Salvando Dados com localStorage</h1>
      <label for="preferencia">Mensagem para salvar</label>
      <input id="preferencia" type="text">
      <div class="linha">
        <button id="salvar" type="button">Salvar</button>
        <button id="limpar" type="button" class="secundario">Limpar</button>
      </div>
      <p id="status" class="mensagem"></p>
    </section>
  </main>
</body>
</html>
$ref_d7c6933a8b$, 'bundle:exercise-reference-extra:d7c6933a8b8a', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"6a7be05a942c23142050b3fcb0ed40fd728726a174dbc0f904bd2e2e97a08bd4","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 24
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_d61855daab$const campo = document.querySelector('#preferencia');
const status = document.querySelector('#status');
const CHAVE = 'ex24_mensagem';

function carregar() {
  const valor = localStorage.getItem(CHAVE) || '';
  campo.value = valor;
  status.textContent = valor ? 'Dado recuperado do navegador.' : 'Nenhum dado salvo.';
}

document.querySelector('#salvar').addEventListener('click', () => {
  localStorage.setItem(CHAVE, campo.value);
  status.textContent = 'Dado salvo no localStorage.';
});

document.querySelector('#limpar').addEventListener('click', () => {
  localStorage.removeItem(CHAVE);
  campo.value = '';
  status.textContent = 'Dado removido.';
});

carregar();
$ref_d61855daab$, 'bundle:exercise-reference-extra:d61855daab62', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"0b991ecff284b5884e673686657d4096caea1600666a4fa904e29beb2d70821d","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 24
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_616cc0ad2f$:root {
  color-scheme: dark;
  --fundo: #0d1117;
  --painel: #161b22;
  --borda: #30363d;
  --texto: #e6edf3;
  --suave: #9da7b3;
  --destaque: #58a6ff;
  --sucesso: #3fb950;
  --perigo: #f85149;
}
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; font-family: Arial, Helvetica, sans-serif; background: var(--fundo); color: var(--texto); }
main { width: min(820px, 92%); margin: 0 auto; padding: 36px 0; }
section { background: var(--painel); border: 1px solid var(--borda); border-radius: 14px; padding: 22px; margin-bottom: 18px; }
h1 { margin-top: 0; }
p { color: var(--suave); line-height: 1.55; }
input, button, select { min-height: 44px; border-radius: 9px; font: inherit; }
input, select { width: 100%; padding: 9px 11px; margin: 6px 0 12px; color: var(--texto); background: #0d1117; border: 1px solid var(--borda); }
button { padding: 9px 15px; border: 0; background: var(--destaque); color: #07111f; font-weight: 800; cursor: pointer; }
button.secundario { background: #30363d; color: var(--texto); }
button.perigo { background: var(--perigo); color: white; }
ul { padding-left: 22px; }
li { margin: 8px 0; }
.linha { display: flex; gap: 9px; align-items: center; flex-wrap: wrap; }
.cartao { padding: 14px; border: 1px solid var(--borda); border-radius: 10px; margin: 10px 0; }
.mensagem { min-height: 24px; color: var(--suave); }
.destaque { border-color: var(--destaque); box-shadow: 0 0 0 2px rgba(88,166,255,.2); }
@media (max-width: 620px) { main { padding-top: 20px; } .linha > * { width: 100%; } }
$ref_616cc0ad2f$, 'bundle:exercise-reference-extra:616cc0ad2f0c', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"3b7f3ae88f8f093bf00e8f6f8c0b8929a9c625311285cbeb4b4bbd3a7e5ca3df","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 25
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_6ca2486144$<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exercício 25 — Consulta de CEP com ViaCEP</title>
  <link rel="stylesheet" href="estilo.css">
  <script src="script.js" defer></script>
</head>
<body>
  <main>
    <section>
      <h1>Exercício 25 — Consulta de CEP com ViaCEP</h1>
      <label for="cep">CEP</label>
      <div class="linha">
        <input id="cep" inputmode="numeric" maxlength="9" placeholder="00000-000">
        <button id="consultar" type="button">Consultar</button>
      </div>
      <div id="endereco" class="cartao">Informe um CEP.</div>
    </section>
  </main>
</body>
</html>
$ref_6ca2486144$, 'bundle:exercise-reference-extra:6ca248614495', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"0fa77bbcbb49267e3ea1e08a339d9ccd4b66d18b7955bd8ed85f714753fd24b7","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 25
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_221a879a44$const campo = document.querySelector('#cep');
const endereco = document.querySelector('#endereco');

document.querySelector('#consultar').addEventListener('click', async () => {
  const cep = campo.value.replace(/D/g, '');
  if (cep.length !== 8) {
    endereco.textContent = 'Digite um CEP com 8 números.';
    return;
  }
  endereco.textContent = 'Consultando...';
  const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const dados = await resposta.json();
  if (dados.erro) {
    endereco.textContent = 'CEP não encontrado.';
    return;
  }
  endereco.textContent = `${dados.logradouro}, ${dados.bairro} — ${dados.localidade}/${dados.uf}`;
});
$ref_221a879a44$, 'bundle:exercise-reference-extra:221a879a44e6', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"863cc9b5d83b0e99d49cb77df5e5dbd1e7ecf0f6325036d16d3b3bcf7331fde2","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 25
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_616cc0ad2f$:root {
  color-scheme: dark;
  --fundo: #0d1117;
  --painel: #161b22;
  --borda: #30363d;
  --texto: #e6edf3;
  --suave: #9da7b3;
  --destaque: #58a6ff;
  --sucesso: #3fb950;
  --perigo: #f85149;
}
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; font-family: Arial, Helvetica, sans-serif; background: var(--fundo); color: var(--texto); }
main { width: min(820px, 92%); margin: 0 auto; padding: 36px 0; }
section { background: var(--painel); border: 1px solid var(--borda); border-radius: 14px; padding: 22px; margin-bottom: 18px; }
h1 { margin-top: 0; }
p { color: var(--suave); line-height: 1.55; }
input, button, select { min-height: 44px; border-radius: 9px; font: inherit; }
input, select { width: 100%; padding: 9px 11px; margin: 6px 0 12px; color: var(--texto); background: #0d1117; border: 1px solid var(--borda); }
button { padding: 9px 15px; border: 0; background: var(--destaque); color: #07111f; font-weight: 800; cursor: pointer; }
button.secundario { background: #30363d; color: var(--texto); }
button.perigo { background: var(--perigo); color: white; }
ul { padding-left: 22px; }
li { margin: 8px 0; }
.linha { display: flex; gap: 9px; align-items: center; flex-wrap: wrap; }
.cartao { padding: 14px; border: 1px solid var(--borda); border-radius: 10px; margin: 10px 0; }
.mensagem { min-height: 24px; color: var(--suave); }
.destaque { border-color: var(--destaque); box-shadow: 0 0 0 2px rgba(88,166,255,.2); }
@media (max-width: 620px) { main { padding-top: 20px; } .linha > * { width: 100%; } }
$ref_616cc0ad2f$, 'bundle:exercise-reference-extra:616cc0ad2f0c', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"3b7f3ae88f8f093bf00e8f6f8c0b8929a9c625311285cbeb4b4bbd3a7e5ca3df","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 26
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_cc883a3b71$<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exercício 26 — ViaCEP com Tratamento de Erros</title>
  <link rel="stylesheet" href="estilo.css">
  <script src="script.js" defer></script>
</head>
<body>
  <main>
    <section>
      <h1>Exercício 26 — ViaCEP com Tratamento de Erros</h1>
      <label for="cep">CEP</label>
      <div class="linha">
        <input id="cep" inputmode="numeric" maxlength="9" placeholder="00000-000">
        <button id="consultar" type="button">Consultar</button>
      </div>
      <p id="status" class="mensagem" aria-live="polite"></p>
      <div id="endereco" class="cartao" hidden></div>
    </section>
  </main>
</body>
</html>
$ref_cc883a3b71$, 'bundle:exercise-reference-extra:cc883a3b7180', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"29745ef6134855bdca2dab4ce763f1f1d5a424b8b08d37336ec817de2c4603d2","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 26
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_f4262bda4a$const cepInput = document.querySelector('#cep');
const status = document.querySelector('#status');
const endereco = document.querySelector('#endereco');

async function consultarCep() {
  const cep = cepInput.value.replace(/D/g, '');
  endereco.hidden = true;
  if (cep.length !== 8) {
    status.textContent = 'CEP inválido: use exatamente 8 números.';
    return;
  }
  try {
    status.textContent = 'Consultando...';
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!resposta.ok) throw new Error('Falha HTTP');
    const dados = await resposta.json();
    if (dados.erro) throw new Error('CEP não encontrado');
    endereco.hidden = false;
    endereco.textContent = `${dados.logradouro || "Logradouro não informado"} — ${dados.localidade}/${dados.uf}`;
    status.textContent = 'Consulta concluída.';
  } catch (erro) {
    status.textContent = `Não foi possível consultar: ${erro.message}.`;
  }
}

document.querySelector('#consultar').addEventListener('click', consultarCep);
$ref_f4262bda4a$, 'bundle:exercise-reference-extra:f4262bda4a8e', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"6f8e329f58b97f8de027540d597227bd1338679bc79a888ace30a105a40dfca3","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 26
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_616cc0ad2f$:root {
  color-scheme: dark;
  --fundo: #0d1117;
  --painel: #161b22;
  --borda: #30363d;
  --texto: #e6edf3;
  --suave: #9da7b3;
  --destaque: #58a6ff;
  --sucesso: #3fb950;
  --perigo: #f85149;
}
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; font-family: Arial, Helvetica, sans-serif; background: var(--fundo); color: var(--texto); }
main { width: min(820px, 92%); margin: 0 auto; padding: 36px 0; }
section { background: var(--painel); border: 1px solid var(--borda); border-radius: 14px; padding: 22px; margin-bottom: 18px; }
h1 { margin-top: 0; }
p { color: var(--suave); line-height: 1.55; }
input, button, select { min-height: 44px; border-radius: 9px; font: inherit; }
input, select { width: 100%; padding: 9px 11px; margin: 6px 0 12px; color: var(--texto); background: #0d1117; border: 1px solid var(--borda); }
button { padding: 9px 15px; border: 0; background: var(--destaque); color: #07111f; font-weight: 800; cursor: pointer; }
button.secundario { background: #30363d; color: var(--texto); }
button.perigo { background: var(--perigo); color: white; }
ul { padding-left: 22px; }
li { margin: 8px 0; }
.linha { display: flex; gap: 9px; align-items: center; flex-wrap: wrap; }
.cartao { padding: 14px; border: 1px solid var(--borda); border-radius: 10px; margin: 10px 0; }
.mensagem { min-height: 24px; color: var(--suave); }
.destaque { border-color: var(--destaque); box-shadow: 0 0 0 2px rgba(88,166,255,.2); }
@media (max-width: 620px) { main { padding-top: 20px; } .linha > * { width: 100%; } }
$ref_616cc0ad2f$, 'bundle:exercise-reference-extra:616cc0ad2f0c', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"3b7f3ae88f8f093bf00e8f6f8c0b8929a9c625311285cbeb4b4bbd3a7e5ca3df","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 27
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_38207c98fe$<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exercício 27 — Arrow Functions</title>
  <link rel="stylesheet" href="estilo.css">
  <script src="script.js" defer></script>
</head>
<body>
  <main>
    <section>
      <h1>Exercício 27 — Arrow Functions</h1>
      <label for="valorA">Valor A</label>
      <input id="valorA" type="number" value="5">
      <label for="valorB">Valor B</label>
      <input id="valorB" type="number" value="3">
      <button id="calcular" type="button">Calcular</button>
      <p id="resultado" class="mensagem"></p>
    </section>
  </main>
</body>
</html>
$ref_38207c98fe$, 'bundle:exercise-reference-extra:38207c98fed5', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"0074591b33b723f06ea195c9b535a03536e9c3c82ee207ec936f1c417069c54a","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 27
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_dd1f8ebe2f$const somar = (a, b) => a + b;
const multiplicar = (a, b) => a * b;
const resultado = document.querySelector('#resultado');

document.querySelector('#calcular').addEventListener('click', () => {
  const a = Number(document.querySelector('#valorA').value);
  const b = Number(document.querySelector('#valorB').value);
  resultado.textContent = `Soma: ${somar(a, b)} | Multiplicação: ${multiplicar(a, b)}`;
});
$ref_dd1f8ebe2f$, 'bundle:exercise-reference-extra:dd1f8ebe2f67', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"a5d824481f92f113324df28c4b6a7690f56401788920df3bc5485900b5d6aef2","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 27
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_616cc0ad2f$:root {
  color-scheme: dark;
  --fundo: #0d1117;
  --painel: #161b22;
  --borda: #30363d;
  --texto: #e6edf3;
  --suave: #9da7b3;
  --destaque: #58a6ff;
  --sucesso: #3fb950;
  --perigo: #f85149;
}
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; font-family: Arial, Helvetica, sans-serif; background: var(--fundo); color: var(--texto); }
main { width: min(820px, 92%); margin: 0 auto; padding: 36px 0; }
section { background: var(--painel); border: 1px solid var(--borda); border-radius: 14px; padding: 22px; margin-bottom: 18px; }
h1 { margin-top: 0; }
p { color: var(--suave); line-height: 1.55; }
input, button, select { min-height: 44px; border-radius: 9px; font: inherit; }
input, select { width: 100%; padding: 9px 11px; margin: 6px 0 12px; color: var(--texto); background: #0d1117; border: 1px solid var(--borda); }
button { padding: 9px 15px; border: 0; background: var(--destaque); color: #07111f; font-weight: 800; cursor: pointer; }
button.secundario { background: #30363d; color: var(--texto); }
button.perigo { background: var(--perigo); color: white; }
ul { padding-left: 22px; }
li { margin: 8px 0; }
.linha { display: flex; gap: 9px; align-items: center; flex-wrap: wrap; }
.cartao { padding: 14px; border: 1px solid var(--borda); border-radius: 10px; margin: 10px 0; }
.mensagem { min-height: 24px; color: var(--suave); }
.destaque { border-color: var(--destaque); box-shadow: 0 0 0 2px rgba(88,166,255,.2); }
@media (max-width: 620px) { main { padding-top: 20px; } .linha > * { width: 100%; } }
$ref_616cc0ad2f$, 'bundle:exercise-reference-extra:616cc0ad2f0c', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"3b7f3ae88f8f093bf00e8f6f8c0b8929a9c625311285cbeb4b4bbd3a7e5ca3df","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 28
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_afce735ef8$<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exercício 28 — Transformando Dados com map()</title>
  <link rel="stylesheet" href="estilo.css">
  <script src="script.js" defer></script>
</head>
<body>
  <main>
    <section>
      <h1>Exercício 28 — Transformando Dados com map()</h1>
      <p>Transforme os preços usando <code>map()</code>.</p>
      <button id="transformar" type="button">Aplicar desconto</button>
      <ul id="precos"></ul>
    </section>
  </main>
</body>
</html>
$ref_afce735ef8$, 'bundle:exercise-reference-extra:afce735ef835', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"8fb4bbe56e760cb75594d45296056d93c21e8c6bf02f9ac96727719abe71170c","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 28
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_1860d2ada7$const precos = [100, 80, 50, 25];
const lista = document.querySelector('#precos');

function renderizar(valores) {
  lista.innerHTML = '';
  valores.forEach((valor) => {
    const item = document.createElement('li');
    item.textContent = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    lista.appendChild(item);
  });
}

document.querySelector('#transformar').addEventListener('click', () => {
  const comDesconto = precos.map((preco) => preco * 0.9);
  renderizar(comDesconto);
});

renderizar(precos);
$ref_1860d2ada7$, 'bundle:exercise-reference-extra:1860d2ada7cb', 'Histórica • exercise-reference-extra', 'bundle_snapshot', 'exercise-reference-extra', false, true, '{"bundle_source":"exercise-reference-extra","sha256":"71dd11574c8d76ee99081cf696aea6ac8f21437a99b5f98ee4e4e0e8c6de9714","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 28
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_c2151f60d9$* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    padding: 40px 16px;
    font-family: Arial, sans-serif;
    background-color: #f3f4f6;
    color: #1f2937;
}

.container {
    width: min(620px, 100%);
    margin: auto;
    padding: 28px;
    background-color: white;
    border-radius: 14px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.10);
}

h1 {
    margin-top: 0;
    color: #0f766e;
}

p {
    line-height: 1.5;
}

label {
    display: block;
    margin-top: 16px;
    font-weight: bold;
}

input, textarea, select, button {
    font: inherit;
}

input, textarea, select {
    width: 100%;
    margin-top: 7px;
    padding: 11px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
}

button {
    margin-top: 18px;
    padding: 10px 16px;
    border: 0;
    border-radius: 8px;
    background-color: #0f766e;
    color: white;
    cursor: pointer;
}

button:hover {
    filter: brightness(0.9);
}

.resultado {
    min-height: 28px;
    margin-top: 20px;
    padding: 14px;
    border-left: 4px solid #0f766e;
    background-color: #f0fdfa;
    border-radius: 8px;
}

ul {
    padding-left: 22px;
}

@media (max-width: 520px) {
    body {
        padding: 20px 12px;
    }

    .container {
        padding: 20px;
    }
}
$ref_c2151f60d9$, 'bundle:exercise-reference-ds2-corrected:c2151f60d93a', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"4105e4713c705057d9b3a14fd4df866b2bf97d82f2f6e701598f15ea25735f94","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 3
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_1049568806$body {
    font-family: Arial, sans-serif;
    background-color: #f2f2f2;
    color: black;
    text-align: center;
    padding: 40px;
}

h1 {
    font-size: 32px;
}

p {
    font-size: 20px;
}

button {
    padding: 10px 20px;
    font-size: 18px;
    margin: 5px;
    cursor: pointer;
}
$ref_1049568806$, 'bundle:exercise-reference:104956880651', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"1ccfb91fd61ab97cd9e72ca95799c43759392ce0b624097dbde0b25ceda106b2","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 3
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_577685bdc5$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 03 — Alterando Tamanho, Fonte e Estilo do Texto</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <main class="container">
        <h1>Alterando Tamanho, Fonte e Estilo do Texto</h1>
        <p id="mensagem">Use os botões para alterar este texto.</p>
        <button id="aumentar" type="button">Aumentar texto</button>
        <button id="mudarFonte" type="button">Mudar fonte</button>
        <button id="negrito" type="button">Aplicar negrito</button>
    </main>
</body>
</html>
$ref_577685bdc5$, 'bundle:exercise-reference-ds2-corrected:577685bdc553', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"2f78fddbb24505f7576ab67446e61ffbd7f6425b83b5ccdc3fd3fe939865f008","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 3
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_5238a6873e$<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 03</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <h1>Alterando Tamanho, Fonte e Estilo</h1>

    <p id="mensagem">Clique nos botões para alterar o texto.</p>

    <button onclick="aumentarTexto()">Aumentar texto</button>
    <button onclick="mudarFonte()">Mudar fonte</button>
    <button onclick="negritoTexto()">Negrito</button>

    <script src="script.js"></script>
</body>
</html>
$ref_5238a6873e$, 'bundle:exercise-reference:5238a6873ed6', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"2d725e966c3e5748b19bf8d67e96d05c0af2df6414ad55ddb0907b0d19519d89","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 3
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_1ca854d149$const mensagem = document.querySelector("#mensagem");

document.querySelector("#aumentar").addEventListener("click", () => {
    mensagem.style.fontSize = "30px";
});

document.querySelector("#mudarFonte").addEventListener("click", () => {
    mensagem.style.fontFamily = "Courier New, monospace";
});

document.querySelector("#negrito").addEventListener("click", () => {
    mensagem.style.fontWeight = "bold";
});
$ref_1ca854d149$, 'bundle:exercise-reference-ds2-corrected:1ca854d149c8', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"e7481160dedcef979eade28a9c1265f661b223693e2bd7ae4584cde1dc4848ad","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 3
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_541d2240f3$function aumentarTexto() {
    document.getElementById("mensagem")
        .style.fontSize = "30px";
}

function mudarFonte() {
    document.getElementById("mensagem")
        .style.fontFamily = "Courier New";
}

function negritoTexto() {
    document.getElementById("mensagem")
        .style.fontWeight = "bold";
}
$ref_541d2240f3$, 'bundle:exercise-reference:541d2240f347', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"72d5d184a9d6834324946f18efa1526bb68865948451d652ffb69d12faa2d4cb","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 3
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_456eb4b437$* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    padding: 40px 16px;
    font-family: Arial, sans-serif;
    background-color: #f3f4f6;
    color: #1f2937;
}

.container {
    width: min(620px, 100%);
    margin: auto;
    padding: 28px;
    background-color: white;
    border-radius: 14px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.10);
}

h1 {
    margin-top: 0;
    color: #0369a1;
}

p {
    line-height: 1.5;
}

label {
    display: block;
    margin-top: 16px;
    font-weight: bold;
}

input, textarea, select, button {
    font: inherit;
}

input, textarea, select {
    width: 100%;
    margin-top: 7px;
    padding: 11px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
}

button {
    margin-top: 18px;
    padding: 10px 16px;
    border: 0;
    border-radius: 8px;
    background-color: #0369a1;
    color: white;
    cursor: pointer;
}

button:hover {
    filter: brightness(0.9);
}

.resultado {
    min-height: 28px;
    margin-top: 20px;
    padding: 14px;
    border-left: 4px solid #0369a1;
    background-color: #f0f9ff;
    border-radius: 8px;
}

ul {
    padding-left: 22px;
}

@media (max-width: 520px) {
    body {
        padding: 20px 12px;
    }

    .container {
        padding: 20px;
    }
}
$ref_456eb4b437$, 'bundle:exercise-reference-ds2-corrected:456eb4b437e2', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"043d7d2ab352f1e596ef97076353edb52d6df8a7d304cfeab29cf05f6a7ef2da","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_cd36babbfb$body {
    font-family: Arial, sans-serif;
    background-color: #f2f2f2;
    color: black;
    text-align: center;
    padding: 40px;
}

main {
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    max-width: 500px;
    margin: auto;
}

h1 {
    font-size: 32px;
}

p {
    font-size: 20px;
}

label {
    display: block;
    margin-top: 20px;
    font-weight: bold;
}

input {
    padding: 10px;
    width: 80%;
    font-size: 16px;
    margin-top: 10px;
}

button {
    padding: 10px 20px;
    font-size: 18px;
    margin-top: 20px;
    cursor: pointer;
}
$ref_cd36babbfb$, 'bundle:exercise-reference:cd36babbfb5a', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"21f5f04f8d77523c09ed985473fe59882532d0416e743c843e144de02de9706e","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_f82d48222c$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 04 — Capturando Nome com Input</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <main class="container">
        <h1>Capturando Nome com Input</h1>
        <label for="nome">Nome do aluno:</label>
        <input type="text" id="nome" placeholder="Digite seu nome">
        <button id="mostrarNome" type="button">Mostrar saudação</button>
        <p id="mensagem" class="resultado">A saudação aparecerá aqui.</p>
    </main>
</body>
</html>
$ref_f82d48222c$, 'bundle:exercise-reference-ds2-corrected:f82d48222c60', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"cdfd4ee2e56d71395dc3f17c1f5372158509429217e6b9ee04677f5ae319e74f","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_52c3e67fe1$<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 04</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <main>
        <h1>Capturando Nome do Aluno</h1>

        <p id="mensagem">Digite seu nome no campo abaixo.</p>

        <label for="nome">Nome do aluno:</label>
        <input type="text" id="nome" placeholder="Digite seu nome">

        <button onclick="mostrarNome()">Mostrar mensagem</button>
    </main>

    <script src="script.js"></script>
</body>
</html>
$ref_52c3e67fe1$, 'bundle:exercise-reference:52c3e67fe1d7', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"a078befcf4f7bc84369225b00628b519b4b8144581c90d033b3132e0930873f9","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_38a51b3ab9$const campoNome = document.querySelector("#nome");
const botao = document.querySelector("#mostrarNome");
const mensagem = document.querySelector("#mensagem");

botao.addEventListener("click", () => {
    const nome = campoNome.value.trim();

    if (nome === "") {
        mensagem.textContent = "Digite seu nome antes de continuar.";
        return;
    }

    mensagem.textContent = "Bem-vindo, " + nome + "!";
});
$ref_38a51b3ab9$, 'bundle:exercise-reference-ds2-corrected:38a51b3ab98e', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"2c970f6482f0ba6c7583249490b611704d5ff759567d7aa78dd460594b78379b","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_80c4364de5$function mostrarNome() {
    let nome = document.getElementById("nome").value;

    document.getElementById("mensagem").innerText =
        "Bem-vindo, " + nome + "!";
}
$ref_80c4364de5$, 'bundle:exercise-reference:80c4364de5e6', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"ee2bacd38281e5e58d239caf2fdfdb6db903fce65beea973e9024f8e925ba52c","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_fdeae607f9$* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    padding: 40px 16px;
    font-family: Arial, sans-serif;
    background-color: #f3f4f6;
    color: #1f2937;
}

.container {
    width: min(620px, 100%);
    margin: auto;
    padding: 28px;
    background-color: white;
    border-radius: 14px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.10);
}

h1 {
    margin-top: 0;
    color: #b45309;
}

p {
    line-height: 1.5;
}

label {
    display: block;
    margin-top: 16px;
    font-weight: bold;
}

input, textarea, select, button {
    font: inherit;
}

input, textarea, select {
    width: 100%;
    margin-top: 7px;
    padding: 11px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
}

button {
    margin-top: 18px;
    padding: 10px 16px;
    border: 0;
    border-radius: 8px;
    background-color: #b45309;
    color: white;
    cursor: pointer;
}

button:hover {
    filter: brightness(0.9);
}

.resultado {
    min-height: 28px;
    margin-top: 20px;
    padding: 14px;
    border-left: 4px solid #b45309;
    background-color: #fffbeb;
    border-radius: 8px;
}

ul {
    padding-left: 22px;
}

@media (max-width: 520px) {
    body {
        padding: 20px 12px;
    }

    .container {
        padding: 20px;
    }
}
$ref_fdeae607f9$, 'bundle:exercise-reference-ds2-corrected:fdeae607f9ac', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"b44820557e3145c27b7731a2fd7e68a2a832b90926806ab0242ac48192aa52c7","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 5
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_e396329fe9$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 05 — Contador de Cliques</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <main class="container">
        <h1>Contador de Cliques</h1>
        <p>Total de cliques:</p>
        <p id="contador" class="resultado">0</p>
        <button id="contar" type="button">Registrar clique</button>
    </main>
</body>
</html>
$ref_e396329fe9$, 'bundle:exercise-reference-ds2-corrected:e396329fe9ab', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"f0abeed18b9f46fa79739ce2bea785b3b6a7ffba29e801320c88ac6eb4e02472","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 5
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_5e237c39bb$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contador de Cliques</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Contador de Cliques</h1>
        <p id="contador">0</p>

        <button onclick="aumentar()">Aumentar</button>
        <button onclick="diminuir()">Diminuir</button>
        <button onclick="zerar()">Zerar</button>
    </div>

    <script src="script.js"></script>
</body>
</html>
$ref_5e237c39bb$, 'bundle:exercise-reference:5e237c39bb60', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"792107ac5f34a1f28e4ee2c0e31992ec128f305ae465131f44ba1a1222ce78c9","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 5
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_3d2cdd8d27$let contador = 0;
const botao = document.querySelector("#contar");
const saida = document.querySelector("#contador");

botao.addEventListener("click", () => {
    contador++;
    saida.textContent = contador;
});
$ref_3d2cdd8d27$, 'bundle:exercise-reference-ds2-corrected:3d2cdd8d2704', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"3f3f11f4dc02f6010bec2bf1f1dd901581e8c7f0483e76a37ce37abb94e282c5","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 5
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_1b03509315$let contador = 0;

function atualizarContador() {
    document.getElementById("contador").innerText = contador;
}

function aumentar() {
    contador++;
    atualizarContador();
}

function diminuir() {
    contador--;
    atualizarContador();
}

function zerar() {
    contador = 0;
    atualizarContador();
}

atualizarContador();
$ref_1b03509315$, 'bundle:exercise-reference:1b0350931566', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"4b3a279624810740db3e06107dcc5f2e4937fb037d99571ad18feddac6c5dad3","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 5
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'style.css', 'css', $ref_d52bbd6b62$body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    text-align: center;
    padding: 40px;
}

.container {
    background: white;
    padding: 30px;
    border-radius: 12px;
    max-width: 400px;
    margin: auto;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
    color: #333;
}

#contador {
    font-size: 40px;
    font-weight: bold;
    margin: 20px 0;
}

button {
    padding: 10px 16px;
    margin: 5px;
    font-size: 16px;
    cursor: pointer;
}
$ref_d52bbd6b62$, 'bundle:exercise-reference:d52bbd6b6213', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"6731bbcc8cf0789e2eda8f4213b001a1a3388303e3752e29923726639224db5f","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 5
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_1cd4efd010$* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    padding: 40px 16px;
    font-family: Arial, sans-serif;
    background-color: #f3f4f6;
    color: #1f2937;
}

.container {
    width: min(620px, 100%);
    margin: auto;
    padding: 28px;
    background-color: white;
    border-radius: 14px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.10);
}

h1 {
    margin-top: 0;
    color: #be123c;
}

p {
    line-height: 1.5;
}

label {
    display: block;
    margin-top: 16px;
    font-weight: bold;
}

input, textarea, select, button {
    font: inherit;
}

input, textarea, select {
    width: 100%;
    margin-top: 7px;
    padding: 11px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
}

button {
    margin-top: 18px;
    padding: 10px 16px;
    border: 0;
    border-radius: 8px;
    background-color: #be123c;
    color: white;
    cursor: pointer;
}

button:hover {
    filter: brightness(0.9);
}

.resultado {
    min-height: 28px;
    margin-top: 20px;
    padding: 14px;
    border-left: 4px solid #be123c;
    background-color: #fff1f2;
    border-radius: 8px;
}

ul {
    padding-left: 22px;
}

@media (max-width: 520px) {
    body {
        padding: 20px 12px;
    }

    .container {
        padding: 20px;
    }
}
$ref_1cd4efd010$, 'bundle:exercise-reference-ds2-corrected:1cd4efd010db', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"746628b49e0ef0e1a0a57a7b8a2fe700445a9fcd66d70718afd2fc9fbbf9eb22","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 6
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_2636955792$body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    text-align: center;
    padding: 40px;
}

.container {
    background-color: white;
    max-width: 400px;
    margin: auto;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
    color: #333;
}

label {
    display: block;
    margin-top: 15px;
    font-weight: bold;
}

input {
    width: 90%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 8px;
}

.botoes {
    margin-top: 20px;
}

button {
    margin: 5px;
    padding: 10px 15px;
    border: none;
    border-radius: 8px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

#resultado {
    margin-top: 20px;
    font-size: 20px;
    font-weight: bold;
    color: #222;
}
$ref_2636955792$, 'bundle:exercise-reference:26369557928f', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"c4f74e350886479839ddbf4fa44beec95b0218d7ed7568b97a69ba352417e732","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 6
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_5e6fe35252$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 06 — Calculadora Simples</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <main class="container">
        <h1>Calculadora Simples</h1>
        <label for="num1">Primeiro número:</label>
        <input type="number" id="num1">
        <label for="num2">Segundo número:</label>
        <input type="number" id="num2">
        <button id="somar" type="button">Somar</button>
        <button id="subtrair" type="button">Subtrair</button>
        <button id="multiplicar" type="button">Multiplicar</button>
        <button id="dividir" type="button">Dividir</button>
        <p id="resultado" class="resultado">Resultado:</p>
    </main>
</body>
</html>
$ref_5e6fe35252$, 'bundle:exercise-reference-ds2-corrected:5e6fe352525a', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"c91f05bea4e75e961f4dc3aa759c51f57d69e778c55c86a82a96a1afc4986368","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 6
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_f5bcc7df96$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 06</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <div class="container">
        <h1>Calculadora Simples</h1>

        <label for="num1">Primeiro número:</label>
        <input type="number" id="num1">

        <label for="num2">Segundo número:</label>
        <input type="number" id="num2">

        <div class="botoes">
            <button onclick="somar()">Somar</button>
            <button onclick="subtrair()">Subtrair</button>
            <button onclick="multiplicar()">Multiplicar</button>
            <button onclick="dividir()">Dividir</button>
        </div>

        <p id="resultado">Resultado: </p>
    </div>
    <script src="script.js"></script>
</body>
</html>
$ref_f5bcc7df96$, 'bundle:exercise-reference:f5bcc7df9615', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"f22ef9966002b9f08a24dba095f522750184c177835b0d64276d3d504f326de7","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 6
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_29217ba52d$const n1 = document.querySelector("#num1");
const n2 = document.querySelector("#num2");
const resultado = document.querySelector("#resultado");

function valores() {
    return [Number(n1.value), Number(n2.value)];
}

document.querySelector("#somar").addEventListener("click", () => {
    const [a, b] = valores();
    resultado.textContent = "Resultado: " + (a + b);
});

document.querySelector("#subtrair").addEventListener("click", () => {
    const [a, b] = valores();
    resultado.textContent = "Resultado: " + (a - b);
});

document.querySelector("#multiplicar").addEventListener("click", () => {
    const [a, b] = valores();
    resultado.textContent = "Resultado: " + (a * b);
});

document.querySelector("#dividir").addEventListener("click", () => {
    const [a, b] = valores();
    resultado.textContent = b === 0
        ? "Não é possível dividir por zero."
        : "Resultado: " + (a / b);
});
$ref_29217ba52d$, 'bundle:exercise-reference-ds2-corrected:29217ba52d99', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"18cd24b226b873e000f6ffcab78ae1bd379c9c766952d8f8efba3dd26a9534d3","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 6
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_f19881ec62$function pegarValores() {
    let n1 = Number(document.getElementById("num1").value);
    let n2 = Number(document.getElementById("num2").value);
    return { n1, n2 };
}

function somar() {
    let valores = pegarValores();
    document.getElementById("resultado").innerText = "Resultado: " +
        (valores.n1 + valores.n2);
}

function subtrair() {
    let valores = pegarValores();
    document.getElementById("resultado").innerText = "Resultado: " +
        (valores.n1 - valores.n2);
}

function multiplicar() {
    let valores = pegarValores();
    document.getElementById("resultado").innerText = "Resultado: " +
        (valores.n1 * valores.n2);
}

function dividir() {
    let valores = pegarValores();
    if (valores.n2 === 0) {
        document.getElementById("resultado").innerText =
            "Resultado: divisão por zero não permitida";
    } else {
        document.getElementById("resultado").innerText = "Resultado: " +
            (valores.n1 / valores.n2);
    }
}
$ref_f19881ec62$, 'bundle:exercise-reference:f19881ec6231', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"640a051eb798fc1e867b6adbc8d834df6cf08f70ad19daa7aef60fe22a1ea9c6","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 6
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_4e6bae15f0$* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    padding: 40px 16px;
    font-family: Arial, sans-serif;
    background-color: #f3f4f6;
    color: #1f2937;
}

.container {
    width: min(620px, 100%);
    margin: auto;
    padding: 28px;
    background-color: white;
    border-radius: 14px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.10);
}

h1 {
    margin-top: 0;
    color: #c2410c;
}

p {
    line-height: 1.5;
}

label {
    display: block;
    margin-top: 16px;
    font-weight: bold;
}

input, textarea, select, button {
    font: inherit;
}

input, textarea, select {
    width: 100%;
    margin-top: 7px;
    padding: 11px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
}

button {
    margin-top: 18px;
    padding: 10px 16px;
    border: 0;
    border-radius: 8px;
    background-color: #c2410c;
    color: white;
    cursor: pointer;
}

button:hover {
    filter: brightness(0.9);
}

.resultado {
    min-height: 28px;
    margin-top: 20px;
    padding: 14px;
    border-left: 4px solid #c2410c;
    background-color: #fff7ed;
    border-radius: 8px;
}

ul {
    padding-left: 22px;
}

@media (max-width: 520px) {
    body {
        padding: 20px 12px;
    }

    .container {
        padding: 20px;
    }
}
$ref_4e6bae15f0$, 'bundle:exercise-reference-ds2-corrected:4e6bae15f048', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"0518e07756234fe2ec4a2cfe79c55e75afb61a45bd01a516cbf9dde71d4c337c","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 7
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_2636955792$body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    text-align: center;
    padding: 40px;
}

.container {
    background-color: white;
    max-width: 400px;
    margin: auto;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
    color: #333;
}

label {
    display: block;
    margin-top: 15px;
    font-weight: bold;
}

input {
    width: 90%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 8px;
}

.botoes {
    margin-top: 20px;
}

button {
    margin: 5px;
    padding: 10px 15px;
    border: none;
    border-radius: 8px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

#resultado {
    margin-top: 20px;
    font-size: 20px;
    font-weight: bold;
    color: #222;
}
$ref_2636955792$, 'bundle:exercise-reference:26369557928f', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"c4f74e350886479839ddbf4fa44beec95b0218d7ed7568b97a69ba352417e732","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 7
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_a75a01152c$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 07 — Conversor de Temperatura</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <main class="container">
        <h1>Conversor de Temperatura</h1>
        <label for="celsius">Temperatura em Celsius:</label>
        <input type="number" id="celsius" placeholder="Ex.: 25">
        <button id="converter" type="button">Converter para Fahrenheit</button>
        <p id="resultado" class="resultado">Resultado:</p>
    </main>
</body>
</html>
$ref_a75a01152c$, 'bundle:exercise-reference-ds2-corrected:a75a01152cb6', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"0436df92fa1f7f9248048e4fcd57c04f6bac5a401f533d0e5bdbc868a57819a7","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 7
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_88a8d15db0$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 07 — Conversor de Temperatura</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <div class="container">
        <h1>Conversor de Temperatura</h1>

        <label for="celsius">Temperatura em Celsius:</label>
        <input type="number" id="celsius" placeholder="Digite a temperatura">

        <div class="botoes">
            <button onclick="converterFahrenheit()">Converter para Fahrenheit</button>
            <button onclick="converterKelvin()">Converter para Kelvin</button>
            <button onclick="limpar()">Limpar</button>
        </div>

        <p id="resultado">Resultado: </p>
    </div>

    <script src="script.js"></script>
</body>
</html>
$ref_88a8d15db0$, 'bundle:exercise-reference:88a8d15db0bf', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"8ef584912e1e6771ad54732ff086d2d0a2a4b08472a16dcb4572eb93e63d6579","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 7
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_956196fb0e$const campoCelsius = document.querySelector("#celsius");
const botao = document.querySelector("#converter");
const resultado = document.querySelector("#resultado");

botao.addEventListener("click", () => {
    const celsius = Number(campoCelsius.value);
    const fahrenheit = (celsius * 9 / 5) + 32;
    resultado.textContent = "Resultado: " + fahrenheit + " °F";
});
$ref_956196fb0e$, 'bundle:exercise-reference-ds2-corrected:956196fb0e1c', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"0f55ddc9447e096a235cf4d5cf0cb18c1f942209a42f86fe5918df5fded83c4b","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 7
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_a1a69020d6$function converterFahrenheit() {
    let celsius = Number(document.getElementById("celsius").value);

    let fahrenheit = (celsius * 9 / 5) + 32;

    document.getElementById("resultado").innerText =
        "Resultado: " + fahrenheit + " °F";
}

function converterKelvin() {
    let celsius = Number(document.getElementById("celsius").value);

    let kelvin = celsius + 273.15;

    document.getElementById("resultado").innerText =
        "Resultado: " + kelvin + " K";
}

function limpar() {
    document.getElementById("celsius").value = "";
    document.getElementById("resultado").innerText = "Resultado: ";
}
$ref_a1a69020d6$, 'bundle:exercise-reference:a1a69020d6e9', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"1f66d3e7d77b032013c501e8ac3338013d2595609478ef932a0ace649cd9fc01","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 7
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_245691ecc9$* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    padding: 40px 16px;
    font-family: Arial, sans-serif;
    background-color: #f3f4f6;
    color: #1f2937;
}

.container {
    width: min(620px, 100%);
    margin: auto;
    padding: 28px;
    background-color: white;
    border-radius: 14px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.10);
}

h1 {
    margin-top: 0;
    color: #15803d;
}

p {
    line-height: 1.5;
}

label {
    display: block;
    margin-top: 16px;
    font-weight: bold;
}

input, textarea, select, button {
    font: inherit;
}

input, textarea, select {
    width: 100%;
    margin-top: 7px;
    padding: 11px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
}

button {
    margin-top: 18px;
    padding: 10px 16px;
    border: 0;
    border-radius: 8px;
    background-color: #15803d;
    color: white;
    cursor: pointer;
}

button:hover {
    filter: brightness(0.9);
}

.resultado {
    min-height: 28px;
    margin-top: 20px;
    padding: 14px;
    border-left: 4px solid #15803d;
    background-color: #f0fdf4;
    border-radius: 8px;
}

ul {
    padding-left: 22px;
}

@media (max-width: 520px) {
    body {
        padding: 20px 12px;
    }

    .container {
        padding: 20px;
    }
}
$ref_245691ecc9$, 'bundle:exercise-reference-ds2-corrected:245691ecc910', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"6db8a63b95afb2f3979f3ff34713cbf0509b60febba6af1ad5a6c41c613559f7","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 8
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_2636955792$body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    text-align: center;
    padding: 40px;
}

.container {
    background-color: white;
    max-width: 400px;
    margin: auto;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
    color: #333;
}

label {
    display: block;
    margin-top: 15px;
    font-weight: bold;
}

input {
    width: 90%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 8px;
}

.botoes {
    margin-top: 20px;
}

button {
    margin: 5px;
    padding: 10px 15px;
    border: none;
    border-radius: 8px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

#resultado {
    margin-top: 20px;
    font-size: 20px;
    font-weight: bold;
    color: #222;
}
$ref_2636955792$, 'bundle:exercise-reference:26369557928f', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"c4f74e350886479839ddbf4fa44beec95b0218d7ed7568b97a69ba352417e732","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 8
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_f9e16264ae$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 08 — Média e Situação do Aluno</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <main class="container">
        <h1>Média e Situação do Aluno</h1>
        <label for="nota1">Nota 1:</label>
        <input type="number" id="nota1" min="0" max="10" step="0.1">
        <label for="nota2">Nota 2:</label>
        <input type="number" id="nota2" min="0" max="10" step="0.1">
        <button id="calcular" type="button">Calcular média</button>
        <p id="resultado" class="resultado">Resultado:</p>
    </main>
</body>
</html>
$ref_f9e16264ae$, 'bundle:exercise-reference-ds2-corrected:f9e16264aeb9', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"20f336e513aed77ee01c84e64ded522cc884714e51fc5ec73aafe63dbed193cb","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 8
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_82fe6be69c$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 08</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <div class="container">
        <h1>Média do Aluno</h1>

        <label for="nota1">Nota 1:</label>
        <input type="number" id="nota1">

        <label for="nota2">Nota 2:</label>
        <input type="number" id="nota2">

        <button onclick="calcularMedia()">Calcular Média</button>

        <p id="resultado">Resultado: </p>
    </div>

    <script src="script.js"></script>
</body>
</html>
$ref_82fe6be69c$, 'bundle:exercise-reference:82fe6be69c03', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"6639084645e8994e5b7ff873bfb4fc85a48006450c4b4956f5b988a6cb62cfa7","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 8
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_2360ead20c$const nota1 = document.querySelector("#nota1");
const nota2 = document.querySelector("#nota2");
const botao = document.querySelector("#calcular");
const resultado = document.querySelector("#resultado");

botao.addEventListener("click", () => {
    const media = (Number(nota1.value) + Number(nota2.value)) / 2;
    const situacao = media >= 7 ? "Aprovado" : "Reprovado";

    resultado.textContent =
        "Média: " + media.toFixed(1) + " - Situação: " + situacao;
});
$ref_2360ead20c$, 'bundle:exercise-reference-ds2-corrected:2360ead20cbd', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"186b2c9a14783b156b0948fd4e41fe37dd6b39f8e3646dc9ec7b9349fd77c835","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 8
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_5893842c27$function calcularMedia() {
    let nota1 = Number(document.getElementById("nota1").value);
    let nota2 = Number(document.getElementById("nota2").value);

    let media = (nota1 + nota2) / 2;
    let situacao = "";

    if (media >= 7) {
        situacao = "Aprovado";
    } else if (media >= 5) {
        situacao = "Recuperação";
    } else {
        situacao = "Reprovado";
    }

    document.getElementById("resultado").innerText =
        "Média: " + media + " - Situação: " + situacao;
}
$ref_5893842c27$, 'bundle:exercise-reference:5893842c2797', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"52ffac66419413fd369426ecdb1cdb4e40f24afb948ff806a57d6800b29f3d45","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 8
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_cb0ab14d7e$* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    padding: 40px 16px;
    font-family: Arial, sans-serif;
    background-color: #f3f4f6;
    color: #1f2937;
}

.container {
    width: min(620px, 100%);
    margin: auto;
    padding: 28px;
    background-color: white;
    border-radius: 14px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.10);
}

h1 {
    margin-top: 0;
    color: #4338ca;
}

p {
    line-height: 1.5;
}

label {
    display: block;
    margin-top: 16px;
    font-weight: bold;
}

input, textarea, select, button {
    font: inherit;
}

input, textarea, select {
    width: 100%;
    margin-top: 7px;
    padding: 11px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
}

button {
    margin-top: 18px;
    padding: 10px 16px;
    border: 0;
    border-radius: 8px;
    background-color: #4338ca;
    color: white;
    cursor: pointer;
}

button:hover {
    filter: brightness(0.9);
}

.resultado {
    min-height: 28px;
    margin-top: 20px;
    padding: 14px;
    border-left: 4px solid #4338ca;
    background-color: #eef2ff;
    border-radius: 8px;
}

ul {
    padding-left: 22px;
}

@media (max-width: 520px) {
    body {
        padding: 20px 12px;
    }

    .container {
        padding: 20px;
    }
}
$ref_cb0ab14d7e$, 'bundle:exercise-reference-ds2-corrected:cb0ab14d7e9f', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"395f439146134e28b08c85170ffbf2a409197ea39e3cc2e5353d723de9bb143a","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 9
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_2636955792$body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    text-align: center;
    padding: 40px;
}

.container {
    background-color: white;
    max-width: 400px;
    margin: auto;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
    color: #333;
}

label {
    display: block;
    margin-top: 15px;
    font-weight: bold;
}

input {
    width: 90%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 8px;
}

.botoes {
    margin-top: 20px;
}

button {
    margin: 5px;
    padding: 10px 15px;
    border: none;
    border-radius: 8px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

#resultado {
    margin-top: 20px;
    font-size: 20px;
    font-weight: bold;
    color: #222;
}
$ref_2636955792$, 'bundle:exercise-reference:26369557928f', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"c4f74e350886479839ddbf4fa44beec95b0218d7ed7568b97a69ba352417e732","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 9
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_a9d90f2f88$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 09 — Validação de Campo</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <main class="container">
        <h1>Validação de Campo</h1>
        <label for="campo">Digite um texto:</label>
        <input type="text" id="campo">
        <button id="validar" type="button">Validar campo</button>
        <p id="mensagem" class="resultado">Mensagem:</p>
    </main>
</body>
</html>
$ref_a9d90f2f88$, 'bundle:exercise-reference-ds2-corrected:a9d90f2f8802', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"870671291586b96af7d5173a6285274bc363dcf4f8b9dba590c2292e8ea0c9a0","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 9
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_da9216d7d8$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício 09</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <div class="container">
        <h1>Validação de Nome</h1>

        <label for="nome">Digite seu nome:</label>
        <input type="text" id="nome">

        <button onclick="validarCampo()">Validar</button>

        <p id="mensagem">Mensagem: </p>
    </div>

    <script src="script.js"></script>
</body>
</html>
$ref_da9216d7d8$, 'bundle:exercise-reference:da9216d7d8f2', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"a6bea73584b985e9de38f4870bc31497e8d78eec6a6edb8cfb7b210b94ae6553","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 9
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_ec22e5b3f4$const campo = document.querySelector("#campo");
const botao = document.querySelector("#validar");
const mensagem = document.querySelector("#mensagem");

botao.addEventListener("click", () => {
    const valor = campo.value.trim();

    if (valor === "") {
        mensagem.textContent = "Mensagem: o campo está vazio.";
    } else {
        mensagem.textContent = "Mensagem: campo preenchido corretamente!";
    }
});
$ref_ec22e5b3f4$, 'bundle:exercise-reference-ds2-corrected:ec22e5b3f4e0', 'Histórica • exercise-reference-ds2-corrected', 'bundle_snapshot', 'exercise-reference-ds2-corrected', false, true, '{"bundle_source":"exercise-reference-ds2-corrected","sha256":"d33f7d92587a0c6d92d1aac2300ad6e492c8fecb94b760b634e881789a02a1ca","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 9
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_a5ee252463$function validarCampo() {
    let nome = document.getElementById("nome").value.trim();
    let mensagem = "";

    if (nome === "") {
        mensagem = "O campo nome está vazio.";
    } else if (nome.length < 3) {
        mensagem = "Digite pelo menos 3 caracteres.";
    } else {
        mensagem = "Campo preenchido corretamente!";
    }

    document.getElementById("mensagem").innerText =
        "Mensagem: " + mensagem;
}
$ref_a5ee252463$, 'bundle:exercise-reference:a5ee25246376', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"76d13334ef7cad61f243448eda112c5caf3639fa342f51729954fa3f673b3157","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-front-end' and e.exercise_number = 9
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'MainActivity.kt', 'kotlin', $ref_265c2e26db$package com.example.meuapp

import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val mensagem = TextView(this)
        mensagem.text = "Olá, Mobile!"
        mensagem.textSize = 24f
        setContentView(mensagem)
    }
}
$ref_265c2e26db$, 'bundle:exercise-reference-catalog-current:265c2e26dbfa', 'Histórica • exercise-reference-catalog-current', 'bundle_snapshot', 'exercise-reference-catalog-current', false, true, '{"bundle_source":"exercise-reference-catalog-current","sha256":"ae37af18b86bc5a6ab29bd99dcbb9646dec1f8f514f0f4cf948441dc31086392","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 1
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'README.md', 'markdown', $ref_1e7ade2d49$# MOB01 - Introdução ao Desenvolvimento Mobile

Nesta atividade, você compara **Web tradicional**, **Web Mobile** e **Aplicativo Mobile**.

## Conceitos principais

- tela menor não significa apenas reduzir o tamanho dos elementos;
- o toque substitui muitas interações feitas com mouse;
- o dispositivo pode oferecer câmera, GPS, sensores e notificações;
- a conexão pode mudar enquanto a pessoa se movimenta.

## Como testar

1. Abra `index.html` no navegador.
2. Reduza a largura da janela para simular um celular.
3. Clique em **Comparar experiências**.
4. Observe a reorganização dos cartões e a mensagem apresentada.

## Reflexão

Explique com suas palavras por que uma boa experiência mobile exige decisões próprias de interface.
$ref_1e7ade2d49$, 'bundle:exercise-reference:1e7ade2d498c', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"8d5c39aeaf26ba1c436c89c34d50df8e52b281dd068e5451ad9cc8a0758ccba2","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 1
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_7c3d04529e$:root {
    --fundo: #07111f;
    --painel: #10243a;
    --cartao: #173653;
    --texto: #f4f8ff;
    --suave: #b8c7da;
    --destaque: #38bdf8;
    --borda: #2b4d6c;
}

* { box-sizing: border-box; }

body {
    margin: 0;
    min-height: 100vh;
    font-family: Arial, Helvetica, sans-serif;
    background: linear-gradient(160deg, #050b14, var(--fundo));
    color: var(--texto);
}

.topo-mobile,
main,
footer {
    width: min(980px, 92%);
    margin-inline: auto;
}

.topo-mobile { padding: 42px 0 20px; }
.etiqueta { color: var(--destaque); font-weight: 800; }
h1 { font-size: clamp(2rem, 7vw, 4rem); margin: 10px 0; }
p { color: var(--suave); line-height: 1.6; }

.painel {
    padding: 24px;
    margin-bottom: 18px;
    background: var(--painel);
    border: 1px solid var(--borda);
    border-radius: 18px;
}

.grade-comparacao {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
}

article {
    padding: 18px;
    background: var(--cartao);
    border-radius: 14px;
    border: 1px solid var(--borda);
}

button {
    min-height: 48px;
    padding: 12px 18px;
    border: 0;
    border-radius: 12px;
    background: var(--destaque);
    color: #04131f;
    font: inherit;
    font-weight: 800;
    cursor: pointer;
}

.resultado {
    margin-top: 16px;
    padding: 14px;
    border-left: 4px solid var(--destaque);
    background: #07192a;
    border-radius: 8px;
}

.resultado.ativo { color: #a7f3d0; }
footer { padding: 8px 0 30px; }

@media (max-width: 720px) {
    .topo-mobile { padding-top: 26px; }
    .painel { padding: 18px; }
    .grade-comparacao { grid-template-columns: 1fr; }
    button { width: 100%; }
}
$ref_7c3d04529e$, 'bundle:exercise-reference:7c3d04529ed8', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"47fa84395fa6d2e900954050290edb0ae796f8c8a1f54e0e43c5dfe26ba8b310","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 1
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_3c5abd041a$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Introdução ao Desenvolvimento Mobile</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <header class="topo-mobile">
        <span class="etiqueta">Programação Mobile</span>
        <h1>O que muda quando pensamos em Mobile?</h1>
        <p>Compare experiências para entender por que uma tela de celular exige decisões próprias.</p>
    </header>

    <main>
        <section class="painel" aria-labelledby="titulo-comparacao">
            <h2 id="titulo-comparacao">Web, Web Mobile e Aplicativo</h2>
            <div class="grade-comparacao">
                <article>
                    <h3>Web tradicional</h3>
                    <p>É acessada pelo navegador e pode ter sido criada pensando primeiro em telas grandes.</p>
                </article>
                <article>
                    <h3>Web Mobile</h3>
                    <p>Também usa navegador, mas adapta conteúdo, navegação e interação para telas menores.</p>
                </article>
                <article>
                    <h3>Aplicativo Mobile</h3>
                    <p>Pode ser instalado e integrar recursos do aparelho, como câmera, localização e notificações.</p>
                </article>
            </div>
        </section>

        <section class="painel acao-mobile" aria-labelledby="titulo-experiencia">
            <h2 id="titulo-experiencia">Experiência Mobile</h2>
            <p>Pense no uso com uma mão, na tela menor, no toque e em conexões que podem oscilar.</p>
            <button id="compararExperiencias" type="button">Comparar experiências</button>
            <p id="resumoMobile" class="resultado" aria-live="polite">Toque no botão para resumir a ideia principal.</p>
        </section>
    </main>

    <footer>
        <p>MOB01 - Introdução ao Desenvolvimento Mobile</p>
    </footer>
</body>
</html>
$ref_3c5abd041a$, 'bundle:exercise-reference:3c5abd041a36', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"655e787253c6872d2e122618691fa5d7a4b18241eee168516f1c61be73848d8d","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 1
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'referencia.md', 'markdown', $ref_ae4baa11ab$# Referência - Primeiro app Android em Kotlin

Crie um projeto Android vazio em Kotlin, abra `MainActivity.kt`, transcreva o código e execute no emulador ou dispositivo.
$ref_ae4baa11ab$, 'bundle:exercise-reference-catalog-current:ae4baa11abbd', 'Histórica • exercise-reference-catalog-current', 'bundle_snapshot', 'exercise-reference-catalog-current', false, true, '{"bundle_source":"exercise-reference-catalog-current","sha256":"c014bdd7e636023db95b941b2c3db62c79692657dc51fd6b06dc32937f1097a0","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 1
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_9714edfb31$const botaoComparar = document.querySelector('#compararExperiencias');
const resumoMobile = document.querySelector('#resumoMobile');

botaoComparar.addEventListener('click', () => {
    resumoMobile.textContent = 'Mobile não é apenas diminuir a tela: é projetar para toque, pouco espaço, mobilidade, sensores e diferentes condições de conexão.';
    resumoMobile.classList.add('ativo');
    botaoComparar.textContent = 'Comparação concluída';
});
$ref_9714edfb31$, 'bundle:exercise-reference:9714edfb3199', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"94c4b47f2c84c26fe0b2ef247215ea8cc368080e819ed568e19a5af5d022ed50","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 1
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'MainActivity.kt', 'kotlin', $ref_b413290097$package com.example.meuapp

import android.os.Build
import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val texto = TextView(this)
        texto.text = "${Build.MANUFACTURER} - ${Build.MODEL} - Android ${Build.VERSION.RELEASE}"
        setContentView(texto)
    }
}
$ref_b413290097$, 'bundle:exercise-reference-catalog-current:b41329009734', 'Histórica • exercise-reference-catalog-current', 'bundle_snapshot', 'exercise-reference-catalog-current', false, true, '{"bundle_source":"exercise-reference-catalog-current","sha256":"ccc049b714c7f03ace494ed781c5b6eea477bc5d20eaac757d731d1a45d79a32","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 2
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'README.md', 'markdown', $ref_49cfe5cc3c$# MOB02 - Como funciona um dispositivo móvel

Um aplicativo não trabalha sozinho. Ele depende do **sistema operacional**, do **hardware**, dos **dados** e das **permissões**.

## Camadas estudadas

1. entrada do usuário ou sensor;
2. sistema operacional;
3. lógica do aplicativo;
4. dados locais ou serviços de internet;
5. resposta apresentada à pessoa.

## Permissões

Câmera, microfone e localização são exemplos de recursos que podem exigir autorização do usuário.

## Teste

Abra `index.html`, execute a simulação e explique por que o aplicativo não deveria acessar todos os recursos do aparelho sem permissão.
$ref_49cfe5cc3c$, 'bundle:exercise-reference:49cfe5cc3c1a', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"02332e71f863e016787e5b21fcbb23909ac57b1ed7a791224d1c583331573546","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 2
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_3e635bc618$:root { --fundo:#06101d; --painel:#10243a; --texto:#f6f8ff; --suave:#b8c7da; --destaque:#22d3ee; --borda:#2c506d; }
* { box-sizing: border-box; }
body { margin:0; min-height:100vh; font-family:Arial,Helvetica,sans-serif; background:linear-gradient(150deg,#040810,var(--fundo)); color:var(--texto); }
.topo, main, footer { width:min(920px,92%); margin-inline:auto; }
.topo { padding:42px 0 20px; }
.etiqueta { color:var(--destaque); font-weight:800; }
h1 { font-size:clamp(2rem,6vw,3.7rem); margin:10px 0; }
p, span { color:var(--suave); line-height:1.6; }
.painel { padding:24px; margin-bottom:18px; background:var(--painel); border:1px solid var(--borda); border-radius:18px; }
.camadas { display:grid; gap:10px; padding:0; list-style:none; counter-reset:camada; }
.camadas li { counter-increment:camada; display:grid; grid-template-columns:auto 1fr; gap:6px 12px; padding:14px; background:#173653; border-radius:12px; }
.camadas li::before { content:counter(camada); grid-row:1 / 3; width:34px; height:34px; display:grid; place-items:center; border-radius:50%; background:var(--destaque); color:#03202a; font-weight:900; }
.camadas strong, .camadas span { grid-column:2; }
button { min-height:48px; padding:12px 18px; border:0; border-radius:12px; background:var(--destaque); color:#03202a; font:inherit; font-weight:800; cursor:pointer; }
.resultado { margin-top:16px; padding:14px; border-left:4px solid var(--destaque); background:#07192a; border-radius:8px; }
.resultado.ativo { color:#a7f3d0; }
footer { padding:8px 0 30px; }
@media (max-width:620px) { .topo{padding-top:26px}.painel{padding:18px}button{width:100%}.camadas li{grid-template-columns:auto 1fr} }
$ref_3e635bc618$, 'bundle:exercise-reference:3e635bc61845', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"27f9d90c21dff25ff589ea05493bac56029e18952f85151cc84de3e1e49b676d","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 2
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_ff15da09d0$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Como funciona um dispositivo móvel</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <header class="topo">
        <span class="etiqueta">MOB02</span>
        <h1>Do toque até a resposta do aplicativo</h1>
        <p>Um dispositivo móvel combina hardware, sistema operacional, aplicativo, dados e serviços.</p>
    </header>

    <main>
        <section class="painel" aria-labelledby="titulo-camadas">
            <h2 id="titulo-camadas">Camadas de funcionamento</h2>
            <ol class="camadas">
                <li><strong>Entrada</strong><span>toque, câmera, microfone, GPS e sensores</span></li>
                <li><strong>Sistema operacional</strong><span>Android ou iOS controla recursos e permissões</span></li>
                <li><strong>Aplicativo</strong><span>processa regras e decide o que mostrar</span></li>
                <li><strong>Dados e serviços</strong><span>armazenamento local, internet, API e nuvem</span></li>
                <li><strong>Saída</strong><span>tela, som, vibração e notificações</span></li>
            </ol>
        </section>

        <section class="painel" aria-labelledby="titulo-fluxo">
            <h2 id="titulo-fluxo">Simular um fluxo</h2>
            <p>Imagine que uma pessoa toca no botão de localização de um aplicativo.</p>
            <button id="simularFluxo" type="button">Simular toque</button>
            <p id="fluxoMobile" class="resultado" aria-live="polite">A simulação ainda não foi executada.</p>
        </section>
    </main>

    <footer><p>MOB02 - Como funciona um dispositivo móvel</p></footer>
</body>
</html>
$ref_ff15da09d0$, 'bundle:exercise-reference:ff15da09d001', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"d13c37c514f6266b2b16b481c992229106a1c7761292f7e399bb5e6be2a3176a","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 2
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'referencia.md', 'markdown', $ref_d9bde45c29$# Referência - Conhecendo o dispositivo Android

Observe `Build.MANUFACTURER`, `Build.MODEL`, `Build.VERSION.RELEASE` e `Build.VERSION.SDK_INT`.
$ref_d9bde45c29$, 'bundle:exercise-reference-catalog-current:d9bde45c2922', 'Histórica • exercise-reference-catalog-current', 'bundle_snapshot', 'exercise-reference-catalog-current', false, true, '{"bundle_source":"exercise-reference-catalog-current","sha256":"934b286fb108021bd5ab975d4f569be58755670343322dddd4ecfef324009d6c","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 2
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_ba2dc565e5$const botaoFluxo = document.querySelector('#simularFluxo');
const fluxoMobile = document.querySelector('#fluxoMobile');

botaoFluxo.addEventListener('click', () => {
    fluxoMobile.textContent = 'Toque → aplicativo solicita localização → sistema verifica a permissão → GPS fornece dados → aplicativo processa → tela apresenta o resultado.';
    fluxoMobile.classList.add('ativo');
    botaoFluxo.textContent = 'Fluxo simulado';
});
$ref_ba2dc565e5$, 'bundle:exercise-reference:ba2dc565e524', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"e5311bd686300ad6a7e8dd6ec28414fd5bbf3998f714779dbce8b6bb616e37ff","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 2
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'MainActivity.kt', 'kotlin', $ref_2de44a8570$package com.example.meuapp

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val layout = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        val nome = EditText(this).apply { hint = "Digite seu nome" }
        val botao = Button(this).apply { text = "Mostrar nome" }
        val resposta = TextView(this)
        botao.setOnClickListener { resposta.text = "Olá, ${nome.text.toString().trim()}!" }
        layout.addView(nome); layout.addView(botao); layout.addView(resposta)
        setContentView(layout)
    }
}
$ref_2de44a8570$, 'bundle:exercise-reference-catalog-current:2de44a857087', 'Histórica • exercise-reference-catalog-current', 'bundle_snapshot', 'exercise-reference-catalog-current', false, true, '{"bundle_source":"exercise-reference-catalog-current","sha256":"2a416782785df2dd43bf3cabf47d1f62535498d24b27e4f6326a8a47f60a3318","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 3
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'README.md', 'markdown', $ref_11d1744ea1$# MOB03 - Tecnologias Mobile

Existem diferentes formas de entregar uma experiência mobile. A escolha depende de **requisitos**, **equipe**, **plataformas**, **prazo** e **recursos do dispositivo**.

## Nativo

Normalmente usa ferramentas e linguagens ligadas diretamente ao sistema operacional, como Kotlin/Java no Android e Swift no iOS.

## Web e PWA

Usa HTML, CSS e JavaScript. Uma PWA pode acrescentar recursos como instalação e cache, dependendo do navegador e da plataforma.

## Multiplataforma

Tecnologias como React Native e Flutter buscam compartilhar código entre Android e iOS.

## Teste

Execute os três cenários da página. Não existe uma tecnologia universalmente melhor: justifique a escolha com base no problema.
$ref_11d1744ea1$, 'bundle:exercise-reference:11d1744ea1b8', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"a1b5dbfbd08407b31f6af716dd22ed26aaee03dbb9e9cdb430207363ab0d3598","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 3
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_b90c505f6f$:root { --fundo:#07111f; --painel:#10243a; --cartao:#173653; --texto:#f5f8ff; --suave:#b8c7da; --destaque:#60a5fa; --borda:#2b4d6c; }
* { box-sizing:border-box; }
body { margin:0; min-height:100vh; font-family:Arial,Helvetica,sans-serif; background:linear-gradient(155deg,#050b14,var(--fundo)); color:var(--texto); }
.topo, main, footer { width:min(980px,92%); margin-inline:auto; }
.topo { padding:42px 0 20px; }
.etiqueta { color:var(--destaque); font-weight:800; }
h1 { font-size:clamp(2rem,6vw,3.7rem); margin:10px 0; }
p { color:var(--suave); line-height:1.6; }
.painel { padding:24px; margin-bottom:18px; background:var(--painel); border:1px solid var(--borda); border-radius:18px; }
.grade-tecnologias { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:14px; }
article { padding:18px; background:var(--cartao); border:1px solid var(--borda); border-radius:14px; }
label { display:block; margin-bottom:8px; font-weight:700; }
select { width:100%; min-height:48px; margin-bottom:12px; padding:10px 12px; border-radius:10px; border:1px solid var(--borda); background:#07192a; color:var(--texto); }
button { min-height:48px; padding:12px 18px; border:0; border-radius:12px; background:var(--destaque); color:#061525; font:inherit; font-weight:800; cursor:pointer; }
.resultado { margin-top:16px; padding:14px; background:#07192a; border-left:4px solid var(--destaque); border-radius:8px; }
.resultado.ativo { color:#bfdbfe; }
footer { padding:8px 0 30px; }
@media (max-width:720px) { .topo{padding-top:26px}.painel{padding:18px}.grade-tecnologias{grid-template-columns:1fr}button{width:100%} }
$ref_b90c505f6f$, 'bundle:exercise-reference:b90c505f6f0c', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"21630ffa519a005e40da27dab2f3bced00c274ceb08f64fddc84cfc92ccfe68c","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 3
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_e1fa064dfc$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tecnologias Mobile</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <header class="topo">
        <span class="etiqueta">MOB03</span>
        <h1>Nem todo aplicativo é construído do mesmo jeito</h1>
        <p>Conheça abordagens nativas, Web/PWA e multiplataforma antes de escolher ferramentas.</p>
    </header>

    <main>
        <section class="painel" aria-labelledby="titulo-tecnologias">
            <h2 id="titulo-tecnologias">Abordagens de desenvolvimento</h2>
            <div class="grade-tecnologias">
                <article><h3>Nativo</h3><p>Usa tecnologias específicas da plataforma, como Kotlin no Android ou Swift no iOS.</p></article>
                <article><h3>Web / PWA</h3><p>Usa tecnologias Web e pode oferecer instalação e funcionamento offline em alguns cenários.</p></article>
                <article><h3>Multiplataforma</h3><p>Compartilha grande parte do código entre plataformas usando soluções como React Native ou Flutter.</p></article>
            </div>
        </section>

        <section class="painel" aria-labelledby="titulo-escolha">
            <h2 id="titulo-escolha">Escolha depende do problema</h2>
            <label for="cenario">Selecione um cenário</label>
            <select id="cenario">
                <option value="">Escolha...</option>
                <option value="conteudo">Portal de conteúdo que precisa abrir por link</option>
                <option value="android">Aplicativo interno somente para aparelhos Android</option>
                <option value="duas-plataformas">Aplicativo para Android e iOS com equipe pequena</option>
            </select>
            <button id="analisarTecnologia" type="button">Analisar cenário</button>
            <p id="recomendacaoTecnologia" class="resultado" aria-live="polite">Selecione um cenário e analise.</p>
        </section>
    </main>

    <footer><p>MOB03 - Tecnologias Mobile</p></footer>
</body>
</html>
$ref_e1fa064dfc$, 'bundle:exercise-reference:e1fa064dfc10', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"422847585b6b64b3611c8f38e20a2a3017a1a8327570be42827cd233b6ca5e59","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 3
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'referencia.md', 'markdown', $ref_2c3df37393$# Referência - Componentes de interface

Use `TextView`, `EditText`, `Button` e `LinearLayout`.
$ref_2c3df37393$, 'bundle:exercise-reference-catalog-current:2c3df373938a', 'Histórica • exercise-reference-catalog-current', 'bundle_snapshot', 'exercise-reference-catalog-current', false, true, '{"bundle_source":"exercise-reference-catalog-current","sha256":"a5d2e88e52717d6e974686695a83097a2cc5033143cf402b163e7f03979ba450","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 3
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_62d168883b$const cenario = document.querySelector('#cenario');
const botaoAnalisar = document.querySelector('#analisarTecnologia');
const recomendacao = document.querySelector('#recomendacaoTecnologia');

const respostas = {
    conteudo: 'Web Mobile ou PWA pode ser uma boa candidata porque o acesso por link é importante.',
    android: 'Uma solução nativa Android pode fazer sentido quando a plataforma é única e há necessidade de integração profunda.',
    'duas-plataformas': 'Uma abordagem multiplataforma pode reduzir duplicação de trabalho quando Android e iOS precisam evoluir juntos.'
};

botaoAnalisar.addEventListener('click', () => {
    recomendacao.textContent = respostas[cenario.value] || 'Escolha um cenário antes de analisar.';
    recomendacao.classList.add('ativo');
});
$ref_62d168883b$, 'bundle:exercise-reference:62d168883b98', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"51a45673f2ddf7da6c59f1ba4c431cc8ddfc45ec028d0f15d704cb0cdea454e9","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 3
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'MainActivity.kt', 'kotlin', $ref_686874d75e$package com.example.meuapp

import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val texto = TextView(this)
        texto.text = getString(R.string.mensagem_principal)
        setContentView(texto)
    }
}
$ref_686874d75e$, 'bundle:exercise-reference-catalog-current:686874d75ec7', 'Histórica • exercise-reference-catalog-current', 'bundle_snapshot', 'exercise-reference-catalog-current', false, true, '{"bundle_source":"exercise-reference-catalog-current","sha256":"2cfab07114276f6b5def88dbca4e82aa2822c5d6ecf30ec0e53a0f2454e24dc2","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'README.md', 'markdown', $ref_4e1f0a04e5$# MOB04 - Ecossistema de Desenvolvimento Mobile

Desenvolver para dispositivos móveis envolve mais do que uma linguagem. Existe um **ecossistema de ferramentas**.

## Ferramentas que aparecerão na disciplina

- **VS Code:** edição de código;
- **Git e GitHub:** versionamento e entrega;
- **Navegador/PWA:** testes de experiências Web Mobile;
- **React Native e Expo:** desenvolvimento multiplataforma em uma fase posterior;
- **Android Studio:** SDK, emulador e aprofundamento Android;
- **Aparelho real:** teste de toque, câmera, localização e comportamento real.

## Fluxo de trabalho

Planejar → programar → executar → testar → corrigir → versionar → gerar uma versão de distribuição.

## Importante

Nas próximas fases, antes de React Native, estudaremos responsividade, Mobile First, zona do polegar, Flexbox, CSS Grid e JavaScript aplicado a interfaces móveis.
$ref_4e1f0a04e5$, 'bundle:exercise-reference:4e1f0a04e578', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"1c8497b4921e996e6cfa585606a35de04be6cf1a103e67ad76de461b4518eb9f","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'estilo.css', 'css', $ref_953c5e9634$:root { --fundo:#07111f; --painel:#10243a; --cartao:#173653; --texto:#f4f8ff; --suave:#b8c7da; --destaque:#34d399; --borda:#2b4d6c; }
* { box-sizing:border-box; }
body { margin:0; min-height:100vh; font-family:Arial,Helvetica,sans-serif; background:linear-gradient(155deg,#050b14,var(--fundo)); color:var(--texto); }
.topo, main, footer { width:min(980px,92%); margin-inline:auto; }
.topo { padding:42px 0 20px; }
.etiqueta { color:var(--destaque); font-weight:800; }
h1 { font-size:clamp(2rem,6vw,3.7rem); margin:10px 0; }
p { color:var(--suave); line-height:1.6; }
.painel { padding:24px; margin-bottom:18px; background:var(--painel); border:1px solid var(--borda); border-radius:18px; }
.grade-ferramentas { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; }
article { padding:18px; background:var(--cartao); border:1px solid var(--borda); border-radius:14px; }
button { min-height:48px; padding:12px 18px; border:0; border-radius:12px; background:var(--destaque); color:#03251a; font:inherit; font-weight:800; cursor:pointer; }
.fluxo { display:grid; gap:10px; margin:16px 0 0; padding-left:24px; }
.fluxo[hidden] { display:none; }
.fluxo li { padding:10px 12px; background:#0b1d2d; border-radius:10px; }
.resultado { margin-top:14px; padding:12px; border-left:4px solid var(--destaque); background:#07192a; border-radius:8px; }
.resultado.ativo { color:#a7f3d0; }
footer { padding:8px 0 30px; }
@media (max-width:680px) { .topo{padding-top:26px}.painel{padding:18px}.grade-ferramentas{grid-template-columns:1fr}button{width:100%} }
$ref_953c5e9634$, 'bundle:exercise-reference:953c5e9634f6', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"f3ab6e7173e014a86a98626360569a172e2c37e99d2820bc08db089953c7d919","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'index.html', 'html', $ref_5121ccce77$<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ecossistema de Desenvolvimento Mobile</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="script.js" defer></script>
</head>
<body>
    <header class="topo">
        <span class="etiqueta">MOB04</span>
        <h1>Ferramentas fazem parte de um fluxo</h1>
        <p>Editor, SDK, emulador, dispositivo real, versionamento e ferramentas de build trabalham juntos.</p>
    </header>

    <main>
        <section class="painel" aria-labelledby="titulo-ferramentas">
            <h2 id="titulo-ferramentas">Ecossistema</h2>
            <div class="grade-ferramentas">
                <article><h3>Editor / IDE</h3><p>VS Code ou Android Studio ajudam a escrever, organizar e depurar código.</p></article>
                <article><h3>SDK e framework</h3><p>Fornecem bibliotecas, comandos e APIs usadas para criar o aplicativo.</p></article>
                <article><h3>Teste</h3><p>Emulador, navegador ou aparelho real permitem observar comportamento e erros.</p></article>
                <article><h3>Versionamento</h3><p>Git e GitHub registram mudanças e facilitam colaboração e entrega.</p></article>
            </div>
        </section>

        <section class="painel" aria-labelledby="titulo-fluxo">
            <h2 id="titulo-fluxo">Fluxo simplificado de desenvolvimento</h2>
            <button id="mostrarFluxoDesenvolvimento" type="button">Mostrar fluxo</button>
            <ol id="fluxoDesenvolvimento" class="fluxo" hidden>
                <li>Planejar a experiência e os requisitos.</li>
                <li>Escrever e organizar o código.</li>
                <li>Executar em ambiente de teste.</li>
                <li>Corrigir, versionar e repetir os testes.</li>
                <li>Gerar uma versão para distribuição.</li>
            </ol>
            <p id="statusFluxo" class="resultado" aria-live="polite">Fluxo recolhido.</p>
        </section>
    </main>

    <footer><p>MOB04 - Ecossistema de Desenvolvimento Mobile</p></footer>
</body>
</html>
$ref_5121ccce77$, 'bundle:exercise-reference:5121ccce77b0', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"265c8b5894f9b505361ef6711db4a6b6a1349d36df20b518432d38201ea98c47","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'referencia.md', 'markdown', $ref_d86af56044$# Referência - Recursos e estrutura Android

Armazene textos em `res/values/strings.xml` e acesse-os com `R.string`.
$ref_d86af56044$, 'bundle:exercise-reference-catalog-current:d86af560443a', 'Histórica • exercise-reference-catalog-current', 'bundle_snapshot', 'exercise-reference-catalog-current', false, true, '{"bundle_source":"exercise-reference-catalog-current","sha256":"ef5f063c5d8630c91f678bee7b40011caeeeb391e206db846c7a52455b2628bb","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'script.js', 'javascript', $ref_dc0533a51c$const botaoFluxo = document.querySelector('#mostrarFluxoDesenvolvimento');
const fluxoDesenvolvimento = document.querySelector('#fluxoDesenvolvimento');
const statusFluxo = document.querySelector('#statusFluxo');

botaoFluxo.addEventListener('click', () => {
    const vaiMostrar = fluxoDesenvolvimento.hidden;
    fluxoDesenvolvimento.hidden = !vaiMostrar;
    botaoFluxo.textContent = vaiMostrar ? 'Ocultar fluxo' : 'Mostrar fluxo';
    statusFluxo.textContent = vaiMostrar ? 'Fluxo exibido: planejar, programar, testar, versionar e distribuir.' : 'Fluxo recolhido.';
    statusFluxo.classList.toggle('ativo', vaiMostrar);
});
$ref_dc0533a51c$, 'bundle:exercise-reference:dc0533a51c64', 'Histórica • exercise-reference', 'bundle_snapshot', 'exercise-reference', false, true, '{"bundle_source":"exercise-reference","sha256":"902ff4d7bdd8b65c480ab16cd0edf3ac7088057781340862feecf0d7a1358468","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'strings.xml', 'xml', $ref_59339fe248$<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Meu App</string>
    <string name="mensagem_principal">Recursos Android funcionando!</string>
</resources>
$ref_59339fe248$, 'bundle:exercise-reference-catalog-current:59339fe248f0', 'Histórica • exercise-reference-catalog-current', 'bundle_snapshot', 'exercise-reference-catalog-current', false, true, '{"bundle_source":"exercise-reference-catalog-current","sha256":"7cd0a5e517fc5592d5d26f7c495b91267817121410353237517b48a60cdec41b","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 4
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'MainActivity.kt', 'kotlin', $ref_5c50b54df5$package com.example.meuapp

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val layout = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        val valor = EditText(this).apply { hint = "Digite uma tarefa" }
        val botao = Button(this).apply { text = "Adicionar" }
        val resposta = TextView(this).apply { text = "Nenhuma tarefa adicionada." }
        botao.setOnClickListener { val tarefa = valor.text.toString().trim(); resposta.text = if (tarefa.isEmpty()) "Digite uma tarefa antes de adicionar." else "Tarefa adicionada: $tarefa" }
        layout.addView(valor); layout.addView(botao); layout.addView(resposta)
        setContentView(layout)
    }
}
$ref_5c50b54df5$, 'bundle:exercise-reference-catalog-current:5c50b54df598', 'Histórica • exercise-reference-catalog-current', 'bundle_snapshot', 'exercise-reference-catalog-current', false, true, '{"bundle_source":"exercise-reference-catalog-current","sha256":"8d1df27bff7fa1c8fd503178591c049d8e80c1f3d7c3fed57c4687cc8bbe48f7","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 5
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'MainActivity.kt', 'kotlin', $ref_e0ecf3c8bf$package com.example.meuapp

import android.os.Bundle
import android.view.Gravity
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(32, 32, 32, 32)
        }

        val mensagem = TextView(this).apply {
            text = "Meu primeiro app interativo"
            textSize = 22f
        }

        val botao = Button(this).apply {
            text = "Toque aqui"
        }

        botao.setOnClickListener {
            mensagem.text = "Botão tocado com sucesso!"
        }

        layout.addView(mensagem)
        layout.addView(botao)
        setContentView(layout)
    }
}
$ref_e0ecf3c8bf$, 'bundle:exercise-reference-synced:e0ecf3c8bfd9', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"b4168d17bc7261f4ae81e3ce10dbd0af29466c61d6812a5bcab2bfad6423aef7","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 5
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'referencia.md', 'markdown', $ref_8eb18027ad$# Referência - Primeiro app interativo

Digite uma tarefa, trate campo vazio e atualize a resposta ao tocar no botão.
$ref_8eb18027ad$, 'bundle:exercise-reference-catalog-current:8eb18027ad9f', 'Histórica • exercise-reference-catalog-current', 'bundle_snapshot', 'exercise-reference-catalog-current', false, true, '{"bundle_source":"exercise-reference-catalog-current","sha256":"f7458f9400550adee40bb14f6e969a344a141e492026e27a1a1ff177b5ba8e5f","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 5
on conflict (exercise_id, filename, content_hash) do nothing;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref, is_current, active, metadata)
select e.id, 'referencia.md', 'markdown', $ref_762faaa1ed$# Referência — Primeira interface Android

## Passos para transcrição
1. Crie ou abra um projeto Android vazio em Kotlin.
2. Abra o arquivo `MainActivity.kt`.
3. Transcreva o código exibido na referência.
4. Execute o aplicativo no emulador ou dispositivo.
5. Toque no botão e observe a mudança da mensagem.
6. Confira se texto, botão e interação funcionam antes de salvar a atividade.
$ref_762faaa1ed$, 'bundle:exercise-reference-synced:762faaa1eda4', 'Histórica • exercise-reference-synced', 'bundle_snapshot', 'exercise-reference-synced', false, true, '{"bundle_source":"exercise-reference-synced","sha256":"22048b5c033a786d9348f3be740d867783c34a632f190db1fcec797a99e6a6f4","imported_from_release":"v14.10.8"}'::jsonb
from public.exercises e
join public.subjects s on s.id = e.subject_id
where s.slug = 'programacao-mobile-sub' and e.exercise_number = 5
on conflict (exercise_id, filename, content_hash) do nothing;


-- A referência que está no Supabase no instante da migration é registrada como a variante atual.
-- Se o mesmo conteúdo já veio de um bundle, ele é promovido a atual em vez de duplicado.
update public.exercise_reference_file_versions v
set is_current = false,
    effective_to = coalesce(v.effective_to, now()),
    updated_at = now()
where v.is_current = true;

insert into public.exercise_reference_file_versions
  (exercise_id, filename, language, content, version_key, label, source_kind, source_ref,
   effective_from, effective_to, is_current, active, metadata)
select rf.exercise_id,
       rf.filename,
       coalesce(nullif(rf.language,''),'text'),
       rf.content,
       'supabase-current:' || substr(md5(replace(rf.content, E'\r\n', E'\n')),1,12),
       'Atual • sincronizada',
       'supabase_snapshot',
       'exercise_reference_files',
       rf.updated_at,
       null,
       true,
       true,
       jsonb_build_object('captured_from','exercise_reference_files','captured_at',now())
from public.exercise_reference_files rf
where length(trim(rf.content)) > 0
on conflict (exercise_id, filename, content_hash) do update
set language = excluded.language,
    is_current = true,
    active = true,
    effective_to = null,
    effective_from = coalesce(excluded.effective_from, public.exercise_reference_file_versions.effective_from),
    label = 'Atual • sincronizada',
    source_kind = 'supabase_snapshot',
    source_ref = 'exercise_reference_files',
    updated_at = now();

create or replace function private.sync_exercise_reference_file_version()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_now timestamptz := now();
begin
  if tg_op = 'DELETE' then
    update public.exercise_reference_file_versions
       set is_current = false,
           effective_to = coalesce(effective_to, v_now),
           updated_at = v_now
     where exercise_id = old.exercise_id
       and lower(filename) = lower(old.filename)
       and is_current = true;
    return old;
  end if;

  if tg_op = 'UPDATE' and (
       new.exercise_id is distinct from old.exercise_id
    or lower(new.filename) is distinct from lower(old.filename)
    or new.content is distinct from old.content
    or new.language is distinct from old.language
  ) then
    update public.exercise_reference_file_versions
       set is_current = false,
           effective_to = coalesce(effective_to, v_now),
           updated_at = v_now
     where exercise_id = old.exercise_id
       and lower(filename) = lower(old.filename)
       and is_current = true;
  elsif tg_op = 'UPDATE' then
    return new;
  end if;

  update public.exercise_reference_file_versions
     set is_current = false,
         effective_to = coalesce(effective_to, v_now),
         updated_at = v_now
   where exercise_id = new.exercise_id
     and lower(filename) = lower(new.filename)
     and is_current = true;

  insert into public.exercise_reference_file_versions
    (exercise_id, filename, language, content, version_key, label, source_kind, source_ref,
     effective_from, effective_to, is_current, active, metadata)
  values (
    new.exercise_id,
    new.filename,
    coalesce(nullif(new.language,''),'text'),
    new.content,
    'supabase:' || to_char(v_now at time zone 'utc','YYYYMMDDHH24MISSMS') || ':' || substr(md5(replace(new.content, E'\r\n', E'\n')),1,12),
    'Atual • sincronizada',
    'supabase_snapshot',
    'exercise_reference_files',
    coalesce(new.updated_at, v_now),
    null,
    true,
    true,
    jsonb_build_object('captured_from','exercise_reference_files','captured_at',v_now)
  )
  on conflict (exercise_id, filename, content_hash) do update
    set language = excluded.language,
        is_current = true,
        active = true,
        effective_to = null,
        label = 'Atual • sincronizada',
        source_kind = 'supabase_snapshot',
        source_ref = 'exercise_reference_files',
        updated_at = v_now;

  return new;
end;
$$;

revoke all on function private.sync_exercise_reference_file_version() from public;

drop trigger if exists trg_sync_exercise_reference_file_version on public.exercise_reference_files;
create trigger trg_sync_exercise_reference_file_version
after insert or update or delete on public.exercise_reference_files
for each row execute function private.sync_exercise_reference_file_version();

comment on table public.exercise_reference_file_versions is
'Histórico imutável/compatível das referências oficiais por arquivo. exercise_reference_files permanece sendo a referência atual.';
comment on column public.exercise_reference_file_versions.is_current is
'Indica a variante atualmente publicada para este nome de arquivo; variantes antigas permanecem ativas para compatibilidade de correção.';
