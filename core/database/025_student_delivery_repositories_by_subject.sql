-- P8.8 / v14.8.8 — GitHub por disciplina com compatibilidade ao campo legado.
alter table public.student_delivery_settings
  add column if not exists repository_urls jsonb not null default '{}'::jsonb;

alter table public.student_delivery_settings
  drop constraint if exists student_delivery_settings_repository_urls_object;

alter table public.student_delivery_settings
  add constraint student_delivery_settings_repository_urls_object
  check (jsonb_typeof(repository_urls) = 'object');
