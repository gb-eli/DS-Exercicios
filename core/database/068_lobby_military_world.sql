-- F73 / v14.10.8.75 — Base de Operações AGV
-- Amplia a presença para o novo mapa operacional carregado sob demanda.
-- O mapa é educacional e não inclui mecânicas de combate ou armamentos.

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
  check (area in ('central','1ds','2ds','3ds','sub','vale-silicio','rural-agv','military-agv'));
