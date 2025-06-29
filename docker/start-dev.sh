#!/bin/bash

# 🚀 Скрипт для запуску Aksi-app у режимі розробки
# Використання:
#   ./start-dev.sh [clean|fast|logs|stop|status|shell]
#   clean  - повна перебудова (повільно)
#   fast   - швидкий запуск з кешем (за замовчуванням)
#   logs   - показати логи запущених контейнерів
#   stop   - зупинити всі контейнери
#   status - показати статус контейнерів
#   shell  - підключитися до backend контейнера

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

# Переходимо в директорію Docker
cd "$(dirname "$0")"

COMPOSE_FILE="docker-compose.dev.yml"
MODE="${1:-fast}"

# Перевіряємо чи Docker запущений
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        log_error "Docker не запущений. Будь ласка, запустіть Docker та спробуйте знову."
        exit 1
    fi
}

# Функція для показу статусу
show_status() {
    log_info "Статус контейнерів:"
    docker-compose -f $COMPOSE_FILE ps
    echo ""
    log_info "Активні порти:"
    docker-compose -f $COMPOSE_FILE port frontend 3000 2>/dev/null && echo "Frontend: http://localhost:3000" || echo "Frontend: не запущений"
    docker-compose -f $COMPOSE_FILE port backend 8080 2>/dev/null && echo "Backend: http://localhost:8080/api" || echo "Backend: не запущений"
    docker-compose -f $COMPOSE_FILE port pgadmin 80 2>/dev/null && echo "PgAdmin: http://localhost:5050" || echo "PgAdmin: не запущений"
    docker-compose -f $COMPOSE_FILE port traefik 8080 2>/dev/null && echo "Traefik: http://localhost:9090" || echo "Traefik: не запущений"
}

# Функція для зупинки
stop_containers() {
    log_info "Зупиняємо контейнери..."
    docker-compose -f $COMPOSE_FILE down
    log_success "Контейнери зупинено!"
}

# Функція для показу логів
show_logs() {
    log_info "Показуємо логи контейнерів (Ctrl+C для виходу)..."
    docker-compose -f $COMPOSE_FILE logs -f
}

# Функція для підключення до shell
connect_shell() {
    local service="${2:-backend}"
    log_info "Підключаємося до $service контейнера..."
    docker-compose -f $COMPOSE_FILE exec $service bash
}

# Функція для створення volumes
create_volumes() {
    log_info "Створюємо необхідні volumes..."
    docker volume create backend_m2_cache 2>/dev/null || true
    docker volume create frontend_node_modules 2>/dev/null || true
    docker volume create frontend_next_cache 2>/dev/null || true
    log_success "Volumes створено"
}

# Функція для швидкого запуску
fast_start() {
    log_info "🚀 Швидкий запуск з кешем..."

    check_docker
    create_volumes

    # Зупиняємо тільки якщо контейнери запущені
    if docker-compose -f $COMPOSE_FILE ps -q | grep -q .; then
        log_info "Зупиняємо попередні контейнери..."
        docker-compose -f $COMPOSE_FILE down
    fi

    # Будуємо тільки якщо образи не існують або є зміни
    log_info "Перевіряємо образи та будуємо при необхідності..."
    docker-compose -f $COMPOSE_FILE build

    # Запускаємо контейнери
    log_info "Запускаємо контейнери..."
    docker-compose -f $COMPOSE_FILE up -d

    # Чекаємо готовності
    log_info "Очікуємо готовності сервісів..."
    sleep 10

    # Показуємо статус
    show_status

    log_success "Aksi-app запущено!"
    show_usage_info
}

# Функція для повної перебудови
clean_start() {
    log_warning "🧹 Повна перебудова (це займе час)..."

    check_docker
    create_volumes

    # Зупиняємо контейнери
    log_info "Зупиняємо контейнери..."
    docker-compose -f $COMPOSE_FILE down

    # Видаляємо образи проекту
    log_info "Видаляємо старі образи проекту..."
    docker images --format "table {{.Repository}}:{{.Tag}}\t{{.ID}}" | grep -E "(docker_|docker-)" | awk '{print $2}' | xargs -r docker rmi -f 2>/dev/null || true

    # Перебудовуємо без кешу
    log_info "Перебудовуємо контейнери без кешу..."
    docker-compose -f $COMPOSE_FILE build --no-cache

    # Запускаємо
    log_info "Запускаємо контейнери..."
    docker-compose -f $COMPOSE_FILE up -d

    # Чекаємо готовності
    log_info "Очікуємо готовності сервісів..."
    sleep 15

    # Показуємо статус
    show_status

    log_success "Aksi-app перебудовано та запущено!"
    show_usage_info
}

# Функція для показу інформації про використання
show_usage_info() {
    echo ""
    log_success "🌐 Доступ до сервісів:"
    echo "   Frontend (Next.js):     http://localhost:3000"
    echo "   Backend API (Spring):   http://localhost:8080/api"
    echo "   Swagger UI:             http://localhost:8080/api/swagger-ui.html"
    echo "   PgAdmin:                http://localhost:5050 (admin@aksi.com / admin)"
    echo "   Traefik Dashboard:      http://localhost:9090"
    echo ""
    log_success "🔄 Через Traefik (рекомендовано):"
    echo "   Frontend:               http://localhost/"
    echo "   Backend API:            http://localhost/api"
    echo ""
    log_success "🛠️  Корисні команди:"
    echo "   ./start-dev.sh logs     - переглянути логи"
    echo "   ./start-dev.sh stop     - зупинити контейнери"
    echo "   ./start-dev.sh status   - статус контейнерів"
    echo "   ./start-dev.sh shell    - підключитися до backend"
    echo "   ./start-dev.sh clean    - повна перебудова"
    echo ""
    log_success "🔧 Розробка API:"
    echo "   cd frontend && npm run orval     - генерація всіх API"
    echo "   cd frontend && npm run orval:client - генерація Client API"
    echo ""
    log_success "📦 База даних:"
    echo "   Host: localhost:5432"
    echo "   DB: aksi_cleaners_db_v5"
    echo "   User: aksi_user / Pass: 1911"
}

# Головна логіка
case $MODE in
    "clean")
        clean_start
        ;;
    "fast")
        fast_start
        ;;
    "logs")
        show_logs
        ;;
    "stop")
        stop_containers
        ;;
    "status")
        show_status
        ;;
    "shell")
        connect_shell "$@"
        ;;
    *)
        echo "Використання: $0 [clean|fast|logs|stop|status|shell]"
        echo ""
        echo "Команди:"
        echo "  clean   - повна перебудова (повільно, ~5-10 хвилин)"
        echo "  fast    - швидкий запуск з кешем (за замовчуванням, ~1-2 хвилини)"
        echo "  logs    - показати логи запущених контейнерів"
        echo "  stop    - зупинити всі контейнери"
        echo "  status  - показати статус контейнерів та портів"
        echo "  shell   - підключитися до backend контейнера"
        echo ""
        echo "Приклади:"
        echo "  $0                    # швидкий запуск"
        echo "  $0 clean             # повна перебудова"
        echo "  $0 logs              # переглянути логи"
        exit 1
        ;;
esac
