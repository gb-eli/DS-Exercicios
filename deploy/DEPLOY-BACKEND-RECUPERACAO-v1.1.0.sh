#!/usr/bin/env bash
set -euo pipefail
PROJECT_REF="iresvqwyaqotghjssncg"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SOURCE="$ROOT/core/edge-functions/recovery-exam"
TEMP="$(mktemp -d)"
trap 'rm -rf "$TEMP"' EXIT
cat <<'TXT'
=== Recuperação 2DS Sub v1.1.0 ===
Banco:
- aplique 059 e depois 060;
- a migration 058 pertence à Central de Apoio e deve permanecer antes delas.
Não reaplique migrations que já constem no histórico do projeto.
TXT
mkdir -p "$TEMP/supabase/functions/recovery-exam"
cp "$SOURCE/index.ts" "$SOURCE/catalog.ts" "$SOURCE/review-notes.ts" "$SOURCE/session-guard.ts" "$TEMP/supabase/functions/recovery-exam/"
cd "$TEMP"
npx --yes supabase@latest functions deploy recovery-exam --project-ref "$PROJECT_REF"
echo "Edge Function recovery-exam publicada."
echo "Publique apenas recuperacao/ e os atalhos professor/ e sistemas/.... O gabarito deve permanecer somente no backend."

