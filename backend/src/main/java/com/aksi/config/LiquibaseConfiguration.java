package com.aksi.config;

import java.sql.Connection;

import javax.sql.DataSource;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.liquibase.LiquibaseProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import liquibase.Liquibase;
import liquibase.database.Database;
import liquibase.database.DatabaseFactory;
import liquibase.database.jvm.JdbcConnection;
import liquibase.exception.LiquibaseException;
import liquibase.resource.ClassLoaderResourceAccessor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Конфігурація Liquibase з автоматичним вирішенням lock проблем.
 *
 * Цей клас забезпечує:
 * - Автоматичне очищення застарілих locks
 * - Безпечне відновлення після збоїв
 * - Детальне логування процесу міграції
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class LiquibaseConfiguration {

    private final DataSource dataSource;
    private final LiquibaseProperties liquibaseProperties;

    /**
     * ApplicationRunner що виконується перед стандартним Liquibase runner
     * для очищення потенційних lock проблем.
     */
    @Bean
    @Order(0) // Виконується першим
    public ApplicationRunner liquibaseLockCleaner() {
        return new LiquibaseLockCleaner();
    }

    private class LiquibaseLockCleaner implements ApplicationRunner {

        @Override
        public void run(ApplicationArguments args) throws Exception {
            if (!liquibaseProperties.isEnabled()) {
                log.debug("Liquibase відключений, пропускаємо очищення locks");
                return;
            }

            log.info("Перевіряємо та очищуємо Liquibase locks...");

            try (Connection connection = dataSource.getConnection()) {
                Database database = DatabaseFactory.getInstance()
                    .findCorrectDatabaseImplementation(new JdbcConnection(connection));

                try (Liquibase liquibase = new Liquibase(
                    liquibaseProperties.getChangeLog(),
                    new ClassLoaderResourceAccessor(),
                    database
                )) {
                    // Перевіряємо чи є активні locks
                    if (liquibase.listLocks().length > 0) {
                        log.warn("Знайдено активні Liquibase locks, очищуємо...");

                        // Принудово звільняємо всі locks
                        liquibase.forceReleaseLocks();
                        log.info("Liquibase locks успішно очищені");
                    } else {
                        log.debug("Активних Liquibase locks не знайдено");
                    }

                    // Перевіряємо статус після очищення
                    if (liquibase.listLocks().length == 0) {
                        log.info("Liquibase готовий до роботи (без активних locks)");
                    } else {
                        log.warn("Деякі locks все ще активні після очищення");
                    }
                }
            } catch (LiquibaseException e) {
                log.error("Помилка при роботі з Liquibase: {}", e.getMessage());
                // Не кидаємо exception, щоб не заблокувати старт додатку
                // Spring Boot Liquibase спробує сам розв'язати проблему
            } catch (Exception e) {
                log.error("Неочікувана помилка при очищенні Liquibase locks: {}", e.getMessage(), e);
            }
        }
    }
}
