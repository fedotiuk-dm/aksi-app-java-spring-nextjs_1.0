# Нові енуми калькулятора

## Огляд

До системи калькулятора було додано два нових енума для покращення функціональності:

- `OperationType` - визначає тип операції для модифікаторів цін
- `CalculationStatus` - визначає статус результату розрахунку

## OperationType

### Значення

| Значення     | Опис                              | Приклад використання |
| ------------ | --------------------------------- | -------------------- |
| `ADD`        | Додати значення до базової ціни   | +$5.00 до замовлення |
| `SUBTRACT`   | Відняти значення від базової ціни | -$10.00 знижки       |
| `MULTIPLIER` | Помножити на коефіцієнт           | ×1.5 за терміновість |
| `DIVIDE`     | Поділити на коефіцієнт            | ÷2 за акційною ціною |

### Використання в коді

```java
// Створення модифікатора
PriceModifierEntity modifier = new PriceModifierEntity();
modifier.setType(ModifierType.PERCENTAGE);
modifier.setOperation(OperationType.MULTIPLY); // Множення на відсоток
modifier.setValue(150); // 1.5x (150 basis points = 1.5)

// Застосування операції
int result = switch (modifier.getOperation()) {
    case ADD -> basePrice + modifierValue;
    case SUBTRACT -> basePrice - modifierValue;
    case MULTIPLIER -> (int) ((long) basePrice * modifierValue / 10000);
    case DIVIDE -> modifierValue != 0 ? (int) ((long) basePrice * 10000 / modifierValue) : basePrice;
};
```

### Приклади бізнес-сценаріїв

```java
// VIP знижка 20%
modifier.setOperation(OperationType.MULTIPLY);
modifier.setValue(80); // 0.8x = 20% знижки

// Фіксована доплата $15
modifier.setOperation(OperationType.ADD);
modifier.setValue(1500); // $15.00

// Поділ ціни навпіл
modifier.setOperation(OperationType.DIVIDE);
modifier.setValue(200); // поділити на 2
```

## CalculationStatus

### Значення

| Значення   | Опис                        | Коли використовується                                     |
| ---------- | --------------------------- | --------------------------------------------------------- |
| `SUCCESS`  | Розрахунок пройшов успішно  | Всі дані коректні, розрахунок завершено                   |
| `FAILED`   | Розрахунок провалився       | Критична помилка в даних чи логіці                        |
| `FALLBACK` | Використано резервний метод | Основний метод не спрацював, використано запасний варіант |

### Використання в коді

```java
// Успішний результат
GamePriceCalculationResult successResult = GamePriceCalculationResult.fromLinear(linearResult);
// status = SUCCESS

// Помилка в розрахунку
GamePriceCalculationResult errorResult = GamePriceCalculationResult.error("Invalid configuration", 1000);
// status = FAILED

// Перевірка статусу
if (result.status() == CalculationStatus.SUCCESS) {
    // Обробка успішного результату
} else if (result.status() == CalculationStatus.FAILED) {
    // Обробка помилки
    log.error("Calculation failed: {}", result.notes());
}
```

### Інтеграція в API

```java
// DTO автоматично містить поле status
public class CalculationResult {
    private Integer finalPrice;
    private String currency = "USD";
    private CalculationStatus status = CalculationStatus.SUCCESS; // Дефолтне значення
    private CalculationBreakdown breakdown;
}
```

## Міграція бази даних

### Liquibase міграція

Створено міграцію `037-add-operation-type-to-price-modifiers.yaml`:

```yaml
databaseChangeLog:
  - changeSet:
      id: add-operation-type-to-price-modifiers
      author: system
      comment: Add operation_type column to price_modifiers table
      changes:
        - addColumn:
            tableName: price_modifiers
            columns:
              - column:
                  name: operation_type
                  type: varchar(20)
                  defaultValue: ADD
                  constraints:
                    nullable: false
        - createIndex:
            tableName: price_modifiers
            indexName: idx_modifier_operation_type
            columns:
              - column:
                  name: operation_type
```

### Оновлення сутності

```java
@Entity
public class PriceModifierEntity extends BaseEntity {
    // Існуючі поля...

    @Column(name = "operation_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private OperationType operation = OperationType.ADD;

    // Гетери та сетери...
}
```

## Переваги нових енумів

### 🔒 **Типобезпека**

- Заміна магічних рядків на строго типізовані енуми
- Виключення помилок через неправильні значення

### 📊 **Кращий моніторинг**

- Відстеження статусів розрахунків
- Діагностика проблем з модифікаторами

### 🔧 **Розширюваність**

- Легке додавання нових типів операцій
- Зручне розширення системи статусів

### 📈 **Продуктивність**

- Швидші порівняння через enum замість рядків
- Менше використання пам'яті

## Міграція існуючих даних

При запуску міграції всі існуючі записи в таблиці `price_modifiers` отримають значення `ADD` як дефолтний тип операції:

```sql
UPDATE price_modifiers SET operation_type = 'ADD' WHERE operation_type IS NULL;
```

Це забезпечує зворотну сумісність з існуючими модифікаторами.

## Тестування

Створені всебічні тести для перевірки нових енумів:

- Unit тести для кожного типу операцій
- Інтеграційні тести з різними сценаріями
- Тести на обробку помилок та edge cases

```java
@Test
void shouldApplyMultiplyOperation() {
    OperationType operation = OperationType.MULTIPLIER;
    int result = applyOperation(operation, 1000, 150); // 1000 * 1.5
    assertThat(result).isEqualTo(1500);
}
```

## Рекомендації по використанню

1. **Для нових модифікаторів**: Завжди вказуйте `operation` тип
2. **Для існуючих модифікаторів**: Вони автоматично отримають `ADD` як дефолт
3. **Для API відповідей**: Завжди перевіряйте `status` перед використанням даних
4. **Для діагностики**: Використовуйте `status` для логування та моніторингу

## Приклади використання в коді

### Використання OperationType у модифікаторах

```java
// Створення модифікатора з різними операціями
PriceModifierEntity percentageMod = new PriceModifierEntity();
percentageMod.setType(ModifierType.PERCENTAGE);
percentageMod.setOperation(OperationType.ADD); // +15% до ціни
percentageMod.setValue(1500); // 15.00%

PriceModifierEntity discountMod = new PriceModifierEntity();
discountMod.setType(ModifierType.PERCENTAGE);
discountMod.setOperation(OperationType.SUBTRACT); // -10% від ціни
discountMod.setValue(1000); // 10.00%

PriceModifierEntity multiplierMod = new PriceModifierEntity();
multiplierMod.setType(ModifierType.FIXED);
multiplierMod.setOperation(OperationType.MULTIPLY); // ×2 до фіксованої суми
multiplierMod.setValue(20000); // множник 2.0x
```

### Використання CalculationStatus у результатах

```java
// Успішний результат розрахунку
GamePriceCalculationResult successResult = GamePriceCalculationResult.fromLinear(
    linearResult
);
// status = SUCCESS

// Результат з помилкою
GamePriceCalculationResult errorResult = GamePriceCalculationResult.error(
    "Configuration not found", 1000
);
// status = FAILED

// Перевірка статусу в коді
if (result.status() == CalculationStatus.SUCCESS) {
    // Обробка успішного результату
    processSuccessfulCalculation(result);
} else if (result.status() == CalculationStatus.FAILED) {
    // Логування помилки
    log.error("Calculation failed: {}", result.notes());
}
```

### Комплексний приклад

```java
// Створюємо модифікатор для калькулятора ігор
PriceModifierEntity gameModifier = new PriceModifierEntity();
gameModifier.setCode("VIP_BOOST");
gameModifier.setName("VIP Boost Discount");
gameModifier.setType(ModifierType.PERCENTAGE);
gameModifier.setOperation(OperationType.SUBTRACT); // віднімаємо від ціни
gameModifier.setValue(2000); // 20% знижки
gameModifier.setActive(true);

// Використовуємо в GameModifierCalculator
int adjustment = gameModifierCalculator.calculateModifierAdjustment(
    gameModifier, 10000, Map.of("levelDifference", 5)
);
// Результат: -2000 (20% від 10000)

// Перевіряємо результат
if (result.status() == CalculationStatus.SUCCESS) {
    System.out.println("Final price: $" + result.totalPrice() / 100.0);
}
```

## Майбутні покращення

- Можна додати більше типів операцій (MIN, MAX, ROUND, etc.)
- Можна розширити систему статусів (PARTIAL_SUCCESS, WARNING, etc.)
- Можна додати валідацію сумісності типів модифікаторів з операціями
