package com.aksi.domain.order.statemachine.stage1.enums;

/**
 * Повідомлення для логування в BasicOrderInfoAdapter.
 * Централізоване зберігання всіх повідомлень для кращої підтримуваності.
 */
public enum BasicOrderInfoAdapterMessages {

    // Ініціалізація контексту
    INIT_REQUEST("🚀 [BASIC-ORDER-INIT] Ініціалізація нового контексту базової інформації"),
    INIT_SUCCESS("✅ [BASIC-ORDER-INIT] Створено новий контекст з sessionId: {}"),
    INIT_ERROR("❌ [BASIC-ORDER-INIT] Помилка при ініціалізації контексту: {}"),

    // Workflow
    WORKFLOW_START("🚀 [BASIC-ORDER-WORKFLOW] Початок workflow базової інформації"),
    WORKFLOW_SUCCESS("✅ [BASIC-ORDER-WORKFLOW] Workflow розпочато з sessionId: {}"),
    WORKFLOW_ERROR("❌ [BASIC-ORDER-WORKFLOW] Помилка при початку workflow: {}"),

    // Вибір філії
    BRANCH_SELECT_REQUEST("🏢 [BASIC-ORDER-BRANCH] Вибір філії {} для sessionId: {}"),
    BRANCH_SELECT_SUCCESS("✅ [BASIC-ORDER-BRANCH] Філію успішно вибрано для sessionId: {}"),
    BRANCH_SELECT_WARNING("⚠️ [BASIC-ORDER-BRANCH] Не вдалося вибрати філію для sessionId: {}"),
    BRANCH_SELECT_ERROR("❌ [BASIC-ORDER-BRANCH] Помилка при виборі філії для sessionId: {}, error: {}"),

    // Генерація номера квитанції
    RECEIPT_GENERATE_REQUEST("🧾 [BASIC-ORDER-RECEIPT] Генерація номера квитанції для sessionId: {}, branchCode: {}"),
    RECEIPT_GENERATE_SUCCESS("✅ [BASIC-ORDER-RECEIPT] Номер квитанції згенеровано: {} для sessionId: {}"),
    RECEIPT_GENERATE_WARNING("⚠️ [BASIC-ORDER-RECEIPT] Не вдалося згенерувати номер квитанції для sessionId: {}"),
    RECEIPT_GENERATE_ERROR("❌ [BASIC-ORDER-RECEIPT] Помилка при генерації номера квитанції для sessionId: {}, error: {}"),

    // Унікальна мітка
    TAG_SET_REQUEST("🏷️ [BASIC-ORDER-TAG] Встановлення унікальної мітки '{}' для sessionId: {}"),
    TAG_SET_SUCCESS("✅ [BASIC-ORDER-TAG] Унікальну мітку встановлено для sessionId: {}"),
    TAG_SET_WARNING("⚠️ [BASIC-ORDER-TAG] Унікальна мітка не валідна для sessionId: {}"),
    TAG_SET_ERROR("❌ [BASIC-ORDER-TAG] Помилка при встановленні унікальної мітки для sessionId: {}, error: {}"),

    // Валідація
    VALIDATE_REQUEST("✅ [BASIC-ORDER-VALIDATE] Валідація даних для sessionId: {}"),
    VALIDATE_SUCCESS("✅ [BASIC-ORDER-VALIDATE] Дані валідні для sessionId: {}"),
    VALIDATE_WARNING("⚠️ [BASIC-ORDER-VALIDATE] Дані не валідні для sessionId: {}"),
    VALIDATE_ERROR("❌ [BASIC-ORDER-VALIDATE] Помилка при валідації даних для sessionId: {}, error: {}"),

    // Оновлення даних
    UPDATE_REQUEST("📝 [BASIC-ORDER-UPDATE] Оновлення базової інформації для sessionId: {}"),
    UPDATE_SUCCESS("✅ [BASIC-ORDER-UPDATE] Базову інформацію оновлено для sessionId: {}"),
    UPDATE_WARNING("⚠️ [BASIC-ORDER-UPDATE] Не вдалося оновити базову інформацію для sessionId: {}"),
    UPDATE_ERROR("❌ [BASIC-ORDER-UPDATE] Помилка при оновленні базової інформації для sessionId: {}, error: {}"),

    // Завершення workflow
    COMPLETE_REQUEST("✅ [BASIC-ORDER-COMPLETE] Завершення workflow для sessionId: {}"),
    COMPLETE_SUCCESS("✅ [BASIC-ORDER-COMPLETE] Workflow успішно завершено для sessionId: {}"),
    COMPLETE_WARNING("⚠️ [BASIC-ORDER-COMPLETE] Базова інформація не готова для завершення для sessionId: {}"),
    COMPLETE_ERROR("❌ [BASIC-ORDER-COMPLETE] Помилка при завершенні workflow для sessionId: {}, error: {}"),

    // Скидання workflow
    RESET_REQUEST("🔄 [BASIC-ORDER-RESET] Скидання workflow для sessionId: {}"),
    RESET_SUCCESS("✅ [BASIC-ORDER-RESET] Workflow скинуто для sessionId: {}"),
    RESET_ERROR("❌ [BASIC-ORDER-RESET] Помилка при скиданні workflow для sessionId: {}, error: {}"),

    // Скасування workflow
    CANCEL_REQUEST("❌ [BASIC-ORDER-CANCEL] Скасування workflow для sessionId: {}"),
    CANCEL_SUCCESS("✅ [BASIC-ORDER-CANCEL] Workflow скасовано для sessionId: {}"),
    CANCEL_ERROR("❌ [BASIC-ORDER-CANCEL] Помилка при скасуванні workflow для sessionId: {}, error: {}"),

    // Перевірка філій
    BRANCHES_CHECK_REQUEST("🏢 [BASIC-ORDER-BRANCHES] Перевірка завантаження філій для sessionId: {}"),
    BRANCHES_CHECK_SUCCESS("📋 [BASIC-ORDER-BRANCHES] Результат перевірки філій для sessionId: {} -> loaded: {}"),
    BRANCHES_CHECK_ERROR("❌ [BASIC-ORDER-BRANCHES] Помилка при перевірці філій для sessionId: {}, error: {}"),

    // Очищення помилок
    CLEAR_ERRORS_REQUEST("🧹 [BASIC-ORDER-CLEAR-ERRORS] Очищення помилок для sessionId: {}"),
    CLEAR_ERRORS_SUCCESS("✅ [BASIC-ORDER-CLEAR-ERRORS] Помилки очищено для sessionId: {}"),
    CLEAR_ERRORS_ERROR("❌ [BASIC-ORDER-CLEAR-ERRORS] Помилка при очищенні помилок для sessionId: {}, error: {}");

    private final String message;

    BasicOrderInfoAdapterMessages(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
