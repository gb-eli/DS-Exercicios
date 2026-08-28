-- Recuperação 2DS Sub — revisão sincronizada + chat privado
-- v1.1.0 / 2026-08-27
-- Atualização incremental sobre 059_p10930_recovery_exam_2ds_sub.sql.

alter table public.recovery_exam_sessions
  add column if not exists review_card_index integer not null default 0,
  add column if not exists review_stage_index integer not null default 0,
  add column if not exists review_revision bigint not null default 0,
  add column if not exists review_started_at timestamptz,
  add column if not exists review_ended_at timestamptz;

comment on column public.recovery_exam_sessions.review_card_index is
  'Índice global da tela da revisão. Controlado somente pelo professor.';
comment on column public.recovery_exam_sessions.review_stage_index is
  'Índice global da etapa dentro da tela da revisão.';
comment on column public.recovery_exam_sessions.review_revision is
  'Contador monotônico de alterações na posição da revisão para sincronização por polling.';

create table if not exists public.recovery_exam_chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.recovery_exam_sessions(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  sender_role text not null check (sender_role in ('student','teacher')),
  category text not null default 'message'
    check (category in ('message','question','technical','guidance')),
  message text not null check (char_length(btrim(message)) between 1 and 800),
  read_by_teacher_at timestamptz,
  read_by_student_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists recovery_exam_chat_session_student_created_idx
  on public.recovery_exam_chat_messages(session_id,student_id,created_at);

create index if not exists recovery_exam_chat_student_idx
  on public.recovery_exam_chat_messages(student_id);

create index if not exists recovery_exam_chat_sender_idx
  on public.recovery_exam_chat_messages(sender_id);

create index if not exists recovery_exam_chat_teacher_unread_idx
  on public.recovery_exam_chat_messages(session_id,student_id,created_at)
  where sender_role='student' and read_by_teacher_at is null;

create index if not exists recovery_exam_chat_student_unread_idx
  on public.recovery_exam_chat_messages(session_id,student_id,created_at)
  where sender_role='teacher' and read_by_student_at is null;

alter table public.recovery_exam_chat_messages enable row level security;

-- O chat e o gabarito são expostos apenas pela Edge Function autenticada.
revoke all on public.recovery_exam_chat_messages from public,anon,authenticated;

comment on table public.recovery_exam_chat_messages is
  'Chat privado professor-aluno por sessão de recuperação. Sem comunicação aluno-aluno.';
