from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from threading import Thread
from urllib.request import urlopen
from urllib.parse import quote
import os, json
root=Path('/mnt/data/work_v037')
os.chdir(root)
class H(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
srv=ThreadingHTTPServer(('127.0.0.1',0),H); port=srv.server_address[1]
Thread(target=srv.serve_forever,daemon=True).start()
paths=sorted(x for x in root.rglob('*') if x.is_file() and x.name != 'browser-smoke-v0.37.0.png')
results=[]
for p in paths:
    rel=p.relative_to(root).as_posix()
    try:
        with urlopen(f'http://127.0.0.1:{port}/'+quote(rel),timeout=5) as r:
            status=r.status; r.read()
        results.append({'path':rel,'status':status,'ok':status==200})
    except Exception as e:
        results.append({'path':rel,'status':None,'ok':False,'error':str(e)})
srv.shutdown()
summary={'total':len(results),'passed':sum(r['ok'] for r in results),'failed':sum(not r['ok'] for r in results)}
out={'product':'Fliperama DS','version':'0.37.0','phase':'Fase 7.18 — Multiplayer Local Core + Duo Elementos DS','summary':summary,'results':results}
(root/'validation/http-route-results-v0.37.0.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
(root/'validation/http-route-results.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(summary))
raise SystemExit(1 if summary['failed'] else 0)
