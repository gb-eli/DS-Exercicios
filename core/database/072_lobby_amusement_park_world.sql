-- F80 / v14.10.8.82 — Parque de Diversões AGV conectado ao conjunto de mundos
-- Amplia lobby_presence.area para o Parque, preservando Campus, Vale, Rural, Base, Órbita, Lua e Marte.

do $$
begin
  if exists (
    select 1 from pg_constraint
    where conname='lobby_presence_area_chk'
      and conrelid='public.lobby_presence'::regclass
  ) then
    alter table public.lobby_presence drop constraint lobby_presence_area_chk;
  end if;
end $$;

alter table public.lobby_presence
  add constraint lobby_presence_area_chk
  check (area in ('central','1ds','2ds','3ds','sub','vale-silicio','rural-agv','military-agv','space-agv','moon-agv','mars-agv','parque-diversoes-agv'));
