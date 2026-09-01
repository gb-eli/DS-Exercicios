-- AGV World F86 / v14.10.8.88 — presença para Vilas DS modulares
-- Mantém áreas legadas do Campus e adiciona submapas físicos 1DS/2DS/3DS/SUB.
ALTER TABLE public.lobby_presence DROP CONSTRAINT IF EXISTS lobby_presence_area_check;
ALTER TABLE public.lobby_presence DROP CONSTRAINT IF EXISTS lobby_presence_area_chk;
ALTER TABLE public.lobby_presence ADD CONSTRAINT lobby_presence_area_chk CHECK (area IN (
  'central','1ds','2ds','3ds','sub',
  'village-1ds','village-2ds','village-3ds','village-sub',
  'vale-silicio','rural-agv','military-agv','space-agv','moon-agv','mars-agv','parque-diversoes-agv',
  'colegio-agv','labirinto-armadilhas','museu-hardware'
));
