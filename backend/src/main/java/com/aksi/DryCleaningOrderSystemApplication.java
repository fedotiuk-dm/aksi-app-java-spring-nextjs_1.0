package com.aksi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main application class for AKSI Dry Cleaning Order System. This system manages dry cleaning
 * orders with Domain-Driven Design architecture and cookie-based authentication.
 */
@SpringBootApplication
@EnableJpaAuditing
public class DryCleaningOrderSystemApplication {

  public static void main(String[] args) {
    SpringApplication.run(DryCleaningOrderSystemApplication.class, args);
  }
}
