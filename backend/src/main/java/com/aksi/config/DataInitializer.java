package com.aksi.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.aksi.domain.auth.entity.UserEntity;
import com.aksi.domain.auth.enums.UserRole;
import com.aksi.domain.auth.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Ініціалізація початкових даних при старті додатку
 * Створює адміна якщо його немає
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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
        boolean hasAdmins = userRepository.existsByRolesContaining(UserRole.ADMIN);

        if (!hasAdmins) {
            log.info("Створюємо початкового адміністратора...");

            UserEntity admin = UserEntity.builder()
                    .username(adminUsername)
                    .email(adminEmail)
                    .passwordHash(passwordEncoder.encode(adminPassword))
                    .firstName("Адміністратор")
                    .lastName("Системи")
                    .roles(List.of(UserRole.ADMIN, UserRole.MANAGER))
                    .isActive(true)
                    .failedLoginAttempts(0)
                    .build();

            userRepository.save(admin);

            log.info("✅ Початковий адміністратор створений:");
            log.info("   Username: {}", adminUsername);
            log.info("   Email: {}", adminEmail);
            log.info("   Password: {}", adminPassword);
            log.info("   ⚠️  ОБОВ'ЯЗКОВО змініть пароль після першого входу!");
        } else {
            log.debug("Адміністратори вже існують в системі");
        }
    }
}
