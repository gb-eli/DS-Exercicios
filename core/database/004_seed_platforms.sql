-- Plataformas iniciais do pacote
insert into public.platforms(id,name,current_version) values
  ('lab-virtual','Laboratório Virtual DS','4.28.0'),
  ('ctf-ds','CTF DS','3.2.0'),
  ('planetario-ds','COSMOS / Planetário DS','34.0.0'),
  ('desafio-ds','Desafio DS','33.0.0-pilot'),
  ('fliperama-ds','Fliperama DS','0.39.0-hotfix1'),
  ('game-informatica','Desafio Informática','2.5.7 build 20260811r38'),
  ('lab-sub','Plataforma 2DS Sub — Aluno','0.1.42'),
  ('lab-ds1','Plataforma 1DS — Central de Disciplinas','1.12.0'),
  ('lab-ds2','Plataforma 2DS — Duas Disciplinas','0.7.1'),
  ('lab-ds3','Plataforma 3DS — Aluno','0.11.9')
on conflict (id) do update set name=excluded.name,current_version=excluded.current_version,updated_at=now();
