# План переписування Order Wizard Stage1

## Архітектура "RHF + Zustand"

### Принципи:

1. **React Hook Form** - вся бізнес-логіка та дані для бекенду
2. **Zustand** - тільки UI стан та управління процесом
3. **Autosave** - автоматична синхронізація з бекендом
4. **Компоненти** - тільки UI, без бізнес-логіки

## Структура файлів

```
/features/order-wizard/stage1/
├── useOrderWizardStore.ts     // Zustand - UI стан
├── WizardProvider.tsx         // RHF Provider + головна логіка
├── autosave.ts               // Автозбереження через Orval
├── schemas.ts                // Zod схеми для валідації
├── steps/
│   ├── StepClient.tsx        // Вибір/створення клієнта
│   ├── StepOrderInfo.tsx     // Базова інформація замовлення
│   └── StepReview.tsx        // Підтвердження
├── components/
│   ├── ClientSearchForm.tsx  // Пошук клієнта
│   ├── ClientCreateForm.tsx  // Створення клієнта
│   └── OrderInfoForm.tsx     // Форма замовлення
└── WizardContainer.tsx       // Головний контейнер

/stores/
└── stage1-wizard.store.ts    // Zustand стор (буде замінено)
```

## Файли для створення:

### 1. useOrderWizardStore.ts

```typescript
// UI стан та управління процесом
interface OrderWizardState {
  currentStep: "client" | "orderInfo" | "review";
  isDirty: boolean;
  isLoading: boolean;
  autosaveError: string | null;
  sessionId: string | null;

  // Дії
  setCurrentStep: (step: OrderWizardState["currentStep"]) => void;
  setLoading: (loading: boolean) => void;
  setDirty: (dirty: boolean) => void;
  setAutosaveError: (error: string | null) => void;
  setSessionId: (sessionId: string) => void;
}
```

### 2. WizardProvider.tsx

```typescript
// RHF Provider з всією логікою даних
interface WizardFormData {
  client: {
    searchTerm: string;
    selectedClientId: string | null;
    newClient: NewClientData | null;
  };
  orderInfo: {
    branchId: string | null;
    receiptNumber: string | null;
    uniqueTag: string;
  };
}
```

### 3. autosave.ts

```typescript
// Автозбереження через Orval API
export const useAutosave = (formData: WizardFormData) => {
  // Логіка синхронізації з бекендом
  // Виклики stage1InitializeClientSearch, stage1SelectClient, etc.
};
```

### 4. Компоненти кроків

- **StepClient.tsx** - UI для пошуку/створення клієнта
- **StepOrderInfo.tsx** - UI для базової інформації
- **StepReview.tsx** - UI для підтвердження

## Переваги підходу:

1. **Централізовані дані** - все в RHF, немає дублювання
2. **Простіше автозбереження** - один хук для всіх даних
3. **Кращий контроль валідації** - Zod схеми в одному місці
4. **Менше конфліктів** зі Spring State Machine
5. **Легше тестування** - чіткі межі відповідальності

## Потенційні проблеми:

1. **Синхронізація sessionId** - потрібно правильно керувати
2. **Стан переходів** - не конфліктувати з State Machine
3. **Валідація** - переконатися що API виклики в правильному порядку

## План імплементації:

1. Створити Zustand стор для UI стану
2. Створити RHF Provider з Zod схемами
3. Імплементувати autosave хук
4. Переписати компоненти кроків
5. Інтегрувати з WizardContainer
6. Тестування та налагодження
