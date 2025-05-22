# Детальний план реалізації Order Wizard

## Структура папок та файлів

Нижче наведена рекомендована структура папок та файлів для реалізації Order Wizard відповідно до всіх етапів та підетапів, описаних у документації:

```
features/order-wizard/
├── wizard/                  # Модуль для управління станом візарда
│   ├── model/
│   │   ├── navigation/      # Стор для навігації між кроками
│   │   ├── validation/      # Стор для валідації кроків
│   │   └── index.ts         # Композиційний експорт всіх сторів
│   ├── hooks/
│   ├── types/
│   ├── schemas/             # Zod схеми для валідації
│   ├── utils/
│   └── index.ts
│
├── client-selection/        # Етап 1.1: Вибір або створення клієнта
│   ├── model/
│   ├── hooks/
│   ├── schemas/             # Zod схеми для валідації
│   ├── ui/
│   └── index.ts
│
├── branch-selection/        # Етап 1.2: Вибір пункту прийому (філії)
│   ├── model/
│   ├── hooks/
│   ├── schemas/             # Zod схеми для валідації
│   ├── ui/
│   └── index.ts
│
├── basic-info/             # Етап 1.3: Базова інформація замовлення
│   ├── model/
│   ├── hooks/
│   ├── schemas/             # Zod схеми для валідації
│   ├── ui/
│   └── index.ts
│
├── item-manager/           # Етап 2.0: Менеджер предметів
│   ├── model/
│   ├── hooks/
│   ├── schemas/             # Zod схеми для валідації
│   ├── ui/
│   └── index.ts
│
├── item-wizard/            # Етап 2.1-2.5: Підетапи додавання предмета
│   ├── model/
│   ├── hooks/
│   ├── schemas/             # Zod схеми для валідації
│   ├── ui/
│   ├── basic-info/         # Підетап 2.1: Основна інформація про предмет
│   │   ├── schemas/        # Zod схеми для валідації
│   ├── item-properties/    # Підетап 2.2: Характеристики предмета
│   │   ├── schemas/        # Zod схеми для валідації
│   ├── defects-stains/     # Підетап 2.3: Забруднення, дефекти та ризики
│   │   ├── schemas/        # Zod схеми для валідації
│   ├── price-calculator/   # Підетап 2.4: Знижки та надбавки (калькулятор ціни)
│   │   ├── schemas/        # Zod схеми для валідації
│   ├── photo-documentation/ # Підетап 2.5: Фотодокументація
│   │   ├── schemas/        # Zod схеми для валідації
│   └── index.ts
│
├── order-parameters/       # Етап 3: Загальні параметри замовлення
│   ├── model/
│   ├── hooks/
│   ├── schemas/             # Zod схеми для валідації
│   ├── ui/
│   └── index.ts
│
├── order-confirmation/     # Етап 4: Підтвердження та завершення
│   ├── model/
│   ├── hooks/
│   ├── schemas/             # Zod схеми для валідації
│   ├── ui/
│   └── index.ts
│
├── shared/                  # Спільні компоненти та утиліти
│   ├── ui/
│   ├── hooks/
│   ├── schemas/             # Спільні Zod схеми для валідації
│   ├── utils/
│   └── index.ts
│
└── index.ts                 # Головний експорт модуля
```

## Детальний план реалізації

### Загальні принципи реалізації

На основі успішно реалізованого модуля `client-selection`, рекомендуємо дотримуватись наступних принципів для всіх інших модулів:

1. **Структура на основі Feature-Sliced Design**:

   - Чітке розділення на `model`, `hooks`, `ui`, `utils`, `schemas`
   - Кожен модуль відповідає за окремий крок або підкрок візарда

2. **Керування станом через Zustand**:

   - Розділення на спеціалізовані слайси (наприклад, `client-search.slice.ts`, `client-selection.slice.ts`)
   - Використання типізованої фабрики слайсів для уніфікації підходу
   - Композиція слайсів для створення повноцінного стору

3. **Валідація даних через Zod**:

   - Окремі схеми для кожного типу даних (наприклад, `client.schema.ts`)
   - Інтеграція з React Hook Form для валідації форм
   - Типізація на основі Zod схем для узгодженості типів

4. **Розділення хуків за функціональністю**:
   - Окремі хуки для роботи з формами, API, станом
   - Композиційні хуки для об'єднання функціональності
   - Інкапсуляція бізнес-логіки в хуках

### Реалізація модулів

#### 1. Client Selection (Реалізовано)

Модуль успішно реалізовано з використанням наступної структури:

```
client-selection/
├── model/
│   ├── store/
│   │   ├── actions/
│   │   │   ├── integration.ts
│   │   │   └── validation.ts
│   │   ├── slices/
│   │   │   ├── client-search.slice.ts
│   │   │   ├── client-selection.slice.ts
│   │   │   ├── client-creation.slice.ts
│   │   │   ├── client-editing.slice.ts
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── slice-factory.ts
│   │   │   └── store-utils.ts
│   │   ├── core.ts
│   │   ├── main-store.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── action-types.ts
│   │   ├── api-utils.ts
│   │   ├── common-types.ts
│   │   ├── form-types.ts
│   │   ├── slice-types.ts
│   │   ├── state-types.ts
│   │   └── index.ts
│   ├── client-sources.ts
│   ├── constants.ts
│   ├── store.ts
│   ├── types.ts
│   └── index.ts
├── hooks/
│   ├── use-client-form.ts
│   ├── use-client-form-field-processor.ts
│   ├── use-client-form-handler.ts
│   ├── use-client-form-initialization.ts
│   ├── use-client-form-store.ts
│   ├── use-client-form-types.ts
│   ├── use-client-form-validation.ts
│   ├── use-client-mutations.ts
│   ├── use-client-search.ts
│   ├── use-client-selection.ts
│   ├── use-debounce-search.ts
│   └── index.ts
├── schemas/
│   ├── client.schema.ts
│   └── index.ts
├── ui/
│   ├── ClientForm.tsx
│   ├── ClientList.tsx
│   ├── ClientSearchForm.tsx
│   ├── ClientSelectionStep.tsx
│   └── index.ts
├── utils/
│   ├── validation-utils.ts
│   └── index.ts
└── index.ts
```

#### 2. Branch Selection

Модуль для вибору філії повинен реалізовуватись за тим же шаблоном:

```
branch-selection/
├── model/
│   ├── store/
│   │   ├── slices/
│   │   │   ├── branch-list.slice.ts
│   │   │   ├── branch-selection.slice.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── constants.ts
│   └── index.ts
├── hooks/
│   ├── use-branch-list.ts
│   ├── use-branch-selection.ts
│   └── index.ts
├── schemas/
│   ├── branch.schema.ts
│   └── index.ts
├── ui/
│   ├── BranchSelectionStep.tsx
│   ├── BranchList.tsx
│   ├── BranchMap.tsx
│   └── index.ts
├── utils/
│   └── index.ts
└── index.ts
```

**Основні компоненти**:

- `BranchSelectionStep.tsx` - головний компонент кроку
- `BranchList.tsx` - список філій з можливістю вибору
- `BranchMap.tsx` - опціональний компонент для відображення філій на карті

**Ключові слайси**:

- `branch-list.slice.ts` - завантаження та фільтрація списку філій
- `branch-selection.slice.ts` - вибір філії та її інтеграція з візардом

#### 3. Basic Info

Модуль для введення базової інформації замовлення:

```
basic-info/
├── model/
│   ├── store/
│   │   ├── slices/
│   │   │   ├── receipt-number.slice.ts
│   │   │   ├── unique-tag.slice.ts
│   │   │   ├── dates.slice.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── constants.ts
│   └── index.ts
├── hooks/
│   ├── use-receipt-generator.ts
│   ├── use-tag-validator.ts
│   ├── use-basic-info.ts
│   └── index.ts
├── schemas/
│   ├── basic-info.schema.ts
│   └── index.ts
├── ui/
│   ├── BasicInfoStep.tsx
│   ├── ReceiptNumberField.tsx
│   ├── UniqueTagField.tsx
│   ├── DatePicker.tsx
│   └── index.ts
├── utils/
│   ├── receipt-utils.ts
│   └── index.ts
└── index.ts
```

**Основні компоненти**:

- `BasicInfoStep.tsx` - головний компонент кроку
- `ReceiptNumberField.tsx` - поле для номера квитанції з генерацією
- `UniqueTagField.tsx` - поле для унікальної мітки з валідацією
- `DatePicker.tsx` - вибір дати з перевіркою робочих днів

**Ключові слайси**:

- `receipt-number.slice.ts` - генерація та валідація номера квитанції
- `unique-tag.slice.ts` - управління унікальною міткою
- `dates.slice.ts` - управління датами створення/виконання

#### 4. Item Manager

Модуль для управління списком предметів:

```
item-manager/
├── model/
│   ├── store/
│   │   ├── slices/
│   │   │   ├── items-list.slice.ts
│   │   │   ├── item-selection.slice.ts
│   │   │   ├── total-calculation.slice.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── constants.ts
│   └── index.ts
├── hooks/
│   ├── use-items-list.ts
│   ├── use-item-editor.ts
│   ├── use-total-calculation.ts
│   └── index.ts
├── schemas/
│   ├── item.schema.ts
│   └── index.ts
├── ui/
│   ├── ItemManagerStep.tsx
│   ├── ItemsList.tsx
│   ├── ItemCard.tsx
│   ├── AddItemButton.tsx
│   ├── TotalSummary.tsx
│   └── index.ts
├── utils/
│   ├── item-utils.ts
│   └── index.ts
└── index.ts
```

**Основні компоненти**:

- `ItemManagerStep.tsx` - головний компонент кроку
- `ItemsList.tsx` - список доданих предметів
- `ItemCard.tsx` - картка предмета з основною інформацією
- `AddItemButton.tsx` - кнопка для додавання нового предмета
- `TotalSummary.tsx` - підсумок замовлення з розрахунком

**Ключові слайси**:

- `items-list.slice.ts` - управління списком предметів
- `item-selection.slice.ts` - вибір предмета для редагування
- `total-calculation.slice.ts` - розрахунок загальної вартості

#### 5. Item Wizard

Модуль для додавання/редагування предмета, включає кілька підмодулів:

```
item-wizard/
├── model/
│   ├── store/
│   │   ├── slices/
│   │   │   ├── item-wizard-navigation.slice.ts
│   │   │   ├── item-data.slice.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── constants.ts
│   └── index.ts
├── hooks/
│   ├── use-item-wizard.ts
│   ├── use-item-wizard-navigation.ts
│   └── index.ts
├── basic-info/
│   ├── model/
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── hooks/
│   │   ├── use-category-selection.ts
│   │   ├── use-item-name-selection.ts
│   │   └── index.ts
│   ├── schemas/
│   │   ├── basic-info.schema.ts
│   │   └── index.ts
│   ├── ui/
│   │   ├── BasicInfoStep.tsx
│   │   ├── CategorySelector.tsx
│   │   ├── ItemNameSelector.tsx
│   │   ├── QuantityInput.tsx
│   │   └── index.ts
│   └── index.ts
├── item-properties/
│   ├── model/
│   │   └── index.ts
│   ├── hooks/
│   │   ├── use-material-selection.ts
│   │   ├── use-color-selection.ts
│   │   └── index.ts
│   ├── schemas/
│   │   ├── properties.schema.ts
│   │   └── index.ts
│   ├── ui/
│   │   ├── PropertiesStep.tsx
│   │   ├── MaterialSelector.tsx
│   │   ├── ColorSelector.tsx
│   │   ├── FillingSelector.tsx
│   │   └── index.ts
│   └── index.ts
├── defects-stains/
│   ├── model/
│   │   └── index.ts
│   ├── hooks/
│   │   ├── use-stains-selection.ts
│   │   ├── use-defects-selection.ts
│   │   └── index.ts
│   ├── schemas/
│   │   ├── defects.schema.ts
│   │   └── index.ts
│   ├── ui/
│   │   ├── DefectsStainsStep.tsx
│   │   ├── StainsSelector.tsx
│   │   ├── DefectsSelector.tsx
│   │   ├── NotesInput.tsx
│   │   └── index.ts
│   └── index.ts
├── price-calculator/
│   ├── model/
│   │   ├── calculator/
│   │   │   ├── price-rules.ts
│   │   │   ├── calculator-engine.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── hooks/
│   │   ├── use-price-calculation.ts
│   │   ├── use-modifiers-selection.ts
│   │   └── index.ts
│   ├── schemas/
│   │   ├── calculator.schema.ts
│   │   └── index.ts
│   ├── ui/
│   │   ├── PriceCalculatorStep.tsx
│   │   ├── ModifiersList.tsx
│   │   ├── PriceBreakdown.tsx
│   │   └── index.ts
│   └── index.ts
├── photo-documentation/
│   ├── model/
│   │   └── index.ts
│   ├── hooks/
│   │   ├── use-photo-upload.ts
│   │   ├── use-camera.ts
│   │   └── index.ts
│   ├── schemas/
│   │   ├── photos.schema.ts
│   │   └── index.ts
│   ├── ui/
│   │   ├── PhotoDocumentationStep.tsx
│   │   ├── PhotoUploader.tsx
│   │   ├── CameraCapture.tsx
│   │   ├── PhotoGallery.tsx
│   │   └── index.ts
│   └── index.ts
├── ui/
│   ├── ItemWizardLayout.tsx
│   ├── WizardNavigation.tsx
│   └── index.ts
└── index.ts
```

**Особливості реалізації Item Wizard**:

1. **Централізований стор для даних предмета**:

   - `item-data.slice.ts` - єдине джерело правди для даних предмета
   - Всі підмодулі працюють з цим слайсом через API

2. **Навігація між підетапами**:

   - `item-wizard-navigation.slice.ts` - управління навігацією між підетапами
   - Валідація переходів між підетапами

3. **Спільний лейаут**:

   - `ItemWizardLayout.tsx` - спільний макет для всіх підетапів
   - `WizardNavigation.tsx` - кнопки навігації між підетапами

4. **Спеціалізація підмодулів**:
   - Кожен підмодуль відповідає за окремий аспект предмета
   - Модульна структура для простоти підтримки та розширення

#### 6. Модуль калькулятора цін

Особлива увага приділяється модулю `price-calculator`, який реалізує всю логіку розрахунку цін:

```
price-calculator/
├── model/
│   ├── calculator/
│   │   ├── price-rules.ts
│   │   ├── calculator-engine.ts
│   │   ├── detailed-calculation.ts
│   │   ├── modifiers-processor.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── calculation-result.types.ts
│   │   ├── modifiers.types.ts
│   │   ├── price-rules.types.ts
│   │   └── index.ts
│   └── index.ts
├── hooks/
│   ├── use-price-calculation.ts
│   ├── use-modifiers-selection.ts
│   ├── use-detailed-breakdown.ts
│   └── index.ts
├── schemas/
│   ├── calculator.schema.ts
│   ├── modifiers.schema.ts
│   ├── calculation-result.schema.ts
│   └── index.ts
├── ui/
│   ├── PriceCalculatorStep.tsx
│   ├── ModifiersList.tsx
│   ├── PriceBreakdown.tsx
│   ├── ModifierCard.tsx
│   └── index.ts
├── utils/
│   ├── price-formatting.ts
│   ├── calculator-utils.ts
│   └── index.ts
└── index.ts
```

**Основні компоненти калькулятора**:

1. **Ядро розрахунку**:

   - `calculator-engine.ts` - основний механізм розрахунку
   - `price-rules.ts` - правила ціноутворення
   - `modifiers-processor.ts` - обробка модифікаторів
   - `detailed-calculation.ts` - формування детального розрахунку

2. **Типи даних**:

   - `calculation-result.types.ts` - типи для результатів розрахунку
   - `modifiers.types.ts` - типи для модифікаторів
   - `price-rules.types.ts` - типи для правил ціноутворення

3. **Хуки**:

   - `use-price-calculation.ts` - головний хук для розрахунку ціни
   - `use-modifiers-selection.ts` - управління вибором модифікаторів
   - `use-detailed-breakdown.ts` - формування детальної розбивки розрахунку

4. **UI компоненти**:
   - `PriceCalculatorStep.tsx` - головний компонент кроку
   - `ModifiersList.tsx` - список доступних модифікаторів
   - `PriceBreakdown.tsx` - детальна розбивка розрахунку
   - `ModifierCard.tsx` - картка модифікатора з описом впливу на ціну

**Алгоритм розрахунку ціни**:

1. Отримання базової ціни з прайсу за категорією та найменуванням
2. Перевірка на спеціальні умови та модифікація базової ціни
3. Послідовне застосування відсоткових модифікаторів
4. Додавання фіксованих послуг
5. Застосування коефіцієнта терміновості
6. Формування детального протоколу розрахунку

#### 7. Order Parameters

Модуль для встановлення загальних параметрів замовлення:

```
order-parameters/
├── model/
│   ├── store/
│   │   ├── slices/
│   │   │   ├── execution-params.slice.ts
│   │   │   ├── discounts.slice.ts
│   │   │   ├── payment.slice.ts
│   │   │   ├── additional-info.slice.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── constants.ts
│   └── index.ts
├── hooks/
│   ├── use-execution-params.ts
│   ├── use-discounts.ts
│   ├── use-payment.ts
│   ├── use-additional-info.ts
│   └── index.ts
├── schemas/
│   ├── parameters.schema.ts
│   ├── discounts.schema.ts
│   ├── payment.schema.ts
│   └── index.ts
├── ui/
│   ├── OrderParametersStep.tsx
│   ├── ExecutionParams.tsx
│   ├── DiscountForm.tsx
│   ├── PaymentForm.tsx
│   ├── AdditionalInfoForm.tsx
│   └── index.ts
├── utils/
│   ├── date-utils.ts
│   ├── discount-utils.ts
│   └── index.ts
└── index.ts
```

**Основні компоненти**:

- `OrderParametersStep.tsx` - головний компонент кроку
- `ExecutionParams.tsx` - встановлення параметрів виконання
- `DiscountForm.tsx` - форма для вибору знижок
- `PaymentForm.tsx` - форма для оплати
- `AdditionalInfoForm.tsx` - форма для додаткової інформації

**Ключові слайси**:

- `execution-params.slice.ts` - управління параметрами виконання
- `discounts.slice.ts` - управління знижками
- `payment.slice.ts` - управління оплатою
- `additional-info.slice.ts` - управління додатковою інформацією

#### 8. Order Confirmation

Модуль для підтвердження та завершення замовлення:

```
order-confirmation/
├── model/
│   ├── store/
│   │   ├── slices/
│   │   │   ├── summary.slice.ts
│   │   │   ├── legal-aspects.slice.ts
│   │   │   ├── receipt.slice.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── constants.ts
│   └── index.ts
├── hooks/
│   ├── use-order-summary.ts
│   ├── use-digital-signature.ts
│   ├── use-receipt-generation.ts
│   └── index.ts
├── schemas/
│   ├── confirmation.schema.ts
│   ├── receipt.schema.ts
│   └── index.ts
├── ui/
│   ├── OrderConfirmationStep.tsx
│   ├── OrderSummary.tsx
│   ├── DigitalSignature.tsx
│   ├── ReceiptPreview.tsx
│   ├── LegalAgreement.tsx
│   └── index.ts
├── utils/
│   ├── receipt-generator.ts
│   ├── pdf-utils.ts
│   └── index.ts
└── index.ts
```

**Основні компоненти**:

- `OrderConfirmationStep.tsx` - головний компонент кроку
- `OrderSummary.tsx` - підсумок замовлення з детальною інформацією
- `DigitalSignature.tsx` - компонент для цифрового підпису
- `ReceiptPreview.tsx` - попередній перегляд квитанції
- `LegalAgreement.tsx` - юридична інформація та згода

**Ключові слайси**:

- `summary.slice.ts` - формування підсумку замовлення
- `legal-aspects.slice.ts` - управління юридичними аспектами
- `receipt.slice.ts` - генерація та управління квитанцією

#### 9. Shared

Модуль спільних компонентів та утиліт:

```
shared/
├── ui/
│   ├── StepLayout.tsx
│   ├── NavigationButtons.tsx
│   ├── ProgressBar.tsx
│   ├── ErrorBoundary.tsx
│   ├── FormCard.tsx
│   ├── LoadingOverlay.tsx
│   ├── InfoTooltip.tsx
│   └── index.ts
├── hooks/
│   ├── use-form-error.ts
│   ├── use-api-error.ts
│   ├── use-responsive.ts
│   ├── use-zod-form.ts
│   └── index.ts
├── schemas/
│   ├── common.schema.ts
│   ├── validation-utils.ts
│   └── index.ts
├── utils/
│   ├── validation.utils.ts
│   ├── price.utils.ts
│   ├── date.utils.ts
│   ├── formatters.utils.ts
│   ├── error.utils.ts
│   └── index.ts
├── services/
│   ├── price-calculation.service.ts
│   ├── receipt-generation.service.ts
│   ├── api.service.ts
│   └── index.ts
└── index.ts
```

### Сервіси та інтеграції

#### 1. Price Calculation Service

Централізований сервіс для розрахунку цін, який використовується в різних модулях:

```typescript
// shared/services/price-calculation.service.ts

export class PriceCalculationService {
  // Метод для розрахунку ціни окремого предмета
  calculateItemPrice(item: ItemData): DetailedItemCalculation {
    // Реалізація алгоритму розрахунку
  }

  // Метод для розрахунку загальної вартості замовлення
  calculateOrderPrice(order: OrderData): OrderPriceCalculation {
    // Реалізація алгоритму розрахунку
  }

  // Інші методи для роботи з цінами
}
```

#### 2. Receipt Generation Service

Сервіс для генерації та управління квитанціями:

```typescript
// shared/services/receipt-generation.service.ts

export class ReceiptGenerationService {
  // Метод для генерації PDF квитанції
  generateReceipt(order: OrderData): Promise<Blob> {
    // Реалізація генерації PDF
  }

  // Метод для надсилання квитанції по електронній пошті
  sendReceiptByEmail(email: string, receipt: Blob): Promise<void> {
    // Реалізація надсилання
  }

  // Інші методи для роботи з квитанціями
}
```

### Рекомендації щодо інтеграції модулів

1. **Забезпечення узгодженості даних**:

   - Використання спільних типів даних між модулями
   - Валідація даних на кожному етапі
   - Зберігання стану в локальному сховищі для відновлення сесії

2. **Оптимізація продуктивності**:

   - Мемоізація важких обчислень
   - Ледаче завантаження модулів
   - Оптимізація рендерингу з використанням memo, useMemo, useCallback

3. **Тестування**:
   - Модульні тести для кожного слайса та хука
   - Інтеграційні тести для перевірки взаємодії між модулями
   - E2E тести для перевірки повного процесу оформлення замовлення

### Висновок

Запропонована структура є розширенням успішної реалізації модуля `client-selection` на всі інші модулі OrderWizard. Вона забезпечує:

1. **Уніфікований підхід** до розробки всіх модулів
2. **Чітке розділення відповідальностей** відповідно до FSD
3. **Типобезпеку** завдяки TypeScript та Zod
4. **Масштабованість** для додавання нових функцій
5. **Поступову реалізацію** без необхідності відразу реалізовувати всі модулі

Ця структура повністю відповідає вимогам до OrderWizard, описаним у документації, і забезпечує необхідну гнучкість для реалізації складної логіки розрахунку цін та управління даними замовлення.

## Особливості реалізації циклічного процесу додавання предметів

Важливою особливістю OrderWizard є циклічний процес додавання предметів, коли після завершення підетапів item-wizard користувач повертається до item-manager для можливості додати ще один предмет. Для реалізації цієї логіки рекомендується:

1. **У навігаційному сторі** додати спеціальну логіку для циклічного повернення
2. **У хуку use-item-wizard.ts** додати метод для завершення додавання предмета
3. **У компоненті PhotoDocumentationStep.tsx** (останній підетап) додати кнопку для завершення

## Особливості реалізації розрахунку цін

Для реалізації складної логіки розрахунку цін, описаної в документації, рекомендується:

1. **Створити окремий сервіс для розрахунків** в папці `shared/services/price-calculation.service.ts`
2. **Використовувати цей сервіс у хуку use-price-calculation.ts**
3. **Реалізувати детальну деталізацію розрахунку** для відображення користувачу

## Особливості реалізації Zod схем

### Загальні принципи роботи з Zod

1. **Визначення схем на початку розробки**

   - Схеми Zod повинні бути визначені на початку розробки кожного модуля
   - Схеми повинні відповідати типам даних, визначеним у TypeScript
   - Схеми повинні включати всі необхідні валідаційні правила

2. **Структура схем**

   - Кожна схема повинна бути розділена на логічні частини
   - Для кожного типу даних повинна бути окрема схема
   - Схеми повинні бути композиційними для повторного використання

3. **Інтеграція з React Hook Form**

   - Використовувати хук `useZodForm` для інтеграції Zod з React Hook Form
   - Передавати схеми в хук для автоматичної валідації форм
   - Використовувати результати валідації для відображення помилок

4. **Обробка помилок валідації**
   - Створити утиліти для обробки помилок валідації
   - Перетворювати помилки Zod в зрозумілі повідомлення для користувача
   - Групувати помилки за полями форми

### Приклади використання Zod для різних типів даних

1. **Прості типи даних**

   - Числа: перевірка діапазону, цілі/дробові, позитивні/негативні
   - Рядки: перевірка довжини, формату, регулярних виразів
   - Булеві: перевірка обов'язковості

2. **Складні типи даних**

   - Об'єкти: перевірка структури, обов'язкових полів
   - Масиви: перевірка довжини, елементів
   - Enum: перевірка допустимих значень

3. **Спеціальні типи даних**
   - Дати: перевірка діапазону, формату
   - Email: перевірка формату
   - Телефон: перевірка формату
   - URL: перевірка формату

### Інтеграція Zod з API

1. **Валідація запитів**

   - Перевірка даних перед відправкою на сервер
   - Перетворення даних у формат, очікуваний сервером

2. **Валідація відповідей**

   - Перевірка даних, отриманих від сервера
   - Перетворення даних у формат, очікуваний клієнтом

3. **Обробка помилок API**
   - Перевірка помилок, отриманих від сервера
   - Перетворення помилок у зрозумілі повідомлення для користувача

## Рекомендації щодо структури UI

### 1. Атомарний дизайн компонентів

Рекомендується організувати UI компоненти за принципом атомарного дизайну:

```
features/order-wizard/
├── ui/
│   ├── atoms/         # Базові компоненти
│   ├── molecules/     # Складні компоненти
│   ├── organisms/     # Композиції компонентів
│   ├── templates/     # Шаблони сторінок
│   └── pages/         # Сторінки
```

### 2. Розділення UI за кроками

Кожен крок візарда повинен мати свою папку з UI компонентами, що відповідає вашій поточній структурі:

```
frontend/features/order-wizard/ui/steps
frontend/features/order-wizard/ui/steps/step1-client-selection
frontend/features/order-wizard/ui/steps/step2-branch-selection
frontend/features/order-wizard/ui/steps/step3-basic-info
frontend/features/order-wizard/ui/steps/step4-item-manager
frontend/features/order-wizard/ui/steps/step5-item-wizard
frontend/features/order-wizard/ui/steps/step5-item-wizard/components
frontend/features/order-wizard/ui/steps/step5-item-wizard/substep1-basic-info
frontend/features/order-wizard/ui/steps/step5-item-wizard/substep2-item-properties
frontend/features/order-wizard/ui/steps/step5-item-wizard/substep3-defects-stains
frontend/features/order-wizard/ui/steps/step5-item-wizard/substep4-price-calculator
frontend/features/order-wizard/ui/steps/step5-item-wizard/substep5-photo-documentation
frontend/features/order-wizard/ui/steps/step6-order-parameters
frontend/features/order-wizard/ui/steps/step7-order-confirmation
```

### 3. Спільні компоненти

Спільні компоненти, які використовуються в різних кроках, повинні бути винесені в окрему папку:

```
features/order-wizard/
├── shared/
│   ├── ui/
│   │   ├── StepLayout.tsx
│   │   ├── NavigationButtons.tsx
│   │   ├── ProgressBar.tsx
│   │   └── ErrorBoundary.tsx
│   └── ...
```

## Загальні рекомендації для реалізації

1. **Розділення сторів за доменами**

   - Кожен крок візарда повинен мати свій стор
   - Стори повинні бути незалежними один від одного
   - Використовуйте композиційний хук для об'єднання сторів

2. **Типізація та валідація**

   - Використовуйте TypeScript для всіх типів
   - Zod для валідації форм та даних
   - Експортуйте типи та схеми з кожного модуля
   - Визначайте схеми Zod на початку розробки кожного модуля

3. **Хуки**

   - Створюйте хуки для кожного кроку
   - Інкапсулюйте бізнес-логіку в хуках
   - Використовуйте React Query для API запитів
   - Інтегруйте Zod схеми для валідації даних

4. **UI компоненти**

   - Дотримуйтесь атомарного дизайну
   - Розділяйте компоненти за відповідальністю
   - Використовуйте композицію компонентів
   - Інтегруйте валідацію форм на основі Zod схем

5. **Валідація**

   - Використовуйте Zod для валідації форм та даних
   - Валідуйте дані перед відправкою на сервер
   - Показуйте зрозумілі повідомлення про помилки
   - Групуйте помилки за полями форми

6. **Тестування**
   - Пишіть тести для хуків
   - Тестуйте стори окремо
   - Використовуйте React Testing Library для компонентів
   - Тестуйте валідацію на основі Zod схем

## Висновок

Запропонована структура сторів та UI відповідає принципам FSD та DDD, забезпечує чітке розділення відповідальностей, покращує масштабованість та повторне використання коду. Розділення сторів за доменами дозволяє ізолювати логіку, спростити тестування та покращити продуктивність.

Ця структура повністю відображає всі етапи та підетапи OrderWizard, включаючи циклічний процес додавання предметів, параметри замовлення та формування квитанції. Кожен домен має свої стори, хуки, схеми та UI компоненти, що дозволяє легко розширювати функціональність та підтримувати код.

Інтеграція Zod для валідації даних дозволяє забезпечити типобезпеку, покращити якість коду та спростити розробку. Визначення схем на початку розробки кожного модуля дозволяє чітко визначити структуру даних та обмеження, що покращує документацію та спрощує розуміння коду.
