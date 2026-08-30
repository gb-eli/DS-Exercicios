-- P10.9.20 — finalização segura da troca obrigatória de senha
-- Mantém o estado do perfil sincronizado com mudanças reais de senha no Supabase Auth.
-- O reset administrativo/CGM deve definir must_change_password=true DEPOIS de updateUserById().

create or replace function public.handle_auth_password_changed()
returns trigger
language plpgsql
security definer
set search_path to 'public','extensions'
as $$
begin
  if old.encrypted_password is distinct from new.encrypted_password then
    update public.profiles
       set must_change_password = false,
           cgm = null,
           password_changed_at = now(),
           updated_at = now()
     where id = new.id;
  end if;
  return new;
end;
$$;

revoke all on function public.handle_auth_password_changed() from public, anon, authenticated;

drop trigger if exists on_auth_password_changed on auth.users;
create trigger on_auth_password_changed
after update of encrypted_password on auth.users
for each row
when (old.encrypted_password is distinct from new.encrypted_password)
execute function public.handle_auth_password_changed();
