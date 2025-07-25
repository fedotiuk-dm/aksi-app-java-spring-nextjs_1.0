package com.aksi.domain.auth.scheduled;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.aksi.domain.auth.service.RefreshTokenService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Scheduled task for cleaning up expired tokens */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(
    value = "app.scheduling.enabled",
    havingValue = "true",
    matchIfMissing = true)
public class TokenCleanupTask {

  private final RefreshTokenService refreshTokenService;

  /** Clean up expired tokens every hour */
  @Scheduled(fixedDelay = 3600000) // 1 hour
  public void cleanupExpiredTokens() {
    log.info("Starting expired tokens cleanup...");
    try {
      refreshTokenService.deleteExpiredTokens();
      log.info("Expired tokens cleanup completed");
    } catch (Exception e) {
      log.error("Error during expired tokens cleanup", e);
    }
  }
}
