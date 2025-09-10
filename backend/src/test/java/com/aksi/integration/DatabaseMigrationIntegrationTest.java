package com.aksi.integration;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import lombok.extern.slf4j.Slf4j;

/**
 * Integration test to verify Liquibase migrations work correctly with Testcontainers.
 */
@Slf4j
@TestPropertySource(properties = {
    "spring.profiles.active=test",
    "logging.level.liquibase=DEBUG"
})
@ActiveProfiles("integration-test")
class DatabaseMigrationIntegrationTest extends BaseIntegrationTest {

  @Value("${spring.datasource.url}")
  private String jdbcUrl;

  @Value("${spring.datasource.username}")
  private String username;

  @Value("${spring.datasource.password}")
  private String password;

  @Test
  void shouldExecuteLiquibaseMigrationsSuccessfully() throws Exception {
    log.info("Testing Liquibase migrations with Testcontainers");

    // Verify connection to PostgreSQL container
    try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password)) {
      log.info("Successfully connected to PostgreSQL test database");

      // Check if essential tables exist
      checkTableExists(connection, "users");
      checkTableExists(connection, "user_roles");
      checkTableExists(connection, "refresh_tokens");
      checkTableExists(connection, "databasechangelog");
      checkTableExists(connection, "databasechangeloglock");

      // Verify databasechangelog has entries
      try (PreparedStatement stmt = connection.prepareStatement(
          "SELECT COUNT(*) as migration_count FROM databasechangelog");
           ResultSet rs = stmt.executeQuery()) {

        if (rs.next()) {
          int migrationCount = rs.getInt("migration_count");
          log.info("Found {} migrations executed", migrationCount);
          assertThat(migrationCount).isGreaterThan(0);
        }
      }
    }

    log.info("✅ Liquibase migrations test completed successfully");
  }

  @Test
  void shouldHaveValidDatabaseConstraints() throws Exception {
    log.info("Testing database constraints");

    try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password)) {
      // Check if constraints exist (primary keys, foreign keys, etc.)
      try (PreparedStatement stmt = connection.prepareStatement(
          "SELECT conname, contype FROM pg_constraint WHERE conname LIKE '%users%' OR conname LIKE '%user_roles%'");
           ResultSet rs = stmt.executeQuery()) {

        boolean hasConstraints = false;
        while (rs.next()) {
          hasConstraints = true;
          String constraintName = rs.getString("conname");
          String constraintType = rs.getString("contype");
          log.info("Found constraint: {} (type: {})", constraintName, constraintType);
        }

        assertThat(hasConstraints).isTrue();
      }
    }

    log.info("✅ Database constraints test completed successfully");
  }

  @Test
  void shouldBeAbleToInsertAndQueryTestData() throws Exception {
    log.info("Testing basic CRUD operations");

    try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password)) {
      // Test INSERT
      try (PreparedStatement insertStmt = connection.prepareStatement(
          "INSERT INTO users (username, email, password_hash, created_at, updated_at) " +
          "VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)")) {
        insertStmt.setString(1, "testuser");
        insertStmt.setString(2, "test@example.com");
        insertStmt.setString(3, "$2a$10$dummy.hash.for.testing.purposes.only");

        int rowsInserted = insertStmt.executeUpdate();
        assertThat(rowsInserted).isEqualTo(1);
      }

      // Test SELECT
      try (PreparedStatement selectStmt = connection.prepareStatement(
          "SELECT username, email FROM users WHERE username = ?")) {
        selectStmt.setString(1, "testuser");

        try (ResultSet rs = selectStmt.executeQuery()) {
          assertThat(rs.next()).isTrue();
          assertThat(rs.getString("username")).isEqualTo("testuser");
          assertThat(rs.getString("email")).isEqualTo("test@example.com");
        }
      }

      // Test UPDATE
      try (PreparedStatement updateStmt = connection.prepareStatement(
          "UPDATE users SET email = ? WHERE username = ?")) {
        updateStmt.setString(1, "updated@example.com");
        updateStmt.setString(2, "testuser");

        int rowsUpdated = updateStmt.executeUpdate();
        assertThat(rowsUpdated).isEqualTo(1);
      }

      // Test DELETE
      try (PreparedStatement deleteStmt = connection.prepareStatement(
          "DELETE FROM users WHERE username = ?")) {
        deleteStmt.setString(1, "testuser");

        int rowsDeleted = deleteStmt.executeUpdate();
        assertThat(rowsDeleted).isEqualTo(1);
      }
    }

    log.info("✅ CRUD operations test completed successfully");
  }

  private void checkTableExists(Connection connection, String tableName) throws Exception {
    try (PreparedStatement stmt = connection.prepareStatement(
        "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = ?)")) {
      stmt.setString(1, tableName);

      try (ResultSet rs = stmt.executeQuery()) {
        if (rs.next()) {
          boolean exists = rs.getBoolean(1);
          assertThat(exists)
              .withFailMessage("Table '%s' should exist but was not found", tableName)
              .isTrue();
          log.info("✅ Table '{}' exists", tableName);
        }
      }
    }
  }

}
