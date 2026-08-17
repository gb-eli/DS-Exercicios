-- v8 — LABs DS1/DS2/DS3/Sub: revisão docente e proteção da validação de Análise
-- Estado aplicado no projeto central em 13/08/2026.

create index if not exists activity_progress_review_status_idx
on public.activity_progress(platform_id, updated_at desc)
where (metadata->>'review_status') in ('pending','approved','changes_requested');

create or replace function public.guard_analysis_completion_server_validation()
returns trigger
language plpgsql
set search_path=''
as $$
declare
  v_code text;
begin
  if new.status in ('completed','reviewed')
     and new.activity_id like 'exercise:analise-metodo-sistemas:%' then
    select code into v_code from public.platforms where id=new.platform_id;
    if v_code='lab-ds1'
       and coalesce((new.metadata->>'analysis_validated')::boolean,false)=false then
      raise exception 'analysis_server_validation_required' using errcode='P0001';
    end if;
  end if;
  return new;
end;
$$;

revoke execute on function public.guard_analysis_completion_server_validation()
from public, anon, authenticated;
grant execute on function public.guard_analysis_completion_server_validation()
to service_role;

drop trigger if exists trg_guard_analysis_completion on public.activity_progress;
create trigger trg_guard_analysis_completion
before insert or update on public.activity_progress
for each row execute function public.guard_analysis_completion_server_validation();
