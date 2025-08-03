# Catalog Feature

## Структура

```
features/catalog/
├── constants/
│   └── catalog.constants.ts    # Всі константи, enum'и та типи
├── store/
│   └── catalog-store.ts        # Zustand store для UI стану
├── hooks/
│   ├── use-service-form.ts     # Форми для послуг
│   ├── use-item-form.ts        # Форми для товарів
│   └── use-service-item-form.ts # Форми для зв'язків
└── index.ts                    # Barrel export

```

## Використання API хуків (згенеровані Orval)

### 1. Робота з послугами (Services)

```typescript
import { 
  useListServices, 
  useGetServiceById, 
  useCreateService, 
  useUpdateService 
} from '@/shared/api/generated/serviceItem';

// Список послуг
const { data, isLoading } = useListServices({
  active: true,
  category: 'LAUNDRY'
});

// Деталі послуги
const { data: service } = useGetServiceById('service-id');

// Створення (з toast повідомленнями)
const createMutation = useCreateService();

const handleCreate = async () => {
  try {
    await createMutation.mutateAsync({
      data: {
        code: 'DRY_CLEAN_EXPRESS',
        name: 'Експрес хімчистка',
        category: 'LAUNDRY',
        icon: 'laundry',
        color: '#4CAF50'
      }
    });
    toast.success('Послугу створено');
  } catch (error) {
    toast.error('Помилка створення');
  }
};
```

### 2. Робота з товарами (Items)

```typescript
import {
  useListItems,
  useGetItemById,
  useCreateItem,
  useUpdateItem
} from '@/shared/api/generated/serviceItem';

// Список з пагінацією та пошуком
const { data } = useListItems({
  active: true,
  category: 'CLOTHING',
  search: 'костюм',
  offset: 0,
  limit: 20
});

// Створення товару
const createMutation = useCreateItem();

await createMutation.mutateAsync({
  data: {
    code: 'SUIT_BUSINESS',
    name: 'Костюм діловий',
    pluralName: 'Костюми ділові',
    category: 'CLOTHING',
    catalogNumber: 101,
    serviceCategoryCode: 'CLOTHING'
  }
});
```

### 3. Робота зі зв'язками (Service-Items)

```typescript
import {
  useListServiceItems,
  useGetServiceItemById,
  useCreateServiceItem,
  useUpdateServiceItem
} from '@/shared/api/generated/serviceItem';

// Список з фільтрацією
const { data } = useListServiceItems({
  serviceId: 'service-uuid',
  itemId: 'item-uuid',
  branchId: 'branch-uuid', // для отримання цін філії
  active: true,
  offset: 0,
  limit: 20
});

// Створення зв'язку з ціною
const createMutation = useCreateServiceItem();

await createMutation.mutateAsync({
  data: {
    serviceId: 'service-uuid',
    itemId: 'item-uuid',
    basePrice: 15000, // 150.00 UAH в копійках
    processingTime: 'STANDARD_2D',
    expressAvailable: true,
    expressMultiplier: 1.5
  }
});
```

### 4. Прайс-лист (тільки читання)

```typescript
import {
  useListPriceListItems,
  useGetPriceListItemById
} from '@/shared/api/generated/serviceItem';

// Список елементів прайсу
const { data } = useListPriceListItems({
  categoryCode: 'LAUNDRY',
  active: true,
  offset: 0,
  limit: 50
});
```

## Використання форм-хуків

### Service Forms

```typescript
import { useCreateServiceForm, useUpdateServiceForm } from '@/features/catalog';

// Створення
export function CreateServiceModal() {
  const { form, onSubmit, isLoading } = useCreateServiceForm();
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('code')} />
      <input {...form.register('name')} />
      <select {...form.register('category')}>
        {SERVICE_CATEGORIES.map(cat => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>
      <button type="submit" disabled={isLoading}>
        Створити
      </button>
    </form>
  );
}

// Оновлення
export function EditServiceModal({ service }: { service: ServiceInfo }) {
  const { form, onSubmit, isLoading } = useUpdateServiceForm(service);
  
  // Форма автоматично заповнюється даними service
  // ...
}
```

### Item Forms

```typescript
import { useCreateItemForm, useUpdateItemForm } from '@/features/catalog';

// Аналогічно до Service Forms
const { form, onSubmit, isLoading } = useCreateItemForm();
```

### ServiceItem Forms

```typescript
import { useCreateServiceItemForm, useUpdateServiceItemForm } from '@/features/catalog';

// Для створення/редагування зв'язків між послугами та товарами
const { form, onSubmit, isLoading } = useCreateServiceItemForm();
```

## Catalog Store

```typescript
import { useCatalogStore } from '@/features/catalog';

function CatalogFilters() {
  const { filters, setFilters, resetFilters } = useCatalogStore();
  
  const handleCategoryChange = (category: ServiceCategory) => {
    setFilters({ serviceCategory: category });
  };
  
  const handleActiveToggle = () => {
    setFilters({ activeOnly: !filters.activeOnly });
  };
  
  return (
    <div>
      <select 
        value={filters.serviceCategory} 
        onChange={(e) => handleCategoryChange(e.target.value)}
      >
        {/* options */}
      </select>
      
      <label>
        <input 
          type="checkbox" 
          checked={filters.activeOnly}
          onChange={handleActiveToggle}
        />
        Тільки активні
      </label>
      
      <button onClick={resetFilters}>
        Скинути фільтри
      </button>
    </div>
  );
}
```

## Константи

```typescript
import { 
  SERVICE_CATEGORIES,
  ITEM_CATEGORIES,
  PROCESSING_TIMES,
  UNIT_OF_MEASURE_OPTIONS,
  CATALOG_DEFAULTS,
  CATALOG_MESSAGES 
} from '@/features/catalog';

// Використання в UI
SERVICE_CATEGORIES.map(category => (
  <option key={category.value} value={category.value}>
    {category.label}
  </option>
));
```

## Типи (з згенерованих файлів)

```typescript
import type {
  ServiceInfo,
  ItemInfo,
  ServiceItemInfo,
  PriceListItemInfo,
  ServiceInfoCategory,
  ItemInfoCategory,
  // ... інші типи
} from '@/shared/api/generated/serviceItem';
```

## Приклад повного компонента

```typescript
import { useListServices } from '@/shared/api/generated/serviceItem';
import { useCatalogStore, SERVICE_CATEGORIES } from '@/features/catalog';
import { toast } from 'react-hot-toast';

export function ServicesList() {
  const { filters, modalType, openModal } = useCatalogStore();
  
  const { data, isLoading, error } = useListServices({
    active: filters.activeOnly,
    category: filters.serviceCategory
  });
  
  if (isLoading) return <div>Завантаження...</div>;
  if (error) {
    toast.error('Помилка завантаження послуг');
    return <div>Помилка</div>;
  }
  
  return (
    <div>
      <button onClick={() => openModal('service')}>
        Додати послугу
      </button>
      
      <div className="services-grid">
        {data?.services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
      
      {modalType === 'service' && <CreateServiceModal />}
    </div>
  );
}
```

## Важливі моменти

1. **Всі ціни в копійках**: `15000 = 150.00 UAH`
2. **Orval хуки використовуються напряму** - не потрібні додаткові обгортки
3. **Toast повідомлення додаються в компонентах**, а не в хуках
4. **Форм-хуки** спрощують роботу з react-hook-form та Zod валідацією
5. **Store** зберігає тільки UI стан (фільтри, модалки)