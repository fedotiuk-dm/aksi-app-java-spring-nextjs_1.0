# Управління клієнтами - Client Management

Модульна система управління клієнтами з використанням підходу "DDD inside, FSD outside" та SOLID принципів.

## Архітектура

Система побудована на принципах Domain-Driven Design (DDD) з чіткою модульністю:

- **Single Responsibility**: Кожен сервіс відповідає за одну функціональність
- **Open/Closed**: Легке розширення без модифікації існуючого коду
- **Dependency Inversion**: Робота через адаптери, а не прямо з API

## Структура модулів

### 🔧 **Основні сервіси**

1. **ClientManagementService** - Головний оркестратор, використовує композицію інших сервісів
2. **ContactMethodsService** - Управління способами зв'язку (телефон, SMS, Viber)
3. **InformationSourceService** - Управління джерелами інформації про хімчистку
4. **ClientUniquenessCheckService** - Перевірка унікальності телефону та email
5. **ClientTransformationSimpleService** - Спрощені трансформації даних

### 📋 **Допоміжні модулі**

- **Types** (`client-domain.types.ts`) - Доменні типи та Zod схеми
- **Interfaces** (`client-management.interfaces.ts`) - Контракти сервісів

## ⚠️ Проблема несумісності типів

### Опис проблеми

У нашій системі існує **розбіжність між типами** у різних архітектурних шарах:

1. **Wizard типи** (`domain/wizard/types/`) - базові типи для wizard домену
2. **Wizard Adapter типи** (`domain/wizard/adapters/client/types/`) - типи для API взаємодії
3. **Доменні типи сервісів** (`services/.../types/`) - спеціалізовані типи

### Конкретні конфлікти

#### 1. **Структура адреси**

```typescript
// Wizard типи (обов'язкові поля)
structuredAddress?: {
  street: string;        // ← required
  city: string;          // ← required
  zipCode?: string;
  country?: string;
};

// Wizard Adapter типи (опціональні поля)
interface WizardClientAddress {
  readonly street?: string;    // ← optional
  readonly city?: string;      // ← optional
  readonly state?: string;
  readonly zipCode?: string;
  readonly country?: string;
}
```

#### 2. **Канали комунікації**

```typescript
// Wizard типи (union type)
communicationChannels?: Array<'PHONE' | 'SMS' | 'VIBER'>;

// Wizard Adapter типи (enum з додатковими опціями)
enum WizardCommunicationChannel {
  PHONE = 'PHONE',
  SMS = 'SMS',
  EMAIL = 'EMAIL',  // ← додатковий канал
  VIBER = 'VIBER',
}
```

#### 3. **Інформація про замовлення**

```typescript
// Wizard типи (з itemCount)
recentOrders?: Array<{
  id: string;
  receiptNumber: string;
  // ...
  itemCount: number;  // ← обов'язкове поле
}>;

// Wizard Adapter типи (без itemCount)
interface ClientOrderSummary {
  readonly id: string;
  readonly receiptNumber: string;
  // ...
  // itemCount відсутнє!
}
```

#### 4. **Джерела інформації**

```typescript
// Wizard типи (union type)
source?: 'INSTAGRAM' | 'GOOGLE' | 'RECOMMENDATION' | 'OTHER';

// Wizard Adapter типи (enum)
enum WizardClientSource {
  INSTAGRAM = 'INSTAGRAM',
  GOOGLE = 'GOOGLE',
  RECOMMENDATION = 'RECOMMENDATION',
  OTHER = 'OTHER',
}
```

### Причини проблеми

1. **Еволюція типів** - типи розвивались незалежно в різних шарах
2. **Різні джерела істини** - відсутність єдиного місця визначення типів
3. **Відсутність синхронізації** - зміни в одному шарі не відображались в інших
4. **Складність трансформацій** - спроби конвертації між несумісними типами

### 💡 Рішення: Спрощений підхід

Замість складних трансформацій між несумісними типами, ми створили **спрощений сервіс трансформації**:

#### ClientTransformationSimpleService

**Принципи роботи:**

- ✅ Працює з базовими типами (string, number, boolean)
- ✅ Уникає складних трансформацій між enum та union types
- ✅ Фокусується на форматуванні та валідації даних
- ✅ Забезпечує консистентність без конфліктів типів

**Функціональність:**

```typescript
// Форматування
createFullName(firstName: string, lastName: string): string
formatPhoneForDisplay(phone: string): string
normalizePhoneForStorage(phone: string): OperationResult<string>

// Відображення
formatContactMethodsForDisplay(methods: ContactMethod[]): string[]
formatInformationSourceForDisplay(source: InformationSource, sourceDetails?: string): string

// Валідація та очищення
sanitizeClientData(clientData: Partial<ClientData>): OperationResult<Partial<ClientData>>
validateClientCompleteness(client: Partial<ClientData>): OperationResult<{...}>

// Утиліти
createClientSummary(client: ClientSearchResult): string
```

### Переваги спрощеного підходу

1. **Надійність** - відсутність TypeScript помилок
2. **Простота** - зрозумілий та передбачуваний код
3. **Гнучкість** - легко розширювати та змінювати
4. **Продуктивність** - швидкий розробочний цикл

### Майбутні покращення

Для вирішення проблеми в довгостроковій перспективі планується:

1. **Уніфікація типів** - створення єдиних типів для всіх шарів
2. **Автогенерація** - генерація типів з OpenAPI специфікації
3. **Строга типізація API** - узгодження з бекенд командою
4. **Міграційна стратегія** - поступовий перехід до уніфікованих типів

---

## Основна функціональність

## ⚠️ Додаткова проблема: Дублювання валідацій

### Опис проблеми

У системі існує **дублювання валідаційної логіки**:

1. **`services/validation/ClientValidationService`** - використовується

   - Базова валідація полів (ім'я, телефон, email)
   - Перевірка обов'язкових полів
   - Статичні методи

2. **`services/validation/ClientUniquenessService`** - **НЕ використовується**

   - Перевірка унікальності телефону/email
   - Дублює функціональність `ClientUniquenessCheckService`

3. **Zod схеми в `client-domain.types.ts`** - використовуються частково
   - Современна валідація з типізацією
   - Більш гнучкі та розширювані

### Конкретне дублювання

```typescript
// ❌ НЕ використовується (validation/client-uniqueness.service.ts)
ClientUniquenessService.checkPhoneUniqueness(phone, currentClientId);

// ✅ Використовується (client-uniqueness-check.service.ts)
clientUniquenessCheckService.checkPhoneUniqueness(phone, excludeClientId);

// ❌ Стара валідація (validation/client-validation.service.ts)
ClientValidationService.validateEmail(email);
ClientValidationService.validatePhone(phone);

// ✅ Нова валідація (client-domain.types.ts)
clientDataSchema.safeParse(data);
```

### Рекомендації щодо рефакторингу

#### 1. **Видалити дубльовані сервіси**

```bash
# Видалити невикористовувані файли
rm services/validation/client-uniqueness.service.ts
rm services/validation/index.ts (якщо порожній)
```

#### 2. **Мігрувати на Zod валідацію**

```typescript
// Замість ClientValidationService.validateClientData
const result = clientDataSchema.safeParse(clientData);
if (!result.success) {
  return {
    success: false,
    error: result.error.issues[0].message,
  };
}
```

#### 3. **Консолідувати підходи**

- Використовувати тільки Zod схеми для валідації
- Залишити тільки `ClientUniquenessCheckService`
- Оновити `ClientManagementService` для роботи з Zod

#### 4. **Очистити структуру**

```
services/
├── client-management.service.ts              # ✅ Головний сервіс (з Zod валідацією)
├── client-search.service.ts                 # ✅ Пошук
├── client-create.service.ts                 # ✅ Створення
├── client-update.service.ts                 # ✅ Оновлення
├── contact-methods.service.ts               # ✅ Способи зв'язку
├── information-source.service.ts            # ✅ Джерела інформації
├── client-uniqueness-check.service.ts      # ✅ Перевірка унікальності
└── client-transformation-simple.service.ts # ✅ Трансформації
```

### ✅ Результати рефакторингу (ЗАВЕРШЕНО)

1. **✅ Етап 1**: Оновлено `ClientManagementService` для використання Zod замість `ClientValidationService`
2. **✅ Етап 2**: Видалено `ClientUniquenessService` (дублював наш сервіс)
3. **✅ Етап 3**: Видалено `ClientValidationService`, замінено на Zod utilities
4. **✅ Етап 4**: Очищено папку `validation/` від застарілих файлів

### 🎯 Досягнуті результати

- **Усунуто дублювання коду** - залишився тільки один сервіс для перевірки унікальності
- **Модернізована валідація** - перехід на Zod схеми з кращою типізацією
- **Очищена структура** - видалено 3 застарілих файли та порожню папку
- **Поліпшена консистентність** - єдиний підхід до валідації в усій системі

---

### 1. **Пошук клієнтів**

```typescript
const result = await clientManagementService.searchClients('Іванов', 0, 20);
if (result.success) {
  console.log(`Знайдено ${result.data.totalElements} клієнтів`);
}
```

### 2. **Створення клієнта**

```typescript
const clientData: ClientData = {
  firstName: 'Олександр',
  lastName: 'Іванов',
  phone: '+380501234567',
  email: 'ivanov@example.com',
  contactMethods: [ContactMethod.PHONE, ContactMethod.VIBER],
  informationSource: InformationSource.INSTAGRAM,
};

const result = await clientManagementService.createClient(clientData);
```

### 3. **Оновлення клієнта**

```typescript
const updateData = {
  email: 'new.email@example.com',
  contactMethods: [ContactMethod.PHONE, ContactMethod.SMS],
};

const result = await clientManagementService.updateClient('client-id', updateData);
```

### 4. **Перевірка унікальності**

```typescript
const phoneCheck = await clientUniquenessCheckService.checkPhoneUniqueness('+380501234567');
const emailCheck = await clientUniquenessCheckService.checkEmailUniqueness('test@example.com');
```

### 5. **Трансформація даних**

```typescript
// Форматування телефону
const formatted = clientTransformationSimpleService.formatPhoneForDisplay('+380501234567');
// Результат: "+380 50 123 45 67"

// Створення повного імені
const fullName = clientTransformationSimpleService.createFullName('Олександр', 'Іванов');
// Результат: "Олександр Іванов"

// Форматування джерела інформації
const sourceDisplay = clientTransformationSimpleService.formatInformationSourceForDisplay(
  InformationSource.OTHER,
  'Реклама на радіо'
);
// Результат: "Інше: Реклама на радіо"
```

## Використання

### Базове використання

```typescript
import { clientManagementService } from '@/domain/wizard/services/stage-1-client-and-order-info/client-management';

// У React компоненті або іншому сервісі
const handleClientSearch = async (query: string) => {
  const result = await clientManagementService.searchClients(query);

  if (result.success) {
    setClients(result.data.clients);
  } else {
    setError(result.error);
  }
};
```

### Валідація з Zod

```typescript
import { clientDataSchema } from '@/domain/wizard/services/stage-1-client-and-order-info/client-management';

// Валідація форми
const validateForm = (formData: unknown) => {
  const result = clientDataSchema.safeParse(formData);

  if (result.success) {
    return { isValid: true, data: result.data };
  } else {
    return { isValid: false, errors: result.error.flatten() };
  }
};
```

## Розширення

### Додавання нового сервісу

1. Створіть новий файл у папці `services/`
2. Реалізуйте інтерфейс з `OperationResult<T>` патерном
3. Додайте сервіс до композиції в `ClientManagementService`
4. Експортуйте через `index.ts`

### Додавання нової валідації

1. Розширте Zod схеми у `types/client-domain.types.ts`
2. Додайте відповідну логіку у валідаційні сервіси
3. Оновіть тести

## Тестування

```typescript
// Приклад unit тесту
import { contactMethodsService } from './contact-methods.service';
import { ContactMethod } from '../types/client-domain.types';

test("повинен валідувати способи зв'язку", () => {
  const result = contactMethodsService.validateContactMethods([ContactMethod.PHONE]);

  expect(result.success).toBe(true);
  expect(result.data).toEqual([ContactMethod.PHONE]);
});
```

## Залежності

- **Zod** - для валідації схем
- **Wizard Adapters** - для взаємодії з API
- **React Hook Form** (опціонально) - для інтеграції з формами

## API Документація

Детальна документація API доступна в JSDoc коментарях кожного сервісу.
