# --- STAGE 0: Builder ---
FROM node:22.18.0-alpine AS builder

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./

RUN corepack enable \
    && pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build \
    && pnpm store prune

# --- STAGE 1: Runner ---
FROM oven/bun:1.1-slim AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY server.mjs .

EXPOSE 3000

CMD ["bun", "run", "server.mjs"]