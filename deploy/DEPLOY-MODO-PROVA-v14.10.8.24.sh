#!/usr/bin/env bash
set -euo pipefail
PROJECT_REF='iresvqwyaqotghjssncg'
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SOURCE="$ROOT/core/edge-functions/practical-exam"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
command -v supabase >/dev/null || { echo 'Supabase CLI nao encontrado.' >&2; exit 1; }
mkdir -p "$TMP/supabase/functions/practical-exam"
cp "$SOURCE/index.ts" "$SOURCE/session-guard.ts" "$TMP/supabase/functions/practical-exam/"
printf 'project_id = "%s"\n' "$PROJECT_REF" > "$TMP/supabase/config.toml"
cd "$TMP"
supabase functions deploy practical-exam --project-ref "$PROJECT_REF"
echo 'Edge Function practical-exam publicada com verificacao JWT.'
echo 'O banco P10926 ja foi aplicado em producao; publique agora o frontend desta versao.'
