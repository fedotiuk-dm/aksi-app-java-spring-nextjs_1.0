# Використання Zod та Zustand

## Zod

### Базові схеми

```typescript
// model/types/validation.schema.ts
import { z } from 'zod';

// Базові схеми для перевикористання
export const baseSchema = {
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
};

// Схема для адреси
export const addressSchema = z.object({
  street: z.string().min(1, "Вулиця обов'язкова"),
  city: z.string().min(1, "Місто обов'язкове"),
  postalCode: z.string().optional(),
});

// Схема для контактної інформації
export const contactSchema = z.object({
  phone: z.string().regex(/^\+?[0-9]{10,12}$/, 'Некоректний формат телефону'),
  email: z.string().email('Некоректний email'),
});
```

### Схеми для модулів

```typescript
// api/clients/types/client.schema.ts
import { z } from 'zod';
import {
  baseSchema,
  addressSchema,
  contactSchema,
} from '@/model/types/validation.schema';

export const clientSchema = z.object({
  ...baseSchema,
  firstName: z.string().min(2, "Ім'я має містити мінімум 2 символи"),
  lastName: z.string().min(2, 'Прізвище має містити мінімум 2 символи'),
  ...contactSchema.shape,
  address: addressSchema.optional(),
  communicationChannels: z.array(z.enum(['PHONE', 'SMS', 'VIBER'])),
});

// api/orders/types/order.schema.ts
export const orderSchema = z.object({
  ...baseSchema,
  clientId: z.string().uuid(),
  items: z.array(
    z.object({
      id: z.string().uuid(),
      quantity: z.number().min(1),
      price: z.number().min(0),
    })
  ),
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED']),
  totalAmount: z.number().min(0),
});
```

### Використання в формах

```typescript
// api/clients/hooks/use-client-form.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientSchema } from '../types/client.schema';

export const useClientForm = () => {
  const form = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      communicationChannels: [],
    },
  });

  const onSubmit = async (data: z.infer<typeof clientSchema>) => {
    try {
      // Обробка даних
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Обробка помилок валідації
      }
    }
  };

  return {
    form,
    onSubmit,
  };
};
```

## Zustand

### Базові стори

```typescript
// shared/store/base.store.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const createBaseStore = <T extends object>(
  initialState: T,
  name: string
) => {
  return create<T>()(
    devtools(
      persist(
        (set) => ({
          ...initialState,
        }),
        {
          name,
        }
      )
    )
  );
};
```

### Стори для модулів

```typescript
// api/clients/store/client.store.ts
import { create } from 'zustand';
import { Client } from '../types/client.types';

interface ClientStore {
  selectedClient: Client | null;
  searchHistory: string[];
  setSelectedClient: (client: Client | null) => void;
  addToSearchHistory: (term: string) => void;
  clearSearchHistory: () => void;
}

export const useClientStore = create<ClientStore>((set) => ({
  selectedClient: null,
  searchHistory: [],
  setSelectedClient: (client) => set({ selectedClient: client }),
  addToSearchHistory: (term) =>
    set((state) => ({
      searchHistory: [...new Set([term, ...state.searchHistory])].slice(0, 10),
    })),
  clearSearchHistory: () => set({ searchHistory: [] }),
}));

// api/orders/store/order.store.ts
interface OrderStore {
  currentOrder: Order | null;
  orderHistory: Order[];
  setCurrentOrder: (order: Order | null) => void;
  addToHistory: (order: Order) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  currentOrder: null,
  orderHistory: [],
  setCurrentOrder: (order) => set({ currentOrder: order }),
  addToHistory: (order) =>
    set((state) => ({
      orderHistory: [order, ...state.orderHistory],
    })),
}));
```

### Використання в компонентах

```typescript
// ui/steps/step1-client-selection/ClientSelection.tsx
import { useClientStore } from '@/api/clients/store/client.store';
import { useOrderStore } from '@/api/orders/store/order.store';

export const ClientSelection = () => {
  const { selectedClient, setSelectedClient } = useClientStore();
  const { setCurrentOrder } = useOrderStore();

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setCurrentOrder({ ...currentOrder, clientId: client.id });
  };

  return (
    // Компонент
  );
};
```

### Селектори та оптимізація

```typescript
// api/clients/store/client.store.ts
import { createSelector } from 'zustand/middleware';

export const useClientStore = create<ClientStore>()(
  devtools(
    persist(
      (set, get) => ({
        // ... store implementation
      }),
      {
        name: 'client-store',
      }
    )
  )
);

// Селектори для оптимізації
export const useSelectedClient = () =>
  useClientStore((state) => state.selectedClient);

export const useSearchHistory = () =>
  useClientStore((state) => state.searchHistory);
```

## Інтеграція Zod та Zustand

### Валідація даних перед збереженням

```typescript
// api/clients/store/client.store.ts
import { clientSchema } from '../types/client.schema';

interface ClientStore {
  // ... store interface
  updateClient: (client: Client) => void;
}

export const useClientStore = create<ClientStore>((set) => ({
  // ... store implementation
  updateClient: (client) => {
    try {
      const validatedClient = clientSchema.parse(client);
      set({ selectedClient: validatedClient });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Обробка помилок валідації
        console.error('Validation error:', error.errors);
      }
    }
  },
}));
```

### Типізація стану

```typescript
// api/clients/types/client.types.ts
import { z } from 'zod';
import { clientSchema } from './client.schema';

export type Client = z.infer<typeof clientSchema>;

// api/clients/store/client.store.ts
import { Client } from '../types/client.types';

interface ClientStore {
  selectedClient: Client | null;
  // ... rest of the store
}
```

## Рекомендації

### Zod

1. **Структура схем**

   - Створюйте базові схеми для перевикористання
   - Розділяйте схеми на логічні групи
   - Використовуйте композицію схем

2. **Валідація**

   - Додавайте зрозумілі повідомлення про помилки
   - Використовуйте кастомні валідатори
   - Обробляйте помилки валідації

3. **Типізація**
   - Використовуйте `z.infer` для типів
   - Експортуйте типи з схем
   - Використовуйте строгу типізацію

### Zustand

1. **Структура сторів**

   - Розділяйте стори на логічні модулі
   - Використовуйте селектори
   - Зберігайте тільки необхідний стан

2. **Оптимізація**

   - Використовуйте мемоізацію
   - Розділяйте великі стори
   - Використовуйте middleware

3. **Персистентність**
   - Використовуйте persist middleware
   - Налаштовуйте сериалізацію
   - Обробляйте помилки зберігання
