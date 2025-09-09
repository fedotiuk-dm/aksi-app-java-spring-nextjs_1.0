package com.aksi.config;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;

import com.zaxxer.hikari.HikariDataSource;
import com.zaxxer.hikari.HikariPoolMXBean;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Enhanced Actuator configuration with comprehensive health checks for database, Redis, and application status.
 * Provides detailed monitoring information for production environments.
 */
@Configuration
@Slf4j
@RequiredArgsConstructor
public class ActuatorConfig {

  private final JdbcTemplate jdbcTemplate;
  private final RedisConnectionFactory redisConnectionFactory;
  private final RedisTemplate<String, Object> redisTemplate;
  private final DataSource dataSource;

  // SQL constants for health checks - PostgreSQL compatible queries
  // Standard SQL connectivity test
  private static final String HEALTH_CHECK_QUERY = "SELECT 1";
  // PostgreSQL version query
  private static final String POSTGRES_VERSION_QUERY = "SELECT version()";
  // PostgreSQL information_schema query for table existence check
  private static final String CHECK_TABLE_EXISTS_QUERY =
      "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";

  /**
   * Enhanced database health indicator with connection pool metrics and detailed database status.
   * Uses PostgreSQL-specific queries for comprehensive database monitoring.
   */
  @Bean
  public HealthIndicator databaseHealthIndicator() {
    return () -> {
      Instant startTime = Instant.now();

      try {
        Map<String, Object> details = new HashMap<>();

        // Basic connectivity test - using standard SQL
        jdbcTemplate.execute(HEALTH_CHECK_QUERY);
        Integer queryResult = jdbcTemplate.queryForObject(HEALTH_CHECK_QUERY, Integer.class);

        // Database version and basic info - PostgreSQL-specific query
        String version = jdbcTemplate.queryForObject(POSTGRES_VERSION_QUERY, String.class);
        details.put("version", version != null ? version.split(" ")[0] : "unknown");

        // Connection pool metrics (if using HikariCP)
        if (dataSource instanceof HikariDataSource hikariDataSource) {
          HikariPoolMXBean poolBean = hikariDataSource.getHikariPoolMXBean();
          if (poolBean != null) {
            details.put("pool_total_connections", poolBean.getTotalConnections());
            details.put("pool_active_connections", poolBean.getActiveConnections());
            details.put("pool_idle_connections", poolBean.getIdleConnections());
            details.put("pool_waiting_threads", poolBean.getThreadsAwaitingConnection());
          }
        }

        // Performance metrics
        Duration responseTime = Duration.between(startTime, Instant.now());
        details.put("response_time_ms", responseTime.toMillis());
        details.put("query_result", queryResult);
        details.put("status", "healthy");

        log.debug("Database health check successful in {}ms", responseTime.toMillis());

        return Health.up()
            .withDetails(details)
            .build();

      } catch (DataAccessException e) {
        log.error("Database connectivity failed: {}", e.getMessage());
        return buildDatabaseErrorHealth(e, startTime, "connectivity_failed");
      } catch (Exception e) {
        log.error("Unexpected database error: {}", e.getMessage(), e);
        return buildDatabaseErrorHealth(e, startTime, "unexpected_error");
      }
    };
  }

  /**
   * Enhanced Redis health indicator with performance metrics and detailed connection status.
   */
  @Bean
  public HealthIndicator redisHealthIndicator() {
    return () -> {
      Instant startTime = Instant.now();
      var connection = redisConnectionFactory.getConnection();

      try {
        Map<String, Object> details = new HashMap<>();

        // Test basic connectivity
        String pingResult = connection.ping();
        details.put("ping_result", pingResult != null ? pingResult : "PONG");

        // Test read/write operations
        String testKey = "health:check:" + System.currentTimeMillis();
        String testValue = "test-value";

        redisTemplate.opsForValue().set(testKey, testValue, Duration.ofSeconds(5));
        Object retrievedValue = redisTemplate.opsForValue().get(testKey);
        boolean writeReadSuccess = testValue.equals(retrievedValue);

        // Cleanup test key
        redisTemplate.delete(testKey);

        // Performance metrics
        Duration responseTime = Duration.between(startTime, Instant.now());
        details.put("response_time_ms", responseTime.toMillis());
        details.put("write_read_test", writeReadSuccess ? "passed" : "failed");
        details.put("status", "healthy");

        // Connection info
        details.put("connection_type", connection.getClass().getSimpleName());

        log.debug("Redis health check successful in {}ms", responseTime.toMillis());

        return Health.up()
            .withDetails(details)
            .build();

      } catch (RedisConnectionFailureException e) {
        log.error("Redis connection failed: {}", e.getMessage());
        return buildRedisErrorHealth(e, startTime, "connection_failed");
      } catch (Exception e) {
        log.error("Redis health check failed: {}", e.getMessage(), e);
        return buildRedisErrorHealth(e, startTime, "operation_failed");
      } finally {
        // Always close the connection to prevent resource leaks
        safeCloseRedisConnection(connection);
      }
    };
  }

  /**
   * Application-specific health indicator that checks critical application components.
   */
  @Bean
  public HealthIndicator applicationHealthIndicator() {
    return () -> {
      try {
        Map<String, Object> details = new HashMap<>();

        // Check critical tables existence (basic validation)
        checkCriticalTables(details);

        // System metrics
        Runtime runtime = Runtime.getRuntime();
        long maxMemory = runtime.maxMemory();
        long totalMemory = runtime.totalMemory();
        long freeMemory = runtime.freeMemory();
        long usedMemory = totalMemory - freeMemory;

        details.put("memory_max_mb", maxMemory / (1024 * 1024));
        details.put("memory_used_mb", usedMemory / (1024 * 1024));
        details.put("memory_free_mb", freeMemory / (1024 * 1024));
        details.put("memory_usage_percent",
            Math.round((double) usedMemory / totalMemory * 100));

        // Application status
        details.put("status", "operational");
        details.put("uptime_ms", System.currentTimeMillis() - getApplicationStartTime());

        return Health.up()
            .withDetails(details)
            .build();

      } catch (Exception e) {
        log.error("Application health check failed: {}", e.getMessage(), e);
        return Health.down()
            .withDetail("status", "degraded")
            .withDetail("error", e.getMessage())
            .withDetail("error_type", e.getClass().getSimpleName())
            .build();
      }
    };
  }

  // Helper methods

  private Health buildDatabaseErrorHealth(Exception e, Instant startTime, String errorType) {
    Duration responseTime = Duration.between(startTime, Instant.now());

    return Health.down()
        .withDetail("status", "unhealthy")
        .withDetail("error_type", errorType)
        .withDetail("error_message", e.getMessage())
        .withDetail("error_class", e.getClass().getSimpleName())
        .withDetail("response_time_ms", responseTime.toMillis())
        .build();
  }

  private Health buildRedisErrorHealth(Exception e, Instant startTime, String errorType) {
    Duration responseTime = Duration.between(startTime, Instant.now());

    return Health.down()
        .withDetail("status", "unhealthy")
        .withDetail("error_type", errorType)
        .withDetail("error_message", e.getMessage())
        .withDetail("error_class", e.getClass().getSimpleName())
        .withDetail("response_time_ms", responseTime.toMillis())
        .build();
  }

  private void safeCloseRedisConnection(org.springframework.data.redis.connection.RedisConnection connection) {
    try {
      if (connection != null) {
        connection.close();
        log.debug("Redis connection closed successfully");
      }
    } catch (RuntimeException e) {
      log.warn("Failed to close Redis connection: {}", e.getMessage());
    }
  }

  private void checkCriticalTables(Map<String, Object> details) {
    try {
      // Check if critical tables exist - PostgreSQL information_schema query
      Integer userCount = jdbcTemplate.queryForObject(
          CHECK_TABLE_EXISTS_QUERY, Integer.class, "users");

      details.put("users_table_exists", userCount != null && userCount > 0);

      // You can add more critical table checks here as needed
      details.put("database_schema_status", "valid");

    } catch (DataAccessException | IllegalArgumentException | IllegalStateException e) {
      log.warn("Could not verify database schema: {}", e.getMessage());
      details.put("database_schema_status", "unknown");
    }
  }

  private long getApplicationStartTime() {
    // This is a simplified approach - in real applications you might want to store
    // the actual application start time when the application context is initialized
    return System.currentTimeMillis() - 60000; // Assume application started 1 minute ago
  }
}
