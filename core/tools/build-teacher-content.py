#!/usr/bin/env python3
"""Build private AGV teacher-content records from professor-only ZIP archives.

This script intentionally does not contain gabaritos. It reads private Professor bundles
and emits JSON/SQL for server-side ingestion into activity_teacher_content.
Do NOT put the generated JSON/SQL in a public/student deployment.
"""
from __future__ import annotations
import argparse, json, zipfile, tempfile, shutil
from pathlib import Path
from typing import Any


def read_assignment_array(path: Path, prefix: str):
    text=path.read_text(encoding='utf-8')
    start=text.find(prefix)
    if start<0: raise ValueError(f'Prefix not found: {prefix} in {path}')
    fragment=text[start+len(prefix):].lstrip()
    return json.JSONDecoder().raw_decode(fragment)[0]

def files_from_keys(item: dict):
    files=item.get('arquivos') or {}
    names=item.get('nomesArquivos') or {}
    out={}
    for key,content in files.items():
        name=names.get(key,key)
        out[str(name)]=str(content)
    return out

def flatten_steps(steps: Any) -> str:
    parts=[]
    if isinstance(steps,dict):
        groups=steps.items()
    elif isinstance(steps,list):
        groups=[('',steps)]
    else:
        groups=[]
    for group,items in groups:
        if group: parts.append(f'### {group}')
        for step in items or []:
            if not isinstance(step,dict): continue
            title=step.get('titulo') or step.get('title') or 'Etapa'
            exp=step.get('explicacao') or step.get('descricao') or ''
            result=step.get('resultado') or ''
            line=f'- {title}: {exp}'.strip()
            if result: line+=f' Resultado esperado: {result}'
            parts.append(line)
    return '\n'.join(parts)

def tips_from(item: dict):
    out=[]
    prof=item.get('professor') or {}
    if isinstance(prof,dict):
        for label in ('roteiro','testes','erros','dicas','observacoes'):
            vals=prof.get(label)
            if isinstance(vals,list):
                out += [f'{label.capitalize()}: {v}' for v in vals]
    for label in ('dicasProgressivas','perguntasGuia','dicasExtras'):
        vals=item.get(label)
        if isinstance(vals,list): out += [str(v) for v in vals]
    return out[:80]

def rubric_from(item: dict):
    v=item.get('validacao')
    return [{'type':'validation','data':v}] if v else []

def record(platform,activity_id,item,source_ref,source_kind='professor_bundle',answer_text=None,solution=None,extra_explanation=''):
    exp=flatten_steps(item.get('passos'))
    obj=item.get('objetivo') or item.get('objective') or ''
    explanation='\n\n'.join(x for x in [obj,extra_explanation,exp] if x)
    if answer_text is None:
        answer_text=f"Solução de referência completa para: {item.get('titulo') or activity_id}."
    return {
        'platform_code':platform,
        'activity_id':activity_id,
        'title':item.get('titulo') or item.get('name') or activity_id,
        'answer_text':answer_text,
        'explanation':explanation,
        'solution_payload':solution if solution is not None else {'files':files_from_keys(item),'steps':item.get('passos') or []},
        'rubric':rubric_from(item),
        'intervention_tips':tips_from(item),
        'source_kind':source_kind,
        'source_ref':source_ref,
    }

def extract(zip_path: Path, dst: Path):
    with zipfile.ZipFile(zip_path) as z: z.extractall(dst)

def build(args):
    tmp=Path(tempfile.mkdtemp(prefix='agv-teacher-content-'))
    try:
        paths={}
        for key,z in [('ds1',args.ds1),('ds2',args.ds2),('ds3',args.ds3),('sub',args.sub)]:
            d=tmp/key; d.mkdir(); extract(Path(z),d); paths[key]=d
        recs=[]
        # DS1 Introdução
        p=next(paths['ds1'].rglob('disciplinas/introducao-programacao/data/exercicios.js'))
        arr=read_assignment_array(p,'window.EXERCICIOS = ')
        for x in arr:
            recs.append(record('lab-ds1',f"exercise:introducao-programacao:{x['numero']:02d}",x,Path(args.ds1).name,'guided_data'))
        # DS1 Análise e Método: authoritative solutions from analysis-data.json
        ap=next(paths['ds1'].rglob('disciplinas/analise-metodos/data/analysis-data.json'))
        ad=json.loads(ap.read_text(encoding='utf-8'))
        for n in range(1,4):
            x=ad[f'activity{n:02d}']
            title=x.get('titulo') or next((a.get('titulo') for a in ad.get('publishedActivities',[]) if a.get('numero')==n),f'Atividade {n:02d}')
            item={'titulo':title,'objetivo':x.get('objective'),'passos':[]}
            solution=x.get('solution') or {}
            explanation='Cenário: '+str(x.get('scenario') or '')
            rub=[{'type':'solution','data':solution}]
            rec=record('lab-ds1',f'exercise:analise-metodo-sistemas:{n:02d}',item,Path(args.ds1).name,'professor_bundle',
                       answer_text='Gabarito estrutural disponível em campos preenchidos.',
                       solution={'fields':solution,'scenario':x.get('scenario'),'categories':x.get('categories',[]),'requirements':x.get('requirements',[]),'questions':x.get('questions',[])},
                       extra_explanation=explanation)
            rec['rubric']=rub
            rec['intervention_tips']=['Revelar o gabarito somente após a tentativa da turma.','Pedir que o aluno justifique a classificação antes de mostrar a resposta-modelo.']
            recs.append(rec)
        # DS2 Front-End
        p=next(paths['ds2'].rglob('frontend/exercicios.js')); arr=read_assignment_array(p,'window.EXERCICIOS = ')
        for x in arr: recs.append(record('lab-ds2',f"exercise:programacao-front-end:{x['numero']:02d}",x,Path(args.ds2).name,'professor_bundle'))
        # DS2 Inovação: open-ended model/rubric
        p=next(paths['ds2'].rglob('inovacao/atividades.js')); arr=read_assignment_array(p,'window.ATIVIDADES_INOVACAO = ')
        for x in arr:
            fields={}
            rub=[]
            for f in x.get('campos',[]):
                fid=f.get('id') or f.get('label')
                fields[str(fid)]={
                    'prompt':f.get('label'),
                    'modelGuidance':f"Resposta autoral coerente com o objetivo da atividade e os conceitos: {', '.join(x.get('conceitos',[]))}.",
                    'minChars':f.get('minChars'),
                    'required':bool(f.get('required')),
                }
                rub.append({'field':fid,'required':bool(f.get('required')),'minChars':f.get('minChars'),'criterion':'Coerência conceitual, justificativa e exemplo pertinente; aceitar respostas equivalentes.'})
            answer=(f"Resposta-modelo aberta. O aluno deve demonstrar: {x.get('objetivo','')}. "
                    f"Conceitos essenciais: {', '.join(x.get('conceitos',[]))}. Produto esperado: {x.get('produto','')}.")
            rec=record('lab-ds2',f"exercise:inovacao-tecnologica-empreendedorismo:{x['numero']:02d}",x,Path(args.ds2).name,'generated_reference',answer_text=answer,solution={'fields':fields})
            rec['rubric']=rub
            rec['intervention_tips']=['Não exigir texto idêntico ao modelo.','Aceitar exemplos diferentes quando o conceito e a justificativa estiverem corretos.','Usar a rubrica para pedir aprofundamento antes de marcar como incorreto.']
            recs.append(rec)
        # DS3
        p=next(paths['ds3'].rglob('data/exercicios.js')); arr=read_assignment_array(p,'window.EXERCICIOS = ')
        for x in arr: recs.append(record('lab-ds3',f"exercise:programacao-desenvolvimento-sistemas:{x['numero']:02d}",x,Path(args.ds3).name,'guided_data'))
        # Sub Front-End
        p=next(paths['sub'].rglob('data/exercicios.js')); arr=read_assignment_array(p,'window.EXERCICIOS_FRONTEND = ')
        for x in arr: recs.append(record('lab-sub',f"exercise:programacao-front-end-sub:{x['numero']:02d}",x,Path(args.sub).name,'professor_bundle'))
        # Sub Mobile
        p=next(paths['sub'].rglob('data/mobile-exercicios.js')); arr=read_assignment_array(p,'window.EXERCICIOS_MOBILE = ')
        for x in arr: recs.append(record('lab-sub',f"exercise:programacao-mobile-sub:{x['numero']:02d}",x,Path(args.sub).name,'professor_bundle'))
        if len(recs)!=88: raise RuntimeError(f'Expected 88 teacher records, got {len(recs)}')
        return recs
    finally:
        shutil.rmtree(tmp,ignore_errors=True)

def sql_literal(v):
    if v is None:return 'null'
    return "'"+str(v).replace("'","''")+"'"

def sql_json(v):
    return sql_literal(json.dumps(v,ensure_ascii=False,separators=(',',':')))+'::jsonb'

def write_sql(recs,out:Path):
    lines=['-- PRIVATE GENERATED FILE. DO NOT PUBLISH WITH STUDENT BUNDLES.','begin;']
    for r in recs:
        lines.append(f"""insert into public.activity_teacher_content(platform_id,activity_id,title,answer_text,explanation,solution_payload,rubric,intervention_tips,source_kind,source_ref,active,updated_at)
select p.id,{sql_literal(r['activity_id'])},{sql_literal(r['title'])},{sql_literal(r['answer_text'])},{sql_literal(r['explanation'])},{sql_json(r['solution_payload'])},{sql_json(r['rubric'])},{sql_json(r['intervention_tips'])},{sql_literal(r['source_kind'])},{sql_literal(r['source_ref'])},true,now()
from public.platforms p where p.code={sql_literal(r['platform_code'])} and p.active=true
on conflict(platform_id,activity_id) do update set title=excluded.title,answer_text=excluded.answer_text,explanation=excluded.explanation,solution_payload=excluded.solution_payload,rubric=excluded.rubric,intervention_tips=excluded.intervention_tips,source_kind=excluded.source_kind,source_ref=excluded.source_ref,active=true,updated_at=now();""")
    lines+=['commit;','-- Expected records: 88']
    out.write_text('\n'.join(lines),encoding='utf-8')

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--ds1',required=True);ap.add_argument('--ds2',required=True);ap.add_argument('--ds3',required=True);ap.add_argument('--sub',required=True)
    ap.add_argument('--json-out');ap.add_argument('--sql-out')
    a=ap.parse_args();recs=build(a)
    if a.json_out: Path(a.json_out).write_text(json.dumps(recs,ensure_ascii=False,indent=2),encoding='utf-8')
    if a.sql_out: write_sql(recs,Path(a.sql_out))
    print(json.dumps({'status':'ok','records':len(recs),'platforms':{p:sum(1 for r in recs if r['platform_code']==p) for p in sorted(set(r['platform_code'] for r in recs))}},ensure_ascii=False))
if __name__=='__main__':main()
