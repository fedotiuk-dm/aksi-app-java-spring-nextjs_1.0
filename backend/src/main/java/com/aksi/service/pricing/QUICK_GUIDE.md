# Швидкий гайд по Pricing домену

## 🎯 Головна ідея
Pricing домен розраховує ціни для хімчистки з урахуванням модифікаторів, терміновості та знижок.

## 🧩 Ключові компоненти

### 1. **PriceCalculationService** - це НЕ інтерфейс!
- Це конкретний `@Service` клас
- Містить всі математичні розрахунки
- Зберігає константи з OpenAPI
- Використовується всіма іншими калькуляторами

### 2. **Чому PriceCalculationService виглядає "не імплементованим"?**
```java
@Service  // <-- Це вже готовий сервіс!
public class PriceCalculationService {
    // Не потребує імплементації, бо це не інтерфейс
}
```

### 3. **Хто що робить?**

| Компонент | Відповідальність | Використовує |
|-----------|------------------|--------------|
| **PricingServiceImpl** | Координатор, точка входу | Всі інші компоненти |
| **ItemPriceCalculator** | Рахує ціну 1 предмета | PriceCalculationService |
| **TotalsCalculator** | Рахує загальні суми | PriceCalculationService |
| **PricingRulesService** | Бізнес-правила (колір, знижки) | PriceCalculationService |
| **PriceCalculationService** | Математика (BigDecimal) | Нікого (утиліта) |

## 📊 Звідки беруться дані?

```
OpenAPI (pricing-api.yaml)          База даних
├── Терміновість %                  ├── Складні модифікатори
├── Знижки %                        └── Додаткова інфо знижок
└── Виключені категорії             

        ↓                                   ↓
        
    PriceCalculationService ← використовують всі
    (Maps з константами)
```

## 🔄 Типовий flow

```
1. Запит → PricingServiceImpl
2. → ItemPriceCalculator (для кожного предмета)
   - Базова ціна (PricingRulesService)
   - + Модифікатори (PriceCalculationService)
   - + Терміновість (PriceCalculationService)
   - - Знижка (PriceCalculationService)
3. → TotalsCalculator (підсумки)
4. ← Відповідь з деталізацією
```

## ❓ Часті питання

**Q: Чому стільки сервісів?**
A: Кожен має одну відповідальність (SOLID)

**Q: Де логіка розрахунків?**
A: В PriceCalculationService (вся математика)

**Q: Чому константи не в properties?**
A: API-first підхід - генеруються з OpenAPI

**Q: Навіщо БД якщо все в OpenAPI?**
A: OpenAPI - прості правила, БД - складні модифікатори