#!/bin/bash

# Очищення екрану
clear

# Вивід інформації про доступні опції
echo "Виберіть дію:"
echo "1) Зупинити всі контейнери перед запуском"
echo "2) Зупинити та видалити всі контейнери перед запуском"
echo "3) Перезапустити тільки backend"
echo "4) Продовжити без зупинки контейнерів"
echo "5) Очистити БД і застосувати міграції з нуля"
echo "6) Вийти"
echo -n "Ваш вибір [1-6]: "

read choice

case $choice in
  1)
    echo "Зупинка всіх контейнерів..."
    docker compose stop
    ;;
  2)
    echo "Зупинка та видалення всіх контейнерів..."
    docker compose down
    ;;
  3)
    echo "Перезапуск backend..."
    docker compose restart backend
    exit 0
    ;;
  4)
    echo "Продовжуємо без зупинки контейнерів..."
    ;;
  5)
    echo "Повна очистка БД та застосування міграцій з нуля..."
    
    # Зупиняємо та видаляємо контейнери
    docker compose down
    
    # Видаляємо том з даними PostgreSQL
    read -p "Ви впевнені, що хочете повністю видалити дані БД? (y/n): " confirm_delete
    if [ "$confirm_delete" = "y" ]; then
      echo "Видалення томів БД..."
      docker volume rm $(docker volume ls -q | grep aksi-db-data) 2>/dev/null || echo "Томи БД не знайдено або вже видалено"
      
      # Запускаємо тільки PostgreSQL
      echo "Запуск PostgreSQL..."
      docker compose up -d postgres
      
      # Очікуємо, доки PostgreSQL буде готовий
      echo "Очікування готовності PostgreSQL (це може зайняти до 30 секунд)..."
      for i in {1..30}; do
        if docker compose exec -T postgres pg_isready -U aksi_user; then
          echo "PostgreSQL готовий до роботи"
          break
        fi
        echo "Очікування готовності PostgreSQL ($i/30)..."
        sleep 1
      done
      
      # Видаляємо всі таблиці (якщо вони залишилися)
      echo "Видалення всіх таблиць..."
      docker compose exec -T postgres psql -U aksi_user -d postgres -c "DROP DATABASE IF EXISTS aksi_cleaners_db_v5;"
      docker compose exec -T postgres psql -U aksi_user -d postgres -c "CREATE DATABASE aksi_cleaners_db_v5;"
      
      # Запускаємо всі сервіси
      echo "Запуск всіх сервісів..."
      docker compose up -d --build
      
      echo "Базу даних було повністю очищено. Застосовуються міграції з нуля..."
    else
      echo "Скасовано. Запускаються поточні контейнери без змін..."
      docker compose up -d --build
    fi
    exit 0
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
echo "Готово! Всі сервіси запущено."