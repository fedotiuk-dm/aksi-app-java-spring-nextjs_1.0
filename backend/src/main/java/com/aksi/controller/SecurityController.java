package com.aksi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.security.SecurityApi;
import com.aksi.api.security.dto.SecurityAttemptsResponse;
import com.aksi.api.security.dto.SecurityPolicyResponse;
import com.aksi.service.security.SecurityService;

import lombok.RequiredArgsConstructor;

/** REST controller for security management endpoints. Thin layer between OpenAPI and service. */
@RestController
@RequiredArgsConstructor
public class SecurityController implements SecurityApi {

  private final SecurityService securityService;

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<SecurityAttemptsResponse> getSecurityAttempts() {
    SecurityAttemptsResponse response = securityService.getSecurityAttempts();
    return ResponseEntity.ok(response);
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> unlockUser(String username) {
    securityService.unlockUser(username);
    return ResponseEntity.ok().build();
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> unlockIp(String ipAddress) {
    securityService.unlockIp(ipAddress);
    return ResponseEntity.ok().build();
  }

  @Override
  public ResponseEntity<SecurityPolicyResponse> getSecurityPolicy() {
    SecurityPolicyResponse response = securityService.getSecurityPolicy();
    return ResponseEntity.ok(response);
  }
}
