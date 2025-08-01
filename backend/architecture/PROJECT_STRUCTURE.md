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
│       ├── service/
│       ├── repository/
│       ├── domain/
│       ├── dto/
│       └── config/
│
├── dry-cleaning-customer/    # Customer домен
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/customer/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── domain/
│       ├── dto/
│       └── mapper/
│
├── dry-cleaning-branch/      # Branch домен
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/branch/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── domain/
│       └── dto/
│
├── dry-cleaning-item/        # Item домен
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/item/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── domain/
│       ├── dto/
│       └── storage/         # Для роботи з фото
│
├── dry-cleaning-service/     # Service домен
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/service/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── domain/
│       └── dto/
│
├── dry-cleaning-pricing/     # Pricing домен
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/pricing/
│       ├── controller/
│       ├── service/
│       │   ├── PriceCalculator.java
│       │   └── ModifierService.java
│       ├── repository/
│       ├── domain/
│       ├── dto/
│       └── rules/          # Бізнес правила
│
├── dry-cleaning-order/       # Order домен
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/order/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── domain/
│       ├── dto/
│       ├── saga/           # Order saga
│       └── event/          # Domain events
│
├── dry-cleaning-payment/     # Payment домен
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/payment/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── domain/
│       ├── dto/
│       └── gateway/        # Payment gateways
│
├── dry-cleaning-receipt/     # Receipt домен
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/receipt/
│       ├── controller/
│       ├── service/
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
│       ├── service/
│       ├── repository/
│       ├── domain/
│       ├── dto/
│       └── channel/        # SMS, Viber, Email
│
├── dry-cleaning-config/      # Configuration домен
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/config/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── domain/
│       └── dto/
│
├── dry-cleaning-reporting/   # Reporting домен
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/reporting/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── domain/
│       ├── dto/
│       └── export/         # Excel, PDF експорт
│
├── dry-cleaning-api-gateway/ # API Gateway
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/gateway/
│       ├── controller/     # Aggregate controllers
│       ├── service/       # Orchestration
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
    │   │   ├── service/            # Бізнес-логіка
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

### 2. Service Layer (service/)
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
├── item/
├── service/
├── pricing/
├── order/
├── payment/
├── receipt/
├── notification/
├── config/
├── reporting/
└── common/
```

Це дозволить почати швидше, а потім при необхідності мігрувати на модульну архітектуру.