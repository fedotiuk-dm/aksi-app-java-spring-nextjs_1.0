package com.aksi.domain.order.statemachine.stage2.substep3.service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep3.dto.StainsDefectsDTO;
import com.aksi.domain.order.statemachine.stage2.substep3.enums.StainsDefectsState;

/**
 * Сервіс для управління станом підетапу 2.3 "Забруднення, дефекти та ризики".
 * Управляє контекстом БЕЗ зовнішніх залежностей (окрім DTO та Enums).
 */
@Service
public class StainsDefectsStateService {

    private final Map<UUID, StainsDefectsContext> contexts = new ConcurrentHashMap<>();

    /**
     * Контекст підетапу 2.3.
     */
    public static class StainsDefectsContext {
        private StainsDefectsState currentState;
        private StainsDefectsDTO data;
        private String errorMessage;

        public StainsDefectsContext() {
            this.currentState = StainsDefectsState.NOT_STARTED;
            this.data = new StainsDefectsDTO();
        }

        public StainsDefectsState getCurrentState() {
            return currentState;
        }

        public void setCurrentState(final StainsDefectsState currentState) {
            this.currentState = currentState;
        }

        public StainsDefectsDTO getData() {
            return data;
        }

        public void setData(final StainsDefectsDTO data) {
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
     *
     * @param sessionId ідентифікатор сесії
     * @return новий контекст
     */
    public StainsDefectsContext createContext(final UUID sessionId) {
        final StainsDefectsContext context = new StainsDefectsContext();
        contexts.put(sessionId, context);
        return context;
    }

    /**
     * Отримує контекст за ідентифікатором сесії.
     *
     * @param sessionId ідентифікатор сесії
     * @return контекст або null, якщо не знайдено
     */
    public StainsDefectsContext getContext(final UUID sessionId) {
        return contexts.get(sessionId);
    }

    /**
     * Оновлює стан контексту.
     *
     * @param sessionId ідентифікатор сесії
     * @param newState новий стан
     */
    public void updateState(final UUID sessionId, final StainsDefectsState newState) {
        final StainsDefectsContext context = contexts.get(sessionId);
        if (context != null) {
            context.setCurrentState(newState);
        }
    }

    /**
     * Оновлює дані контексту.
     *
     * @param sessionId ідентифікатор сесії
     * @param data нові дані
     */
    public void updateData(final UUID sessionId, final StainsDefectsDTO data) {
        final StainsDefectsContext context = contexts.get(sessionId);
        if (context != null) {
            context.setData(data);
        }
    }

    /**
     * Встановлює повідомлення про помилку.
     *
     * @param sessionId ідентифікатор сесії
     * @param errorMessage повідомлення про помилку
     */
    public void setError(final UUID sessionId, final String errorMessage) {
        final StainsDefectsContext context = contexts.get(sessionId);
        if (context != null) {
            context.setErrorMessage(errorMessage);
            context.setCurrentState(StainsDefectsState.ERROR);
        }
    }

    /**
     * Очищує помилку.
     *
     * @param sessionId ідентифікатор сесії
     */
    public void clearError(final UUID sessionId) {
        final StainsDefectsContext context = contexts.get(sessionId);
        if (context != null) {
            context.clearError();
        }
    }

    /**
     * Видаляє контекст.
     *
     * @param sessionId ідентифікатор сесії
     */
    public void removeContext(final UUID sessionId) {
        contexts.remove(sessionId);
    }

    /**
     * Перевіряє, чи є помилки в контексті.
     *
     * @param sessionId ідентифікатор сесії
     * @return true, якщо є помилки
     */
    public boolean hasErrors(final UUID sessionId) {
        final StainsDefectsContext context = contexts.get(sessionId);
        if (context == null) {
            return true; // відсутність контексту - це помилка
        }
        return context.hasError();
    }

    /**
     * Перевіряє, чи є дані в контексті.
     *
     * @param sessionId ідентифікатор сесії
     * @return true, якщо є дані
     */
    public boolean hasData(final UUID sessionId) {
        final StainsDefectsContext context = contexts.get(sessionId);
        return context != null && context.getData() != null;
    }
}
