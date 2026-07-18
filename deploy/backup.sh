#!/usr/bin/env bash
# ============================================================
# autoelectrico (evuy) — Backup
#
# Con Supabase esto era gratis. Ahora es tuyo, y si no lo hacés
# un día perdés todo: el catálogo, los mails, los leads.
#
# Los mails son irreemplazables. Un modelo lo volvés a cargar en
# una tarde; 500 suscriptores que costaron meses, no.
#
# ADAPTADO A EASYPANEL / DOCKER SWARM:
# - El host NO alcanza la red interna del proyecto, así que
#   mc corre dentro de un contenedor efímero en la red
#   'easypanel-autoelectrico'.
# - MinIO se accede por IP interna (getent), porque el guion bajo
#   del hostname rompe mc y la IP cambia en cada redeploy.
# - El dump de Postgres se hace con 'docker exec' (eso sí anda
#   desde el host).
#
# Cron (crontab -e en el VPS):
# 30 4 * * * /opt/autoelectrico/deploy/backup.sh >> /var/log/autoelectrico-backup.log 2>&1
# ============================================================

set -euo pipefail

STAMP="$(date +%F_%H%M)"
DIR="/var/backups/evuy"
KEEP_DAILY=7
KEEP_WEEKLY=4

# --- Red y storage ---
NETWORK="${NETWORK:-easypanel-autoelectrico}"
MC_IMAGE="minio/mc:latest"
MINIO_HOST="${MINIO_HOST:-autoelectrico_minio}"
MINIO_PORT="${MINIO_PORT:-9000}"
MINIO_USER="${MINIO_USER:-aeuy_admin}"
MINIO_PASS="${MINIO_PASS:?falta MINIO_PASS}"

# --- Backblaze ---
B2_ENDPOINT="${B2_ENDPOINT:-https://s3.us-east-005.backblazeb2.com}"
B2_KEY="${B2_KEY:?falta B2_KEY}"
B2_SECRET="${B2_SECRET:?falta B2_SECRET}"
B2_BUCKET="${B2_BUCKET:-autoelectrico-backups}"

# --- Postgres ---
PG_CONTAINER="${PG_CONTAINER:-$(docker ps --filter name=autoelectrico_postgres --format '{{.Names}}' | head -n1)}"
PG_USER="${POSTGRES_USER:-evuy}"
PG_DB="${POSTGRES_DB:-evuy}"

log() { echo "[$(date '+%F %T')] $*"; }
fail() { log "ERROR: $*"; exit 1; }

mkdir -p "$DIR"

[ -n "$PG_CONTAINER" ] || fail "no encuentro el contenedor de postgres"

# ---------- 1. Dump ----------
log "dump de $PG_DB (contenedor $PG_CONTAINER)"
DUMP="$DIR/db-$STAMP.dump"

docker exec "$PG_CONTAINER" pg_dump \
  -U "$PG_USER" -d "$PG_DB" \
  --format=custom --compress=6 \
  > "$DUMP" || fail "pg_dump falló"

SIZE=$(stat -c%s "$DUMP")
log "dump: $((SIZE / 1024)) KB"
[ "$SIZE" -lt 10240 ] && fail "dump sospechosamente chico ($SIZE bytes)"

# ---------- 2. Verificar que se puede restaurar ----------
log "verificando integridad"
docker exec -i "$PG_CONTAINER" pg_restore --list < "$DUMP" > /dev/null \
  || fail "el dump está corrupto — NO se sube"

TABLES=$(docker exec -i "$PG_CONTAINER" pg_restore --list < "$DUMP" | grep -c "TABLE DATA" || true)
log "tablas con datos: $TABLES"
[ "$TABLES" -lt 5 ] && fail "muy pocas tablas ($TABLES) — algo anda mal"

# ---------- 3. Resolver IP interna de MinIO ----------
# El host no resuelve el hostname del contenedor; lo hacemos
# desde adentro de la red con getent (acepta el guion bajo).
log "resolviendo IP de MinIO"
MINIO_IP=$(docker run --rm --network "$NETWORK" --entrypoint sh "$MC_IMAGE" \
  -c "getent hosts $MINIO_HOST | awk '{print \$1; exit}'") || true
MINIO_IP=$(echo "$MINIO_IP" | tr -d '[:space:]')
[ -n "$MINIO_IP" ] || fail "no pude resolver la IP de MinIO"
log "MinIO IP: $MINIO_IP"

# ---------- 4. Mirror de storage + subir dump (todo dentro de mc) ----------
# Montamos $DIR en el contenedor mc para que pueda subir el dump.
log "sincronizando storage y subiendo dump a Backblaze"
docker run --rm --network "$NETWORK" \
  -v "$DIR:/backups" \
  --entrypoint sh "$MC_IMAGE" -c "
    set -e
    mc alias set local http://$MINIO_IP:$MINIO_PORT '$MINIO_USER' '$MINIO_PASS' >/dev/null
    mc alias set remote '$B2_ENDPOINT' '$B2_KEY' '$B2_SECRET' >/dev/null

    # storage (los buckets pueden no existir aún; no es fatal)
    mc mirror --overwrite --quiet local/manuals  remote/$B2_BUCKET/storage/manuals  || echo 'aviso: sin bucket manuals'
    mc mirror --overwrite --quiet local/listings remote/$B2_BUCKET/storage/listings || echo 'aviso: sin bucket listings'

    # dump
    mc cp --quiet /backups/db-$STAMP.dump remote/$B2_BUCKET/db/db-$STAMP.dump

    # copia semanal (domingo)
    if [ \"$(date +%u)\" = '7' ]; then
      mc cp --quiet /backups/db-$STAMP.dump remote/$B2_BUCKET/weekly/db-$STAMP.dump
      echo 'copia semanal guardada'
    fi

    # retención remota
    mc rm --recursive --force --quiet --older-than ${KEEP_DAILY}d           remote/$B2_BUCKET/db/     2>/dev/null || true
    mc rm --recursive --force --quiet --older-than $((KEEP_WEEKLY * 7))d     remote/$B2_BUCKET/weekly/ 2>/dev/null || true
  " || fail "falló la subida a Backblaze"

# ---------- 5. Retención local ----------
log "limpiando locales (>$KEEP_DAILY días)"
find "$DIR" -name 'db-*.dump' -mtime +$KEEP_DAILY -delete

log "✓ backup completo: db-$STAMP.dump"

# ---------- 6. Conteos de control ----------
docker exec "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -t -A -F' | ' -c "
  SELECT
    (SELECT count(*) FROM models)      AS modelos,
    (SELECT count(*) FROM subscribers) AS subs,
    (SELECT count(*) FROM leads)       AS leads,
    (SELECT count(*) FROM listings)    AS listings,
    (SELECT count(*) FROM doc_chunks)  AS chunks;
" | while read -r line; do log "conteos: $line"; done
