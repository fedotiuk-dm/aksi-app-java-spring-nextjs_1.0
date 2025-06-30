package com.aksi.api.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import com.aksi.api.auth.dto.UserResponse;
import com.aksi.domain.auth.service.AuthService;

import lombok.RequiredArgsConstructor;

/** HTTP Controller для AuthorizationApi Відповідальність: тільки HTTP делегація до AuthService. */
@Controller
@RequiredArgsConstructor
public class AuthorizationApiController implements AuthorizationApi {

  private final AuthService authService;

  @Override
  public ResponseEntity<UserResponse> getCurrentUser() {
    UserResponse response = authService.getCurrentUserFromToken(null);
    return ResponseEntity.ok(response);
  }
}
