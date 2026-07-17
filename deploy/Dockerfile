# ============================================================
# evuy — Imagen
#
# Multi-stage con dos targets: `web` (Next.js) y `worker` (BullMQ).
# Mismo repo, misma build, distinto comando.
# ============================================================

FROM node:22-slim AS base
WORKDIR /app
# pdfjs necesita fuentes del sistema para extraer texto de PDFs
# que las embeben; sin esto, algunos manuales salen vacíos.
RUN apt-get update && apt-get install -y --no-install-recommends \
      fontconfig fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

# ---------- Dependencias ----------
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && cp -R node_modules /prod_modules
RUN npm ci

# ---------- Build ----------
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# generateStaticParams pega a la DB durante el build: si no está
# disponible, Next igual construye y las páginas se generan on-demand.
RUN npm run build

# ---------- Web ----------
FROM base AS web
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000
RUN groupadd -g 1001 nodejs && useradd -u 1001 -g nodejs -m nextjs

COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]

# ---------- Worker ----------
FROM base AS worker
ENV NODE_ENV=production
RUN groupadd -g 1001 nodejs && useradd -u 1001 -g nodejs -m worker

COPY --from=deps --chown=worker:nodejs /prod_modules ./node_modules
COPY --chown=worker:nodejs lib ./lib
COPY --chown=worker:nodejs worker ./worker
COPY --chown=worker:nodejs package.json ./

USER worker
# --experimental-strip-types: TS sin paso de build. Node 22 lo soporta.
CMD ["node", "--experimental-strip-types", "worker/index.ts"]
