features/
└── order-wizard/                     # Feature slice для Order Wizard
    ├── api/                          # Взаємодія з API (специфічна для цієї фічі)
    │   ├── orderApi.ts               # Запити, пов'язані з замовленням
    │   ├── itemApi.ts                # Запити, пов'язані з предметами
    │   └── index.ts                  # Експорт API клієнтів
    │
    ├── components/                    # UI компоненти (шар UI)
    │   ├── OrderWizard.tsx            # Головний контейнер візарда
    │   ├── WizardStepper.tsx          # Навігаційний компонент кроків
    │   │
    │   ├── step1-client-selection/    # Всі компоненти для Кроку 1
    │   │   ├── ClientSelectionStep.tsx # Головний компонент кроку
    │   │   ├── ClientSearchForm.tsx    # Форма пошуку клієнта
    │   │   ├── ClientCreateForm.tsx    # Форма створення клієнта
    │   │   ├── ReceptionPointSelect.tsx # Вибір пункту прийому
    │   │   ├── OrderBasicInfo.tsx      # Базова інформація замовлення
    │   │   └── index.ts               # Експорт компонентів
    │   │
    │   ├── step2-service-selection/   # Всі компоненти для Кроку 2
    │   │   ├── ServiceSelectionStep.tsx # Головний компонент кроку
    │   │   ├── ServiceItemTable.tsx    # Таблиця вибраних послуг
    │   │   ├── ServiceCatalog.tsx      # Каталог доступних послуг
    │   │   ├── TotalPriceDisplay.tsx   # Відображення загальної ціни
    │   │   │
    │   │   ├── service-item-form/      # Підвізард для додавання предмета
    │   │   │   ├── ServiceItemForm.tsx  # Головний контейнер форми
    │   │   │   ├── BasicInfoStep.tsx    # Підетап 2.1 - категорія, послуга
    │   │   │   ├── CharacteristicsStep.tsx # Підетап 2.2 - матеріал, колір
    │   │   │   └── ProcessingStep.tsx   # Підетап 2.3 - плями, дефекти
    │   │   │
    │   │   └── index.ts               # Експорт компонентів
    │   │
    │   ├── step3-order-details/       # Всі компоненти для Кроку 3
    │   │   ├── OrderDetailsStep.tsx   # Головний компонент кроку
    │   │   ├── ExecutionParams.tsx    # Параметри виконання
    │   │   ├── DiscountForm.tsx       # Форма знижок
    │   │   ├── PaymentDetails.tsx     # Деталі оплати
    │   │   └── index.ts               # Експорт компонентів
    │   │
    │   ├── step4-confirmation/        # Всі компоненти для Кроку 4
    │   │   ├── ConfirmationStep.tsx   # Головний компонент кроку
    │   │   ├── OrderSummary.tsx       # Підсумок замовлення
    │   │   ├── ReceiptPreview.tsx     # Попередній перегляд квитанції
    │   │   └── index.ts               # Експорт компонентів
    │   │
    │   └── shared/                    # Спільні UI компоненти для всіх кроків
    │       ├── ActionButtons.tsx      # Кнопки навігації
    │       ├── PriceFormatter.tsx     # Форматування цін
    │       └── StatusIndicator.tsx    # Індикатори стану
    │
    ├── model/                         # Бізнес-логіка (модель даних)
    │   ├── store/                     # Стан застосунку (Zustand)
    │   │   ├── orderWizardStore.ts    # Глобальний стор візарда
    │   │   └── index.ts               # Експорт сторів
    │   │
    │   └── utils/                     # Утиліти для бізнес-логіки
    │       ├── calculations.ts        # Розрахунки для замовлення
    │       ├── validation.ts          # Утиліти валідації
    │       └── formatters.ts          # Форматування даних
    │
    ├── types/                         # TypeScript типи
    │   ├── order-wizard.types.ts      # Типи для всього візарда
    │   └── index.ts                   # Експорт типів
    │
    └── index.ts                       # Головний експорт фічі