-- P10.9.10 — Voucher de +1 ponto por estudo no final de semana
-- CANDIDATA. Não aplicar em produção sem backup restaurável confirmado.

create table if not exists public.weekend_bonus_vouchers (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete restrict,
  weekend_id text not null check (weekend_id ~ '^\d{4}-\d{2}-\d{2}$'),
  code text not null unique check (code ~ '^FDS-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$'),
  reward_points numeric(4,2) not null default 1.00 check (reward_points = 1.00),
  reason text not null default 'Estudo no final de semana — acesso ao Portal de Atividades durante a janela especial',
  issued_at timestamptz not null default now(),
  eligible_until timestamptz not null,
  timezone text not null default 'America/Sao_Paulo',
  redeemed_at timestamptz,
  redeemed_by uuid references auth.users(id) on delete set null,
  redemption_note text,
  revoked_at timestamptz,
  revoked_by uuid references auth.users(id) on delete set null,
  revocation_reason text,
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  unique (student_id, weekend_id)
);

create index if not exists weekend_bonus_vouchers_code_idx
  on public.weekend_bonus_vouchers(code);
create index if not exists weekend_bonus_vouchers_student_idx
  on public.weekend_bonus_vouchers(student_id, issued_at desc);
create index if not exists weekend_bonus_vouchers_class_idx
  on public.weekend_bonus_vouchers(class_id, issued_at desc);

alter table public.weekend_bonus_vouchers enable row level security;

-- O cliente nunca lê nem grava vouchers diretamente. Toda emissão, consulta e resgate
-- passa pela Edge Function service-role com autenticação e escopo do professor.
revoke all on table public.weekend_bonus_vouchers from anon, authenticated;

comment on table public.weekend_bonus_vouchers is
  'Voucher auditável de +1 ponto por estudo no fim de semana; 1 por aluno/fim de semana; emissão e resgate apenas server-side.';
comment on column public.weekend_bonus_vouchers.code is
  'Código opaco curto. Não contém nome, turma ou outro dado pessoal codificado.';
comment on column public.weekend_bonus_vouchers.weekend_id is
  'Data local do domingo que identifica a janela do fim de semana em America/Sao_Paulo.';
