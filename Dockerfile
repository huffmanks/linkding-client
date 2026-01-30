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
FROM nginxinc/nginx-unprivileged:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx/default.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 8080
