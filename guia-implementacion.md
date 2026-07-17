# autoelectrico.uy — Guía de implementación

Paso a paso para dejar el proyecto funcionando en tu VPS de Hostinger con EasyPanel.

Tiempo estimado: 2-3 horas si no hay contratiempos.

---

## Prerequisitos

Antes de empezar, necesitás tener:

- VPS de Hostinger con EasyPanel instalado
- Acceso SSH al VPS
- Dominio `autoelectrico.uy` apuntando al VPS (DNS configurado)
- Cuenta de GitHub con el repo `autoelectrico-uy` subido
- Las siguientes cuentas creadas (todas tienen plan gratuito):
  - Anthropic (API key para el chatbot)
  - OpenAI (API key para embeddings)
  - Resend (API key para mails)
  - Cloudflare (opcional pero recomendado, para CDN y protección)
  - Backblaze B2 (para backups fuera del VPS)

---

## Paso 1 — Generar los secretos

Conectate por SSH al VPS y generá todos los secretos que vas a necesitar. Guardalos en un archivo temporal FUERA del repo (borrálo cuando termines):

```bash
ssh root@TU_IP_DEL_VPS

cat > /tmp/secretos.txt << 'EOF'
POSTGRES_PASSWORD: (pegar acá)
AUTH_SECRET: (pegar acá)
S3_ACCESS_KEY: (pegar acá)
S3_SECRET_KEY: (pegar acá)
EOF

# Generar cada uno:
echo "POSTGRES_PASSWORD:" $(openssl rand -base64 32)
echo "AUTH_SECRET:" $(openssl rand -base64 32)
echo "S3_ACCESS_KEY:" $(openssl rand -hex 16)
echo "S3_SECRET_KEY:" $(openssl rand -base64 32)
```

Copiá cada valor a `/tmp/secretos.txt` y tenélo a mano para los pasos siguientes.

---

## Paso 2 — Crear el proyecto en EasyPanel

1. Entrá a EasyPanel (generalmente `https://TU_IP:3000` o el dominio que le hayas puesto)
2. Click en **+ New Project**
3. Nombre: `autoelectrico`
4. Click en **Create**

A partir de acá, todos los servicios se crean DENTRO de este proyecto.

---

## Paso 3 — Servicio: Postgres (pgvector)

Este es el primero porque todo lo demás depende de él.

1. Dentro del proyecto → **+ New Service** → **Database** → **Postgres**
2. **ANTES de crear**, cambiá la imagen:
   - Imagen: `pgvector/pgvector:pg16`
   - Esto es crítico. La imagen oficial de Postgres NO trae la extensión de vectores y compilarla después es un dolor.
3. Nombre del servicio: `postgres`
4. Environment variables:
   ```
   POSTGRES_USER=evuy
   POSTGRES_PASSWORD=TU_POSTGRES_PASSWORD
   POSTGRES_DB=evuy
   LANG=es_UY.utf8
   ```
5. **Volumes**: verificá que tenga un volumen persistente montado en `/var/lib/postgresql/data`
6. **Advanced → Command** (si EasyPanel te deja configurarlo):
   ```
   postgres -c shared_buffers=1GB -c effective_cache_size=3GB -c maintenance_work_mem=512MB -c work_mem=32MB -c max_connections=100
   ```
   Si no hay campo de comando, se configura después.
7. **Networking**: NO expongas el puerto 5432 al exterior. Solo red interna.
8. Click **Deploy**
9. Esperá a que el servicio esté en verde.

**Verificar que funciona:**

En EasyPanel, entrá a la **consola** del contenedor postgres y ejecutá:

```bash
psql -U evuy -d evuy -c "SELECT version();"
```

Tiene que devolver algo con `PostgreSQL 16`.

---

## Paso 4 — Crear la base de datos

Desde la misma consola del contenedor postgres:

```bash
# Crear las extensiones
psql -U evuy -d evuy -c "
  CREATE EXTENSION IF NOT EXISTS pgcrypto;
  CREATE EXTENSION IF NOT EXISTS vector;
  CREATE EXTENSION IF NOT EXISTS pg_trgm;
  CREATE EXTENSION IF NOT EXISTS unaccent;
"
```

Verificá que las 4 se crearon:

```bash
psql -U evuy -d evuy -c "SELECT extname FROM pg_extension;"
```

Debe mostrar: `plpgsql`, `pgcrypto`, `vector`, `pg_trgm`, `unaccent`.

Ahora aplicá las migraciones. Tenés dos opciones:

**Opción A — Copiar los archivos SQL al contenedor:**

Desde tu máquina local:

```bash
# Copiar los SQL al VPS
scp deploy/migrations/0001_init.sql deploy/migrations/0002_seed.sql root@TU_IP:/tmp/

# En el VPS, copiar al contenedor
docker cp /tmp/0001_init.sql NOMBRE_CONTENEDOR_POSTGRES:/tmp/
docker cp /tmp/0002_seed.sql NOMBRE_CONTENEDOR_POSTGRES:/tmp/

# Ejecutar
docker exec -it NOMBRE_CONTENEDOR_POSTGRES psql -U evuy -d evuy -f /tmp/0001_init.sql
docker exec -it NOMBRE_CONTENEDOR_POSTGRES psql -U evuy -d evuy -f /tmp/0002_seed.sql
```

**Opción B — Pegar el SQL directo en la consola:**

Abrí la consola del contenedor en EasyPanel, entrá a `psql -U evuy -d evuy` y pegá el contenido de `0001_init.sql`, después el de `0002_seed.sql`.

**Verificar que funcionó:**

```bash
psql -U evuy -d evuy -c "\dt"
```

Deben aparecer **15 tablas**: `models`, `listings`, `users`, `leads`, `subscribers`, `doc_chunks`, etc.

```bash
psql -U evuy -d evuy -c "SELECT slug, brand, model, status FROM models;"
```

Deben aparecer 5 modelos en estado `draft`.

---

## Paso 5 — Servicio: Redis

1. Dentro del proyecto → **+ New Service** → **Database** → **Redis**
2. Imagen: `redis:7-alpine` (o la que traiga por defecto)
3. Nombre: `redis`
4. **Advanced → Command** (si te deja):
   ```
   redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru --appendonly yes
   ```
5. **Volumes**: volumen persistente en `/data`
6. **Networking**: NO exponer al exterior. Solo red interna.
7. Click **Deploy**

**Verificar:**

Consola del contenedor → `redis-cli ping` → debe responder `PONG`.

---

## Paso 6 — Servicio: MinIO (Storage)

1. **+ New Service** → **App** (no database)
2. Imagen: `minio/minio`
3. Nombre: `minio`
4. **Advanced → Command**:
   ```
   server /data --console-address :9001
   ```
5. Environment:
   ```
   MINIO_ROOT_USER=TU_S3_ACCESS_KEY
   MINIO_ROOT_PASSWORD=TU_S3_SECRET_KEY
   ```
6. **Volumes**: volumen persistente en `/data`
7. **Networking**:
   - Puerto 9000: red interna (API de S3)
   - Puerto 9001: exponé temporalmente para acceder a la consola web y crear los buckets. Después lo cerrás.
8. Click **Deploy**

**Crear los buckets:**

1. Entrá a la consola web de MinIO: `http://TU_IP:9001`
2. Login con `S3_ACCESS_KEY` / `S3_SECRET_KEY`
3. Creá 3 buckets:
   - `manuals` → Access Policy: **Private**
   - `listings` → Access Policy: **Public**
   - `creators` → Access Policy: **Public**
4. **Después de crear los buckets, sacá la exposición del puerto 9001.** No necesita estar público.

---

## Paso 7 — Verificar la red interna

Antes de levantar la app, verificá que los servicios se pueden hablar entre sí. Desde la consola de CUALQUIER contenedor:

```bash
# Probar Postgres (el hostname es el nombre del servicio en EasyPanel)
# Puede ser 'postgres', 'autoelectrico-postgres', o similar.
# Mirá en EasyPanel → servicio → Networking → Internal hostname

ping postgres     # o el hostname que muestre EasyPanel
ping redis
ping minio
```

Anotá los hostnames exactos. Los vas a necesitar para las variables de entorno de la app.

---

## Paso 8 — Servicio: Web (la app de Next.js)

1. **+ New Service** → **App**
2. Nombre: `web`
3. **Source**: GitHub → tu repo `autoelectrico-uy` → branch `main`
4. **Build**:
   - Method: **Dockerfile**
   - Dockerfile path: `deploy/Dockerfile`
   - Build target: `web`
   - Si no hay campo "target", agregá en build args: `--target=web`
5. **Environment Variables** (todas juntas):
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://evuy:TU_POSTGRES_PASSWORD@HOSTNAME_POSTGRES:5432/evuy
   REDIS_URL=redis://HOSTNAME_REDIS:6379
   S3_ENDPOINT=http://HOSTNAME_MINIO:9000
   S3_ACCESS_KEY=TU_S3_ACCESS_KEY
   S3_SECRET_KEY=TU_S3_SECRET_KEY
   ANTHROPIC_API_KEY=sk-ant-TUKEY
   OPENAI_API_KEY=sk-TUKEY
   RESEND_API_KEY=re_TUKEY
   AUTH_SECRET=TU_AUTH_SECRET
   AUTH_URL=https://autoelectrico.uy
   NEXT_PUBLIC_SITE_URL=https://autoelectrico.uy
   CDN_DOMAIN=cdn.autoelectrico.uy
   MAIL_FROM=autoelectrico.uy <hola@autoelectrico.uy>
   MAIL_REPLY_TO=matideleon@gmail.com
   ```

   IMPORTANTE: reemplazá `HOSTNAME_POSTGRES`, `HOSTNAME_REDIS`, `HOSTNAME_MINIO` con los hostnames internos reales que viste en el Paso 7.

6. **Networking**:
   - Port: `3000`
   - Exponé al exterior
7. **Domains**:
   - Agregá `autoelectrico.uy`
   - Habilitá HTTPS (Let's Encrypt)
8. Click **Deploy**

---

## Paso 9 — Esperar el build y resolver errores

El primer build tarda 3-5 minutos. Mirá los logs en EasyPanel.

**Errores comunes y cómo resolverlos:**

**Error: `Cannot find module '@/lib/...'`**
Los paths `@/` dependen del `tsconfig.json`. Verificá que el archivo esté en la raíz del repo con la sección `paths`.

**Error: `ECONNREFUSED` en el build**
Next.js intenta conectar a Postgres durante `generateStaticParams`. Esto está bien: las páginas se generan on-demand en vez de en el build. Si el build falla por esto, agregá en environment:
```
NEXT_BUILD_SKIP_DB=true
```
Y en `app/modelos/[slug]/page.tsx`, envolvé `generateStaticParams` en un try-catch que devuelva `[]` si falla.

**Error: `Module not found: pdfjs-dist`**
Verificá que `pdfjs-dist` esté en `dependencies` del `package.json`, no en `devDependencies`.

**El build pasa pero el contenedor se reinicia en loop:**
Mirá los logs del contenedor. Lo más probable es que `DATABASE_URL` esté mal. Revisá el hostname interno.

---

## Paso 10 — Verificar la app

Entrá a estas URLs:

**1. Health check:**
```
https://autoelectrico.uy/api/health
```

Respuesta esperada:
```json
{"status":"ok","checks":{"db":{"ok":true},"cache":{"ok":true}}}
```

Si dice `"degraded"`: Redis no conecta. El sitio funciona, pero sin cache ni rate limit. Revisá el hostname de Redis.

Si da error 503 o no carga: Postgres no conecta. Revisá `DATABASE_URL`.

**2. Landing page:**
```
https://autoelectrico.uy
```

Debe mostrar la landing con los 5 modelos y el formulario de suscripción.

**3. Probar la suscripción:**

Suscribite con tu mail real. Verificá:
- Que te llegue el mail de confirmación (puede tardar 1-2 min; revisá spam)
- Que el link de confirmación funcione
- Que en la base aparezca:
  ```bash
  psql -U evuy -d evuy -c "SELECT email, status FROM subscribers;"
  ```
  Debe mostrar tu mail con status `confirmed`.

---

## Paso 11 — Servicio: Worker

1. **+ New Service** → **App**
2. Nombre: `worker`
3. **Source**: mismo repo de GitHub, misma branch
4. **Build**:
   - Method: **Dockerfile**
   - Dockerfile path: `deploy/Dockerfile`
   - Build target: `worker`
5. **Environment Variables**: las mismas que `web`, MENOS las de `AUTH_*` y `NEXT_PUBLIC_*` (el worker no las necesita)
6. **Networking**: NO expongas ningún puerto. El worker no recibe requests.
7. **Resources**: si podés, limitá la memoria a 1 GB (un PDF grande se puede comer toda la RAM)
8. Click **Deploy**

**Verificar:**

En los logs del worker debe aparecer:
```
[worker] escuchando colas: ingest, images, newsletter, prices
```

---

## Paso 12 — Configurar backups

Por SSH en el VPS:

```bash
# 1. Instalar el cliente de MinIO
curl -O https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
mv mc /usr/local/bin/

# 2. Configurar el alias local (el MinIO de tu VPS)
mc alias set local http://localhost:9000 TU_S3_ACCESS_KEY TU_S3_SECRET_KEY

# 3. Configurar el alias remoto (Backblaze B2 u otro S3)
mc alias set remote https://s3.us-west-000.backblazeb2.com TU_B2_KEY TU_B2_SECRET
mc mb remote/autoelectrico-backups

# 4. Copiar el script de backup
mkdir -p /opt/autoelectrico
cp deploy/backup.sh /opt/autoelectrico/
chmod +x /opt/autoelectrico/backup.sh

# 5. Editar el script: ajustar PG_CONTAINER al nombre real
nano /opt/autoelectrico/backup.sh
# Cambiar PG_CONTAINER="evuy_postgres_1" al nombre real del contenedor.
# Lo ves con: docker ps | grep postgres

# 6. Probar que funciona
/opt/autoelectrico/backup.sh

# 7. Programar cron diario a las 4:30 AM
crontab -e
# Agregar esta línea:
# 30 4 * * * /opt/autoelectrico/backup.sh >> /var/log/autoelectrico-backup.log 2>&1
```

**PROBAR EL RESTORE AHORA (con la base casi vacía):**

```bash
cp deploy/restore.sh /opt/autoelectrico/
chmod +x /opt/autoelectrico/restore.sh
/opt/autoelectrico/restore.sh /var/backups/evuy/db-*.dump
```

Si restaura bien y te muestra los conteos, el backup funciona de verdad.

---

## Paso 13 — Cloudflare (recomendado)

1. Agregá `autoelectrico.uy` a Cloudflare (plan gratuito)
2. Cambiá los nameservers en nic.com.uy a los que te dé Cloudflare
3. En Cloudflare DNS: `A autoelectrico.uy → IP_DEL_VPS` con proxy naranja
4. SSL/TLS → **Full (Strict)**
5. Page Rules o Transform Rules: forzar HTTPS en todo el sitio

Beneficios: CDN gratis, cache de imágenes, protección DDoS, y escondés la IP real del VPS.

---

## Paso 14 — Verificar Resend (mails)

1. Entrá a [resend.com](https://resend.com) → Domains → **Add Domain**
2. Agregá `autoelectrico.uy`
3. Resend te da 3 registros DNS (SPF, DKIM, verificación)
4. Agregalos en Cloudflare (o donde tengas el DNS)
5. Esperá la verificación (minutos a horas)
6. Probá mandándote un mail de prueba desde Resend

Sin esto, los mails de confirmación del newsletter no van a llegar o van a caer en spam.

---

## Checklist final

Cuando todo esté corriendo, verificá cada punto:

- [ ] `https://autoelectrico.uy` carga la landing
- [ ] `https://autoelectrico.uy/api/health` devuelve `{"status":"ok"}`
- [ ] Te suscribiste con tu mail y te llegó la confirmación
- [ ] Confirmaste y en la DB aparece `status = 'confirmed'`
- [ ] El worker muestra "escuchando colas" en los logs
- [ ] El backup corrió sin error y se subió al remoto
- [ ] El restore se probó y funcionó
- [ ] `robots.txt` devuelve `Disallow: /` (no queremos indexar todavía)
- [ ] HTTPS funciona con candado verde

---

## Qué sigue

Con esto en verde, el sitio está vivo. No tiene contenido todavía, y no debe tenerlo: las fichas están en `draft`, el `robots.txt` bloquea la indexación, y Google no sabe que existís. Eso está bien.

La secuencia ahora es:

1. Cargar el Geely EX5 completo (campo por campo, sin inventar)
2. Cargar los otros 4 modelos
3. Ingestar el manual del EX5 (el worker lo procesa)
4. Postear en la comunidad Geely pidiendo datos de autonomía real
5. Contactar 2-3 creators
6. Conseguir 20 suscriptores reales

Cuando tengas 10+ fichas publicadas con datos verificados, abrís el `robots.txt`, generás el `sitemap.xml`, y empezás a existir para Google.

---

## Troubleshooting rápido

**El sitio carga pero muy lento:**
Probablemente no tiene Cloudflare adelante y cada request viaja directo al VPS. O la DB no tiene los índices creados.

**Los mails no llegan:**
Verificá el dominio en Resend. Revisá los logs del servicio `web` buscando `[subscribe]`.

**El chatbot no responde:**
Verificá `ANTHROPIC_API_KEY`. Revisá que haya chunks en `doc_chunks` (si no ingestaste manuales, el bot no tiene de dónde sacar datos y va a decir que no sabe).

**El worker se muere al ingestar un PDF:**
Subile el límite de memoria. Un manual de 400 páginas necesita ~800 MB.

**Olvidé un secreto:**
Los secretos están en EasyPanel → servicio → Environment. Si perdiste el de Postgres, tenés un problema: hay que resetearlo en el contenedor Y en todas las apps que lo usan.
