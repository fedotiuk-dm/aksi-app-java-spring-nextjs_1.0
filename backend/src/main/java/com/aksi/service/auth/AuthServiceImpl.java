package com.aksi.service.auth;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.auth.dto.LoginRequest;
import com.aksi.api.auth.dto.LoginResponse;
import com.aksi.api.auth.dto.SessionInfo;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Implementation of AuthService that delegates to command and query services.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

  private final AuthQueryService queryService;
  private final AuthCommandService commandService;

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
    return queryService.getSessionInfo(session);
  }
}
