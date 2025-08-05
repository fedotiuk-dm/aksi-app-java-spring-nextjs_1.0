package com.aksi.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.aksi.api.user.dto.CreateUserRequest;
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
        CreateUserRequest adminRequest = new CreateUserRequest();
        adminRequest.setUsername("admin");
        adminRequest.setEmail("admin@aksi.com");
        adminRequest.setPassword("Admin123!");
        adminRequest.setFirstName("System");
        adminRequest.setLastName("Administrator");
        adminRequest.setPhone("+380501234567");
        adminRequest.setRoles(List.of(UserRole.ADMIN));

        userService.createUserAndReturnDetail(adminRequest);
        log.info("Created admin user");
      }

      // Create manager user if not exists
      if (userService.findByUsername("manager").isEmpty()) {
        CreateUserRequest managerRequest = new CreateUserRequest();
        managerRequest.setUsername("manager");
        managerRequest.setEmail("manager@aksi.com");
        managerRequest.setPassword("Manager123!");
        managerRequest.setFirstName("John");
        managerRequest.setLastName("Manager");
        managerRequest.setPhone("+380501234568");
        managerRequest.setRoles(List.of(UserRole.MANAGER));

        userService.createUserAndReturnDetail(managerRequest);
        log.info("Created manager user");
      }

      // Create operator user if not exists
      if (userService.findByUsername("operator").isEmpty()) {
        CreateUserRequest operatorRequest = new CreateUserRequest();
        operatorRequest.setUsername("operator");
        operatorRequest.setEmail("operator@aksi.com");
        operatorRequest.setPassword("Operator123!");
        operatorRequest.setFirstName("Jane");
        operatorRequest.setLastName("Operator");
        operatorRequest.setPhone("+380501234569");
        operatorRequest.setRoles(List.of(UserRole.OPERATOR));

        userService.createUserAndReturnDetail(operatorRequest);
        log.info("Created operator user");
      }

      log.info("Test data initialization completed");
    };
  }
}
