#!/bin/bash

# Перевіряємо, чи працюють Docker-контейнери
if ! docker ps | grep -q "aksi-backend"; then
    echo "Помилка: Docker-контейнер бекенду не запущений"
    echo "Спочатку запустіть Docker-контейнери за допомогою run-docker.sh"
    exit 1
fi

# Переходимо до директорії frontend
cd "$(dirname "$0")/../frontend" || exit 1

# Запускаємо генерацію API клієнтів у Docker-контейнері
docker exec aksi-frontend npm run generate-api

echo "API клієнти успішно згенеровані"
