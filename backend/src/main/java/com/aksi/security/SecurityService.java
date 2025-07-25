package com.aksi.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

/** Base security service for common security checks */
@Service("security")
@Slf4j
public class SecurityService {

  /** Check if current user has specific role */
  public boolean hasRole(String role) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    if (auth == null || !auth.isAuthenticated()) {
      return false;
    }

    String roleWithPrefix = role.startsWith("ROLE_") ? role : "ROLE_" + role;

    boolean hasRole =
        auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(roleWithPrefix));

    log.debug("Checking role {} for user {}: {}", role, auth.getName(), hasRole);

    return hasRole;
  }

  /** Check if current user has any of the specified roles */
  public boolean hasAnyRole(String... roles) {
    for (String role : roles) {
      if (hasRole(role)) {
        return true;
      }
    }
    return false;
  }

  /** Check if current user has all of the specified roles */
  public boolean hasAllRoles(String... roles) {
    for (String role : roles) {
      if (!hasRole(role)) {
        return false;
      }
    }
    return true;
  }

  /** Get current authenticated username */
  public String getCurrentUsername() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    return auth != null ? auth.getName() : null;
  }

  /** Check if user is authenticated */
  public boolean isAuthenticated() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    return auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser");
  }
}
