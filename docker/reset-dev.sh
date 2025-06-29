#!/bin/bash

# AKSI Dev Environment Reset Script
# Повна очистка та перезапуск розробницького середовища

echo "🔄 Скидання AKSI Dev Environment..."

# Переходимо в директорію Docker
cd "$(dirname "$0")"

echo "📁 Робоча директорія: $(pwd)"

# Зупиняємо всі контейнери
echo "🛑 Зупиняємо всі dev контейнери..."
docker-compose -f docker-compose.dev.yml down

# Видаляємо образи проекту
echo "🗑️ Видаляємо образи проекту..."
docker image rm -f docker_backend 2>/dev/null || true
docker image rm -f docker_frontend 2>/dev/null || true

# Видаляємо всі невикористані образи
echo "🧹 Очищуємо невикористані образи..."
docker image prune -f

# Очищуємо Maven кеш (опціонально)
read -p "🤔 Очистити Maven кеш? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️ Очищуємо Maven кеш..."
    docker volume rm backend_m2_cache 2>/dev/null || true
fi

# Очищуємо Node.js кеш (опціонально)
read -p "🤔 Очистити Node.js кеш? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️ Очищуємо Node.js кеш..."
    docker volume rm frontend_node_modules 2>/dev/null || true
    docker volume rm frontend_next_cache 2>/dev/null || true
fi

# Очищуємо дані БД (з підтвердженням)
echo "⚠️ УВАГА: Це видалить всі дані з БД!"
read -p "🤔 Очистити дані PostgreSQL? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️ Очищуємо дані PostgreSQL..."
    docker volume rm docker_postgres_data_dev 2>/dev/null || true
    docker volume rm docker_pgadmin_data_dev 2>/dev/null || true
    echo "✅ Дані БД очищені"
else
    echo "ℹ️ Дані БД збережені"
fi

# Створюємо необхідні volumes
echo "📦 Створюємо volumes..."
docker volume create backend_m2_cache 2>/dev/null || true
# postgres_data_dev та pgadmin_data_dev створюються автоматично Docker Compose з префіксом директорії
# docker volume create postgres_data_dev 2>/dev/null || true
# docker volume create pgadmin_data_dev 2>/dev/null || true
docker volume create frontend_node_modules 2>/dev/null || true
docker volume create frontend_next_cache 2>/dev/null || true

echo "✅ Скидання завершено!"
echo ""
echo "🚀 Тепер запустіть dev середовище:"
echo "   ./start-dev.sh"
echo ""
echo "   або"
echo ""
echo "   docker-compose -f docker-compose.dev.yml up --build"
