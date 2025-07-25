package com.aksi.domain.user.security;

import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.aksi.domain.user.entity.UserEntity;
import com.aksi.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Service for checking user-specific access permissions */
@Service("userSecurity")
@RequiredArgsConstructor
@Slf4j
public class UserSecurityService {

  private final UserRepository userRepository;

  /** Check if current user is the same as requested user - used in UserController */
  public boolean isCurrentUser(UUID userId) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    if (auth == null || !auth.isAuthenticated()) {
      return false;
    }

    String currentUsername = auth.getName();
    UserEntity currentUser = userRepository.findByUsername(currentUsername).orElse(null);

    boolean isCurrentUser = currentUser != null && currentUser.getId().equals(userId);

    if (isCurrentUser) {
      log.debug("User {} accessing own data", currentUsername);
    } else {
      log.debug("User {} is not the owner of user ID {}", currentUsername, userId);
    }

    return isCurrentUser;
  }
}
