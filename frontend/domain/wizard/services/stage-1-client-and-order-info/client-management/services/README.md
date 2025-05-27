# Сервіси управління клієнтами

Цей модуль містить усі сервіси для роботи з клієнтами в рамках першого етапу Order Wizard.

## Архітектура

Сервіси організовані за принципом Single Responsibility та працюють виключно через адаптери для взаємодії з API.

## Структура сервісів

### 🔍 Основні сервіси CRUD операцій

- **`client-search.service.ts`** - Пошук клієнтів
- **`client-create.service.ts`** - Створення нових клієнтів
- **`client-update.service.ts`** - Оновлення існуючих клієнтів

### 🛡️ Сервіси валідації

- **`validation/`** - Папка з усіма сервісами валідації
  - `client-validation.service.ts` - Основна валідація даних
  - `format-validation.service.ts` - Валідація форматів
  - `business-validation.service.ts` - Бізнес-правила

### 🔧 Спеціалізовані сервіси

- **`contact-methods.service.ts`** - Управління способами зв'язку

  - Валідація способів зв'язку
  - Трансформація для API
  - Рекомендації на основі даних

- **`information-source.service.ts`** - Управління джерелами інформації

  - Валідація джерел із деталями
  - Трансформація для API
  - Статистика для аналітики

- **`client-uniqueness-check.service.ts`** - Перевірка унікальності

  - Перевірка унікальності телефону
  - Перевірка унікальності email
  - Комплексна перевірка з деталізацією

- **`client-transformation.service.ts`** - Трансформація даних
  - Конвертація між API і доменними типами
  - Форматування телефонів
  - Створення повних імен

### 🎯 Головний сервіс

- **`client-management.service.ts`** - Комплексний сервіс
  - Об'єднує всю функціональність
  - Реалізує інтерфейс `IClientManagementService`
  - Експортується як singleton

## Принципи роботи

### 1. Робота через адаптери

Всі сервіси взаємодіють з API виключно через адаптери з папки `adapters/client/`.

### 2. Інкапсуляція відповідальностей

- Кожен сервіс має одну чітку відповідальність
- Складна логіка розбита на простіші компоненти
- Всі сервіси мають консистентний інтерфейс

### 3. Типобезпека

- Всі операції строго типізовані
- Використання `OperationResult<T>` для уніфікованої обробки помилок
- Валідація даних на рівні TypeScript та Zod

### 4. Композиція замість наслідування

- Головний сервіс використовує композицію інших сервісів
- Можливість тестування кожного сервісу окремо
- Легке розширення функціональності

## Використання

### Базове використання через головний сервіс

```typescript
import { clientManagementService } from './services';

// Пошук клієнтів
const searchResult = await clientManagementService.searchClients({
  query: 'Іван',
  page: 0,
  pageSize: 10,
});

// Створення клієнта
const createResult = await clientManagementService.createClient({
  firstName: 'Іван',
  lastName: 'Петренко',
  phone: '+380501234567',
  // інші поля...
});
```

### Використання спеціалізованих сервісів

```typescript
import {
  contactMethodsService,
  informationSourceService,
  clientUniquenessCheckService,
} from './services';

// Робота з способами зв'язку
const methods = contactMethodsService.getAvailableContactMethods();

// Перевірка унікальності
const uniqueness = await clientUniquenessCheckService.checkPhoneUniqueness('+380501234567');

// Робота з джерелами інформації
const sources = informationSourceService.getAvailableInformationSources();
```

## Обробка помилок

Всі сервіси повертають результат у форматі `OperationResult<T>`:

```typescript
interface OperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: string[];
}
```

Приклад обробки:

```typescript
const result = await clientManagementService.createClient(clientData);

if (result.success) {
  console.log('Клієнт створений:', result.data);
} else {
  console.error('Помилка:', result.error);
  if (result.warnings) {
    console.warn('Попередження:', result.warnings);
  }
}
```

## Розширення

Для додавання нової функціональності:

1. **Створіть новий спеціалізований сервіс** у відповідній папці
2. **Додайте експорт** у `index.ts`
3. **Інтегруйте у головний сервіс** якщо потрібно
4. **Оновіть типи та інтерфейси** якщо потрібно
5. **Додайте тести** для нової функціональності

## Тестування

Кожен сервіс має бути покритий юніт-тестами:

```typescript
describe('ContactMethodsService', () => {
  it("повинен валідувати способи зв'язку", () => {
    const result = contactMethodsService.validateContactMethods([ContactMethod.PHONE]);
    expect(result.success).toBe(true);
  });
});
```

## Залежності

Сервіси залежать від:

- **Адаптерів API** - для взаємодії з backend
- **Типів домену** - для типізації
- **Zod схем** - для валідації
- **Інтерфейсів** - для контрактів

Всі залежності інжектуються через конструктор або імпорти, що дозволяє легке тестування та моки.
