# Рефакторинг адаптерів: нова структура

## Принципи

1. **Один файл = одна відповідальність**
2. **Максимум 150 рядків на файл**
3. **Плоска структура без вкладених папок**
4. **Чіткий неймінг: `[entity].[operation].adapter.ts`**

## Нова структура

```
adapters/
├── order/
│   ├── order.mapper.ts              # Маппінг OrderDTO ↔ OrderSummary
│   ├── order.api.ts                 # API виклики для замовлень
│   ├── order-payment.mapper.ts      # Маппінг платіжних даних
│   ├── order-payment.api.ts         # API виклики для платежів
│   ├── order-discount.mapper.ts     # Маппінг знижок
│   ├── order-discount.api.ts        # API виклики для знижок
│   ├── order-receipt.mapper.ts      # Маппінг квитанцій
│   ├── order-receipt.api.ts         # API виклики для квитанцій
│   └── index.ts                     # Експорт всіх функцій
│
├── client/
│   ├── client.mapper.ts             # Маппінг ClientDTO ↔ Client
│   ├── client.api.ts                # API виклики для клієнтів
│   └── index.ts
│
├── branch/
│   ├── branch.mapper.ts             # Маппінг BranchDTO ↔ Branch
│   ├── branch.api.ts                # API виклики для філій
│   └── index.ts
│
├── order-item/
│   ├── order-item.mapper.ts         # Маппінг OrderItemDTO ↔ OrderItem
│   ├── order-item.api.ts            # API виклики для предметів
│   └── index.ts
│
├── pricing/
│   ├── pricing.mapper.ts            # Маппінг цін
│   ├── pricing.api.ts               # API виклики для цін
│   └── index.ts
│
└── index.ts                         # Головний експорт
```

## Приклади використання

### Замість:

```typescript
import { OrderAdapter } from '@/domains/wizard/adapters';
const order = await OrderAdapter.getById(id);
```

### Тепер:

```typescript
import { getOrderById } from '@/domains/wizard/adapters/order';
const order = await getOrderById(id);
```

### Або для специфічних операцій:

```typescript
import { mapOrderDTOToDomain } from '@/domains/wizard/adapters/order';
import { applyOrderDiscount } from '@/domains/wizard/adapters/order';
```

## Переваги

1. **Простіше тестування**: кожна функція в окремому файлі
2. **Легше знайти**: плоска структура, зрозумілі назви
3. **Менше імпортів**: імпортуємо тільки потрібні функції
4. **Кращий tree-shaking**: бандлер видалить невикористаний код
