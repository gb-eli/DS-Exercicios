-- Etapa 5 / v14.8.10 — referências oficiais não podem ser desligadas por snapshot administrativo antigo.
create or replace function private.enforce_reference_file_release_bases()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if exists (
    select 1 from public.exercise_reference_files rf
    where rf.exercise_id = new.exercise_id
      and lower(rf.filename) in ('index.html','index.htm')
  ) then
    new.allow_html_base := true;
  end if;

  if exists (
    select 1 from public.exercise_reference_files rf
    where rf.exercise_id = new.exercise_id
      and lower(rf.filename) in ('estilo.css','style.css','styles.css')
  ) then
    new.allow_css_base := true;
  end if;

  if exists (
    select 1 from public.exercise_reference_files rf
    where rf.exercise_id = new.exercise_id
      and lower(rf.filename) in ('script.js','main.js','app.js')
  ) then
    new.allow_js_base := true;
  end if;

  return new;
end;
$$;

revoke all on function private.enforce_reference_file_release_bases() from public;

drop trigger if exists trg_enforce_reference_file_release_bases on public.exercise_releases;
create trigger trg_enforce_reference_file_release_bases
before insert or update on public.exercise_releases
for each row execute function private.enforce_reference_file_release_bases();

update public.exercise_releases er
set allow_html_base = case
      when exists (
        select 1 from public.exercise_reference_files rf
        where rf.exercise_id = er.exercise_id
          and lower(rf.filename) in ('index.html','index.htm')
      ) then true else er.allow_html_base end,
    allow_css_base = case
      when exists (
        select 1 from public.exercise_reference_files rf
        where rf.exercise_id = er.exercise_id
          and lower(rf.filename) in ('estilo.css','style.css','styles.css')
      ) then true else er.allow_css_base end,
    allow_js_base = case
      when exists (
        select 1 from public.exercise_reference_files rf
        where rf.exercise_id = er.exercise_id
          and lower(rf.filename) in ('script.js','main.js','app.js')
      ) then true else er.allow_js_base end,
    updated_at = now()
where exists (
  select 1 from public.exercise_reference_files rf
  where rf.exercise_id = er.exercise_id
    and lower(rf.filename) in ('index.html','index.htm','estilo.css','style.css','styles.css','script.js','main.js','app.js')
);
