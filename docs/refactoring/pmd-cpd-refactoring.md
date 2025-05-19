# Рекомендації щодо рефакторингу дублювання коду (PMD CPD)

## Загальні принципи

Інструмент PMD CPD (Copy-Paste Detector) виявляє дублювання коду, яке часто є ознакою порушення принципу DRY (Don't Repeat Yourself). Замість встановлення виключень у конфігурації PMD, рекомендується провести рефакторинг дублюючого коду.

## Типові патерни для рефакторингу

### 1. Дублювання в Controller класах

**Проблема**:

```
[WARNING] CPD Failure: Found 4 lines of duplicated code at locations:
[WARNING]     /home/iddqd/.../OrderController.java line 68
[WARNING]     /home/iddqd/.../OrderController.java line 150
```

**Рішення**:

- Створити базовий абстрактний клас `BaseController` з загальними методами
- Використати шаблон Template Method для стандартизації обробки запитів
- Використати утилітний клас `ApiResponseUtils` для формування відповідей

```java
// Приклад рефакторингу методів контролера
public ResponseEntity<?> getOrders() {
    try {
        List<OrderDTO> orders = orderService.getAllOrders();
        return ApiResponseUtils.success(orders, "Список замовлень успішно отримано");
    } catch (Exception e) {
        log.error("Помилка при отриманні замовлень", e);
        return ApiResponseUtils.error("Помилка при отриманні замовлень: " + e.getMessage());
    }
}
```

### 2. Дублювання в DTO класах

**Проблема**:

```
[WARNING] CPD Failure: Found 19 lines of duplicated code at locations:
[WARNING]     /home/iddqd/.../BaseBranchLocationRequest.java line 23
[WARNING]     /home/iddqd/.../BranchLocationDTO.java line 30
```

**Рішення**:

- Використати ієрархію класів з успадкуванням спільних полів
- Використати композицію для вкладення спільних груп полів
- Застосувати MapStruct для автоматичного мапінгу даних

```java
// Базовий клас з спільними полями
@Data
public abstract class BaseBranchLocation {
    private String name;
    private String address;
    private String phoneNumber;
    // Інші спільні поля
}

// Наслідування для конкретних DTO
@Data
@EqualsAndHashCode(callSuper = true)
public class BranchLocationDTO extends BaseBranchLocation {
    private UUID id;
    // Додаткові поля
}
```

### 3. Дублювання в Service класах

**Проблема**:

```
[WARNING] CPD Failure: Found 11 lines of duplicated code at locations:
[WARNING]     /home/iddqd/.../OrderServiceImpl.java line 53
[WARNING]     /home/iddqd/.../OrderServiceImpl.java line 309
```

**Рішення**:

- Виділити повторювані блоки коду в окремі приватні методи
- Використати шаблон Стратегія для варіантів алгоритмів
- Застосувати функціональні інтерфейси для кастомізації поведінки

```java
// До рефакторингу
private OrderDTO findOrder(UUID orderId) {
    OrderEntity order = orderRepository.findById(orderId)
            .orElseThrow(() -> new EntityNotFoundException("Замовлення не знайдено"));
    return orderMapper.toDto(order);
}

private OrderItemDTO findOrderItem(UUID itemId) {
    OrderItemEntity item = orderItemRepository.findById(itemId)
            .orElseThrow(() -> new EntityNotFoundException("Позиція не знайдена"));
    return orderItemMapper.toDto(item);
}

// Після рефакторингу
private <T, R, M extends GenericMapper<T, R>> R findById(
        UUID id,
        JpaRepository<T, UUID> repository,
        M mapper,
        String entityName) {
    T entity = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(entityName + " не знайдено"));
    return mapper.toDto(entity);
}
```

### 4. Дублювання в методах обробки винятків

**Проблема**:

```
[WARNING] CPD Failure: Found 17 lines of duplicated code at locations:
[WARNING]     /home/iddqd/.../GlobalExceptionHandler.java line 368
[WARNING]     /home/iddqd/.../GlobalExceptionHandler.java line 398
```

**Рішення**:

- Створити загальний метод обробки типових винятків
- Використати анотації для категоризації винятків
- Реалізувати ієрархію власних винятків з додатковими метаданими

```java
// Спільний метод обробки винятків
private ResponseEntity<ApiErrorResponse> handleBaseException(
        Exception ex,
        HttpStatus status,
        String defaultMessage) {
    String message = ex.getMessage() != null ? ex.getMessage() : defaultMessage;
    ApiErrorResponse error = new ApiErrorResponse(status.value(), message);
    log.error("Помилка: {}", message, ex);
    return new ResponseEntity<>(error, status);
}

// Використання спільного методу
@ExceptionHandler(EntityNotFoundException.class)
public ResponseEntity<ApiErrorResponse> handleEntityNotFound(EntityNotFoundException ex) {
    return handleBaseException(ex, HttpStatus.NOT_FOUND, "Сутність не знайдена");
}
```

### 5. Дублювання в інтерфейсах та їх реалізаціях

**Проблема**:

```
[WARNING] CPD Failure: Found 10 lines of duplicated code at locations:
[WARNING]     /home/iddqd/.../PriceModifierCalculationService.java line 29
[WARNING]     /home/iddqd/.../PriceModifierCalculationServiceImpl.java line 32
```

**Рішення**:

- Уникати копіювання javadoc коментарів з інтерфейсів до реалізацій
- Використати анотацію `@Override` без дублювання документації
- Створити абстрактні базові класи для спільної логіки імплементацій

### 6. Дублювання через поєднання Lombok та звичайного коду

**Проблема**:
При використанні Lombok разом з ручним кодом можуть виникати дублювання в методах equals/hashCode/toString.

**Рішення**:

- Консистентно використовувати Lombok (`@Data`, `@Getter`, `@Setter`, `@EqualsAndHashCode`)
- Або повністю відмовитись від Lombok для конкретних класів
- Налаштувати Lombok для виключення певних полів: `@EqualsAndHashCode(exclude = {"fieldToExclude"})`

## Організація коду для зменшення дублювання

### Загальні утилітні класи

Створіть загальні утилітні класи для стандартних операцій:

```java
public final class ValidationUtils {
    private ValidationUtils() {}

    public static <T> T requireNonNull(T obj, String message) {
        if (obj == null) {
            throw new IllegalArgumentException(message);
        }
        return obj;
    }

    // Інші методи валідації
}
```

### Узагальнені базові класи

Виділіть базові класи для типової функціональності:

```java
public abstract class BaseService<T, ID> {
    protected final JpaRepository<T, ID> repository;

    protected BaseService(JpaRepository<T, ID> repository) {
        this.repository = repository;
    }

    public T findById(ID id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Entity not found"));
    }

    // Інші загальні методи
}
```

## Специфічні рекомендації для проекту AKSI

### ModifierRecommendationServiceImpl

Розділити сервіс на кілька менших за принципом Single Responsibility Principle:

- `StainRecommendationService`
- `DefectRecommendationService`
- `MaterialRecommendationService`

### OrderServiceImpl

Виділити окремі компоненти:

- `OrderValidationService` - для валідації замовлень
- `OrderStatusManager` - для управління статусами замовлень
- `OrderDiscountCalculator` - для розрахунку знижок

### GlobalExceptionHandler

Застосувати категоризацію винятків:

- `BusinessExceptions` - для бізнес-логіки
- `ValidationExceptions` - для проблем валідації
- `SecurityExceptions` - для проблем безпеки

## Процес рефакторингу

1. **Аналіз**: Визначте патерни дублювання за допомогою PMD CPD
2. **Планування**: Вирішіть, який підхід до рефакторингу підходить для конкретного випадку
3. **Тестування**: Створіть тести перед рефакторингом
4. **Рефакторинг**: Поступово видаляйте дублювання
5. **Верифікація**: Переконайтесь, що всі тести проходять
6. **Документація**: Оновіть документацію з урахуванням змін

## Успішні реалізації рефакторингу

### 1. ModifierRecommendationServiceImpl

**Проблема**:

- Дублювання коду в методах `getRecommendedModifiersForStains` та `getRecommendedModifiersForDefects`
- Надмірний і складний код для обробки рекомендацій
- Важко підтримувати і тестувати

**Рішення**:

1. Створено базовий сервіс `RecommendationBaseService` з загальною логікою обробки рекомендацій
2. Створено спеціалізовані сервіси:
   - `StainRecommendationService` - для рекомендацій на основі плям
   - `DefectRecommendationService` - для рекомендацій на основі дефектів
3. В основному сервісі `ModifierRecommendationServiceImpl` тепер використовується делегування

**Результат**:

- Зменшено розмір класу `ModifierRecommendationServiceImpl` з ~360 рядків до ~50
- Усунуто дублювання коду
- Підвищено модульність і тестованість
- Застосовано принцип SRP (Single Responsibility Principle)

**Застосовані патерни**:

- Патерн "Стратегія" - виділення окремих алгоритмів в спеціалізовані класи
- Патерн "Шаблонний метод" - загальна логіка в базовому сервісі
