package com.aksi.service.order;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.aksi.repository.OrderRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for generating unique order numbers Separated from OrderService to follow SRP principle
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderNumberGenerator {

  private final OrderRepository orderRepository;

  @Value("${app.order.number-prefix:ORD}")
  private String orderNumberPrefix;

  /**
   * Generate unique order number Format: {PREFIX}-{TIMESTAMP}-{RANDOM_3_DIGITS}
   *
   * @return unique order number
   */
  public String generateOrderNumber() {
    // Use epoch seconds for timestamp
    long timestamp = Instant.now().getEpochSecond();
    String orderNumber;
    int attempts = 0;
    int maxAttempts = 100; // Prevent infinite loop

    do {
      orderNumber = buildOrderNumber(timestamp);
      attempts++;

      if (attempts > maxAttempts) {
        log.warn("Failed to generate unique order number after {} attempts", maxAttempts);
        // Use milliseconds for better uniqueness
        timestamp = Instant.now().toEpochMilli();
      }
    } while (orderRepository.existsByOrderNumber(orderNumber) && attempts <= maxAttempts);

    if (attempts > maxAttempts) {
      throw new IllegalStateException(
          "Unable to generate unique order number after " + maxAttempts + " attempts");
    }

    log.debug("Generated order number {} in {} attempts", orderNumber, attempts);
    return orderNumber;
  }

  /**
   * Build order number with given timestamp
   *
   * @param timestamp timestamp to use
   * @return formatted order number
   */
  private String buildOrderNumber(long timestamp) {
    return orderNumberPrefix
        + "-"
        + timestamp
        + "-"
        + String.format("%03d", (int) (Math.random() * 1000));
  }

  /**
   * Validate order number format
   *
   * @param orderNumber order number to validate
   * @return true if valid format
   */
  public boolean isValidOrderNumberFormat(String orderNumber) {
    if (orderNumber == null || orderNumber.trim().isEmpty()) {
      return false;
    }

    // Expected format: PREFIX-TIMESTAMP-XXX
    String pattern = "^" + orderNumberPrefix + "-\\d+-\\d{3}$";
    return orderNumber.matches(pattern);
  }

  /**
   * Extract timestamp from order number
   *
   * @param orderNumber order number
   * @return timestamp or -1 if invalid
   */
  public long extractTimestamp(String orderNumber) {
    try {
      if (!isValidOrderNumberFormat(orderNumber)) {
        return -1;
      }

      String[] parts = orderNumber.split("-");
      if (parts.length >= 3) {
        return Long.parseLong(parts[1]);
      }
    } catch (NumberFormatException e) {
      log.debug("Failed to extract timestamp from order number: {}", orderNumber);
    }

    return -1;
  }
}
