package com.aksi.service.auth;

import java.time.Instant;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.session.FindByIndexNameSessionRepository;
import org.springframework.session.Session;
import org.springframework.stereotype.Service;

import com.aksi.api.auth.dto.SessionInfo;
import com.aksi.domain.user.UserEntity;
import com.aksi.exception.UnauthorizedException;
import com.aksi.mapper.AuthMapper;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service responsible for session management operations. Handles session creation, validation, and
 * cleanup.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SessionManagementService {

  private final FindByIndexNameSessionRepository<? extends Session> sessionRepository;
  private final AuthMapper authMapper;

  // Session attribute keys
  public static final String SESSION_USER_ID = "USER_ID";
  public static final String SESSION_USERNAME = "USERNAME";
  public static final String SESSION_ROLES = "USER_ROLES";

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

    log.debug("Created session {} for user: {}", session.getId(), userEntity.getUsername());
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
    return (UUID) session.getAttribute(SESSION_USER_ID);
  }

  /**
   * Get username from session.
   *
   * @param session HTTP session
   * @return username or null
   */
  public String getUsernameFromSession(HttpSession session) {
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
   * Invalidate session.
   *
   * @param session HTTP session
   */
  public void invalidateSession(HttpSession session) {
    if (session != null) {
      String username = getUsernameFromSession(session);
      log.debug("Invalidating session {} for user: {}", session.getId(), username);
      session.invalidate();
    }
  }

  /**
   * Invalidate all sessions for a user.
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
}
