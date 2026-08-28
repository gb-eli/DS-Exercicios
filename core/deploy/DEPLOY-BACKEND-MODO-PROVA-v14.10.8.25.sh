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
echo "Publicando practical-exam v14.10.8.25 (JWT obrigatório)..."
npx --yes supabase@latest functions deploy practical-exam --project-ref "$PROJECT_REF"
echo "Backend publicado. A migration P10927 já foi aplicada em produção."
echo "Agora publique/sobreponha a pasta prova/ na hospedagem atual."
