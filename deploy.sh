#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

REMOTE_HOST="${REMOTE_HOST:-peti@shared}"
REMOTE_PATH="${REMOTE_PATH:-/var/www/peterszarvas.hu}"
RSYNC_PATH="${RSYNC_PATH:-sudo rsync}"

cd "$ROOT_DIR"

mise run gen

RSYNC_PROGRESS_FLAGS=(--progress)
if rsync --version 2>/dev/null | grep -q 'version 3'; then
  RSYNC_PROGRESS_FLAGS=(--info=progress2)
fi

rsync -az --delete "${RSYNC_PROGRESS_FLAGS[@]}" \
  --rsync-path="$RSYNC_PATH" \
  "${ROOT_DIR}/public/" \
  "${REMOTE_HOST}:${REMOTE_PATH}/"

echo "Live: https://peterszarvas.hu/"
