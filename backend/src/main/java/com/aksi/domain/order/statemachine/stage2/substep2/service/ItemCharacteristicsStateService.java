package com.aksi.domain.order.statemachine.stage2.substep2.service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep2.dto.ItemCharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.ItemCharacteristicsState;

/**
 * Сервіс управління станом підетапу 2.2 "Характеристики предмета".
 * Відповідає за збереження та управління контекстом стану.
 */
@Service
public class ItemCharacteristicsStateService {

    private final Map<UUID, ItemCharacteristicsContext> contexts = new ConcurrentHashMap<>();

    /**
     * Контекст стану підетапу характеристик предмета.
     */
    public static class ItemCharacteristicsContext {
        private ItemCharacteristicsState currentState;
        private ItemCharacteristicsDTO data;
        private String errorMessage;

        public ItemCharacteristicsContext() {
            this.currentState = ItemCharacteristicsState.NOT_STARTED;
            this.data = new ItemCharacteristicsDTO();
        }

        // Getters and Setters
        public ItemCharacteristicsState getCurrentState() {
            return currentState;
        }

        public void setCurrentState(final ItemCharacteristicsState currentState) {
            this.currentState = currentState;
        }

        public ItemCharacteristicsDTO getData() {
            return data;
        }

        public void setData(final ItemCharacteristicsDTO data) {
            this.data = data;
        }

        public String getErrorMessage() {
            return errorMessage;
        }

        public void setErrorMessage(final String errorMessage) {
            this.errorMessage = errorMessage;
        }

        public boolean hasError() {
            return errorMessage != null && !errorMessage.trim().isEmpty();
        }

        public void clearError() {
            this.errorMessage = null;
        }
    }

    /**
     * Створює новий контекст для сесії.
     */
    public ItemCharacteristicsContext createContext(final UUID sessionId) {
        final ItemCharacteristicsContext context = new ItemCharacteristicsContext();
        contexts.put(sessionId, context);
        return context;
    }

    /**
     * Отримує контекст за ідентифікатором сесії.
     */
    public ItemCharacteristicsContext getContext(final UUID sessionId) {
        return contexts.get(sessionId);
    }

    /**
     * Оновлює стан контексту.
     */
    public void updateState(final UUID sessionId, final ItemCharacteristicsState newState) {
        final ItemCharacteristicsContext context = contexts.get(sessionId);
        if (context != null) {
            context.setCurrentState(newState);
        }
    }

    /**
     * Оновлює дані в контексті.
     */
    public void updateData(final UUID sessionId, final ItemCharacteristicsDTO data) {
        final ItemCharacteristicsContext context = contexts.get(sessionId);
        if (context != null) {
            context.setData(data);
        }
    }

    /**
     * Встановлює помилку в контексті.
     */
    public void setError(final UUID sessionId, final String errorMessage) {
        final ItemCharacteristicsContext context = contexts.get(sessionId);
        if (context != null) {
            context.setErrorMessage(errorMessage);
        }
    }

    /**
     * Очищає помилку в контексті.
     */
    public void clearError(final UUID sessionId) {
        final ItemCharacteristicsContext context = contexts.get(sessionId);
        if (context != null) {
            context.clearError();
        }
    }

    /**
     * Видаляє контекст сесії.
     */
    public void removeContext(final UUID sessionId) {
        contexts.remove(sessionId);
    }

    /**
     * Перевіряє чи існує контекст для сесії.
     */
    public boolean hasContext(final UUID sessionId) {
        return contexts.containsKey(sessionId);
    }

    /**
     * Отримує поточний стан для сесії.
     */
    public ItemCharacteristicsState getCurrentState(final UUID sessionId) {
        final ItemCharacteristicsContext context = getContext(sessionId);
        return context != null ? context.getCurrentState() : ItemCharacteristicsState.NOT_STARTED;
    }

    /**
     * Перевіряє чи є помилка в сесії.
     */
    public boolean hasError(final UUID sessionId) {
        final ItemCharacteristicsContext context = getContext(sessionId);
        return context != null && context.hasError();
    }

    /**
     * Отримує повідомлення про помилку для сесії.
     */
    public String getErrorMessage(final UUID sessionId) {
        final ItemCharacteristicsContext context = getContext(sessionId);
        return context != null ? context.getErrorMessage() : null;
    }

    /**
     * Перевіряє чи існує активна сесія.
     */
    public boolean hasActiveSession(final UUID sessionId) {
        return hasContext(sessionId);
    }

    /**
     * Завершує сесію та очищає контекст.
     */
    public void terminateSession(final UUID sessionId) {
        removeContext(sessionId);
    }
}
