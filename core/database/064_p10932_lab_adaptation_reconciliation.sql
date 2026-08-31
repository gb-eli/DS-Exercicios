-- Etapa 17 — Laboratório Virtual + reconciliação segura das adaptações pedagógicas.
-- Não contém nomes de estudantes. O roster nominal continua no schema private.

create or replace function private.prepare_pedagogical_adaptation_roster_row()
returns trigger
language plpgsql
security definer
set search_path=public,private
as $$
begin
  new.normalized_name := public.normalize_student_name(new.student_name);
  new.updated_at := now();
  return new;
end;
$$;

revoke all on function private.prepare_pedagogical_adaptation_roster_row() from public, anon, authenticated;

drop trigger if exists before_pedagogical_adaptation_roster_normalize on private.pedagogical_adaptation_roster;
create trigger before_pedagogical_adaptation_roster_normalize
before insert or update of student_name,normalized_name,class_code,profile_key,config,active
on private.pedagogical_adaptation_roster
for each row execute function private.prepare_pedagogical_adaptation_roster_row();

create or replace function private.reconcile_pedagogical_adaptation_roster_row()
returns trigger
language plpgsql
security definer
set search_path=public,private
as $$
declare
  r record;
begin
  if new.active is not true then
    return new;
  end if;

  for r in
    select distinct p.id
    from public.profiles p
    left join public.class_memberships cm
      on cm.user_id=p.id and cm.active=true
    left join public.classes c
      on c.id=cm.class_id and c.active=true
    where p.active=true
      and public.normalize_student_name(p.full_name)=new.normalized_name
      and (new.class_code is null or c.code=new.class_code)
  loop
    perform public.apply_pedagogical_adaptation_for_profile(r.id);
  end loop;

  return new;
end;
$$;

revoke all on function private.reconcile_pedagogical_adaptation_roster_row() from public, anon, authenticated;

drop trigger if exists after_pedagogical_adaptation_roster_reconcile on private.pedagogical_adaptation_roster;
create trigger after_pedagogical_adaptation_roster_reconcile
after insert or update of student_name,normalized_name,class_code,profile_key,config,active
on private.pedagogical_adaptation_roster
for each row execute function private.reconcile_pedagogical_adaptation_roster_row();

-- Corrige normalizações antigas e reaplica o roster privado aos perfis já existentes.
update private.pedagogical_adaptation_roster
set normalized_name=public.normalize_student_name(student_name),
    updated_at=now()
where normalized_name is distinct from public.normalize_student_name(student_name);

do $$
declare r record;
begin
  for r in select id from public.profiles where active=true loop
    perform public.apply_pedagogical_adaptation_for_profile(r.id);
  end loop;
end $$;
