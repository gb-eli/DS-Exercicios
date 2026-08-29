-- v14.10.7: preencher descrições ausentes do Front-End Sub sem sobrescrever texto existente.
update public.exercises e set description = case e.exercise_number
 when 2 then 'Construir uma página HTML semântica com estrutura profissional.'
 when 3 then 'Criar um formulário acessível com campos, rótulos e validação básica.'
 when 4 then 'Aplicar seletores, cascata, variáveis e Box Model em CSS.'
 when 5 then 'Organizar um layout profissional com Flexbox.'
 when 6 then 'Aplicar Grid, media queries e responsividade.'
 else e.description end, updated_at=now()
from public.subjects s where s.id=e.subject_id and s.slug='programacao-front-end-sub' and e.exercise_number between 2 and 6 and coalesce(trim(e.description),'')='';
