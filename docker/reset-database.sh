#!/bin/bash

# 🗄️ Скрипт для повного очищення бази даних
# Використання: ./reset-database.sh

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

log_warning "🗄️ УВАГА! Цей скрипт повністю видалить всі дані з бази даних!"
echo "Ви впевнені? (y/N)"
read -r CONFIRM

if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    log_info "Операцію скасовано."
    exit 0
fi

log_info "🛑 Зупиняємо контейнери..."
docker-compose -f $COMPOSE_FILE down

log_info "🗑️ Видаляємо PostgreSQL volume..."
docker volume rm docker_postgres_data_dev 2>/dev/null || true

log_info "🗑️ Видаляємо PgAdmin volume..."
docker volume rm docker_pgadmin_data_dev 2>/dev/null || true

log_info "🔄 Видаляємо всі project volumes..."
docker-compose -f $COMPOSE_FILE down -v

log_info "🔄 Створюємо volumes через docker-compose..."
# Volumes будуть створені автоматично при запуску

log_info "🚀 Запускаємо тільки PostgreSQL для ініціалізації..."
docker-compose -f $COMPOSE_FILE up -d postgres

log_info "⏳ Очікуємо готовності PostgreSQL (30 секунд)..."
sleep 30

log_info "📊 Перевіряємо стан PostgreSQL..."
docker-compose -f $COMPOSE_FILE exec postgres pg_isready -U aksi_user -d aksi_cleaners_db_v5

log_success "✅ PostgreSQL готовий!"

log_info "📋 Копіюємо CSV файли в PostgreSQL контейнер..."
if [ -f "../scripts/price_list/price_list.csv" ]; then
    docker cp ../scripts/price_list/price_list.csv postgres-dev:/price_list.csv 2>/dev/null && \
    log_success "price_list.csv скопійовано" || \
    log_warning "Не вдалося скопіювати price_list.csv"
else
    log_warning "Файл price_list.csv не знайдено"
fi

log_info "🚀 Запускаємо backend для виконання міграцій..."
docker-compose -f $COMPOSE_FILE up -d backend

log_info "📺 Показуємо логи backend в реальному часі (30 секунд)..."
echo ""
timeout 30 docker-compose -f $COMPOSE_FILE logs -f backend || true
echo ""

log_info "🔍 Перевіряємо фінальний статус міграцій..."
docker-compose -f $COMPOSE_FILE logs backend | grep -E "(ERROR|WARN|Liquibase|Migration)" | tail -10

log_success "✅ База даних очищена та міграції виконані!"
log_info "Запускаємо всі сервіси..."

docker-compose -f $COMPOSE_FILE up -d

log_info "📺 Показуємо логи запуску всіх сервісів (20 секунд)..."
echo ""
timeout 20 docker-compose -f $COMPOSE_FILE logs -f || true
echo ""

log_success "🎉 Система готова до роботи з чистою базою даних!"
echo ""
echo "🌐 Доступ до сервісів:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8080/api"
echo "   PgAdmin:  http://localhost:5050"
