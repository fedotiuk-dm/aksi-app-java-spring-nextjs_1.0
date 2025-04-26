# Aksi-app: Docker Development Environment

Цей документ містить інструкції для запуску Aksi-app у режимі розробки за допомогою Docker.

## Переваги розробки у Docker

1. **Стандартизоване середовище** - кожен розробник працює з однаковою конфігурацією
2. **Швидкий старт** - не потрібно встановлювати Java, Node.js, PostgreSQL окремо
3. **Ізоляція** - всі сервіси працюють у окремих контейнерах
4. **Hot-reload** - зміни у коді автоматично відображаються без перезапуску сервісів

## Запуск проекту у режимі розробки

### 1. Підготовка

Переконайтеся, що маєте встановлені:
- Docker
- Docker Compose

### 2. Запуск

```bash
# Перейдіть у директорію з docker-compose.dev.yml
cd docker

# Запустіть усі сервіси у режимі розробки
docker-compose -f docker-compose.dev.yml up -d

# Переглянути логи
docker-compose -f docker-compose.dev.yml logs -f
```

### 3. Доступ до сервісів

| Сервіс    | URL                     | Опис                        |
|-----------|-------------------------|----------------------------|
| Frontend  | http://localhost:3000   | Next.js застосунок         |
| Backend   | http://localhost:8080   | Spring Boot API            |
| PgAdmin   | http://localhost:5050   | PostgreSQL адміністрування |

### 4. Важливі особливості

#### Backend (Spring Boot)
- Використовує Spring Boot DevTools для автоматичного перезавантаження
- Відкрито порт 5005 для віддаленого відладки
- Весь код проекту монтується у контейнер для hot-reload
- Використовує профіль `dev`

#### Frontend (Next.js)
- Працює в режимі розробки з hot-reload
- Весь код проекту монтується у контейнер для миттєвого оновлення
- `node_modules` та `.next` директорії залишаються всередині контейнера

#### База даних
- Дані зберігаються у volume `postgres_data_dev`
- Доступ через localhost:5432 або через PgAdmin

## Docker мережа та комунікація

Всі сервіси працюють у спільній Docker мережі `aksi-network-dev`. Контейнери можуть звертатися один до одного за іменами сервісів:
- frontend -> http://backend:8080
- backend -> jdbc:postgresql://postgres:5432

## Зупинка середовища

```bash
# Зупинити всі сервіси
docker-compose -f docker-compose.dev.yml down

# Зупинити всі сервіси та видалити всі дані (volumes)
docker-compose -f docker-compose.dev.yml down -v
```
