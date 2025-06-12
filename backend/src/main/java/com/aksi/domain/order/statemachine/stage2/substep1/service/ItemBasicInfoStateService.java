package com.aksi.domain.order.statemachine.stage2.substep1.service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep1.dto.ItemBasicInfoDTO;
import com.aksi.domain.order.statemachine.stage2.substep1.enums.ItemBasicInfoState;

/**
 * Сервіс для управління станом та контекстом підетапу 2.1
 */
@Service
public class ItemBasicInfoStateService {

    private final Map<UUID, ItemBasicInfoContext> contexts = new ConcurrentHashMap<>();

    /**
     * Контекст підетапу 2.1
     */
    public static class ItemBasicInfoContext {
        private ItemBasicInfoState currentState;
        private ItemBasicInfoDTO data;
        private String lastError;

        public ItemBasicInfoContext() {
            this.currentState = ItemBasicInfoState.NOT_STARTED;
            this.data = null;
            this.lastError = null;
        }

        // Getters and setters
        public ItemBasicInfoState getCurrentState() {
            return currentState;
        }

        public void setCurrentState(ItemBasicInfoState currentState) {
            this.currentState = currentState;
        }

        public ItemBasicInfoDTO getData() {
            return data;
        }

        public void setData(ItemBasicInfoDTO data) {
            this.data = data;
        }

        public String getLastError() {
            return lastError;
        }

        public void setLastError(String lastError) {
            this.lastError = lastError;
        }
    }

    /**
     * Створює новий контекст для сесії
     */
    public ItemBasicInfoContext createContext(UUID sessionId) {
        ItemBasicInfoContext context = new ItemBasicInfoContext();
        contexts.put(sessionId, context);
        return context;
    }

    /**
     * Отримує контекст для сесії
     */
    public ItemBasicInfoContext getContext(UUID sessionId) {
        return contexts.get(sessionId);
    }

    /**
     * Отримує або створює контекст для сесії
     */
    public ItemBasicInfoContext getOrCreateContext(UUID sessionId) {
        return contexts.computeIfAbsent(sessionId, id -> new ItemBasicInfoContext());
    }

    /**
     * Отримує або створює контекст для сесії (перевантажений метод для String)
     */
    public ItemBasicInfoContext getOrCreateContext(String sessionId) {
        if (sessionId == null) {
            throw new IllegalArgumentException("SessionId cannot be null");
        }
        try {
            UUID uuid = UUID.fromString(sessionId);
            return getOrCreateContext(uuid);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid sessionId format: " + sessionId, e);
        }
    }

    /**
     * Оновлює стан контексту
     */
    public void updateState(UUID sessionId, ItemBasicInfoState newState) {
        ItemBasicInfoContext context = getOrCreateContext(sessionId);
        context.setCurrentState(newState);
    }

    /**
     * Оновлює дані в контексті
     */
    public void updateData(UUID sessionId, ItemBasicInfoDTO data) {
        ItemBasicInfoContext context = getOrCreateContext(sessionId);
        context.setData(data);
    }

    /**
     * Встановлює помилку в контекст
     */
    public void setError(UUID sessionId, String error) {
        ItemBasicInfoContext context = getOrCreateContext(sessionId);
        context.setLastError(error);
        context.setCurrentState(ItemBasicInfoState.VALIDATION_ERROR);
    }

    /**
     * Очищає помилку з контексту
     */
    public void clearError(UUID sessionId) {
        ItemBasicInfoContext context = getContext(sessionId);
        if (context != null) {
            context.setLastError(null);
        }
    }

    /**
     * Перевіряє чи контекст існує
     */
    public boolean hasContext(UUID sessionId) {
        return contexts.containsKey(sessionId);
    }

    /**
     * Видаляє контекст сесії
     */
    public void removeContext(UUID sessionId) {
        contexts.remove(sessionId);
    }

    /**
     * Отримує поточний стан сесії
     */
    public ItemBasicInfoState getCurrentState(UUID sessionId) {
        ItemBasicInfoContext context = getContext(sessionId);
        return context != null ? context.getCurrentState() : ItemBasicInfoState.NOT_STARTED;
    }

    /**
     * Отримує дані сесії
     */
    public ItemBasicInfoDTO getData(UUID sessionId) {
        ItemBasicInfoContext context = getContext(sessionId);
        return context != null ? context.getData() : null;
    }

    /**
     * Перевіряє чи підетап завершено
     */
    public boolean isCompleted(UUID sessionId) {
        return getCurrentState(sessionId) == ItemBasicInfoState.COMPLETED;
    }

    /**
     * Перевіряє чи є помилки валідації
     */
    public boolean hasValidationError(UUID sessionId) {
        return getCurrentState(sessionId) == ItemBasicInfoState.VALIDATION_ERROR;
    }
}
