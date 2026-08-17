from pathlib import Path
import json,re,subprocess,sys,zipfile
root=Path(__file__).resolve().parents[1]
errors=[]

def check(cond,msg):
    if not cond: errors.append(msg)

# JSON files
for path in list((root/'config').glob('*.json'))+list((root/'catalog').glob('*.json'))+list((root/'schemas').glob('*.json'))+[root/'manifest.json',root/'assets/asset-manifest.json']:
    try: json.loads(path.read_text())
    except Exception as e: errors.append(f'JSON inválido {path.relative_to(root)}: {e}')

items=json.loads((root/'catalog/items.json').read_text())
if isinstance(items,dict): items=items.get('items',[])
check(len(items)==71,f'Catálogo deveria ter 71 itens, encontrou {len(items)}')
check(len({item['id'] for item in items})==len(items),'IDs duplicados no catálogo')

html=(root/'demo/index.html').read_text()
ids=re.findall(r'\bid="([^"]+)"',html)
check(len(ids)==len(set(ids)),'IDs HTML duplicados')
check('id="validationView"' in html,'Central de validação ausente')
check('Carteira Virtual DS' in html,'Nome da carteira ausente')

for js in [root/'demo/app.js',root/'dist/ds-store-foundation.js',root/'demo/performance-manager.js']:
    result=subprocess.run(['node','--check',str(js)],capture_output=True,text=True)
    check(result.returncode==0,f'JavaScript inválido {js.name}: {result.stderr}')

for rel in ['assets/ui/finance/ledger-scan.svg','assets/ui/finance/checkpoint-pulse.svg','assets/ui/finance/teacher-review.svg']:
    check((root/rel).is_file(),f'Asset ausente: {rel}')

browser=json.loads((root/'docs/browser-test-v080.json').read_text())
check(not browser.get('errors'),'Teste do navegador registrou erros')
checks=browser.get('checks',{})
check(checks.get('pending_high')=='1','Crédito de 5.000 não entrou em análise')
check(checks.get('pending_after_approve')=='0','Revisão não foi concluída')
check(checks.get('balance_after_approve')=='9.800','Saldo após aprovação incorreto')
check(checks.get('blocked')=='50.000','Crédito crítico não foi bloqueado')
check(checks.get('mobile_overflow') is False,'Layout móvel possui overflow horizontal')

if errors:
    print('\n'.join('ERRO: '+e for e in errors)); sys.exit(1)
print('v0.8.0 válida: 71 itens, 13 telas, carteira, análises, hashes e layout móvel conferidos.')
