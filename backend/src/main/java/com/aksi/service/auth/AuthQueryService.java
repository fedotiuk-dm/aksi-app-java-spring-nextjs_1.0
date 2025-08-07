package com.aksi.service.auth;

import java.time.Instant;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.session.FindByIndexNameSessionRepository;
import org.springframework.session.Session;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.auth.dto.SessionInfo;
import com.aksi.domain.user.UserEntity;
import com.aksi.exception.UnauthorizedException;
import com.aksi.mapper.AuthMapper;
import com.aksi.service.user.UserService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Query service for auth-related read operations. Handles all authentication state inquiries and
 * session information retrieval.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class AuthQueryService {

  private final UserService userService;
  private final FindByIndexNameSessionRepository<? extends Session> sessionRepository;
  private final AuthMapper authMapper;
  private final SecurityContextService securityContextService;

  // Session attribute keys
  public static final String SESSION_USER_ID = "USER_ID";
  public static final String SESSION_USERNAME = "USERNAME";

  /**
   * Get current user from session.
   *
   * @param session HTTP session
   * @return user entity or null if not found
   */
  public UserEntity getCurrentUser(HttpSession session) {
    UUID userId = getUserIdFromSession(session);
    if (userId == null) {
      return null;
    }
    return userService.findById(userId).orElse(null);
  }

  /**
   * Get current session information.
   *
   * @param session HTTP session
   * @param userEntity current user
   * @return session info
   */
  public SessionInfo getSessionInfo(HttpSession session, UserEntity userEntity) {
    return authMapper.toSessionInfo(
        userEntity,
        session.getId(),
        Instant.ofEpochMilli(session.getCreationTime()),
        Instant.ofEpochMilli(session.getLastAccessedTime()),
        Instant.ofEpochMilli(
            session.getLastAccessedTime() + (session.getMaxInactiveInterval() * 1000L)));
  }

  /**
   * Get user ID from session.
   *
   * @param session HTTP session
   * @return user ID or null
   */
  public UUID getUserIdFromSession(HttpSession session) {
    if (session == null) {
      return null;
    }
    return (UUID) session.getAttribute(SESSION_USER_ID);
  }

  /**
   * Get username from session.
   *
   * @param session HTTP session
   * @return username or null
   */
  public String getUsernameFromSession(HttpSession session) {
    if (session == null) {
      return null;
    }
    return (String) session.getAttribute(SESSION_USERNAME);
  }

  /**
   * Check if session has valid authentication.
   *
   * @param session HTTP session
   * @return true if authenticated
   */
  public boolean isSessionAuthenticated(HttpSession session) {
    return session != null && session.getAttribute(SESSION_USER_ID) != null;
  }

  /**
   * Comprehensive authentication check combining session and security context validation.
   *
   * @param session HTTP session
   * @return true if fully authenticated
   */
  public boolean isAuthenticated(HttpSession session) {
    boolean sessionAuth = isSessionAuthenticated(session);
    boolean contextAuth = securityContextService.isAuthenticated();
    boolean contextValid = securityContextService.isSecurityContextValid(session);

    // Additional validation: check username consistency between session and context
    if (sessionAuth && contextAuth && contextValid && session != null) {
      String sessionUsername = getUsernameFromSession(session);
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

  /**
   * Get current customer ID from session when HttpSession is available directly. Alternative to
   * getCurrentUserIdFromContext() for controllers with session access. In current implementation,
   * customer ID equals user ID. TODO: Implement proper user-customer mapping when customer domain
   * is implemented.
   *
   * @param session HTTP session
   * @return customer ID or null
   */
  public UUID getCurrentCustomerId(HttpSession session) {
    return getUserIdFromSession(session);
  }

  /**
   * Get current user ID from Spring Security context. This method is useful when HttpSession is not
   * available but user is authenticated. Note: This assumes the username in SecurityContext is the
   * user ID.
   *
   * @return user ID
   * @throws UnauthorizedException if user is not authenticated
   */
  public UUID getCurrentUserIdFromContext() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null || !authentication.isAuthenticated()) {
      throw new UnauthorizedException("User is not authenticated");
    }

    String username = authentication.getName();
    if (username == null) {
      throw new UnauthorizedException("No username in security context");
    }

    // In our implementation, we store username in session and security context
    // We need to find the session by username to get the user ID
    var userSessions = sessionRepository.findByPrincipalName(username);
    if (userSessions.isEmpty()) {
      throw new UnauthorizedException("No active session found for user");
    }

    // Get the first session (most recent)
    Session session = userSessions.values().iterator().next();
    UUID userId = session.getAttribute(SESSION_USER_ID);

    if (userId == null) {
      throw new UnauthorizedException("User ID not found in session");
    }

    return userId;
  }

  /**
   * Check if user exists by ID.
   *
   * @param userId user ID
   * @return true if user exists
   */
  public boolean existsById(UUID userId) {
    return userService.findById(userId).isPresent();
  }
}
