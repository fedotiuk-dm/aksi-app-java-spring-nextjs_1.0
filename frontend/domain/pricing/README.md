# Pricing Domain

Домен для управління ціноутворенням у системі хімчистки. Реалізує принципи DDD (Domain-Driven Design) з повною інкапсуляцією бізнес-логіки.

## Архітектура

Домен побудований за принципом "DDD inside, FSD outside":

- **Уся бізнес-логіка в доменному шарі** - розрахунки, валідація, стан
- **UI компоненти максимально "тонкі"** - тільки відображення даних
- **Строга типізація** на всіх рівнях
- **Модульність та дотримання SOLID**

## Структура

```
pricing/
├── types/                  # Типи та енуми
│   └── pricing.types.ts
├── entities/              # Доменні сутності (якщо потрібні)
├── repositories/          # Репозиторії для доступу до даних
│   ├── price-list.repository.interface.ts
│   ├── price-list.repository.ts
│   ├── price-modifier.repository.interface.ts
│   ├── price-modifier.repository.ts
│   └── index.ts
├── utils/                 # Утиліти та бізнес-логіка
│   ├── pricing.calculator.ts    # Розрахунок цін
│   ├── pricing.utils.ts         # Допоміжні функції
│   └── pricing.validator.ts     # Валідація
├── services/              # Доменні сервіси
│   └── pricing.service.ts       # Головний сервіс
├── store/                 # Zustand стор
│   └── pricing.store.ts         # Управління станом
├── hooks/                 # React хуки
│   ├── use-pricing.hook.ts           # CRUD операції
│   ├── use-price-calculation.hook.ts # Розрахунки
│   └── use-price-modifiers.hook.ts   # Модифікатори
├── schemas/               # Zod схеми валідації
│   └── pricing.schema.ts
└── index.ts              # Публічне API
```

## Основні компоненти

### 1. Типи та енуми

```typescript
import { ServiceCategory, UnitOfMeasure, PriceModifierType } from '@/domains/pricing';

// Категорії послуг
enum ServiceCategory {
  CLOTHING_CLEANING = 'clothing_cleaning',
  LAUNDRY = 'laundry',
  IRONING = 'ironing',
  // ...інші категорії
}

// Одиниці виміру
enum UnitOfMeasure {
  PIECE = 'piece',
  KILOGRAM = 'kilogram',
  // ...інші одиниці
}
```

### 2. Репозиторії

Репозиторії інкапсулюють логіку доступу до даних та забезпечують абстракцію над джерелом даних.

#### PriceListRepository - репозиторій прайс-листа

```typescript
import { PriceListRepository, IPriceListRepository } from '@/domains/pricing';

// Створення екземпляра репозиторію
const priceListRepo = new PriceListRepository();

// Основні CRUD операції
const newItem = await priceListRepo.create({
  itemNumber: 'CL-001',
  name: 'Костюм чоловічий',
  category: ServiceCategory.CLOTHING_CLEANING,
  basePrice: 120,
  unitOfMeasure: UnitOfMeasure.PIECE,
  isActive: true,
});

// Пошук та фільтрація
const activeItems = await priceListRepo.findActive();
const clothingItems = await priceListRepo.findByCategory(ServiceCategory.CLOTHING_CLEANING);

// Пагінований пошук
const paginatedResults = await priceListRepo.findPaginated(1, 20, {
  category: ServiceCategory.CLOTHING_CLEANING,
  isActive: true,
  sortBy: 'name',
  sortOrder: 'asc',
});

// Спеціалізовані операції
const searchResults = await priceListRepo.search({
  keyword: 'костюм',
  categories: [ServiceCategory.CLOTHING_CLEANING],
});

const similarItems = await priceListRepo.findSimilar(targetItem, 5);

// Статистика
const stats = await priceListRepo.getStatistics();
console.log(`Всього предметів: ${stats.totalItems}`);
console.log(`Середня ціна: ${stats.priceRange.average}`);

// Експорт/імпорт
const csvData = await priceListRepo.exportToCsv({ category: ServiceCategory.CLOTHING_CLEANING });
const importResult = await priceListRepo.importFromCsv(csvData);
```

#### PriceModifierRepository - репозиторій модифікаторів

```typescript
import { PriceModifierRepository, IPriceModifierRepository } from '@/domains/pricing';

// Створення екземпляра репозиторію
const modifierRepo = new PriceModifierRepository();

// Створення модифікатора
const urgencyModifier = await modifierRepo.create({
  code: 'URGENT_24H',
  name: 'Терміново 24 години',
  type: PriceModifierType.URGENCY,
  value: 100, // +100%
  applicableCategories: [ServiceCategory.CLOTHING_CLEANING],
  priority: 10,
  isActive: true,
});

// Пошук застосовних модифікаторів
const applicableModifiers = await modifierRepo.findApplicable({
  category: ServiceCategory.CLOTHING_CLEANING,
  materialType: 'шерсть',
  colorType: 'чорний',
  orderAmount: 150,
  isActive: true,
});

// Перевірка можливості застосування
const canApplyResult = await modifierRepo.canApply(urgencyModifier, {
  category: ServiceCategory.CLOTHING_CLEANING,
  materialType: 'бавовна',
  orderAmount: 200,
});

if (canApplyResult.canApply) {
  console.log('Модифікатор можна застосувати');
} else {
  console.log(`Причина відмови: ${canApplyResult.reason}`);
}

// Групування за типом
const groupedByType = await modifierRepo.groupByType();
const discountModifiers = groupedByType[PriceModifierType.DISCOUNT];

// Батчеві операції
const deactivatedCount = await modifierRepo.deactivateMany({
  validAt: new Date('2024-01-01'),
});
```

### 3. Хуки для UI компонентів

#### usePricing - основний CRUD хук

```typescript
import { usePricing } from '@/domains/pricing';

const MyComponent = () => {
  const {
    // Дані
    priceListItems,
    selectedPriceItem,
    pricingStatistics,

    // Стан завантаження
    isLoading,
    error,

    // Фільтри
    searchKeyword,
    selectedCategory,
    updateSearchKeyword,
    updateSelectedCategory,

    // CRUD операції
    createPriceItem,
    updatePriceItem,
    deletePriceItem,

    // Утиліти
    findItemByNumber,
    generateItemNumber,
  } = usePricing();

  // Використання...
};
```

#### usePriceCalculation - розрахунки цін

```typescript
import { usePriceCalculation } from '@/domains/pricing';

const CalculationComponent = () => {
  const {
    // Поточний розрахунок
    currentCalculation,
    previewCalculation,

    // Модифікатори
    availableModifiers,
    recommendedModifiers,

    // Методи
    setParams,
    calculatePrice,
    calculateWithModifiers,

    // Швидкі розрахунки
    calculateUrgencyPrice,
    calculateChildDiscount,
  } = usePriceCalculation();

  // Використання...
};
```

#### usePriceModifiers - управління модифікаторами

```typescript
import { usePriceModifiers } from '@/domains/pricing';

const ModifiersComponent = () => {
  const {
    // Дані
    priceModifiers,
    selectedModifiers,
    modifiersByType,

    // Методи вибору
    selectModifier,
    unselectModifier,
    toggleModifier,

    // CRUD операції
    createModifier,
    updateModifier,
    deleteModifier,

    // Валідація
    validateModifier,
    canApplyModifier,
  } = usePriceModifiers();

  // Використання...
};
```

### 4. Сервіси

```typescript
import { PricingService } from '@/domains/pricing';

// CRUD операції
const newItem = await PricingService.createPriceListItem(itemData);
const updatedItem = await PricingService.updatePriceListItem(id, updates);

// Розрахунки
const calculation = PricingService.calculatePrice(params, modifiers);
const bulkResults = PricingService.calculateBulkPrices(items);

// Пошук
const searchResults = PricingService.searchPriceList(items, searchParams);
const similarItems = PricingService.findSimilarServices(targetItem, allItems);
```

### 5. Утиліти

```typescript
import { PricingCalculator, PricingUtils, PricingValidator } from '@/domains/pricing';

// Розрахунки
const result = PricingCalculator.calculatePrice(params, modifiers);
const urgencyPrice = PricingCalculator.calculateUrgencyPrice(basePrice, '24h');

// Утиліти
const filteredItems = PricingUtils.filterPriceListItems(items, filters);
const formattedPrice = PricingUtils.formatPrice(price, 'UAH');

// Валідація
const validation = PricingValidator.validatePriceListItem(item);
const canApply = PricingValidator.canApplyModifier(modifier, params);
```

### 6. Валідація з Zod

```typescript
import { priceListItemFormSchema, priceCalculationFormSchema } from '@/domains/pricing';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const MyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(priceListItemFormSchema),
  });

  // Використання форми...
};
```

## Бізнес-правила

### 1. Розрахунок цін

1. **Базова ціна** - з прайс-листа
2. **Спеціальні ціни за кольором** - чорний/світлий
3. **Модифікатори** - у порядку пріоритету
4. **Знижки** - не на всі категорії
5. **Терміновість** - +50% або +100%

### 2. Обмеження знижок

Знижки НЕ діють на:

- Прасування (`IRONING`)
- Прання (`LAUNDRY`)
- Фарбування (`TEXTILE_DYEING`)

### 3. Спеціальні модифікатори

- **Дитячі речі** (до 30 розміру) - 30% знижка
- **Ручна чистка** - +20% до вартості
- **Дуже забруднені речі** - +20-100% до вартості
- **Терміновість**: +50% (48 год), +100% (24 год)

## Приклади використання

### Використання репозиторіїв

```typescript
import { PriceListRepository, PriceModifierRepository } from '@/domains/pricing';

// Ініціалізація репозиторіїв
const priceListRepo = new PriceListRepository();
const modifierRepo = new PriceModifierRepository();

// Створення нового предмета в прайс-листі
const createNewItem = async () => {
  try {
    const newItem = await priceListRepo.create({
      itemNumber: 'CL-002',
      name: 'Сукня жіноча',
      category: ServiceCategory.CLOTHING_CLEANING,
      basePrice: 80,
      unitOfMeasure: UnitOfMeasure.PIECE,
      isActive: true,
    });

    console.log('Створено новий предмет:', newItem);
  } catch (error) {
    console.error('Помилка створення:', error);
  }
};

// Пошук застосовних модифікаторів
const findApplicableModifiers = async () => {
  const modifiers = await modifierRepo.findApplicable({
    category: ServiceCategory.CLOTHING_CLEANING,
    materialType: 'шовк',
    orderAmount: 200,
    isActive: true,
  });

  console.log('Застосовні модифікатори:', modifiers);
};

// Статистика
const getStatistics = async () => {
  const priceStats = await priceListRepo.getStatistics();
  const modifierStats = await modifierRepo.getStatistics();

  console.log('Статистика прайс-листа:', priceStats);
  console.log('Статистика модифікаторів:', modifierStats);
};
```

### Створення нового елемента прайс-листа

```typescript
import { usePricing, ServiceCategory, UnitOfMeasure } from '@/domains/pricing';

const CreateItemComponent = () => {
  const { createPriceItem, generateItemNumber } = usePricing();

  const handleCreate = async () => {
    const itemData = {
      itemNumber: generateItemNumber(ServiceCategory.CLOTHING_CLEANING),
      name: 'Костюм чоловічий',
      category: ServiceCategory.CLOTHING_CLEANING,
      categoryId: 'clothing-cleaning',
      basePrice: 120,
      unitOfMeasure: UnitOfMeasure.PIECE,
      isActive: true,
    };

    try {
      await createPriceItem(itemData);
      // Успішно створено
    } catch (error) {
      // Обробка помилки
    }
  };

  return (
    <button onClick={handleCreate}>
      Створити елемент
    </button>
  );
};
```

### Розрахунок ціни з модифікаторами

```typescript
import { usePriceCalculation } from '@/domains/pricing';

const CalculationComponent = () => {
  const { setParams, currentCalculation } = usePriceCalculation();

  const calculateItemPrice = () => {
    const params = {
      priceListItem: {
        // дані про предмет
        basePrice: 120,
        category: ServiceCategory.CLOTHING_CLEANING,
        unitOfMeasure: UnitOfMeasure.PIECE,
        // ...інші поля
      },
      quantity: 1,
      urgencyLevel: '24h' as const,
      discountPercentage: 10,
      materialType: 'шерсть',
      color: 'чорний',
    };

    setParams(params);
  };

  return (
    <div>
      <button onClick={calculateItemPrice}>
        Розрахувати ціну
      </button>

      {currentCalculation && (
        <div>
          <p>Базова ціна: {currentCalculation.basePrice} грн</p>
          <p>Фінальна ціна: {currentCalculation.finalPrice} грн</p>

          {/* Деталізація розрахунку */}
          {currentCalculation.breakdown.map((item, index) => (
            <div key={index}>
              {item.description}: {item.amount} грн
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

### Робота з модифікаторами

```typescript
import { usePriceModifiers } from '@/domains/pricing';

const ModifiersComponent = () => {
  const {
    priceModifiers,
    selectedModifiers,
    toggleModifier,
    getApplicableModifiers
  } = usePriceModifiers({
    category: ServiceCategory.CLOTHING_CLEANING
  });

  return (
    <div>
      <h3>Доступні модифікатори:</h3>
      {priceModifiers.map(modifier => (
        <label key={modifier.id}>
          <input
            type="checkbox"
            checked={selectedModifiers.some(m => m.id === modifier.id)}
            onChange={() => toggleModifier(modifier)}
          />
          {modifier.name} ({modifier.value}%)
        </label>
      ))}

      <p>Обрано: {selectedModifiers.length} модифікаторів</p>
    </div>
  );
};
```

### Пошук та фільтрація

```typescript
import { usePricing, ServiceCategory } from '@/domains/pricing';

const SearchComponent = () => {
  const {
    priceListItems,
    searchKeyword,
    selectedCategory,
    updateSearchKeyword,
    updateSelectedCategory,
    resetFilters,
  } = usePricing();

  return (
    <div>
      <input
        type="text"
        value={searchKeyword}
        onChange={(e) => updateSearchKeyword(e.target.value)}
        placeholder="Пошук послуг..."
      />

      <select
        value={selectedCategory || ''}
        onChange={(e) => updateSelectedCategory(e.target.value as ServiceCategory || null)}
      >
        <option value="">Всі категорії</option>
        <option value={ServiceCategory.CLOTHING_CLEANING}>Чистка одягу</option>
        <option value={ServiceCategory.LAUNDRY}>Прання</option>
        {/* ...інші категорії */}
      </select>

      <button onClick={resetFilters}>
        Очистити фільтри
      </button>

      {/* Результати */}
      <div>
        {priceListItems.map(item => (
          <div key={item.id}>
            {item.name} - {item.basePrice} грн
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Тестування

```typescript
import { PricingService, PricingCalculator, PriceListRepository } from '@/domains/pricing';

describe('PricingService', () => {
  test('створює новий елемент прайс-листа', () => {
    const result = PricingService.createPriceListItem(itemData);
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('id');
  });

  test('розраховує ціну з модифікаторами', () => {
    const result = PricingCalculator.calculatePrice(params, modifiers);
    expect(result.finalPrice).toBeGreaterThan(result.basePrice);
  });
});

describe('PriceListRepository', () => {
  let repository: PriceListRepository;

  beforeEach(() => {
    repository = new PriceListRepository();
  });

  test('створює новий елемент', async () => {
    const itemData = {
      itemNumber: 'TEST-001',
      name: 'Тестовий предмет',
      category: ServiceCategory.CLOTHING_CLEANING,
      basePrice: 100,
      unitOfMeasure: UnitOfMeasure.PIECE,
      isActive: true,
    };

    const result = await repository.create(itemData);
    expect(result.id).toBeDefined();
    expect(result.name).toBe(itemData.name);
  });

  test('знаходить елементи за категорією', async () => {
    const items = await repository.findByCategory(ServiceCategory.CLOTHING_CLEANING);
    items.forEach((item) => {
      expect(item.category).toBe(ServiceCategory.CLOTHING_CLEANING);
    });
  });
});
```

## Інтеграція з Order Wizard

Pricing домен інтегрується з Order Wizard для розрахунку вартості замовлень:

```typescript
// В Order Wizard компонентах
import { usePriceCalculation, ServiceCategory } from '@/domains/pricing';

const OrderItemStep = () => {
  const { setParams, currentCalculation } = usePriceCalculation({
    autoCalculate: true,
  });

  // При зміні параметрів предмета
  useEffect(() => {
    if (selectedService && quantity) {
      setParams({
        priceListItem: selectedService,
        quantity,
        urgencyLevel: orderUrgency,
        discountPercentage: clientDiscount,
        // ...інші параметри
      });
    }
  }, [selectedService, quantity, orderUrgency, clientDiscount]);

  return (
    <div>
      {/* UI для вибору предмета та його характеристик */}

      {currentCalculation && (
        <PriceBreakdown calculation={currentCalculation} />
      )}
    </div>
  );
};
```

## Performance та оптимізація

1. **Мемоізація розрахунків** - використання useMemo в хуках
2. **Кешування результатів** - в React Query
3. **Lazy loading** - для великих прайс-листів
4. **Дебаунсинг** - для пошуку та фільтрації
5. **Селектори** - для оптимального доступу до стану
6. **Репозиторії** - кешування та оптимізація запитів до даних

## Розширення

Для додавання нових функцій:

1. **Нові типи модифікаторів** - додати в `PriceModifierType` enum
2. **Нові категорії** - додати в `ServiceCategory` enum
3. **Нові алгоритми розрахунку** - розширити `PricingCalculator`
4. **Нові валідації** - додати в `PricingValidator`
5. **Нові репозиторії** - створити нові інтерфейси та реалізації
6. **API інтеграція** - створити нові реалізації репозиторіїв з HTTP клієнтами

## Міграції

При зміні структури даних використовуйте міграції в сторі:

```typescript
const usePricingStore = create<PricingState & PricingActions>()(
  persist(
    (set, get) => ({
      // стор
    }),
    {
      name: 'pricing-store',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Міграція з версії 0 до 1
        }
        return persistedState;
      },
    }
  )
);
```
