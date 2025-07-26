# Client Domain Architecture

## Огляд

Client Domain відповідає за управління клієнтами хімчистки, їх контактною інформацією, адресами, способами зв'язку та статистикою замовлень. Домен забезпечує швидкий пошук клієнтів та автоматичний розрахунок VIP статусу.

## Структура пакетів

```
com.aksi.domain.client/
├── entity/
│   └── ClientEntity.java            # JPA entity клієнта
├── repository/
│   └── ClientRepository.java        # Репозиторій для роботи з БД
├── service/
│   ├── ClientService.java           # Основний сервіс для бізнес-логіки
│   └── ClientSearchService.java     # Сервіс пошуку клієнтів
├── mapper/
│   └── ClientMapper.java            # MapStruct mapper для DTO
├── controller/
│   ├── ClientController.java        # REST контролер для CRUD операцій
│   └── ClientSearchController.java  # Контролер для пошуку
├── util/
│   └── ClientUtils.java             # Утилітні методи для клієнтів
└── exception/
    ├── ClientNotFoundException.java      # Клієнт не знайдений
    ├── DuplicateClientException.java     # Клієнт з таким телефоном вже існує
    └── ClientExceptionHandler.java       # Обробник винятків
```

## Компоненти

### 1. ClientEntity

```java
@Entity
@Table(name = "clients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClientEntity extends BaseEntity {
    
    @Column(nullable = false, length = 50)
    private String firstName;
    
    @Column(nullable = false, length = 50)
    private String lastName;
    
    @Column(unique = true, nullable = false, length = 20)
    private String phone;
    
    @Column(length = 100)
    private String email;
    
    @Embedded
    private Address address;
    
    @ElementCollection
    @CollectionTable(name = "client_communication_methods", 
                     joinColumns = @JoinColumn(name = "client_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "method")
    private Set<CommunicationMethod> communicationMethods = new HashSet<>();
    
    @Column(length = 20)
    @Enumerated(EnumType.STRING)
    private ClientSourceType sourceType;
    
    @Column(length = 100)
    private String sourceOther;
    
    @Column
    private UUID preferredBranchId;
    
    // Статистика (розраховується автоматично)
    @Column(nullable = false)
    private Integer orderCount = 0;
    
    @Column(nullable = false)
    private BigDecimal totalSpent = BigDecimal.ZERO;
    
    @Column
    private LocalDate lastOrderDate;
    
    // VIP статус розраховується динамічно
    @Transient
    public boolean isVip() {
        return orderCount >= 10 || totalSpent.compareTo(new BigDecimal("5000")) >= 0;
    }
}
```

### 2. Address Embeddable

```java
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Address {
    
    @Column(length = 200)
    private String street;
    
    @Column(length = 100)
    private String city;
    
    @Column(length = 100)
    private String region;
    
    @Column(length = 5)
    private String postalCode;
    
    @Column(length = 100)
    private String country = "Україна";
}
```

### 3. Enums

```java
public enum CommunicationMethod {
    PHONE,  // Телефонний дзвінок
    SMS,    // SMS повідомлення
    VIBER   // Viber месенджер
}

public enum ClientSourceType {
    INSTAGRAM,      // Соціальна мережа Instagram
    GOOGLE,         // Google пошук/реклама
    REFERRAL,       // Рекомендації від інших клієнтів
    OTHER          // Інше (з полем sourceOther для деталей)
}
```

### 4. ClientService

Основні методи для мінімально необхідного функціоналу:

```java
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ClientService {
    
    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;
    
    // Створення нового клієнта
    public ClientResponse createClient(CreateClientRequest request) {
        // Перевірка унікальності телефону
        // Нормалізація телефону
        // Створення та збереження клієнта
    }
    
    // Отримання клієнта по ID
    public ClientResponse getClientById(UUID id) {
        // Пошук та повернення клієнта
    }
    
    // Оновлення даних клієнта
    public ClientResponse updateClient(UUID id, UpdateClientRequest request) {
        // Оновлення та збереження змін
    }
    
    // Отримання списку всіх клієнтів
    public ClientListResponse getClients() {
        // Повернення списку з базовою інформацією
    }
    
    // Оновлення статистики клієнта (викликається з Order домену)
    public void updateClientStatistics(UUID clientId, BigDecimal orderAmount) {
        // Інкремент orderCount
        // Додавання до totalSpent
        // Оновлення lastOrderDate
    }
}
```

### 5. ClientSearchService

Сервіс для швидкого пошуку з автозаповненням:

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class ClientSearchService {
    
    private final ClientRepository clientRepository;
    
    public ClientSearchResponse searchClients(String query, Integer limit) {
        // Нормалізація пошукового запиту
        // Пошук по firstName, lastName, phone, email
        // Підсвітка знайдених фрагментів
        // Обмеження результатів по limit
    }
}
```

### 6. ClientRepository

Spring Data JPA репозиторій з мінімально необхідними запитами:

```java
@Repository
public interface ClientRepository extends JpaRepository<ClientEntity, UUID> {
    
    Optional<ClientEntity> findByPhone(String phone);
    
    boolean existsByPhone(String phone);
    
    // Пошук для автозаповнення (case insensitive)
    @Query("""
        SELECT c FROM ClientEntity c 
        WHERE LOWER(c.firstName) LIKE LOWER(CONCAT('%', :query, '%'))
           OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :query, '%'))
           OR c.phone LIKE CONCAT('%', :query, '%')
           OR LOWER(c.email) LIKE LOWER(CONCAT('%', :query, '%'))
        ORDER BY c.lastName, c.firstName
        """)
    List<ClientEntity> searchClients(@Param("query") String query, Pageable pageable);
    
    // Оновлення статистики
    @Modifying
    @Query("""
        UPDATE ClientEntity c 
        SET c.orderCount = c.orderCount + 1,
            c.totalSpent = c.totalSpent + :amount,
            c.lastOrderDate = :orderDate
        WHERE c.id = :clientId
        """)
    void updateStatistics(@Param("clientId") UUID clientId, 
                         @Param("amount") BigDecimal amount,
                         @Param("orderDate") LocalDate orderDate);
}
```

### 7. ClientMapper

MapStruct маппер для конвертації між Entity та DTO:

```java
@Mapper(componentModel = "spring", 
        imports = {UUID.class},
        unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface ClientMapper {
    
    @Mapping(target = "isVip", expression = "java(entity.isVip())")
    ClientResponse toResponse(ClientEntity entity);
    
    @Mapping(target = "orderCount", constant = "0")
    @Mapping(target = "totalSpent", constant = "0")
    @Mapping(target = "lastOrderDate", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    ClientEntity toEntity(CreateClientRequest request);
    
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "orderCount", ignore = true)
    @Mapping(target = "totalSpent", ignore = true)
    @Mapping(target = "lastOrderDate", ignore = true)
    void updateEntityFromRequest(@MappingTarget ClientEntity entity, UpdateClientRequest request);
    
    List<ClientResponse> toResponseList(List<ClientEntity> entities);
    
    @Mapping(target = "highlightedText", ignore = true)
    ClientSearchResult toSearchResult(ClientEntity entity);
}
```

### 8. ClientUtils

Утилітні методи для роботи з клієнтами:

```java
@UtilityClass
public class ClientUtils {
    
    // Нормалізація телефону (видалення пробілів, дужок, дефісів)
    public static String normalizePhone(String phone) {
        if (phone == null) return null;
        return phone.replaceAll("[\\s\\-\\(\\)]", "");
    }
    
    // Форматування телефону для відображення
    public static String formatPhone(String phone) {
        if (phone == null || phone.length() != 13) return phone;
        // +380 (50) 123-45-67
        return String.format("%s (%s) %s-%s-%s",
            phone.substring(0, 4),
            phone.substring(4, 6),
            phone.substring(6, 9),
            phone.substring(9, 11),
            phone.substring(11, 13));
    }
    
    // Підсвітка знайдених фрагментів для пошуку
    public static String highlightMatch(String text, String query) {
        if (text == null || query == null) return text;
        String regex = "(?i)(" + Pattern.quote(query) + ")";
        return text.replaceAll(regex, "<mark>$1</mark>");
    }
    
    // Створення повного імені клієнта
    public static String getFullName(ClientEntity client) {
        return client.getLastName() + " " + client.getFirstName();
    }
}
```

### 9. Controllers

```java
@RestController
@RequiredArgsConstructor
@Slf4j
public class ClientController implements ClientsApi {
    
    private final ClientService clientService;
    
    @Override
    public ResponseEntity<ClientResponse> createClient(CreateClientRequest request) {
        log.info("Creating new client: {} {}", request.getLastName(), request.getFirstName());
        ClientResponse response = clientService.createClient(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    // Інші методи...
}

@RestController
@RequiredArgsConstructor
@Slf4j
public class ClientSearchController implements ClientSearchApi {
    
    private final ClientSearchService searchService;
    
    @Override
    public ResponseEntity<ClientSearchResponse> searchClients(String query, Integer limit) {
        log.debug("Searching clients with query: {}, limit: {}", query, limit);
        ClientSearchResponse response = searchService.searchClients(query, limit);
        return ResponseEntity.ok(response);
    }
}
```

## База даних

### Міграції Liquibase

1. **001-create-clients-table.yaml** - створення основної таблиці clients
2. **002-create-client-communication-methods-table.yaml** - таблиця для способів зв'язку

### Індекси

- Унікальний індекс на `phone`
- Індекс на `lastName, firstName` для сортування
- Композитний індекс для пошуку: `firstName, lastName, phone, email`

## Інтеграція з іншими доменами

1. **Order Domain** - оновлення статистики клієнта при створенні замовлення
2. **Branch Domain** - зв'язок через preferredBranchId

## Валідація

1. **Телефон**: 
   - Український формат (+380...)
   - Унікальність в системі
   - Підтримка різних варіантів написання

2. **Імена**:
   - Мінімум 2, максимум 50 символів
   - Обов'язкові поля

3. **Email**:
   - Стандартна email валідація
   - Опціональне поле

4. **Поштовий індекс**:
   - 5 цифр для України

## Обробка помилок

1. **ClientNotFoundException** - 404 Not Found
2. **DuplicateClientException** - 409 Conflict (телефон вже існує)
3. **ValidationException** - 400 Bad Request

## Особливості реалізації

1. **VIP статус** - розраховується динамічно, не зберігається в БД
2. **Нормалізація телефону** - автоматична при збереженні
3. **Пошук** - case insensitive з підсвіткою результатів
4. **Статистика** - оновлюється автоматично з Order домену

## Метрики та моніторинг

1. Кількість нових клієнтів за період
2. Конверсія в VIP клієнтів
3. Середня кількість замовлень на клієнта
4. Час відповіді на пошукові запити

## Майбутні покращення

1. Об'єднання дублікатів клієнтів
2. Історія змін контактних даних
3. Нотатки та коментарі до клієнтів
4. Дні народження та інші важливі дати
5. Інтеграція з месенджерами для автоматичних повідомлень