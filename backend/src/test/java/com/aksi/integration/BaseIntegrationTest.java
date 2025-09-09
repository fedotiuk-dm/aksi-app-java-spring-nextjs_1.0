package com.aksi.integration;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * Base class for integration tests with Testcontainers.
 * Provides PostgreSQL and Redis containers for testing.
 */
@SpringBootTest
@Testcontainers
public abstract class BaseIntegrationTest {

  @Container
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:17-alpine")
      .withDatabaseName("aksi_test")
      .withUsername("aksi_test")
      .withPassword("test_password")
      .withReuse(true);

  @Container
  static GenericContainer<?> redis = new GenericContainer<>("redis:8-alpine")
      .withExposedPorts(6379)
      .withReuse(true);

  @DynamicPropertySource
  static void configureProperties(DynamicPropertyRegistry registry) {
    // PostgreSQL properties
    registry.add("spring.datasource.url", postgres::getJdbcUrl);
    registry.add("spring.datasource.username", postgres::getUsername);
    registry.add("spring.datasource.password", postgres::getPassword);
    registry.add("spring.datasource.driver-class-name", postgres::getDriverClassName);

    // Redis properties
    registry.add("spring.data.redis.host", redis::getHost);
    registry.add("spring.data.redis.port", () -> redis.getMappedPort(6379));

    // Liquibase properties
    registry.add("spring.liquibase.enabled", () -> "true");

    // Disable rate limiting for tests
    registry.add("app.security.rate-limiting.enabled", () -> "false");

    // Test-specific configurations
    registry.add("app.file-storage.upload-dir", () -> "target/test-uploads");

    // Logging for tests
    registry.add("logging.level.com.aksi", () -> "DEBUG");
    registry.add("logging.level.org.springframework.test", () -> "DEBUG");
    registry.add("logging.level.org.testcontainers", () -> "INFO");
  }
}
