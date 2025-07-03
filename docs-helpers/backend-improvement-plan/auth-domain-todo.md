# Auth Domain Improvement Plan

## 🎯 Мета

Покращити Auth домен згідно з чекліст-планом, забезпечивши консистентність, валідацію та код-стиль.

---

## 🚨 **КРИТИЧНА ПРОБЛЕМА: NULL ВАЛІДАЦІЯ В OPENAPI**

### 📊 **Аналіз поточного стану**

**ПРОБЛЕМА:** При генерації TypeScript типів з OpenAPI майже всі поля стають optional (`поле?`), що призводить до некерованих null/undefined значень у фронтенді.

**КОРІНЬ ПРОБЛЕМИ:**

1. **Відсутність nullable: false** у більшості схем
2. **Відсутність required полів** у багатьох response схемах
3. **Неправильна валідація** для обов'язкових полів
4. **Inconsistent validation** між доменами

**КОНКРЕТНІ ПРИКЛАДИ:**

```typescript
// НЕПРАВИЛЬНО (поточний стан):
export interface UserResponse {
  id?: string; // Optional, хоча це primary key!
  username?: string; // Optional, хоча required
  email?: string; // Optional, хоча required
}

// ПРАВИЛЬНО (після виправлення):
export interface UserResponse {
  id: string; // Required, non-nullable
  username: string; // Required, non-nullable
  email: string; // Required, non-nullable
}
```

**МАСШТАБ ПРОБЛЕМИ:**

- ✅ Auth домен: частково правильний (має required + nullable: false)
- ❌ Client домен: має required, але НЕ має nullable: false
- ❌ Branch домен: правильний nullable: false, але не всі схеми
- ❌ Item домен: потребує аудиту
- ❌ Order домен: потребує аудиту
- ❌ Document домен: потребує аудиту
- ❌ Pagination схеми: має required, але НЕ має nullable: false
- ❌ Search схеми: часто НЕ має required взагалі

---

## 📋 TODO План (ОНОВЛЕНИЙ З КРИТИЧНИМ ПРІОРИТЕТОМ)

### 🔥 **ЕТАП 0: КРИТИЧНА NULL ВАЛІДАЦІЯ (НАЙВИЩИЙ ПРІОРИТЕТ)**

#### 0.1 Системний аудит OpenAPI схем

- [x] **Проведено початковий аналіз проблеми**

  - ✅ Ідентифіковано що auth-responses.yaml правильний (має required + nullable: false)
  - ✅ Виявлено що client/branch/інші домени НЕ мають nullable: false
  - ✅ Знайдено що pagination/search схеми часто НЕ мають required полів
  - ✅ Підтверджено що Orval генерує optional поля через відсутність proper validation

- [ ] **Детальний аудит всіх доменів**
  - [ ] Item домен schemas аудит
  - [ ] Order домен schemas аудит
  - [ ] Document домен schemas аудит
  - [ ] Common schemas аудит (pagination, errors, base)

#### 0.2 Виправлення базових схем

- [ ] **Common schemas (base.yaml)**

  - [ ] Додати nullable: false до UUID, Timestamp, Date, Email, PhoneNumber
  - [ ] Додати nullable: false до Money, Percentage, PositiveInteger
  - [ ] Перевірити всі базові типи

- [ ] **Common schemas (pagination.yaml)**

  - [ ] Додати nullable: false до всіх полів PageableInfo
  - [ ] Додати nullable: false до SortInfo полів

- [ ] **Common schemas (errors.yaml)**
  - [ ] Перевірити ErrorResponse та ValidationErrorResponse
  - [ ] Додати nullable: false де потрібно

#### 0.3 Виправлення Response схем

- [ ] **Client Response схеми**

  - [ ] ClientResponse: додати nullable: false до required полів
  - [ ] ClientPageResponse: додати required поля + nullable: false
  - [ ] ClientSearchResponse: додати required поля + nullable: false
  - [ ] ClientContactsResponse: виправити validation

- [ ] **Branch Response схеми**

  - [ ] Перевірити BranchResponse completeness
  - [ ] Виправити pagination responses

- [ ] **Item Response схеми**

  - [ ] Повний аудит та виправлення
  - [ ] PriceListItemResponse validation

- [ ] **Order Response схеми**

  - [ ] Повний аудит та виправлення
  - [ ] OrderCalculationResponse validation

- [ ] **Document Response схеми**
  - [ ] Повний аудит та виправлення
  - [ ] ReceiptResponse validation

#### 0.4 Виправлення Request схем

- [ ] **Update Request схеми**

  - [ ] Всі UpdateXxxRequest мають НЕ мати required (оскільки це partial update)
  - [ ] Але мають мати nullable: false для полів що передаються

- [ ] **Create Request схеми**

  - [ ] Перевірити всі required поля в Create requests
  - [ ] Додати nullable: false для обов'язкових полів

- [ ] **Search Request схеми**
  - [ ] Додати хоча б один required параметр або logic validation
  - [ ] Перевірити pagination parameters

#### 0.5 Тестування та валідація

- [ ] **Регенерація API**

  - [ ] Перегенерувати frontend API після виправлень
  - [ ] Перевірити що TypeScript типи стали non-optional

- [ ] **Backend синхронізація**

  - [ ] Перевірити що Entity validation відповідає OpenAPI
  - [ ] Оновити Bean Validation annotations якщо потрібно

- [ ] **Тестування**
  - [ ] Написати тести для перевірки null value rejection
  - [ ] API integration tests для validation

---

### 🔧 **ЕТАП 1: Структурні зміни та ID консистенція**

_Прості зміни без складної логіки_

#### 1.1 Консистенція Entity ID

- [ ] **Аудит поточної структури ID**

  - Перевірити UserEntity та RefreshTokenEntity на наявність двох ID (id + uuid)
  - Документувати поточний стан полів ідентифікаторів

- [ ] **Оновити BaseEntity**

  - Змінити BaseEntity для використання UUID як primary key
  - Переконатися що поле називається `id` (не `uuid`)
  - Оновити всі Entity що наслідують BaseEntity

- [ ] **Прибрати дублювання ID**
  - Видалити додаткові поля id/uuid в Auth entities
  - Залишити тільки одне поле `id` типу UUID
  - Оновити всі маппінги та залежності

#### 1.2 UUID Generator

- [ ] **Аудит UUID генерації**
  - Перевірити чи використовується кастомний UUID генератор
  - Видалити непотрібні UUID генератори якщо є стандартний
  - Використовувати стандартний JPA підхід з @GeneratedValue

---

### 🔍 **ЕТАП 2: Валідація та констрейнти**

_Покращення валідації на всіх рівнях_

#### 2.1 Database Constraints

- [x] **Унікальні констрейнти в БД**
  - ✅ Перевірено users таблицю на унікальність email
  - ✅ Перевірено users таблицю на унікальність username
  - ✅ Всі UNIQUE constraints правильно налаштовані в Liquibase міграції
  - ✅ Перевірено refresh_tokens таблицю на унікальність token

#### 2.2 Cleanup невикористовуваних методів (ПРІОРИТЕТ)

- [ ] **Аудит MapStruct мапперів**

  - [x] Перевірено AuthMapper на невикористовувані методи (підсвічені IDE)
  - [x] Ідентифіковано методи що залишились після винесення логіки в Specifications
  - [x] Документовано які методи реально використовуються

- [ ] **Прибрати unused code з AuthMapper**
  - [ ] Видалити createUserFromLoginRequest() - не використовується
  - [ ] Видалити offsetDateTimeToLocalDateTime() - дублюється з BaseMapperConfig
  - [ ] Видалити fromApiUserRole() - не використовується
  - [ ] Видалити apiRolesToDomainRoles() - не використовується

#### 2.3 OpenAPI Schema Validation (**ПЕРЕНЕСЕНО В ЕТАП 0**)

- [x] **Перенесено в ЕТАП 0 як критичний пріоритет**

---

### 🛠️ **ЕТАП 3: Логіка та утиліти**

_Винесення бізнес-логіки з Entity_

#### 3.1 Entity Cleanup

- [ ] **Аудит бізнес-логіки в Entity**

  - Перевірити UserEntity на наявність складних business методів
  - Перевірити RefreshTokenEntity на наявність validation логіки
  - Ідентифікувати що потрібно винести в утиліти

- [ ] **Створити Auth утиліти**
  - Винести password validation в AuthValidationUtils
  - Винести token generation логіку в TokenUtils
  - Винести account locking логіку в AccountLockingUtils
  - Оновити Entity щоб використовувати утиліти

#### 3.2 Числові поля та округлення

- [ ] **Перевірити числові поля**
  - Знайти всі числові поля в Auth домені (якщо є)
  - Налаштувати форматування %.2f для грошових сум
  - Перевірити timestamp форматування

---

### 🔄 **ЕТАП 4: Репозиторії та специфікації**

_Оптимізація запитів та методів_

#### 4.1 Repository Specifications

- [ ] **Аудит поточних репозиторіїв**

  - Перевірити UserRepository на великі методи з багатьма параметрами
  - Перевірити RefreshTokenRepository на складні запити
  - Ідентифікувати які методи реально потребують Specification
  - Знайти надмірне використання Specifications (багато методів не працює)

- [ ] **Оптимізувати великі методи**
  - Розбити складні @Query методи на Specifications (тільки де багато динамічних фільтрів)
  - Залишити прості методи без змін (малі методи не чіпати)
  - Прибрати невикористовувані Specification методи (підсвічені IDE)
  - Перевірити що всі динамічні фільтри працюють після cleanup

#### 4.2 Консистенція валідації

- [ ] **Узгодити валідацію**
  - Перевірити що Entity validation співпадає з OpenAPI
  - Перевірити що Service validation співпадає з OpenAPI
  - Перевірити що Repository constraints співпадають з OpenAPI
  - Усунути дублювання валідації

---

### ⚠️ **ЕТАП 5: Exception Handling та Warnings**

_Покращення обробки помилок_

#### 5.1 Return Warnings

- [ ] **Аудит warning scenarios**

  - Ідентифікувати де потрібні warning замість exception
  - Перевірити account locking scenarios
  - Перевірити token expiration scenarios

- [ ] **Імплементувати warnings**
  - Оновити Service методи для повернення warnings
  - Оновити Response DTO для включення warnings
  - Оновити OpenAPI схеми для warning полів

#### 5.2 Exception Handler

- [ ] **Переписати Exception Handler**
  - Перевірити поточний ExceptionHandler на покриття Auth exceptions
  - Додати спеціальну обробку для Auth-specific exceptions
  - Перевірити що всі Auth exceptions мають правильні HTTP статуси
  - Додати логування для security events

---

### 🧪 **ЕТАП 6: Тестування та фінальна валідація**

_Groovy Spock тести + OpenAPI validation_

#### 6.1 Unit Tests

- [ ] **Service Layer Tests**
  - Написати тести для AuthService
  - Написати тести для JwtTokenService
  - Написати тести для UserValidator
  - Покрити всі business scenarios

#### 6.2 Integration Tests

- [ ] **Repository Tests**
  - Написати тести для UserRepository
  - Написати тести для RefreshTokenRepository
  - Протестувати всі custom queries та specifications

#### 6.3 Controller Tests

- [ ] **API Layer Tests**
  - Написати тести для AuthenticationApiController
  - Написати тести для AuthorizationApiController
  - Протестувати всі endpoints з різними scenarios

#### 6.4 OpenAPI Schema Validation (ФІНАЛЬНИЙ ЕТАП)

- [ ] **Системне вирішення nullable полів**
  - Детальний аналіз всіх nullable полів в Auth домені
  - Покращення валідації схем (email format, pattern, minLength/maxLength)
  - Усунення nullable де не потрібно (комплексний підхід)
  - Додати pattern для password (мінімальні вимоги безпеки)
  - Синхронізація OpenAPI схем з фактичними потребами

#### 6.5 Edge Cases

- [ ] **Security Tests**
  - Протестувати account locking mechanism
  - Протестувати token expiration scenarios
  - Протестувати invalid credentials scenarios
  - Протестувати concurrent access scenarios

---

## 📊 Пріоритети виконання (ОНОВЛЕНО)

### 🔥 **КРИТИЧНИЙ ПРІОРИТЕТ (ЗАРАЗ)**

- OpenAPI Schema Validation (ЕТАП 0)
- NULL values handling в TypeScript
- Frontend API regeneration

### 🟢 **Високий пріоритет (ПІСЛЯ ЕТАП 0)**

- Cleanup невикористовуваних методів в AuthMapper
- Entity ID консистенція
- Database constraints

### 🟡 **Середній пріоритет**

- Винесення логіки з Entity
- Repository specifications
- Exception handling

### 🔴 **Низький пріоритет (КІНЕЦЬ)**

- Return warnings
- Groovy Spock тести

---

## 🎯 Очікувані результати

### ✅ **Після ЕТАП 0 (NULL Validation):**

- TypeScript типи без optional полів для required даних
- Proper null validation на всіх рівнях
- Консистентні OpenAPI схеми
- Відсутність null pointer exceptions у фронтенді
- Правильна валідація API requests/responses

### ✅ **Після завершення всього плану:**

- Консистентна структура Entity з UUID
- Повна валідація на всіх рівнях
- Чистий код без бізнес-логіки в Entity
- Оптимізовані репозиторії
- Покриття тестами 80%+
- Правильна обробка помилок та warnings

### 📈 **Метрики якості:**

- **Frontend TypeScript:** 0 optional fields для required data
- **API Validation:** 100% proper null rejection
- Checkstyle: 0 violations
- SonarQube: A rating
- Test coverage: 80%+
- Database constraints: 100% covered
- OpenAPI validation: 100% covered
