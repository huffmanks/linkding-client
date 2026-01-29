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
FROM nginx:alpine AS runner

RUN rm -rf /usr/share/nginx/html/* && mkdir -p /etc/nginx/templates

COPY --from=builder /app/dist /usr/share/nginx/html

RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
    location /api/ { \
        proxy_pass ${LINKDING_INTERNAL}/api/; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
    } \
}' > /etc/nginx/templates/default.conf.template

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]