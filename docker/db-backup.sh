#!/bin/bash

# Кольори для виводу
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Назва контейнера PostgreSQL
CONTAINER_NAME="aksi-postgres"

# Дані для підключення до локальної бази
DB_NAME="aksi_cleaners_db_v5"
DB_USER="aksi_user"
DB_PASSWORD="1911"
DB_PORT="5432"
DB_HOST="localhost"

# Папка для зберігання резервних копій
BACKUP_DIR="/home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/docker/backups"
mkdir -p $BACKUP_DIR

# Створення імені файлу з поточною датою і часом
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/aksi_db_backup_$TIMESTAMP.dump"
SQL_BACKUP_FILE="$BACKUP_DIR/aksi_db_backup_$TIMESTAMP.sql"

echo -e "${BLUE}====================================${NC}"
echo -e "${BLUE}   Резервне копіювання бази даних   ${NC}"
echo -e "${BLUE}====================================${NC}"

# Меню вибору операції
echo -e "${YELLOW}Виберіть операцію:${NC}"
echo "1. Створити резервну копію локальної бази"
echo "2. Створити резервну копію бази в Docker-контейнері"
echo "3. Імпортувати резервну копію в Docker"
echo "4. Імпортувати резервну копію в локальну базу"
echo -e "5. Вийти\n"
read -p "Ваш вибір (1-5): " choice

case $choice in
    1)
        echo -e "\n${YELLOW}Створення резервної копії локальної бази...${NC}"
        
        # Запитуємо пароль, якщо необхідно
        export PGPASSWORD="$DB_PASSWORD"
        
        # Створення дампу у форматі Custom (для pg_restore)
        pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -F c -v -f "$BACKUP_FILE"
        DUMP_STATUS=$?
        
        # Створення SQL-скрипту для резервного способу відновлення
        pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -v > "$SQL_BACKUP_FILE"
        SQL_STATUS=$?
        
        if [ $DUMP_STATUS -eq 0 ] && [ $SQL_STATUS -eq 0 ]; then
            echo -e "${GREEN}Резервна копія успішно створена:${NC}"
            echo -e "${GREEN}- Binary формат: $BACKUP_FILE${NC}"
            echo -e "${GREEN}- SQL формат: $SQL_BACKUP_FILE${NC}"
        else
            echo -e "${RED}Помилка створення резервної копії!${NC}"
            exit 1
        fi
        ;;
        
    2)
        echo -e "\n${YELLOW}Створення резервної копії з Docker-контейнера...${NC}"
        
        # Перевірка чи існує контейнер і чи працює
        if ! docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
            echo -e "${RED}Контейнер $CONTAINER_NAME не запущений або не існує!${NC}"
            exit 1
        fi
        
        # Створення дампу безпосередньо з контейнера
        docker exec -t $CONTAINER_NAME pg_dump -U $DB_USER -d $DB_NAME -F c -f "/tmp/docker_backup.dump"
        DUMP_STATUS=$?
        
        # Копіювання дампу з контейнера
        docker cp $CONTAINER_NAME:/tmp/docker_backup.dump "$BACKUP_FILE"
        COPY_STATUS=$?
        
        # Створення SQL-дампу
        docker exec -t $CONTAINER_NAME pg_dump -U $DB_USER -d $DB_NAME > "$SQL_BACKUP_FILE"
        SQL_STATUS=$?
        
        if [ $DUMP_STATUS -eq 0 ] && [ $COPY_STATUS -eq 0 ] && [ $SQL_STATUS -eq 0 ]; then
            echo -e "${GREEN}Резервна копія з Docker успішно створена:${NC}"
            echo -e "${GREEN}- Binary формат: $BACKUP_FILE${NC}"
            echo -e "${GREEN}- SQL формат: $SQL_BACKUP_FILE${NC}"
        else
            echo -e "${RED}Помилка створення резервної копії з Docker!${NC}"
            exit 1
        fi
        ;;
        
    3)
        echo -e "\n${YELLOW}Імпорт резервної копії в Docker...${NC}"
        
        # Перевірка чи існує контейнер і чи працює
        if ! docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
            echo -e "${RED}Контейнер $CONTAINER_NAME не запущений або не існує!${NC}"
            exit 1
        fi
        
        # Отримання списку файлів дампів
        DUMP_FILES=($BACKUP_DIR/aksi_db_backup_*.dump)
        SQL_FILES=($BACKUP_DIR/aksi_db_backup_*.sql)
        
        if [ ${#DUMP_FILES[@]} -eq 0 ] && [ ${#SQL_FILES[@]} -eq 0 ]; then
            echo -e "${RED}Не знайдено файлів дампу в $BACKUP_DIR!${NC}"
            exit 1
        fi
        
        echo -e "${YELLOW}Доступні дампи:${NC}"
        
        # Вивід списку доступних файлів дампів
        COMBINED_FILES=()
        
        for ((i=0; i<${#DUMP_FILES[@]}; i++)); do
            if [ -f "${DUMP_FILES[$i]}" ]; then
                echo "$((i+1)). ${DUMP_FILES[$i]} (Binary)"
                COMBINED_FILES+=("${DUMP_FILES[$i]}")
            fi
        done
        
        for ((i=0; i<${#SQL_FILES[@]}; i++)); do
            if [ -f "${SQL_FILES[$i]}" ]; then
                j=$((i + ${#DUMP_FILES[@]}))
                echo "$((j+1)). ${SQL_FILES[$i]} (SQL)"
                COMBINED_FILES+=("${SQL_FILES[$i]}")
            fi
        done
        
        # Вибір файлу для імпорту
        read -p "Виберіть номер файлу для імпорту: " file_num
        
        if [ "$file_num" -le 0 ] || [ "$file_num" -gt ${#COMBINED_FILES[@]} ]; then
            echo -e "${RED}Невірний вибір!${NC}"
            exit 1
        fi
        
        SELECTED_FILE="${COMBINED_FILES[$((file_num-1))]}"
        
        echo -e "${YELLOW}Вибрано файл: $SELECTED_FILE${NC}"
        read -p "Увага! Це перезапише дані в базі. Продовжити? (y/n): " confirm
        
        if [ "$confirm" != "y" ]; then
            echo -e "${YELLOW}Операцію скасовано.${NC}"
            exit 0
        fi
        
        # Визначення типу файлу (SQL чи Binary)
        if [[ $SELECTED_FILE == *.sql ]]; then
            echo -e "${YELLOW}Імпорт SQL-дампу...${NC}"
            cat "$SELECTED_FILE" | docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME
            IMPORT_STATUS=$?
        else
            echo -e "${YELLOW}Імпорт Binary-дампу...${NC}"
            # Копіювання дампу в контейнер
            docker cp "$SELECTED_FILE" $CONTAINER_NAME:/tmp/restore.dump
            
            # Відновлення бази даних
            docker exec -t $CONTAINER_NAME pg_restore -U $DB_USER -d $DB_NAME -c -v /tmp/restore.dump
            IMPORT_STATUS=$?
        fi
        
        if [ $IMPORT_STATUS -eq 0 ]; then
            echo -e "${GREEN}Дані успішно імпортовано в Docker-контейнер!${NC}"
        else
            echo -e "${RED}Помилка імпорту даних! (код помилки: $IMPORT_STATUS)${NC}"
            echo -e "${YELLOW}Примітка: Попередження під час відновлення є нормальним явищем.${NC}"
        fi
        ;;
        
    4)
        echo -e "\n${YELLOW}Імпорт резервної копії в локальну базу...${NC}"
        
        # Отримання списку файлів дампів
        DUMP_FILES=($BACKUP_DIR/aksi_db_backup_*.dump)
        SQL_FILES=($BACKUP_DIR/aksi_db_backup_*.sql)
        
        if [ ${#DUMP_FILES[@]} -eq 0 ] && [ ${#SQL_FILES[@]} -eq 0 ]; then
            echo -e "${RED}Не знайдено файлів дампу в $BACKUP_DIR!${NC}"
            exit 1
        fi
        
        echo -e "${YELLOW}Доступні дампи:${NC}"
        
        # Вивід списку доступних файлів дампів
        COMBINED_FILES=()
        
        for ((i=0; i<${#DUMP_FILES[@]}; i++)); do
            if [ -f "${DUMP_FILES[$i]}" ]; then
                echo "$((i+1)). ${DUMP_FILES[$i]} (Binary)"
                COMBINED_FILES+=("${DUMP_FILES[$i]}")
            fi
        done
        
        for ((i=0; i<${#SQL_FILES[@]}; i++)); do
            if [ -f "${SQL_FILES[$i]}" ]; then
                j=$((i + ${#DUMP_FILES[@]}))
                echo "$((j+1)). ${SQL_FILES[$i]} (SQL)"
                COMBINED_FILES+=("${SQL_FILES[$i]}")
            fi
        done
        
        # Вибір файлу для імпорту
        read -p "Виберіть номер файлу для імпорту: " file_num
        
        if [ "$file_num" -le 0 ] || [ "$file_num" -gt ${#COMBINED_FILES[@]} ]; then
            echo -e "${RED}Невірний вибір!${NC}"
            exit 1
        fi
        
        SELECTED_FILE="${COMBINED_FILES[$((file_num-1))]}"
        
        echo -e "${YELLOW}Вибрано файл: $SELECTED_FILE${NC}"
        read -p "Увага! Це перезапише дані в локальній базі. Продовжити? (y/n): " confirm
        
        if [ "$confirm" != "y" ]; then
            echo -e "${YELLOW}Операцію скасовано.${NC}"
            exit 0
        fi
        
        # Встановлення змінної середовища для пароля PostgreSQL
        export PGPASSWORD="$DB_PASSWORD"
        
        # Визначення типу файлу (SQL чи Binary)
        if [[ $SELECTED_FILE == *.sql ]]; then
            echo -e "${YELLOW}Імпорт SQL-дампу в локальну базу...${NC}"
            psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME < "$SELECTED_FILE"
            IMPORT_STATUS=$?
        else
            echo -e "${YELLOW}Імпорт Binary-дампу в локальну базу...${NC}"
            pg_restore -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c -v "$SELECTED_FILE"
            IMPORT_STATUS=$?
        fi
        
        if [ $IMPORT_STATUS -eq 0 ]; then
            echo -e "${GREEN}Дані успішно імпортовано в локальну базу!${NC}"
        else
            echo -e "${RED}Помилка імпорту даних! (код помилки: $IMPORT_STATUS)${NC}"
            echo -e "${YELLOW}Примітка: Попередження під час відновлення є нормальним явищем.${NC}"
        fi
        ;;
        
    5)
        echo -e "\n${YELLOW}Вихід...${NC}"
        exit 0
        ;;
        
    *)
        echo -e "\n${RED}Невірний вибір!${NC}"
        exit 1
        ;;
esac

# Видалення змінної середовища з паролем для безпеки
unset PGPASSWORD

echo -e "\n${BLUE}====================================${NC}" 