-- Migration já aplicada em produção em 18/08/2026.
-- Finalidade: impedir que estado antigo do painel administrativo volte a ocultar
-- os códigos-base gerais de FE01–FE07 do DS Sub.

create or replace function private.enforce_ds_sub_frontend_reference_bases()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.student_id is null
     and exists (
       select 1
       from public.exercises e
       join public.subjects s on s.id = e.subject_id
       join public.classes c on c.id = new.class_id
       where e.id = new.exercise_id
         and c.code = 'DS-SUB-NOITE'
         and s.slug = 'programacao-front-end-sub'
         and e.slug in ('sub-fe-01','sub-fe-02','sub-fe-03','sub-fe-04','sub-fe-05','sub-fe-06','sub-fe-07')
     ) then
    new.allow_html_base := true;
    new.allow_css_base := true;
    new.allow_js_base := true;
  end if;
  return new;
end;
$$;

revoke all on function private.enforce_ds_sub_frontend_reference_bases() from public;

drop trigger if exists trg_enforce_ds_sub_frontend_reference_bases on public.exercise_releases;
create trigger trg_enforce_ds_sub_frontend_reference_bases
before insert or update on public.exercise_releases
for each row execute function private.enforce_ds_sub_frontend_reference_bases();
