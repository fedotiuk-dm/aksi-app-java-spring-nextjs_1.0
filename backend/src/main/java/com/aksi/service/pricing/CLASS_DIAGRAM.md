# Class Diagram - Pricing Domain

```mermaid
classDiagram
    class PricingService {
        <<interface>>
        +calculatePrice(PriceCalculationRequest) PriceCalculationResponse
        +listPriceModifiers(categoryCode, active) PriceModifiersResponse
        +listDiscounts(active) DiscountsResponse
        +getApplicableModifierCodes(categoryCode) List~String~
        +isDiscountApplicableToCategory(discountCode, categoryCode) boolean
    }

    class PricingServiceImpl {
        -PriceModifierRepository priceModifierRepository
        -DiscountRepository discountRepository
        -PriceListService priceListService
        -PricingMapper pricingMapper
        -ItemPriceCalculator itemPriceCalculator
        -PricingRulesService pricingRulesService
        -TotalsCalculator totalsCalculator
    }

    class PriceCalculationService {
        <<Service - NOT Interface!>>
        -Map~UrgencyTypeEnum,Integer~ URGENCY_PERCENTAGES
        -Map~DiscountTypeEnum,Integer~ DISCOUNT_PERCENTAGES
        -Set~String~ DISCOUNT_EXCLUDED_CATEGORIES
        +calculateModifierAmount(modifier, baseAmount, quantity) int
        +calculateUrgencyAmount(amount, urgencyType) int
        +calculateDiscountAmount(amount, discountType, percentage) int
        +getUrgencyPercentage(urgencyType) int
        +getDiscountPercentage(discountType, customPercentage) int
        +isDiscountApplicableToCategory(categoryCode) boolean
    }

    class ItemPriceCalculator {
        -PricingRulesService pricingRulesService
        -PriceCalculationService priceCalculationService
        +calculate(item, priceListItem, globalModifiers) CalculatedItemPrice
    }

    class TotalsCalculator {
        -PriceCalculationService priceCalculationService
        +calculate(items, globalModifiers) CalculationTotals
    }

    class PricingRulesService {
        -PriceModifierRepository priceModifierRepository
        -PriceCalculationService priceCalculationService
        +determineBasePrice(priceListItem, color) int
        +isDiscountApplicableToCategory(discountCode, categoryCode) boolean
        +getModifier(modifierCode) PriceModifier
    }

    PricingService <|.. PricingServiceImpl : implements
    PricingServiceImpl --> ItemPriceCalculator : uses
    PricingServiceImpl --> TotalsCalculator : uses
    PricingServiceImpl --> PricingRulesService : uses
    
    ItemPriceCalculator --> PriceCalculationService : uses
    ItemPriceCalculator --> PricingRulesService : uses
    
    TotalsCalculator --> PriceCalculationService : uses
    
    PricingRulesService --> PriceCalculationService : uses
```

## Залежності між компонентами

```
┌─────────────────────────────────────┐
│         PricingServiceImpl          │
│  (Точка входу, координатор)         │
└─────────────┬───────────────────────┘
              │ Використовує
              ▼
┌─────────────────────────────────────┐
│    ItemPriceCalculator              │
│    TotalsCalculator                 │ ← Основні калькулятори
│    PricingRulesService              │
└─────────────┬───────────────────────┘
              │ Всі використовують
              ▼
┌─────────────────────────────────────┐
│    PriceCalculationService          │
│    (Центральний математичний сервіс)│ ← НЕ інтерфейс! Це @Service
└─────────────────────────────────────┘
```

## Чому PriceCalculationService НЕ інтерфейс?

1. **Це утилітний сервіс** - містить тільки логіку розрахунків
2. **Не потребує різних імплементацій** - математика однакова
3. **Зберігає константи** - Maps з OpenAPI значеннями
4. **@Service для DI** - Spring інжектить його в інші компоненти

## Типи залежностей

- **→** Прямі залежності (використовує)
- **⇢** Непрямі залежності (через інші компоненти)
- **◆** Композиція (володіє)
- **◇** Агрегація (використовує)