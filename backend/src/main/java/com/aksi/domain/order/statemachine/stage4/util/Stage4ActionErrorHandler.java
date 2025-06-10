package com.aksi.domain.order.statemachine.stage4.util;

import java.util.function.Supplier;

import org.springframework.statemachine.StateContext;

import com.aksi.domain.order.statemachine.stage4.enums.Stage4Event;
import com.aksi.domain.order.statemachine.stage4.enums.Stage4State;

/**
 * Утилітний клас для обробки помилок в Stage4 Actions.
 * Використовує сучасні Java практики для centralized error handling.
 */
public final class Stage4ActionErrorHandler {

    private Stage4ActionErrorHandler() {
        // Утилітний клас не потребує створення екземплярів
    }

    /**
     * Виконує операцію з обробкою помилок та збереженням стану в контексті.
     *
     * @param context контекст State Machine
     * @param operation операція для виконання
     * @param errorKey ключ для збереження помилки в контексті
     * @param errorMessage повідомлення про помилку
     * @throws Stage4ActionException якщо операція завершилась з помилкою
     */
    public static void executeWithErrorHandling(StateContext<Stage4State, Stage4Event> context,
                                              Runnable operation,
                                              String errorKey,
                                              String errorMessage) {
        try {
            operation.run();
        } catch (Exception e) {
            handleError(context, e, errorKey, errorMessage);
        }
    }

    /**
     * Виконує операцію з поверненням результату та обробкою помилок.
     *
     * @param <T> тип результату операції
     * @param context контекст State Machine
     * @param operation операція для виконання
     * @param errorKey ключ для збереження помилки в контексті
     * @param errorMessage повідомлення про помилку
     * @return результат операції
     * @throws Stage4ActionException якщо операція завершилась з помилкою
     */
    public static <T> T executeWithErrorHandling(StateContext<Stage4State, Stage4Event> context,
                                                Supplier<T> operation,
                                                String errorKey,
                                                String errorMessage) {
        try {
            return operation.get();
        } catch (Exception e) {
            handleError(context, e, errorKey, errorMessage);
            return null; // Ніколи не досягнеться через виключення
        }
    }

    /**
     * Обробляє помилку: зберігає в контексті та кидає структуровану помилку.
     */
    private static void handleError(StateContext<Stage4State, Stage4Event> context,
                                  Exception originalException,
                                  String errorKey,
                                  String errorMessage) {
        // Зберігаємо деталі помилки в контексті для подальшого аналізу
        Stage4ContextExtractor.storeValue(context, errorKey, originalException.getMessage());
        Stage4ContextExtractor.storeValue(context, "lastErrorTimestamp", System.currentTimeMillis());
        Stage4ContextExtractor.storeValue(context, "lastErrorType", originalException.getClass().getSimpleName());

        // Кидаємо структуровану помилку
        throw new Stage4ActionException(errorMessage, originalException);
    }

    /**
     * Спеціалізований винятки для помилок в Stage4 Actions.
     */
    public static final class Stage4ActionException extends RuntimeException {
        public Stage4ActionException(String message) {
            super(message);
        }

        public Stage4ActionException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
