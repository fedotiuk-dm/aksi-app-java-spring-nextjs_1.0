# Order Domain (Домен Замовлень)

Домен Order реалізує всю бізнес-логіку роботи з замовленнями хімчистки згідно з принципами DDD (Domain-Driven Design).

## Архітектура

Домен організований за принципом "DDD inside, FSD outside" з модульною структурою:

```
domain/order/
├── types/                    # Типи та інтерфейси
│   ├── order.types.ts       # Основні типи замовлень
│   └── modules/             # Модульні типи
│       ├── order-item.types.ts
│       ├── financial.types.ts
│       ├── completion.types.ts
│       ├── photo.types.ts
│       ├── discount.types.ts
│       └── status.types.ts
├── entities/                # Доменні сутності
│   ├── order.entity.ts      # Головна сутність замовлення
│   └── modules/             # Модульні сутності
│       ├── order-item.entity.ts
│       └── financial.entity.ts
├── schemas/                 # Zod схеми валідації
│   ├── order.schema.ts      # Основні схеми
│   └── modules/             # Модульні схеми
│       ├── order-item.schema.ts
│       └── financial.schema.ts
├── repositories/            # Репозиторії для доступу до даних
│   └── order.repository.ts
├── utils/                   # Утиліти та адаптери
│   ├── order.adapter.ts     # API ↔ Domain адаптер
│   ├── order.formatter.ts   # Форматування для UI
│   └── price.calculator.ts  # Розрахунок цін
├── store/                   # Zustand стор
│   └── order.store.ts
└── index.ts                 # Публічне API
```

## Основні компоненти

### 1. Типи (Types)

#### Основні типи:

- `Order` - головний інтерфейс замовлення
- `OrderItem` - предмет замовлення
- `OrderStatus` - статуси замовлення
- `ExpediteType` - типи терміновості

#### Модульні типи:

- **OrderItem**: дефекти, плями, матеріали, модифікатори цін
- **Financial**: знижки, оплата, фінансові розрахунки
- **Completion**: розрахунок термінів виконання
- **Photo**: фотодокументація предметів
- **Discount**: система знижок
- **Status**: історія статусів

### 2. Сутності (Entities)

#### OrderEntity

Головна доменна сутність з бізнес-логікою:

- Валідація замовлення
- Розрахунок прогресу
- Перевірка можливості операцій
- Пошук за критеріями

#### OrderItemEntity

Сутність предмета замовлення:

- Розрахунок цін з модифікаторами
- Аналіз дефектів та плям
- Визначення пріоритету обробки

#### OrderFinancialsEntity

Фінансові розрахунки:

- Застосування знижок
- Розрахунок терміновості
- Управління оплатою

### 3. Схеми валідації (Schemas)

Zod схеми для валідації форм та API:

- `createOrderSchema` - створення замовлення
- `updateOrderSchema` - оновлення замовлення
- `orderSearchSchema` - пошук замовлень
- Модульні схеми для предметів та фінансів

### 4. Репозиторії (Repositories)

#### OrderRepository

Інкапсулює доступ до API:

- CRUD операції
- Пошук та фільтрація
- Статистика

### 5. Утиліти (Utils)

#### OrderAdapter

Перетворення між API DTO та доменними об'єктами

#### OrderFormatter

Форматування даних для UI українською мовою

#### PriceCalculator

Розрахунок цін згідно з бізнес-правилами хімчистки

### 6. Store (Zustand)

Централізоване управління станом:

- CRUD операції
- Пошук та фільтрація
- Управління помилками
- Кешування даних

## Бізнес-правила

### Розрахунок цін

1. **Базова ціна** з прайс-листа
2. **Модифікатори**:
   - Дитячі речі: -30%
   - Ручна чистка: +20%
   - Сильні забруднення: +20-100%
   - Терміновість: +50% (48h) або +100% (24h)
3. **Знижки** (не діють на прання, прасування, фарбування):
   - Еверкард: 10%
   - Соцмережі: 5%
   - ЗСУ: 10%
   - Індивідуальна: до 100%

### Статуси замовлення

- `DRAFT` - Чернетка
- `NEW` - Нове
- `IN_PROGRESS` - В роботі
- `COMPLETED` - Завершено
- `DELIVERED` - Видано
- `CANCELLED` - Скасовано

### Терміни виконання

- Стандартно: 48 годин (звичайні речі), 14 днів (шкіра)
- Терміново 48h: +50% до вартості
- Терміново 24h: +100% до вартості

## Використання

### Імпорт

```typescript
import {
  useOrderStore,
  OrderEntity,
  OrderStatus,
  createOrderSchema,
  OrderFormatter,
  PriceCalculator,
} from '@/domain/order';
```

### Створення замовлення

```typescript
const orderStore = useOrderStore();

const newOrder = OrderEntity.fromObject({
  receiptNumber: 'R-001',
  client: clientData,
  branchLocation: branchData,
  status: OrderStatus.DRAFT,
  items: [],
});

const result = await orderStore.createOrder(newOrder.toPlainObject());
```

### Розрахунок ціни

```typescript
const calculation = PriceCalculator.calculateFinalAmount(
  items,
  DiscountType.MILITARY,
  10,
  ExpediteType.EXPRESS_48H
);
```

### Форматування

```typescript
const statusText = OrderFormatter.formatStatus(OrderStatus.IN_PROGRESS);
const amountText = OrderFormatter.formatAmount(1250.5);
const dateText = OrderFormatter.formatDate(new Date());
```

## Розширення

Для додавання нової функціональності:

1. **Нові типи** - додати в `types/modules/`
2. **Нова бізнес-логіка** - розширити entities
3. **Нові валідації** - додати схеми в `schemas/modules/`
4. **Нові утиліти** - додати в `utils/`
5. **Експорт** - оновити `index.ts` файли

## Тестування

```typescript
// Приклад тесту сутності
describe('OrderEntity', () => {
  it('should calculate progress correctly', () => {
    const order = OrderEntity.fromObject(mockOrderData);
    expect(order.getProgressPercentage()).toBe(60);
  });
});
```

## Інтеграція з UI

Домен надає "тонкі" хуки для UI компонентів:

```typescript
// В UI компоненті
const { orders, isLoading, searchOrders } = useOrderStore();
```

UI компоненти не містять бізнес-логіки - вся логіка інкапсульована в доменному шарі.
