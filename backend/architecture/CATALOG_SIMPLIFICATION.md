# Спрощення архітектури каталогу

## Дата: 2025-08-04

## Рішення

Прийнято рішення спростити архітектуру каталогу та працювати напряму з прайс-листом.

## Що було до спрощення

4 окремі таблиці та компоненти:
- `services` - типи послуг (чистка, прання, прасування)
- `items` - типи предметів (пальто, сорочка, костюм)
- `service_items` - комбінації послуга+предмет з цінами
- `price_list_items` - майстер-дані з прайс-листа

Складний процес синхронізації:
1. Імпорт CSV → `price_list_items`
2. Генерація `services` з унікальних категорій
3. Генерація `items` з записів прайс-листа
4. Створення зв'язків в `service_items`
5. Синхронізація цін

## Що стало після спрощення

Одна таблиця `price_list_items` з розширеними полями:
- Всі поля з прайс-листа (категорія, назва, ціни)
- Додаткові поля для обробки (час виконання, експрес-послуга)
- Поля для UI (сортування, опис, українська назва)

## Переваги спрощення

1. **Простота** - один каталог замість чотирьох
2. **Швидкість** - немає потреби в синхронізації
3. **Зрозумілість** - прайс-лист = каталог послуг
4. **Легкість підтримки** - менше коду, менше помилок
5. **Прямий CRUD** - можна редагувати всі поля напряму

## Міграція

### Крок 1: Розширення таблиці (014-extend-price-list-items.yaml)
- Додані поля: processingTimeDays, expressAvailable, expressTimeHours, expressPrice, sortOrder, description, nameUa
- Міграція даних з service_items
- Збереження існуючих налаштувань

### Крок 2: Видалення старих таблиць (015-cleanup-old-catalog-tables.yaml)
- Видалення service_items
- Видалення items
- Видалення services

## API зміни

### Нові endpoints для PriceListItem:
- POST /api/price-list - створити новий елемент
- PUT /api/price-list/{id} - оновити елемент
- DELETE /api/price-list/{id} - видалити елемент

### Видалені endpoints:
- /api/services/* - всі endpoints для services
- /api/items/* - всі endpoints для items
- /api/service-items/* - всі endpoints для service-items

## Компоненти для видалення

### Java класи:
- ServiceCatalog, ItemCatalog, ServiceItem (entities)
- ServiceCatalogService*, ItemCatalogService*, ServiceItemService*
- ServiceController, ItemController, ServiceItemController
- ServiceCatalogMapper, ItemCatalogMapper, ServiceItemMapper
- ServiceRepository, ItemRepository, ServiceItemRepository

### Тести:
- Всі тести для видалених компонентів

## Використання в Order

Замість:
```java
ServiceItem serviceItem = serviceItemService.getServiceItemById(id);
```

Тепер:
```java
PriceListItemInfo priceItem = priceListService.getPriceListItemById(id);
```

## Подальші кроки

1. Оновити OrderService для роботи з PriceListItem
2. Оновити OrderWizard для вибору з прайс-листа
3. Оновити фронтенд для роботи з новим API
4. Видалити непотрібні файли після перевірки