# Архітектура проєкту "Хімчистка AKSI"

## Технологічний стек

### Бекенд

- **Java**: 21.0.6 LTS
- **Spring Boot**: 3.4.4
- **База даних**: PostgreSQL 17.4
- **Maven**: 3.9.x
- **Spring Security + JWT**
- **Swagger/OpenAPI**
- **MapStruct, Lombok**

### Фронтенд

- **Next.js**: 15.3.0 (App Router)
- **React**: 19.0.0
- **Node.js**: 23.9.0
- **TypeScript**: 5.x
- **Material UI**: 7.0.x
- **React Query + Axios**
- **Zustand**: 5.0.x
- **next-intl**: 4.0.x

## Структура проєкту

```
/
├── backend/                               # Бекенд на Java 21 & Spring Boot 3.4.4
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/aksi/
│   │   │   │   ├── AksiApplication.java   # Головний клас запуску Spring Boot
│   │   │   │   ├── api/                   # REST API контролери
│   │   │   │   │   ├── controller/
│   │   │   │   │   ├── request/
│   │   │   │   │   └── response/
│   │   │   │   ├── config/                # Конфігураційні класи Spring
│   │   │   │   ├── domain/                # Доменні об'єкти (DDD)
│   │   │   │   │   ├── client/            # Домен клієнтів
│   │   │   │   │   │   ├── entity/
│   │   │   │   │   │   ├── repository/
│   │   │   │   │   │   └── service/
│   │   │   │   │   ├── order/             # Домен замовлень
│   │   │   │   │   │   ├── entity/
│   │   │   │   │   │   ├── repository/
│   │   │   │   │   │   └── service/
│   │   │   │   │   ├── pricelist/         # Домен прайс-листа
│   │   │   │   │   ├── payment/           # Домен платежів
│   │   │   │   │   └── analytics/         # Домен аналітики
│   │   │   │   ├── dto/                   # DTO об'єкти
│   │   │   │   ├── exception/             # Винятки та обробники
│   │   │   │   ├── mapper/                # Маппери DTO <-> Entities
│   │   │   │   ├── service/               # Сервісні класи
│   │   │   │   └── util/                  # Утиліти
│   │   │   └── resources/
│   │   │       ├── application.properties # Головна конфігурація
│   │   │       ├── application-dev.properties
│   │   │       └── application-prod.properties
│   │   └── test/
│   ├── Dockerfile
│   └── pom.xml                           # Залежності Maven
│
├── frontend/                             # Фронтенд на Next.js 15.3 & React 19
│   ├── app/                              # Next.js App Router
│   │   ├── (auth)/                       # Маршрути авторизації
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (protected)/                  # Захищені маршрути
│   │   │   ├── dashboard/
│   │   │   ├── orders/
│   │   │   ├── clients/
│   │   │   ├── price-list/
│   │   │   └── analytics/
│   │   ├── api/                          # API маршрути
│   │   ├── layout.tsx                    # Кореневий лейаут
│   │   └── globals.css                   # Глобальні стилі
│   ├── entities/                         # FSD: Бізнес-сутності
│   │   ├── client/
│   │   │   ├── model/                    # Типи і константи
│   │   │   ├── api/                      # Взаємодія з API
│   │   │   └── ui/                       # UI-компоненти
│   │   ├── order/
│   │   ├── price-list/
│   │   └── payment/
│   ├── features/                         # FSD: Функціональності
│   │   ├── order-wizard/
│   │   │   ├── model/                    # Бізнес-логіка
│   │   │   ├── api/                      # API-взаємодія
│   │   │   ├── hooks/                    # React-хуки
│   │   │   └── ui/                       # UI-компоненти
│   │   ├── client-management/
│   │   ├── order-management/
│   │   └── auth/
│   ├── widgets/                          # FSD: Композиційні віджети
│   │   ├── header/
│   │   ├── sidebar/
│   │   ├── filter-panel/
│   │   └── notification-panel/
│   ├── shared/                           # FSD: Спільні елементи
│   │   ├── ui/                           # UI-компоненти
│   │   ├── api/                          # Базові API-функції
│   │   ├── lib/                          # Утиліти
│   │   │   ├── axios.ts                  # Клієнт axios
│   │   │   └── utils/                    # Утиліти для форматування даних
│   │   ├── hooks/                        # Спільні хуки
│   │   └── contexts/                     # React-контексти
│   ├── public/                           # Статичні файли
│   ├── locales/                          # I18n переклади
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── docker/                               # Конфігурації Docker
│   ├── docker-compose.yml                # Композиція сервісів
│   └── docker-up.sh                      # Скрипт запуску
│
└── docs/                                 # Документація проєкту
    ├── api-spec.md                       # Специфікація API
    ├── database-schema.md                # Схема бази даних
    ├── order-wizard-spec.md              # Специфікація OrderWizard
    ├── project_structure.md              # Структура проєкту
    ├── roadmap.md                        # Дорожня карта
    └── summary.md                        # Загальний опис
```

## Доменні моделі бекенду

### User (Користувач)

- `id`: UUID
- `name`: String (unique)
- `email`: String (unique)
- `emailVerified`: LocalDateTime (optional)
- `image`: String (optional)
- `password`: String
- `role`: Role (ADMIN, MANAGER, STAFF)
- `position`: String (optional)
- `createdAt`: LocalDateTime
- `updatedAt`: LocalDateTime

### Client (Клієнт)

- `id`: UUID
- `firstName`: String
- `lastName`: String
- `phone`: String (unique)
- `email`: String (unique, optional)
- `address`: String (optional)
- `birthdate`: LocalDate (optional)
- `notes`: String (optional)
- `loyaltyLevel`: LoyaltyLevel (STANDARD, BRONZE, SILVER, GOLD, PLATINUM)
- `gender`: String (optional)
- `totalSpent`: BigDecimal
- `loyaltyPoints`: Integer
- `lastPurchaseAt`: LocalDateTime (optional)
- `status`: ClientStatus (ACTIVE, INACTIVE, BLOCKED)
- `source`: ClientSource (REFERRAL, SOCIAL_MEDIA, GOOGLE, ADVERTISEMENT, OTHER)
- `tags`: List<String> (optional)
- `nextContactAt`: LocalDateTime (optional)
- `lastContactAt`: LocalDateTime (optional)
- `allowSMS`: Boolean
- `allowEmail`: Boolean
- `allowCalls`: Boolean
- `frequencyScore`: Integer
- `monetaryScore`: Integer
- `recencyScore`: Integer
- `createdAt`: LocalDateTime
- `updatedAt`: LocalDateTime
- `deletedAt`: LocalDateTime (optional)

### Order (Замовлення)

- `id`: UUID
- `number`: String (unique)
- `clientId`: UUID
- `userId`: UUID (optional)
- `totalAmount`: BigDecimal
- `prepaidAmount`: BigDecimal
- `createdAt`: LocalDateTime
- `completedAt`: LocalDateTime (optional)
- `estimatedReleaseDate`: LocalDateTime (optional)
- `paymentMethod`: String (optional)
- `notes`: String (optional)
- `status`: OrderStatus (NEW, PROCESSING, READY, COMPLETED, CANCELLED, PENDING_PAYMENT)

### OrderItem (Елемент замовлення)

- `id`: UUID
- `orderId`: UUID
- `priceListItemId`: UUID (optional)
- `quantity`: Integer
- `name`: String
- `unitPrice`: BigDecimal
- `totalPrice`: BigDecimal
- `category`: String (optional)
- `itemType`: String (optional)
- `fabric`: String (optional)
- `color`: String (optional)
- `description`: String (optional)
- `markings`: String (optional)
- `specialNotes`: String (optional)
- `createdAt`: LocalDateTime
- `updatedAt`: LocalDateTime

### Photo (Фотографія)

- `id`: UUID
- `url`: String
- `description`: String (optional)
- `orderItemId`: UUID
- `createdAt`: LocalDateTime

### ServiceCategory (Категорія послуг)

- `id`: UUID
- `code`: String (unique)
- `name`: String
- `description`: String (optional)
- `sortOrder`: Integer
- `createdAt`: LocalDateTime
- `updatedAt`: LocalDateTime

### PriceListItem (Позиція прайс-листа)

- `id`: UUID
- `categoryId`: UUID
- `jsonId`: String (optional)
- `catalogNumber`: Integer
- `name`: String
- `unitOfMeasure`: String
- `basePrice`: BigDecimal
- `priceBlack`: BigDecimal (optional)
- `priceColor`: BigDecimal (optional)
- `active`: Boolean
- `createdAt`: LocalDateTime
- `updatedAt`: LocalDateTime

### Payment (Платіж)

- `id`: UUID
- `amount`: BigDecimal
- `method`: String
- `status`: String
- `createdAt`: LocalDateTime
- `clientId`: UUID
- `orderId`: UUID (optional)

### OrderHistory (Історія замовлень)

- `id`: UUID
- `orderId`: UUID
- `status`: String
- `comment`: String (optional)
- `createdAt`: LocalDateTime
- `createdBy`: UUID

## API Endpoints

### Автентифікація

- `POST /api/auth/login` - Вхід у систему
- `POST /api/auth/register` - Реєстрація нового користувача

### Користувачі

- `GET /api/users` - Отримання списку користувачів
- `GET /api/users/{id}` - Отримання користувача за ID
- `POST /api/users` - Створення нового користувача
- `PUT /api/users/{id}` - Оновлення користувача
- `DELETE /api/users/{id}` - Видалення користувача

### Клієнти

- `GET /api/clients` - Отримання списку клієнтів
- `GET /api/clients/search` - Пошук клієнтів
- `GET /api/clients/{id}` - Отримання клієнта за ID
- `POST /api/clients` - Створення нового клієнта
- `PUT /api/clients/{id}` - Оновлення клієнта
- `DELETE /api/clients/{id}` - Видалення клієнта

### Замовлення

- `GET /api/orders` - Отримання списку замовлень
- `GET /api/orders/search` - Пошук замовлень
- `GET /api/orders/{id}` - Отримання замовлення за ID
- `POST /api/orders` - Створення нового замовлення
- `PUT /api/orders/{id}` - Оновлення замовлення
- `PATCH /api/orders/{id}/status` - Оновлення статусу замовлення

### Категорії послуг

- `GET /api/service-categories` - Отримання списку категорій послуг
- `GET /api/service-categories/{id}` - Отримання категорії за ID
- `POST /api/service-categories` - Створення нової категорії
- `PUT /api/service-categories/{id}` - Оновлення категорії
- `DELETE /api/service-categories/{id}` - Видалення категорії

### Прайс-лист

- `GET /api/price-list-items` - Отримання позицій прайс-листа
- `GET /api/price-list-items/{id}` - Отримання позиції за ID
- `POST /api/price-list-items` - Створення нової позиції
- `PUT /api/price-list-items/{id}` - Оновлення позиції
- `DELETE /api/price-list-items/{id}` - Видалення позиції

### Платежі

- `GET /api/payments` - Отримання платежів
- `GET /api/payments/{id}` - Отримання платежу за ID
- `POST /api/payments` - Створення нового платежу
- `PATCH /api/payments/{id}/status` - Оновлення статусу платежу

### Аналітика

- `GET /api/analytics/orders` - Отримання статистики замовлень
- `GET /api/analytics/clients` - Отримання статистики клієнтів
- `GET /api/analytics/revenue` - Отримання статистики доходів
- `GET /api/analytics/services` - Отримання статистики послуг
