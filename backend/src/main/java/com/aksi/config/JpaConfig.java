package com.aksi.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Конфігурація JPA для системи замовлень хімчистки.
 *
 * Включає: - Аудит сутностей (автоматичне заповнення дат створення/модифікації) - Автоконфігурацію
 * репозиторіїв для всіх доменів
 */
@Configuration
@EnableJpaAuditing
@EnableJpaRepositories(basePackages = "com.aksi.domain")
public class JpaConfig {
  // Конфігурація підключається автоматично
}
