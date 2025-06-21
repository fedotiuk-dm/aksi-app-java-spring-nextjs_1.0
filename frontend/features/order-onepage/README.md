# Order Onepage - Одностороннкова система замовлень

## Опис

Компактна одностороннкова система для створення замовлень хімчистки, що замінює складний 11-крокований Order Wizard. Система організована у три основні блоки на одній сторінці.

## Архітектура

### Структура блоків

```
┌─────────────────────────────────────────────────────────────────┐
│                    Order Onepage Container                     │
├─────────────────┬─────────────────────────┬─────────────────────┤
│   Left Block    │      Center Block       │    Right Block      │
│     (30%)       │        (50%)            │       (20%)         │
│                 │                         │                     │
│ Client Section  │   Items Section         │  Summary Section    │
│ - Search        │   - Items Table         │  - Order Parameters │
│ - Create        │   - Item Dialog         │  - Financial Summary│
│ - Selected Info │   - Price Calculator    │  - Order Completion │
│ - Basic Info    │                         │                     │
└─────────────────┴─────────────────────────┴─────────────────────┘
```

### Технологічний стек

- **Framework**: Next.js 15.3.0 (App Router)
- **Language**: TypeScript 5
- **UI Library**: Material UI 7.0.2
- **State Management**: Zustand 5.0.3
- **API Integration**: Orval-generated hooks + React Query 5.72.2
- **Forms**: React Hook Form 7.55.0 + Zod 3.24.2
- **Date Handling**: Day.js 1.11.13

## Компоненти

### Left Block - Client Section

#### `ClientSection.tsx`

Головний контейнер для управління клієнтами.

#### `ClientSearchForm.tsx`

- Пошук клієнтів з debounce (300ms)
- Використовує `useStage1SearchClients`
- Автоматичне очищення результатів

#### `ClientCreateForm.tsx`

- Форма створення нового клієнта
- React Hook Form + Zod валідація
- Використовує `useStage1CreateClient`

#### `ClientSelectedInfo.tsx`

- Відображення інформації про обраного клієнта
- Можливість редагування

#### `OrderBasicInfoForm.tsx`

- Базова інформація замовлення
- Вибір філії, контактний метод

### Center Block - Items Section

#### `ItemsSection.tsx`

Головний контейнер для управління предметами.

#### `ItemsTable.tsx`

- Таблиця предметів замовлення
- Дії: додати, редагувати, видалити
- Використовує `useStage2GetCurrentManager`, `useStage2DeleteItemFromOrder`

#### `ItemDialog.tsx`

- 5-крокований діалог додавання/редагування предмета
- Stepper навігація між кроками

#### Steps (5 кроків):

1. **`ItemBasicInfoStep.tsx`** - Категорія, предмет, кількість
2. **`ItemCharacteristicsStep.tsx`** - Матеріал, колір, наповнювач, ступінь зношеності
3. **`ItemStainsDefectsStep.tsx`** - Плями та дефекти (checkboxes)
4. **`ItemPriceCalculationStep.tsx`** - Розрахунок ціни з модифікаторами
5. **`ItemPhotoStep.tsx`** - Фотодокументування (до 5 фото, 5MB)

#### `PriceCalculatorSummary.tsx`

- Реальний час розрахунку цін
- Accordion з деталями
- Підсумки по категоріях

### Right Block - Summary Section

#### `SummarySection.tsx`

Головний контейнер для підсумків та завершення.

#### `OrderParameters.tsx`

- Дата виконання (DatePicker)
- Терміновість (+50%/+100%)
- Знижки (Evercard/Social/Military)
- Використовує stage3 хуки

#### `FinancialSummary.tsx`

- Детальний фінансовий підсумок
- Використовує `useStage4GetOrderSummary`
- Accordion з розкладом по предметах
- Відображення знижок та надбавок

#### `OrderCompletion.tsx`

- Підпис клієнта (діалог)
- Прийняття умов
- Опції квитанції (email, друк)
- Фіналізація замовлення
- Використовує stage4 хуки

## Store (Zustand)

### `order-onepage.store.ts`

```typescript
interface OrderOnepageUIState {
  // Сесія та базова інформація
  sessionId: string | null;
  orderId: string | null;

  // Клієнт
  selectedClientId: string | null;
  showClientForm: boolean;

  // Предмети
  showItemDialog: boolean;
  editingItemId: string | null;

  // UI флаги
  isLoading: boolean;
  hasUnsavedChanges: boolean;
}
```

### Селектори

- `useIsItemDialogOpen()`
- `useIsAddingItem()`
- `useIsEditingItem()`
- `useHasSelectedClient()`
- `useCanProceed()`

## API Integration

### Orval-generated hooks

#### Stage 1 (Client Management)

- `useOrderWizardStart` - Початок сесії
- `useStage1SearchClients` - Пошук клієнтів
- `useStage1CreateClient` - Створення клієнта

#### Stage 2 (Items Management)

- `useStage2GetCurrentManager` - Отримання менеджера предметів
- `useStage2DeleteItemFromOrder` - Видалення предмета
- Substep hooks для кожного кроку діалогу

#### Stage 3 (Order Parameters)

- `useStage3SetExecutionDate` - Встановлення дати
- `useStage3SetUrgency` - Встановлення терміновості
- `useStage3SetDiscount` - Встановлення знижки

#### Stage 4 (Order Completion)

- `useStage4GetOrderSummary` - Детальний підсумок
- `useStage4UpdateLegalAcceptance` - Юридичне прийняття
- `useStage4SaveSignature` - Збереження підпису
- `useStage4FinalizeOrder` - Фіналізація замовлення
- `useStage4GenerateReceipt` - Генерація квитанції

## Особливості реалізації

### MUI7 Grid

- Використовується `size` prop замість deprecated `xs`, `sm`, `md`, `lg`, `xl`
- Пропорції: 4-5-3 (30%-50%-20%)

### Form Validation

- React Hook Form + Zod для всіх форм
- Реальний час валідації
- Користувацькі повідомлення про помилки

### Error Handling

- Graceful degradation при помилках API
- Loading states для всіх асинхронних операцій
- User-friendly повідомлення про помилки

### Performance

- Debounced search (300ms)
- Lazy loading компонентів
- Оптимізовані re-renders через Zustand селектори

## Використання

### Запуск сторінки

```
/order-onepage
```

### Типовий workflow

1. Пошук або створення клієнта
2. Заповнення базової інформації замовлення
3. Додавання предметів через 5-крокований діалог
4. Встановлення параметрів замовлення
5. Перегляд фінансового підсумку
6. Завершення замовлення з підписом

## Майбутні покращення

- [ ] Canvas для цифрового підпису
- [ ] Drag & drop для фото
- [ ] Offline support
- [ ] Print preview для квитанції
- [ ] Bulk operations для предметів
- [ ] Advanced search filters
- [ ] Order templates
- [ ] Mobile responsive improvements
