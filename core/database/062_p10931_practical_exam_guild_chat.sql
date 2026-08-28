-- P10931 / v14.10.8.30 — chat multiplayer por guilda no Modo Prova Coletiva
create table if not exists public.practical_exam_team_chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.practical_exam_sessions(id) on delete cascade,
  clan_id uuid not null references public.practical_exam_clans(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  message text not null check (char_length(btrim(message)) between 1 and 500),
  created_at timestamptz not null default now()
);
create index if not exists practical_exam_team_chat_session_clan_idx
  on public.practical_exam_team_chat_messages(session_id,clan_id,created_at desc);
create index if not exists practical_exam_team_chat_sender_idx
  on public.practical_exam_team_chat_messages(sender_id,created_at desc);
alter table public.practical_exam_team_chat_messages enable row level security;
revoke all on table public.practical_exam_team_chat_messages from public,anon,authenticated;
comment on table public.practical_exam_team_chat_messages is
  'Chat auditável da própria guilda. Acesso somente por Edge Function após validar sessão, turma e membro da equipe.';
