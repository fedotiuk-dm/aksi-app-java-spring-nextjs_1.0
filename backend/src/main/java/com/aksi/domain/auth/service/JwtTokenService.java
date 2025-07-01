package com.aksi.domain.auth.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.aksi.domain.auth.entity.UserEntity;
import com.aksi.domain.auth.enums.UserRole;
import com.aksi.domain.auth.exception.InvalidTokenException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

/**
 * Service для роботи з JWT токенами Генерація, валідація та парсинг JWT токенів Сумісний з JJWT
 * 0.12.6
 */
@Service
@Slf4j
public class JwtTokenService {

  private final long jwtExpirationInMs;
  private final long refreshTokenExpirationInMs;
  private final SecretKey secretKey;

  public JwtTokenService(
      @Value("${jwt.secret:mySecretKey123456789012345678901234567890}") String jwtSecret,
      @Value("${jwt.expiration:3600000}") long jwtExpirationInMs,
      @Value("${jwt.refresh.expiration:2592000000}") long refreshTokenExpirationInMs) {
    this.jwtExpirationInMs = jwtExpirationInMs;
    this.refreshTokenExpirationInMs = refreshTokenExpirationInMs;
    this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
  }

  /** Генерація JWT access токену. */
  public String generateAccessToken(UserEntity user) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

    // Додаємо ролі як список строк
    List<String> roles = user.getRoles().stream().map(UserRole::name).collect(Collectors.toList());

    return buildJwtToken(user, now, expiryDate)
        .claim("email", user.getEmail())
        .claim("firstName", user.getFirstName())
        .claim("lastName", user.getLastName())
        .claim("isActive", user.getIsActive())
        .claim("roles", roles)
        .compact();
  }

  /** Генерація JWT refresh токену. */
  public String generateRefreshToken(UserEntity user) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + refreshTokenExpirationInMs);

    return buildJwtToken(user, now, expiryDate).claim("type", "refresh").compact();
  }

  /** Базовий JWT builder для уникнення дублювання. */
  private io.jsonwebtoken.JwtBuilder buildJwtToken(
      UserEntity user, Date issuedAt, Date expiration) {
    return Jwts.builder()
        .subject(user.getId().toString())
        .issuedAt(issuedAt)
        .expiration(expiration)
        .claim("userId", user.getId())
        .claim("username", user.getUsername())
        .signWith(secretKey, Jwts.SIG.HS512);
  }

  /** Отримання користувача ID з токену. */
  public Long getUserIdFromToken(String token) {
    Claims claims = getClaimsFromToken(token);
    return Long.valueOf(claims.getSubject());
  }

  /** Отримання username з токену. */
  public String getUsernameFromToken(String token) {
    Claims claims = getClaimsFromToken(token);
    return claims.get("username", String.class);
  }

  /** Отримання ролей з токену. */
  @SuppressWarnings("unchecked")
  public List<String> getRolesFromToken(String token) {
    Claims claims = getClaimsFromToken(token);
    return (List<String>) claims.get("roles");
  }

  /** Перевірка валідності токену. */
  public boolean isTokenValid(String token) {
    return safeTokenOperation(token, claims -> true, false);
  }

  /** Перевірка чи токен прострочений. */
  public boolean isTokenExpired(String token) {
    return safeTokenOperation(token, claims -> claims.getExpiration().before(new Date()), true);
  }

  /** Отримання дати експірації токену. */
  public LocalDateTime getExpirationDateFromToken(String token) {
    Claims claims = getClaimsFromToken(token);
    return claims.getExpiration().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
  }

  /** Валідація токену з детальною перевіркою. */
  public void validateToken(String token) {
    Claims claims = getClaimsFromToken(token);

    // Перевірка експірації
    if (claims.getExpiration().before(new Date())) {
      throw new InvalidTokenException("Токен прострочений");
    }

    // Перевірка обов'язкових полів
    if (claims.getSubject() == null || claims.getSubject().isEmpty()) {
      throw new InvalidTokenException("Токен не містить subject");
    }

    log.debug("Токен валідний для користувача: {}", claims.get("username"));
  }

  /** Отримання експірації в секундах (для API response). */
  public long getExpirationInSeconds() {
    return jwtExpirationInMs / 1000;
  }

  /** Перевірка чи токен є refresh токеном. */
  public boolean isRefreshToken(String token) {
    return safeTokenOperation(
        token, claims -> "refresh".equals(claims.get("type", String.class)), false);
  }

  /** Отримання всіх даних користувача з токену. */
  @SuppressWarnings("unchecked")
  public UserTokenData getUserDataFromToken(String token) {
    Claims claims = getClaimsFromToken(token);

    List<String> roles = (List<String>) claims.get("roles");

    return new UserTokenData(
        Long.valueOf(claims.getSubject()),
        claims.get("username", String.class),
        claims.get("email", String.class),
        claims.get("firstName", String.class),
        claims.get("lastName", String.class),
        claims.get("isActive", Boolean.class),
        roles);
  }

  /** DTO для даних користувача з токену. */
  public static class UserTokenData {
    private final Long userId;
    private final String username;
    private final String email;
    private final String firstName;
    private final String lastName;
    private final Boolean isActive;
    private final List<String> roles;

    public UserTokenData(
        Long userId,
        String username,
        String email,
        String firstName,
        String lastName,
        Boolean isActive,
        List<String> roles) {
      this.userId = userId;
      this.username = username;
      this.email = email;
      this.firstName = firstName;
      this.lastName = lastName;
      this.isActive = isActive;
      this.roles = roles;
    }

    // Getters
    public Long getUserId() {
      return userId;
    }

    public String getUsername() {
      return username;
    }

    public String getEmail() {
      return email;
    }

    public String getFirstName() {
      return firstName;
    }

    public String getLastName() {
      return lastName;
    }

    public Boolean getIsActive() {
      return isActive;
    }

    public List<String> getRoles() {
      return roles;
    }
  }

  /** Безпечне виконання операції з токеном (generic exception handler). */
  private <T> T safeTokenOperation(
      String token, java.util.function.Function<Claims, T> operation, T defaultValue) {
    try {
      Claims claims = parseTokenClaims(token);
      return operation.apply(claims);
    } catch (JwtException | IllegalArgumentException e) {
      log.debug("Операція з токеном невдала: {}", e.getMessage());
      return defaultValue;
    }
  }

  /** Отримання Claims з токену з exception handling. */
  private Claims getClaimsFromToken(String token) {
    try {
      return parseTokenClaims(token);
    } catch (ExpiredJwtException e) {
      throw new InvalidTokenException("Токен прострочений", e);
    } catch (UnsupportedJwtException e) {
      throw new InvalidTokenException("Непідтримуваний токен", e);
    } catch (MalformedJwtException e) {
      throw new InvalidTokenException("Некоректний формат токену", e);
    } catch (JwtException e) {
      throw new InvalidTokenException("Невалідний токен", e);
    } catch (IllegalArgumentException e) {
      throw new InvalidTokenException("Токен не може бути порожнім", e);
    }
  }

  /** Парсинг токену без exception transformation. */
  private Claims parseTokenClaims(String token) {
    return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload();
  }
}
