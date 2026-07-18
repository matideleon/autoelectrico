#!/usr/bin/env bash
# ============================================================
# evuy — Backup
#
# Con Supabase esto era gratis. Ahora es tuyo, y si no lo hacés
# un día perdés todo: el catálogo, los mails, los leads.
#
# Los mails son irreemplazables. Un modelo lo volvés a cargar en
# una tarde; 500 suscriptores que costaron meses, no.
#
# Cron (crontab -e en el VPS):
#   30 4 * * * /opt/evuy/deploy/backup.sh >> /var/log/evuy-backup.log 2>&1
#
# Requiere: mc (MinIO client) configurado con el alias `remote`.
#   mc alias set remote https://s3.us-west-000.backblazeb2.com KEY SECRET
# ============================================================

set -euo pipefail

STAMP="$(date +%F_%H%M)"
DIR="/var/backups/evuy"
KEEP_DAILY=7
KEEP_WEEKLY=4
REMOTE="${BACKUP_REMOTE:-remote/evuy-backups}"

PG_CONTAINER="${PG_CONTAINER:-$(docker ps --filter name=autoelectrico_postgres --format '{{.Names}}' | head -n1)}"
PG_USER="${POSTGRES_USER:-evuy}"
PG_DB="${POSTGRES_DB:-evuy}"

log() { echo "[$(date '+%F %T')] $*"; }
fail() { log "ERROR: $*"; exit 1; }

mkdir -p "$DIR"

# ---------- 1. Dump ----------
log "dump de $PG_DB"
DUMP="$DIR/db-$STAMP.dump"

docker exec "$PG_CONTAINER" pg_dump \
  -U "$PG_USER" -d "$PG_DB" \
  --format=custom --compress=6 \
  > "$DUMP" || fail "pg_dump falló"

SIZE=$(stat -c%s "$DUMP")
log "dump: $((SIZE / 1024)) KB"

# Un dump de menos de 10 KB es un dump vacío: no lo subas
# pisando el bueno de ayer.
[ "$SIZE" -lt 10240 ] && fail "dump sospechosamente chico ($SIZE bytes)"

# ---------- 2. Verificar que se puede restaurar ----------
# Un backup no verificado no existe. pg_restore --list falla si
# el archivo está corrupto, y eso lo querés saber HOY, no el día
# que lo necesites.
log "verificando integridad"
docker exec -i "$PG_CONTAINER" pg_restore --list < "$DUMP" > /dev/null \
  || fail "el dump está corrupto — NO se sube"

TABLES=$(docker exec -i "$PG_CONTAINER" pg_restore --list < "$DUMP" | grep -c "TABLE DATA" || true)
log "tablas con datos: $TABLES"
[ "$TABLES" -lt 5 ] && fail "muy pocas tablas ($TABLES) — algo anda mal"

# ---------- 3. Storage (manuales y fotos) ----------
log "sincronizando MinIO"
mc mirror --overwrite --quiet \
  "local/manuals" "$REMOTE/storage/manuals" || log "aviso: falló el mirror de manuals"
mc mirror --overwrite --quiet \
  "local/listings" "$REMOTE/storage/listings" || log "aviso: falló el mirror de listings"

# ---------- 4. Subir el dump ----------
# Fuera del VPS. Un backup en el mismo servidor no es un backup:
# si se muere el disco, se mueren los dos.
log "subiendo a $REMOTE"
mc cp --quiet "$DUMP" "$REMOTE/db/db-$STAMP.dump" || fail "no se pudo subir"

# El del domingo se guarda como semanal
if [ "$(date +%u)" = "7" ]; then
  mc cp --quiet "$DUMP" "$REMOTE/weekly/db-$STAMP.dump" || log "aviso: falló copia semanal"
  log "copia semanal guardada"
fi

# ---------- 5. Retención ----------
log "limpiando locales (>$KEEP_DAILY días)"
find "$DIR" -name 'db-*.dump' -mtime +$KEEP_DAILY -delete

mc rm --recursive --force --quiet \
  --older-than "${KEEP_DAILY}d" "$REMOTE/db/" 2>/dev/null || true
mc rm --recursive --force --quiet \
  --older-than "$((KEEP_WEEKLY * 7))d" "$REMOTE/weekly/" 2>/dev/null || true

log "✓ backup completo: db-$STAMP.dump"

# ---------- 6. Conteos de control ----------
# Si mañana ves 0 suscriptores donde ayer había 200, te enterás
# por acá y no por un cliente.
docker exec "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -t -A -F' | ' -c "
  SELECT
    (SELECT count(*) FROM models)           AS modelos,
    (SELECT count(*) FROM subscribers)      AS subs,
    (SELECT count(*) FROM leads)            AS leads,
    (SELECT count(*) FROM listings)         AS listings,
    (SELECT count(*) FROM doc_chunks)       AS chunks;
" | while read -r line; do log "conteos: $line"; done
