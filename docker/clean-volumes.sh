#!/bin/bash

# 🧹 Скрипт для очищення всіх Docker volumes
# Використання: ./clean-volumes.sh

set -e

# Кольори для виводу
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функції для кольорового виводу
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

COMPOSE_FILE="docker-compose.dev.yml"

log_warning "🧹 УВАГА! Цей скрипт видалить всі Docker volumes для проекту!"
echo "Всі дані в базі даних будуть втрачені. Ви впевнені? (y/N)"
read -r CONFIRM

if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    log_info "Операцію скасовано."
    exit 0
fi

log_info "🛑 Зупиняємо всі контейнери..."
docker-compose -f $COMPOSE_FILE down

log_info "🗑️ Видаляємо всі project volumes через docker-compose..."
docker-compose -f $COMPOSE_FILE down -v

log_info "🗑️ Видаляємо застарілі volumes вручну..."
docker volume rm docker_postgres_data_dev 2>/dev/null || true
docker volume rm docker_pgadmin_data_dev 2>/dev/null || true
docker volume rm docker_backend_m2_cache 2>/dev/null || true
docker volume rm docker_frontend_node_modules 2>/dev/null || true
docker volume rm docker_frontend_next_cache 2>/dev/null || true
docker volume rm docker_frontend_npm_cache 2>/dev/null || true

log_info "🗑️ Видаляємо volumes без префікса..."
docker volume rm postgres_data_dev 2>/dev/null || true
docker volume rm pgadmin_data_dev 2>/dev/null || true
docker volume rm backend_m2_cache 2>/dev/null || true
docker volume rm frontend_node_modules 2>/dev/null || true
docker volume rm frontend_next_cache 2>/dev/null || true
docker volume rm frontend_npm_cache 2>/dev/null || true

log_info "🧹 Очищаємо unused volumes..."
docker volume prune -f

log_success "✅ Всі volumes очищено!"
log_info "Тепер можете запустити систему без попереджень:"
echo "   ./start-dev.sh fast"
