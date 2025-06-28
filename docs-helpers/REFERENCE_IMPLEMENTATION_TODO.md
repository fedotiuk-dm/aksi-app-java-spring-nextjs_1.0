# Client Domain - TODO Implementation

## Функціональні вимоги (з OrderWizard)

- **quickSearch** - автозаповнення за ім'ям, прізвищем, телефоном, email
- **createClient** - створення нового клієнта через міні-форму
- **updateClient** - редагування обраного клієнта
- **deleteClient** - soft delete клієнта

## Структура файлів і відповідальності

### 1. enums/ (domain types)

**Файли:** `CommunicationMethodType.java`, `ClientSourceType.java`
**Відповідальність:** Domain enum'и без залежностей
**Імпорти:** НІЯКИХ - pure enum'и
**Правило:** Ніхто не імпортує enum'и, тільки використовує їх

### 2. entity/ (domain model)

**Файли:** `ClientEntity.java`
**Відповідальність:** JPA Entity + business methods
**Імпорти:**

- `enums.*` - для enum полів
- JPA annotations
- BaseEntity (якщо є)
  **Правило:** Тільки entity знає про domain enum'и

### 3. repository/ (data access)

**Файли:** `ClientRepository.java`
**Відповідальність:** Spring Data JPA query methods
**Імпорти:**

- `entity.ClientEntity` - для типізації
- `enums.*` - для параметрів query методів
- Spring Data JPA
  **Правило:** Repository працює тільки з Entity

### 4. validation/ (business rules)

**Файли:** `ClientValidator.java`
**Відповідальність:** Валідація бізнес-правил + domain exceptions
**Імпорти:**

- `entity.ClientEntity` - для валідації
- `repository.ClientRepository` - для перевірки унікальності
  **Правило:** Validator інкапсулює всі правила валідації

### 5. service/ (business logic)

**Файли:** `ClientService.java`
**Відповідальність:** Pure business logic ТІЛЬКИ
**Імпорти:**

- `entity.ClientEntity` - для роботи з domain model
- `repository.ClientRepository` - для data access
- `validation.ClientValidator` - для валідації
  **Правило:** Service НЕ знає про DTO/API, тільки Entity

### 6. mapper/ (DTO ↔ Entity)

**Файли:** `ClientMapper.java`
**Відповідальність:** Конверсія між DTO та Entity доменами
**Імпорти:**

- `entity.ClientEntity` - domain model
- API generated DTO classes
- MapStruct annotations
  **Правило:** Mapper - єдине місце знань про обидва домени

### 7. delegate/ (API coordination)

**Файли:** `ClientApiDelegate.java`
**Відповідальність:** Координація API викликів ТІЛЬКИ
**Імпорти:**

- `service.ClientService` - для business logic
- `mapper.ClientMapper` - для конверсій
- API generated interfaces
- Spring Web annotations
  **Правило:** Delegate = mapper + service, БЕЗ власної логіки

## Правила імпортів (контроль залежностей)

### ✅ ДОЗВОЛЕНІ ІМПОРТИ

```
enums/           → НІЯКИХ
entity/          → enums/
repository/      → entity/ + enums/
validation/      → entity/ + repository/
service/         → entity/ + repository/ + validation/
mapper/          → entity/ + API DTO
delegate/        → service/ + mapper/ + API interfaces
```

### ❌ ЗАБОРОНЕНІ ІМПОРТИ

```
enums/           → будь-що (pure enum'и)
entity/          → repository/, service/, mapper/, delegate/
repository/      → validation/, service/, mapper/, delegate/
validation/      → service/, mapper/, delegate/
service/         → mapper/, delegate/, API classes
mapper/          → validation/, другі mapper'и
delegate/        → інші delegate'и, repository/, validation/
```

## TODO Checklist

### Крок 1: Створити enum'и

- [ ] `CommunicationMethodType` - PHONE, SMS, VIBER
- [ ] `ClientSourceType` - INSTAGRAM, GOOGLE, RECOMMENDATIONS, OTHER
- [ ] Перевірити: БЕЗ імпортів, тільки enum значення

### Крок 2: Створити Entity

- [ ] `ClientEntity` з полями: firstName, lastName, phone, email, address
- [ ] Enum поля: sourceType, communicationMethods (Set)
- [ ] Business methods: getFullName(), deactivate()
- [ ] Перевірити імпорти: тільки enums/ + JPA

### Крок 3: Створити Repository

- [ ] `ClientRepository extends JpaRepository`
- [ ] Методи: findByUuidAndIsActiveTrue(), quickSearch()
- [ ] Перевірити імпорти: тільки entity/ + enums/ + Spring Data

### Крок 4: Створити Validator

- [ ] `ClientValidator` з методами validateNewClient(), validateExistingClient()
- [ ] Інкапсулювати ВСІ правила валідації
- [ ] Перевірити імпорти: тільки entity/ + repository/

### Крок 5: Створити Service

- [ ] `ClientService` з методами: quickSearch(), createClient(), findByUuid(), updateClient(), deleteClient()
- [ ] БЕЗ валідації (делегувати в Validator)
- [ ] БЕЗ mapping (працювати тільки з Entity)
- [ ] Перевірити імпорти: entity/ + repository/ + validation/

### Крок 6: Створити Mapper

- [ ] `ClientMapper` з методами: toEntity(), toDto(), toDtoList()
- [ ] MapStruct з правильними маппінгами
- [ ] Перевірити імпорти: entity/ + API DTO

### Крок 7: Створити Delegate

- [ ] `ClientApiDelegate` з endpoint'ами для OrderWizard
- [ ] Workflow: DTO → Mapper → Entity → Service → Entity → Mapper → DTO
- [ ] БЕЗ бізнес логіки, тільки координація
- [ ] Перевірити імпорти: service/ + mapper/ + API interfaces

### Крок 8: Перевірити архітектуру

- [ ] Кожен файл < 200 рядків
- [ ] Немає дублювання логіки
- [ ] Правильні імпорти згідно правил
- [ ] Functional approach (Optional + map/filter)
- [ ] БЕЗ логування в business logic

## Контроль якості

### Перевірка відсутності дублювання

- [ ] Валідація тільки в `ClientValidator`
- [ ] Mapping тільки в `ClientMapper`
- [ ] Business logic тільки в `ClientService`
- [ ] API координація тільки в `ClientApiDelegate`

### Перевірка імпортів

- [ ] Repository НЕ імпортує Service
- [ ] Service НЕ імпортує Mapper або API класи
- [ ] Entity НЕ імпортує Repository
- [ ] Validator НЕ імпортує Service

### Перевірка Single Responsibility

- [ ] Кожен файл має одну чітку відповідальність
- [ ] Немає "god objects" з багатьма обов'язками
- [ ] Легко тестувати кожен компонент окремо

## Готовність для фронтенду

### API endpoints (мінімальний набір)

- [ ] `GET /api/clients/search?query=...&limit=10` - quickSearch
- [ ] `POST /api/clients` - createClient
- [ ] `GET /api/clients/{id}` - getClient
- [ ] `PUT /api/clients/{id}` - updateClient
- [ ] `DELETE /api/clients/{id}` - deleteClient

### Валідація та error handling

- [ ] 409 Conflict для validation errors
- [ ] 404 Not Found для неіснуючих clients
- [ ] 400 Bad Request для некоректних даних

Результат: 8 файлів ~600 рядків, готовий для OrderWizard фронтенду
