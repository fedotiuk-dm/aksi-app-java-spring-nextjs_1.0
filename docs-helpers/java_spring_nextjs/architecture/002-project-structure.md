# Структура проекту та технічний стек Aksi-app

## Технічний стек

### Обов'язкові технології

- **Java 21** - використання сучасних можливостей мови
- **Spring Boot 3.4.4** - основний фреймворк
- **Spring Data JPA** - доступ до даних
- **Hibernate** - ORM для роботи з БД
- **Liquibase** - міграції бази даних 
- **PostgreSQL 17.4** - СУБД
- **Maven/Gradle** - управління залежностями та збірка
- **OpenAPI Generator** - генерація DTO та контролерів з OpenAPI специфікацій
- **MapStruct** - маппінг між DTO та доменними об'єктами
- **JUnit 5** - тестування
- **Swagger UI** - документація API
- **Docker/Docker Compose** - контейнеризація

### Додаткові бібліотеки

- **Lombok** - скорочення шаблонного коду
- **Spring Security** - автентифікація та авторизація
- **Spring Validation** - валідація
- **Mockito** - мокування у тестах
- **AssertJ** - розширені асерти для тестів

## Структура проекту

Проект будується за принципами гексагональної архітектури (ports and adapters) в контексті DDD:

```
com.aksi
├── api                 # Контролери та DTO (автоматично генеровані з OpenAPI)
│   ├── client
│   ├── order
│   ├── pricing
│   ├── itemCatalog
│   ├── document
│   └── branch
├── domain              # Доменні моделі та бізнес-логіка
│   ├── client
│   ├── order
│   ├── pricing
│   ├── itemCatalog
│   ├── document
│   └── branch
├── application         # Сервіси додатку
│   ├── client
│   ├── order
│   ├── pricing
│   ├── itemCatalog
│   ├── document
│   └── branch
├── infrastructure      # Інфраструктурний код
│   ├── persistence     # Репозиторії та JPA моделі
│   ├── external        # Зовнішні сервіси
│   ├── security        # Налаштування безпеки
│   └── config          # Загальні конфігурації
└── util                # Утиліти
```

## Детальний опис структури

### Рівень API та DTO (Presentation Layer)

```
com.aksi.api
├── common              # Загальні класи для API (відповіді, обробка помилок)
│   ├── ApiResponse.java
│   ├── ErrorResponse.java
│   └── GlobalExceptionHandler.java
├── client              # Клієнтський API
│   ├── dto             # DTO (генеровані з OpenAPI)
│   └── ClientController.java
├── order               # API замовлень
│   ├── dto
│   └── OrderController.java
└── ...                 # Інші домени
```

### Доменний рівень (Domain Layer)

```
com.aksi.domain
├── common              # Спільні інтерфейси та базові класи
│   ├── Entity.java
│   └── ValueObject.java
├── client              # Доменна модель клієнтів
│   ├── Client.java
│   ├── ClientId.java
│   ├── ContactMethod.java
│   └── ClientSource.java
├── order               # Доменна модель замовлень
│   ├── Order.java
│   ├── OrderId.java
│   ├── OrderStatus.java
│   └── ...
└── ...                 # Інші домени
```

### Рівень додатку (Application Layer)

```
com.aksi.application
├── common              # Спільні інтерфейси та сервіси
│   ├── ApplicationService.java
│   └── TransactionalService.java
├── client              # Сервіси для клієнтів
│   ├── ClientService.java
│   ├── ClientSearchService.java
│   └── port            # Порти для взаємодії з інфраструктурою
│       ├── ClientRepository.java
│       └── ...
├── order               # Сервіси для замовлень
│   ├── OrderService.java
│   ├── OrderProcessingService.java
│   └── ...
└── ...                 # Інші домени
```

### Інфраструктурний рівень (Infrastructure Layer)

```
com.aksi.infrastructure
├── persistence         # Реалізація доступу до даних
│   ├── common
│   │   ├── BaseJpaRepository.java
│   │   └── JpaEntity.java
│   ├── client
│   │   ├── ClientJpaEntity.java
│   │   ├── ClientJpaRepository.java
│   │   └── ClientRepositoryImpl.java
│   └── ...            # Інші домени
├── external           # Інтеграції з зовнішніми сервісами
│   ├── email
│   └── notification
├── security           # Налаштування безпеки
│   ├── WebSecurityConfig.java
│   └── ...
└── config             # Загальні конфігурації
    ├── PersistenceConfig.java
    ├── SwaggerConfig.java
    └── ...
```

## Конфігурація та властивості

### Структура application.yml

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/aksi
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
  liquibase:
    change-log: classpath:db/changelog/db.changelog-master.xml

server:
  port: 8080
  servlet:
    context-path: /api

logging:
  level:
    com.aksi: INFO
    org.springframework: WARN
    org.hibernate: WARN
```

## Генерація коду на основі OpenAPI

### Процес генерації DTO і контролерів

1. Розміщення OpenAPI специфікацій у `src/main/resources/openapi`
2. Налаштування OpenAPI Generator Maven/Gradle плагіну
3. Автоматична генерація DTO та інтерфейсів контролерів
4. Реалізація інтерфейсів контролерів для взаємодії з сервісами додатку

### Приклад конфігурації Maven плагіну

```xml
<plugin>
    <groupId>org.openapitools</groupId>
    <artifactId>openapi-generator-maven-plugin</artifactId>
    <version>${openapi.generator.version}</version>
    <executions>
        <execution>
            <goals>
                <goal>generate</goal>
            </goals>
            <configuration>
                <inputSpec>${project.basedir}/src/main/resources/openapi/api.yaml</inputSpec>
                <generatorName>spring</generatorName>
                <configOptions>
                    <interfaceOnly>true</interfaceOnly>
                    <apiPackage>com.aksi.api</apiPackage>
                    <modelPackage>com.aksi.api.dto</modelPackage>
                    <sourceFolder>src/gen/java</sourceFolder>
                </configOptions>
            </configuration>
        </execution>
    </executions>
</plugin>
```

## База даних

### Схема даних

База даних буде детально описана в окремому документі, включаючи:
- ER-діаграму з усіма таблицями та зв'язками
- Опис полів та індексів
- Обмеження та тригери

### Міграції

Будуть використовуватись Liquibase міграції для версіонування бази даних:
- Базова структура в changelog master
- Окремі файли міграцій для кожного домену
- Початкові дані для заповнення довідників

## Тестування

### Структура тестів

```
src/test/java/com/aksi
├── api                 # Тести контролерів
│   ├── client
│   └── ...
├── application         # Тести сервісів
│   ├── client
│   └── ...
├── domain              # Тести доменних моделей
│   ├── client
│   └── ...
└── infrastructure      # Тести інфраструктури
    ├── persistence
    └── ...
```

### Підходи до тестування

1. **Unit tests** - для доменної логіки та сервісів
2. **Integration tests** - для репозиторіїв та зовнішніх інтеграцій
3. **API tests** - для REST API
4. **Database tests** - для перевірки міграцій

## Docker та розгортання

### Структура Docker-контейнерів

- **aksi-backend** - Spring Boot додаток
- **aksi-db** - PostgreSQL база даних
- **aksi-frontend** - Next.js фронтенд (у майбутньому)

### Docker Compose

Буде налаштовано Docker Compose для локальної розробки та тестування:
- Автоматичне створення бази даних
- Ініціалізація початкових даних
- Мережа для комунікації між контейнерами

## Безпека

### Аутентифікація та авторизація

- Використання JWT токенів для автентифікації
- Ролі та права доступу для різних доменів
- Безпечне зберігання облікових даних

## Висновки

Запропонована структура проекту:
- Відповідає принципам DDD та гексагональної архітектури
- Забезпечує чітке розділення відповідальності
- Спрощує тестування та підтримку
- Дозволяє легко масштабуватися
- Відповідає вимогам до розробки на базі OpenAPI специфікацій
