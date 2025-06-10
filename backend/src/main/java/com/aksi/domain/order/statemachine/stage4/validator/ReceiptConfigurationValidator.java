package com.aksi.domain.order.statemachine.stage4.validator;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage4.dto.ReceiptConfigurationDTO;

/**
 * Валідатор для конфігурації генерації квитанції Stage4.
 * Перевіряє готовність до генерації квитанції та валідність згенерованих даних.
 */
@Component
public class ReceiptConfigurationValidator {

    /**
     * Валідує конфігурацію генерації квитанції.
     *
     * @param receiptDTO DTO конфігурації квитанції
     * @return результат валідації
     */
    public ValidationResult validate(ReceiptConfigurationDTO receiptDTO) {
        if (receiptDTO == null) {
            return ValidationResult.withError("Конфігурація генерації квитанції відсутня");
        }

        ValidationResult result = new ValidationResult();

        // Перевірка базових полів
        validateBasicFields(receiptDTO, result);

        // Перевірка запиту на генерацію
        validateGenerationRequest(receiptDTO, result);

        // Перевірка згенерованої квитанції
        validateGeneratedReceipt(receiptDTO, result);

        // Перевірка статусу генерації
        validateGenerationStatus(receiptDTO, result);

        return result;
    }

    /**
     * Валідує базові поля DTO.
     *
     * @param receiptDTO DTO конфігурації квитанції
     * @param result результат валідації
     */
    private void validateBasicFields(ReceiptConfigurationDTO receiptDTO, ValidationResult result) {
        if (receiptDTO.getSessionId() == null) {
            result.addError("ID сесії обов'язковий");
        }

        if (receiptDTO.getCurrentState() == null) {
            result.addError("Поточний стан обов'язковий");
        }
    }

    /**
     * Валідує запит на генерацію квитанції.
     *
     * @param receiptDTO DTO конфігурації квитанції
     * @param result результат валідації
     */
    private void validateGenerationRequest(ReceiptConfigurationDTO receiptDTO, ValidationResult result) {
        if (receiptDTO.getGenerationRequest() == null) {
            result.addError("Запит на генерацію квитанції відсутній");
            return;
        }

        var generationRequest = receiptDTO.getGenerationRequest();

        if (generationRequest.getOrderId() == null) {
            result.addError("ID замовлення в запиті на генерацію відсутній");
        }
    }

    /**
     * Валідує згенеровану квитанцію.
     *
     * @param receiptDTO DTO конфігурації квитанції
     * @param result результат валідації
     */
    private void validateGeneratedReceipt(ReceiptConfigurationDTO receiptDTO, ValidationResult result) {
        if (receiptDTO.getPdfGenerated()) {
            if (receiptDTO.getGeneratedReceipt() == null) {
                result.addError("PDF позначений як згенерований, але дані квитанції відсутні");
                return;
            }

            var generatedReceipt = receiptDTO.getGeneratedReceipt();

            if (generatedReceipt.getOrderId() == null) {
                result.addError("ID замовлення в згенерованій квитанції відсутній");
            }

            if (generatedReceipt.getReceiptNumber() == null || generatedReceipt.getReceiptNumber().trim().isEmpty()) {
                result.addError("Номер квитанції відсутній");
            }

            if (generatedReceipt.getClientInfo() == null) {
                result.addError("Інформація про клієнта в квитанції відсутня");
            }

            if (generatedReceipt.getItems() == null || generatedReceipt.getItems().isEmpty()) {
                result.addError("Список предметів в квитанції порожній");
            }

            if (generatedReceipt.getFinancialInfo() == null) {
                result.addError("Фінансова інформація в квитанції відсутня");
            }

            if (!generatedReceipt.isTermsAccepted()) {
                result.addWarning("Умови не прийняті в квитанції");
            }

            if (generatedReceipt.getCustomerSignatureData() == null ||
                generatedReceipt.getCustomerSignatureData().trim().isEmpty()) {
                result.addWarning("Підпис клієнта відсутній в квитанції");
            }
        }
    }

    /**
     * Валідує статус генерації.
     *
     * @param receiptDTO DTO конфігурації квитанції
     * @param result результат валідації
     */
    private void validateGenerationStatus(ReceiptConfigurationDTO receiptDTO, ValidationResult result) {
        if (receiptDTO.getPdfGenerated()) {
            if (receiptDTO.getPdfFilePath() == null || receiptDTO.getPdfFilePath().trim().isEmpty()) {
                result.addError("PDF згенерований, але шлях до файлу відсутній");
            }

            if (receiptDTO.getGenerationTimestamp() == null) {
                result.addWarning("Час генерації PDF не зафіксований");
            }

            if (!receiptDTO.getReadyForPrint()) {
                result.addWarning("PDF згенерований, але не готовий для друку");
            }
        }

        if (receiptDTO.getEmailSent() && !receiptDTO.getPdfGenerated()) {
            result.addError("Email відправлений, але PDF не згенерований");
        }

        if (receiptDTO.getHasValidationErrors()) {
            result.addError("Є невирішені помилки валідації: " +
                receiptDTO.getValidationMessage());
        }
    }
}
