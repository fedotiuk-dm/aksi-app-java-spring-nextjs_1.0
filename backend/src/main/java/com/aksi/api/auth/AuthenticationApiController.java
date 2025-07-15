package com.aksi.api.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.auth.dto.AuthResponse;
import com.aksi.api.auth.dto.LoginRequest;
import com.aksi.api.auth.dto.LogoutResponse;
import com.aksi.api.auth.dto.RefreshTokenRequest;
import com.aksi.config.security.JwtAuthenticationToken;
import com.aksi.domain.auth.service.AuthService;

import lombok.RequiredArgsConstructor;

/** HTTP Controller для AuthenticationApi Відповідальність: тільки HTTP делегація до AuthService. */
@RestController
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
    // Get refresh token from authentication context if available
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String refreshToken = null;

    if (authentication instanceof JwtAuthenticationToken) {
      // For now, we don't have refresh token in JWT authentication
      // In future, could extract from request header or cookie
    }

    LogoutResponse response = authService.logoutUser(refreshToken);
    SecurityContextHolder.clearContext(); // Clear security context after logout
    return ResponseEntity.ok(response);
  }
}
