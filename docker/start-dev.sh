#!/bin/bash

# AKSI Dev Environment Startup Script
# Запуск розробницького середовища з hot reload (Backend + Frontend)

echo "🚀 Запуск AKSI Full Stack Dev Environment..."

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

# Видаляємо старі images для backend і frontend (щоб пересобрати з новими змінами)
echo "🗑️ Видаляємо старі images..."
docker image rm -f docker_backend 2>/dev/null || true
docker image rm -f docker_frontend 2>/dev/null || true

# Створюємо необхідні volumes якщо вони не існують
echo "📦 Створюємо volumes..."
docker volume create backend_m2_cache 2>/dev/null || true
docker volume create frontend_node_modules 2>/dev/null || true
docker volume create frontend_next_cache 2>/dev/null || true
# postgres_data_dev та pgadmin_data_dev створюються автоматично Docker Compose з префіксом директорії

# Збираємо та запускаємо сервіси поетапно
echo "🔨 Збираємо infrastructure сервіси (DB, PgAdmin, Traefik)..."
docker-compose -f docker-compose.dev.yml up --build -d postgres pgadmin traefik

echo "⏳ Очікуємо запуск infrastructure..."

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

# Запускаємо Backend
echo "🔨 Збираємо та запускаємо Backend..."
docker-compose -f docker-compose.dev.yml up --build -d backend

# Перевіряємо Backend
echo "🚀 Перевіряємо Backend..."
for i in {1..60}; do
    if curl -f -s http://localhost:8080/api/actuator/health >/dev/null 2>&1; then
        echo "✅ Backend готовий!"
        break
    fi
    if [ $i -eq 60 ]; then
        echo "❌ Backend не запустився"
        docker-compose -f docker-compose.dev.yml logs backend
        exit 1
    fi
    echo "⏳ Очікуємо Backend... ($i/60)"
    sleep 3
done

# Запускаємо Frontend
echo "🔨 Збираємо та запускаємо Frontend..."
docker-compose -f docker-compose.dev.yml up --build -d frontend

# Перевіряємо Frontend
echo "🌐 Перевіряємо Frontend..."
for i in {1..40}; do
    if curl -f -s http://localhost:3000 >/dev/null 2>&1; then
        echo "✅ Frontend готовий!"
        break
    fi
    if [ $i -eq 40 ]; then
        echo "❌ Frontend не запустився"
        docker-compose -f docker-compose.dev.yml logs frontend
        exit 1
    fi
    echo "⏳ Очікуємо Frontend... ($i/40)"
    sleep 3
done

echo "✅ Всі сервіси запущено успішно!"

# Показуємо логи контейнерів в реальному часі
echo ""
echo "🚀 AKSI Full Stack Dev Environment запущено!"
echo ""
echo "📋 Доступні сервіси:"
echo "   🌐 Frontend:        http://localhost:3000"
echo "   🔧 Backend API:     http://localhost:8080/api"
echo "   📚 Swagger UI:      http://localhost:8080/api/swagger-ui.html"
echo "   📊 PgAdmin:         http://localhost:5050 (admin@aksi.com / admin)"
echo "   🐛 Debug Port:      localhost:5005"
echo "   🔀 Traefik:         http://localhost:9090"
echo ""
echo "🔄 Через Traefik (рекомендовано):"
echo "   🌐 Frontend:        http://localhost/"
echo "   🔧 Backend API:     http://localhost/api"
echo ""
echo "📦 База даних: PostgreSQL localhost:5432 (aksi_cleaners_db_v5)"
echo ""
echo "🔧 Для розробки frontend:"
echo "   cd frontend && npm run orval:client - генерація API клієнта"
echo "   cd frontend && npm run orval - генерація всіх API"
echo ""
echo "📜 Логи контейнерів (Ctrl+C для виходу):"
echo "════════════════════════════════════════════════════════════════"

# Показуємо логи контейнерів відразу
docker-compose -f docker-compose.dev.yml logs -f

# Інструкції після виходу з логів
echo ""
echo "📋 Доступні сервіси:"
echo "   🌐 Frontend:        http://localhost:3000"
echo "   🔧 Backend API:     http://localhost:8080/api"
echo "   📚 Swagger UI:      http://localhost:8080/api/swagger-ui.html"
echo "   📊 PgAdmin:         http://localhost:5050 (admin@aksi.com / admin)"
echo "   🐛 Debug Port:      localhost:5005"
echo "   🔀 Traefik:         http://localhost:9090"
echo ""
echo "❓ Додаткові команди:"
echo "   Перегляд логів: docker-compose -f docker-compose.dev.yml logs -f"
echo "   Зупинка: docker-compose -f docker-compose.dev.yml down"
echo "   Перегляд статусу: docker-compose -f docker-compose.dev.yml ps"
