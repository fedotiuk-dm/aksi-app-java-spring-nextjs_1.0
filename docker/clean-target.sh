#!/bin/bash

# Швидка очистка target директорії для регенерації OpenAPI файлів

echo "🧹 Очищаємо target директорію..."

# Зупиняємо backend контейнер
docker-compose -f docker-compose.dev.yml stop backend

# Очищаємо target з правильними правами
if [ -d "../backend/target" ]; then
    echo "Видаляємо ../backend/target..."
    sudo rm -rf ../backend/target 2>/dev/null || rm -rf ../backend/target
    echo "✅ Target директорія очищена"
else
    echo "ℹ️ Target директорія вже відсутня"
fi

# Запускаємо backend контейнер знову
echo "🚀 Запускаємо backend контейнер..."
docker-compose -f docker-compose.dev.yml up -d backend

echo "✅ Готово! OpenAPI файли будуть регенеровані при наступній збірці."
