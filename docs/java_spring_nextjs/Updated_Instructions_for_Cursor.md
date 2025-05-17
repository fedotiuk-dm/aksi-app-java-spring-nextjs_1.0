# Оновлена інструкція для Cursor IDE: Розробка проекту "Хімчистка AKSI"

## Актуальний технологічний стек

1. **Domain-Driven Design (DDD)** - для бекенду
2. **Feature-Sliced Design (FSD)** - для фронтенду
3. **SOLID** принципи - для всього проекту

### Бекенд

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
- **Керування станом:** React Context API (локально) + Zustand 5.0.3 (глобально)
- **API/Бекенд взаємодія:** React Query 5.72.2 + Axios 1.8.4
- **Форми:** React Hook Form 7.55.0
- **Валідація:** Zod 3.24.2
- **Дати:** Day.js 1.11.13
- **Тестування:** Vitest 3.1.1 + React Testing Library 16.3.0
- **Локалізація (i18n):** next-intl 4.0.2

## Архітектурні принципи та методології

### Бекенд: Domain-Driven Design (DDD)

DDD - архітектурний підхід, зосереджений на моделюванні програмного забезпечення відповідно до бізнес-доменів:

- **Сутності (Entity)** - об'єкти з унікальною ідентичністю

  - **ОБОВ'ЯЗКОВО** мають суфікс "Entity" (ClientEntity, OrderEntity)
  - Містять бізнес-логіку, пов'язану з ними
  - Об'єднуються в агрегати

- **Агрегати (Aggregate)** - групи об'єктів, які розглядаються як єдине ціле

  - Мають кореневу сутність (Aggregate Root)
  - Забезпечують узгодженість даних

- **Репозиторії (Repository)** - абстракції для доступу до даних

  - Один репозиторій для одного агрегату
  - Використовують Spring Data JPA

- **Сервіси домену (Domain Services)** - операції, які не належать до сутностей

  - Містять бізнес-логіку, що охоплює декілька сутностей
  - Транзакційна логіка

- **Об'єкти передачі даних (DTO)** - для передачі даних між шарами
  - \*Request класи для вхідних даних
  - \*Response класи для вихідних даних
  - \*DTO класи для внутрішнього обміну

### Фронтенд: Feature-Sliced Design (FSD)

FSD - методологія архітектури фронтенду, зосереджена на розділенні функціональних можливостей:

- **Шари (Layers)** - горизонтальне розділення коду:

  - **app** - композиція всього додатку, конфігурації
  - **processes** - складні бізнес-процеси (наприклад, OrderWizard)
  - **pages** - сторінки додатку
  - **widgets** - повторно використовувані блоки інтерфейсу
  - **features** - функціональні модулі для взаємодії користувача
  - **entities** - бізнес-сутності
  - **shared** - спільні утиліти та компоненти

- **Слайси (Slices)** - вертикальне розділення функціоналу:

  - Організація коду за бізнес-доменами
  - Ізоляція функціональних модулів

- **Сегменти (Segments)** - розділення коду всередині слайсу:
  - **ui** - компоненти інтерфейсу
  - **model** - бізнес-логіка та стан
  - **api** - взаємодія з API
  - **lib** - допоміжна логіка

## Docker-середовище

Проект **обов'язково** працює в Docker-середовищі:

- **backend** - Spring Boot додаток
- **frontend** - Next.js додаток
- **postgres** - PostgreSQL база даних

Взаємодія між контейнерами:

- Використовувати Docker-імена для комунікації (не localhost)
- Backend доступний для frontend як http://backend:8080
- PostgreSQL доступний для backend як jdbc:postgresql://postgres:5432/aksi_db

## Актуальна структура бази даних

На основі файлу `db_schema_details.txt` структура БД включає:

### Клієнти та комунікація

- **clients** - інформація про клієнтів
- **client_communication_channels** - канали комунікації з клієнтами

### Замовлення та предмети

- **orders** - замовлення клієнтів
- **order_items** - предмети в замовленні
- **order_item_photos** - фотографії предметів

### Ціноутворення та категорії

- **service_categories** - категорії послуг
- **price_list_items** - елементи прайс-листа

### Філії та користувачі

- **branch_locations** - філії хімчистки
- **users** - користувачі системи
- **login** - дані для входу

## Важливі правила розробки

### 1. API та URL структура

- Контекстний шлях бекенду: `/api`
- URL для запитів до бекенду: `${SERVER_API_URL}/api/resource_path`
- **НЕПРАВИЛЬНО**: `${SERVER_API_URL}/resource_path`
- У контролерах не додавати `/api` до маршрутів (додається автоматично)
- Правильно: `@RequestMapping("/clients")`
- **НЕПРАВИЛЬНО**: `@RequestMapping("/api/clients")`

### 2. OpenAPI для API взаємодії

- Використовувати згенеровані API клієнти з `/lib/api/generated`
- Для генерації: `npm run generate-api:docker`
- Не імпортувати напряму з `/lib/api/generated` - використовувати індексні файли
- Правильний імпорт: `import { useClients } from '@/features/clients/api';`

### 3. MUI7 Grid специфіка

- **ВАЖЛИВО**: Не використовувати атрибут `item` (видалено у MUI7)
- Використовувати атрибут `size` замість `xs`, `sm`, `md`, `lg`, `xl`
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

### 4. JPA сутності

- **ОБОВ'ЯЗКОВО** додавати суфікс "Entity" до назв сутностей
- Правильно: `ClientEntity`, `OrderEntity`
- **НЕПРАВИЛЬНО**: `Client`, `Order`
- Це гарантує чітке розмежування типів об'єктів

### 5. Міграції Liquibase

- Завжди створювати нові міграції для змін у БД
- Не змінювати вже застосовані файли міграцій
- Використовувати відповідний формат іменування: `db.changelog-X.Y.yaml`

### 6. DDD найменування доменних об'єктів

- Називати класи відповідно до їх ролі в DDD:
  - Сутності: `*Entity.java`
  - Репозиторії: `*Repository.java`
  - Сервіси: `*Service.java` і `*ServiceImpl.java`
  - DTO: `*Request.java`, `*Response.java`, `*DTO.java`

### 7. Server Components та Client Components

- Завжди додавайте директиву `'use client'` на початку файлу для Client Components
- Компоненти з хуками (useState, useEffect) повинні бути Client Components
- Material UI компоненти з інтерактивністю також мають бути в Client Components
- Приклад правильного розподілу:

```tsx
// app/orders/page.tsx (Server Component)
import OrdersList from '@/features/orders/components/OrdersList';

export default async function OrdersPage() {
  // Дані завантажуються на сервері
  const orders = await fetchOrders();
  return <OrdersList initialOrders={orders} />;
}

// features/orders/components/OrdersList.tsx (Client Component)
'use client';
import { useState } from 'react';

export default function OrdersList({ initialOrders }) {
  const [filteredOrders, setFilteredOrders] = useState(initialOrders);
  return (/* ... */);
}
```

## OrderWizard: нова реалізація з Zustand, React Hook Form і React Query

### 1. Zustand для машини станів

```typescript
// Визначення машини станів для OrderWizard
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
  orderData: any; // Замінити на типізовані дані
  goTo: (state: WizardState) => void;
  updateOrderData: (data: Partial<any>) => void;
  // інші методи та стан
}

export const useOrderWizardStore = create<OrderWizardState>((set) => ({
  currentState: 'clientSelection',
  orderData: {},
  goTo: (state) => set({ currentState: state }),
  updateOrderData: (data) =>
    set((state) => ({
      orderData: { ...state.orderData, ...data },
    })),
  // інші методи та стан
}));
```

### 2. React Hook Form + Zod для форм

```typescript
// Схема валідації для клієнта
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const clientSchema = z.object({
  firstName: z.string().min(2, "Ім'я повинно містити мінімум 2 символи"),
  lastName: z.string().min(2, 'Прізвище повинно містити мінімум 2 символи'),
  phone: z.string().min(10, 'Телефон повинен містити мінімум 10 символів'),
  email: z.string().email('Введіть коректний email').optional().nullable(),
  // інші поля
});

export type ClientFormData = z.infer<typeof clientSchema>;

// Використання у компоненті
export function ClientForm() {
  const { control, handleSubmit } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
    },
  });

  // Решта компонента
}
```

### 3. React Query для запитів до API

```typescript
// Хук для отримання клієнтів
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

## Правила використання шрифтів

### Geist Font

- При імпорті шрифту Geist вказуйте `subsets: ['latin']`
- Для кириличних символів використовуйте локальні версії шрифтів
- Приклад правильного імпорту:

```typescript
import { Geist } from 'next/font/google';

const geistSans = Geist({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['sans-serif'],
});
```

## Правила роботи з формами

### React Hook Form та Zod

- Завжди використовуйте `zodResolver` для валідації
- Створюйте схеми валідації окремо
- Використовуйте Controller для інтеграції з MUI
- Приклад:

```tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Окрема схема валідації
const loginSchema = z.object({
  email: z.string().email('Введіть коректний email'),
  password: z.string().min(6, 'Пароль має містити мінімум 6 символів'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Використання React Hook Form з Zod
const {
  control,
  handleSubmit,
  formState: { errors },
} = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
  defaultValues: { email: '', password: '' },
});
```

## Правила роботи з даними

### Axios та React Query

- Налаштовуйте базовий URL та інтерцептори в `lib/axios.ts`
- Централізуйте API-запити в папці `features/*/api/`
- Використовуйте хуки React Query для управління станом запитів

## Процес додавання нової сутності в DDD

При створенні нових доменних об'єктів дотримуйтесь наступного порядку:

1. **Створення Entity класу** в пакеті відповідного домену

   - Додати JPA анотації
   - Налаштувати зв'язки з іншими сутностями
   - Вказати анотації для валідації

2. **Створення Repository інтерфейсу** для сутності

   - Наслідуватись від JpaRepository

3. **Створення міграції бази даних** з Liquibase

   - Додати новий changeSet

4. **Створення DTO класів** для передачі даних між шарами

   - Визначити класи запитів та відповідей

5. **Створення Mapper інтерфейсу** для конвертації між Entity та DTO
   - Використовувати MapStruct

```java
// 1. Entity
@Entity
@Table(name = "products")
public class ProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    // інші поля
}

// 2. Repository
public interface ProductRepository extends JpaRepository<ProductEntity, UUID> {
    // додаткові методи пошуку
}
```

## Важливі зауваження та запобігання типовим помилкам

- **Завжди синхронізуйте міграції** з Entity класами
- **Не змінюйте існуючі міграції** - створюйте нові для модифікації схеми
- **Перевіряйте міграції** на локальному оточенні перед коммітом
- **Дотримуйтесь naming conventions** - snake_case для таблиць, PascalCase для Java класів
- **Уникайте змішування різних інтерфейсів** для однакових сутностей
- **Не використовуйте неперевірені дані** в SQL запитах для запобігання ін'єкціям
