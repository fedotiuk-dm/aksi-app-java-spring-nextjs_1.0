package com.aksi.api.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import com.aksi.api.auth.dto.AuthResponse;
import com.aksi.api.auth.dto.LoginRequest;
import com.aksi.api.auth.dto.LogoutResponse;
import com.aksi.api.auth.dto.RefreshTokenRequest;
import com.aksi.domain.auth.service.AuthService;

import lombok.RequiredArgsConstructor;

/** HTTP Controller для AuthenticationApi Відповідальність: тільки HTTP делегація до AuthService. */
@Controller
@RequiredArgsConstructor
public class AuthenticationApiController implements AuthenticationApi {

  private final AuthService authService;

  @Override
  public ResponseEntity<AuthResponse> loginUser(LoginRequest loginRequest) {
    AuthResponse response = authService.authenticateUser(loginRequest);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<AuthResponse> refreshAccessToken(RefreshTokenRequest refreshTokenRequest) {
    AuthResponse response = authService.refreshAccessToken(refreshTokenRequest);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<LogoutResponse> logoutUser() {
    LogoutResponse response = authService.logoutUser(null);
    return ResponseEntity.ok(response);
  }
}
