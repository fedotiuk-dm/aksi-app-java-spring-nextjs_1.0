# Архітектурне рішення для Item домену

## 🎯 Огляд

Item домен відповідає за управління прайс-листом послуг хімчистки, включаючи категорії послуг, предмети з цінами, модифікатори цін та розрахунки вартості. Домен побудований на основі DDD принципів з чітким розділенням відповідальності.

## ⚠️ Поточний стан та проблеми

**ВАЖЛИВО:** На даний момент item домен реалізований лише частково:
- ✅ Реалізовані: entities, repositories, mappers
- ❌ Відсутні: всі сервіси, контролери, валідація, exception handling, міграції БД
- ❌ Неповна OpenAPI специфікація (відсутні схеми запитів)
- ❌ Немає інтеграції з shared компонентами

## 📋 Структура Item домену

```
domain/item/
├── entity/
│   ├── ServiceCategoryEntity.java      # Категорії послуг (хімчистка, прання, прасування)
│   ├── PriceListItemEntity.java        # Предмети прайс-листу з базовими цінами
│   ├── PriceModifierEntity.java        # Модифікатори цін (знижки, надбавки)
│   ├── ItemPhotoEntity.java            # Фотографії предметів замовлення
│   └── embeddable/
│       └── PriceDetails.java           # Вбудований об'єкт для цін (base/black/color)
├── enums/                              # Переліки домену
│   ├── ServiceCategoryCode.java        # Enum кодів категорій (CLOTHING, LAUNDRY, IRONING...)
│   ├── UnitOfMeasure.java              # Enum одиниць виміру (PIECE, KILOGRAM, PAIR...)
│   ├── ModifierType.java               # Enum типів модифікаторів (PERCENTAGE, FIXED_AMOUNT)
│   └── ItemColor.java                  # Enum кольорів (для UI та розрахунків)
├── repository/
│   ├── ServiceCategoryRepository.java
│   ├── PriceListItemRepository.java
│   ├── PriceModifierRepository.java
│   └── ItemPhotoRepository.java
├── service/
│   ├── ServiceCategoryService.java     # Робота з категоріями послуг
│   ├── PriceListItemService.java       # Управління прайс-листом
│   ├── PriceModifierService.java       # Управління модифікаторами
│   ├── ItemPhotoService.java           # Робота з фотографіями
│   ├── ItemCalculationService.java     # Головний сервіс розрахунків
│   └── calculation/
│       ├── PriceCalculator.java        # Основна логіка розрахунку цін
│       ├── ModifierApplicator.java     # Застосування модифікаторів
│       └── JexlCalculator.java         # Обчислення JEXL формул
├── api/item/                           # Контролери
│   ├── ServiceCategoriesController.java # Імплементує ServiceCategoriesApi
│   ├── PriceListController.java         # Імплементує PriceListApi
│   ├── PriceModifiersController.java    # Імплементує PriceModifiersApi
│   ├── ItemCalculationController.java   # API для розрахунків
│   └── ItemPhotoController.java         # API для фотографій
├── mapper/
│   ├── ServiceCategoryMapper.java
│   ├── PriceListItemMapper.java
│   ├── PriceModifierMapper.java
│   └── ItemPhotoMapper.java
├── exception/
│   ├── PriceListItemNotFoundException.java
│   ├── ServiceCategoryNotFoundException.java
│   ├── InvalidCalculationException.java
│   ├── PhotoUploadException.java
│   └── ItemExceptionHandler.java
├── util/
│   ├── ItemConstants.java              # Константи домену
│   └── PriceCalculationUtils.java      # Утиліти для розрахунків
├── validation/
│   ├── PriceValidator.java             # Валідація цін та модифікаторів
│   └── PhotoValidator.java             # Валідація фотографій
└── config/
    └── ItemDomainConfig.java          # Конфігурація домену (cache, JEXL engine)
```

## 🗄️ Сутності (Entities)

### 1. ServiceCategoryEntity
**Призначення:** Зберігає категорії послуг хімчистки

**Ключові поля:**
- `code` (String) - унікальний код категорії (CLOTHING, LAUNDRY, IRONING та ін.)
- `name` - назва категорії українською
- `standardDays` - стандартний термін виконання (за замовчуванням з конфігурації)
- `displayOrder` - порядок відображення в UI
- `active` - чи активна категорія

**Зв'язки:**
- @OneToMany з PriceListItemEntity (mappedBy = "category")

**Особливості:**
- Код категорії зберігається як String (не enum) для гнучкості
- ServiceCategoryCode enum використовується тільки для валідації та типобезпеки в коді
- Категорії завантажуються з міграцій Liquibase
- Кешується в @Cacheable("serviceCategories")

### 2. PriceListItemEntity
**Призначення:** Містить прайс-лист всіх послуг хімчистки

**Ключові поля:**
- `category` - @ManyToOne зв'язок з ServiceCategoryEntity
- `catalogNumber` - номер в каталозі (унікальний в межах категорії)
- `name` - назва послуги українською
- `unitOfMeasure` - одиниця виміру (UnitOfMeasure enum)
- `priceDetails` - @Embedded об'єкт з цінами
- `active` - чи активна послуга

**Успадкування:**
- Extends BaseEntity (id, createdAt, updatedAt, createdBy, updatedBy)

**Особливості:**
- @Table(uniqueConstraints = @UniqueConstraint(columnNames = {"category_code", "catalog_number"}))
- @Index(name = "idx_category_active", columnList = "category_code, active")
- Дані завантажуються з CSV через Liquibase loadData
- unitOfMeasure трансформується при завантаженні: "шт" → "PIECE", "кг" → "KILOGRAM"

### 3. PriceDetails (Embeddable)
**Призначення:** Зберігає ціни для різних типів виробів

**Ключові поля:**
- `basePrice` - базова ціна (обов'язкова)
- `priceBlack` - ціна для чорних виробів (опційна)
- `priceColor` - ціна для кольорових виробів (опційна)

**Особливості:**
- @Embeddable клас, вбудовується в PriceListItemEntity
- Метод getPriceForColor(ItemColor color) визначає ціну за кольором
- Якщо priceBlack/priceColor null, повертається basePrice
- Всі ціни зберігаються як BigDecimal для точності

### 4. PriceModifierEntity
**Призначення:** Модифікатори для розрахунку кінцевої ціни

**Ключові поля:**
- `code` - унікальний код модифікатора (String, unique)
- `name` - назва модифікатора українською
- `type` - ModifierType enum (PERCENTAGE/FIXED_AMOUNT)
- `value` - BigDecimal значення модифікатора
- `applicableCategories` - @ElementCollection список кодів категорій (String)
- `jexlFormula` - @Column(length = 1000) JEXL формула для складних розрахунків
- `priority` - Integer порядок застосування (default = 0)
- `active` - Boolean чи активний модифікатор

**Успадкування:**
- Extends BaseEntity

**Особливості:**
- Гнучка система застосування до різних категорій
- Підтримка динамічних формул через JEXL
- Пріоритезація для правильного порядку застосування

### 5. ItemPhotoEntity
**Призначення:** Зберігає фотографії предметів замовлення

**Ключові поля:**
- `orderItemId` - UUID предмета замовлення (не FK, для loose coupling)
- `fileName` - оригінальне ім'я файлу
- `fileType` - MIME тип (image/jpeg, image/png)
- `fileSize` - Long розмір в байтах
- `storagePath` - повний шлях до файлу
- `thumbnailPath` - шлях до мініатюри (опційно)
- `uploadedBy` - UUID користувача який завантажив
- `description` - опис фото (опційно)

**Успадкування:**
- Extends BaseEntity

**Особливості:**
- Індекс по orderItemId для швидкого пошуку
- Підтримка мініатюр для оптимізації

## 💾 Міграції Liquibase

**Структура міграцій:**
```
db/changelog/item/
├── 001-create-service-categories-table.yaml
├── 002-create-price-list-items-table.yaml
├── 003-create-price-modifiers-table.yaml
├── 004-create-item-photos-table.yaml
├── 005-load-initial-categories.yaml
├── 006-load-initial-price-list.yaml      # Завантаження з CSV
└── 007-load-initial-modifiers.yaml
```

**Категорії з CSV:**
- CLOTHING - Чистка одягу та текстилю
- LAUNDRY - Прання білизни
- IRONING - Прасування
- LEATHER - Чистка та відновлення шкіряних виробів
- PADDING - Дублянки
- FUR - Вироби із натурального хутра
- DYEING - Фарбування текстильних виробів (має price_black та price_color)
- ADDITIONAL_SERVICES - Додаткові послуги

**Особливості завантаження даних:**
- CSV файл: `/scripts/price_list/price_list.csv`
- Liquibase loadData трансформує дані:
  - unit_of_measure: "шт" → "PIECE", "кг" → "KILOGRAM", "пара" → "PAIR", "кв.м" → "SQUARE_METER"
  - active: "true"/"false" → boolean
  - Порожні price_black/price_color → NULL
- Автоматична генерація UUID для id полів
- Використання columnMapping для відповідності CSV колонок до БД

## 🔧 Сервіси

### 1. ServiceCategoryService
**Відповідальність:** Управління категоріями послуг

**Основні методи:**
```java
public List<ServiceCategoryResponse> getAllCategories(Boolean active);
public ServiceCategoryEntity getCategoryByCode(String code);
public Map<String, Integer> getCategoryStandardDays();
```

**Особливості:**
- @Cacheable("serviceCategories") для getAllCategories
- Використання ServiceCategoryMapper для DTO конвертації
- Інтеграція з ValidationService зі shared

### 2. PriceListItemService
**Відповідальність:** Робота з прайс-листом

**Основні методи:**
```java
public PriceListResponse getPriceList(String categoryCode, String search, Boolean active);
public PriceListItemEntity getItemByCategoryAndNumber(String categoryCode, Integer catalogNumber);
public BigDecimal getItemPrice(UUID itemId, ItemColor color);
```

**Особливості:**
- Пошук через JPQL: `LOWER(name) LIKE LOWER(CONCAT('%', :search, '%'))`
- Автоматичне визначення ціни за кольором через PriceDetails
- Валідація через shared ValidationService

### 3. PriceModifierService
**Відповідальність:** Управління модифікаторами цін

**Основні методи:**
```java
public List<PriceModifierResponse> getModifiers(String categoryCode, Boolean active);
public List<PriceModifierEntity> getApplicableModifiers(String categoryCode);
public BigDecimal applyModifier(BigDecimal price, PriceModifierEntity modifier);
```

**Особливості:**
- @Cacheable("priceModifiers") для getModifiers
- Фільтрація по applicableCategories.contains(categoryCode)
- Сортування по priority (ascending)

### 4. ItemCalculationService
**Відповідальність:** Розрахунок вартості послуг

**Основні методи:**
```java
public ItemCalculationResponse calculateItemPrice(ItemCalculationRequest request);
public ItemPricePreviewResponse previewItemPrice(ItemCalculationRequest request);
public OrderSummaryResponse calculateOrderSummary(CalculateOrderSummaryRequest request);
```

**Особливості:**
- Використання PriceCalculator, ModifierApplicator, JexlCalculator
- @Transactional для calculateItemPrice (зберігає результат)
- Preview режим без @Transactional
- Детальне логування кожного кроку розрахунку

### 5. ItemPhotoService
**Відповідальність:** Робота з фотографіями

**Основні методи:**
```java
public PhotoResponse uploadPhoto(UUID orderItemId, MultipartFile file);
public List<PhotoResponse> getItemPhotos(UUID orderItemId);
public PhotoDownloadResponse downloadPhoto(UUID photoId);
public void deletePhoto(UUID photoId);
```

**Особливості:**
- Використання PhotoValidator для перевірки файлів
- Максимум 5 фото на предмет (ItemConstants.MAX_PHOTOS_PER_ITEM)
- Автоматична генерація thumbnail через ImageUtils
- Підтримка S3 або локального сховища (залежно від конфігурації)

## 🧮 Алгоритм розрахунку цін

### Основний процес (PriceCalculator):
1. **Отримання базової ціни:**
   ```java
   BigDecimal basePrice = priceDetails.getPriceForColor(itemColor);
   // Логіка в PriceDetails:
   // - Якщо color == BLACK && priceBlack != null → return priceBlack
   // - Якщо color != BLACK && color != null && priceColor != null → return priceColor  
   // - Інакше → return basePrice
   ```

2. **Застосування модифікаторів (ModifierApplicator):**
   - Сортування модифікаторів за пріоритетом
   - Перевірка застосовності до категорії
   - Послідовне застосування:
     - PERCENTAGE: ціна * (1 + value/100)
     - FIXED_AMOUNT: ціна + value
   - Логування кожного кроку

3. **JEXL формули (JexlCalculator):**
   ```java
   JexlContext context = new MapContext();
   context.set("basePrice", basePrice);
   context.set("quantity", quantity);
   context.set("color", color.name());
   context.set("material", material);
   context.set("urgency", urgencyType.name());
   
   JexlExpression expression = jexlEngine.createExpression(formula);
   BigDecimal result = (BigDecimal) expression.evaluate(context);
   ```

4. **Фінальна обробка:**
   - Округлення до 2 знаків після коми
   - Валідація мінімальної ціни (не менше 0)
   - Формування детального звіту розрахунку

## 🔗 Взаємодія з іншими доменами

### Order Domain
- OrderItemEntity зберігає посилання на PriceListItemEntity
- ItemCalculationService викликається з OrderService при створенні предметів
- OrderCalculationEntity зберігає детальну історію розрахунків
- ItemPhotoEntity прив'язується до OrderItemEntity через orderItemId

### Client Domain  
- Можливість персональних знижок для VIP клієнтів
- Статистика найпопулярніших послуг клієнта

### Branch Domain
- Фотографії можуть мати прив'язку до філії
- Різні філії можуть мати різні модифікатори цін

### Shared компоненти
- BaseEntity - базовий клас для всіх entities
- ValidationService - централізована валідація
- ValidationConstants - спільні константи валідації
- ErrorCode - стандартизовані коди помилок

## 📋 Repository методи

### ServiceCategoryRepository
- `findByCode()` - пошук категорії за кодом
- `findByActiveTrue()` - всі активні категорії з сортуванням

### PriceListItemRepository
- `findByCategoryCodeAndActiveTrue()` - послуги за категорією
- `findByCategoryCodeAndCatalogNumber()` - унікальний пошук
- `searchByName()` - повнотекстовий пошук по назві

### PriceModifierRepository
- `findByCode()` - пошук модифікатора за кодом
- `findByCategoryAndActiveTrue()` - модифікатори для категорії
- `findByActiveTrue()` - всі активні модифікатори

## 💡 Ключові бізнес-правила

1. **Ціноутворення:**
   - Базова ціна завжди обов'язкова (NOT NULL в БД)
   - Ціни для чорного/кольорового опційні (NULL якщо не відрізняються)
   - Модифікатори застосовуються послідовно за пріоритетом (ORDER BY priority ASC)
   - Мінімальна ціна після всіх розрахунків: 0.01 грн

2. **Категорії:**
   - Кожна послуга належить до однієї категорії
   - Категорія визначає стандартний термін виконання

3. **Модифікатори:**
   - Можуть бути загальними або для конкретних категорій
   - PERCENTAGE додається до 100% (30% = множник 1.3)
   - FIXED_AMOUNT додається до ціни

4. **Фотографії:**
   - Максимум 5 фото на предмет
   - Тільки JPG/PNG формати
   - Автоматичне створення thumbnail

## 🔐 Безпека та валідація

- Валідація розмірів фото (max 5MB)
- Перевірка форматів (JPG, PNG)
- Захист від переповнення при розрахунках
- Аудит змін цін
- Перевірка прав доступу для зміни прайсу

## 📊 Оптимізація

- Кешування прайс-листу в Redis
- Індекси на category_code, active
- Lazy loading для фотографій
- Batch операції для масових розрахунків
- Денормалізація часто використовуваних даних

## 🎯 API endpoints

**Реалізовані в OpenAPI:**
```
GET    /api/service-categories         # Отримати всі категорії
GET    /api/price-list                 # Отримати прайс-лист  
GET    /api/price-modifiers            # Отримати модифікатори
```

**Потрібно додати в OpenAPI:**
```
POST   /api/calculate/item             # Розрахувати вартість предмета
POST   /api/calculate/item/preview     # Попередній розрахунок
POST   /api/calculate/order-summary    # Розрахунок загальної вартості
GET    /api/items/{itemId}/photos      # Отримати фотографії предмета
POST   /api/items/{itemId}/photos      # Завантажити фотографію
GET    /api/photos/{photoId}           # Отримати фотографію за ID
PUT    /api/photos/{photoId}           # Оновити метадані фотографії
DELETE /api/photos/{photoId}           # Видалити фотографію
GET    /api/photos/{photoId}/file      # Завантажити файл фотографії
```

## 📝 План імплементації

1. **Фаза 1: Базова інфраструктура**
   - Створити enums (ServiceCategoryCode, UnitOfMeasure, ModifierType, ItemColor)
   - Додати константи в ItemConstants
   - Створити конфігурацію ItemDomainConfig

2. **Фаза 2: Liquibase міграції**
   - Створити таблиці для всіх entities
   - Завантажити initial data з CSV
   - Додати тестові модифікатори

3. **Фаза 3: Сервіси та бізнес-логіка**
   - Імплементувати всі сервіси
   - Додати калькулятори цін
   - Реалізувати JEXL engine

4. **Фаза 4: API та контролери**
   - Доповнити OpenAPI специфікацію
   - Згенерувати відсутні DTO
   - Імплементувати контролери

5. **Фаза 5: Валідація та помилки**
   - Додати валідатори
   - Створити exception класи
   - Налаштувати ExceptionHandler

6. **Фаза 6: Тестування**
   - Unit тести для сервісів
   - Integration тести для API
   - Тести розрахунків цін
