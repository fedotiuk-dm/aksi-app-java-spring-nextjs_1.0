# Branch Domain - Управління філіями

## Огляд домену

Branch Domain відповідає за управління філіями (пунктами прийому) хімчистки, включаючи інформацію про розташування, графік роботи, контактні дані та генерацію унікальних номерів квитанцій.

## Бізнес-логіка

### Функціональність

- **Управління філіями** - створення, редагування, деактивація філій
- **Інформація про розташування** - адреса, координати, контакти
- **Графік роботи** - робочі дні та години для кожної філії
- **Генерація номерів** - унікальні номери квитанцій з префіксом філії
- **Статистика філій** - кількість замовлень, доходи за періоди

### Бізнес-правила

1. **Унікальні коди**: Кожна філія має унікальний код для ідентифікації
2. **Номери квитанцій**: Формат - {КОД_ФІЛІЇ}-{РРРР}-{NNNNNN} (рік-номер)
3. **Графік роботи**: Різний для кожної філії, з можливістю святкових днів
4. **Активність**: Філія може бути тимчасово деактивована
5. **Контакти**: Обов'язковий телефон та адреса

## Доменна модель

### Entities

#### Branch

```java
@Entity
public class Branch {
    private Long id;
    private String code;                    // Унікальний код (наприклад, "AKSI-01")
    private String name;                    // Назва філії
    private String description;             // Опис розташування
    private Address address;                // Адреса
    private ContactInfo contactInfo;        // Контактна інформація
    private Coordinates coordinates;        // GPS координати
    private boolean isActive;               // Активна філія
    private WorkingSchedule workingSchedule; // Графік роботи
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long receiptCounter;            // Лічильник квитанцій
}
```

#### WorkingSchedule

```java
@Entity
public class WorkingSchedule {
    private Long id;
    private Long branchId;
    private List<WorkingDay> workingDays;   // Робочі дні тижня
    private List<Holiday> holidays;         // Святкові дні
    private String timezone;                // Часовий пояс
}
```

#### WorkingDay

```java
@Entity
public class WorkingDay {
    private Long id;
    private Long scheduleId;
    private DayOfWeek dayOfWeek;           // День тижня
    private LocalTime openTime;            // Час відкриття
    private LocalTime closeTime;           // Час закриття
    private boolean isWorkingDay;          // Робочий чи вихідний
    private String notes;                  // Примітки
}
```

### Value Objects

#### Address

```java
@Embeddable
public class Address {
    private String street;                 // Вулиця, будинок
    private String city;                   // Місто
    private String region;                 // Область/регіон
    private String postalCode;             // Поштовий індекс
    private String country;                // Країна
}
```

#### ContactInfo

```java
@Embeddable
public class ContactInfo {
    private String phone;                  // Основний телефон
    private String alternativePhone;       // Додатковий телефон
    private String email;                  // Email філії
    private String managerName;            // Ім'я менеджера
}
```

#### Coordinates

```java
@Embeddable
public class Coordinates {
    private Double latitude;               // Широта
    private Double longitude;              // Довгота
    private String mapUrl;                 // Посилання на карту
}
```

### Enums

#### BranchStatus

```java
public enum BranchStatus {
    ACTIVE("Активна"),
    INACTIVE("Неактивна"),
    TEMPORARILY_CLOSED("Тимчасово закрита"),
    UNDER_RENOVATION("На ремонті");
}
```

## Сервіси

### BranchService

```java
@Service
public class BranchService {

    // CRUD операції
    Branch createBranch(CreateBranchRequest request);
    Branch updateBranch(Long id, UpdateBranchRequest request);
    Branch getBranchById(Long id);
    List<Branch> getAllBranches();
    List<Branch> getActiveBranches();
    void deactivateBranch(Long id);

    // Пошук
    List<Branch> findBranchesByCity(String city);
    Optional<Branch> findBranchByCode(String code);
    List<Branch> findNearbyBranches(Double latitude, Double longitude, Double radiusKm);

    // Бізнес-логіка
    boolean isBranchOpen(Long branchId, LocalDateTime dateTime);
    String getNextWorkingDay(Long branchId, LocalDate currentDate);
}
```

### ReceiptNumberService

```java
@Service
public class ReceiptNumberService {

    // Генерація номерів
    String generateReceiptNumber(Long branchId);
    String generateReceiptNumber(String branchCode);

    // Валідація
    boolean isValidReceiptNumber(String receiptNumber);
    BranchReceiptInfo parseReceiptNumber(String receiptNumber);

    // Статистика
    Long getReceiptCount(Long branchId, int year);
    String getLastReceiptNumber(Long branchId);
}
```

### BranchStatisticsService

```java
@Service
public class BranchStatisticsService {

    // Статистика замовлень
    Long getOrderCount(Long branchId, LocalDate startDate, LocalDate endDate);
    BigDecimal getTotalRevenue(Long branchId, LocalDate startDate, LocalDate endDate);

    // Популярні послуги
    List<ServiceStatistic> getPopularServices(Long branchId, LocalDate startDate, LocalDate endDate);

    // Порівняння філій
    List<BranchComparison> compareBranches(LocalDate startDate, LocalDate endDate);

    // Завантажеість
    List<WorkloadStatistic> getBranchWorkload(Long branchId, LocalDate date);
}
```

## Repositories

### BranchRepository

```java
@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {

    List<Branch> findByIsActiveTrue();
    Optional<Branch> findByCode(String code);
    List<Branch> findByAddress_City(String city);

    @Query("SELECT b FROM Branch b WHERE b.isActive = true ORDER BY b.name")
    List<Branch> findActiveBranchesOrderByName();

    // Пошук за координатами
    @Query("SELECT b FROM Branch b WHERE " +
           "6371 * acos(cos(radians(:latitude)) * cos(radians(b.coordinates.latitude)) * " +
           "cos(radians(b.coordinates.longitude) - radians(:longitude)) + " +
           "sin(radians(:latitude)) * sin(radians(b.coordinates.latitude))) <= :radiusKm")
    List<Branch> findBranchesWithinRadius(@Param("latitude") Double latitude,
                                         @Param("longitude") Double longitude,
                                         @Param("radiusKm") Double radiusKm);
}
```

### WorkingScheduleRepository

```java
@Repository
public interface WorkingScheduleRepository extends JpaRepository<WorkingSchedule, Long> {

    Optional<WorkingSchedule> findByBranchId(Long branchId);

    @Query("SELECT wd FROM WorkingDay wd WHERE wd.scheduleId = :scheduleId AND wd.dayOfWeek = :dayOfWeek")
    Optional<WorkingDay> findWorkingDay(@Param("scheduleId") Long scheduleId,
                                       @Param("dayOfWeek") DayOfWeek dayOfWeek);
}
```

## DTOs

### Request DTOs

#### CreateBranchRequest

```java
public class CreateBranchRequest {
    @NotBlank
    @Size(min = 3, max = 10)
    private String code;

    @NotBlank
    private String name;

    private String description;

    @NotNull
    private AddressDto address;

    @NotNull
    private ContactInfoDto contactInfo;

    private CoordinatesDto coordinates;
    private WorkingScheduleDto workingSchedule;
}
```

#### UpdateBranchRequest

```java
public class UpdateBranchRequest {
    private String name;
    private String description;
    private AddressDto address;
    private ContactInfoDto contactInfo;
    private CoordinatesDto coordinates;
    private WorkingScheduleDto workingSchedule;
    private Boolean isActive;
}
```

#### WorkingScheduleDto

```java
public class WorkingScheduleDto {
    private List<WorkingDayDto> workingDays;
    private List<HolidayDto> holidays;
    private String timezone;
}
```

### Response DTOs

#### BranchResponse

```java
public class BranchResponse {
    private Long id;
    private String code;
    private String name;
    private String description;
    private AddressDto address;
    private ContactInfoDto contactInfo;
    private CoordinatesDto coordinates;
    private boolean isActive;
    private WorkingScheduleDto workingSchedule;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private BranchStatusInfo statusInfo;
}
```

#### BranchStatusInfo

```java
public class BranchStatusInfo {
    private boolean isCurrentlyOpen;
    private String nextOpenTime;
    private String currentStatus;
    private Long todayOrderCount;
    private String lastReceiptNumber;
}
```

#### BranchReceiptInfo

```java
public class BranchReceiptInfo {
    private String branchCode;
    private int year;
    private int receiptNumber;
    private boolean isValid;
}
```

## API Endpoints

### Управління філіями

- `GET /api/branches` - Всі філії
- `GET /api/branches/active` - Активні філії
- `GET /api/branches/{id}` - Філія за ID
- `POST /api/branches` - Створення філії
- `PUT /api/branches/{id}` - Оновлення філії
- `DELETE /api/branches/{id}` - Видалення філії

### Пошук філій

- `GET /api/branches/search?city={city}` - Пошук за містом
- `GET /api/branches/code/{code}` - Філія за кодом
- `GET /api/branches/nearby?lat={lat}&lng={lng}&radius={km}` - Найближчі філії

### Графік роботи

- `GET /api/branches/{id}/schedule` - Графік роботи
- `PUT /api/branches/{id}/schedule` - Оновлення графіку
- `GET /api/branches/{id}/status` - Поточний статус (відкрита/закрита)

### Номери квитанцій

- `POST /api/branches/{id}/receipt-number` - Генерація нового номера
- `GET /api/branches/{id}/receipt-count` - Кількість квитанцій
- `POST /api/receipt-numbers/validate` - Валідація номера

### Статистика

- `GET /api/branches/{id}/statistics` - Статистика філії
- `GET /api/branches/{id}/orders/count` - Кількість замовлень
- `GET /api/branches/{id}/revenue` - Доходи філії
- `GET /api/branches/comparison` - Порівняння філій

## Валідація

### Бізнес-валідація

1. **Унікальність коду**: Код філії повинен бути унікальним
2. **Формат коду**: Код повинен відповідати шаблону (латинські літери + цифри)
3. **Графік роботи**: Час відкриття повинен бути раніше за час закриття
4. **Координати**: Географічні координати повинні бути в коректному діапазоні
5. **Контакти**: Телефон та email повинні мати правильний формат

### Технічна валідація

- Bean Validation для DTOs
- Кастомні валідатори для коду філії
- Валідація координат та часових зон

## Інтеграція з іншими доменами

### Order Domain

- Прив'язка замовлень до філій
- Генерація номерів квитанцій

### Client Domain

- Інформація про філії для клієнтів
- Контактні дані для зв'язку

### Document Domain

- Інформація про філію в квитанціях
- Контакти та адреса в документах

## Тестування

### Unit Tests

- BranchService бізнес-логіка
- ReceiptNumberService генерація номерів
- Валідація бізнес-правил

### Integration Tests

- API endpoints
- База даних операції
- Генерація унікальних номерів

## Технічні деталі

### Індекси БД

```sql
CREATE UNIQUE INDEX idx_branch_code ON branches(code);
CREATE INDEX idx_branch_active ON branches(is_active);
CREATE INDEX idx_branch_city ON branches(address_city);
CREATE INDEX idx_branch_coordinates ON branches(latitude, longitude);
CREATE INDEX idx_working_schedule_branch ON working_schedules(branch_id);
```

### Кешування

- Кешування списку активних філій
- Кешування графіків роботи
- Кешування лічильників квитанцій

### Безпека

- Захист адміністративних операцій
- Логування змін в філіях
- Аудит генерації номерів квитанцій

### Моніторинг

- Відстеження завантаженості філій
- Алерти при проблемах з генерацією номерів
- Статистика використання API
