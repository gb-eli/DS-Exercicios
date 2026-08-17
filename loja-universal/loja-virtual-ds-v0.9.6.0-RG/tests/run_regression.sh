#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
python tests/run_regression.py
