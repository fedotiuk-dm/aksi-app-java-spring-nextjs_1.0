# Makefile for AKSI Dry Cleaning Order System
# Usage: make [target]

# Variables
COMPOSE_FILE := docker-compose.dev.backend.yml
DOCKER_COMPOSE := docker-compose -f $(COMPOSE_FILE)
MVN := ./mvnw

# Default target
.DEFAULT_GOAL := help

# Dependency update targets
.PHONY: update-versions check-updates update-properties update-dependencies update-plugins

# Phony targets
.PHONY: help up down stop start restart logs status shell clean reset db build test lint format dev install bundle-api generate-docs update-docs

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

# API Documentation operations
bundle-api: ## Generate API bundle from all domain specs
	@echo '🔄 Generating API bundle...'
	@cd src/main/resources/openapi && \
	npx @redocly/cli bundle \
	  common.yaml \
	  auth/auth-api.yaml \
	  branch/branch-api.yaml \
	  cart/cart-api.yaml \
	  customer/customer-api.yaml \
	  file/file-api.yaml \
	  games/games-api.yaml \
	  order/order-api.yaml \
	  price-list/price-list-api.yaml \
	  pricing/pricing-api.yaml \
	  receipt/receipt-api.yaml \
	  user/user-api.yaml \
	  --output temp-bundle --force
	@cd src/main/resources/openapi && \
	npx @redocly/cli join temp-bundle/*.yaml --output aksi-bundled-new.yaml
	@cd src/main/resources/openapi && \
	if [ -f aksi-bundled.yaml ]; then cp aksi-bundled.yaml aksi-bundled-backup.yaml; fi && \
	mv aksi-bundled-new.yaml aksi-bundled.yaml && \
	rm -rf temp-bundle
	@echo '✅ API bundle updated!'

generate-docs: ## Generate HTML documentation from API bundle
	@echo '📚 Generating HTML documentation...'
	@mkdir -p src/main/docs/api
	@cd src/main/resources/openapi && \
	npx @redocly/cli build-docs aksi-bundled.yaml --output ../docs/api/index.html
	@echo '✅ HTML documentation generated at src/main/docs/api/index.html!'

update-docs: bundle-api generate-docs ## Update both API bundle and HTML docs
	@echo '🎉 API bundle and documentation updated successfully!'
	@echo '📁 Bundle: backend/src/main/resources/openapi/aksi-bundled.yaml'
	@echo '🌐 Docs:   backend/src/main/docs/api/index.html'

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
	@echo ''
	@echo '📚 API Documentation:'
	@echo '   make bundle-api      # Generate API bundle from all domains'
	@echo '   make generate-docs    # Generate HTML docs from API bundle'
	@echo '   make update-docs      # Update both bundle and HTML docs'
	@echo '   📁 Bundle: backend/src/main/resources/openapi/aksi-bundled.yaml'
	@echo '   🌐 Docs:   backend/src/main/docs/api/index.html'
	@echo ''
	@echo '🔄 Dependency Updates:'
	@echo '   make check-updates   # Show all available updates'
	@echo '   make update-all-safe # Update all (SAFE: minor only)'
	@echo '   make update-dependencies # Update only dependencies'
	@echo '   make update-plugins  # Update only plugins'
	@echo '   make update-properties # Update properties versions'
	@echo '   make revert-updates  # Revert to backup POM'

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

# ========================================
# 🔄 DEPENDENCY UPDATE AUTOMATION
# ========================================

check-updates: ## 🔍 Show all available updates (dependencies, plugins, properties)
	@echo '🔍 Checking all available updates...'
	@echo '📦 Dependencies:'
	@$(MVN) versions:display-dependency-updates
	@echo ''
	@echo '🔌 Plugins:'
	@$(MVN) versions:display-plugin-updates
	@echo ''
	@echo '⚙️ Properties:'
	@$(MVN) versions:display-property-updates

update-dependencies: ## 📦 Update only dependencies (minor + incremental)
	@echo '📦 Updating dependencies to latest minor versions...'
	@$(MVN) versions:use-latest-versions -DallowMajorUpdates=false -DallowMinorUpdates=true
	@echo '✅ Dependencies updated!'

update-plugins: ## 🔌 Update Maven plugins
	@echo '🔌 Updating Maven plugins...'
	@$(MVN) versions:use-latest-versions -DallowMajorUpdates=false -DallowMinorUpdates=true -DincludesList=*:*-maven-plugin
	@echo '✅ Plugins updated!'

update-properties: ## ⚙️ Update properties-based versions
	@echo '⚙️ Updating properties-based versions...'
	@$(MVN) versions:update-properties -DallowMajorUpdates=false -DallowMinorUpdates=true
	@echo '✅ Properties updated!'

update-all-safe: ## 🚀 Update everything (SAFE: minor + incremental only)
	@echo '🚀 Running SAFE update (minor + incremental versions only)...'
	@$(MAKE) update-dependencies
	@$(MAKE) update-plugins
	@$(MAKE) update-properties
	@echo '✅ All updates completed safely!'
	@echo '💡 Run "mvn clean compile" to test the updates'

update-all-major: ## ⚠️ Update everything including MAJOR versions (DANGEROUS!)
	@echo '⚠️  WARNING: This will update to MAJOR versions!'
	@echo '⚠️  This may introduce breaking changes!'
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	@echo '🚀 Running MAJOR update...'
	@$(MVN) versions:use-latest-versions -DallowMajorUpdates=true
	@$(MVN) versions:update-properties -DallowMajorUpdates=true
	@echo '✅ Major updates completed!'
	@echo '⚠️  Please test thoroughly!'

revert-updates: ## ↩️ Revert to backup POM (if update failed)
	@echo '↩️ Reverting to backup pom.xml...'
	@if [ -f pom.xml.versionsBackup ]; then \
		mv pom.xml.versionsBackup pom.xml; \
		echo '✅ Reverted to backup!'; \
	else \
		echo '❌ No backup found!'; \
	fi

clean-backups: ## 🧹 Clean version backup files
	@echo '🧹 Cleaning version backup files...'
	@rm -f pom.xml.versionsBackup
	@echo '✅ Backup files cleaned!'
