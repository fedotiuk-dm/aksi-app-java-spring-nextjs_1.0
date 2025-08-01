# Архітектура системи управління хімчисткою

## 📋 Огляд документації

Ця папка містить повну архітектурну документацію системи управління хімчисткою. Документація організована таким чином:

### Основні документи:
1. **[DOMAIN_ARCHITECTURE.md](DOMAIN_ARCHITECTURE.md)** - Опис 13 доменів системи з розділенням Auth та User
2. **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Структура проекту та організація модулів
3. **[DOMAIN_INTERACTIONS.md](DOMAIN_INTERACTIONS.md)** - Взаємодія між доменами
4. **[API_CONTRACTS.md](API_CONTRACTS.md)** - REST API контракти для всіх доменів
5. **[OPENAPI_FIRST_APPROACH.md](OPENAPI_FIRST_APPROACH.md)** - OpenAPI-first підхід для генерації коду
6. **[COOKIE_BASED_AUTH.md](COOKIE_BASED_AUTH.md)** - Cookie-based автентифікація
7. **[NEXT_STEPS.md](NEXT_STEPS.md)** - План реалізації проекту

## 🎯 Ключові архітектурні рішення

### 1. Domain-Driven Design
- 13 незалежних доменів з чіткими межами
- Кожен домен відповідає за свою область бізнес-логіки
- Мінімальні залежності між доменами

### 2. OpenAPI-First
- API проектується через OpenAPI специфікацію
- Автоматична генерація DTO та контролерів
- Єдине джерело правди для API контрактів

### 3. Cookie-Based Authentication
- HttpOnly cookies для безпеки
- Session management через Redis
- CSRF захист

### 4. Модульна архітектура
- Можливість почати з моноліту
- Еволюція до модульного моноліту
- Опція переходу на мікросервіси

## 🏗 Структура доменів

### Core домени:
1. **Auth** - автентифікація та сесії
2. **User** - управління користувачами системи
3. **Customer** - клієнти хімчистки
4. **Order** - замовлення та їх життєвий цикл
5. **Pricing** - розрахунок вартості

### Supporting домени:
6. **Branch** - філії та пункти прийому
7. **Item** - каталог предметів
8. **Service** - каталог послуг
9. **Payment** - платежі
10. **Receipt** - квитанції
11. **Notification** - сповіщення
12. **Configuration** - налаштування
13. **Reporting** - звітність

## 🚀 Швидкий старт

### Мінімальний MVP включає:
1. Auth + User - для входу в систему
2. Customer - управління клієнтами
3. Order - створення замовлень
4. Pricing - розрахунок вартості
5. Receipt - друк квитанцій

### Рекомендована послідовність:
1. Створити OpenAPI специфікації для MVP доменів
2. Згенерувати DTO та API інтерфейси
3. Реалізувати cookie-based auth
4. Імплементувати core домени
5. Додавати інші домени поступово

## 🛠 Технологічний стек

### Backend:
- Java 21
- Spring Boot 3.x
- Spring Security (cookie-based)
- Spring Data JPA
- PostgreSQL
- Redis (sessions)
- OpenAPI Generator
- Liquibase (migrations)

### Інтеграції:
- SMS провайдери
- Viber API
- Платіжні системи
- PDF генерація

## 📐 Архітектурні підходи

### Для старту (Монолітна архітектура):
```
JavaSpringDryCleaning/
├── src/main/java/org/example/dryclean/
│   ├── auth/
│   ├── user/
│   ├── customer/
│   ├── order/
│   ├── pricing/
│   └── common/
└── api-specs/
    └── *.yaml
```

### Для масштабування (Модульний моноліт):
```
JavaSpringDryCleaning/
├── dry-cleaning-auth/
├── dry-cleaning-user/
├── dry-cleaning-customer/
├── dry-cleaning-order/
├── dry-cleaning-pricing/
└── dry-cleaning-common/
```

## 📝 Best Practices

1. **API Design**:
   - RESTful принципи
   - Consistent naming
   - Proper HTTP status codes
   - Versioning через URL

2. **Security**:
   - HttpOnly cookies
   - CSRF protection
   - Rate limiting
   - Input validation

3. **Code Quality**:
   - OpenAPI-first для consistency
   - Bean Validation
   - Unit та Integration тести
   - CI/CD pipeline

4. **Performance**:
   - Caching де можливо
   - Database indexing
   - Async processing
   - Connection pooling

## 🔄 Еволюція архітектури

### Phase 1: Монолітний MVP
- Всі домени в одному проекті
- Швидкий старт
- Прості deployment

### Phase 2: Модульний моноліт
- Окремі Maven модулі
- Чіткі контракти
- Підготовка до розділення

### Phase 3: Мікросервіси (опційно)
- Окремі deployment units
- Independent scaling
- Technology diversity

## ❓ FAQ

**Q: Чи не надто складна архітектура для старту?**
A: Ні, можна почати з простого моноліту, використовуючи лише пакетну структуру. Модульність додається поступово.

**Q: Чому Cookie-based auth замість JWT?**
A: Cookies більш безпечні (HttpOnly), простіші в управлінні сесіями, не потребують зберігання на клієнті.

**Q: Як генерувати код з OpenAPI?**
A: Використовуйте openapi-generator-maven-plugin, який автоматично створить DTO та API інтерфейси.

**Q: Які домени критичні для MVP?**
A: Auth, User, Customer, Order, Pricing, Receipt - мінімальний набір для функціонуючої системи.

---

Для початку роботи перегляньте [NEXT_STEPS.md](NEXT_STEPS.md) з детальним планом реалізації.