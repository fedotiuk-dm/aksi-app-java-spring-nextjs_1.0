# Domain Interactions

## Interaction Principles

1. **Loose Coupling** - domains are minimally dependent on each other
2. **Event-Driven** - communication through events where possible
3. **API Contracts** - clear contracts between domains
4. **Data Consistency** - eventual consistency between domains

## Interaction Diagram

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

## Detailed Interaction Description

### 1. Cart Domain - Interactive Cart for Calculations

**Purpose:**
- Temporary storage of items before order creation
- Interactive real-time price calculation
- Application of global parameters (urgency, discounts)

**Dependencies:**
- Customer (for cart binding)
- Service (for obtaining base prices)
- Pricing (for calculation with modifiers)

**API endpoints:**
```
POST   /api/cart                    - create cart
GET    /api/cart/{cartId}          - get cart
POST   /api/cart/{cartId}/items    - add item
PUT    /api/cart/{cartId}/items/{itemId} - update item
DELETE /api/cart/{cartId}/items/{itemId} - delete item
PUT    /api/cart/{cartId}/urgency  - change urgency
PUT    /api/cart/{cartId}/discount - apply discount
POST   /api/cart/{cartId}/calculate - recalculate all prices
POST   /api/cart/{cartId}/checkout - create order from cart
```

### 2. Order Domain - Central Domain

**Dependencies:**
- Cart (created from ready cart)
- Customer (for order binding)
- Branch (for reception point definition)
- Service (for service and item selection from catalog)
- Pricing (for cost calculation)

**Features:**
- Item characteristics (material, color, defects) are fixed in OrderItem
- Photos are taken during order creation
- Order is created from ready cart with all calculations

**Events Generated:**
- `OrderCreatedEvent`
- `OrderItemAddedEvent` (includes all characteristics)
- `OrderStatusChangedEvent`
- `OrderCompletedEvent`

**API endpoints:**
```
POST /api/orders - create order
GET /api/orders/{id} - get order
PUT /api/orders/{id}/items - add item with characteristics
PUT /api/orders/{id}/status - change status
```

### 3. Cart → Service + Pricing

**Interaction:**
- Cart uses Service domain to get base prices
- Cart calls Pricing for each item with all characteristics
- When global parameters change (urgency, discount) - entire cart is recalculated
- All calculations are stored in cart until order creation

**Calculation Features:**
- Each item is calculated separately with all modifiers
- Urgency applies to all items
- Discounts are applied selectively (not to washing, ironing, dyeing)
- Detailed breakdown is stored for transparency

### 4. Cart → Order

**Interaction:**
- Order is created from ready cart through checkout
- All calculations and characteristics are transferred from Cart
- Cart stores TTL (time to live) and is automatically deleted after checkout
- Ability to restore cart from Order for editing

### 5. Customer → Order

**Interaction:**
- Order receives customer ID during creation
- Customer domain provides API for customer existence verification
- Order stores only customer ID, doesn't duplicate data

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

**Interaction:**
- Service domain provides catalog of services and items
- Order uses ServiceItem to determine base price
- Item characteristics are stored in OrderItem

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

**Interaction:**
- Pricing domain calculates cost based on ServiceItem and characteristics
- Order calls Pricing API for each OrderItem
- Pricing considers all modifiers and rules

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
    {"name": "Express cleaning", "value": 50.00}
  ],
  "totalPrice": 150.00,
  "calculation": "detailed breakdown"
}
```

### 5. Order → Payment

**Interaction:**
- Payment domain processes payments for order
- Order receives events about payment status changes
- Payment stores history of all transactions

**Events:**
- `PaymentReceivedEvent`
- `PaymentRefundedEvent`
- `OrderFullyPaidEvent`

### 6. Order → Receipt

**Interaction:**
- Receipt is generated when order is created
- Receipt domain has access to all necessary data
- Uses templates for different types of receipts

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

**Interaction:**
- Notification domain is subscribed to order events
- Uses customer communication preferences
- Sends notifications through selected channels

**Events for Subscription:**
- `OrderCreatedEvent` → SMS confirmation
- `OrderReadyEvent` → readiness notification
- `PaymentReceivedEvent` → payment confirmation

### 8. Auth → All Domains

**Interaction:**
- Auth provides JWT tokens for authorization
- Each domain validates tokens
- Contains information about operator and branch

**Security Context:**
```java
{
  "operatorId": "uuid",
  "branchId": "uuid",
  "roles": ["OPERATOR", "MANAGER"],
  "permissions": ["CREATE_ORDER", "VIEW_REPORTS"]
}
```

## Communication Patterns

### 1. Synchronous API Calls

Used for:
- Real-time data retrieval
- Pre-operation validation
- Calculations requiring immediate response

Example:
```java
// OrderService calls Service and Pricing
@Service
public class OrderService {
    @Autowired
    private ServiceClient serviceClient;
    @Autowired
    private PricingClient pricingClient;
    
    public OrderItem addItem(OrderItemRequest request) {
        // Get ServiceItem information
        ServiceItemDTO serviceItem = serviceClient.getServiceItem(request.getServiceItemId());
        
        // Synchronous call for price calculation
        PriceCalculation price = pricingClient.calculate(request);
        
        // Create OrderItem with all characteristics
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

Used for:
- Non-critical operations
- Long-running processes
- Loose coupling between domains

Example:
```java
// Order publishes event
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

// Notification subscribes to event
@EventListener
public class NotificationEventHandler {
    @Async
    public void handleOrderCreated(OrderCreatedEvent event) {
        // Asynchronous message sending
    }
}
```

### 3. Saga Pattern for Transactions

Used for:
- Distributed transactions
- Compensation on errors
- Complex business processes

Order Saga Example:
```java
1. CreateOrderCommand
2. ReserveItemsCommand
3. CalculatePriceCommand
4. ProcessPaymentCommand
5. GenerateReceiptCommand
6. SendNotificationCommand

// On error - compensating commands
- CancelPaymentCommand
- ReleaseItemsCommand
- CancelOrderCommand
```

## Data Consistency Patterns

### 1. Immediate Consistency
- Within a single domain
- For critical operations

### 2. Eventual Consistency
- Between domains through events
- For non-critical data

### 3. Read Models
- Materialized views for reading
- Updated through events
- Optimized for queries

## Error Handling Between Domains

### 1. Circuit Breaker
```java
@Component
public class PricingServiceClient {
    @CircuitBreaker(name = "pricing-serviceCatalog")
    @Retry(name = "pricing-serviceCatalog")
    public PriceCalculation calculate(Request request) {
        // External service call
    }
}
```

### 2. Fallback Strategies
- Default values
- Cached responses
- Degraded functionality

### 3. Dead Letter Queue
- For unprocessed events
- Ability to reprocess
- Monitoring and alerts

## Interaction Monitoring

### 1. Distributed Tracing
- Correlation IDs for tracking
- Trace through all domains
- Visualization in Jaeger/Zipkin

### 2. Metrics
- Latency between services
- Error rates
- Throughput

### 3. Health Checks
- Dependency availability checks
- Graceful degradation
- Automatic recovery