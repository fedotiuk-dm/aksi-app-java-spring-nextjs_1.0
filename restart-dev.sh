#!/bin/bash

echo "🔄 Перезапуск повного dev середовища..."

# Зупиняємо всі сервіси
echo "🛑 Зупиняємо всі сервіси..."
docker-compose -f docker/docker-compose.dev.yml down

# Очікуємо трохи
sleep 3

# Очищуємо всі данні та перезапускаємо PostgreSQL
echo "🗄️ Перезапускаємо PostgreSQL..."
docker-compose -f docker/docker-compose.dev.yml up -d postgres

# Очікуємо поки PostgreSQL запуститься
echo "⏳ Очікуємо запуску PostgreSQL..."
sleep 10

# Перевіряємо здоров'я PostgreSQL
echo "🔍 Перевіряємо стан PostgreSQL..."
docker-compose -f docker/docker-compose.dev.yml exec postgres pg_isready -U aksi_user -d aksi_cleaners_db_v5

# Запускаємо всі інші сервіси
echo "🚀 Запускаємо всі сервіси..."
docker-compose -f docker/docker-compose.dev.yml up -d

# Показуємо статус
echo "📊 Статус сервісів:"
docker-compose -f docker/docker-compose.dev.yml ps

echo "✅ Готово! Dev середовище перезапущено."
echo "🌐 Доступ:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend: http://localhost:8080"
echo "   - PgAdmin: http://localhost:5050"
echo "   - Traefik Dashboard: http://localhost:9090"
echo "   - Portainer: http://localhost:9000"
