#!/bin/bash

# Скрипт для повного очищення та перезапуску Aksi-app з нуля

echo "🧹 ПОВНЕ ОЧИЩЕННЯ ТА ПЕРЕЗАПУСК Aksi-app з нуля"
echo "⚠️  Це видалить ВСІ дані з бази даних!"
echo ""
read -p "Ви впевнені? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Скасовано."
    exit 1
fi

echo "🔄 Зупиняємо всі контейнери..."
docker-compose -f docker-compose.dev.yml down -v

echo "🗑️  Видаляємо всі пов'язані Docker образи..."
docker rmi -f $(docker images | grep -E '(docker-backend|docker-frontend|docker-)' | awk '{print $3}') 2>/dev/null || true

echo "🧹 Видаляємо всі volumes проекту..."
docker volume rm $(docker volume ls | grep -E '(postgres_data_dev|pgadmin_data_dev|backend_m2_cache|frontend_node_modules|frontend_next_cache)' | awk '{print $2}') 2>/dev/null || true

echo "🧽 Очищаємо Docker систему..."
docker system prune -f

echo "🏗️  Перебудовуємо контейнери з нуля..."
docker-compose -f docker-compose.dev.yml build --no-cache --pull

echo "🚀 Запускаємо всі сервіси..."
docker-compose -f docker-compose.dev.yml up -d

echo "⏳ Чекаємо готовності сервісів..."
echo "   PostgreSQL..."
until docker exec postgres-dev pg_isready -U aksi_user -d aksi_cleaners_db_v5 2>/dev/null; do
  printf "."
  sleep 2
done
echo " ✅"

echo "   Backend (Spring Boot)..."
sleep 15  # Даємо час Spring Boot запуститися
echo " ✅"

echo ""
echo "📋 Показуємо логи для контролю запуску..."
docker-compose -f docker-compose.dev.yml logs --tail=20 backend

echo ""
echo "✅ Проект повністю перезапущено з нуля!"
echo ""
echo "🌐 Доступ до сервісів:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:8080/api"
echo "   PgAdmin: http://localhost:5050"
echo ""
echo "📋 Корисні команди:"
echo "   Логи backend: docker-compose -f docker-compose.dev.yml logs -f backend"
echo "   Логи frontend: docker-compose -f docker-compose.dev.yml logs -f frontend"
echo "   Стан сервісів: docker-compose -f docker-compose.dev.yml ps"
echo "   Зупинка: docker-compose -f docker-compose.dev.yml down"

