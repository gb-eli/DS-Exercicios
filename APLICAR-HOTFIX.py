from pathlib import Path
import json, re, sys

ROOT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd().resolve()
CACHE = "14.10.8.96-hf-recovery1"
changes = []
warnings = []

def load(rel):
    p = ROOT / rel
    if not p.exists():
        warnings.append(f"AUSENTE: {rel}")
        return None, p
    return p.read_text(encoding="utf-8"), p

def save(p, rel, old, new):
    if old == new:
        return
    p.write_text(new, encoding="utf-8")
    changes.append(rel)

def replace_text(rel, old, new):
    text, p = load(rel)
    if text is None:
        return
    if new in text:
        return
    if old not in text:
        warnings.append(f"PADRÃO NÃO ENCONTRADO: {rel}")
        return
    save(p, rel, text, text.replace(old, new))

# 1) Correção estrutural do blank screen da Recuperação.
for rel in [
    "recuperacao/assets/student.js",
    "recuperacao/assets/admin.js",
    "payload/recuperacao/assets/student.js",
    "payload/recuperacao/assets/admin.js",
]:
    replace_text(
        rel,
        "$('login-form').addEventListener('submit',login);",
        "$('login-form')?.addEventListener('submit',login);",
    )

# 2) Título docente não deve ficar preso ao 2DS Sub.
for rel in [
    "recuperacao/assets/admin.js",
    "payload/recuperacao/assets/admin.js",
]:
    replace_text(
        rel,
        "$('admin-title').textContent='Recuperações 2DS Sub';",
        "$('admin-title').textContent='Retomada & Recuperação DS';",
    )

# 3) Cache-bust da superfície de Recuperação para forçar o navegador a buscar o hotfix.
for rel in [
    "recuperacao/index.html",
    "recuperacao/admin.html",
    "payload/recuperacao/index.html",
    "payload/recuperacao/admin.html",
]:
    text, p = load(rel)
    if text is None:
        continue
    new = re.sub(r"(?<=\?v=)[^\"'<>]+", CACHE, text)
    save(p, rel, text, new)

# 4) Configuração operacional da prova de hoje: 5 min lobby + 30 min operação.
for rel in ["prova/assets/admin.js", "payload/prova/assets/admin.js"]:
    text, p = load(rel)
    if text is None:
        continue
    new = text
    new = new.replace(
        'id="create-lobby-duration" type="number" min="5" max="60" value="15"',
        'id="create-lobby-duration" type="number" min="5" max="60" value="5"',
    )
    new = new.replace(
        'id="create-duration" type="number" min="10" max="180" value="50"',
        'id="create-duration" type="number" min="10" max="180" value="30"',
    )
    save(p, rel, text, new)

# 5) O diretório prova/ precisa fazer parte do frontend público.
for rel in ["PUBLIC-DEPLOY.json", "payload/PUBLIC-DEPLOY.json"]:
    text, p = load(rel)
    if text is None:
        continue
    try:
        data = json.loads(text)
    except Exception as exc:
        warnings.append(f"JSON INVÁLIDO: {rel}: {exc}")
        continue
    paths = data.setdefault("publicFrontendPaths", [])
    if "prova/" not in paths:
        try:
            idx = paths.index("professor/") + 1
        except ValueError:
            idx = len(paths)
        paths.insert(idx, "prova/")
        data["hotfix"] = "F94-HF-2026-09-03-prova-recuperacao"
        data["hotfixDate"] = "2026-09-03"
        new = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
        save(p, rel, text, new)

print(f"Raiz: {ROOT}")
if changes:
    print("ALTERADOS:")
    for rel in changes:
        print(" -", rel)
else:
    print("Nenhuma alteração necessária; o hotfix pode já estar aplicado.")

if warnings:
    print("\nAVISOS:")
    for w in warnings:
        print(" -", w)

print("\nExecute VALIDAR-HOTFIX.py antes do deploy.")
