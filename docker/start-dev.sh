#!/bin/bash

# 🚀 Скрипт для запуску Aksi-app у режимі розробки
# Використання:
#   ./start-dev.sh [clean|fast|turbo|reset|clean-volumes|logs|stop|status|shell] [--silent]
#   clean        - повна перебудова (повільно)
#   fast         - швидкий запуск з кешем (за замовчуванням)
#   turbo        - максимально швидкий запуск (очищує npm кеші для уникнення провірки provenance)
#   reset        - повне очищення бази даних та міграцій (вирішує Liquibase конфлікти)
#   clean-volumes - очищує всі Docker volumes (вирішує WARN про існуючі volumes)
#   logs         - показати логи запущених контейнерів
#   stop         - зупинити всі контейнери
#   status       - показати статус контейнерів
#   shell        - підключитися до backend контейнера
#   --silent     - приховати логи запуску (за замовчуванням показуються)

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

# Обробник CTRL+C для показу інформації про сервіси
cleanup_on_exit() {
    echo ""
    log_info "🛑 Перервано користувачем (Ctrl+C)"
    echo ""
    show_usage_info
    exit 0
}

# Функція для копіювання CSV файлів в PostgreSQL контейнер
copy_csv_files() {
    log_info "Копіюємо CSV файли в PostgreSQL контейнер..."

    # Очікуємо готовності PostgreSQL
    for i in {1..10}; do
        if docker exec postgres-dev pg_isready -U aksi_user -d aksi_cleaners_db_v5 >/dev/null 2>&1; then
            break
        fi
        log_info "Очікуємо PostgreSQL ($i/10)..."
        sleep 2
    done

    # Копіюємо price_list.csv
    if [ -f "../scripts/price_list/price_list.csv" ]; then
        docker cp ../scripts/price_list/price_list.csv postgres-dev:/price_list.csv 2>/dev/null && \
        log_success "price_list.csv скопійовано" || \
        log_warning "Не вдалося скопіювати price_list.csv"
    else
        log_warning "Файл price_list.csv не знайдено"
    fi
}

# Функція для запуску контейнерів з відображенням логів
start_containers_with_logs() {
    local build_mode="$1"

    # Будуємо контейнери
    if [ "$build_mode" = "no-cache" ]; then
        log_info "Перебудовуємо контейнери без кешу..."
        docker-compose -f $COMPOSE_FILE build --no-cache
    else
        log_info "Перевіряємо образи та будуємо при необхідності..."
        docker-compose -f $COMPOSE_FILE build
    fi

    # Запускаємо контейнери
    log_info "Запускаємо контейнери..."
    if [ "$SILENT_MODE" = "true" ]; then
        docker-compose -f $COMPOSE_FILE up -d
        copy_csv_files
        sleep 5
    else
        log_info "📺 Показуємо логи запуску в реальному часі (Ctrl+C щоб зупинити логи, але залишити контейнери)..."
        echo ""
        # Запускаємо в фоні
        docker-compose -f $COMPOSE_FILE up -d
        copy_csv_files

        # Показуємо логи в реальному часі
        log_info "🔍 Логи запуску:"
        timeout 30 docker-compose -f $COMPOSE_FILE logs -f || true
        echo ""
        log_info "⏱️  Логи запуску завершені (30 сек). Контейнери продовжують працювати."
    fi
}

# Переходимо в директорію Docker
cd "$(dirname "$0")"

COMPOSE_FILE="docker-compose.dev.yml"
MODE="${1:-fast}"
SILENT_MODE=false

# Перевіряємо --silent флаг в усіх аргументах
for arg in "$@"; do
    if [ "$arg" = "--silent" ]; then
        SILENT_MODE=true
        break
    fi
done

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
    echo ""
    show_usage_info
}

# Функція для показу логів
show_logs() {
    log_info "Показуємо логи контейнерів (Ctrl+C для виходу)..."
    docker-compose -f $COMPOSE_FILE logs -f
    echo ""
    show_usage_info
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
    # Volumes будуть створені автоматично docker-compose з правильними назвами
    # docker_backend_m2_cache, docker_frontend_node_modules, etc.
    log_success "Volumes підготовлено для створення"
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

    # Запускаємо з логами
    start_containers_with_logs "cache"

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

    # Запускаємо з повною перебудовою та логами
    start_containers_with_logs "no-cache"

    # Показуємо статус
    show_status

    log_success "Aksi-app перебудовано та запущено!"
    show_usage_info
}

# Функція для турбо запуску (очищення npm кешів)
turbo_start() {
    log_warning "🚀 ТУРБО режим - очищуємо npm кеші для уникнення provenance перевірки..."

    check_docker
    create_volumes

    # Зупиняємо контейнери
    log_info "Зупиняємо контейнери..."
    docker-compose -f $COMPOSE_FILE down

    # Очищуємо npm кеші в Docker volumes
    log_info "Очищуємо npm кеш volume..."
    docker volume rm docker_frontend_npm_cache 2>/dev/null || true
    # Volume буде створений автоматично docker-compose

    # Запускаємо з логами
    start_containers_with_logs "cache"

    # Показуємо статус
    show_status

    log_success "Aksi-app запущено в ТУРБО режимі!"
    show_usage_info
}

# Функція для повного скидання бази даних
reset_database() {
    log_warning "🗄️ RESET режим - повне очищення бази даних!"

    if [ -f "./reset-database.sh" ]; then
        log_info "Запускаємо скрипт очищення бази даних..."
        chmod +x ./reset-database.sh
        ./reset-database.sh
    else
        log_error "Файл reset-database.sh не знайдено!"
        exit 1
    fi
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
    echo "   ./start-dev.sh logs              - переглянути логи"
    echo "   ./start-dev.sh stop              - зупинити контейнери"
    echo "   ./start-dev.sh status            - статус контейнерів"
    echo "   ./start-dev.sh shell             - підключитися до backend"
    echo "   ./start-dev.sh turbo             - швидкий запуск (очищує npm кеші)"
    echo "   ./start-dev.sh reset             - очищення БД (вирішує Liquibase конфлікти)"
    echo "   ./start-dev.sh clean-volumes     - очищення volumes (вирішує WARN про volumes)"
    echo "   ./start-dev.sh clean             - повна перебудова"
    echo "   ./start-dev.sh fast --silent     - швидкий запуск без логів"
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

# Встановлюємо обробник сигналу SIGINT (Ctrl+C)
trap cleanup_on_exit SIGINT

# Головна логіка
case $MODE in
    "clean")
        clean_start
        ;;
    "fast")
        fast_start
        ;;
    "turbo")
        turbo_start
        ;;
    "reset")
        reset_database
        ;;
    "clean-volumes")
        log_info "🧹 РЕЖИМ: Очищення всіх volumes"
        if [ -f "./clean-volumes.sh" ]; then
            chmod +x ./clean-volumes.sh
            ./clean-volumes.sh
        else
            log_error "Файл clean-volumes.sh не знайдено!"
            exit 1
        fi
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
        echo "Використання: $0 [clean|fast|turbo|reset|clean-volumes|logs|stop|status|shell] [--silent]"
        echo ""
        echo "Команди:"
        echo "  clean        - повна перебудова (повільно, ~5-10 хвилин)"
        echo "  fast         - швидкий запуск з кешем (за замовчуванням, ~1-2 хвилини)"
        echo "  turbo        - максимально швидкий запуск (очищує npm кеші)"
        echo "  reset        - повне очищення бази даних (вирішує Liquibase конфлікти)"
        echo "  clean-volumes - очищує всі Docker volumes (вирішує WARN про існуючі volumes)"
        echo "  logs         - показати логи запущених контейнерів"
        echo "  stop         - зупинити всі контейнери"
        echo "  status       - показати статус контейнерів та портів"
        echo "  shell        - підключитися до backend контейнера"
        echo ""
        echo "Опції:"
        echo "  --silent     - приховати логи запуску (за замовчуванням показуються)"
        echo ""
        echo "Приклади:"
        echo "  $0                    # швидкий запуск з логами"
        echo "  $0 fast --silent     # швидкий запуск без логів"
        echo "  $0 clean             # повна перебудова з логами"
        echo "  $0 clean-volumes     # очистити volumes"
        echo "  $0 logs              # переглянути логи"
        exit 1
        ;;
esac
