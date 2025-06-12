package com.aksi.domain.order.statemachine.stage1.util;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aksi.domain.order.statemachine.stage1.service.BasicOrderInfoCoordinationService;

/**
 * Допоміжний клас для BasicOrderInfoAdapter.
 * Містить утилітні методи та загальну логіку.
 */
public class BasicOrderInfoAdapterHelper {

    private static final Logger logger = LoggerFactory.getLogger(BasicOrderInfoAdapterHelper.class);

    private final BasicOrderInfoCoordinationService coordinationService;

    public BasicOrderInfoAdapterHelper(BasicOrderInfoCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    /**
     * Забезпечує існування контексту для даної сесії.
     * Якщо контекст не існує, створює новий.
     */
    public void ensureContextExists(String sessionId) {
        logger.debug("🔍 [BASIC-ORDER-HELPER] Перевірка існування контексту для sessionId: {}", sessionId);

        if (!coordinationService.sessionExists(sessionId)) {
            logger.info("📝 [BASIC-ORDER-HELPER] Контекст не існує, ініціалізуємо для sessionId: {}", sessionId);
            coordinationService.initializeBasicOrderInfo(sessionId);
        } else {
            logger.debug("✅ [BASIC-ORDER-HELPER] Контекст вже існує для sessionId: {}", sessionId);
        }
    }

    /**
     * Валідує sessionId на коректність формату.
     */
    public boolean isValidSessionId(String sessionId) {
        if (sessionId == null || sessionId.trim().isEmpty()) {
            logger.warn("⚠️ [BASIC-ORDER-HELPER] SessionId є null або порожнім");
            return false;
        }

        try {
            UUID.fromString(sessionId);
            return true;
        } catch (IllegalArgumentException e) {
            logger.warn("⚠️ [BASIC-ORDER-HELPER] Невалідний формат sessionId: {}", sessionId);
            return false;
        }
    }

    /**
     * Валідує branchId на коректність формату.
     */
    public boolean isValidBranchId(UUID branchId) {
        if (branchId == null) {
            logger.warn("⚠️ [BASIC-ORDER-HELPER] BranchId є null");
            return false;
        }
        return true;
    }

    /**
     * Валідує унікальну мітку на коректність.
     */
    public boolean isValidUniqueTag(String uniqueTag) {
        logger.info("🔍 [BASIC-ORDER-HELPER] Валідація унікальної мітки: '{}'", uniqueTag);

        if (uniqueTag == null || uniqueTag.trim().isEmpty()) {
            logger.warn("⚠️ [BASIC-ORDER-HELPER] Унікальна мітка є null або порожньою");
            return false;
        }

        String trimmedTag = uniqueTag.trim();
        logger.info("📏 [BASIC-ORDER-HELPER] Довжина мітки після trim: {}", trimmedTag.length());

        // Перевірка довжини (як у BasicOrderInfoValidator)
        if (trimmedTag.length() < 3) {
            logger.warn("⚠️ [BASIC-ORDER-HELPER] Унікальна мітка занадто коротка: {} символів (мінімум 3)", trimmedTag.length());
            return false;
        }

        if (trimmedTag.length() > 20) {
            logger.warn("⚠️ [BASIC-ORDER-HELPER] Унікальна мітка занадто довга: {} символів (максимум 20)", trimmedTag.length());
            return false;
        }

        // Перевірка формату (як у BasicOrderInfoValidator)
        String pattern = "^[A-Za-z0-9-_]{3,20}$";
        boolean matchesPattern = trimmedTag.matches(pattern);
        logger.info("🔤 [BASIC-ORDER-HELPER] Перевірка формату '{}' проти патерну '{}': {}",
                   trimmedTag, pattern, matchesPattern);

        if (!matchesPattern) {
            logger.warn("⚠️ [BASIC-ORDER-HELPER] Унікальна мітка містить недозволені символи. Дозволені: латинські літери, цифри, тире, підкреслення");
            return false;
        }

        logger.info("✅ [BASIC-ORDER-HELPER] Унікальна мітка '{}' пройшла валідацію", trimmedTag);
        return true;
    }

    /**
     * Логує початок операції з sessionId.
     */
    public void logOperationStart(String operation, String sessionId) {
        logger.info("🚀 [BASIC-ORDER-HELPER] Початок операції '{}' для sessionId: {}", operation, sessionId);
    }

    /**
     * Логує успішне завершення операції.
     */
    public void logOperationSuccess(String operation, String sessionId) {
        logger.info("✅ [BASIC-ORDER-HELPER] Операція '{}' успішно завершена для sessionId: {}", operation, sessionId);
    }

    /**
     * Логує попередження операції.
     */
    public void logOperationWarning(String operation, String sessionId, String reason) {
        logger.warn("⚠️ [BASIC-ORDER-HELPER] Попередження в операції '{}' для sessionId: {}, причина: {}",
                   operation, sessionId, reason);
    }

    /**
     * Логує помилку операції.
     */
    public void logOperationError(String operation, String sessionId, Exception e) {
        logger.error("❌ [BASIC-ORDER-HELPER] Помилка в операції '{}' для sessionId: {}, error: {}",
                    operation, sessionId, e.getMessage(), e);
    }

    /**
     * Створює стандартизований опис операції.
     */
    public String createOperationDescription(String operation, String sessionId) {
        return String.format("Операція '%s' для sessionId: %s", operation, sessionId);
    }

    /**
     * Перевіряє чи готова базова інформація для завершення.
     */
    public boolean isReadyForCompletion(String sessionId) {
        try {
            return coordinationService.isReadyForCompletion(sessionId);
        } catch (Exception e) {
            logger.error("❌ [BASIC-ORDER-HELPER] Помилка при перевірці готовності для sessionId: {}, error: {}",
                        sessionId, e.getMessage());
            return false;
        }
    }
}
