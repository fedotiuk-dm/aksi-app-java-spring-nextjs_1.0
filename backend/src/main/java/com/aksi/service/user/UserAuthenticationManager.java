package com.aksi.service.user;

import org.springframework.stereotype.Component;

import com.aksi.domain.user.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Manages user authentication related operations. Encapsulates authentication logic that was
 * previously in User entity.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class UserAuthenticationManager {

  // Business rule: lock account after 5 failed attempts
  private static final int MAX_FAILED_LOGIN_ATTEMPTS = 5;

  /**
   * Records a failed login attempt for a user. Automatically deactivates the user after maximum
   * attempts reached.
   *
   * @param user the user who failed to login
   * @return true if user was deactivated due to max attempts, false otherwise
   */
  public boolean recordFailedLoginAttempt(User user) {
    int attempts = user.getFailedLoginAttempts() + 1;
    user.setFailedLoginAttempts(attempts);

    if (attempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
      user.setActive(false);
      log.warn(
          "User '{}' has been deactivated after {} failed login attempts",
          user.getUsername(),
          attempts);
      return true;
    }

    log.debug("Failed login attempt {} for user '{}'", attempts, user.getUsername());
    return false;
  }

  /**
   * Resets failed login attempts for a user. Called after successful login.
   *
   * @param user the user to reset attempts for
   */
  public void resetFailedLoginAttempts(User user) {
    if (user.getFailedLoginAttempts() > 0) {
      user.setFailedLoginAttempts(0);
      log.debug("Reset failed login attempts for user '{}'", user.getUsername());
    }
  }

  /**
   * Checks if user account is locked due to failed login attempts.
   *
   * @param user the user to check
   * @return true if account is locked, false otherwise
   */
  public boolean isAccountLocked(User user) {
    return !user.isActive() && user.getFailedLoginAttempts() >= MAX_FAILED_LOGIN_ATTEMPTS;
  }

  /**
   * Gets the number of remaining login attempts before account lockout.
   *
   * @param user the user to check
   * @return number of remaining attempts
   */
  public int getRemainingLoginAttempts(User user) {
    return Math.max(0, MAX_FAILED_LOGIN_ATTEMPTS - user.getFailedLoginAttempts());
  }
}
