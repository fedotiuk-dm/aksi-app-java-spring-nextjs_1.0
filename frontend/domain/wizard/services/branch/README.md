# Branch Services - Модульна архітектура

## Огляд

Сервіси філій були розбиті на менші, спеціалізовані модулі для покращення тестованості, підтримки та дотримання принципу Single Responsibility.

## Структура

```
branch/
├── services/                       # Модульні сервіси
│   ├── branch-retrieval.service.ts    # Отримання та кешування філій
│   ├── branch-search.service.ts       # Пошук та фільтрація філій
│   ├── branch-availability.service.ts # Перевірка доступності та графіку роботи
│   ├── branch-distance.service.ts     # Розрахунок відстаней та пошук найближчої філії
│   └── index.ts                       # Експорт всіх сервісів
├── types/                          # Модульні типи
│   ├── branch-core.types.ts           # Основні типи (BranchDomain, WorkingHours, etc.)
│   ├── branch-requests.types.ts       # Типи запитів (Create, Update)
│   ├── branch-search.types.ts         # Типи пошуку (SearchParams, SearchResult)
│   ├── branch-availability.types.ts   # Типи доступності (Availability)
│   ├── branch-distance.types.ts       # Типи відстаней (Distance)
│   ├── branch-stats.types.ts          # Типи статистики (Stats)
│   └── index.ts                       # Експорт всіх типів
├── branch.service.ts               # Старий монолітний сервіс (deprecated)
├── branch-domain.types.ts          # Старі монолітні типи (deprecated)
└── index.ts                        # Головний експорт
```

## Сервіси

### 1. BranchRetrievalService

**Відповідальність**: Отримання, кешування та базова фільтрація філій

**Методи**:

- `getAllBranches()` - Отримання всіх філій з кешуванням
- `getActiveBranches()` - Отримання тільки активних філій
- `getBranchById(id)` - Отримання філії за ID
- `getBranchesWithService(serviceId)` - Філії з певною послугою
- `clearCache()` - Очищення кешу

**Кешування**: 15 хвилин

### 2. BranchSearchService

**Відповідальність**: Пошук, валідація параметрів, фільтрація та пагінація

**Методи**:

- `searchBranches(params)` - Основний метод пошуку з кешуванням
- `validateSearchParams(params)` - Валідація параметрів пошуку
- `filterBranches(branches, params)` - Фільтрація філій
- `paginateBranches(branches, page, size)` - Пагінація результатів
- `clearSearchCache()` - Очищення кешу пошуку

**Кешування**: 5 хвилин
**Пагінація**: До 100 елементів на сторінку

### 3. BranchAvailabilityService

**Відповідальність**: Перевірка графіку роботи та поточної доступності

**Методи**:

- `getBranchAvailability(branchId)` - Перевірка доступності філії
- `checkCurrentAvailability(schedule, time)` - Перевірка за розкладом
- `getCurrentDayName(date)` - Отримання назви дня
- `formatTime(date)` - Форматування часу

**Функціональність**:

- Перевірка робочих годин
- Врахування перерв
- Розрахунок наступної зміни статусу

### 4. BranchDistanceService

**Відповідальність**: Розрахунок відстаней та пошук найближчої філії

**Методи**:

- `calculateDistanceToBranches(coordinates)` - Відстані до всіх філій
- `getNearestBranch(coordinates)` - Пошук найближчої філії
- `calculateDistance(coord1, coord2)` - Розрахунок відстані (Haversine)
- `isValidCoordinates(coordinates)` - Валідація координат

**Алгоритм**: Формула Haversine для точного розрахунку відстаней
**Обмеження**: Максимум 100 км

## Типи

### Модульна структура типів

Типи філій розбиті на спеціалізовані модулі:

- **branch-core.types.ts**: Основні типи (BranchDomain, WorkingHoursDomain, DayScheduleDomain)
- **branch-requests.types.ts**: Типи запитів (CreateBranchDomainRequest, UpdateBranchDomainRequest)
- **branch-search.types.ts**: Типи пошуку (BranchSearchDomainParams, BranchSearchDomainResult)
- **branch-availability.types.ts**: Типи доступності (BranchAvailabilityDomain)
- **branch-distance.types.ts**: Типи відстаней (BranchDistanceDomain)
- **branch-stats.types.ts**: Типи статистики (BranchStatsDomain)

### Імпорт типів

```typescript
// Імпорт всіх типів
import type { BranchDomain, BranchSearchDomainParams } from '@/domains/wizard/services/branch';

// Імпорт з конкретного модуля
import type { BranchAvailabilityDomain } from '@/domains/wizard/services/branch/types/branch-availability.types';

// Імпорт колекції типів
import type { BranchTypes } from '@/domains/wizard/services/branch/types';
```

## Використання

### Імпорт окремих сервісів

```typescript
import {
  branchRetrievalService,
  branchSearchService,
  branchAvailabilityService,
  branchDistanceService,
} from '@/domains/wizard/services/branch';
```

### Імпорт колекції сервісів

```typescript
import { branchServices } from '@/domains/wizard/services/branch';

// Використання
const branches = await branchServices.retrieval.getAllBranches();
const searchResult = await branchServices.search.searchBranches(params);
```

### Приклади використання

#### Пошук філій

```typescript
const searchResult = await branchSearchService.searchBranches({
  query: 'центр',
  isActive: true,
  page: 0,
  size: 20,
});
```

#### Перевірка доступності

```typescript
const availability = await branchAvailabilityService.getBranchAvailability('branch-1');
if (availability.success && availability.data?.isOpen) {
  console.log('Філія відкрита');
}
```

#### Пошук найближчої філії

```typescript
const userCoords = { latitude: 50.4501, longitude: 30.5234 };
const nearest = await branchDistanceService.getNearestBranch(userCoords);
```

## Переваги модульної архітектури

1. **Single Responsibility**: Кожен сервіс має одну чітку відповідальність
2. **Тестованість**: Легше писати unit тести для окремих модулів
3. **Підтримка**: Зміни в одному модулі не впливають на інші
4. **Переиспользование**: Сервіси можна використовувати незалежно
5. **Читабельність**: Менші файли легше читати та розуміти

## Міграція

Старий монолітний `BranchService` позначений як deprecated і буде видалений в наступних версіях. Рекомендується використовувати нові модульні сервіси.

## Тестування

Кожен сервіс має власні unit тести:

- `branch-retrieval.service.test.ts`
- `branch-search.service.test.ts`
- `branch-availability.service.test.ts`
- `branch-distance.service.test.ts`
