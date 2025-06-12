package com.aksi.domain.order.statemachine.stage1.enums;

/**
 * Повідомлення для логування в ClientSearchAdapter.
 * Централізоване зберігання всіх повідомлень для кращої підтримуваності.
 */
public enum ClientSearchAdapterMessages {

    // Ініціалізація контексту
    INIT_REQUEST("🚀 [CLIENT-SEARCH-INIT] Ініціалізація нового контексту пошуку клієнтів"),
    INIT_SUCCESS("✅ [CLIENT-SEARCH-INIT] Створено новий контекст з sessionId: {}"),
    INIT_ERROR("❌ [CLIENT-SEARCH-INIT] Помилка при ініціалізації контексту: {}"),

    // Очищення результатів
    CLEAR_REQUEST("🧹 [CLIENT-SEARCH-CLEAR] Очищення результатів пошуку для sessionId: {}"),
    CLEAR_SUCCESS("✅ [CLIENT-SEARCH-CLEAR] Результати пошуку очищено для sessionId: {}"),
    CLEAR_ERROR("❌ [CLIENT-SEARCH-CLEAR] Помилка при очищенні результатів для sessionId: {}, error: {}"),

    // Завершення пошуку
    COMPLETE_REQUEST("✅ [CLIENT-SEARCH-COMPLETE] Завершення пошуку клієнта для sessionId: {}"),
    COMPLETE_SUCCESS("✅ [CLIENT-SEARCH-COMPLETE] Пошук клієнта успішно завершено для sessionId: {}"),
    COMPLETE_WARNING("⚠️ [CLIENT-SEARCH-COMPLETE] Не вдалося завершити пошук для sessionId: {}"),
    COMPLETE_ERROR("❌ [CLIENT-SEARCH-COMPLETE] Помилка при завершенні пошуку для sessionId: {}, error: {}"),

    // Скасування пошуку
    CANCEL_REQUEST("❌ [CLIENT-SEARCH-CANCEL] Скасування пошуку клієнта для sessionId: {}"),
    CANCEL_SUCCESS("✅ [CLIENT-SEARCH-CANCEL] Пошук клієнта скасовано для sessionId: {}"),
    CANCEL_ERROR("❌ [CLIENT-SEARCH-CANCEL] Помилка при скасуванні пошуку для sessionId: {}, error: {}");

    private final String message;

    ClientSearchAdapterMessages(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
