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
import com.aksi.domain.user.util.UserSecurityUtils;
import com.aksi.shared.validation.ValidationConstants;

import lombok.extern.slf4j.Slf4j;

/** Health check controller for system diagnostics */
@Slf4j
@RestController
@RequestMapping("/api/health")
public class HealthCheckController {

  private final AuthEventLogger eventLogger;
  private final Environment environment;
  private final BuildProperties buildProperties;

  public HealthCheckController(
      AuthEventLogger eventLogger,
      Environment environment,
      @Autowired(required = false) BuildProperties buildProperties) {
    this.eventLogger = eventLogger;
    this.environment = environment;
    this.buildProperties = buildProperties;
  }

  @GetMapping("/check")
  public ResponseEntity<Map<String, Object>> healthCheck() {
    log.info(ValidationConstants.Controllers.HEALTH_CHECK_STARTED);

    Map<String, Object> response = new HashMap<>();
    response.put(
        ValidationConstants.Controllers.HEALTH_STATUS,
        ValidationConstants.Controllers.HEALTH_STATUS_UP);
    response.put(ValidationConstants.Controllers.HEALTH_TIMESTAMP, Instant.now());
    response.put(
        ValidationConstants.Controllers.HEALTH_ACTIVE_PROFILES,
        Arrays.asList(environment.getActiveProfiles()));

    // Test logging
    log.info(ValidationConstants.Controllers.INFO_LOG_TEST);
    log.debug(ValidationConstants.Controllers.DEBUG_LOG_TEST);
    log.warn(ValidationConstants.Controllers.WARN_LOG_TEST);

    // Test AuthEventLogger
    eventLogger.logAuthenticationAttempt();
    eventLogger.logDebug(ValidationConstants.Controllers.HEALTH_CHECK_DEBUG_MESSAGE);

    // Add build info if available
    if (buildProperties != null) {
      response.put(ValidationConstants.Controllers.HEALTH_VERSION, buildProperties.getVersion());
      response.put(ValidationConstants.Controllers.HEALTH_NAME, buildProperties.getName());
    }

    // Log current user
    response.put(
        ValidationConstants.Controllers.HEALTH_CURRENT_USER,
        UserSecurityUtils.getCurrentUsername());
    response.put(
        ValidationConstants.Controllers.HEALTH_IS_AUTHENTICATED,
        UserSecurityUtils.isAuthenticated());

    log.info(ValidationConstants.Controllers.HEALTH_CHECK_COMPLETED);

    return ResponseEntity.ok(response);
  }
}
