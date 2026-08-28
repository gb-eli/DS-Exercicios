#!/usr/bin/env bash
set -euo pipefail
PROJECT_REF="iresvqwyaqotghjssncg"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SOURCE="$ROOT/core/edge-functions/practical-exam"
TEMP="$(mktemp -d)"
trap 'rm -rf "$TEMP"' EXIT
mkdir -p "$TEMP/supabase/functions/practical-exam"
cp "$SOURCE/index.ts" "$SOURCE/session-guard.ts" "$TEMP/supabase/functions/practical-exam/"
cd "$TEMP"
npx --yes supabase@latest functions deploy practical-exam --project-ref "$PROJECT_REF"
echo "Backend v14.10.8.27 publicado. Agora publique/sobreponha a pasta prova/."
