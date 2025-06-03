package com.aksi.domain.order.statemachine.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для автоматичного очищення Order Wizard сесій
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderWizardCleanupService {

    private final OrderWizardPersistenceService persistenceService;

    /**
     * Очищає закінчені сесії щогодини
     */
    @Scheduled(fixedRate = 3600000) // 1 година
    public void cleanupExpiredSessions() {
        log.debug("Запуск очищення закінчених Order Wizard сесій");

        try {
            int deactivated = persistenceService.cleanupExpiredSessions();

            if (deactivated > 0) {
                log.info("Очищено {} закінчених Order Wizard сесій", deactivated);
            }

        } catch (Exception e) {
            log.error("Помилка очищення закінчених сесій: {}", e.getMessage(), e);
        }
    }

    /**
     * Видаляє старі неактивні сесії щодня
     */
    @Scheduled(cron = "0 0 2 * * ?") // Кожен день о 2:00
    public void deleteOldInactiveSessions() {
        log.debug("Запуск видалення старих неактивних Order Wizard сесій");

        try {
            // Видаляємо сесії старше 7 днів
            int deleted = persistenceService.deleteOldInactiveSessions(7);

            if (deleted > 0) {
                log.info("Видалено {} старих неактивних Order Wizard сесій", deleted);
            }

        } catch (Exception e) {
            log.error("Помилка видалення старих сесій: {}", e.getMessage(), e);
        }
    }
}
