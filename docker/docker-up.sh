#!/bin/bash

echo "====================================="
echo "Запуск проекту Aksi у Docker"
echo "====================================="
echo "Java: 21.0.6 LTS"
echo "Spring Boot: 3.4.4"
echo "PostgreSQL: 17.4"
echo "Node.js: 23.9.0"
echo "Next.js: 15.3.0"
echo "React: 19.0.0"
echo "====================================="
echo ""

# Переконуємося, що ми в папці docker
cd "$(dirname "$0")"

# Встановлення прав на виконання для файлів pgadmin
chmod 600 pgadmin/pgpass

# Опції для зупинки контейнерів
echo "Виберіть опцію:"
echo "1. Тільки перезавантажити frontend та backend (збереже базу даних)"
echo "2. Зупинити всі контейнери (збереже базу даних)"
echo "3. Зупинити і видалити всі контейнери, включаючи базу даних (всі дані будуть втрачені)"
echo "4. Не зупиняти - тільки запустити те, що не запущено"
echo "5. Перезавантажити тільки backend (після зміни сутностей/міграцій БД)"
read -p "Виберіть опцію (1-5): " container_option

case $container_option in
  1)
    echo "Перезавантаження frontend та backend..."
    docker compose stop frontend backend
    docker compose rm -f frontend backend
    ;;
  2)
    echo "Зупинка всіх контейнерів..."
    docker compose down
    ;;
  3)
    echo "Зупинка і видалення всіх контейнерів та даних..."
    docker compose down -v
    ;;
  4)
    echo "Продовжуємо без зупинки контейнерів..."
    ;;
  5)
    echo "Перезавантаження тільки backend для застосування змін у сутностях БД..."
    docker compose stop backend
    docker compose rm -f backend
    
    echo "Перевірка статусу бази даних..."
    if ! docker compose ps | grep -q "aksi-postgres.*healthy"; then
      echo "PostgreSQL не запущений або не в стані healthy. Запускаємо..."
      docker compose up -d postgres
      echo "Очікування готовності PostgreSQL..."
      sleep 10
    fi
    
    read -p "Чи потрібно очистити таблиці перед застосуванням нових міграцій? (y/n): " clean_db
    if [ "$clean_db" = "y" ]; then
      echo "Введіть назви таблиць для очищення (через пробіл):"
      read table_names
      
      for table in $table_names; do
        echo "Очищення таблиці $table..."
        docker compose exec postgres psql -U aksi_user -d aksi_cleaners_db_v5 -c "DELETE FROM $table;"
      done
    fi
    ;;
  *)
    echo "Невірний вибір. Продовжуємо без зупинки контейнерів..."
    ;;
esac

# Збірка та запуск контейнерів
echo ""
echo "Збірка та запуск контейнерів..."
docker compose up -d --build

echo ""
echo "Очікування готовності послуг..."
sleep 5

# Перевірка статусу контейнерів
docker compose ps

# Якщо це був перезапуск бекенду після зміни сутностей
if [ "$container_option" = "5" ]; then
  echo ""
  echo "Перевірка логів міграції Liquibase..."
  sleep 5
  docker logs aksi-backend | grep -i "liquibase\|migration\|changelog" | tail -15
  
  echo ""
  echo "Бажаєте перевірити структуру таблиць? (y/n): "
  read check_structure
  if [ "$check_structure" = "y" ]; then
    echo "Введіть назву таблиці для перевірки (залиште порожнім для списку всіх таблиць):"
    read table_name
    
    if [ -z "$table_name" ]; then
      docker compose exec postgres psql -U aksi_user -d aksi_cleaners_db_v5 -c "\dt"
    else
      docker compose exec postgres psql -U aksi_user -d aksi_cleaners_db_v5 -c "\d $table_name"
    fi
  fi
fi

echo ""
echo "Контейнери запущені!"
echo "====================================="
echo "Сервіси доступні за адресами:"
echo "- Фронтенд: http://localhost:3000"
echo "- API: http://localhost:8080/api"
echo "- Swagger: http://localhost:8080/api/swagger-ui/index.html"
echo "- PgAdmin: http://localhost:5050 (логін: admin@aksi.com, пароль: admin)"
echo "- Actuator: http://localhost:8080/api/actuator/loggers"
echo ""
echo "PostgreSQL:"
echo "  • Хост: postgres"
echo "  • Порт: 5432"
echo "  • База даних: aksi_cleaners_db_v5"
echo "  • Користувач: aksi_user"
echo "  • Пароль: 1911"
echo ""
echo "Перегляд логів:"
echo "- Фронтенд: docker logs -f aksi-frontend"
echo "- Бекенд: docker logs -f aksi-backend"
echo "- PostgreSQL: docker logs -f aksi-postgres"
echo ""
echo "Обслуговування бази даних:"
echo "- Вхід в консоль PostgreSQL: docker compose exec postgres psql -U aksi_user -d aksi_cleaners_db_v5"
echo "- Очищення таблиці: docker compose exec postgres psql -U aksi_user -d aksi_cleaners_db_v5 -c \"DELETE FROM table_name;\""
echo "- Перегляд структури таблиці: docker compose exec postgres psql -U aksi_user -d aksi_cleaners_db_v5 -c \"\\d table_name\""
echo ""
echo "Для зупинки контейнерів використовуйте:"
echo "docker compose down"
echo "=====================================" 