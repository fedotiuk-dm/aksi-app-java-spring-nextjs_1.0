package com.aksi.service.auth;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.openapitools.jackson.nullable.JsonNullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.aksi.api.auth.dto.BlockedIp;
import com.aksi.api.auth.dto.BlockedUser;
import com.aksi.api.auth.dto.LoginAttempt;
import com.aksi.api.auth.dto.SecurityAttemptsResponse;
import com.aksi.api.auth.dto.SecurityOverview;

/**
 * Service for logging and retrieving security events and audit information. Provides comprehensive
 * logging of authentication-related security events.
 */
@Service
public class SecurityEventAuditService {

  private static final Logger securityLogger = LoggerFactory.getLogger("SECURITY_AUDIT");
  private static final Logger logger = LoggerFactory.getLogger(SecurityEventAuditService.class);

  private static final String DAILY_FAILED_ATTEMPTS_KEY = "daily_failed_attempts:";
  private static final String LOGIN_ATTEMPTS_LIST = "login_attempts_log";
  private static final String USER_BLOCKED_PREFIX = "user_blocked:";
  private static final String IP_BLOCKED_PREFIX = "ip_blocked:";
  private static final int MAX_STORED_ATTEMPTS = 100;

  private final RedisTemplate<String, Object> redisTemplate;

  public SecurityEventAuditService(RedisTemplate<String, Object> redisTemplate) {
    this.redisTemplate = redisTemplate;
  }

  /** Log successful login event. */
  public void logSuccessfulLogin(String username, String ipAddress, String userAgent) {
    String message =
        String.format(
            "SUCCESSFUL_LOGIN: user=%s, ip=%s, userAgent=%s",
            username, ipAddress, maskUserAgent(userAgent));
    securityLogger.info(message);

    // Store login attempt for statistics
    LoginAttempt attempt = createLoginAttempt(username, ipAddress, userAgent, true, null);
    storeLoginAttempt(attempt);
  }

  /** Log failed login event. */
  public void logFailedLogin(
      String username,
      String ipAddress,
      String userAgent,
      String failureReason,
      boolean userBlocked,
      boolean ipBlocked) {
    String message =
        String.format(
            "FAILED_LOGIN: user=%s, ip=%s, reason=%s, userBlocked=%s, ipBlocked=%s, userAgent=%s",
            username, ipAddress, failureReason, userBlocked, ipBlocked, maskUserAgent(userAgent));
    securityLogger.warn(message);

    // Increment daily failed attempts counter
    incrementDailyFailedAttempts();

    // Store login attempt for statistics
    LoginAttempt attempt = createLoginAttempt(username, ipAddress, userAgent, false, failureReason);
    storeLoginAttempt(attempt);

    // Log additional security events if blocking occurred
    if (userBlocked) {
      logUserBlocked(username, ipAddress);
    }
    if (ipBlocked) {
      logIpBlocked(ipAddress, username);
    }
  }

  /** Log user blocked event. */
  public void logUserBlocked(String username, String ipAddress) {
    String message = String.format("USER_BLOCKED: user=%s, ip=%s", username, ipAddress);
    securityLogger.error(message);
  }

  /** Log IP blocked event. */
  public void logIpBlocked(String ipAddress, String lastUsername) {
    String message = String.format("IP_BLOCKED: ip=%s, lastUser=%s", ipAddress, lastUsername);
    securityLogger.error(message);
  }

  /** Log user manually unlocked event. */
  public void logUserUnlocked(String username) {
    String message = String.format("USER_UNLOCKED: user=%s", username);
    securityLogger.info(message);
  }

  /** Log IP manually unlocked event. */
  public void logIpUnlocked(String ipAddress) {
    String message = String.format("IP_UNLOCKED: ip=%s", ipAddress);
    securityLogger.info(message);
  }

  /** Log session-related security events. */
  public void logSessionEvent(
      String eventType, String username, String sessionId, String ipAddress) {
    String message =
        String.format(
            "SESSION_EVENT: type=%s, user=%s, sessionId=%s, ip=%s",
            eventType, username, sessionId, ipAddress);
    securityLogger.info(message);
  }

  /** Log password change event. */
  public void logPasswordChange(String username, String ipAddress, boolean success) {
    String message =
        String.format("PASSWORD_CHANGE: user=%s, ip=%s, success=%s", username, ipAddress, success);
    if (success) {
      securityLogger.info(message);
    } else {
      securityLogger.warn(message);
    }
  }

  /** Get security attempts statistics for admin dashboard. */
  public SecurityAttemptsResponse getSecurityAttempts() {
    SecurityAttemptsResponse response = new SecurityAttemptsResponse();

    // Get overview statistics
    SecurityOverview overview = getSecurityOverview();
    response.setOverview(overview);

    // Get recent login attempts
    List<LoginAttempt> recentAttempts = getRecentLoginAttempts();
    response.setRecentAttempts(recentAttempts);

    // Get blocked users
    List<BlockedUser> blockedUsers = getBlockedUsers();
    response.setBlockedUsers(blockedUsers);

    // Get blocked IPs
    List<BlockedIp> blockedIps = getBlockedIps();
    response.setBlockedIps(blockedIps);

    return response;
  }

  private SecurityOverview getSecurityOverview() {
    SecurityOverview overview = new SecurityOverview();

    // Get today's failed attempts
    int todayFailedAttempts = getTodayFailedAttempts();
    overview.setTotalFailedAttemptsToday(todayFailedAttempts);

    // Count blocked users and IPs
    int blockedUsersCount = getBlockedUsersCount();
    int blockedIpsCount = getBlockedIpsCount();
    overview.setTotalBlockedUsers(blockedUsersCount);
    overview.setTotalBlockedIps(blockedIpsCount);

    // Calculate average attempts per hour (simplified)
    double averagePerHour = todayFailedAttempts / 24.0;
    overview.setAverageAttemptsPerHour(averagePerHour);

    // Set peak attempt time to current time (simplified - in real implementation,
    // this would track actual peak times)
    overview.setPeakAttemptTime(Instant.now());

    return overview;
  }

  private List<LoginAttempt> getRecentLoginAttempts() {
    try {
      List<Object> attemptObjects = redisTemplate.opsForList().range(LOGIN_ATTEMPTS_LIST, 0, 49);

      if (attemptObjects == null) {
        return new ArrayList<>();
      }

      List<LoginAttempt> attempts = new ArrayList<>();
      for (Object obj : attemptObjects) {
        if (obj instanceof LoginAttempt) {
          attempts.add((LoginAttempt) obj);
        }
      }
      return attempts;
    } catch (Exception e) {
      logger.error("Error retrieving recent login attempts", e);
      return new ArrayList<>();
    }
  }

  private List<BlockedUser> getBlockedUsers() {
    List<BlockedUser> blockedUsers = new ArrayList<>();

    try {
      Set<String> keys = redisTemplate.keys(USER_BLOCKED_PREFIX + "*");
      for (String key : keys) {
        String username = key.substring(USER_BLOCKED_PREFIX.length());
        BlockedUser blockedUser = createBlockedUser(username, key);
        if (blockedUser != null) {
          blockedUsers.add(blockedUser);
        }
      }
    } catch (Exception e) {
      logger.error("Error retrieving blocked users", e);
    }

    return blockedUsers;
  }

  private List<BlockedIp> getBlockedIps() {
    List<BlockedIp> blockedIps = new ArrayList<>();

    try {
      Set<String> keys = redisTemplate.keys(IP_BLOCKED_PREFIX + "*");
      for (String key : keys) {
        String ipAddress = key.substring(IP_BLOCKED_PREFIX.length());
        BlockedIp blockedIp = createBlockedIp(ipAddress, key);
        if (blockedIp != null) {
          blockedIps.add(blockedIp);
        }
      }
    } catch (Exception e) {
      logger.error("Error retrieving blocked IPs", e);
    }

    return blockedIps;
  }

  private BlockedUser createBlockedUser(String username, String key) {
    try {
      // Get TTL from Redis to calculate lockout expiration
      long ttl = redisTemplate.getExpire(key, java.util.concurrent.TimeUnit.SECONDS);
      if (ttl <= 0) {
        return null;
      }

      Instant lockoutExpiration = Instant.now().plusSeconds(ttl);

      BlockedUser blockedUser = new BlockedUser();
      blockedUser.setUsername(username);

      // Get failed attempts count from attempts key
      String attemptsKey = "login_attempts:user:" + username;
      Object attempts = redisTemplate.opsForValue().get(attemptsKey);
      blockedUser.setFailedAttempts(attempts != null ? ((Number) attempts).intValue() : 5);

      blockedUser.setLastAttemptAt(Instant.now()); // Simplified
      blockedUser.setBlockedUntil(lockoutExpiration);
      blockedUser.setLastAttemptIp("192.168.1.1"); // Would be stored in real implementation

      return blockedUser;
    } catch (Exception e) {
      logger.error("Error creating BlockedUser for username: {}", username, e);
      return null;
    }
  }

  private BlockedIp createBlockedIp(String ipAddress, String key) {
    try {
      // Get TTL from Redis to calculate lockout expiration
      long ttl = redisTemplate.getExpire(key, java.util.concurrent.TimeUnit.SECONDS);
      if (ttl <= 0) {
        return null;
      }

      Instant lockoutExpiration = Instant.now().plusSeconds(ttl);

      BlockedIp blockedIp = new BlockedIp();
      blockedIp.setIpAddress(ipAddress);

      // Get failed attempts count from attempts key
      String attemptsKey = "login_attempts:ip:" + ipAddress;
      Object attempts = redisTemplate.opsForValue().get(attemptsKey);
      blockedIp.setFailedAttempts(attempts != null ? ((Number) attempts).intValue() : 10);

      blockedIp.setLastAttemptAt(Instant.now()); // Simplified
      blockedIp.setBlockedUntil(lockoutExpiration);
      blockedIp.setLocation(JsonNullable.of("Kiev, Ukraine")); // Would use IP geolocation service
      blockedIp.setLastUsername(
          JsonNullable.of("unknown")); // Would be stored in real implementation

      return blockedIp;
    } catch (Exception e) {
      logger.error("Error creating BlockedIp for address: {}", ipAddress, e);
      return null;
    }
  }

  private LoginAttempt createLoginAttempt(
      String username, String ipAddress, String userAgent, boolean success, String failureReason) {
    LoginAttempt attempt = new LoginAttempt();
    attempt.setTimestamp(Instant.now());
    attempt.setUsername(username);
    attempt.setIpAddress(ipAddress);
    attempt.setUserAgent(JsonNullable.of(userAgent));
    attempt.setLocation(JsonNullable.of("Kiev, Ukraine")); // Would use IP geolocation service
    attempt.setSuccess(success);
    attempt.setFailureReason(JsonNullable.of(failureReason));

    return attempt;
  }

  private void storeLoginAttempt(LoginAttempt attempt) {
    try {
      redisTemplate.opsForList().leftPush(LOGIN_ATTEMPTS_LIST, attempt);
      redisTemplate.opsForList().trim(LOGIN_ATTEMPTS_LIST, 0, MAX_STORED_ATTEMPTS - 1);
    } catch (Exception e) {
      logger.error("Error storing login attempt", e);
    }
  }

  private void incrementDailyFailedAttempts() {
    String today = LocalDate.now(ZoneOffset.UTC).toString();
    String key = DAILY_FAILED_ATTEMPTS_KEY + today;
    redisTemplate.opsForValue().increment(key, 1);

    // Set expiration for cleanup (keep for 30 days)
    redisTemplate.expire(key, java.time.Duration.ofDays(30));
  }

  private int getTodayFailedAttempts() {
    String today = LocalDate.now(ZoneOffset.UTC).toString();
    String key = DAILY_FAILED_ATTEMPTS_KEY + today;
    Object value = redisTemplate.opsForValue().get(key);
    return value != null ? ((Number) value).intValue() : 0;
  }

  private int getBlockedUsersCount() {
    try {
      Set<String> keys = redisTemplate.keys(USER_BLOCKED_PREFIX + "*");
      return keys.size();
    } catch (Exception e) {
      logger.error("Error counting blocked users", e);
      return 0;
    }
  }

  private int getBlockedIpsCount() {
    try {
      Set<String> keys = redisTemplate.keys(IP_BLOCKED_PREFIX + "*");
      return keys.size();
    } catch (Exception e) {
      logger.error("Error counting blocked IPs", e);
      return 0;
    }
  }

  private String maskUserAgent(String userAgent) {
    if (userAgent == null || userAgent.length() <= 50) {
      return userAgent;
    }
    return userAgent.substring(0, 50) + "...";
  }
}
