package com.aksi.config;

import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.aksi.api.user.dto.UserRole;
import com.aksi.service.user.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Initialize test data for development environment. */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

  private final UserService userService;

  @Bean
  @Profile("!prod")
  public CommandLineRunner initData() {
    return args -> {
      log.info("Initializing test data...");

      // Create admin user if not exists
      if (userService.findByUsername("admin").isEmpty()) {
        var admin =
            userService.createUser(
                "admin", "admin@aksi.com", "admin123", "System", "Administrator", "+380501234567");
        userService.updateUserRoles(admin.getId(), Set.of(UserRole.ADMIN));
        log.info("Created admin user");
      }

      // Create manager user if not exists
      if (userService.findByUsername("manager").isEmpty()) {
        var manager =
            userService.createUser(
                "manager", "manager@aksi.com", "manager123", "John", "Manager", "+380501234568");
        userService.updateUserRoles(manager.getId(), Set.of(UserRole.MANAGER));
        log.info("Created manager user");
      }

      // Create operator user if not exists
      if (userService.findByUsername("operator").isEmpty()) {
        userService.createUser(
            "operator", "operator@aksi.com", "operator123", "Jane", "Operator", "+380501234569");
        log.info("Created operator user");
      }

      log.info("Test data initialization completed");
    };
  }
}
