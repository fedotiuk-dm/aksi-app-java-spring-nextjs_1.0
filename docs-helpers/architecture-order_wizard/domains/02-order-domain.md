# Order Domain - Управління замовленнями

## Огляд домену

Order Domain відповідає за створення, управління та обробку замовлень хімчистки, включаючи базову інформацію, параметри замовлення, фінансові розрахунки та завершення процесу.

## Бізнес-логіка

### Функціональність

- **Створення замовлень** - генерація номера квитанції, унікальної мітки
- **Управління параметрами** - дата виконання, терміновість, знижки
- **Фінансові розрахунки** - загальна вартість, передоплата, борг
- **Завершення замовлення** - підпис, друк квитанції
- **Інтеграція з філіями** - прив'язка до пункту прийому

### Бізнес-правила

1. **Номер квитанції**: Генерується автоматично
2. **Унікальна мітка**: Обов'язкове поле, може сканувати QR-код
3. **Дата виконання**: Розраховується автоматично на основі категорій предметів
4. **Терміновість**: +50% за 48 год, +100% за 24 год
5. **Знижки**: Не діють на прання, прасування та фарбування
6. **Підпис клієнта**: Обов'язковий для завершення замовлення

## Доменна модель

### Entities

#### Order

```java
@Entity
public class Order {
    private Long id;
    private String receiptNumber;        // Унікальний номер квитанції
    private String uniqueTag;           // Унікальна мітка
    private Long clientId;              // Посилання на клієнта
    private Long branchId;              // Філія прийому
    private LocalDateTime createdAt;    // Дата створення
    private LocalDateTime executionDate; // Дата виконання
    private UrgencyType urgency;        // Терміновість
    private DiscountInfo discountInfo;  // Інформація про знижку
    private PaymentInfo paymentInfo;    // Інформація про оплату
    private String notes;               // Примітки
    private OrderStatus status;         // Статус замовлення
    private String clientSignature;     // Цифровий підпис клієнта
    private String operatorName;        // Оператор
    private List<OrderItem> items;      // Предмети замовлення
}
```

#### OrderItem

```java
@Entity
public class OrderItem {
    private Long id;
    private Long orderId;
    private String itemName;
    private String category;
    private Integer quantity;
    private String unit;                // шт/кг
    private String material;
    private String color;
    private String filling;             // Наповнювач
    private Integer wearDegree;         // Ступінь зносу
    private List<String> stains;        // Плями
    private List<String> defects;       // Дефекти
    private String defectNotes;         // Примітки до дефектів
    private BigDecimal basePrice;       // Базова ціна
    private List<PriceModifier> modifiers; // Модифікатори
    private BigDecimal finalPrice;      // Фінальна ціна
    private List<String> photoUrls;     // Фото
}
```

### Value Objects

#### DiscountInfo

```java
@Embeddable
public class DiscountInfo {
    private DiscountType type;
    private BigDecimal percentage;
    private BigDecimal amount;
    private String description;
}
```

#### PaymentInfo

```java
@Embeddable
public class PaymentInfo {
    private PaymentMethod method;
    private BigDecimal totalAmount;     // Загальна сума
    private BigDecimal paidAmount;      // Сплачено
    private BigDecimal debtAmount;      // Борг
}
```

#### PriceModifier

```java
@Embeddable
public class PriceModifier {
    private String name;
    private ModifierType type;          // PERCENTAGE, FIXED, MULTIPLIER
    private BigDecimal value;
    private BigDecimal appliedAmount;
}
```

### Enums

#### OrderStatus

```java
public enum OrderStatus {
    DRAFT("Чернетка"),
    CREATED("Створено"),
    IN_PROGRESS("В роботі"),
    READY("Готово"),
    COMPLETED("Завершено"),
    CANCELLED("Скасовано");
}
```

#### UrgencyType

```java
public enum UrgencyType {
    NORMAL("Звичайне", 0),
    URGENT_48H("Термінове 48 год", 50),
    URGENT_24H("Термінове 24 год", 100);

    private final String description;
    private final int extraChargePercent;
}
```

#### DiscountType

```java
public enum DiscountType {
    NONE("Без знижки", 0),
    EVERCARD("Еверкард", 10),
    SOCIAL_MEDIA("Соцмережі", 5),
    MILITARY("ЗСУ", 10),
    OTHER("Інше", 0);
}
```

#### PaymentMethod

```java
public enum PaymentMethod {
    TERMINAL("Термінал"),
    CASH("Готівка"),
    BANK_ACCOUNT("На рахунок");
}
```

## Сервіси

### OrderService

```java
@Service
public class OrderService {

    // Створення замовлення
    Order createOrder(CreateOrderRequest request);

    // Управління замовленням
    Order updateOrder(Long id, UpdateOrderRequest request);
    Order getOrderById(Long id);
    Order addItemToOrder(Long orderId, OrderItem item);
    Order removeItemFromOrder(Long orderId, Long itemId);

    // Фінансові операції
    Order applyDiscount(Long orderId, DiscountInfo discount);
    Order updatePaymentInfo(Long orderId, PaymentInfo payment);
    BigDecimal calculateTotalAmount(Long orderId);

    // Завершення замовлення
    Order completeOrder(Long orderId, String clientSignature);
    Order cancelOrder(Long orderId, String reason);
}
```

### OrderCalculationService

```java
@Service
public class OrderCalculationService {

    // Розрахунок вартості
    BigDecimal calculateOrderTotal(Order order);
    BigDecimal calculateItemPrice(OrderItem item);
    BigDecimal applyModifiers(BigDecimal basePrice, List<PriceModifier> modifiers);

    // Знижки та надбавки
    BigDecimal applyDiscount(BigDecimal amount, DiscountInfo discount);
    BigDecimal applyUrgencyCharge(BigDecimal amount, UrgencyType urgency);

    // Валідація знижок
    boolean isDiscountApplicable(OrderItem item, DiscountType discountType);
    List<OrderItem> getDiscountEligibleItems(List<OrderItem> items);
}
```

### ReceiptService

```java
@Service
public class ReceiptService {

    // Генерація номерів
    String generateReceiptNumber(Long branchId);
    String generateUniqueTag();

    // Квитанція
    ReceiptData generateReceiptData(Long orderId);
    byte[] generateReceiptPdf(Long orderId);

    // QR коди
    String generateQrCode(String uniqueTag);
    byte[] generateQrCodeImage(String uniqueTag);
}
```

## Repositories

### OrderRepository

```java
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Пошук за критеріями
    List<Order> findByClientId(Long clientId);
    List<Order> findByBranchId(Long branchId);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByReceiptNumber(String receiptNumber);
    List<Order> findByUniqueTag(String uniqueTag);

    // Дата діапазони
    List<Order> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<Order> findByExecutionDateBetween(LocalDateTime start, LocalDateTime end);

    // Статистика
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    Long countByStatus(@Param("status") OrderStatus status);

    @Query("SELECT SUM(o.paymentInfo.totalAmount) FROM Order o WHERE o.createdAt >= :startDate")
    BigDecimal getTotalRevenueFromDate(@Param("startDate") LocalDateTime startDate);
}
```

### OrderItemRepository

```java
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(Long orderId);
    List<OrderItem> findByCategory(String category);

    @Query("SELECT oi FROM OrderItem oi WHERE oi.orderId = :orderId ORDER BY oi.id")
    List<OrderItem> findByOrderIdOrderById(@Param("orderId") Long orderId);
}
```

## DTOs

### Request DTOs

#### CreateOrderRequest

```java
public class CreateOrderRequest {
    @NotNull
    private Long clientId;

    @NotNull
    private Long branchId;

    @NotBlank
    private String uniqueTag;

    private LocalDateTime executionDate;
    private UrgencyType urgency;
    private String notes;
}
```

#### UpdateOrderRequest

```java
public class UpdateOrderRequest {
    private LocalDateTime executionDate;
    private UrgencyType urgency;
    private DiscountInfo discountInfo;
    private PaymentInfo paymentInfo;
    private String notes;
}
```

#### AddOrderItemRequest

```java
public class AddOrderItemRequest {
    @NotBlank
    private String itemName;

    @NotBlank
    private String category;

    @NotNull
    @Min(1)
    private Integer quantity;

    private String unit;
    private String material;
    private String color;
    private String filling;
    private Integer wearDegree;
    private List<String> stains;
    private List<String> defects;
    private String defectNotes;
    private List<PriceModifier> modifiers;
}
```

### Response DTOs

#### OrderResponse

```java
public class OrderResponse {
    private Long id;
    private String receiptNumber;
    private String uniqueTag;
    private ClientResponse client;
    private BranchResponse branch;
    private LocalDateTime createdAt;
    private LocalDateTime executionDate;
    private UrgencyType urgency;
    private DiscountInfo discountInfo;
    private PaymentInfo paymentInfo;
    private String notes;
    private OrderStatus status;
    private String operatorName;
    private List<OrderItemResponse> items;
    private OrderCalculationResponse calculation;
}
```

#### OrderCalculationResponse

```java
public class OrderCalculationResponse {
    private BigDecimal subtotal;
    private BigDecimal discountAmount;
    private BigDecimal urgencyCharge;
    private BigDecimal totalAmount;
    private BigDecimal paidAmount;
    private BigDecimal debtAmount;
    private List<CalculationDetailResponse> itemCalculations;
}
```

#### ReceiptData

```java
public class ReceiptData {
    private OrderResponse order;
    private CompanyInfo companyInfo;
    private String qrCodeUrl;
    private LocalDateTime printedAt;
    private String operatorSignature;
}
```

## API Endpoints

### Управління замовленнями

- `POST /api/orders` - Створення замовлення
- `GET /api/orders/{id}` - Отримання замовлення
- `PUT /api/orders/{id}` - Оновлення замовлення
- `DELETE /api/orders/{id}` - Видалення замовлення

### Предмети замовлення

- `POST /api/orders/{id}/items` - Додавання предмета
- `PUT /api/orders/{id}/items/{itemId}` - Оновлення предмета
- `DELETE /api/orders/{id}/items/{itemId}` - Видалення предмета

### Фінансові операції

- `POST /api/orders/{id}/discount` - Застосування знижки
- `PUT /api/orders/{id}/payment` - Оновлення інформації про оплату
- `GET /api/orders/{id}/calculation` - Розрахунок вартості

### Завершення замовлення

- `POST /api/orders/{id}/complete` - Завершення замовлення
- `POST /api/orders/{id}/cancel` - Скасування замовлення
- `POST /api/orders/{id}/signature` - Збереження підпису

### Квитанції

- `GET /api/orders/{id}/receipt` - Дані квитанції
- `GET /api/orders/{id}/receipt/pdf` - PDF квитанції
- `POST /api/receipts/generate-number` - Генерація номера

### Пошук та фільтрація

- `GET /api/orders/search` - Пошук замовлень
- `GET /api/orders/client/{clientId}` - Замовлення клієнта
- `GET /api/orders/branch/{branchId}` - Замовлення філії
- `GET /api/orders/status/{status}` - Замовлення за статусом

## Валідація

### Бізнес-валідація

1. **Унікальна мітка**: Не повинна дублюватися
2. **Дата виконання**: Не може бути в минулому
3. **Кількість предметів**: Мінімум 1 предмет в замовленні
4. **Знижки**: Перевірка застосовності до категорій
5. **Підпис**: Обов'язковий для завершення

### Технічна валідація

- Bean Validation для DTOs
- Бізнес-правила через кастомні валідатори
- Перевірка цілісності даних

## Інтеграція з іншими доменами

### Client Domain

- Посилання на клієнта в замовленні
- Валідація існування клієнта

### Branch Domain

- Прив'язка до філії
- Генерація номерів квитанцій з урахуванням філії

### Item Domain

- Інтеграція з каталогом предметів
- Розрахунок цін на основі прайс-листа

### Document Domain

- Генерація квитанцій
- Збереження документів

## Тестування

### Unit Tests

- OrderService бізнес-логіка
- OrderCalculationService розрахунки
- Валідація бізнес-правил

### Integration Tests

- API endpoints
- База даних операції
- Інтеграція між доменами

## Технічні деталі

### Індекси БД

```sql
CREATE INDEX idx_order_receipt_number ON orders(receipt_number);
CREATE INDEX idx_order_unique_tag ON orders(unique_tag);
CREATE INDEX idx_order_client_id ON orders(client_id);
CREATE INDEX idx_order_branch_id ON orders(branch_id);
CREATE INDEX idx_order_status ON orders(status);
CREATE INDEX idx_order_created_at ON orders(created_at);
CREATE INDEX idx_order_execution_date ON orders(execution_date);
```

### Транзакції

- Створення замовлення в одній транзакції
- Розрахунки в read-only транзакціях
- Оптимістичне блокування для конкурентних оновлень

### Аудит

- Логування всіх змін замовлення
- Історія розрахунків
- Відстеження операторів

### Безпека

- Доступ до замовлень за ролями
- Захист персональних даних
- Логування доступу до фінансової інформації
