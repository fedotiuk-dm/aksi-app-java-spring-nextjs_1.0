# 🏗️ STAGE 2 ORDER WIZARD - РЕАЛІЗАЦІЯ З РЕАЛЬНИМИ ДОМЕННИМИ СЕРВІСАМИ

## 🎯 **СТРАТЕГІЧНИЙ ПІДХІД**

**Принцип:** Використовуємо існуючі доменні сервіси з першого дня розробки. Ніяких заглушок або TODO.

**Мета:** Створити повнофункціональний Stage 2 (Item Management) з реальною інтеграцією з усіма доменами.

## 🔗 **КОНТЕКСТ STAGE 2 В ORDER WIZARD**

### **Stage 2 НЕ є ізольованим!**

Stage 2 працює в контексті **вже створеного замовлення** з Stage 1:

```
Stage 1 створює замовлення з:
├── 👤 Клієнт (обраний/створений в 1.1)
├── 🏢 Філія (обрана в 1.2 "Пункт прийому замовлення")
├── 📄 Номер квитанції (згенерований)
├── 🏷️ Унікальна мітка (введена/скенована)
└── 📅 Дата створення (автоматично)

Stage 2 додає до замовлення:
├── 📦 Предмети (через підвізард 2.1-2.5)
├── 💰 Розрахунки цін з модифікаторами
├── 📸 Фотодокументація
└── 📊 Загальна вартість (динамічно)
```

### **Чому потрібні всі 4 Domain Facades:**

#### **1. PricingDomainFacade** 💰 - **ОСНОВНА РОБОТА**

- Категорії послуг, прайс-листи
- Розрахунки цін з модифікаторами
- Валідація категорія + предмет

#### **2. OrderDomainFacade** 📦 - **ОСНОВНА РОБОТА**

- CRUD операції з предметами замовлення
- Розрахунок підсумків замовлення
- Валідація стану для переходу до Stage 3

#### **3. ClientDomainFacade** 👤 - **КОНТЕКСТ + ВАЛІДАЦІЯ**

- Показ інформації про клієнта в UI
- Валідація що клієнт все ще існує
- Можливість редагування клієнта (при помилці)

#### **4. BranchDomainFacade** 🏢 - **КОНТЕКСТ + ВАЛІДАЦІЯ**

- Показ інформації про філію в UI
- Валідація що філія активна
- Підготовка даних для квитанції (Stage 4)

### **UI контекст Stage 2:**

```
┌─────────────────────────────────────────────┐
│ 🏢 Філія: Центральна (вул. Шевченка, 15)    │
│ 👤 Клієнт: Іван Петренко (+380501234567)    │
│ 📄 Квитанція: #CT-2024-001234               │
│ ──────────────────────────────────────────── │
│                                             │
│           ТАБЛИЦЯ ПРЕДМЕТІВ                 │
│  ┌─────────────────────────────────────┐     │
│  │ Піджак    │ Чистка │ 150 грн │ ✏️ 🗑️ │     │
│  │ Сукня     │ Чистка │ 200 грн │ ✏️ 🗑️ │     │
│  └─────────────────────────────────────┘     │
│                                             │
│  [+ Додати предмет]                         │
│                                             │
│  💰 Загальна вартість: 350 грн              │
│  [Продовжити до наступного етапу]           │
└─────────────────────────────────────────────┘
```

---

## 📊 **ІСНУЮЧІ ДОМЕННІ СЕРВІСИ (ГОТОВІ ДО ВИКОРИСТАННЯ)**

### 💰 **Pricing Domain - ПОВНІСТЮ ГОТОВИЙ**

```java
✅ PriceCalculationService - розрахунок цін з модифікаторами
✅ PriceListDomainService - категорії та прайс-листи
✅ PriceModifierCalculationService - додаткові послуги
✅ ServiceCategoryDTO, PriceListItemDTO, PriceCalculationResponseDTO
```

### 📦 **Order Domain - ПОВНІСТЮ ГОТОВИЙ**

```java
✅ OrderFinancialService - фінансові розрахунки замовлень
✅ DiscountService - знижки та спеціальні пропозиції
✅ PaymentService - розрахунки оплати
✅ OrderEntity, OrderItemEntity, OrderRepository
```

### 👤 **Client Domain - ПОВНІСТЮ ГОТОВИЙ**

```java
✅ ClientService - CRUD операції з клієнтами
✅ ClientResponse, CreateClientRequest, UpdateClientRequest
```

### 🏢 **Branch Domain - ПОВНІСТЮ ГОТОВИЙ**

```java
✅ BranchLocationService - управління філіями
✅ BranchLocationDTO
```

---

## 🏗️ **АРХІТЕКТУРА STAGE 2**

### **Основні компоненти:**

```
📁 stage2/
├── 🎯 api/                    # REST контролери
├── 🏗️ core/                  # Основна логіка координації
├── 🖥️ main/                  # Головний екран (таблиця предметів)
├── 🔄 subwizard/             # Підвізард додавання предметів (2.1-2.5)
├── 🔗 integration/           # Інтеграція з доменними сервісами
├── 📊 shared/                # Спільні DTO та утиліти
└── ⚙️ config/                # Конфігурація
```

### **Потоки взаємодії:**

1. **Головний екран (2.0):**

   ```
   Frontend → API → Core → Main → Integration → Domain Services
   ```

2. **Підвізард (2.1-2.5):**
   ```
   Frontend → API → Core → Subwizard → Integration → Domain Services
   ```

---

## 📋 **ПЛАН РЕАЛІЗАЦІЇ З ВІДМІТКАМИ ПРОГРЕСУ**

### 🎯 **ЕТАП 1: ІНТЕГРАЦІЙНИЙ ШАР (ПРІОРИТЕТ)**

#### **Day 1: Domain Integration Facades**

- [x] `PricingDomainFacade` - інтеграція з pricing сервісами ✅
- [x] `OrderDomainFacade` - інтеграція з order сервісами ✅
- [x] `ClientDomainFacade` - інтеграція з client сервісами ✅
- [x] `BranchDomainFacade` - інтеграція з branch сервісами ✅
- [ ] Тести інтеграційних фасадів

#### **Day 1: Shared DTOs**

- [ ] `ItemTableRowDTO` - рядок таблиці предметів
- [ ] `OrderSummaryResponseDTO` - підсумок замовлення
- [ ] `SubwizardRequestDTO` - запити підвізарда
- [ ] `PricingCalculationDTO` - результати розрахунків
- [ ] Валідація всіх DTO

### 🏗️ **ЕТАП 2: CORE LAYER (КООРДИНАЦІЯ)**

#### **Day 2: Central Orchestration**

- [ ] `Stage2CoreService` - головний сервіс координації
- [ ] `Stage2StateMachine` - управління станом Stage 2
- [ ] `WorkflowManager` - управління робочими процесами
- [ ] `ValidationEngine` - централізована валідація
- [ ] Інтеграція з Spring State Machine

#### **Day 2: Error Handling**

- [ ] `Stage2Exception` - специфічні винятки
- [ ] `Stage2ErrorHandler` - глобальна обробка помилок
- [ ] `ValidationErrorMapper` - маппер помилок валідації
- [ ] Логування всіх операцій

### 🖥️ **ЕТАП 3: MAIN SCREEN (ГОЛОВНИЙ ЕКРАН 2.0)**

#### **Day 3: Item Table Management**

- [ ] `ItemTableService` - управління таблицею предметів
- [ ] `ItemOperationsService` - операції CRUD над предметами
- [ ] `TableDataProvider` - постачальник даних для таблиці
- [ ] `ItemValidationService` - валідація предметів
- [ ] Інтеграція з OrderDomainFacade

#### **Day 3: Order Summary Calculation**

- [ ] `OrderSummaryService` - розрахунок підсумків замовлення
- [ ] `DiscountCalculator` - розрахунок знижок
- [ ] `TotalCalculator` - розрахунок загальних сум
- [ ] `SummaryFormatter` - форматування підсумків
- [ ] Інтеграція з PricingDomainFacade

#### **Day 3: Action Management**

- [ ] `ActionDispatcher` - диспетчер дій користувача
- [ ] `TransitionManager` - управління переходами
- [ ] `SessionManager` - управління сесіями
- [ ] Обробка дій: Add/Edit/Delete/Navigate

### 🔄 **ЕТАП 4: SUBWIZARD (ПІДВІЗАРД 2.1-2.5)**

#### **Day 4: Subwizard Coordination**

- [ ] `SubwizardCoordinator` - головний координатор підвізарда
- [ ] `StageNavigator` - навігація між підетапами
- [ ] `DataCollector` - збір даних з підетапів
- [ ] `SubwizardValidator` - валідація підвізарда
- [ ] `ItemAssembler` - складання фінального предмета

#### **Day 5: Stage 2.1 - Basic Info**

- [ ] `BasicInfoService` - основна інформація про предмет
- [ ] `CategorySelector` - вибір категорії послуги
- [ ] `PriceListProvider` - постачальник прайс-листа
- [ ] `UnitMeasureManager` - управління одиницями виміру
- [ ] Інтеграція з PricingDomainFacade

#### **Day 5: Stage 2.2 - Characteristics**

- [ ] `CharacteristicsService` - характеристики предмета
- [ ] `MaterialSelector` - вибір матеріалу
- [ ] `ColorManager` - управління кольорами
- [ ] `WearLevelAssigner` - призначення ступеня зносу
- [ ] Динамічні списки на основі категорії

#### **Day 6: Stage 2.3 - Stains & Defects**

- [ ] `StainsDefectsService` - плями та дефекти
- [ ] `StainAnalyzer` - аналіз плям
- [ ] `DefectDetector` - виявлення дефектів
- [ ] `RiskAssessment` - оцінка ризиків
- [ ] `NotesManager` - управління примітками

#### **Day 6: Stage 2.4 - Pricing**

- [ ] `PricingCalculationService` - розрахунок ціни предмета
- [ ] `ModifierSelector` - вибір модифікаторів ціни
- [ ] `InteractivePriceDisplay` - інтерактивне відображення ціни
- [ ] `PriceBreakdownFormatter` - деталізація розрахунків
- [ ] Реальні розрахунки через PricingDomainFacade

#### **Day 7: Stage 2.5 - Photo Documentation**

- [ ] `PhotoManagementService` - управління фотографіями
- [ ] `FileUploadHandler` - завантаження файлів
- [ ] `ImageProcessor` - обробка зображень
- [ ] `PhotoValidator` - валідація фотографій
- [ ] Інтеграція з файловою системою

### 🎯 **ЕТАП 5: API LAYER (REST ENDPOINTS)**

#### **Day 8: REST Controllers**

- [ ] `Stage2Controller` - основний контролер Stage 2
- [ ] `ItemTableController` - API таблиці предметів
- [ ] `SubwizardController` - API підвізарда
- [ ] `CalculationController` - API розрахунків
- [ ] Swagger документація

#### **Day 8: Request/Response Mapping**

- [ ] `Stage2RequestMapper` - маппер запитів
- [ ] `Stage2ResponseMapper` - маппер відповідей
- [ ] `ErrorResponseMapper` - маппер помилок
- [ ] `ValidationResponseMapper` - маппер валідації
- [ ] Конвертація між API та Domain моделями

### ✅ **ЕТАП 6: TESTING & VALIDATION**

#### **Day 9: Unit Testing**

- [ ] Тести для всіх сервісів
- [ ] Тести для інтеграційних фасадів
- [ ] Тести для валідації
- [ ] Тести для розрахунків
- [ ] 90%+ покриття тестами

#### **Day 9: Integration Testing**

- [ ] Тести інтеграції з доменними сервісами
- [ ] Тести State Machine
- [ ] Тести API endpoints
- [ ] Тести робочих процесів
- [ ] E2E тести через REST API

#### **Day 10: Performance & Optimization**

- [ ] Профілювання продуктивності
- [ ] Оптимізація запитів до БД
- [ ] Кешування часто використовуваних даних
- [ ] Налаштування логування
- [ ] Фінальна валідація всього Stage 2

---

## 📁 **ДЕТАЛЬНА СТРУКТУРА ФАЙЛІВ**

### 🔗 **Integration Layer**

```
integration/
├── domain/
│   ├── pricing/
│   │   ├── PricingDomainFacade.java
│   │   ├── CategoryDataProvider.java
│   │   ├── PriceCalculationProvider.java
│   │   └── ModifierDataProvider.java
│   ├── order/
│   │   ├── OrderDomainFacade.java
│   │   ├── OrderItemManager.java
│   │   ├── FinancialCalculator.java
│   │   └── DiscountManager.java
│   ├── client/
│   │   └── ClientDomainFacade.java
│   └── branch/
│       └── BranchDomainFacade.java
└── mapper/
    ├── DomainToStage2Mapper.java
    └── Stage2ToDomainMapper.java
```

### 🏗️ **Core Layer**

```
core/
├── service/
│   ├── Stage2CoreService.java
│   ├── WorkflowManager.java
│   └── ValidationEngine.java
├── statemachine/
│   ├── Stage2StateMachine.java
│   ├── StateTransitionHandler.java
│   └── ContextManager.java
└── exception/
    ├── Stage2Exception.java
    └── Stage2ErrorHandler.java
```

### 🖥️ **Main Screen Layer**

```
main/
├── service/
│   ├── ItemTableService.java
│   ├── OrderSummaryService.java
│   ├── ActionDispatcher.java
│   └── SessionManager.java
├── calculator/
│   ├── DiscountCalculator.java
│   ├── TotalCalculator.java
│   └── SummaryFormatter.java
└── validator/
    ├── ItemValidationService.java
    └── TableValidationService.java
```

### 🔄 **Subwizard Layer**

```
subwizard/
├── coordinator/
│   ├── SubwizardCoordinator.java
│   ├── StageNavigator.java
│   ├── DataCollector.java
│   └── ItemAssembler.java
├── stages/
│   ├── stage1/           # Basic Info (2.1)
│   │   ├── BasicInfoService.java
│   │   ├── CategorySelector.java
│   │   └── PriceListProvider.java
│   ├── stage2/           # Characteristics (2.2)
│   │   ├── CharacteristicsService.java
│   │   ├── MaterialSelector.java
│   │   └── ColorManager.java
│   ├── stage3/           # Stains & Defects (2.3)
│   │   ├── StainsDefectsService.java
│   │   ├── StainAnalyzer.java
│   │   └── DefectDetector.java
│   ├── stage4/           # Pricing (2.4)
│   │   ├── PricingCalculationService.java
│   │   ├── ModifierSelector.java
│   │   └── InteractivePriceDisplay.java
│   └── stage5/           # Photos (2.5)
│       ├── PhotoManagementService.java
│       ├── FileUploadHandler.java
│       └── ImageProcessor.java
└── navigation/
    ├── NavigationManager.java
    ├── ProgressTracker.java
    └── ValidationGate.java
```

### 📊 **Shared Layer**

```
shared/
├── dto/
│   ├── request/
│   │   ├── ItemActionRequestDTO.java
│   │   ├── SubwizardRequestDTO.java
│   │   └── PricingRequestDTO.java
│   ├── response/
│   │   ├── ItemTableResponseDTO.java
│   │   ├── OrderSummaryResponseDTO.java
│   │   └── SubwizardResponseDTO.java
│   └── internal/
│       ├── ItemDataDTO.java
│       ├── PricingDataDTO.java
│       └── ValidationResultDTO.java
├── model/
│   ├── ItemTableModel.java
│   ├── OrderSummaryModel.java
│   └── SubwizardSessionModel.java
├── enums/
│   ├── SubwizardStage.java
│   ├── ItemAction.java
│   └── ValidationStatus.java
└── validator/
    ├── Stage2Validator.java
    └── BusinessRuleValidator.java
```

---

## 🎯 **ПРИНЦИПИ РОЗРОБКИ**

### **1. Real Data First**

- ✅ Використовуємо реальні доменні сервіси з першого дня
- ✅ Тестуємо з реальними даними
- ✅ Виявляємо інтеграційні проблеми раніше

### **2. Service Oriented Architecture**

- ✅ Кожен сервіс має одну чітку відповідальність
- ✅ Слабке зчеплення через інтерфейси
- ✅ Легке тестування та заміна компонентів

### **3. Domain Driven Design**

- ✅ Бізнес-логіка в доменному шарі
- ✅ Stage 2 як bounded context
- ✅ Ubiquitous language в іменуванні

### **4. Test Driven Development**

- ✅ Тести пишуться разом з кодом
- ✅ Високе покриття тестами
- ✅ Інтеграційні тести з реальними сервісами

### **5. API First Design**

- ✅ Swagger документація
- ✅ Версіонування API
- ✅ Консистентна обробка помилок

---

## 🔄 **РОБОЧИЙ ПРОЦЕС**

### **Поточний статус:**

✅ **Day 1 ЗАВЕРШЕНО** - Integration Layer створено з усіма 4 фасадами

### **Щоденний цикл розробки:**

1. **Ранок**: Планування дня на основі чекліста
2. **Розробка**: Реалізація запланованих компонентів
3. **Тестування**: Unit + Integration тести
4. **Інтеграція**: Підключення до реальних сервісів
5. **Валідація**: Перевірка функціональності
6. **Документація**: Оновлення прогресу

### **Критерії готовності компонента:**

- ✅ Код написаний та відрефакторений
- ✅ Unit тести покривають основну логіку
- ✅ Integration тести з реальними сервісами
- ✅ Логування та обробка помилок
- ✅ Документація (JavaDoc + README)

---

## 📈 **МЕТРИКИ УСПІХУ**

### **Технічні метрики:**

- ✅ 90%+ покриття тестами
- ✅ Всі API endpoints відповідають за < 200ms
- ✅ Нуль критичних помилок
- ✅ Всі інтеграційні тести проходять

### **Функціональні критерії:**

- ✅ Повна відповідність Order Wizard документації
- ✅ Коректні розрахунки цін з усіма модифікаторами
- ✅ Безшовна інтеграція з Stage 1 та Stage 3
- ✅ Робота з реальними даними без помилок

### **Архітектурні вимоги:**

- ✅ Модульна архітектура (легко тестувати)
- ✅ Слабке зчеплення компонентів
- ✅ Дотримання SOLID принципів
- ✅ Ясна separation of concerns

---

## 🚀 **ГОТОВИЙ РОЗПОЧАТИ РЕАЛІЗАЦІЮ?**

**Перший крок:** Створення Integration Layer з реальними доменними сервісами.

**Сьогодні фокус:** PricingDomainFacade та OrderDomainFacade з повною інтеграцією.

**Завтра:** Core Layer та перший робочий Main Screen з реальними даними.

**Результат тижня:** Повнофункціональний Stage 2 з реальною інтеграцією всіх доменів.

## 🎯 **ДЕТАЛЬНІ БІЗНЕС-ПРАВИЛА STAGE 2 (ІНТЕГРАЦІЯ З ІСНУЮЧИМИ ДОМЕНАМИ)**

> **⚠️ ВАЖЛИВО:** Всі описані нижче дані **УЖЕ ІСНУЮТЬ** в domain сервісах!
> Stage 2 тільки **ПІДКЛЮЧАЄТЬСЯ** до них через Integration Layer.

### **2.0 - Головний екран менеджера предметів:**

#### **Таблиця предметів (ItemTableService):**

```java
// Колонки таблиці:
- itemName: String          // Найменування предмета
- category: String          // Категорія (з ServiceCategoryDTO)
- quantity: String          // "2 шт" або "1.5 кг"
- material: String          // Матеріал предмета
- color: String             // Колір предмета
- totalPrice: BigDecimal    // Фінальна сума за предмет
- canEdit: boolean          // Чи можна редагувати
- canDelete: boolean        // Чи можна видалити
```

#### **Лічильник вартості (OrderSummaryService):**

```java
// Розрахунки:
- itemsCount: int           // Кількість предметів
- subtotal: BigDecimal      // Сума до знижок/надбавок
- totalPrice: BigDecimal    // Фінальна сума
- hasItems: boolean         // Чи є предмети в замовленні
```

### **2.1 - Основна інформація (BasicInfoService):**

#### **Категорії послуг (УЖЕ ІСНУЮТЬ в PricingDomain → ServiceCategoryDTO):**

```java
// ✅ ГОТОВІ ДАНІ з PriceListDomainService.getAllCategories()
TEXTILE_CLEANING("CLEAN_TEXTILE", "Чистка одягу та текстилю"),
LAUNDRY("LAUNDRY", "Прання білизни"),
IRONING("IRONING", "Прасування"),
LEATHER_CLEANING("CLEAN_LEATHER", "Чистка та відновлення шкіряних виробів"),
SHEEPSKIN("SHEEPSKIN", "Дублянки"),
FUR("FUR", "Вироби із натурального хутра"),
TEXTILE_DYEING("DYE_TEXTILE", "Фарбування текстильних виробів")
```

#### **Найменування виробів (УЖЕ ІСНУЮТЬ в PricingDomain → PriceListItemDTO):**

```java
// ✅ ГОТОВІ ДАНІ з PriceListDomainService.getPriceListItemsByCategory(categoryCode)
// Залежить від вибраної категорії
// Кожен PriceListItemDTO містить: name, basePrice, unitOfMeasure
```

#### **Одиниці виміру (UnitMeasureManager):**

```java
PIECES("шт"),       // Для більшості виробів
KILOGRAMS("кг")     // Для білизни та певних текстильних виробів
```

### **2.2 - Характеристики (CharacteristicsService):**

#### **Матеріали (MaterialSelector):**

```java
// Загальні матеріали:
COTTON("Бавовна"),
WOOL("Шерсть"),
SILK("Шовк"),
SYNTHETIC("Синтетика"),

// Для шкіряних виробів:
SMOOTH_LEATHER("Гладка шкіра"),
NUBUCK("Нубук"),
SUEDE("Замша"),
SPLIT_LEATHER("Спілок")
```

#### **Кольори (ColorManager):**

```java
// Базові кольори для швидкого вибору:
BLACK, WHITE, RED, BLUE, GREEN, YELLOW, BROWN, GRAY, OTHER

// + customColor: String для власного кольору
```

#### **Наповнювачі (для певних категорій):**

```java
DOWN("Пух"),
SYNTHETIC_PADDING("Синтепон"),
OTHER("Інше"),
// + isDamagedFilling: boolean "Збитий наповнювач"
```

#### **Ступінь зносу (WearLevelAssigner):**

```java
WEAR_10(10, "10%"),
WEAR_30(30, "30%"),
WEAR_50(50, "50%"),
WEAR_75(75, "75%")
```

### **2.3 - Забруднення та дефекти (StainsDefectsService):**

#### **Типи плям (StainAnalyzer - мультивибір):**

```java
GREASE("Жир"),
BLOOD("Кров"),
PROTEIN("Білок"),
WINE("Вино"),
COFFEE("Кава"),
GRASS("Трава"),
INK("Чорнило"),
COSMETICS("Косметика"),
OTHER("Інше") // + customStain: String
```

#### **Дефекти та ризики (DefectDetector - мультивибір):**

```java
WEAR_MARKS("Потертості"),
TORN("Порване"),
MISSING_HARDWARE("Відсутність фурнітури"),
DAMAGED_HARDWARE("Пошкодження фурнітури"),
COLOR_CHANGE_RISK("Ризики зміни кольору"),
DEFORMATION_RISK("Ризики деформації"),
NO_WARRANTY("Без гарантій") // + warningReason: String (обов'язкове)
```

#### **Примітки (NotesManager):**

```java
defectNotes: String // Примітки щодо дефектів
```

### **2.4 - Розрахунок ціни (PricingCalculationService):**

#### **Базова ціна (УЖЕ ІСНУЄ in PricingDomain → PriceCalculationService):**

```java
// ✅ ГОТОВИЙ СЕРВІС: PriceCalculationService.calculatePrice(categoryCode, itemName, color)
// Може відрізнятися для чорного/світлих кольорів
```

#### **Загальні модифікатори (УЖЕ ІСНУЮТЬ in PricingDomain → PriceModifierCalculationService):**

```java
// ✅ ГОТОВІ МОДИФІКАТОРИ з PriceModifierCalculationService
CHILDREN_ITEMS(30, "Дитячі речі (до 30 розміру)"),      // -30%
HAND_CLEANING(20, "Ручна чистка"),                       // +20%
HEAVILY_SOILED(20, 100, "Дуже забруднені речі"),        // +20% до +100%
EXPRESS_CLEANING(50, 100, "Термінова чистка")           // +50% до +100%
```

#### **Модифікатори для текстилю (тільки для текстильних категорій):**

```java
FUR_COLLAR_CUFFS(30, "Хутряні коміри та манжети"),                    // +30%
WATER_REPELLENT(30, "Водовідштовхуюче покриття"),                     // +30%
NATURAL_SILK(50, "Натуральний шовк, атлас, шифон"),                   // +50%
COMBINED_MATERIALS(100, "Комбіновані вироби (шкіра+текстиль)"),       // +100%
LARGE_TOYS(100, "Великі м'які іграшки"),                              // +100%
BUTTON_SEWING("Пришивання гудзиків"),                                  // фіксована ціна
BLACK_LIGHT_COLORS(20, "Чорні та світлі тони"),                       // +20%
WEDDING_DRESS_TRAIN(30, "Весільна сукня зі шлейфом")                  // +30%
```

#### **Модифікатори для шкіри (тільки для шкіряних категорій):**

```java
LEATHER_IRONING(70, "Прасування шкіряних виробів"),                   // 70% від чистки
LEATHER_WATER_REPELLENT(30, "Водовідштовхуюче покриття"),            // +30%
DYEING_AFTER_OUR_CLEANING(50, "Фарбування після нашої чистки"),      // +50%
DYEING_AFTER_OTHER_CLEANING(100, "Фарбування після чистки деінде"),  // 100% від чистки
LEATHER_INSERTS(30, "Вставки (шкіра іншого кольору, текстиль)"),     // +30%
PEARL_COATING(30, "Перламутрове покриття"),                           // +30%
ARTIFICIAL_FUR_SHEEPSKIN(-20, "Дублянки на штучному хутрі"),          // -20%
LEATHER_BUTTON_SEWING("Пришивання гудзиків"),                         // фіксована ціна
HAND_LEATHER_CLEANING(30, "Ручна чистка шкіри")                      // +30%
```

#### **Інтерактивний розрахунок (InteractivePriceDisplay):**

```java
PriceBreakdown {
    basePrice: BigDecimal,
    appliedModifiers: List<ModifierCalculation>,
    intermediateCalculations: List<String>,  // покрокові розрахунки
    finalPrice: BigDecimal
}

ModifierCalculation {
    modifierName: String,
    modifierType: ModifierType,  // PERCENTAGE, FIXED_AMOUNT, REPLACEMENT
    originalValue: BigDecimal,   // відсоток або сума
    appliedAmount: BigDecimal,   // реальна сума впливу
    description: String
}
```

### **2.5 - Фотодокументація (PhotoManagementService):**

#### **Управління файлами (FileUploadHandler):**

```java
PhotoUploadRequest {
    files: List<MultipartFile>,  // до 5 файлів
    maxFileSize: 5MB,           // обмеження розміру
    allowedTypes: ["image/jpeg", "image/png", "image/webp"]
}

PhotoProcessingResult {
    originalFiles: List<FileMetadata>,
    compressedFiles: List<FileMetadata>,  // стиснені версії
    thumbnails: List<FileMetadata>,       // мініатюри
    validationErrors: List<String>
}
```

#### **Обробка зображень (ImageProcessor):**

```java
- Автоматичне стиснення > 2MB
- Генерація мініатюр 150x150px
- Конвертація в WebP для оптимізації
- EXIF дані для метаінформації
```

---

## 🔗 **ПІДСУМОК: ІНТЕГРАЦІЙНИЙ ПІДХІД**

### **🎯 ЩО ВЖЕ ГОТОВЕ (не треба реалізовувати):**

```java
✅ Всі категорії послуг         → ServiceCategoryDTO
✅ Всі прайс-листи              → PriceListItemDTO
✅ Всі модифікатори цін         → PriceModifierCalculationService
✅ Всі розрахунки цін           → PriceCalculationService
✅ Всі фінансові операції       → OrderFinancialService
✅ Всі операції з клієнтами     → ClientService
✅ Всі операції з філіями       → BranchLocationService
```

### **🎯 ЩО ТРЕБА СТВОРИТИ (тільки Integration Layer):**

```java
PricingDomainFacade    → підключення до PricingDomain
OrderDomainFacade      → підключення до OrderDomain
ClientDomainFacade     → підключення до ClientDomain
BranchDomainFacade     → підключення до BranchDomain

+ координація + UI логіка + State Machine
```

---

## 🔗 **ІНТЕГРАЦІЯ З SPRING STATE MACHINE**

### **State Machine Context Data:**

```java
Stage2Context {
    // КОНТЕКСТ З STAGE 1 (наслідуємо)
    orderId: UUID,                    // ID вже створеного замовлення
    clientId: UUID,                   // ID клієнта з Stage 1
    branchId: UUID,                   // ID філії з Stage 1
    receiptNumber: String,            // Номер квитанції
    uniqueLabel: String,              // Унікальна мітка
    createdDate: LocalDateTime,       // Дата створення

    // ГОЛОВНИЙ ЕКРАН STAGE 2
    itemTableData: List<ItemTableRowDTO>,
    orderSummary: OrderSummaryResponseDTO,

    // ПІДВІЗАРД STAGE 2
    currentSubwizardSession: SubwizardSessionDTO,
    currentStage: SubwizardStage,

    // ДАНІ ПІДВІЗАРДА
    basicInfo: BasicInfoDTO,
    characteristics: CharacteristicsDTO,
    stainsDefects: StainsDefectsDTO,
    pricing: PricingCalculationDTO,
    photos: List<PhotoMetadataDTO>,

    // ВАЛІДАЦІЯ
    validationResults: ValidationResultDTO,
    canProceedToNextStage: boolean,
    canCompleteSubwizard: boolean
}
```

### **Events для State Machine:**

```java
// ІНІЦІАЛІЗАЦІЯ STAGE 2 (отримання контексту з Stage 1)
INITIALIZE_STAGE2,
LOAD_ORDER_CONTEXT,
VALIDATE_STAGE1_COMPLETION,

// ГОЛОВНИЙ ЕКРАН
LOAD_ITEM_TABLE,
ADD_NEW_ITEM,
EDIT_EXISTING_ITEM,
DELETE_ITEM,
REFRESH_ORDER_SUMMARY,

// ПІДВІЗАРД НАВІГАЦІЯ
START_SUBWIZARD,
PROCEED_TO_NEXT_STAGE,
GO_BACK_TO_PREVIOUS_STAGE,
COMPLETE_SUBWIZARD,
CANCEL_SUBWIZARD,

// ВАЛІДАЦІЯ
VALIDATE_CURRENT_STAGE,
VALIDATE_FULL_ITEM,
VALIDATE_ORDER_INTEGRITY,      // перевірка що замовлення + клієнт + філія валідні

// РОЗРАХУНКИ
RECALCULATE_PRICE,
APPLY_MODIFIERS,
UPDATE_TOTAL_PRICE,

// ПЕРЕХІД ДО STAGE 3
COMPLETE_STAGE2,
PREPARE_FOR_STAGE3
```

---

## 🎯 **ОНОВЛЕНІ ЕТАПИ РЕАЛІЗАЦІЇ**
