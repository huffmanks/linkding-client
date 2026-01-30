# --- Variables ---
ENV_FILE = .env

# --- Global Commands ---
all: dev-up-all ## Run the full development startup
dev: dev-up-all ## Alias to start dev
dev-down: dev-docker-down ## Alias to start dev
prod: prod-docker-up ## Run the full production startup
prod-down: prod-docker-down ## Run the full production startup

DOCKER_COMPOSE = docker compose --env-file $(ENV_FILE)

.PHONY: help
help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-25s\033[0m %s\n", $$1, $$2}'

# --- Development Targets ---
.PHONY: dev-docker-up dev-docker-down dev-up-all
dev-docker-up: ## Start the Docker services
	@$(DOCKER_COMPOSE) up linkding -d

dev-docker-down: ## Stop the Docker services
	@$(DOCKER_COMPOSE) down

dev-up-all: dev-docker-up
	@echo "--- Starting app via (pnpm dev) ---"
	pnpm dev

# --- Production Targets ---
.PHONY: prod-docker-up prod-docker-down
prod-docker-up: ## Start the Docker services
	@$(DOCKER_COMPOSE) up --build --force-recreate -d

prod-docker-down: ## Stop the Docker services
	@$(DOCKER_COMPOSE) down