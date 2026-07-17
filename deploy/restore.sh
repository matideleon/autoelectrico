#!/usr/bin/env bash
# ============================================================
# evuy — Restore
#
# PROBALO EL DÍA 1, con la base vacía. Un backup que nunca
# restauraste es una suposición, no un respaldo. El día que lo
# necesites de verdad vas a estar nervioso y sin tiempo de
# aprender la sintaxis.
#
# Uso:
#   ./restore.sh /var/backups/evuy/db-2026-07-16_0430.dump
#   ./restore.sh remote/evuy-backups/db/db-2026-07-16_0430.dump
#
# Restaura a una base TEMPORAL primero y te muestra los conteos.
# Recién si le das el ok, pisa la real.
# ============================================================

set -euo pipefail

SRC="${1:-}"
PG_CONTAINER="${PG_CONTAINER:-evuy_postgres_1}"
PG_USER="${POSTGRES_USER:-evuy}"
PG_DB="${POSTGRES_DB:-evuy}"
TMP_DB="${PG_DB}_restore_test"

log() { echo "[$(date '+%F %T')] $*"; }
fail() { log "ERROR: $*"; exit 1; }

[ -z "$SRC" ] && fail "uso: ./restore.sh <archivo.dump>"

# Bajar de remoto si hace falta
LOCAL="$SRC"
if [[ "$SRC" == remote/* ]]; then
  LOCAL="/tmp/$(basename "$SRC")"
  log "bajando $SRC"
  mc cp --quiet "$SRC" "$LOCAL" || fail "no se pudo bajar"
fi

[ -f "$LOCAL" ] || fail "no existe: $LOCAL"

log "verificando el dump"
docker exec -i "$PG_CONTAINER" pg_restore --list < "$LOCAL" > /dev/null \
  || fail "dump corrupto"

# ---------- Restore a base temporal ----------
log "restaurando a $TMP_DB (temporal)"
docker exec "$PG_CONTAINER" psql -U "$PG_USER" -d postgres \
  -c "DROP DATABASE IF EXISTS $TMP_DB;" -c "CREATE DATABASE $TMP_DB;" > /dev/null

docker exec -i "$PG_CONTAINER" pg_restore \
  -U "$PG_USER" -d "$TMP_DB" --no-owner --no-privileges \
  < "$LOCAL" 2>&1 | grep -v "^pg_restore: warning" || true

log "conteos del backup:"
docker exec "$PG_CONTAINER" psql -U "$PG_USER" -d "$TMP_DB" -c "
  SELECT 'modelos' AS tabla, count(*) FROM models
  UNION ALL SELECT 'subscribers', count(*) FROM subscribers
  UNION ALL SELECT 'leads', count(*) FROM leads
  UNION ALL SELECT 'listings', count(*) FROM listings
  UNION ALL SELECT 'doc_chunks', count(*) FROM doc_chunks
  ORDER BY 1;
"

# ---------- Confirmación ----------
echo
log "El backup se restauró bien en $TMP_DB."
read -rp "¿Pisar la base REAL ($PG_DB) con esto? Escribí 'si': " ANSWER

if [ "$ANSWER" != "si" ]; then
  log "cancelado. $TMP_DB queda para que la inspecciones."
  log "para borrarla: docker exec $PG_CONTAINER psql -U $PG_USER -d postgres -c 'DROP DATABASE $TMP_DB;'"
  exit 0
fi

# Backup de seguridad de lo que estás por pisar
SAFETY="/tmp/pre-restore-$(date +%F_%H%M).dump"
log "guardando el estado actual en $SAFETY"
docker exec "$PG_CONTAINER" pg_dump -U "$PG_USER" -d "$PG_DB" -Fc > "$SAFETY"

log "restaurando sobre $PG_DB"
docker exec "$PG_CONTAINER" psql -U "$PG_USER" -d postgres \
  -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='$PG_DB' AND pid<>pg_backend_pid();" > /dev/null
docker exec "$PG_CONTAINER" psql -U "$PG_USER" -d postgres \
  -c "DROP DATABASE $PG_DB;" -c "CREATE DATABASE $PG_DB;" > /dev/null

docker exec -i "$PG_CONTAINER" pg_restore \
  -U "$PG_USER" -d "$PG_DB" --no-owner --no-privileges < "$LOCAL" 2>&1 \
  | grep -v "^pg_restore: warning" || true

docker exec "$PG_CONTAINER" psql -U "$PG_USER" -d postgres \
  -c "DROP DATABASE $TMP_DB;" > /dev/null

log "✓ restaurado. El estado anterior quedó en $SAFETY por si acaso."
log "Reiniciá web y worker: docker compose restart web worker"
