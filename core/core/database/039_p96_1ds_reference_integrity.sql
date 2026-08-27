-- P9.6 / backend patch sobre v14.9.3
-- 1DS: corrige referências Python 06/07 e protege arquivos canônicos das duas disciplinas.

with vals(exercise_number,content) as (values
(6,$ex6$# Exercício 06 — Repetição com for em Python
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
$ex6$),
(7,$ex7$# Exercício 07 — Contadores e acumuladores em Python
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
$ex7$)),
target as (
  select e.id,e.exercise_number
  from public.exercises e
  join public.subjects s on s.id=e.subject_id
  where s.slug='introducao-programacao'
    and e.exercise_number in (6,7)
    and e.active=true and e.visible=true
)
update public.exercise_reference_files rf
set content=v.content,language='python',updated_at=now()
from target t join vals v on v.exercise_number=t.exercise_number
where rf.exercise_id=t.id and lower(rf.filename)='main.py';

create or replace function public.guard_1ds_reference_structure()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_exercise_id uuid := case when tg_op='DELETE' then old.exercise_id else new.exercise_id end;
  v_filename text := lower(case when tg_op='DELETE' then old.filename else new.filename end);
  v_language text := lower(coalesce(case when tg_op='DELETE' then old.language else new.language end,''));
  v_subject_slug text;
  v_number integer;
  v_active boolean;
  v_visible boolean;
begin
  select s.slug,e.exercise_number,e.active,e.visible
    into v_subject_slug,v_number,v_active,v_visible
  from public.exercises e
  join public.subjects s on s.id=e.subject_id
  where e.id=v_exercise_id;

  if v_active is true and v_visible is true then
    if v_subject_slug='introducao-programacao' and v_number between 1 and 8 then
      if tg_op='DELETE' then
        raise exception 'A referência main.py do 1DS não pode ser removida enquanto a atividade estiver ativa e visível';
      end if;
      if v_filename <> 'main.py' then
        raise exception '1DS Introdução à Programação aceita somente main.py como referência canônica';
      end if;
      if v_language not in ('python','py') then
        raise exception 'main.py do 1DS deve usar linguagem python';
      end if;
      if length(trim(coalesce(new.content,''))) < 20 or strpos(new.content,E'\n')=0 then
        raise exception 'main.py do 1DS deve conter código Python multilinha não vazio';
      end if;
    elsif v_subject_slug='analise-metodo-sistemas' and v_number between 1 and 5 then
      if tg_op='DELETE' then
        raise exception 'A referência referencia.md do 1DS não pode ser removida enquanto a atividade estiver ativa e visível';
      end if;
      if v_filename <> 'referencia.md' then
        raise exception '1DS Análise e Método aceita somente referencia.md como referência canônica';
      end if;
      if v_language not in ('markdown','md') then
        raise exception 'referencia.md do 1DS deve usar linguagem markdown';
      end if;
      if length(trim(coalesce(new.content,''))) < 20 or strpos(new.content,E'\n')=0 then
        raise exception 'referencia.md do 1DS deve conter orientação multilinha não vazia';
      end if;
    end if;
  end if;

  return case when tg_op='DELETE' then old else new end;
end;
$$;

drop trigger if exists trg_guard_1ds_reference_structure on public.exercise_reference_files;
create trigger trg_guard_1ds_reference_structure
before insert or update of exercise_id,filename,language,content or delete
on public.exercise_reference_files
for each row execute function public.guard_1ds_reference_structure();

create or replace function public.guard_1ds_student_file_structure()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_subject_slug text;
  v_number integer;
  v_active boolean;
  v_visible boolean;
begin
  select s.slug,e.exercise_number,e.active,e.visible
    into v_subject_slug,v_number,v_active,v_visible
  from public.exercises e
  join public.subjects s on s.id=e.subject_id
  where e.id=new.exercise_id;

  if v_active is true and v_visible is true then
    if v_subject_slug='introducao-programacao' and v_number between 1 and 8 and lower(new.filename) <> 'main.py' then
      raise exception 'O workspace do 1DS Introdução à Programação aceita somente main.py';
    elsif v_subject_slug='analise-metodo-sistemas' and v_number between 1 and 5 and lower(new.filename) <> 'atividade.md' then
      raise exception 'O workspace do 1DS Análise e Método aceita somente atividade.md';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_guard_1ds_student_file_structure on public.student_files;
create trigger trg_guard_1ds_student_file_structure
before insert or update of exercise_id,filename
on public.student_files
for each row execute function public.guard_1ds_student_file_structure();
