package com.aksi.service.auth;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.auth.dto.LoginRequest;
import com.aksi.domain.user.UserEntity;
import com.aksi.service.user.UserService;
import com.aksi.util.IpAddressUtil;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service responsible for user authentication logic. Validates credentials and manages login
 * attempts with rate limiting and security audit logging.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {

  private final UserService userService;
  private final AuthValidationService validationService;
  private final LoginAttemptService loginAttemptService;
  private final IpAddressUtil ipAddressUtil;
  private final HttpServletRequest request;

  /**
   * Authenticate user with provided credentials.
   *
   * @param loginRequest login credentials
   * @return authenticated user entity
   * @throws BadCredentialsException if credentials are invalid
   * @throws DisabledException if user account is disabled
   */
  public UserEntity authenticate(LoginRequest loginRequest) {
    String username = loginRequest.getUsername();
    String ipAddress = ipAddressUtil.getClientIpAddress();
    String userAgent = request.getHeader("User-Agent");

    log.debug("Authenticating user: {} from IP: {}", username, ipAddress);

    // Check if user or IP is blocked due to failed attempts
    if (loginAttemptService.isUserBlocked(username)) {
      String message = "User account temporarily blocked due to multiple failed login attempts";
      loginAttemptService.recordFailedLogin(username, ipAddress, userAgent, "User blocked");
      throw new BadCredentialsException(message);
    }

    if (loginAttemptService.isIpBlocked(ipAddress)) {
      String message =
          "Access temporarily blocked due to multiple failed login attempts from this IP";
      loginAttemptService.recordFailedLogin(username, ipAddress, userAgent, "IP blocked");
      throw new BadCredentialsException(message);
    }

    // Find user by username
    UserEntity userEntity =
        userService
            .findByUsername(username)
            .orElseThrow(
                () -> {
                  loginAttemptService.recordFailedLogin(
                      username, ipAddress, userAgent, "Invalid username");
                  return new BadCredentialsException("Invalid username or password");
                });

    // Validate user can login
    try {
      validationService.validateUserCanLogin(userEntity);
    } catch (DisabledException e) {
      loginAttemptService.recordFailedLogin(username, ipAddress, userAgent, "User disabled");
      throw e;
    }

    // Verify password
    if (!userService.verifyPassword(userEntity, loginRequest.getPassword())) {
      userService.recordFailedLogin(userEntity);
      loginAttemptService.recordFailedLogin(username, ipAddress, userAgent, "Invalid password");
      throw new BadCredentialsException("Invalid username or password");
    }

    // Record successful login and clear failed attempts
    userService.resetFailedLogins(userEntity);
    loginAttemptService.recordSuccessfulLogin(username, ipAddress, userAgent);

    log.info("Successfully authenticated user: {} from IP: {}", username, ipAddress);
    return userEntity;
  }
}
