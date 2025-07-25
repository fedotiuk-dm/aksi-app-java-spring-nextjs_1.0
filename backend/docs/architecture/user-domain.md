# User Domain Architecture

## Огляд

User Domain відповідає за управління користувачами системи, їх профілями, ролями та правами доступу. Домен тісно інтегрований з Auth Domain через інтерфейс `UserDetailsProvider`.

## Структура пакетів

```
com.aksi.domain.user/
├── entity/
│   └── UserEntity.java              # JPA entity користувача
├── repository/
│   └── UserRepository.java          # Репозиторій для роботи з БД
├── service/
│   ├── UserService.java             # Основний сервіс для бізнес-логіки
│   └── UserDetailsServiceImpl.java  # Імплементація UserDetailsProvider
├── mapper/
│   └── UserMapper.java              # MapStruct mapper для DTO
├── controller/
│   └── UserController.java          # REST контролер
├── validation/
│   └── UserValidator.java           # Валідація користувачів
└── exception/
    ├── UserNotFoundException.java   # Користувач не знайдений
    ├── UserAlreadyExistsException.java # Користувач вже існує
    └── UserExceptionHandler.java    # Обробник винятків

```

## Компоненти

### 1. UserEntity

```java
@Entity
@Table(name = "users")
public class UserEntity extends BaseEntity {
    
    @Column(unique = true, nullable = false, length = 50)
    private String username;
    
    @Column(unique = true, nullable = false, length = 100)
    private String email;
    
    @Column(nullable = false)
    private String passwordHash;
    
    @Column(nullable = false, length = 50)
    private String firstName;
    
    @Column(nullable = false, length = 50)
    private String lastName;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private UserRole role;
    
    @Column(nullable = false)
    private boolean isActive = true;
    
    @Column
    private UUID branchId;
    
    @Column
    private Instant lastLoginAt;
    
    @Column(nullable = false)
    private int failedLoginAttempts = 0;
    
    @Column
    private Instant lockedUntil;
}
```

### 2. UserRole Enum

```java
public enum UserRole {
    ADMIN,      // Адміністратор системи - повний доступ
    OPERATOR    // Оператор прийому замовлень
}
```

### 3. UserService

Основні методи:
- `createUser(CreateUserRequest)` - створення нового користувача
- `updateUser(UUID id, UpdateUserRequest)` - оновлення даних
- `changePassword(UUID id, ChangePasswordRequest)` - зміна пароля
- `getUserById(UUID id)` - отримання по ID
- `getUserByUsername(String username)` - отримання по username
- `listUsers(Pageable pageable)` - список з пагінацією
- `updateUserRole(UUID id, UpdateUserRoleRequest)` - зміна ролі
- `activateUser(UUID id)` / `deactivateUser(UUID id)` - активація/деактивація
- `resetFailedAttempts(String username)` - скидання лічильника невдалих спроб
- `lockUser(String username, Duration duration)` - блокування користувача

### 4. UserDetailsServiceImpl

Імплементує `UserDetailsProvider` з auth domain:

```java
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsProvider {
    
    private final UserRepository userRepository;
    
    @Override
    public UserDetails loadUserByUsername(String username) {
        UserEntity user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            
        if (!user.isActive()) {
            throw new DisabledException("User is not active");
        }
        
        if (user.getLockedUntil() != null && user.getLockedUntil().isAfter(Instant.now())) {
            throw new LockedException("User is locked");
        }
        
        return User.builder()
            .username(user.getUsername())
            .password(user.getPasswordHash())
            .authorities(mapRoleToAuthorities(user.getRole()))
            .accountExpired(false)
            .accountLocked(false)
            .credentialsExpired(false)
            .disabled(!user.isActive())
            .build();
    }
}
```

### 5. UserMapper

MapStruct маппер для конвертації між Entity та DTO:

```java
@Mapper(componentModel = "spring", 
        imports = {UUID.class},
        unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface UserMapper {
    
    @Mapping(target = "isActive", source = "active")
    UserResponse toResponse(UserEntity entity);
    
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "active", constant = "true")
    @Mapping(target = "failedLoginAttempts", constant = "0")
    @Mapping(target = "lastLoginAt", ignore = true)
    @Mapping(target = "lockedUntil", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    UserEntity toEntity(CreateUserRequest request);
    
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(@MappingTarget UserEntity entity, UpdateUserRequest request);
    
    List<UserResponse> toResponseList(List<UserEntity> entities);
}
```

**Згенеровані файли:** MapStruct автоматично генерує `UserMapperImpl` в `target/generated-sources/annotations` під час компіляції.

### 6. UserRepository

Spring Data JPA репозиторій:

```java
@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    
    Optional<UserEntity> findByUsername(String username);
    
    Optional<UserEntity> findByEmail(String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM UserEntity u WHERE u.role = :role")
    Page<UserEntity> findByRole(@Param("role") UserRole role, Pageable pageable);
    
    @Query("SELECT u FROM UserEntity u WHERE u.branchId = :branchId")
    List<UserEntity> findByBranchId(@Param("branchId") UUID branchId);
    
    @Modifying
    @Query("UPDATE UserEntity u SET u.failedLoginAttempts = u.failedLoginAttempts + 1 WHERE u.username = :username")
    void incrementFailedAttempts(@Param("username") String username);
    
    @Modifying
    @Query("UPDATE UserEntity u SET u.failedLoginAttempts = 0 WHERE u.username = :username")
    void resetFailedAttempts(@Param("username") String username);
    
    @Modifying
    @Query("UPDATE UserEntity u SET u.lastLoginAt = :loginTime WHERE u.username = :username")
    void updateLastLoginAt(@Param("username") String username, @Param("loginTime") Instant loginTime);
    
    @Modifying
    @Query("UPDATE UserEntity u SET u.lockedUntil = :lockedUntil WHERE u.username = :username")
    void lockUser(@Param("username") String username, @Param("lockedUntil") Instant lockedUntil);
}
```

**Note:** Spring Data JPA не генерує Impl класи в target - вона створює проксі динамічно в runtime.

### 7. UserController

Імплементує згенерований `UserApi` інтерфейс з OpenAPI:

```java
@RestController
@RequiredArgsConstructor
public class UserController implements UserApi {
    
    private final UserService userService;
    
    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> createUser(CreateUserRequest request) {
        // Імплементація
    }
    
    @Override
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<UserResponse> getUserById(UUID id) {
        // Імплементація
    }
    
    // Інші методи...
}
```

## Інтеграція з Auth Domain

1. **UserDetailsProvider Interface** - визначений в auth domain, імплементований в user domain
2. **Password Management** - використовує PasswordEncoder з SecurityConfig
3. **Login Tracking** - оновлення lastLoginAt та failedLoginAttempts
4. **Account Locking** - автоматичне блокування після 5 невдалих спроб

## Security

1. **Захист ендпоінтів:**
   - Створення/видалення користувачів - тільки ADMIN
   - Оновлення профілю - ADMIN або власник
   - Перегляд списку - тільки ADMIN
   - Зміна пароля - власник або ADMIN

2. **Валідація:**
   - Username: 3-50 символів, латиниця та цифри
   - Email: валідний email формат
   - Password: мінімум 6 символів
   - Імена: 2-50 символів

3. **Аудит:**
   - Логування всіх операцій створення/зміни користувачів
   - Збереження історії змін ролей

## База даних

### Таблиця users
- Використовує існуючу структуру з auth domain міграцій
- Індекси на username, email, is_active

### Роль користувача
- Зберігається прямо в таблиці users як поле role
- Значення: ADMIN або OPERATOR

## Обробка помилок

1. **UserNotFoundException** - 404 Not Found
2. **UserAlreadyExistsException** - 409 Conflict
3. **ValidationException** - 400 Bad Request
4. **AccessDeniedException** - 403 Forbidden

## Тестування

1. **Unit тести:**
   - UserService - бізнес логіка
   - UserValidator - валідація даних
   - UserMapper - маппінг DTO

2. **Integration тести:**
   - UserController - REST API
   - UserRepository - робота з БД
   - Security - перевірка доступу

## Метрики та моніторинг

1. Кількість активних користувачів
2. Частота невдалих спроб входу
3. Час відповіді на запити
4. Кількість заблокованих акаунтів

## Згенеровані файли

При компіляції автоматично генеруються:

### 1. OpenAPI Generator (target/generated-sources/openapi)
- `com.aksi.api.user.UserApi` - інтерфейс контролера
- `com.aksi.api.user.dto.*` - всі DTO класи (UserResponse, CreateUserRequest, etc.)

### 2. MapStruct (target/generated-sources/annotations)
- `com.aksi.domain.user.mapper.UserMapperImpl` - імплементація маппера

### 3. Lombok (в байт-коді)
- Getters/Setters для Entity та DTO
- Builders для класів з @Builder
- Конструктори через @RequiredArgsConstructor

### 4. Spring Data JPA (в runtime)
- Динамічні проксі для UserRepository - НЕ генерує файли в target