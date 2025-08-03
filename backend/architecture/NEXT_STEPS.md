# Наступні кроки реалізації

## Підготовлено архітектурні документи

✅ **DOMAIN_ARCHITECTURE.md** - 13 доменів з розділенням Auth/User
✅ **PROJECT_STRUCTURE.md** - структура проекту
✅ **DOMAIN_INTERACTIONS.md** - взаємодія між доменами
✅ **API_CONTRACTS.md** - API контракти
✅ **OPENAPI_FIRST_APPROACH.md** - OpenAPI генерація
✅ **COOKIE_BASED_AUTH.md** - cookie автентифікація

## Рекомендована послідовність

### Фаза 1: OpenAPI та Інфраструктура (3-5 днів)

1. **Створити OpenAPI специфікації**
   - Базові схеми (error, pagination)
   - Auth API (login/logout)
   - User API (CRUD операції)
   - Customer API

2. **Налаштувати проект**
   - Maven з OpenAPI generator plugin
   - Spring Boot 3.x
   - Docker compose для БД та Redis

3. **Згенерувати базовий код**
   - DTO з OpenAPI specs
   - API інтерфейси
   - Validation annotations

### Фаза 2: Auth та User (1 тиждень)

1. **Cookie-based Authentication**
   - Session management в Redis
   - CSRF protection
   - Security filters

2. **User Management**
   - Ролі (OPERATOR, MANAGER, ADMIN)
   - Прив'язка до філій
   - CRUD операції

3. **Testing**
   - Integration tests з Testcontainers
   - Security testing

### Фаза 3: Core MVP (2 тижні)

1. **Customer Domain**
   - Пошук клієнтів
   - Історія замовлень
   - Комунікаційні налаштування

2. **Service Domain** 
   - Каталог послуг (чистка, прання, прасування)
   - Каталог предметів та зв'язок з послугами
   - Базові ціни з прайс-листа (CSV)

3. **Order Domain з Cart функціональністю**
   - **Cart (корзина)**:
     - Тимчасове зберігання предметів до створення замовлення
     - Інтерактивний розрахунок цін в реальному часі
     - Застосування глобальних параметрів (терміновість, знижки)
     - TTL механізм (автовидалення через 1 годину)
   - **Order (замовлення)**:
     - Створення замовлень з готової корзини
     - Фіксація характеристик предметів (матеріал, колір, дефекти)
     - Фотографування предметів
     - Статуси

4. **Pricing Domain**
   - Калькулятор на основі ServiceItem та характеристик
   - Модифікатори та правила
   - API для розрахунків
   - Інтеграція з Cart для real-time обчислень

5. **Receipt Domain**
   - PDF генерація
   - QR коди
   - Шаблони

### Фаза 4: Розширені функції (за потребою)

- **Payment** - інтеграція платежів
- **Notification** - SMS/Viber
- **Branch** - управління філіями
- **Reporting** - звітність

## Структура для старту

### Монолітна архітектура
```
src/main/java/org/example/dryclean/
├── auth/          # Authentication
├── user/          # User management  
├── customer/      # Customers
├── serviceCatalog/       # Services catalog (включає предмети)
├── order/         # Orders (включає корзину та характеристики)
│   ├── cart/      # Cart functionality
│   ├── order/     # Order management
│   └── storage/   # Photo storage
├── pricing/       # Price calculation
├── receipt/       # Receipts
└── common/        # Shared components
```

### OpenAPI структура
```
api-specs/
├── common/        # Shared schemas
├── auth-api.yaml
├── user-api.yaml
├── customer-api.yaml
├── serviceCatalog-api.yaml    # Послуги та предмети
├── cart-api.yaml       # Корзина
├── order-api.yaml      # Замовлення
├── pricing-api.yaml
└── main-api.yaml      # Aggregates all APIs
```

## Ключові технології

- **Backend**: Spring Boot 3.x, Java 21
- **API**: OpenAPI 3.0, генерація коду
- **Auth**: Cookie-based, Spring Security
- **Database**: PostgreSQL, Flyway migrations
- **Sessions & Cache**: Redis (сесії та корзина з TTL)
- **Testing**: JUnit 5, Testcontainers
- **Deploy**: Docker, Docker Compose

## Workflow розробки

1. **Design API First**
   - Написати OpenAPI spec
   - Валідувати через Redocly
   - Review з командою

2. **Generate Code**
   - Maven generate-sources
   - Імплементувати згенеровані інтерфейси
   - Додати бізнес-логіку

3. **Test Driven**
   - Integration tests
   - API contract tests
   - Security tests

4. **Deploy**
   - Docker containers
   - Environment configs
   - Health checks

## MVP Checklist

### Week 1
- [ ] OpenAPI specs для Auth, User, Customer
- [ ] Налаштування проекту та генерація
- [ ] Cookie authentication
- [ ] User CRUD

### Week 2
- [ ] Customer management
- [ ] Service catalog (послуги та предмети)
- [ ] Cart implementation:
  - [ ] Cart REST API
  - [ ] Real-time price calculation
  - [ ] TTL mechanism with Redis
  - [ ] Urgency and discount handling
- [ ] Order creation flow (з характеристиками):
  - [ ] Create order from cart
  - [ ] Item characteristics capture
  - [ ] Photo upload

### Week 3
- [ ] Pricing calculator
- [ ] Receipt generation
- [ ] Testing
- [ ] Documentation
- [ ] Docker setup

## Важливі рішення

1. **OpenAPI-First** - всі API проектуються через специфікації
2. **Cookie Auth** - безпечніше за JWT в headers
3. **Модульність** - домени максимально незалежні
4. **PostgreSQL + Redis** - основне сховище + сесії
5. **Docker** - все працює в контейнерах
6. **Cart-based Order Flow** - корзина для інтерактивного розрахунку перед створенням замовлення

## Quick Start

```bash
# 1. Створити OpenAPI specs
# 2. Згенерувати код: mvn generate-sources
# 3. Запустити в Docker: docker-compose up
# 4. Розробляти з hot-reload
```

Детальні приклади коду та специфікацій дивіться у відповідних документах архітектури.