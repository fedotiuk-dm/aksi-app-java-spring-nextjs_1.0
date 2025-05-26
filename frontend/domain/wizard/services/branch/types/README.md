# Branch Types - Модульна архітектура типів

## Огляд

Типи філій були розбиті на менші, спеціалізовані модулі для покращення організації коду, зменшення залежностей та дотримання принципу Single Responsibility.

## Структура

```
types/
├── branch-core.types.ts         # Основні типи (BranchDomain, WorkingHours, etc.)
├── branch-requests.types.ts     # Типи запитів (Create, Update)
├── branch-search.types.ts       # Типи пошуку (SearchParams, SearchResult)
├── branch-availability.types.ts # Типи доступності (Availability)
├── branch-distance.types.ts     # Типи відстаней (Distance)
├── branch-stats.types.ts        # Типи статистики (Stats)
└── index.ts                     # Експорт всіх типів
```

## Модулі типів

### 1. branch-core.types.ts

**Відповідальність**: Основні доменні типи філій

**Типи**:

- `BranchDomain` - Основна модель філії
- `WorkingHoursDomain` - Робочі години філії
- `DayScheduleDomain` - Розклад на день
- `CoordinatesDomain` - Географічні координати
- `BranchManagerDomain` - Менеджер філії
- `BranchServiceDomain` - Послуга філії

### 2. branch-requests.types.ts

**Відповідальність**: Типи для запитів створення та оновлення

**Типи**:

- `CreateBranchDomainRequest` - Запит на створення філії
- `UpdateBranchDomainRequest` - Запит на оновлення філії

**Залежності**: Імпортує базові типи з `branch-core.types.ts`

### 3. branch-search.types.ts

**Відповідальність**: Типи для пошуку та фільтрації

**Типи**:

- `BranchSearchDomainParams` - Параметри пошуку
- `BranchSearchDomainResult` - Результат пошуку з пагінацією

**Залежності**: Імпортує `BranchDomain` з `branch-core.types.ts`

### 4. branch-availability.types.ts

**Відповідальність**: Типи для перевірки доступності

**Типи**:

- `BranchAvailabilityDomain` - Інформація про доступність філії

**Залежності**: Імпортує `DayScheduleDomain` з `branch-core.types.ts`

### 5. branch-distance.types.ts

**Відповідальність**: Типи для роботи з відстанями

**Типи**:

- `BranchDistanceDomain` - Відстань до філії з часом в дорозі

**Залежності**: Немає (самостійний модуль)

### 6. branch-stats.types.ts

**Відповідальність**: Типи для статистики та аналітики

**Типи**:

- `BranchStatsDomain` - Статистика філії (замовлення, дохід, топ послуги)

**Залежності**: Немає (самостійний модуль)

## Використання

### Імпорт окремих типів

```typescript
import type { BranchDomain, WorkingHoursDomain } from '@/domains/wizard/services/branch/types';
```

### Імпорт з конкретного модуля

```typescript
import type { BranchSearchDomainParams } from '@/domains/wizard/services/branch/types/branch-search.types';
```

### Імпорт колекції типів

```typescript
import type { BranchTypes } from '@/domains/wizard/services/branch/types';

// Використання
const branch: BranchTypes.Branch = {
  /* ... */
};
const searchParams: BranchTypes.SearchParams = {
  /* ... */
};
```

### Приклади використання

#### Основні типи

```typescript
const branch: BranchDomain = {
  id: 'branch-1',
  name: 'Філія Центр',
  code: 'CENTER',
  address: 'вул. Хрещатик, 1',
  phone: '+380441234567',
  workingHours: {
    monday: { isWorkingDay: true, openTime: '08:00', closeTime: '20:00' },
    // ... інші дні
  },
  isActive: true,
  isMainBranch: false,
  services: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

#### Пошук

```typescript
const searchParams: BranchSearchDomainParams = {
  query: 'центр',
  isActive: true,
  page: 0,
  size: 20,
};
```

#### Доступність

```typescript
const availability: BranchAvailabilityDomain = {
  branchId: 'branch-1',
  isOpen: true,
  currentStatus: 'OPEN',
  todaySchedule: { isWorkingDay: true, openTime: '08:00', closeTime: '20:00' },
  nextStatusChange: { status: 'CLOSED', time: '20:00' },
};
```

## Переваги модульної архітектури

1. **Розділення відповідальності**: Кожен модуль відповідає за свою область
2. **Зменшення залежностей**: Модулі імпортують тільки необхідні типи
3. **Легше рефакторинг**: Зміни в одному модулі не впливають на інші
4. **Кращий IntelliSense**: IDE краще розуміє структуру типів
5. **Читабельність**: Менші файли легше читати та розуміти

## Міграція

Старий монолітний файл `branch-domain.types.ts` залишений для зворотної сумісності, але рекомендується використовувати нові модульні типи.

### Міграція імпортів

```typescript
// Старий спосіб
import type { BranchDomain } from './branch-domain.types';

// Новий спосіб
import type { BranchDomain } from './types';
```

## Структура залежностей

```
branch-core.types.ts (базові типи)
    ↑
    ├── branch-requests.types.ts
    ├── branch-search.types.ts
    └── branch-availability.types.ts

branch-distance.types.ts (незалежний)
branch-stats.types.ts (незалежний)
```

## Рекомендації

1. **Додавання нових типів**: Створюйте нові модулі для нових функціональних областей
2. **Модифікація існуючих**: Змінюйте типи тільки в їх відповідних модулях
3. **Залежності**: Мінімізуйте кількість залежностей між модулями
4. **Іменування**: Використовуйте суфікс `Domain` для доменних типів
