set dotenv-load

base_compose_command := "docker compose -f docker-compose.yml"

# List available commands
default:
	@just --list

# Setup pre-reqs (.env, mkcert => *-key.pem, *.pem)
init:
    cp .env.example .env && mkcert your.domain.com

# Start (DEV) environment
dev:
    @just -E .env _dev-up-all

# Start (PROD) environment
prod:
    @just -E .env _prod-up-all

# Shut services (Docker, Caddy)
down:
    @just -E .env _docker-caddy-down

# --- HIDDEN ---

_dev-up-all: _docker-dev-up
	@echo "Starting dev server..."
	pnpm dev

_docker-dev-up:
	{{base_compose_command}} up -d linkding

_docker-prod-up:
	{{base_compose_command}} up --build --force-recreate -d

_prod-up-all: _docker-prod-up
    @echo "Starting caddy proxy..."
    sudo caddy start

_docker-caddy-down:
    @echo "Stopping caddy proxy..."
    -sudo caddy stop 2>/dev/null || true
    {{base_compose_command}} down
