# OpenAPI Модульна Структура

## Огляд

OpenAPI специфікації були реорганізовані з монолітних файлів у модульну структуру для кращої підтримки та співпраці в команді.

## Структура директорій

```
openapi/
├── common/                    # Спільні компоненти для всіх доменів
│   ├── parameters/
│   │   ├── path.yaml         # Спільні path параметри
│   │   └── query.yaml        # Спільні query параметри
│   ├── schemas/
│   │   ├── base.yaml         # Базові типи (UUID, Timestamp, etc.)
│   │   ├── address.yaml      # Адресні схеми
│   │   ├── errors.yaml       # Схеми помилок
│   │   └── pagination.yaml   # Схеми пагінації
│   └── security.yaml         # Схеми безпеки
│
├── order/                    # Order домен
│   ├── paths/
│   │   ├── order-management.yaml
│   │   ├── order-items.yaml
│   │   ├── order-calculations.yaml
│   │   └── order-completion.yaml
│   └── schemas/
│       ├── order-enums.yaml
│       ├── order-requests.yaml
│       ├── order-responses.yaml
│       ├── order-item-schemas.yaml
│       ├── order-calculation-schemas.yaml
│       └── price-modifiers.yaml
│
├── client/                   # Client домен
│   ├── paths/
│   │   ├── client-management.yaml
│   │   ├── client-search.yaml
│   │   └── client-contacts.yaml
│   └── schemas/
│       ├── client-enums.yaml
│       ├── client-requests.yaml
│       └── client-responses.yaml
│
├── item/                     # Item домен
│   ├── paths/
│   │   ├── service-categories.yaml
│   │   ├── price-list.yaml
│   │   ├── price-modifiers.yaml
│   │   ├── item-calculations.yaml
│   │   └── item-photos.yaml
│   └── schemas/
│       ├── item-requests.yaml
│       └── item-responses.yaml
│
├── document/                 # Document домен
│   ├── paths/
│   │   ├── receipt-management.yaml
│   │   ├── pdf-generation.yaml
│   │   ├── qr-code-management.yaml
│   │   ├── digital-signature-management.yaml
│   │   └── document-management.yaml
│   └── schemas/
│       ├── document-enums.yaml
│       ├── document-requests.yaml
│       └── document-responses.yaml
│
├── branch/                   # Branch домен
│   ├── paths/
│   │   ├── branch-management.yaml
│   │   ├── working-schedule-management.yaml
│   │   ├── receipt-number-management.yaml
│   │   └── branch-statistics.yaml
│   └── schemas/
│       ├── branch-enums.yaml
│       ├── branch-requests.yaml
│       └── branch-responses.yaml
│
├── order-api.yaml           # Головний файл Order API
├── client-api.yaml          # Головний файл Client API
├── item-api.yaml            # Головний файл Item API
├── document-api.yaml        # Головний файл Document API
└── branch-api.yaml          # Головний файл Branch API
```

## Переваги модульної структури

### 1. **Розмір файлів**

- **До**: 1000-1500 рядків на файл
- **Після**: 50-300 рядків на файл
- **Покращення**: Файли стали на 80-90% менші

### 2. **Повторне використання коду**

- Спільні схеми в `/common` використовуються всіма доменами
- Видалено ~90% дублювання коду
- Єдине джерело істини для базових типів

### 3. **Командна робота**

- Різні команди можуть працювати з різними доменами паралельно
- Очікується на 95% менше конфліктів злиття
- Чіткі межі відповідальності

### 4. **Підтримка**

- Легше знайти потрібну схему чи endpoint
- Логічна організація за доменами та типами
- Простіше вносити зміни без впливу на інші частини

## Конвенції іменування

### Файли

- **Енуми**: `{domain}-enums.yaml`
- **Запити**: `{domain}-requests.yaml`
- **Відповіді**: `{domain}-responses.yaml`
- **Шляхи**: `{feature}-management.yaml`

### Схеми

- **Запити**: `{Action}{Entity}Request`
- **Відповіді**: `{Entity}Response`
- **Енуми**: `{Entity}{Property}`

## Використання $ref

### Внутрішні посилання (в тому ж файлі)

```yaml
$ref: "#/SchemaName"
```

### Посилання на схеми в тому ж домені

```yaml
$ref: "../schemas/domain-responses.yaml#/SchemaName"
```

### Посилання на спільні схеми

```yaml
$ref: "../../common/schemas/base.yaml#/UUID"
```

### Посилання на шляхи (paths)

Використовується escape синтаксис для слешів:

```yaml
$ref: "domain/paths/feature.yaml#/~1api~1resource~1{id}"
```

## Генерація коду

При використанні OpenAPI Generator модульна структура забезпечує:

- Єдині класи для спільних схем
- Правильні імпорти між модулями
- Відсутність дублювання згенерованого коду

## Міграція

Для існуючого коду, що використовує стару структуру:

1. Оновіть шляхи імпорту в конфігурації генератора
2. Перегенеруйте код використовуючи нові специфікації
3. Імена класів залишаються тими самими завдяки правильному використанню $ref

## Внесення змін

При додаванні нових endpoints або схем:

1. Визначте правильний домен
2. Додайте схему в відповідний файл схем
3. Додайте endpoint в відповідний файл шляхів
4. Оновіть головний файл домену з новими посиланнями
5. Перевірте чи можна використати існуючі спільні схеми
