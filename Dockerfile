# --- STAGE 0: Installer ---
FROM node:22.18.0-alpine AS installer

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./

RUN corepack enable \
    && pnpm install --frozen-lockfile

# --- STAGE 1: Builder ---
FROM installer AS builder

WORKDIR /app

COPY --from=installer /app/node_modules ./node_modules
COPY . .

RUN pnpm run build \
    && rm -rf node_modules \
    && pnpm store prune

# --- STAGE 2: Production ---
FROM node:22.18.0-alpine AS production

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./

RUN chown -R node:node /app

COPY --from=builder --chown=node:node /app/.output .output

USER node

ENV PORT=3000
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]