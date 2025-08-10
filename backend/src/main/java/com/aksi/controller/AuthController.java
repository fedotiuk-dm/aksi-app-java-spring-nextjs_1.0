package com.aksi.controller;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.auth.AuthApi;
import com.aksi.api.auth.dto.LoginRequest;
import com.aksi.api.auth.dto.LoginResponse;
import com.aksi.api.auth.dto.ServerTimeResponse;
import com.aksi.api.auth.dto.SessionInfo;
import com.aksi.service.auth.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

/** REST controller for authentication endpoints. Thin layer between OpenAPI and service. */
@RestController
@RequiredArgsConstructor
public class AuthController implements AuthApi {

  private final AuthService authService;
  private final HttpServletRequest request;

  @Override
  public ResponseEntity<LoginResponse> login(LoginRequest loginRequest) {
    HttpSession session = request.getSession(true);
    LoginResponse response = authService.login(loginRequest, session);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<Void> logout() {
    HttpSession session = request.getSession(false);
    authService.logout(session);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<SessionInfo> getCurrentSession() {
    HttpSession session = request.getSession(false);
    SessionInfo sessionInfo = authService.getSessionInfo(session);
    return ResponseEntity.ok(sessionInfo);
  }

  @Override
  public ResponseEntity<Void> invalidateAllSessions(UUID userId) {
    authService.invalidateAllUserSessions(userId);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<ServerTimeResponse> getServerTime() {
    Instant now = Instant.now();
    ZoneId serverZone = ZoneId.of("Europe/Kiev");
    ZonedDateTime serverTime = now.atZone(serverZone);

    ServerTimeResponse response =
        new ServerTimeResponse()
            .timestamp(now) // Instant object
            .epochMillis(now.toEpochMilli()) // Long
            .timezone(serverZone.toString()) // String
            .utcOffset(serverTime.getOffset().toString()) // String
            .date(serverTime.toLocalDate()) // LocalDate
            .time(serverTime.toLocalTime().toString()); // String

    return ResponseEntity.ok(response);
  }
}
