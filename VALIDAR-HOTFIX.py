from pathlib import Path
import json, re, sys

ROOT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd().resolve()
checks = []

def ok(name, cond, detail=""):
    checks.append((name, bool(cond), detail))

def text(rel):
    p = ROOT / rel
    return p.read_text(encoding="utf-8") if p.exists() else ""

# Recuperação — boot
for rel in ["recuperacao/assets/student.js", "recuperacao/assets/admin.js"]:
    s = text(rel)
    ok(
        f"{rel}: listener de login tolerante",
        "$('login-form')?.addEventListener('submit',login);" in s,
        "Evita null.addEventListener e tela vazia."
    )

admin = text("recuperacao/assets/admin.js")
ok("Título docente genérico DS", "Recuperações 2DS Sub" not in admin and "Retomada & Recuperação DS" in admin)

catalog = text("recuperacao/assets/catalog.js")
ok("Catálogo 3DS presente", '"programacao_ds3"' in catalog and "Programação no Desenvolvimento de Sistemas" in catalog)

edge = text("core/edge-functions/recovery-exam/index.ts")
ok("Backend recovery reconhece 3DS", "programacao_ds3" in edge)

# Prova prática
exam_edge = text("core/edge-functions/practical-exam/index.ts")
ok("Template DS1 presente", "analysis_methods_1ds" in exam_edge and "Análise e Método para Sistemas" in exam_edge)
ok("Template DS2 presente", "innovation_2ds" in exam_edge and "Inovação Tecnológica e Empreendedorismo" in exam_edge)
ok("Regra de equipe 3–7 preservada", "min_clan_size" in exam_edge and "max_clan_size" in exam_edge)
ok("Eleição de líder preservada", "recomputeLeader" in exam_edge)

exam_admin = text("prova/assets/admin.js")
ok("Lobby padrão 5 min", 'id="create-lobby-duration" type="number" min="5" max="60" value="5"' in exam_admin)
ok("Operação padrão 30 min", 'id="create-duration" type="number" min="10" max="180" value="30"' in exam_admin)

deploy = text("PUBLIC-DEPLOY.json")
try:
    dj = json.loads(deploy)
    ok("prova/ no frontend público", "prova/" in dj.get("publicFrontendPaths", []))
except Exception:
    ok("PUBLIC-DEPLOY.json válido", False, "Não foi possível ler JSON.")

# Cache bust
for rel in ["recuperacao/index.html", "recuperacao/admin.html"]:
    s = text(rel)
    ok(f"{rel}: cache-bust do hotfix", "14.10.8.96-hf-recovery1" in s)

failed = [c for c in checks if not c[1]]
for name, status, detail in checks:
    print(("PASS" if status else "FAIL"), "-", name, (f"— {detail}" if detail else ""))

print(f"\nResultado: {len(checks)-len(failed)}/{len(checks)} PASS")
if failed:
    sys.exit(1)
