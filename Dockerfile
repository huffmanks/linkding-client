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
FROM caddy:alpine AS runner

COPY --from=builder /app/dist /srv
COPY --from=builder /app/Caddyfile /etc/caddy/Caddyfile

EXPOSE 8080
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
