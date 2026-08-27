-- P10928 / v14.10.8.28 — central do aluno, ciência de pendências e identidade das guildas.
-- A migration é idempotente e não altera notas nem respostas existentes.

create table if not exists public.student_dashboard_receipts (
  student_id uuid not null references public.profiles(id) on delete cascade,
  notice_key text not null,
  notice_type text not null default 'pending_summary',
  notice_payload jsonb not null default '{}'::jsonb,
  acknowledged_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  primary key (student_id, notice_key),
  constraint student_dashboard_receipts_key_length check (char_length(notice_key) between 3 and 180),
  constraint student_dashboard_receipts_type_length check (char_length(notice_type) between 3 and 60)
);

create index if not exists student_dashboard_receipts_ack_idx
  on public.student_dashboard_receipts(student_id, acknowledged_at desc);

alter table public.student_dashboard_receipts enable row level security;
revoke all on table public.student_dashboard_receipts from public, anon;
grant select, insert, update on table public.student_dashboard_receipts to authenticated;

drop policy if exists student_dashboard_receipts_select_own on public.student_dashboard_receipts;
create policy student_dashboard_receipts_select_own
  on public.student_dashboard_receipts for select to authenticated
  using (student_id = auth.uid());

drop policy if exists student_dashboard_receipts_insert_own on public.student_dashboard_receipts;
create policy student_dashboard_receipts_insert_own
  on public.student_dashboard_receipts for insert to authenticated
  with check (student_id = auth.uid());

drop policy if exists student_dashboard_receipts_update_own on public.student_dashboard_receipts;
create policy student_dashboard_receipts_update_own
  on public.student_dashboard_receipts for update to authenticated
  using (student_id = auth.uid())
  with check (student_id = auth.uid());

alter table public.practical_exam_clans
  add column if not exists accent_color text not null default '#22d3ee',
  add column if not exists mascot_key text not null default 'robot',
  add column if not exists emblem_data_url text;

alter table public.practical_exam_clans
  drop constraint if exists practical_exam_clans_accent_color_check;
alter table public.practical_exam_clans
  add constraint practical_exam_clans_accent_color_check
  check (accent_color ~ '^#[0-9A-Fa-f]{6}$');

alter table public.practical_exam_clans
  drop constraint if exists practical_exam_clans_mascot_check;
alter table public.practical_exam_clans
  add constraint practical_exam_clans_mascot_check
  check (mascot_key in ('robot','owl','fox','dragon','wolf','eagle','octopus','capybara'));

alter table public.practical_exam_clans
  drop constraint if exists practical_exam_clans_emblem_size_check;
alter table public.practical_exam_clans
  add constraint practical_exam_clans_emblem_size_check
  check (emblem_data_url is null or char_length(emblem_data_url) <= 450000);

comment on table public.student_dashboard_receipts is
  'Registra quando o aluno confirma a leitura do resumo de pendências apresentado após o login.';
comment on column public.practical_exam_clans.emblem_data_url is
  'Emblema raster pequeno (PNG/JPEG/WEBP) validado pela Edge Function; limite aproximado de 320 KB.';
