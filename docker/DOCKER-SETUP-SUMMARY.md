# 🐳 Docker Dev Environment - Налаштування завершено

## ✅ Що було зроблено

### 1. **Оновлено Backend конфігурацію**

- ✅ Додано `spring-boot-devtools` до `pom.xml` для hot reload
- ✅ Оновлено `application.yml` з environment змінними та dev профілем
- ✅ Створено новий `Dockerfile.dev` з покращеною підтримкою hot reload
- ✅ Додано `.dockerignore` для оптимізації Docker context

### 2. **Оновлено Docker Compose**

- ✅ Синхронізовано параметри БД (`aksi_cleaners_db_v5`, password: `1911`)
- ✅ Додано debug порт 5005 для backend
- ✅ Налаштовано volume mounting для hot reload
- ✅ Додано DevTools environment змінні

### 3. **Створено допоміжні скрипти**

- ✅ `start-dev-updated.sh` - автоматичний запуск dev середовища
- ✅ `reset-dev.sh` - очистка та скидання середовища
- ✅ `README-DEV-UPDATED.md` - повна документація

### 4. **Налаштовано Liquibase міграції**

- ✅ Створено `001-create-client-tables.yaml` - структура БД для Client domain
- ✅ Створено `002-insert-client-seed-data.yaml` - тестові дані
- ✅ Налаштовано автоматичний запуск міграцій при старті

## 🚀 Як запустити

### Швидкий старт

```bash
cd docker
chmod +x start-dev-updated.sh reset-dev.sh
./start-dev-updated.sh
```

### Або вручну

```bash
cd docker
docker-compose -f docker-compose.dev.yml up --build
```

## 🔥 Hot Reload працює для:

### Backend (Spring Boot)

- ☕ Автоматичний перезапуск при змінах Java файлів
- 🔧 LiveReload для ресурсів
- 🐛 Debug на порту 5005
- ⚡ DevTools включені

### Frontend (Next.js)

- ⚛️ Fast Refresh для компонентів React
- 🔄 Hot Module Replacement (HMR)
- 💨 Швидкі зміни без перезавантаження

## 🗄️ База даних

### Параметри підключення

```yaml
Host: localhost (або postgres для контейнерів)
Port: 5432
Database: aksi_cleaners_db_v5
Username: aksi_user
Password: 1911
```

### PgAdmin

```
URL: http://localhost:5050
Email: admin@aksi.com
Password: admin
```

## 🌐 Доступні сервіси

| Сервіс      | URL                                       | Призначення             |
| ----------- | ----------------------------------------- | ----------------------- |
| Frontend    | http://localhost:3000                     | Next.js UI              |
| Backend API | http://localhost:8080/api                 | Spring Boot REST API    |
| Swagger UI  | http://localhost:8080/api/swagger-ui.html | API документація        |
| PgAdmin     | http://localhost:5050                     | Веб-інтерфейс БД        |
| Debug       | localhost:5005                            | Java Remote Debug       |
| Traefik     | http://localhost:9090                     | Load Balancer Dashboard |

## 🔧 Корисні команди

### Логи

```bash
# Всі сервіси
docker-compose -f docker-compose.dev.yml logs -f

# Тільки backend
docker-compose -f docker-compose.dev.yml logs -f backend

# Тільки frontend
docker-compose -f docker-compose.dev.yml logs -f frontend
```

### Управління

```bash
# Перезапуск backend
docker-compose -f docker-compose.dev.yml restart backend

# Зупинка всього
docker-compose -f docker-compose.dev.yml down

# Повна очистка
./reset-dev.sh

# 🔧 Корисні скрипти для target директорії:
./clean-target.sh     # Швидка очистка target для регенерації OpenAPI
./rebuild-backend.sh  # Повна перебудова backend контейнера
```

### Liquibase

```bash
# Запуск міграцій
cd ../backend
mvn liquibase:update -Dliquibase.contexts=dev

# Статус міграцій
mvn liquibase:status
```

## 🐛 Debug налаштування

### IntelliJ IDEA

1. Run → Edit Configurations
2. Add New → Remote JVM Debug
3. Host: `localhost`, Port: `5005`
4. Module classpath: backend
5. Start debugging

### VS Code

```json
{
  "type": "java",
  "name": "Debug Backend",
  "request": "attach",
  "hostName": "localhost",
  "port": 5005
}
```

## 📁 Структура volumes

```
backend_m2_cache        → Maven dependencies cache
postgres_data_dev       → PostgreSQL data
pgadmin_data_dev        → PgAdmin configuration
frontend_node_modules   → Node.js modules
frontend_next_cache     → Next.js build cache
```

## 🧪 Тестування

### Backend тести

```bash
# В контейнері
docker exec backend-dev ./mvnw test

# Локально
cd backend && ./mvnw test
```

### Client Domain тести

```bash
# Тести для Client domain (після створення міграцій)
cd backend && ./mvnw test -Dtest="*Client*"
```

## 🔍 Troubleshooting

### Backend не запускається

```bash
# Перевірити логи
docker-compose -f docker-compose.dev.yml logs backend

# Перевірити підключення до БД
docker exec backend-dev nc -zv postgres 5432
```

### Hot reload не працює

```bash
# Перевірити DevTools
docker exec backend-dev grep -r "devtools" /app/target/classes/

# Перевірити volume mounting
docker inspect backend-dev | grep -A 20 "Mounts"
```

### База даних недоступна

```bash
# Статус PostgreSQL
docker exec postgres-dev pg_isready -U aksi_user

# Підключення до БД
docker exec -it postgres-dev psql -U aksi_user -d aksi_cleaners_db_v5
```

## 📊 Моніторинг

### Spring Boot Actuator

- Health check: http://localhost:8080/api/actuator/health
- Metrics: http://localhost:8080/api/actuator/metrics
- Всі endpoints: http://localhost:8080/api/actuator

### Docker Stats

```bash
docker stats
docker-compose -f docker-compose.dev.yml top
```

---

## 🎯 Наступні кроки

1. **Запустіть** dev середовище: `./start-dev-updated.sh`
2. **Перевірте** що всі сервіси працюють
3. **Протестуйте** hot reload змінивши Java клас
4. **Підключіться** до debug на порту 5005
5. **Перевірте** Client API через Swagger UI

**Готово для розробки! 🚀**
