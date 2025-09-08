package com.aksi.service.auth;

import java.util.regex.Pattern;

import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.aksi.domain.user.UserEntity;
import com.aksi.exception.BadRequestException;
import com.aksi.exception.UnauthorizedException;
import com.aksi.repository.UserRepository;

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

  private final UserRepository userRepository;

  // Enhanced password validation pattern: at least 12 characters, uppercase, lowercase, digit,
  // special char
  private static final Pattern PASSWORD_PATTERN =
      Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{12,}$");

  /**
   * Check if current security context is authenticated.
   *
   * @return true if authenticated
   */
  public boolean isAuthenticated() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    return authentication != null && authentication.isAuthenticated();
  }

  /**
   * Get current authenticated username from security context.
   *
   * @return username or null if not authenticated
   */
  public String getCurrentUsername() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
      return ((UserDetails) authentication.getPrincipal()).getUsername();
    }
    return authentication != null ? authentication.getName() : null;
  }

  /**
   * Get current authenticated user entity.
   *
   * @return current user entity or null if not authenticated or user not found
   */
  public UserEntity getCurrentUser() {
    try {
      String username = getCurrentUsername();
      if (username == null) {
        return null;
      }
      return userRepository.findByUsername(username).orElse(null);
    } catch (Exception e) {
      log.debug("Could not get current user: {}", e.getMessage());
      return null;
    }
  }

  // Spring Security context session attribute key
  private static final String SPRING_SECURITY_CONTEXT = "SPRING_SECURITY_CONTEXT";

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
      if (!isAuthenticated()) {
        throw new UnauthorizedException("Security context not authenticated");
      }

      // Check if security context matches session
      SecurityContext sessionContext =
          (SecurityContext) session.getAttribute(SPRING_SECURITY_CONTEXT);
      SecurityContext currentContext = SecurityContextHolder.getContext();

      if (sessionContext == null || currentContext == null ||
          sessionContext.getAuthentication() == null || currentContext.getAuthentication() == null ||
          !sessionContext.getAuthentication().getName().equals(currentContext.getAuthentication().getName())) {
        throw new UnauthorizedException("Security context does not match session");
      }

      // Check username consistency
      String contextUsername = getCurrentUsername();
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
          "Password must contain at least one uppercase letter, one lowercase letter, "
              + "one digit, and one special character (@$!%*?&)");
    }

    // Check for common weak passwords
    if (checkCommonPassword(password)) {
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
   * Validate session for getting session info. Performs comprehensive validation.
   *
   * @param session HTTP session to validate
   * @throws UnauthorizedException if validation fails
   */
  public void validateSessionForInfoRetrieval(HttpSession session) {
    // Step 1: Validate session context consistency
    validateSessionContextConsistency(session, true);

    // Step 2: Check if session is authenticated
    if (!isAuthenticated(session)) {
      throw new UnauthorizedException("No valid session");
    }

    // Step 3: Check if current user exists
    UserEntity userEntity = getCurrentUser();
    if (userEntity == null) {
      throw new UnauthorizedException("User not found in session");
    }
  }

  /**
   * Check if session is authenticated.
   *
   * @param session HTTP session
   * @return true if authenticated
   */
  private boolean isAuthenticated(HttpSession session) {
    // Check session attributes
    Object userId = session.getAttribute("USER_ID");
    Object username = session.getAttribute("USERNAME");
    if (userId == null || username == null) {
      return false;
    }

    // Check Spring Security context
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    return authentication != null && authentication.isAuthenticated();
  }

  /**
   * Check if password is in list of common weak passwords.
   *
   * @param password password to check
   * @return true if password is common/weak
   */
  private boolean checkCommonPassword(String password) {
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
