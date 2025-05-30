package com.aksi.ui.wizard.step4.domain;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import com.aksi.ui.wizard.dto.OrderWizardData;

import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

/**
 * Immutable domain model для етапу підтвердження замовлення.
 * Містить бізнес-логіку перевірки готовності до завершення.
 */
@Data
@Builder(toBuilder = true)
@Slf4j
public class ConfirmationState {

    // Константи домену
    public static final String OPERATION_ORDER_VALIDATION = "order_validation";
    public static final String OPERATION_RECEIPT_GENERATION = "receipt_generation";
    public static final String OPERATION_EMAIL_SENDING = "email_sending";
    public static final String OPERATION_ORDER_COMPLETION = "order_completion";

    // Основні дані
    private final OrderWizardData wizardData;
    private final String sessionId;
    private final LocalDateTime createdAt;
    private final LocalDateTime lastModifiedAt;

    // Стан згоди
    private final boolean isAgreementAccepted;
    private final LocalDateTime agreementAcceptedAt;

    // Стан квитанції
    private final boolean isReceiptGenerated;
    private final byte[] generatedReceiptBytes;
    private final String receiptFileName;
    private final LocalDateTime receiptGeneratedAt;

    // Стан email
    private final boolean canSendEmail;
    private final boolean isEmailSent;
    private final LocalDateTime emailSentAt;

    // Стан завершення
    private final boolean canCompleteOrder;
    private final boolean isOrderCompleted;
    private final LocalDateTime orderCompletedAt;

    // Валідація
    private final boolean isValid;
    private final Set<String> validationErrors;
    private final Set<String> warnings;

    // UI стан
    private final boolean isLoading;
    private final String currentOperation;
    private final String statusMessage;

    /**
     * Створює початковий стан підтвердження.
     */
    public static ConfirmationState createInitial(OrderWizardData wizardData, String sessionId) {
        var validationResult = validateWizardData(wizardData);

        return ConfirmationState.builder()
                .wizardData(wizardData)
                .sessionId(sessionId)
                .createdAt(LocalDateTime.now())
                .lastModifiedAt(LocalDateTime.now())
                .isAgreementAccepted(false)
                .isReceiptGenerated(false)
                .canSendEmail(false)
                .isEmailSent(false)
                .canCompleteOrder(false)
                .isOrderCompleted(false)
                .isValid(validationResult.isValid())
                .validationErrors(validationResult.errors())
                .warnings(validationResult.warnings())
                .isLoading(false)
                .build();
    }

    /**
     * Приймає угоду про надання послуг.
     */
    public ConfirmationState acceptAgreement() {
        if (isAgreementAccepted) {
            log.debug("Угоду вже прийнято");
            return this;
        }

        return this.toBuilder()
                .isAgreementAccepted(true)
                .agreementAcceptedAt(LocalDateTime.now())
                .lastModifiedAt(LocalDateTime.now())
                .canCompleteOrder(calculateCanCompleteOrder(true, isReceiptGenerated))
                .build();
    }

    /**
     * Скасовує прийняття угоди.
     */
    public ConfirmationState rejectAgreement() {
        if (!isAgreementAccepted) {
            log.debug("Угоду вже не прийнято");
            return this;
        }

        return this.toBuilder()
                .isAgreementAccepted(false)
                .agreementAcceptedAt(null)
                .lastModifiedAt(LocalDateTime.now())
                .canCompleteOrder(false)
                .build();
    }

    /**
     * Встановлює стан генерації квитанції.
     */
    public ConfirmationState withReceiptGenerated(byte[] receiptBytes, String fileName) {
        if (receiptBytes == null || receiptBytes.length == 0) {
            throw new IllegalArgumentException("Receipt bytes cannot be null or empty");
        }
        if (fileName == null || fileName.trim().isEmpty()) {
            throw new IllegalArgumentException("Receipt file name cannot be null or empty");
        }

        return this.toBuilder()
                .isReceiptGenerated(true)
                .generatedReceiptBytes(receiptBytes)
                .receiptFileName(fileName)
                .receiptGeneratedAt(LocalDateTime.now())
                .lastModifiedAt(LocalDateTime.now())
                .canSendEmail(determineCanSendEmail())
                .canCompleteOrder(calculateCanCompleteOrder(isAgreementAccepted, true))
                .build();
    }

    /**
     * Встановлює стан відправки email.
     */
    public ConfirmationState withEmailSent() {
        if (!canSendEmail) {
            throw new IllegalStateException("Cannot send email: prerequisites not met");
        }

        return this.toBuilder()
                .isEmailSent(true)
                .emailSentAt(LocalDateTime.now())
                .lastModifiedAt(LocalDateTime.now())
                .build();
    }

    /**
     * Встановлює стан завершення замовлення.
     */
    public ConfirmationState completeOrder() {
        if (!canCompleteOrder) {
            throw new IllegalStateException("Cannot complete order: prerequisites not met");
        }

        return this.toBuilder()
                .isOrderCompleted(true)
                .orderCompletedAt(LocalDateTime.now())
                .lastModifiedAt(LocalDateTime.now())
                .build();
    }

    /**
     * Встановлює стан завантаження.
     */
    public ConfirmationState withLoading(boolean loading, String operation) {
        return this.toBuilder()
                .isLoading(loading)
                .currentOperation(operation)
                .lastModifiedAt(LocalDateTime.now())
                .build();
    }

    /**
     * Встановлює повідомлення про статус.
     */
    public ConfirmationState withStatusMessage(String message) {
        return this.toBuilder()
                .statusMessage(message)
                .lastModifiedAt(LocalDateTime.now())
                .build();
    }

    /**
     * Перевіряє готовність до завершення замовлення.
     */
    private boolean calculateCanCompleteOrder(boolean agreementAccepted, boolean receiptGenerated) {
        return agreementAccepted && receiptGenerated && isValid;
    }

    /**
     * Визначає можливість відправки email.
     */
    private boolean determineCanSendEmail() {
        if (!isReceiptGenerated) {
            return false;
        }

        if (wizardData == null || wizardData.getSelectedClient() == null) {
            return false;
        }

        var client = wizardData.getSelectedClient();
        return client.getEmail() != null && !client.getEmail().trim().isEmpty();
    }

    /**
     * Валідує дані wizard'а.
     */
    private static ValidationResult validateWizardData(OrderWizardData wizardData) {
        var errors = new java.util.HashSet<String>();
        var warnings = new java.util.HashSet<String>();

        if (wizardData == null) {
            errors.add("Дані замовлення відсутні");
            return new ValidationResult(false, errors, warnings);
        }

        if (wizardData.getSelectedClient() == null) {
            errors.add("Клієнта не вибрано");
        }

        if (wizardData.getItems() == null || wizardData.getItems().isEmpty()) {
            errors.add("Не додано жодного предмета");
        }

        if (wizardData.getDraftOrder() == null) {
            errors.add("Основна інформація замовлення відсутня");
        } else {
            if (wizardData.getDraftOrder().getReceiptNumber() == null) {
                warnings.add("Номер квитанції не згенеровано");
            }
            if (wizardData.getDraftOrder().getExpectedCompletionDate() == null) {
                warnings.add("Дата виконання не встановлена");
            }
        }

        if (wizardData.getTotalAmount() == null || wizardData.getTotalAmount().doubleValue() <= 0) {
            errors.add("Загальна сума замовлення некоректна");
        }

        return new ValidationResult(errors.isEmpty(), errors, warnings);
    }

    // Геттери для бізнес-логіки

    public boolean hasValidClient() {
        return wizardData != null && wizardData.getSelectedClient() != null;
    }

    public boolean hasItems() {
        return wizardData != null && wizardData.getItems() != null && !wizardData.getItems().isEmpty();
    }

    public boolean hasValidOrder() {
        return wizardData != null && wizardData.getDraftOrder() != null;
    }

    public String getClientEmail() {
        if (!hasValidClient()) return null;
        return wizardData.getSelectedClient().getEmail();
    }

    public String getReceiptNumber() {
        if (!hasValidOrder()) return null;
        return wizardData.getDraftOrder().getReceiptNumber();
    }

    public int getItemsCount() {
        if (!hasItems()) return 0;
        return wizardData.getItems().size();
    }

    public double getTotalAmount() {
        if (wizardData == null || wizardData.getTotalAmount() == null) return 0.0;
        return wizardData.getTotalAmount().doubleValue();
    }

    /**
     * Результат валідації.
     */
    public record ValidationResult(
            boolean isValid,
            Set<String> errors,
            Set<String> warnings
    ) {}
}
