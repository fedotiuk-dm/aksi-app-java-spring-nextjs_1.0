# Feature-Sliced Design (FSD) Architecture

## Структура проекту

```
features/order-wizard/
├── wizard/           # Модуль для управління станом візарда Zustand
│   ├── types/
│   │   └── wizard.types.ts
│   ├── store/
│   │   ├── wizard.store.ts    # Основний стор для візарда
│   │   └── wizard.actions.ts  # Дії для візарда
│   ├── hooks/
│   │   ├── use-wizard-step.ts
│   │   └── use-wizard-navigation.ts
│   └── utils/
│       └── wizard.utils.ts
│
├── clients/          # Модуль клієнтів
│   ├── types/
│   │   └── client.types.ts
│   ├── hooks/
│   │   └── use-client-form.ts
│   └── schemas/
│       └── client.schema.ts
│
├── branches/        # Модуль філій
│   ├── types/
│   │   └── branch.types.ts
│   ├── hooks/
│   │   └── use-branch-form.ts
│   └── schemas/
│       └── branch.schema.ts
│
├── items/          # Модуль товарів
│   ├── types/
│   │   └── item.types.ts
│   ├── hooks/
│   │   └── use-item-form.ts
│   └── schemas/
│       └── item.schema.ts
│
├── price-calculator/ # Модуль калькулятора цін
│   ├── types/
│   │   └── price.types.ts
│   ├── hooks/
│   │   └── use-price-calculator.ts
│   └── schemas/
│       └── price.schema.ts
│
├── orders/        # Модуль замовлень
│   ├── types/
│   │   └── order.types.ts
│   ├── hooks/
│   │   └── use-order-form.ts
│   └── schemas/
│       └── order.schema.ts
│
├── ui/           # UI компоненти
│   ├── steps/    # Кроки візарда
│   │   ├── step1-client-selection/
│   │   ├── step2-branch-selection/
│   │   ├── step3-items-selection/
│   │   ├── step4-price-calculation/
│   │   └── step5-order-confirmation/
│   └── shared/   # Спільні UI компоненти
│
└── shared/       # Спільні утиліти для візарда
    ├── types/
    │   └── common.types.ts
    ├── hooks/
    │   └── use-debounce.ts
    └── utils/
        └── formatters.ts

```


# План реалізації OrderWizard

## 1. Модуль Wizard (Управління станом візарда)
- [x] Типи для кроків та стану
- [x] Zustand стор для управління станом
- [x] Хуки для навігації між кроками
- [x] Валідація кроків
- [x] Збереження даних кроків

## 2. Модуль Clients (Клієнти)
- [ ] Типи для клієнтів
- [ ] Zod схеми для валідації
- [ ] Хуки для роботи з API:
  - [ ] useClientForm - форма створення/редагування
  - [ ] useClientSearch - пошук клієнтів
  - [ ] useClientList - список клієнтів
- [ ] Утиліти для обробки даних

## 3. Модуль Branches (Філії)
- [ ] Типи для філій
- [ ] Zod схеми для валідації
- [ ] Хуки для роботи з API:
  - [ ] useBranchForm - форма створення/редагування
  - [ ] useBranchList - список філій
- [ ] Утиліти для обробки даних

## 4. Модуль Items (Товари)
- [ ] Типи для товарів
- [ ] Zod схеми для валідації
- [ ] Хуки для роботи з API:
  - [ ] useItemForm - форма створення/редагування
  - [ ] useItemSearch - пошук товарів
  - [ ] useItemList - список товарів
- [ ] Утиліти для обробки даних

## 5. Модуль PriceCalculator (Калькулятор цін)
- [ ] Типи для розрахунків
- [ ] Zod схеми для валідації
- [ ] Хуки для роботи з API:
  - [ ] usePriceCalculator - розрахунок цін
  - [ ] usePriceHistory - історія розрахунків
- [ ] Утиліти для обробки даних

## 6. Модуль Orders (Замовлення)
- [ ] Типи для замовлень
- [ ] Zod схеми для валідації
- [ ] Хуки для роботи з API:
  - [ ] useOrderForm - форма створення замовлення
  - [ ] useOrderList - список замовлень
- [ ] Утиліти для обробки даних

## 7. UI Компоненти
### 7.1 Кроки візарда
- [ ] Step1: Вибір клієнта
  - [ ] ClientSearch компонент
  - [ ] ClientForm компонент
  - [ ] ClientList компонент
- [ ] Step2: Вибір філії
  - [ ] BranchList компонент
  - [ ] BranchForm компонент
- [ ] Step3: Вибір товарів
  - [ ] ItemSearch компонент
  - [ ] ItemList компонент
  - [ ] ItemForm компонент
- [ ] Step4: Розрахунок цін
  - [ ] PriceCalculator компонент
  - [ ] PriceHistory компонент
- [ ] Step5: Підтвердження замовлення
  - [ ] OrderSummary компонент
  - [ ] OrderConfirmation компонент

### 7.2 Спільні UI компоненти
- [ ] StepHeader
- [ ] StepFooter
- [ ] ProgressBar
- [ ] NavigationButtons
- [ ] ErrorBoundary
- [ ] LoadingSpinner

## 8. Спільні утиліти
- [ ] Типи
- [ ] Хуки
- [ ] Утиліти для форматування
- [ ] Константи

## 9. Тести
- [ ] Unit тести для хуків
- [ ] Unit тести для утиліт
- [ ] Інтеграційні тести для компонентів
- [ ] E2E тести для візарда

## 10. Документація
- [ ] Опис архітектури
- [ ] Опис API
- [ ] Інструкції по використанню
- [ ] Приклади використання

## 11. Оптимізація
- [ ] Мемоізація компонентів
- [ ] Оптимізація ререндерів
- [ ] Оптимізація завантаження даних
- [ ] Кешування даних

## 12. Безпека
- [ ] Валідація даних
- [ ] Обробка помилок
- [ ] Захист від XSS
- [ ] Захист від CSRF

## 13. Доступність
- [ ] ARIA атрибути
- [ ] Клавіатурна навігація
- [ ] Підтримка скрінрідерів
- [ ] Контрастність кольорів

## 14. Локалізація
- [ ] Підтримка i18n
- [ ] Формати дат
- [ ] Формати чисел
- [ ] Формати валют

## 15. Моніторинг
- [ ] Логування помилок
- [ ] Аналітика
- [ ] Метрики продуктивності
- [ ] Трейсинг



## Опис модулів

### API Layer

API шар відповідає за взаємодію з бекендом та містить бізнес-логіку. Кожен модуль має свою структуру:

#### Types

- `*.types.ts` - TypeScript інтерфейси та типи
- `*.schema.ts` - Zod схеми для валідації

#### Hooks

- `use-*-list.ts` - Хуки для отримання списків
- `use-*-search.ts` - Хуки для пошуку
- `use-*-form.ts` - Хуки для роботи з формами
- `use-*-mutations.ts` - Хуки для мутірований (create, update, delete)

#### Store

- `*.store.ts` - Zustand store для управління станом модуля

#### Utils

- `*.mappers.ts` - Функції для маппінгу даних між API та моделлю

### Model Layer

Шар моделей містить бізнес-моделі та константи:

#### Types

- Базові інтерфейси та типи для всіх модулів
- Перерахування та константи

#### Constants

- Константи для кожного модуля
- Налаштування та конфігурації

### UI Layer

UI шар містить компоненти користувацького інтерфейсу:

#### Steps

- Компоненти для кожного кроку візарда
- Форми та інтерактивні елементи

#### Shared

- Перевикористовувані UI компоненти
- Спільні стилі та теми

### Shared Layer

Спільний шар містить утиліти та хуки, які використовуються в різних модулях:

#### Hooks

- `useDebounce` - Хук для дебаунсингу
- `useLocalStorage` - Хук для роботи з локальним сховищем

#### Utils

- `date.utils.ts` - Утиліти для роботи з датами (dayjs)
- `validation.utils.ts` - Додаткові утиліти валідації

#### Constants

- Спільні константи та налаштування

## Принципи розробки

### 1. Типізація

- Використовуємо TypeScript для статичної типізації
- Zod для валідації та типізації форм
- Строга типізація для всіх API відповідей

### 2. Управління станом

- Zustand для глобального стану
- React Query для кешування та синхронізації з API
- Локальний стан через useState/useReducer

### 3. Валідація

- Zod схеми для валідації форм
- Валідація на рівні API
- Обробка помилок та відображення повідомлень

### 4. Компоненти

- Атомарний дизайн компонентів
- Перевикористання компонентів
- Адаптивний дизайн з MUI

### 5. Тестування

- Unit тести для утиліт та хуків
- Інтеграційні тести для форм
- E2E тести для критичних шляхів

## Приклади використання

### Створення нового модуля

1. Створіть структуру папок:

```bash
mkdir -p api/new-module/{types,hooks,store,utils}
```

2. Створіть базові файли:

```typescript
// types/new-module.types.ts
export interface NewModule {
  id: string;
  name: string;
}

// types/new-module.schema.ts
import { z } from 'zod';

export const newModuleSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
});

// store/new-module.store.ts
import { create } from 'zustand';

interface NewModuleStore {
  items: NewModule[];
  setItems: (items: NewModule[]) => void;
}

export const useNewModuleStore = create<NewModuleStore>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
}));
```

### Використання в компоненті

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newModuleSchema } from './types/new-module.schema';
import { useNewModuleStore } from './store/new-module.store';

export const NewModuleForm = () => {
  const { setItems } = useNewModuleStore();

  const form = useForm({
    resolver: zodResolver(newModuleSchema),
  });

  const onSubmit = async (data: z.infer<typeof newModuleSchema>) => {
    // Обробка даних
  };

  return <form onSubmit={form.handleSubmit(onSubmit)}>{/* Форма */}</form>;
};
```

## Рекомендації

1. **Типи та схеми**

   - Завжди визначайте типи перед реалізацією
   - Використовуйте Zod для валідації
   - Експортуйте типи з model/types

2. **Хуки**

   - Розділяйте логіку на маленькі хуки
   - Використовуйте React Query для API запитів
   - Обробляйте помилки та завантаження

3. **Store**

   - Зберігайте тільки необхідний стан
   - Використовуйте селектори для оптимізації
   - Розділяйте логіку на маленькі стори

4. **Компоненти**

   - Дотримуйтесь атомарного дизайну
   - Використовуйте MUI компоненти
   - Пишіть тести для компонентів

5. **Утиліти**
   - Створюйте перевикористовувані утиліти
   - Документуйте функції
   - Пишіть тести для утиліт
