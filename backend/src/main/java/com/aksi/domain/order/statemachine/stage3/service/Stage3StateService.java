package com.aksi.domain.order.statemachine.stage3.service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage3.dto.AdditionalInfoDTO;
import com.aksi.domain.order.statemachine.stage3.dto.DiscountConfigurationDTO;
import com.aksi.domain.order.statemachine.stage3.dto.ExecutionParamsDTO;
import com.aksi.domain.order.statemachine.stage3.dto.PaymentConfigurationDTO;
import com.aksi.domain.order.statemachine.stage3.enums.Stage3State;

/**
 * State Service для управління контекстом Stage3
 * ЕТАП 3.1: State Service (управління контекстом)
 */
@Service
public class Stage3StateService {

    private final Map<UUID, Stage3Context> contexts = new ConcurrentHashMap<>();

    /**
     * Контекст Stage3 для зберігання стану сесії
     */
    public static class Stage3Context {
        private final UUID sessionId;
        private Stage3State currentState;
        private LocalDateTime lastUpdated;

        // DTO для кожного підетапу
        private ExecutionParamsDTO executionParams;
        private DiscountConfigurationDTO discountConfiguration;
        private PaymentConfigurationDTO paymentConfiguration;
        private AdditionalInfoDTO additionalInfo;

        // Метадані
        private String lastAction;
        private String lastError;
        private boolean isValid;

        public Stage3Context(UUID sessionId) {
            this.sessionId = sessionId;
            this.currentState = Stage3State.STAGE3_INIT;
            this.lastUpdated = LocalDateTime.now();
            this.isValid = true;
        }

        // === ГЕТТЕРИ ТА СЕТТЕРИ ===

        public UUID getSessionId() {
            return sessionId;
        }

        public Stage3State getCurrentState() {
            return currentState;
        }

        public void setCurrentState(Stage3State currentState) {
            this.currentState = currentState;
            this.lastUpdated = LocalDateTime.now();
        }

        public LocalDateTime getLastUpdated() {
            return lastUpdated;
        }

        public ExecutionParamsDTO getExecutionParams() {
            return executionParams;
        }

        public void setExecutionParams(ExecutionParamsDTO executionParams) {
            this.executionParams = executionParams;
            this.lastUpdated = LocalDateTime.now();
        }

        public DiscountConfigurationDTO getDiscountConfiguration() {
            return discountConfiguration;
        }

        public void setDiscountConfiguration(DiscountConfigurationDTO discountConfiguration) {
            this.discountConfiguration = discountConfiguration;
            this.lastUpdated = LocalDateTime.now();
        }

        public PaymentConfigurationDTO getPaymentConfiguration() {
            return paymentConfiguration;
        }

        public void setPaymentConfiguration(PaymentConfigurationDTO paymentConfiguration) {
            this.paymentConfiguration = paymentConfiguration;
            this.lastUpdated = LocalDateTime.now();
        }

        public AdditionalInfoDTO getAdditionalInfo() {
            return additionalInfo;
        }

        public void setAdditionalInfo(AdditionalInfoDTO additionalInfo) {
            this.additionalInfo = additionalInfo;
            this.lastUpdated = LocalDateTime.now();
        }

        public String getLastAction() {
            return lastAction;
        }

        public void setLastAction(String lastAction) {
            this.lastAction = lastAction;
            this.lastUpdated = LocalDateTime.now();
        }

        public String getLastError() {
            return lastError;
        }

        public void setLastError(String lastError) {
            this.lastError = lastError;
            this.lastUpdated = LocalDateTime.now();
        }

        public boolean isValid() {
            return isValid;
        }

        public void setValid(boolean valid) {
            this.isValid = valid;
            this.lastUpdated = LocalDateTime.now();
        }

        // === UTILITY МЕТОДИ ===

        /**
         * Оновлює час останньої активності
         */
        public void touch() {
            this.lastUpdated = LocalDateTime.now();
        }

        /**
         * Перевіряє чи контекст застарілий
         */
        public boolean isStale(int maxAgeMinutes) {
            return lastUpdated.isBefore(LocalDateTime.now().minusMinutes(maxAgeMinutes));
        }

        /**
         * Перевіряє чи є дані для підетапу 3.1
         */
        public boolean hasExecutionParams() {
            return executionParams != null;
        }

        /**
         * Перевіряє чи є дані для підетапу 3.2
         */
        public boolean hasDiscountConfiguration() {
            return discountConfiguration != null;
        }

        /**
         * Перевіряє чи є дані для підетапу 3.3
         */
        public boolean hasPaymentConfiguration() {
            return paymentConfiguration != null;
        }

        /**
         * Перевіряє чи є дані для підетапу 3.4
         */
        public boolean hasAdditionalInfo() {
            return additionalInfo != null;
        }

        /**
         * Перевіряє чи всі підетапи мають дані
         */
        public boolean hasAllSubsteps() {
            return hasExecutionParams() &&
                   hasDiscountConfiguration() &&
                   hasPaymentConfiguration() &&
                   hasAdditionalInfo();
        }

        /**
         * Підраховує кількість завершених підетапів
         */
        public int getCompletedSubstepsCount() {
            int count = 0;
            if (hasExecutionParams()) count++;
            if (hasDiscountConfiguration()) count++;
            if (hasPaymentConfiguration()) count++;
            if (hasAdditionalInfo()) count++;
            return count;
        }

        /**
         * Очищає всі дані підетапів
         */
        public void clearAllData() {
            this.executionParams = null;
            this.discountConfiguration = null;
            this.paymentConfiguration = null;
            this.additionalInfo = null;
            this.lastUpdated = LocalDateTime.now();
        }

        /**
         * Очищає помилки
         */
        public void clearError() {
            this.lastError = null;
            this.lastUpdated = LocalDateTime.now();
        }
    }

    // === ОСНОВНІ МЕТОДИ СЕРВІСУ ===

    /**
     * Створює новий контекст для сесії
     */
    public Stage3Context createContext(UUID sessionId) {
        Stage3Context context = new Stage3Context(sessionId);
        contexts.put(sessionId, context);
        return context;
    }

    /**
     * Отримує контекст за ID сесії
     */
    public Stage3Context getContext(UUID sessionId) {
        return contexts.get(sessionId);
    }

    /**
     * Отримує контекст або створює новий, якщо не існує
     */
    public Stage3Context getOrCreateContext(UUID sessionId) {
        return contexts.computeIfAbsent(sessionId, Stage3Context::new);
    }

    /**
     * Оновлює стан контексту
     */
    public void updateState(UUID sessionId, Stage3State newState) {
        Stage3Context context = getContext(sessionId);
        if (context != null) {
            context.setCurrentState(newState);
        }
    }

    /**
     * Оновлює стан з дією
     */
    public void updateStateWithAction(UUID sessionId, Stage3State newState, String action) {
        Stage3Context context = getContext(sessionId);
        if (context != null) {
            context.setCurrentState(newState);
            context.setLastAction(action);
        }
    }

    /**
     * Встановлює помилку для контексту
     */
    public void setError(UUID sessionId, String error) {
        Stage3Context context = getContext(sessionId);
        if (context != null) {
            context.setLastError(error);
            context.setValid(false);
        }
    }

    /**
     * Очищає помилку для контексту
     */
    public void clearError(UUID sessionId) {
        Stage3Context context = getContext(sessionId);
        if (context != null) {
            context.clearError();
            context.setValid(true);
        }
    }

    /**
     * Оновлює дані для підетапу 3.1
     */
    public void updateExecutionParams(UUID sessionId, ExecutionParamsDTO executionParams) {
        Stage3Context context = getOrCreateContext(sessionId);
        context.setExecutionParams(executionParams);
    }

    /**
     * Оновлює дані для підетапу 3.2
     */
    public void updateDiscountConfiguration(UUID sessionId, DiscountConfigurationDTO discountConfiguration) {
        Stage3Context context = getOrCreateContext(sessionId);
        context.setDiscountConfiguration(discountConfiguration);
    }

    /**
     * Оновлює дані для підетапу 3.3
     */
    public void updatePaymentConfiguration(UUID sessionId, PaymentConfigurationDTO paymentConfiguration) {
        Stage3Context context = getOrCreateContext(sessionId);
        context.setPaymentConfiguration(paymentConfiguration);
    }

    /**
     * Оновлює дані для підетапу 3.4
     */
    public void updateAdditionalInfo(UUID sessionId, AdditionalInfoDTO additionalInfo) {
        Stage3Context context = getOrCreateContext(sessionId);
        context.setAdditionalInfo(additionalInfo);
    }

    /**
     * Видаляє контекст сесії
     */
    public void removeContext(UUID sessionId) {
        contexts.remove(sessionId);
    }

    /**
     * Очищає всі дані контексту, але зберігає сам контекст
     */
    public void clearContextData(UUID sessionId) {
        Stage3Context context = getContext(sessionId);
        if (context != null) {
            context.clearAllData();
            context.setCurrentState(Stage3State.STAGE3_INIT);
        }
    }

    /**
     * Перевіряє чи контекст існує
     */
    public boolean hasContext(UUID sessionId) {
        return contexts.containsKey(sessionId);
    }

    /**
     * Отримує поточний стан сесії
     */
    public Stage3State getCurrentState(UUID sessionId) {
        Stage3Context context = getContext(sessionId);
        return context != null ? context.getCurrentState() : null;
    }

    /**
     * Перевіряє чи сесія в певному стані
     */
    public boolean isInState(UUID sessionId, Stage3State state) {
        Stage3State currentState = getCurrentState(sessionId);
        return currentState != null && currentState.equals(state);
    }

    /**
     * Очищає застарілі контексти
     */
    public int cleanupStaleContexts(int maxAgeMinutes) {
        int removedCount = 0;
        var iterator = contexts.entrySet().iterator();

        while (iterator.hasNext()) {
            var entry = iterator.next();
            if (entry.getValue().isStale(maxAgeMinutes)) {
                iterator.remove();
                removedCount++;
            }
        }

        return removedCount;
    }

    /**
     * Отримує кількість активних контекстів
     */
    public int getActiveContextsCount() {
        return contexts.size();
    }

    /**
     * Отримує статистику контекстів по станах
     */
    public Map<Stage3State, Long> getContextStatsByState() {
        return contexts.values().stream()
                .collect(java.util.stream.Collectors.groupingBy(
                    Stage3Context::getCurrentState,
                    java.util.stream.Collectors.counting()
                ));
    }

    /**
     * Перевіряє чи контекст готовий до завершення Stage3
     */
    public boolean isReadyForCompletion(UUID sessionId) {
        Stage3Context context = getContext(sessionId);
        if (context == null) {
            return false;
        }

        return context.hasAllSubsteps() &&
               context.isValid() &&
               context.getCurrentState() != Stage3State.STAGE3_ERROR;
    }

    /**
     * Отримує прогрес Stage3 у відсотках
     */
    public int getProgressPercentage(UUID sessionId) {
        Stage3Context context = getContext(sessionId);
        if (context == null) {
            return 0;
        }

        int completedSubsteps = context.getCompletedSubstepsCount();
        return (completedSubsteps * 100) / 4; // 4 підетапи
    }
}
