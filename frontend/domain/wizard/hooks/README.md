# Wizard Domain Hooks - Архітектура "DDD inside, FSD outside"

## Загальний огляд

Хуки wizard домену організовані за принципом **"один хук - одна відповідальність"** та структуровані відповідно до етапів Order Wizard. Кожен хук є "тонким" та делегує бізнес-логіку відповідним доменним сервісам.

## Архітектурні принципи

### 1. Розподіл відповідальності

```
React Hook ↔ Domain Service ↔ Adapter ↔ API Service ↔ Backend
```

- **React Hook** - тільки React стан та UI логіка
- **Domain Service** - бізнес-логіка, координація
- **Adapter** - перетворення типів, API інтеграція
- **Zod Schemas** - вся валідація форм та даних
- **API Service** - згенеровані OpenAPI клієнти

### 2. Структура за етапами

Хуки організовані відповідно до 5 етапів Order Wizard:

```
hooks/
├── shared/                    # Спільні хуки (навігація, стан, форми)
├── steps/
│   ├── client-selection/      # Етап 1: Клієнт та базова інформація ✅
│   ├── branch-selection/      # Етап 2: Вибір філії та ініціація
│   ├── item-management/       # Етап 3: Менеджер предметів (циклічний)
│   ├── order-parameters/      # Етап 4: Загальні параметри
│   └── order-completion/      # Етап 5: Підтвердження та завершення
└── index.ts                   # Публічне API
```

### 3. Типи хуків

#### Функціональні хуки

Відповідають за конкретну функціональність:

- `useClientSearch` - пошук клієнтів
- `useItemPricingCalculator` - розрахунок цін
- `useReceiptGeneration` - генерація квитанцій

#### Композиційні хуки

Об'єднують функціональність етапу:

- `useClientSelectionStep` - весь етап вибору клієнта
- `useItemManagementStep` - весь етап управління предметами

## Поточний стан реалізації

### ✅ Завершено

- **Етап 1**: Клієнт та базова інформація
  - `useClientSearch` - пошук клієнтів з пагінацією
  - `useClientForm` - створення нового клієнта
  - `useClientSelection` - вибір клієнта для замовлення

### 🔄 В розробці

- **Спільні хуки**: навігація, стан, форми

### 📋 Заплановано

- **Етап 2**: Вибір філії та ініціація замовлення
- **Етап 3**: Менеджер предметів (найскладніший)
- **Етап 4**: Загальні параметри замовлення
- **Етап 5**: Підтвердження та завершення

## Правила розробки хуків

### 1. Найменування файлів

```
use-[function-name].hook.ts
```

Приклади:

- `use-client-search.hook.ts`
- `use-item-pricing-calculator.hook.ts`
- `use-order-completion-step.hook.ts`

### 2. Структура хука

```typescript
export const useFeatureName = () => {
  // 1. React стан (тільки UI стан)
  const [isLoading, setIsLoading] = useState(false);

  // 2. Zustand стан (через селектори)
  const { data, actions } = useWizardStore(selector);

  // 3. Доменні сервіси (ін'єкція залежностей)
  const service = useMemo(() => new FeatureService(), []);

  // 4. Обробники подій (делегування сервісам)
  const handleAction = useCallback(
    async (params) => {
      setIsLoading(true);
      try {
        const result = await service.performAction(params);
        actions.updateState(result);
      } catch (error) {
        // Обробка помилок
      } finally {
        setIsLoading(false);
      }
    },
    [service, actions]
  );

  // 5. Повернення API хука
  return {
    // Стан
    isLoading,
    data,

    // Дії
    handleAction,

    // Утиліти
    canPerformAction: service.canPerformAction(data),
  };
};
```

### 3. Валідація

- **НЕ** робити валідацію в хуках
- Використовувати Zod схеми в формах
- Делегувати бізнес-валідацію сервісам

### 4. API виклики

- **НЕ** робити прямі API виклики в хуках
- Використовувати доменні сервіси
- Сервіси використовують адаптери для API

## Інтеграція з доменом

### Zustand Store

Кожен хук отримує доступ до глобального стану через селектори:

```typescript
const { selectedClient, setSelectedClient } = useWizardStore((state) => ({
  selectedClient: state.selectedClient,
  setSelectedClient: state.setSelectedClient,
}));
```

### Навігація

Всі хуки використовують `useWizardNavigation` для переходів між етапами:

```typescript
const { goToNextStep, goToPreviousStep, canProceed } = useWizardNavigation();
```

### Валідація

Хуки використовують готові Zod схеми:

```typescript
const { register, handleSubmit, formState } = useWizardForm({
  schema: clientSchema,
  defaultValues: initialData,
});
```

## Тестування

### Unit тести

Кожен хук має відповідні тести:

```
__tests__/
├── use-client-search.test.ts
├── use-client-form.test.ts
└── use-client-selection.test.ts
```

### Моки

- Доменні сервіси мокаються
- API адаптери мокаються
- Zustand стор мокається

## Приклади використання

### В UI компонентах

```typescript
// features/order-wizard/client-selection/ui/ClientSelectionStep.tsx
export const ClientSelectionStep = () => {
  const {
    searchTerm,
    results,
    isSearching,
    handleSearch
  } = useClientSearch();

  const {
    selectedClient,
    handleSelectClient
  } = useClientSelection();

  return (
    <div>
      {/* UI компоненти використовують тільки дані та обробники з хуків */}
    </div>
  );
};
```

### Композиція хуків

```typescript
// Композиційний хук для всього етапу
export const useClientSelectionStep = () => {
  const search = useClientSearch();
  const form = useClientForm();
  const selection = useClientSelection();

  return {
    search,
    form,
    selection,

    // Додаткова логіка координації
    canProceedToNextStep: selection.selectedClient !== null,
  };
};
```

## Майбутні покращення

1. **Автоматичне тестування** - генерація тестів на основі типів
2. **Документація API** - автоматична генерація документації
3. **Оптимізація продуктивності** - мемоізація та оптимізація ре-рендерів
4. **Типізація** - покращення типізації для кращого DX
