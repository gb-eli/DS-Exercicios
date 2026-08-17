-- LAB Virtual — referências privadas para o Modo Professor
-- Depende de 019_activity_teacher_content.sql e de 018_lab_virtual_full_economy_deployment.sql.
-- Não contém gabaritos de programação; deriva somente o resultado/critério das simulações do catálogo oficial.

insert into public.activity_teacher_content(
  platform_id,activity_id,title,answer_text,explanation,solution_payload,rubric,intervention_tips,
  source_kind,source_ref,active,updated_at
)
select ac.platform_id,ac.activity_id,ac.name,
  'Resultado esperado: concluir a validação ' || coalesce(ac.metadata->>'completionId',ac.activity_id) ||
    ' dentro da ferramenta ' || coalesce(ac.metadata->>'toolId','correspondente') || '.',
  'Esta referência do professor descreve a condição oficial aceita pelo Core. A atividade precisa estar vinculada à ferramenta correta e respeitar o tempo mínimo antes da conclusão. A validação é rule_validated: o servidor confirma catálogo, abertura da ferramenta, tempo mínimo, idempotência e aplica somente a recompensa cadastrada.',
  jsonb_build_object(
    'expectedResult',coalesce(ac.metadata->>'completionId',ac.activity_id),
    'toolId',ac.metadata->>'toolId',
    'category',ac.metadata->>'category',
    'minimumSeconds',coalesce((ac.metadata->>'minSeconds')::int,0),
    'xp',ac.max_xp,
    'coins',ac.max_coins
  ),
  jsonb_build_array(
    jsonb_build_object('criterion','Atividade existente no catálogo','required',true),
    jsonb_build_object('criterion','Ferramenta correta aberta pelo aluno','required',true),
    jsonb_build_object('criterion','Tempo mínimo respeitado','value',coalesce((ac.metadata->>'minSeconds')::int,0)),
    jsonb_build_object('criterion','Conclusão registrada no Core','required',true)
  ),
  jsonb_build_array(
    'Peça ao aluno para explicar o que fez antes de mostrar o resultado esperado.',
    'Se a conclusão falhar, confira primeiro ferramenta, sequência e tempo mínimo.',
    'Use o valor de XP/créditos apenas como feedback; o servidor é a autoridade econômica.'
  ),
  'generated_reference','core/catalog/lab-virtual-4.28.0.json',true,now()
from public.activity_catalog ac
join public.platforms p on p.id=ac.platform_id
where p.code='lab-virtual' and ac.active=true and ac.activity_id like 'completion:%'
on conflict(platform_id,activity_id) do update set
  title=excluded.title,
  answer_text=excluded.answer_text,
  explanation=excluded.explanation,
  solution_payload=excluded.solution_payload,
  rubric=excluded.rubric,
  intervention_tips=excluded.intervention_tips,
  source_kind=excluded.source_kind,
  source_ref=excluded.source_ref,
  active=true,
  updated_at=now();

-- Expected: 88 active references for platform code lab-virtual.
