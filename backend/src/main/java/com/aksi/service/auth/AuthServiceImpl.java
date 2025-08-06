package com.aksi.service.auth;

import java.util.UUID;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.auth.dto.LoginRequest;
import com.aksi.api.auth.dto.LoginResponse;
import com.aksi.api.auth.dto.SessionInfo;
import com.aksi.domain.user.UserEntity;
import com.aksi.exception.UnauthorizedException;
import com.aksi.mapper.AuthMapper;
import com.aksi.service.user.UserService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Facade implementation of AuthService. Provides a unified API while delegating to specialized
 * services.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

  private final AuthenticationService authenticationService;
  private final SessionManagementService sessionManagementService;
  private final SecurityContextService securityContextService;
  private final UserService userService;
  private final AuthMapper authMapper;

  @Override
  public LoginResponse login(LoginRequest loginRequest, HttpSession session) {
    try {
      // Authenticate user
      UserEntity userEntity = authenticationService.authenticate(loginRequest);

      // Create session and security context
      sessionManagementService.createSession(userEntity, session);
      securityContextService.createSecurityContext(userEntity, session);

      // Create response
      return authMapper.toLoginResponse(userEntity);

    } catch (BadCredentialsException | DisabledException e) {
      log.warn("Login failed for user {}: {}", loginRequest.getUsername(), e.getMessage());
      throw new UnauthorizedException(e.getMessage());
    }
  }

  @Override
  @Transactional(readOnly = true)
  public SessionInfo getSessionInfo(HttpSession session) {
    // Log current context username for audit
    String contextUsername = securityContextService.getCurrentUsername();
    log.debug("Session info requested by user: {}", contextUsername);

    // Validate session
    if (!isAuthenticated(session)) {
      throw new UnauthorizedException("No valid session");
    }

    // Get current user
    UserEntity userEntity = getCurrentUser(session);
    if (userEntity == null) {
      throw new UnauthorizedException("User not found in session");
    }

    return sessionManagementService.getSessionInfo(session, userEntity);
  }

  @Override
  public void logout(HttpSession session) {
    // Log current user for audit purposes
    String currentUsername = securityContextService.getCurrentUsername();
    if (currentUsername != null) {
      log.info("User {} logging out", currentUsername);
    }

    // Clear security context
    securityContextService.clearSecurityContext();

    // Invalidate session (service handles null session)
    sessionManagementService.invalidateSession(session);
  }

  @Override
  public void invalidateAllUserSessions(UUID userId) {
    UserEntity userEntity =
        userService
            .findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

    int invalidatedCount =
        sessionManagementService.invalidateAllUserSessions(userEntity.getUsername());
    log.info("Invalidated {} sessions for user {}", invalidatedCount, userEntity.getUsername());
  }

  /** Get current user from session. */
  private UserEntity getCurrentUser(HttpSession session) {
    UUID userId = sessionManagementService.getUserIdFromSession(session);
    if (userId == null) {
      return null;
    }
    return userService.findById(userId).orElse(null);
  }

  /** Check if session is authenticated. */
  private boolean isAuthenticated(HttpSession session) {
    boolean sessionAuth = sessionManagementService.isSessionAuthenticated(session);
    boolean contextAuth = securityContextService.isAuthenticated();
    boolean contextValid = securityContextService.isSecurityContextValid(session);

    // Additional validation: check username consistency between session and context
    if (sessionAuth && contextAuth && contextValid && session != null) {
      String sessionUsername = sessionManagementService.getUsernameFromSession(session);
      String contextUsername = securityContextService.getCurrentUsername();

      if (sessionUsername != null
          && contextUsername != null
          && !sessionUsername.equals(contextUsername)) {
        log.warn("Username mismatch: session={}, context={}", sessionUsername, contextUsername);
        return false;
      }
    }

    return sessionAuth && contextAuth && contextValid;
  }
}
