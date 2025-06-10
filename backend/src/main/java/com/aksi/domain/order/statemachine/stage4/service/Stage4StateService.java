package com.aksi.domain.order.statemachine.stage4.service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage4.dto.LegalAcceptanceDTO;
import com.aksi.domain.order.statemachine.stage4.dto.OrderCompletionDTO;
import com.aksi.domain.order.statemachine.stage4.dto.OrderConfirmationDTO;
import com.aksi.domain.order.statemachine.stage4.dto.ReceiptConfigurationDTO;
import com.aksi.domain.order.statemachine.stage4.enums.Stage4State;

/**
 * Сервіс управління станом Stage4.
 * Відповідає за збереження та управління контекстом State Machine.
 */
@Service
public class Stage4StateService {

    /**
     * Контекст Stage4 для збереження всіх даних сесії.
     */
    public static class Stage4Context {
        private UUID sessionId;
        private UUID orderId;
        private Stage4State currentState;
        private OrderConfirmationDTO orderConfirmation;
        private LegalAcceptanceDTO legalAcceptance;
        private ReceiptConfigurationDTO receiptConfiguration;
        private OrderCompletionDTO orderCompletion;

        public Stage4Context() {
            this.currentState = Stage4State.STAGE4_INITIALIZED;
        }

        public Stage4Context(UUID sessionId) {
            this.sessionId = sessionId;
            this.currentState = Stage4State.STAGE4_INITIALIZED;
        }

        // Getters and Setters
        public UUID getSessionId() { return sessionId; }
        public void setSessionId(UUID sessionId) { this.sessionId = sessionId; }

        public UUID getOrderId() { return orderId; }
        public void setOrderId(UUID orderId) { this.orderId = orderId; }

        public Stage4State getCurrentState() { return currentState; }
        public void setCurrentState(Stage4State currentState) { this.currentState = currentState; }

        public OrderConfirmationDTO getOrderConfirmation() { return orderConfirmation; }
        public void setOrderConfirmation(OrderConfirmationDTO orderConfirmation) { this.orderConfirmation = orderConfirmation; }

        public LegalAcceptanceDTO getLegalAcceptance() { return legalAcceptance; }
        public void setLegalAcceptance(LegalAcceptanceDTO legalAcceptance) { this.legalAcceptance = legalAcceptance; }

        public ReceiptConfigurationDTO getReceiptConfiguration() { return receiptConfiguration; }
        public void setReceiptConfiguration(ReceiptConfigurationDTO receiptConfiguration) { this.receiptConfiguration = receiptConfiguration; }

        public OrderCompletionDTO getOrderCompletion() { return orderCompletion; }
        public void setOrderCompletion(OrderCompletionDTO orderCompletion) { this.orderCompletion = orderCompletion; }
    }

    /**
     * Зберігання контекстів сесій.
     */
    private final Map<UUID, Stage4Context> sessionContexts = new ConcurrentHashMap<>();

    /**
     * Створює новий контекст сесії.
     *
     * @param sessionId ID сесії
     * @return новий контекст Stage4
     */
    public Stage4Context createSession(UUID sessionId) {
        Stage4Context context = new Stage4Context(sessionId);
        sessionContexts.put(sessionId, context);
        return context;
    }

    /**
     * Отримує контекст сесії.
     *
     * @param sessionId ID сесії
     * @return контекст Stage4 або null якщо не знайдено
     */
    public Stage4Context getSession(UUID sessionId) {
        return sessionContexts.get(sessionId);
    }

    /**
     * Оновлює стан сесії.
     *
     * @param sessionId ID сесії
     * @param newState новий стан
     */
    public void updateSessionState(UUID sessionId, Stage4State newState) {
        Stage4Context context = sessionContexts.get(sessionId);
        if (context != null) {
            context.setCurrentState(newState);
        }
    }

    /**
     * Зберігає дані підтвердження замовлення.
     *
     * @param sessionId ID сесії
     * @param orderConfirmation дані підтвердження
     */
    public void saveOrderConfirmation(UUID sessionId, OrderConfirmationDTO orderConfirmation) {
        Stage4Context context = sessionContexts.get(sessionId);
        if (context != null) {
            context.setOrderConfirmation(orderConfirmation);
            if (orderConfirmation != null) {
                context.setCurrentState(orderConfirmation.getCurrentState());
            }
        }
    }

    /**
     * Зберігає дані юридичного прийняття.
     *
     * @param sessionId ID сесії
     * @param legalAcceptance дані юридичного прийняття
     */
    public void saveLegalAcceptance(UUID sessionId, LegalAcceptanceDTO legalAcceptance) {
        Stage4Context context = sessionContexts.get(sessionId);
        if (context != null) {
            context.setLegalAcceptance(legalAcceptance);
            if (legalAcceptance != null) {
                context.setCurrentState(legalAcceptance.getCurrentState());
            }
        }
    }

    /**
     * Зберігає конфігурацію квитанції.
     *
     * @param sessionId ID сесії
     * @param receiptConfiguration конфігурація квитанції
     */
    public void saveReceiptConfiguration(UUID sessionId, ReceiptConfigurationDTO receiptConfiguration) {
        Stage4Context context = sessionContexts.get(sessionId);
        if (context != null) {
            context.setReceiptConfiguration(receiptConfiguration);
            if (receiptConfiguration != null) {
                context.setCurrentState(receiptConfiguration.getCurrentState());
            }
        }
    }

    /**
     * Зберігає дані завершення замовлення.
     *
     * @param sessionId ID сесії
     * @param orderCompletion дані завершення
     */
    public void saveOrderCompletion(UUID sessionId, OrderCompletionDTO orderCompletion) {
        Stage4Context context = sessionContexts.get(sessionId);
        if (context != null) {
            context.setOrderCompletion(orderCompletion);
            if (orderCompletion != null) {
                context.setCurrentState(orderCompletion.getCurrentState());
            }
        }
    }

    /**
     * Видаляє сесію.
     *
     * @param sessionId ID сесії
     */
    public void removeSession(UUID sessionId) {
        sessionContexts.remove(sessionId);
    }

    /**
     * Перевіряє чи існує сесія.
     *
     * @param sessionId ID сесії
     * @return true якщо сесія існує
     */
    public boolean sessionExists(UUID sessionId) {
        return sessionContexts.containsKey(sessionId);
    }

    /**
     * Отримує контекст сесії як Optional.
     *
     * @param sessionId ID сесії
     * @return Optional з контекстом або empty
     */
    public java.util.Optional<Stage4Context> getContext(UUID sessionId) {
        return java.util.Optional.ofNullable(sessionContexts.get(sessionId));
    }

    /**
     * Зберігає контекст сесії.
     *
     * @param sessionId ID сесії
     * @param context контекст для збереження
     */
    public void saveContext(UUID sessionId, Stage4Context context) {
        sessionContexts.put(sessionId, context);
    }

    /**
     * Очищає контекст сесії.
     *
     * @param sessionId ID сесії
     */
    public void clearContext(UUID sessionId) {
        sessionContexts.remove(sessionId);
    }
}
