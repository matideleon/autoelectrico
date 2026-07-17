# autoelectrico.uy

Autos eléctricos en Uruguay con datos reales.

---

## Arrancar desde cero

### Prerequisitos

- Node.js 22+
- Docker (para Postgres pgvector, Redis, MinIO)
- Cuenta en Resend (mails), Anthropic (chatbot), OpenAI (embeddings)
- VPS con EasyPanel (o docker-compose local)

### 1. Clonar y configurar

```bash
git clone git@github.com:TU_USER/autoelectrico-uy.git
cd autoelectrico-uy
cp .env.example .env.local

# Generar los secretos
openssl rand -base64 32   # → POSTGRES_PASSWORD
openssl rand -base64 32   # → AUTH_SECRET
openssl rand -hex 16      # → S3_ACCESS_KEY
openssl rand -base64 32   # → S3_SECRET_KEY

# Completar ANTHROPIC_API_KEY, OPENAI_API_KEY, RESEND_API_KEY
```

### 2. Levantar servicios

**Opción A — docker-compose (desarrollo local):**
```bash
docker compose -f deploy/docker-compose.yml up -d postgres redis minio
```

**Opción B — EasyPanel (producción):**
Seguir `deploy/README.md` paso a paso.

### 3. Crear la base de datos

```bash
# Con docker-compose:
docker exec -it autoelectrico-uy-postgres-1 psql -U evuy -d evuy \
  -f /docker-entrypoint-initdb.d/0001_init.sql

docker exec -it autoelectrico-uy-postgres-1 psql -U evuy -d evuy \
  -f /docker-entrypoint-initdb.d/0002_seed.sql

# Verificar:
docker exec -it autoelectrico-uy-postgres-1 psql -U evuy -d evuy \
  -c "\dt" -c "SELECT slug, status FROM models;"

# Debe mostrar 15 tablas y 5 modelos en 'draft'.
```

### 4. Instalar y correr

```bash
npm install
npm run dev
```

Abrir http://localhost:3000 → landing de captura.

http://localhost:3000/api/health → debe responder `{"status":"ok"}` o `{"status":"degraded"}`.

### 5. Verificar el ciclo completo

```bash
# Suscribite vos mismo desde la landing
# → Revisá el mail de confirmación
# → Clickeá el link
# → Verificá en la base:
docker exec -it autoelectrico-uy-postgres-1 psql -U evuy -d evuy \
  -c "SELECT email, status FROM subscribers;"
```

Si llegaste acá con todo en verde, el Día 1 está hecho.

---

## Estructura

```
app/                    → Rutas de Next.js (App Router)
  api/chat/             → Chatbot RAG
  api/subscribe/        → Captura de mails
  api/health/           → Healthcheck
  modelos/[slug]/       → Fichas de modelo (SSG + revalidación)
  confirmar/            → Double opt-in del newsletter
components/             → React (ModelSheet, Comparador, Landing)
lib/
  db/                   → Capa de datos + autorización (reemplaza RLS)
  rag/                  → Embeddings, chunking, retrieval, chat, cache
  seo/                  → JSON-LD, metadata
  ui/                   → Constantes compartidas
  mail/                 → Mails transaccionales (Resend)
worker/                 → BullMQ: ingesta de PDFs, procesamiento
deploy/                 → Docker, backups, migraciones
```

## Regla de diseño

El color codifica confianza del dato:
- **Cian (#3DDC97):** medido en Uruguay, con fuente citable
- **Ámbar (#E8A33D):** declarado por fábrica (laboratorio)
- **Gris (#4A505A):** no lo sabemos todavía

El hueco visible ES el producto.
