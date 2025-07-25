package com.aksi.api.health.controller;

import java.time.Instant;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.info.BuildProperties;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.auth.service.AuthEventLogger;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Health check controller for system diagnostics */
@Slf4j
@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthCheckController {

  private final AuthEventLogger eventLogger;
  private final Environment environment;

  @Autowired(required = false)
  private BuildProperties buildProperties;

  @GetMapping("/check")
  public ResponseEntity<Map<String, Object>> healthCheck() {
    log.info("=== HEALTH CHECK STARTED ===");

    Map<String, Object> response = new HashMap<>();
    response.put("status", "UP");
    response.put("timestamp", Instant.now());
    response.put("activeProfiles", Arrays.asList(environment.getActiveProfiles()));

    // Test logging
    log.info("INFO log test - This should be visible");
    log.debug("DEBUG log test - This may not be visible");
    log.warn("WARN log test - This should be visible");

    // Test AuthEventLogger
    eventLogger.logAuthenticationAttempt();
    eventLogger.logDebug("Health check debug message");

    // Add build info if available
    if (buildProperties != null) {
      response.put("version", buildProperties.getVersion());
      response.put("name", buildProperties.getName());
    }

    // Log current user
    String username =
        org.springframework.security.core.context.SecurityContextHolder.getContext()
                    .getAuthentication()
                != null
            ? org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication()
                .getName()
            : "Anonymous";

    response.put("currentUser", username);

    log.info("=== HEALTH CHECK COMPLETED ===");

    return ResponseEntity.ok(response);
  }
}
