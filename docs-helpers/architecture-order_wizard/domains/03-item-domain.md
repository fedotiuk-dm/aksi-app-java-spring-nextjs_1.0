# Item Domain - Управління предметами та послугами

## Огляд домену

Item Domain відповідає за управління каталогом предметів, категорій послуг, прайс-листом, характеристиками предметів та складною системою розрахунку цін з модифікаторами.

## Бізнес-логіка

### Функціональність

- **Каталог категорій послуг** - ієрархічна структура послуг хімчистки
- **Прайс-лист предметів** - базові ціни з урахуванням категорій
- **Характеристики предметів** - матеріал, колір, наповнювач, ступінь зносу
- **Система модифікаторів** - складні правила розрахунку надбавок та знижок
- **Забруднення та дефекти** - каталог типових проблем
- **Фотодокументація** - управління зображеннями предметів

### Бізнес-правила категорій

1. **Чистка одягу та текстилю** - основна категорія
2. **Прання білизни** - оплата за кілограми
3. **Прасування** - фіксовані ціни за предмет
4. **Чистка шкіряних виробів** - спеціальні терміни (14 днів)
5. **Дублянки** - окрема категорія з особливими правилами
6. **Натуральне хутро** - найскладніша обробка
7. **Фарбування** - додаткова послуга з модифікаторами

## Доменна модель

### Entities

#### ServiceCategory

```java
@Entity
public class ServiceCategory {
    private Long id;
    private String code;            // Унікальний код
    private String name;            // Назва категорії
    private String description;     // Опис
    private Long parentId;          // Батьківська категорія
    private int standardDays;       // Стандартний термін виконання
    private boolean isActive;       // Активна категорія
    private List<PriceListItem> priceListItems;
    private List<String> availableMaterials;
    private List<String> availableModifiers;
}
```

#### PriceListItem

```java
@Entity
public class PriceListItem {
    private Long id;
    private Long categoryId;
    private int itemNumber;         // Номер в каталозі
    private String name;            // Назва предмета
    private String unit;            // Одиниця виміру (шт/кг)
    private BigDecimal basePrice;   // Базова ціна
    private BigDecimal blackPrice;  // Ціна для чорних речей
    private BigDecimal lightPrice;  // Ціна для світлих речей
    private boolean isActive;
    private String notes;           // Примітки
}
```

#### ItemCharacteristics

```java
@Entity
public class ItemCharacteristics {
    private Long id;
    private Long orderItemId;       // Посилання на предмет в замовленні
    private String material;        // Матеріал
    private String color;           // Колір
    private String filling;         // Наповнювач
    private Integer wearDegree;     // Ступінь зносу %
    private List<String> stains;    // Список плям
    private List<String> defects;   // Список дефектів
    private String defectNotes;     // Примітки до дефектів
    private boolean hasRisks;       // Наявність ризиків
    private String riskDescription; // Опис ризиків
}
```

#### PriceModifier

```java
@Entity
public class PriceModifier {
    private Long id;
    private String code;            // Унікальний код модифікатора
    private String name;            // Назва модифікатора
    private ModifierType type;      // Тип модифікатора
    private BigDecimal value;       // Значення (%, грн, коефіцієнт)
    private String applicableTo;    // До яких категорій застосовується
    private boolean isActive;
    private String description;
}
```

### Value Objects

#### StainInfo

```java
@Embeddable
public class StainInfo {
    private StainType type;
    private String location;        // Місце розташування
    private String intensity;       // Інтенсивність (легка/середня/сильна)
    private String notes;          // Додаткові примітки
}
```

#### DefectInfo

```java
@Embeddable
public class DefectInfo {
    private DefectType type;
    private String location;
    private String severity;        // Ступінь пошкодження
    private boolean affectsPrice;   // Впливає на ціну
    private String notes;
}
```

### Enums

#### StainType

```java
public enum StainType {
    FAT("Жир"),
    BLOOD("Кров"),
    PROTEIN("Білок"),
    WINE("Вино"),
    COFFEE("Кава"),
    GRASS("Трава"),
    INK("Чорнило"),
    COSMETICS("Косметика"),
    OTHER("Інше");
}
```

#### DefectType

```java
public enum DefectType {
    WORN("Потертості"),
    TORN("Порване"),
    MISSING_HARDWARE("Відсутність фурнітури"),
    DAMAGED_HARDWARE("Пошкодження фурнітури"),
    COLOR_CHANGE_RISK("Ризики зміни кольору"),
    DEFORMATION_RISK("Ризики деформації"),
    NO_GUARANTEE("Без гарантій");
}
```

#### ModifierType

```java
public enum ModifierType {
    PERCENTAGE("Відсоток"),           // +20%
    FIXED_AMOUNT("Фіксована сума"),   // +50 грн
    MULTIPLIER("Множник"),            // x1.5
    REPLACEMENT("Заміна ціни");       // Повна заміна базової ціни
}
```

#### MaterialType

```java
public enum MaterialType {
    // Текстильні матеріали
    COTTON("Бавовна"),
    WOOL("Шерсть"),
    SILK("Шовк"),
    SYNTHETIC("Синтетика"),
    COMBINED("Комбінований"),

    // Шкіряні матеріали
    SMOOTH_LEATHER("Гладка шкіра"),
    NUBUCK("Нубук"),
    SPLIT_LEATHER("Спілок"),
    SUEDE("Замша"),
    NATURAL_FUR("Натуральне хутро");
}
```

## Сервіси

### ItemCatalogService

```java
@Service
public class ItemCatalogService {

    // Каталог категорій
    List<ServiceCategory> getAllCategories();
    List<ServiceCategory> getActiveCategories();
    ServiceCategory getCategoryById(Long id);
    List<ServiceCategory> getCategoriesByParent(Long parentId);

    // Прайс-лист
    List<PriceListItem> getItemsByCategory(Long categoryId);
    PriceListItem getPriceListItem(Long categoryId, String itemName);
    BigDecimal getBasePrice(Long categoryId, String itemName, String color);

    // Матеріали та характеристики
    List<String> getAvailableMaterials(Long categoryId);
    List<String> getAvailableModifiers(Long categoryId);
    int getStandardExecutionDays(Long categoryId);
}
```

### PriceCalculationService

```java
@Service
public class PriceCalculationService {

    // Основний розрахунок
    BigDecimal calculateItemPrice(ItemPriceRequest request);
    PriceCalculationResult calculateDetailedPrice(ItemPriceRequest request);

    // Модифікатори
    BigDecimal applyModifiers(BigDecimal basePrice, List<String> modifierCodes);
    List<AppliedModifier> getApplicableModifiers(Long categoryId, ItemCharacteristics characteristics);

    // Спеціальні розрахунки
    BigDecimal calculateTextilePrice(TextileItemRequest request);
    BigDecimal calculateLeatherPrice(LeatherItemRequest request);
    BigDecimal calculateFurPrice(FurItemRequest request);

    // Валідація
    boolean validateModifierCombination(List<String> modifierCodes);
    List<String> getIncompatibleModifiers(String modifierCode);
}
```

### ItemCharacteristicsService

```java
@Service
public class ItemCharacteristicsService {

    // Характеристики
    ItemCharacteristics createCharacteristics(CreateCharacteristicsRequest request);
    ItemCharacteristics updateCharacteristics(Long id, UpdateCharacteristicsRequest request);

    // Плями та дефекти
    List<StainInfo> analyzeStains(List<String> stainTypes);
    List<DefectInfo> analyzeDefects(List<String> defectTypes);
    RiskAssessment assessRisks(ItemCharacteristics characteristics);

    // Рекомендації
    List<String> getRecommendedModifiers(ItemCharacteristics characteristics);
    List<String> getWarnings(ItemCharacteristics characteristics);
}
```

## Модифікатори цін (реальні бізнес-правила)

### Загальні модифікатори

```java
public class GeneralModifiers {
    public static final String CHILDREN_ITEMS = "CHILDREN_30";      // -30% (до 30 розміру)
    public static final String MANUAL_CLEANING = "MANUAL_PLUS_20";  // +20%
    public static final String VERY_DIRTY = "DIRTY_20_100";        // +20-100%
    public static final String URGENT_CLEANING = "URGENT_50_100";   // +50-100%
}
```

### Модифікатори для текстилю

```java
public class TextileModifiers {
    public static final String FUR_TRIM = "FUR_TRIM_PLUS_30";           // +30%
    public static final String WATER_REPELLENT = "WATER_REP_PLUS_30";   // +30%
    public static final String SILK_PROCESSING = "SILK_PLUS_50";        // +50%
    public static final String COMBINED_MATERIALS = "COMBINED_PLUS_100"; // +100%
    public static final String LARGE_TOYS = "TOYS_PLUS_100";            // +100%
    public static final String BUTTON_SEWING = "BUTTON_FIXED";          // Фіксована ціна
    public static final String COLOR_PROCESSING = "COLOR_PLUS_20";       // +20%
    public static final String WEDDING_DRESS = "WEDDING_PLUS_30";       // +30%
}
```

### Модифікатори для шкіри

```java
public class LeatherModifiers {
    public static final String LEATHER_IRONING = "IRON_70_PERCENT";     // 70% від вартості
    public static final String WATER_REPELLENT = "WATER_REP_PLUS_30";   // +30%
    public static final String DYEING_AFTER_OUR = "DYE_AFTER_PLUS_50";  // +50%
    public static final String DYEING_AFTER_OTHER = "DYE_OTHER_100";    // +100%
    public static final String LEATHER_INSERTS = "INSERTS_PLUS_30";     // +30%
    public static final String PEARL_COATING = "PEARL_PLUS_30";         // +30%
    public static final String ARTIFICIAL_FUR = "ART_FUR_MINUS_20";     // -20%
    public static final String MANUAL_LEATHER = "MANUAL_PLUS_30";       // +30%
}
```

## Repositories

### ServiceCategoryRepository

```java
@Repository
public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, Long> {

    List<ServiceCategory> findByIsActiveTrue();
    List<ServiceCategory> findByParentId(Long parentId);
    Optional<ServiceCategory> findByCode(String code);

    @Query("SELECT sc FROM ServiceCategory sc WHERE sc.parentId IS NULL")
    List<ServiceCategory> findRootCategories();
}
```

### PriceListItemRepository

```java
@Repository
public interface PriceListItemRepository extends JpaRepository<PriceListItem, Long> {

    List<PriceListItem> findByCategoryIdAndIsActiveTrue(Long categoryId);
    Optional<PriceListItem> findByCategoryIdAndName(Long categoryId, String name);

    @Query("SELECT pli FROM PriceListItem pli WHERE pli.categoryId = :categoryId " +
           "AND LOWER(pli.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<PriceListItem> findByCategoryAndNameContaining(@Param("categoryId") Long categoryId,
                                                       @Param("name") String name);
}
```

### PriceModifierRepository

```java
@Repository
public interface PriceModifierRepository extends JpaRepository<PriceModifier, Long> {

    List<PriceModifier> findByIsActiveTrue();
    Optional<PriceModifier> findByCode(String code);
    List<PriceModifier> findByApplicableToContaining(String categoryCode);

    @Query("SELECT pm FROM PriceModifier pm WHERE pm.code IN :codes")
    List<PriceModifier> findByCodes(@Param("codes") List<String> codes);
}
```

## DTOs

### Request DTOs

#### ItemPriceRequest

```java
public class ItemPriceRequest {
    @NotNull
    private Long categoryId;

    @NotBlank
    private String itemName;

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
    private List<String> modifierCodes;
}
```

#### CreateCharacteristicsRequest

```java
public class CreateCharacteristicsRequest {
    @NotNull
    private Long orderItemId;

    private String material;
    private String color;
    private String filling;
    private Integer wearDegree;
    private List<StainInfo> stains;
    private List<DefectInfo> defects;
    private String defectNotes;
    private boolean hasRisks;
    private String riskDescription;
}
```

### Response DTOs

#### ServiceCategoryResponse

```java
public class ServiceCategoryResponse {
    private Long id;
    private String code;
    private String name;
    private String description;
    private Long parentId;
    private int standardDays;
    private boolean isActive;
    private List<ServiceCategoryResponse> children;
    private List<String> availableMaterials;
    private List<PriceModifierResponse> availableModifiers;
}
```

#### PriceCalculationResult

```java
public class PriceCalculationResult {
    private BigDecimal basePrice;
    private List<AppliedModifier> appliedModifiers;
    private BigDecimal subtotal;
    private BigDecimal finalPrice;
    private List<String> warnings;
    private List<String> recommendations;
    private String calculationFormula;
}
```

#### AppliedModifier

```java
public class AppliedModifier {
    private String code;
    private String name;
    private ModifierType type;
    private BigDecimal value;
    private BigDecimal appliedAmount;
    private String description;
}
```

## API Endpoints

### Каталог категорій

- `GET /api/categories` - Всі категорії
- `GET /api/categories/active` - Активні категорії
- `GET /api/categories/{id}` - Категорія за ID
- `GET /api/categories/{id}/children` - Дочірні категорії

### Прайс-лист

- `GET /api/categories/{id}/items` - Предмети категорії
- `GET /api/items/search?category={id}&name={name}` - Пошук предметів
- `GET /api/items/{categoryId}/{itemName}/price` - Базова ціна

### Характеристики та модифікатори

- `GET /api/categories/{id}/materials` - Доступні матеріали
- `GET /api/categories/{id}/modifiers` - Доступні модифікатори
- `POST /api/items/price-calculation` - Розрахунок ціни
- `POST /api/items/characteristics` - Створення характеристик

### Довідники

- `GET /api/stains` - Типи плям
- `GET /api/defects` - Типи дефектів
- `GET /api/modifiers` - Всі модифікатори
- `GET /api/modifiers/{code}` - Модифікатор за кодом

## Валідація

### Бізнес-валідація

1. **Сумісність модифікаторів**: Перевірка конфліктних модифікаторів
2. **Застосовність до категорії**: Модифікатор повинен підходити до категорії
3. **Логічність характеристик**: Матеріал повинен відповідати категорії
4. **Ціновий діапазон**: Перевірка розумності фінальної ціни

### Технічна валідація

- Bean Validation для DTOs
- Кастомні валідатори для модифікаторів
- Валідація відсотків та сум

## Інтеграція з іншими доменами

### Order Domain

- Розрахунок цін для предметів замовлення
- Валідація характеристик предметів

### Branch Domain

- Різні прайси для різних філій (за потреби)
- Доступність категорій послуг

## Тестування

### Unit Tests

- PriceCalculationService логіка розрахунків
- Валідація модифікаторів
- Математичні операції з цінами

### Integration Tests

- API endpoints
- Складні сценарії розрахунків
- Інтеграція з базою даних

## Технічні деталі

### Індекси БД

```sql
CREATE INDEX idx_category_code ON service_categories(code);
CREATE INDEX idx_category_parent ON service_categories(parent_id);
CREATE INDEX idx_price_list_category ON price_list_items(category_id);
CREATE INDEX idx_price_list_name ON price_list_items(name);
CREATE INDEX idx_modifier_code ON price_modifiers(code);
CREATE INDEX idx_modifier_applicable ON price_modifiers(applicable_to);
```

### Кешування

- Кешування каталогу категорій
- Кешування прайс-листа
- Кешування модифікаторів

### Аудит

- Логування змін цін
- Історія розрахунків
- Відстеження використання модифікаторів
