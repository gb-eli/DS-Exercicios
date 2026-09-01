-- AGV World F82 / v14.10.8.84 — hotfix idempotente para instalações que já aplicaram a migration 073
-- Motivo: a 073 original podia ter usado um nome de constraint diferente em bases existentes.
-- Esta migration é nova para garantir que o reparo seja executado pelo fluxo normal de migrations.
ALTER TABLE public.lobby_presence DROP CONSTRAINT IF EXISTS lobby_presence_area_check;
ALTER TABLE public.lobby_presence DROP CONSTRAINT IF EXISTS lobby_presence_area_chk;
ALTER TABLE public.lobby_presence ADD CONSTRAINT lobby_presence_area_chk CHECK (area IN (
  'central','1ds','2ds','3ds','sub','vale-silicio','rural-agv','military-agv','space-agv','moon-agv','mars-agv','parque-diversoes-agv',
  'colegio-agv','labirinto-armadilhas','museu-hardware'
));
