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
       │                   │                     │
       ▼                   ▼                     ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│    Order    │────▶│     Item     │◀────│  Service    │
└──────┬──────┘     └──────────────┘     └──────┬──────┘
       │                                         │
       ▼                                         ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Pricing   │────▶│   Payment    │────▶│  Receipt    │
└─────────────┘     └──────┬───────┘     └─────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Notification │
                    └──────────────┘
```

## Детальний опис взаємодій

### 1. Order Domain - центральний домен

**Залежності:**
- Customer (для прив'язки замовлення)
- Branch (для визначення місця прийому)
- Item (для характеристик предметів)
- Service (для вибору послуг)
- Pricing (для розрахунку вартості)

**Події, які генерує:**
- `OrderCreatedEvent`
- `OrderItemAddedEvent`
- `OrderStatusChangedEvent`
- `OrderCompletedEvent`

**API endpoints:**
```
POST /api/orders - створити замовлення
GET /api/orders/{id} - отримати замовлення
PUT /api/orders/{id}/items - додати предмет
PUT /api/orders/{id}/status - змінити статус
```

### 2. Customer → Order

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

### 3. Order → Pricing

**Взаємодія:**
- Pricing domain розраховує вартість на основі предметів
- Order викликає Pricing API для кожного предмета
- Pricing враховує всі модифікатори та правила

**API Contract:**
```java
// Pricing API
POST /api/pricing/calculate - PriceCalculationDTO

// Request
{
  "serviceId": "uuid",
  "itemCharacteristics": {
    "material": "string",
    "color": "string",
    "stains": [],
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

### 4. Order → Payment

**Взаємодія:**
- Payment domain обробляє платежі для замовлення
- Order отримує події про зміну статусу платежу
- Payment зберігає історію всіх транзакцій

**Події:**
- `PaymentReceivedEvent`
- `PaymentRefundedEvent`
- `OrderFullyPaidEvent`

### 5. Order → Receipt

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

### 6. Customer → Notification

**Взаємодія:**
- Notification domain підписаний на події замовлень
- Використовує communication preferences клієнта
- Відправляє повідомлення через обрані канали

**Події для підписки:**
- `OrderCreatedEvent` → SMS підтвердження
- `OrderReadyEvent` → повідомлення про готовність
- `PaymentReceivedEvent` → підтвердження оплати

### 7. Auth → All Domains

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
// OrderService викликає PricingService
@Service
public class OrderService {
    @Autowired
    private PricingClient pricingClient;
    
    public OrderItem addItem(OrderItemRequest request) {
        // Синхронний виклик для розрахунку ціни
        PriceCalculation price = pricingClient.calculate(request);
        // Створення OrderItem з розрахованою ціною
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