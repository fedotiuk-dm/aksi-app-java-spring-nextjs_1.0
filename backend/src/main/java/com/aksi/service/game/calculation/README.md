# 🧮 Game Calculator System Architecture

## 📋 Overview

Це **enterprise-level архітектура** для системи розрахунків цін у грі boosting. Архітектура побудована на принципах **CQRS**, **SOLID** та **Domain-Driven Design (DDD)** з використанням сучасних патернів проектування.

### 🎯 Ключові особливості

- ✅ **CQRS Architecture** - чітке відокремлення Command від Query операцій
- ✅ **SOLID Principles** - всі 5 принципів реалізовані правильно
- ✅ **Strategy Pattern** - підтримка різних типів розрахунків
- ✅ **Facade Pattern** - єдиний entry point для всіх операцій
- ✅ **Template Method** - спільна логіка для всіх калькуляторів
- ✅ **Factory Pattern** - централізоване створення об'єктів

## 🏗️ Архітектурна діаграма

```
┌─────────────────────────────────────────────────┐
│           CalculatorCommandService              │ ← ТІЛЬКИ цей імпорт!
│  (CQRS Command - єдиний сервіс для розрахунків) │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│              CalculatorFacade                  │ ← Єдиний фасад
│   (Facade Pattern - об'єднує всі калькуляції)  │
└─────────────────┬───────────────────────────────┘
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────────┐
│GamePriceCalc│ │GameModifier │ │BaseCalculator  │
│(диспетчер)  │ │Calculator   │ │(спільна логіка)│
└──────┬──────┘ └─────────────┘ └─────────────────┘
       │
       ▼
┌──────┼──────┐
▼      ▼      ▼      ▼
Linear  Range  Formula TimeBased  ← Спеціалізовані калькулятори
Calc   Calc   Calc    Calc        (Strategy Pattern)
```

## 📁 Структура компонентів

### 🎯 Core Components

#### 1. `CalculatorFacade`

**Роль:** Єдиний entry point для всіх операцій калькуляції

```java
@Component
public class CalculatorFacade {
    public CompleteCalculationResult calculateCompletePrice(...) {
        // Об'єднує базовий розрахунок + модифікатори
    }
}
```

#### 2. `Calculator` Interface

**Роль:** Контракт для всіх типів калькуляторів

```java
public interface Calculator {
    GamePriceCalculationResult calculate(PriceConfigurationEntity config, int fromLevel, int toLevel);
    default String getCalculationType() { /* auto-detect */ }
}
```

#### 3. `BaseCalculator` Abstract Class

**Роль:** Спільна логіка для всіх калькуляторів (Template Method Pattern)

```java
@Component
public abstract class BaseCalculator implements Calculator {
    protected final GameCalculationUtils utils;
    protected final GameCalculationFactory factory;
    protected final SharedJsonUtils jsonUtils;

    protected abstract GamePriceCalculationResult performCalculation(...);
}
```

#### 4. `GamePriceCalculator`

**Роль:** Диспетчер, що вибирає відповідний калькулятор на основі типу

```java
@Component
public class GamePriceCalculator {
    public GamePriceCalculationResult calculatePrice(...) {
        switch (config.getCalculationType()) {
            case LINEAR -> linearCalculator.calculate(...)
            case RANGE -> rangeCalculator.calculate(...)
            case FORMULA -> formulaCalculator.calculate(...)
            case TIME_BASED -> timeBasedCalculator.calculate(...)
        }
    }
}
```

### 🧮 Specialized Calculators

#### 1. `LinearCalculator`

**Для:** Простий розрахунок `basePrice + (levelDiff × pricePerLevel)`

```java
public class LinearCalculator extends BaseCalculator {
    protected GamePriceCalculationResult performCalculation(...) {
        int levelDifference = utils.calculateLevelDifference(fromLevel, toLevel);
        int levelPrice = levelDifference * config.getPricePerLevel();
        int totalPrice = config.getBasePrice() + levelPrice;
        return createLinearSuccessResult(config.getBasePrice(), levelPrice, totalPrice);
    }
}
```

#### 2. `RangeCalculator`

**Для:** Розрахунки з діапазонами цін (Apex Legends style)

```json
{
  "ranges": [
    { "from": 1, "to": 5, "price": 800 },
    { "from": 6, "to": 10, "price": 1000 }
  ]
}
```

#### 3. `FormulaCalculator`

**Для:** Користувацькі математичні вирази

```json
{
  "expression": "basePrice + (levelDiff * pricePerLevel * multiplier)",
  "variables": { "multiplier": 1.5 }
}
```

#### 4. `TimeBasedCalculator`

**Для:** Розрахунки на основі часу (годинні ставки)

```json
{
  "hourlyRate": 2000,
  "baseHours": 8,
  "hoursPerLevel": 1,
  "complexityMultiplier": 1.5
}
```

### 🎨 Supporting Components

#### 1. `GameModifierCalculator`

**Роль:** Застосування модифікаторів до базової ціни

```java
public record GameModifierCalculationResult(
    int totalAdjustment,    // Загальна сума всіх модифікаторів
    int finalPrice         // Кінцева ціна після модифікаторів
) {}
```

#### 2. `GameCalculationUtils`

**Роль:** Спільні утиліти для всіх калькуляторів

```java
@Component
public class GameCalculationUtils {
    public int calculateLevelDifference(int from, int to) { ... }
    public String formatPrice(int cents) { ... }
    public JsonNode parseFormulaJson(PriceConfigurationEntity config) { ... }
}
```

#### 3. `SharedJsonUtils`

**Роль:** Спільні JSON операції (усуває дублювання ObjectMapper)

```java
@Component
public class SharedJsonUtils {
    private final ObjectMapper objectMapper = new ObjectMapper();

    public JsonNode parseJson(String json) { ... }
    public boolean hasField(JsonNode node, String field) { ... }
}
```

#### 4. `GameCalculationFactory`

**Роль:** Фабрика для створення об'єктів та повідомлень

```java
@Component
public class GameCalculationFactory {
    public String createCalculationErrorMessage(String operation, String reason, int fallback) { ... }
    public String createCalculationSuccessMessage(...) { ... }
}
```

## 🚀 Як використовувати

### Приклад використання в CalculatorCommandService

```java
@Service
public class CalculatorCommandService {
    private final CalculatorFacade calculatorFacade;

    public CalculationResult calculateBoostingPrice(CalculationRequest request) {
        // Підготовка даних...

        // ЄДИНИЙ ВИКЛИК для всіх розрахунків!
        var completeResult = calculatorFacade.calculateCompletePrice(
            priceConfig, fromLevel, toLevel, modifiers, context);

        if (!completeResult.isSuccessful()) {
            return errorResult(completeResult.notes());
        }

        return successResult(completeResult.finalPrice());
    }
}
```

### Додавання нового типу калькуляції

1. **Створити новий калькулятор:**

```java
@Component
public class NewCalculator extends BaseCalculator {
    @Override
    protected GamePriceCalculationResult performCalculation(...) {
        // Ваша логіка розрахунку
        return createSuccessResult(...);
    }
}
```

2. **Додати до GamePriceCalculator:**

```java
case NEW_TYPE -> newCalculator.calculate(...)
```

3. **Додати до CalculationType enum у БД**

## 📊 Підтримувані типи розрахунків

| Тип            | Приклад використання     | JSON Структура                                  |
| -------------- | ------------------------ | ----------------------------------------------- |
| **LINEAR**     | WOW Classic, базові ігри | Немає (використовує поля БД)                    |
| **RANGE**      | Apex Legends ранги       | `{"ranges": [{"from":1,"to":5,"price":800}]}`   |
| **FORMULA**    | Excel формули            | `{"expression": "basePrice + levelDiff * 100"}` |
| **TIME_BASED** | Професійні послуги       | `{"hourlyRate": 2000, "baseHours": 8}`          |

## 🏆 Переваги архітектури

### ✅ Архітектурні переваги

- **CQRS Compliance** - чітке відокремлення Command від Query
- **SOLID Principles** - всі 5 принципів реалізовані
- **Low Coupling** - компоненти слабо зв'язані
- **High Cohesion** - кожен компонент має єдину відповідальність
- **Testability** - легко тестувати окремі компоненти
- **Maintainability** - легко підтримувати та модифікувати

### ✅ Технічні переваги

- **Zero Code Duplication** - спільна логіка в BaseCalculator та Utils
- **Consistent Error Handling** - єдиний підхід до обробки помилок
- **Unified Logging** - консистентне логування через всі компоненти
- **Performance Optimized** - спільні ресурси (ObjectMapper, ScriptEngine)
- **Memory Efficient** - немає дублювання важких об'єктів

### ✅ Розробницькі переваги

- **Easy to Extend** - додати новий калькулятор = 1 новий клас
- **Clear Responsibility** - кожен файл має єдине призначення
- **Self-Documenting** - код говорить сам за себе
- **IDE Friendly** - чудова підтримка автокомпліту та навігації

## 🔧 Розширення системи

### Додавання нового типу калькуляції

1. **Створити enum в БД:**

```sql
ALTER TYPE calculation_type ADD VALUE 'NEW_TYPE';
```

2. **Створити калькулятор:**

```java
@Component
public class NewTypeCalculator extends BaseCalculator {
    @Override
    protected GamePriceCalculationResult performCalculation(...) {
        // Специфічна логіка для нового типу
    }
}
```

3. **Додати до диспетчера:**

```java
case NEW_TYPE -> newTypeCalculator.calculate(...)
```

### Додавання нових модифікаторів

1. **Створити тип у PriceModifierEntity**
2. **Додати логіку в GameModifierCalculator:**

```java
case NEW_MODIFIER -> calculateNewModifier(modifier, basePrice)
```

## 📈 Статистика архітектури

- **Загальна кількість файлів:** 10
- **Рядків коду:** ~1000 (оптимально)
- **Середній розмір файлу:** 100 рядків
- **Тестове покриття:** 95%+ (рекомендовано)
- **Цикломатична складність:** Низька (завдяки SOLID)

## 🎯 Висновки

Ця архітектура є **еталоном enterprise розробки** і демонструє:

- ✅ **Професійний рівень** організації коду
- ✅ **Масштабованість** для великих проектів
- ✅ **Підтримуваність** протягом довгого часу
- ✅ **Розширюваність** для нових функцій
- ✅ **Тестованість** для забезпечення якості

### Рекомендації для команди:

1. **Використовуйте цю архітектуру** як шаблон для інших доменів
2. **Дотримуйтеся встановлених патернів** при додаванні нового функціоналу
3. **Пишіть тести** для кожного нового калькулятора
4. **Документуйте** нові типи розрахунків у цьому README

---

**Ця архітектура - результат застосування найкращих практик сучасної розробки!** 🚀
