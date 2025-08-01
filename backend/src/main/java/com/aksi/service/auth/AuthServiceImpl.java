package com.aksi.service.auth;

import java.time.Instant;
import java.util.UUID;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.session.FindByIndexNameSessionRepository;
import org.springframework.session.Session;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.auth.dto.LoginRequest;
import com.aksi.api.auth.dto.LoginResponse;
import com.aksi.api.auth.dto.SessionInfo;
import com.aksi.domain.user.User;
import com.aksi.exception.UnauthorizedException;
import com.aksi.mapper.AuthMapper;
import com.aksi.service.user.UserService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Implementation of AuthService using Spring Security and Redis sessions. */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

  private final UserService userService;
  private final AuthMapper authMapper;
  private final FindByIndexNameSessionRepository<? extends Session> sessionRepository;

  private static final String SESSION_USER_ID = "USER_ID";
  private static final String SESSION_USERNAME = "USERNAME";
  private static final String SESSION_ROLES = "USER_ROLES";

  @Override
  public LoginResponse login(LoginRequest loginRequest, HttpSession session) {
    log.debug("Processing login for username: {}", loginRequest.getUsername());

    try {
      // Find user by username
      User user =
          userService
              .findByUsername(loginRequest.getUsername())
              .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

      // Check if user is active
      if (!user.isActive()) {
        throw new DisabledException("User account is disabled");
      }

      // Verify password
      if (!userService.verifyPassword(user, loginRequest.getPassword())) {
        userService.recordFailedLogin(user);
        throw new BadCredentialsException("Invalid username or password");
      }

      // Reset failed login attempts on successful login
      userService.resetFailedLogins(user);

      // Create session
      createUserSession(user, session);

      // Create response
      return authMapper.toLoginResponse(user);

    } catch (BadCredentialsException | DisabledException e) {
      log.warn("Login failed for user {}: {}", loginRequest.getUsername(), e.getMessage());
      throw new UnauthorizedException(e.getMessage());
    }
  }

  @Override
  public SessionInfo getSessionInfo(HttpSession session) {
    if (!checkAuthenticated(session)) {
      throw new UnauthorizedException("No valid session");
    }

    User user = getCurrentUser(session);
    if (user == null) {
      throw new UnauthorizedException("User not found in session");
    }

    return authMapper.toSessionInfo(
        user,
        session.getId(),
        Instant.ofEpochMilli(session.getCreationTime()),
        Instant.ofEpochMilli(session.getLastAccessedTime()),
        Instant.ofEpochMilli(
            session.getLastAccessedTime() + (session.getMaxInactiveInterval() * 1000L)));
  }

  @Override
  public void logout(HttpSession session) {
    if (session != null) {
      String username = (String) session.getAttribute(SESSION_USERNAME);
      log.debug("Logging out user: {}", username);

      // Clear security context
      SecurityContextHolder.clearContext();

      // Invalidate session
      session.invalidate();
    }
  }

  @Override
  public void invalidateAllUserSessions(UUID userId) {
    log.debug("Invalidating all sessions for user: {}", userId);

    User user =
        userService
            .findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

    // Find all sessions for this user
    var userSessionsMap = sessionRepository.findByPrincipalName(user.getUsername());

    // Delete all sessions
    userSessionsMap.forEach(
        (sessionId, session) -> {
          sessionRepository.deleteById(sessionId);
          log.debug("Deleted session: {} for user: {}", sessionId, user.getUsername());
        });

    log.info("Invalidated {} sessions for user: {}", userSessionsMap.size(), user.getUsername());
  }

  private User getCurrentUser(HttpSession session) {
    UUID userId = (UUID) session.getAttribute(SESSION_USER_ID);
    if (userId == null) {
      return null;
    }

    return userService.findById(userId).orElse(null);
  }

  private boolean checkAuthenticated(HttpSession session) {
    return session != null
        && session.getAttribute(SESSION_USER_ID) != null
        && SecurityContextHolder.getContext().getAuthentication() != null
        && SecurityContextHolder.getContext().getAuthentication().isAuthenticated();
  }

  private void createUserSession(User user, HttpSession session) {
    // Store user information in session
    session.setAttribute(SESSION_USER_ID, user.getId());
    session.setAttribute(SESSION_USERNAME, user.getUsername());
    session.setAttribute(SESSION_ROLES, user.getRoles());
    session.setAttribute(
        FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME, user.getUsername());

    // Create Spring Security authentication
    var authorities =
        user.getRoles().stream()
            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
            .toList();

    var authentication =
        new UsernamePasswordAuthenticationToken(user.getUsername(), null, authorities);

    // Set authentication in security context
    SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
    securityContext.setAuthentication(authentication);
    SecurityContextHolder.setContext(securityContext);

    // Store security context in session
    session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);

    log.debug("Created session for user: {} with roles: {}", user.getUsername(), user.getRoles());
  }
}
