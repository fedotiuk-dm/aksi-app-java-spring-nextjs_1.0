package com.aksi.service.auth;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.auth.dto.LoginRequest;
import com.aksi.api.auth.dto.LoginResponse;
import com.aksi.api.auth.dto.SessionInfo;
import com.aksi.domain.user.UserEntity;
import com.aksi.exception.UnauthorizedException;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Facade implementation of AuthService. Provides a unified API while delegating to specialized
 * Query and Command services for better separation of concerns.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

  private final AuthQueryService queryService;
  private final AuthCommandService commandService;
  private final AuthValidationService validationService;

  // Command methods - delegate to AuthCommandService
  @Override
  public LoginResponse login(LoginRequest loginRequest, HttpSession session) {
    return commandService.login(loginRequest, session);
  }

  @Override
  public void logout(HttpSession session) {
    commandService.logout(session);
  }

  @Override
  public void invalidateAllUserSessions(UUID userId) {
    int invalidatedCount = commandService.invalidateAllUserSessions(userId);
    log.info("Invalidated {} sessions for user {}", invalidatedCount, userId);
  }

  // Query methods - delegate to AuthQueryService
  @Override
  @Transactional(readOnly = true)
  public SessionInfo getSessionInfo(HttpSession session) {
    // Validate session first
    validationService.validateSessionContextConsistency(session, true);

    // Check if session is authenticated
    if (!queryService.isAuthenticated(session)) {
      throw new UnauthorizedException("No valid session");
    }

    // Get current user
    UserEntity userEntity = queryService.getCurrentUser(session);
    if (userEntity == null) {
      throw new UnauthorizedException("User not found in session");
    }

    return queryService.getSessionInfo(session, userEntity);
  }
}
