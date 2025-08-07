package com.aksi.controller.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.aksi.api.auth.dto.PasswordPolicyInfo;
import com.aksi.api.auth.dto.RateLimitingPolicy;
import com.aksi.api.auth.dto.SecurityAttemptsResponse;
import com.aksi.api.auth.dto.SecurityPolicyResponse;
import com.aksi.api.auth.dto.SessionPolicyInfo;
import com.aksi.service.auth.LoginAttemptService;
import com.aksi.service.auth.SecurityEventAuditService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST controller for security management endpoints. Provides security monitoring, user unlocking,
 * and policy information.
 */
@RestController
@RequestMapping("/api/auth/security")
@RequiredArgsConstructor
@Slf4j
@Profile("!dev") // Disable this controller in dev mode
public class SecurityController {

  private final SecurityEventAuditService securityEventAuditService;
  private final LoginAttemptService loginAttemptService;

  @Value("${app.security.max-attempts-per-user:5}")
  private int maxAttemptsPerUser;

  @Value("${app.security.max-attempts-per-ip:10}")
  private int maxAttemptsPerIp;

  @Value("${app.security.lockout-duration-minutes:15}")
  private int lockoutDurationMinutes;

  @Value("${app.security.rate-limiting.enabled:true}")
  private boolean rateLimitingEnabled;

  @Value("${app.security.password.min-length:12}")
  private int passwordMinLength;

  @Value("${app.security.password.require-uppercase:true}")
  private boolean requireUppercase;

  @Value("${app.security.password.require-lowercase:true}")
  private boolean requireLowercase;

  @Value("${app.security.password.require-numbers:true}")
  private boolean requireNumbers;

  @Value("${app.security.password.require-special-chars:true}")
  private boolean requireSpecialChars;

  @Value("${app.security.password.allowed-special-chars:@$!%*?&}")
  private String allowedSpecialChars;

  @Value("${app.security.session.default-timeout-minutes:60}")
  private int sessionTimeoutMinutes;

  @Value("${app.security.session.max-concurrent-sessions:3}")
  private int maxConcurrentSessions;

  @Value("${app.security.session.remember-me-timeout-days:30}")
  private int rememberMeTimeoutDays;

  @Value("${app.security.session.session-fixation-protection:true}")
  private boolean sessionFixationProtection;

  /** Get security attempt statistics and monitoring data. */
  @GetMapping("/attempts")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<SecurityAttemptsResponse> getSecurityAttempts() {
    log.debug("Getting security attempts statistics");

    SecurityAttemptsResponse response = securityEventAuditService.getSecurityAttempts();

    return ResponseEntity.ok(response);
  }

  /** Unlock a blocked user account. */
  @PostMapping("/unlock/{username}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> unlockUser(@PathVariable String username) {
    log.info("Admin unlocking user: {}", username);

    loginAttemptService.unlockUser(username);

    return ResponseEntity.ok().build();
  }

  /** Unlock a blocked IP address. */
  @PostMapping("/unlock-ip/{ipAddress}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> unlockIp(@PathVariable String ipAddress) {
    log.info("Admin unlocking IP address: {}", ipAddress);

    loginAttemptService.unlockIp(ipAddress);

    return ResponseEntity.ok().build();
  }

  /** Get current security policy settings. */
  @GetMapping("/policy")
  public ResponseEntity<SecurityPolicyResponse> getSecurityPolicy() {
    log.debug("Getting security policy information");

    SecurityPolicyResponse response = new SecurityPolicyResponse();

    // Rate limiting policy
    RateLimitingPolicy rateLimiting = new RateLimitingPolicy();
    rateLimiting.setMaxAttemptsPerUser(maxAttemptsPerUser);
    rateLimiting.setMaxAttemptsPerIp(maxAttemptsPerIp);
    rateLimiting.setLockoutDurationMinutes(lockoutDurationMinutes);
    rateLimiting.setEnabled(rateLimitingEnabled);
    response.setRateLimiting(rateLimiting);

    // Password policy
    PasswordPolicyInfo passwordPolicy = new PasswordPolicyInfo();
    passwordPolicy.setMinLength(passwordMinLength);
    passwordPolicy.setRequireUppercase(requireUppercase);
    passwordPolicy.setRequireLowercase(requireLowercase);
    passwordPolicy.setRequireNumbers(requireNumbers);
    passwordPolicy.setRequireSpecialChars(requireSpecialChars);
    passwordPolicy.setAllowedSpecialChars(allowedSpecialChars);
    response.setPasswordPolicy(passwordPolicy);

    // Session policy
    SessionPolicyInfo sessionPolicy = new SessionPolicyInfo();
    sessionPolicy.setDefaultTimeoutMinutes(sessionTimeoutMinutes);
    sessionPolicy.setMaxConcurrentSessions(maxConcurrentSessions);
    sessionPolicy.setRememberMeTimeoutDays(rememberMeTimeoutDays);
    sessionPolicy.setSessionFixationProtection(sessionFixationProtection);
    response.setSessionPolicy(sessionPolicy);

    return ResponseEntity.ok(response);
  }
}
