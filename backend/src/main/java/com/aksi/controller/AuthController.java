package com.aksi.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.auth.AuthApi;
import com.aksi.api.auth.dto.LoginRequest;
import com.aksi.api.auth.dto.LoginResponse;
import com.aksi.api.auth.dto.SessionInfo;
import com.aksi.service.auth.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST controller for authentication endpoints. Thin layer between OpenAPI and service with
 * logging.
 */
@RestController
@RequiredArgsConstructor
@Slf4j
public class AuthController implements AuthApi {

  private final AuthService authService;
  private final HttpServletRequest request;

  @Override
  public ResponseEntity<LoginResponse> login(LoginRequest loginRequest) {
    log.info("Login attempt for username: {}", loginRequest.getUsername());

    HttpSession session = request.getSession(true);
    LoginResponse response = authService.login(loginRequest, session);

    log.info("Login successful for username: {}", loginRequest.getUsername());
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<Void> logout() {
    HttpSession session = request.getSession(false);
    log.info("Logout request from session: {}", session != null ? session.getId() : "no session");

    if (session != null) {
      authService.logout(session);
    }

    log.info("Logout completed");
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<SessionInfo> getCurrentSession() {
    log.debug("Getting current session info");

    HttpSession session = request.getSession(false);
    SessionInfo sessionInfo = authService.getSessionInfo(session);

    log.debug("Returning session info for user: {}", sessionInfo.getUsername());
    return ResponseEntity.ok(sessionInfo);
  }

  @Override
  public ResponseEntity<Void> invalidateAllSessions(UUID userId) {
    log.info("Invalidating all sessions for userId: {}", userId);

    authService.invalidateAllUserSessions(userId);

    log.info("All sessions invalidated for userId: {}", userId);
    return ResponseEntity.noContent().build();
  }
}
