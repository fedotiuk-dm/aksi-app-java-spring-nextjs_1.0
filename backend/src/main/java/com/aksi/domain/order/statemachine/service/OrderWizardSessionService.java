package com.aksi.domain.order.statemachine.service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.OrderState;

import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс управління сесіями Order Wizard.
 * Координує роботу всіх етапів та зберігає стан сесії.
 */
@Service
@Slf4j
public class OrderWizardSessionService {

    private final Map<UUID, WizardSession> activeSessions = new ConcurrentHashMap<>();

    /**
     * Створює нову сесію замовлення.
     */
    public void createSession(UUID sessionId) {
        log.info("Створення нової сесії Order Wizard: {}", sessionId);

        WizardSession session = WizardSession.builder()
            .sessionId(sessionId)
            .currentState(OrderState.INITIAL)
            .createdAt(LocalDateTime.now())
            .lastActivity(LocalDateTime.now())
            .build();

        activeSessions.put(sessionId, session);
        log.info("Сесію {} успішно створено", sessionId);
    }

    /**
     * Отримує сесію за ID.
     */
    public WizardSession getSession(UUID sessionId) {
        WizardSession session = activeSessions.get(sessionId);
        if (session != null) {
            // Оновлюємо час останньої активності
            session.setLastActivity(LocalDateTime.now());
        }
        return session;
    }

    /**
     * Оновлює стан сесії.
     */
    public void updateSessionState(UUID sessionId, OrderState newState) {
        WizardSession session = activeSessions.get(sessionId);
        if (session != null) {
            log.info("Оновлення стану сесії {} з {} на {}", sessionId, session.getCurrentState(), newState);
            session.setCurrentState(newState);
            session.setLastActivity(LocalDateTime.now());
        } else {
            log.warn("Спроба оновити неіснуючу сесію: {}", sessionId);
        }
    }

    /**
     * Завершує сесію.
     */
    public void completeSession(UUID sessionId) {
        WizardSession session = activeSessions.remove(sessionId);
        if (session != null) {
            log.info("Сесію {} завершено", sessionId);
        }
    }

    /**
     * Скасовує сесію.
     */
    public void cancelSession(UUID sessionId) {
        WizardSession session = activeSessions.remove(sessionId);
        if (session != null) {
            log.info("Сесію {} скасовано", sessionId);
        }
    }

    /**
     * Перевіряє чи активна сесія.
     */
    public boolean isSessionActive(UUID sessionId) {
        return activeSessions.containsKey(sessionId);
    }

    /**
     * Очищує неактивні сесії (старші 24 годин).
     */
    public void cleanupInactiveSessions() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(24);

        activeSessions.entrySet().removeIf(entry -> {
            boolean shouldRemove = entry.getValue().getLastActivity().isBefore(cutoff);
            if (shouldRemove) {
                log.info("Видалення неактивної сесії: {}", entry.getKey());
            }
            return shouldRemove;
        });
    }

    /**
     * Внутрішній клас для представлення сесії.
     */
    @lombok.Data
    @lombok.Builder
    public static class WizardSession {
        private UUID sessionId;
        private OrderState currentState;
        private LocalDateTime createdAt;
        private LocalDateTime lastActivity;
        @lombok.Builder.Default
        private Map<String, Object> sessionData = new ConcurrentHashMap<>();

        public void putData(String key, Object value) {
            sessionData.put(key, value);
        }

        public Object getData(String key) {
            return sessionData.get(key);
        }

        @SuppressWarnings("unchecked")
        public <T> T getData(String key, Class<T> type) {
            Object value = sessionData.get(key);
            if (value != null && type.isInstance(value)) {
                return (T) value;
            }
            return null;
        }
    }
}
