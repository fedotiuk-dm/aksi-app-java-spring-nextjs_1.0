package com.aksi.domain.user.util;

import java.time.Instant;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.aksi.domain.user.entity.UserEntity;
import com.aksi.shared.validation.ValidationConstants;

import lombok.experimental.UtilityClass;

/** Utility class for user security operations */
@UtilityClass
public final class UserSecurityUtils {

  /**
   * Check if user account is locked
   *
   * @param user the user entity
   * @return true if account is locked
   */
  public static boolean isAccountLocked(UserEntity user) {
    return user.getLockedUntil() != null && user.getLockedUntil().isAfter(Instant.now());
  }

  /**
   * Lock user account for default duration
   *
   * @param user the user entity
   */
  public static void lockAccount(UserEntity user) {
    lockAccount(user, ValidationConstants.User.ACCOUNT_LOCK_DURATION_MINUTES);
  }

  /**
   * Lock user account for specified duration
   *
   * @param user the user entity
   * @param lockDurationMinutes lock duration in minutes
   */
  public static void lockAccount(UserEntity user, int lockDurationMinutes) {
    Instant lockUntil = Instant.now().plusSeconds(lockDurationMinutes * 60L);
    user.setLockedUntil(lockUntil);
  }

  /**
   * Unlock user account
   *
   * @param user the user entity
   */
  public static void unlockAccount(UserEntity user) {
    user.setLockedUntil(null);
    user.setFailedLoginAttempts(0);
  }

  /**
   * Handle failed login attempt
   *
   * @param user the user entity
   * @param maxAttempts maximum allowed attempts before locking
   * @return true if account was locked due to exceeded attempts
   */
  public static boolean handleFailedLoginAttempt(UserEntity user, int maxAttempts) {
    int attempts = user.getFailedLoginAttempts() + 1;
    user.setFailedLoginAttempts(attempts);

    if (attempts >= maxAttempts) {
      lockAccount(user);
      return true;
    }
    return false;
  }

  /**
   * Handle successful login
   *
   * @param user the user entity
   */
  public static void handleSuccessfulLogin(UserEntity user) {
    user.setLastLoginAt(Instant.now());
    user.setFailedLoginAttempts(0);
  }

  /**
   * Check if user can login
   *
   * @param user the user entity
   * @return true if user can login (active and not locked)
   */
  public static boolean canLogin(UserEntity user) {
    return user.isActive() && !isAccountLocked(user);
  }

  /**
   * Get current authenticated username
   *
   * @return username or "Anonymous" if not authenticated
   */
  public static String getCurrentUsername() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    return auth != null
            && auth.isAuthenticated()
            && !ValidationConstants.Messages.ANONYMOUS_USER.equals(auth.getPrincipal())
        ? auth.getName()
        : ValidationConstants.Messages.ANONYMOUS_NAME;
  }

  /**
   * Check if current user is authenticated
   *
   * @return true if user is authenticated
   */
  public static boolean isAuthenticated() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    return auth != null
        && auth.isAuthenticated()
        && !ValidationConstants.Messages.ANONYMOUS_USER.equals(auth.getPrincipal());
  }
}
