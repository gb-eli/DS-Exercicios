-- AGV World F88 / v14.10.8.90 — presença para módulos adicionais do Campus
ALTER TABLE public.lobby_presence DROP CONSTRAINT IF EXISTS lobby_presence_area_check;
ALTER TABLE public.lobby_presence DROP CONSTRAINT IF EXISTS lobby_presence_area_chk;
ALTER TABLE public.lobby_presence ADD CONSTRAINT lobby_presence_area_chk CHECK (area IN (
  'central','1ds','2ds','3ds','sub',
  'village-1ds','village-2ds','village-3ds','village-sub',
  'campus-library','campus-labs','campus-neon',
  'vale-silicio','rural-agv','military-agv','space-agv','moon-agv','mars-agv','parque-diversoes-agv',
  'colegio-agv','labirinto-armadilhas','museu-hardware'
));
