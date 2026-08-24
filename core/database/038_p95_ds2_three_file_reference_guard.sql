-- P9.5 / v14.9.3
-- DS2 Front-End: referências 01-20 devem permanecer em três arquivos separados.
create or replace function public.guard_ds2_frontend_reference_structure()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_exercise_id uuid := case when tg_op='DELETE' then old.exercise_id else new.exercise_id end;
  v_filename text := lower(case when tg_op='DELETE' then old.filename else new.filename end);
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

  if v_subject_slug='programacao-front-end'
     and v_active is true
     and v_visible is true
     and v_number between 1 and 20 then

    if tg_op='DELETE' then
      raise exception 'As referências canônicas do DS2 Front-End não podem ser removidas enquanto a atividade estiver ativa e visível';
    end if;

    if v_filename not in ('index.html','estilo.css','script.js') then
      raise exception 'DS2 Front-End aceita somente index.html, estilo.css e script.js como referências canônicas';
    end if;

    if v_filename='index.html' then
      if new.content ~* '<style([[:space:]>])' then
        raise exception 'CSS embutido em <style> não é permitido no index.html do DS2 Front-End';
      end if;
      if new.content ~* '[[:space:]]style[[:space:]]*=' then
        raise exception 'CSS inline style= não é permitido no index.html do DS2 Front-End';
      end if;
      if new.content ~* '[[:space:]]on(click|input|change|submit|keyup|keydown)[[:space:]]*=' then
        raise exception 'JavaScript inline on*= não é permitido no index.html do DS2 Front-End';
      end if;
      if new.content !~* '<link[^>]+href[[:space:]]*=[[:space:]]*["''][^"'']*estilo[.]css[^"'']*["'']' then
        raise exception 'index.html do DS2 Front-End deve conectar estilo.css';
      end if;
      if new.content !~* '<script[^>]+src[[:space:]]*=[[:space:]]*["''][^"'']*script[.]js[^"'']*["'']' then
        raise exception 'index.html do DS2 Front-End deve conectar script.js';
      end if;
    end if;
  end if;

  return case when tg_op='DELETE' then old else new end;
end;
$$;

drop trigger if exists trg_guard_ds2_frontend_reference_structure on public.exercise_reference_files;
create trigger trg_guard_ds2_frontend_reference_structure
before insert or update of exercise_id,filename,content or delete
on public.exercise_reference_files
for each row
execute function public.guard_ds2_frontend_reference_structure();
