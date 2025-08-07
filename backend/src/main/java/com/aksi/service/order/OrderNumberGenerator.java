package com.aksi.service.order;

import java.time.Instant;

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

  private static final String PREFIX = "AKSI";
  private static final String SEPARATOR = "-";
  private static final String COUNTER_FORMAT = "%02d";

  private final OrderRepository orderRepository;

  /**
   * Generate unique order number Format: AKSI-{EPOCH_SECONDS}-{COUNTER}
   *
   * @return unique order number
   */
  public String generateOrderNumber() {
    long timestamp = Instant.now().getEpochSecond();
    int counter = 1;

    String orderNumber;
    do {
      orderNumber =
          PREFIX + SEPARATOR + timestamp + SEPARATOR + String.format(COUNTER_FORMAT, counter);
      counter++;
    } while (orderRepository.existsByOrderNumber(orderNumber));

    log.debug("Generated order number: {}", orderNumber);
    return orderNumber;
  }
}
