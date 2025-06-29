# JSDoc Templates для AKSI Frontend

Цей документ містить приклади правильного JSDoc документування для різних типів файлів у нашій архітектурі "DDD inside, FSD outside".

## 🏗️ Загальні принципи

### Обов'язкові теги для всіх файлів:

- `@fileoverview` або `@overview` - опис файлу
- `@module` - модуль (для index.ts файлів)
- `@author` - автор
- `@since` - версія з якої доступний
- `@example` - приклади використання

### Для функцій та хуків:

- `@param` - параметри
- `@returns` - що повертає
- `@throws` - які помилки може кинути
- `@see` - посилання на пов'язані функції
- `@todo` - що потрібно доробити

### Для TypeScript:

- `@template` - для дженериків
- `@interface` - для інтерфейсів
- `@typedef` - для типів

---

## 📁 Domain Layer Templates

### 1. Hooks Template

```typescript
/**
 * @fileoverview Головний композиційний хук для кроку CLIENT_SELECTION
 * @module domain/client/hooks
 * @author AKSI Team
 * @since 1.0.0
 *
 * @description
 * Цей хук реалізує принципи SOLID та архітектури DDD:
 * - Single Responsibility: тільки композиція спеціалізованих хуків
 * - Open/Closed: розширюється через options та callbacks
 * - Dependency Inversion: залежить від спеціалізованих хуків
 * - Composition over Inheritance: використання композиції
 *
 * Функціональність згідно з документацією Order Wizard:
 * 1.1. Вибір або створення клієнта
 * - Форма пошуку існуючого клієнта
 * - Відображення списку знайдених клієнтів
 * - Можливість вибрати клієнта зі списку
 * - Можливість редагування клієнта
 * - Форма нового клієнта з повною валідацією
 */

import { useCallback } from 'react';
import { Client } from '../types';

/**
 * Конфігурація головного хука CLIENT_SELECTION кроку
 *
 * @interface UseClientStepOptions
 * @property {boolean} [autoAdvance=true] - Автоматично переходити до наступного кроку після вибору клієнта
 * @property {function} [onStepComplete] - Callback при завершенні кроку
 */
interface UseClientStepOptions {
  autoAdvance?: boolean;
  onStepComplete?: (client: Client) => void;
}

/**
 * Результат виконання хука useClientStep
 *
 * @interface UseClientStepResult
 * @property {boolean} canProceed - Чи можна переходити до наступного кроку
 * @property {function} proceedToNext - Перехід до наступного кроку
 * @property {function} completeStep - Завершення кроку
 * @property {function} selectAndComplete - Вибір клієнта та автоматичне завершення
 */
interface UseClientStepResult {
  canProceed: boolean;
  proceedToNext: () => void;
  completeStep: (client: Client) => void;
  selectAndComplete: (client: Client) => void;
  // ... інші властивості
}

/**
 * Головний композиційний хук для кроку CLIENT_SELECTION
 *
 * @function useClientStep
 * @param {UseClientStepOptions} [options={}] - Конфігурація хука
 * @returns {UseClientStepResult} Об'єкт з методами та станом кроку
 *
 * @example
 * // Базове використання
 * const { canProceed, selectAndComplete } = useClientStep();
 *
 * @example
 * // З кастомними опціями
 * const clientStep = useClientStep({
 *   autoAdvance: false,
 *   onStepComplete: (client) => console.log('Client selected:', client)
 * });
 *
 * @example
 * // В UI компоненті
 * function ClientSelectionStep() {
 *   const {
 *     searchTerm,
 *     results,
 *     selectAndComplete,
 *     canProceed
 *   } = useClientStep();
 *
 *   return (
 *     <div>
 *       {results.map(client => (
 *         <button
 *           key={client.id}
 *           onClick={() => selectAndComplete(client)}
 *         >
 *           {client.fullName}
 *         </button>
 *       ))}
 *     </div>
 *   );
 * }
 *
 * @see {@link useClientStepState} - Стан кроку
 * @see {@link useClientStepActions} - Дії кроку
 * @see {@link useClientStepNavigation} - Навігація кроку
 *
 * @since 1.0.0
 * @throws {Error} Якщо хук використовується поза контекстом wizard
 */
export const useClientStep = (options: UseClientStepOptions = {}): UseClientStepResult => {
  // ... реалізація
};
```

### 2. Store Template

```typescript
/**
 * @fileoverview Zustand стор для управління станом CLIENT_SELECTION кроку
 * @module domain/client/store
 * @author AKSI Team
 * @since 1.0.0
 *
 * @description
 * Цей стор управляє всім станом пов'язаним з вибором та створенням клієнтів.
 * Реалізує принципи:
 * - Single Responsibility: тільки стан CLIENT_SELECTION кроку
 * - Immutability: всі зміни через Immer
 * - Type Safety: повна типізація стану та дій
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

/**
 * Стан CLIENT_SELECTION кроку
 *
 * @interface ClientStepState
 * @property {string | null} selectedClientId - ID вибраного клієнта
 * @property {boolean} isNewClient - Чи створюємо нового клієнта
 * @property {Client[]} searchResults - Результати пошуку клієнтів
 * @property {string} searchTerm - Поточний пошуковий запит
 * @property {boolean} isSearching - Чи йде пошук зараз
 * @property {boolean} isCreating - Чи йде створення нового клієнта
 */
interface ClientStepState {
  selectedClientId: string | null;
  isNewClient: boolean;
  searchResults: Client[];
  searchTerm: string;
  isSearching: boolean;
  isCreating: boolean;
}

/**
 * Дії CLIENT_SELECTION кроку
 *
 * @interface ClientStepActions
 * @property {function} setSelectedClient - Встановити вибраного клієнта
 * @property {function} setIsNewClient - Перемкнути режим створення нового клієнта
 * @property {function} setSearchTerm - Встановити пошуковий запит
 * @property {function} setSearchResults - Встановити результати пошуку
 * @property {function} resetStep - Скинути стан кроку
 */
interface ClientStepActions {
  setSelectedClient: (clientId: string | null) => void;
  setIsNewClient: (isNew: boolean) => void;
  setSearchTerm: (term: string) => void;
  setSearchResults: (results: Client[]) => void;
  resetStep: () => void;
}

/**
 * Початковий стан CLIENT_SELECTION кроку
 *
 * @constant
 * @type {ClientStepState}
 */
const initialState: ClientStepState = {
  selectedClientId: null,
  isNewClient: false,
  searchResults: [],
  searchTerm: '',
  isSearching: false,
  isCreating: false,
};

/**
 * Zustand стор для CLIENT_SELECTION кроку
 *
 * @function useClientStepStore
 * @returns {ClientStepState & ClientStepActions} Стан та дії кроку
 *
 * @example
 * // Отримання стану
 * const selectedClientId = useClientStepStore(state => state.selectedClientId);
 *
 * @example
 * // Виконання дій
 * const { setSelectedClient, resetStep } = useClientStepStore();
 * setSelectedClient('client-123');
 *
 * @example
 * // Підписка на зміни
 * const clientStep = useClientStepStore();
 * useEffect(() => {
 *   console.log('Selected client changed:', clientStep.selectedClientId);
 * }, [clientStep.selectedClientId]);
 *
 * @since 1.0.0
 */
export const useClientStepStore = create<ClientStepState & ClientStepActions>()(
  immer((set) => ({
    ...initialState,

    /**
     * Встановити вибраного клієнта
     *
     * @method setSelectedClient
     * @param {string | null} clientId - ID клієнта або null для скидання
     * @memberof useClientStepStore
     */
    setSelectedClient: (clientId) =>
      set((state) => {
        state.selectedClientId = clientId;
        if (clientId) {
          state.isNewClient = false;
        }
      }),

    // ... інші дії з JSDoc коментарями
  }))
);
```

### 3. Service Template

```typescript
/**
 * @fileoverview Доменний сервіс для роботи з клієнтами
 * @module domain/client/services
 * @author AKSI Team
 * @since 1.0.0
 *
 * @description
 * Доменний сервіс що інкапсулює бізнес-логіку роботи з клієнтами.
 * Відповідає за:
 * - Валідацію даних клієнта
 * - Бізнес-правила створення та оновлення
 * - Трансформацію даних між форматами
 */

import { Client, CreateClientDto, UpdateClientDto } from '../types';
import { clientSchema } from '../schemas';

/**
 * Результат валідації клієнта
 *
 * @interface ClientValidationResult
 * @property {boolean} isValid - Чи валідні дані
 * @property {string[]} errors - Список помилок валідації
 * @property {Object} [details] - Деталі помилок по полях
 */
interface ClientValidationResult {
  isValid: boolean;
  errors: string[];
  details?: Record<string, string[]>;
}

/**
 * Доменний сервіс для роботи з клієнтами
 *
 * @class ClientDomainService
 * @description
 * Реалізує бізнес-логіку домену клієнтів згідно з DDD принципами.
 * Всі методи чисті функції без побічних ефектів.
 *
 * @example
 * const service = new ClientDomainService();
 * const validation = service.validateClient(clientData);
 * if (validation.isValid) {
 *   const client = service.createClient(clientData);
 * }
 *
 * @since 1.0.0
 */
export class ClientDomainService {
  /**
   * Валідувати дані клієнта
   *
   * @method validateClient
   * @param {unknown} data - Дані для валідації
   * @returns {ClientValidationResult} Результат валідації
   *
   * @example
   * const result = service.validateClient({
   *   firstName: 'Іван',
   *   lastName: 'Петренко',
   *   phone: '+380501234567'
   * });
   *
   * if (!result.isValid) {
   *   console.error('Помилки:', result.errors);
   * }
   *
   * @since 1.0.0
   */
  validateClient(data: unknown): ClientValidationResult {
    // ... реалізація
  }

  /**
   * Створити нового клієнта з валідацією
   *
   * @method createClient
   * @param {CreateClientDto} data - Дані для створення клієнта
   * @returns {Client} Створений клієнт
   * @throws {Error} Якщо дані не валідні
   *
   * @example
   * try {
   *   const client = service.createClient({
   *     firstName: 'Іван',
   *     lastName: 'Петренко',
   *     phone: '+380501234567',
   *     email: 'ivan@example.com'
   *   });
   *   console.log('Клієнт створений:', client);
   * } catch (error) {
   *   console.error('Помилка створення:', error.message);
   * }
   *
   * @since 1.0.0
   */
  createClient(data: CreateClientDto): Client {
    // ... реалізація
  }
}
```

### 4. Types Template

```typescript
/**
 * @fileoverview Типи та інтерфейси домену клієнтів
 * @module domain/client/types
 * @author AKSI Team
 * @since 1.0.0
 *
 * @description
 * Містить всі TypeScript типи, інтерфейси та enums для домену клієнтів.
 * Забезпечує type safety та документує структуру даних.
 */

/**
 * Способи зв'язку з клієнтом
 *
 * @enum {string}
 * @readonly
 */
export enum ContactMethod {
  /** Дзвінок по номеру телефону */
  PHONE = 'phone',
  /** SMS повідомлення */
  SMS = 'sms',
  /** Повідомлення в Viber */
  VIBER = 'viber',
}

/**
 * Джерела інформації про хімчистку
 *
 * @enum {string}
 * @readonly
 */
export enum InformationSource {
  /** Знайшли в Instagram */
  INSTAGRAM = 'instagram',
  /** Знайшли через Google пошук */
  GOOGLE = 'google',
  /** Рекомендації знайомих */
  RECOMMENDATIONS = 'recommendations',
  /** Інше джерело */
  OTHER = 'other',
}

/**
 * Сутність клієнта хімчистки
 *
 * @interface Client
 * @description Основна сутність домену клієнтів з повною інформацією
 *
 * @property {string} id - Унікальний ідентифікатор клієнта
 * @property {string} firstName - Ім'я клієнта (обов'язкове)
 * @property {string} lastName - Прізвище клієнта (обов'язкове)
 * @property {string} phone - Номер телефону (обов'язкове)
 * @property {string} [email] - Email адреса (опціонально)
 * @property {string} [address] - Домашня адреса (опціонально)
 * @property {ContactMethod[]} contactMethods - Способи зв'язку
 * @property {InformationSource} informationSource - Джерело інформації про хімчистку
 * @property {string} [otherSource] - Опис іншого джерела (якщо informationSource = OTHER)
 * @property {Date} createdAt - Дата створення запису
 * @property {Date} updatedAt - Дата останнього оновлення
 *
 * @example
 * const client: Client = {
 *   id: 'client-123',
 *   firstName: 'Іван',
 *   lastName: 'Петренко',
 *   phone: '+380501234567',
 *   email: 'ivan@example.com',
 *   contactMethods: [ContactMethod.PHONE, ContactMethod.VIBER],
 *   informationSource: InformationSource.INSTAGRAM,
 *   createdAt: new Date(),
 *   updatedAt: new Date()
 * };
 *
 * @since 1.0.0
 */
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  address?: string;
  contactMethods: ContactMethod[];
  informationSource: InformationSource;
  otherSource?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO для створення нового клієнта
 *
 * @interface CreateClientDto
 * @description Дані необхідні для створення нового клієнта (без системних полів)
 *
 * @extends {Omit<Client, 'id' | 'createdAt' | 'updatedAt'>}
 *
 * @since 1.0.0
 */
export interface CreateClientDto extends Omit<Client, 'id' | 'createdAt' | 'updatedAt'> {}

/**
 * DTO для оновлення існуючого клієнта
 *
 * @interface UpdateClientDto
 * @description Дані для оновлення клієнта (всі поля опціональні)
 *
 * @since 1.0.0
 */
export interface UpdateClientDto extends Partial<CreateClientDto> {}
```

---

## 🎨 UI Layer Templates

### 5. UI Component Template

```tsx
/**
 * @fileoverview Компонент для вибору клієнта в Order Wizard
 * @module features/order-wizard/client-selection/ui
 * @author AKSI Team
 * @since 1.0.0
 *
 * @description
 * "Тонкий" UI компонент згідно з архітектурою FSD outside.
 * Не містить бізнес-логіки, тільки відображення та делегування подій.
 * Вся логіка інкапсульована в доменних хуках.
 */

'use client';

import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { useClientStep } from '@/domain/client';

/**
 * Props для компонента ClientSelectionStep
 *
 * @interface ClientSelectionStepProps
 * @property {function} [onClientSelected] - Callback при виборі клієнта
 * @property {boolean} [autoAdvance=true] - Автоматично переходити до наступного кроку
 */
interface ClientSelectionStepProps {
  onClientSelected?: (clientId: string) => void;
  autoAdvance?: boolean;
}

/**
 * Компонент кроку вибору клієнта в Order Wizard
 *
 * @component
 * @param {ClientSelectionStepProps} props - Властивості компонента
 * @returns {JSX.Element} Відрендерений компонент
 *
 * @description
 * Реалізує UI для кроку CLIENT_SELECTION згідно з документацією Order Wizard:
 * - Форма пошуку існуючого клієнта
 * - Відображення списку знайдених клієнтів
 * - Можливість вибрати клієнта зі списку
 * - Можливість редагування клієнта
 * - Форма нового клієнта
 *
 * @example
 * // Базове використання
 * <ClientSelectionStep />
 *
 * @example
 * // З кастомним callback
 * <ClientSelectionStep
 *   onClientSelected={(id) => console.log('Client selected:', id)}
 *   autoAdvance={false}
 * />
 *
 * @since 1.0.0
 */
export const ClientSelectionStep: FC<ClientSelectionStepProps> = ({
  onClientSelected,
  autoAdvance = true,
}) => {
  /**
   * Доменна логіка кроку через композиційний хук
   * Всі операції делегуються доменному шару
   */
  const {
    searchTerm,
    searchResults,
    selectedClientId,
    isSearching,
    canProceed,
    setSearchTerm,
    selectAndComplete,
  } = useClientStep({
    autoAdvance,
    onStepComplete: (client) => onClientSelected?.(client.id),
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Вибір клієнта
      </Typography>

      {/* Форма пошуку - делегує всю логіку доменному хуку */}
      <SearchForm
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        isSearching={isSearching}
      />

      {/* Результати пошуку - тільки відображення */}
      <SearchResults
        results={searchResults}
        selectedClientId={selectedClientId}
        onClientSelect={selectAndComplete}
      />

      {/* Індикатор готовності до наступного кроку */}
      {canProceed && (
        <Typography color="success.main">✓ Клієнт обраний, можна продовжувати</Typography>
      )}
    </Box>
  );
};
```

---

## 🛠️ Utility Templates

### 6. Utility Functions Template

```typescript
/**
 * @fileoverview Утиліти для роботи з клієнтами
 * @module domain/client/utils
 * @author AKSI Team
 * @since 1.0.0
 *
 * @description
 * Набір чистих функцій для трансформації та обробки даних клієнтів.
 * Всі функції immutable та не мають побічних ефектів.
 */

import { Client, ContactMethod } from '../types';

/**
 * Опції для форматування імені клієнта
 *
 * @interface FormatNameOptions
 * @property {boolean} [lastNameFirst=false] - Спочатку прізвище
 * @property {boolean} [withInitials=false] - Використовувати ініціали
 * @property {string} [separator=' '] - Роздільник між частинами імені
 */
interface FormatNameOptions {
  lastNameFirst?: boolean;
  withInitials?: boolean;
  separator?: string;
}

/**
 * Форматувати повне ім'я клієнта
 *
 * @function formatClientName
 * @param {Client} client - Об'єкт клієнта
 * @param {FormatNameOptions} [options={}] - Опції форматування
 * @returns {string} Відформатоване ім'я
 *
 * @example
 * const client = { firstName: 'Іван', lastName: 'Петренко' };
 *
 * formatClientName(client);
 * // => "Іван Петренко"
 *
 * formatClientName(client, { lastNameFirst: true });
 * // => "Петренко Іван"
 *
 * formatClientName(client, { withInitials: true });
 * // => "І. Петренко"
 *
 * @since 1.0.0
 */
export const formatClientName = (
  client: Pick<Client, 'firstName' | 'lastName'>,
  options: FormatNameOptions = {}
): string => {
  const { lastNameFirst = false, withInitials = false, separator = ' ' } = options;

  const firstName = withInitials ? `${client.firstName.charAt(0)}.` : client.firstName;

  return lastNameFirst
    ? `${client.lastName}${separator}${firstName}`
    : `${firstName}${separator}${client.lastName}`;
};

/**
 * Перевірити чи має клієнт певний спосіб зв'язку
 *
 * @function hasContactMethod
 * @param {Client} client - Об'єкт клієнта
 * @param {ContactMethod} method - Спосіб зв'язку для перевірки
 * @returns {boolean} true якщо клієнт має цей спосіб зв'язку
 *
 * @example
 * const client = {
 *   contactMethods: [ContactMethod.PHONE, ContactMethod.VIBER]
 * };
 *
 * hasContactMethod(client, ContactMethod.VIBER); // => true
 * hasContactMethod(client, ContactMethod.SMS);   // => false
 *
 * @since 1.0.0
 */
export const hasContactMethod = (
  client: Pick<Client, 'contactMethods'>,
  method: ContactMethod
): boolean => {
  return client.contactMethods.includes(method);
};

/**
 * Маскувати телефонний номер для безпеки
 *
 * @function maskPhoneNumber
 * @param {string} phone - Телефонний номер
 * @param {number} [visibleDigits=4] - Кількість видимих цифр в кінці
 * @returns {string} Замаскований номер
 *
 * @example
 * maskPhoneNumber('+380501234567');     // => "+38050****4567"
 * maskPhoneNumber('+380501234567', 2);  // => "+38050****67"
 *
 * @throws {Error} Якщо номер некоректний
 * @since 1.0.0
 */
export const maskPhoneNumber = (phone: string, visibleDigits: number = 4): string => {
  if (!phone || phone.length < visibleDigits) {
    throw new Error('Некоректний телефонний номер');
  }

  const masked = phone.slice(0, -visibleDigits).replace(/\d/g, '*');
  const visible = phone.slice(-visibleDigits);

  return `${masked}${visible}`;
};
```

---

## 📋 Workflow Templates

### 7. README Template для Domain

```markdown
/\*\*

- @fileoverview README для домену клієнтів
- @module domain/client
- @author AKSI Team
- @since 1.0.0
  \*/

# Client Domain

Домен для управління клієнтами хімчистки згідно з принципами DDD.

## 📁 Структура

\`\`\`
domain/client/
├── entities/ # Бізнес-сутності
├── value-objects/ # Об'єкти-значення
├── repositories/ # Інтерфейси та реалізації репозиторіїв
├── services/ # Доменні сервіси
├── use-cases/ # Сценарії використання
├── events/ # Доменні події
├── hooks/ # React-хуки для роботи з доменом
├── store/ # Zustand сторі для стану домену
├── schemas/ # Zod схеми для валідації
├── types/ # Типи та інтерфейси
├── utils/ # Утиліти специфічні для домену
└── index.ts # Публічне API домену
\`\`\`

## 🚀 Використання

\`\`\`typescript
import { useClientStep, Client, ClientDomainService } from '@/domain/client';

// В UI компоненті
const { selectClient, searchResults } = useClientStep();

// В бізнес-логіці
const service = new ClientDomainService();
const isValid = service.validateClient(clientData);
\`\`\`

## 📚 Документація

- [JSDoc документація](../../docs/jsdoc/domain_client.html)
- [TypeDoc API](../../docs/typedoc/modules/domain_client.html)
```

Ці приклади показують як правильно документувати код у вашій архітектурі "DDD inside, FSD outside" з JSDoc коментарями.
