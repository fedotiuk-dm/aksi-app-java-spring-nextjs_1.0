package com.aksi.security;

import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import com.aksi.exception.UnauthorizedException;

/** Utility class for security operations */
public final class SecurityUtils {

  private SecurityUtils() {
    // Utility class
  }

  /**
   * Get current authenticated user's customer ID
   *
   * @return Customer ID
   * @throws UnauthorizedException if user is not authenticated
   */
  public static UUID getCurrentCustomerId() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null || !authentication.isAuthenticated()) {
      throw new UnauthorizedException("User is not authenticated");
    }

    // TODO: Implement proper user/customer mapping
    // For now, extract customer ID from principal
    Object principal = authentication.getPrincipal();

    if (principal instanceof UserDetails userDetails) {
      // Assume username is customer ID for now
      try {
        return UUID.fromString(userDetails.getUsername());
      } catch (IllegalArgumentException e) {
        throw new UnauthorizedException("Invalid customer ID format");
      }
    }

    throw new UnauthorizedException("Unable to get customer ID from security context");
  }

  /**
   * Get current authenticated username
   *
   * @return Username
   */
  public static String getCurrentUsername() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
      return ((UserDetails) authentication.getPrincipal()).getUsername();
    }

    return authentication != null ? authentication.getName() : null;
  }

  /**
   * Check if current user is authenticated
   *
   * @return true if authenticated
   */
  public static boolean isAuthenticated() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    return authentication != null && authentication.isAuthenticated();
  }

  /**
   * Get current authenticated user's ID
   *
   * @return User ID
   * @throws UnauthorizedException if user is not authenticated
   */
  public static UUID getCurrentUserId() {
    // For now, return the same as customer ID
    // In a real implementation, this should map to the User entity ID
    return getCurrentCustomerId();
  }
}
