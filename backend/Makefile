# Makefile for AKSI Dry Cleaning Order System
# Usage: make [target]

# Variables
COMPOSE_FILE := docker-compose.dev.backend.yml
DOCKER_COMPOSE := docker-compose -f $(COMPOSE_FILE)
MVN := ./mvnw

# Default target
.DEFAULT_GOAL := help

# Phony targets
.PHONY: help up down stop start restart logs status shell clean reset db build test lint format dev install

# Help target
help: ## Show this help message
	@echo 'AKSI Dry Cleaning Order System - Development Environment'
	@echo ''
	@echo 'Usage:'
	@echo '  make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ''
	@echo 'Quick Start:'
	@echo '  make install         # Install dependencies'
	@echo '  make up              # Start all services'
	@echo '  make dev             # Start development mode'
	@echo '  make logs            # View logs'
	@echo '  make down            # Stop all services'
	@echo ''
	@echo 'URLs:'
	@echo '  Application:         http://localhost:8080'
	@echo '  API:                 http://localhost:8080/api'
	@echo '  Swagger UI:          http://localhost:8080/swagger-ui.html'

# Install dependencies
install: ## Install Maven dependencies
	@echo '📦 Installing dependencies...'
	@$(MVN) clean install -DskipTests
	@echo '✅ Dependencies installed!'

# Start services
up: ## Start all services with Docker
	@echo '🚀 Starting all services...'
	@$(DOCKER_COMPOSE) up -d
	@echo '✅ All services started!'
	@make _show_urls

# Development mode
dev: ## Start development mode (Spring Boot)
	@echo '🚀 Starting development mode...'
	@$(MVN) spring-boot:run -Dspring-boot.run.profiles=dev

# Stop services
down: ## Stop all Docker services
	@echo '🛑 Stopping all services...'
	@$(DOCKER_COMPOSE) down
	@echo '✅ All services stopped!'

# Stop services (alias)
stop: down ## Stop all services (alias for down)

# Start existing services
start: ## Start existing Docker services
	@echo '▶️  Starting existing services...'
	@$(DOCKER_COMPOSE) start
	@echo '✅ Services started!'

# Restart services
restart: ## Restart all Docker services
	@echo '🔄 Restarting services...'
	@$(DOCKER_COMPOSE) restart
	@echo '✅ Services restarted!'

# View logs
logs: ## View logs from all services
	@echo '📺 Showing logs (Ctrl+C to exit)...'
	@$(DOCKER_COMPOSE) logs -f

# Status
status: ## Show status of all services
	@echo '📊 Container status:'
	@$(DOCKER_COMPOSE) ps
	@echo ''
	@echo '🌐 Active services:'
	@$(DOCKER_COMPOSE) port postgres 5432 2>/dev/null && echo "PostgreSQL: localhost:5432" || echo "PostgreSQL: not running"

# Shell access
shell: ## Connect to Spring Boot application
	@echo '🐚 Starting bash shell...'
	@bash

# Database shell
db-shell: ## Connect to PostgreSQL
	@echo '🗄️ Connecting to PostgreSQL...'
	@$(DOCKER_COMPOSE) exec postgres psql -U aksi_user -d aksi_dry_cleaning

# Reset database
reset-db: ## Reset database (WARNING: deletes all data)
	@echo '⚠️  WARNING! This will delete all database data!'
	@echo 'Are you sure? (y/N)'
	@read -p "" confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		echo '🗑️ Resetting database...'; \
		$(DOCKER_COMPOSE) down -v; \
		$(DOCKER_COMPOSE) up -d postgres; \
		sleep 5; \
		$(MVN) liquibase:update; \
		echo '✅ Database reset complete!'; \
	else \
		echo 'Operation cancelled.'; \
	fi

# Build project
build: ## Build project with Maven
	@echo '🔨 Building project...'
	@$(MVN) clean package -DskipTests
	@echo '✅ Build complete!'

# Run tests
test: ## Run all tests
	@echo '🧪 Running tests...'
	@$(MVN) test
	@echo '✅ Tests complete!'

# Run integration tests
test-integration: ## Run integration tests
	@echo '🧪 Running integration tests...'
	@$(MVN) verify -P integration-tests
	@echo '✅ Integration tests complete!'

# Lint code
lint: ## Run code linting
	@echo '🔍 Running linting...'
	@$(MVN) spotless:check checkstyle:check
	@echo '✅ Linting complete!'

# Format code
format: ## Format code
	@echo '✨ Formatting code...'
	@$(MVN) spotless:apply
	@echo '✅ Formatting complete!'

# Generate API
generate-api: ## Generate API from OpenAPI specs
	@echo '🔄 Generating API...'
	@$(MVN) clean compile
	@echo '✅ API generation complete!'

# Database operations
db-migrate: ## Run database migrations
	@echo '🗄️ Running migrations...'
	@$(MVN) liquibase:update
	@echo '✅ Migrations complete!'

db-rollback: ## Rollback last database migration
	@echo '⏪ Rolling back last migration...'
	@$(MVN) liquibase:rollback -Dliquibase.rollbackCount=1
	@echo '✅ Rollback complete!'

db-status: ## Show database migration status
	@echo '📊 Database migration status:'
	@$(MVN) liquibase:status

# Docker operations
docker-build: ## Build Docker image
	@echo '🐳 Building Docker image...'
	@docker build -t aksi/dry-cleaning:latest .
	@echo '✅ Docker image built!'

# Clean
clean: ## Clean build artifacts
	@echo '🧹 Cleaning build artifacts...'
	@$(MVN) clean
	@rm -rf target/
	@echo '✅ Clean complete!'

# Production build
prod: ## Build for production
	@echo '🚀 Building for production...'
	@$(MVN) clean package -P production
	@echo '✅ Production build complete!'

# Private targets
_show_urls:
	@echo ''
	@echo '🌐 Service URLs:'
	@echo '   Application:         http://localhost:8080'
	@echo '   API:                 http://localhost:8080/api'
	@echo '   Swagger UI:          http://localhost:8080/swagger-ui.html'
	@echo '   Actuator:            http://localhost:8080/actuator'
	@echo ''
	@echo '🛠️  Useful commands:'
	@echo '   make logs            # View logs'
	@echo '   make status          # Check status'
	@echo '   make shell           # Open shell'
	@echo '   make down            # Stop all services'

# Monitoring
monitor: ## Open monitoring dashboards
	@echo '📊 Monitoring URLs:'
	@echo '   Actuator:            http://localhost:8080/actuator'

# Security check
security-check: ## Run security checks
	@echo '🔒 Running security checks...'
	@$(MVN) dependency-check:check
	@echo '✅ Security check complete!'

# Update dependencies
update-deps: ## Update Maven dependencies
	@echo '📦 Updating dependencies...'
	@$(MVN) versions:use-latest-versions
	@echo '✅ Dependencies updated!'

# Show outdated dependencies
outdated: ## Show outdated dependencies
	@echo '📦 Checking for outdated dependencies...'
	@echo 'Maven:'
	@$(MVN) versions:display-dependency-updates
