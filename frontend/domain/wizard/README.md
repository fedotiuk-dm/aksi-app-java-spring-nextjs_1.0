# Wizard Domain - XState v5 Integration

## Архітектура "DDD inside, FSD outside"

### Принципи інтеграції:

- **XState v5**: Тільки навігація між станами (мінімальний context)
- **Zustand**: Бізнес-стан (клієнти, замовлення, предмети)
- **Zod**: Валідація через domain hooks
- **TanStack Query**: API запити через domain hooks

## Структура

```
wizard/
├── machines/                    # XState v5 (тільки навігація)
│   ├── wizard-machine.ts       # Мінімальна машина
│   ├── machine-types.ts        # Типи для навігації
│   └── index.ts               # Експорт
├── hooks/                      # Domain hooks
│   └── use-wizard-machine.hook.ts  # Hook для машини
└── index.ts                   # Публічне API
```

## Приклад використання

### 1. Базове використання XState машини:

```tsx
'use client';

import { useWizardMachine } from '@/domains/wizard';

export const WizardComponent = () => {
  const {
    currentStep,
    currentSubStep,
    canGoNext,
    canGoPrev,
    isInItemWizard,
    progress,
    goNext,
    goPrev,
    startItemWizard,
    completeItemWizard,
  } = useWizardMachine();

  return (
    <div>
      <h2>Wizard Step: {currentStep}</h2>
      <div>Progress: {progress.percentComplete}%</div>

      {currentStep === 'itemManager' && !isInItemWizard && (
        <button onClick={startItemWizard}>Add Item</button>
      )}

      <div>
        <button onClick={goPrev} disabled={!canGoPrev}>
          Previous
        </button>
        <button onClick={goNext} disabled={!canGoNext}>
          Next
        </button>
      </div>
    </div>
  );
};
```

### 2. Інтеграція з domain hooks (майбутнє):

```tsx
'use client';

import {
  useWizardMachine,
  // Майбутні domain hooks:
  // useClientStore,
  // useOrderStore,
  // useItemStore,
  // useWizardValidation,
} from '@/domains/wizard';

export const FullWizardComponent = () => {
  // XState навігація
  const machine = useWizardMachine();

  // Domain logic (будуть створені пізніше)
  // const clientStore = useClientStore();
  // const validation = useWizardValidation();

  // Інтеграція XState + Domain
  const canProceed = machine.canGoNext; // && validation.isCurrentStepValid;

  return (
    <div>
      <h2>Step: {machine.currentStep}</h2>

      {/* Бізнес-логіка буде в domain hooks */}
      {machine.currentStep === 'clientSelection' && <div>Client Selection UI</div>}

      {machine.currentStep === 'itemManager' && machine.isInItemWizard && (
        <div>Item Step: {machine.currentSubStep}</div>
      )}

      <button onClick={machine.goNext} disabled={!canProceed}>
        Next
      </button>
    </div>
  );
};
```

## SOLID Принципи

### Single Responsibility Principle (SRP)

- `wizard-machine.ts`: Тільки навігація між станами
- `machine-types.ts`: Тільки типи для XState
- `use-wizard-machine.hook.ts`: Тільки hook для машини

### Open/Closed Principle (OCP)

- Можна додавати нові стани без зміни існуючих
- Можна розширювати domain hooks без зміни XState

### Dependency Inversion Principle (DIP)

- XState не залежить від конкретних domain implementations
- Domain hooks можуть змінюватися незалежно від XState

## Наступні кроки

1. Створити domain stores (Zustand)
2. Додати Zod валідацію через domain hooks
3. Інтегрувати TanStack Query для API
4. Створити композиційний hook, який об'єднує XState + domain logic
