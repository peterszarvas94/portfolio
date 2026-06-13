#!/usr/bin/env bash
set -euo pipefail

CSS_DIR="theme/static"
CSS_FILE="generated.css"
CSS_PATH="$CSS_DIR/$CSS_FILE"
MANIFEST="config/asset-manifest.json"

if [ ! -f "$CSS_PATH" ]; then
  echo "❌ $CSS_PATH not found"
  exit 1
fi

HASH=$(shasum -a 256 "$CSS_PATH" | head -c 16)
HASHED_FILE="generated.${HASH}.css"

cp "$CSS_PATH" "$CSS_DIR/$HASHED_FILE"

echo "{\"$CSS_FILE\":{\"file\":\"$HASHED_FILE\"}}" > "$MANIFEST"

echo "✅ $CSS_FILE -> $HASHED_FILE"
