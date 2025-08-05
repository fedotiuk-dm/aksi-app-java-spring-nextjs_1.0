package com.aksi.service.user;

import org.springframework.stereotype.Component;

import com.aksi.domain.user.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Manages user account lifecycle operations. Encapsulates account management logic that was
 * previously in User entity.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class UserAccountManager {

  private final UserAuthenticationManager authenticationManager;

  /**
   * Activates a user account. Also resets failed login attempts when activating.
   *
   * @param user the user to activate
   * @throws IllegalStateException if user is already active
   */
  public void activateAccount(User user) {
    if (user.isActive()) {
      throw new IllegalStateException("User account is already active");
    }

    user.setActive(true);
    authenticationManager.resetFailedLoginAttempts(user);
    log.info("Activated user account: {}", user.getUsername());
  }

  /**
   * Deactivates a user account.
   *
   * @param user the user to deactivate
   * @throws IllegalStateException if user is already inactive
   */
  public void deactivateAccount(User user) {
    if (!user.isActive()) {
      throw new IllegalStateException("User account is already inactive");
    }

    user.setActive(false);
    log.info("Deactivated user account: {}", user.getUsername());
  }

  /**
   * Checks if account activation is allowed. Can be extended with additional business rules.
   *
   * @param user the user to check
   * @return true if activation is allowed
   */
  public boolean canActivateAccount(User user) {
    return !user.isActive();
  }

  /**
   * Checks if account deactivation is allowed. Can be extended with additional business rules
   * (e.g., prevent deactivating last admin).
   *
   * @param user the user to check
   * @return true if deactivation is allowed
   */
  public boolean canDeactivateAccount(User user) {
    return user.isActive();
  }

  /**
   * Verifies email for the user account.
   *
   * @param user the user whose email to verify
   */
  public void verifyEmail(User user) {
    if (user.isEmailVerified()) {
      log.debug("Email already verified for user: {}", user.getUsername());
      return;
    }

    user.setEmailVerified(true);
    log.info("Email verified for user: {}", user.getUsername());
  }
}
