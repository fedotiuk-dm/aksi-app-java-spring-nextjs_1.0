package com.aksi.domain.order.statemachine.stage4.util;

import java.util.Optional;
import java.util.UUID;

import org.springframework.statemachine.ExtendedState;
import org.springframework.statemachine.StateContext;

import com.aksi.domain.order.statemachine.stage4.enums.Stage4Event;
import com.aksi.domain.order.statemachine.stage4.enums.Stage4State;
import com.aksi.domain.order.statemachine.stage4.service.Stage4StateService.Stage4Context;

/**
 * Утилітний клас для безпечного отримання значень з контексту State Machine.
 * Використовує сучасні Java практики з Optional та generics.
 */
public final class Stage4ContextExtractor {

    private Stage4ContextExtractor() {
        // Утилітний клас не потребує створення екземплярів
    }

    /**
     * Безпечно отримує значення з Extended State за ключем.
     *
     * @param <T> тип очікуваного значення
     * @param context контекст State Machine
     * @param key ключ значення
     * @param expectedType очікуваний тип значення
     * @return Optional з значенням або пустий Optional
     */
    public static <T> Optional<T> extractValue(StateContext<Stage4State, Stage4Event> context,
                                               String key,
                                               Class<T> expectedType) {
        return Optional.ofNullable(context)
                .map(StateContext::getExtendedState)
                .map(ExtendedState::getVariables)
                .map(variables -> variables.get(key))
                .filter(expectedType::isInstance)
                .map(expectedType::cast);
    }

    /**
     * Отримує UUID з контексту або кидає винятки.
     *
     * @param context контекст State Machine
     * @param key ключ значення
     * @return UUID значення
     * @throws Stage4ContextException якщо значення відсутнє або неправильного типу
     */
    public static UUID extractRequiredUUID(StateContext<Stage4State, Stage4Event> context, String key) {
        return extractValue(context, key, UUID.class)
                .orElseThrow(() -> new Stage4ContextException(
                    String.format("Обов'язкове UUID значення '%s' відсутнє в контексті", key)));
    }

    /**
     * Отримує String з контексту або кидає винятки.
     *
     * @param context контекст State Machine
     * @param key ключ значення
     * @return String значення
     * @throws Stage4ContextException якщо значення відсутнє або неправильного типу
     */
    public static String extractRequiredString(StateContext<Stage4State, Stage4Event> context, String key) {
        return extractValue(context, key, String.class)
                .orElseThrow(() -> new Stage4ContextException(
                    String.format("Обов'язкове String значення '%s' відсутнє в контексті", key)));
    }

    /**
     * Отримує Boolean з контексту або кидає винятки.
     *
     * @param context контекст State Machine
     * @param key ключ значення
     * @return Boolean значення
     * @throws Stage4ContextException якщо значення відсутнє або неправильного типу
     */
    public static Boolean extractRequiredBoolean(StateContext<Stage4State, Stage4Event> context, String key) {
        return extractValue(context, key, Boolean.class)
                .orElseThrow(() -> new Stage4ContextException(
                    String.format("Обов'язкове Boolean значення '%s' відсутнє в контексті", key)));
    }

    /**
     * Отримує String з контексту або повертає значення за замовчуванням.
     *
     * @param context контекст State Machine
     * @param key ключ значення
     * @param defaultValue значення за замовчуванням
     * @return String значення або defaultValue
     */
    public static String extractStringOrDefault(StateContext<Stage4State, Stage4Event> context,
                                               String key,
                                               String defaultValue) {
        return extractValue(context, key, String.class).orElse(defaultValue);
    }

    /**
     * Отримує Boolean з контексту або повертає значення за замовчуванням.
     *
     * @param context контекст State Machine
     * @param key ключ значення
     * @param defaultValue значення за замовчуванням
     * @return Boolean значення або defaultValue
     */
    public static Boolean extractBooleanOrDefault(StateContext<Stage4State, Stage4Event> context,
                                                 String key,
                                                 Boolean defaultValue) {
        return extractValue(context, key, Boolean.class).orElse(defaultValue);
    }

    /**
     * Зберігає значення в Extended State.
     *
     * @param context контекст State Machine
     * @param key ключ для збереження
     * @param value значення для збереження
     */
    public static void storeValue(StateContext<Stage4State, Stage4Event> context, String key, Object value) {
        Optional.ofNullable(context)
                .map(StateContext::getExtendedState)
                .map(ExtendedState::getVariables)
                .ifPresent(variables -> variables.put(key, value));
    }

    /**
     * Отримує Stage4Context з контексту або повертає null.
     * Спеціалізований метод для Guards, які повинні повертати false замість кидання винятку.
     *
     * @param context контекст State Machine
     * @return Stage4Context або null якщо відсутній
     */
    public static Stage4Context extractStage4ContextOrNull(StateContext<Stage4State, Stage4Event> context) {
        return extractValue(context, "stage4Context", Stage4Context.class).orElse(null);
    }

    /**
     * Безпечно отримує UUID з контексту або повертає null.
     * Спеціалізований метод для Guards, які повинні повертати false замість кидання винятку.
     *
     * @param context контекст State Machine
     * @param key ключ значення
     * @return UUID значення або null якщо відсутнє
     */
    public static UUID extractUUIDOrNull(StateContext<Stage4State, Stage4Event> context, String key) {
        return extractValue(context, key, UUID.class).orElse(null);
    }

    /**
     * Спеціалізований винятки для помилок контексту Stage4.
     */
    public static final class Stage4ContextException extends RuntimeException {
        public Stage4ContextException(String message) {
            super(message);
        }

        public Stage4ContextException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
