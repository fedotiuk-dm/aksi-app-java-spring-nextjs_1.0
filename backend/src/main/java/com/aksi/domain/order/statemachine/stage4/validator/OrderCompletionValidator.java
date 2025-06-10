package com.aksi.domain.order.statemachine.stage4.validator;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage4.dto.OrderCompletionDTO;

/**
 * Валідатор для завершення замовлення Stage4.
 * Перевіряє готовність до завершення замовлення та валідність фіналізації.
 */
@Component
public class OrderCompletionValidator {

    /**
     * Валідує дані завершення замовлення.
     *
     * @param completionDTO DTO завершення замовлення
     * @return результат валідації
     */
    public ValidationResult validate(OrderCompletionDTO completionDTO) {
        if (completionDTO == null) {
            return ValidationResult.withError("Дані завершення замовлення відсутні");
        }

        ValidationResult result = new ValidationResult();

        // Перевірка базових полів
        validateBasicFields(completionDTO, result);

        // Перевірка запиту на фіналізацію
        validateFinalizationRequest(completionDTO, result);

        // Перевірка статусу завершення
        validateCompletionStatus(completionDTO, result);

        return result;
    }

    /**
     * Валідує базові поля DTO.
     *
     * @param completionDTO DTO завершення замовлення
     * @param result результат валідації
     */
    private void validateBasicFields(OrderCompletionDTO completionDTO, ValidationResult result) {
        if (completionDTO.getSessionId() == null) {
            result.addError("ID сесії обов'язковий");
        }

        if (completionDTO.getCurrentState() == null) {
            result.addError("Поточний стан обов'язковий");
        }
    }

    /**
     * Валідує запит на фіналізацію замовлення.
     *
     * @param completionDTO DTO завершення замовлення
     * @param result результат валідації
     */
    private void validateFinalizationRequest(OrderCompletionDTO completionDTO, ValidationResult result) {
        if (completionDTO.getFinalizationRequest() == null) {
            result.addError("Запит на фіналізацію замовлення відсутній");
            return;
        }

        var finalizationRequest = completionDTO.getFinalizationRequest();

        if (finalizationRequest.getOrderId() == null) {
            result.addError("ID замовлення в запиті на фіналізацію відсутній");
        }

        if (!finalizationRequest.getTermsAccepted()) {
            result.addError("Умови надання послуг не прийняті");
        }

        if (finalizationRequest.getSignatureData() == null ||
            finalizationRequest.getSignatureData().trim().isEmpty()) {
            result.addError("Підпис клієнта відсутній");
        } else {
            validateSignatureData(finalizationRequest.getSignatureData(), result);
        }

        // Перевірка опцій генерації квитанції
        if (!finalizationRequest.getGeneratePrintableReceipt() &&
            !finalizationRequest.getSendReceiptByEmail()) {
            result.addWarning("Не вибрано жодного способу видачі квитанції");
        }
    }

    /**
     * Валідує статус завершення замовлення.
     *
     * @param completionDTO DTO завершення замовлення
     * @param result результат валідації
     */
    private void validateCompletionStatus(OrderCompletionDTO completionDTO, ValidationResult result) {
        if (completionDTO.getWizardCompleted()) {
            if (!completionDTO.getOrderProcessed()) {
                result.addError("Wizard завершений, але замовлення не оброблене");
            }

            if (!completionDTO.getOrderSaved()) {
                result.addError("Wizard завершений, але замовлення не збережене");
            }

            if (completionDTO.getCreatedOrderNumber() == null ||
                completionDTO.getCreatedOrderNumber().trim().isEmpty()) {
                result.addError("Wizard завершений, але номер замовлення відсутній");
            }

            if (completionDTO.getCompletionTimestamp() == null) {
                result.addWarning("Час завершення замовлення не зафіксований");
            }
        }

        if (completionDTO.getOrderSaved() &&
            (completionDTO.getCreatedOrderNumber() == null ||
             completionDTO.getCreatedOrderNumber().trim().isEmpty())) {
            result.addError("Замовлення збережене, але номер не присвоєний");
        }

        if (completionDTO.getHasValidationErrors()) {
            result.addError("Є невирішені помилки валідації");
        }
    }

    /**
     * Валідує дані підпису.
     *
     * @param signatureData дані підпису в base64
     * @param result результат валідації
     */
    private void validateSignatureData(String signatureData, ValidationResult result) {
        if (signatureData.length() < 100) {
            result.addWarning("Дані підпису здаються занадто короткими");
        }

        // Базова перевірка формату base64
        if (!signatureData.matches("^[A-Za-z0-9+/]*={0,2}$")) {
            result.addError("Дані підпису не відповідають формату base64");
        }
    }
}
