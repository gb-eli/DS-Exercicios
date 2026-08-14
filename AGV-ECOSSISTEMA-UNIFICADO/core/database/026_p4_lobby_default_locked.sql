-- Applied live in Supabase on 2026-08-14.
-- Activities require an explicit class/student release before opening.
update public.exercises
set default_locked = true,
    updated_at = now()
where active = true
  and default_locked = false;
