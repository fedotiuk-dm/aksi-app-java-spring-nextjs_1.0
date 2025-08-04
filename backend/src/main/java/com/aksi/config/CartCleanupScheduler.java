package com.aksi.config;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.aksi.service.cart.CartService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Scheduled task for cleaning up expired carts
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CartCleanupScheduler {

  private final CartService cartService;

  /**
   * Clean up expired carts every hour
   */
  @Scheduled(fixedDelay = 3600000) // 1 hour in milliseconds
  public void cleanupExpiredCarts() {
    log.info("Starting expired carts cleanup");
    try {
      int deletedCount = cartService.cleanupExpiredCarts();
      log.info("Completed expired carts cleanup. Deleted {} carts", deletedCount);
    } catch (Exception e) {
      log.error("Error during expired carts cleanup", e);
    }
  }
}