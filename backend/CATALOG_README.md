# Робота з каталогом послуг

## Спрощена архітектура

Замість складної структури з 4 таблицями (services, items, service_items, price_list_items), тепер використовується єдина таблиця `price_list_items`.

## Основна сутність: PriceListItem

```java
public class PriceListItem {
    // Основні поля
    private ServiceCategoryType categoryCode;  // CLOTHING, LAUNDRY, IRONING...
    private Integer catalogNumber;             // Унікальний номер в каталозі
    private String name;                       // Назва послуги/предмета
    private String nameUa;                     // Українська назва
    private UnitOfMeasure unitOfMeasure;       // PIECE, KILOGRAM, PAIR...
    
    // Ціни (в копійках)
    private Integer basePrice;                 // Базова ціна
    private Integer priceBlack;                // Ціна для чорного
    private Integer priceColor;                // Ціна для кольорового
    
    // Параметри обробки
    private Integer processingTimeDays;        // Звичайний час обробки
    private boolean expressAvailable;          // Чи доступна експрес-послуга
    private Integer expressTimeHours;          // Час експрес-обробки
    private Integer expressPrice;              // Ціна експрес-послуги
    
    // Додаткові поля
    private Integer sortOrder;                 // Порядок відображення
    private String description;                // Опис
    private boolean active;                    // Активність
}
```

## API Endpoints

### Публічні (для всіх авторизованих)
- `GET /api/price-list` - список елементів прайсу
- `GET /api/price-list/{id}` - деталі елемента

### Адміністративні (тільки ADMIN)
- `POST /api/price-list` - створити новий елемент
- `PUT /api/price-list/{id}` - оновити елемент
- `DELETE /api/price-list/{id}` - видалити елемент
- `POST /api/admin/price-list/sync` - синхронізація (якщо потрібно)
- `GET /api/admin/price-list/export` - експорт в CSV
- `GET /api/admin/price-list/categories` - список активних категорій

## Використання в Order

### Було:
```java
// Складний процес через 3 сервіси
ServiceInfo service = serviceService.getServiceById(serviceId);
ItemInfo item = itemService.getItemById(itemId);
ServiceItemInfo serviceItem = serviceItemService.getByServiceAndItem(serviceId, itemId);
BigDecimal price = serviceItem.getBasePrice();
```

### Стало:
```java
// Простий прямий доступ
PriceListItemInfo priceItem = priceListService.getPriceListItemById(id);
Integer price = priceItem.getBasePrice();
```

## Приклади запитів

### Отримати всі послуги чистки одягу
```http
GET /api/price-list?categoryCode=CLOTHING&active=true
```

### Створити новий елемент прайсу
```http
POST /api/price-list
Content-Type: application/json

{
    "categoryCode": "CLOTHING",
    "catalogNumber": 150,
    "name": "Пальто зимове",
    "nameUa": "Пальто зимове",
    "unitOfMeasure": "PIECE",
    "basePrice": 35000,  // 350.00 грн
    "processingTimeDays": 3,
    "expressAvailable": true,
    "expressTimeHours": 24,
    "expressPrice": 17500  // +175.00 грн
}
```

### Оновити ціну
```http
PUT /api/price-list/{id}
Content-Type: application/json

{
    "basePrice": 40000,  // 400.00 грн
    "expressPrice": 20000  // +200.00 грн
}
```

## Категорії послуг

- `CLOTHING` - Одяг та текстильні вироби
- `LAUNDRY` - Послуги прання
- `IRONING` - Послуги прасування
- `LEATHER` - Шкіряні вироби
- `PADDING` - Ватні вироби
- `FUR` - Хутряні вироби
- `DYEING` - Послуги фарбування
- `ADDITIONAL_SERVICES` - Додаткові послуги

## Одиниці виміру

- `PIECE` - Штука (шт)
- `KILOGRAM` - Кілограм (кг)
- `PAIR` - Пара
- `SQUARE_METER` - Квадратний метр (кв.м)

## Міграція для існуючих проектів

1. Запустіть міграцію 014 - розширить price_list_items
2. Запустіть міграцію 015 - видалить старі таблиці
3. Оновіть код для використання PriceListService
4. Видаліть непотрібні класи