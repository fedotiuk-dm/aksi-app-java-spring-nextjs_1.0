# Етап 1: Клієнт та базова інформація замовлення

## Призначення

Перший етап Order Wizard відповідає за:

- Вибір або створення клієнта
- Ініціалізацію базової інформації замовлення

## Архітектура

Етап побудований за принципами "DDD inside, FSD outside" з використанням:

- **Zod** для валідації типів
- **Адаптери** для інтеграції з API
- **OperationResult** патерн для обробки результатів
- **Singleton** патерн для сервісів

## Підетапи

### 1.1. Client Management (client-management/)

Управління клієнтами:

- **Сервіси:**

  - `ClientSearchService` - пошук існуючих клієнтів за різними критеріями
  - Перевірка унікальності телефону та email
  - Трансформація даних з API до доменних типів

- **Типи:**
  - `ClientData` - базові дані клієнта з Zod валідацією
  - `ClientSearchResult` - результат пошуку клієнта
  - `ContactMethod` - способи зв'язку (телефон, SMS, Viber)
  - `InformationSource` - джерела інформації про хімчистку

### 1.2. Order Initialization (order-initialization/)

Ініціалізація замовлення:

- **Сервіси:**

  - `OrderInitializationService` - генерація номерів квитанцій, валідація міток
  - Управління філіями
  - Валідація унікальних міток

- **Типи:**
  - `OrderInitializationData` - базові дані замовлення з Zod валідацією
  - `Branch` - інформація про філію
  - `OrderBasicInfo` - повна базова інформація замовлення

## Використання

```typescript
import {
  clientSearchService,
  orderInitializationService,
  type ClientData,
  type OrderInitializationData,
} from '@/domain/wizard/services/stage-1-client-and-order-info';

// Пошук клієнтів
const searchResult = await clientSearchService.searchClients('Іванов', 0, 20);

// Генерація номера квитанції
const receiptResult = await orderInitializationService.generateReceiptNumber({
  branchId: 'branch-1',
  date: new Date(),
});

// Ініціалізація замовлення
const orderData: OrderInitializationData = {
  receiptNumber: receiptResult.data!,
  uniqueLabel: 'ORDER-001',
  branchId: 'branch-1',
  createdAt: new Date(),
};

const initResult = await orderInitializationService.initializeOrder(orderData);
```

## Інтеграція з адаптерами

Сервіси інтегруються з наступними адаптерами:

- `client` - для роботи з клієнтами
- `branch` - для роботи з філіями

## Валідація

Всі дані валідуються через Zod схеми:

- `clientDataSchema` - валідація даних клієнта
- `orderInitializationSchema` - валідація даних замовлення
- `uniqueLabelSchema` - валідація унікальних міток

## Обробка помилок

Всі сервіси використовують `OperationResult<T>` патерн для уніфікованої обробки результатів:

```typescript
interface OperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: string[];
}
```
