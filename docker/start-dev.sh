#!/bin/bash

# Скрипт для запуску Aksi-app у режимі розробки

echo "🚀 Запуск Aksi-app у режимі розробки"

# Зупиняємо всі контейнери, якщо вони запущені
echo "🔄 Зупиняємо попередні контейнери..."
docker-compose -f docker-compose.dev.yml down

# Видаляємо всі існуючі образи для dev-середовища
echo "🧹 Видаляємо старі образи..."
docker rmi -f $(docker images | grep '*-dev' | awk '{print $3}') 2>/dev/null || true

# Перебудовуємо контейнери без кешу
echo "🏗️ Перебудовуємо контейнери без кешу..."
docker-compose -f docker-compose.dev.yml build --no-cache

# Запускаємо контейнери
echo "▶️ Запускаємо контейнери..."
docker-compose -f docker-compose.dev.yml up -d

# Показуємо логи
echo "📋 Показуємо логи контейнерів..."
echo "Для виходу з логів натисніть Ctrl+C"
echo "Це НЕ зупинить контейнери!"
docker-compose -f docker-compose.dev.yml logs -f

# Інструкції після виходу з логів
echo "✅ Контейнери запущено!"
echo "🌐 Доступ до сервісів:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:8080/api"
echo "   PgAdmin: http://localhost:5050"
echo ""
echo "❓ Додаткові команди:"
echo "   Перегляд логів: docker-compose -f docker-compose.dev.yml logs -f"
echo "   Зупинка: docker-compose -f docker-compose.dev.yml down"
