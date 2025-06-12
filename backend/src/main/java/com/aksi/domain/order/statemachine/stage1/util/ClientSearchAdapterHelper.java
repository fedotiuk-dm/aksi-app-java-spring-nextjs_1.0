package com.aksi.domain.order.statemachine.stage1.util;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aksi.domain.order.statemachine.stage1.service.ClientSearchCoordinationService;

/**
 * Допоміжний клас для ClientSearchAdapter.
 * Містить утилітні методи та загальну логіку.
 */
public class ClientSearchAdapterHelper {

    private static final Logger logger = LoggerFactory.getLogger(ClientSearchAdapterHelper.class);

    private final ClientSearchCoordinationService coordinationService;

    public ClientSearchAdapterHelper(ClientSearchCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    /**
     * Забезпечує існування контексту для даної сесії.
     * Якщо контекст не існує, створює новий.
     */
    public void ensureContextExists(String sessionId) {
        logger.debug("🔍 [CLIENT-SEARCH-HELPER] Перевірка існування контексту для sessionId: {}", sessionId);

        if (!coordinationService.searchContextExists(sessionId)) {
            logger.info("📝 [CLIENT-SEARCH-HELPER] Контекст не існує, ініціалізуємо для sessionId: {}", sessionId);
            coordinationService.initializeClientSearch(sessionId);
        } else {
            logger.debug("✅ [CLIENT-SEARCH-HELPER] Контекст вже існує для sessionId: {}", sessionId);
        }
    }

    /**
     * Парсить clientId з рядка в UUID з обробкою помилок.
     */
    public UUID parseClientId(String clientId, String sessionId) {
        logger.debug("🔄 [CLIENT-SEARCH-HELPER] Парсинг clientId: {} для sessionId: {}", clientId, sessionId);

        try {
            UUID uuid = UUID.fromString(clientId);
            logger.debug("✅ [CLIENT-SEARCH-HELPER] Успішно спарсено clientId: {} для sessionId: {}", uuid, sessionId);
            return uuid;
        } catch (IllegalArgumentException e) {
            logger.error("❌ [CLIENT-SEARCH-HELPER] Невалідний формат clientId: {} для sessionId: {}, error: {}",
                        clientId, sessionId, e.getMessage());
            return null;
        }
    }

    /**
     * Валідує sessionId на коректність формату.
     */
    public boolean isValidSessionId(String sessionId) {
        if (sessionId == null || sessionId.trim().isEmpty()) {
            logger.warn("⚠️ [CLIENT-SEARCH-HELPER] SessionId є null або порожнім");
            return false;
        }

        try {
            UUID.fromString(sessionId);
            return true;
        } catch (IllegalArgumentException e) {
            logger.warn("⚠️ [CLIENT-SEARCH-HELPER] Невалідний формат sessionId: {}", sessionId);
            return false;
        }
    }

    /**
     * Логує початок операції з sessionId.
     */
    public void logOperationStart(String operation, String sessionId) {
        logger.info("🚀 [CLIENT-SEARCH-HELPER] Початок операції '{}' для sessionId: {}", operation, sessionId);
    }

    /**
     * Логує успішне завершення операції.
     */
    public void logOperationSuccess(String operation, String sessionId) {
        logger.info("✅ [CLIENT-SEARCH-HELPER] Операція '{}' успішно завершена для sessionId: {}", operation, sessionId);
    }

    /**
     * Логує помилку операції.
     */
    public void logOperationError(String operation, String sessionId, Exception e) {
        logger.error("❌ [CLIENT-SEARCH-HELPER] Помилка в операції '{}' для sessionId: {}, error: {}",
                    operation, sessionId, e.getMessage(), e);
    }
}
