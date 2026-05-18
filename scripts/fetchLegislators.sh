#!/usr/bin/env bash
# Download the open `unitedstates/congress-legislators` source data used by
# scripts/legislatorsToDataset.mjs. Output goes to .legis/ (gitignored).
set -euo pipefail
base="https://raw.githubusercontent.com/unitedstates/congress-legislators/main"
mkdir -p "$(dirname "$0")/../.legis"
cd "$(dirname "$0")/../.legis"
for f in legislators-current.yaml legislators-historical.yaml executive.yaml; do
  echo "Fetching $f ..."
  curl -fsSL -o "$f" "$base/$f"
done
echo "Done. Now run: node scripts/legislatorsToDataset.mjs"
