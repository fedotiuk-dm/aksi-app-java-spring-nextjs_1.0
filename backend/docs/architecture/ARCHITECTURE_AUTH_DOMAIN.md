# Архітектурне рішення: Auth Domain

## Огляд
Auth domain відповідає за автентифікацію користувачів та управління JWT токенами в системі AKSI Dry Cleaning. Домен побудований на основі OpenAPI-First підходу з чітким розділенням відповідальності та використанням абстракцій.

## Структура пакетів

```
com.aksi.domain.auth/
├── api/                    # OpenAPI згенеровані інтерфейси та DTO
│   ├── AuthenticationApi   # Згенерований інтерфейс API
│   └── dto/               # Згенеровані DTO класи
├── controller/            # REST контролери
│   └── AuthController     # Імплементація AuthenticationApi
├── service/              # Бізнес-логіка
│   ├── AuthService       # Основний сервіс автентифікації
│   ├── JwtTokenService   # Управління JWT токенами
│   └── RefreshTokenService # Управління refresh токенами
├── security/             # Spring Security конфігурація
│   ├── JwtAuthenticationFilter
│   ├── JwtAuthenticationEntryPoint
│   └── SecurityConfig
├── entity/              # JPA entities
│   └── RefreshTokenEntity
├── repository/          # Data access layer
│   └── RefreshTokenRepository
├── mapper/             # MapStruct маппери
│   └── AuthMapper
├── exception/          # Domain-specific exceptions
│   ├── InvalidCredentialsException
│   ├── TokenExpiredException
│   └── InvalidTokenException
└── config/            # Конфігурація
    └── JwtProperties  # JWT налаштування

```

## Компоненти та їх відповідальність

### 1. Controller Layer
```java
@RestController
@RequiredArgsConstructor
public class AuthController implements AuthenticationApi {
    private final AuthService authService;
    
    @Override
    public ResponseEntity<AuthResponse> login(@Valid LoginRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }
    
    @Override
    public ResponseEntity<LogoutResponse> logout(String authHeader) {
        return ResponseEntity.ok(authService.logout(authHeader));
    }
    
    @Override
    public ResponseEntity<AuthResponse> refreshToken(@Valid RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }
}
```

### 2. Service Layer

#### AuthService (Orchestrator)
```java
@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;
    private final RefreshTokenService refreshTokenService;
    private final AuthenticationManager authenticationManager;
    
    public AuthResponse authenticate(LoginRequest request) {
        // 1. Автентифікація через Spring Security
        // 2. Генерація токенів
        // 3. Збереження refresh token
        // 4. Повернення відповіді
    }
}
```

#### JwtTokenService (Token Management)
```java
@Service
@RequiredArgsConstructor
public class JwtTokenService {
    private final JwtProperties jwtProperties;
    private final Key signingKey;
    
    public String generateAccessToken(UserDetails userDetails) {
        return generateToken(userDetails, jwtProperties.getAccessTokenExpiration());
    }
    
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    
    public boolean isTokenValid(String token, UserDetails userDetails) {
        // Валідація токену
    }
}
```

#### RefreshTokenService (Refresh Token Management)
```java
@Service
@RequiredArgsConstructor
@Transactional
public class RefreshTokenService {
    private final RefreshTokenRepository repository;
    private final JwtProperties jwtProperties;
    
    public RefreshTokenEntity createRefreshToken(String username) {
        // Створення та збереження refresh token
    }
    
    public RefreshTokenEntity verifyExpiration(RefreshTokenEntity token) {
        // Перевірка терміну дії
    }
    
    public void revokeUserTokens(String username) {
        // Відкликання всіх токенів користувача
    }
}
```

### 3. Security Configuration

#### JwtAuthenticationFilter
```java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtTokenService jwtTokenService;
    private final UserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        // 1. Витягнути JWT з header
        // 2. Валідувати токен
        // 3. Встановити SecurityContext
    }
}
```

### 4. Configuration Properties
```java
@Component
@ConfigurationProperties(prefix = "application.security.jwt")
@Validated
public class JwtProperties {
    @NotBlank
    private String secret;
    
    @NotNull
    private Duration accessTokenExpiration;
    
    @NotNull
    private Duration refreshTokenExpiration;
    
    // Getters/Setters з валідацією
}
```

### 5. Entity Layer
```java
@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshTokenEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false, unique = true)
    private String token;
    
    @Column(nullable = false)
    private String username;
    
    @Column(nullable = false)
    private Instant expiryDate;
    
    @Column(nullable = false)
    private boolean revoked;
    
    @CreationTimestamp
    private Instant createdAt;
}
```

## Інтеграція з іншими доменами

### User Domain Integration
```java
public interface UserDetailsProvider {
    UserDetails loadUserByUsername(String username);
    boolean existsByUsername(String username);
}
```

Auth domain не знає про деталі User domain, використовує лише інтерфейс.

## Обробка помилок

```java
@RestControllerAdvice
public class AuthExceptionHandler {
    
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentials(InvalidCredentialsException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ErrorResponse("INVALID_CREDENTIALS", e.getMessage()));
    }
    
    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<ErrorResponse> handleTokenExpired(TokenExpiredException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ErrorResponse("TOKEN_EXPIRED", e.getMessage()));
    }
}
```

## Конфігурація (application.yml)
```yaml
application:
  security:
    jwt:
      secret: ${JWT_SECRET:} # З environment variable
      access-token-expiration: PT15M  # 15 хвилин
      refresh-token-expiration: P7D   # 7 днів
```

## Тестування

### Unit Tests
- AuthServiceTest - тестування бізнес-логіки
- JwtTokenServiceTest - тестування роботи з токенами
- RefreshTokenServiceTest - тестування refresh токенів

### Integration Tests
- AuthControllerIntegrationTest - тестування API endpoints
- SecurityConfigurationTest - тестування security налаштувань

## Безпека

1. **JWT Secret**: Зберігається в environment variables, ніколи не в коді
2. **Refresh Tokens**: Зберігаються в БД з можливістю відкликання
3. **Password Encoding**: BCrypt з достатньою складністю
4. **Token Expiration**: Короткий термін для access token (15 хв), довгий для refresh (7 днів)
5. **CORS**: Налаштовується через SecurityConfig для конкретних origins

## Моніторинг та логування

```java
@Slf4j
@Aspect
@Component
public class AuthLoggingAspect {
    
    @Around("@annotation(Authenticated)")
    public Object logAuthentication(ProceedingJoinPoint joinPoint) {
        // Логування спроб автентифікації
        // Метрики для моніторингу
    }
}
```

## Розширюваність

1. **Multi-factor Authentication**: Можна додати через розширення AuthService
2. **OAuth2/OIDC**: Можна інтегрувати через Spring Security OAuth2
3. **Rate Limiting**: Можна додати через фільтри або AOP
4. **Session Management**: Можна додати Redis для розподіленої сесії

## Принципи дизайну

1. **Single Responsibility**: Кожен клас має одну чітку відповідальність
2. **Dependency Inversion**: Використання інтерфейсів для залежностей
3. **Open/Closed**: Розширюваність через інтерфейси та конфігурацію
4. **Interface Segregation**: Малі, специфічні інтерфейси
5. **No Hardcoding**: Всі налаштування через конфігурацію