# Клієнтські сервіси з оновленою пагінацією

## Огляд

Клієнтські сервіси були оновлені для повної підтримки пагінації відповідно до бекенд API.

## Основні зміни

### 1. Оновлені типи пошуку

```typescript
// Нова структура результату пошуку (відповідає ClientPageResponse з бекенду)
interface ClientSearchDomainResult {
  content: ClientDomain[]; // Список клієнтів на поточній сторінці
  totalElements: number; // Загальна кількість клієнтів
  totalPages: number; // Загальна кількість сторінок
  pageNumber: number; // Номер поточної сторінки (з нуля)
  pageSize: number; // Розмір сторінки
  hasPrevious: boolean; // Чи є попередня сторінка
  hasNext: boolean; // Чи є наступна сторінка
}

// Розширені параметри пошуку з сортуванням
interface ClientSearchDomainParams {
  query?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}
```

### 2. Нові сервіси

#### ClientPaginationAdapterService

- Адаптація між різними форматами пагінації
- Підтримка застарілого формату для зворотної сумісності
- Створення порожніх результатів з пагінацією

#### ClientSearchAdvancedService

- Розширений пошук з підтримкою сортування
- Спеціалізовані методи пошуку за іменем та телефоном
- Інтеграція з основним сервісом пошуку

### 3. Оновлений API адаптер

```typescript
// Повертає повну структуру пагінації
async function searchClientsWithPagination(
  keyword: string,
  page: number = 0,
  size: number = 20
): Promise<{
  clients: ClientSearchResult[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
}>;
```

## Використання

### Базовий пошук з пагінацією

```typescript
import { clientSearchCoreService } from '@/domain/wizard/services/client';

const result = await clientSearchCoreService.searchClients({
  query: 'Іванов',
  page: 0,
  size: 20,
});

if (result.success) {
  console.log('Клієнти:', result.data);
  console.log('Пагінація:', result.pagination);
}
```

### Розширений пошук з сортуванням

```typescript
import { clientSearchAdvancedService } from '@/domain/wizard/services/client';

const result = await clientSearchAdvancedService.searchWithSorting({
  firstName: 'Іван',
  lastName: 'Іванов',
  page: 0,
  size: 10,
  sortBy: 'lastName',
  sortDirection: 'ASC',
});
```

### Адаптація до застарілого формату

```typescript
import { clientPaginationAdapterService } from '@/domain/wizard/services/client';

// Якщо потрібен застарілий формат
const legacyResult = clientPaginationAdapterService.adaptToLegacyFormat(searchResult);
```

## Архітектурні принципи

1. **DDD inside, FSD outside** - вся логіка пагінації в доменному шарі
2. **SOLID принципи** - кожен сервіс має одну відповідальність
3. **Зворотна сумісність** - підтримка застарілих форматів через адаптери
4. **Типізація** - строга типізація на всіх рівнях

## Структура файлів

```
services/client/
├── services/
│   ├── client-search-core.service.ts          # Основний пошук
│   ├── client-search-advanced.service.ts      # Розширений пошук
│   ├── client-pagination-adapter.service.ts   # Адаптація пагінації
│   └── client-search-utils.service.ts         # Утиліти пошуку
├── types/
│   └── client-search.types.ts                 # Типи пошуку з пагінацією
├── repositories/
│   └── client-repository-core.ts              # Репозиторій з пагінацією
└── adapters/
    └── client.api.ts                          # API адаптер з пагінацією
```

## Тестування

```typescript
// Тестовий метод для перевірки пагінації
const testResult = await clientSearchCoreService.testPagination();
```
