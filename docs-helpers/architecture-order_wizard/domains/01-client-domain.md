# Client Domain - Управління клієнтами

## Огляд домену

Client Domain відповідає за управління клієнтами хімчистки, включаючи пошук, створення, редагування клієнтів та управління їх контактною інформацією.

## Бізнес-логіка

### Функціональність

- **Швидкий пошук клієнтів** - автозаповнення за прізвищем, ім'ям, телефоном, email
- **Створення нових клієнтів** - з обов'язковими та опційними полями
- **Редагування існуючих клієнтів** - оновлення контактної інформації
- **Управління способами зв'язку** - налаштування переваг комунікації
- **Відстеження джерел** - звідки клієнт дізнався про хімчистку

### Бізнес-правила

1. **Обов'язкові поля**: Прізвище, ім'я, телефон
2. **Опційні поля**: Email, адреса
3. **Способи зв'язку**: Множинний вибір (телефон, SMS, Viber)
4. **Унікальність**: Телефон повинен бути унікальним в системі
5. **Валідація**: Email повинен мати правильний формат

## Доменна модель

### Entities

#### Client

```java
@Entity
public class Client {
    private Long id;
    private String firstName;        // Обов'язкове
    private String lastName;         // Обов'язкове
    private String phone;           // Обов'язкове, унікальне
    private String email;           // Опційне
    private Address address;        // Опційне
    private ContactPreferences contactPreferences;
    private ClientSource source;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### Value Objects

#### Address

```java
@Embeddable
public class Address {
    private String street;
    private String city;
    private String postalCode;
    private String country;
}
```

#### ContactPreferences

```java
@Embeddable
public class ContactPreferences {
    private boolean preferPhone;
    private boolean preferSms;
    private boolean preferViber;
}
```

### Enums

#### ClientSource

```java
public enum ClientSource {
    INSTAGRAM("Інстаграм"),
    GOOGLE("Google"),
    RECOMMENDATION("Рекомендації"),
    OTHER("Інше");
}
```

## Сервіси

### ClientService

```java
@Service
public class ClientService {

    // Пошук клієнтів
    List<Client> searchClients(String searchTerm);

    // CRUD операції
    Client createClient(CreateClientRequest request);
    Client updateClient(Long id, UpdateClientRequest request);
    Client getClientById(Long id);
    void deleteClient(Long id);

    // Бізнес-логіка
    boolean isPhoneUnique(String phone);
    List<Client> getRecentClients(int limit);
}
```

### ClientSearchService

```java
@Service
public class ClientSearchService {

    // Пошук з автозаповненням
    List<ClientSearchResult> searchWithAutoComplete(String term);

    // Розширений пошук
    List<Client> searchByMultipleFields(ClientSearchCriteria criteria);

    // Пошук за контактними даними
    Optional<Client> findByPhone(String phone);
    Optional<Client> findByEmail(String email);
}
```

## Repositories

### ClientRepository

```java
@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {

    // Пошук для автозаповнення
    @Query("SELECT c FROM Client c WHERE " +
           "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
           "c.phone LIKE CONCAT('%', :term, '%') OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :term, '%'))")
    List<Client> findBySearchTerm(@Param("term") String term);

    // Унікальність перевірки
    boolean existsByPhone(String phone);
    boolean existsByEmail(String email);

    // Останні клієнти
    List<Client> findTop10ByOrderByCreatedAtDesc();
}
```

## DTOs

### Request DTOs

#### CreateClientRequest

```java
public class CreateClientRequest {
    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$")
    private String phone;

    @Email
    private String email;

    private AddressDto address;
    private ContactPreferencesDto contactPreferences;
    private ClientSource source;
    private String sourceOther;
}
```

#### UpdateClientRequest

```java
public class UpdateClientRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private AddressDto address;
    private ContactPreferencesDto contactPreferences;
    private ClientSource source;
    private String sourceOther;
}
```

#### ClientSearchCriteria

```java
public class ClientSearchCriteria {
    private String searchTerm;
    private String phone;
    private String email;
    private ClientSource source;
    private LocalDateTime createdAfter;
    private LocalDateTime createdBefore;
}
```

### Response DTOs

#### ClientResponse

```java
public class ClientResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private AddressDto address;
    private ContactPreferencesDto contactPreferences;
    private ClientSource source;
    private String sourceOther;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

#### ClientSearchResult

```java
public class ClientSearchResult {
    private Long id;
    private String displayName;     // "Прізвище Ім'я"
    private String phone;
    private String email;
    private String address;         // Форматована адреса
}
```

## API Endpoints

### Базові CRUD операції

- `GET /api/clients/search?term={searchTerm}` - Пошук клієнтів
- `POST /api/clients` - Створення клієнта
- `GET /api/clients/{id}` - Отримання клієнта за ID
- `PUT /api/clients/{id}` - Оновлення клієнта
- `DELETE /api/clients/{id}` - Видалення клієнта

### Спеціалізовані операції

- `GET /api/clients/recent` - Останні клієнти
- `GET /api/clients/autocomplete?term={term}` - Автозаповнення
- `POST /api/clients/search` - Розширений пошук
- `GET /api/clients/phone/{phone}/exists` - Перевірка унікальності телефону

## Валідація

### Бізнес-валідація

1. **Телефон**: Унікальний, правильний формат
2. **Email**: Правильний формат (якщо вказаний)
3. **Ім'я та прізвище**: Не пусті, мінімум 2 символи
4. **Джерело**: Якщо "Інше", то обов'язкове поле sourceOther

### Технічна валідація

- Bean Validation анотації
- Кастомні валідатори для телефону
- Валідація унікальності

## Інтеграція з іншими доменами

### Order Domain

- Client використовується при створенні замовлення
- Зберігається посилання на клієнта в Order

### Document Domain

- Інформація про клієнта включається в квитанцію
- Контактні дані для зв'язку

## Тестування

### Unit Tests

- ClientService тестування бізнес-логіки
- ClientRepository тестування запитів
- Валідація DTOs

### Integration Tests

- API endpoints тестування
- База даних інтеграція
- Кастомні валідатори

## Технічні деталі

### Індекси БД

```sql
CREATE INDEX idx_client_phone ON clients(phone);
CREATE INDEX idx_client_email ON clients(email);
CREATE INDEX idx_client_search ON clients(first_name, last_name);
CREATE INDEX idx_client_created_at ON clients(created_at);
```

### Кешування

- Кешування результатів пошуку
- Кешування останніх клієнтів
- Кешування перевірки унікальності

### Безпека

- Персональні дані захищені
- Логування доступу до клієнтських даних
- GDPR compliance для видалення даних
