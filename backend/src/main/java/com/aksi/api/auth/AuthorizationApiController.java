package com.aksi.api.auth;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.auth.dto.UserResponse;
import com.aksi.config.security.JwtAuthenticationToken;
import com.aksi.domain.auth.service.AuthService;

import lombok.RequiredArgsConstructor;

/** HTTP Controller для AuthorizationApi Відповідальність: тільки HTTP делегація до AuthService. */
@RestController
@RequiredArgsConstructor
public class AuthorizationApiController implements AuthorizationApi {

  private final AuthService authService;

  @Override
  public ResponseEntity<UserResponse> getCurrentUser() {
    // Get authentication from SecurityContext
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication instanceof JwtAuthenticationToken jwtAuth) {
      UUID userId = jwtAuth.getUserId();
      UserResponse response = authService.getCurrentUser(userId);
      return ResponseEntity.ok(response);
    }

    // This should not happen if the JWT filter is working correctly
    throw new IllegalStateException("No JWT authentication found in SecurityContext");
  }
}
