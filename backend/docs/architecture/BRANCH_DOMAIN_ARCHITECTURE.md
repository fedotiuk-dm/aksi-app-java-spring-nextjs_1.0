# Архітектурний документ для Branch домену

## Огляд

Branch домен відповідає за управління філіями хімчистки в системі AKSI. Домен реалізується за тим же архітектурним підходом, що й Auth та User домени, забезпечуючи консистентність та підтримуваність коду.

## Функціональні вимоги

### 1. Основний функціонал

- **Управління філіями**: CRUD операції для філій (тільки для адміністраторів)
- **Робочі графіки**: Налаштування графіків роботи для кожної філії (7 днів тижня)
- **Відображення в системі**: Вибір філії при створенні замовлень
- **Префікси квитанцій**: Унікальні префікси для генерації номерів квитанцій
- **Контактна інформація**: Зберігання адреси, телефону, email

### 2. Бізнес-правила

- Префікс квитанції має бути унікальним в системі
- Кожна філія має графік роботи на всі 7 днів тижня
- При створенні користувача можна прив'язати до філії через `branch_id`
- Філії можна деактивувати, але не видаляти
- Тільки адміністратори можуть управляти філіями

## Архітектурна структура

### 1. Пакети та організація коду

```
com.aksi.domain.branch/
├── entity/
│   ├── BranchEntity.java
│   ├── WorkingScheduleEntity.java
│   └── enums/
│       └── DayOfWeek.java
├── exception/
│   ├── BranchExceptionHandler.java
│   ├── BranchNotFoundException.java
│   ├── DuplicateReceiptPrefixException.java
│   └── InvalidWorkingScheduleException.java
├── mapper/
│   ├── BranchMapper.java
│   └── WorkingScheduleMapper.java
├── repository/
│   ├── BranchRepository.java
│   └── WorkingScheduleRepository.java
├── service/
│   ├── BranchService.java
│   ├── WorkingScheduleService.java
│   └── ReceiptNumberService.java
├── validation/
│   ├── ReceiptPrefixValidator.java
│   └── WorkingTimeValidator.java
└── util/
    └── BranchUtils.java
```

### 2. Database Schema (Liquibase міграції)

#### 2.1. Таблиця `branches`

```sql
-- 001-create-branches-table.yaml
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    receipt_prefix VARCHAR(20) NOT NULL UNIQUE,
    
    -- Contact Info (embedded)
    phone VARCHAR(20),
    email VARCHAR(100),
    
    -- Address (embedded)
    street VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    postal_code VARCHAR(5),
    country VARCHAR(100) DEFAULT 'Україна',
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_branches_active ON branches(is_active);
CREATE INDEX idx_branches_receipt_prefix ON branches(receipt_prefix);

-- Constraints
ALTER TABLE branches ADD CONSTRAINT chk_receipt_prefix 
    CHECK (receipt_prefix ~ '^[A-Z]+(-[A-Z0-9]+)?$');
ALTER TABLE branches ADD CONSTRAINT chk_postal_code 
    CHECK (postal_code ~ '^\d{5}$');
```

#### 2.2. Таблиця `working_schedules`

```sql
-- 002-create-working-schedules-table.yaml
CREATE TABLE working_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    day_of_week VARCHAR(10) NOT NULL,
    is_working_day BOOLEAN NOT NULL DEFAULT false,
    open_time TIME,
    close_time TIME,
    
    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE(branch_id, day_of_week),
    CHECK (day_of_week IN ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY')),
    CHECK (NOT is_working_day OR (open_time IS NOT NULL AND close_time IS NOT NULL))
);

-- Indexes
CREATE INDEX idx_working_schedules_branch ON working_schedules(branch_id);
```

### 3. Entity Classes

#### 3.1. BranchEntity

```java
@Entity
@Table(name = "branches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BranchEntity extends BaseEntity {

    @Column(name = "name", nullable = false, length = ValidationConstants.Branch.NAME_MAX_LENGTH)
    @NotBlank(message = ValidationConstants.Messages.BRANCH_NAME_CANNOT_BE_BLANK)
    @Size(min = ValidationConstants.Branch.NAME_MIN_LENGTH, 
          max = ValidationConstants.Branch.NAME_MAX_LENGTH,
          message = ValidationConstants.Messages.BRANCH_NAME_SIZE_MESSAGE)
    private String name;

    @Column(name = "receipt_prefix", nullable = false, unique = true, 
            length = ValidationConstants.Branch.RECEIPT_PREFIX_MAX_LENGTH)
    @NotBlank(message = ValidationConstants.Messages.RECEIPT_PREFIX_CANNOT_BE_BLANK)
    @Pattern(regexp = ValidationConstants.Patterns.RECEIPT_PREFIX_PATTERN,
             message = ValidationConstants.Messages.RECEIPT_PREFIX_INVALID_FORMAT)
    private String receiptPrefix;

    // Contact Info (embedded)
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "phone", column = @Column(name = "phone")),
        @AttributeOverride(name = "email", column = @Column(name = "email"))
    })
    private ContactInfo contactInfo;

    // Address (embedded)
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "street", column = @Column(name = "street")),
        @AttributeOverride(name = "city", column = @Column(name = "city")),
        @AttributeOverride(name = "region", column = @Column(name = "region")),
        @AttributeOverride(name = "postalCode", column = @Column(name = "postal_code")),
        @AttributeOverride(name = "country", column = @Column(name = "country"))
    })
    private Address address;

    @Column(name = "is_active", nullable = false)
    private boolean active;

    // Lazy-loaded working schedules
    @OneToMany(mappedBy = "branch", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<WorkingScheduleEntity> workingSchedules = new HashSet<>();
}
```

#### 3.2. WorkingScheduleEntity

```java
@Entity
@Table(name = "working_schedules",
       uniqueConstraints = @UniqueConstraint(columnNames = {"branch_id", "day_of_week"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkingScheduleEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private BranchEntity branch;

    @Column(name = "day_of_week", nullable = false)
    @Enumerated(EnumType.STRING)
    private DayOfWeek dayOfWeek;

    @Column(name = "is_working_day", nullable = false)
    private boolean workingDay;

    @Column(name = "open_time")
    private LocalTime openTime;

    @Column(name = "close_time")
    private LocalTime closeTime;
}
```

#### 3.3. Embedded Classes

```java
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContactInfo {
    
    @Pattern(regexp = ValidationConstants.Patterns.PHONE_PATTERN,
             message = ValidationConstants.Messages.PHONE_INVALID_FORMAT)
    private String phone;
    
    @Email(message = ValidationConstants.Messages.EMAIL_SHOULD_BE_VALID)
    @Size(max = ValidationConstants.Branch.EMAIL_MAX_LENGTH)
    private String email;
}

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Address {
    
    @NotBlank(message = ValidationConstants.Messages.STREET_CANNOT_BE_BLANK)
    @Size(max = ValidationConstants.Branch.STREET_MAX_LENGTH)
    private String street;
    
    @NotBlank(message = ValidationConstants.Messages.CITY_CANNOT_BE_BLANK)
    @Size(max = ValidationConstants.Branch.CITY_MAX_LENGTH)
    private String city;
    
    @Size(max = ValidationConstants.Branch.REGION_MAX_LENGTH)
    private String region;
    
    @Pattern(regexp = ValidationConstants.Patterns.POSTAL_CODE_PATTERN)
    private String postalCode;
    
    @Builder.Default
    private String country = "Україна";
}
```

### 4. Repository Interfaces

#### 4.1. BranchRepository

```java
@Repository
public interface BranchRepository extends JpaRepository<BranchEntity, UUID> {

    /** Find all active branches */
    List<BranchEntity> findByActiveTrue();
    
    /** Find branch by receipt prefix */
    Optional<BranchEntity> findByReceiptPrefix(String receiptPrefix);
    
    /** Check if receipt prefix exists */
    boolean existsByReceiptPrefix(String receiptPrefix);
    
    /** Find branches by active status */
    Page<BranchEntity> findByActive(boolean active, Pageable pageable);
    
    /** Find branches with filters */
    @Query("SELECT b FROM BranchEntity b WHERE " +
           "(:includeInactive = true OR b.active = true) AND " +
           "(:searchTerm IS NULL OR LOWER(b.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<BranchEntity> findWithFilters(@Param("searchTerm") String searchTerm,
                                      @Param("includeInactive") boolean includeInactive,
                                      Pageable pageable);
}
```

#### 4.2. WorkingScheduleRepository

```java
@Repository
public interface WorkingScheduleRepository extends JpaRepository<WorkingScheduleEntity, UUID> {

    /** Find all working schedules for branch */
    List<WorkingScheduleEntity> findByBranchIdOrderByDayOfWeek(UUID branchId);
    
    /** Find working schedule for specific day */
    Optional<WorkingScheduleEntity> findByBranchIdAndDayOfWeek(UUID branchId, DayOfWeek dayOfWeek);
    
    /** Delete all working schedules for branch */
    @Modifying
    @Query("DELETE FROM WorkingScheduleEntity ws WHERE ws.branch.id = :branchId")
    void deleteByBranchId(@Param("branchId") UUID branchId);
    
    /** Find working days for branch */
    @Query("SELECT ws FROM WorkingScheduleEntity ws " +
           "WHERE ws.branch.id = :branchId AND ws.workingDay = true " +
           "ORDER BY ws.dayOfWeek")
    List<WorkingScheduleEntity> findWorkingDaysByBranchId(@Param("branchId") UUID branchId);
}
```

### 5. Service Classes

#### 5.1. BranchService

```java
@Service
@Transactional
@Slf4j
public class BranchService {

    private final BranchRepository branchRepository;
    private final WorkingScheduleService workingScheduleService;
    private final BranchMapper branchMapper;

    @Transactional(readOnly = true)
    public Page<BranchResponse> getAllBranches(String searchTerm, boolean includeInactive, Pageable pageable) {
        log.info(ValidationConstants.Messages.GETTING_BRANCHES_LIST, 
                 searchTerm, includeInactive, pageable.getPageNumber(), pageable.getPageSize());
        
        Page<BranchEntity> branches = branchRepository.findWithFilters(searchTerm, includeInactive, pageable);
        return branches.map(branchMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public BranchResponse getBranchById(UUID id) {
        log.info(ValidationConstants.Messages.GETTING_BRANCH_BY_ID, id);
        
        BranchEntity branch = branchRepository.findById(id)
            .orElseThrow(() -> new BranchNotFoundException(
                String.format(ValidationConstants.Messages.BRANCH_NOT_FOUND, id)));
        
        return branchMapper.toResponse(branch);
    }

    public BranchResponse createBranch(CreateBranchRequest request) {
        log.info(ValidationConstants.Messages.CREATING_BRANCH, request.getName());
        
        // Check receipt prefix uniqueness
        if (branchRepository.existsByReceiptPrefix(request.getReceiptPrefix())) {
            throw new DuplicateReceiptPrefixException(
                String.format(ValidationConstants.Messages.RECEIPT_PREFIX_EXISTS, request.getReceiptPrefix()));
        }
        
        BranchEntity branch = branchMapper.toEntity(request);
        branch = branchRepository.save(branch);
        
        // Create working schedule if provided
        if (request.getWorkingSchedule() != null) {
            workingScheduleService.createOrUpdateWorkingSchedule(branch.getId(), request.getWorkingSchedule());
        }
        
        return branchMapper.toResponse(branch);
    }

    public BranchResponse updateBranch(UUID id, UpdateBranchRequest request) {
        log.info(ValidationConstants.Messages.UPDATING_BRANCH, id);
        
        BranchEntity branch = branchRepository.findById(id)
            .orElseThrow(() -> new BranchNotFoundException(
                String.format(ValidationConstants.Messages.BRANCH_NOT_FOUND, id)));
        
        branchMapper.updateEntity(branch, request);
        branch = branchRepository.save(branch);
        
        // Update working schedule if provided
        if (request.getWorkingSchedule() != null) {
            workingScheduleService.createOrUpdateWorkingSchedule(id, request.getWorkingSchedule());
        }
        
        return branchMapper.toResponse(branch);
    }
}
```

#### 5.2. WorkingScheduleService

```java
@Service
@Transactional
@Slf4j
public class WorkingScheduleService {

    private final WorkingScheduleRepository workingScheduleRepository;
    private final WorkingScheduleMapper workingScheduleMapper;

    public void createOrUpdateWorkingSchedule(UUID branchId, WorkingScheduleRequest request) {
        log.info(ValidationConstants.Messages.UPDATING_WORKING_SCHEDULE, branchId);
        
        // Validate that all 7 days are provided
        validateWorkingScheduleRequest(request);
        
        // Delete existing schedules
        workingScheduleRepository.deleteByBranchId(branchId);
        
        // Create new schedules
        List<WorkingScheduleEntity> schedules = request.getWorkingDays().stream()
            .map(dayRequest -> workingScheduleMapper.toEntity(branchId, dayRequest))
            .toList();
        
        workingScheduleRepository.saveAll(schedules);
    }

    @Transactional(readOnly = true)
    public WorkingScheduleResponse getWorkingSchedule(UUID branchId) {
        List<WorkingScheduleEntity> schedules = workingScheduleRepository
            .findByBranchIdOrderByDayOfWeek(branchId);
        
        return workingScheduleMapper.toResponse(schedules);
    }

    private void validateWorkingScheduleRequest(WorkingScheduleRequest request) {
        if (request.getWorkingDays().size() != 7) {
            throw new InvalidWorkingScheduleException(
                ValidationConstants.Messages.WORKING_SCHEDULE_MUST_HAVE_7_DAYS);
        }
        
        Set<DayOfWeek> providedDays = request.getWorkingDays().stream()
            .map(WorkingDayRequest::getDayOfWeek)
            .collect(Collectors.toSet());
        
        if (providedDays.size() != 7) {
            throw new InvalidWorkingScheduleException(
                ValidationConstants.Messages.WORKING_SCHEDULE_DUPLICATE_DAYS);
        }
    }
}
```

### 6. Mapper Classes (MapStruct)

#### 6.1. BranchMapper

```java
@Mapper(componentModel = "spring", uses = {WorkingScheduleMapper.class})
public interface BranchMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", constant = "true")
    @Mapping(target = "workingSchedules", ignore = true)
    @Mapping(target = "contactInfo.phone", source = "phone")
    @Mapping(target = "contactInfo.email", source = "email")
    BranchEntity toEntity(CreateBranchRequest request);

    BranchResponse toResponse(BranchEntity entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "receiptPrefix", ignore = true) // Cannot change prefix
    @Mapping(target = "workingSchedules", ignore = true)
    void updateEntity(@MappingTarget BranchEntity entity, UpdateBranchRequest request);
}
```

### 7. Exception Handling

```java
@RestControllerAdvice
@Slf4j
public class BranchExceptionHandler {

    @ExceptionHandler(BranchNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleBranchNotFound(BranchNotFoundException ex) {
        log.warn(ValidationConstants.Exceptions.BRANCH_NOT_FOUND_LOG, ex.getMessage());
        return ErrorResponse.builder()
            .message(ex.getMessage())
            .code(ValidationConstants.Exceptions.BRANCH_NOT_FOUND_CODE)
            .timestamp(Instant.now())
            .build();
    }

    @ExceptionHandler(DuplicateReceiptPrefixException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleDuplicateReceiptPrefix(DuplicateReceiptPrefixException ex) {
        log.warn(ValidationConstants.Exceptions.DUPLICATE_RECEIPT_PREFIX_LOG, ex.getMessage());
        return ErrorResponse.builder()
            .message(ex.getMessage())
            .code(ValidationConstants.Exceptions.DUPLICATE_RECEIPT_PREFIX_CODE)
            .timestamp(Instant.now())
            .build();
    }
}
```

### 8. Validation Constants

```java
// Додати до ValidationConstants.java
public static final class Branch {
    public static final int NAME_MIN_LENGTH = 3;
    public static final int NAME_MAX_LENGTH = 100;
    public static final int RECEIPT_PREFIX_MIN_LENGTH = 3;
    public static final int RECEIPT_PREFIX_MAX_LENGTH = 20;
    public static final int EMAIL_MAX_LENGTH = 100;
    public static final int STREET_MAX_LENGTH = 200;
    public static final int CITY_MAX_LENGTH = 100;
    public static final int REGION_MAX_LENGTH = 100;
}

// Messages для branch
public static final String BRANCH_NAME_CANNOT_BE_BLANK = "Branch name cannot be blank";
public static final String RECEIPT_PREFIX_CANNOT_BE_BLANK = "Receipt prefix cannot be blank";
public static final String RECEIPT_PREFIX_INVALID_FORMAT = "Receipt prefix format is invalid";
public static final String RECEIPT_PREFIX_EXISTS = "Receipt prefix already exists: %s";
public static final String BRANCH_NOT_FOUND = "Branch not found: %s";
public static final String CREATING_BRANCH = "Creating new branch: {}";
public static final String GETTING_BRANCHES_LIST = "Getting branches list - search: {}, includeInactive: {}, page: {}, size: {}";
public static final String GETTING_BRANCH_BY_ID = "Getting branch by ID: {}";
public static final String UPDATING_BRANCH = "Updating branch: {}";
```

## API Endpoints

### 1. Branch Management

- `GET /api/branches` - Список філій (з фільтрацією)
- `POST /api/branches` - Створення філії (ADMIN only)
- `GET /api/branches/{id}` - Деталі філії
- `PATCH /api/branches/{id}` - Оновлення філії (ADMIN only)

### 2. Security

- Всі endpoints потребують автентифікації
- Створення та оновлення філій доступне тільки для ролі ADMIN
- Перегляд філій доступний для всіх авторизованих користувачів

## План реалізації

### Етап 1: Основна структура (1-2 дні)
1. Створити Liquibase міграції для таблиць
2. Створити Entity класи
3. Створити Repository інтерфейси
4. Додати константи валідації

### Етап 2: Бізнес-логіка (1-2 дні)
1. Створити Service класи
2. Створити Mapper класи
3. Створити Exception класи та Handler
4. Написати unit тести

### Етап 3: API та інтеграція (1 день)
1. Згенерувати контролери з OpenAPI
2. Інтеграційні тести
3. Тестування API endpoints

### Етап 4: Інтеграція з іншими доменами (по потребі)
1. Інтеграція з User домену (branch assignment)
2. Підготовка для Order домену (branch selection)

## Ключові принципи

1. **Консистентність**: Той же архітектурний підхід, що й Auth/User домени
2. **OpenAPI First**: Всі API описані в OpenAPI схемах
3. **Валідація**: Багатошарова валідація з константами
4. **Безпека**: Role-based access control
5. **Простота**: Мінімально необхідний функціонал без перевантаження
6. **Розширюваність**: Готовність до інтеграції з Order домену

Цей архітектурний документ забезпечує чітку дорожню карту для реалізації Branch домену з дотриманням існуючих архітектурних принципів та підготовкою до майбутньої інтеграції з системою замовлень.