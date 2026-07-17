# Deploy — evuy

Todo self-hosted en el VPS de Hostinger con EasyPanel. La única dependencia externa son las APIs de Claude y OpenAI (stateless, no guardan tus datos).

---

## Día 1 — Secuencia

### 1. Dominio

**El `.uy` no se compra en Hostinger.** Va por [nic.com.uy](https://nic.com.uy) (ANTEL), tarda unos días y pide documentación. **Arrancá el trámite hoy.**

Mientras tanto, comprá el `.com` en Hostinger para no frenar el deploy. Después apuntás los dos.

Poné **Cloudflare gratis** por delante: te da CDN, cache de imágenes y esconde la IP del VPS. Sin eso, cada foto de un listing le pega directo a tu servidor.

### 2. Variables de entorno

En EasyPanel → Project → Environment. **Nada de esto va al repo.**

```env
POSTGRES_USER=evuy
POSTGRES_PASSWORD=          # openssl rand -base64 32
POSTGRES_DB=evuy
S3_ACCESS_KEY=              # openssl rand -hex 16
S3_SECRET_KEY=              # openssl rand -base64 32
AUTH_SECRET=                # openssl rand -base64 32
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
RESEND_API_KEY=
SITE_URL=https://autoelectrico.uy
CDN_DOMAIN=cdn.autoelectrico.uy
MAIL_FROM=autoelectrico.uy <hola@autoelectrico.uy>
MAIL_REPLY_TO=             # tu mail real: las respuestas son el roadmap
```

Generá los secretos ahora:
```bash
openssl rand -base64 32   # una vez por cada secreto
```

### 3. Servicios en EasyPanel

En este orden:

| # | Servicio | Imagen | Nota |
|---|---|---|---|
| 1 | `postgres` | `pgvector/pgvector:pg16` | **No** la imagen oficial de Postgres |
| 2 | `redis` | `redis:7-alpine` | |
| 3 | `minio` | `minio/minio` | |
| 4 | `web` | build desde GitHub | target `web` |
| 5 | `worker` | build desde GitHub | target `worker` |

**Ninguno expone puertos salvo `web`.** Se hablan por nombre en la red interna: `postgres:5432`, `redis:6379`, `minio:9000`.

Para `postgres`, en Advanced → Command, pegá el tuning del `docker-compose.yml`. El `maintenance_work_mem=512MB` no es opcional: sin eso, construir el índice `ivfflat` mata el proceso.

### 4. Migraciones

```bash
# Consola del contenedor postgres
psql -U evuy -d evuy -f /docker-entrypoint-initdb.d/0001_init.sql
psql -U evuy -d evuy -f /docker-entrypoint-initdb.d/0002_seed.sql
```

Verificá:
```sql
\dt                          -- 15 tablas
SELECT extname FROM pg_extension;   -- vector, pg_trgm, unaccent, pgcrypto
SELECT slug, status FROM models;    -- 5 modelos en draft
```

### 5. MinIO — buckets

Consola en `:9001`. Crear:

| Bucket | Acceso | Para |
|---|---|---|
| `manuals` | privado | PDFs de manuales |
| `listings` | público | fotos de vehículos |
| `creators` | público | avatares |

Poné un subdominio con SSL apuntando a MinIO (`cdn.autoelectrico.uy`) y Cloudflare adelante.

### 6. Backup — **hoy, con la base vacía**

Se olvida después. Y cuando lo necesites, no vas a tener tiempo de aprenderlo.

```bash
# En el VPS
mc alias set remote https://s3.us-west-000.backblazeb2.com KEY SECRET
mc mb remote/evuy-backups

cp deploy/backup.sh /opt/evuy/
chmod +x /opt/evuy/backup.sh

crontab -e
# 30 4 * * * /opt/evuy/backup.sh >> /var/log/evuy-backup.log 2>&1
```

**Probá el restore ahora**, con la base vacía:
```bash
./backup.sh
./restore.sh /var/backups/evuy/db-*.dump
```

Un backup que nunca restauraste es una suposición, no un respaldo.

### 7. Verificación

```bash
curl https://autoelectrico.uy/api/health
```

```json
{ "status": "ok", "checks": { "db": { "ok": true }, "cache": { "ok": true } } }
```

- `"ok"` → todo bien
- `"degraded"` → Redis caído: se pierde cache y rate limit, el sitio anda
- `"down"` → Postgres caído: HTTP 503

Conectalo a **Uptime Kuma** (gratis, corre en el mismo VPS) apuntando a `/api/health`.

---

## Checklist Día 1

- [ ] Trámite `.uy` iniciado en nic.com.uy
- [ ] `.com` de puente comprado
- [ ] Cloudflare configurado
- [ ] Secretos generados y cargados en EasyPanel
- [ ] `postgres` (pgvector) corriendo con el tuning
- [ ] `redis` corriendo
- [ ] `minio` con los 3 buckets
- [ ] Migraciones aplicadas — 15 tablas, 4 extensiones
- [ ] `web` desplegado desde GitHub, `/api/health` en `"ok"`
- [ ] `worker` desplegado
- [ ] Cron de backup activo
- [ ] **Restore probado**

---

## Operación

### Ingestar un manual
```bash
# Subir a MinIO → insertar en model_docs → encolar
docker exec -it evuy_worker_1 node --experimental-strip-types -e "
  import('./worker/index.ts').then(m => m.enqueueIngest('DOC_UUID'))
"
```

El worker te loguea el costo real. El manual del EX5 completo son centavos.

### Después de cargar los primeros manuales

El índice `ivfflat` se creó con la tabla vacía: el clustering no sirve. Recrealo:
```sql
REINDEX INDEX idx_chunks_embedding;
```

### Actualizar un precio
El trigger llena `price_updated_at` y `price_history` solo. Después invalidá el cache:
```bash
docker exec -it evuy_web_1 node -e "
  import('./lib/rag/cache.js').then(c => c.invalidateModel('geely-ex5-2026'))
"
```

### Publicar un modelo
`publishModel()` no deja si falta un campo Tier 1. Para ver qué falta:
```sql
SELECT slug, specs_json->'data_gaps' FROM models WHERE status = 'draft';
```

---

## Lo que te va a doler

**El VPS es tuyo.** Si se cae un domingo, el que se levanta sos vos. A cambio: costo marginal cero y los datos en tu infra.

**Los backups son tuyos.** Backblaze B2 sale ~USD 6/TB/mes. Un backup en el mismo VPS no es un backup.

**Los mails son irreemplazables.** Un modelo lo recargás en una tarde. 500 suscriptores que costaron meses, no. Por eso el script valida el dump antes de subirlo y te muestra los conteos: si mañana ves 0 subs donde ayer había 200, te enterás por ahí.

---

## Migrar a Supabase (si algún día)

Es Postgres. `pg_dump` y listo. No estás atado a nada.
