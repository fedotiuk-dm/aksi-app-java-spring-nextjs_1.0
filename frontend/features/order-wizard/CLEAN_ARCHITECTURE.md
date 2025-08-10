# OrderWizard Clean Architecture

## 🎯 Мета

Створити чисту архітектуру на основі **Atomic Design + Orval-first + 0% хардкоду**

## 📐 Компонентна архітектура (3 секції)

### 30% - Customer & Order Info
```
components/
├── customer/
│   ├── CustomerSearch.tsx           # 50 рядків - пошук через useListCustomers
│   ├── CustomerForm.tsx             # 80 рядків - форма через useCreateCustomer  
│   └── OrderBasicInfo.tsx           # 40 рядків - номер/мітка/філія
└── CustomerSection.tsx              # 30 рядків - композиція 3х компонентів
```

### 50% - Items & Pricing  
```
components/
├── items/
│   ├── ItemsTable.tsx               # 60 рядків - таблиця через useGetCart
│   ├── item-form/
│   │   ├── ItemForm.tsx             # 40 рядків - контейнер форми
│   │   ├── ServiceCategorySelector.tsx  # 30 рядків - useListCategories
│   │   ├── ItemNameSelector.tsx     # 30 рядків - useListPriceListItems  
│   │   ├── CharacteristicsForm.tsx  # 60 рядків - матеріал/колір через API
│   │   ├── DefectsStainsForm.tsx    # 50 рядків - плями/дефекти через API
│   │   ├── ModifiersForm.tsx        # 40 рядків - useListModifiers
│   │   └── PhotoUpload.tsx          # 50 рядків - useUploadFile
│   └── LivePricingCalculator.tsx    # 80 рядків - useCalculatePrice + atomic UI
└── ItemsSection.tsx                 # 50 рядків - композиція
```

### 20% - Summary & Completion
```
components/
├── summary/
│   ├── ExecutionParameters.tsx      # 40 рядків - дата/терміновість
│   ├── DiscountParameters.tsx       # 50 рядків - useListDiscounts
│   ├── FinancialSummary.tsx         # 60 рядків - розрахунки + оплата
│   └── OrderCompletion.tsx          # 70 рядків - підпис + кнопка друку
└── SummarySection.tsx               # 40 рядків - композиція 4х компонентів
```

## 🔧 Orval-First підхід + Business Logic Hooks

### Централізований Cart Operations Layer

```typescript
// useCartOperations.ts - Thin wrapper around all Orval cart API
export const useCartOperations = () => {
  // Direct Orval API imports
  const { data: cart, refetch: refetchCart } = useGetCart();
  const addItemMutation = useAddCartItem();
  const updateItemMutation = useUpdateCartItem();
  const removeItemMutation = useRemoveCartItem();
  
  // Thin wrapper operations (auto-refresh cart)
  const addItem = async (itemData) => {
    const result = await addItemMutation.mutateAsync({ data: itemData });
    await refetchCart(); // Auto-refresh after mutation
    return result;
  };
  
  // Data access helpers
  const getCartItems = () => cart?.items || [];
  const getCartPricing = () => cart?.pricing;
  
  // Loading and error states aggregation
  const isMutating = isAddingItem || isUpdatingItem || isRemovingItem;
  const errors = { addItem: addItemMutation.error, ... };
};
```

**Переваги:**
- ✅ Всі cart операції централізовані в одному місці
- ✅ Автоматичний refetch після кожної mutation
- ✅ Консистентна обробка помилок та loading станів  
- ✅ Один хук замість 8+ прямих Orval imports
- ✅ Легко тестувати та підтримувати

### Рівні абстракцій
```typescript
// 1️⃣ Orval API Layer (Generated)
const customers = useListCustomers();             // Прямі API виклики
const createCustomer = useCreateCustomer();       // Створення клієнта  
const activateCustomer = useActivateCustomerForCart(); // Активація в корзині

// 2️⃣ Business Logic Layer (Custom Hooks)
const customerOps = useCustomerOperations();      // Композиція API + стор
const formLogic = useCustomerForm();              // Form state + validation
const searchLogic = useCustomerSearch();          // Search state + handlers

// 3️⃣ UI Components Layer (Pure JSX)
<CustomerForm />   // Тільки рендер
<CustomerSearch /> // Тільки рендер  
<OrderBasicInfo /> // Тільки рендер
```

### Business Logic Hooks Pattern
```typescript
// useCustomerOperations.ts - бізнес-операції
export const useCustomerOperations = () => {
  const { setSelectedCustomer } = useOrderWizardStore();
  const createMutation = useCreateCustomer();
  const activateMutation = useActivateCustomerForCart();

  const createAndActivateCustomer = async (data) => {
    const customer = await createMutation.mutateAsync({ data });
    await activateMutation.mutateAsync({ data: { customerId: customer.id } });
    setSelectedCustomer(customer);
    return customer;
  };

  return { createAndActivateCustomer, isLoading: /*...*/ };
};
```

### NO Hardcoded Constants
```typescript
// ❌ ЗАБОРОНЕНО
const URGENCY_OPTIONS = [
  { value: 'NORMAL', label: 'Звичайне (0%)' },
  { value: 'EXPRESS_48H', label: '+50% (48 год)' }
];

// ✅ ПРАВИЛЬНО - автоматичне форматування enum значень
{Object.values(CreateCustomerRequestContactPreferencesItem).map((value) => (
  <MenuItem key={value} value={value}>
    {value.charAt(0) + value.slice(1).toLowerCase().replace('_', ' ')}
  </MenuItem>
))}
// Автоматично: PHONE → "Phone", MULTI_DEVICE → "Multi device"
```

## 🧱 Atomic Design Integration

### Atoms (shared/ui/atoms)
```typescript
import { 
  PriceDisplay,        // formatPrice автоматично
  PercentageBadge,     // +/- чіпи
  StatusAlert,         // попередження
  QuantityIndicator    // к-сть > 1
} from '@shared/ui/atoms';
```

### Molecules (shared/ui/molecules)  
```typescript
import {
  PriceRow,           // лейбл + ціна в ряд
  ModifierLine        // модифікатор з відступом
} from '@shared/ui/molecules';
```

### Organisms (shared/ui/organisms)
```typescript
import {
  PricingTotals,      // блок загальних підсумків 
  ItemBreakdown       // розбивка предмета
} from '@shared/ui/organisms';
```

## 📂 Файлова структура

```
features/order-wizard/
├── OrderWizard.tsx                  # 50 рядків - layout тільки
├── components/
│   ├── customer/
│   │   ├── CustomerSearch.tsx       # UI + useCustomerSearch
│   │   ├── CustomerForm.tsx         # UI + useCustomerForm
│   │   ├── OrderBasicInfo.tsx       # UI + useOrderBasicInfo
│   │   └── CustomerSection.tsx      # композиція
│   ├── items/
│   │   ├── ItemsTable.tsx           # таблиця через useGetCart
│   │   ├── item-form/
│   │   │   ├── ItemForm.tsx         # контейнер
│   │   │   ├── ServiceCategorySelector.tsx
│   │   │   ├── ItemNameSelector.tsx
│   │   │   ├── CharacteristicsForm.tsx
│   │   │   ├── DefectsStainsForm.tsx  
│   │   │   ├── ModifiersForm.tsx
│   │   │   └── PhotoUpload.tsx
│   │   ├── LivePricingCalculator.tsx # useCalculatePrice + atomic UI
│   │   └── ItemsSection.tsx         # композиція
│   ├── summary/
│   │   ├── ExecutionParameters.tsx  # дата/терміновість
│   │   ├── DiscountParameters.tsx   # useListDiscounts
│   │   ├── FinancialSummary.tsx     # розрахунки
│   │   ├── OrderCompletion.tsx      # підпис/друк
│   │   └── SummarySection.tsx       # композиція
│   └── receipt/
│       ├── ReceiptPreview.tsx       # useGenerateReceiptPreview
│       └── Receipt.tsx              # PDF рендеринг
├── hooks/
│   ├── useCustomerOperations.ts     # бізнес-операції композиції
│   ├── useCustomerForm.ts           # UI логіка форми
│   ├── useCustomerSearch.ts         # UI логіка пошуку
│   └── useOrderBasicInfo.ts         # UI логіка базової інформації
├── store/
│   └── order-wizard-store.ts        # тільки UI state (zustand)
└── types/
    └── index.ts                     # локальні UI типи (якщо потрібні)
```

## 💾 State Management Strategy

### Backend State (Single Source of Truth)
```typescript
// ✅ Все через Orval API
const cart = useGetCart();                    // предмети + ціни
const customer = selectedCustomer;            // з store (UI state)
const discounts = useListDiscounts();         // знижки + excluded categories  
const modifiers = useListModifiers();         // модифікатори + category restrictions
```

### Local UI State (Zustand - мінімум)
```typescript
interface OrderWizardStore {
  // Тільки UI стан
  selectedCustomer: CustomerInfo | null;
  selectedBranch: BranchInfo | null; 
  uniqueLabel: string;
  isCustomerFormOpen: boolean;
  editingItemId: string | null;
  
  // Дії
  setSelectedCustomer: (customer: CustomerInfo | null) => void;
  setSelectedBranch: (branch: BranchInfo | null) => void;
  setUniqueLabel: (label: string) => void;
  resetOrderWizard: () => void;
}
```

## 🔄 Data Flow Architecture

### 1. Customer Flow
```typescript
CustomerSearch → useListCustomers({search}) → 
CustomerSelect → useActivateCustomerForCart → 
Store.selectedCustomer → useGetCart (enabled)
```

### 2. Items Flow  
```typescript
ItemForm → useAddCartItem → 
useGetCart (auto-refetch) →
LivePricingCalculator → useCalculatePrice →
PricingTotals/ItemBreakdown (atomic UI)
```

### 3. Order Creation Flow
```typescript
SummarySection → useUpdateCartModifiers → 
useCreateOrder → useGenerateReceiptPreview →
ReceiptPreview → useClearCart → resetOrderWizard
```

## 📋 Implementation Rules

### 1. Component Size Limits
- **Atoms**: 10-30 рядків
- **Molecules**: 30-60 рядків  
- **Organisms**: 60-100 рядків
- **Sections**: 100-150 рядків максимум
- **Pages**: 50-80 рядків (тільки layout)

### 2. API Integration Rules
```typescript
// ✅ DO: Прямі Orval calls
const { data } = useListModifiers();
const modifiers = data?.modifiers || [];

// ❌ DON'T: Додаткові абстракції
const { modifiers } = useOrderWizardData(); // НІ!
```

### 3. Type Safety Rules
```typescript
// ✅ DO: Orval типи
import type { CustomerInfo, CartInfo } from '@/shared/api/generated';

// ❌ DON'T: as unknown as, @ts-expect-error
const customer = data as unknown as CustomerInfo; // НІ!
```

### 4. Props Rules
```typescript
// ✅ DO: Мінімальні props
<PriceRow label="Сума:" amount={total} />

// ❌ DON'T: Передача всіх даних
<PriceRow data={allCartData} formatPrice={formatPrice} /> // НІ!
```

## 🚀 Implementation Plan

### Етап 1: Core Infrastructure (30 хв)
1. OrderWizard.tsx - layout секцій
2. order-wizard-store.ts - UI state  
3. Базові секції (CustomerSection, ItemsSection, SummarySection) - 50 рядків кожна

### Етап 2: Customer Components (45 хв) 
1. CustomerSearch - useListCustomers
2. CustomerForm - useCreateCustomer + react-hook-form
3. OrderBasicInfo - useListBranches

### Етап 3: Items Components (60 хв)
1. ItemsTable - useGetCart display
2. ItemForm subfolder - всі підкомпоненти форми
3. LivePricingCalculator - useCalculatePrice + atomic UI

### Етап 4: Summary Components (45 хв)
1. ExecutionParameters - дата/терміновість  
2. DiscountParameters - useListDiscounts
3. FinancialSummary - розрахунки з PricingTotals
4. OrderCompletion - підпис + useCreateOrder

### Етап 5: Integration & Polish (30 хв)
1. Receipt components
2. Error boundaries
3. Loading states
4. Final testing

## ✅ Success Criteria

- **Кожен компонент < 100 рядків**
- **0% хардкоду** - все з API  
- **0% дублювання** - shared atomic UI
- **100% Orval інтеграція** - прямі API calls
- **Типізація** - тільки Orval типи
- **Читабельність** - зрозуміла структура файлів

Готовий розпочати реалізацію? 🚀