package com.aksi.domain.order.statemachine.stage2.service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.dto.ItemManagerDTO;
import com.aksi.domain.order.statemachine.stage2.enums.Stage2State;

/**
 * Сервіс управління станом головного екрану менеджера предметів (Етап 2.0).
 */
@Service
public class Stage2StateService {

    private final Map<UUID, Stage2Context> activeContexts = new ConcurrentHashMap<>();

    /**
     * Контекст для управління станом головного екрану менеджера предметів
     */
    public static class Stage2Context {
        private final UUID sessionId;
        private final UUID orderId;
        private final long createdAt;
        private Stage2State currentState;
        private ItemManagerDTO managerData;
        private long lastUpdated;

        public Stage2Context(final UUID sessionId, final UUID orderId) {
            this.sessionId = sessionId;
            this.orderId = orderId;
            this.createdAt = System.currentTimeMillis();
            this.currentState = Stage2State.NOT_STARTED;
            this.lastUpdated = this.createdAt;
        }

        // Getters
        public UUID getSessionId() { return sessionId; }
        public UUID getOrderId() { return orderId; }
        public long getCreatedAt() { return createdAt; }
        public Stage2State getCurrentState() { return currentState; }
        public ItemManagerDTO getManagerData() { return managerData; }
        public long getLastUpdated() { return lastUpdated; }

        // Setters з автоматичним оновленням часу
        public void setCurrentState(final Stage2State currentState) {
            this.currentState = currentState;
            this.lastUpdated = System.currentTimeMillis();
        }

        public void setManagerData(final ItemManagerDTO managerData) {
            this.managerData = managerData;
            this.lastUpdated = System.currentTimeMillis();
        }

        public boolean hasManagerData() {
            return managerData != null;
        }
    }

    /**
     * Створює новий контекст для сесії
     */
    public Stage2Context createContext(final UUID orderId) {
        final UUID sessionId = UUID.randomUUID();
        final Stage2Context context = new Stage2Context(sessionId, orderId);
        activeContexts.put(sessionId, context);
        return context;
    }

    /**
     * Отримує контекст за ідентифікатором сесії
     */
    public Stage2Context getContext(final UUID sessionId) {
        return activeContexts.get(sessionId);
    }

    /**
     * Отримує контекст за ідентифікатором сесії або створює новий
     */
    public Stage2Context getOrCreateContext(final UUID sessionId) {
        if (sessionId == null) {
            throw new IllegalArgumentException("SessionId cannot be null");
        }

        Stage2Context context = activeContexts.get(sessionId);
        if (context == null) {
            // Створюємо контекст з sessionId як orderId (можна змінити логіку при потребі)
            context = new Stage2Context(sessionId, sessionId);
            activeContexts.put(sessionId, context);
        }

        return context;
    }

    /**
     * Оновлює стан контексту
     */
    public void updateState(final UUID sessionId, final Stage2State newState) {
        final Stage2Context context = activeContexts.get(sessionId);
        if (context != null) {
            context.setCurrentState(newState);
        }
    }

    /**
     * Оновлює дані менеджера в контексті
     */
    public void updateManagerData(final UUID sessionId, final ItemManagerDTO managerData) {
        final Stage2Context context = activeContexts.get(sessionId);
        if (context != null) {
            context.setManagerData(managerData);
        }
    }

    /**
     * Видаляє контекст сесії
     */
    public void removeContext(final UUID sessionId) {
        activeContexts.remove(sessionId);
    }

    /**
     * Перевіряє, чи існує контекст для сесії
     */
    public boolean hasContext(final UUID sessionId) {
        return activeContexts.containsKey(sessionId);
    }

    /**
     * Отримує кількість активних контекстів
     */
    public int getActiveContextCount() {
        return activeContexts.size();
    }

    /**
     * Очищає застарілі контексти (старше 24 годин)
     */
    public void cleanupStaleContexts() {
        final long cutoffTime = System.currentTimeMillis() - 24 * 60 * 60 * 1000; // 24 години
        activeContexts.entrySet().removeIf(entry -> entry.getValue().getLastUpdated() < cutoffTime);
    }
}
