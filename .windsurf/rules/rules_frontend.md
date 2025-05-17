---
trigger: always_on
---

# Інструкція для розробки фронтенду проекту "Хімчистка AKSI"

## Технологічний стек

- **Архітектура:** Feature-Sliced Design (FSD)
- **Фреймворк:** Next.js 15.3.0 (App Router)
- **Мова:** TypeScript 5, React 19.0.0
- **UI:** Material UI 7.0.2
- **Стан:** React Context API + Zustand 5.0.3
- **API:** React Query 5.72.2 + Axios 1.8.4
- **Форми:** React Hook Form 7.55.0 + Zod 3.24.2
- **Додатково:** Day.js 1.11.13, Vitest 3.1.1, next-intl 4.0.2

## Архітектура FSD

### Шари
- **app** - композиція додатку, конфігурації
- **processes** - складні бізнес-процеси (OrderWizard)
- **pages** - сторінки додатку
- **widgets** - повторно використовувані блоки
- **features** - функціональні модулі
- **entities** - бізнес-сутності
- **shared** - спільні утиліти та компоненти

### Сегменти
- **ui** - компоненти
- **model** - бізнес-логіка
- **api** - взаємодія з API
- **lib** - допоміжна логіка

## Основні правила

### 1. API структура
- URL: `${SERVER_API_URL}/api/resource_path`
- Використовувати згенеровані API клієнти з `/lib/api/generated`
- Генерація: `npm run generate-api:docker`
- Імпорт: `import { useClients } from '@/features/clients/api'`

### 2. MUI7 Grid
- Не використовувати атрибут `item` (видалено у MUI7)
- Використовувати `size` замість `xs`, `sm`, `md`, `lg`, `xl`

```tsx
// Правильно
<Grid container spacing={2}>
  <Grid size={{ xs: 12, sm: 6 }}>
    <Box>Вміст</Box>
  </Grid>
</Grid>

// НЕПРАВИЛЬНО
<Grid container spacing={2}>
  <Grid item xs={12} sm={6}>
    <Box>Вміст</Box>
  </Grid>
</Grid>
```

### 3. Server/Client Components
- Додавати `'use client'` для Client Components
- Client Components: компоненти з хуками, інтерактивні MUI компоненти

```tsx
// app/orders/page.tsx (Server Component)
export default async function OrdersPage() {
  const orders = await fetchOrders();
  return <OrdersList initialOrders={orders} />;
}

// features/orders/components/OrdersList.tsx (Client Component)
'use client';
export default function OrdersList({ initialOrders }) {
  const [filtered, setFiltered] = useState(initialOrders);
  return (/* ... */);
}
```

## OrderWizard з Zustand

```typescript
import { create } from 'zustand';

type WizardState =
  | 'clientSelection'
  | 'basicInfo'
  | 'itemManagement'
  | 'itemBasic'
  | 'itemProperties'
  | 'defects'
  | 'pricing'
  | 'photos'
  | 'orderParams'
  | 'billing'
  | 'complete';

interface OrderWizardState {
  currentState: WizardState;
  orderData: any;
  goTo: (state: WizardState) => void;
  updateOrderData: (data: Partial<any>) => void;
}

export const useOrderWizardStore = create<OrderWizardState>((set) => ({
  currentState: 'clientSelection',
  orderData: {},
  goTo: (state) => set({ currentState: state }),
  updateOrderData: (data) =>
    set((state) => ({
      orderData: { ...state.orderData, ...data },
    })),
}));
```

## React Hook Form + Zod

```typescript
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Схема валідації
const clientSchema = z.object({
  firstName: z.string().min(2, "Ім'я повинно містити мінімум 2 символи"),
  lastName: z.string().min(2, 'Прізвище повинно містити мінімум 2 символи'),
  phone: z.string().min(10, 'Телефон повинен містити мінімум 10 символів'),
  email: z.string().email('Введіть коректний email').optional().nullable(),
});

export type ClientFormData = z.infer<typeof clientSchema>;

// Компонент форми
export function ClientForm() {
  const { control, handleSubmit } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: { firstName: '', lastName: '', phone: '', email: '' },
  });
}
```

## React Query

```typescript
import { useQuery } from '@tanstack/react-query';
import { clientsApi } from '@/lib/api';

export function useClients(searchTerm: string) {
  return useQuery({
    queryKey: ['clients', searchTerm],
    queryFn: () => clientsApi.searchClients({ query: searchTerm }),
    enabled: searchTerm.length >= 3,
  });
}
```

## Шрифти

```typescript
import { Geist } from 'next/font/google';

const geistSans = Geist({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'], // Важливо: для кирилиці використовуйте локальні версії
  display: 'swap',
  fallback: ['sans-serif'],
});
```

## Docker

- **frontend** контейнер: Next.js додаток
- Backend доступний як `http://backend:8080`
- Використовувати Docker-імена замість localhost