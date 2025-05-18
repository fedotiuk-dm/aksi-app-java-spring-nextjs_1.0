# Архітектурні принципи DDD (Domain-Driven Design)

Цей документ описує архітектурні принципи проекту "Хімчистка AKSI" відповідно до методології Domain-Driven Design (DDD).

## Основні концепції DDD в проекті

### 1. Поділ на домени

Проект розділено на основні бізнес-домени:

- **Client (Клієнт)** - управління інформацією про клієнтів
- **Order (Замовлення)** - обробка замовлень на хімчистку, включаючи OrderWizard
- **Pricing (Ціноутворення)** - управління прайс-листами та розрахунок вартості
- **Service (Послуга)** - типи послуг та їх характеристики
- **User (Користувач)** - співробітники системи та їх ролі
- **Auth (Автентифікація)** - безпека та авторизація

### 2. Агрегати та кореневі сутності

Кожен домен містить один або більше агрегатів, кожен зі своєю кореневою сутністю:

- **OrderAggregate** з кореневою сутністю `OrderEntity`
- **ClientAggregate** з кореневою сутністю `ClientEntity`

Правила для агрегатів:
- Звертання до агрегату відбувається **тільки** через його кореневу сутність
- Зміна стану дочірніх сутностей агрегату **тільки** через кореневу сутність
- Транзакційна узгодженість забезпечується **в межах одного агрегату**

### 3. Структура пакетів за доменами

```
com.aksi
├── domain
│   ├── client
│   │   ├── entity
│   │   ├── repository
│   │   ├── service
│   │   └── dto
│   ├── order
│   │   ├── entity
│   │   ├── repository
│   │   ├── service
│   │   └── dto
│   ├── pricing
│   │   ├── entity
│   │   ├── repository
│   │   ├── service
│   │   └── dto
│   └── user
│       ├── entity
│       ├── repository
│       ├── service
│       └── dto
├── api
│   ├── ClientsController
│   ├── OrdersController
│   └── ...
├── config
└── util
```

## Стандарти реалізації шарів архітектури

### 1. Сутності (Entity)

**Обов'язкові правила**:
- Ім'я класу: **ЗАВЖДИ** з суфіксом "Entity" (наприклад, `ClientEntity`)
- Інкапсуляція бізнес-логіки, пов'язаної з сутністю
- Валідація в межах сутності
- Використання JPA-анотацій для маппінгу до БД

**Зразок структури**:

```java
@Entity
@Table(name = "clients")
public class ClientEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    // Інші поля сутності
    
    // Бізнес-методи
    public void updateContactInfo(String email, String phone) {
        // валідація та логіка оновлення
    }
}
```

### 2. Репозиторії (Repository)

**Обов'язкові правила**:
- Один репозиторій для одного агрегату
- Використання Spring Data JPA інтерфейсів
- Чітко визначені методи пошуку

**Зразок структури**:

```java
public interface ClientRepository extends JpaRepository<ClientEntity, UUID> {
    Optional<ClientEntity> findByEmail(String email);
    
    @Query("SELECT c FROM ClientEntity c WHERE LOWER(c.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<ClientEntity> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
```

### 3. Сервіси (Service)

**Обов'язкові правила**:
- Інтерфейс без суфікса (наприклад, `ClientService`)
- Реалізація з суфіксом "Impl" (наприклад, `ClientServiceImpl`)
- Містить бізнес-логіку, що охоплює декілька сутностей
- Транзакційний контроль

**Зразок структури**:

```java
public interface ClientService {
    ClientResponse getById(UUID id);
    Page<ClientResponse> search(String keyword, Pageable pageable);
    ClientResponse create(ClientRequest request);
    ClientResponse update(UUID id, ClientRequest request);
    void delete(UUID id);
}

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {
    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;
    
    // Реалізація методів
}
```

### 4. DTO (Data Transfer Objects)

**Обов'язкові правила**:
- Класи запитів з суфіксом "Request" (наприклад, `ClientRequest`)
- Класи відповідей з суфіксом "Response" (наприклад, `ClientResponse`)
- Внутрішні DTO з суфіксом "DTO" (наприклад, `ClientDTO`)
- Валідація запитів за допомогою Jakarta Validation

**Зразок структури**:

```java
public class ClientRequest {
    @NotBlank(message = "Ім'я є обов'язковим")
    private String firstName;
    
    @NotBlank(message = "Прізвище є обов'язковим")
    private String lastName;
    
    @Email(message = "Неправильний формат email")
    private String email;
    
    // Геттери і сеттери
}
```

### 5. Маппери (Mappers)

**Обов'язкові правила**:
- Використання MapStruct
- Чіткі методи конвертації з Entity в DTO і навпаки
- Обробка null-значень

**Зразок структури**:

```java
@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ClientMapper {
    ClientResponse toResponse(ClientEntity entity);
    ClientEntity toEntity(ClientRequest request);
    
    // Інші методи маппінгу
}
```

### 6. Контролери API

**Обов'язкові правила**:
- Відповідальні тільки за обробку HTTP-запитів
- Не містять бізнес-логіки
- URL-шляхи у kebab-case без дублювання `/api` префіксу
- Детальна документація API через анотації Swagger/OpenAPI

**Зразок структури**:

```java
@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
@Tag(name = "Clients", description = "API для управління клієнтами")
public class ClientsController {
    private final ClientService clientService;
    
    @GetMapping("/{id}")
    @Operation(summary = "Отримати клієнта за ID")
    public ResponseEntity<ClientResponse> getById(@PathVariable("id") final UUID id) {
        return ResponseEntity.ok(clientService.getById(id));
    }
    
    // Інші endpoint'и
}
```

## Крос-доменна комунікація

### 1. Прямі залежності

Використовуються тільки для сильно пов'язаних доменів:
- OrderService може викликати методи ClientService

### 2. Доменні події

Для слабо пов'язаних доменів використовується патерн доменних подій:
```java
@Service
public class OrderServiceImpl implements OrderService {
    private final ApplicationEventPublisher eventPublisher;
    
    public OrderResponse complete(UUID orderId) {
        OrderEntity order = // Логіка завершення замовлення
        
        // Публікація події про завершення замовлення
        eventPublisher.publishEvent(new OrderCompletedEvent(order.getId()));
        
        return orderMapper.toResponse(order);
    }
}
```

## Інтеграція з функціоналом OrderWizard

OrderWizard - це спеціальний компонент для складного процесу створення замовлення. Для нього діють такі правила:

1. **Розбиття на кроки** відповідає бізнес-процесу:
   - Вибір клієнта
   - Базова інформація
   - Управління предметами
   - Дефекти
   - Ціноутворення
   - Фотографії
   - Параметри замовлення
   - Оплата
   - Завершення

2. **Управління станом**:
   - Використання Zustand на фронтенді (React)
   - Збереження проміжних станів на бекенді

3. **Бізнес-логіка**:
   - **ОБОВ'ЯЗКОВО** реалізується на бекенді
   - Фронтенд відповідає тільки за відображення даних
   - Всі розрахунки та валідації виконуються на бекенді через API

4. **Розширюваність**:
   - Архітектура дозволяє додавати нові кроки та характеристики предметів
   - Ціноутворення може адаптуватися до нових параметрів

## Рекомендації та найкращі практики

1. **Чистота доменів**:
   - Мінімізуйте залежності між доменами
   - Уникайте циклічних залежностей

2. **Бізнес-інваріанти**:
   - Визначайте та захищайте бізнес-інваріанти в моделі домену
   - Валідуйте важливі бізнес-правила в сутностях

3. **Стійкість для змін**:
   - Проектуйте для розширення, а не модифікації
   - Виділяйте абстракції для потенційних змін

4. **Документація домену**:
   - Створюйте глосарій доменних термінів
   - Документуйте бізнес-правила через коментарі та тести
