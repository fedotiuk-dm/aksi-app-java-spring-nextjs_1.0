package com.aksi.config;

import com.aksi.domain.user.entity.Role;
import com.aksi.domain.user.entity.User;
import com.aksi.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Клас для створення адміністратора при першому запуску
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AdminInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Value("${admin.username:admin}")
    private String adminUsername;
    
    @Value("${admin.password:admin}")
    private String adminPassword;
    
    @Value("${admin.email:admin@aksi.com}")
    private String adminEmail;

    /**
     * Створює адміністратора якщо він відсутній
     */
    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername(adminUsername)) {
            User admin = User.builder()
                    .name("Адміністратор")
                    .username(adminUsername)
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(Role.ADMIN)
                    .position("Головний адміністратор")
                    .isActive(true)
                    .build();
            
            userRepository.save(admin);
            log.info("Адміністратор '{}' створений", adminUsername);
        }
    }
} 