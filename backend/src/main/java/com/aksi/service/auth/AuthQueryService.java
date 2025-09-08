package com.aksi.service.auth;

import java.time.Instant;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.session.FindByIndexNameSessionRepository;
import org.springframework.session.Session;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.auth.dto.SessionInfo;
import com.aksi.domain.user.UserEntity;
import com.aksi.exception.UnauthorizedException;
import com.aksi.mapper.AuthMapper;
import com.aksi.repository.UserRepository;

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

  private final UserRepository userRepository;
  private final FindByIndexNameSessionRepository<? extends Session> sessionRepository;
  private final AuthMapper authMapper;
  private final AuthValidationService authValidationService;

  /** Session attribute key for user ID. */
  public static final String SESSION_USER_ID = "USER_ID";

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
   * Get current authenticated user entity.
   *
   * @return current user entity or null if not authenticated
   */
  public UserEntity getCurrentUser() {
    try {
      UUID userId = getCurrentUserIdFromContext();
      return userRepository.findById(userId).orElse(null);
    } catch (Exception e) {
      log.debug("Could not get current user: {}", e.getMessage());
      return null;
    }
  }

  /**
   * Get session info with full validation.
   *
   * @param session HTTP session
   * @return session information
   */
  public SessionInfo getSessionInfo(HttpSession session) {
    // Perform comprehensive validation
    authValidationService.validateSessionForInfoRetrieval(session);

    // Get current user (already validated in validateSessionForInfoRetrieval)
    UserEntity userEntity = getCurrentUser();

    return getSessionInfo(session, userEntity);
  }

  /**
   * Check if current context is authenticated.
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
}
