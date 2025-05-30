package com.aksi.ui.wizard.step4.events;

import java.time.LocalDateTime;
import java.util.Set;

import com.aksi.ui.wizard.dto.OrderWizardData;
import com.aksi.ui.wizard.step4.domain.ConfirmationState;

/**
 * Sealed interface для подій етапу підтвердження замовлення.
 * Event-driven архітектура для координації процесу підтвердження.
 */
public sealed interface ConfirmationEvents
        permits ConfirmationEvents.ConfirmationInitialized,
                ConfirmationEvents.ConfirmationStateUpdated,
                ConfirmationEvents.OrderValidationCompleted,
                ConfirmationEvents.AgreementStatusChanged,
                ConfirmationEvents.ReceiptGenerationRequested,
                ConfirmationEvents.ReceiptGenerationCompleted,
                ConfirmationEvents.ReceiptGenerationFailed,
                ConfirmationEvents.EmailSendingRequested,
                ConfirmationEvents.EmailSendingCompleted,
                ConfirmationEvents.EmailSendingFailed,
                ConfirmationEvents.OrderCompletionRequested,
                ConfirmationEvents.OrderCompletionCompleted,
                ConfirmationEvents.OrderCompletionFailed,
                ConfirmationEvents.NavigationRequested,
                ConfirmationEvents.ConfirmationError,
                ConfirmationEvents.LoadingStarted,
                ConfirmationEvents.LoadingCompleted,
                ConfirmationEvents.UIStateChanged,
                ConfirmationEvents.ValidationWarningsDisplayed,
                ConfirmationEvents.ProgressUpdated {

    /**
     * Подія ініціалізації підтвердження.
     */
    record ConfirmationInitialized(
            ConfirmationState initialState,
            OrderWizardData wizardData,
            String sessionId,
            LocalDateTime initTime
    ) implements ConfirmationEvents {}

    /**
     * Подія оновлення стану підтвердження.
     */
    record ConfirmationStateUpdated(
            ConfirmationState confirmationState,
            String changeReason,
            String changedProperty
    ) implements ConfirmationEvents {}

    /**
     * Подія завершення валідації замовлення.
     */
    record OrderValidationCompleted(
            boolean isValid,
            Set<String> validationErrors,
            Set<String> warnings,
            int itemsCount,
            double totalAmount
    ) implements ConfirmationEvents {}

    /**
     * Подія зміни статусу угоди.
     */
    record AgreementStatusChanged(
            boolean isAccepted,
            LocalDateTime changedAt,
            boolean canProceedToCompletion
    ) implements ConfirmationEvents {}

    /**
     * Подія запиту генерації квитанції.
     */
    record ReceiptGenerationRequested(
            OrderWizardData wizardData,
            String receiptNumber,
            String format
    ) implements ConfirmationEvents {}

    /**
     * Подія успішної генерації квитанції.
     */
    record ReceiptGenerationCompleted(
            byte[] receiptBytes,
            String fileName,
            String format,
            long fileSizeBytes,
            LocalDateTime generatedAt
    ) implements ConfirmationEvents {}

    /**
     * Подія помилки генерації квитанції.
     */
    record ReceiptGenerationFailed(
            String errorMessage,
            String errorCode,
            Exception exception
    ) implements ConfirmationEvents {}

    /**
     * Подія запиту відправки email.
     */
    record EmailSendingRequested(
            String recipientEmail,
            String clientName,
            String receiptNumber,
            byte[] attachmentBytes
    ) implements ConfirmationEvents {}

    /**
     * Подія успішної відправки email.
     */
    record EmailSendingCompleted(
            String recipientEmail,
            LocalDateTime sentAt,
            String messageId
    ) implements ConfirmationEvents {}

    /**
     * Подія помилки відправки email.
     */
    record EmailSendingFailed(
            String recipientEmail,
            String errorMessage,
            Exception exception
    ) implements ConfirmationEvents {}

    /**
     * Подія запиту завершення замовлення.
     */
    record OrderCompletionRequested(
            OrderWizardData wizardData,
            ConfirmationState currentState,
            boolean hasGeneratedReceipt
    ) implements ConfirmationEvents {}

    /**
     * Подія успішного завершення замовлення.
     */
    record OrderCompletionCompleted(
            String orderNumber,
            String receiptNumber,
            LocalDateTime completedAt,
            double finalAmount
    ) implements ConfirmationEvents {}

    /**
     * Подія помилки завершення замовлення.
     */
    record OrderCompletionFailed(
            String errorMessage,
            String errorCode,
            Exception exception
    ) implements ConfirmationEvents {}

    /**
     * Подія запиту навігації.
     */
    record NavigationRequested(
            NavigationType navigationType,
            String targetDestination,
            ConfirmationState currentState
    ) implements ConfirmationEvents {}

    /**
     * Подія помилки підтвердження.
     */
    record ConfirmationError(
            String operation,
            String errorMessage,
            Exception exception,
            String errorCode
    ) implements ConfirmationEvents {}

    /**
     * Подія початку операції.
     */
    record LoadingStarted(
            String operation,
            String description
    ) implements ConfirmationEvents {}

    /**
     * Подія завершення операції.
     */
    record LoadingCompleted(
            String operation,
            boolean success,
            String message
    ) implements ConfirmationEvents {}

    /**
     * Подія зміни UI стану.
     */
    record UIStateChanged(
            boolean isLoading,
            boolean hasError,
            String statusMessage,
            boolean canCompleteOrder,
            boolean canSendEmail,
            boolean isReceiptGenerated
    ) implements ConfirmationEvents {}

    /**
     * Подія відображення попереджень валідації.
     */
    record ValidationWarningsDisplayed(
            Set<String> warnings,
            String recommendedAction
    ) implements ConfirmationEvents {}

    /**
     * Подія оновлення прогресу.
     */
    record ProgressUpdated(
            String currentStep,
            int percentage,
            String statusText
    ) implements ConfirmationEvents {}

    /**
     * Enum для типів навігації.
     */
    enum NavigationType {
        PREVIOUS("Повернення до попереднього етапу"),
        CANCEL("Скасування замовлення"),
        COMPLETE("Завершення замовлення"),
        VIEW_RECEIPT("Перегляд квитанції");

        private final String description;

        NavigationType(String description) {
            this.description = description;
        }

        public String getDescription() { return description; }
    }

    // Допоміжні методи для створення подій

    static ConfirmationInitialized confirmationInitialized(ConfirmationState state, OrderWizardData data, String sessionId) {
        return new ConfirmationInitialized(state, data, sessionId, LocalDateTime.now());
    }

    static ConfirmationStateUpdated stateUpdated(ConfirmationState state, String reason, String property) {
        return new ConfirmationStateUpdated(state, reason, property);
    }

    static OrderValidationCompleted validationCompleted(boolean valid, Set<String> errors, Set<String> warnings, int items, double total) {
        return new OrderValidationCompleted(valid, errors, warnings, items, total);
    }

    static AgreementStatusChanged agreementChanged(boolean accepted, boolean canProceed) {
        return new AgreementStatusChanged(accepted, LocalDateTime.now(), canProceed);
    }

    static ReceiptGenerationRequested receiptRequested(OrderWizardData data, String receiptNumber, String format) {
        return new ReceiptGenerationRequested(data, receiptNumber, format);
    }

    static ReceiptGenerationCompleted receiptCompleted(byte[] bytes, String fileName, String format, long size) {
        return new ReceiptGenerationCompleted(bytes, fileName, format, size, LocalDateTime.now());
    }

    static ReceiptGenerationFailed receiptFailed(String message, String code, Exception ex) {
        return new ReceiptGenerationFailed(message, code, ex);
    }

    static EmailSendingRequested emailRequested(String email, String name, String receiptNumber, byte[] attachment) {
        return new EmailSendingRequested(email, name, receiptNumber, attachment);
    }

    static EmailSendingCompleted emailCompleted(String email, String messageId) {
        return new EmailSendingCompleted(email, LocalDateTime.now(), messageId);
    }

    static EmailSendingFailed emailFailed(String email, String message, Exception ex) {
        return new EmailSendingFailed(email, message, ex);
    }

    static OrderCompletionRequested orderRequested(OrderWizardData data, ConfirmationState state, boolean hasReceipt) {
        return new OrderCompletionRequested(data, state, hasReceipt);
    }

    static OrderCompletionCompleted orderCompleted(String orderNumber, String receiptNumber, double amount) {
        return new OrderCompletionCompleted(orderNumber, receiptNumber, LocalDateTime.now(), amount);
    }

    static OrderCompletionFailed orderFailed(String message, String code, Exception ex) {
        return new OrderCompletionFailed(message, code, ex);
    }

    static NavigationRequested navigationRequested(NavigationType type, String target, ConfirmationState state) {
        return new NavigationRequested(type, target, state);
    }

    static ConfirmationError error(String operation, String message, Exception ex, String code) {
        return new ConfirmationError(operation, message, ex, code);
    }

    static LoadingStarted loadingStarted(String operation, String description) {
        return new LoadingStarted(operation, description);
    }

    static LoadingCompleted loadingCompleted(String operation, boolean success, String message) {
        return new LoadingCompleted(operation, success, message);
    }

    static UIStateChanged uiStateChanged(boolean loading, boolean error, String status, boolean canComplete, boolean canEmail, boolean hasReceipt) {
        return new UIStateChanged(loading, error, status, canComplete, canEmail, hasReceipt);
    }

    static ValidationWarningsDisplayed warningsDisplayed(Set<String> warnings, String action) {
        return new ValidationWarningsDisplayed(warnings, action);
    }

    static ProgressUpdated progressUpdated(String step, int percentage, String status) {
        return new ProgressUpdated(step, percentage, status);
    }
}
