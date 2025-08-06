package com.aksi.service.auth;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.auth.dto.LoginRequest;
import com.aksi.domain.user.UserEntity;
import com.aksi.service.user.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service responsible for user authentication logic. Validates credentials and manages login
 * attempts.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {

  private final UserService userService;

  /**
   * Authenticate user with provided credentials.
   *
   * @param loginRequest login credentials
   * @return authenticated user entity
   * @throws BadCredentialsException if credentials are invalid
   * @throws DisabledException if user account is disabled
   */
  public UserEntity authenticate(LoginRequest loginRequest) {
    log.debug("Authenticating user: {}", loginRequest.getUsername());

    // Find user by username
    UserEntity userEntity =
        userService
            .findByUsername(loginRequest.getUsername())
            .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

    // Validate user can login
    validateUserCanLogin(userEntity);

    // Verify password
    if (!userService.verifyPassword(userEntity, loginRequest.getPassword())) {
      userService.recordFailedLogin(userEntity);
      throw new BadCredentialsException("Invalid username or password");
    }

    // Reset failed login attempts on successful authentication
    userService.resetFailedLogins(userEntity);

    log.info("Successfully authenticated user: {}", userEntity.getUsername());
    return userEntity;
  }

  /**
   * Validate if user is allowed to login.
   *
   * @param userEntity user to validate
   * @throws DisabledException if user is not allowed to login
   */
  public void validateUserCanLogin(UserEntity userEntity) {
    if (!userEntity.isActive()) {
      throw new DisabledException("User account is disabled");
    }

    // Additional validation logic can be added here:
    // - Check if account is locked
    // - Check if password needs to be changed
    // - Check if user has required roles
  }
}
