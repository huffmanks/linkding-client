base_compose := "docker compose -f docker-compose.yml"

# --- Public Recipes ---

default:
    @just --list

# Start environment (e.g., just up prod)
up profile="dev":
    @test -f .env.{{profile}} || (echo "Error: .env.{{profile}} missing!" && exit 1)
    @echo "Starting {{profile}} environment..."
    @just -E .env.{{profile}} _up-{{profile}}

# Stop environment (default: dev)
down profile="dev":
    @echo "Stopping {{profile}} environment..."
    @just -E .env.{{profile}} _down-{{profile}}

# Setup pre-reqs
init domain:
    @for env in dev staging prod; do \
        if [ ! -f .env.$env ]; then \
            cp .env.example .env.$env; \
            echo "Created .env.$env"; \
        else \
            echo ".env.$env already exists, skipping..."; \
        fi; \
    done
    mkcert -install {{domain}}

# --- Internal Helpers ---
_up-dev:
    {{base_compose}} up -d linkding
    pnpm dev

_up-staging:
    {{base_compose}} up -d linkding
    pnpm staging

_up-prod: _up-staging
    sudo caddy start

_down-base:
    {{base_compose}} down

_down-dev: _down-base

_down-staging: _down-base

_down-prod:
    -sudo caddy stop
    {{base_compose}} down
