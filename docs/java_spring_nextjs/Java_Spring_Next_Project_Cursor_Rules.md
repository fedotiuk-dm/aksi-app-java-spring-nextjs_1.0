---
description: Інструкція для Cursor IDE - Розробка проекту "Хімчистка" з Java/Spring на бекенді та Next.js на фронтенді
globs:
alwaysApply: true
---

# Інструкція для Cursor IDE: Розробка проекту "Хімчистка" з Java/Spring на бекенді та Next.js на фронтенді

## Мета

1. Розробити повноцінну систему управління хімчисткою з використанням Java/Spring для бекенду та Next.js для фронтенду.
2. Надати інструкції для Cursor щодо розміщення нових файлів, дотримання архітектурних принципів та запобігання типовим помилкам.

## Архітектурні підходи

1. **Domain-Driven Design (DDD)** - для бекенду
2. **Feature-Sliced Design (FSD)** - для фронтенду
3. **SOLID** принципи - для всього проекту

## Технологічний стек

### Бекенд

## Технологічний стек

### Бекенд

- **Фреймворк:** Spring Boot 3.4.4
- **Мова:** Java 21.0.6 LTS
- **База даних:** PostgreSQL 17.4
- **ORM:** Hibernate/Spring Data JPA
- **API:** REST (Spring Web)
- **Документація API:** Swagger/OpenAPI
- **Автентифікація:** Spring Security + JWT
- **Валідація:** Jakarta Validation (Hibernate Validator)
- **Маппінг об'єктів:** MapStruct 1.5.5, Lombok 1.18.30
- **Логування:** SLF4J + Logback
- **Тестування:** JUnit 5, Mockito, TestContainers
- **Міграції БД:** Liquibase

### Фронтенд

- **Фреймворк:** Next.js 15.3.0 (App Router)
- **Мова:** TypeScript 5
- **Node.js:** 22.14.0-alpine3.20
- **UI:** Material UI 7.0.x
- **Керування станом:** React Context API (локально) + Zustand 5.0.x (глобально)
- **API/Бекенд взаємодія:** React Query 5.72.x + Axios 1.8.x
- **Форми:** React Hook Form 7.55.0
- **Валідація:** Zod 3.24.x
- **Дати:** Day.js 1.11.13
- **Тестування:** Vitest 3.1.x + React Testing Library 16.3.0
- **Логування/Моніторинг:** Sentry
- **Локалізація (i18n):** next-intl 4.0.x

## Принципи організації монорепозиторію

Для ефективної організації проекту "Хімчистка" рекомендується використовувати підхід монорепозиторію, який спрощує координацію розробки бекенду та фронтенду.

### Рекомендації щодо організації

1. **Основний поділ проекту**:

   - `backend/` - для Java/Spring коду
   - `frontend/` - для Next.js коду
   - Спільні ресурси на кореневому рівні

2. **Управління залежностями**:

   - Окремі системи управління залежностями для бекенду (Maven/Gradle) та фронтенду (npm)
   - Узгоджені версії спільних бібліотек

3. **Організація роботи**:

   - Розробка нових функцій в єдиних feature-гілках, що охоплюють як бекенд, так і фронтенд
   - Атомарні комміти, що зберігають узгодженість між частинами системи

4. **Спільні інструменти**:
   - Загальні скрипти для розгортання та тестування
   - Єдина система CI/CD з окремими етапами для бекенду та фронтенду

### Переваги для розробки в Cursor IDE

- Легка навігація між взаємопов'язаними компонентами бекенду та фронтенду
- Спрощене відстеження змін API та відповідних викликів
- Можливість швидкої синхронізації моделей даних на обох сторонах

## Структура проекту

### Структура бекенду (Java/Spring)

```
/backend
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── aksi/
│   │   │           ├── AksiApplication.java                  # Головний клас
│   │   │           │
│   │   │           ├── config/                               # Конфігурації
│   │   │           │   ├── SecurityConfig.java
│   │   │           │   ├── WebConfig.java
│   │   │           │   ├── SwaggerConfig.java
│   │   │           │   ├── ValidationConfig.java
│   │   │           │   └── ApplicationConfig.java
│   │   │           │
│   │   │           ├── domain/                               # Доменні об'єкти (DDD)
│   │   │           │   ├── client/                           # Агрегат "Клієнт"
│   │   │           │   │   ├── Client.java                   # Коренева сутність
│   │   │           │   │   ├── ClientRepository.java         # Репозиторій
│   │   │           │   │   ├── Address.java                  # Вкладена сутність
│   │   │           │   │   ├── ContactInfo.java              # Вкладена сутність
│   │   │           │   │   └── ClientPreferences.java        # Вкладена сутність
│   │   │           │   │
│   │   │           │   ├── order/                            # Агрегат "Замовлення"
│   │   │           │   │   ├── Order.java                    # Коренева сутність
│   │   │           │   │   ├── OrderRepository.java          # Репозиторій
│   │   │           │   │   ├── OrderItem.java                # Вкладена сутність
│   │   │           │   │   ├── Stain.java                    # Вкладена сутність
│   │   │           │   │   ├── Defect.java                   # Вкладена сутність
│   │   │           │   │   ├── OrderStatus.java              # Enum
│   │   │           │   │   └── PaymentDetails.java           # Вкладена сутність
│   │   │           │   │
│   │   │           │   ├── pricing/                          # Агрегат "Ціноутворення"
│   │   │           │   │   ├── ServiceCategory.java          # Категорії послуг
│   │   │           │   │   ├── PriceItem.java                # Елемент прайс-листа
│   │   │           │   │   ├── PriceModifier.java            # Модифікатор ціни
│   │   │           │   │   ├── Discount.java                 # Знижка
│   │   │           │   │   └── PriceListRepository.java      # Репозиторій прайс-листа
│   │   │           │   │
│   │   │           │   ├── user/                             # Агрегат "Користувач"
│   │   │           │   │   ├── User.java
│   │   │           │   │   ├── Role.java
│   │   │           │   │   ├── Permission.java
│   │   │           │   │   └── UserRepository.java
│   │   │           │   │
│   │   │           │   └── common/                           # Спільні компоненти домену
│   │   │           │       ├── AuditableEntity.java
│   │   │           │       ├── ValueObject.java
│   │   │           │       └── DomainEvent.java
│   │   │           │
│   │   │           ├── service/                              # Сервіси домену
│   │   │           │   ├── client/                           # Сервіси для клієнтів
│   │   │           │   │   ├── ClientService.java            # Інтерфейс
│   │   │           │   │   └── ClientServiceImpl.java        # Реалізація
│   │   │           │   │
│   │   │           │   ├── order/                            # Сервіси для замовлень
│   │   │           │   │   ├── OrderService.java             # Інтерфейс
│   │   │           │   │   ├── OrderServiceImpl.java         # Реалізація
│   │   │           │   │   ├── OrderWizardService.java       # Інтерфейс
│   │   │           │   │   └── OrderWizardServiceImpl.java   # Реалізація
│   │   │           │   │
│   │   │           │   ├── pricing/                          # Сервіси для ціноутворення
│   │   │           │   │   ├── PriceCalculationService.java
│   │   │           │   │   └── PriceCalculationServiceImpl.java
│   │   │           │   │
│   │   │           │   ├── user/                             # Сервіси для користувачів
│   │   │           │   │   ├── UserService.java
│   │   │           │   │   └── UserServiceImpl.java
│   │   │           │   │
│   │   │           │   └── receipt/                          # Сервіси для квитанцій
│   │   │           │       ├── ReceiptGenerationService.java
│   │   │           │       └── ReceiptGenerationServiceImpl.java
│   │   │           │
│   │   │           ├── api/                                  # API контролери
│   │   │           │   ├── v1/                               # Версія API
│   │   │           │   │   ├── ClientController.java
│   │   │           │   │   ├── OrderController.java
│   │   │           │   │   ├── PriceListController.java
│   │   │           │   │   ├── OrderWizardController.java
│   │   │           │   │   ├── AuthController.java
│   │   │           │   │   └── SettingsController.java
│   │   │           │   │
│   │   │           │   └── advice/                           # Глобальна обробка помилок
│   │   │           │       └── GlobalExceptionHandler.java
│   │   │           │
│   │   │           ├── dto/                                  # DTO
│   │   │           │   ├── client/
│   │   │           │   │   ├── ClientDTO.java
│   │   │           │   │   ├── ClientCreateRequest.java
│   │   │           │   │   └── ClientResponse.java
│   │   │           │   │
│   │   │           │   ├── order/
│   │   │           │   │   ├── OrderDTO.java
│   │   │           │   │   ├── OrderItemDTO.java
│   │   │           │   │   ├── OrderCreateRequest.java
│   │   │           │   │   └── OrderResponse.java
│   │   │           │   │
│   │   │           │   ├── pricing/
│   │   │           │   │   ├── PriceItemDTO.java
│   │   │           │   │   ├── PriceCalculationRequest.java
│   │   │           │   │   └── PriceCalculationResponse.java
│   │   │           │   │
│   │   │           │   └── auth/
│   │   │           │       ├── LoginRequest.java
│   │   │           │       └── LoginResponse.java
│   │   │           │
│   │   │           ├── mapper/                              # Маппери DTO <-> Домен
│   │   │           │   ├── ClientMapper.java
│   │   │           │   ├── OrderMapper.java
│   │   │           │   ├── PriceItemMapper.java
│   │   │           │   └── UserMapper.java
│   │   │           │
│   │   │           ├── exception/                           # Власні винятки
│   │   │           │   ├── EntityNotFoundException.java
│   │   │           │   ├── BusinessException.java
│   │   │           │   ├── ValidationException.java
│   │   │           │   └── SecurityException.java
│   │   │           │
│   │   │           └── util/                               # Утиліти
│   │   │               ├── JwtUtils.java
│   │   │               ├── ValidationUtils.java
│   │   │               └── DateTimeUtils.java
│   │   │
│   │   └── resources/
│   │       ├── application.yml                         # Основна конфігурація
│   │       ├── application-dev.yml                     # Конфігурація для розробки
│   │       ├── application-prod.yml                    # Конфігурація для продакшну
│   │       ├── db/                                     # Міграції бази даних
│   │       │   └── changelog/
│   │       │       ├── db.changelog-master.yaml
│   │       │       ├── db.changelog-1.0.yaml
│   │       │       └── ...
│   │       └── i18n/                                  # Локалізаційні файли
│   │           ├── messages_en.properties
│   │           └── messages_uk.properties
│   │
│   └── test/
│       └── java/
│           └── com/
│               └── aksi/
│                   ├── service/                        # Тести сервісів
│                   │   ├── ClientServiceTest.java
│                   │   ├── OrderServiceTest.java
│                   │   └── PriceCalculationServiceTest.java
│                   │
│                   ├── api/                            # Тести контролерів
│                   │   ├── ClientControllerTest.java
│                   │   ├── OrderControllerTest.java
│                   │   └── ...
│                   │
│                   └── integration/                    # Інтеграційні тести
│                       ├── OrderIntegrationTest.java
│                       └── ...
├── pom.xml                                          # Конфігурація Maven
└── README.md
```

## Правила роботи з міграціями Liquibase

### ВАЖЛИВО: Синхронізація змін сутностей і міграцій бази даних

При роботі з проектом **обов'язково** потрібно дотримуватись наступних правил:

1. **При створенні нових сутностей**:

   - Створити відповідний файл міграції Liquibase
   - Додати посилання на міграцію в `db.changelog-master.yaml`
   - Ніколи не покладатися на автоматичне оновлення схеми через Hibernate (`spring.jpa.hibernate.ddl-auto=update`)

2. **При модифікації існуючих сутностей**:

   - Створити новий файл міграції з необхідними змінами (addColumn, modifyDataType, тощо)
   - Ніколи не змінювати вже застосовані файли міграцій
   - Використовувати інкрементальний ідентифікатор для нових changeSet

3. **Правила іменування файлів міграцій**:

   - Використовувати формат `db.changelog-X.Y.yaml`, де X - мажорна версія, Y - мінорна версія
   - Кожна нова група змін повинна мати свій файл міграції

4. **Структура changeSet**:
   - Кожен changeSet повинен мати унікальний ідентифікатор та автора
   - Групувати логічно пов'язані зміни в один changeSet
   - Додавати коментарі для складних змін

### Приклад процесу внесення змін

1. Додавання нової сутності:

   ```java
   // 1. Створення Java-класу сутності
   @Entity
   @Table(name = "clients")
   public class Client {
       @Id
       @GeneratedValue
       private UUID id;

       // ... поля сутності
   }
   ```

2. Створення файлу міграції:

   ```yaml
   # 2. Створення файлу міграції db.changelog-X.Y.yaml
   databaseChangeLog:
     - changeSet:
         id: N
         author: developerName
         changes:
           - createTable:
               tableName: clients
               columns:
                 - column:
                     name: id
                     type: uuid
                     constraints:
                       primaryKey: true
                       nullable: false
                 # ... інші колонки
   ```

3. Оновлення мастер-файлу:
   ```yaml
   # 3. Додавання посилання в db.changelog-master.yaml
   databaseChangeLog:
     - include:
         file: db/changelog/db.changelog-1.0.yaml
     - include:
         file: db/changelog/db.changelog-X.Y.yaml
   ```

### Структура фронтенду (Next.js)

```
/frontend
├── app/                      # Маршрутизація (App Router)
│   ├── (app)/                # Група маршрутів основного додатку
│   │   ├── dashboard/
│   │   │   └── page.tsx      # -> features/dashboard/components
│   │   ├── order/
│   │   │   └── page.tsx      # ! Server Component: Завантажує прайс, рендерить <OrderWizard/>
│   │   ├── orders/
│   │   │   ├── page.tsx      # -> features/orders/components
│   │   │   └── [orderId]/
│   │   │       └── page.tsx  # -> features/orders/components
│   │   ├── clients/
│   │   │   ├── page.tsx      # -> features/clients/components
│   │   │   └── [clientId]/
│   │   │       └── page.tsx  # -> features/clients/components
│   │   ├── pricelist/
│   │   │   └── page.tsx      # -> features/pricelist/components
│   │   ├── settings/
│   │   │   └── page.tsx      # -> features/settings/components
│   │   └── layout.tsx        # ! Спільний лейаут для групи (app)
│   │
│   ├── login/                # === Сторінка Логіну ===
│   │   └── page.tsx          # -> features/auth/components/LoginForm
│   │
│   │
│   ├── api/                  # API Routes (якщо потрібні)
│   │   └── ...
│   │
│   ├── layout.tsx            # ! Кореневий лейаут (ThemeProvider, CssBaseline)
│   └── globals.css           # Глобальні стилі (мінімальні)
│
├── features/                 # === Основна папка з фічами ===
│   ├── order-wizard/         # Feature slice для Order Wizard
│   │   ├── OrderWizard.tsx   # Точка входу для фічі
│   │   │
│   │   ├── components/       # UI компоненти (шар UI)
│   │   │   ├── OrderWizard.tsx # Головний контейнер візарда
│   │   │   ├── WizardStepper.tsx # Навігаційний компонент кроків
│   │   │   ├── steps/        # Основні контейнери для кроків
│   │   │   │   ├── Step1_ClientInfo.tsx
│   │   │   │   ├── Step2_ItemManager.tsx
│   │   │   │   ├── Step3_OrderParams.tsx
│   │   │   │   └── Step4_Confirmation.tsx
│   │   │   │
│   │   │   ├── step1-client-info/ # Компоненти для кроку 1
│   │   │   ├── step2-item-manager/ # Компоненти для кроку 2
│   │   │   ├── step2-item-wizard/ # Підвізард предметів
│   │   │   ├── step3-order-params/ # Компоненти для кроку 3
│   │   │   ├── step4-confirmation/ # Компоненти для кроку 4
│   │   │   └── shared/       # Спільні UI компоненти
│   │   │
│   │   ├── contexts/         # Контексти для стану
│   │   │   ├── OrderWizardContext.tsx
│   │   │   └── OrderDataContext.tsx
│   │   │
│   │   ├── hooks/            # Хуки для бізнес-логіки
│   │   │   ├── useWizardNavigation.ts
│   │   │   ├── useOrderData.ts
│   │   │   └── usePriceCalculation.ts
│   │   │
│   │   ├── api/              # API специфічні для фічі
│   │   │   ├── createOrder.ts
│   │   │   ├── calculatePrice.ts
│   │   │   └── itemManagement.ts
│   │   │
│   │   ├── types/            # Типи для фічі
│   │   │   ├── OrderTypes.ts
│   │   │   └── WizardTypes.ts
│   │   │
│   │   └── index.ts          # Головний експорт фічі
│   │
│   ├── clients/              # === Фіча "Клієнти" ===
│   ├── orders/               # === Фіча "Замовлення" ===
│   ├── pricelist/            # === Фіча "Прайс-лист" ===
│   ├── auth/                 # === Фіча "Автентифікація" ===
│   ├── dashboard/            # === Фіча "Дашборд" ===
│   └── settings/             # === Фіча "Налаштування" ===
│
├── components/               # === Глобальні UI компоненти ===
├── hooks/                    # === Глобальні хуки ===
├── utils/                    # === Глобальні утиліти ===
├── types/                    # === Глобальні типи ===
├── constants/                # === Глобальні константи ===
├── lib/                      # Ініціалізація бібліотек
│   ├── axios.ts              # Налаштування Axios
│   ├── reactQuery.ts         # Налаштування React Query
│   ├── auth.ts               # Логіка автентифікації
│   ├── theme.ts              # Налаштування теми MUI
│   └── dayjs.ts              # Налаштування Day.js
│
├── locales/                  # Файли перекладу (i18n)
│   ├── en.json
│   └── uk.json
│
├── public/                   # Статичні файли
│
├── .env.local                # Змінні середовища
├── .eslintrc.js
├── .gitignore
├── next.config.mjs
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

## Правила роботи Cursor під час розробки

### Загальні правила

1. **Розміщення нових файлів:**

   - **Бекенд:** Слідуйте принципам DDD і розміщуйте файли в папках відповідно до їх доменної області
   - **Фронтенд:** Дотримуйтесь FSD і розміщуйте нові файли у відповідних папках фіч

2. **Іменування файлів:**

   - **Бекенд:** PascalCase для класів та інтерфейсів (наприклад, `OrderService.java`)
   - **Фронтенд:** PascalCase для компонентів React, camelCase для хуків та утиліт

3. **Структура імпортів:**
   - **Бекенд:** Організуйте імпорти за групами (java, spring, ваш пакет)
   - **Фронтенд:** Використовуйте аліас `@/` для імпортів з кореневої папки проекту

### Правила для бекенду (Java/Spring)

1. **Розділення відповідальності:**

   - **Контролери:** Тільки валідація параметрів, маппінг DTO і делегування сервісам
   - **Сервіси:** Бізнес-логіка, транзакції, робота з репозиторіями
   - **Репозиторії:** Робота з базою даних
   - **Сутності:** Моделі даних з необхідними валідаціями

2. **Використання DTO:**

   - Для запитів клієнта: `*Request` класи
   - Для відповідей клієнту: `*Response` класи
   - Для внутрішнього обміну: `*DTO` класи
   - Використовуйте MapStruct для маппінгу між DTO та сутностями

3. **Обробка помилок:**

   - Використовуйте власні винятки для бізнес-логіки, а не загальні RuntimeException
   - Обробляйте всі винятки через GlobalExceptionHandler
   - Повертайте зрозумілі повідомлення про помилки клієнту

4. **Валідація:**

   - Використовуйте анотації Jakarta Validation на DTO
   - Валідуйте DTO через `@Valid` в контролерах
   - Проводьте додаткову бізнес-валідацію в сервісах

5. **Безпека:**
   - Використовуйте Spring Security для автентифікації та авторизації
   - Перевіряйте права доступу на рівні контролерів та методів
   - Уникайте SQL-ін'єкцій, використовуючи параметризовані запити

### Правила для фронтенду (Next.js)

1. **Server/Client Components:**

   - **Уважно розрізняйте** Server Components та Client Components (`'use client'`)
   - **Не використовуйте** браузерні API (`window`, `localStorage` тощо) або React хуки у Server Components
   - Завантажуйте дані в Server Components і передавайте їх як пропси до Client Components

2. **Структура компонентів:**

   - Організуйте компоненти за функціональністю в папці features
   - Для спільних компонентів використовуйте папку components
   - Для бізнес-логіки створюйте хуки в папці hooks

3. **Робота з даними:**

   - Використовуйте React Query для запитів до API
   - Використовуйте Context API для локального стану фіч
   - Використовуйте Zustand для глобального стану

4. **Форми:**

   - Використовуйте React Hook Form для всіх форм
   - Валідуйте форми за допомогою Zod
   - Створюйте окремі компоненти для полів форми

5. **Стилізація:**
   - Використовуйте MUI компоненти та їх API для стилізації
   - Створіть глобальну тему в lib/theme.ts
   - Використовуйте правильну структуру Grid у MUI v7

## Order Wizard: бізнес-логіка та структура

Order Wizard - це покроковий процес оформлення замовлення, який складається з 4 основних етапів:

### Етап 1: Клієнт та базова інформація замовлення

- Пошук існуючого клієнта або створення нового
- Введення базової інформації про замовлення (номер квитанції, дата)

### Етап 2: Управління предметами замовлення

- Додавання предметів до замовлення
- Для кожного предмета є підвізард з кроками:
  - Базова інформація (категорія, найменування, кількість)
  - Характеристики (матеріал, колір, наповнювач)
  - Плями та дефекти
  - Фотографії
  - Модифікатори ціни

### Етап 3: Загальні параметри замовлення

- Параметри виконання (дата, терміновість)
- Знижки
- Деталі оплати (спосіб оплати, передоплата)
- Додаткова інформація (примітки)

### Етап 4: Підтвердження та квитанція

- Підсумок замовлення
- Юридичні аспекти
- Підпис клієнта
- Генерація та друк квитанції

## Код для роботи з API між бекендом і фронтендом

### Бекенд: REST API для Order Wizard

```java
@RestController
@RequestMapping("/api/v1/order-wizard")
@RequiredArgsConstructor
public class OrderWizardController {

    private final OrderWizardService orderWizardService;
    private final ClientService clientService;
    private final PriceCalculationService priceCalculationService;

    @GetMapping("/clients/search")
    public List<ClientResponse> searchClients(@RequestParam String query) {
        return clientService.searchClients(query);
    }

    @PostMapping("/clients")
    public ClientResponse createClient(@Valid @RequestBody ClientCreateRequest request) {
        return clientService.createClient(request);
    }

    @PostMapping("/price-calculation")
    public PriceCalculationResponse calculatePrice(@Valid @RequestBody PriceCalculationRequest request) {
        return priceCalculationService.calculatePrice(request);
    }

    @PostMapping("/orders")
    public OrderResponse createOrder(@Valid @RequestBody OrderCreateRequest request) {
        return orderWizardService.createOrder(request);
    }

    @GetMapping("/pricelist/categories")
    public List<ServiceCategoryResponse> getServiceCategories() {
        return priceCalculationService.getAllServiceCategories();
    }

    @GetMapping("/pricelist/items")
    public List<PriceItemResponse> getPriceItems(@RequestParam Long categoryId) {
        return priceCalculationService.getPriceItemsByCategoryId(categoryId);
    }
}
```

### Фронтенд: API клієнт для Order Wizard

```typescript
// features/order-wizard/api/orderWizardApi.ts
import axios from '@/lib/axios';
import {
  ClientSearchParams,
  ClientCreateData,
  PriceCalculationData,
  OrderCreateData,
} from '@/features/order-wizard/types';

export const searchClients = async (params: ClientSearchParams) => {
  const { data } = await axios.get('/api/v1/order-wizard/clients/search', {
    params,
  });
  return data;
};

export const createClient = async (clientData: ClientCreateData) => {
  const { data } = await axios.post('/api/v1/order-wizard/clients', clientData);
  return data;
};

export const calculatePrice = async (calculationData: PriceCalculationData) => {
  const { data } = await axios.post(
    '/api/v1/order-wizard/price-calculation',
    calculationData
  );
  return data;
};

export const createOrder = async (orderData: OrderCreateData) => {
  const { data } = await axios.post('/api/v1/order-wizard/orders', orderData);
  return data;
};

export const getServiceCategories = async () => {
  const { data } = await axios.get('/api/v1/order-wizard/pricelist/categories');
  return data;
};

export const getPriceItems = async (categoryId: number) => {
  const { data } = await axios.get('/api/v1/order-wizard/pricelist/items', {
    params: { categoryId },
  });
  return data;
};
```

## Рекомендації для реалізації

### Бекенд (Java/Spring)

1. **Починайте з доменної моделі:**

   - Спочатку визначте основні сутності та їх взаємозв'язки
   - Визначте репозиторії для кожної кореневої сутності

2. **Використовуйте DTOs для API:**

   - Створіть DTOs для запитів і відповідей API
   - Використовуйте MapStruct для мапінгу між сутностями та DTOs

3. **Реалізуйте бізнес-логіку в сервісах:**

   - Дотримуйтесь принципів SOLID
   - Один сервіс - одна відповідальність

4. **Тестуйте кожен шар:**

   - Пишіть юніт-тести для сервісів і репозиторіїв
   - Додайте інтеграційні тести для API

5. **Приділяйте увагу деталям:**
   - Документуйте API за допомогою Swagger/OpenAPI
   - Використовуйте Lombok для уникнення шаблонного коду

### Фронтенд (Next.js)

1. **Використовуйте Server Components для початкового завантаження даних:**

   - Завантажуйте початкові дані на сервері
   - Передавайте ці дані як пропси до Client Components

2. **Розділяйте логіку та UI:**

   - Бізнес-логіка в хуках і контекстах
   - UI-логіка в компонентах

3. **Оптимізуйте продуктивність:**

   - Використовуйте мемоізацію для уникнення зайвих перерендерингів
   - Лінива загрузка для важких компонентів

4. **Приділяйте увагу UX:**

   - Показуйте стани завантаження
   - Обробляйте помилки
   - Валідуйте дані на стороні клієнта

5. **Тестуйте компоненти:**
   - Пишіть юніт-тести для хуків
   - Тестуйте компоненти з React Testing Library

## Рекомендовані бібліотеки

### Бекенд

- `spring-boot-starter-web`
- `spring-boot-starter-data-jpa`
- `spring-boot-starter-security`
- `spring-boot-starter-validation`
- `jjwt` або `java-jwt` для JWT
- `mapstruct` для маппінгу
- `lombok` для зменшення шаблонного коду
- `springdoc-openapi` для документації API

### Фронтенд

- `@mui/material` та `@mui/icons-material`
- `@emotion/react` та `@emotion/styled`
- `@tanstack/react-query`
- `axios`
- `react-hook-form` та `zod`
- `dayjs`
- `zustand`
- `next-intl`
- `vitest` та `@testing-library/react`

## Додаткові правила для Cursor IDE

### Правила роботи з Material UI v7

1. **Правила використання Grid у MUI v7:**

   - У MUI v7 компонент `Grid` було повністю переписано і тепер він використовує CSS Grid замість Flexbox
   - Використовуйте `Grid` з атрибутом `container` для створення контейнера сітки
   - Дочірні елементи представлені як прості `Grid` компоненти без атрибуту `item`
   - Для задання розмірів використовуйте атрибут `size` замість старих `xs`, `sm`, `md`, `lg`, `xl`
   - Розміри можуть бути вказані як для одного брейкпоінта `size={8}`, так і для декількох `size={{ xs: 12, md: 6 }}`
   - **Важливо**: Ніколи не використовуйте `xs`, `sm`, `md`, `lg` або `xl` атрибути, оскільки вони відсутні в MUI v7 і це викличе помилки TypeScript
   - **Важливо**: Ніколи не використовуйте атрибут `item` для дочірніх елементів Grid, цей атрибут видалено в MUI v7
   - У разі помилки типу `No overload matches this call`, перевірте чи використовуєте ви `size` замість `xs` та чи не вказуєте `item`
   - Приклад правильного використання:
     ```tsx
     <Grid container spacing={2}>
       <Grid size={8}>
         <Box>Вміст 1</Box>
       </Grid>
       <Grid size={4}>
         <Box>Вміст 2</Box>
       </Grid>
     </Grid>
     ```
   - Приклад з респонсивними значеннями:
     ```tsx
     <Grid container spacing={2}>
       <Grid size={{ xs: 12, sm: 6, md: 4 }}>
         <Box>Вміст 1</Box>
       </Grid>
       <Grid size={{ xs: 12, sm: 6, md: 8 }}>
         <Box>Вміст 2</Box>
       </Grid>
     </Grid>
     ```
   - Погано (викличе помилки):
     ```tsx
     // Неправильно - не використовуйте такий код!
     <Grid container spacing={2}>
       <Grid item xs={12} md={6}>
         {' '}
         // Помилка: атрибути item та xs/md не підтримуються
         <Box>Вміст</Box>
       </Grid>
     </Grid>
     ```

2. **Server Components та Client Components:**

   - Завжди додавайте директиву `'use client'` на початку файлу для Client Components
   - Компоненти з хуками (useState, useEffect, useContext) завжди повинні бути Client Components
   - Material UI компоненти з інтерактивністю (Button, TextField, etc.) також мають бути в Client Components
   - Типовий розподіл відповідальності:

     ```tsx
     // app/orders/page.tsx (Server Component)
     import OrdersList from '@/features/orders/components/OrdersList';

     export default async function OrdersPage() {
       // Дані завантажуються на сервері
       const orders = await fetchOrders();

       // Передаємо дані до клієнтського компонента
       return <OrdersList initialOrders={orders} />;
     }

     // features/orders/components/OrdersList.tsx (Client Component)
     'use client';

     import { useState } from 'react';

     export default function OrdersList({ initialOrders }) {
       // Клієнтська інтерактивність
       const [filteredOrders, setFilteredOrders] = useState(initialOrders);

       return (/* ... */);
     }
     ```

### Правила для роботи з шрифтами

1. **Використання шрифту Geist:**

   - При імпорті шрифту Geist вказуйте `subsets: ['latin']`, а не `subsets: ['cyrillic']`
   - Для кириличних символів використовуйте локальні версії шрифтів або інші шрифти з підтримкою кирилиці
   - Приклад правильного імпорту в `lib/theme.ts`:

     ```typescript
     import { Geist } from 'next/font/google';

     const geistSans = Geist({
       weight: ['400', '500', '600', '700'],
       subsets: ['latin'],
       display: 'swap',
       fallback: ['sans-serif'],
     });
     ```

### Правила для роботи з формами

1. **React Hook Form та Zod:**

   - Завжди використовуйте `zodResolver` для валідації форм з React Hook Form
   - Створюйте схеми валідації окремо для кращої читабельності
   - Використовуйте Controller для прив'язки полів Material UI
   - Приклад правильної інтеграції:

     ```tsx
     import { useForm, Controller } from 'react-hook-form';
     import { zodResolver } from '@hookform/resolvers/zod';
     import { z } from 'zod';

     // Окрема схема валідації
     const loginSchema = z.object({
       email: z.string().email('Введіть коректний email'),
       password: z.string().min(6, 'Пароль має містити мінімум 6 символів'),
     });

     type LoginFormData = z.infer<typeof loginSchema>;

     // Використання React Hook Form з Zod
     const {
       control,
       handleSubmit,
       formState: { errors },
     } = useForm<LoginFormData>({
       resolver: zodResolver(loginSchema),
       defaultValues: {
         email: '',
         password: '',
       },
     });

     // Controller для TextField компонента
     <Controller
       name="email"
       control={control}
       render={({ field }) => (
         <TextField
           {...field}
           label="Email"
           error={!!errors.email}
           helperText={errors.email?.message}
         />
       )}
     />;
     ```

### Правила для роботи з даними

1. **Axios та React Query:**

   - Налаштовуйте базовий URL та інтерцептори для Axios в файлі `lib/axios.ts`
   - Централізуйте API-запити в папці `features/*/api/`
   - Використовуйте хуки React Query для кешування, оновлення та керування станом запитів
   - Приклад правильної організації:

     ```tsx
     // lib/axios.ts
     import axios from 'axios';

     const instance = axios.create({
       baseURL: process.env.NEXT_PUBLIC_API_URL,
     });

     instance.interceptors.request.use(/* ... */);
     instance.interceptors.response.use(/* ... */);

     export default instance;

     // features/clients/api/clientsApi.ts
     import axios from '@/lib/axios';

     export const getClients = async () => {
       const { data } = await axios.get('/api/v1/clients');
       return data;
     };

     // features/clients/hooks/useClients.ts
     import { useQuery } from '@tanstack/react-query';
     import { getClients } from '../api/clientsApi';

     export const useClients = () => {
       return useQuery({
         queryKey: ['clients'],
         queryFn: getClients,
       });
     };
     ```

## Правила синхронізації моделей з базою даних

### Процес додавання нової сутності

При створенні нових доменних об'єктів необхідно дотримуватись наступного порядку дій для забезпечення правильної синхронізації з базою даних:

1. **Створення Entity класу** в пакеті відповідного домену (`com.aksi.domain.*.entity`)

   - Додати відповідні JPA анотації (`@Entity`, `@Table`, `@Column` тощо)
   - Налаштувати зв'язки з іншими сутностями (OneToMany, ManyToOne та ін.)
   - Вказати анотації для валідації

2. **Створення Repository інтерфейсу** для сутності

   - Розмістити в тому ж пакеті домену, що й Entity
   - Наслідуватись від JpaRepository або CrudRepository

3. **Створення міграції бази даних** за допомогою Liquibase

   - Додати новий changeSet в існуючий файл `db.changelog-X.Y.yaml` або створити новий
   - Обов'язково включити новий файл міграції в `db.changelog-master.yaml` (якщо створюється новий)
   - Переконатись, що типи даних та обмеження в міграції відповідають анотаціям в Entity класі

4. **Створення DTO класів** для передачі даних між шарами

   - Визначити класи запитів (Request) та відповідей (Response)
   - Додати анотації валідації

5. **Створення Mapper інтерфейсу** для конвертації між Entity та DTO
   - Використовувати MapStruct для генерації реалізації

### Приклад процесу

```java
// 1. Entity
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    // інші поля
}

// 2. Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    // додаткові методи пошуку
}
```

### Важливі зауваження

- **Завжди синхронізуйте міграції** з Entity класами - усі обов'язкові поля в Entity повинні бути обов'язковими в міграції
- **Не змінюйте існуючі міграції**, які вже застосовані в продуктивному середовищі - створюйте нові для модифікації схеми
- **Перевіряйте міграції** на локальному оточенні перед відправкою коду в репозиторій
- **Дотримуйтесь naming conventions** для таблиць (snake_case) та Java класів (PascalCase)
- **Тестуйте міграції** при додаванні нових обмежень, щоб уникнути помилок з існуючими даними

Ці правила допоможуть Cursor IDE краще розуміти вашу кодову базу та пропонувати точніші пропозиції при розробці проекту "Хімчистка AKSI".
