# --- Variables ---
BASE_COMPOSE_FILES = -f docker-compose.yml
ENV_FILE = .env

# --- Global Commands ---
all: dev-up-all ## Run the full development startup

DOCKER_COMPOSE = docker compose $(DOCKER_FILES) --env-file $(ENV_FILE)

.PHONY: help
help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-25s\033[0m %s\n", $$1, $$2}'

# --- Development Targets ---

.PHONY: dev-docker-up dev-docker-down dev-up-all
dev-docker-up: DOCKER_FILES = $(BASE_COMPOSE_FILES)
dev-docker-up: ## Start the Docker services
	@$(DOCKER_COMPOSE) up -d

dev-docker-down: DOCKER_FILES = $(BASE_COMPOSE_FILES)
dev-docker-down: ## Stop the Docker services
	@$(DOCKER_COMPOSE) down -v

# The main development target:
dev-up-all: dev-docker-up
	@echo "--- Starting app via (pnpm dev) ---"
	pnpm dev
