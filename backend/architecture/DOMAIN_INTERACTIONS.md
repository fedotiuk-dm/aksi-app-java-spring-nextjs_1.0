# Взаємодія між доменами

## Принципи взаємодії

1. **Loose Coupling** - домени мінімально залежать один від одного
2. **Event-Driven** - комунікація через події де можливо
3. **API Contracts** - чіткі контракти між доменами
4. **Data Consistency** - eventual consistency між доменами

## Діаграма взаємодії

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│    Auth     │────▶│   Customer   │◀────│   Branch    │
└──────┬──────┘     └──────┬───────┘     └──────┬──────┘
       │                   │                    │
       ▼                   ▼                    ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│    Cart     │────▶│   Service    │◀────│   Pricing   │
└──────┬──────┘     └──────┬───────┘     └──────┬──────┘
       │                   │                    │
       ▼                   ▼                    ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│    Order    │────▶│   Payment    │────▶│   Receipt   │
└──────┬──────┘     └──────────────┘     └──────┬──────┘
       │                                        │
       └────────────────▶┌──────────────┐◀──────┘
                         │ Notification │
                         └──────────────┘
```

## Детальний опис взаємодій

### 1. Cart Domain - інтерактивна корзина для розрахунків

**Призначення:**
- Тимчасове зберігання предметів до створення замовлення
- Інтерактивний розрахунок цін в реальному часі
- Застосування глобальних параметрів (терміновість, знижки)

**Залежності:**
- Customer (для прив'язки корзини)
- Service (для отримання базових цін)
- Pricing (для розрахунку з модифікаторами)

**API endpoints:**
```
POST   /api/cart                    - створити корзину
GET    /api/cart/{cartId}          - отримати корзину
POST   /api/cart/{cartId}/items    - додати предмет
PUT    /api/cart/{cartId}/items/{itemId} - оновити предмет
DELETE /api/cart/{cartId}/items/{itemId} - видалити предмет
PUT    /api/cart/{cartId}/urgency  - змінити терміновість
PUT    /api/cart/{cartId}/discount - застосувати знижку
POST   /api/cart/{cartId}/calculate - перерахувати всі ціни
POST   /api/cart/{cartId}/checkout - створити замовлення з корзини
```

### 2. Order Domain - центральний домен

**Залежності:**
- Cart (створюється з готової корзини)
- Customer (для прив'язки замовлення)
- Branch (для визначення місця прийому)
- Service (для вибору послуг та предметів з каталогу)
- Pricing (для розрахунку вартості)

**Особливості:**
- Характеристики предметів (матеріал, колір, дефекти) фіксуються в OrderItem
- Фотографії робляться при створенні замовлення
- Замовлення створюється з готової корзини з усіма розрахунками

**Події, які генерує:**
- `OrderCreatedEvent`
- `OrderItemAddedEvent` (включає всі характеристики)
- `OrderStatusChangedEvent`
- `OrderCompletedEvent`

**API endpoints:**
```
POST /api/orders - створити замовлення
GET /api/orders/{id} - отримати замовлення
PUT /api/orders/{id}/items - додати предмет з характеристиками
PUT /api/orders/{id}/status - змінити статус
```

### 3. Cart → Service + Pricing

**Взаємодія:**
- Cart використовує Service domain для отримання базових цін
- Cart викликає Pricing для кожного предмета з усіма характеристиками
- При зміні глобальних параметрів (терміновість, знижка) - перераховується вся корзина
- Всі розрахунки зберігаються в корзині до створення замовлення

**Особливості розрахунку:**
- Кожен предмет розраховується окремо з усіма модифікаторами
- Терміновість застосовується до всіх предметів
- Знижки застосовуються вибірково (не на прання, прасування, фарбування)
- Детальний breakdown зберігається для прозорості

### 4. Cart → Order

**Взаємодія:**
- Order створюється з готової корзини через checkout
- Всі розрахунки та характеристики переносяться з Cart
- Cart зберігає TTL (time to live) та автоматично видаляється після checkout
- Можливість відновити корзину з Order для редагування

### 5. Customer → Order

**Взаємодія:**
- Order отримує customer ID при створенні
- Customer domain надає API для перевірки існування клієнта
- Order зберігає тільки customer ID, не дублює дані

**API Contract:**
```java
// Customer API
GET /api/customers/{id} - CustomerDTO
GET /api/customers/search?phone={phone} - List<CustomerDTO>

// CustomerDTO
{
  "id": "uuid",
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "email": "string",
  "communicationPreferences": []
}
```

### 3. Order → Service

**Взаємодія:**
- Service domain надає каталог послуг та предметів
- Order використовує ServiceItem для визначення базової ціни
- Характеристики предметів зберігаються в OrderItem

**API Contract:**
```java
// Service API
GET /api/services/items/{serviceItemId} - ServiceItemDTO
GET /api/services/categories - List<ServiceCategoryDTO>
GET /api/services/items/search?category={cat} - List<ServiceItemDTO>

// ServiceItemDTO
{
  "id": "uuid",
  "serviceId": "uuid", 
  "itemId": "uuid",
  "name": "string",
  "category": "CLOTHING",
  "basePrice": 100.00,
  "unitOfMeasure": "PIECE"
}
```

### 4. Order → Pricing

**Взаємодія:**
- Pricing domain розраховує вартість на основі ServiceItem та характеристик
- Order викликає Pricing API для кожного OrderItem
- Pricing враховує всі модифікатори та правила

**API Contract:**
```java
// Pricing API
POST /api/pricing/calculate - PriceCalculationDTO

// Request
{
  "serviceItemId": "uuid",
  "itemCharacteristics": {
    "material": "string",
    "color": "string",
    "stains": [],
    "defects": [],
    "modifiers": []
  },
  "quantity": 1,
  "urgency": "NORMAL"
}

// Response
{
  "basePrice": 100.00,
  "modifiers": [
    {"name": "Термінова чистка", "value": 50.00}
  ],
  "totalPrice": 150.00,
  "calculation": "detailed breakdown"
}
```

### 5. Order → Payment

**Взаємодія:**
- Payment domain обробляє платежі для замовлення
- Order отримує події про зміну статусу платежу
- Payment зберігає історію всіх транзакцій

**Події:**
- `PaymentReceivedEvent`
- `PaymentRefundedEvent`
- `OrderFullyPaidEvent`

### 6. Order → Receipt

**Взаємодія:**
- Receipt генерується при створенні замовлення
- Receipt domain має доступ до всіх необхідних даних
- Використовує шаблони для різних типів квитанцій

**API Contract:**
```java
// Receipt API
POST /api/receipts/generate - ReceiptDTO
GET /api/receipts/{orderId}/pdf - PDF file

// Request
{
  "orderId": "uuid",
  "type": "ORDER_RECEIPT"
}
```

### 7. Customer → Notification

**Взаємодія:**
- Notification domain підписаний на події замовлень
- Використовує communication preferences клієнта
- Відправляє повідомлення через обрані канали

**Події для підписки:**
- `OrderCreatedEvent` → SMS підтвердження
- `OrderReadyEvent` → повідомлення про готовність
- `PaymentReceivedEvent` → підтвердження оплати

### 8. Auth → All Domains

**Взаємодія:**
- Auth надає JWT токени для авторизації
- Кожен домен валідує токени
- Містить інформацію про оператора та філію

**Security Context:**
```java
{
  "operatorId": "uuid",
  "branchId": "uuid",
  "roles": ["OPERATOR", "MANAGER"],
  "permissions": ["CREATE_ORDER", "VIEW_REPORTS"]
}
```

## Шаблони комунікації

### 1. Synchronous API Calls

Використовується для:
- Отримання даних в реальному часі
- Валідація перед операціями
- Розрахунки, що потребують негайної відповіді

Приклад:
```java
// OrderService викликає Service і Pricing
@Service
public class OrderService {
    @Autowired
    private ServiceClient serviceClient;
    @Autowired
    private PricingClient pricingClient;
    
    public OrderItem addItem(OrderItemRequest request) {
        // Отримати інформацію про ServiceItem
        ServiceItemDTO serviceItem = serviceClient.getServiceItem(request.getServiceItemId());
        
        // Синхронний виклик для розрахунку ціни
        PriceCalculation price = pricingClient.calculate(request);
        
        // Створення OrderItem з всіма характеристиками
        OrderItem orderItem = new OrderItem();
        orderItem.setServiceItemId(serviceItem.getId());
        orderItem.setMaterial(request.getMaterial());
        orderItem.setColor(request.getColor());
        orderItem.setStains(request.getStains());
        orderItem.setDefects(request.getDefects());
        orderItem.setCalculatedPrice(price.getTotalPrice());
        // ...
    }
}
```

### 2. Asynchronous Events

Використовується для:
- Некритичних операцій
- Довготривалих процесів
- Loose coupling між доменами

Приклад:
```java
// Order публікує подію
@EventPublisher
public class OrderEventPublisher {
    public void publishOrderCreated(Order order) {
        OrderCreatedEvent event = new OrderCreatedEvent(
            order.getId(),
            order.getCustomerId(),
            order.getTotalAmount()
        );
        eventBus.publish(event);
    }
}

// Notification підписується на подію
@EventListener
public class NotificationEventHandler {
    @Async
    public void handleOrderCreated(OrderCreatedEvent event) {
        // Асинхронна відправка повідомлення
    }
}
```

### 3. Saga Pattern для транзакцій

Використовується для:
- Розподілених транзакцій
- Компенсації при помилках
- Складних бізнес-процесів

Приклад Order Saga:
```java
1. CreateOrderCommand
2. ReserveItemsCommand
3. CalculatePriceCommand
4. ProcessPaymentCommand
5. GenerateReceiptCommand
6. SendNotificationCommand

// При помилці - компенсуючі команди
- CancelPaymentCommand
- ReleaseItemsCommand
- CancelOrderCommand
```

## Data Consistency Patterns

### 1. Immediate Consistency
- В межах одного домену
- Для критичних операцій

### 2. Eventual Consistency
- Між доменами через події
- Для некритичних даних

### 3. Read Models
- Матеріалізовані представлення для читання
- Оновлюються через події
- Оптимізовані для запитів

## Обробка помилок між доменами

### 1. Circuit Breaker
```java
@Component
public class PricingServiceClient {
    @CircuitBreaker(name = "pricing-service")
    @Retry(name = "pricing-service")
    public PriceCalculation calculate(Request request) {
        // Виклик external service
    }
}
```

### 2. Fallback Strategies
- Default values
- Cached responses
- Degraded functionality

### 3. Dead Letter Queue
- Для неопрацьованих подій
- Можливість повторної обробки
- Моніторинг та алерти

## Моніторинг взаємодій

### 1. Distributed Tracing
- Correlation IDs для відстеження
- Trace через всі домени
- Візуалізація в Jaeger/Zipkin

### 2. Metrics
- Latency між сервісами
- Error rates
- Throughput

### 3. Health Checks
- Перевірка доступності залежностей
- Graceful degradation
- Автоматичне відновлення