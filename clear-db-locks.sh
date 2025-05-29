#!/bin/bash

echo "🧹 Очищення блокувань бази даних для розробки..."

# Зупиняємо backend якщо запущений
echo "🛑 Зупиняємо backend..."
docker-compose -f docker/docker-compose.dev.yml stop backend

# Очищуємо locks в PostgreSQL
echo "🔓 Очищуємо Liquibase locks..."
docker-compose -f docker/docker-compose.dev.yml exec postgres psql -U aksi_user -d aksi_cleaners_db_v5 -c "
UPDATE databasechangeloglock SET locked = false WHERE id = 1;
DELETE FROM databasechangeloglock WHERE locked = true;
"

# Перевіряємо стан locks
echo "📊 Перевіряємо стан locks..."
docker-compose -f docker/docker-compose.dev.yml exec postgres psql -U aksi_user -d aksi_cleaners_db_v5 -c "
SELECT * FROM databasechangeloglock;
"

# Запускаємо backend знову
echo "🚀 Запускаємо backend..."
docker-compose -f docker/docker-compose.dev.yml up -d backend

echo "✅ Готово! Backend повинен запуститися без проблем з БД."
