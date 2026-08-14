from pathlib import Path
import json, zipfile, re, sys
root=Path(__file__).resolve().parents[1]
errors=[]
required=['dist/ds-store-sdk.js','dist/ds-store-sdk.esm.js','config/integration.config.json','schemas/platform-event.schema.json','schemas/sdk-response.schema.json','demo/integration-data.js']
for rel in required:
    if not (root/rel).is_file(): errors.append(f'ausente: {rel}')
cfg=json.loads((root/'config/integration.config.json').read_text())
economy=json.loads((root/'config/economy.config.json').read_text())
if len(cfg['platforms'])<10: errors.append('menos de 10 adaptadores')
if len(economy['rewardTypes'])<16: errors.append('menos de 16 tipos de recompensa')
ids=[p['id'] for p in cfg['platforms']]
if len(ids)!=len(set(ids)): errors.append('platformId duplicado')
for pid in ids:
    if not (root/f'src/integration/adapters/{pid}.js').is_file(): errors.append(f'adaptador ausente: {pid}')
html=(root/'demo/index.html').read_text()
for token in ['integrationView','sendSdkEvent']:
    if token not in html: errors.append(f'HTML sem {token}')
integration_module=(root/'demo/modules/integration.module.js').read_text()
for token in ['ds-store-sdk.js','integration-data.js']:
    if token not in integration_module: errors.append(f'módulo de integração sem {token}')
js=(root/'demo/app.js').read_text()
for token in ['renderIntegration','sendSdkEvent','createSdkForPlatform']:
    if token not in js: errors.append(f'app sem {token}')
manifest=json.loads((root/'manifest.json').read_text())
if manifest.get('version') not in {'0.9.0','0.9.1','0.9.2','0.9.3','0.9.4','0.9.4.1','0.9.4.2','0.9.4.3','0.9.4.4','0.9.5','0.9.5.1','0.9.6.0-RG'}: errors.append('manifest incorreto')
if manifest.get('modules',{}).get('integration',{}).get('version')!='0.9.0': errors.append('versão do SDK/integracao alterada')
if errors:
    print('\n'.join(errors)); sys.exit(1)
print(json.dumps({'version':manifest.get('version'),'sdkVersion':'0.9.0','platforms':len(cfg['platforms']),'eventTypes':len(economy['rewardTypes']),'requiredFiles':len(required),'status':'PASS'},ensure_ascii=False,indent=2))
