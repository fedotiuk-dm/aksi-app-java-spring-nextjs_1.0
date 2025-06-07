# Детальний план реалізації Етапу 2: Менеджер предметів Order Wizard

## Загальна структура реалізації

```
backend/src/main/java/com/aksi/domain/order/statemachine/stage2/
├── adapter/                    # State Machine адаптери
├── actions/                    # State Machine дії
├── guards/                     # State Machine гарди
├── service/                    # Координаційні сервіси
├── dto/                        # DTO для етапу 2
├── mapper/                     # Маппери ✅ ГОТОВО
├── validator/                  # Валідатори
├── enums/                      # Енуми
├── integration/                # Інтеграція з доменами
├── substep1/                   # Підетап 2.1: Основна інформація
├── substep2/                   # Підетап 2.2: Характеристики
├── substep3/                   # Підетап 2.3: Дефекти та плями
├── substep4/                   # Підетап 2.4: Розрахунок ціни
└── substep5/                   # Підетап 2.5: Фотодокументація
```

---

## 🎯 Етап 2.0: Головний екран менеджера предметів

### Крок 1: Базові компоненти етапу 2

#### 1.1. Створення enum'ів

- [x] **ItemWizardStep.java** ✅ ГОТОВО

  - BASIC_INFO, CHARACTERISTICS, DEFECTS_STAINS, PRICING, PHOTOS
  - Навігаційні методи (getNext, getPrevious, isRequired)
  - Метадані кроків (stepNumber, stepName, description)

- [ ] **Stage2Status.java**

  - INITIALIZED, ITEM_WIZARD_ACTIVE, COMPLETED

- [ ] **ValidationStatus.java**
  - VALID, INVALID, PENDING

#### 1.2. Створення основних DTO

- [x] **ItemManagementDTO.java** ✅ ГОТОВО

  - List<OrderItemDTO> addedItems
  - BigDecimal totalAmount
  - Boolean canProceedToNextStage
  - String currentStatus
  - Логіка розрахунку готовності

- [x] **ItemWizardSessionDTO.java** ✅ ГОТОВО
  - String wizardId, itemWizardId
  - ItemWizardStep currentStep
  - Map<String, Object> wizardData
  - Boolean isEditMode, editingItemId
  - Навігаційні методи кроків

#### 1.3. Головний адаптер

- [x] **Stage2StateMachineAdapter.java** ✅ ГОТОВО
  - initializeStage2() ✅
  - startNewItemWizard() ✅
  - startEditItemWizard() ✅
  - completeItemWizard() ✅
  - deleteItem() ✅
  - finalizeStage2() ✅
  - canCompleteStage2() ✅
  - Управління контекстом State Machine ✅

#### 1.4. Координаційний сервіс

- [x] **Stage2CoordinationService.java** ✅ ГОТОВО
  - ініціалізація етапу 2 ✅
  - управління списком предметів ✅
  - валідація готовності до завершення ✅
  - розрахунок загальної суми ✅
  - Інтеграція з OrderService ✅
  - Інтеграція з PriceListDomainService ✅

#### 1.5. Управління сесіями Item Wizard

- [x] **ItemWizardManagementService.java** ✅ ГОТОВО + ОНОВЛЕНО
  - Створення нових сесій ✅
  - Режим редагування ✅
  - Збереження стану між кроками ✅
  - Валідація завершеності сесії ✅
  - Циклічність підвізарда ✅
  - **ВИКОРИСТОВУЄ МАППЕРИ** ✅ НЕ ЗАГЛУШКИ!

#### 1.6. Маппери для роботи з даними ✅ СТВОРЕНО

- [x] **ItemWizardDataMapper.java** ✅ ГОТОВО

  - Збірка OrderItemDTO з усіх кроків підвізарда
  - 14 методів витягування даних з кроків
  - MapStruct інтерфейс з правильними анотаціями
  - Обробка помилок та fallback значення

- [x] **ItemEditDataMapper.java** ✅ ГОТОВО
  - Розбір OrderItemDTO на дані підетапів для редагування
  - Заповнення всіх 5 підетапів з існуючого предмета
  - Валідація даних для редагування
  - Обробка відсутніх полів

### Крок 2: Інтеграція з State Machine

#### 2.1. Розширення OrderState

- ✅ **OrderState.java вже містить необхідні стани:**
  - ITEM_MANAGEMENT
  - ITEM_WIZARD_ACTIVE
  - ITEM_BASIC_INFO
  - ITEM_CHARACTERISTICS
  - ITEM_DEFECTS_STAINS
  - ITEM_PRICING
  - ITEM_PHOTOS
  - ITEM_COMPLETED

#### 2.2. Розширення OrderEvent

- ✅ **OrderEvent.java вже містить необхідні події:**
  - START_ITEM_WIZARD
  - BASIC_INFO_COMPLETED
  - CHARACTERISTICS_COMPLETED
  - DEFECTS_COMPLETED
  - PRICING_COMPLETED
  - PHOTOS_COMPLETED
  - ITEM_ADDED
  - EDIT_ITEM
  - DELETE_ITEM
  - ITEMS_COMPLETED

#### 2.3. Конфігурація переходів

- [x] **OrderStateMachineConfig.java** ✅ ОНОВЛЕНО
  - Додано переходи для етапу 2 ✅
  - Інтеграція з Actions та Guards ✅
  - Правильні імпорти компонентів ✅

#### 2.4. State Machine Actions

- [x] **InitializeStage2Action.java** ✅ ГОТОВО

  - Ініціалізація етапу 2 через адаптер ✅
  - Обробка помилок ✅

- [x] **StartItemWizardAction.java** ✅ ГОТОВО

  - Розпізнавання режиму (новий/редагування) ✅
  - Запуск відповідного типу підвізарда ✅

- [x] **CompleteItemWizardAction.java** ✅ ГОТОВО

  - Завершення підвізарда через маппери ✅
  - Збереження предмета в замовлення ✅
  - Повернення до головного екрана ✅

- [x] **DeleteItemAction.java** ✅ ГОТОВО
  - Видалення предмета з замовлення ✅
  - Оновлення загальної суми ✅

#### 2.5. State Machine Guards

- [x] **CanCompleteStage2Guard.java** ✅ ГОТОВО

  - Перевірка наявності предметів ✅
  - Валідація відсутності активного підвізарда ✅
  - Використання готових бізнес-правил ✅

- [x] **CanStartItemWizardGuard.java** ✅ ГОТОВО

  - Перевірка можливості запуску підвізарда ✅

### Крок 3: Інтеграція з реальними даними

#### 3.1. Інтеграційні сервіси

- [x] **PricingIntegrationService.java** ✅ ГОТОВО

  - getServiceCategories() ✅
  - getCategoryByCode() ✅
  - getPriceListItemsByCode() ✅
  - getPriceListItemsById() ✅
  - calculateBasePrice() ✅
  - calculateFullPrice() ✅
  - getAvailableModifiersForCategory() ✅
  - getRecommendedModifiers() ✅
  - getRiskWarnings() ✅
  - getRecommendedUnitOfMeasure() ✅
  - isCategoryAvailable() ✅
  - isItemAvailable() ✅
  - **12 методів повністю реалізовано!** ✅

- [x] **ClientIntegrationService.java** ✅ ГОТОВО

  - getCurrentClient() ✅
  - isClientActive() ✅
  - canClientMakeOrders() ✅
  - getClientContactInfo() ✅

- [x] **BranchIntegrationService.java** ✅ ГОТОВО
  - getCurrentBranchLocation() ✅
  - getBranchLocationByCode() ✅
  - isBranchLocationActive() ✅
  - getActiveBranchLocations() ✅
  - getAllBranchLocations() ✅
  - doesBranchLocationProvideService() ✅
  - getBranchLocationInfo() ✅
  - isBranchLocationAvailable() ✅
  - getBranchLocationCode() ✅
  - **9 методів повністю реалізовано!** ✅

#### 3.2. Статус інтеграції з доменами

- [x] **Order Domain** ✅ ГОТОВО

  - OrderService.getOrderItems() ✅
  - OrderService.addOrderItem() ✅
  - OrderService.deleteOrderItem() ✅
  - OrderService.getOrderItem() ✅
  - **Використовується напряму (без додаткової інтеграції)**

- [x] **Pricing Domain** ✅ ГОТОВО

  - PriceListDomainService.getAllCategories() ✅
  - PriceListDomainService.getItemsByCategory() ✅
  - PriceListDomainService.getItemsByCategoryCode() ✅
  - PriceCalculationService.calculatePrice() ✅
  - PriceModifierCalculationService ✅
  - **Повна інтеграція через PricingIntegrationService**

- [x] **Client Domain** ✅ ГОТОВО

  - ClientService ✅ (через ClientIntegrationService)

- [x] **Branch Domain** ✅ ГОТОВО
  - BranchLocationService ✅ (через BranchIntegrationService)

---

## 🏷️ Підетап 2.1: Основна інформація про предмет

### Структура substep1/

```
substep1/
├── dto/
│   ├── BasicInfoDTO.java
│   ├── ServiceCategoryDTO.java
│   └── PriceListItemDTO.java
├── service/
│   ├── BasicInfoStepService.java
│   └── BasicInfoValidationService.java
├── mapper/
│   └── BasicInfoMapper.java
├── validator/
│   └── BasicInfoValidator.java
├── adapter/
│   └── BasicInfoStateMachineAdapter.java
├── actions/
│   └── SaveBasicInfoAction.java
└── guards/
    └── BasicInfoValidGuard.java
```

### Крок 1: DTO та моделі

```java
// substep1/dto/BasicInfoDTO.java
public class BasicInfoDTO {
    private String categoryId;
    private String categoryCode;
    private String categoryName;
    private String itemId;
    private String itemName;
    private Integer quantity;
    private String unitOfMeasure;
    private BigDecimal basePrice;
    private Boolean isValid;
    private List<String> validationErrors;
}
```

### Крок 2: Сервіс підетапу

```java
// substep1/service/BasicInfoStepService.java
public class BasicInfoStepService {

    private final ServiceCategoryRepository serviceCategoryRepository;
    private final PriceListItemRepository priceListItemRepository;
    private final UnitOfMeasureService unitOfMeasureService;

    // Методи:
    - List<ServiceCategoryDTO> getAvailableCategories()
    - List<PriceListItemDTO> getItemsByCategory(String categoryCode)
    - String getRecommendedUnitOfMeasure(String categoryCode, String itemName)
    - BigDecimal getBasePrice(String categoryCode, String itemName)
    - BasicInfoDTO validateBasicInfo(BasicInfoDTO dto)
    - BasicInfoDTO saveBasicInfo(String wizardId, BasicInfoDTO dto)
    - BasicInfoDTO loadBasicInfo(String wizardId)
}
```

### Крок 3: State Machine компоненти

```java
// substep1/actions/SaveBasicInfoAction.java
- зберігає BasicInfoDTO в контексті State Machine
- валідує дані
- встановлює прапор готовності до наступного кроку

// substep1/guards/BasicInfoValidGuard.java
- перевіряє наявність обов'язкових полів
- валідує існування категорії та предмета в БД
- перевіряє коректність кількості
```

### Крок 4: Інтеграція з Pricing Domain

```java
// Використання існуючих сервісів:
- PriceListDomainService.getAllCategories()
- PriceListDomainService.getItemsByCategory()
- PricingDomainService.determineUnitOfMeasure()
- PriceCalculationService.getBasePrice()
```

---

## 🧵 Підетап 2.2: Характеристики предмета

### Структура substep2/

```
substep2/
├── dto/
│   ├── CharacteristicsDTO.java
│   └── MaterialOptionDTO.java
├── service/
│   ├── CharacteristicsStepService.java
│   └── MaterialsService.java
├── mapper/
│   └── CharacteristicsMapper.java
├── validator/
│   └── CharacteristicsValidator.java
├── adapter/
│   └── CharacteristicsStateMachineAdapter.java
├── actions/
│   └── SaveCharacteristicsAction.java
├── guards/
│   └── CharacteristicsValidGuard.java
└── enums/
    ├── MaterialType.java
    ├── WearLevel.java
    └── FillingType.java
```

### Крок 1: DTO та енуми

```java
// substep2/dto/CharacteristicsDTO.java
public class CharacteristicsDTO {
    private MaterialType material;
    private String color;
    private FillingType filling;
    private Boolean isDamagedFilling;
    private WearLevel wearLevel;
    private String notes;
    private Boolean isValid;
    private List<String> validationErrors;
}

// substep2/enums/MaterialType.java
COTTON, WOOL, SILK, SYNTHETIC, SMOOTH_LEATHER, NUBUCK, SPLIT_LEATHER, SUEDE

// substep2/enums/WearLevel.java
LEVEL_10(10), LEVEL_30(30), LEVEL_50(50), LEVEL_75(75)

// substep2/enums/FillingType.java
DOWN, SYNTHETIC, OTHER
```

### Крок 2: Сервіс характеристик

```java
// substep2/service/CharacteristicsStepService.java
public class CharacteristicsStepService {

    // Методи:
    - List<MaterialType> getAvailableMaterials(String categoryCode)
    - List<String> getCommonColors()
    - List<FillingType> getAvailableFillings(String categoryCode)
    - CharacteristicsDTO validateCharacteristics(CharacteristicsDTO dto, String categoryCode)
    - CharacteristicsDTO saveCharacteristics(String wizardId, CharacteristicsDTO dto)
    - CharacteristicsDTO loadCharacteristics(String wizardId)
    - Boolean isMaterialCompatibleWithCategory(MaterialType material, String categoryCode)
}
```

### Крок 3: Валідація бізнес-правил

```java
// substep2/validator/CharacteristicsValidator.java
- валідація сумісності матеріалу з категорією
- перевірка коректності кольору
- валідація наповнювача для відповідних категорій
- перевірка логічності ступеня зносу
```

---

## 🔍 Підетап 2.3: Забруднення, дефекти та ризики

### Структура substep3/

```
substep3/
├── dto/
│   ├── DefectsStainsDTO.java
│   ├── StainSelectionDTO.java
│   └── DefectSelectionDTO.java
├── service/
│   ├── DefectsStainsStepService.java
│   ├── StainTypesService.java
│   └── DefectTypesService.java
├── mapper/
│   └── DefectsStainsMapper.java
├── validator/
│   └── DefectsStainsValidator.java
├── adapter/
│   └── DefectsStainsStateMachineAdapter.java
├── actions/
│   └── SaveDefectsStainsAction.java
└── guards/
    └── DefectsStainsValidGuard.java
```

### Крок 1: DTO для дефектів та плям

```java
// substep3/dto/DefectsStainsDTO.java
public class DefectsStainsDTO {
    private Set<String> selectedStains;
    private String customStain;
    private Set<String> selectedDefects;
    private Set<String> selectedRisks;
    private String defectNotes;
    private Boolean noWarranty;
    private String noWarrantyReason;
    private List<String> recommendedModifiers;
    private List<String> riskWarnings;
}
```

### Крок 2: Сервіс дефектів та плям

```java
// substep3/service/DefectsStainsStepService.java
public class DefectsStainsStepService {

    private final StainTypeRepository stainTypeRepository;
    private final DefectTypeRepository defectTypeRepository;
    private final PriceRecommendationService recommendationService;

    // Методи:
    - List<StainTypeDTO> getAvailableStains()
    - List<DefectTypeDTO> getAvailableDefects()
    - List<String> getRiskTypes()
    - List<String> getRecommendedModifiers(Set<String> stains, Set<String> defects, String categoryCode, String material)
    - List<String> getRiskWarnings(Set<String> stains, Set<String> defects, String categoryCode, String material)
    - DefectsStainsDTO saveDefectsStains(String wizardId, DefectsStainsDTO dto)
    - DefectsStainsDTO loadDefectsStains(String wizardId)
}
```

### Крок 3: Інтеграція з Pricing Domain

```java
// Використання існуючих сервісів:
- StainTypeService.getActiveStainTypes()
- DefectTypeService.getActiveDefectTypes()
- PriceRecommendationService.getRecommendedModifiersForItem()
- RiskAssessmentService.getRiskWarningsForItem()
```

---

## 💰 Підетап 2.4: Знижки та надбавки (калькулятор ціни)

### Структура substep4/

```
substep4/
├── dto/
│   ├── PricingCalculationDTO.java
│   ├── ModifierSelectionDTO.java
│   └── PriceBreakdownDTO.java
├── service/
│   ├── PricingStepService.java
│   ├── InteractivePriceCalculationService.java
│   └── ModifierRecommendationService.java
├── mapper/
│   └── PricingMapper.java
├── validator/
│   └── PricingValidator.java
├── adapter/
│   └── PricingStateMachineAdapter.java
├── actions/
│   ├── CalculatePricingAction.java
│   └── RecalculatePriceAction.java
└── guards/
    └── PricingValidGuard.java
```

### Крок 1: DTO для розрахунку ціни

```java
// substep4/dto/PricingCalculationDTO.java
public class PricingCalculationDTO {
    private BigDecimal basePrice;
    private List<ModifierSelectionDTO> selectedModifiers;
    private List<ModifierSelectionDTO> recommendedModifiers;
    private PriceBreakdownDTO priceBreakdown;
    private BigDecimal finalPrice;
    private Boolean isExpedited;
    private BigDecimal expediteFactor;
    private List<String> calculationSteps;
}

// substep4/dto/PriceBreakdownDTO.java
public class PriceBreakdownDTO {
    private BigDecimal basePrice;
    private List<ModifierImpactDTO> modifierImpacts;
    private BigDecimal subtotal;
    private BigDecimal expediteAmount;
    private BigDecimal finalAmount;
}
```

### Крок 2: Інтерактивний сервіс розрахунку

```java
// substep4/service/InteractivePriceCalculationService.java
public class InteractivePriceCalculationService {

    private final PriceCalculationService priceCalculationService;
    private final CatalogPriceModifierRepository modifierRepository;

    // Методи:
    - PricingCalculationDTO calculateInitialPrice(BasicInfoDTO basicInfo, CharacteristicsDTO characteristics)
    - PricingCalculationDTO recalculateWithModifiers(PricingCalculationDTO current, List<ModifierSelectionDTO> modifiers)
    - List<ModifierSelectionDTO> getAvailableModifiers(String categoryCode)
    - List<ModifierSelectionDTO> getRecommendedModifiers(DefectsStainsDTO defectsStains, String categoryCode, String material)
    - Boolean validateModifierSelection(List<ModifierSelectionDTO> modifiers, String categoryCode)
    - PriceBreakdownDTO generateDetailedBreakdown(PricingCalculationDTO calculation)
}
```

### Крок 3: Real-time розрахунки

```java
// substep4/service/PricingStepService.java
- реалізація інтерактивного калькулятора
- збереження/завантаження розрахунків
- валідація розумності модифікаторів
- інтеграція з існуючим PriceCalculationService
```

### Крок 4: Інтеграція з Pricing Domain

```java
// Використання існуючих сервісів:
- PriceCalculationService.calculatePrice()
- PriceModifierCalculationService.calculatePrice()
- CatalogPriceModifierService.getModifiersForCategory()
- PricingDomainService.isDiscountReasonable()
```

---

## 📸 Підетап 2.5: Фотодокументація

### Структура substep5/

```
substep5/
├── dto/
│   ├── PhotoDocumentationDTO.java
│   ├── PhotoUploadDTO.java
│   └── PhotoMetadataDTO.java
├── service/
│   ├── PhotosStepService.java
│   ├── PhotoStorageService.java
│   └── PhotoCompressionService.java
├── mapper/
│   └── PhotosMapper.java
├── validator/
│   └── PhotosValidator.java
├── adapter/
│   └── PhotosStateMachineAdapter.java
├── actions/
│   ├── SavePhotosAction.java
│   └── SkipPhotosAction.java
└── guards/
    └── PhotosValidGuard.java
```

### Крок 1: DTO для фото

```java
// substep5/dto/PhotoDocumentationDTO.java
public class PhotoDocumentationDTO {
    private List<PhotoMetadataDTO> photos;
    private Boolean photosSkipped;
    private String skipReason;
    private Integer maxPhotos = 5;
    private Long maxFileSize = 5 * 1024 * 1024L; // 5MB
}

// substep5/dto/PhotoMetadataDTO.java
public class PhotoMetadataDTO {
    private String photoId;
    private String fileName;
    private String contentType;
    private Long fileSize;
    private String thumbnailUrl;
    private String fullSizeUrl;
    private LocalDateTime uploadedAt;
}
```

### Крок 2: Сервіс фотодокументації

```java
// substep5/service/PhotosStepService.java
public class PhotosStepService {

    private final PhotoStorageService storageService;
    private final PhotoCompressionService compressionService;

    // Методи:
    - PhotoDocumentationDTO uploadPhoto(String wizardId, MultipartFile file)
    - PhotoDocumentationDTO deletePhoto(String wizardId, String photoId)
    - PhotoDocumentationDTO loadPhotos(String wizardId)
    - PhotoDocumentationDTO skipPhotos(String wizardId, String reason)
    - Boolean validatePhotoLimits(String wizardId, MultipartFile file)
    - String generateThumbnail(String photoId)
}
```

### Крок 3: Технічна реалізація

```java
// substep5/service/PhotoStorageService.java
- збереження файлів на диск або cloud storage
- генерування унікальних імен файлів
- управління шляхами до файлів

// substep5/service/PhotoCompressionService.java
- автоматичне стиснення зображень
- створення мініатюр
- оптимізація розмірів файлів
```

---

## 🔄 Координація та завершення підвізарда

### Крок 1: Злиття даних предмета ✅ ГОТОВО ЧЕРЕЗ МАППЕРИ

- [x] **ItemWizardDataMapper.java** ✅ ГОТОВО

  - Збирає OrderItemDTO з усіх підетапів
  - 14 методів витягування даних
  - Обробка помилок та fallback значення

- [x] **ItemEditDataMapper.java** ✅ ГОТОВО
  - Розбирає OrderItemDTO на підетапи
  - Заповнює всі 5 підетапів
  - Валідація даних для редагування

### Крок 2: Управління циклічністю ✅ ГОТОВО

- [x] **ItemWizardManagementService.java** ✅ ГОТОВО
  - Використовує маппери замість заглушок ✅
  - Повний цикл створення/редагування/збірки ✅
  - Валідація та діагностика ✅

### Крок 3: Валідація завершення етапу ✅ ГОТОВО

- [x] **Stage2CoordinationService** ✅ ГОТОВО
  - canCompleteStage2() ✅
  - hasMinimumItems() ✅
  - areAllItemsValid() ✅

---

## 🎯 Загальна інтеграція з State Machine ✅ ГОТОВО

### Крок 1: Конфігурація переходів ✅ ГОТОВО

- [x] **OrderStateMachineConfig.java** ✅ ГОТОВО
  - Всі переходи етапу 2 налаштовані ✅
  - Actions та Guards інтегровані ✅

### Крок 2: Actions для State Machine ✅ ГОТОВО

- [x] **InitializeStage2Action.java** ✅
- [x] **StartItemWizardAction.java** ✅
- [x] **CompleteItemWizardAction.java** ✅
- [x] **DeleteItemAction.java** ✅

### Крок 3: Guards для State Machine ✅ ГОТОВО

- [x] **CanStartItemWizardGuard.java** ✅
- [x] **CanCompleteStage2Guard.java** ✅

---

## 📊 Послідовність реалізації (рекомендований порядок)

### Фаза 1: Основа (тиждень 1) ✅ ГОТОВО

1. ✅ Створити enum'и та базові DTO
2. ✅ Налаштувати State Machine стани та події
3. ✅ Створити базові адаптери та координаційні сервіси
4. ✅ Реалізувати інтеграційні сервіси
5. ✅ **СТВОРИТИ ТА ІНТЕГРУВАТИ МАППЕРИ** ✅

### Фаза 2: Підетап 2.1 (тиждень 2)

1. Реалізувати BasicInfoStepService
2. Інтегрувати з Pricing Domain
3. Створити State Machine компоненти
4. Покрити тестами

### Фаза 3: Підетап 2.2 (тиждень 3)

1. Реалізувати CharacteristicsStepService
2. Створити валідацію матеріалів
3. Інтегрувати з State Machine
4. Покрити тестами

### Фаза 4: Підетап 2.3 (тиждень 4)

1. Реалізувати DefectsStainsStepService
2. Інтегрувати з рекомендаційною системою
3. Створити State Machine компоненти
4. Покрити тестами

### Фаза 5: Підетап 2.4 (тиждень 5-6)

1. Реалізувати інтерактивний калькулятор
2. Інтегрувати з PriceCalculationService
3. Створити real-time розрахунки
4. Покрити тестами

### Фаза 6: Підетап 2.5 (тиждень 7)

1. Реалізувати PhotosStepService
2. Створити систему стиснення зображень
3. Налаштувати файлове сховище
4. Покрити тестами

### Фаза 7: Інтеграція та тестування (тиждень 8)

1. ✅ Реалізувати ItemDataMergeService (через маппери)
2. ✅ Налаштувати циклічність підвізарда
3. Інтеграційне тестування
4. Оптимізація продуктивності

---

## 🧪 Тестування

### Unit тести для кожного підетапу

```java
// Приклад для substep1:
BasicInfoStepServiceTest
BasicInfoValidatorTest
BasicInfoMapperTest
BasicInfoStateMachineAdapterTest
```

### Тести для мапперів ✅ ПОТРІБНО ДОДАТИ

```java
ItemWizardDataMapperTest
ItemEditDataMapperTest
ItemWizardManagementServiceTest
```

### Інтеграційні тести

```java
Stage2IntegrationTest
ItemWizardCycleTest
PricingIntegrationTest
StateTransitionTest
```

### End-to-End тести

```java
CompleteItemWizardFlowTest
MultipleItemsScenarioTest
EditItemScenarioTest
```

---

## 🚀 Критерії готовності

### Для кожного підетапу:

- [x] DTO створені та протестовані ✅ (базові готові)
- [x] Сервіс реалізований з усіма методами ✅ (базова функціональність)
- [x] State Machine компоненти налаштовані ✅ (основні готові)
- [x] Інтеграція з реальними даними працює ✅ (Order + Pricing + Client + Branch)
- [x] **Маппери створені та інтегровані** ✅ ГОТОВО
- [ ] Валідація покриває всі випадки 🔄 (базова готова)
- [ ] Unit тести покривають 80%+ коду
- [ ] Інтеграційні тести проходять

### Для етапу 2 загалом:

- [x] Циклічність підвізарда працює ✅ (сервіси готові)
- [x] Можна додавати/редагувати/видаляти предмети ✅ (логіка готова)
- [x] **Збірка предметів працює через маппери** ✅ НЕ ЗАГЛУШКИ!
- [x] **Редагування предметів працює через маппери** ✅ НЕ ЗАГЛУШКИ!
- [ ] Розрахунки ціни відбуваються в real-time 🔄 (потрібен pricing calculator)
- [x] Інтеграція з усіма доменами функціонує ✅ (Order/Pricing/Client/Branch готово)
- [x] State Machine переходи стабільні ✅ (готово)
- [ ] Продуктивність оптимізована
- [ ] Готово для інтеграції з Frontend

## 🎯 Наступні кроки

### Пріоритет 1: Підетапи Item Wizard

1. **Підетап 2.1: Основна інформація** (BASIC_INFO)
2. **Підетап 2.4: Розрахунок ціни** (PRICING) - найважливіший
3. **Підетап 2.2, 2.3, 2.5** - інші кроки

### Пріоритет 2: Тестування мапперів

1. **Unit тести** для ItemWizardDataMapper
2. **Unit тести** для ItemEditDataMapper
3. **Інтеграційні тести** для повного циклу підвізарда

### Пріоритет 3: Тестування та оптимізація

1. **Unit тести** для всіх компонентів
2. **Інтеграційні тести** для State Machine
3. **Оптимізація продуктивності**

## 📋 Важливі зауваження щодо мапперів

### ✅ ЩО ВИРІШИЛИ МАППЕРИ:

1. **Заглушки замінені реальною логікою**:

   - `buildCompleteItem()` - тепер повноцінно збирає OrderItemDTO
   - `populateSessionFromExistingItem()` - повноцінно розбирає на підетапи

2. **Правильне розділення відповідальностей**:

   - `ItemWizardDataMapper` - збірка (MapStruct)
   - `ItemEditDataMapper` - розбір (Spring Component)

3. **Обробка помилок та fallback значення**:

   - Безпечне витягування даних з Map<String, Object>
   - Fallback на розумні значення за замовчуванням

4. **Типобезпечність**:
   - Правильне приведення типів
   - Валідація наявності даних

### ❌ ЩО НЕ ЗМІШАЛИ:

1. **Бізнес-логіка залишилась в доменах**
2. **Маппери тільки трансформують дані**
3. **Валідація залишилась в окремих компонентах**
4. **Координаційні сервіси залишились тонкими**

Цей план забезпечує поступову, системну реалізацію найскладнішого етапу Order Wizard з дотриманням всіх архітектурних принципів та інтеграцією з реальними даними!

**КРИТИЧНО ВАЖЛИВО**: Маппери вирішили головну проблему - тепер ItemWizardManagementService працює з реальними даними, а не заглушками!
