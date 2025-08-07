# Receipt Service Module

## Огляд

Модуль Receipt Service відповідає за генерацію PDF-квитанцій для замовлень хімчистки. Модуль побудований за принципами чистої архітектури з чітким розділенням відповідальностей та API-first підходом.

## Архітектура

### API-First підхід
- API контракти визначені в OpenAPI специфікації (`/resources/openapi/receipt-api.yaml`)
- DTO та інтерфейси генеруються автоматично
- Контролер є тонким адаптером між згенерованим API та сервісним шаром

### Основні компоненти

#### 1. **ReceiptController**
- Реалізує згенерований `ReceiptsApi` інтерфейс
- Тонкий адаптер між API та сервісом
- Логування операцій
- Обробка HTTP відповідей

#### 2. **ReceiptService / ReceiptServiceImpl**
- Бізнес-логіка для роботи з квитанціями
- Повертає `Resource` для контролера
- Методи:
  - `generateOrderReceipt(UUID orderId, String locale)` - генерація квитанції для замовлення
  - `generateReceiptPreview(ReceiptPreviewRequest request)` - попередній перегляд
  - `emailOrderReceipt(Long orderId, EmailReceiptRequest request)` - відправка email (заглушка)
  - `getAvailableTemplates()` - отримання доступних шаблонів

#### 3. **ReceiptFacade**
- Оркеструє процес генерації квитанцій
- Виконує валідацію даних
- Керує локалізацією
- Координує роботу між конвертером, генератором та реєстром шаблонів

#### 4. **ReceiptDataConverter**
- Конвертує `OrderEntity` в `ReceiptOrderData`
- Обробляє всі необхідні дані для квитанції
- Використовує конфігурацію для значень за замовчуванням

#### 5. **ReceiptPdfGenerator**
- Головний генератор PDF
- Координує роботу всіх секцій квитанції
- Підтримує локалізацію

### Секції квитанції

1. **HeaderSection** - заголовок з номером квитанції та датою
2. **CustomerSection** - інформація про клієнта
3. **ItemsTableSection** - таблиця з позиціями замовлення
4. **SummarySection** - фінансова інформація
5. **FooterSection** - дата готовності та подяка

### Допоміжні компоненти

- **PdfDocumentBuilder** - абстракція для роботи з PDF
- **PdfBoxDocumentBuilder** - реалізація з Apache PDFBox (використовує @SuppressWarnings("resource") для builder pattern)
- **ReceiptFormatter** - форматування дат, сум та телефонів (перенесено з converter пакету)
- **ReceiptTemplateRegistry** - управління шаблонами квитанцій
- **ReceiptMessages** - централізована локалізація текстів з резервними значеннями
- **ReceiptConfiguration** - всі налаштування PDF (@ConfigurationProperties)
- **TableDrawer** - допоміжний клас для малювання таблиць

## Конфігурація

### application.yml

```yaml
receipt:
  default-branch-name: "AKSI"
  default-payment-method: "CASH"
  currency: "грн"
  phone-prefix: "Тел: "
  date-time-format: "dd.MM.yyyy HH:mm"
  date-format: "dd.MM.yyyy"
  
  font:
    directory: "fonts/"
    regular: "DejaVuSans.ttf"
    bold: "DejaVuSans-Bold.ttf"
    title-size: 18
    heading-size: 12
    normal-size: 10
    small-size: 8
  
  layout:
    page-width: 595.0
    page-height: 842.0
    margin-top: 50.0
    margin-bottom: 50.0
    margin-left: 50.0
    margin-right: 50.0
```

### Локалізація

Підтримуються мови:
- Українська (uk) - за замовчуванням
- Англійська (en)

Файли локалізації:
- `/resources/messages/receipt_messages.properties` (default)
- `/resources/messages/receipt_messages_uk.properties`
- `/resources/messages/receipt_messages_en.properties`

## API Endpoints

### 1. Генерація квитанції для замовлення
```
GET /api/receipts/order/{orderId}?locale=uk
```

### 2. Попередній перегляд квитанції
```
POST /api/receipts/preview
Content-Type: application/json

{
  "orderData": { ... },
  "templateId": "default",
  "locale": "uk"
}
```

### 3. Отримання доступних шаблонів
```
GET /api/receipts/templates
```

## Вимоги

### Шрифти
Для підтримки української мови необхідно додати файли шрифтів:
- `/resources/fonts/NotoSans-Regular.ttf`
- `/resources/fonts/NotoSans-Bold.ttf`

Або будуть використані стандартні шрифти Helvetica.

### Залежності
```xml
<dependency>
    <groupId>org.apache.pdfbox</groupId>
    <artifactId>pdfbox</artifactId>
    <version>3.0.5</version>
</dependency>
```

## Реалізація

### Актуальний контролер (тонкий адаптер)
```java
@Slf4j
@RestController
@RequiredArgsConstructor
public class ReceiptController implements ReceiptsApi {

  private final ReceiptService receiptService;

  @Override
  public ResponseEntity<Resource> generateOrderReceipt(UUID orderId, String locale) {
    log.debug("Generating receipt for order: {}, locale: {}", orderId, locale);
    
    Resource resource = receiptService.generateOrderReceipt(orderId, locale);
    log.debug("Receipt generated successfully for order: {}", orderId);
    return ResponseEntity.ok(resource);
  }
}
```

## Структура згенерованої квитанції

```
╔═══════════════════════════════════════╗
║         КВИТАНЦІЯ № ORD-2024-0001     ║
║           від 25.12.2024 14:30        ║
╠═══════════════════════════════════════╣
║ AKSI Main Branch                      ║
║ вул. Хрещатик, 1, Київ                ║
║ Тел: +380 44 123 45 67                ║
╠═══════════════════════════════════════╣
║ Клієнт: Іван Петренко                 ║
║ Телефон: +380 67 123 45 67            ║
╠═══════════════════════════════════════╣
║ Найменування   │ К-ть │ Ціна  │ Сума  ║
║ Піджак чол.    │  1   │ 500.00│ 500.00║
║ + Терміново    │      │       │       ║
╠═══════════════════════════════════════╣
║ Підсумок:                      1500.00║
║ Знижка:                         150.00║
║ Всього:                        1350.00║
║ Передплата:                     500.00║
║ До сплати:                      850.00║
╠═══════════════════════════════════════╣
║ Дата готовності: 27.12.2024           ║
║ Примітки: Обережно з пуговицями       ║
║                                       ║
║   Дякуємо за ваше замовлення!         ║
╚═══════════════════════════════════════╝
```

## Принципи побудови

1. **Single Responsibility Principle (SRP)** - кожен клас має одну відповідальність
2. **Don't Repeat Yourself (DRY)** - відсутність дублювання коду
3. **Keep It Simple, Stupid (KISS)** - простота реалізації
4. **Clean Architecture** - чітке розділення шарів

## Важливі нотатки

### Builder Pattern та AutoCloseable
Клас `PdfBoxDocumentBuilder` використовує анотацію `@SuppressWarnings("resource")` на рівні класу, оскільки:
- Це builder pattern з fluent API, де методи повертають `this`
- IDE неправильно інтерпретує це як витік ресурсів
- Ресурси правильно закриваються в методах `build()` та `close()`

### Особливості згенерованого API
- Метод `emailOrderReceipt` в згенерованому API використовує `Long orderId` замість `UUID`
- Це особливість OpenAPI generator, яку ми враховуємо в реалізації

## TODO

- [ ] Додати підтримку QR-кодів
- [ ] Реалізувати відправку квитанцій email (зараз заглушка)
- [ ] Додати підтримку різних форматів паперу
- [ ] Створити додаткові шаблони квитанцій
- [ ] Додати підтримку штрих-кодів
- [ ] Додати можливість вибору шрифтів через конфігурацію