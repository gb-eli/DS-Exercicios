-- AGV Education Core — conteúdo privado do Modo Professor
-- Aplicado no projeto central em 13/08/2026.
-- IMPORTANTE: não conceder SELECT a anon/authenticated. O acesso é somente por Edge Function autorizada.

create table if not exists public.activity_teacher_content (
  id uuid primary key default gen_random_uuid(),
  platform_id uuid not null references public.platforms(id) on delete cascade,
  activity_id text not null,
  title text not null,
  answer_text text,
  explanation text,
  solution_payload jsonb not null default '{}'::jsonb,
  rubric jsonb not null default '[]'::jsonb,
  intervention_tips jsonb not null default '[]'::jsonb,
  source_kind text not null default 'manual' check (source_kind in ('manual','professor_bundle','guided_data','generated_reference')),
  source_ref text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(platform_id, activity_id)
);

alter table public.activity_teacher_content enable row level security;
revoke all on table public.activity_teacher_content from anon, authenticated;
grant select, insert, update, delete on table public.activity_teacher_content to service_role;
create index if not exists activity_teacher_content_platform_idx
  on public.activity_teacher_content(platform_id, activity_id, active);
