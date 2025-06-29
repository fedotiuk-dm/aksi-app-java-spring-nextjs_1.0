#!/bin/bash

# AKSI Dev Environment Startup Script
# Запуск розробницького середовища з hot reload

echo "🚀 Запуск AKSI Dev Environment..."

# Перевіряємо чи Docker запущений
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker не запущений. Будь ласка, запустіть Docker та спробуйте знову."
    exit 1
fi

# Переходимо в директорію Docker
cd "$(dirname "$0")"

echo "📁 Робоча директорія: $(pwd)"

# Зупиняємо існуючі контейнери якщо вони запущені
echo "🛑 Зупиняємо існуючі dev контейнери..."
docker-compose -f docker-compose.dev.yml down

# Видаляємо старі images для backend (щоб пересобрати з новими змінами)
echo "🗑️ Видаляємо старий backend image..."
docker image rm -f docker_backend 2>/dev/null || true

# Створюємо необхідні volumes якщо вони не існують
echo "📦 Створюємо volumes..."
docker volume create backend_m2_cache 2>/dev/null || true
# postgres_data_dev та pgadmin_data_dev створюються автоматично Docker Compose з префіксом директорії
# docker volume create postgres_data_dev 2>/dev/null || true
# docker volume create pgadmin_data_dev 2>/dev/null || true
# docker volume create frontend_node_modules 2>/dev/null || true # ТИМЧАСОВО ВІДКЛЮЧЕНО
# docker volume create frontend_next_cache 2>/dev/null || true # ТИМЧАСОВО ВІДКЛЮЧЕНО

# Збираємо та запускаємо сервіси
echo "🔨 Збираємо та запускаємо dev середовище..."
docker-compose -f docker-compose.dev.yml up --build -d

echo "⏳ Очікуємо запуск сервісів..."



# Перевіряємо PostgreSQL
echo "🐘 Перевіряємо PostgreSQL..."
for i in {1..30}; do
    if docker exec postgres-dev pg_isready -U aksi_user -d aksi_cleaners_db_v5 >/dev/null 2>&1; then
        echo "✅ PostgreSQL готовий!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ PostgreSQL не запустився"
        exit 1
    fi
    echo "⏳ Очікуємо PostgreSQL... ($i/30)"
    sleep 2
done

# Даємо трохи часу PostgreSQL на повний запуск
sleep 3

echo "✅ PostgreSQL запущено, інші сервіси стартують..."

# Показуємо логи контейнерів в реальному часі
echo ""
echo "🚀 AKSI Dev Environment запущено!"
echo ""
echo "📋 Доступні сервіси:"
echo "   🔧 Backend API:     http://localhost:8080/api"
echo "   📚 Swagger UI:      http://localhost:8080/api/swagger-ui.html"
echo "   📊 PgAdmin:         http://localhost:5050 (admin@aksi.com / admin)"
echo "   🐛 Debug Port:      localhost:5005"
echo "   🔀 Traefik:         http://localhost:9090"
echo ""
echo "📦 База даних: PostgreSQL localhost:5432 (aksi_cleaners_db_v5)"
echo ""
echo "📜 Логи контейнерів (Ctrl+C для виходу):"
echo "════════════════════════════════════════════════════════════════"

# Показуємо логи контейнерів відразу
docker-compose -f docker-compose.dev.yml logs -f

# Інструкції після виходу з логів
echo "📋 Доступні сервіси:"
echo "   🔧 Backend API:     http://localhost:8080/api"
echo "   📚 Swagger UI:      http://localhost:8080/api/swagger-ui.html"
echo "   📊 PgAdmin:         http://localhost:5050 (admin@aksi.com / admin)"
echo "   🐛 Debug Port:      localhost:5005"
echo "   🔀 Traefik:         http://localhost:9090"
echo ""
echo "❓ Додаткові команди:"
echo "   Перегляд логів: docker-compose -f docker-compose.dev.yml logs -f"
echo "   Зупинка: docker-compose -f docker-compose.dev.yml down"
