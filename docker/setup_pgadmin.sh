#!/bin/bash

# Встановлення правильних дозволів для файлу паролів
chmod 600 pgadmin/pgpass

echo "Зупинка існуючих контейнерів..."
docker compose down

echo "Запуск PostgreSQL та PgAdmin з оновленими налаштуваннями..."
docker compose up -d

echo "====================================="
echo "Налаштування PgAdmin завершено!"
echo "====================================="
echo ""
echo "PgAdmin доступний за адресою: http://localhost:5050"
echo "Облікові дані для входу:"
echo "  Email: admin@aksi.com"
echo "  Пароль: admin"
echo ""
echo "Сервер PostgreSQL буде доступний автоматично як 'AKSI PostgreSQL'"
echo "Нові налаштування з'єднання:"
echo "  Хост: postgres (ім'я контейнера в Docker-мережі)"
echo "  Порт: 5432"
echo "  База даних: aksi_cleaners_db_v5"
echo "  Ім'я користувача: aksi_user"
echo "  Пароль: 1911"
echo ""
echo "Рядок з'єднання для локальної розробки:"
echo "DATABASE_URL=\"postgresql://aksi_user:1911@localhost:5432/aksi_cleaners_db_v5?schema=public\""
echo ""
echo "У випадку проблем з підключенням, спробуйте:"
echo "1. Перезапустити контейнери командою:"
echo "   docker compose restart"
echo "2. Перевірити мережевий доступ між контейнерами:"
echo "   docker exec -it aksi-pgadmin ping postgres"

echo "Якщо сервер не відображається автоматично, додайте його вручну:"
echo "1. Клікніть правою кнопкою на 'Servers' -> Create -> Server..."
echo "2. На вкладці 'General' введіть ім'я: AKSI PostgreSQL"
echo "3. На вкладці 'Connection' введіть:"
echo "   Хост: host.docker.internal (або 172.17.0.1, якщо не працює)"
echo "   Порт: 5432"
echo "   База даних: aksi_cleaners_db_v5"
echo "   Ім'я користувача: aksi_user"
echo "   Пароль: 1911"
echo ""
echo "Спробуйте також використати налаштування з DATABASE_URL:"
echo "postgresql://aksi_user:1911@localhost:5432/aksi_cleaners_db_v5?schema=public"
echo ""
echo "Якщо не вдається підключитися, спробуйте використати IP-адресу вашого хоста замість host.docker.internal"
echo "Знайдіть IP-адресу командою:"
echo "ip addr show docker0 | grep -Po 'inet \K[\d.]+'" 