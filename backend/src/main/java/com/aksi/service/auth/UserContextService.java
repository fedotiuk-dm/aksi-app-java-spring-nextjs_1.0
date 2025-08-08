package com.aksi.service.auth;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.user.UserEntity;
import com.aksi.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for retrieving current user context Centralizes user context access across all services
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserContextService {

  private final AuthQueryService authQueryService;
  private final UserRepository userRepository;

  /**
   * Get current authenticated user entity
   *
   * @return current user entity or null if not authenticated
   */
  public UserEntity getCurrentUser() {
    try {
      UUID userId = authQueryService.getCurrentUserIdFromContext();
      return userRepository.findById(userId).orElse(null);
    } catch (Exception e) {
      log.debug("Could not get current user: {}", e.getMessage());
      return null;
    }
  }

}
