package com.aksi.domain.order.statemachine.stage1.enums;

/**
 * Централізовані лог повідомлення для пошуку клієнтів.
 * Забезпечує узгодженість та легкість підтримки логування.
 */
public enum ClientSearchLogMessages {

    // === ЗАПИТИ ===
    STATE_REQUEST("🔍 [CLIENT-SEARCH] Запит стану для sessionId: {}"),
    CRITERIA_REQUEST("🔍 [CLIENT-SEARCH] Запит критеріїв пошуку для sessionId: {}"),
    SEARCH_REQUEST("🔍 [CLIENT-SEARCH] Запит пошуку клієнтів для sessionId: {}, критерії: {}"),
    PHONE_SEARCH_REQUEST("📞 [CLIENT-SEARCH] Запит пошуку за телефоном для sessionId: {}, phone: {}"),
    SELECT_CLIENT_REQUEST("👤 [CLIENT-SEARCH] Запит вибору клієнта для sessionId: {}, clientId: {}"),
    GET_SELECTED_REQUEST("👤 [CLIENT-SEARCH] Запит обраного клієнта для sessionId: {}"),
    CLEAR_SELECTION_REQUEST("🗑️ [CLIENT-SEARCH] Запит очищення вибору для sessionId: {}"),
    RESULTS_REQUEST("📋 [CLIENT-SEARCH] Запит результатів пошуку для sessionId: {}"),
    READY_FOR_COMPLETION_REQUEST("🔍 [CLIENT-SEARCH] Перевірка готовності до завершення для sessionId: {}"),
    COMPLETE_REQUEST("🏁 [CLIENT-SEARCH] Завершення пошуку клієнта для sessionId: {}"),

    // === УСПІШНІ ОПЕРАЦІЇ ===
    STATE_SUCCESS("✅ [CLIENT-SEARCH] Успішно отримано стан: {} для sessionId: {}"),
    CRITERIA_SUCCESS("✅ [CLIENT-SEARCH] Критерії пошуку отримано для sessionId: {}"),
    SEARCH_SUCCESS("✅ [CLIENT-SEARCH] Пошук завершено для sessionId: {}, знайдено: {} клієнтів"),
    PHONE_SEARCH_SUCCESS("✅ [CLIENT-SEARCH] Пошук за телефоном завершено для sessionId: {}"),
    SELECT_CLIENT_SUCCESS("✅ [CLIENT-SEARCH] Клієнт обрано для sessionId: {}, clientId: {}"),
    GET_SELECTED_SUCCESS("✅ [CLIENT-SEARCH] Обраний клієнт отримано для sessionId: {}"),
    CLEAR_SELECTION_SUCCESS("✅ [CLIENT-SEARCH] Вибір очищено для sessionId: {}"),
    RESULTS_SUCCESS("✅ [CLIENT-SEARCH] Результати пошуку отримано для sessionId: {}, знайдено: {} клієнтів"),
    READY_FOR_COMPLETION_SUCCESS("✅ [CLIENT-SEARCH] Готовність до завершення для sessionId: {} -> {}"),
    COMPLETE_SUCCESS("✅ [CLIENT-SEARCH] Пошук клієнта завершено для sessionId: {}"),

    // === ІНФОРМАЦІЙНІ ПОВІДОМЛЕННЯ ===
    CRITERIA_NOT_FOUND("ℹ️ [CLIENT-SEARCH] Критерії пошуку відсутні для sessionId: {}"),
    CLIENT_NOT_SELECTED("ℹ️ [CLIENT-SEARCH] Клієнт не обрано для sessionId: {}"),
    RESULTS_NOT_FOUND("ℹ️ [CLIENT-SEARCH] Результати пошуку відсутні для sessionId: {}"),
    CONTEXT_INITIALIZED("ℹ️ [CLIENT-SEARCH] Контекст ініціалізовано для sessionId: {}"),

    // === ПОПЕРЕДЖЕННЯ ===
    EVENT_NOT_PROCESSED("⚠️ [CLIENT-SEARCH] Подія {} не оброблена для sessionId: {}"),
    CLEAR_FAILED("⚠️ [CLIENT-SEARCH] Не вдалося очистити результати для sessionId: {}"),
    COMPLETION_FAILED("⚠️ [CLIENT-SEARCH] Не вдалося завершити пошук для sessionId: {}, причина: {}"),
    INVALID_CLIENT_ID("⚠️ [CLIENT-SEARCH] Невірний формат UUID clientId: {} для sessionId: {}"),

    // === ПОМИЛКИ ===
    STATE_ERROR("❌ [CLIENT-SEARCH] Помилка отримання стану для sessionId: {}"),
    CRITERIA_ERROR("❌ [CLIENT-SEARCH] Помилка отримання критеріїв для sessionId: {}"),
    SEARCH_ERROR("❌ [CLIENT-SEARCH] Помилка пошуку для sessionId: {}"),
    PHONE_SEARCH_ERROR("❌ [CLIENT-SEARCH] Помилка пошуку за телефоном для sessionId: {}"),
    SELECT_CLIENT_ERROR("❌ [CLIENT-SEARCH] Помилка вибору клієнта для sessionId: {}"),
    GET_SELECTED_ERROR("❌ [CLIENT-SEARCH] Помилка отримання обраного клієнта для sessionId: {}"),
    CLEAR_SELECTION_ERROR("❌ [CLIENT-SEARCH] Помилка очищення вибору для sessionId: {}"),
    RESULTS_ERROR("❌ [CLIENT-SEARCH] Помилка отримання результатів для sessionId: {}"),
    READY_FOR_COMPLETION_ERROR("❌ [CLIENT-SEARCH] Помилка перевірки готовності для sessionId: {}"),
    COMPLETE_ERROR("❌ [CLIENT-SEARCH] Помилка завершення пошуку для sessionId: {}");

    private final String message;

    ClientSearchLogMessages(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    /**
     * Форматує повідомлення з параметрами.
     */
    public String format(Object... args) {
        return String.format(message.replace("{}", "%s"), args);
    }

    @Override
    public String toString() {
        return message;
    }
}
