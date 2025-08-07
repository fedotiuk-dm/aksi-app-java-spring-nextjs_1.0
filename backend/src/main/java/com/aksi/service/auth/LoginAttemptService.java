package com.aksi.service.auth;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

/**
 * Service for tracking and managing login attempts to prevent brute force attacks. Uses Redis for
 * distributed rate limiting and attempt tracking.
 */
@Service
public class LoginAttemptService {

  private static final String USER_ATTEMPT_PREFIX = "login_attempts:user:";
  private static final String IP_ATTEMPT_PREFIX = "login_attempts:ip:";
  private static final String USER_BLOCKED_PREFIX = "user_blocked:";
  private static final String IP_BLOCKED_PREFIX = "ip_blocked:";

  private final RedisTemplate<String, Object> redisTemplate;
  private final SecurityEventAuditService securityEventAuditService;

  @Value("${app.security.max-attempts-per-user:5}")
  private int maxAttemptsPerUser;

  @Value("${app.security.max-attempts-per-ip:10}")
  private int maxAttemptsPerIp;

  @Value("${app.security.lockout-duration-minutes:15}")
  private int lockoutDurationMinutes;

  @Value("${app.security.attempt-window-minutes:60}")
  private int attemptWindowMinutes;

  public LoginAttemptService(
      RedisTemplate<String, Object> redisTemplate,
      SecurityEventAuditService securityEventAuditService) {
    this.redisTemplate = redisTemplate;
    this.securityEventAuditService = securityEventAuditService;
  }

  /** Record a successful login attempt. */
  public void recordSuccessfulLogin(String username, String ipAddress, String userAgent) {
    // Clear failed attempts on successful login
    clearFailedAttempts(username, ipAddress);

    // Log successful login event
    securityEventAuditService.logSuccessfulLogin(username, ipAddress, userAgent);
  }

  /** Record a failed login attempt and check if user/IP should be blocked. */
  public void recordFailedLogin(
      String username, String ipAddress, String userAgent, String failureReason) {
    // Increment failed attempts
    String userKey = USER_ATTEMPT_PREFIX + username;
    String ipKey = IP_ATTEMPT_PREFIX + ipAddress;

    Long userAttempts = incrementAttempts(userKey);
    Long ipAttempts = incrementAttempts(ipKey);

    // Check if blocking is needed
    boolean userBlocked = false;
    boolean ipBlocked = false;

    if (userAttempts >= maxAttemptsPerUser) {
      blockUser(username);
      userBlocked = true;
    }

    if (ipAttempts >= maxAttemptsPerIp) {
      blockIp(ipAddress);
      ipBlocked = true;
    }

    // Log failed login attempt
    securityEventAuditService.logFailedLogin(
        username, ipAddress, userAgent, failureReason, userBlocked, ipBlocked);
  }

  /** Check if a user is currently blocked. */
  public boolean isUserBlocked(String username) {
    String key = USER_BLOCKED_PREFIX + username;
    return redisTemplate.hasKey(key);
  }

  /** Check if an IP address is currently blocked. */
  public boolean isIpBlocked(String ipAddress) {
    String key = IP_BLOCKED_PREFIX + ipAddress;
    return redisTemplate.hasKey(key);
  }

  /** Get remaining attempts before user lockout. */
  public int getRemainingAttempts(String username) {
    if (isUserBlocked(username)) {
      return 0;
    }

    String key = USER_ATTEMPT_PREFIX + username;
    Object attempts = redisTemplate.opsForValue().get(key);
    int currentAttempts = attempts != null ? ((Number) attempts).intValue() : 0;

    return Math.max(0, maxAttemptsPerUser - currentAttempts);
  }

  /** Get the lockout expiration time for a user. */
  public Instant getUserLockoutExpiration(String username) {
    if (!isUserBlocked(username)) {
      return null;
    }

    String key = USER_BLOCKED_PREFIX + username;
    long ttl = redisTemplate.getExpire(key, TimeUnit.SECONDS);

    if (ttl > 0) {
      return Instant.now().plusSeconds(ttl);
    }

    return null;
  }

  /** Get the lockout expiration time for an IP. */
  public Instant getIpLockoutExpiration(String ipAddress) {
    if (!isIpBlocked(ipAddress)) {
      return null;
    }

    String key = IP_BLOCKED_PREFIX + ipAddress;
    long ttl = redisTemplate.getExpire(key, TimeUnit.SECONDS);

    if (ttl > 0) {
      return Instant.now().plusSeconds(ttl);
    }

    return null;
  }

  /** Manually unlock a user (admin operation). */
  public void unlockUser(String username) {
    String attemptKey = USER_ATTEMPT_PREFIX + username;
    String blockedKey = USER_BLOCKED_PREFIX + username;

    redisTemplate.delete(attemptKey);
    redisTemplate.delete(blockedKey);

    securityEventAuditService.logUserUnlocked(username);
  }

  /** Manually unlock an IP address (admin operation). */
  public void unlockIp(String ipAddress) {
    String attemptKey = IP_ATTEMPT_PREFIX + ipAddress;
    String blockedKey = IP_BLOCKED_PREFIX + ipAddress;

    redisTemplate.delete(attemptKey);
    redisTemplate.delete(blockedKey);

    securityEventAuditService.logIpUnlocked(ipAddress);
  }

  /** Get current failed attempt count for a user. */
  public int getUserFailedAttempts(String username) {
    String key = USER_ATTEMPT_PREFIX + username;
    Object attempts = redisTemplate.opsForValue().get(key);
    return attempts != null ? ((Number) attempts).intValue() : 0;
  }

  /** Get current failed attempt count for an IP. */
  public int getIpFailedAttempts(String ipAddress) {
    String key = IP_ATTEMPT_PREFIX + ipAddress;
    Object attempts = redisTemplate.opsForValue().get(key);
    return attempts != null ? ((Number) attempts).intValue() : 0;
  }

  private Long incrementAttempts(String key) {
    Long attempts = redisTemplate.opsForValue().increment(key, 1);

    // Set expiration on first attempt
    if (attempts != null && attempts == 1) {
      redisTemplate.expire(key, Duration.ofMinutes(attemptWindowMinutes));
    }

    return attempts != null ? attempts : 0L;
  }

  private void blockUser(String username) {
    String key = USER_BLOCKED_PREFIX + username;
    redisTemplate
        .opsForValue()
        .set(key, Instant.now().toString(), Duration.ofMinutes(lockoutDurationMinutes));
  }

  private void blockIp(String ipAddress) {
    String key = IP_BLOCKED_PREFIX + ipAddress;
    redisTemplate
        .opsForValue()
        .set(key, Instant.now().toString(), Duration.ofMinutes(lockoutDurationMinutes));
  }

  private void clearFailedAttempts(String username, String ipAddress) {
    String userKey = USER_ATTEMPT_PREFIX + username;
    String ipKey = IP_ATTEMPT_PREFIX + ipAddress;

    redisTemplate.delete(userKey);
    redisTemplate.delete(ipKey);
  }
}
