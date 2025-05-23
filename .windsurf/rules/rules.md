---
trigger: always_on
---

# Інструкція для Windsirf IDE: Розробка проекту за підходом "DDD inside, FSD outside"

## Актуальний технологічний стек

### Бекенд (залишається без змін)
- **Фреймворк:** Spring Boot 3.4.4
- **Мова:** Java 21
- **База даних:** PostgreSQL 17
- **ORM:** Hibernate/Spring Data JPA
- **API:** REST (Spring Web)
- **Документація API:** Swagger/OpenAPI
- **Автентифікація:** Spring Security + JWT
- **Валідація:** Jakarta Validation (Hibernate Validator)
- **Маппінг об'єктів:** MapStruct 1.6.3, Lombok 1.18.38
- **Логування:** SLF4J + Logback
- **Тестування:** JUnit 5.12.1, Mockito
- **Міграції БД:** Liquibase 4.31.1
- **PDF Генерація:** iTextPDF 5.5.13.4
- **QR Code:** ZXing 3.5.3
- **Email:** Spring Mail

### Фронтенд
- **Фреймворк:** Next.js 15.3.0 (App Router)
- **Мова:** TypeScript 5
- **React:** 19.0.0
- **UI:** Material UI 7.0.2
- **Керування станом:** Zustand 5.0.3
- **API/Бекенд взаємодія:** React Query 5.72.2 + Axios 1.8.4
- **Форми:** React Hook Form 7.55.0
- **Валідація:** Zod 3.24.2
- **Дати:** Day.js 1.11.13
- **Тестування:** Vitest 3.1.1 + React Testing Library 16.3.0
- **Локалізація (i18n):** next-intl 4.0.2

## Архітектурні принципи: "DDD inside, FSD outside"

### Основні принципи

1. **Вся функціональна логіка в доменному шарі (DDD inside)**
   - Бізнес-логіка, стан, валідація, інтеграція з API - все в `domains`
   - Включаючи функціональні React-хуки, які раніше були б у `features`

2. **UI компоненти максимально "тонкі" (FSD outside)**
   - Компоненти в `features` лише відображають дані
   - Не містять бізнес-логіки або стану
   - Отримують всі дані та обробники подій з доменного шару

3. **Строга типізація на всіх рівнях**
   - Чіткі контракти між доменами та UI
   - Типи даних визначаються в доменному шарі

4. **Модульність та дотримання SOLID**
   - Single Responsibility Principle: кожен файл має одну відповідальність
   - Open/Closed Principle: розширення функціоналу без модифікації існуючого коду
   - Liskov Substitution Principle: правильне використання наслідування та поліморфізму
   - Interface Segregation Principle: малі, специфічні інтерфейси
   - Dependency Inversion Principle: залежність від абстракцій, а не конкретних реалізацій

## Структура проекту

```
src/
├── domains/                    # DDD - вся функціональна логіка
│   ├── client/                 # Домен "Клієнт"
│   │   ├── entities/           # Бізнес-сутності
│   │   ├── value-objects/      # Об'єкти-значення
│   │   ├── repositories/       # Інтерфейси та реалізації репозиторіїв
│   │   ├── services/           # Доменні сервіси
│   │   ├── use-cases/          # Сценарії використання
│   │   ├── events/             # Доменні події
│   │   ├── hooks/              # React-хуки для роботи з доменом
│   │   ├── store/              # Zustand сторі для стану домену
│   │   ├── schemas/            # Zod схеми для валідації
│   │   ├── types/              # Типи та інтерфейси
│   │   ├── utils/              # Утиліти специфічні для домену
│   │   └── index.ts            # Публічне API домену
│   │
│   ├── order/                  # Домен "Замовлення"
│   │   ├── entities/
│   │   ├── value-objects/
│   │   ├── repositories/
│   │   ├── services/
│   │   ├── use-cases/
│   │   ├── events/
│   │   ├── hooks/              # React-хуки для роботи з замовленнями
│   │   ├── store/              # Zustand сторі для стану замовлень
│   │   ├── schemas/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   │
│   ├── wizard/                 # Домен "Візард" (управління процесом)
│   │   ├── entities/
│   │   ├── services/
│   │   ├── hooks/              # React-хуки для управління візардом
│   │   ├── store/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   │
│   └── shared/                 # Спільні доменні концепти
│       ├── types/
│       ├── utils/
│       ├── hooks/              # Спільні хуки для доменів
│       └── index.ts
│
├── features/                   # FSD - тільки "тонкі" UI компоненти
│   ├── order-wizard/           # Фіча "Візард замовлень"
│   │   ├── client-selection/   # Підфіча "Вибір клієнта"
│   │   │   ├── ui/             # UI компоненти без логіки
│   │   │   └── index.ts        # Публічне API фічі
│   │   │
│   │   ├── branch-selection/   # Підфіча "Вибір філії"
│   │   │   ├── ui/
│   │   │   └── index.ts
│   │   │
│   │   ├── item-wizard/        # Підфіча "Візард предметів"
│   │   │   ├── ui/
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts            # Композиція всіх підфіч
│   │
│   └── shared/                 # Спільні UI компоненти
│       ├── ui/
│       └── index.ts
│
├── shared/                     # Спільні утиліти та інфраструктура
│   ├── api/                    # API клієнти (OpenAPI)
│   │   ├── client/             # API для роботи з клієнтами
│   │   ├── order/              # API для роботи з замовленнями
│   │   └── index.ts
│   │
│   ├── lib/                    # Загальні утиліти
│   │   ├── validation/         # Утиліти для валідації
│   │   ├── formatting/         # Утиліти для форматування
│   │   ├── hooks/              # Загальні React-хуки (не доменні)
│   │   └── index.ts
│   │
│   ├── ui/                     # Спільні UI компоненти
│   │   ├── atoms/              # Атомарні компоненти
│   │   ├── molecules/          # Молекулярні компоненти
│   │   ├── organisms/          # Організми
│   │   └── index.ts
│   │
│   └── config/                 # Конфігурація
│       ├── api.ts
│       ├── theme.ts
│       └── index.ts
│
├── app/                        # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── order-wizard/           # Маршрути для Order Wizard
│       └── page.tsx
│
└── pages/                      # Next.js Pages Router (якщо використовується)
    └── api/                    # API маршрути
```

## Правила найменування файлів

### Доменний шар (DDD)

1. **Сутності (Entities)**
   - Файли: `*.entity.ts`
   - Приклад: `client.entity.ts`, `order.entity.ts`

2. **Об'єкти-значення (Value Objects)**
   - Файли: `*.vo.ts`
   - Приклад: `address.vo.ts`, `contact-info.vo.ts`

3. **Репозиторії (Repositories)**
   - Файли: `*.repository.ts`, `*.repository.interface.ts`
   - Приклад: `client.repository.ts`, `order.repository.interface.ts`

4. **Сервіси (Services)**
   - Файли: `*.service.ts`
   - Приклад: `client-search.service.ts`, `price-calculator.service.ts`

5. **Сценарії використання (Use Cases)**
   - Файли: `*.use-case.ts`
   - Приклад: `search-clients.use-case.ts`, `create-order.use-case.ts`

6. **Хуки (Hooks)**
   - Файли: `use-*.hook.ts`
   - Приклад: `use-client-search.hook.ts`, `use-order-creation.hook.ts`

7. **Сторі (Stores)**
   - Файли: `*.store.ts`
   - Приклад: `client-search.store.ts`, `order-creation.store.ts`

8. **Схеми (Schemas)**
   - Файли: `*.schema.ts`
   - Приклад: `client.schema.ts`, `order.schema.ts`

9. **Типи (Types)**
   - Файли: `*.types.ts`
   - Приклад: `client.types.ts`, `order.types.ts`

10. **Перелічення (Enums)**
    - Файли: `*.enum.ts`
    - Приклад: `contact-method.enum.ts`, `order-status.enum.ts`

### UI шар (FSD)

1. **UI компоненти**
   - Файли: `*.tsx`
   - Приклад: `ClientSelectionStep.tsx`, `ItemWizardStep.tsx`

2. **Індексні файли**
   - Файли: `index.ts`
   - Використовуються для експорту публічного API

## Правила імпорту

1. **Імпорт з доменного шару**
   - Завжди імпортуйте через публічне API домену (index.ts)
   - Правильно: `import { useClientSearch } from '@/domains/client';`
   - **НЕПРАВИЛЬНО**: `import { useClientSearch } from '@/domains/client/hooks/use-client-search.hook';`

2. **Імпорт в UI компоненти**
   - UI компоненти повинні імпортувати тільки з доменного шару або спільних компонентів
   - Правильно: `import { useClientSearch } from '@/domains/client';`
   - Правильно: `import { TextField } from '@/shared/ui';`
   - **НЕПРАВИЛЬНО**: `import { clientApi } from '@/shared/api';` (в UI компонентах)

3. **Імпорт між доменами**
   - Уникайте прямих імпортів між доменами
   - Використовуйте події або спільні типи для комунікації
   - Якщо імпорт необхідний, використовуйте тільки публічне API

## Правила роботи з Zustand

1. **Структура сторів**
   - Створюйте окремі сторі для кожної функціональної області в доменному шарі
   - Розділяйте стан і дії
   - Використовуйте типи для строгої типізації

   ```typescript
   // domains/client/store/client-search.store.ts
   import { create } from 'zustand';
   import { ClientSearchState, ClientSearchActions } from '../types';

   export const useClientSearchStore = create<ClientSearchState & ClientSearchActions>((set, get) => ({
     // Стан
     searchTerm: '',
     results: [],
     isLoading: false,
     error: null,

     // Дії
     setSearchTerm: (term) => set({ searchTerm: term }),
     setResults: (results) => set({ results }),
     setLoading: (isLoading) => set({ isLoading }),
     setError: (error) => set({ error }),

     // Складні дії
     search: async (term) => {
       // Логіка пошуку
     },
     // ...інші дії
   }));
   ```

2. **Доступ до сторів**
   - Не використовуйте сторі напряму в UI компонентах
   - Інкапсулюйте доступ до сторів через хуки в доменному шарі

   ```typescript
   // domains/client/hooks/use-client-search.hook.ts
   import { useClientSearchStore } from '../store';

   export const useClientSearch = () => {
     const { searchTerm, results, isLoading, error, setSearchTerm, search } = useClientSearchStore();

     // Додаткова логіка, обробка помилок, трансформації даних

     return {
       searchTerm,
       results,
       isLoading,
       error,
       setSearchTerm,
       search,
     };
   };
   ```

3. **Композиція сторів**
   - Використовуйте композицію для об'єднання функціональності з різних сторів
   - Створюйте композиційні хуки для складних сценаріїв

   ```typescript
   // domains/wizard/hooks/use-wizard-composition.hook.ts
   import { useWizardNavigation } from './use-wizard-navigation.hook';
   import { useWizardValidation } from './use-wizard-validation.hook';

   export const useWizard = () => {
     const navigation = useWizardNavigation();
     const validation = useWizardValidation();

     // Композиція функціональності

     return {
       ...navigation,
       ...validation,
       // Додаткові методи, які використовують обидва хуки
     };
   };
   ```

## Правила роботи з Zod

1. **Визначення схем**
   - Створюйте схеми в доменному шарі в папці `schemas`
   - Використовуйте схеми для валідації вхідних даних
   - Генеруйте типи на основі схем для узгодженості

   ```typescript
   // domains/client/schemas/client.schema.ts
   import { z } from 'zod';

   export const clientSchema = z.object({
     firstName: z.string().min(2, "Ім'я повинно містити мінімум 2 символи"),
     lastName: z.string().min(2, 'Прізвище повинно містити мінімум 2 символи'),
     phone: z.string().min(10, 'Телефон повинен містити мінімум 10 символів'),
     email: z.string().email('Введіть коректний email').optional().nullable(),
     // інші поля
   });

   export type Client = z.infer<typeof clientSchema>;
   ```

2. **Інтеграція з React Hook Form**
   - Використовуйте `zodResolver` для валідації форм
   - Створюйте хуки для роботи з формами в доменному шарі

   ```typescript
   // domains/client/hooks/use-client-form.hook.ts
   import { useForm } from 'react-hook-form';
   import { zodResolver } from '@hookform/resolvers/zod';
   import { clientSchema, Client } from '../schemas';

   export const useClientForm = (initialData?: Partial<Client>) => {
     return useForm<Client>({
       resolver: zodResolver(clientSchema),
       defaultValues: initialData || {
         firstName: '',
         lastName: '',
         phone: '',
         email: '',
       },
     });
   };
   ```

3. **Валідація в доменних сервісах**
   - Використовуйте Zod для валідації вхідних даних в сервісах
   - Створюйте спеціалізовані схеми для різних сценаріїв

   ```typescript
   // domains/client/services/client-validation.service.ts
   import { clientSchema } from '../schemas';

   export class ClientValidationService {
     validateClient(data: unknown) {
       return clientSchema.safeParse(data);
     }

     // Інші методи валідації
   }
   ```

## Правила роботи з API

1. **Структура API клієнтів**
   - Використовуйте згенеровані API клієнти з OpenAPI
   - Створюйте адаптери для перетворення API моделей в доменні сутності
   - Інкапсулюйте роботу з API в репозиторіях

   ```typescript
   // shared/api/client/index.ts
   export * from './generated';
   ```

   ```typescript
   // domains/client/repositories/client.repository.ts
   import { clientApi } from '@/shared/api';
   import { Client } from '../types';
   import { ClientAdapter } from '../utils/client-adapter';

   export class ClientRepository {
     private adapter = new ClientAdapter();

     async findById(id: string): Promise<Client | null> {
       try {
         const apiClient = await clientApi.getClientById(id);
         return this.adapter.toDomain(apiClient);
       } catch (error) {
         return null;
       }
     }

     // Інші методи
   }
   ```

2. **Інтеграція з React Query**
   - Створюйте хуки для роботи з API в доменному шарі
   - Використовуйте React Query для кешування та управління станом запитів

   ```typescript
   // domains/client/hooks/use-client-query.hook.ts
   import { useQuery } from '@tanstack/react-query';
   import { ClientRepository } from '../repositories';

   const clientRepository = new ClientRepository();

   export const useClientQuery = (id: string) => {
     return useQuery({
       queryKey: ['client', id],
       queryFn: () => clientRepository.findById(id),
       enabled: !!id,
     });
   };
   ```

## Правила роботи з UI компонентами

1. **Структура UI компонентів**
   - UI компоненти повинні бути максимально "тонкими"
   - Не повинні містити бізнес-логіки або стану
   - Отримують всі дані та обробники подій з доменних хуків

   ```tsx
   // features/order-wizard/client-selection/ui/ClientSelectionStep.tsx
   'use client';

   import { useClientSearch, useClientSelection } from '@/domains/client';

   export const ClientSelectionStep = () => {
     const { searchTerm, results, isLoading, setSearchTerm, search } = useClientSearch();
     const { selectedClient, selectClient } = useClientSelection();

     return (
       <div>
         {/* UI компоненти */}
       </div>
     );
   };
   ```

2. **Директива 'use client'**
   - Завжди додавайте директиву `'use client'` на початку файлу для Client Components
   - Компоненти з хуками (useState, useEffect) повинні бути Client Components
   - Material UI компоненти з інтерактивністю також мають бути в Client Components

3. **MUI7 Grid специфіка**
   - **ВАЖЛИВО**: Не використовуйте атрибут `item` (видалено у MUI7)
   - Використовуйте атрибут `size` замість `xs`, `sm`, `md`, `lg`, `xl`
   - Правильно:

   ```tsx
   <Grid container spacing={2}>
     <Grid size={{ xs: 12, sm: 6 }}>
       <Box>Вміст</Box>
     </Grid>
   </Grid>
   ```

   - **НЕПРАВИЛЬНО**:

   ```tsx
   <Grid container spacing={2}>
     <Grid item xs={12} sm={6}>
       <Box>Вміст</Box>
     </Grid>
   </Grid>
   ```

## Правила роботи з формами

1. **Структура форм**
   - Використовуйте React Hook Form для управління формами
   - Використовуйте Zod для валідації
   - Створюйте хуки для роботи з формами в доменному шарі

   ```tsx
   // features/order-wizard/client-selection/ui/ClientForm.tsx
   'use client';

   import { useClientForm, useClientMutations } from '@/domains/client';

   export const ClientForm = () => {
     const { register, handleSubmit, formState: { errors } } = useClientForm();
     const { createClient, isLoading } = useClientMutations();

     const onSubmit = handleSubmit((data) => {
       createClient(data);
     });

     return (
       <form onSubmit={onSubmit}>
         {/* Поля форми */}
       </form>
     );
   };
   ```

2. **Інтеграція з MUI**
   - Використовуйте Controller для інтеграції з MUI компонентами
   - Створюйте спеціалізовані компоненти для повторного використання

   ```tsx
   // features/order-wizard/client-selection/ui/ClientForm.tsx
   'use client';

   import { Controller } from 'react-hook-form';
   import { TextField } from '@mui/material';
   import { useClientForm } from '@/domains/client';

   export const ClientForm = () => {
     const { control, handleSubmit } = useClientForm();

     return (
       <form onSubmit={handleSubmit(onSubmit)}>
         <Controller
           name="firstName"
           control={control}
           render={({ field, fieldState: { error } }) => (
             <TextField
               {...field}
               label="Ім'я"
               error={!!error}
               helperText={error?.message}
             />
           )}
         />
         {/* Інші поля */}
       </form>
     );
   };
   ```

## Правила роботи з Windsurf IDE

1. **Автоматичне створення файлів**
   - Використовуйте команду "New File" в Windsurf IDE для створення нових файлів
   - Дотримуйтесь правил найменування файлів
   - Використовуйте правильні розширення файлів (.ts, .tsx)

2. **Автоматичне створення компонентів**
   - Використовуйте команду "New Component" в Windsurf IDE для створення нових компонентів
   - Вибирайте правильний тип компонента (Client Component, Server Component)
   - Дотримуйтесь правил структури компонентів

3. **Автоматичне створення хуків**
   - Використовуйте команду "New Hook" в Windsurf IDE для створення нових хуків
   - Дотримуйтесь правил найменування хуків (use-*.hook.ts)
   - Дотримуйтесь правил структури хуків

4. **Автоматичне створення сторів**
   - Використовуйте команду "New Store" в Windsurf IDE для створення нових сторів
   - Дотримуйтесь правил найменування сторів (*.store.ts)
   - Дотримуйтесь правил структури сторів

5. **Автоматичне створення схем**
   - Використовуйте команду "New Schema" в Windsurf IDE для створення нових схем
   - Дотримуйтесь правил найменування схем (*.schema.ts)
   - Дотримуйтесь правил структури схем

6. **Автоматичне створення типів**
   - Використовуйте команду "New Type" в Windsurf IDE для створення нових типів
   - Дотримуйтесь правил найменування типів (*.types.ts)
   - Дотримуйтесь правил структури типів

7. **Автоматичне створення сутностей**
   - Використовуйте команду "New Entity" в Windsurf IDE для створення нових сутностей
   - Дотримуйтесь правил найменування сутностей (*.entity.ts)
   - Дотримуйтесь правил структури сутностей

8. **Автоматичне створення об'єктів-значень**
   - Використовуйте команду "New Value Object" в Windsurf IDE для створення нових об'єктів-значень
   - Дотримуйтесь правил найменування об'єктів-значень (*.vo.ts)
   - Дотримуйтесь правил структури об'єктів-значень

9. **Автоматичне створення репозиторіїв**
   - Використовуйте команду "New Repository" в Windsurf IDE для створення нових репозиторіїв
   - Дотримуйтесь правил найменування репозиторіїв (*.repository.ts)
   - Дотримуйтесь правил структури репозиторіїв

10. **Автоматичне створення сервісів**
    - Використовуйте команду "New Service" в Windsurf IDE для створення нових сервісів
    - Дотримуйтесь правил найменування сервісів (*.service.ts)
    - Дотримуйтесь правил структури сервісів

11. **Автоматичне створення сценаріїв використання**
    - Використовуйте команду "New Use Case" в Windsurf IDE для створення нових сценаріїв використання
    - Дотримуйтесь правил найменування сценаріїв використання (*.use-case.ts)
    - Дотримуйтесь правил структури сценаріїв використання

12. **Автоматичне створення подій**
    - Використовуйте команду "New Event" в Windsurf IDE для створення нових подій
    - Дотримуйтесь правил найменування подій (*.event.ts)
    - Дотримуйтесь правил структури подій

## Шаблони для Windsurf IDE

### Шаблон для доменної сутності

```typescript
// domains/[domain]/entities/[name].entity.ts
import { Entity } from '@/domains/shared/types';

export class [Name]Entity implements Entity<string> {
  constructor(
    public readonly id: string,
    // Інші властивості
  ) {}

  // Методи
}
```

### Шаблон для об'єкта-значення

```typescript
// domains/[domain]/value-objects/[name].vo.ts
import { ValueObject } from '@/domains/shared/types';

export class [Name]VO implements ValueObject {
  constructor(
    // Властивості
  ) {}

  // Методи
}
```

### Шаблон для репозиторію

```typescript
// domains/[domain]/repositories/[name].repository.ts
import { [Name]Entity } from '../entities';

export interface [Name]Repository {
  findById(id: string): Promise<[Name]Entity | null>;
  // Інші методи
}

export class [Name]RepositoryImpl implements [Name]Repository {
  async findById(id: string): Promise<[Name]Entity | null> {
    // Реалізація
  }
  // Інші методи
}
```

### Шаблон для сервісу

```typescript
// domains/[domain]/services/[name].service.ts
import { [Name]Entity } from '../entities';

export class [Name]Service {
  // Методи
}
```

### Шаблон для сценарію використання

```typescript
// domains/[domain]/use-cases/[name].use-case.ts
import { UseCase } from '@/domains/shared/types';

export interface [Name]UseCaseInput {
  // Вхідні дані
}

export interface [Name]UseCaseOutput {
  // Вихідні дані
}

export class [Name]UseCase implements UseCase<[Name]UseCaseInput, [Name]UseCaseOutput> {
  constructor(
    // Залежності
  ) {}

  async execute(input: [Name]UseCaseInput): Promise<[Name]UseCaseOutput> {
    // Реалізація
  }
}
```

### Шаблон для хука

```typescript
// domains/[domain]/hooks/use-[name].hook.ts
import { useState, useCallback } from 'react';

export const use[Name] = () => {
  // Стан та логіка

  return {
    // Повертаємі значення та методи
  };
};
```

### Шаблон для стора

```typescript
// domains/[domain]/store/[name].store.ts
import { create } from 'zustand';
import { [Name]State, [Name]Actions } from '../types';

export const use[Name]Store = create<[Name]State & [Name]Actions>((set, get) => ({
  // Стан

  // Дії
}));
```

### Шаблон для схеми

```typescript
// domains/[domain]/schemas/[name].schema.ts
import { z } from 'zod';

export const [name]Schema = z.object({
  // Властивості
});

export type [Name] = z.infer<typeof [name]Schema>;
```

### Шаблон для типів

```typescript
// domains/[domain]/types/[name].types.ts
export interface [Name] {
  // Властивості
}

export interface [Name]State {
  // Властивості стану
}

export interface [Name]Actions {
  // Методи
}
```

### Шаблон для UI компонента

```tsx
// features/[feature]/[subfeature]/ui/[Name].tsx
'use client';

import { FC } from 'react';
import { use[Name] } from '@/domains/[domain]';

interface [Name]Props {
  // Властивості
}

export const [Name]: FC<[Name]Props> = (props) => {
  const { /* значення та методи */ } = use[Name]();

  return (
    <div>
      {/* UI */}
    </div>
  );
};
```

## Важливі зауваження та запобігання типовим помилкам

1. **Не змішуйте бізнес-логіку з UI**
   - Вся бізнес-логіка повинна бути в доменному шарі
   - UI компоненти повинні бути максимально "тонкими"

2. **Не використовуйте прямі імпорти з глибоких шляхів**
   - Завжди імпортуйте через публічне API (index.ts)
   - Це забезпечує гнучкість при рефакторингу

3. **Не дублюйте логіку між доменами**
   - Використовуйте спільні утиліти та типи
   - Створюйте абстракції для повторного використання

4. **Не створюйте циклічні залежності**
   - Уникайте взаємних імпортів між модулями
   - Використовуйте події або спільні типи для комунікації

5. **Не ігноруйте типізацію**
   - Уникайте використання `any` та `unknown` без явної необхідності
   - Використовуйте строгу типізацію для всіх змінних та функцій

6. **Не змішуйте різні підходи**
   - Дотримуйтесь принципу "DDD inside, FSD outside"
   - Не додавайте бізнес-логіку в UI компоненти

7. **Не створюйте великі файли**
   - Розбивайте логіку на малі, спеціалізовані модулі
   - Дотримуйтесь принципу Single Responsibility (SRP)

8. **Не ігноруйте правила найменування**
   - Дотримуйтесь правил найменування файлів та папок
   - Це забезпечує узгодженість та зрозумілість коду

9. **Не забувайте про тести**
   - Пишіть тести для доменної логіки
   - Використовуйте моки для зовнішніх залежностей

10. **Не ігноруйте документацію**
    - Документуйте публічне API доменів
    - Додавайте коментарі до складних алгоритмів

## Процес додавання нової функціональності

1. **Визначення доменної моделі**
   - Ідентифікуйте сутності, об'єкти-значення, агрегати
   - Визначте бізнес-правила та обмеження

2. **Створення доменних об'єктів**
   - Створіть сутності, об'єкти-значення, репозиторії, сервіси
   - Реалізуйте бізнес-логіку

3. **Створення сторів та хуків**
   - Створіть сторі для управління станом
   - Створіть хуки для доступу до функціональності

4. **Створення UI компонентів**
   - Створіть "тонкі" UI компоненти
   - Інтегруйте їх з доменними хуками

5. **Інтеграція з маршрутизацією**
   - Додайте нові сторінки або маршрути
   - Інтегруйте компоненти з маршрутизацією

6. **Тестування**
   - Напишіть тести для доменної логіки
   - Протестуйте UI компоненти

7. **Документація**
   - Документуйте публічне API
   - Оновіть документацію проекту

## Висновок

Підхід "DDD inside, FSD outside" з усією функціональною логікою в доменному шарі дозволяє:

1. Чітко розділити відповідальність між бізнес-логікою та UI
2. Забезпечити строгу типізацію на всіх рівнях
3. Уникнути дублювання логіки
4. Спростити тестування
5. Зробити UI компоненти максимально простими та зосередженими тільки на відображенні
6. Полегшити підтримку та розширення функціоналу

Ця архітектура особливо корисна для великих проектів з складною бізнес-логікою, де важливо забезпечити чіткі межі між різними частинами системи та уникнути "спагеті-коду".
