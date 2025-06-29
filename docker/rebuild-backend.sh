#!/bin/bash

# Скрипт для перебудови backend контейнера з очисткою
# Вирішує проблеми з правами доступу до target директорії

echo "🔄 Зупиняємо backend контейнер..."
docker-compose -f docker-compose.dev.yml stop backend

echo "🗑️ Видаляємо старий контейнер та volume..."
docker-compose -f docker-compose.dev.yml rm -f backend
docker volume rm docker_backend_m2_cache 2>/dev/null || true

echo "🧹 Очищаємо target директорію..."
sudo rm -rf ../backend/target 2>/dev/null || rm -rf ../backend/target

echo "🔨 Перебудовуємо backend контейнер..."
docker-compose -f docker-compose.dev.yml build --no-cache backend

echo "🚀 Запускаємо backend контейнер..."
docker-compose -f docker-compose.dev.yml up -d backend

echo "📋 Статус контейнерів:"
docker-compose -f docker-compose.dev.yml ps

echo "📝 Логи backend контейнера (натисніть Ctrl+C для виходу):"
docker-compose -f docker-compose.dev.yml logs -f backend
