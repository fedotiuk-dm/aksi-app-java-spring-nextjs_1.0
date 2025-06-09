package com.aksi.domain.order.statemachine.stage1.service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage1.dto.BasicOrderInfoDTO;
import com.aksi.domain.order.statemachine.stage1.enums.BasicOrderInfoState;

/**
 * Сервіс для управління станом базової інформації замовлення в етапі 1.3.
 * Управляє контекстом на рівні сесій без зовнішніх залежностей.
 */
@Service
public class BasicOrderInfoStateService {

    private final Map<String, BasicOrderInfoContext> sessionContexts = new ConcurrentHashMap<>();

    /**
     * Контекст базової інформації замовлення для окремої сесії.
     */
    public static class BasicOrderInfoContext {
        private final String sessionId;
        private BasicOrderInfoState currentState;
        private BasicOrderInfoDTO basicOrderInfo;
        private LocalDateTime lastUpdated;
        private String lastError;
        private boolean locked;

        public BasicOrderInfoContext(String sessionId) {
            this.sessionId = sessionId;
            this.currentState = BasicOrderInfoState.INIT;
            this.basicOrderInfo = new BasicOrderInfoDTO();
            this.lastUpdated = LocalDateTime.now();
            this.locked = false;
        }

        // Геттери та сеттери
        public String getSessionId() { return sessionId; }

        public BasicOrderInfoState getCurrentState() { return currentState; }
        public void setCurrentState(BasicOrderInfoState currentState) {
            this.currentState = currentState;
            this.lastUpdated = LocalDateTime.now();
        }

        public BasicOrderInfoDTO getBasicOrderInfo() { return basicOrderInfo; }
        public void setBasicOrderInfo(BasicOrderInfoDTO basicOrderInfo) {
            this.basicOrderInfo = basicOrderInfo;
            this.lastUpdated = LocalDateTime.now();
        }

        public LocalDateTime getLastUpdated() { return lastUpdated; }

        public String getLastError() { return lastError; }
        public void setLastError(String lastError) {
            this.lastError = lastError;
            this.lastUpdated = LocalDateTime.now();
        }

        public boolean isLocked() { return locked; }
        public void setLocked(boolean locked) {
            this.locked = locked;
            this.lastUpdated = LocalDateTime.now();
        }

        public void updateTimestamp() {
            this.lastUpdated = LocalDateTime.now();
        }

        public boolean isExpired(int timeoutMinutes) {
            return lastUpdated.isBefore(LocalDateTime.now().minusMinutes(timeoutMinutes));
        }
    }

    /**
     * Ініціалізує новий контекст для сесії.
     */
    public String initializeContext() {
        String sessionId = UUID.randomUUID().toString();
        BasicOrderInfoContext context = new BasicOrderInfoContext(sessionId);
        sessionContexts.put(sessionId, context);
        return sessionId;
    }

    /**
     * Отримує контекст за ID сесії.
     */
    public BasicOrderInfoContext getContext(String sessionId) {
        if (sessionId == null) return null;
        return sessionContexts.get(sessionId);
    }

    /**
     * Отримує контекст за ID сесії або створює новий.
     */
    public BasicOrderInfoContext getOrCreateContext(String sessionId) {
        if (sessionId == null) {
            sessionId = initializeContext();
        }

        BasicOrderInfoContext context = sessionContexts.get(sessionId);
        if (context == null) {
            context = new BasicOrderInfoContext(sessionId);
            sessionContexts.put(sessionId, context);
        }

        return context;
    }

    /**
     * Оновлює стан контексту.
     */
    public boolean updateState(String sessionId, BasicOrderInfoState newState) {
        BasicOrderInfoContext context = getContext(sessionId);
        if (context == null || context.isLocked()) {
            return false;
        }

        context.setCurrentState(newState);
        return true;
    }

    /**
     * Оновлює дані базової інформації замовлення.
     */
    public boolean updateBasicOrderInfo(String sessionId, BasicOrderInfoDTO basicOrderInfo) {
        BasicOrderInfoContext context = getContext(sessionId);
        if (context == null || context.isLocked()) {
            return false;
        }

        context.setBasicOrderInfo(basicOrderInfo);
        return true;
    }

    /**
     * Комбінує оновлення стану та даних.
     */
    public boolean updateStateAndData(String sessionId, BasicOrderInfoState newState,
                                    BasicOrderInfoDTO basicOrderInfo) {
        BasicOrderInfoContext context = getContext(sessionId);
        if (context == null || context.isLocked()) {
            return false;
        }

        context.setCurrentState(newState);
        context.setBasicOrderInfo(basicOrderInfo);
        return true;
    }

    /**
     * Встановлює помилку для контексту.
     */
    public boolean setError(String sessionId, String error) {
        BasicOrderInfoContext context = getContext(sessionId);
        if (context == null) {
            return false;
        }

        context.setLastError(error);
        return true;
    }

    /**
     * Очищує помилку для контексту.
     */
    public boolean clearError(String sessionId) {
        BasicOrderInfoContext context = getContext(sessionId);
        if (context == null) {
            return false;
        }

        context.setLastError(null);
        return true;
    }

    /**
     * Блокує контекст для обробки.
     */
    public boolean lockContext(String sessionId) {
        BasicOrderInfoContext context = getContext(sessionId);
        if (context == null || context.isLocked()) {
            return false;
        }

        context.setLocked(true);
        return true;
    }

    /**
     * Розблоковує контекст.
     */
    public boolean unlockContext(String sessionId) {
        BasicOrderInfoContext context = getContext(sessionId);
        if (context == null) {
            return false;
        }

        context.setLocked(false);
        return true;
    }

    /**
     * Скидає контекст до початкового стану.
     */
    public boolean resetContext(String sessionId) {
        BasicOrderInfoContext context = getContext(sessionId);
        if (context == null || context.isLocked()) {
            return false;
        }

        context.setCurrentState(BasicOrderInfoState.INIT);
        context.setBasicOrderInfo(new BasicOrderInfoDTO());
        context.setLastError(null);
        return true;
    }

    /**
     * Видаляє контекст сесії.
     */
    public boolean removeContext(String sessionId) {
        if (sessionId == null) return false;
        return sessionContexts.remove(sessionId) != null;
    }

    /**
     * Очищає застарілі контексти.
     */
    public int cleanupExpiredContexts(int timeoutMinutes) {
        int removedCount = 0;
        var iterator = sessionContexts.entrySet().iterator();

        while (iterator.hasNext()) {
            var entry = iterator.next();
            if (entry.getValue().isExpired(timeoutMinutes)) {
                iterator.remove();
                removedCount++;
            }
        }

        return removedCount;
    }

    /**
     * Перевіряє стан контексту.
     */
    public BasicOrderInfoState getCurrentState(String sessionId) {
        BasicOrderInfoContext context = getContext(sessionId);
        return context != null ? context.getCurrentState() : BasicOrderInfoState.INIT;
    }

    /**
     * Перевіряє чи контекст заблокований.
     */
    public boolean isContextLocked(String sessionId) {
        BasicOrderInfoContext context = getContext(sessionId);
        return context != null && context.isLocked();
    }

    /**
     * Перевіряє чи контекст має помилки.
     */
    public boolean hasError(String sessionId) {
        BasicOrderInfoContext context = getContext(sessionId);
        return context != null && context.getLastError() != null;
    }

    /**
     * Отримує останню помилку.
     */
    public String getLastError(String sessionId) {
        BasicOrderInfoContext context = getContext(sessionId);
        return context != null ? context.getLastError() : null;
    }

    /**
     * Отримує дані базової інформації замовлення.
     */
    public BasicOrderInfoDTO getBasicOrderInfo(String sessionId) {
        BasicOrderInfoContext context = getContext(sessionId);
        return context != null ? context.getBasicOrderInfo() : null;
    }

    /**
     * Отримує кількість активних сесій.
     */
    public int getActiveSessionsCount() {
        return sessionContexts.size();
    }

    /**
     * Перевіряє чи існує сесія.
     */
    public boolean sessionExists(String sessionId) {
        return sessionId != null && sessionContexts.containsKey(sessionId);
    }

    /**
     * Оновлює timestamp контексту.
     */
    public boolean touchContext(String sessionId) {
        BasicOrderInfoContext context = getContext(sessionId);
        if (context == null) return false;

        context.updateTimestamp();
        return true;
    }
}
