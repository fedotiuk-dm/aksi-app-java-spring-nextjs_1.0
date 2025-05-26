# Stage 2: Branch Selection - Хуки

## Огляд

Етап 2 Order Wizard відповідає за вибір філії та ініціацію замовлення. Цей етап включає:

1. **Завантаження списку філій** - отримання активних філій з кешуванням
2. **Пошук філій** - фільтрація філій за критеріями з дебаунсингом
3. **Вибір філії** - валідація та збереження вибраної філії
4. **Ініціація замовлення** - створення базової структури замовлення

## Реалізовані хуки

### Функціональні хуки

#### `useBranchLoading`

Хук для завантаження списку філій з кешуванням та обробкою помилок.

**Функціональність:**

- Автоматичне завантаження при монтуванні
- Кешування результатів (через BranchService)
- Можливість примусового оновлення
- Обробка помилок завантаження

**API:**

```typescript
const {
  branches, // Branch[] - список філій
  isLoading, // boolean - стан завантаження
  error, // string | null - помилка завантаження
  loadBranches, // (forceRefresh?: boolean) => Promise<void>
  refreshBranches, // () => Promise<void> - примусове оновлення
} = useBranchLoading();
```

#### `useBranchSearch`

Хук для пошуку філій з дебаунсингом та фільтрацією.

**Функціональність:**

- Автоматичний пошук з дебаунсингом (300ms за замовчуванням)
- Фільтрація за назвою, адресою, кодом, телефоном
- Можливість пошуку тільки активних філій
- Очищення результатів пошуку

**API:**

```typescript
const {
  searchTerm,        // string - поточний термін пошуку
  searchResults,     // Branch[] - результати пошуку
  isSearching,       // boolean - стан пошуку
  searchError,       // string | null - помилка пошуку
  hasSearched,       // boolean - чи був виконаний пошук
  setSearchTerm,     // (term: string) => void
  performSearch,     // (params?: Partial<BranchSearchParams>) => Promise<void>
  clearSearch,       // () => void
} = useBranchSearch(debounceMs?: number);
```

#### `useBranchSelection`

Хук для управління вибором філії з валідацією та інтеграцією зі стором.

**Функціональність:**

- Валідація філії для замовлення (через BranchService)
- Збереження вибору у wizard store
- Очищення вибору
- Автоматична валідація поточного вибору

**API:**

```typescript
const {
  selectedBranch, // Branch | null - вибрана філія
  isValidSelection, // boolean - чи валідний вибір
  validationError, // string | null - помилка валідації
  selectBranch, // (branch: Branch) => Promise<boolean>
  clearSelection, // () => void
  validateCurrentSelection, // () => boolean
} = useBranchSelection();
```

### Композиційні хуки

#### `useBranchSelectionStage`

Головний композиційний хук для координації всієї функціональності Stage 2.

**Функціональність:**

- Об'єднує всі функціональні хуки
- Управляє навігацією між етапами
- Обчислює стан завершеності етапу
- Автоматична валідація при змінах
- Логування для дебагу

**API:**

```typescript
const {
  // Завантаження філій
  branches,
  isLoadingBranches,
  branchLoadError,
  refreshBranches,

  // Пошук філій
  searchTerm,
  searchResults,
  isSearching,
  searchError,
  hasSearched,
  setSearchTerm,
  performSearch,
  clearSearch,

  // Вибір філії
  selectedBranch,
  isValidSelection,
  validationError,
  selectBranch,
  clearSelection,

  // Навігація
  canProceedToNext, // boolean - можливість переходу далі
  proceedToNext, // () => void
  goToPrevious, // () => void

  // Стан етапу
  isStageComplete, // boolean - чи завершений етап
  stageProgress, // number (0-100) - прогрес етапу
} = useBranchSelectionStage();
```

## Інтеграція з архітектурою

### Зв'язок з доменними сервісами

- **BranchService** - бізнес-логіка роботи з філіями
- Кешування, валідація, пошук
- Бізнес-правила для філій

### Зв'язок зі стором

- **useWizardStore** - збереження стану wizard
- Вибрана філія зберігається в `wizardState.selectedBranch`
- Помилки валідації в `wizardState.branchValidationError`

### Зв'язок з навігацією

- **useWizardNavigation** - управління переходами між етапами
- Автоматична перевірка можливості переходу
- Інтеграція з загальною логікою wizard

## Приклад використання

### В UI компоненті (FSD)

```typescript
// features/order-wizard/branch-selection/ui/BranchSelectionStep.tsx
'use client';

import { useBranchSelectionStage } from '@/domain/wizard/hooks';

export const BranchSelectionStep = () => {
  const {
    branches,
    isLoadingBranches,
    searchTerm,
    setSearchTerm,
    searchResults,
    selectedBranch,
    selectBranch,
    canProceedToNext,
    proceedToNext,
  } = useBranchSelectionStage();

  return (
    <div>
      {/* UI для пошуку та вибору філії */}
    </div>
  );
};
```

## Наступні кроки

1. **Тестування хуків** - unit тести для кожного хука
2. **Інтеграція з UI** - підключення до існуючих компонентів
3. **Оптимізація** - покращення продуктивності та UX
4. **Документація** - додаткові приклади використання
