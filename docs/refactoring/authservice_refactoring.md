# Рефакторинг AuthService для усунення дубльованого коду

## Проблема

У класі `AuthService.java` виявлено три основні ділянки дубльованого коду:

1. 21 рядок дубльованого коду між методами `register` (лінія 70) та `login` (лінія 110) - побудова об'єкта `AuthResponse`
2. 11 рядків дубльованого коду між методами `login` (лінія 116) та `refreshToken` (лінія 162) - генерація токенів
3. 11 рядків дубльованого коду між методами `register` (лінія 76) та `refreshToken` (лінія 162) - генерація токенів

Ці дублікати підвищують ризик помилок при модифікації коду, оскільки зміни потрібно вносити в кількох місцях.

## План рефакторингу

### 1. Створення утилітних методів для генерації AuthResponse

```java
/**
 * Створення AuthResponse на основі даних користувача та токенів
 *
 * @param user Користувач
 * @param accessToken JWT токен доступу
 * @param refreshToken Токен оновлення
 * @return Об'єкт AuthResponse з усіма необхідними даними
 */
private AuthResponse buildAuthResponse(UserEntity user, String accessToken, String refreshToken) {
    return AuthResponse.builder()
            .id(user.getId())
            .name(user.getName())
            .username(user.getUsername())
            .email(user.getEmail())
            .role(user.getRole())
            .position(user.getPosition())
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .expiresIn(jwtUtils.getExpirationInSeconds())
            .build();
}
```

### 2. Створення методу для генерації обох токенів

```java
/**
 * Генерація пари токенів (access та refresh) для користувача
 *
 * @param user Користувач
 * @return Пара токенів (ключ "accessToken" для JWT токену, "refreshToken" для refresh токену)
 */
private Map<String, String> generateTokenPair(UserEntity user) {
    Map<String, String> tokens = new HashMap<>();

    // Генерація JWT токена
    tokens.put("accessToken", jwtUtils.generateToken(user));

    // Генерація refresh токена
    tokens.put("refreshToken", jwtUtils.generateRefreshToken(user));

    return tokens;
}
```

## Оновлені методи після рефакторингу

### 1. Метод register

```java
@Transactional
public AuthResponse register(RegisterRequest request) {
    // Перевірка чи існує користувач з таким username
    if (userRepository.existsByUsername(request.getUsername())) {
        throw new UserAlreadyExistsException("Користувач з таким логіном вже існує");
    }

    // Перевірка чи існує користувач з таким email
    if (userRepository.existsByEmail(request.getEmail())) {
        throw new UserAlreadyExistsException("Користувач з таким email вже існує");
    }

    // Встановлюємо роль STAFF якщо не вказано інше
    RoleEntity role = request.getRole() != null ? request.getRole() : RoleEntity.STAFF;

    // Створення нового користувача
    UserEntity user = UserEntity.builder()
            .name(request.getName())
            .username(request.getUsername())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(role)
            .position(request.getPosition())
            .active(true)
            .build();

    // Збереження користувача
    userRepository.save(user);

    // Генерація токенів та побудова відповіді
    Map<String, String> tokens = generateTokenPair(user);

    return buildAuthResponse(user, tokens.get("accessToken"), tokens.get("refreshToken"));
}
```

### 2. Метод login

```java
public AuthResponse login(LoginRequest request) {
    try {
        // Спроба автентифікації
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // Якщо автентифікація успішна, знаходимо користувача
        UserEntity user = userRepository.findByUsername(request.getUsername())
                .or(() -> userRepository.findByEmail(request.getUsername()))
                .orElseThrow(() -> new AuthenticationException("Неправильний логін або пароль"));

        // Генерація токенів та побудова відповіді
        Map<String, String> tokens = generateTokenPair(user);

        return buildAuthResponse(user, tokens.get("accessToken"), tokens.get("refreshToken"));
    } catch (org.springframework.security.core.AuthenticationException e) {
        throw new AuthenticationException("Неправильний логін або пароль");
    }
}
```

### 3. Метод refreshToken

```java
public AuthResponse refreshToken(String refreshToken) {
    try {
        // Отримання імені користувача з токена
        String username = jwtUtils.extractUsername(refreshToken);

        if (username == null) {
            throw new AuthenticationException("Недійсний refresh token");
        }

        // Перевірка користувача
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AuthenticationException("Користувача не знайдено"));

        // Перевірка валідності токена
        if (!jwtUtils.isTokenValid(refreshToken, user)) {
            throw new AuthenticationException("Недійсний refresh token");
        }

        // Генерація токенів та побудова відповіді
        Map<String, String> tokens = generateTokenPair(user);

        return buildAuthResponse(user, tokens.get("accessToken"), tokens.get("refreshToken"));
    } catch (IllegalArgumentException | io.jsonwebtoken.JwtException | NullPointerException e) {
        throw new AuthenticationException("Помилка оновлення токена: " + e.getMessage());
    }
}
```

## Висновок

Проведений рефакторинг дозволить:

1. Уникнути повторення коду при генерації токенів
2. Спростити підтримку та зміни логіки автентифікації
3. Зробити код читабельнішим та компактнішим

У випадку внесення змін у логіку формування відповіді чи генерації токенів, зміни потрібно буде внести в одному місці (у виділених методах), що зменшить ризик помилок.
