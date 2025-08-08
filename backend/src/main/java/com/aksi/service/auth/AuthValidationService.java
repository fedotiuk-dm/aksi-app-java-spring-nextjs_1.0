package com.aksi.service.auth;

import java.util.regex.Pattern;

import org.springframework.security.authentication.DisabledException;
import org.springframework.stereotype.Service;

import com.aksi.domain.user.UserEntity;
import com.aksi.exception.BadRequestException;
import com.aksi.exception.UnauthorizedException;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Validation service for auth-related operations. Centralizes all authentication and session
 * validation logic.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthValidationService {

  private final SecurityContextService securityContextService;

  // Enhanced password validation pattern: at least 12 characters, uppercase, lowercase, digit,
  // special char
  private static final Pattern PASSWORD_PATTERN =
      Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{12,}$");

  /**
   * Validate if user is allowed to login.
   *
   * @param userEntity user to validate
   * @throws DisabledException if user is not allowed to login
   */
  public void validateUserCanLogin(UserEntity userEntity) {
    if (userEntity == null) {
      throw new DisabledException("User not found");
    }

    if (!userEntity.isActive()) {
      throw new DisabledException("User account is disabled");
    }

    // Additional validation logic can be added here:
    // - Check if account is locked due to failed login attempts
    // - Check if password needs to be changed
    // - Check if user has required roles
    // - Check if account has expired

    log.debug("User validation passed for: {}", userEntity.getUsername());
  }

  /**
   * Validate session for current request.
   *
   * @param session HTTP session
   * @throws UnauthorizedException if session is invalid
   */
  public void validateSession(HttpSession session) {
    if (session == null) {
      throw new UnauthorizedException("No session provided");
    }

    // Check if session has required attributes
    Object userId = session.getAttribute("USER_ID");
    if (userId == null) {
      throw new UnauthorizedException("Invalid session: no user ID");
    }

    Object username = session.getAttribute("USERNAME");
    if (username == null) {
      throw new UnauthorizedException("Invalid session: no username");
    }

    log.debug("Session validation passed for session: {}", session.getId());
  }

  /**
   * Validate consistency between session and security context.
   *
   * @param session HTTP session
   * @param requireContextAuth whether security context authentication is required
   * @throws UnauthorizedException if validation fails
   */
  public void validateSessionContextConsistency(HttpSession session, boolean requireContextAuth) {
    if (session == null) {
      if (requireContextAuth) {
        throw new UnauthorizedException("No session provided");
      }
      return;
    }

    // Get username from session
    String sessionUsername = (String) session.getAttribute("USERNAME");

    if (requireContextAuth) {
      // Validate security context
      if (!securityContextService.isAuthenticated()) {
        throw new UnauthorizedException("Security context not authenticated");
      }

      if (!securityContextService.isSecurityContextValid(session)) {
        throw new UnauthorizedException("Security context does not match session");
      }

      // Check username consistency
      String contextUsername = securityContextService.getCurrentUsername();
      if (sessionUsername != null
          && contextUsername != null
          && !sessionUsername.equals(contextUsername)) {
        log.warn(
            "Username mismatch detected: session='{}', context='{}'",
            sessionUsername,
            contextUsername);
        throw new UnauthorizedException("Session and context username mismatch");
      }
    }

    log.debug("Session-context consistency validated for user: {}", sessionUsername);
  }

  /**
   * Validate password strength and format according to enhanced security policy.
   *
   * @param password password to validate
   * @throws BadRequestException if password is invalid
   */
  public void validatePassword(String password) {
    if (password == null || password.trim().isEmpty()) {
      throw new BadRequestException("Password cannot be empty");
    }

    if (password.length() < 12) {
      throw new BadRequestException("Password must be at least 12 characters long");
    }

    if (password.length() > 128) {
      throw new BadRequestException("Password cannot be longer than 128 characters");
    }

    if (!PASSWORD_PATTERN.matcher(password).matches()) {
      throw new BadRequestException(
          "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&)");
    }

    // Check for common weak passwords
    if (isCommonPassword(password)) {
      throw new BadRequestException("Password is too common, please choose a stronger password");
    }

    log.debug("Password validation passed");
  }

  /**
   * Validate username format and requirements.
   *
   * @param username username to validate
   * @throws BadRequestException if username is invalid
   */
  public void validateUsername(String username) {
    if (username == null || username.trim().isEmpty()) {
      throw new BadRequestException("Username cannot be empty");
    }

    String trimmed = username.trim();
    if (trimmed.length() < 3) {
      throw new BadRequestException("Username must be at least 3 characters long");
    }

    if (trimmed.length() > 50) {
      throw new BadRequestException("Username cannot be longer than 50 characters");
    }

    // Username can contain letters, numbers, dots, hyphens, underscores
    if (!trimmed.matches("^[a-zA-Z0-9._-]+$")) {
      throw new BadRequestException(
          "Username can only contain letters, numbers, dots, hyphens, and underscores");
    }

    // Username cannot start or end with special characters
    if (trimmed.matches("^[._-].*") || trimmed.matches(".*[._-]$")) {
      throw new BadRequestException("Username cannot start or end with special characters");
    }

    log.debug("Username validation passed for: {}", trimmed);
  }

  /**
   * Validate session timeout and activity.
   *
   * @param session HTTP session
   * @throws UnauthorizedException if session is expired or inactive
   */
  public void validateSessionActivity(HttpSession session) {
    if (session == null) {
      throw new UnauthorizedException("No session provided");
    }

    long now = System.currentTimeMillis();
    long lastAccessed = session.getLastAccessedTime();
    int maxInactiveInterval = session.getMaxInactiveInterval();

    // Check if session has expired
    if (maxInactiveInterval > 0 && (now - lastAccessed) > (maxInactiveInterval * 1000L)) {
      log.warn("Session expired for session: {}", session.getId());
      throw new UnauthorizedException("Session has expired");
    }

    log.debug("Session activity validation passed for session: {}", session.getId());
  }

  /**
   * Check if password is in list of common weak passwords.
   *
   * @param password password to check
   * @return true if password is common/weak
   */
  private boolean isCommonPassword(String password) {
    String lower = password.toLowerCase();

    // List of common weak passwords
    String[] commonPasswords = {
      "password", "123456", "12345678", "qwerty", "abc123",
      "password123", "admin", "letmein", "welcome", "monkey",
      "1234567890", "dragon", "master", "123123", "admin123"
    };

    for (String common : commonPasswords) {
      if (lower.equals(common)) {
        return true;
      }
    }

    return false;
  }
}
