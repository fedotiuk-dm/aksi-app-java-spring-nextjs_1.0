# Document Domain - Управління документами

## Огляд домену

Document Domain відповідає за генерацію, управління та зберігання документів системи, включаючи квитанції, QR-коди, цифрові підписи та PDF файли з повною деталізацією замовлень.

## Бізнес-логіка

### Функціональність

- **Генерація квитанцій** - створення детальних квитанцій з розрахунками
- **PDF документи** - конвертація в PDF для друку
- **QR-коди** - генерація для відстеження замовлень
- **Цифрові підписи** - збереження підписів клієнтів
- **Шаблони документів** - різні макети для різних типів квитанцій
- **Фотодокументація** - управління зображеннями предметів

### Бізнес-правила квитанції

1. **Шапка**: Логотип, назва компанії, юридична інформація, контакти
2. **Інформація про замовлення**: Номер, унікальна мітка, дати, філія, оператор
3. **Клієнт**: ПІБ, телефон, способи зв'язку, адреса
4. **Таблиця предметів**: Детальний розрахунок для кожного предмета
5. **Забруднення і дефекти**: Перелік виявлених проблем
6. **Фінанси**: Вартість, знижки, передоплата, борг
7. **Юридична інформація**: Умови, обмеження відповідальності
8. **Підписи**: Клієнт при здачі та отриманні, оператор, печатка

## Доменна модель

### Entities

#### Document

```java
@Entity
public class Document {
    private Long id;
    private String documentNumber;      // Унікальний номер документа
    private DocumentType type;          // Тип документа
    private Long relatedEntityId;       // ID пов'язаної сутності (наприклад, orderId)
    private String fileName;            // Ім'я файлу
    private String filePath;            // Шлях до файлу
    private Long fileSize;              // Розмір файлу в байтах
    private String mimeType;            // MIME тип
    private DocumentStatus status;      // Статус документа
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;           // Хто створив
    private DocumentMetadata metadata;  // Метадані
}
```

#### Receipt

```java
@Entity
public class Receipt {
    private Long id;
    private Long orderId;               // Замовлення
    private String receiptNumber;       // Номер квитанції
    private ReceiptData data;           // Дані квитанції
    private String pdfFilePath;         // Шлях до PDF
    private String qrCodeUrl;           // URL QR-коду
    private LocalDateTime generatedAt;
    private String generatedBy;
    private boolean isPrinted;          // Чи роздрукована
    private LocalDateTime printedAt;
}
```

#### DigitalSignature

```java
@Entity
public class DigitalSignature {
    private Long id;
    private Long documentId;            // Документ
    private String signatureData;       // Base64 дані підпису
    private SignatureType type;         // Тип підпису
    private String signerName;          // Ім'я підписанта
    private LocalDateTime signedAt;
    private String ipAddress;           // IP адреса
    private SignatureMetadata metadata; // Метадані підпису
}
```

#### Photo

```java
@Entity
public class Photo {
    private Long id;
    private Long orderItemId;           // Предмет замовлення
    private String fileName;            // Оригінальне ім'я файлу
    private String filePath;            // Шлях до файлу
    private String thumbnailPath;       // Шлях до мініатюри
    private Long fileSize;              // Розмір файлу
    private String mimeType;            // MIME тип
    private ImageMetadata metadata;     // Метадані зображення
    private LocalDateTime uploadedAt;
    private String uploadedBy;
}
```

### Value Objects

#### ReceiptData

```java
@Embeddable
public class ReceiptData {
    private CompanyInfo companyInfo;        // Інформація про компанію
    private BranchInfo branchInfo;          // Інформація про філію
    private OrderInfo orderInfo;            // Інформація про замовлення
    private ClientInfo clientInfo;          // Інформація про клієнта
    private List<ItemDetail> items;         // Деталі предметів
    private FinancialSummary financial;     // Фінансовий підсумок
    private LegalInfo legalInfo;            // Юридична інформація
    private OperatorInfo operatorInfo;      // Інформація про оператора
}
```

#### CompanyInfo

```java
@Embeddable
public class CompanyInfo {
    private String companyName;             // Назва компанії
    private String legalName;               // Юридична назва
    private String address;                 // Юридична адреса
    private String phone;                   // Телефон
    private String email;                   // Email
    private String website;                 // Веб-сайт
    private String logoUrl;                 // Логотип
    private String taxNumber;               // Податковий номер
}
```

#### ItemDetail

```java
@Embeddable
public class ItemDetail {
    private int itemNumber;                 // Порядковий номер
    private String itemName;                // Найменування
    private String category;                // Категорія
    private String quantity;                // Кількість/Вага
    private String material;                // Матеріал
    private String color;                   // Колір
    private String filling;                 // Наповнювач
    private BigDecimal basePrice;          // Базова ціна
    private List<ModifierDetail> modifiers; // Модифікатори
    private BigDecimal finalPrice;         // Фінальна ціна
    private List<String> stains;           // Плями
    private List<String> defects;          // Дефекти
    private String defectNotes;            // Примітки до дефектів
}
```

### Enums

#### DocumentType

```java
public enum DocumentType {
    RECEIPT("Квитанція"),
    CONTRACT("Договір"),
    INVOICE("Рахунок"),
    PHOTO("Фото"),
    QR_CODE("QR-код"),
    SIGNATURE("Підпис");
}
```

#### DocumentStatus

```java
public enum DocumentStatus {
    DRAFT("Чернетка"),
    GENERATED("Згенеровано"),
    SIGNED("Підписано"),
    PRINTED("Роздруковано"),
    ARCHIVED("Заархівовано");
}
```

#### SignatureType

```java
public enum SignatureType {
    CLIENT_HANDOVER("Підпис клієнта при здачі"),
    CLIENT_PICKUP("Підпис клієнта при отриманні"),
    OPERATOR("Підпис оператора"),
    DIGITAL("Цифровий підпис");
}
```

## Сервіси

### DocumentService

```java
@Service
public class DocumentService {

    // Управління документами
    Document createDocument(CreateDocumentRequest request);
    Document getDocument(Long id);
    List<Document> getDocumentsByEntity(Long entityId, DocumentType type);
    void deleteDocument(Long id);

    // Файлові операції
    byte[] getDocumentContent(Long id);
    String saveDocumentFile(MultipartFile file, DocumentType type);
    void updateDocumentContent(Long id, byte[] content);
}
```

### ReceiptService

```java
@Service
public class ReceiptService {

    // Генерація квитанцій
    Receipt generateReceipt(Long orderId);
    ReceiptData prepareReceiptData(Long orderId);
    byte[] generateReceiptPdf(Long orderId);

    // Управління квитанціями
    Receipt getReceiptByOrderId(Long orderId);
    Receipt getReceiptByNumber(String receiptNumber);
    void markAsPrinted(Long receiptId);

    // Шаблони
    String renderReceiptHtml(ReceiptData data, String templateName);
    byte[] convertHtmlToPdf(String html);
}
```

### QRCodeService

```java
@Service
public class QRCodeService {

    // Генерація QR-кодів
    byte[] generateQRCode(String data);
    byte[] generateQRCode(String data, int width, int height);
    String generateQRCodeUrl(String uniqueTag);

    // Валідація та розшифровка
    boolean validateQRCode(String qrData);
    OrderTrackingInfo decodeQRCode(String qrData);

    // Зберігання
    String saveQRCodeImage(byte[] qrCodeData, String uniqueTag);
}
```

### PhotoService

```java
@Service
public class PhotoService {

    // Завантаження фото
    Photo uploadPhoto(Long orderItemId, MultipartFile file);
    List<Photo> uploadMultiplePhotos(Long orderItemId, List<MultipartFile> files);

    // Управління фото
    Photo getPhoto(Long id);
    List<Photo> getPhotosByOrderItem(Long orderItemId);
    void deletePhoto(Long id);

    // Обробка зображень
    byte[] generateThumbnail(byte[] originalImage, int width, int height);
    byte[] compressImage(byte[] originalImage, double quality);
    ImageMetadata extractMetadata(byte[] imageData);
}
```

### DigitalSignatureService

```java
@Service
public class DigitalSignatureService {

    // Підписи
    DigitalSignature saveSignature(SaveSignatureRequest request);
    DigitalSignature getSignature(Long id);
    List<DigitalSignature> getSignaturesByDocument(Long documentId);

    // Валідація
    boolean validateSignature(Long signatureId);
    SignatureVerificationResult verifySignature(String signatureData);

    // Метадані
    SignatureMetadata extractSignatureMetadata(String signatureData);
}
```

## Repositories

### DocumentRepository

```java
@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByRelatedEntityIdAndType(Long entityId, DocumentType type);
    Optional<Document> findByDocumentNumber(String documentNumber);
    List<Document> findByStatus(DocumentStatus status);
    List<Document> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT d FROM Document d WHERE d.type = :type AND d.createdAt >= :date")
    List<Document> findRecentDocuments(@Param("type") DocumentType type,
                                      @Param("date") LocalDateTime date);
}
```

### ReceiptRepository

```java
@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, Long> {

    Optional<Receipt> findByOrderId(Long orderId);
    Optional<Receipt> findByReceiptNumber(String receiptNumber);
    List<Receipt> findByIsPrintedFalse();

    @Query("SELECT COUNT(r) FROM Receipt r WHERE r.generatedAt >= :startDate")
    Long countReceiptsFromDate(@Param("startDate") LocalDateTime startDate);
}
```

### PhotoRepository

```java
@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {

    List<Photo> findByOrderItemId(Long orderItemId);

    @Query("SELECT COUNT(p) FROM Photo p WHERE p.orderItemId = :orderItemId")
    int countPhotosByOrderItem(@Param("orderItemId") Long orderItemId);

    @Query("SELECT SUM(p.fileSize) FROM Photo p WHERE p.uploadedAt >= :date")
    Long getTotalStorageUsedFromDate(@Param("date") LocalDateTime date);
}
```

## DTOs

### Request DTOs

#### CreateDocumentRequest

```java
public class CreateDocumentRequest {
    @NotNull
    private DocumentType type;

    @NotNull
    private Long relatedEntityId;

    private String fileName;
    private byte[] content;
    private String mimeType;
    private DocumentMetadata metadata;
}
```

#### SaveSignatureRequest

```java
public class SaveSignatureRequest {
    @NotNull
    private Long documentId;

    @NotBlank
    private String signatureData;       // Base64

    @NotNull
    private SignatureType type;

    private String signerName;
    private String ipAddress;
}
```

### Response DTOs

#### ReceiptResponse

```java
public class ReceiptResponse {
    private Long id;
    private Long orderId;
    private String receiptNumber;
    private ReceiptData data;
    private String pdfDownloadUrl;
    private String qrCodeUrl;
    private boolean isPrinted;
    private LocalDateTime generatedAt;
    private LocalDateTime printedAt;
}
```

#### PhotoResponse

```java
public class PhotoResponse {
    private Long id;
    private Long orderItemId;
    private String fileName;
    private String downloadUrl;
    private String thumbnailUrl;
    private Long fileSize;
    private String mimeType;
    private ImageMetadata metadata;
    private LocalDateTime uploadedAt;
}
```

#### DocumentResponse

```java
public class DocumentResponse {
    private Long id;
    private String documentNumber;
    private DocumentType type;
    private Long relatedEntityId;
    private String fileName;
    private String downloadUrl;
    private Long fileSize;
    private DocumentStatus status;
    private LocalDateTime createdAt;
    private List<DigitalSignatureResponse> signatures;
}
```

## API Endpoints

### Управління документами

- `POST /api/documents` - Створення документа
- `GET /api/documents/{id}` - Отримання документа
- `GET /api/documents/{id}/content` - Завантаження вмісту
- `DELETE /api/documents/{id}` - Видалення документа

### Квитанції

- `POST /api/orders/{orderId}/receipt` - Генерація квитанції
- `GET /api/orders/{orderId}/receipt` - Отримання квитанції
- `GET /api/orders/{orderId}/receipt/pdf` - PDF квитанції
- `POST /api/receipts/{id}/print` - Відмітка про друк

### QR-коди

- `POST /api/qr-codes/generate` - Генерація QR-коду
- `GET /api/qr-codes/{uniqueTag}` - Отримання QR-коду
- `POST /api/qr-codes/validate` - Валідація QR-коду

### Фотографії

- `POST /api/order-items/{id}/photos` - Завантаження фото
- `GET /api/order-items/{id}/photos` - Список фото предмета
- `GET /api/photos/{id}` - Конкретне фото
- `DELETE /api/photos/{id}` - Видалення фото

### Цифрові підписи

- `POST /api/documents/{id}/signatures` - Збереження підпису
- `GET /api/documents/{id}/signatures` - Підписи документа
- `POST /api/signatures/{id}/verify` - Верифікація підпису

## Валідація

### Бізнес-валідація

1. **Розмір файлів**: Максимум 5MB для фото, 10MB для документів
2. **Формати файлів**: Тільки дозволені MIME типи
3. **Кількість фото**: Максимум 5 фото на предмет
4. **Підписи**: Валідний Base64 формат
5. **QR-коди**: Коректний формат даних

### Технічна валідація

- Валідація MIME типів
- Перевірка розміру файлів
- Антивірусна перевірка завантажуваних файлів

## Інтеграція з іншими доменами

### Order Domain

- Генерація квитанцій для замовлень
- Фотодокументація предметів

### Client Domain

- Інформація про клієнта в документах
- Підписи клієнтів

### Branch Domain

- Інформація про філію в квитанціях
- Контактні дані філії

## Тестування

### Unit Tests

- Генерація PDF документів
- QR-код функціональність
- Обробка зображень

### Integration Tests

- Файлові операції
- API endpoints
- Зберігання в базі даних

## Технічні деталі

### Файлове зберігання

```yaml
storage:
  documents: /var/aksi/documents/
  photos: /var/aksi/photos/
  qr-codes: /var/aksi/qr-codes/
  thumbnails: /var/aksi/thumbnails/
```

### Індекси БД

```sql
CREATE INDEX idx_document_entity ON documents(related_entity_id, type);
CREATE INDEX idx_document_number ON documents(document_number);
CREATE INDEX idx_receipt_order ON receipts(order_id);
CREATE INDEX idx_photo_order_item ON photos(order_item_id);
CREATE INDEX idx_signature_document ON digital_signatures(document_id);
```

### Безпека

- Контроль доступу до файлів
- Шифрування чутливих документів
- Аудит доступу до документів
- Цифрові підписи для цілісності

### Бекап та архівування

- Регулярне резервне копіювання
- Архівування старих документів
- Стиснення великих файлів
- Політики зберігання
