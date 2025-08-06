package com.aksi.service.auth;

import java.util.stream.Collectors;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.aksi.domain.user.UserEntity;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

/**
 * Service responsible for managing Spring Security context. Handles authentication tokens and
 * security context lifecycle.
 */
@Service
@Slf4j
public class SecurityContextService {

  private static final String SPRING_SECURITY_CONTEXT = "SPRING_SECURITY_CONTEXT";

  /**
   * Create and set security context for authenticated user.
   *
   * @param userEntity authenticated user
   * @param session HTTP session
   */
  public void createSecurityContext(UserEntity userEntity, HttpSession session) {
    // Create authorities from user roles
    var authorities =
        userEntity.getRoles().stream()
            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
            .collect(Collectors.toList());

    // Create authentication token
    var authentication =
        new UsernamePasswordAuthenticationToken(userEntity.getUsername(), null, authorities);

    // Create and set security context
    SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
    securityContext.setAuthentication(authentication);
    SecurityContextHolder.setContext(securityContext);

    // Store security context in session
    session.setAttribute(SPRING_SECURITY_CONTEXT, securityContext);

    log.debug(
        "Created security context for user: {} with roles: {}",
        userEntity.getUsername(),
        userEntity.getRoles());
  }

  /** Clear security context. */
  public void clearSecurityContext() {
    SecurityContextHolder.clearContext();
    log.debug("Cleared security context");
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
   * Check if security context matches session.
   *
   * @param session HTTP session
   * @return true if context matches session
   */
  public boolean isSecurityContextValid(HttpSession session) {
    if (session == null) {
      return false;
    }

    SecurityContext sessionContext =
        (SecurityContext) session.getAttribute(SPRING_SECURITY_CONTEXT);
    SecurityContext currentContext = SecurityContextHolder.getContext();

    return sessionContext != null
        && currentContext != null
        && sessionContext.getAuthentication() != null
        && currentContext.getAuthentication() != null
        && sessionContext
            .getAuthentication()
            .getName()
            .equals(currentContext.getAuthentication().getName());
  }

  /**
   * Get current authenticated username from security context. Useful for audit logging, validation,
   * and debugging purposes.
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
