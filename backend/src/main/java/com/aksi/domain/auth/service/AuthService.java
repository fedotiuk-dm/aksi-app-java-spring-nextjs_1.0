package com.aksi.domain.auth.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.auth.dto.AuthResponse;
import com.aksi.api.auth.dto.LoginRequest;
import com.aksi.api.auth.dto.LogoutResponse;
import com.aksi.api.auth.dto.RefreshTokenRequest;
import com.aksi.api.auth.dto.UserResponse;
import com.aksi.domain.auth.entity.RefreshTokenEntity;
import com.aksi.domain.auth.entity.UserEntity;
import com.aksi.domain.auth.enums.UserRole;
import com.aksi.domain.auth.exception.InvalidCredentialsException;
import com.aksi.domain.auth.exception.InvalidTokenException;
import com.aksi.domain.auth.exception.UserBlockedException;
import com.aksi.domain.auth.exception.UserNotFoundException;
import com.aksi.domain.auth.mapper.AuthMapper;
import com.aksi.domain.auth.repository.RefreshTokenRepository;
import com.aksi.domain.auth.repository.UserRepository;
import com.aksi.domain.auth.validation.UserValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Service для бізнес-логіки автентифікації та авторизації Дотримується принципів DDD SOLID. */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class AuthService {

  private final UserRepository userRepository;
  private final RefreshTokenRepository refreshTokenRepository;
  private final UserValidator userValidator;
  private final AuthMapper authMapper;
  private final PasswordEncoder passwordEncoder;
  private final JwtTokenService jwtTokenService;

  // API методи (для контролерів) - працюють з DTO

  /** Автентифікація користувача API метод для LoginRequest → AuthResponse. */
  @Transactional
  public AuthResponse authenticateUser(LoginRequest loginRequest) {
    log.debug("Спроба автентифікації користувача: {}", loginRequest.getUsername());

    // Нормалізація даних
    String normalizedUsername = userValidator.normalizeUsername(loginRequest.getUsername());

    // Пошук користувача за username або email
    UserEntity user =
        findUserByUsernameOrEmail(normalizedUsername)
            .orElseThrow(() -> new InvalidCredentialsException("Невірні облікові дані"));

    // Перевірка статусу користувача
    validateUserStatus(user);

    // Перевірка пароля
    if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
      handleFailedLoginAttempt(user);
      throw new InvalidCredentialsException("Невірні облікові дані");
    }

    // Успішна автентифікація
    handleSuccessfulLogin(user);

    // Генерація токенів
    String accessToken = jwtTokenService.generateAccessToken(user);
    String refreshTokenString = jwtTokenService.generateRefreshToken(user);

    // Збереження refresh token в БД для можливості відкликання
    createRefreshTokenEntity(user, refreshTokenString);

    log.info("Користувач {} успішно автентифікований", user.getUsername());

    return authMapper.toAuthResponse(
        accessToken, refreshTokenString, jwtTokenService.getExpirationInSeconds(), user);
  }

  /** Оновлення access токену API метод для RefreshTokenRequest → AuthResponse. */
  @Transactional
  public AuthResponse refreshAccessToken(RefreshTokenRequest refreshTokenRequest) {
    log.debug("Спроба оновлення access токену");

    // Валідація refresh токену
    RefreshTokenEntity refreshToken = validateRefreshToken(refreshTokenRequest.getRefreshToken());
    UserEntity user =
        findUserById(refreshToken.getUserId())
            .orElseThrow(() -> new UserNotFoundException(refreshToken.getUserId()));

    // Перевірка статусу користувача
    validateUserStatus(user);

    // Оновлення refresh токену
    refreshToken.markAsUsed();
    refreshTokenRepository.save(refreshToken);

    // Генерація нових токенів
    String newAccessToken = jwtTokenService.generateAccessToken(user);
    String newRefreshToken = jwtTokenService.generateRefreshToken(user);

    // Збереження нового refresh token в БД
    createRefreshTokenEntity(user, newRefreshToken);

    log.info("Access токен оновлено для користувача {}", user.getUsername());

    return authMapper.toAuthResponse(
        newAccessToken, newRefreshToken, jwtTokenService.getExpirationInSeconds(), user);
  }

  /** Вихід з системи API метод для logout → LogoutResponse. */
  @Transactional
  public LogoutResponse logoutUser(String refreshToken) {
    log.debug("Спроба виходу з системи");

    if (refreshToken != null) {
      // Інвалідація refresh токену
      refreshTokenRepository
          .findByToken(refreshToken)
          .ifPresent(
              token -> {
                token.invalidate();
                refreshTokenRepository.save(token);
                log.debug("Refresh токен інвалідовано");
              });
    }

    LogoutResponse response = new LogoutResponse();
    response.setSuccess(true);
    response.setMessage("Користувач успішно вийшов з системи");

    log.info("Користувач успішно вийшов з системи");
    return response;
  }

  /** Отримання поточного користувача за ID API метод для getUserInfo → UserResponse. */
  public UserResponse getCurrentUser(UUID userId) {
    log.debug("Отримання інформації про користувача ID: {}", userId);

    UserEntity user = findUserById(userId).orElseThrow(() -> new UserNotFoundException(userId));

    return authMapper.toUserResponse(user);
  }

  /** Отримання поточного користувача з JWT токена API метод для JWT Security Filter. */
  public UserResponse getCurrentUserFromToken(String token) {
    log.debug("Отримання інформації про користувача з токена");

    // Отримуємо ID з токена
    UUID userId = jwtTokenService.getUserIdFromToken(token);

    UserEntity user = findUserById(userId).orElseThrow(() -> new UserNotFoundException(userId));

    // Перевірка статусу користувача
    validateUserStatus(user);

    return authMapper.toUserResponse(user);
  }

  // Entity методи (для внутрішньої логіки)

  /** Пошук користувача за ID. */
  public Optional<UserEntity> findUserById(UUID userId) {
    return userRepository.findById(userId);
  }

  /** Пошук користувача за username або email. */
  public Optional<UserEntity> findUserByUsernameOrEmail(String identifier) {
    // Перевірка чи це email
    if (identifier.contains("@")) {
      String normalizedEmail = userValidator.normalizeEmail(identifier);
      return userRepository.findByEmail(normalizedEmail);
    } else {
      String normalizedUsername = userValidator.normalizeUsername(identifier);
      return userRepository.findByUsername(normalizedUsername);
    }
  }

  /** Створення нового користувача. */
  @Transactional
  public UserEntity createUser(
      String username,
      String email,
      String password,
      String firstName,
      String lastName,
      List<UserRole> roles) {
    log.debug("Створення нового користувача: {}", username);

    // Нормалізація даних
    String normalizedUsername = userValidator.normalizeUsername(username);
    String normalizedEmail = userValidator.normalizeEmail(email);
    String normalizedFirstName = userValidator.normalizeName(firstName);
    String normalizedLastName = userValidator.normalizeName(lastName);

    // Перевірка унікальності
    if (userRepository.existsByUsername(normalizedUsername)) {
      throw new com.aksi.domain.auth.exception.UserAlreadyExistsException(
          "username", normalizedUsername);
    }
    if (userRepository.existsByEmail(normalizedEmail)) {
      throw new com.aksi.domain.auth.exception.UserAlreadyExistsException("email", normalizedEmail);
    }

    // Створення Entity
    UserEntity user =
        UserEntity.builder()
            .username(normalizedUsername)
            .email(normalizedEmail)
            .passwordHash(passwordEncoder.encode(password))
            .firstName(normalizedFirstName)
            .lastName(normalizedLastName)
            .roles(roles)
            .isActive(true)
            .failedLoginAttempts(0)
            .build();

    // Валідація бізнес-правил
    userValidator.validateForCreation(user);

    UserEntity savedUser = userRepository.save(user);
    log.info("Користувач {} створений з ID: {}", savedUser.getUsername(), savedUser.getId());

    return savedUser;
  }

  // Приватні допоміжні методи

  private void validateUserStatus(UserEntity user) {
    if (!user.isActiveAndNotLocked()) {
      if (!Boolean.TRUE.equals(user.getIsActive())) {
        throw new UserBlockedException("Користувач '" + user.getUsername() + "' деактивований");
      }
      if (user.getLockedUntil() != null && user.getLockedUntil().isAfter(LocalDateTime.now())) {
        throw new UserBlockedException(user.getUsername(), user.getLockedUntil());
      }
    }
  }

  private void handleFailedLoginAttempt(UserEntity user) {
    user.incrementFailedLoginAttempts();
    userRepository.save(user);
    log.warn("Невдала спроба входу для користувача {}", user.getUsername());
  }

  private void handleSuccessfulLogin(UserEntity user) {
    user.updateLastLogin();
    userRepository.save(user);
  }

  private RefreshTokenEntity validateRefreshToken(String token) {
    // Спочатку валідуємо JWT
    jwtTokenService.validateToken(token);

    // Потім перевіряємо наявність в БД та статус
    RefreshTokenEntity refreshToken =
        refreshTokenRepository
            .findByToken(token)
            .orElseThrow(() -> new InvalidTokenException("Невалідний refresh токен"));

    if (!refreshToken.isValid()) {
      throw new InvalidTokenException("Refresh токен прострочений або неактивний");
    }

    return refreshToken;
  }

  private void createRefreshTokenEntity(UserEntity user, String refreshToken) {
    RefreshTokenEntity refreshTokenEntity =
        RefreshTokenEntity.builder()
            .token(refreshToken)
            .userId(user.getId())
            .expiresAt(jwtTokenService.getExpirationDateFromToken(refreshToken))
            .isActive(true)
            .build();

    refreshTokenRepository.save(refreshTokenEntity);
    log.debug("Refresh token entity створено для користувача: {}", user.getUsername());
  }
}
