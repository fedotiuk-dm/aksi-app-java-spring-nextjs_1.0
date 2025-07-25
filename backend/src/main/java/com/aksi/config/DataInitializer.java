package com.aksi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.aksi.domain.user.entity.UserEntity;
import com.aksi.domain.user.entity.UserRole;
import com.aksi.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Ініціалізація початкових даних при старті додатку Створює адміна якщо його немає. */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final Environment environment;

  @Value("${app.admin.username:admin}")
  private String adminUsername;

  @Value("${app.admin.email:admin@aksi.com}")
  private String adminEmail;

  @Value("${app.admin.password:admin123}")
  private String adminPassword;

  @Override
  public void run(String... args) {
    createDefaultAdminIfNotExists();
  }

  private void createDefaultAdminIfNotExists() {
    // Перевіряємо чи є адміни в системі
    boolean hasAdmins =
        userRepository
            .findByRole(UserRole.ADMIN, org.springframework.data.domain.Pageable.unpaged())
            .hasContent();

    if (!hasAdmins) {
      log.info("Створюємо початкового адміністратора...");

      UserEntity admin = new UserEntity();
      admin.setUsername(adminUsername);
      admin.setEmail(adminEmail);
      admin.setPasswordHash(passwordEncoder.encode(adminPassword));
      admin.setFirstName("Адміністратор");
      admin.setLastName("Системи");
      admin.setRole(UserRole.ADMIN);
      admin.setActive(true);
      admin.setFailedLoginAttempts(0);

      userRepository.save(admin);

      log.info("✅ Початковий адміністратор створений:");
      log.info("   Username: {}", adminUsername);
      log.info("   Email: {}", adminEmail);
      log.info("   Password: {}", adminPassword);
      log.info("   ⚠️  ОБОВ'ЯЗКОВО змініть пароль після першого входу!");

      // Створюємо тестового оператора для dev профілю
      if (environment.acceptsProfiles(org.springframework.core.env.Profiles.of("dev"))) {
        createTestOperator();
      }
    } else {
      log.debug("Адміністратори вже існують в системі");
    }
  }

  private void createTestOperator() {
    // Перевіряємо чи вже існує тестовий оператор
    if (!userRepository.existsByUsername("operator1")) {
      UserEntity operator = new UserEntity();
      operator.setUsername("operator1");
      operator.setEmail("operator1@aksi.com.ua");
      operator.setPasswordHash(passwordEncoder.encode("operator123"));
      operator.setFirstName("Анастасія");
      operator.setLastName("Федотюк");
      operator.setRole(UserRole.OPERATOR);
      operator.setActive(true);
      operator.setFailedLoginAttempts(0);

      userRepository.save(operator);

      log.info("✅ Тестовий оператор створений:");
      log.info("   Username: operator1");
      log.info("   Password: operator123");
    }
  }
}
