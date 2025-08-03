# Структура проекту JavaSpringDryCleaning

## Загальна структура

```
JavaSpringDryCleaning/
├── architecture/               # Архітектурна документація
│   ├── DOMAIN_ARCHITECTURE.md
│   ├── PROJECT_STRUCTURE.md
│   └── API_CONTRACTS.md
│
├── dry-cleaning-parent/       # Parent POM для всіх модулів
│   └── pom.xml
│
├── dry-cleaning-common/       # Спільні компоненти
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/common/
│       ├── domain/           # Спільні доменні моделі
│       │   ├── Money.java
│       │   ├── Address.java
│       │   ├── PhoneNumber.java
│       │   └── Email.java
│       ├── exception/        # Спільні exception
│       ├── util/            # Утиліти
│       └── validation/      # Валідатори
│
├── dry-cleaning-auth/        # Auth домен
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/auth/
│       ├── controller/
│       ├── serviceCatalog/
│       ├── repository/
│       ├── domain/
│       ├── dto/
│       └── config/
│
├── dry-cleaning-customer/    # Customer домен
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/customer/
│       ├── controller/
│       ├── serviceCatalog/
│       ├── repository/
│       ├── domain/
│       ├── dto/
│       └── mapper/
│
├── dry-cleaning-branch/      # Branch домен
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/branch/
│       ├── controller/
│       ├── serviceCatalog/
│       ├── repository/
│       ├── domain/
│       └── dto/
│
├── dry-cleaning-serviceCatalog/     # Service домен (включає каталог послуг та предметів)
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/serviceCatalog/
│       ├── controller/
│       ├── serviceCatalog/
│       │   ├── ServiceCatalogService.java
│       │   ├── ItemService.java
│       │   └── ServiceItemService.java
│       ├── repository/
│       ├── domain/
│       │   ├── Service.java
│       │   ├── Item.java
│       │   ├── ServiceItem.java
│       │   ├── ServiceCategoryType.java
│       │   └── UnitOfMeasure.java
│       ├── dto/
│       └── loader/            # Завантаження CSV
│
├── dry-cleaning-pricing/     # Pricing домен
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/pricing/
│       ├── controller/
│       ├── serviceCatalog/
│       │   ├── PriceCalculator.java
│       │   └── ModifierService.java
│       ├── repository/
│       ├── domain/
│       ├── dto/
│       └── rules/          # Бізнес правила
│
├── dry-cleaning-order/       # Order домен (включає корзину та характеристики предметів)
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/order/
│       ├── controller/
│       │   ├── CartController.java
│       │   └── OrderController.java
│       ├── serviceCatalog/
│       │   ├── CartService.java
│       │   ├── CartCalculationService.java
│       │   ├── OrderService.java
│       │   └── OrderItemService.java
│       ├── repository/
│       │   ├── CartRepository.java
│       │   └── OrderRepository.java
│       ├── domain/
│       │   ├── cart/
│       │   │   ├── OrderCart.java
│       │   │   ├── CartItem.java
│       │   │   ├── CartItemPricing.java
│       │   │   └── CartPricing.java
│       │   ├── order/
│       │   │   ├── Order.java
│       │   │   ├── OrderItem.java
│       │   │   ├── OrderItemCharacteristics.java
│       │   │   ├── OrderItemPhoto.java
│       │   │   ├── OrderItemDefect.java
│       │   │   └── OrderItemStain.java
│       ├── dto/
│       │   ├── cart/
│       │   └── order/
│       ├── saga/           # Order saga
│       ├── event/          # Domain events
│       └── storage/        # Для роботи з фото
│
├── dry-cleaning-payment/     # Payment домен
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/payment/
│       ├── controller/
│       ├── serviceCatalog/
│       ├── repository/
│       ├── domain/
│       ├── dto/
│       └── gateway/        # Payment gateways
│
├── dry-cleaning-receipt/     # Receipt домен
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/receipt/
│       ├── controller/
│       ├── serviceCatalog/
│       ├── repository/
│       ├── domain/
│       ├── dto/
│       ├── template/       # Шаблони квитанцій
│       └── generator/      # PDF/Print генератори
│
├── dry-cleaning-notification/  # Notification домен
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/notification/
│       ├── controller/
│       ├── serviceCatalog/
│       ├── repository/
│       ├── domain/
│       ├── dto/
│       └── channel/        # SMS, Viber, Email
│
├── dry-cleaning-config/      # Configuration домен
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/config/
│       ├── controller/
│       ├── serviceCatalog/
│       ├── repository/
│       ├── domain/
│       └── dto/
│
├── dry-cleaning-reporting/   # Reporting домен
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/reporting/
│       ├── controller/
│       ├── serviceCatalog/
│       ├── repository/
│       ├── domain/
│       ├── dto/
│       └── export/         # Excel, PDF експорт
│
├── dry-cleaning-api-gateway/ # API Gateway
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/gateway/
│       ├── controller/     # Aggregate controllers
│       ├── serviceCatalog/       # Orchestration
│       ├── security/      # Security config
│       └── config/
│
├── dry-cleaning-web/         # Frontend (якщо потрібно)
│   ├── package.json
│   ├── src/
│   └── public/
│
├── docker/                   # Docker конфігурація
│   ├── docker-compose.yml
│   └── Dockerfile
│
├── scripts/                  # Допоміжні скрипти
│   ├── build.sh
│   └── deploy.sh
│
├── docs/                     # Документація
│   ├── api/
│   ├── user-guide/
│   └── deployment/
│
└── CLAUDE.md                # Інструкції для розробки
```

## Структура кожного модуля

### Типова структура домену:

```
dry-cleaning-{domain}/
├── pom.xml
└── src/
    ├── main/
    │   ├── java/org/example/dryclean/{domain}/
    │   │   ├── controller/          # REST контролери
    │   │   │   └── {Domain}Controller.java
    │   │   ├── serviceCatalog/            # Бізнес-логіка
    │   │   │   ├── {Domain}Service.java
    │   │   │   └── impl/
    │   │   │       └── {Domain}ServiceImpl.java
    │   │   ├── repository/         # Data access
    │   │   │   └── {Domain}Repository.java
    │   │   ├── domain/            # Domain entities
    │   │   │   └── {Entity}.java
    │   │   ├── dto/               # Data Transfer Objects
    │   │   │   ├── request/
    │   │   │   └── response/
    │   │   ├── mapper/            # Entity <-> DTO mappers
    │   │   │   └── {Domain}Mapper.java
    │   │   ├── exception/         # Domain exceptions
    │   │   ├── event/            # Domain events
    │   │   └── config/           # Domain configuration
    │   └── resources/
    │       ├── application.yml
    │       └── db/migration/     # Flyway migrations
    └── test/
        └── java/org/example/dryclean/{domain}/
            ├── unit/            # Unit tests
            ├── integration/     # Integration tests
            └── fixtures/        # Test data
```

## Рекомендації щодо організації коду

### 1. Domain Layer (domain/)
- Чисті Java класи без фреймворк-специфічних анотацій
- Бізнес-логіка та правила
- Value objects та entities

### 2. Service Layer (serviceCatalog/)
- Spring Service анотації
- Транзакційна логіка
- Оркестрація між репозиторіями

### 3. Controller Layer (controller/)
- REST endpoints
- Валідація вхідних даних
- Маппінг DTO <-> Domain

### 4. Repository Layer (repository/)
- Spring Data JPA інтерфейси
- Custom query methods
- Specifications для складних запитів

### 5. DTO Layer (dto/)
- Request/Response objects
- Validation annotations
- API documentation annotations

## Міграція з поточної структури

### Крок 1: Створення parent POM
```bash
mkdir dry-cleaning-parent
# Створити parent pom.xml з загальними залежностями
```

### Крок 2: Створення common модуля
```bash
mkdir dry-cleaning-common
# Перенести спільні класи
```

### Крок 3: Створення доменних модулів
```bash
# Для кожного домену
mkdir dry-cleaning-{domain}
# Створити структуру папок
# Створити pom.xml
```

### Крок 4: Рефакторинг існуючого коду
- Розділити Main.java на відповідні домени
- Створити необхідні класи в кожному домені

## Переваги такої структури

1. **Модульність** - кожен домен незалежний
2. **Масштабованість** - легко додавати нові домени
3. **Тестування** - ізольоване тестування доменів
4. **Деплой** - можливість окремого деплою модулів
5. **Командна робота** - різні команди можуть працювати над різними доменами

## Альтернативний підхід (Монолітна структура)

Якщо ви хочете почати з простішої структури:

```
src/main/java/org/example/dryclean/
├── auth/
├── customer/
├── branch/
├── serviceCatalog/         # Каталог послуг та предметів
├── pricing/
├── order/          # Замовлення з характеристиками
├── payment/
├── receipt/
├── notification/
├── config/
├── reporting/
└── common/
```

Це дозволить почати швидше, а потім при необхідності мігрувати на модульну архітектуру.