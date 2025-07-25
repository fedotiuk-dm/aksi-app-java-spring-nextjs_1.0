package com.aksi.domain.auth.service;

import org.springframework.security.core.userdetails.UserDetailsService;

/** Interface for providing user details to auth domain Should be implemented by user domain */
public interface UserDetailsProvider extends UserDetailsService {

  /**
   * Check if user exists by username
   *
   * @param username username or email
   * @return true if exists
   */
  boolean existsByUsername(String username);
}
