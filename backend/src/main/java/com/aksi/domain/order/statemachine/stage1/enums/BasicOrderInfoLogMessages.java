package com.aksi.domain.order.statemachine.stage1.enums;

/**
 * Централізовані лог повідомлення для базової інформації замовлення.
 * Забезпечує узгодженість та легкість підтримки логування.
 */
public enum BasicOrderInfoLogMessages {

    // === ЗАПИТИ ===
    STATE_REQUEST("🔍 [BASIC-ORDER-INFO] Запит стану для sessionId: {}"),
    DATA_REQUEST("🔍 [BASIC-ORDER-INFO] Запит даних замовлення для sessionId: {}"),
    SAVE_REQUEST("💾 [BASIC-ORDER-INFO] Запит збереження даних для sessionId: {}, дані: {}"),
    UPDATE_REQUEST("🔄 [BASIC-ORDER-INFO] Запит оновлення даних для sessionId: {}, дані: {}"),
    VALIDATE_REQUEST("✅ [BASIC-ORDER-INFO] Запит валідації для sessionId: {}"),
    READY_FOR_COMPLETION_REQUEST("🔍 [BASIC-ORDER-INFO] Перевірка готовності до завершення для sessionId: {}"),
    COMPLETE_REQUEST("🏁 [BASIC-ORDER-INFO] Завершення базової інформації для sessionId: {}"),
    CLEAR_REQUEST("🗑️ [BASIC-ORDER-INFO] Запит очищення даних для sessionId: {}"),

    // === УСПІШНІ ОПЕРАЦІЇ ===
    STATE_SUCCESS("✅ [BASIC-ORDER-INFO] Успішно отримано стан: {} для sessionId: {}"),
    DATA_SUCCESS("✅ [BASIC-ORDER-INFO] Дані замовлення отримано для sessionId: {}"),
    SAVE_SUCCESS("✅ [BASIC-ORDER-INFO] Дані збережено для sessionId: {}"),
    UPDATE_SUCCESS("✅ [BASIC-ORDER-INFO] Дані оновлено для sessionId: {}"),
    VALIDATE_SUCCESS("✅ [BASIC-ORDER-INFO] Валідація пройшла для sessionId: {}"),
    READY_FOR_COMPLETION_SUCCESS("✅ [BASIC-ORDER-INFO] Готовність до завершення для sessionId: {} -> {}"),
    COMPLETE_SUCCESS("✅ [BASIC-ORDER-INFO] Базова інформація завершена для sessionId: {}"),
    CLEAR_SUCCESS("✅ [BASIC-ORDER-INFO] Дані очищено для sessionId: {}"),

    // === ІНФОРМАЦІЙНІ ПОВІДОМЛЕННЯ ===
    DATA_NOT_FOUND("ℹ️ [BASIC-ORDER-INFO] Дані замовлення відсутні для sessionId: {}"),
    CONTEXT_INITIALIZED("ℹ️ [BASIC-ORDER-INFO] Контекст ініціалізовано для sessionId: {}"),
    VALIDATION_FAILED("ℹ️ [BASIC-ORDER-INFO] Валідація не пройшла для sessionId: {}, помилки: {}"),

    // === ПОПЕРЕДЖЕННЯ ===
    EVENT_NOT_PROCESSED("⚠️ [BASIC-ORDER-INFO] Подія {} не оброблена для sessionId: {}"),
    SAVE_FAILED("⚠️ [BASIC-ORDER-INFO] Не вдалося зберегти дані для sessionId: {}"),
    UPDATE_FAILED("⚠️ [BASIC-ORDER-INFO] Не вдалося оновити дані для sessionId: {}"),
    COMPLETION_FAILED("⚠️ [BASIC-ORDER-INFO] Не вдалося завершити для sessionId: {}, причина: {}"),
    CLEAR_FAILED("⚠️ [BASIC-ORDER-INFO] Не вдалося очистити дані для sessionId: {}"),

    // === ПОМИЛКИ ===
    STATE_ERROR("❌ [BASIC-ORDER-INFO] Помилка отримання стану для sessionId: {}"),
    DATA_ERROR("❌ [BASIC-ORDER-INFO] Помилка отримання даних для sessionId: {}"),
    SAVE_ERROR("❌ [BASIC-ORDER-INFO] Помилка збереження для sessionId: {}"),
    UPDATE_ERROR("❌ [BASIC-ORDER-INFO] Помилка оновлення для sessionId: {}"),
    VALIDATE_ERROR("❌ [BASIC-ORDER-INFO] Помилка валідації для sessionId: {}"),
    READY_FOR_COMPLETION_ERROR("❌ [BASIC-ORDER-INFO] Помилка перевірки готовності для sessionId: {}"),
    COMPLETE_ERROR("❌ [BASIC-ORDER-INFO] Помилка завершення для sessionId: {}"),
    CLEAR_ERROR("❌ [BASIC-ORDER-INFO] Помилка очищення для sessionId: {}");

    private final String message;

    BasicOrderInfoLogMessages(String message) {
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
}
