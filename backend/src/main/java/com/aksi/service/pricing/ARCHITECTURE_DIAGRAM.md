# Pricing Domain Architecture Diagram

## Детальна діаграма залежностей

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           REST API Layer                                 │
│                    POST /api/pricing/calculate                          │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        PricingServiceImpl                                │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ Координує всі компоненти для розрахунку цін                 │       │
│  │ • Валідує вхідні дані                                       │       │
│  │ • Викликає калькулятори                                     │       │
│  │ • Формує відповідь з warnings                               │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                          │
│  Залежності:                                                            │
│  ├── ItemPriceCalculator ──────┐                                       │
│  ├── TotalsCalculator ─────────┤                                       │
│  ├── PricingRulesService ──────┤                                       │
│  ├── PriceModifierRepository ──┤                                       │
│  ├── DiscountRepository ───────┤                                       │
│  └── PriceListService ─────────┘                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐
│ItemPriceCalculator│   │ TotalsCalculator  │   │PricingRulesService│
├───────────────────┤   ├───────────────────┤   ├───────────────────┤
│Розраховує ціну    │   │Підраховує загальні│   │Визначає правила   │
│одного предмета:   │   │суми:              │   │ціноутворення:     │
│                   │   │                   │   │                   │
│• Базова ціна      │   │• Сума предметів   │   │• Ціна за кольором │
│• Модифікатори     │   │• Загальна термін. │   │• Перевірка знижок │
│• Терміновість     │   │• Загальна знижка  │   │• Отримання модиф. │
│• Знижки           │   │• Фінальна сума    │   │                   │
└─────────┬─────────┘   └─────────┬─────────┘   └─────────┬─────────┘
          │                       │                         │
          └───────────────────────┴─────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      PriceCalculationService                             │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ Центральний сервіс для математичних розрахунків             │       │
│  │                                                              │       │
│  │ Константи з OpenAPI:                                         │       │
│  │ • URGENCY_PERCENTAGES (NORMAL: 0, EXPRESS_48H: 50, ...)     │       │
│  │ • DISCOUNT_PERCENTAGES (EVERCARD: 10, MILITARY: 10, ...)    │       │
│  │ • DISCOUNT_EXCLUDED_CATEGORIES (LAUNDRY, IRONING, DYEING)   │       │
│  │                                                              │       │
│  │ Методи:                                                      │       │
│  │ • calculateModifierAmount() - розрахунок модифікаторів      │       │
│  │ • calculateUrgencyAmount() - розрахунок терміновості        │       │
│  │ • calculateDiscountAmount() - розрахунок знижки             │       │
│  │ • isDiscountApplicableToCategory() - перевірка категорій    │       │
│  └─────────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────────┘

## Джерела даних

┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────┐
│   OpenAPI Schema    │     │   База даних (БД)   │     │  Інші сервіси   │
├─────────────────────┤     ├─────────────────────┤     ├─────────────────┤
│ GlobalPriceModifiers│     │ price_modifiers     │     │ PriceListService│
│ • urgencyType       │     │ • Складні модиф.    │     │ • Базові ціни   │
│ • discountType      │     │ • За категоріями    │     │ • Інфо товарів  │
│ • Константи %       │     │                     │     │                 │
│                     │     │ discounts           │     │                 │
│ x-discount-excluded │     │ • Розширена інфо    │     │                 │
│ -categories         │     │ • Для майбутнього   │     │                 │
└─────────────────────┘     └─────────────────────┘     └─────────────────┘
```

## Приклад послідовності викликів

```
1. POST /api/pricing/calculate
   │
   ▼
2. PricingServiceImpl.calculatePrice()
   ├── Для кожного item:
   │   ├── PriceListService.getPriceListItemById()
   │   └── ItemPriceCalculator.calculate()
   │       ├── PricingRulesService.determineBasePrice()
   │       ├── PricingRulesService.getModifier() 
   │       ├── PriceCalculationService.calculateModifierAmount()
   │       ├── PriceCalculationService.calculateUrgencyAmount()
   │       └── PriceCalculationService.calculateDiscountAmount()
   │
   └── TotalsCalculator.calculate()
       └── PriceCalculationService.getUrgencyPercentage()
       └── PriceCalculationService.getDiscountPercentage()
```