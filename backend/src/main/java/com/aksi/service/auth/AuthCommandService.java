package com.aksi.service.auth;

import java.util.UUID;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.session.FindByIndexNameSessionRepository;
import org.springframework.session.Session;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.auth.dto.LoginRequest;
import com.aksi.api.auth.dto.LoginResponse;
import com.aksi.domain.user.UserEntity;
import com.aksi.exception.UnauthorizedException;
import com.aksi.mapper.AuthMapper;
import com.aksi.service.user.UserService;
import com.aksi.util.IpAddressUtil;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Command service for auth-related write operations. Handles all authentication state changes and
 * session modifications.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AuthCommandService {

  private final AuthenticationService authenticationService;
  private final SecurityContextService securityContextService;
  private final UserService userService;
  private final AuthMapper authMapper;
  private final FindByIndexNameSessionRepository<? extends Session> sessionRepository;
  private final SecurityEventAuditService securityEventAuditService;
  private final LoginAttemptService loginAttemptService;
  private final IpAddressUtil ipAddressUtil;

  // Session attribute keys
  private static final String SESSION_USER_ID = "USER_ID";
  private static final String SESSION_USERNAME = "USERNAME";
  private static final String SESSION_ROLES = "USER_ROLES";

  /**
   * Authenticate user and create session.
   *
   * @param loginRequest login credentials
   * @param session HTTP session
   * @return login response with user information
   * @throws UnauthorizedException if authentication fails
   */
  public LoginResponse login(LoginRequest loginRequest, HttpSession session) {
    try {
      // Authenticate user
      UserEntity userEntity = authenticationService.authenticate(loginRequest);

      // Create session and security context
      createSession(userEntity, session);
      securityContextService.createSecurityContext(userEntity, session);

      // Create response with security info
      LoginResponse response = authMapper.toLoginResponse(userEntity);
      response.setIsBlocked(false); // User is not blocked if login was successful
      response.setAttemptsRemaining(
          loginAttemptService.getRemainingAttempts(userEntity.getUsername()));
      response.setLockoutExpiresAt(null); // No lockout if login successful

      return response;

    } catch (BadCredentialsException | DisabledException e) {
      log.warn("Login failed for user {}: {}", loginRequest.getUsername(), e.getMessage());
      throw new UnauthorizedException(e.getMessage());
    }
  }

  /**
   * Logout user and clean up session and security context.
   *
   * @param session HTTP session
   */
  public void logout(HttpSession session) {
    // Log current user for audit purposes
    String currentUsername = securityContextService.getCurrentUsername();
    if (currentUsername != null) {
      log.info("User {} logging out", currentUsername);
    }

    // Clear security context
    securityContextService.clearSecurityContext();

    // Invalidate session (service handles null session)
    invalidateSession(session);
  }

  /**
   * Create session for authenticated user.
   *
   * @param userEntity authenticated user
   * @param session HTTP session
   */
  public void createSession(UserEntity userEntity, HttpSession session) {
    // Store user information in session
    session.setAttribute(SESSION_USER_ID, userEntity.getId());
    session.setAttribute(SESSION_USERNAME, userEntity.getUsername());
    session.setAttribute(SESSION_ROLES, userEntity.getRoles());
    session.setAttribute(
        FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME, userEntity.getUsername());

    // Store IP address for audit
    String ipAddress = ipAddressUtil.getClientIpAddress();
    session.setAttribute("IP_ADDRESS", ipAddress);

    log.debug("Created session {} for user: {}", session.getId(), userEntity.getUsername());

    // Log session creation event
    securityEventAuditService.logSessionEvent(
        "SESSION_CREATED", userEntity.getUsername(), session.getId(), ipAddress);
  }

  /**
   * Invalidate session.
   *
   * @param session HTTP session
   */
  public void invalidateSession(HttpSession session) {
    if (session != null) {
      try {
        String username = (String) session.getAttribute(SESSION_USERNAME);
        String sessionId = session.getId();
        String ipAddress = (String) session.getAttribute("IP_ADDRESS");

        log.debug("Invalidating session {} for user: {}", sessionId, username);
        session.invalidate();

        // Log session termination event
        if (username != null) {
          securityEventAuditService.logSessionEvent(
              "SESSION_TERMINATED", username, sessionId, ipAddress != null ? ipAddress : "Unknown");
        }
      } catch (IllegalStateException e) {
        log.debug("Session already invalidated: {}", e.getMessage());
      }
    }
  }

  /**
   * Invalidate all sessions for a user. Used for security purposes when needed to force logout from
   * all devices.
   *
   * @param userId user ID
   * @return number of invalidated sessions
   */
  public int invalidateAllUserSessions(UUID userId) {
    // Validate user exists
    UserEntity userEntity =
        userService
            .findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

    return invalidateAllUserSessions(userEntity.getUsername());
  }

  /**
   * Invalidate all sessions for a username.
   *
   * @param username username
   * @return number of invalidated sessions
   */
  public int invalidateAllUserSessions(String username) {
    log.info("Admin operation: Invalidating all sessions for user: {}", username);

    // Find all sessions for this user
    var userSessionsMap = sessionRepository.findByPrincipalName(username);

    // Delete all sessions
    userSessionsMap.forEach(
        (sessionId, session) -> {
          sessionRepository.deleteById(sessionId);
          log.info("Force deleted session: {} for user: {}", sessionId, username);
        });

    int count = userSessionsMap.size();
    log.warn("SECURITY: Force invalidated {} sessions for user: {}", count, username);
    return count;
  }
}
