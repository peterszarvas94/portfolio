#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

REMOTE_HOST="${REMOTE_HOST:-peti@shared}"
REMOTE_PATH="${REMOTE_PATH:-/var/www/peterszarvas.hu}"
RSYNC_PATH="${RSYNC_PATH:-sudo rsync}"

cd "$ROOT_DIR"

echo "> Running: build"
mise run build 2>&1 | sed 's/^/  /'

echo "> Running: deploy"
rsync -az --delete --progress \
  --rsync-path="$RSYNC_PATH" \
  "${ROOT_DIR}/public/" \
  "${REMOTE_HOST}:${REMOTE_PATH}/" | grep --line-buffered -v '^\s*$' | sed 's/^/  /'
echo "> Site it deployed: https://peterszarvas.hu"
