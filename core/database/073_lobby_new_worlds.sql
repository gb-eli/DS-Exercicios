-- AGV World F81 / v14.10.8.83 — novas áreas isoladas de presença
ALTER TABLE public.lobby_presence DROP CONSTRAINT IF EXISTS lobby_presence_area_check;
ALTER TABLE public.lobby_presence DROP CONSTRAINT IF EXISTS lobby_presence_area_chk;
ALTER TABLE public.lobby_presence ADD CONSTRAINT lobby_presence_area_chk CHECK (area IN (
  'central','1ds','2ds','3ds','sub','vale-silicio','rural-agv','military-agv','space-agv','moon-agv','mars-agv','parque-diversoes-agv',
  'colegio-agv','labirinto-armadilhas','museu-hardware'
));
