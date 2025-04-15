# Архітектура проекту "Хімчистка AKSI" (FSD + DDD)

## Загальна архітектура

Проект реалізується як розподілена система з чітким розділенням відповідальності:

- **Бекенд (Java/Spring)**: вся бізнес-логіка, обробка даних, взаємодія з БД, авторизація
- **Фронтенд (Next.js)**: інтерфейс користувача, відображення даних, взаємодія з користувачем
- **Взаємодія**: RESTful API + WebSocket для сповіщень в реальному часі

```
┌────────────────────┐           ┌────────────────────┐
│                    │           │                    │
│    Frontend        │           │     Backend        │
│    (Next.js)       │◄────────► │    (Spring Boot)   │
│                    │    API    │                    │
└────────────────────┘           └─────────┬──────────┘
                                           │
                                 ┌─────────▼──────────┐
                                 │                    │
                                 │     Database       │
                                 │   (PostgreSQL)     │
                                 │                    │
                                 └────────────────────┘
```

## Підхід до організації монорепозиторію

Для проекту "Хімчистка AKSI" рекомендується використання монорепозиторію для ефективної координації розробки та спрощення інтеграційних процесів.

### Керівні принципи організації монорепозиторію

#### 1. Чітка структура та ізоляція

- **Розділення відповідальностей** - бекенд та фронтенд повинні бути розміщені в окремих директоріях з ізольованими залежностями
- **Спільні компоненти** - ресурси, які використовуються обома частинами системи, виносяться на кореневий рівень
- **Адаптивність структури** - структура повинна розвиватися разом з проектом, а не бути жорстко зафіксованою на початку

#### 2. Ефективні робочі процеси

- **Узгоджені зміни** - розробка функціональності, що охоплює бекенд і фронтенд, у єдиних гілках
- **Атомарні комміти** - зміни повинні залишати систему в робочому стані після кожного комміту
- **Ефективне ревю коду** - можливість перегляду всіх пов'язаних змін в єдиному PR

#### 3. Інтеграція та тестування

- **Спільні інструменти CI/CD** - автоматизація тестування, збірки та розгортання
- **Локальне середовище розробки** - єдина команда для запуску всього проекту
- **Комплексне тестування** - налаштування end-to-end тестів для перевірки взаємодії компонентів

#### 4. Управління залежностями

- **Чітке розмежування залежностей** - окремі системи управління залежностями для різних частин проекту
- **Контроль версій API** - систематичне управління змінами в контрактах API
- **Синхронізоване версіонування** - єдине управління версіями для всього проекту

### Практичні рекомендації для розробки

1. **Початок роботи**:

   - Створення базової структури з основними директоріями
   - Налаштування інструментів якості коду для обох частин проекту
   - Створення спільних скриптів для автоматизації

2. **Щоденна розробка**:

   - Робота в гілках, що охоплюють зміни в обох частинах
   - Використання єдиних конвенцій іменування
   - Підтримка актуальної документації, особливо для API

3. **Розширення проекту**:
   - Поступове розширення функціональності за доменами
   - Інкрементальне додавання компонентів інфраструктури
   - Постійний рефакторинг для підтримки масштабування

### Переваги монорепозиторію для проекту "Хімчистка AKSI"

- **Синхронізований розвиток** - зміни в API автоматично відображаються у всіх частинах системи
- **Спрощений розгортання** - єдиний процес збірки та розгортання
- **Поліпшена прозорість** - єдина точка для перегляду історії змін та поточного стану
- **Оптимізація роботи невеликої команди** - мінімізація контексту перемикання між різними репозиторіями
- **Ефективне спільне використання коду** - можливість видобування спільних компонентів без складної взаємодії між репозиторіями

## 1. Бекенд (Java/Spring)

### Модульна структура (Domain-Driven Design)

#### Домени (domains)

- **client-domain**
  - `entity`: Client, ClientContact, ClientAddress
  - `repository`: ClientRepository
  - `service`: ClientService, ClientSearchService
  - `dto`: ClientDTO, ClientResponseDTO
  - `exception`: ClientNotFoundException
- **order-domain**

  - `entity`: Order, OrderItem, OrderStatus, OrderHistory
  - `repository`: OrderRepository, OrderItemRepository
  - `service`: OrderService, OrderStatusService
  - `dto`: OrderDTO, OrderResponseDTO, OrderItemDTO
  - `exception`: OrderNotFoundException, InvalidOrderStateException

- **pricelist-domain**
  - `entity`: ServiceCategory, Service, PriceModifier
  - `repository`: ServiceRepository, CategoryRepository
  - `service`: PriceCalculationService, ServiceLookupService
  - `dto`: ServiceDTO, CategoryDTO, PriceCalculationDTO
- **location-domain**

  - `entity`: Location, WorkingHours
  - `repository`: LocationRepository
  - `service`: LocationService
  - `dto`: LocationDTO, WorkingHoursDTO

- **schedule-domain**
  - `entity`: TimeSlot, Availability
  - `repository`: TimeSlotRepository
  - `service`: ScheduleService
  - `dto`: AvailableSlotsDTO, TimeSlotDTO

#### Загальні модулі (shared)

- **common**
  - `exception`: GlobalExceptionHandler, ApiException
  - `dto`: ApiResponse, PaginatedResponse
  - `util`: DateTimeUtil, ValidationUtil
  - `security`: JwtTokenProvider, UserContext

#### API Інтерфейси (API Layer)

- **api**
  - `controller`: ClientController, OrderController, ServiceController, LocationController, ScheduleController, AuthController
  - `request`: Всі запити з валідацією
  - `response`: Всі відповіді API
  - `mapper`: DTO-маппери для кожного домену

#### Інфраструктура (Infrastructure)

- **infrastructure**
  - `persistence`: JpaRepositories, DataSourceConfig
  - `security`: SecurityConfig, AuthenticationProvider
  - `messaging`: EventPublisher, EventListener
  - `caching`: CacheConfig, CacheManager
  - `pdf`: PDFGenerator, ReceiptService

### Файлова структура бекенду

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── aksi/
│   │   │           ├── AksiApplication.java           # Точка входу Spring Boot
│   │   │           ├── config/                        # Конфігурації Spring
│   │   │           │   ├── SecurityConfig.java        # Налаштування безпеки
│   │   │           │   ├── WebConfig.java             # Веб-конфігурація (CORS тощо)
│   │   │           │   └── SwaggerConfig.java         # Конфігурація API документації
│   │   │           │
│   │   │           ├── domain/                        # Доменна модель (DDD)
│   │   │           │   ├── client/                    # Домен клієнтів
│   │   │           │   │   ├── entity/
│   │   │           │   │   ├── repository/
│   │   │           │   │   ├── service/
│   │   │           │   │   ├── dto/
│   │   │           │   │   └── exception/
│   │   │           │   │
│   │   │           │   ├── order/                     # Домен замовлень
│   │   │           │   │   ├── entity/
│   │   │           │   │   ├── repository/
│   │   │           │   │   ├── service/
│   │   │           │   │   ├── dto/
│   │   │           │   │   └── exception/
│   │   │           │   │
│   │   │           │   ├── pricelist/                 # Домен прайс-листа
│   │   │           │   │   ├── entity/
│   │   │           │   │   ├── repository/
│   │   │           │   │   ├── service/
│   │   │           │   │   ├── dto/
│   │   │           │   │   └── exception/
│   │   │           │   │
│   │   │           │   ├── location/                  # Домен філій
│   │   │           │   │   ├── entity/
│   │   │           │   │   ├── repository/
│   │   │           │   │   ├── service/
│   │   │           │   │   ├── dto/
│   │   │           │   │   └── exception/
│   │   │           │   │
│   │   │           │   └── schedule/                  # Домен розкладу
│   │   │           │       ├── entity/
│   │   │           │       ├── repository/
│   │   │           │       ├── service/
│   │   │           │       ├── dto/
│   │   │           │       └── exception/
│   │   │           │
│   │   │           ├── api/                           # API інтерфейси
│   │   │           │   ├── controller/                # Контролери REST API
│   │   │           │   │   ├── AuthController.java
│   │   │           │   │   ├── ClientController.java
│   │   │           │   │   ├── OrderController.java
│   │   │           │   │   ├── ServiceController.java
│   │   │           │   │   ├── LocationController.java
│   │   │           │   │   └── ScheduleController.java
│   │   │           │   │
│   │   │           │   ├── request/                   # Запити до API
│   │   │           │   ├── response/                  # Відповіді API
│   │   │           │   └── mapper/                    # DTO-маппери
│   │   │           │
│   │   │           ├── infrastructure/                # Інфраструктурний рівень
│   │   │           │   ├── persistence/               # Налаштування JPA
│   │   │           │   ├── security/                  # Компоненти безпеки
│   │   │           │   ├── messaging/                 # Обробка подій
│   │   │           │   ├── caching/                   # Кешування
│   │   │           │   └── pdf/                       # Генерація PDF
│   │   │           │
│   │   │           └── common/                        # Спільні компоненти
│   │   │               ├── exception/                 # Обробка виключень
│   │   │               ├── dto/                       # Спільні DTO
│   │   │               └── util/                      # Утиліти
│   │   │
│   │   └── resources/
│   │       ├── application.properties                 # Головна конфігурація
│   │       ├── application-dev.properties             # Конфігурація для розробки
│   │       ├── application-prod.properties            # Конфігурація для продакшена
│   │       └── db/
│   │           └── migration/                         # Flyway міграції
│   │               ├── V1__init_schema.sql
│   │               ├── V2__price_list_data.sql
│   │               └── ...
│   │
│   └── test/                                          # Тести
│       └── java/
│           └── com/
│               └── aksi/
│                   ├── domain/                        # Тести доменів
│                   ├── api/                           # Тести API
│                   └── infrastructure/                # Тести інфраструктури
│
├── pom.xml                                            # Конфігурація Maven
└── README.md                                          # Документація бекенду
```

## 2. Фронтенд (Next.js/React із використанням FSD)

### Структура на основі Feature-Sliced Design (FSD)

#### Сутності (entities)

- **entities/client**
  - `model`: types.ts, constants.ts
  - `api`: clientApi.ts
  - `ui`: ClientCard.tsx, ClientDetails.tsx
- **entities/order**

  - `model`: types.ts, constants.ts, helpers.ts
  - `api`: orderApi.ts
  - `ui`: OrderCard.tsx, OrderTable.tsx, OrderStatusBadge.tsx

- **entities/service**

  - `model`: types.ts, constants.ts
  - `api`: serviceApi.ts
  - `ui`: ServiceCard.tsx, CategoryList.tsx

- **entities/location**
  - `model`: types.ts
  - `api`: locationApi.ts
  - `ui`: LocationCard.tsx, LocationSelector.tsx

#### Функціональності (features)

- **features/order-wizard**
  - `model`: types.ts, store.ts, constants.ts, helpers.ts
  - `api`: wizardApi.ts
  - `hooks`: useWizardNavigation.ts, useOrderData.ts, useClients.ts, useLocations.ts, useServices.ts
  - `ui`: компоненти для кожного кроку візарда
    - **client-step**
      - ClientSearch.tsx
      - ClientCreate.tsx
      - OrderBasicInfo.tsx
    - **items-manager**
      - ItemsTable.tsx
      - AddItemButton.tsx
      - ItemCalculation.tsx
    - **item-wizard**
      - BasicInfoStep.tsx
      - CharacteristicsStep.tsx
      - DefectsStep.tsx
      - PriceStep.tsx
      - PhotoStep.tsx
    - **order-params**
      - ExecutionParams.tsx
      - DiscountSection.tsx
      - PaymentSection.tsx
    - **confirmation**
      - OrderSummary.tsx
      - LegalSection.tsx
      - ReceiptPreview.tsx

#### Загальні контексти (contexts)

- **shared/contexts**
  - `OrderDataContext`: Зберігання та управління даними замовлення
  - `WizardNavigationContext`: Управління переходами між кроками
  - `AuthContext`: Аутентифікація та авторизація

#### Widgets

- **widgets**
  - `Header`: Заголовок і управління додатком
  - `Sidebar`: Навігація по розділам
  - `FilterPanel`: Фільтри для пошуку
  - `NotificationPanel`: Сповіщення

### Файлова структура фронтенду

```
frontend/
├── app/                                  # App Router структура Next.js
│   ├── (app)/                            # Група маршрутів основного додатку
│   │   ├── dashboard/
│   │   │   └── page.tsx                  # Головна сторінка дашборд
│   │   ├── order/
│   │   │   └── page.tsx                  # Сторінка створення замовлення (OrderWizard)
│   │   ├── orders/
│   │   │   ├── page.tsx                  # Список замовлень
│   │   │   └── [orderId]/
│   │   │       └── page.tsx              # Деталі замовлення
│   │   ├── clients/
│   │   │   ├── page.tsx                  # Список клієнтів
│   │   │   └── [clientId]/
│   │   │       └── page.tsx              # Деталі клієнта
│   │   ├── pricelist/
│   │   │   └── page.tsx                  # Прайс-лист
│   │   ├── settings/
│   │   │   └── page.tsx                  # Налаштування
│   │   └── layout.tsx                    # Спільний лейаут (з навігацією)
│   │
│   ├── login/                            # Сторінка логіну
│   │   └── page.tsx
│   │
│   ├── api/                              # API маршрути (якщо потрібні)
│   ├── layout.tsx                        # Кореневий лейаут
│   └── globals.css                       # Глобальні стилі
│
├── entities/                             # Базові бізнес-сутності (FSD)
│   ├── client/                           # Сутність клієнта
│   │   ├── model/                        # Моделі, типи
│   │   ├── api/                          # API-взаємодія
│   │   └── ui/                           # UI-компоненти
│   │
│   ├── order/                            # Сутність замовлення
│   │   ├── model/
│   │   ├── api/
│   │   └── ui/
│   │
│   ├── service/                          # Сутність послуги
│   │   ├── model/
│   │   ├── api/
│   │   └── ui/
│   │
│   └── location/                         # Сутність філії
│       ├── model/
│       ├── api/
│       └── ui/
│
├── features/                             # Функціональні фічі (FSD)
│   ├── order-wizard/                     # Фіча Order Wizard
│   │   ├── model/                        # Бізнес-логіка
│   │   ├── api/                          # API-взаємодія
│   │   ├── hooks/                        # Хуки
│   │   └── ui/                           # UI-компоненти
│   │       ├── client-step/
│   │       ├── items-manager/
│   │       ├── item-wizard/
│   │       ├── order-params/
│   │       └── confirmation/
│   │
│   ├── client-management/                # Фіча управління клієнтами
│   │   ├── model/
│   │   ├── api/
│   │   ├── hooks/
│   │   └── ui/
│   │
│   ├── order-management/                 # Фіча управління замовленнями
│   │   ├── model/
│   │   ├── api/
│   │   ├── hooks/
│   │   └── ui/
│   │
│   └── auth/                             # Фіча автентифікації
│       ├── model/
│       ├── api/
│       ├── hooks/
│       └── ui/
│
├── widgets/                              # Композиційні елементи (FSD)
│   ├── header/
│   ├── sidebar/
│   ├── filter-panel/
│   └── notification-panel/
│
├── shared/                               # Спільні елементи (FSD)
│   ├── ui/                               # UI-компоненти
│   │   ├── button/
│   │   ├── input/
│   │   ├── select/
│   │   ├── modal/
│   │   ├── table/
│   │   └── notification/
│   │
│   ├── api/                              # Базова взаємодія з API
│   ├── lib/                              # Утиліти
│   ├── hooks/                            # Спільні хуки
│   └── contexts/                         # Контексти React
│
├── public/                               # Статичні файли
│   ├── images/
│   ├── icons/
│   └── ...
│
├── locales/                              # Переклади
│   ├── uk/                               # Українська
│   │   ├── common.json
│   │   ├── orders.json
│   │   └── ...
│   └── ...
│
├── .env.local                            # Локальні змінні середовища
├── package.json                          # Залежності NPM
├── tsconfig.json                         # Конфігурація TypeScript
└── README.md                             # Документація фронтенду
```

## 3. Інтеграційні точки

### API Endpoints

#### Клієнти API

- `GET /api/clients` - Отримання списку клієнтів
- `GET /api/clients/search` - Пошук клієнтів
- `GET /api/clients/{id}` - Отримання клієнта за ID
- `POST /api/clients` - Створення нового клієнта
- `PUT /api/clients/{id}` - Оновлення клієнта

#### Замовлення API

- `GET /api/orders` - Отримання списку замовлень
- `GET /api/orders/search` - Пошук замовлень
- `GET /api/orders/{id}` - Отримання замовлення за ID
- `POST /api/orders` - Створення нового замовлення
- `PUT /api/orders/{id}` - Оновлення замовлення
- `PUT /api/orders/{id}/status` - Оновлення статусу
- `GET /api/orders/{id}/receipt` - Отримання квитанції

#### Прайс-лист API

- `GET /api/categories` - Отримання категорій послуг
- `GET /api/services` - Отримання списку послуг
- `GET /api/services/category/{id}` - Послуги за категорією
- `POST /api/price/calculate` - Розрахунок ціни

#### Локації API

- `GET /api/locations` - Отримання філій
- `GET /api/locations/{id}` - Отримання філії за ID
- `GET /api/locations/nearby` - Пошук найближчих філій

## 4. Інфраструктура та DevOps

### Docker і контейнеризація

#### Структура контейнерів

```
docker/
├── backend/
│   └── Dockerfile         # Java 21, Spring Boot
├── frontend/
│   └── Dockerfile         # Node.js, Next.js
├── nginx/
│   ├── Dockerfile         # Nginx
│   └── nginx.conf         # Конфігурація
├── postgres/
│   └── init-scripts/      # Ініціалізаційні скрипти
└── docker-compose.yml     # Композиція всіх сервісів
```

#### Приклад docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    depends_on:
      - postgres
    environment:
      - SPRING_PROFILES_ACTIVE=dev
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/aksi
      - SPRING_DATASOURCE_USERNAME=aksi_user
      - SPRING_DATASOURCE_PASSWORD=aksi_password
      - JAVA_OPTS=-XX:+UseZGC
    volumes:
      - ./backend:/app
    ports:
      - '8080:8080'

  frontend:
    build: ./frontend
    volumes:
      - ./frontend:/app
    ports:
      - '3000:3000'

  postgres:
    image: postgres:17
    environment:
      - POSTGRES_DB=aksi
      - POSTGRES_USER=aksi_user
      - POSTGRES_PASSWORD=aksi_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./postgres/init-scripts:/docker-entrypoint-initdb.d
    ports:
      - '5432:5432'

  nginx:
    build: ./nginx
    ports:
      - '80:80'
      - '443:443'
    depends_on:
      - backend
      - frontend
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl

volumes:
  postgres_data:
```

### Nginx конфігурація

Базова конфігурація для проксіювання запитів:

```nginx
worker_processes auto;

events {
  worker_connections 1024;
}

http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  # Логування
  access_log /var/log/nginx/access.log;
  error_log /var/log/nginx/error.log;

  # Кешування статики
  proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=STATIC:10m inactive=7d use_temp_path=off;

  upstream backend {
    server backend:8080;
  }

  upstream frontend {
    server frontend:3000;
  }

  server {
    listen 80;
    server_name _;

    # Перенаправлення на HTTPS
    return 301 https://$host$request_uri;
  }

  server {
    listen 443 ssl;
    server_name _;

    # SSL сертифікати
    ssl_certificate /etc/nginx/ssl/server.crt;
    ssl_certificate_key /etc/nginx/ssl/server.key;

    # Проксіювання API-запитів на бекенд
    location /api {
      proxy_pass http://backend;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Всі інші запити направляються на фронтенд
    location / {
      proxy_pass http://frontend;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Кешування статики
    location /static {
      proxy_pass http://frontend;
      proxy_cache STATIC;
      proxy_ignore_headers Cache-Control;
      proxy_cache_valid 60m;
      proxy_cache_use_stale error timeout invalid_header updating http_500 http_502 http_503 http_504;
      add_header X-Cache-Status $upstream_cache_status;
    }
  }
}
```

### CI/CD

Приклад конфігурації CI/CD з використанням GitHub Actions:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  backend-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'liberica'
          cache: maven
      - name: Build with Maven
        run: cd backend && mvn -B package --file pom.xml
      - name: Run tests
        run: cd backend && mvn test
      - name: Static code analysis
        run: cd backend && mvn sonar:sonar

  frontend-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - name: Install dependencies
        run: cd frontend && npm ci
      - name: Build
        run: cd frontend && npm run build
      - name: Test
        run: cd frontend && npm test
      - name: Lint
        run: cd frontend && npm run lint

  deploy-dev:
    needs: [backend-build, frontend-build]
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Development
        run: |
          # Скрипт деплою на dev-середовище
          echo "Deploying to dev environment"

  deploy-prod:
    needs: [backend-build, frontend-build]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Production
        run: |
          # Скрипт деплою на production-середовище
          echo "Deploying to production environment"
```

## 5. Рекомендації щодо стилю коду

### Бекенд (Java/Spring)

1. **Структура коду:**

   - Дотримуйтесь принципу "DTO → Service → Domain Model → Repository → DB"
   - Використовуйте анотацію `@Transactional` для всіх сервісів
   - Ніколи не повертайте JPA-сутності напряму в API, завжди використовуйте DTO

2. **Валідація:**

   - Використовуйте анотацію `@Valid` для запитів API
   - Створюйте кастомні анотації для складної валідації
   - Застосовуйте валідацію на рівні контролерів, а не сервісів

3. **Маппінг:**

   - Використовуйте MapStruct для маппінгу між DTO та сутностями
   - Створюйте окремі маппери для кожного домену
   - Налаштуйте автоматичне вставляння маппера через конструктор

4. **Виключення:**

   - Створюйте ієрархію бізнес-виключень
   - Використовуйте глобальний обробник виключень для перетворення в API відповіді
   - Логуйте всі виключення з відповідним рівнем (ERROR, WARN, INFO)

5. **Транзакції:**

   - Визначайте чіткі межі транзакцій
   - Уникайте викликів зовнішніх сервісів в межах транзакцій
   - Використовуйте ізоляцію транзакцій відповідно до вимог

6. **Використання функцій Java 21:**
   - Застосовуйте віртуальні потоки для асинхронних операцій за допомогою `Thread.startVirtualThread()`
   - Використовуйте шаблони для перемикачів (pattern matching for switch)
   - Застосовуйте записи (records) для незмінних об'єктів даних
   - Використовуйте текстові блоки для складних SQL-запитів і JSON

### Фронтенд (Next.js)

1. **Структура компонентів:**

   - Додержуйтесь принципів Feature-Sliced Design
   - Розміщуйте хуки, API, типи поруч з компонентами, до яких вони відносяться
   - Контролюйте розмір компонентів (до 150-200 рядків), декомпозуйте великі компоненти

2. **Типізація:**

   - Використовуйте типи TypeScript для всіх компонентів, хуків і функцій
   - Створюйте чіткі інтерфейси для API відповідей і запитів
   - Використовуйте дженерики для повторно використовуваних компонентів

3. **Хуки та стан:**

   - Інкапсулюйте логіку в кастомні хуки
   - Використовуйте React Context для локального стану фіч
   - Для глобального стану використовуйте Zustand або Redux Toolkit

4. **API взаємодія:**

   - Виокремлюйте API взаємодію в окремі функції або хуки
   - Використовуйте React Query для кешування та керування станом запитів
   - Централізуйте обробку помилок API

5. **Стилізація:**
   - Дотримуйтесь єдиного підходу до стилізації (MUI)
   - Використовуйте кастомізовану тему MUI
   - Створюйте атомарні компоненти для повторного використання

## 6. Технології та фреймворки

### Бекенд

- **Java 21**
- **Spring Boot 3**
- **Spring Data JPA**
- **Spring Security**
- **PostgreSQL 17**
- **Redis** (кешування)
- **MapStruct** (маппінг DTO)
- **Flyway** (міграції БД)
- **OpenAPI/Swagger** (документація API)
- **JUnit 5 + Mockito** (тестування)
- **SLF4J + Logback** (логування)
- **Docker** (контейнеризація)

### Фронтенд

- **Next.js 15.x**
- **React 19.x**
- **TypeScript**
- **Material UI 7.x**
- **React Query** (керування станом)
- **Zustand** (глобальний стан)
- **React Hook Form + Zod** (форми та валідація)
- **Day.js** (робота з датами)
- **React Testing Library + Vitest** (тестування)
- **ESLint + Prettier** (лінтинг та форматування)

## 7. Стратегія розвитку проекту

### Фаза 1: Підготовка інфраструктури

1. **Налаштування бекенду:**

   - Створення проекту Spring Boot на базі Java 21
   - Налаштування JPA/Hibernate
   - Налаштування безпеки (Spring Security + JWT)
   - Налаштування міграцій (Flyway)
   - Використання віртуальних потоків для оптимізації
   - Базова модель даних

2. **Налаштування фронтенду:**

   - Створення проекту Next.js
   - Налаштування MUI
   - Налаштування типів TypeScript
   - Базові компоненти
   - Аутентифікація

3. **Налаштування DevOps:**
   - Docker контейнери
   - Nginx конфігурація
   - CI/CD базовий пайплайн

### Фаза 2: Базовий функціонал

1. **Аутентифікація та авторизація:**

   - Логін/логаут
   - Управління ролями
   - Захист маршрутів

2. **Управління клієнтами:**

   - CRUD операції
   - Пошук клієнтів
   - Історія замовлень клієнта

3. **Прайс-лист:**
   - Управління категоріями
   - Управління послугами
   - Логіка ціноутворення

### Фаза 3: Основний функціонал - OrderWizard

Детальна реалізація Order Wizard як основного бізнес-функціоналу:

1. **Етап 1: Клієнт та базова інформація**
2. **Етап 2: Менеджер предметів**
3. **Етап 3: Параметри замовлення**
4. **Етап 4: Підтвердження та квитанція**

### Фаза 4: Додатковий функціонал

1. **Управління замовленнями:**

   - Список замовлень
   - Фільтрація та пошук
   - Зміна статусів

2. **Дашборд і звіти:**

   - Основні метрики
   - Фільтрація за періодами
   - Експорт даних

3. **Налаштування системи:**
   - Управління користувачами
   - Управління філіями
   - Системні параметри

### Фаза 5: Оптимізація та розширення

1. **Оптимізація продуктивності:**

   - Кешування
   - Покращення запитів до БД
   - Оптимізація фронтенду

2. **Розширені функції:**
   - Розширені звіти
   - Інтеграції (за потреби)
   - SMS сповіщення (у майбутньому)

## Висновок

Цей документ описує архітектуру та структуру проекту "Хімчистка AKSI" на базі Java 21/Spring Boot (бекенд) і Next.js (фронтенд) з використанням принципів Domain-Driven Design для бекенду та Feature-Sliced Design для фронтенду.

Основною перевагою запропонованої архітектури є:

- Чітке розділення відповідальності
- Масштабованість та модульність
- Використання нових можливостей Java 21 (віртуальні потоки, шаблони перемикання)
- Відповідність сучасним практикам розробки
- Можливість паралельної розробки компонентів
- Підтримуваність і розширюваність

Дотримуючись цієї архітектури та рекомендацій, команда розробників зможе створити стабільну, масштабовану та легко підтримувану систему для автоматизації роботи хімчистки.
